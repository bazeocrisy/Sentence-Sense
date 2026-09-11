/* =========================================================
   Sentence Sense — VERB MISSION CONTENT  (Build 1.3.0)
   "Sentence Detectives" — the illustrated Verb prototype.

   THIS FILE HOLDS EDUCATIONAL CONTENT ONLY. No rendering, no
   navigation, no logic. Every word a child reads in the mission is
   here, so the grammar can be audited on its own — exactly as
   js/data/learn-content.js does for the six original lessons.

   ---------------------------------------------------------
   SENTENCE COMPLEXITY — WHAT THIS FILE IS AND IS NOT DOING
   ---------------------------------------------------------
   The INTERFACE is simplified. The SENTENCES are not. These target
   middle-to-upper third grade: descriptive adjectives, varied
   openings (several begin with a prepositional phrase), varied
   length, and settings a third grader cares about — soccer, a
   stream, a puppy, a science bench, a swim meet, an empty hallway.

   No reading level or Lexile measure is claimed for these sentences.
   They have not been measured by any instrument. "Middle-to-upper
   third grade" is the authoring target, not a certified result.

   Every target is a real grammatical judgement the child can only
   make by READING. The illustration shows the situation; it can
   never show WHICH WORD in the sentence is the verb, so no activity
   here can be passed from the picture alone.

   ---------------------------------------------------------
   TARGET POSITION IS DELIBERATELY VARIED
   ---------------------------------------------------------
   Build 1.2.7 closed D-29: a child had been able to clear the old
   20-question bank by always pressing the third button, because the
   answer sat in position 3 in 16 of 20 questions. The same hazard
   exists here in a different shape — if the verb were always the
   fourth WORD, "press the fourth word" would beat the lesson.

   Verb index by card: 3 · 6 · 3 · 7 · 3 · 7 · [3,4] · [5,6]
   Do not add a card whose target index repeats the run.

   ---------------------------------------------------------
   SCHEMA
   ---------------------------------------------------------
     words    : the sentence as an array, ending punctuation attached
                to the final word. One source of truth — the plain
                pass and the marked pass both render from this array,
                so they cannot drift apart (handoff section 6).
     target   : array of word indexes that make the complete verb.
                One index for a single verb, two for a verb phrase.
     notes    : index-aligned with `words`. notes[i] is what the child
                is told when they choose word i. The entry at a target
                index is the CORRECT-answer teaching.
                EEF: feedback matters most when the answer is RIGHT,
                so a correct pick explains rather than only praising.
     verbType : "action" | "being" | "phrase"
     clue     : second-attempt reminder. Strategy, never the answer.
     model    : third-attempt worked reasoning. Ends the guessing.
     audit    : the teaching record required by the brief — objective,
                answer, why, verb type, likely errors. Shown to no
                child; it exists so a reviewer can check the intent
                against the wording without reverse-engineering it.
   ========================================================= */

