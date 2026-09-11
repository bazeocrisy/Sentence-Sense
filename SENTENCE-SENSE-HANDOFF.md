# SENTENCE SENSE — PROJECT HANDOFF

**Current build: Sentence Sense — Build 1.3.0**
**Last pass:** Verb lesson redesigned as the illustrated "Sentence Detectives" mission — 2026-09-11
**Repository:** `C:\Sentence-Sense` → GitHub Pages · static · $0 recurring
**This file describes the CURRENT shipped state only. Read it first.**

---

## 1. WHAT THIS PROJECT IS

Sentence Sense teaches an elementary student — target **3rd grade, ages 8–9** —
how a whole sentence works: verbs, subjects, complete subjects, predicates,
nouns and adjectives. Static site: no database, no API, no accounts, no server
state. The only external request is the Google Fonts CDN.

Three governing rules:

> **PORTAL = CHOICE. MODE = DEPTH.**
> Home helps the child pick a mode and teaches nothing.

> **READ IT, then SEE HOW IT WORKS.**
> A child meets a sentence as a sentence before meeting its grammar.

> **SIMPLIFY THE INTERFACE, NOT THE READING LEVEL.** *(added 1.3.0)*
> Fewer words of instruction, shorter directions, one obvious action — and
> sentences that stay worth reading. Never a babyish sentence, and never an
> activity a child can pass by looking at the picture instead of reading.

---

## 2. BUILD NUMBERING — EVERY PUSH GETS A NEW NUMBER

**Every approved push increments the visible build number**, so the live site can
be verified after GitHub Pages refreshes. Current: **Build 1.3.0**.

It must match in four places, and the audit checks all four:

1. `js/app.js` — `const BUILD_NUMBER = "Build 1.3.0";`
2. the rendered badge — `Sentence Sense — Build 1.3.0`
3. the audit file name and heading
4. this handoff

> **A BRANCH NAME IS NOT A VERSION.** Build 1.3.0 was developed on a branch
> called `claude/build-1.4`, from a baseline of 1.2.7. Always read
> `js/app.js` to learn what the code actually is.

---

## 3. FILE MAP

| File | Role | Lines |
|---|---|---|
| `index.html` | All screens: home, topics, lesson, **mission**, mode placeholder, guide overlay | 311 |
| `css/styles.css` | Every style, numbered sections 1–**12** | 1524 |
| `js/app.js` | Shell only: screen switching, Home/Back/Escape, build badge | 172 |
| `js/learn.js` | Learn engine: topic screen, lesson runner, sentence component, Try It, guided question bank, Study Guide | 962 |
| `js/data/learn-content.js` | Content for the six original lessons, including the Verb 20-question bank | 931 |
| **`js/mission.js`** | **NEW 1.3.0** — the Verb mission engine | 877 |
| **`js/scenes.js`** | **NEW 1.3.0** — original inline-SVG artwork | 528 |
| **`js/data/mission-verb.js`** | **NEW 1.3.0** — all Verb mission content | 529 |
| `assets/images/` | `logo.png` · `logo-512.png` · `favicon.png` — unmodified since 1.1.1 | — |
| `assets/Sentence-Sense_logo.png` | **1.7 MB and UNREFERENCED.** Nothing links to it. Recommend deletion — see §11. | — |
| `verification/` | **NEW 1.3.0** — the 1.3.0 harness, its raw results and 33 screenshots | — |
| `AUDIT-REPORT-Build-1.3.0.md` | The current build audit | — |
| `AUDIT-REPORT-Build-1.2.3 / 1.2.4 / 1.2.5.md` | **Superseded. Should have been removed** — see §11. | — |
| `SENTENCE-SENSE-HANDOFF.md` | This file, at the repo root | — |

**`js/data/learn-content.js` was not touched in 1.3.0 — not one byte.** The Verb
20-question bank is exactly as it shipped in 1.2.7.

