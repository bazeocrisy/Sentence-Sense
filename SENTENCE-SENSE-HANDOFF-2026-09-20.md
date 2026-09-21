# SENTENCE SENSE — SESSION HANDOFF
## 2026-09-20

**Read this file and `SENTENCE-SENSE-HANDOFF.md` before doing anything else.**
This document is the startup brief for the next Claude session. It describes
where today ended, what is locked, what is deliberately unfinished, and what
must not be changed by accident.

---

## 1. DATE / SESSION

| | |
|---|---|
| **Date** | **2026-09-20** |
| **Project** | Sentence Sense — a static third-grade grammar app |
| **Branch** | **`claude/build-1.4`** |
| **Build** | Build 1.4.0 |
| **Owner** | Chris Bazemore |
| **Child tester** | Chris II |

Sentence Sense teaches a 3rd grader (ages 8–10) how a sentence works. Static
site: no database, no API, no accounts, no server state, no build system. The
only external request is the Google Fonts CDN. It is published with GitHub
Pages at zero recurring cost.

Product model: **HOME → SKILL → LEARN | PRACTICE | TEST → ACTIVITY.**
The child chooses *what* before *how*.

---

## 2. CURRENT GIT STATE

| | |
|---|---|
| **Branch** | `claude/build-1.4` |
| **Branch HEAD** | `04c820d627e384b5ed265abe0eabc539d55e8cfb` |
| **`origin/claude/build-1.4`** | `04c820d627e384b5ed265abe0eabc539d55e8cfb` — **matches** |
| **`main`** | `cc1f102924ad4bb74166b1ac056005c3854380e3` |
| **`origin/main`** | `cc1f102924ad4bb74166b1ac056005c3854380e3` — **matches** |
| **Working tree** | **clean** (before this handoff file was added) |

Last commit on the branch: **`04c820d` — Finalize Verb acceptance fixes for
live testing.**

`main` has not been modified at any point in this project. Every commit has
gone to `claude/build-1.4` only.

---

## 3. LIVE SITE STATUS

> ## DEPLOYMENT WAS NOT COMPLETED TONIGHT.
>
> The live site still serves **Build 1.2.7**. Build 1.4.0 — all of the Verb
> work — is committed and pushed to `claude/build-1.4` but is **NOT public**.

| | |
|---|---|
| **Public URL** | **https://bazeocrisy.github.io/Sentence-Sense/** |
| **Pages source** | **`main`, at repository root** |
| **Live build number** | **Build 1.2.7** |
| **Live verification** | **Not performed** — there was nothing new to verify |
| **Rollback reference** | **`live-build-1.2.7`** → `cc1f102924ad4bb74166b1ac056005c3854380e3` (annotated tag, pushed to origin) |

### How the Pages source was determined

Not assumed — proven. There is no `.github/workflows` directory, no `gh-pages`
branch (local or remote), no `/docs` folder, no `CNAME`, no `_config.yml`. The
live `index.html` (14,645 bytes) and the live `js/app.js` are **byte-identical**
to `main:index.html` and `main:js/app.js`.

**GitHub Pages serves `main` at root. There is exactly one Pages site on this
repository.**

### The consequence, and why nothing was deployed

Publishing Build 1.4.0 requires changing what `main` points at. `main` has been
explicitly protected by the owner in every message of this project, by exact
SHA. The owner asked to see the precise action before it was taken, so it was
presented and **not executed**. The session ended awaiting that approval.

### The two routes, both still open

**Option A — fast-forward `main`.** Verified: `main` *is* an ancestor of
`claude/build-1.4`, so this is a clean fast-forward with no merge commit and no
history rewrite. 13 commits move onto `main`.

```bash
cd C:\Sentence-Sense
git checkout main
git merge --ff-only claude/build-1.4      # cc1f102 -> 04c820d
git push origin main
git checkout claude/build-1.4
```

**Option B — repoint Pages, leaving `main` untouched.** *(Recommended. Requires
the owner; Claude has no `gh` CLI and no API token.)*

GitHub → **Settings → Pages → Build and deployment → Source: Deploy from a
branch** → change branch `main` → `claude/build-1.4`, folder `/ (root)` →
**Save**. Same public URL, Build 1.4.0 live, `main` never moves, and reverting
is one dropdown flip rather than a force-push.

