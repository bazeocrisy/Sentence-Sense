# FORENSIC AUDIT — VERB DYNAMIC TEST
## Sentence Sense — Build 1.4.0 · branch `claude/build-1.4`

---

## 1. EXECUTIVE SUMMARY

The Verb Test was reopened to replace a fixed 12-question set with a curated
48-question pool and a sampling engine. This audit independently inspects the
result: the bank, the sampler, the avoidance store, the scoring arithmetic, the
rendered results, the answer review, answer leakage, state, responsive layout,
accessibility, and regression in everything the change could have touched.

**Verdict: READY TO RE-LOCK.**

**One product defect was found, fixed and covered by a permanent regression
check.** It was found by a probe written specifically to test the invariant the
whole engine rests on — *no explanation exists before submission* — and not by
any pre-existing check.

Two further findings look like defects in the raw output and are not. Both are
measurement artifacts of my own probes, and both are recorded here in full
rather than quietly corrected, because a silently "fixed" false positive is
indistinguishable from a silently ignored real one.

**No content defect was found.** All 48 questions, their choices, answers, tags,
metadata and explanations are byte-identical to the approved source. Nothing in
the educational content was changed, reworded, reordered, or normalised.

| | |
|---|---|
| Harness | **304 checks, 304 passing** (was 267 at the v1 lock) |
| Independent audit probes | **96 checks** across audits B–K, all passing |
| Bank field comparisons | **480 of 480 exact** |
| Rendered results inspected | **15** — five tiers × three child-facing lengths |
| Review rows inspected | **60**, covering all **48/48** questions |
| Sampling draws | **12,000** (3,000 per length) |
| Retest simulations | **2,000** (500 per length) |
| Score pairs proved exhaustively | **780** |
| Screenshots | **48** captures, 4 widths × 12 states, 0 issues |

---

## 2. BASELINE

| | |
|---|---|
| Branch | `claude/build-1.4` |
| HEAD at audit start | `72e0313` — *Complete Verb Test and forensic audit* |
| `main` | `cc1f102924ad4bb74166b1ac056005c3854380e3` — **untouched** |
| Predecessor audit | `FORENSIC-AUDIT-VERB-TEST.md` — verdict READY TO LOCK, 267 checks |
| Deployment | none; no `gh-pages` or deploy branch exists |
| Commits made | none — the audit runs against the working tree |

The Verb Test v1 was locked with a fixed 12-question bank, a band-scoped
shuffle, fixed thresholds of 10/12 · 7/8 · 3/4, and mastery-gated celebration.
Everything in this audit is measured against that baseline.

---

## 3. EXACT TESTS PERFORMED

The audit does **not** re-run `verification/guard.js` and call that evidence.
Four independent programs were written for it, none of which import the harness:

| Program | Covers | Method |
|---|---|---|
| `audit-A-bank.js` | A | Loads the shipped `learn-content.js` in a Node VM and compares every field against the approved source; then applies linguistic checks |
| `audit-BCD.js` | B, C, D | Drives a real Chrome; 12,000 sampling draws, storage manipulation across tabs and reloads, exhaustive score-pair enumeration |
| `audit-EFGHJK.js` | E, F, G, H, J, K | Drives every result tier at every length, opens 60 review rows, probes 17 computed style properties per choice, walks state and navigation |
| `visual-qa.js` | I | Captures 48 screenshots at 4 widths and measures overflow, clipping and tap targets — then **the screenshots were opened and looked at** |

The harness was re-run afterwards as a regression gate, not as the audit.

---

## 4. PASS / FAIL BY AREA

| | Area | Result | Evidence |
|---|---|---|---|
| **A** | Question bank forensics | **PASS** | 480/480 fields exact; 0 defects across 48 questions |
| **B** | Sampling forensics | **PASS** | 12,000 draws; 0 duplicates, 0 cross-band, 0 balance drift |
| **C** | Recent-question avoidance | **PASS** | 9 storage scenarios; 2,000 retests; 0 unexplained reuse |
| **D** | Dynamic scoring | **PASS** | Integer rule exact for 244 counts; 780 score pairs proved |
| **E** | Results / CTA | **PASS** | 15 rendered results across 5 tiers × 3 lengths |
| **F** | Answer review | **PASS** after fix | 60 rows, 48/48 questions; **D-A1 found here** |
| **G** | Answer leakage | **PASS** | 17 style properties × 4 choices × 12 questions + keyboard |
| **H** | State / navigation | **PASS** after fix | 14 scenarios; **D-A1 caught independently here too** |
| **I** | Responsive | **PASS** | 48 captures at 4 widths, inspected by eye |
| **J** | Accessibility | **PASS** | aria-pressed, tab order, focus rings, reduced motion |
| **K** | Regression | **PASS** | Home, Skill, Learn, Practice, all four skills |
| **L** | Repository hygiene | **PASS** | No scratch, no debug, no junk, `main` untouched |

