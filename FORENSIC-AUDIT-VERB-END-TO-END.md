# FORENSIC AUDIT — VERB, END TO END
## Acceptance audit of the complete child experience
### Sentence Sense — Build 1.4.0 · branch `claude/build-1.4`

---

## 1. EXECUTIVE SUMMARY

This is an **acceptance audit of the whole Verb journey**, not another Test-engine
audit. The question it asks is:

> *If a third grader used Verb from beginning to end with nobody sitting beside
> them, is the experience instructionally sound, visually coherent,
> understandable, accessible, responsive, and free of meaningful state defects?*

**Verdict: VERB ACCEPTANCE READY WITH MINOR CORRECTIONS.**

**Nothing here blocks giving Verb to a child this weekend.** There is no wrong
answer, no misleading teaching that the interface does not itself correct, no
correctness leakage, no broken path, no accessibility block, and no state
corruption. Every transition probed came back clean.

The findings cluster in one place the three previous audits never looked:
**vertical height**. Every prior audit measured width and declared responsive
success. Width is fine. Height is where Verb is thin — on short viewports, and
at one step even on a full desktop, the button that moves the child forward sits
below the fold. In every case inspected there is an honest scroll cue, and
keyboard users reach the control in three Tab presses, which is why these are
Medium and not High. But "the child can scroll to find it" is a weaker promise
than *ONE SCREEN. ONE OBVIOUS THING TO DO.*

The one instructional finding worth the owner's attention is that the teaching
which **corrects** the `-ing` clue lives inside a collapsed accordion, while the
Test uses `-ing` words as distractors twelve times — including the exact word
Learn lists as an example action verb.

| | |
|---|---|
| **Critical** | **0** |
| **High** | **0** |
| **Medium** | **5** |
| **Low** | **5** |
| States inventoried | 25 |
| Viewports measured | 8, including three height-stress cases |
| State × viewport measurements | 200 |
| Transition / leakage probes | 8 |
| Accessibility probes | 7 |
| Contrast nodes measured | 138 across 5 screens |
| Source files modified | **0** |

**Four findings raised by my own instruments were investigated and proved NOT
defects.** They are documented in §17 rather than deleted, because a quietly
removed false positive is indistinguishable from a quietly ignored real one.

---

## 2. BUILD / COMMIT BASELINE

| | |
|---|---|
| Branch | `claude/build-1.4` |
| HEAD | `5ae91a2283d0ca4b88a2a54924e636c646ad2ebc` |
| `main` | `cc1f102924ad4bb74166b1ac056005c3854380e3` — untouched |
| Working tree at audit start | clean |
| Working tree at audit end | clean except this file |
| Prior audits | `FORENSIC-AUDIT-VERB-TEST.md`, `FORENSIC-AUDIT-VERB-DYNAMIC-TEST.md` — both remain valid |

---

## 3. AUDIT METHODOLOGY — AND WHAT EACH CLASS OF EVIDENCE IS WORTH

The brief asks these to be kept apart. They are.

| Class | What was done | Weight |
|---|---|---|
| **1. Automated / programmatic** | Content loaded in a Node VM; objective matrix computed from the actual banks; 138 contrast nodes measured | Strong for facts, blind to meaning |
| **2. Simulated browser / viewport** | Real Chrome, 8 viewports, 25 states, 200 measurements, 8 transition probes, 7 accessibility probes | Strong for geometry and state |
| **3. Human visual inspection** | Screenshots opened and **looked at** — this is how the scroll-cue question was settled and how three instrument artifacts were caught | Essential; nothing else substitutes |
| **4. Actual physical device** | **NOT PERFORMED** | See §19 |

> ### ACTUAL DEVICE ACCEPTANCE: NOT YET PERFORMED
>
> Everything in §6 and §18 is **Chrome viewport emulation**. It is not a phone.
> Emulation does not reproduce real touch accuracy, browser chrome height, the
> iOS/Android URL bar collapsing on scroll, system font scaling, or a child's
> actual thumb. The height findings in this report are precisely the class of
> issue that emulation under-reports, because real browser chrome makes the
> usable viewport **shorter** than the number in the matrix. A manual checklist
> is in §20.

Evidence artifacts live in the session scratchpad at
`…/scratchpad/e2e/` and are **deliberately not in the repository**.

---

## 4. SCREEN / STATE INVENTORY

25 states, each with a stable audit ID.

| ID | State |
|---|---|
| `V-HOME-01` | Home — banner, four skill cards, quote strip |
| `V-SKILL-01` | Verb skill screen — three activity cards |
| `V-LEARN-01` | Step 1 — What is it? (DOES / IS callout, two contrast examples) |
| `V-LEARN-02` | Step 2 — How do I find it? (clue callout, being fallback, three suffix groups, warning, collapsed reference) |
| `V-LEARN-03` | Step 3 — Show me (plain → marked, 4-step routine) |
| `V-LEARN-04` | Step 4 — Let me try, unselected |
| `V-LEARN-05` | Let me try — wrong answer, feedback shown |
| `V-LEARN-06` | Let me try — correct answer, feedback shown |
| `V-LEARN-07` | Learn completion |
| `V-PRAC-01` | Practice opening, Q1 |
| `V-PRAC-02` | Practice — first wrong + feedback |
| `V-PRAC-03` | Practice — clue requested |
| `V-PRAC-04` | Practice — second wrong / escalation |
| `V-PRAC-05` | Practice — correct after help |
| `V-TEST-01` | Test intro, 12 preselected |
| `V-TEST-02` | Test intro, 20 selected |
| `V-TEST-03` | Test intro, 30 selected |
| `V-TEST-04` | Test Q1 unselected (band 1) |
| `V-TEST-05` | Test Q1 answer selected |
| `V-TEST-06` | Test mid question (band 2/3) |
| `V-TEST-07` | Test final question (Finish) |
| `V-TEST-08` | Submit confirmation |
| `V-TEST-09` | Results — low overall |
| `V-TEST-10` | See my answers — review open |
| `V-TEST-11` | Results — MASTERED, celebration |

**Additional states discovered during the audit, not in the brief's list:**

- `V-LEARN-02a` — the **collapsed** `Words to remember` reference inside Step 2.
  It is a `<details>` element, `open === false` by default. It is a distinct
  state because it contains teaching found nowhere else (§5, D-E5).
- `V-PRAC-00` — Practice **stage milestone** panels between stages.
- Practice completion and Learn completion are separate terminal panels.

---

## 5. INSTRUCTIONAL-OBJECTIVE MATRIX

Computed from the actual content, not inferred from a sample question.

| Objective | Learn | Practice | Test | Review | Rating |
|---|---|---|---|---|---|
| A verb tells what someone **DOES** | callout row + `kicked tells what the player DOES` | 14 questions | 32 questions | consistent | **PASS** |
| Ask **What happened?** | clue callout + routine step 2 | 10 | 19 | past-tense `did` | **PASS** |
| Ask **What is happening?** | clue callout | 0 | 0 | n/a | **OVER-TAUGHT** (taught, never used as a prompt) |
| Ask **What happens?** | **not taught** | 4 | 13 | present `does/do` | **PARTIAL** → D-E6 |
| A verb tells what someone **IS** | callout row + `is tells what the dog IS` + note | 6 | 16 | consistent | **PASS** |
| being form `am` | chip | 1 | 2 | — | **PASS** |
| being form `is` | chip | 1 | 4 | — | **PASS** |
| being form `are` | chip | 2 | 4 | — | **PASS** |
| being form `was` | chip | 1 | 4 | — | **PASS** |
| being form `were` | chip | 1 | 2 | — | **PASS** |
| Action verbs can end **-s** | group: runs, plays, throws | 5 answers | 6 answers | — | **PASS** |
| Action verbs can end **-ed** | group: jumped, played, walked | 9 answers | 19 answers | — | **PASS** |
| Action verbs can end **-ing** | group: running, playing, walking | **0 answers** | **0 answers** | — | **OVER-TAUGHT** → D-E5 |
| Endings are **clues, not rules** | explicit warning, visible above the fold | implicit | implicit | why explains the describer role | **PASS** |
| A plural `-s` noun is not the verb | not stated explicitly | 11 | 24 tagged | `names who is doing the action` | **PARTIAL** (taught only through practice) |
| An `-ed` word can **describe** | only via the warning | 1 | 3 tagged | `describes` | **PARTIAL** |
| An `-ing` word can **describe** | only via the warning + collapsed reference | 3 | 10 tagged | `describes` | **PARTIAL** → D-E5 |
| Same word, **two jobs** | **collapsed reference only** | — | 9 tagged | `is a thing in this sentence, not the action` | **PARTIAL** → D-E5 |
| Being verb + safe adjective | `The dog is happy` | 6 | 16 | `X describes the Y` | **PASS** |

