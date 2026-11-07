# Build 1.9.1: focused repair

Branch `claude/repair-1.9.1`, based on production `d958c60` (Build 1.9.0, served from `claude/build-1.4`). Draft PR only. **Production is unchanged until the owner approves.**

No paragraphs, no new skills, and no AI grading were added. The existing design and activities are kept.

---

## 1. Findings: verified first, then fixed

| Finding | Verified on 1.9.0 | Evidence | Fix |
|---|---|---|---|
| Parent notes can silently fail after another tab updates writing | **Yes** | Tab B saved new writing; a note then typed in Tab A's grown-ups view never reached storage | Saves merge with what is already stored, keeping this tab's changed pieces; screens look pieces up by id; the grown-ups view shows save status |
| Existing writing hidden when storage allows reads but rejects writes | **Yes** | 0 pieces shown | Reading and writing are checked separately; saved writing shows, with "can't save new changes" |
| Long unbroken words overflow the phone Check screen | **Yes** | 320px viewport, page 777px wide | Word buttons wrap long words |
| Self-check evidence can refer to an earlier revision | **Yes** | Grown-ups saw "Tapped 'puppy' · Said yes" beside "My cat slept all day." | The checked text is recorded and named when it differs from the final version |
| Food bank plurals vs "tastes" frame | **Yes** | Bank had tacos, pancakes, apples | Bank is all single items: pizza, soup, a taco, my sandwich, mac and cheese, a crunchy apple |
| Check example explanation didn't match the highlight | **Yes** | Highlight "found a shiny rock"; text "He found a shiny rock." | The text now quotes the highlighted words |
| Complete Sentence lacks worked examples before Practice | **Yes** | Learn shows one missing-subject fragment and a one-line run-on note; no missing-predicate example; no repair modelled | **Sample sequence built for missing subject** (§3). Missing predicate and run-on are waiting for your review of the sample. |
| Writing needs child-selected help | **Yes** | Only a "doesn't say yet" toggle existed | Revise offers "It doesn't say who or what", "It doesn't tell what happens" and "My thought isn't finished" |
| Hints repeat directions or remove choices | **Yes** | Hint 1 repeats the skill clue; Hint 2 crosses out answers | Complete Sentence: item-specific Hint 1 and Hint 2 for all 20 Practice items and the Learn try. Hint 2 now gives a reasoning step instead of crossing out. The other nine skills are unchanged (follow-up). |
| Demonstrate purposeful revision | **Yes** | Only an "add a detail" example | "See how writers revise": add useful information, take out extra words, keep it the same |

---

## 2. Technical verification

| Check | Result |
|---|---|
| `verification/write-check.js` (Playwright, Chromium) | **231 passed, 0 failed** (195 before the §3b follow-up) |
| Regression checks R1–R5 on unchanged 1.9.0 | **10 failed** (the defects reproduce) |
| Regression checks R1–R5 on 1.9.1 | all pass |
| `verification/guard.js` (original 1.8 harness) | **889 passed, 0 failed** |
| Preview bundle (`verification/build-preview.js`) | loads with no errors; footer shows **Build 1.9.1** |

`guard.js` changes:
- the build number;
- two checks that required Complete Sentence Hint 2 to cross out answers. They now require it to cross out nothing, and stay strict for every other skill.

