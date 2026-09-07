# SENTENCE SENSE — PROJECT HANDOFF

**Current build: Sentence Sense — Build 1.2.3**
**Last pass:** Learn UX correction — 2026-09-07
**Repository:** `C:\Sentence-Sense` → GitHub Pages · static · $0 recurring
**This file describes the CURRENT shipped state only. Read it first.**

---

## 1. WHAT THIS PROJECT IS

Sentence Sense teaches an elementary student — target **3rd grade, ages 8–9** —
how a whole sentence works: verbs, subjects, complete subjects, predicates,
nouns and adjectives. Static site: no database, no API, no accounts, no server
state. The only external request is the Google Fonts CDN.

Two governing rules:

> **PORTAL = CHOICE. MODE = DEPTH.**
> Home helps the child pick a mode and teaches nothing.

> **READ IT, then SEE HOW IT WORKS.**
> A child meets a sentence as a sentence before meeting its grammar.

---

## 2. BUILD NUMBERING — EVERY PUSH GETS A NEW NUMBER

**Every approved GitHub push increments the visible build number**, so the live
site can be verified after GitHub Pages refreshes. Current: **Build 1.2.3**.

It must match in four places, and the audit checks all four:

1. `js/app.js` — `const BUILD_NUMBER = "Build 1.2.3";`
2. the rendered badge — `Sentence Sense — Build 1.2.3`
3. the audit file name and heading
4. this handoff

---

## 3. FILE MAP

| File | Role | Lines |
|---|---|---|
| `index.html` | All screens: home, topics, lesson, mode placeholder, guide overlay | 233 |
| `css/styles.css` | Every style, numbered sections 1–11 | 908 |
| `js/app.js` | Shell only: screen switching, Home/Back/Escape, build badge | 158 |
| `js/learn.js` | Learn engine: topic screen, lesson runner, sentence component, Try It, Study Guide | 634 |
| `js/data/learn-content.js` | **All instructional content.** Byte-identical since Build 1.1.1 | 659 |
| `assets/images/` | `logo.png` 1024×768 · `logo-512.png` · `favicon.png` — unmodified since 1.1.1 | — |
| `AUDIT-REPORT-Build-1.2.3.md` | The current build audit — **the only one in the repo** | — |
| `SENTENCE-SENSE-HANDOFF.md` | This file, at the repo root | — |

`js/data/learn-content.js` checksum: `e6ec8d739fecf51df7f92ab8b6c62bca`

---

## 4. CSS SECTION MAP

| Section | Covers |
|---|---|
| 1 | Design tokens |
| 2 | Reset / base |
| 3 | Shared shell |
| 4 | Header / navigation |
| 5 | **Home portal** |
| 6 | Mode destination screen (the three placeholders) |
| 7 | **Build badge** |
| 8 | Responsive — home + shell |
| 9 | **Learn Mode** — 9a headers · 9b topic screen · 9c lesson layout · 9d sentence component · **9d-i plain/marked pair** · 9e Try It · 9f Study Guide |
| 10 | Learn Mode — responsive |
| 11 | Classroom projector / large display |

> **Warning.** `.card-grid`, `.pick-card`, `.pick-name` and `.pick-sub` are
> written by `js/learn.js` but styled in **Section 9b**. They were once shared
> with the old Home cards; a Home rewrite deleted them and the Learn topic screen
> silently collapsed to inline text. Do not move them into a Home section.

---

## 5. CURRENT STATE

### Home — COMPLETE. Do not redesign without a new brief.

- **Centred brand:** the graphical logo on the centre line, tagline
  *"See how sentences work."* directly beneath. Sized by width with
  `height:auto`, so the 4:3 proportion cannot distort.
- Hero: "Welcome!" / "What would you like to do today?" / "Choose a mode to get
  started."
- Four mode cards — Learn, Practice, Break It Down, Test — each
  **MODE → SHORT PURPOSE → ACTION**.
- **Only the four buttons navigate.** Cards are non-interactive containers: no
  click handler, no `cursor:pointer`, no `tabindex`, no `role="button"`. Exactly
  four tab stops.
- No login, profile, account, avatar, settings or gear icon anywhere.

### Learn — COMPLETE for six topics, one question each

- Six topics, fixed order: **verb → subject → complete-subject → predicate →
  noun → adjective**.