Script load order in `index.html` matters: `learn-content` → `scenes` →
`mission-verb` → `learn` → `mission` → `app`. `js/app.js` calls
`SS_MISSION.init()` and must load last.

---

## 4. CSS SECTION MAP

| Section | Covers |
|---|---|
| 1 | Design tokens |
| 2 | Reset / base |
| 3 | Shared shell |
| 4 | Header / navigation |
| 5 | **Home portal** |
| 6 | Mode destination screen (the three placeholders) |
| 7 | **Build badge** |
| 8 | Responsive — home + shell |
| 9 | **Learn Mode** — 9a headers · 9b topic screen · 9c lesson layout · 9d sentence component · **9d-i plain/marked pair** · 9e Try It · 9f Study Guide |
| 10 | Learn Mode — responsive |
| 11 | Classroom projector / large display |
| **12** | **VERB MISSION (1.3.0)** — 12a shell · 12b rail · 12c card · 12d illustration · 12e coach · 12f objective · 12g sentence · 12h plain/marked pair · 12i prompts and swap · 12j feedback · 12k controls · 12l briefing and completion · 12m responsive · **12n-pre short viewports** · 12n large display · 12o reduced motion |

> **Warning.** `.card-grid`, `.pick-card`, `.pick-name` and `.pick-sub` are
> written by `js/learn.js` but styled in **Section 9b**. They were once shared
> with the old Home cards; a Home rewrite deleted them and the Learn topic screen
> silently collapsed to inline text. Do not move them into a Home section.

> **Warning, learned the hard way in 1.3.0.** `.app-header` is a **CSS grid**,
> and **every variant must declare its own `grid-template-columns`**. The new
> `.header-mission` shipped without one during development: grid fell back to a
> single column, the five header children stacked vertically, the header measured
> **246px tall** at 1366×768, and the primary action was pushed below the fold.
> A new header variant is not finished until it has a column template.

Section 12 is **appended**. Sections 1–11 are byte-identical to Build 1.2.7.

---

## 5. CURRENT STATE

### Home — COMPLETE. Do not redesign without a new brief.

- **Centred brand:** the graphical logo on the centre line, tagline
  *"See how sentences work."* directly beneath. Sized by width with
  `height:auto`, so the 4:3 proportion cannot distort.
- Hero: "Welcome!" / "What would you like to do today?" / "Choose a mode to get
  started."
- Four mode cards — Learn, Practice, Break It Down, Test — each
  **MODE → SHORT PURPOSE → ACTION**.
- **Only the four buttons navigate.** Cards are non-interactive containers: no
  click handler, no `cursor:pointer`, no `tabindex`, no `role="button"`. Exactly
  four tab stops.
- No login, profile, account, avatar, settings or gear icon anywhere.

### Learn — six topics. Verb now runs the mission; the other five are unchanged.

- Six topics, fixed order: **verb → subject → complete-subject → predicate →
  noun → adjective**.
- Topic screen: **3 × 2 desktop (≥901px) · 2 columns 601–900px · 1 column
  ≤600px**. Unchanged.
- **Verb opens the Sentence Detectives mission.** See §5b.
- **The other five topics run the original four-step lesson**, unchanged:
  DEFINITION → CLUE → EXAMPLE → TRY IT, one Try It question each.
- Study Guide per topic: modal, focus-trapped **both** directions, Escape and
  backdrop close. Reached from a lesson *and* from the mission.
- Completion for the five classic topics: confetti, "You learned X!", a named
  topic badge, one recap line, then the way on. **Not gamified.**

### Practice / Break It Down / Test — NOT BUILT

All three route from Home to the shared placeholder screen.

---

## 5b. THE VERB MISSION — "SENTENCE DETECTIVES" (Build 1.3.0) — VERB ONLY

A separate engine (`js/mission.js`) on its own screen (`#screen-mission`). **No
other topic uses it**, and it shares no code path with the four-step lesson
runner, which is why 1.3.0 could not regress the other five topics.

