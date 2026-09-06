# Sentence Sense Audit Report

## 1. Build Summary

**Build 1.1.1 — Learn Mode Correction.**

A correction-only build against the P0/P1 defect register in `SENTENCE-SENSE-BUILD-1.1-FORENSIC-AUDIT.md`. No new features, no new modes, no reordering, no fifth step, no architecture change.

**Mandatory regression gate: HORIZONTAL OVERFLOW = 0 of 605 states.**

**Final completion pass (this revision)** adds two further items on top of the nine corrections: a remaining Study Guide focus-trap edge case found by independent review, and the approved Verb Study Guide memorization expansion. Both are documented in §4A. `css/styles.css`, `index.html` and `js/app.js` are **byte-identical** to the visually approved Build 1.1.1 — no sizing, typography or layout was touched.

Every authorized defect is verified **FIXED** with measurements. Two items outside the nine enumerated corrections are flagged for your review in §17 — one is a P1 defect from the audit that the nine corrections did not list, and one is a contrast failure in the same component that **the forensic audit itself missed**.

Verdict: **PASS**.

---

## 2. Authorized Scope

Read first, before any code was changed: `SENTENCE-SENSE-BUILD-1.1-FORENSIC-AUDIT.md`. Its P0/P1 register is the authority for this build.

| Audit priority | Defect | Enumerated as |
|---|---|---|
| **P0** | D-01 phone Try It overflow | Correction 1 |
| **P0** | D-02 wrong-answer feedback contrast | Correction 6 |
| **P1** | D-03 Study Guide focus trap | Correction 7 |
| **P1** | D-04 / D-19 Verb Clue overload | Correction 2 |
| **P1** | D-10 untaught "noun" forward references | Correction 3 |
| **P1** | D-09 Predicate wording | Correction 4 |
| **P1** | D-07 / D-08 focus management | Correction 8 |
| **P1** | D-05 projector grammar-label size | Correction 9 |
| **P1** | **D-06 progress "done" pill contrast** | **not enumerated — see §17** |
| P2 | D-15 Complete Subject card wording | Correction 5 — **explicitly authorized by you** despite P2 |

Build number updated to **Build 1.1.1**.

**Not implemented, per instruction:** Practice, Break It Down, Test, Verb/Noun/Adjective lists, images, mascot, micro-celebrations, abstract-noun expansion, completion-panel redesign, topic-screen density, landscape badge, new terminology, adverbs, helping verbs, verb phrases, and every other P2/P3 item.

---

## 3. Files Changed

Verified by SHA-256 against the Build 1.1 baseline.

| File | Status | Change |
|---|---|---|
| `css/styles.css` | MODIFIED | Corrections 1, 6, 9 + D-06 |
| `index.html` | MODIFIED | Three attributes for Corrections 7 and 8 |
| `js/app.js` | MODIFIED | Build number, Correction 8A/8B |
| `js/data/learn-content.js` | MODIFIED | Corrections 2, 3, 4, 5 **+ 11 (final pass)** |
| `js/learn.js` | MODIFIED | Corrections 2, 7, 8C **+ 10 (final pass)** |
| `assets/images/logo.png` | unchanged | — |
| `assets/images/logo-512.png` | unchanged | — |
| `assets/images/favicon.png` | unchanged | — |

**Final completion pass changed only two files** — `js/learn.js` and `js/data/learn-content.js`. `css/styles.css`, `index.html` and `js/app.js` are byte-identical to the visually approved Build 1.1.1.

No files added or removed from the running application. The Build 1.1 audit report was replaced in the ZIP by this report; extracting the ZIP does not delete the older report from your repository.

---

## 4. Defect-by-Defect Correction Matrix

---

### Correction 1 — D-01 · Phone Try It horizontal overflow · **P0**

**Original defect.** At 320×568 the Complete Subject and Predicate Try It screens overflowed the page by 95 px; the question text and two answer buttons were cut off. Also 68 px at 375, 60 px at 390, 40 px at 430. 40 of 605 states affected.

**Root cause.** Two faults compounding:
1. `.tryit-choices.is-wide` declared `repeat(auto-fit, minmax(250px, 1fr))`. As a compound class selector it outranked the phone rule `.tryit-choices { grid-template-columns: minmax(0,1fr) }` — media queries add no specificity.
2. `.lesson-step` was a centred flex item in `.lesson-stage` with **no width constraint**, so it sized to its max-content. The 250 px minimum track pushed it to 510 px inside a 320 px viewport, and `auto-fit` then saw 510 px available and kept two columns — self-reinforcing.

**Correction.** Both faults fixed, so neither can recur alone:
- `.lesson-step { width:100%; min-width:0; max-width:100%; }` — the lesson column can no longer exceed the space it is given.
- `max-width:100%; min-width:0` added to `.lesson-content` and `.tryit`.
- Both grids changed to `minmax(min(150px,100%),1fr)` and `minmax(min(250px,100%),1fr)` — a minimum track can never exceed its container.

**Files changed.** `css/styles.css`.

**Regression risk.** Medium — `.lesson-step` affects all six topics at every width; the grid change affects Complete Subject and Predicate.

**Verification result: FIXED.**

| Width | Build 1.1 overflow | Build 1.1.1 overflow | Question fully visible | Choices | Choice width | Choice height |
|---|---|---|---|---|---|---|
| 320 | **95 px** | **0 px** | yes | 4 | 276 px each | 54 px |
| 375 | **68 px** | **0 px** | yes | 4 | 331 px each | 54 px |
| 390 | **60 px** | **0 px** | yes | 4 | 346 px each | 54 px |
| 430 | **40 px** | **0 px** | yes | 4 | 378 px each | 54 px |

`#lesson-step` now computes to 276 px at a 320 px viewport (was 510 px). All four buttons are within the viewport width, full container width, and 54 px tall — touch targets preserved. Instructional text was **not** reduced to achieve this.

Swept at 17 widths including intermediates (320, 360, 375, 390, 414, 430, 600, 768, 844, 1024, 1200, 1366, 1440, 1600, 1800, 1920, 2560), all six topics × four steps plus every Study Guide: **maximum horizontal overflow 0 px at every width.**

**Consequence disclosed.** These states are now taller because four phrase-length answers stack in one column instead of spilling sideways. 18 states that previously showed "Next" above the fold now require vertical scrolling — all of them Complete Subject or Predicate Try It states on phones. That is the intended trade: the build's requirement is zero horizontal overflow, and vertical scrolling is acceptable. The question and all four buttons remain fully readable. See §6 for the full arithmetic.

---

### Correction 2 — D-04 / D-19 · Verb Clue cognitive load and height · **P1**

**Original defect.** The Verb Clue step carried 112 words, 8 text blocks, 14 counted blocks and 2 sentence panels — roughly double every other step. "Next" fell below the fold on 9 of 11 tested viewports, including 1920×1080 (283 px of scrolling). The same-word comparison also placed a verb phrase (`are building`) on screen inside a verb lesson without the vocabulary to resolve it.

