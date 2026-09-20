# SENTENCE SENSE — PROJECT HANDOFF

**Current build: Sentence Sense — Build 1.4.0**
**Last pass:** Simplified product redesign — skill-first navigation — 2026-09-20
**Repository:** `C:\Sentence-Sense` → GitHub Pages · static · $0 recurring
**This file describes the CURRENT shipped state only. Read it first.**

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
| `index.html` | Five screens: home, skill, learn, practice, coming-next | 249 |
| `css/styles.css` | Every style, phone-first, numbered sections 1–13 | 1019 |
| `js/app.js` | Shell: Home, the shared Skill screen, routing, icons, build badge | 337 |
| `js/sentence.js` | **NEW 1.4.0** — the shared sentence renderer | 226 |
| `js/learn.js` | The shared four-state LEARN component | 385 |
| `js/practice.js` | **NEW 1.4.0** — the shared PRACTICE question engine | 370 |
| `js/data/learn-content.js` | All content for all six topics, plus card fields | 1053 |
| `assets/images/favicon.png` | Referenced by `index.html` |
| `assets/images/sentence-sense-hero.jpg` | The classroom banner photograph. 2048×768, 169 KB. |
| ~~`assets/images/logo.png`, `logo-512.png`~~ | **DELETED in 1.4.0.** Unreferenced; the cartoon-mascot lockup contradicted the art direction. See §11 H-03. |
| `assets/reference/home-screen-mockup.png` | The approved style reference. Not loaded by the site. |
| `verification/serve.js` · `verification/guard.js` | Dev harness. Not part of the site. |
| `AUDIT-REPORT-Build-1.4.0.md` | The current build audit — and the only one |
| `SENTENCE-SENSE-HANDOFF.md` | This file |

Script load order in `index.html` matters:
`learn-content` → `sentence` → `learn` → `practice` → `app`.
`js/app.js` calls `SS_LEARN.init()` and `SS_PRACTICE.init()` and must load last.

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
| **Verb** | What is happening? | 20-question bank | coming next |
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

**The standards badge sits bottom-right, not top-right as the reference shows.**
The reference had a blank whiteboard in that corner; this photograph has a
child's head there, and a label across a face is worse than a small placement
change.

The closing quote strip is decoration: no link, no control, no tab stop. The
reference pairs the quote with a Learn/Practice/Improve/Grow icon row; **that row
is deliberately not built**, because it reads as navigation and tapping it would
go nowhere. It needs an owner decision.

### Skill screen — ONE component, all four skills

Title, child clue and the three activities are filled from content. There is no
per-skill layout. Test is shown so the structure is clear and is marked
**Coming next** where the child reads, not only after a press.

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

## 8. THE PLAIN → MARKED RULE

Wherever a sentence carries any annotation, the same sentence is shown twice:
**READ IT** plain, then **SEE HOW IT WORKS** annotated.

Both passes render from the **same `words` array**, so the plain pass cannot add,
remove, reorder or re-punctuate a word. **Never introduce a separate plain-text
string for a sentence** — that is the one change that would let them drift.

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

`verification/guard.js` — **199 checks, 199 passing** — replaces the retired
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
