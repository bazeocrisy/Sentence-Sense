/* =========================================================
   Sentence Sense — skill content (Build 1.4.0)

   THIS FILE HOLDS EDUCATIONAL CONTENT ONLY.
   No rendering, no navigation, no application logic. Every
   definition, clue, example, reference note and question a child
   sees lives here and nowhere else, so the grammar can be audited
   on its own.

   Build 1.4.0 kept every word of the teaching content that earlier
   builds audited and added six card fields per skill (see `verb`).
   Adding a skill is a content change; no rendering code changes.

   The four LEARN states read these blocks in this order:
     WHAT IS IT?      -> definition
     HOW DO I FIND IT? -> clue, plus the reference chips and the
                          same-word contrast folded out of the
                          retired Study Guide modal
     SHOW ME          -> example
     LET ME TRY       -> learnTry, or tryIt where a topic has one

   `studyGuide` is no longer rendered as a modal. Its useful
   sections are surfaced inside HOW DO I FIND IT as plain content;
   the object is kept because it is the audited source of those
   chip lists and the contrast.

   ---------------------------------------------------------
   SENTENCE SPEC
   ---------------------------------------------------------
   Teaching sentences are stored as an explicit array of words so
   every annotation points at an exact position — never at a
   guessed match. One shared component (js/learn.js) renders every
   spec, so all six topics look and behave the same.

     words   : array of the sentence's words, in order, including
               the ending punctuation on the final word.
     marks   : [{ start, end, kind, label }]  inclusive word range,
               kind = verb | subject | predicate | noun | adjective,
               label = the word shown above the marked words.
     split   : { at, leftLabel, rightLabel }  divides the sentence
               into two labelled parts at word index `at`.
     links   : [{ from, to, text }] a word-to-word relationship,
               used for adjective -> noun.

   Every sentence below is validated in AUDIT-REPORT-Build-1.1.md:
   verb, simple subject, complete subject, predicate, nouns,
   adjectives, adjective-to-noun links, capitalization and ending
   punctuation.
   ========================================================= */

