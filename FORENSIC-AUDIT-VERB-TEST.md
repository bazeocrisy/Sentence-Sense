# FORENSIC AUDIT — VERB TEST

**Audited build:** Sentence Sense — Build 1.4.0
**Branch:** `claude/build-1.4`
**Baseline commit:** `4f6ff47` — *Complete Verb Learn and Practice alignment*
**Working tree:** uncommitted at time of audit
**Date:** 2026-09-20
**Scope:** the new Verb Test, plus the whole Verb system it now completes

---

## 1. EXECUTIVE SUMMARY

Verb Test is implemented as a separate engine (`js/test.js`) and measures
independent mastery: no hint, no retry, no clue, no escalation, and no
correctness signal of any kind before the child submits.

**Four defects were found and fixed. A fifth concern was raised in review and
proven not to be a defect, with permanent regression checks added.** Two were caught by the audit's
own instrumentation; **two were caught only by looking at rendered screenshots**,
after every automated check had already passed — which is the argument for not
treating a green harness as proof.

| Category | Verdict |
|---|---|
| Scoring and mastery model | **PASS** |
| Shuffle (band-scoped) | **PASS** |
| Content and data integrity | **PASS** |
| Answer leakage | **PASS** |
| State machine and navigation | **PASS** |
| Accessibility | **PASS WITH KNOWN LIMITS** |
| Responsive (4 widths × 9 states) | **PASS** *(after fix)* |
| Learn → Practice → Test alignment | **PASS** |
| Regression | **PASS** |
| Code quality | **PASS** |
| Repository hygiene | **PASS** |
| **Overall** | **READY TO LOCK** |

**Harness: 267 / 267 passing** (was 234; 33 new Test checks).

---

## 2. TESTS PERFORMED

| Pass | What it drove | Checks |
|---|---|---|
| `verification/guard.js` | whole product, incl. 33 new Test checks | 267 |
| Forensic A — scoring | 9 simulated score combinations via `SS_TEST.scoreOf` | 9 |
| Forensic B — shuffle | 60 fresh sittings + 40 choice renders | 6 |
| Forensic C — data | every question, choice, explanation, field | 14 |
| Forensic D — state machine | back/change/leave/return/escape/submit paths | 6 |
| Forensic E — accessibility | keyboard focus, semantics, reduced motion | 9 |
| Forensic G — responsive | 4 widths × 9 Test states = 36 samples | 8 |
| Forensic H — regression | Home, 4 Skill screens, Learn, Practice | 8 |
| Visual inspection | 36 screenshots reviewed by eye | — |

---

## 3. DEFECTS FOUND

### D-T1 — Celebration fired on a failing score · **MEDIUM** · FIXED

The results panel rendered a 🎉 unconditionally, so a child scoring **3 of 12**
saw a party popper directly above *"Keep going. Review Learn, then try Practice
again."*

- **Repro:** enter Verb Test → answer all 12 incorrectly → submit.
- **File:** `index.html` (`#test-mark`), `js/test.js` (`renderResults`)
- **Fix:** the mark is `hidden` by default and shown only when `r.mastered`.
- **Changes behaviour?** Yes — visual only, no scoring change.
- **Regression risk:** none; one boolean on one element.
- **Found by:** screenshot review. Every automated check passed.

### D-T2 — Subscale rows misaligned below 460px · **LOW** · FIXED

The 8-dot Action row wrapped at narrow widths while the 4-dot Being row did not,
so the two counts landed on different lines and the block read ragged.

- **Repro:** 375×667 → complete the test → results.
- **File:** `css/styles.css` (`.score-row`, `.score-label`)
- **Fix:** below 460px the label takes its own line, so both rows lay out
  identically.
- **Changes behaviour?** No. Layout only.
- **Found by:** screenshot review.

### D-T3 — 1px horizontal overflow at 375px · **LOW** · FIXED

`.score-count` had `flex: 0 0 62px` against a fixed 118px label; with eight dots
the row exceeded the viewport by exactly 1px on the results and review panels.

- **Repro:** 375×667 → results. `scrollWidth 376` vs `clientWidth 375`.
- **File:** `css/styles.css` (`.score-row`, `.score-dots`, `.score-count`)
- **Fix:** row wraps, dots wrap, count sizes to content.
- **Changes behaviour?** No.
- **Found by:** forensic responsive sweep (G.phone375).

### D-T4 — `belong` was not a teachable verb · **HIGH** · FIXED IN DESIGN

The originally drafted Q8 used *"Those striped glasses **belong** to my older
brother."* `belong` is stative: it is neither an action (nothing happens) nor a
being verb (`am is are was were`). A child taught exactly two paths had **no
route to it**, and the action wording *"Which word tells what happens?"* was
wrong for it.

