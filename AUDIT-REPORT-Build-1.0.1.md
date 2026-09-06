# Sentence Sense Audit Report

## Build

**Build 1.0.1**

## Phase

**Logo Deployment Hotfix.** No feature work. No Learn, Practice, Break It Down, or Test development. No home-screen redesign.

## Problem

On the deployed site, `https://bazeocrisy.github.io/Sentence-Sense/`, the Sentence Sense logo did not render. The browser showed the broken-image placeholder and the `alt` text instead of the logo. The rest of the page — layout, colours, four mode buttons, navigation — worked, which showed that `css/styles.css` and `js/app.js` were deploying correctly and only the image request was failing.

## Root Cause

**Filename case mismatch between the repository folder and the HTML reference, exposed by GitHub Pages' case-sensitive Linux filesystem.**

The exact facts, read from the live repository and the live site:

1. The repository's `main` branch contains the images under a folder named **`Assets`** with a **capital A**:

   ```
   Assets/Sentence-Sense_logo.png     1,746,404 bytes
   Assets/images/favicon.png              8,718 bytes
   Assets/images/logo-512.png           304,371 bytes
   Assets/images/logo.png               972,925 bytes
   ```

2. `index.html` in the same commit requests the images with a **lowercase `assets`**:

   ```html
   <img class="home-logo" src="assets/images/logo.png"
        srcset="assets/images/logo-512.png 512w, assets/images/logo.png 1024w" ...>
   <link rel="icon" type="image/png" href="assets/images/favicon.png">
   ```

3. Verified live, on the deployed site:
   - `https://bazeocrisy.github.io/Sentence-Sense/assets/images/logo.png` → **404**
   - `https://bazeocrisy.github.io/Sentence-Sense/Assets/images/logo.png` → **200, image served**
   - `https://bazeocrisy.github.io/Sentence-Sense/css/styles.css` → 200

   Same bytes, same commit; the only difference is one capital letter.