- Topic screen: **3 × 2 desktop (≥901px) · 2 columns 601–900px · 1 column
  ≤600px**. Each card is one button with three stacked levels: clue badge →
  topic name → short description. Strategy reference sits below, subordinate.
  Sub-line: *"Choose a topic to start learning."*
- **One design system, four steps, every topic:**
  DEFINITION *what is it?* → CLUE *how do I find it?* → EXAMPLE *show me* →
  TRY IT *can I find it?* The grammar changes; the rhythm does not.
- **Plain sentence first, marked sentence second.** See Section 6.
- Study Guide per topic: modal, focus-trapped **both** directions, Escape and
  backdrop close, focus returns to the `lesson-guide` button.
- Completion: confetti, "You learned X!", a named topic badge, one recap line,
  then the way on. **Not gamified** — no points, coins, streaks, sound or storage.

### Practice / Break It Down / Test — NOT BUILT

All three route from Home to the shared placeholder screen. No engine, no
content, no scoring exists for any of them.

---

## 6. THE PLAIN → MARKED TEACHING PATTERN

Wherever a sentence carries any annotation — marks, a split, or links — the same
sentence is shown twice:

```
READ IT              The excited player kicked the red ball.
─────────────────────────────────────────────────────────────
SEE HOW IT WORKS     The [ADJECTIVE: excited] [NOUN: player] kicked …
```

**How the exact-match rule is guaranteed.** Both passes render from the **same
`words` array** in `learn-content.js`. `renderSentence(host, spec, {plain:true})`
suppresses marks, split and links; it cannot add, remove, reorder or re-punctuate
a word, because it reads the same source. The marked pass only decorates.

**Never** introduce a separate plain-text string for a sentence. That is the one
change that would let the two versions drift apart.

A sentence with no annotation — the Try It question — is already plain and is
shown once, unlabelled.

---

## 7. SENTENCE DIFFICULTY STANDARD (for future content)

Not yet applied to existing sentences. Applies to the 20-question banks and any
new Learn sentence.

**Target:** readable by a typical 3rd grader, moderately challenging, rich enough
to require real grammar thinking.

- usually **7–12 words**; occasionally **13–15** for challenge
- not babyish, not middle-school complexity
- no obscure vocabulary — the exercise is grammar, not vocabulary

**Avoid:** *The dog ran. · The boy jumped. · The player kicked the ball.*
**Prefer:** *The playful dog jumped over the fallen log near the creek. · The
excited player kicked the baseball across the dusty field. · The tired students
carried their heavy backpacks into the quiet classroom.*

---

## 8. LEARN VS PRACTICE VS TEST — PRESERVE THE DIFFERENCE

| Mode | Promise |
|---|---|
| **LEARN** | Teach me and help me understand. |
| **PRACTICE** | Let me work with less help. |
| **TEST** | Let me show what I know without help. |

Learn gives **explanatory wrong-answer feedback** and must keep doing so:

> *"small tells what kind of dog it is. It describes the dog. Look again for the
> word that tells what happened."*

Never reduce Learn feedback to "Wrong. Try again." That belongs to Test, not Learn.

---

## 9. ENGAGEMENT STANDARD

Should feel: friendly, colourful, encouraging, alive, easy to continue through.
Should not feel: preschool-like, noisy, game-show-like, overly academic, or like
a digital worksheet.

Small motivational touches ("Nice thinking!", "You found it!") are welcome but
must not be overused. Instruction may stretch slightly above grade level when it
stays clearly explained — do not simplify the concepts unnecessarily.

---

## 10. COLOUR

One hue per topic, carried on the lesson header, the marks and the completion
badge. Colour is **never** the only signal — every marked word also has a written
label, a border and an underline.

**Changed in 1.2.3:** the Adjective lesson header moved from `#8F400A → #B4530F`
(dark, muted, brown) to **`#A84E06 → #BA5A0B`** (warmer burnt orange). White text
measures 5.59:1 and 4.61:1 — above AA. This is the top of the range: `#C25F0C`
measures 4.25 and every brighter option fails.

`--c-adjective` (`#B4530F`) for adjective **marks** was deliberately not
brightened — those sit on a light ground, where brighter means less contrast.

Do not add new colours for variety.

---

## 11. DEFECT LEDGER

### Open

