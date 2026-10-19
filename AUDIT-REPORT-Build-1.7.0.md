# Sentence Sense — Build 1.7.0 Audit Report

**Build:** 1.7.0 (base 1.6.0, `677f7bb`) · **Date:** 2026-10-19
**Owner direction (2026-10-19):** every card filled out, including Test; the same help sequence on every card; best product, with checks and audits. Each release goes live once every check passes.

## Verdict

| Check | Result |
|---|---|
| Owner harness `verification/guard.js` | **871 pass, 4 fail.** All 4 failures are the Google Fonts CDN, which the sandbox blocks. |
| Pool rule checkers (counts, one answer, answer in sentence, clue never names it, sentence length, being-verb rule, near-copies of Learn/Practice) | 9 of 9 pools pass |
| Grammar review, round 1 (two independent reviewers per pool, 324 questions) | 0 must-fix, 24 should-fix, 77 nits. All should-fix and most nits fixed. |
| Final re-review of all 163 edited questions plus 30 unchanged | 0 must-fix, 6 should-fix. **All fixed.** |
| Screen audit (all 324 questions through the real UI at 390 and 1366; 54 results screens; ~213 Show me how walk-throughs) | 1 must-fix, 5 should-fix (3 were already fixed by the re-review). **All fixed.** |
| Phone check (every screen including each test question, result and review, at 320/375/390) | 693 screens, no sideways scroll, Home always on screen |
| Overall | **PASS — released** |

## What changed
1. **A Test for nine skills:**
   - Subject, Noun, Adjective, Pronoun, Adverb, Complete Sentence, Helping & Linking Verbs, Verb Tense and Subject-Verb Agreement.
   - 36 questions each, 12 per sitting.
   - Three bands of rising difficulty, and two scored parts per skill.
2. **No hints during a test.** After submitting, each missed question offers **Show me how**: the clue, then two choices, then the walk-through. The right answer shows only at step 3, the same order as Help me.
3. **The Verb test** gets a strategy clue for Show me how. Its owner-approved questions and scoring are unchanged.
4. **Verb Tense Learn:** a new "More special past tense words" row (bought, drank, froze, hid, met, rode, ran, swam, taught, wore, wrote). Every past form the test asks is now taught first.
5. **Harness:**
   - "Test availability" is now read from content.
   - Check 13.28 accepts Show me how on missed items.
   - New section **15T** for each skill: pool integrity, the 8/4 or 6/6 split, no help during the test, scoring and guidance, clean button labels, and Show me how order.

## Audit findings fixed (selected)
- **Results buttons garbled the skill name** ("Back to Verb Tense Tense"). The labels now read "Go to Practice", "Go to Learn" and "Back to <skill>".
- **Each sitting split 9/3 instead of 8/4,** which judged a subscale on 3 questions. Targets are now set for the whole test first.
- **Show me how step 2** ran two whole-sentence choices into one line. They are now listed on separate lines.
- **Sentence choices on the test** now stack in one left-aligned column, as in Practice.
- **Five Subject questions marked "simple" started with an opening phrase,** which belongs to the "tricky" part, so the score rows could report the wrong weakness. They were rewritten so the subject comes first.
- **Questions that let a child answer from memory of another screen:**
  - "These cookies ____ warm" vs Subject's "The cookies are warm".
  - Three near-copies of Practice sentences.
  - Repeated whale-shark, firefighter and hot-dog scenes across tests.
- **Facts and wording:** Memorial Day → Veterans Day for veterans; geese fly south in fall; "banks" removed.
- **Clues that pointed the wrong way:** "One goes with -s" for *I* and *you*, and "skip the opening words" where there were none.
- **Pronoun blanks** that could be answered from the verb's -s alone now use past-tense verbs, so the noun decides. The Southern "I bought me" item was replaced.
- **"these/those"** (not taught in Adjective Learn) became "this/that".

## Left for the owner
- **D-37:** explanations start with the answer word in lowercase ("tells is right…"). This matches the approved Verb pool, so it's a product-wide decision.
- **Pronoun clue wording:** "find the noun the blank stands for. Make them match: one person or thing, or more than one." Learn's own line names every answer, so it can't be used as a test clue.
- **Test length:** 12 questions only. 20 can be added once pools pass ~60 questions.
- **The 4 earlier Verb/Subject wording suggestions:** still unchanged.

## Limitations
- The owner has not yet skimmed the new pools.
- No child testing.
- Chromium only.