**Root cause.** Two teaching ideas in one step — the three ending clues *and* the same-word comparison, the latter rendered as a full sub-panel containing two complete sentence components.

**Correction.** The lowest-risk option named in the audit: the comparison moved **intact** out of the primary Verb Clue step and into the Verb Study Guide as its own section, "Why an ending is only a clue". Nothing was deleted. Both sentences, both labels, both captions and the closing line are preserved verbatim. The four-step model is untouched; **no fifth step was added**.

Engine change: the contrast renderer was extracted into one shared `renderContrast()` used by both the lesson-step renderer and the Study Guide renderer, so the comparison looks identical wherever it appears.

**Required Verb Clue content retained**, verified programmatically:
- "Ask yourself: What happened? Or: What is happening?" ✓
- "Some verbs end in -s: runs, plays, throws" ✓
- "Some verbs end in -ed: jumped, played, walked" ✓
- "Some verbs end in -ing: running, playing, walking" ✓
- **"These endings are clues. They are not rules. Read the sentence to make sure."** — byte-for-byte identical ✓

**Files changed.** `js/data/learn-content.js`, `js/learn.js`.

**Regression risk.** Low for the content move; low-medium for the shared renderer, which now serves two callers.

**Verification result: FIXED.**

Verb Clue step, measured at 390×844:

| Metric | Build 1.1 | Build 1.1.1 |
|---|---|---|
| Words | 112 | **54** |
| Text blocks | 8 | **5** |
| Counted blocks | 14 | **8** |
| Sentence panels | 2 | **0** |

"Next" reachable without scrolling:

| Device | B1.1 scroll needed | B1.1.1 scroll needed |
|---|---|---|
| 320×568 | 945 px | 314 px |
| 375×667 | 745 px | 166 px |
| 390×844 | 531 px | **0** |
| 430×932 | 447 px | **0** |
| 844×390 | 561 px | 169 px |
| 768×1024 | 7 px | **0** |
| 1024×768 | 245 px | **0** |
| 1366×768 | 279 px | **0** |
| 1440×900 | 147 px | **0** |
| **1920×1080** | **283 px** | **0** |
| 2560×1440 | 0 | **0** |

In view on 8 of 11 devices, up from 2 of 11. The projector case — a teacher scrolling mid-explanation — is resolved.

The comparison is confirmed present in the Verb Study Guide (now 9 sections, was 8) and confirmed absent from the Clue step. No helping-verb or verb-phrase terminology was introduced; a scope scan confirms neither term appears anywhere in the content.

---

### Correction 3 — D-10 · Untaught "noun" forward references · **P1**

**Original defect.** The word "noun" appeared 8 times in child-visible text in the Verb and Subject lessons (positions 1 and 2) although Noun is taught at position 5 — including a Subject Study Guide section headed "Noun or subject?" comparing against a category the child had not been given.

**Root cause.** Topic order follows the eight-step *analysis* strategy, which is not automatically the right order for introducing vocabulary. The content already solved the identical problem for "adjective" by describing function without the term; the pattern simply was not applied to "noun".

**Correction.** Topic order **unchanged**. All eight strings rewritten to describe function without the formal term. The WORD TYPE vs SENTENCE JOB distinction is preserved.

| # | Location | Build 1.1 | Build 1.1.1 |
|---|---|---|---|
| 1 | Verb Try It, `dog` | "dog names an animal, **so it is a noun.** Look again…" | "dog names the animal. It does not tell what happened. Look again…" |
| 2 | Verb Try It, `log` | "log names a thing, **so it is a noun.** Look again…" | "log names a thing. It does not tell what happened. Look again…" |
| 3 | Subject Definition note | "A word can be a **noun** and be the subject at the same time. **Noun** tells what kind of word it is. Subject tells the job it does in the sentence." | "Every word has a type, and it also has a job in the sentence. Subject is a job. Here, player names a person, and its job in this sentence is the subject." |
| 4 | Subject Example point | "player is a **noun**, and here it is also doing the job of the subject." | "player names a person, and here its job in the sentence is the subject." |
| 5 | Subject Try It, `board` | "board names a thing, **so it is a noun** — but it is not who did the writing." | "board names a thing, but it is not who did the writing. Ask: who wrote?" |
| 6 | Subject Guide heading | "**Noun** or subject?" | "Word type or sentence job?" |
| 7 | Subject Guide line | "**Noun** tells what kind of word it is." | "A word type tells what kind of word it is." |
| 8 | Subject Guide line | "player is a **noun**. In this sentence it is also the subject." | "player names a person. In this sentence its job is the subject." |

**Files changed.** `js/data/learn-content.js`.

**Regression risk.** Low — content strings only. The engine reads them opaquely.

**Verification result: FIXED.**

Programmatic scan of every child-visible string in Verb, Subject, Complete Subject and Predicate: **0 occurrences of "noun" or "nouns"** (was 8). The `kind: "noun"` data field is excluded from the scan because it is never rendered as text.

Preserved: word-type-vs-sentence-job distinction confirmed present in Subject (both "type" and "job" language). No new terminology introduced — the scope scan in §5 confirms zero forbidden terms.

---

### Correction 4 — D-09 · Predicate wording · **P1**

**Original defect.** The Predicate topic card said "Find what the subject does." and the completion recap repeated the narrowing, while the lesson definition correctly said "does, **or what is being said about** the subject." The narrow wording is inaccurate for being sentences such as "The dog is small.", which the Verb lesson explicitly teaches.

**Root cause.** Card text written for brevity on a small tile; the recap inherited the omission.

**Correction.** Card and recap now say "does or is". The definition and Study Guide already carried both halves and were not changed.

| Surface | Build 1.1.1 |
|---|---|
| Topic card | "Find what the subject does **or is**." |
| Definition | "The predicate is the part of the sentence that has the verb. It tells what the subject does, or what is being said about the subject." *(unchanged)* |
| Study Guide | "…It tells what the subject does, or what is being said about the subject." *(unchanged)* |
| Completion recap | "The predicate is the part with the verb. It tells what the subject does **or is**." |

**Files changed.** `js/data/learn-content.js`.

**Regression risk.** Very low. Card length affects topic-card height at 320 px — re-checked, cards remain 82 px minimum.

**Verification result: FIXED.** All four surfaces verified instructionally consistent, and the definition was not overcomplicated.

---

### Correction 5 — D-15 · Complete Subject card wording · **P2, explicitly authorized**

**Original defect.** "See the whole subject part." — "part" unexplained, awkward for third grade.

**Correction.** → **"See all the words in the subject."**

**Files changed.** `js/data/learn-content.js`.

**Regression risk.** Very low. Lesson sequence and teaching method untouched.

**Verification result: FIXED.** Card text verified; Complete Subject still teaches simple subject vs all the words in the subject.

---

### Correction 6 — D-02 · Wrong-answer feedback contrast · **P0**

