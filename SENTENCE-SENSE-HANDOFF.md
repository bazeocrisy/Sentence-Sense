# SENTENCE SENSE — PROJECT HANDOFF

**Current build: Sentence Sense — Build 1.4.0**
**Last pass:** Simplified product redesign — skill-first navigation — 2026-09-20
**Repository:** `C:\Sentence-Sense` → GitHub Pages · static · $0 recurring
**This file describes the CURRENT shipped state only. Read it first.**

---

## 0. VERB STATUS — THE REFERENCE IMPLEMENTATION

| | |
|---|---|
| **Learn** | **LOCKED** |
| **Practice** | **LOCKED** |
| **Dynamic Test** | **LOCKED** |
| **Verb Test v1 forensic audit** | **PASSED** — `FORENSIC-AUDIT-VERB-TEST.md` |
| **Dynamic Test forensic audit** | **PASSED** — `FORENSIC-AUDIT-VERB-DYNAMIC-TEST.md` |

**Verb remains the reference implementation for Subject, Noun and Adjective.**

Build the remaining three against Verb, not against an idea of what they
should be. In particular, copy these decisions rather than re-deriving them:

- **Learn teaches, Practice coaches, Test measures.** Those are three
  different jobs and they must not blur. Practice escalates help on a wrong
  answer; Test gives none at all. That is why `js/practice.js` and
  `js/test.js` are separate engines and must stay separate.
- **Whatever Learn teaches, Practice must coach and Test must measure.**
  Verb's being verbs were taught, then barely practised, then crammed into
  the last stage. The alignment matrix in the forensic audit is the check
  that catches this; run it for every new skill.
- **Every concept in a Test must already be taught.** A stative verb reached
  the Verb Test draft and had to be removed: a child taught only DOES and IS
  had no route to it.
- **Mastery is a conjunction, not an average.** A strong score on one half
  must never hide a weak score on the other.
- **A test must sample, not repeat.** A fixed set of questions eventually
  measures memory of the test rather than mastery of the skill. Verb draws a
  balanced assessment from a larger curated pool — see §6b.
- **A green harness is not proof.** Two of the four Verb Test v1 defects were
  invisible to every automated check and were found by looking at rendered
  screenshots. The dynamic-Test defect D-A1 was invisible to every check that
  existed and was found only by writing a probe for the invariant itself.
  Always look, and always test the rule rather than its symptoms.

Adding a skill should be a CONTENT change. Subject, Noun and Adjective each
need a `tryItBank`, a `testPool`, and their `practice` / `test` flags set to
`"bank"` and `"pool"`. No code change is required for any of it.

---

## 1. WHAT THIS PROJECT IS

Sentence Sense teaches an elementary student — target **3rd grade, ages 8–10** —
how a sentence works. Static site: no database, no API, no accounts, no server
state, no build system. The only external request is the Google Fonts CDN.

Four governing rules:

> **ONE SCREEN. ONE SKILL. ONE OBVIOUS THING TO DO.** *(the 1.4.0 rule)*
> Difficulty comes from the SENTENCE, never from the interface.

> **CHOOSE THE SKILL FIRST.** *(new in 1.4.0)*
> Home is four skills. The child picks what to learn, then how to learn it.

> **READ IT, then SEE HOW IT WORKS.**
> A child meets a sentence as a sentence before meeting its grammar.

> **SIMPLIFY THE INTERFACE, NOT THE READING LEVEL.**
> Fewer words of instruction, shorter directions, one obvious action — and
> sentences that stay worth reading.

---

## 2. BUILD NUMBERING — EVERY PUSH GETS A NEW NUMBER

Current: **Build 1.4.0**. It must match in four places, and the audit checks all four:

1. `js/app.js` — `const BUILD_NUMBER = "Build 1.4.0";`
2. the rendered badge — `Sentence Sense — Build 1.4.0`
3. the audit file name and heading
4. this handoff

> **A BRANCH NAME IS NOT A VERSION.** Build 1.3.0 *and* Build 1.4.0 were both
> developed on a branch called `claude/build-1.4`. Always read `js/app.js` to
> learn what the code actually is.

---

## 3. FILE MAP

