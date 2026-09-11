# SENTENCE SENSE — AUDIT REPORT, BUILD 1.3.0

**Build:** Sentence Sense — Build 1.3.0
**Branch:** `claude/build-1.4`
**Baseline commit:** `cc1f102924ad4bb74166b1ac056005c3854380e3` — *Sentence Sense Build 1.2.7 — Harden guided bank engine and responsive layout* (2026-09-08)
**Scope:** Verb lesson only — an illustrated prototype, "Sentence Detectives"
**Date:** 2026-09-11

---

## 0. THE BASELINE, CONFIRMED

The working branch is named `claude/build-1.4`. **The branch name is not the
version.** At the point this work started, `claude/build-1.4`, `main` and both
remotes all pointed at the same commit, `cc1f102`, and `js/app.js` declared:

```js
const BUILD_NUMBER = "Build 1.2.7";
```

So the real baseline was **Build 1.2.7**, not 1.4. The working tree was clean —
there was no uncommitted work to preserve and nothing was overwritten.

This build is numbered **1.3.0**, which follows the 1.2.x history and matches
what the Build 1.2.7 handoff itself listed as next ("Build 1.3" in section 14).
It is deliberately **not** called 1.4 just because the branch is.

The number appears in all four required places:

| Place | Value |
|---|---|
| `js/app.js` | `const BUILD_NUMBER = "Build 1.3.0";` |
| rendered badge | `Sentence Sense — Build 1.3.0` *(verified in-browser, check 1.5)* |
| this audit's filename and heading | `AUDIT-REPORT-Build-1.3.0.md` |
| `SENTENCE-SENSE-HANDOFF.md` | updated |

---

## 1. WHAT CHANGED

### The brief, in one line

The Verb lesson was too text-heavy. **The interface and the directions are now
simpler. The sentences are not.**

### Architecture: additive, not a rewrite

`js/learn.js` runs ONE four-step lesson (Definition → Clue → Example → Try It)
for all six topics, driven by its `STEP_KEYS` array. The mission is a five-phase
illustrated sequence with word-level selection, scene swapping and a two-word
answer. Bending the shared runner into that shape would have put every topic's
code path at risk for the sake of one prototype.

So the mission is a **separate engine on its own screen**, and the five other
topics run through code that was not edited at all.

| File | Status | Role |
|---|---|---|
| `js/scenes.js` | **NEW** (29.4 KB) | Original inline-SVG artwork: 7 scenes, 4 detective moods |
| `js/data/mission-verb.js` | **NEW** (29.1 KB) | All mission content — sentences, per-word feedback, coaching, teaching records |
| `js/mission.js` | **NEW** (32.6 KB) | The five-phase mission runner |
| `css/styles.css` | +540 lines | New **Section 12**, appended. Sections 1–11 byte-identical |
| `index.html` | +57 lines | `#screen-mission` section + 3 script tags |
| `js/app.js` | +17 / −3 | Build number, `mission` screen registered, Escape handling, speech cancelled on Home |
| `js/learn.js` | +37 / −0 | Verb routing, `openGuideFor()`, speech cancelled on exit |
| `js/data/learn-content.js` | **UNCHANGED** | Not one byte. The 20-question bank is exactly as it shipped in 1.2.7 |

**Zero new binary assets.** Every illustration is inline SVG authored for this
project, so there is no licensing surface, no attribution requirement and no
download weight: the entire illustrated mission is ~91 KB of text in files that
were already being fetched. No new fonts, no CDN images, no icon library.

**Nothing was deleted.** No file was removed, and no existing content was
rewritten.

### The classic Verb lesson is still reachable

Opening Verb now opens the mission. Adding **`?verb=classic`** to the URL
restores the original four-step Verb lesson *including its 20-question guided
bank*, unchanged:

```
https://<site>/?verb=classic
```

This is not a child-facing feature and there is no link to it. It exists so the
bank engine stays exercisable rather than being orphaned by the prototype, and
so 1.3.0 and 1.2.7 behaviour can be compared in the same browser. Verified in
checks 2.3–2.5.

---