---

## 5. DEFECTS DISCOVERED

### D-A1 — the previous sitting's answer explanations stayed in the DOM

| | |
|---|---|
| **Severity** | **Medium** |
| **Area** | F (answer review) and H (state) — found independently by both |
| **Status** | Fixed, with a permanent regression check |

**What was wrong.** Opening "See my answers" and then starting another test left
the previous sitting's review — every row, every sentence, and every answer
explanation — in the document for the whole of the next test. At 30 questions
that is 30 stale explanations, and they overlap the questions the child is being
asked right then. The `#test-review` element also kept `hidden = false` and the
button kept the label *"Hide my answers"*.

**Reproduction.**

1. Open Verb → Test, choose 30, complete and submit.
2. Click **See my answers**.
3. Click **Practice verbs**, then return to Verb → Test.
4. Start the test. Inspect `#test-review` — 30 children, `hidden === false`.
5. Search `#screen-test` innerHTML for the current question's `why` string.

**Why it is Medium and not Critical.** `showPhase()` hides `#test-results`, which
is the ancestor of `#test-review`. A hidden subtree is not painted and is not
exposed to assistive technology, so no child could see or hear the stale
explanations. The defect is a broken invariant and a real state leak, not a
visible answer leak.

**Why it was still worth fixing.** This engine's first rule is *no hint, no clue,
no correctness signal before the child submits*. "It happens to be inside a
hidden div" is a containment argument, not a compliance one. One CSS change, one
`hidden` attribute lost to a future edit, or one assistive tool that walks the
full DOM turns a contained leak into a real one. A Test engine should not keep
one word of the answer in the page while the question is being asked.

**Root cause.** `renderResults()` built the review and `toggleReview()` opened
it, but `reset()` rebuilt the run state without touching the DOM the previous
run had produced. Teardown was simply missing — the review was the only piece of
rendered state with no corresponding clear.

**Affected file.** `js/test.js`

**Fix.** A `clearReview()` function, called from `reset()`, which empties the
review host, restores `hidden`, and resets the button label. Because `reset()`
runs on `start()` and on every retest, the review is now torn down on every path
into a test.

```js
/* showPhase() hides #test-results, so a stale review was never visible
   and never reachable by assistive tech -- but it left the previous
   sitting's ANSWER EXPLANATIONS sitting in the document for the whole
   of the next test, and at 30 questions those overlap the questions
   now being asked. A Test engine whose first rule is "no explanation
   before submission" should not keep one word of it in the page. */
function clearReview() {
  const rev = el("test-review");
  if (!rev) return;
  clear(rev);
  rev.hidden = true;
  const btn = el("test-review-btn");
  if (btn) btn.textContent = "See my answers";
}
```

**Regression tests added.** `verification/guard.js` checks **13.29** and
**13.30**:

- 13.29 — starting a new test tears down the previous review completely
  (`children === 0`, `hidden === true`, button label restored).
- 13.30 — **no answer explanation exists anywhere in the DOM during a test**,
  asserted by searching `#screen-test` innerHTML for all 48 `why` strings and
  requiring zero matches.

13.30 is the stronger of the two and is the check that should have existed from
the start. It now guards the invariant directly rather than guarding one of the
ways it can be broken.

---

### D-A2 — audit hook did not expose the sitting total *(engineering gap, not a product defect)*

| | |
|---|---|
| **Severity** | **Low** |
| **Status** | Fixed |

`SS_TEST.state().result` exposed `overall`, `action`, `being`, `actionTotal`,
`beingTotal`, `thresholds`, `mastered` and `tier`, but not `total`. The rendered
plaque was always correct; only the read-only audit hook was incomplete, which
made two audit assertions compare against `undefined`. `total` was added to the
exposed object. No user-facing behaviour changed.

