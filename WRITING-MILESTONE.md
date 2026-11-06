# Writing Milestone 1 — Write a Strong Sentence (Build 1.9.0)

Branch `claude/write-strong-sentence`, based on `build-1.8` (`ccbfeb4`, the build the earlier audit found live). **Not merged or deployed.**

## 1. Source-of-truth findings (2026-11-06)

| Ref | Build | Notes |
|---|---|---|
| `main` | 1.2.7 (`cc1f102`) | Old. Not the product. |
| `build-1.8` = `claude/build-1.4` | 1.8.0 (`ccbfeb4`) | Ten skills, Learn/Practice/Test, Grammar Check. The earlier audit and the 2.0 branch's own evidence both say production serves this. The cloud sandbox blocks github.io, so I could not fetch the live site myself. |
| `feature/sentence-sense-2-learning-system` | 2.0.0-dev (`1753dd1`) | Draft rewrite **based on main 1.2.7, not 1.8**. It replaces the runner (about 37k lines deleted relative to 1.8) and uses 29-question mastery tests. Draft PR #3 is marked do not merge. Left untouched. |
| `build-1.7`, `port-milestones`, `review/*`, `backup/live-build-1.4.2` | older | Ancestors or rollbacks of 1.8. |

This milestone extends 1.8, because 1.8 is the working product with reviewed grammar content. Rebuilding it on the 2.0 draft would have meant adopting an unreviewed rewrite.

## 2. What the child does, and why

| Step | What Chris does | Educational purpose |
|---|---|---|
| Pick | Chooses 1 of 6 concrete prompts (or "My own idea") | Writing starts with something to say. Familiar topics lower the load so attention goes to the sentence. |
| Write | Types a first draft. Optional: say it aloud, read-aloud of the prompt, starters, word bank, 4-rung Help me | **BUILD/WRITE**. Independent writing is one box and one button. Scaffolds are opt-in. |
| Who or what? | Taps the words in **his own sentence** that tell who or what it is about. Can say "it's a command (subject: you)" or "it doesn't say yet" | **IDENTIFY** transferred from Subject practice onto his own writing |
| What happens? | Taps the predicate words; answers "Does it make sense by itself?" | Complete sentence = an independent thought, not just a noun plus a verb |
| Detail (optional) | Add where / when / how / what kind, **or** "it already has enough detail" | **REVISE**. A detail helps when it helps a reader picture something. Length is not the goal. |
| Capital and end mark | Reads the "Things to look at" notes and ticks his own checklist | **FIX**. Mechanical review, honestly scoped |
| Read again | Reads it aloud (optional read-to-me) | Rereading is the most transferable revision habit |
| Compare | Sees first draft and new version side by side, gets specific praise, and one next step | Revision made visible. Praise names the actual change, not "mastery". |

**Help ladder** (draft step): a question about his idea → a strategy plus the word bank → an example **about a different topic** (shown split into who/what and what happens) → a frame with blanks, which goes into his box only if he presses "Put this frame in my writing". Each check step also has its own "Show me an example", again with different content.

**His words are protected.** The first draft is frozen when he presses "This is my first draft". All later changes go into the new version. Chips and frames *insert* text and never replace it. Nothing auto-corrects.

## 3. What the app can and cannot check

The only automatic notes are about **things to look at**, never right or wrong:
- the first letter is lowercase
- there's no `.`, `?` or `!` at the end
- a standalone lowercase `i`
- leftover `____` from a frame
- what looks like more than one sentence (presented as "That's okay! Check each one.")

The app does **not** judge whether a sentence is complete, clear, grammatical, or well detailed. Subject, predicate, sense and detail are self-checks, and the grown-ups view shows his answers so an adult can talk them through. The child screen and the grown-ups page both say this plainly. Known limits: names that should be capitalized are not detected; a sentence like "I." passes the mechanical notes. That is fine, because the notes are prompts to look, not grades.

## 4. Saving