- **File:** `js/data/learn-content.js` (`verb.testBank`, T8)
- **Fix:** replaced with *"My older brother carefully **washed** those striped
  glasses."* Both lures preserved; the question is **harder**, because the
  answer and the strongest lure now share the `-ed` ending, so the suffix
  carries no signal at all.
- **Changes content?** Yes — one Test sentence, pre-implementation.
- **Found by:** content review before coding.

---

### D-T5 — Duplicate celebration element · **NOT A DEFECT** · verified

Raised during review: the mastery-only fix might have *added* a second
`.done-mark` rather than replacing the original, leaving an ungated party
popper visible on a failing score. The reasoning was sound — `js/test.js`
controls only `#test-mark`, so a second un-ID'd element would have been
invisible to that line.

**Root cause of the concern:** the edit command showed the old and the new
markup side by side, which reads as two elements.

**Audit result — no duplicate exists.** `#test-results` contains exactly one
`.done-mark`, carrying `id="test-mark"` and `hidden` by default:

| Line | Element | Panel |
|---|---|---|
| 207 | `.done-mark` | Learn completion — legitimate |
| 259 | `.done-mark#pm-mark` | Practice milestone — legitimate |
| 271 | `.done-mark` | Practice completion — legitimate |
| **345** | `.done-mark#test-mark` | **Test results — the only one** |

Zero duplicate ids in the document.

**Verified in the rendered browser, not in source**, by driving the real UI to
each of seven target scores:

| Case | Score | Mastery | Celebration | Guidance |
|---|---|---|---|---|
| 1 | 12/12 a8 b4 | YES | **visible** | You've got verbs… |
| 2 | 10/12 a7 b3 | YES | **visible** | You've got verbs… |
| 3 | 10/12 a8 b2 | no | **hidden** | Your action verbs are strong… |
| 4 | 10/12 a6 b4 | no | **hidden** | You know being verbs well… |
| 5 | 9/12 a6 b3 | no | **hidden** | Almost there… |
| 6 | 7/12 a5 b2 | no | **hidden** | Keep going… |
| 7 | 0/12 a0 b0 | no | **hidden** | Keep going… |

Practice completion and Learn completion both still show their own
celebrations — the gate is scoped to `#test-results` and does not touch
`.done-mark` globally.

**Regression tests added — permanent, in `verification/guard.js`:**

- `13.22` exactly one celebration element in Test results
- `13.23` Learn, Practice-done and milestone marks untouched
- `13.24` no duplicate ids anywhere in the document
- `13.25` ×7 — each scoring case drives the real UI and asserts mastery state,
  celebration visibility and guidance text together
- `13.26` celebration tracks mastery across all seven
- `13.27` guidance matches the expected message across all seven

Harness rises **255 → 267**.

**Affected files:** none changed — the existing fix was already correct.
`verification/guard.js` gained the regression checks.

---

## 4. INVESTIGATED, NOT DEFECTS

Recorded because each initially looked like a failure.

| Observation | Finding |
|---|---|
| Possible duplicate `.done-mark` in Test results | **No duplicate.** See D-T5 above — verified structurally and through seven rendered scoring cases. Regression checks 13.22–13.27 added so it cannot regress unnoticed. |
| Leak probe reported 1 leaking question | **Harness artifact.** An earlier check left a choice picked on Q1, and a picked choice is *supposed* to look different. The probe now resets first and compares only unpicked choices. Not a product defect. |
| "Next is not reachable by keyboard" | **Correct behaviour.** Next is `disabled` until a choice exists, and disabled buttons are correctly not focusable. The check tabbed before answering. Corrected to answer first; Next is reachable. |
| `outlineStyle: none` on a focused choice | **Measurement error.** Programmatic `.focus()` does not reliably match `:focus-visible`. Re-measured through real `Tab`: `solid 3px rgb(11,87,208)` vs `none` at rest. |

---

## 5. SCORING — PASS

Nine combinations simulated through `SS_TEST.scoreOf`, no UI involved.

| Case | Result | Mastery | Message |
|---|---|---|---|
| 12/12 | a8 b4 | **YES** | You've got verbs… |
| 10/12 a7 b3 | at threshold | **YES** | You've got verbs… |
| **10/12 a8 b2** | **NOT mastery** | **no** | *Your action verbs are strong. Review being verbs…* |
| 10/12 a6 b4 | NOT mastery | no | *You know being verbs well. Review action verbs…* |
| 11/12 a8 b3 | | YES | You've got verbs… |
| 9/12 · 8/12 | | no | Almost there… |
| 7/12 · 0/12 | | no | Keep going… |