---

## 5b. FINDINGS THAT LOOK LIKE DEFECTS AND ARE NOT

Both were produced by my own probes. Both are recorded because a false positive
that gets quietly deleted looks exactly like a real defect that gets quietly
ignored.

### F-1 — "1 question leaked" in the answer-leakage probe

The probe reported that one choice differed in `background-color` and
`border-color` from the other three, always on question 1.

**It was `:hover` on the parked mouse pointer.** The new size selector changed
the intro panel's height, so after clicking *Start the test* the pointer came to
rest over a choice button in the next screen's layout.

**The proof that it was not a leak is that it did not track the answer.** Across
five diagnostic runs the highlighted button was the **wrong** answer three
times. A correctness leak cannot be wrong 60% of the time; a positional artifact
can.

The first fix — parking the pointer and waiting 30ms — still failed, because
`.choice-btn` transitions background over 120ms and the probe was reading the
colour mid-fade. The settle was raised to 220ms. Both the artifact and the
reason are now recorded in a comment above the check in `guard.js`.

### F-2 — "picking the wrong answer looks different from picking the right one"

The same 120ms transition. The probe clicked the wrong choice and snapshotted
`getComputedStyle` synchronously, then clicked the right choice and snapshotted
again — reading two different points on the same fade curve.

Re-measured with each state clicked, **settled for 320ms**, and only then
measured across six properties (class, `aria-pressed`, background, border,
box-shadow, font-weight): **identical**. Picking a wrong answer is
indistinguishable from picking a right one.

### F-3 — five bank flags that were my linguistics, not the content

Audit A's first pass raised five flags. All five were wrong:

| Flagged | Verdict |
|---|---|
| V008 `morning`, V027 `spring` — "-ing distractor with no `suffix-ing-lure` tag" | **Content is right.** These are not participles; `morn` and `spr` are not verbs. Both are plain nouns ending a phrase after the determiner *each*. Tagging them as -ing lures would tell the sampler these questions exercise a concept they do not, which would hollow out the coverage guarantee. The check was testing spelling, not morphology. |
| V011, V021, V037 `practice` — "possible second finite verb" | **Content is right.** In all three, `practice` is the object of a preposition (*during practice*, *before soccer practice*) and cannot be finite. All three already carry `noun-verb-double-duty-lure`, and each `why` says so explicitly: *"practice is a thing in this sentence, not the action."* |

Both checks were rewritten to be syntactically correct — a participle must
modify a following noun, and a word governed by a preposition is nominal — and
the bank then passed with zero defects. **No content was changed.**

---

## 6. SEVERITY SUMMARY

| Severity | Count | Items |
|---|---|---|
| **Critical** | 0 | — |
| **High** | 0 | — |
| **Medium** | 1 | D-A1 stale review DOM — fixed |
| **Low** | 1 | D-A2 audit hook missing `total` — fixed |
| False positives investigated and documented | 3 | F-1, F-2, F-3 |
| **Content defects** | **0** | — |

---

## 7. AREA FINDINGS IN DETAIL

### A — QUESTION BANK (48 questions)

The shipped `js/data/learn-content.js` was loaded in a VM and compared to the
approved source field by field.

```
exact-match fields verified : 480 / 480
Critical 0   High 0   Medium 0   Low 0
```

Ten fields per question: `id`, `band`, `type`, `beingForm`, `tags`, sentence,
prompt, all four choices, correct answer, `why`. **Every one identical.**

Structural: 48 unique ids, 48 unique sentences, exactly 4 choices each, exactly
1 correct answer each, no duplicate choice, every choice present in its own
sentence, 32 action / 16 being, all five being forms (`am` 2, `is` 4, `are` 4,
`was` 4, `were` 2), band totals 16/16/16 (11A/5B · 11A/5B · 10A/6B).

Linguistic:

- **No second finite verb.** Every word that is a verb elsewhere in the pool was
  checked in its own sentence and found nominal — governed by a preposition,
  following a determiner, or participial.
