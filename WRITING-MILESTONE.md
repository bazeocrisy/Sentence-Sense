# Writing Milestone 1 — Write a Strong Sentence (Build 1.9.0)

Branch `claude/write-strong-sentence`, based on `build-1.8` (`ccbfeb4`, the build the earlier audit found live). **Not merged or deployed.**

## 1. Source-of-truth findings (verified 2026-11-06)

| Ref | Build | Notes |
|---|---|---|
| `main` | 1.2.7 (`cc1f102`) | Old. Not the product. |
| `build-1.8` = `claude/build-1.4` | 1.8.0 (`ccbfeb4`) | **Pages source unverified.** Every Pages deployment on record built `claude/build-1.4`, not `build-1.8`. | Ten skills on Home (Words: 7, Sentences: 3) plus the Grammar Check banner. Content also defines `complete-subject` and `predicate`, which are not on Home. The earlier audit found production serving this build. This sandbox cannot reach github.io to confirm. |
| `feature/sentence-sense-2-learning-system` | 2.0.0-dev (`1753dd1`) | See below. Draft PR #3, marked do not merge. Left untouched. |

**2.0 ancestry (corrected).** My first status message said the 2.0 branch "is 4 commits ahead of build-1.8 and contains it". That was wrong: I misread `git log build-1.8..feature`, which lists commits on the feature branch that are not in build-1.8, not a containment check. Verified with git:
- `git merge-base feature build-1.8` = `cc1f102`, which is also the merge base with `main`.
- `build-1.8` is **not** an ancestor of the feature branch. `main` (`cc1f102`) **is**.
- The feature branch has 4 commits on top of `main`: `f97da27` (parent `cc1f102`), `7e87c41`, `0d8f7de`, `1753dd1`.
- `build-1.8` has 38 commits that the feature branch does not.

So the 2.0 draft and 1.8 are sibling lines from 1.2.7. 1.9.0 is built on 1.8.

## 2. What the child does, and why (5 screens, review pass)

The first version had eight screens (Pick, Write, Who, What, Detail, Marks, Read, Compare). The review pass cut it to five so one sentence fits a short session. The required path is **5 taps plus typing**: Start writing → prompt → This is my first draft → Next → Keep it and finish.

| Screen | What Chris does | Educational purpose |
|---|---|---|
| Pick | Chooses 1 of 6 concrete prompts (or "My own idea") | Writing starts with something to say. Familiar topics lower the load. |
| Write | Types a first draft. Optional: say it aloud, read-aloud of the prompt, starters, word bank, 4-rung Help me | **BUILD/WRITE**. Independent writing is one box and one button. |
| Check | Three questions on one screen. (1) Tap the words in **his own sentence** that tell who or what, or say "it's a command" or "it doesn't say yet". (2) Tap what happens. (3) "Does it make sense by itself?" Yes / Not yet | **IDENTIFY** transferred onto his own writing. All answers are his judgments, recorded and never graded. One gentle nudge if he answers nothing; never a block. |
| Revise | Edits his sentence in place, or keeps it. Sees "Things to look at" (marks only). Optional, folded "Want to add a detail? (You don't have to.)". Optional self-check boxes. "Go back to my first draft" (with confirmation) | **FIX/REVISE**. A good sentence can stay unchanged: the button reads **Keep it and finish**. No adjective or adverb is required. |
| Compare | First draft and final version side by side, factual praise, one suggestion | Revision made visible, with no claim that the new version is better. |

**Help ladder** (Write screen): a question about his idea → a strategy plus the word bank → an example **about a different topic** → a frame with blanks, added only when he presses "Put this frame in my writing". Check has its own example, also on a different topic.

**His words are protected.** The first draft is frozen on "This is my first draft". Only Chris's typing, a chip or frame he taps, or his confirmed "Go back to my first draft" ever changes the new version.

## 3. What the app can and cannot check, and the feedback rules

Automatic notes are **things to look at**, phrased as questions, never as right or wrong:
- the first letter is lowercase (leading quotes are skipped, so `"wow," said Mom.` is noticed);
- the end has no `.`, `?`, `!` or `…` (closing quotes and brackets are allowed after the mark);
- a standalone lowercase `i`;
- leftover `____` from a frame;
- what looks like more than one sentence ("That's okay! Check each one.").

