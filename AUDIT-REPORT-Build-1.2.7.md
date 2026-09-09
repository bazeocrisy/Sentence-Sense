# Sentence Sense — Build 1.2.7 Audit Report

**Build:** Sentence Sense — Build 1.2.7
**Type:** Controlled correction build — engine hardening + responsive regression
**Date:** 2026-09-08
**Purpose:** Make the Verb guided-bank engine safe to reuse. **No second bank was built.**

---

## VERDICT

| Dimension | Verdict |
|---|---|
| **APPLICATION STABILITY** | **PASS** |
| **INSTRUCTIONAL ACCURACY** | **PASS** |
| **VERB BANK** | **PASS** |
| **RESPONSIVE UX** | **PASS WITH KNOWN ISSUES** (D-27 open, measured) |
| **ACCESSIBILITY** | **PASS WITH KNOWN ISSUES** (D-35 deferred) |
| **DOCUMENTATION** | **PASS** |
| **VERB ENGINE REUSE READINESS** | **YES** |
| **OVERALL BUILD 1.2.7** | **PASS WITH KNOWN ISSUES** |

Five defects closed: **D-28, D-29, D-30, D-33, D-36**. Two closed as design/scope:
**D-11, D-13**. Two remain open by instruction: **D-27** (re-measured), **D-26**
(deferred). One remains open unchanged: **D-20**. Every previously closed defect
was re-verified and none regressed.

---

## 1. RECONCILIATION BEFORE EDITING

The delivered Build 1.2.6 `Sentence-Sense.zip` was extracted clean and compared
against the working tree: **identical, no discrepancy.** All five target defects
were reproduced in source and in behaviour before anything was changed.

| Defect | Reproduced how | Confirmed |
|---|---|---|
| **D-28** | `css/styles.css` line 883 `@media (min-width:1600px)` sets `--sentence-size`, `--lesson-text`, `--lesson-max` and `.lesson-title` with **no `min-height`**. Measured: 1280×720 Predicate Clue 111px scroll → 1600×720 **152px** | Yes |
| **D-29** | Correct-answer index across the 20 questions: position 1 = **0**, position 2 = **4**, position 3 = **16**, position 4 = **0**. `buildBankQuestion()` renders `q.choices.forEach(...)` in data order, no shuffle | Yes |
| **D-30** | `js/learn.js` line 434 branches on `lesson.bank` (a truthy object) and hard-codes Verb's wording | Yes |
| **D-33** | `topics.verb.tryIt` held *"The small dog jumped over the log."*, unreachable because `bankFor()` returns the bank and the engine prefers it | Yes |
| **D-36** | `answerBank()` third strike: `b => q.choices.some(c => c.correct && c.text === b.textContent)` | Yes |
| **D-11** | Topic portal: all six cards visible without scrolling at 768×1024, 1366×768 and 1920×1080 | Closure candidate confirmed |
| **D-13** | Completion is terminal: `#lesson-controls` hidden, no Back control, four deliberate exits, `done-next` correctly hidden on the last topic | Closure candidate confirmed |

### NEW DISCREPANCIES FOUND AND REPORTED BEFORE EDITING

**N-1 — D-36 does not apply to the single-question path.** `answerTryIt()`, used
by the other five topics, has no third-strike reveal at all and therefore no
`textContent` matching. **D-36 is confined to the bank path.** The fix is
narrower than the defect record implied.

**N-2 — D-29 does not apply to the other five topics.** Their single Try It
questions place the correct answer at positions **2, 1, 1, 4, 1** (subject,
complete-subject, predicate, noun, adjective) — already well distributed, and
with one question per topic there is no positional pattern for a child to learn.
**D-29 is confined to the bank.** Per §12 the single-question render path was
therefore left untouched; changing five topics' rendered order would have been a
change with no defect behind it.

**N-3 — removing `verb.tryIt` broke the step heading (found by the new harness,
fixed in this build).** `renderStep()` read `block.title` for every step,
including Try It. With `verb.tryIt` gone, `block` was `undefined` and the Verb
Try It step threw `Cannot read properties of undefined (reading 'title')`. This
was **caused by the D-33 fix and caught by the new bank guard before delivery**.
`renderStep()` now resolves the heading safely and guards `renderBlock` against
a missing block, so a bank topic needs no `tryIt` block at all. The rendered
headings are unchanged: `Verb — Try it`, identical in form to `Subject — Try it`.

