# Sentence Sense — Build 1.3 Audit Report

**Build:** Sentence Sense — Build 1.3
**Type:** Feature build. This is the first build of the Georgia grade 3 standards upgrade.
**Date:** 2026-10-18 (overnight, unattended)
**Spec:** `STANDARDS-ALIGNMENT.md` §6, row 1.3
**Delivered as:** branch `build-1.3` with a pull request. `main` and the live site were not touched.

---

## VERDICT

| Dimension | Verdict |
|---|---|
| **APPLICATION STABILITY** | **PASS** |
| **INSTRUCTIONAL ACCURACY** | **PASS**, after an independent review. 3 must-fix and 14 should-fix/nit items were found and fixed (§5). |
| **NEW BANKS (Pronoun, Adverb, Complete Sentence)** | **PASS** |
| **UNIT NAVIGATION** | **PASS** |
| **RESPONSIVE UX** | **PASS WITH KNOWN ISSUES**. D-27 is unchanged. The new topics add no desktop below-fold states (§4F). |
| **ACCESSIBILITY** | **PASS WITH KNOWN ISSUES**. D-35 is still deferred. |
| **STANDARDS TAGGING** | **PASS**. Every question in every topic carries `std` tags (§3). |
| **OVERALL BUILD 1.3** | **PASS WITH KNOWN ISSUES** |

---

## 1. RECONCILIATION BEFORE EDITING

I compared the repo at `main` (`cc1f102`, Build 1.2.7) against the handoff and AUDIT-REPORT-Build-1.2.7. Code matched the handoff. I found two discrepancies.

**N-1: four audit files were in the repo.** The handoff says *"One audit in the repo, ever"*. `main` actually held 1.2.3, 1.2.4, 1.2.5 and 1.2.7. **Resolution:** this build removes all four and adds 1.3. Git history keeps the old ones.

**N-2: the permanent harnesses do not exist in the repo.** Handoff §12c lists `bankguard.js`, `respguard.js`, `stateguard.js` and others. They live on the owner's machine, which this build could not reach. **Resolution:** I wrote three new harnesses that live outside the project: `contentguard.js`, `browserguard.py` and `foldcheck.py` (§4). They cover the same concerns for the new work: choice shuffle, identity by `dataset.ci`, bank recap, responsive layout, §12b placement and control visibility. **The owner's original harnesses should still be run locally before merging.** This is limitation L-07.

**N-3: one stray asset on `main`.** `assets/Sentence-Sense_logo.png` is not referenced by any page, style or script, and it fails the §13 delivery gate. **Resolution:** I left it in place because it is the owner's file, and the gate reports it. Delete it in a later build if it is not wanted.

---

## 2. WHAT CHANGED

### 2a. Topic screen: units (approved by the owner on 2026-10-18)

The fixed 3 × 2 grid could not hold the roughly 26 topics planned. The topic screen now has two views on one screen:

| View | Shows | Back / Escape |
|---|---|---|
| **Units** | three unit cards: *Words and Their Jobs* (5), *Parts of a Sentence* (3), *Building Sentences* (1) | Home |
| **Unit** | that unit's topic cards | the units view (button reads **All Units**) |

- The unit cards reuse the topic-card component. They add a fourth level, the topic count, and have no new hues. Their colours are the Verb blue, the Subject green and the Complete Sentence navy.
- **All Topics** (on the lesson footer, the milestone and completion screens) and **Escape** from a lesson return to **that topic's unit**. **Home → Learn** always opens the units view.
- The strategy box shows on the units view and inside *Parts of a Sentence*, the unit whose topics it describes.
- `C.order` is now the flattened unit order: verb, noun, pronoun, adjective, adverb, subject, complete subject, predicate, complete sentence. **Next topic** therefore stays inside a unit until the unit is finished, then continues to the next unit.

### 2b. Three new topics, each with a 20-question guided bank

