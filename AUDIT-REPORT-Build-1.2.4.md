# SENTENCE SENSE — BUILD 1.2.4 AUDIT REPORT
## Learn vertical placement correction

**Build:** Sentence Sense — Build 1.2.4
**Date:** 2026-09-07
**Scope:** Correct the vertical placement regression found on the live site; verify
its secondary effects; close or re-open D-22 on evidence
**Method:** headless Chromium — a new placement harness, full-state regression
sweep, rendered-pixel inspection, and clean-extraction re-test

---

## 0. VERDICT

# PASS WITH KNOWN ISSUES

The primary defect (D-23) is fixed and the fix is structural, not cosmetic.
D-24, D-25 and D-22 were each verified **separately** rather than assumed to
follow, and all three close. Two known issues remain open, both bounded and
documented in Section 9, and one environmental limitation still stands.

---

## 1. RECONCILIATION BEFORE EDITING

| Check | Result |
|---|---|
| Extracted `Sentence-Sense.zip` vs working tree | Application code **byte-identical** |
| **New discrepancy** | The shipped 1.2.3 ZIP's `SENTENCE-SENSE-HANDOFF.md` is missing the "Git block required in every delivery" section, which was added after that ZIP was built. No code difference. Carried into this build's handoff. |
| Live screenshots vs code | Screenshots confirmed the regression the previous audit missed |

**The previous audit said PASS and was wrong about placement.** That is stated
plainly here rather than worked around: see Section 3.

---

## 2. BUILD NUMBER

| Location | Value |
|---|---|
| `js/app.js` — `const BUILD_NUMBER` | `"Build 1.2.4"` |
| Rendered badge | `Sentence Sense — Build 1.2.4` |
| Badge text across **1,176 swept states** | correct in 1,176 of 1,176 |
| This audit | `AUDIT-REPORT-Build-1.2.4.md` |
| `SENTENCE-SENSE-HANDOFF.md` | Build 1.2.4 |

---

## 3. D-23 — LESSON STACK POSITIONED TOO LOW — **FIXED**

### 3a. What was wrong

Build 1.2.3 added `justify-content:center` to `.lesson-body` to tidy the dead
strip below a short step. On a tall desktop that centred the **entire** lesson
column, so the shorter the step, the further down the page its progress rail and
panel were pushed. The completion screen — the shortest step of all — floated
worst.

Measured on the 1.2.3 code, header-bottom → progress-rail gap:

| Viewport | Definition | Clue | Try It | **Completion** |
|---|---|---|---|---|
| 1366 × 768 | 33px | 92px | 108px | **112px** |
| 1920 × 1080 | 89px | 155px | 134px | **226px** |
| 2560 × 1440 | 269px | 335px | 314px | **406px** |

The gap grew with spare viewport height. That is the defect in one number.

### 3b. Why the 1.2.3 audit missed it

It measured whether the lesson **fit**. A column shoved 226px down the page
still fits. The harness had no concept of *where* the lesson sat, so it reported
18 of 18 passing while the live site looked wrong. The metric was incomplete,
not the measurement.

**Even the new proportional rule alone would not have caught it:** the worst
1.2.3 case measured 38.9% panel-top, inside a 40% threshold. The metric that
actually catches it is the header→rail gap, because that gap should be a
**constant** and was instead a function of viewport height.

### 3c. The fix

```css
.lesson-body{flex:1;display:flex;flex-direction:column;margin-top:14px;}
```

`justify-content:center` removed. The column is top-aligned again with one
controlled gap — `margin-top` above the rail, plus the rail's own 10px below it.
That gap no longer grows with spare height. The dead space returns to below the
content, where the footer already anchors it and where it costs nothing.

This is a structural rule, not a per-viewport patch. A comment in the stylesheet
records why vertical centring must not be reintroduced here.

### 3d. Result — measured

| Viewport | header→rail gap | rail→panel gap | panel top | Constant? |
|---|---|---|---|---|
| 1366 × 768 | **14px** | 10–19px | 20.1–21.2% | yes |
| 1440 × 900 | **14px** | 10–18px | 17–18% | yes |
| 1600 × 900 | **14px** | 10–18px | 17–18% | yes |
| 1920 × 1080 | **14px** | 10–18px | 15.6–16.3% | yes |
| 2560 × 1440 | **14px** | 10–18px | 11.7–12.2% | yes |

**The gap is now 14px at every viewport and every step**, including the
completion screen. Worst panel top across all desktop states: **21.2%**, against
the §11 rule of 40%. Previous worst: 38.9%.