---

## 2. THE COMPLETE CHANGE SET

Five files. Every change is listed.

### `js/app.js` — 2 lines
```
-   Build 1.2.5 — SHELL + HOME PORTAL + LEARN MODE ROUTING.
+   Build 1.2.7 — SHELL + HOME PORTAL + LEARN MODE ROUTING.
-  const BUILD_NUMBER = "Build 1.2.6";
+  const BUILD_NUMBER = "Build 1.2.7";
```
The stale file-header comment (D-31) is fixed. **Historical provenance comments
elsewhere — `Build 1.1.1 (D-07)`, `Build 1.2.5: …` — were not touched**; they
correctly record when a feature was introduced.

### `js/data/learn-content.js` — D-30 and D-33
- **Added** `tryItBank.recap` carrying the approved Verb wording, unchanged:
  *"You practiced finding action and being verbs in 20 different sentences."*
- **Removed** the dead `topics.verb.tryIt` block, replaced by a comment
  explaining why a bank topic has one source of truth and why no hidden fallback
  should be reintroduced.
- **No question, sentence, answer, distractor, feedback, clue, reveal, stage or
  milestone was altered.**

### `js/learn.js` — D-30, D-29, D-36, and the N-3 fix
```js
// D-30 — the engine no longer knows what any topic teaches
el("done-recap").textContent = (lesson.bank && lesson.bank.recap)
  ? lesson.bank.recap : t.recap;

// D-29 + D-36 — shuffle at render, carry identity that is not text
shuffled(q.choices.map((c, i) => i)).forEach(ci => {
  const choice = q.choices[ci];
  const btn = make("button", "tryit-choice");
  btn.dataset.ci = String(ci);
  ...
});

// D-36 — the reveal matches identity, never rendered text
const correctIndex = q.choices.findIndex(c => c.correct);
const right = Array.prototype.filter.call(buttons,
  b => Number(b.dataset.ci) === correctIndex)[0];

// N-3 — a bank topic has no tryIt block to read a title from
el("lesson-heading").textContent =
  t.name + " — " + ((block && block.title) || "Try it");
```
The choice shuffle reuses the existing `shuffled()` Fisher-Yates helper.
**Question order and choice order are separate concerns:** `resetBank()` still
shuffles questions within a stage and never across stages; the choice shuffle
happens per render and touches nothing else.

### `css/styles.css` — D-28
```
-@media (min-width:1600px){
+@media (min-width:1600px) and (min-height:900px){
```
plus a comment recording the permanent rule.

### Harnesses (outside the project ZIP)
`bankguard.js` and `respguard.js` are new. `stateguard.js`, `checks.js` and
`q20.js` were updated — see §7.

---

## 3. HOW THE HEIGHT GUARD WAS CHOSEN

Not copied from an arbitrary breakpoint. The threshold was **measured**: at
width 1600 (where the enhanced scale applies), heights were swept against the
three densest screens.

| Height | Predicate Clue @1280 → @1600 | Noun Clue @1280 → @1600 | Verb Def @1280 → @1600 | Wider worse? |
|---|---|---|---|---|
| 650 | 181 → **222** | 102 → **167** | 76 → **110** | yes |
| 720 | 111 → **152** | 32 → **97** | 6 → **40** | yes |
| 800 | 31 → **72** | 0 → **17** | 0 → 0 | yes |
| 840 | 0 → **32** | 0 → 0 | 0 → 0 | yes |
| 860 | 0 → **12** | 0 → 0 | 0 → 0 | yes |
| **880** | **0 → 0** | 0 → 0 | 0 → 0 | **no** |
| 900 | 0 → 0 | 0 → 0 | 0 → 0 | no |

The scale becomes safe at **880px**. **900px** was chosen: the measured
threshold rounded up to a standard breakpoint, with margin, and coherent with
the ladder already in the file — `min-height:950px` at 1500px above it,
`min-height:1100px` at 1800px below it.

