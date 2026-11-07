/* =========================================================
   Sentence Sense — "Fix it" teaching sequence (Build 1.9.1)

   notice -> what's missing -> one way to fix it -> careful (a tempting
   wrong repair) -> your turn (supported, child's own words) -> write your own

   - Content lives in js/data/fixit-content.js.
   - The child's repair is saved through SS_WRITE as a "fix" piece, so it
     survives Back/Home/refresh and grown-ups can see it.
   - Nothing here grades the child's repair. It asks the child to check it
     and shows a few things to look at, worded as questions.
   ========================================================= */
(function () {
  "use strict";

  const F = window.SS_FIXIT_CONTENT || {};
  const S = window.SS_SENTENCE;
  const make = S.make;
  const clear = S.clear;
  const el = id => document.getElementById(id);

  const state = { topic: null, step: 0, piece: null, answered: {} };

  function L() { return F[state.topic]; }
  function has(topic) { return !!F[topic]; }

  function setStep(n) {
    state.step = n;
    if (state.piece) { state.piece.fixStep = n; window.SS_WRITE.touchPiece(state.piece); }
    render();
  }

  function start(topic) {
    if (!has(topic)) return;
    state.topic = topic;
    state.answered = {};
    const lesson = L();
    state.piece = window.SS_WRITE.fixPiece(lesson.id, lesson.try.fragment);
    state.step = Math.max(0, Math.min(state.piece.fixStep || 0, 5));
    el("screen-fixit").dataset.topic = window.SS_LEARN_CONTENT.topics[topic].color;
    render();
  }

  function heading(text) {
    const h = make("h2", "activity-title", text);
    h.id = "fixit-heading";
    h.tabIndex = -1;
    return h;
  }

  function sentence(spec) {
    const host = make("div", "sentence-host");
    S.renderSentence(host, spec);
    return host;
  }

  function primary(label, fn) {
    const b = make("button", "btn btn-next fixit-primary", label);
    b.type = "button";
    b.addEventListener("click", fn);
    return b;
  }
  function nav(label, fn, cls) {
    const b = make("button", "nav-btn" + (cls ? " " + cls : ""), label);
    b.type = "button";
    if (fn) b.addEventListener("click", fn);
    return b;
  }
  function controls(next, showBack) {
    const row = make("div", "controls write-controls");
    if (showBack) row.appendChild(nav("← Back", () => setStep(state.step - 1)));
    row.appendChild(next);
    return row;
  }

  function renderSteps() {
    const host = el("fixit-steps");
    clear(host);
    L().steps.forEach((name, i) => {
      const li = make("li", "step-pill" + (i === state.step ? " is-current" : i < state.step ? " is-done" : ""));
      li.appendChild(make("span", "step-num", String(i + 1)));
      li.appendChild(make("span", "step-name", name));
      if (i === state.step) li.setAttribute("aria-current", "step");
      host.appendChild(li);
    });
  }

  /* A question whose answers teach. `mustBeCorrect`: Next waits for the
     correct choice (wrong choices explain, and are crossed through so the
     child sees what they tried). Otherwise any answer unlocks Next. */
  function questionBlock(stage, key, q, mustBeCorrect, next) {
    stage.appendChild(make("p", "write-qtext", q.ask));
    const box = make("div", "choices is-wide is-sentences");
    box.setAttribute("role", "group");
    box.setAttribute("aria-label", q.ask);
    const fb = make("p", "answer-feedback");
    fb.setAttribute("role", "status");
    fb.setAttribute("aria-live", "polite");
    fb.hidden = true;
    q.choices.forEach((c, i) => {
      const b = make("button", "choice-btn", c.text);
      b.type = "button";
      b.dataset.ci = String(i);
      b.addEventListener("click", () => {
        fb.hidden = false;
        fb.textContent = c.feedback;
        fb.className = "answer-feedback " + (c.correct ? "is-right" : "is-wrong");
        if (c.correct) {
          b.classList.add("is-right");
          Array.prototype.forEach.call(box.children, x => { x.disabled = true; });
        } else {
          b.classList.add("is-wrong");
          b.disabled = true;
        }
        if (c.correct || !mustBeCorrect) { state.answered[key] = true; next.disabled = false; }
      });
      box.appendChild(b);
    });
    stage.appendChild(box);
    stage.appendChild(fb);
    next.disabled = !state.answered[key];
  }

  function render() {
    const lesson = L();
    renderSteps();
    const host = el("fixit-body");
    clear(host);
    const stage = make("div", "stage");
    let next;

    if (state.step === 0) {
      const N = lesson.notice;
      stage.appendChild(heading(N.title));
      stage.appendChild(sentence(N.sentence));
      next = primary("Next", () => setStep(1));
      questionBlock(stage, "notice", N, true, next);
    } else if (state.step === 1) {
      const E = lesson.explain;
      stage.appendChild(heading(E.title));
      E.lines.forEach(t => stage.appendChild(make("p", "write-lead", t)));
      stage.appendChild(sentence(E.sentence));
      next = primary("Next", () => setStep(2));
    } else if (state.step === 2) {
      const M = lesson.model;
      stage.appendChild(heading(M.title));
      stage.appendChild(make("p", "write-lead", M.lead));
      stage.appendChild(sentence(M.sentence));
      stage.appendChild(make("p", "write-tip", M.capitalNote));
      stage.appendChild(make("p", "write-qtext", M.othersTitle));
      const ul = make("ul", "write-look-list");
      M.others.forEach(t => ul.appendChild(make("li", "", t)));
      stage.appendChild(ul);
      next = primary("Next", () => setStep(3));
    } else if (state.step === 3) {
      const T = lesson.tempting;
      stage.appendChild(heading(T.title));
      stage.appendChild(sentence(T.sentence));
      next = primary("Next", () => setStep(4));
      questionBlock(stage, "tempting", T, false, next);
    } else if (state.step === 4) {
      next = renderTry(stage, lesson.try);
    } else {
      const Wr = lesson.write;
      stage.appendChild(heading(Wr.title));
      stage.appendChild(make("p", "write-lead", Wr.lead));
      const p = state.piece;
      if (p && p.draft.trim()) {
        stage.appendChild(make("p", "write-mine-label", "Your fix:"));
        const t = make("p", "write-text");
        t.textContent = p.draft;
        stage.appendChild(t);
      }
      next = primary(Wr.primary, () => window.SS_WRITE.startWithPrompt(Wr.promptId));
      const later = nav(Wr.later, () => window.SS_SHELL.openSkill(state.topic));
      host.appendChild(stage);
      const row = make("div", "controls write-controls");
      row.appendChild(nav("← Back", () => setStep(4)));
      row.appendChild(later);
      row.appendChild(next);
      host.appendChild(row);
      finish();
      return;
    }
    host.appendChild(stage);
    host.appendChild(controls(next, state.step > 0));
    finish();
  }

  function finish() {
    window.SS_SHELL.showScreen("fixit");
    window.SS_WRITE.onSaveStatus();
    const h = el("fixit-heading");
    if (h) h.focus();
  }

  /* ---------- Your turn: the child's own repair ---------- */
  function renderTry(stage, T) {
    const p = state.piece;
    const W = window.SS_WRITE;
    stage.appendChild(heading(T.title));
    stage.appendChild(make("p", "fix-tag", "Fix this:"));
    const frag = make("p", "write-text is-small is-tempting");
    frag.textContent = T.fragment;
    stage.appendChild(frag);
    stage.appendChild(make("p", "write-lead", T.ask));

    const label = make("label", "write-label", T.label);
    label.htmlFor = "fixit-input";
    stage.appendChild(label);
    const ta = make("textarea", "write-input");
    ta.id = "fixit-input";
    ta.rows = 2;
    ta.value = p.draft;
    ta.setAttribute("spellcheck", "true");
    stage.appendChild(ta);

    const nudge = make("p", "write-nudge", T.empty);
    nudge.setAttribute("role", "status");
    nudge.hidden = true;
    stage.appendChild(nudge);

    /* Ideas for who: optional; a tap ADDS the words where the cursor is. */
    stage.appendChild(make("p", "word-group-title", T.ideasTitle));
    const ideas = make("div", "chip-row");
    T.ideas.forEach(w => {
      const b = make("button", "chip-btn", w);
      b.type = "button";
      b.addEventListener("click", () => {
        const v = ta.value;
        const at = typeof ta.selectionStart === "number" ? ta.selectionStart : v.length;
        const before = v.slice(0, at), after = v.slice(at);
        const pre = before && !/\s$/.test(before) ? " " : "";
        const post = after && !/^\s/.test(after) ? " " : (after ? "" : " ");
        ta.value = before + pre + w + post + after;
        const pos = (before + pre + w + post).length;
        ta.setSelectionRange(pos, pos);
        p.help.wordBank = true;
        update();
        ta.focus();
      });
      ideas.appendChild(b);
    });
    stage.appendChild(ideas);

    /* Help me: three rungs, one at a time, right under the writing tools. */
    const helpSlot = make("div", "fixit-help-slot");
    stage.appendChild(helpSlot);
    const help = make("div", "write-help");
    stage.appendChild(help);
    const drawHelp = () => {
      clear(help);
      for (let r = 1; r <= p.help.rung; r++) {
        const rung = make("div", "ladder-rung");
        rung.tabIndex = -1;
        rung.appendChild(make("p", "ladder-label", "Help " + r + " of 3"));
        rung.appendChild(make("p", "ladder-text", T.help[r - 1]));
        help.appendChild(rung);
      }
    };
    drawHelp();

    /* Check your fix: the child taps who in THEIR sentence. */
    const check = make("div", "check-q fixit-check");
    check.id = "fixit-check";
    stage.appendChild(check);
    const look = make("div", "write-look");
    look.id = "fixit-look";
    look.setAttribute("aria-live", "polite");
    stage.appendChild(look);
    stage.appendChild(make("p", "write-honest", T.honest));

    function drawCheck() {
      clear(check);
      const words = W.tokens(p.draft);
      if (!words.length) { check.hidden = true; return; }
      check.hidden = false;
      check.appendChild(make("p", "write-qtext", T.checkAsk));
      if (p.marks.text !== p.draft) { p.marks.who = null; p.marks.text = p.draft; }
      const picked = new Set(p.marks.who || []);
      const row = make("div", "pick-row");
      row.setAttribute("role", "group");
      row.setAttribute("aria-label", T.checkAsk);
      words.forEach((w, i) => {
        const b = make("button", "pick-word ss-k-subject", w);
        b.type = "button";
        b.setAttribute("aria-pressed", String(picked.has(i)));
        b.addEventListener("click", () => {
          if (picked.has(i)) picked.delete(i); else picked.add(i);
          b.setAttribute("aria-pressed", String(picked.has(i)));
          p.marks.who = Array.from(picked).sort((a, c) => a - c);
          p.marks.text = p.draft;
          p.marks.whoWords = p.marks.who.map(k => words[k]).join(" ").replace(/[.!?,]+$/, "");
          p.checkedText = p.draft;
          W.touchPiece(p);
        });
        row.appendChild(b);
      });
      check.appendChild(row);
    }

    function drawLook() {
      clear(look);
      const t = p.draft.trim();
      if (!t) { look.hidden = true; return; }
      look.hidden = false;
      const items = [];
      if (/^ate\b/i.test(t)) items.push(T.notes.startsWithAte);
      if (!/\bate\b/i.test(t)) items.push(T.notes.keptWhat);
      W.looksAt(t).forEach(x => items.push(x.text));
      look.classList.toggle("is-clear", !items.length);
      look.appendChild(make("p", "write-look-title", "Things to look at"));
      if (!items.length) look.appendChild(make("p", "write-look-none", "The app didn't notice anything to look at. Read your fix out loud."));
      else {
        const ul = make("ul", "write-look-list");
        items.forEach(x => ul.appendChild(make("li", "", x)));
        look.appendChild(ul);
      }
    }

    function update() {
      p.draft = ta.value;
      if (p.draft.trim()) nudge.hidden = true;
      W.touchPiece(p);
      drawCheck();
      drawLook();
    }
    ta.addEventListener("input", update);
    drawCheck();
    drawLook();

    const helpBtn = nav("Help me", () => {
      if (p.help.rung < 3) { p.help.rung++; W.touchPiece(p); }
      drawHelp();
      const last = help.querySelector(".ladder-rung:last-child");
      if (last) last.focus();
      if (p.help.rung >= 3) helpBtn.disabled = true;
    }, "btn-help");
    helpBtn.id = "fixit-help-btn";
    if (p.help.rung >= 3) helpBtn.disabled = true;
    helpSlot.appendChild(helpBtn);

    return primary(T.primary, () => {
      if (!p.draft.trim()) { nudge.hidden = false; ta.focus(); return; }
      p.status = "finished";
      p.firstDraft = p.draft;
      p.revision = p.draft;
      p.finished = new Date().toISOString();
      if (!p.checkedText) p.checkedText = p.draft;
      setStep(5);
      W.saveNow();
    });
  }

  function init() {
    el("fixit-back").addEventListener("click", () => { window.SS_WRITE.flush(); window.SS_SHELL.openSkill(state.topic); });
    el("fixit-home").addEventListener("click", () => { window.SS_WRITE.flush(); window.SS_SHELL.goHome(); });
  }

  window.SS_FIXIT = { init: init, start: start, has: has, state: () => state };
})();
