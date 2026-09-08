# SENTENCE SENSE — BUILD 1.2.5 AUDIT REPORT
## Verb guided learning bank — 20 questions, four stages

**Build:** Sentence Sense — Build 1.2.5
**Date:** 2026-09-07
**Scope:** Learn → Verb → Try It only. The single Verb question becomes the
approved 20-question guided cycle. No other topic and no other mode changed.
**Method:** headless Chromium — a new bank-behaviour harness, content
validation, full regression sweep, responsive and accessibility passes, and
rendered-screen inspection

---

## 0. VERDICT

# PASS WITH KNOWN ISSUES

The cycle works end to end, all 33 behavioural assertions pass, and the five
other topics are provably untouched. Two known issues remain open, both
documented in Section 9, and one content observation is raised for the owner's
decision rather than changed unilaterally.

---

## 1. RECONCILIATION BEFORE EDITING

| Check | Result |
|---|---|
| `Sentence-Sense.zip` extracted and compared to the working tree | **Identical** — no discrepancy |
| Build 1.2.4 behaviour verified before editing | `BUILD_NUMBER = "Build 1.2.4"`; the D-23 fix (`.lesson-body` with no `justify-content`) and the D-22 projector gate (`min-width:1800px) and (min-height:1100px`) both present |
| New discrepancy found | **None** |

---

## 2. BUILD NUMBER

| Location | Value |
|---|---|
| `js/app.js` — `const BUILD_NUMBER` | `"Build 1.2.5"` |
| Rendered badge | `Sentence Sense — Build 1.2.5` |
| Badge across **1,176 swept states** | correct in 1,176 of 1,176 |
| This audit | `AUDIT-REPORT-Build-1.2.5.md` |
| Handoff | Build 1.2.5 |

---

## 3. CONTENT AUDIT — RUN BEFORE ANY CODE WAS WRITTEN

All 20 approved questions were audited first, as required.

**No question was substituted.** Every one has exactly one defensible verb among
its four choices, and in each case the other three are a noun, an adjective, or
a place/thing. Automated validation confirms the structure:

| Check | Result |
|---|---|
| Questions | 20 |
| Exactly one correct answer each | 20 of 20 |
| Exactly four choices each | 20 of 20 |
| Every choice word actually appears in its own sentence | 80 of 80 |
| Every choice carries meaningful feedback | 80 of 80 |
| Second-attempt clue present | 20 of 20 |
| Third-attempt guided reveal present | 20 of 20 |
| Five questions per stage | 5 / 5 / 5 / 5 |
| Sentence length | 8–11 words (target 7–12) |
| Helping-verb phrases required | **none** — no `is running`, `was walking`, `has eaten`, `will play` |
| Action vs being classification | Q16, Q18, Q19, Q20 use `is / are / were / was` as the single verb; the rest are action verbs |
| Vocabulary above level without context | none found |

### 3a. One content observation — owner's call, not changed

**Q20 — "Our new library `was` crowded during family reading night."**
A strict parse can read `was crowded` as passive voice rather than *was* +
predicate adjective. At third grade the intended reading is standard and
`crowded` is a dictionary adjective, so the question holds — and because
`crowded` is **not** offered as a choice, the answer is unambiguous among
`new / library / was / night`.

Compare Q16, Q18 and Q19, where `quiet`, `visible` and `ready` are unmistakably
adjectives with no passive reading available at all. Q20 is the one that sits
closest to the verb-phrase line drawn in the brief. **Kept exactly as approved
and flagged rather than swapped.**

**Minor note:** `carried` is the answer twice — Q5 (puppy) and Q11 (students).
Different sentences, different stages, so they are never adjacent. Not a defect.

### 3b. What was authored, and what was not

The brief supplied complete wrong-answer feedback for Q1 only. Section 16
requires it on every wrong choice, so this build authored:

- **60 wrong-answer explanations** (20 × 3 distractors)
- **20 second-attempt clues**, from the two supplied templates
- **20 third-attempt guided reveals**, following the supplied pattern

**No question, sentence, choice or correct answer was invented.** Those are
exactly as approved. Each authored explanation names what the chosen word does
*in that sentence*, then redirects — the Q1 wording is the model:

