# Learning engine

## Modules

`curriculum.js`: 30 lessons in seven units, prerequisites, definitions, worked-example objectives, common mistakes, steps and rubrics. `questions.js`: deterministic authored question families, alternative contexts, per-choice feedback, specific coaching, writing models, assessment forms. `verb-reference-bank.js`: the 20-item authored production Verb bank, preserved from Build 1.8.0 at ccbfeb41784f7eef95aaa64e7de1426932f960c1. No runtime API or AI calls.

`progress.js`: versioned local storage, validation, recovery copy, session state, results, immutable answer snapshots and scoring. `system.js`: safe DOM rendering, routes, teaching, practice, assessment UI, parent review and writing notebook. `system.css`: local system font stack, responsive layout, focus, contrast and native-dialog presentation. Existing 1.2.7 engine/styles and teaching content remain in source; only the teaching data is loaded for extra worked examples. They are not the 2.0 runner.

## Routes and stages

`#home`, `#lessons`, `#lesson/{id}/{teach|guided|independent|test}`, `#writing`, `#notebook/{id}`, `#parents`. Native hash navigation supports browser Back. Home does not overwrite a lesson bookmark. Returning students reopen the saved stage, teaching page or question. Invalid routes have a recoverable Home action.

Teach has five pages: objective/meaning, worked example, demonstration steps, common mistake, understanding check. The final check must be answered correctly to use Start Practice Together; other stages remain freely accessible for review. Study Guide uses native modal dialog, with Escape/Close and focus return.

Guided has 12 tasks, except Verb has 15 to retain staged action/being work plus helping/linking transfer. The preserved Verb bank is sampled within four stages, three questions per stage; three additional authored helper/linking tasks follow. The other banks sample four tasks from each difficulty band. Choices shuffle by stable key identity; order persists across rerenders and refresh.

Independent has exactly eight objective and two writing tasks. Hints and reveal require a nonempty attempt; first-attempt correct without assistance is a separate metric. New sessions rotate through the bank. Wrong feedback names the actual chosen error; retries do not erase the first attempt or assistance record. Original writing stays pending until reviewed.

Tests contain 29 tasks. See ASSESSMENT-SPEC. Test rendering never includes feedback, hints, or answers before submission. Response bank in Form B contains multiple unmarked options; it is not a disclosed answer key. A complete submit-review dialog precedes scoring. Retake history retains response snapshots and reviewed writing, rather than just the latest score.

## State and error handling

Every question owns response text, selected stable choice, attempts, first-attempt status, help count, reveal flag, completion, shuffled option IDs, and parent rubric. Advancing uses a current-render token to ignore stale detached handlers. Back does not reset a session. Refresh saves exact position, including test text entered before Next. Writing autosaves plan and draft; preserving a first draft makes it read-only, while revisions save separately.

Missing progress starts cleanly. Unsupported or damaged records are copied to `sentence-sense-v2-recovery` where storage permits, with an explicit notice. Save failures warn and leave in-memory use available. A change from another tab locks writes until reload, protecting newer work from stale state. Reset requires explicit confirmation and removes writing and history as well as bookmarks.

No names, account identifiers, remote analytics or cloud storage. Student text is inserted with textContent or textarea.value, never HTML. CSP blocks connections and external execution; system fonts remove the old font CDN request. All assets and answer keys are static and inspectable; this is not an anti-cheating security boundary.
