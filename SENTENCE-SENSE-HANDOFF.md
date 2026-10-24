# Sentence Sense — 2.0 development handoff

Build 2.0.0-dev. Date: 2026-10-24. Feature branch: `feature/sentence-sense-2-learning-system`. **Development checkpoint; no merge/deployment authorized or performed.**

Repository main baseline: cc1f102924ad4bb74166b1ac056005c3854380e3, Build 1.2.7. Production actually serves Build 1.8.0 matching build-1.8 and claude/build-1.4 at ccbfeb41784f7eef95aaa64e7de1426932f960c1. Read `docs/LIVE-BRANCH-RECONCILIATION.md` before discussing a production replacement. The historical 1.2.7 handoff remains available in git at the baseline commit; it no longer describes this feature branch.

The new app loads local curriculum, deterministic question families, preserved production Verb bank, versioned progress and a route-based engine. Seven units contain 30 lessons. Stages: Teach (five pages), Practice Together (12 tasks; Verb 15), On My Own (exactly 10), Test (exactly 29: 26 objective + 3 parent-reviewed writing). Form B uses fresh contexts and a constrained typed response bank. Mastery requires at least 24/29 and all writing criteria met; unreviewed writing stays pending. Guided help cannot award mastery.

Files: `js/data/curriculum.js`, `js/data/questions.js`, `js/data/verb-reference-bank.js`, `js/core/progress.js`, `js/system.js`, `css/system.css`, `index.html`. The original learn.js/app.js/styles.css are retained for historical comparison and are not the new runner. The original learn-content.js supplies a few extra worked examples. The preserved production Verb bank is actually reused; the full newer 1.8 pools are not yet migrated.

Local storage key: sentence-sense-v2. No account or cloud data. Writes are validated, damaged data gets a recovery copy where possible, cross-tab changes lock stale writes, and reset requires confirmation. Original writing is saved separately from revisions. Browser clearing/device changes can remove access to progress; the UI explains this.

Read `docs/OWNER-REVIEW.md`, `docs/QA-RESULTS.md`, `docs/FORENSIC-AUDIT.md`, `docs/GEORGIA-ELA-STANDARDS-MATRIX.md`, `docs/CURRICULUM-MAP.md`, `docs/LEARNING-ENGINE-SPEC.md`, `docs/ASSESSMENT-SPEC.md`, `docs/UX-AUDIT.md` and `docs/WORK-PROGRESS.md`.

Run `npm test`. Browser suite: `npm run test:browser`, with Playwright and a compatible installed browser; optional BROWSER_PATH. Runtime evidence and real captured screenshots are committed under docs/evidence. Current tests are recorded in QA-RESULTS; historic audit counts are not current results.

Next work: reconcile the live branch’s content and retained behavior, complete independent educational breadth/difficulty review, and validate real devices/screen readers/child use. The draft must stay unmerged and undeployed until the owner explicitly authorizes those actions. Do not claim this checkpoint is the finished full assignment.
