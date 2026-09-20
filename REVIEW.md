# BUILD 1.4.0 — REVIEW GUIDE

For a reviewer reading this branch on GitHub. Branch `claude/build-1.4`,
baseline `8266029` (which was Build **1.3.0** — the branch name is not the
version; read `js/app.js`).

**Do not merge this into `main`.** `main` is at Build 1.2.7. If GitHub Pages
publishes from `main`, merging is what changes the live site, and that is a
separate decision from approving this code.

## What changed, in one line

The mode-first portal and the illustrated "Sentence Detectives" mission are
retired. The child now chooses the **skill** first, and the 20-question Verb bank
is reachable normally instead of behind a secret URL.

```
HOME → SKILL → LEARN | PRACTICE | TEST → ACTIVITY
```

## Where to look first

| If you want to check… | Read |
|---|---|
| The product model and every permanent rule | `SENTENCE-SENSE-HANDOFF.md` |
| Verdicts per area, evidence per claim | `AUDIT-REPORT-Build-1.4.0.md` |
| That nothing live was deleted blindly | `DELETION-DEPENDENCY-REPORT.md` |
| Every word a child can read | `CONTENT-MANIFEST.md` |
| Phone/tablet/desktop measurements | `RESPONSIVE-REPORT.md` |
| Raw check output | `verification/results.json` |

## Source layout

| File | Role |
|---|---|
| `index.html` | Five screens: home, skill, learn, practice, coming-next |
| `css/styles.css` | All styles, phone-first, sections 1–13 |
| `js/app.js` | Shell: Home, shared Skill screen, routing, icons, build badge |
| `js/sentence.js` | **NEW** — the one sentence renderer everything uses |
| `js/learn.js` | The shared four-state LEARN component |
| `js/practice.js` | **NEW** — the shared PRACTICE question engine |
| `js/data/learn-content.js` | All content. No teaching text lives anywhere else. |

Load order matters: `learn-content` → `sentence` → `learn` → `practice` → `app`.

## Run the tests

```powershell
node verification/serve.js . 8347      # terminal 1
node verification/guard.js ./out       # terminal 2
```

`guard.js` needs `puppeteer-core` and a local Chrome, neither of which is a
project dependency — the shipped site has no package manifest and no build
system. Point at them with `$env:PUPPETEER` and `$env:CHROME`; see
`verification/README.md`.

**214 checks, 214 passing.**

## Four defects were found and fixed *during* this build

Worth reviewing specifically, because three of them were invisible before:

1. **`verification/serve.js` returned 403 for every request** under the project's
   own documented command. `ROOT` was used raw while the traversal guard compared
   it against a resolved absolute path.
2. **The primary button had no visible focus ring.** `:focus-visible` set
   `box-shadow`; `.btn-start`'s own shadow was declared later at equal
   specificity and won. Now drawn with `outline`.
   *The first version of the check passed it* — it called `.focus()` in script,
   which does not reliably match `:focus-visible`. A test that cannot fail is not
   evidence.
3. **Stranded punctuation** on a marked word (defect M-02 from 1.3.0 recurring).
   Fixed with `.ss-word-body`; now guarded by check 10.4, where previously it was
   caught only by looking at a screenshot.
4. **The Verb icon rendered as a running stick figure.** Replaced with an
   abstract motion mark — then **restored** when the owner confirmed the
   reference image as the intended appearance. See `ASSETS-NEEDED.md`.

## Known issues, carried openly

| ID | Issue |
|---|---|
| **P-02** | Subject, Noun and Adjective have Learn only. Practice and Test are honest placeholders. No question banks were invented. |
| **D-20** | Abstract nouns defined in the Noun lesson but never demonstrated in a marked sentence. Carried forward untouched. |
| **D-26** | The build badge can fall below the fold on some device classes. |
| **L-04** | **No screen reader was run.** ARIA and focus movement are implemented and checked programmatically; no screen-reader testing is claimed. |
| **L-05** | **No testing with a child.** The most important gap in this project. |

## Two things that are deliberate, not oversights

**The hero photograph is supplied and installed** —
`assets/images/sentence-sense-hero.jpg`, 2048×768, 169 KB, no baked-in text. The
banner uses two layouts: stacked band above the text on phones, overlay behind a
scrim at 620px and up, because both children sit in the right half of the frame.
Legibility is measured at all nine viewports, not assumed. See
`ASSETS-NEEDED.md`.

**`complete-subject` and `predicate` still have full content** in
`learn-content.js` and are not routed anywhere. That is required preservation for
a later migration, not dead code left by accident.