**Original defect.** Wrong-answer feedback text measured 2.98:1 and the wrong choice label 2.82:1 — both fail WCAG AA (4.5:1 for text below 18.66 px bold). This is the text that does the teaching when a child is wrong.

**Root cause.** `--orange-dark: #E06D1F` on `--soft-orange: #FFF1E6`.

**Correction.** A **dedicated token** was introduced rather than changing `--orange-dark`, because that variable also paints the **Break It Down placeholder header**, which is out of scope and must not change.

```
--c-wrong-text:#A34A0B;   /* Try It wrong feedback + wrong choice label */
--c-right-text:#197144;   /* Try It correct feedback + right choice label + done pill */
```

Correct/incorrect differentiation is retained and remains independent of colour: correct shows a ✓ mark, the word "Correct!", and a **solid** border; incorrect shows a ✕ mark, the words "Try again.", and a **dashed** border. All instructional feedback text is unchanged.

**Files changed.** `css/styles.css`.

**Regression risk.** Low, and deliberately contained — verified that `--orange-dark` and `--green-dark` still paint the Break It Down and Learn placeholder headers unchanged.

**Verification result: FIXED.** Measured by **pixel sampling of rendered screenshots**, not by eye and not by computed style alone:

| Element | Build 1.1 | Build 1.1.1 | Threshold |
|---|---|---|---|
| Wrong feedback text | **2.98:1** | **5.36:1** PASS | 4.5:1 |
| Wrong choice label | **2.82:1** | **4.88:1** PASS | 4.5:1 |
| Correct feedback text | 2.96:1 | **5.57:1** PASS | 4.5:1 |
| Correct choice label | 2.96:1 | **5.57:1** PASS | 4.5:1 |

The correct-answer rows are the finding described in §17.

---

### Correction 7 — D-03 · Study Guide modal focus trap · **P1**

**Original defect.** The panel declared `aria-modal="true"` but had no focus trap. Ten Tab presses reached five controls behind the overlay: `skip-link`, `lesson-guide`, `lesson-home`, `lesson-next`, `lesson-topics`.

**Root cause.** `openGuide()` set initial focus but installed no Tab handler, and the background was never made inert.

**Correction.** A capturing `keydown` handler is installed on open and removed on close. Tab and Shift+Tab cycle within `.guide-panel`; if focus is ever outside the panel while it is open, the next Tab returns it. The panel received `id="guide-panel"` so the trap can address it, and the scrollable `#guide-body` received `tabindex="0"` so it joins the cycle — a keyboard user can still focus and scroll the guide body while trapped. Touch scrolling is unaffected.

**Files changed.** `js/learn.js`, `index.html`.

**Regression risk.** Low-medium — must not break Escape, the Close button, the backdrop click, or focus return.

**Verification result: FIXED.** Ten consecutive Tab presses with the guide open:

```
Tab 1: guide-close   inPanel=true      Tab 6:  guide-body    inPanel=true
Tab 2: guide-body    inPanel=true      Tab 7:  guide-close   inPanel=true
Tab 3: guide-close   inPanel=true      Tab 8:  guide-body    inPanel=true
Tab 4: guide-body    inPanel=true      Tab 9:  guide-close   inPanel=true
Tab 5: guide-close   inPanel=true      Tab 10: guide-body    inPanel=true
```

**Controls reachable behind the modal: NONE** (was 5).

Regression-tested on **all six** Study Guides: each opens with focus on its title, closes by Escape, by the Close button and by backdrop click, and returns focus to the `lesson-guide` button that opened it. Body scroll remains locked behind the panel; the panel fits the viewport and the Close button stays in view at all 11 tested sizes.

---

### Correction 8 — D-07 / D-08 · Keyboard focus management · **P1**

**Original defect.**
- **A/B:** after Home from a lesson, focus stayed on the now-hidden Home button; after Escape from the topic screen, focus stayed on the hidden topics heading.
- **C:** after a wrong Try It answer the chosen button is disabled, dropping focus to `<body>`; a keyboard user had to Tab from the top of the document to try again.

**Root cause.** `goHome()` toggled screens but never managed focus, unlike the three Learn entry points. `answerTryIt()` reassigned focus on the correct branch only.

**Correction.**
- `goHome(moveFocus)` now moves focus to `#home-heading` (given `tabindex="-1"`). The parameter is `false` only for the initial call from `init()`, so nothing steals focus on page load. The two shell listeners were wrapped in arrow functions so a click Event is never passed as the argument.
- After a wrong answer, focus moves to **the first remaining enabled choice**. The feedback keeps its own `role="status" aria-live="polite"` region, and focus is moved to a button rather than into the live region, so no second announcement is created.

**Files changed.** `js/app.js`, `js/learn.js`, `index.html`.

**Regression risk.** Low — `goHome()` is shared with the three placeholder modes; those were regression-tested.

**Verification result: FIXED.**

| Path | Build 1.1 | Build 1.1.1 |
|---|---|---|
| Lesson → Home | `lesson-home`, **inside hidden screen** | `home-heading`, visible |
| Topics → Back | `<body>` | `home-heading`, visible |
| Topics → Escape | `topics-heading`, **inside hidden screen** | `home-heading`, visible |
| Lesson → All Topics | `topics-heading`, visible | `topics-heading`, visible |
| Try It wrong answer | **`<body>`** | first remaining enabled choice ("dog") |
| Try It correct answer | `lesson-next` | `lesson-next` |

**Focus on a hidden element: 0 of 605 states.** Keyboard-only completion of a full lesson still succeeds end to end.

---

### Correction 9 — D-05 · Projector grammar-label readability · **P1**

**Original defect.** At 1920×1080 the grammatical labels (VERB, SIMPLE SUBJECT, COMPLETE SUBJECT, PREDICATE, NOUN, ADJECTIVE) rendered at **16.8 px** — smaller than the 17 px body text and the smallest essential instructional text on a projected step, while everything around them scaled up 1.4×–2.7×.

**Root cause.** `--sentence-label` rose to only 1.05 rem at ≥1800 px while the surrounding text rose faster, inverting the hierarchy.

**Correction.** `--sentence-label` at ≥1800 px raised **1.05 rem → 1.6 rem (25.6 px)**, inside the requested 24–28 px band. **Ordered as instructed:** D-01 was corrected and verified first, then labels were enlarged, then wrapping was re-verified at every width.

**Files changed.** `css/styles.css`.

**Regression risk.** Medium — wider labels widen word chips and can change sentence wrapping at every width, including the phone widths implicated in D-01.

**Verification result: FIXED.**

Label size by width (unchanged below the projector breakpoint, so phone layouts cannot be affected):

| Width | 320–600 | 768–1024 | 1200–1440 | 1600 | **1800–2560** |
|---|---|---|---|---|---|
| Label | 11.52 px | 11.84 px | 12.8 px | 14.4 px | **25.6 px** |

Projector hierarchy at 1920×1080, now correctly ordered:

