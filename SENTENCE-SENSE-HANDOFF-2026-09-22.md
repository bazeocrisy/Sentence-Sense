# SENTENCE SENSE — PROJECT HANDOFF
## 2026-09-22 · reconciled against the repository as it exists now

**This document was built by inspecting the code, not by copying older
handoffs.** Where documentation and code disagreed, the code won, and every
disagreement is listed in *DOCUMENTATION DISCREPANCIES FOUND* at the end rather
than silently resolved.

---

## 1. CURRENT STATE AT A GLANCE

| | |
|---|---|
| **Date** | **2026-09-22** |
| **Repository** | `bazeocrisy/Sentence-Sense` |
| **Working branch** | **`claude/build-1.4`** |
| **Reconciliation baseline** (HEAD when this was written) | **`aab173ad7dbfaeeee6d2419bc39a43b584944e42`** |
| **`origin/claude/build-1.4`** | matched local at that point; HEAD advances by one when this file is committed |
| **`main`** | `cc1f102924ad4bb74166b1ac056005c3854380e3` |
| **`origin/main`** | `cc1f102924ad4bb74166b1ac056005c3854380e3` — **matches** |
| **Working tree** | **clean** |
| **Build number, read from `js/app.js:37`** | **`Build 1.4.0`** |
| **Harness** | **304 checks, 304 passing, 0 failing** |

Last four commits:

```
aab173a  Correct the dated handoff: Build 1.4.0 is live from the branch
8f958a2  Add dated Sentence Sense handoff for 2026-09-20
04c820d  Finalize Verb acceptance fixes for live testing
5ae91a2  Complete dynamic Verb Test and forensic audit
```

---

## 2. LIVE DEPLOYMENT — VERIFIED, NOT ASSUMED

> ## BUILD 1.4.0 IS LIVE, SERVED FROM THE BRANCH.

| | |
|---|---|
| **Public URL** | **https://bazeocrisy.github.io/Sentence-Sense/** |
| **Pages source** | **`claude/build-1.4`**, repository root |
| **Live build** | **Build 1.4.0** |
| **`main`** | **untouched**, still Build 1.2.7 |
| **Rollback tag** | `live-build-1.2.7` → `cc1f102924ad4bb74166b1ac056005c3854380e3` |

**How the source was determined.** The live `js/app.js` is byte-identical to
`claude/build-1.4:js/app.js` and **not** to `main:js/app.js`. `js/test.js`
returns HTTP 200 and **does not exist on `main`**. There is no
`.github/workflows`, no `gh-pages` branch, no `/docs`, no `CNAME`.

> ### A PUSH TO `claude/build-1.4` IS A DEPLOYMENT.
>
> Pages rebuilds from this branch. Every commit here is production until the
> owner changes the source. **Treat the branch as live.**

**Rollback (preferred, no git operation):** GitHub → Settings → Pages → Source →
change branch back to `main` → Save. The URL returns to Build 1.2.7 in ~1–2
minutes, because `main` still holds exactly that state.

---

## 3. WHAT THIS PROJECT IS

Sentence Sense teaches an elementary student — target **3rd grade, ages 8–10** —
how a sentence works. Static site: no database, no API, no accounts, no server
state, no build system. The only external request is the Google Fonts CDN.

Four governing rules, unchanged:

> **ONE SCREEN. ONE SKILL. ONE OBVIOUS THING TO DO.**
> **CHOOSE THE SKILL FIRST.**
> **READ IT, then SEE HOW IT WORKS.**
> **SIMPLIFY THE INTERFACE, NOT THE READING LEVEL.**

### Product model

```
HOME  →  SKILL  →  LEARN | PRACTICE | TEST  →  ACTIVITY
```

Home shows four skill cards — **Verb, Subject, Noun, Adjective** — driven by
`C.homeOrder`. Each skill screen offers three activity cards. An activity is
live when `activityReady()` says so (`js/app.js`):