**Action / being balance is sound end to end:** Learn gives both jobs equal
billing; Practice is 14/6 (70/30) with all five being forms and being questions
spread across all four stages at positions 5, 8, 14, 16, 18, 19; Test is 32/16
(67/33) with all five forms. **Nothing is tested that is not taught.**

---

## 6. DEVICE-STATE MATRIX

Eight viewports. **Height is treated as first-class**, which is the new
dimension in this audit.

Status = where the screen's **primary forward control** sits relative to the
fold. `ok` = fully visible · `cut` = crosses the fold · `BELOW` = entirely
below the fold.

| State | 1440×900 | 1366×768 | 834×1112 | 1112×834 | 430×932 | 390×844 | 375×667 | 390×650 |
|---|---|---|---|---|---|---|---|---|
| V-HOME-01 | ok | ok | ok | ok | ok | **cut** | **BELOW** | **BELOW** |
| V-SKILL-01 | ok | ok | ok | ok | ok | ok | ok | ok |
| V-LEARN-01 | ok | **cut** | ok | ok | ok | **BELOW** | **BELOW** | **BELOW** |
| **V-LEARN-02** | **BELOW** | **BELOW** | ok | **BELOW** | **BELOW** | **BELOW** | **BELOW** | **BELOW** |
| V-LEARN-03 | ok | ok | ok | ok | ok | ok | **cut** | **cut** |
| V-LEARN-04 | ok | ok | ok | ok | ok | ok | ok | ok |
| V-LEARN-05 | ok | ok | ok | ok | ok | ok | **BELOW** | **BELOW** |
| V-LEARN-06 | ok | ok | ok | ok | ok | ok | **cut** | **cut** |
| V-LEARN-07 | ok | ok | ok | ok | ok | ok | ok | ok |
| V-PRAC-01 | ok | ok | ok | ok | ok | ok | ok | ok |
| V-PRAC-02 | ok | ok | ok | ok | ok | ok | **BELOW** | **BELOW** |
| V-PRAC-03 | ok | ok | ok | ok | ok | ok | ok | ok |
| V-PRAC-04 | ok | ok | ok | ok | ok | ok | **cut** | **cut** |
| V-PRAC-05 | ok | ok | ok | ok | ok | ok | ok | ok |
| **V-TEST-01 … V-TEST-08** | ok | ok | ok | ok | ok | ok | ok | ok |
| V-TEST-09 | ok | ok | ok | ok | ok | ok | ok | ok |
| V-TEST-10 | ok | ok | ok | ok | ok | ok | ok | ok |
| V-TEST-11 | ok | ok | ok | ok | ok | ok | ok | ok |

**Horizontal overflow: zero, at every state, at every width.**
**Tap targets below 44px: zero, at every state, at every width.**
**Page errors: zero.**

Two things stand out:

1. **The Test is the best-behaved surface in the product.** Eleven states, eight
   viewports, not one fold problem. The dynamic-Test work paid for itself.
2. **Learn and Practice carry every height defect.** They are the older
   surfaces, and they were never measured against height.

### Scroll burden

Page height vs viewport, selected states:

| State | 1440×900 | 390×844 | 375×667 |
|---|---|---|---|
| V-LEARN-02 | 1035 / 900 | 1078 / 844 | 1086 / 667 |
| V-PRAC-02 | 900 / 900 | 844 / 844 | 829 / 667 |
| V-TEST-10 (review, 12 q) | 3210 / 900 | 4888 / 844 | 4858 / 667 |

The 12-question review is already a 4,888px scroll on a phone. A 30-question
review scales to roughly 2.5× that (D-E10).

---

## 7. LEARN FINDINGS

Audited independently; not assumed correct because it is locked.

**What is it? — PASS.** The DOES / IS distinction is the largest thing on the
step. Both examples are accurate: `kicked` marked in *The player kicked the
ball.*, `is` marked in *The dog is happy.* The note — *"Most verbs show action.
A few do not"* — is honest and correctly proportioned.

**How do I find it? — PASS on content, DEFECT on layout (D-E1).** The strategy
callout leads with *What happened?* / *What is happening?* and carries the being
fallback — *"No action? Look for a being verb."* with `am is are was were` chips.
This is the fix from the v1 Learn audit and it has held. The three suffix groups
follow, then the warning: *"These endings are clues. They are not rules. Read the
sentence to make sure."* — **visible above the fold at desktop**, which matters
for D-E5.

**Show me — PASS.** Plain sentence, then marked, both from the same `words`
array. The four-step routine is concrete and names the answer.

**Let me try — PASS.** *The curious students studied the old map.* Answer
`studied`. Every distractor has a specific, non-punitive explanation that
redirects rather than scolds (`curious tells what kind of students they are…`).

**Words to remember — this is where the instructional finding is (D-E5).** It is
a `<details>` with `open === false`. Inside it, and **only** inside it, is the
contrast *"The same word can do two different jobs"* — the only place the child
is shown an `-ing` word working as a real verb (`The workers are building…`).

**The step chips are not clickable.** `<li class="lstep">`, `tabIndex -1`. They
are progress indicators, not navigation. That is a defensible choice, but it
means that when `Next` is below the fold there is **no alternative forward
control on screen at all**.

---

## 8. PRACTICE FINDINGS

**Bank composition — PASS.** 20 questions, 14 action / 6 being (30%), all five
being forms present, spread across all four stages. This directly answers the
alignment rule in the handoff: being verbs are taught, **coached**, and measured.

**Coaching behaviour — PASS, and it genuinely reads as coaching.** A wrong answer
strikes through the chosen word, names why it is wrong in child language, and
offers *Have another look.* A `Need a clue?` control is available. The escalation
is patient and never says "wrong" as a verdict. Verified in the rendered UI:
*"puppy names who we are talking about. A verb can tell what someone does OR what
someone is. Look again for the word that tells what the puppy is."*

That is a materially different experience from the Test, which is the point.

**Layout — DEFECT (D-E3).** Feedback expands in place. At desktop the page does
not grow (900 → 900) but `Next` moves down 126px; at 375×667 that puts `Next`
entirely below the fold, and **the page does not auto-scroll**. The child is left
looking at feedback whose bottom line is cut and no visible way onward.

---

## 9. TEST FINDINGS — acceptance level

The engine audit is not repeated. Integration was re-verified.

| Check | Result |
|---|---|
| Selector offers 12 / 20 / 30, 12 preselected | PASS |
| 40 not offered to the child | PASS |
| Band progression, action/being representation | PASS |
| No hint, retry or feedback before submit | PASS |
| Confirmation step, and Back out of it | PASS |
| Results, review, CTA routing | PASS |
| **D-A1 invariant — zero `why` text in the active Test DOM** | **PASS — 0 of 48 explanations found at 30 questions** |
| sessionStorage: IDs only, new tab clean | PASS |
| Re-entering Test resets length to 12 rather than inheriting 30 | PASS |
| After a result CTA, no stale score or review | PASS |

The Test is the strongest surface in Verb on every axis measured.

---

## 10. RESULTS / REVIEW FINDINGS

