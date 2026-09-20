# SENTENCE SENSE — AUDIT REPORT, BUILD 1.4.0

**Build:** Sentence Sense — Build 1.4.0
**Branch:** `claude/build-1.4` (unchanged — no branch was created or switched)
**Baseline commit:** `8266029` — *Correct the superseded-audit count in the 1.3.0 docs*
**Baseline code version:** Build 1.3.0, confirmed from `js/app.js`, not from the branch name
**Scope:** Simplified product redesign — skill-first navigation
**Date:** 2026-09-20
**Harness:** `verification/guard.js` — **199 checks, 199 PASS, 0 FAIL**

---

## 0. THE BASELINE, CONFIRMED

The working branch is named `claude/build-1.4`. **The branch name is not the
version.** At the point this work started `js/app.js` declared:

```js
const BUILD_NUMBER = "Build 1.3.0";
```

So the baseline was **Build 1.3.0** — the Sentence Detectives mission — on a
clean working tree, two commits ahead of `main` and unmerged. This build is
numbered **1.4.0**.

The number appears in all four required places (checks 1.4, 1.5):

| Place | Value |
|---|---|
| `js/app.js` | `const BUILD_NUMBER = "Build 1.4.0";` |
| rendered badge | `Sentence Sense — Build 1.4.0` *(verified in-browser)* |
| this audit's filename and heading | `AUDIT-REPORT-Build-1.4.0.md` |
| `SENTENCE-SENSE-HANDOFF.md` | updated |

---

## 1. VERDICTS

| Area | Verdict |
|---|---|
| **PRODUCT SIMPLIFICATION** | **PASS** |
| **HOME SCREEN** | **PASS** |
| **SHARED SKILL ARCHITECTURE** | **PASS** |
| **VERB LEARN** | **PASS** |
| **VERB PRACTICE** | **PASS** |
| **SUBJECT / NOUN / ADJECTIVE ROUTING** | **PASS** |
| **RESPONSIVE UX** | **PASS** |
| **ACCESSIBILITY** | **PASS WITH KNOWN ISSUES** |
| **MISSION RETIREMENT** | **PASS** |
| **REPOSITORY CLEANLINESS** | **PASS WITH KNOWN ISSUES** |
| **DOCUMENTATION** | **PASS** |
| **OVERALL BUILD 1.4.0** | **PASS WITH KNOWN ISSUES** |

The two qualified verdicts are explained in §4 and §10. Neither is a defect in
shipped behaviour; both are honest limits on what was verified and one open
owner decision.

---

## 2. PRODUCT SIMPLIFICATION — **PASS**

The mode-first portal is retired. The product model is now:

```
HOME → SKILL → LEARN | PRACTICE | TEST → ACTIVITY
```

Five screens replace the previous six plus a modal. The Sentence Detectives
mission — twelve cards, five named stops, a progress rail, scene swapping,
read-aloud and animation — is gone entirely. What remains is one sentence, one
question, one obvious action.

**Interface complexity removed:** the mission rail, the twelve card kinds, the
scene-swap interaction, the speech-synthesis control, the replay button, the
reduced-motion animation branch, the Study Guide overlay and its two-way focus
trap, and the `?verb=classic` query route.

**Reading level preserved.** No teaching sentence was simplified. The 20-question
bank is byte-identical to the content audited in 1.2.7. The one new sentence
authored for Verb's Learn question — *The curious students studied the old map.*
— is seven words with a descriptive adjective, inside the 7–12 word target.

---

## 3. HOME SCREEN — **PASS**

Checks 2.1–2.11.

| Required | Result |
|---|---|
| Sentence Sense branding | Typographic wordmark, navy + green, with a book glyph |
| Short purpose statement | "Build stronger sentences." / "Choose a skill to start learning." |
| Exactly four core skill cards | 4 — Verb, Subject, Noun, Adjective (check 2.1, 2.2) |
| One obvious action per card | One `<button>` per card; the card is not a second control (2.7, 2.8) |
| Optional hero image | Reserved area present; see below |
| Subtle Georgia alignment footer | One non-interactive line (2.9) |

**Forbidden furniture: none present.** Check 2.10 string-searches the rendered
Home for achievements, progress, settings, login, profile, avatar, today's goal,
mission, points, coins, streaks, leaderboard and detective language. Zero hits.
Check 2.11 confirms no fifth skill is offered.

**Card design** follows §7: icon, skill name, child clue, example sentence, one
Start button. The example chip is a real miniature plain→marked demonstration,
rendered from the same word array as any teaching sentence (check 10.3).

**The child clues are the brief's wording, not the mockup's** (check 2.5). Where
the reference image and the written brief disagreed, the brief won — Subject is
"Who or what?" not "Who or what is it about?", and Adjective is "Describes a
noun." not "What describes the noun?". The mockup's quote band and its
Learn/Practice/Improve/Grow icon strip were **not** built: §4 forbids quote bands
and persistent navigation.