| Element | Build 1.1 | Build 1.1.1 |
|---|---|---|
| Lesson title | 46.4 px | 46.4 px |
| Teaching sentence | 41.6 px | 41.6 px |
| Try It question | 27.2 px | 27.2 px |
| **Grammar label** | **16.8 px** | **25.6 px** |
| Try It choice | 25.6 px | 25.6 px |
| Definition / clue text | 24 px | 24 px |
| Body text | 17 px | 17 px |

The label is no longer the smallest essential text; it now sits above both the body text and the lesson prose.

**Wrapping regression:** all six topics × four steps + every Study Guide re-swept at **17 widths**. Maximum horizontal overflow **0 px at every width**, and **0 marked word chips wider than their sentence row** at every width. A side benefit observed at 1920: the Predicate example sentence now fits on one line inside its box instead of wrapping.

**Not claimed:** real classroom acceptance. This is simulated projector layout testing only — see §19.

---

## 4A. Final Completion Pass

Two items, added after the visual approval of Build 1.1.1. Build number remains **Build 1.1.1**.

---

### Correction 10 — Study Guide focus-trap edge case (independent review finding)

**Original defect.** Independent review identified that the trap protected forward Tab but not the exact state *open guide → focus on title → Shift+Tab*. **Reproduced before fixing**, on the shipped Build 1.1.1 code:

```
on open            : { id: "guide-title",   inPanel: true  }
TITLE -> SHIFT+TAB : { id: "lesson-topics", inPanel: false }   <-- ESCAPED THE MODAL
```

Focus landed on the **All Topics** navigation button behind the overlay. The review's diagnosis was exactly right, and so was the warning not to declare it fixed on forward-Tab evidence alone: forward Tab from the title happened to work only because `#guide-close` is the next node in DOM order.

**Root cause.** `#guide-title` carries `tabindex="-1"` so it can receive focus when the dialog opens, but it is therefore excluded from the focusable list the trap builds. The old guard only wrapped when the active element *was* the first or last cycle member. The title is neither, so no branch fired and the browser's default Shift+Tab applied — and because the title is the **first node inside the panel**, backwards default focus movement left the dialog entirely.

**Correction.** The trap no longer asks "is focus inside the panel"; it asks "is focus on a member of the tab cycle". Any focus that is not a cycle member is re-anchored explicitly — Tab to the first focusable, Shift+Tab to the last. This covers the title, any future `tabindex="-1"` element inside the dialog, and focus having drifted outside the panel altogether.

```js
const idx = items.indexOf(active);
if (idx === -1) {
  e.preventDefault();
  (e.shiftKey ? last : first).focus();
  return;
}
if (e.shiftKey && active === first) { e.preventDefault(); last.focus(); }
else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
```

**Files changed.** `js/learn.js` only. No CSS, no HTML, no dimension change.

**Regression risk.** Low — one branch added ahead of two unchanged branches. Escape, Close, backdrop and focus-return paths were re-tested on all six guides.

**Verification result: FIXED.** Every required test run on **all six Study Guides**. `guide-close` and `guide-body` are the two cycle members; `guide-title` receives initial focus.

| Topic | TITLE → TAB | TITLE → SHIFT+TAB | FIRST → SHIFT+TAB | LAST → TAB | 10× Tab | 10× Shift+Tab | Mixed |
|---|---|---|---|---|---|---|---|
| Verb | guide-close | **guide-body** | guide-body | guide-close | all inside | all inside | all inside |
| Subject | guide-close | **guide-body** | guide-body | guide-close | all inside | all inside | all inside |
| Complete Subject | guide-close | **guide-body** | guide-body | guide-close | all inside | all inside | all inside |
| Predicate | guide-close | **guide-body** | guide-body | guide-close | all inside | all inside | all inside |
| Noun | guide-close | **guide-body** | guide-body | guide-close | all inside | all inside | all inside |
| Adjective | guide-close | **guide-body** | guide-body | guide-close | all inside | all inside | all inside |

**Every `activeElement` in every test remained inside `#guide-panel`.** The reported escape to `lesson-topics` no longer occurs.

Exact sequences captured (Verb guide, identical shape on the other five):

```
10 consecutive Tab       : guide-close, guide-body, guide-close, guide-body, guide-close,
                           guide-body, guide-close, guide-body, guide-close, guide-body
10 consecutive Shift+Tab : guide-body, guide-close, guide-body, guide-close, guide-body,
                           guide-close, guide-body, guide-close, guide-body, guide-close
Mixed direction          : guide-close, guide-body, guide-close, guide-body,
                           guide-close, guide-body, guide-close, guide-body
```

Close paths and focus return, all six guides:

| Topic | Escape closes | Close button closes | Backdrop closes | Focus returns to |
|---|---|---|---|---|
| Verb | yes | yes | yes | `lesson-guide` |
| Subject | yes | yes | yes | `lesson-guide` |
| Complete Subject | yes | yes | yes | `lesson-guide` |
| Predicate | yes | yes | yes | `lesson-guide` |
| Noun | yes | yes | yes | `lesson-guide` |
| Adjective | yes | yes | yes | `lesson-guide` |

**No duplicate keydown handlers.** After **10 consecutive open/close cycles**: 1 overlay, 1 panel, Tab sequence still `guide-close → guide-body → guide-close …` with every element inside the panel, and Escape still closes. A single handler reference is added on open and removed on close.

**No lesson, home or navigation control behind the modal can receive focus** in any direction, at any point in any of the tests above.

---

### Correction 11 — Verb Study Guide memorization expansion (approved)

**Purpose.** Make the Verb Study Guide a usable reference and memorization aid without turning it into a word list. Concise and grouped, per instruction.

**Changes.** Sections 8 → 10; chips 13 → 35.

| Section | Build 1.1.1 (approved) | Final pass |
|---|---|---|
| Verbs that show action | run, jump, play, throw, catch, read, climb *(7)* | run, jump, play, throw, catch, read, climb, **walk, write, talk, help, carry** *(12)* |
| Verbs that tell what something is | is, are *(2)* | **am,** is, are, **was, were, be, been, being** *(8)* |
| **Common verbs to remember** | — | **have, has, had, do, does, did** *(6, new section)* |
| Clue: verbs ending in -s | runs, plays, throws | **runs, plays, throws — unchanged** |
| Clue: verbs ending in -ed | jumped, played, walked | **jumped, played, walked — unchanged** |
| Clue: verbs ending in -ing | running, playing, walking | **running, playing, walking — unchanged** |

Full section order after the change:

1. What it is
2. How to find it
3. Verbs that show action *(12)*
4. Verbs that tell what something is *(8)*
5. **Common verbs to remember** *(6)*
6. Clue: verbs ending in -s *(3)*
7. Clue: verbs ending in -ed *(3)*
8. Clue: verbs ending in -ing *(3)*
9. See it in a sentence
10. Why an ending is only a clue

**Instructional rule honoured — verified programmatically:**