| File | Role | Lines |
|---|---|---|
| `index.html` | Four screens: home, skill, learn, practice | 298 |
| `css/styles.css` | Every style, phone-first, numbered sections 1–13 | 1225 |
| `js/app.js` | Shell: Home, the shared Skill screen, routing, icons, build badge | 353 |
| `js/sentence.js` | **NEW 1.4.0** — the shared sentence renderer | 226 |
| `js/learn.js` | The shared four-state LEARN component | 385 |
| `js/practice.js` | **NEW 1.4.0** — the shared PRACTICE question engine | 370 |
| `js/test.js` | **NEW 1.4.0** — the shared TEST engine: pool sampling, dynamic scoring. Separate from Practice on purpose. | 446 |
| `js/data/learn-content.js` | All content for all six topics, plus card fields | 1031 |
| `assets/images/favicon.png` | Referenced by `index.html` |
| `assets/images/sentence-sense-hero.jpg` | The classroom banner photograph. 2048×768, 169 KB. |
| ~~`assets/images/logo.png`, `logo-512.png`~~ | **DELETED in 1.4.0.** Unreferenced; the cartoon-mascot lockup contradicted the art direction. See §11 H-03. |
| `assets/reference/home-screen-mockup.png` | The approved style reference. Not loaded by the site. |
| `verification/serve.js` · `verification/guard.js` | Dev harness. Not part of the site. |
| `AUDIT-REPORT-Build-1.4.0.md` | The current build audit — and the only one |
| `SENTENCE-SENSE-HANDOFF.md` | This file |

Script load order in `index.html` matters:
`learn-content` → `sentence` → `learn` → `practice` → `test` → `app`.
`js/app.js` calls `init()` on all three components and must load last.

---

## 4. THE PRODUCT MODEL

```
HOME  →  SKILL  →  LEARN | PRACTICE | TEST  →  ACTIVITY
```

The child chooses **what** before **how**. The mode-first portal of Builds
1.0–1.3 is retired.

### Home — four skills, nothing else

| Skill | Child clue | Practice | Test |
|---|---|---|---|
| **Verb** | What is happening? | 20-question bank | **12 / 20 / 30 from a 48-question pool** |
| **Subject** | Who or what? | coming next | coming next |
| **Noun** | Names a person, place, thing, or idea. | coming next | coming next |
| **Adjective** | Describes a noun. | coming next | coming next |

Home contains: the banner (wordmark, "Build stronger sentences.", "Choose a
skill to start learning.", and a non-interactive *3rd Grade ELA / Aligned with
Georgia Grade 3 ELA Standards* badge), the `Choose a skill` head with its
subtitle, the four cards, and a one-line closing quote strip.

Home contains **no** achievements, progress dashboard, settings, login, profile,
avatar, goal widget, points, coins, streaks, leaderboard, or a fifth skill. A
harness check enforces that list by string search.

**The card is a container; the button is the only control.** Exactly one tab
stop and one click target per skill, so the child learns a single rule.

### The classroom banner

Home opens with a full-width banner carrying the wordmark and headline on the
left and the standards badge on the right, then `Choose a skill` with its
subtitle, the four cards, and a one-line closing quote strip. This matches the
approved reference image.

**The photograph is supplied and installed:**
`assets/images/sentence-sense-hero.jpg`, 2048 × 768 (8:3), 169 KB, no baked-in
text. `js/app.js` probes it with an `Image` object and adds `.has-photo` only
once it genuinely loads, so the page can never show a broken image box and a
replacement is a drop-in with no code change. Check **2.13b** asserts it loads.

**Two layouts, on purpose.** Both children sit in the right half of the frame,
so one layout could not serve both screens:

- **Phone (< 620px): the photo is a BAND ABOVE THE TEXT.** An 8:3 banner at
  358px wide is only 134px tall; overlaying type there leaves the children tiny
  *and* the text cramped. Stacked, the children get real height and the wordmark
  sits on solid ground, so legibility never depends on the photograph.
- **≥ 620px: the photo fills the banner and the text overlays it**, behind a
  left-to-right white scrim that keeps navy type above WCAG AA.

This is measured, not assumed: check
`11.home.<viewport> banner headline stays legible over the photo` reports
*stacked, no overlap* on the three phone widths and *overlay + scrim* on the six
larger ones, and fails if text ever overlaps the photo with no scrim.

**Any replacement photo must carry no baked-in text.** The wordmark, headline
and badge are live text drawn over it; printed text would double up and collide
at phone widths. See `ASSETS-NEEDED.md` for the full specification.