**Twelve cards, five named stops on a visible rail:**
**Watch · Find · Explore · Solve · Extend**

| # | Card | Kind | Illustrated | Verb | Type |
|---|---|---|---|---|---|
| 1 | Case file | briefing | detective | — | — |
| 2 | Watch me work | reveal | soccer, **animated** | kicked | action |
| 3 | Your turn to find it | pick | stream | examined | action |
| 4 | One more to find | pick | porch + puppy | discovered | action |
| 5 | Change the verb | swap | stream ×2 | examined / collected | — |
| 6 | Change it again | swap | lab ×2 | measured / poured | — |
| 7 | Solve it yourself | pick + why | **none** | blocked | action |
| 8 | A verb with no action | reveal | teammates | were | being |
| 9 | Find the being verb | pick | **none** | was | being |
| 10 | When the verb is two words | reveal | lab | is measuring | phrase |
| 11 | Find the whole verb phrase | pick ×2 | **none** | are training | phrase |
| 12 | Case closed | done | detective | — | — |

### The rules this design is built on — do not quietly break them

**1. WORKED EXAMPLE BEFORE PRACTICE, EVERY TIME.** A child is never asked to
guess before instruction. WATCH models it; the being verb and the verb phrase
each get their own model card before their own practice card.

**2. WORKED EXAMPLES ARE ILLUSTRATED. INDEPENDENT PRACTICE IS NOT.** Cards 7, 9
and 11 carry **no scene at all** and nothing is pre-marked. This is the
no-leakage rule and a harness check enforces it.

**3. NO SCENE DESCRIPTION MAY NAME ITS OWN VERB.** A `sceneAlt` is read by
assistive technology; if it contains the answer, a screen-reader user is handed
what a sighted user has to work out. Automatically checked.

**4. VERB POSITION MUST STAY VARIED — currently 3 · 6 · 3 · 7 · 3 · 7 · 3+4 ·
5+6.** This is the D-29 hazard in a new shape. Build 1.2.7 closed D-29 because
the old bank's answer sat in position 3 in 16 of 20 questions and a child could
clear it by pressing the third button. If the verb were always the fourth
*word*, "press the fourth word" would beat this lesson too. **Do not add a card
whose target index repeats the run.**

**5. NEVER ASK FOR "THE VERB" WHEN THE ANSWER IS TWO WORDS.** Card 10 teaches
the verb phrase; card 11 then asks for it and its prompt says **"Click BOTH
words."** A phrase renders as ONE chip, ONE label, ONE continuous underline,
because the teaching point is that the two words are one verb. Drawing two
separate marks would teach the opposite.

**6. A PARTIAL ANSWER ON A TWO-WORD TARGET IS PROGRESS, NOT AN ERROR.** No
attempt is counted, nothing is marked wrong, and the child is invited to find
the other word.

**7. THE BEING-VERB RULE FROM 1.2.6 STILL APPLIES.** After a being verb, use a
plain adjective with no participle form — `busy`, `quiet`, `happy`, `ready`,
`full`, `empty`, `proud`. Never `crowded`, `excited`, `broken`, `finished`,
`tired`, `frozen`. A word ending `-ed`/`-en` after a being verb can be read as a
past participle, which turns `was <word>` into a passive verb phrase and makes
the answer ambiguous. The mission's two being sentences use **`proud`** and
**`empty`**.

**8. EVERY PICKABLE WORD CARRIES ITS OWN FEEDBACK.** `notes` is index-aligned
with `words` and a harness check enforces `notes.length === words.length`,
including `the`, `a`, `beside` and `during`. A word must never be selectable and
produce silence.

**9. CORRECT ANSWERS GET TEACHING, NOT JUST PRAISE.** Feedback matters most when
the child is right. Praise is brief and aimed at the thinking ("Nice thinking"),
never at the child ("You're so smart") — feedback about the person is the least
effective kind.