**210 states measured** (6 topics × 7 steps × 5 viewports): all pass.

---

## 4. D-24 — TRY IT SCROLL — **VERIFIED SEPARATELY, CLOSED**

Not assumed to follow from D-23. Tested in every state at every required width:

| Viewport | State | Page scroll | H-overflow | Back | Finish | Feedback | Badge clipped |
|---|---|---|---|---|---|---|---|
| 1366 × 768 | unanswered / wrong / correct | 0 | 0 | visible | visible | visible | no |
| 1440 × 900 | unanswered / wrong / correct | 0 | 0 | visible | visible | visible | no |
| 1600 × 900 | unanswered / wrong / correct | 0 | 0 | visible | visible | visible | no |
| 1920 × 1080 | unanswered / wrong / correct | 0 | 0 | visible | visible | visible | no |
| 2560 × 1440 | unanswered / wrong / correct | 0 | 0 | visible | visible | visible | no |

**15 of 15 states pass.** No scroll, no clipped badge, no hidden control.

---

## 5. D-25 — DEFINITION / FOOTER PLACEMENT — **VERIFIED SEPARATELY, CLOSED**

All six Definitions, both required widths:

| Viewport | Topics tested | Scroll | Back | Next | Footer in view | Badge in view |
|---|---|---|---|---|---|---|
| 1366 × 768 | all six | 0 | visible | visible | yes | yes |
| 1920 × 1080 | all six | 0 | visible | visible | yes | yes |

**12 of 12 pass.**

---

## 6. D-22 — LARGE-SCREEN WRAPPING — **RE-TESTED, FIXED, CLOSED**

### 6a. A measurement error in my own harness, corrected first

The first re-test reported the adjective sentence wrapping at **every** viewport
including 1366. That was wrong. `.ss-words` uses `align-items:flex-end`, so a
marked chip — taller, because it carries a label above the word — has a
different `top` than a plain word **on the same visual line**. Counting distinct
tops reported a wrap that was not there.

The harness now counts distinct **bottoms**. The correction is recorded because
the false reading would otherwise have justified changes the app did not need.

### 6b. What was actually wrong

Measuring the width the marked sentence needs against the width available:

| Viewport | Sentence / label scale | Needs | Available | Wrapped |
|---|---|---|---|---|
| 1366 × 768 | 1.55rem / .8rem | 884px | 980px | no — fits by 96px |
| 1440 × 900 | 1.55rem / .8rem | 884px | 980px | no |
| 1600 × 900 | 1.9rem / .9rem | 1020px | 1000px | **yes, by 20px** |
| 1920 × 1080 | **2.6rem / 1.6rem** | 1548px | 1400px | **yes, by 148px — 3 rows, 100px of scroll** |
| 2560 × 1440 | 2.6rem / 1.6rem | 1548px | 1400px | yes |

The root cause at 1920 was that **the projector type scale was gated on width
alone**, so an ordinary 1920×1080 desktop was treated as a classroom projector
and given 2.6rem sentences with 1.6rem labels.

### 6c. The fix

Exactly what §9 asked for — fix the projector rule, do not shrink normal desktop
instructional text:

```css
/* was: @media (min-width:1800px) */
@media (min-width:1800px) and (min-height:1100px){ … --lesson-max:1560px; }

/* the 1600px band, widened rather than shrunk */
@media (min-width:1600px){ … --lesson-max:1140px; }
```

A real large display is large in **both** dimensions. 1920×1080 now falls
through to the 1600px scale and holds one line; 2560×1440 still gets the full
projector treatment, with a column wide enough for it. **No sentence, label or
body size was reduced anywhere** — only the column widened and the projector
gate tightened.

### 6d. Result

| Viewport | Clue | Example | Scroll |
|---|---|---|---|
| 1366 × 768 | one line | one line | 49px (badge only — Section 9) |
| 1440 × 900 | one line | one line | 0 |
| 1600 × 900 | one line | one line | 0 |
| 1920 × 1080 | **one line** | **one line** | **0** (was 100px) |
| 2560 × 1440 | one line | one line | 0 |

**D-22 CLOSED.**

---

## 7. NEW PERMANENT PLACEMENT METRICS

`place.js` is now part of the audit harness and measures, per state:

header bottom · rail top · rail bottom · panel top · panel bottom · control-row
top · footer bottom · badge bottom · document scroll height · viewport height ·
**gap header→rail** · **gap rail→panel** · **gap panel→controls** · panel top as
% of viewport · horizontal overflow · whether controls and badge are in view.

**Acceptance rules, and the reasoning behind each:**