**The standards badge sits in the text column, under the sub-line.** The
reference put it top-right over a blank whiteboard; this photograph has a child
there, and no corner of it is reliably clear of both children. Inside the text
column it is guaranteed clear space at every width.

**The scrim is confined to the text area.** It fades to fully transparent by 56%
of the banner, so the boy's face at roughly 56% keeps its natural contrast. If
the text column is ever widened, widen the scrim with it — not past it.

The closing quote strip carries the quote and the
**Learn · Practice · Improve · Grow** row from the reference. Both are
**decoration**: no link, no control, no tab stop, and the row is `aria-hidden` so
a screen reader is not offered four dead words. **Do not turn the row into
navigation** — pressing those words would go nowhere, and a dead control is worse
than no control. It sits beside the quote at 620px and up and wraps below it on
phones.

### Skill screen — ONE component, all four skills

It is a smaller Home, deliberately: the same wordmark, the same card shapes, the
same button, and **the skill's own icon and colour carried over from the card the
child just pressed**, so they can see where they have arrived.

A tinted hero band names the skill and repeats its clue, then three activity
cards — Learn, Practice, Test — each with a large icon, its title and its short
explanation. Three across from 620px, stacked on phones, content top-aligned.

**ONE way back.** The screen previously carried a "Back to Home" button *and* a
"Home" button that did exactly the same thing. Check **3.9** now enforces that
there is exactly one.

**An unavailable activity is not a control.** Its card is neutral grey with a
dashed edge, a muted icon and a written **Coming next** label — and nothing to
press. A dead button that goes nowhere is worse than no button: it invites a tap
and answers with silence. Check **3.4** enforces the label *and* the absence of a
control.

**The "coming next" SCREEN was removed.** Once an unavailable activity stopped
being a control, nothing routed to that screen and it was dead architecture. Its
HTML, CSS, routing and handlers are gone.

---

## 5. LEARN — four states, one screen

| State | Source |
|---|---|
| **What is it?** | `topic.definition` |
| **How do I find it?** | `topic.clue` + the folded-in reference material |
| **Show me** | `topic.example` |
| **Let me try** | `topic.learnTry`, or `topic.tryIt` |

All four skills run this. A wrong answer explains what that word actually does
**in this sentence** and invites another look — never "Wrong. Try again."

### The Study Guide modal is gone

Build 1.4.0 removed the overlay, its two-way focus trap and its header button.
**This closes D-35 by deleting the architecture the defect lived in.** The useful
material — the action-verb and being-verb word lists, the `-s`/`-ed`/`-ing`
ending clues, and the "same word, two jobs" contrast — is now plain content
inside **How do I find it?**, collapsed behind one `<details>` so the state stays
short. A `<details>` is keyboard-operable and announces its own state with no
script and no focus trap.

No separate recap screen was created to hold it.

---

## 6. PRACTICE — the 20-question Verb bank, reachable normally

**Home → Verb → Practice.** The `?verb=classic` query route is **gone**, and with
it the hidden duplicate child experience it created. P-01 is closed.

Everything the bank was built to guarantee is preserved and checked:

- 20 questions, four stages of five; stages stay in order
- questions shuffled **inside** each stage
- **choices shuffled at render time** (D-29 — before 1.2.7 the answer sat in
  position 3 in 16 of 20 questions and a child could clear the bank by pressing
  the third button)
- **answer identity is `dataset.ci`**, never rendered text (D-36)
- the recap is **content**, not engine wording (D-30)
- escalation: 1st wrong → what that word does here · 2nd → the clue · 3rd →
  guided reveal, then the child moves on
- **nothing auto-advances**; no score, no timer, no streak, nothing stored

**New in 1.4.0: "Need a clue?"** The child may ask for the clue instead of
guessing for it. Asking is not an error — no attempt is counted and nothing is
marked wrong.

A skill runs Practice only if its content carries a `tryItBank`. Otherwise it
gets the honest placeholder. **No bank was invented for Subject, Noun or
Adjective.**

---

## 6b. TEST — a balanced sample from a 48-question pool

**Home → Verb → Test.** A separate engine, `js/test.js`, because Practice and
Test are defined by opposite behaviour and the one thing that makes Practice
valuable is the one thing a test must never do.

