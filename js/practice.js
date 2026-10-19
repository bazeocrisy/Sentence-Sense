/* =========================================================
   Sentence Sense — shared PRACTICE component (Build 1.4.0; Help me added in 1.5.0)

   One practice engine for every skill. A skill runs it if its content
   carries a `tryItBank`; otherwise Practice shows the honest "coming
   next" state and this file is never entered.

   In Build 1.4.0 the Verb bank is reached the normal way:
   Home -> Verb -> Practice. The ?verb=classic query route that made it
   reachable in 1.3.0 is GONE, and with it the hidden duplicate child
   experience it created.

   WHAT THIS ENGINE PRESERVES, AND WHY (brief section 14)
   ------------------------------------------------------
   20 questions, four stages of five. The five inside a stage are
   shuffled, so returning is not a memory test of the order, and the
   stages stay in order so difficulty banding is preserved.

   D-29: choices are shuffled at RENDER time. Before 1.2.7 the correct
   answer sat in position 3 in 16 of the 20 questions and never in
   position 1 or 4 -- a child could clear the whole bank by pressing
   the third button and never earn the teaching a wrong answer buys.

   D-36: each button carries its ORIGINAL index in `dataset.ci`.
   Answer identity never depends on rendered text, so the guided
   reveal still finds the right button when the order changes.

   D-30: the completion recap is CONTENT. The engine does not know
   what any skill teaches, so a future bank cannot tell a child they
   practiced finding verbs when they practiced something else.

   THIS IS PRACTICE, SO A WRONG ANSWER BUYS TEACHING, NOT A MARK
     A wrong answer -> what that word actually does in THIS sentence,
                       and an invitation to try again or press Help me.
     3rd wrong      -> only the answer is left: guided reveal, move on.

   HELP ME (Build 1.5.0, owner-approved 2026-10-19)
   The child asks for help instead of guessing for it. Each press gives
   ONE more step, and asking is never an error -- no attempt is counted:
     Help 1 -> the strategy for this skill (the question's `clue`)
     Help 2 -> narrow it down: all but one wrong choice is crossed out
     Help 3 -> walk through it (`reveal`), with the answer outlined --
               but the CHILD still taps it; the help never answers for them
   A question finished with Help 3 or a third-miss reveal comes back once,
   later in the same stage, reshuffled -- so walking through it becomes
   doing it. No score, no message about it, nothing stored.

   Nothing is scored, timed or stored. Nothing auto-advances: the child
   always presses the button themselves.
   ========================================================= */

