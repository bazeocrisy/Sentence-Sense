# Forensic audit

Baseline: main and feature branch `cc1f102`, Build 1.2.7. Audit date 2026-10-24. Files inspected: all HTML/JS/CSS, handoff, all four historical audit reports, asset inventory, remote branch inventory, tracked-file and test/config inventory. PNG assets inspected as existing static dependencies, not educational content. There are no committed tests, package manifest, deployment workflows or AGENTS.md. Historical harness claims cannot be reproduced from this checkout. Pages configuration is not present in source; do not change it.

The following are confirmed by source inspection unless explicitly labelled suspected. Baseline line references remain tied to cc1f102 after edits. Severity: critical prevents safe use; high blocks required product behavior; medium limits instruction/access; low maintenance issue.

| ID | Severity | File:lines | Reproduce | Root cause | Impact | Fix | Regression risk | Verification | Status |
|---|---|---|---|---|---|---|---|---|---|
| F01 | High | js/app.js:40–58; index.html:218–241 | Open Practice, Break It Down or Test | Deliberate placeholders | No practice or assessment | Add authored curriculum and session engine | Routing | End-to-end every stage | Confirmed; implementation pending |
| F02 | High | js/learn.js:34–49,317–336,391–406 | Exit/refresh midway | In-memory state; re-entry resets | Learning and answers lost | Versioned validated local progress | Stale/corrupt data | Refresh and navigation tests | Confirmed |
| F03 | High | js/data/learn-content.js:57–931 | Browse six topics | Scope ends at adjective; five topics have one question | Missing grade-level grammar and writing | Seven-unit curriculum mapped to current standards | Incorrect expansion | Standards/content review | Confirmed |
| F04 / D-20 | Medium | js/data/learn-content.js:725–829 | Noun example and Try It | Abstract nouns only in definitions/chips | No demonstrated application | Explicit abstract/collective examples and assessment | Category ambiguity | Inspect joy/courage and group nouns | Confirmed |
| F05 | High | js/learn.js:590–671,719–775 | Student cannot answer | Help occurs only after wrong choices | No progressive hints or direct answer request | Authored three-level hints and help buttons | Assisted mastery contamination | Attempt/help accounting | Confirmed |
| F06 / D-35 | Medium | js/learn.js:775–855; index.html:242–251 | Inspect open guide accessibility tree | aria-modal and trap without inert background | Some AT may reach background | Native dialog for new engine | Browser support/focus | Keyboard, inert semantics; human screen reader pending | Confirmed structural issue |
| F07 / D-27 | Medium | css/styles.css:737–984 | 375×667 clue step | Dense vertical content; below-fold next | Required controls easy to miss | Persistent action rail with content clearance | Content obstruction | Short height viewport checks | Historical measurements unverified; suspected UX impact |
| F08 | Medium | js/learn.js:428–477 | Finish a guided topic | Completion says “learned” regardless help | Completion implies mastery without evidence | Separate completion, independent results and reviewed mastery | Existing behavior | Scoring tests | Confirmed |
| F09 | Low | SENTENCE-SENSE-HANDOFF.md:40–52,456–488 | Compare inventory to handoff | Claims only one report and available harnesses | Maintainer confusion | Current handoff plus committed tests | None | Inventory check | Confirmed |
| F10 | Medium | index.html:9–11 | Load offline/restricted network | External Google Fonts | Third-party request and untested font metrics | Use local system font stack | Typography/wrapping | Network and responsive checks | Confirmed dependency; not a confirmed data breach |
| F11 / D-26 | Low | index.html:252; css/styles.css build badge | Scroll dense screens | Badge follows page flow | Debug metadata may be below fold | Keep badge readable in document flow | Fixed overlay risk | Visual QA | Accepted; not a child task blocker |

Baseline bank safeguards worth preserving: stable answer identity using dataset.ci; Fisher–Yates answer choice shuffle; staged difficulty; authored per-choice feedback; plain sentence before annotations; being-verb Q20 uses “busy” rather than ambiguous participle “crowded.” No fetched user input is inserted through unsafe HTML in the baseline. No browser storage or personal-data collection exists at baseline. Static answer keys are inspectable source code; a child-facing no-answer-during-test rule cannot make static browser assets secret.

Baseline tests: no runnable suite exists. Browser launch attempt failed due to missing executable; not a test pass. See WORK-PROGRESS and subsequent QA-RESULTS for actual execution evidence. Old reports are evidence about their own historic environments only.

## Resolution review and additional live-source finding

| ID | Current status | Evidence |
|---|---|---|
| F01 | New development engines implemented | Every lesson/stage opens; full guided, independent and assessment cycles execute |
| F02 | Fixed in new runner | Exact refresh/place tests, local snapshots, Back/Exit |
| F03 | Expanded to seven units / 30 lessons; breadth review remains | Curriculum/standards matrix and question contract tests |
| F04 / D-20 | Fixed in new content | Explicit abstract noun worked sentence with labelled courage, collective/common/proper/abstract tasks |
| F05 | Fixed | Three hint levels, I Don’t Know, direct answer, attempt-gated independent help |
| F06 / D-35 | Legacy overlay replaced in new runner | Native modal; Escape/focus and background exclusion checks; real screen reader untested |
| F07 / D-27 | New normal-flow controls; phone overlay found and fixed | Ten viewport sizes and visual screenshots; physical Safari untested |
| F08 | Fixed | Completion, independent correctness, assisted work and reviewed mastery separated |
| F09 | Current documentation and suite committed | New handoff and executed evidence |
| F10 | Removed in new entry point | Local system fonts, no external stylesheet, CSP connect-src none |
| F11 / D-26 | Accepted metadata placement | Footer remains in document flow |
| F12 | **OPEN, HIGH — production/main divergence** | Live source is Build 1.8.0, main is 1.2.7; see below |

F12 affected locations: baseline main js/app.js:40 and current production app.js BUILD_NUMBER declaration; production index script list. Reproduce by comparing fetched production HTML/app.js with main and build-1.8. Root cause: deployment-source history differs from main; production HTML exactly matches another remote branch. Impact: a main-based rewrite cannot be assumed to preserve all live behavior/content. Recommended fix: complete branch/parity reconciliation, preserve useful reviewed banks and mixed-skill behavior, determine intended deployment source before release. Regression risk: replacing newer live instruction with an older assumed baseline. Verification: compare source trees and run live-branch and candidate acceptance checks. Resolution: partial — newer branch inspected, production Verb authored bank preserved and reused; full live-pool/mixed-check parity remains open. No release-ready or complete claim is made.

These new-engine resolutions do not retrospectively turn the baseline defects into production defects: live 1.8 already has practice/test capabilities absent from main. The original findings are explicitly tied to cc1f102; the later production finding corrects the product-wide interpretation.