**During the test there is no hint, no clue, no retry, no escalation and no
correctness signal of any kind.** A selected choice carries `.is-picked` and
`aria-pressed` and nothing else — never a colour, icon or label that differs
between a right and a wrong choice. The forensic audit compared 17 computed
style properties, every attribute, every `dataset` key, `innerHTML`,
`aria-label`, `title` and real keyboard focus across four choices on twelve
questions and found them identical. Picking a wrong answer is
indistinguishable from picking a right one.

### The question pool

| | |
|---|---|
| Questions | **48**, ids `V001`–`V048` |
| Split | **32 action · 16 being** (66.7% / 33.3%) |
| Bands | **1** confidence · **2** look closer · **3** strongest reasoning |
| Per band | 16 each — b1 11A/5B · b2 11A/5B · b3 10A/6B |
| Being forms | all five present — `am` 2 · `is` 4 · `are` 4 · `was` 4 · `were` 2 |

This bank is the **educational source of truth**. Sentences, choices, answers,
tags and `why` lines are owner-supplied and approved as a unit. Do not reword,
improve, extend or silently correct them while editing engine code. If content
looks wrong, STOP, name the question id, and ask.

### Child-facing test lengths

**12 · 20 · 30.** The child chooses; 12 is preselected. The selector shows
numbers only. An adjective like *Standard* or *Full Review* would imply the
other lengths are odd or incomplete, and longer must never read as harder —
which is true here, because the band proportions and the action/being ratio
are identical at every length. The helper line says so in as many words.

### 40 IS BUILT AND MUST STAY HIDDEN

The engine supports 40 and the harness and audit both cover it. **It is not
offered to the child, and must not be until the pool grows to roughly 80
fully audited questions.**

At 48 questions a 40-question sitting consumes 83% of the pool and is partly
deterministic: band 1 needs five being questions and the pool holds exactly
five, so **V002, V004, V007, V010 and V013 appeared in all 3,000 audited
draws**. Retest freshness collapses to 20% — 32 of 40 questions repeat. That
is precisely the failure the dynamic Test was built to remove, so shipping 40
would undo the work.

Unlocking it is a one-array edit in content:
`testPool.sizes` drives the selector, `testPool.sizesBuilt` drives the engine,
harness and audit. Move `40` from the second to the first only after the pool
expands. No code change is needed.

### Sampling — blueprint first, randomness second

- approximately **2/3 action, 1/3 being** at every length
- **band 1 → band 2 → band 3**, always, so every sitting runs easy → hard
- **shuffle WITHIN a band only**, never across
- **no duplicate question inside one sitting**, ever
- an exact per-band action/being cell count, not an average

| Length | Band 1 | Band 2 | Band 3 | Action | Being |
|---|---|---|---|---|---|
| **12** | 4 (2A/2B) | 4 (3A/1B) | 4 (3A/1B) | 8 | 4 |
| **20** | 7 (4A/3B) | 7 (5A/2B) | 6 (4A/2B) | 13 | 7 |
| **30** | 10 (6A/4B) | 10 (7A/3B) | 10 (7A/3B) | 20 | 10 |
| **40** *(gated)* | 14 (9A/5B) | 13 (9A/4B) | 13 (9A/4B) | 27 | 13 |

The being remainder goes to the **earliest** band, never the last. Piling being
verbs into band 3 would make the being subscale report weakness that is really
band-3 difficulty. At 12 this reproduces the original fixed test exactly.

A bounded coverage repair then tops up any thin concept family (suffix-s,
suffix-ed, suffix-ing, plural-s, noun/verb double duty) by swapping within the
same band+type cell, so the blueprint stays exact by construction. It is a
floor, not the mechanism — the balanced draw met every quota unaided in 12,000
audited draws.

### Recent-question avoidance — sessionStorage, IDs only

```
ss.test.recent.verb   {"v":1,"ids":["V004","V016", ...]}
```

No score, no name, no timing, no personal data. Written at **submission**, so a
child who opens a test and walks away does not burn the next sitting's
freshness. Every read and write is wrapped: storage throws in some private
modes, and a throw degrades to no avoidance, never to a broken test.

**sessionStorage, deliberately not localStorage.** A classroom machine is
shared. `localStorage` would carry one child's list into the next child's test;
`sessionStorage` dies with the tab, which is the natural boundary of one
sitting. Audited: a new tab starts clean.

**BALANCE ALWAYS OVERRIDES FRESHNESS.** Each band+type cell is filled from
fresh questions first and stale ones only after, so the blueprint count is met
whether or not fresh questions remain. Reuse is therefore the minimum necessary
by construction. Measured over 2,000 retests, every repeated question was
either forced by the pool or paid for by a named coverage repair — zero
unexplained reuse, zero balance breaks, zero duplicates.

