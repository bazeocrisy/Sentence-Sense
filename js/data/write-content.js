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
        /* Build 1.9.1: every food here is ONE thing, so it agrees with
           "is", "tastes" and the frame "____ tastes ____." */
        "Who or what": ["pizza", "soup", "a taco", "my sandwich", "mac and cheese", "a crunchy apple"],
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

  /* ---------------- The steps ----------------
     Build 1.9.0 review pass: five screens (Pick, Write, Check, Revise,
     Compare). Every answer on Check is the CHILD'S judgment. The app
     records it and never says whether it is right. */
  steps: {
    draft: {
      title: "Write your sentence",
      sayTip: "Say it first. Tell your idea out loud to yourself or a grown-up. Then write it.",
      label: "My sentence",
      emptyNudge: "Write your idea first. A few words is a good start. You can use Help me or the word bank.",
      primary: "This is my first draft"
    },
    check: {
      title: "Check your sentence",
      whoAsk: "Who or what is it about? Tap those words.",
      command: "It's a command (the subject is you)",
      commandNote: "A sentence that tells someone to do something, like “Look at that cloud!”, is complete. Its subject is you, even though you don't see it.",
      missing: "It doesn't say yet",
      whatAsk: "What happens, or what does it tell about them? Tap those words.",
      sense: "Does your sentence make sense all by itself?",
      senseYes: "Yes",
      senseNo: "Not yet",
      nudge: "You can tap words or answer the question. Or press Next again to keep going.",
      example: { words: ["My", "little", "brother", "found", "a", "shiny", "rock."], split: { at: 3, leftLabel: "WHO OR WHAT", rightLabel: "WHAT HAPPENS" } },
      exampleLine: "Who or what? My little brother. What happens? found a shiny rock. Those are the words that tell what my little brother did."
    },
    revise: {
      title: "Revise if you want to",
      ask: "Read it out loud. Change anything you want, or keep it just the way it is.",
      fromCheck: {
        missing: "You said it doesn't say who or what yet. You can add that here. For example, “ran to the fence” becomes “The goat ran to the fence.” Need help? Pick “It doesn't say who or what” below.",
        notyet: "You said it doesn't make sense yet. Read it out loud and fix the part that sounds missing. Need help? Pick one of the choices below."
      },
      lookTitle: "Things to look at",
      honest: "The app only notices a few marks. It can't tell if your sentence is right. You and a grown-up decide that.",
      nothing: "The app didn't notice any marks to look at.",
      looks: {
        firstLetter: "Look at the first letter. Should it be a capital letter?",
        ending: "Look at the end. Does it need a period (.), a question mark (?), or an exclamation point (!)?",
        wordI: "Look at the word “i”. When it means you, it is a capital: I.",
        blanks: "There is still a blank (____). Fill it with your own words.",
        many: "It looks like you wrote more than one sentence. That's okay! Check the start and end of each one."
      },
      /* Build 1.9.1: purposeful revision, shown on examples that are NOT
         the child's sentence. Adding, cutting and keeping are all real
         revision choices. */
      waysTitle: "See how writers revise (examples)",
      ways: [
        { key: "add", title: "Add useful information", from: "The bus stopped.", to: "The yellow bus stopped at the corner.",
          why: "The new words tell which bus and where. Add words only when they help a reader picture it.",
          ideas: ["Where? Like “at the park.”", "When? Like “after school.”", "How? Like “slowly.”", "What kind? Like “muddy” or “tiny.”"] },
        { key: "cut", title: "Take out extra words", from: "My dog he is really really fast.", to: "My dog is really fast.",
          why: "“My dog” and “he” name the same dog, and “really really” says the same thing twice. Taking them out makes it clearer." },
        { key: "keep", title: "Keep it the same", from: "The kitten chased the yarn.", to: "The kitten chased the yarn.",
          why: "It says who and what happens, and it's clear. The writer read it again and kept it." }
      ],
      /* Build 1.9.1: help the CHILD chooses. Each one: what is missing, a
         repair on a different sentence, a tempting repair that doesn't
         work, and a next step for their own sentence. Nothing here changes
         the child's sentence. */
      fixTitle: "Need help fixing something? Pick one:",
      fixHelp: [
        { key: "who", label: "It doesn't say who or what",
          explain: "A sentence needs to say who or what it is about.",
          broken: "Ran to the fence.", fixed: "The goat ran to the fence.",
          tempting: "Ran to the fence very fast.",
          temptingWhy: "This adds more words, but it still doesn't say who ran. More words didn't fix it.",
          next: "Look at your sentence. Who or what did it? Add those words, usually at the start." },
        { key: "what", label: "It doesn't tell what happens",
          explain: "A sentence needs to tell what happens, or what someone or something is.",
          broken: "The tall giraffe by the fence.", fixed: "The tall giraffe by the fence ate leaves.",
          tempting: "The tall giraffe and the zebra by the fence.",
          temptingWhy: "This adds another animal, but it still doesn't say what they did.",
          next: "Ask: what did they do, or what are they? Add those words." },
        { key: "finish", label: "My thought isn't finished",
          explain: "Some word groups start a thought but don't finish it, often ones that begin with because, when, or if.",
          broken: "Because it was raining.", fixed: "We stayed inside because it was raining.",
          tempting: "Because it was raining all day long.",
          temptingWhy: "It's longer, but the thought still isn't finished. What happened because it was raining?",
          next: "Ask: what happened? Add that part before or after your words." }
      ],
      checksTitle: "Before you finish, you can check:",
      checks: [
        { key: "capital", label: "It starts with a capital letter." },
        { key: "ending", label: "It ends with . ? or !" },
        { key: "names", label: "Names of people and places start with a capital letter (or there aren't any)." }
      ],
      restore: "Go back to my first draft",
      restoreConfirm: "Put your first draft back in the box? Your changes on this screen will be replaced.",
      keep: "Keep it and finish",
      finish: "I'm finished",
      empty: "The box is empty. Write your sentence, or press “Go back to my first draft”."
    }
  },

  editLabel: "My sentence",
  editHint: "Your first draft is saved just as you wrote it. Changes here make your new version.",

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
