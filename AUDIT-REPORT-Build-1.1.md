# Sentence Sense Audit Report

## Build

**Build 1.1**

## Phase

**Complete Learn Mode.** All six approved topics built as one coherent instructional system: Verb, Subject, Complete Subject, Predicate, Noun, Adjective — each with Definition → Clue → Example → Try It, a contextual Study Guide, and one shared sentence-display component.

## Scope Requested

Authorized for Build 1.1:

- Complete Learn Mode as one coherent system
- Six topics: Verb, Subject, Complete Subject, Predicate, Noun, Adjective
- One reusable lesson pattern: Definition → Clue → Example → Try It
- A simple Learn topic screen containing only the six approved topics
- The Sentence Sense strategy, presented as helpful rather than absolute
- Contextual Study Guides inside Learn (never a home-screen mode)
- Short guided Try It activities with explaining feedback
- Content architecture separating content from application logic
- One shared visual sentence component used by all six topics
- Responsive on phone, tablet, laptop, desktop and classroom projector
- Build number updated to Build 1.1
- Full regression of Build 1.0.1

Explicitly out of scope and not built: Practice engine, Break It Down engine, Test engine, scoring, progress storage, accounts, badges, sound, speech, AI, APIs, History API, web manifest.

## Requirements Traceability

| Requirement | Status |
|---|---|
| Verb lesson | PASS |
| Subject lesson | PASS |
| Complete Subject lesson | PASS |
| Predicate lesson | PASS |
| Noun lesson | PASS |
| Adjective lesson | PASS |
| One consistent pattern (Definition → Clue → Example → Try It) across all six | PASS |
| Learn topic screen shows only the six approved topics | PASS |
| Each topic has a short child-friendly description | PASS |
| Study Guides for all six topics | PASS |
| Study Guide is contextual, not a home-screen mode | PASS |
| Try It activity in every topic | PASS |
| Feedback explains rather than saying "wrong" | PASS |
| Feedback is static and deterministic (no generated text) | PASS |
| Content separated from application logic | PASS |
| One shared sentence component for all six topics | PASS |
| Verb endings taught as clues, never as rules | PASS |
| Word-ending contrast example included | PASS |
| Subject taught as verb-first, then "who or what?" | PASS |
| "Subject always comes before the verb" NOT taught | PASS |
| "Predicate comes after the verb" NOT taught | PASS |
| Verb shown inside the predicate | PASS |
| Adjective tied to the specific noun it describes | PASS |
| Noun / subject distinction taught | PASS |
| Phone (320, 375, 390, 430) | PASS |
| Tablet portrait and landscape | PASS |
| Laptop (1366x768, 1440x900) | PASS |
| Desktop (1920x1080) | PASS |
| Classroom projector / large 16:9 display | PASS |
| Accessibility | PASS |
| Build number reads Build 1.1 | PASS |
| Build 1.0.1 regression | PASS |
| No scope creep | PASS |

## Files Added

| File | Lines | Purpose |
|---|---|---|
| `js/data/learn-content.js` | 653 | All Learn content: definitions, clues, examples, Study Guides, Try It questions, answers and feedback. No logic. |
| `js/learn.js` | 526 | Learn Mode engine: sentence component, lesson runner, Try It, Study Guide. No grammar text. |
| `AUDIT-REPORT-Build-1.1.md` | — | This report |

## Files Modified

| File | Change |
|---|---|
| `index.html` | Added two screens (`#screen-topics`, `#screen-lesson`), the Study Guide dialog, and two script tags. The home screen and the placeholder mode screen are unchanged. |
| `css/styles.css` | Added sections 9–11 (Learn Mode, Learn responsive, classroom projector) and six colour tokens. Existing shell rules were changed only where an instructional colour needed to clear contrast — see the Accessibility Audit. |
| `js/app.js` | `BUILD_NUMBER` → `"Build 1.1"`; the Learn card now opens the Learn topic screen instead of the placeholder; `SCREENS` extended; Escape now steps back one level; the shell exposes `SS_SHELL` to Learn. Practice, Break It Down and Test routing is untouched. |

Removed from the delivered ZIP: the Build 1.0 and Build 1.0.1 audit reports, so the package contains only this build's files. Those reports remain in your repository and are not deleted by extracting this ZIP.

## Learn Architecture

**One lesson system, not six.** There is a single lesson runner and a single set of screens. A topic is data, not code — adding or changing a topic never touches rendering.

The flow is three screens deep at most:

```
Home  →  Learn topic screen  →  Lesson  (Study Guide opens over the lesson)
```

**The lesson runner** (`js/learn.js`) holds four step keys — `definition`, `clue`, `example`, `tryIt` — and walks them in order for whichever topic is open. `renderStep()` reads `topic[stepKey]` and hands it to one generic block renderer.

**The block renderer** draws whatever the block defines, always in the same pedagogical order: text → numbered steps → bullet list → example groups → the "this is a clue" warning → the sentence → checked points → the contrast pair → the closing note. A block that omits a piece simply skips it. This is why Verb and Adjective read the same way despite holding different material, and why no topic needed its own layout code.