| Rule | Result |
|---|---|
| "was" is **not** categorized as a verb ending in -s | PASS — it appears only in "Verbs that tell what something is" |
| "has" is **not** categorized as a verb ending in -s | PASS — it appears only in "Common verbs to remember" |
| Suffix clue sections kept separate and unchanged | PASS — all three still hold exactly their original three examples |
| Memorization groups kept separate from suffix clue groups | PASS — sections 3–5 vs sections 6–8 |
| Exact wording preserved: *"These endings are clues. They are not rules. Read the sentence to make sure."* | PASS — byte-identical in the Verb Clue step |
| **No formal helping-verb terminology introduced** | **PASS** — "helping verb", "verb phrase", "auxiliary" and "linking verb" appear **nowhere** in the content file |
| No adverbs added | PASS — "adverb" appears nowhere |
| Not a giant word list | 35 chips across 5 grouped sections; the larger list remains deferred to Practice → Verb → Verb List |

**Files changed.** `js/data/learn-content.js` only.

**Layout impact — no horizontal overflow, no unusable scrolling:**

| Device | Overflow | Panel fits viewport | Close always in view | Guide body |
|---|---|---|---|---|
| phone 320×568 | **0 px** | yes | yes | scrolls internally |
| phone 390×844 | **0 px** | yes | yes | scrolls internally |
| tablet 768×1024 | **0 px** | yes | yes | scrolls internally |
| laptop 1366×768 | **0 px** | yes | yes | scrolls internally |
| desktop 1920×1080 | **0 px** | yes | yes | scrolls internally |

Verified across all 11 viewports: the guide panel fits the viewport everywhere and the Close button is always in view. Internal scrolling of the guide body is the intended behaviour for a reference list and was already present before the expansion.

---

### Confirmation: no sizing or layout change in this pass

Byte-compared against the visually approved Build 1.1.1:

| File | Result |
|---|---|
| `css/styles.css` | **IDENTICAL** — no desktop text, projector typography, card, lesson-stage, sentence or Study Guide dimension change |
| `index.html` | **IDENTICAL** |
| `js/app.js` | **IDENTICAL** |
| `js/learn.js` | changed — focus trap only |
| `js/data/learn-content.js` | changed — Verb Study Guide content only |

The focus-trap correction required no style change, so none was made.

---

### One observation for your review — not changed

The Verb **Study Guide** reminder reads *"These endings are clues. Read the sentence to make sure."* while the Verb **Clue step** carries the fuller *"These endings are clues. **They are not rules.** Read the sentence to make sure."* Both are pre-existing approved wording and the instruction was to preserve, not to alter, so I left the guide reminder untouched. If you want the two to match exactly, say so and it is a one-string change.

Related, also unchanged: section 4 is headed "Verbs that tell what something is" and now contains the past forms *was* and *were*. Strictly the heading is present-tense while two of its members are past. "Verbs that tell what something is or was" would be marginally more accurate. Flagged rather than changed, because you specified the grouping.

---

## 5. Instructional Integrity Audit

Verified programmatically against the corrected content file.

| Topic | Requirement | Result |
|---|---|---|
| **Verb** | "What happened?" / "What is happening?" | PASS |
| | -s clue with runs, plays, throws | PASS |
| | -ed clue with jumped, played, walked | PASS |
| | -ing clue with running, playing, walking | PASS |
| | "These endings are clues. They are not rules. Read the sentence to make sure." | PASS — byte-identical |
| | Action verbs represented | PASS |
| | "is" / "are" verbs represented | PASS |
| | Same-word comparison preserved (relocated, not deleted) | PASS |
| | Comparison removed from the Clue step | PASS |
| | *Final pass:* action verbs expanded to 12 | PASS |
| | *Final pass:* "tell what something is" expanded to am, is, are, was, were, be, been, being | PASS |
| | *Final pass:* new "Common verbs to remember" — have, has, had, do, does, did | PASS |
| | *Final pass:* "was" / "has" never categorized as -s verbs | PASS |
| | *Final pass:* three suffix clue sections unchanged and separate | PASS |
| **Subject** | Find the verb → ask who or what → find the subject | PASS |
| | Word type vs sentence job preserved | PASS |
| | No "noun" before Noun is taught | PASS — 0 occurrences |
| **Complete Subject** | Simple subject taught | PASS |
| | All the words in the subject | PASS |
| | Simple vs complete contrast retained | PASS |
| **Predicate** | Contains the verb | PASS |
| | Tells what the subject does **or is** — card, definition, guide, recap | PASS on all four |
| **Noun** | Person / Place / Thing / Idea | PASS on all four |
| **Adjective** | Describes a noun | PASS |
| | What kind? / Which one? / How many? | PASS on all three |

**Structure preserved.** Topic order is `["verb","subject","complete-subject","predicate","noun","adjective"]` — unchanged. All six topics still carry exactly `definition`, `clue`, `example`, `tryIt` — the four-step model, no fifth step.

**Scope guard — forbidden terminology scanned across all content:** adverb, pronoun, preposition, conjunction, direct object, compound subject, compound predicate, clause, helping verb, verb phrase — **all absent**.

**Try It integrity.** All six items re-exercised choice by choice: each has **exactly one** correct answer; every wrong choice keeps "Finish" disabled; the correct choice enables it. All 18 incorrect responses still explain the chosen word's real job. No educational content was weakened while simplifying the UI.

---

## 6. 605-State Regression Results

The same sweep as the forensic audit: 55 Learn states × 11 viewports.

Re-run in full after the final completion pass:

```
TOTAL STATE OBSERVATIONS : 605
HORIZONTAL OVERFLOW      : 0 of 605          <-- mandatory gate MET
Focus on hidden element  : 0 of 605
Console / page errors    : none
```

The expanded Verb Study Guide did not introduce overflow at any viewport.

Mandatory gate checklist:

| Gate item | Result |
|---|---|
| **Horizontal overflow** | **0 of 605** |
| Wrong-topic Study Guides | 0 — all six verified correct in sequence |
| Stale Try It answer states on revisit | 0 — selections, disabled states and feedback all clear |
| Duplicate event listeners | 0 — one click = one step, still true after six re-entries |
| Incorrect progress states | 0 — one `aria-current` mid-lesson; all four marked done at completion |
| Console errors | 0 |
| Failed local asset requests | 0 |
| Hidden-screen focus after navigation | 0 |
| Study Guide focus trap works | Yes — 0 controls reachable behind the modal |
| Try It incorrect-answer keyboard retry works | Yes — focus lands on the next enabled choice |
| All six topics complete successfully | Yes |
| Practice placeholder unchanged | Yes — heading, tag and text identical |
| Break It Down placeholder unchanged | Yes |
| Test placeholder unchanged | Yes |

**Disclosed side effect, with arithmetic.** States where "Next" sits below the fold moved from 140 to **152**. That is not a new defect and the change is fully accounted for:

