# Sentence Sense — Build 1.9.0 verification record

Date 2026-11-06. Branch `claude/write-strong-sentence` (base `build-1.8` @ `ccbfeb4`). Not merged, not deployed.

| Check | Result |
|---|---|
| `verification/guard.js` on untouched 1.8 baseline | 889 passed, 0 failed |
| `verification/guard.js` on 1.9.0 | 889 passed, 0 failed (four expectations updated for the new build number, hero line, and the three extra Home tab stops) |
| `verification/write-check.js` (Playwright, Chromium 1243, headless) | 83 passed, 0 failed (`verification/write-results.json`) |
| Screenshots inspected by eye | `verification/write-screenshots/` (desktop Home, marks, compare, grown-ups; phone 375×667 draft, 320×640 who) |

Defects found while verifying and fixed: step change could be lost inside the 250 ms save debounce; marked words were erased from the parent evidence after revision; frame-blank detector fired on `__` inside ordinary text; capitalizing "the" was praised as adding and removing words; a when/where/how detail suggested Adjective instead of Adverb; header tag truncated at 320px.

Not tested: real phones and tablets, screen readers (VoiceOver, TalkBack, NVDA), Safari/Firefox, actual speech output (only the unsupported-speech path and button presence were checked), a child using it, the live GitHub Pages site (blocked from this sandbox), and the Google Fonts path (blocked here; system fallbacks used).