| Length | Repeat on retest (min/avg/max) | Pool floor | Fresh |
|---|---|---|---|
| 12 | 0 / 0.00 / 0 | 0 | **100%** |
| 20 | 1 / 1.04 / 3 | 1 | **95%** |
| 30 | 12 / 12.07 / 14 | 12 | **60%** |
| 40 *(gated)* | 32 / 32.0 / 32 | 32 | 20% |

### Scoring — ratios, not fixed counts

Thresholds are **round-half-up integers**, computed with integer arithmetic and
never floating point:

```
threshold(count, num, den) = floor((2 * num * count + den) / (2 * den))

overall >= threshold(N, 5, 6)     83.3%   action >= threshold(A, 7, 8)   87.5%
being   >= threshold(B, 3, 4)     75%     almost >= threshold(N, 2, 3)   66.7%
```

| Length | Overall | Action | Being |
|---|---|---|---|
| **12** | **10 of 12** | **7 of 8** | **3 of 4** |
| **20** | **17 of 20** | **11 of 13** | **5 of 7** |
| **30** | **25 of 30** | **18 of 20** | **8 of 10** |
| **40** *(internal)* | **33 of 40** | **24 of 27** | **10 of 13** |

At 12 the ratios resolve to exactly the Build 1.4.0 numbers, so nothing drifted
when the fixed test became a dynamic one.

> **MASTERY IS PERMANENTLY A CONJUNCTION.**
> overall threshold **AND** action threshold **AND** being threshold.
> A strong action score must never hide weak being-verb understanding, and a
> strong being score must never hide weak action verbs.

Proved exhaustively over **780 score pairs** across all four lengths: 36 pairs
pass on the overall score alone while a subscale is weak, and all 36 are
denied. Zero grant mastery with a weak subscale in either direction.

**Known and accepted:** at 20 questions the overall bar also binds —
`action 11 + being 5 = 16 < overall 17` — so exactly one score combination
clears both subscale minimums and still misses mastery by one on overall. That
is correct under "all three must be met" and is a property of integer rounding
on small counts. **Do not alter scoring to smooth it.**

### Results

- a large **score plaque** — a count, never a percentage
- an **Action verbs** bar and a **Being verbs** bar, each with its text score
- a **guidance card** carrying the recommendation
- **no per-question dots at any length** — 30 dots is noise and 40 unreadable
- both bars use the **same fill colour** and their tracks are `aria-hidden`, so
  meaning never rests on colour or width; the text score always carries it
- no harsh failure styling at any score

**The celebration is gated on mastery, permanently.** A party popper over
"Keep going" congratulates a child for a score they did not earn.

### Result CTA logic

"Try again" is deliberately **not** the primary action after a weak score:
re-measuring without instruction in between measures nothing and teaches
nothing.

| Result | Primary | Secondary | Tertiary |
|---|---|---|---|
| **Mastered** | Back to Verb | See my answers | Try again |
| **Action weak** | **Practice verbs** | See my answers | Back to Verb |
| **Being weak** | **Practice verbs** | See my answers | Back to Verb |
| **Almost** | **Practice verbs** | See my answers | Back to Verb |
| **Low overall** | **Learn verbs** | See my answers | Back to Verb |

A subscale weakness means the concept is partly there but shaky, and Practice
is the engine that coaches. A low overall means the model is not there yet, and
Practice's hints would frustrate rather than help — so that child goes back to
Learn. **There is no direct "Try again" after a weak result**, by design; the
child returns through Verb, which is two taps and intentional.

### Forensic defect D-A1 — stale review explanations

Opening "See my answers" and then starting another test used to leave the
previous sitting's review — every row and every answer explanation — in the
document for the whole of the next test. `#test-results` is hidden, so nothing
was ever visible and nothing reached assistive technology, but at 30 questions
those stale explanations overlap the questions being asked.

"It happens to be inside a hidden div" is a containment argument, not a
compliance one. **`reset()` now calls `clearReview()`**, which empties the
review host, restores `hidden` and resets the button label, on every path into
a test.

Permanent regression checks:

- **13.29** — starting a new test tears down the previous review completely.
- **13.30** — **no answer explanation exists anywhere in the DOM during a
  test**, asserted by searching `#screen-test` for all 48 `why` strings and
  requiring zero matches.