---

## 4. VERIFICATION OF EACH FIX

### D-28 — CLOSED

| Check | Result |
|---|---|
| Non-monotonic regression: 5 width pairs × 9 screens at equal height | **0 violations** (was 15 in 1.2.6) |
| Enhanced type OFF on wide-but-short | 1600×720 = **1.55rem** · 1920×800 = **1.55rem** · base 1280×720 = 1.55rem |
| Enhanced type ON when height supports it | 1600×900 = **1.9rem** · 1920×1080 = **1.9rem** |
| Projector treatment preserved (D-22) | 1920×1200 = **2.6rem** · 2560×1440 = **2.6rem** |
| Adjective marked sentence at 1600×720 | 2 rows, scroll **48px** (was **119px**) |
| Noun Clue at 1920×800 | scroll **0** (was 17px) |
| CSS lint: any ≥1500px media query enlarging type without a `min-height` guard | **0** on 1.2.7; the same lint reports **FAIL — unguarded: (min-width:1600px)** on 1.2.6 |

**Visual:** `screenshots/D28_predicate-Clue_1600x720.png` shows the whole Clue
screen with Back and Next fully visible. In 1.2.6 the same screen sliced both
buttons at the fold.

### D-29 — CLOSED

800 renders across 40 fresh sessions:

| Position | 1 | 2 | 3 | 4 |
|---|---|---|---|---|
| **Build 1.2.6** | 0 (0%) | 4 (20%) | **16 (80%)** | 0 (0%) |
| **Build 1.2.7** | 189 (**23.6%**) | 202 (**25.3%**) | 207 (**25.9%**) | 202 (**25.3%**) |

- All four positions used; largest share **25.9%**
- **All 20 questions** individually seen in 3 or more different positions
- Every render: exactly 4 choices, exactly 1 correct
- Original indices `0,1,2,3` present exactly once in all 800 renders — nothing duplicated or dropped
- Question order still stage-scoped: 30/30 sessions with no question leaving its band

**Visual:** four screenshots show the correct answer rendered in positions 1, 2,
3 and 4.

### D-30 — CLOSED

| Check | Result |
|---|---|
| Verb completion still shows the approved wording | *"You practiced finding action and being verbs in 20 different sentences."* |
| That wording now lives in content | `tryItBank.recap` |
| **A TEST-ONLY MOCK second bank gets its own recap** | *"MOCK: You practiced finding subjects in 4 different sentences."* |
| No Verb wording leaks into another topic's bank completion | confirmed |
| A bank with **no** recap falls back to the topic recap, never to Verb's | Noun mock → *"A noun names a person, place, thing, or idea."* |

The mock banks are injected into the live page at runtime by the harness. **No
Subject, Noun or other bank was written to production content.**

### D-33 — CLOSED

| Check | Result |
|---|---|
| `topics.verb.tryIt` | **removed** — `undefined` |
| Verb has a bank | yes |
| The other five topics still have `tryIt` and **no** bank | **all five confirmed** |
| Other five still run their single question and finish in one click | 33/33 bank suite, including the explicit check |
| Rendered step headings unchanged | `Verb — Try it` · `Subject — Try it` · `Noun — Try it` |

### D-36 — CLOSED

| Check | Result |
|---|---|
| Third-miss reveal marks the actual correct button **under shuffled order** | **12/12 runs** |
| Reveal unlocks Next and locks every choice | 12/12 |
| Engine holds no `textContent`-based answer matching | source scanned, none |
| Every rendered choice carries a stable identity attribute | `dataset.ci` on all |
| Correct answer identified after **0, 1 and 2** misses | all three |

**Visual:** `screenshots/verb-wrong3-reveal_1366x768.png` — choices rendered
*Maya / notebook / colorful / **opens***, correct answer in position 4, three
wrong choices marked, reveal correctly highlighting `opens`.

---

## 5. D-27 RE-MEASURED AFTER D-28 (§9)

Same harness, same 18 viewports × 3 topics × 4 steps = 216 samples.