All five tiers render correctly with the approved CTA hierarchy. The low-overall
result was inspected visually at 390×844: score plaque `5 / of 20`, Action bar
`4 of 13`, Being bar `1 of 7`, guidance *"Keep going. Review Learn, then try
Practice again."*, primary **Learn verbs**.

**Emotional tone — PASS, and worth saying plainly.** A child who scores 5 out of
20 sees no red, no cross, no "incorrect", no celebration withheld ostentatiously
— the same navy as every other screen, a calm sentence, and a door back to
Learn. That is the right treatment.

**Review usability — DEFECT (D-E10).** One item per question with no jump-to-miss
and no filter. At 12 questions the review is 4,888px on a phone. At 30 it is
unmanageable for the child who most needs it — the one with many misses.

---

## 11. ACCESSIBILITY FINDINGS

| Check | Result |
|---|---|
| Duplicate element ids | **none** |
| `lang` and `title` | `lang="en"`, title present |
| Heading structure | present on every screen |
| Keyboard: full path Home → Verb → Test | PASS |
| Visible focus ring on every control | PASS |
| Hidden screens reachable by Tab | **no** — verified empirically, 0 of 7 stops |
| Disabled controls use real `disabled`, not a look-alike | PASS |
| `aria-pressed` on size selector and choices | PASS |
| Reduced motion | PASS |
| Correctness in aria-labels or SR text | **none** |
| Tap targets ≥ 44px | PASS at all 8 viewports |
| **Contrast (138 nodes, 5 screens)** | **1 genuine failure** — D-E8 |

Contrast was measured properly for the first time in this project: no prior
harness check computes WCAG ratios. Ten apparent failures were investigated; nine
were instrument artifacts (§17). The one real failure is the developer build
badge at 2.8:1.

---

## 12. COGNITIVE-LOAD FINDINGS

Separated as the brief requires.

**Intrinsic load** (inherent to identifying verbs) — appropriate. The band
progression in both Practice and Test moves from clear sentences to lures to
reasoning, and that is the right shape.

**Instructional load** (necessary support) — appropriate and, in Practice,
genuinely good. The escalating clue structure is well judged.

**Extraneous load** (introduced by the interface) — this is where the findings
are, and only these became defects:

1. **V-LEARN-02 carries the most content of any screen in Verb** — a callout,
   a being fallback with five chips, three suffix groups with nine chips, a
   warning, and a collapsed reference — and it is the one screen whose forward
   control is below the fold at every viewport. Highest density, worst
   reachability. (D-E1)
2. **Feedback that grows pushes the exit off screen** (D-E3, D-E4). The child
   must re-scroll at exactly the moment their attention is on the explanation.
3. **The reference is collapsed by default** (D-E5). Content a child needs to
   resolve `-ing` sits behind a disclosure labelled *"Open this any time you get
   stuck"* — which asks the child to already know they are stuck.

No screen was found with too many simultaneous choices, unnecessary labels,
instruction far from its object, or terms outside a third-grade vocabulary.

---

## 13. TRANSITION / STATE-LEAKAGE FINDINGS

Eight probes. **All PASS. No stale state was found anywhere in Verb.**

| Transition | Result |
|---|---|
| Learn mid-question → Practice → Learn | resets to step 1, no stale feedback, no stale selection |
| Practice mid-question → Test → Practice | clean at Q1, no wrong-marks, no stale feedback |
| Test size 30 → leave → return | resets to 12; does not inherit the previous length |
| Results → Learn CTA → Test | no stale score, no stale review, `result === null` |
| Test start with a prior review open | **0 of 48 explanations in the DOM** (D-A1 holds) |
| Question → next question | scroll returns to top |
| Refresh mid-test | lands Home, no partial sitting |
| Hidden subtree focusability | no focusable control reachable in a hidden screen |

This is the cleanest area of the audit and it is worth noting explicitly: the
state discipline established during the Test work holds across the whole of Verb.

---

## 14. CLASSROOM-DISTANCE READABILITY

Not a vision test — a hierarchy judgement for classroom use.

**Strong at distance:** the score plaque (3.4rem), skill titles (32px), sentence
text in both Practice and Test (~20px), question prompts, choice buttons, and the
primary CTA. A parent standing behind the child can read the sentence and see
which choice was picked.

**Quiet:** the smallest text a child must read **to act** is 14.7px (the Test
helper line *"Every test has the same mix of questions…"*). Everything else
actionable is ≥ 16px. That is acceptable.

**Too quiet, but non-actionable (D-E7):** `.hq-label` at 12.5px × 4 on Home
(*Learn · Practice · Improve · Grow*) and `.hb-line` at 12.8px (*Aligned with
Georgia Grade 3 ELA Standards*). Neither is instructional and neither gates any
action, but the four-word process strip is the kind of thing a child would read
if it were legible.

---

## 15. REGRESSION MAP

Verb is the reference implementation, so root cause matters more than symptom.

| Defect | Root cause | Home | Skill | Learn | Practice | Test | Results | Review | Subject / Noun / Adjective template |
|---|---|---|---|---|---|---|---|---|---|
| D-E1 | **SHARED LEARN ENGINE + SHARED CSS** | — | — | ● | — | — | — | — | **inherits the defect** |
| D-E2 | **SHARED CSS / RESPONSIVE SYSTEM** | ● | — | — | — | — | — | — | **inherits the defect** |
| D-E3 | **PRACTICE ENGINE + SHARED CSS** | — | — | — | ● | — | — | — | **inherits the defect** |
| D-E4 | **SHARED LEARN ENGINE + SHARED CSS** | — | — | ● | — | — | — | — | **inherits the defect** |
| D-E5 | **VERB CONTENT** + shared Learn markup | — | — | ● | — | ● | — | ● | pattern repeats unless the template changes |
| D-E6 | **VERB CONTENT** | — | — | ● | ● | ● | — | — | content-local |
| D-E7 | SHARED CSS | ● | — | — | — | — | — | — | inherits |
| D-E8 | SHARED CSS | ● | ● | ● | ● | ● | ● | ● | inherits |
| D-E9 | **VERB CONTENT SCHEMA** | — | — | — | ● | ● | — | — | **high risk — see below** |
| D-E10 | TEST ENGINE (review render) | — | — | — | — | — | — | ● | inherits |

**Four of ten defects live in shared code and will be inherited by Subject, Noun
and Adjective unchanged.** That raises their practical priority above their
individual severity: fixing D-E1/E2/E3/E4 once in the shared layer fixes them for
four skills; fixing them after three more skills ship means fixing them four
times.

**D-E9 deserves its own note.** Practice classifies questions by `stage` with no
`type` field; Test uses `band` + `type`. During this audit *I misread the
Practice bank as containing zero being questions* because I trusted the `type`
field that Test defines and Practice does not. A future skill author reading Verb
as the template will hit the same trap. The content is correct; the schema is
inconsistent.

---

## 16. DEFECT REGISTER

### D-E1 — Learn Step 2's forward control is below the fold at every viewport

| | |
|---|---|
| **Severity** | **MEDIUM** |
| **State** | `V-LEARN-02` |
| **Devices** | All 8 except 834×1112 tablet portrait |
| **Root cause** | SHARED LEARN ENGINE + SHARED CSS |

**Description.** *How do I find it?* is the densest screen in Verb. Its `Next`
button sits below the fold on a 1440×900 desktop (top 929 vs 900), and 318px
below on 375×667. The step chips are not interactive, so no other forward control
is on screen.

**Reproduction.** Home → Verb → Learn → Next (to step 2) → observe at any listed
viewport without scrolling.

**Expected.** The child can see how to continue.
**Actual.** `Next` is invisible until the child scrolls.

**Evidence.** `desktop__V-LEARN-02.png`; measured `learn-next` top = 929 at
vh 900, 985 at vh 667.

**Mitigations, which is why this is Medium and not High:** the *Words to
remember* card is visibly cut at the fold, which is an honest "more below" cue;
the page is obviously scrollable; keyboard reaches `Next` in **3** Tab presses
and the browser scrolls it into view.