13.30 is the check that should have existed from the start: it guards the
invariant directly rather than one of the ways it can be broken. Write checks
like that for Subject, Noun and Adjective.

### Verification at the re-lock

| | |
|---|---|
| Harness | **304 / 304 passing** |
| Independent forensic checks | **96**, in programs that do not import the harness |
| Bank field comparisons | **480 / 480 exact** against the approved source |
| Sampling draws audited | 12,000 · retest simulations 2,000 · score pairs 780 |
| Responsive | 4 widths × 12 states, 0 overflow / clipping / small tap target |
| Content defects | **0** |

**Nothing about a sitting is persisted except the recent-question IDs.** No
score, no timer, no progress. Leaving and returning starts a clean test, and
Try again is a full reset.

---

## 7. CONTENT — adding a skill is a content change

`js/data/learn-content.js` holds everything. Each of the four Home skills carries
six card fields, documented on `verb`:

```js
ask:      "What is happening?",                       // the child clue
icon:     "run",                                      // key into ICONS in app.js
preview:  { words:[…], start:2, end:2 },              // the Home card sentence
practice: "bank",                                     // "bank" | "soon"
test:     "soon"
```

`preview` is named that, **not** `example`, because every topic already has an
`example` lesson block and a duplicate key silently overwrites it. That mistake
was made and caught during this build.

To add a fifth skill: add its key to `homeOrder`, give the topic those six
fields and the four lesson blocks. **No rendering code changes.**

`order` is now the ARCHIVE list. `complete-subject` and `predicate` keep all
their content, untouched, ready to migrate — they are simply not routed to.

### D-33 is still literally true

The Learn question for Verb is `learnTry`, not `tryIt`. The old rule — *a topic
with a bank must NOT also have a `tryIt`* — existed because one engine read both
in the same step. Learn and Practice are separate components now, so a topic
legitimately needs one question in Learn and a bank in Practice; giving the Learn
question its own key keeps the invariant intact.

---

## 7b. THE BEING-VERB RULE — PERMANENT, FROM BUILD 1.2.6

> After a being verb, use a plain adjective with **no participle form** —
> `busy`, `quiet`, `happy`, `ready`, `full`, `empty`, `proud`.
> **Never** `crowded`, `excited`, `broken`, `finished`, `tired`, `frozen`.

A word ending `-ed` or `-en` after a being verb can be read as a past
participle, which turns `is <word>` into a passive verb phrase and makes the
answer ambiguous. `The dog is tired.` has two defensible readings — *tired* as
a description, or *is tired* as a passive verb phrase — so a child asked to
find "the verb" has no single right answer. `The dog is happy.` has one.

This rule came from Build 1.2.6. **It was dropped from the handoff during the
1.4.0 rewrite** and restored here when a Learn example was about to ship
`is tired`. It governs every being-verb sentence in the product, not only the
ones in the question bank.

---

## 8. THE PLAIN → MARKED RULE

**READ IT** plain, then **SEE HOW IT WORKS** annotated — rendered by
`renderTeachingSentence()` from a single `words` array.

### When the pair is required — clarified by the owner in 1.4.0

The pair is for **explicit demonstration**, not decoration on every example:

> Use plain → marked where the lesson is *showing the child how to find it*.
> Do not force it onto every marked example when doing so would overfill the
> step or flatten the lesson's hierarchy.

In the Verb lesson that means:

| Step | Treatment |
|---|---|
| **What is it?** | Two short marked examples, **marked-only**. They illustrate *that* both kinds exist; they are not a worked example. |
| **How do I find it?** | No sentence — the strategy and the clues. |
| **Show me** | **The full pair belongs here**, with the numbered routine. This is the demonstration. |
| **Let me try** | Plain sentence only, because marking it would give the answer away. |

This was a deliberate decision, not an oversight. Do not "restore" the pair to
the What is it? examples.

### What has not changed

Both passes render from the **same `words` array**, so the plain pass cannot add,
remove, reorder or re-punctuate a word. **Never introduce a separate plain-text
string for a sentence** — that is the one change that would let them drift.
Check 10.1 enforces the exact match on the Show me pair.

Home card previews render through the same component and the same inclusive
range shape, so a card cannot drift from its source either.