**The Try It step** is the only interactive part. It renders its own sentence, question and choices, marks the chosen button, shows the matching feedback from the content file, and unlocks **Finish** only once the correct answer is chosen. A wrong choice disables that one button and invites another look; the child can keep trying.

**The Study Guide** is a panel that opens over the lesson, built from the same content file. It is reachable only from inside a topic, and it is not on the home screen or the topic screen.

**Navigation** stays exactly as simple as Build 1.0.1: Home is always in the header, Back is always bottom-left, and Escape steps back one level — closing the Study Guide first, then leaving a lesson for the topic list, then returning Home. There is no breadcrumb trail. A child always sees which topic they are in (header tag) and where they are in it (the four-step progress row).

## Content Architecture

**All Learn content lives in `js/data/learn-content.js` and nowhere else.** `js/learn.js` contains no definition, no example sentence, no answer and no feedback string; `js/app.js` contains none either. The two can be audited separately — grammar in one file, behaviour in the other.

Each topic is one object:

```
topic
├─ name, badge, card (topic-screen label and description), color
├─ definition { title, text, list?, groups?, note?, sentence? }
├─ clue       { title, text, steps?/list?, warning, sentence?, contrast? }
├─ example    { title, text, sentence, points[] }
├─ tryIt      { title, sentence, question, choices[{text, correct?, feedback}] }
├─ recap      (one line shown on the completion panel)
└─ studyGuide { title, sections[{heading, lines?/steps?/chips?/sentence?}], reminder }
```

Teaching sentences are stored as an explicit **array of words** with annotations that point at exact word positions, never at a guessed text match:

```
sentence: {
  words:  ["The","excited","player","kicked","the","red","ball."],
  marks:  [{ start:3, end:3, kind:"verb", label:"VERB" }],
  split:  { at:3, leftLabel:"COMPLETE SUBJECT", rightLabel:"PREDICATE" },
  links:  [{ from:1, to:2, text:"describes" }]
}
```

The strategy text and its required caveat are also content, not code.

## Shared Sentence Component

One component (`renderSentence`) draws **every** teaching sentence in Learn Mode — in lessons, in Try It, and inside Study Guides. It supports exactly four things: word chips, a marked word with its label, a two-part split with labelled boxes, and written adjective-to-noun links. There is no second sentence renderer anywhere in the project.

Two accuracy details it enforces: ending punctuation is rendered outside the underline, so a child sees **ball** marked as the noun and not "ball."; and the same rule applies inside the adjective links.

## Educational Content Audit

Every definition and rule the app states, checked for accuracy and for third-grade wording:

| Statement | Assessment |
|---|---|
| "A verb tells what someone or something does or is." | Correct; covers action and linking verbs at this level. |
| "Most verbs show action. A few verbs do not show action. They tell what someone or something is, like in The dog is small." | Correct and appropriately hedged with "most" and "a few". |
| "Some verbs end in -s / -ed / -ing" | Correct as stated — "some", never "all". |
| "These endings are clues. They are not rules. Read the sentence to make sure." | Correct; this is the required framing and it is stated in the lesson, repeated in the contrast, and repeated again in the Study Guide. |
| "Same word, two different jobs. That is why an ending is a clue, not a rule." | Correct; supported by the worked contrast pair below. |
| "The subject tells who or what the sentence is about." | Correct. |
| "The simple subject is the main subject word." | Correct. |
| "Find the verb → ask who or what did it → that is the subject." | Correct, and the preferred strategy. |
| "In many of the sentences we are learning, the subject comes before the verb." | Correct and properly hedged. The absolute claim is **not** made anywhere. |
| "Noun tells what kind of word it is. Subject tells the job the word does in the sentence." | Correct; this is the required distinction. |
| "The complete subject is the simple subject and the words that go with it." | Correct at this level. |
| "The complete subject is everything that tells who or what — not just the one main word." | Correct. |
| "The predicate is the part of the sentence that has the verb. It tells what the subject does, or what is being said about the subject." | Correct. |
| "The verb is always inside the predicate." | Correct for the sentence types taught, and shown visually. |
| "Find the verb → find the complete subject → the other part is the predicate." | Correct for these sentence types. |
| "A noun names a person, place, thing, or idea." | Correct. |
| "An idea is something you cannot touch, like joy or hope. It is still a noun." | Correct and age-appropriate. |
| "You can often put the or a in front of a noun." | Correctly hedged with "often", and followed by "This is a clue, so check the sentence." |
| "An adjective describes a noun." | Correct. |
| "An adjective does not just describe. It describes a noun. Always ask which noun it is describing." | Correct, and the central point of the topic. |
| "What kind? / Which one? / How many?" | Correct; the three standard questions. |
| "excited does not describe ball, and red does not describe player." | Correct, and it teaches the relationship rather than the label. |
| "This is a helpful way to break down the kinds of sentences we are learning." | The required caveat, stated verbatim on the topic screen. |