| Rule | Threshold | Scope | Why |
|---|---|---|---|
| Panel top | ≤ 40% of viewport | desktop only | §11 proportional rule |
| **Header→rail gap** | **≤ 60px, and constant** | all viewports | the metric that actually catches D-23; the % rule alone passed it at 38.9% |
| Horizontal overflow | 0 | all viewports | |
| Controls in view | required | desktop only | §4 accepts phone scrolling |

**The desktop scoping matters and was itself a correction.** Applying the
desktop criteria to phones produced 50 false failures at 320×568 and 375×667 —
a wrapped two-row header on a 568px screen makes panel-top naturally large, and
§4 permits phone scrolling. Those were harness errors, not app defects.

---

## 8. FULL REGRESSION — RUN BEFORE PACKAGING

Per §14 the audit ran to completion **before** any ZIP was built.

| Check | Result |
|---|---|
| States swept | **1,176** (21 viewports × topic screen + 6 topics × 9 states) |
| Horizontal overflow | **0 of 1,176** |
| JavaScript exceptions | **0** |
| Focus left on a hidden screen | **0** |
| Badge invisible / wrong text | **0 / 0** |
| Painted badge-content overlap (D-21) | **0** across 20 viewports, both scroll positions |
| Application console errors | **0** |
| Failed local asset requests | **0** |
| Placement, 15-viewport matrix | **PASS** |

### 8a. Functional — 19 of 19

All six topic cards open · Definition → Clue → Example → Try It intact on all six
· Finish gated until answered · wrong answer marked wrong with Finish still gated
· correct answer unlocks Finish and locks the choices · completion screen with
all four controls · Escape ladder (guide → lesson → topics → home) · Back / Home
/ All Topics · no duplicate handlers after 10 guide open/close cycles · focus
never on a hidden screen · strategy heading and eight steps unchanged · topic
order, descriptions and clue badges unchanged.

### 8b. Plain → marked, exact sentence match

**16 of 16 pairs across all six topics.** Word-for-word identical, plain pass
free of markup, READ IT before SEE HOW IT WORKS, both labels exact — compared
from **rendered text**, not from the data file.

### 8c. Study Guide

Focus trap forward (12 × Tab) and **reverse** (12 × Shift+Tab) and mixed — all
six guides pass. Escape closes and returns focus to `lesson-guide`. Backdrop
closes. One overlay and one panel after 10 open/close cycles.

### 8d. Home and topic portal

Logo centred, tagline correct, four cards unchanged, only buttons navigate, no
login/profile/settings, Build 1.2.4 visible. Topic portal: six topics, correct
order, 3 × 2 desktop / 2 columns tablet / 1 column phone, strategy section
intact, **zero text concatenation**, three separated lines per card.

### 8e. Accessibility

Contrast unchanged from 1.2.3 (41 of 41 pass, tightest 5.21:1 — no colour
changed in this build) · focus ring visible on all six topic cards · Enter and
Space both activate · touch targets ≥ 44px (topic cards 112px on phone, Try It
choices 54px) · all controls are semantic `<button>` elements.

---

## 9. DEFECT LEDGER

### Closed in this build

| ID | Defect | Evidence |
|---|---|---|
| **D-23** | Lesson stack positioned too low | header→rail gap now a constant 14px at every viewport and step; worst panel top 21.2% vs 38.9% |
| **D-24** | Try It scroll at large viewports | 15 of 15 states, 5 viewports: no scroll, no clipped badge, all controls visible |
| **D-25** | Definition / footer pushed below the fold | 12 of 12: all six Definitions at both required widths |
| **D-22** | Adjective marked sentence wrapping | one line at all five widths; 1920 scroll 100px → 0 |

### Open

| ID | Issue | Severity | Detail |
|---|---|---|---|
| **D-26** | At 1366 × 768 the two densest Clue screens (Predicate, Adjective) push the **build badge** 49–63px below the fold. The lesson itself — panel, Back, Next and the All Topics footer — is fully visible. | 4 | Not fixed. Closing it would mean shrinking instructional text, which the brief forbids. The badge is metadata in normal document flow. |
| D-11 | Topic-screen density | 4 | Much improved across 1.2 / 1.2.3; re-assess before closing |
| D-13 | Completion-screen Back behaviour | 4 | Not addressed |
| D-20 | Abstract nouns in the noun topic (content) | 3 | Not addressed |

### Closed as design behaviour

**D-14 — CLOSED / DESIGN BEHAVIOR.** Learn does not persist lesson progress
between visits. Entering or re-entering a topic begins at Definition. This is
current design behavior, not a user-visible stale-state defect. No application
logic was changed.

