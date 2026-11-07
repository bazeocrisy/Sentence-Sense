/* =========================================================
   Sentence Sense — Build 1.9.0 "Write a Strong Sentence" walkthrough

   Walks the real product in Chromium (Playwright). Not part of the site.

     node verification/serve.js . 8347          # terminal 1
     node verification/write-check.js [outDir]  # terminal 2

   Env: BASE (default http://127.0.0.1:8347/), CHROME (optional path).
   Exit code 0 only when every check passes.
   ========================================================= */
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const BASE = process.env.BASE || "http://127.0.0.1:8347/";
const OUT = process.argv[2] || path.join(__dirname, "write-out");
fs.mkdirSync(OUT, { recursive: true });

const results = [];
function check(name, ok, detail) {
  results.push({ name, ok: !!ok, detail: detail || "" });
  console.log((ok ? "PASS " : "FAIL ") + name + (detail && !ok ? "  — " + detail : ""));
}

async function newPage(browser, opts) {
  const ctx = await browser.newContext(Object.assign({ viewport: { width: 1280, height: 900 } }, opts || {}));
  const page = await ctx.newPage();
  page.errors = [];
  page.clicks = 0;
  page.on("pageerror", e => page.errors.push(e.message));
  page.on("dialog", d => d.accept());
  /* Fonts come from a CDN the sandbox may block; the app has fallbacks. */
  await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  return { ctx, page };
}

