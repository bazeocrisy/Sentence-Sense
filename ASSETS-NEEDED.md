# ASSETS NEEDED — Build 1.4.0

One asset is missing. The site is complete and fully tested without it; supplying
it is the last step to matching the approved reference image exactly.

**I cannot produce this file.** It is a photograph of real children, and this
project does not author illustrations of people.

---

## 1. The classroom banner photograph — REQUIRED for full reference match

| | |
|---|---|
| **Path** | `assets/images/sentence-sense-hero.png` (or `.jpg` — see note 4) |
| **Content** | Two students at a desk in a bright classroom, as in `assets/reference/home-screen-mockup.png` |
| **Dimensions** | ~2400 × 900 px — a 8:3 landscape crop |
| **Weight** | Under ~400 KB optimized. It is the largest thing on the page. |
| **Format** | PNG, or JPG at quality ~82 (a photograph compresses far better as JPG) |

### Four things that matter more than the picture itself

**1. NO BAKED-IN TEXT. This is the important one.**
The page draws the wordmark, the headline, the sub-line and the standards badge
as **live text** over the photograph. Anything printed into the pixels will
double up with that text, will not scale, cannot be changed without a new export,
and will collide at phone widths.

So the supplied photo must **not** contain:

- the "Sentence Sense" wordmark or tagline
- the "3rd Grade ELA / Georgia Standards Aligned" badge
- the handwritten "Good Sentences Create Big Opportunities"
- the "LEARN PRACTICE IMPROVE SUCCEED" poster
- the "READ PRACTICE GROW BELIEVE" book stack

Those elements belong to the mockup as a *composition study*. The live page
reproduces the ones that are approved, as text.

**2. Keep the children right-of-centre.**
The left ~45% of the banner sits under the wordmark and headline. A subject
placed left will be covered by the legibility scrim. Faces should land in the
right half.

**3. The left edge should be relatively plain.**
A gradient scrim lightens the left side so navy text stays above WCAG AA over an
unpredictable photograph. The calmer that region, the better the type reads.

**4. Optional second file for phones.**
`assets/images/sentence-sense-hero-portrait.png`, ~1200 × 1200 px. An 8:3 crop
loses both faces on a narrow screen. Without this the phone banner simply shows
the designed fallback, which is why it is optional rather than required.

### Installing it

Drop the file at the path above. **That is the entire installation step.**

`js/app.js` probes for it with an `Image` object and adds `.has-photo` only when
it genuinely loads. No code change, no CSS edit, no rebuild. Until the file
exists the banner renders a designed fallback in the *same composition*, so
nothing shifts when the photo arrives, and a broken image box is never shown.

Verified during this build with a throwaway file: the class applied, the layer
painted, the scrim activated, and there were **0 console errors and 0 404s**. The
throwaway was then deleted.

### Why the current mockup cannot be used directly

`assets/reference/home-screen-mockup.png` is a flattened composite — the logo,
the badge, the handwriting and the card layout are all baked into one raster. It
cannot be cropped into a usable banner, because the text comes with it.

---

## 2. Brand lockup — OPTIONAL, not blocking

The wordmark is currently **live text**: "Sentence" in navy, "Sense" in green,
beside an inline SVG book glyph. It scales perfectly, weighs nothing, and matches
the reference closely.

The previous raster logos (`logo.png`, `logo-512.png`) were deleted in this
build: both had become unreferenced, and the cartoon-mascot pencil lockup
contradicted the product's art direction.

That means **no raster brand asset exists** for use outside the site — a README
header, an app icon, a printed sheet. If one is wanted, supply:

`assets/images/wordmark.png` — ~1200 × 400 px, transparent background.

`assets/images/favicon.png` is unchanged and still the old mark. Replacing it is
a separate, cosmetic decision.

---

## 3. One design decision still open

The reference pairs the bottom quote with a **`Learn · Practice · Improve · Grow`
icon row**. That row was **not built**: it reads as persistent navigation, and
tapping it would go nowhere, which is the kind of interface element the product
brief rules out.

If you want it as **non-interactive decoration** — four small glyphs with labels,
no links, no tab stops — say so and it is a short change. No asset is required;
the glyphs would be authored the same way the four skill icons are.
