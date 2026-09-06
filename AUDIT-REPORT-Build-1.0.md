# Sentence Sense Audit Report

## Build

**Build 1.0**

## Phase

**Phase 1 — Foundation / Shell.** Branding, responsive application shell, home screen with the four approved modes, navigation, intentional destination screens, and the build-number footer. No educational engine.

## Scope Requested

Authorized for Build 1.0 only:

- Sentence Sense branding / supplied logo
- Responsive application shell
- Home screen
- Learn button
- Practice button
- Break It Down button
- Test button
- Short explanatory helper text
- Consistent navigation
- Back / Home patterns
- Intentional placeholder destination screens where necessary
- Build 1.0 footer

Explicitly out of scope: Learn engine, Practice engine, Break It Down engine, Test engine, Study Guides, sentence content library, scoring, storage.

## Add It! Reference Review

The supplied Add It! project was extracted and inspected before any Sentence Sense code was written (`index.html`, `css/styles.css` — 1,158 lines, `js/app.js` — 2,263 lines, `assets/images/`).

Patterns identified and deliberately carried into Sentence Sense:

| Add It! pattern | Carried into Sentence Sense |
|---|---|
| Single-page app shell, one `<section class="screen">` visible at a time via the `hidden` attribute | Same mechanism, same `showScreen()` shape |
| `:root` design-token block (palette, type, radii, shadows, focus ring) | Same token names and values; math-specific tokens dropped, sentence-part tokens reserved |
| Baloo 2 display / Nunito body type pairing | Same pairing, same fallback stack |
| Gradient "pick card" tiles with icon, name, sub-description, CTA pill | Same component, four cards instead of three |
| Coloured header per mode, brand mark on the left, Home button on the right | Same, driven by a `data-mode` attribute |
| Pill `nav-btn` with a 44px minimum height | Same, with the focus-ring specificity bug fixed (see Accessibility Audit) |
| `activity-foot` with a Back button pinned to the bottom of the screen | Same |
| Fixed build badge, bottom-right on desktop, in-flow on phones | Same |
| Method strip summarizing the app's strategy | Same component, Sentence Sense strategy wording |
| Phone treatment: full-width tappable rows with icon, text, and a trailing arrow | Same, applied to the four mode cards |
| Decorative background circles and faint watermark glyphs | Same idea, grammar words instead of numerals |
| Skip link, visually-hidden `<h1>`, `prefers-reduced-motion` guard | Same |

Deliberately **not** carried over: the multi-step setup wizard (Add It! needs skill/size/length choices before a mode; Sentence Sense Build 1.0 goes straight from Home to a mode), the addition board, base-ten renderer, number pad, and all math content and logic. No Add It! file, asset, or string was copied into the delivery.

## Requirements Traceability

| Requirement | Status |
|---|---|
| Four home modes (Learn, Practice, Break It Down, Test) | PASS |
| No additional main learning modes | PASS |
| Build number visible | PASS |
| Study Guide not a home mode | PASS |
| GitHub Pages compatible (`index.html` at root, relative paths) | PASS |
| No external APIs, server code, database, or authentication | PASS |
| $0 recurring application-service cost | PASS |
| Static HTML / CSS / JS only | PASS |
| Mobile layout (320px, 375–430px) | PASS |
| Tablet layout | PASS |
| Desktop layout | PASS |
| No horizontal page overflow | PASS |
| Supplied logo used, not redrawn / recoloured / cropped, aspect ratio preserved | PASS |
| Logo does not make the home screen unnecessarily tall | PASS |
| No dead controls | PASS |
| Back / Home navigation works | PASS |
| Semantic buttons, labels, keyboard access, focus states | PASS |
| Contrast does not rely on colour alone | PASS |
| No educational engine implemented | PASS |
| No scope creep | PASS |
| Console free of application errors | PASS |
| No missing assets or broken links | PASS |

## Files Added

```
index.html
css/styles.css
js/app.js
assets/images/logo.png            (1024 x 768, 950 KB)
assets/images/logo-512.png        (512 x 384, 297 KB)
assets/images/favicon.png         (64 x 64, 8.5 KB)
AUDIT-REPORT-Build-1.0.md
```

Sizes: `index.html` 117 lines, `css/styles.css` 302 lines, `js/app.js` 130 lines.

## Files Modified

None. Build 1.0 is the first build; no prior Sentence Sense project files were supplied with this request, so the repository content is created new.

## Logo Handling