**10. FINISHING IS NOT MASTERY, AND THE WORDING MUST NOT SAY IT IS.** The
completion card recaps what verbs do and closes with *"Detectives get sharper
every time they read a new sentence."* A harness check fails on the word
"mastered".

### Wrong answers escalate, they do not punish

| Attempt | The child gets | Answer shown? |
|---|---|---|
| 1st | what that word does in THIS sentence, then "Have another look." | no |
| 2nd | that word's job, then the strategy clue | no |
| 3rd | the reasoning modelled aloud, answer marked, card unlocks | yes |

A ruled-out word is disabled, recoloured **and struck through** — never colour
alone.

### EXPLORE is not a question

Neither verb is wrong, nothing is scored, and the engine records no result.
Choosing a verb fills the slot **and swaps the illustration**. Both must be
tried, because the contrast is the lesson; the insight line appears only after
both. The scene swap is the *explanation*, not a reward — see §7 on why.

### Read-aloud

`window.speechSynthesis`, which is already in the browser: no paid service, no
account, no network request, no new dependency. It **never autoplays**, and it
speaks the **plain sentence only** — never a label, a mark or an answer. The
control is not rendered at all when the API is absent, and speech is cancelled
when leaving the screen, going Home or pressing Escape.

### Animation

One animated scene: the 0.62s soccer kick on card 2, replayable. Under
`prefers-reduced-motion: reduce` the animation is suppressed, the motion trail is
hidden **and the replay button is not rendered** — a button that visibly does
nothing is worse than no button. The lesson is fully completable with no motion
at all, and the still frame still shows a ball being kicked.

### Nothing is persisted

No `localStorage`, no `sessionStorage`, no network, no score, no timer, no
streak. Leaving and re-entering Verb restarts the case at card 1. Back is
disabled on card 1, matching the four-step lesson; the exits are **All Topics**
in the footer and **Home** in the header.

### `?verb=classic` — the original Verb lesson is still there

Adding `?verb=classic` to the URL restores the four-step Verb lesson *including
its 20-question guided bank*. Not a child-facing feature and not linked
anywhere. It exists so the bank engine stays exercisable rather than orphaned,
and so 1.3.0 and 1.2.7 can be compared in one browser.

> **OPEN PRODUCT QUESTION.** A child using the app normally will never meet the
> 20-question bank now. It is intact and tested but unreachable from the UI.
> Either the mission replaces it, or the two need a child-facing choice. **This
> needs an owner decision.**

### The bank contract (Build 1.2.7) still governs `tryItBank`

Unchanged and still true for any topic that adds a bank: `recap` is required and
belongs to the content, not the engine (D-30); `stages[]` and `questions[]` are
supplied entirely by content; a topic with a bank must NOT also have a `tryIt`
(D-33); choice order is shuffled at render time (D-29); answer identity is
`dataset.ci`, never rendered text (D-36); question shuffle is stage-scoped and
choice shuffle is per-render — two shuffles, two concerns.
`window.SS_LEARN.bankState()` exposes read-only state for harnesses.

---

## 6. THE PLAIN → MARKED TEACHING PATTERN

Wherever a sentence carries any annotation, the same sentence is shown twice:

```
READ IT              The determined player kicked the muddy ball across the field.
──────────────────────────────────────────────────────────────────────────────────
SEE HOW IT WORKS     The determined player [VERB: kicked] the muddy ball across …
```

**How the exact-match rule is guaranteed.** Both passes render from the **same
`words` array**. The plain pass suppresses annotation; it cannot add, remove,
reorder or re-punctuate a word, because it reads the same source. The marked
pass only decorates. **Never** introduce a separate plain-text string for a
sentence — that is the one change that would let the two versions drift apart.
The mission follows the same rule, in `js/mission.js` → `renderSentence()`.

**In the mission the pair appears only AFTER the reveal**, so it teaches without
leaking. Before the reveal the child sees the plain sentence alone.

