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
    check("A1 build badge is 1.9.0", (await page.locator("#build-badge").innerText()).includes("Build 1.9.0"));
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
    check("C10 two sentences noticed as 'more than one', nothing else", looks.join(",") === "many", looks.join(","));
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
    check("E5 help and detail use recorded", puppy.includes("Opened the optional detail ideas") && puppy.includes("Put the first draft back"), puppy);
    const soup = await pieces.filter({ hasText: "grandma" }).innerText();
    check("E6 supported piece shows help used", soup.includes("Help me: 4 of 4") && soup.includes("sentence frame"));
    check("E7 grown-ups view renders child text safely", (await page.locator("#parent-body b, #parent-body img").count()) === 0);
    check("E8 explains limits and local storage", (await page.locator(".parent-intro").innerText()).includes("does not sync"));
    check("E9 standards note present", (await page.locator("#parent-standards").innerText()).includes("About the Georgia standards"));
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
    await page.click('#skill-grid button[data-skill="verb-tense"]');
    const tags = await page.locator("#skill-ga").innerText();
    check("F1 Verb Tense tags use verified codes", !tags.includes("3-5.L.GC.1") && tags.includes("3.L.GC.1.20") && tags.includes("Consistent verb tense"), tags);
    await page.click('button[data-activity="learn"]');
    check("F2 Verb Tense Learn opens", await visible(page, "#screen-learn"));
    await page.click("#learn-home");
    await page.click('#skill-grid button[data-skill="adverb"]');
    check("F3 unverified 3.L.V.2.b not shown", !(await page.locator("#skill-ga").innerText()).includes("3.L.V.2.b"));
    await page.click("#skill-back");
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

  await browser.close();
  const failed = results.filter(r => !r.ok);
  fs.writeFileSync(path.join(OUT, "write-results.json"), JSON.stringify({ date: new Date().toISOString(), passed: results.length - failed.length, failed: failed.length, results }, null, 2));
  console.log("\n" + (results.length - failed.length) + " passed, " + failed.length + " failed");
  process.exit(failed.length ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