- **No participial ambiguity.** Every `-ed` and `-ing` distractor that modifies
  a following noun carries its lure tag: `cheering`, `winning`, `striped`,
  `flowering`, `growing`, `spelling` ×2, `passing`, `bouncing`, `sleeping`,
  `painted`, `running`, `marching`, `crowded`.
- **No being-verb safety violation.** No `-ed`/`-en` word follows any being verb
  anywhere in the pool, including inside action sentences. Adjectives used:
  *funny, ready, empty, quiet, proud, full, clean* — all plain.
- **No stale distractor.** Every distractor appears in its own sentence.
- **No explanation mis-attachment.** Every `why` uses only words from its own
  sentence, opens with its own answer, and never calls a distractor the verb.
  V018's *"rains names something and is **not** the verb in this sentence"* is
  correct teaching, and the check is negation-aware so as not to misread it.
- **No false rule taught.** No explanation makes an absolute claim about a
  suffix or a position.

Two `why` texts are identical — V008/V024 and V010/V047 — which are exactly the
known near-duplicate sentence pairs. Expected, not a defect.

### B — SAMPLING (12,000 draws)

| Length | Blueprint | Action | Being | Duplicates | Cross-band | Balance drift | Unreachable |
|---|---|---|---|---|---|---|---|
| 12 | 4(2A/2B) · 4(3A/1B) · 4(3A/1B) | 8 | 4 | 0 | 0 | 0 | 0 |
| 20 | 7(4A/3B) · 7(5A/2B) · 6(4A/2B) | 13 | 7 | 0 | 0 | 0 | 0 |
| 30 | 10(6A/4B) · 10(7A/3B) · 10(7A/3B) | 20 | 10 | 0 | 0 | 0 | 0 |
| 40 | 14(9A/5B) · 13(9A/4B) · 13(9A/4B) | 27 | 13 | 0 | 0 | 0 | 0 |

Band 1 precedes band 2 precedes band 3 in **all 12,000 draws**. Every one of the
48 questions was reached at every length, and **all 48 were observed at more
than one position**, proving the within-band shuffle is live and not a fixed
order. Per-band cell counts were exact in every single draw — not on average.

**N=12 reproduces the locked v1 blueprint exactly** (2A/2B · 3A/1B · 3A/1B), so
the fixed test the owner approved is still obtainable from the dynamic engine.

**The gating decision is confirmed empirically.** At 12, 20 and 30 no question is
forced. At 40, five questions — V002, V004, V007, V010, V013, every band-1 being
question — appeared in **all 3,000 draws**. A 40-question sitting is therefore
partly deterministic, which is exactly the failure this work exists to remove.
40 stays built, harnessed and audited, and stays out of `sizes`.

### C — RECENT-QUESTION AVOIDANCE

| Scenario | Result |
|---|---|
| First sitting | No stored key, no remembered questions |
| Opening and starting a test | Writes nothing |
| Abandoning mid-test | Writes nothing — freshness is not burned by walking away |
| Submitting | Writes exactly the sitting's IDs |
| Navigate away → Learn → back | List survives and is used (0 of 12 repeated) |
| Refresh | List survives (12 ids) |
| **New tab** | **Clean slate — one child's test never follows another** |
| Storage that throws | Degrades to no avoidance; test completes; 0 page errors; in-memory fallback works |

Stored value, verified by regex against the raw string:

```
ss.test.recent.verb  =  {"v":1,"ids":["V004","V016","V002", ...]}
```

Only IDs. No score, no name, no timing, no personal data. The new-tab result is
the one that matters most in the target setting: a shared classroom machine,
where `localStorage` would have carried one child's list into the next child's
test.

**Measured reuse over 2,000 retests:**

| Length | min / avg / max repeat | Structural floor | Fresh | Balance breaks | Unexplained reuse |
|---|---|---|---|---|---|
| 12 | 0 / 0.00 / 0 | 0 | 100% | 0 | 0 |
| 20 | 1 / 1.04 / 3 | 1 | 95% | 0 | 0 |
| 30 | 12 / 12.07 / 14 | 12 | 60% | 0 | 0 |
| 40 | 32 / 32.0 / 32 | 32 | 20% | 0 | 0 |

The invariant is stated exactly, not loosely: **every repeated question is either
forced by the pool or paid for by a named coverage repair — never accidental.**
`SS_TEST.sampleDetail()` reports the repair count, and the check asserts
`repeats ≤ floor + swaps` on every individual draw. Zero violations in 2,000.
Balance was never broken and no sitting ever contained a duplicate.