**Instructional impact:** low — no teaching is wrong. **Functional:** low — the
path works. **Accessibility:** none for keyboard; mild for a child with low
scroll confidence. **Independence:** this is the real cost — it is the most
plausible place in Verb for a child to ask *"What do I do now?"*

**Likely files:** `css/styles.css` (`.lesson-*`, `.activity-body`), `js/learn.js`.

---

### D-E2 — Home's first Start button is below the fold on small phones

| | |
|---|---|
| **Severity** | **MEDIUM** |
| **State** | `V-HOME-01` |
| **Devices** | 375×667 and 390×650 (**BELOW**), 390×844 (**cut**) |
| **Root cause** | SHARED CSS / RESPONSIVE SYSTEM |

**Description.** The app's entry point. The classroom banner, wordmark, headline,
subtitle, standards badge, *Choose a skill* heading and its subtitle consume the
whole first viewport. The Verb card begins at y 520 and its Start button at
y 768 — 101px below a 667px fold.

**Reproduction.** Open the site at 375×667. Observe: no actionable control.

**Evidence.** `small__V-HOME-01.png` — the Verb card is visible and cut at
*"What is happening?"*, which is an honest cue. Page height 2071 vs viewport 667.

**Impact.** Instructional none; functional none; independence **moderate** — this
is the first screen a child ever sees, and on a small phone it contains nothing
to press.

**Likely files:** `css/styles.css` (`.home-hero`, `.hero-*`, `.skill-grid`).

---

### D-E3 — Practice feedback pushes the forward control off screen, with no auto-scroll

| | |
|---|---|
| **Severity** | **MEDIUM** |
| **State** | `V-PRAC-02`, `V-PRAC-04` |
| **Devices** | 375×667, 390×650 |
| **Root cause** | PRACTICE ENGINE + SHARED CSS |

**Description.** After a wrong answer the feedback panel expands in place.
`Next` moves down 126px and, at ≤667px height, lands below the fold. **The page
does not scroll to reveal it** (measured `scrollY === 0` after the expansion).

**Evidence.** `small__V-PRAC-02.png` — the feedback's own last line is cut
mid-sentence at the viewport edge.

**Impact.** This is the most instructionally costly of the fold defects, because
it lands exactly on the coaching moment — the child is reading *why* they were
wrong, the explanation is cut, and the way onward is invisible.

**Likely files:** `js/practice.js` (feedback render), `css/styles.css`.

---

### D-E4 — Learn "Let me try" feedback pushes Next off screen

| | |
|---|---|
| **Severity** | **MEDIUM** |
| **State** | `V-LEARN-05` (BELOW), `V-LEARN-06` (cut) |
| **Devices** | 375×667, 390×650 |
| **Root cause** | SHARED LEARN ENGINE + SHARED CSS |

Same mechanism as D-E3, in Learn's single practice question. Listed separately
because it lives in a different engine and would need a separate fix.

---

### D-E5 — The teaching that corrects the `-ing` clue is behind a collapsed accordion

| | |
|---|---|
| **Severity** | **MEDIUM** — instructional |
| **State** | `V-LEARN-02` / `V-LEARN-02a`, and 12 Test questions |
| **Devices** | all |
| **Root cause** | VERB CONTENT + shared Learn markup |

**Description.** Learn's Step 2 teaches, in a visible group:

> **SOME ACTION VERBS END IN -ING** — running · playing · walking

No Practice question and no Test question ever has an `-ing` word as the correct
answer. **Twelve Test questions use `-ing` words as distractors**, and V046 uses
the word **`running`** — the exact word on Learn's chip — as a distractor:

> *The running water filled the campers' bottles quickly.* → answer `filled`

The teaching that resolves this — the contrast *"The same word can do two
different jobs"*, showing `are building` as a genuine verb — exists **only inside
the collapsed `Words to remember` reference**, which is `open === false` by
default and labelled *"Open this any time you get stuck."*

**Expected.** A child taught that `-ing` signals an action verb meets the
counter-example before being assessed on it.
**Actual.** The counter-example is optional; the assessment is not.

**Why Medium and not High.** The warning — *"These endings are clues. They are
not rules. Read the sentence to make sure."* — is **visible above the fold**
directly beneath the suffix groups, and the review `why` for every such question
explains the describer role. The interface does correct itself. But it corrects
itself with a general caution rather than a worked example, and the worked
example is hidden.

**This is not a request to change content.** Options range from opening the
`<details>` by default to promoting one contrast row into the visible flow. That
is the owner's call.

**Likely files:** `js/data/learn-content.js` (structure, not wording),
`js/learn.js` (`renderReference`).

---

### D-E6 — The prompt "What happens?" is never taught

| | |
|---|---|
| **Severity** | **LOW** — instructional |
| **Root cause** | VERB CONTENT |

Learn teaches two questions to ask: *What happened?* and *What is happening?*
The banks use three prompts, and **"Which word tells what happens?" appears in 4
Practice and 13 Test questions** — 35% of the pool — while the strategy callout
never uses that wording. Conversely *What is happening?* is taught and never used
as a prompt.

Semantically these are close enough that no child is likely to be blocked, which
is why this is Low. It is a terminology inconsistency between the strategy and
the assessment, not a teaching gap.

---

### D-E7 — Sub-14px text on Home

| | |
|---|---|
| **Severity** | **LOW** |
| **State** | `V-HOME-01` |

`.hq-label` at 12.5px × 4 (*Learn · Practice · Improve · Grow*) and `.hb-line` at
12.8px (*Aligned with Georgia Grade 3 ELA Standards*). Neither is actionable and
neither gates anything. Flagged under classroom-distance readability only.

---

### D-E8 — Build badge fails WCAG AA contrast

| | |
|---|---|
| **Severity** | **LOW** |
| **State** | all screens |

`.build-badge` — *Sentence Sense — Build 1.4.0* — `rgb(132,150,176)` on
`rgb(244,247,251)` = **2.80:1** at 12.16px, against a 4.5:1 requirement. It is
developer metadata, not content, but it is visible text and it does fail.

**This is the only genuine contrast failure in 138 measured text nodes across all
five screens.** Note also that **no harness check computes contrast ratios at
all** — this audit is the first time it has been measured.

---

### D-E9 — Practice and Test classify questions differently

| | |
|---|---|
| **Severity** | **LOW** — but high regression risk |
| **Root cause** | VERB CONTENT SCHEMA |

`tryItBank` questions carry `stage` (0–3) and **no `type` field**. `testPool`
questions carry `band` (1–3) **and** `type` (`action`/`being`). Both banks are
correct. The inconsistency is a trap for anyone treating Verb as the template —
during this audit it caused me to misread Practice as having zero being
questions until I checked the answers directly.

---

### D-E10 — Long-test review is an unbounded scroll

| | |
|---|---|
| **Severity** | **LOW** |
| **State** | `V-TEST-10` |

The review renders one full item per question with no jump-to-miss and no
filter. At 12 questions it is 4,888px on a 390px-wide phone; a 30-question review
is roughly 2.5× that. The child who most needs the review — many misses — has the
longest scroll and no way to reach only the misses.

---

## 17. FINDINGS THAT ARE NOT DEFECTS

Documented rather than deleted.

| Apparent finding | Reality |
|---|---|
| "36 focusable controls inside hidden subtrees" | **Artifact.** I measured static `tabIndex`, not real tabbability. Verified empirically: 0 of 7 tab stops land in a hidden screen; `[hidden]` resolves to `display:none`, which removes the subtree from tab order and the a11y tree. |
| "Skip link has no focus ring" | **Artifact.** The stop I flagged was `document.body`, which is a legitimate tab stop with no ring. The skip link itself has `outline: solid 3px` and moves on screen when focused. |
| "10 WCAG contrast failures" | **9 were artifacts.** My luminance parser mis-read CSS `color(srgb …)` notation as 0–255 values. Recomputed by hand: `.skill-ask-line` is **5.46:1** (passes), the *Sense* wordmark is large text needing 3:1 (passes, and logotypes are exempt anyway), Practice's *Next* was **`disabled`** (exempt under WCAG 1.4.3), and the Learn back arrow is navy on white (~12:1). Only D-E8 survives. |
| "Practice contains zero being questions" | **Artifact.** I filtered on a `type` field that Practice does not define. Practice is 14 action / 6 being with all five forms — see D-E9 for why the trap exists. |

