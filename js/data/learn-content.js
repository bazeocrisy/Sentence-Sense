/* =========================================================
   Sentence Sense — Learn content (Build 1.1.1; Georgia grade 3 topics added in Build 1.3)

   THIS FILE HOLDS EDUCATIONAL CONTENT ONLY.
   No rendering, no navigation, no application logic. Every
   definition, clue, example, Study Guide and Try It question a
   child sees in Learn Mode lives here and nowhere else, so the
   grammar can be audited on its own.

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
               kind = verb | subject | predicate | noun | adjective |
                      pronoun | adverb (Build 1.3),
               label = the word shown above the marked words.
     split   : { at, leftLabel, rightLabel }  divides the sentence
               into two labelled parts at word index `at`.
     links   : [{ from, to, text }] a word-to-word relationship,
               used for adjective -> noun.

   STANDARD TAGS (Build 1.3)
     Every topic carries `standards` and every Try It question and bank
     question carries `std`: the Georgia K-12 ELA codes it serves. Codes are
     either syntax standards (3.L.GC.2.a-d), vocabulary (3.L.V.*), or a GUM
     chart row written GUM:<G|U|M>:<skill>:<grade-3 code I|C|M|R>. The engine
     ignores these fields; they exist so coverage can be audited by script.
     See STANDARDS-ALIGNMENT.md.

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

  /* Build 1.3 — UNITS (Georgia grade 3 alignment, STANDARDS-ALIGNMENT.md §5).
     The Learn topic screen first shows these units, then the topics inside
     the chosen unit. Unit order and the topic order inside each unit are the
     teaching order. Build 1.4 added Helping & Linking Verbs and Verb Tense
     (after Verb) and Subject-Verb Agreement. Unit D (Punctuation & Capitals)
     and the rest of A and C arrive in later builds. */
  units: [
    { key: "words", name: "Words and Their Jobs", badge: "she ran quickly",
      card: "Learn what each kind of word does.", color: "words",
      topics: ["verb", "helping-linking", "verb-tense", "noun", "pronoun", "adjective", "adverb"] },
    { key: "parts", name: "Parts of a Sentence", badge: "who? did what?",
      card: "Find the subject and the predicate.", color: "parts",
      topics: ["subject", "complete-subject", "predicate"], showStrategy: true },
    { key: "build", name: "Building Sentences", badge: "complete?",
      card: "Make sentences complete and correct.", color: "build",
      topics: ["complete-sentence", "agreement"] }
  ],

  /* The single flattened sequence "Next topic" walks: every unit's topics in
     unit order. Build 1.3 changed it from the original six-topic order so
     "Next topic" stays inside a unit until the unit is finished. */
  order: ["verb", "helping-linking", "verb-tense", "noun", "pronoun", "adjective", "adverb",
          "subject", "complete-subject", "predicate",
          "complete-sentence", "agreement"],

  topics: {

    /* ===================================================== */
    /* VERB                                                  */
    /* ===================================================== */
    "verb": {
      name: "Verb",
      badge: "kicked",
      card: "Find what happens.",
      color: "verb",
      standards: ["GUM:G:action-verbs:R", "GUM:G:helping-linking-verbs:I"],

      definition: {
        title: "What is a verb?",
        text: "A verb tells what someone or something does or is.",
        list: [
          "Doing words: run, jump, play, throw, catch",
          "Being words: is, are"
        ],
        note: "Most verbs show action. A few verbs do not show action. They tell what someone or something is, like in The dog is small.",
        sentence: {
          words: ["The", "player", "kicked", "the", "ball."],
          marks: [{ start: 2, end: 2, kind: "verb", label: "VERB" }]
        }
      },

      clue: {
        title: "A clue for finding the verb",
        text: "Ask yourself: What happened? Or: What is happening?",
        list: [
          "Some verbs end in -s: runs, plays, throws",
          "Some verbs end in -ed: jumped, played, walked",
          "Some verbs end in -ing: running, playing, walking"
        ],
        warning: "These endings are clues. They are not rules. Read the sentence to make sure."
      },

      example: {
        title: "Let's find the verb",
        text: "Read the sentence and ask: What happened?",
        sentence: {
          words: ["The", "player", "kicked", "the", "ball."],
          marks: [{ start: 2, end: 2, kind: "verb", label: "VERB" }]
        },
        points: [
          "What happened? kicked.",
          "kicked is the verb because it tells what the player did."
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
          { stage: 0, std: ["GUM:G:action-verbs:R"],
            sentence: { words: ["The", "playful", "dog", "jumped", "over", "the", "fallen", "log."] },
            question: "Which word tells what happened?",
            choices: [
              { text: "playful", feedback: "playful tells what kind of dog it is. It describes the dog. Look again for the word that tells what happened." },
              { text: "dog", feedback: "dog names who did the action. Look again for the word that tells what the dog did." },
              { text: "jumped", correct: true, feedback: "Nice thinking! jumped is the verb because it tells what the dog did." },
              { text: "log", feedback: "log names a thing in the sentence. Look again for the word that tells what happened." }
            ],
            clue: "Remember: ask yourself, What happened?",
            reveal: "Let's find it together. jumped tells what the dog did, so jumped is the verb." },
          /* Q2 -- stage 1 */
          { stage: 0, std: ["GUM:G:action-verbs:R"],
            sentence: { words: ["Our", "baseball", "team", "practices", "before", "the", "Saturday", "game."] },
            question: "Which word tells what happens?",
            choices: [
              { text: "baseball", feedback: "baseball tells what kind of team it is. It describes the team. Look again for the word that tells what happened." },
              { text: "team", feedback: "team names who does the action. Look again for the word that tells what the team does." },
              { text: "practices", correct: true, feedback: "You found it! practices tells what the team does." },
              { text: "game", feedback: "game names a thing that happens on Saturday. Look again for the word that tells what happened." }
            ],
            clue: "Remember: ask yourself, What happened?",
            reveal: "Let's find it together. practices tells what the team does, so practices is the verb." },
          /* Q3 -- stage 1 */
          { stage: 0, std: ["GUM:G:action-verbs:R"],
            sentence: { words: ["The", "brown", "rabbit", "hopped", "across", "the", "grassy", "field."] },
            question: "Which word tells what happened?",
            choices: [
              { text: "brown", feedback: "brown tells what color the rabbit is. It describes the rabbit. Look again for the word that tells what happened." },
              { text: "rabbit", feedback: "rabbit names who did the action. Look again for the word that tells what the rabbit did." },
              { text: "hopped", correct: true, feedback: "Great job! hopped tells what the rabbit did." },
              { text: "field", feedback: "field names a place. Look again for the word that tells what happened." }
            ],
            clue: "Remember: ask yourself, What happened?",
            reveal: "Let's find it together. hopped tells what the rabbit did, so hopped is the verb." },
          /* Q4 -- stage 1 */
          { stage: 0, std: ["GUM:G:action-verbs:R"],
            sentence: { words: ["Maya", "opens", "her", "colorful", "notebook", "during", "science", "class."] },
            question: "Which word tells what happens?",
            choices: [
              { text: "Maya", feedback: "Maya names who does the action. Look again for the word that tells what Maya does." },
              { text: "opens", correct: true, feedback: "That's the verb! opens tells what Maya does." },
              { text: "colorful", feedback: "colorful tells what kind of notebook it is. It describes the notebook. Look again for the word that tells what happened." },
              { text: "notebook", feedback: "notebook names a thing. Look again for the word that tells what happened." }
            ],
            clue: "Remember: ask yourself, What happened?",
            reveal: "Let's find it together. opens tells what Maya does, so opens is the verb." },
          /* Q5 -- stage 1 */
          { stage: 0, std: ["GUM:G:action-verbs:R"],
            sentence: { words: ["The", "hungry", "puppy", "carried", "its", "blue", "toy", "upstairs."] },
            question: "Which word tells what happened?",
            choices: [
              { text: "hungry", feedback: "hungry tells what kind of puppy it is. It describes the puppy. Look again for the word that tells what happened." },
              { text: "puppy", feedback: "puppy names who did the action. Look again for the word that tells what the puppy did." },
              { text: "carried", correct: true, feedback: "Nice thinking! carried tells what the puppy did." },
              { text: "toy", feedback: "toy names a thing. Look again for the word that tells what happened." }
            ],
            clue: "Remember: ask yourself, What happened?",
            reveal: "Let's find it together. carried tells what the puppy did, so carried is the verb." },
          /* Q6 -- stage 2 */
          { stage: 1, std: ["GUM:G:action-verbs:R"],
            sentence: { words: ["The", "talented", "pitcher", "threw", "the", "baseball", "toward", "home", "plate."] },
            question: "Which word tells what happened?",
            choices: [
              { text: "talented", feedback: "talented tells what kind of pitcher it is. It describes the pitcher. Look again for the word that tells what happened." },
              { text: "pitcher", feedback: "pitcher names who did the action. Look again for the word that tells what the pitcher did." },
              { text: "threw", correct: true, feedback: "You found it! threw tells what the pitcher did." },
              { text: "baseball", feedback: "baseball names a thing. Look again for the word that tells what happened." }
            ],
            clue: "Remember: ask yourself, What happened?",
            reveal: "Let's find it together. threw tells what the pitcher did, so threw is the verb." },
          /* Q7 -- stage 2 */
          { stage: 1, std: ["GUM:G:action-verbs:R"],
            sentence: { words: ["Several", "noisy", "birds", "gather", "beside", "the", "school", "playground."] },
            question: "Which word tells what happens?",
            choices: [
              { text: "noisy", feedback: "noisy tells what kind of birds they are. It describes the birds. Look again for the word that tells what happened." },
              { text: "birds", feedback: "birds names who does the action. Look again for the word that tells what the birds do." },
              { text: "gather", correct: true, feedback: "Great job! gather tells what the birds do." },
              { text: "playground", feedback: "playground names a place. Look again for the word that tells what happened." }
            ],
            clue: "Remember: ask yourself, What happened?",
            reveal: "Let's find it together. gather tells what the birds do, so gather is the verb." },
          /* Q8 -- stage 2 */
          { stage: 1, std: ["GUM:G:action-verbs:R"],
            sentence: { words: ["The", "bright", "yellow", "bus", "stopped", "near", "our", "neighborhood."] },
            question: "Which word tells what happened?",
            choices: [
              { text: "yellow", feedback: "yellow tells what color the bus is. It describes the bus. Look again for the word that tells what happened." },
              { text: "bus", feedback: "bus names the thing we are talking about. Look again for the word that tells what the bus did." },
              { text: "stopped", correct: true, feedback: "Nice thinking! stopped tells what the bus did." },
              { text: "neighborhood", feedback: "neighborhood names a place. Look again for the word that tells what happened." }
            ],
            clue: "Remember: ask yourself, What happened?",
            reveal: "Let's find it together. stopped tells what the bus did, so stopped is the verb." },
          /* Q9 -- stage 2 */
          { stage: 1, std: ["GUM:G:action-verbs:R"],
            sentence: { words: ["Jordan", "packed", "his", "clean", "uniform", "before", "baseball", "practice."] },
            question: "Which word tells what happened?",
            choices: [
              { text: "Jordan", feedback: "Jordan names who did the action. Look again for the word that tells what Jordan did." },
              { text: "clean", feedback: "clean tells what kind of uniform it is. It describes the uniform. Look again for the word that tells what happened." },
              { text: "packed", correct: true, feedback: "You found it! packed tells what Jordan did." },
              { text: "uniform", feedback: "uniform names a thing. Look again for the word that tells what happened." }
            ],
            clue: "Remember: ask yourself, What happened?",
            reveal: "Let's find it together. packed tells what Jordan did, so packed is the verb." },
          /* Q10 -- stage 2 */
          { stage: 1, std: ["GUM:G:action-verbs:R"],
            sentence: { words: ["The", "young", "artist", "paints", "a", "colorful", "picture", "for", "the", "hallway."] },
            question: "Which word tells what happens?",
            choices: [
              { text: "young", feedback: "young tells what kind of artist it is. It describes the artist. Look again for the word that tells what happened." },
              { text: "artist", feedback: "artist names who does the action. Look again for the word that tells what the artist does." },
              { text: "paints", correct: true, feedback: "That's the verb! paints tells what the artist does." },
              { text: "picture", feedback: "picture names a thing. Look again for the word that tells what happened." }
            ],
            clue: "Remember: ask yourself, What happened?",
            reveal: "Let's find it together. paints tells what the artist does, so paints is the verb." },
          /* Q11 -- stage 3 */
          { stage: 2, std: ["GUM:G:action-verbs:R"],
            sentence: { words: ["After", "lunch,", "the", "students", "carried", "their", "projects", "into", "the", "classroom."] },
            question: "Which word tells what happened?",
            choices: [
              { text: "students", feedback: "students names who did the action. Look again for the word that tells what the students did." },
              { text: "projects", feedback: "projects names the things the students had. Look again for the word that tells what happened." },
              { text: "carried", correct: true, feedback: "Nice work! carried tells what the students did." },
              { text: "classroom", feedback: "classroom names a place. Look again for the word that tells what happened." }
            ],
            clue: "Remember: ask yourself, What happened?",
            reveal: "Let's find it together. carried tells what the students did, so carried is the verb." },
          /* Q12 -- stage 3 */
          { stage: 2, std: ["GUM:G:action-verbs:R"],
            sentence: { words: ["Near", "the", "fence,", "a", "curious", "squirrel", "climbed", "the", "tall", "oak", "tree."] },
            question: "Which word tells what happened?",
            choices: [
              { text: "curious", feedback: "curious tells what kind of squirrel it is. It describes the squirrel. Look again for the word that tells what happened." },
              { text: "squirrel", feedback: "squirrel names who did the action. Look again for the word that tells what the squirrel did." },
              { text: "climbed", correct: true, feedback: "You found it! climbed tells what the squirrel did." },
              { text: "tree", feedback: "tree names a thing. Look again for the word that tells what happened." }
            ],
            clue: "Remember: ask yourself, What happened?",
            reveal: "Let's find it together. climbed tells what the squirrel did, so climbed is the verb." },
          /* Q13 -- stage 3 */
          { stage: 2, std: ["GUM:G:action-verbs:R"],
            sentence: { words: ["During", "practice,", "the", "catcher", "blocked", "the", "bouncing", "baseball."] },
            question: "Which word tells what happened?",
            choices: [
              { text: "practice", feedback: "practice names when this happened. It does not tell what happened. Look again for the word that tells what happened." },
              { text: "catcher", feedback: "catcher names who did the action. Look again for the word that tells what the catcher did." },
              { text: "blocked", correct: true, feedback: "Great sentence checking! blocked tells what the catcher did." },
              { text: "baseball", feedback: "baseball names a thing. Look again for the word that tells what happened." }
            ],
            clue: "Remember: ask yourself, What happened?",
            reveal: "Let's find it together. blocked tells what the catcher did, so blocked is the verb." },
          /* Q14 -- stage 3 */
          { stage: 2, std: ["GUM:G:action-verbs:R"],
            sentence: { words: ["The", "silver", "airplane", "crosses", "the", "cloudy", "sky", "before", "sunset."] },
            question: "Which word tells what happens?",
            choices: [
              { text: "silver", feedback: "silver tells what color the airplane is. It describes the airplane. Look again for the word that tells what happened." },
              { text: "airplane", feedback: "airplane names the thing we are talking about. Look again for the word that tells what the airplane does." },
              { text: "crosses", correct: true, feedback: "That's the verb! crosses tells what the airplane does." },
              { text: "sky", feedback: "sky names a place the airplane flies through. Look again for the word that tells what happened." }
            ],
            clue: "Remember: ask yourself, What happened?",
            reveal: "Let's find it together. crosses tells what the airplane does, so crosses is the verb." },
          /* Q15 -- stage 3 */
          { stage: 2, std: ["GUM:G:action-verbs:R"],
            sentence: { words: ["On", "Friday,", "our", "class", "visited", "the", "local", "science", "museum."] },
            question: "Which word tells what happened?",
            choices: [
              { text: "class", feedback: "class names who did the action. Look again for the word that tells what the class did." },
              { text: "visited", correct: true, feedback: "Nice thinking! visited tells what the class did." },
              { text: "local", feedback: "local tells which museum it is. It describes the museum. Look again for the word that tells what happened." },
              { text: "museum", feedback: "museum names a place. Look again for the word that tells what happened." }
            ],
            clue: "Remember: ask yourself, What happened?",
            reveal: "Let's find it together. visited tells what the class did, so visited is the verb." },
          /* Q16 -- stage 4 */
          { stage: 3, std: ["GUM:G:action-verbs:R", "GUM:G:helping-linking-verbs:I"],
            sentence: { words: ["The", "classroom", "is", "quiet", "after", "the", "morning", "announcements."] },
            question: "Which word is the verb in this sentence?",
            choices: [
              { text: "classroom", feedback: "classroom names a place. A verb can tell what someone or something does OR is. Look again for the word that tells what someone or something is." },
              { text: "is", correct: true, feedback: "You found it! is is the verb. Not every verb shows an action. Some verbs tell what someone or something is." },
              { text: "quiet", feedback: "quiet tells how the classroom feels. It describes the classroom. A verb can tell what something is. Look again for the word that tells what someone or something is." },
              { text: "announcements", feedback: "announcements names things that happened in the morning. A verb can tell what something is. Look again for the word that tells what someone or something is." }
            ],
            clue: "Remember: a verb can also tell what someone or something is.",
            reveal: "Let's find it together. is tells what the classroom is, so is is the verb." },
          /* Q17 -- stage 4 */
          { stage: 3, std: ["GUM:G:action-verbs:R", "GUM:G:helping-linking-verbs:I"],
            sentence: { words: ["The", "muddy", "shoes", "rested", "beside", "the", "back", "door."] },
            question: "Which word is the verb in this sentence?",
            choices: [
              { text: "muddy", feedback: "muddy tells what kind of shoes they are. It describes the shoes. Look again for the word that tells what happened." },
              { text: "shoes", feedback: "shoes names the things we are talking about. Look again for the word that tells what the shoes did." },
              { text: "rested", correct: true, feedback: "Great job! rested tells what the shoes did." },
              { text: "door", feedback: "door names a thing. Look again for the word that tells what happened." }
            ],
            clue: "Remember: ask yourself, What happened?",
            reveal: "Let's find it together. rested tells what the shoes did, so rested is the verb." },
          /* Q18 -- stage 4 */
          { stage: 3, std: ["GUM:G:action-verbs:R", "GUM:G:helping-linking-verbs:I"],
            sentence: { words: ["Those", "tall", "buildings", "are", "visible", "from", "the", "highway."] },
            question: "Which word is the verb in this sentence?",
            choices: [
              { text: "tall", feedback: "tall tells what kind of buildings they are. It describes the buildings. A verb can tell what something is. Look again for the word that tells what someone or something is." },
              { text: "buildings", feedback: "buildings names the things we are talking about. A verb can tell what something is. Look again for the word that tells what someone or something is." },
              { text: "are", correct: true, feedback: "Nice thinking! are is the verb. It tells what the buildings are." },
              { text: "highway", feedback: "highway names a place. A verb can tell what something is. Look again for the word that tells what someone or something is." }
            ],
            clue: "Remember: a verb can also tell what someone or something is.",
            reveal: "Let's find it together. are tells what the buildings are, so are is the verb." },
          /* Q19 -- stage 4 */
          { stage: 3, std: ["GUM:G:action-verbs:R", "GUM:G:helping-linking-verbs:I"],
            sentence: { words: ["The", "players", "were", "ready", "before", "the", "final", "inning."] },
            question: "Which word is the verb in this sentence?",
            choices: [
              { text: "players", feedback: "players names who we are talking about. A verb can tell what someone is. Look again for the word that tells what someone or something is." },
              { text: "were", correct: true, feedback: "You found it! were is the verb. It tells what the players were." },
              { text: "ready", feedback: "ready tells how the players felt. It describes the players. A verb can tell what someone is. Look again for the word that tells what someone or something is." },
              { text: "inning", feedback: "inning names a part of the game. A verb can tell what someone is. Look again for the word that tells what someone or something is." }
            ],
            clue: "Remember: a verb can also tell what someone or something is.",
            reveal: "Let's find it together. were tells what the players were, so were is the verb." },
          /* Q20 -- stage 4 */
          { stage: 3, std: ["GUM:G:action-verbs:R", "GUM:G:helping-linking-verbs:I"],
            sentence: { words: ["Our", "new", "library", "was", "busy", "during", "family", "reading", "night."] },
            question: "Which word is the verb in this sentence?",
            choices: [
              { text: "new", feedback: "new tells what kind of library it is. It describes the library. A verb can tell what something is. Look again for the word that tells what someone or something is." },
              { text: "library", feedback: "library names a place. A verb can tell what something is. Look again for the word that tells what someone or something is." },
              { text: "was", correct: true, feedback: "Great job! was is the verb. It tells what the library was." },
              { text: "night", feedback: "night names when this happened. A verb can tell what something is. Look again for the word that tells what someone or something is." }
            ],
            clue: "Remember: a verb can also tell what someone or something is.",
            reveal: "Let's find it together. was tells what the library was, so was is the verb." }
        ]
      },


      recap: "A verb tells what someone or something does or is. Ask: What happened?",

      studyGuide: {
        title: "Verb Study Guide",
        sections: [
          { heading: "What it is", lines: ["A verb tells what someone or something does or is."] },
          { heading: "How to find it", lines: ["Ask: What happened?", "Or ask: What is happening?"] },
          { heading: "Verbs that show action", chips: ["run", "jump", "play", "throw", "catch", "read", "climb", "walk", "write", "talk", "help", "carry"] },
          { heading: "Verbs that tell what something is", chips: ["am", "is", "are", "was", "were", "be", "been", "being"] },
          { heading: "Common verbs to remember", chips: ["have", "has", "had", "do", "does", "did"] },
          { heading: "Clue: verbs ending in -s", chips: ["runs", "plays", "throws"] },
          { heading: "Clue: verbs ending in -ed", chips: ["jumped", "played", "walked"] },
          { heading: "Clue: verbs ending in -ing", chips: ["running", "playing", "walking"] },
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
        reminder: "These endings are clues. Read the sentence to make sure."
      }
    },

    /* ===================================================== */
    /* HELPING & LINKING VERBS  (Build 1.4)                  */
    /* Georgia GUM: helping and linking verbs (I, grade 3).  */
    /* Grade 3 terms only: helping verb + main verb. The     */
    /* -ing form is never named as a tense (NYI).            */
    /* ===================================================== */
    "helping-linking": {
      name: "Helping & Linking Verbs",
      badge: "is running",
      card: "Verbs that help and verbs that link.",
      color: "helping-linking",
      standards: ["GUM:G:helping-linking-verbs:I"],

      definition: {
        title: "What are helping and linking verbs?",
        text: "A helping verb comes before the main verb and helps it. A linking verb does not show action. It links the subject to a word that describes it or names it.",
        list: [
          "Helping verbs: will, can, should, must, is, are, was, were",
          "Linking verbs: am, is, are, was, were, seems, becomes"
        ],
        sentence: {
          words: ["My", "little", "brother", "will", "paint", "a", "picture", "of", "our", "cat."],
          marks: [
            { start: 3, end: 3, kind: "verb", label: "HELPING VERB" },
            { start: 4, end: 4, kind: "verb", label: "MAIN VERB" }
          ],
          links: [{ from: 3, to: 4, text: "helps" }]
        }
      },

      clue: {
        title: "A clue for telling them apart",
        text: "Look at what comes after the verb. Skip little words like a, the, and very.",
        steps: [
          "If an action word comes next, the first verb is a helping verb.",
          "If a describing word or a naming word comes next, it is a linking verb.",
          "Try = for a linking verb: The soup = hot."
        ],
        warning: "The words is, are, was, and were can do both jobs. Use = only when no action word comes after the verb.",
        sentence: {
          words: ["The", "soup", "in", "the", "big", "pot", "was", "hot."],
          marks: [
            { start: 1, end: 1, kind: "subject", label: "SUBJECT" },
            { start: 6, end: 6, kind: "verb", label: "LINKING VERB" },
            { start: 7, end: 7, kind: "adjective", label: "DESCRIBES" }
          ]
        }
      },

      example: {
        title: "Let's find both kinds",
        text: "This sentence has a linking verb and a helping verb.",
        sentence: {
          words: ["Our", "class", "is", "ready,", "so", "we", "will", "start", "the", "test."],
          marks: [
            { start: 2, end: 2, kind: "verb", label: "LINKING VERB" },
            { start: 6, end: 6, kind: "verb", label: "HELPING VERB" },
            { start: 7, end: 7, kind: "verb", label: "MAIN VERB" }
          ]
        },
        points: [
          "is links class to ready. Our class = ready. No action happens.",
          "will helps the main verb start. start is the action."
        ]
      },

      /* -----------------------------------------------------------------
         HELPING & LINKING — 20-QUESTION GUIDED BANK (Build 1.4)
         Stage 1 find the helping verb · Stage 2 find the main verb ·
         Stage 3 find the linking verb · Stage 4 the same word (is, was,
         were) doing either job. After a linking verb, only plain adjectives
         with no participle form (handoff §5b).
         ----------------------------------------------------------------- */
      tryItBank: {
        recap: "You practiced finding helping verbs, main verbs, and linking verbs in 20 different sentences.",
        stages: [
          { name: "Get Started", desc: "Find the helping verb.",
            mark: "⭐", milestoneTitle: "Get Started complete!",
            milestoneLine: "You found the verbs that help the main verb.", nextStage: "Look Closer" },
          { name: "Look Closer", desc: "Find the main verb that the helping verb helps.",
            mark: "🌟", milestoneTitle: "Look Closer complete!",
            milestoneLine: "You found the main verb after each helping verb.", nextStage: "Think It Through" },
          { name: "Think It Through", desc: "Find verbs that link the subject to a describing or naming word.",
            mark: "💪", milestoneTitle: "Think It Through complete!",
            milestoneLine: "You found linking verbs that show no action.", nextStage: "Challenge Yourself" },
          { name: "Challenge Yourself", desc: "Is it helping or linking? Look at the word after it.",
            mark: "🎉", milestoneTitle: "You practiced Helping & Linking Verbs 20 different ways!",
            milestoneLine: "", nextStage: "" }
        ],
        questions: [
          /* Q1 -- stage 1 */
          { stage: 0, std: ["GUM:G:helping-linking-verbs:I"],
            sentence: { words: ["My", "little", "brother", "will", "paint", "a", "picture", "of", "our", "cat."] },
            question: "Which word is the helping verb?",
            choices: [
              { text: "will", correct: true, feedback: "Nice thinking! will comes before paint and helps it, so will is the helping verb." },
              { text: "paint", feedback: "The word paint is the main verb. It tells the action. Look for the word right before it that helps it." },
              { text: "brother", feedback: "The word brother names a person. It is a noun. Look for the word that helps the main verb paint." },
              { text: "picture", feedback: "The word picture names a thing. It is a noun. Look for the word that helps the main verb paint." }
            ],
            clue: "Remember: find the main verb first. The helping verb comes right before it.",
            reveal: "Let's find it together. The main verb is paint. The word that helps it is will." },
          /* Q2 -- stage 1 */
          { stage: 0, std: ["GUM:G:helping-linking-verbs:I"],
            sentence: { words: ["The", "new", "student", "can", "swim", "across", "the", "whole", "pool."] },
            question: "Which word is the helping verb?",
            choices: [
              { text: "can", correct: true, feedback: "Nice thinking! can comes before swim and helps it, so can is the helping verb." },
              { text: "swim", feedback: "The word swim is the main verb. It tells the action. Look for the word right before it that helps it." },
              { text: "student", feedback: "The word student names a person. It is a noun. Look for the word that helps the main verb swim." },
              { text: "whole", feedback: "The word whole describes pool. It is an adjective. Look for the word that helps the main verb swim." }
            ],
            clue: "Remember: find the main verb first. The helping verb comes right before it.",
            reveal: "Let's find it together. The main verb is swim. The word that helps it is can." },
          /* Q3 -- stage 1 */
          { stage: 0, std: ["GUM:G:helping-linking-verbs:I"],
            sentence: { words: ["We", "should", "finish", "our", "reading", "log", "before", "dinner."] },
            question: "Which word is the helping verb?",
            choices: [
              { text: "should", correct: true, feedback: "Nice thinking! should comes before finish and helps it, so should is the helping verb." },
              { text: "finish", feedback: "The word finish is the main verb. It tells the action. Look for the word right before it that helps it." },
              { text: "We", feedback: "The word We is a pronoun. It tells who. Look for the word that helps the main verb finish." },
              { text: "log", feedback: "The word log names a thing. It is a noun. Look for the word that helps the main verb finish." }
            ],
            clue: "Remember: find the main verb first. The helping verb comes right before it.",
            reveal: "Let's find it together. The main verb is finish. The word that helps it is should." },
          /* Q4 -- stage 1 */
          { stage: 0, std: ["GUM:G:helping-linking-verbs:I"],
            sentence: { words: ["The", "happy", "fans", "were", "cheering", "for", "the", "home", "team."] },
            question: "Which word is the helping verb?",
            choices: [
              { text: "were", correct: true, feedback: "Nice thinking! “were” comes before cheering and helps it, so “were” is the helping verb." },
              { text: "cheering", feedback: "The word cheering is the main verb. It tells the action. Look for the word right before it that helps it." },
              { text: "fans", feedback: "The word fans names people. It is a noun. Look for the word that helps the main verb cheering." },
              { text: "happy", feedback: "The word happy tells what kind of fans. It is an adjective. Look for the word that helps the main verb cheering." }
            ],
            clue: "Remember: find the main verb first. The helping verb comes right before it.",
            reveal: "Let's find it together. The main verb is cheering. The word that helps it is “were”." },
          /* Q5 -- stage 1 */
          { stage: 0, std: ["GUM:G:helping-linking-verbs:I"],
            sentence: { words: ["My", "grandmother", "is", "baking", "sweet", "potato", "pie", "for", "Thanksgiving."] },
            question: "Which word is the helping verb?",
            choices: [
              { text: "is", correct: true, feedback: "Nice thinking! “is” comes before baking and helps it, so “is” is the helping verb." },
              { text: "baking", feedback: "The word baking is the main verb. It tells the action. Look for the word right before it that helps it." },
              { text: "grandmother", feedback: "The word grandmother names a person. It is a noun. Look for the word that helps the main verb baking." },
              { text: "pie", feedback: "The word pie names a thing. It is a noun. Look for the word that helps the main verb baking." }
            ],
            clue: "Remember: find the main verb first. The helping verb comes right before it.",
            reveal: "Let's find it together. The main verb is baking. The word that helps it is “is”." },
          /* Q6 -- stage 2 */
          { stage: 1, std: ["GUM:G:helping-linking-verbs:I"],
            sentence: { words: ["The", "players", "must", "wear", "their", "helmets", "on", "the", "field."] },
            question: "Which word is the main verb?",
            choices: [
              { text: "wear", correct: true, feedback: "You found it! wear tells the action. The helping verb must helps it, so wear is the main verb." },
              { text: "must", feedback: "The word must is the helping verb. It helps the main verb. Look for the word right after it that tells the action." },
              { text: "players", feedback: "The word players names people. It is a noun. Look for the action word after must." },
              { text: "helmets", feedback: "The word helmets names things. It is a noun. Look for the action word after must." }
            ],
            clue: "Remember: the main verb tells the action. It comes after the helping verb.",
            reveal: "Let's find it together. The helping verb is must. The action word after it is wear, so wear is the main verb." },
          /* Q7 -- stage 2 */
          { stage: 1, std: ["GUM:G:helping-linking-verbs:I"],
            sentence: { words: ["Our", "teacher", "was", "reading", "a", "funny", "chapter", "book", "aloud."] },
            question: "Which word is the main verb?",
            choices: [
              { text: "reading", correct: true, feedback: "You found it! reading tells the action. The helping verb “was” helps it, so reading is the main verb." },
              { text: "was", feedback: "“was” is the helping verb. It helps the main verb. Look for the word right after it that tells the action." },
              { text: "teacher", feedback: "The word teacher names a person. It is a noun. Look for the action word after was." },
              { text: "funny", feedback: "The word funny tells what kind of book. It is an adjective. Look for the action word after was." }
            ],
            clue: "Remember: the main verb tells the action. It comes after the helping verb.",
            reveal: "Let's find it together. The helping verb is “was”. The action word after it is reading, so reading is the main verb." },
          /* Q8 -- stage 2 */
          { stage: 1, std: ["GUM:G:helping-linking-verbs:I"],
            sentence: { words: ["Tomorrow", "the", "class", "will", "plant", "flowers", "near", "the", "fence."] },
            question: "Which word is the main verb?",
            choices: [
              { text: "plant", correct: true, feedback: "You found it! plant tells the action. The helping verb will helps it, so plant is the main verb." },
              { text: "will", feedback: "The word will is the helping verb. It helps the main verb. Look for the word right after it that tells the action." },
              { text: "Tomorrow", feedback: "The word Tomorrow tells when. It is an adverb. Look for the action word after will." },
              { text: "flowers", feedback: "The word flowers names things. It is a noun. Look for the action word after will." }
            ],
            clue: "Remember: the main verb tells the action. It comes after the helping verb.",
            reveal: "Let's find it together. The helping verb is will. The action word after it is plant, so plant is the main verb." },
          /* Q9 -- stage 2 */
          { stage: 1, std: ["GUM:G:helping-linking-verbs:I"],
            sentence: { words: ["The", "puppies", "are", "chasing", "a", "ball", "across", "the", "yard."] },
            question: "Which word is the main verb?",
            choices: [
              { text: "chasing", correct: true, feedback: "You found it! chasing tells the action. The helping verb “are” helps it, so chasing is the main verb." },
              { text: "are", feedback: "“are” is the helping verb. It helps the main verb. Look for the word right after it that tells the action." },
              { text: "puppies", feedback: "The word puppies names animals. It is a noun. Look for the action word after are." },
              { text: "ball", feedback: "The word ball names a thing. It is a noun. Look for the action word after are." }
            ],
            clue: "Remember: the main verb tells the action. It comes after the helping verb.",
            reveal: "Let's find it together. The helping verb is “are”. The action word after it is chasing, so chasing is the main verb." },
          /* Q10 -- stage 2 */
          { stage: 1, std: ["GUM:G:helping-linking-verbs:I"],
            sentence: { words: ["Jordan", "could", "ride", "his", "bike", "without", "training", "wheels."] },
            question: "Which word is the main verb?",
            choices: [
              { text: "ride", correct: true, feedback: "You found it! ride tells the action. The helping verb could helps it, so ride is the main verb." },
              { text: "could", feedback: "The word could is the helping verb. It helps the main verb. Look for the word right after it that tells the action." },
              { text: "Jordan", feedback: "The word Jordan names a person. It is a noun. Look for the action word after could." },
              { text: "bike", feedback: "The word bike names a thing. It is a noun. Look for the action word after could." }
            ],
            clue: "Remember: the main verb tells the action. It comes after the helping verb.",
            reveal: "Let's find it together. The helping verb is could. The action word after it is ride, so ride is the main verb." },
          /* Q11 -- stage 3 */
          { stage: 2, std: ["GUM:G:helping-linking-verbs:I"],
            sentence: { words: ["The", "soup", "in", "the", "big", "pot", "was", "hot."] },
            question: "Which word is the linking verb?",
            choices: [
              { text: "was", correct: true, feedback: "Great job! “was” does not show action. It links soup to hot, so “was” is the linking verb." },
              { text: "soup", feedback: "The word soup is the subject. It tells who or what the sentence is about. Look for the verb that links it to hot." },
              { text: "hot", feedback: "The word hot tells about soup. Look for the verb that links soup to hot." },
              { text: "pot", feedback: "The word pot names a thing. It is a noun. Look for the verb that links soup to hot." }
            ],
            clue: "Remember: a linking verb does not show action. Try putting = in its place. If it still makes sense, it is a linking verb.",
            reveal: "Let's find it together. soup = hot. The word that links them is “was”." },
          /* Q12 -- stage 3 */
          { stage: 2, std: ["GUM:G:helping-linking-verbs:I"],
            sentence: { words: ["My", "uncle", "is", "a", "pilot", "for", "a", "big", "airline."] },
            question: "Which word is the linking verb?",
            choices: [
              { text: "is", correct: true, feedback: "Great job! “is” does not show action. It links uncle to pilot, so “is” is the linking verb." },
              { text: "uncle", feedback: "The word uncle is the subject. It tells who or what the sentence is about. Look for the verb that links it to pilot." },
              { text: "pilot", feedback: "The word pilot tells about uncle. Look for the verb that links uncle to pilot." },
              { text: "airline", feedback: "The word airline names a company. It is a noun. Look for the verb that links uncle to pilot." }
            ],
            clue: "Remember: a linking verb does not show action. Try putting = in its place. If it still makes sense, it is a linking verb.",
            reveal: "Let's find it together. uncle = pilot. The word that links them is “is”." },
          /* Q13 -- stage 3 */
          { stage: 2, std: ["GUM:G:helping-linking-verbs:I"],
            sentence: { words: ["The", "sky", "became", "dark", "before", "the", "thunderstorm."] },
            question: "Which word is the linking verb?",
            choices: [
              { text: "became", correct: true, feedback: "Great job! became does not show action. It links sky to dark, so became is the linking verb." },
              { text: "sky", feedback: "The word sky is the subject. It tells who or what the sentence is about. Look for the verb that links it to dark." },
              { text: "dark", feedback: "The word dark tells about sky. Look for the verb that links sky to dark." },
              { text: "thunderstorm", feedback: "The word thunderstorm names a thing. It is a noun. Look for the verb that links sky to dark." }
            ],
            clue: "Remember: a linking verb does not show action. Try putting = in its place. If it still makes sense, it is a linking verb.",
            reveal: "Let's find it together. sky = dark. The word that links them is became." },
          /* Q14 -- stage 3 */
          { stage: 2, std: ["GUM:G:helping-linking-verbs:I"],
            sentence: { words: ["The", "tiny", "kitten", "seems", "hungry", "this", "morning."] },
            question: "Which word is the linking verb?",
            choices: [
              { text: "seems", correct: true, feedback: "Great job! seems does not show action. It links kitten to hungry, so seems is the linking verb." },
              { text: "kitten", feedback: "The word kitten is the subject. It tells who or what the sentence is about. Look for the verb that links it to hungry." },
              { text: "hungry", feedback: "The word hungry tells about kitten. Look for the verb that links kitten to hungry." },
              { text: "tiny", feedback: "The word tiny tells what kind of kitten. It is an adjective. Look for the verb that links kitten to hungry." }
            ],
            clue: "Remember: a linking verb does not show action. Try putting = in its place. If it still makes sense, it is a linking verb.",
            reveal: "Let's find it together. kitten = hungry. The word that links them is seems." },
          /* Q15 -- stage 3 */
          { stage: 2, std: ["GUM:G:helping-linking-verbs:I"],
            sentence: { words: ["The", "students", "were", "quiet", "during", "the", "fire", "drill."] },
            question: "Which word is the linking verb?",
            choices: [
              { text: "were", correct: true, feedback: "Great job! “were” does not show action. It links students to quiet, so “were” is the linking verb." },
              { text: "students", feedback: "The word students is the subject. It tells who or what the sentence is about. Look for the verb that links it to quiet." },
              { text: "quiet", feedback: "The word quiet tells about students. Look for the verb that links students to quiet." },
              { text: "drill", feedback: "The word drill names a thing. It is a noun. Look for the verb that links students to quiet." }
            ],
            clue: "Remember: a linking verb does not show action. Try putting = in its place. If it still makes sense, it is a linking verb.",
            reveal: "Let's find it together. students = quiet. The word that links them is “were”." },
          /* Q16 -- stage 4 */
          { stage: 3, std: ["GUM:G:helping-linking-verbs:I"],
            sentence: { words: ["The", "baby", "is", "sleepy", "after", "her", "long", "bath."] },
            question: "What job does the word “is” do in this sentence?",
            choices: [
              { text: "helping verb", feedback: "A helping verb comes before an action word. Here no action word comes after “is”. It links the subject to sleepy." },
              { text: "linking verb", correct: true, feedback: "Great job! “is” does not show action. It links the subject to sleepy, so it is a linking verb." },
              { text: "action verb", feedback: "“is” does not show action by itself. It links the subject to sleepy." },
              { text: "noun", feedback: "The word “is” is a verb, not a noun. It does not name a person, place, or thing." }
            ],
            clue: "Remember: look at the word right after it. If that word is an action, it is a helping verb. If it describes or names the subject, it is a linking verb.",
            reveal: "Let's find it together. The word after “is” is sleepy, which describes the subject. There is no action, so “is” is a linking verb." },
          /* Q17 -- stage 4 */
          { stage: 3, std: ["GUM:G:helping-linking-verbs:I"],
            sentence: { words: ["The", "baby", "is", "sleeping", "in", "her", "crib", "upstairs."] },
            question: "What job does the word “is” do in this sentence?",
            choices: [
              { text: "helping verb", correct: true, feedback: "You found it! “is” helps the main verb sleeping, so it is a helping verb." },
              { text: "linking verb", feedback: "Look at the word after “is”. The word sleeping is an action, so “is” is helping it, not linking." },
              { text: "action verb", feedback: "“is” does not show action by itself. The action is sleeping." },
              { text: "noun", feedback: "The word “is” is a verb, not a noun. It does not name a person, place, or thing." }
            ],
            clue: "Remember: look at the word right after it. If that word is an action, it is a helping verb. If it describes or names the subject, it is a linking verb.",
            reveal: "Let's find it together. The word after “is” is sleeping, an action. So “is” is a helping verb." },
          /* Q18 -- stage 4 */
          { stage: 3, std: ["GUM:G:helping-linking-verbs:I"],
            sentence: { words: ["The", "boys", "were", "thirsty", "after", "the", "soccer", "game."] },
            question: "What job does the word “were” do in this sentence?",
            choices: [
              { text: "helping verb", feedback: "A helping verb comes before an action word. Here no action word comes after “were”. It links the subject to thirsty." },
              { text: "linking verb", correct: true, feedback: "Great job! “were” does not show action. It links the subject to thirsty, so it is a linking verb." },
              { text: "action verb", feedback: "“were” does not show action by itself. It links the subject to thirsty." },
              { text: "noun", feedback: "The word “were” is a verb, not a noun. It does not name a person, place, or thing." }
            ],
            clue: "Remember: look at the word right after it. If that word is an action, it is a helping verb. If it describes or names the subject, it is a linking verb.",
            reveal: "Let's find it together. The word after “were” is thirsty, which describes the subject. There is no action, so “were” is a linking verb." },
          /* Q19 -- stage 4 */
          { stage: 3, std: ["GUM:G:helping-linking-verbs:I"],
            sentence: { words: ["The", "boys", "were", "running", "laps", "around", "the", "track."] },
            question: "What job does the word “were” do in this sentence?",
            choices: [
              { text: "helping verb", correct: true, feedback: "You found it! “were” helps the main verb running, so it is a helping verb." },
              { text: "linking verb", feedback: "Look at the word after “were”. The word running is an action, so “were” is helping it, not linking." },
              { text: "action verb", feedback: "“were” does not show action by itself. The action is running." },
              { text: "noun", feedback: "The word “were” is a verb, not a noun. It does not name a person, place, or thing." }
            ],
            clue: "Remember: look at the word right after it. If that word is an action, it is a helping verb. If it describes or names the subject, it is a linking verb.",
            reveal: "Let's find it together. The word after “were” is running, an action. So “were” is a helping verb." },
          /* Q20 -- stage 4 */
          { stage: 3, std: ["GUM:G:helping-linking-verbs:I"],
            sentence: { words: ["Our", "dog", "was", "muddy", "after", "the", "rainstorm."] },
            question: "What job does the word “was” do in this sentence?",
            choices: [
              { text: "helping verb", feedback: "A helping verb comes before an action word. Here no action word comes after “was”. It links the subject to muddy." },
              { text: "linking verb", correct: true, feedback: "Great job! “was” does not show action. It links the subject to muddy, so it is a linking verb." },
              { text: "action verb", feedback: "“was” does not show action by itself. It links the subject to muddy." },
              { text: "noun", feedback: "The word “was” is a verb, not a noun. It does not name a person, place, or thing." }
            ],
            clue: "Remember: look at the word right after it. If that word is an action, it is a helping verb. If it describes or names the subject, it is a linking verb.",
            reveal: "Let's find it together. The word after “was” is muddy, which describes the subject. There is no action, so “was” is a linking verb." }
        ]
      },

      recap: "A helping verb helps the main verb. A linking verb links the subject to a word that describes or names it.",

      studyGuide: {
        title: "Helping & Linking Verbs Study Guide",
        sections: [
          { heading: "Helping verbs", lines: ["A helping verb comes before the main verb and helps it."], chips: ["will", "can", "could", "should", "must", "may", "do", "does", "did", "am", "is", "are", "was", "were"] },
          { heading: "Linking verbs", lines: ["A linking verb does not show action. It links the subject to a word that describes or names it."], chips: ["am", "is", "are", "was", "were", "seems", "becomes"] },
          { heading: "How to tell them apart", steps: ["Look at what comes after the verb. Skip a, the, and very.", "An action word next? It is a helping verb.", "A describing or naming word next? It is a linking verb."] },
          {
            heading: "Same word, two jobs",
            contrast: {
              heading: "is can help or link",
              rows: [
                {
                  sentence: {
                    words: ["The", "baby", "is", "sleepy."],
                    marks: [{ start: 2, end: 2, kind: "verb", label: "LINKING VERB" }]
                  },
                  text: "is links baby to sleepy. The baby = sleepy."
                },
                {
                  sentence: {
                    words: ["The", "baby", "is", "sleeping."],
                    marks: [{ start: 2, end: 2, kind: "verb", label: "HELPING VERB" }]
                  },
                  text: "is helps the main verb sleeping. Sleeping is the action."
                }
              ],
              close: "Same word, two jobs. Read the word after it."
            }
          }
        ],
        reminder: "Look at what comes after the verb. Action next means helping. Describing or naming next means linking."
      }
    },
    /* ===================================================== */
    /* VERB TENSE  (Build 1.4)                               */
    /* Georgia: GUM simple verb tenses (R), irregular past   */
    /* tense (M), 3.L.GC.2.b (keep tense consistent).        */
    /* Present tense is "now or every day", never "ends in   */
    /* -ing" (that rule is wrong and -ing forms are NYI).    */
    /* ===================================================== */
    "verb-tense": {
      name: "Verb Tense",
      badge: "walked",
      card: "Tell when it happens.",
      color: "verb-tense",
      standards: ["GUM:G:simple-verb-tenses:R", "GUM:G:irregular-past-verbs:M", "3.L.GC.2.b"],

      definition: {
        title: "What is verb tense?",
        text: "The tense of a verb tells when something happens.",
        list: [
          "Past: it already happened. Yesterday I walked to school.",
          "Present: it happens now or every day. Every day I walk to school.",
          "Future: it has not happened yet. Tomorrow I will walk to school."
        ],
        note: "Some verbs have a special past tense instead of -ed: go becomes went, and eat becomes ate.",
        sentence: {
          words: ["Yesterday,", "my", "sister", "baked", "cookies", "and", "shared", "them."],
          marks: [
            { start: 0, end: 0, kind: "adverb", label: "WHEN?" },
            { start: 3, end: 3, kind: "verb", label: "PAST" },
            { start: 6, end: 6, kind: "verb", label: "PAST" }
          ]
        }
      },

      clue: {
        title: "A clue for choosing the tense",
        text: "Look for time words. They tell you which tense to use.",
        list: [
          "Past: yesterday, last night, ago",
          "Present: every day, always, now",
          "Future: tomorrow, next week, next year"
        ],
        warning: "Keep the same tense. If a sentence starts in the past, keep the other verbs in the past too.",
        sentence: {
          words: ["Tomorrow,", "we", "will", "visit", "the", "zoo."],
          marks: [
            { start: 0, end: 0, kind: "adverb", label: "WHEN?" },
            { start: 2, end: 2, kind: "verb", label: "FUTURE" },
            { start: 3, end: 3, kind: "verb", label: "FUTURE" }
          ]
        }
      },

      example: {
        title: "Let's keep the tense the same",
        text: "The first verb tells about the past, so the second verb does too.",
        sentence: {
          words: ["Last", "summer,", "we", "went", "to", "the", "lake", "and", "caught", "fish."],
          marks: [
            { start: 3, end: 3, kind: "verb", label: "PAST" },
            { start: 8, end: 8, kind: "verb", label: "PAST" }
          ]
        },
        points: [
          "Last summer tells about the past.",
          "went is the past tense of go. caught is the past tense of catch.",
          "Not: We went to the lake and catch fish."
        ]
      },

      /* -----------------------------------------------------------------
         VERB TENSE — 20-QUESTION GUIDED BANK (Build 1.4)
         Stage 1 time words (past and future) · Stage 2 irregular past (M),
         with the -ed overgeneralisation (eated, goed) as the teaching
         distractor · Stage 3 keep the tense consistent (3.L.GC.2.b) ·
         Stage 4 choose the correctly written sentence (Milestones format).
         Present-tense time cues are only used with a second verb that fixes
         the tense, because "every Saturday he mowed" is also correct English.
         ----------------------------------------------------------------- */
      tryItBank: {
        recap: "You practiced past, present, and future verbs, special past tense words, and keeping the tense the same in 20 different sentences.",
        stages: [
          { name: "Get Started", desc: "Use time words like yesterday and tomorrow.",
            mark: "⭐", milestoneTitle: "Get Started complete!",
            milestoneLine: "You used time words to choose past or future.", nextStage: "Look Closer" },
          { name: "Look Closer", desc: "Some verbs have a special past tense.",
            mark: "🌟", milestoneTitle: "Look Closer complete!",
            milestoneLine: "You used special past tense words like ate, went, and caught.", nextStage: "Think It Through" },
          { name: "Think It Through", desc: "Keep the second verb in the same tense as the first.",
            mark: "💪", milestoneTitle: "Think It Through complete!",
            milestoneLine: "You kept the tense the same inside each sentence.", nextStage: "Challenge Yourself" },
          { name: "Challenge Yourself", desc: "Choose the sentence that is written correctly.",
            mark: "🎉", milestoneTitle: "You practiced Verb Tense 20 different ways!",
            milestoneLine: "", nextStage: "" }
        ],
        questions: [
          /* Q1 -- stage 1 */
          { stage: 0, std: ["GUM:G:simple-verb-tenses:R"],
            sentence: { words: ["Last", "night,", "our", "family", "____", "a", "movie", "together."] },
            question: "Which verb belongs in the blank?",
            choices: [
              { text: "watched", correct: true, feedback: "Nice thinking! Last night tells it already happened, so the verb is watched." },
              { text: "watches", feedback: "The word watches tells about now or every day. Last night tells it already happened." },
              { text: "will watch", feedback: "will watch tells that it has not happened yet. Last night tells it already happened." },
              { text: "watching", feedback: "The word watching cannot be the verb by itself. It needs a helping verb. Use the time words: Last night." }
            ],
            clue: "Remember: look for time words. Yesterday and last night mean past. Tomorrow and next week mean future.",
            reveal: "Let's find it together. Last night tells it already happened. So the verb is watched." },
          /* Q2 -- stage 1 */
          { stage: 0, std: ["GUM:G:simple-verb-tenses:R"],
            sentence: { words: ["Next", "week,", "I", "____", "my", "grandmother", "in", "Macon."] },
            question: "Which verb belongs in the blank?",
            choices: [
              { text: "visited", feedback: "The word visited tells that it already happened. Next week tells it has not happened yet." },
              { text: "visits", feedback: "The word visits does not go with I. Next week tells it has not happened yet, so use will." },
              { text: "will visit", correct: true, feedback: "Nice thinking! Next week tells it has not happened yet, so the verb is will visit." },
              { text: "visiting", feedback: "The word visiting cannot be the verb by itself. It needs a helping verb. Use the time words: Next week." }
            ],
            clue: "Remember: look for time words. Yesterday and last night mean past. Tomorrow and next week mean future.",
            reveal: "Let's find it together. Next week tells it has not happened yet. So the verb is will visit." },
          /* Q3 -- stage 1 */
          { stage: 0, std: ["GUM:G:simple-verb-tenses:R"],
            sentence: { words: ["Tomorrow,", "the", "students", "____", "their", "plants", "in", "the", "garden."] },
            question: "Which verb belongs in the blank?",
            choices: [
              { text: "watered", feedback: "The word watered tells that it already happened. Tomorrow tells it has not happened yet." },
              { text: "waters", feedback: "The word waters does not match students, and Tomorrow tells it has not happened yet." },
              { text: "will water", correct: true, feedback: "Nice thinking! Tomorrow tells it has not happened yet, so the verb is will water." },
              { text: "watering", feedback: "The word watering cannot be the verb by itself. It needs a helping verb. Use the time words: Tomorrow." }
            ],
            clue: "Remember: look for time words. Yesterday and last night mean past. Tomorrow and next week mean future.",
            reveal: "Let's find it together. Tomorrow tells it has not happened yet. So the verb is will water." },
          /* Q4 -- stage 1 */
          { stage: 0, std: ["GUM:G:simple-verb-tenses:R"],
            sentence: { words: ["Yesterday,", "Dad", "____", "the", "leaky", "kitchen", "sink."] },
            question: "Which verb belongs in the blank?",
            choices: [
              { text: "fixed", correct: true, feedback: "Nice thinking! Yesterday tells it already happened, so the verb is fixed." },
              { text: "fixes", feedback: "The word fixes tells about now or every day. Yesterday tells it already happened." },
              { text: "will fix", feedback: "will fix tells that it has not happened yet. Yesterday tells it already happened." },
              { text: "fixing", feedback: "The word fixing cannot be the verb by itself. It needs a helping verb. Use the time words: Yesterday." }
            ],
            clue: "Remember: look for time words. Yesterday and last night mean past. Tomorrow and next week mean future.",
            reveal: "Let's find it together. Yesterday tells it already happened. So the verb is fixed." },
          /* Q5 -- stage 1 */
          { stage: 0, std: ["GUM:G:simple-verb-tenses:R"],
            sentence: { words: ["Two", "days", "ago,", "it", "____", "all", "afternoon."] },
            question: "Which verb belongs in the blank?",
            choices: [
              { text: "rained", correct: true, feedback: "Nice thinking! Two days ago tells it already happened, so the verb is rained." },
              { text: "rains", feedback: "The word rains tells about now or every day. Two days ago tells it already happened." },
              { text: "will rain", feedback: "will rain tells that it has not happened yet. Two days ago tells it already happened." },
              { text: "raining", feedback: "The word raining cannot be the verb by itself. It needs a helping verb. Use the time words: Two days ago." }
            ],
            clue: "Remember: look for time words. Yesterday and last night mean past. Tomorrow and next week mean future.",
            reveal: "Let's find it together. Two days ago tells it already happened. So the verb is rained." },
          /* Q6 -- stage 2 */
          { stage: 1, std: ["GUM:G:irregular-past-verbs:M", "GUM:G:simple-verb-tenses:R"],
            sentence: { words: ["Yesterday,", "Ben", "____", "his", "whole", "lunch", "at", "school."] },
            question: "Which verb belongs in the blank?",
            choices: [
              { text: "ate", correct: true, feedback: "You found it! eat has a special past tense: ate." },
              { text: "eated", feedback: "The word eated is not used in correct writing. eat does not add -ed. Its past tense is a special word." },
              { text: "eats", feedback: "The word eats tells about now or every day. Yesterday tells it already happened." },
              { text: "will eat", feedback: "will eat tells that it has not happened yet. Yesterday tells it already happened." }
            ],
            clue: "Remember: some verbs do not add -ed for the past. They change to a new word, like go and went.",
            reveal: "Let's find it together. Yesterday means it already happened. The past tense of eat is ate." },
          /* Q7 -- stage 2 */
          { stage: 1, std: ["GUM:G:irregular-past-verbs:M", "GUM:G:simple-verb-tenses:R"],
            sentence: { words: ["Last", "summer,", "we", "____", "to", "the", "beach", "in", "Savannah."] },
            question: "Which verb belongs in the blank?",
            choices: [
              { text: "went", correct: true, feedback: "You found it! go has a special past tense: went." },
              { text: "goed", feedback: "The word goed is not used in correct writing. go does not add -ed. Its past tense is a special word." },
              { text: "go", feedback: "The word go tells about now or every day. Last summer tells it already happened." },
              { text: "will go", feedback: "will go tells that it has not happened yet. Last summer tells it already happened." }
            ],
            clue: "Remember: some verbs do not add -ed for the past. They change to a new word, like go and went.",
            reveal: "Let's find it together. Last summer means it already happened. The past tense of go is went." },
          /* Q8 -- stage 2 */
          { stage: 1, std: ["GUM:G:irregular-past-verbs:M", "GUM:G:simple-verb-tenses:R"],
            sentence: { words: ["Earlier", "today,", "Kayla", "____", "a", "picture", "of", "her", "dog."] },
            question: "Which verb belongs in the blank?",
            choices: [
              { text: "drew", correct: true, feedback: "You found it! draw has a special past tense: drew." },
              { text: "drawed", feedback: "The word drawed is not used in correct writing. draw does not add -ed. Its past tense is a special word." },
              { text: "draws", feedback: "The word draws tells about now or every day. Earlier today tells it already happened." },
              { text: "will draw", feedback: "will draw tells that it has not happened yet. Earlier today tells it already happened." }
            ],
            clue: "Remember: some verbs do not add -ed for the past. They change to a new word, like go and went.",
            reveal: "Let's find it together. Earlier today means it already happened. The past tense of draw is drew." },
          /* Q9 -- stage 2 */
          { stage: 1, std: ["GUM:G:irregular-past-verbs:M", "GUM:G:simple-verb-tenses:R"],
            sentence: { words: ["Last", "week,", "my", "uncle", "____", "a", "huge", "fish", "at", "the", "lake."] },
            question: "Which verb belongs in the blank?",
            choices: [
              { text: "caught", correct: true, feedback: "You found it! catch has a special past tense: caught." },
              { text: "catched", feedback: "The word catched is not used in correct writing. catch does not add -ed. Its past tense is a special word." },
              { text: "catches", feedback: "The word catches tells about now or every day. Last week tells it already happened." },
              { text: "will catch", feedback: "will catch tells that it has not happened yet. Last week tells it already happened." }
            ],
            clue: "Remember: some verbs do not add -ed for the past. They change to a new word, like go and went.",
            reveal: "Let's find it together. Last week means it already happened. The past tense of catch is caught." },
          /* Q10 -- stage 2 */
          { stage: 1, std: ["GUM:G:irregular-past-verbs:M", "GUM:G:simple-verb-tenses:R"],
            sentence: { words: ["Yesterday,", "the", "puppy", "____", "a", "hole", "under", "the", "fence."] },
            question: "Which verb belongs in the blank?",
            choices: [
              { text: "dug", correct: true, feedback: "You found it! dig has a special past tense: dug." },
              { text: "digged", feedback: "The word digged is not used in correct writing. dig does not add -ed. Its past tense is a special word." },
              { text: "digs", feedback: "The word digs tells about now or every day. Yesterday tells it already happened." },
              { text: "will dig", feedback: "will dig tells that it has not happened yet. Yesterday tells it already happened." }
            ],
            clue: "Remember: some verbs do not add -ed for the past. They change to a new word, like go and went.",
            reveal: "Let's find it together. Yesterday means it already happened. The past tense of dig is dug." },
          /* Q11 -- stage 3 */
          { stage: 2, std: ["3.L.GC.2.b", "GUM:G:simple-verb-tenses:R"],
            sentence: { words: ["Mia", "opened", "the", "box", "and", "____", "a", "puppy", "inside."] },
            question: "Which verb keeps the same tense?",
            choices: [
              { text: "found", correct: true, feedback: "Great job! opened tells about the past, so the next verb stays in the same tense: found." },
              { text: "finds", feedback: "The word finds tells about now. opened tells about the past, so keep the past tense." },
              { text: "will find", feedback: "will find tells about the future. opened tells about the past, so keep the past tense." },
              { text: "finding", feedback: "The word finding cannot be the verb by itself. It needs a helping verb. Match opened: found." }
            ],
            clue: "Remember: look at the first verb. Keep the next verb in the same tense.",
            reveal: "Let's find it together. The first verb, opened, tells about the past. The verb that matches it is found." },
          /* Q12 -- stage 3 */
          { stage: 2, std: ["3.L.GC.2.b", "GUM:G:simple-verb-tenses:R"],
            sentence: { words: ["Every", "morning,", "my", "dad", "makes", "breakfast", "and", "____", "the", "dishes."] },
            question: "Which verb keeps the same tense?",
            choices: [
              { text: "washes", correct: true, feedback: "Great job! makes tells about every day, so the next verb stays in the same tense: washes." },
              { text: "washed", feedback: "The word washed tells about the past. makes tells about every day, so keep the present tense." },
              { text: "will wash", feedback: "will wash tells about the future. makes tells about every day, so keep the present tense." },
              { text: "washing", feedback: "The word washing cannot be the verb by itself. It needs a helping verb. Match makes: washes." }
            ],
            clue: "Remember: look at the first verb. Keep the next verb in the same tense.",
            reveal: "Let's find it together. The first verb, makes, tells about every day. The verb that matches it is washes." },
          /* Q13 -- stage 3 */
          { stage: 2, std: ["3.L.GC.2.b", "GUM:G:simple-verb-tenses:R"],
            sentence: { words: ["The", "cat", "jumped", "onto", "the", "couch", "and", "____", "asleep."] },
            question: "Which verb keeps the same tense?",
            choices: [
              { text: "fell", correct: true, feedback: "Great job! jumped tells about the past, so the next verb stays in the same tense: fell." },
              { text: "falls", feedback: "The word falls tells about now. jumped tells about the past, so keep the past tense." },
              { text: "will fall", feedback: "will fall tells about the future. jumped tells about the past, so keep the past tense." },
              { text: "falled", feedback: "The word falled is not used in correct writing. The past tense of fall is a special word: fell." }
            ],
            clue: "Remember: look at the first verb. Keep the next verb in the same tense.",
            reveal: "Let's find it together. The first verb, jumped, tells about the past. The verb that matches it is fell." },
          /* Q14 -- stage 3 */
          { stage: 2, std: ["3.L.GC.2.b", "GUM:G:simple-verb-tenses:R"],
            sentence: { words: ["Every", "afternoon,", "Leo", "walks", "the", "dog", "and", "____", "it", "a", "treat."] },
            question: "Which verb keeps the same tense?",
            choices: [
              { text: "gives", correct: true, feedback: "Great job! walks tells about every day, so the next verb stays in the same tense: gives." },
              { text: "gave", feedback: "The word gave tells about the past. walks tells about every day, so keep the present tense." },
              { text: "will give", feedback: "will give tells about the future. walks tells about every day, so keep the present tense." },
              { text: "giving", feedback: "The word giving cannot be the verb by itself. It needs a helping verb. Match walks: gives." }
            ],
            clue: "Remember: look at the first verb. Keep the next verb in the same tense.",
            reveal: "Let's find it together. The first verb, walks, tells about every day. The verb that matches it is gives." },
          /* Q15 -- stage 3 */
          { stage: 2, std: ["3.L.GC.2.b", "GUM:G:simple-verb-tenses:R"],
            sentence: { words: ["Yesterday,", "our", "class", "planted", "seeds", "and", "____", "them", "with", "water."] },
            question: "Which verb keeps the same tense?",
            choices: [
              { text: "sprinkled", correct: true, feedback: "Great job! planted tells about the past, so the next verb stays in the same tense: sprinkled." },
              { text: "sprinkles", feedback: "The word sprinkles tells about now. planted tells about the past, so keep the past tense." },
              { text: "will sprinkle", feedback: "will sprinkle tells about the future. planted tells about the past, so keep the past tense." },
              { text: "sprinkling", feedback: "The word sprinkling cannot be the verb by itself. It needs a helping verb. Match planted: sprinkled." }
            ],
            clue: "Remember: look at the first verb. Keep the next verb in the same tense.",
            reveal: "Let's find it together. The first verb, planted, tells about the past. The verb that matches it is sprinkled." },
          /* Q16 -- stage 4 */
          { stage: 3, std: ["3.L.GC.2.b", "GUM:G:simple-verb-tenses:R"],
            sentence: { words: ["Yesterday,", "we", "went", "to", "the", "park", "and", "play", "soccer."] },
            question: "Which is the correct way to write this sentence?",
            choices: [
              { text: "Yesterday, we went to the park and played soccer.", correct: true, feedback: "You found it! Yesterday and went tell about the past, so played keeps the past tense." },
              { text: "Yesterday, we went to the park and plays soccer.", feedback: "plays tells about now, and we plays does not match. Keep the past tense: played." },
              { text: "Yesterday, we go to the park and played soccer.", feedback: "go tells about now. Yesterday tells about the past, so it should be went." },
              { text: "Yesterday, we went to the park and will play soccer.", feedback: "will play tells about the future. Yesterday tells about the past." }
            ],
            clue: "Remember: Yesterday means the past. Every verb should tell about the past.",
            reveal: "Let's fix it together. Yesterday tells about the past. went is past, so play should be played." },
          /* Q17 -- stage 4 */
          { stage: 3, std: ["GUM:G:irregular-past-verbs:M", "GUM:G:simple-verb-tenses:R"],
            sentence: { words: ["Last", "night,", "I", "eated", "three", "tacos", "for", "dinner."] },
            question: "Which is the correct way to write this sentence?",
            choices: [
              { text: "Last night, I eat three tacos for dinner.", feedback: "eat tells about now. Last night tells about the past." },
              { text: "Last night, I ate three tacos for dinner.", correct: true, feedback: "Great job! The past tense of eat is ate." },
              { text: "Last night, I will eat three tacos for dinner.", feedback: "will eat tells about the future. Last night tells about the past." },
              { text: "Last night, I eats three tacos for dinner.", feedback: "eats tells about now, and I eats does not match. The past tense of eat is ate." }
            ],
            clue: "Remember: eat does not add -ed. Its past tense is a special word.",
            reveal: "Let's fix it together. eated is not used in correct writing. The past tense of eat is ate." },
          /* Q18 -- stage 4 */
          { stage: 3, std: ["GUM:G:simple-verb-tenses:R"],
            sentence: { words: ["Tomorrow,", "my", "mom", "drove", "us", "to", "the", "library."] },
            question: "Which is the correct way to write this sentence?",
            choices: [
              { text: "Tomorrow, my mom drive us to the library.", feedback: "drive does not match my mom, and it does not tell about tomorrow. Tomorrow needs will." },
              { text: "Tomorrow, my mom driving us to the library.", feedback: "driving cannot be the verb by itself. It needs a helping verb. Tomorrow needs will." },
              { text: "Tomorrow, my mom will drive us to the library.", correct: true, feedback: "Nice thinking! Tomorrow tells about the future, so the verb is will drive." },
              { text: "Tomorrow, my mom drove us to the library.", feedback: "drove tells about the past. Tomorrow tells about the future." }
            ],
            clue: "Remember: Tomorrow means the future. The future uses will.",
            reveal: "Let's fix it together. Tomorrow tells it has not happened yet. drove is past, so it should be will drive." },
          /* Q19 -- stage 4 */
          { stage: 3, std: ["3.L.GC.2.b", "GUM:G:simple-verb-tenses:R"],
            sentence: { words: ["Yesterday,", "the", "bird", "builds", "a", "nest", "and", "laid", "three", "eggs."] },
            question: "Which is the correct way to write this sentence?",
            choices: [
              { text: "Yesterday, the bird built a nest and laid three eggs.", correct: true, feedback: "You found it! built and laid both tell about the past, so the tense stays the same." },
              { text: "Yesterday, the bird builds a nest and layed three eggs.", feedback: "layed is not used in correct writing, and builds tells about now. Yesterday needs both verbs in the past." },
              { text: "Yesterday, the bird build a nest and laid three eggs.", feedback: "build does not match one bird, and it does not tell about the past." },
              { text: "Yesterday, the bird builds a nest and will laid three eggs.", feedback: "will laid is not correct, and Yesterday needs both verbs in the past." }
            ],
            clue: "Remember: Yesterday means the past. Both verbs should tell about the past.",
            reveal: "Let's fix it together. Yesterday tells about the past, and laid is already past. Change builds to built so both verbs tell about the past." },
          /* Q20 -- stage 4 */
          { stage: 3, std: ["GUM:G:irregular-past-verbs:M", "GUM:G:simple-verb-tenses:R"],
            sentence: { words: ["My", "brother", "catched", "the", "ball", "and", "threw", "it", "back."] },
            question: "Which is the correct way to write this sentence?",
            choices: [
              { text: "My brother caught the ball and throwed it back.", feedback: "caught is right, but throwed is not used in correct writing. The past tense of throw is threw." },
              { text: "My brother catched the ball and threw it back.", feedback: "catched is not used in correct writing. The past tense of catch is caught." },
              { text: "My brother caught the ball and threw it back.", correct: true, feedback: "Great job! The past tense of catch is caught, and the past tense of throw is threw." },
              { text: "My brother catches the ball and threw it back.", feedback: "catches tells about now and threw tells about the past. The tenses do not match." }
            ],
            clue: "Remember: catch does not add -ed. It has a special past tense.",
            reveal: "Let's fix it together. catched is not used in correct writing. The past tense of catch is caught." }
        ]
      },

      recap: "The tense of a verb tells when it happens. Use time words, and keep the tense the same.",

      studyGuide: {
        title: "Verb Tense Study Guide",
        sections: [
          { heading: "What it is", lines: ["The tense of a verb tells when something happens."] },
          { heading: "Past: it already happened", chips: ["walked", "played", "jumped", "fixed"] },
          { heading: "Present: now or every day", chips: ["walk", "walks", "play", "plays"] },
          { heading: "Future: it has not happened yet", chips: ["will walk", "will play", "will jump"] },
          { heading: "Special past tense words", chips: ["go: went", "eat: ate", "catch: caught", "throw: threw", "draw: drew", "dig: dug", "fall: fell", "find: found", "build: built", "lay: laid"] },
          { heading: "Words to avoid", lines: ["eated, goed, catched, and throwed are not used in correct writing."] },
          { heading: "Keep the tense the same", lines: ["Yes: We went to the lake and caught fish.", "No: We went to the lake and catch fish."] }
        ],
        reminder: "Look for time words, and keep every verb in a sentence in the same tense."
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
      standards: ["3.L.GC.2.a", "3.L.GC.2.c"],

      definition: {
        title: "What is a subject?",
        text: "The subject tells who or what the sentence is about.",
        list: [
          "The main subject word is called the simple subject."
        ],
        note: "Every word has a type, and it also has a job in the sentence. Subject is a job. Here, player names a person, and its job in this sentence is the subject.",
        sentence: {
          words: ["The", "player", "kicked", "the", "ball."],
          marks: [{ start: 1, end: 1, kind: "subject", label: "SIMPLE SUBJECT" }]
        }
      },

      clue: {
        title: "A clue for finding the subject",
        text: "Do not hunt for the subject first. Find the verb, then ask a question.",
        steps: [
          "Find the verb.",
          "Ask: Who or what did it?",
          "The answer is the subject."
        ],
        warning: "In many of the sentences we are learning, the subject comes before the verb. Finding the verb first and asking who or what is the stronger way.",
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
        points: [
          "Find the verb: kicked.",
          "Ask: Who kicked? The player.",
          "So player is the simple subject.",
          "player names a person, and here its job in the sentence is the subject."
        ]
      },

      tryIt: {
        title: "Try it",
        std: ["3.L.GC.2.a"],
        sentence: {
          words: ["The", "tall", "teacher", "wrote", "on", "the", "board."]
        },
        question: "The verb is wrote. Ask: who wrote? Which word is the simple subject?",
        choices: [
          { text: "tall", feedback: "tall describes the teacher. It is not the main subject word. Ask: who wrote?" },
          { text: "teacher", correct: true, feedback: "Correct! The verb is wrote. Who wrote? The teacher. So teacher is the simple subject." },
          { text: "wrote", feedback: "wrote is the verb. It tells what happened. Now ask: who wrote?" },
          { text: "board", feedback: "board names a thing, but it is not who did the writing. Ask: who wrote?" }
        ]
      },

      recap: "Find the verb, ask who or what did it, and you have found the subject.",

      studyGuide: {
        title: "Subject Study Guide",
        sections: [
          { heading: "What it is", lines: ["The subject tells who or what the sentence is about.", "The main subject word is the simple subject."] },
          { heading: "How to find it", steps: ["Find the verb.", "Ask: Who or what did it?", "Find the subject."] },
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
      standards: ["3.L.GC.2.a", "3.L.GC.2.c"],

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
        std: ["3.L.GC.2.a"],
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
      standards: ["3.L.GC.2.a"],

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
        std: ["3.L.GC.2.a"],
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
      standards: ["GUM:G:common-proper-nouns:R"],

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
        std: ["GUM:G:common-proper-nouns:R"],
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
    /* PRONOUN  (Build 1.3)                                  */
    /* Georgia GUM: personal pronouns (R); reflexive         */
    /* pronouns (M); pronoun-antecedent agreement (C).       */
    /* ===================================================== */
    "pronoun": {
      name: "Pronoun",
      badge: "she",
      card: "Take the place of a noun.",
      color: "pronoun",
      standards: ["GUM:G:personal-pronouns:R", "GUM:G:reflexive-pronouns:M", "GUM:U:pronoun-antecedent:C"],

      definition: {
        title: "What is a pronoun?",
        text: "A pronoun takes the place of a noun. Instead of saying Maya again, we can say she.",
        list: [
          "Who does it: I, you, he, she, it, we, they",
          "Who gets it: me, you, him, her, it, us, them",
          "Whose is it: my, your, his, her, its, our, their"
        ],
        note: "Most pronouns point back to a noun. I, me, we, and us stand for the person talking.",
        sentence: {
          words: ["Maya", "found", "a", "puppy,", "and", "she", "named", "it", "Biscuit."],
          marks: [
            { start: 0, end: 0, kind: "noun", label: "NOUN" },
            { start: 3, end: 3, kind: "noun", label: "NOUN" },
            { start: 5, end: 5, kind: "pronoun", label: "PRONOUN" },
            { start: 7, end: 7, kind: "pronoun", label: "PRONOUN" }
          ],
          links: [
            { from: 5, to: 0, text: "stands for" },
            { from: 7, to: 3, text: "stands for" }
          ]
        }
      },

      clue: {
        title: "A clue for finding pronouns",
        text: "Ask about the word: Who or what does it stand for?",
        steps: [
          "Find a word like he, she, it, we, they, or them.",
          "Ask: Who or what does it stand for?",
          "When that noun is in the sentence, the pronoun must match it."
        ],
        warning: "A pronoun must match its noun. One is he, she, or it. Two or more are they.",
        sentence: {
          words: ["The", "twins", "packed", "their", "lunches", "before", "they", "left."],
          marks: [
            { start: 1, end: 1, kind: "noun", label: "NOUN" },
            { start: 3, end: 3, kind: "pronoun", label: "PRONOUN" },
            { start: 6, end: 6, kind: "pronoun", label: "PRONOUN" }
          ],
          links: [
            { from: 3, to: 1, text: "stands for" },
            { from: 6, to: 1, text: "stands for" }
          ]
        }
      },

      example: {
        title: "Let's find what each pronoun stands for",
        text: "Follow the arrows from each pronoun back to its noun.",
        sentence: {
          words: ["Leo", "lost", "his", "library", "book,", "so", "he", "searched", "for", "it."],
          marks: [
            { start: 0, end: 0, kind: "noun", label: "NOUN" },
            { start: 2, end: 2, kind: "pronoun", label: "PRONOUN" },
            { start: 4, end: 4, kind: "noun", label: "NOUN" },
            { start: 6, end: 6, kind: "pronoun", label: "PRONOUN" },
            { start: 9, end: 9, kind: "pronoun", label: "PRONOUN" }
          ],
          links: [
            { from: 2, to: 0, text: "stands for" },
            { from: 6, to: 0, text: "stands for" },
            { from: 9, to: 4, text: "stands for" }
          ]
        },
        points: [
          "his and he both stand for Leo.",
          "his shows whose book it was.",
          "it stands for the book."
        ]
      },

      /* -----------------------------------------------------------------
         PRONOUN — 20-QUESTION GUIDED LEARNING BANK (Build 1.3)
         Stage 1: find the pronoun (one per sentence). Stage 2: pronouns that
         show who owns or who receives. Stage 3: which noun the pronoun stands
         for, and choosing a pronoun that agrees. Stage 4: reflexive pronouns
         (grade 3 MASTER skill), with the common errors hisself / theirselves
         as teaching distractors.
         ----------------------------------------------------------------- */
      tryItBank: {
        recap: "You practiced finding pronouns, matching them to their nouns, and using words like myself and themselves in 20 different sentences.",
        stages: [
          { name: "Get Started", desc: "Find the pronoun in each sentence.",
            mark: "⭐", milestoneTitle: "Get Started complete!",
            milestoneLine: "You found pronouns that take the place of nouns.", nextStage: "Look Closer" },
          { name: "Look Closer", desc: "Find pronouns that show who owns something or who gets something.",
            mark: "🌟", milestoneTitle: "Look Closer complete!",
            milestoneLine: "You found pronouns like his, their, us, and them.", nextStage: "Think It Through" },
          { name: "Think It Through", desc: "Find the noun each pronoun stands for, and make them match.",
            mark: "💪", milestoneTitle: "Think It Through complete!",
            milestoneLine: "You matched pronouns to the nouns they stand for.", nextStage: "Challenge Yourself" },
          { name: "Challenge Yourself", desc: "Use words like myself, herself, and themselves correctly.",
            mark: "🎉", milestoneTitle: "You practiced Pronoun 20 different ways!",
            milestoneLine: "", nextStage: "" }
        ],
        questions: [
          /* Q1 -- stage 1 */
          { stage: 0, std: ["GUM:G:personal-pronouns:R"],
            sentence: { words: ["After", "school,", "she", "practiced", "the", "piano", "for", "an", "hour."] },
            question: "Which word is a pronoun?",
            choices: [
              { text: "school", feedback: "school names a place. It is a noun. Look for the word that takes the place of a person's name." },
              { text: "she", correct: true, feedback: "Nice thinking! she takes the place of a girl's name, so she is a pronoun." },
              { text: "practiced", feedback: "practiced is the verb. It tells what happened. Look for the word that takes the place of a noun." },
              { text: "piano", feedback: "piano names a thing. It is a noun. Look for the word that takes the place of a noun." }
            ],
            clue: "Remember: a pronoun takes the place of a noun, like he, she, it, we, or they.",
            reveal: "Let's find it together. she takes the place of a girl's name, so she is the pronoun." },
          /* Q2 -- stage 1 */
          { stage: 0, std: ["GUM:G:personal-pronouns:R"],
            sentence: { words: ["We", "carried", "the", "heavy", "boxes", "into", "the", "garage."] },
            question: "Which word is a pronoun?",
            choices: [
              { text: "We", correct: true, feedback: "You found it! We takes the place of the names of the people doing the carrying." },
              { text: "carried", feedback: "carried is the verb. It tells what happened. Look for the word that takes the place of a noun." },
              { text: "heavy", feedback: "heavy tells what kind of boxes. It is an adjective. Look for the word that takes the place of a noun." },
              { text: "garage", feedback: "garage names a place. It is a noun. Look for the word that takes the place of a noun." }
            ],
            clue: "Remember: a pronoun takes the place of a noun, like he, she, it, we, or they.",
            reveal: "Let's find it together. We stands for the people doing the carrying, so We is the pronoun." },
          /* Q3 -- stage 1 */
          { stage: 0, std: ["GUM:G:personal-pronouns:R"],
            sentence: { words: ["They", "built", "a", "tall", "sandcastle", "near", "the", "ocean."] },
            question: "Which word is a pronoun?",
            choices: [
              { text: "They", correct: true, feedback: "Great job! They takes the place of the names of the people who built the sandcastle." },
              { text: "built", feedback: "built is the verb. It tells what happened. Look for the word that takes the place of a noun." },
              { text: "tall", feedback: "tall tells what kind of sandcastle. It is an adjective. Look for the word that takes the place of a noun." },
              { text: "ocean", feedback: "ocean names a place. It is a noun. Look for the word that takes the place of a noun." }
            ],
            clue: "Remember: a pronoun takes the place of a noun, like he, she, it, we, or they.",
            reveal: "Let's find it together. They stands for the people who built the sandcastle, so They is the pronoun." },
          /* Q4 -- stage 1 */
          { stage: 0, std: ["GUM:G:personal-pronouns:R"],
            sentence: { words: ["Last", "summer,", "he", "caught", "a", "big", "fish", "at", "the", "lake."] },
            question: "Which word is a pronoun?",
            choices: [
              { text: "summer", feedback: "summer names a time of year. It is a noun. Look for the word that takes the place of a person's name." },
              { text: "he", correct: true, feedback: "You found it! he takes the place of a boy's name, so he is a pronoun." },
              { text: "caught", feedback: "caught is the verb. It tells what happened. Look for the word that takes the place of a noun." },
              { text: "fish", feedback: "fish names an animal. It is a noun. Look for the word that takes the place of a noun." }
            ],
            clue: "Remember: a pronoun takes the place of a noun, like he, she, it, we, or they.",
            reveal: "Let's find it together. he takes the place of a boy's name, so he is the pronoun." },
          /* Q5 -- stage 1 */
          { stage: 0, std: ["GUM:G:personal-pronouns:R"],
            sentence: { words: ["Mom", "made", "pancakes", "for", "me", "on", "Saturday", "morning."] },
            question: "Which word is a pronoun?",
            choices: [
              { text: "Mom", feedback: "Mom names a person. It is a noun, not a pronoun. Look for the word that stands for the person telling this sentence." },
              { text: "pancakes", feedback: "pancakes names a thing. It is a noun. Look for the word that takes the place of a noun." },
              { text: "me", correct: true, feedback: "Nice thinking! me stands for the person telling the sentence, so me is a pronoun." },
              { text: "Saturday", feedback: "Saturday names a day. It is a noun. Look for the word that takes the place of a noun." }
            ],
            clue: "Remember: pronouns like me, him, her, us, and them tell who gets something.",
            reveal: "Let's find it together. me stands for the person telling the sentence, so me is the pronoun." },

          /* Q6 -- stage 2 */
          { stage: 1, std: ["GUM:G:personal-pronouns:R"],
            sentence: { words: ["The", "bird", "built", "its", "nest", "in", "the", "old", "oak", "tree."] },
            question: "Which word is a pronoun?",
            choices: [
              { text: "bird", feedback: "bird names an animal. It is a noun. Look for the word that tells whose nest it is." },
              { text: "built", feedback: "built is the verb. It tells what the bird did. Look for the word that tells whose nest it is." },
              { text: "its", correct: true, feedback: "Great job! its stands for the bird and tells whose nest it is." },
              { text: "nest", feedback: "nest names a thing. It is a noun. Look for the word that tells whose nest it is." }
            ],
            clue: "Remember: my, his, her, its, our, and their tell whose something is.",
            reveal: "Let's find it together. its stands for the bird and shows the nest belongs to the bird, so its is the pronoun." },
          /* Q7 -- stage 2 */
          { stage: 1, std: ["GUM:G:personal-pronouns:R"],
            sentence: { words: ["The", "teacher", "read", "a", "funny", "story", "to", "us."] },
            question: "Which word is a pronoun?",
            choices: [
              { text: "teacher", feedback: "teacher names a person. It is a noun. Look for the word that stands for the people who heard the story." },
              { text: "read", feedback: "read is the verb. It tells what the teacher did. Look for the word that takes the place of a noun." },
              { text: "funny", feedback: "funny tells what kind of story. It is an adjective. Look for the word that takes the place of a noun." },
              { text: "us", correct: true, feedback: "You found it! us stands for the people who heard the story, so us is a pronoun." }
            ],
            clue: "Remember: pronouns like me, him, her, us, and them tell who gets something.",
            reveal: "Let's find it together. us stands for the people who heard the story, so us is the pronoun." },
          /* Q8 -- stage 2 */
          { stage: 1, std: ["GUM:G:personal-pronouns:R"],
            sentence: { words: ["Jamal", "shared", "his", "crayons", "with", "the", "new", "student."] },
            question: "Which word is a pronoun?",
            choices: [
              { text: "Jamal", feedback: "Jamal names a person. It is a noun, not a pronoun. Look for the word that tells whose crayons they are." },
              { text: "shared", feedback: "shared is the verb. It tells what Jamal did. Look for the word that takes the place of a noun." },
              { text: "his", correct: true, feedback: "Nice thinking! his stands for Jamal and tells whose crayons they are." },
              { text: "crayons", feedback: "crayons names things. It is a noun. Look for the word that tells whose crayons they are." }
            ],
            clue: "Remember: my, his, her, its, our, and their tell whose something is.",
            reveal: "Let's find it together. his stands for Jamal and shows the crayons are his, so his is the pronoun." },
          /* Q9 -- stage 2 */
          { stage: 1, std: ["GUM:G:personal-pronouns:R"],
            sentence: { words: ["The", "players", "thanked", "their", "coach", "after", "the", "game."] },
            question: "Which word is a pronoun?",
            choices: [
              { text: "players", feedback: "players names people. It is a noun. Look for the word that tells whose coach it is." },
              { text: "thanked", feedback: "thanked is the verb. It tells what the players did. Look for the word that takes the place of a noun." },
              { text: "their", correct: true, feedback: "Great job! their stands for the players and tells whose coach it is." },
              { text: "coach", feedback: "coach names a person. It is a noun. Look for the word that tells whose coach it is." }
            ],
            clue: "Remember: my, his, her, its, our, and their tell whose something is.",
            reveal: "Let's find it together. their stands for the players and shows the coach is theirs, so their is the pronoun." },
          /* Q10 -- stage 2 */
          { stage: 1, std: ["GUM:G:personal-pronouns:R"],
            sentence: { words: ["Grandma", "gave", "them", "warm", "cookies", "after", "dinner."] },
            question: "Which word is a pronoun?",
            choices: [
              { text: "Grandma", feedback: "Grandma names a person. It is a noun, not a pronoun. Look for the word that stands for the people who got the cookies." },
              { text: "gave", feedback: "gave is the verb. It tells what Grandma did. Look for the word that takes the place of a noun." },
              { text: "them", correct: true, feedback: "You found it! them stands for the people who got the cookies, so them is a pronoun." },
              { text: "cookies", feedback: "cookies names things. It is a noun. Look for the word that takes the place of a noun." }
            ],
            clue: "Remember: pronouns like me, him, her, us, and them tell who gets something.",
            reveal: "Let's find it together. them stands for the people who got the cookies, so them is the pronoun." },

          /* Q11 -- stage 3 */
          { stage: 2, std: ["GUM:U:pronoun-antecedent:C"],
            sentence: { words: ["The", "yarn", "rolled", "under", "the", "couch,", "so", "the", "kitten", "chased", "it."] },
            question: "What does the word it stand for in this sentence?",
            choices: [
              { text: "yarn", correct: true, feedback: "Nice thinking! The kitten chased the yarn, so it stands for the yarn." },
              { text: "couch", feedback: "The yarn rolled under the couch, but the kitten did not chase the couch. Ask: What did the kitten chase?" },
              { text: "kitten", feedback: "The kitten is the one doing the chasing. it is what got chased. Ask: What did the kitten chase?" },
              { text: "rolled", feedback: "rolled is a verb. A pronoun stands for a noun. Ask: What did the kitten chase?" }
            ],
            clue: "Remember: put the noun in place of the pronoun and see if the sentence still makes sense.",
            reveal: "Let's find it together. What rolled under the couch? The yarn. The kitten chased the yarn, so it stands for yarn." },
          /* Q12 -- stage 3 */
          { stage: 2, std: ["GUM:U:pronoun-antecedent:C"],
            sentence: { words: ["Ava", "and", "Ben", "finished", "the", "puzzle,", "and", "they", "cheered."] },
            question: "Who does the word they stand for in this sentence?",
            choices: [
              { text: "Ava and Ben", correct: true, feedback: "You found it! they means more than one, and Ava and Ben are two people. Ava and Ben cheered." },
              { text: "Ava", feedback: "Ava is only one person. they means more than one. Who finished the puzzle together?" },
              { text: "the puzzle", feedback: "A puzzle cannot cheer. Ask: Who cheered?" },
              { text: "cheered", feedback: "cheered is the verb. A pronoun stands for a noun. Ask: Who cheered?" }
            ],
            clue: "Remember: they stands for two or more. Find all the people it could mean.",
            reveal: "Let's find it together. Who finished the puzzle? Ava and Ben. they means more than one, so they stands for Ava and Ben." },
          /* Q13 -- stage 3 */
          { stage: 2, std: ["GUM:U:pronoun-antecedent:C"],
            sentence: { words: ["My", "aunt", "lives", "in", "Ohio,", "and", "she", "visits", "us", "every", "summer."] },
            question: "Who does the word she stand for in this sentence?",
            choices: [
              { text: "Ohio", feedback: "Ohio names a place. A place cannot visit. Ask: Who visits us every summer?" },
              { text: "aunt", correct: true, feedback: "Great job! she stands for my aunt. My aunt visits us every summer." },
              { text: "summer", feedback: "summer names a time of year. Ask: Who visits us every summer?" },
              { text: "visits", feedback: "visits is the verb. A pronoun stands for a noun. Ask: Who visits?" }
            ],
            clue: "Remember: put the noun in place of the pronoun and see if the sentence still makes sense.",
            reveal: "Let's find it together. Who lives in Ohio? My aunt. My aunt visits us every summer, so she stands for aunt." },
          /* Q14 -- stage 3 */
          { stage: 2, std: ["GUM:U:pronoun-antecedent:C"],
            sentence: { words: ["The", "students", "cleaned", "the", "classroom", "before", "they", "went", "home."] },
            question: "Who does the word they stand for in this sentence?",
            choices: [
              { text: "classroom", feedback: "classroom is one place, and a place cannot go home. Ask: Who went home?" },
              { text: "students", correct: true, feedback: "Nice thinking! they stands for the students. The students went home." },
              { text: "home", feedback: "home is where they went. Ask: Who went home?" },
              { text: "cleaned", feedback: "cleaned is the verb. A pronoun stands for a noun. Ask: Who went home?" }
            ],
            clue: "Remember: they stands for two or more. Put the noun in its place and check.",
            reveal: "Let's find it together. Who cleaned the classroom? The students. The students went home, so they stands for students." },
          /* Q15 -- stage 3: choose a pronoun that agrees with its noun.
             hungry has no participle form (handoff §5b being-verb rule). */
          { stage: 2, std: ["GUM:U:pronoun-antecedent:C"],
            sentence: { words: ["The", "puppies", "were", "hungry,", "so", "____", "ate", "all", "the", "food."] },
            question: "Which pronoun belongs in the blank?",
            choices: [
              { text: "it", feedback: "it stands for one thing. puppies means more than one, so the pronoun must mean more than one too." },
              { text: "he", feedback: "he stands for one boy or one male animal. puppies means more than one." },
              { text: "they", correct: true, feedback: "You found it! puppies means more than one, so the pronoun is they." },
              { text: "she", feedback: "she stands for one girl or one female animal. puppies means more than one." }
            ],
            clue: "Remember: the pronoun must match its noun. One is he, she, or it. More than one is they.",
            reveal: "Let's find it together. The noun is puppies, which means more than one. More than one is they." },

          /* Q16 -- stage 4: reflexive pronouns (MASTER) */
          { stage: 3, std: ["GUM:G:reflexive-pronouns:M", "GUM:U:pronoun-antecedent:C"],
            sentence: { words: ["Maya", "fixed", "her", "bike", "all", "by", "____."] },
            question: "Which word belongs in the blank?",
            choices: [
              { text: "herself", correct: true, feedback: "Great job! Maya is one girl, so the word is herself." },
              { text: "himself", feedback: "himself points back to one boy. Maya is a girl." },
              { text: "themselves", feedback: "themselves points back to two or more. Maya is one person." },
              { text: "myself", feedback: "myself points back to the person telling the sentence. Maya fixed the bike." }
            ],
            clue: "Remember: words that end in -self or -selves point back to the person who did the action.",
            reveal: "Let's find it together. Who fixed the bike? Maya, one girl. The word that points back to one girl is herself." },
          /* Q17 -- stage 4 */
          { stage: 3, std: ["GUM:G:reflexive-pronouns:M", "GUM:U:pronoun-antecedent:C"],
            sentence: { words: ["I", "made", "____", "a", "peanut", "butter", "sandwich", "for", "lunch."] },
            question: "Which word belongs in the blank?",
            choices: [
              { text: "me", feedback: "In correct writing, when the person doing the action is the same person getting it, use a word that ends in -self. I made the sandwich for myself." },
              { text: "myself", correct: true, feedback: "You found it! I made the sandwich for the same person who made it, so the word is myself." },
              { text: "yourself", feedback: "yourself points back to you, the person being talked to. The sentence starts with I." },
              { text: "themselves", feedback: "themselves points back to two or more people. The sentence starts with I." }
            ],
            clue: "Remember: I goes with myself. He goes with himself. She goes with herself. They go with themselves.",
            reveal: "Let's find it together. The sentence starts with I, and I made the sandwich for the same person. I goes with myself." },
          /* Q18 -- stage 4 */
          { stage: 3, std: ["GUM:G:reflexive-pronouns:M", "GUM:U:pronoun-antecedent:C"],
            sentence: { words: ["The", "boys", "taught", "____", "how", "to", "juggle", "three", "balls."] },
            question: "Which word belongs in the blank?",
            choices: [
              { text: "theirselves", feedback: "theirselves is not used in correct writing. The correct word for more than one is themselves." },
              { text: "themselves", correct: true, feedback: "Nice thinking! boys means more than one, so the word is themselves." },
              { text: "himself", feedback: "himself points back to one boy. boys means more than one." },
              { text: "ourselves", feedback: "ourselves points back to we. The sentence is about the boys, not us." }
            ],
            clue: "Remember: more than one person goes with themselves.",
            reveal: "Let's find it together. Who taught? The boys, more than one. More than one goes with themselves." },
          /* Q19 -- stage 4 */
          { stage: 3, std: ["GUM:G:reflexive-pronouns:M", "GUM:U:pronoun-antecedent:C"],
            sentence: { words: ["Ben", "looked", "at", "____", "in", "the", "bathroom", "mirror."] },
            question: "Which word belongs in the blank?",
            choices: [
              { text: "hisself", feedback: "hisself is not used in correct writing. The correct word for one boy is himself." },
              { text: "herself", feedback: "herself points back to one girl. Ben is a boy." },
              { text: "himself", correct: true, feedback: "Great job! Ben is one boy, so the word is himself." },
              { text: "themselves", feedback: "themselves points back to two or more. Ben is one person." }
            ],
            clue: "Remember: one boy goes with himself. One girl goes with herself.",
            reveal: "Let's find it together. Who looked in the mirror? Ben, one boy. One boy goes with himself." },
          /* Q20 -- stage 4 */
          { stage: 3, std: ["GUM:G:reflexive-pronouns:M", "GUM:U:pronoun-antecedent:C"],
            sentence: { words: ["We", "made", "____", "a", "big", "fort", "out", "of", "blankets."] },
            question: "Which word belongs in the blank?",
            choices: [
              { text: "ourselves", correct: true, feedback: "You found it! The sentence starts with We, so the word is ourselves." },
              { text: "us", feedback: "In correct writing, when the people doing the action are the same people getting it, use a word that ends in -selves. We made the fort for ourselves." },
              { text: "themselves", feedback: "themselves points back to they. The sentence starts with We." },
              { text: "myself", feedback: "myself points back to I, one person. We means more than one." }
            ],
            clue: "Remember: we goes with ourselves.",
            reveal: "Let's find it together. The sentence starts with We. We goes with ourselves." }
        ]
      },

      recap: "A pronoun takes the place of a noun. Ask who or what it stands for, and make sure they match.",

      studyGuide: {
        title: "Pronoun Study Guide",
        sections: [
          { heading: "What it is", lines: ["A pronoun takes the place of a noun.", "Most pronouns point back to a noun. I, me, we, and us stand for the person talking."] },
          { heading: "How to find it", steps: ["Find a word like he, she, it, we, they, or them.", "Ask: Who or what does it stand for?", "When that noun is in the sentence, make sure the pronoun matches it."] },
          { heading: "Who does it", chips: ["I", "you", "he", "she", "it", "we", "they"] },
          { heading: "Who gets it", chips: ["me", "you", "him", "her", "it", "us", "them"] },
          { heading: "Whose is it", chips: ["my", "your", "his", "her", "its", "our", "their"] },
          { heading: "Points back to the same person or thing", chips: ["myself", "yourself", "himself", "herself", "itself", "ourselves", "themselves"] },
          { heading: "Words to avoid", lines: ["hisself is not used in correct writing. Say himself.", "theirselves is not used in correct writing. Say themselves."] },
          {
            heading: "See it in a sentence",
            sentence: {
              words: ["Maya", "found", "a", "puppy,", "and", "she", "named", "it", "Biscuit."],
              marks: [
                { start: 0, end: 0, kind: "noun", label: "NOUN" },
                { start: 3, end: 3, kind: "noun", label: "NOUN" },
                { start: 5, end: 5, kind: "pronoun", label: "PRONOUN" },
                { start: 7, end: 7, kind: "pronoun", label: "PRONOUN" }
              ],
              links: [
                { from: 5, to: 0, text: "stands for" },
                { from: 7, to: 3, text: "stands for" }
              ]
            }
          }
        ],
        reminder: "One is he, she, or it. More than one is they. When the noun is in the sentence, the pronoun must match it."
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
      standards: ["3.L.GC.2.d", "GUM:G:adjectives-adverbs:R"],

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
        std: ["3.L.GC.2.d", "GUM:G:adjectives-adverbs:R"],
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
    /* ADVERB  (Build 1.3)                                   */
    /* Georgia: 3.L.GC.2.d (add detail with adverbs);        */
    /* GUM adjectives and adverbs (R); 3.L.V.2.b (-ly as a   */
    /* clue to part of speech, used here as a clue only).    */
    /* ===================================================== */
    "adverb": {
      name: "Adverb",
      badge: "quietly",
      card: "Tell how, when, or where.",
      color: "adverb",
      standards: ["3.L.GC.2.d", "GUM:G:adjectives-adverbs:R", "3.L.V.2.b"],

      definition: {
        title: "What is an adverb?",
        text: "An adverb tells more about a verb. It tells how, when, or where something happens.",
        list: [
          "How: quietly, quickly, carefully",
          "When: yesterday, today, soon",
          "Where: outside, upstairs, here"
        ],
        note: "Some adverbs tell more about an adjective, like very in very cold. In this lesson we find adverbs that tell more about verbs.",
        sentence: {
          words: ["The", "happy", "students", "cheered", "loudly", "for", "their", "team."],
          marks: [
            { start: 3, end: 3, kind: "verb", label: "VERB" },
            { start: 4, end: 4, kind: "adverb", label: "ADVERB" }
          ],
          links: [{ from: 4, to: 3, text: "tells how" }]
        }
      },

      clue: {
        title: "A clue for finding adverbs",
        text: "Find the verb first. Then ask about the verb: How? When? Where?",
        steps: [
          "Find the verb.",
          "Ask: How? When? Where?",
          "The one word that answers is the adverb."
        ],
        warning: "Many adverbs end in -ly, but that is a clue, not a rule. Friendly and lovely end in -ly, but they describe nouns, so they are adjectives. Read the sentence to make sure.",
        sentence: {
          words: ["Yesterday", "my", "brother", "cleaned", "his", "messy", "room."],
          marks: [
            { start: 0, end: 0, kind: "adverb", label: "WHEN?" },
            { start: 3, end: 3, kind: "verb", label: "VERB" }
          ],
          links: [{ from: 0, to: 3, text: "tells when" }]
        }
      },

      example: {
        title: "Let's find the adverb",
        text: "Find the verb, then ask how, when, or where.",
        sentence: {
          words: ["The", "small", "puppy", "waited", "patiently", "by", "the", "front", "door."],
          marks: [
            { start: 3, end: 3, kind: "verb", label: "VERB" },
            { start: 4, end: 4, kind: "adverb", label: "HOW?" }
          ],
          links: [{ from: 4, to: 3, text: "tells how" }]
        },
        points: [
          "Find the verb: waited.",
          "Ask: How did the puppy wait? Patiently.",
          "So patiently is the adverb. It tells how the puppy waited.",
          "small is not an adverb. It describes the noun puppy, so it is an adjective."
        ]
      },

      /* -----------------------------------------------------------------
         ADVERB — 20-QUESTION GUIDED LEARNING BANK (Build 1.3)
         Stage 1: adverbs that tell how. Stage 2: when and where.
         Stage 3: adverb or adjective, including -ly adjectives (friendly,
         lovely, lonely, silly) as the trap. Stage 4: choose adverb or
         adjective to fill a blank. Every sentence has exactly one adverb
         unless the question names which one it wants.
         ----------------------------------------------------------------- */
      tryItBank: {
        recap: "You practiced finding adverbs and choosing between adverbs and adjectives in 20 different sentences.",
        stages: [
          { name: "Get Started", desc: "Find adverbs that tell how.",
            mark: "⭐", milestoneTitle: "Get Started complete!",
            milestoneLine: "You found adverbs that tell how something happened.", nextStage: "Look Closer" },
          { name: "Look Closer", desc: "Find adverbs that tell when and where.",
            mark: "🌟", milestoneTitle: "Look Closer complete!",
            milestoneLine: "You found adverbs that tell when and where.", nextStage: "Think It Through" },
          { name: "Think It Through", desc: "Adverb or adjective? Watch out for -ly words that describe nouns.",
            mark: "💪", milestoneTitle: "Think It Through complete!",
            milestoneLine: "You checked the job of each word instead of trusting the ending.", nextStage: "Challenge Yourself" },
          { name: "Challenge Yourself", desc: "Choose the right word to finish each sentence.",
            mark: "🎉", milestoneTitle: "You practiced Adverb 20 different ways!",
            milestoneLine: "", nextStage: "" }
        ],
        questions: [
          /* Q1 -- stage 1 */
          { stage: 0, std: ["3.L.GC.2.d", "GUM:G:adjectives-adverbs:R"],
            sentence: { words: ["The", "tall", "runner", "walked", "slowly", "across", "the", "finish", "line."] },
            question: "Which word tells how the runner walked?",
            choices: [
              { text: "tall", feedback: "tall tells what kind of runner. It describes a noun, so it is an adjective. Look for the word that tells how the runner walked." },
              { text: "runner", feedback: "runner names a person. It is a noun. Look for the word that tells how the runner walked." },
              { text: "walked", feedback: "walked is the verb. It tells what the runner did. Now ask: How did the runner walk?" },
              { text: "slowly", correct: true, feedback: "Nice thinking! slowly tells how the runner walked, so slowly is the adverb." }
            ],
            clue: "Remember: find the verb, then ask: How?",
            reveal: "Let's find it together. The verb is walked. How did the runner walk? Slowly. So slowly is the adverb." },
          /* Q2 -- stage 1 */
          { stage: 0, std: ["3.L.GC.2.d", "GUM:G:adjectives-adverbs:R"],
            sentence: { words: ["Grandma", "carefully", "poured", "the", "hot", "soup", "into", "small", "bowls."] },
            question: "Which word tells how Grandma poured the soup?",
            choices: [
              { text: "carefully", correct: true, feedback: "You found it! carefully tells how Grandma poured the soup. An adverb can come before the verb." },
              { text: "poured", feedback: "poured is the verb. It tells what Grandma did. Now ask: How did she pour?" },
              { text: "hot", feedback: "hot tells what kind of soup. It describes a noun, so it is an adjective. Look for the word that tells how she poured." },
              { text: "bowls", feedback: "bowls names a thing. It is a noun. Look for the word that tells how Grandma poured." }
            ],
            clue: "Remember: find the verb, then ask: How? The adverb can come before the verb.",
            reveal: "Let's find it together. The verb is poured. How did Grandma pour? Carefully. So carefully is the adverb." },
          /* Q3 -- stage 1 */
          { stage: 0, std: ["3.L.GC.2.d", "GUM:G:adjectives-adverbs:R"],
            sentence: { words: ["The", "happy", "children", "sang", "loudly", "during", "the", "school", "concert."] },
            question: "Which word tells how the children sang?",
            choices: [
              { text: "happy", feedback: "happy tells what kind of children. It describes a noun, so it is an adjective. Look for the word that tells how they sang." },
              { text: "sang", feedback: "sang is the verb. It tells what the children did. Now ask: How did they sing?" },
              { text: "loudly", correct: true, feedback: "Great job! loudly tells how the children sang, so loudly is the adverb." },
              { text: "concert", feedback: "concert names a thing that happened. It is a noun. Look for the word that tells how they sang." }
            ],
            clue: "Remember: find the verb, then ask: How?",
            reveal: "Let's find it together. The verb is sang. How did the children sing? Loudly. So loudly is the adverb." },
          /* Q4 -- stage 1 */
          { stage: 0, std: ["3.L.GC.2.d", "GUM:G:adjectives-adverbs:R"],
            sentence: { words: ["The", "curious", "kitten", "sniffed", "gently", "at", "the", "bright", "flowers."] },
            question: "Which word tells how the kitten sniffed?",
            choices: [
              { text: "curious", feedback: "curious tells what kind of kitten. It describes a noun, so it is an adjective. Look for the word that tells how the kitten sniffed." },
              { text: "kitten", feedback: "kitten names an animal. It is a noun. Look for the word that tells how it sniffed." },
              { text: "sniffed", feedback: "sniffed is the verb. It tells what the kitten did. Now ask: How did it sniff?" },
              { text: "gently", correct: true, feedback: "You found it! gently tells how the kitten sniffed, so gently is the adverb." }
            ],
            clue: "Remember: find the verb, then ask: How?",
            reveal: "Let's find it together. The verb is sniffed. How did the kitten sniff? Gently. So gently is the adverb." },
          /* Q5 -- stage 1 */
          { stage: 0, std: ["3.L.GC.2.d", "GUM:G:adjectives-adverbs:R"],
            sentence: { words: ["Marcus", "quickly", "finished", "his", "math", "homework", "before", "dinner."] },
            question: "Which word tells how Marcus finished his homework?",
            choices: [
              { text: "Marcus", feedback: "Marcus names a person. It is a noun. Look for the word that tells how he finished." },
              { text: "quickly", correct: true, feedback: "Nice thinking! quickly tells how Marcus finished, so quickly is the adverb." },
              { text: "finished", feedback: "finished is the verb. It tells what Marcus did. Now ask: How did he finish?" },
              { text: "homework", feedback: "homework names a thing. It is a noun. Look for the word that tells how Marcus finished." }
            ],
            clue: "Remember: find the verb, then ask: How? The adverb can come before the verb.",
            reveal: "Let's find it together. The verb is finished. How did Marcus finish? Quickly. So quickly is the adverb." },

          /* Q6 -- stage 2 */
          { stage: 1, std: ["3.L.GC.2.d", "GUM:G:adjectives-adverbs:R"],
            sentence: { words: ["Yesterday", "our", "class", "planted", "sunflower", "seeds", "in", "the", "garden."] },
            question: "Which word tells when the class planted the seeds?",
            choices: [
              { text: "Yesterday", correct: true, feedback: "Great job! Yesterday tells when the class planted, so Yesterday is the adverb." },
              { text: "planted", feedback: "planted is the verb. It tells what the class did. Now ask: When did they plant?" },
              { text: "seeds", feedback: "seeds names a thing. It is a noun. Look for the word that tells when." },
              { text: "garden", feedback: "garden names a place. It is a noun. The words in the garden tell where, not when. Look for the one word that tells when." }
            ],
            clue: "Remember: find the verb, then ask: When?",
            reveal: "Let's find it together. The verb is planted. When did the class plant? Yesterday. So Yesterday is the adverb." },
          /* Q7 -- stage 2 */
          { stage: 1, std: ["3.L.GC.2.d", "GUM:G:adjectives-adverbs:R"],
            sentence: { words: ["After", "lunch,", "the", "eager", "players", "ran", "outside."] },
            question: "Which word tells where the players ran?",
            choices: [
              { text: "lunch", feedback: "lunch names a thing. It is a noun. After lunch tells when, not where. Look for the word that tells where the players ran." },
              { text: "eager", feedback: "eager tells what kind of players. It describes a noun, so it is an adjective. Look for the word that tells where they ran." },
              { text: "ran", feedback: "ran is the verb. It tells what the players did. Now ask: Where did they run?" },
              { text: "outside", correct: true, feedback: "You found it! outside tells where the players ran, so outside is the adverb." }
            ],
            clue: "Remember: find the verb, then ask: Where?",
            reveal: "Let's find it together. The verb is ran. Where did the players run? Outside. So outside is the adverb." },
          /* Q8 -- stage 2 */
          { stage: 1, std: ["3.L.GC.2.d", "GUM:G:adjectives-adverbs:R"],
            sentence: { words: ["Soon", "the", "yellow", "bus", "will", "stop", "at", "our", "corner."] },
            question: "Which word tells when the bus will stop?",
            choices: [
              { text: "Soon", correct: true, feedback: "Nice thinking! Soon tells when the bus will stop, so Soon is the adverb." },
              { text: "yellow", feedback: "yellow tells what color the bus is. It describes a noun, so it is an adjective. Look for the word that tells when." },
              { text: "bus", feedback: "bus names a thing. It is a noun. Look for the word that tells when the bus will stop." },
              { text: "corner", feedback: "corner names a place. It is a noun. The words at our corner tell where, not when. Look for the one word that tells when." }
            ],
            clue: "Remember: find the verb, then ask: When?",
            reveal: "Let's find it together. The verb is will stop. When will the bus stop? Soon. So Soon is the adverb." },
          /* Q9 -- stage 2 */
          { stage: 1, std: ["3.L.GC.2.d", "GUM:G:adjectives-adverbs:R"],
            sentence: { words: ["My", "little", "sister", "reads", "her", "favorite", "books", "upstairs."] },
            question: "Which word tells where my sister reads?",
            choices: [
              { text: "little", feedback: "little tells what kind of sister. It describes a noun, so it is an adjective. Look for the word that tells where she reads." },
              { text: "reads", feedback: "reads is the verb. It tells what my sister does. Now ask: Where does she read?" },
              { text: "books", feedback: "books names a thing. It is a noun. Look for the word that tells where she reads." },
              { text: "upstairs", correct: true, feedback: "Great job! upstairs tells where my sister reads, so upstairs is the adverb." }
            ],
            clue: "Remember: find the verb, then ask: Where?",
            reveal: "Let's find it together. The verb is reads. Where does she read? Upstairs. So upstairs is the adverb." },
          /* Q10 -- stage 2 */
          { stage: 1, std: ["3.L.GC.2.d", "GUM:G:adjectives-adverbs:R"],
            sentence: { words: ["Today", "the", "art", "teacher", "showed", "us", "a", "new", "painting."] },
            question: "Which word tells when the teacher showed the painting?",
            choices: [
              { text: "Today", correct: true, feedback: "You found it! Today tells when the teacher showed the painting, so Today is the adverb." },
              { text: "showed", feedback: "showed is the verb. It tells what the teacher did. Now ask: When did the teacher show it?" },
              { text: "new", feedback: "new tells what kind of painting. It describes a noun, so it is an adjective. Look for the word that tells when." },
              { text: "painting", feedback: "painting names a thing. It is a noun. Look for the word that tells when." }
            ],
            clue: "Remember: find the verb, then ask: When?",
            reveal: "Let's find it together. The verb is showed. When did the teacher show it? Today. So Today is the adverb." },

          /* Q11 -- stage 3 */
          { stage: 2, std: ["3.L.GC.2.d", "GUM:G:adjectives-adverbs:R", "3.L.V.2.b"],
            sentence: { words: ["The", "friendly", "mail", "carrier", "smiled", "warmly", "at", "our", "family."] },
            question: "Which word is the adverb?",
            choices: [
              { text: "friendly", feedback: "friendly ends in -ly, but it tells what kind of mail carrier. It describes a noun, so it is an adjective. Look for the word that tells how the mail carrier smiled." },
              { text: "carrier", feedback: "carrier names a person. It is a noun. Look for the word that tells more about the verb." },
              { text: "smiled", feedback: "smiled is the verb. Now ask: How did the mail carrier smile?" },
              { text: "warmly", correct: true, feedback: "Great job! warmly tells how the mail carrier smiled. friendly also ends in -ly, but it describes a noun." }
            ],
            clue: "Remember: an -ly ending is only a clue. Find the verb and ask: How? When? Where?",
            reveal: "Let's find it together. The verb is smiled. How did the mail carrier smile? Warmly. So warmly is the adverb. friendly describes the mail carrier, so it is an adjective." },
          /* Q12 -- stage 3 */
          { stage: 2, std: ["3.L.GC.2.d", "GUM:G:adjectives-adverbs:R", "3.L.V.2.b"],
            sentence: { words: ["The", "lovely", "garden", "grew", "quickly", "after", "the", "spring", "rain."] },
            question: "Which word is the adverb?",
            choices: [
              { text: "lovely", feedback: "lovely ends in -ly, but it tells what kind of garden. It describes a noun, so it is an adjective. Look for the word that tells how the garden grew." },
              { text: "garden", feedback: "garden names a place. It is a noun. Look for the word that tells more about the verb." },
              { text: "grew", feedback: "grew is the verb. Now ask: How did the garden grow?" },
              { text: "quickly", correct: true, feedback: "You found it! quickly tells how the garden grew. lovely ends in -ly too, but it describes the garden." }
            ],
            clue: "Remember: an -ly ending is only a clue. Find the verb and ask: How? When? Where?",
            reveal: "Let's find it together. The verb is grew. How did the garden grow? Quickly. So quickly is the adverb. lovely describes the garden, so it is an adjective." },
          /* Q13 -- stage 3 */
          { stage: 2, std: ["3.L.GC.2.d", "GUM:G:adjectives-adverbs:R", "3.L.V.2.b"],
            sentence: { words: ["A", "lonely", "duck", "swam", "slowly", "across", "the", "quiet", "pond."] },
            question: "Which word is the adverb?",
            choices: [
              { text: "lonely", feedback: "lonely ends in -ly, but it tells what kind of duck. It describes a noun, so it is an adjective. Look for the word that tells how the duck swam." },
              { text: "swam", feedback: "swam is the verb. Now ask: How did the duck swim?" },
              { text: "slowly", correct: true, feedback: "Nice thinking! slowly tells how the duck swam, so slowly is the adverb." },
              { text: "quiet", feedback: "quiet tells what kind of pond. It describes a noun, so it is an adjective. Look for the word that tells how the duck swam." }
            ],
            clue: "Remember: an -ly ending is only a clue. Find the verb and ask: How? When? Where?",
            reveal: "Let's find it together. The verb is swam. How did the duck swim? Slowly. So slowly is the adverb. lonely describes the duck, so it is an adjective." },
          /* Q14 -- stage 3 */
          { stage: 2, std: ["3.L.GC.2.d", "GUM:G:adjectives-adverbs:R"],
            sentence: { words: ["Every", "morning,", "my", "grandfather", "walks", "quickly", "around", "the", "block."] },
            question: "Which word is the adverb?",
            choices: [
              { text: "morning", feedback: "morning names a time of day. It is a noun. Look for the word that tells how my grandfather walks." },
              { text: "walks", feedback: "walks is the verb. Now ask: How does my grandfather walk?" },
              { text: "quickly", correct: true, feedback: "Great job! quickly tells how my grandfather walks, so quickly is the adverb." },
              { text: "block", feedback: "block names a place. It is a noun. Look for the word that tells how he walks." }
            ],
            clue: "Remember: find the verb, then ask: How? When? Where?",
            reveal: "Let's find it together. The verb is walks. How does he walk? Quickly. So quickly is the adverb." },
          /* Q15 -- stage 3 */
          { stage: 2, std: ["3.L.GC.2.d", "GUM:G:adjectives-adverbs:R", "3.L.V.2.b"],
            sentence: { words: ["The", "silly", "clown", "tripped", "clumsily", "over", "his", "giant", "shoes."] },
            question: "Which word is the adverb?",
            choices: [
              { text: "silly", feedback: "silly ends in -ly, but it tells what kind of clown. It describes a noun, so it is an adjective. Look for the word that tells how the clown tripped." },
              { text: "tripped", feedback: "tripped is the verb. Now ask: How did the clown trip?" },
              { text: "clumsily", correct: true, feedback: "You found it! clumsily tells how the clown tripped. silly ends in -ly too, but it describes the clown." },
              { text: "giant", feedback: "giant tells what kind of shoes. It describes a noun, so it is an adjective. Look for the word that tells how the clown tripped." }
            ],
            clue: "Remember: an -ly ending is only a clue. Find the verb and ask: How? When? Where?",
            reveal: "Let's find it together. The verb is tripped. How did the clown trip? Clumsily. So clumsily is the adverb. silly describes the clown, so it is an adjective." },

          /* Q16 -- stage 4 */
          { stage: 3, std: ["3.L.GC.2.d", "GUM:G:adjectives-adverbs:R", "3.L.V.2.b"],
            sentence: { words: ["The", "painter", "worked", "____", "on", "the", "tiny", "details."] },
            question: "Which word belongs in the blank?",
            choices: [
              { text: "carefully", correct: true, feedback: "Nice thinking! The blank tells how the painter worked, so it needs the adverb carefully." },
              { text: "careful", feedback: "careful is an adjective. It describes a noun, like a careful painter. The blank tells how the painter worked, so it needs an adverb." },
              { text: "care", feedback: "care is a noun or a verb. The blank tells how the painter worked, so it needs an adverb." },
              { text: "cared", feedback: "cared is a verb. The sentence already has its verb, worked. The blank tells how the painter worked." }
            ],
            clue: "Remember: ask whether the blank tells about a noun or about the verb. An adverb tells how, when, or where.",
            reveal: "Let's find it together. The blank tells how the painter worked. A word that tells how is an adverb, so the answer is carefully." },
          /* Q17 -- stage 4 */
          { stage: 3, std: ["3.L.GC.2.d", "GUM:G:adjectives-adverbs:R", "3.L.V.2.b"],
            sentence: { words: ["The", "children", "played", "____", "so", "the", "baby", "could", "sleep."] },
            question: "Which word belongs in the blank?",
            choices: [
              { text: "quiet", feedback: "quiet is an adjective. It describes a noun, like a quiet room. The blank tells how the children played, so it needs an adverb." },
              { text: "quietly", correct: true, feedback: "You found it! The blank tells how the children played, so it needs the adverb quietly." },
              { text: "quietness", feedback: "quietness is a noun. It names an idea. The blank tells how the children played, so it needs an adverb." },
              { text: "quieted", feedback: "quieted is a verb. The sentence already has its verb, played. The blank tells how they played." }
            ],
            clue: "Remember: ask whether the blank tells about a noun or about the verb. An adverb tells how, when, or where.",
            reveal: "Let's find it together. The blank tells how the children played. A word that tells how is an adverb, so the answer is quietly." },
          /* Q18 -- stage 4: the blank describes a NOUN, so the adjective wins */
          { stage: 3, std: ["3.L.GC.2.d", "GUM:G:adjectives-adverbs:R", "3.L.V.2.b"],
            sentence: { words: ["The", "____", "dog", "barked", "at", "the", "mail", "truck."] },
            question: "Which word belongs in the blank?",
            choices: [
              { text: "angry", correct: true, feedback: "Great job! The blank describes the noun dog, so it needs the adjective angry." },
              { text: "angrily", feedback: "angrily is an adverb. It tells how something is done. The blank sits in front of the noun dog, so it needs an adjective." },
              { text: "anger", feedback: "anger is a noun. It names a feeling. The blank describes the dog, so it needs an adjective." },
              { text: "angers", feedback: "angers is a verb. The sentence already has its verb, barked. The blank describes the dog." }
            ],
            clue: "Remember: ask whether the blank tells about a noun or about the verb. An adjective describes a noun.",
            reveal: "Let's find it together. The blank describes the dog. dog is a noun, and a word that describes a noun is an adjective, so the answer is angry." },
          /* Q19 -- stage 4 */
          { stage: 3, std: ["3.L.GC.2.d", "GUM:G:adjectives-adverbs:R", "3.L.V.2.b"],
            sentence: { words: ["Please", "read", "the", "directions", "____", "before", "you", "start", "the", "test."] },
            question: "Which word belongs in the blank?",
            choices: [
              { text: "careful", feedback: "careful is an adjective. It describes a noun, like a careful reader. The blank tells how to read, so it needs an adverb." },
              { text: "care", feedback: "care is a noun or a verb. The blank tells how to read the directions, so it needs an adverb." },
              { text: "carefully", correct: true, feedback: "Nice thinking! The blank tells how to read, so it needs the adverb carefully." },
              { text: "cares", feedback: "cares is a verb. The blank comes right after read the directions and tells how to read." }
            ],
            clue: "Remember: ask whether the blank tells about a noun or about the verb. An adverb tells how, when, or where.",
            reveal: "Let's find it together. The blank tells how to read the directions. A word that tells how is an adverb, so the answer is carefully." },
          /* Q20 -- stage 4: after a being verb, the word describes the subject.
             nervous has no participle form (handoff §5b being-verb rule). */
          { stage: 3, std: ["3.L.GC.2.d", "GUM:G:adjectives-adverbs:R", "3.L.V.2.b"],
            sentence: { words: ["Jada", "was", "____", "about", "her", "first", "swimming", "lesson."] },
            question: "Which word belongs in the blank?",
            choices: [
              { text: "nervous", correct: true, feedback: "You found it! The blank tells what Jada was. It describes Jada, a noun, so it needs the adjective nervous." },
              { text: "nervously", feedback: "nervously is an adverb. It tells how someone does an action, like waited nervously. Here the blank tells what Jada was, so it needs an adjective." },
              { text: "nerves", feedback: "nerves is a noun. The blank describes Jada, so it needs an adjective." },
              { text: "nerve", feedback: "nerve is a noun. The blank describes Jada, so it needs an adjective." }
            ],
            clue: "Remember: after was, the word often describes the subject. A word that describes a noun is an adjective.",
            reveal: "Let's find it together. The blank tells what Jada was. It describes Jada, so it needs an adjective: nervous." }
        ]
      },

      recap: "An adverb tells how, when, or where. Find the verb, then ask: How? When? Where?",

      studyGuide: {
        title: "Adverb Study Guide",
        sections: [
          { heading: "What it is", lines: ["An adverb tells more about a verb.", "It tells how, when, or where something happens."] },
          { heading: "How to find it", steps: ["Find the verb.", "Ask: How? When? Where?", "The one word that answers is the adverb."] },
          { heading: "Adverbs that tell how", chips: ["quietly", "quickly", "slowly", "carefully", "gently", "loudly"] },
          { heading: "Adverbs that tell when", chips: ["yesterday", "today", "tomorrow", "soon", "later", "now"] },
          { heading: "Adverbs that tell where", chips: ["outside", "inside", "upstairs", "here", "there", "nearby"] },
          { heading: "Careful: these end in -ly but are adjectives", chips: ["friendly", "lovely", "lonely", "silly", "ugly"] },
          {
            heading: "See it in a sentence",
            sentence: {
              words: ["The", "small", "puppy", "waited", "patiently", "by", "the", "front", "door."],
              marks: [
                { start: 3, end: 3, kind: "verb", label: "VERB" },
                { start: 4, end: 4, kind: "adverb", label: "HOW?" }
              ],
              links: [{ from: 4, to: 3, text: "tells how" }]
            }
          },
          { heading: "Adjective or adverb?", lines: ["A careful painter: careful describes the noun painter. It is an adjective.", "worked carefully: carefully tells how he worked. It is an adverb."] }
        ],
        reminder: "An -ly ending is a clue, not a rule. Find the verb and ask: How? When? Where?"
      }
    },

    /* ===================================================== */
    /* COMPLETE SENTENCE  (Build 1.3)                        */
    /* Georgia: 3.L.GC.2.a (correctly structured sentences); */
    /* 3.L.GC.2.b; GUM comma + coordinating conjunction (M), */
    /* end punctuation and capitals (R).                     */
    /* Bank generated by a script so the four "Is this       */
    /* complete?" choices are identical every time and every */
    /* feedback line names the part of THIS sentence.        */
    /* ===================================================== */
    "complete-sentence": {
      name: "Complete Sentence",
      badge: "who + did what",
      card: "Spot fragments and run-ons.",
      color: "complete-sentence",
      standards: ["3.L.GC.2.a", "3.L.GC.2.b", "GUM:M:comma-coordinating-conjunction:M", "GUM:M:end-punctuation:R"],

      definition: {
        title: "What is a complete sentence?",
        text: "A complete sentence has a subject and a predicate, and it tells a complete thought.",
        list: [
          "Subject: who or what the sentence is about.",
          "Predicate: what the subject does or is. It has the verb.",
          "It starts with a capital letter and ends with an end mark: a period, a question mark, or an exclamation point."
        ],
        note: "A group of words that is missing a part is called a fragment. It is only a piece of a sentence.",
        sentence: {
          words: ["The", "hungry", "bear", "searched", "the", "woods", "for", "berries."],
          split: { at: 3, leftLabel: "COMPLETE SUBJECT", rightLabel: "PREDICATE" },
          marks: [{ start: 3, end: 3, kind: "verb", label: "VERB" }]
        }
      },

      clue: {
        title: "A clue for checking a sentence",
        text: "Ask two questions. If you can answer both and the thought is finished, it is a complete sentence.",
        steps: [
          "Who or what is it about? That is the subject.",
          "What does it do, or what is it? That is the predicate.",
          "Does it make sense by itself? Then it is a complete thought."
        ],
        warning: "Two complete sentences stuck together with nothing between them make a run-on. Give each one its own end mark, or join them with a comma and a word like and, but, or so.",
        sentence: {
          words: ["Ran", "across", "the", "muddy", "field."],
          marks: [{ start: 0, end: 0, kind: "verb", label: "WHO RAN?" }]
        }
      },

      example: {
        title: "Let's fix a fragment",
        text: "Ran across the muddy field is a fragment. It tells what happened, but not who did it. Add a subject.",
        sentence: {
          words: ["The", "playful", "dog", "ran", "across", "the", "muddy", "field."],
          split: { at: 3, leftLabel: "COMPLETE SUBJECT", rightLabel: "PREDICATE" },
          marks: [{ start: 3, end: 3, kind: "verb", label: "VERB" }]
        },
        points: [
          "Fragment: Ran across the muddy field. Who ran? We do not know.",
          "Fixed: The playful dog ran across the muddy field.",
          "Complete subject: The playful dog. Predicate: ran across the muddy field."
        ]
      },

      /* -----------------------------------------------------------------
         COMPLETE SENTENCE — 20-QUESTION GUIDED LEARNING BANK (Build 1.3)
         Stage 1: missing subject. Stage 2: missing predicate. Stage 3:
         run-ons, plus one correctly joined compound sentence. Stage 4: choose
         the correct fix, in the "Which sentence is written correctly?" form
         the Georgia Milestones uses.
         ----------------------------------------------------------------- */
      tryItBank: {
        recap: "You practiced finding fragments and run-ons and fixing them in 20 different sentences.",
        stages: [
          { name: "Get Started", desc: "Is anyone doing the action? Look for a missing subject.",
            mark: "⭐", milestoneTitle: "Get Started complete!",
            milestoneLine: "You found sentences that were missing who or what.", nextStage: "Look Closer" },
          { name: "Look Closer", desc: "Is anything happening? Look for a missing predicate.",
            mark: "🌟", milestoneTitle: "Look Closer complete!",
            milestoneLine: "You found sentences that were missing what happened.", nextStage: "Think It Through" },
          { name: "Think It Through", desc: "Watch for two sentences stuck together.",
            mark: "💪", milestoneTitle: "Think It Through complete!",
            milestoneLine: "You spotted run-ons and sentences joined the right way.", nextStage: "Challenge Yourself" },
          { name: "Challenge Yourself", desc: "Choose the best way to fix each sentence.",
            mark: "🎉", milestoneTitle: "You practiced Complete Sentence 20 different ways!",
            milestoneLine: "", nextStage: "" }
        ],
        questions: [
          /* Q1 -- stage 1 */
          { stage: 0, std: ["3.L.GC.2.a", "GUM:U:complete-thoughts:R"],
            sentence: { words: ["Jumped", "into", "the", "cool", "water", "at", "the", "pool."] },
            question: "Is this a complete sentence?",
            choices: [
              { text: "Yes, it is complete.", feedback: "Ask: Who or what? We do not know who jumped into the cool water at the pool. Something is missing." },
              { text: "No, it needs a subject.", correct: true, feedback: "You found it! We do not know who jumped into the cool water at the pool. It needs a subject." },
              { text: "No, it needs a predicate.", feedback: "It has a predicate: jumped into the cool water at the pool. What is missing is who did it." },
              { text: "No, it is a run-on.", feedback: "A run-on has two sentences stuck together. This is only part of one sentence." }
            ],
            clue: "Remember: ask who or what the sentence is about. If you cannot answer, the subject is missing.",
            reveal: "Let's check it together. What happened? jumped into the cool water at the pool. But who? The sentence never says, so it needs a subject." },
          /* Q2 -- stage 1 */
          { stage: 0, std: ["3.L.GC.2.a", "GUM:U:complete-thoughts:R"],
            sentence: { words: ["My", "cousin", "jumped", "into", "the", "cool", "water", "at", "the", "pool."] },
            question: "Is this a complete sentence?",
            choices: [
              { text: "Yes, it is complete.", correct: true, feedback: "Nice thinking! It has a subject, My cousin, and a predicate, jumped into the cool water at the pool. It is a complete thought." },
              { text: "No, it needs a subject.", feedback: "This one has a subject: My cousin. That tells who or what the sentence is about." },
              { text: "No, it needs a predicate.", feedback: "This one has a predicate: jumped into the cool water at the pool. That tells what the subject does or is." },
              { text: "No, it is a run-on.", feedback: "This is one sentence, so it is not a run-on." }
            ],
            clue: "Remember: ask who or what it is about, then ask what happened. If both are there and the thought is finished, it is complete.",
            reveal: "Let's check it together. Who or what? My cousin. What happened? jumped into the cool water at the pool. Both parts are there, so it is a complete sentence." },
          /* Q3 -- stage 1 */
          { stage: 0, std: ["3.L.GC.2.a", "GUM:U:complete-thoughts:R"],
            sentence: { words: ["Painted", "a", "bright", "picture", "of", "the", "ocean."] },
            question: "Is this a complete sentence?",
            choices: [
              { text: "Yes, it is complete.", feedback: "Ask: Who or what? We do not know who painted a bright picture of the ocean. Something is missing." },
              { text: "No, it needs a subject.", correct: true, feedback: "You found it! We do not know who painted a bright picture of the ocean. It needs a subject." },
              { text: "No, it needs a predicate.", feedback: "It has a predicate: painted a bright picture of the ocean. What is missing is who did it." },
              { text: "No, it is a run-on.", feedback: "A run-on has two sentences stuck together. This is only part of one sentence." }
            ],
            clue: "Remember: ask who or what the sentence is about. If you cannot answer, the subject is missing.",
            reveal: "Let's check it together. What happened? painted a bright picture of the ocean. But who? The sentence never says, so it needs a subject." },
          /* Q4 -- stage 1 */
          { stage: 0, std: ["3.L.GC.2.a", "GUM:U:complete-thoughts:R"],
            sentence: { words: ["Carried", "the", "heavy", "groceries", "up", "the", "stairs."] },
            question: "Is this a complete sentence?",
            choices: [
              { text: "Yes, it is complete.", feedback: "Ask: Who or what? We do not know who carried the heavy groceries up the stairs. Something is missing." },
              { text: "No, it needs a subject.", correct: true, feedback: "You found it! We do not know who carried the heavy groceries up the stairs. It needs a subject." },
              { text: "No, it needs a predicate.", feedback: "It has a predicate: carried the heavy groceries up the stairs. What is missing is who did it." },
              { text: "No, it is a run-on.", feedback: "A run-on has two sentences stuck together. This is only part of one sentence." }
            ],
            clue: "Remember: ask who or what the sentence is about. If you cannot answer, the subject is missing.",
            reveal: "Let's check it together. What happened? carried the heavy groceries up the stairs. But who? The sentence never says, so it needs a subject." },
          /* Q5 -- stage 1 */
          { stage: 0, std: ["3.L.GC.2.a", "GUM:U:complete-thoughts:R"],
            sentence: { words: ["Our", "class", "painted", "a", "bright", "picture", "of", "the", "ocean."] },
            question: "Is this a complete sentence?",
            choices: [
              { text: "Yes, it is complete.", correct: true, feedback: "Nice thinking! It has a subject, Our class, and a predicate, painted a bright picture of the ocean. It is a complete thought." },
              { text: "No, it needs a subject.", feedback: "This one has a subject: Our class. That tells who or what the sentence is about." },
              { text: "No, it needs a predicate.", feedback: "This one has a predicate: painted a bright picture of the ocean. That tells what the subject does or is." },
              { text: "No, it is a run-on.", feedback: "This is one sentence, so it is not a run-on." }
            ],
            clue: "Remember: ask who or what it is about, then ask what happened. If both are there and the thought is finished, it is complete.",
            reveal: "Let's check it together. Who or what? Our class. What happened? painted a bright picture of the ocean. Both parts are there, so it is a complete sentence." },
          /* Q6 -- stage 2 */
          { stage: 1, std: ["3.L.GC.2.a", "GUM:U:complete-thoughts:R"],
            sentence: { words: ["The", "tall", "girl", "with", "the", "red", "backpack."] },
            question: "Is this a complete sentence?",
            choices: [
              { text: "Yes, it is complete.", feedback: "Ask: What happened? We know what it is about, the tall girl with the red backpack, but not what happened." },
              { text: "No, it needs a subject.", feedback: "It has a subject: the tall girl with the red backpack. What is missing is what happened." },
              { text: "No, it needs a predicate.", correct: true, feedback: "You found it! We know what it is about, the tall girl with the red backpack, but not what happened. It needs a predicate." },
              { text: "No, it is a run-on.", feedback: "A run-on has two sentences stuck together. This is only part of one sentence." }
            ],
            clue: "Remember: ask what happened. If you cannot answer, the predicate is missing. The predicate has the verb.",
            reveal: "Let's check it together. Who or what? the tall girl with the red backpack. What happened? The sentence never says. There is no verb, so it needs a predicate." },
          /* Q7 -- stage 2 */
          { stage: 1, std: ["3.L.GC.2.a", "GUM:U:complete-thoughts:R"],
            sentence: { words: ["The", "noisy", "crowd", "at", "the", "baseball", "game."] },
            question: "Is this a complete sentence?",
            choices: [
              { text: "Yes, it is complete.", feedback: "Ask: What happened? We know what it is about, the noisy crowd at the baseball game, but not what happened." },
              { text: "No, it needs a subject.", feedback: "It has a subject: the noisy crowd at the baseball game. What is missing is what happened." },
              { text: "No, it needs a predicate.", correct: true, feedback: "You found it! We know what it is about, the noisy crowd at the baseball game, but not what happened. It needs a predicate." },
              { text: "No, it is a run-on.", feedback: "A run-on has two sentences stuck together. This is only part of one sentence." }
            ],
            clue: "Remember: ask what happened. If you cannot answer, the predicate is missing. The predicate has the verb.",
            reveal: "Let's check it together. Who or what? the noisy crowd at the baseball game. What happened? The sentence never says. There is no verb, so it needs a predicate." },
          /* Q8 -- stage 2 */
          { stage: 1, std: ["3.L.GC.2.a", "GUM:U:complete-thoughts:R"],
            sentence: { words: ["The", "noisy", "crowd", "cheered", "at", "the", "baseball", "game."] },
            question: "Is this a complete sentence?",
            choices: [
              { text: "Yes, it is complete.", correct: true, feedback: "Nice thinking! It has a subject, The noisy crowd, and a predicate, cheered at the baseball game. It is a complete thought." },
              { text: "No, it needs a subject.", feedback: "This one has a subject: The noisy crowd. That tells who or what the sentence is about." },
              { text: "No, it needs a predicate.", feedback: "This one has a predicate: cheered at the baseball game. That tells what the subject does or is." },
              { text: "No, it is a run-on.", feedback: "This is one sentence, so it is not a run-on." }
            ],
            clue: "Remember: ask who or what it is about, then ask what happened. If both are there and the thought is finished, it is complete.",
            reveal: "Let's check it together. Who or what? The noisy crowd. What happened? cheered at the baseball game. Both parts are there, so it is a complete sentence." },
          /* Q9 -- stage 2 */
          { stage: 1, std: ["3.L.GC.2.a", "GUM:U:complete-thoughts:R"],
            sentence: { words: ["My", "grandmother's", "garden", "behind", "the", "house."] },
            question: "Is this a complete sentence?",
            choices: [
              { text: "Yes, it is complete.", feedback: "Ask: What happened? We know what it is about, my grandmother's garden behind the house, but not what happened." },
              { text: "No, it needs a subject.", feedback: "It has a subject: my grandmother's garden behind the house. What is missing is what happened." },
              { text: "No, it needs a predicate.", correct: true, feedback: "You found it! We know what it is about, my grandmother's garden behind the house, but not what happened. It needs a predicate." },
              { text: "No, it is a run-on.", feedback: "A run-on has two sentences stuck together. This is only part of one sentence." }
            ],
            clue: "Remember: ask what happened. If you cannot answer, the predicate is missing. The predicate has the verb.",
            reveal: "Let's check it together. Who or what? my grandmother's garden behind the house. What happened? The sentence never says. There is no verb, so it needs a predicate." },
          /* Q10 -- stage 2 */
          { stage: 1, std: ["3.L.GC.2.a", "GUM:U:complete-thoughts:R"],
            sentence: { words: ["Walked", "slowly", "to", "the", "bus", "stop."] },
            question: "Is this a complete sentence?",
            choices: [
              { text: "Yes, it is complete.", feedback: "Ask: Who or what? We do not know who walked slowly to the bus stop. Something is missing." },
              { text: "No, it needs a subject.", correct: true, feedback: "You found it! We do not know who walked slowly to the bus stop. It needs a subject." },
              { text: "No, it needs a predicate.", feedback: "It has a predicate: walked slowly to the bus stop. What is missing is who did it." },
              { text: "No, it is a run-on.", feedback: "A run-on has two sentences stuck together. This is only part of one sentence." }
            ],
            clue: "Remember: ask who or what the sentence is about. If you cannot answer, the subject is missing.",
            reveal: "Let's check it together. What happened? walked slowly to the bus stop. But who? The sentence never says, so it needs a subject." },
          /* Q11 -- stage 3 */
          { stage: 2, std: ["3.L.GC.2.a", "3.L.GC.2.b"],
            sentence: { words: ["The", "rain", "stopped", "we", "went", "outside", "to", "play."] },
            question: "Is this a complete sentence?",
            choices: [
              { text: "Yes, it is complete.", feedback: "Read it slowly. One complete thought is “The rain stopped.” The other is “we went outside to play.” They run together with nothing between them." },
              { text: "No, it needs a subject.", feedback: "Both parts have a subject. The problem is that two sentences are stuck together." },
              { text: "No, it needs a predicate.", feedback: "Both parts have a verb. The problem is that two sentences are stuck together." },
              { text: "No, it is a run-on.", correct: true, feedback: "Great job! “The rain stopped” is one sentence and “we went outside to play” is another. They run together with no end mark, so it is a run-on." }
            ],
            clue: "Remember: count the complete thoughts. Two complete thoughts with nothing between them make a run-on.",
            reveal: "Let's check it together. “The rain stopped” is a complete thought. “we went outside to play” is another complete thought. Nothing separates them, so it is a run-on." },
          /* Q12 -- stage 3 */
          { stage: 2, std: ["3.L.GC.2.a", "3.L.GC.2.b"],
            sentence: { words: ["Mia", "finished", "her", "homework", "she", "went", "to", "bed."] },
            question: "Is this a complete sentence?",
            choices: [
              { text: "Yes, it is complete.", feedback: "Read it slowly. One complete thought is “Mia finished her homework.” The other is “she went to bed.” They run together with nothing between them." },
              { text: "No, it needs a subject.", feedback: "Both parts have a subject. The problem is that two sentences are stuck together." },
              { text: "No, it needs a predicate.", feedback: "Both parts have a verb. The problem is that two sentences are stuck together." },
              { text: "No, it is a run-on.", correct: true, feedback: "Great job! “Mia finished her homework” is one sentence and “she went to bed” is another. They run together with no end mark, so it is a run-on." }
            ],
            clue: "Remember: count the complete thoughts. Two complete thoughts with nothing between them make a run-on.",
            reveal: "Let's check it together. “Mia finished her homework” is a complete thought. “she went to bed” is another complete thought. Nothing separates them, so it is a run-on." },
          /* Q13 -- stage 3 */
          { stage: 2, std: ["3.L.GC.2.a", "3.L.GC.2.b", "GUM:M:comma-coordinating-conjunction:M"],
            sentence: { words: ["The", "rain", "stopped,", "so", "we", "went", "outside", "to", "play."] },
            question: "Is this a complete sentence?",
            choices: [
              { text: "Yes, it is complete.", correct: true, feedback: "Nice thinking! It has two complete thoughts, “The rain stopped” and “we went outside to play,” joined correctly with a comma and so." },
              { text: "No, it needs a subject.", feedback: "Both parts have a subject: The rain and we." },
              { text: "No, it needs a predicate.", feedback: "Both parts have a predicate: stopped and went outside to play." },
              { text: "No, it is a run-on.", feedback: "This has two sentences, but they are joined correctly with a comma and so. That is not a run-on." }
            ],
            clue: "Remember: two complete thoughts are fine when a comma and a joining word like and, but, or so connect them.",
            reveal: "Let's check it together. “The rain stopped” is one complete thought. “We went outside to play” is another. A comma and the joining word so connect them correctly, so it is a complete sentence." },
          /* Q14 -- stage 3 */
          { stage: 2, std: ["3.L.GC.2.a", "3.L.GC.2.b"],
            sentence: { words: ["My", "brother", "likes", "soccer", "I", "like", "basketball."] },
            question: "Is this a complete sentence?",
            choices: [
              { text: "Yes, it is complete.", feedback: "Read it slowly. One complete thought is “My brother likes soccer.” The other is “I like basketball.” They run together with nothing between them." },
              { text: "No, it needs a subject.", feedback: "Both parts have a subject. The problem is that two sentences are stuck together." },
              { text: "No, it needs a predicate.", feedback: "Both parts have a verb. The problem is that two sentences are stuck together." },
              { text: "No, it is a run-on.", correct: true, feedback: "Great job! “My brother likes soccer” is one sentence and “I like basketball” is another. They run together with no end mark, so it is a run-on." }
            ],
            clue: "Remember: count the complete thoughts. Two complete thoughts with nothing between them make a run-on.",
            reveal: "Let's check it together. “My brother likes soccer” is a complete thought. “I like basketball” is another complete thought. Nothing separates them, so it is a run-on." },
          /* Q15 -- stage 3 */
          { stage: 2, std: ["3.L.GC.2.a", "GUM:U:complete-thoughts:R"],
            sentence: { words: ["After", "the", "storm,", "the", "tall", "tree", "near", "our", "house."] },
            question: "Is this a complete sentence?",
            choices: [
              { text: "Yes, it is complete.", feedback: "Ask: What happened? We know what it is about, the tall tree near our house, but not what happened." },
              { text: "No, it needs a subject.", feedback: "It has a subject: the tall tree near our house. What is missing is what happened." },
              { text: "No, it needs a predicate.", correct: true, feedback: "You found it! We know what it is about, the tall tree near our house, but not what happened. It needs a predicate." },
              { text: "No, it is a run-on.", feedback: "A run-on has two sentences stuck together. This is only part of one sentence." }
            ],
            clue: "Remember: ask what happened. If you cannot answer, the predicate is missing. The predicate has the verb.",
            reveal: "Let's check it together. Who or what? the tall tree near our house. What happened? The sentence never says. There is no verb, so it needs a predicate." },
          /* Q16 -- stage 4 */
          { stage: 3, std: ["3.L.GC.2.a", "3.L.GC.2.b", "GUM:M:end-punctuation:R", "GUM:M:capitalize-first-word:R"],
            sentence: { words: ["The", "puppy", "was", "sleepy", "it", "took", "a", "long", "nap."] },
            question: "Which is the best way to fix it?",
            choices: [
              { text: "The puppy was sleepy. It took a long nap.", correct: true, feedback: "You found it! Each complete thought gets its own end mark, and the new sentence starts with a capital letter." },
              { text: "The puppy was sleepy it. Took a long nap.", feedback: "The period is in the wrong place. Took a long nap has no subject, so now it is a fragment." },
              { text: "The puppy was sleepy, it took a long nap.", feedback: "A comma alone cannot join two complete sentences. It needs a joining word like and or so, or a period." },
              { text: "the puppy was sleepy. it took a long nap.", feedback: "The period is in the right place, but every sentence must start with a capital letter." }
            ],
            clue: "Remember: find the two complete thoughts. Give each one a capital letter and an end mark.",
            reveal: "Let's fix it together. The puppy was sleepy is one thought. It took a long nap is another. Put a period after sleepy and start It with a capital letter." },
          /* Q17 -- stage 4 */
          { stage: 3, std: ["3.L.GC.2.a"],
            sentence: { words: ["Ran", "all", "the", "way", "to", "the", "playground."] },
            question: "Which is the best way to fix it?",
            choices: [
              { text: "Jordan ran all the way to the playground.", correct: true, feedback: "Great job! Adding Jordan tells who ran, so now the sentence has a subject." },
              { text: "Ran all the way to the playground fast.", feedback: "Adding fast does not tell who ran. It still needs a subject." },
              { text: "Jordan all the way to the playground.", feedback: "Now we know who, but the verb ran is gone. It needs a verb, like ran." },
              { text: "Ran all the way. To the playground.", feedback: "Now there are two fragments. Neither one tells who ran." }
            ],
            clue: "Remember: this group of words is missing who did it. Add a subject.",
            reveal: "Let's fix it together. Who ran? The sentence never says. Adding a subject, Jordan, makes it complete: Jordan ran all the way to the playground." },
          /* Q18 -- stage 4 */
          { stage: 3, std: ["3.L.GC.2.a"],
            sentence: { words: ["The", "new", "library", "in", "our", "town."] },
            question: "Which is the best way to fix it?",
            choices: [
              { text: "The new library in our town and today.", feedback: "Adding and today does not tell what the library did. There is still no verb." },
              { text: "The new library. In our town.", feedback: "Now there are two fragments. Neither one tells what happened." },
              { text: "The new library in our town opened today.", correct: true, feedback: "Nice thinking! opened today tells what the library did, so now the sentence has a predicate." },
              { text: "Opened today in our town.", feedback: "Now there is a verb, but we do not know what opened. The subject is gone." }
            ],
            clue: "Remember: this group of words tells what it is about but not what happened. Add a predicate with a verb.",
            reveal: "Let's fix it together. What is it about? The new library in our town. What happened? The sentence never says. Adding opened today makes it complete." },
          /* Q19 -- stage 4 */
          { stage: 3, std: ["3.L.GC.2.a", "GUM:G:coordinating-conjunctions:M", "GUM:M:comma-coordinating-conjunction:M"],
            sentence: { words: ["I", "wanted", "to", "swim", "it", "was", "too", "cold."] },
            question: "Which is the best way to fix it?",
            choices: [
              { text: "I wanted to swim but, it was too cold.", feedback: "The comma goes before the joining word, not after it: swim, but." },
              { text: "I wanted to swim, but it was too cold.", correct: true, feedback: "You found it! A comma and the joining word but connect the two complete thoughts." },
              { text: "I wanted to swim, it was too cold.", feedback: "A comma alone cannot join two complete sentences. It needs a joining word like but." },
              { text: "I wanted to swim it, but was too cold.", feedback: "The comma and but are in the wrong place, and was too cold has no subject." }
            ],
            clue: "Remember: to join two complete thoughts, put a comma and then a joining word like and, but, or so.",
            reveal: "Let's fix it together. I wanted to swim is one thought. It was too cold is another. Join them with a comma and but: I wanted to swim, but it was too cold." },
          /* Q20 -- stage 4 */
          { stage: 3, std: ["3.L.GC.2.a", "GUM:G:coordinating-conjunctions:M", "GUM:M:comma-coordinating-conjunction:M"],
            sentence: { words: ["We", "packed", "our", "lunches", "we", "got", "on", "the", "bus."] },
            question: "Which is the best way to fix it?",
            choices: [
              { text: "We packed our lunches, we got on the bus.", feedback: "A comma alone cannot join two complete sentences. It needs a joining word like and." },
              { text: "We packed our lunches and, we got on the bus.", feedback: "The comma goes before the joining word, not after it: lunches, and." },
              { text: "We packed. Our lunches we got on the bus.", feedback: "The period splits the first thought in the wrong place, and the rest does not make sense." },
              { text: "We packed our lunches, and we got on the bus.", correct: true, feedback: "Great job! A comma and the joining word and connect the two complete thoughts." }
            ],
            clue: "Remember: to join two complete thoughts, put a comma and then a joining word like and, but, or so.",
            reveal: "Let's fix it together. We packed our lunches is one thought. We got on the bus is another. Join them with a comma and and: We packed our lunches, and we got on the bus." }
        ]
      },

      recap: "A complete sentence has a subject and a predicate and tells a complete thought.",

      studyGuide: {
        title: "Complete Sentence Study Guide",
        sections: [
          { heading: "What it is", lines: ["A complete sentence has a subject and a predicate.", "It tells a complete thought.", "It starts with a capital letter and ends with . ? or !"] },
          { heading: "How to check it", steps: ["Who or what is it about?", "What does it do, or what is it?", "Does it make sense by itself?"] },
          {
            heading: "See the two parts",
            sentence: {
              words: ["The", "hungry", "bear", "searched", "the", "woods", "for", "berries."],
              split: { at: 3, leftLabel: "COMPLETE SUBJECT", rightLabel: "PREDICATE" },
              marks: [{ start: 3, end: 3, kind: "verb", label: "VERB" }]
            }
          },
          { heading: "Fragment: missing a subject", lines: ["Jumped into the cool water.", "Fix: My cousin jumped into the cool water."] },
          { heading: "Fragment: missing a predicate", lines: ["The tall girl with the red backpack.", "Fix: The tall girl with the red backpack waved."] },
          { heading: "Run-on: two sentences stuck together", lines: ["The rain stopped we went outside.", "Fix with a period: The rain stopped. We went outside.", "Fix with a comma and so: The rain stopped, so we went outside."] },
          { heading: "Joining words", chips: ["and", "but", "or", "so"] }
        ],
        reminder: "A comma alone cannot join two sentences. Use a period, or a comma and a joining word."
      }
    },

    /* ===================================================== */
    /* SUBJECT-VERB AGREEMENT  (Build 1.4)                   */
    /* Georgia: 3.L.GC.2.c; GUM collective nouns (M),        */
    /* prepositional phrases (C), verbs + -s/-es (R).        */
    /* ===================================================== */
    "agreement": {
      name: "Subject-Verb Agreement",
      badge: "dogs bark",
      card: "Make the subject and verb match.",
      color: "agreement",
      standards: ["3.L.GC.2.c", "GUM:G:collective-abstract-nouns:M", "GUM:G:prepositional-phrases:C"],

      definition: {
        title: "What is subject-verb agreement?",
        text: "The subject and the verb must match.",
        list: [
          "One: the verb usually ends in -s. The dog barks.",
          "More than one, I, and you: no -s. The dogs bark. I run.",
          "One goes with is and was. More than one goes with are and were. I goes with am."
        ],
        note: "Nouns are the opposite: dogs has an -s, but bark does not.",
        sentence: {
          words: ["The", "playful", "dog", "barks", "at", "the", "mail", "truck."],
          marks: [
            { start: 2, end: 2, kind: "subject", label: "ONE" },
            { start: 3, end: 3, kind: "verb", label: "ENDS IN -S" }
          ],
          links: [{ from: 3, to: 2, text: "matches" }]
        }
      },

      clue: {
        title: "A clue for making them match",
        text: "Find the subject first. Then ask: Is it one, or more than one?",
        steps: [
          "Find the verb.",
          "Ask who or what to find the subject.",
          "One or more than one? Make the verb match."
        ],
        warning: "Words in between can trick you. In this sentence the subject is boxes, not shelf.",
        sentence: {
          words: ["The", "boxes", "on", "the", "top", "shelf", "are", "heavy."],
          marks: [
            { start: 1, end: 1, kind: "subject", label: "SUBJECT" },
            { start: 5, end: 5, kind: "noun", label: "NOT THE SUBJECT" },
            { start: 6, end: 6, kind: "verb", label: "VERB" }
          ],
          links: [{ from: 6, to: 1, text: "matches" }]
        }
      },

      example: {
        title: "Let's match a subject with two parts",
        text: "Two subjects joined by and are more than one.",
        sentence: {
          words: ["Maya", "and", "her", "brother", "walk", "to", "school", "together."],
          marks: [
            { start: 0, end: 0, kind: "subject", label: "SUBJECT" },
            { start: 3, end: 3, kind: "subject", label: "SUBJECT" },
            { start: 4, end: 4, kind: "verb", label: "NO -S" }
          ]
        },
        points: [
          "Maya and her brother are two people.",
          "More than one goes with walk, not walks.",
          "A word for a group, like team or flock, is one group: The team is ready."
        ]
      },

      /* -----------------------------------------------------------------
         SUBJECT-VERB AGREEMENT — 20-QUESTION GUIDED BANK (Build 1.4)
         Stage 1 one or more than one · Stage 2 am/is/are, including a
         subject joined by "and" and a collective noun · Stage 3 a phrase
         between the subject and the verb (the noun right before the blank
         is the trap) · Stage 4 choose the correctly written sentence.
         Action-verb choices are present tense only (V-s, V, V-ing, to V),
         so no other tense can also be correct.
         ----------------------------------------------------------------- */
      tryItBank: {
        recap: "You practiced making subjects and verbs match in 20 different sentences, even when other words got in the way.",
        stages: [
          { name: "Get Started", desc: "Is the subject one, or more than one?",
            mark: "⭐", milestoneTitle: "Get Started complete!",
            milestoneLine: "You matched verbs to subjects that were one or more than one.", nextStage: "Look Closer" },
          { name: "Look Closer", desc: "Choose am, is, or are.",
            mark: "🌟", milestoneTitle: "Look Closer complete!",
            milestoneLine: "You chose am, is, and are, even for teams and pairs.", nextStage: "Think It Through" },
          { name: "Think It Through", desc: "Skip the words between the subject and the verb.",
            mark: "💪", milestoneTitle: "Think It Through complete!",
            milestoneLine: "You found the real subject when other words got in the way.", nextStage: "Challenge Yourself" },
          { name: "Challenge Yourself", desc: "Choose the sentence that is written correctly.",
            mark: "🎉", milestoneTitle: "You practiced Subject-Verb Agreement 20 different ways!",
            milestoneLine: "", nextStage: "" }
        ],
        questions: [
          /* Q1 -- stage 1 */
          { stage: 0, std: ["3.L.GC.2.c", "GUM:G:verbs-add-s-es:R"],
            sentence: { words: ["The", "playful", "puppy", "____", "at", "the", "mail", "carrier."] },
            question: "Which verb matches the subject?",
            choices: [
              { text: "barks", correct: true, feedback: "Nice thinking! The word puppy means one, so the verb is barks." },
              { text: "bark", feedback: "The word bark goes with more than one. The word puppy means one, so the verb needs -s." },
              { text: "barking", feedback: "The word barking cannot be the verb by itself. It needs a helping verb. Choose the verb that matches puppy." },
              { text: "to bark", feedback: "to bark cannot be the verb by itself. Choose the verb that matches puppy." }
            ],
            clue: "Remember: find the subject. One subject: the verb usually ends in -s. More than one: no -s.",
            reveal: "Let's find it together. The subject is puppy. The word puppy means one, so the verb is barks." },
          /* Q2 -- stage 1 */
          { stage: 0, std: ["3.L.GC.2.c", "GUM:G:verbs-add-s-es:R"],
            sentence: { words: ["My", "two", "cousins", "____", "to", "my", "school", "every", "day."] },
            question: "Which verb matches the subject?",
            choices: [
              { text: "walk", correct: true, feedback: "Nice thinking! The word cousins means more than one, so the verb is walk." },
              { text: "walks", feedback: "The word walks goes with one. The word cousins means more than one, so the verb has no -s." },
              { text: "walking", feedback: "The word walking cannot be the verb by itself. It needs a helping verb. Choose the verb that matches cousins." },
              { text: "to walk", feedback: "to walk cannot be the verb by itself. Choose the verb that matches cousins." }
            ],
            clue: "Remember: find the subject. One subject: the verb usually ends in -s. More than one: no -s.",
            reveal: "Let's find it together. The subject is cousins. The word cousins means more than one, so the verb is walk." },
          /* Q3 -- stage 1 */
          { stage: 0, std: ["3.L.GC.2.c", "GUM:G:verbs-add-s-es:R"],
            sentence: { words: ["Our", "teacher", "____", "a", "new", "book", "to", "class", "every", "Friday."] },
            question: "Which verb matches the subject?",
            choices: [
              { text: "brings", correct: true, feedback: "Nice thinking! The word teacher means one, so the verb is brings." },
              { text: "bring", feedback: "The word bring goes with more than one. The word teacher means one, so the verb needs -s." },
              { text: "bringing", feedback: "The word bringing cannot be the verb by itself. It needs a helping verb. Choose the verb that matches teacher." },
              { text: "to bring", feedback: "to bring cannot be the verb by itself. Choose the verb that matches teacher." }
            ],
            clue: "Remember: find the subject. One subject: the verb usually ends in -s. More than one: no -s.",
            reveal: "Let's find it together. The subject is teacher. The word teacher means one, so the verb is brings." },
          /* Q4 -- stage 1 */
          { stage: 0, std: ["3.L.GC.2.c", "GUM:G:verbs-add-s-es:R"],
            sentence: { words: ["The", "busy", "bees", "____", "from", "flower", "to", "flower."] },
            question: "Which verb matches the subject?",
            choices: [
              { text: "buzz", correct: true, feedback: "Nice thinking! The word bees means more than one, so the verb is buzz." },
              { text: "buzzes", feedback: "The word buzzes goes with one. The word bees means more than one, so the verb has no -s." },
              { text: "buzzing", feedback: "The word buzzing cannot be the verb by itself. It needs a helping verb. Choose the verb that matches bees." },
              { text: "to buzz", feedback: "to buzz cannot be the verb by itself. Choose the verb that matches bees." }
            ],
            clue: "Remember: find the subject. One subject: the verb usually ends in -s. More than one: no -s.",
            reveal: "Let's find it together. The subject is bees. The word bees means more than one, so the verb is buzz." },
          /* Q5 -- stage 1 */
          { stage: 0, std: ["3.L.GC.2.c", "GUM:G:verbs-add-s-es:R"],
            sentence: { words: ["My", "grandfather", "____", "tomatoes", "in", "his", "backyard", "garden."] },
            question: "Which verb matches the subject?",
            choices: [
              { text: "grows", correct: true, feedback: "Nice thinking! The word grandfather means one, so the verb is grows." },
              { text: "grow", feedback: "The word grow goes with more than one. The word grandfather means one, so the verb needs -s." },
              { text: "growing", feedback: "The word growing cannot be the verb by itself. It needs a helping verb. Choose the verb that matches grandfather." },
              { text: "to grow", feedback: "to grow cannot be the verb by itself. Choose the verb that matches grandfather." }
            ],
            clue: "Remember: find the subject. One subject: the verb usually ends in -s. More than one: no -s.",
            reveal: "Let's find it together. The subject is grandfather. The word grandfather means one, so the verb is grows." },
          /* Q6 -- stage 2 */
          { stage: 1, std: ["3.L.GC.2.c"],
            sentence: { words: ["I", "____", "ready", "for", "the", "spelling", "test", "today."] },
            question: "Which verb matches the subject?",
            choices: [
              { text: "is", feedback: "The word “is” goes with one person or thing, but never with I. I goes with am." },
              { text: "are", feedback: "The word “are” goes with more than one, and with you. I goes with am." },
              { text: "am", correct: true, feedback: "Great job! I goes with “am.”" },
              { text: "be", feedback: "The word be cannot be the verb by itself here. Use am, is, or are." }
            ],
            clue: "Remember: I goes with am. One goes with is. More than one goes with are.",
            reveal: "Let's find it together. The subject is I. I goes with “am.”" },
          /* Q7 -- stage 2 */
          { stage: 1, std: ["3.L.GC.2.c"],
            sentence: { words: ["Maya", "and", "her", "brother", "____", "ready", "for", "the", "field", "trip."] },
            question: "Which verb matches the subject?",
            choices: [
              { text: "is", feedback: "The word “is” goes with one person or thing. The subject is Maya and her brother." },
              { text: "are", correct: true, feedback: "Great job! Maya and her brother are two people, so the verb is “are.” Two people joined by and mean more than one." },
              { text: "am", feedback: "The word “am” goes only with I. The subject is Maya and her brother." },
              { text: "be", feedback: "The word be cannot be the verb by itself here. Use am, is, or are." }
            ],
            clue: "Remember: I goes with am. One goes with is. More than one goes with are.",
            reveal: "Let's find it together. The subject is Maya and her brother. Maya and her brother are two people, so the verb is “are.”" },
          /* Q8 -- stage 2 */
          { stage: 1, std: ["3.L.GC.2.c", "GUM:G:collective-abstract-nouns:M"],
            sentence: { words: ["Our", "soccer", "team", "____", "ready", "for", "the", "big", "game."] },
            question: "Which verb matches the subject?",
            choices: [
              { text: "is", correct: true, feedback: "Great job! The word team means one, so the verb is “is.” A team is one group, even though it has many players." },
              { text: "are", feedback: "The word “are” goes with more than one, and with you. The subject is team." },
              { text: "am", feedback: "The word “am” goes only with I. The subject is team." },
              { text: "be", feedback: "The word be cannot be the verb by itself here. Use am, is, or are." }
            ],
            clue: "Remember: I goes with am. One goes with is. More than one goes with are.",
            reveal: "Let's find it together. The subject is team. The word team means one, so the verb is “is.”" },
          /* Q9 -- stage 2 */
          { stage: 1, std: ["3.L.GC.2.c"],
            sentence: { words: ["My", "best", "friends", "____", "funny", "and", "kind", "to", "everyone."] },
            question: "Which verb matches the subject?",
            choices: [
              { text: "is", feedback: "The word “is” goes with one person or thing. The subject is friends." },
              { text: "are", correct: true, feedback: "Great job! The word friends means more than one, so the verb is “are.”" },
              { text: "am", feedback: "The word “am” goes only with I. The subject is friends." },
              { text: "be", feedback: "The word be cannot be the verb by itself here. Use am, is, or are." }
            ],
            clue: "Remember: I goes with am. One goes with is. More than one goes with are.",
            reveal: "Let's find it together. The subject is friends. The word friends means more than one, so the verb is “are.”" },
          /* Q10 -- stage 2 */
          { stage: 1, std: ["3.L.GC.2.c"],
            sentence: { words: ["The", "library", "____", "quiet", "in", "the", "morning."] },
            question: "Which verb matches the subject?",
            choices: [
              { text: "is", correct: true, feedback: "Great job! The word library means one, so the verb is “is.”" },
              { text: "are", feedback: "The word “are” goes with more than one, and with you. The subject is library." },
              { text: "am", feedback: "The word “am” goes only with I. The subject is library." },
              { text: "be", feedback: "The word be cannot be the verb by itself here. Use am, is, or are." }
            ],
            clue: "Remember: I goes with am. One goes with is. More than one goes with are.",
            reveal: "Let's find it together. The subject is library. The word library means one, so the verb is “is.”" },
          /* Q11 -- stage 3 */
          { stage: 2, std: ["3.L.GC.2.c", "GUM:G:prepositional-phrases:C"],
            sentence: { words: ["The", "boxes", "on", "the", "top", "shelf", "____", "heavy."] },
            question: "Which verb matches the subject?",
            choices: [
              { text: "is", feedback: "The word “is” goes with one person or thing. The subject is boxes. shelf is right before the blank, but the subject is boxes." },
              { text: "are", correct: true, feedback: "Great job! The word boxes means more than one, so the verb is “are.” shelf is right before the blank, but the subject is boxes." },
              { text: "am", feedback: "The word “am” goes only with I. The subject is boxes. shelf is right before the blank, but the subject is boxes." },
              { text: "be", feedback: "The word be cannot be the verb by itself here. Use am, is, or are." }
            ],
            clue: "Remember: I goes with am. One goes with is. More than one goes with are. Skip the words in between.",
            reveal: "Let's find it together. The subject is boxes. The word boxes means more than one, so the verb is “are.”" },
          /* Q12 -- stage 3 */
          { stage: 2, std: ["3.L.GC.2.c", "GUM:G:prepositional-phrases:C"],
            sentence: { words: ["The", "girl", "with", "the", "red", "sneakers", "____", "very", "fast."] },
            question: "Which verb matches the subject?",
            choices: [
              { text: "runs", correct: true, feedback: "Nice thinking! The word girl means one, so the verb is runs. sneakers is right before the blank, but the subject is girl." },
              { text: "run", feedback: "The word run goes with more than one. The word girl means one, so the verb needs -s. sneakers is right before the blank, but the subject is girl." },
              { text: "running", feedback: "The word running cannot be the verb by itself. It needs a helping verb. Choose the verb that matches girl." },
              { text: "to run", feedback: "to run cannot be the verb by itself. Choose the verb that matches girl." }
            ],
            clue: "Remember: find the subject. One subject: the verb usually ends in -s. More than one: no -s. Skip the words in between.",
            reveal: "Let's find it together. The subject is girl. The word girl means one, so the verb is runs." },
          /* Q13 -- stage 3 */
          { stage: 2, std: ["3.L.GC.2.c", "GUM:G:prepositional-phrases:C"],
            sentence: { words: ["The", "flowers", "in", "the", "garden", "____", "in", "the", "spring."] },
            question: "Which verb matches the subject?",
            choices: [
              { text: "bloom", correct: true, feedback: "Nice thinking! The word flowers means more than one, so the verb is bloom. garden is right before the blank, but the subject is flowers." },
              { text: "blooms", feedback: "The word blooms goes with one. The word flowers means more than one, so the verb has no -s. garden is right before the blank, but the subject is flowers." },
              { text: "blooming", feedback: "The word blooming cannot be the verb by itself. It needs a helping verb. Choose the verb that matches flowers." },
              { text: "to bloom", feedback: "to bloom cannot be the verb by itself. Choose the verb that matches flowers." }
            ],
            clue: "Remember: find the subject. One subject: the verb usually ends in -s. More than one: no -s. Skip the words in between.",
            reveal: "Let's find it together. The subject is flowers. The word flowers means more than one, so the verb is bloom." },
          /* Q14 -- stage 3 */
          { stage: 2, std: ["3.L.GC.2.c", "GUM:G:prepositional-phrases:C"],
            sentence: { words: ["The", "leader", "of", "the", "scouts", "____", "kind", "to", "everyone."] },
            question: "Which verb matches the subject?",
            choices: [
              { text: "is", correct: true, feedback: "Great job! The word leader means one, so the verb is “is.” scouts is right before the blank, but the subject is leader." },
              { text: "are", feedback: "The word “are” goes with more than one, and with you. The subject is leader. scouts is right before the blank, but the subject is leader." },
              { text: "am", feedback: "The word “am” goes only with I. The subject is leader. scouts is right before the blank, but the subject is leader." },
              { text: "be", feedback: "The word be cannot be the verb by itself here. Use am, is, or are." }
            ],
            clue: "Remember: I goes with am. One goes with is. More than one goes with are. Skip the words in between.",
            reveal: "Let's find it together. The subject is leader. The word leader means one, so the verb is “is.”" },
          /* Q15 -- stage 3 */
          { stage: 2, std: ["3.L.GC.2.c", "GUM:G:prepositional-phrases:C"],
            sentence: { words: ["The", "birds", "in", "the", "tall", "tree", "____", "every", "morning."] },
            question: "Which verb matches the subject?",
            choices: [
              { text: "sing", correct: true, feedback: "Nice thinking! The word birds means more than one, so the verb is sing. tree is right before the blank, but the subject is birds." },
              { text: "sings", feedback: "The word sings goes with one. The word birds means more than one, so the verb has no -s. tree is right before the blank, but the subject is birds." },
              { text: "singing", feedback: "The word singing cannot be the verb by itself. It needs a helping verb. Choose the verb that matches birds." },
              { text: "to sing", feedback: "to sing cannot be the verb by itself. Choose the verb that matches birds." }
            ],
            clue: "Remember: find the subject. One subject: the verb usually ends in -s. More than one: no -s. Skip the words in between.",
            reveal: "Let's find it together. The subject is birds. The word birds means more than one, so the verb is sing." },
          /* Q16 -- stage 4 */
          { stage: 3, std: ["3.L.GC.2.c", "GUM:G:verbs-add-s-es:R"],
            sentence: { words: ["The", "dogs", "barks", "at", "the", "squirrels", "every", "day."] },
            question: "Which is the correct way to write this sentence?",
            choices: [
              { text: "The dogs bark at the squirrels every day.", correct: true, feedback: "You found it! dogs is more than one, so the verb is bark." },
              { text: "The dog bark at the squirrels every day.", feedback: "dog is one, so the verb needs -s: barks. Changing the subject made a new mistake." },
              { text: "The dogs barking at the squirrels every day.", feedback: "barking cannot be the verb by itself. It needs a helping verb." },
              { text: "The dogs is barks at the squirrels every day.", feedback: "is barks is not correct. dogs is more than one, so the verb is bark." }
            ],
            clue: "Remember: more than one goes with a verb that has no -s.",
            reveal: "Let's fix it together. dogs is more than one. More than one goes with bark, not barks." },
          /* Q17 -- stage 4 */
          { stage: 3, std: ["3.L.GC.2.c", "GUM:G:verbs-add-s-es:R"],
            sentence: { words: ["My", "sister", "play", "the", "piano", "after", "school."] },
            question: "Which is the correct way to write this sentence?",
            choices: [
              { text: "My sister playing the piano after school.", feedback: "playing cannot be the verb by itself. It needs a helping verb." },
              { text: "My sister plays the piano after school.", correct: true, feedback: "Great job! sister is one, so the verb is plays." },
              { text: "My sisters plays the piano after school.", feedback: "sisters is more than one, so the verb should be play. This made a new mistake." },
              { text: "My sister are play the piano after school.", feedback: "are play is not correct. sister is one, so the verb is plays." }
            ],
            clue: "Remember: one subject goes with a verb that usually ends in -s.",
            reveal: "Let's fix it together. sister is one. One goes with plays." },
          /* Q18 -- stage 4 */
          { stage: 3, std: ["3.L.GC.2.c", "GUM:G:prepositional-phrases:C"],
            sentence: { words: ["The", "students", "in", "my", "class", "is", "ready", "for", "recess."] },
            question: "Which is the correct way to write this sentence?",
            choices: [
              { text: "The students in my class are ready for recess.", correct: true, feedback: "Nice thinking! The subject is students, not class. students is more than one, so the verb is are." },
              { text: "The students in my class am ready for recess.", feedback: "am goes only with I. The subject is students." },
              { text: "The student in my class are ready for recess.", feedback: "student is one, so the verb should be is. This made a new mistake." },
              { text: "The students in my class be ready for recess.", feedback: "be cannot be the verb here. students is more than one, so the verb is are." }
            ],
            clue: "Remember: skip the words in between. Find the real subject.",
            reveal: "Let's fix it together. The subject is students, not class. students is more than one, so it should be are." },
          /* Q19 -- stage 4 */
          { stage: 3, std: ["3.L.GC.2.c"],
            sentence: { words: ["Ava", "and", "Ben", "was", "at", "the", "library", "yesterday."] },
            question: "Which is the correct way to write this sentence?",
            choices: [
              { text: "Ava and Ben were at the library yesterday.", correct: true, feedback: "You found it! Ava and Ben are two people, so the verb is were." },
              { text: "Ava and Ben is at the library yesterday.", feedback: "is tells about now, and yesterday tells about the past. Two people also need were." },
              { text: "Ava and Ben am at the library yesterday.", feedback: "am goes only with I. Ava and Ben are two people, so the verb is were." },
              { text: "Ava and Ben be at the library yesterday.", feedback: "be cannot be the verb here. Ava and Ben are two people, so the verb is were." }
            ],
            clue: "Remember: was goes with one. were goes with more than one. Two names joined by and are more than one.",
            reveal: "Let's fix it together. Ava and Ben are two people. More than one goes with were." },
          /* Q20 -- stage 4 */
          { stage: 3, std: ["3.L.GC.2.c", "GUM:G:collective-abstract-nouns:M", "GUM:G:prepositional-phrases:C"],
            sentence: { words: ["The", "flock", "of", "geese", "fly", "south", "every", "fall."] },
            question: "Which is the correct way to write this sentence?",
            choices: [
              { text: "The flock of geese flies south every fall.", correct: true, feedback: "Great job! The subject is flock, one group, so the verb is flies." },
              { text: "The flock of geese flying south every fall.", feedback: "flying cannot be the verb by itself. It needs a helping verb." },
              { text: "The flocks of geese flies south every fall.", feedback: "flocks is more than one, so the verb should be fly. This made a new mistake." },
              { text: "The flock of geese are fly south every fall.", feedback: "are fly is not correct. The subject is flock, one group, so the verb is flies." }
            ],
            clue: "Remember: a word for a group, like flock or team, is one group. Skip the words in between.",
            reveal: "Let's fix it together. The subject is flock, not geese. A flock is one group, so the verb is flies." }
        ]
      },

      recap: "The subject and the verb must match. One goes with -s. More than one goes with no -s.",

      studyGuide: {
        title: "Subject-Verb Agreement Study Guide",
        sections: [
          { heading: "What it is", lines: ["The subject and the verb must match."] },
          { heading: "One", chips: ["the dog barks", "she runs", "it is", "the team is"] },
          { heading: "More than one", chips: ["the dogs bark", "they run", "they are", "Ava and Ben are"] },
          { heading: "I and you", chips: ["I am", "I run", "you are", "you run"] },
          { heading: "Was and were", chips: ["it was", "I was", "they were", "you were"] },
          { heading: "How to check it", steps: ["Find the verb.", "Find the subject.", "One or more than one? Make the verb match."] },
          {
            heading: "Watch out for words in between",
            sentence: {
              words: ["The", "boxes", "on", "the", "top", "shelf", "are", "heavy."],
              marks: [
                { start: 1, end: 1, kind: "subject", label: "SUBJECT" },
                { start: 6, end: 6, kind: "verb", label: "VERB" }
              ],
              links: [{ from: 6, to: 1, text: "matches" }]
            }
          }
        ],
        reminder: "Find the real subject first. One goes with -s. More than one goes with no -s."
      }
    }
  }
};
