# SENTENCE SENSE — BUILD 1.2.3 AUDIT REPORT
## Learn UX correction pass

**Build:** Sentence Sense — Build 1.2.3
**Date:** 2026-09-07
**Scope:** Learn Mode visual and instructional polish, Home logo alignment
**Method:** headless Chromium — automated measurement, rendered-pixel contrast
sampling, full-state regression sweep, and direct visual inspection of renders

This report describes the shipped state of Build 1.2.3 consistently from
beginning to end. There are no correction sections appended after the fact.

---

## 1. BUILD NUMBER

Incremented as required. Every approved push now gets a new visible build number
so the live site can be verified after GitHub Pages refreshes.

| Location | Value |
|---|---|
| `js/app.js` — `const BUILD_NUMBER` | `"Build 1.2.3"` |
| `js/app.js` header comment | `Build 1.2.3 — SHELL + HOME PORTAL + LEARN MODE ROUTING.` |
| Rendered `#build-badge` | `Sentence Sense — Build 1.2.3` |
| Badge text across **1,176 swept states** | correct in 1,176 of 1,176 |
| This audit | Build 1.2.3 |
| `SENTENCE-SENSE-HANDOFF.md` | Build 1.2.3 |

---

## 2. FILES CHANGED

| File | Status | Lines |
|---|---|---|
| `index.html` | Modified — completion badge element, topic-screen copy | 230 → 233 |
| `css/styles.css` | Modified — compaction, centred logo, sentence pair, colour, completion | 819 → 908 |
| `js/app.js` | Modified — build number only | 155 → 158 |
| `js/learn.js` | Modified — plain/marked renderer, completion badge | 577 → 634 |
| `js/data/learn-content.js` | **UNCHANGED — byte-identical** `e6ec8d739fecf51df7f92ab8b6c62bca` | 659 |
| `assets/images/*` | **UNCHANGED — byte-identical** | — |

**No instructional content changed.** Every definition, clue, example, question,
answer, feedback string, Study Guide line, topic name, topic description and
clue badge lives in `js/data/learn-content.js`, which was not touched. The
plain/marked teaching pattern is produced by the renderer from the existing data.

---

## 3. RECONCILIATION BEFORE EDITING

The supplied project ZIP was compared against the tree delivered at the end of
the previous session.

| Finding | Detail |
|---|---|
| Application code identical | `index.html`, `css/styles.css`, `js/app.js`, `js/learn.js`, `js/data/learn-content.js` and all images matched byte-for-byte |
| **Discrepancy — the ZIP predates the last cleanup** | It still contains `AUDIT-REPORT-Build-1.0.md`, `1.0.1`, `1.1` and `1.1.1`, and an older `SENTENCE-SENSE-HANDOFF.md`. The historical-audit removal had not been applied to the copy sent back. |
| Resolution | Work proceeded from the current tree. The single-audit rule is applied in this delivery: the repo now carries `AUDIT-REPORT-Build-1.2.3.md` only. |

**The screenshots were the most valuable input in this pass** — they are the live
GitHub Pages site rendering in **Baloo 2**, the real webfont this sandbox cannot
load. Every defect described below was confirmed against them before any edit.

---

## 4. HOME LOGO — CENTRED

**Before.** `.home-header` was a horizontal flex row: logo on the left, tagline
beside it. At every width the brand sat in the corner and read as a mark on a
band rather than as the identity of the page.

**After.** The header is a centred column — logo on the centre line, tagline
directly beneath it, both centred, on the same axis as the hero and the card
grid below.

```css
.home-header{display:flex;flex-direction:column;align-items:center;
  justify-content:center;text-align:center;gap:clamp(6px,.9vh,10px);}
.home-logo{width:clamp(128px,12.4vw,178px);height:auto;margin-inline:auto;}
```

**The logo is not distorted.** Sizing is still by width with `height:auto`, so
the supplied 4:3 proportion cannot change, and the asset is byte-identical.

