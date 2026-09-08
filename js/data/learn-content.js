/* =========================================================
   Sentence Sense — Learn content (Build 1.1.1)

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
     complete subject, predicate, nouns, adjectives. */
  order: ["verb", "subject", "complete-subject", "predicate", "noun", "adjective"],

  topics: {

    /* ===================================================== */
    /* VERB                                                  */
    /* ===================================================== */
    "verb": {
      name: "Verb",
      badge: "kicked",
      card: "Find what happens.",
      color: "verb",

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

      tryIt: {
        title: "Try it",
        sentence: {
          words: ["The", "small", "dog", "jumped", "over", "the", "log."]
        },
        question: "Which word tells what happened?",
        choices: [
          { text: "small", feedback: "small tells what kind of dog it is. It describes the dog. Look again for the word that tells what happened." },
          { text: "dog", feedback: "dog names the animal. It does not tell what happened. Look again for the word that tells what happened." },
          { text: "jumped", correct: true, feedback: "Correct! jumped is the verb because it tells what the dog did." },
          { text: "log", feedback: "log names a thing. It does not tell what happened. Look again for the word that tells what happened." }
        ]
      },

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
              { text: "jumped", correct: true, feedback: "Nice thinking! jumped is the verb because it tells what the dog did." },
              { text: "log", feedback: "log names a thing in the sentence. Look again for the word that tells what happened." }
            ],
            clue: "Remember: ask yourself, What happened?",
            reveal: "Let's find it together. jumped tells what the dog did, so jumped is the verb." },
          /* Q2 -- stage 1 */
          { stage: 0,
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
          { stage: 0,
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
          { stage: 0,
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
          { stage: 0,
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
          { stage: 1,
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
          { stage: 1,
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
          { stage: 1,
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
          { stage: 1,
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
          { stage: 1,
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
          { stage: 2,
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
          { stage: 2,
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
          { stage: 2,
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
          { stage: 2,
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
          { stage: 2,
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
          { stage: 3,
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
          { stage: 3,
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
          { stage: 3,
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
          { stage: 3,
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
          { stage: 3,
            sentence: { words: ["Our", "new", "library", "was", "crowded", "during", "family", "reading", "night."] },
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
    /* SUBJECT                                               */
    /* ===================================================== */
    "subject": {
      name: "Subject",
      badge: "who?",
      card: "Find who or what.",
      color: "subject",

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
