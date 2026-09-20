/* =========================================================
   Sentence Sense — Build 1.4.0 verification harness

   Replaces missionguard.js, which tested the retired mission.

   Run:
     node verification/serve.js . 8347        # terminal 1
     node verification/guard.js ./out          # terminal 2

   Needs puppeteer-core and a local Chrome. Set CHROME to override the
   executable path and PUPPETEER to override the module location.

   WHAT THIS GUARDS
     1  load integrity and the build number
     2  Home: exactly four skills, no forbidden furniture
     3  the shared Skill screen, all four skills
     4  Verb LEARN, all four states
     5  Verb PRACTICE: 20 questions, 4 stages, both shuffles
     6  feedback escalation and the third-attempt reveal
     7  mission retirement and query-route removal
     8  state leakage between skills and between entries
     9  keyboard, focus and accessibility
    10  the plain -> marked exact-match rule
    11  responsive: 9 viewports, overflow and false bottoms

   HARNESS RULES LEARNED IN EARLIER BUILDS, STILL TRUE
     - Choice buttons are SHUFFLED. Select by dataset.ci, never by
       position and never by rendered text.
     - .ss-words is align-items:flex-end, so a marked chip and a plain
       word have different `top` values on one visual line. Count row
       wraps by BOTTOMS.
     - Do not force-enable an advance button to skip ahead. That skips
       the state the next screen depends on. Walk the product.
   ========================================================= */

const fs = require("fs");
const path = require("path");

const PUPPETEER = process.env.PUPPETEER ||
  "C:/Users/BAZEOC~1/AppData/Local/Temp/claude/C--Sentence-Sense/3b370624-cec1-4853-b29b-30d31abd996d/scratchpad/node_modules/puppeteer-core";
const CHROME = process.env.CHROME ||
  "C:/Program Files/Google/Chrome/Application/chrome.exe";
const BASE = process.env.BASE || "http://127.0.0.1:8347/";
const OUT = path.resolve(process.argv[2] || "./out");
const SHOTS = path.join(OUT, "screenshots");

const puppeteer = require(PUPPETEER);

const results = [];
let passed = 0, failed = 0;