> **Watch the chip structure.** `.mi-word` is a **column** so a written label can
> sit above the word. The word and its ending punctuation therefore need their
> own row inside it (`.mi-word-body`). Without that wrapper the punctuation
> becomes a third line and `stream,` renders as "stream" with a comma stranded
> underneath. This shipped briefly during 1.3.0 development and was caught by
> looking at a screenshot, not by a test.

---

## 7. THE EVIDENCE THIS DESIGN LEANS ON — AND WHAT IT DOES NOT CLAIM

Read before changing the interaction model.

**IES / WWC, *Organizing Instruction and Study to Improve Student Learning*.**
Rec 2 *interleave worked examples with problem-solving* (Moderate) — hence
model→practice four times. Rec 3 *combine graphics with verbal descriptions*
(Moderate) — every illustration is paired with its explanation. Rec 7 *ask deep
explanatory questions* (**Strong**) — hence the "why is this the verb?" card.

**EEF Toolkit, *Feedback*** (+6 months; +7 for primary; high impact, very low
cost, extensive evidence). Effective feedback targets **the task, the subject
and the strategy**; feedback about the *person* is the least effective kind. And
**give feedback when the work is correct**, not only when it is wrong. Both rules
are visible in every string in `mission-verb.js`. Digital feedback has a smaller
effect (+4 months) than a teacher's — a reason for modesty.

**Takacs, Swart & Bus (2015)**, *Review of Educational Research* 85(4), 698–739.
43 studies, 2,147 children. Comprehension g+ = 0.17, expressive vocabulary
g+ = 0.20. The load-bearing finding is the split: **multimedia that illustrates
the text helped; interactive extras — hotspots, games, dictionaries — distracted**,
and were *most* harmful to children from less stimulating home environments.

> **That last finding is why there is no minigame, no reward animation, no
> clickable scenery and no sound effects. EVERY INTERACTION IN THE MISSION IS
> THE LEARNING TASK ITSELF.** The EXPLORE scene swap is tied to the word the
> child changed — it is the explanation, not a prize. Do not add a "fun"
> interaction that is not the lesson.

**What is NOT claimed.** The detective framing is a design hypothesis, not a
research-proven intervention. The storybook meta-analysis is about young
children's literacy from digital storybooks, **not third-grade grammar**, so it
transfers as a caution about clutter, not as evidence this lesson works. **No
claim is made that this build improves learning outcomes, and no reading level
or Lexile measure is claimed for any sentence.** Nothing here has been tested
with a child.

---

## 8. LEARN VS PRACTICE VS TEST — PRESERVE THE DIFFERENCE

| Mode | Promise |
|---|---|
| **LEARN** | Teach me and help me understand. |
| **PRACTICE** | Let me work with less help. |
| **TEST** | Let me show what I know without help. |

Learn gives **explanatory wrong-answer feedback** and must keep doing so:

> *"curious tells what KIND of students they are. It describes them."*
> — mission FIND card 1, the live wording.

Never reduce Learn feedback to "Wrong. Try again." That belongs to Test.

---

## 9. ENGAGEMENT STANDARD

Should feel: friendly, colourful, encouraging, alive, easy to continue through.
Should not feel: preschool-like, noisy, game-show-like, overly academic, or like
a digital worksheet.

**And specifically, since 1.3.0:** simplifying the interface must never become
simplifying the sentences. Target middle-to-upper third grade — descriptive
adjectives, varied openings, varied length, settings a third grader cares about.
No timers, no lost lives, no leaderboards, no streak pressure.

---

## 10. COLOUR AND TYPE SCALE

One hue per topic, carried on the lesson header, the marks and the completion
badge. The mission uses the **purple/yellow** Sentence Sense identity on its
header and rail, with `--c-verb` blue for verb marks.

Colour is **never** the only signal — every marked word also has a written
label, a border and an underline; a ruled-out word is struck through; the
detective's mood changes its shape, not only its hue.