### Environmental limitations

**L-01 — The real webfont still cannot be loaded here.** The sandbox blocks the
Google Fonts CDN; every measurement in this report used a fallback face. The
live screenshots that exposed D-23 were in real Baloo 2, so the *defect* was
confirmed against the real typeface — but the *post-fix* numbers are
fallback-face figures. **Verify placement on the live site.**
**L-02** — All device testing is simulated viewport emulation. No physical
phone, tablet, laptop or projector was used.
**L-03** — No classroom projector verification.
**L-04** — No screen-reader testing; semantics verified structurally.
**L-05** — No testing with a child.
**L-06** — Chromium only. No Safari or Firefox.

---

## 10. VISUAL AUDIT — ANSWERED FROM RENDERS

25 screens captured and inspected at 1366×768, 1920×1080, 1024×692, 768×1024 and
390×844, cursor parked so no hover state was active.

| # | Question | Answer |
|---|---|---|
| 1 | Progress rail positioned naturally? | **Yes.** It sits 14px under the header at every size — the same place on every screen. |
| 2 | Excessive dead space above it? | **No.** The 226px and 406px gaps are gone; 14px everywhere. |
| 3 | Panel visually connected to the rail? | **Yes.** 10–19px between them; they read as one stack. |
| 4 | Does the panel start too low? | **No.** 11.7%–21.2% of viewport height across all desktop sizes. |
| 5 | Fits without unnecessary scrolling? | **Yes** on every desktop screen tested, except the badge-only case in D-26. |
| 6 | Back / Next / Finish visible? | **Yes** on every desktop state measured and every screenshot inspected. |
| 7 | Build badge safe? | **Yes** — never overlaps content (0 painted overlaps), never clipped mid-word. Two 1366 Clue screens place it below the fold: D-26. |
| 8 | 1.2.3 compact spacing intact? | **Yes.** Panel emptiness still 7–13%; nothing was re-inflated. The panels are the same size — only their position changed. |
| 9 | Still appropriate for a 3rd grader? | **Yes.** Type, buttons and colour are untouched; only vertical placement moved. |
| 10 | Intentional rather than mathematically centred? | **Yes** — and this is the point of the build. The lesson now starts where the eye expects it, instead of being centred by arithmetic in whatever space happened to be left. |

**1920 × 1080 completion** — confetti, heading, `VERB ✓`, recap and all four
controls sit directly beneath the rail. On the live 1.2.3 site the rail floated
at y≈371; it is now at y≈108.
**1920 × 1080 Try It** — all four choices on one row, feedback visible, Back and
Finish visible, no scroll.
**1920 × 1080 Adjective Clue** — the marked sentence holds one line, the whole
lesson fits, the four-level hierarchy reads cleanly.
**390 × 844 and 768 × 1024** — READ IT / SEE HOW IT WORKS intact, compact
spacing preserved, nothing harmed.

---

## 11. WHAT WAS AND WAS NOT CHANGED

**Changed — `css/styles.css` and `js/app.js` only.**

| File | Change | Lines |
|---|---|---|
| `css/styles.css` | `.lesson-body` centring removed; 1600px column widened; projector gate given a height condition; short-desktop-viewport block added | 908 → 940 |
| `js/app.js` | Build number only | 158 |
| `index.html` | **UNCHANGED** | 233 |
| `js/learn.js` | **UNCHANGED** | 634 |
| `js/data/learn-content.js` | **UNCHANGED — byte-identical** `e6ec8d739fecf51df7f92ab8b6c62bca` | 659 |
| `assets/images/*` | **UNCHANGED** | — |

**Preserved from Build 1.2.3, all re-verified:** centred Home logo · Home
otherwise unchanged · topic portal 3×2 / 2 / 1 · "Choose a topic to start
learning." · compact Learn panels · READ IT · SEE HOW IT WORKS · plain before
marked · exact sentence matching · explanatory wrong-answer feedback · completion
badge · Adjective colour · Study Guide behaviour · button sizes · all Learn
instructional content.

**Not built:** 20-question Learn banks · Practice · Break It Down · Test ·
scoring · progress tracking · new grammar content · new visual features.

---

## 12. CLEAN-EXTRACTION VERIFICATION

`Sentence-Sense.zip` was built only after the audit above passed, then extracted
to an empty directory, compared with `diff -r`, and the critical functional,
placement and responsive checks were re-run **against the extracted copy**.
Results are in Section 13 of the delivery notes; all passed, and the archive
contains only the approved file set.

---

*End of Build 1.2.4 audit report.*