- **−6:** the Verb Clue fix brought "Next" into view at 390, 430, 1024×768, 1366, 1440 and 1920.
- **+18:** Complete Subject and Predicate Try It states on phones are now *taller*, because four phrase-length answers stack in one full-width column instead of overflowing sideways. Every one of the 18 is one of those states.

140 − 6 + 18 = 152. The 18 states trade an unusable horizontal overflow for ordinary vertical scrolling, which is what Correction 1 required. The question and all four buttons remain fully readable at every phone width.

---

## 7. Device Matrix

All eleven viewports, measured on the Predicate lesson (split sentence + marked verb) and its Try It.

| Device (simulated) | Overflow | Body | Sentence | Label | Title | Lesson text | Choice text | Guide fits |
|---|---|---|---|---|---|---|---|---|
| phone 320×568 | **0** | 16 px | 17.9 px | 11.5 px | 22.4 px | 16 px | 16.8 px | yes |
| phone 375×667 | **0** | 16 px | 17.9 px | 11.5 px | 22.4 px | 16 px | 16.8 px | yes |
| phone 390×844 | **0** | 16 px | 17.9 px | 11.5 px | 22.4 px | 16 px | 16.8 px | yes |
| phone 430×932 | **0** | 16 px | 17.9 px | 11.5 px | 22.4 px | 16 px | 16.8 px | yes |
| phone landscape 844×390 | **0** | 17 px | 20 px | 11.8 px | 28.7 px | 17 px | 16.8 px | yes |
| tablet 768×1024 | **0** | 17 px | 20 px | 11.8 px | 26.1 px | 17 px | 16.8 px | yes |
| tablet 1024×768 | **0** | 17 px | 20 px | 11.8 px | 32 px | 17 px | 16.8 px | yes |
| laptop 1366×768 | **0** | 17 px | 24.8 px | 12.8 px | 32 px | 17.9 px | 16.8 px | yes |
| laptop 1440×900 | **0** | 17 px | 24.8 px | 12.8 px | 32 px | 17.9 px | 16.8 px | yes |
| desktop 1920×1080 | **0** | 17 px | 41.6 px | **25.6 px** | 46.4 px | 24 px | 25.6 px | yes |
| wide 2560×1440 | **0** | 17 px | 41.6 px | **25.6 px** | 46.4 px | 24 px | 25.6 px | yes |

---

## 8. Phone Results

*Simulated viewports, not physical phones.*

| Check | 320×568 | 375×667 | 390×844 | 430×932 |
|---|---|---|---|---|
| Horizontal overflow, all 55 states | **0 px** | **0 px** | **0 px** | **0 px** |
| Complete Subject / Predicate Try It overflow | **0** (was 95) | **0** (was 68) | **0** (was 60) | **0** (was 40) |
| Try It question fully readable | yes | yes | yes | yes |
| All four answer buttons within viewport | yes | yes | yes | yes |
| Answer button height | 54 px | 54 px | 54 px | 54 px |
| Topic card height (min) | 82 px | 82 px | 82 px | 82 px |
| Nav button height | 44 px | 44 px | 44 px | 44 px |
| Body text | 16 px | 16 px | 16 px | 16 px |
| Teaching sentence | 17.9 px | 17.9 px | 17.9 px | 17.9 px |
| Study Guide fits viewport, Close in view | yes | yes | yes | yes |
| Verb Clue scroll to reach Next | 314 px (was 945) | 166 px (was 745) | **0** (was 531) | **0** (was 447) |

Phone landscape 844×390: 0 px overflow across all states; Verb Clue scroll 169 px (was 561).

**Phone verdict: PASS.** The P0 defect is eliminated at every phone width with no reduction in instructional text size and no loss of touch-target size.

---

## 9. Tablet Results

| Check | 768×1024 portrait | 1024×768 landscape |
|---|---|---|
| Horizontal overflow, all states | **0 px** | **0 px** |
| Topic grid | 2 columns, 6/6 above fold | 2 columns, 6/6 above fold |
| Verb Clue reaches Next without scrolling | yes (was 7 px short) | **yes** (was 245 px) |
| Teaching sentence | 20 px | 20 px |
| Answer button height | 52 px | 52 px |
| Study Guide panel | 736 px, fits | 760 px, fits |

**Tablet verdict: PASS.**

---

## 10. Laptop Results

| Check | 1366×768 | 1440×900 |
|---|---|---|
| Horizontal overflow | **0 px** | **0 px** |
| Verb Clue reaches Next without scrolling | **yes** (was 279 px) | **yes** (was 147 px) |
| Teaching sentence | 24.8 px | 24.8 px |
| Lesson title | 32 px | 32 px |
| Lesson body | 17.9 px | 17.9 px |
| Content width | 872 px capped | 872 px capped |
| States still below fold | 1 (Adjective Clue, 101 px) | 0 |

**Laptop verdict: PASS.** The one remaining below-fold state at 1366×768 is the Adjective Clue step, a dense but single-idea step; it was below the fold in Build 1.1 as well and is not an authorized defect.

---

## 11. Desktop Results

| Check | 1920×1080 | 2560×1440 |
|---|---|---|
| Horizontal overflow | **0 px** | **0 px** |
| Content width | 1173 px capped | 1173 px capped |
| Shell width | 1720 px capped | 1720 px capped |
| Verb Clue reaches Next | **yes** (was 283 px scroll) | yes |
| Visual hierarchy matches smaller screens | yes | yes |

**Desktop verdict: PASS.** Text remains capped; a 2560 px monitor shows the same reading column as 1920.

---

## 12. Simulated Projector Results

*Simulated 1920×1080 16:9 viewport. **No physical projector was used.***

| Element | Build 1.1 | Build 1.1.1 | Ratio to 17 px body |
|---|---|---|---|
| Lesson title | 46.4 px | 46.4 px | 2.73× |
| Teaching sentence | 41.6 px | 41.6 px | 2.45× |
| Try It question | 27.2 px | 27.2 px | 1.60× |
| **Grammar label** | **16.8 px (0.99×)** | **25.6 px** | **1.51×** |
| Try It choice | 25.6 px | 25.6 px | 1.51× |
| Definition / clue text | 24 px | 24 px | 1.41× |

The hierarchy inversion is corrected: the grammar label was previously the smallest essential text on a projected step and is now larger than both the body text and the lesson prose. On a 2.4 m-wide projection, 25.6 px is roughly 32 mm of glyph height, against roughly 21 mm before.

Also verified at this size: no hover dependence anywhere; marked words still carry a written label, a thick underline and a border, so nothing depends on hue; line length capped at 1400 px; 0 px horizontal overflow; Try It choices 98 px tall.

**SIMULATED PROJECTOR LAYOUT: PASS. ACTUAL CLASSROOM ACCEPTANCE: NOT CLAIMED** — see §19.

---

## 13. Accessibility Results