const focusedId = page => page.evaluate(() => document.activeElement && document.activeElement.id);
const visible = (page, sel) => page.locator(sel).first().isVisible();
const heading = page => page.locator("#write-heading").innerText();
const store = page => page.evaluate(() => JSON.parse(localStorage.getItem("sentence-sense-writing-v1") || "null"));
const noHScroll = page => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
async function primary(page) { page.clicks++; await page.locator(".write-primary").click(); }
async function tap(page, sel) { page.clicks++; await page.click(sel); }
async function tapWord(page, field, word) {
  const group = field === "who" ? 0 : 1;
  page.clicks++;
  await page.locator(".pick-row").nth(group).locator(".pick-word", { hasText: new RegExp("^" + word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$") }).first().click();
}

(async () => {
  const browser = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {});

  /* ---------------- P. Mechanical notes: never call valid writing wrong ---------------- */
  {
    const { ctx, page } = await newPage(browser);
    await page.goto(BASE);
    const cases = [
      ["Mr. Lee waved at us.", []],
      ["Mrs. Diaz said, \"Come in!\"", []],
      ["Mrs. Diaz said, “Come in!”", []],
      ["\"Wow!\" said Mom.", []],
      ["“Can I play?” asked Ben.", []],
      ["Can we go to the park?", []],
      ["Look at that cloud!", []],
      ["Sit down.", []],
      ["Wow!!", []],
      ["We drove to St. Louis with Dr. Patel.", []],
      ["J. K. Rowling wrote it.", []],
      ["We left at 3 p.m. on Friday.", []],
      ["My dog ran (very fast).", []],
      ["He said, \"Hi.\"", []],
      ["I think I can.", []],
      ["I woke up. Then I ate.", ["many"]],
      ["She yelled, \"Stop!\" Then she laughed.", ["many"]],
      ["Is it raining? Yes, it is.", ["many"]],
      ["the dog ran.", ["firstLetter"]],
      ["\"wow,\" said Mom.", ["firstLetter"]],
      ["The dog ran", ["ending"]],
      ["i like it.", ["firstLetter", "wordI"]],
      ["Mom and i're here.", ["wordI"]],
      ["The ____ ran.", ["blanks"]],
      ["Pizza tastes ____", ["ending", "blanks"]]
    ];
    const got = await page.evaluate(cs => cs.map(c => window.SS_WRITE._looksAt(c[0]).map(x => x.key)), cases);
    cases.forEach((c, i) => {
      const ok = JSON.stringify(got[i].slice().sort()) === JSON.stringify(c[1].slice().sort());
      check("P" + (i + 1) + " notes for " + JSON.stringify(c[0]) + " = [" + c[1].join(",") + "]", ok, "got [" + got[i].join(",") + "]");
    });
    const noWrong = await page.evaluate(() => {
      const t = JSON.stringify(window.SS_WRITE_CONTENT.steps.revise.looks);
      return !/\b(wrong|incorrect|error|mistake)\b/i.test(t);
    });
    check("P26 no note uses the words wrong/incorrect/error/mistake", noWrong);

    /* Praise wording, computed on synthetic pieces. */
    const base = { checks: { who: "skipped", sense: null }, marks: {}, help: { rung: 0, examples: [], starters: false, wordBank: false } };
    const pr = await page.evaluate(b => {
      const P = (f, r, extra) => window.SS_WRITE._praise(Object.assign(JSON.parse(JSON.stringify(b)), { firstDraft: f, revision: r }, extra || {}));
      return {
        same: P("The dog ran fast.", "The dog ran fast."),
        added: P("The dog ran.", "The big dog ran."),
        removed: P("The very very big dog ran.", "The big dog ran."),
        marks: P("the dog ran", "The dog ran."),
        command: P("Sit down.", "Sit down.", { checks: { who: "command", sense: "yes" } })
      };
    }, base);
    const all = Object.values(pr).flat().join(" | ");
    check("P27 no praise claims better/correct/right/mastery", !/\b(better|correct|right|perfect|master|great sentence|good sentence)\b/i.test(all), all);
    check("P28 keeping it the same is praised as a choice", pr.same.some(t => /chose to keep it/.test(t)) && pr.same.length === 1, pr.same.join(" | "));
    check("P29 added words stated as a fact, not a value", pr.added.some(t => t === "You added: “big”."), pr.added.join(" | "));
    check("P30 removing words is presented as real revision", pr.removed.some(t => /You took out: “very very”.*real revision too/.test(t)), pr.removed.join(" | "));
    check("P31 capital and end-mark changes are named as marks, not words", pr.marks.includes("You changed the first letter to a capital.") && pr.marks.includes("You added an end mark.") && !pr.marks.some(t => /added: “The”|took out/.test(t)), pr.marks.join(" | "));
    check("P32 command is acknowledged", pr.command.includes("You noticed it's a command."), pr.command.join(" | "));
    await ctx.close();
  }

  /* ---------------- A. Shortest path: write, keep it, finish ---------------- */
  {
    const { ctx, page } = await newPage(browser);
    await page.goto(BASE);
    check("A1 build badge is 1.9.1", (await page.locator("#build-badge").innerText()).includes("Build 1.9.1"));
    check("A2 Home shows one prominent next action", (await page.locator("#next-primary").innerText()).includes("Start writing"));
    check("A3 ten skill cards on Home", (await page.locator("#skill-grid .skill-card").count()) === 10);
    check("A4 Georgia badge is qualified", (await page.locator(".hb-line").innerText()) === "Practices Georgia Grade 3 language skills");
    page.clicks = 0;
    await tap(page, "#next-primary");
    await tap(page, '.prompt-btn[data-prompt="animal"]');
    check("A5 draft step, focus on heading", (await heading(page)) === "Write your sentence" && (await focusedId(page)) === "write-heading");
    await page.fill("#write-input", "My dog chased a squirrel up the tree.");
    await primary(page);
    check("A6 Check screen (one screen, three questions)", (await heading(page)) === "Check your sentence" && (await page.locator(".check-q").count()) === 3);
    await tapWord(page, "who", "My"); await tapWord(page, "who", "dog");
    await tapWord(page, "what", "chased");
    await tap(page, '.write-choice[data-sense="yes"]');
    await primary(page);
    check("A7 Revise screen", (await heading(page)) === "Revise if you want to");
    check("A8 unchanged sentence offers 'Keep it and finish'", (await page.locator(".write-primary").innerText()) === "Keep it and finish");
    check("A9 detail is optional and folded away", !(await page.locator("#write-detail").evaluate(d => d.open)));
    check("A10 valid sentence: no marks noted", (await page.locator(".write-look-none").count()) === 1);
    await primary(page);
    check("A11 compare screen", (await heading(page)) === "Your two versions");
    const cmp = await page.locator(".compare-card .write-text").allInnerTexts();
    check("A12 both boxes show the unchanged sentence", cmp[0] === cmp[1] && cmp[0] === "My dog chased a squirrel up the tree.");
    check("A13 labelled as kept the same", (await page.locator(".compare-card.is-new .compare-label").innerText()).toLowerCase().includes("kept the same"));
    check("A14 short session: whole piece in ≤ 12 taps plus typing", page.clicks <= 12, String(page.clicks));
    const praise = await page.locator(".praise-list").innerText();
    check("A15 praise reports the child's marking as their own", praise.includes("You marked who or what it's about: “My dog”"), praise);
    await page.screenshot({ path: path.join(OUT, "desktop-compare-kept.png"), fullPage: true });
    check("A16 no page errors", page.errors.length === 0, page.errors.join(" | "));
    await ctx.close();
  }

  /* ---------------- B. Revise, leave, resume, first draft preserved ---------------- */
  {
    const { ctx, page } = await newPage(browser);
    await page.goto(BASE);
    await page.click("#next-primary");
    await page.click('.prompt-btn[data-prompt="animal"]');
    await primary(page);
    check("B1 empty draft is not accepted, gentle nudge", (await visible(page, "#write-nudge")) && (await heading(page)) === "Write your sentence");
    await page.fill("#write-input", "   \n ");
    await primary(page);
    check("B2 whitespace-only draft is not accepted", (await heading(page)) === "Write your sentence");
    await page.fill("#write-input", "the puppy hid under my bed");
    await primary(page);
    let s = await store(page);
    check("B3 first draft saved immediately", s && s.pieces[0].firstDraft === "the puppy hid under my bed" && s.pieces[0].step === "check");
    await primary(page);
    check("B4 nothing answered: one gentle nudge, not a block", (await heading(page)) === "Check your sentence" && (await page.locator("#write-check-status").innerText()).length > 0);
    await tapWord(page, "who", "the"); await tapWord(page, "who", "puppy");
    for (const w of ["hid", "under", "my", "bed"]) await tapWord(page, "what", w);
    await page.reload();
    check("B5 after refresh Home offers Continue", (await page.locator("#next-primary").innerText()).includes("Continue my sentence"));
    await page.click("#next-primary");
    check("B6 resume returns to Check with taps kept", (await heading(page)) === "Check your sentence" && (await page.locator('.pick-word[aria-pressed="true"]').count()) === 6);
    await page.click('.write-choice[data-sense="yes"]');
    await primary(page);
    const notes = await page.locator("#write-look li").evaluateAll(l => l.map(x => x.dataset.look));
    check("B7 lowercase start and missing end mark are noted as things to look at", notes.includes("firstLetter") && notes.includes("ending"), notes.join(","));
    await page.click("#write-detail summary");
    check("B8 detail ideas open on request", await page.locator("#write-detail").evaluate(d => d.open));
    await page.fill("#write-revision", "The puppy hid under my bed all morning.");
    check("B9 changed sentence offers 'I'm finished'", (await page.locator(".write-primary").innerText()) === "I'm finished");
    check("B10 notes clear when fixed", (await page.locator(".write-look-none").count()) === 1);
    await page.click("#write-home");
    await page.click("#next-primary");
    check("B11 Home and back: revision restored", (await page.inputValue("#write-revision")) === "The puppy hid under my bed all morning.");
    await page.keyboard.press("Escape");
    check("B12 Escape goes Home", await visible(page, "#screen-home"));
    await page.click("#next-primary");
    await page.click("#write-back"); await page.click("#write-back");
    check("B13 Back reaches the frozen first draft", (await heading(page)) === "Your first draft" &&
      (await page.locator(".write-text").innerText()) === "the puppy hid under my bed");
    s = await store(page);
    check("B14 first draft and revision distinct in storage",
      s.pieces[0].firstDraft === "the puppy hid under my bed" && s.pieces[0].revision === "The puppy hid under my bed all morning.");
    check("B15 revising cleared index marks, but kept the words as evidence", s.pieces[0].marks.whoWords === "the puppy");
    await primary(page);
    await primary(page);
    await page.screenshot({ path: path.join(OUT, "desktop-revise.png"), fullPage: true });
    /* Restore first draft is an explicit action with confirmation. */
    await page.click("#write-restore");
    check("B16 'Go back to my first draft' restores it after confirming", (await page.inputValue("#write-revision")) === "the puppy hid under my bed");
    await page.fill("#write-revision", "The puppy hid under my bed all morning.");
    await primary(page);
    const praise = await page.locator(".praise-list").innerText();
    check("B17 praise names the added words and mark changes", praise.includes("You added: “all morning.”") && praise.includes("first letter to a capital") && praise.includes("added an end mark"), praise);
    await page.screenshot({ path: path.join(OUT, "desktop-compare.png"), fullPage: true });
    check("B18 no page errors", page.errors.length === 0, page.errors.join(" | "));

    /* ---------------- C. Supported writing: help ladder, tools ---------------- */
    await page.click(".write-done >> text=Write another sentence");
    await page.click('.prompt-btn[data-prompt="food"]');
    for (let i = 1; i <= 4; i++) await page.click("#write-help-btn");
    check("C1 four help rungs, one at a time", (await page.locator(".ladder-rung").count()) === 4);
    check("C2 Help me disabled after the last rung", await page.locator("#write-help-btn").isDisabled());
    const rungs = await page.locator(".ladder-rung").allInnerTexts();
    check("C3 rung 1 asks one question", rungs[0].includes("What food is it?"));
    check("C4 example is about a different topic", rungs[2].includes("kite") && !/pizza|soup|taste/i.test(rungs[2]));
    check("C5 frame is not inserted until asked", (await page.inputValue("#write-input")) === "");
    await page.locator(".ladder-rung >> text=Put this frame in my writing").click();
    check("C6 frame added only on request", (await page.inputValue("#write-input")) === "____ tastes ____.");
    await page.fill("#write-input", "");
    await page.click(".tool-btn >> text=Sentence starters");
    await page.locator(".chip-btn", { hasText: "Cold watermelon" }).click();
    await page.keyboard.type("is my favorite.");
    await page.click(".tool-btn >> text=Word bank");
    await page.evaluate(() => { const t = document.getElementById("write-input"); const i = t.value.indexOf("is"); t.setSelectionRange(i, i); });
    await page.locator(".tool-panel .chip-btn", { hasText: /^sweet$/ }).first().click();
    const built = await page.inputValue("#write-input");
    check("C7 starter + bank word inserted without replacing text", built === "Cold watermelon sweet is my favorite.", built);
    const tricky = "My grandma's soup <b>is</b> hot & <img src=x onerror=window.__pwned=1>.\nIt's the best!";
    await page.fill("#write-input", tricky);
    await primary(page);
    check("C8 markup is shown as text, never parsed", (await page.locator("#write-body b, #write-body img").count()) === 0 && !(await page.evaluate(() => window.__pwned)));
    check("C9 multiline text keeps its line break", (await page.locator("#write-body .write-text").first().innerText()).includes("\n"));
    await primary(page); await primary(page);
    const looks = await page.locator("#write-look li").evaluateAll(l => l.map(x => x.dataset.look));
    /* The markup test text contains "src=x" (no vowel), so a spelling question is expected too. */
    check("C10 two sentences noticed as 'more than one'; no capital or end-mark note", looks.includes("many") && !looks.includes("firstLetter") && !looks.includes("ending"), looks.join(","));
    /* Words removed path. */
    await page.fill("#write-revision", "Grandma's soup is the best!");
    await primary(page);
    const pr2 = await page.locator(".praise-list").innerText();
    check("C11 removing words praised as real revision", pr2.includes("Taking words out is a real revision too"), pr2);

    /* ---------------- D. Command path ---------------- */
    await page.click(".write-done >> text=Write another sentence");
    await page.click('.prompt-btn[data-prompt="own"]');
    await page.fill("#write-input", "Look at that huge rainbow!");
    await primary(page);
    await page.click('.write-choice[data-who="command"]');
    check("D1 command explained as complete", (await page.locator("#write-check-status").innerText()).includes("is complete"));
    for (const w of ["Look", "at", "that", "huge", "rainbow!"]) await tapWord(page, "what", w);
    await page.click('.write-choice[data-sense="yes"]');
    await primary(page);
    check("D2 command: no marks noted", (await page.locator(".write-look-none").count()) === 1);
    await primary(page);
    check("D3 command finishes normally", (await heading(page)) === "Your two versions");

    /* ---------------- E. Grown-ups view ---------------- */
    await page.click(".write-done >> text=Show a grown-up");
    check("E1 grown-ups view opens, heading focused", (await focusedId(page)) === "parent-heading");
    const pieces = page.locator(".parent-piece");
    check("E2 three pieces listed", (await pieces.count()) === 3);
    const puppy = await pieces.filter({ hasText: "the puppy hid under my bed" }).innerText();
    check("E3 shows prompt, first draft, revision", puppy.includes("animal") && puppy.includes("The puppy hid under my bed all morning."));
    check("E4 self-checks labelled as the child's own answers", puppy.includes("Child's own answers (not checked by the app)") && puppy.includes("Tapped as who/what: “the puppy”") && puppy.includes("Makes sense by itself? Said yes"), puppy);
    check("E5 help and detail use recorded", puppy.includes("Opened the revision examples") && puppy.includes("Put the first draft back"), puppy);
    const soup = await pieces.filter({ hasText: "grandma" }).innerText();
    check("E6 supported piece shows help used", soup.includes("Help me: 4 of 4") && soup.includes("sentence frame"));
    check("E7 grown-ups view renders child text safely", (await page.locator("#parent-body b, #parent-body img").count()) === 0);
    check("E8 explains limits and local storage", (await page.locator(".parent-intro").innerText()).includes("does not sync"));
    check("E9 standards note present", (await page.locator("#parent-standards").innerText()).includes("Georgia standards for each skill"));
    await pieces.filter({ hasText: "the puppy" }).locator(".parent-note").fill("We read it together.");
    await page.waitForTimeout(400);
    await page.reload();
    await page.click("#parent-link");
    const notesNow = await page.locator(".parent-note").evaluateAll(n => n.map(x => x.value));
    check("E10 parent note persists", notesNow.includes("We read it together."));
    await page.screenshot({ path: path.join(OUT, "desktop-parent.png"), fullPage: true });
    await page.locator(".parent-piece", { hasText: "grandma" }).locator(".parent-delete").click();
    check("E11 delete one piece", (await page.locator(".parent-piece").count()) === 2);
    await page.click("#parent-delete-all");
    check("E12 delete all", (await page.locator(".parent-piece").count()) === 0 && (await store(page)).pieces.length === 0);

    /* ---------------- F. Existing grammar activities still work ---------------- */
    await page.click("#parent-back");
    /* Standards codes live in For grown-ups, not on the child's screens. */
    await page.click('#skill-grid button[data-skill="verb-tense"]');
    check("F1 Skill screen shows no standards codes", (await page.locator("#screen-skill .ga-tags").count()) === 0);
    await page.click('button[data-activity="learn"]');
    check("F2 Learn step shows no standards codes", (await visible(page, "#screen-learn")) && (await page.locator("#screen-learn .ga-tags").count()) === 0);
    await page.click("#learn-home");
    await page.click('#skill-grid button[data-skill="verb"]');
    await page.click('button[data-activity="practice"]');
    check("F3 Practice question shows no standards codes", (await page.locator("#screen-practice .ga-tags").count()) === 0);
    await page.click("#practice-home");
    await page.click("#parent-link");
    await page.click("#parent-standards summary");
    const gaText = await page.locator("#parent-standards").innerText();
    check("F3b For grown-ups lists verified codes per skill", gaText.includes("Verb Tense") && gaText.includes("3.L.GC.1.20") &&
      gaText.includes("Consistent verb tense") && !gaText.includes("3-5.L.GC.1") && (gaText.match(/3\.L\.V\.2\.b/g) || []).length === 1, gaText.slice(0, 300));
    await page.screenshot({ path: path.join(OUT, "desktop-parent-standards.png"), fullPage: true });
    await page.click("#parent-back");
    /* No broad mastery claims left in Test results or Learn completion. */
    const claims = await page.evaluate(() => {
      const C = window.SS_LEARN_CONTENT, out = [];
      Object.keys(C.topics).forEach(k => { const g = C.topics[k].testPool && C.topics[k].testPool.guidance; if (g) Object.values(g).forEach(t => out.push(t)); });
      Object.values(C.grammarCheck.guidance).forEach(t => out.push(t));
      return out.filter(t => /you know|you've got|you are strong|great work with|mastered|you passed/i.test(t));
    });
    check("F3c no broad mastery claims in any Test result message", claims.length === 0, claims.join(" | "));
    await page.click('#skill-grid button[data-skill="complete-sentence"]');
    await page.click('button[data-activity="learn"]');
    for (let i = 0; i < 12 && !(await visible(page, "#learn-done")); i++) {
      const choices = page.locator("#try-choices button:not([disabled])");
      if (await page.locator("#learn-try").isVisible() && await choices.count()) {
        for (const b of await choices.all()) { if (await page.locator("#learn-next").isEnabled()) break; await b.click().catch(() => {}); }
      }
      if (await page.locator("#learn-next").isEnabled()) await page.click("#learn-next");
    }
    check("F3d Learn completion names the lesson, not mastery", (await page.locator("#learn-done-title").innerText()) === "You finished the Complete Sentence lesson!",
      await page.locator("#learn-done-title").innerText().catch(() => ""));
    await page.click("#learn-done-home");
    await page.click('#skill-grid button[data-skill="complete-sentence"]');
    await page.click('button[data-activity="practice"]');
    check("F4 Complete Sentence Practice opens with choices", (await page.locator("#practice-choices button").count()) >= 2);
    await page.locator("#practice-choices button").first().click();
    check("F5 Practice gives feedback", await visible(page, "#practice-feedback"));
    await page.click("#practice-home");
    await page.click('#skill-grid button[data-skill="agreement"]');
    await page.click('button[data-activity="test"]');
    check("F6 Agreement Test intro", await visible(page, "#test-intro"));
    await page.click("#test-home");
    check("F7 Grammar Check asks what to practice", (await page.locator("#check-home").innerText()).includes("What should I practice next?"));
    await page.click("#check-start");
    check("F8 Grammar Check opens", await visible(page, "#screen-test"));
    check("F9 no page errors", page.errors.length === 0, page.errors.join(" | "));
    await ctx.close();
  }

  /* ---------------- G. Older saved data still loads ---------------- */
  {
    const { ctx, page } = await newPage(browser);
    await page.addInitScript(() => {
      if (sessionStorage.getItem("seeded")) return;
      sessionStorage.setItem("seeded", "1");
      localStorage.setItem("sentence-sense-writing-v1", JSON.stringify({ version: 1, pieces: [
        { id: "old1", promptId: "animal", status: "writing", step: "marks", draft: "a cat sat", firstDraft: "a cat sat", revision: "A cat sat.",
          marks: { who: [0, 1], what: null, text: "A cat sat." }, checks: { who: "marked", sense: "yes", detail: "enough" },
          help: { rung: 1, wordBank: false, starters: false, frameUsed: false, examples: [] }, parentNote: "", created: "2026-11-06T00:00:00Z", updated: "2026-11-06T00:00:00Z", finished: null }
      ] }));
    });
    await page.goto(BASE);
    await page.click("#next-primary");
    check("G1 a piece saved by the earlier 8-step draft resumes on Revise", (await heading(page)) === "Revise if you want to" && (await page.inputValue("#write-revision")) === "A cat sat.");
    check("G2 no page errors", page.errors.length === 0, page.errors.join(" | "));
    await ctx.close();
  }

  /* ---------------- H. Storage blocked / full / damaged ---------------- */
  {
    const { ctx, page } = await newPage(browser);
    await page.addInitScript(() => { Storage.prototype.setItem = function () { throw new Error("blocked"); }; });
    await page.goto(BASE);
    await page.click("#next-primary");
    await page.click('.prompt-btn[data-prompt="own"]');
    check("H1 blocked storage explained", (await page.locator("#write-save").innerText()).includes("isn't letting"));
    await page.fill("#write-input", "I built a fort.");
    await primary(page);
    check("H2 activity still works without storage", (await heading(page)) === "Check your sentence");
    check("H3 no page errors", page.errors.length === 0, page.errors.join(" | "));
    await ctx.close();
  }
  {
    const { ctx, page } = await newPage(browser);
    await page.addInitScript(() => {
      const real = Storage.prototype.setItem;
      Storage.prototype.setItem = function (k, v) {
        if (k === "sentence-sense-writing-v1") { const e = new Error("full"); e.name = "QuotaExceededError"; throw e; }
        return real.call(this, k, v);
      };
    });
    await page.goto(BASE);
    await page.click("#next-primary");
    await page.click('.prompt-btn[data-prompt="own"]');
    await page.fill("#write-input", "We went to the lake.");
    await page.waitForTimeout(400);
    check("H4 full storage explained", (await page.locator("#write-save").innerText()).includes("storage may be full"));
    await ctx.close();
  }
  {
    const { ctx, page } = await newPage(browser);
    await page.addInitScript(() => { if (!sessionStorage.getItem("seeded")) { localStorage.setItem("sentence-sense-writing-v1", "{not json"); sessionStorage.setItem("seeded", "1"); } });
    await page.goto(BASE);
    const keys = await page.evaluate(() => Object.keys(localStorage));
    check("H5 damaged data kept as a copy, app loads", keys.some(k => k.startsWith("sentence-sense-writing-v1-damaged")) && page.errors.length === 0);
    await ctx.close();
  }

  /* ---------------- I. Phone layout, keyboard, speech ---------------- */
  for (const vp of [{ width: 375, height: 667 }, { width: 320, height: 640 }]) {
    const { ctx, page } = await newPage(browser, { viewport: vp });
    await page.goto(BASE);
    const tag = vp.width + "x" + vp.height;
    check("I1 " + tag + " Home no sideways scroll", await noHScroll(page));
    await page.click("#next-primary");
    await page.click('.prompt-btn[data-prompt="play"]');
    await page.click("#write-help-btn"); await page.click("#write-help-btn"); await page.click("#write-help-btn");
    check("I2 " + tag + " draft + help no sideways scroll", await noHScroll(page));
    await page.fill("#write-input", "At recess, my friends and I raced to the big oak tree near the fence because we wanted to see who was the fastest runner in the whole third grade");
    await primary(page);
    check("I3 " + tag + " long sentence on Check fits", await noHScroll(page));
    await page.screenshot({ path: path.join(OUT, "phone-" + tag + "-check.png"), fullPage: true });
    await primary(page); await primary(page);
    check("I4 " + tag + " Revise fits", await noHScroll(page));
    await page.screenshot({ path: path.join(OUT, "phone-" + tag + "-revise.png"), fullPage: true });
    await ctx.close();
  }
  {
    const { ctx, page } = await newPage(browser);
    await page.goto(BASE);
    let found = false;
    for (let i = 0; i < 12 && !found; i++) { await page.keyboard.press("Tab"); found = (await focusedId(page)) === "next-primary"; }
    check("J1 keyboard reaches Start writing early", found);
    await page.keyboard.press("Enter");
    check("J2 focus moves to new step heading", (await focusedId(page)) === "write-heading");
    await page.keyboard.press("Tab"); await page.keyboard.press("Tab");
    const ring = await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle);
    check("J3 visible focus ring on prompt button", ring !== "none", ring);
    await page.keyboard.press("Enter");
    check("J4 Enter on a prompt opens the draft", (await heading(page)) === "Write your sentence");
    await page.fill("#write-input", "Our class planted beans.");
    await page.locator(".write-primary").focus();
    await page.keyboard.press("Enter");
    check("J5 focus on Check heading after keyboard submit", (await focusedId(page)) === "write-heading" && (await heading(page)) === "Check your sentence");
    await page.screenshot({ path: path.join(OUT, "desktop-check.png"), fullPage: true });
    await ctx.close();
  }
  {
    const { ctx, page } = await newPage(browser);
    await page.addInitScript(() => { delete window.speechSynthesis; delete window.SpeechSynthesisUtterance; });
    await page.goto(BASE);
    await page.click("#next-primary");
    await page.click('.prompt-btn[data-prompt="weather"]');
    check("K1 no read-aloud button without speech support", (await page.locator(".write-speak").count()) === 0 && page.errors.length === 0);
    await ctx.close();
  }

  /* ---------------- R. Build 1.9.1 regression checks for confirmed defects ---------------- */
  {
    const KEY = "sentence-sense-writing-v1";
    const seed = (id, txt) => ({ id, promptId: "animal", status: "finished", step: "compare", draft: txt, firstDraft: txt, revision: txt,
      parentNote: "", created: "2026-11-06T00:00:00Z", updated: "2026-11-06T00:00:00Z", finished: "2026-11-06T00:00:00Z" });
    /* R1-R2: two tabs. */
    {
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
      const A = await ctx.newPage(), B = await ctx.newPage();
      for (const p of [A, B]) { p.errors = []; p.on("pageerror", e => p.errors.push(e.message)); p.on("dialog", d => d.accept()); await p.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort()); }
      await A.goto(BASE);
      await A.evaluate(([k, v]) => localStorage.setItem(k, v), [KEY, JSON.stringify({ version: 1, pieces: [seed("p1", "The dog ran.")] })]);
      await A.reload();
      await B.goto(BASE);
      await A.click("#parent-link");
      const noteBox = A.locator(".parent-piece", { hasText: "The dog ran." }).locator(".parent-note");
      await noteBox.click();                                  // grown-up is already in the note box
      await B.click("#next-primary"); await B.click('.prompt-btn[data-prompt="own"]');
      await B.fill("#write-input", "We swam."); await B.locator(".write-primary").click();
      await B.waitForTimeout(300);
      await noteBox.type("Note typed after the other tab saved");
      await A.waitForTimeout(600);
      let s = await A.evaluate(k => JSON.parse(localStorage.getItem(k)), KEY);
      check("R1 parent note saves after another tab changed writing", (s.pieces.find(p => p.id === "p1") || {}).parentNote === "Note typed after the other tab saved");
      check("R1b the other tab's new piece is kept", s.pieces.some(p => p.firstDraft === "We swam."));
      check("R1c grown-ups page shows save status", (await A.locator("#parent-save").count()) > 0 && (await A.locator("#parent-save").innerText()).includes("Saved on this device"));
      /* B keeps writing while A deletes nothing: no overwrite of A's note. */
      await B.locator(".pick-row").nth(0).locator(".pick-word", { hasText: /^We$/ }).click();
      await B.locator(".write-primary").click();
      await B.fill("#write-revision", "We swam in the lake.");
      await B.waitForTimeout(500);
      s = await B.evaluate(k => JSON.parse(localStorage.getItem(k)), KEY);
      check("R2 writing in one tab doesn't erase a note saved by another", (s.pieces.find(p => p.id === "p1") || {}).parentNote === "Note typed after the other tab saved" &&
        s.pieces.some(p => p.revision === "We swam in the lake."));
      check("R2b no page errors in either tab", A.errors.length === 0 && B.errors.length === 0, A.errors.concat(B.errors).join(" | "));
      await ctx.close();
    }
    /* R3: storage readable, writes rejected. */
    {
      const { ctx, page } = await newPage(browser);
      await page.goto(BASE);
      await page.evaluate(([k, v]) => localStorage.setItem(k, v), [KEY, JSON.stringify({ version: 1, pieces: [seed("p1", "The dog ran."),
        Object.assign(seed("p2", "a cat sat"), { status: "writing", step: "revise", revision: "A cat sat.", finished: null })] })]);
      await page.addInitScript(() => { Storage.prototype.setItem = function () { const e = new Error("full"); e.name = "QuotaExceededError"; throw e; }; });
      await page.reload();
      check("R3 Home still offers to continue saved writing when writes are rejected", (await page.locator("#next-primary").innerText()).includes("Continue my sentence"));
      await page.click("#parent-link");
      check("R3b existing writing is shown when writes are rejected", (await page.locator(".parent-piece").count()) === 2);
      check("R3c message says it can show but not save", (await page.locator("#parent-save").count()) > 0 && (await page.locator("#parent-save").innerText()).includes("isn't letting Sentence Sense save new changes"));
      check("R3d no page errors", page.errors.length === 0, page.errors.join(" | "));
      await ctx.close();
    }
    /* R4: long unbroken word on a phone. */
    {
      const { ctx, page } = await newPage(browser, { viewport: { width: 320, height: 640 } });
      await page.goto(BASE);
      await page.click("#next-primary"); await page.click('.prompt-btn[data-prompt="own"]');
      await page.fill("#write-input", "Wowwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww my dog ran.");
      await primary(page);
      check("R4 long unbroken word: no sideways scroll on Check (320px)", await noHScroll(page));
      const right = await page.evaluate(() => Math.max(...[...document.querySelectorAll(".pick-word")].map(x => x.getBoundingClientRect().right)));
      check("R4b long word button stays inside the screen", right <= 320, String(right));
      await page.screenshot({ path: path.join(OUT, "phone-320-longword.png"), fullPage: true });
      await ctx.close();
    }
    /* R5: self-checks about an earlier version are labelled with that text. */
    {
      const { ctx, page } = await newPage(browser);
      await page.goto(BASE);
      await page.click("#next-primary"); await page.click('.prompt-btn[data-prompt="animal"]');
      await page.fill("#write-input", "The puppy hid."); await primary(page);
      await tapWord(page, "who", "puppy");
      await page.click('.write-choice[data-sense="yes"]'); await primary(page);
      await page.locator(".write-check input").first().check();
      await page.fill("#write-revision", "My cat slept all day."); await primary(page);
      await page.click(".write-done >> text=Show a grown-up");
      const t = await page.locator(".parent-piece .parent-cols").first().innerText();
      check("R5 parent view names the text the Check answers were about", t.includes("Check answers were about an earlier version: “The puppy hid.”"), t);
      check("R5b ticked boxes name the text they were ticked against", t.includes("ticked while the sentence read: “The puppy hid.”"), t);
      await ctx.close();
    }
  }

  /* ---------------- T. Build 1.9.1 teaching repairs ---------------- */
  {
    const { ctx, page } = await newPage(browser);
    await page.goto(BASE);
    const content = await page.evaluate(() => {
      const W = window.SS_WRITE_CONTENT;
      const food = W.prompts.find(p => p.id === "food");
      return { foodWho: food.words["Who or what"], frame: food.frame, line: W.steps.check.exampleLine, ex: W.steps.check.example.words.slice(W.steps.check.example.split.at).join(" ") };
    });
    check("T1 food word bank has no plural foods (agrees with tastes/is and the frame)",
      !content.foodWho.some(w => /(tacos|pancakes|apples)\b/.test(w)) && content.frame === "____ tastes ____.", content.foodWho.join(","));
    check("T2 Check example explanation quotes the highlighted words", content.line.includes(content.ex.replace(/\.$/, "")) && !/He found/.test(content.line), content.line);
    await page.click("#next-primary"); await page.click('.prompt-btn[data-prompt="own"]');
    await page.fill("#write-input", "Jumped over the log."); await primary(page);
    await page.click('.write-choice[data-who="missing"]'); await primary(page);
    const before = await page.inputValue("#write-revision");
    for (const k of ["who", "what", "finish"]) {
      await page.click('.write-choice[data-fix="' + k + '"]');
      const t = await page.locator("#fix-panel").innerText();
      check("T3 fix help '" + k + "' explains, models, shows a tempting wrong repair, and gives a next step",
        t.includes("One way to fix it:") && t.includes("This looks like a fix, but isn't:") && t.includes("Your turn:"), t.slice(0, 120));
      check("T3b fix help '" + k + "' uses a different sentence and doesn't touch the child's words",
        !t.includes("Jumped over the log") && (await page.inputValue("#write-revision")) === before);
      check("T3c only one fix choice pressed at a time", (await page.locator('.write-choice[data-fix][aria-pressed="true"]').count()) === 1);
    }
    await page.click("#write-detail summary");
    const ways = await page.locator(".revise-way").evaluateAll(n => n.map(x => x.dataset.way));
    check("T4 revision examples show adding, cutting, and keeping", ways.join(",") === "add,cut,keep", ways.join(","));
    await page.screenshot({ path: path.join(OUT, "desktop-revise-help.png"), fullPage: true });
    await page.setViewportSize({ width: 320, height: 640 });
    check("T5 fix help and revision examples fit a 320px phone", await noHScroll(page));
    await page.screenshot({ path: path.join(OUT, "phone-320-revise-help.png"), fullPage: true });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.fill("#write-revision", "My cat jumped over the log."); await primary(page);
    await page.click(".write-done >> text=Show a grown-up");
    const help = await page.locator(".parent-piece").first().innerText();
    check("T6 grown-ups view records which fix help was chosen", help.includes("Fix help: It doesn't say who or what") && help.includes("Fix help: My thought isn't finished"), help);
    check("T7 no page errors", page.errors.length === 0, page.errors.join(" | "));
    await ctx.close();
  }

  /* ---------------- U. Complete Sentence hints give reasoning steps ---------------- */
  {
    const { ctx, page } = await newPage(browser);
    await page.goto(BASE);
    const cov = await page.evaluate(() => window.SS_HINTS_APPLIED && window.SS_HINTS_APPLIED["complete-sentence"]);
    check("U1 every Complete Sentence practice item and the Learn try have item-specific hints", cov && cov.applied === cov.expected && cov.applied === 21, JSON.stringify(cov));
    await page.click('#skill-grid button[data-skill="complete-sentence"]');
    await page.click('button[data-activity="practice"]');
    await page.click("#practice-help"); await page.click("#practice-help");
    const fb = await page.locator("#practice-feedback").innerText();
    const sentence = await page.locator("#practice-sentence").innerText();
    const expected = await page.evaluate(s => {
      const q = window.SS_LEARN_CONTENT.topics["complete-sentence"].tryItBank.questions.find(x => x.sentence.words.join(" ").replace(/\s+/g, " ") === s.replace(/\s+/g, " ").trim());
      return q ? q.step2 : null;
    }, sentence);
    check("U2 Practice Hint 2 is the item's reasoning step", expected && fb.includes(expected), fb.slice(0, 160));
    check("U3 Practice Hint 2 crosses nothing out", (await page.locator("#practice-choices .is-ruled-out").count()) === 0);
    await page.click("#practice-home");
    await page.click('#skill-grid button[data-skill="verb"]');
    await page.click('button[data-activity="practice"]');
    await page.click("#practice-help"); await page.click("#practice-help");
    check("U4 other skills keep their existing Hint 2 (unchanged in this repair)", (await page.locator("#practice-choices .is-ruled-out").count()) > 0);
    check("U5 no page errors", page.errors.length === 0, page.errors.join(" | "));
    await ctx.close();
  }

  /* ---------------- V. "Fix it: Who is it about?" sample sequence ---------------- */
  {
    const openFix = async page => {
      await page.goto(BASE);
      await page.click('#skill-grid button[data-skill="complete-sentence"]');
      await page.click('button[data-activity="fixit"]');
    };
    const fixBody = page => page.locator("#fixit-body");
    const nextBtn = page => page.locator(".fixit-primary");
    const fixHead = page => page.locator("#fixit-heading").innerText();
    {
      const { ctx, page } = await newPage(browser);
      await page.goto(BASE);
      await page.click('#skill-grid button[data-skill="complete-sentence"]');
      check("V1 Complete Sentence shows Learn, Fix it, Practice, Test (Fix it before Practice)",
        (await page.locator("#activity-list .activity-name").allInnerTexts()).join(",") === "Learn,Fix it,Practice,Test");
      await page.click("#skill-back");
      await page.click('#skill-grid button[data-skill="verb"]');
      check("V2 other skills keep their three activities", (await page.locator("#activity-list .activity-name").count()) === 3);
      /* Notice: every wrong choice explains; Next waits for the problem to be named. */
      await openFix(page);
      check("V3 opens on Notice with focus on the heading", (await fixHead(page)) === "What's wrong with this one?" && (await focusedId(page)) === "fixit-heading");
      check("V3b Next waits until the problem is noticed", await nextBtn(page).isDisabled());
      for (const wrong of ["How big was the puddle?", "When did it happen?"]) {
        await fixBody(page).locator(".choice-btn", { hasText: wrong }).click();
        const fb = await fixBody(page).locator(".answer-feedback").innerText();
        check("V4 '" + wrong + "' explains why it isn't the problem and invites another try", /still wouldn't know who jumped|still wouldn't say who jumped/.test(fb) && fb.includes("Try again"), fb);
        check("V4b Next still waits after '" + wrong + "'", await nextBtn(page).isDisabled());
      }
      await fixBody(page).locator(".choice-btn", { hasText: "Who jumped?" }).click();
      check("V5 naming the problem unlocks Next", !(await nextBtn(page).isDisabled()));
      await nextBtn(page).click();
      const ex = (await fixBody(page).innerText()).replace(/\s+/g, " ");
      check("V6 Explain keeps the fragment's capital J and names the missing part", ex.includes("Jumped over the big puddle") && ex.includes("It is missing who"), ex.slice(0, 200));
      await nextBtn(page).click();
      const mo = (await fixBody(page).innerText()).replace(/\s+/g, " ");
      check("V7 Model shows a fix, why j changes, and other valid fixes", mo.includes("My little sister") && mo.includes("small j") && mo.includes("Other fixes work too") && mo.includes("We jumped over the big puddle."), mo.slice(0, 200));
      await nextBtn(page).click();
      check("V8 Careful: Next waits for an answer", await nextBtn(page).isDisabled());
      await fixBody(page).locator(".choice-btn", { hasText: "Yes, it's fixed" }).click();
      check("V9 the tempting 'Yes' is explained: more words didn't add a who", (await fixBody(page).locator(".answer-feedback").innerText()).includes("More words didn't fix it"));
      check("V9b after either answer Next is enabled", !(await nextBtn(page).isDisabled()));
      await fixBody(page).locator(".choice-btn", { hasText: "No, it still doesn't say who" }).click();
      check("V10 the 'No' answer is explained too", (await fixBody(page).locator(".answer-feedback").innerText()).includes("Adding details doesn't add a who"));
      await nextBtn(page).click();
      /* Your turn. */
      check("V11 Your turn shows a different fragment than the examples", (await fixBody(page).innerText()).includes("Ate all the strawberries."));
      await nextBtn(page).click();
      check("V12 empty repair gets a gentle nudge, not a mark", await fixBody(page).locator(".write-nudge").isVisible());
      for (let i = 0; i < 3; i++) await page.click("#fixit-help-btn");
      const rungs = await fixBody(page).locator(".ladder-rung").allInnerTexts();
      check("V13 Help goes question -> strategy -> sentence frame", rungs.length === 3 && rungs[0].includes("who could eat") && rungs[1].includes("Remember the fix") && rungs[2].includes("____ ate all the strawberries"), rungs.join(" | "));
      check("V13b Help me stops after three", await page.locator("#fixit-help-btn").isDisabled());
      check("V13c nothing was typed for the child", (await page.inputValue("#fixit-input")) === "");
      /* Multiple valid answers: the app never says right or wrong. */
      const tries = [
        ["We ate all the strawberries.", []],
        ["My brother ate them all!", []],
        ["The hungry bear gobbled the strawberries.", ["keptWhat"]],
        ["Ate all the strawberries.", ["startsWithAte"]]
      ];
      for (const [txt, expect] of tries) {
        await page.fill("#fixit-input", txt);
        const look = await page.locator("#fixit-look").innerText();
        const hasAte = look.includes("Is there a who before ate?"), hasKept = look.includes("Did you keep a part that tells what happens?");
        check("V14 '" + txt + "': notes are questions only, as expected", hasAte === expect.includes("startsWithAte") && hasKept === expect.includes("keptWhat") && !/\b(wrong|incorrect|correct)\b/i.test(look), look);
      }
      await page.fill("#fixit-input", "");
      await page.locator("#fixit-input").focus();
      await fixBody(page).locator(".chip-btn", { hasText: "Grandma" }).click();
      await page.keyboard.type("ate all the strawberries.");
      check("V15 an idea chip adds words without writing the sentence", (await page.inputValue("#fixit-input")) === "Grandma ate all the strawberries.");
      await fixBody(page).locator("#fixit-check .pick-word", { hasText: /^Grandma$/ }).click();
      await page.reload();
      await page.click('#skill-grid button[data-skill="complete-sentence"]');
      await page.click('button[data-activity="fixit"]');
      check("V16 refresh returns to Your turn with the child's words", (await fixHead(page)) === "Your turn" && (await page.inputValue("#fixit-input")) === "Grandma ate all the strawberries.");
      check("V16b the who taps survive a refresh", (await page.locator('#fixit-check .pick-word[aria-pressed="true"]').count()) === 1);
      await page.keyboard.press("Escape");
      check("V17 Escape returns to the skill screen", await visible(page, "#screen-skill"));
      await page.click('button[data-activity="fixit"]');
      await nextBtn(page).click();
      check("V18 last step offers a new writing prompt", (await fixHead(page)) === "Now write your own");
      const endText = await fixBody(page).innerText();
      check("V19 no mastery claims at the end", !/master|you know|you've got|perfect|you learned/i.test(endText), endText);
      await page.click("#fixit-body >> text=← Back");
      check("V20 Back from the last step shows the saved repair", (await page.inputValue("#fixit-input")) === "Grandma ate all the strawberries.");
      await nextBtn(page).click();
      await nextBtn(page).click();
      check("V21 'Write my own sentence' opens the family prompt", (await page.locator(".write-prompt-text").innerText()).includes("someone in your family"));
      await page.click("#write-home");
      check("V22 the lesson doesn't appear as 'Continue my sentence'", !(await page.locator("#next-primary").innerText()).includes("Continue"));
      await page.click("#parent-link");
      const card = await page.locator(".parent-piece", { hasText: "Fix it: Who is it about?" }).innerText();
      check("V23 grown-ups see the lesson sentence, the child's fix, and their own answers",
        card.includes("Ate all the strawberries.") && card.includes("Grandma ate all the strawberries.") && card.includes("Tapped as who: “Grandma”") && card.includes("not checked by the app"), card);
      const contentText = await page.evaluate(() => JSON.stringify(window.SS_FIXIT_CONTENT));
      check("V24 no mastery language anywhere in the sequence content", !/master|you know|you've got|perfect|great job|you learned/i.test(contentText));
      check("V25 no page errors", page.errors.length === 0, page.errors.join(" | "));
      await ctx.close();
    }
    /* Phone: every step fits at 320px; screenshots for review. */
    {
      const { ctx, page } = await newPage(browser, { viewport: { width: 320, height: 640 } });
      await openFix(page);
      const fits = [];
      const shot = async n => { fits.push(await noHScroll(page)); await page.screenshot({ path: path.join(OUT, "phone-320-fixit-" + n + ".png"), fullPage: true }); };
      await fixBody(page).locator(".choice-btn", { hasText: "Who jumped?" }).click(); await shot(1);
      await nextBtn(page).click(); await shot(2);
      await nextBtn(page).click(); await shot(3);
      await nextBtn(page).click(); await fixBody(page).locator(".choice-btn").first().click(); await shot(4);
      await nextBtn(page).click();
      await page.fill("#fixit-input", "Supercalifragilisticexpialidocious bears ate all the strawberries.");
      await page.click("#fixit-help-btn"); await shot(5);
      await nextBtn(page).click(); await shot(6);
      check("V26 every step fits a 320px phone (no sideways scroll)", fits.every(Boolean), fits.join(","));
      await ctx.close();
    }
  }

  /* ---------------- W. One word / junk letters: honest finish ---------------- */
  {
    const { ctx, page } = await newPage(browser);
    await page.goto(BASE);
    const cases = [
      ["Ddddd", ["ending", "oneWord", "spelling"]],
      ["Dog.", ["oneWord"]],
      ["Stop!", []],
      ["Wow!", []],
      ["The dog ran sooo fast.", ["spelling"]],
      ["My cat likes the rhythm of the rain.", []],
      ["Mississippi is a long river.", []],
      ["Grandma and I baked cookies.", []]
    ];
    const got = await page.evaluate(cs => cs.map(c => window.SS_WRITE._looksAt(c[0]).map(x => x.key)), cases);
    cases.forEach((c, i) => check("W" + (i + 1) + " notes for " + JSON.stringify(c[0]) + " = [" + c[1].join(",") + "]",
      JSON.stringify(got[i].slice().sort()) === JSON.stringify(c[1].slice().sort()), "got [" + got[i].join(",") + "]"));
    await page.click("#next-primary"); await page.click('.prompt-btn[data-prompt="animal"]');
    await page.fill("#write-input", "Ddddd"); await primary(page);
    await primary(page); await primary(page);   // nudge once on Check, then Revise
    check("W9 Revise names the word to look at", (await page.locator("#write-look").innerText()).includes("Look at “Ddddd”"));
    await primary(page);
    check("W10 finishing with open notes pauses once and asks", await page.locator("#write-gate").isVisible() && (await heading(page)) === "Revise if you want to");
    await page.click("#write-gate >> text=Go back and look");
    check("W11 'Go back and look' returns to the sentence box", (await focusedId(page)) === "write-revision" && !(await page.locator("#write-gate").isVisible()));
    await primary(page); await page.click("#write-finish-anyway");
    const pr = await page.locator(".praise-list").innerText();
    check("W12 no 'writer's choice' praise while notes are open", !pr.includes("writer's choice") && pr.includes("You kept your sentence the same."), pr);
    check("W13 Compare lists what is still worth a look", (await page.locator("#write-still").innerText()).includes("Look at “Ddddd”"));
    await page.click("#write-revise-again");
    check("W14 'Revise it' reopens Revise with the sentence", (await heading(page)) === "Revise if you want to" && (await page.inputValue("#write-revision")) === "Ddddd");
    await page.fill("#write-revision", "My dog dug a hole."); await primary(page);
    check("W15 after fixing, finishing doesn't pause and nothing is listed", !(await page.locator("#write-still").count()) && (await heading(page)) === "Your two versions");
    await page.click(".write-done >> text=Show a grown-up");
    check("W16 grown-ups see what was noted at finish", (await page.locator(".parent-piece").first().innerText()).includes("Nothing noted by the app when finished."));
    check("W17 no page errors", page.errors.length === 0, page.errors.join(" | "));
    await ctx.close();
  }

  /* ---------------- X. A grown-up's own check ---------------- */
  {
    const { ctx, page } = await newPage(browser);
    await page.goto(BASE);
    await page.click("#next-primary"); await page.click('.prompt-btn[data-prompt="animal"]');
    await page.fill("#write-input", "My dog ran"); await primary(page);
    await primary(page); await primary(page);
    await primary(page); await page.click("#write-finish-anyway");
    await page.click(".write-done >> text=Show a grown-up");
    const card = page.locator(".parent-piece").first();
    check("X1 each piece starts 'Not checked by a grown-up yet'", (await card.locator(".parent-review-status").innerText()).includes("Not checked by a grown-up yet"));
    await card.locator('.write-choice[data-review="fix"]').click();
    check("X2 marking 'Let's fix it together' says Chris will see it", (await card.locator(".parent-review-status").innerText()).includes("will see this on Home"));
    check("X2b only one mark pressed", (await card.locator('.write-choice[data-review][aria-pressed="true"]').count()) === 1);
    await page.waitForTimeout(400);
    await page.reload();
    check("X3 Home shows the grown-up's request with the sentence", (await page.locator("#next-review").innerText()).includes("A grown-up wants to fix this one with you") &&
      (await page.locator("#next-review").innerText()).includes("My dog ran"));
    await page.click("#next-review-open");
    check("X4 'Open it' reopens that sentence on Revise", (await heading(page)) === "Revise if you want to" && (await page.inputValue("#write-revision")) === "My dog ran");
    await page.fill("#write-revision", "My dog ran to the park."); await primary(page);
    await page.click(".write-done >> text=Home");
    check("X5 the request isn't shown again after it was opened", (await page.locator("#next-review").count()) === 0);
    await page.click("#parent-link");
    const st = await page.locator(".parent-piece").first().locator(".parent-review-status").innerText();
    check("X6 grown-ups see their mark was about an earlier version", st.includes("about an earlier version: “My dog ran”") && st.includes("has seen it"), st);
    await page.locator(".parent-piece").first().locator('.write-choice[data-review="good"]').click();
    await page.waitForTimeout(400);
    await page.click("#parent-back");
    check("X7 'Looks good ✓' appears on Home", (await page.locator("#next-review").innerText()).includes("Looks good ✓"));
    await page.click("#next-review-ok");
    check("X8 OK hides it", (await page.locator("#next-review").count()) === 0);
    await page.reload();
    check("X9 and it stays hidden after a refresh", (await page.locator("#next-review").count()) === 0);
    check("X10 no page errors", page.errors.length === 0, page.errors.join(" | "));
    await ctx.close();
  }

  /* ---------------- Y. Built-in word list: spelling questions ---------------- */
  {
    const { ctx, page } = await newPage(browser);
    await page.goto(BASE);
    const r = await page.evaluate(() => {
      const L = t => window.SS_WRITE._looksAt(t).filter(x => x.key === "spelling").map(x => x.text);
      const W = window.SS_WRITE_CONTENT, F = window.SS_FIXIT_CONTENT;
      const own = JSON.stringify([W, F]).toLowerCase().match(/[a-z]+/g);
      return {
        loaded: !!(window.SS_WORDS && window.SS_WORDS.size > 40000),
        misspelled: L("We went home becuase my freind was sick."),
        names: L("Jada and Mr. Okonkwo visited Atlanta."),
        contractions: L("I don't think it's my sister's turn."),
        dont: L("I dont know."),
        clean: ["My dog chased a squirrel up the tree.", "The puppy hid under my bed all morning.", "Grandma baked cookies after dinner.",
          "At recess, my friends and I raced to the big oak tree.", "We stayed inside because it was raining.", "We left at 3 p.m. on Friday."].map(L),
        ownUnknown: own.filter(w => !window.SS_WORDS.has(w))
      };
    });
    check("Y1 the built-in word list loads (40,000+ common words)", r.loaded);
    check("Y2 misspelled words are asked about by name", r.misspelled.length === 2 && r.misspelled[0].includes("“becuase”") && r.misspelled[1].includes("“freind”"), r.misspelled.join(" | "));
    check("Y3 capitalized names are not questioned", r.names.length === 0, r.names.join(" | "));
    check("Y4 contractions and possessives are not questioned", r.contractions.length === 0, r.contractions.join(" | "));
    check("Y5 'dont' without an apostrophe is asked about", r.dont.length === 1 && r.dont[0].includes("“dont”"), r.dont.join(" | "));
    check("Y6 ordinary sentences get no spelling questions", r.clean.every(x => x.length === 0), JSON.stringify(r.clean));
    check("Y7 every word the app itself suggests is in the list", r.ownUnknown.length === 0, r.ownUnknown.join(","));
    check("Y8 no page errors", page.errors.length === 0, page.errors.join(" | "));
    await ctx.close();
  }

  await browser.close();
  const failed = results.filter(r => !r.ok);
  fs.writeFileSync(path.join(OUT, "write-results.json"), JSON.stringify({ date: new Date().toISOString(), passed: results.length - failed.length, failed: failed.length, results }, null, 2));
  console.log("\n" + (results.length - failed.length) + " passed, " + failed.length + " failed");
  process.exit(failed.length ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
