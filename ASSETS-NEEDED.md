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

**The standards badge sits in the text column, under the sub-line — not
top-right.** The reference had a blank whiteboard in that corner; this photograph
has a child there, and neither top-right nor bottom-right is reliably clear of
both children. Keeping the badge inside the text column guarantees clear space at
every width and puts it on the readable area, so it never lands on a face.

### The readability overlay is confined to the text

The scrim previously washed across to 72% of the banner, which desaturated the
boy's face at roughly 56%. The headline ends around 45%, so the scrim now fades
to fully transparent by 56% and both children keep their natural contrast. If the
text column is ever widened, widen the scrim with it — not past it.

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

## 3. The Learn · Practice · Improve · Grow row — BUILT, as decoration

Added on owner instruction, beside the closing quote.

**It is decoration, and it must stay that way.** No `href`, no `button`, no
`tabindex`, no click handler, and `aria-hidden` on the list so a screen reader is
not offered four dead words. Do not turn these into controls: pressing them would
go nowhere, and a dead control is worse than no control.

It sits beside the quote at 620px and up, and wraps to a full-width row below the
quote on phones. The four glyphs are authored the same way the skill icons are —
no asset required.