| Check | Result |
|---|---|
| Semantic controls | PASS — all interactive elements are real `<button>`; 0 inline handlers |
| Keyboard-only lesson completion | **PASS** — Learn card → topic → 3 step advances → correct answer → Finish, reaching the completion panel with focus on its title |
| Focus order | PASS — matches visual order |
| Focus visibility | PASS — two-ring indicator on all controls |
| **Modal focus trap — forward** | **PASS — 0 controls reachable behind the overlay** (was 5) |
| **Modal focus trap — reverse (Shift+Tab)** | **PASS** — including the title → Shift+Tab edge case that escaped to `lesson-topics` before the final pass. 10× Tab, 10× Shift+Tab and mixed-direction runs on all six guides kept every `activeElement` inside `#guide-panel`. See §4A |
| Focus trap after 10 open/close cycles | PASS — 1 overlay, 1 panel, no duplicate handlers, Escape still closes |
| Escape behaviour | PASS — closes the guide, then leaves a lesson, then returns Home; focus ends on `home-heading` |
| Close button / backdrop click | PASS — both close and return focus to the opener |
| aria-live feedback | PASS — `role="status" aria-live="polite"`; exactly 1 live region; focus moves to a button rather than into the live region, so no duplicate announcement |
| **Hidden-screen focus** | **PASS — 0 of 605 states** |
| Colour-independent feedback | PASS — ✓/✕ marks, "Correct!"/"Try again." wording, solid vs dashed borders |
| Contrast | PASS — see §14 |
| Touch target sizes | PASS — topic cards ≥82 px, Try It choices 52–98 px, nav buttons 44–63 px |
| Reduced motion | PASS — animation and transition durations collapse to 1e-05s |
| `aria-current` on progress | PASS — exactly one mid-lesson, cleared at completion |
| Dialog semantics | PASS — `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, now matched by real trapping behaviour |

**Automated / simulated only.** No screen reader (VoiceOver, NVDA, JAWS, TalkBack) was run — see §19.

---

## 14. Contrast Measurements

Measured by **pixel sampling of rendered screenshots**, cross-checked against computed styles. Threshold 4.5:1 for text below 18.66 px bold.

| Element | Build 1.1 | Build 1.1.1 | Result |
|---|---|---|---|
| Try It wrong feedback text | 2.98:1 | **5.36:1** | PASS |
| Try It wrong choice label | 2.82:1 | **4.88:1** | PASS |
| Try It correct feedback text | 2.96:1 | **5.57:1** | PASS |
| Try It correct choice label | 2.96:1 | **5.57:1** | PASS |
| Progress pill — done | 2.96:1 | **5.57:1** | PASS |
| Progress pill — current | 11.97:1 | 11.97:1 | PASS |
| Progress pill — default | 5.76:1 | 5.76:1 | PASS |
| Sentence label — VERB | 4.68:1 | 4.68:1 | PASS |
| Sentence label — SIMPLE SUBJECT | 5.34:1 | 5.34:1 | PASS |
| Sentence label — COMPLETE SUBJECT | 8.02:1 | 8.02:1 | PASS |
| Sentence label — PREDICATE | 5.98:1 | 5.98:1 | PASS |
| Sentence label — NOUN | 5.90:1 | 5.90:1 | PASS |
| Sentence label — ADJECTIVE | 5.02:1 | 5.02:1 | PASS |
| Topic cards (all six, pixel-sampled) | 5.78–7.53:1 | unchanged | PASS |

**No measured Learn Mode text now fails WCAG AA.**

Shared tokens deliberately **not** changed, and verified unchanged: `--orange-dark` (Break It Down placeholder header) and `--green-dark` (Learn placeholder header).

---

## 15. Transition / State-Leakage Results

| Test | Result |
|---|---|
| Full specified sequence (Learn → Verb → Clue → Guide → Close → Example → Try It → wrong → correct → Back) | Clean |
| Back from Try It | Returns to Example; Try It hidden and its host emptied |
| Return to Try It | Clean reset — no marked buttons, no feedback, Finish re-disabled |
| Subject → Guide → Home → Learn → Subject again | Clean — Definition step, no done markers, no stale selections |
| Study Guide content per topic | All six correct in sequence |
| Five consecutive guide open/close cycles | 1 overlay, 1 panel, correct section count, body class cleared |
| Duplicate event listeners | None — one click = one step, after six re-entries too |
| Scroll position leakage | None — resets on step and screen change |
| Re-entry after a wrong answer | Clean reset |
| Completion panel | All four steps marked done, focus on title |
| "Next topic" chaining | Correct — lands on the next topic at Definition |
| Escape ladder | guide → lesson → topics → home, focus ends on `home-heading` |
| Placeholder modes after heavy Learn use | Practice, Break It Down and Test all unchanged |
| Console errors during the suite | None |

`lesson.topicKey` is still retained after Home (audit defect **D-14**). That is a **P2** item, explicitly out of scope for this build, and has no observable effect because every entry point re-initialises.

---

## 16. Console / Asset Results

| Check | Result |
|---|---|
| Console errors — 605-state sweep | **0** |
| Console errors — full six-topic walkthrough | **0** |
| Console errors — transition suite | **0** |
| Console errors — 9-viewport shell regression | **0** |
| Console errors — final-pass focus-trap suite (6 guides × 9 tests) | **0** |
| Console errors — final-pass 605-state re-run | **0** |
| Uncaught exceptions | **0** |
| Failed local asset requests (4xx/5xx) | **0** |
| Logo loads (`naturalWidth` > 0) | Yes at all viewports |
| Build badge | "Sentence Sense — Build 1.1.1" at all 9 shell viewports and all 11 Learn viewports |

The only non-application network entry remains the Google Fonts stylesheet, blocked by this sandbox's outbound proxy; all measurements were therefore taken with the system-font fallback. Unchanged since Build 1.0 and not an authorized defect.

---

## 17. Scope Compliance

**No unauthorized feature was implemented.** Not built: Practice, Break It Down, Test, Verb/Noun/Adjective lists, memorization lists, images, mascot, micro-celebrations, illustrations, abstract-noun expansion, completion-panel redesign, topic-screen density, landscape badge refinement, new terminology, adverbs, helping verbs, verb phrases.

**Not reordered, not restructured:** topic order and the four-step model are byte-verified unchanged. No fifth step.

Three things require your explicit review:

**1. D-06 was fixed although the nine corrections did not list it.** The progress "done" pill failed AA at 2.96:1. It is a **P1 defect in the forensic audit**, and the governing instruction is "correct only the P0/P1 defects identified by the forensic audit." I treated the nine corrections as an elaboration of that rule rather than a replacement for it. The fix is one token reference in one CSS rule. **If you intended the nine corrections to be exhaustive, this is the one item to revert.**

**2. The correct-answer feedback contrast was also fixed — and the forensic audit missed it.** Correction 6 named only the wrong-answer state at 2.98:1. While implementing it I measured the **correct-answer** feedback and choice label at **2.96:1** — the same failure in the same component, from the `--green-dark` token. My forensic audit measured the wrong-answer state and the progress pill but never the correct-answer state, then reported "all pass AA." That was wrong. Fixing one half and leaving the other at 2.96:1 would have been indefensible, and Correction 6 requires retaining "correct/incorrect visual differentiation" — which means both states must be legible. Flagged here rather than buried.

**3. Correction 5 (Complete Subject card) is a P2 item.** The audit classed D-15 as P2; you authorized it explicitly as Correction 5. Implemented as instructed.

**Small related adjustments made in service of authorized corrections**, documented as required:
- `index.html` gained three attributes: `id="guide-panel"` (the trap must address the panel), `tabindex="0"` on `#guide-body` (so the scrollable region stays keyboard-reachable inside the trap), and `tabindex="-1"` on `#home-heading` (so `goHome()` has a focus target).
- `js/learn.js`: the contrast renderer was extracted into one shared function so the moved comparison renders identically in the Study Guide. No behaviour change to the lesson step.
- `js/app.js`: the two shell Home listeners were wrapped in arrow functions so the click Event is never passed into `goHome()` as its `moveFocus` argument. Without this, correct behaviour depended on an accident.

