/* =========================================================
   Sentence Sense — Complete Sentence hints (Build 1.9.1 repair)

   The 1.8 hints for this skill repeated the directions ("Remember: ask
   who or what...") and Hint 2 crossed answers out. Each item now gets:
     clue  (Hint 1): the first concrete move on THIS sentence
     step2 (Hint 2): the next reasoning step, instead of crossing out
   Hint 3 (the existing walk-through) is unchanged.

   Keyed by the exact sentence so every item is matched on purpose; the
   verification harness checks that all of them were applied.
   ========================================================= */
(function () {
  "use strict";
  const t = window.SS_LEARN_CONTENT && window.SS_LEARN_CONTENT.topics["complete-sentence"];
  if (!t) return;

  const noWho = (verb, ask) => ({
    clue: "Find the action word: " + verb + ". Now ask: " + ask,
    step2: "Look at the words before " + verb + ". Is there a name, or words like she, we, or the dog? If no one is named, the sentence doesn't say who did it."
  });
  const full = (verb, ask) => ({
    clue: "Find the action word: " + verb + ". Now ask: " + ask,
    step2: "Look before " + verb + ". Is someone or something named there? Then ask: does the thought sound finished when you read it out loud?"
  });
  const noWhat = thing => ({
    clue: "Read it and ask: what did " + thing + " do, or what is it?",
    step2: "Look for an action word like ran, ate, grew, or is. Words like tall, red, and noisy only describe. If there is no action word, the sentence doesn't tell what happened."
  });
  const runOn = first => ({
    clue: "Read it slowly. Where could you stop and still have a whole thought?",
    step2: "Try stopping after “" + first + "”. Is that a whole thought? Is the rest a whole thought too? Is there a period, or a comma and a joining word, between them?"
  });

  const HINTS = {
    "Jumped into the cool water at the pool.": noWho("jumped", "Who jumped?"),
    "My cousin jumped into the cool water at the pool.": full("jumped", "Who jumped?"),
    "Painted a bright picture of the ocean.": noWho("painted", "Who painted?"),
    "Carried the heavy groceries up the stairs.": noWho("carried", "Who carried the groceries?"),
    "Our class painted a bright picture of the ocean.": full("painted", "Who painted?"),
    "The tall girl with the red backpack.": noWhat("the tall girl"),
    "The noisy crowd at the baseball game.": noWhat("the noisy crowd"),
    "The noisy crowd cheered at the baseball game.": full("cheered", "Who cheered?"),
    "My grandmother's garden behind the house.": noWhat("the garden"),
    "Walked slowly to the bus stop.": noWho("walked", "Who walked?"),
    "The rain stopped we went outside to play.": runOn("The rain stopped"),
    "Mia finished her homework she went to bed.": runOn("Mia finished her homework"),
    "The rain stopped, so we went outside to play.": {
      clue: "Find the two thoughts. What is between them?",
      step2: "“The rain stopped” is one thought. “we went outside to play” is another. Between them is a comma and the joining word so. Is that a way to join two thoughts?"
    },
    "My brother likes soccer I like basketball.": runOn("My brother likes soccer"),
    "After the storm, the tall tree near our house.": noWhat("the tall tree"),
    "The puppy was sleepy it took a long nap.": {
      clue: "Find where the first thought ends: “The puppy was sleepy.”",
      step2: "Check each choice: does it end the first thought after sleepy, and start the next thought with a capital letter?"
    },
    "Ran all the way to the playground.": {
      clue: "Ask: who ran? A good fix adds who.",
      step2: "Check each choice: does it add someone who ran, and still keep the word ran?"
    },
    "The new library in our town.": {
      clue: "Ask: what did the new library do? A good fix adds what happened.",
      step2: "Check each choice: does it keep “The new library in our town” and add an action word that tells what it did?"
    },
    "I wanted to swim it was too cold.": {
      clue: "There are two thoughts: “I wanted to swim” and “it was too cold.”",
      step2: "Check each choice: is the comma right after swim, before the joining word but?"
    },
    "We packed our lunches we got on the bus.": {
      clue: "There are two thoughts: “We packed our lunches” and “we got on the bus.”",
      step2: "Check each choice: is the comma right after lunches, before the joining word and?"
    },
    /* Learn "Let me try" */
    "Played catch with his dad after dinner.": noWho("played", "Who played catch?")
  };

  let applied = 0;
  const apply = q => {
    if (!q || !q.sentence) return;
    const h = HINTS[q.sentence.words.join(" ")];
    if (!h) return;
    q.clue = h.clue;
    q.step2 = h.step2;
    applied++;
  };
  (t.tryItBank && t.tryItBank.questions || []).forEach(apply);
  apply(t.learnTry);
  window.SS_HINTS_APPLIED = { "complete-sentence": { applied: applied, expected: Object.keys(HINTS).length } };
})();