| ID | Issue | Severity |
|---|---|---|
| D-22 | Adjective Clue and Example need ~36px more than a 1920×1080 viewport; the ≥1600px projector type scale wraps the marked sentence. Back and Next stay visible. | 4 |
| D-11 | Topic-screen density — much improved in 1.2/1.2.3; re-assess before closing | 4 |
| D-13 | Completion-screen Back behaviour | 4 |
| D-14 | Learn state reset between topics | 4 |
| D-20 | Abstract nouns in the noun topic (content, not layout) | 3 |

### Closed

K-01 Home badge overlap · **D-12 / K-02** Learn landscape badge overlap (was
carried as open when already fixed; now covered by the general in-flow rule) ·
**D-20b** topic screen rendering as inline strips · **D-21** badge covering Learn
content above 620px viewport height · Learn screens too tall with excessive
internal whitespace · markup shown before the plain sentence · Adjective identity
reading brown · empty completion screen.

### Standing limitations of every audit so far

- **L-01 — The real webfont has never been measured here.** The sandbox blocks
  the Google Fonts CDN. Build 1.2.3 was informed by live screenshots in Baloo 2,
  but post-fix measurements are fallback-face figures. **Confirm the 1366×768 fit
  on the live site.**
- **L-02 — All device testing is simulated.** No physical phone, tablet, laptop
  or projector has ever been used.
- **L-03 — No classroom projector verification.**
- **L-04 — No screen-reader testing.**
- **L-05 — No testing with a child.**
- **L-06 — Chromium only.** No Safari or Firefox; this matters most for iPad.

---

## 12. BUILD BADGE — HOW IT WORKS

> The badge is in **normal document flow, below all content, on every screen**.
> The single exception is Home at `min-width:1181px` **and** `min-height:621px`,
> where Home provably does not scroll and reserves a 48px lane.

A `position:fixed` badge is only safe on a screen that cannot scroll, and every
Learn screen can scroll. Do not add a new fixed rule without proving that screen
never scrolls at any viewport. New screens inherit the safe behaviour.

---

## 13. WORKING AGREEMENT

For every approved build:

1. Self-audit before delivery.
2. Provide the **complete** project ZIP and verify it by extracting to a clean
   directory and testing **the extracted copy**.
3. Provide the build audit `.md`, describing the shipped state consistently from
   beginning to end — never stale claims early with corrections appended.
4. Update this handoff. Current state only; no contradictory leftovers.
5. Provide the PowerShell Git commands in `GIT-COMMANDS.md`. **Never run Git.**
6. Increment the visible build number.

Startup for the next session: read the ZIP → read this handoff → read the latest
audit → reconcile all three → **code wins over stale documentation** → report any
new discrepancy **before** editing.

### Delivery format — exactly TWO ZIPs, never loose files

| Archive | Contents |
|---|---|
| `Sentence-Sense.zip` | The project repository only |
| `Sentence-Sense-Build-<n>-Deliverables.zip` | All review-only material |

**PROJECT ZIP — keep only:** `index.html` · `css/` · `js/` · `assets/images/` ·
`SENTENCE-SENSE-HANDOFF.md` · **the CURRENT audit only**.

**Never in the project ZIP:** historical audits · screenshots · `GIT-COMMANDS.md`
· startup verification reports · test harnesses · Playwright scripts · temporary
files · logs · extracted test copies · duplicate archives · archived assets ·
browser artifacts · `node_modules` · any review-only file.

**One audit in the repo, ever.** Each build **replaces** the previous audit —
`git rm` the old one in the same commit that adds the new one. Git history keeps
the rest.

Gate before zipping — the first must print nothing, the second must print `1`:

```
find . -type f | grep -vE '^\./(index\.html|css/styles\.css|js/(app|learn)\.js|js/data/learn-content\.js|assets/images/.*\.png|AUDIT-REPORT-Build-.*\.md|SENTENCE-SENSE-HANDOFF\.md)$'
ls AUDIT-REPORT-Build-*.md | wc -l
```

---

## 14. NEXT — NOT STARTED

- **20-question Learn banks.** Learn currently has **one** Try It question per
  topic. Question banks, randomization, scoring, mastery tracking and progress
  persistence are all out of scope until the Learn UX is approved.
- **Practice Mode** — not designed, not stubbed beyond the placeholder.
- **Break It Down Mode**, **Test Mode**.
- Build 1.3.

---

*End of handoff. Last updated 2026-09-07 for Build 1.2.3.*