## 2. THE TEACHING SEQUENCE AS BUILT

Twelve cards. A visible five-stop rail: **Watch · Find · Explore · Solve ·
Extend**. No score, no percentage, no timer, no streak, no lives, no
leaderboard, nothing persisted.

| # | Card | Kind | Illustrated | What it does |
|---|---|---|---|---|
| 1 | Case file | briefing | detective | Two lines. Names the job. |
| 2 | Watch me work | reveal | soccer, animated | Models finding `kicked` |
| 3 | Your turn to find it | pick | stream | Guided practice |
| 4 | One more to find | pick | porch + puppy | Guided practice |
| 5 | Change the verb | swap | stream ×2 | `examined` / `collected` |
| 6 | Change it again | swap | lab ×2 | `measured` / `poured` |
| 7 | Solve it yourself | pick + why | **none** | Independent transfer + explanation |
| 8 | A verb with no action | reveal | teammates | Models the being verb `were` |
| 9 | Find the being verb | pick | **none** | Independent being verb |
| 10 | When the verb is two words | reveal | lab | Models the phrase `is measuring` |
| 11 | Find the whole verb phrase | pick ×2 | **none** | Independent verb phrase |
| 12 | Case closed | done | detective | Learning recap |

### A. WATCH — the child is never asked to guess first

Card 2 shows the brief's sentence, *"The determined player kicked the muddy ball
across the field,"* with a matching soccer illustration and one button:
**"Show me the verb."** Pressing it plays a 0.62s kick (leg swings, ball arcs),
marks `kicked` with the written label **VERB**, and says *"Kicked tells what the
player did."* then *"You can picture it happening, so kicked is an action verb."*
**Play it again** replays it.

Before the press, nothing is marked and no plain/marked pair exists
(checks 3.1, 4.R).

### B. FIND — guided practice with feedback that teaches

**Every word of the sentence is a real `<button>`.** Not a list of four answer
choices. This matters for two reasons: the tap target is large and keyboard
operation is free, and — more importantly — **a picture cannot tell you which
word in a sentence is the verb**, so the activity cannot be passed by looking at
the illustration instead of reading.

Feedback escalates and never punishes:

| Attempt | The child gets | Answer shown? |
|---|---|---|
| 1st wrong | what that exact word does in THIS sentence, then *"Have another look."* | no |
| 2nd wrong | that word's job, then the strategy clue | no |
| 3rd wrong | the reasoning modelled out loud, answer marked, card unlocks | yes |

A ruled-out word is disabled, recoloured **and struck through** — never colour
alone (check 5.7). Verified end to end in checks 5.1–5.9.

### C. EXPLORE — change the verb, change the meaning

Not a question. Neither verb is wrong, nothing is scored, and the engine records
no result. Choosing a verb fills the slot in the sentence **and swaps the
illustration**, so the child sees the consequence rather than being told about
it: `examined` leaves the rocks on the ground, `collected` puts them in a bucket
and visibly empties the ground. Both verbs must be tried, because the contrast
*is* the lesson; the closing line — *"Same students. Same rocks. One word
changed, and a different thing happened."* — appears only after both.

### D. SOLVE — independent transfer, then an explanation

No illustration at all. Nothing pre-marked. After the verb is found, a required
follow-up asks **"Now prove it. Why is blocked the verb?"** with four choices.
The advance stays locked until the child gives the reason (check 4.W). Choices
are shuffled at render time and identified by original index, never by rendered
text — the same protection `js/learn.js` gained in D-29/D-36.

### E. EXTEND — and the ambiguity the brief warned about

Four segments, one idea each, in **model → practice** pairs.

The brief's rule was explicit: *do not ambiguously ask for "the verb" when the
expected answer is a multiword verb phrase; teach that distinction before
assessing it.* As built:

- Card 10 **teaches** it: `is measuring` is marked as ONE verb under ONE label
  **VERB PHRASE** with ONE continuous underline, and the text says *"Two words
  working as one verb are called a verb phrase. When a sentence has a verb
  phrase, the whole phrase is the verb."*