| Metric | Build 1.2.6 | Build 1.2.7 |
|---|---|---|
| Below-fold control samples | **59** | **58** |
| **False bottoms** (below fold, page scrollable, **nothing cut at the fold**) | **0** | **0** |
| Near-fold (≤40px below) | **10** | **9** |
| 1600×720 Predicate Clue | **+31px below fold** | **gone — control in view** |

**Every one of the 58 remaining below-fold samples has content visibly cut at
the fold** — the ordinary scroll affordance. There is **no false bottom
anywhere**: no screen looks complete while hiding its Next control.

Remaining near-fold states (≤40px, all with a visible cut):

| Viewport | Screen | Below fold |
|---|---|---|
| **375×667** | **Verb Clue** | **+11px** ← the tightest |
| 1440×700 | Predicate Clue | +10px |
| 1280×600 | Noun Clue | +13px |
| 1024×576 | Noun Clue | +14px |
| 1280×600 | Predicate Example | +17px |
| 1024×576 | Predicate Example | +20px |
| 390×844 | Predicate Example | +29px |
| 375×667 | Noun Example | +33px |
| 844×390 | Noun Try It | +39px |

The bulk of the remaining 58 are ordinary phone scrolling — 320×568 and 568×320
put Next 150–560px below the fold on screens that plainly continue. Per the
brief, **phone scrolling is acceptable and no sticky redesign was attempted.**

**D-27 REMAINS OPEN** with these measurements. The genuine target for a future
build is the near-fold set above, led by 375×667 Verb Clue at 11px — not the
below-fold count.

---

## 6. FULL REGRESSION

| Suite | Result | Note |
|---|---|---|
| `bank.js` — bank engine, 33 checks | **33/33** | reachability, no duplicates, milestones, escalation, reset, no persistence, other five topics single-question |
| `bankguard.js` — **new**, choice position + identity + recap | **19/19** | see §4 |
| `respguard.js` — **new**, width+height, non-monotonic, control visibility | **11/11** | 216 samples, 18 viewports |
| `stateguard.js` — state leakage, rapid input, accessibility | **47/48** | sole failure = D-35, deferred by instruction |
| `func.js` — Learn engine | **19/19** | topic order, badges, step counts unchanged |
| `q20.js` — Q20 content + 20-question integrity | **31/31** | Q20 still *busy*, all 20 structurally intact |
| `exact.js` — plain→marked | **16/16** | word-for-word identical across six topics |
| `checks.js` — Home, build, assets | **25/26** | sole failure = blocked Google Fonts CDN (sandbox egress) |
| `place.js` — §11 placement | **PASS** | worst panel top 21.2%, header→rail gap constant |

### State integrity after the choice shuffle (§14)

All 14 leakage checks and all 7 rapid-input checks pass: double-click wrong,
two wrongs rapidly, third-wrong reveal, double-click correct, triple-click Next,
double-click Keep Going, Back→Example→Try It, wrong→Home→Verb, correct→Home→Verb,
milestone→Home→Verb, Q20→completion, Learn Again.

**No skipped question, no duplicate question, no duplicated milestone, no leaked
choice order, no stale feedback, no stale selected answer, attempts always reset,
no JS exception, no focus loss.**

### Closed defects — none regressed

| Defect | Re-test | Verdict |
|---|---|---|
| **D-20b** | `#topic-grid` grid · `.pick-card` flex · `.pick-name` block · `.pick-sub` block | STILL CLOSED |
| **D-21** | `position:fixed` only on Home ≥1181×621; `static` on every lesson screen and phone; painted overlap 0 | STILL CLOSED |
| **D-22** | 2 rows and 0 scroll for the adjective marked sentence at 1920×1200, 2048×1152, 2560×1440; projector scale intact | STILL CLOSED |
| **D-23** | Header→rail gap constant; worst panel top 21.2% of viewport | STILL CLOSED |
| **D-24 / D-25** | No scroll, correct row counts at large viewports | STILL CLOSED |
| **Home** | Four mode cards, four tab stops, non-interactive containers, logo loads | UNCHANGED |
| **Topic portal** | 3 cols ≥901px · 2 cols 601–900 · 1 col ≤600; six topics in fixed order | UNCHANGED |
| Horizontal overflow | `scrollWidth − clientWidth = 0` at all 18 viewports | **0** |
| Application JS exceptions | across every suite | **0** |