```js
if (key === "learn")    return true;                    // ALWAYS available
if (key === "practice") return topic.practice === "bank";
if (key === "test")     return topic.test === "pool";
```

**`learn` returns `true` unconditionally.** That single line is why three skills
are further along than older documents suggest — see §6.

---

## 4. FILE / COMPONENT MAP — actual line counts, measured today

| File | Role | Lines |
|---|---|---|
| `index.html` | **Five** screens: home, skill, learn, practice, **test** | **394** |
| `css/styles.css` | Every style, phone-first, sections 1–**14** | **1852** |
| `js/app.js` | Shell: Home, shared Skill screen, routing, icons, build badge | **363** |
| `js/sentence.js` | Shared sentence renderer (plain → marked) | **228** |
| `js/learn.js` | Shared four-state LEARN component | **474** |
| `js/practice.js` | Shared PRACTICE engine — coaching, clue, reveal | **397** |
| `js/test.js` | Shared TEST engine — pool sampling, dynamic scoring | **755** |
| `js/data/learn-content.js` | All content for **six** topics | **1704** |
| `assets/images/favicon.png` | Referenced by `index.html` |  |
| `assets/images/sentence-sense-hero.jpg` | Classroom banner, 2048×768, 169 KB — **installed and live** |  |
| `assets/reference/home-screen-mockup.png` | Approved style reference, not loaded by the site |  |
| `verification/guard.js` · `serve.js` | Dev harness, not part of the site |  |
| `verification/results.json` · `responsive.json` · `screenshots/` (43) | Harness output, committed as evidence |  |

**Script load order in `index.html`, verified:**
`learn-content` → `sentence` → `learn` → `practice` → `test` → `app`.
`js/app.js` loads last and initialises the components.

### Documentation in the repository (11 files)

| File | Status |
|---|---|
| `SENTENCE-SENSE-HANDOFF.md` | Main handoff — **partly stale**, see §13 |
| `SENTENCE-SENSE-HANDOFF-2026-09-20.md` | Previous session handoff — current |
| **`SENTENCE-SENSE-HANDOFF-2026-09-22.md`** | **This file — the authoritative startup document** |
| `AUDIT-REPORT-Build-1.4.0.md` | **Superseded** — predates the Test engine, see §13 |
| `FORENSIC-AUDIT-VERB-TEST.md` | Test v1 audit — valid, historical |
| `FORENSIC-AUDIT-VERB-DYNAMIC-TEST.md` | Dynamic Test audit — **current and authoritative for the Test engine** |
| `FORENSIC-AUDIT-VERB-END-TO-END.md` | Whole-journey acceptance audit + correction appendices — **current** |
| `RESPONSIVE-REPORT.md` | **Superseded** — covers home/skill/practice only, no Learn, no Test |
| `REVIEW.md` | **Partly stale** — its deployment guidance is now wrong, see §13 |
| `ASSETS-NEEDED.md`, `CONTENT-MANIFEST.md`, `DELETION-DEPENDENCY-REPORT.md` | Legacy build-1.4.0 working docs, not maintained |

---

## 5. VERB STATUS — COMPLETE AND LOCKED

| | |
|---|---|
| **Verb Learn** | **LOCKED** — four steps, live |
| **Verb Practice** | **LOCKED** — 20-question bank, live |
| **Verb Dynamic Test** | **LOCKED** — 48-question pool, live |
| Test v1 forensic audit | **PASSED** |
| Dynamic Test forensic audit | **PASSED** — verdict *READY TO RE-LOCK* |
| End-to-end acceptance audit | **PASSED WITH MINOR CORRECTIONS** |
| External user testing | **UNDERWAY** — Build 1.4.0 is public |

**Verb is the reference implementation for Subject, Noun and Adjective.**

### Verb Test architecture — read from code today

