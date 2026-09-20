# ASSETS — Build 1.4.0

## 1. Classroom banner photograph — ✅ SUPPLIED AND INSTALLED

| | |
|---|---|
| **Path** | `assets/images/sentence-sense-hero.jpg` |
| **Dimensions** | 2048 × 768 — exactly 8:3 |
| **Weight** | 169 KB |
| **Baked-in text** | None. Correct. |

Installed and verified: check **2.13b** asserts the photograph actually loads and
is painted, and the banner-legibility check passes at all nine viewports.

The probe path in `js/app.js` is `.jpg`, matching the supplied file. A photograph
compresses far better as JPG than PNG, so the extension is also the right choice.

### How it is laid out — two layouts, on purpose

Both children sit in the **right half** of the frame (faces at roughly 56% and
83% across), so a single layout could not serve both screens.

**Phone (below 620px) — the photo is a BAND ABOVE THE TEXT.** An 8:3 banner at
358px wide is only 134px tall; overlaying navy type on that would leave the
children tiny *and* the text cramped. Stacked, the children get real height and
the wordmark sits on solid ground, so legibility never depends on what the
photograph happens to be doing behind it. The crop is biased right
(`background-position: 88% 30%`), which throws away the calm left third of the
classroom — the part carrying no subject — and keeps both faces.

**620px and up — the photo fills the banner and the text overlays it**, as the
reference shows, behind a left-to-right white scrim that keeps navy type above
WCAG AA over an unpredictable photograph.

Harness check `11.home.<viewport> banner headline stays legible over the photo`
measures this rather than assuming it: it reports *stacked, no overlap* on the
three phone widths and *overlay + scrim* on the six larger ones, and fails if
text ever overlaps the photo with no scrim painted.

### One deliberate deviation from the reference

**The standards badge sits bottom-right, not top-right.** The reference image had
a blank whiteboard in that corner; this photograph has a child's head there, and
a label across a face is worse than a small placement change. Wordmark top-left,
badge bottom-right still reads as a balanced banner and nothing is obscured.

Say the word if you would rather have it top-right and accept the overlap.

### Optional, still not supplied

`assets/images/sentence-sense-hero-portrait.png` — ~1200 × 1200. Not needed: the
stacked phone layout already keeps both children large and clear, which is what
the portrait crop would have solved. Listed only for completeness.

---

## 2. Brand lockup — OPTIONAL, not blocking

The wordmark is **live text**: "Sentence" in navy, "Sense" in green, beside an
inline SVG book glyph. It scales perfectly and weighs nothing.

The previous raster logos (`logo.png`, `logo-512.png`) were deleted in this
build: both had become unreferenced, and the cartoon-mascot pencil lockup
contradicted the product's art direction.

So **no raster brand asset exists** for use outside the site — a README header,
an app icon, a printed sheet. If one is wanted:

`assets/images/wordmark.png` — ~1200 × 400 px, transparent background.

`assets/images/favicon.png` is unchanged and still the old mark. Replacing it is
a separate, cosmetic decision.

---

## 3. One design decision still open

The reference pairs the bottom quote with a **`Learn · Practice · Improve · Grow`
icon row**. That row was **not built**: it reads as persistent navigation, and
tapping it would go nowhere, which is the kind of element the product brief rules
out.

If you want it as **non-interactive decoration** — four small glyphs with labels,
no links, no tab stops — say so and it is a short change. No asset is required;
the glyphs would be authored the same way the four skill icons are.
