# SENTENCE SENSE — GEORGIA GRADE 3 STANDARDS ALIGNMENT SPEC

*Companion to SENTENCE-SENSE-HANDOFF.md. Written 2026-10-18 against Build 1.2.7.
This document says WHAT Sentence Sense must teach. The handoff still governs HOW
(design system, bank contract, plain → marked pattern, delivery format).*

---

## 1. SOURCE OF TRUTH

| Item | Detail |
|---|---|
| Standards | **Georgia's K-12 English Language Arts Standards.** Approved by the State Board May 2023, fully implemented **2025-26**. These replace the old GSE / Common Core codes (ELAGSE3L1 etc.). Do not use old codes. |
| Test | **Georgia Milestones EOG, Grade 3 ELA.** Redesigned to the new standards starting **spring 2026**. |
| Grammar scope | **3-5.L.GC.1** has no lettered parts. Its grade-level expectations come from the **K-12 Grammar, Usage & Mechanics (GUM) Chart**. |
| Sentence scope | **3.L.GC.2.a–d** (Syntax). |

### GUM chart codes (what each letter obligates)

| Code | Meaning | What Sentence Sense does with it |
|---|---|---|
| **M** | Master by end of grade 3 | **Full topic + full bank + Test coverage.** Highest priority. |
| **C** | Continue (introduced earlier, not yet mastered) | Full topic + bank. |
| **I** | Introduce this year | Topic or sub-lesson; lighter bank; Test items allowed but fewer. |
| **R** | Reinforce (mastered in grade 2 or earlier) | Covered inside other lessons and as distractors; review items in Test. |
| **NYI** | Not yet introduced | **Never teach, never test, never use as a correct answer.** |

---

## 2. HOW THE TEST MEASURES GRAMMAR — WHY ITEM FORMAT MATTERS

- ELA runs in **three sections**. For grade 3, **Section 1 is an extended
  writing task**. The student reads 2–3 sources, answers 3–4 questions, then
  writes an **opinion essay answering a research question** using evidence.
- The essay is scored on an **8-point rubric**: Purpose & Organization (0–3),
  Evidence & Elaboration (0–3), and **Language Usage & Conventions (0–2)**,
  which covers sentence formation, usage and mechanics.
- Other items are multiple choice, **multi-select**, and **technology-enhanced**
  (drag-and-drop, sorting, ordering, **hot text** = click the word/sentence,
  drop-down).

**Consequence for the app.** The test rarely asks "which word is the verb?"
It asks students to **choose the correctly written sentence, fix an error,
combine two sentences, or sort sentences by type.** Learn can keep teaching
identification, because that is the foundation. **Practice, Break It Down and
Test must use the test's formats** (Section 7).

> Not confirmed: point weights per reporting category. The GaDOE Grade 3 ELA
> blueprint PDF (lor2.gadoe.org, `GM_Gr3_ELA_Blueprint.pdf`) blocks automated
> access. Open it manually and record the weights here.

---

## 3. COMPLETE GRADE 3 SCOPE

### 3a. Syntax — 3.L.GC.2

| Code | Standard (paraphrased) |
|---|---|
| 3.L.GC.2.a | Tell apart correctly built **simple, compound, and complex** sentences. |
| 3.L.GC.2.b | Use a **variety of sentence types**; keep **verb tense consistent** within and across sentences. |
| 3.L.GC.2.c | Use correct **subject-verb agreement** in varied sentences. |
| 3.L.GC.2.d | Add detail with **adjectives and adverbs** to make meaning precise. |

### 3b. GUM chart — Grade 3 codes

**MASTER (M), the grade 3 core**

| Skill | Category |
|---|---|
| Irregular plural nouns (*children, mice, feet*) | Grammar |
| Past tense of irregular verbs (*went, ran, caught*) | Grammar |
| Coordinating conjunctions joining words, phrases, clauses | Grammar |
| Collective nouns (*team, flock*) and abstract nouns (*courage*) | Grammar |
| Reflexive pronouns (*myself, themselves*) | Grammar |
| Apostrophes: contractions and singular possessive nouns | Mechanics |
| Comma + coordinating conjunction joining two independent clauses | Mechanics |
| Hyphens to divide words at line breaks | Mechanics (*print skill; see 5d*) |

**CONTINUE (C)**

| Skill | Category |
|---|---|
| Prepositional phrases | Grammar |
| Comparative and superlative adjectives and adverbs | Grammar |
| Pronoun-antecedent agreement | Usage |
| Capitalization, quotation marks, commas for dialogue / exact words | Mechanics |

**INTRODUCE (I)**