| Topic | Unit | Georgia codes | Stages |
|---|---|---|---|
| **Pronoun** | Words | GUM personal pronouns (R), **reflexive pronouns (M)**, pronoun-antecedent agreement (C) | find it → owner and receiver forms → what it stands for and agreement → reflexives |
| **Adverb** | Words | **3.L.GC.2.d**, GUM adjectives/adverbs (R), 3.L.V.2.b | how → when and where → adverb or -ly adjective → fill the blank |
| **Complete Sentence** | Build | **3.L.GC.2.a**, **3.L.GC.2.b**, **GUM comma + coordinating conjunction (M)** | missing subject → missing predicate → run-ons → *Which is the best way to fix it?* |

All three follow the bank contract (handoff §5b):

- each bank carries its own `recap`
- there is no `tryIt` alongside a bank
- four choices per question, exactly one correct
- a `clue` and a `reveal` on every question
- stages are shuffled inside themselves, choices are shuffled on every render

Stage 4 of Complete Sentence uses the Georgia Milestones item format: choose the correctly written sentence.

### 2c. Engine changes (`js/learn.js`, `js/app.js`)

- Unit views: `openLearn`, `openUnit`, `topicsBack`, plus `openTopics` that is aware of which unit a topic belongs to.
- **Whole-sentence choices** (`.is-sentences`, used when the longest choice is over 30 characters) stack in one left-aligned column at every width. This beats the projector grid rule because it uses two classes.
- No change to the bank engine, the shuffle, answer identity, escalation or the plain → marked renderer.

### 2d. Colour (handoff §10)

Three topic identities were added. Each belongs to the colour family of the part of speech it relates to. White text contrast, measured:

| Topic | Header gradient | Mark colour | White text |
|---|---|---|---|
| Pronoun | `#5E2D86 → #7B3FA6` (noun family) | `#7B3FA6` | 9.56 / 6.77 |
| Adverb | `#8E2350 → #B02E63` | `#B02E63` | 8.38 / 6.15 |
| Complete Sentence | `#12325B → #2B5A94` | `#1F4A80` | 12.86 / 7.02 |

Mark colours on the light lesson background (`#EDF7FF`) are 6.23 (pronoun), 5.66 (adverb) and 8.24 (complete sentence). All pass AA.

### 2e. Standards tags

Every topic has `standards[]`. Every bank question and every single Try It carries `std[]`. Each tag is either a syntax/vocabulary code (`3.L.GC.2.a`) or a GUM row (`GUM:M:comma-coordinating-conjunction:M`). The engine ignores the tags. `contentguard.js` reads them to report coverage.

---

## 3. STANDARDS COVERAGE AFTER BUILD 1.3

Question counts per tag, from `contentguard.js`. Build 1.2.7 had **0 of 8** GUM Master skills and **0 of 4** syntax standards taught directly.

| Tag | Questions | Code |
|---|---|---|
| 3.L.GC.2.a (simple/compound/complex, correct structure) | 23 | syntax |
| 3.L.GC.2.b (sentence variety) | 5 | syntax |
| 3.L.GC.2.d (adjectives and adverbs add detail) | 21 | syntax |
| 3.L.V.2.b (affix signals part of speech) | 9 | vocab |
| GUM reflexive pronouns | 5 | **M** |
| GUM coordinating conjunctions | 2 | **M** |
| GUM comma + coordinating conjunction | 3 | **M** |
| GUM pronoun-antecedent agreement | 10 | C |
| GUM helping and linking verbs | 5 | I |
| GUM personal pronouns · action verbs · adjectives/adverbs · complete thoughts · common/proper nouns · end punctuation · first-word capitals | 10 · 20 · 21 · 11 · 1 · 1 · 1 | R |

**Now:** 3 of 8 Master skills are touched (reflexive pronouns, coordinating conjunctions, the comma in compound sentences). 3 of 4 syntax standards are touched; **3.L.GC.2.c (subject-verb agreement) is next, in Build 1.4.** Coordinating conjunctions get their own topic in Build 1.5.

---

## 4. VERIFICATION

The harnesses live outside the project ZIP, as handoff §12c requires.