### Accessibility (§15)

Keyboard selection, visible focus ring, ≥44px targets, `✓`/`✕` non-colour cues,
live-region feedback, focus after correct / after reveal / after Next / after
milestone, Study Guide forward and reverse trap (10/10 each), Escape, focus
return — **all pass, unchanged by the shuffle**.

**One behaviour worth recording, verified as correct rather than defective.**
After a wrong answer, focus moves to the next *enabled* choice (the D-08 fix).
With choices shuffled that can now be the correct one, so a keyboard user
pressing Enter twice blindly may answer correctly on the second press. Traced
across six runs: every intermediate state is coherent and the 3-strike cap
always holds. This is pre-existing focus behaviour made more visible, not a new
defect, and changing it would reopen D-08. **Recorded, not changed.**

**D-35 (modal background not `inert`) remains deferred** per §15. Nothing in
this build touched modal behaviour.

> **NOT ACTUAL SCREEN-READER VERIFIED.** Accessibility results are DOM, focus
> and computed-style evidence only.

---

## 7. PERMANENT HARNESS UPGRADES (§13)

| Harness | Covers | Guards against |
|---|---|---|
| **`bankguard.js`** (new, 19 checks) | **A** choice position over 800 renders · **B** answer identity under shuffle · **C** bank recap with a test-only mock second bank | D-29, D-36, D-30 |
| **`respguard.js`** (new, 11 checks) | **D** 18 viewports × 3 topics × 4 steps, width **and** height, phones included · **E** non-monotonic width pairs **plus a CSS lint** on unguarded type rules · **F** control visibility measuring `pxBelowFold`, `scrollHeight`, viewport height and fold-cut, reporting false bottoms separately | D-28, D-22 family, D-27 |
| `stateguard.js` (updated) | state leakage, rapid input, accessibility | made shuffle-aware |

**The E-section CSS lint is the durable guard for the D-22/D-28 family.** It
fails on Build 1.2.6 (`unguarded: (min-width:1600px)`) and passes on 1.2.7, so
it will catch the next width-only type rule before it ships.

### Harness defects found and corrected during this build

Reported rather than absorbed:

| # | Harness | Stale assumption | How it showed | Correction |
|---|---|---|---|---|
| H-7 | `checks.js` | Read step titles from `topics[k].tryIt.title` | Reported *"verb titles = … → MISSING"* after D-33 | Now reads the **rendered** `#lesson-heading` — asserts what the child sees, not an implementation detail. Rendered headings verified identical across topics |
| H-8 | `q20.js` | Build-number regex `/Build 1\.2\.6/` survived a plain-string update | Failed while printing the correct badge text | Regex updated |
| H-9 | `stateguard.js` | Clicked/focused choice button `[0]`, assuming it was wrong | Reported `attempts=0` after the shuffle made `[0]` sometimes correct | Selects a definitively wrong button by `dataset.ci` |
| H-10 | `stateguard.js` | Asserted a fixed attempt count after 3 blind key presses | Non-deterministic (2, then 0) across runs | Traced to moving focus (see §6); assertion now tests **state coherence and the 3-strike cap**, which is the real invariant |

---

## 8. VERB ENGINE REUSE VERDICT (§19)

# YES

The bank engine is ready to copy to Subject.

**Verified engine properties:**

| Property | Evidence |
|---|---|
| **Topic-agnostic completion** | A mock second bank receives its own recap; a bank with no recap falls back to its topic recap; no Verb wording can leak. **No topic instructional language remains in the engine.** |
| **Position-neutral choices** | 800 renders, all four positions 23.6–25.9%, every question varying |
| **Durable answer identity** | Reveal correct in 12/12 runs under shuffle; no `textContent` matching anywhere; identity survives reordering and would survive duplicate labels |
| **One source of truth per topic** | Verb has a bank and no `tryIt`; the other five have `tryIt` and no bank; the engine serves both without special-casing |
| **Stage abstraction** | Stages are data (`name`, `desc`, `mark`, `milestoneTitle`, `milestoneLine`, `nextStage`); the mock ran **2 stages of 2** and worked unchanged |
| **Milestone logic** | Fires on stage transition, not a hard-coded count — the 2-stage mock produced its milestone correctly |
| **Bank size independence** | The mock ran **4 questions**, not 20; count text, Finish label and completion all adapted |
| **No `tryIt` block required** | `renderStep()` no longer depends on one (N-3) |
| **State reset** | 14/14 leakage checks; nothing persisted |
| **Accessibility** | Unchanged under shuffle; focus deliberate at every transition |

