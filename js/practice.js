/* =========================================================
   Sentence Sense — shared PRACTICE component (Build 1.4.0)

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
   practised finding verbs when they practised something else.

   THIS IS PRACTICE, SO A WRONG ANSWER BUYS TEACHING, NOT A MARK
     1st wrong -> what that word actually does in THIS sentence
     2nd wrong -> the clue again, answer still hidden
     3rd wrong -> guided reveal; the answer is shown and the child moves on

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

  const run = {
    topicKey: null,
    bank: null,
    order: [],          // question indices, shuffled inside each stage
    pos: 0,             // 0-based position in `order`
    attempts: 0,        // wrong attempts on the CURRENT question (0-3)
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
    el("practice-skill-tag").textContent = t.name;

    window.SS_SHELL.showScreen("practice");
    buildQuestion();
    el("practice-heading").focus();
  }

  /* =========================================================
     ONE QUESTION
     ========================================================= */
  function renderHead(q) {
    const st = run.bank.stages[q.stage];
    el("practice-count").textContent =
      "Question " + (run.pos + 1) + " of " + run.order.length;
    el("practice-stage").textContent = "Stage " + (q.stage + 1) + ": " + st.name;
    el("practice-stage-desc").textContent = st.desc;

    /* A plain, non-numeric sense of place. Never a score or a percentage. */
    const bar = el("practice-bar");
    if (bar) {
      const pct = Math.round((run.pos / run.order.length) * 100);
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

    const clueBtn = el("practice-clue");
    clueBtn.hidden = false;
    clueBtn.disabled = false;

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

  function feedback(kind, parts) {
    const fb = el("practice-feedback");
    fb.hidden = false;
    fb.className = "answer-feedback is-" + kind;
    clear(fb);
    fb.appendChild(make("span", "fb-mark", kind === "right" ? "✓" : "✕"));
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
      Array.prototype.forEach.call(buttons, b => b.classList.remove("is-wrong"));
      btn.classList.add("is-right");
      /* Feedback matters most when the child is RIGHT, and it teaches
         rather than praising the person. */
      feedback("right", [choice.feedback]);
      el("practice-clue").disabled = true;
      setNext(true);
      el("practice-next").focus();
      return;
    }

    run.attempts += 1;
    btn.classList.add("is-wrong");
    btn.disabled = true;

    if (run.attempts === 1) {
      /* What that word actually does here, then where to look instead. */
      feedback("wrong", [choice.feedback, "Have another look."]);
      revealControls();
    } else if (run.attempts === 2) {
      /* The clue again. The answer is still the child's to find. */
      feedback("wrong", [choice.feedback, q.clue]);
      revealControls();
    } else {
      /* Third miss: find it together rather than leave the child stuck.
         D-36: match the correct button by its original choice index,
         never by rendered text. */
      const correctIndex = q.choices.findIndex(c => c.correct);
      const right = Array.prototype.filter.call(buttons,
        b => Number(b.dataset.ci) === correctIndex)[0];
      lockAll(buttons);
      if (right) right.classList.add("is-right");
      feedback("right", [q.reveal]);
      run.answered = true;
      el("practice-clue").disabled = true;
      setNext(true);
      el("practice-next").focus();
      return;
    }

    const nextChoice = Array.prototype.filter.call(buttons, x => !x.disabled)[0];
    if (nextChoice) nextChoice.focus();
  }

  /* The child may ask for the clue instead of guessing for it. Asking is
     not an error: no attempt is counted and nothing is marked wrong. */
  function showClue() {
    const q = current();
    if (!q || run.answered) return;
    feedback("clue", [q.clue]);
    el("practice-clue").disabled = true;
    revealControls();
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

    el("practice-done-title").textContent = "You practised " + t.name + "!";
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
    el("practice-clue").addEventListener("click", showClue);
    el("practice-back").addEventListener("click",
      () => window.SS_SHELL.openSkill(run.topicKey));
    el("practice-home").addEventListener("click", () => window.SS_SHELL.goHome());

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
      answered: run.answered,
      milestone: run.milestoneStage,
      done: run.done,
      total: run.order.length
    })
  };
})();