| Viewport | Logo width × height | Rendered ratio | Source ratio | Centred |
|---|---|---|---|---|
| 390 × 844 | 124.8 × 93.6 | 1.3334 | 1.3333 | yes |
| 768 × 1024 | 128.0 × 96.0 | 1.3333 | 1.3333 | yes |
| 1024 × 692 | 128.0 × 96.0 | 1.3333 | 1.3333 | yes |
| 1366 × 768 | 169.4 × 127.0 | 1.3333 | 1.3333 | yes |
| 1920 × 1080 | 178.0 × 133.5 | 1.3333 | 1.3333 | yes |

**Nothing else on Home changed:** four mode cards, card order, copy, colours,
buttons-only navigation, non-interactive card containers, and the absence of any
login / profile / settings control are all as they were in Build 1.2.

---

## 5. LEARN DESIGN SYSTEM

One rhythm across all six topics. The grammar concept changes; the interface
does not.

| Step | Question it answers | What the screen always contains |
|---|---|---|
| **DEFINITION** | *What is it?* | title → one-line meaning → supporting detail → the sentence pair |
| **CLUE** | *How can I find it?* | title → the question to ask → the clue list → a subordinate reminder → the sentence pair |
| **EXAMPLE** | *Show me.* | title → instruction → the sentence pair → the reasoning ticks |
| **TRY IT** | *Can I find it?* | title → plain sentence → question → four choices → explanatory feedback |

A child learns the pattern once on Verb and reads the other five faster. The
progress rail, the header, the control row and the button positions are
identical on every topic and every step.

---

## 6. PLAIN SENTENCE FIRST, MARKED SENTENCE SECOND

### 6a. What was wrong

The app jumped straight to grammar markup. The Verb Example screen said *"Read
the sentence and ask: What happened?"* and then showed only the already-marked
sentence — the child was told to read a sentence they were never shown as a
sentence.

### 6b. The pattern now

```
READ IT
The excited player kicked the red ball.
─────────────────────────────────────────
SEE HOW IT WORKS
The [ADJECTIVE: excited] [NOUN: player] kicked the [ADJECTIVE: red] [NOUN: ball].
excited → describes → player      red → describes → ball
```

Applied automatically wherever a sentence carries any annotation — marks, a
split, or links — across **all six topics**. A sentence with no annotation (the
Try It question) is already plain and is shown once, unlabelled.

The two steps share **one** container with a hairline between them, not two
stacked boxes. That reads as *the same sentence, twice* rather than *two
sentences*, and it saves roughly 35px of pure structure per screen.

### 6c. Exact-match rule — enforced by construction, then audited

Both passes render from the **same `words` array** in `learn-content.js`. The
plain pass suppresses marks, split and links; it cannot add, remove, reorder or
re-punctuate anything, because it reads the same source.

The audit does not trust that reasoning — it compares the **rendered text of
both passes** in the browser, so a rendering bug could not hide behind correct
data:

| Topic | Definition | Clue | Example | Sentence |
|---|---|---|---|---|
| Verb | PASS | *(no sentence)* | PASS | "The player kicked the ball." |
| Subject | PASS | PASS | PASS | "The player kicked the ball." |
| Complete Subject | PASS | PASS | PASS | "The excited player kicked the red ball." |
| Predicate | PASS | PASS | PASS | "The excited player kicked the red ball." |
| Noun | *(no sentence)* | PASS | PASS | "The player kicked the ball." / "The student read a book." |
| Adjective | PASS | PASS | PASS | "The excited player kicked the red ball." / "The fast player caught the high ball." |

Each pair was checked for four things: word-for-word identity, the plain pass
containing **zero** marks / splits / links, READ IT appearing before SEE HOW IT
WORKS, and both labels being exact.

> **16 of 16 plain/marked pairs pass. No sentence differs by a single word or
> mark of punctuation.**

---

## 7. COMPACTING THE LEARN SCREENS

### 7a. Two separate causes, measured before editing

**Cause 1 — a forced minimum height on large displays.**
`@media (min-width:1800px)` set `.lesson-stage{min-height:min(70vh,860px); justify-content:center}`. A 1920×1080 desktop monitor is indistinguishable from
a projector, so ordinary desktop users got a **756px card holding 393–526px of
content — 30% to 48% empty white — and it still scrolled 60px.**