---

## 18. SIMULATED-DEVICE RESULTS

**Chrome viewport emulation, headless, 8 viewports × 25 states = 200
measurements.**

- Horizontal overflow: **0**
- Tap targets under 44px: **0**
- Page errors: **0**
- Fold defects: **14 state/viewport combinations** across 6 states (D-E1–E4)
- Clipping with no scroll cue (false bottom): **0** — every cut inspected showed
  visibly truncated content

---

## 19. ACTUAL-DEVICE ACCEPTANCE STATUS

> ## ACTUAL DEVICE ACCEPTANCE: NOT YET PERFORMED
>
> No physical phone, tablet, or laptop was used. Everything above is emulation.

This matters more than usual for this particular report, because **every
significant finding is a height finding**, and emulation is optimistic about
height: a real mobile browser's URL bar and toolbar reduce the usable viewport
by roughly 100–140px below the emulated number. A state marked `cut` at 390×844
here may read as `BELOW` on a real phone.

---

## 20. MANUAL REAL-DEVICE CHECKLIST — 10–15 minutes

### A. Laptop or desktop (~5 min)

1. Open the site. **Without scrolling** — can you see a Start button? *(D-E2 says
   yes on a laptop.)*
2. Verb → Learn → Next to **"How do I find it?"**. **Without scrolling** — can
   you see the Next button? *(D-E1 predicts no.)*
3. Open *Words to remember*. Does the *"same word, two jobs"* contrast make sense
   to you as the counter-example to the `-ing` chips? *(D-E5.)*
4. Verb → Test → 20 → answer a few → Back → change an answer → Finish → Submit.
   Does the score and the guidance look right?
5. Press **Tab** repeatedly from the top of any screen. Can you always see where
   focus is?

### B. Your phone (~7 min) — the important half

6. Open the site. **Without scrolling** — is there anything to tap? *(D-E2.)*
7. Verb → Learn → step 2. Is Next visible? How far do you scroll? *(D-E1.)*
8. Verb → Practice → **answer one question wrong on purpose**. Can you read the
   whole explanation **and** see the Next button without scrolling? *(D-E3 — the
   one I most want a real result for.)*
9. Verb → Test → 12. Any sideways scrolling anywhere? Any button hard to hit
   with a thumb?
10. Finish the test, tap **See my answers**, scroll to the bottom. Does it feel
    too long? *(D-E10 — then imagine 30.)*
11. Rotate to landscape during a question. Does anything break?

### C. The one that matters most (~3 min)

12. Hand it to your son. Say nothing. **Watch where he hesitates.**
    Any hesitation lasting more than a couple of seconds is worth more than this
    entire report.

---

## 21. PRIORITIZED CORRECTION PLAN — DESIGN ONLY, NOT IMPLEMENTED

**The best available outcome here may genuinely be "no code changes this
weekend."** Nothing below blocks use. Everything below is an improvement, not a
repair.

### MUST FIX BEFORE WEEKEND LOCK

**Nothing.** No Critical or High defect exists. No Medium defect prevents a child
completing Verb, corrupts assessment, blocks accessibility, or teaches something
false that the interface does not itself correct.

### SHOULD FIX — one focused pass, four defects, one root cause

| Defect | Intended change | Files | Regression surface | Verification |
|---|---|---|---|---|
| **D-E1** | Reduce Step 2's vertical cost so `Next` clears a 900px fold — e.g. tighten `.lesson-groups` spacing, or render the three suffix groups as one row | `css/styles.css` | **All four skills' Learn step 2**; harness §4 | Re-run fold matrix at all 8 viewports; screenshot step 2 at 1440×900 and 375×667 |
| **D-E3, D-E4** | After feedback renders, bring the forward control into view (scroll the feedback block into view, or keep the control anchored) | `js/practice.js`, `js/learn.js`, `css/styles.css` | Practice and Learn for all skills; scroll-position checks | Fold matrix at 375×667 and 390×650; confirm no scroll jank on tall viewports |
| **D-E2** | Reduce Home's first-viewport height on short screens so one card edge plus its button is reachable | `css/styles.css` | Home at every width; harness §2 and §11 banner checks | Fold matrix; visually confirm the banner still matches the approved reference |

These four share one root cause — **vertical rhythm was never budgeted against
height** — and they live in shared code. Fixing them once fixes them for Subject,
Noun and Adjective before those skills are built. That is the strongest argument
for doing this pass now rather than later.

### DEFER / POLISH

| Defect | Note |
|---|---|
| **D-E5** | Owner decision, not a bug fix. Open `Words to remember` by default, or promote one contrast row into the visible flow. **Content change — requires approval.** |
| **D-E6** | Align the strategy wording with the prompt wording. **Content change — requires approval.** |
| **D-E7** | Raise `.hq-label` / `.hb-line` to ≥14px. |
| **D-E8** | Darken `.build-badge` to clear 4.5:1. One-line change. Worth doing with any pass. |
| **D-E9** | Add `type` to Practice questions for template consistency. Pure metadata; no behaviour change. |
| **D-E10** | A "jump to my misses" control on long reviews. Real feature; not this weekend. |

---

## 22. OWNER-ACCEPTANCE ANSWERS

**1. Could a third grader complete Verb independently?**
**Yes** — on a laptop or tablet, comfortably. On a small phone, with one caveat:
they will need to scroll at three points (Home entry, Learn step 2, after a wrong
Practice answer) where nothing is on screen to press. Every one of those has a
visible cue that content continues. A child who scrolls will not be stuck; a
child who does not scroll will pause.

**2. Does Learn actually teach everything Practice expects?**
**Yes.** Every concept Practice coaches — both verb jobs, all five being forms,
all three suffix clues, the clues-not-rules caution — is taught in Learn first.

**3. Does Practice actually coach everything Test measures?**
**Yes, with one asymmetry.** Action verbs, being verbs (all five forms), suffix
clues and plural-`s` lures are all coached. `-ing` lures appear 3 times in
Practice against 10 in the Test, and noun/verb double-duty is barely coached
against 9 tested items. Not a gap — a thinner rehearsal than the exam.

**4. Does Test measure rather than teach?**
**Yes, verified.** No hint, no retry, no feedback before submission, and — since
the D-A1 fix — not one explanation string anywhere in the DOM while a question is
on screen.

**5. Are Action and Being verbs treated with appropriate balance?**
**Yes.** Learn gives both jobs equal billing. Practice is 70/30, Test 67/33, both
with all five being forms, and mastery requires the being subscale independently
so a strong action score cannot hide weak being verbs.

**6. Does the interface ever accidentally teach "-s means verb", "-ed means
verb", "-ing means verb"?**
**"-s" and "-ed": no** — both are taught as clues, both appear as answers and as
lures, and the warning is prominent.
**"-ing": partially, yes.** Learn lists `running, playing, walking` as action
verbs; `-ing` is never the answer anywhere; and the child meets `-ing` as a
distractor 12 times, once as the literal word `running`. The visible warning
corrects the rule in general terms; the worked counter-example is hidden in a
collapsed panel. That is D-E5, and it is the finding I would most want you to
look at.

**7. Does any answer or explanation leak before it should?**
**No.** Verified across style, attributes, data, aria, markup, keyboard focus,
and full-DOM text search.

**8. Is the experience visually coherent from Home through Results?**
**Yes.** One card system, one button grammar, one selection idiom, one accent
palette per skill, consistent typography. The Test's newer surfaces sit
comfortably beside the older Learn and Practice screens.