### Exact rollback instructions (if Option A is used and must be undone)

```bash
cd C:\Sentence-Sense
git checkout main
git reset --hard live-build-1.2.7          # back to cc1f102
git push origin main --force-with-lease
git checkout claude/build-1.4
```

Live returns to Build 1.2.7 in roughly 1–2 minutes.
**A rollback does not affect `claude/build-1.4`** — all Verb work stays safe on
the branch and on the remote.

If Option B is used, rollback is simply changing the Pages source branch back
to `main`. No git operation at all.

---

## 4. VERB STATUS

| | |
|---|---|
| **Verb Learn** | **LOCKED** |
| **Verb Practice** | **LOCKED** |
| **Verb Dynamic Test** | **LOCKED** |
| **Test forensic audit** | **PASSED** — `FORENSIC-AUDIT-VERB-TEST.md` |
| **Dynamic Test forensic audit** | **PASSED** — `FORENSIC-AUDIT-VERB-DYNAMIC-TEST.md` |
| **End-to-end acceptance audit** | **PASSED WITH MINOR CORRECTIONS** — `FORENSIC-AUDIT-VERB-END-TO-END.md` |
| **External user testing** | **BEGINNING** |

**Verb remains the reference implementation for Subject, Noun and Adjective.**
Build the remaining three against Verb, not against an idea of what they should
be.

---

## 5. TODAY'S COMPLETED WORK

**Dynamic Test — final lock.** The Verb Test no longer reshuffles a fixed 12.
It samples a balanced assessment from a curated **48-question pool**
(32 action / 16 being, three difficulty bands, all five being forms). Child-
facing lengths are **12 / 20 / 30**; **40 is built, harnessed and audited but
hidden**. Committed as `5ae91a2`.

**Harness at 304 / 304 passing**, up from 267 at the previous lock.

**End-to-end acceptance audit** of the whole Verb journey — 25 states, 8
viewports, 200 measurements, 138 contrast nodes. Verdict: *ACCEPTANCE READY
WITH MINOR CORRECTIONS*. 0 Critical, 0 High, 5 Medium, 5 Low. It found what
three previous audits had missed: **every prior responsive pass measured width
and ignored height.**

**Height / flow correction pass** — commit `04c820d`:

- **D-E2 Home — FIXED.** The entry screen could present the app with nothing
  to press on a short phone. A visible Start control now exists at every tested
  viewport (768 → 652 at 375×667).
- **D-E3 Practice feedback — FIXED.** All 8 viewports, all 5 escalation states
  (before, first wrong, clue, second wrong, reveal), feedback fully visible
  throughout.
- **D-E4 Learn "Let me try" — FIXED.** All 8 viewports, all 3 states.
- **D-E1 Learn step 2 — ACCEPTED with normal scroll residue.** See §6B.

**Real child testing with Chris II.** He moved through action verbs quickly and
hesitated more on being verbs. He also reported that the hero image looks too
AI-generated. See §6D and §6E.

**Verb-phrase forensic audit — read only, nothing changed.** Triggered by
Chris II encountering what looked like a multi-word verb. All 76 Verb sentences
were analysed grammatically, not by pattern. Result: exactly **one** true verb
phrase exists in the entire app, it is an unscored Learn display example, and
**no Practice or Test question contains a verb phrase at all**.

**Practice bank independently reviewed** — all 20 questions printed verbatim
and analysed word by word. **Every one of the 68 assessed answers across
Practice and Test is grammatically complete and correct.**

> **Practice and Test contain no scored true verb-phrase defect.**

---

## 6. KNOWN DEFERRED ITEMS

### A. Learn verb-phrase example — LOW severity, deliberate decision required

**Sentence:** *The workers are building a house.*
**Location:** Learn → Step 2 → *Words to remember* (a collapsed `<details>`,
closed by default) → study-guide contrast *"The same word can do two different
jobs"*.

- Full verb phrase is **`are building`**; the example marks **`building`** alone
- The visible label is **"TELLS WHAT THEY DO"**, not "VERB"
- Caption: *"Here, building tells what the workers are doing."* — grammatically
  true of a progressive's main verb
