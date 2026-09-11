/* =========================================================
   missionguard.js — Build 1.3.0 audit harness
   Drives real Chrome over the served repo. Every assertion below is
   executed against the running app, not reasoned about.
   ========================================================= */
const puppeteer = require("puppeteer-core");
const fs = require("fs");
const path = require("path");

const BASE = "http://127.0.0.1:8347/";
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const SHOTS = process.argv[2] || "./shots";

let pass = 0, fail = 0;
const results = [];
function ok(name, cond, detail) {
  if (cond) { pass++; results.push({ r: "PASS", name, detail: detail || "" }); }
  else { fail++; results.push({ r: "FAIL", name, detail: detail || "" }); }
  console.log((cond ? "PASS  " : "FAIL  ") + name + (detail ? "  — " + detail : ""));
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function shot(page, name) {
  fs.mkdirSync(SHOTS, { recursive: true });
  await page.screenshot({ path: path.join(SHOTS, name + ".png") });
}

/* ---------- helpers that drive the app the way a child would ---------- */
async function gotoVerbMission(page, query) {
  await page.goto(BASE + (query || ""), { waitUntil: "networkidle2" });
  await page.click('.mode-btn[data-mode="learn"]');
  await page.waitForSelector("#topic-grid .topic-card");
  await page.click('.topic-card[data-topic="verb"]');
  await sleep(150);
}

async function mstate(page) { return page.evaluate(() => window.SS_MISSION.state()); }
async function nextLabel(page) {
  return page.evaluate(() => {
    const b = document.getElementById("mission-next");
    return { text: b.textContent.trim(), disabled: b.disabled };
  });
}
async function pressNext(page) {
  await page.evaluate(() => document.getElementById("mission-next").click());
  await sleep(120);
}
/* Click a sentence word by its index — never by position on screen and
   never by rendered text, so the test cannot be fooled by layout. */
async function clickWord(page, wi) {
  await page.evaluate(i => {
    const b = document.querySelector('.mi-word-btn[data-wi="' + i + '"]');
    if (b) b.click();
  }, wi);
  await sleep(110);
}
async function feedback(page) {
  return page.evaluate(() => {
    const f = document.getElementById("mi-feedback");
    return f ? { cls: f.className, text: f.textContent.trim() } : null;
  });
}
/* The content file is the source of truth for what the answer is, so
   the harness never hard-codes a target index. */
async function cardContent(page) {
  return page.evaluate(() => {
    const s = window.SS_MISSION.state();
    const c = window.SS_MISSION.cards()[s.pos];
    return {
      kind: c.kind, words: c.words || null, target: c.target || null,
      pickCount: c.pickCount || null, scene: c.scene === undefined ? null : c.scene,
      options: (c.options || []).map(o => o.word), hasWhy: !!c.why
    };
  });
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME, headless: "new",
    args: ["--force-device-scale-factor=1", "--hide-scrollbars", "--mute-audio"]
  });

  /* ========== 1. LOAD INTEGRITY ========== */
  {
    const page = await browser.newPage();
    const errs = [], warns = [];
    page.on("pageerror", e => errs.push(String(e)));
    page.on("console", m => { if (m.type() === "error") warns.push(m.text()); });
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(BASE, { waitUntil: "networkidle2" });
    ok("1.1 no uncaught page errors on load", errs.length === 0, errs.join(" | "));
    const fontErrOnly = warns.every(w => /fonts\.googleapis|fonts\.gstatic|favicon/i.test(w));
    ok("1.2 no console errors (font/favicon network noise allowed)",
      warns.length === 0 || fontErrOnly, warns.join(" | "));

    const globals = await page.evaluate(() => ({
      scenes: !!window.SS_SCENES, mission: !!window.SS_MISSION,
      content: !!window.SS_MISSION_VERB, learn: !!window.SS_LEARN,
      build: window.__sentenceSense.BUILD_NUMBER,
      badge: document.getElementById("build-badge").textContent
    }));
    ok("1.3 all four mission globals present",
      globals.scenes && globals.mission && globals.content && globals.learn);
    ok("1.4 BUILD_NUMBER is Build 1.3.0", globals.build === "Build 1.3.0", globals.build);
    ok("1.5 rendered badge matches", globals.badge === "Sentence Sense — Build 1.3.0", globals.badge);

    /* Nothing may be persisted, in either store. */
    const stores = await page.evaluate(() => ({ l: localStorage.length, s: sessionStorage.length }));
    ok("1.6 localStorage and sessionStorage empty on load", stores.l === 0 && stores.s === 0,
      "local=" + stores.l + " session=" + stores.s);
    await page.close();
  }

  /* ========== 2. ROUTING: VERB -> MISSION, OTHERS UNCHANGED ========== */
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await gotoVerbMission(page);
    let vis = await page.evaluate(() => ({
      mission: !document.getElementById("screen-mission").hidden,
      lesson: !document.getElementById("screen-lesson").hidden
    }));
    ok("2.1 Verb card opens the mission screen", vis.mission && !vis.lesson);

    /* the five other topics must still run the original four-step lesson */
    const others = ["subject", "complete-subject", "predicate", "noun", "adjective"];
    for (const t of others) {
      await page.goto(BASE, { waitUntil: "networkidle2" });
      await page.click('.mode-btn[data-mode="learn"]');
      await page.waitForSelector("#topic-grid .topic-card");
      await page.click('.topic-card[data-topic="' + t + '"]');
      await sleep(120);
      const st = await page.evaluate(() => ({
        lesson: !document.getElementById("screen-lesson").hidden,
        mission: !document.getElementById("screen-mission").hidden,
        heading: document.getElementById("lesson-heading").textContent,
        steps: document.querySelectorAll("#lesson-progress [data-step]").length
      }));
      ok("2.2 " + t + " still runs the four-step lesson",
        st.lesson && !st.mission && st.steps === 4, st.heading);
    }

    /* the classic Verb lesson and its 20-question bank remain reachable */
    await page.goto(BASE + "?verb=classic", { waitUntil: "networkidle2" });
    await page.click('.mode-btn[data-mode="learn"]');
    await page.waitForSelector("#topic-grid .topic-card");
    await page.click('.topic-card[data-topic="verb"]');
    await sleep(120);
    const classic = await page.evaluate(() => ({
      lesson: !document.getElementById("screen-lesson").hidden,
      mission: !document.getElementById("screen-mission").hidden,
      heading: document.getElementById("lesson-heading").textContent
    }));
    ok("2.3 ?verb=classic restores the original Verb lesson",
      classic.lesson && !classic.mission, classic.heading);

    /* walk to Try It and confirm the bank still runs 20 questions */
    for (let i = 0; i < 3; i++) { await page.click("#lesson-next"); await sleep(90); }
    const bank = await page.evaluate(() => window.SS_LEARN.bankState());
    ok("2.4 the 20-question guided bank still loads", bank.total === 20, "total=" + bank.total);
    const hd = await page.evaluate(() => document.getElementById("tryit-count").textContent);
    ok("2.5 bank question counter renders", /Question 1 of 20/.test(hd), hd);
    await page.close();
  }

  /* ========== 3. NO ANSWER LEAKAGE ========== */
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await gotoVerbMission(page);
    await pressNext(page);   // briefing -> WATCH

    let leak = await page.evaluate(() => ({
      marked: document.querySelectorAll("#mission-card .is-marked").length,
      pairs: document.querySelectorAll("#mission-card .mi-pair").length,
      altText: (document.querySelector(".mi-scene") || {}).getAttribute
        ? document.querySelector(".mi-scene").getAttribute("aria-label") : ""
    }));
    ok("3.1 WATCH marks nothing before the reveal", leak.marked === 0 && leak.pairs === 0);
    ok("3.2 WATCH scene description does not contain the verb",
      !/kicked/i.test(leak.altText || ""), leak.altText);

    /* every independent-practice card must have no illustration at all */
    const noScene = await page.evaluate(() => {
      const cards = window.SS_MISSION.cards();
      return cards.filter(c => c.kind === "pick")
        .map(c => ({ t: c.stepTitle, scene: c.scene === undefined ? "MISSING" : c.scene }));
    });
    const solveLike = noScene.filter(c => /Solve it yourself|being verb|verb phrase/i.test(c.t));
    ok("3.3 independent-practice cards carry no scene",
      solveLike.every(c => c.scene === null),
      solveLike.map(c => c.t + "=" + c.scene).join("; "));

    /* a pick card must not mark anything before the child solves it */
    await pressNext(page);           // reveal
    await pressNext(page);           // -> FIND 1
    const pre = await page.evaluate(() => ({
      marked: document.querySelectorAll("#mission-card .is-marked").length,
      buttons: document.querySelectorAll(".mi-word-btn").length
    }));
    ok("3.4 FIND marks nothing before a choice is made", pre.marked === 0);
    ok("3.5 every word in a FIND sentence is a real button", pre.buttons >= 9,
      pre.buttons + " word buttons");
    await page.close();
  }

  /* ========== 4. FULL MISSION WALKTHROUGH, CORRECT PATH ========== */
  {
    const page = await browser.newPage();
    const errs = [];
    page.on("pageerror", e => errs.push(String(e)));
    await page.setViewport({ width: 1440, height: 900 });
    await gotoVerbMission(page);

    const total = (await mstate(page)).total;
    ok("4.1 mission has 12 cards", total === 12, "total=" + total);

    const labels = [];
    let guard = 0;
    while (guard++ < 40) {
      const s = await mstate(page);
      if (s.kind === "done") break;
      const c = await cardContent(page);
      const lab = await nextLabel(page);
      labels.push(lab.text);

      if (c.kind === "briefing") { await pressNext(page); continue; }

      if (c.kind === "reveal") {
        ok("4.R reveal action is named, not a bare Next (" + lab.text + ")",
          !/^next$/i.test(lab.text) && lab.text.length > 0);
        await pressNext(page);                       // performs the reveal
        const after = await page.evaluate(() => ({
          marked: document.querySelectorAll("#mission-card .is-marked").length,
          pair: document.querySelectorAll("#mission-card .mi-pair").length,
          label: (document.querySelector(".mi-word-label") || {}).textContent || ""
        }));
        ok("4.R reveal marks the verb and shows the plain/marked pair",
          after.marked >= 1 && after.pair === 1, "label=" + after.label);
        await pressNext(page);                       // advance
        continue;
      }

      if (c.kind === "pick") {
        for (const t of c.target) await clickWord(page, t);
        const s2 = await mstate(page);
        ok("4.P correct word(s) solve the card (" + c.target.join("+") + ")", s2.solved === true);
        const fb = await feedback(page);
        ok("4.P correct answer still gets a teaching explanation",
          /is-right/.test(fb.cls) && fb.text.length > 20, fb.text.slice(0, 70));
        if (c.hasWhy) {
          const whyN = await page.evaluate(() => document.querySelectorAll(".mi-why-choice").length);
          ok("4.W the explanatory question appears after the verb is found", whyN === 4, whyN + " choices");
          const blocked = await nextLabel(page);
          ok("4.W advance is blocked until the explanation is given", blocked.disabled === true);
          await page.evaluate(() => {
            const cards = window.SS_MISSION.cards();
            const c = cards[window.SS_MISSION.state().pos];
            const ci = c.why.choices.findIndex(x => x.correct);
            document.querySelector('.mi-why-choice[data-ci="' + ci + '"]').click();
          });
          await sleep(120);
          ok("4.W correct explanation unlocks the advance",
            (await nextLabel(page)).disabled === false);
        }
        await pressNext(page);
        continue;
      }

      if (c.kind === "swap") {
        const one = await nextLabel(page);
        ok("4.S swap starts locked until a verb is tried", one.disabled === true);
        await page.evaluate(() => document.querySelectorAll(".mi-swap-opt")[0].click());
        await sleep(120);
        const half = await nextLabel(page);
        const sceneA = await page.evaluate(() =>
          (document.querySelector(".mi-scene") || {}).getAttribute ?
            document.querySelector(".mi-scene").getAttribute("aria-label") : "");
        ok("4.S still locked after only one verb is tried", half.disabled === true);
        await page.evaluate(() => document.querySelectorAll(".mi-swap-opt")[1].click());
        await sleep(120);
        const sceneB = await page.evaluate(() =>
          document.querySelector(".mi-scene").getAttribute("aria-label"));
        ok("4.S the illustration changes with the verb", sceneA !== sceneB && !!sceneA && !!sceneB);
        const both = await nextLabel(page);
        ok("4.S advance unlocks once both verbs are tried", both.disabled === false);
        const fb = await feedback(page);
        ok("4.S the cause-and-effect insight appears after both", /One word changed|decides what happens/.test(fb.text), fb.text.slice(0, 80));
        await pressNext(page);
        continue;
      }
      break;
    }
    const fin = await mstate(page);
    ok("4.2 the mission reaches completion", fin.kind === "done", "kind=" + fin.kind);
    ok("4.3 no button is labelled a bare 'Next' anywhere in the run",
      labels.every(l => !/^next$/i.test(l)), labels.join(" | "));

    const done = await page.evaluate(() => ({
      text: document.getElementById("mission-card").textContent,
      buttons: Array.from(document.querySelectorAll(".mi-done-buttons button")).map(b => b.textContent.trim()),
      controlsHidden: document.getElementById("mission-controls").hidden
    }));
    ok("4.4 completion does not claim mastery",
      !/master|mastered|expert|perfect/i.test(done.text), "");
    ok("4.5 completion has no score, percentage or streak",
      !/\d+\s*\/\s*\d+|\d+%|streak|points|score/i.test(done.text));
    ok("4.6 completion offers the Study Guide and a replay",
      done.buttons.some(b => /Study Guide/i.test(b)) && done.buttons.some(b => /again/i.test(b)),
      done.buttons.join(", "));
    ok("4.7 the primary control row is hidden on completion", done.controlsHidden === true);
    ok("4.8 no page errors across the whole walkthrough", errs.length === 0, errs.join(" | "));

    const stores = await page.evaluate(() => ({ l: localStorage.length, s: sessionStorage.length }));
    ok("4.9 still nothing persisted after a full run", stores.l === 0 && stores.s === 0);
    await page.close();
  }

  /* ========== 5. WRONG-ANSWER ESCALATION ========== */
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await gotoVerbMission(page);
    await pressNext(page); await pressNext(page); await pressNext(page);  // into FIND 1

    const c = await cardContent(page);
    const wrongs = c.words.map((w, i) => i).filter(i => c.target.indexOf(i) === -1);

    await clickWord(page, wrongs[0]);
    let fb = await feedback(page);
    ok("5.1 first wrong answer explains that word and redirects",
      /is-wrong/.test(fb.cls) && /another look|Have another look/i.test(fb.text), fb.text.slice(0, 80));
    ok("5.2 first wrong answer does NOT reveal the verb",
      (await page.evaluate(() => document.querySelectorAll(".mi-word.is-marked").length)) === 0);

    await clickWord(page, wrongs[1]);
    fb = await feedback(page);
    ok("5.3 second wrong answer gives the strategy clue",
      /Ask yourself/i.test(fb.text), fb.text.slice(0, 90));
    ok("5.4 second wrong answer still does not reveal the verb",
      (await page.evaluate(() => document.querySelectorAll(".mi-word.is-marked").length)) === 0);

    await clickWord(page, wrongs[2]);
    fb = await feedback(page);
    const st = await mstate(page);
    ok("5.5 third wrong answer models the reasoning instead of trapping",
      /is-model/.test(fb.cls) && /find it together/i.test(fb.text), fb.text.slice(0, 90));
    ok("5.6 third wrong answer marks the verb and unlocks the advance",
      st.solved === true && (await nextLabel(page)).disabled === false);
    ok("5.7 a ruled-out word is disabled and struck through, not just recoloured",
      await page.evaluate(() => {
        const b = document.querySelector(".mi-word-btn.is-wrong");
        if (!b) return true;   // all locked after the reveal
        return b.disabled && getComputedStyle(b).textDecorationLine.includes("line-through");
      }));
    ok("5.8 feedback never reads as a bare 'Wrong, try again'",
      !/^wrong/i.test(fb.text) && fb.text.length > 25);

    /* the sentence must remain on screen while the child is corrected */
    ok("5.9 the sentence stays visible while feedback shows",
      await page.evaluate(() => !!document.querySelector(".mi-sentence")));
    await page.close();
  }

  /* ========== 6. TWO-WORD VERB PHRASE ========== */
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await gotoVerbMission(page);
    /* Walk the mission properly until the verb-phrase card, solving each
       card on the way exactly as a child would. Force-advancing by
       re-enabling the button skips the state the card depends on. */
    let c = await cardContent(page), hops = 0;
    while (hops++ < 30 && !(c.kind === "pick" && c.pickCount === 2)) {
      if (c.kind === "reveal") { await pressNext(page); await pressNext(page); }
      else if (c.kind === "pick") {
        for (const t of c.target) await clickWord(page, t);
        if (c.hasWhy) {
          await page.evaluate(() => {
            const cc = window.SS_MISSION.cards()[window.SS_MISSION.state().pos];
            const ci = cc.why.choices.findIndex(x => x.correct);
            document.querySelector('.mi-why-choice[data-ci="' + ci + '"]').click();
          });
          await sleep(110);
        }
        await pressNext(page);
      } else if (c.kind === "swap") {
        await page.evaluate(() => document.querySelectorAll(".mi-swap-opt")[0].click()); await sleep(100);
        await page.evaluate(() => document.querySelectorAll(".mi-swap-opt")[1].click()); await sleep(100);
        await pressNext(page);
      } else { await pressNext(page); }
      c = await cardContent(page);
    }
    ok("6.1 reached the verb-phrase card", c.pickCount === 2, "pickCount=" + c.pickCount);

    const prompt = await page.evaluate(() => document.querySelector(".mi-prompt").textContent);
    ok("6.2 the prompt asks for BOTH words, never ambiguously for 'the verb'",
      /BOTH/.test(prompt) && /verb phrase/i.test(prompt), prompt.trim().slice(0, 90));

    /* the phrase must have been taught on an earlier card */
    const taught = await page.evaluate(() => {
      const cards = window.SS_MISSION.cards();
      const pos = window.SS_MISSION.state().pos;
      return cards.slice(0, pos).some(x =>
        x.kind === "reveal" && x.verbType === "phrase" && /verb phrase/i.test(x.because || ""));
    });
    ok("6.3 the verb phrase is TAUGHT before it is assessed", taught === true);

    await clickWord(page, c.target[1]);   // main verb only — a partial answer
    let s = await mstate(page);
    let fb = await feedback(page);
    ok("6.4 one word of two is progress, not an error",
      s.solved === false && s.attempts === 0 && /is-part/.test(fb.cls), fb.cls);
    ok("6.5 the partial answer invites the second word", /One more word/i.test(fb.text), fb.text.slice(0, 80));
    const cnt = await page.evaluate(() => (document.querySelector(".mi-pickcount") || {}).textContent || "");
    ok("6.6 a visible count shows how many words are chosen", /1 \/ 2/.test(cnt), cnt.trim());

    await clickWord(page, c.target[0]);   // helping verb completes it
    s = await mstate(page);
    fb = await feedback(page);
    ok("6.7 both words complete the card", s.solved === true);
    ok("6.8 the explanation names the helping verb and the main verb",
      /helping verb/i.test(fb.text) && /action/i.test(fb.text), fb.text.slice(0, 110));
    const oneLabel = await page.evaluate(() => ({
      labels: document.querySelectorAll("#mission-card .mi-word-label").length,
      phrase: document.querySelectorAll(".mi-phrase-words").length,
      text: (document.querySelector(".mi-word-label") || {}).textContent
    }));
    ok("6.9 the phrase is drawn as ONE verb with ONE label",
      oneLabel.labels === 1 && oneLabel.phrase === 1 && oneLabel.text === "VERB PHRASE",
      JSON.stringify(oneLabel));
    await page.close();
  }

  /* ========== 7. KEYBOARD + FOCUS ========== */
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await gotoVerbMission(page);
    await pressNext(page); await pressNext(page); await pressNext(page);   // FIND 1

    const focusAfterEnter = await page.evaluate(() => document.activeElement.id);
    ok("7.1 entering a card moves focus to its heading",
      focusAfterEnter === "mission-heading", focusAfterEnter);

    /* tab forward and confirm the sentence words are reachable */
    let reachedWord = false, ring = false, seen = [];
    for (let i = 0; i < 26; i++) {
      await page.keyboard.press("Tab");
      const a = await page.evaluate(() => {
        const e = document.activeElement;
        const cs = getComputedStyle(e);
        return { cls: e.className || "", tag: e.tagName, shadow: cs.boxShadow };
      });
      seen.push(a.tag + "." + String(a.cls).split(" ")[0]);
      if (/mi-word-btn/.test(a.cls)) {
        reachedWord = true;
        ring = a.shadow && a.shadow !== "none";
        break;
      }
    }
    ok("7.2 sentence words are reachable by Tab", reachedWord, seen.join(" > "));
    ok("7.3 the focused word shows a visible focus ring", ring === true);

    /* solve it from the keyboard alone */
    const c = await cardContent(page);
    await page.evaluate(i => document.querySelector('.mi-word-btn[data-wi="' + i + '"]').focus(), c.target[0]);
    await page.keyboard.press("Enter");
    await sleep(130);
    ok("7.4 a word can be chosen with Enter", (await mstate(page)).solved === true);
    const movedTo = await page.evaluate(() => document.activeElement.id);
    ok("7.5 focus moves to the primary action after a correct answer",
      movedTo === "mission-next", movedTo);

    /* a wrong answer must not drop focus to <body> */
    await page.evaluate(() => { window.SS_MISSION.start(); });
    await sleep(120);
    await pressNext(page); await pressNext(page); await pressNext(page);
    const c2 = await cardContent(page);
    const wrong = c2.words.map((w, i) => i).filter(i => c2.target.indexOf(i) === -1)[0];
    await clickWord(page, wrong);
    const afterWrong = await page.evaluate(() => document.activeElement.tagName + "." + (document.activeElement.className || ""));
    ok("7.6 a wrong answer keeps focus on a word the child can still try",
      /mi-word-btn/.test(afterWrong), afterWrong);
    await page.close();
  }

  /* ========== 8. STUDY GUIDE FROM THE MISSION ========== */
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await gotoVerbMission(page);
    await page.click("#mission-guide");
    await sleep(160);
    let g = await page.evaluate(() => ({
      open: !document.getElementById("guide-overlay").hidden,
      title: document.getElementById("guide-title").textContent,
      focus: document.activeElement.id,
      sections: document.querySelectorAll("#guide-body .guide-section").length
    }));
    ok("8.1 Study Guide opens from the mission header", g.open === true);
    ok("8.2 it is the Verb guide, with its sections", /Verb Study Guide/.test(g.title) && g.sections >= 8,
      g.title + " / " + g.sections + " sections");
    ok("8.3 focus moves into the dialog", g.focus === "guide-title", g.focus);

    /* forward and reverse focus trap */
    let escaped = false;
    for (let i = 0; i < 14; i++) {
      await page.keyboard.press("Tab");
      if (!(await page.evaluate(() => document.getElementById("guide-panel").contains(document.activeElement)))) { escaped = true; break; }
    }
    ok("8.4 Tab cannot leave the dialog", !escaped);
    escaped = false;
    for (let i = 0; i < 14; i++) {
      await page.keyboard.down("Shift"); await page.keyboard.press("Tab"); await page.keyboard.up("Shift");
      if (!(await page.evaluate(() => document.getElementById("guide-panel").contains(document.activeElement)))) { escaped = true; break; }
    }
    ok("8.5 Shift+Tab cannot leave the dialog", !escaped);

    await page.keyboard.press("Escape");
    await sleep(140);
    g = await page.evaluate(() => ({
      open: !document.getElementById("guide-overlay").hidden,
      focus: document.activeElement.id
    }));
    ok("8.6 Escape closes the guide", g.open === false);
    ok("8.7 focus returns to the Study Guide button", g.focus === "mission-guide", g.focus);

    /* Escape on the mission itself steps back to the topic list */
    await page.keyboard.press("Escape");
    await sleep(140);
    ok("8.8 Escape on the mission returns to the topic list",
      await page.evaluate(() => !document.getElementById("screen-topics").hidden));
    await page.close();
  }

  /* ========== 9. READ ALOUD ========== */
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    /* record every utterance instead of speaking it */
    /* window.speechSynthesis is a getter-only property, so a plain
       assignment silently fails and the real API keeps running. It has
       to be replaced with defineProperty. */
    await page.evaluateOnNewDocument(() => {
      window.__spoken = [];
      window.__cancelled = 0;
      Object.defineProperty(window, "speechSynthesis", {
        configurable: true,
        get: () => ({
          speak: u => { window.__spoken.push(u.text); },
          cancel: () => { window.__cancelled += 1; },
          speaking: false
        })
      });
    });
    await gotoVerbMission(page);
    await pressNext(page);
    let spoken = await page.evaluate(() => window.__spoken.slice());
    ok("9.1 read-aloud never autoplays", spoken.length === 0, JSON.stringify(spoken));

    const hasBtn = await page.evaluate(() => !!document.querySelector(".mi-speak"));
    ok("9.2 the read-aloud control is offered", hasBtn === true);

    await page.click(".mi-speak");
    await sleep(120);
    spoken = await page.evaluate(() => window.__spoken.slice());
    ok("9.3 pressing it speaks exactly one utterance", spoken.length === 1, JSON.stringify(spoken));
    ok("9.4 it speaks the plain sentence only — no label, no answer marker",
      spoken[0] === "The determined player kicked the muddy ball across the field." , spoken[0]);
    ok("9.5 the spoken text contains no mark or label text",
      !/VERB|READ IT|SEE HOW/i.test(spoken[0]));

    await page.evaluate(() => window.SS_SHELL.goHome());
    await sleep(120);
    ok("9.6 leaving the screen cancels speech",
      (await page.evaluate(() => window.__cancelled || 0)) > 0);
    await page.close();
  }

  /* ========== 10. REDUCED MOTION ========== */
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
    await gotoVerbMission(page);
    await pressNext(page);            // WATCH
    await pressNext(page);            // reveal
    const rm = await page.evaluate(() => {
      const fig = document.querySelector(".mi-scene.is-animated");
      const leg = document.querySelector(".sc-leg");
      const trail = document.querySelector(".sc-trail");
      return {
        replay: !!document.querySelector(".mi-replay"),
        playing: fig ? fig.classList.contains("is-playing") : null,
        legAnim: leg ? getComputedStyle(leg).animationName : null,
        trailShown: trail ? getComputedStyle(trail).display : null,
        marked: document.querySelectorAll(".mi-word.is-marked").length,
        explain: document.getElementById("mi-feedback").textContent.length
      };
    });
    ok("10.1 no replay button is offered under reduced motion", rm.replay === false);
    ok("10.2 the kick animation does not run", rm.legAnim === "none" || rm.playing === false,
      "animationName=" + rm.legAnim);
    ok("10.3 the motion trail is hidden", rm.trailShown === "none", rm.trailShown);
    ok("10.4 the reveal still works with no motion at all",
      rm.marked >= 1 && rm.explain > 20);

    /* and the whole mission must still be completable */
    let guard = 0, reached = false;
    while (guard++ < 40) {
      const s = await mstate(page);
      if (s.kind === "done") { reached = true; break; }
      const c = await cardContent(page);
      if (c.kind === "reveal") { await pressNext(page); await pressNext(page); continue; }
      if (c.kind === "pick") {
        for (const t of c.target) await clickWord(page, t);
        if (c.hasWhy) {
          await page.evaluate(() => {
            const cc = window.SS_MISSION.cards()[window.SS_MISSION.state().pos];
            const ci = cc.why.choices.findIndex(x => x.correct);
            document.querySelector('.mi-why-choice[data-ci="' + ci + '"]').click();
          });
          await sleep(110);
        }
        await pressNext(page); continue;
      }
      if (c.kind === "swap") {
        await page.evaluate(() => document.querySelectorAll(".mi-swap-opt")[0].click()); await sleep(100);
        await page.evaluate(() => document.querySelectorAll(".mi-swap-opt")[1].click()); await sleep(100);
        await pressNext(page); continue;
      }
      await pressNext(page);
    }
    ok("10.5 the mission is completable with reduced motion", reached === true);
    await page.close();
  }

  /* ========== 11. BACK / REPLAY / RESTART ========== */
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await gotoVerbMission(page);
    ok("11.1 Back is disabled on the first card",
      await page.evaluate(() => document.getElementById("mission-prev").disabled));
    await pressNext(page); await pressNext(page); await pressNext(page);
    const c = await cardContent(page);
    await clickWord(page, c.target[0]);
    ok("11.2 card solved before stepping back", (await mstate(page)).solved === true);
    await page.click("#mission-prev");
    await sleep(140);
    let s = await mstate(page);
    ok("11.3 Back steps to the previous card", s.pos === 1, "pos=" + s.pos);
    ok("11.4 stepping back clears that card's interaction state",
      s.solved === false && s.revealed === false && s.picked.length === 0, JSON.stringify(s));
    await page.click("#mission-prev"); await sleep(120);
    s = await mstate(page);
    ok("11.5 Back reaches the first card and stops there",
      s.pos === 0 && (await page.evaluate(() => document.getElementById("mission-prev").disabled)),
      "pos=" + s.pos);
    /* with Back disabled, the two always-present exits must work */
    await page.click("#mission-topics"); await sleep(140);
    ok("11.6 All Topics exits the mission from the first card",
      await page.evaluate(() => !document.getElementById("screen-topics").hidden));
    await page.click('.topic-card[data-topic="verb"]'); await sleep(140);
    ok("11.7 re-entering Verb restarts the case at card 1",
      (await mstate(page)).pos === 0);
    await page.click("#mission-home"); await sleep(140);
    ok("11.8 Home exits the mission",
      await page.evaluate(() => !document.getElementById("screen-home").hidden));
    await page.close();
  }

  /* ========== 12. RESPONSIVE MATRIX ========== */
  {
    const VIEWPORTS = [
      ["desktop-2560x1440", 2560, 1440], ["desktop-1920x1080", 1920, 1080],
      ["desktop-1600x900", 1600, 900], ["desktop-1440x900", 1440, 900],
      ["laptop-1366x768", 1366, 768], ["laptop-1280x720", 1280, 720],
      ["laptop-1600x720-short", 1600, 720], ["tablet-820x1180", 820, 1180],
      ["tablet-1024x768", 1024, 768], ["phone-430x932", 430, 932],
      ["phone-390x844", 390, 844], ["phone-375x667", 375, 667],
      ["phone-360x640", 360, 640], ["phone-landscape-844x390", 844, 390]
    ];
    const page = await browser.newPage();
    const rows = [];
    let overflowFails = 0, falseBottoms = 0, nearFold = 0, belowFold = 0;

    for (const [name, w, h] of VIEWPORTS) {
      await page.setViewport({ width: w, height: h });
      await gotoVerbMission(page);
      /* sample four representative card shapes */
      const stops = [
        ["briefing", 0], ["watch-revealed", 1], ["find-pick", 2], ["swap", 4]
      ];
      for (const [label, idx] of stops) {
        await page.evaluate(() => window.SS_MISSION.start());
        await sleep(60);
        for (let i = 0; i < idx; i++) {
          const cc = await cardContent(page);
          if (cc.kind === "reveal") { await pressNext(page); }
          await pressNext(page);
        }
        if (label === "watch-revealed") { await pressNext(page); }
        await sleep(80);

        const m = await page.evaluate(() => {
          const doc = document.documentElement;
          const next = document.getElementById("mission-next");
          const r = next.getBoundingClientRect();
          const vh = window.innerHeight;
          const sentence = document.querySelector(".mi-sentence");
          const sr = sentence ? sentence.getBoundingClientRect() : null;
          /* is there visible continuation at the fold? a page that looks
             finished but is not is the D-27 failure mode */
          let continuation = false;
          const marks = [".mission-card", ".mi-feedback", ".mi-prompt", ".mi-sentence", ".mi-swap-opts"];
          marks.forEach(sel => {
            document.querySelectorAll(sel).forEach(n => {
              const b = n.getBoundingClientRect();
              if (b.top < vh && b.bottom > vh) continuation = true;
            });
          });
          return {
            overflowX: doc.scrollWidth - doc.clientWidth,
            scrollH: doc.scrollHeight, vh,
            nextTop: Math.round(r.top), nextBottom: Math.round(r.bottom),
            pxBelowFold: Math.max(0, Math.round(r.bottom - vh)),
            continuation,
            sentenceRows: sr ? new Set(Array.from(sentence.querySelectorAll(".mi-word"))
              .map(n => Math.round(n.getBoundingClientRect().bottom))).size : 0,
            sentenceFont: sentence ? getComputedStyle(sentence).fontSize : null,
            headerToRail: (function () {
              const hd = document.querySelector(".header-mission");
              const rail = document.querySelector(".mission-rail");
              if (!hd || !rail) return null;
              return Math.round(rail.getBoundingClientRect().top - hd.getBoundingClientRect().bottom);
            })()
          };
        });
        if (m.overflowX > 0) overflowFails++;
        if (m.pxBelowFold > 0) {
          belowFold++;
          if (!m.continuation) falseBottoms++;
          if (m.pxBelowFold <= 40) nearFold++;
        }
        rows.push({ viewport: name, w, h, card: label, ...m });
      }
    }
    ok("12.1 zero horizontal overflow at every viewport", overflowFails === 0,
      overflowFails + " overflowing samples");
    ok("12.2 zero false-bottom states (a page never looks finished when it is not)",
      falseBottoms === 0, falseBottoms + " false bottoms of " + belowFold + " below-fold samples");
    const gaps = rows.map(r => r.headerToRail).filter(g => g !== null);
    const gapConst = new Set(gaps).size;
    ok("12.3 header-to-rail gap is constant and <= 60px (handoff 12b)",
      gapConst === 1 && gaps[0] <= 60, "values=" + Array.from(new Set(gaps)).join(",") + "px");
    const wideSamples = rows.filter(r => r.w >= 1024 && r.h >= 600);
    const wideHidden = wideSamples.filter(r => r.pxBelowFold > 0);
    ok("12.4 the primary action is in view on every desktop/laptop sample",
      wideHidden.length === 0,
      wideHidden.map(r => r.viewport + "/" + r.card + " +" + r.pxBelowFold + "px").join("; "));

    /* the non-monotonic check that caught D-28: a WIDER viewport at the
       same height must never become vertically worse */
    const byHeight = {};
    rows.forEach(r => {
      const k = r.h + "|" + r.card;
      byHeight[k] = byHeight[k] || [];
      byHeight[k].push(r);
    });
    let nonMono = [];
    Object.keys(byHeight).forEach(k => {
      const set = byHeight[k].slice().sort((a, b) => a.w - b.w);
      for (let i = 1; i < set.length; i++) {
        if (set[i].scrollH > set[i - 1].scrollH + 8) {
          nonMono.push(k + ": " + set[i - 1].w + "px=" + set[i - 1].scrollH +
            " -> " + set[i].w + "px=" + set[i].scrollH);
        }
      }
    });
    ok("12.5 a wider viewport is never vertically worse at the same height (D-28 class)",
      nonMono.length === 0, nonMono.join(" | "));
    fs.mkdirSync(SHOTS, { recursive: true });
    fs.writeFileSync(path.join(SHOTS, "responsive-matrix.json"), JSON.stringify(rows, null, 1));
    await page.close();
  }

  /* ========== 13. SCREENSHOTS ========== */
  {
    const page = await browser.newPage();
    const SETS = [["desktop", 1440, 900], ["laptop-short", 1366, 768], ["phone", 390, 844]];
    for (const [tag, w, h] of SETS) {
      await page.setViewport({ width: w, height: h });
      await gotoVerbMission(page);
      await shot(page, tag + "-01-briefing");
      await pressNext(page); await sleep(80);
      await shot(page, tag + "-02-watch-before");
      await pressNext(page); await sleep(700);
      await shot(page, tag + "-03-watch-revealed");
      await pressNext(page); await sleep(80);
      await shot(page, tag + "-04-find");
      /* a wrong answer, so the teaching feedback is captured */
      const c = await cardContent(page);
      const wrong = c.words.map((x, i) => i).filter(i => c.target.indexOf(i) === -1)[0];
      await clickWord(page, wrong);
      await shot(page, tag + "-05-find-wrong-feedback");
      for (const t of c.target) await clickWord(page, t);
      await shot(page, tag + "-06-find-correct");
      await pressNext(page); await sleep(80);
      const c2 = await cardContent(page);
      for (const t of c2.target) await clickWord(page, t);
      await pressNext(page); await sleep(100);
      await shot(page, tag + "-07-explore-empty");
      await page.evaluate(() => document.querySelectorAll(".mi-swap-opt")[0].click()); await sleep(120);
      await shot(page, tag + "-08-explore-verb-a");
      await page.evaluate(() => document.querySelectorAll(".mi-swap-opt")[1].click()); await sleep(120);
      await shot(page, tag + "-09-explore-verb-b");
      /* walk on to SOLVE */
      await pressNext(page); await sleep(80);
      await page.evaluate(() => document.querySelectorAll(".mi-swap-opt")[0].click()); await sleep(110);
      await page.evaluate(() => document.querySelectorAll(".mi-swap-opt")[1].click()); await sleep(110);
      await pressNext(page); await sleep(90);
      await shot(page, tag + "-10-solve-no-picture");
      const c3 = await cardContent(page);
      for (const t of c3.target) await clickWord(page, t);
      await sleep(100);
      await shot(page, tag + "-11-solve-why-question");
      await page.evaluate(() => {
        const cc = window.SS_MISSION.cards()[window.SS_MISSION.state().pos];
        const ci = cc.why.choices.findIndex(x => x.correct);
        document.querySelector('.mi-why-choice[data-ci="' + ci + '"]').click();
      });
      await sleep(120);
      await shot(page, tag + "-12-solve-explained");
      await pressNext(page); await sleep(90);
      await shot(page, tag + "-13-extend-being-model");
      await pressNext(page); await sleep(120);
      await shot(page, tag + "-14-extend-being-revealed");
      await pressNext(page); await sleep(90);
      const c4 = await cardContent(page);
      for (const t of c4.target) await clickWord(page, t);
      await sleep(100);
      await shot(page, tag + "-15-extend-being-found");
      await pressNext(page); await sleep(90);
      await pressNext(page); await sleep(120);
      await shot(page, tag + "-16-extend-phrase-taught");
      await pressNext(page); await sleep(90);
      await shot(page, tag + "-17-extend-phrase-question");
      const c5 = await cardContent(page);
      await clickWord(page, c5.target[1]); await sleep(100);
      await shot(page, tag + "-18-extend-phrase-partial");
      await clickWord(page, c5.target[0]); await sleep(100);
      await shot(page, tag + "-19-extend-phrase-complete");
      await pressNext(page); await sleep(500);
      await shot(page, tag + "-20-case-closed");
      await page.click(".mi-done-buttons button"); await sleep(250);
      await shot(page, tag + "-21-study-guide");
    }
    /* reduced motion + the untouched topic screen and a classic lesson */
    await page.setViewport({ width: 1440, height: 900 });
    await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
    await gotoVerbMission(page);
    await pressNext(page); await pressNext(page); await sleep(250);
    await shot(page, "desktop-22-reduced-motion-watch");
    await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }]);
    await page.goto(BASE, { waitUntil: "networkidle2" });
    await shot(page, "desktop-23-home-unchanged");
    await page.click('.mode-btn[data-mode="learn"]'); await sleep(150);
    await shot(page, "desktop-24-topics-unchanged");
    await page.click('.topic-card[data-topic="noun"]'); await sleep(150);
    await shot(page, "desktop-25-noun-lesson-unchanged");
    await page.goto(BASE + "?verb=classic", { waitUntil: "networkidle2" });
    await page.click('.mode-btn[data-mode="learn"]'); await sleep(120);
    await page.click('.topic-card[data-topic="verb"]'); await sleep(120);
    for (let i = 0; i < 3; i++) { await page.click("#lesson-next"); await sleep(90); }
    await shot(page, "desktop-26-classic-verb-bank-still-works");
    await page.close();
  }

  await browser.close();

  console.log("\n================ " + pass + " passed, " + fail + " failed ================");
  fs.writeFileSync(path.join(SHOTS, "results.json"),
    JSON.stringify({ pass, fail, results }, null, 1));
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error("HARNESS ERROR", e); process.exit(2); });
