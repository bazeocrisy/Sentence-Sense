# SENTENCE SENSE — PROJECT HANDOFF

**Current build: Sentence Sense — Build 1.2.6**
**Last pass:** Verb Q20 wording correction (micro pass) — 2026-09-08
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
site can be verified after GitHub Pages refreshes. Current: **Build 1.2.6**.

It must match in four places, and the audit checks all four:

1. `js/app.js` — `const BUILD_NUMBER = "Build 1.2.6";`
2. the rendered badge — `Sentence Sense — Build 1.2.6`
3. the audit file name and heading
4. this handoff

---

## 3. FILE MAP

| File | Role | Lines |
|---|---|---|
| `index.html` | All screens: home, topics, lesson, mode placeholder, guide overlay | 254 |
| `css/styles.css` | Every style, numbered sections 1–11 | 973 |
| `js/app.js` | Shell only: screen switching, Home/Back/Escape, build badge | 158 |
| `js/learn.js` | Learn engine: topic screen, lesson runner, sentence component, Try It, **guided question bank**, Study Guide | 899 |
| `js/data/learn-content.js` | **All instructional content**, including the Verb 20-question bank | 932 |
| `assets/images/` | `logo.png` 1024×768 · `logo-512.png` · `favicon.png` — unmodified since 1.1.1 | — |
| `AUDIT-REPORT-Build-1.2.6.md` | The current build audit — **the only one in the repo** | — |
| `SENTENCE-SENSE-HANDOFF.md` | This file, at the repo root | — |

`js/data/learn-content.js` is no longer byte-identical to 1.1.1: Build 1.2.5 added
`verb.tryItBank`, and Build 1.2.6 changed one word inside its Q20 sentence.
Nothing that existed before the bank was altered.

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
- **Verb Try It runs a 20-question guided cycle.** See Section 5b. The other
  five topics still have ONE Try It question each.
- Study Guide per topic: modal, focus-trapped **both** directions, Escape and
  backdrop close, focus returns to the `lesson-guide` button.
- Completion: confetti, "You learned X!", a named topic badge, one recap line,
  then the way on. **Not gamified** — no points, coins, streaks, sound or storage.

### Practice / Break It Down / Test — NOT BUILT

All three route from Home to the shared placeholder screen. No engine, no
content, no scoring exists for any of them.

---

## 5b. THE VERB GUIDED BANK (Build 1.2.5, Q20 reworded 1.2.6) — VERB ONLY

Verb's Try It step runs a 20-question cycle. **No other topic has one yet.** A
topic gets the cycle purely by having a `tryItBank` in `learn-content.js`; a
topic without one keeps the single-question behaviour with no code change.

| Stage | Qs | Name | Focus |
|---|---|---|---|
| 1 | 1–5 | Get Started | clear action verbs |
| 2 | 6–10 | Look Closer | richer sentences, stronger distractors |
| 3 | 11–15 | Think It Through | longer sentences, varied openings |
| 4 | 16–20 | Challenge Yourself | action verbs mixed with `is / are / was / were` |

**Shuffle is scoped to a stage.** The five inside a stage are shuffled; the
stages never move. Never shuffle all 20 together — the difficulty banding is the
teaching.

**Wrong answers escalate, they do not punish:**

| Attempt | Child gets | Answer shown? |
|---|---|---|
| 1st | what that word does in THIS sentence, then a redirect | no |
| 2nd | the central Verb clue again | no |
| 3rd | guided reveal, answer marked, choices lock, Next enabled | yes |

**Milestones** after Q5 / Q10 / Q15, completion after Q20. **No score anywhere** —
no `n/20`, no percentage, no points, no streak, no timer. Progress is stated only
as "Question X of 20".

**Back:** from Try It, Back returns to Example; returning to Try It restarts the
cycle at Question 1 with a fresh shuffle. Partial progress is deliberately not
kept, matching the rest of Learn.

**Nothing is persisted.** Leaving via Home or All Topics and reopening Verb
starts fresh at Definition. `localStorage` and `sessionStorage` stay empty.

**The engine is reusable but deliberately unpopulated.** To give another topic a
cycle, add its own `tryItBank` — do not generalise further until that content is
approved.

**Being-verb sentences must not read as passive (Build 1.2.6).** In Stage 4 the
being verb is the answer, so the word right after `is / are / was / were`
decides whether the question has one reading or two. A word ending in `-ed` or
`-en` after a being verb can be read as a past participle, which turns
`was <word>` into a single passive verb phrase and leaves the correct answer
ambiguous between the being verb and the phrase. Q20 originally read
`was crowded` and was corrected to `was busy` for exactly this reason.

> **Rule:** after a being verb, use a plain adjective that has no participle
> form — `busy`, `quiet`, `happy`, `ready`, `full`, `empty`, `loud`. Never
> `crowded`, `excited`, `broken`, `finished`, `tired`, `frozen`.

**Harness note.** Any test that selects a Try It answer must be bank-aware:
Verb's choices come from `tryItBank.questions[order[pos]]`, not `tryIt`, and the
completion screen is twenty answers away, not one. `window.SS_LEARN.bankState()`
exposes `{pos, order, attempts, milestone, total}` read-only for this purpose.

**Screenshot note.** `.lesson-done` has a 0.25s `rise` entry animation. A
capture taken immediately after the final Next catches the completion panel
mid-fade and looks washed out — that is a capture artifact, not a defect. Settle
~450ms before screenshotting completion.

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