- The parallel row *does* say *"The verb is is."*; this row deliberately does not
  make the equivalent claim
- **Unscored** — no prompt, no choices, nothing measured
- The only true verb phrase in all 76 Verb sentences
- **Severity LOW.** Answer integrity is fully intact.

**What is genuinely incomplete:** `are` sits unmarked beside a marked
`building`, one screen after the child learns `am/is/are/was/were` are being
verbs, with no vocabulary offered to reconcile them. Verb phrases, helping verbs
and main verbs are **never** named anywhere in Verb content (0 occurrences of
"helping verb", "main verb", "verb phrase", "auxiliary").

> **DO NOT silently change this next session.** It is a deliberate content
> decision for the owner. If the *Words to remember* accordion is ever opened by
> default (see D-E5), this example becomes far more visible — decide the two
> together.

**A constraint this creates.** The answer model permits exactly one correct
token, so any future sentence using `BE + -ing`, `have + participle` or
`modal + base verb` would be unanswerable under it. That applies to the Phase-2
pool expansion **and to Subject, Noun and Adjective**.

### B. D-E1 — Learn Step 2 scroll residue — ACCEPTED, not a blocker

`ok` on desktop and both tablet orientations; a sliver `cut` on laptop and large
phone; a normal scroll of ~120–300px on 390×844, 375×667 and 390×650.

**Why it was accepted rather than fixed:** at 375×667 that step's content
measures **653px** inside a 667px viewport that must also carry the header, step
indicator, lesson title and controls. The content alone exceeds the screen.
Closing the gap would require shrinking instructional text, hiding content, or
collapsing what should stay visible — all three refused. **Next is never
unreachable**, the cut card at the fold is an honest scroll cue, and keyboard
reaches Next in 3 Tabs at every viewport.

This is a content-volume question, not a layout one.

### C. D-E5 through D-E10 — deferred

| ID | Sev | Summary |
|---|---|---|
| **D-E5** | MEDIUM | The teaching that corrects the `-ing` clue lives in a collapsed accordion. Learn lists `running` as an action verb; 12 Test questions use `-ing` distractors, one of them the literal word `running`. The visible warning *"These endings are clues. They are not rules."* does correct it in general terms, but the worked counter-example is hidden. **Content decision.** |
| **D-E6** | LOW | The prompt *"What happens?"* (17 questions) is never taught. Learn teaches *"What happened?"* and *"What is happening?"*. Terminology inconsistency. **Content decision.** |
| **D-E7** | LOW | Sub-14px non-actionable text on Home: `.hq-label` 12.5px ×4 (*Learn · Practice · Improve · Grow*), `.hb-line` 12.8px (standards badge). |
| **D-E8** | LOW | `.build-badge` fails WCAG AA at **2.80:1**. The only genuine contrast failure in 138 measured text nodes. One-line fix. |
| **D-E9** | LOW | Practice classifies by `stage`; Test uses `band` + `type`. Practice has no `type` field. A trap for anyone treating Verb as the template — it caused a misreading during the audit itself. |
| **D-E10** | LOW | Long-test review is an unbounded scroll — 4,888px at 12 questions on a phone; ~2.5× at 30. No jump-to-miss. |

### D. Hero image — Chris II feedback, do not act without approval

Chris II felt the current classroom hero image **looks too AI-generated**. He
suggested **more colour and design around the centre piece**.

This is user feedback on an owner-supplied, owner-approved asset
(`assets/images/sentence-sense-hero.jpg`). **Do not redesign, replace,
regenerate or restyle the hero without explicit approval.** The banner layout is
already audited and locked, including the phone/desktop split and the WCAG scrim.

### E. Being verbs — user-testing observation, not a proven defect

Chris II **handled action verbs easily and hesitated more on being verbs.**

Record this accurately: it is **user-testing feedback, not a software defect.**
The alignment was independently verified today:

- Learn teaches both verb jobs with equal billing, and carries a being-verb
  fallback with all five forms
- Practice is 14 action / 6 being (30%), **all five being forms**, spread across
  all four stages
- Test is 32 action / 16 being (33%), all five forms
- Mastery requires the being subscale independently, so a strong action score
  **cannot** hide weak being-verb understanding

