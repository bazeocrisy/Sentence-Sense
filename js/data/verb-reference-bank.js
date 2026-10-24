/* Preserved authored Verb bank from production Build 1.8.0, ccbfeb41784f7eef95aaa64e7de1426932f960c1.
Stable choices and staged difficulty retained. No external service. */
(function (root) {
  root.SS_VERB_REFERENCE = {
    recap:
      "You practiced finding action and being verbs in 20 different sentences.",
    stages: [
      {
        name: "Get Started",
        desc: "Find clear verbs and build confidence.",
        mark: "⭐",
        milestoneTitle: "Get Started complete!",
        milestoneLine: "You found verbs in clear sentences.",
        nextStage: "Look Closer",
      },
      {
        name: "Look Closer",
        desc: "Find verbs in sentences with more details.",
        mark: "🌟",
        milestoneTitle: "Look Closer complete!",
        milestoneLine:
          "You found verbs even when the sentence had more details.",
        nextStage: "Think It Through",
      },
      {
        name: "Think It Through",
        desc: "Use the clues even when the sentence is trickier.",
        mark: "💪",
        milestoneTitle: "Think It Through complete!",
        milestoneLine: "You used sentence clues to find the verb.",
        nextStage: "Challenge Yourself",
      },
      {
        name: "Challenge Yourself",
        desc: "Find action and being verbs in different kinds of sentences.",
        mark: "🎉",
        milestoneTitle: "You practiced Verb 20 different ways!",
        milestoneLine: "",
        nextStage: "",
      },
    ],
    questions: [
      {
        stage: 0,
        std: ["GUM:G:action-verbs:R"],
        sentence: {
          words: [
            "The",
            "playful",
            "dog",
            "jumped",
            "over",
            "the",
            "fallen",
            "log.",
          ],
        },
        question: "Which word tells what happened?",
        choices: [
          {
            text: "playful",
            feedback:
              "playful tells what kind of dog it is. It describes the dog. Look again for the word that tells what happened.",
          },
          {
            text: "dog",
            feedback:
              "dog names who did the action. Look again for the word that tells what the dog did.",
          },
          {
            text: "fallen",
            feedback:
              "fallen tells what kind of log it is. It describes the log, even though it ends in -en. An ending is only a clue. Look again for the word that tells what happened.",
          },
          {
            text: "jumped",
            correct: true,
            feedback:
              "Nice thinking! jumped is the verb because it tells what the dog did.",
          },
        ],
        clue: "Remember: ask yourself, What happened?",
        reveal:
          "Let's find it together. jumped tells what the dog did, so jumped is the verb.",
      },
      {
        stage: 0,
        std: ["GUM:G:action-verbs:R"],
        sentence: {
          words: [
            "Our",
            "baseball",
            "team",
            "practices",
            "before",
            "the",
            "Saturday",
            "games.",
          ],
        },
        question: "Which word tells what happens?",
        choices: [
          {
            text: "Saturday",
            feedback:
              "Saturday tells when the games happen. Look again for the word that tells what the team does.",
          },
          {
            text: "team",
            feedback:
              "team names who does the action. Look again for the word that tells what the team does.",
          },
          {
            text: "games",
            feedback:
              "games names the things the team gets ready for. It ends in -s, but an ending is only a clue. Look again for the word that tells what happens.",
          },
          {
            text: "practices",
            correct: true,
            feedback:
              "Nice thinking! practices is the verb because it tells what the team does.",
          },
        ],
        clue: "Remember: ask yourself, What is happening?",
        reveal:
          "Let's find it together. practices tells what the team does, so practices is the verb.",
      },
      {
        stage: 0,
        std: ["GUM:G:action-verbs:R"],
        sentence: {
          words: [
            "The",
            "brown",
            "rabbit",
            "hopped",
            "across",
            "the",
            "grassy",
            "field.",
          ],
        },
        question: "Which word tells what happened?",
        choices: [
          {
            text: "brown",
            feedback:
              "brown tells what color the rabbit is. It describes the rabbit. Look again for the word that tells what happened.",
          },
          {
            text: "rabbit",
            feedback:
              "rabbit names who did the action. Look again for the word that tells what the rabbit did.",
          },
          {
            text: "hopped",
            correct: true,
            feedback:
              "Nice thinking! hopped is the verb because it tells what the rabbit did.",
          },
          {
            text: "field",
            feedback:
              "field names a place in the sentence. Look again for the word that tells what happened.",
          },
        ],
        clue: "Remember: ask yourself, What happened?",
        reveal:
          "Let's find it together. hopped tells what the rabbit did, so hopped is the verb.",
      },
      {
        stage: 0,
        std: ["GUM:G:action-verbs:R"],
        sentence: {
          words: [
            "Maya",
            "opens",
            "her",
            "colorful",
            "notebook",
            "during",
            "science",
            "class.",
          ],
        },
        question: "Which word tells what happens?",
        choices: [
          {
            text: "Maya",
            feedback:
              "Maya names who does the action. Look again for the word that tells what Maya does.",
          },
          {
            text: "colorful",
            feedback:
              "colorful tells what kind of notebook it is. It describes the notebook. Look again for the word that tells what happens.",
          },
          {
            text: "opens",
            correct: true,
            feedback:
              "Nice thinking! opens is the verb because it tells what Maya does.",
          },
          {
            text: "notebook",
            feedback:
              "notebook names a thing in the sentence. Look again for the word that tells what happens.",
          },
        ],
        clue: "Remember: ask yourself, What is happening?",
        reveal:
          "Let's find it together. opens tells what Maya does, so opens is the verb.",
      },
      {
        stage: 0,
        std: ["GUM:G:helping-linking-verbs:I"],
        sentence: {
          words: [
            "The",
            "friendly",
            "puppy",
            "is",
            "happy",
            "in",
            "its",
            "new",
            "home.",
          ],
        },
        question: "Which word is the verb in this sentence?",
        choices: [
          {
            text: "puppy",
            feedback:
              "puppy names who we are talking about. A verb can tell what someone does OR what someone is. Look again for the word that tells what the puppy is.",
          },
          {
            text: "is",
            correct: true,
            feedback:
              "Nice thinking! 'is' is the verb because it tells what the puppy is.",
          },
          {
            text: "happy",
            feedback:
              "happy tells how the puppy feels. It describes the puppy. Look again for the word that tells what the puppy is.",
          },
          {
            text: "home",
            feedback:
              "home names a place. Look again for the word that tells what the puppy is.",
          },
        ],
        clue: "Remember: a verb can also tell what someone or something is.",
        reveal:
          "Let's find it together. 'is' tells what the puppy is, so 'is' is the verb.",
      },
      {
        stage: 1,
        std: ["GUM:G:action-verbs:R"],
        sentence: {
          words: [
            "The",
            "talented",
            "pitcher",
            "threw",
            "the",
            "baseball",
            "toward",
            "home",
            "plate.",
          ],
        },
        question: "Which word tells what happened?",
        choices: [
          {
            text: "talented",
            feedback:
              "talented tells what kind of pitcher he is. It describes the pitcher, even though it ends in -ed. An ending is only a clue. Look again for the word that tells what happened.",
          },
          {
            text: "pitcher",
            feedback:
              "pitcher names who did the action. Look again for the word that tells what the pitcher did.",
          },
          {
            text: "threw",
            correct: true,
            feedback:
              "Nice thinking! threw is the verb because it tells what the pitcher did.",
          },
          {
            text: "baseball",
            feedback:
              "baseball names the thing that was thrown. Look again for the word that tells what happened.",
          },
        ],
        clue: "Remember: ask yourself, What happened?",
        reveal:
          "Let's find it together. threw tells what the pitcher did, so threw is the verb.",
      },
      {
        stage: 1,
        std: ["GUM:G:action-verbs:R"],
        sentence: {
          words: [
            "Several",
            "noisy",
            "birds",
            "gather",
            "beside",
            "the",
            "school",
            "playground.",
          ],
        },
        question: "Which word tells what happens?",
        choices: [
          {
            text: "noisy",
            feedback:
              "noisy tells what kind of birds they are. It describes the birds. Look again for the word that tells what happens.",
          },
          {
            text: "birds",
            feedback:
              "birds names who does the action. It ends in -s, but an ending is only a clue. Look again for the word that tells what the birds do.",
          },
          {
            text: "gather",
            correct: true,
            feedback:
              "Nice thinking! gather is the verb because it tells what the birds do.",
          },
          {
            text: "playground",
            feedback:
              "playground names a place. Look again for the word that tells what happens.",
          },
        ],
        clue: "Remember: ask yourself, What is happening?",
        reveal:
          "Let's find it together. gather tells what the birds do, so gather is the verb.",
      },
      {
        stage: 1,
        std: ["GUM:G:helping-linking-verbs:I"],
        sentence: {
          words: [
            "The",
            "long",
            "hallways",
            "are",
            "quiet",
            "after",
            "the",
            "final",
            "bell.",
          ],
        },
        question: "Which word is the verb in this sentence?",
        choices: [
          {
            text: "hallways",
            feedback:
              "hallways names the places we are talking about. It ends in -s, but an ending is only a clue. Look again for the word that tells what the hallways are.",
          },
          {
            text: "are",
            correct: true,
            feedback:
              "Nice thinking! are is the verb because it tells what the hallways are.",
          },
          {
            text: "quiet",
            feedback:
              "quiet tells how the hallways sound. It describes the hallways. Look again for the word that tells what the hallways are.",
          },
          {
            text: "bell",
            feedback:
              "bell names a thing in the sentence. Look again for the word that tells what the hallways are.",
          },
        ],
        clue: "Remember: a verb can also tell what someone or something is.",
        reveal:
          "Let's find it together. are tells what the hallways are, so are is the verb.",
      },
      {
        stage: 1,
        std: ["GUM:G:action-verbs:R"],
        sentence: {
          words: [
            "Jordan",
            "packed",
            "his",
            "clean",
            "uniform",
            "before",
            "soccer",
            "practice.",
          ],
        },
        question: "Which word tells what happened?",
        choices: [
          {
            text: "packed",
            correct: true,
            feedback:
              "Nice thinking! packed is the verb because it tells what Jordan did.",
          },
          {
            text: "clean",
            feedback:
              "clean tells what kind of uniform it is. It describes the uniform. Look again for the word that tells what happened.",
          },
          {
            text: "uniform",
            feedback:
              "uniform names a thing in the sentence. Look again for the word that tells what happened.",
          },
          {
            text: "practice",
            feedback:
              "practice names an event here, not something that happened. The same word can be a verb in another sentence, so always read the whole sentence. Look again for the word that tells what Jordan did.",
          },
        ],
        clue: "Remember: ask yourself, What happened?",
        reveal:
          "Let's find it together. packed tells what Jordan did, so packed is the verb.",
      },
      {
        stage: 1,
        std: ["GUM:G:action-verbs:R"],
        sentence: {
          words: [
            "The",
            "young",
            "artist",
            "paints",
            "a",
            "colorful",
            "picture",
            "for",
            "the",
            "hallway.",
          ],
        },
        question: "Which word tells what happens?",
        choices: [
          {
            text: "young",
            feedback:
              "young tells what kind of artist she is. It describes the artist. Look again for the word that tells what happens.",
          },
          {
            text: "artist",
            feedback:
              "artist names who does the action. Look again for the word that tells what the artist does.",
          },
          {
            text: "paints",
            correct: true,
            feedback:
              "Nice thinking! paints is the verb because it tells what the artist does.",
          },
          {
            text: "picture",
            feedback:
              "picture names the thing being made. Look again for the word that tells what happens.",
          },
        ],
        clue: "Remember: ask yourself, What is happening?",
        reveal:
          "Let's find it together. paints tells what the artist does, so paints is the verb.",
      },
      {
        stage: 2,
        std: ["GUM:G:action-verbs:R"],
        sentence: {
          words: [
            "After",
            "lunch,",
            "the",
            "students",
            "carried",
            "their",
            "projects",
            "into",
            "the",
            "classroom.",
          ],
        },
        question: "Which word tells what happened?",
        choices: [
          {
            text: "students",
            feedback:
              "students names who did the action. It ends in -s, but an ending is only a clue. Look again for the word that tells what the students did.",
          },
          {
            text: "carried",
            correct: true,
            feedback:
              "Nice thinking! carried is the verb because it tells what the students did.",
          },
          {
            text: "projects",
            feedback:
              "projects names the things the students moved. It ends in -s, but an ending is only a clue. Look again for the word that tells what happened.",
          },
          {
            text: "classroom",
            feedback:
              "classroom names a place. Look again for the word that tells what happened.",
          },
        ],
        clue: "Remember: ask yourself, What happened?",
        reveal:
          "Let's find it together. carried tells what the students did, so carried is the verb.",
      },
      {
        stage: 2,
        std: ["GUM:G:action-verbs:R"],
        sentence: {
          words: [
            "Near",
            "the",
            "fence,",
            "a",
            "curious",
            "squirrel",
            "climbed",
            "the",
            "tall",
            "oak",
            "tree.",
          ],
        },
        question: "Which word tells what happened?",
        choices: [
          {
            text: "curious",
            feedback:
              "curious tells what kind of squirrel it is. It describes the squirrel. Look again for the word that tells what happened.",
          },
          {
            text: "squirrel",
            feedback:
              "squirrel names who did the action. Look again for the word that tells what the squirrel did.",
          },
          {
            text: "climbed",
            correct: true,
            feedback:
              "Nice thinking! climbed is the verb because it tells what the squirrel did.",
          },
          {
            text: "tree",
            feedback:
              "tree names the thing that was climbed. Look again for the word that tells what happened.",
          },
        ],
        clue: "Remember: ask yourself, What happened?",
        reveal:
          "Let's find it together. climbed tells what the squirrel did, so climbed is the verb.",
      },
      {
        stage: 2,
        std: ["GUM:G:action-verbs:R"],
        sentence: {
          words: [
            "During",
            "practice,",
            "the",
            "catcher",
            "blocked",
            "the",
            "bouncing",
            "baseball.",
          ],
        },
        question: "Which word tells what happened?",
        choices: [
          {
            text: "practice",
            feedback:
              "practice tells when this happened. It names an event, not an action. The same word can be a verb in another sentence. Look again for the word that tells what the catcher did.",
          },
          {
            text: "catcher",
            feedback:
              "catcher names who did the action. Look again for the word that tells what the catcher did.",
          },
          {
            text: "blocked",
            correct: true,
            feedback:
              "Nice thinking! blocked is the verb because it tells what the catcher did.",
          },
          {
            text: "bouncing",
            feedback:
              "bouncing describes the baseball. It ends in -ing, but an ending is only a clue. Look again for the word that tells what the catcher did.",
          },
        ],
        clue: "Remember: ask yourself, What happened?",
        reveal:
          "Let's find it together. blocked tells what the catcher did, so blocked is the verb.",
      },
      {
        stage: 2,
        std: ["GUM:G:helping-linking-verbs:I"],
        sentence: {
          words: [
            "After",
            "the",
            "storm,",
            "the",
            "wide",
            "fields",
            "were",
            "full",
            "of",
            "water.",
          ],
        },
        question: "Which word is the verb in this sentence?",
        choices: [
          {
            text: "storm",
            feedback:
              "storm names what happened before this. Look again for the word that tells what the fields were.",
          },
          {
            text: "fields",
            feedback:
              "fields names the places we are talking about. It ends in -s, but an ending is only a clue. Look again for the word that tells what the fields were.",
          },
          {
            text: "were",
            correct: true,
            feedback:
              "Nice thinking! were is the verb because it tells what the fields were.",
          },
          {
            text: "full",
            feedback:
              "full tells how much water the fields held. It describes the fields. Look again for the word that tells what the fields were.",
          },
        ],
        clue: "Remember: a verb can also tell what someone or something is.",
        reveal:
          "Let's find it together. were tells what the fields were, so were is the verb.",
      },
      {
        stage: 2,
        std: ["GUM:G:action-verbs:R"],
        sentence: {
          words: [
            "On",
            "Friday,",
            "our",
            "class",
            "visited",
            "the",
            "local",
            "science",
            "museum.",
          ],
        },
        question: "Which word tells what happened?",
        choices: [
          {
            text: "class",
            feedback:
              "class names who did the action. It ends in -s, but an ending is only a clue. Look again for the word that tells what the class did.",
          },
          {
            text: "visited",
            correct: true,
            feedback:
              "Nice thinking! visited is the verb because it tells what the class did.",
          },
          {
            text: "local",
            feedback:
              "local tells what kind of museum it is. It describes the museum. Look again for the word that tells what happened.",
          },
          {
            text: "museum",
            feedback:
              "museum names the place that was visited. Look again for the word that tells what happened.",
          },
        ],
        clue: "Remember: ask yourself, What happened?",
        reveal:
          "Let's find it together. visited tells what the class did, so visited is the verb.",
      },
      {
        stage: 3,
        std: ["GUM:G:helping-linking-verbs:I"],
        sentence: {
          words: [
            "The",
            "whole",
            "classroom",
            "was",
            "quiet",
            "after",
            "the",
            "long",
            "morning",
            "announcements.",
          ],
        },
        question: "Which word is the verb in this sentence?",
        choices: [
          {
            text: "classroom",
            feedback:
              "classroom names a place. A verb can tell what something does OR what something is. Look again for the word that tells what the classroom was.",
          },
          {
            text: "was",
            correct: true,
            feedback:
              "Nice thinking! was is the verb because it tells what the classroom was.",
          },
          {
            text: "quiet",
            feedback:
              "quiet tells how the classroom sounded. It describes the classroom. Look again for the word that tells what the classroom was.",
          },
          {
            text: "announcements",
            feedback:
              "announcements names things that happened earlier. It ends in -s, but an ending is only a clue. Look again for the word that tells what the classroom was.",
          },
        ],
        clue: "Remember: a verb can also tell what someone or something is.",
        reveal:
          "Let's find it together. was tells what the classroom was, so was is the verb.",
      },
      {
        stage: 3,
        std: ["GUM:G:action-verbs:R"],
        sentence: {
          words: [
            "The",
            "muddy",
            "shoes",
            "rested",
            "beside",
            "the",
            "back",
            "door",
            "all",
            "afternoon.",
          ],
        },
        question: "Which word tells what happened?",
        choices: [
          {
            text: "shoes",
            feedback:
              "shoes names the things we are talking about. It ends in -s, but an ending is only a clue. Look again for the word that tells what the shoes did.",
          },
          {
            text: "muddy",
            feedback:
              "muddy tells what kind of shoes they are. It describes the shoes. Look again for the word that tells what happened.",
          },
          {
            text: "rested",
            correct: true,
            feedback:
              "Nice thinking! rested is the verb because it tells what the shoes did.",
          },
          {
            text: "afternoon",
            feedback:
              "afternoon tells when this happened. Look again for the word that tells what happened.",
          },
        ],
        clue: "Remember: ask yourself, What happened?",
        reveal:
          "Let's find it together. rested tells what the shoes did, so rested is the verb.",
      },
      {
        stage: 3,
        std: ["GUM:G:helping-linking-verbs:I"],
        sentence: {
          words: [
            "Those",
            "tall",
            "glass",
            "buildings",
            "are",
            "visible",
            "from",
            "the",
            "new",
            "highway.",
          ],
        },
        question: "Which word is the verb in this sentence?",
        choices: [
          {
            text: "tall",
            feedback:
              "tall tells what kind of buildings they are. It describes the buildings. Look again for the word that tells what the buildings are.",
          },
          {
            text: "buildings",
            feedback:
              "buildings names the things we are talking about. It ends in -s, but an ending is only a clue. Look again for the word that tells what the buildings are.",
          },
          {
            text: "are",
            correct: true,
            feedback:
              "Nice thinking! are is the verb because it tells what the buildings are.",
          },
          {
            text: "highway",
            feedback:
              "highway names a place. Look again for the word that tells what the buildings are.",
          },
        ],
        clue: "Remember: a verb can also tell what someone or something is.",
        reveal:
          "Let's find it together. are tells what the buildings are, so are is the verb.",
      },
      {
        stage: 3,
        std: ["GUM:G:helping-linking-verbs:I"],
        sentence: {
          words: [
            "I",
            "am",
            "always",
            "ready",
            "for",
            "the",
            "spelling",
            "test",
            "on",
            "Friday",
            "morning.",
          ],
        },
        question: "Which word is the verb in this sentence?",
        choices: [
          {
            text: "ready",
            feedback:
              "ready tells how I feel about the test. It describes me. Look again for the word that tells what I am.",
          },
          {
            text: "am",
            correct: true,
            feedback:
              "Nice thinking! am is the verb because it tells what I am.",
          },
          {
            text: "spelling",
            feedback:
              "spelling tells what kind of test it is. It ends in -ing, but an ending is only a clue. Look again for the word that tells what I am.",
          },
          {
            text: "test",
            feedback:
              "test names the thing on Friday. Look again for the word that tells what I am.",
          },
        ],
        clue: "Remember: a verb can also tell what someone or something is.",
        reveal:
          "Let's find it together. am tells what I am, so am is the verb.",
      },
      {
        stage: 3,
        std: ["GUM:G:action-verbs:R"],
        sentence: {
          words: [
            "During",
            "family",
            "reading",
            "night,",
            "our",
            "library",
            "welcomed",
            "many",
            "new",
            "visitors.",
          ],
        },
        question: "Which word tells what happened?",
        choices: [
          {
            text: "reading",
            feedback:
              "reading tells what kind of night it was. It ends in -ing, but an ending is only a clue. Look again for the word that tells what happened.",
          },
          {
            text: "library",
            feedback:
              "library names who did the welcoming. Look again for the word that tells what the library did.",
          },
          {
            text: "welcomed",
            correct: true,
            feedback:
              "Nice thinking! welcomed is the verb because it tells what the library did.",
          },
          {
            text: "visitors",
            feedback:
              "visitors names the people who came. It ends in -s, but an ending is only a clue. Look again for the word that tells what happened.",
          },
        ],
        clue: "Remember: ask yourself, What happened?",
        reveal:
          "Let's find it together. welcomed tells what the library did, so welcomed is the verb.",
      },
    ],
  };
})(typeof window === "undefined" ? globalThis : window);