> "brown tells what color the rabbit is. It describes the rabbit. Look again for
> the word that tells what happened."

Being-verb questions redirect differently, as the brief requires: *"Look again
for the word that tells what someone or something is."*

---

## 4. THE GUIDED CYCLE — HOW IT BEHAVES

### 4a. Structure

Definition → Clue → Example → **Try It** is unchanged; no fifth lesson step was
added. The 20-question cycle lives entirely **inside** Try It, and the top
progress rail still reads Definition → Clue → Example → Try It.

Inside Try It the child sees, above the sentence:

```
Question 7 of 20
Stage 2: Look Closer
Find verbs in sentences with more details.
```

Deliberately compact and muted so it orients without competing with the
sentence, which is what the child is meant to read.

### 4b. Stage banding and shuffle

| Stage | Questions | Name | Focus |
|---|---|---|---|
| 1 | 1–5 | Get Started | clear action verbs, understandable distractors |
| 2 | 6–10 | Look Closer | richer sentences, stronger distractors |
| 3 | 11–15 | Think It Through | longer sentences, varied openings |
| 4 | 16–20 | Challenge Yourself | action verbs mixed with `is / are / was / were` |

The five questions **inside** a stage are shuffled; the stages themselves never
move. Verified across **6 fresh sessions**: no question ever left its stage, the
order differed between sessions, and every session contained all 20 exactly once
with no repeat.

### 4c. Wrong answers teach — three escalating steps

| Attempt | What the child gets | Answer revealed? |
|---|---|---|
| **1st wrong** | What that word actually does in this sentence, then a redirect | no |
| **2nd wrong** | The central Verb clue again — *"Remember: ask yourself, What happened?"* or the being-verb form | no |
| **3rd wrong** | Guided reveal — *"Let's find it together. jumped tells what the dog did, so jumped is the verb."* The correct choice is marked and all choices lock. | yes |

The child is never trapped. Verified: attempts 1 and 2 leave Next disabled; the
third enables it and visually identifies the answer.

### 4d. Correct answers explain why

Every correct response says *why*, never a bare "Correct!". Encouragement varies
across *Nice thinking! · You found it! · Great job! · That's the verb! · Nice
work! · Great sentence checking!* — one short phrase, not a celebration.

### 4e. Milestones

| After | Screen |
|---|---|
| Q5 | ⭐ **Get Started complete!** — "You found verbs in clear sentences." → Next: Look Closer |
| Q10 | 🌟 **Look Closer complete!** — "You found verbs even when the sentence had more details." → Next: Think It Through |
| Q15 | 💪 **Think It Through complete!** — "You used sentence clues to find the verb." → Next: Challenge Yourself |
| Q20 | The existing completion screen |

Each carries **Keep Going**, plus All Topics and Home so the child can stop
without being held. No coins, no stars-as-currency, no points, no streak.

### 4f. Completion

🎉 · **You learned Verb!** · `VERB ✓` badge · *"You practiced finding action and
being verbs in 20 different sentences."* · then the existing four controls —
Next topic: Subject, Learn this again, All Topics, Home.

**No numeric score anywhere.** A scan of the entire lesson area on all 20
questions for `n/20`, percentages, "score", "points", "streak" and "correct so
far" returned **zero matches**.

### 4g. Pacing and Back

Nothing auto-advances: after a correct answer or a guided reveal the child
presses **Next Question** (or **Finish** on Q20).

**Back behaviour, defined and tested (§19).** From Try It, Back returns to
Example. Returning to Try It **restarts the cycle cleanly at Question 1** with a
fresh shuffle. Partial progress is deliberately not preserved — consistent with
the rest of Learn, where nothing is stored. From a milestone screen, Back
returns to the questions rather than leaving the lesson.

### 4h. Session behaviour

No persistence of any kind. Leaving via Home or All Topics and re-opening Verb
starts a fresh session at Definition, Question 1, new shuffle. Verified:
`localStorage.length === 0` and `sessionStorage.length === 0`.

---

## 5. FUNCTIONAL AUDIT — 33 of 33