> **The chip is a COLUMN** so a written label can sit above the word. The word
> and its ending punctuation therefore need their own ROW inside it
> (`.ss-word-body`). Without it the punctuation becomes a third line and
> `sentence.` renders with a full stop stranded underneath. **This shipped in
> 1.3.0 (M-02), recurred during 1.4.0 development, and is now guarded by
> harness check 10.4** — previously it was caught only by looking at a
> screenshot.

---

## 9. DESIGN AND ACCESSIBILITY RULES

**Colour is never the only signal.** A marked word carries a written label, a
border and an underline. A ruled-out choice is **struck through** as well as
recoloured.

**Focus is drawn with `outline`, never `box-shadow`.** A box-shadow ring is
silently defeated by any later rule setting box-shadow at equal specificity —
which is exactly what `.btn-start`'s own drop shadow did, leaving the primary
button with **no visible focus at all**. Found by harness check 9.6 in this
build. Headings carrying `tabindex="-1"` are focus *targets*, not controls, and
correctly show no ring.

**Never vertically centre an activity body.** Build 1.2.3 centred a lesson
column and the shorter the step the further down the page it was pushed — a 33px
gap at 1366 became 406px at 2560. Top-aligned, one constant gap.

**A media query that enlarges type MUST carry a `min-height` guard.** Twice
(D-22, D-28) a width-only rule treated a short wide laptop as a large display
and made a wider viewport vertically *worse*. The one large-display rule here is
gated at `(min-width:1600px) and (min-height:1000px)`.

**The build badge stays in normal document flow.** `position:fixed` is only safe
on a screen that cannot scroll, and every screen here can scroll.

**Short viewports shrink spacing, never targets.** Type and the 48px tap-target
floor are the last things to give way.

**No ILLUSTRATION of people is authored here** — the banner photograph is a
supplied asset, not drawn. The four skill icons are pictograms, and Verb is a
running figure with motion lines, matching the approved reference. An earlier
pass replaced it with an abstract arrow after reading the no-people rule as
covering icons; the owner clarified that the reference image is the intended
appearance, and Subject was always specified as a person/group icon, so
glyph-level figures were in scope all along.

---

## 10. HARNESS

```powershell
cd C:\Sentence-Sense
node verification/serve.js . 8347      # terminal 1
node verification/guard.js ./out       # terminal 2 — needs puppeteer-core + Chrome
```

`verification/guard.js` — **304 checks, 304 passing** — replaces the retired
`missionguard.js`. It guards load integrity, Home's four skills and its
forbidden furniture, the shared Skill screen across all four skills, all four
Learn states, the 20-question bank with both shuffles, feedback escalation and
the third-attempt reveal, mission retirement, state leakage, keyboard and focus,
the plain→marked exact match, and a 9-viewport responsive matrix.

> `serve.js` had a real defect, fixed in 1.4.0: `ROOT` was used raw, so
> `path.join(".", "/index.html")` produced a relative path while the traversal
> guard compared it against an absolute `path.resolve(".")`. **Every request
> under the documented `node verification/serve.js . 8347` returned 403.** Any
> relative root failed; only an absolute one worked.

**Harness rules that are still true:**
- Choice buttons are shuffled — select by `dataset.ci`, never by position or
  rendered text.
- `.ss-words` is `align-items:flex-end`, so a marked chip and a plain word have
  different `top` values on one visual line. **Count row wraps by bottoms.**
- Do not force-enable an advance button to jump ahead. Walk the product.
- Measure focus through the **keyboard**. A programmatic `.focus()` does not
  reliably match `:focus-visible`, and a check that uses it silently passes
  whatever it finds — which is how the invisible focus ring survived until now.

---

## 11. DEFECT LEDGER

### Open

| ID | Issue | Severity |
|---|---|---|
| **D-20** | **OPEN.** Abstract nouns are defined in the Noun lesson but never demonstrated inside a marked sentence and never asked about. Content gap, carried forward untouched. | 3 |
| **D-26** | **OPEN / DEFERRED.** The build badge can fall below the fold on some device classes. Deployment metadata, not instructional content. | 4 |
| **P-02** | **OPEN — product decision.** Subject, Noun and Adjective have Learn only. Their Practice and Test are honest placeholders until banks are approved. | 3 |

### Closed in Build 1.4.0