Do not add new colours for variety.

**Type scale is gated on width AND height — every wide breakpoint.**

| Rule | Guard | Why |
|---|---|---|
| `(min-width:1800px) and (min-height:1100px)` | added **1.2.4** (D-22) | Gated on width alone it treated a 1920×1080 desktop as a projector. |
| `(min-width:1600px) and (min-height:900px)` | added **1.2.7** (D-28) | Gated on width alone, 1600×720 scrolled 152px where 1280×720 fitted whole. |
| **`(min-width:1600px) and (min-height:1000px)`** | **mission only, added 1.3.0 (M-03)** | **900px was not enough here.** The mission card carries an illustration the lesson does not, so at 1600×900 the larger type made a *wider* viewport *vertically worse* — 974px of scroll against 947px at 1440×900. That is D-28 recurring in a new place. 1000px is the measured threshold for this card. |

> **PERMANENT RULE: a media query that enlarges type MUST carry a `min-height`
> guard — and the right guard depends on what is on the screen.** A real large
> display is large in **both** dimensions. Do not remove any of these three
> height conditions, and do not assume the lesson's threshold fits a new screen.

**Short viewports shrink spacing, never targets.** Section 12n-pre compacts the
mission at `max-height:820px`, `max-height:700px`, and
`max-width:900px and max-height:1000px`. Type and 44px tap targets are the last
things to give way; spacing, illustration height and the duplicated objective
line go first.

---

## 11. DEFECT LEDGER

Current truth as of Build 1.3.0. Matches `AUDIT-REPORT-Build-1.3.0.md`.

### Open

| ID | Issue | Severity |
|---|---|---|
| **D-27** | **OPEN, unchanged.** Required-control visibility on short-height viewports, on the **classic lesson screens**. Re-measured in 1.2.7: 58 below-fold samples, ZERO false bottoms, tightest case Verb Clue at 375×667 ≈11px. Not re-measured in 1.3.0 — those screens were not touched. **The mission's own responsive results are clean:** 0 false bottoms, 0 below-fold on every sample ≥1024×600. | 3 |
| **D-26** | **OPEN / DEFERRED.** The build badge can fall below the fold across several device classes. Deployment metadata, not instructional content. Fixed-position treatment is avoided because it risks reopening D-21. | 4 |
| **D-20** | **OPEN.** Abstract nouns are defined and illustrated in the Noun lesson but never demonstrated inside a marked sentence and never asked about in Try It. | 3 |
| **D-35** | **OPEN / DEFERRED.** The Study Guide's background is not marked `inert` or `aria-hidden`. Mitigated: the two-way focus trap works and `#guide-panel` carries `role="dialog" aria-modal="true"`. Re-verified in 1.3.0 from the mission (checks 8.4, 8.5). Do not fix without real screen-reader testing. | 4 |
| **H-01** | **OPEN — repository hygiene, needs owner approval.** Three superseded audits (`1.2.3`, `1.2.4`, `1.2.5`) are still in the repo; §13 says one audit should exist at a time. **Not deleted** — the 1.3.0 brief required approval before deleting files. | 4 |
| **H-02** | **OPEN — repository hygiene, needs owner approval.** `assets/Sentence-Sense_logo.png` is **1.7 MB and referenced by nothing**. It is 66% of the repo's asset weight and loads for nobody. **Not deleted** — same reason. | 4 |
| **P-01** | **OPEN — product decision.** The 20-question Verb bank is no longer reachable from the UI, only via `?verb=classic`. See §5b. | 3 |

### Closed in Build 1.3.0