New checks:
- **R1–R5:** cross-tab notes; read-only storage; 320px long word; checked-version evidence for the Check answers and for ticked boxes.
- **T1–T7:** food bank agreement; Check example; all three fix-help panels (different sentences, child's words untouched); revision examples; 320px fit; grown-ups record.
- **U1–U5:** hint coverage; Practice Hint 2 is a reasoning step and crosses nothing out; other skills unchanged.
- **V1–V26:** every answer and help path in the sample sequence (below).

Not tested:
- real phones and tablets;
- screen readers;
- Safari and Firefox;
- spoken read-aloud;
- the hosted preview inside the claude.ai viewer, beyond loading the bundle in Chromium.

Known preview limitation: the claude.ai viewer blocks `confirm()` dialogs, so **Delete this piece**, **Delete all saved writing** and **Go back to my first draft** do nothing in the hosted preview. They work on the real site and in the local preview.

---

## 3. Teaching-quality review: "Fix it: Who is it about?"

Placement: Complete Sentence → **Learn · Fix it · Practice · Test**. It sits before independent practice, and no other skill changes.

| Step | What Chris sees and does | Answer and help paths reviewed |
|---|---|---|
| 1. Notice | "Jumped over the big puddle." What do you want to know? | **Who jumped?** → explains the missing who, unlocks Next. **How big…? / When…?** → each explains why it wouldn't fix the problem, is crossed through, and invites another try; Next waits. |
| 2. What's missing | Two-part box: WHO OR WHAT "?", WHAT HAPPENS "Jumped over the big puddle." Introduces "fragment", already used in Learn | Review fix: the box first showed lowercase "jumped" before the capital change had been taught. It now shows "Jumped". |
| 3. One way to fix it | "My little sister jumped over the big puddle." Why J became j. Three other valid fixes | Several answers modelled as valid, so the model isn't "the" answer |
| 4. Careful! | "Jumped over the big, muddy puddle after school." Does this fix it? | **Yes** → "More words didn't fix it." **No** → "Adding details doesn't add a who." Both teach and both unlock Next; Chris can still change his answer. |
| 5. Your turn | "Ate all the strawberries." Chris types his own fix. Optional idea chips add only the who; three-rung Help (question → reminder of the model → sentence frame); he taps who in his own fix | Any valid repair is accepted. Notes are questions only: "Is there a who before ate?" and "Did you keep a part that tells what happens? Changing it is okay…". Tested with four different repairs. Nothing is typed for him. Saved through refresh. |
| 6. Write your own | New prompt: someone in your family doing something | No mastery language. Opens the regular writing flow; Back returns to his saved fix. |

Review issues found and fixed before publishing:
- the capital-letter preview in step 2;
- Help me sat at the bottom of the screen, far from the writing box;
- Help 3 repeated the chip instructions instead of giving a frame;
- two imprecise hint phrasings ("a word like … the dog", and "with" listed as a describing word).

Remaining teaching concerns for your review:
- **Step 4 is still a two-choice question.** A child can tap "No" without thinking; the explanation is the safeguard.
- **"Fragment" is introduced in one line.** Watch whether Chris needs the word at all.
- **Step 5 can't tell a sensible repair from a silly one.** For example, "The moon ate all the strawberries." is grammatical. That is a grown-up conversation, which is why the fix appears in For grown-ups.
- **Revise screen length:** fix help plus revision examples make it long on a phone. Both are folded or one-at-a-time, but watch for scrolling fatigue.

What this does **not** show: passing these steps, ticking self-checks, or answering multiple-choice questions correctly does not show Chris can write complete sentences on his own. Only his own writing, read by an adult over time, shows that.

---

## 3b. Owner test follow-up: "Ddddd" and "is it right?"

On a phone, the owner wrote "Ddddd", kept it, and got **"You read your sentence again and chose to keep it. That's a real writer's choice."** Causes:
- nothing looked for one-word entries or junk letters;
- the keep-it praise ignored open notes;
- finishing took one tap.

The app still never rewrites Chris's writing. Fixed by checks that ask, plus a check that comes from a person:

| Check | Reliability | What it does |
|---|---|---|
| **A grown-up's check** (For grown-ups → Your check) | The only "right / not yet" judgment, and it comes from a person | **Looks good ✓** or **Let's fix it together**. Records which version was looked at. Chris sees it first on Home; "Open it" reopens that sentence on Revise. |
| **Task-specific checks** (Fix it) | Dependable, because the task narrows the answer | "Is there a who before ate?", "Did you keep a part that tells what happens?" |
| **Built-in word list** | Dependable for "is this a common word", not for grammar | 43,879 common words (SCOWL, with its notice) plus the app's own words; about 400 KB, nothing sent anywhere. An unknown lowercase word gets "Look at “freind”. Is it a real word, spelled the way you want?". Names, contractions and abbreviations are skipped. |
| **One word / junk letters** | Heuristic, so asked as a question | "There is only one word…" (not for one-word exclamations like "Stop!"); a letter typed 3+ times in a row, or 4+ letters with no vowel |
| **Honest finish** | n/a | With notes open, finishing pauses once ("Go back and look" / "Finish anyway"). No "writer's choice" praise. Compare lists **Still worth a look** with **Revise it**. Grown-ups see what was still noted at finish. |

New checks: W1–W17 (the "Ddddd" walk, false-alarm guards such as "Stop!", "Mississippi" and "rhythm"), X1–X10 (grown-up check), Y1–Y8 (word list: misspellings named; names, contractions and abbreviations not questioned; every word the app suggests is known). **write-check 231/231, guard 889/889.**

Still not possible without a person or AI: knowing whether a sentence is complete, sensible or grammatical. "The moon ate my homework." passes every automatic check.

## 4. Observed child usability

**Unverified.** Chris has not used Build 1.9.1. Nothing above describes how a child experiences it. Use `PILOT-CHECKLIST.md`, adding the Fix it lesson to the session, and record what happens.

---

## 5. Next, after your review of the sample
1. If the sample's shape works for Chris, build the same sequence for **missing predicate** and **run-on repair**.
2. Replace generic or choice-removing hints in the other nine skills (about 180 Practice items) with item-specific reasoning steps.
3. Then return to the roadmap in `WRITING-MILESTONE.md`.