**9. Is there any screen where the child may reasonably ask "What am I supposed
to do?"**
**Yes — one: Learn step 2 on a short screen, and the moment after a wrong
Practice answer on a phone.** Not because the instruction is unclear, but because
the control that acts on it is below the fold.

**10. Is there any defect serious enough that I should NOT give this to my son
this weekend?**
**No. Give it to him.** Prefer a laptop or tablet over a small phone — not
because the phone is broken, but because the phone is where he will have to
scroll to find the next step, and watching whether he does that on his own will
tell you more about D-E1 through D-E4 than any further audit I can run.

---

## 23. FINAL VERDICT

# VERB ACCEPTANCE READY WITH MINOR CORRECTIONS

Verb is instructionally sound, assessment-honest, state-clean, accessible and
visually coherent. Zero Critical, zero High. The teaching aligns with the
coaching and the coaching aligns with the assessment. Nothing leaks. Nothing is
stale. Nothing is wrong.

Five Medium defects share a single cause: **the layout was designed against width
and never budgeted against height.** They do not break anything; they make the
child scroll to find the next step at three moments, one of which is the coaching
moment. Four of the five live in shared code and will be inherited by Subject,
Noun and Adjective unchanged — which is the real argument for a short, focused
pass now rather than the same fix four times later.

"With minor corrections" describes a recommended tidy, not a blocked release.

**This verdict is based on simulated devices. It becomes an acceptance only after
§20 is run on real hardware — and the height findings are exactly the class that
emulation under-reports.**

---

*Audit performed read-only against `claude/build-1.4` at
`5ae91a2283d0ca4b88a2a54924e636c646ad2ebc`. No source file was modified, staged,
committed, pushed or deployed. `main` untouched at
`cc1f102924ad4bb74166b1ac056005c3854380e3`. Evidence artifacts are held outside
the repository in the session scratchpad.*

---
---

# APPENDIX A — CORRECTION PASS (D-E1 … D-E4)

**Scope:** D-E1, D-E2, D-E3, D-E4 only. D-E5 through D-E10 untouched.

**Constraints honoured:** no educational content changed, no Test logic changed,
no text size reduced, no tap target shrunk, no instructional content hidden,
Home not redesigned. Every change is layout arrangement, spacing, or scroll
recovery.

**Nothing was committed, pushed or deployed.**

---

## A1. RESULTS BY DEFECT

### D-E3 — Practice feedback scroll recovery · **FIXED**

| Viewport | Before the pass | After feedback, no recovery | **After the fix** | Feedback fully visible |
|---|---|---|---|---|
| 1440×900 | ok | ok | **ok** (no scroll) | yes |
| 1366×768 | ok | ok | **ok** (no scroll) | yes |
| 834×1112 | ok | ok | **ok** (no scroll) | yes |
| 1112×834 | ok | ok | **ok** (no scroll) | yes |
| 430×932 | ok | ok | **ok** (no scroll) | yes |
| 390×844 | ok | ok | **ok** (no scroll) | yes |
| **375×667** | ok | **BELOW** | **ok** (scrolled 111px) | yes |
| **390×650** | ok | **BELOW** | **ok** (scrolled 79px) | yes |

**Resolved at all 8 viewports.** The scroll fires only where the control is
genuinely out of view — `0px` on every tall screen, so nothing moves that did
not need to.

### D-E4 — Learn "Let me try" feedback scroll recovery · **FIXED**

| Viewport | After feedback, no recovery | **After the fix** | Feedback fully visible |
|---|---|---|---|
| 1440×900 … 390×844 (six viewports) | ok | **ok** (no scroll) | yes |
| **375×667** | **BELOW** | **ok** (scrolled 98px) | yes |
| **390×650** | **BELOW** | **ok** (scrolled 115px) | yes |

**Resolved at all 8 viewports.**

> **A defect found inside the fix.** My first implementation anchored the scroll
> on the feedback panel itself. That is wrong: `learn-next` sits **below** the
> feedback, so scrolling the feedback's bottom edge to the viewport bottom left
> the control just off screen — the defect, reproduced by its own fix. It still
> reported `BELOW` at 375×667 and 390×650. Re-anchored on `#learn-controls`,
> which reveals the feedback above it as well. Practice was correct from the
> start because it anchored on `#practice-controls`.

### D-E2 — Home entry point · **FIXED**

| Viewport | Start button before | after | Status |
|---|---|---|---|
| 1440×900 | 666 | 666 | ok |
| 1366×768 | 666 | 666 | ok |
| 834×1112 | 683 | 683 | ok |
| 1112×834 | 666 | 666 | ok |
| 430×932 | 832 | 832 | ok |
| **390×844** | 814 — cut | 814 | cut |
| **375×667** | **768 — BELOW** | **652** | **cut** (−116px) |
| **390×650** | **768 — BELOW** | **648** | **cut** (−120px) |

**No viewport leaves the child with nothing to press.** `BELOW` is eliminated
everywhere. On the three shortest screens the Start button's top edge is on
screen as a visible affordance, with the card cut beneath it as an honest cue.

### D-E1 — Learn Step 2 · **SUBSTANTIALLY IMPROVED, NOT FULLY RESOLVED**

| Viewport | `learn-next` before | after | Status |
|---|---|---|---|
| 1440×900 | 929 | **746** | BELOW → **ok** |
| 1366×768 | 929 | **746** | BELOW → **cut** |
| 834×1112 | 787 | 787 | ok → ok |
| 1112×834 | 929 | **746** | BELOW → **ok** |
| 430×932 | 974 | **910** | BELOW → **cut** |
| 390×844 | 974 | **910** | BELOW → BELOW (−64px) |
| 375×667 | 985 | **917** | BELOW → BELOW (−68px) |
| 390×650 | 944 | **876** | BELOW → BELOW (−68px) |

**Honest statement of what was and was not achieved.** Step 2 now fits entirely
on a desktop and on a tablet in either orientation, and very nearly on a laptop
and a large phone. On the three shortest screens it still requires a scroll.

**Why it cannot be fully fixed by layout.** Measured at 375×667, the step's
content is **653px** — callout 258, suffix groups 255, warning 63, reference
summary 77 — inside a 667px viewport that must also carry the header, the step
indicator, the lesson title and the controls. The content alone exceeds the
screen. Closing that gap would require shrinking text, hiding instructional
content, or cutting the teaching — all three explicitly out of scope, and the
first two are things this project has correctly refused before.

The remaining distance is **~250px, well under one screen**, the reference card
is visibly cut at the fold as a scroll cue, and keyboard users reach `Next` in
three Tab presses.

---

## A2. WHAT CHANGED

**`css/styles.css`** — new section 14, *Vertical rhythm — height, not just width*:

- The three suffix-clue groups become an **auto-fitting grid**
  (`repeat(auto-fit, minmax(200px, 1fr))`) — three columns on a desktop or
  tablet, one clean column on a phone. Same chips, same sizes, ~180px less
  height where it fits. An earlier attempt at `minmax(150px)` was reverted: it
  produced two cramped columns on a phone whose long uppercase labels wrapped to
  three lines each, which was **taller** than simply stacking.
- Tighter vertical rhythm on short viewports in four tiers (`max-height` 940 /
  760 / 700 / 670 / 660), touching **padding, gaps and margins only**.
- Home reclaims height on short screens: banner band, hero padding, section
  head, card padding, and the decorative card icon (44px → 40px — it is
  decoration *inside* the card; the **button** is the tap target and is
  unchanged at 52px).
- The banner's `background-position` moves from `88% 30%` to `88% 16%` on short
  screens. Height unchanged; only the window into the image moves.

**`js/practice.js`** — `revealControls()`, called after first-wrong,
second-wrong and clue feedback. Scrolls `#practice-controls` into view only when
it is out of view. Honours `prefers-reduced-motion`.