### D — DYNAMIC SCORING

The engine's integer rule was compared against an independent round-half-up
reference for **every count from 0 to 60 across all four ratios** — 244
comparisons, all exact.

| Length | Overall | Action | Being | "Almost" tier |
|---|---|---|---|---|
| 12 | **10 / 12** (83.3%) | **7 / 8** (87.5%) | **3 / 4** (75%) | 8 / 12 |
| 20 | **17 / 20** (85%) | **11 / 13** (84.6%) | **5 / 7** (71.4%) | 13 / 20 |
| 30 | **25 / 30** (83.3%) | **18 / 20** (90%) | **8 / 10** (80%) | 20 / 30 |
| 40 | **33 / 40** (82.5%) | **24 / 27** (88.9%) | **10 / 13** (76.9%) | 27 / 40 |

At 12 the ratios resolve to exactly the Build 1.4.0 numbers. Nothing drifted when
the fixed test became a dynamic one.

**Exhaustive conjunction proof — every reachable score pair at every length:**

| Length | Pairs | Reach mastery | Pass on overall alone (denied) | Mastery with weak being | Mastery with weak action |
|---|---|---|---|---|---|
| 12 | 45 | 4 | 2 | **0** | **0** |
| 20 | 112 | 8 | 2 | **0** | **0** |
| 30 | 231 | 9 | 12 | **0** | **0** |
| 40 | 392 | 16 | 20 | **0** | **0** |
| **Total** | **780** | 37 | **36** | **0** | **0** |

The middle column is the point. Across the four lengths there are **36 score
pairs where the overall score alone looks masterful while a subscale is weak**.
Every one is denied. The conjunction is doing real work, not decoration.

Worst-case attempts at hiding a weak subscale, all denied:

```
N=12  perfect action  8/8  + being 2/4  = 10/12  overall PASSES -> DENIED on being
N=20  perfect action 13/13 + being 4/7  = 17/20  overall PASSES -> DENIED on being
N=30  perfect action 20/20 + being 7/10 = 27/30  overall PASSES -> DENIED on being
N=40  perfect action 27/27 + being 9/13 = 36/40  overall PASSES -> DENIED on being
```

and symmetrically for a perfect being score hiding weak action verbs.

Boundary cases verified: exact threshold, one below overall, one below action,
one below being, perfect action + weak being, perfect being + weak action,
perfect, and zero. An unanswered test at every length scores 0, never masters,
lands in `keepGoing`, and counts `actionTotal + beingTotal === total`.

### E — RESULTS AND CTA (15 rendered results)

Five tiers × three child-facing lengths, each played through the real UI and
read off the rendered DOM.

| Tier | Celebration | Primary | Secondary | Tertiary |
|---|---|---|---|---|
| MASTERED | **shown** | Back to Verb | See my answers | Try again |
| BEING WEAK | hidden | Practice verbs | See my answers | Back to Verb |
| ACTION WEAK | hidden | Practice verbs | See my answers | Back to Verb |
| ALMOST | hidden | Practice verbs | See my answers | Back to Verb |
| LOW OVERALL | hidden | Learn verbs | See my answers | Back to Verb |

Correct in all 15. Also verified:

- **Celebration gating never regressed.** Shown in 3 of 15 results — exactly the
  three mastered ones — and hidden in the other 12.
- **`Try again` exists only in the mastered flow**, counted by scanning every
  button in `#test-results`: `mastered=1 beingWeak=0 actionWeak=0 almost=0
  keepGoing=0`.
- **No dot rendering remains** at any size; `.score-dot` count is 0 everywhere.
- **The text score is always present** — `"13 of 13"`, `"7 of 7"` — and the
  plaque carries `aria-label="You scored 20 out of 20."`.
- **Both bars are the same colour** and their tracks are `aria-hidden="true"`,
  so no meaning rests on colour or width.
- **No percentage appears** anywhere in the results panel.
- `See my answers` is 174×51 and reachable after a low result;
  `Back to Verb` returns to the skill screen; both Practice and Learn CTAs
  route correctly.

### F — ANSWER REVIEW (60 rows, 48/48 questions)

