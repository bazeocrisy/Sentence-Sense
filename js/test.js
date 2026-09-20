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

   WHAT IT DOES -- DYNAMIC POOL SAMPLING
     A fixed set of 12 questions eventually measures memory of the test
     rather than mastery of verbs, so the child now chooses a length and
     the engine BUILDS a balanced assessment from the curated pool:

     - blueprint first, randomness second. Every sitting keeps ~2/3
       action and ~1/3 being, and a fixed per-band action/being split,
       so length changes depth and never difficulty.
     - band-scoped order: questions are drawn per band and shuffled
       WITHIN a band, never across, so every sitting runs easy -> hard.
     - choices shuffled at render, identity carried on dataset.ci
     - recent-question avoidance prefers questions the child has not
       just seen, but BALANCE ALWAYS WINS: the blueprint count is filled
       from fresh questions first and stale ones only after, so reuse is
       the minimum necessary by construction.
     - thresholds are RATIOS, so mastery means the same thing at 12, 20
       and 30 questions. Mastery needs all three, because a strong
       action score must not hide weak being-verb understanding.
     - Back re-opens an earlier question and allows a change
     - one deliberate submit step, then scoring and results

   The ONLY thing persisted is a list of recently-seen question IDs in
   sessionStorage, so an immediate retest feels different. No score, no
   timer, no name, no personal information, and it dies with the tab --
   which matters on a shared classroom machine.
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
    size: 0,        // chosen question count
    order: [],      // pool indices, band-grouped, shuffled inside each band
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
    return (t && t.testPool && t.testPool.questions && t.testPool.questions.length)
      ? t.testPool : null;
  }
  function hasBank(topicKey) { return !!bankFor(topicKey); }

  /* The child-facing lengths come from CONTENT, so unlocking 40 once the
     pool expands is a one-array edit with no code change. */
  function sizesFor(bank) {
    const list = (bank.sizes || []).filter(n => n > 0 && n <= bank.questions.length);
    return list.length ? list : [bank.questions.length];
  }

  /* =========================================================
     INTEGER THRESHOLDS -- round-half-up, never floating point.

     ratio [5,6] on 20 questions = floor((2*5*20 + 6) / (2*6)) = 17.
     At 12 questions the ratios resolve to exactly 10/12, 7/8 and 3/4,
     which are the Build 1.4.0 numbers, so nothing drifted when the
     fixed test became a dynamic one.
     ========================================================= */
  function thresholdOf(count, ratio) {
    return Math.floor((2 * ratio[0] * count + ratio[1]) / (2 * ratio[1]));
  }

  /* =========================================================
     BLUEPRINT -- how many action and being questions per band.

     Band totals are as even as the length allows. The being remainder
     goes to the EARLIEST band, never the last: concentrating being
     verbs in band 3 would make the being subscale report weakness that
     is really band-3 difficulty. At 12 this reproduces the original
     fixed test exactly -- 2A/2B, 3A/1B, 3A/1B.
     ========================================================= */
  const BANDS = [1, 2, 3];

  function cellCount(bank, band, type) {
    return bank.questions.filter(q => q.band === band && q.type === type).length;
  }

  function blueprint(bank, n) {
    const t1 = Math.ceil(n / 3);
    const t2 = Math.ceil((n - t1) / 2);
    const T = [t1, t2, n - t1 - t2];

    const want = thresholdOf(n, [1, 3]);
    const cap = BANDS.map(b => cellCount(bank, b, "being"));
    const being = T.map(t => thresholdOf(t, [1, 3]));

    let sum = being[0] + being[1] + being[2];
    let guard = 0;
    while (sum < want && guard++ < 64) {
      let moved = false;
      for (let i = 0; i < 3; i++) {                 // earliest band first
        if (being[i] < cap[i] && being[i] < T[i]) { being[i]++; sum++; moved = true; break; }
      }
      if (!moved) break;
    }
    guard = 0;
    while (sum > want && guard++ < 64) {
      let moved = false;
      for (let i = 2; i >= 0; i--) {
        if (being[i] > 0) { being[i]--; sum--; moved = true; break; }
      }
      if (!moved) break;
    }

    /* Never ask a cell for more than the pool holds. Any shortfall moves
       to the other type in the same band, so the band total is exact. */
    const action = T.map((t, i) => t - being[i]);
    for (let i = 0; i < 3; i++) {
      const aCap = cellCount(bank, BANDS[i], "action");
      if (being[i] > cap[i]) { action[i] += being[i] - cap[i]; being[i] = cap[i]; }
      if (action[i] > aCap) { being[i] += action[i] - aCap; action[i] = aCap; }
    }
    return { total: n, T: T, action: action, being: being };
  }

  /* =========================================================
     CONCEPT COVERAGE

     A balanced test can still be concept-poor by luck. Five families,
     a quota scaled to the length, and a BOUNDED repair: swap a question
     for another in the SAME band+type cell, which keeps the blueprint
     exact by construction. Capped, no backtracking, no solver -- in
     practice the balanced draw already meets every quota.
     ========================================================= */
  const FAMILIES = {
    "suffix-s":    ["suffix-s-answer", "suffix-s-lure"],
    "suffix-ed":   ["suffix-ed-answer", "suffix-ed-lure"],
    "suffix-ing":  ["suffix-ing-lure"],
    "plural-s":    ["plural-s-lure"],
    "double-duty": ["noun-verb-double-duty-answer", "noun-verb-double-duty-lure"]
  };
  function quotaFor(n) {
    return {
      "suffix-s":    Math.max(1, Math.round(n / 12)),
      "suffix-ed":   Math.max(2, Math.round(n / 4)),
      "suffix-ing":  Math.max(1, Math.round(n / 10)),
      "plural-s":    Math.max(2, Math.round(n / 5)),
      "double-duty": Math.max(1, Math.round(n / 12))
    };
  }
  function hasFamily(q, fam) {
    return FAMILIES[fam].some(t => q.tags && q.tags.indexOf(t) >= 0);
  }

  function repairCoverage(bank, picked, n, recent) {
    const quota = quotaFor(n);
    const held = fam => picked.filter(i => hasFamily(bank.questions[i], fam)).length;
    const isStale = i => recent.indexOf(bank.questions[i].id) >= 0;
    let swaps = 0;

    Object.keys(quota).forEach(fam => {
      let guard = 0;
      while (held(fam) < quota[fam] && swaps < 8 && guard++ < 12) {
        /* Fresh candidates first. A repair that pulled in a question the
           child just saw would silently spend the freshness the balanced
           draw worked to preserve. */
        const inPool = bank.questions
          .map((q, i) => i)
          .filter(i => picked.indexOf(i) < 0 && hasFamily(bank.questions[i], fam))
          .sort((a, b) => (isStale(a) ? 1 : 0) - (isStale(b) ? 1 : 0));
        let done = false;
        for (let a = 0; a < inPool.length && !done; a++) {
          const cand = bank.questions[inPool[a]];
          /* Prefer to evict a STALE question, so a repair swap can only
             hold freshness level or improve it, never spend it. */
          const slots = picked.map((_, b) => b)
            .sort((x, y) => (isStale(picked[x]) ? 0 : 1) - (isStale(picked[y]) ? 0 : 1));
          for (let s = 0; s < slots.length; s++) {
            const b = slots[s];
            const out = bank.questions[picked[b]];
            if (out.band !== cand.band || out.type !== cand.type) continue;
            if (hasFamily(out, fam)) continue;
            const trial = picked.slice();
            trial[b] = inPool[a];
            const heldTrial = f => trial.filter(i => hasFamily(bank.questions[i], f)).length;
            const safe = Object.keys(quota)
              .every(f => heldTrial(f) >= Math.min(quota[f], held(f)));
            if (!safe) continue;
            picked = trial; swaps++; done = true; break;
          }
        }
        if (!done) break;
      }
    });
    return { picked: picked, swaps: swaps };
  }

  /* =========================================================
     RECENT-QUESTION AVOIDANCE

     sessionStorage, IDs only. It survives Try again and a refresh but
     dies with the tab, which is the right boundary on a machine shared
     by a class. It is written at SUBMISSION, so a child who opens a
     test and walks away does not burn the next sitting's freshness.

     Every read and write is guarded: storage throws in some private
     modes, and a throw must degrade to "no avoidance", never to a
     broken test.
     ========================================================= */
  const recentMemory = {};                       // fallback when storage throws
  const recentKey = k => "ss.test.recent." + k;

  function readRecent(topicKey) {
    try {
      const raw = window.sessionStorage.getItem(recentKey(topicKey));
      if (raw) {
        const v = JSON.parse(raw);
        if (v && Array.isArray(v.ids)) return v.ids;
      }
    } catch (e) { /* storage unavailable -- fall through */ }
    return recentMemory[topicKey] || [];
  }

  function writeRecent(topicKey, ids) {
    recentMemory[topicKey] = ids.slice();
    try {
      window.sessionStorage.setItem(recentKey(topicKey),
        JSON.stringify({ v: 1, ids: ids.slice() }));
    } catch (e) { /* in-memory copy above is the fallback */ }
  }

  /* =========================================================
     SAMPLING

     Fill each band+type cell to its blueprint count, taking fresh
     questions before stale ones. Because the cell is always filled from
     fresh ++ stale, the blueprint is satisfied whether or not fresh
     questions remain -- freshness can never cost balance.
     ========================================================= */
  function sampleOrder(bank, n, recent) {
    const bp = blueprint(bank, n);
    let picked = [];

    BANDS.forEach((band, bi) => {
      ["action", "being"].forEach(type => {
        const need = (type === "being" ? bp.being : bp.action)[bi];
        if (need <= 0) return;
        const cand = bank.questions
          .map((q, i) => i)
          .filter(i => bank.questions[i].band === band && bank.questions[i].type === type);
        const fresh = shuffled(cand.filter(i => recent.indexOf(bank.questions[i].id) < 0));
        const stale = shuffled(cand.filter(i => recent.indexOf(bank.questions[i].id) >= 0));
        picked = picked.concat(fresh.concat(stale).slice(0, need));
      });
    });

    const repaired = repairCoverage(bank, picked, n, recent);
    picked = repaired.picked;
    lastSwaps = repaired.swaps;

    /* BAND-SCOPED ORDER. Shuffled inside each band, bands in sequence,
       so the difficulty arc survives every reshuffle. */
    const out = [];
    BANDS.forEach(band => {
      shuffled(picked.filter(i => bank.questions[i].band === band)).forEach(i => out.push(i));
    });
    return out;
  }

  /* How many coverage repairs the last draw needed. Exposed so the audit
     can prove every repeated question is either structurally forced by
     the pool or paid for by a named repair -- never accidental. */
  let lastSwaps = 0;

  /* Tear the previous sitting's review out of the DOM.

     showPhase() hides #test-results, so a stale review was never visible
     and never reachable by assistive tech -- but it left the previous
     sitting's ANSWER EXPLANATIONS sitting in the document for the whole
     of the next test, and at 30 questions those overlap the questions
     now being asked. A Test engine whose first rule is "no explanation
     before submission" should not keep one word of it in the page. */
  function clearReview() {
    const rev = el("test-review");
    if (!rev) return;
    clear(rev);
    rev.hidden = true;
    const btn = el("test-review-btn");
    if (btn) btn.textContent = "See my answers";
  }

  function reset(topicKey, size) {
    const bank = bankFor(topicKey);
    clearReview();
    run.topicKey = topicKey;
    run.bank = bank;
    run.size = bank ? (size || sizesFor(bank)[0]) : 0;
    run.order = bank ? sampleOrder(bank, run.size, readRecent(topicKey)) : [];
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

  /* {n} is a CONTENT placeholder, so the approved wording is reused at
     every length instead of being rewritten per size. */
  function fill(text, n) { return String(text).split("{n}").join(String(n)); }

  function renderIntroCopy() {
    el("test-intro-line").textContent = fill(run.bank.intro, run.size);
    el("test-confirm-line").textContent = fill(run.bank.confirm, run.size);
  }

  /* The selector is built from content. Numbers only: an adjective like
     "Standard" or "Full Review" would imply the other lengths are odd or
     incomplete, and longer must never read as harder. */
  function renderSizes() {
    const host = el("test-sizes");
    clear(host);
    sizesFor(run.bank).forEach(n => {
      const btn = make("button", "size-btn" + (n === run.size ? " is-picked" : ""));
      btn.type = "button";
      btn.dataset.size = String(n);
      btn.textContent = String(n);
      btn.setAttribute("aria-pressed", n === run.size ? "true" : "false");
      btn.addEventListener("click", () => chooseSize(n));
      host.appendChild(btn);
    });
  }

  function chooseSize(n) {
    if (n === run.size) return;
    reset(run.topicKey, n);
    renderSizes();
    renderIntroCopy();
  }

  function start(topicKey, size) {
    if (!hasBank(topicKey)) return;
    reset(topicKey, size);

    const t = C.topics[topicKey];
    el("screen-test").dataset.topic = t.color;
    el("test-skill-tag").textContent = t.name;
    el("test-heading").textContent = t.name + " Test";
    renderSizes();
    renderIntroCopy();

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

     Two subscales. Mastery needs ALL THREE thresholds: a strong action
     score must not hide weak being-verb understanding, and a strong
     being score must not hide weak action verbs.
     ========================================================= */
  function score() {
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
        id: q.id,
        sentence: q.sentence,
        question: q.question,
        type: q.type,
        chosen: chosen === null ? null : q.choices[chosen].text,
        correct: q.choices[correctIndex].text,
        right: right,
        why: q.why
      });
    });

    const total = run.order.length;
    const mr = run.bank.masteryRatio;
    const thresholds = {
      overall: thresholdOf(total, mr.overall),
      action: thresholdOf(actionTotal, mr.action),
      being: thresholdOf(beingTotal, mr.being),
      almost: thresholdOf(total, mr.almost)
    };

    const mastered = overall >= thresholds.overall &&
                     action >= thresholds.action &&
                     being >= thresholds.being;

    const g = run.bank.guidance;
    let tier;
    if (mastered) tier = "mastered";
    else if (overall >= thresholds.overall && being < thresholds.being) tier = "beingWeak";
    else if (overall >= thresholds.overall && action < thresholds.action) tier = "actionWeak";
    else if (overall >= thresholds.almost) tier = "almost";
    else tier = "keepGoing";

    return { overall, action, being, actionTotal, beingTotal, total,
             thresholds, mastered, tier, message: g[tier], rows };
  }

  /* =========================================================
     RESULTS
     ========================================================= */
  function submit() {
    run.result = score();
    /* Remember this sitting so an immediate retest feels different.
       IDs only -- no score, no name, nothing about the child. */
    writeRecent(run.topicKey, run.order.map(i => run.bank.questions[i].id));
    renderResults();
    showPhase("results");
    el("test-score").focus();
  }

  /* A scalable bar, not one dot per question: 30 dots is noise and 40 is
     unreadable. The TEXT score sits beside it and carries the meaning,
     so nothing here depends on colour or width. Both bars use the same
     fill, because a weak subscale is not a failure state and colour must
     not become a second verdict. */
  function scoreRow(label, got, of) {
    const row = make("div", "score-row");

    const head = make("div", "score-head");
    head.appendChild(make("span", "score-label", label));
    head.appendChild(make("span", "score-count", got + " of " + of));
    row.appendChild(head);

    const track = make("div", "score-track");
    track.setAttribute("aria-hidden", "true");
    const fill = make("div", "score-fill");
    fill.style.width = (of > 0 ? Math.round((got / of) * 100) : 0) + "%";
    track.appendChild(fill);
    row.appendChild(track);

    return row;
  }

  /* Result CTAs change with the result, because "Try again" is the wrong
     primary after a weak score: re-measuring without instruction in
     between measures nothing and teaches nothing. */
  const CTA = {
    mastered:  { primary: ["Back to Verb", "skill"], tertiary: ["Try again", "again"] },
    beingWeak: { primary: ["Practice verbs", "practice"], tertiary: ["Back to Verb", "skill"] },
    actionWeak:{ primary: ["Practice verbs", "practice"], tertiary: ["Back to Verb", "skill"] },
    almost:    { primary: ["Practice verbs", "practice"], tertiary: ["Back to Verb", "skill"] },
    keepGoing: { primary: ["Learn verbs", "learn"], tertiary: ["Back to Verb", "skill"] }
  };

  function ctaLabel(text) {
    const t = C.topics[run.topicKey];
    return text.split("Verb").join(t.name);
  }

  function doAction(kind) {
    if (kind === "again") { again(); return; }
    if (kind === "skill") { window.SS_SHELL.openSkill(run.topicKey); return; }
    window.SS_SHELL.openActivity(run.topicKey, kind);
  }

  function renderCtas(tier) {
    const plan = CTA[tier] || CTA.keepGoing;
    const p = el("test-primary");
    p.textContent = ctaLabel(plan.primary[0]);
    p.dataset.action = plan.primary[1];
    const t = el("test-tertiary");
    t.textContent = ctaLabel(plan.tertiary[0]);
    t.dataset.action = plan.tertiary[1];
  }

  function renderResults() {
    const r = run.result;
    el("test-score-value").textContent = String(r.overall);
    el("test-score-of").textContent = "of " + r.total;
    /* Celebrate mastery only. Anything else gets the score and the
       guidance without a party popper over it. */
    el("test-mark").hidden = !r.mastered;
    el("test-score").setAttribute("aria-label",
      "You scored " + r.overall + " out of " + r.total + ".");

    const host = el("test-subscores");
    clear(host);
    host.appendChild(scoreRow("Action verbs", r.action, r.actionTotal));
    host.appendChild(scoreRow("Being verbs", r.being, r.beingTotal));

    el("test-guidance").textContent = r.message;
    renderCtas(r.tier);

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

  /* A retest is a FULL reset: a fresh sample, new band-scoped order, new
     choice order, answers and score cleared. Nothing from the previous
     sitting leaks into the next one except the avoidance list, which
     exists precisely to make the next one different. */
  function again() { start(run.topicKey, run.size); }

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
    el("test-primary").addEventListener("click",
      () => doAction(el("test-primary").dataset.action));
    el("test-tertiary").addEventListener("click",
      () => doAction(el("test-tertiary").dataset.action));
    el("test-back").addEventListener("click",
      () => window.SS_SHELL.openSkill(run.topicKey));
    el("test-home").addEventListener("click", () => window.SS_SHELL.goHome());
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
      size: run.size,
      order: run.order.slice(),
      ids: run.order.map(i => run.bank.questions[i].id),
      answers: run.answers.slice(),
      total: run.order.length,
      result: run.result && {
        overall: run.result.overall, action: run.result.action,
        being: run.result.being, actionTotal: run.result.actionTotal,
        beingTotal: run.result.beingTotal, total: run.result.total,
        thresholds: run.result.thresholds,
        mastered: run.result.mastered, tier: run.result.tier,
        message: run.result.message
      }
    }),
    /* pure helpers, exposed so the audit can examine sampling and
       scoring without driving the UI */
    sizes: topicKey => sizesFor(bankFor(topicKey)).slice(),
    sizesBuilt: topicKey => (bankFor(topicKey).sizesBuilt || sizesFor(bankFor(topicKey))).slice(),
    blueprintOf: (topicKey, n) => blueprint(bankFor(topicKey), n),
    thresholdOf: thresholdOf,
    sampleIds: (topicKey, n, recent) =>
      sampleOrder(bankFor(topicKey), n, recent || [])
        .map(i => bankFor(topicKey).questions[i].id),
    sampleDetail: (topicKey, n, recent) => {
      const ids = sampleOrder(bankFor(topicKey), n, recent || [])
        .map(i => bankFor(topicKey).questions[i].id);
      return { ids: ids, swaps: lastSwaps };
    },
    recent: topicKey => readRecent(topicKey).slice(),
    clearRecent: topicKey => writeRecent(topicKey, []),
    scoreOf: (topicKey, size, answers) => {
      const saveK = run.topicKey, saveB = run.bank, saveO = run.order,
            saveA = run.answers, saveS = run.size;
      reset(topicKey, size);
      run.answers = answers.slice();
      const r = score();
      run.topicKey = saveK; run.bank = saveB; run.order = saveO;
      run.answers = saveA; run.size = saveS;
      return r;
    }
  };
})();