**`js/learn.js`** — `revealFeedback()`, called after wrong-answer feedback in
*Let me try*. Anchors on `#learn-controls`. Same guard, same reduced-motion
handling.

Neither JS change alters answer handling, scoring, attempt counting, the focus
policy on correct answers, or any content.

---

## A3. VERIFICATION

| | |
|---|---|
| **Full harness** | **304 / 304 passing, 0 failing** |
| Device/height matrix | re-run at all 8 viewports × 25 states |
| Fold findings | **21 → 12** |
| Feedback recovery | verified **before and after** expansion at all 8 viewports |
| Horizontal overflow | **0** — unchanged |
| Tap targets under 44px | **0** — unchanged |
| Page errors | **0** |
| Visual inspection | Learn step 2 at 1440×900; Home at 375×667 and 390×650 |

**No regression found in Home, Skill, Learn, Practice or Test.** The harness
covers all five surfaces and is unchanged at 304/304. All eleven Test states
remain `ok` at all 8 viewports.

**A regression was caught by eye, not by geometry.** After the first Home pass
the measurements were correct — the Start button had reached the fold — but the
screenshot showed the banner photograph cropped through both children's heads.
Geometry said fixed; the render said broken. That is what the
`background-position` change addresses, and it is exactly why §3 of this audit
insists screenshots be looked at rather than measured.

---

## A4. REMAINING FOLD STATES — NOT IN SCOPE, RECORDED FOR HONESTY

These appear in the re-run matrix. They share D-E1's root cause but were never
registered as their own defects, and this pass was scoped to D-E1 … D-E4:

| State | Status after the pass |
|---|---|
| `V-LEARN-01` Step 1 *What is it?* | `cut` at 1366×768; `BELOW` at 390×844, 375×667, 390×650 |
| `V-LEARN-03` Step 3 *Show me* | `cut` at 375×667 and 390×650 |

Step 1 gained only marginally from the shared rhythm tier (877 → 873 at
375×667) because its height is carried by the callout and the two contrast
examples, not by spacing. Same trade-off as D-E1: the content exceeds a 667px
screen.

---

## A5. DEFECT STATUS AFTER THE CORRECTION PASS

| ID | Severity | Status |
|---|---|---|
| **D-E1** | MEDIUM | **IMPROVED — not fully resolved.** `ok` or `cut` at 5 of 8 viewports; remaining overshoot cut from 318px to ~250px on the three shortest screens. Full resolution needs a content decision, not a layout one. |
| **D-E2** | MEDIUM | **FIXED.** No viewport leaves the child without a visible control. |
| **D-E3** | MEDIUM | **FIXED** at all 8 viewports. |
| **D-E4** | MEDIUM | **FIXED** at all 8 viewports. |
| D-E5 … D-E10 | — | **Untouched**, as instructed. |

The §23 verdict — **VERB ACCEPTANCE READY WITH MINOR CORRECTIONS** — stands, and
the minor corrections it named are now made. D-E1's residue on short phones is a
content-volume limitation and belongs with D-E5 in a future content decision
rather than in another layout pass.

**ACTUAL DEVICE ACCEPTANCE: STILL NOT PERFORMED.** The §20 checklist is
unchanged and is now more worth running, not less: these were height fixes
verified in emulation, and a real phone's browser chrome makes the usable
viewport shorter than every number above.

---

# APPENDIX B — STRUCTURED CORRECTION RECORD (D-E1 … D-E4)

Appendix A recorded what changed. This appendix records each defect in the
required structure, and adds the verification the extended brief called for:
the **full Practice escalation chain**, the **ten scroll rules**, and a
**targeted regression list**.

No further code changed between Appendix A and Appendix B. Everything below is
verification of the same fix.

---

## B1 — D-E1 · LEARN STEP 2

| | |
|---|---|
| **Original defect** | `learn-next` below the fold at 7 of 8 viewports, including 1440×900. Step chips are `<li tabindex="-1">`, so no alternative forward control exists on screen. |
| **Root cause** | SHARED CSS + SHARED LEARN ENGINE. Vertical rhythm was authored against width only. The three suffix-clue groups stacked at ~290px on the densest screen in Verb, and no `max-height` rule existed anywhere in the stylesheet. |
| **Exact change** | Suffix groups become an auto-fitting grid, `repeat(auto-fit, minmax(200px, 1fr))` — three columns on desktop/tablet, one clean column on a phone. Height-aware spacing tiers at `max-height` 940 / 760 / 700 / 670 / 660 touching **padding, gaps and margins only**. |
| **Files changed** | `css/styles.css` |
| **Accessibility impact** | None negative. No text resized, no target shrunk, no content hidden or collapsed. All nine required step-2 elements verified still present. Keyboard reaches `Next` in 3 Tabs, unchanged. |
| **Regression risk** | **Shared** — the same rules apply to Subject, Noun and Adjective Learn when those ship. That is deliberate: the fix lands once for four skills. Harness §4 covers Learn and is green. |
| **Verification** | Harness 304/304. Device matrix re-run at 8 viewports. Learn step 2 screenshot at 1440×900 inspected: groups side by side, warning, reference and **Next** all on screen. |
| **Status** | **PARTIAL** |

**Before → after, `learn-next` top vs viewport:**

| Viewport | Before | After | Status |
|---|---|---|---|
| 1440×900 | 929 | **746** | BELOW → **ok** |
| 1366×768 | 929 | **746** | BELOW → **cut** |
| 834×1112 | 787 | 787 | ok → ok |
| 1112×834 | 929 | **746** | BELOW → **ok** |
| 430×932 | 974 | **910** | BELOW → **cut** |
| 390×844 | 974 | **910** | BELOW → BELOW (−64px) |
| 375×667 | 985 | **917** | BELOW → BELOW (−68px) |
| 390×650 | 944 | **876** | BELOW → BELOW (−68px) |

**Why PARTIAL and not FIXED.** At 375×667 the step's content measures **653px**
— callout 258, suffix groups 255, warning 63, reference summary 77 — inside a
667px viewport that must also carry the header, step indicator, lesson title and
controls. The content alone exceeds the screen. Every remaining route to "FIXED"
is explicitly forbidden by this brief: shrinking instructional text, hiding
content, collapsing what should stay visible, or a fixed-position control. The
residue is a **content-volume** question and belongs with D-E5.

Remaining distance is ~250px — under one screen — with the reference card
visibly cut at the fold as a scroll cue.

---

## B2 — D-E2 · HOME

| | |
|---|---|
| **Original defect** | First Start button `BELOW` the fold at 375×667 and 390×650, `cut` at 390×844. The entry screen presented the app with nothing to press. |
| **Root cause** | SHARED CSS / RESPONSIVE SYSTEM. Banner, wordmark, headline, subtitle, standards badge and section head consumed the entire first viewport on short phones. |
| **Exact change** | Height-aware tiers reclaim space on short screens only: banner band, hero padding, section head, card padding, and the decorative in-card icon 44→40px. The banner's `background-position` moves `88% 30%` → `88% 16%` so the shorter band keeps both faces whole. |
| **Files changed** | `css/styles.css` |
| **Accessibility impact** | None negative. The **button** keeps its full 52px height — only the decorative icon inside the card was reduced. No text resized. No hero removed. |
| **Regression risk** | Home only. **Desktop is provably untouched**: every Home rule sits inside `max-height: 760px` or lower, so a 900px desktop matches none of them. Confirmed by screenshot. |
| **Verification** | Harness 304/304 (§2 and §11 banner checks green). Screenshots inspected at 1440×900, 375×667, 390×650. |
| **Status** | **FIXED** |

| Viewport | Before | After | Status |
|---|---|---|---|
| 1440×900 · 1366×768 · 834×1112 · 1112×834 · 430×932 | 666–832 | unchanged | ok → ok |
| 390×844 | 814 — cut | 814 | cut |
| **375×667** | **768 — BELOW** | **652** | **cut** (−116px) |
| **390×650** | **768 — BELOW** | **648** | **cut** (−120px) |

