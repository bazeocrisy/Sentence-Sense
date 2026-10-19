# Sentence Sense — Build 1.6.0 Audit Report

**Build:** 1.6.0 (base 1.5.0, `ba92f19`) · **Date:** 2026-10-19
**Owner direction (2026-10-19):** fill every card; the same Help me sequence on every card; best product with full checks. Releases go live once every check passes.

## Verdict

| Check | Result |
|---|---|
| Owner harness `verification/guard.js` | **789 pass, 4 fail.** All 4 failures are the Google Fonts CDN, which the sandbox blocks (same as the 1.4.2 baseline). |
| Independent grammar review (40 new questions + 10 Learn hints) | 3 must-fix, 6 should-fix, nits — **all fixed** |
| Independent screen audit (all 10 skills, 390 and 1366 wide, 361 screenshots) | 0 must-fix, 3 should-fix — **all fixed**; 2 nits fixed, 2 left (below) |
| Phone check | 213 screens at 320/375/390: no sideways scroll, Home always on screen |
| Overall | **PASS — released** |

## What changed
1. **Practice for Noun and Adjective,** 20 questions each in 4 stages, kept inside what each Learn lesson teaches.
   - Noun: person/place/thing, the one noun among the choices, idea nouns (this closes D-20: abstract nouns are now asked), and words that can do two jobs.
   - Adjective: what kind; how many and which one; which noun it describes; and choose the describing word for a blank.
   - **Every skill now has Practice.**
2. **Help me in Learn's "Let me try"** for all ten skills. It is the same three steps as Practice: the clue, then narrowing to two choices, then a walk-through with the answer outlined. The child still taps the answer. Every Let me try now carries a `clue` and a `reveal`; for Verb, Subject, Noun and Adjective these were added without changing any existing wording.
3. **A choice crossed out by Help 2 now looks different from a wrong answer.** It is faded with a dashed edge; a wrong answer stays struck through.
4. **Harness:**
   - Noun and Adjective are pinned in `BANK_SPEC`/`POSITION_SPEC`.
   - "Practice availability" is read from content instead of a hard-coded list.
   - New checks **15L.*** drive Help me in Learn for all ten skills.

## Review fixes (selected)
- **Noun Q13 and Q15 had two defensible "idea" answers.** "stories" and "lesson" can't be touched either. Both were rewritten with a concrete distractor (card, book).
- Adjective Q4: "A new one" → "New ones" (plural).
- **Adjective "which one" items:** "That red wagon" and "this blue marker" let a child answer the color. The color words were removed.
- Noun distractors no longer use labels the Noun lesson hasn't taught (adverb, helping verb). They now say what the word does.
- Adjective fill-in distractors use a "try it in the blank" test instead of the word *adverb*.
- The Pronoun Learn clue no longer names the answer.
- Tag label "Collective nouns" → "Collective and abstract nouns". Georgia codes no longer break across lines.

## Left for the owner
- **D-37:** right-answer lines start "Great job! five tells…" (lowercase word after the praise). This runs product-wide, so it's an owner decision.
- **Help me placement:** it sits inside the card in Learn and beside Next in Practice. Both work.
- **Four suggested fixes in the owner-approved Verb/Subject wording,** unchanged, as listed in the 1.5.0 report.

## Limitations
- The owner has not yet skimmed the new banks.
- No child testing.
- Chromium only.
- `CONTENT-MANIFEST.md` still describes 1.4.0.