| | |
|---|---|
| **Pool** | **48 questions**, ids `V001`–`V048`, all 48 carry a `why` |
| **Split** | **32 action · 16 being** (66.7% / 33.3%) |
| **Bands** | 16 each — b1 **11A/5B** · b2 **11A/5B** · b3 **10A/6B** |
| **Being forms** | `am` 2 · `is` 4 · `are` 4 · `was` 4 · `were` 2 — **all five** |
| **Child-facing lengths** | **`sizes: [12, 20, 30]`** — 12 preselected |
| **Built but hidden** | **`sizesBuilt: [12, 20, 30, 40]`** |

**Sampling.** Blueprint first, randomness second. ~2/3 action and ~1/3 being at
every length; band 1 → 2 → 3 always; shuffle **within** a band, never across;
exact per-band cell counts; never a duplicate inside one sitting. The being
remainder goes to the **earliest** band.

| Length | Band 1 | Band 2 | Band 3 | Action | Being |
|---|---|---|---|---|---|
| 12 | 4 (2A/2B) | 4 (3A/1B) | 4 (3A/1B) | 8 | 4 |
| 20 | 7 (4A/3B) | 7 (5A/2B) | 6 (4A/2B) | 13 | 7 |
| 30 | 10 (6A/4B) | 10 (7A/3B) | 10 (7A/3B) | 20 | 10 |
| 40 *(hidden)* | 14 (9A/5B) | 13 (9A/4B) | 13 (9A/4B) | 27 | 13 |

**Recent-question avoidance.** `sessionStorage`, key `ss.test.recent.verb`,
**IDs only** — no score, no name, no timing. Written at submission. Dies with
the tab. **Balance always overrides freshness.**

**Scoring — `masteryRatio` in content, round-half-up integers:**

```
overall [5,6] = 83.3%   action [7,8] = 87.5%
being   [3,4] = 75%     almost [2,3] = 66.7%
```

| Length | Overall | Action | Being |
|---|---|---|---|
| 12 | 10 of 12 | 7 of 8 | 3 of 4 |
| 20 | 17 of 20 | 11 of 13 | 5 of 7 |
| 30 | 25 of 30 | 18 of 20 | 8 of 10 |
| 40 *(internal)* | 33 of 40 | 24 of 27 | 10 of 13 |

> **Mastery is permanently a CONJUNCTION: overall AND action AND being.**
> Proved exhaustively over 780 score pairs — 36 pass on overall alone while a
> subscale is weak, and all 36 are denied.

**Results.** Large score plaque (a count, never a percentage); Action and Being
bars each with a visible text score; guidance card; **no per-question dots**;
both bars the same colour; **celebration gated on mastery, permanently**.

**Result CTAs.** Mastered → *Back to Verb* / *See my answers* / *Try again*.
Action-weak, Being-weak, Almost → *Practice verbs* first. Low overall →
*Learn verbs* first. "Try again" is never primary after a weak score.

**Why 40 stays hidden.** At 48 questions a 40-question sitting is 83% of the
pool and partly deterministic — V002, V004, V007, V010 and V013 appeared in all
3,000 audited draws. Retest freshness collapses to 20%. **Unlocking is a
one-array content edit** once the pool reaches roughly **80 audited questions**:
move `40` from `sizesBuilt` into `sizes`. No code change.

---

## 6. SUBJECT / NOUN / ADJECTIVE — MORE COMPLETE THAN OLDER DOCS STATE

**Verified in a real browser today.** All three open cleanly, render four Learn
steps, and produce **zero page errors**.

| Skill | Learn | Practice | Test | Learn heading |
|---|---|---|---|---|
| **Verb** | **LIVE** | **LIVE** (20) | **LIVE** (48-pool) | *What is a verb?* |
| **Subject** | **LIVE — 4 steps, playable** | `soon` | `soon` | *What is a subject?* |
| **Noun** | **LIVE — 4 steps, playable** | `soon` | `soon` | *What is a noun?* |
| **Adjective** | **LIVE — 4 steps, playable** | `soon` | `soon` | *What is an adjective?* |

Each of the three has a full `definition`, `clue`, `example`, a Learn question
(`tryIt`), and a `studyGuide`. Their skill screens show Learn as a live card
with a working **Start →** button; Practice and Test render as `is-soon` with no
button.