- Card 11 **then** assesses it, and the prompt reads: *"This sentence has a verb
  phrase. Click **BOTH** words that make the complete verb."* A live counter
  shows `1 / 2 chosen`.
- Choosing only the main verb is treated as **progress, not an error** — no
  attempt is counted, nothing is marked wrong, and the child is told *"One more
  word belongs with it."*

Checks 6.2, 6.3, 6.4 and 6.9 verify the prompt wording, that the concept is
taught on an earlier card, that a partial answer costs nothing, and that the
phrase renders as one verb.

The lesson also never implies all verbs are movement: card 8's illustration
deliberately shows three teammates **standing still**, and the coach says
*"Nobody in this sentence is running, throwing or jumping. There is still a
verb."*

### Completion is not a mastery claim

*"Case closed!"* gives a VERB DETECTIVE badge, a four-line recap of what verbs
do, and then, in deliberately quieter type: *"You worked through all five parts
of this case. Detectives get sharper every time they read a new sentence, so
come back and work it again."* No score, no percentage, no streak, and the word
"mastered" appears nowhere (checks 4.4, 4.5).

---

## 3. SENTENCE-BANK REVIEW

Ten sentences, all new. **No reading level or Lexile measure is claimed** — none
has been measured by any instrument. "Middle-to-upper third grade" is the
authoring target, not a certified result.

| Card | Sentence | Words | Verb | Index | Type |
|---|---|---|---|---|---|
| Watch | The determined player kicked the muddy ball across the field. | 10 | kicked | 3 | action |
| Find 1 | Beside the stream, several curious students examined the colorful rocks. | 10 | examined | 6 | action |
| Find 2 | The curious puppy discovered a muddy ball under the wooden porch. | 11 | discovered | 3 | action |
| Explore 1 | Beside the stream, several curious students ____ the colorful rocks. | 10 | examined / collected | 6 | action |
| Explore 2 | The young scientist ____ the cool water very carefully. | 9 | measured / poured | 3 | action |
| Solve | During the final minute, the determined goalie blocked a powerful shot. | 11 | blocked | 7 | action |
| Extend 1 | Our exhausted teammates were proud of their effort after practice. | 10 | were | 3 | being |
| Extend 2 | After the final bell, the long hallway was empty. | 9 | was | 7 | being |
| Extend 3 | The young scientist is measuring the water inside the glass container. | 11 | is measuring | 3+4 | phrase |
| Extend 4 | This week, the determined swimmers are training for the district meet. | 11 | are training | 5+6 | phrase |

**Findings from reviewing the bank:**

1. **Verb position is varied on purpose: 3 · 6 · 3 · 7 · 3 · 7 · 3+4 · 5+6.**
   This was an active risk, not a happy accident. Build 1.2.7 closed D-29
   because the old bank's correct answer sat in position 3 in 16 of 20
   questions, so a child could clear it by pressing the third button. The same
   hazard exists in a new shape here — if the verb were always the fourth
   *word*, "press the fourth word" would beat the lesson. Four of the ten
   sentences open with a prepositional or time phrase specifically to break
   that. A note in `mission-verb.js` records the rule for whoever adds card
   eleven.

2. **Both being-verb sentences obey the rule bought with Verb Q20 in 1.2.6.**
   The handoff records that `was crowded` allowed a passive reading and had to
   be changed. Here the predicate adjectives are **`proud`** and **`empty`** —
   neither has a participle form, so `were proud` and `was empty` have only the
   linking reading. `empty` is on the handoff's own safe list.

3. **`determined` appears three times, and twice as a distractor next to the
   answer.** This is intentional: it ends in `-ed`, which the Verb lesson
   teaches as a clue for verbs, so a child who over-applies the ending rule will
   pick it. Its feedback says what it actually does. The lesson's own Study
   Guide already teaches that "an ending is a clue, not a rule."

4. **Every pickable word carries its own feedback** — 10 to 11 strings per card,
   including `the`, `a`, `beside` and `during`. A harness check enforces
   `notes.length === words.length`, so a word can never be selected and produce
   silence.