`BELOW` is eliminated at every viewport. On the three shortest screens the
button's top edge is on screen as a visible affordance.

---

## B3 — D-E3 · PRACTICE FEEDBACK EXPANSION

| | |
|---|---|
| **Original defect** | Wrong-answer feedback expanded in place, pushing `practice-next` below the fold at ≤667px height, and the page did not recover (`scrollY` stayed 0). |
| **Root cause** | PRACTICE ENGINE. A **correct** answer calls `.focus()` on Next, and focusing scrolls it into view for free. A **wrong** answer must not steal focus — the child is still choosing — so no scroll happened at all. |
| **Exact change** | `revealControls()` — scrolls `#practice-controls` into view with `block: "end"`, and **only when it is actually out of view**. Called after first-wrong, second-wrong and clue feedback. Honours `prefers-reduced-motion`. |
| **Files changed** | `js/practice.js` (+27 lines, no answer logic touched) |
| **Accessibility impact** | Positive. Focus is **not** moved, so mouse and touch users are unaffected and keyboard users keep logical focus on a choice they can still try. Reduced motion uses an instant scroll. No focus trap. |
| **Regression risk** | Low and contained. Answer handling, attempt counting, escalation and the correct-answer focus policy are untouched. |
| **Verification** | Every required state at all 8 viewports, plus the ten scroll rules. |
| **Status** | **FIXED** |

**All required states, `practice-next` fold status (8 viewports × 5 states):**

| State | desktop | laptop | tabP | tabL | phoneL | phone | small | shortest |
|---|---|---|---|---|---|---|---|---|
| before answering | ok | ok | ok | ok | ok | ok | ok | ok |
| first wrong | ok | ok | ok | ok | ok | ok | **ok** | **ok** |
| clue shown | ok | ok | ok | ok | ok | ok | **ok** | **ok** |
| second wrong | ok | ok | ok | ok | ok | ok | **ok** | **ok** |
| reveal / escalation | ok | ok | ok | ok | ok | ok | **ok** | **ok** |

**Feedback fully visible at every state, every viewport: yes.** Without the fix,
first-wrong was `BELOW` at 375×667 and 390×650.

---

## B4 — D-E4 · LEARN "LET ME TRY"

| | |
|---|---|
| **Original defect** | Same family as D-E3: feedback expansion dropped `learn-next` below the fold at ≤667px height. |
| **Root cause** | SHARED LEARN ENGINE, same mechanism — a wrong answer moves focus to the next available choice, not to Next, so nothing scrolled. |
| **Exact change** | `revealFeedback()`, anchored on `#learn-controls`, same guard and same reduced-motion handling as Practice. |
| **Files changed** | `js/learn.js` (+28 lines, no content or step logic touched) |
| **Accessibility impact** | Positive, and the existing focus behaviour is preserved exactly: focus still moves to the next untried choice on a wrong answer, and still to Next on a correct one. |
| **Regression risk** | Shared with Subject/Noun/Adjective Learn. Harness §4 green. |
| **Verification** | All required states at all 8 viewports. |
| **Status** | **FIXED** |

| State | desktop … phone (6 viewports) | 375×667 | 390×650 |
|---|---|---|---|
| unselected | ok | ok | ok |
| wrong selection, feedback expanded | ok | **ok** (was BELOW) | **ok** (was BELOW) |
| correct selection | ok | **ok** | **ok** |

**A defect found inside the fix, and corrected.** The first implementation
anchored on the feedback panel. `learn-next` sits **below** the feedback, so
scrolling the feedback's bottom edge to the viewport bottom left the control just
off screen — the defect, reproduced by its own fix. It still reported `BELOW` at
375×667 and 390×650. Re-anchored on `#learn-controls`. Practice was correct from
the start because it anchored on its controls container.

**Shared solution, not duplicated logic.** The two engines are separate by
design — that separation is a locked architectural decision — so each carries a
~10-line local helper with identical semantics rather than a new shared module.
This is deliberately under-refactored.

---

## B5 — THE TEN SCROLL RULES

| # | Rule | Result | Evidence |
|---|---|---|---|
| 1 | Do not scroll unless needed | **PASS** | `scrollY = 0` on all six tall viewports; only 79–115px where required |
| 2 | Do not hide feedback the child must read | **PASS** | feedback fully visible at every state, every viewport |
| 3 | Do not move focus unexpectedly for mouse/touch | **PASS** | focus after a wrong answer is **not** `practice-next` |
| 4 | Keyboard keeps logical focus | **PASS** | focus stays on the next untried choice; Next reachable by Tab |
| 5 | Respect `prefers-reduced-motion` | **PASS** | matchMedia consulted before every scroll |
| 6 | No smooth scrolling under reduced motion | **PASS** | scroll completed within 120ms (smooth would still be near 0) |
| 7 | No scroll loops | **PASS** | position stable: 87 → 87 after a further 900ms |
| 8 | No repeated scroll on resize | **PASS** | 87 before, 87 after a resize event |
| 9 | No stale scroll after the next question | **PASS** | `scrollY = 0` after Next, all 8 viewports |
| 10 | No scrolling hidden screens | **PASS** | leaving for Home leaves `scrollY = 0`, Practice hidden |

**30 checks, all pass.**

---

## B6 — TARGETED REGRESSION

| Check | Result |
|---|---|
| Test selector offers 12 / 20 / 30, 12 preselected | PASS |
| Test sizes 12, 20 and 30 each build the right sitting | PASS |
| 40 built but hidden from the child | PASS — built `12,20,30,40`, offered `12,20,30` |
| Test results render (mastered, plaque, two bars, no dots, correct CTA) | PASS |
| **D-A1 still holds** — zero explanation strings in the active Test DOM | **PASS — 0 of 48 at 30 questions** |
| Practice coaching still escalates: wrong → wrong → reveal | PASS |
| Learn keeps its four-step structure in order | PASS |
| Learn step 2 still shows all nine required elements | PASS |
| No duplicate ids | PASS |
| No visible tap target under 44px | PASS |
| Keyboard never enters a hidden screen | PASS — 12 stops, 0 hidden |
| Every keyboard stop keeps a visible focus ring | PASS — 12 stops, 0 without |
| Subject / Noun / Adjective placeholders unchanged | PASS |
| No page errors | PASS |

**16 checks, all pass.** No permanent harness checks were added: the harness is
unchanged at **304/304**, and everything above is verified by audit programs in
the scratchpad. Adding checks would have changed the agreed 304 baseline for a
pass whose brief did not ask for new permanent coverage.

---

## B7 — DESKTOP DID NOT BECOME CRAMPED

Every Home spacing rule sits inside `max-height: 760px` or lower, so a 1440×900
desktop matches none of them. Confirmed by screenshot: full overlay banner, all
four skill cards, preview sentences, quote strip — identical to before.

The only rule that reaches a 900px-tall desktop is the `max-height: 940px` tier,
which contains **Learn rules only**. On desktop its effect is the intended one:
Learn step 2 now fits on one screen instead of hiding its Next button.

---

## B8 — FINAL STATUS

| Defect | Status |
|---|---|
| **D-E1** Learn Step 2 | **PARTIAL** — `ok`/`cut` at 5 of 8 viewports; overshoot 318px → ~250px. Residue is content volume, not layout. |
| **D-E2** Home entry | **FIXED** |
| **D-E3** Practice feedback | **FIXED** — all 8 viewports, all 5 escalation states |
| **D-E4** Learn Let me try | **FIXED** — all 8 viewports, all 3 states |
| D-E5 … D-E10 | **Untouched**, as instructed |

**Recommendation: READY FOR OWNER DEVICE ACCEPTANCE.**

Run the §20 checklist on a real laptop and a real phone. These were height fixes
verified in emulation, and a real mobile browser's chrome makes the usable
viewport shorter than every number in this appendix — so the one place the
emulator is least trustworthy is exactly the thing that was fixed.
