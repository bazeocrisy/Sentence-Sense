# Sentence Sense — Build 1.4 Audit Report

**Build:** Sentence Sense — Build 1.4
**Type:** Feature build. This is part 2 of the Georgia grade 3 standards upgrade.
**Date:** 2026-10-18 (overnight, unattended)
**Spec:** `STANDARDS-ALIGNMENT.md` §6, row 1.4
**Base:** Build 1.3, branch `build-1.3`, PR #1. This branch is `build-1.4`. **Merge #1 first.**
**Gate:** Build 1.3 passed every check before work on 1.4 began, as agreed with the owner.

---

## VERDICT

| Dimension | Verdict |
|---|---|
| **APPLICATION STABILITY** | **PASS** |
| **INSTRUCTIONAL ACCURACY** | **PASS**, after an independent review. One must-fix and 21 should-fix or nit items were found and fixed (§4). |
| **NEW BANKS (Helping & Linking, Verb Tense, Subject-Verb Agreement)** | **PASS** |
| **RESPONSIVE UX** | **PASS WITH KNOWN ISSUES.** D-27 is unchanged. One observation is new, O-1 (§5). |
| **ACCESSIBILITY** | **PASS WITH KNOWN ISSUES.** D-35 is still deferred. |
| **OVERALL BUILD 1.4** | **PASS WITH KNOWN ISSUES** |

There was no engine change. Build 1.4 is content, colour and data only.

---

## 1. WHAT CHANGED

| Topic | Unit, position | Georgia codes | Bank stages |
|---|---|---|---|
| **Helping & Linking Verbs** | Words, after Verb | GUM helping and linking verbs (**I**) | find the helping verb → find the main verb → find the linking verb → is/was/were: helping or linking? |
| **Verb Tense** | Words, after Helping & Linking | GUM simple tenses (R), **irregular past tense (M)**, **3.L.GC.2.b** consistent tense | time words → special past-tense words (ate, went, caught; with eated and goed as the teaching distractors) → keep the second verb in the same tense → choose the correctly written sentence |
| **Subject-Verb Agreement** | Building Sentences, after Complete Sentence | **3.L.GC.2.c**, GUM **collective nouns (M)**, prepositional phrases (C), verbs + -s/-es (R) | one or more than one → am/is/are, including "and" subjects and *team* → skip the words between subject and verb → choose the correctly written sentence |

- **Units now hold:** *Words and Their Jobs* (7): verb, helping & linking, verb tense, noun, pronoun, adjective, adverb. *Parts of a Sentence* (3), unchanged. *Building Sentences* (2): complete sentence, subject-verb agreement. `C.order` was updated to match.
- **Colour.** Headers and cards stay in the verb family: Helping & Linking `#1D3FA8 → #3A5BD9` and Verb Tense `#0E5A8A → #176A9E`. Agreement runs subject green into verb blue, `#145C39 → #0F4FBF`. With white text the contrast ratios are 9.02 and 5.71, 7.37 and 5.85, and 8.02 and 7.26. All marks use existing kinds, so no new `--c-*` tokens were added.
- **Grade-3 guardrails written into the content:**
  - Present tense is taught as "now or every day". It is never taught as "ends in -ing", because that rule is wrong and the -ing forms are not yet introduced (NYI).
  - "is running" is taught only as **helping verb + main verb**. No progressive or perfect tense is named.
  - *has* and *have* are not listed as helping verbs, because their only helping use is the perfect tense (NYI).
  - Every Verb Tense item that uses a present-time cue also has a second verb that fixes the tense. Without it, "Every Saturday he mowed" would be correct English too.
  - Agreement's action-verb choices are present tense only (V-s, V, V-ing, to V), so no past form can also be right.
- **Feedback convention, piloting D-37.** In the three new banks, a feedback line that starts with its own one-word choice now starts with **"The word …"**. Be-forms are put in quotation marks, for example *"The word “is” goes with one…"*. This was needed here for two reasons. Lines like "bees is more than one" showed the very agreement error being taught. And "so is is the helping verb" was unreadable. Topics built in 1.1 through 1.3 are unchanged until the owner decides D-37.
- Build number is **1.4** in the four required places.

---

## 2. STANDARDS COVERAGE AFTER BUILD 1.4

Question counts per tag, from `contentguard.js`.

| Tag | 1.3 | **1.4** |
|---|---|---|
| 3.L.GC.2.a structure | 23 | 23 |
| **3.L.GC.2.b** variety and consistent tense | 5 | **12** |
| **3.L.GC.2.c** subject-verb agreement | 0 | **20** |
| 3.L.GC.2.d adjectives and adverbs | 21 | 21 |
| GUM **irregular past tense (M)** | 0 | **7** |
| GUM **collective nouns (M)** | 0 | **2** |
| GUM reflexive pronouns (M) · coordinating conjunctions (M) · comma + conjunction (M) | 5 · 2 · 3 | 5 · 2 · 3 |
| GUM prepositional phrases (C) · pronoun agreement (C) | 0 · 10 | **7** · 10 |
| GUM helping and linking verbs (I) | 5 | **25** |
| GUM simple tenses (R) · verbs + -s/-es (R) | 0 · 0 | **20** · **7** |