**What a new bank must supply:** `recap`, `stages[]`, and `questions[]` with
`stage`, `sentence`, `question`, four `choices` (exactly one `correct`), `clue`
and `reveal`. Nothing else. Roughly 120 authored strings for a 20-question topic
— **a content cost, not an engineering one.**

**Nothing blocks reuse.** The three engine corrections that produced the earlier
*"yes with corrections first"* verdict — D-30, D-29, D-36 — were the purpose of
this build and are all closed and tested.

---

## 9. DEFECT REGISTER AFTER THIS BUILD

| ID | Status | Note |
|---|---|---|
| **D-28** | **CLOSED** | Height guard added; 0 non-monotonic violations; lint prevents recurrence |
| **D-29** | **CLOSED** | Choices shuffled at render; no structural position bias |
| **D-30** | **CLOSED** | Recap is content-driven; proven with a mock second bank |
| **D-33** | **CLOSED** | Dead Verb `tryIt` removed; one source of truth per topic |
| **D-36** | **CLOSED** | Identity by `dataset.ci`, never rendered text |
| **D-31** | **CLOSED** | `js/app.js` header comment corrected |
| **D-11** | **CLOSED** | Topic-portal density no longer reproduces: all six cards visible without scrolling at 768×1024, 1366×768, 1920×1080 |
| **D-13** | **CLOSED / DESIGN BEHAVIOUR** | Completion is terminal with four deliberate exits (Next topic where applicable, Learn Again, All Topics, Home); `done-next` correctly hidden on the last topic |
| **D-14** | **CLOSED / DESIGN BEHAVIOUR** | Learn persists nothing; re-entry starts at Definition |
| **D-20** | **OPEN, SEV-3** | Abstract nouns are defined and illustrated with chips (*love, joy, hope, freedom*) and an explanatory note, but never demonstrated in a marked sentence and never tested in Try It |
| **D-26** | **OPEN / DEFERRED, SEV-4** | Build badge below the fold. Not redesigned; broad `position:fixed` deliberately not restored, as that reopens D-21 |
| **D-27** | **OPEN, SEV-3, re-measured** | 58 below-fold samples, **0 false bottoms**, 9 near-fold. Tightest: 375×667 Verb Clue at **+11px**. See §5 |
| **D-32, D-34** | **CLOSED** | Handoff heading and audit-table wording corrected. Completed in the documentation-and-packaging pass described in §13 |
| **D-35** | **OPEN / DEFERRED, SEV-4** | Modal background not `inert`. Mitigated by a working two-way focus trap and `aria-modal="true"`. Untouched by instruction |
| D-20b, D-21, D-22, D-23, D-24, D-25, D-12/K-02, K-01 | **STILL CLOSED** | Re-verified; no regression |

---

## 10. VERB CONTENT PRESERVED (§12)

Verified unchanged: all 20 sentences, all correct answers, all distractors, all
stage assignments, all first-wrong explanations, all second clues, all third
reveals, Q20 = *busy*, all four being-verb questions, all milestones, all stage
descriptions. `q20.js` 31/31 confirms structural integrity across all 20.

**No optional content polish was made.** The observations from the forensic
audit — *"is is the verb"* (C-4), baseball-context balance (C-8), duplicate
`carried` (C-1), the Stage 4 explanation placement (C-5) — were deliberately
left alone as out of scope.

---

## 11. LOCAL VS LIVE (§17)

**All testing in this report is LOCAL SIMULATED CHROMIUM**, served from a clean
extraction of `Sentence-Sense.zip` over `http://127.0.0.1`, with the Google
Fonts CDN **blocked by the sandbox**.