Two 30-question sittings with avoidance active cover the entire pool. For every
row the audit compared the rendered sentence, prompt, the child's answer, the
correct answer and the explanation against the source question.

- Sentence rendered exactly, prompt correct, explanation correct and matched to
  its own question in all 60 rows.
- A correct answer shows **only** the child's choice; a wrong answer also shows
  *The verb is …*. No row showed a correction on a right answer.
- No explanation was clipped at any width.
- **All 48 sentences render with punctuation intact**, including V046's
  possessive: `The running water filled the campers' bottles quickly.` — the
  apostrophe rides with its word and strands nothing, verified at 375px where
  the sentence wraps mid-phrase. Every comma stays attached to its word.
- **After the fix, no explanation exists anywhere in the DOM during a test.**

### G — ANSWER LEAKAGE

For each of 12 questions, all four choices were compared on **17 computed style
properties** — background, colour, border colour and width, font weight and
style, text decoration, opacity, box-shadow, outline style, transform, animation
name, transition property, order, visibility, width, height — plus the full
attribute list, the `dataset` key set, `innerHTML`, `aria-label`, `title` and
`tabIndex`.

```
identical on every property, every question, every choice
```

Also verified:

- No choice carries `aria-label` or `title`.
- The word "correct" appears nowhere in the question DOM.
- **Keyboard focus measured through real `Tab` presses**, never programmatic
  `.focus()` — the v1 audit proved programmatic focus does not reliably trigger
  `:focus-visible`. The focus ring is visible and **identical** on all four
  choices, the answer included.
- The correct answer appeared at all four positions across 12 questions —
  `{0:3, 1:1, 2:5, 3:3}` — so it is not anchored.
- **Picking the wrong answer is byte-for-byte identical to picking the right
  one** across class, `aria-pressed`, background, border, box-shadow and font
  weight, measured after a 320ms settle.
- Selecting a choice deselects the other and announces only `aria-pressed`.

### H — STATE AND NAVIGATION (14 scenarios)

| Scenario | Result |
|---|---|
| Change size before Start | Rebuilds the sitting **and** both copy lines (12 → 30) |
| Question 2 opens unanswered | Next disabled, Back enabled |
| Back to question 1 | Same answer still selected **after the choices reshuffle** |
| Change an earlier answer | Change recorded (`ci 3 → 2`) |
| Finish on the last question | Reaches the confirmation, not the results |
| Back from the confirmation | Returns to question 12 with all 12 answers intact |
| Submit from the re-entered confirmation | Scores all 12 |
| Try again after mastery | Keeps the length, clears answers, result **and review** |
| Practice CTA | Routes into Practice |
| Learn CTA | Routes into Learn |
| Re-enter the Test ten times | One Next click advances exactly one question — no duplicated listeners |
| Refresh mid-test | Returns Home with no stale result and no stale answers |

No stale answers, no stale results, no off-by-one in the progress counter, no
mixed test sizes, no prior-result contamination.

### I — RESPONSIVE (48 captures, 4 widths, inspected by eye)

Automated geometry across all 48: **0 horizontal overflow, 0 clipping, 0 tap
target below 44px, 0 page errors.** Geometry alone was not treated as proof —
every state was opened and looked at, which is how the one layout defect in this
work was found during Gate 2 and how two of the four v1 defects were found.

| Width | Result |
|---|---|
| 1440×900 | Selector, question, results, review all correct |
| 834×1112 | Review renders cleanly; plaque and bars scale |
| 390×844 | Buttons stack; helper text aligns with the panel |
| 375×667 | V046 wraps mid-phrase with the possessive intact; `Question 20 of 20` and `Finish` correct; three CTAs stack full-width |

The score plaque scales from 3.4rem to 3rem below 460px. The bars remain full
width and readable at every size, because they are ratio bars and not
per-question dots — at 40 questions a dot row would have been unreadable.

### J — ACCESSIBILITY

- Size selector: `role="group"`, `aria-labelledby` resolving to a real heading,
  and `aria-pressed` on each button — `["true","false","false"]`.
- **No duplicate element ids** anywhere in the document.
- Tab order through the intro reaches all 3 size buttons then *Start the test*,
  in that order, **with a visible focus ring on every stop**.
- Disabled controls use the real `disabled` property, are not focusable, and are
  not a look-alike style.