| Harness | Result | What it checks |
|---|---|---|
| `contentguard.js` | **2490 checks, 0 FAIL, 0 WARN** | units ↔ order integrity; every topic reachable; every spec: capital, end mark, mark/link/split ranges, one-word marks, label length, being-verb rule (§5b); every question: 4 choices, exactly 1 correct, unique texts, feedback names the word, clue and reveal present, single-word choices appear in the sentence, one blank per fill-in; bank: recap, stages non-empty, no duplicate sentences, no `tryIt` alongside (D-33); NYI-term scan; CSS exists for every colour and mark kind; std tag format and coverage |
| `browserguard.py` | **2557 checks, 0 FAIL** | see A–G below |
| `foldcheck.py` | **0 below-fold** | the Next button on every step of all **nine** topics at 1024×768, 1280×720, 1366×768, 1440×900, 1600×900, 1920×1080 |

**browserguard detail**
- **A** Badge reads `Sentence Sense — Build 1.3`, and so does the `BUILD_NUMBER` const.
- **B** Units view → every unit → every topic list in order. Strategy box visibility, the **All Units** label, Back and Escape at both levels, and focus on the heading.
- **C** All **nine** topics walked from Definition through completion. The plain → marked pair renders on every annotated step, with the plain sentence word-for-word equal to `words[]`. All 80 bank questions (Verb plus the three new banks) were answered by `dataset.ci`. Milestone count, the "Question X of 20" text, the question text and the right-answer feedback were checked. Bank recap (D-30), done title, the Next-topic label, and **All Topics → the topic's own unit** were all confirmed. Home → Learn after a lesson opens the units view.
- **D** Escalation on each new bank: the 1st wrong answer gives word feedback plus *Try again.* and Next stays locked; the 2nd gives the clue; the 3rd gives the reveal, marks the correct button **by `ci`**, and enables Next.
- **E** Choice shuffle (D-29) over 60 renders per bank. Correct-position counts: pronoun {13, 18, 13, 16} · adverb {14, 15, 14, 17} · complete sentence {13, 13, 19, 15}.
- **F** Nine viewports: 375×667, 390×844, 667×375, 768×1024, 1024×768, 1280×720, 1366×768, 1920×1080, 2560×1440. Zero horizontal overflow on the units view, the unit view, and every step of the three new topics. The header → rail gap was ≤ 60px everywhere (§12b). Whole-sentence choices render in one column at every width.
- **G** Zero console or page errors. The only failed requests were to the blocked font CDN (L-01). `localStorage` and `sessionStorage` stayed empty.

**F, one finding fixed during the build.** At first the Pronoun Definition put Next **72–133px below the fold** on 1024×768, 1280×720 and 1366×768, and the Clue and Example steps were 7–23px below at 1280×720. The cause was a three-card chip grid plus a four-mark sentence. The pronoun forms moved into a three-line list, and the clue and example lines were tightened. After that, Next was above the fold at every desktop size for all nine topics.

**Screenshots** (in the deliverables ZIP) were taken after a 450ms settle (handoff §5b, screenshot note). They cover the units view and the *Words* unit at all nine viewports, the Definition step of each new topic at 375, 1366 and 1920, Try It at 375 and 1366, the Complete Sentence fix-it stage at 375, 1366 and 1920, the Adverb third-strike reveal, and each new completion screen. All were reviewed by eye.

---

## 5. INDEPENDENT CONTENT REVIEW

A separate reviewer that had not written the content checked all 60 new questions and every teaching sentence against `STANDARDS-ALIGNMENT.md` §3, §5 and §8. **Its finding: every one of the 60 marked answers is correct and the only defensible choice. No question had two right answers, and there were no being-verb violations.** It found problems in the explanations around the answers. All are fixed:

| # | Sev. | Finding | Fix |
|---|---|---|---|
| 1 | MUST | Pronoun lesson said *"Every pronoun points back to a noun."* That is false for I, me, we and us, and the app's own Q5 and Q7 feedback contradicted it. | Changed to *"Most pronouns point back to a noun. I, me, we, and us stand for the person talking."* Steps now read *"When that noun is in the sentence…"* |
| 2 | SHOULD | Adverb Q6 and Q8 feedback said a noun (*garden*, *corner*) "tells where", which contradicts *"an adverb tells where."* | Now says *the words in the garden* tell where, and the adverb is the **one word** that tells when. |
| 3 | SHOULD | Adverb Q10 distractor *art* was described as telling "what kind," which taught it as an adjective. | Replaced with *new* (a real adjective). |
| 4 | SHOULD | Adverb Q10 assumed the teacher was *she*. | Changed to *the teacher*. |
| 5 | SHOULD | Complete Sentence clue *"What happened? That is the predicate."* fails on *was* sentences. | Changed to *"What does it do, or what is it?"* |
| 6 | SHOULD | Run-on feedback listed the two halves with no quotation marks, so it read like a fixed sentence. | Each half is now in quotation marks. |
| 8 | SHOULD | Adverb Q14 implied a phrase is not an adverb only because it is two words. | Removed. |
| 9 | NIT | Participle-form adjectives (*tired, excited, winning*) were in adverb sentences, and participles are NYI. | Replaced with *tall, eager, happy, their*. |
| 10 | NIT | *whispered quietly* is redundant. | Changed to *played quietly*. |
| 11 | NIT | Q19 said the sentence "already has its verb" when it has two. | Reworded. |
| 12 | NIT | The agreement warning omitted *it*, and a reflexive heading omitted things. | Both fixed. |
| 13 | NIT | *"she visits every summer"* was slightly unnatural. | Changed to *"she visits us every summer"*. |
| 14 | NIT | *"I made me a sandwich"* and *"We made us a fort"* are common in Georgia speech. | Feedback now opens *"In correct writing…"*, which respects home dialect. |
| 15–17 | NIT | Predicates were quoted cut short in Complete Sentence Q1, Q3 and Q4; Q17 wording was loose. | Full predicates are quoted; Q17 now says *"It needs a verb, like ran."* |

**Not changed, for the owner to decide (D-37):** the reviewer noted that kid-facing feedback lines start with a lowercase word (*"school names a place."*). The same pattern runs through the existing Verb bank and every Try It since Build 1.1. Fixing it consistently means changing roughly 300 strings across all topics, or teaching the engine to style the target word. That is a separate decision from adding the new topics.

**Not changed, by design:** unit A's topic order puts Verb first (verb, noun, pronoun, adjective, adverb). The spec lists Noun first, but the app's own strategy starts with *"Find the verb"*, and Verb was topic 1 in every earlier build.

---

## 6. DEFECT LEDGER

| ID | Status | Note |
|---|---|---|
| D-27 | **OPEN** | Unchanged from 1.2.7. Phone below-fold remains acceptable. The new topics add **no desktop** below-fold state (§4F). |
| D-26 | **OPEN / DEFERRED** | Unchanged. |
| D-20 | **OPEN** | Abstract nouns still have no demonstration in a marked sentence. Planned for *Kinds of Nouns* (Build 1.6). |
| D-35 | **OPEN / DEFERRED** | Unchanged. |
| **D-37** | **NEW, OPEN** | Feedback lines begin with a lowercase target word (*"playful tells…"*). This predates 1.3. Owner decision needed (§5). Severity 4. |
| D-11 | **CLOSED / CHANGED BY DESIGN** | The six-card portal it covered has been replaced by units. |

---

## 7. LIMITATIONS

L-01 to L-06 from 1.2.7 still apply: no real webfont, simulated devices only, no projector, no screen reader, no child, Chromium only. One is new:

**L-07: the owner's permanent harnesses (§12c) were not run.** They are not in the repository. This build's harnesses cover the new work, but `bankguard`, `respguard`, `stateguard`, `place.js` and the rest should be run locally against branch `build-1.3` before merging. **One expected break:** any harness that assumes the topic screen shows six topic cards will now find three unit cards.