> **"Subject has not been started" is not accurate and should not be repeated.**
> What has not been started is **Subject Practice and Subject Test content** —
> a `tryItBank` and a `testPool`. Subject **Learn is written, shipped and live
> to the public right now.**

### Two orphaned topics

`js/data/learn-content.js` defines **six** topics. Two are **unreachable**:

| Topic | State |
|---|---|
| `complete-subject` | Full Learn content + study guide. **Not in `homeOrder`. Not referenced by `app.js`, `index.html` or `learn.js`.** |
| `predicate` | Same. |

They are deliberate archive content, intact and ready to migrate. The main
handoff documents this at its §"`order` is now the ARCHIVE list". **A child
cannot reach them.** Leave them alone unless the owner asks.

---

## 7. LOCKED — DO NOT CHANGE WITHOUT CHRIS'S EXPLICIT APPROVAL

- Verb **Learn** content
- Verb **Practice** bank — all 20 questions, feedback, clues, reveals
- Verb **Test pool** — all 48 questions, choices, answers, tags, `why` lines
- Test **scoring** — thresholds, ratios, the mastery conjunction
- Test **selector behaviour** — 12/20/30 offered, 40 hidden
- Results **CTA behaviour**
- **`js/test.js`**
- The **build number** — currently `Build 1.4.0`
- **`main`** branch
- The **`live-build-1.2.7` tag** — do not delete
- The **Pages source setting** — changing it changes the live site

**The owner supplies educational content. Claude implements, validates,
samples, scores, renders and audits it.** Never write, paraphrase, "improve" or
silently correct a sentence, choice, tag or explanation while coding. If content
looks wrong: **STOP, name the exact question ID, explain, wait.**

### Permanent rules that have already cost real defects

- **A green harness is not proof.** Two of four Verb Test v1 defects were
  invisible to every automated check and were found by looking at rendered
  screenshots. **Always look at the screenshots.**
- **Being-verb safety rule (Build 1.2.6).** After a being verb use plain
  adjectives — never an `-ed`/`-en` word, which reads as a past participle.
- **D-A1.** No answer explanation may exist anywhere in the DOM while a Test
  question is on screen. Guarded by checks 13.29 and 13.30.
- **Learn teaches, Practice coaches, Test measures.** `js/practice.js` and
  `js/test.js` are separate engines and must stay separate.
- **One correct token.** The answer model permits exactly one correct word, so
  any future `BE + -ing`, `have + participle` or `modal + base` sentence is
  unanswerable under it. Binds the pool expansion **and** all three new skills.

---

## 8. OPEN DEFECTS

| ID | Sev | State |
|---|---|---|
| **D-20** | — | **OPEN.** Abstract nouns: the Noun `definition.note` says *"An idea is something you cannot touch, like joy or hope."* but the word "abstract" appears **0 times**, the concept is never demonstrated inside a marked sentence, and it is never asked. Content gap. |
| **D-26** | — | **OPEN / DEFERRED.** The build badge can fall below the fold on some device classes. Deployment metadata, not instructional content. |
| **D-E5** | MEDIUM | The teaching that corrects the `-ing` clue lives inside the collapsed *Words to remember* accordion. Learn lists `running` as an action verb; 12 Test questions use `-ing` distractors, one of them the literal word `running`. The visible warning does correct it in general terms. **Content decision.** |
| **D-E6** | LOW | The prompt *"What happens?"* (17 questions) is never taught. Learn teaches *"What happened?"* and *"What is happening?"*. |
| **D-E7** | LOW | Sub-14px non-actionable text on Home: `.hq-label` 12.5px ×4, `.hb-line` 12.8px. |
| **D-E8** | LOW | `.build-badge` fails WCAG AA at **2.80:1** — the only genuine contrast failure in 138 measured nodes. One-line fix. |
| **D-E9** | LOW | Practice classifies by `stage`; Test uses `band` + `type`. Practice has **no `type` field**. A trap for anyone treating Verb as the template. |
| **D-E10** | LOW | Long-test review is an unbounded scroll — 4,888px at 12 questions on a phone. |

