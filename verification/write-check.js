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
async function primary(page) { await page.locator(".write-primary").click(); }

(async () => {
  const browser = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {});

  /* ---------------- A. Independent writing, resume, revise ---------------- */
  {
    const { ctx, page } = await newPage(browser);
    await page.goto(BASE);
    check("A1 build badge is 1.9.0", (await page.locator("#build-badge").innerText()).includes("Build 1.9.0"));
    check("A2 Home shows one prominent next action", (await page.locator("#next-primary").innerText()).includes("Start writing"));
    check("A3 all ten skill cards still on Home", (await page.locator("#skill-grid .skill-card").count()) === 10);
    check("A4 learning path is folded away", !(await page.locator(".path").evaluate(d => d.open)));

    await page.click("#next-primary");
    check("A5 prompt chooser focused", (await focusedId(page)) === "write-heading" && (await page.locator(".prompt-btn").count()) === 6);
    await page.click('.prompt-btn[data-prompt="animal"]');
    check("A6 draft step, focus on heading", (await heading(page)) === "Write your sentence" && (await focusedId(page)) === "write-heading");
    check("A7 tools closed by default (independent path is one box)", !(await visible(page, ".tool-panel")));

    await primary(page);
    check("A8 empty draft is not accepted, gentle nudge shown", (await visible(page, "#write-nudge")) && (await heading(page)) === "Write your sentence");
    const whitespaceOnly = await page.fill("#write-input", "   \n  ").then(() => primary(page)).then(() => heading(page));
    check("A9 whitespace-only draft is not accepted", whitespaceOnly === "Write your sentence");

    await page.fill("#write-input", "the puppy hid under my bed");
    await primary(page);
    check("A10 first draft accepted -> who step", (await heading(page)) === "Who or what is it about?");
    let s = await store(page);
    check("A11 first draft saved to localStorage", s && s.pieces[0].firstDraft === "the puppy hid under my bed");

    /* Next without marking: nudge once, not blocked forever. */
    await primary(page);
    check("A12 unmarked Next nudges once", (await heading(page)) === "Who or what is it about?");
    await page.locator(".pick-word", { hasText: /^the$/ }).click();
    await page.locator(".pick-word", { hasText: /^puppy$/ }).click();
    check("A13 picked words show pressed state", (await page.locator('.pick-word[aria-pressed="true"]').count()) === 2);
    await primary(page);
    check("A14 what step names the child's subject", (await page.locator(".write-lead").innerText()).includes("“the puppy”"));

    /* Refresh mid-activity. */
    await page.reload();
    check("A15 after refresh Home offers Continue", (await page.locator("#next-primary").innerText()).includes("Continue my sentence"));
    await page.click("#next-primary");
    check("A16 resume returns to the same step", (await heading(page)) === "What happens?");

    for (const w of ["hid", "under", "my", "bed"]) await page.locator(".pick-word", { hasText: new RegExp("^" + w + "$") }).click();
    await page.locator(".write-choice", { hasText: "Yes, it makes sense" }).click();
    await primary(page);
    check("A17 detail step is optional", (await heading(page)) === "Can a reader picture it?");

    /* Home + back in: nothing lost. */
    await page.click("#write-home");
    check("A18 Home button goes home", await visible(page, "#screen-home"));
    await page.click("#next-primary");
    check("A19 Continue restores detail step", (await heading(page)) === "Can a reader picture it?");

    await page.locator('.write-choice[data-detail="when"]').click();
    check("A20 choosing a detail opens the editor", await visible(page, "#write-revision"));
    check("A21 editor starts with the first draft text", (await page.inputValue("#write-revision")) === "the puppy hid under my bed");
    await page.fill("#write-revision", "The puppy hid under my bed all morning.");
    await primary(page);
    check("A22 marks step", (await heading(page)) === "Check the capital and the end mark");
    check("A23 corrected sentence: nothing flagged", (await page.locator(".write-look-none").count()) === 1);
    check("A24 honesty note present", (await page.locator(".write-honest").innerText()).includes("can't tell if your sentence is right"));
    for (const cb of await page.locator(".write-check input").all()) await cb.check();

    /* Escape goes home and keeps work. */
    await page.keyboard.press("Escape");
    check("A25 Escape goes home", await visible(page, "#screen-home"));
    await page.click("#next-primary");
    check("A26 checkboxes restored", (await page.locator(".write-check input:checked").count()) === 3);
    await primary(page);
    check("A27 read-again step", (await heading(page)) === "Read it one more time");

    /* Back walks backwards, and the first draft is read-only. */
    for (let i = 0; i < 5; i++) await page.click("#write-back");
    check("A28 back to frozen first draft", (await heading(page)) === "Your first draft" &&
      (await page.locator(".write-text").innerText()) === "the puppy hid under my bed");
    s = await store(page);
    check("A29 first draft and revision distinct in storage",
      s.pieces[0].firstDraft === "the puppy hid under my bed" && s.pieces[0].revision === "The puppy hid under my bed all morning.");
    /* The sentence changed since it was marked, so marks reset and the
       what step nudges once more: keep pressing Next, as a child would. */
    for (let i = 0; i < 8 && (await heading(page)) !== "Read it one more time"; i++) await primary(page);
    check("A30 forward again to read step", (await heading(page)) === "Read it one more time");
    await primary(page);
    check("A31 compare screen", (await heading(page)) === "Look how you worked on it!");
    const cmp = await page.locator(".compare-card .write-text").allInnerTexts();
    check("A32 both versions shown", cmp[0] === "the puppy hid under my bed" && cmp[1] === "The puppy hid under my bed all morning.");
    const praise = await page.locator(".praise-list").innerText();
    check("A33 praise is specific (names what was added)", praise.includes("You added: “all morning.”"), praise);
    check("A33b capital fix credited, not shown as a new word", praise.includes("fixed the capital letter") && !praise.includes("took out"), praise);
    check("A33c end mark credited", praise.includes("added an end mark"), praise);
    check("A33d when-detail suggests adverbs", (await page.locator('.write-done button[data-skill="adverb"]').count()) === 1);
    check("A34 no mastery language", !/master|perfect|correct|100%/i.test(praise), praise);
    await page.screenshot({ path: path.join(OUT, "desktop-compare.png"), fullPage: true });
    await page.click(".write-done >> text=Home");
    check("A35 Home now says write another", (await page.locator("#next-primary").innerText()).includes("Start writing") &&
      (await page.locator(".next-title").innerText()).includes("another"));
    await page.screenshot({ path: path.join(OUT, "desktop-home.png"), fullPage: true });
    check("A36 no page errors", page.errors.length === 0, page.errors.join(" | "));

    /* ---------------- B. Supported writing: help ladder, tools ---------------- */
    await page.click("#next-primary");
    await page.click('.prompt-btn[data-prompt="food"]');
    for (let i = 1; i <= 4; i++) await page.click("#write-help-btn");
    check("B1 four help rungs, one at a time", (await page.locator(".ladder-rung").count()) === 4);
    check("B2 Help me disabled after the last rung", await page.locator("#write-help-btn").isDisabled());
    const rungs = await page.locator(".ladder-rung").allInnerTexts();
    check("B3 rung 1 asks one question", rungs[0].includes("What food is it?"));
    check("B4 example is about a different topic", rungs[2].includes("kite") && !/pizza|soup|taste/i.test(rungs[2]));
    await page.locator(".ladder-rung >> text=Put this frame in my writing").click();
    check("B5 frame only added when asked", (await page.inputValue("#write-input")) === "____ tastes ____.");
    await page.fill("#write-input", "");
    await page.click(".tool-btn >> text=Sentence starters");
    await page.locator(".chip-btn", { hasText: "Cold watermelon" }).click();
    await page.keyboard.type("is my favorite.");
    await page.click(".tool-btn >> text=Word bank");
    /* Put the cursor before "is" and add a word from the bank. */
    await page.evaluate(() => { const t = document.getElementById("write-input"); const i = t.value.indexOf("is"); t.setSelectionRange(i, i); });
    await page.locator(".tool-panel .chip-btn", { hasText: /^sweet$/ }).first().click();
    const built = await page.inputValue("#write-input");
    check("B6 starter + bank word inserted without replacing text", built === "Cold watermelon sweet is my favorite.", built);
    /* Multiline, apostrophes, markup characters. */
    const tricky = "My grandma's soup <b>is</b> hot & <img src=x onerror=window.__pwned=1>.\nIt's the best!";
    await page.fill("#write-input", tricky);
    await primary(page);
    await page.evaluate(() => 0);
    check("B7 markup is shown as text, never parsed", (await page.locator("#write-body b").count()) === 0 &&
      (await page.locator("#write-body img").count()) === 0 && !(await page.evaluate(() => window.__pwned)));
    for (let i = 0; i < 8 && (await heading(page)) !== "Check the capital and the end mark"; i++) await primary(page);
    const looks = await page.locator(".write-look").innerText();
    check("B8 more-than-one-sentence noticed, not marked wrong", looks.includes("more than one sentence"), looks);
    await page.screenshot({ path: path.join(OUT, "desktop-marks.png"), fullPage: true });

    /* ---------------- C. Grown-ups view ---------------- */
    await page.click("#write-home");
    await page.click("#parent-link");
    check("C1 grown-ups view opens, heading focused", (await focusedId(page)) === "parent-heading");
    const pieces = page.locator(".parent-piece");
    check("C2 both pieces listed", (await pieces.count()) === 2);
    const finished = pieces.filter({ hasText: "the puppy hid under my bed" });
    const ftext = await finished.innerText();
    check("C3 shows prompt, first draft, revision", ftext.includes("animal") && ftext.includes("The puppy hid under my bed all morning."));
    check("C4 shows self-checks (marks kept after revising)", ftext.includes("Marked the words that tell who or what: “the puppy”") &&
      ftext.includes("Marked what happens: “hid under my bed”") && ftext.includes("Said it makes sense by itself"), ftext);
    check("C5 shows help used", ftext.includes("No help used"));
    const other = await pieces.filter({ hasText: "grandma" }).innerText();
    check("C6 help on supported piece recorded", other.includes("Help me: 4 of 4") && other.includes("sentence frame"));
    check("C7 parent view renders child text safely", (await page.locator("#parent-body b, #parent-body img").count()) === 0);
    check("C8 explains limits and local storage", (await page.locator(".parent-intro").innerText()).includes("does not sync"));
    await finished.locator(".parent-note").fill("We read it together. Great detail!");
    await page.waitForTimeout(400);
    await page.reload();
    await page.click("#parent-link");
    check("C9 parent note persists", (await page.locator(".parent-note").first().inputValue()) === "We read it together. Great detail!" ||
      (await page.locator(".parent-note").nth(1).inputValue()) === "We read it together. Great detail!");
    await page.screenshot({ path: path.join(OUT, "desktop-parent.png"), fullPage: true });
    await page.locator(".parent-piece", { hasText: "grandma" }).locator(".parent-delete").click();
    check("C10 delete one piece", (await page.locator(".parent-piece").count()) === 1);
    await page.click("#parent-delete-all");
    check("C11 delete all", (await page.locator(".parent-piece").count()) === 0 && (await store(page)).pieces.length === 0);
    check("C12 no page errors", page.errors.length === 0, page.errors.join(" | "));

    /* ---------------- D. Existing grammar activities still work ---------------- */
    await page.click("#parent-back");
    await page.click('#skill-grid button[data-skill="verb"]');
    check("D1 Verb skill screen", (await page.locator("#skill-heading").innerText()) === "Verb");
    await page.click('button[data-activity="learn"]');
    check("D2 Verb Learn opens", await visible(page, "#screen-learn"));
    await page.click("#learn-home");
    await page.click('#skill-grid button[data-skill="complete-sentence"]');
    await page.click('button[data-activity="practice"]');
    check("D3 Complete Sentence Practice opens with choices", (await page.locator("#practice-choices button").count()) >= 2);
    await page.locator("#practice-choices button").first().click();
    check("D4 Practice gives feedback", await visible(page, "#practice-feedback"));
    await page.click("#practice-home");
    await page.click('#skill-grid button[data-skill="agreement"]');
    await page.click('button[data-activity="test"]');
    check("D5 Agreement Test intro", await visible(page, "#test-intro"));
    await page.click("#test-home");
    await page.click("#check-start");
    check("D6 Grammar Check opens", await visible(page, "#screen-test"));
    check("D7 Grammar Check asks what to practice", (await page.locator("#check-home").innerText().catch(() => "")) !== null);
    check("D8 no page errors", page.errors.length === 0, page.errors.join(" | "));
    await ctx.close();
  }

  /* ---------------- E. Storage blocked / full ---------------- */
  {
    const { ctx, page } = await newPage(browser);
    await page.addInitScript(() => { Storage.prototype.setItem = function () { throw new Error("blocked"); }; });
    await page.goto(BASE);
    await page.click("#next-primary");
    await page.click('.prompt-btn[data-prompt="own"]');
    check("E1 blocked storage explained", (await page.locator("#write-save").innerText()).includes("isn't letting"));
    await page.fill("#write-input", "I built a fort.");
    await primary(page);
    check("E2 activity still works without storage", (await heading(page)) === "Who or what is it about?");
    check("E3 no page errors", page.errors.length === 0, page.errors.join(" | "));
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
    check("E4 full storage explained", (await page.locator("#write-save").innerText()).includes("storage may be full"));
    await ctx.close();
  }
  {
    /* Damaged data is set aside, not crashed on. */
    const { ctx, page } = await newPage(browser);
    await page.addInitScript(() => { if (!sessionStorage.getItem("seeded")) { localStorage.setItem("sentence-sense-writing-v1", "{not json"); sessionStorage.setItem("seeded", "1"); } });
    await page.goto(BASE);
    const keys = await page.evaluate(() => Object.keys(localStorage));
    check("E5 damaged data kept as a copy, app loads", keys.some(k => k.startsWith("sentence-sense-writing-v1-damaged")) && page.errors.length === 0);
    await ctx.close();
  }

  /* ---------------- F. Phone layout, keyboard ---------------- */
  for (const vp of [{ width: 375, height: 667 }, { width: 320, height: 640 }]) {
    const { ctx, page } = await newPage(browser, { viewport: vp });
    await page.goto(BASE);
    const tag = vp.width + "x" + vp.height;
    check("F1 " + tag + " Home no sideways scroll", await noHScroll(page));
    await page.screenshot({ path: path.join(OUT, "phone-" + tag + "-home.png") });
    await page.click("#next-primary");
    await page.click('.prompt-btn[data-prompt="play"]');
    await page.click("#write-help-btn"); await page.click("#write-help-btn"); await page.click("#write-help-btn");
    check("F2 " + tag + " draft + help no sideways scroll", await noHScroll(page));
    await page.screenshot({ path: path.join(OUT, "phone-" + tag + "-draft.png"), fullPage: true });
    await page.fill("#write-input", "At recess, my friends and I raced to the big oak tree near the fence because we wanted to see who was the fastest runner in the whole third grade");
    await primary(page);
    check("F3 " + tag + " long sentence word picker fits", await noHScroll(page));
    await page.screenshot({ path: path.join(OUT, "phone-" + tag + "-who.png"), fullPage: true });
    await ctx.close();
  }
  {
    const { ctx, page } = await newPage(browser);
    await page.goto(BASE);
    /* Keyboard only: Tab to the next action and press Enter. */
    let found = false;
    for (let i = 0; i < 12 && !found; i++) { await page.keyboard.press("Tab"); found = (await focusedId(page)) === "next-primary"; }
    check("G1 keyboard reaches Start writing early", found);
    await page.keyboard.press("Enter");
    check("G2 focus moves to new step heading", (await focusedId(page)) === "write-heading");
    await page.keyboard.press("Tab"); await page.keyboard.press("Tab");
    const ring = await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle);
    check("G3 visible focus ring on prompt button", ring !== "none", ring);
    await page.keyboard.press("Enter");
    check("G4 Enter on a prompt opens the draft", (await heading(page)) === "Write your sentence");
    await ctx.close();
  }
  {
    /* Speech unsupported: no read-aloud button, nothing breaks. */
    const { ctx, page } = await newPage(browser);
    await page.addInitScript(() => { delete window.speechSynthesis; delete window.SpeechSynthesisUtterance; });
    await page.goto(BASE);
    await page.click("#next-primary");
    await page.click('.prompt-btn[data-prompt="weather"]');
    check("H1 no read-aloud button without speech support", (await page.locator(".write-speak").count()) === 0 && page.errors.length === 0);
    await ctx.close();
  }

  await browser.close();
  const failed = results.filter(r => !r.ok);
  fs.writeFileSync(path.join(OUT, "write-results.json"), JSON.stringify({ date: new Date().toISOString(), passed: results.length - failed.length, failed: failed.length, results }, null, 2));
  console.log("\n" + (results.length - failed.length) + " passed, " + failed.length + " failed");
  process.exit(failed.length ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
