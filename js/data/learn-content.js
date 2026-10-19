/* =========================================================
   Sentence Sense — skill content (Build 1.4.0; six Georgia grade 3 skills added in 1.5.0)

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
  order: ["verb", "subject", "complete-subject", "predicate", "noun", "adjective",
          "pronoun", "adverb", "complete-sentence", "helping-linking", "verb-tense", "agreement"],

  /* Build 1.4.0 — THE FOUR HOME SKILLS, in the order Home shows them.
     Deliberately small (brief section 6). complete-subject and predicate
     keep all of their content below, untouched, ready to migrate when a
     later build approves them; they are simply not routed to.

     To add a fifth skill, add its key here and give its topic the six
     card fields documented on `verb`. No rendering code changes. */
  homeOrder: ["verb", "helping-linking", "verb-tense", "noun", "pronoun", "adjective", "adverb",
              "subject", "complete-sentence", "agreement"],

  /* Build 1.5.0 — HOME IN TWO LABELLED ROWS (owner-approved 2026-10-19).
     Ten skills on one undivided grid would break "one screen, one obvious
     thing to do", so Home groups them the way the Georgia standards do:
     words and their jobs, then building sentences. `homeOrder` above stays
     the flat list (it MUST equal the groups flattened, in order -- the
     harness checks it), so everything that walks skills is unchanged. */
  homeGroups: [
    { name: "Words", sub: "What each kind of word does.",
      skills: ["verb", "helping-linking", "verb-tense", "noun", "pronoun", "adjective", "adverb"] },
    { name: "Sentences", sub: "Put the words together the right way.",
      skills: ["subject", "complete-sentence", "agreement"] }
  ],

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
      /* Build 1.5.0: Georgia K-12 ELA codes shown on the Skill screen. */
      ga: [{ code: "3-5.L.GC.1", label: "Action verbs (R)" }, { code: "3-5.L.GC.1", label: "Being verbs (helping and linking, I)" }],
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
              { text: "brown", feedback: "brown tells what color the rabbit is. It describes the rabbit. Look again for the word that tells what happened." },
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
              { text: "is", correct: true, feedback: "Nice thinking! 'is' is the verb because it tells what the puppy is." },
              { text: "happy", feedback: "happy tells how the puppy feels. It describes the puppy. Look again for the word that tells what the puppy is." },
              { text: "home", feedback: "home names a place. Look again for the word that tells what the puppy is." }
            ],
            clue: "Remember: a verb can also tell what someone or something is.",
            reveal: "Let's find it together. 'is' tells what the puppy is, so 'is' is the verb." },
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
                  text: "Here, building names a thing. The verb is 'is.'"
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

      /* Build 1.5.0: Georgia K-12 ELA codes shown on the Skill screen. */
      ga: [{ code: "3.L.GC.2.a", label: "Parts of a sentence" }, { code: "3.L.GC.2.c", label: "Finding the subject for agreement" }],
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
              { text: "energetic", feedback: "energetic describes the puppy. It is not the main subject word. Use the verb to help find the subject." },
              { text: "puppy", correct: true, feedback: "Correct! Who chased the ball? The puppy. So the simple subject is puppy." },
              { text: "chased", feedback: "chased is the verb. It tells what happened. Use it to help find the subject." },
              { text: "ball", feedback: "ball names a thing, but it is not who did the chasing. Use the verb to help find the subject." }
            ],
            clue: "Use the verb chased to ask: Who chased the ball?",
            reveal: "The verb is chased. Who chased the ball? The puppy. So the simple subject is puppy." },

          /* S1Q2 -- action -- WHO */
          { stage: 0,
            sentence: { words: ["The", "talented", "artist", "painted", "a", "colorful", "mural", "for", "the", "school", "hallway."] },
            question: "Which word tells who or what the sentence is about?",
            choices: [
              { text: "talented", feedback: "talented describes the artist. It is not the main subject word. Use the verb to help find the subject." },
              { text: "artist", correct: true, feedback: "Correct! Who painted the mural? The artist. So the simple subject is artist." },
              { text: "painted", feedback: "painted is the verb. Use it to help find the subject." },
              { text: "mural", feedback: "mural names what was painted. Use the verb to help find the subject." }
            ],
            clue: "Use the verb painted to ask: Who painted the mural?",
            reveal: "The verb is painted. Who painted the mural? The artist. So the simple subject is artist." },

          /* S1Q3 -- action -- WHAT */
          { stage: 0,
            sentence: { words: ["The", "rusty", "wagon", "carried", "several", "heavy", "boxes", "to", "the", "garage."] },
            question: "Which word is the simple subject?",
            choices: [
              { text: "rusty", feedback: "rusty describes the wagon. Use the verb to help find the subject." },
              { text: "wagon", correct: true, feedback: "Correct! What carried the boxes? The wagon. So the simple subject is wagon." },
              { text: "carried", feedback: "carried is the verb. Use it to help find the subject." },
              { text: "boxes", feedback: "boxes names things in the sentence, but the boxes did not do the carrying. Use the verb to help find the subject." }
            ],
            clue: "Use the verb carried to ask: What carried the boxes?",
            reveal: "The verb is carried. What carried the boxes? The wagon. So the simple subject is wagon." },

          /* S1Q4 -- action -- WHO */
          { stage: 0,
            sentence: { words: ["The", "tiny", "sparrow", "built", "a", "nest", "beneath", "the", "porch", "roof."] },
            question: "Which word is the simple subject?",
            choices: [
              { text: "tiny", feedback: "tiny describes the sparrow. Use the verb to help find the subject." },
              { text: "sparrow", correct: true, feedback: "Correct! Who built the nest? The sparrow. So the simple subject is sparrow." },
              { text: "built", feedback: "built is the verb. Use it to help find the subject." },
              { text: "roof", feedback: "roof is part of the detail telling where the nest was built. Use the verb to help find the subject." }
            ],
            clue: "Use the verb built to ask: Who built the nest?",
            reveal: "The verb is built. Who built the nest? The sparrow. So the simple subject is sparrow." },

          /* S1Q5 -- being -- WHAT */
          { stage: 0,
            sentence: { words: ["The", "vegetable", "soup", "is", "warm", "and", "delicious", "after", "simmering", "all", "afternoon."] },
            question: "Which word is the simple subject?",
            choices: [
              { text: "vegetable", feedback: "vegetable describes what kind of soup it is. Use the being verb to help find the subject." },
              { text: "soup", correct: true, feedback: "Correct! What is warm and delicious? The soup. So the simple subject is soup." },
              { text: "is", feedback: "'is' is the being verb. The verb helps you find the subject." },
              { text: "delicious", feedback: "delicious tells what the soup is like. Use the being verb to help find the subject." }
            ],
            clue: "Use the verb is to ask: What is warm and delicious?",
            reveal: "The being verb is 'is.' What is warm and delicious? The soup. So the simple subject is soup." },

          /* ---------- STAGE 2 -- LOOK CLOSER ---------- */

          /* S2Q1 -- action -- WHO */
          { stage: 1,
            sentence: { words: ["The", "curious", "student", "near", "the", "window", "opened", "the", "science", "book", "before", "class."] },
            question: "Which word is the simple subject?",
            choices: [
              { text: "curious", feedback: "curious describes the student. It is not the main subject word. Use the verb to help find the subject." },
              { text: "student", correct: true, feedback: "Correct! Who opened the book? The student. So the simple subject is student." },
              { text: "window", feedback: "window is part of the detail telling where the student was sitting. Use the verb to help find the subject." },
              { text: "opened", feedback: "opened is the verb. It tells what happened. Use it to help find the subject." }
            ],
            clue: "Use the verb opened to ask: Who opened the book?",
            reveal: "The verb is opened. Who opened the book? The student. So the simple subject is student." },

          /* S2Q2 -- action -- WHO */
          { stage: 1,
            sentence: { words: ["On", "the", "playground,", "the", "noisy", "children", "kicked", "the", "soccer", "ball", "toward", "the", "fence."] },
            question: "Which word tells who or what the sentence is about?",
            choices: [
              { text: "noisy", feedback: "noisy describes the children. It is not the main subject word. Use the verb to help find the subject." },
              { text: "children", correct: true, feedback: "Correct! Who kicked the ball? The children. So the simple subject is children." },
              { text: "playground", feedback: "playground is part of the detail telling where the children were. Use the verb to help find the subject." },
              { text: "ball", feedback: "ball names what was kicked. It is not who did the kicking. Use the verb to help find the subject." }
            ],
            clue: "Use the verb kicked to ask: Who kicked the ball?",
            reveal: "The verb is kicked. Who kicked the ball? The children. So the simple subject is children." },

          /* S2Q3 -- action -- WHAT */
          { stage: 1,
            sentence: { words: ["The", "bright", "lantern", "beside", "the", "tent", "glowed", "throughout", "the", "dark", "evening."] },
            question: "Which word is the simple subject?",
            choices: [
              { text: "bright", feedback: "bright describes the lantern. It is not the main subject word. Use the verb to help find the subject." },
              { text: "lantern", correct: true, feedback: "Correct! What glowed? The lantern. So the simple subject is lantern." },
              { text: "tent", feedback: "tent is part of the detail telling where the lantern was. Use the verb to help find the subject." },
              { text: "evening", feedback: "evening is part of the detail telling when the lantern glowed. Use the verb to help find the subject." }
            ],
            clue: "Use the verb glowed to ask: What glowed?",
            reveal: "The verb is glowed. What glowed? The lantern. So the simple subject is lantern." },

          /* S2Q4 -- being -- WHAT */
          { stage: 1,
            sentence: { words: ["The", "large", "painting", "above", "the", "fireplace", "is", "beautiful", "in", "the", "morning", "light."] },
            question: "Which word is the simple subject?",
            choices: [
              { text: "large", feedback: "large describes the painting. It is not the main subject word. Use the being verb to help find the subject." },
              { text: "painting", correct: true, feedback: "Correct! What is beautiful? The painting. So the simple subject is painting." },
              { text: "fireplace", feedback: "fireplace is part of the detail telling where the painting hangs. Use the being verb to help find the subject." },
              { text: "beautiful", feedback: "beautiful tells what the painting is like. Use the being verb to help find the subject." }
            ],
            clue: "Use the verb is to ask: What is beautiful?",
            reveal: "The being verb is 'is.' What is beautiful? The painting. So the simple subject is painting." },

          /* S2Q5 -- being -- WHO */
          { stage: 1,
            sentence: { words: ["The", "two", "kittens", "inside", "the", "basket", "are", "sleepy", "after", "their", "long", "afternoon."] },
            question: "Which word tells who or what the sentence is about?",
            choices: [
              { text: "two", feedback: "two tells how many kittens there are. It is not the main subject word. Use the being verb to help find the subject." },
              { text: "kittens", correct: true, feedback: "Correct! Who is sleepy? The kittens. So the simple subject is kittens." },
              { text: "basket", feedback: "basket is part of the detail telling where the kittens are. Use the being verb to help find the subject." },
              { text: "sleepy", feedback: "sleepy tells what the kittens are like. Use the being verb to help find the subject." }
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
              { text: "team", feedback: "team is part of the detail telling which captain the sentence means. Use the verb to help find the subject." },
              { text: "equipment", feedback: "equipment names what was carried. It is not who did the carrying. Use the verb to help find the subject." },
              { text: "carried", feedback: "carried is the verb. It tells what happened. Use it to help find the subject." }
            ],
            clue: "Use the verb carried to ask: Who carried the equipment?",
            reveal: "The verb is carried. Who carried the equipment? The captain. So the simple subject is captain." },

          /* S3Q2 -- action -- WHAT */
          { stage: 2,
            sentence: { words: ["The", "collection", "of", "colorful", "seashells", "filled", "the", "glass", "jar", "on", "the", "shelf."] },
            question: "Which word is the simple subject?",
            choices: [
              { text: "collection", correct: true, feedback: "Correct! What filled the jar? The collection. So the simple subject is collection." },
              { text: "seashells", feedback: "The word seashells is part of the detail telling what the collection holds. Use the verb to help find the subject." },
              { text: "filled", feedback: "filled is the verb. It tells what happened. Use it to help find the subject." },
              { text: "jar", feedback: "jar names what was filled. It is not what did the filling. Use the verb to help find the subject." }
            ],
            clue: "Use the verb filled to ask: What filled the jar?",
            reveal: "The verb is filled. What filled the jar? The collection. So the simple subject is collection." },

          /* S3Q3 -- action -- WHO */
          { stage: 2,
            sentence: { words: ["During", "the", "assembly,", "the", "science", "teacher", "with", "the", "blue", "folder", "explained", "the", "experiment."] },
            question: "Which word tells who or what the sentence is about?",
            choices: [
              { text: "teacher", correct: true, feedback: "Correct! Who explained the experiment? The teacher. So the simple subject is teacher." },
              { text: "folder", feedback: "folder is part of the detail telling what the teacher was holding. Use the verb to help find the subject." },
              { text: "explained", feedback: "explained is the verb. It tells what happened. Use it to help find the subject." },
              { text: "experiment", feedback: "experiment names what was explained. It is not who did the explaining. Use the verb to help find the subject." }
            ],
            clue: "Use the verb explained to ask: Who explained the experiment?",
            reveal: "The verb is explained. Who explained the experiment? The teacher. So the simple subject is teacher." },

          /* S3Q4 -- action -- WHAT */
          { stage: 2,
            sentence: { words: ["During", "the", "powerful", "storm,", "the", "old", "bridge", "across", "the", "river", "shook."] },
            question: "Which word is the simple subject?",
            choices: [
              { text: "old", feedback: "old describes the bridge. It is not the main subject word. Use the verb to help find the subject." },
              { text: "bridge", correct: true, feedback: "Correct! What shook? The bridge. So the simple subject is bridge." },
              { text: "river", feedback: "river is part of the detail telling where the bridge is. Use the verb to help find the subject." },
              { text: "shook", feedback: "shook is the verb. It tells what happened. Use it to help find the subject." }
            ],
            clue: "Use the verb shook to ask: What shook?",
            reveal: "The verb is shook. What shook? The bridge. So the simple subject is bridge." },

          /* S3Q5 -- being -- WHAT */
          { stage: 2,
            sentence: { words: ["The", "basket", "of", "ripe", "apples", "is", "heavy", "on", "the", "kitchen", "counter."] },
            question: "Which word is the simple subject?",
            choices: [
              { text: "basket", correct: true, feedback: "Correct! What is heavy? The basket. So the simple subject is basket." },
              { text: "apples", feedback: "apples is part of the detail telling what is inside the basket. Use the being verb to help find the subject." },
              { text: "heavy", feedback: "heavy tells what the basket is like. Use the being verb to help find the subject." },
              { text: "counter", feedback: "counter is part of the detail telling where the basket sits. Use the being verb to help find the subject." }
            ],
            clue: "Use the verb is to ask: What is heavy?",
            reveal: "The being verb is 'is.' What is heavy? The basket. So the simple subject is basket." },

          /* ---------- STAGE 4 -- CHALLENGE YOURSELF ---------- */

          /* S4Q1 -- action -- WHO */
          { stage: 3,
            sentence: { words: ["Near", "the", "sideline,", "the", "tallest", "player", "on", "the", "basketball", "team", "passed", "the", "ball", "to", "Marcus."] },
            question: "Which word is the simple subject?",
            choices: [
              { text: "player", correct: true, feedback: "Correct! Who passed the ball? The player. So the simple subject is player." },
              { text: "team", feedback: "team is part of the detail telling which player the sentence means. Use the verb to help find the subject." },
              { text: "passed", feedback: "passed is the verb. It tells what happened. Use it to help find the subject." },
              { text: "ball", feedback: "ball names what was passed. It is not who did the passing. Use the verb to help find the subject." }
            ],
            clue: "Use the verb passed to ask: Who passed the ball?",
            reveal: "The verb is passed. Who passed the ball? The player. So the simple subject is player." },

          /* S4Q2 -- action -- WHAT */
          { stage: 3,
            sentence: { words: ["The", "box", "of", "old", "photographs", "fell", "from", "the", "highest", "shelf", "in", "the", "closet."] },
            question: "Which word tells who or what the sentence is about?",
            choices: [
              { text: "box", correct: true, feedback: "Correct! What fell? The box. So the simple subject is box." },
              { text: "photographs", feedback: "The word photographs is part of the detail telling what was inside the box. Use the verb to help find the subject." },
              { text: "fell", feedback: "fell is the verb. It tells what happened. Use it to help find the subject." },
              { text: "shelf", feedback: "shelf is part of the detail telling where the box fell from. Use the verb to help find the subject." }
            ],
            clue: "Use the verb fell to ask: What fell?",
            reveal: "The verb is fell. What fell? The box. So the simple subject is box." },

          /* S4Q3 -- action -- WHAT */
          { stage: 3,
            sentence: { words: ["During", "the", "demonstration,", "the", "small", "engine", "inside", "the", "model", "airplane", "powered", "the", "propeller."] },
            question: "Which word is the simple subject?",
            choices: [
              { text: "engine", correct: true, feedback: "Correct! What powered the propeller? The engine. So the simple subject is engine." },
              { text: "airplane", feedback: "airplane is part of the detail telling where the engine is. Use the verb to help find the subject." },
              { text: "powered", feedback: "powered is the verb. It tells what happened. Use it to help find the subject." },
              { text: "propeller", feedback: "propeller names what was powered. It is not what did the powering. Use the verb to help find the subject." }
            ],
            clue: "Use the verb powered to ask: What powered the propeller?",
            reveal: "The verb is powered. What powered the propeller? The engine. So the simple subject is engine." },

          /* S4Q4 -- being -- WHO */
          { stage: 3,
            sentence: { words: ["The", "winner", "of", "the", "spelling", "contest", "is", "proud", "of", "her", "careful", "preparation."] },
            question: "Which word is the simple subject?",
            choices: [
              { text: "winner", correct: true, feedback: "Correct! Who is proud? The winner. So the simple subject is winner." },
              { text: "contest", feedback: "contest is part of the detail telling which winner the sentence means. Use the being verb to help find the subject." },
              { text: "proud", feedback: "proud tells what the winner is like. Use the being verb to help find the subject." },
              { text: "preparation", feedback: "preparation is part of the detail telling what the winner is proud of. Use the being verb to help find the subject." }
            ],
            clue: "Use the verb is to ask: Who is proud?",
            reveal: "The being verb is 'is.' Who is proud? The winner. So the simple subject is winner." },

          /* S4Q5 -- being -- WHAT */
          { stage: 3,
            sentence: { words: ["Throughout", "the", "school", "performance,", "the", "bright", "lights", "above", "the", "stage", "are", "visible."] },
            question: "Which word is the simple subject?",
            choices: [
              { text: "lights", correct: true, feedback: "Correct! What is visible? The lights. So the simple subject is lights." },
              { text: "stage", feedback: "stage is part of the detail telling where the lights are. Use the being verb to help find the subject." },
              { text: "visible", feedback: "visible tells what the lights are like. Use the being verb to help find the subject." },
              { text: "performance", feedback: "performance is part of the detail telling when the lights are visible. Use the being verb to help find the subject." }
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

      /* Build 1.5.0: Georgia K-12 ELA codes shown on the Skill screen. */
      ga: [{ code: "3-5.L.GC.1", label: "Common and proper nouns (R)" }, { code: "3-5.L.GC.1", label: "Abstract nouns (Master)" }],
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
        title: "Let me try",
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

      /* Build 1.5.0: Georgia K-12 ELA codes shown on the Skill screen. */
      ga: [{ code: "3.L.GC.2.d", label: "Add detail with adjectives" }, { code: "3-5.L.GC.1", label: "Adjectives (R)" }],
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
        title: "Let me try",
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
    },

    /* ===================================================== */
    /* PRONOUN                                             */
    /* Build 1.5.0 — Georgia grade 3 skill. Bank reviewed     */
    /* independently (see AUDIT-REPORT-Build-1.5.0.md).       */
    /* ===================================================== */
    "pronoun": {
      "name": "Pronoun",
      "badge": "she",
      "card": "Take the place of a noun.",
      "color": "pronoun",
      "ask": "Who or what does it stand for?",
      "icon": "pointback",
      "preview": {
        "words": [
          "Maya",
          "said",
          "she",
          "was",
          "ready."
        ],
        "start": 2,
        "end": 2
      },
      "practice": "bank",
      "test": "soon",
      "ga": [
        {
          "code": "3-5.L.GC.1",
          "label": "Personal pronouns (R)"
        },
        {
          "code": "3-5.L.GC.1",
          "label": "Reflexive pronouns (Master)"
        },
        {
          "code": "3-5.L.GC.1",
          "label": "Pronoun agreement (C)"
        }
      ],
      "definition": {
        "title": "What is a pronoun?",
        "callout": {
          "title": "A pronoun takes the place of a noun.",
          "rows": [
            {
              "key": "WHO DOES IT",
              "text": "I, you, he, she, it, we, they"
            },
            {
              "key": "WHO GETS IT",
              "text": "me, him, her, us, them"
            },
            {
              "key": "WHOSE",
              "text": "my, his, her, its, our, their"
            }
          ]
        },
        "contrast": {
          "heading": "The pronoun stands for the noun",
          "rows": [
            {
              "sentence": {
                "words": [
                  "Maya",
                  "found",
                  "a",
                  "puppy,",
                  "and",
                  "she",
                  "named",
                  "it",
                  "Biscuit."
                ],
                "marks": [
                  {
                    "start": 0,
                    "end": 0,
                    "kind": "noun",
                    "label": "NOUN"
                  },
                  {
                    "start": 3,
                    "end": 3,
                    "kind": "noun",
                    "label": "NOUN"
                  },
                  {
                    "start": 5,
                    "end": 5,
                    "kind": "pronoun",
                    "label": "PRONOUN"
                  },
                  {
                    "start": 7,
                    "end": 7,
                    "kind": "pronoun",
                    "label": "PRONOUN"
                  }
                ],
                "links": [
                  {
                    "from": 5,
                    "to": 0,
                    "text": "stands for"
                  },
                  {
                    "from": 7,
                    "to": 3,
                    "text": "stands for"
                  }
                ]
              },
              "text": "she stands for Maya. it stands for the puppy."
            }
          ]
        },
        "note": "Most pronouns point back to a noun. I, me, we, and us stand for the person talking."
      },
      "clue": {
        "title": "How do I find what it stands for?",
        "callout": {
          "title": "Three steps:",
          "rows": [
            {
              "key": "1",
              "text": "Find a word like he, she, it, we, or they."
            },
            {
              "key": "2",
              "text": "Ask: Who or what does it stand for?"
            },
            {
              "key": "3",
              "text": "Make them match. One is he, she, or it. More than one is they."
            }
          ]
        },
        "warning": "Words that end in -self or -selves point back to the person who did the action: Maya fixed the bike herself."
      },
      "example": {
        "title": "Let's find what each pronoun stands for",
        "sentence": {
          "words": [
            "Leo",
            "lost",
            "his",
            "library",
            "book,",
            "so",
            "he",
            "searched",
            "for",
            "it."
          ],
          "marks": [
            {
              "start": 0,
              "end": 0,
              "kind": "noun",
              "label": "NOUN"
            },
            {
              "start": 2,
              "end": 2,
              "kind": "pronoun",
              "label": "PRONOUN"
            },
            {
              "start": 4,
              "end": 4,
              "kind": "noun",
              "label": "NOUN"
            },
            {
              "start": 6,
              "end": 6,
              "kind": "pronoun",
              "label": "PRONOUN"
            },
            {
              "start": 9,
              "end": 9,
              "kind": "pronoun",
              "label": "PRONOUN"
            }
          ],
          "links": [
            {
              "from": 2,
              "to": 0,
              "text": "stands for"
            },
            {
              "from": 6,
              "to": 0,
              "text": "stands for"
            },
            {
              "from": 9,
              "to": 4,
              "text": "stands for"
            }
          ]
        },
        "routine": [
          "Read the sentence.",
          "Find the pronouns: his, he, it.",
          "Ask who or what each one stands for.",
          "his and he stand for Leo. it stands for the book."
        ]
      },
      "learnTry": {
        "title": "Let me try",
        "sentence": {
          "words": [
            "The",
            "twins",
            "finished",
            "their",
            "art",
            "project",
            "before",
            "lunch."
          ]
        },
        "question": "Which word is a pronoun?",
        "choices": [
          {
            "text": "twins",
            "feedback": "The word twins names two people. It is a noun. Look for the word that takes the place of a noun."
          },
          {
            "text": "finished",
            "feedback": "The word finished is the verb. It tells what the twins did. Look for the word that takes the place of a noun."
          },
          {
            "text": "their",
            "feedback": "Nice thinking! their stands for the twins and tells whose art project it is.",
            "correct": true
          },
          {
            "text": "project",
            "feedback": "The word project names a thing. It is a noun. Look for the word that takes the place of a noun."
          }
        ]
      },
      "recap": "A pronoun takes the place of a noun. Ask who or what it stands for, and make sure they match.",
      "tryItBank": {
        "recap": "You practiced finding pronouns, matching them to their nouns, and using words like myself and themselves in 20 different sentences.",
        "stages": [
          {
            "name": "Get Started",
            "desc": "Find the pronoun in each sentence.",
            "mark": "⭐",
            "milestoneTitle": "Get Started complete!",
            "milestoneLine": "You found pronouns that take the place of nouns.",
            "nextStage": "Look Closer"
          },
          {
            "name": "Look Closer",
            "desc": "Find pronouns that show who owns something or who gets something.",
            "mark": "🌟",
            "milestoneTitle": "Look Closer complete!",
            "milestoneLine": "You found pronouns like his, their, us, and them.",
            "nextStage": "Think It Through"
          },
          {
            "name": "Think It Through",
            "desc": "Find the noun each pronoun stands for, and make them match.",
            "mark": "💪",
            "milestoneTitle": "Think It Through complete!",
            "milestoneLine": "You matched pronouns to the nouns they stand for.",
            "nextStage": "Challenge Yourself"
          },
          {
            "name": "Challenge Yourself",
            "desc": "Use words like myself, herself, and themselves correctly.",
            "mark": "🎉",
            "milestoneTitle": "You practiced Pronoun 20 different ways!",
            "milestoneLine": "",
            "nextStage": ""
          }
        ],
        "questions": [
          {
            "stage": 0,
            "std": [
              "GUM:G:personal-pronouns:R"
            ],
            "sentence": {
              "words": [
                "After",
                "school,",
                "she",
                "practiced",
                "the",
                "piano",
                "for",
                "an",
                "hour."
              ]
            },
            "question": "Which word is a pronoun?",
            "choices": [
              {
                "text": "school",
                "feedback": "school names a place. It is a noun. Look for the word that takes the place of a person's name."
              },
              {
                "text": "she",
                "correct": true,
                "feedback": "Nice thinking! she takes the place of a girl's name, so she is a pronoun."
              },
              {
                "text": "practiced",
                "feedback": "practiced is the verb. It tells what happened. Look for the word that takes the place of a noun."
              },
              {
                "text": "piano",
                "feedback": "piano names a thing. It is a noun. Look for the word that takes the place of a noun."
              }
            ],
            "clue": "Remember: a pronoun takes the place of a noun, like he, she, it, we, or they.",
            "reveal": "Let's find it together. she takes the place of a girl's name, so she is the pronoun."
          },
          {
            "stage": 0,
            "std": [
              "GUM:G:personal-pronouns:R"
            ],
            "sentence": {
              "words": [
                "We",
                "carried",
                "the",
                "heavy",
                "boxes",
                "into",
                "the",
                "garage."
              ]
            },
            "question": "Which word is a pronoun?",
            "choices": [
              {
                "text": "We",
                "correct": true,
                "feedback": "You found it! We takes the place of the names of the people doing the carrying."
              },
              {
                "text": "carried",
                "feedback": "carried is the verb. It tells what happened. Look for the word that takes the place of a noun."
              },
              {
                "text": "heavy",
                "feedback": "heavy tells what kind of boxes. It is an adjective. Look for the word that takes the place of a noun."
              },
              {
                "text": "garage",
                "feedback": "garage names a place. It is a noun. Look for the word that takes the place of a noun."
              }
            ],
            "clue": "Remember: a pronoun takes the place of a noun, like he, she, it, we, or they.",
            "reveal": "Let's find it together. We stands for the people doing the carrying, so We is the pronoun."
          },
          {
            "stage": 0,
            "std": [
              "GUM:G:personal-pronouns:R"
            ],
            "sentence": {
              "words": [
                "They",
                "built",
                "a",
                "tall",
                "sandcastle",
                "near",
                "the",
                "ocean."
              ]
            },
            "question": "Which word is a pronoun?",
            "choices": [
              {
                "text": "They",
                "correct": true,
                "feedback": "Great job! They takes the place of the names of the people who built the sandcastle."
              },
              {
                "text": "built",
                "feedback": "built is the verb. It tells what happened. Look for the word that takes the place of a noun."
              },
              {
                "text": "tall",
                "feedback": "tall tells what kind of sandcastle. It is an adjective. Look for the word that takes the place of a noun."
              },
              {
                "text": "ocean",
                "feedback": "ocean names a place. It is a noun. Look for the word that takes the place of a noun."
              }
            ],
            "clue": "Remember: a pronoun takes the place of a noun, like he, she, it, we, or they.",
            "reveal": "Let's find it together. They stands for the people who built the sandcastle, so They is the pronoun."
          },
          {
            "stage": 0,
            "std": [
              "GUM:G:personal-pronouns:R"
            ],
            "sentence": {
              "words": [
                "Last",
                "summer,",
                "he",
                "caught",
                "a",
                "big",
                "fish",
                "at",
                "the",
                "lake."
              ]
            },
            "question": "Which word is a pronoun?",
            "choices": [
              {
                "text": "summer",
                "feedback": "summer names a time of year. It is a noun. Look for the word that takes the place of a person's name."
              },
              {
                "text": "he",
                "correct": true,
                "feedback": "You found it! he takes the place of a boy's name, so he is a pronoun."
              },
              {
                "text": "caught",
                "feedback": "caught is the verb. It tells what happened. Look for the word that takes the place of a noun."
              },
              {
                "text": "fish",
                "feedback": "fish names an animal. It is a noun. Look for the word that takes the place of a noun."
              }
            ],
            "clue": "Remember: a pronoun takes the place of a noun, like he, she, it, we, or they.",
            "reveal": "Let's find it together. he takes the place of a boy's name, so he is the pronoun."
          },
          {
            "stage": 0,
            "std": [
              "GUM:G:personal-pronouns:R"
            ],
            "sentence": {
              "words": [
                "Mom",
                "made",
                "pancakes",
                "for",
                "me",
                "on",
                "Saturday",
                "morning."
              ]
            },
            "question": "Which word is a pronoun?",
            "choices": [
              {
                "text": "Mom",
                "feedback": "Mom names a person. It is a noun, not a pronoun. Look for the word that stands for the person telling this sentence."
              },
              {
                "text": "pancakes",
                "feedback": "pancakes names a thing. It is a noun. Look for the word that takes the place of a noun."
              },
              {
                "text": "me",
                "correct": true,
                "feedback": "Nice thinking! me stands for the person telling the sentence, so me is a pronoun."
              },
              {
                "text": "Saturday",
                "feedback": "Saturday names a day. It is a noun. Look for the word that takes the place of a noun."
              }
            ],
            "clue": "Remember: pronouns like me, him, her, us, and them tell who gets something.",
            "reveal": "Let's find it together. me stands for the person telling the sentence, so me is the pronoun."
          },
          {
            "stage": 1,
            "std": [
              "GUM:G:personal-pronouns:R"
            ],
            "sentence": {
              "words": [
                "The",
                "bird",
                "built",
                "its",
                "nest",
                "in",
                "the",
                "old",
                "oak",
                "tree."
              ]
            },
            "question": "Which word is a pronoun?",
            "choices": [
              {
                "text": "bird",
                "feedback": "bird names an animal. It is a noun. Look for the word that tells whose nest it is."
              },
              {
                "text": "built",
                "feedback": "built is the verb. It tells what the bird did. Look for the word that tells whose nest it is."
              },
              {
                "text": "its",
                "correct": true,
                "feedback": "Great job! its stands for the bird and tells whose nest it is."
              },
              {
                "text": "nest",
                "feedback": "nest names a thing. It is a noun. Look for the word that tells whose nest it is."
              }
            ],
            "clue": "Remember: my, his, her, its, our, and their tell whose something is.",
            "reveal": "Let's find it together. its stands for the bird and shows the nest belongs to the bird, so its is the pronoun."
          },
          {
            "stage": 1,
            "std": [
              "GUM:G:personal-pronouns:R"
            ],
            "sentence": {
              "words": [
                "The",
                "teacher",
                "read",
                "a",
                "funny",
                "story",
                "to",
                "us."
              ]
            },
            "question": "Which word is a pronoun?",
            "choices": [
              {
                "text": "teacher",
                "feedback": "teacher names a person. It is a noun. Look for the word that stands for the people who heard the story."
              },
              {
                "text": "read",
                "feedback": "read is the verb. It tells what the teacher did. Look for the word that takes the place of a noun."
              },
              {
                "text": "funny",
                "feedback": "funny tells what kind of story. It is an adjective. Look for the word that takes the place of a noun."
              },
              {
                "text": "us",
                "correct": true,
                "feedback": "You found it! us stands for the people who heard the story, so us is a pronoun."
              }
            ],
            "clue": "Remember: pronouns like me, him, her, us, and them tell who gets something.",
            "reveal": "Let's find it together. us stands for the people who heard the story, so us is the pronoun."
          },
          {
            "stage": 1,
            "std": [
              "GUM:G:personal-pronouns:R"
            ],
            "sentence": {
              "words": [
                "Jamal",
                "shared",
                "his",
                "crayons",
                "with",
                "the",
                "new",
                "student."
              ]
            },
            "question": "Which word is a pronoun?",
            "choices": [
              {
                "text": "Jamal",
                "feedback": "Jamal names a person. It is a noun, not a pronoun. Look for the word that tells whose crayons they are."
              },
              {
                "text": "shared",
                "feedback": "shared is the verb. It tells what Jamal did. Look for the word that takes the place of a noun."
              },
              {
                "text": "his",
                "correct": true,
                "feedback": "Nice thinking! his stands for Jamal and tells whose crayons they are."
              },
              {
                "text": "crayons",
                "feedback": "crayons names things. It is a noun. Look for the word that tells whose crayons they are."
              }
            ],
            "clue": "Remember: my, his, her, its, our, and their tell whose something is.",
            "reveal": "Let's find it together. his stands for Jamal and shows the crayons are his, so his is the pronoun."
          },
          {
            "stage": 1,
            "std": [
              "GUM:G:personal-pronouns:R"
            ],
            "sentence": {
              "words": [
                "The",
                "players",
                "thanked",
                "their",
                "coach",
                "after",
                "the",
                "game."
              ]
            },
            "question": "Which word is a pronoun?",
            "choices": [
              {
                "text": "players",
                "feedback": "players names people. It is a noun. Look for the word that tells whose coach it is."
              },
              {
                "text": "thanked",
                "feedback": "thanked is the verb. It tells what the players did. Look for the word that takes the place of a noun."
              },
              {
                "text": "their",
                "correct": true,
                "feedback": "Great job! their stands for the players and tells whose coach it is."
              },
              {
                "text": "coach",
                "feedback": "coach names a person. It is a noun. Look for the word that tells whose coach it is."
              }
            ],
            "clue": "Remember: my, his, her, its, our, and their tell whose something is.",
            "reveal": "Let's find it together. their stands for the players and shows the coach is theirs, so their is the pronoun."
          },
          {
            "stage": 1,
            "std": [
              "GUM:G:personal-pronouns:R"
            ],
            "sentence": {
              "words": [
                "Grandma",
                "gave",
                "them",
                "warm",
                "cookies",
                "after",
                "dinner."
              ]
            },
            "question": "Which word is a pronoun?",
            "choices": [
              {
                "text": "Grandma",
                "feedback": "Grandma names a person. It is a noun, not a pronoun. Look for the word that stands for the people who got the cookies."
              },
              {
                "text": "gave",
                "feedback": "gave is the verb. It tells what Grandma did. Look for the word that takes the place of a noun."
              },
              {
                "text": "them",
                "correct": true,
                "feedback": "You found it! them stands for the people who got the cookies, so them is a pronoun."
              },
              {
                "text": "cookies",
                "feedback": "cookies names things. It is a noun. Look for the word that takes the place of a noun."
              }
            ],
            "clue": "Remember: pronouns like me, him, her, us, and them tell who gets something.",
            "reveal": "Let's find it together. them stands for the people who got the cookies, so them is the pronoun."
          },
          {
            "stage": 2,
            "std": [
              "GUM:U:pronoun-antecedent:C"
            ],
            "sentence": {
              "words": [
                "The",
                "yarn",
                "rolled",
                "under",
                "the",
                "couch,",
                "so",
                "the",
                "kitten",
                "chased",
                "it."
              ]
            },
            "question": "What does the word it stand for in this sentence?",
            "choices": [
              {
                "text": "yarn",
                "correct": true,
                "feedback": "Nice thinking! The kitten chased the yarn, so it stands for the yarn."
              },
              {
                "text": "couch",
                "feedback": "The yarn rolled under the couch, but the kitten did not chase the couch. Look for what the kitten chased."
              },
              {
                "text": "kitten",
                "feedback": "The kitten is the one doing the chasing. it is what got chased. Look for what the kitten chased."
              },
              {
                "text": "rolled",
                "feedback": "rolled is a verb. A pronoun stands for a noun. Look for what the kitten chased."
              }
            ],
            "clue": "Remember: put the noun in place of the pronoun and see if the sentence still makes sense.",
            "reveal": "Let's find it together. What rolled under the couch? The yarn. The kitten chased the yarn, so it stands for yarn."
          },
          {
            "stage": 2,
            "std": [
              "GUM:U:pronoun-antecedent:C"
            ],
            "sentence": {
              "words": [
                "Ava",
                "and",
                "Ben",
                "finished",
                "the",
                "puzzle,",
                "and",
                "they",
                "cheered."
              ]
            },
            "question": "Who does the word they stand for in this sentence?",
            "choices": [
              {
                "text": "Ava and Ben",
                "correct": true,
                "feedback": "You found it! they means more than one, and Ava and Ben are two people. Ava and Ben cheered."
              },
              {
                "text": "Ava",
                "feedback": "Ava is only one person. they means more than one. Who finished the puzzle together?"
              },
              {
                "text": "the puzzle",
                "feedback": "A puzzle cannot cheer. Look for who cheered."
              },
              {
                "text": "cheered",
                "feedback": "cheered is the verb. A pronoun stands for a noun. Look for who cheered."
              }
            ],
            "clue": "Remember: they stands for two or more. Find all the people it could mean.",
            "reveal": "Let's find it together. Who finished the puzzle? Ava and Ben. they means more than one, so they stands for Ava and Ben."
          },
          {
            "stage": 2,
            "std": [
              "GUM:U:pronoun-antecedent:C"
            ],
            "sentence": {
              "words": [
                "My",
                "aunt",
                "lives",
                "in",
                "Ohio,",
                "and",
                "she",
                "visits",
                "us",
                "every",
                "summer."
              ]
            },
            "question": "Who does the word she stand for in this sentence?",
            "choices": [
              {
                "text": "Ohio",
                "feedback": "Ohio names a place. A place cannot visit. Look for who visits us every summer."
              },
              {
                "text": "aunt",
                "correct": true,
                "feedback": "Great job! she stands for my aunt. My aunt visits us every summer."
              },
              {
                "text": "summer",
                "feedback": "summer names a time of year. Look for who visits us every summer."
              },
              {
                "text": "visits",
                "feedback": "visits is the verb. A pronoun stands for a noun. Look for who visits."
              }
            ],
            "clue": "Remember: put the noun in place of the pronoun and see if the sentence still makes sense.",
            "reveal": "Let's find it together. Who lives in Ohio? My aunt. My aunt visits us every summer, so she stands for aunt."
          },
          {
            "stage": 2,
            "std": [
              "GUM:U:pronoun-antecedent:C"
            ],
            "sentence": {
              "words": [
                "The",
                "students",
                "cleaned",
                "the",
                "classroom",
                "before",
                "they",
                "went",
                "home."
              ]
            },
            "question": "Who does the word they stand for in this sentence?",
            "choices": [
              {
                "text": "classroom",
                "feedback": "classroom is one place, and a place cannot go home. Look for who went home."
              },
              {
                "text": "students",
                "correct": true,
                "feedback": "Nice thinking! they stands for the students. The students went home."
              },
              {
                "text": "home",
                "feedback": "home is where they went. Look for who went home."
              },
              {
                "text": "cleaned",
                "feedback": "cleaned is the verb. A pronoun stands for a noun. Look for who went home."
              }
            ],
            "clue": "Remember: they stands for two or more. Put the noun in its place and check.",
            "reveal": "Let's find it together. Who cleaned the classroom? The students. The students went home, so they stands for students."
          },
          {
            "stage": 2,
            "std": [
              "GUM:U:pronoun-antecedent:C"
            ],
            "sentence": {
              "words": [
                "The",
                "puppies",
                "were",
                "hungry,",
                "so",
                "____",
                "ate",
                "all",
                "the",
                "food."
              ]
            },
            "question": "Which pronoun belongs in the blank?",
            "choices": [
              {
                "text": "it",
                "feedback": "it stands for one thing. puppies means more than one, so the pronoun must mean more than one too."
              },
              {
                "text": "he",
                "feedback": "he stands for one boy or one male animal. puppies means more than one."
              },
              {
                "text": "they",
                "correct": true,
                "feedback": "You found it! puppies means more than one, so the pronoun is they."
              },
              {
                "text": "she",
                "feedback": "she stands for one girl or one female animal. puppies means more than one."
              }
            ],
            "clue": "Remember: the pronoun must match its noun. One is he, she, or it. More than one is they.",
            "reveal": "Let's find it together. The noun is puppies, which means more than one. More than one is they."
          },
          {
            "stage": 3,
            "std": [
              "GUM:G:reflexive-pronouns:M",
              "GUM:U:pronoun-antecedent:C"
            ],
            "sentence": {
              "words": [
                "Maya",
                "fixed",
                "her",
                "bike",
                "all",
                "by",
                "____."
              ]
            },
            "question": "Which word belongs in the blank?",
            "choices": [
              {
                "text": "herself",
                "correct": true,
                "feedback": "Great job! Maya is one girl, so the word is herself."
              },
              {
                "text": "himself",
                "feedback": "himself points back to one boy. Maya is a girl."
              },
              {
                "text": "themselves",
                "feedback": "themselves points back to two or more. Maya is one person."
              },
              {
                "text": "myself",
                "feedback": "myself points back to the person telling the sentence. Maya fixed the bike."
              }
            ],
            "clue": "Remember: words that end in -self or -selves point back to the person who did the action.",
            "reveal": "Let's find it together. Who fixed the bike? Maya, one girl. The word that points back to one girl is herself."
          },
          {
            "stage": 3,
            "std": [
              "GUM:G:reflexive-pronouns:M",
              "GUM:U:pronoun-antecedent:C"
            ],
            "sentence": {
              "words": [
                "I",
                "made",
                "____",
                "a",
                "peanut",
                "butter",
                "sandwich",
                "for",
                "lunch."
              ]
            },
            "question": "Which word belongs in the blank?",
            "choices": [
              {
                "text": "me",
                "feedback": "In correct writing, when the person doing the action is the same person getting it, use a word that ends in -self. I made the sandwich for myself."
              },
              {
                "text": "myself",
                "correct": true,
                "feedback": "You found it! I made the sandwich for the same person who made it, so the word is myself."
              },
              {
                "text": "yourself",
                "feedback": "yourself points back to you, the person being talked to. The sentence starts with I."
              },
              {
                "text": "themselves",
                "feedback": "themselves points back to two or more people. The sentence starts with I."
              }
            ],
            "clue": "Remember: I goes with myself. He goes with himself. She goes with herself. They go with themselves.",
            "reveal": "Let's find it together. The sentence starts with I, and I made the sandwich for the same person. I goes with myself."
          },
          {
            "stage": 3,
            "std": [
              "GUM:G:reflexive-pronouns:M",
              "GUM:U:pronoun-antecedent:C"
            ],
            "sentence": {
              "words": [
                "The",
                "boys",
                "taught",
                "____",
                "how",
                "to",
                "juggle",
                "three",
                "balls."
              ]
            },
            "question": "Which word belongs in the blank?",
            "choices": [
              {
                "text": "theirselves",
                "feedback": "theirselves is not used in correct writing. The correct word for more than one is themselves."
              },
              {
                "text": "themselves",
                "correct": true,
                "feedback": "Nice thinking! boys means more than one, so the word is themselves."
              },
              {
                "text": "himself",
                "feedback": "himself points back to one boy. boys means more than one."
              },
              {
                "text": "ourselves",
                "feedback": "ourselves points back to we. The sentence is about the boys, not us."
              }
            ],
            "clue": "Remember: more than one person goes with themselves.",
            "reveal": "Let's find it together. Who taught? The boys, more than one. More than one goes with themselves."
          },
          {
            "stage": 3,
            "std": [
              "GUM:G:reflexive-pronouns:M",
              "GUM:U:pronoun-antecedent:C"
            ],
            "sentence": {
              "words": [
                "Ben",
                "looked",
                "at",
                "____",
                "in",
                "the",
                "bathroom",
                "mirror."
              ]
            },
            "question": "Which word belongs in the blank?",
            "choices": [
              {
                "text": "hisself",
                "feedback": "hisself is not used in correct writing. The correct word for one boy is himself."
              },
              {
                "text": "herself",
                "feedback": "herself points back to one girl. Ben is a boy."
              },
              {
                "text": "himself",
                "correct": true,
                "feedback": "Great job! Ben is one boy, so the word is himself."
              },
              {
                "text": "themselves",
                "feedback": "themselves points back to two or more. Ben is one person."
              }
            ],
            "clue": "Remember: one boy goes with himself. One girl goes with herself.",
            "reveal": "Let's find it together. Who looked in the mirror? Ben, one boy. One boy goes with himself."
          },
          {
            "stage": 3,
            "std": [
              "GUM:G:reflexive-pronouns:M",
              "GUM:U:pronoun-antecedent:C"
            ],
            "sentence": {
              "words": [
                "We",
                "made",
                "____",
                "a",
                "big",
                "fort",
                "out",
                "of",
                "blankets."
              ]
            },
            "question": "Which word belongs in the blank?",
            "choices": [
              {
                "text": "ourselves",
                "correct": true,
                "feedback": "You found it! The sentence starts with We, so the word is ourselves."
              },
              {
                "text": "us",
                "feedback": "In correct writing, when the people doing the action are the same people getting it, use a word that ends in -selves. We made the fort for ourselves."
              },
              {
                "text": "themselves",
                "feedback": "themselves points back to they. The sentence starts with We."
              },
              {
                "text": "myself",
                "feedback": "myself points back to I, one person. We means more than one."
              }
            ],
            "clue": "Remember: we goes with ourselves.",
            "reveal": "Let's find it together. The sentence starts with We. We goes with ourselves."
          }
        ]
      },
      "studyGuide": {
        "title": "Pronoun Study Guide",
        "sections": [
          {
            "heading": "Who does it",
            "chips": [
              "I",
              "you",
              "he",
              "she",
              "it",
              "we",
              "they"
            ]
          },
          {
            "heading": "Who gets it",
            "chips": [
              "me",
              "you",
              "him",
              "her",
              "it",
              "us",
              "them"
            ]
          },
          {
            "heading": "Whose is it",
            "chips": [
              "my",
              "your",
              "his",
              "her",
              "its",
              "our",
              "their"
            ]
          },
          {
            "heading": "Points back to the same person or thing",
            "chips": [
              "myself",
              "yourself",
              "himself",
              "herself",
              "itself",
              "ourselves",
              "themselves"
            ]
          }
        ],
        "reminder": "One is he, she, or it. More than one is they. When the noun is in the sentence, the pronoun must match it."
      }
    },

    /* ===================================================== */
    /* ADVERB                                              */
    /* Build 1.5.0 — Georgia grade 3 skill. Bank reviewed     */
    /* independently (see AUDIT-REPORT-Build-1.5.0.md).       */
    /* ===================================================== */
    "adverb": {
      "name": "Adverb",
      "badge": "quietly",
      "card": "Tell how, when, or where.",
      "color": "adverb",
      "ask": "How? When? Where?",
      "icon": "gauge",
      "preview": {
        "words": [
          "The",
          "class",
          "waited",
          "quietly."
        ],
        "start": 3,
        "end": 3
      },
      "practice": "bank",
      "test": "soon",
      "ga": [
        {
          "code": "3.L.GC.2.d",
          "label": "Add detail with adverbs"
        },
        {
          "code": "3-5.L.GC.1",
          "label": "Adjectives and adverbs (R)"
        },
        {
          "code": "3.L.V.2.b",
          "label": "-ly signals an adverb"
        }
      ],
      "definition": {
        "title": "What is an adverb?",
        "callout": {
          "title": "An adverb tells more about a verb.",
          "rows": [
            {
              "key": "HOW",
              "text": "quietly, quickly, carefully"
            },
            {
              "key": "WHEN",
              "text": "yesterday, today, soon"
            },
            {
              "key": "WHERE",
              "text": "outside, upstairs, here"
            }
          ]
        },
        "contrast": {
          "heading": "Adverbs tell about the verb",
          "rows": [
            {
              "sentence": {
                "words": [
                  "The",
                  "happy",
                  "students",
                  "cheered",
                  "loudly",
                  "for",
                  "their",
                  "team."
                ],
                "marks": [
                  {
                    "start": 3,
                    "end": 3,
                    "kind": "verb",
                    "label": "VERB"
                  },
                  {
                    "start": 4,
                    "end": 4,
                    "kind": "adverb",
                    "label": "HOW?"
                  }
                ],
                "links": [
                  {
                    "from": 4,
                    "to": 3,
                    "text": "tells how"
                  }
                ]
              },
              "text": "loudly tells how the students cheered."
            },
            {
              "sentence": {
                "words": [
                  "Yesterday",
                  "my",
                  "brother",
                  "cleaned",
                  "his",
                  "messy",
                  "room."
                ],
                "marks": [
                  {
                    "start": 0,
                    "end": 0,
                    "kind": "adverb",
                    "label": "WHEN?"
                  },
                  {
                    "start": 3,
                    "end": 3,
                    "kind": "verb",
                    "label": "VERB"
                  }
                ],
                "links": [
                  {
                    "from": 0,
                    "to": 3,
                    "text": "tells when"
                  }
                ]
              },
              "text": "Yesterday tells when he cleaned."
            }
          ]
        },
        "note": "Some adverbs tell about an adjective, like very in very cold. Here we find adverbs that tell about verbs."
      },
      "clue": {
        "title": "How do I find the adverb?",
        "callout": {
          "title": "Find the verb, then ask:",
          "big": [
            "How?",
            "When?",
            "Where?"
          ]
        },
        "list": [
          "The one word that answers is the adverb."
        ],
        "warning": "Many adverbs end in -ly, but that is a clue, not a rule. friendly and lovely end in -ly, but they describe nouns, so they are adjectives."
      },
      "example": {
        "title": "Let's find the adverb",
        "sentence": {
          "words": [
            "The",
            "small",
            "puppy",
            "waited",
            "patiently",
            "by",
            "the",
            "front",
            "door."
          ],
          "marks": [
            {
              "start": 3,
              "end": 3,
              "kind": "verb",
              "label": "VERB"
            },
            {
              "start": 4,
              "end": 4,
              "kind": "adverb",
              "label": "HOW?"
            }
          ],
          "links": [
            {
              "from": 4,
              "to": 3,
              "text": "tells how"
            }
          ]
        },
        "routine": [
          "Read the sentence.",
          "Find the verb: waited.",
          "Ask: How did the puppy wait? Patiently.",
          "patiently is the adverb."
        ],
        "noteTitle": "Adjective or adverb?",
        "note": "small describes the noun puppy, so it is an adjective. patiently tells about the verb waited, so it is an adverb."
      },
      "learnTry": {
        "title": "Let me try",
        "sentence": {
          "words": [
            "After",
            "lunch,",
            "the",
            "kids",
            "ran",
            "outside",
            "to",
            "the",
            "playground."
          ]
        },
        "question": "Which word tells where the kids ran?",
        "choices": [
          {
            "text": "lunch",
            "feedback": "The word lunch names a meal. It is a noun. After lunch tells when, not where."
          },
          {
            "text": "kids",
            "feedback": "The word kids names people. It is a noun. Ask: Where did the kids run?"
          },
          {
            "text": "ran",
            "feedback": "The word ran is the verb. Now ask: Where did the kids run?"
          },
          {
            "text": "outside",
            "feedback": "You found it! outside tells where the kids ran, so it is the adverb.",
            "correct": true
          }
        ]
      },
      "recap": "An adverb tells how, when, or where. Find the verb, then ask: How? When? Where?",
      "tryItBank": {
        "recap": "You practiced finding adverbs and choosing between adverbs and adjectives in 20 different sentences.",
        "stages": [
          {
            "name": "Get Started",
            "desc": "Find adverbs that tell how.",
            "mark": "⭐",
            "milestoneTitle": "Get Started complete!",
            "milestoneLine": "You found adverbs that tell how something happened.",
            "nextStage": "Look Closer"
          },
          {
            "name": "Look Closer",
            "desc": "Find adverbs that tell when and where.",
            "mark": "🌟",
            "milestoneTitle": "Look Closer complete!",
            "milestoneLine": "You found adverbs that tell when and where.",
            "nextStage": "Think It Through"
          },
          {
            "name": "Think It Through",
            "desc": "Adverb or adjective? Watch out for -ly words that describe nouns.",
            "mark": "💪",
            "milestoneTitle": "Think It Through complete!",
            "milestoneLine": "You checked the job of each word instead of trusting the ending.",
            "nextStage": "Challenge Yourself"
          },
          {
            "name": "Challenge Yourself",
            "desc": "Choose the right word to finish each sentence.",
            "mark": "🎉",
            "milestoneTitle": "You practiced Adverb 20 different ways!",
            "milestoneLine": "",
            "nextStage": ""
          }
        ],
        "questions": [
          {
            "stage": 0,
            "std": [
              "3.L.GC.2.d",
              "GUM:G:adjectives-adverbs:R"
            ],
            "sentence": {
              "words": [
                "The",
                "tall",
                "runner",
                "walked",
                "slowly",
                "across",
                "the",
                "finish",
                "line."
              ]
            },
            "question": "Which word tells how the runner walked?",
            "choices": [
              {
                "text": "tall",
                "feedback": "tall tells what kind of runner. It describes a noun, so it is an adjective. Look for the word that tells how the runner walked."
              },
              {
                "text": "runner",
                "feedback": "runner names a person. It is a noun. Look for the word that tells how the runner walked."
              },
              {
                "text": "walked",
                "feedback": "walked is the verb. It tells what the runner did. Now ask: How did the runner walk?"
              },
              {
                "text": "slowly",
                "correct": true,
                "feedback": "Nice thinking! slowly tells how the runner walked, so slowly is the adverb."
              }
            ],
            "clue": "Remember: find the verb, then ask: How?",
            "reveal": "Let's find it together. The verb is walked. How did the runner walk? Slowly. So slowly is the adverb."
          },
          {
            "stage": 0,
            "std": [
              "3.L.GC.2.d",
              "GUM:G:adjectives-adverbs:R"
            ],
            "sentence": {
              "words": [
                "Grandma",
                "carefully",
                "poured",
                "the",
                "hot",
                "soup",
                "into",
                "small",
                "bowls."
              ]
            },
            "question": "Which word tells how Grandma poured the soup?",
            "choices": [
              {
                "text": "carefully",
                "correct": true,
                "feedback": "You found it! carefully tells how Grandma poured the soup. An adverb can come before the verb."
              },
              {
                "text": "poured",
                "feedback": "poured is the verb. It tells what Grandma did. Now ask: How did she pour?"
              },
              {
                "text": "hot",
                "feedback": "hot tells what kind of soup. It describes a noun, so it is an adjective. Look for the word that tells how she poured."
              },
              {
                "text": "bowls",
                "feedback": "bowls names a thing. It is a noun. Look for the word that tells how Grandma poured."
              }
            ],
            "clue": "Remember: find the verb, then ask: How? The adverb can come before the verb.",
            "reveal": "Let's find it together. The verb is poured. How did Grandma pour? Carefully. So carefully is the adverb."
          },
          {
            "stage": 0,
            "std": [
              "3.L.GC.2.d",
              "GUM:G:adjectives-adverbs:R"
            ],
            "sentence": {
              "words": [
                "The",
                "happy",
                "children",
                "sang",
                "loudly",
                "during",
                "the",
                "school",
                "concert."
              ]
            },
            "question": "Which word tells how the children sang?",
            "choices": [
              {
                "text": "happy",
                "feedback": "happy tells what kind of children. It describes a noun, so it is an adjective. Look for the word that tells how they sang."
              },
              {
                "text": "sang",
                "feedback": "sang is the verb. It tells what the children did. Now ask: How did they sing?"
              },
              {
                "text": "loudly",
                "correct": true,
                "feedback": "Great job! loudly tells how the children sang, so loudly is the adverb."
              },
              {
                "text": "concert",
                "feedback": "concert names a thing that happened. It is a noun. Look for the word that tells how they sang."
              }
            ],
            "clue": "Remember: find the verb, then ask: How?",
            "reveal": "Let's find it together. The verb is sang. How did the children sing? Loudly. So loudly is the adverb."
          },
          {
            "stage": 0,
            "std": [
              "3.L.GC.2.d",
              "GUM:G:adjectives-adverbs:R"
            ],
            "sentence": {
              "words": [
                "The",
                "curious",
                "kitten",
                "sniffed",
                "gently",
                "at",
                "the",
                "bright",
                "flowers."
              ]
            },
            "question": "Which word tells how the kitten sniffed?",
            "choices": [
              {
                "text": "curious",
                "feedback": "curious tells what kind of kitten. It describes a noun, so it is an adjective. Look for the word that tells how the kitten sniffed."
              },
              {
                "text": "kitten",
                "feedback": "kitten names an animal. It is a noun. Look for the word that tells how it sniffed."
              },
              {
                "text": "sniffed",
                "feedback": "sniffed is the verb. It tells what the kitten did. Now ask: How did it sniff?"
              },
              {
                "text": "gently",
                "correct": true,
                "feedback": "You found it! gently tells how the kitten sniffed, so gently is the adverb."
              }
            ],
            "clue": "Remember: find the verb, then ask: How?",
            "reveal": "Let's find it together. The verb is sniffed. How did the kitten sniff? Gently. So gently is the adverb."
          },
          {
            "stage": 0,
            "std": [
              "3.L.GC.2.d",
              "GUM:G:adjectives-adverbs:R"
            ],
            "sentence": {
              "words": [
                "Marcus",
                "quickly",
                "finished",
                "his",
                "math",
                "homework",
                "before",
                "dinner."
              ]
            },
            "question": "Which word tells how Marcus finished his homework?",
            "choices": [
              {
                "text": "Marcus",
                "feedback": "Marcus names a person. It is a noun. Look for the word that tells how he finished."
              },
              {
                "text": "quickly",
                "correct": true,
                "feedback": "Nice thinking! quickly tells how Marcus finished, so quickly is the adverb."
              },
              {
                "text": "finished",
                "feedback": "finished is the verb. It tells what Marcus did. Now ask: How did he finish?"
              },
              {
                "text": "homework",
                "feedback": "homework names a thing. It is a noun. Look for the word that tells how Marcus finished."
              }
            ],
            "clue": "Remember: find the verb, then ask: How? The adverb can come before the verb.",
            "reveal": "Let's find it together. The verb is finished. How did Marcus finish? Quickly. So quickly is the adverb."
          },
          {
            "stage": 1,
            "std": [
              "3.L.GC.2.d",
              "GUM:G:adjectives-adverbs:R"
            ],
            "sentence": {
              "words": [
                "Yesterday",
                "our",
                "class",
                "planted",
                "sunflower",
                "seeds",
                "in",
                "the",
                "garden."
              ]
            },
            "question": "Which word tells when the class planted the seeds?",
            "choices": [
              {
                "text": "Yesterday",
                "correct": true,
                "feedback": "Great job! Yesterday tells when the class planted, so Yesterday is the adverb."
              },
              {
                "text": "planted",
                "feedback": "planted is the verb. It tells what the class did. Now ask: When did they plant?"
              },
              {
                "text": "seeds",
                "feedback": "seeds names a thing. It is a noun. Look for the word that tells when."
              },
              {
                "text": "garden",
                "feedback": "garden names a place. It is a noun. The words in the garden tell where, not when. Look for the one word that tells when."
              }
            ],
            "clue": "Remember: find the verb, then ask: When?",
            "reveal": "Let's find it together. The verb is planted. When did the class plant? Yesterday. So Yesterday is the adverb."
          },
          {
            "stage": 1,
            "std": [
              "3.L.GC.2.d",
              "GUM:G:adjectives-adverbs:R"
            ],
            "sentence": {
              "words": [
                "After",
                "lunch,",
                "the",
                "eager",
                "players",
                "ran",
                "outside."
              ]
            },
            "question": "Which word tells where the players ran?",
            "choices": [
              {
                "text": "lunch",
                "feedback": "lunch names a thing. It is a noun. After lunch tells when, not where. Look for the word that tells where the players ran."
              },
              {
                "text": "eager",
                "feedback": "eager tells what kind of players. It describes a noun, so it is an adjective. Look for the word that tells where they ran."
              },
              {
                "text": "ran",
                "feedback": "ran is the verb. It tells what the players did. Now ask: Where did they run?"
              },
              {
                "text": "outside",
                "correct": true,
                "feedback": "You found it! outside tells where the players ran, so outside is the adverb."
              }
            ],
            "clue": "Remember: find the verb, then ask: Where?",
            "reveal": "Let's find it together. The verb is ran. Where did the players run? Outside. So outside is the adverb."
          },
          {
            "stage": 1,
            "std": [
              "3.L.GC.2.d",
              "GUM:G:adjectives-adverbs:R"
            ],
            "sentence": {
              "words": [
                "Soon",
                "the",
                "yellow",
                "bus",
                "will",
                "stop",
                "at",
                "our",
                "corner."
              ]
            },
            "question": "Which word tells when the bus will stop?",
            "choices": [
              {
                "text": "Soon",
                "correct": true,
                "feedback": "Nice thinking! Soon tells when the bus will stop, so Soon is the adverb."
              },
              {
                "text": "yellow",
                "feedback": "yellow tells what color the bus is. It describes a noun, so it is an adjective. Look for the word that tells when."
              },
              {
                "text": "bus",
                "feedback": "bus names a thing. It is a noun. Look for the word that tells when the bus will stop."
              },
              {
                "text": "corner",
                "feedback": "corner names a place. It is a noun. The words at our corner tell where, not when. Look for the one word that tells when."
              }
            ],
            "clue": "Remember: find the verb, then ask: When?",
            "reveal": "Let's find it together. The verb is will stop. When will the bus stop? Soon. So Soon is the adverb."
          },
          {
            "stage": 1,
            "std": [
              "3.L.GC.2.d",
              "GUM:G:adjectives-adverbs:R"
            ],
            "sentence": {
              "words": [
                "My",
                "little",
                "sister",
                "reads",
                "her",
                "favorite",
                "books",
                "upstairs."
              ]
            },
            "question": "Which word tells where my sister reads?",
            "choices": [
              {
                "text": "little",
                "feedback": "little tells what kind of sister. It describes a noun, so it is an adjective. Look for the word that tells where she reads."
              },
              {
                "text": "reads",
                "feedback": "reads is the verb. It tells what my sister does. Now ask: Where does she read?"
              },
              {
                "text": "books",
                "feedback": "books names a thing. It is a noun. Look for the word that tells where she reads."
              },
              {
                "text": "upstairs",
                "correct": true,
                "feedback": "Great job! upstairs tells where my sister reads, so upstairs is the adverb."
              }
            ],
            "clue": "Remember: find the verb, then ask: Where?",
            "reveal": "Let's find it together. The verb is reads. Where does she read? Upstairs. So upstairs is the adverb."
          },
          {
            "stage": 1,
            "std": [
              "3.L.GC.2.d",
              "GUM:G:adjectives-adverbs:R"
            ],
            "sentence": {
              "words": [
                "Today",
                "the",
                "art",
                "teacher",
                "showed",
                "us",
                "a",
                "new",
                "painting."
              ]
            },
            "question": "Which word tells when the teacher showed the painting?",
            "choices": [
              {
                "text": "Today",
                "correct": true,
                "feedback": "You found it! Today tells when the teacher showed the painting, so Today is the adverb."
              },
              {
                "text": "showed",
                "feedback": "showed is the verb. It tells what the teacher did. Now ask: When did the teacher show it?"
              },
              {
                "text": "new",
                "feedback": "new tells what kind of painting. It describes a noun, so it is an adjective. Look for the word that tells when."
              },
              {
                "text": "painting",
                "feedback": "painting names a thing. It is a noun. Look for the word that tells when."
              }
            ],
            "clue": "Remember: find the verb, then ask: When?",
            "reveal": "Let's find it together. The verb is showed. When did the teacher show it? Today. So Today is the adverb."
          },
          {
            "stage": 2,
            "std": [
              "3.L.GC.2.d",
              "GUM:G:adjectives-adverbs:R",
              "3.L.V.2.b"
            ],
            "sentence": {
              "words": [
                "The",
                "friendly",
                "mail",
                "carrier",
                "smiled",
                "warmly",
                "at",
                "our",
                "family."
              ]
            },
            "question": "Which word is the adverb?",
            "choices": [
              {
                "text": "friendly",
                "feedback": "friendly ends in -ly, but it tells what kind of mail carrier. It describes a noun, so it is an adjective. Look for the word that tells how the mail carrier smiled."
              },
              {
                "text": "carrier",
                "feedback": "carrier names a person. It is a noun. Look for the word that tells more about the verb."
              },
              {
                "text": "smiled",
                "feedback": "smiled is the verb. Now ask: How did the mail carrier smile?"
              },
              {
                "text": "warmly",
                "correct": true,
                "feedback": "Great job! warmly tells how the mail carrier smiled. friendly also ends in -ly, but it describes a noun."
              }
            ],
            "clue": "Remember: an -ly ending is only a clue. Find the verb and ask: How? When? Where?",
            "reveal": "Let's find it together. The verb is smiled. How did the mail carrier smile? Warmly. So warmly is the adverb. friendly describes the mail carrier, so it is an adjective."
          },
          {
            "stage": 2,
            "std": [
              "3.L.GC.2.d",
              "GUM:G:adjectives-adverbs:R",
              "3.L.V.2.b"
            ],
            "sentence": {
              "words": [
                "The",
                "lovely",
                "garden",
                "grew",
                "quickly",
                "after",
                "the",
                "spring",
                "rain."
              ]
            },
            "question": "Which word is the adverb?",
            "choices": [
              {
                "text": "lovely",
                "feedback": "lovely ends in -ly, but it tells what kind of garden. It describes a noun, so it is an adjective. Look for the word that tells how the garden grew."
              },
              {
                "text": "garden",
                "feedback": "garden names a place. It is a noun. Look for the word that tells more about the verb."
              },
              {
                "text": "grew",
                "feedback": "grew is the verb. Now ask: How did the garden grow?"
              },
              {
                "text": "quickly",
                "correct": true,
                "feedback": "You found it! quickly tells how the garden grew. lovely ends in -ly too, but it describes the garden."
              }
            ],
            "clue": "Remember: an -ly ending is only a clue. Find the verb and ask: How? When? Where?",
            "reveal": "Let's find it together. The verb is grew. How did the garden grow? Quickly. So quickly is the adverb. lovely describes the garden, so it is an adjective."
          },
          {
            "stage": 2,
            "std": [
              "3.L.GC.2.d",
              "GUM:G:adjectives-adverbs:R",
              "3.L.V.2.b"
            ],
            "sentence": {
              "words": [
                "A",
                "lonely",
                "duck",
                "swam",
                "slowly",
                "across",
                "the",
                "quiet",
                "pond."
              ]
            },
            "question": "Which word is the adverb?",
            "choices": [
              {
                "text": "lonely",
                "feedback": "lonely ends in -ly, but it tells what kind of duck. It describes a noun, so it is an adjective. Look for the word that tells how the duck swam."
              },
              {
                "text": "swam",
                "feedback": "swam is the verb. Now ask: How did the duck swim?"
              },
              {
                "text": "slowly",
                "correct": true,
                "feedback": "Nice thinking! slowly tells how the duck swam, so slowly is the adverb."
              },
              {
                "text": "quiet",
                "feedback": "quiet tells what kind of pond. It describes a noun, so it is an adjective. Look for the word that tells how the duck swam."
              }
            ],
            "clue": "Remember: an -ly ending is only a clue. Find the verb and ask: How? When? Where?",
            "reveal": "Let's find it together. The verb is swam. How did the duck swim? Slowly. So slowly is the adverb. lonely describes the duck, so it is an adjective."
          },
          {
            "stage": 2,
            "std": [
              "3.L.GC.2.d",
              "GUM:G:adjectives-adverbs:R"
            ],
            "sentence": {
              "words": [
                "Every",
                "morning,",
                "my",
                "grandfather",
                "walks",
                "quickly",
                "around",
                "the",
                "block."
              ]
            },
            "question": "Which word is the adverb?",
            "choices": [
              {
                "text": "morning",
                "feedback": "morning names a time of day. It is a noun. Look for the word that tells how my grandfather walks."
              },
              {
                "text": "walks",
                "feedback": "walks is the verb. Now ask: How does my grandfather walk?"
              },
              {
                "text": "quickly",
                "correct": true,
                "feedback": "Great job! quickly tells how my grandfather walks, so quickly is the adverb."
              },
              {
                "text": "block",
                "feedback": "block names a place. It is a noun. Look for the word that tells how he walks."
              }
            ],
            "clue": "Remember: find the verb, then ask: How? When? Where?",
            "reveal": "Let's find it together. The verb is walks. How does he walk? Quickly. So quickly is the adverb."
          },
          {
            "stage": 2,
            "std": [
              "3.L.GC.2.d",
              "GUM:G:adjectives-adverbs:R",
              "3.L.V.2.b"
            ],
            "sentence": {
              "words": [
                "The",
                "silly",
                "clown",
                "tripped",
                "clumsily",
                "over",
                "his",
                "giant",
                "shoes."
              ]
            },
            "question": "Which word is the adverb?",
            "choices": [
              {
                "text": "silly",
                "feedback": "silly ends in -ly, but it tells what kind of clown. It describes a noun, so it is an adjective. Look for the word that tells how the clown tripped."
              },
              {
                "text": "tripped",
                "feedback": "tripped is the verb. Now ask: How did the clown trip?"
              },
              {
                "text": "clumsily",
                "correct": true,
                "feedback": "You found it! clumsily tells how the clown tripped. silly ends in -ly too, but it describes the clown."
              },
              {
                "text": "giant",
                "feedback": "giant tells what kind of shoes. It describes a noun, so it is an adjective. Look for the word that tells how the clown tripped."
              }
            ],
            "clue": "Remember: an -ly ending is only a clue. Find the verb and ask: How? When? Where?",
            "reveal": "Let's find it together. The verb is tripped. How did the clown trip? Clumsily. So clumsily is the adverb. silly describes the clown, so it is an adjective."
          },
          {
            "stage": 3,
            "std": [
              "3.L.GC.2.d",
              "GUM:G:adjectives-adverbs:R",
              "3.L.V.2.b"
            ],
            "sentence": {
              "words": [
                "The",
                "painter",
                "worked",
                "____",
                "on",
                "the",
                "tiny",
                "details."
              ]
            },
            "question": "Which word belongs in the blank?",
            "choices": [
              {
                "text": "carefully",
                "correct": true,
                "feedback": "Nice thinking! The blank tells how the painter worked, so it needs the adverb carefully."
              },
              {
                "text": "careful",
                "feedback": "careful is an adjective. It describes a noun, like a careful painter. The blank tells how the painter worked, so it needs an adverb."
              },
              {
                "text": "care",
                "feedback": "care is a noun or a verb. The blank tells how the painter worked, so it needs an adverb."
              },
              {
                "text": "cared",
                "feedback": "cared is a verb. The sentence already has its verb, worked. The blank tells how the painter worked."
              }
            ],
            "clue": "Remember: ask whether the blank tells about a noun or about the verb. An adverb tells how, when, or where.",
            "reveal": "Let's find it together. The blank tells how the painter worked. A word that tells how is an adverb, so the answer is carefully."
          },
          {
            "stage": 3,
            "std": [
              "3.L.GC.2.d",
              "GUM:G:adjectives-adverbs:R",
              "3.L.V.2.b"
            ],
            "sentence": {
              "words": [
                "The",
                "children",
                "played",
                "____",
                "so",
                "the",
                "baby",
                "could",
                "sleep."
              ]
            },
            "question": "Which word belongs in the blank?",
            "choices": [
              {
                "text": "quiet",
                "feedback": "quiet is an adjective. It describes a noun, like a quiet room. The blank tells how the children played, so it needs an adverb."
              },
              {
                "text": "quietly",
                "correct": true,
                "feedback": "You found it! The blank tells how the children played, so it needs the adverb quietly."
              },
              {
                "text": "quietness",
                "feedback": "quietness is a noun. It names an idea. The blank tells how the children played, so it needs an adverb."
              },
              {
                "text": "quieted",
                "feedback": "quieted is a verb. The sentence already has its verb, played. The blank tells how they played."
              }
            ],
            "clue": "Remember: ask whether the blank tells about a noun or about the verb. An adverb tells how, when, or where.",
            "reveal": "Let's find it together. The blank tells how the children played. A word that tells how is an adverb, so the answer is quietly."
          },
          {
            "stage": 3,
            "std": [
              "3.L.GC.2.d",
              "GUM:G:adjectives-adverbs:R",
              "3.L.V.2.b"
            ],
            "sentence": {
              "words": [
                "The",
                "____",
                "dog",
                "barked",
                "at",
                "the",
                "mail",
                "truck."
              ]
            },
            "question": "Which word belongs in the blank?",
            "choices": [
              {
                "text": "angry",
                "correct": true,
                "feedback": "Great job! The blank describes the noun dog, so it needs the adjective angry."
              },
              {
                "text": "angrily",
                "feedback": "angrily is an adverb. It tells how something is done. The blank sits in front of the noun dog, so it needs an adjective."
              },
              {
                "text": "anger",
                "feedback": "anger is a noun. It names a feeling. The blank describes the dog, so it needs an adjective."
              },
              {
                "text": "angers",
                "feedback": "angers is a verb. The sentence already has its verb, barked. The blank describes the dog."
              }
            ],
            "clue": "Remember: ask whether the blank tells about a noun or about the verb. An adjective describes a noun.",
            "reveal": "Let's find it together. The blank describes the dog. dog is a noun, and a word that describes a noun is an adjective, so the answer is angry."
          },
          {
            "stage": 3,
            "std": [
              "3.L.GC.2.d",
              "GUM:G:adjectives-adverbs:R",
              "3.L.V.2.b"
            ],
            "sentence": {
              "words": [
                "Please",
                "read",
                "the",
                "directions",
                "____",
                "before",
                "you",
                "start",
                "the",
                "test."
              ]
            },
            "question": "Which word belongs in the blank?",
            "choices": [
              {
                "text": "careful",
                "feedback": "careful is an adjective. It describes a noun, like a careful reader. The blank tells how to read, so it needs an adverb."
              },
              {
                "text": "care",
                "feedback": "care is a noun or a verb. The blank tells how to read the directions, so it needs an adverb."
              },
              {
                "text": "carefully",
                "correct": true,
                "feedback": "Nice thinking! The blank tells how to read, so it needs the adverb carefully."
              },
              {
                "text": "cares",
                "feedback": "cares is a verb. The blank comes right after read the directions and tells how to read."
              }
            ],
            "clue": "Remember: ask whether the blank tells about a noun or about the verb. An adverb tells how, when, or where.",
            "reveal": "Let's find it together. The blank tells how to read the directions. A word that tells how is an adverb, so the answer is carefully."
          },
          {
            "stage": 3,
            "std": [
              "3.L.GC.2.d",
              "GUM:G:adjectives-adverbs:R",
              "3.L.V.2.b"
            ],
            "sentence": {
              "words": [
                "Jada",
                "was",
                "____",
                "about",
                "her",
                "first",
                "swimming",
                "lesson."
              ]
            },
            "question": "Which word belongs in the blank?",
            "choices": [
              {
                "text": "nervous",
                "correct": true,
                "feedback": "You found it! The blank tells what Jada was. It describes Jada, a noun, so it needs the adjective nervous."
              },
              {
                "text": "nervously",
                "feedback": "nervously is an adverb. It tells how someone does an action, like waited nervously. Here the blank tells what Jada was, so it needs an adjective."
              },
              {
                "text": "nerves",
                "feedback": "nerves is a noun. The blank describes Jada, so it needs an adjective."
              },
              {
                "text": "nerve",
                "feedback": "nerve is a noun. The blank describes Jada, so it needs an adjective."
              }
            ],
            "clue": "Remember: after was, the word often describes the subject. A word that describes a noun is an adjective.",
            "reveal": "Let's find it together. The blank tells what Jada was. It describes Jada, so it needs an adjective: nervous."
          }
        ]
      },
      "studyGuide": {
        "title": "Adverb Study Guide",
        "sections": [
          {
            "heading": "Adverbs that tell how",
            "chips": [
              "quietly",
              "quickly",
              "slowly",
              "carefully",
              "gently",
              "loudly"
            ]
          },
          {
            "heading": "Adverbs that tell when",
            "chips": [
              "yesterday",
              "today",
              "tomorrow",
              "soon",
              "later",
              "now"
            ]
          },
          {
            "heading": "Adverbs that tell where",
            "chips": [
              "outside",
              "inside",
              "upstairs",
              "here",
              "there",
              "nearby"
            ]
          },
          {
            "heading": "Careful: these end in -ly but are adjectives",
            "chips": [
              "friendly",
              "lovely",
              "lonely",
              "silly",
              "ugly"
            ]
          }
        ],
        "reminder": "An -ly ending is a clue, not a rule. Find the verb and ask: How? When? Where?"
      }
    },

    /* ===================================================== */
    /* COMPLETE SENTENCE                                   */
    /* Build 1.5.0 — Georgia grade 3 skill. Bank reviewed     */
    /* independently (see AUDIT-REPORT-Build-1.5.0.md).       */
    /* ===================================================== */
    "complete-sentence": {
      "name": "Complete Sentence",
      "badge": "who + did what",
      "card": "Spot fragments and run-ons.",
      "color": "complete-sentence",
      "ask": "Is it a complete thought?",
      "icon": "check",
      "preview": {
        "words": [
          "The",
          "bear",
          "searched",
          "for",
          "berries."
        ],
        "start": 0,
        "end": 4
      },
      "practice": "bank",
      "test": "soon",
      "ga": [
        {
          "code": "3.L.GC.2.a",
          "label": "Correctly built sentences"
        },
        {
          "code": "3.L.GC.2.b",
          "label": "Sentence variety"
        },
        {
          "code": "3-5.L.GC.1",
          "label": "Comma + and, but, or, so (Master)"
        }
      ],
      "definition": {
        "title": "What is a complete sentence?",
        "callout": {
          "title": "A complete sentence has two parts and one complete thought.",
          "rows": [
            {
              "key": "SUBJECT",
              "text": "who or what it is about"
            },
            {
              "key": "PREDICATE",
              "text": "what the subject does or is"
            }
          ]
        },
        "contrast": {
          "heading": "Complete or not?",
          "rows": [
            {
              "sentence": {
                "words": [
                  "Ran",
                  "across",
                  "the",
                  "muddy",
                  "field."
                ],
                "marks": [
                  {
                    "start": 0,
                    "end": 0,
                    "kind": "verb",
                    "label": "WHO RAN?"
                  }
                ]
              },
              "text": "Not complete. We know what happened, but not who did it. This is a fragment."
            },
            {
              "sentence": {
                "words": [
                  "The",
                  "playful",
                  "dog",
                  "ran",
                  "across",
                  "the",
                  "muddy",
                  "field."
                ],
                "marks": [
                  {
                    "start": 2,
                    "end": 2,
                    "kind": "subject",
                    "label": "SUBJECT"
                  },
                  {
                    "start": 3,
                    "end": 3,
                    "kind": "verb",
                    "label": "VERB"
                  }
                ]
              },
              "text": "Complete. It tells who and what happened."
            }
          ]
        },
        "note": "Two complete sentences stuck together with nothing between them make a run-on."
      },
      "clue": {
        "title": "How do I check a sentence?",
        "callout": {
          "title": "Ask three questions:",
          "rows": [
            {
              "key": "1",
              "text": "Who or what is it about?"
            },
            {
              "key": "2",
              "text": "What does it do, or what is it?"
            },
            {
              "key": "3",
              "text": "Does it make sense by itself?"
            }
          ]
        },
        "warning": "To join two complete sentences, use a period, or a comma and a word like and, but, or so. A comma alone is not enough."
      },
      "example": {
        "title": "Let's check a sentence",
        "sentence": {
          "words": [
            "The",
            "hungry",
            "bear",
            "searched",
            "the",
            "woods",
            "for",
            "berries."
          ],
          "marks": [
            {
              "start": 3,
              "end": 3,
              "kind": "verb",
              "label": "VERB"
            }
          ],
          "split": {
            "at": 3,
            "leftLabel": "SUBJECT",
            "rightLabel": "PREDICATE"
          }
        },
        "routine": [
          "Read the sentence.",
          "Who or what? The hungry bear.",
          "What does it do? searched the woods for berries.",
          "Both parts are there, so it is complete."
        ]
      },
      "learnTry": {
        "title": "Let me try",
        "sentence": {
          "words": [
            "Walked",
            "home",
            "from",
            "the",
            "bus",
            "stop."
          ]
        },
        "question": "Is this a complete sentence?",
        "choices": [
          {
            "text": "Yes, it is complete.",
            "feedback": "We do not know who walked home. The sentence never says. Something is missing."
          },
          {
            "text": "No, it needs a subject.",
            "feedback": "You found it! We do not know who walked home. It needs a subject.",
            "correct": true
          },
          {
            "text": "No, it needs a predicate.",
            "feedback": "It has a predicate: walked home from the bus stop. What is missing is who did it."
          },
          {
            "text": "No, it is a run-on.",
            "feedback": "A run-on has two sentences stuck together. This is only part of one sentence."
          }
        ]
      },
      "recap": "A complete sentence has a subject and a predicate and tells a complete thought.",
      "tryItBank": {
        "recap": "You practiced finding fragments and run-ons and fixing them in 20 different sentences.",
        "stages": [
          {
            "name": "Get Started",
            "desc": "Is anyone doing the action? Look for a missing subject.",
            "mark": "⭐",
            "milestoneTitle": "Get Started complete!",
            "milestoneLine": "You found sentences that were missing who or what.",
            "nextStage": "Look Closer"
          },
          {
            "name": "Look Closer",
            "desc": "Is anything happening? Look for a missing predicate.",
            "mark": "🌟",
            "milestoneTitle": "Look Closer complete!",
            "milestoneLine": "You found sentences that were missing what happened.",
            "nextStage": "Think It Through"
          },
          {
            "name": "Think It Through",
            "desc": "Watch for two sentences stuck together.",
            "mark": "💪",
            "milestoneTitle": "Think It Through complete!",
            "milestoneLine": "You spotted run-ons and sentences joined the right way.",
            "nextStage": "Challenge Yourself"
          },
          {
            "name": "Challenge Yourself",
            "desc": "Choose the best way to fix each sentence.",
            "mark": "🎉",
            "milestoneTitle": "You practiced Complete Sentence 20 different ways!",
            "milestoneLine": "",
            "nextStage": ""
          }
        ],
        "questions": [
          {
            "stage": 0,
            "std": [
              "3.L.GC.2.a",
              "GUM:U:complete-thoughts:R"
            ],
            "sentence": {
              "words": [
                "Jumped",
                "into",
                "the",
                "cool",
                "water",
                "at",
                "the",
                "pool."
              ]
            },
            "question": "Is this a complete sentence?",
            "choices": [
              {
                "text": "Yes, it is complete.",
                "feedback": "We do not know who jumped into the cool water at the pool. Something is missing."
              },
              {
                "text": "No, it needs a subject.",
                "correct": true,
                "feedback": "You found it! No, it needs a subject. We do not know who jumped into the cool water at the pool. It needs a subject."
              },
              {
                "text": "No, it needs a predicate.",
                "feedback": "It has a predicate: jumped into the cool water at the pool. What is missing is who did it."
              },
              {
                "text": "No, it is a run-on.",
                "feedback": "A run-on has two sentences stuck together. This is only part of one sentence."
              }
            ],
            "clue": "Remember: ask who or what the sentence is about. If you cannot answer, the subject is missing.",
            "reveal": "Let's check it together. What happened? jumped into the cool water at the pool. But who? The sentence never says, so it needs a subject. So the answer is: No, it needs a subject."
          },
          {
            "stage": 0,
            "std": [
              "3.L.GC.2.a",
              "GUM:U:complete-thoughts:R"
            ],
            "sentence": {
              "words": [
                "My",
                "cousin",
                "jumped",
                "into",
                "the",
                "cool",
                "water",
                "at",
                "the",
                "pool."
              ]
            },
            "question": "Is this a complete sentence?",
            "choices": [
              {
                "text": "Yes, it is complete.",
                "correct": true,
                "feedback": "Nice thinking! Yes, it is complete. It has a subject, My cousin, and a predicate, jumped into the cool water at the pool. It is a complete thought."
              },
              {
                "text": "No, it needs a subject.",
                "feedback": "This one has a subject: My cousin. That tells who or what the sentence is about."
              },
              {
                "text": "No, it needs a predicate.",
                "feedback": "This one has a predicate: jumped into the cool water at the pool. That tells what the subject does or is."
              },
              {
                "text": "No, it is a run-on.",
                "feedback": "This is one sentence, so it is not a run-on."
              }
            ],
            "clue": "Remember: ask who or what it is about, then ask what happened. If both are there and the thought is finished, it is complete.",
            "reveal": "Let's check it together. Who or what? My cousin. What happened? jumped into the cool water at the pool. Both parts are there, so it is a complete sentence. So the answer is: Yes, it is complete."
          },
          {
            "stage": 0,
            "std": [
              "3.L.GC.2.a",
              "GUM:U:complete-thoughts:R"
            ],
            "sentence": {
              "words": [
                "Painted",
                "a",
                "bright",
                "picture",
                "of",
                "the",
                "ocean."
              ]
            },
            "question": "Is this a complete sentence?",
            "choices": [
              {
                "text": "Yes, it is complete.",
                "feedback": "We do not know who painted a bright picture of the ocean. Something is missing."
              },
              {
                "text": "No, it needs a subject.",
                "correct": true,
                "feedback": "You found it! No, it needs a subject. We do not know who painted a bright picture of the ocean. It needs a subject."
              },
              {
                "text": "No, it needs a predicate.",
                "feedback": "It has a predicate: painted a bright picture of the ocean. What is missing is who did it."
              },
              {
                "text": "No, it is a run-on.",
                "feedback": "A run-on has two sentences stuck together. This is only part of one sentence."
              }
            ],
            "clue": "Remember: ask who or what the sentence is about. If you cannot answer, the subject is missing.",
            "reveal": "Let's check it together. What happened? painted a bright picture of the ocean. But who? The sentence never says, so it needs a subject. So the answer is: No, it needs a subject."
          },
          {
            "stage": 0,
            "std": [
              "3.L.GC.2.a",
              "GUM:U:complete-thoughts:R"
            ],
            "sentence": {
              "words": [
                "Carried",
                "the",
                "heavy",
                "groceries",
                "up",
                "the",
                "stairs."
              ]
            },
            "question": "Is this a complete sentence?",
            "choices": [
              {
                "text": "Yes, it is complete.",
                "feedback": "We do not know who carried the heavy groceries up the stairs. Something is missing."
              },
              {
                "text": "No, it needs a subject.",
                "correct": true,
                "feedback": "You found it! No, it needs a subject. We do not know who carried the heavy groceries up the stairs. It needs a subject."
              },
              {
                "text": "No, it needs a predicate.",
                "feedback": "It has a predicate: carried the heavy groceries up the stairs. What is missing is who did it."
              },
              {
                "text": "No, it is a run-on.",
                "feedback": "A run-on has two sentences stuck together. This is only part of one sentence."
              }
            ],
            "clue": "Remember: ask who or what the sentence is about. If you cannot answer, the subject is missing.",
            "reveal": "Let's check it together. What happened? carried the heavy groceries up the stairs. But who? The sentence never says, so it needs a subject. So the answer is: No, it needs a subject."
          },
          {
            "stage": 0,
            "std": [
              "3.L.GC.2.a",
              "GUM:U:complete-thoughts:R"
            ],
            "sentence": {
              "words": [
                "Our",
                "class",
                "painted",
                "a",
                "bright",
                "picture",
                "of",
                "the",
                "ocean."
              ]
            },
            "question": "Is this a complete sentence?",
            "choices": [
              {
                "text": "Yes, it is complete.",
                "correct": true,
                "feedback": "Nice thinking! Yes, it is complete. It has a subject, Our class, and a predicate, painted a bright picture of the ocean. It is a complete thought."
              },
              {
                "text": "No, it needs a subject.",
                "feedback": "This one has a subject: Our class. That tells who or what the sentence is about."
              },
              {
                "text": "No, it needs a predicate.",
                "feedback": "This one has a predicate: painted a bright picture of the ocean. That tells what the subject does or is."
              },
              {
                "text": "No, it is a run-on.",
                "feedback": "This is one sentence, so it is not a run-on."
              }
            ],
            "clue": "Remember: ask who or what it is about, then ask what happened. If both are there and the thought is finished, it is complete.",
            "reveal": "Let's check it together. Who or what? Our class. What happened? painted a bright picture of the ocean. Both parts are there, so it is a complete sentence. So the answer is: Yes, it is complete."
          },
          {
            "stage": 1,
            "std": [
              "3.L.GC.2.a",
              "GUM:U:complete-thoughts:R"
            ],
            "sentence": {
              "words": [
                "The",
                "tall",
                "girl",
                "with",
                "the",
                "red",
                "backpack."
              ]
            },
            "question": "Is this a complete sentence?",
            "choices": [
              {
                "text": "Yes, it is complete.",
                "feedback": "We know what it is about, the tall girl with the red backpack, but not what happened."
              },
              {
                "text": "No, it needs a subject.",
                "feedback": "It has a subject: the tall girl with the red backpack. What is missing is what happened."
              },
              {
                "text": "No, it needs a predicate.",
                "correct": true,
                "feedback": "You found it! No, it needs a predicate. We know what it is about, the tall girl with the red backpack, but not what happened. It needs a predicate."
              },
              {
                "text": "No, it is a run-on.",
                "feedback": "A run-on has two sentences stuck together. This is only part of one sentence."
              }
            ],
            "clue": "Remember: ask what happened. If you cannot answer, the predicate is missing. The predicate has the verb.",
            "reveal": "Let's check it together. Who or what? the tall girl with the red backpack. What happened? The sentence never says. There is no verb, so it needs a predicate. So the answer is: No, it needs a predicate."
          },
          {
            "stage": 1,
            "std": [
              "3.L.GC.2.a",
              "GUM:U:complete-thoughts:R"
            ],
            "sentence": {
              "words": [
                "The",
                "noisy",
                "crowd",
                "at",
                "the",
                "baseball",
                "game."
              ]
            },
            "question": "Is this a complete sentence?",
            "choices": [
              {
                "text": "Yes, it is complete.",
                "feedback": "We know what it is about, the noisy crowd at the baseball game, but not what happened."
              },
              {
                "text": "No, it needs a subject.",
                "feedback": "It has a subject: the noisy crowd at the baseball game. What is missing is what happened."
              },
              {
                "text": "No, it needs a predicate.",
                "correct": true,
                "feedback": "You found it! No, it needs a predicate. We know what it is about, the noisy crowd at the baseball game, but not what happened. It needs a predicate."
              },
              {
                "text": "No, it is a run-on.",
                "feedback": "A run-on has two sentences stuck together. This is only part of one sentence."
              }
            ],
            "clue": "Remember: ask what happened. If you cannot answer, the predicate is missing. The predicate has the verb.",
            "reveal": "Let's check it together. Who or what? the noisy crowd at the baseball game. What happened? The sentence never says. There is no verb, so it needs a predicate. So the answer is: No, it needs a predicate."
          },
          {
            "stage": 1,
            "std": [
              "3.L.GC.2.a",
              "GUM:U:complete-thoughts:R"
            ],
            "sentence": {
              "words": [
                "The",
                "noisy",
                "crowd",
                "cheered",
                "at",
                "the",
                "baseball",
                "game."
              ]
            },
            "question": "Is this a complete sentence?",
            "choices": [
              {
                "text": "Yes, it is complete.",
                "correct": true,
                "feedback": "Nice thinking! Yes, it is complete. It has a subject, The noisy crowd, and a predicate, cheered at the baseball game. It is a complete thought."
              },
              {
                "text": "No, it needs a subject.",
                "feedback": "This one has a subject: The noisy crowd. That tells who or what the sentence is about."
              },
              {
                "text": "No, it needs a predicate.",
                "feedback": "This one has a predicate: cheered at the baseball game. That tells what the subject does or is."
              },
              {
                "text": "No, it is a run-on.",
                "feedback": "This is one sentence, so it is not a run-on."
              }
            ],
            "clue": "Remember: ask who or what it is about, then ask what happened. If both are there and the thought is finished, it is complete.",
            "reveal": "Let's check it together. Who or what? The noisy crowd. What happened? cheered at the baseball game. Both parts are there, so it is a complete sentence. So the answer is: Yes, it is complete."
          },
          {
            "stage": 1,
            "std": [
              "3.L.GC.2.a",
              "GUM:U:complete-thoughts:R"
            ],
            "sentence": {
              "words": [
                "My",
                "grandmother's",
                "garden",
                "behind",
                "the",
                "house."
              ]
            },
            "question": "Is this a complete sentence?",
            "choices": [
              {
                "text": "Yes, it is complete.",
                "feedback": "We know what it is about, my grandmother's garden behind the house, but not what happened."
              },
              {
                "text": "No, it needs a subject.",
                "feedback": "It has a subject: my grandmother's garden behind the house. What is missing is what happened."
              },
              {
                "text": "No, it needs a predicate.",
                "correct": true,
                "feedback": "You found it! No, it needs a predicate. We know what it is about, my grandmother's garden behind the house, but not what happened. It needs a predicate."
              },
              {
                "text": "No, it is a run-on.",
                "feedback": "A run-on has two sentences stuck together. This is only part of one sentence."
              }
            ],
            "clue": "Remember: ask what happened. If you cannot answer, the predicate is missing. The predicate has the verb.",
            "reveal": "Let's check it together. Who or what? my grandmother's garden behind the house. What happened? The sentence never says. There is no verb, so it needs a predicate. So the answer is: No, it needs a predicate."
          },
          {
            "stage": 1,
            "std": [
              "3.L.GC.2.a",
              "GUM:U:complete-thoughts:R"
            ],
            "sentence": {
              "words": [
                "Walked",
                "slowly",
                "to",
                "the",
                "bus",
                "stop."
              ]
            },
            "question": "Is this a complete sentence?",
            "choices": [
              {
                "text": "Yes, it is complete.",
                "feedback": "We do not know who walked slowly to the bus stop. Something is missing."
              },
              {
                "text": "No, it needs a subject.",
                "correct": true,
                "feedback": "You found it! No, it needs a subject. We do not know who walked slowly to the bus stop. It needs a subject."
              },
              {
                "text": "No, it needs a predicate.",
                "feedback": "It has a predicate: walked slowly to the bus stop. What is missing is who did it."
              },
              {
                "text": "No, it is a run-on.",
                "feedback": "A run-on has two sentences stuck together. This is only part of one sentence."
              }
            ],
            "clue": "Remember: ask who or what the sentence is about. If you cannot answer, the subject is missing.",
            "reveal": "Let's check it together. What happened? walked slowly to the bus stop. But who? The sentence never says, so it needs a subject. So the answer is: No, it needs a subject."
          },
          {
            "stage": 2,
            "std": [
              "3.L.GC.2.a",
              "3.L.GC.2.b"
            ],
            "sentence": {
              "words": [
                "The",
                "rain",
                "stopped",
                "we",
                "went",
                "outside",
                "to",
                "play."
              ]
            },
            "question": "Is this a complete sentence?",
            "choices": [
              {
                "text": "Yes, it is complete.",
                "feedback": "Read it slowly. One complete thought is “The rain stopped.” The other is “we went outside to play.” They run together with nothing between them."
              },
              {
                "text": "No, it needs a subject.",
                "feedback": "Both parts have a subject. The problem is that two sentences are stuck together."
              },
              {
                "text": "No, it needs a predicate.",
                "feedback": "Both parts have a verb. The problem is that two sentences are stuck together."
              },
              {
                "text": "No, it is a run-on.",
                "correct": true,
                "feedback": "Great job! No, it is a run-on. “The rain stopped” is one sentence and “we went outside to play” is another. They run together with no end mark, so it is a run-on."
              }
            ],
            "clue": "Remember: count the complete thoughts. Two complete thoughts with nothing between them make a run-on.",
            "reveal": "Let's check it together. “The rain stopped” is a complete thought. “we went outside to play” is another complete thought. Nothing separates them, so it is a run-on. So the answer is: No, it is a run-on."
          },
          {
            "stage": 2,
            "std": [
              "3.L.GC.2.a",
              "3.L.GC.2.b"
            ],
            "sentence": {
              "words": [
                "Mia",
                "finished",
                "her",
                "homework",
                "she",
                "went",
                "to",
                "bed."
              ]
            },
            "question": "Is this a complete sentence?",
            "choices": [
              {
                "text": "Yes, it is complete.",
                "feedback": "Read it slowly. One complete thought is “Mia finished her homework.” The other is “she went to bed.” They run together with nothing between them."
              },
              {
                "text": "No, it needs a subject.",
                "feedback": "Both parts have a subject. The problem is that two sentences are stuck together."
              },
              {
                "text": "No, it needs a predicate.",
                "feedback": "Both parts have a verb. The problem is that two sentences are stuck together."
              },
              {
                "text": "No, it is a run-on.",
                "correct": true,
                "feedback": "Great job! No, it is a run-on. “Mia finished her homework” is one sentence and “she went to bed” is another. They run together with no end mark, so it is a run-on."
              }
            ],
            "clue": "Remember: count the complete thoughts. Two complete thoughts with nothing between them make a run-on.",
            "reveal": "Let's check it together. “Mia finished her homework” is a complete thought. “she went to bed” is another complete thought. Nothing separates them, so it is a run-on. So the answer is: No, it is a run-on."
          },
          {
            "stage": 2,
            "std": [
              "3.L.GC.2.a",
              "3.L.GC.2.b",
              "GUM:M:comma-coordinating-conjunction:M"
            ],
            "sentence": {
              "words": [
                "The",
                "rain",
                "stopped,",
                "so",
                "we",
                "went",
                "outside",
                "to",
                "play."
              ]
            },
            "question": "Is this a complete sentence?",
            "choices": [
              {
                "text": "Yes, it is complete.",
                "correct": true,
                "feedback": "Nice thinking! Yes, it is complete. It has two complete thoughts, “The rain stopped” and “we went outside to play,” joined correctly with a comma and so."
              },
              {
                "text": "No, it needs a subject.",
                "feedback": "Both parts have a subject: The rain and we."
              },
              {
                "text": "No, it needs a predicate.",
                "feedback": "Both parts have a predicate: stopped and went outside to play."
              },
              {
                "text": "No, it is a run-on.",
                "feedback": "This has two sentences, but they are joined correctly with a comma and so. That is not a run-on."
              }
            ],
            "clue": "Remember: two complete thoughts are fine when a comma and a joining word like and, but, or so connect them.",
            "reveal": "Let's check it together. “The rain stopped” is one complete thought. “We went outside to play” is another. A comma and the joining word so connect them correctly, so it is a complete sentence. So the answer is: Yes, it is complete."
          },
          {
            "stage": 2,
            "std": [
              "3.L.GC.2.a",
              "3.L.GC.2.b"
            ],
            "sentence": {
              "words": [
                "My",
                "brother",
                "likes",
                "soccer",
                "I",
                "like",
                "basketball."
              ]
            },
            "question": "Is this a complete sentence?",
            "choices": [
              {
                "text": "Yes, it is complete.",
                "feedback": "Read it slowly. One complete thought is “My brother likes soccer.” The other is “I like basketball.” They run together with nothing between them."
              },
              {
                "text": "No, it needs a subject.",
                "feedback": "Both parts have a subject. The problem is that two sentences are stuck together."
              },
              {
                "text": "No, it needs a predicate.",
                "feedback": "Both parts have a verb. The problem is that two sentences are stuck together."
              },
              {
                "text": "No, it is a run-on.",
                "correct": true,
                "feedback": "Great job! No, it is a run-on. “My brother likes soccer” is one sentence and “I like basketball” is another. They run together with no end mark, so it is a run-on."
              }
            ],
            "clue": "Remember: count the complete thoughts. Two complete thoughts with nothing between them make a run-on.",
            "reveal": "Let's check it together. “My brother likes soccer” is a complete thought. “I like basketball” is another complete thought. Nothing separates them, so it is a run-on. So the answer is: No, it is a run-on."
          },
          {
            "stage": 2,
            "std": [
              "3.L.GC.2.a",
              "GUM:U:complete-thoughts:R"
            ],
            "sentence": {
              "words": [
                "After",
                "the",
                "storm,",
                "the",
                "tall",
                "tree",
                "near",
                "our",
                "house."
              ]
            },
            "question": "Is this a complete sentence?",
            "choices": [
              {
                "text": "Yes, it is complete.",
                "feedback": "We know what it is about, the tall tree near our house, but not what happened."
              },
              {
                "text": "No, it needs a subject.",
                "feedback": "It has a subject: the tall tree near our house. What is missing is what happened."
              },
              {
                "text": "No, it needs a predicate.",
                "correct": true,
                "feedback": "You found it! No, it needs a predicate. We know what it is about, the tall tree near our house, but not what happened. It needs a predicate."
              },
              {
                "text": "No, it is a run-on.",
                "feedback": "A run-on has two sentences stuck together. This is only part of one sentence."
              }
            ],
            "clue": "Remember: ask what happened. If you cannot answer, the predicate is missing. The predicate has the verb.",
            "reveal": "Let's check it together. Who or what? the tall tree near our house. What happened? The sentence never says. There is no verb, so it needs a predicate. So the answer is: No, it needs a predicate."
          },
          {
            "stage": 3,
            "std": [
              "3.L.GC.2.a",
              "3.L.GC.2.b",
              "GUM:M:end-punctuation:R",
              "GUM:M:capitalize-first-word:R"
            ],
            "sentence": {
              "words": [
                "The",
                "puppy",
                "was",
                "sleepy",
                "it",
                "took",
                "a",
                "long",
                "nap."
              ]
            },
            "question": "Which is the best way to fix it?",
            "choices": [
              {
                "text": "The puppy was sleepy. It took a long nap.",
                "correct": true,
                "feedback": "You found it! “The puppy was sleepy. It took a long nap.” Each complete thought gets its own end mark, and the new sentence starts with a capital letter."
              },
              {
                "text": "The puppy was sleepy it. Took a long nap.",
                "feedback": "The period is in the wrong place. Took a long nap has no subject, so now it is a fragment."
              },
              {
                "text": "The puppy was sleepy, it took a long nap.",
                "feedback": "A comma alone cannot join two complete sentences. It needs a joining word like and or so, or a period."
              },
              {
                "text": "the puppy was sleepy. it took a long nap.",
                "feedback": "The period is in the right place, but every sentence must start with a capital letter."
              }
            ],
            "clue": "Remember: find the two complete thoughts. Give each one a capital letter and an end mark.",
            "reveal": "Let's fix it together. The puppy was sleepy is one thought. It took a long nap is another. Put a period after sleepy and start It with a capital letter. The correct sentence is: “The puppy was sleepy. It took a long nap.”"
          },
          {
            "stage": 3,
            "std": [
              "3.L.GC.2.a"
            ],
            "sentence": {
              "words": [
                "Ran",
                "all",
                "the",
                "way",
                "to",
                "the",
                "playground."
              ]
            },
            "question": "Which is the best way to fix it?",
            "choices": [
              {
                "text": "Jordan ran all the way to the playground.",
                "correct": true,
                "feedback": "Great job! “Jordan ran all the way to the playground.” Adding Jordan tells who ran, so now the sentence has a subject."
              },
              {
                "text": "Ran all the way to the playground fast.",
                "feedback": "Adding fast does not tell who ran. It still needs a subject."
              },
              {
                "text": "Jordan all the way to the playground.",
                "feedback": "Now we know who, but the verb ran is gone. It needs a verb, like ran."
              },
              {
                "text": "Ran all the way. To the playground.",
                "feedback": "Now there are two fragments. Neither one tells who ran."
              }
            ],
            "clue": "Remember: this group of words is missing who did it. Add a subject.",
            "reveal": "Let's fix it together. Who ran? The sentence never says. Adding a subject, Jordan, makes it complete: Jordan ran all the way to the playground."
          },
          {
            "stage": 3,
            "std": [
              "3.L.GC.2.a"
            ],
            "sentence": {
              "words": [
                "The",
                "new",
                "library",
                "in",
                "our",
                "town."
              ]
            },
            "question": "Which is the best way to fix it?",
            "choices": [
              {
                "text": "The new library in our town and today.",
                "feedback": "Adding and today does not tell what the library did. There is still no verb."
              },
              {
                "text": "The new library. In our town.",
                "feedback": "Now there are two fragments. Neither one tells what happened."
              },
              {
                "text": "The new library in our town opened today.",
                "correct": true,
                "feedback": "Nice thinking! “The new library in our town opened today.” opened today tells what the library did, so now the sentence has a predicate."
              },
              {
                "text": "Opened today in our town.",
                "feedback": "Now there is a verb, but we do not know what opened. The subject is gone."
              }
            ],
            "clue": "Remember: this group of words tells what it is about but not what happened. Add a predicate with a verb.",
            "reveal": "Let's fix it together. What is it about? The new library in our town. What happened? The sentence never says. Adding opened today makes it complete. The correct sentence is: “The new library in our town opened today.”"
          },
          {
            "stage": 3,
            "std": [
              "3.L.GC.2.a",
              "GUM:G:coordinating-conjunctions:M",
              "GUM:M:comma-coordinating-conjunction:M"
            ],
            "sentence": {
              "words": [
                "I",
                "wanted",
                "to",
                "swim",
                "it",
                "was",
                "too",
                "cold."
              ]
            },
            "question": "Which is the best way to fix it?",
            "choices": [
              {
                "text": "I wanted to swim but, it was too cold.",
                "feedback": "The comma goes before the joining word, not after it: swim, but."
              },
              {
                "text": "I wanted to swim, but it was too cold.",
                "correct": true,
                "feedback": "You found it! “I wanted to swim, but it was too cold.” A comma and the joining word but connect the two complete thoughts."
              },
              {
                "text": "I wanted to swim, it was too cold.",
                "feedback": "A comma alone cannot join two complete sentences. It needs a joining word like but."
              },
              {
                "text": "I wanted to swim it, but was too cold.",
                "feedback": "The comma and but are in the wrong place, and was too cold has no subject."
              }
            ],
            "clue": "Remember: to join two complete thoughts, put a comma and then a joining word like and, but, or so.",
            "reveal": "Let's fix it together. I wanted to swim is one thought. It was too cold is another. Join them with a comma and but: I wanted to swim, but it was too cold."
          },
          {
            "stage": 3,
            "std": [
              "3.L.GC.2.a",
              "GUM:G:coordinating-conjunctions:M",
              "GUM:M:comma-coordinating-conjunction:M"
            ],
            "sentence": {
              "words": [
                "We",
                "packed",
                "our",
                "lunches",
                "we",
                "got",
                "on",
                "the",
                "bus."
              ]
            },
            "question": "Which is the best way to fix it?",
            "choices": [
              {
                "text": "We packed our lunches, we got on the bus.",
                "feedback": "A comma alone cannot join two complete sentences. It needs a joining word like and."
              },
              {
                "text": "We packed our lunches and, we got on the bus.",
                "feedback": "The comma goes before the joining word, not after it: lunches, and."
              },
              {
                "text": "We packed. Our lunches we got on the bus.",
                "feedback": "The period splits the first thought in the wrong place, and the rest does not make sense."
              },
              {
                "text": "We packed our lunches, and we got on the bus.",
                "correct": true,
                "feedback": "Great job! “We packed our lunches, and we got on the bus.” A comma and the joining word and connect the two complete thoughts."
              }
            ],
            "clue": "Remember: to join two complete thoughts, put a comma and then a joining word like and, but, or so.",
            "reveal": "Let's fix it together. We packed our lunches is one thought. We got on the bus is another. Join them with a comma and and: We packed our lunches, and we got on the bus."
          }
        ]
      },
      "studyGuide": {
        "title": "Complete Sentence Study Guide",
        "sections": [
          {
            "heading": "Joining words",
            "chips": [
              "and",
              "but",
              "or",
              "so"
            ]
          }
        ],
        "reminder": "A comma alone cannot join two sentences. Use a period, or a comma and a joining word."
      }
    },

    /* ===================================================== */
    /* HELPING & LINKING VERBS                             */
    /* Build 1.5.0 — Georgia grade 3 skill. Bank reviewed     */
    /* independently (see AUDIT-REPORT-Build-1.5.0.md).       */
    /* ===================================================== */
    "helping-linking": {
      "name": "Helping & Linking Verbs",
      "badge": "is running",
      "card": "Verbs that help and verbs that link.",
      "color": "helping-linking",
      "ask": "Does it help or link?",
      "icon": "link",
      "preview": {
        "words": [
          "The",
          "baby",
          "is",
          "sleeping."
        ],
        "start": 2,
        "end": 2
      },
      "practice": "bank",
      "test": "soon",
      "ga": [
        {
          "code": "3-5.L.GC.1",
          "label": "Helping and linking verbs (I)"
        }
      ],
      "definition": {
        "title": "What are helping and linking verbs?",
        "callout": {
          "title": "Two more jobs a verb can do:",
          "rows": [
            {
              "key": "HELPS",
              "text": "comes before the main verb: will paint, can swim"
            },
            {
              "key": "LINKS",
              "text": "joins the subject to a describing or naming word: The soup is hot."
            }
          ]
        },
        "contrast": {
          "heading": "Both of these are verbs",
          "rows": [
            {
              "sentence": {
                "words": [
                  "My",
                  "brother",
                  "will",
                  "paint",
                  "a",
                  "picture."
                ],
                "marks": [
                  {
                    "start": 2,
                    "end": 2,
                    "kind": "verb",
                    "label": "HELPING VERB"
                  },
                  {
                    "start": 3,
                    "end": 3,
                    "kind": "verb",
                    "label": "MAIN VERB"
                  }
                ]
              },
              "text": "will helps the main verb paint."
            },
            {
              "sentence": {
                "words": [
                  "The",
                  "soup",
                  "was",
                  "hot."
                ],
                "marks": [
                  {
                    "start": 2,
                    "end": 2,
                    "kind": "verb",
                    "label": "LINKING VERB"
                  }
                ]
              },
              "text": "was links soup to hot. No action happens."
            }
          ]
        },
        "note": "Helping verbs: will, can, should, must, am, is, are, was, were. Linking verbs: am, is, are, was, were, seems, becomes."
      },
      "clue": {
        "title": "How do I tell them apart?",
        "callout": {
          "title": "Look at what comes after the verb.",
          "rows": [
            {
              "key": "ACTION",
              "text": "An action word next? It is a helping verb."
            },
            {
              "key": "NO ACTION",
              "text": "A describing or naming word next? It is a linking verb."
            }
          ]
        },
        "warning": "is, are, was, and were can do both jobs. Skip little words like a, the, and very. Try = only when no action word comes next: The soup = hot."
      },
      "example": {
        "title": "Let's find both kinds",
        "sentence": {
          "words": [
            "Our",
            "class",
            "is",
            "ready,",
            "so",
            "we",
            "will",
            "start",
            "the",
            "test."
          ],
          "marks": [
            {
              "start": 2,
              "end": 2,
              "kind": "verb",
              "label": "LINKING VERB"
            },
            {
              "start": 6,
              "end": 6,
              "kind": "verb",
              "label": "HELPING VERB"
            },
            {
              "start": 7,
              "end": 7,
              "kind": "verb",
              "label": "MAIN VERB"
            }
          ]
        },
        "routine": [
          "Read the sentence.",
          "The word is comes before ready. ready describes the class, so it is a linking verb.",
          "The word will comes before start. start is an action, so will is a helping verb.",
          "start is the main verb."
        ]
      },
      "learnTry": {
        "title": "Let me try",
        "sentence": {
          "words": [
            "My",
            "cousins",
            "can",
            "juggle",
            "three",
            "balls",
            "at",
            "once."
          ]
        },
        "question": "Which word is the helping verb?",
        "choices": [
          {
            "text": "cousins",
            "feedback": "The word cousins names people. It is a noun. Look for the word that helps the main verb juggle."
          },
          {
            "text": "can",
            "feedback": "Nice thinking! can comes before juggle and helps it, so can is the helping verb.",
            "correct": true
          },
          {
            "text": "juggle",
            "feedback": "The word juggle is the main verb. It tells the action. Look for the word right before it."
          },
          {
            "text": "balls",
            "feedback": "The word balls names things. It is a noun. Look for the word that helps the main verb juggle."
          }
        ]
      },
      "recap": "A helping verb helps the main verb. A linking verb links the subject to a word that describes or names it.",
      "tryItBank": {
        "recap": "You practiced finding helping verbs, main verbs, and linking verbs in 20 different sentences.",
        "stages": [
          {
            "name": "Get Started",
            "desc": "Find the helping verb.",
            "mark": "⭐",
            "milestoneTitle": "Get Started complete!",
            "milestoneLine": "You found the verbs that help the main verb.",
            "nextStage": "Look Closer"
          },
          {
            "name": "Look Closer",
            "desc": "Find the main verb that the helping verb helps.",
            "mark": "🌟",
            "milestoneTitle": "Look Closer complete!",
            "milestoneLine": "You found the main verb after each helping verb.",
            "nextStage": "Think It Through"
          },
          {
            "name": "Think It Through",
            "desc": "Find verbs that link the subject to a describing or naming word.",
            "mark": "💪",
            "milestoneTitle": "Think It Through complete!",
            "milestoneLine": "You found linking verbs that show no action.",
            "nextStage": "Challenge Yourself"
          },
          {
            "name": "Challenge Yourself",
            "desc": "Is it helping or linking? Look at the word after it.",
            "mark": "🎉",
            "milestoneTitle": "You practiced Helping & Linking Verbs 20 different ways!",
            "milestoneLine": "",
            "nextStage": ""
          }
        ],
        "questions": [
          {
            "stage": 0,
            "std": [
              "GUM:G:helping-linking-verbs:I"
            ],
            "sentence": {
              "words": [
                "My",
                "little",
                "brother",
                "will",
                "paint",
                "a",
                "picture",
                "of",
                "our",
                "cat."
              ]
            },
            "question": "Which word is the helping verb?",
            "choices": [
              {
                "text": "will",
                "correct": true,
                "feedback": "Nice thinking! will comes before paint and helps it, so will is the helping verb."
              },
              {
                "text": "paint",
                "feedback": "The word paint is the main verb. It tells the action. Look for the word right before it that helps it."
              },
              {
                "text": "brother",
                "feedback": "The word brother names a person. It is a noun. Look for the word that helps the main verb paint."
              },
              {
                "text": "picture",
                "feedback": "The word picture names a thing. It is a noun. Look for the word that helps the main verb paint."
              }
            ],
            "clue": "Remember: find the main verb first. The helping verb comes right before it.",
            "reveal": "Let's find it together. The main verb is paint. The word that helps it is will."
          },
          {
            "stage": 0,
            "std": [
              "GUM:G:helping-linking-verbs:I"
            ],
            "sentence": {
              "words": [
                "The",
                "new",
                "student",
                "can",
                "swim",
                "across",
                "the",
                "whole",
                "pool."
              ]
            },
            "question": "Which word is the helping verb?",
            "choices": [
              {
                "text": "can",
                "correct": true,
                "feedback": "Nice thinking! can comes before swim and helps it, so can is the helping verb."
              },
              {
                "text": "swim",
                "feedback": "The word swim is the main verb. It tells the action. Look for the word right before it that helps it."
              },
              {
                "text": "student",
                "feedback": "The word student names a person. It is a noun. Look for the word that helps the main verb swim."
              },
              {
                "text": "whole",
                "feedback": "The word whole describes pool. It is an adjective. Look for the word that helps the main verb swim."
              }
            ],
            "clue": "Remember: find the main verb first. The helping verb comes right before it.",
            "reveal": "Let's find it together. The main verb is swim. The word that helps it is can."
          },
          {
            "stage": 0,
            "std": [
              "GUM:G:helping-linking-verbs:I"
            ],
            "sentence": {
              "words": [
                "We",
                "should",
                "finish",
                "our",
                "reading",
                "log",
                "before",
                "dinner."
              ]
            },
            "question": "Which word is the helping verb?",
            "choices": [
              {
                "text": "should",
                "correct": true,
                "feedback": "Nice thinking! should comes before finish and helps it, so should is the helping verb."
              },
              {
                "text": "finish",
                "feedback": "The word finish is the main verb. It tells the action. Look for the word right before it that helps it."
              },
              {
                "text": "We",
                "feedback": "The word We is a pronoun. It tells who. Look for the word that helps the main verb finish."
              },
              {
                "text": "log",
                "feedback": "The word log names a thing. It is a noun. Look for the word that helps the main verb finish."
              }
            ],
            "clue": "Remember: find the main verb first. The helping verb comes right before it.",
            "reveal": "Let's find it together. The main verb is finish. The word that helps it is should."
          },
          {
            "stage": 0,
            "std": [
              "GUM:G:helping-linking-verbs:I"
            ],
            "sentence": {
              "words": [
                "The",
                "happy",
                "fans",
                "were",
                "cheering",
                "for",
                "the",
                "home",
                "team."
              ]
            },
            "question": "Which word is the helping verb?",
            "choices": [
              {
                "text": "were",
                "correct": true,
                "feedback": "Nice thinking! “were” comes before cheering and helps it, so “were” is the helping verb."
              },
              {
                "text": "cheering",
                "feedback": "The word cheering is the main verb. It tells the action. Look for the word right before it that helps it."
              },
              {
                "text": "fans",
                "feedback": "The word fans names people. It is a noun. Look for the word that helps the main verb cheering."
              },
              {
                "text": "happy",
                "feedback": "The word happy tells what kind of fans. It is an adjective. Look for the word that helps the main verb cheering."
              }
            ],
            "clue": "Remember: find the main verb first. The helping verb comes right before it.",
            "reveal": "Let's find it together. The main verb is cheering. The word that helps it is “were”."
          },
          {
            "stage": 0,
            "std": [
              "GUM:G:helping-linking-verbs:I"
            ],
            "sentence": {
              "words": [
                "My",
                "grandmother",
                "is",
                "baking",
                "sweet",
                "potato",
                "pie",
                "for",
                "Thanksgiving."
              ]
            },
            "question": "Which word is the helping verb?",
            "choices": [
              {
                "text": "is",
                "correct": true,
                "feedback": "Nice thinking! “is” comes before baking and helps it, so “is” is the helping verb."
              },
              {
                "text": "baking",
                "feedback": "The word baking is the main verb. It tells the action. Look for the word right before it that helps it."
              },
              {
                "text": "grandmother",
                "feedback": "The word grandmother names a person. It is a noun. Look for the word that helps the main verb baking."
              },
              {
                "text": "pie",
                "feedback": "The word pie names a thing. It is a noun. Look for the word that helps the main verb baking."
              }
            ],
            "clue": "Remember: find the main verb first. The helping verb comes right before it.",
            "reveal": "Let's find it together. The main verb is baking. The word that helps it is “is”."
          },
          {
            "stage": 1,
            "std": [
              "GUM:G:helping-linking-verbs:I"
            ],
            "sentence": {
              "words": [
                "The",
                "players",
                "must",
                "wear",
                "their",
                "helmets",
                "on",
                "the",
                "field."
              ]
            },
            "question": "Which word is the main verb?",
            "choices": [
              {
                "text": "wear",
                "correct": true,
                "feedback": "You found it! wear tells the action. The helping verb must helps it, so wear is the main verb."
              },
              {
                "text": "must",
                "feedback": "The word must is the helping verb. It helps the main verb. Look for the word right after it that tells the action."
              },
              {
                "text": "players",
                "feedback": "The word players names people. It is a noun. Look for the action word after must."
              },
              {
                "text": "helmets",
                "feedback": "The word helmets names things. It is a noun. Look for the action word after must."
              }
            ],
            "clue": "Remember: the main verb tells the action. It comes after the helping verb.",
            "reveal": "Let's find it together. The helping verb is must. The action word after it is wear, so wear is the main verb."
          },
          {
            "stage": 1,
            "std": [
              "GUM:G:helping-linking-verbs:I"
            ],
            "sentence": {
              "words": [
                "Our",
                "teacher",
                "was",
                "reading",
                "a",
                "funny",
                "chapter",
                "book",
                "aloud."
              ]
            },
            "question": "Which word is the main verb?",
            "choices": [
              {
                "text": "reading",
                "correct": true,
                "feedback": "You found it! reading tells the action. The helping verb “was” helps it, so reading is the main verb."
              },
              {
                "text": "was",
                "feedback": "“was” is the helping verb. It helps the main verb. Look for the word right after it that tells the action."
              },
              {
                "text": "teacher",
                "feedback": "The word teacher names a person. It is a noun. Look for the action word after was."
              },
              {
                "text": "funny",
                "feedback": "The word funny tells what kind of book. It is an adjective. Look for the action word after was."
              }
            ],
            "clue": "Remember: the main verb tells the action. It comes after the helping verb.",
            "reveal": "Let's find it together. The helping verb is “was”. The action word after it is reading, so reading is the main verb."
          },
          {
            "stage": 1,
            "std": [
              "GUM:G:helping-linking-verbs:I"
            ],
            "sentence": {
              "words": [
                "Tomorrow",
                "the",
                "class",
                "will",
                "plant",
                "flowers",
                "near",
                "the",
                "fence."
              ]
            },
            "question": "Which word is the main verb?",
            "choices": [
              {
                "text": "plant",
                "correct": true,
                "feedback": "You found it! plant tells the action. The helping verb will helps it, so plant is the main verb."
              },
              {
                "text": "will",
                "feedback": "The word will is the helping verb. It helps the main verb. Look for the word right after it that tells the action."
              },
              {
                "text": "Tomorrow",
                "feedback": "The word Tomorrow tells when. It is an adverb. Look for the action word after will."
              },
              {
                "text": "flowers",
                "feedback": "The word flowers names things. It is a noun. Look for the action word after will."
              }
            ],
            "clue": "Remember: the main verb tells the action. It comes after the helping verb.",
            "reveal": "Let's find it together. The helping verb is will. The action word after it is plant, so plant is the main verb."
          },
          {
            "stage": 1,
            "std": [
              "GUM:G:helping-linking-verbs:I"
            ],
            "sentence": {
              "words": [
                "The",
                "puppies",
                "are",
                "chasing",
                "a",
                "ball",
                "across",
                "the",
                "yard."
              ]
            },
            "question": "Which word is the main verb?",
            "choices": [
              {
                "text": "chasing",
                "correct": true,
                "feedback": "You found it! chasing tells the action. The helping verb “are” helps it, so chasing is the main verb."
              },
              {
                "text": "are",
                "feedback": "“are” is the helping verb. It helps the main verb. Look for the word right after it that tells the action."
              },
              {
                "text": "puppies",
                "feedback": "The word puppies names animals. It is a noun. Look for the action word after are."
              },
              {
                "text": "ball",
                "feedback": "The word ball names a thing. It is a noun. Look for the action word after are."
              }
            ],
            "clue": "Remember: the main verb tells the action. It comes after the helping verb.",
            "reveal": "Let's find it together. The helping verb is “are”. The action word after it is chasing, so chasing is the main verb."
          },
          {
            "stage": 1,
            "std": [
              "GUM:G:helping-linking-verbs:I"
            ],
            "sentence": {
              "words": [
                "Jordan",
                "could",
                "ride",
                "his",
                "bike",
                "without",
                "training",
                "wheels."
              ]
            },
            "question": "Which word is the main verb?",
            "choices": [
              {
                "text": "ride",
                "correct": true,
                "feedback": "You found it! ride tells the action. The helping verb could helps it, so ride is the main verb."
              },
              {
                "text": "could",
                "feedback": "The word could is the helping verb. It helps the main verb. Look for the word right after it that tells the action."
              },
              {
                "text": "Jordan",
                "feedback": "The word Jordan names a person. It is a noun. Look for the action word after could."
              },
              {
                "text": "bike",
                "feedback": "The word bike names a thing. It is a noun. Look for the action word after could."
              }
            ],
            "clue": "Remember: the main verb tells the action. It comes after the helping verb.",
            "reveal": "Let's find it together. The helping verb is could. The action word after it is ride, so ride is the main verb."
          },
          {
            "stage": 2,
            "std": [
              "GUM:G:helping-linking-verbs:I"
            ],
            "sentence": {
              "words": [
                "The",
                "soup",
                "in",
                "the",
                "big",
                "pot",
                "was",
                "hot."
              ]
            },
            "question": "Which word is the linking verb?",
            "choices": [
              {
                "text": "was",
                "correct": true,
                "feedback": "Great job! “was” does not show action. It links soup to hot, so “was” is the linking verb."
              },
              {
                "text": "soup",
                "feedback": "The word soup is the subject. It tells who or what the sentence is about. Look for the verb that links it to hot."
              },
              {
                "text": "hot",
                "feedback": "The word hot tells about soup. Look for the verb that links soup to hot."
              },
              {
                "text": "pot",
                "feedback": "The word pot names a thing. It is a noun. Look for the verb that links soup to hot."
              }
            ],
            "clue": "Remember: a linking verb does not show action. Try putting = in its place. If it still makes sense, it is a linking verb.",
            "reveal": "Let's find it together. soup = hot. The word that links them is “was”."
          },
          {
            "stage": 2,
            "std": [
              "GUM:G:helping-linking-verbs:I"
            ],
            "sentence": {
              "words": [
                "My",
                "uncle",
                "is",
                "a",
                "pilot",
                "for",
                "a",
                "big",
                "airline."
              ]
            },
            "question": "Which word is the linking verb?",
            "choices": [
              {
                "text": "is",
                "correct": true,
                "feedback": "Great job! “is” does not show action. It links uncle to pilot, so “is” is the linking verb."
              },
              {
                "text": "uncle",
                "feedback": "The word uncle is the subject. It tells who or what the sentence is about. Look for the verb that links it to pilot."
              },
              {
                "text": "pilot",
                "feedback": "The word pilot tells about uncle. Look for the verb that links uncle to pilot."
              },
              {
                "text": "airline",
                "feedback": "The word airline names a company. It is a noun. Look for the verb that links uncle to pilot."
              }
            ],
            "clue": "Remember: a linking verb does not show action. Try putting = in its place. If it still makes sense, it is a linking verb.",
            "reveal": "Let's find it together. uncle = pilot. The word that links them is “is”."
          },
          {
            "stage": 2,
            "std": [
              "GUM:G:helping-linking-verbs:I"
            ],
            "sentence": {
              "words": [
                "The",
                "sky",
                "became",
                "dark",
                "before",
                "the",
                "thunderstorm."
              ]
            },
            "question": "Which word is the linking verb?",
            "choices": [
              {
                "text": "became",
                "correct": true,
                "feedback": "Great job! became does not show action. It links sky to dark, so became is the linking verb."
              },
              {
                "text": "sky",
                "feedback": "The word sky is the subject. It tells who or what the sentence is about. Look for the verb that links it to dark."
              },
              {
                "text": "dark",
                "feedback": "The word dark tells about sky. Look for the verb that links sky to dark."
              },
              {
                "text": "thunderstorm",
                "feedback": "The word thunderstorm names a thing. It is a noun. Look for the verb that links sky to dark."
              }
            ],
            "clue": "Remember: a linking verb does not show action. Try putting = in its place. If it still makes sense, it is a linking verb.",
            "reveal": "Let's find it together. sky = dark. The word that links them is became."
          },
          {
            "stage": 2,
            "std": [
              "GUM:G:helping-linking-verbs:I"
            ],
            "sentence": {
              "words": [
                "The",
                "tiny",
                "kitten",
                "seems",
                "hungry",
                "this",
                "morning."
              ]
            },
            "question": "Which word is the linking verb?",
            "choices": [
              {
                "text": "seems",
                "correct": true,
                "feedback": "Great job! seems does not show action. It links kitten to hungry, so seems is the linking verb."
              },
              {
                "text": "kitten",
                "feedback": "The word kitten is the subject. It tells who or what the sentence is about. Look for the verb that links it to hungry."
              },
              {
                "text": "hungry",
                "feedback": "The word hungry tells about kitten. Look for the verb that links kitten to hungry."
              },
              {
                "text": "tiny",
                "feedback": "The word tiny tells what kind of kitten. It is an adjective. Look for the verb that links kitten to hungry."
              }
            ],
            "clue": "Remember: a linking verb does not show action. Try putting = in its place. If it still makes sense, it is a linking verb.",
            "reveal": "Let's find it together. kitten = hungry. The word that links them is seems."
          },
          {
            "stage": 2,
            "std": [
              "GUM:G:helping-linking-verbs:I"
            ],
            "sentence": {
              "words": [
                "The",
                "students",
                "were",
                "quiet",
                "during",
                "the",
                "fire",
                "drill."
              ]
            },
            "question": "Which word is the linking verb?",
            "choices": [
              {
                "text": "were",
                "correct": true,
                "feedback": "Great job! “were” does not show action. It links students to quiet, so “were” is the linking verb."
              },
              {
                "text": "students",
                "feedback": "The word students is the subject. It tells who or what the sentence is about. Look for the verb that links it to quiet."
              },
              {
                "text": "quiet",
                "feedback": "The word quiet tells about students. Look for the verb that links students to quiet."
              },
              {
                "text": "drill",
                "feedback": "The word drill names a thing. It is a noun. Look for the verb that links students to quiet."
              }
            ],
            "clue": "Remember: a linking verb does not show action. Try putting = in its place. If it still makes sense, it is a linking verb.",
            "reveal": "Let's find it together. students = quiet. The word that links them is “were”."
          },
          {
            "stage": 3,
            "std": [
              "GUM:G:helping-linking-verbs:I"
            ],
            "sentence": {
              "words": [
                "The",
                "baby",
                "is",
                "sleepy",
                "after",
                "her",
                "long",
                "bath."
              ]
            },
            "question": "What job does the word “is” do in this sentence?",
            "choices": [
              {
                "text": "helping verb",
                "feedback": "A helping verb comes before an action word. Here no action word comes after “is”. It links the subject to sleepy."
              },
              {
                "text": "linking verb",
                "correct": true,
                "feedback": "Great job! “is” does not show action. It links the subject to sleepy, so it is a linking verb."
              },
              {
                "text": "action verb",
                "feedback": "“is” does not show action by itself. It links the subject to sleepy."
              },
              {
                "text": "noun",
                "feedback": "The word “is” is a verb, not a noun. It does not name a person, place, or thing."
              }
            ],
            "clue": "Remember: look at the word right after it. If that word is an action, it is a helping verb. If it describes or names the subject, it is a linking verb.",
            "reveal": "Let's find it together. The word after “is” is sleepy, which describes the subject. There is no action, so “is” is a linking verb."
          },
          {
            "stage": 3,
            "std": [
              "GUM:G:helping-linking-verbs:I"
            ],
            "sentence": {
              "words": [
                "The",
                "baby",
                "is",
                "sleeping",
                "in",
                "her",
                "crib",
                "upstairs."
              ]
            },
            "question": "What job does the word “is” do in this sentence?",
            "choices": [
              {
                "text": "helping verb",
                "correct": true,
                "feedback": "You found it! “is” helps the main verb sleeping, so it is a helping verb."
              },
              {
                "text": "linking verb",
                "feedback": "Look at the word after “is”. The word sleeping is an action, so “is” is helping it, not linking."
              },
              {
                "text": "action verb",
                "feedback": "“is” does not show action by itself. The action is sleeping."
              },
              {
                "text": "noun",
                "feedback": "The word “is” is a verb, not a noun. It does not name a person, place, or thing."
              }
            ],
            "clue": "Remember: look at the word right after it. If that word is an action, it is a helping verb. If it describes or names the subject, it is a linking verb.",
            "reveal": "Let's find it together. The word after “is” is sleeping, an action. So “is” is a helping verb."
          },
          {
            "stage": 3,
            "std": [
              "GUM:G:helping-linking-verbs:I"
            ],
            "sentence": {
              "words": [
                "The",
                "boys",
                "were",
                "thirsty",
                "after",
                "the",
                "soccer",
                "game."
              ]
            },
            "question": "What job does the word “were” do in this sentence?",
            "choices": [
              {
                "text": "helping verb",
                "feedback": "A helping verb comes before an action word. Here no action word comes after “were”. It links the subject to thirsty."
              },
              {
                "text": "linking verb",
                "correct": true,
                "feedback": "Great job! “were” does not show action. It links the subject to thirsty, so it is a linking verb."
              },
              {
                "text": "action verb",
                "feedback": "“were” does not show action by itself. It links the subject to thirsty."
              },
              {
                "text": "noun",
                "feedback": "The word “were” is a verb, not a noun. It does not name a person, place, or thing."
              }
            ],
            "clue": "Remember: look at the word right after it. If that word is an action, it is a helping verb. If it describes or names the subject, it is a linking verb.",
            "reveal": "Let's find it together. The word after “were” is thirsty, which describes the subject. There is no action, so “were” is a linking verb."
          },
          {
            "stage": 3,
            "std": [
              "GUM:G:helping-linking-verbs:I"
            ],
            "sentence": {
              "words": [
                "The",
                "boys",
                "were",
                "running",
                "laps",
                "around",
                "the",
                "track."
              ]
            },
            "question": "What job does the word “were” do in this sentence?",
            "choices": [
              {
                "text": "helping verb",
                "correct": true,
                "feedback": "You found it! “were” helps the main verb running, so it is a helping verb."
              },
              {
                "text": "linking verb",
                "feedback": "Look at the word after “were”. The word running is an action, so “were” is helping it, not linking."
              },
              {
                "text": "action verb",
                "feedback": "“were” does not show action by itself. The action is running."
              },
              {
                "text": "noun",
                "feedback": "The word “were” is a verb, not a noun. It does not name a person, place, or thing."
              }
            ],
            "clue": "Remember: look at the word right after it. If that word is an action, it is a helping verb. If it describes or names the subject, it is a linking verb.",
            "reveal": "Let's find it together. The word after “were” is running, an action. So “were” is a helping verb."
          },
          {
            "stage": 3,
            "std": [
              "GUM:G:helping-linking-verbs:I"
            ],
            "sentence": {
              "words": [
                "Our",
                "dog",
                "was",
                "muddy",
                "after",
                "the",
                "rainstorm."
              ]
            },
            "question": "What job does the word “was” do in this sentence?",
            "choices": [
              {
                "text": "helping verb",
                "feedback": "A helping verb comes before an action word. Here no action word comes after “was”. It links the subject to muddy."
              },
              {
                "text": "linking verb",
                "correct": true,
                "feedback": "Great job! “was” does not show action. It links the subject to muddy, so it is a linking verb."
              },
              {
                "text": "action verb",
                "feedback": "“was” does not show action by itself. It links the subject to muddy."
              },
              {
                "text": "noun",
                "feedback": "The word “was” is a verb, not a noun. It does not name a person, place, or thing."
              }
            ],
            "clue": "Remember: look at the word right after it. If that word is an action, it is a helping verb. If it describes or names the subject, it is a linking verb.",
            "reveal": "Let's find it together. The word after “was” is muddy, which describes the subject. There is no action, so “was” is a linking verb."
          }
        ]
      },
      "studyGuide": {
        "title": "Helping & Linking Verbs Study Guide",
        "sections": [
          {
            "heading": "Helping verbs",
            "lines": [
              "A helping verb comes before the main verb and helps it."
            ],
            "chips": [
              "will",
              "can",
              "could",
              "should",
              "must",
              "may",
              "do",
              "does",
              "did",
              "am",
              "is",
              "are",
              "was",
              "were"
            ]
          },
          {
            "heading": "Linking verbs",
            "lines": [
              "A linking verb does not show action. It links the subject to a word that describes or names it."
            ],
            "chips": [
              "am",
              "is",
              "are",
              "was",
              "were",
              "seems",
              "becomes"
            ]
          },
          {
            "heading": "Same word, two jobs",
            "contrast": {
              "heading": "is can help or link",
              "rows": [
                {
                  "sentence": {
                    "words": [
                      "The",
                      "baby",
                      "is",
                      "sleepy."
                    ],
                    "marks": [
                      {
                        "start": 2,
                        "end": 2,
                        "kind": "verb",
                        "label": "LINKING VERB"
                      }
                    ]
                  },
                  "text": "is links baby to sleepy. The baby = sleepy."
                },
                {
                  "sentence": {
                    "words": [
                      "The",
                      "baby",
                      "is",
                      "sleeping."
                    ],
                    "marks": [
                      {
                        "start": 2,
                        "end": 2,
                        "kind": "verb",
                        "label": "HELPING VERB"
                      }
                    ]
                  },
                  "text": "is helps the main verb sleeping. Sleeping is the action."
                }
              ],
              "close": "Same word, two jobs. Read the word after it."
            }
          }
        ],
        "reminder": "Look at what comes after the verb. Action next means helping. Describing or naming next means linking."
      }
    },

    /* ===================================================== */
    /* VERB TENSE                                          */
    /* Build 1.5.0 — Georgia grade 3 skill. Bank reviewed     */
    /* independently (see AUDIT-REPORT-Build-1.5.0.md).       */
    /* ===================================================== */
    "verb-tense": {
      "name": "Verb Tense",
      "badge": "walked",
      "card": "Tell when it happens.",
      "color": "verb-tense",
      "ask": "When does it happen?",
      "icon": "clock",
      "preview": {
        "words": [
          "Yesterday",
          "we",
          "walked",
          "home."
        ],
        "start": 2,
        "end": 2
      },
      "practice": "bank",
      "test": "soon",
      "ga": [
        {
          "code": "3-5.L.GC.1",
          "label": "Simple verb tenses (R)"
        },
        {
          "code": "3-5.L.GC.1",
          "label": "Irregular past tense (Master)"
        },
        {
          "code": "3.L.GC.2.b",
          "label": "Keep the tense the same"
        }
      ],
      "definition": {
        "title": "What is verb tense?",
        "callout": {
          "title": "The tense of a verb tells when.",
          "rows": [
            {
              "key": "PAST",
              "text": "it already happened: walked"
            },
            {
              "key": "PRESENT",
              "text": "now or every day: walk, walks"
            },
            {
              "key": "FUTURE",
              "text": "it has not happened yet: will walk"
            }
          ]
        },
        "contrast": {
          "heading": "Same verb, three times",
          "rows": [
            {
              "sentence": {
                "words": [
                  "Yesterday",
                  "I",
                  "walked",
                  "to",
                  "school."
                ],
                "marks": [
                  {
                    "start": 2,
                    "end": 2,
                    "kind": "verb",
                    "label": "PAST"
                  }
                ]
              },
              "text": "It already happened."
            },
            {
              "sentence": {
                "words": [
                  "Every",
                  "day",
                  "I",
                  "walk",
                  "to",
                  "school."
                ],
                "marks": [
                  {
                    "start": 3,
                    "end": 3,
                    "kind": "verb",
                    "label": "PRESENT"
                  }
                ]
              },
              "text": "It happens every day."
            },
            {
              "sentence": {
                "words": [
                  "Tomorrow",
                  "I",
                  "will",
                  "walk",
                  "to",
                  "school."
                ],
                "marks": [
                  {
                    "start": 2,
                    "end": 3,
                    "kind": "verb",
                    "label": "FUTURE"
                  }
                ]
              },
              "text": "It has not happened yet."
            }
          ]
        },
        "note": "Some verbs have a special past tense instead of -ed: go becomes went, and eat becomes ate."
      },
      "clue": {
        "title": "How do I choose the tense?",
        "callout": {
          "title": "Look for time words:",
          "rows": [
            {
              "key": "PAST",
              "text": "yesterday, last night, ago"
            },
            {
              "key": "PRESENT",
              "text": "every day, always, now"
            },
            {
              "key": "FUTURE",
              "text": "tomorrow, next week, next year"
            }
          ]
        },
        "warning": "Keep the same tense. If a sentence starts in the past, keep the other verbs in the past too."
      },
      "example": {
        "title": "Let's keep the tense the same",
        "sentence": {
          "words": [
            "Last",
            "summer,",
            "we",
            "went",
            "to",
            "the",
            "lake",
            "and",
            "caught",
            "fish."
          ],
          "marks": [
            {
              "start": 3,
              "end": 3,
              "kind": "verb",
              "label": "PAST"
            },
            {
              "start": 8,
              "end": 8,
              "kind": "verb",
              "label": "PAST"
            }
          ]
        },
        "routine": [
          "Read the sentence.",
          "Find the time words: Last summer.",
          "Last summer is the past, so both verbs are past.",
          "went is the past of go. caught is the past of catch."
        ]
      },
      "learnTry": {
        "title": "Let me try",
        "sentence": {
          "words": [
            "Last",
            "night,",
            "my",
            "sister",
            "____",
            "me",
            "a",
            "funny",
            "story."
          ]
        },
        "question": "Which verb belongs in the blank?",
        "choices": [
          {
            "text": "told",
            "feedback": "You found it! Last night tells it already happened. tell has a special past tense: told.",
            "correct": true
          },
          {
            "text": "tells",
            "feedback": "The word tells is about now or every day. Last night tells it already happened."
          },
          {
            "text": "will tell",
            "feedback": "will tell is about the future. Last night tells it already happened."
          },
          {
            "text": "telled",
            "feedback": "The word telled is not used in correct writing. tell has a special past tense: told."
          }
        ]
      },
      "recap": "The tense of a verb tells when it happens. Use time words, and keep the tense the same.",
      "tryItBank": {
        "recap": "You practiced past, present, and future verbs, special past tense words, and keeping the tense the same in 20 different sentences.",
        "stages": [
          {
            "name": "Get Started",
            "desc": "Use time words like yesterday and tomorrow.",
            "mark": "⭐",
            "milestoneTitle": "Get Started complete!",
            "milestoneLine": "You used time words to choose past or future.",
            "nextStage": "Look Closer"
          },
          {
            "name": "Look Closer",
            "desc": "Some verbs have a special past tense.",
            "mark": "🌟",
            "milestoneTitle": "Look Closer complete!",
            "milestoneLine": "You used special past tense words like ate, went, and caught.",
            "nextStage": "Think It Through"
          },
          {
            "name": "Think It Through",
            "desc": "Keep the second verb in the same tense as the first.",
            "mark": "💪",
            "milestoneTitle": "Think It Through complete!",
            "milestoneLine": "You kept the tense the same inside each sentence.",
            "nextStage": "Challenge Yourself"
          },
          {
            "name": "Challenge Yourself",
            "desc": "Choose the sentence that is written correctly.",
            "mark": "🎉",
            "milestoneTitle": "You practiced Verb Tense 20 different ways!",
            "milestoneLine": "",
            "nextStage": ""
          }
        ],
        "questions": [
          {
            "stage": 0,
            "std": [
              "GUM:G:simple-verb-tenses:R"
            ],
            "sentence": {
              "words": [
                "Last",
                "night,",
                "our",
                "family",
                "____",
                "a",
                "movie",
                "together."
              ]
            },
            "question": "Which verb belongs in the blank?",
            "choices": [
              {
                "text": "watched",
                "correct": true,
                "feedback": "Nice thinking! Last night tells it already happened, so the verb is watched."
              },
              {
                "text": "watches",
                "feedback": "The word watches tells about now or every day. Last night tells it already happened."
              },
              {
                "text": "will watch",
                "feedback": "will watch tells that it has not happened yet. Last night tells it already happened."
              },
              {
                "text": "watching",
                "feedback": "The word watching cannot be the verb by itself. It needs a helping verb. Use the time words: Last night."
              }
            ],
            "clue": "Remember: look for time words. Yesterday and last night mean past. Tomorrow and next week mean future.",
            "reveal": "Let's find it together. Last night tells it already happened. So the verb is watched."
          },
          {
            "stage": 0,
            "std": [
              "GUM:G:simple-verb-tenses:R"
            ],
            "sentence": {
              "words": [
                "Next",
                "week,",
                "I",
                "____",
                "my",
                "grandmother",
                "in",
                "Macon."
              ]
            },
            "question": "Which verb belongs in the blank?",
            "choices": [
              {
                "text": "visited",
                "feedback": "The word visited tells that it already happened. Next week tells it has not happened yet."
              },
              {
                "text": "visits",
                "feedback": "The word visits does not go with I. Next week tells it has not happened yet, so use will."
              },
              {
                "text": "will visit",
                "correct": true,
                "feedback": "Nice thinking! Next week tells it has not happened yet, so the verb is will visit."
              },
              {
                "text": "visiting",
                "feedback": "The word visiting cannot be the verb by itself. It needs a helping verb. Use the time words: Next week."
              }
            ],
            "clue": "Remember: look for time words. Yesterday and last night mean past. Tomorrow and next week mean future.",
            "reveal": "Let's find it together. Next week tells it has not happened yet. So the verb is will visit."
          },
          {
            "stage": 0,
            "std": [
              "GUM:G:simple-verb-tenses:R"
            ],
            "sentence": {
              "words": [
                "Tomorrow,",
                "the",
                "students",
                "____",
                "their",
                "plants",
                "in",
                "the",
                "garden."
              ]
            },
            "question": "Which verb belongs in the blank?",
            "choices": [
              {
                "text": "watered",
                "feedback": "The word watered tells that it already happened. Tomorrow tells it has not happened yet."
              },
              {
                "text": "waters",
                "feedback": "The word waters does not match students, and Tomorrow tells it has not happened yet."
              },
              {
                "text": "will water",
                "correct": true,
                "feedback": "Nice thinking! Tomorrow tells it has not happened yet, so the verb is will water."
              },
              {
                "text": "watering",
                "feedback": "The word watering cannot be the verb by itself. It needs a helping verb. Use the time words: Tomorrow."
              }
            ],
            "clue": "Remember: look for time words. Yesterday and last night mean past. Tomorrow and next week mean future.",
            "reveal": "Let's find it together. Tomorrow tells it has not happened yet. So the verb is will water."
          },
          {
            "stage": 0,
            "std": [
              "GUM:G:simple-verb-tenses:R"
            ],
            "sentence": {
              "words": [
                "Yesterday,",
                "Dad",
                "____",
                "the",
                "leaky",
                "kitchen",
                "sink."
              ]
            },
            "question": "Which verb belongs in the blank?",
            "choices": [
              {
                "text": "fixed",
                "correct": true,
                "feedback": "Nice thinking! Yesterday tells it already happened, so the verb is fixed."
              },
              {
                "text": "fixes",
                "feedback": "The word fixes tells about now or every day. Yesterday tells it already happened."
              },
              {
                "text": "will fix",
                "feedback": "will fix tells that it has not happened yet. Yesterday tells it already happened."
              },
              {
                "text": "fixing",
                "feedback": "The word fixing cannot be the verb by itself. It needs a helping verb. Use the time words: Yesterday."
              }
            ],
            "clue": "Remember: look for time words. Yesterday and last night mean past. Tomorrow and next week mean future.",
            "reveal": "Let's find it together. Yesterday tells it already happened. So the verb is fixed."
          },
          {
            "stage": 0,
            "std": [
              "GUM:G:simple-verb-tenses:R"
            ],
            "sentence": {
              "words": [
                "Two",
                "days",
                "ago,",
                "it",
                "____",
                "all",
                "afternoon."
              ]
            },
            "question": "Which verb belongs in the blank?",
            "choices": [
              {
                "text": "rained",
                "correct": true,
                "feedback": "Nice thinking! Two days ago tells it already happened, so the verb is rained."
              },
              {
                "text": "rains",
                "feedback": "The word rains tells about now or every day. Two days ago tells it already happened."
              },
              {
                "text": "will rain",
                "feedback": "will rain tells that it has not happened yet. Two days ago tells it already happened."
              },
              {
                "text": "raining",
                "feedback": "The word raining cannot be the verb by itself. It needs a helping verb. Use the time words: Two days ago."
              }
            ],
            "clue": "Remember: look for time words. Yesterday and last night mean past. Tomorrow and next week mean future.",
            "reveal": "Let's find it together. Two days ago tells it already happened. So the verb is rained."
          },
          {
            "stage": 1,
            "std": [
              "GUM:G:irregular-past-verbs:M",
              "GUM:G:simple-verb-tenses:R"
            ],
            "sentence": {
              "words": [
                "Yesterday,",
                "Ben",
                "____",
                "his",
                "whole",
                "lunch",
                "at",
                "school."
              ]
            },
            "question": "Which verb belongs in the blank?",
            "choices": [
              {
                "text": "ate",
                "correct": true,
                "feedback": "You found it! eat has a special past tense: ate."
              },
              {
                "text": "eated",
                "feedback": "The word eated is not used in correct writing. eat does not add -ed. Its past tense is a special word."
              },
              {
                "text": "eats",
                "feedback": "The word eats tells about now or every day. Yesterday tells it already happened."
              },
              {
                "text": "will eat",
                "feedback": "will eat tells that it has not happened yet. Yesterday tells it already happened."
              }
            ],
            "clue": "Remember: some verbs do not add -ed for the past. They change to a new word, like go and went.",
            "reveal": "Let's find it together. Yesterday means it already happened. The past tense of eat is ate."
          },
          {
            "stage": 1,
            "std": [
              "GUM:G:irregular-past-verbs:M",
              "GUM:G:simple-verb-tenses:R"
            ],
            "sentence": {
              "words": [
                "Last",
                "summer,",
                "we",
                "____",
                "to",
                "the",
                "beach",
                "in",
                "Savannah."
              ]
            },
            "question": "Which verb belongs in the blank?",
            "choices": [
              {
                "text": "went",
                "correct": true,
                "feedback": "You found it! go has a special past tense: went."
              },
              {
                "text": "goed",
                "feedback": "The word goed is not used in correct writing. go does not add -ed. Its past tense is a special word."
              },
              {
                "text": "go",
                "feedback": "The word go tells about now or every day. Last summer tells it already happened."
              },
              {
                "text": "will go",
                "feedback": "will go tells that it has not happened yet. Last summer tells it already happened."
              }
            ],
            "clue": "Remember: some verbs do not add -ed for the past. They change to a new word, like go and went.",
            "reveal": "Let's find it together. Last summer means it already happened. The past tense of go is went."
          },
          {
            "stage": 1,
            "std": [
              "GUM:G:irregular-past-verbs:M",
              "GUM:G:simple-verb-tenses:R"
            ],
            "sentence": {
              "words": [
                "Earlier",
                "today,",
                "Kayla",
                "____",
                "a",
                "picture",
                "of",
                "her",
                "dog."
              ]
            },
            "question": "Which verb belongs in the blank?",
            "choices": [
              {
                "text": "drew",
                "correct": true,
                "feedback": "You found it! draw has a special past tense: drew."
              },
              {
                "text": "drawed",
                "feedback": "The word drawed is not used in correct writing. draw does not add -ed. Its past tense is a special word."
              },
              {
                "text": "draws",
                "feedback": "The word draws tells about now or every day. Earlier today tells it already happened."
              },
              {
                "text": "will draw",
                "feedback": "will draw tells that it has not happened yet. Earlier today tells it already happened."
              }
            ],
            "clue": "Remember: some verbs do not add -ed for the past. They change to a new word, like go and went.",
            "reveal": "Let's find it together. Earlier today means it already happened. The past tense of draw is drew."
          },
          {
            "stage": 1,
            "std": [
              "GUM:G:irregular-past-verbs:M",
              "GUM:G:simple-verb-tenses:R"
            ],
            "sentence": {
              "words": [
                "Last",
                "week,",
                "my",
                "uncle",
                "____",
                "a",
                "huge",
                "fish",
                "at",
                "the",
                "lake."
              ]
            },
            "question": "Which verb belongs in the blank?",
            "choices": [
              {
                "text": "caught",
                "correct": true,
                "feedback": "You found it! catch has a special past tense: caught."
              },
              {
                "text": "catched",
                "feedback": "The word catched is not used in correct writing. catch does not add -ed. Its past tense is a special word."
              },
              {
                "text": "catches",
                "feedback": "The word catches tells about now or every day. Last week tells it already happened."
              },
              {
                "text": "will catch",
                "feedback": "will catch tells that it has not happened yet. Last week tells it already happened."
              }
            ],
            "clue": "Remember: some verbs do not add -ed for the past. They change to a new word, like go and went.",
            "reveal": "Let's find it together. Last week means it already happened. The past tense of catch is caught."
          },
          {
            "stage": 1,
            "std": [
              "GUM:G:irregular-past-verbs:M",
              "GUM:G:simple-verb-tenses:R"
            ],
            "sentence": {
              "words": [
                "Yesterday,",
                "the",
                "puppy",
                "____",
                "a",
                "hole",
                "under",
                "the",
                "fence."
              ]
            },
            "question": "Which verb belongs in the blank?",
            "choices": [
              {
                "text": "dug",
                "correct": true,
                "feedback": "You found it! dig has a special past tense: dug."
              },
              {
                "text": "digged",
                "feedback": "The word digged is not used in correct writing. dig does not add -ed. Its past tense is a special word."
              },
              {
                "text": "digs",
                "feedback": "The word digs tells about now or every day. Yesterday tells it already happened."
              },
              {
                "text": "will dig",
                "feedback": "will dig tells that it has not happened yet. Yesterday tells it already happened."
              }
            ],
            "clue": "Remember: some verbs do not add -ed for the past. They change to a new word, like go and went.",
            "reveal": "Let's find it together. Yesterday means it already happened. The past tense of dig is dug."
          },
          {
            "stage": 2,
            "std": [
              "3.L.GC.2.b",
              "GUM:G:simple-verb-tenses:R"
            ],
            "sentence": {
              "words": [
                "Mia",
                "opened",
                "the",
                "box",
                "and",
                "____",
                "a",
                "puppy",
                "inside."
              ]
            },
            "question": "Which verb keeps the same tense?",
            "choices": [
              {
                "text": "found",
                "correct": true,
                "feedback": "Great job! opened tells about the past, so the next verb stays in the same tense: found."
              },
              {
                "text": "finds",
                "feedback": "The word finds tells about now. opened tells about the past, so keep the past tense."
              },
              {
                "text": "will find",
                "feedback": "will find tells about the future. opened tells about the past, so keep the past tense."
              },
              {
                "text": "finding",
                "feedback": "The word finding cannot be the verb by itself. It needs a helping verb. Match opened: found."
              }
            ],
            "clue": "Remember: look at the first verb. Keep the next verb in the same tense.",
            "reveal": "Let's find it together. The first verb, opened, tells about the past. The verb that matches it is found."
          },
          {
            "stage": 2,
            "std": [
              "3.L.GC.2.b",
              "GUM:G:simple-verb-tenses:R"
            ],
            "sentence": {
              "words": [
                "Every",
                "morning,",
                "my",
                "dad",
                "makes",
                "breakfast",
                "and",
                "____",
                "the",
                "dishes."
              ]
            },
            "question": "Which verb keeps the same tense?",
            "choices": [
              {
                "text": "washes",
                "correct": true,
                "feedback": "Great job! makes tells about every day, so the next verb stays in the same tense: washes."
              },
              {
                "text": "washed",
                "feedback": "The word washed tells about the past. makes tells about every day, so keep the present tense."
              },
              {
                "text": "will wash",
                "feedback": "will wash tells about the future. makes tells about every day, so keep the present tense."
              },
              {
                "text": "washing",
                "feedback": "The word washing cannot be the verb by itself. It needs a helping verb. Match makes: washes."
              }
            ],
            "clue": "Remember: look at the first verb. Keep the next verb in the same tense.",
            "reveal": "Let's find it together. The first verb, makes, tells about every day. The verb that matches it is washes."
          },
          {
            "stage": 2,
            "std": [
              "3.L.GC.2.b",
              "GUM:G:simple-verb-tenses:R"
            ],
            "sentence": {
              "words": [
                "The",
                "cat",
                "jumped",
                "onto",
                "the",
                "couch",
                "and",
                "____",
                "asleep."
              ]
            },
            "question": "Which verb keeps the same tense?",
            "choices": [
              {
                "text": "fell",
                "correct": true,
                "feedback": "Great job! jumped tells about the past, so the next verb stays in the same tense: fell."
              },
              {
                "text": "falls",
                "feedback": "The word falls tells about now. jumped tells about the past, so keep the past tense."
              },
              {
                "text": "will fall",
                "feedback": "will fall tells about the future. jumped tells about the past, so keep the past tense."
              },
              {
                "text": "falled",
                "feedback": "The word falled is not used in correct writing. The past tense of fall is a special word: fell."
              }
            ],
            "clue": "Remember: look at the first verb. Keep the next verb in the same tense.",
            "reveal": "Let's find it together. The first verb, jumped, tells about the past. The verb that matches it is fell."
          },
          {
            "stage": 2,
            "std": [
              "3.L.GC.2.b",
              "GUM:G:simple-verb-tenses:R"
            ],
            "sentence": {
              "words": [
                "Every",
                "afternoon,",
                "Leo",
                "walks",
                "the",
                "dog",
                "and",
                "____",
                "it",
                "a",
                "treat."
              ]
            },
            "question": "Which verb keeps the same tense?",
            "choices": [
              {
                "text": "gives",
                "correct": true,
                "feedback": "Great job! walks tells about every day, so the next verb stays in the same tense: gives."
              },
              {
                "text": "gave",
                "feedback": "The word gave tells about the past. walks tells about every day, so keep the present tense."
              },
              {
                "text": "will give",
                "feedback": "will give tells about the future. walks tells about every day, so keep the present tense."
              },
              {
                "text": "giving",
                "feedback": "The word giving cannot be the verb by itself. It needs a helping verb. Match walks: gives."
              }
            ],
            "clue": "Remember: look at the first verb. Keep the next verb in the same tense.",
            "reveal": "Let's find it together. The first verb, walks, tells about every day. The verb that matches it is gives."
          },
          {
            "stage": 2,
            "std": [
              "3.L.GC.2.b",
              "GUM:G:simple-verb-tenses:R"
            ],
            "sentence": {
              "words": [
                "Yesterday,",
                "our",
                "class",
                "planted",
                "seeds",
                "and",
                "____",
                "them",
                "with",
                "water."
              ]
            },
            "question": "Which verb keeps the same tense?",
            "choices": [
              {
                "text": "sprinkled",
                "correct": true,
                "feedback": "Great job! planted tells about the past, so the next verb stays in the same tense: sprinkled."
              },
              {
                "text": "sprinkles",
                "feedback": "The word sprinkles tells about now. planted tells about the past, so keep the past tense."
              },
              {
                "text": "will sprinkle",
                "feedback": "will sprinkle tells about the future. planted tells about the past, so keep the past tense."
              },
              {
                "text": "sprinkling",
                "feedback": "The word sprinkling cannot be the verb by itself. It needs a helping verb. Match planted: sprinkled."
              }
            ],
            "clue": "Remember: look at the first verb. Keep the next verb in the same tense.",
            "reveal": "Let's find it together. The first verb, planted, tells about the past. The verb that matches it is sprinkled."
          },
          {
            "stage": 3,
            "std": [
              "3.L.GC.2.b",
              "GUM:G:simple-verb-tenses:R"
            ],
            "sentence": {
              "words": [
                "Yesterday,",
                "we",
                "went",
                "to",
                "the",
                "park",
                "and",
                "play",
                "soccer."
              ]
            },
            "question": "Which is the correct way to write this sentence?",
            "choices": [
              {
                "text": "Yesterday, we went to the park and played soccer.",
                "correct": true,
                "feedback": "You found it! “Yesterday, we went to the park and played soccer.” Yesterday and went tell about the past, so played keeps the past tense."
              },
              {
                "text": "Yesterday, we went to the park and plays soccer.",
                "feedback": "plays tells about now, and we plays does not match. Keep the past tense: played."
              },
              {
                "text": "Yesterday, we go to the park and played soccer.",
                "feedback": "go tells about now. Yesterday tells about the past, so it should be went."
              },
              {
                "text": "Yesterday, we went to the park and will play soccer.",
                "feedback": "will play tells about the future. Yesterday tells about the past."
              }
            ],
            "clue": "Remember: Yesterday means the past. Every verb should tell about the past.",
            "reveal": "Let's fix it together. Yesterday tells about the past. went is past, so play should be played. The correct sentence is: “Yesterday, we went to the park and played soccer.”"
          },
          {
            "stage": 3,
            "std": [
              "GUM:G:irregular-past-verbs:M",
              "GUM:G:simple-verb-tenses:R"
            ],
            "sentence": {
              "words": [
                "Last",
                "night,",
                "I",
                "eated",
                "three",
                "tacos",
                "for",
                "dinner."
              ]
            },
            "question": "Which is the correct way to write this sentence?",
            "choices": [
              {
                "text": "Last night, I eat three tacos for dinner.",
                "feedback": "eat tells about now. Last night tells about the past."
              },
              {
                "text": "Last night, I ate three tacos for dinner.",
                "correct": true,
                "feedback": "Great job! “Last night, I ate three tacos for dinner.” The past tense of eat is ate."
              },
              {
                "text": "Last night, I will eat three tacos for dinner.",
                "feedback": "will eat tells about the future. Last night tells about the past."
              },
              {
                "text": "Last night, I eats three tacos for dinner.",
                "feedback": "eats tells about now, and I eats does not match. The past tense of eat is ate."
              }
            ],
            "clue": "Remember: eat does not add -ed. Its past tense is a special word.",
            "reveal": "Let's fix it together. eated is not used in correct writing. The past tense of eat is ate. The correct sentence is: “Last night, I ate three tacos for dinner.”"
          },
          {
            "stage": 3,
            "std": [
              "GUM:G:simple-verb-tenses:R"
            ],
            "sentence": {
              "words": [
                "Tomorrow,",
                "my",
                "mom",
                "drove",
                "us",
                "to",
                "the",
                "library."
              ]
            },
            "question": "Which is the correct way to write this sentence?",
            "choices": [
              {
                "text": "Tomorrow, my mom drive us to the library.",
                "feedback": "drive does not match my mom, and it does not tell about tomorrow. Tomorrow needs will."
              },
              {
                "text": "Tomorrow, my mom driving us to the library.",
                "feedback": "driving cannot be the verb by itself. It needs a helping verb. Tomorrow needs will."
              },
              {
                "text": "Tomorrow, my mom will drive us to the library.",
                "correct": true,
                "feedback": "Nice thinking! “Tomorrow, my mom will drive us to the library.” Tomorrow tells about the future, so the verb is will drive."
              },
              {
                "text": "Tomorrow, my mom drove us to the library.",
                "feedback": "drove tells about the past. Tomorrow tells about the future."
              }
            ],
            "clue": "Remember: Tomorrow means the future. The future uses will.",
            "reveal": "Let's fix it together. Tomorrow tells it has not happened yet. drove is past, so it should be will drive. The correct sentence is: “Tomorrow, my mom will drive us to the library.”"
          },
          {
            "stage": 3,
            "std": [
              "3.L.GC.2.b",
              "GUM:G:simple-verb-tenses:R"
            ],
            "sentence": {
              "words": [
                "Yesterday,",
                "the",
                "bird",
                "builds",
                "a",
                "nest",
                "and",
                "laid",
                "three",
                "eggs."
              ]
            },
            "question": "Which is the correct way to write this sentence?",
            "choices": [
              {
                "text": "Yesterday, the bird built a nest and laid three eggs.",
                "correct": true,
                "feedback": "You found it! “Yesterday, the bird built a nest and laid three eggs.” built and laid both tell about the past, so the tense stays the same."
              },
              {
                "text": "Yesterday, the bird builds a nest and layed three eggs.",
                "feedback": "layed is not used in correct writing, and builds tells about now. Yesterday needs both verbs in the past."
              },
              {
                "text": "Yesterday, the bird build a nest and laid three eggs.",
                "feedback": "build does not match one bird, and it does not tell about the past."
              },
              {
                "text": "Yesterday, the bird builds a nest and will laid three eggs.",
                "feedback": "will laid is not correct, and Yesterday needs both verbs in the past."
              }
            ],
            "clue": "Remember: Yesterday means the past. Both verbs should tell about the past.",
            "reveal": "Let's fix it together. Yesterday tells about the past, and laid is already past. Change builds to built so both verbs tell about the past. The correct sentence is: “Yesterday, the bird built a nest and laid three eggs.”"
          },
          {
            "stage": 3,
            "std": [
              "GUM:G:irregular-past-verbs:M",
              "GUM:G:simple-verb-tenses:R"
            ],
            "sentence": {
              "words": [
                "My",
                "brother",
                "catched",
                "the",
                "ball",
                "and",
                "threw",
                "it",
                "back."
              ]
            },
            "question": "Which is the correct way to write this sentence?",
            "choices": [
              {
                "text": "My brother caught the ball and throwed it back.",
                "feedback": "caught is right, but throwed is not used in correct writing. The past tense of throw is threw."
              },
              {
                "text": "My brother catched the ball and threw it back.",
                "feedback": "catched is not used in correct writing. The past tense of catch is caught."
              },
              {
                "text": "My brother caught the ball and threw it back.",
                "correct": true,
                "feedback": "Great job! “My brother caught the ball and threw it back.” The past tense of catch is caught, and the past tense of throw is threw."
              },
              {
                "text": "My brother catches the ball and threw it back.",
                "feedback": "catches tells about now and threw tells about the past. The tenses do not match."
              }
            ],
            "clue": "Remember: catch does not add -ed. It has a special past tense.",
            "reveal": "Let's fix it together. catched is not used in correct writing. The past tense of catch is caught. The correct sentence is: “My brother caught the ball and threw it back.”"
          }
        ]
      },
      "studyGuide": {
        "title": "Verb Tense Study Guide",
        "sections": [
          {
            "heading": "Past: it already happened",
            "chips": [
              "walked",
              "played",
              "jumped",
              "fixed"
            ]
          },
          {
            "heading": "Present: now or every day",
            "chips": [
              "walk",
              "walks",
              "play",
              "plays"
            ]
          },
          {
            "heading": "Future: it has not happened yet",
            "chips": [
              "will walk",
              "will play",
              "will jump"
            ]
          },
          {
            "heading": "Special past tense words",
            "chips": [
              "go: went",
              "eat: ate",
              "catch: caught",
              "throw: threw",
              "draw: drew",
              "dig: dug",
              "fall: fell",
              "find: found",
              "build: built",
              "lay: laid"
            ]
          }
        ],
        "reminder": "Look for time words, and keep every verb in a sentence in the same tense."
      }
    },

    /* ===================================================== */
    /* SUBJECT-VERB AGREEMENT                              */
    /* Build 1.5.0 — Georgia grade 3 skill. Bank reviewed     */
    /* independently (see AUDIT-REPORT-Build-1.5.0.md).       */
    /* ===================================================== */
    "agreement": {
      "name": "Subject-Verb Agreement",
      "badge": "dogs bark",
      "card": "Make the subject and verb match.",
      "color": "agreement",
      "ask": "Do the subject and verb match?",
      "icon": "scales",
      "preview": {
        "words": [
          "The",
          "dogs",
          "bark",
          "loudly."
        ],
        "start": 1,
        "end": 2
      },
      "practice": "bank",
      "test": "soon",
      "ga": [
        {
          "code": "3.L.GC.2.c",
          "label": "Subject-verb agreement"
        },
        {
          "code": "3-5.L.GC.1",
          "label": "Collective nouns (Master)"
        },
        {
          "code": "3-5.L.GC.1",
          "label": "Prepositional phrases (C)"
        }
      ],
      "definition": {
        "title": "What is subject-verb agreement?",
        "callout": {
          "title": "The subject and the verb must match.",
          "rows": [
            {
              "key": "ONE",
              "text": "the verb usually ends in -s: The dog barks."
            },
            {
              "key": "MORE",
              "text": "no -s: The dogs bark."
            },
            {
              "key": "I / YOU",
              "text": "no -s: I run. You run."
            }
          ]
        },
        "contrast": {
          "heading": "Same verb, two subjects",
          "rows": [
            {
              "sentence": {
                "words": [
                  "The",
                  "dog",
                  "barks",
                  "at",
                  "the",
                  "mail",
                  "truck."
                ],
                "marks": [
                  {
                    "start": 1,
                    "end": 1,
                    "kind": "subject",
                    "label": "ONE"
                  },
                  {
                    "start": 2,
                    "end": 2,
                    "kind": "verb",
                    "label": "ENDS IN -S"
                  }
                ]
              },
              "text": "One dog, so the verb ends in -s."
            },
            {
              "sentence": {
                "words": [
                  "The",
                  "dogs",
                  "bark",
                  "at",
                  "the",
                  "mail",
                  "truck."
                ],
                "marks": [
                  {
                    "start": 1,
                    "end": 1,
                    "kind": "subject",
                    "label": "MORE"
                  },
                  {
                    "start": 2,
                    "end": 2,
                    "kind": "verb",
                    "label": "NO -S"
                  }
                ]
              },
              "text": "More than one dog, so the verb has no -s."
            }
          ]
        },
        "note": "One goes with is and was. More than one goes with are and were. I goes with am."
      },
      "clue": {
        "title": "How do I make them match?",
        "callout": {
          "title": "Three steps:",
          "rows": [
            {
              "key": "1",
              "text": "Find the verb."
            },
            {
              "key": "2",
              "text": "Find the subject."
            },
            {
              "key": "3",
              "text": "One or more than one? Make the verb match."
            }
          ]
        },
        "warning": "Words in between can trick you. In The boxes on the shelf are heavy, the subject is boxes, not shelf."
      },
      "example": {
        "title": "Let's match a subject with two parts",
        "sentence": {
          "words": [
            "Maya",
            "and",
            "her",
            "brother",
            "walk",
            "to",
            "school",
            "together."
          ],
          "marks": [
            {
              "start": 0,
              "end": 0,
              "kind": "subject",
              "label": "SUBJECT"
            },
            {
              "start": 3,
              "end": 3,
              "kind": "subject",
              "label": "SUBJECT"
            },
            {
              "start": 4,
              "end": 4,
              "kind": "verb",
              "label": "NO -S"
            }
          ]
        },
        "routine": [
          "Read the sentence.",
          "Find the verb: walk.",
          "Who walks? Maya and her brother. That is two people.",
          "More than one goes with walk, not walks."
        ],
        "noteTitle": "A group is one",
        "note": "A word for a group, like team or flock, is one group: The team is ready."
      },
      "learnTry": {
        "title": "Let me try",
        "sentence": {
          "words": [
            "The",
            "kittens",
            "in",
            "the",
            "basket",
            "____",
            "softly."
          ]
        },
        "question": "Which verb matches the subject?",
        "choices": [
          {
            "text": "purr",
            "feedback": "Great job! The subject is kittens, not basket. kittens means more than one, so the verb is purr.",
            "correct": true
          },
          {
            "text": "purrs",
            "feedback": "The word purrs goes with one. The subject is kittens, more than one. basket is right before the blank, but it is not the subject."
          },
          {
            "text": "purring",
            "feedback": "The word purring cannot be the verb by itself. It needs a helping verb."
          },
          {
            "text": "to purr",
            "feedback": "to purr cannot be the verb by itself. Choose the verb that matches kittens."
          }
        ]
      },
      "recap": "The subject and the verb must match. One goes with -s. More than one goes with no -s.",
      "tryItBank": {
        "recap": "You practiced making subjects and verbs match in 20 different sentences, even when other words got in the way.",
        "stages": [
          {
            "name": "Get Started",
            "desc": "Is the subject one, or more than one?",
            "mark": "⭐",
            "milestoneTitle": "Get Started complete!",
            "milestoneLine": "You matched verbs to subjects that were one or more than one.",
            "nextStage": "Look Closer"
          },
          {
            "name": "Look Closer",
            "desc": "Choose am, is, or are.",
            "mark": "🌟",
            "milestoneTitle": "Look Closer complete!",
            "milestoneLine": "You chose am, is, and are, even for teams and pairs.",
            "nextStage": "Think It Through"
          },
          {
            "name": "Think It Through",
            "desc": "Skip the words between the subject and the verb.",
            "mark": "💪",
            "milestoneTitle": "Think It Through complete!",
            "milestoneLine": "You found the real subject when other words got in the way.",
            "nextStage": "Challenge Yourself"
          },
          {
            "name": "Challenge Yourself",
            "desc": "Choose the sentence that is written correctly.",
            "mark": "🎉",
            "milestoneTitle": "You practiced Subject-Verb Agreement 20 different ways!",
            "milestoneLine": "",
            "nextStage": ""
          }
        ],
        "questions": [
          {
            "stage": 0,
            "std": [
              "3.L.GC.2.c",
              "GUM:G:verbs-add-s-es:R"
            ],
            "sentence": {
              "words": [
                "The",
                "playful",
                "puppy",
                "____",
                "at",
                "the",
                "mail",
                "carrier."
              ]
            },
            "question": "Which verb matches the subject?",
            "choices": [
              {
                "text": "barks",
                "correct": true,
                "feedback": "Nice thinking! The word puppy means one, so the verb is barks."
              },
              {
                "text": "bark",
                "feedback": "The word bark goes with more than one. The word puppy means one, so the verb needs -s."
              },
              {
                "text": "barking",
                "feedback": "The word barking cannot be the verb by itself. It needs a helping verb. Choose the verb that matches puppy."
              },
              {
                "text": "to bark",
                "feedback": "to bark cannot be the verb by itself. Choose the verb that matches puppy."
              }
            ],
            "clue": "Remember: find the subject. One subject: the verb usually ends in -s. More than one: no -s.",
            "reveal": "Let's find it together. The subject is puppy. The word puppy means one, so the verb is barks."
          },
          {
            "stage": 0,
            "std": [
              "3.L.GC.2.c",
              "GUM:G:verbs-add-s-es:R"
            ],
            "sentence": {
              "words": [
                "My",
                "two",
                "cousins",
                "____",
                "to",
                "my",
                "school",
                "every",
                "day."
              ]
            },
            "question": "Which verb matches the subject?",
            "choices": [
              {
                "text": "walk",
                "correct": true,
                "feedback": "Nice thinking! The word cousins means more than one, so the verb is walk."
              },
              {
                "text": "walks",
                "feedback": "The word walks goes with one. The word cousins means more than one, so the verb has no -s."
              },
              {
                "text": "walking",
                "feedback": "The word walking cannot be the verb by itself. It needs a helping verb. Choose the verb that matches cousins."
              },
              {
                "text": "to walk",
                "feedback": "to walk cannot be the verb by itself. Choose the verb that matches cousins."
              }
            ],
            "clue": "Remember: find the subject. One subject: the verb usually ends in -s. More than one: no -s.",
            "reveal": "Let's find it together. The subject is cousins. The word cousins means more than one, so the verb is walk."
          },
          {
            "stage": 0,
            "std": [
              "3.L.GC.2.c",
              "GUM:G:verbs-add-s-es:R"
            ],
            "sentence": {
              "words": [
                "Our",
                "teacher",
                "____",
                "a",
                "new",
                "book",
                "to",
                "class",
                "every",
                "Friday."
              ]
            },
            "question": "Which verb matches the subject?",
            "choices": [
              {
                "text": "brings",
                "correct": true,
                "feedback": "Nice thinking! The word teacher means one, so the verb is brings."
              },
              {
                "text": "bring",
                "feedback": "The word bring goes with more than one. The word teacher means one, so the verb needs -s."
              },
              {
                "text": "bringing",
                "feedback": "The word bringing cannot be the verb by itself. It needs a helping verb. Choose the verb that matches teacher."
              },
              {
                "text": "to bring",
                "feedback": "to bring cannot be the verb by itself. Choose the verb that matches teacher."
              }
            ],
            "clue": "Remember: find the subject. One subject: the verb usually ends in -s. More than one: no -s.",
            "reveal": "Let's find it together. The subject is teacher. The word teacher means one, so the verb is brings."
          },
          {
            "stage": 0,
            "std": [
              "3.L.GC.2.c",
              "GUM:G:verbs-add-s-es:R"
            ],
            "sentence": {
              "words": [
                "The",
                "busy",
                "bees",
                "____",
                "from",
                "flower",
                "to",
                "flower."
              ]
            },
            "question": "Which verb matches the subject?",
            "choices": [
              {
                "text": "buzz",
                "correct": true,
                "feedback": "Nice thinking! The word bees means more than one, so the verb is buzz."
              },
              {
                "text": "buzzes",
                "feedback": "The word buzzes goes with one. The word bees means more than one, so the verb has no -s."
              },
              {
                "text": "buzzing",
                "feedback": "The word buzzing cannot be the verb by itself. It needs a helping verb. Choose the verb that matches bees."
              },
              {
                "text": "to buzz",
                "feedback": "to buzz cannot be the verb by itself. Choose the verb that matches bees."
              }
            ],
            "clue": "Remember: find the subject. One subject: the verb usually ends in -s. More than one: no -s.",
            "reveal": "Let's find it together. The subject is bees. The word bees means more than one, so the verb is buzz."
          },
          {
            "stage": 0,
            "std": [
              "3.L.GC.2.c",
              "GUM:G:verbs-add-s-es:R"
            ],
            "sentence": {
              "words": [
                "My",
                "grandfather",
                "____",
                "tomatoes",
                "in",
                "his",
                "backyard",
                "garden."
              ]
            },
            "question": "Which verb matches the subject?",
            "choices": [
              {
                "text": "grows",
                "correct": true,
                "feedback": "Nice thinking! The word grandfather means one, so the verb is grows."
              },
              {
                "text": "grow",
                "feedback": "The word grow goes with more than one. The word grandfather means one, so the verb needs -s."
              },
              {
                "text": "growing",
                "feedback": "The word growing cannot be the verb by itself. It needs a helping verb. Choose the verb that matches grandfather."
              },
              {
                "text": "to grow",
                "feedback": "to grow cannot be the verb by itself. Choose the verb that matches grandfather."
              }
            ],
            "clue": "Remember: find the subject. One subject: the verb usually ends in -s. More than one: no -s.",
            "reveal": "Let's find it together. The subject is grandfather. The word grandfather means one, so the verb is grows."
          },
          {
            "stage": 1,
            "std": [
              "3.L.GC.2.c"
            ],
            "sentence": {
              "words": [
                "I",
                "____",
                "ready",
                "for",
                "the",
                "spelling",
                "test",
                "today."
              ]
            },
            "question": "Which verb matches the subject?",
            "choices": [
              {
                "text": "is",
                "feedback": "The word “is” goes with one person or thing, but never with I. I goes with am."
              },
              {
                "text": "are",
                "feedback": "The word “are” goes with more than one, and with you. I goes with am."
              },
              {
                "text": "am",
                "correct": true,
                "feedback": "Great job! I goes with “am.”"
              },
              {
                "text": "be",
                "feedback": "The word be cannot be the verb by itself here. Use am, is, or are."
              }
            ],
            "clue": "Remember: I goes with am. One goes with is. More than one goes with are.",
            "reveal": "Let's find it together. The subject is I. I goes with “am.”"
          },
          {
            "stage": 1,
            "std": [
              "3.L.GC.2.c"
            ],
            "sentence": {
              "words": [
                "Maya",
                "and",
                "her",
                "brother",
                "____",
                "ready",
                "for",
                "the",
                "field",
                "trip."
              ]
            },
            "question": "Which verb matches the subject?",
            "choices": [
              {
                "text": "is",
                "feedback": "The word “is” goes with one person or thing. The subject is Maya and her brother."
              },
              {
                "text": "are",
                "correct": true,
                "feedback": "Great job! Maya and her brother are two people, so the verb is “are.” Two people joined by and mean more than one."
              },
              {
                "text": "am",
                "feedback": "The word “am” goes only with I. The subject is Maya and her brother."
              },
              {
                "text": "be",
                "feedback": "The word be cannot be the verb by itself here. Use am, is, or are."
              }
            ],
            "clue": "Remember: I goes with am. One goes with is. More than one goes with are.",
            "reveal": "Let's find it together. The subject is Maya and her brother. Maya and her brother are two people, so the verb is “are.”"
          },
          {
            "stage": 1,
            "std": [
              "3.L.GC.2.c",
              "GUM:G:collective-abstract-nouns:M"
            ],
            "sentence": {
              "words": [
                "Our",
                "soccer",
                "team",
                "____",
                "ready",
                "for",
                "the",
                "big",
                "game."
              ]
            },
            "question": "Which verb matches the subject?",
            "choices": [
              {
                "text": "is",
                "correct": true,
                "feedback": "Great job! The word team means one, so the verb is “is.” A team is one group, even though it has many players."
              },
              {
                "text": "are",
                "feedback": "The word “are” goes with more than one, and with you. The subject is team."
              },
              {
                "text": "am",
                "feedback": "The word “am” goes only with I. The subject is team."
              },
              {
                "text": "be",
                "feedback": "The word be cannot be the verb by itself here. Use am, is, or are."
              }
            ],
            "clue": "Remember: I goes with am. One goes with is. More than one goes with are.",
            "reveal": "Let's find it together. The subject is team. The word team means one, so the verb is “is.”"
          },
          {
            "stage": 1,
            "std": [
              "3.L.GC.2.c"
            ],
            "sentence": {
              "words": [
                "My",
                "best",
                "friends",
                "____",
                "funny",
                "and",
                "kind",
                "to",
                "everyone."
              ]
            },
            "question": "Which verb matches the subject?",
            "choices": [
              {
                "text": "is",
                "feedback": "The word “is” goes with one person or thing. The subject is friends."
              },
              {
                "text": "are",
                "correct": true,
                "feedback": "Great job! The word friends means more than one, so the verb is “are.”"
              },
              {
                "text": "am",
                "feedback": "The word “am” goes only with I. The subject is friends."
              },
              {
                "text": "be",
                "feedback": "The word be cannot be the verb by itself here. Use am, is, or are."
              }
            ],
            "clue": "Remember: I goes with am. One goes with is. More than one goes with are.",
            "reveal": "Let's find it together. The subject is friends. The word friends means more than one, so the verb is “are.”"
          },
          {
            "stage": 1,
            "std": [
              "3.L.GC.2.c"
            ],
            "sentence": {
              "words": [
                "The",
                "library",
                "____",
                "quiet",
                "in",
                "the",
                "morning."
              ]
            },
            "question": "Which verb matches the subject?",
            "choices": [
              {
                "text": "is",
                "correct": true,
                "feedback": "Great job! The word library means one, so the verb is “is.”"
              },
              {
                "text": "are",
                "feedback": "The word “are” goes with more than one, and with you. The subject is library."
              },
              {
                "text": "am",
                "feedback": "The word “am” goes only with I. The subject is library."
              },
              {
                "text": "be",
                "feedback": "The word be cannot be the verb by itself here. Use am, is, or are."
              }
            ],
            "clue": "Remember: I goes with am. One goes with is. More than one goes with are.",
            "reveal": "Let's find it together. The subject is library. The word library means one, so the verb is “is.”"
          },
          {
            "stage": 2,
            "std": [
              "3.L.GC.2.c",
              "GUM:G:prepositional-phrases:C"
            ],
            "sentence": {
              "words": [
                "The",
                "boxes",
                "on",
                "the",
                "top",
                "shelf",
                "____",
                "heavy."
              ]
            },
            "question": "Which verb matches the subject?",
            "choices": [
              {
                "text": "is",
                "feedback": "The word “is” goes with one person or thing. The subject is boxes. shelf is right before the blank, but the subject is boxes."
              },
              {
                "text": "are",
                "correct": true,
                "feedback": "Great job! The word boxes means more than one, so the verb is “are.” shelf is right before the blank, but the subject is boxes."
              },
              {
                "text": "am",
                "feedback": "The word “am” goes only with I. The subject is boxes. shelf is right before the blank, but the subject is boxes."
              },
              {
                "text": "be",
                "feedback": "The word be cannot be the verb by itself here. Use am, is, or are."
              }
            ],
            "clue": "Remember: I goes with am. One goes with is. More than one goes with are. Skip the words in between.",
            "reveal": "Let's find it together. The subject is boxes. The word boxes means more than one, so the verb is “are.”"
          },
          {
            "stage": 2,
            "std": [
              "3.L.GC.2.c",
              "GUM:G:prepositional-phrases:C"
            ],
            "sentence": {
              "words": [
                "The",
                "girl",
                "with",
                "the",
                "red",
                "sneakers",
                "____",
                "very",
                "fast."
              ]
            },
            "question": "Which verb matches the subject?",
            "choices": [
              {
                "text": "runs",
                "correct": true,
                "feedback": "Nice thinking! The word girl means one, so the verb is runs. sneakers is right before the blank, but the subject is girl."
              },
              {
                "text": "run",
                "feedback": "The word run goes with more than one. The word girl means one, so the verb needs -s. sneakers is right before the blank, but the subject is girl."
              },
              {
                "text": "running",
                "feedback": "The word running cannot be the verb by itself. It needs a helping verb. Choose the verb that matches girl."
              },
              {
                "text": "to run",
                "feedback": "to run cannot be the verb by itself. Choose the verb that matches girl."
              }
            ],
            "clue": "Remember: find the subject. One subject: the verb usually ends in -s. More than one: no -s. Skip the words in between.",
            "reveal": "Let's find it together. The subject is girl. The word girl means one, so the verb is runs."
          },
          {
            "stage": 2,
            "std": [
              "3.L.GC.2.c",
              "GUM:G:prepositional-phrases:C"
            ],
            "sentence": {
              "words": [
                "The",
                "flowers",
                "in",
                "the",
                "garden",
                "____",
                "in",
                "the",
                "spring."
              ]
            },
            "question": "Which verb matches the subject?",
            "choices": [
              {
                "text": "bloom",
                "correct": true,
                "feedback": "Nice thinking! The word flowers means more than one, so the verb is bloom. garden is right before the blank, but the subject is flowers."
              },
              {
                "text": "blooms",
                "feedback": "The word blooms goes with one. The word flowers means more than one, so the verb has no -s. garden is right before the blank, but the subject is flowers."
              },
              {
                "text": "blooming",
                "feedback": "The word blooming cannot be the verb by itself. It needs a helping verb. Choose the verb that matches flowers."
              },
              {
                "text": "to bloom",
                "feedback": "to bloom cannot be the verb by itself. Choose the verb that matches flowers."
              }
            ],
            "clue": "Remember: find the subject. One subject: the verb usually ends in -s. More than one: no -s. Skip the words in between.",
            "reveal": "Let's find it together. The subject is flowers. The word flowers means more than one, so the verb is bloom."
          },
          {
            "stage": 2,
            "std": [
              "3.L.GC.2.c",
              "GUM:G:prepositional-phrases:C"
            ],
            "sentence": {
              "words": [
                "The",
                "leader",
                "of",
                "the",
                "scouts",
                "____",
                "kind",
                "to",
                "everyone."
              ]
            },
            "question": "Which verb matches the subject?",
            "choices": [
              {
                "text": "is",
                "correct": true,
                "feedback": "Great job! The word leader means one, so the verb is “is.” scouts is right before the blank, but the subject is leader."
              },
              {
                "text": "are",
                "feedback": "The word “are” goes with more than one, and with you. The subject is leader. scouts is right before the blank, but the subject is leader."
              },
              {
                "text": "am",
                "feedback": "The word “am” goes only with I. The subject is leader. scouts is right before the blank, but the subject is leader."
              },
              {
                "text": "be",
                "feedback": "The word be cannot be the verb by itself here. Use am, is, or are."
              }
            ],
            "clue": "Remember: I goes with am. One goes with is. More than one goes with are. Skip the words in between.",
            "reveal": "Let's find it together. The subject is leader. The word leader means one, so the verb is “is.”"
          },
          {
            "stage": 2,
            "std": [
              "3.L.GC.2.c",
              "GUM:G:prepositional-phrases:C"
            ],
            "sentence": {
              "words": [
                "The",
                "birds",
                "in",
                "the",
                "tall",
                "tree",
                "____",
                "every",
                "morning."
              ]
            },
            "question": "Which verb matches the subject?",
            "choices": [
              {
                "text": "sing",
                "correct": true,
                "feedback": "Nice thinking! The word birds means more than one, so the verb is sing. tree is right before the blank, but the subject is birds."
              },
              {
                "text": "sings",
                "feedback": "The word sings goes with one. The word birds means more than one, so the verb has no -s. tree is right before the blank, but the subject is birds."
              },
              {
                "text": "singing",
                "feedback": "The word singing cannot be the verb by itself. It needs a helping verb. Choose the verb that matches birds."
              },
              {
                "text": "to sing",
                "feedback": "to sing cannot be the verb by itself. Choose the verb that matches birds."
              }
            ],
            "clue": "Remember: find the subject. One subject: the verb usually ends in -s. More than one: no -s. Skip the words in between.",
            "reveal": "Let's find it together. The subject is birds. The word birds means more than one, so the verb is sing."
          },
          {
            "stage": 3,
            "std": [
              "3.L.GC.2.c",
              "GUM:G:verbs-add-s-es:R"
            ],
            "sentence": {
              "words": [
                "The",
                "dogs",
                "barks",
                "at",
                "the",
                "squirrels",
                "every",
                "day."
              ]
            },
            "question": "Which is the correct way to write this sentence?",
            "choices": [
              {
                "text": "The dogs bark at the squirrels every day.",
                "correct": true,
                "feedback": "You found it! “The dogs bark at the squirrels every day.” The word dogs means more than one, so the verb is bark."
              },
              {
                "text": "The dog bark at the squirrels every day.",
                "feedback": "The word dog means one, so the verb needs -s: barks. Changing the subject made a new mistake."
              },
              {
                "text": "The dogs barking at the squirrels every day.",
                "feedback": "barking cannot be the verb by itself. It needs a helping verb."
              },
              {
                "text": "The dogs is barks at the squirrels every day.",
                "feedback": "is barks is not correct. The word dogs means more than one, so the verb is bark."
              }
            ],
            "clue": "Remember: more than one goes with a verb that has no -s.",
            "reveal": "Let's fix it together. The word dogs means more than one. More than one goes with bark, not barks. The correct sentence is: “The dogs bark at the squirrels every day.”"
          },
          {
            "stage": 3,
            "std": [
              "3.L.GC.2.c",
              "GUM:G:verbs-add-s-es:R"
            ],
            "sentence": {
              "words": [
                "My",
                "sister",
                "play",
                "the",
                "piano",
                "after",
                "school."
              ]
            },
            "question": "Which is the correct way to write this sentence?",
            "choices": [
              {
                "text": "My sister playing the piano after school.",
                "feedback": "playing cannot be the verb by itself. It needs a helping verb."
              },
              {
                "text": "My sister plays the piano after school.",
                "correct": true,
                "feedback": "Great job! “My sister plays the piano after school.” The word sister means one, so the verb is plays."
              },
              {
                "text": "My sisters plays the piano after school.",
                "feedback": "The word sisters means more than one, so the verb should be play. This made a new mistake."
              },
              {
                "text": "My sister are play the piano after school.",
                "feedback": "are play is not correct. The word sister means one, so the verb is plays."
              }
            ],
            "clue": "Remember: one subject goes with a verb that usually ends in -s.",
            "reveal": "Let's fix it together. The word sister means one. One goes with plays. The correct sentence is: “My sister plays the piano after school.”"
          },
          {
            "stage": 3,
            "std": [
              "3.L.GC.2.c",
              "GUM:G:prepositional-phrases:C"
            ],
            "sentence": {
              "words": [
                "The",
                "students",
                "in",
                "my",
                "class",
                "is",
                "ready",
                "for",
                "recess."
              ]
            },
            "question": "Which is the correct way to write this sentence?",
            "choices": [
              {
                "text": "The students in my class are ready for recess.",
                "correct": true,
                "feedback": "Nice thinking! “The students in my class are ready for recess.” The subject is students, not class. The word students means more than one, so the verb is are."
              },
              {
                "text": "The students in my class am ready for recess.",
                "feedback": "am goes only with I. The subject is students."
              },
              {
                "text": "The student in my class are ready for recess.",
                "feedback": "The word student means one, so the verb should be is. This made a new mistake."
              },
              {
                "text": "The students in my class be ready for recess.",
                "feedback": "be cannot be the verb here. The word students means more than one, so the verb is are."
              }
            ],
            "clue": "Remember: skip the words in between. Find the real subject.",
            "reveal": "Let's fix it together. The subject is students, not class. The word students means more than one, so it should be are. The correct sentence is: “The students in my class are ready for recess.”"
          },
          {
            "stage": 3,
            "std": [
              "3.L.GC.2.c"
            ],
            "sentence": {
              "words": [
                "Ava",
                "and",
                "Ben",
                "was",
                "at",
                "the",
                "library",
                "yesterday."
              ]
            },
            "question": "Which is the correct way to write this sentence?",
            "choices": [
              {
                "text": "Ava and Ben were at the library yesterday.",
                "correct": true,
                "feedback": "You found it! “Ava and Ben were at the library yesterday.” Ava and Ben are two people, so the verb is were."
              },
              {
                "text": "Ava and Ben is at the library yesterday.",
                "feedback": "is tells about now, and yesterday tells about the past. Two people also need were."
              },
              {
                "text": "Ava and Ben am at the library yesterday.",
                "feedback": "am goes only with I. Ava and Ben are two people, so the verb is were."
              },
              {
                "text": "Ava and Ben be at the library yesterday.",
                "feedback": "be cannot be the verb here. Ava and Ben are two people, so the verb is were."
              }
            ],
            "clue": "Remember: was goes with one. were goes with more than one. Two names joined by and are more than one.",
            "reveal": "Let's fix it together. Ava and Ben are two people. More than one goes with were. The correct sentence is: “Ava and Ben were at the library yesterday.”"
          },
          {
            "stage": 3,
            "std": [
              "3.L.GC.2.c",
              "GUM:G:collective-abstract-nouns:M",
              "GUM:G:prepositional-phrases:C"
            ],
            "sentence": {
              "words": [
                "The",
                "flock",
                "of",
                "geese",
                "fly",
                "south",
                "every",
                "fall."
              ]
            },
            "question": "Which is the correct way to write this sentence?",
            "choices": [
              {
                "text": "The flock of geese flies south every fall.",
                "correct": true,
                "feedback": "Great job! “The flock of geese flies south every fall.” The subject is flock, one group, so the verb is flies."
              },
              {
                "text": "The flock of geese flying south every fall.",
                "feedback": "flying cannot be the verb by itself. It needs a helping verb."
              },
              {
                "text": "The flocks of geese flies south every fall.",
                "feedback": "The word flocks means more than one, so the verb should be fly. This made a new mistake."
              },
              {
                "text": "The flock of geese are fly south every fall.",
                "feedback": "are fly is not correct. The subject is flock, one group, so the verb is flies."
              }
            ],
            "clue": "Remember: a word for a group, like flock or team, is one group. Skip the words in between.",
            "reveal": "Let's fix it together. The subject is flock, not geese. A flock is one group, so the verb is flies. The correct sentence is: “The flock of geese flies south every fall.”"
          }
        ]
      },
      "studyGuide": {
        "title": "Subject-Verb Agreement Study Guide",
        "sections": [
          {
            "heading": "One",
            "chips": [
              "the dog barks",
              "she runs",
              "it is",
              "the team is"
            ]
          },
          {
            "heading": "More than one",
            "chips": [
              "the dogs bark",
              "they run",
              "they are",
              "Ava and Ben are"
            ]
          },
          {
            "heading": "I and you",
            "chips": [
              "I am",
              "I run",
              "you are",
              "you run"
            ]
          },
          {
            "heading": "Was and were",
            "chips": [
              "it was",
              "I was",
              "they were",
              "you were"
            ]
          }
        ],
        "reminder": "Find the real subject first. One goes with -s. More than one goes with no -s."
      }
    }
  }
};