- The app renders correctly on its declared fallback stack: `Nunito, system-ui,
  -apple-system, sans-serif`.
- **No claim is made about Baloo 2 rendering on the live site.** Type
  measurements here are fallback-font measurements.
- **LIVE GITHUB PAGES verification has not been performed** and must happen
  after the push.
- Every viewport result is a simulated Chromium viewport, never a real device.
  iOS Safari's dynamic toolbar in particular bears directly on D-27 and remains
  unverified.

---

## 12. CLEAN-EXTRACTION VERIFICATION (§22)

`Sentence-Sense.zip` was built, extracted into a clean directory, served from
that extraction, and re-tested there:

| Check | Result |
|---|---|
| Visible build number | **Sentence Sense — Build 1.2.7** |
| Verb has no legacy `tryIt` | confirmed |
| Other five topics still use single `tryIt`, no bank | confirmed |
| Bank suite on the extracted copy | **33/33** |
| Bank guard on the extracted copy | **19/19** |
| Q20 integrity on the extracted copy | **31/31** |
| D-28 comparison on the extracted copy | no non-monotonic regression |
| ZIP contents | exactly the ten approved files, nothing else |
| **ZIP structure** | **flat — repository files at the ZIP root, no `Sentence-Sense-main/` wrapper.** Opening the ZIP shows `index.html`, `css/`, `js/`, `assets/`, the handoff and the audit directly |
| Application files vs the approved baseline | SHA-256 on all eight — **byte-identical** |

---

---

## 13. DOCUMENTATION AND PACKAGING PASS (post-review, same build)

After this build passed independent review, a **documentation-and-packaging-only**
pass was run. **No application file was changed** — SHA-256 fingerprints for
`index.html`, `css/styles.css`, `js/app.js`, `js/learn.js`,
`js/data/learn-content.js` and all three images were recorded before the pass and
re-compared after it: **byte-identical**. The build number remains **1.2.7**.

What changed, all documentation or packaging:

| Change | Why |
|---|---|
| Handoff defect ledger rewritten | It still carried pre-1.2.7 statuses — D-11 and D-13 as open, and the old narrow wording for D-27 (*"390×844 wrong-answer state"*) and D-26 (*"1366×768, two densest Clue screens"*). It now matches §9 of this audit exactly, including D-27's re-measured figures and D-35, which the ledger had omitted entirely. |
| Handoff §5b | The question shuffle and the new choice shuffle are now distinguished where the reader first meets one, so *"shuffle is scoped to a stage"* cannot be misread as applying to answer choices. |
| Handoff §8 | Its illustrative feedback quote was *"small tells what kind of dog…"* — a string from the single Try It question **deleted in 1.2.7** (D-33). Replaced with the live Q1 wording, with a note recording the substitution. |
| Handoff §10 | The height-guard rule now documents **both** guarded breakpoints (1800×1100 from D-22, 1600×900 from D-28) and states the permanent rule that any type-enlarging media query must carry a `min-height` guard. |
| Handoff §12b + new §12c | `place.js` was implied to be the responsive authority. It only tests `w ≥ 1024 && h ≥ 600` — the blind spot that hid D-27's scope and D-28. §12c is a new harness register naming `respguard.js` as the responsive authority and recording that shuffled choice buttons make button `[0]` unreliable in tests. |
| Handoff §13 | Records the flat project-ZIP structure (no wrapper folder) and the deliverables layout. |
| `GIT-COMMANDS.md` | Now removes `AUDIT-REPORT-Build-1.2.6.md` before `git add -A`, since unzipping over the repo copies files but never deletes them. |
| Project ZIP | Rebuilt flat: repository files at the ZIP root. |

A 29-point automated cross-document consistency check was run over the handoff,
this audit and the application source. **All substantive checks pass.** The one
reported miss was the checker itself flagging the deliberate parenthetical in §8
that quotes the old string in order to explain its removal.

**DOCUMENTATION = PASS** is asserted on the strength of that reconciliation, not
in spite of it.

---

*End of audit. Build 1.2.7 — harden guided bank engine and responsive layout.*
*No second topic bank was built. The Verb model is now safe to copy.*