**Claims deliberately NOT made anywhere in the build:** "words ending in -ing are verbs"; "-ed means a word is a verb"; "the subject always comes before the verb"; "the predicate comes after the verb". Each was checked by searching the content file.

**Terminology deliberately not introduced:** adverb, pronoun, preposition, prepositional phrase, conjunction, direct object, compound subject, compound predicate, clause, complex sentence, diagramming. No Try It choice requires naming any of them.

## Sentence Data Audit

Every teaching sentence used anywhere in Learn Mode, with its full annotation set. All are declarative, start with a capital letter, end with a period, and express a complete thought.

**S1 — "The player kicked the ball."** (Verb definition/example; Subject definition/clue/example; Noun clue; Verb and Subject Study Guides)
verb `kicked` · simple subject `player` · complete subject `The player` · predicate `kicked the ball` · nouns `player`, `ball` · adjectives none · capital ✓ · period ✓ · complete thought ✓ · **unambiguous**

**S2 — "The excited player kicked the red ball."** (Complete Subject and Predicate lessons and guides; Adjective definition/example and guide)
verb `kicked` · simple subject `player` · complete subject `The excited player` · predicate `kicked the red ball` · nouns `player`, `ball` · adjectives `excited`→`player`, `red`→`ball` · capital ✓ · period ✓ · complete thought ✓ · **unambiguous**

**S3 — "The workers are building a house."** (Verb clue contrast, first half)
Labelled only as "TELLS WHAT THEY DO" on `building`. Deliberately not labelled "VERB", because the full verb here is *are building* and verb phrases are outside the approved scope. The claim made — that *building* tells what the workers are doing — is accurate. · capital ✓ · period ✓

**S4 — "The building is tall."** (Verb clue contrast, second half)
`building` labelled "NAMES A THING" (noun); the text states the verb is `is`. verb `is` · simple subject `building` · complete subject `The building` · nouns `building` · capital ✓ · period ✓ · **unambiguous**

**S5 — "The small dog jumped over the log."** (Verb Try It)
verb `jumped` · simple subject `dog` · complete subject `The small dog` · predicate `jumped over the log` · nouns `dog`, `log` · adjective `small`→`dog` · capital ✓ · period ✓ · **one correct answer: `jumped`**

**S6 — "The tall teacher wrote on the board."** (Subject Try It)
verb `wrote` · simple subject `teacher` · complete subject `The tall teacher` · predicate `wrote on the board` · nouns `teacher`, `board` · adjective `tall`→`teacher` · capital ✓ · period ✓ · **one correct answer: `teacher`**

**S7 — "The happy children played at the park."** (Complete Subject Try It)
verb `played` · simple subject `children` · complete subject `The happy children` · predicate `played at the park` · nouns `children`, `park` · adjective `happy`→`children` · capital ✓ · period ✓ · **one correct answer: `The happy children`**

**S8 — "The brave firefighter climbed the long ladder."** (Predicate Try It)
verb `climbed` · simple subject `firefighter` · complete subject `The brave firefighter` · predicate `climbed the long ladder` · nouns `firefighter`, `ladder` · adjectives `brave`→`firefighter`, `long`→`ladder` · capital ✓ · period ✓ · **one correct answer: `climbed the long ladder`**

**S9 — "The student read a book."** (Noun example and Noun Study Guide)
verb `read` · simple subject `student` · complete subject `The student` · predicate `read a book` · nouns `student` (person), `book` (thing) · adjectives none · capital ✓ · period ✓ · **unambiguous**

**S10 — "The kind teacher works at a big school."** (Noun Try It)
verb `works` · simple subject `teacher` · complete subject `The kind teacher` · predicate `works at a big school` · nouns `teacher` (person), `school` (place) · adjectives `kind`→`teacher`, `big`→`school` · capital ✓ · period ✓ · **one correct answer for "which word names a place": `school`** (the only place noun in the sentence)

**S11 — "The fast player caught the high ball."** (Adjective clue)
verb `caught` · simple subject `player` · complete subject `The fast player` · predicate `caught the high ball` · nouns `player`, `ball` · adjectives `fast`→`player`, `high`→`ball` · capital ✓ · period ✓ · **unambiguous**

**S12 — "The hungry cat ate a small fish."** (Adjective Try It)
verb `ate` · simple subject `cat` · complete subject `The hungry cat` · predicate `ate a small fish` · nouns `cat`, `fish` · adjectives `hungry`→`cat`, `small`→`fish` · capital ✓ · period ✓ · **one correct answer for "which word describes the noun cat": `hungry`** — `small` is an adjective but describes `fish`, which is exactly the misconception the item is built to surface.

**Content spread:** sports, school, animals, family/community work, reading, everyday life. Two of twelve sentences involve a sports context; the set is not baseball-heavy.

**Verification:** each Try It was exercised programmatically and exactly one choice returned a correct result in all six. No item has two defensible answers.

## Verb Clue Audit

Confirmed: `-s`, `-ed` and `-ing` are presented as **clues**, never as guarantees.