**Syntax standards: all 4 of 4 are now taught directly.** GUM Master skills touched: **5 of 8**. Still to come are irregular plural nouns, hyphens at line breaks, and apostrophes for contractions and singular possessives, in Builds 1.6 and 1.7.

---

## 3. VERIFICATION

All harnesses live outside the project (handoff §12c).

| Harness | Result |
|---|---|
| `contentguard.js` | **3944 checks, 0 FAIL, 0 WARN.** Covers all 12 topics. |
| `browserguard.py` | **2881 checks, 0 FAIL.** All **12** topics were walked to completion, and all **140** bank questions were answered by `dataset.ci`. Also checked: unit navigation, escalation on each new bank, choice shuffle, the 9-viewport matrix, sentence-choice columns for Complete Sentence, Verb Tense and Agreement, console errors, and storage. |
| `foldcheck.py` | **0 below-fold.** Checks Next on every step of all **12** topics at 6 desktop sizes. |

**Choice shuffle (D-29), correct-answer position counts over 60 renders:**
- Helping & Linking: {20, 15, 14, 11}
- Verb Tense: {10, 13, 17, 20}
- Agreement: {14, 14, 17, 15}

**Found and fixed during the build.** After the reviewer asked for was/were to be taught, the Agreement definition first measured **8px** below the fold at 1280×720, and **3px** after the first trim. The list was merged and the note shortened. It now sits 22px above the fold at 1280×720.

**Harness change.** `contentguard.js` now recognises the label-choice question *"What job does the word … do?"*. It no longer requires those choices (helping verb, linking verb, and so on) to appear in the sentence. It flagged 5 false positives before this change.

---

## 4. INDEPENDENT CONTENT REVIEW

A separate reviewer, who had not seen the content being written, checked all 60 new questions against the spec. **One MUST-FIX was found:** Agreement Q3 (*"Our teacher ____ a new book…every Friday"*) had a second correct answer, because "read" is also the past tense and "Our teacher read a book every Friday" is correct English. The verb is now **brings / bring**, which has no such reading. The reviewer checked every other base-form distractor and found that none can be read as past tense.

Should-fix items, all fixed:

| Finding | Fix |
|---|---|
| "bees is more than one" and "is is the helping verb" read as the error being taught | "The word …" convention, with quotation marks on be-forms (§1) |
| Agreement Q6: *"is goes with one person…"* when the subject is I, which is also one person | *"…but never with I. I goes with am."* |
| was/were were tested but never taught | Added to the definition and the study guide |
| Verb Tense Q20 had **two** errors, which breaks the one-error rule (spec §8) | It now has one error. Both irregular forms are still tested through the distractors |
| Verb Tense Q19 had no time word, so "builds…lays" was also a valid fix | Added *Yesterday,* so only the past-tense fix works |
| Q2 and Q3 feedback pointed to an answer that wasn't offered, or missed an agreement error | Reworded |
| The helping/linking clue said "the word right after", which fails on *is **a** pilot* | Now says *"Skip little words like a, the, and very"* |
| The "=" test looks as if it works on *The baby = sleeping* | Warning added: *use = only when no action word comes after the verb* |
| *has* and *have* were listed as helping verbs, which only works with the perfect tense (NYI); *am* was missing | has/have dropped, am added |
| *later* was listed as a future word (*"Later, we ate"* is past) | Changed to *next year* |
| The example started a sentence in lowercase | Fixed |

Nits, also fixed:
- whole is now described as an adjective, not as telling "which"
- removed an awkward link label
- commas after opening time words are now consistent
- a cleaner distractor in Q11
- "go to my school"
- geese fly south in the **fall**

---

## 5. DEFECT LEDGER

| ID | Status | Note |
|---|---|---|
| D-27 | OPEN | Unchanged. |
| D-26 | OPEN / DEFERRED | Unchanged. |
| D-20 | OPEN | Abstract nouns. Planned for *Kinds of Nouns* in 1.6. |
| D-35 | OPEN / DEFERRED | Unchanged. |
| D-37 | OPEN, **pilot in 1.4** | The new banks use "The word …". The older topics are still lowercase-first. Owner decides whether to spread the pilot to them. |
| **O-1** | **NEW OBSERVATION** | *Words and Their Jobs* now has **7** cards, in three rows. At 1366×768 the unit view scrolls about 70px and its **All Units** button sits just below the fold. Card rows are visible at the fold, so the page never looks finished when it isn't. This is not a lesson control, and the existing scrolling rules accept it. Options for the owner: leave it as is, or split off a **Verbs** unit (verb, helping & linking, verb tense) in 1.5. |

---

## 6. LIMITATIONS

L-01 through L-07 from Build 1.3 still apply. The most important is **L-07: the owner's original harnesses (§12c) were not run.** They are not in the repository. Run them locally against `build-1.4` before merging.