window.SS_MISSION_VERB = {

  topicKey: "verb",
  missionName: "Sentence Detectives",
  caseName: "The Case of the Missing Verb",

  /* Shown once, on the opening card. Two sentences, not a paragraph. */
  briefing: {
    coach: "I am Detective Pencil. Every sentence hides one important word.",
    line: "The verb is the word that tells what happens. Find the verb and the whole sentence opens up.",
    start: "Open the case file"
  },

  /* The rail. Five stops, each a real teaching move, each named with a
     verb a child can act on. */
  rail: [
    { key: "watch",   label: "Watch" },
    { key: "find",    label: "Find" },
    { key: "explore", label: "Explore" },
    { key: "solve",   label: "Solve" },
    { key: "extend",  label: "Extend" }
  ],

  /* =====================================================
     A. WATCH — explicit demonstration.
     IES Recommendation 2 (Moderate evidence): interleave worked
     examples with practice. This is the worked example, and the child
     is NOT asked to guess before any instruction has happened.
     ===================================================== */
  watch: {
    phase: "watch",
    kind: "reveal",
    stepTitle: "Watch me work",
    objectiveLine: "First, watch how a detective finds the verb.",
    coachBefore: "Read the sentence with me. Something happened here.",
    words: ["The", "determined", "player", "kicked", "the", "muddy", "ball", "across", "the", "field."],
    target: [3],
    verbType: "action",
    scene: "soccer-kick",
    /* Describes the situation without naming the verb, so a screen
       reader user is not handed the answer before the reveal. */
    sceneAlt: "A soccer player on a green field swings one leg toward a mud-spattered ball, with a goal net behind it.",
    action: "Show me the verb.",
    markLabel: "VERB",
    coachAfter: "There it is.",
    explain: "Kicked tells what the player did.",
    because: "You can picture it happening, so kicked is an action verb.",
    replay: "Play it again",
    next: "I am ready to try one",
    audit: {
      objective: "Model the strategy: read the sentence, ask what happened, name the action verb.",
      answer: "kicked",
      why: "kicked states the action the subject performed; it is the only word in the sentence that reports an event.",
      verbType: "action verb (simple past)",
      likelyErrors: "None — nothing is asked of the child on this card. The reveal is demonstrated, not tested, which is the point of a worked example."
    }
  },

  /* =====================================================
     B. FIND — guided practice, two sentences.
     Feedback is task-focused and tells the child what the chosen word
     actually does, then where to look instead (EEF: feedback should
     give specific information on how to improve, and target the task
     and strategy rather than the person).
     ===================================================== */
  find: [
    {
      phase: "find",
      kind: "pick",
      stepTitle: "Your turn to find it",
      objectiveLine: "Find the word that tells what happened.",
      coachBefore: "New sentence. Read it all the way to the end first.",
      words: ["Beside", "the", "stream,", "several", "curious", "students", "examined", "the", "colorful", "rocks."],
      target: [6],
      verbType: "action",
      scene: "rocks-examine",
      sceneAlt: "Two students crouch at the edge of a shallow stream. One holds a magnifying glass above a pile of colorful rocks; the other points at one of them.",
      prompt: "Click the word that tells what the students did.",
      notes: [
        "Beside tells WHERE the students are. A place word does not tell what happened.",
        "the is a small word that points to a noun. It never tells what happened.",
        "stream names a place. Look for the word that tells what the students did.",
        "several tells HOW MANY students there are. It does not tell what they did.",
        "curious tells what KIND of students they are. It describes them.",
        "students names WHO did something. Now find the word that tells what they did.",
        "Yes. Examined tells what the students did — they looked at the rocks closely.",
        "the is a small word that points to a noun. It never tells what happened.",
        "colorful tells what the rocks look like. It describes the rocks.",
        "rocks names the things the students looked at. Look for the word that tells what they did."
      ],
      clue: "Ask yourself: what did the students DO?",
      model: "Let's find it together. The students did something to the rocks — they examined them. So examined is the verb.",
      correctNext: "Next sentence",
      audit: {
        objective: "Guided practice on an action verb in a sentence that opens with a prepositional phrase, so the verb is not simply the fourth word.",
        answer: "examined",
        why: "examined reports what the subject (students) did; every other word names, describes, counts or locates.",
        verbType: "action verb (simple past)",
        likelyErrors: "students (confusing who acts with the action); curious (adjective next to the subject); rocks (the object of the action); Beside (sentence-initial word mistaken for the start of the core idea)."
      }
    },
    {
      phase: "find",
      kind: "pick",
      stepTitle: "One more to find",
      objectiveLine: "Find the word that tells what happened.",
      coachBefore: "This one is about an animal. Same question, new sentence.",
      words: ["The", "curious", "puppy", "discovered", "a", "muddy", "ball", "under", "the", "wooden", "porch."],
      target: [3],
      verbType: "action",
      scene: "dog-porch",
      sceneAlt: "A small brown puppy lowers its head toward the shadowy gap beneath a wooden porch, where a mud-spattered ball sits.",
      prompt: "Click the word that tells what the puppy did.",
      notes: [
        "The is a small word that points to a noun. It never tells what happened.",
        "curious tells what KIND of puppy it is. It describes the puppy.",
        "puppy names WHO did something. Now find the word that tells what the puppy did.",
        "Yes. Discovered tells what the puppy did — it found something that was hidden.",
        "a is a small word that points to a noun. It never tells what happened.",
        "muddy tells what the ball looks like. It describes the ball.",
        "ball names the thing the puppy found. Look for the word that tells what the puppy did.",
        "under tells WHERE the ball was. A place word does not tell what happened.",
        "the is a small word that points to a noun. It never tells what happened.",
        "wooden tells what the porch is made of. It describes the porch.",
        "porch names a place. Look for the word that tells what the puppy did."
      ],
      clue: "Ask yourself: what did the puppy DO?",
      model: "Let's find it together. The puppy did something — it discovered the ball. So discovered is the verb.",
      correctNext: "Show me something interesting",
      audit: {
        objective: "Second guided repetition in a different setting, with the verb back in the ordinary subject-verb position so position is not a reliable cue in either direction.",
        answer: "discovered",
        why: "discovered reports the puppy's action; ball is what was acted upon, not the action.",
        verbType: "action verb (simple past)",
        likelyErrors: "puppy (actor for action); ball (object for action); muddy or curious (vivid adjectives attract attention); under (place word)."
      }
    }
  ],

  /* =====================================================
     C. EXPLORE — change the verb, change the meaning.
     NOT a question. There is no wrong choice here and the engine
     records no result. Both verbs are grammatical and both get a real
     explanation, because the teaching point is cause and effect:
     the verb decides what happens.

     Takacs, Swart & Bus (2015) found multimedia that illustrates the
     text helps, while interactive extras that sit beside the text
     distract. The picture swap is therefore tied directly to the word
     the child changed — it is the explanation, not a reward.
     ===================================================== */
  explore: [
    {
      phase: "explore",
      kind: "swap",
      stepTitle: "Change the verb",
      objectiveLine: "See what the verb controls.",
      coachBefore: "You already found the verb in this sentence. Now watch what happens when we change it.",
      words: ["Beside", "the", "stream,", "several", "curious", "students", "____", "the", "colorful", "rocks."],
      slot: 6,
      prompt: "Try one verb, then try the other.",
      options: [
        {
          word: "examined",
          scene: "rocks-examine",
          sceneAlt: "Two students crouch at the stream, studying a pile of colorful rocks through a magnifying glass. The rocks stay where they are.",
          explain: "Now the students are studying the rocks closely. The rocks stay right where they are."
        },
        {
          word: "collected",
          scene: "rocks-collect",
          sceneAlt: "The same two students at the stream are putting the colorful rocks into a red bucket. Fewer rocks remain on the ground.",
          explain: "Now the students are gathering the rocks up and taking them along. Most of the rocks are in the bucket."
        }
      ],
      closing: "Same students. Same rocks. One word changed, and a different thing happened.",
      next: "Try another one"
    },
    {
      phase: "explore",
      kind: "swap",
      stepTitle: "Change it again",
      objectiveLine: "See what the verb controls.",
      coachBefore: "One more. Both of these verbs fit the sentence perfectly.",
      words: ["The", "young", "scientist", "____", "the", "cool", "water", "very", "carefully."],
      slot: 3,
      prompt: "Try one verb, then try the other.",
      options: [
        {
          word: "measured",
          scene: "water-measure",
          sceneAlt: "A young scientist in safety goggles points at the marked line on a container that is half full of water, reading the level.",
          explain: "Now the scientist is finding out how much water there is. The water stays in the container."
        },
        {
          word: "poured",
          scene: "water-pour",
          sceneAlt: "The same scientist tips a jug so water falls into a bowl. The marked container beside it is nearly empty now.",
          explain: "Now the water is moving out of the container and into the bowl. The container is almost empty."
        }
      ],
      closing: "The verb is the word that decides what happens. Change the verb and you change the whole picture.",
      next: "I can do one on my own"
    }
  ],

  /* =====================================================
     D. SOLVE — independent transfer.
     NO illustration. Nothing is pre-marked. Then a deep explanatory
     question: IES Recommendation 7 carries STRONG evidence for
     prompts that make the learner explain, rather than only recall.
     ===================================================== */
  solve: {
    phase: "solve",
    kind: "pick",
    stepTitle: "Solve it yourself",
    objectiveLine: "No picture this time. Just you and the sentence.",
    coachBefore: "A real detective can do it with words alone. No picture for this one.",
    words: ["During", "the", "final", "minute,", "the", "determined", "goalie", "blocked", "a", "powerful", "shot."],
    target: [7],
    verbType: "action",
    scene: null,
    prompt: "Read the sentence and click the verb.",
    notes: [
      "During tells WHEN this happened. A time word does not tell what happened.",
      "the is a small word that points to a noun. It never tells what happened.",
      "final tells WHICH minute it was. It describes the minute.",
      "minute names a piece of time. Look for the word that tells what someone did.",
      "the is a small word that points to a noun. It never tells what happened.",
      "determined tells what KIND of goalie it is. It describes the goalie.",
      "goalie names WHO did something. Now find the word that tells what the goalie did.",
      "Yes. Blocked tells what the goalie did — the goalie stopped the shot.",
      "a is a small word that points to a noun. It never tells what happened.",
      "powerful tells what KIND of shot it was. It describes the shot.",
      "shot names the thing the goalie stopped. Look for the word that tells what the goalie did."
    ],
    clue: "Ask yourself: what did someone DO in this sentence?",
    model: "Let's find it together. The goalie did something to the shot — the goalie blocked it. So blocked is the verb.",
    /* The explanatory question. It runs only after the verb is found,
       so the sentence is marked by then and nothing leaks early. */
    why: {
      prompt: "Now prove it. Why is blocked the verb?",
      choices: [
        {
          text: "It tells what the goalie did.",
          correct: true,
          feedback: "That is exactly the reason. A verb tells what someone or something does."
        },
        {
          text: "It tells what kind of shot it was.",
          feedback: "That would be a describing word. Powerful tells what kind of shot it was. Blocked tells what happened."
        },
        {
          text: "It names a person in the sentence.",
          feedback: "That would be a naming word. Goalie names who did it. Blocked tells what the goalie did."
        },
        {
          text: "It tells when the shot happened.",
          feedback: "That would be a time word. During the final minute tells when. Blocked tells what happened."
        }
      ]
    },
    next: "There is one more thing to learn",
    audit: {
      objective: "Independent transfer with no picture and no pre-marking, followed by a required explanation of the reasoning.",
      answer: "blocked",
      why: "blocked reports the goalie's action. The explanatory follow-up forces the child to state the criterion rather than recognise a pattern.",
      verbType: "action verb (simple past)",
      likelyErrors: "goalie (actor for action); shot (object for action); powerful or determined (strong adjectives); During or minute (the time phrase, which a child may read as the main event)."
    }
  },

  /* =====================================================
     E. EXTEND — verbs that show no movement.
     Four short segments, each holding ONE idea, in model -> practice
     pairs. The worked examples are illustrated; the independent
     questions are not, which is the same no-leakage rule as SOLVE.

     The brief's rule is honoured literally: the verb phrase is TAUGHT
     in E3 and only then assessed in E4, and E4 asks for BOTH words
     explicitly. The child is never asked for "the verb" when the
     expected answer is two words.
     ===================================================== */
  extend: [
    /* ---- E1: modelled being verb ---- */
    {
      phase: "extend",
      kind: "reveal",
      segment: "Being verbs",
      stepTitle: "A verb with no action",
      objectiveLine: "Not every verb shows movement.",
      coachBefore: "Look carefully. Nobody in this sentence is running, throwing or jumping. There is still a verb.",
      words: ["Our", "exhausted", "teammates", "were", "proud", "of", "their", "effort", "after", "practice."],
      target: [3],
      verbType: "being",
      scene: "team-proud",
      sceneAlt: "Three tired teammates in purple kit stand still together with their arms over each other's shoulders, beside a bench and two water bottles.",
      action: "Show me this verb.",
      markLabel: "BEING VERB",
      coachAfter: "Here is the one you could not see happening.",
      explain: "Were does not show an action. It tells what the teammates were — proud.",
      because: "A verb like this is called a being verb. The being verbs are: am, is, are, was, were.",
      next: "Let me try a being verb",
      audit: {
        objective: "Teach explicitly that verbs are not only physical movement, using a scene that deliberately shows a STATE rather than an action.",
        answer: "were",
        why: "were links the subject to the predicate adjective proud; it reports a state of being, not an event.",
        verbType: "being verb (linking)",
        likelyErrors: "None assessed on this card — it is a worked example. proud is the word most likely to be mistaken for the verb, which is why the explanation names it directly.",
        note: "proud has no participle form, so were proud cannot be misread as a passive verb phrase. This follows the being-verb rule recorded in handoff section 5b, which exists because Build 1.2.5 shipped was crowded and had to be corrected in 1.2.6."
      }
    },
    /* ---- E2: independent being verb ---- */
    {
      phase: "extend",
      kind: "pick",
      segment: "Being verbs",
      stepTitle: "Find the being verb",
      objectiveLine: "Find the verb that tells what something was.",
      coachBefore: "No picture. A being verb is not something you can see happening anyway.",
      words: ["After", "the", "final", "bell,", "the", "long", "hallway", "was", "empty."],
      target: [7],
      verbType: "being",
      scene: null,
      prompt: "This sentence has a being verb. Click it.",
      notes: [
        "After tells WHEN this happened. A time word is not the verb.",
        "the is a small word that points to a noun. It never tells what happened.",
        "final tells WHICH bell it was. It describes the bell.",
        "bell names a thing. Look for the word that tells what the hallway was.",
        "the is a small word that points to a noun. It never tells what happened.",
        "long tells what KIND of hallway it is. It describes the hallway.",
        "hallway names a place. Now find the word that tells what the hallway was.",
        "Yes. Was is the being verb. It tells what the hallway was — empty.",
        "empty tells how the hallway looked. It describes the hallway. The verb is the word right before it."
      ],
      clue: "A being verb tells what someone or something IS or WAS. Look for am, is, are, was or were.",
      model: "Let's find it together. The hallway was empty. Was tells what the hallway was, so was is the being verb.",
      correctNext: "Show me the last kind",
      audit: {
        objective: "Independent practice on a being verb, unillustrated, with the strongest distractor (the predicate adjective) adjacent to the answer.",
        answer: "was",
        why: "was links the subject hallway to the predicate adjective empty. empty describes; was is the verb.",
        verbType: "being verb (linking)",
        likelyErrors: "empty is the dominant error and sits right beside the answer; its feedback points back one word on purpose. hallway (subject for verb); After or bell (the time phrase).",
        note: "empty has no participle form, so was empty has only the linking reading."
      }
    },
    /* ---- E3: modelled verb phrase ---- */
    {
      phase: "extend",
      kind: "reveal",
      segment: "Verb phrases",
      stepTitle: "When the verb is two words",
      objectiveLine: "Sometimes the verb needs a helper.",
      coachBefore: "Here is the last kind. This time the verb is not one word.",
      words: ["The", "young", "scientist", "is", "measuring", "the", "water", "inside", "the", "glass", "container."],
      target: [3, 4],
      verbType: "phrase",
      scene: "water-measure",
      sceneAlt: "A young scientist in safety goggles points at the marked line on a half-full container, reading how much water is inside it.",
      action: "Show me the whole verb.",
      markLabel: "VERB PHRASE",
      coachAfter: "Both words together. Not just one of them.",
      explain: "Is measuring is the whole verb. Measuring tells the action, and is helps it.",
      because: "Two words working as one verb are called a verb phrase. When a sentence has a verb phrase, the whole phrase is the verb.",
      next: "Let me try a verb phrase",
      audit: {
        objective: "Teach the verb phrase BEFORE any question asks for one, so the child is never asked ambiguously for the verb when the answer is two words. This card is the reason E4 is fair.",
        answer: "is measuring",
        why: "is is the helping (auxiliary) verb and measuring is the main verb; together they form the present progressive. Neither word alone is the complete verb.",
        verbType: "verb phrase (helping verb + main verb)",
        likelyErrors: "None assessed. The predictable misconception — that measuring alone is the verb — is named and corrected in the explanation instead of being tested first."
      }
    },
    /* ---- E4: independent verb phrase, two words required ---- */
    {
      phase: "extend",
      kind: "pick",
      segment: "Verb phrases",
      stepTitle: "Find the whole verb phrase",
      objectiveLine: "Find both words that make the verb.",
      coachBefore: "Last one. Remember, this verb is two words.",
      words: ["This", "week,", "the", "determined", "swimmers", "are", "training", "for", "the", "district", "meet."],
      target: [5, 6],
      verbType: "phrase",
      scene: null,
      /* The prompt states the count explicitly. Compare the rule in
         the brief: never ask for "the verb" when a phrase is wanted. */
      prompt: "This sentence has a verb phrase. Click BOTH words that make the complete verb.",
      pickCount: 2,
      partial: "Good — that word is part of the verb. One more word belongs with it.",
      notes: [
        "This points to the week. It is not the verb.",
        "week names a piece of time. It tells when, not what.",
        "the is a small word that points to a noun. It never tells what happened.",
        "determined tells what KIND of swimmers they are. It describes them.",
        "swimmers names WHO is doing something. Now find the two words that tell what they are doing.",
        "Yes — are is the helping verb. It works with the action word next to it.",
        "Yes — training tells the action. It needs its helping verb too.",
        "for tells who the training is for. It is not part of the verb.",
        "the is a small word that points to a noun. It never tells what happened.",
        "district tells WHICH meet it is. It describes the meet.",
        "meet names the event. Look for the two words that tell what the swimmers are doing."
      ],
      bothCorrect: "That is the whole verb phrase: are training. Are is the helping verb and training tells the action.",
      clue: "A helping verb sits just before the main verb. Look for am, is, are, was or were next to an action word.",
      model: "Let's find it together. Training tells the action. The word right before it is are, and are is helping. Together, are training is the verb phrase.",
      correctNext: "Close the case",
      audit: {
        objective: "Independent practice on a verb phrase, assessed only after E3 taught it, with the required number of words stated in the prompt.",
        answer: "are training (indexes 5 and 6; order of selection does not matter)",
        why: "are is the helping verb, training is the main verb; the complete verb is both words.",
        verbType: "verb phrase (helping verb + main verb)",
        likelyErrors: "Selecting training alone is the expected partial answer and is handled as progress, not as an error. swimmers (subject for verb); determined (adjective ending in -ed read as a past-tense verb); week (time word)."
      }
    }
  ],

  /* =====================================================
     COMPLETION — a learning recap, not a trophy.
     Finishing the mission is NOT evidence of mastery and the wording
     does not claim it is. The recap re-states the three kinds of verb,
     which is the retrieval opportunity (IES Recommendation 5), and
     the closing line points forward rather than declaring victory.
     ===================================================== */
  done: {
    mark: "🔎",
    title: "Case closed!",
    badge: "VERB DETECTIVE",
    lead: "Here is what you worked out.",
    recap: [
      "A verb tells what someone or something does or is.",
      "Action verbs show something happening: kicked, examined, discovered, blocked.",
      "Being verbs tell what something is: am, is, are, was, were.",
      "Sometimes two words work as one verb: is measuring, are training."
    ],
    /* Deliberately not "you have mastered verbs". */
    honest: "You worked through all five parts of this case. Detectives get sharper every time they read a new sentence, so come back and work it again.",
    guideBtn: "Open the Study Guide",
    againBtn: "Work the case again",
    topicsBtn: "All Topics",
    homeBtn: "Home"
  },

  /* Spoken aloud only on request, never automatically. The engine
     reads the plain sentence and nothing else, so read-aloud cannot
     announce a label, a mark or an answer. */
  readAloud: {
    label: "Hear the sentence",
    stopLabel: "Stop reading",
    unavailable: "Reading aloud is not available in this browser."
  },

  /* The short coaching lines the engine needs that are not tied to one
     card. Kept here so no child-facing wording lives in the engine. */
  ui: {
    tryAgain: "Have another look.",
    pickTwo: "Pick two words.",
    chosen: "chosen",
    marked: "READ IT",
    markedSee: "SEE HOW IT WORKS",
    replayHint: "You can play it again.",
    backBtn: "Back",
    objectiveWord: "Your job"
  }
};