- The supplied logo was **not** redrawn, regenerated, recoloured, or cropped.
- Original supplied file: 1448 x 1086 (4:3), 1.67 MB.
- Delivered `logo.png` is the same image scaled to 1024 x 768 — the **exact same 4:3 aspect ratio** (1.3333), high-quality Lanczos resampling, then losslessly re-compressed. Nothing was trimmed from any edge.
- `logo-512.png` is the same image at 512 x 384, served to phones through `srcset` so a small screen downloads 297 KB instead of 950 KB.
- `favicon.png` is the same full image scaled to 64 x 48 and centred on a 64 x 64 transparent canvas — **padded, not cropped**, so the whole logo remains visible in the browser tab.
- Displayed size is capped by both width and viewport height (`max-height: min(30vh, 300px)` on desktop, 18vh on phones, 15vh on narrow or short screens) so the logo never pushes the four mode buttons down the page.

## Features Implemented

1. Home screen: brand header, supplied logo, question heading, helper line, four mode cards, strategy strip.
2. Four mode cards, each with an icon, a name, a one-line child-facing description, and a call-to-action.
3. A single shared mode destination screen, driven by a `MODES` config object in `js/app.js`. Each mode sets its own header colour, tag, icon, title, and honest "Coming in a future build" description.
4. Navigation: card → mode screen; Back → Home; Home → Home; Escape → Home.
5. Focus management: opening a mode moves keyboard focus to that screen's heading.
6. Build badge rendered from a single `BUILD_NUMBER` constant: **Sentence Sense — Build 1.0**.
7. Responsive layout: four-across on desktop and tablet landscape, two-by-two on tablet portrait, full-width rows on phones.

## Features Explicitly NOT Implemented

Confirmed absent from this build:

- Learn engine and any lesson steps (Definition → Clue → Example → Try It)
- Practice engine
- Break It Down engine
- Test engine, scoring, or results
- Study Guides of any kind
- Sentence content library, answer keys, or sentence-data validation
- Any grammar definition, rule, or instruction beyond the four strategy-strip phrases on the home screen
- Progress saving, `localStorage`, accounts, avatars, coins, badges, leaderboards
- AI tutors, API calls, cloud services, speech recognition, parent dashboards
- Extra learning modes, settings screens, or animation systems

## Content Architecture Status

No educational content exists in Build 1.0, so no content module was created — creating one would have meant writing sentences that are not yet authorized.

The architecture is nonetheless prepared for it: `js/app.js` keeps all mode-specific text in one `MODES` config object rather than scattered through the code, and a header comment records that sentence content will live in its own data module (planned `js/data/`), separate from application logic, so sentences and answer keys can be audited independently. Colour tokens for verb, subject, noun, and adjective are reserved in `:root` so every future mode labels a sentence part the same way.

## Functional Testing

Tested in headless Chromium at nine viewports (320x568, 375x667, 390x844, 430x932, 768x1024, 1024x768, 1280x800, 1920x1080, 844x390 landscape).

| Interaction | Result |
|---|---|
| Click Learn card | Opens Learn screen, green header, tag "Learn", correct title and description |
| Click Practice card | Opens Practice screen, blue header, tag "Practice" |
| Click Break It Down card | Opens Break It Down screen, gold header, tag "Break It Down" |
| Click Test card | Opens Test screen, purple header, tag "Test" |
| Enter key on a focused card | Opens that mode (same as click) |
| Build badge text | Reads "Sentence Sense — Build 1.0" on every screen and viewport |
| Dead controls | None. Every button on screen performs its stated action |

Each of the four modes was opened and exited three ways at each of the nine viewports: 36 Back checks, 36 Home checks, 36 Escape checks — **108 of 108 passed**.

## Navigation Testing

| Path | Result |
|---|---|
| Home → Learn → Back | Returns Home, mode screen hidden | 
| Home → Practice → Back | Returns Home |
| Home → Break It Down → Back | Returns Home |
| Home → Test → Back | Returns Home |
| Any mode → Home button | Returns Home |
| Any mode → Escape key | Returns Home |
| Screen state after return | `data-mode` cleared, home screen visible, page scrolled to top |

Navigation is deliberately one level deep: a child is either on Home or inside one mode. Back and Home are both present on a mode screen and both return Home; Back sits bottom-left where Add It! puts it, Home sits top-right in the header.

## Mobile Audit