5. **Correct answers get teaching, not just praise.** EEF's guidance is that
   feedback matters most when the answer is *right*, so every correct pick
   explains: *"Yes. Discovered tells what the puppy did — it found something
   that was hidden."* Praise is brief and aimed at the thinking, never at the
   child ("Nice thinking", never "You're so smart") — feedback about the person
   is the least effective kind.

6. **No scene description names its own verb.** An automated check compares each
   `sceneAlt` against its target word: a screen-reader user must not be handed
   the answer that a sighted user has to work out.

7. **Vocabulary was kept rich but not obscure**: *determined, curious,
   exhausted, colorful, muddy, powerful, district*. The exercise is grammar, not
   vocabulary.

---

## 4. TESTS ACTUALLY PERFORMED

**114 automated checks, all passing, executed against real Google Chrome**
(v141, headless) driving the served repository through `puppeteer-core`. These
are not reasoned assertions — every one drove the running app.

The harness and its raw output are committed:

```
verification/missionguard.js         the harness
verification/serve.js                static server
verification/results.json            114 results, machine-readable
verification/responsive-matrix.json  56 viewport × card measurements
verification/screenshots/            33 captured screenshots
```

To re-run: `node verification/serve.js . 8347` then
`node verification/missionguard.js ./out` (needs `puppeteer-core` and Chrome).

| Group | Checks | Covers |
|---|---|---|
| 1. Load integrity | 6 | no page errors, all globals, build number in two places, both storages empty |
| 2. Routing + regression | 8 | Verb → mission; **all five other topics still run the four-step lesson**; `?verb=classic`; the 20-question bank still loads and counts |
| 3. Answer leakage | 5 | nothing marked before a reveal; scene text never names the verb; independent cards carry no scene at all |
| 4. Full walkthrough | 26 | all 12 cards, every correct path, no bare "Next" label anywhere, completion wording, nothing persisted |
| 5. Wrong-answer escalation | 9 | 1st/2nd/3rd attempt behaviour, answer stays hidden for two attempts, struck-through ruled-out words, sentence stays visible |
| 6. Verb phrase | 9 | prompt says BOTH; taught before assessed; partial ≠ error; one label, one underline |
| 7. Keyboard + focus | 6 | heading focus on entry, Tab reaches words, visible ring, Enter selects, focus never dropped to `<body>` |
| 8. Study Guide | 8 | opens from mission, correct topic, focus trap **both** directions, Escape, focus returns, Escape exits mission |
| 9. Read aloud | 6 | never autoplays, speaks plain sentence only, no label text, cancelled on leaving |
| 10. Reduced motion | 5 | no replay button, animation suppressed, trail hidden, reveal still works, **mission still completable** |
| 11. Back / restart / exits | 8 | Back disabled at card 1, state cleared on step-back, All Topics, re-entry restarts, Home |
| 12. Responsive | 5 | 14 viewports × 4 card shapes = 56 samples |

### Responsive results

| Measure | Result |
|---|---|
| Horizontal overflow | **0** of 56 samples |
| **False-bottom states** | **0** — every below-fold case has visible continuation at the fold |
| Below-fold primary action | 8 of 56, **all phones**, all with continuation |
| Desktop / laptop / tablet | **0** below-fold — the primary action is in view at every sample ≥1024×600 |
| Header→rail gap | **14px, constant at every viewport** (handoff 12b threshold is ≤60px and constant) |
| Non-monotonic width pairs | **0** — a wider viewport is never vertically worse at the same height |

Viewports: 2560×1440, 1920×1080, 1600×900, 1440×900, 1366×768, 1280×720,
1600×720, 820×1180, 1024×768, 430×932, 390×844, 375×667, 360×640, 844×390.

Phone scrolling is normal and is not treated as a defect — that matches the
project's existing position on D-27. What was eliminated is the narrower
problem: a required control sitting just below the fold on a page that otherwise
looks finished.

### Webfont — a standing limitation closed

