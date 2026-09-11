# Verification — Build 1.3.0

Testing evidence for the Verb "Sentence Detectives" prototype.
See `../AUDIT-REPORT-Build-1.3.0.md` for the full write-up.

## Contents

| Path | What it is |
|---|---|
| `missionguard.js` | The harness. 114 checks driving real Chrome through `puppeteer-core`. |
| `serve.js` | Minimal static file server, so the app is tested over HTTP rather than `file://`. |
| `results.json` | Raw machine-readable output: every check name, PASS/FAIL and detail. |
| `responsive-matrix.json` | 56 measurements — 14 viewports × 4 card shapes. Scroll height, fold overhang, whether content straddles the fold, sentence row count, rendered font size, header→rail gap. |
| `screenshots/` | 33 captures at three form factors, plus regression shots of the untouched screens. |

## Result

**114 checks, 114 passing, 0 failing.**

| Responsive measure | Result |
|---|---|
| Horizontal overflow | 0 of 56 samples |
| False-bottom states | **0** |
| Below-fold primary action | 8 of 56 — all phones, all with visible continuation |
| Desktop / laptop / tablet (≥1024×600) | 0 below-fold |
| Header→rail gap | 14px, constant at every viewport |
| Non-monotonic width pairs | 0 |

All measurements and screenshots were taken with the **real Baloo 2 and Nunito
webfonts loaded** (`document.fonts.status = "loaded"`), which closes standing
limitation L-01 for this build.

## Re-running it

Needs Node and Chrome. `puppeteer-core` is not vendored — install it anywhere and
point `NODE_PATH` at it, or `npm i puppeteer-core` in a scratch directory and run
from there. The harness expects Chrome at
`C:\Program Files\Google\Chrome\Application\chrome.exe`; edit the `CHROME`
constant if yours is elsewhere.

```powershell
# terminal 1 — serve the repo
node verification/serve.js . 8347

# terminal 2 — run the checks and write fresh screenshots
node verification/missionguard.js ./out
```

Exit code is 0 when everything passes, 1 when any check fails, 2 if the harness
itself errors.

## What the screenshots show

`desktop-*` is 1440×900, `laptop-short-*` is 1366×768, `phone-*` is 390×844.

The numbered sequence walks the mission in order: briefing → watch (before and
after the reveal) → find (including a wrong answer, so the teaching feedback is
visible) → explore (empty, verb A, verb B) → solve (no picture, then the "why"
question) → extend (being verb model and practice, verb phrase taught, asked,
partial, complete) → case closed → study guide.

Four regression captures show screens this build did not touch:
`desktop-23-home-unchanged`, `desktop-24-topics-unchanged`,
`desktop-25-noun-lesson-unchanged`, and
`desktop-26-classic-verb-bank-still-works` — the original 20-question bank
reached through `?verb=classic`.

`desktop-22-reduced-motion-watch` is the same reveal with
`prefers-reduced-motion: reduce` emulated: no replay button, no animation, and
the teaching intact.

## Note on scope

These checks cover the mission and the regression surface around it. The
pre-1.3.0 harnesses (`bankguard.js`, `respguard.js`, `stateguard.js`, `bank.js`,
`func.js`, `q20.js`, `exact.js`, `checks.js`, `place.js`) are described in the
handoff as living outside the project and are **not in this repository**, so they
could not be run. `missionguard.js` reimplements respguard's CSS lint rule and
place.js's header→rail gap rule, but it is not a substitute for running the
originals.