| ID | Resolution |
|---|---|
| **D-27** | **CLOSED.** Required-control visibility on short viewports. The screens it described no longer exist; the new ones measure **0 false bottoms across 27 samples** on 9 viewports. |
| **D-35** | **CLOSED BY REMOVAL.** The Study Guide modal, overlay and focus trap are gone. There is no dialog left to mark `inert`. |
| **P-01** | **CLOSED.** The 20-question Verb bank is reachable normally at Home → Verb → Practice. `?verb=classic` is removed. |
| **H-01** | **CLOSED.** All five superseded audits deleted. |
| **H-02** | **CLOSED.** `assets/Sentence-Sense_logo.png` (1.7 MB, unreferenced) deleted. |
| **H-03** | **CLOSED.** `assets/images/logo.png` (972 KB) and `logo-512.png` (304 KB) deleted on owner approval. Both were unreferenced: the cartoon-mascot lockup contradicted the 1.4.0 art direction and Home uses a typographic wordmark. `favicon.png` is the only image asset left and is still referenced. **No brand image asset now exists** — see §13. |
| **N-01** | **CLOSED.** `verification/serve.js` returned 403 for every request under its own documented command. |
| **N-02** | **CLOSED.** `:focus-visible` used `box-shadow` and was overridden by `.btn-start`'s own shadow — the primary button had no visible focus ring. Now drawn with `outline`. |
| **N-03** | **CLOSED.** M-02 recurrence: ending punctuation on a marked word wrapped to its own line. Fixed with `.ss-word-body`; now guarded by check 10.4. |
| **N-04** | **CLOSED.** The Verb icon rendered as a running stick figure, which the brief forbids. Replaced with an abstract motion mark. |

### Standing limitations

- **L-02 — All device testing is simulated.** 9 viewports in Chrome emulation;
  no physical phone or tablet.
- **L-03 — No classroom projector verification.**
- **L-04 — No screen-reader testing.** ARIA, focus movement and live regions are
  implemented and programmatically checked; **no actual screen reader was run**,
  and none is claimed.
- **L-05 — No testing with a child. The most important gap in this project.**
  Whether a third grader finds this clear, whether the sentences are the right
  difficulty, and whether skill-first navigation lands are questions no audit
  here can answer.
- **L-06 — Chromium only.** No Firefox, Safari or iOS.
- **L-07 — No readability instrument was run.** No Lexile or reading level is
  claimed for any sentence.

---

## 12. WORKING AGREEMENT

For every approved build: self-audit before delivery · provide the build audit
`.md` · update this handoff to current state only · increment the visible build
number · **confirm the baseline from `js/app.js`, never from the branch name.**

### Delivery — CHANGED DURING 1.4.0

The build brief called for two ZIPs and no Git. **The owner then superseded that
and authorised committing and pushing to `claude/build-1.4`**, so GitHub is the
handoff and the ZIPs are not the deliverable. The review documentation, the
verification results and the screenshots are therefore **in this repository**.

Standing constraints, observed:

- **Do NOT merge into `main`.** `main` is still at Build 1.2.7 (`cc1f102`).
- **Do NOT force-push.**
- **Do NOT deploy to the live site.**

If GitHub Pages publishes from `main`, the live site is two builds behind.
Merging is what would change it, and that is a separate decision from approving
this branch.

Startup for the next session: read the code → read this handoff → read the audit
→ reconcile all three → **code wins over stale documentation** → report any new
discrepancy **before** editing.

---

## 13. NEXT — NOT STARTED

- **Testing with an actual third grader (L-05).** Nothing else matters as much.
- **A brand lockup asset, if one is wanted.** The old logo files were deleted and
  the wordmark is now live text (navy + green) beside an inline book glyph. That
  is deliberate and scales cleanly, but it means **no raster brand asset exists**
  for anywhere outside the site — a README, an app icon, a printed sheet.
  `favicon.png` is unchanged and still the old mark.
- **An approved hero photograph** at `assets/images/sentence-sense-hero.png`.
- **Approved question banks** for Subject, Noun and Adjective, in the same shape
  as the Verb bank. The Practice engine already runs any topic that has one.
- **A real Test engine.** The placeholder is honest and must not be replaced by
  a second copy of Practice.
- **Screen-reader testing (L-04)** and a non-Chromium pass (L-06).
- Complete Subject and Predicate — content preserved, awaiting approval.
- Scoring, timers, streaks, accounts, persistent progress, APIs, databases —
  none exist and none are planned.

---

*End of handoff. Last updated 2026-09-20 for Build 1.4.0.*