### The hero image

No approved photograph exists. Per §5 the band was built with a reserved image
area, a neutral treatment and a documented path, and Home works without it.

The reserved area shows the plain→marked pair on one sentence naming all four
skills. **It makes no network request** — referencing a missing file would log a
404 on every child's load, which §37 forbids. To enable a photograph: drop the
file at `assets/images/sentence-sense-hero.png` and uncomment the marked rule in
`css/styles.css` §5.

**A first pass rendered the reserved area as two grey bars and read as a failed
image load.** It was replaced after screenshot inspection (§29).

### Art direction

**No people are drawn anywhere.** The four icons are clean vector symbols.

**An early pass drew the Verb icon as a running figure.** At 24px it read as a
stick person, which §30 forbids and §5 forbids again. It was caught by
inspecting a phone screenshot and replaced with an arrow leaving motion lines —
motion without anybody in it, which is what §7 asks for. Subject keeps a
group-of-figures glyph because §7 explicitly specifies a person/group icon for
it, and it renders as clean silhouettes rather than stick figures.

---

## 4. SHARED SKILL ARCHITECTURE — **PASS**

Checks 3.1–3.6, run against **all four skills**.

One `#screen-skill` serves every skill. Title, child clue, colour identity and
the three activity rows are filled from content by `openSkill()`. There is no
per-skill layout and no per-skill branch in the renderer.

**Reusability is real, and it is measured.** Adding a fifth skill means adding a
key to `homeOrder` and giving the topic six card fields plus four lesson blocks.
No rendering code changes. The shared components are:

| Component | File | Used by |
|---|---|---|
| Sentence renderer | `js/sentence.js` | Home previews, hero, Learn, Practice |
| Home card | `js/app.js` `buildHome()` | all four skills |
| Skill screen | `js/app.js` `openSkill()` | all four skills |
| Learn | `js/learn.js` | all four skills |
| Practice | `js/practice.js` | any skill with a bank |
| Feedback | `.answer-feedback` + `fb-*` | Learn and Practice |

Still plain HTML, CSS and JavaScript. **No React, no Vue, no build system, no
package manifest in the shipped project.** `puppeteer-core` was installed
outside the repository, for the harness only.

---

## 5. VERB LEARN — **PASS**

Checks 4.1–4.22.

Four states on one screen: **What is it? → How do I find it? → Show me → Let me
try** (check 4.2). Not five stages, not a screen per step.

- SHOW ME uses the plain→marked pair (4.11).
- LET ME TRY asks one guided question; Finish is locked until answered (4.13,
  4.14) and stays locked after a wrong answer (4.17).
- A wrong answer explains what that word does **in this sentence** — *"students
  names who did the action. Ask yourself: what did the students do?"* — and is
  never "Wrong. Try again." (4.15).
- A correct answer gets teaching, not only praise (4.18).
- Completion recaps and **claims no mastery** (4.21).

### The Study Guide fold-in

Per the owner's decision, the modal is gone — overlay, focus trap and header
button — and its useful content is plain content inside **How do I find it?**:
35 reference chips and the same-word contrast (4.6, 4.8, 4.9). It is collapsed
behind one `<details>` so the state stays short (4.7), and no separate recap
screen was created. **This closes D-35 by removing the architecture the defect
lived in.**

---

## 6. VERB PRACTICE — **PASS**

Checks 5.1–5.10 and 6.1–6.9.

Reached the normal way: **Home → Verb → Practice**. No hidden route.

| Preserved behaviour | Check | Evidence |
|---|---|---|
| 20 questions | 5.2 | `total = 20` |
| 4 stages of 5, stages in order | 5.7 | `0,0,0,0,0,1,1,1,1,1,2,2,2,2,2,3,3,3,3,3` |
| Question shuffle within stage | 5.8 | three fresh entries compared |
| Choice shuffle at render (D-29) | 5.9 | **11 distinct orders in 12 renders** |
| Answer identity by `dataset.ci` (D-36) | 5.10 | every button carries its original index |
| Recap is content (D-30) | — | engine falls back to topic recap, never another skill's wording |
| No auto-advance | 5.5 | Next locked until answered |
| Nothing stored | 8.4 | `localStorage=0 sessionStorage=0` after a full walk |

### Feedback escalation

| Attempt | Behaviour | Check |
|---|---|---|
| 1st wrong | what that word does in THIS sentence; answer hidden | 6.1, 6.2 |
| 2nd wrong | the stronger clue; answer still hidden | 6.3, 6.4 |
| 3rd wrong | reveal and explain, correct button marked by identity, all locked, child moves on | 6.5–6.8 |