window.SS_LEARN_CONTENT = {

  /* The Sentence Sense strategy, shown on the Learn topic screen.
     Deliberately introduced as a helpful way, not an absolute rule. */
  strategy: {
    heading: "How we break down a sentence",
    steps: [
      "Find the verb.",
      "Ask who or what?",
      "Find the subject.",
      "See the complete subject.",
      "Find the predicate.",
      "Identify nouns.",
      "Connect adjectives to nouns.",
      "Check the sentence."
    ],
    note: "This is a helpful way to break down the kinds of sentences we are learning."
  },

  /* Topic order matches the strategy: verb first, then subject,
     complete subject, predicate, nouns, adjectives.

     Build 1.4.0: `order` is now the ARCHIVE order — every topic whose
     teaching content exists in this file, including the two that the
     redesign does not surface. It is no longer a navigation list. */
  order: ["verb", "subject", "complete-subject", "predicate", "noun", "adjective"],

  /* Build 1.4.0 — THE FOUR HOME SKILLS, in the order Home shows them.
     Deliberately small (brief section 6). complete-subject and predicate
     keep all of their content below, untouched, ready to migrate when a
     later build approves them; they are simply not routed to.

     To add a fifth skill, add its key here and give its topic the six
     card fields documented on `verb`. No rendering code changes. */
  homeOrder: ["verb", "subject", "noun", "adjective"],

  topics: {

    /* ===================================================== */
    /* VERB                                                  */
    /* ===================================================== */
    "verb": {
      name: "Verb",
      badge: "kicked",
      card: "Find what happens.",
      color: "verb",

      /* ---- Build 1.4.0 card fields. These six drive the Home card and the
         shared Skill screen for EVERY skill, so a new skill is content, not
         code (brief section 20).

           ask      : the child clue. One short question, shown on the Home
                      card and again under the title on the Skill screen.
           icon     : a key into the icon set in js/app.js. Clean vector
                      symbols only -- never a character drawing.
           preview  : the small preview sentence on the Home card. `start`
                      and `end` are an inclusive word range, exactly like a
                      `marks` entry, so the highlighted span obeys the same
                      plain-to-marked discipline as a full teaching sentence.
                      Named `preview`, NOT `example`: every topic already has
                      an `example` lesson block and a duplicate key would
                      silently overwrite it.
           practice : "bank" -> run this topic's tryItBank.
                      "soon" -> the honest placeholder. Never a fake.
           test     : "soon" for every skill in 1.4.0. No Test engine exists
                      and none is faked (brief section 17).
         ---- */
      ask: "What is happening?",
      icon: "run",
      preview: { words: ["The", "boy", "runs", "fast."], start: 2, end: 2 },
      practice: "bank",
      test: "pool",

      definition: {
        title: "What is a verb?",

        /* The whole definition in two scannable halves. DOES and IS are the
           two ideas a child has to hold, so they are the two things the eye
           lands on first. */
        callout: {
          title: "A verb tells\u2026",
          rows: [
            { key: "DOES", text: "what someone or something does" },
            { key: "IS",   text: "what someone or something is" }
          ]
        },

        /* One clear action verb and one clear being verb, side by side, so
           both kinds are met in the same breath. */
        contrast: {
          heading: "Both of these are verbs",
          rows: [
            {
              sentence: {
                words: ["The", "player", "kicked", "the", "ball."],
                marks: [{ start: 2, end: 2, kind: "verb", label: "VERB" }]
              },
              text: "kicked tells what the player DOES."
            },
            {
              sentence: {
                /* NOT "tired": the being-verb rule from Build 1.2.6 bars any
                   -ed/-en adjective after a being verb, because "is tired"
                   also reads as a passive verb phrase and the answer stops
                   being unambiguous. "happy" is on the approved list. */
                words: ["The", "dog", "is", "happy."],
                marks: [{ start: 2, end: 2, kind: "verb", label: "VERB" }]
              },
              text: "is tells what the dog IS."
            }
          ]
        },

        note: "Most verbs show action. A few do not \u2014 they tell what someone or something is."
      },

      clue: {
        title: "How do I find the verb?",

        /* THE STRATEGY IS THE LESSON. It is the one thing a child should
           carry out of this step, so it is the largest thing on it and it
           comes first. The endings below are support, not the method. */
        callout: {
          title: "Ask yourself:",
          big: ["What happened?", "What is happening?"],

          /* THE SECOND PATH, and the lesson is wrong without it.

             "What is it?" teaches that a verb tells what something DOES or
             what something IS. The question above only finds the DOES half:
             nothing "happens" in "The dog is happy." A child given only that
             question would stall on the very being verb the previous step
             had just taught them.

             Kept deliberately small -- one line and five words. It is a
             fallback for when the first question comes back empty, not a
             second lesson. */
          fallback: {
            label: "No action? Look for a being verb.",
            chips: ["am", "is", "are", "was", "were"]
          }
        },

        /* Deliberately demoted from prose to chips: they are patterns to
           recognise, not steps to follow. */
        groups: [
          /* "ACTION VERBS", not just "verbs". The endings belong to action
             verbs only -- being verbs have none of them -- and plenty of
             non-verbs share them. "students" ends in -s and is a distractor
             in this very lesson's Let me try question. */
          { label: "Some action verbs end in -s",   chips: ["runs", "plays", "throws"] },
          { label: "Some action verbs end in -ed",  chips: ["jumped", "played", "walked"] },
          { label: "Some action verbs end in -ing", chips: ["running", "playing", "walking"] }
        ],

        warning: "These endings are clues. They are not rules. Read the sentence to make sure."
      },

      example: {
        title: "Let's find the verb",
        sentence: {
          words: ["The", "player", "kicked", "the", "ball."],
          marks: [{ start: 2, end: 2, kind: "verb", label: "VERB" }]
        },

        /* A REPEATABLE ROUTINE, not an explanation. Step 2 is the same
           question the strategy step taught, so the child is practising the
           method they were just given rather than watching a one-off. */
        routine: [
          "Read the sentence.",
          "Ask: What happened?",
          "Answer: kicked.",
          "kicked is the verb."
        ]
      },

      /* Build 1.4.0 — LET ME TRY, the closing state of the Verb LEARN lesson.
         Learn ends with ONE guided example (brief section 12). The 20-question
         bank below is a different activity on a different screen now: Practice.

         This is deliberately named `learnTry`, not `tryIt`. Build 1.2.7 closed
         D-33 with the rule "a topic with a bank must NOT also have a tryIt",
         because the old single engine read both in the same step and a topic
         carrying both had two competing sources of truth. Learn and Practice
         are separate components in 1.4.0, so a topic legitimately needs one
         question in Learn and a bank in Practice -- but the D-33 invariant is
         kept literally true by giving the Learn question its own key. A topic
         still must never carry both `tryIt` and `tryItBank`. */
      learnTry: {
        title: "Let me try",
        sentence: {
          words: ["The", "curious", "students", "studied", "the", "old", "map."]
        },
        question: "Which word tells what happened?",
        choices: [
          { text: "curious", feedback: "curious tells what kind of students they are. It describes them. Look again for the word that tells what happened." },
          { text: "students", feedback: "students names who did the action. Ask yourself: what did the students do?" },
          { text: "studied", correct: true, feedback: "Nice thinking! studied is the verb because it tells what the students did." },
          { text: "map", feedback: "map names a thing in the sentence. Look again for the word that tells what happened." }
        ]
      },

      /* Build 1.2.7 (D-33): Verb's retired single-question `tryIt` was removed.
         A topic that carries a `tryItBank` has ONE source of truth for its Try
         It experience. The five topics without a bank still use `tryIt`, and
         the engine still supports them unchanged. Do not reintroduce a hidden
         fallback question here -- an unreachable question is one a maintainer
         or a harness can mistake for live instructional content. */

      /* -----------------------------------------------------------------
         VERB — 20-QUESTION GUIDED LEARNING BANK (Build 1.2.5)

         Four stages of five. The child completes a stage before the next
         one opens, and the five questions inside a stage are shuffled so a
         repeat visit is not the same order. Nothing here is scored, timed
         or stored: this is Learn, so a wrong answer buys an explanation.

         Each question carries, for every wrong choice, what that word
         actually does IN THAT SENTENCE, then a redirect. `clue` is the
         second-attempt reminder and `reveal` is the third-attempt guided
         answer -- the child is never trapped.
         ----------------------------------------------------------------- */
      tryItBank: {
        /* Build 1.2.7 (D-30): the completion recap belongs to the CONTENT, not
           to the engine. Before this, js/learn.js hard-coded Verb's wording for
           any topic that had a bank, so a future Subject bank would have told
           the child they practiced finding verbs. Every new bank MUST carry its
           own `recap`. Wording unchanged from Build 1.2.5. */
        recap: "You practiced finding action and being verbs in 20 different sentences.",
        stages: [
          { name: "Get Started", desc: "Find clear verbs and build confidence.",
            mark: "⭐", milestoneTitle: "Get Started complete!",
            milestoneLine: "You found verbs in clear sentences.", nextStage: "Look Closer" },
          { name: "Look Closer", desc: "Find verbs in sentences with more details.",
            mark: "🌟", milestoneTitle: "Look Closer complete!",
            milestoneLine: "You found verbs even when the sentence had more details.", nextStage: "Think It Through" },
          { name: "Think It Through", desc: "Use the clues even when the sentence is trickier.",
            mark: "💪", milestoneTitle: "Think It Through complete!",
            milestoneLine: "You used sentence clues to find the verb.", nextStage: "Challenge Yourself" },
          { name: "Challenge Yourself", desc: "Find action and being verbs in different kinds of sentences.",
            mark: "🎉", milestoneTitle: "You practiced Verb 20 different ways!",
            milestoneLine: "", nextStage: "" }
        ],
        questions: [
          /* Q1 -- stage 1 */
          { stage: 0,
            sentence: { words: ["The", "playful", "dog", "jumped", "over", "the", "fallen", "log."] },
            question: "Which word tells what happened?",
            choices: [
              { text: "playful", feedback: "playful tells what kind of dog it is. It describes the dog. Look again for the word that tells what happened." },
              { text: "dog", feedback: "dog names who did the action. Look again for the word that tells what the dog did." },
              { text: "fallen", feedback: "fallen tells what kind of log it is. It describes the log, even though it ends in -en. An ending is only a clue. Look again for the word that tells what happened." },
              { text: "jumped", correct: true, feedback: "Nice thinking! jumped is the verb because it tells what the dog did." }
            ],
            clue: "Remember: ask yourself, What happened?",
            reveal: "Let's find it together. jumped tells what the dog did, so jumped is the verb." },
          /* Q2 -- stage 1 */
          { stage: 0,
            sentence: { words: ["Our", "baseball", "team", "practices", "before", "the", "Saturday", "games."] },
            question: "Which word tells what happens?",
            choices: [
              { text: "Saturday", feedback: "Saturday tells when the games happen. Look again for the word that tells what the team does." },
              { text: "team", feedback: "team names who does the action. Look again for the word that tells what the team does." },
              { text: "games", feedback: "games names the things the team gets ready for. It ends in -s, but an ending is only a clue. Look again for the word that tells what happens." },
              { text: "practices", correct: true, feedback: "Nice thinking! practices is the verb because it tells what the team does." }
            ],
            clue: "Remember: ask yourself, What is happening?",
            reveal: "Let's find it together. practices tells what the team does, so practices is the verb." },
          /* Q3 -- stage 1 */
          { stage: 0,
            sentence: { words: ["The", "brown", "rabbit", "hopped", "across", "the", "grassy", "field."] },
            question: "Which word tells what happened?",
            choices: [
              { text: "brown", feedback: "brown tells what colour the rabbit is. It describes the rabbit. Look again for the word that tells what happened." },
              { text: "rabbit", feedback: "rabbit names who did the action. Look again for the word that tells what the rabbit did." },
              { text: "hopped", correct: true, feedback: "Nice thinking! hopped is the verb because it tells what the rabbit did." },
              { text: "field", feedback: "field names a place in the sentence. Look again for the word that tells what happened." }
            ],
            clue: "Remember: ask yourself, What happened?",
            reveal: "Let's find it together. hopped tells what the rabbit did, so hopped is the verb." },
          /* Q4 -- stage 1 */
          { stage: 0,
            sentence: { words: ["Maya", "opens", "her", "colorful", "notebook", "during", "science", "class."] },
            question: "Which word tells what happens?",
            choices: [
              { text: "Maya", feedback: "Maya names who does the action. Look again for the word that tells what Maya does." },
              { text: "colorful", feedback: "colorful tells what kind of notebook it is. It describes the notebook. Look again for the word that tells what happens." },
              { text: "opens", correct: true, feedback: "Nice thinking! opens is the verb because it tells what Maya does." },
              { text: "notebook", feedback: "notebook names a thing in the sentence. Look again for the word that tells what happens." }
            ],
            clue: "Remember: ask yourself, What is happening?",
            reveal: "Let's find it together. opens tells what Maya does, so opens is the verb." },
          /* Q5 BEING -- stage 1 */
          { stage: 0,
            sentence: { words: ["The", "friendly", "puppy", "is", "happy", "in", "its", "new", "home."] },
            question: "Which word is the verb in this sentence?",
            choices: [
              { text: "puppy", feedback: "puppy names who we are talking about. A verb can tell what someone does OR what someone is. Look again for the word that tells what the puppy is." },
              { text: "is", correct: true, feedback: "Nice thinking! is is the verb because it tells what the puppy is." },
              { text: "happy", feedback: "happy tells how the puppy feels. It describes the puppy. Look again for the word that tells what the puppy is." },
              { text: "home", feedback: "home names a place. Look again for the word that tells what the puppy is." }
            ],
            clue: "Remember: a verb can also tell what someone or something is.",
            reveal: "Let's find it together. is tells what the puppy is, so is is the verb." },
          /* Q6 -- stage 2 */
          { stage: 1,
            sentence: { words: ["The", "talented", "pitcher", "threw", "the", "baseball", "toward", "home", "plate."] },
            question: "Which word tells what happened?",
            choices: [
              { text: "talented", feedback: "talented tells what kind of pitcher he is. It describes the pitcher, even though it ends in -ed. An ending is only a clue. Look again for the word that tells what happened." },
              { text: "pitcher", feedback: "pitcher names who did the action. Look again for the word that tells what the pitcher did." },
              { text: "threw", correct: true, feedback: "Nice thinking! threw is the verb because it tells what the pitcher did." },
              { text: "baseball", feedback: "baseball names the thing that was thrown. Look again for the word that tells what happened." }
            ],
            clue: "Remember: ask yourself, What happened?",
            reveal: "Let's find it together. threw tells what the pitcher did, so threw is the verb." },
          /* Q7 -- stage 2 */
          { stage: 1,
            sentence: { words: ["Several", "noisy", "birds", "gather", "beside", "the", "school", "playground."] },
            question: "Which word tells what happens?",
            choices: [
              { text: "noisy", feedback: "noisy tells what kind of birds they are. It describes the birds. Look again for the word that tells what happens." },
              { text: "birds", feedback: "birds names who does the action. It ends in -s, but an ending is only a clue. Look again for the word that tells what the birds do." },
              { text: "gather", correct: true, feedback: "Nice thinking! gather is the verb because it tells what the birds do." },
              { text: "playground", feedback: "playground names a place. Look again for the word that tells what happens." }
            ],
            clue: "Remember: ask yourself, What is happening?",
            reveal: "Let's find it together. gather tells what the birds do, so gather is the verb." },
          /* Q8 BEING -- stage 2 */
          { stage: 1,
            sentence: { words: ["The", "long", "hallways", "are", "quiet", "after", "the", "final", "bell."] },
            question: "Which word is the verb in this sentence?",
            choices: [
              { text: "hallways", feedback: "hallways names the places we are talking about. It ends in -s, but an ending is only a clue. Look again for the word that tells what the hallways are." },
              { text: "are", correct: true, feedback: "Nice thinking! are is the verb because it tells what the hallways are." },
              { text: "quiet", feedback: "quiet tells how the hallways sound. It describes the hallways. Look again for the word that tells what the hallways are." },
              { text: "bell", feedback: "bell names a thing in the sentence. Look again for the word that tells what the hallways are." }
            ],
            clue: "Remember: a verb can also tell what someone or something is.",
            reveal: "Let's find it together. are tells what the hallways are, so are is the verb." },
          /* Q9 -- stage 2 */
          { stage: 1,
            sentence: { words: ["Jordan", "packed", "his", "clean", "uniform", "before", "soccer", "practice."] },
            question: "Which word tells what happened?",
            choices: [
              { text: "packed", correct: true, feedback: "Nice thinking! packed is the verb because it tells what Jordan did." },
              { text: "clean", feedback: "clean tells what kind of uniform it is. It describes the uniform. Look again for the word that tells what happened." },
              { text: "uniform", feedback: "uniform names a thing in the sentence. Look again for the word that tells what happened." },
              { text: "practice", feedback: "practice names an event here, not something that happened. The same word can be a verb in another sentence, so always read the whole sentence. Look again for the word that tells what Jordan did." }
            ],
            clue: "Remember: ask yourself, What happened?",
            reveal: "Let's find it together. packed tells what Jordan did, so packed is the verb." },
          /* Q10 -- stage 2 */
          { stage: 1,
            sentence: { words: ["The", "young", "artist", "paints", "a", "colorful", "picture", "for", "the", "hallway."] },
            question: "Which word tells what happens?",
            choices: [
              { text: "young", feedback: "young tells what kind of artist she is. It describes the artist. Look again for the word that tells what happens." },
              { text: "artist", feedback: "artist names who does the action. Look again for the word that tells what the artist does." },
              { text: "paints", correct: true, feedback: "Nice thinking! paints is the verb because it tells what the artist does." },
              { text: "picture", feedback: "picture names the thing being made. Look again for the word that tells what happens." }
            ],
            clue: "Remember: ask yourself, What is happening?",
            reveal: "Let's find it together. paints tells what the artist does, so paints is the verb." },
          /* Q11 -- stage 3 */
          { stage: 2,
            sentence: { words: ["After", "lunch,", "the", "students", "carried", "their", "projects", "into", "the", "classroom."] },
            question: "Which word tells what happened?",
            choices: [
              { text: "students", feedback: "students names who did the action. It ends in -s, but an ending is only a clue. Look again for the word that tells what the students did." },
              { text: "carried", correct: true, feedback: "Nice thinking! carried is the verb because it tells what the students did." },
              { text: "projects", feedback: "projects names the things the students moved. It ends in -s, but an ending is only a clue. Look again for the word that tells what happened." },
              { text: "classroom", feedback: "classroom names a place. Look again for the word that tells what happened." }
            ],
            clue: "Remember: ask yourself, What happened?",
            reveal: "Let's find it together. carried tells what the students did, so carried is the verb." },
          /* Q12 -- stage 3 */
          { stage: 2,
            sentence: { words: ["Near", "the", "fence,", "a", "curious", "squirrel", "climbed", "the", "tall", "oak", "tree."] },
            question: "Which word tells what happened?",
            choices: [
              { text: "curious", feedback: "curious tells what kind of squirrel it is. It describes the squirrel. Look again for the word that tells what happened." },
              { text: "squirrel", feedback: "squirrel names who did the action. Look again for the word that tells what the squirrel did." },
              { text: "climbed", correct: true, feedback: "Nice thinking! climbed is the verb because it tells what the squirrel did." },
              { text: "tree", feedback: "tree names the thing that was climbed. Look again for the word that tells what happened." }
            ],
            clue: "Remember: ask yourself, What happened?",
            reveal: "Let's find it together. climbed tells what the squirrel did, so climbed is the verb." },
          /* Q13 -- stage 3 */
          { stage: 2,
            sentence: { words: ["During", "practice,", "the", "catcher", "blocked", "the", "bouncing", "baseball."] },
            question: "Which word tells what happened?",
            choices: [
              { text: "practice", feedback: "practice tells when this happened. It names an event, not an action. The same word can be a verb in another sentence. Look again for the word that tells what the catcher did." },
              { text: "catcher", feedback: "catcher names who did the action. Look again for the word that tells what the catcher did." },
              { text: "blocked", correct: true, feedback: "Nice thinking! blocked is the verb because it tells what the catcher did." },
              { text: "bouncing", feedback: "bouncing describes the baseball. It ends in -ing, but an ending is only a clue. Look again for the word that tells what the catcher did." }
            ],
            clue: "Remember: ask yourself, What happened?",
            reveal: "Let's find it together. blocked tells what the catcher did, so blocked is the verb." },
          /* Q14 BEING -- stage 3 */
          { stage: 2,
            sentence: { words: ["After", "the", "storm,", "the", "wide", "fields", "were", "full", "of", "water."] },
            question: "Which word is the verb in this sentence?",
            choices: [
              { text: "storm", feedback: "storm names what happened before this. Look again for the word that tells what the fields were." },
              { text: "fields", feedback: "fields names the places we are talking about. It ends in -s, but an ending is only a clue. Look again for the word that tells what the fields were." },
              { text: "were", correct: true, feedback: "Nice thinking! were is the verb because it tells what the fields were." },
              { text: "full", feedback: "full tells how much water the fields held. It describes the fields. Look again for the word that tells what the fields were." }
            ],
            clue: "Remember: a verb can also tell what someone or something is.",
            reveal: "Let's find it together. were tells what the fields were, so were is the verb." },
          /* Q15 -- stage 3 */
          { stage: 2,
            sentence: { words: ["On", "Friday,", "our", "class", "visited", "the", "local", "science", "museum."] },
            question: "Which word tells what happened?",
            choices: [
              { text: "class", feedback: "class names who did the action. It ends in -s, but an ending is only a clue. Look again for the word that tells what the class did." },
              { text: "visited", correct: true, feedback: "Nice thinking! visited is the verb because it tells what the class did." },
              { text: "local", feedback: "local tells what kind of museum it is. It describes the museum. Look again for the word that tells what happened." },
              { text: "museum", feedback: "museum names the place that was visited. Look again for the word that tells what happened." }
            ],
            clue: "Remember: ask yourself, What happened?",
            reveal: "Let's find it together. visited tells what the class did, so visited is the verb." },
          /* Q16 BEING -- stage 4 */
          { stage: 3,
            sentence: { words: ["The", "whole", "classroom", "was", "quiet", "after", "the", "long", "morning", "announcements."] },
            question: "Which word is the verb in this sentence?",
            choices: [
              { text: "classroom", feedback: "classroom names a place. A verb can tell what something does OR what something is. Look again for the word that tells what the classroom was." },
              { text: "was", correct: true, feedback: "Nice thinking! was is the verb because it tells what the classroom was." },
              { text: "quiet", feedback: "quiet tells how the classroom sounded. It describes the classroom. Look again for the word that tells what the classroom was." },
              { text: "announcements", feedback: "announcements names things that happened earlier. It ends in -s, but an ending is only a clue. Look again for the word that tells what the classroom was." }
            ],
            clue: "Remember: a verb can also tell what someone or something is.",
            reveal: "Let's find it together. was tells what the classroom was, so was is the verb." },
          /* Q17 wording fixed -- stage 4 */
          { stage: 3,
            sentence: { words: ["The", "muddy", "shoes", "rested", "beside", "the", "back", "door", "all", "afternoon."] },
            question: "Which word tells what happened?",
            choices: [
              { text: "shoes", feedback: "shoes names the things we are talking about. It ends in -s, but an ending is only a clue. Look again for the word that tells what the shoes did." },
              { text: "muddy", feedback: "muddy tells what kind of shoes they are. It describes the shoes. Look again for the word that tells what happened." },
              { text: "rested", correct: true, feedback: "Nice thinking! rested is the verb because it tells what the shoes did." },
              { text: "afternoon", feedback: "afternoon tells when this happened. Look again for the word that tells what happened." }
            ],
            clue: "Remember: ask yourself, What happened?",
            reveal: "Let's find it together. rested tells what the shoes did, so rested is the verb." },
          /* Q18 BEING -- stage 4 */
          { stage: 3,
            sentence: { words: ["Those", "tall", "glass", "buildings", "are", "visible", "from", "the", "new", "highway."] },
            question: "Which word is the verb in this sentence?",
            choices: [
              { text: "tall", feedback: "tall tells what kind of buildings they are. It describes the buildings. Look again for the word that tells what the buildings are." },
              { text: "buildings", feedback: "buildings names the things we are talking about. It ends in -s, but an ending is only a clue. Look again for the word that tells what the buildings are." },
              { text: "are", correct: true, feedback: "Nice thinking! are is the verb because it tells what the buildings are." },
              { text: "highway", feedback: "highway names a place. Look again for the word that tells what the buildings are." }
            ],
            clue: "Remember: a verb can also tell what someone or something is.",
            reveal: "Let's find it together. are tells what the buildings are, so are is the verb." },
          /* Q19 BEING am -- stage 4 */
          { stage: 3,
            sentence: { words: ["I", "am", "always", "ready", "for", "the", "spelling", "test", "on", "Friday", "morning."] },
            question: "Which word is the verb in this sentence?",
            choices: [
              { text: "ready", feedback: "ready tells how I feel about the test. It describes me. Look again for the word that tells what I am." },
              { text: "am", correct: true, feedback: "Nice thinking! am is the verb because it tells what I am." },
              { text: "spelling", feedback: "spelling tells what kind of test it is. It ends in -ing, but an ending is only a clue. Look again for the word that tells what I am." },
              { text: "test", feedback: "test names the thing on Friday. Look again for the word that tells what I am." }
            ],
            clue: "Remember: a verb can also tell what someone or something is.",
            reveal: "Let's find it together. am tells what I am, so am is the verb." },
          /* Q20 -- stage 4 */
          { stage: 3,
            sentence: { words: ["During", "family", "reading", "night,", "our", "library", "welcomed", "many", "new", "visitors."] },
            question: "Which word tells what happened?",
            choices: [
              { text: "reading", feedback: "reading tells what kind of night it was. It ends in -ing, but an ending is only a clue. Look again for the word that tells what happened." },
              { text: "library", feedback: "library names who did the welcoming. Look again for the word that tells what the library did." },
              { text: "welcomed", correct: true, feedback: "Nice thinking! welcomed is the verb because it tells what the library did." },
              { text: "visitors", feedback: "visitors names the people who came. It ends in -s, but an ending is only a clue. Look again for the word that tells what happened." }
            ],
            clue: "Remember: ask yourself, What happened?",
            reveal: "Let's find it together. welcomed tells what the library did, so welcomed is the verb." }
        ]
      },


      /* =====================================================
         VERB TEST POOL -- 48 curated questions, 32 action / 16 being.

         PHASE 1. The Test no longer reshuffles a fixed set of 12; it
         SAMPLES a balanced assessment from this pool, so repeated
         sittings measure verbs rather than memory of the test.

         This bank is the EDUCATIONAL SOURCE OF TRUTH. Sentences,
         choices, answers, tags and `why` lines are owner-supplied and
         approved as a unit. Do not reword, improve or extend them
         while editing engine code.

         Test MEASURES. It gives no hint, no retry, no clue and no
         correctness feedback until the child submits. Each question
         therefore carries no per-choice coaching -- only `why`, which
         the results review shows AFTER submission and nowhere else.

         `band` is 1 | 2 | 3 and drives both sampling and order:
         questions are drawn per band and shuffled WITHIN a band, never
         across, so every sitting runs easy -> medium -> hard.

         `type` drives the two subscales. A strong action score must
         not hide weak being-verb understanding, so mastery needs all
         three thresholds, not just the overall one.

         `beingForm` is null for action questions and am|is|are|was|were
         for being questions. `tags` name the concepts a question
         exercises, so sampling can avoid a concept-poor test.
         ===================================================== */
      testPool: {
        /* {n} is replaced with the chosen question count. */
        intro: "{n} questions. No hints this time \u2014 you've got this.",
        confirm: "You answered all {n}. Ready to see how you did?",

        /* CHILD-FACING lengths. 40 is implemented, harnessed and
           audited, but stays out of this list until the pool reaches
           ~80 questions: at 48 a 40-question sitting is 83% of the
           pool and every Band-1 being question appears every time. */
        sizes: [12, 20, 30],
        sizesBuilt: [12, 20, 30, 40],

        /* Thresholds are RATIOS so they scale with the chosen length.
           [5,6] = 83.3% overall, [7,8] = 87.5% action, [3,4] = 75%
           being -- the Build 1.4.0 standard, which at 12 questions
           still resolves to exactly 10/12, 7/8 and 3/4. */
        masteryRatio: {
          overall: [5, 6],
          action:  [7, 8],
          being:   [3, 4],
          almost:  [2, 3]
        },

        /* Wording is CONTENT, never engine strings. */
        guidance: {
          mastered:  "You've got verbs. You found the verb in almost every sentence.",
          beingWeak: "Your action verbs are strong. Review being verbs, then try again.",
          actionWeak:"You know being verbs well. Review action verbs, then try again.",
          almost:    "Almost there. You know verbs well \u2014 a few tricky ones to go.",
          keepGoing: "Keep going. Review Learn, then try Practice again."
        },

        questions: [
          /* ---------- BAND 1 -- confidence ---------- */
          { id: "V001", band: 1, type: "action", beingForm: null,
            tags: ["action", "straightforward", "suffix-ed-answer"],
            sentence: { words: ["The", "farmer", "planted", "corn", "in", "the", "wide", "field."] },
            question: "Which word tells what happened?",
            choices: [
              { text: "farmer" },
              { text: "planted", correct: true },
              { text: "corn" },
              { text: "field" }
            ],
            why: "planted tells what the farmer did. It is the action verb." },
          { id: "V002", band: 1, type: "being", beingForm: "is",
            tags: ["being", "straightforward"],
            sentence: { words: ["My", "new", "library", "book", "is", "funny."] },
            question: "Which word is the verb in this sentence?",
            choices: [
              { text: "new" },
              { text: "book" },
              { text: "is", correct: true },
              { text: "funny" }
            ],
            why: "is tells what the book is. funny describes the book." },
          { id: "V003", band: 1, type: "action", beingForm: null,
            tags: ["action", "suffix-s-answer", "straightforward"],
            sentence: { words: ["Our", "teacher", "reads", "a", "story", "every", "afternoon."] },
            question: "Which word tells what happens?",
            choices: [
              { text: "teacher" },
              { text: "reads", correct: true },
              { text: "story" },
              { text: "afternoon" }
            ],
            why: "reads tells what the teacher does. It is the action verb." },
          { id: "V004", band: 1, type: "being", beingForm: "are",
            tags: ["being", "plural-s-lure"],
            sentence: { words: ["The", "twins", "are", "ready", "for", "school."] },
            question: "Which word is the verb in this sentence?",
            choices: [
              { text: "twins" },
              { text: "are", correct: true },
              { text: "ready" },
              { text: "school" }
            ],
            why: "are tells what the twins are. twins names who the sentence is about." },
          { id: "V005", band: 1, type: "action", beingForm: null,
            tags: ["action", "suffix-ed-answer", "straightforward"],
            sentence: { words: ["The", "brown", "rabbit", "hopped", "across", "the", "grassy", "field."] },
            question: "Which word tells what happened?",
            choices: [
              { text: "brown" },
              { text: "rabbit" },
              { text: "hopped", correct: true },
              { text: "field" }
            ],
            why: "hopped tells what the rabbit did. It is the action verb." },
          { id: "V006", band: 1, type: "action", beingForm: null,
            tags: ["action", "suffix-s-answer", "straightforward"],
            sentence: { words: ["Maya", "opens", "her", "colorful", "notebook", "during", "science", "class."] },
            question: "Which word tells what happens?",
            choices: [
              { text: "Maya" },
              { text: "colorful" },
              { text: "opens", correct: true },
              { text: "notebook" }
            ],
            why: "opens tells what Maya does. It is the action verb." },
          { id: "V007", band: 1, type: "being", beingForm: "was",
            tags: ["being", "straightforward"],
            sentence: { words: ["The", "lunchbox", "was", "empty", "after", "recess."] },
            question: "Which word is the verb in this sentence?",
            choices: [
              { text: "lunchbox" },
              { text: "was", correct: true },
              { text: "empty" },
              { text: "recess" }
            ],
            why: "was tells what the lunchbox was. empty describes the lunchbox." },
          { id: "V008", band: 1, type: "action", beingForm: null,
            tags: ["action", "plural-s-lure"],
            sentence: { words: ["Several", "birds", "gather", "near", "the", "feeder", "each", "morning."] },
            question: "Which word tells what happens?",
            choices: [
              { text: "birds" },
              { text: "gather", correct: true },
              { text: "feeder" },
              { text: "morning" }
            ],
            why: "gather tells what the birds do. birds names who is doing the action." },
          { id: "V009", band: 1, type: "action", beingForm: null,
            tags: ["action", "suffix-ed-answer", "straightforward"],
            sentence: { words: ["My", "sister", "packed", "her", "bag", "before", "school."] },
            question: "Which word tells what happened?",
            choices: [
              { text: "sister" },
              { text: "packed", correct: true },
              { text: "bag" },
              { text: "school" }
            ],
            why: "packed tells what the sister did. It is the action verb." },
          { id: "V010", band: 1, type: "being", beingForm: "am",
            tags: ["being", "straightforward"],
            sentence: { words: ["I", "am", "ready", "for", "math", "class."] },
            question: "Which word is the verb in this sentence?",
            choices: [
              { text: "I" },
              { text: "am", correct: true },
              { text: "ready" },
              { text: "class" }
            ],
            why: "am tells what I am. ready describes how I am." },
          { id: "V011", band: 1, type: "action", beingForm: null,
            tags: ["action", "suffix-s-answer", "noun-verb-double-duty-lure"],
            sentence: { words: ["The", "coach", "throws", "the", "ball", "during", "practice."] },
            question: "Which word tells what happens?",
            choices: [
              { text: "coach" },
              { text: "throws", correct: true },
              { text: "ball" },
              { text: "practice" }
            ],
            why: "throws tells what the coach does. practice is a thing in this sentence, not the action." },
          { id: "V012", band: 1, type: "action", beingForm: null,
            tags: ["action", "suffix-ed-answer", "straightforward"],
            sentence: { words: ["The", "small", "dog", "barked", "at", "the", "mail", "truck."] },
            question: "Which word tells what happened?",
            choices: [
              { text: "dog" },
              { text: "barked", correct: true },
              { text: "mail" },
              { text: "truck" }
            ],
            why: "barked tells what the dog did. It is the action verb." },
          { id: "V013", band: 1, type: "being", beingForm: "is",
            tags: ["being", "straightforward"],
            sentence: { words: ["The", "hallway", "is", "quiet", "before", "the", "first", "bell."] },
            question: "Which word is the verb in this sentence?",
            choices: [
              { text: "hallway" },
              { text: "is", correct: true },
              { text: "quiet" },
              { text: "bell" }
            ],
            why: "is tells what the hallway is. quiet describes the hallway." },
          { id: "V014", band: 1, type: "action", beingForm: null,
            tags: ["action", "plural-s-lure"],
            sentence: { words: ["The", "students", "carry", "books", "to", "the", "library."] },
            question: "Which word tells what happens?",
            choices: [
              { text: "students" },
              { text: "carry", correct: true },
              { text: "books" },
              { text: "library" }
            ],
            why: "carry tells what the students do. students and books are naming words, not the action." },
          { id: "V015", band: 1, type: "action", beingForm: null,
            tags: ["action", "suffix-ed-answer", "straightforward"],
            sentence: { words: ["The", "turtle", "crawled", "across", "the", "warm", "rock."] },
            question: "Which word tells what happened?",
            choices: [
              { text: "turtle" },
              { text: "crawled", correct: true },
              { text: "warm" },
              { text: "rock" }
            ],
            why: "crawled tells what the turtle did. It is the action verb." },
          { id: "V016", band: 1, type: "action", beingForm: null,
            tags: ["action", "suffix-ed-answer", "plural-s-lure"],
            sentence: { words: ["The", "students", "stacked", "their", "folders", "beside", "the", "blue", "bin."] },
            question: "Which word tells what happened?",
            choices: [
              { text: "students" },
              { text: "stacked", correct: true },
              { text: "folders" },
              { text: "bin" }
            ],
            why: "stacked tells what the students did. students and folders name people or things." },

          /* ---------- BAND 2 -- look closer ---------- */
          { id: "V017", band: 2, type: "action", beingForm: null,
            tags: ["action", "suffix-ed-answer", "suffix-ing-lure"],
            sentence: { words: ["The", "cheering", "crowd", "clapped", "for", "the", "winning", "team."] },
            question: "Which word tells what happened?",
            choices: [
              { text: "cheering" },
              { text: "crowd" },
              { text: "clapped", correct: true },
              { text: "winning" }
            ],
            why: "clapped tells what the crowd did. cheering and winning describe people in this sentence." },
          { id: "V018", band: 2, type: "being", beingForm: "was",
            tags: ["being", "plural-s-lure", "noun-verb-double-duty-lure"],
            sentence: { words: ["The", "park", "was", "empty", "after", "the", "heavy", "rains."] },
            question: "Which word is the verb in this sentence?",
            choices: [
              { text: "park" },
              { text: "was", correct: true },
              { text: "empty" },
              { text: "rains" }
            ],
            why: "was tells what the park was. rains names something and is not the verb in this sentence." },
          { id: "V019", band: 2, type: "action", beingForm: null,
            tags: ["action", "noun-verb-double-duty-answer"],
            sentence: { words: ["The", "children", "watch", "the", "sunset", "from", "the", "porch."] },
            question: "Which word tells what happens?",
            choices: [
              { text: "children" },
              { text: "watch", correct: true },
              { text: "sunset" },
              { text: "porch" }
            ],
            why: "watch tells what the children do. In this sentence, watch is the action verb." },
          { id: "V020", band: 2, type: "action", beingForm: null,
            tags: ["action", "suffix-ed-answer", "suffix-ed-lure", "plural-s-lure"],
            sentence: { words: ["The", "striped", "cat", "chased", "two", "birds", "across", "the", "yard."] },
            question: "Which word tells what happened?",
            choices: [
              { text: "striped" },
              { text: "cat" },
              { text: "chased", correct: true },
              { text: "birds" }
            ],
            why: "chased tells what the cat did. striped describes the cat, and birds names what was chased." },
          { id: "V021", band: 2, type: "action", beingForm: null,
            tags: ["action", "suffix-ed-answer", "noun-verb-double-duty-lure"],
            sentence: { words: ["Jordan", "packed", "his", "clean", "uniform", "before", "soccer", "practice."] },
            question: "Which word tells what happened?",
            choices: [
              { text: "packed", correct: true },
              { text: "clean" },
              { text: "uniform" },
              { text: "practice" }
            ],
            why: "packed tells what Jordan did. practice is a thing in this sentence, not the action." },
          { id: "V022", band: 2, type: "being", beingForm: "are",
            tags: ["being", "plural-s-lure"],
            sentence: { words: ["The", "long", "hallways", "are", "quiet", "after", "the", "final", "bell."] },
            question: "Which word is the verb in this sentence?",
            choices: [
              { text: "hallways" },
              { text: "are", correct: true },
              { text: "quiet" },
              { text: "bell" }
            ],
            why: "are tells what the hallways are. quiet describes the hallways." },
          { id: "V023", band: 2, type: "action", beingForm: null,
            tags: ["action", "suffix-s-answer"],
            sentence: { words: ["The", "young", "artist", "paints", "a", "colorful", "picture", "for", "the", "hallway."] },
            question: "Which word tells what happens?",
            choices: [
              { text: "young" },
              { text: "artist" },
              { text: "paints", correct: true },
              { text: "picture" }
            ],
            why: "paints tells what the artist does. It is the action verb." },
          { id: "V024", band: 2, type: "action", beingForm: null,
            tags: ["action", "plural-s-lure"],
            sentence: { words: ["Several", "noisy", "birds", "gather", "beside", "the", "school", "playground."] },
            question: "Which word tells what happens?",
            choices: [
              { text: "noisy" },
              { text: "birds" },
              { text: "gather", correct: true },
              { text: "playground" }
            ],
            why: "gather tells what the birds do. birds names who is doing the action." },
          { id: "V025", band: 2, type: "being", beingForm: "is",
            tags: ["being"],
            sentence: { words: ["The", "proud", "captain", "is", "ready", "for", "the", "final", "game."] },
            question: "Which word is the verb in this sentence?",
            choices: [
              { text: "captain" },
              { text: "is", correct: true },
              { text: "ready" },
              { text: "game" }
            ],
            why: "is tells what the captain is. ready describes the captain." },
          { id: "V026", band: 2, type: "action", beingForm: null,
            tags: ["action", "suffix-ed-answer", "suffix-ing-lure", "plural-s-lure"],
            sentence: { words: ["The", "gardener", "watered", "the", "flowering", "plants", "before", "sunset."] },
            question: "Which word tells what happened?",
            choices: [
              { text: "gardener" },
              { text: "watered", correct: true },
              { text: "flowering" },
              { text: "plants" }
            ],
            why: "watered tells what the gardener did. flowering describes the plants." },
          { id: "V027", band: 2, type: "action", beingForm: null,
            tags: ["action", "suffix-s-answer"],
            sentence: { words: ["Our", "class", "visits", "the", "science", "museum", "each", "spring."] },
            question: "Which word tells what happens?",
            choices: [
              { text: "class" },
              { text: "visits", correct: true },
              { text: "museum" },
              { text: "spring" }
            ],
            why: "visits tells what the class does. It is the action verb." },
          { id: "V028", band: 2, type: "action", beingForm: null,
            tags: ["action", "suffix-s-answer"],
            sentence: { words: ["The", "baker", "mixes", "the", "batter", "in", "a", "large", "bowl."] },
            question: "Which word tells what happens?",
            choices: [
              { text: "baker" },
              { text: "mixes", correct: true },
              { text: "batter" },
              { text: "bowl" }
            ],
            why: "mixes tells what the baker does. It is the action verb." },
          { id: "V029", band: 2, type: "being", beingForm: "was",
            tags: ["being"],
            sentence: { words: ["The", "backpack", "was", "full", "after", "the", "field", "trip."] },
            question: "Which word is the verb in this sentence?",
            choices: [
              { text: "backpack" },
              { text: "was", correct: true },
              { text: "full" },
              { text: "trip" }
            ],
            why: "was tells what the backpack was. full describes the backpack." },
          { id: "V030", band: 2, type: "action", beingForm: null,
            tags: ["action", "plural-s-lure", "noun-verb-double-duty-answer"],
            sentence: { words: ["My", "cousins", "play", "cards", "after", "dinner."] },
            question: "Which word tells what happens?",
            choices: [
              { text: "cousins" },
              { text: "play", correct: true },
              { text: "cards" },
              { text: "dinner" }
            ],
            why: "play tells what the cousins do. In this sentence, play is the action verb." },
          { id: "V031", band: 2, type: "action", beingForm: null,
            tags: ["action", "suffix-ed-answer", "plural-s-lure"],
            sentence: { words: ["The", "soccer", "players", "kicked", "the", "muddy", "ball", "across", "the", "field."] },
            question: "Which word tells what happened?",
            choices: [
              { text: "players" },
              { text: "kicked", correct: true },
              { text: "muddy" },
              { text: "field" }
            ],
            why: "kicked tells what the players did. players names who did the action." },
          { id: "V032", band: 2, type: "being", beingForm: "are",
            tags: ["being", "plural-s-lure"],
            sentence: { words: ["Those", "windows", "are", "clean", "after", "the", "storm."] },
            question: "Which word is the verb in this sentence?",
            choices: [
              { text: "windows" },
              { text: "are", correct: true },
              { text: "clean" },
              { text: "storm" }
            ],
            why: "are tells what the windows are. clean describes the windows." },

          /* ---------- BAND 3 -- strongest reasoning ---------- */
          { id: "V033", band: 3, type: "action", beingForm: null,
            tags: ["action", "suffix-ed-answer", "plural-s-lure", "noun-verb-double-duty-lure"],
            sentence: { words: ["At", "the", "campsite,", "the", "campers", "planned", "their", "next", "hike."] },
            question: "Which word tells what happened?",
            choices: [
              { text: "campers" },
              { text: "planned", correct: true },
              { text: "campsite" },
              { text: "hike" }
            ],
            why: "planned tells what the campers did. hike is a thing in this sentence, not the action." },
          { id: "V034", band: 3, type: "being", beingForm: "were",
            tags: ["being", "plural-s-lure", "suffix-ing-lure"],
            sentence: { words: ["The", "gardeners", "were", "proud", "of", "their", "growing", "vegetables."] },
            question: "Which word is the verb in this sentence?",
            choices: [
              { text: "gardeners" },
              { text: "were", correct: true },
              { text: "proud" },
              { text: "growing" }
            ],
            why: "were tells what the gardeners were. growing describes the vegetables." },
          { id: "V035", band: 3, type: "action", beingForm: null,
            tags: ["action", "noun-verb-double-duty-answer", "plural-s-lure", "suffix-ing-lure"],
            sentence: { words: ["After", "the", "bell,", "the", "students", "study", "their", "spelling", "words."] },
            question: "Which word tells what happens?",
            choices: [
              { text: "students" },
              { text: "study", correct: true },
              { text: "spelling" },
              { text: "words" }
            ],
            why: "study tells what the students do. spelling describes the words in this sentence." },
          { id: "V036", band: 3, type: "action", beingForm: null,
            tags: ["action", "suffix-ed-answer", "suffix-ing-lure", "plural-s-lure"],
            sentence: { words: ["The", "old", "lighthouse", "on", "the", "rocky", "cliffs", "guided", "the", "passing", "ships."] },
            question: "Which word tells what happened?",
            choices: [
              { text: "cliffs" },
              { text: "guided", correct: true },
              { text: "passing" },
              { text: "ships" }
            ],
            why: "guided tells what the lighthouse did. passing describes the ships." },
          { id: "V037", band: 3, type: "action", beingForm: null,
            tags: ["action", "noun-verb-double-duty-lure", "suffix-ed-answer", "suffix-ing-lure"],
            sentence: { words: ["During", "practice,", "the", "catcher", "blocked", "the", "bouncing", "baseball."] },
            question: "Which word tells what happened?",
            choices: [
              { text: "practice" },
              { text: "catcher" },
              { text: "blocked", correct: true },
              { text: "bouncing" }
            ],
            why: "blocked tells what the catcher did. practice is a thing here, and bouncing describes the baseball." },
          { id: "V038", band: 3, type: "being", beingForm: "was",
            tags: ["being", "plural-s-lure"],
            sentence: { words: ["The", "classroom", "was", "quiet", "during", "the", "long", "announcements."] },
            question: "Which word is the verb in this sentence?",
            choices: [
              { text: "classroom" },
              { text: "was", correct: true },
              { text: "quiet" },
              { text: "announcements" }
            ],
            why: "was tells what the classroom was. quiet describes the classroom." },
          { id: "V039", band: 3, type: "action", beingForm: null,
            tags: ["action", "suffix-ed-answer"],
            sentence: { words: ["Near", "the", "fence,", "a", "curious", "squirrel", "climbed", "the", "tall", "oak", "tree."] },
            question: "Which word tells what happened?",
            choices: [
              { text: "curious" },
              { text: "squirrel" },
              { text: "climbed", correct: true },
              { text: "tree" }
            ],
            why: "climbed tells what the squirrel did. It is the action verb." },
          { id: "V040", band: 3, type: "being", beingForm: "are",
            tags: ["being", "plural-s-lure"],
            sentence: { words: ["The", "science", "club", "members", "are", "ready", "for", "the", "regional", "fair."] },
            question: "Which word is the verb in this sentence?",
            choices: [
              { text: "members" },
              { text: "are", correct: true },
              { text: "ready" },
              { text: "fair" }
            ],
            why: "are tells what the club members are. ready describes the members." },
          { id: "V041", band: 3, type: "action", beingForm: null,
            tags: ["action", "suffix-ed-answer", "suffix-ing-lure", "plural-s-lure"],
            sentence: { words: ["Before", "sunrise,", "the", "hikers", "packed", "their", "sleeping", "bags."] },
            question: "Which word tells what happened?",
            choices: [
              { text: "hikers" },
              { text: "packed", correct: true },
              { text: "sleeping" },
              { text: "bags" }
            ],
            why: "packed tells what the hikers did. sleeping describes the bags." },
          { id: "V042", band: 3, type: "being", beingForm: "is",
            tags: ["being", "plural-s-lure"],
            sentence: { words: ["Our", "team", "captain", "is", "proud", "of", "the", "players."] },
            question: "Which word is the verb in this sentence?",
            choices: [
              { text: "captain" },
              { text: "is", correct: true },
              { text: "proud" },
              { text: "players" }
            ],
            why: "is tells what the captain is. proud describes the captain." },
          { id: "V043", band: 3, type: "action", beingForm: null,
            tags: ["action", "suffix-ed-lure", "suffix-ed-answer", "plural-s-lure"],
            sentence: { words: ["The", "painted", "signs", "pointed", "visitors", "toward", "the", "entrance."] },
            question: "Which word tells what happened?",
            choices: [
              { text: "painted" },
              { text: "signs" },
              { text: "pointed", correct: true },
              { text: "visitors" }
            ],
            why: "pointed tells what the signs did. painted describes the signs." },
          { id: "V044", band: 3, type: "action", beingForm: null,
            tags: ["action", "noun-verb-double-duty-answer", "plural-s-lure"],
            sentence: { words: ["During", "music", "class,", "the", "students", "practice", "their", "scales", "quietly."] },
            question: "Which word tells what happens?",
            choices: [
              { text: "class" },
              { text: "students" },
              { text: "practice", correct: true },
              { text: "scales" }
            ],
            why: "practice tells what the students do. In this sentence, practice is the action verb." },
          { id: "V045", band: 3, type: "being", beingForm: "were",
            tags: ["being", "plural-s-lure"],
            sentence: { words: ["The", "shelves", "were", "full", "of", "library", "books", "after", "the", "delivery."] },
            question: "Which word is the verb in this sentence?",
            choices: [
              { text: "shelves" },
              { text: "were", correct: true },
              { text: "full" },
              { text: "books" }
            ],
            why: "were tells what the shelves were. full describes the shelves." },
          { id: "V046", band: 3, type: "action", beingForm: null,
            tags: ["action", "suffix-ing-lure", "suffix-ed-answer", "plural-s-lure"],
            sentence: { words: ["The", "running", "water", "filled", "the", "campers\u2019", "bottles", "quickly."] },
            question: "Which word tells what happened?",
            choices: [
              { text: "running" },
              { text: "filled", correct: true },
              { text: "campers" },
              { text: "bottles" }
            ],
            why: "filled tells what the water did. running describes the water." },
          { id: "V047", band: 3, type: "being", beingForm: "am",
            tags: ["being", "suffix-ing-lure"],
            sentence: { words: ["I", "am", "ready", "for", "the", "spelling", "challenge", "this", "morning."] },
            question: "Which word is the verb in this sentence?",
            choices: [
              { text: "I" },
              { text: "am", correct: true },
              { text: "ready" },
              { text: "spelling" }
            ],
            why: "am tells what I am. ready describes how I am." },
          { id: "V048", band: 3, type: "action", beingForm: null,
            tags: ["action", "suffix-ing-lure", "suffix-ed-lure", "suffix-ed-answer"],
            sentence: { words: ["The", "marching", "band", "crossed", "the", "crowded", "field", "before", "halftime."] },
            question: "Which word tells what happened?",
            choices: [
              { text: "marching" },
              { text: "crowded" },
              { text: "crossed", correct: true },
              { text: "halftime" }
            ],
            why: "crossed tells what the band did. marching and crowded describe things in the sentence." }
        ]
      },
      recap: "A verb tells what someone or something does or is. Ask: What happened?",

      studyGuide: {
        title: "Verb Study Guide",
        sections: [
          { heading: "What it is", lines: ["A verb tells what someone or something does or is."] },
          { heading: "How to find it", lines: ["Ask: What happened?", "Or ask: What is happening?"] },
          /* Build 1.4.0 cleanup. This panel is OPTIONAL SUPPORT for a child
             who is stuck -- not a second lesson. Three "Clue: verbs ending
             in -s / -ed / -ing" lists were removed: they repeated the chip
             groups shown directly above the panel, and their wording
             predated the action-verb distinction, so they implied those
             endings identify every verb. They do not -- being verbs carry
             none of them.

             What is left is the reference a child cannot work out for
             themselves: which words ARE being verbs. */
          { heading: "Action verbs \u2014 what someone DOES", chips: ["run", "jump", "play", "throw", "catch", "read", "climb", "walk", "write", "talk", "help", "carry"] },
          { heading: "Being verbs \u2014 what someone IS", chips: ["am", "is", "are", "was", "were", "be", "been", "being"] },
          { heading: "Other verbs you will see a lot", chips: ["have", "has", "had", "do", "does", "did"] },
          {
            heading: "See it in a sentence",
            sentence: {
              words: ["The", "player", "kicked", "the", "ball."],
              marks: [{ start: 2, end: 2, kind: "verb", label: "VERB" }]
            }
          },
          {
            /* Build 1.1.1: moved here from the Verb Clue step so the primary
               lesson carries one idea at a time. The teaching is unchanged. */
            heading: "Why an ending is only a clue",
            contrast: {
              heading: "The same word can do two different jobs",
              rows: [
                {
                  sentence: {
                    words: ["The", "workers", "are", "building", "a", "house."],
                    marks: [{ start: 3, end: 3, kind: "verb", label: "TELLS WHAT THEY DO" }]
                  },
                  text: "Here, building tells what the workers are doing."
                },
                {
                  sentence: {
                    words: ["The", "building", "is", "tall."],
                    marks: [{ start: 1, end: 1, kind: "noun", label: "NAMES A THING" }]
                  },
                  text: "Here, building names a thing. The verb is is."
                }
              ],
              close: "Same word, two different jobs. That is why an ending is a clue, not a rule."
            }
          }
        ],
        /* No reminder for Verb. The contrast directly above already closes
           with "Same word, two different jobs. That is why an ending is a
           clue, not a rule." -- a reminder here said the same thing a third
           time, after the heading and the close. renderReference() skips an
           absent reminder. */
      }
    },

    /* ===================================================== */
    /* SUBJECT                                               */
    /* ===================================================== */
    "subject": {
      name: "Subject",
      badge: "who?",
      card: "Find who or what.",
      color: "subject",

      ask: "Who or what?",
      icon: "people",
      /* The Home card highlights the SIMPLE SUBJECT -- one word -- because
         that is what this skill teaches. It previously spanned "The dog",
         which is the complete subject and a different topic. */
      preview: { words: ["The", "dog", "chased", "the", "ball."], start: 1, end: 1 },
      practice: "bank",
      test: "soon",

      definition: {
        title: "What is a subject?",

        /* Build 1.4 Learn architecture, matching Verb's DOES / IS callout.
           The core definition is unchanged -- "the subject tells who or what
           the sentence is about" -- it is simply split across the two keys so
           the idea the child must leave with is the biggest thing on screen
           instead of a line of body text. */
        callout: {
          title: "The subject tells who or what the sentence is about.",
          rows: [
            { key: "WHO",  text: "a person or an animal" },
            { key: "WHAT", text: "a thing or an idea" }
          ]
        },
        note: "The main subject word is called the simple subject.",
        sentence: {
          words: ["The", "player", "kicked", "the", "ball."],
          marks: [{ start: 1, end: 1, kind: "subject", label: "SIMPLE SUBJECT" }]
        }
      },

      clue: {
        title: "A clue for finding the subject",

        /* THE STRATEGY IS THE LESSON, so it is the callout.

           Step 2 says "with the verb", NOT "did it". A verb does not always
           describe an action -- Verb Learn teaches DOES and IS -- so a rule
           built on "did it" collapses the moment the child meets "The soup
           is hot." Asking who or what WITH THE VERB works for both:
             kicked -> Who kicked?   is hot -> What is hot?
             are ready -> Who are ready? */
        callout: {
          title: "Find the subject in three steps:",
          rows: [
            { key: "1", text: "Find the verb." },
            { key: "2", text: "Use the verb to ask: Who? or What?" },
            { key: "3", text: "The answer is the simple subject." }
          ]
        },

        /* The same method on both kinds of verb Verb Learn teaches.
           Without the being-verb line a child can quietly decide the
           subject is whoever DID something, and "The soup is hot."
           breaks that rule the first time he meets it.

           Two list lines, not two chip cards: the cards cost ~250px on a
           phone and pushed Next off the screen. These are SUPPORT for the
           strategy above and must not compete with it. */
        list: [
          "Action verb \u2014 kicked \u2192 Who kicked? \u2192 player",
          "Being verb \u2014 is hot \u2192 What is hot? \u2192 soup"
        ],
        warning: "In many of the sentences we are learning, the subject comes before the verb. Finding the verb first and using it to ask Who? or What? is the stronger way.",
        sentence: {
          words: ["The", "player", "kicked", "the", "ball."],
          marks: [
            { start: 1, end: 1, kind: "subject", label: "WHO KICKED?" },
            { start: 2, end: 2, kind: "verb", label: "VERB" }
          ]
        }
      },

      example: {
        title: "Let's find the subject",
        text: "Use the three steps on this sentence.",
        sentence: {
          words: ["The", "player", "kicked", "the", "ball."],
          marks: [
            { start: 1, end: 1, kind: "subject", label: "SIMPLE SUBJECT" },
            { start: 2, end: 2, kind: "verb", label: "VERB" }
          ]
        },
        /* The same four-beat routine Verb uses: read, ask, answer, name it.
           `routine` renders as an ordered list AFTER the sentence, because
           step 1 is "Read the sentence" and the sentence has to be on screen
           first. This is the Step 2 strategy carried out, not a new one. */
        routine: [
          "Read the sentence.",
          "Find the verb: kicked.",
          "Use the verb to ask: Who kicked? The player.",
          "So player is the simple subject."
        ],

        /* Word TYPE versus sentence JOB. Kept visible in the flow, never
           folded into optional reference material. The small heading uses
           the same quiet label style as READ IT, so it is findable
           without competing with the strategy callout. */
        noteTitle: "Word type vs. sentence job",
        note: "player names a person \u2014 that is its word type. Its job in this sentence is the subject."
      },

      /* LET ME TRY. `learnTry` is the Build 1.4 key for the single guided
         question inside Learn; a future Practice bank is a separate
         `tryItBank` and must not be confused with it (D-33). The question,
         the sentence and every feedback line below are unchanged. */
      learnTry: {
        title: "Let me try",
        sentence: {
          words: ["The", "tall", "teacher", "wrote", "on", "the", "board."]
        },
        question: "The verb is wrote. Ask: Who wrote? Which word is the simple subject?",
        choices: [
          { text: "tall", feedback: "tall describes the teacher. It is not the main subject word. Ask: Who wrote?" },
          { text: "teacher", correct: true, feedback: "Correct! The verb is wrote. Who wrote? The teacher. So teacher is the simple subject." },
          { text: "wrote", feedback: "wrote is the verb. It tells what happened. Now ask: Who wrote?" },
          { text: "board", feedback: "board names a thing, but it is not who did the writing. Ask: Who wrote?" }
        ]
      },

      /* =====================================================
         SUBJECT PRACTICE BANK (Build 1.4.0)

         Owner-designed, owner-approved. 20 questions, four stages
         of five, read by the SHARED engine in js/practice.js. No
         engine change was needed to add it.

         D-33: this is `tryItBank`, the Practice bank. It is NOT
         `learnTry`, the single guided question inside Learn. A topic
         must never carry both under one key.

         D-30: the completion recap belongs to CONTENT. This bank carries
         its own `recap`, so the completion screen speaks about the
         practice just finished instead of repeating Learn's strategy
         line, and Verb's wording can never leak here.

         Question sentences carry NO `marks` on purpose. A subject
         mark would draw the green grammar underline and answer the
         question before the child read it.

         STAGE METADATA NOTE: every stage field below is owner-approved
         wording. Stage 4's milestone fields are
         never rendered -- `advance()` reaches `showDone()` before the
         stage-change branch on the final question -- so the recap
         carries the end-of-bank message.
         ===================================================== */
      tryItBank: {
        /* Practice has its own recap, so the completion screen speaks about
           the practice the child just did rather than repeating the Learn
           strategy line. D-30: this belongs to content, never the engine. */
        recap: "You practiced finding simple subjects in 20 sentences, even when extra words made the subject harder to spot.",
        stages: [
          { name: "Get Started",
            desc: "Find the simple subject in clear sentences.",
            mark: "⭐", milestoneTitle: "Stage 1 complete!",
            milestoneLine: "You found simple subjects in clear sentences.",
            nextStage: "Look Closer", continueLabel: "Start Look Closer" },
          { name: "Look Closer",
            desc: "Find the simple subject when the sentence has more details.",
            mark: "🌟", milestoneTitle: "Stage 2 complete!",
            milestoneLine: "You found simple subjects even when sentences had more details.",
            nextStage: "Think It Through", continueLabel: "Start Think It Through" },
          { name: "Think It Through",
            desc: "Use the sentence clues when several nouns could look like the subject.",
            mark: "💪", milestoneTitle: "Stage 3 complete!",
            milestoneLine: "You used sentence clues to ignore distracting nouns.",
            nextStage: "Challenge Yourself", continueLabel: "Start Challenge Yourself" },
          { name: "Challenge Yourself",
            desc: "Use the full strategy in richer sentences with stronger distractors.",
            mark: "🎉", milestoneTitle: "You practiced Subject 20 different ways!",
            milestoneLine: "", nextStage: "" }
        ],

        questions: [
          /* ---------- STAGE 1 -- GET STARTED ---------- */

          /* S1Q1 -- action -- WHO */
          { stage: 0,
            sentence: { words: ["The", "energetic", "puppy", "chased", "the", "bouncing", "tennis", "ball", "across", "the", "yard."] },
            question: "Which word is the simple subject?",
            choices: [
              { text: "energetic", feedback: "energetic describes the puppy. It is not the main subject word. Ask: Who chased the ball?" },
              { text: "puppy", correct: true, feedback: "Correct! Who chased the ball? The puppy. So the simple subject is puppy." },
              { text: "chased", feedback: "chased is the verb. It tells what happened. Now ask: Who chased the ball?" },
              { text: "ball", feedback: "ball names a thing, but it is not who did the chasing. Ask: Who chased the ball?" }
            ],
            clue: "Use the verb chased to ask: Who chased the ball?",
            reveal: "The verb is chased. Who chased the ball? The puppy. So the simple subject is puppy." },

          /* S1Q2 -- action -- WHO */
          { stage: 0,
            sentence: { words: ["The", "talented", "artist", "painted", "a", "colorful", "mural", "for", "the", "school", "hallway."] },
            question: "Which word tells who or what the sentence is about?",
            choices: [
              { text: "talented", feedback: "talented describes the artist. It is not the main subject word. Ask: Who painted the mural?" },
              { text: "artist", correct: true, feedback: "Correct! Who painted the mural? The artist. So the simple subject is artist." },
              { text: "painted", feedback: "painted is the verb. Use it to help find the subject. Ask: Who painted the mural?" },
              { text: "mural", feedback: "mural names what was painted. Ask: Who painted the mural?" }
            ],
            clue: "Use the verb painted to ask: Who painted the mural?",
            reveal: "The verb is painted. Who painted the mural? The artist. So the simple subject is artist." },

          /* S1Q3 -- action -- WHAT */
          { stage: 0,
            sentence: { words: ["The", "rusty", "wagon", "carried", "several", "heavy", "boxes", "to", "the", "garage."] },
            question: "Which word is the simple subject?",
            choices: [
              { text: "rusty", feedback: "rusty describes the wagon. Ask: What carried the boxes?" },
              { text: "wagon", correct: true, feedback: "Correct! What carried the boxes? The wagon. So the simple subject is wagon." },
              { text: "carried", feedback: "carried is the verb. Use it to help find the subject." },
              { text: "boxes", feedback: "boxes names things in the sentence, but the boxes did not do the carrying. Ask: What carried the boxes?" }
            ],
            clue: "Use the verb carried to ask: What carried the boxes?",
            reveal: "The verb is carried. What carried the boxes? The wagon. So the simple subject is wagon." },

          /* S1Q4 -- action -- WHO */
          { stage: 0,
            sentence: { words: ["The", "tiny", "sparrow", "built", "a", "nest", "beneath", "the", "porch", "roof."] },
            question: "Which word is the simple subject?",
            choices: [
              { text: "tiny", feedback: "tiny describes the sparrow. Ask: Who built the nest?" },
              { text: "sparrow", correct: true, feedback: "Correct! Who built the nest? The sparrow. So the simple subject is sparrow." },
              { text: "built", feedback: "built is the verb. Use it to help find the subject." },
              { text: "roof", feedback: "roof is part of the detail telling where the nest was built. Ask: Who built the nest?" }
            ],
            clue: "Use the verb built to ask: Who built the nest?",
            reveal: "The verb is built. Who built the nest? The sparrow. So the simple subject is sparrow." },

          /* S1Q5 -- being -- WHAT */
          { stage: 0,
            sentence: { words: ["The", "vegetable", "soup", "is", "warm", "and", "delicious", "after", "simmering", "all", "afternoon."] },
            question: "Which word is the simple subject?",
            choices: [
              { text: "vegetable", feedback: "vegetable describes what kind of soup it is. Ask: What is warm and delicious?" },
              { text: "soup", correct: true, feedback: "Correct! What is warm and delicious? The soup. So the simple subject is soup." },
              { text: "is", feedback: "'is' is the being verb. The verb helps you find the subject. Ask: What is warm and delicious?" },
              { text: "delicious", feedback: "delicious tells what the soup is like. Ask: What is warm and delicious?" }
            ],
            clue: "Use the verb is to ask: What is warm and delicious?",
            reveal: "The being verb is 'is.' What is warm and delicious? The soup. So the simple subject is soup." },

          /* ---------- STAGE 2 -- LOOK CLOSER ---------- */

          /* S2Q1 -- action -- WHO */
          { stage: 1,
            sentence: { words: ["The", "curious", "student", "near", "the", "window", "opened", "the", "science", "book", "before", "class."] },
            question: "Which word is the simple subject?",
            choices: [
              { text: "curious", feedback: "curious describes the student. It is not the main subject word. Ask: Who opened the book?" },
              { text: "student", correct: true, feedback: "Correct! Who opened the book? The student. So the simple subject is student." },
              { text: "window", feedback: "window is part of the detail telling where the student was sitting. Ask: Who opened the book?" },
              { text: "opened", feedback: "opened is the verb. It tells what happened. Now ask: Who opened the book?" }
            ],
            clue: "Use the verb opened to ask: Who opened the book?",
            reveal: "The verb is opened. Who opened the book? The student. So the simple subject is student." },

          /* S2Q2 -- action -- WHO */
          { stage: 1,
            sentence: { words: ["The", "noisy", "children", "on", "the", "playground", "kicked", "the", "soccer", "ball", "toward", "the", "fence."] },
            question: "Which word tells who or what the sentence is about?",
            choices: [
              { text: "noisy", feedback: "noisy describes the children. It is not the main subject word. Ask: Who kicked the ball?" },
              { text: "children", correct: true, feedback: "Correct! Who kicked the ball? The children. So the simple subject is children." },
              { text: "playground", feedback: "playground is part of the detail telling where the children were. Ask: Who kicked the ball?" },
              { text: "ball", feedback: "ball names what was kicked. It is not who did the kicking. Ask: Who kicked the ball?" }
            ],
            clue: "Use the verb kicked to ask: Who kicked the ball?",
            reveal: "The verb is kicked. Who kicked the ball? The children. So the simple subject is children." },

          /* S2Q3 -- action -- WHAT */
          { stage: 1,
            sentence: { words: ["The", "bright", "lantern", "beside", "the", "tent", "glowed", "throughout", "the", "dark", "evening."] },
            question: "Which word is the simple subject?",
            choices: [
              { text: "bright", feedback: "bright describes the lantern. It is not the main subject word. Ask: What glowed?" },
              { text: "lantern", correct: true, feedback: "Correct! What glowed? The lantern. So the simple subject is lantern." },
              { text: "tent", feedback: "tent is part of the detail telling where the lantern was. Ask: What glowed?" },
              { text: "evening", feedback: "evening is part of the detail telling when the lantern glowed. Ask: What glowed?" }
            ],
            clue: "Use the verb glowed to ask: What glowed?",
            reveal: "The verb is glowed. What glowed? The lantern. So the simple subject is lantern." },

          /* S2Q4 -- being -- WHAT */
          { stage: 1,
            sentence: { words: ["The", "large", "painting", "above", "the", "fireplace", "is", "beautiful", "in", "the", "morning", "light."] },
            question: "Which word is the simple subject?",
            choices: [
              { text: "large", feedback: "large describes the painting. It is not the main subject word. Ask: What is beautiful?" },
              { text: "painting", correct: true, feedback: "Correct! What is beautiful? The painting. So the simple subject is painting." },
              { text: "fireplace", feedback: "fireplace is part of the detail telling where the painting hangs. Ask: What is beautiful?" },
              { text: "beautiful", feedback: "beautiful tells what the painting is like. Ask: What is beautiful?" }
            ],
            clue: "Use the verb is to ask: What is beautiful?",
            reveal: "The being verb is 'is.' What is beautiful? The painting. So the simple subject is painting." },

          /* S2Q5 -- being -- WHO */
          { stage: 1,
            sentence: { words: ["The", "two", "kittens", "inside", "the", "basket", "are", "sleepy", "after", "their", "long", "afternoon."] },
            question: "Which word tells who or what the sentence is about?",
            choices: [
              { text: "two", feedback: "two tells how many kittens there are. It is not the main subject word. Ask: Who is sleepy?" },
              { text: "kittens", correct: true, feedback: "Correct! Who is sleepy? The kittens. So the simple subject is kittens." },
              { text: "basket", feedback: "basket is part of the detail telling where the kittens are. Ask: Who is sleepy?" },
              { text: "sleepy", feedback: "sleepy tells what the kittens are like. Ask: Who is sleepy?" }
            ],
            clue: "Use the verb are to ask: Who is sleepy?",
            reveal: "The being verb is 'are.' Who is sleepy? The kittens. So the simple subject is kittens." },

          /* ---------- STAGE 3 -- THINK IT THROUGH ---------- */

          /* S3Q1 -- action -- WHO */
          { stage: 2,
            sentence: { words: ["The", "captain", "of", "the", "soccer", "team", "carried", "the", "equipment", "onto", "the", "field."] },
            question: "Which word is the simple subject?",
            choices: [
              { text: "captain", correct: true, feedback: "Correct! Who carried the equipment? The captain. So the simple subject is captain." },
              { text: "team", feedback: "team is part of the detail telling which captain the sentence means. Ask: Who carried the equipment?" },
              { text: "equipment", feedback: "equipment names what was carried. It is not who did the carrying. Ask: Who carried the equipment?" },
              { text: "carried", feedback: "carried is the verb. It tells what happened. Now ask: Who carried the equipment?" }
            ],
            clue: "Use the verb carried to ask: Who carried the equipment?",
            reveal: "The verb is carried. Who carried the equipment? The captain. So the simple subject is captain." },

          /* S3Q2 -- action -- WHAT */
          { stage: 2,
            sentence: { words: ["The", "collection", "of", "colorful", "seashells", "filled", "the", "glass", "jar", "on", "the", "shelf."] },
            question: "Which word is the simple subject?",
            choices: [
              { text: "collection", correct: true, feedback: "Correct! What filled the jar? The collection. So the simple subject is collection." },
              { text: "seashells", feedback: "seashells is part of the detail telling what the collection holds. Ask: What filled the jar?" },
              { text: "filled", feedback: "filled is the verb. It tells what happened. Now ask: What filled the jar?" },
              { text: "jar", feedback: "jar names what was filled. It is not what did the filling. Ask: What filled the jar?" }
            ],
            clue: "Use the verb filled to ask: What filled the jar?",
            reveal: "The verb is filled. What filled the jar? The collection. So the simple subject is collection." },

          /* S3Q3 -- action -- WHO */
          { stage: 2,
            sentence: { words: ["The", "science", "teacher", "with", "the", "blue", "folder", "explained", "the", "experiment", "to", "the", "class."] },
            question: "Which word tells who or what the sentence is about?",
            choices: [
              { text: "teacher", correct: true, feedback: "Correct! Who explained the experiment? The teacher. So the simple subject is teacher." },
              { text: "folder", feedback: "folder is part of the detail telling what the teacher was holding. Ask: Who explained the experiment?" },
              { text: "explained", feedback: "explained is the verb. It tells what happened. Now ask: Who explained the experiment?" },
              { text: "experiment", feedback: "experiment names what was explained. It is not who did the explaining. Ask: Who explained the experiment?" }
            ],
            clue: "Use the verb explained to ask: Who explained the experiment?",
            reveal: "The verb is explained. Who explained the experiment? The teacher. So the simple subject is teacher." },

          /* S3Q4 -- action -- WHAT */
          { stage: 2,
            sentence: { words: ["The", "old", "bridge", "across", "the", "river", "shook", "during", "the", "powerful", "storm."] },
            question: "Which word is the simple subject?",
            choices: [
              { text: "old", feedback: "old describes the bridge. It is not the main subject word. Ask: What shook?" },
              { text: "bridge", correct: true, feedback: "Correct! What shook? The bridge. So the simple subject is bridge." },
              { text: "river", feedback: "river is part of the detail telling where the bridge is. Ask: What shook?" },
              { text: "shook", feedback: "shook is the verb. It tells what happened. Now ask: What shook?" }
            ],
            clue: "Use the verb shook to ask: What shook?",
            reveal: "The verb is shook. What shook? The bridge. So the simple subject is bridge." },

          /* S3Q5 -- being -- WHAT */
          { stage: 2,
            sentence: { words: ["The", "basket", "of", "ripe", "apples", "is", "heavy", "on", "the", "kitchen", "counter."] },
            question: "Which word is the simple subject?",
            choices: [
              { text: "basket", correct: true, feedback: "Correct! What is heavy? The basket. So the simple subject is basket." },
              { text: "apples", feedback: "apples is part of the detail telling what is inside the basket. Ask: What is heavy?" },
              { text: "heavy", feedback: "heavy tells what the basket is like. Ask: What is heavy?" },
              { text: "counter", feedback: "counter is part of the detail telling where the basket sits. Ask: What is heavy?" }
            ],
            clue: "Use the verb is to ask: What is heavy?",
            reveal: "The being verb is 'is.' What is heavy? The basket. So the simple subject is basket." },

          /* ---------- STAGE 4 -- CHALLENGE YOURSELF ---------- */

          /* S4Q1 -- action -- WHO */
          { stage: 3,
            sentence: { words: ["The", "tallest", "player", "on", "the", "basketball", "team", "passed", "the", "ball", "to", "Marcus", "near", "the", "sideline."] },
            question: "Which word is the simple subject?",
            choices: [
              { text: "player", correct: true, feedback: "Correct! Who passed the ball? The player. So the simple subject is player." },
              { text: "team", feedback: "team is part of the detail telling which player the sentence means. Ask: Who passed the ball?" },
              { text: "passed", feedback: "passed is the verb. It tells what happened. Now ask: Who passed the ball?" },
              { text: "ball", feedback: "ball names what was passed. It is not who did the passing. Ask: Who passed the ball?" }
            ],
            clue: "Use the verb passed to ask: Who passed the ball?",
            reveal: "The verb is passed. Who passed the ball? The player. So the simple subject is player." },

          /* S4Q2 -- action -- WHAT */
          { stage: 3,
            sentence: { words: ["The", "box", "of", "old", "photographs", "fell", "from", "the", "highest", "shelf", "in", "the", "closet."] },
            question: "Which word tells who or what the sentence is about?",
            choices: [
              { text: "box", correct: true, feedback: "Correct! What fell? The box. So the simple subject is box." },
              { text: "photographs", feedback: "photographs is part of the detail telling what was inside the box. Ask: What fell?" },
              { text: "fell", feedback: "fell is the verb. It tells what happened. Now ask: What fell?" },
              { text: "shelf", feedback: "shelf is part of the detail telling where the box fell from. Ask: What fell?" }
            ],
            clue: "Use the verb fell to ask: What fell?",
            reveal: "The verb is fell. What fell? The box. So the simple subject is box." },

          /* S4Q3 -- action -- WHAT */
          { stage: 3,
            sentence: { words: ["The", "small", "engine", "inside", "the", "model", "airplane", "powered", "the", "propeller", "during", "the", "demonstration."] },
            question: "Which word is the simple subject?",
            choices: [
              { text: "engine", correct: true, feedback: "Correct! What powered the propeller? The engine. So the simple subject is engine." },
              { text: "airplane", feedback: "airplane is part of the detail telling where the engine is. Ask: What powered the propeller?" },
              { text: "powered", feedback: "powered is the verb. It tells what happened. Now ask: What powered the propeller?" },
              { text: "propeller", feedback: "propeller names what was powered. It is not what did the powering. Ask: What powered the propeller?" }
            ],
            clue: "Use the verb powered to ask: What powered the propeller?",
            reveal: "The verb is powered. What powered the propeller? The engine. So the simple subject is engine." },

          /* S4Q4 -- being -- WHO */
          { stage: 3,
            sentence: { words: ["The", "winner", "of", "the", "spelling", "contest", "is", "proud", "of", "her", "careful", "preparation."] },
            question: "Which word is the simple subject?",
            choices: [
              { text: "winner", correct: true, feedback: "Correct! Who is proud? The winner. So the simple subject is winner." },
              { text: "contest", feedback: "contest is part of the detail telling which winner the sentence means. Ask: Who is proud?" },
              { text: "proud", feedback: "proud tells what the winner is like. Ask: Who is proud?" },
              { text: "preparation", feedback: "preparation is part of the detail telling what the winner is proud of. Ask: Who is proud?" }
            ],
            clue: "Use the verb is to ask: Who is proud?",
            reveal: "The being verb is 'is.' Who is proud? The winner. So the simple subject is winner." },

          /* S4Q5 -- being -- WHAT */
          { stage: 3,
            sentence: { words: ["The", "bright", "lights", "above", "the", "stage", "are", "visible", "throughout", "the", "school", "performance."] },
            question: "Which word is the simple subject?",
            choices: [
              { text: "lights", correct: true, feedback: "Correct! What is visible? The lights. So the simple subject is lights." },
              { text: "stage", feedback: "stage is part of the detail telling where the lights are. Ask: What is visible?" },
              { text: "visible", feedback: "visible tells what the lights are like. Ask: What is visible?" },
              { text: "performance", feedback: "performance is part of the detail telling when the lights are visible. Ask: What is visible?" }
            ],
            clue: "Use the verb are to ask: What is visible?",
            reveal: "The being verb is 'are.' What is visible? The lights. So the simple subject is lights." }
        ]
      },

      recap: "Find the verb, use it to ask Who? or What?, and you have found the simple subject.",

      studyGuide: {
        title: "Subject Study Guide",
        sections: [
          { heading: "What it is", lines: ["The subject tells who or what the sentence is about.", "The main subject word is the simple subject."] },
          { heading: "How to find it", steps: ["Find the verb.", "Use the verb to ask: Who? or What?", "Find the subject."] },
          {
            heading: "See it in a sentence",
            sentence: {
              words: ["The", "player", "kicked", "the", "ball."],
              marks: [
                { start: 1, end: 1, kind: "subject", label: "SIMPLE SUBJECT" },
                { start: 2, end: 2, kind: "verb", label: "VERB" }
              ]
            },
            lines: ["The verb is kicked. Who kicked? The player. So player is the simple subject."]
          },
          { heading: "Word type or sentence job?", lines: ["A word type tells what kind of word it is.", "Subject tells the job the word does in the sentence.", "player names a person. In this sentence its job is the subject."] }
        ],
        reminder: "In many of the sentences we are learning, the subject comes before the verb."
      }
    },

    /* ===================================================== */
    /* COMPLETE SUBJECT                                      */
    /* ===================================================== */
    "complete-subject": {
      name: "Complete Subject",
      badge: "The ___",
      card: "See all the words in the subject.",
      color: "complete-subject",

      definition: {
        title: "What is a complete subject?",
        text: "The complete subject is the simple subject and the words that go with it.",
        list: [
          "Simple subject: the one main word.",
          "Complete subject: that word plus the words that go with it."
        ],
        sentence: {
          words: ["The", "excited", "player", "kicked", "the", "red", "ball."],
          split: { at: 3, leftLabel: "COMPLETE SUBJECT", rightLabel: "THE REST OF THE SENTENCE" },
          marks: [{ start: 2, end: 2, kind: "subject", label: "SIMPLE SUBJECT" }]
        }
      },

      clue: {
        title: "A clue for finding the complete subject",
        text: "Start at the simple subject. Then keep the words that go with it, like The and a describing word.",
        list: [
          "Simple subject: player",
          "Complete subject: The excited player"
        ],
        warning: "The complete subject is everything that tells who or what — not just the one main word.",
        sentence: {
          words: ["The", "excited", "player", "kicked", "the", "red", "ball."],
          split: { at: 3, leftLabel: "COMPLETE SUBJECT", rightLabel: "THE REST OF THE SENTENCE" }
        }
      },

      example: {
        title: "Let's split the sentence",
        text: "The complete subject is on one side. Everything else is on the other side.",
        sentence: {
          words: ["The", "excited", "player", "kicked", "the", "red", "ball."],
          split: { at: 3, leftLabel: "COMPLETE SUBJECT", rightLabel: "THE REST OF THE SENTENCE" },
          marks: [{ start: 2, end: 2, kind: "subject", label: "SIMPLE SUBJECT" }]
        },
        points: [
          "Simple subject: player.",
          "Complete subject: The excited player.",
          "The word excited goes with player, so it is part of the complete subject."
        ]
      },

      tryIt: {
        title: "Try it",
        sentence: {
          words: ["The", "happy", "children", "played", "at", "the", "park."]
        },
        question: "The simple subject is children. Which group of words is the complete subject?",
        choices: [
          { text: "The happy children", correct: true, feedback: "Correct! children is the simple subject, and The happy children is the complete subject." },
          { text: "happy children", feedback: "So close! Those words are part of it, but the complete subject also includes the word The." },
          { text: "children", feedback: "children is the simple subject — the one main word. The complete subject also includes the words that go with it." },
          { text: "played at the park", feedback: "That part has the verb played in it, so it tells what the children did. The complete subject tells who or what." }
        ]
      },

      recap: "The complete subject is the simple subject plus the words that go with it.",

      studyGuide: {
        title: "Complete Subject Study Guide",
        sections: [
          { heading: "What it is", lines: ["The complete subject is the simple subject and the words that go with it."] },
          { heading: "Simple subject", chips: ["player"] },
          { heading: "Complete subject", chips: ["The excited player"] },
          {
            heading: "See it in a sentence",
            sentence: {
              words: ["The", "excited", "player", "kicked", "the", "red", "ball."],
              split: { at: 3, leftLabel: "COMPLETE SUBJECT", rightLabel: "THE REST OF THE SENTENCE" },
              marks: [{ start: 2, end: 2, kind: "subject", label: "SIMPLE SUBJECT" }]
            }
          },
          { heading: "How to find it", steps: ["Find the verb.", "Ask who or what to find the simple subject.", "Keep the words that go with it."] }
        ],
        reminder: "The simple subject is one word. The complete subject can be a group of words."
      }
    },

    /* ===================================================== */
    /* PREDICATE                                             */
    /* ===================================================== */
    "predicate": {
      name: "Predicate",
      badge: "did what?",
      card: "Find what the subject does or is.",
      color: "predicate",

      definition: {
        title: "What is a predicate?",
        text: "The predicate is the part of the sentence that has the verb. It tells what the subject does, or what is being said about the subject.",
        list: [
          "The verb is always inside the predicate."
        ],
        sentence: {
          words: ["The", "excited", "player", "kicked", "the", "red", "ball."],
          split: { at: 3, leftLabel: "COMPLETE SUBJECT", rightLabel: "PREDICATE" },
          marks: [{ start: 3, end: 3, kind: "verb", label: "VERB" }]
        }
      },

      clue: {
        title: "A clue for finding the predicate",
        text: "Find the verb first. The predicate is the part that has the verb in it, along with the words that go with it.",
        steps: [
          "Find the verb.",
          "Find the complete subject.",
          "The other part is the predicate."
        ],
        warning: "The verb is inside the predicate — look at the picture and you can see it there.",
        sentence: {
          words: ["The", "excited", "player", "kicked", "the", "red", "ball."],
          split: { at: 3, leftLabel: "COMPLETE SUBJECT", rightLabel: "PREDICATE" },
          marks: [{ start: 3, end: 3, kind: "verb", label: "VERB IS IN HERE" }]
        }
      },

      example: {
        title: "Let's find the predicate",
        text: "Look at where the verb sits.",
        sentence: {
          words: ["The", "excited", "player", "kicked", "the", "red", "ball."],
          split: { at: 3, leftLabel: "COMPLETE SUBJECT", rightLabel: "PREDICATE" },
          marks: [{ start: 3, end: 3, kind: "verb", label: "VERB" }]
        },
        points: [
          "Verb: kicked.",
          "Complete subject: The excited player.",
          "Predicate: kicked the red ball.",
          "The predicate tells what the player did."
        ]
      },

      tryIt: {
        title: "Try it",
        sentence: {
          words: ["The", "brave", "firefighter", "climbed", "the", "long", "ladder."]
        },
        question: "The verb is climbed. Which part is the predicate?",
        choices: [
          { text: "climbed the long ladder", correct: true, feedback: "Correct! climbed the long ladder is the predicate. It has the verb climbed and tells what the firefighter did." },
          { text: "The brave firefighter", feedback: "That is the complete subject. It tells who the sentence is about. The predicate is the part with the verb in it." },
          { text: "climbed", feedback: "climbed is the verb, and the verb is inside the predicate. But the predicate is the whole part that tells what the firefighter did." },
          { text: "the long ladder", feedback: "Those words are part of the predicate, but the predicate starts with the verb climbed." }
        ]
      },

      recap: "The predicate is the part with the verb. It tells what the subject does or is.",

      studyGuide: {
        title: "Predicate Study Guide",
        sections: [
          { heading: "What it is", lines: ["The predicate is the part of the sentence that has the verb.", "It tells what the subject does, or what is being said about the subject."] },
          {
            heading: "See the two parts",
            sentence: {
              words: ["The", "excited", "player", "kicked", "the", "red", "ball."],
              split: { at: 3, leftLabel: "COMPLETE SUBJECT", rightLabel: "PREDICATE" },
              marks: [{ start: 3, end: 3, kind: "verb", label: "VERB" }]
            },
            lines: ["Complete subject: The excited player", "Predicate: kicked the red ball", "Verb: kicked"]
          },
          { heading: "How to find it", steps: ["Find the verb.", "Find the complete subject.", "The other part is the predicate."] }
        ],
        reminder: "The verb is always inside the predicate."
      }
    },

    /* ===================================================== */
    /* NOUN                                                  */
    /* ===================================================== */
    "noun": {
      name: "Noun",
      badge: "player",
      card: "Name a person, place, thing, or idea.",
      color: "noun",

      ask: "Names a person, place, thing, or idea.",
      icon: "book",
      preview: { words: ["The", "cat", "sat", "on", "the", "mat."], start: 1, end: 1 },
      practice: "soon",
      test: "soon",

      definition: {
        title: "What is a noun?",
        text: "A noun names a person, place, thing, or idea.",
        groups: [
          { label: "Person", chips: ["teacher", "player", "mother", "student"] },
          { label: "Place", chips: ["school", "park", "Atlanta", "library"] },
          { label: "Thing", chips: ["ball", "book", "desk", "backpack"] },
          { label: "Idea", chips: ["love", "joy", "hope", "freedom"] }
        ],
        note: "An idea is something you cannot touch, like joy or hope. It is still a noun."
      },

      clue: {
        title: "A clue for finding nouns",
        text: "Ask about the word: Is it a person? A place? A thing? An idea? If you can say yes, it is a noun.",
        list: [
          "You can often put the or a in front of a noun: the ball, a school.",
          "A sentence can have more than one noun."
        ],
        warning: "This is a clue, so check the sentence. Some words can do more than one job.",
        sentence: {
          words: ["The", "player", "kicked", "the", "ball."],
          marks: [
            { start: 1, end: 1, kind: "noun", label: "NOUN" },
            { start: 4, end: 4, kind: "noun", label: "NOUN" }
          ]
        }
      },

      example: {
        title: "Let's find the nouns",
        text: "This sentence has two nouns.",
        sentence: {
          words: ["The", "student", "read", "a", "book."],
          marks: [
            { start: 1, end: 1, kind: "noun", label: "PERSON" },
            { start: 4, end: 4, kind: "noun", label: "THING" }
          ]
        },
        points: [
          "student names a person.",
          "book names a thing.",
          "read is not a noun. It is the verb — it tells what the student did."
        ]
      },

      tryIt: {
        title: "Try it",
        sentence: {
          words: ["The", "kind", "teacher", "works", "at", "a", "big", "school."]
        },
        question: "Which word names a place?",
        choices: [
          { text: "teacher", feedback: "teacher is a noun, but it names a person, not a place." },
          { text: "works", feedback: "works is the verb. It tells what the teacher does." },
          { text: "big", feedback: "big describes the school. It tells what kind." },
          { text: "school", correct: true, feedback: "Correct! school names a place, so it is a noun." }
        ]
      },

      recap: "A noun names a person, place, thing, or idea.",

      studyGuide: {
        title: "Noun Study Guide",
        sections: [
          { heading: "What it is", lines: ["A noun names a person, place, thing, or idea."] },
          { heading: "Person", chips: ["teacher", "player", "mother", "student", "doctor", "friend"] },
          { heading: "Place", chips: ["school", "park", "Atlanta", "library", "kitchen", "beach"] },
          { heading: "Thing", chips: ["ball", "book", "desk", "backpack", "ladder", "bicycle"] },
          { heading: "Idea", chips: ["love", "joy", "hope", "freedom", "courage"] },
          {
            heading: "See it in a sentence",
            sentence: {
              words: ["The", "student", "read", "a", "book."],
              marks: [
                { start: 1, end: 1, kind: "noun", label: "PERSON" },
                { start: 4, end: 4, kind: "noun", label: "THING" }
              ]
            }
          }
        ],
        reminder: "You can often put the or a in front of a noun. This is a clue, so check the sentence."
      }
    },

    /* ===================================================== */
    /* ADJECTIVE                                             */
    /* ===================================================== */
    "adjective": {
      name: "Adjective",
      badge: "red",
      card: "Describe a noun.",
      color: "adjective",

      ask: "Describes a noun.",
      icon: "pencil",
      preview: { words: ["The", "loud", "dog", "barked."], start: 1, end: 1 },
      practice: "soon",
      test: "soon",

      definition: {
        title: "What is an adjective?",
        text: "An adjective describes a noun.",
        list: [
          "An adjective does not just describe. It describes a noun.",
          "Always ask which noun it is describing."
        ],
        sentence: {
          words: ["The", "excited", "player", "kicked", "the", "red", "ball."],
          marks: [
            { start: 1, end: 1, kind: "adjective", label: "ADJECTIVE" },
            { start: 2, end: 2, kind: "noun", label: "NOUN" },
            { start: 5, end: 5, kind: "adjective", label: "ADJECTIVE" },
            { start: 6, end: 6, kind: "noun", label: "NOUN" }
          ],
          links: [
            { from: 1, to: 2, text: "describes" },
            { from: 5, to: 6, text: "describes" }
          ]
        }
      },

      clue: {
        title: "Three questions that find adjectives",
        text: "Find a noun. Then ask these three questions about it.",
        list: [
          "What kind? a red ball, a fast player",
          "Which one? that book, this desk",
          "How many? three books, two dogs"
        ],
        warning: "The word that answers the question is the adjective, and the word it answers about is the noun.",
        sentence: {
          words: ["The", "fast", "player", "caught", "the", "high", "ball."],
          marks: [
            { start: 1, end: 1, kind: "adjective", label: "WHAT KIND?" },
            { start: 2, end: 2, kind: "noun", label: "NOUN" },
            { start: 5, end: 5, kind: "adjective", label: "WHAT KIND?" },
            { start: 6, end: 6, kind: "noun", label: "NOUN" }
          ],
          links: [
            { from: 1, to: 2, text: "describes" },
            { from: 5, to: 6, text: "describes" }
          ]
        }
      },

      example: {
        title: "Let's connect adjectives to nouns",
        text: "Every adjective points to one noun. Follow the arrows.",
        sentence: {
          words: ["The", "excited", "player", "kicked", "the", "red", "ball."],
          marks: [
            { start: 1, end: 1, kind: "adjective", label: "ADJECTIVE" },
            { start: 2, end: 2, kind: "noun", label: "NOUN" },
            { start: 5, end: 5, kind: "adjective", label: "ADJECTIVE" },
            { start: 6, end: 6, kind: "noun", label: "NOUN" }
          ],
          links: [
            { from: 1, to: 2, text: "describes" },
            { from: 5, to: 6, text: "describes" }
          ]
        },
        points: [
          "excited describes player. What kind of player? An excited one.",
          "red describes ball. What kind of ball? A red one.",
          "excited does not describe ball, and red does not describe player. Each adjective goes with its own noun."
        ]
      },

      tryIt: {
        title: "Try it",
        sentence: {
          words: ["The", "hungry", "cat", "ate", "a", "small", "fish."]
        },
        question: "Which word describes the noun cat?",
        choices: [
          { text: "hungry", correct: true, feedback: "Correct! hungry describes the noun cat. It tells what kind of cat." },
          { text: "cat", feedback: "cat is the noun being described. Look for the word that tells more about the cat." },
          { text: "ate", feedback: "ate is the verb. It tells what the cat did." },
          { text: "small", feedback: "small is an adjective, but it describes fish, not cat." }
        ]
      },

      recap: "An adjective describes a noun. Always ask which noun it describes.",

      studyGuide: {
        title: "Adjective Study Guide",
        sections: [
          { heading: "What it is", lines: ["An adjective describes a noun."] },
          { heading: "What kind?", chips: ["red ball", "fast player", "happy child", "large dog"] },
          { heading: "Which one?", chips: ["that book", "this desk"] },
          { heading: "How many?", chips: ["three books", "two dogs"] },
          {
            heading: "See the adjective go with its noun",
            sentence: {
              words: ["The", "excited", "player", "kicked", "the", "red", "ball."],
              marks: [
                { start: 1, end: 1, kind: "adjective", label: "ADJECTIVE" },
                { start: 2, end: 2, kind: "noun", label: "NOUN" },
                { start: 5, end: 5, kind: "adjective", label: "ADJECTIVE" },
                { start: 6, end: 6, kind: "noun", label: "NOUN" }
              ],
              links: [
                { from: 1, to: 2, text: "describes" },
                { from: 5, to: 6, text: "describes" }
              ]
            }
          }
        ],
        reminder: "An adjective always describes a noun. Ask which noun it goes with."
      }
    }
  }
};