**The key case is proven:** 8/8 action + 2/4 being = 10/12 and is **not** Verb
mastery, and the guidance names the weak half. A strong action score cannot hide
weak being-verb understanding.

No guidance string contains *fail*, *wrong*, *bad* or *poor*.

---

## 6. SHUFFLE — PASS

60 fresh sittings, 40 choice renders.

| Check | Result |
|---|---|
| Sittings crossing a band boundary | **0 of 60** — order is always `0,0,0,0,1,1,1,1,2,2,2,2` |
| Distinct question orders | **60 of 60** |
| Questions reaching position 1 of their band | **4 / 4 / 4** — every question in every band |
| Source array mutated by shuffling | **No** — Fisher-Yates runs on a copy |
| Correct-answer position over 40 renders | `{0:10, 1:8, 2:12, 3:10}` — all four positions, none dominant |

Easy → medium → hard survives every reshuffle.

---

## 7. CONTENT AND DATA INTEGRITY — PASS

| Check | Result |
|---|---|
| 12 questions, 4 per band | ✅ |
| 8 action / 4 being | ✅ |
| Exactly 4 choices, exactly 1 correct | ✅ all 12 |
| Answer appears in its own sentence | ✅ all 12 |
| **Every choice** appears in its own sentence | ✅ — no stale distractor survived a sentence revision |
| Explanation exists and names its own answer | ✅ all 12 |
| `type`, answer and question wording agree | ✅ all 12 — no being question uses action wording |
| Duplicate sentences | none |
| Stray or unused fields | none |
| Being sentences violating the participle rule | **0** — `funny`, `ready`, `empty`, `proud` |
| Questions offering a second finite verb | **0** |
| Test sentences reused from Learn or Practice | **0 of 12** — all new |

Being forms in Test: `is` · `are` · `was` · `were`. `am` is covered in Learn's
fallback list and Practice Q19; forcing it into twelve third-person items would
have read oddly for no assessment gain.

---

## 8. ANSWER LEAKAGE — PASS

Walked all 12 questions comparing every unpicked choice's computed
`backgroundColor`, `color`, `borderTopColor`, `fontWeight`, `className`,
`aria-label`, `title` and `disabled`.

**0 questions leaked.** Every choice is indistinguishable except by its text.

- The selected state uses a navy/skill **outline plus inset ring**, deliberately
  unlike Practice's green `.is-right` / orange `.is-wrong`.
- Choices carry `aria-pressed` and nothing else — no `aria-label`, no `title`
  that could differ by correctness.
- DOM order is the shuffled order; correctness has no relationship to it.
- Correct answers occupied all four positions across the walk.

---

## 9. STATE MACHINE — PASS

| Path | Behaviour |
|---|---|
| Answer 3 → Back ×2 | returns to Q2 with its answer still selected, Next enabled |
| Change an answer | stored at the right position; exactly one choice stays marked |
| Leave mid-test → return | clean test: pos 0, all answers null, no result |
| Escape mid-test | returns to the Skill screen |
| Before submit | `result === null`; results and confirm panels both hidden |
| Finish 12 | reaches the **confirmation**, not the results |
| Try again | full reset — new band order, new choice order, answers and score cleared |
| After a full walk | `localStorage` and `sessionStorage` both empty |

No stale answers, no stale score, no duplicated listeners (all bound once in
`init`), no scoring before submission.

---

## 10. ACCESSIBILITY — PASS WITH KNOWN LIMITS

| Check | Result |
|---|---|
| Choices are real `<button>` | ✅ |
| `aria-pressed` on every choice | ✅ selection, never verdict |
| No `aria-label` / `title` that varies by correctness | ✅ |
| Next exposes a real `disabled` state | ✅ |
| Keyboard focus ring | ✅ `solid 3px rgb(11,87,208)`, measured through `Tab` |
| Next reachable by keyboard | ✅ once enabled |
| Reduced motion respected | ✅ transitions collapse to ~0 |
| Colour not the only signal for "picked" | ✅ border + inset ring + `aria-pressed` |
| Text under 12px | 0 |
| Tap targets under 44px | 0 |

**Known limit (carried, not new):** **L-04 — no screen reader was run.** ARIA and
focus movement are implemented and programmatically checked; no screen-reader
testing is claimed.

---

## 11. RESPONSIVE — PASS

4 widths × 9 Test states = **36 samples**: start, Q1, Q1-selected, middle, last,
confirm, results, review, retest.

| Width | Result |
|---|---|
| 1440×900 | 0 issues |
| 820×1180 | 0 issues |
| 390×844 | 0 issues |
| 375×667 | 0 issues *(after D-T3)* |

0 overflow · 0 clipping · 0 text under 12px · 0 tap targets under 44px ·
0 page errors.

---

## 12. LEARN → PRACTICE → TEST ALIGNMENT — PASS