**Added in 1.4.0: "Need a clue?"** The child may ask rather than guess. Asking
counts no attempt and marks nothing wrong (6.9).

---

## 7. SUBJECT / NOUN / ADJECTIVE ROUTING — **PASS**

Checks 3.1–3.6 per skill, 8.1, 8.2.

All three open from Home, show the correct title and child clue, use the shared
Skill component, and run their existing Learn content unchanged.

**The placeholders are honest** and marked where the child reads, not only after
a press: Practice says *"Practice for this skill is coming next."* and Test says
*"Test mode is coming next."* Neither imitates the activity it stands in for, and
**Test is not a second copy of Practice** anywhere in the product.

**No bank was invented** for Subject, Noun or Adjective (§41).

**No Verb content leaks.** Opening Subject immediately after answering in Verb
Practice shows Subject's own content (8.1, 8.2), and re-entering Practice
restarts cleanly at question 1 with fresh state (8.3).

---

## 8. RESPONSIVE UX — **PASS**

9 viewports × 3 screens = **27 samples**, each checked for horizontal overflow,
false bottoms and tiny type.

| Viewport | Overflow | False bottoms | Text < 12px |
|---|---|---|---|
| 375×667, 390×844, 430×932 | 0 | 0 | 0 |
| 820×1180 | 0 | 0 | 0 |
| 1024×768, 1280×720, 1366×768 | 0 | 0 | 0 |
| 1440×900, 1920×1080 | 0 | 0 | 0 |

**0 horizontal overflow. 0 false bottoms. 0 text under 12px.** A false bottom is
defined as a page that does not scroll while a required control sits below the
fold. Where Home exceeds the fold at 430×932 and 1024×768 the page scrolls
normally, which §27 explicitly accepts.

Column counts are exactly as specified (check 11.cols): **1 on phone, 2 on
tablet, 4 on desktop**. The same cards and the same content at every size — there
is no separate mobile interface.

Every visible control is **at least 44px tall** (check 9.10); the floor in the
stylesheet is 48px.

Type sizes were raised during this build after the harness flagged two labels
under 12px on Home. §27 was preferred over fitting more above the fold.

---

## 9. ACCESSIBILITY — **PASS WITH KNOWN ISSUES**

Checks 9.1–9.10.

| Requirement | Result |
|---|---|
| Semantic buttons | Every control is a real `<button>` (9.2) |
| Keyboard usable | Home reachable in logical order; all four Start buttons in the first six tab stops (9.5) |
| Visible focus | Keyboard focus draws an outline distinct from the resting state (9.6) |
| Correct heading structure | Exactly one `<h1>` (9.1) |
| Logical tab order | 9.5 |
| Feedback announced | `role="status" aria-live="polite"` on both feedback regions (9.4) |
| No colour-only signal | A ruled-out choice is struck through as well as recoloured (4.16) |
| Touch-friendly | Every control ≥ 44px (9.10) |
| Modal focus behaviour | No modal remains. D-35 closed by removal (7.6) |
| Reduced motion respected | Transitions collapse to ~0 (11.rm) |

Each Start button carries its own `aria-label` naming its skill and clue, because
a screen-reader user hears four buttons in a row and "Start" alone would not
distinguish them (9.3). Focus moves to the new screen's heading on entry (9.9).

### Two real accessibility defects were found and fixed in this build

**N-02 — the primary button had no visible focus ring.** `:focus-visible` set
`box-shadow`, and `.btn-start`'s own drop shadow was declared later at equal
specificity, so it won. Focus is now drawn with `outline`, which occupies its
own property and cannot be overridden that way.

This one is worth recording carefully: **the first version of the check passed
it.** The check called `.focus()` in script, which does not reliably match
`:focus-visible`, so it measured the button's resting shadow and reported PASS.
Rewriting it to tab with the keyboard and compare focused against resting turned
it red immediately. A test that cannot fail is not evidence.

**Headings showed a focus ring.** Headings carry `tabindex="-1"` so focus can be
moved to them on screen entry — they are focus targets, not controls. The ring
around an `<h2>` read as a rendering fault and is now suppressed for
`[tabindex="-1"]` only.

### Why this is qualified

**L-04 — no screen reader was run.** ARIA roles, labels, live regions and focus
movement are implemented and programmatically checked, but no actual screen
reader was used and **no screen-reader testing is claimed** (§25).

---

## 10. MISSION RETIREMENT — **PASS**

Checks 7.1–7.9.

| Check | Result |
|---|---|
| No mission engine, artwork or content loaded | 7.1–7.3 |
| `#screen-mission` gone from the DOM | 7.4 |
| Mission rail gone | 7.5 |
| Study Guide modal and button gone | 7.6 |
| No detective / mission / case language anywhere | 7.7 |
| `?verb=classic` removed — Verb behaves identically with the flag present | 7.8 |
| `?verb=classic` raises no error | 7.9 |