| Where | Wording |
|---|---|
| Verb lesson, Clue step | "Some verbs end in -s: runs, plays, throws" / "Some verbs end in -ed: jumped, played, walked" / "Some verbs end in -ing: running, playing, walking" — each begins with "Some verbs", never "words ending in". |
| Verb lesson, Clue step warning | "These endings are clues. They are not rules. Read the sentence to make sure." |
| Verb lesson, contrast | "The workers are building a house." → *building* tells what they are doing. "The building is tall." → *building* names a thing; the verb is *is*. Closing line: "Same word, two different jobs. That is why an ending is a clue, not a rule." |
| Verb Study Guide, section headings | "Clue: verbs ending in -s / -ed / -ing" |
| Verb Study Guide, reminder | "These endings are clues. Read the sentence to make sure." |

The required contrast demonstrating a misleading ending is present, worked through in both directions, and at third-grade reading level. Searching the content file confirms the strings "are verbs", "always a verb" and "means a verb" appear nowhere.

## Study Guide Audit

All six approved topics have a guide. Each is reachable only from inside its own topic, through one **Study Guide** button in the lesson header. There is no Study Guide entry on the home screen or the topic screen.

| Topic | Guide | Sections | Required content present |
|---|---|---|---|
| Verb | Verb Study Guide | 8 | definition ✓ · action/state reminder ✓ · -s ✓ · -ed ✓ · -ing ✓ · verb example list ✓ · sentence example ✓ · reminder "These endings are clues. Read the sentence to make sure." ✓ |
| Subject | Subject Study Guide | 4 | definition ✓ · the 3-step strategy (find the verb / ask who or what / find the subject) ✓ · one visual example ✓ · noun-vs-subject distinction ✓ |
| Complete Subject | Complete Subject Study Guide | 5 | simple subject `player` ✓ · complete subject `The excited player` ✓ · relationship shown in a split sentence ✓ · how to find it ✓ |
| Predicate | Predicate Study Guide | 3 | contains the verb ✓ · tells what the subject does or is ✓ · one split-sentence example with the verb marked inside the predicate ✓ |
| Noun | Noun Study Guide | 6 | person ✓ · place ✓ · thing ✓ · idea ✓ (six examples each for the first four) · sentence example ✓ |
| Adjective | Adjective Study Guide | 5 | definition ✓ · What kind? ✓ · Which one? ✓ · How many? ✓ · adjective→noun relationships shown ✓ |

Behaviour verified for all six: the panel opens, focus moves into it, Escape closes it, focus returns to the Study Guide button, and closing does not disturb the lesson step underneath.

## Try It Audit

Every question, every choice, and every response. All six were exercised choice-by-choice in a browser; the recorded feedback below is what the app actually displayed.

**Verb** — "The small dog jumped over the log." · *Which word tells what happened?*

| Choice | Result | Feedback shown |
|---|---|---|
| small | ✕ | "small tells what kind of dog it is. It describes the dog. Look again for the word that tells what happened." + "Try again." |
| dog | ✕ | "dog names an animal, so it is a noun. Look again for the word that tells what happened." + "Try again." |
| **jumped** | ✓ | "Correct! jumped is the verb because it tells what the dog did." |
| log | ✕ | "log names a thing, so it is a noun. Look again for the word that tells what happened." + "Try again." |

**Subject** — "The tall teacher wrote on the board." · *The verb is wrote. Ask: who wrote? Which word is the simple subject?*

| Choice | Result | Feedback shown |
|---|---|---|
| tall | ✕ | "tall describes the teacher. It is not the main subject word. Ask: who wrote?" |
| **teacher** | ✓ | "Correct! The verb is wrote. Who wrote? The teacher. So teacher is the simple subject." |
| wrote | ✕ | "wrote is the verb. It tells what happened. Now ask: who wrote?" |
| board | ✕ | "board names a thing, so it is a noun — but it is not who did the writing. Ask: who wrote?" |

**Complete Subject** — "The happy children played at the park." · *The simple subject is children. Which group of words is the complete subject?*

| Choice | Result | Feedback shown |
|---|---|---|
| **The happy children** | ✓ | "Correct! children is the simple subject, and The happy children is the complete subject." |
| happy children | ✕ | "So close! Those words are part of it, but the complete subject also includes the word The." |
| children | ✕ | "children is the simple subject — the one main word. The complete subject also includes the words that go with it." |
| played at the park | ✕ | "That part has the verb played in it, so it tells what the children did. The complete subject tells who or what." |

**Predicate** — "The brave firefighter climbed the long ladder." · *The verb is climbed. Which part is the predicate?*

| Choice | Result | Feedback shown |
|---|---|---|
| **climbed the long ladder** | ✓ | "Correct! climbed the long ladder is the predicate. It has the verb climbed and tells what the firefighter did." |
| The brave firefighter | ✕ | "That is the complete subject. It tells who the sentence is about. The predicate is the part with the verb in it." |
| climbed | ✕ | "climbed is the verb, and the verb is inside the predicate. But the predicate is the whole part that tells what the firefighter did." |
| the long ladder | ✕ | "Those words are part of the predicate, but the predicate starts with the verb climbed." |

