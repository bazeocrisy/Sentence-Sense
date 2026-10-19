# Sentence Sense — Build 1.8.0 Audit Report

**Build:** 1.8.0 (base 1.7.0, `f237a77`) · **Date:** 2026-10-19
**Owner direction (2026-10-19):** "one overall test as another tab or card"; best product, with checks and audits; each release goes live once every check passes.

## Verdict

| Check | Result |
|---|---|
| Owner harness `verification/guard.js` | **885 pass, 4 fail.** All 4 failures are the Google Fonts CDN, which the sandbox blocks. |
| New harness section **15G** (Grammar Check) | 14 of 14 pass |
| Independent screen and UX audit (24 full sittings, 10 answer patterns, 320/390/1366, 480 question screens, 33 next-step buttons clicked, 95 Show me how walk-throughs) | 0 must-fix, 7 should-fix, 8 nits. Scoring matched an independent recount in every sitting. **6 should-fix fixed, 1 resolved by design (S7, below).** |
| Phone check (every screen including a full Grammar Check, at 320/375/390) | 765 screens, no sideways scroll, Home always on screen |
| Overall | **PASS — released** |

## What changed
1. **Grammar Check** banner on Home ("Check yourself"), below the Words and Sentences groups.
   - 20 questions: exactly 2 from each skill, drawn only from the reviewed test pools. It adds no new questions.
   - Each skill contributes one easier and one harder question, ordered easiest first.
   - Fresh questions are preferred on a retake.
   - No hints during the check.
2. **Results:** a score, a row for each of the ten skills, and guidance.
   - The pass mark is 17 of 20, with at least 1 right in every skill.
   - "Skills to practice next" lists a button for each skill with a miss, opening its Practice, or its Learn when the score is low.
   - Skills with nothing right are listed first.
3. **After the check:** Show me how on missed questions uses each skill's own clue and explanation.
4. **Home** offers "See my last check: N of 20" for the rest of the visit, so following a next-step button never loses the results. This is kept in memory only; nothing is stored.
5. **Single-length tests** (all nine skill Tests and the Grammar Check) no longer show a one-button "How many questions?" picker.
6. **Escape** during the Grammar Check returns Home.

## Audit findings fixed
- **S1:** 17/20 with a few misses showed "You know your grammar" beside "Skills to practice next". It now shows "You passed… a quick Practice will make them even stronger" under **Skills to polish**.
- **S2:** 18/20 with one skill at 0/2 didn't say why it hadn't passed. It now shows "So close! To pass, get at least 1 right in every skill."
- **S3:** a low score's main button was "Try again". After a check, the main button is now **Back to Home**, and the next-step buttons are the real actions.
- **S4:** the single-option length picker and its "Longer just means more" note are gone.
- **S5:** the next-step list now lines up with the score column on desktop.
- **S6:** the result rows and buttons use full skill names ("Complete Sentence", not "Sentences", which clashes with the Home group name).
- **S7:** following a next-step button lost the results. **Resolved by design:** the results can be reopened from Home for the rest of the visit.

## Left as nits
- The "Check" header tag trims at 320px.
- The check's question screens use the default navy colour.
- At 0/20, the child sees ten Learn buttons and no single starting point.
- The review doesn't name each question's skill.
- The top Back button leaves the check without a warning, the same as skill Tests.

## Limitations
- No child testing.
- Chromium only.
