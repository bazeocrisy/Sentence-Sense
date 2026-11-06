/* =========================================================
   Sentence Sense — WRITE A STRONG SENTENCE content (Build 1.9.0)

   Every word a child reads in the writing activity lives here, the same
   way every Learn/Practice word lives in learn-content.js.

   THE RULES THIS CONTENT FOLLOWS
     - Prompts are concrete and familiar. A third grader should be able to
       picture the idea before writing a word.
     - The worked EXAMPLE in each help ladder is deliberately about a
       DIFFERENT topic from its prompt, so Help never writes the child's
       sentence for them.
     - Frames have blanks. They show a shape, not an answer.
     - No check here grades the sentence. The app asks questions; the child
       (and a grown-up) decide. See write.js "WHAT THE APP CAN AND CANNOT
       CHECK".
     - A detail is optional. Not every strong sentence needs an adjective
       or an adverb, and longer is not always better.
   ========================================================= */

window.SS_WRITE_CONTENT = {

  name: "Write a Strong Sentence",

  /* ---------------- The prompts ---------------- */
  prompts: [
    {
      id: "animal",
      title: "An animal doing something",
      line: "A pet, a zoo animal, or one you saw outside.",
      ask: "Write one sentence about an animal doing something.",
      question: "What animal are you thinking of? What is it doing?",
      starters: ["My dog", "The little bird", "A squirrel in our yard"],
      words: {
        "Who or what": ["dog", "cat", "puppy", "bird", "squirrel", "hamster", "turtle"],
        "What it did": ["chased", "jumped", "slept", "hid", "dug", "splashed", "climbed"],
        "Details": ["under the bed", "in the mud", "all morning", "quickly", "fluffy", "tiny"]
      },
      /* Different topic on purpose: weather, not animals. */
      example: { words: ["The", "cold", "wind", "pushed", "the", "leaves", "across", "the", "yard."], split: { at: 3, leftLabel: "WHO OR WHAT", rightLabel: "WHAT HAPPENS" } },
      frame: "The ____ ____ in the ____."
    },
    {
      id: "weather",
      title: "A rainy, snowy, or windy day",
      line: "What happened when the weather changed?",
      ask: "Write one sentence about a day with interesting weather.",
      question: "What was the weather like? What did you or someone else do?",
      starters: ["The rain", "Last winter, the snow", "On a windy day, my sister"],
      words: {
        "Who or what": ["rain", "snow", "wind", "thunder", "my family", "puddles"],
        "What happened": ["poured", "fell", "howled", "rumbled", "stayed inside", "splashed"],
        "Details": ["all night", "on the roof", "loudly", "icy", "after school", "gray"]
      },
      /* Different topic: a kitchen, not weather. */
      example: { words: ["My", "uncle", "baked", "warm", "bread", "for", "breakfast."], split: { at: 2, leftLabel: "WHO OR WHAT", rightLabel: "WHAT HAPPENS" } },
      frame: "The ____ ____ all ____."
    },
    {
      id: "play",
      title: "Something fun at recess or the park",
      line: "A game, a climb, a race, or a friend.",
      ask: "Write one sentence about something fun at recess or the park.",
      question: "Who was there? What did you do?",
      starters: ["At recess, my friends and I", "My best friend", "We"],
      words: {
        "Who or what": ["my friends", "I", "we", "my class", "the team", "my cousin"],
        "What we did": ["raced", "climbed", "played tag", "kicked", "built", "laughed"],
        "Details": ["on the slide", "after lunch", "as fast as we could", "muddy", "together"]
      },
      /* Different topic: a library, not play. */
      example: { words: ["The", "librarian", "read", "a", "spooky", "story", "to", "our", "class."], split: { at: 2, leftLabel: "WHO OR WHAT", rightLabel: "WHAT HAPPENS" } },
      frame: "At recess, ____ ____."
    },
    {
      id: "food",
      title: "A food you love",
      line: "How does it look, smell, or taste?",
      ask: "Write one sentence about a food you love.",
      question: "What food is it? What is it like, or what happens when you eat it?",
      starters: ["Pizza", "My grandma's soup", "Cold watermelon"],
      words: {
        "Who or what": ["pizza", "tacos", "pancakes", "soup", "apples", "my sandwich"],
        "What it is or does": ["is", "tastes", "smells", "crunches", "melts", "warms me up"],
        "Details": ["cheesy", "sweet", "spicy", "on Saturday", "crunchy", "with syrup"]
      },
      /* Different topic: a toy, not food. */
      example: { words: ["My", "new", "kite", "is", "bright", "orange."], split: { at: 3, leftLabel: "WHO OR WHAT", rightLabel: "WHAT IS SAID ABOUT IT" } },
      frame: "____ tastes ____."
    },
    {
      id: "helper",
      title: "Someone who helps",
      line: "A family member, a teacher, a coach, or a neighbor.",
      ask: "Write one sentence about someone who helps you or others.",
      question: "Who helps? What do they do to help?",
      starters: ["My mom", "Our bus driver", "Coach Rivera"],
      words: {
        "Who": ["my mom", "my dad", "my teacher", "our coach", "my neighbor", "the nurse"],
        "What they do": ["helps", "teaches", "fixes", "drives", "cooks", "cheers"],
        "Details": ["every morning", "with my homework", "patiently", "kind", "at school"]
      },
      /* Different topic: an animal, not a person. */
      example: { words: ["A", "busy", "beaver", "built", "a", "dam", "in", "the", "creek."], split: { at: 3, leftLabel: "WHO OR WHAT", rightLabel: "WHAT HAPPENS" } },
      frame: "____ helps me ____."
    },
    {
      id: "own",
      title: "My own idea",
      line: "Write about anything you want.",
      ask: "Write one sentence about your own idea.",
      question: "What are you thinking about? Who or what is it about, and what happens?",
      starters: ["Yesterday, I", "My favorite", "One day,"],
      words: {
        "Who or what": ["I", "my family", "my friend", "a robot", "the moon", "my bike"],
        "What happened": ["found", "made", "saw", "wanted", "visited", "won"],
        "Details": ["last weekend", "in the garden", "slowly", "shiny", "after dinner"]
      },
      example: { words: ["The", "tiny", "seed", "grew", "into", "a", "tall", "sunflower."], split: { at: 3, leftLabel: "WHO OR WHAT", rightLabel: "WHAT HAPPENS" } },
      frame: "____ ____ ____."
    }
  ],

  /* ---------------- The help ladder (draft step) ----------------
     One rung at a time. The prompt's own question is rung 1. */
  ladder: {
    label: ["A question", "A strategy", "An example", "A sentence frame"],
    strategy: "Try this: say your sentence out loud first. Start with WHO or WHAT. Then say what they DO or what they ARE. You can use the word bank below.",
    exampleIntro: "Here is a sentence about something else. See its two parts?",
    frameIntro: "Here is a sentence shape. Fill the blanks with your own words.",
    frameButton: "Put this frame in my writing",
    frameNote: "Your own words stay. The frame goes at the end."
  },

  /* ---------------- The check steps ---------------- */
  steps: {
    draft: {
      title: "Write your sentence",
      sayTip: "Say it first. Tell your idea out loud to yourself or a grown-up. Then write it.",
      label: "My sentence",
      emptyNudge: "Write your idea first. A few words is a good start. You can use Help me or the word bank.",
      primary: "This is my first draft"
    },
    who: {
      title: "Who or what is it about?",
      ask: "Tap the word or words that tell who or what your sentence is about.",
      command: "It's a command (the subject is you)",
      commandNote: "Good thinking. A sentence that tells someone to do something, like “Look at that cloud!”, is complete. Its subject is you, even though you don't see it.",
      missing: "My sentence doesn't say yet",
      missingTip: "Add who or what your sentence is about. For example, “ran to the fence” becomes “The goat ran to the fence.”",
      nudge: "Tap the words first, or press Next again if you're not sure.",
      example: { words: ["My", "little", "brother", "found", "a", "shiny", "rock."], marks: [{ start: 0, end: 2, kind: "subject", label: "WHO?" }] },
      exampleLine: "Who found a shiny rock? My little brother. Those words tell who the sentence is about."
    },
    what: {
      title: "What happens?",
      ask: "Tap the words that tell what happens, or what your sentence says about {who}.",
      askNoWho: "Tap the words that tell what happens, or what your sentence says.",
      sense: "Does your sentence make sense all by itself?",
      senseYes: "Yes, it makes sense",
      senseNo: "Not yet, I'll fix it",
      senseNoTip: "Read it out loud. Is a part missing? You can change your sentence in the box.",
      nudge: "Tap the words first, or press Next again if you're not sure.",
      example: { words: ["The", "kitten", "chased", "a", "ball", "of", "yarn."], marks: [{ start: 2, end: 6, kind: "verb", label: "WHAT HAPPENS" }] },
      exampleLine: "What does the kitten do? It chased a ball of yarn. Those words tell what happens."
    },
    detail: {
      title: "Can a reader picture it?",
      ask: "You can add one detail if it helps. Or keep it the way it is.",
      options: [
        { key: "where", label: "Add where", tip: "Where did it happen? Words like “at the park” or “under the table.”" },
        { key: "when", label: "Add when", tip: "When did it happen? Words like “after school” or “last night.”" },
        { key: "how", label: "Add how", tip: "How did it happen? Words like “slowly” or “with a big splash.”" },
        { key: "kind", label: "Add what kind", tip: "What kind? Words like “muddy,” “tiny,” or “striped.”" },
        { key: "enough", label: "It already has enough detail", tip: "That's a real writer's choice. A short, clear sentence can be strong." }
      ],
      example: { from: "The bus stopped.", to: "The yellow bus stopped at the corner." },
      exampleLine: "See how the details help you picture it? The new words tell what kind and where."
    },
    marks: {
      title: "Check the capital and the end mark",
      ask: "Look at the beginning and the end of your sentence.",
      lookTitle: "Things to look at",
      honest: "The app can only notice a few marks. It can't tell if your sentence is right. You and a grown-up decide that.",
      nothing: "The app didn't notice anything to look at. Read it once more yourself.",
      looks: {
        firstLetter: "Look at the first letter. Should it be a capital letter?",
        ending: "Look at the end. Does your sentence need a period (.), a question mark (?), or an exclamation point (!)?",
        wordI: "Look at the word i. When it means you, it is always a capital: I.",
        blanks: "Your sentence still has a blank (____). Fill it with your own words.",
        many: "It looks like you wrote more than one sentence. That's okay! Check the start and end of each one."
      },
      checks: [
        { key: "capital", label: "My sentence starts with a capital letter." },
        { key: "ending", label: "It ends with . ? or !" },
        { key: "names", label: "Names of people and places start with a capital letter (or there aren't any)." }
      ]
    },
    read: {
      title: "Read it one more time",
      ask: "Read your sentence out loud. Does it say what you mean?",
      primary: "I'm finished"
    }
  },

  editLabel: "Change my sentence",
  editHint: "Your first draft is saved. Changes go into your new version.",

  /* ---------------- The learning path (Home) ----------------
     A suggested order, not a rule. Each step points at what already
     exists. "write" is the new activity. */
  path: [
    { title: "Nouns and verbs", skills: ["noun", "verb"] },
    { title: "Subjects and complete sentences", skills: ["subject", "complete-sentence"] },
    { title: "Write a strong sentence", write: true, note: "Includes checking capital letters and end marks." },
    { title: "Useful adjectives and adverbs", skills: ["adjective", "adverb"] },
    { title: "Subject-verb agreement", skills: ["agreement"] },
    { title: "Verb tense", skills: ["verb-tense", "helping-linking"] },
    { title: "Pronouns that are clear", skills: ["pronoun"] },
    { title: "Expand and combine sentences", soon: true },
    { title: "Write a short paragraph", soon: true }
  ]
};