**Why it looked fine on your machine and broke only after deploying.** Windows NTFS is case-insensitive: `C:\Sentence-Sense\Assets\` and `C:\Sentence-Sense\assets\` are the same folder to Windows, so opening `index.html` locally finds the logo. GitHub Pages serves from a case-sensitive Linux filesystem, where `Assets` and `assets` are two different folders and the lowercase one does not exist.

**How the capital A got there.** Your repository already contained `Assets/Sentence-Sense_logo.png` — the original supplied logo, stored in a folder you created as `Assets` before Build 1.0. When the Build 1.0 ZIP (which contains a lowercase `assets/`) was extracted into `C:\Sentence-Sense`, Windows treated it as the same folder, merged the new files into the existing `Assets\`, and **kept the folder's original capital-A name**. Git then recorded the new files under `Assets/`, and `git add .` committed them that way. Nothing in the ZIP was wrong and no file was missing — the folder simply landed under the name that was already on disk.

**This was my miss, not yours.** I shipped a lowercase `assets/` into a repository that already had a capital `Assets/` and did not check the deployed result. The favicon was broken by the same cause and would have gone unnoticed longer.

## Reproduction

The failure was reproduced locally, not assumed. A copy of the Build 1.0 project was made on a case-sensitive Linux filesystem and its `assets` folder renamed to `Assets`, leaving every file byte-identical:

| Request | Result |
|---|---|
| `/assets/images/logo.png` | **404** |
| `/Assets/images/logo.png` | **200** |

Rendered in a browser against that copy, the logo element reported `naturalWidth: 0` — the broken-image state — at desktop, tablet, and phone, with `404` logged for both `assets/images/logo.png` and `assets/images/favicon.png`. That is exactly the symptom reported on the live site, which confirms the diagnosis rather than merely matching it.

## Files Modified

| File | Change |
|---|---|
| `js/app.js` | `BUILD_NUMBER` constant changed from `"Build 1.0"` to `"Build 1.0.1"`; header comment updated to name this build |
| `css/styles.css` | Header comment only — build number in the top comment block. **No style rule was changed** |

No other application file was modified. `index.html` is **byte-for-byte unchanged** from Build 1.0.

## Files Added

| File | Purpose |
|---|---|
| `AUDIT-REPORT-Build-1.0.1.md` | This report |

No image, script, stylesheet, or configuration file was added.

## Exact Fix

The code was already correct; the repository folder name was wrong. The fix normalises the repository to match the code, rather than editing the code to match an accidental capital letter.

**1. Application change (in the delivered ZIP):** the build number constant in `js/app.js`, so the footer reads `Sentence Sense — Build 1.0.1`. That is the only functional change.

**2. Repository change (you run this, in PowerShell):** rename the tracked folder `Assets` → `assets`. Because Windows is case-insensitive, Git cannot do it in one step; the rename goes through a temporary name. The commands are at the end of this delivery and must be run **before** extracting the new ZIP, so that the lowercase folder already exists on disk and the extraction merges into it correctly.

After the rename, `assets/images/logo.png` in the repository matches `assets/images/logo.png` in `index.html`, and GitHub Pages resolves it.

**Why not the other way round?** Changing `index.html` to request `Assets/` with a capital A would also have worked and needed no Git commands from you. I rejected it: it would bake a stray capital into every future path, leave the project inconsistent with the lowercase `css/` and `js/` folders, and re-break the moment anyone normalised the name. If you would rather take that route anyway, say so and I will ship it as 1.0.2 — it is a two-attribute change.

## Logo Validation

The supplied logo is unchanged: not redrawn, not regenerated, not recoloured, not replaced, not cropped. The image files in this build are bit-identical to the ones delivered in Build 1.0.

| Check | Result |
|---|---|
| Main logo exists | PASS — `assets/images/logo.png`, 1024 x 768, 972,925 bytes |
| `src` path resolves | PASS — `assets/images/logo.png` returns 200 on a case-sensitive filesystem |
| `srcset` resolves | PASS — both candidates return 200: `assets/images/logo-512.png` (512 x 384, 304,371 bytes) and `assets/images/logo.png` |
| `sizes` selection works | PASS — phones load `logo-512.png` (297 KB); wide/high-density displays load `logo.png` |
| Favicon resolves | PASS — `assets/images/favicon.png`, 64 x 64, was broken by the same cause and is fixed by the same rename |
| Aspect ratio preserved | PASS — intrinsic ratio measured as **1.3333 (4:3)** on every device tested, identical to the supplied original (1448 x 1086). `object-fit: contain` guarantees the rendered image is never stretched |
| No broken fallback | PASS — `naturalWidth` is non-zero at all nine tested viewports; no broken-image icon, no `alt` text shown |
| Desktop verified | PASS — 1280 x 800 and 1920 x 1080; logo renders at up to 440 x 330 |
| Tablet verified | PASS — 768 x 1024 and 1024 x 768; logo renders at 400 x 300 |
| Phone verified | PASS — 320, 375, 390, and 430 px wide; logo renders correctly, height-capped so the four mode buttons are not pushed down |

## Regression Testing

The full Build 1.0 test suite was re-run on the Build 1.0.1 files at nine viewports (320x568, 375x667, 390x844, 430x932, 768x1024, 1024x768, 1280x800, 1920x1080, 844x390 landscape).

| Check | Result |
|---|---|
| Home screen loads | PASS at all nine viewports |
| Logo loads | PASS at all nine viewports, `naturalWidth` non-zero |
| Learn card opens its destination screen | PASS — green header, tag "Learn", correct title and text |
| Practice card opens its destination screen | PASS — blue header, tag "Practice" |
| Break It Down card opens its destination screen | PASS — gold header, tag "Break It Down" |
| Test card opens its destination screen | PASS — purple header, tag "Test" |
| Back button returns Home | PASS — 36 of 36 (4 modes x 9 viewports) |
| Home button returns Home | PASS — 36 of 36 |
| Escape returns Home | PASS — 36 of 36 (behaviour existed in Build 1.0 and is unchanged) |
| Enter key on a focused card | PASS — opens that mode, focus moves to the screen heading |
| Tab order | PASS — skip link, then Learn, Practice, Break It Down, Test |
| Build badge | PASS — reads **"Sentence Sense — Build 1.0.1"** on every screen at all nine viewports |
| Horizontal overflow | PASS — 0 px at all 45 measurements |
| Dead controls | PASS — none |

108 of 108 navigation checks passed. No previously working behaviour changed.

## Console Audit

**No application console errors and no uncaught exceptions** at any of the nine viewports, on the home screen or any mode screen.

One non-application entry appears in my test sandbox only: the Google Fonts stylesheet request is blocked by this environment's outbound proxy, so every measurement and screenshot in this report was taken with the system-font fallback. That request succeeds on your machine and on GitHub Pages. It is the same font link Add It! uses and was documented in the Build 1.0 audit; it is unchanged in this build.

## Missing Asset Audit

Every local reference in `index.html`, `css/styles.css`, and `js/app.js` was enumerated and resolved against the delivered project on a case-sensitive filesystem:

| Reference | Source | Result |
|---|---|---|
| `css/styles.css` | `index.html` | 200 |
| `js/app.js` | `index.html` | 200 |
| `assets/images/logo.png` | `index.html` `src` and `srcset` | 200 |
| `assets/images/logo-512.png` | `index.html` `srcset` | 200 |
| `assets/images/favicon.png` | `index.html` `link rel="icon"` | 200 |

`css/styles.css` references no external files (no `url()` calls). `js/app.js` fetches nothing. No 404s. No unused files are shipped in the ZIP.

## GitHub Pages Audit

| Check | Result |
|---|---|
| `index.html` at repository root | PASS — deploys from `main / (root)` |
| All local paths relative | PASS — `css/styles.css`, `js/app.js`, `assets/images/...`. No leading `/`, so the app works from the `/Sentence-Sense/` subpath |
| Case consistency | PASS — every folder and file is lowercase in both the project and every reference, so the project is safe on a case-sensitive server. **This is the item that failed before and is the point of this build** |
| No server-side code, database, API, or build step | PASS |
| No Jekyll conflict | PASS — no underscore-prefixed or Jekyll-reserved directories; `css/` and `js/` already served correctly, confirming Jekyll is not interfering |
| Verified against | `https://bazeocrisy.github.io/Sentence-Sense/` |

