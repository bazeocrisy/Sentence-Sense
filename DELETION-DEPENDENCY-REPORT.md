# BUILD 1.4.0 — DELETION AND DEPENDENCY REPORT

Every file removed in Build 1.4.0, with the dependency check that was run
before it was removed. Brief section 21 requires that each mission file be
confirmed unreferenced, that the check be recorded, and that every deletion
be listed. This is that record.

## Method

A repo-wide search for each exported symbol, filename and DOM id belonging to
the retired feature, restricted to the files that survive the redesign
(`index.html`, `css/`, `js/`), run BEFORE any file was deleted.

## Result — the mission files are a closed dependency island

| Symbol / id searched | Referenced by |
|---|---|
| `SS_MISSION` | `js/mission.js`, `js/data/mission-verb.js` only |
| `SS_SCENES` | `js/mission.js`, `js/scenes.js` only |
| `SS_MISSION_VERB` | `js/mission.js`, `js/data/mission-verb.js` only |
| `scenes.js` | `js/mission.js` only |
| `mission-verb.js` | `js/mission.js`, `js/scenes.js` only |
| `mission.js` | nothing |
| `screen-mission` | nothing |
| `openGuideFor` | `js/mission.js` only |
| `stopSpeech` / `speechSynthesis` | `js/mission.js` only |
| `guide-overlay`, `guide-panel`, `closeGuide`, `guideIsOpen` | nothing |
| `verb=classic` | `js/practice.js`, as a COMMENT recording its removal. No code path. |

Every reference to the mission is either inside the mission's own three files
or gone. No surviving file imports, calls or styles any of them.

## Files deleted

### Retired feature — the Sentence Detectives mission (brief section 21)

| File | Size | Why |
|---|---|---|
| `js/mission.js` | 32.6 KB | The mission engine. No longer routed to; nothing depends on it. |
| `js/scenes.js` | 29.4 KB | Inline-SVG artwork for the mission only. Its sole consumer was `js/mission.js`. |
| `js/data/mission-verb.js` | 29.1 KB | Mission content only. Its sole consumer was `js/mission.js`. |

### Mission-specific verification assets (brief section 21)

| File | Why |
|---|---|
| `verification/missionguard.js` | 114 checks, every one of them against the retired mission. |
| `verification/results.json` | Its raw output. |
| `verification/responsive-matrix.json` | Its 14-viewport matrix, measured on mission cards. |
| `verification/README.md` | Documented how to run the mission harness. Replaced. |
| `verification/screenshots/` (33 files) | Every screenshot is of a retired screen. |

`verification/serve.js` was KEPT and its relative-root defect fixed.

### Superseded audits (brief section 23)

`AUDIT-REPORT-Build-1.2.3.md`, `-1.2.4.md`, `-1.2.5.md`, `-1.2.7.md`,
`-1.3.0.md`. The working agreement says exactly one audit exists at a time.
After this build that is `AUDIT-REPORT-Build-1.4.0.md`.

### Obsolete asset (brief section 23)

`assets/Sentence-Sense_logo.png` — 1,746,404 bytes. A repo-wide search
confirmed ZERO references from `index.html`, `css/` or `js/`, re-run
immediately before deletion. It was 66% of the repository's asset weight and
was fetched by nobody.

## Files NOT deleted, and why

| File | Status |
|---|---|
| `assets/images/logo.png` (972 KB) | **Now unreferenced.** The cartoon-mascot lockup contradicts the Build 1.4.0 art direction (brief sections 3 and 29), so the new Home does not use it. Brief section 23 authorised deleting one specific asset and this is not it, so it was left in place. **Needs an owner decision.** |
| `assets/images/logo-512.png` (304 KB) | Same. Now unreferenced. |
| `assets/images/favicon.png` | Still referenced by `index.html`. Kept. |
| `js/data/learn-content.js` — `complete-subject` and `predicate` | Kept in full. Brief section 11H requires preserving usable content for future migration. Not routed to, not deleted. |
| `studyGuide` objects | Kept. They are the audited source of the chip lists and the same-word contrast that are now surfaced inside LEARN. |
