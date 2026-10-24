/* Deterministic question families. A form uses one item per context (26), plus
   3 rubric tasks. Form B uses constrained constructed responses instead of
   answer recognition. No random answer key or generated writing evaluation. */
(function (root) {
  "use strict";
  const C = root.SS_CURRICULUM;
  const list = (s) => s.split("|");
  const plural = list(
    "children|mice|feet|teeth|geese|men|women|people|oxen|sheep|deer|fish|children|mice|feet|teeth|geese|men|women|people|oxen|sheep|deer|fish|children|mice",
  );
  const singular = list(
    "child|mouse|foot|tooth|goose|man|woman|person|ox|sheep|deer|fish|child|mouse|foot|tooth|goose|man|woman|person|ox|sheep|deer|fish|child|mouse",
  );
  const past = list(
    "went|ran|swam|threw|caught|brought|bought|wrote|read|ate|drank|sang|saw|took|made|gave|found|slept|rode|flew|grew|broke|chose|drew|spoke|knew",
  );
  const present = list(
    "go|run|swim|throw|catch|bring|buy|write|read|eat|drink|sing|see|take|make|give|find|sleep|ride|fly|grow|break|choose|draw|speak|know",
  );
  const ideas = list(
    "courage|joy|hope|honesty|kindness|friendship|freedom|patience|pride|curiosity|trust|peace|courage|joy|hope|honesty|kindness|friendship|freedom|patience|pride|curiosity|trust|peace|courage|joy",
  );
  const groups = list(
    "team|class|flock|herd|family|choir|crew|crowd|band|pack|committee|audience|team|class|flock|herd|family|choir|crew|crowd|band|pack|committee|audience|team|class",
  );
  const comparisons = list(
    "tall|small|fast|slow|long|short|bright|dark|young|old|strong|weak|high|low|warm|cold|deep|light|hard|soft|quick|neat|loud|calm|fresh|sweet",
  );
  const syllables = list(
    "sun-set|pic-nic|rab-bit|bas-ket|win-dow|nap-kin|hel-met|mag-net|ro-bot|mu-sic|pa-per|ti-ger|spi-der|gar-den|mar-ket|pup-pet|pen-cil|kit-ten|les-son|but-ton|can-dle|den-tist|in-sect|lem-on|vel-vet|car-pet",
  );
  const nounsAfter = list(
    "player|student|neighbor|teacher|artist|swimmer|gardener|reader|singer|reporter|coach|chef|ranger|visitor|baker|captain|drummer|engineer|carpenter|volunteer|librarian|scientist|friend|astronaut|child|musician",
  );
  function item(lesson, i, prompt, context, answer, wrong, reason, clue, walk) {
    const choices = [
      { id: "key", text: answer, feedback: reason },
      ...wrong.map(([text, feedback], n) => ({ id: "d" + n, text, feedback })),
    ];
    return {
      id: `${lesson.id}-${i}`,
      skill: lesson.id,
      level: i < 8 ? 0 : i < 18 ? 1 : 2,
      prompt,
      context,
      answer,
      choices,
      reason,
      hints: [lesson.definition, clue, walk],
      type: "choice",
    };
  }
  function composition(lesson, i, s) {
    const F = s.sentence,
      n = s.noun,
      k = i % 5;
    if (lesson.id === "paragraph") {
      const topic = `Watching a ${n} can help us learn.`,
        detail = F,
        close = `That experience helped me understand the ${n} better.`,
        off = "My favorite number has three digits.";
      const context = [topic, detail, off, close].join(" ");
      const rows = [
        [
          "Which sentence introduces the paragraph’s main idea?",
          topic,
          [
            [
              detail,
              "This is a specific example supporting the broader topic.",
            ],
            [off, "This introduces an unrelated idea about numbers."],
          ],
          `The opening sentence introduces learning by watching a ${n}; the action is a supporting example.`,
        ],
        [
          "Which sentence gives a specific supporting detail?",
          detail,
          [
            [
              topic,
              "This introduces the broad main idea instead of the specific action.",
            ],
            [off, "This does not support learning by observation."],
          ],
          `The action ${s.predicate} is the concrete detail showing what was observed.`,
        ],
        [
          "Which sentence should be removed to keep one main idea?",
          off,
          [
            [detail, "This action is the example supporting the main idea."],
            [close, "This wraps up the learning experience."],
          ],
          `The number sentence does not relate to observing the ${n}; the other choices develop that topic.`,
        ],
        [
          "Which sentence gives the paragraph a conclusion?",
          close,
          [
            [
              topic,
              "This introduces the topic rather than wrapping up the experience.",
            ],
            [off, "This shifts to an unrelated number topic."],
          ],
          `The final sentence explains what the observation meant and returns to the topic of learning.`,
        ],
        [
          "Which order makes a clear paragraph after the unrelated sentence is removed?",
          `${topic} ${detail} ${close}`,
          [
            [
              `${close} ${off} ${detail}`,
              "This begins with a conclusion and retains an unrelated idea.",
            ],
            [
              `${detail} ${off} ${topic}`,
              "This retains an unrelated idea and does not give a concluding sentence.",
            ],
          ],
          `Introduce the learning topic, add the observation, and conclude with what the observer learned.`,
        ],
      ];
      return { context, row: rows[k] };
    }
    if (lesson.id === "narrative" || lesson.id === "weekend") {
      const opening = `I arrived to watch the ${n}.`,
        problem = "A tall screen blocked my view.",
        solution = "I moved to an open spot beside the screen.",
        ending = `I went home glad that I had watched the ${n}.`;
      const context = `${lesson.id === "weekend" ? "Weekend News" : "An imagined story"}: ${opening} ${problem} ${solution} ${F} ${ending}`;
      const rows = [
        [
          "What problem does the narrator face?",
          problem,
          [
            [
              F,
              "This tells what the observer watched, not what blocked the observer.",
            ],
            [ending, "This gives the ending reaction rather than the problem."],
          ],
          `The screen prevents the narrator from seeing; that is the problem the narrator needs to solve.`,
        ],
        [
          "Which action resolves the narrator’s problem?",
          solution,
          [
            [
              opening,
              "Arriving begins the story but does not remove the blocked view.",
            ],
            [
              F,
              `The ${n}’s action is what is watched; moving solves the observer’s problem.`,
            ],
          ],
          `Moving to an open spot lets the narrator see past the screen.`,
        ],
        [
          "Which sentence gives a sense of closure?",
          ending,
          [
            [
              problem,
              "This introduces a problem rather than resolving or closing the experience.",
            ],
            [opening, "This begins the experience rather than ending it."],
          ],
          `Going home and reflecting on the experience provides a clear ending.`,
        ],
        [
          "Which event happens before the narrator moves?",
          problem,
          [
            [ending, "Going home happens after the observation."],
            [
              F,
              "The reported observation happens after the narrator finds a better view.",
            ],
          ],
          `The screen blocks the view first. That problem motivates the move.`,
        ],
        [
          "Which sentence adds a reaction related to this experience?",
          `I felt curious about how the ${n} completed the task.`,
          [
            [
              "All stories need the same ending.",
              "This is a false general rule instead of a reaction to the event.",
            ],
            [
              "My favorite number is forty.",
              "This does not connect to the observed event.",
            ],
          ],
          `Curiosity connects the narrator’s feelings to the ${n}’s action.`,
        ],
      ];
      return { context, row: rows[k] };
    }
    if (lesson.id === "opinion") {
      const opinion = `Our class should learn more about what a ${n} does.`,
        reason = `Studying the action could teach us how a ${n} works.`,
        detail = `For example, we could discuss this observation: ${F}`,
        close = `For these reasons, I think observing a ${n} would be useful.`;
      const context = `${opinion} ${reason} ${detail} ${close}`;
      const rows = [
        [
          "Which sentence states the writer’s opinion?",
          opinion,
          [
            [
              F,
              "This reports an imagined observed event, rather than what the writer recommends.",
            ],
            [reason, "This supplies a supporting reason after the opinion."],
          ],
          `The words should learn state the writer’s view about what the class ought to do.`,
        ],
        [
          "Which sentence gives a reason for the opinion?",
          reason,
          [
            [
              opinion,
              "This states the recommendation without explaining its benefit.",
            ],
            [
              close,
              "This restates the view at the end rather than adding the supporting reason.",
            ],
          ],
          `The reason explains a benefit: understanding how a ${n} works.`,
        ],
        [
          "Which phrase introduces a supporting example?",
          "For example",
          [
            [
              "For these reasons",
              "This signals the conclusion returning to the opinion.",
            ],
            [
              "Our class",
              "This names the audience or group, not a link to an example.",
            ],
          ],
          `For example introduces the particular observation supporting the writer’s reason.`,
        ],
        [
          "Which sentence concludes this opinion piece?",
          close,
          [
            [reason, "This develops the supporting reason in the middle."],
            [
              F,
              "This is a specific example, not the concluding return to the view.",
            ],
          ],
          `For these reasons returns to the opinion and wraps up the piece.`,
        ],
        [
          "Which addition would give a second relevant reason?",
          `We could ask questions and learn a new skill by studying the ${n}.`,
          [
            [
              "It is useful because it is useful.",
              "This repeats a claim without giving another reason.",
            ],
            [
              "A square has four equal sides.",
              "This does not support studying this activity.",
            ],
          ],
          `Asking questions and learning a skill gives an additional benefit connected to the opinion.`,
        ],
      ];
      return { context, row: rows[k] };
    }
    if (lesson.id === "informational") {
      const topic = `An observation record reports what someone notices.`,
        fact = F,
        close = `This record tells us one thing the ${n} did.`;
      const context = `Supplied observation record: ${topic} ${fact} ${close}`;
      const rows = [
        [
          "Which statement is directly supported by the observation?",
          `The ${n} ${s.predicate}.`,
          [
            [
              `The ${n} does this every morning.`,
              "The record reports one action, not a daily routine.",
            ],
            [
              `The ${n} is the best in the world.`,
              "The record supplies no world comparison or proof of this judgment.",
            ],
          ],
          `The action ${s.predicate} is directly reported. The other claims add information not in the record.`,
        ],
        [
          "Which sentence introduces what this short text explains?",
          topic,
          [
            [fact, "This gives the particular example after the introduction."],
            [close, "This concludes by summarizing what the record contains."],
          ],
          `The introduction defines an observation record before showing a particular example.`,
        ],
        [
          "Which claim is an opinion rather than a checkable detail from the record?",
          `The ${n} is the most interesting subject of all.`,
          [
            [
              fact,
              "This is the supplied action and can be checked against the record.",
            ],
            [close, "This describes what the supplied record reports."],
          ],
          `Most interesting is a personal judgment. The supplied event is reported information.`,
        ],
        [
          "Which sentence concludes this explanation?",
          close,
          [
            [topic, "This opens with the definition."],
            [fact, "This supplies the specific observed detail in the body."],
          ],
          `The final sentence summarizes what the example record tells us.`,
        ],
        [
          "What should a writer do before adding a new factual claim about this activity?",
          "Check a reliable source and record where the information came from.",
          [
            [
              "Guess what probably happens and state it as a fact.",
              "A guess is not verified evidence.",
            ],
            [
              "Copy a sentence from any source without checking or naming it.",
              "Unverified copied information may be inaccurate, and its source should be credited.",
            ],
          ],
          `The supplied observation supports only its reported event. Additional factual claims need reliable support.`,
        ],
      ];
      return { context, row: rows[k] };
    }
    return null;
  }

  function refine(lesson, i, s) {
    const n = s.noun,
      F = s.sentence,
      k = i % 6;
    if (lesson.id === "nouns" && k === 4) {
      return {
        context: `Maya watched the ${n} during the activity.`,
        row: [
          "Which word is a proper noun naming a specific person?",
          "Maya",
          [
            [
              n,
              `The word ${n} is a common noun, not the person’s specific name.`,
            ],
            [
              "activity",
              "Activity is a common noun rather than a specific person’s name.",
            ],
          ],
          `Maya is a specific person’s name, so it is a proper noun and begins with a capital.`,
        ],
      };
    }
    if (lesson.id === "nouns" && k === 5) {
      return {
        context: F,
        row: [
          "Which common noun names who or what performs the action?",
          n,
          [
            [
              s.adj,
              `${s.adj} describes the noun rather than naming the actor.`,
            ],
            [
              s.verb,
              `${s.verb} tells the action rather than naming the actor.`,
            ],
          ],
          `${n} is the common noun naming the sentence’s subject. It does not give a specific individual’s proper name.`,
        ],
      };
    }
    if (lesson.id === "word-choice" && k === 5 && i >= 11) {
      return {
        context: `The ${n} walked ___ the classroom. The missing word shows direction.`,
        row: [
          "Which word fits this meaning?",
          "to",
          [
            [
              "too",
              "Too means also or more than needed; this sentence needs a direction word.",
            ],
            ["two", "Two is the number 2, not a direction word."],
          ],
          `To shows the direction of the walking: to the classroom.`,
        ],
      };
    }
    if (lesson.id === "word-choice" && k === 3 && i >= 15) {
      return {
        context: `Please ___ the ${n} about the safest method.`,
        row: [
          "Which word means give helpful information?",
          "advise",
          [
            [
              "advice",
              "Advice is the noun naming the information, not the verb needed after Please.",
            ],
            [
              "advises",
              "A request beginning Please uses the base form here, not the third-person singular form.",
            ],
          ],
          `Advise is the verb meaning give advice. This request needs Please advise.`,
        ],
      };
    }
    if (lesson.id === "apostrophes" && k === 0 && i >= 12) {
      return {
        context: `The ${n} checks the time. ___ time to begin. Use the contraction for It is.`,
        row: [
          "Which contraction means It is?",
          "It’s",
          [
            ["Its", "Its shows ownership; it does not mean it is."],
            [
              "Its’",
              "This is not the conventional contraction or possessive form.",
            ],
          ],
          `It’s is the contraction of it is. The apostrophe marks the missing i in is.`,
        ],
      };
    }
    if (lesson.id === "complex" && k === 0 && i >= 6) {
      return {
        context: `Describe a notebook connected to the ${n}.`,
        row: [
          "Which complete sentence uses a relative pronoun to describe notebook?",
          `This is the notebook that the ${n} used.`,
          [
            [
              `That the ${n} used.`,
              "The relative clause depends on a noun and a main clause; it is not the intended complete thought.",
            ],
            [
              `This is the notebook that the ${n}.`,
              "The relative clause is unfinished because it has no predicate.",
            ],
          ],
          `That introduces a relative clause describing notebook. This is the notebook supplies the main thought, and the ${n} used completes the relative clause.`,
        ],
      };
    }

    if (lesson.id === "prepositions") {
      const phrases = [
        "under the wooden bench",
        "beside the tall tree",
        "near the science table",
        "after the last lesson",
        "before the first game",
        "inside the quiet library",
        "above the narrow shelf",
        "behind the old shed",
        "across the sandy field",
        "between two tall trees",
        "during the class meeting",
        "around the small pond",
        "through the open doorway",
        "along the winding trail",
        "over the low fence",
        "beneath the leafy branch",
        "outside the busy classroom",
        "within the marked area",
        "against the stone wall",
        "into the bright room",
        "onto the wooden platform",
        "toward the distant hill",
        "past the red gate",
        "beyond the old bridge",
        "without a heavy backpack",
        "with a colorful notebook",
      ];
      const phrase = phrases[i],
        parts = phrase.split(" "),
        prep = parts[0],
        rest = parts.slice(1).join(" "),
        obj = parts.at(-1);
      return {
        context: `${s.subject} moved ${phrase}.`,
        row: [
          "Which choice is the whole prepositional phrase?",
          phrase,
          [
            [prep, `This is only the preposition, without its object ${obj}.`],
            [rest, `This leaves out the preposition ${prep}.`],
          ],
          `${prep} is the preposition, and ${obj} is its object. Keep the complete phrase ${phrase}, including the words between them.`,
        ],
      };
    }
    if (lesson.id === "agreement") {
      const j = i % 4,
        other = nounsAfter[i];
      const rows = [
        [
          `The ${n} with several notebooks ___ ready.`,
          "is",
          [
            [
              "are",
              `The main subject ${n} is singular; notebooks is inside a phrase.`,
            ],
            [
              "be",
              "The base form be does not fit this present-tense statement.",
            ],
          ],
          `The singular subject ${n} takes is. Ignore the nearby plural notebooks when choosing the subject’s verb.`,
        ],
        [
          `The ${n} and the ${other} ___ ready.`,
          "are",
          [
            [
              "is",
              "Two subjects joined by and ordinarily make a plural subject here.",
            ],
            ["am", "Am agrees with I, not this plural subject."],
          ],
          `The two people or animals make a plural subject, so use are.`,
        ],
        [
          `I ___ ready to watch the ${n}.`,
          "am",
          [
            ["is", "Use am with I in the present tense."],
            ["are", "Use am with I, although you takes are."],
          ],
          `I takes the special present form am: I am ready.`,
        ],
        [
          `You ___ ready to help the ${n}.`,
          "are",
          [
            [
              "is",
              "You takes are in this sentence, even when speaking to one person.",
            ],
            ["am", "Am is used with I, not you."],
          ],
          `You takes are whether it refers to one listener or several.`,
        ],
      ];
      const [context, answer, wrong, reason] = rows[j];
      return {
        context,
        row: [
          "Which present-tense verb agrees with the subject?",
          answer,
          wrong,
          reason,
        ],
      };
    }
    if (lesson.id === "sequence") {
      const rows = [
        [
          `First, we arrived to watch the ${n}. ___, we watched the activity. Finally, we discussed what we learned.`,
          "Which transition fits the middle event?",
          "Next",
          [
            [
              "Before we arrived",
              "This contradicts the order already described.",
            ],
            [
              "Finally",
              "A separate final discussion follows this middle event.",
            ],
          ],
          "Next connects the middle event after arriving and before discussing.",
        ],
        [
          `The ${n} practiced the difficult skill. ___, the task became easier.`,
          "Which transition shows the result of practice?",
          "As a result",
          [
            [
              "However",
              "However would signal a contrast rather than the result described here.",
            ],
            [
              "Before that",
              "This would reverse the order instead of linking practice to its result.",
            ],
          ],
          "As a result connects practice as a cause with the task becoming easier as its effect.",
        ],
        [
          `The ${n} worked carefully. ___, a mistake remained.`,
          "Which transition shows contrast?",
          "However",
          [
            [
              "Therefore",
              "Therefore introduces a result, while this second fact contrasts with careful work.",
            ],
            [
              "For example",
              "A remaining mistake is not an example of the careful work claimed in the first sentence.",
            ],
          ],
          "However signals that a mistake remains despite the careful work.",
        ],
        [
          `The ${n} used several tools. ___, a notebook helped record observations.`,
          "Which phrase introduces a specific example?",
          "For example",
          [
            [
              "In contrast",
              "The notebook is one of the tools, not a contrasting claim.",
            ],
            [
              "Before that",
              "This does not describe a time before using tools.",
            ],
          ],
          "For example introduces a specific tool that supports the broader statement.",
        ],
      ];
      const [context, prompt, answer, wrong, reason] = rows[i % 4];
      return { context, row: [prompt, answer, wrong, reason] };
    }
    if (lesson.id === "revise" && i % 3 === 1) {
      return {
        context: `Draft: ${s.sentence[0].toLowerCase() + s.sentence.slice(1)} Edited version: ${s.sentence}`,
        row: [
          "What change did the writer make?",
          "The writer edited the opening capital.",
          [
            [
              "The writer added a new supporting reason.",
              "Neither version gives a supporting reason for an opinion.",
            ],
            [
              "The writer changed the event’s action.",
              "Both versions describe the same action.",
            ],
          ],
          `Only the first letter changed. This is editing a capitalization convention, rather than revising the idea.`,
        ],
      };
    }
    if (lesson.id === "revise" && i % 3 === 2) {
      return {
        context: `Draft: Finally, we went home. First, we watched the ${n}. Revision: First, we watched the ${n}. Finally, we went home.`,
        row: [
          "What did this revision improve?",
          "The events now follow a logical time order.",
          [
            [
              "The writer only corrected a spelling error.",
              "The same words are used in both versions.",
            ],
            [
              "The writer added a different character.",
              "No character is added; the event order changes.",
            ],
          ],
          `The revision puts the first event before the final event. Changing organization is revision, not just proofreading a word.`,
        ],
      };
    }

    if (lesson.id === "describers" && k === 4) {
      const compare = i % 2 === 0 ? "two" : "all three";
      const superl = Math.floor(i / 6) % 2 === 0;
      return {
        context: `Compare how carefully the ${n} and ${superl ? "two" : "one"} other workers performed.`,
        row: [
          `Which phrase compares ${superl ? "all three workers" : "two workers"}?`,
          superl ? "most carefully" : "more carefully",
          [
            [
              superl ? "more carefully" : "most carefully",
              superl
                ? "Use a superlative for a group of three."
                : "Use a comparative for two.",
            ],
            [
              "carefullier",
              "carefully uses more or most for comparison, not this ending.",
            ],
          ],
          `Use ${superl ? "most carefully to compare three or more" : "more carefully to compare two"}. The phrase describes how the workers performed.`,
        ],
      };
    }
    if (lesson.id === "pronouns" && k === 3) {
      return {
        context: `The ${n} and a friend brought notebooks. ___ placed them on the desk.`,
        row: [
          "Which pronoun agrees with both notebook owners?",
          "They",
          [
            [
              "He",
              "He is singular, while the two owners form a plural antecedent.",
            ],
            ["It", "It does not name the two people as a plural group."],
          ],
          `They agrees with the two owners. them refers to the notebooks, not the owners.`,
        ],
      };
    }
    if (lesson.id === "pronouns" && k === 4) {
      return {
        context: `Some people watched the ${n}. Others ___ waiting outside.`,
        row: [
          "Which verb agrees with Others?",
          "are",
          [
            ["is", "Others is plural, so the singular verb is does not agree."],
            ["am", "Am agrees with I, not with the plural pronoun others."],
          ],
          `Others is a plural indefinite pronoun here, so it takes are.`,
        ],
      };
    }
    if (lesson.id === "pronouns" && k === 5) {
      const p = i % 2 ? "Someone" : "Each";
      return {
        context: `${p} ___ a notebook for the ${n}.`,
        row: [
          `Which present-tense verb agrees with ${p}?`,
          "has",
          [
            [
              "have",
              `${p} is singular here, so the plural/base form have does not agree.`,
            ],
            [
              "having",
              "Having needs a helper to serve as this sentence’s verb phrase.",
            ],
          ],
          `${p} is treated as singular. Use has, as in one person has.`,
        ],
      };
    }
    if (lesson.id === "apostrophes" && k === 4) {
      return {
        context: `The ${n} collected toys belonging to several children.`,
        row: [
          "Which phrase shows this irregular plural ownership?",
          "the children’s toys",
          [
            [
              "the childrens’ toys",
              "The plural is children, without an added s; add apostrophe-s to children.",
            ],
            [
              "the childs’ toys",
              "Childs is not the plural of child, and this does not show the intended owners.",
            ],
          ],
          `Children is an irregular plural that does not end in s. Add apostrophe-s: children’s toys.`,
        ],
      };
    }
    if (lesson.id === "apostrophes" && k === 5) {
      return {
        context: `The ${n} packed supplies. ___ ready for the activity. Use the contraction for They are.`,
        row: [
          "Which contraction means They are?",
          "They’re",
          [
            ["Their", "Their shows ownership, not they are."],
            [
              "There",
              "There refers to a place or introduces a sentence; it is not they are.",
            ],
          ],
          `They’re replaces they are. The apostrophe stands for the missing a.`,
        ],
      };
    }
    if (lesson.id === "dialogue" && k === 4) {
      return {
        context: `The ${n} answers yes to the question.`,
        row: [
          "Which response uses the introductory yes correctly?",
          "Yes, I am ready.",
          [
            ["Yes I am ready.", "Use a comma after the introductory yes."],
            [
              "Yes I, am ready.",
              "The comma belongs after yes, not between I and am.",
            ],
          ],
          `A comma separates the opening response word Yes from the rest of the sentence.`,
        ],
      };
    }
    if (lesson.id === "dialogue" && k === 5) {
      return {
        context: `The ${n} asks the exact question Are we ready?`,
        row: [
          "Which sentence punctuates the spoken question correctly?",
          `“Are we ready?” the ${n} asked.`,
          [
            [
              `“Are we ready,” the ${n} asked.`,
              "A spoken direct question keeps its question mark, rather than changing it to a comma.",
            ],
            [
              `“are we ready?” the ${n} asked.`,
              "Capitalize the first word of the quoted sentence.",
            ],
          ],
          `The question mark belongs inside the closing quotation mark. The speaker tag is outside the quotation and continues with lowercase the.`,
        ],
      };
    }
    if (lesson.id === "word-choice" && k === 0 && i >= 6) {
      return {
        context: `The ${n} brought a notebook ___. The meaning is also.`,
        row: [
          "Which word means also in this sentence?",
          "too",
          [
            [
              "to",
              "To can mark a direction or introduce an infinitive; it does not mean also.",
            ],
            ["two", "Two is the number 2, not also."],
          ],
          `Too means also: The ${n} brought a notebook too.`,
        ],
      };
    }
    if (lesson.id === "word-choice" && k === 1 && i >= 7) {
      return {
        context: `The ${n} is studying a book about France. Use the proper adjective from France.`,
        row: [
          "Which form is the correctly capitalized proper adjective?",
          "French",
          [
            [
              "french",
              "Proper adjectives formed from place names use capitals.",
            ],
            [
              "France",
              "France is the name of the country; the adjective is French.",
            ],
          ],
          `French is the proper adjective formed from France, so it begins with a capital.`,
        ],
      };
    }
    if (lesson.id === "word-choice" && k === 2 && i >= 8) {
      return {
        context: `The ${n} read a book titled A Day at the Park. This task shows plain-text title marking.`,
        row: [
          "Which convention appropriately marks a whole book title in handwritten or plain-text planning?",
          "Underline A Day at the Park.",
          [
            [
              "Put only the word Park in quotation marks.",
              "Mark the whole title, not just its last word.",
            ],
            [
              "Write the whole book title in lowercase without any marking.",
              "Capitalize the first and major title words and distinguish the whole title.",
            ],
          ],
          `A whole book title is underlined in handwriting or italicized in typeset text. A short story or poem title uses quotation marks instead.`,
        ],
      };
    }
    if (lesson.id === "word-choice" && k === 3 && i >= 9) {
      return {
        context: `The ${n} offered helpful ___ about the project.`,
        row: [
          "Which word names the helpful information?",
          "advice",
          [
            [
              "advise",
              "Advise is a verb meaning to give advice, not the noun needed after helpful.",
            ],
            [
              "advising",
              "Advising is a verb form or activity, not the standard noun for the information in this sentence.",
            ],
          ],
          `Advice is the noun naming the helpful information. Advise is the verb for giving that information.`,
        ],
      };
    }
    if (lesson.id === "complex" && k === 2) {
      return {
        context: `Describe a place connected to the ${n}.`,
        row: [
          "Which sentence uses a relative adverb to describe a place?",
          `This is the room where the ${n} practiced.`,
          [
            [
              `Where the ${n} practiced.`,
              "This is a dependent clause, not a complete sentence with the intended main thought.",
            ],
            [
              `This is the room who the ${n} practiced.`,
              "Who relates to people; where correctly relates to this place.",
            ],
          ],
          `Where introduces a clause describing the room. This is the room is the main clause, so the full sentence is complete.`,
        ],
      };
    }
    if (lesson.id === "complex" && k === 3) {
      return {
        context: `Connect the sound of a bell to what the ${n} did afterward.`,
        row: [
          "Which sentence uses an opening dependent clause and a complete main clause?",
          `When the bell rang, the ${n} started.`,
          [
            [
              `When the bell rang.`,
              "The opening When makes this clause depend on a main clause.",
            ],
            [
              `When the bell rang the ${n} started.`,
              "Place a comma after the opening dependent clause.",
            ],
          ],
          `When the bell rang explains time and depends on the main clause the ${n} started. A comma separates that opening clause.`,
        ],
      };
    }
    if (lesson.id === "complex" && k === 4) {
      return {
        context: `After the lesson, the ${n} practiced a new skill.`,
        row: [
          "Which mark separates the introductory phrase from the main clause?",
          "the comma after lesson",
          [
            [
              "the period after skill",
              "The period ends the sentence; it does not mark the boundary after the introductory phrase.",
            ],
            [
              "a comma after the subject",
              "Do not insert a comma between this subject and its predicate.",
            ],
          ],
          `After the lesson is an introductory phrase. The comma after lesson marks its boundary before the main clause.`,
        ],
      };
    }
    if (lesson.id === "complex" && k === 5) {
      const type = Math.floor(i / 6) % 2 ? "compound" : "simple",
        sent =
          type === "compound" ? `${F.slice(0, -1)}, and the class watched.` : F;
      return {
        context: sent,
        row: [
          "Which sentence structure is used here?",
          type,
          [
            [
              type === "compound" ? "simple" : "compound",
              type === "compound"
                ? "There are two complete clauses, each with its own subject and verb."
                : "There is one independent clause, rather than two joined complete clauses.",
            ],
            ["complex", "This example does not include a dependent clause."],
          ],
          type === "compound"
            ? `The ${n} performs one action, and the class watches. Both clauses can stand alone, so the sentence is compound.`
            : `There is one complete independent clause and no dependent clause, so this sentence is simple.`,
        ],
      };
    }
    if (lesson.id === "capitals" && k === 3) {
      return {
        context: `A student watched the ${n}. Correct the pronoun in this sentence: i watched closely.`,
        row: [
          "Which edit correctly capitalizes the pronoun I?",
          "I watched closely.",
          [
            ["i watched closely.", "The pronoun I must be capitalized."],
            [
              "I Watched Closely.",
              "Ordinary words in this sentence do not all need capitals.",
            ],
          ],
          `The pronoun I always uses a capital. Watched and closely are ordinary words here and stay lowercase.`,
        ],
      };
    }
    if (lesson.id === "capitals" && k === 4) {
      return {
        context: `The ${n} will visit the city atlanta on monday.`,
        row: [
          "Which capitalization correctly shows the city and day names?",
          "Atlanta on Monday",
          [
            [
              "atlanta on Monday",
              "Atlanta is a city name and needs a capital.",
            ],
            [
              "Atlanta on monday",
              "Monday is the name of a day and needs a capital.",
            ],
          ],
          `Capitalize both the specific city name Atlanta and the day name Monday; the preposition on stays lowercase.`,
        ],
      };
    }
    return null;
  }

  const writingModels = {
    complete:
      "Our class explored the garden. We examined tiny leaves near the fence.",
    subject:
      "The careful catcher blocked a low pitch. Simple subject: catcher. Complete predicate: blocked a low pitch.",
    capitals: "I watched Maya practice. Did Maya catch the ball?",
    types:
      "Our class visits the garden. Did you see the new leaves? Please walk on the path. What a beautiful garden!",
    nouns:
      "The team showed courage during the game. Team names a group; courage names a quality.",
    plurals: "The children watched several geese beside the pond.",
    verbs:
      "Maya threw the ball. Maya is practicing. Maya is ready. Threw is an action verb; is helps practicing; is links Maya to ready.",
    tense:
      "Yesterday, I went to the park and ran around the field. Both went and ran tell about the finished activity.",
    pronouns:
      "Maya taught herself a rhythm. Everyone has a turn. Herself points back to Maya, and everyone takes has.",
    describers:
      "Maya ran more carefully than Kai. Of the three runners, Nia ran most carefully.",
    prepositions:
      "After lunch, we planted seeds beside the fence. After lunch tells when; beside the fence tells where.",
    apostrophes:
      "We can’t find the children’s notebooks. Can’t means cannot; children’s shows ownership by several children.",
    dialogue:
      "“Are we ready?” Maya asked. “Yes, we are ready,” Kai replied. Maya, please bring your notebook.",
    "word-choice":
      "Their project is there. They’re ready to explain it. Their shows ownership, there points to a place, and they’re means they are.",
    hyphens:
      "A printed line may end with sun- and continue with set on the next line. The break falls between syllables. In digital writing, keep sunset together when possible.",
    "complete-subject":
      "The careful catcher blocked a low pitch. Simple subject: catcher. Complete subject: The careful catcher.",
    agreement:
      "The box of pencils is near the desk. The players are ready. Box is singular; players is plural.",
    compound:
      "Maya practiced, and Kai watched. Each side is a complete thought joined by a comma and and.",
    complex:
      "Because rain fell, we practiced inside. The player who practiced improved. The first has an opening dependent clause; who practiced describes player in the second.",
    builder: "Our class planted seeds. We watered the soil carefully.",
    fixer:
      "Two repairs: We packed our bags. We left for the park. OR: We packed our bags, and we left for the park.",
    expand:
      "On Saturday, the careful player practiced short throws beside the field. The details add when, what kind, and where without changing the practice event.",
    combine:
      "Maya caught the ball. Maya smiled. Combined: Maya caught the ball and smiled. The shared subject appears once, and both actions remain.",
    revise:
      "Original: we did something outside. Revision: We measured tiny plants beside the fence. Revision explains the vague action; editing changes the opening w to capital W.",
    paragraph:
      "Our school garden is a useful place to learn. We observe how leaves change as the plants grow. We record our observations in notebooks. The garden helps us notice details in nature.",
    sequence:
      "First, we gathered our supplies. Next, we planted the seeds. Finally, we watered the soil.",
    narrative:
      "Maya carried her poster to school. A gust of wind bent one corner. She felt worried, but Kai helped her smooth it and add tape. They carried the poster inside together. Maya smiled when her work stood on the display table.",
    opinion:
      "Our class should visit the school garden. We could observe plants closely and record changes over time. We could also practice caring for living things. For these reasons, garden visits would help us learn.",
    informational:
      "Classroom plants need care. A plant needs light, water, and air. Roots absorb water, but too much water can harm them. Checking the plant regularly helps us meet its needs. Source: the supplied plant fact box.",
    weekend:
      "On Saturday, I practiced catching at the park. At first, a low ball rolled past me. I bent my knees and tried again. I felt proud when I stopped the next ball. Revision: I added low to explain which ball was difficult.",
  };
  function coach(lesson, prompt, s) {
    const n = s.noun;
    if (
      /main idea|introduces the paragraph|introduces what this short text/.test(
        prompt,
      )
    )
      return [
        "Look for the sentence that covers the whole text, rather than one example.",
        "Compare the beginning, specific event, and ending. Find the broad idea that includes the event involving the " +
          n +
          ".",
      ];
    if (/supporting detail|directly supported/.test(prompt))
      return [
        "Look for an action or fact stated in the supplied text.",
        "Compare each claim with what the text actually says about the " +
          n +
          ". Set aside claims adding unreported information.",
      ];
    if (/removed|remove/.test(prompt))
      return [
        "Check whether every sentence connects to learning from the observation.",
        "Compare each sentence with the paragraph topic. A detail about a separate topic does not belong just because it is true.",
      ];
    if (/conclu|closure/.test(prompt))
      return [
        "Look for a sentence that wraps up the experience or returns to its main point.",
        "Trace the beginning and middle before choosing an ending. A new problem or unrelated fact does not give closure.",
      ];
    if (/problem/.test(prompt))
      return [
        "Find what keeps the narrator from seeing the activity.",
        "Read the sentence before the narrator changes position. Separate the obstacle from the action used to solve it.",
      ];
    if (/resolves/.test(prompt))
      return [
        "Find an action that removes the obstacle, rather than just describing the event.",
        "Compare the narrator’s situation before and after moving. Ask which action lets the narrator reach the goal.",
      ];
    if (lesson.id === "paragraph" && /order/.test(prompt))
      return [
        "Start with the main idea, then look for a supporting example and a related conclusion.",
        "Check each proposed order for an introduction, a specific detail, and a wrap-up without an unrelated sentence.",
      ];
    if (/before|order/.test(prompt))
      return [
        "Trace which event causes the next event in this specific text.",
        "Read the events in sequence: arrival, obstacle, change, observation, reflection. Match the question to that sequence.",
      ];
    if (/opinion/.test(prompt))
      return [
        "Look for what the writer recommends or believes, rather than a checkable observation.",
        "Compare the recommendation with the supporting benefit. Decide whether the question asks for the view itself or its explanation.",
      ];
    if (/reason/.test(prompt))
      return [
        "A reason explains a benefit of the proposed activity.",
        "Test whether each choice explains why the class could learn from the " +
          n +
          ". Repeating a claim does not add a benefit.",
      ];
    if (/example/.test(prompt))
      return [
        "Find the linking phrase immediately before the specific observation.",
        "Compare links that introduce an example with links that signal an ending. Choose the relationship the question requests.",
      ];
    const hints = {
      nouns: [
        "Check whether the question asks for a specific name, a group, an idea, or a common name for the actor.",
        "Read how each word works in this sentence. A specific name differs from a general category; a quality differs from an action or a physical thing.",
      ],
      agreement: [
        "Find the main subject and decide whether it is I, you, one person or thing, or a plural group.",
        "Set aside extra phrases. Match the verb to the main subject, remembering the special I and you forms.",
      ],
      prepositions: [
        "Find the relationship word and the noun or pronoun completing it in this exact sentence.",
        "Start with the preposition, include its describing words, and stop after its object; do not keep only one end of the phrase.",
      ],
      sequence: [
        "Decide whether these ideas show time, a result, a contrast, or an example.",
        "Read the two linked ideas together and test what the second does: happens next, follows as an effect, differs from expectations, or illustrates the first.",
      ],
      revise: [
        "Compare the two versions and identify exactly what changed.",
        "Separate changes to ideas or order from changes to capitals, spelling, grammar, and punctuation.",
      ],
      describers: [
        "Count the people being compared, then find what the describing word modifies.",
        "A comparison about how an action is done needs an adverb form. Choose the form for two or for the whole group as requested.",
      ],
      pronouns: [
        "Find the antecedent or indefinite pronoun that controls agreement.",
        "Decide whether this subject is one or more than one; nearby nouns do not change its number. Then choose its matching pronoun or verb.",
      ],
      apostrophes: [
        "Decide whether you need a contraction or an ownership form in this sentence.",
        "For ownership, write the plural owner first. If it does not already end in s, it takes apostrophe-s. For a contraction, expand it to check the words.",
      ],
      dialogue: [
        "Separate exact spoken words, the speaker tag, and any introductory response word.",
        "A spoken question keeps its question mark inside the quotation marks. An introductory yes or no is separated by a comma. Apply the rule needed by this question.",
      ],
      "word-choice": [
        "Use the meaning and the kind of word requested, then check its capitalization or title convention.",
        "Say a contraction in full if one is offered. For titles, distinguish an entire book from a short work; for word choice, check whether a noun or verb fits.",
      ],
      complex: [
        "Find the independent main thought and the dependent clause or introductory phrase.",
        "Read the first word of the clause. If it makes the thought dependent, connect it to a main clause. When that dependent clause comes first, mark its boundary.",
      ],
      capitals: [
        "Find proper names, days, and the pronoun I in this specific sentence.",
        "Capitalize names and I, while keeping ordinary words lowercase unless they begin a sentence. Check each offered form against those jobs.",
      ],
    };
    return (
      hints[lesson.id] || [
        "Use the lesson’s steps with this exact text about the " + n + ".",
        "Compare what the question asks with each option; keep information from this text and set aside unrelated claims or unsupported changes.",
      ]
    );
  }

  function make(lesson, i, form = 0) {
    const s = (form % 2 === 1 ? C.alternates : C.contexts)[i],
      S = s.subject,
      P = s.predicate,
      F = s.sentence,
      n = s.noun,
      v = s.verb,
      a = s.adj;
    let prompt,
      context = F,
      answer,
      wrong,
      reason,
      clue,
      walk;
    const set = (p, ans, w, r, c, st) => {
      prompt = p;
      answer = ans;
      wrong = w;
      reason = r;
      clue = c;
      walk = st;
    };
    const bad = (text, why) => [text, why];
    switch (lesson.id) {
      case "complete":
        context = F.split(" ").slice(0, 3).join(" ");
        set(
          "Which choice completes the fragment as a whole sentence?",
          F,
          [
            bad(
              S + ".",
              `“${S}” names who, but says nothing about that subject.`,
            ),
            bad(P + ".", `“${P}” tells an action without naming who did it.`),
          ],
          `“${S}” names who; “${P}” tells what happened. Together they express a whole thought.`,
          `Ask what the ${n} did.`,
          `Keep both the subject and the information beginning with ${v}; then check the ending mark.`,
        );
        break;
      case "subject":
        if (i % 2 === 0)
          set(
            "Which word is the simple subject?",
            n,
            [
              bad(v, `“${v}” tells the action, so it is the verb.`),
              bad(
                a,
                `“${a}” describes the ${n}; it is not the main subject word.`,
              ),
            ],
            `The verb is ${v}. Who ${v}? The ${n}. So ${n} is the simple subject.`,
            `Find ${v}, then ask who did it.`,
            `The describing word ${a} belongs with the subject, but the main naming word is the simple subject.`,
          );
        else
          set(
            "Which choice is the complete predicate?",
            P,
            [
              bad(S, `“${S}” names who and is the complete subject.`),
              bad(
                v,
                `“${v}” is only the verb, not the whole predicate in this sentence.`,
              ),
            ],
            `The predicate includes ${v} and all the words that tell what the ${n} did: ${P}.`,
            `Find the verb ${v}. Keep the words that complete that action.`,
            `The subject ends at ${n}. Read everything after the subject, without dropping the details.`,
          );
        break;
      case "capitals":
        context = F[0].toLowerCase() + F.slice(1, -1);
        set(
          "Choose the correctly edited statement.",
          F,
          [
            bad(context + ".", "The first word of a sentence needs a capital."),
            bad(
              F.slice(0, -1) + "?",
              "This sentence tells what happened; it does not ask a question.",
            ),
          ],
          `Capitalize The because it starts the sentence. Use a period because this is a statement.`,
          `Check the first letter and decide whether the sentence tells or asks.`,
          `There is no question being asked. Use the statement ending after ${s.rest}.`,
        );
        break;
      case "types": {
        const k = i % 4,
          texts = [
            F,
            `Did the ${n} help today?`,
            `Please thank the ${n}.`,
            `What an amazing ${n}!`,
          ],
          labels = ["statement", "question", "command", "exclamation"];
        context = texts[k];
        set(
          "What is the purpose of this sentence?",
          labels[k],
          labels
            .filter((x, j) => j !== k)
            .map((x) =>
              bad(
                x,
                `A ${x} has a different purpose. Read what the speaker is doing in “${context}”.`,
              ),
            ),
          [
            `The sentence tells what the ${n} did, so it is a statement.`,
            `The speaker asks for information, so this is a question.`,
            `The speaker directs someone to thank the ${n}. The understood subject is you.`,
            `The sentence expresses strong feeling about the ${n}, so it is an exclamation.`,
          ][k],
          `Decide whether the speaker tells, asks, directs, or expresses strong feeling.`,
          `Look at “${context.split(" ").slice(0, 3).join(" ")}” and the ending mark together.`,
        );
        break;
      }
      case "nouns":
        if (i % 2 === 0) {
          context = `The ${n} showed ${ideas[i]} during the activity.`;
          set(
            "Which word is an abstract noun?",
            ideas[i],
            [
              bad(
                n,
                `“${n}” names a person or animal, rather than a quality or feeling.`,
              ),
              bad("showed", "“showed” is the action verb."),
            ],
            `“${ideas[i]}” names an idea, quality, or feeling rather than a touchable object. It is an abstract noun.`,
            `Look for the word naming an idea, quality, or feeling in this sentence.`,
            `The subject ${n} acts. What quality did that subject show?`,
          );
        } else {
          context = `The ${groups[i]} gathered near the ${n}.`;
          set(
            "Which word is a collective noun?",
            groups[i],
            [
              bad(n, `“${n}” names an individual here.`),
              bad("gathered", "“gathered” tells what happened."),
            ],
            `“${groups[i]}” is one word that names a group. It is a collective noun.`,
            `Look for one word naming several members as a group.`,
            `The word after The names the group doing the gathering.`,
          );
        }
        break;
      case "plurals": {
        const sg = singular[i],
          pl = plural[i];
        context = `The ${n} counted more than one ${sg}.`;
        set(
          `What is the usual plural of ${sg}?`,
          pl,
          [
            bad(
              sg == pl ? sg + "s" : sg,
              sg == pl
                ? `The standard plural in this task keeps the form ${sg}.`
                : `“${sg}” is the singular form in this task.`,
            ),
            bad(
              sg + "'s",
              "Apostrophe-s shows ownership; it does not make the usual plural here.",
            ),
          ],
          `The usual plural of ${sg} is ${pl}. ${sg === pl ? "The form stays the same." : "This word uses an irregular plural."}`,
          `You need the word for more than one ${sg}.`,
          `Check the special plural form; do not add an ownership apostrophe.`,
        );
        break;
      }
      case "verbs": {
        const k = i % 3;
        context =
          k === 0
            ? F
            : k === 1
              ? `${S} is working carefully today.`
              : `${S} is ready for the activity.`;
        answer = k === 0 ? v : k === 1 ? "is working" : "is";
        set(
          k === 1
            ? "Which choice is the whole verb phrase?"
            : "Which word is the verb?",
          answer,
          k === 0
            ? [
                bad(n, `“${n}” names the subject.`),
                bad(a, `“${a}” describes the subject.`),
              ]
            : k === 1
              ? [
                  bad(
                    "working",
                    "working is the main verb, but this question asks for the helper too.",
                  ),
                  bad("carefully", "carefully tells how; it is an adverb."),
                ]
              : [
                  bad(
                    "ready",
                    "ready describes the subject; is links the description to the subject.",
                  ),
                  bad(n, `${n} is the main subject word.`),
                ],
          k === 0
            ? `${v} tells what the ${n} did.`
            : k === 1
              ? "is is the helper and working is the main verb. The whole phrase is is working."
              : `is links the ${n} to the description ready. It is a linking verb.`,
          `Ask what happens, or which verb links the subject to a description.`,
          k === 1
            ? "Read both the helper and main action together."
            : k === 2
              ? "A verb can link a subject to a description without showing an action."
              : `Which word tells the action done by the ${n}?`,
        );
        break;
      }
      case "tense": {
        const pr = present[i],
          pa = past[i];
        context = `Use ${pr} to tell about something that happened yesterday. The ${n} is telling the story.`;
        set(
          `What is the past-tense form of ${pr}?`,
          pa,
          [
            bad(
              pr === pa ? pr + "ed" : pr,
              pr === pa
                ? `For past read, the spelling stays read; its pronunciation changes.`
                : `“${pr}” is the base form; the task asks for past time.`,
            ),
            bad(
              "will " + pr,
              "will names a future action, not one that already happened.",
            ),
          ],
          `${pr} has the past form ${pa}. ${pr === pa ? "The spelling stays the same; past read sounds like red." : "This is an irregular verb, so do not simply add -ed."}`,
          `Use the time clue yesterday.`,
          `Recall the special past form of ${pr}; future will does not fit yesterday.`,
        );
        break;
      }
      case "pronouns": {
        const k = i % 3;
        if (k === 0) {
          context = `The ${n} and the ${nounsAfter[i]} carried their supplies. ___ worked together.`;
          set(
            "Which pronoun clearly replaces both people?",
            "They",
            [
              bad("It", "It refers to one thing, not the two people here."),
              bad("He", "He refers to one person, not both people."),
            ],
            `They refers to both the ${n} and the ${nounsAfter[i]}. The antecedent is plural.`,
            `Count the people being replaced.`,
            `A pronoun replacing two named people must be plural.`,
          );
        } else if (k === 1) {
          context = `The ${n} taught herself a new skill.`;
          set(
            "Which word is a reflexive pronoun?",
            "herself",
            [
              bad(n, `“${n}” is a noun naming the subject.`),
              bad("new", "new describes skill; it is an adjective."),
            ],
            `herself points back to the subject: the person learning is also teaching herself.`,
            `Find the word ending in self or selves.`,
            `Ask whether the action returns to the same person named by the subject.`,
          );
        } else {
          context = `Everyone ___ ready to watch the ${n}.`;
          set(
            "Which verb agrees with Everyone?",
            "is",
            [
              bad(
                "are",
                "Everyone is singular in this use, so are does not agree.",
              ),
              bad(
                "be",
                "The base form be cannot stand as this present-tense statement’s verb.",
              ),
            ],
            "Everyone takes the singular present verb is, even though it can refer to many people.",
            `Everyone is an indefinite pronoun treated as singular.`,
            `Try the same verb you would use with one person.`,
          );
        }
        break;
      }
      case "describers": {
        const k = i % 3,
          base = comparisons[i];
        if (k === 0)
          set(
            `Which word describes the noun ${n}?`,
            a,
            [
              bad(v, `${v} is the action, not a description of the noun.`),
              bad(n, `${n} is the noun being described.`),
            ],
            `${a} describes the noun ${n}; it tells what kind.`,
            `Find ${n}, then ask what kind.`,
            `Choose the describing word that belongs with ${n}, not the action.`,
          );
        else if (k === 1) {
          context = `The ${n} worked carefully near the window.`;
          set(
            "Which word tells how the action happened?",
            "carefully",
            [
              bad(n, `${n} names who worked.`),
              bad("window", "window names a thing or place in the sentence."),
            ],
            "carefully tells how the subject worked. It is an adverb modifying worked.",
            `Find worked, then ask how.`,
            `The word answering how worked is an adverb.`,
          );
        } else {
          const superl = i % 2 === 0;
          context = `The ${n} compares ${superl ? "three" : "two"} objects using ${base}.`;
          set(
            "Which form fits this comparison?",
            base + (superl ? "est" : "er"),
            [
              bad(
                "more " + base + "er",
                "Do not use both more and -er together.",
              ),
              bad(
                base + (superl ? "er" : "est"),
                superl
                  ? "The task compares three, so use a superlative."
                  : "The task compares two, so use a comparative.",
              ),
            ],
            `${base + (superl ? "est" : "er")} compares ${superl ? "three or more" : "two"} using the correct ${superl ? "superlative" : "comparative"} form.`,
            `Count how many objects are compared.`,
            `Two takes -er in this example; three or more takes -est.`,
          );
        }
        break;
      }
      case "prepositions": {
        context = `${S} waited beside the tall tree.`;
        set(
          "Which choice is the whole prepositional phrase?",
          "beside the tall tree",
          [
            bad("beside", "This is only the preposition, without its object."),
            bad(
              "the tall tree",
              "This names the object with its describing words but leaves out the preposition.",
            ),
          ],
          `beside is the preposition. tree is its object. The complete phrase is beside the tall tree.`,
          `Find the relationship word telling where the waiting happened.`,
          `Start at beside and include the words through its object tree.`,
        );
        break;
      }
      case "apostrophes": {
        const k = i % 3;
        context =
          k === 0
            ? `The ${n} cannot stay.`
            : k === 1
              ? `One ${n} owns a notebook.`
              : `Several ${nounsAfter[i]}s own notebooks. The ${n} is labeling them.`;
        if (k === 0)
          set(
            "Which contraction replaces cannot?",
            "can’t",
            [
              bad("cant", "The missing letters need an apostrophe."),
              bad(
                "cant’",
                "The apostrophe belongs where letters are missing, not after the whole word.",
              ),
            ],
            "can’t means cannot. The apostrophe replaces the missing letters.",
            `Say the full words and locate the missing letters.`,
            `Keep can and t, with the apostrophe between n and t.`,
          );
        else {
          const owner = k === 1 ? n : nounsAfter[i] + "s",
            ans = owner + (k === 1 ? "’s" : "’");
          set(
            "Which possessive shows who owns the notebook or notebooks?",
            ans,
            [
              bad(owner, "This does not show ownership with an apostrophe."),
              bad(
                k === 1 ? n + "s’" : owner + "’s",
                k === 1
                  ? "This form suggests a regular plural owner; the task says one owner."
                  : "The plural owner already ends in s, so add only an apostrophe.",
              ),
            ],
            `${k === 1 ? "One owner takes apostrophe-s" : "A regular plural owner ending in s takes an apostrophe after s"}: ${ans}.`,
            `Decide whether the owner is one or more than one.`,
            `First write the owner ${owner}; then choose the ownership ending.`,
          );
        }
        break;
      }
      case "dialogue": {
        const k = i % 3;
        if (k === 0) {
          context = `The ${n} said the exact words I am ready.`;
          answer = `“I am ready,” the ${n} said.`;
          set(
            "Choose the correctly punctuated dialogue.",
            answer,
            [
              bad(
                `“I am ready the ${n} said.”`,
                "The speaker tag is not part of the exact words spoken.",
              ),
              bad(
                `“i am ready,” the ${n} said.`,
                "The spoken sentence and the pronoun I need a capital.",
              ),
            ],
            `Only I am ready is spoken. Its statement period changes to a comma before the speaker tag. The closing quotation mark follows that comma.`,
            `Separate the spoken words from the words naming the speaker.`,
            `Quote I am ready, capitalize I, and put a comma inside the closing quotation mark.`,
          );
        } else if (k === 1) {
          context = `Speak directly to the ${n}: please listen.`;
          set(
            "Which choice correctly addresses the person?",
            `${n[0].toUpperCase() + n.slice(1)}, please listen.`,
            [
              bad(
                `${n[0].toUpperCase() + n.slice(1)} please listen.`,
                "Use a comma after the word naming the person being addressed.",
              ),
              bad(
                `${n[0].toUpperCase() + n.slice(1)} please, listen.`,
                "The comma should separate the direct address, not split please listen.",
              ),
            ],
            `The speaker directly addresses the ${n}, so a comma separates that address from please listen.`,
            `Find the word naming the person being spoken to.`,
            `Separate that address from the request with a comma.`,
          );
        } else {
          context = `Wow! The ${n} finished the challenge.`;
          set(
            "Which word is an interjection?",
            "Wow",
            [
              bad(n, `${n} names the subject; it is a noun.`),
              bad("finished", "finished is the verb showing the action."),
            ],
            "Wow expresses a sudden feeling. The exclamation mark matches the strong feeling.",
            `Find the word expressing a quick feeling.`,
            `The feeling word stands before the complete sentence about the ${n}.`,
          );
        }
        break;
      }
      case "word-choice": {
        const k = i % 6;
        const rows = [
          [
            "___ ready to help the " + n + ".",
            "They’re",
            "Their",
            "There",
            "They’re means they are.",
          ],
          [
            "The students brought ___ notebooks to the " + n + ".",
            "their",
            "there",
            "they’re",
            "their shows that the notebooks belong to the students.",
          ],
          [
            "The " + n + " placed the notebook over ___.",
            "there",
            "their",
            "they’re",
            "there points to a place.",
          ],
          [
            "The " + n + " counted ___ notebooks.",
            "two",
            "too",
            "to",
            "two is the number 2.",
          ],
          [
            "Use a formal title before the name Lee.",
            "Dr. Lee",
            "dr. lee",
            "Dr. lee",
            "Capitalize the abbreviation Dr. and the name Lee.",
          ],
          [
            "This is the title of a short story about a " + n + ".",
            "“A Day at the Park”",
            "“a day at the park”",
            "A day at the park",
            "Capitalize the first and major title words and use quotation marks for a short story.",
          ],
        ];
        const r = rows[k];
        if (k === 4) {
          const names = [
            "Lee",
            "King",
            "Green",
            "Hall",
            "Young",
            "Wright",
            "Scott",
            "Baker",
            "Adams",
            "Nelson",
            "Carter",
            "Mitchell",
            "Perez",
            "Roberts",
            "Turner",
            "Phillips",
            "Campbell",
            "Parker",
            "Evans",
            "Edwards",
            "Collins",
            "Stewart",
            "Morris",
            "Rogers",
            "Reed",
            "Cook",
          ];
          r[0] =
            "The " +
            n +
            " is writing a formal title before the name " +
            names[i] +
            ".";
          r[1] = "Dr. " + names[i];
          r[2] = "dr. " + names[i].toLowerCase();
          r[3] = "Dr. " + names[i].toLowerCase();
          r[4] =
            "Capitalize the abbreviation Dr. and the name " + names[i] + ".";
        }
        context = r[0];
        set(
          "Which choice fits the meaning or convention?",
          r[1],
          [
            bad(
              r[2],
              r[4] + " This choice does not follow that meaning or convention.",
            ),
            bad(
              r[3],
              r[4] + " This choice does not follow that meaning or convention.",
            ),
          ],
          r[4],
          `Check meaning first, then capitals or title marks if needed.`,
          `For this context: ${r[4]}`,
        );
        break;
      }
      case "hyphens": {
        const div = syllables[i],
          word = div.replace("-", ""),
          badBreak = word.slice(0, 1) + "-" + word.slice(1);
        context = `The ${n} is printing the word ${word} at the end of a line. A hyphen below marks the line break.`;
        set(
          "Which break falls between the syllables?",
          div,
          [
            bad(
              badBreak,
              "This break splits the first syllable rather than ending it.",
            ),
            bad(
              word + "-",
              "A line-break hyphen belongs between word parts, not after the complete word.",
            ),
          ],
          `${div} divides ${word} between its syllables. In a digital sentence, it is usually better to keep the whole word together.`,
          `Say ${word} in its spoken syllables.`,
          `The first syllable is ${div.split("-")[0]}; the remaining syllable starts on the next line.`,
        );
        break;
      }
      case "complete-subject":
        set(
          "Which choice is the complete subject?",
          S,
          [
            bad(
              n,
              `${n} is the simple subject, without the words that describe or point to it.`,
            ),
            bad(P, `“${P}” is the predicate telling what happened.`),
          ],
          `${S} includes the main subject ${n} and The ${a}, the words that go with it.`,
          `Ask who ${v}, keeping all the words naming that subject.`,
          `The whole subject ends just before ${v}.`,
        );
        break;
      case "agreement": {
        context = `The ${n} with several notebooks ___ ready.`;
        set(
          "Which present-tense verb agrees with the subject?",
          "is",
          [
            bad("are", `The subject is the singular ${n}, not notebooks.`),
            bad(
              "be",
              "The base form be does not fit this present-tense statement.",
            ),
          ],
          `The simple subject ${n} is singular, so use is. with several notebooks does not change the subject’s number.`,
          `Find the main subject outside the with phrase.`,
          `Try The ${n} ___ ready without the extra phrase.`,
        );
        break;
      }
      case "compound": {
        const second = "the class listened carefully";
        context = `${F} ${second[0].toUpperCase() + second.slice(1)}.`;
        answer = `${F.slice(0, -1)}, and ${second}.`;
        set(
          "Which choice joins both complete thoughts as a compound sentence?",
          answer,
          [
            bad(
              `${F.slice(0, -1)}, ${second}.`,
              "A comma alone cannot join two independent clauses.",
            ),
            bad(
              `${F.slice(0, -1)} and listened carefully.`,
              "This makes the subject do the listening and drops the class; it does not preserve both complete thoughts.",
            ),
          ],
          `Both ${F.slice(0, -1)} and ${second} can stand alone. A comma plus and joins them.`,
          `Find the subject and verb in each complete thought.`,
          `Keep both subjects and place comma-and between the complete thoughts.`,
        );
        break;
      }
      case "complex": {
        const k = i % 2;
        context =
          k === 0
            ? `Use because to connect rain falling with this action: ${F}`
            : `Describe the ${n} as someone who practiced.`;
        answer =
          k === 0
            ? `Because rain fell, ${S.toLowerCase()} ${P}.`
            : `The ${n} who practiced improved.`;
        set(
          "Which choice is a complete complex sentence?",
          answer,
          k === 0
            ? [
                bad(
                  "Because rain fell.",
                  "Because makes this thought dependent; it needs a complete main clause.",
                ),
                bad(
                  `Because rain fell ${S.toLowerCase()} ${P}.`,
                  "A dependent clause at the start needs a comma before the main clause.",
                ),
              ]
            : [
                bad(
                  "Who practiced.",
                  "Who practiced cannot stand alone as the sentence intended here.",
                ),
                bad(
                  `The ${n} who practiced.`,
                  "The noun with its relative clause still needs a main predicate.",
                ),
              ],
          k === 0
            ? `Because rain fell is dependent. ${S} ${P} is a complete main clause. A comma separates the opening dependent clause.`
            : `who practiced describes ${n}. improved is the main predicate, so the sentence is complete.`,
          `Find a main clause that can stand alone.`,
          k === 0
            ? "The word because makes the opening clause depend on the rest; add the main thought after a comma."
            : `The clause who practiced describes the ${n}; the whole sentence still needs its main action.`,
        );
        break;
      }
      case "builder": {
        context = `Arrange these chunks without adding words: ${P} / ${S}`;
        set(
          "Which order makes the intended complete statement?",
          F,
          [
            bad(
              `${P} ${S}.`,
              "This puts the action and its object before the subject in an unclear statement.",
            ),
            bad(
              S + ".",
              "This drops the action chunk, leaving an unfinished thought.",
            ),
          ],
          `${S} names who, and ${P} tells what happened. Keep the subject and predicate together and add a period.`,
          `Start with who the statement is about.`,
          `Put the subject chunk before the action chunk, then check the capital and ending mark.`,
        );
        break;
      }
      case "fixer": {
        context = `${F.slice(0, -1)} the class watched.`;
        set(
          "Which correction separates the two complete thoughts?",
          `${F} The class watched.`,
          [
            bad(
              `${F.slice(0, -1)}, the class watched.`,
              "This is a comma splice: two complete thoughts joined by a comma alone.",
            ),
            bad(
              `${S}. ${P} the class watched.`,
              "The first piece names only the subject, leaving a fragment.",
            ),
          ],
          `The two thoughts are ${F} and The class watched. A period and a capital separate them clearly.`,
          `Find both subjects and both verbs.`,
          `End the first complete thought after ${s.rest}; start The class watched with a capital.`,
        );
        break;
      }
      case "expand": {
        context = `Expand this sentence without changing its event: The ${n} ${v}.`;
        set(
          "Which expansion adds details and keeps the original action?",
          F,
          [
            bad(
              `The ${n} slept all afternoon.`,
              "This changes the action instead of expanding the original event.",
            ),
            bad(
              `The ${a} ${n}.`,
              "This adds a description but removes the action, creating a fragment.",
            ),
          ],
          `${F} keeps the ${n} and the action ${v}, then adds descriptive and action details.`,
          `Keep who acts and what the action is.`,
          `Check that ${n} still ${v}; details must add to that same event.`,
        );
        break;
      }
      case "combine": {
        context = `The ${n} ${v} ${s.rest}. The ${n} smiled.`;
        answer = `The ${n} ${v} ${s.rest} and smiled.`;
        set(
          "Which combination keeps both actions and removes the repeated subject?",
          answer,
          [
            bad(
              `The ${n} smiled.`,
              "This drops the first action and its details.",
            ),
            bad(
              `The ${n} ${v} ${s.rest}, smiled.`,
              "A comma alone does not correctly join these shared-subject actions here.",
            ),
          ],
          `The same ${n} performs both actions. Keep the subject once and join the actions with and. This is a simple sentence with a compound predicate.`,
          `Notice that both original sentences have the same subject.`,
          `Keep ${v} ${s.rest} and smiled after one subject.`,
        );
        break;
      }
      case "revise": {
        context = `Draft: The ${n} did something. Revision: ${F}`;
        set(
          "What did this revision mainly improve?",
          "It replaced a vague action with specific information.",
          [
            bad(
              "It only fixed a capital letter.",
              "Both versions already begin with The.",
            ),
            bad(
              "It changed a question into a statement.",
              "Both versions are statements.",
            ),
          ],
          `The draft’s did something is vague. The revision tells exactly what happened: ${P}.`,
          `Compare the action information in the two versions.`,
          `Look at did something beside ${P}; decide whether meaning or only a surface mark improved.`,
        );
        break;
      }
      case "paragraph": {
        context = `Topic: Watching people and animals work can teach us. Detail: ${F}`;
        set(
          "Which sentence could add a related reflection?",
          "I learned a useful lesson by watching that action.",
          [
            bad(
              "My favorite number has three digits.",
              "A favorite number does not explain learning by observation here.",
            ),
            bad(
              "The moon has many craters.",
              "This introduces an unrelated topic rather than developing the main idea.",
            ),
          ],
          `The reflection connects watching the ${n} with learning. The other choices introduce unrelated topics.`,
          `Keep the topic about learning by observing.`,
          `Choose a sentence that connects the action you watched to the topic sentence.`,
        );
        break;
      }
      case "sequence": {
        context = `First, we arrived to watch the ${n}. ___, we watched the activity. Finally, we discussed what we learned.`;
        set(
          "Which transition fits the middle event?",
          "Next",
          [
            bad(
              "Before we arrived",
              "The group cannot watch this activity before the arrival already described.",
            ),
            bad(
              "Finally",
              "A separate final discussion follows; this is the middle event.",
            ),
          ],
          `Next connects the watching event after arriving and before the final discussion.`,
          `Trace the order: arrive, watch, discuss.`,
          `The blank connects the middle event, so use a transition for what comes next.`,
        );
        break;
      }
      case "narrative":
      case "weekend": {
        context = `${lesson.id === "weekend" ? "Weekend News" : "Story"} draft: ${F} I watched nearby.`;
        set(
          "Which addition gives a relevant reaction from the narrator?",
          "I felt curious and wanted to understand what happened.",
          [
            bad(
              "All stories must happen on the same day.",
              "This is a false rule, not the narrator’s reaction.",
            ),
            bad(
              "A triangle has three sides.",
              "This fact does not develop this event or the narrator’s reaction.",
            ),
          ],
          `The reaction shows the narrator’s feelings while watching the ${n}. It connects to the event instead of introducing an unrelated fact.`,
          `Ask what the narrator felt or thought about this event.`,
          `A narrative can include a reaction connected to its action; find the choice expressing that reaction.`,
        );
        break;
      }
      case "opinion": {
        context = `Opinion: Our class should learn more about the work of a ${n}.`;
        set(
          "Which reason best supports that opinion?",
          "Studying that work could help us understand a useful skill.",
          [
            bad(
              "A rectangle has four sides.",
              "This does not explain why the class should study this work.",
            ),
            bad(
              "We should learn more because we should learn more.",
              "Repeating the opinion does not add a supporting reason.",
            ),
          ],
          `Learning a useful skill explains why studying the ${n} could benefit the class. It supports the opinion rather than repeating it.`,
          `Look for a reason connected to the proposed learning.`,
          `Ask how studying the ${n} could help the class; a reason must add an explanation.`,
        );
        break;
      }
      case "informational": {
        context = `Supplied observation: ${F}`;
        set(
          "Which statement reports only information supported by the observation?",
          `The ${n} ${P}.`,
          [
            bad(
              `The ${n} is the best in the world.`,
              "The observation does not compare everyone in the world or establish who is best.",
            ),
            bad(
              `The ${n} does this every morning.`,
              "The observation reports one event and does not establish a daily routine.",
            ),
          ],
          `The observation supports the action ${P}. It does not support a world ranking or an every-morning claim.`,
          `Separate what you actually read from guesses or opinions.`,
          `Find the claim that keeps the reported action without adding unobserved information.`,
        );
        break;
      }
      default:
        throw new Error("Missing authored question family " + lesson.id);
    }
    const comp = refine(lesson, i, s) || composition(lesson, i, s);
    if (comp) {
      context = comp.context;
      [prompt, answer, wrong, reason] = comp.row;
      [clue, walk] = coach(lesson, prompt, s);
    }
    return item(lesson, i, prompt, context, answer, wrong, reason, clue, walk);
  }
  function writing(lesson, index, form) {
    const topics =
      form === 0
        ? ["school", "a sport or hobby", "nature"]
        : ["family life", "a community activity", "science"];
    const topic = topics[index % 3];
    const prompts = [
      `${lesson.write} Use ${topic} for your topic.`,
      `Apply this skill to a different example about ${topic}: ${lesson.objective.slice(6)}. Write your own sentence or short paragraph.`,
      `Read your earlier writing in this session. Copy one original sentence, write a revised version, and explain how the change improves ${lesson.title.toLowerCase()}. If you have not written yet, draft a sentence first.`,
    ];
    return {
      id: `${lesson.id}-write-${form}-${index}`,
      type: "writing",
      skill: lesson.id,
      prompt: prompts[index],
      context:
        lesson.id === "informational"
          ? "Supplied fact box: A plant needs light, water, and air. Roots absorb water. Too much water can harm the roots. Use these supplied facts, or identify another reliable source. Your original writing needs grown-up review."
          : "Your words matter. Many answers can be correct. A grown-up reviews this writing with the lesson checklist.",
      criteria: lesson.criteria,
      model: `One model for this skill: ${writingModels[lesson.id]} This is a model, not the only acceptable original response.`,
      hints: [
        lesson.definition,
        lesson.steps[0],
        lesson.steps.slice(1).join(" "),
      ],
      reason:
        "Use the checklist with a grown-up. Keep your original and revision; do not replace your words with a model.",
    };
  }
  function questions(id, mode, form = 0, seed = 0) {
    const l = C.lessons.find((x) => x.id === id);
    if (!l) throw new Error("Unknown lesson");
    const bank = C.contexts.map((_, i) => make(l, i, form));
    if (mode === "test")
      return bank
        .map((q) =>
          form % 2 === 0
            ? { ...q, id: q.id + "-A" }
            : {
                ...q,
                id: q.id + "-B",
                type: "short",
                responseBank: q.choices,
                prompt:
                  q.prompt +
                  " Type the exact correct word, phrase, or sentence. Use the requested form; this task is checked against one specified answer.",
                choices: undefined,
              },
        )
        .concat([0, 1, 2].map((i) => writing(l, i, form % 2)));
    const offset = (seed * 7) % 26,
      ordered = bank.map((_, i) => bank[(i + offset) % 26]);
    if (mode === "guided" && l.id === "verbs" && root.SS_VERB_REFERENCE) {
      const old = root.SS_VERB_REFERENCE;
      return old.stages
        .flatMap((_, stage) => {
          const pool = old.questions.filter((q) => q.stage === stage);
          return Array.from({ length: 3 }, (_, j) => {
            const q = pool[(j + seed * 3) % pool.length],
              correct = q.choices.find((c) => c.correct);
            return {
              id: `verbs-reference-${stage}-${pool.indexOf(q)}`,
              type: "choice",
              skill: l.id,
              level: stage,
              prompt: q.question,
              context: q.sentence.words.join(" "),
              answer: correct.text,
              choices: q.choices.map((c, i) => ({
                id: c.correct ? "key" : "d" + i,
                text: c.text,
                feedback: c.feedback,
              })),
              reason: q.reveal,
              hints: [
                l.definition,
                q.clue,
                q.choices.find((c) => !c.correct).feedback,
              ],
            };
          });
        })
        .concat(
          [bank[1], bank[2], bank[4]].map((q) => ({
            ...q,
            id: q.id + "-helper-review",
            level: 4,
          })),
        );
    }
    if (mode === "guided") {
      return [
        [0, 8],
        [8, 18],
        [18, 26],
      ].flatMap(([start, end]) =>
        Array.from(
          { length: 4 },
          (_, j) => bank[start + ((j + seed * 3) % (end - start))],
        ),
      );
    }
    if (mode === "independent")
      return ordered
        .slice(12, 20)
        .concat([writing(l, 0, seed % 2), writing(l, 1, seed % 2)]);
    throw new Error("Unknown stage");
  }
  C.questions = questions;
  C.example = (id) =>
    make(
      C.lessons.find((l) => l.id === id),
      0,
    );
  if (typeof module !== "undefined") module.exports = { make, questions };
})(typeof window === "undefined" ? globalThis : window);
