# Sentence Sense — Build 1.2.6 Audit Report

**Build:** Sentence Sense — Build 1.2.6
**Type:** Micro correction pass — content wording only
**Date:** 2026-09-08
**Scope:** Verb guided bank, Question 20 sentence wording

---

## VERDICT

**PASS**

Two lines changed in the entire repository. Every other line of application
code, content, and CSS is byte-identical to Build 1.2.5. All regression
harnesses pass at or above their 1.2.5 results, and the three required screens
were rendered and visually inspected at three viewports.

---

## 1. WHAT CHANGED AND WHY

### The defect

Build 1.2.5 Question 20 read:

> Our new library was **crowded** during family reading night.

`crowded` ends in `-ed`. To an 8-year-old — and to a strict grammatical
reading — `was crowded` can be parsed two ways:

1. **Linking verb + predicate adjective.** `was` is the verb; `crowded`
   describes the library. This is the reading the question intends and the
   only one its feedback supports.
2. **Passive voice.** `was crowded` is a single verb phrase, which would make
   the correct answer ambiguous between `was` and the phrase as a whole.

Reading 2 is not what a 3rd grader is being taught, but the sentence does not
rule it out. A child who has been told "a verb tells what happened" can
reasonably look at `crowded` and see an action done to the library. The
question had one intended answer but two defensible readings of the predicate.

### The correction

> Our new library was **busy** during family reading night.

`busy` is an adjective with no participle form. `was busy` can only be
parsed as linking verb + predicate adjective. The passive reading is
structurally impossible, so `was` is the single defensible verb.

Nothing else about the question moved. Choices, correct answer, prompt, clue,
reveal, all three distractor explanations, stage placement, and word count are
unchanged.

---

## 2. RECONCILIATION BEFORE EDITING

`Sentence-Sense.zip` was extracted to a clean directory and compared file by
file against the working tree before any edit.

| Check | Result |
|---|---|
| `diff -r` of shipped ZIP vs working tree | **Identical — no discrepancy** |
| `BUILD_NUMBER` in `js/app.js` | `Build 1.2.5` |
| Bank shape | 4 stages, 20 questions |
| Q20 sentence | `Our new library was crowded during family reading night.` |
| Q20 stage | 3 (Stage 4: Challenge Yourself) |
| Q20 choices | `new`, `library`, `was`\*, `night` |

**Finding, reported before editing:** `grep -n "crowded"` returned exactly one
line in the whole repository — line 379 of `js/data/learn-content.js`, inside
the `words` array. No wrong-answer feedback, no clue, and no reveal string
referenced `crowded` or depended on the old wording. The three distractor
explanations describe `new`, `library`, and `night` on their own terms and are
correct regardless of which predicate adjective follows `was`.

**Consequence:** the brief's instruction to update any Q20 feedback that
depended on the old wording required **no feedback edits**. That is a finding,
not an omission.

---

## 3. THE COMPLETE DIFF

```
js/data/learn-content.js  line 379
-  sentence: { words: ["Our","new","library","was","crowded","during","family","reading","night."] },
+  sentence: { words: ["Our","new","library","was","busy","during","family","reading","night."] },

js/app.js  line 32
-  const BUILD_NUMBER = "Build 1.2.5";
+  const BUILD_NUMBER = "Build 1.2.6";
```

`diff -r` of the working tree against the 1.2.5 extraction reports exactly
these two files differing, and exactly one line differing in each. No CSS, no
HTML, no engine code, no other question.

---

## 4. GRAMMAR AUDIT OF THE NEW Q20

Sentence: **Our new library was busy during family reading night.**

| Check | Result |
|---|---|
| Exactly one defensible verb among the choices | **PASS** — `was` |
| `new` | adjective — describes the library |
| `library` | noun — names a place |
| `night` | noun — names when |
| Passive-voice reading possible? | **No.** `busy` has no participle form; `was busy` is linking verb + predicate adjective only |
| All four choices appear in the sentence | **PASS** |
| Sentence is one complete sentence | **PASS** — capitalised `Our`, single terminal period |
| Correct feedback still true of the new sentence | **PASS** — "It tells what the library was" describes `was busy` exactly |
| 3rd-grade readable | **PASS** — longest word `library` (7 letters); `busy` is a shorter, more common word than `crowded` |
| Word count | **PASS** — 9 words, unchanged |
| Stage placement | **PASS** — stage 3 (Stage 4), the being-verb band |

