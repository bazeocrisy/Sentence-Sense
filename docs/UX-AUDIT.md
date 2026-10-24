# UX and accessibility review

Reviewed as a child-facing grammar path with ordinary phone scrolling permitted. Browser measurements use Chromium headless shell 143.0.7499.4, not physical devices.

| Finding | Impact | Resolution | Verification |
|---|---|---|---|
| Competing large returning-student cards | Too many choices before the next action | Returning home shows Continue and Choose a Lesson; Writing Lab stays in navigation | Phone and desktop screenshots inspected |
| Sticky bottom action rail covered a phone question | Required words and choices were obscured | Actions now follow the question in normal flow | Screenshots inspected again; responsive checks rerun |
| Parent navigation consumed a second phone header row | Reduced instructional viewport | Parent Progress is a clear footer link and a post-test action | 320–1920px viewport matrix |
| Abstract nouns lacked application | Definitions did not show the skill in use | Courage example and abstract/collective/proper/common questions | Content checks plus visual review |
| Modal background access in old Study Guide | Potential assistive-technology escape | New runner uses native dialog instead of the legacy overlay | Open/close, Escape and focus return executed; screen reader pending |
| Indistinct disabled primary button | Student could mistake unavailable Next for an active action | Explicit disabled colors plus native disabled state | CSS and browser-state review |
| Large paragraphs and all lessons list | Potential cognitive load | Five teaching pages, collapsible references/results, searchable unit list, one question at a time | Every lesson entry/stage rendered |

Viewport matrix: 320×568, 375×667, 390×844, 768×1024, 1024×768, 1366×768, 1920×1080, 844×390, 667×375 and 1920×600. Nine route types checked at every size. No horizontal overflow or required-button geometry failure in the executed matrix. This does not mean all content fits without scrolling. No screenshots of physical phones were generated or claimed.

System text is normally 17px (16px on small phones), buttons at least 44px, content has no fixed-height clipping. Visible focus uses a 3px outline. Native button/textarea/label semantics, live feedback and a skip link support keyboard and assistive technologies. No motion is required; reduced-motion rules remove transitions/animations. Color does not carry correctness or subject/predicate identity alone.

Remaining validation: actual iOS Safari dynamic toolbar, Android/Firefox/WebKit, physical touch use, VoiceOver/NVDA, distance/projector reading, and observed use by an eight-year-old. These are not claimed passed. The 29-task test is intentionally long because it is an owner requirement; it has no timer and can be interrupted safely.