**0 Critical. 0 High.**

---

## 9. ACCEPTED LIMITATIONS

**D-E1 — Learn Step 2 scroll residue.** `ok` on desktop and both tablet
orientations, a sliver `cut` on laptop and large phone, a normal scroll of
~120–300px on 390×844, 375×667 and 390×650. At 375×667 the step's content
measures **653px** inside a 667px viewport that must also carry the header, step
indicator, title and controls — **the content alone exceeds the screen**. Next
is never unreachable, the cut card at the fold is an honest cue, and keyboard
reaches Next in **3 Tabs** at every viewport. **Accepted; a content-volume
question, not a layout one.**

**48 questions is a Phase-1 pool.** At 30 questions a retest repeats 12 by
structural necessity (60% fresh). Only 12 and 20 return ≥95% fresh.

**Five near-duplicate sentence pairs** can both appear in one 30-question
sitting: V007/V018, V008/V024, V010/V047, V014/V045, V025/V042. Cosmetic.

**At N=20 the overall bar also binds** — `11 + 5 = 16 < 17` — so exactly one
score combination clears both subscales and still misses mastery. Correct under
"all three must be met"; a property of integer rounding on small counts.

**`suffix-s-lure` has zero members** in the Phase-1 pool. Tag retained for
Phase 2. No artificial coverage was manufactured.

---

## 10. DEFERRED — NOT TO BE CHANGED SILENTLY

**A. The Learn verb-phrase example.** *The workers are building a house.* in the
study-guide contrast. Full phrase is **`are building`**; the example marks
`building` alone, labelled *TELLS WHAT THEY DO*. **Unscored** — no prompt, no
choices, nothing measured. A read-only audit of all 76 Verb sentences found this
is the **only** true verb phrase in the app, and **no Practice or Test question
contains one at all** — all 22 being questions are `BE + predicate adjective`,
and every one of the 68 assessed answers is grammatically complete. **Severity
LOW.** Requires a deliberate content decision. Consider together with D-E5,
since both live in the same collapsed accordion.

**B. Hero image.** Chris II felt the classroom photo **looks too AI-generated**
and suggested **more colour and design around the centre piece**. The asset is
owner-supplied and owner-approved, and the banner layout is audited and locked
including the phone/desktop split and the WCAG scrim. **Do not redesign,
replace or regenerate without approval.**

**C. Pool expansion toward ~80 audited questions**, which is the precondition for
unlocking 40.

**D. Brand asset.** No raster brand lockup exists. The wordmark is live text
(navy + green) beside an inline book glyph. `favicon.png` is the old mark.

---

## 11. ACTUAL-CHILD TESTING FEEDBACK ALREADY RECORDED

From **Chris II**, on a real device:

1. **Action verbs were easy.** He moved through them quickly.
2. **Being verbs caused more hesitation.** Recorded as **user-testing feedback,
   not a proven software defect.** Alignment was independently verified: Learn
   teaches both jobs with equal billing and a being-verb fallback with all five
   forms; Practice is 14 action / 6 being (30%) with all five forms across all
   four stages; Test is 32/16 with all five forms; and mastery requires the
   being subscale independently, so a strong action score **cannot** hide weak
   being-verb understanding. Nothing is broken. Whether being verbs need *more*
   reinforcement is an instructional judgement for the owner.
3. **He hit a sentence where more than one word looked like the verb.**
   Investigated in full. No Practice question contains `BE + -ing` adjacently.
   The most likely item is **P19** — *"I am always ready for the spelling test
   on Friday morning."* — the only Practice item where an `-ing` word
   (`spelling`) is selectable alongside a being-verb answer. `am` alone **is**
   correct, and the app already coaches the exact misconception.
4. **The hero image reads as AI-generated.** See §10B.