- **320 x 568 (smallest supported):** No horizontal overflow. Four full-width mode rows, each 268 x 86px. Logo capped at 85px tall. Header, heading, helper line, and the first three modes fit the first screenful; the fourth (Test) sits about 57px below the fold and needs a short scroll — see Known Issues.
- **375 x 667 (iPhone SE / 8 class):** No overflow. All four modes visible without scrolling (last card bottom 644px of 667px).
- **390 x 844 and 430 x 932 (modern phones):** No overflow. All four modes visible without scrolling, comfortable spacing.
- **844 x 390 (phone landscape):** No overflow. Logo drops to 15vh; the page scrolls, which is expected in landscape.
- Touch targets: mode rows 82–86px tall (full card width); Back and Home buttons 44px minimum height.
- Body text is 16px on phones; no text requires zooming.
- The build badge moves into the page flow on phones and stays on screen — the mode screen gives up a strip of viewport height so the badge is not pushed below the fold.

## Tablet Audit

- **768 x 1024 (portrait):** Two-by-two card grid, 300px columns. All four modes visible without scrolling (last card bottom 929px of 1024px). No overflow.
- **1024 x 768 (landscape):** One row of four 220px cards. All four visible without scrolling (last card bottom 680px of 768px). No overflow. The mode-card grid was narrowed at this range specifically so a tablet-landscape child still sees all four choices at once.

## Desktop Audit

- **1280 x 800:** One row of four 255px cards, strategy strip on a single line, badge fixed bottom-right. No overflow.
- **1920 x 1080:** One row of four 266px cards, logo capped at 340px tall. No overflow.
- Layout is capped at a 1320px shell so line length stays readable on wide monitors.

## Accessibility Audit

| Check | Result |
|---|---|
| Semantic controls | All interactive elements are real `<button>` elements; the only link is the skip link |
| Page structure | Visually-hidden `<h1>`, one `<h2>` per screen, `aria-labelledby` on each screen section |
| Skip link | Present, first in tab order, becomes visible on focus |
| Tab order | Skip link → Learn → Practice → Break It Down → Test (matches visual order) |
| Keyboard operation | Enter/Space activate cards; Escape returns Home from a mode screen |
| Focus visibility | White + blue two-ring focus indicator on all cards and nav buttons. **Bug found and fixed during this audit:** `.pick-card` and `.nav-btn` set their own `box-shadow`, which overrode the base focus rule; both now restate the focus ring explicitly. Verified in-browser after the fix |
| Focus management | Opening a mode moves focus to that screen's heading, so keyboard and screen-reader users are not left on a hidden button |
| Decorative content | Background shapes, watermark words, icons, and arrows are `aria-hidden` |
| Colour independence | Every mode is identified by name and icon, never colour alone; the build badge is text |
| Reduced motion | `prefers-reduced-motion: reduce` disables the screen-entry animation and transitions |
| Contrast (measured, WCAG 2.1) | Learn card navy on green 6.16:1 / on cyan 6.20:1 · Practice white on blue 5.23:1 / on deep blue 7.26:1 · Break It Down navy on yellow 9.30:1 / on orange 5.94:1 · Test white on purple-dark 5.90:1, yellow title (large text) on purple-dark 4.27:1 (threshold 3:1) · body navy on white 12.86:1 · helper line 5.48:1 · "Coming in a future build" 5.36:1 · build badge 6.41:1. **All pass AA.** Three colours were corrected during this audit: the Learn card was white-on-green at 2.09:1 and is now navy text; the Test card gradient was lightened-purple at 4.12:1 and now starts at purple-dark; the gold text token was 3.30:1 and was darkened to #8A5D00 |

## Educational Content Audit

Build 1.0 contains no grammar instruction. The only grammar-adjacent text is the home-screen strategy strip and the four mode descriptions. Each was checked for accuracy:

| Text | Assessment |
|---|---|
| "Find the verb" | Correct, and the authorized first step of the strategy |
| "Ask who or what?" | Correct question for locating the subject once the verb is known |
| "Find the subject" | Correct, and correctly placed after the verb — the app does not claim the subject always comes before the verb |
| "Check the sentence" | Correct, age-appropriate wording for the final check |
| "Take a whole sentence apart." | Describes Break It Down without asserting any grammar rule |
| Mode descriptions | Describe what each mode will do; none defines, labels, or explains a part of speech |

No definitions, no suffix rules, no answer keys, and no absolute grammar claims appear anywhere in this build. Reading level of all visible text was checked against a third-grade audience; two placeholder descriptions were shortened during this audit for that reason.

## Spelling and Language Audit

