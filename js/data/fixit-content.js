/* =========================================================
   Sentence Sense — "Fix it" teaching sequence content (Build 1.9.1)

   ONE sample sequence, for owner review before any others are built:
     notice the problem -> explain what is missing -> model a repair ->
     a tempting wrong repair -> supported try -> a new writing prompt

   Rules this content follows:
     - Every example is a different sentence from the child's own writing.
     - The supported try accepts ANY repair that names who or what. The app
       never marks the child's repair right or wrong; it asks the child to
       check it, and a grown-up sees it in For grown-ups.
     - Nothing here claims mastery. Finishing means "you practiced".
   ========================================================= */
window.SS_FIXIT_CONTENT = {
  "complete-sentence": {
    id: "fix-who",
    title: "Fix it: Who is it about?",
    cardLine: "See how to fix a sentence",
    steps: ["Notice", "What's missing", "One way to fix it", "Careful!", "Your turn", "Write your own"],

    notice: {
      title: "What's wrong with this one?",
      sentence: { words: ["Jumped", "over", "the", "big", "puddle."] },
      ask: "Read it out loud. What do you want to know?",
      choices: [
        { text: "Who jumped?", correct: true,
          feedback: "Yes. The sentence tells what happened, but it never says who did it." },
        { text: "How big was the puddle?",
          feedback: "That could be a nice detail. But even if we knew, we still wouldn't know who jumped. Try again." },
        { text: "When did it happen?",
          feedback: "Knowing when could help a reader, but the sentence still wouldn't say who jumped. Try again." }
      ]
    },

    explain: {
      title: "What's missing?",
      lines: [
        "A sentence needs two parts: who or what it is about, and what happens.",
        "This one has what happens: Jumped over the big puddle.",
        "It is missing who. A group of words like this is called a fragment."
      ],
      sentence: { words: ["?", "Jumped", "over", "the", "big", "puddle."], split: { at: 1, leftLabel: "WHO OR WHAT", rightLabel: "WHAT HAPPENS" } }
    },

    model: {
      title: "One way to fix it",
      lead: "Add who at the start. Keep the part that tells what happens.",
      sentence: { words: ["My", "little", "sister", "jumped", "over", "the", "big", "puddle."], split: { at: 3, leftLabel: "WHO OR WHAT", rightLabel: "WHAT HAPPENS" } },
      capitalNote: "Look at jumped. It starts with a small j now, because it isn't the first word anymore.",
      othersTitle: "Other fixes work too:",
      others: ["The frog jumped over the big puddle.", "We jumped over the big puddle.", "Grandpa jumped over the big puddle."]
    },

    tempting: {
      title: "Careful! Does this fix it?",
      sentence: { words: ["Jumped", "over", "the", "big,", "muddy", "puddle", "after", "school."] },
      ask: "Does this fix the sentence?",
      choices: [
        { text: "Yes, it's fixed", correct: false,
          feedback: "Look again: who jumped? It added what kind of puddle and when, but still no who. More words didn't fix it." },
        { text: "No, it still doesn't say who", correct: true,
          feedback: "Right. It's longer, but it still doesn't say who jumped. Adding details doesn't add a who." }
      ]
    },

    try: {
      title: "Your turn",
      fragment: "Ate all the strawberries.",
      ask: "Fix this one by adding who. You choose who!",
      label: "My fixed sentence",
      ideasTitle: "Ideas for who (tap one to add it):",
      ideas: ["My brother", "A hungry bear", "We", "Grandma"],
      help: [
        "Ask yourself: who could eat strawberries? A person, an animal, or you and a friend?",
        "Remember the fix: My little sister jumped over the big puddle. Put your who before ate.",
        "Try this sentence shape: ____ ate all the strawberries. Put your own who in the blank."
      ],
      empty: "Write your fixed sentence first. Start with who.",
      checkAsk: "Check your fix: tap the words that tell who.",
      notes: {
        startsWithAte: "Look at the start. Is there a who before ate?",
        keptWhat: "This sentence was about eating strawberries. Did you keep a part that tells what happens? Changing it is okay if your sentence still says who and what happens."
      },
      honest: "The app can't tell if your fix is right. You check it, and a grown-up can look at it later.",
      primary: "I'm done fixing it"
    },

    write: {
      title: "Now write your own",
      lead: "You practiced fixing a sentence that didn't say who. Now write a new sentence of your own. Make sure it says who or what it's about.",
      promptId: "family",
      primary: "Write my own sentence",
      later: "Not now"
    }
  }
};