---

## 18. Known Remaining P2/P3 Issues

Not addressed, by instruction. Unchanged from the forensic audit.

| ID | Priority | Issue |
|---|---|---|
| D-11 | P2 | Topic screen shows 2 of 6 topics above the fold at 320×568, 4 of 6 at 375×667 |
| D-12 | P2 | Build badge visually covers an answer button in phone landscape (844×390); `pointer-events:none` keeps it clickable |
| D-13 | P2 | No Back control on the completion panel; `prevStep()`'s `lesson.done` branch remains unreachable dead code |
| D-20 | P2 | Idea nouns are never used in a sentence or tested |
| D-14 | P2 | Learn state (`topicKey`, `stepIndex`) not reset on Home |
| D-16 | P4 | Verb card "Find what happens." is narrower than its definition |
| D-17 | P4 | Sentence label slot mixes grammar terms and question-form labels |
| D-18 | P4 | Guide body retains previous topic markup while hidden (no functional effect) |
| — | P3 | No automated content validator |
| — | P3 | Adjective Clue step is still below the fold at 1366×768 |
| — | P3 | Label size steps from 14.4 px at 1600 to 25.6 px at 1800 |

---

## 19. Actual Device Testing Still Required

Nothing below has been tested. **All results in this report are Chromium viewport emulation.**

| Device class | Still to confirm |
|---|---|
| Physical iPhone (SE-class and modern) | Real Safari rendering of the corrected grid; `minmax(min(250px,100%),1fr)` support; safe-area behaviour; tap accuracy on 54 px choices; iOS Dynamic Type |
| Physical Android phone | Chrome / Samsung Internet rendering; OS font scaling; system back-gesture behaviour |
| Physical tablet | Real touch on topic cards and the Study Guide; rotation mid-lesson |
| Laptop / desktop monitor | Real DPI and OS zoom levels |
| **Classroom projector / interactive board** | **Whether 25.6 px labels are readable from the back row under real lighting**, and whether a teacher can present without scrolling |
| **Screen readers** | **VoiceOver, NVDA, JAWS, TalkBack — none has been run.** The focus trap and the wrong-answer focus move are exactly the behaviours that need a real screen reader to confirm no duplicate or missed announcements |
| Firefox / Safari | Non-Chromium behaviour of `auto-fit` + `minmax(min())`, which is central to the D-01 correction |

---

## 20. Final Verdict

## PASS

Every authorized P0 and P1 defect is verified **FIXED** with measurements:

| Defect | Priority | Status |
|---|---|---|
| D-01 phone Try It overflow | P0 | **FIXED** — 0 px at 320/375/390/430; 0 of 605 states; 0 px at all 17 swept widths |
| D-02 wrong-answer feedback contrast | P0 | **FIXED** — 2.98 → 5.36:1; choice label 2.82 → 4.88:1 |
| D-03 Study Guide focus trap | P1 | **FIXED** — 0 controls reachable behind the modal, was 5 |
| D-04 / D-19 Verb Clue overload | P1 | **FIXED** — 112 → 54 words; Next in view on 8 of 11 devices, was 2 of 11 |
| D-05 projector grammar labels | P1 | **FIXED** — 16.8 → 25.6 px; 0 wrapping regressions at 17 widths |
| D-06 progress "done" pill contrast | P1 | **FIXED** — 2.96 → 5.57:1 |
| D-07 focus on hidden screens | P1 | **FIXED** — 0 of 605 states |
| D-08 focus after a wrong answer | P1 | **FIXED** — lands on the next enabled choice |
| D-09 Predicate wording | P1 | **FIXED** — card, definition, guide and recap consistent on "does or is" |
| D-10 untaught "noun" references | P1 | **FIXED** — 8 → 0, topic order unchanged |
| D-15 Complete Subject card wording | P2, authorized | **FIXED** |
| **Study Guide reverse focus trap (title → Shift+Tab)** | independent review | **FIXED** — escaped to `lesson-topics`, now contained; verified on all six guides in both directions |
| **Verb Study Guide memorization expansion** | approved | **DONE** — 8 → 10 sections, 13 → 35 chips, suffix clue sections untouched |

The mandatory regression gate is met exactly as specified: **horizontal overflow 0 of 605 states**, with zero wrong-topic Study Guides, zero stale Try It states, zero duplicate listeners, zero incorrect progress states, zero console errors, zero failed asset requests, zero hidden-screen focus, a working focus trap, working keyboard retry, all six topics completing, and all three placeholder modes unchanged.

Instructional integrity is intact: the approved sequence, the four-step model, all six definitions, the three verb-ending clues, the verbatim clues-not-rules wording, the verb-first subject strategy, the simple/complete subject contrast, the predicate's does-or-is coverage, all four noun categories and all three adjective questions were verified present after correction. No educational content was weakened, and the relocated verb comparison was preserved in full.

The final completion pass is verified to the standard requested: the focus trap was **reproduced as broken first**, then fixed, then re-tested in **both** directions — TITLE→TAB, TITLE→SHIFT+TAB, FIRST→SHIFT+TAB, LAST→TAB, ten consecutive Tab presses, ten consecutive Shift+Tab presses and a mixed-direction run — on **all six** Study Guides, with every `activeElement` confirmed inside `#guide-panel` and no duplicate handlers after ten open/close cycles. The Verb Study Guide expansion honours the instructional rule that "was" and "has" are never presented as verbs ending in -s, preserves the clues-not-rules wording byte-for-byte, and introduces **no helping-verb or verb-phrase terminology**.

Three honest qualifications on this PASS: one P1 fix (D-06) and one contrast fix the forensic audit missed were made outside the nine enumerated corrections, both documented in §17 for your decision; two small wording observations in §4A are flagged rather than changed; and **no physical device, projector or screen reader has been tested** — every claim here is simulated.