- `localStorage["sentence-sense-writing-v1"]` holds pieces with prompt id, draft, firstDraft, revision, marks (with the marked words kept as text), self-checks, help used, parent note, and timestamps. No names, no account, no network.
- Saved on each keystroke (250 ms debounce) and **immediately on every step change**, plus on `pagehide`.
- Blocked storage: the activity keeps working and says so. Full storage: "Couldn't save… storage may be full". Damaged JSON: kept as `…-damaged-<timestamp>`, and the app starts fresh without crashing.
- A second tab that changes the data makes the first tab stop saving and tells the child, so a stale tab can't overwrite newer work.
- Untouched pieces (prompt picked, nothing written) are dropped when a new piece starts.
- The grown-ups page says it does not sync across devices and that clearing browser data removes it. It offers delete one or delete all, each with a confirmation.

## 5. Corrections to existing content

- **Grammar Check:** "How much do I know?" → "What should I practice next?". "You know your grammar" and "You passed" are removed, and 20/20 now says it was a short check with 2 questions per skill.
- **Verb tense:** the absolute rule "keep the other verbs in the past" becomes "when the time stays the same, keep the same tense; if the time changes, the tense can change", with an example. The recap and study-guide reminder match.
- **Agreement:** the -s rule is scoped to now/every day (present tense), with I and you taking no -s. *I* goes with *am* and *was*; *you* goes with *are* and *were*, even for one person.
- **Complete sentence:** the study guide now says a command is complete and its subject is the understood *you*. I checked all 57 Complete Sentence items: none marks a real command as a fragment.

## 6. Prioritized follow-up (recorded, not done)

1. **Owner review on a real device with Chris.** Physical phone or tablet, real screen reader, and an observed child session were not tested.
2. **Standards claim.** Home says "Aligned with Georgia Grade 3 ELA Standards". The 2.0 branch found the current GaDOE framework uses new codes (for example 3.T.T…). The 1.8 `ga` tags were not re-verified in this milestone, so review them before relying on the claim.
3. **Per-skill Test wording.** Phrases like "You've got verbs" after a 12-question test overstate what was measured. Soften them the same way as the Grammar Check.
4. **Verb-tense pools.** Audit the Practice and Test items for any explanation that still teaches "never change tense".
5. "An adjective always describes a noun" also needs to cover pronouns ("She is happy").
6. **Reconcile with the 2.0 draft.** Decide whether its writing notebooks and rubric review should be ported onto 1.8 piece by piece rather than replacing 1.8.

## 7. Roadmap — next milestones by educational value

1. **Fix fragments and run-ons in my own writing.** Reuse the who/what and what-happens tap checks on a 2–3 sentence piece. Add "Where does one thought end?" with a split/join tool that Chris controls.
2. **Expand with meaningful details.** A who/what/where/when/why expansion builder on his saved sentences, with "Is it better or just longer?" self-checks.
3. **Combine related sentences.** Two of his sentences plus *and/but/so/because*; ties into the existing comma-and-joining-word lesson.
4. **Apply grammar skills to original sentences.** After a Practice session, "Use it": write one sentence with a past-tense verb, a clear pronoun, or a matching subject and verb, then self-check with that skill's question.
5. **Write a short paragraph.** Topic sentence, 2–3 detail sentences, and an ending, each checked with the sentence routine, plus a grown-up rubric.
6. **Revise a previous piece with less help.** Reopen a saved piece weeks later with scaffolds hidden by default, then compare the original, the first revision, and the new revision.

**AI feedback (separate proposal, not a default).** An LLM could give richer comments on clarity and detail. It would require: sending a child's writing to a third party (needs parental consent and a no-retention agreement), per-call cost, an evaluation set of real third-grade sentences with adult ratings before any feedback reaches Chris, and output limited to questions, never rewrites. The current self-check and grown-up review flow stays as the fallback. Recommendation: wait until milestones 1–3 exist and there's a body of Chris's real writing to evaluate against.