**Noun** — "The kind teacher works at a big school." · *Which word names a place?*

| Choice | Result | Feedback shown |
|---|---|---|
| teacher | ✕ | "teacher is a noun, but it names a person, not a place." |
| works | ✕ | "works is the verb. It tells what the teacher does." |
| big | ✕ | "big describes the school. It tells what kind." |
| **school** | ✓ | "Correct! school names a place, so it is a noun." |

**Adjective** — "The hungry cat ate a small fish." · *Which word describes the noun cat?*

| Choice | Result | Feedback shown |
|---|---|---|
| **hungry** | ✓ | "Correct! hungry describes the noun cat. It tells what kind of cat." |
| cat | ✕ | "cat is the noun being described. Look for the word that tells more about the cat." |
| ate | ✕ | "ate is the verb. It tells what the cat did." |
| small | ✕ | "small is an adjective, but it describes fish, not cat." |

Try It is deliberately short — one question per topic, immediately after the teaching. It is not Practice Mode: there is no session, no score, no problem set and no progression.

## Feedback Audit

| Requirement | Result |
|---|---|
| Correct feedback explains **why** | PASS — all six begin "Correct!" and then give the reason ("…because it tells what the dog did"). None stops at "Correct". |
| Incorrect feedback teaches rather than saying "Wrong" | PASS — the string "Wrong" appears nowhere. Each of the 18 incorrect responses names what that word actually is, then redirects. |
| Incorrect feedback is short, not a lecture | PASS — the longest is two short sentences. |
| Child-friendly language | PASS — no unapproved grammar terminology appears in any feedback line. |
| Static and deterministic | PASS — every response is a fixed string in the content file, looked up by choice. There is no generation, no randomness, no network call and no template assembly anywhere in the feedback path. |
| Result not signalled by colour alone | PASS — correct shows a ✓ mark, the word "Correct!", a solid border and a green panel; incorrect shows a ✕ mark, the words "Try again.", a **dashed** border and an orange panel. Mark, wording and border style all carry the result independently of hue. |

## Navigation Audit

| Path | Result |
|---|---|
| Home → Learn card → Learn topic screen | PASS at all nine tested viewports |
| Topic screen → topic card → lesson | PASS for all six topics |
| Lesson: Back / Next through the four steps | PASS |
| Next is disabled on Try It until the correct answer is chosen, and reads "Finish" | PASS |
| Lesson → All Topics (footer) | PASS |
| Lesson → Home (header) | PASS |
| Topic screen → Back → Home | PASS |
| Topic screen → Home → Home | PASS |
| Escape closes the Study Guide first | PASS |
| Escape in a lesson (no guide open) → topic screen | PASS |
| Escape on the topic screen → Home | PASS |
| Completion panel: Next topic / Learn this again / All Topics / Home | PASS; "Next topic" is correctly hidden on Adjective, the last topic |
| Practice / Break It Down / Test placeholders → Back and Home | PASS, unchanged |
| Depth | Never more than three levels; no breadcrumb system |
| Orientation | The header always shows the topic name; the four-step row always shows the current step |

## Phone Audit

Tested at 320x568, 375x667, 390x844 and 430x932, walking all six topics through all four steps and opening every Study Guide.

| Check | 320x568 | 375x667 | 390x844 | 430x932 |
|---|---|---|---|---|
| Horizontal overflow (home, topics, lesson, Try It, guide) | 0 px | 0 px | 0 px | 0 px |
| Max overflow across all 6 topics x 4 steps + 6 guides | 0 px | 0 px | — | — |
| Body text | 16 px | 16 px | 16 px | 16 px |
| Teaching sentence | 17.9 px | 17.9 px | 17.9 px | 17.9 px |
| Part / word labels | 11.5 px | 11.5 px | 11.5 px | 11.5 px |
| Try It choice height | 54 px | 54 px | 54 px | 54 px |
| Nav button height | 44 px | 44 px | 44 px | 44 px |
| Study Guide fits the viewport | yes | yes | yes | yes |
| Build badge visible | yes | yes | yes | yes |

Lesson steps stack vertically; topic cards become full-width tappable rows with the topic badge, name, description and a trailing arrow; the split sentence stacks into two labelled boxes with the divider rotated so the division is still visible; Try It choices become one per row at full width. The Study Guide opens full-screen with its own scroll, so it never traps content behind it, and the Close button is always in view at the top. Vertical scrolling is required on lesson steps with a lot of material, which the specification allows.

## Tablet Audit

| Check | 768x1024 portrait | 1024x768 landscape |
|---|---|---|
| Horizontal overflow | 0 px | 0 px |
| Topic grid | 2 columns | 2 columns |
| Lesson content width | 694 px | 820 px |
| Teaching sentence | 20 px | 20 px |
| Split sentence | side by side, 261 px + 329 px | side by side |
| Try It choice height | 52 px | 52 px |
| Study Guide panel | 736 px wide, fits viewport | 760 px wide, fits viewport |