**Cause 2 — accumulated spacing.** Header margin, progress margin, stage
padding, content gaps, list gaps, sentence padding and split-part padding each
contributed a little; together they pushed 8 of 18 screens past 1366×768.

### 7b. What was done — and what was deliberately not done

**Nothing instructional was shrunk.** `--lesson-text`, `--sentence-size`,
`--sentence-label`, button sizes and tap targets are all unchanged. Every
reduction is space *between* things, or structure:

- the `min-height` rule removed — the panel sizes to its content at every width
- one shared container for the sentence pair instead of two boxes
- lesson header margin 16 → 12px · lesson body margin 16 → 10px
- progress margin 14 → 10px · content gap 14 → 10px · list gap 7 → 5px
- stage padding at ≥1200px 26/30 → 16/18px · at ≥1800px 34/40 → 26/28px
- sentence padding 16/14 → 12/11px · split-part padding 8/10 → 6/8px
- the subordinated reminder box gives back its heavy slab (Section 8)
- lesson title cap 2rem → 1.85rem (the title, not the teaching text)
- short steps now sit optically centred rather than hugging the header

### 7c. Result at 1366 × 768 — the stated desktop goal

| Topic | Definition | Clue | Example |
|---|---|---|---|
| Verb | 397px ✓ | 278px ✓ | 320px ✓ |
| Subject | 365px ✓ | 432px ✓ | 411px ✓ |
| Complete Subject | 363px ✓ | 440px ✓ | 422px ✓ |
| Predicate | 358px ✓ | 502px ✓ | 427px ✓ |
| Noun | 299px ✓ | 423px ✓ | 352px ✓ |
| Adjective | 380px ✓ | 488px ✓ | 439px ✓ |

> **18 of 18 Definition / Clue / Example screens fit at 1366×768 with the whole
> lesson — panel, controls and footer — inside the viewport. Zero need scrolling.**
> Panel emptiness fell from 14–18% to **7–12%**, and the panels are far smaller
> in absolute terms (Adjective Clue 567px → 488px, Verb Example 314px → 320px
> while now carrying an extra sentence).

Two screens report a page scroll of 45–59px. That is the **in-flow build badge**
sitting below the footer, not lesson content. The lesson itself fits.

### 7d. Result at other viewports

| Viewport | Lessons fitting | Panel empty | Note |
|---|---|---|---|
| 1366 × 768 | **18 of 18** | 7–12% | the stated goal |
| 1920 × 1080 | 16 of 18 | 7–13% | was 30–48% empty and 18 of 18 scrolling |
| 768 × 1024 | 18 of 18 | 10–17% | |
| 1024 × 692 | 15 of 18 | 10–17% | 692px tall; the three densest Clue screens need 40–66px |
| 390 × 844 | scrolls by design | — | phone scrolling is acceptable |

**Honest exception:** at 1920×1080 the Adjective Clue and Example screens need
about 36px more than the viewport. At ≥1600px the sentence type steps up to the
projector scale (`--sentence-size:1.9rem`), which makes the marked sentence wrap
to a second row. Back and Next stay visible; only the footer link and badge fall
below the fold. This was left rather than shrinking the sentence, because the
brief was explicit that the text is not the problem.

---

## 8. REDUCING REDUNDANT CLUTTER

Each Learn screen was audited with one question: *does this element teach
something new, or repeat the same point?*

The `.lesson-warning` rule box was the recurring answer. On Adjective Clue it
says *"The word that answers the question is the adjective, and the word it
answers about is the noun"* — which is precisely what the marked sentence and
the relationship chips below it show. On Predicate Clue it points at the diagram
directly.

**It was kept, not deleted — repetition helps a third grader — but it is no
longer a fifth equally dominant block.** It gives up the full border and heavy
fill for a left rule, a lighter ground and type one step down:

| Property | Before | After |
|---|---|---|
| Border | 2px solid all round | 1px hairline + 5px left rule |
| Background | `--soft-yellow` solid | `rgba(255,247,216,.7)` |
| Weight | 800 | 700 |
| Size | `--lesson-text − .02rem` | `--lesson-text − .08rem` |
| Padding | 10px 16px | 7px 14px |
| Alignment | centred | left |