---

## 12. STARTUP INSTRUCTIONS FOR THE NEXT SESSION

**A.** Read this file first, then `FORENSIC-AUDIT-VERB-END-TO-END.md` for the
defect register, then `FORENSIC-AUDIT-VERB-DYNAMIC-TEST.md` for the Test engine.
Treat `SENTENCE-SENSE-HANDOFF.md`, `AUDIT-REPORT-Build-1.4.0.md`,
`RESPONSIVE-REPORT.md` and `REVIEW.md` as historical — see §13.

**B.** Verify state before touching anything:

```powershell
cd C:\Sentence-Sense
git rev-parse --abbrev-ref HEAD     # expect claude/build-1.4
git rev-parse HEAD                  # expect the commit that added this file,
                                    # one past aab173a, unless work resumed
git rev-parse main                  # expect cc1f1029... (must not move)
git status                          # expect clean
Select-String -Path js\app.js -Pattern 'BUILD_NUMBER'
```

**C.** Verify the live site and that the Pages source has not changed:

```powershell
(Invoke-WebRequest "https://bazeocrisy.github.io/Sentence-Sense/js/app.js").Content |
    Select-String 'BUILD_NUMBER'
```

**D.** Run the harness before and after any change:

```powershell
node verification/serve.js . 8347        # separate terminal
node verification/guard.js verification  # expect 304 passed, 0 failed
```

Harness dependencies (`puppeteer-core`, local Chrome) live in the session
scratchpad and are deliberately **not** in the repository.

**E. Do NOT start Subject, Noun or Adjective Practice/Test automatically.**

**F. Ask Chris what he wants to work on.**

---

## 13. DOCUMENTATION DISCREPANCIES FOUND

Every statement below is contradicted by the current code. Nothing was edited to
hide a contradiction; the verified state is given beside each.

### `SENTENCE-SENSE-HANDOFF.md` — the main handoff

| # | Stale statement | Verified current state |
|---|---|---|
| 1 | File map: *"`index.html` — **Four screens**: home, skill, learn, practice \| 298"* | **Five** screens — `#screen-test` exists. **394 lines.** |
| 2 | *"`css/styles.css` … numbered sections 1–**13** \| 1225"* | Sections **1–14** (section 14 = *Vertical rhythm*). **1852 lines.** |
| 3 | *"`js/app.js` \| 353"* | **363** |
| 4 | *"`js/sentence.js` \| 226"* | **228** |
| 5 | *"`js/learn.js` \| 385"* | **474** |
| 6 | *"`js/practice.js` \| 370"* | **397** |
| 7 | *"`js/test.js` \| 446"* | **755** |
| 8 | *"`js/data/learn-content.js` \| 1031"* | **1704** |
| 9 | *"`AUDIT-REPORT-Build-1.4.0.md` — the current build audit **and the only one**"* | **False.** Three forensic audits, two dated handoffs, `RESPONSIVE-REPORT.md`, `REVIEW.md` and three legacy docs also exist. |
| 10 | File map omits 10 files | Missing: the three `FORENSIC-AUDIT-*.md`, `SENTENCE-SENSE-HANDOFF-2026-09-20.md`, `RESPONSIVE-REPORT.md`, `REVIEW.md`, `ASSETS-NEEDED.md`, `CONTENT-MANIFEST.md`, `DELETION-DEPENDENCY-REPORT.md`, `verification/README.md` |
| 11 | *"**Do NOT deploy to the live site.**"* | **Superseded.** Build 1.4.0 **is live**, published 2026-09-20 by repointing the Pages source to the branch. |
| 12 | *"If GitHub Pages publishes from `main`, the live site is two builds behind."* | **Superseded.** Pages publishes from **`claude/build-1.4`**. The live site is current. |
| 13 | *"Adding a skill should be a CONTENT change. Subject, Noun and Adjective each need a `tryItBank`, a `testPool` …"* — implies none are started | **Understates reality.** All three already have complete, **live, playable Learn** flows. Only Practice and Test content is missing. |
| 14 | §13 *"An approved hero photograph at `assets/images/sentence-sense-hero.**png**`"* listed under **NOT STARTED** | **Done, and the extension is wrong.** `assets/images/sentence-sense-hero.**jpg**` is installed, referenced by `css/styles.css:343` and `js/app.js:145`, and live. |
| 15 | §13 lists *"Testing with an actual third grader (L-05)"* under NOT STARTED | **Done.** Chris II tested on a real device; findings are in §11. |

