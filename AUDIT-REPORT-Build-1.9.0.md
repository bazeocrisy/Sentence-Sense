# Sentence Sense — Build 1.9.0 verification record

Date 2026-11-06. Branch `claude/write-strong-sentence` (base `build-1.8` @ `ccbfeb4`). Draft PR against `build-1.8`; not merged, not deployed.

| Check | Result |
|---|---|
| `verification/guard.js` on untouched 1.8 baseline | 889 passed, 0 failed |
| `verification/guard.js` on 1.9.0 | 889 passed, 0 failed. Expectations updated: build number (×2), hero line, keyboard order (three "Next for you" stops come first), qualified Georgia line, Learn completion title, and three Verb result message patterns. Scoring, celebration and button checks are unchanged. |
| `serve.js` bind address (Linux container) | default `127.0.0.1:8347`: loopback 200, network address refused. `0.0.0.0`: network address 200. `/.git/config` and `/.GIT/config`: 404. `../` traversal: 403. Not tested on Windows. |
| GitHub Pages source | **Unverified.** The settings API is blocked here. Deployment history shows only `claude/build-1.4` builds. |
| `verification/write-check.js` (Playwright, Chromium 1243, headless) | 125 passed, 0 failed (`verification/write-results.json`) |
| Screenshots inspected by eye | `verification/write-screenshots/` |

`write-check.js` covers:
- 25 punctuation and sentence-count cases (Mr./Mrs./Dr./St., initials, p.m., straight and curly quotes, `?`, `!`, `!!`, commands);
- praise wording rules;
- the shortest path (5 required taps plus typing);
- keep-unchanged, add-words, remove-words, command and restore-first-draft paths;
- refresh, Home, Escape and Back resume, with the first draft frozen;
- HTML and multiline input shown as plain text;
- grown-ups view, notes, delete one and delete all;
- an older 8-step save resuming;
- blocked, full and damaged storage;
- no speech support;
- 375×667 and 320×640 layouts;
- keyboard focus after each transition;
- verified Georgia tags;
- smoke tests of Learn, Practice, Test and Grammar Check.

Defects found while verifying and fixed:
- a step change could be lost inside the save debounce;
- marked words were erased from the parent evidence after revising;
- the frame-blank detector fired on `__` in ordinary text;
- capitalizing "the" was reported as adding and removing words;
- a when/where/how detail suggested Adjective;
- the header tag truncated at 320px;
- the "nothing noticed" note used the warning colour;
- the sentence-count check flagged Mr./Mrs. and `"Wow!" said Mom.` (first version).

Not tested:
- real phones and tablets;
- screen readers (VoiceOver, TalkBack, NVDA);
- Safari and Firefox;
- actual speech output (only the unsupported-speech path);
- a child using it;
- the live GitHub Pages site and the live GaDOE site (both blocked from this sandbox);
- Google Fonts (blocked here, so system fallback fonts were used).