The sentence-count heuristic skips the abbreviations Mr., Mrs., Ms., Dr., St., Mt., Jr., Sr., a.m., p.m. and U.S., and single-letter initials. It also skips an end mark followed by a lowercase word (`"Wow!" said Mom.`), and treats `?` and `!` like periods. The harness checks 25 cases, including commands (`Sit down.`, `Look at that cloud!`), questions, quotes and `Wow!!`. It errs toward silence: `We met at 3 p.m. Then we left.` is not flagged as two sentences. A missed note is safer than calling valid writing wrong.

Praise and messages follow these rules (each one is a harness check):
- Keeping a sentence the same is praised as a writer's choice.
- Added words are stated as fact ("You added: 'big'."). They are never called better.
- Removed words are presented as real revision.
- Capital and end-mark changes are named as mark changes, not as added or removed words.
- No message uses "better", "correct", "right", "perfect" or "master".
- Self-check results are worded as the child's actions ("You marked…", "You said…"). The grown-ups page labels them **Child's own answers (not checked by the app)**.
- Commands are a first-class choice on Check and finish normally.
- Detail is optional, and the detail ideas include "a short, clear sentence can be strong too".

## 4. Saving

- `localStorage["sentence-sense-writing-v1"]` holds pieces with prompt id, draft, firstDraft, revision, marks (with the marked words kept as text), self-checks, help used, parent note, and timestamps. No names, no account, no network.
- Saved on each keystroke (250 ms debounce) and **immediately on every step change**, plus on `pagehide`.
- Blocked storage: the activity keeps working and says so. Full storage: "Couldn't save… storage may be full". Damaged JSON: kept as `…-damaged-<timestamp>`, and the app starts fresh without crashing.
- A second tab that changes the data makes the first tab stop saving and tells the child, so a stale tab can't overwrite newer work.
- Untouched pieces (prompt picked, nothing written) are dropped when a new piece starts.
- The grown-ups page says it does not sync across devices and that clearing browser data removes it. It offers delete one or delete all, each with a confirmation.

## 5. Corrections to existing content

- **Grammar Check:** "How much do I know?" → "What should I practice next?". "You know your grammar" and "You passed" are removed, and 20/20 now says it was a short check with 2 questions per skill.
- **Verb tense, lesson:** "When the time stays the same, keep the same tense; if the time changes, the tense can change", with an example. The recap and study guide match.
- **Verb tense, feedback (audited):** all 14 "keeps the same tense" Practice and Test items are compound predicates in one time frame (for example "Mia opened the box and ___ a puppy inside"), so the keys and per-choice feedback are correct. Their 14 clues said "Keep the next verb in the same tense" with no reason, and now say "Both actions happen at the same time, so use the same tense." The stage description and test guidance are qualified the same way.
- **Agreement:** the -s rule is scoped to now/every day, with I and you taking no -s. *I* goes with *am* and *was*; *you* goes with *are* and *were*, even for one person.
- **Complete sentence:** the study guide says a command is complete, with an understood *you*. None of the 57 items marks a command as a fragment.
- **Georgia standards:** compared against the saved GaDOE Grade 3 ELA CASE package (`docs/sources/georgia-grade3-2026.json` on the 2.0 branch, retrieved 2026-10-24; the official site is unreachable from this sandbox).
  - `3.L.GC.2.a`–`d` exist and match.
  - `3-5.L.GC.1` is not an official code. Each tag is now shown as the matching official item (for example `3.L.GC.1.33` for helping and linking verbs, `.20` irregular past, `.23` collective/abstract nouns, `.24` reflexive pronouns, `.25` comma + conjunction, `.27` prepositional phrases, `.29` pronoun agreement), or as the parent standard `3.L.GC.1`.
  - `3.L.V.2.b` is not in the saved source, so it is no longer shown.
  - The fix is in one renderer (`verifiedGa()` in `app.js`); the content data is unchanged.
  - The Home badge "Aligned with Georgia Grade 3 ELA Standards" now reads **"Practices Georgia Grade 3 language skills"**. For grown-ups has a standards note.

## 6. Prioritized follow-up (recorded, not done)

1. **Owner review on a real device with Chris.** Physical phone or tablet, real screen reader, and an observed child session were not tested.
2. **Standards.** Re-check against the live GaDOE site from a normal network (this sandbox could only use the saved copy). Codes now appear only in For grown-ups.
3. Per-skill Test wording: done (every tier now says "On this test, …" and names a next step).
4. Verb-tense pools: done in the review pass (see §5).
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