function ok(name, cond, detail) {
  const r = cond ? "PASS" : "FAIL";
  if (cond) passed++; else failed++;
  results.push({ r, name, detail: detail === undefined ? "" : String(detail) });
  console.log(`${r}  ${name}${detail !== undefined && detail !== "" ? "   [" + detail + "]" : ""}`);
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function shot(page, name) {
  fs.mkdirSync(SHOTS, { recursive: true });
  await page.screenshot({ path: path.join(SHOTS, name + ".png"), fullPage: false });
}

/* ---------- navigation helpers: always walk the product ---------- */
async function goHome(page) {
  await page.evaluate(() => window.__sentenceSense.goHome());
  await sleep(60);
}
async function clickStart(page, skill) {
  await page.evaluate(k => {
    const b = Array.from(document.querySelectorAll("#skill-grid .btn-start"))
      .find(x => x.dataset.skill === k);
    b.click();
  }, skill);
  await sleep(80);
}
async function clickActivity(page, key) {
  await page.evaluate(k => {
    /* Only an AVAILABLE activity has a button. An unavailable one is a
       card with a written label and nothing to press. */
    const b = Array.from(document.querySelectorAll("#activity-list .btn-activity"))
      .find(x => x.dataset.activity === k);
    if (!b) throw new Error("no control for activity: " + k);
    b.click();
  }, key);
  await sleep(100);
}
async function visibleScreen(page) {
  return page.evaluate(() =>
    window.__sentenceSense.SCREENS.find(s => {
      const n = document.getElementById("screen-" + s);
      return n && !n.hidden;
    }) || null);
}
/* Answer the current question correctly, by data identity. */
async function answerCorrect(page, choiceSel, dataProbe) {
  const ci = await page.evaluate(dataProbe);
  await page.evaluate((sel, ci) => {
    const b = Array.from(document.querySelectorAll(sel))
      .find(x => Number(x.dataset.ci) === ci);
    b.click();
  }, choiceSel, ci);
  await sleep(70);
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--font-render-hinting=none"]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

  const pageErrors = [], consoleErrors = [], failedRequests = [];
  const OPTIONAL = /sentence-sense-hero/;
  page.on("pageerror", e => pageErrors.push(String(e)));
  page.on("console", m => {
    if (m.type() !== "error") return;
    /* The optional banner photo logs a console 404 as well as a network
       one while no photo has been supplied. Excluded by the URL the
       message points at -- never by message text, which would hide every
       404 in the product. */
    const from = (m.location() && m.location().url) || "";
    if (OPTIONAL.test(from)) return;
    consoleErrors.push(m.text() + (from ? "  <- " + from : ""));
  });
  /* The banner photograph is OPTIONAL BY DESIGN. js/app.js probes for it
     and paints it only if it loads, so while no photo has been supplied
     there is exactly one expected 404 on that path. It is excluded here by
     path -- and only that path -- so a real missing asset still fails.
     Once the photo is supplied this exclusion simply never matches. */
  page.on("requestfailed", r => { if (!OPTIONAL.test(r.url())) failedRequests.push(r.url()); });
  page.on("response", r => {
    if (r.status() >= 400 && !OPTIONAL.test(r.url())) failedRequests.push(r.status() + " " + r.url());
  });

  await page.goto(BASE, { waitUntil: "networkidle0" });
  await sleep(250);

  /* ===== 1. LOAD INTEGRITY ===== */
  ok("1.1 no uncaught page errors on load", pageErrors.length === 0, pageErrors.join(" | "));
  ok("1.2 no console errors on load", consoleErrors.length === 0, consoleErrors.join(" | "));
  ok("1.3 no failed or 404 requests", failedRequests.length === 0, failedRequests.join(" | "));

  const globals = await page.evaluate(() => ({
    build: window.__sentenceSense && window.__sentenceSense.BUILD_NUMBER,
    badge: document.getElementById("build-badge").textContent,
    hasLearn: !!window.SS_LEARN,
    hasPractice: !!window.SS_PRACTICE,
    hasSentence: !!window.SS_SENTENCE,
    hasMission: !!window.SS_MISSION,
    hasScenes: !!window.SS_SCENES,
    hasMissionVerb: !!window.SS_MISSION_VERB,
    local: localStorage.length,
    session: sessionStorage.length,
    fontsLoaded: document.fonts ? document.fonts.status : "n/a"
  }));

  ok("1.4 BUILD_NUMBER is Build 1.4.0", globals.build === "Build 1.4.0", globals.build);
  ok("1.5 rendered badge matches", globals.badge === "Sentence Sense — Build 1.4.0", globals.badge);
  ok("1.6 the three component globals are present",
    globals.hasLearn && globals.hasPractice && globals.hasSentence);
  ok("1.7 localStorage and sessionStorage empty on load",
    globals.local === 0 && globals.session === 0, `local=${globals.local} session=${globals.session}`);
  ok("1.8 webfonts loaded", globals.fontsLoaded === "loaded", globals.fontsLoaded);

  /* ===== 2. HOME ===== */
  const home = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll("#skill-grid .skill-card"));
    const txt = document.getElementById("screen-home").textContent.toLowerCase();
    return {
      count: cards.length,
      names: cards.map(c => c.querySelector(".skill-name").textContent),
      asks: cards.map(c => c.querySelector(".skill-ask").textContent),
      previews: cards.map(c => c.querySelector(".skill-preview-line").textContent.trim()),
      buttons: document.querySelectorAll("#skill-grid .btn-start").length,
      cardIsButton: cards.some(c => c.tagName === "BUTTON" || c.hasAttribute("tabindex") ||
                                    c.getAttribute("role") === "button" || c.onclick),
      title: document.querySelector(".hero-title").textContent,
      sub: document.querySelector(".hero-sub").textContent,
      standards: document.querySelector(".hero-badge").textContent,
      sectionTitle: document.querySelector(".section-title").textContent,
      sectionSub: document.querySelector(".section-sub").textContent,
      quote: document.querySelector(".home-quote .hq-text").textContent,
      quoteInteractive: !!document.querySelector(".home-quote a, .home-quote button, .home-quote [tabindex]"),
      hasBanner: !!document.getElementById("home-hero"),
      hasPhotoLayer: !!document.querySelector(".hero-photo"),
      photoPainted: document.getElementById("home-hero").classList.contains("has-photo"),
      brokenImg: Array.from(document.images).filter(i => i.complete && i.naturalWidth === 0).length,
      text: txt
    };
  });

  ok("2.1 Home shows exactly four skill cards", home.count === 4, home.count);
  ok("2.2 the four skills are Verb, Subject, Noun, Adjective",
    home.names.join(",") === "Verb,Subject,Noun,Adjective", home.names.join(","));
  ok("2.3 primary message is the approved wording",
    home.title === "Build stronger sentences.", home.title);
  ok("2.4 supporting line is the approved wording",
    home.sub === "Choose a skill to start learning.", home.sub);
  ok("2.5 child clues match the brief", home.asks.join(" | ") ===
    "What is happening? | Who or what? | Names a person, place, thing, or idea. | Describes a noun.",
    home.asks.join(" | "));
  ok("2.6 each card carries an example sentence",
    home.previews.every(p => p.length > 0), home.previews.join(" / "));
  ok("2.7 exactly one action button per card", home.buttons === 4, home.buttons);
  ok("2.8 the card itself is not a second control", !home.cardIsButton);
  ok("2.9 a quiet Georgia alignment line is present",
    /aligned with georgia grade 3 ela standards/i.test(home.standards), home.standards);

  const FORBIDDEN = ["achievement", "progress", "settings", "login", "sign in", "profile",
    "avatar", "today's goal", "todays goal", "mission", "points", "coins", "streak",
    "leaderboard", "trophy", "badge earned", "detective"];
  const found = FORBIDDEN.filter(w => home.text.includes(w));
  ok("2.10 Home contains none of the forbidden furniture", found.length === 0, found.join(","));

  ok("2.11 no more than four grammar skills are offered",
    !/complete subject|predicate|pronoun|adverb|preposition/i.test(home.text));

  /* --- the approved reference composition --- */
  ok("2.12 the classroom banner is present", home.hasBanner && home.hasPhotoLayer);
  ok("2.13 no broken image is ever rendered", home.brokenImg === 0,
    home.photoPainted ? "photo supplied and painted" : "no photo yet; designed fallback in use");
  /* The photograph IS supplied as of this build, so the harness now asserts
     it loads rather than merely tolerating its absence. If it is ever
     removed this turns red instead of silently falling back. */
  ok("2.13b the banner photograph loads and is painted", home.photoPainted === true,
    home.photoPainted ? "has-photo applied" : "PHOTO MISSING — fallback in use");
  ok("2.14 the section head matches the reference",
    home.sectionTitle === "Choose a skill" &&
    home.sectionSub === "Build the parts. Create better sentences.",
    home.sectionTitle + " / " + home.sectionSub);
  ok("2.15 the closing quote strip is present",
    /better sentences today/i.test(home.quote), home.quote);
  ok("2.16 the quote strip is decoration, not navigation",
    home.quoteInteractive === false);

  await shot(page, "desktop-01-home");

  /* ===== 3. SHARED SKILL SCREEN, ALL FOUR ===== */
  for (const [key, name, ask] of [
    ["verb", "Verb", "What is happening?"],
    ["subject", "Subject", "Who or what?"],
    ["noun", "Noun", "Names a person, place, thing, or idea."],
    ["adjective", "Adjective", "Describes a noun."]
  ]) {
    await goHome(page);
    await clickStart(page, key);
    const s = await page.evaluate(() => ({
      screen: document.getElementById("screen-skill").hidden ? null : "skill",
      title: document.getElementById("skill-heading").textContent,
      ask: document.getElementById("skill-ask-line").textContent,
      topic: document.getElementById("screen-skill").dataset.topic,
      /* The wordmark is set on two lines, so its textContent carries the
         markup's newline and indentation. Collapse whitespace before
         comparing -- not strip it, which would read "SentenceSense". */
      wordmark: (() => {
        const n = document.querySelector("#screen-skill .brand-name");
        return n ? n.textContent.split(/\s+/).filter(Boolean).join(" ") : null;
      })(),
      heroIcon: !!document.querySelector("#skill-hero-icon svg"),
      homeControls: Array.from(document.querySelectorAll("#screen-skill button"))
        .filter(b => /home/i.test(b.textContent)).length,
      acts: Array.from(document.querySelectorAll("#activity-list .activity-card"))
        .map(c => ({
          key: (c.className.match(/act-([a-z]+)/) || [])[1],
          name: c.querySelector(".activity-name").textContent,
          line: c.querySelector(".activity-line").textContent,
          soon: c.classList.contains("is-soon"),
          hasButton: !!c.querySelector(".btn-activity"),
          soonLabel: c.querySelector(".activity-soon") ? c.querySelector(".activity-soon").textContent.trim() : null,
          icon: !!c.querySelector(".activity-icon svg")
        }))
    }));
    ok(`3.1 ${name} opens the shared Skill screen`, s.screen === "skill" && s.title === name, s.title);
    ok(`3.2 ${name} shows its own child clue`, s.ask === ask, s.ask);
    ok(`3.3 ${name} offers Learn, Practice and Test`,
      s.acts.map(a => a.key).join(",") === "learn,practice,test", s.acts.map(a => a.key).join(","));
    const testCard = s.acts.find(a => a.key === "test");
    ok(`3.4 ${name} Test is visibly unavailable and labelled`,
      testCard.soon === true && testCard.hasButton === false &&
      /coming next/i.test(testCard.soonLabel || ""), testCard.soonLabel);
    ok(`3.4b ${name} every activity card carries a large icon`,
      s.acts.every(a => a.icon === true));
    ok(`3.4c ${name} each activity keeps its short explanation`,
      s.acts.map(a => a.line).join(" | ") ===
      "Show me how | Let me try with help | Let me do it myself",
      s.acts.map(a => a.line).join(" | "));
    const pc = s.acts.find(a => a.key === "practice");
    ok(`3.5 ${name} Practice availability is honest`,
      key === "verb" ? (pc.soon === false && pc.hasButton === true)
                     : (pc.soon === true && pc.hasButton === false),
      key === "verb" ? "real bank, has control" : "coming next, no control");
    ok(`3.7 ${name} Skill screen carries the Sentence Sense wordmark`,
      s.wordmark === "Sentence Sense", s.wordmark);
    ok(`3.8 ${name} Skill screen shows the skill's own icon`, s.heroIcon === true);
    ok(`3.9 ${name} Skill screen has exactly ONE way home`,
      s.homeControls === 1, s.homeControls + " home control(s)");
    ok(`3.6 ${name} carries its own colour identity`, s.topic === key, s.topic);
    if (key === "verb") await shot(page, "desktop-02-skill-verb");
    if (key === "subject") await shot(page, "desktop-07-skill-subject");
  }

  /* ===== 4. VERB LEARN ===== */
  await goHome(page);
  await clickStart(page, "verb");
  await clickActivity(page, "learn");

  const l0 = await page.evaluate(() => ({
    screen: document.getElementById("screen-learn").hidden ? null : "learn",
    st: window.SS_LEARN.state(),
    steps: Array.from(document.querySelectorAll("#learn-steps .lstep")).map(n => n.textContent),
    heading: document.getElementById("learn-heading").textContent,
    backDisabled: document.getElementById("learn-prev").disabled
  }));
  ok("4.1 Verb Learn opens", l0.screen === "learn");
  ok("4.2 Learn has exactly four states",
    l0.steps.join(" / ") === "What is it? / How do I find it? / Show me / Let me try",
    l0.steps.join(" / "));
  ok("4.3 Learn starts at state 1", l0.st.stateIndex === 0 && l0.st.stateKey === "definition");
  ok("4.4 Back is disabled on the first state", l0.backDisabled === true);
  await shot(page, "desktop-03-learn-verb-what");

  await page.click("#learn-next"); await sleep(90);
  const l1 = await page.evaluate(() => ({
    st: window.SS_LEARN.state(),
    hasRef: !!document.querySelector(".lesson-reference"),
    refOpen: document.querySelector(".lesson-reference") ?
      document.querySelector(".lesson-reference").open : null,
    chips: document.querySelectorAll(".lesson-reference .chip").length,
    hasContrast: !!document.querySelector(".lesson-reference .lesson-contrast")
  }));
  ok("4.5 state 2 is HOW DO I FIND IT", l1.st.stateKey === "clue");
  ok("4.6 the retired Study Guide material is folded in here", l1.hasRef === true);
  ok("4.7 it is collapsed by default, so the state stays short", l1.refOpen === false);
  ok("4.8 the reference carries the word lists", l1.chips >= 20, l1.chips + " chips");
  ok("4.9 the same-word contrast survived the fold-in", l1.hasContrast === true);

  await page.click("#learn-next"); await sleep(90);
  const l2 = await page.evaluate(() => ({
    st: window.SS_LEARN.state(),
    pairs: document.querySelectorAll("#learn-content .sentence-pair").length,
    labels: Array.from(document.querySelectorAll("#learn-content .sentence-steplabel")).map(n => n.textContent)
  }));
  ok("4.10 state 3 is SHOW ME", l2.st.stateKey === "example");
  ok("4.11 SHOW ME uses the plain -> marked pair", l2.pairs === 1 &&
    l2.labels.join(",") === "READ IT,SEE HOW IT WORKS", l2.labels.join(","));

  await page.click("#learn-next"); await sleep(90);
  const l3 = await page.evaluate(() => ({
    st: window.SS_LEARN.state(),
    q: document.getElementById("try-question").textContent,
    choices: document.querySelectorAll("#try-choices .choice-btn").length,
    nextDisabled: document.getElementById("learn-next").disabled,
    nextLabel: document.getElementById("learn-next").textContent
  }));
  ok("4.12 state 4 is LET ME TRY", l3.st.stateKey === "try");
  ok("4.13 it asks one guided question", l3.q.length > 0 && l3.choices === 4, l3.q);
  ok("4.14 Finish is locked until the child answers",
    l3.nextDisabled === true && l3.nextLabel === "Finish");

  /* wrong first, to prove Learn teaches rather than marks */
  await page.evaluate(() => {
    const b = Array.from(document.querySelectorAll("#try-choices .choice-btn"))
      .find(x => x.textContent === "students");
    b.click();
  });
  await sleep(70);
  const lw = await page.evaluate(() => ({
    fb: document.getElementById("try-feedback").textContent,
    cls: document.getElementById("try-feedback").className,
    struck: getComputedStyle(
      Array.from(document.querySelectorAll("#try-choices .choice-btn"))
        .find(x => x.textContent === "students")).textDecorationLine,
    stillLocked: document.getElementById("learn-next").disabled
  }));
  ok("4.15 a wrong answer explains that word's job, not just 'wrong'",
    /students names who did the action/i.test(lw.fb) && !/^wrong/i.test(lw.fb.trim()),
    lw.fb.slice(0, 70));
  ok("4.16 a ruled-out word is struck through, not colour alone",
    lw.struck.includes("line-through"), lw.struck);
  ok("4.17 Finish stays locked after a wrong answer", lw.stillLocked === true);

  await page.evaluate(() => {
    Array.from(document.querySelectorAll("#try-choices .choice-btn"))
      .find(x => x.textContent === "studied").click();
  });
  await sleep(70);
  const lr = await page.evaluate(() => ({
    fb: document.getElementById("try-feedback").textContent,
    cls: document.getElementById("try-feedback").className,
    unlocked: !document.getElementById("learn-next").disabled
  }));
  ok("4.18 a correct answer gets teaching, not only praise",
    /is the verb because/i.test(lr.fb), lr.fb.slice(0, 70));
  ok("4.19 Finish unlocks once answered", lr.unlocked === true);
  await shot(page, "desktop-04-learn-verb-try");

  await page.click("#learn-next"); await sleep(120);
  const ldone = await page.evaluate(() => ({
    visible: !document.getElementById("learn-done").hidden,
    title: document.getElementById("learn-done-title").textContent,
    recap: document.getElementById("learn-done-recap").textContent,
    toPractice: document.getElementById("learn-done-practice").hidden === false,
    label: document.getElementById("learn-done-practice").textContent
  }));
  ok("4.20 Learn completes", ldone.visible && /you learned verb/i.test(ldone.title), ldone.title);
  ok("4.21 completion recaps the teaching, and claims no mastery",
    ldone.recap.length > 0 && !/master/i.test(ldone.recap), ldone.recap);
  ok("4.22 Verb offers Practice as the real next step",
    ldone.toPractice && /practice verb/i.test(ldone.label), ldone.label);

  /* ===== 5. VERB PRACTICE ===== */
  await page.click("#learn-done-practice"); await sleep(140);
  const p0 = await page.evaluate(() => ({
    screen: document.getElementById("screen-practice").hidden ? null : "practice",
    st: window.SS_PRACTICE.state(),
    count: document.getElementById("practice-count").textContent,
    stage: document.getElementById("practice-stage").textContent,
    choices: document.querySelectorAll("#practice-choices .choice-btn").length,
    nextDisabled: document.getElementById("practice-next").disabled,
    hasClue: !document.getElementById("practice-clue").hidden
  }));
  ok("5.1 Learn hands off to Practice with no hidden route", p0.screen === "practice");
  ok("5.2 Practice runs 20 questions", p0.st.total === 20, p0.st.total);
  ok("5.3 it opens on question 1", /question 1 of 20/i.test(p0.count), p0.count);
  ok("5.4 stage 1 is named", /stage 1:/i.test(p0.stage), p0.stage);
  ok("5.5 nothing auto-advances: Next is locked until answered", p0.nextDisabled === true);
  ok("5.6 a clue is available on request", p0.hasClue === true);
  await shot(page, "desktop-05-practice-verb");

  /* stage banding: 4 stages of 5, in order */
  const banding = await page.evaluate(() => {
    const st = window.SS_PRACTICE.state();
    const bank = window.SS_LEARN_CONTENT.topics.verb.tryItBank;
    return st.order.map(i => bank.questions[i].stage);
  });
  const expected = [0,0,0,0,0,1,1,1,1,1,2,2,2,2,2,3,3,3,3,3];
  ok("5.7 four stages of five, stages kept in order",
    banding.join(",") === expected.join(","), banding.join(","));

  /* question shuffle within stage: two fresh entries should differ */
  const orderA = await page.evaluate(() => window.SS_PRACTICE.state().order.join(","));
  await goHome(page); await clickStart(page, "verb"); await clickActivity(page, "practice");
  const orderB = await page.evaluate(() => window.SS_PRACTICE.state().order.join(","));
  await goHome(page); await clickStart(page, "verb"); await clickActivity(page, "practice");
  const orderC = await page.evaluate(() => window.SS_PRACTICE.state().order.join(","));
  ok("5.8 question order is shuffled inside each stage",
    !(orderA === orderB && orderB === orderC), "3 entries compared");

  /* choice shuffle: D-29. Render the same question repeatedly. */
  const ciOrders = new Set();
  for (let i = 0; i < 12; i++) {
    const o = await page.evaluate(() =>
      Array.from(document.querySelectorAll("#practice-choices .choice-btn"))
        .map(b => b.dataset.ci).join(","));
    ciOrders.add(o);
    await goHome(page); await clickStart(page, "verb"); await clickActivity(page, "practice");
  }
  ok("5.9 choice order is shuffled at render time (D-29)", ciOrders.size > 1,
    ciOrders.size + " distinct orders in 12 renders");

  const ciPresent = await page.evaluate(() =>
    Array.from(document.querySelectorAll("#practice-choices .choice-btn"))
      .every(b => b.dataset.ci !== undefined && b.dataset.ci !== ""));
  ok("5.10 answer identity is dataset.ci, never rendered text (D-36)", ciPresent);

  /* ===== 6. FEEDBACK ESCALATION ===== */
  const wrongCis = await page.evaluate(() => {
    const q = window.SS_LEARN_CONTENT.topics.verb.tryItBank
      .questions[window.SS_PRACTICE.state().order[0]];
    return q.choices.map((c, i) => c.correct ? null : i).filter(i => i !== null);
  });

  async function clickCi(ci) {
    await page.evaluate(ci => {
      Array.from(document.querySelectorAll("#practice-choices .choice-btn"))
        .find(b => Number(b.dataset.ci) === ci).click();
    }, ci);
    await sleep(70);
  }

  await clickCi(wrongCis[0]);
  const f1 = await page.evaluate(() => ({
    txt: document.getElementById("practice-feedback").textContent,
    attempts: window.SS_PRACTICE.state().attempts,
    locked: document.getElementById("practice-next").disabled
  }));
  ok("6.1 first wrong explains the word's job in THIS sentence",
    f1.attempts === 1 && /have another look/i.test(f1.txt) && f1.txt.length > 40, f1.txt.slice(0, 60));
  ok("6.2 the answer is not revealed on attempt 1", f1.locked === true);
  await shot(page, "desktop-06-practice-wrong");

  await clickCi(wrongCis[1]);
  const f2 = await page.evaluate(() => ({
    txt: document.getElementById("practice-feedback").textContent,
    attempts: window.SS_PRACTICE.state().attempts,
    clue: window.SS_LEARN_CONTENT.topics.verb.tryItBank
      .questions[window.SS_PRACTICE.state().order[0]].clue,
    locked: document.getElementById("practice-next").disabled
  }));
  ok("6.3 second wrong gives the stronger clue",
    f2.attempts === 2 && f2.txt.includes(f2.clue), f2.clue);
  ok("6.4 the answer is still not revealed on attempt 2", f2.locked === true);

  await clickCi(wrongCis[2]);
  const f3 = await page.evaluate(() => {
    const st = window.SS_PRACTICE.state();
    const q = window.SS_LEARN_CONTENT.topics.verb.tryItBank.questions[st.order[0]];
    const correctIndex = q.choices.findIndex(c => c.correct);
    const right = Array.from(document.querySelectorAll("#practice-choices .choice-btn"))
      .find(b => Number(b.dataset.ci) === correctIndex);
    return {
      txt: document.getElementById("practice-feedback").textContent,
      reveal: q.reveal,
      marked: right ? right.classList.contains("is-right") : false,
      allLocked: Array.from(document.querySelectorAll("#practice-choices .choice-btn"))
        .every(b => b.disabled),
      unlocked: !document.getElementById("practice-next").disabled,
      answered: st.answered
    };
  });
  ok("6.5 third wrong reveals and explains", f3.txt.includes(f3.reveal), f3.reveal.slice(0, 60));
  ok("6.6 the reveal marks the correct button by identity", f3.marked === true);
  ok("6.7 every choice is locked after the reveal", f3.allLocked === true);
  ok("6.8 the child can move on after the reveal", f3.unlocked && f3.answered);
  await shot(page, "desktop-06b-practice-reveal");

  /* the clue button is help, not an error */
  await goHome(page); await clickStart(page, "verb"); await clickActivity(page, "practice");
  await page.click("#practice-clue"); await sleep(70);
  const cl = await page.evaluate(() => ({
    attempts: window.SS_PRACTICE.state().attempts,
    cls: document.getElementById("practice-feedback").className,
    anyWrong: document.querySelectorAll("#practice-choices .is-wrong").length
  }));
  ok("6.9 asking for a clue is not counted as an error",
    cl.attempts === 0 && cl.anyWrong === 0 && /is-clue/.test(cl.cls), cl.cls);

  /* ===== 7. MISSION RETIREMENT ===== */
  ok("7.1 no mission engine is loaded", globals.hasMission === false);
  ok("7.2 no mission artwork is loaded", globals.hasScenes === false);
  ok("7.3 no mission content is loaded", globals.hasMissionVerb === false);

  const dom = await page.evaluate(() => ({
    mission: !!document.getElementById("screen-mission"),
    rail: !!document.querySelector(".mission-rail"),
    guide: !!document.getElementById("guide-overlay"),
    guideBtn: !!document.querySelector(".guide-btn"),
    body: document.body.textContent.toLowerCase()
  }));
  ok("7.4 the mission screen is gone from the DOM", dom.mission === false);
  ok("7.5 the mission rail is gone", dom.rail === false);
  ok("7.6 the Study Guide modal is gone (closes D-35 by removal)",
    dom.guide === false && dom.guideBtn === false);
  ok("7.7 no detective or mission language survives anywhere",
    !/detective|sentence detectives|case file|case closed/i.test(dom.body));

  const classic = await browser.newPage();
  const classicErrors = [];
  classic.on("pageerror", e => classicErrors.push(String(e)));
  await classic.goto(BASE + "?verb=classic", { waitUntil: "networkidle0" });
  await sleep(200);
  const cl2 = await classic.evaluate(() => {
    const b = Array.from(document.querySelectorAll("#skill-grid .btn-start"))
      .find(x => x.dataset.skill === "verb");
    b.click();
    return {
      screen: window.__sentenceSense.SCREENS.find(s => {
        const n = document.getElementById("screen-" + s);
        return n && !n.hidden;
      }),
      title: document.getElementById("skill-heading").textContent
    };
  });
  ok("7.8 ?verb=classic is gone: Verb behaves identically with the flag",
    cl2.screen === "skill" && cl2.title === "Verb", cl2.screen + "/" + cl2.title);
  ok("7.9 ?verb=classic raises no error", classicErrors.length === 0, classicErrors.join("|"));
  await classic.close();

  /* ===== 8. STATE LEAKAGE ===== */
  await goHome(page); await clickStart(page, "verb"); await clickActivity(page, "practice");
  await page.evaluate(() => {
    document.querySelectorAll("#practice-choices .choice-btn")[0].click();
  });
  await sleep(70);
  await goHome(page); await clickStart(page, "subject"); await clickActivity(page, "learn");
  const leak = await page.evaluate(() => ({
    topic: window.SS_LEARN.state().topicKey,
    heading: document.getElementById("learn-heading").textContent,
    tag: document.getElementById("learn-skill-tag").textContent,
    body: document.getElementById("screen-learn").textContent.toLowerCase()
  }));
  ok("8.1 opening Subject after Verb shows Subject", leak.topic === "subject" && leak.tag === "Subject",
    leak.tag);
  ok("8.2 no Verb content leaks into Subject",
    !/what is a verb|kicked/i.test(leak.heading) && !leak.body.includes("what is a verb"), leak.heading);

  await goHome(page); await clickStart(page, "verb"); await clickActivity(page, "practice");
  const reentry = await page.evaluate(() => window.SS_PRACTICE.state());
  ok("8.3 re-entering Practice restarts cleanly at question 1",
    reentry.pos === 0 && reentry.attempts === 0 && reentry.answered === false && !reentry.done);

  const storage = await page.evaluate(() => ({ l: localStorage.length, s: sessionStorage.length }));
  ok("8.4 nothing is persisted after a full walk",
    storage.l === 0 && storage.s === 0, `local=${storage.l} session=${storage.s}`);

  /* ===== 9. KEYBOARD, FOCUS, ACCESSIBILITY ===== */
  await goHome(page);
  const a11y = await page.evaluate(() => {
    const h1 = document.querySelectorAll("h1").length;
    const btns = Array.from(document.querySelectorAll("#skill-grid .btn-start"));
    return {
      h1: h1,
      h1Text: document.querySelector("h1") ? document.querySelector("h1").textContent : "",
      labelled: btns.every(b => (b.getAttribute("aria-label") || "").length > 5),
      labels: btns.map(b => b.getAttribute("aria-label")),
      semantic: btns.every(b => b.tagName === "BUTTON"),
      liveRegions: document.querySelectorAll('[aria-live="polite"]').length
    };
  });
  ok("9.1 exactly one h1 on Home", a11y.h1 === 1, a11y.h1Text);
  ok("9.2 every Start button is a real <button>", a11y.semantic === true);
  ok("9.3 each Start button names its own skill to a screen reader",
    a11y.labelled === true, a11y.labels[0]);
  ok("9.4 feedback is in a polite live region", a11y.liveRegions >= 2, a11y.liveRegions);

  /* tab order and visible focus */
  await page.evaluate(() => document.body.focus());
  const tabbed = [];
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press("Tab");
    tabbed.push(await page.evaluate(() => {
      const a = document.activeElement;
      return (a.getAttribute && a.getAttribute("aria-label")) || a.textContent.trim().slice(0, 24) || a.tagName;
    }));
  }
  ok("9.5 Home is keyboard reachable in a logical order",
    tabbed.filter(t => /start verb|start subject|start noun|start adjective/i.test(t)).length === 4,
    tabbed.join(" > "));

  /* Focus visibility must be measured through the KEYBOARD. Calling
     .focus() in script does not necessarily match :focus-visible, so a
     programmatic check silently measures the button's own drop shadow
     and passes whatever happens. Tab to the control, then compare the
     computed shadow against the same element unfocused. */
  await page.evaluate(() => document.body.focus());
  await page.keyboard.press("Tab");
  const ring = await page.evaluate(() => {
    const a = document.activeElement;
    const read = n => {
      const s = getComputedStyle(n);
      return { outline: s.outlineStyle + " " + s.outlineWidth + " " + s.outlineColor,
               shadow: s.boxShadow };
    };
    const focused = read(a);
    a.blur();
    const resting = read(a);
    return { focused, resting, id: a.getAttribute("aria-label") || a.tagName };
  });
  const ringChanged = (ring.focused.outline !== ring.resting.outline) ||
                      (ring.focused.shadow !== ring.resting.shadow);
  const ringDrawn = !/^none/.test(ring.focused.outline) ||
                    (ring.focused.shadow !== "none");
  ok("9.6 keyboard focus draws a visible ring, distinct from the resting state",
    ringChanged && ringDrawn,
    ring.id + " :: focused=" + ring.focused.outline + " resting=" + ring.resting.outline);

  /* Escape steps back one level */
  await goHome(page); await clickStart(page, "verb"); await clickActivity(page, "learn");
  await page.keyboard.press("Escape"); await sleep(90);
  ok("9.7 Escape leaves an activity for its skill", (await visibleScreen(page)) === "skill");
  await page.keyboard.press("Escape"); await sleep(90);
  ok("9.8 Escape leaves a skill for Home", (await visibleScreen(page)) === "home");

  /* focus moves to the new screen on entry */
  await clickStart(page, "verb"); await sleep(90);
  const focusOnEntry = await page.evaluate(() => document.activeElement.id);
  ok("9.9 focus moves to the new screen's heading", focusOnEntry === "skill-heading", focusOnEntry);

  /* tap targets */
  const targets = await page.evaluate(() => {
    const sel = ".btn, .nav-btn, .choice-btn, .btn-activity, .activity-soon";
    return Array.from(document.querySelectorAll(sel))
      .filter(n => n.offsetParent !== null)
      .map(n => ({ t: n.textContent.trim().slice(0, 18), h: Math.round(n.getBoundingClientRect().height) }))
      .filter(x => x.h < 44);
  });
  ok("9.10 every visible control is at least 44px tall",
    targets.length === 0, targets.map(t => t.t + "=" + t.h).join(","));

  /* ===== 10. PLAIN -> MARKED EXACT MATCH ===== */
  await goHome(page); await clickStart(page, "verb"); await clickActivity(page, "learn");
  await page.click("#learn-next"); await sleep(60);
  await page.click("#learn-next"); await sleep(90);
  const pm = await page.evaluate(() => {
    const pair = document.querySelector("#learn-content .sentence-pair");
    const read = (box) => Array.from(box.querySelectorAll(".ss-word"))
      .map(w => Array.from(w.querySelectorAll(".ss-word-text,.ss-word-punct"))
        .map(n => n.textContent).join(""))
      .join(" ");
    return {
      plain: read(pair.querySelector(".is-read")),
      marked: read(pair.querySelector(".is-see")),
      markedHasLabel: !!pair.querySelector(".is-see .ss-word-label"),
      plainHasLabel: !!pair.querySelector(".is-read .ss-word-label")
    };
  });
  ok("10.1 plain and marked contain exactly the same words, order and punctuation",
    pm.plain === pm.marked, pm.plain + "   ==   " + pm.marked);
  ok("10.2 only the marked pass carries annotation",
    pm.markedHasLabel === true && pm.plainHasLabel === false);

  /* M-02 guard: a marked word and its ending punctuation must sit on ONE
     visual line. This defect shipped in 1.3.0 and was caught only by
     looking at a screenshot, so it gets a real check now. Compare the
     TOP of the word against the top of its punctuation -- if the full
     stop has wrapped to its own row, the tops differ.

     Measured on Noun LEARN "Show me": "The student read a book." marks
     the FINAL word, so the chip carries the full stop -- the exact shape
     that broke. Verb's example marks "kicked" mid-sentence and so cannot
     exercise this at all, which is why the check is run here. */
  await goHome(page);
  await clickStart(page, "noun");
  await clickActivity(page, "learn");
  await page.click("#learn-next"); await sleep(60);
  await page.click("#learn-next"); await sleep(90);
  const punct = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll(".ss-word.is-marked").forEach(w => {
      const t = w.querySelector(".ss-word-text");
      const p = w.querySelector(".ss-word-punct");
      if (!p) return;
      const a = t.getBoundingClientRect(), b = p.getBoundingClientRect();
      out.push({ word: t.textContent + p.textContent, dy: Math.abs(a.top - b.top) });
    });
    return out;
  });
  ok("10.4 ending punctuation stays on the word's own line (M-02)",
    punct.length > 0 && punct.every(x => x.dy < 4),
    punct.map(x => x.word + " dy=" + x.dy.toFixed(1)).join(", ") || "NO marked punctuation found on this screen");

  const prev = await page.evaluate(() => {
    const C = window.SS_LEARN_CONTENT;
    return C.homeOrder.map(k => {
      const t = C.topics[k];
      const rendered = document.querySelectorAll("#skill-grid .skill-card")[C.homeOrder.indexOf(k)]
        .querySelector(".skill-preview-line").textContent.trim();
      return { k, ok: rendered === t.preview.words.join(" "), rendered };
    });
  });
  ok("10.3 every Home preview renders its source word array exactly",
    prev.every(p => p.ok), prev.map(p => p.k + ":" + p.rendered).join(" | "));

  /* ===== 11. RESPONSIVE ===== */
  const VIEWPORTS = [
    ["phone-375", 375, 667], ["phone-390", 390, 844], ["phone-430", 430, 932],
    ["tablet-820", 820, 1180], ["laptop-1024", 1024, 768], ["laptop-1280", 1280, 720],
    ["laptop-1366", 1366, 768], ["desktop-1440", 1440, 900], ["desktop-1920", 1920, 1080]
  ];

  const respRows = [];
  for (const [label, w, h] of VIEWPORTS) {
    await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });

    for (const [screenName, walk] of [
      ["home", async () => { await goHome(page); }],
      ["skill", async () => { await goHome(page); await clickStart(page, "verb"); }],
      ["practice", async () => {
        await goHome(page); await clickStart(page, "verb"); await clickActivity(page, "practice");
      }]
    ]) {
      await walk();
      await sleep(110);
      const m = await page.evaluate(() => {
        const de = document.documentElement;
        const overflow = de.scrollWidth - de.clientWidth;
        /* Banner legibility: the headline must never sit on top of the
           photograph without something lifting it. On the phone layout the
           text is stacked below the photo (no overlap); above 620px it
           overlays and the scrim must be painted. Measured, not assumed. */
        const hero = document.getElementById("home-hero");
        let heroText = null;
        if (hero && !document.getElementById("screen-home").hidden) {
          const photo = hero.querySelector(".hero-photo");
          const scrim = hero.querySelector(".hero-scrim");
          const title = hero.querySelector(".hero-title");
          const pv = photo ? getComputedStyle(photo).display !== "none" : false;
          const sv = scrim ? getComputedStyle(scrim).display !== "none" : false;
          const pr = photo ? photo.getBoundingClientRect() : null;
          const tr = title ? title.getBoundingClientRect() : null;
          const overlaps = (pv && pr && tr)
            ? !(tr.top >= pr.bottom - 1 || tr.bottom <= pr.top + 1)
            : false;
          heroText = { photoVisible: pv, scrimVisible: sv, overlaps: overlaps,
                       legible: !overlaps || sv };
        }
        /* A false bottom: the page does not scroll, yet a required control
           sits below the fold and is therefore unreachable. */
        const scrollable = de.scrollHeight > de.clientHeight + 1;
        const controls = Array.from(document.querySelectorAll(
          ".btn-start, .btn-next, .choice-btn, .activity-btn"))
          .filter(n => n.offsetParent !== null);
        const below = controls.filter(n =>
          n.getBoundingClientRect().bottom > de.clientHeight + 1);
        const tiny = Array.from(document.querySelectorAll("p, li, .skill-ask, .activity-line"))
          .filter(n => n.offsetParent !== null)
          .filter(n => parseFloat(getComputedStyle(n).fontSize) < 12).length;
        return {
          overflow, scrollable,
          below: below.length,
          falseBottom: (!scrollable && below.length > 0),
          tiny, heroText
        };
      });
      respRows.push({ viewport: label, w, h, screen: screenName, ...m });
      ok(`11.${screenName}.${label} no horizontal overflow`, m.overflow <= 0, m.overflow + "px");
      ok(`11.${screenName}.${label} no false bottom`, m.falseBottom === false,
        m.below + " below fold, scrollable=" + m.scrollable);
      ok(`11.${screenName}.${label} no text under 12px`, m.tiny === 0, m.tiny);
      if (m.heroText) {
        ok(`11.${screenName}.${label} banner headline stays legible over the photo`,
          m.heroText.legible === true,
          m.heroText.overlaps ? (m.heroText.scrimVisible ? "overlay + scrim" : "OVERLAPS WITH NO SCRIM") : "stacked, no overlap");
      }
    }
  }

  /* skill grid column counts at the three named sizes */
  for (const [label, w, h, want] of [
    ["phone", 390, 844, 1], ["tablet", 820, 1180, 2], ["desktop", 1440, 900, 4]
  ]) {
    await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
    await goHome(page); await sleep(120);
    const cols = await page.evaluate(() =>
      getComputedStyle(document.getElementById("skill-grid")).gridTemplateColumns.split(" ").length);
    ok(`11.cols.${label} skill grid is ${want} column(s)`, cols === want, cols);
  }

  /* screenshot evidence */
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await goHome(page); await sleep(150); await shot(page, "phone-01-home");
  await clickStart(page, "verb"); await sleep(120); await shot(page, "phone-02-skill-verb");
  await clickActivity(page, "practice"); await sleep(140); await shot(page, "phone-03-practice");
  await page.evaluate(() => {
    const st = window.SS_PRACTICE.state();
    const q = window.SS_LEARN_CONTENT.topics.verb.tryItBank.questions[st.order[0]];
    const wrong = q.choices.findIndex(c => !c.correct);
    Array.from(document.querySelectorAll("#practice-choices .choice-btn"))
      .find(b => Number(b.dataset.ci) === wrong).click();
  });
  await sleep(140); await shot(page, "phone-04-practice-wrong");

  await page.setViewport({ width: 820, height: 1180, deviceScaleFactor: 2 });
  await goHome(page); await sleep(150); await shot(page, "tablet-01-home");
  await clickStart(page, "verb"); await clickActivity(page, "practice");
  await sleep(150); await shot(page, "tablet-02-practice");

  /* reduced motion */
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await goHome(page); await sleep(150);
  const rm = await page.evaluate(() => {
    const c = document.querySelector(".skill-card");
    return getComputedStyle(c).transitionDuration;
  });
  ok("11.rm reduced motion is respected", parseFloat(rm) < 0.01, rm);
  await shot(page, "desktop-08-reduced-motion");
  await page.emulateMediaFeatures([]);

  /* final error sweep across the whole walk */
  ok("12.1 no page errors across the entire walk", pageErrors.length === 0, pageErrors.join(" | "));
  ok("12.2 no console errors across the entire walk", consoleErrors.length === 0, consoleErrors.join(" | "));
  ok("12.3 no failed requests across the entire walk", failedRequests.length === 0, failedRequests.join(" | "));

  await browser.close();

  fs.writeFileSync(path.join(OUT, "results.json"),
    JSON.stringify({ build: "Build 1.4.0", pass: passed, fail: failed, results }, null, 1));
  fs.writeFileSync(path.join(OUT, "responsive.json"),
    JSON.stringify({ build: "Build 1.4.0", rows: respRows }, null, 1));

  console.log(`\n${passed} passed, ${failed} failed`);
  console.log("results  -> " + path.join(OUT, "results.json"));
  console.log("shots    -> " + SHOTS);
  process.exit(failed ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