| Concept | Learn | Practice | Test |
|---|---|---|---|
| Action verbs | ✅ | 14 questions | 8 questions |
| Being verbs | ✅ | 6 questions | 4 questions |
| DOES vs IS | ✅ callout | ✅ both types | ✅ both subscales |
| *What happened?* | ✅ | ✅ | ✅ T1, T5, T8, T9, T12 |
| *What happens?* | ✅ | ✅ | ✅ T3, T11 |
| *What is happening?* | ✅ | — | ✅ T6 |
| `am` | ✅ list | ✅ Q19 | — (by design) |
| `is` / `are` / `was` / `were` | ✅ | ✅ | ✅ |
| `-s` clue | ✅ | ✅ | ✅ |
| `-ed` clue | ✅ | ✅ | ✅ |
| `-ing` clue | ✅ | ✅ | ✅ |
| Clues-not-rules | ✅ warning | ✅ 15/20 | ✅ 8/12 |
| Reject `-s` nouns | ✅ | ✅ | ✅ |
| Reject non-verb `-ed`/`-ing` | ✅ | ✅ | ✅ |
| Noun/verb double duty | ✅ contrast | ✅ Q9, Q13 | ✅ T6, T7, T9, T11 |

**No Test concept is untaught.** `What is happening?` appears in Learn's callout
and is measured at T6; it is the one wording Practice does not use, which is a
gap in Practice rather than an unsupported Test item.

Terminology is identical across all three: *action verb*, *being verb*, *clues,
not rules*, *tells what someone or something does or is*. No contradictory
strategy was found.

---

## 13. REGRESSION — PASS

| Surface | Result |
|---|---|
| Home | clean, unchanged |
| Verb Skill screen | Test now **available** (has a bank) |
| Subject / Noun / Adjective Skill screens | Test still honestly **"Coming next"** — 3 cards each, own colours |
| Verb Learn | 4 states, unchanged |
| Verb Practice | 20 questions, clue button intact, unchanged |
| Routing, Escape, navigation | unchanged |
| Page errors | 0 |

`js/learn.js` and `js/practice.js` were **not modified**.

---

## 14. CODE QUALITY — PASS

- **`js/test.js` is independent.** It imports nothing from `practice.js` and
  shares only `SS_SENTENCE` and `SS_SHELL`, the same primitives every component
  uses. No coupling.
- **Duplication is deliberate and small.** `shuffled()` exists in both engines
  (~8 lines). Hoisting it into a shared module to save eight lines would create a
  dependency between two components whose whole design point is independence.
  **Not recommended.**
- No dead code, no debugging statements, **no `console.*` in any shipped file**.
- No globals beyond the single `window.SS_TEST`, matching the existing pattern.
- Listeners bound once in `init()`; no re-binding on re-entry.
- **No hard-coded Verb colour.** Every rule is keyed to
  `--{skill}-ink/-tint/-edge`, and the picked state is defined for all four
  skills. Subject, Noun and Adjective need **only a `testBank` and
  `test: "bank"`** — no code change.

---

## 15. REPOSITORY HYGIENE — PASS

**Source / product files**

| File | Change |
|---|---|
| `js/test.js` | **new** — the Test engine |
| `js/data/learn-content.js` | `verb.testBank` added; `verb.test` → `"bank"` |
| `index.html` | `#screen-test` + `test.js` script tag |
| `css/styles.css` | Test styles, selected state, results, review |
| `js/app.js` | `SCREENS` gains `test`; `activityReady`, routing, init, Escape |

**Verification / evidence files**

| File | Change |
|---|---|
| `verification/guard.js` | check 3.4 made conditional; 21 Test checks added |
| `verification/results.json` | regenerated |
| `verification/screenshots/` | curated set refreshed |
| `FORENSIC-AUDIT-VERB-TEST.md` | this document |

No temp files, no scratch files, no generated junk, no duplicate screenshot dump.
All working files live outside the repository. `main` untouched. No deploy
configuration changed.

---

## 16. FINAL RECOMMENDATION

**READY TO LOCK.**

All four defects are fixed and re-verified. Harness 267/267; both forensic passes
clean; 36 responsive samples clean; regression clean.

### Carried limitations (not new, not blocking)

- **L-04** no screen-reader testing has been performed on any part of this product.
- **L-05** no testing with an actual third grader — still the most important gap.
- **L-06** Chromium only.

### Recommended next, not now

- **A 16-question Test pool, drawing 12.** Retests currently reshuffle the same
  12. A pool would measure the skill rather than recall. Deferred by instruction.
- **`What is happening?` in Practice.** Learn teaches it and Test measures it,
  but Practice never uses it — the one asymmetry the alignment matrix found.