`busy` is also a better fit for the stage than `crowded` was: Stage 4 teaches
action verbs mixed with `is / are / was / were`, and a clean predicate
adjective is exactly what makes the linking verb visible.

---

## 5. INTEGRITY CHECK — ALL 20 QUESTIONS

Read directly from `window.SS_LEARN_CONTENT.topics.verb.tryItBank` in a live
page, not from the source file.

| Check | Result |
|---|---|
| Bank holds exactly 20 questions | **PASS** |
| Bank holds exactly 4 stages | **PASS** — Get Started / Look Closer / Think It Through / Challenge Yourself |
| Every question has exactly 4 choices | **PASS** |
| Every question has exactly 1 correct answer | **PASS** |
| Every question has a clue and a reveal | **PASS** |
| Every question sits in its correct stage band (1–5, 6–10, 11–15, 16–20) | **PASS** |
| Every choice on every question appears in that question's sentence | **PASS** |
| Every question has a prompt | **PASS** |
| No two questions share a sentence | **PASS** — 20 distinct |
| No other sentence altered by this pass | **PASS** — no other sentence contains `busy` |
| `crowded` gone from application code and content | **PASS** — 0 occurrences in `.js`, `.html`, `.css` |

**20/20 clean. No accidental changes to Q1–Q19.**

---

## 6. FUNCTIONAL REGRESSION

### Q20 audit (`q20.js`, new this build) — **31/31 PASS**

Includes: build badge reads 1.2.6; Q20 rendered live with the new wording;
Q20 reachable inside the cycle; `was` accepted; correct feedback shown
verbatim; completion still reached after Q20; no score/percentage/points/
streak/timer text anywhere; `localStorage` and `sessionStorage` both empty;
no JavaScript exceptions.

### Bank engine (`bank.js`) — **33/33 PASS**

All twenty reachable in one session, no duplicates, milestones after Q5/Q10/Q15
only, stage bands in order, three-strike escalation intact (explain → clue →
guided reveal), answer never revealed before the third attempt, Back returns to
Example, re-entry restarts at Question 1, shuffle never moves a question out of
its stage across six fresh sessions, order varies between sessions, nothing
persisted, **other five topics still use one Try It question each**.

### Other harnesses

| Harness | Result | Note |
|---|---|---|
| `func.js` — Learn engine | **19/19 PASS** | topic order, badges, step counts unchanged |
| `exact.js` — plain→marked pairs | **16/16 PASS** | word-for-word identical across 6 topics |
| `place.js` — §11 placement metrics | **PASS** | worst panel top 21.2% (limit 40%), header→rail gap constant |
| `checks.js` — Home / build / assets | **25/26** | sole failure is the sandbox's Google Fonts egress block, an environment limitation, not an app defect. All three local image assets load 200. |

`checks.js` was updated this build to expect `Build 1.2.6` rather than
`Build 1.2.5`; that is a harness expectation, not application code.

---

## 7. VISUAL INSPECTION

Screens were rendered in headless Chromium and the resulting images were
inspected, not inferred from CSS.

Captured at 390×844, 1366×768, and 1920×1080:

1. Q20 unanswered
2. Q20 answered correctly
3. Final completion

| Viewport | State | Sentence rows | Page scroll | Next in view | Badge in view |
|---|---|---|---|---|---|
| 390×844 | Q20 unanswered | 2 | 109px | yes | no † |
| 390×844 | Q20 correct | 2 | 197px | yes | yes |
| 390×844 | Completion | — | 0 | 4/4 buttons | yes |
| 1366×768 | Q20 unanswered | **1** | **0** | yes | yes |
| 1366×768 | Q20 correct | **1** | **0** | yes | yes |
| 1366×768 | Completion | — | 0 | 4/4 buttons | yes |
| 1920×1080 | Q20 unanswered | **1** | **0** | yes | yes |
| 1920×1080 | Q20 correct | **1** | **0** | yes | yes |
| 1920×1080 | Completion | — | 0 | 4/4 buttons | yes |