*(The harness count in this file — 304 — **is** correct and was updated.)*

### `AUDIT-REPORT-Build-1.4.0.md`

| # | Stale statement | Verified current state |
|---|---|---|
| 16 | *"**234 checks, 234 PASS, 0 FAIL**"* | **304 checks, 304 passing.** |
| 17 | Documents a Build 1.4.0 that has **no Test engine** | `js/test.js` (755 lines), a 48-question pool and the 12/20/30 selector all shipped after this audit was written. **Superseded by the two forensic audits.** |

### `RESPONSIVE-REPORT.md`

| # | Stale statement | Verified current state |
|---|---|---|
| 18 | *"9 viewports x 3 screens = 27 samples"* covering **home, skill, practice** only | Does not cover **Learn** or **Test**. **Superseded** by the end-to-end audit's 8-viewport × 25-state matrix (200 measurements), which found the height defects this report could not see. |

### `REVIEW.md`

| # | Stale statement | Verified current state |
|---|---|---|
| 19 | *"**Do not merge this into `main`.** … If GitHub Pages publishes from `main`, merging is what changes the live site"* | **The premise no longer holds.** Pages publishes from the branch. Merging to `main` is no longer what publishes — and `main` must still not be touched without approval. |
| 20 | Describes the branch as pre-Test | Predates the dynamic Test entirely. |

### Source-comment discrepancy (not fixed — no code was changed)

| # | Stale statement | Verified current state |
|---|---|---|
| 21 | `index.html:34` comment: *"js/app.js probes `assets/images/sentence-sense-hero.**png**`"* | The file is `.jpg`, and `js/app.js:145` reads `HERO_PHOTO = "assets/images/sentence-sense-hero.jpg"`. **A stale comment only — behaviour is correct.** |

### Not a discrepancy, but worth stating plainly

`verification/README.md` says *"Two files"* — still true of the **scripts**
(`guard.js`, `serve.js`), though `verification/` now also holds `results.json`,
`responsive.json`, 43 screenshots and the README itself.

---

## 14. WHAT TO WORK ON NEXT — RECOMMENDATION, NOT AUTHORISATION

**Nothing below is approved. All of it needs Chris's word first.**

1. **Collect external tester feedback.** The build is public and this is the
   highest-value input available. Everything else is speculation until it lands.
2. **Decide the two content questions together** — §10A (the verb-phrase
   example) and D-E5 (the collapsed accordion). They are the same accordion and
   the same decision.
3. **Consider the three one-line fixes** — D-E8 (build badge contrast), D-E7
   (sub-14px Home labels), D-E9 (add `type` to Practice questions for template
   consistency). Small, low-risk, and D-E9 in particular removes a trap for
   whoever builds Subject.
4. **Then choose one of:**
   - **Expand the Verb pool toward ~80 questions**, which unlocks 40; or
   - **Write Subject Practice + Test content**, since Subject Learn is already
     live and the engines are skill-agnostic.

**Do NOT, without explicit approval:** start Subject/Noun/Adjective Practice or
Test; touch `main`; change the Pages source; alter any locked content; change
the build number; unlock 40; or redesign the hero.

---

*Reconciled 2026-09-22 against `claude/build-1.4` at
`aab173ad7dbfaeeee6d2419bc39a43b584944e42`. Build 1.4.0 live from the branch.
`main` untouched at `cc1f102924ad4bb74166b1ac056005c3854380e3`. No application
code was read-modified in producing this document.*