Nothing is broken. Whether being verbs need *more* reinforcement is an
instructional judgement for the owner, informed by more testers.

---

## 7. VERB TEST ARCHITECTURE

| | |
|---|---|
| **Pool** | **48 questions**, ids `V001`–`V048` |
| **Split** | **32 action · 16 being** (66.7% / 33.3%) |
| **Bands** | 1 confidence · 2 look closer · 3 strongest reasoning — 16 each (b1 11A/5B · b2 11A/5B · b3 10A/6B) |
| **Being forms** | **all five** — `am` 2 · `is` 4 · `are` 4 · `was` 4 · `were` 2 |
| **Child-facing lengths** | **12 / 20 / 30** — 12 preselected, numbers only in the selector |
| **Built but hidden** | **40** |

**Sampling.** Blueprint first, randomness second: ~2/3 action and ~1/3 being at
every length; band 1 → 2 → 3 always; shuffle **within** a band, never across;
exact per-band cell counts; never a duplicate inside one sitting. The being
remainder goes to the **earliest** band — concentrating being verbs in band 3
would report weakness that is really band-3 difficulty.

| Length | Band 1 | Band 2 | Band 3 | Action | Being |
|---|---|---|---|---|---|
| **12** | 4 (2A/2B) | 4 (3A/1B) | 4 (3A/1B) | 8 | 4 |
| **20** | 7 (4A/3B) | 7 (5A/2B) | 6 (4A/2B) | 13 | 7 |
| **30** | 10 (6A/4B) | 10 (7A/3B) | 10 (7A/3B) | 20 | 10 |
| **40** *(hidden)* | 14 (9A/5B) | 13 (9A/4B) | 13 (9A/4B) | 27 | 13 |

**Recent-question avoidance.** `sessionStorage`, key `ss.test.recent.verb`,
**IDs only** — no score, no name, no timing. Written at submission, so a child
who walks away burns no freshness. Dies with the tab, which is the right
boundary on a shared classroom machine. **Balance always overrides freshness:**
each cell fills from fresh questions first and stale ones only after, so reuse
is the minimum necessary by construction.

**Dynamic thresholds** — round-half-up integers, never floating point:

| Length | Overall | Action | Being |
|---|---|---|---|
| **12** | 10 of 12 | 7 of 8 | 3 of 4 |
| **20** | 17 of 20 | 11 of 13 | 5 of 7 |
| **30** | 25 of 30 | 18 of 20 | 8 of 10 |
| **40** *(internal)* | 33 of 40 | 24 of 27 | 10 of 13 |

> **Mastery is permanently a CONJUNCTION: overall AND action AND being.**
> Proved exhaustively over 780 score pairs — 36 pass on the overall score alone
> while a subscale is weak, and all 36 are denied.

**Results.** Large score plaque (a count, never a percentage); Action and Being
bars, each with its text score; guidance card; **no per-question dots at any
length**; both bars the same colour with the text carrying the meaning;
**celebration gated on mastery, permanently**.

**Result CTA logic.** "Try again" is never primary after a weak score —
re-measuring without instruction in between measures nothing.

| Result | Primary | Secondary | Tertiary |
|---|---|---|---|
| Mastered | Back to Verb | See my answers | Try again |
| Action weak / Being weak / Almost | **Practice verbs** | See my answers | Back to Verb |
| Low overall | **Learn verbs** | See my answers | Back to Verb |

### Why 40 stays hidden

At 48 questions a 40-question sitting is 83% of the pool and is **partly
deterministic**: band 1 needs five being questions and the pool holds exactly
five, so **V002, V004, V007, V010 and V013 appeared in all 3,000 audited
draws.** Retest freshness collapses to 20%. Shipping it would undo the work the
dynamic Test exists to do.

**Unlocking is a one-array content edit** once the pool reaches roughly **80
audited questions**: move `40` from `testPool.sizesBuilt` into
`testPool.sizes`. No code change.

---

## 8. IMPORTANT LOCKS

**Do not modify any of these without explicit owner approval:**