| ID | Resolution |
|---|---|
| **M-01** | **CLOSED.** `.header-mission` had no `grid-template-columns`, so the header stacked to 246px tall and pushed the primary action below the fold. Template now matches `.header-lesson`. |
| **M-02** | **CLOSED.** Ending punctuation rendered on its own line (`stream,` → "stream" + stranded comma). Fixed with a `.mi-word-body` row wrapper. |
| **M-03** | **CLOSED.** D-28 recurrence: the mission's 1600px type step made a wider viewport vertically worse at the same height. Height guard raised to 1000px. |
| **M-04** | **CLOSED.** False-bottom states on 1366×768, 1280×720, 1600×720, 1024×768 and small phones. Measured short-viewport compaction. **0 false bottoms across 56 samples.** |
| **M-05** | **CLOSED.** Dead unreachable `leave()` branch in `back()` removed (the D-33 lesson). |
| **M-06** | **CLOSED.** Stream-scene children overlapped the water and read as standing in it. Water lowered, figures redrawn kneeling and scaled up. |
| **M-07** | **CLOSED.** The rail showed "Extend" as current on the "Case closed!" card. All five stops now read done there. |

### Standing limitations

- **L-01 — CLOSED for Build 1.3.0.** The real webfont *was* measured here: both
  Google Fonts requests returned 200, `document.fonts.status = "loaded"`, and
  `document.fonts.check('700 1rem "Baloo 2"')` returned true. **Every 1.3.0
  measurement and screenshot was taken with the real webfonts rendering.** If a
  future environment blocks the CDN again, reopen this.
- **L-02 — All device testing is simulated.** 14 viewports in Chrome emulation;
  no physical phone or tablet.
- **L-03 — No classroom projector verification.** 2560×1440 emulated only.
- **L-04 — No screen-reader testing.** ARIA and the focus trap are implemented
  and programmatically tested; no actual screen reader was run.
- **L-05 — No testing with a child.** **The most important gap in this project.**
  Whether a third grader finds the mission engaging, whether the sentences are
  the right difficulty, and whether the detective framing lands are questions no
  audit here can answer.
- **L-06 — Chromium only.** Chrome 141. No Firefox, Safari or iOS. Read-aloud in
  particular behaves differently on iOS Safari and is untested there.

---

## 12. BUILD BADGE — HOW IT WORKS

> The badge is in **normal document flow, below all content, on every screen**.
> The single exception is Home at `min-width:1181px` **and** `min-height:621px`,
> where Home provably does not scroll and reserves a 48px lane.

A `position:fixed` badge is only safe on a screen that cannot scroll, and every
Learn screen — including the mission — can scroll. Do not add a new fixed rule
without proving that screen never scrolls at any viewport.

---

## 12b. LESSON VERTICAL PLACEMENT — A PERMANENT RULE

> **Never vertically centre `.lesson-body` or `.mission-body`.** Build 1.2.3
> added `justify-content:center` to the lesson body to tidy the dead strip below
> a short step. On a tall desktop it centred the whole column, so the shorter the
> step the further down the page it was pushed — the header→rail gap measured
> 33px at 1366 but 226px at 1920 and 406px at 2560. The column is top-aligned
> with one controlled gap, and that gap must stay a **constant**, never a
> function of spare height.

**The mission obeys this and it is measured.** `.mission-body` keeps
`padding-block` **top at a constant 14px at every viewport** — the short-viewport
rules in §12n-pre reduce only the *bottom* padding and the inter-block gap.
Verified across all 14 viewports: the header→rail gap is **14px, one value, no
variation** (check 12.3).

If a short step ever looks bottom-heavy again, adjust the footer — not the
position of the lesson.

---

## 12c. HARNESSES — WHAT EACH ONE GUARDS

| Harness | Location | Guards |
|---|---|---|
| **`missionguard.js`** (114 checks) | **`verification/` — IN THIS REPO** | The whole mission: load integrity, routing, **regression on all five other topics**, answer leakage, full walkthrough, wrong-answer escalation, verb phrase, keyboard/focus, Study Guide, read-aloud, reduced motion, back/restart/exits, and a 14-viewport × 4-card responsive matrix |
| `bankguard.js` (19) · `respguard.js` (11) · `stateguard.js` (48) · `bank.js` (33) · `func.js` (19) · `q20.js` (31) · `exact.js` (16) · `checks.js` (26) · `place.js` | **NOT in this repo** — §12c of the 1.2.7 handoff says they live outside the project | bank engine · responsive/CSS lint · state leakage · Learn engine · Q20 integrity · plain→marked · Home/build/assets · placement |

