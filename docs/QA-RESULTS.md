# Executed QA — development candidate

2026-10-24. Environment: Node 24.22.1, Playwright 1.62.1, downloaded Chromium headless shell 143.0.7499.4 with no-sandbox/no-zygote/single-process flags required by this container. File-URL origin for browser tests; no public preview or deployment.

Baseline: no committed runnable tests exist on main at cc1f102. A reconstructed smoke check actually launched the baseline, opened six topics, and entered the Verb definition. Earlier failed browser-launch/download attempts are recorded in WORK-PROGRESS and were not counted as passes. The later-discovered production 1.8 branch has a separate historical harness; it was not run in this session.

## Latest evidence

`npm test`: **41 passed, 0 failed**. Full output in `evidence/unit-tests.txt`. Covers seven units and full teaching contracts; every lesson's counts, unique full prompt/context pairs, stable correct keys, feedback and hints; fresh retake contexts; Form-B word-bank/key agreement; official code existence; abstract-noun application; production Verb stage order; exact saved place, assistance, recovery, storage failure, scoring, retakes, writing snapshots, reset and stale-tab write prevention.

`npm run test:browser` with BROWSER_PATH: see `evidence/browser-results.json` for the latest executed pass/fail counts and date. Fifteen grouped checks cover first/returning entry, all 30 lesson entry points and all four stages, five Teach pages, hints/reveal/retry, ten-task independent completion, complete 29-task Forms A and B, scoring only after submission, writing-pending mastery protection, parent review, retake history, refresh, notebook original/revision preservation, safe text rendering, native-dialog Escape/focus return and background exclusion, keyboard focus, five core text-contrast pairs, stale double-advance protection, the complete 15-task preserved Verb cycle, ten viewport sizes, and reset confirmation/cancellation.

Screenshots: `home-phone.png`, `practice-phone.png`, `home-desktop.png`, `teach-desktop.png`. These are actual browser captures. They were visually inspected; the first inspection caught an overlay defect that geometry checks had missed. Later captures verify its removal. Screenshots contain only synthetic test work.

## Separate review passes

Engineering: state belongs to a specific lesson/stage/question; test answers are not assessed until submit; result snapshots survive a new sitting; all text rendering is safe; no external student-data transfer. Confirmed issues found during development were fixed and checks rerun.

Instruction: keys, grammar rules and examples reviewed against the authored families and current official codes. Additional passes corrected generic writing families, missing continued/introduced grammar cases, overly revealing hint-three text, repeated retake contexts, and comparative-adverb/sentence-classification sampling. This is an internal editorial pass, not external educator validation of every assembled form. Tests on data structure are not proof of grammar correctness.

Usability: every lesson/stage rendered; responsive geometry checked; phone/desktop captures visually inspected. The action-rail overlap was a real defect and was corrected. Physical devices, real screen readers and child usability remain untested.

## Release status

**Development checkpoint; not a complete production release.** Main and live-site baselines differ; full 1.8 parity/content-pool reconciliation remains open (LIVE-BRANCH-RECONCILIATION.md). Content families are populated but still reuse structures, and independent educational breadth/difficulty review remains required. No merge or deployment is authorized or performed. Do not equate passing automated tests with complete acceptance of the owner's full assignment.