| Check | Result |
|---|---|
| Bank header appears in Try It | Question 1 of 20 / Stage 1: Get Started |
| Starts at Question 1 of 20 | pass |
| Stage named and described | pass |
| Next says "Next Question", disabled until answered | pass |
| All 20 questions reachable in one run | 20 answered |
| No duplicate within a session | 20 unique |
| Milestones fire after Q5, Q10, Q15 — and only there | `[5,10,15]` |
| Stage bands in order 1-5, 6-10, 11-15, 16-20 | pass |
| No score / percentage / points / streak anywhere | clean across all 20 |
| Final completion after Q20 | pass |
| Completion title + VERB badge | "You learned Verb!" / VERB |
| Completion message, no number score | "…20 different sentences." |
| Completion keeps all four controls | Next topic: Subject, Learn this again, All Topics, Home |
| 1st wrong explains then redirects; answer not revealed | pass |
| 2nd wrong gives the clue; answer still not revealed | pass |
| 3rd wrong reveals, marks the answer, locks choices, enables Next | pass |
| Three wrong attempts used three different distractors | pass |
| Choices lock after a correct answer | pass, all 20 |
| Back from Try It returns to Example | pass |
| Returning to Try It restarts at Question 1 | was at Q2, returned to Q1 |
| Leaving and re-opening Verb starts at Definition | pass |
| Re-entry starts a fresh cycle | pass |
| Nothing persisted | localStorage 0, sessionStorage 0 |
| Shuffle never leaves its stage (6 fresh sessions) | pass |
| Order varies between sessions | pass |
| Every session contains all 20 exactly once | pass |
| **Other five topics still use ONE Try It question** | subject, complete-subject, predicate, noun, adjective — all single, all "Finish" |
| No JavaScript exceptions | 0 |

---

## 6. REGRESSION AUDIT

| Check | Result |
|---|---|
| States swept | **1,176** |
| Horizontal overflow | **0 of 1,176** |
| JavaScript exceptions | **0** |
| Focus left on a hidden screen | **0** |
| Badge invisible / wrong text | 0 / 0 |
| Painted badge-content overlap (**D-21**) | **0** |
| Placement, 15-viewport matrix (**D-23**) | **PASS** |
| **D-22** adjective wrapping | **still closed** — one line at all five widths |
| **D-24** Try It scroll | **still closed** — 15 of 15 states |
| **D-25** Definition / footer | **still closed** — 12 of 12 |
| Application console errors | **0** |
| Failed local assets | **0** |
| Functional suite | **19 of 19** |
| Home / topic portal checklist | 25 of 25 substantive |
| Plain → marked exact sentence match | **16 of 16** |
| Study Guide focus trap, both directions, six guides | pass |
| Topic portal 3×2 / 2 col / 1 col | pass |
| Home logo centred, four cards, buttons-only navigation | pass |

**Three harnesses needed updating, and that is worth recording.** `sweep.js`,
`func.js`, `probe.js` and `place.js` all selected Try It answers from
`topics.verb.tryIt`, which Verb no longer uses, and all expected the completion
screen one click after a correct answer rather than after twenty. Their first
runs failed. **That was the harnesses being out of date, not a defect** — they
are now bank-aware and pass. A reviewer re-running older scripts against this
build will hit the same thing.

---

## 7. RESPONSIVE AUDIT

Every bank state at all five required viewports.

| Viewport | H-overflow | Progress readable | Stage readable | Sentence | 4 choices | Min choice height | Next visible | Feedback overlap |
|---|---|---|---|---|---|---|---|---|
| 390 × 844 | 0 | yes | yes | yes | 4 | **54px** | yes¹ | none |
| 768 × 1024 | 0 | yes | yes | yes | 4 | 52px | yes | none |
| 1024 × 692 | 0 | yes | yes | yes | 4 | 52px | yes | none |
| 1366 × 768 | 0 | yes | yes | yes | 4 | 52px | yes | none |
| 1920 × 1080 | 0 | yes | yes | yes | 4 | 52px | yes | none |

Milestone screens: no overflow, title and **Keep Going** in view at all five.