Every visible string was read: page title, brand name, tagline, skip link, home heading, helper line, four card names, four card descriptions, four call-to-action labels, four strategy phrases, four mode titles, four mode tags, four mode descriptions, "Coming in a future build.", Back, Home, and the build badge. No spelling or grammar errors found. Wording is short, concrete, and directed at the child ("Let me try on my own.").

## Regression Audit

Build 1.0 is the first build, so there is no earlier Sentence Sense functionality to regress. Within this build, the full nine-viewport test suite was re-run after every change — including the three contrast corrections, the focus-ring fix, the tablet-landscape grid change, and the phone height adjustments — and all navigation, overflow, and console checks passed on the final files.

## Console Audit

No application console errors and no uncaught exceptions at any of the nine viewports.

One non-application network entry appears in the test environment: the Google Fonts stylesheet request is blocked by this sandbox's outbound proxy. See the note below.

## Broken-Link / Missing-Asset Audit

All local references resolve: `css/styles.css`, `js/app.js`, `assets/images/logo.png`, `assets/images/logo-512.png`, `assets/images/favicon.png`. No 404s. No unused files are shipped. No Add It! files or assets are present in the delivery. All paths are relative, so the project works from a GitHub Pages subpath.

## External Dependency Note (read this)

`index.html` loads the Baloo 2 and Nunito webfonts from Google Fonts — the **same font link Add It! uses**, which is why the two apps share a typeface. It is a static stylesheet, not an API: there is no key, no account, and no cost.

It is the only request the app makes outside its own files. If it is blocked or offline, the app still renders and works completely; the font stack falls back to `system-ui`. That fallback was exercised throughout this audit, because the test sandbox blocks the request — every screenshot and measurement in this report was taken with system fonts, and the layout held.

If you would rather Sentence Sense have **zero** outbound requests, say so and Build 1.1 can either self-host the two font files in `assets/fonts/` or drop the webfonts for a system stack. I did not make that call unilaterally, because matching Add It! was the stated goal.

## Scope-Creep Audit

**No unapproved feature was implemented.**

Three items were added that are in-scope but worth naming explicitly so you can veto any of them:

1. **Strategy strip on the home screen** ("Find the verb → Ask who or what? → Find the subject → Check the sentence"). This mirrors the Add It! method strip, which is part of the family look. It is static text, not an interaction, and it teaches nothing beyond naming the strategy. Removing it is a two-line change.
2. **Escape key returns Home.** A convenience shortcut, not a control or a screen. No visible UI.
3. **Reserved sentence-part colour tokens** in `:root` (verb, subject, noun, adjective). Four unused CSS variables with a comment. Nothing renders from them in this build.

Nothing else was added. No settings, no dashboards, no storage, no extra screens.

## Known Issues

1. **320 x 568 phones:** the fourth mode button (Test) sits about 57px below the fold and requires a short scroll. Fitting all four would have meant shrinking the helper descriptions or the touch targets, and I judged readable text and 82px targets more important than eliminating a small scroll on the oldest phone size. Every phone at 375px and wider shows all four without scrolling. Say the word and I will trade differently.
2. **Landscape phone (844 x 390):** the page scrolls. Expected at 390px of height; nothing is cut off or overlapping.
3. **Google Fonts request** — see the External Dependency Note above. Not a defect, but it is a dependency and you should decide about it.

Nothing in this build is known to be broken.

## Future Considerations

Recorded, **not implemented**, awaiting approval:

1. A `js/data/sentences.js` content module holding annotated sentence objects (sentence, verb, simpleSubject, completeSubject, predicate, nouns, adjectives with their `describes` target, difficulty, category), plus a validator that refuses to generate a question whose answer is not unambiguous from the stored annotations.
2. Self-hosting the two webfonts in `assets/fonts/` to remove the only outbound request.
3. A shared "sentence strip" component that highlights a span of a sentence and labels it — one component reused by Learn, Practice, Break It Down, and Test so a part of speech looks identical everywhere.
4. Browser back-button support (History API) so a phone's system Back gesture leaves a mode instead of leaving the app.
5. A `theme-color` meta tag and a web app manifest so the app can be added to a phone's home screen.

None of these will be built without your approval.

## Final Audit Result

**PASS**

Build 1.0 delivers exactly the authorized Phase 1 scope: Sentence Sense branding with the supplied logo, a responsive shell, a four-mode home screen with helper text, working Back/Home navigation, intentional destination screens with no dead controls, and a visible Build 1.0 footer. No educational engine, no content, and no unapproved features were added. Three contrast defects and one focus-ring defect were found and corrected during the audit and re-verified. The two known issues above are documented honestly and neither breaks functionality.