Content uses the available width without stretching: the lesson column is capped so lines stay readable, and the split-sentence boxes size to their own content rather than being forced equal, which stops the shorter part from sitting half empty. The Study Guide is a centred panel that never covers content unexpectedly — it is opened deliberately and closed with a button or Escape.

## Laptop Audit

| Check | 1366x768 | 1440x900 |
|---|---|---|
| Horizontal overflow | 0 px | 0 px |
| Teaching sentence | 24.8 px (1.47x body) | 24.8 px |
| Lesson title | 32 px | 32 px |
| Lesson body text | 17.9 px | 17.9 px |
| Lesson content width | 872 px | 872 px |
| Split parts | 408 px + 408 px, side by side | same |
| Try It choice height | 52 px | 52 px |

The lesson fits without excessive empty space: the stage card grows to the content, the sentence is visibly the largest element on the step, and Back / Next sit directly under the card within easy reach. Topic cards are three across.

## Desktop Audit

| Check | 1920x1080 | 2560x1440 |
|---|---|---|
| Horizontal overflow | 0 px | 0 px |
| Teaching sentence | 41.6 px | 41.6 px |
| Lesson body text | 24 px | 24 px |
| Lesson title | 46.4 px | 46.4 px |
| Lesson content width | **1173 px (capped)** | **1173 px (capped)** |
| Shell width | capped at 1720 px | capped at 1720 px |

Text is never stretched across the full screen — the reading measure is capped and the layout is centred, so a 2560 px monitor shows the same comfortable column as a 1920 px one. The visual hierarchy is identical to the phone: title, then sentence, then supporting points. Related teaching elements stay grouped inside one card rather than being spread apart by large gaps.

## Classroom Projector Audit

Audited as its own target at **1920x1080 (16:9)**, which is the common classroom projector and large-display resolution, and re-checked at 2560x1440.

| Projector requirement | Result | Evidence |
|---|---|---|
| Sentence examples render noticeably larger than normal body text | **PASS** | Teaching sentence renders at **41.6 px** against 17 px body text — **2.47x body**, and the single largest element on the step apart from the title |
| Lesson headings visually clear | **PASS** | Lesson title 46.4 px bold; progress steps 20 px in bordered pills |
| Definitions and clues large enough for group viewing | **PASS** | Lesson text, list items and step lists all render at **24 px**; the "this is a clue" panel at 22.4 px |
| Part labels (VERB, SUBJECT, PREDICATE, NOUN, ADJECTIVE) legible from a distance | **PASS** | Labels render at **16.8 px** uppercase bold — larger than the body text of most desktop sites, and each sits directly above its word |
| No small secondary text carrying essential meaning | **PASS** | The smallest text on a projected lesson step is the 16.8 px label; nothing essential is below that. The build badge (12 px) is the only smaller text and carries no instructional meaning |
| No reliance on hover | **PASS** | Nothing is revealed by hover anywhere in Learn Mode. Hover only nudges a button 2 px; every label, mark and relationship is drawn on load |
| No reliance on subtle colour differences | **PASS** | A marked word carries a written label, a 6 px underline and a 3 px border. A split part carries a written label and its own 4 px bordered box. An adjective link is written out as "excited → describes → player" |
| Strong contrast | **PASS** | All instructional labels measured against their panel: VERB 4.68:1, SIMPLE SUBJECT 5.34:1, COMPLETE SUBJECT 8.02:1, PREDICATE 5.98:1, NOUN 5.90:1, ADJECTIVE 5.02:1 — all clear WCAG AA for small text, before the projector size increase |
| Sentence and its highlighted relationship stay visually prominent | **PASS** | The sentence panel is the centre of the stage; the stage is vertically centred at large sizes so the sentence sits at eye height rather than pinned to the top |
| Lines of text not overly wide | **PASS** | The lesson column is capped at 1400 px and prose is additionally capped by a character measure, so lines break well before the screen edge |
| Controls usable with mouse or touchscreen | **PASS** | Try It choices are **76 px** tall at this size; Back / Next / Finish are 63 px |
| No separate "Projector Mode" | **PASS** | No extra button, mode or setting exists. This is the normal responsive design at large widths |

**Group-viewing judgement:** at 1920x1080 the teaching sentence renders at roughly 42 px and the part labels at roughly 17 px. Projected to a typical classroom screen, the sentence and its labels are comfortably readable from the back of a room; the supporting bullet points at 24 px are readable from the middle of a room. The one honest caveat is that the four-item bulleted "points" list on an Example step is the smallest instructional text at that size — readable, but the sentence and its labels are what carry the lesson from a distance, which is the intent.

## Accessibility Audit