- Under `prefers-reduced-motion: reduce` the results still render, the
  celebration still gates, and the bars still take their width.
- No `aria-label` on the Test screen leaks correctness.
- The text score is always available, so the bars are pure reinforcement.

### K — REGRESSION

| | |
|---|---|
| `js/learn.js` | **no changes** (`git diff` empty) |
| `js/practice.js` | **no changes** |
| `js/sentence.js` | **no changes** |
| `verb.blocks` (Learn content) | **no changes** |
| `verb.tryItBank` (Practice content) | **no changes** |

`js/data/learn-content.js` changed in exactly two places: the `test: "bank"` →
`"pool"` flag at line 122, and the test block. No hunk touches Learn or Practice
content.

Behavioural regression: Home renders four skill cards with none of the banned
furniture; Verb offers three live activities while Subject, Noun and Adjective
each show one live and two *coming next*; Verb Learn opens and renders; Verb
Practice opens with its 20-question bank and 4 choices, its escalating coaching,
its clue button and its struck-through wrong answer all intact. No page errors
were raised anywhere across the entire audit.

### L — REPOSITORY HYGIENE

- No scratch files, temp files, backups, `.orig`, `.log` or debug files.
- No `console.log`, `debugger`, `TODO`, `FIXME` or `XXX` in shipped source.
- No `node_modules` in the repository — harness dependencies live in the
  scratchpad and are not committed.
- `main` local and remote both at `cc1f102924ad4bb74166b1ac056005c3854380e3`.
- No `gh-pages` or deploy branch exists.
- Nothing committed, nothing pushed, nothing deployed.

**One hygiene item that needs explaining rather than dismissing.** Nine
*non-Test* screenshots show as modified: `desktop-02-skill-verb`,
`desktop-05-practice-verb`, `desktop-06-practice-wrong`,
`desktop-06b-practice-reveal`, `desktop-08-reduced-motion`,
`phone-02-skill-verb`, `phone-03-practice`, `phone-04-practice-wrong`,
`tablet-02-practice`. These are regenerated by the harness on every run.

They were opened and inspected. The content is unchanged and correct — the Verb
skill screen still shows three live activities, and Practice still shows its
coaching, clue button and struck-through wrong answer. The bytes differ because
**Practice shuffles its choices at render time (D-29)**, so each run captures a
different arrangement, and because pointer position varies between runs. This is
expected churn in regenerated evidence, not a regression.

---

## 8. CONTENT IMPACT

**None.** No sentence, prompt, choice, answer, tag, band, type, `beingForm` or
explanation was changed. 480 of 480 field comparisons are exact against the
approved source. The Phase-1 bank remains the educational source of truth,
byte-for-byte.

---

## 9. FUNCTIONAL IMPACT

One behaviour changed as a result of this audit: starting a test now tears down
the previous sitting's review. Nothing a child can see changes — the review was
already hidden — but the DOM no longer carries answer explanations into a test.

---

## 10. UI IMPACT

None from the audit. The one UI change in this work was made during Gate 2: the
selector helper line was auto-centring at desktop width and is now left-aligned
with the rest of the intro panel.

---

## 11. REMAINING LIMITATIONS

These are known, accepted, and recorded so they are not rediscovered as defects.

1. **48 questions is a Phase-1 pool, not long-term variety.** At 30 questions a
   retest repeats 12 by structural necessity and returns 60% fresh. Only the
   12 and 20 lengths return ≥95% fresh.

2. **40 is gated and must stay gated.** Every 40-question sitting contains all
   five band-1 being questions, measured over 3,000 draws, and returns only 20%
   fresh on retest. Unlocking it is a one-line edit to `sizes` once the bank
   reaches roughly 80 audited questions — and should not happen before then.

3. **Five near-duplicate sentence pairs** can both appear in one 30-question
   sitting: V007/V018, V008/V024, V010/V047, V014/V045, V025/V042. V010 and V047
   share three of four choices (*I, am, ready*). Cosmetic, not a measurement
   error. Accepted as a Phase-1 limitation by owner decision; recorded as a
   Phase-2 content note. No exclusion solver was built, deliberately.