| Skill | Category |
|---|---|
| Helping and linking verbs | Grammar |
| Subordinating conjunctions joining clauses | Grammar |
| Relative pronouns and relative adverbs (*who, which, that / where, when, why*) | Grammar |
| Indefinite pronouns with agreement (*everyone, somebody, each*) | Grammar |
| Interjections | Grammar |
| Commonly confused words (*to/too/two*) | Usage |
| Commas for direct address and yes/no | Mechanics |
| Commas after introductory phrases or clauses | Mechanics |
| Apostrophes for plural possessive nouns | Mechanics |
| Capitalizing abbreviations, proper adjectives, formal titles | Mechanics |
| Titles of works: capitalization + underline/italics/quotation marks | Mechanics |

**REINFORCE (R).** These are expected already, so use them for review and as distractor material:
regular plurals (-s/-es, -y → -ies), action verbs, adjectives and adverbs, common
and proper nouns, simple verb tenses, personal pronouns (subject, object,
possessive), common prepositions, determiners and articles, capitalizing the first word and
*I*, capitalizing proper nouns, end punctuation, commas in a series, dates, addresses,
and letter greetings/closings.

**NOT YET INTRODUCED in grade 3. Never teach, test, or use as a correct answer:**
intensive pronouns, **progressive and perfect verb aspects** (do not name "present
progressive"), participles, vague pronoun reference, correlative conjunctions
(*either/or*), demonstrative pronouns as a taught topic, semicolons, colons, dashes,
ellipses, verbals.

### 3c. Out of scope for Sentence Sense (belongs elsewhere)

| Area | Codes | Home |
|---|---|---|
| Vocabulary, roots and affixes, synonyms/antonyms, homophones, shades of meaning, dictionary use | 3.L.V.1–3 | Word Workshop |
| Spelling | 3.F.P.4 (Foundations) | Word Workshop |
| Reading comprehension, text structure, writing essays | 3.T.* | Reading app |

**Exception:** 3.L.V.2.b (affixes that signal part of speech, e.g. *-ly* → adverb) is
used inside the Adverb and Comparing lessons as a *clue*, not as its own topic.

---

## 4. AUDIT OF WHAT EXISTS (Build 1.2.7)

| Topic | Status | Standard served | Action |
|---|---|---|---|
| Verb | Lesson + 20-Q bank | R (action verbs); Stage 4 being-verbs touches I (linking) | Keep. Add `std` tags. Linking/helping get their own topic later. |
| Subject | Lesson + 1 Try It | Foundation for 3.L.GC.2.a, 2.c | Keep. Needs bank. |
| Complete Subject | Lesson + 1 Try It | Foundation for 2.a, 2.c | Keep. Needs bank. |
| Predicate | Lesson + 1 Try It | Foundation for 2.a | Keep. Confirm wording distinguishes complete predicate vs. simple predicate (main verb), which the class packet uses. |
| Noun | Lesson + 1 Try It | R | **Expand** (Section 5, Unit A). Missing the two M items. |
| Adjective | Lesson + 1 Try It | R, 2.d (half) | Keep. Needs bank. |

**Coverage today:** 0 of 8 Master skills, 0 of 4 Continue skills, 0 of 4 Syntax standards
taught directly. The six topics are prerequisites, so they stay. They are not the grade 3 target.

---

## 5. TARGET CURRICULUM

Topics grouped into four units. Every topic uses the existing four-step rhythm:
**DEFINITION → CLUE → EXAMPLE → TRY IT**, plain → marked sentences, and the bank
contract. Sentences follow the Difficulty Standard (7–12 words, 3rd-grade
vocabulary).

### Unit A — Words and Their Jobs

| # | Topic | Codes | Teaching core | Example sentence |
|---|---|---|---|---|
| A1 | Noun *(exists)* | R | person, place, thing, **idea** | — |
| A2 | **Kinds of Nouns** | R, **M** | common/proper; singular/plural incl. **irregular**; **collective**; **abstract** | *The **herd** of **sheep** showed great **patience** in the storm.* |
| A3 | **Pronoun** | R, **M**, C, I | personal (subject/object/possessive); **reflexive**; agreement with the noun it replaces; indefinite (light) | *Maya fixed the bike **herself** before **her** brother got home.* |
| A4 | Verb *(exists)* | R | action verbs | — |
| A5 | **Helping & Linking Verbs** | I | linking = *am, is, are, was, were, seems, becomes*; helping + main verb | *The puppy **was** sleepy after it **had chased** the ball.* |
| A6 | **Verb Tense** | R, **M**, 2.b | past/present/future (*will*); **irregular past**; keep tense consistent | *Yesterday we **went** to the lake and **caught** three fish.* |
| A7 | Adjective *(exists)* | R, 2.d | — | — |
| A8 | **Adverb** | R, 2.d | tells **how, when, where**; *-ly* clue; trap: *friendly, lovely* are adjectives | *The class waited **quietly** **outside** the library door.* |
| A9 | **Comparing Words** | C | *-er/-est*, *more/most*, *good/better/best*, *bad/worse/worst*; never *more taller* | *Sam is the **tallest** player, but Kai runs **faster**.* |
| A10 | **Preposition** | R, C | preposition + noun = prepositional phrase | *The cat hid **under the porch** **during the storm**.* |
| A11 | **Conjunction** | **M**, I | coordinating (*and, but, or, so*); subordinating (*because, when, after, before, if, although*) | *I wanted to swim, **but** the pool was closed.* |
| A12 | **Interjection** | I | short sub-lesson only | ***Wow**, that rocket flew so high!* |

### Unit B — Parts of a Sentence *(mostly exists)*

| # | Topic | Codes | Note |
|---|---|---|---|
| B1 | Subject *(exists)* | foundation | Bank needed. |
| B2 | Complete Subject *(exists)* | foundation | Bank needed. |
| B3 | Predicate *(exists)* | foundation | Bank needed. Make simple vs. complete predicate explicit. |

### Unit C — Building Sentences (3.L.GC.2, the core of the upgrade)

| # | Topic | Codes | Teaching core | Example |
|---|---|---|---|---|
| C1 | **Complete Sentence** | 2.a, R | needs a subject + predicate + complete thought; **fragment**; **run-on** | Fragment: *Ran across the muddy field.* → *The dog ran across the muddy field.* |
| C2 | **Four Kinds of Sentences** | 2.b, R | statement (.), question (?), exclamation (!), command (. or !) | *Please close the door before the bus leaves.* |
| C3 | **Subject-Verb Agreement** | 2.c, C | singular subject → singular verb; **trap: a prepositional phrase between them**; collective nouns take singular verbs | *The boxes on the top shelf **are** heavy.* · *The team **is** ready.* |
| C4 | **Compound Sentence** | 2.a, **M** | two complete sentences + **comma + and/but/or/so**. Key contrast: no comma when the second half has no subject | *Lena packed her lunch**, and** she walked to school.* vs. *Lena packed her lunch **and** walked to school.* |
| C5 | **Complex Sentence** | 2.a, I | sentence + dependent part starting with *because, when, after, if…*; comma when the dependent part comes first | ***When the bell rang,** the students lined up.* |
| C6 | **Make It Better** | 2.b, 2.d | combine short sentences; add adjectives/adverbs; vary openings | *The bird sang. It was small.* → *The small bird sang sweetly.* |

### Unit D — Punctuation & Capitals

| # | Topic | Codes | Teaching core |
|---|---|---|---|
| D1 | **Apostrophes** | **M**, I | contractions; singular possessive (*dog's*) **M**; plural possessive (*dogs'*, *children's*) I; trap: *its/it's* |
| D2 | **Commas** | R, **M**, I | series/dates/addresses/letters R; compound sentence **M** (link to C4); direct address and yes/no I; after intro word/phrase I |
| D3 | **Capital Letters** | R, I | first word, *I*, proper nouns R; titles of people, abbreviations, proper adjectives (*American*), titles of books I |
| D4 | **Dialogue** | C | *"Let's go," said Mia.* · *Mia said, "Let's go."* · capital inside quotes, comma placement |
| D5 | **Tricky Word Pairs** | I | *to/too/two, their/there/they're, your/you're, its/it's* |

### 5d. Hyphens at line breaks (M)

This is a handwriting/print skill. It fits a printable packet better than a screen
app. Cover it with **one Study Guide note** in D2 and one Test item. Do not build a
topic.

---

## 6. BUILD SEQUENCE

Ordered by test value × how directly it builds on what exists.

| Build | Scope | Why first |
|---|---|---|
| **1.3** | **Adverb (A8)**, **Complete Sentence (C1)**, **Pronoun (A3)** + add `std` tags to all existing content | Completes 2.d; C1 uses Subject/Predicate directly; Pronoun is the largest missing part of speech and carries an M item |
| **1.4** | **Verb Tense (A6)**, **Helping & Linking (A5)**, **Subject-Verb Agreement (C3)** | All extend the Verb lesson; covers 2.b, 2.c and an M item |
| **1.5** | **Conjunction (A11)**, **Compound (C4)**, **Complex (C5)**, **Four Kinds (C2)** | Completes 2.a; two M items |
| **1.6** | **Kinds of Nouns (A2)**, **Preposition (A10)**, **Comparing (A9)** | Two M items + both remaining C grammar items |
| **1.7** | **Unit D** (D1–D5), **Interjection (A12)**, **Make It Better (C6)** | Mechanics M items; C6 needs everything above |
| **1.8+** | **Test mode**, then Practice and Break It Down; banks for B1–B3, A1, A7 | See Section 7 |

**Design decision needed before 1.3. The topic screen does not scale.** It is a
fixed 3 × 2 grid for six topics. The target is about 26. Proposed: the topic screen
becomes **four unit cards** (A–D) → each opens its own topic grid. The handoff says
not to redesign without a new brief, so this section is that brief, and it needs
approval.

---

## 7. MODES MAPPED TO THE TEST

| Mode | Promise (unchanged) | Item formats |
|---|---|---|
| **Learn** | Teach me | Unchanged: find-the-word with escalating feedback. |
| **Practice** | Less help | Same skills; feedback after 1 wrong answer; mixes topics within a unit. |
| **Break It Down** | Take a whole sentence apart | **Drag labels onto words** (mirrors drag-and-drop TE items). Sort sentences into simple / compound / complex. |
| **Test** | Show what I know | **Milestones formats only:** (1) *Which sentence is written correctly?* (2) **drop-down** to fix one word in a sentence (3) **hot text**: click the error (4) **combine** two sentences, choose the best result (5) **multi-select**: choose all the adverbs (6) short **edit-the-paragraph** set. Feedback after submit, not during. |

**Decision needed:** whether Test shows a result summary. The handoff rules out
scoring "for Learn" only. A Test-mode summary by standard (e.g. "Commas: 4 of 5")
is how you would see what Chris still misses. Recommend: show a summary at the end
of Test, with no persistence.

---

## 8. CONTENT RULES (add to the handoff)

1. **Every question carries a standard tag.** Add `std: ["3.L.GC.2.c", "GUM-U-C-pronoun-agreement"]`
   to each bank question and Try It. A harness can then print coverage per
   standard and fail the build if an M skill has fewer than N questions.
2. **NYI guard.** No correct answer may depend on an NYI skill. In particular,
   never label *is walking* as "present tense". In grade 3 terms, *is* is the
   helping verb and *walking* is the main verb.
3. **Being-verb rule from 1.2.6 still applies** in Helping & Linking: after a
   linking verb, use a plain adjective (*busy, quiet, ready*), never a participle-form
   word (*excited, broken*).
4. **Error items need one error only.** In "fix it" items, exactly one thing is
   wrong, so the correct choice is unambiguous.
5. **Known-wrong rules from the class review packet, never encode these:**
   - "Present tense ends with -ing." Wrong. *She walks* is present.
   - "*has, have* are linking verbs." Wrong. They are helping or action verbs.
   - "Words ending in -ly are adverbs." Incomplete. *friendly, lovely, lonely* are adjectives.

---

## 9. SOURCES

- Georgia's K-12 ELA Standards, Grades 3–5, with K-12 GUM Chart (Cobb County copy of GaDOE document, 2025–26):
  https://media.cobbk12.org/media/WWWCobb/medialib/3-5-ela-standards-2025-2026.1b3c56114217.pdf
- GaDOE Georgia Milestones Grade 3 ELA Blueprint (open manually):
  https://lor2.gadoe.org/gadoe/file/4feebd77-4a21-4788-a3ba-b6f50a71c876/1/GM_Gr3_ELA_Blueprint.pdf
- GaDOE Item Types Described (open manually):
  https://lor2.gadoe.org/gadoe/file/40c4c656-15c2-4274-8ed0-226861d3800d/1/Item-Types-Described.pdf
- Gwinnett County, *25-26 Understanding the Georgia Milestones Assessment System*:
  https://resources.finalsite.net/images/v1768576951/gcpsk12org/k35qjb598ddy44thrvky/25-26UnderstandingtheGeorgiaMilestonesAssessmentSystemGMAS.pdf
- Jeddle, Georgia Milestones writing task scoring:
  https://jeddle.com/how-is-the-georgia-milestones-writing-task-scored-and-which-grades-take-it/
- Progress Learning, new Georgia ELA standards and writing assessment:
  https://progresslearning.com/news-blog/new-georgia-ela-standards-25-26/
  https://progresslearning.com/news-blog/georgia-new-writing-assessment-requirements/
- Lumos Learning, GMAS 2026 FAQ (sections, timing, item types):
  https://www.lumoslearning.com/llwp/frequently-asked-questions-georgia-milestone-assessment-system-gmas.html