---

## 9. ADJECTIVE CLUE SCREEN

The densest screen in the app. The required reading order is now visible in the
layout rather than competed for:

1. **Find a noun** — the instruction line, directly under the title
2. **Ask the three questions** — the bulleted list, the visual centre of the top half
3. **See the sentence normally** — READ IT, plain, one line
4. **See how the adjectives connect to nouns** — SEE HOW IT WORKS, then the
   `fast → describes → player` chips

The reminder box sits between 2 and 3 as a subordinate aside rather than a
yellow slab dividing the screen. Measured effect: the panel fell from **567px to
488px** and now fits 1366×768 entirely, with the marked sentence on one line
instead of wrapping.

---

## 10. COLOUR AUDIT

No new colours were introduced. The existing per-topic identity system is
unchanged for Verb, Subject, Complete Subject, Predicate and Noun.

**One change, as requested: the Adjective lesson header.**

| | Gradient | White text contrast |
|---|---|---|
| Before | `#8F400A → #B4530F` | 7.23 → 5.02 |
| After | `#A84E06 → #BA5A0B` | **5.59 → 4.61** |

The old dark stop was the source of the muted, brown feel. The new pair is a
warmer burnt orange at both ends while keeping white text above WCAG AA.

**This is the top of the available range, not a neon choice.** Candidates were
measured before selection: `#C25F0C` = 4.25, `#C96410` = 3.95, `#D06A12` = 3.65,
`#E07A16` = 3.02 — every brighter option fails 4.5:1 against white.

`--c-adjective` (`#B4530F`), used for the adjective *marks* on light backgrounds,
was deliberately **not** brightened: on a light ground a brighter orange would
reduce contrast, not improve it. Dark-on-light and light-on-dark need opposite
directions.

The completion badge for each topic reuses that topic's existing identity; no new
hue was added for it.

---

## 11. COMPLETION SCREEN

**Before:** a large white card with a line of text in the middle and several
hundred pixels of empty space around it.

**After:** confetti, *"You learned Verb!"*, a named badge the child earned, one
sentence of what they can now do, then the way on.

```
🎉
You learned Verb!
[ VERB ✓ ]
A verb tells what someone or something does or is. Ask: What happened?
[Next topic: Subject] [Learn this again] [All Topics] [Home]
```

The badge carries the topic's own colour and its name in words, so it is never
colour-only. Navigation is unchanged — all four controls kept.

**Nothing gamified was added:** no points, coins, streaks, sound, arcade effects,
accounts or progress persistence. Nothing is stored anywhere.

---

## 12. TOPIC PORTAL

Unchanged: six topics, order, 3 × 2 desktop / 2 columns tablet / 1 column phone,
badge → title → description hierarchy, strategy reference underneath.

**One copy change, documented as required.** *"Pick a topic. Each one is short."*
→ **"Choose a topic to start learning."**

The old line makes a promise about length. Learn is planned to grow — the
20-question banks are a future build — at which point "each one is short" becomes
inaccurate and the app would be telling a child something untrue. The replacement
says what the screen is for and stays true at any depth.

---

## 13. VISUAL AUDIT — ANSWERED FROM RENDERS, NOT CODE

27 screens were rendered and inspected directly at 390×844, 768×1024, 1024×692,
1366×768 and 1920×1080, with the cursor parked so no hover state was active.