**One action is required on your side.** The ZIP alone cannot fix this: the wrong name lives in the repository, not in the files. Running `git add .` after extracting will not correct it, because Windows keeps the existing capital-A folder on disk and Git keeps tracking `Assets/`. The rename commands must be run. They are the first two lines of the command block at the end of this delivery.

## Scope-Creep Audit

**No unapproved feature was implemented.**

- No Learn, Practice, Break It Down, or Test development.
- No home-screen redesign; `index.html` is byte-identical to Build 1.0.
- No CSS rule changed — the only stylesheet edit is one line of comment text.
- No mode colours, button text, or spacing changed.
- No new navigation, no browser-history behaviour, no web manifest, no self-hosted fonts, no `.nojekyll`, no `theme-color`, and no item from the Build 1.0 Future Considerations list.
- No files added except this audit report.
- No refactoring of unrelated code.

## Known Issues

1. **`Assets/Sentence-Sense_logo.png` (1.75 MB) sits in your repository and nothing uses it.** It is your original supplied master image, which is why the capital-A folder existed. The rename moves it to `assets/Sentence-Sense_logo.png`; it is preserved, not deleted. It is not referenced by the app and is not in the delivered ZIP. Keeping a master copy in the repo is reasonable, so I left the decision to you — say the word and a later build removes it. **Not fixed in this build: unrelated to the logo failure.**
2. **320 x 568 phones:** the fourth mode button (Test) still sits about 57 px below the fold and needs a short scroll. Carried over from Build 1.0 and documented there. **Not fixed in this build: unrelated to the logo failure.**
3. **Landscape phone (844 x 390):** the page scrolls, as expected at 390 px of height. Nothing is cut off. Carried over from Build 1.0. **Not fixed in this build.**
4. **Logo element letterboxing:** on some widths the logo's box is wider than the drawn image, because the height cap engages before the width cap and `object-fit: contain` centres the image inside the remaining box. The image itself is never stretched or cropped and stays perfectly centred; the extra space is transparent and invisible. Present in approved Build 1.0. **Not fixed in this build: cosmetic, and adjusting it would mean changing home-screen spacing, which this build is not authorised to do.**
5. **Google Fonts remains the app's only outbound request.** Unchanged from Build 1.0 and documented there. Your call on it is still open. **Not fixed in this build.**

Nothing in this build is known to be broken.

## Final Audit Result

**PASS**

The failure was diagnosed to an exact cause — a capital-A `Assets` folder in the repository against a lowercase `assets` reference in `index.html`, resolved differently by case-insensitive Windows and case-sensitive GitHub Pages — verified against the live site and reproduced locally. The logo, `srcset` alternate, and favicon all resolve on a case-sensitive filesystem, the original artwork and its 4:3 aspect ratio are untouched, and the build number reads Build 1.0.1. All Build 1.0 functionality was retested and passed: four mode buttons, Back, Home, Escape, tab order, zero overflow, zero console errors.

The one caveat on this PASS: the deployed site is fixed only after the folder-rename commands are run, because the defect is in the repository rather than in the delivered files.
