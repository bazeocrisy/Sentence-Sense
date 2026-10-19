# Sentence Sense — Build 1.5.0 Audit Report

**Build:** Sentence Sense — Build 1.5.0 (base: Build 1.4.2, `274a298`)
**Date:** 2026-10-19
**Approved by the owner:** the Help me design, six new skills, Home in two groups, Georgia tags, and going live directly once every check passed.
**Rollback:** branch `backup/live-build-1.4.2` is an exact copy of the 1.4.2 that was live before.

## Verdict

| Dimension | Result |
|---|---|
| Owner's harness `verification/guard.js` | **655 pass, 4 fail.** All 4 failures are the Google Fonts CDN, which the build sandbox blocks. The untouched 1.4.2 baseline fails the same 4 (386 pass, 4 fail). |
| Independent screen-by-screen audit | **1 must-fix (fixed), 10 should-fix (8 fixed, 2 left for the owner), nits.** All 160 Practice questions and all 48 Verb Test items were read; every marked answer is correct and is the only defensible choice. |
| Phone check | **201 screens** at 320, 375 and 390 wide: no horizontal scroll, Home button always on screen. |
| Overall | **PASS — released** |

## What changed

1. **Help me** (`js/practice.js`). It replaces "Need a clue?" and the old help that only grew when the child guessed wrong again.
   - Help 1 gives the strategy (`clue`).
   - Help 2 crosses out wrong choices until two are left. It never crosses out the answer.
   - Help 3 walks through the answer (`reveal`) and outlines the right choice. The child still taps it.
   - Asking for help never counts as an error.
   - A question finished through Help 3 or a third-miss reveal comes back once, later in the same stage, as "Let's try this one again". The total stays "of 20".
   - The third-miss reveal now uses the neutral help style, not a green tick.
2. **Six skills, each with Learn and a 20-question Practice bank; Test shows "Coming next".** The skills are Pronoun, Adverb, Complete Sentence, Helping & Linking Verbs, Verb Tense, and Subject-Verb Agreement. The banks were written and independently reviewed on 2026-10-18 (draft PRs #1 and #2), then checked again in this build by the owner's harness and by the screen audit.
3. **Home in two labelled rows:** Words (7) and Sentences (3). `homeGroups` drives the rows; `homeOrder` must equal the groups flattened, and check 2.2c enforces this.
4. **Georgia K-12 ELA tags** appear on the Skill screen, at the foot of every Learn step, and under every Practice question.
   - Each question shows its own `std` codes.
   - Grammar-chart skills show as `3-5.L.GC.1` with the skill named and its grade-3 level spelled out.
   - The Verb bank gained per-question tags. This was additive only; no wording changed.
5. **Short top-bar names:** "Help & Link", "Sentences" and "Agreement". The bar can also no longer push Home off a phone screen.

## Harness changes (`verification/guard.js`)

These change the harness only where the owner approved new behaviour:
- **Home checks:** they now read the expected skills from content and require 10 cards in two groups. They replace the old "exactly four" checks.
- **Escalation checks:** a second wrong answer now offers Help me instead of the unasked clue.
- **New Help me checks:**
  - Help 1 is never counted as an error.
  - Help 2 leaves two choices and never crosses out the answer.
  - Help 3 does not answer for the child.
  - The child's tap clears the outline.
  - The question comes back exactly once.
- **The six banks are pinned in `BANK_SPEC` and `POSITION_SPEC`.** Answer-position rules apply to each bank's find-the-word questions. Fill-in, "Is this complete?", "What job?" and fix-the-sentence items get their own checks instead: exactly one blank, the four choices all differ, and the correct choice never repeats the prompt.
- **The owner's harness caught real problems in the new banks,** and the content was fixed, not the rules:
  - First-wrong lines in Pronoun Q11–14 and Complete Sentence asked the strategy question ("Ask: Who…?"), which belongs to Help 1.
  - Reveals and right-answer lines in Complete Sentence and in the fix-the-sentence items did not name the answer.

## Audit findings and what was done

| # | Finding | Action |
|---|---|---|
| M-1 | The phone top bar pushed Home off-screen on 3 skills (419–468px wide) | Fixed: short tag names, and the tag can shrink while the buttons can't. Re-checked on 201 screens. |
| S-1 | The Complete Sentence callout ("one complete thought") contradicted Q13 | Changed to "has a subject and a predicate, and it makes sense by itself" |
| S-3 | Agreement "Show me" step said "Who walks?" | Changed to "Find the subject: Maya and her brother." |
| S-4 | Some tags showed a bare code | Every code now carries a plain label |
| S-5 | Level labels mixed (R)/(C)/(I) with "Master" | All spelled out |
| S-6 | Run-on items were tagged 3.L.GC.2.b | Now 3.L.GC.2.a only (Q11, 12, 14, 16) |
| S-7 | Verb bank had no per-question tags | Added: action verbs → GUM action verbs (Review); being verbs → GUM helping and linking verbs (Introduce) |
| S-9 | Tags sat above the lesson | Moved to the foot of each step |
| S-10 | Third-miss reveal showed a green ✓ | Neutral help style |
| nits | Help 2 / Help 1 duplication, "No, it needs a subject." said twice, *could* missing from the note, near-duplicate Let me try items, progress bar | Fixed |
| **S-2** | Verb Learn chip "Some action verbs end in -ing: running…" clashes with the new banks' "watching cannot be the verb by itself" | **Not changed: owner-approved Verb content.** Suggested: "Some verbs end in -ing after a helping verb: is running, are playing, was walking." |
| **S-8** | Verb Q9 feedback for *practice* says "names an event here, not something that happened" | **Not changed: owner-approved bank.** Suggested: "practice names a thing here, soccer practice. It is not the action." |
| nits | Subject Q10/Q20 switch *are* to *is* in the clue; Verb Q6/Q10 guess a gender ("he", "she"); some Subject sentences run 13–15 words | **Not changed: owner-approved banks.** Listed for the owner. |

## Limitations

- **The banks have not had the owner's own review.** The owner approved going live without it. Skim each new skill's 20 questions when you can.
- **No child testing yet.** As the 1.4 handoff says, nothing matters as much.
- **Chromium only, simulated devices, no screen reader.**
- **The Google Fonts webfont was never measured in the sandbox.**
- **`CONTENT-MANIFEST.md` still describes 1.4.0.** It was not regenerated in this build.