**Projector type scale — gated on width AND height.** The `@media (min-width:1800px)`
block that raises the sentence to 2.6rem is now `(min-width:1800px) and
(min-height:1100px)`. Gated on width alone it treated an ordinary 1920×1080
desktop as a classroom projector, which wrapped the adjective sentence to three
rows and forced 100px of scroll. A real large display is large in both
dimensions. Do not remove the height condition.

---

## 11. DEFECT LEDGER

### Open

| ID | Issue | Severity |
|---|---|---|
| **D-27** | At 390×844 in the wrong-answer state the Next button sits just below the fold. All four choices and the feedback stay visible, and Next is disabled in that state. | 4 |
| **D-26** | At 1366×768 the two densest Clue screens push the build badge below the fold. Lesson and controls fully visible. | 4 |
| D-11 | Topic-screen density — much improved; re-assess before closing | 4 |
| D-13 | Completion-screen Back behaviour | 4 |
| D-20 | Abstract nouns in the noun topic (content, not layout) | 3 |

### Content observations — resolved

**Verb Q20 — RESOLVED in Build 1.2.6.** The 1.2.5 wording,
"Our new library was crowded during family reading night," allowed a strict
parse of `was crowded` as passive rather than *was* + predicate adjective.
The owner elected to remove the ambiguity rather than carry it. The sentence
now reads **"Our new library was busy during family reading night."** `busy`
has no participle form, so only the linking-verb reading survives. Choices,
correct answer, feedback, clue, and reveal were all unchanged. See the
being-verb rule in §5b.

### Closed as design behaviour

**D-14 — CLOSED / DESIGN BEHAVIOR.** Learn does not persist lesson progress
between visits. Entering or re-entering a topic begins at Definition. This is
current design behavior, not a user-visible stale-state defect. Do not change
application logic for this.

### Closed

**D-23** lesson stack positioned too low · **D-24** Try It scroll · **D-25**
Definition and footer below the fold · **D-22** adjective sentence wrapping ·
K-01 · D-12 / K-02 · D-20b · D-21 · Learn screens too tall · markup before the
plain sentence · Adjective identity reading brown · empty completion screen.

### Standing limitations of every audit so far

- **L-01 — The real webfont has never been measured here.** The sandbox blocks
  the Google Fonts CDN. Verify on the live site.
- **L-02 — All device testing is simulated.**
- **L-03 — No classroom projector verification.**
- **L-04 — No screen-reader testing.**
- **L-05 — No testing with a child.** Whether a third grader stays engaged for
  20 questions is not something this audit can answer.
- **L-06 — Chromium only.**

## 12. BUILD BADGE — HOW IT WORKS

> The badge is in **normal document flow, below all content, on every screen**.
> The single exception is Home at `min-width:1181px` **and** `min-height:621px`,
> where Home provably does not scroll and reserves a 48px lane.

A `position:fixed` badge is only safe on a screen that cannot scroll, and every
Learn screen can scroll. Do not add a new fixed rule without proving that screen
never scrolls at any viewport. New screens inherit the safe behaviour.

---

## 12b. LESSON VERTICAL PLACEMENT — A PERMANENT RULE

> **Never vertically centre `.lesson-body`.** Build 1.2.3 added
> `justify-content:center` there to tidy the dead strip below a short step. On a
> tall desktop it centred the whole lesson column, so the shorter the step the
> further down the page its rail and panel were pushed — the header→rail gap
> measured 33px at 1366 Definition but 226px at 1920 Completion and 406px at
> 2560. The lesson column is top-aligned with one controlled gap, and that gap
> must stay a **constant** (currently 14px), never a function of spare height.

If a short step ever looks bottom-heavy again, adjust the footer — not the
position of the lesson.

**The audit harness enforces this.** `place.js` measures header bottom, rail top
and bottom, panel top and bottom, control-row top, footer bottom, badge bottom,
and the gaps between them. Acceptance:

| Rule | Threshold | Scope |
|---|---|---|
| Panel top | ≤ 40% of viewport | desktop only |
| **Header→rail gap** | **≤ 60px and constant** | all viewports |
| Horizontal overflow | 0 | all viewports |
| Controls in view | required | desktop only (§4 accepts phone scrolling) |

The panel-top percentage **alone is not sufficient** — the 1.2.3 regression
measured 38.9% and would have passed a 40% threshold. The header→rail gap is the
metric that catches it. Keep both.

**One harness caveat worth remembering:** `.ss-words` is `align-items:flex-end`,
so a marked chip and a plain word have different `top` values on the same visual
line. Count row wraps by **bottoms**, never tops.

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

### The Git block — required in every delivery, verbatim

Christopher wants this exact five-line block at the end of **every** build, in
the chat reply as well as in `GIT-COMMANDS.md`. Do not omit it, do not replace it
with prose, and do not make him ask for it. Only the build number in the commit
message changes:

```powershell
cd C:\Sentence-Sense
git status
git add -A
git commit -m "Sentence Sense Build <N> - <short description of the build>"
git push origin main
```

If the build also deletes files, put the `Remove-Item` lines **above** this block
rather than altering it — unzipping copies over the repo and never deletes, so
`git add -A` cannot record a removal on its own. The five lines above stay intact
underneath.

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

- **Subject, Complete Subject, Predicate, Noun and Adjective question banks.**
  Only Verb has one. Each still has a single Try It question.
- **Practice Mode** — not designed, not stubbed beyond the placeholder.
- **Break It Down Mode**, **Test Mode**.
- Scoring, timers, streaks, accounts, persistent progress, APIs, databases —
  none of these exist and none are planned for Learn.
- Build 1.3.

---

*End of handoff. Last updated 2026-09-08 for Build 1.2.6.*