**No hidden duplicate child experience remains**, documented or otherwise (§22).

Three files were deleted after a recorded dependency check confirming they form a
closed island: `js/mission.js`, `js/scenes.js`, `js/data/mission-verb.js`. The
full evidence table is in `DELETION-DEPENDENCY-REPORT.md` in the deliverables.

---

## 11. REPOSITORY CLEANLINESS — **PASS WITH KNOWN ISSUES**

**Deleted, all documented:**

- 3 mission source files (91 KB)
- 5 superseded audits — `1.2.3`, `1.2.4`, `1.2.5`, `1.2.7`, `1.3.0`
- `assets/Sentence-Sense_logo.png` — 1,746,404 bytes, re-confirmed unreferenced
  immediately before deletion
- The mission verification assets: `missionguard.js`, `results.json`,
  `responsive-matrix.json`, the old `README.md` and 33 screenshots
- The stray empty `Chat/` directory

Exactly one audit now exists: this one.

**`verification/serve.js` carried a real defect and was fixed.** `ROOT` was used
raw, so `path.join(".", "/index.html")` produced a relative path while the
traversal guard compared it against an absolute `path.resolve(".")`. **Every
request under the project's own documented command returned 403.** Any relative
root failed; only an absolute one worked. It now resolves `ROOT` once.

### Why this is qualified

**H-03 is open and needs an owner decision.** `assets/images/logo.png` (972 KB)
and `logo-512.png` (304 KB) are **now unreferenced**. The existing lockup is a
cartoon mascot pencil with bubble lettering — exactly what §3 forbids and §29
says to reject a build over — so the new Home uses a typographic wordmark
instead. §23 authorised deleting one specific asset and these are not it, so
they were left in place rather than deleted without approval.

---

## 12. DOCUMENTATION — **PASS**

`SENTENCE-SENSE-HANDOFF.md` was rewritten to describe **current state only**. No
mission language describes it as the current product. It carries the new
philosophy, the four skills, skill-first navigation, the reusable architecture,
Verb's Practice status, the Subject/Noun/Adjective and Test placeholder status,
mission retirement, every removed file, the cleanup, responsive and accessibility
results, known limitations, and recommended next work.

Stale comments were corrected to the **new** architecture (§24): the stylesheet
header now describes the 1.4.0 sections rather than "Build 1.2 stylesheet ...
sections 9-11", and `js/app.js` no longer carries a state comment listing screens
that do not exist.

---

## 13. CONTENT MANIFEST

| Skill | Learn states | Learn question | Practice | Test |
|---|---|---|---|---|
| Verb | 4 | `learnTry` — 1 question, newly authored | 20 questions, 4 stages | placeholder |
| Subject | 4 | `tryIt` — 1 question, unchanged | placeholder | placeholder |
| Noun | 4 | `tryIt` — 1 question, unchanged | placeholder | placeholder |
| Adjective | 4 | `tryIt` — 1 question, unchanged | placeholder | placeholder |
| Complete Subject | content preserved, not routed | — | — | — |
| Predicate | content preserved, not routed | — | — | — |

**Total child-facing questions: 24** — 4 Learn questions and the 20-question Verb
bank. One sentence was authored in this build; every other word of teaching
content is carried forward unchanged.

---

## 14. KNOWN ISSUES

| ID | Issue | Severity |
|---|---|---|
| **D-20** | Abstract nouns defined in the Noun lesson but never demonstrated in a marked sentence or asked about. Carried forward untouched. | 3 |
| **D-26** | The build badge can fall below the fold on some device classes. Deployment metadata, not instruction. | 4 |
| **H-03** | `logo.png` and `logo-512.png` now unreferenced. Needs an owner decision. | 4 |
| **P-02** | Subject, Noun and Adjective have Learn only. Honest placeholders until banks are approved. | 3 |

**Standing limitations:** L-02 simulated devices only · L-03 no projector · L-04
no screen reader · **L-05 no testing with a child — the most important gap** ·
L-06 Chromium only · L-07 no readability instrument was run, and no reading
level or Lexile is claimed.

---

## 15. WHAT IS NOT CLAIMED

No claim is made that this build improves learning outcomes. Nothing here has
been tested with a child. Skill-first navigation is a product decision, not a
research-proven intervention. The feedback model follows the same evidence the
earlier builds cited — feedback should target the task, the subject and the
strategy rather than the person, and should be given when work is correct, not
only when it is wrong — but digital feedback has a smaller effect than a
teacher's, which is a reason for modesty.

---

*End of audit. Build 1.4.0, branch `claude/build-1.4`, baseline `8266029`.*
