/* =========================================================
   Sentence Sense — shared TEST component (Build 1.4.0)

   LEARN teaches. PRACTICE coaches. TEST measures.

   This is a SEPARATE engine from js/practice.js on purpose. The two
   are defined by opposite behaviour, and the single thing that makes
   Practice valuable -- escalating help on a wrong answer -- is the
   single thing a test must never do. Flagging one engine into both
   behaviours is how the Build 1.3.0 mission engine became
   unmaintainable, so they stay apart.

   WHAT THIS ENGINE MUST NOT DO, EVER
     - no hint, no clue button, no retry, no escalation
     - no reveal of the answer during the test
     - no right/wrong signal of any kind before the child submits
     - a SELECTED choice means only "this is the one I picked"; it must
       never be styled, labelled or announced as correct or incorrect

   WHAT IT DOES
     - band-scoped shuffle: questions move WITHIN Q1-4, Q5-8 and Q9-12
       and never across, so every sitting runs easy -> medium -> hard
     - choices shuffled at render, identity carried on dataset.ci
     - Back re-opens an earlier question and allows a change
     - one deliberate submit step, then scoring and results
     - two subscales, because a strong action score must not hide weak
       being-verb understanding

   Nothing is persisted. No score, no timer, no storage, no network.
   Leaving and returning starts a clean test.
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
    order: [],      // question indices, shuffled inside each band
    answers: [],    // answers[position] = chosen ORIGINAL choice index, or null
    pos: 0,
    phase: "intro", // intro | question | confirm | results
    result: null
  };

  /* Fisher-Yates on a COPY. The source arrays in learn-content.js are
     never mutated, so a second sitting is not degraded by the first. */
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
    return (t && t.testBank && t.testBank.questions && t.testBank.questions.length)
      ? t.testBank : null;
  }
  function hasBank(topicKey) { return !!bankFor(topicKey); }

  /* BAND-SCOPED ORDER. Questions are shuffled inside each band and the
     bands stay in sequence, so the difficulty arc survives every
     reshuffle. A global shuffle would destroy it. */
  function buildOrder(bank) {
    const bands = [];
    bank.questions.forEach((q, i) => {
      const b = q.band || 0;
      (bands[b] = bands[b] || []).push(i);
    });
    const out = [];
    bands.forEach(list => { if (list) shuffled(list).forEach(i => out.push(i)); });
    return out;
  }

  function reset(topicKey) {
    const bank = bankFor(topicKey);
    run.topicKey = topicKey;
    run.bank = bank;
    run.order = bank ? buildOrder(bank) : [];
    run.answers = run.order.map(() => null);
    run.pos = 0;
    run.phase = "intro";
    run.result = null;
  }

  function current() {
    const i = run.order[run.pos];
    return (i === undefined) ? null : run.bank.questions[i];
  }

  /* =========================================================
     PHASES
     ========================================================= */
  function showPhase(name) {
    run.phase = name;
    el("test-intro").hidden = (name !== "intro");
    el("test-stage-wrap").hidden = (name !== "question");
    el("test-controls").hidden = (name !== "question");
    el("test-confirm").hidden = (name !== "confirm");
    el("test-results").hidden = (name !== "results");
    window.scrollTo(0, 0);
  }

  function start(topicKey) {
    if (!hasBank(topicKey)) return;
    reset(topicKey);

    const t = C.topics[topicKey];
    el("screen-test").dataset.topic = t.color;
    el("test-skill-tag").textContent = t.name;
    el("test-heading").textContent = t.name + " Test";
    el("test-intro-line").textContent = run.bank.intro;
    el("test-confirm-line").textContent = run.bank.confirm;

    window.SS_SHELL.showScreen("test");
    showPhase("intro");
    el("test-heading").focus();
  }

  function beginQuestions() {
    run.pos = 0;
    showPhase("question");
    renderQuestion();
  }

  /* =========================================================
     ONE QUESTION
     ========================================================= */
  function renderQuestion() {
    const q = current();
    if (!q) return;
    const total = run.order.length;

    el("test-count").textContent = "Question " + (run.pos + 1) + " of " + total;
    const bar = el("test-bar");
    if (bar) bar.style.width = Math.round((run.pos / total) * 100) + "%";

    el("test-question").textContent = q.question;
    S.renderSentence(el("test-sentence"), q.sentence);

    const host = el("test-choices");
    clear(host);
    const longest = q.choices.reduce((n, c) => Math.max(n, c.text.length), 0);
    host.classList.toggle("is-wide", longest > 12);

    const picked = run.answers[run.pos];

    /* Choices shuffled at render; identity travels on dataset.ci so the
       chosen answer survives a reshuffle when the child comes Back. */
    shuffled(q.choices.map((c, i) => i)).forEach(ci => {
      const choice = q.choices[ci];
      const btn = make("button", "choice-btn");
      btn.type = "button";
      btn.dataset.ci = String(ci);
      btn.textContent = choice.text;
      /* aria-pressed carries "I picked this" and nothing more. There is
         deliberately no aria-label, no title and no extra text that
         could differ between a right and a wrong choice. */
      btn.setAttribute("aria-pressed", picked === ci ? "true" : "false");
      if (picked === ci) btn.classList.add("is-picked");
      btn.addEventListener("click", () => pick(ci));
      host.appendChild(btn);
    });

    el("test-prev").disabled = (run.pos === 0);
    const next = el("test-next");
    const last = run.pos === total - 1;
    next.textContent = last ? "Finish" : "Next";
    next.disabled = (run.answers[run.pos] === null);

    el("test-question").focus();
    window.scrollTo(0, 0);
  }

  function pick(ci) {
    run.answers[run.pos] = ci;
    const host = el("test-choices");
    Array.prototype.forEach.call(host.querySelectorAll(".choice-btn"), b => {
      const isPicked = Number(b.dataset.ci) === ci;
      b.classList.toggle("is-picked", isPicked);
      b.setAttribute("aria-pressed", isPicked ? "true" : "false");
    });
    el("test-next").disabled = false;
  }

  function nextQuestion() {
    if (run.answers[run.pos] === null) return;
    if (run.pos < run.order.length - 1) {
      run.pos += 1;
      renderQuestion();
      return;
    }
    /* Last question answered -> the deliberate submit step. */
    showPhase("confirm");
    el("test-confirm-title").focus();
  }

  function prevQuestion() {
    if (run.pos === 0) return;
    run.pos -= 1;
    renderQuestion();
  }

  function backToQuestions() {
    showPhase("question");
    renderQuestion();
  }

  /* =========================================================
     SCORING
     Two subscales. Mastery needs ALL THREE thresholds: a strong
     action score must not hide weak being-verb understanding.
     ========================================================= */
  function score() {
    const m = run.bank.mastery;
    let overall = 0, action = 0, being = 0, actionTotal = 0, beingTotal = 0;
    const rows = [];

    run.order.forEach((qi, pos) => {
      const q = run.bank.questions[qi];
      const correctIndex = q.choices.findIndex(c => c.correct);
      const chosen = run.answers[pos];
      const right = (chosen === correctIndex);

      if (q.type === "being") { beingTotal++; if (right) being++; }
      else { actionTotal++; if (right) action++; }
      if (right) overall++;

      rows.push({
        pos: pos + 1,
        sentence: q.sentence,
        question: q.question,
        type: q.type,
        chosen: chosen === null ? null : q.choices[chosen].text,
        correct: q.choices[correctIndex].text,
        right: right,
        why: q.why
      });
    });

    const mastered = overall >= m.overall && action >= m.action && being >= m.being;
    const g = run.bank.guidance;
    let message;
    if (mastered) message = g.mastered;
    else if (overall >= m.overall && being < m.being) message = g.beingWeak;
    else if (overall >= m.overall && action < m.action) message = g.actionWeak;
    else if (overall >= 8) message = g.almost;
    else message = g.keepGoing;

    return { overall, action, being, actionTotal, beingTotal, total: run.order.length,
             mastered, message, rows };
  }

  /* =========================================================
     RESULTS
     ========================================================= */
  function submit() {
    run.result = score();
    renderResults();
    showPhase("results");
    el("test-score").focus();
  }

  function dots(got, of) {
    const wrap = make("span", "score-dots");
    wrap.setAttribute("aria-hidden", "true");
    for (let i = 0; i < of; i++) {
      wrap.appendChild(make("span", "score-dot" + (i < got ? " is-on" : "")));
    }
    return wrap;
  }

  function scoreRow(label, got, of) {
    const row = make("div", "score-row");
    row.appendChild(make("span", "score-label", label));
    row.appendChild(dots(got, of));
    row.appendChild(make("span", "score-count", got + " of " + of));
    return row;
  }

  function renderResults() {
    const r = run.result;
    el("test-score").textContent = r.overall + " of " + r.total;
    /* Celebrate mastery only. Anything else gets the score and the
       guidance without a party popper over it. */
    el("test-mark").hidden = !r.mastered;

    const host = el("test-subscores");
    clear(host);
    host.appendChild(scoreRow("Action verbs", r.action, r.actionTotal));
    host.appendChild(scoreRow("Being verbs", r.being, r.beingTotal));

    el("test-guidance").textContent = r.message;

    /* The review is built now but stays closed. Teaching returns only
       after the child has committed to their answers. */
    const rev = el("test-review");
    clear(rev);
    rev.hidden = true;
    el("test-review-btn").textContent = "See my answers";

    r.rows.forEach(row => {
      const item = make("div", "review-item" + (row.right ? " is-right" : ""));
      const head = make("p", "review-head");
      head.appendChild(make("span", "review-n", String(row.pos)));
      head.appendChild(make("span", "review-q", row.question));
      item.appendChild(head);

      const sHost = make("div", "sentence-host");
      S.renderSentence(sHost, row.sentence);
      item.appendChild(sHost);

      const ans = make("p", "review-answers");
      const yours = make("span", "review-yours" + (row.right ? " is-right" : " is-wrong"));
      yours.appendChild(make("span", "ra-label", "You chose"));
      yours.appendChild(make("span", "ra-word", row.chosen === null ? "—" : row.chosen));
      ans.appendChild(yours);
      if (!row.right) {
        const corr = make("span", "review-correct");
        corr.appendChild(make("span", "ra-label", "The verb is"));
        corr.appendChild(make("span", "ra-word", row.correct));
        ans.appendChild(corr);
      }
      item.appendChild(ans);
      item.appendChild(make("p", "review-why", row.why));
      rev.appendChild(item);
    });
  }

  function toggleReview() {
    const rev = el("test-review");
    const open = rev.hidden;
    rev.hidden = !open;
    el("test-review-btn").textContent = open ? "Hide my answers" : "See my answers";
    if (open) rev.scrollIntoView({ block: "start" });
  }

  /* A retest is a FULL reset: new band-scoped order, new choice order,
     answers and score cleared. Nothing from the previous sitting can
     leak into the next one. */
  function again() { start(run.topicKey); }

  /* =========================================================
     INIT + PUBLIC API
     ========================================================= */
  function init() {
    el("test-start").addEventListener("click", beginQuestions);
    el("test-next").addEventListener("click", nextQuestion);
    el("test-prev").addEventListener("click", prevQuestion);
    el("test-confirm-back").addEventListener("click", backToQuestions);
    el("test-submit").addEventListener("click", submit);
    el("test-review-btn").addEventListener("click", toggleReview);
    el("test-again").addEventListener("click", again);
    el("test-back").addEventListener("click",
      () => window.SS_SHELL.openSkill(run.topicKey));
    el("test-home").addEventListener("click", () => window.SS_SHELL.goHome());
    el("test-skill").addEventListener("click",
      () => window.SS_SHELL.openSkill(run.topicKey));
  }

  window.SS_TEST = {
    init: init,
    start: start,
    hasBank: hasBank,
    /* read-only hooks for the audit harness */
    state: () => ({
      topicKey: run.topicKey,
      phase: run.phase,
      pos: run.pos,
      order: run.order.slice(),
      answers: run.answers.slice(),
      total: run.order.length,
      result: run.result && {
        overall: run.result.overall, action: run.result.action,
        being: run.result.being, mastered: run.result.mastered,
        message: run.result.message
      }
    }),
    /* pure scoring, exposed so the audit can simulate combinations
       without driving the UI */
    scoreOf: (topicKey, answers) => {
      const saveK = run.topicKey, saveB = run.bank, saveO = run.order, saveA = run.answers;
      reset(topicKey);
      run.order = run.bank.questions.map((q, i) => i);
      run.answers = answers.slice();
      const r = score();
      run.topicKey = saveK; run.bank = saveB; run.order = saveO; run.answers = saveA;
      return r;
    }
  };
})();