> **The pre-1.3.0 harnesses could not be run for Build 1.3.0** — they are not in
> the repository. `missionguard.js` covers the same ground for the mission and
> re-verifies the regression surface, and it reimplements respguard's §E CSS lint
> rule and place.js's header→rail gap rule. **It is not a substitute for running
> the originals.** If you have them, run them against this branch.

To run the one that is here:

```powershell
cd C:\Sentence-Sense
node verification/serve.js . 8347     # terminal 1
node verification/missionguard.js ./out   # terminal 2 — needs puppeteer-core + Chrome
```

**Harness rules learned so far, all still true:**
- Bank choice buttons are shuffled — select by `dataset.ci`, never by position
  and never by rendered text.
- `.ss-words` is `align-items:flex-end`, so a marked chip and a plain word have
  different `top` values on one visual line. **Count row wraps by bottoms.**
- `.lesson-done` has a 0.25s `rise` entry animation; settle ~450ms before
  screenshotting completion.
- **New in 1.3.0:** `window.speechSynthesis` is a **getter-only** property. A
  plain assignment silently fails and the real API keeps running — stub it with
  `Object.defineProperty`.
- **New in 1.3.0:** do not "jump" to a mission card by force-enabling the advance
  button. That skips the state the card depends on. Walk the mission.

---

## 13. WORKING AGREEMENT

For every approved build:

1. Self-audit before delivery.
2. Provide the build audit `.md`, describing the shipped state consistently from
   beginning to end — never stale claims early with corrections appended.
3. Update this handoff. Current state only; no contradictory leftovers.
4. Increment the visible build number.
5. **Confirm the baseline from `js/app.js`, never from the branch name.**

### Delivery — CHANGED IN 1.3.0

Earlier builds were delivered as two ZIPs with a `GIT-COMMANDS.md`, and the
agreement said **"Never run Git."** **For Build 1.3.0 the owner explicitly
authorised committing and pushing to `claude/build-1.4` for review**, so the work
was pushed directly and no ZIP was produced.

Standing constraints for that authorisation, which were observed:

- **Do NOT merge into `main`.**
- **Do NOT force-push.**
- **Do NOT delete files** (see H-01 and H-02 — both left in place for this
  reason).
- **Do NOT deploy to the live site.**

If a future build reverts to the ZIP workflow, the five-line Git block and the
two-ZIP format in the 1.2.7 handoff still describe it.

Startup for the next session: read the code → read this handoff → read the latest
audit → reconcile all three → **code wins over stale documentation** → report any
new discrepancy **before** editing.

---

## 14. NEXT — NOT STARTED

- **An owner decision on P-01** — whether the 20-question bank returns to the UI.
- **Owner approval for H-01 and H-02** — deleting three superseded audits and the
  1.7 MB unreferenced logo.
- **Testing with an actual third grader (L-05).** Nothing else on this list
  matters as much.
- **Screen-reader testing (L-04)** and a non-Chromium pass (L-06), including
  read-aloud on iOS Safari.
- **The other five topics** — whether the Sentence Detectives pattern should
  extend to Subject, Complete Subject, Predicate, Noun and Adjective. The mission
  engine was written for Verb; generalising it needs approved content first, the
  same discipline the bank contract imposes.
- **Practice Mode**, **Break It Down Mode**, **Test Mode** — none designed.
- Scoring, timers, streaks, accounts, persistent progress, APIs, databases —
  none of these exist and none are planned for Learn.

---

*End of handoff. Last updated 2026-09-11 for Build 1.3.0.*