| Check | Result |
|---|---|
| Semantic controls | All interactive elements are real `<button>` elements; topic cards are buttons, Try It choices are buttons |
| Headings and structure | One `<h2>` per screen, `aria-labelledby` on each screen section, `<h3>` for guide and group headings |
| Keyboard operation | Every control reachable and operable by keyboard; Enter/Space activate cards and choices |
| Focus management | Opening the topic screen focuses its heading; opening a lesson step focuses the step heading; the completion panel focuses its title; opening the Study Guide focuses the guide title and **closing it returns focus to the Study Guide button** (verified for all six topics) |
| Focus visibility | Two-ring white + blue indicator on every control, including topic cards and Try It choices |
| Study Guide dialog | `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, closable by button, by Escape, and by clicking the backdrop; page scroll is locked while it is open |
| Live feedback | The Try It feedback line is `role="status" aria-live="polite"`, so the explanation is announced when it appears |
| Result never colour-only | Correct: ✓ mark + "Correct!" + solid border. Incorrect: ✕ mark + "Try again." + **dashed** border. Verified in the rendered DOM |
| Sentence marking never colour-only | Every marked word carries a written label, an underline and a border; every split part carries a written label and a box; adjective links are written out in words |
| Contrast — instructional labels | VERB 4.68 · SIMPLE SUBJECT 5.34 · COMPLETE SUBJECT 8.02 · THE REST OF THE SENTENCE 5.98 · PREDICATE 5.98 · NOUN 5.90 · PERSON/THING 5.90 · ADJECTIVE 5.02 · WHAT KIND? 5.02 — **all pass AA at small-text threshold** |
| Contrast — cards and headers | All six topic cards and all six lesson headers measured at both gradient ends; all pass AA |
| Reduced motion | `prefers-reduced-motion: reduce` disables the step-entry animation and all transitions |
| Decorative content | Background shapes, arrows and the celebration mark are `aria-hidden` |

**Four contrast defects were found and fixed during this audit**, all in new Learn Mode colours: the SIMPLE SUBJECT label was 3.07:1 and the ADJECTIVE label 3.17:1 against the sentence panel (both now 5.34 and 5.02); the Complete Subject and Predicate topic cards had white text on light gradient ends at 2.09:1 and 2.07:1 (both gradients darkened); and the Adjective lesson header had white text on a light orange end at 2.16:1 (darkened). Labels were also enlarged from 9.3 px to 11.5 px on phones, because they carry essential meaning and 9 px is too small for a third grader.

**Three layout defects were found and fixed:** the Try It sentence rendered twice (the generic block renderer and the Try It renderer both drew it); "Try again." wrapped into the right margin instead of sitting under the explanation; and phrase-length answer choices were squeezed into narrow columns. All three were caught by looking at rendered screenshots rather than by reading the code.

## Regression Audit

Full Build 1.0.1 suite re-run against the Build 1.1 files at nine viewports.

| Build 1.0.1 feature | Result |
|---|---|
| Logo loads | PASS — `naturalWidth` non-zero at every viewport |
| Home screen unchanged apart from the build number | PASS — `index.html` home markup untouched; the four cards, helper text, strategy strip and logo are byte-identical |
| Learn card opens | PASS — now opens the Learn topic screen (the intended Build 1.1 change) |
| Practice placeholder | PASS — opens, blue header, tag "Practice", text unchanged |
| Break It Down placeholder | PASS — opens, gold header, tag "Break It Down", text unchanged |
| Test placeholder | PASS — opens, purple header, tag "Test", text unchanged |
| Back works | PASS — 36 of 36 |
| Home works | PASS — 36 of 36 |
| Escape works | PASS — 36 of 36 |
| Build badge | PASS — reads "Sentence Sense — Build 1.1" at all nine viewports |
| Horizontal overflow | PASS — 0 px at all 45 shell measurements |
| Relative paths / assets | PASS — no 404s |

Practice, Break It Down and Test were **not** redesigned: their screen, header, text and behaviour are unchanged. The only related edit was removing the now-unused `learn` entry from the placeholder config, because Learn has a real destination.

## Console Audit

**No application console errors and no uncaught exceptions** across the full Learn walkthrough (six topics x four steps x every Try It choice x every Study Guide) and across the nine-viewport shell regression.

The only non-application entry is the Google Fonts stylesheet request, blocked by this sandbox's outbound proxy. Every measurement and screenshot in this report was therefore taken with the system-font fallback. That request succeeds on your machine and on GitHub Pages, and the app is fully functional without it.

## Broken Asset Audit

All local references resolve; no 404s recorded during any test run.

| Reference | Source |
|---|---|
| `css/styles.css` | index.html |
| `js/data/learn-content.js` | index.html |
| `js/learn.js` | index.html |
| `js/app.js` | index.html |
| `assets/images/logo.png`, `logo-512.png`, `favicon.png` | index.html |

`css/styles.css` makes no `url()` requests. Neither JavaScript file fetches anything. No unused files ship in the ZIP.

## GitHub Pages Audit

| Check | Result |
|---|---|
| `index.html` at repository root | PASS |
| All paths relative | PASS — including the two new script tags (`js/data/learn-content.js`, `js/learn.js`); no leading `/`, so the app works from the `/Sentence-Sense/` subpath |
| Case consistency | PASS — every new file and folder is lowercase and every reference matches exactly, including the new `js/data/` directory. This is the Build 1.0.1 lesson applied to new files |
| No modules, no build step, no bundler | PASS — three plain scripts loaded in order; no `type="module"`, so no MIME or CORS issue on Pages |
| No server code, database, API or authentication | PASS |
| No Jekyll conflict | PASS — no underscore-prefixed or reserved directory names |
| $0 recurring cost | PASS |

**One thing to watch when you deploy:** `js/data/` is a new directory. Extract the ZIP into `C:\Sentence-Sense` and confirm `git status` lists `js/data/learn-content.js` before committing — a new nested folder is exactly the kind of thing that gets missed, and Build 1.0.1 was a folder-name problem.

## Scope-Creep Audit

**No unapproved feature was implemented.**

Not built, and confirmed absent from the code: Practice engine, Break It Down engine, Test engine, scoring, progress storage, "Practice My Misses", accounts, parent dashboard, badges, coins, avatars, leaderboards, sound, speech recognition, AI tutoring, API calls, database, History API, web app manifest, self-hosted fonts, extra grammar topics, extra main modes, settings screens.

Three in-scope decisions worth naming explicitly so you can veto any of them:

1. **The eight-step strategy is displayed on the Learn topic screen**, below the six cards, as numbered chips with the required caveat line. The specification asked for the strategy to be used consistently; this is where it can be stated once without repeating it in every lesson. It is static text with no interaction. Removing it is a small, contained change.
2. **A completion panel after Try It** offers "Next topic", "Learn this again", "All Topics" and "Home". This is navigation within Learn, matching the Add It! lesson-completion pattern — not a reward, score or progress system. Nothing is stored.
3. **Escape now steps back one level** rather than always jumping Home, so it can close the Study Guide. The Build 1.0.1 behaviour (Escape returns Home) is preserved on the topic and placeholder screens.

Also noted: the Try It sentence for each topic is shown without marks, so the child has to find the answer rather than read it off a labelled sentence. That was a deliberate instructional choice, not an omission.

## Known Issues

1. **Verb clue contrast wording.** In "The workers are building a house.", the complete verb is *are building*. Verb phrases are outside the approved scope, so the app labels only *building* and says it "tells what the workers are doing" rather than calling it "the verb". This is accurate but is a simplification, and a child who later learns verb phrases will need that filled in. Flagged for your judgement rather than silently resolved.
2. **Long Example steps scroll on small phones.** At 320x568 the Adjective and Noun Example steps require scrolling to reach Back / Next. No content is cut off and no control is hidden behind a fixed element; the specification allows vertical scrolling.
3. **320x568 home screen** still puts the fourth mode button about 57 px below the fold. Carried over from Build 1.0 and unchanged.
4. **Google Fonts** remains the only outbound request. Unchanged since Build 1.0; your decision on it is still open.
5. **Adjective link display.** Adjective-to-noun relationships are shown as written rows ("excited → describes → player") beneath the sentence rather than as drawn curves over the words. This is deliberate: written links stay exact at every width and read clearly on a projector, where curved connectors between wrapping words do not.

Nothing in this build is known to be broken. Learn Mode is complete and functional across all six topics.

## Future Considerations

Recorded, **not implemented**, awaiting approval:

1. A validator that walks the content file on load in a development mode and asserts every Try It has exactly one correct answer and every mark index is inside its sentence — the checks performed by hand for this audit, made automatic before the content library grows.
2. Reusing the sentence component's `split` and `links` modes in Break It Down, so a whole-sentence analysis looks identical to what the child saw in Learn.
3. A "Study Guide" entry point from the topic screen as well as from inside a lesson, if you find the child wants to review without re-entering a topic.
4. Drawn adjective→noun connector curves as a progressive enhancement on wide screens only, with the written rows kept as the base.
5. Optional read-aloud of the teaching sentence — noted only; it would need approval and would change the no-audio scope.
6. Remembering which topics a child has finished, which would require storage and is explicitly out of scope today.

None of these will be built without your approval.

## Final Audit Result

**PASS**

Learn Mode is complete for all six approved topics, built as one lesson system rather than six: one runner, one block renderer, one sentence component, one Study Guide panel, and every word of content in a single data file separate from the code. All twelve teaching sentences are annotated and validated as unambiguous; all six Try It items have exactly one defensible answer, confirmed by exercising all 24 choices in a browser; all 18 incorrect responses explain the word's real job instead of saying "wrong"; and the verb endings are taught as clues in five separate places, with a worked contrast showing an ending misleading in both directions.

The build is responsive across all five required targets, with the classroom projector treated as its own target: at 1920x1080 the teaching sentence renders at 2.47x body text and part labels at 16.8 px, with no hover dependence and no colour-only signalling. Seven defects — four contrast failures, a duplicated sentence, a broken feedback line and squeezed phrase buttons — were found during this audit and fixed and re-verified. Build 1.0.1 passed regression in full: logo, home screen, three placeholders, Back, Home, Escape, badge, zero overflow, zero console errors.

The one dependency on you: `js/data/` is a new directory, so confirm `git status` lists it before committing.