**L-01 has been open in every audit so far** ("the real webfont has never been
measured here — the sandbox blocks the Google Fonts CDN"). This environment has
network access, so it was measured directly:

```
200 https://fonts.googleapis.com/css2?family=Baloo+2...
200 https://fonts.gstatic.com/s/baloo2/v23/wXKrE3kTposypRyd51jcAA.woff2
200 https://fonts.gstatic.com/s/nunito/v32/XRXV3I6Li01BKofINeaB.woff2
document.fonts.status = "loaded" · 36 faces
document.fonts.check('700 1rem "Baloo 2"') = true
```

**All layout measurements and all screenshots in this audit were taken with the
real Baloo 2 and Nunito webfonts rendering**, not a fallback. L-01 is closed for
this build.

---

## 5. DEFECTS FOUND AND FIXED DURING THIS BUILD

Found by the harness or by inspecting screenshots, and fixed before delivery.
Recorded because the fixes are the interesting part of the work.

| ID | Defect | Sev | Resolution |
|---|---|---|---|
| **M-01** | `.app-header` is a CSS **grid**, and every variant declares its own `grid-template-columns`. `.header-mission` had none, so grid fell back to one column and the five header children stacked: the header measured **246px tall** at 1366×768 and pushed the primary action below the fold. | 2 | **FIXED.** Template now matches `.header-lesson` exactly. |
| **M-02** | Ending punctuation rendered on its own line — `stream,` displayed as "stream" with a comma stranded underneath. `.mi-word` is a column so the label can sit above the word; text and punctuation needed their own row inside it. | 2 | **FIXED.** `.mi-word-body` wrapper. |
| **M-03** | **A D-28 recurrence in a new place.** The mission's `min-width:1600px and min-height:900px` type step made a *wider* viewport *vertically worse*: 1600×900 scrolled 974px where 1440×900 scrolled 947px. The mission card carries an illustration the lesson does not, so 900px of height does not afford larger type here. | 2 | **FIXED.** Guard raised to `min-height:1000px` — the measured threshold for this card. Check 12.5 now passes. |
| **M-04** | False-bottom states: the primary action sat 59–107px below the fold on 1366×768, 1280×720, 1600×720 and 1024×768, and 28–67px below on small phones, with nothing straddling the fold. | 2 | **FIXED.** Two measured short-viewport blocks plus a narrow-and-not-tall block. Type and 44px tap targets shrink last; spacing and illustration height give way first. |
| **M-05** | Dead code: `back()` contained a `leave()` branch at position 0 that was unreachable because the Back button is disabled there. An unreachable path is what D-33 warns about. | 4 | **FIXED.** Branch removed, behaviour documented. |
| **M-06** | The two stream scenes drew the children from y=130 with the water at y=198, so they read as standing waist-deep in the stream rather than kneeling on the bank. | 3 | **FIXED.** Water lowered, figures redrawn kneeling, and scaled up so they fill the frame. |
| **M-07** | On "Case closed!" the rail still showed **Extend** as the current step, implying work remained there. | 4 | **FIXED.** All five stops render as done on the completion card. |

Two harness bugs were also found and fixed; neither was an application defect.
`window.speechSynthesis` is a getter-only property, so the test's plain
assignment silently failed and the real API kept running (`Object.defineProperty`
was required); and a "jump to card" shortcut force-enabled the advance button
instead of walking the mission, which skipped the state the card depends on.

---

## 6. KNOWN ISSUES AND UNVERIFIED ITEMS

### Carried forward, unchanged by this build

**D-27** (control visibility on short viewports), **D-26** (build badge below
fold), **D-20** (abstract nouns undemonstrated), **D-35** (guide background not
`inert`) all remain open exactly as recorded in Build 1.2.7. None was touched,
and none regressed — the mission's own responsive results are reported in
section 4 and are clean on desktop, laptop and tablet.

### Standing limitations

| ID | Status |
|---|---|
| **L-01** real webfont never measured | **CLOSED for this build.** Measured, loaded, rendered — see section 4. |
| **L-02** device testing is simulated | **Still true.** 14 viewports in Chrome DevTools emulation. No physical phone or tablet. |
| **L-03** no classroom projector | **Still true.** 2560×1440 measured in emulation only. |
| **L-04** no screen-reader testing | **Still true.** ARIA roles, labels, live regions and a two-way focus trap are all implemented and the focus trap is tested programmatically, but **no actual screen reader was run.** |
| **L-05** no testing with a child | **Still true, and it is the most important gap in this document.** Whether a third grader finds this engaging, whether the sentences are the right difficulty, and whether the detective framing lands are all questions this audit cannot answer. |
| **L-06** Chromium only | **Still true.** Chrome 141 only. No Firefox, no Safari, no iOS. |

### Specific to this build

1. **Read-aloud is untested outside Chrome on Windows.** It uses the browser's
   built-in `speechSynthesis` — no paid service, no network, no account — but
   voice availability and quality vary by operating system, and **iOS Safari
   requires a user gesture and behaves differently.** The control is hidden when
   the API is absent. Behaviour was verified with a stubbed synthesiser, so what
   is proven is *which text is sent and when*, not how it sounds.

2. **The animation was verified as running and as suppressed, not as pleasant.**
   Check 10.2 confirms `animationName: none` under reduced motion and the
   screenshots show start and end frames, but nobody has judged whether the
   0.62s kick reads well in motion to a child.

3. **The 20-question guided bank is no longer reachable from the Verb card** —
   only via `?verb=classic`. It is intact and tested, but a child using the app
   normally will not meet it. **This is a product decision that needs your
   ruling**: the mission replaces it, or the two should coexist behind some
   child-facing choice.

4. **The existing harnesses could not be run.** `bankguard.js`, `respguard.js`,
   `stateguard.js`, `bank.js`, `func.js`, `q20.js`, `exact.js`, `checks.js` and
   `place.js` are described in handoff section 12c as living *outside* the
   project, and they are not in this repository. I could not execute them.
   `verification/missionguard.js` was written to cover the same ground for the
   mission and to re-verify the regression surface, and it reimplements
   respguard's §E CSS lint rule and place.js's header→rail gap rule. **It is not
   a substitute for running the originals**, and if you have them, they should
   be run against this branch.

5. **Four superseded audit reports are still in the repository** —
   `AUDIT-REPORT-Build-1.2.3.md`, `-1.2.4.md`, `-1.2.5.md`, and now
   `-1.2.7.md`, which this build supersedes. Handoff section 13
   says one audit should exist at a time and the old ones should be `git rm`'d.
   **I did not delete them**, because your brief requires approval before
   deleting files. Say the word and they go in the next commit.

6. **`assets/Sentence-Sense_logo.png` is 1.7 MB and unreferenced.** Nothing in
   `index.html`, `css/` or `js/` links to it; the app uses
   `assets/images/logo.png`. It is 66% of the repository's asset weight and
   loads for nobody. **Not deleted** — same reason. Recommend removal.

7. **Punctuation attached to words is a deliberate simplification.** `stream,`
   is one selectable token, not `stream` + `,`. A child clicking it gets
   feedback about `stream`. This matches how `js/learn.js` already models
   sentences and is almost certainly right for this age, but it is a modelling
   choice worth naming.

8. **Not measured for readability.** See section 3. No instrument was run.

---

## 7. EVIDENCE INFORMING THE DESIGN

All three sources were retrieved and read. Two needed a workaround: the EEF page
returns HTTP 403 without a browser user-agent, and PubMed's interstitial
required the NCBI E-utilities API instead of the web page.

**IES / WWC — *Organizing Instruction and Study to Improve Student Learning***
Recommendation 2, *interleave worked examples with problem-solving* (Moderate):
the mission alternates worked example and practice four times — WATCH then FIND,
model then try for being verbs, model then try for verb phrases.
Recommendation 3, *combine graphics with verbal descriptions* (Moderate): every
illustration is paired with the explanation it belongs to, never shown alone.
Recommendation 7, *ask deep explanatory questions* (**Strong**): the SOLVE card
requires the child to say *why* the word is the verb, not only which word it is.

**EEF Teaching and Learning Toolkit — *Feedback*** (+6 months, +7 for primary,
high impact / very low cost / extensive evidence). Two findings shaped the copy
directly: effective feedback focuses on **the task, the subject and the
strategy**, and feedback about the person is the least effective kind — so
praise here is brief and aimed at the thinking; and **it is important to give
feedback when work is correct**, not only when it is wrong — so every correct
answer is explained rather than merely ticked. The toolkit also notes digitally
delivered feedback has a smaller effect (+4 months) than teacher feedback, which
is a reason for modesty about what this prototype achieves.

**Takacs, Swart & Bus (2015),** *Benefits and Pitfalls of Multimedia and
Interactive Features in Technology-Enhanced Storybooks: A Meta-Analysis*,
*Review of Educational Research* 85(4), 698–739. 43 studies, 2,147 children.
Story comprehension g+ = 0.17, expressive vocabulary g+ = 0.20. The load-bearing
finding is the split: **multimedia features that illustrate the text helped,
while interactive elements — hotspots, games, dictionaries — distracted**, and
were *most* harmful to children from less stimulating home environments. That is
why there is no minigame, no reward animation, no clickable scenery and no sound
effects here: **every interaction in this mission is the learning task itself.**
The scene swap in EXPLORE is tied to the word the child changed — it is the
explanation, not a reward.

**On not overstating this.** The detective framing is a design hypothesis, not a
research-proven intervention; nothing here tests it. The storybook meta-analysis
concerns young children's literacy from digital storybooks, **not third-grade
grammar instruction**, so it transfers as a caution about interactive clutter,
not as evidence that this lesson works. The IES and EEF evidence is about
instructional moves in general, not about this implementation of them. **No
claim is made that this build improves learning outcomes. It has not been
measured with a child** (L-05).

---

## 8. HOW TO OPEN AND TEST THE PROTOTYPE

It is a static site. No build step, no install, no server required for normal
use.

**Quickest:** open `index.html` in Chrome, click **Start Learning**, then
**Verb**.

**Over a local server** (matches how the audit ran):

```powershell
cd C:\Sentence-Sense
node verification/serve.js . 8347
# then open http://127.0.0.1:8347/
```

**What to look at, in the order it matters:**

1. **Watch** — press *"Show me the verb."* Watch the kick, then the reveal, then
   the READ IT / SEE HOW IT WORKS pair.
2. **Find** — deliberately click a wrong word three times. The first two
   responses must explain the word you picked and withhold the answer; the third
   must model the reasoning and unlock the card.
3. **Explore** — press both verbs and watch the picture change.
4. **Solve** — confirm there is **no picture**, nothing is pre-marked, and you
   are asked *why* after you find the verb.
5. **Extend** — cards 10 and 11 are the ones to scrutinise: the phrase is taught
   before it is asked for, and the prompt says **BOTH**.
6. **Keyboard only** — Tab through a FIND sentence and press Enter. Then open
   the Study Guide and try to Tab out of it.
7. **Reduced motion** — Windows: *Settings → Accessibility → Visual effects →
   Animation effects off*. The replay button should disappear and the lesson
   should still make complete sense.
8. **Phone width** — narrow the window to ~390px.
9. **Regression** — open **Noun**, **Subject**, **Predicate** etc. and confirm
   they are exactly as they were.
10. **The old bank** — `http://127.0.0.1:8347/?verb=classic`, then Verb → Next
    ×3.

---

## 9. WHAT WAS NOT DONE, DELIBERATELY

- No other topic was touched. Subject, Complete Subject, Predicate, Noun and
  Adjective are unchanged and unreviewed.
- Practice, Break It Down and Test remain placeholders.
- No framework was introduced. No build step, no bundler, no dependency. The
  site is still plain HTML, CSS and ES5-compatible JavaScript.
- No runtime AI, no paid API, no analytics, no account, no storage, no network
  call beyond the pre-existing Google Fonts stylesheet.
- Nothing was merged to `main`. Nothing was force-pushed. Nothing was deleted.
  The live site is untouched.

---

*End of audit. Build 1.3.0, branch `claude/build-1.4`, baseline `cc1f102`.*