¹ **One honest exception, at 390 × 844 in the wrong-answer state only.** The
feedback block pushes the Next button just below the fold. Inspected directly:
the sentence, the question, **all four choices** and the full feedback are on
screen — and Next is *disabled* in that state, because the child's next action
is another choice, which is visible. Once answered correctly, Next is in view.
Recorded as **D-27**, severity 4.

---

## 8. ACCESSIBILITY

| Check | Result |
|---|---|
| All four choices reachable by keyboard | 4 of 4 |
| Visible focus ring on every choice | 4 of 4 |
| Enter activates a focused choice | yes |
| Touch targets ≥ 44px | 52–54px |
| Correct / wrong not colour-only | written mark (✓ / ✕) **plus** a full sentence of explanation; wrong choices also take a dashed border, correct a solid one |
| Progress not colour-only | stated in words: "Question 1 of 20", "Stage 1: Get Started" |
| Focus after a correct answer | moves to Next |
| Focus after Next Question | moves to the lesson heading |
| Focus after a milestone | moves to the milestone title, then back to the heading on Keep Going |
| Focus left on hidden content | none |
| Feedback announced | `role="status" aria-live="polite"` on the existing feedback region |
| Semantic buttons | all choices and controls are real `<button>` elements |

---

## 9. DEFECT LEDGER

### Open

| ID | Issue | Severity |
|---|---|---|
| **D-27** | At 390×844 in the wrong-answer state the Next button sits just below the fold. All choices and the feedback remain visible, and Next is disabled in that state. | 4 |
| **D-26** | At 1366×768 the two densest Clue screens push the build badge below the fold. Lesson and controls fully visible. | 4 |
| D-11 | Topic-screen density — much improved; re-assess before closing | 4 |
| D-13 | Completion-screen Back behaviour | 4 |
| D-20 | Abstract nouns in the noun topic (content) | 3 |

### Closed as design behaviour

**D-14 — CLOSED / DESIGN BEHAVIOR.** Learn does not persist lesson progress
between visits. Entering or re-entering a topic begins at Definition. This is
current design behavior, not a user-visible stale-state defect. No application
logic was changed for it, and the 20-question cycle follows the same rule.

### Closed

D-22 · D-23 · D-24 · D-25 · D-20b · D-21 · D-12 / K-02 · K-01 — all verified
still closed in this build (Section 6).

### Environmental limitations

**L-01** The sandbox cannot load the real Baloo 2 webfont; all measurements used
a fallback face. **L-02** All device testing is simulated. **L-03** No projector
verification. **L-04** No screen-reader testing; semantics verified
structurally. **L-05** No testing with a child — whether the guided cycle
actually holds a third grader's attention for 20 questions is a question this
audit cannot answer. **L-06** Chromium only.

---

## 10. WHAT CHANGED

| File | Change | Lines |
|---|---|---|
| `js/data/learn-content.js` | `verb.tryItBank` added: 4 stages, 20 questions, 80 choices with feedback, 20 clues, 20 reveals. **Nothing existing was altered** — the legacy `verb.tryIt` block is still present and untouched, and the other five topics are byte-for-byte unchanged within the file. | 659 → 932 |
| `js/learn.js` | Section 2b: shuffle, bank state, question renderer, three-strike answer handling, milestone screen, advance logic. Legacy single-question path untouched and still used by five topics. | 634 → 899 |
| `index.html` | Bank header (`#tryit-head`) and milestone panel (`#lesson-milestone`) | 233 → 254 |
| `css/styles.css` | Section 9e-i: bank header and milestone styling | 940 → 973 |
| `js/app.js` | Build number only | 158 |
| `assets/images/*` | **UNCHANGED** | — |

**Not built:** Practice · Break It Down · Test · Subject / Complete Subject /
Predicate / Noun / Adjective banks · scoring · timers · streaks · accounts ·
persistent progress · APIs · databases.

---

## 11. CLEAN-EXTRACTION VERIFICATION

`Sentence-Sense.zip` was built only after the audit above passed, then extracted
to an empty directory, compared with `diff -r`, and the critical Verb
20-question functional test, build-number check and file-list check were re-run
**against the extracted copy**. All passed; results in the delivery notes.

---

*End of Build 1.2.5 audit report.*