(function () {
  "use strict";

  const C = window.SS_LEARN_CONTENT;
  const S = window.SS_SENTENCE;
  const make = S.make;
  const clear = S.clear;
  const el = id => document.getElementById(id);

  /* The markup wording for the milestone continue button, captured once
     at init so a stage-supplied label can be applied without duplicating
     the default here, and without it being lost when a later stage
     supplies none. */
  let continueDefault = "";

  const run = {
    topicKey: null,
    bank: null,
    order: [],          // question indices, shuffled inside each stage
    pos: 0,             // 0-based position in `order`
    attempts: 0,        // wrong attempts on the CURRENT question (0-3)
    help: 0,            // Help me steps used on the CURRENT question (0-3)
    returned: [],       // question indices already sent back once
    answered: false,
    milestoneStage: -1, // stage index while a milestone screen is showing
    done: false
  };

  /* Fisher-Yates, scoped to one stage so difficulty banding is preserved. */
  function shuffled(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function bankFor(topicKey) {
    const t = C.topics[topicKey];
    return (t && t.tryItBank && t.tryItBank.questions && t.tryItBank.questions.length)
      ? t.tryItBank : null;
  }

  function hasBank(topicKey) { return !!bankFor(topicKey); }

  /* Build the running order: shuffle inside each stage, keep the stages in
     order. Stage 1's five all come before any of Stage 2's. */
  function reset(topicKey) {
    const bank = bankFor(topicKey);
    run.topicKey = topicKey;
    run.bank = bank;
    run.order = [];
    run.pos = 0;
    run.attempts = 0;
    run.help = 0;
    run.returned = [];
    run.answered = false;
    run.milestoneStage = -1;
    run.done = false;
    if (!bank) return;
    bank.stages.forEach((st, si) => {
      const idx = [];
      bank.questions.forEach((q, qi) => { if (q.stage === si) idx.push(qi); });
      shuffled(idx).forEach(i => run.order.push(i));
    });
  }

  function current() {
    if (!run.bank) return null;
    const i = run.order[run.pos];
    return (i === undefined) ? null : run.bank.questions[i];
  }

  /* =========================================================
     ENTRY
     ========================================================= */
  function start(topicKey) {
    if (!hasBank(topicKey)) return;
    reset(topicKey);

    const t = C.topics[topicKey];
    el("screen-practice").dataset.topic = t.color;
    el("practice-skill-tag").textContent = t.tag || t.name;

    window.SS_SHELL.showScreen("practice");
    buildQuestion();
    el("practice-heading").focus();
  }

  /* =========================================================
     ONE QUESTION
     ========================================================= */
  /* Build 1.5.0: the Georgia standard behind THIS question. Banks written
     for 1.5.0 tag every question (`std`); older banks fall back to the
     skill's own codes. GUM chart rows have no official code of their own,
     so they show under 3-5.L.GC.1 with the chart skill named. */
  const CODE_NAME = {
    "3.L.GC.2.a": "Correctly built sentences", "3.L.GC.2.b": "Sentence variety and keeping the tense",
    "3.L.GC.2.c": "Subject-verb agreement", "3.L.GC.2.d": "Add detail with adjectives and adverbs",
    "3.L.V.2.b": "Word endings signal the part of speech"
  };
  const GUM_LEVEL = { M: "Master", C: "Continue", I: "Introduce", R: "Review" };
  const GUM_NAME = {
    "action-verbs": "Action verbs", "adjectives-adverbs": "Adjectives and adverbs",
    "collective-abstract-nouns": "Collective and abstract nouns", "common-proper-nouns": "Common and proper nouns",
    "coordinating-conjunctions": "Joining words: and, but, or, so", "helping-linking-verbs": "Helping and linking verbs",
    "irregular-past-verbs": "Irregular past tense", "personal-pronouns": "Personal pronouns",
    "prepositional-phrases": "Prepositional phrases", "reflexive-pronouns": "Reflexive pronouns",
    "simple-verb-tenses": "Simple verb tenses", "verbs-add-s-es": "Verbs that add -s or -es",
    "capitalize-first-word": "Capital at the start", "comma-coordinating-conjunction": "Comma before and, but, or, so",
    "end-punctuation": "End marks", "complete-thoughts": "Complete thoughts", "pronoun-antecedent": "Pronoun agreement"
  };
  function gaFor(q) {
    if (q.std && q.std.length) {
      return q.std.map(tag => {
        const m = /^GUM:[GUM]:([a-z0-9-]+):([ICMR])$/.exec(tag);
        if (!m) return { code: tag, label: CODE_NAME[tag] || "" };
        const words = GUM_NAME[m[1]] || m[1].replace(/-/g, " ");
        return { code: "3-5.L.GC.1", label: words + " (" + GUM_LEVEL[m[2]] + ")" };
      });
    }
    return C.topics[run.topicKey].ga || [];
  }

  function renderHead(q) {
    const st = run.bank.stages[q.stage];
    const oldGa = el("practice-ga");
    if (oldGa) oldGa.remove();
    if (window.SS_GA) {
      const ga = window.SS_GA.line(gaFor(q));
      ga.id = "practice-ga";
      el("practice-stage-desc").insertAdjacentElement("afterend", ga);
    }
    /* The count is of DIFFERENT questions, so a question that comes back
       never changes the total the child was promised. */
    const qi = run.order[run.pos];
    const firstAt = run.order.indexOf(qi);
    const seen = new Set(run.order.slice(0, run.pos + 1)).size;
    el("practice-count").textContent = (firstAt < run.pos)
      ? "Let's try this one again"
      : "Question " + seen + " of " + run.bank.questions.length;
    el("practice-stage").textContent = "Stage " + (q.stage + 1) + ": " + st.name;
    el("practice-stage-desc").textContent = st.desc;

    /* A plain, non-numeric sense of place. Never a score or a percentage. */
    const bar = el("practice-bar");
    if (bar) {
      const done = new Set(run.order.slice(0, run.pos)).size;
      const pct = Math.round((done / run.bank.questions.length) * 100);
      bar.style.width = pct + "%";
      bar.parentNode.setAttribute("aria-hidden", "true");
    }
  }

  /* The advance button carries the pacing. Nothing auto-advances. */
  function setNext(ready) {
    const next = el("practice-next");
    const last = run.pos >= run.order.length - 1;
    next.textContent = last ? "Finish" : "Next";
    next.disabled = !ready;
  }

  function buildQuestion() {
    const q = current();
    if (!q) return;
    run.attempts = 0;
    run.help = 0;
    run.answered = false;

    el("practice-milestone").hidden = true;
    el("practice-done").hidden = true;
    el("practice-stage-wrap").hidden = false;
    el("practice-controls").hidden = false;
    run.milestoneStage = -1;

    el("practice-heading").textContent = q.question;
    renderHead(q);
    S.renderSentence(el("practice-sentence"), q.sentence);

    const host = el("practice-choices");
    clear(host);
    const longest = q.choices.reduce((n, c) => Math.max(n, c.text.length), 0);
    host.classList.toggle("is-wide", longest > 12);
    host.classList.toggle("is-sentences", longest > 30);

    shuffled(q.choices.map((c, i) => i)).forEach(ci => {
      const choice = q.choices[ci];
      const btn = make("button", "choice-btn");
      btn.type = "button";
      btn.dataset.ci = String(ci);
      btn.textContent = choice.text;
      btn.addEventListener("click", () => answer(btn, choice, q));
      host.appendChild(btn);
    });

    const fb = el("practice-feedback");
    fb.hidden = true;
    fb.className = "answer-feedback";
    clear(fb);

    const helpBtn = el("practice-help");
    helpBtn.hidden = false;
    helpBtn.disabled = false;
    helpBtn.textContent = "Help me";

    setNext(false);
  }

  /* SCROLL RECOVERY after feedback expands.

     A wrong answer grows the feedback panel in place, which pushes the
     controls down. On a short screen that puts the way forward below the
     fold, and nothing brought it back: the child was left reading an
     explanation whose last line was cut, with no visible next step.

     A correct answer never had this problem because focusing the Next
     button scrolls it into view for free. A wrong answer must not steal
     focus -- the child is still choosing -- so the scroll is done
     explicitly instead, and only when the control is genuinely out of
     view, so nothing moves on a tall screen. */
  function revealControls() {
    const anchor = el("practice-controls") || el("practice-next");
    if (!anchor || anchor.offsetParent === null) return;
    const r = anchor.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    if (r.top >= 0 && r.bottom <= vh) return;          /* already visible */
    const reduce = window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    anchor.scrollIntoView({ block: "end", inline: "nearest",
                            behavior: reduce ? "auto" : "smooth" });
  }

  function feedback(kind, parts, label) {
    const fb = el("practice-feedback");
    fb.hidden = false;
    fb.className = "answer-feedback is-" + kind;
    clear(fb);
    fb.appendChild(make("span", "fb-mark", kind === "right" ? "✓" : "✕"));
    if (label) fb.appendChild(make("span", "fb-label", label));
    const body = make("span", "fb-body");
    parts.forEach((p, i) => {
      body.appendChild(make("span", i === 0 ? "fb-text" : "fb-again", p));
    });
    fb.appendChild(body);
  }

  function lockAll(buttons) {
    Array.prototype.forEach.call(buttons, b => { b.disabled = true; });
  }

  function answer(btn, choice, q) {
    const buttons = el("practice-choices").querySelectorAll(".choice-btn");

    if (choice.correct) {
      run.answered = true;
      lockAll(buttons);
      Array.prototype.forEach.call(buttons, b => b.classList.remove("is-wrong", "is-hint"));
      btn.classList.add("is-right");
      /* Feedback matters most when the child is RIGHT, and it teaches
         rather than praising the person. */
      feedback("right", [choice.feedback]);
      el("practice-help").disabled = true;
      setNext(true);
      el("practice-next").focus();
      return;
    }

    run.attempts += 1;
    btn.classList.add("is-wrong");
    btn.disabled = true;

    const remaining = Array.prototype.filter.call(buttons, x => !x.disabled).length;
    if (remaining > 1) {
      /* What that word actually does here, then the two ways forward:
         try again, or ask for the next step of help. The child chooses. */
      feedback("wrong", [choice.feedback,
        run.help < 3 ? "Try again, or press Help me for a hint." : "Try again."]);
      revealControls();
    } else {
      /* Third miss: find it together rather than leave the child stuck.
         D-36: match the correct button by its original choice index,
         never by rendered text. */
      const correctIndex = q.choices.findIndex(c => c.correct);
      const right = Array.prototype.filter.call(buttons,
        b => Number(b.dataset.ci) === correctIndex)[0];
      lockAll(buttons);
      if (right) { right.classList.add("is-right"); right.classList.remove("is-hint"); }
      /* Audit S-10: the child missed three times, so this is a walk-through,
         not a celebration -- the neutral help style, never a green tick. */
      feedback("clue", [q.reveal], "Let's find it together");
      run.answered = true;
      el("practice-help").disabled = true;
      sendBack();
      setNext(true);
      el("practice-next").focus();
      return;
    }

    const nextChoice = Array.prototype.filter.call(buttons, x => !x.disabled)[0];
    if (nextChoice) nextChoice.focus();
  }

  /* HELP ME — one step per press. Asking is not an error: no attempt is
     counted and nothing the child chose is marked wrong by it. */
  function help() {
    const q = current();
    if (!q || run.answered || run.help >= 3) return;
    run.help += 1;
    const buttons = el("practice-choices").querySelectorAll(".choice-btn");
    const correctIndex = q.choices.findIndex(c => c.correct);

    if (run.help === 1) {
      /* The strategy, in this skill's own words. */
      feedback("clue", [q.clue], "Hint 1 of 3");
    } else if (run.help === 2) {
      /* Narrow it down to two. Cross out every wrong choice still open
         except one, picked at random so the survivor is not a pattern. */
      const open = Array.prototype.filter.call(buttons,
        b => !b.disabled && Number(b.dataset.ci) !== correctIndex);
      shuffled(open).slice(1).forEach(b => {
        b.disabled = true;
        b.classList.add("is-ruled-out");
      });
      /* The strategy stays on screen with it: Help 2 replaces Help 1's panel. */
      feedback("clue", ["Some answers are crossed out. It is one of the two that are left.", q.clue], "Hint 2 of 3");
    } else {
      /* Walk through it. The answer is outlined, never pressed for the
         child: they still tap it themselves. */
      Array.prototype.forEach.call(buttons, b => {
        if (Number(b.dataset.ci) === correctIndex) b.classList.add("is-hint");
      });
      feedback("clue", [q.reveal, "Now tap the answer to keep going."], "Hint 3 of 3");
      sendBack();
    }

    const btn = el("practice-help");
    btn.disabled = run.help >= 3;
    btn.textContent = run.help >= 3 ? "Help me" : "Help me (next hint)";
    revealControls();
  }

  /* A question the child needed walking through comes back ONCE, later in
     the same stage and reshuffled. Never immediately: if nothing else is
     left in this stage, it does not come back. */
  function sendBack() {
    const qi = run.order[run.pos];
    if (run.returned.indexOf(qi) !== -1) return;
    const stage = run.bank.questions[qi].stage;
    let last = run.pos;
    for (let i = run.pos + 1; i < run.order.length; i++) {
      if (run.bank.questions[run.order[i]].stage === stage) last = i; else break;
    }
    if (last === run.pos) return;
    run.returned.push(qi);
    run.order.splice(last + 1, 0, qi);
  }

  /* =========================================================
     BETWEEN STAGES
     Encouragement, never a score.
     ========================================================= */
  function showMilestone(stageIndex) {
    const st = run.bank.stages[stageIndex];
    run.milestoneStage = stageIndex;
    el("practice-stage-wrap").hidden = true;
    el("practice-controls").hidden = true;
    el("practice-done").hidden = true;
    el("practice-milestone").hidden = false;
    el("pm-mark").textContent = st.mark;
    el("pm-title").textContent = st.milestoneTitle;
    el("pm-line").textContent = st.milestoneLine;
    el("pm-next").textContent = st.nextStage ? ("Next: " + st.nextStage) : "";
    el("pm-next").hidden = !st.nextStage;
    /* An OPTIONAL per-stage label, so the forward control can name the
       stage the child is about to start instead of saying nothing in
       particular. Purely additive: a stage without `continueLabel` gets
       the markup wording back, which is why Verb reads exactly as before.
       The click handler is not touched -- this is wording, not behaviour. */
    el("pm-continue").textContent = st.continueLabel || continueDefault;
    el("pm-title").focus();
    window.scrollTo(0, 0);
  }

  function leaveMilestone() {
    run.milestoneStage = -1;
    el("practice-milestone").hidden = true;
    buildQuestion();
    el("practice-heading").focus();
    window.scrollTo(0, 0);
  }

  function advance() {
    const q = current();
    const wasStage = q ? q.stage : 0;
    run.pos += 1;

    if (run.pos >= run.order.length) { showDone(); return; }

    const nextQ = current();
    if (nextQ && nextQ.stage !== wasStage) { showMilestone(wasStage); return; }

    buildQuestion();
    el("practice-heading").focus();
    window.scrollTo(0, 0);
  }

  function next() {
    if (run.answered) advance();
  }

  /* =========================================================
     COMPLETION
     ========================================================= */
  function showDone() {
    const t = C.topics[run.topicKey];
    run.done = true;

    el("practice-stage-wrap").hidden = true;
    el("practice-controls").hidden = true;
    el("practice-milestone").hidden = true;
    el("practice-done").hidden = false;

    el("practice-done-title").textContent = "You practiced " + t.name + "!";
    /* D-30: the recap belongs to the content. */
    el("practice-done-recap").textContent =
      (run.bank && run.bank.recap) ? run.bank.recap : t.recap;

    el("practice-done-title").focus();
    window.scrollTo(0, 0);
  }

  /* =========================================================
     INIT + PUBLIC API
     ========================================================= */
  function init() {
    el("practice-next").addEventListener("click", next);
    el("practice-help").addEventListener("click", help);
    el("practice-back").addEventListener("click",
      () => window.SS_SHELL.openSkill(run.topicKey));
    el("practice-home").addEventListener("click", () => window.SS_SHELL.goHome());

    continueDefault = el("pm-continue").textContent;
    el("pm-continue").addEventListener("click", leaveMilestone);
    el("pm-skill").addEventListener("click",
      () => window.SS_SHELL.openSkill(run.topicKey));
    el("pm-home").addEventListener("click", () => window.SS_SHELL.goHome());

    el("practice-done-again").addEventListener("click", () => start(run.topicKey));
    el("practice-done-skill").addEventListener("click",
      () => window.SS_SHELL.openSkill(run.topicKey));
    el("practice-done-home").addEventListener("click", () => window.SS_SHELL.goHome());
  }

  window.SS_PRACTICE = {
    init: init,
    start: start,
    hasBank: hasBank,
    /* read-only hook for the audit harness */
    state: () => ({
      topicKey: run.topicKey,
      pos: run.pos,
      order: run.order.slice(),
      attempts: run.attempts,
      help: run.help,
      returned: run.returned.slice(),
      answered: run.answered,
      milestone: run.milestoneStage,
      done: run.done,
      total: run.order.length
    })
  };
})();