| # | Question | Answer |
|---|---|---|
| 1 | Appropriate for a 3rd grader? | **Yes.** Type is large and rounded, controls are big pills, one idea leads to the next. Nothing is dense or form-like. |
| 2 | Friendly rather than academic? | **Yes.** Warm cream ground, per-topic colour, confetti and an earned badge at the end. The Try It feedback speaks to the child rather than marking them. |
| 3 | Visually balanced? | **Yes.** Home is symmetrical about the centred logo. Lesson screens are a centred column; short steps sit optically centred rather than hugging the header. |
| 4 | Excessive empty space? | **No longer.** Panel emptiness is 7–12% at 1366 and 7–13% at 1920, down from up to 48%. What remains is padding. |
| 5 | Any screen overloaded? | **Adjective Clue was; it is not now.** Six equal blocks became a ranked four-level read (Section 9). Predicate Clue got the same treatment. |
| 6 | Can a child tell what to do next? | **Yes.** One yellow Next button in the same place on every step, the progress rail above showing where they are, and Finish gated until the answer is right. |
| 7 | Plain sentence before markup? | **Yes, on every annotated sentence in all six topics.** READ IT always precedes SEE HOW IT WORKS. |
| 8 | Plain identical to marked? | **Yes — 16 of 16 pairs, verified from rendered text** (Section 6c). |
| 9 | Topic colour reinforcing, not distracting? | **Yes.** One hue per topic on the header, the marks and the badge. Adjective no longer reads muted against the other five. |
| 10 | Completion rewarding enough to continue? | **Improved.** The named badge gives the moment weight, and "Next topic: Subject" is the primary button. Honestly: this is a judgement only a child can settle — see L-05. |

---

## 14. RESPONSIVE AND ACCESSIBILITY AUDIT

Full sweep: **1,176 states** — 21 viewports × (topic screen + 6 topics × 9 states).

| Check | Result |
|---|---|
| Horizontal overflow | **0 of 1,176** |
| JavaScript exceptions | **0** |
| Focus left on a hidden screen | **0** |
| Build badge invisible | **0** |
| Build badge text wrong | **0** |
| Painted badge/content overlap (D-21 regression) | **0** across 20 viewports × all Learn states, both scroll positions |
| Application console errors | **0** |
| Failed **local** asset requests | **0** |
| Clipped instructional text | none observed at any inspected viewport |

### 14a. Functional regression — 19 of 19

All six topic cards open their lesson · Definition → Clue → Example → Try It
intact on all six · Finish gated until answered · wrong answer marked wrong with
Finish still gated · correct answer unlocks Finish and locks the choices ·
completion screen with all four controls · Escape ladder (guide → lesson →
topics → home) · Back / Home / All Topics · no duplicate handlers after 10 guide
open/close cycles · focus never left on a hidden screen · strategy heading and
all eight steps unchanged · topic order, descriptions and clue badges unchanged.

### 14b. Keyboard and focus

| Check | Result |
|---|---|
| Study Guide focus trap — forward, 12 × Tab | all 6 guides pass |
| Study Guide focus trap — **reverse**, 12 × Shift+Tab | all 6 guides pass |
| Mixed direction | all 6 guides pass |
| Escape closes, focus returns to `lesson-guide` | all 6 guides pass |
| Topic cards keyboard-reachable with visible focus ring | 6 of 6 |
| Enter and Space activate a focused topic card | both work |
| Home: exactly 4 focusable elements, one per mode | pass |

### 14c. Touch targets

Every navigation button remains a pill of at least 44px. Topic cards measure
112px tall at 390 wide. Try It choices are 54px minimum on phones. None of these
were reduced in this pass.

### 14d. Contrast — measured on rendered pixels

Sampled from actual screenshots, because gradients and layered colour cannot be
computed from CSS alone. Header brand text, topic tag, lesson title, lesson text,
READ IT / SEE HOW IT WORKS labels, plain sentence and completion badges, across
all six topics:

> **41 of 41 pass WCAG 2.1 AA. Tightest margin: the READ IT label at 5.21:1
> against a 4.5:1 requirement.** The new Adjective header measures 5.41:1.

---

## 15. LEARN VS PRACTICE — PRESERVED

Learn still explains a wrong answer rather than rejecting it. Unchanged and
verified in this pass:

> *"small tells what kind of dog it is. It describes the dog. Look again for the
> word that tells what happened."*

Every wrong choice in all six topics carries a written explanation of why that
word is not the answer and what to look for instead. No feedback was shortened.

---

## 16. WHAT WAS NOT BUILT

Practice Mode · Break It Down · Test · the 20-question Learn banks · question
randomization · scoring · mastery tracking · progress persistence · accounts ·
login · profiles · settings · databases · APIs · backend services.