- Verb **Learn** content
- Verb **Practice** bank (all 20 questions, feedback, clues, reveals)
- Verb **Test pool** (all 48 questions, choices, answers, tags, `why` lines)
- Test **scoring** — thresholds, ratios, the mastery conjunction
- Test **selector behaviour** — 12/20/30 offered, 40 hidden
- **CTA behaviour** on the results screen
- **`js/test.js`**
- The **approved question bank** — it is the educational source of truth
- **`main` branch**

**If a future session proposes changing any of the above, it must first explain
why, and wait.** The owner supplies the educational content; Claude implements,
validates, samples, scores, renders and audits it. Do not write, paraphrase,
"improve" or silently correct a sentence, choice, tag or explanation while
coding. If content looks wrong: **STOP, name the exact question ID, explain the
concern, and wait.**

### Permanent rules that have already cost real defects

- **A green harness is not proof.** Two of four Verb Test v1 defects were
  invisible to every automated check and were found by looking at rendered
  screenshots. The dynamic-Test defect D-A1 was invisible to every check that
  existed and was found only by writing a probe for the invariant itself. **Always
  look at the screenshots.**
- **Being-verb safety rule (Build 1.2.6).** After a being verb use plain
  adjectives — never an `-ed`/`-en` word, which reads as a past participle and
  makes the answer ambiguous.
- **D-A1.** No answer explanation may exist anywhere in the DOM while a Test
  question is on screen. Guarded by harness checks 13.29 and 13.30.
- **Learn teaches, Practice coaches, Test measures.** `js/practice.js` and
  `js/test.js` are separate engines and must stay separate.

---

## 9. FILES / AUDITS TO READ FIRST NEXT TIME

Read in this order:

1. **`SENTENCE-SENSE-HANDOFF.md`** — the current shipped state, file map,
   product model, permanent rules
2. **`SENTENCE-SENSE-HANDOFF-2026-09-20.md`** — this file; where today ended
3. **`FORENSIC-AUDIT-VERB-DYNAMIC-TEST.md`** — the Test engine, sampling,
   scoring proofs, defect D-A1
4. **`FORENSIC-AUDIT-VERB-END-TO-END.md`** — the whole-journey acceptance audit,
   the D-E1…D-E10 register, and Appendices A and B covering the correction pass

---

## 10. NEXT SESSION STARTUP PLAN

**A.** Read both handoff files.
**B.** Verify the current branch and SHA:
```bash
git rev-parse --abbrev-ref HEAD      # expect claude/build-1.4
git rev-parse HEAD                   # expect 04c820d... unless work resumed
git rev-parse main                   # expect cc1f102... unless deployed
git status
```
**C.** Verify live site status — is it still Build 1.2.7, or was the deployment
completed after this session ended?
```bash
curl -s https://bazeocrisy.github.io/Sentence-Sense/js/app.js | Select-String BUILD_NUMBER
```
**D. Do NOT start Subject automatically.**
**E. Ask the owner what he wants to work on.**

### Possible future work — none of it authorised yet

- Review external tester feedback
- Decide the Learn verb-phrase example (§6A)
- Decide the hero image question (§6D)
- Decide whether being-verb reinforcement needs adjustment (§6E)
- Complete the deployment (§3) if it was not done
- Expand the Test pool toward ~80 audited questions, then unlock 40
- Address D-E5 … D-E10
- **Begin Subject only when the owner explicitly approves it**

---

## 11. SAFETY RULES

- **No merge to `main` unless explicitly approved.**
- **No deploy unless explicitly approved.**
- **No content rewrite without approval.**
- **Do not start Subject automatically.**
- **Audit before broad changes.**
- **Preserve rollback references** — do not delete the `live-build-1.2.7` tag.
- Work only on `claude/build-1.4`.
- Do not commit or push until the owner approves that specific step.
- Keep harness dependencies (`puppeteer-core`, `node_modules`) out of the
  repository — they live in the session scratchpad.
- Report outcomes faithfully. If a check fails, say so with the output. If a
  finding turns out to be an instrument artifact, document it rather than
  deleting it — a quietly removed false positive is indistinguishable from a
  quietly ignored real one.

---

*End of session 2026-09-20. Branch `claude/build-1.4` at
`04c820d627e384b5ed265abe0eabc539d55e8cfb`. `main` untouched at
`cc1f102924ad4bb74166b1ac056005c3854380e3`. Nothing deployed. Subject not
started.*