4. **At N=20 the overall bar also binds.** `action_thr 11 + being_thr 5 = 16 <
   overall_thr 17`, so a child can clear both subscales and still miss mastery
   by one on overall. There is exactly one such score pair. At 12, 30 and 40 the
   subscales bind and overall is implied. This is consistent with "all three
   must be met" and is a property of integer rounding on small counts, not a
   defect — but it is worth knowing before it appears in a screenshot.

5. **A weak result offers no direct "Try again."** By approved design. A child
   who wants to retake immediately goes Back to Verb and re-enters Test — two
   taps. Confirmed intentional by the owner at Gate 3.

6. **`suffix-s-lure` has zero Phase-1 members.** The tag is retained and valid
   for the Phase-2 expansion. No artificial coverage was manufactured for it.

---

## 12. SCREENSHOT CURATION RECOMMENDATION

The full 4 × 12 matrix — 48 captures, 2.0 MB — was used for the audit and is the
right tool for auditing. It is the wrong thing to keep as permanent evidence:
several captures differ from a neighbour only by a counter digit.

**Recommended permanent set: 20 captures, 872 KB.** Each earns its place by
proving something no other capture proves.

**Desktop 1440×900 — the reference width, full state coverage (9)**

```
desktop-test-01-start              selector, preselection, helper line
desktop-test-04-selected           selection is neutral, never a verdict
desktop-test-06-question-final     Finish label and the full progress bar
desktop-test-07-confirm            the deliberate submit step
desktop-test-08-result-mastered    celebration SHOWN, Back to Verb primary
desktop-test-10-result-being-weak  celebration HIDDEN, Practice primary, uneven bars
desktop-test-11-result-low         celebration HIDDEN, Learn primary
desktop-test-09-review             explanations, correctness, only after submit
desktop-test-12-retest             a clean slate after Try again
```

**375×667 — the binding responsive constraint (6)**

```
small-test-01-start                selector wraps, helper text aligns
small-test-03-question-early       question layout at the narrowest width
small-test-06-question-final       V046's possessive wrapping mid-phrase
small-test-08-result-mastered      plaque and bars at 375
small-test-10-result-being-weak    stacked CTAs, uneven bars
small-test-09-review               review legibility at 375
```

**390×844 and 834×1112 — interpolation proof (5)**

```
phone-test-01-start     phone-test-08-result-mastered    phone-test-09-review
tablet-test-01-start    tablet-test-08-result-mastered
```

**Recommended for deletion — 28 captures, ~1.1 MB.** `02-selector` at all four
widths (differs from `01-start` only by which number is highlighted);
`05-question-middle` at all four (identical to `03-question-early` but for the
counter); `12-retest` at three widths (identical to `01-start`); and the
remaining tablet/phone duplicates of states already proved at desktop and 375.

**Nothing has been deleted.** Per the Gate 3 instruction, all 48 remain in place
pending approval of this recommendation.

---

## 13. FINAL VERDICT

### READY TO RE-LOCK

The dynamic Verb Test is correct, measured, and honest about what it does not
yet do.

- **0 content defects.** The approved bank is intact to the byte.
- **1 product defect** found, fixed, and permanently guarded by a check that
  asserts the invariant directly rather than one symptom of it.
- **1 low-severity engineering gap** in an audit hook, fixed.
- **3 false positives** investigated to root cause and documented rather than
  deleted.
- **304 harness checks passing**, plus 96 independent audit checks.
- **Mastery cannot be faked.** 780 score pairs enumerated; 36 would have passed
  on overall alone; all 36 denied; 0 granted with a weak subscale.
- **Nothing leaks.** 17 style properties, every attribute, every aria hook, real
  keyboard focus, and — after the fix — not one explanation string in the DOM
  while a question is on screen.
- **Learn and Practice are untouched**, verified by empty diffs and by driving
  both.

The one thing this audit cannot certify is variety at length. 48 questions is a
Phase-1 pool. 12 and 20 are genuinely fresh on retest; 30 is acceptable; 40 is
correctly withheld. That is a content limitation with a known remedy, not a
defect in the engine, and the engine is already built to absorb the remedy as a
content change.

---

*Audit performed against the working tree at branch `claude/build-1.4`,
HEAD `72e0313`. Nothing committed, nothing pushed, nothing deployed.
`main` untouched at `cc1f102924ad4bb74166b1ac056005c3854380e3`.*