† The build badge sits below the fold on the narrow phone in this one state.
This is **pre-existing and unchanged** — see the side-by-side below. It is the
D-26 family of behaviour (badge is in flow after content on scrolling screens)
and was not introduced here.

### Side-by-side against Build 1.2.5, same screen, same measurement

The 1.2.5 ZIP was served from a clean extraction and measured with the same
harness so the two builds could be compared directly rather than assumed.

| Viewport | Metric | Build 1.2.5 (`crowded`) | Build 1.2.6 (`busy`) |
|---|---|---|---|
| 390×844 | sentence rows | 3 | **2** |
| 390×844 | page scroll | 139px | **109px** |
| 390×844 | Next button in view | **no** | **yes** |
| 390×844 | badge in view | no | no (unchanged) |
| 1366×768 | rows / scroll / Next / badge | 1 / 0 / yes / yes | 1 / 0 / yes / yes |
| 1920×1080 | rows / scroll / Next / badge | 1 / 0 / yes / yes | 1 / 0 / yes / yes |

**The wording change also improved the phone layout.** `busy` is three letters
shorter than `crowded`, which drops the sentence from three wrapped rows to
two on a 390px screen and brings the Next button back above the fold in the
Q20 unanswered state, where it was below the fold in 1.2.5. Desktop is
byte-for-byte identical in behaviour. This was a side effect, not a goal, and
no CSS was touched to obtain it.

**Visual findings:**

- The new sentence renders on **one line** at both desktop sizes with no
  scroll, with more slack in the line than 1.2.5 had.
- At 390×844 the sentence wraps to two rows instead of the previous three.
- The correct-answer state shows `was` marked green with the check and the
  feedback "✓ Great job! was is the verb. It tells what the library was."
  reading correctly against the new sentence.
- The build badge reads **Sentence Sense — Build 1.2.6** on every screen.
- Completion shows the 🎉 mark, "You learned Verb!", the VERB ✓ badge, "You
  practiced finding action and being verbs in 20 different sentences.", and
  all four controls. No number score of any kind.

**One capture artifact worth recording so a future session does not mistake it
for a defect:** `.lesson-done` carries a 0.25s `rise` entry animation
(`css/styles.css` line 623). A screenshot taken immediately after the final
Next catches the completion panel mid-fade and looks washed out. It is not a
rendering fault. Capture harnesses must settle ~450ms before screenshotting the
completion screen; `shot126.js` now does.

---

## 8. WHAT WAS DELIBERATELY NOT DONE

Per the brief, this pass did **not**:

- redesign anything, or change any layout
- change the 20-question engine
- change any question other than Q20
- change Q20's choices, correct answer, prompt, clue, reveal, or feedback
- fix **D-27** — explicitly deferred by the brief
- touch the other five topics, Practice Mode, Break It Down, or Test

---

## 9. KNOWN ISSUES — UNCHANGED FROM 1.2.5

| ID | Issue | Severity |
|---|---|---|
| **D-27** | At 390×844 in the wrong-answer state the Next button sits just below the fold. All four choices and the feedback stay visible; Next is disabled in that state. Deferred by instruction. | 4 |
| **D-26** | At 1366×768 the two densest Clue screens push the build badge below the fold. Lesson and controls fully visible. | 4 |
| **D-11** | Open from earlier builds. | 4 |
| **D-13** | Open from earlier builds. | 4 |
| **D-20** | Open from earlier builds. | 4 |
| D-14 | **CLOSED / DESIGN BEHAVIOUR** by instruction. | — |

No new discrepancy was introduced by this build.

---

## 10. FILES IN THE REPOSITORY AFTER THIS BUILD

```
index.html
css/styles.css
js/app.js
js/learn.js
js/data/learn-content.js
assets/images/logo.png
assets/images/logo-512.png
assets/images/favicon.png
SENTENCE-SENSE-HANDOFF.md
AUDIT-REPORT-Build-1.2.6.md
```

`AUDIT-REPORT-Build-1.2.5.md` was removed — only the current audit lives in the
working project.

---

*End of audit. Build 1.2.6 — Clarify Verb Q20 wording.*