Learn still has one Try It question per topic. The three unbuilt modes still
route from Home to their existing placeholder screen.

---

## 17. KNOWN ISSUES

### Open

| ID | Issue | Severity |
|---|---|---|
| **D-22** | Adjective Clue and Example need ~36px more than a 1920×1080 viewport, because the ≥1600px projector type scale wraps the marked sentence. Back and Next stay visible. | 4 |
| D-11 | Topic-screen density — much improved; re-assess before closing | 4 |
| D-13 | Completion-screen Back behaviour | 4 |
| D-14 | Learn state reset between topics | 4 |
| D-20 | Abstract nouns in the noun topic (content) | 3 |

### Closed in this build

Learn screens too tall with excessive internal whitespace · markup shown before
the plain sentence · Adjective identity reading brown and muted · completion
screen visually empty · topic-screen copy that would become inaccurate.

### Limitations — what this audit cannot prove

**L-01 — The real webfont still could not be loaded here.** The sandbox blocks
the Google Fonts CDN, so every measurement in this report used a fallback face.
**This is materially better than previous builds**, because the supplied
screenshots showed the live site in Baloo 2 and every defect was confirmed
against them first — but the *post-fix* measurements are still fallback-face
figures. Confirm the 1366×768 fit on the live site.
**L-02 — All device testing is simulated.** No physical phone, tablet, laptop or
projector was used.
**L-03 — No classroom projector verification.**
**L-04 — No screen-reader testing.** Semantics verified structurally only.
**L-05 — No testing with a child.** Whether the completion screen actually
motivates a third grader to continue is not something this audit can answer.
**L-06 — Chromium only.** No Safari or Firefox.

---

## 18. VERDICT

**Build 1.2.3: PASS.**

| Requirement | Status |
|---|---|
| Build number incremented to 1.2.3 in code, badge, audit, handoff | ✅ |
| Home logo horizontally centred, not distorted, ratio preserved | ✅ 5 viewports, 1.3333 |
| Home otherwise unchanged | ✅ cards, copy, order, buttons-only nav, no login/profile/settings |
| One Learn design system across six topics | ✅ Section 5 |
| Learn screens compacted without shrinking instruction | ✅ 18 of 18 fit at 1366×768; emptiness 48% → 7–13% |
| Plain sentence before marked sentence | ✅ all six topics, automatic wherever a sentence is annotated |
| Exact sentence match audited automatically | ✅ **16 of 16 pairs, from rendered text** |
| Redundant clutter subordinated, not deleted | ✅ Section 8 |
| Adjective Clue hierarchy scannable | ✅ 567px → 488px, four ranked levels |
| Colour audit; Adjective warmed with measured contrast | ✅ 5.59 / 4.61, old and new values documented |
| Completion screen rewarding, not gamified | ✅ named badge; no points, streaks, sound or storage |
| Learn feedback still explanatory | ✅ unchanged |
| Topic portal unchanged; copy decision documented | ✅ Section 12 |
| 20-question banks NOT added | ✅ |
| Practice / Break It Down / Test NOT started | ✅ |
| Zero horizontal overflow | ✅ 0 of 1,176 |
| No badge overlap regression | ✅ 0 painted overlaps |
| Focus trap forward and reverse, all six guides | ✅ |
| Contrast | ✅ 41 of 41, tightest 5.21:1 |
| No JS exceptions, no app console errors, no failed local assets | ✅ |
| Instructional content unchanged | ✅ `learn-content.js` byte-identical |
| ZIP verified by extraction and re-tested from the extracted copy | ✅ Section 19 |

---

## 19. DELIVERY VERIFICATION

`Sentence-Sense.zip` was extracted to a clean directory, compared with `diff -r`,
and the functional, layout and Home suites were re-run **against the extracted
copy** rather than the working tree. All passed.

The project ZIP carries only the runtime application, this audit, and the
handoff — no screenshots, Git command files, verification reports, harnesses,
archived assets, historical audits or browser artifacts.

---

*End of Build 1.2.3 audit report.*
