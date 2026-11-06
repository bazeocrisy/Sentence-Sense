/* =========================================================
   Sentence Sense — WRITE A STRONG SENTENCE (Build 1.9.0)

   The first activity where the child PRODUCES writing instead of choosing
   a supplied answer:

     choose a prompt -> write a first draft -> check who/what ->
     check what happens -> (optional) add a detail -> check marks ->
     read it again -> compare first draft and new version

   WHAT THE APP CAN AND CANNOT CHECK
     Open-ended writing cannot be graded by string checks. This file never
     labels the child's sentence correct or incorrect. It only:
       - asks self-check questions (the child taps their own words),
       - points at a few mechanical things worth LOOKING at (first letter,
         ending mark, lowercase "i", leftover frame blanks),
       - records what the child chose, for a grown-up to review.
     Whether the sentence is complete, clear and meaningful is decided by
     the child and an adult, in the Grown-ups view.

   THE CHILD'S WORDS
     - The first draft is frozen when the child presses "This is my first
       draft". Every later change goes into `revision`. Nothing rewrites
       either one except the child's own typing, or a frame the child
       explicitly asks to add.
     - Child text is ALWAYS rendered with textContent. Never innerHTML.

   SAVING
     localStorage, one key, saved on every change. If storage is blocked or
     full the activity keeps working in memory and says so plainly. Back,
     Home, Escape and refresh never lose work.
   ========================================================= */

(function () {
  "use strict";

  const W = window.SS_WRITE_CONTENT;
  const C = window.SS_LEARN_CONTENT;
  const S = window.SS_SENTENCE;
  const make = S.make;
  const clear = S.clear;
  const el = id => document.getElementById(id);

  const KEY = "sentence-sense-writing-v1";
  const STEPS = ["choose", "draft", "who", "what", "detail", "marks", "read", "compare"];
  /* The step line shows four phases, not eight steps. */
  const PHASES = [
    { name: "Pick", steps: ["choose"] },
    { name: "Write", steps: ["draft"] },
    { name: "Check and revise", steps: ["who", "what", "detail", "marks", "read"] },
    { name: "Compare", steps: ["compare"] }
  ];

  /* =========================================================
     STORAGE
     ========================================================= */
  const store = {
    data: { version: 1, pieces: [] },
    ok: true,          // last write succeeded
    available: true,   // storage usable at all
    message: ""
  };

  function probeStorage() {
    try {
      const k = KEY + "-probe";
      window.localStorage.setItem(k, "1");
      window.localStorage.removeItem(k);
      return true;
    } catch (e) { return false; }
  }

  function validPiece(p) {
    return p && typeof p === "object" && typeof p.id === "string" &&
      typeof p.promptId === "string" && typeof p.draft === "string";
  }

  function load() {
    store.available = probeStorage();
    if (!store.available) {
      store.ok = false;
      store.message = "This browser isn't letting Sentence Sense save. Your writing stays while this page is open.";
      return;
    }
    let raw = null;
    try { raw = window.localStorage.getItem(KEY); } catch (e) { raw = null; }
    if (!raw) return;
    try {
      const d = JSON.parse(raw);
      if (!d || !Array.isArray(d.pieces)) throw new Error("shape");
      store.data = { version: 1, pieces: d.pieces.filter(validPiece) };
    } catch (e) {
      /* Damaged data is set aside, never silently thrown away. */
      try { window.localStorage.setItem(KEY + "-damaged-" + Date.now(), raw); } catch (e2) { /* nothing more to do */ }
      store.data = { version: 1, pieces: [] };
    }
  }

  function save() {
    if (!store.available) { renderSaveStatus(); return false; }
    try {
      window.localStorage.setItem(KEY, JSON.stringify(store.data));
      store.ok = true;
      store.message = "";
    } catch (e) {
      store.ok = false;
      store.message = "Couldn't save just now. The browser's storage may be full. Your writing stays while this page is open. Ask a grown-up to help.";
    }
    renderSaveStatus();
    return store.ok;
  }

  let saveTimer = null;
  function saveSoon() {
    clearTimeout(saveTimer);
    setSaveStatus("Saving…");
    saveTimer = setTimeout(save, 250);
  }
  function flush() {
    if (saveTimer) { clearTimeout(saveTimer); saveTimer = null; save(); }
  }

  function setSaveStatus(text) {
    const n = el("write-save");
    if (n) n.textContent = text;
  }
  function renderSaveStatus() {
    const n = el("write-save");
    if (!n) return;
    n.classList.toggle("is-problem", !store.ok);
    n.textContent = store.ok ? "Saved on this device" : store.message;
  }

  /* =========================================================
     PIECES
     ========================================================= */
  function now() { return new Date().toISOString(); }

  function newPiece(promptId) {
    /* Drop untouched pieces (prompt picked, nothing written) so they do
       not pile up as "unfinished" work. */
    store.data.pieces = store.data.pieces.filter(p =>
      !(p.status === "writing" && p.firstDraft === null && !p.draft.trim()));
    const p = {
      id: "w" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      promptId: promptId,
      status: "writing",
      step: "draft",
      draft: "",
      firstDraft: null,
      revision: "",
      marks: { who: null, what: null, text: "" },
      checks: { who: null, sense: null, detail: null, capital: false, ending: false, names: false },
      help: { rung: 0, wordBank: false, starters: false, frameUsed: false, examples: [] },
      parentNote: "",
      created: now(),
      updated: now(),
      finished: null
    };
    store.data.pieces.push(p);
    return p;
  }

  function touch(p) { p.updated = now(); saveSoon(); }

  function unfinished() {
    return store.data.pieces.filter(p => p.status === "writing")
      .sort((a, b) => b.updated.localeCompare(a.updated))[0] || null;
  }
  function finishedPieces() {
    return store.data.pieces.filter(p => p.status === "finished");
  }
  function promptOf(p) {
    return W.prompts.find(x => x.id === p.promptId) || W.prompts[W.prompts.length - 1];
  }
  function current(p) { return p.firstDraft === null ? p.draft : p.revision; }

  /* =========================================================
     TEXT HELPERS — mechanical only. None of these grade a sentence.
     ========================================================= */
  function tokens(text) { return text.trim().split(/\s+/).filter(Boolean); }

  function looksAt(text) {
    const t = text.trim();
    const L = W.steps.marks.looks;
    const out = [];
    if (!t) return out;
    if (/^[^A-Za-z]*[a-z]/.test(t)) out.push(L.firstLetter);
    if (!/[.!?]["'”’)]*$/.test(t)) out.push(L.ending);
    if (/(^|[^A-Za-z'’])i(?=$|[\s,.!?'’])/.test(t)) out.push(L.wordI);
    if (/_{3,}/.test(t)) out.push(L.blanks);
    if (/[.!?]["'”’)]*\s+\S/.test(t)) out.push(L.many);
    return out;
  }

  /* Word-level difference for the comparison screen (LCS). Display only. */
  function diffWords(a, b) {
    /* Words are compared without case or end marks, so fixing "the" to
       "The" or adding a period counts as a mark fix, not a new word. */
    const norm = w => w.toLowerCase().replace(/[.!?,;:"“”]+$/, "").replace(/^["“]+/, "");
    const X = tokens(a), Y = tokens(b);
    const x = X.map(norm), y = Y.map(norm);
    const n = x.length, m = y.length;
    const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
    for (let i = n - 1; i >= 0; i--)
      for (let j = m - 1; j >= 0; j--)
        dp[i][j] = x[i] === y[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    const added = [], removed = [];
    let i = 0, j = 0, addRun = [], remRun = [];
    const flushRuns = () => {
      if (addRun.length) { added.push(addRun.join(" ")); addRun = []; }
      if (remRun.length) { removed.push(remRun.join(" ")); remRun = []; }
    };
    while (i < n || j < m) {
      if (i < n && j < m && x[i] === y[j]) { flushRuns(); i++; j++; }
      else if (j < m && (i >= n || dp[i][j + 1] >= dp[i + 1][j])) { addRun.push(Y[j]); j++; }
      else { remRun.push(X[i]); i++; }
    }
    flushRuns();
    return { added, removed };
  }

  /* =========================================================
     READ ALOUD — optional, user-started, never required.
     ========================================================= */
  const canSpeak = typeof window.speechSynthesis !== "undefined" &&
    typeof window.SpeechSynthesisUtterance !== "undefined";

  function speakButton(getText, label) {
    if (!canSpeak) return null;
    const b = make("button", "nav-btn write-speak", label || "Read it to me");
    b.type = "button";
    b.addEventListener("click", () => {
      try {
        window.speechSynthesis.cancel();
        const text = getText();
        if (!text.trim()) return;
        const u = new window.SpeechSynthesisUtterance(text);
        u.rate = 0.9;
        window.speechSynthesis.speak(u);
      } catch (e) { /* Speech failed. The activity carries on. */ }
    });
    return b;
  }
  function stopSpeech() {
    if (canSpeak) { try { window.speechSynthesis.cancel(); } catch (e) { /* ignore */ } }
  }

  /* =========================================================
     RENDERING
     ========================================================= */
  const ui = { piece: null, nudged: false };

  function body() { return el("write-body"); }

  function heading(text) {
    const h = make("h2", "activity-title", text);
    h.id = "write-heading";
    h.tabIndex = -1;
    return h;
  }

  function renderPhases(step) {
    const host = el("write-steps");
    clear(host);
    const at = PHASES.findIndex(ph => ph.steps.includes(step));
    PHASES.forEach((ph, i) => {
      const li = make("li", "step-pill" + (i === at ? " is-current" : i < at ? " is-done" : ""));
      li.appendChild(make("span", "step-num", String(i + 1)));
      li.appendChild(make("span", "step-name", ph.name));
      if (i === at) li.setAttribute("aria-current", "step");
      host.appendChild(li);
    });
  }

  /* The child's sentence shown as text. pre-wrap keeps their line breaks. */
  function sentenceBox(text, cls) {
    const box = make("p", "write-text" + (cls ? " " + cls : ""));
    box.textContent = text.trim() ? text : "(nothing written yet)";
    if (!text.trim()) box.classList.add("is-empty");
    return box;
  }

  function primaryButton(label, onClick) {
    const b = make("button", "btn btn-next write-primary", label);
    b.type = "button";
    b.addEventListener("click", onClick);
    return b;
  }

  function controls(primary, extra) {
    const row = make("div", "controls write-controls");
    (extra || []).forEach(x => { if (x) row.appendChild(x); });
    row.appendChild(primary);
    return row;
  }

  function renderStep(step, opts) {
    const p = ui.piece;
    /* Step changes save at once (typing is debounced), so leaving the
       page right after pressing Next never loses the step. */
    if (p && step !== "choose") { p.step = step; p.updated = now(); clearTimeout(saveTimer); save(); }
    ui.nudged = false;
    stopSpeech();
    renderPhases(step);
    const host = body();
    clear(host);
    ({
      choose: renderChoose, draft: renderDraft, who: renderWho, what: renderWhat,
      detail: renderDetail, marks: renderMarks, read: renderRead, compare: renderCompare
    })[step](host);
    window.SS_SHELL.showScreen("write");
    if (!(opts && opts.noFocus)) {
      const h = el("write-heading");
      if (h) h.focus();
    }
  }

  /* ---------- Step 0: choose a prompt ---------- */
  function renderChoose(host) {
    const stage = make("div", "stage");
    stage.appendChild(heading("What do you want to write about?"));
    stage.appendChild(make("p", "write-lead", "Pick one idea. You will write one sentence, then make it even better."));
    const list = make("ul", "prompt-list");
    W.prompts.forEach(pr => {
      const li = make("li");
      const b = make("button", "prompt-btn");
      b.type = "button";
      b.dataset.prompt = pr.id;
      b.appendChild(make("span", "prompt-title", pr.title));
      b.appendChild(make("span", "prompt-line", pr.line));
      b.addEventListener("click", () => {
        ui.piece = newPiece(pr.id);
        save();
        show("draft");
      });
      li.appendChild(b);
      list.appendChild(li);
    });
    stage.appendChild(list);
    host.appendChild(stage);
  }

  /* ---------- Step 1: write the first draft ---------- */
  function renderDraft(host) {
    const p = ui.piece, pr = promptOf(p), D = W.steps.draft;
    const stage = make("div", "stage");
    stage.appendChild(heading(D.title));

    const ask = make("div", "write-prompt");
    ask.appendChild(make("p", "write-prompt-text", pr.ask));
    const sp = speakButton(() => pr.ask);
    if (sp) ask.appendChild(sp);
    stage.appendChild(ask);

    stage.appendChild(make("p", "write-tip", D.sayTip));

    const label = make("label", "write-label", D.label);
    label.htmlFor = "write-input";
    stage.appendChild(label);
    const ta = make("textarea", "write-input");
    ta.id = "write-input";
    ta.rows = 3;
    ta.value = p.draft;
    ta.setAttribute("autocomplete", "off");
    ta.setAttribute("spellcheck", "true");
    ta.addEventListener("input", () => { p.draft = ta.value; nudge.hidden = true; touch(p); });
    stage.appendChild(ta);

    const nudge = make("p", "write-nudge", D.emptyNudge);
    nudge.id = "write-nudge";
    nudge.setAttribute("role", "status");
    nudge.hidden = true;
    stage.appendChild(nudge);

    /* Optional tools: closed by default so independent writing stays one
       box and one button. */
    const tools = make("div", "write-tools");
    tools.appendChild(toolToggle("Sentence starters", "starters", () => {
      const box = make("div", "chip-row");
      pr.starters.forEach(s => box.appendChild(insertChip(s, ta, p, true)));
      return box;
    }));
    tools.appendChild(toolToggle("Word bank", "wordBank", () => wordBank(pr, ta, p)));
    stage.appendChild(tools);

    const help = make("div", "write-help");
    help.id = "write-help";
    stage.appendChild(help);
    renderLadder(help, ta);

    host.appendChild(stage);

    const helpBtn = make("button", "nav-btn btn-help", "Help me");
    helpBtn.type = "button";
    helpBtn.id = "write-help-btn";
    helpBtn.addEventListener("click", () => {
      if (p.help.rung < 4) { p.help.rung++; touch(p); }
      renderLadder(help, ta);
      const last = help.querySelector(".ladder-rung:last-child");
      if (last) last.focus();
      if (p.help.rung >= 4) helpBtn.disabled = true;
    });
    if (p.help.rung >= 4) helpBtn.disabled = true;

    host.appendChild(controls(primaryButton(D.primary, () => {
      if (!p.draft.trim()) { nudge.hidden = false; ta.focus(); return; }
      p.firstDraft = p.draft;
      p.revision = p.draft;
      touch(p);
      show("who");
    }), [helpBtn]));
  }

  function toolToggle(label, key, build) {
    const p = ui.piece;
    const wrap = make("div", "tool");
    const b = make("button", "nav-btn tool-btn", label);
    b.type = "button";
    b.setAttribute("aria-expanded", "false");
    const panel = make("div", "tool-panel");
    panel.hidden = true;
    b.addEventListener("click", () => {
      const open = panel.hidden;
      panel.hidden = !open;
      b.setAttribute("aria-expanded", String(open));
      if (open && !panel.firstChild) panel.appendChild(build());
      if (open && !p.help[key]) { p.help[key] = true; touch(p); }
    });
    wrap.appendChild(b);
    wrap.appendChild(panel);
    return wrap;
  }

  function wordBank(pr, ta, p) {
    const box = make("div", "word-bank");
    Object.keys(pr.words).forEach(group => {
      const g = make("div", "word-group");
      g.appendChild(make("p", "word-group-title", group));
      const row = make("div", "chip-row");
      pr.words[group].forEach(w => row.appendChild(insertChip(w, ta, p, false)));
      g.appendChild(row);
      box.appendChild(g);
    });
    return box;
  }

  /* Tapping a chip ADDS words where the cursor is. It never replaces what
     the child wrote. A starter only goes in at the very beginning. */
  function insertChip(text, ta, p, isStarter) {
    const b = make("button", "chip-btn", text);
    b.type = "button";
    b.addEventListener("click", () => {
      let v = ta.value;
      if (isStarter) {
        v = v.trim() ? text + " " + v.replace(/^\s+/, "") : text + " ";
        ta.value = v;
        ta.setSelectionRange(text.length + 1, text.length + 1);
      } else {
        const at = typeof ta.selectionStart === "number" ? ta.selectionStart : v.length;
        const before = v.slice(0, at), after = v.slice(at);
        const pre = before && !/\s$/.test(before) ? " " : "";
        const post = after && !/^\s/.test(after) ? " " : (after ? "" : " ");
        ta.value = before + pre + text + post + after;
        const pos = (before + pre + text + post).length;
        ta.setSelectionRange(pos, pos);
      }
      p.draft = ta.value;
      touch(p);
      ta.focus();
    });
    return b;
  }

  function renderLadder(host, ta) {
    const p = ui.piece, pr = promptOf(p), L = W.ladder;
    clear(host);
    for (let r = 1; r <= p.help.rung; r++) {
      const rung = make("div", "ladder-rung");
      rung.tabIndex = -1;
      rung.appendChild(make("p", "ladder-label", "Help " + r + " of 4 · " + L.label[r - 1]));
      if (r === 1) rung.appendChild(make("p", "ladder-text", pr.question));
      if (r === 2) {
        rung.appendChild(make("p", "ladder-text", L.strategy));
        if (!p.help.wordBank) { p.help.wordBank = true; touch(p); }
        rung.appendChild(wordBank(pr, ta, p));
      }
      if (r === 3) {
        rung.appendChild(make("p", "ladder-text", L.exampleIntro));
        const sh = make("div", "sentence-host");
        S.renderSentence(sh, pr.example);
        rung.appendChild(sh);
      }
      if (r === 4) {
        rung.appendChild(make("p", "ladder-text", L.frameIntro));
        rung.appendChild(make("p", "write-frame", pr.frame));
        const fb = make("button", "nav-btn", L.frameButton);
        fb.type = "button";
        fb.addEventListener("click", () => {
          const v = ta.value;
          ta.value = v.trim() ? v.replace(/\s+$/, "") + " " + pr.frame : pr.frame;
          p.draft = ta.value;
          p.help.frameUsed = true;
          touch(p);
          ta.focus();
        });
        rung.appendChild(fb);
        rung.appendChild(make("p", "ladder-note", L.frameNote));
      }
      host.appendChild(rung);
    }
  }

  /* ---------- Shared: the editable new version ---------- */
  function revisionEditor(opts) {
    const p = ui.piece;
    const wrap = make("div", "rev-editor");
    const ta = make("textarea", "write-input");
    ta.id = "write-revision";
    ta.rows = 3;
    ta.value = p.revision;
    const label = make("label", "write-label", "My new version");
    label.htmlFor = "write-revision";
    ta.addEventListener("input", () => {
      p.revision = ta.value;
      touch(p);
      if (opts && opts.onChange) opts.onChange();
    });
    wrap.appendChild(label);
    wrap.appendChild(ta);
    wrap.appendChild(make("p", "write-hint", W.editHint));
    if (opts && opts.tip) {
      const t = make("p", "write-tip", opts.tip);
      wrap.insertBefore(t, label);
    }
    wrap.hidden = !(opts && opts.open);
    return wrap;
  }

  /* The child's current sentence plus a "Change my sentence" control that
     opens the editor. One primary action per step stays the Next button. */
  function sentencePanel(host, opts) {
    const p = ui.piece;
    const panel = make("div", "write-mine");
    panel.appendChild(make("p", "write-mine-label", "Your sentence"));
    const shown = sentenceBox(p.revision);
    panel.appendChild(shown);
    const editor = revisionEditor({
      open: opts && opts.open, tip: opts && opts.tip,
      onChange: () => {
        shown.textContent = p.revision.trim() ? p.revision : "(nothing written yet)";
        if (opts && opts.onChange) opts.onChange();
      }
    });
    const row = make("div", "write-mine-actions");
    const edit = make("button", "nav-btn write-edit", W.editLabel);
    edit.type = "button";
    edit.setAttribute("aria-expanded", String(!editor.hidden));
    edit.addEventListener("click", () => {
      editor.hidden = false;
      edit.setAttribute("aria-expanded", "true");
      el("write-revision").focus();
    });
    row.appendChild(edit);
    const sp = speakButton(() => p.revision, "Read my sentence to me");
    if (sp) row.appendChild(sp);
    panel.appendChild(row);
    panel.appendChild(editor);
    host.appendChild(panel);
    return { openEditor: (tip) => {
      if (tip) {
        let t = editor.querySelector(".write-tip");
        if (!t) { t = make("p", "write-tip"); editor.insertBefore(t, editor.firstChild); }
        t.textContent = tip;
      }
      editor.hidden = false;
      edit.setAttribute("aria-expanded", "true");
      el("write-revision").focus();
    } };
  }

  /* Example help used on the check steps: always a different sentence. */
  function exampleHelp(key, spec, line) {
    const p = ui.piece;
    const wrap = make("div", "write-example");
    const b = make("button", "nav-btn btn-help", "Show me an example");
    b.type = "button";
    const panel = make("div", "ladder-rung");
    panel.tabIndex = -1;
    panel.hidden = true;
    b.addEventListener("click", () => {
      panel.hidden = false;
      b.hidden = true;
      if (!panel.firstChild) {
        if (spec.words) {
          const sh = make("div", "sentence-host");
          S.renderSentence(sh, spec);
          panel.appendChild(sh);
        } else {
          panel.appendChild(make("p", "write-text is-small", spec.from));
          panel.appendChild(make("p", "write-arrow", "↓"));
          panel.appendChild(make("p", "write-text is-small", spec.to));
        }
        panel.appendChild(make("p", "ladder-text", line));
      }
      if (p.help.examples.indexOf(key) < 0) { p.help.examples.push(key); touch(p); }
      panel.focus();
    });
    wrap.appendChild(b);
    wrap.appendChild(panel);
    return wrap;
  }

  /* Tap-your-own-words. The child marks words in THEIR sentence; the app
     records the choice and does not judge it. */
  function wordPicker(field, kind, onPick) {
    const p = ui.piece;
    const words = tokens(p.revision);
    /* Index marks belong to one exact text. When the sentence changes they
       reset, but the marked WORDS are kept as evidence (whoWords/whatWords). */
    if (p.marks.text !== p.revision) { p.marks.who = null; p.marks.what = null; p.marks.text = p.revision; }
    const picked = new Set(p.marks[field] || []);
    const row = make("div", "pick-row");
    row.setAttribute("role", "group");
    words.forEach((w, i) => {
      const b = make("button", "pick-word ss-k-" + kind, w);
      b.type = "button";
      b.setAttribute("aria-pressed", String(picked.has(i)));
      b.addEventListener("click", () => {
        if (picked.has(i)) picked.delete(i); else picked.add(i);
        b.setAttribute("aria-pressed", String(picked.has(i)));
        p.marks[field] = Array.from(picked).sort((a, c) => a - c);
        p.marks.text = p.revision;
        p.marks[field + "Words"] = p.marks[field].map(k => words[k]).join(" ").replace(/[.!?,]+$/, "");
        touch(p);
        if (onPick) onPick();
      });
      row.appendChild(b);
    });
    return row;
  }

  function pickedText(field) {
    const p = ui.piece;
    if (p.marks.text !== p.revision || !p.marks[field] || !p.marks[field].length) return p.marks[field + "Words"] || "";
    const words = tokens(p.revision);
    return p.marks[field].map(i => words[i]).join(" ").replace(/[.!?,]+$/, "");
  }

  function backButton(step) {
    const b = make("button", "nav-btn", "← Back");
    b.type = "button";
    b.addEventListener("click", () => show(step));
    return b;
  }

  /* ---------- Step 2: who or what ---------- */
  function renderWho(host) {
    const p = ui.piece, K = W.steps.who;
    const stage = make("div", "stage");
    stage.appendChild(heading(K.title));
    stage.appendChild(make("p", "write-lead", K.ask));
    const pickHost = make("div");
    const status = make("p", "write-note");
    status.setAttribute("role", "status");
    const repick = () => {
      clear(pickHost);
      pickHost.appendChild(wordPicker("who", "subject", () => {
        p.checks.who = "marked"; touch(p); status.textContent = "";
      }));
    };
    repick();
    stage.appendChild(pickHost);

    const alt = make("div", "write-alt");
    const cmd = make("button", "nav-btn", K.command);
    cmd.type = "button";
    cmd.addEventListener("click", () => { p.checks.who = "command"; touch(p); status.textContent = K.commandNote; });
    const miss = make("button", "nav-btn", K.missing);
    miss.type = "button";
    alt.appendChild(cmd);
    alt.appendChild(miss);
    stage.appendChild(alt);
    stage.appendChild(status);

    const panel = sentencePanel(stage, { onChange: repick });
    miss.addEventListener("click", () => {
      p.checks.who = "added"; touch(p);
      panel.openEditor(K.missingTip);
    });
    stage.appendChild(exampleHelp("who", K.example, K.exampleLine));
    host.appendChild(stage);

    host.appendChild(controls(primaryButton("Next", () => {
      const marked = pickedText("who");
      if (!marked && !p.checks.who && !ui.nudged) { ui.nudged = true; status.textContent = K.nudge; return; }
      if (marked && p.checks.who !== "command" && p.checks.who !== "added") p.checks.who = "marked";
      if (!marked && !p.checks.who) p.checks.who = "skipped";
      touch(p);
      show("what");
    }), [backButton("draft-locked")]));
  }

  /* ---------- Step 3: what happens / what is said ---------- */
  function renderWhat(host) {
    const p = ui.piece, K = W.steps.what;
    const stage = make("div", "stage");
    stage.appendChild(heading(K.title));
    const who = pickedText("who");
    stage.appendChild(make("p", "write-lead",
      who ? K.ask.replace("{who}", "“" + who + "”") : K.askNoWho));
    const pickHost = make("div");
    const status = make("p", "write-note");
    status.setAttribute("role", "status");
    const repick = () => { clear(pickHost); pickHost.appendChild(wordPicker("what", "verb", () => { status.textContent = ""; })); };
    repick();
    stage.appendChild(pickHost);

    const q = make("fieldset", "write-question");
    q.appendChild(make("legend", "write-qtext", K.sense));
    const yes = choice(K.senseYes, p.checks.sense === "yes");
    const no = choice(K.senseNo, p.checks.sense === "notyet");
    q.appendChild(yes); q.appendChild(no);
    stage.appendChild(q);
    stage.appendChild(status);
    const panel = sentencePanel(stage, { onChange: repick });
    yes.addEventListener("click", () => { p.checks.sense = "yes"; setPressed(yes, no); touch(p); });
    no.addEventListener("click", () => {
      p.checks.sense = "notyet"; setPressed(no, yes); touch(p);
      panel.openEditor(K.senseNoTip);
    });
    stage.appendChild(exampleHelp("what", K.example, K.exampleLine));
    host.appendChild(stage);

    host.appendChild(controls(primaryButton("Next", () => {
      if (!pickedText("what") && !ui.nudged) { ui.nudged = true; status.textContent = K.nudge; return; }
      show("detail");
    }), [backButton("who")]));
  }

  function choice(label, pressed) {
    const b = make("button", "choice-btn write-choice", label);
    b.type = "button";
    b.setAttribute("aria-pressed", String(!!pressed));
    return b;
  }
  function setPressed(on) {
    Array.prototype.slice.call(arguments, 1).forEach(b => b.setAttribute("aria-pressed", "false"));
    on.setAttribute("aria-pressed", "true");
  }

  /* ---------- Step 4: an optional detail ---------- */
  function renderDetail(host) {
    const p = ui.piece, K = W.steps.detail;
    const stage = make("div", "stage");
    stage.appendChild(heading(K.title));
    stage.appendChild(make("p", "write-lead", K.ask));
    const tip = make("p", "write-note");
    tip.setAttribute("role", "status");
    const opts = make("div", "choices is-wide detail-choices");
    opts.setAttribute("role", "group");
    opts.setAttribute("aria-label", K.title);
    const buttons = [];
    let panel = null;
    K.options.forEach(o => {
      const b = choice(o.label, p.checks.detail === o.key);
      b.dataset.detail = o.key;
      b.addEventListener("click", () => {
        p.checks.detail = o.key; touch(p);
        buttons.forEach(x => x.setAttribute("aria-pressed", String(x === b)));
        tip.textContent = o.tip;
        if (o.key !== "enough") panel.openEditor(o.tip);
      });
      buttons.push(b);
      opts.appendChild(b);
    });
    stage.appendChild(opts);
    stage.appendChild(tip);
    panel = sentencePanel(stage, {});
    stage.appendChild(exampleHelp("detail", K.example, K.exampleLine));
    host.appendChild(stage);
    host.appendChild(controls(primaryButton("Next", () => show("marks")), [backButton("what")]));
  }

  /* ---------- Step 5: capital letter and end mark ---------- */
  function renderMarks(host) {
    const p = ui.piece, K = W.steps.marks;
    const stage = make("div", "stage");
    stage.appendChild(heading(K.title));
    stage.appendChild(make("p", "write-lead", K.ask));

    const look = make("div", "write-look");
    look.id = "write-look";
    look.setAttribute("aria-live", "polite");
    const drawLook = () => {
      clear(look);
      look.appendChild(make("p", "write-look-title", K.lookTitle));
      const items = looksAt(p.revision);
      if (!items.length) look.appendChild(make("p", "write-look-none", K.nothing));
      else {
        const ul = make("ul", "write-look-list");
        items.forEach(t => ul.appendChild(make("li", "", t)));
        look.appendChild(ul);
      }
    };
    drawLook();
    stage.appendChild(look);

    const fs = make("fieldset", "write-question");
    fs.appendChild(make("legend", "write-qtext", "Check it yourself:"));
    K.checks.forEach(c => {
      const lab = make("label", "write-check");
      const cb = make("input");
      cb.type = "checkbox";
      cb.checked = !!p.checks[c.key];
      cb.addEventListener("change", () => { p.checks[c.key] = cb.checked; touch(p); });
      lab.appendChild(cb);
      lab.appendChild(make("span", "", c.label));
      fs.appendChild(lab);
    });
    stage.appendChild(fs);

    sentencePanel(stage, { open: looksAt(p.revision).length > 0, onChange: drawLook });
    stage.appendChild(make("p", "write-honest", K.honest));
    host.appendChild(stage);
    host.appendChild(controls(primaryButton("Next", () => show("read")), [backButton("detail")]));
  }

  /* ---------- Step 6: read it again ---------- */
  function renderRead(host) {
    const p = ui.piece, K = W.steps.read;
    const stage = make("div", "stage");
    stage.appendChild(heading(K.title));
    stage.appendChild(make("p", "write-lead", K.ask));
    sentencePanel(stage, {});
    host.appendChild(stage);
    host.appendChild(controls(primaryButton(K.primary, () => {
      if (!p.revision.trim()) {
        /* An emptied new version is not a finished piece. Restore nothing
           automatically; ask the child to write it. */
        const n = make("p", "write-nudge", "Your new version is empty. Write your sentence in the box, or copy your first draft.");
        n.setAttribute("role", "status");
        stage.appendChild(n);
        return;
      }
      p.status = "finished";
      p.finished = now();
      touch(p);
      flush();
      show("compare");
    }), [backButton("marks")]));
  }

  /* ---------- Step 7: compare and next step ---------- */
  function praise(p) {
    const out = [];
    const d = diffWords(p.firstDraft || "", p.revision);
    if ((p.firstDraft || "").trim() === p.revision.trim()) {
      out.push("You checked your sentence carefully and chose to keep it. Writers do that too.");
    } else {
      out.push("You revised your sentence.");
      if (d.added.length) out.push("You added: " + d.added.map(a => "“" + a + "”").join(", ") + ".");
      if (d.removed.length) out.push("You took out: " + d.removed.map(a => "“" + a + "”").join(", ") + ".");
      const f = (p.firstDraft || "").trim(), r = p.revision.trim();
      if (/^[^A-Za-z]*[a-z]/.test(f) && /^[^A-Za-z]*[A-Z]/.test(r)) out.push("You fixed the capital letter at the start.");
      if (!/[.!?]["'”’)]*$/.test(f) && /[.!?]["'”’)]*$/.test(r)) out.push("You added an end mark.");
      if (out.length === 1 && !d.added.length && !d.removed.length) out.push("You changed some marks or spacing.");
    }
    if (p.checks.who === "marked" || p.checks.who === "command") out.push("You found who or what your sentence is about.");
    if (p.checks.who === "added") out.push("You noticed your sentence needed a subject and worked on it.");
    if (p.checks.detail === "enough") out.push("You decided your sentence already had enough detail.");
    else if (p.checks.detail && (p.firstDraft || "") !== p.revision) out.push("You worked on a detail to help a reader picture it.");
    if (p.help.rung || p.help.examples.length) out.push("You used Help when you needed it. That's a smart move.");
    return out;
  }

  /* One suggestion, from what the child said about their own sentence. */
  function suggestion(p) {
    if (p.checks.who === "added" || p.checks.who === "skipped") return { skill: "subject", activity: "learn", label: "Learn more about subjects" };
    if (p.checks.sense === "notyet") return { skill: "complete-sentence", activity: "practice", label: "Practice complete sentences" };
    if (p.checks.detail === "kind") return { skill: "adjective", activity: "learn", label: "Learn about adjectives" };
    if (p.checks.detail && p.checks.detail !== "enough") return { skill: "adverb", activity: "learn", label: "Learn about adverbs" };
    return { skill: "complete-sentence", activity: "practice", label: "Practice complete sentences" };
  }

  function renderCompare(host) {
    const p = ui.piece;
    const stage = make("div", "stage");
    stage.appendChild(heading("Look how you worked on it!"));
    const pair = make("div", "compare-pair");
    const a = make("div", "compare-card");
    a.appendChild(make("p", "compare-label", "First draft"));
    a.appendChild(sentenceBox(p.firstDraft || ""));
    const b = make("div", "compare-card is-new");
    b.appendChild(make("p", "compare-label", "New version"));
    b.appendChild(sentenceBox(p.revision));
    pair.appendChild(a); pair.appendChild(b);
    stage.appendChild(pair);
    const ul = make("ul", "praise-list");
    praise(p).forEach(t => ul.appendChild(make("li", "", t)));
    stage.appendChild(ul);
    stage.appendChild(make("p", "write-note", "Your writing is saved on this device. Show a grown-up, or write another sentence."));
    host.appendChild(stage);

    const again = primaryButton("Write another sentence", () => { ui.piece = null; show("choose"); });
    const grown = make("button", "nav-btn", "Show a grown-up");
    grown.type = "button";
    grown.addEventListener("click", () => openParent());
    const sug = suggestion(p);
    const next = make("button", "nav-btn", sug.label);
    next.type = "button";
    next.dataset.skill = sug.skill;
    next.addEventListener("click", () => window.SS_SHELL.openActivity(sug.skill, sug.activity));
    const home = make("button", "nav-btn", "Home");
    home.type = "button";
    home.addEventListener("click", () => window.SS_SHELL.goHome());
    const row = make("div", "done-buttons write-done");
    row.appendChild(again); row.appendChild(next); row.appendChild(grown); row.appendChild(home);
    host.appendChild(row);
  }

  /* =========================================================
     NAVIGATION
     ========================================================= */
  function start() {
    ui.piece = null;
    show("choose");
  }
  function resume(id) {
    const p = store.data.pieces.find(x => x.id === id) || unfinished();
    if (!p) { start(); return; }
    ui.piece = p;
    show(STEPS.includes(p.step) && p.step !== "choose" ? p.step : "draft");
  }

  /* Header Back: one step back inside the activity, Home from the start.
     Going back to Write after the first draft is frozen shows the draft
     read-only; edits continue in the new version. */
  function back() {
    const view = el("screen-write").dataset.view;
    const prev = { who: "draft-locked", what: "who", detail: "what", marks: "detail", read: "marks" }[view];
    if (!ui.piece || !prev) { flush(); stopSpeech(); window.SS_SHELL.goHome(); return; }
    show(prev);
  }

  /* After the first draft is frozen, "Write" shows it read-only. */
  function renderDraftLocked(host) {
    const p = ui.piece;
    const stage = make("div", "stage");
    stage.appendChild(heading("Your first draft"));
    stage.appendChild(make("p", "write-lead", "Your first draft is saved just as you wrote it. You can keep changing your new version."));
    stage.appendChild(sentenceBox(p.firstDraft || ""));
    host.appendChild(stage);
    host.appendChild(controls(primaryButton("Next", () => show("who"))));
  }

  /* THE ROUTER. "draft-locked" is a view, not a saved step: once the first
     draft is frozen, going back to Write shows it read-only. */
  function show(step, opts) {
    const scr = el("screen-write");
    const locked = step === "draft-locked" ||
      (step === "draft" && ui.piece && ui.piece.firstDraft !== null);
    if (scr) scr.dataset.view = locked ? "draft-locked" : step;
    if (!locked) { renderStep(step, opts); return; }
    stopSpeech();
    ui.piece.step = "who";
    touch(ui.piece);
    renderPhases("draft");
    const host = body();
    clear(host);
    renderDraftLocked(host);
    window.SS_SHELL.showScreen("write");
    if (!(opts && opts.noFocus)) el("write-heading").focus();
  }

  /* =========================================================
     HOME: "What should I do next?"
     One prominent action. Everything else stays reachable below it.
     ========================================================= */
  function renderHomeNext(host) {
    if (!host) return;
    clear(host);
    const u = unfinished();
    const done = finishedPieces();
    const card = make("div", "next-card");
    card.appendChild(make("p", "next-eyebrow", "Next for you"));

    let title, line, label, action, secondary = null;
    if (u && (u.draft.trim() || u.firstDraft !== null)) {
      title = "Keep writing your sentence";
      line = "“" + promptOf(u).title + "” · Your words are saved.";
      label = "Continue my sentence";
      action = () => resume(u.id);
      secondary = { label: "Start a new sentence", fn: () => start() };
    } else if (!done.length) {
      title = "Write a strong sentence";
      line = "Pick an idea, write one sentence, then make it even better.";
      label = "Start writing";
      action = () => start();
      secondary = { label: "Warm up first: Complete Sentence", fn: () => window.SS_SHELL.openSkill("complete-sentence") };
    } else {
      title = "Write another strong sentence";
      line = "You've written " + done.length + (done.length === 1 ? " sentence" : " sentences") + " so far. Try a new idea.";
      label = "Start writing";
      action = () => start();
      const s = suggestion(done.sort((a, b) => (b.finished || "").localeCompare(a.finished || ""))[0]);
      secondary = { label: s.label, fn: () => window.SS_SHELL.openActivity(s.skill, s.activity) };
    }

    const h = make("h2", "next-title", title);
    card.appendChild(h);
    card.appendChild(make("p", "next-line", line));
    const acts = make("div", "next-actions");
    const b = make("button", "btn btn-next next-primary");
    b.type = "button";
    b.id = "next-primary";
    b.appendChild(make("span", "btn-label", label));
    const arrow = make("span", "btn-arrow", "→");
    arrow.setAttribute("aria-hidden", "true");
    b.appendChild(arrow);
    b.addEventListener("click", action);
    acts.appendChild(b);
    if (secondary) {
      const s = make("button", "nav-btn next-secondary", secondary.label);
      s.type = "button";
      s.id = "next-secondary";
      s.addEventListener("click", secondary.fn);
      acts.appendChild(s);
    }
    card.appendChild(acts);

    /* The path: a suggestion, folded away so it never becomes another grid. */
    const det = make("details", "path");
    det.appendChild(make("summary", "path-summary", "See the learning path"));
    det.appendChild(make("p", "path-intro", "A suggested order. You can pick any skill any time."));
    const ol = make("ol", "path-list");
    W.path.forEach((step, i) => {
      const li = make("li", "path-step" + (step.write ? " is-write" : "") + (step.soon ? " is-soon" : ""));
      li.appendChild(make("span", "path-num", String(i + 1)));
      const words = make("div", "path-words");
      words.appendChild(make("span", "path-title", step.title));
      const links = make("span", "path-links");
      if (step.skills) step.skills.forEach(k => {
        const t = C.topics[k];
        if (!t) return;
        const a = make("button", "path-link", t.name);
        a.type = "button";
        a.addEventListener("click", () => window.SS_SHELL.openSkill(k));
        links.appendChild(a);
      });
      if (step.write) {
        const a = make("button", "path-link", "Write a strong sentence");
        a.type = "button";
        a.addEventListener("click", () => start());
        links.appendChild(a);
        if (done.length) links.appendChild(make("span", "path-done", "✓ " + done.length + " written"));
      }
      if (step.note) words.appendChild(make("span", "path-note", step.note));
      if (step.soon) links.appendChild(make("span", "path-soon", "Coming later"));
      words.appendChild(links);
      li.appendChild(words);
      ol.appendChild(li);
    });
    det.appendChild(ol);
    card.appendChild(det);
    host.appendChild(card);
  }

  /* =========================================================
     GROWN-UPS VIEW — writing evidence, kept out of the child's flow.
     ========================================================= */
  function describeChecks(p) {
    const c = p.checks, out = [];
    const who = { marked: "Marked the words that tell who or what", command: "Said it is a command (subject: you)", added: "Said the subject was missing and worked on it", skipped: "Skipped marking who or what" }[c.who];
    if (who) out.push(who + (c.who === "marked" && p.marks.whoWords ? ": “" + p.marks.whoWords + "”" : ""));
    if (p.marks.whatWords) out.push("Marked what happens: “" + p.marks.whatWords + "”");
    if (c.sense) out.push(c.sense === "yes" ? "Said it makes sense by itself" : "Said it did not make sense yet, and worked on it");
    const d = W.steps.detail.options.find(o => o.key === c.detail);
    if (d) out.push("Detail: " + d.label.replace(/^Add /, "chose to add ").replace("It already", "said it already"));
    W.steps.marks.checks.forEach(k => out.push((c[k.key] ? "☑ " : "☐ ") + k.label));
    return out;
  }
  function describeHelp(p) {
    const h = p.help, out = [];
    if (h.rung) out.push("Help me: " + h.rung + " of 4 steps (" + W.ladder.label.slice(0, h.rung).join(", ") + ")");
    if (h.starters) out.push("Opened sentence starters");
    if (h.wordBank) out.push("Used the word bank");
    if (h.frameUsed) out.push("Added the sentence frame to the draft");
    if (h.examples.length) out.push("Looked at examples on: " + h.examples.join(", ") + " steps");
    if (!out.length) out.push("No help used");
    return out;
  }
  function fmtDate(iso) {
    try { return new Date(iso).toLocaleString(); } catch (e) { return iso; }
  }

  function openParent() {
    flush();
    stopSpeech();
    renderParent();
    window.SS_SHELL.showScreen("parent");
    el("parent-heading").focus();
  }

  function renderParent() {
    const host = el("parent-body");
    clear(host);
    const intro = make("div", "stage parent-intro");
    intro.appendChild(make("p", "", "This page shows your child's writing: the prompt, the first draft, the revised version, the help used, and their own self-checks."));
    intro.appendChild(make("p", "", "What the app checks: it only points out a few mechanical things to look at (first letter, ending mark, a lowercase “i”, leftover frame blanks). It does not decide whether a sentence is complete, clear, or correct, and finishing a piece does not mean a skill is mastered. Please read the writing and talk about it together."));
    intro.appendChild(make("p", "", "Where it's saved: only in this browser on this device. It does not sync to other devices, and clearing browser data removes it. No account, no names, nothing is sent anywhere."));
    if (!store.ok) intro.appendChild(make("p", "write-nudge", store.message));
    host.appendChild(intro);

    const pieces = store.data.pieces.filter(p => p.draft.trim() || p.firstDraft !== null)
      .sort((a, b) => b.updated.localeCompare(a.updated));
    if (!pieces.length) {
      host.appendChild(make("p", "write-note", "No saved writing yet."));
      return;
    }
    pieces.forEach(p => {
      const card = make("article", "stage parent-piece");
      card.dataset.piece = p.id;
      card.appendChild(make("h3", "parent-prompt", promptOf(p).ask));
      card.appendChild(make("p", "parent-meta",
        (p.status === "finished" ? "Finished " + fmtDate(p.finished) : "Not finished yet · last saved " + fmtDate(p.updated))));
      const pair = make("div", "compare-pair");
      const a = make("div", "compare-card");
      a.appendChild(make("p", "compare-label", "First draft"));
      a.appendChild(sentenceBox(p.firstDraft !== null ? p.firstDraft : p.draft));
      if (p.firstDraft === null) a.appendChild(make("p", "parent-meta", "(still being written)"));
      pair.appendChild(a);
      if (p.firstDraft !== null) {
        const b = make("div", "compare-card is-new");
        b.appendChild(make("p", "compare-label", p.status === "finished" ? "Revised version" : "Revised version (so far)"));
        b.appendChild(sentenceBox(p.revision));
        pair.appendChild(b);
      }
      card.appendChild(pair);
      if (p.firstDraft !== null) {
        const d = diffWords(p.firstDraft, p.revision);
        const changes = p.firstDraft.trim() === p.revision.trim() ? "No changes between versions."
          : [d.added.length ? "Added: " + d.added.join(" / ") : "", d.removed.length ? "Removed: " + d.removed.join(" / ") : ""].filter(Boolean).join(" · ") || "Changed punctuation or spacing.";
        card.appendChild(make("p", "parent-meta", changes));
      }
      const cols = make("div", "parent-cols");
      const c1 = make("div");
      c1.appendChild(make("h4", "parent-h", "Child's self-checks"));
      const l1 = make("ul", "parent-list");
      describeChecks(p).forEach(t => l1.appendChild(make("li", "", t)));
      c1.appendChild(l1);
      const c2 = make("div");
      c2.appendChild(make("h4", "parent-h", "Help used"));
      const l2 = make("ul", "parent-list");
      describeHelp(p).forEach(t => l2.appendChild(make("li", "", t)));
      c2.appendChild(l2);
      cols.appendChild(c1); cols.appendChild(c2);
      card.appendChild(cols);

      const nl = make("label", "write-label", "Parent note (optional)");
      nl.htmlFor = "note-" + p.id;
      const note = make("textarea", "write-input parent-note");
      note.id = "note-" + p.id;
      note.rows = 2;
      note.value = p.parentNote || "";
      note.addEventListener("input", () => { p.parentNote = note.value; saveSoon(); });
      card.appendChild(nl);
      card.appendChild(note);

      const del = make("button", "nav-btn parent-delete", "Delete this piece");
      del.type = "button";
      del.addEventListener("click", () => {
        if (!window.confirm("Delete this piece of writing? This can't be undone.")) return;
        store.data.pieces = store.data.pieces.filter(x => x.id !== p.id);
        if (ui.piece && ui.piece.id === p.id) ui.piece = null;
        save();
        renderParent();
        el("parent-heading").focus();
      });
      card.appendChild(del);
      host.appendChild(card);
    });

    const all = make("button", "nav-btn parent-delete", "Delete all saved writing");
    all.type = "button";
    all.id = "parent-delete-all";
    all.addEventListener("click", () => {
      if (!window.confirm("Delete ALL saved writing on this device? This can't be undone.")) return;
      store.data.pieces = [];
      ui.piece = null;
      save();
      renderParent();
      el("parent-heading").focus();
    });
    host.appendChild(all);
  }

  /* =========================================================
     INIT
     ========================================================= */
  function init() {
    load();
    renderSaveStatus();
    el("write-back").addEventListener("click", back);
    el("write-home").addEventListener("click", () => { flush(); stopSpeech(); window.SS_SHELL.goHome(); });
    el("parent-back").addEventListener("click", () => window.SS_SHELL.goHome());
    const link = el("parent-link");
    if (link) link.addEventListener("click", openParent);
    window.addEventListener("pagehide", flush);
    window.addEventListener("beforeunload", flush);
    /* Another tab changed the saved writing: reload it when not mid-edit
       here, so a stale tab does not overwrite newer work on its next save. */
    window.addEventListener("storage", e => {
      if (e.key !== KEY) return;
      const editing = ui.piece && el("screen-write") && !el("screen-write").hidden;
      if (editing) {
        store.ok = false;
        store.message = "This writing was changed in another tab. Close one of the tabs, then refresh, so nothing is lost.";
        store.available = false;  // stop writing from this stale tab
        renderSaveStatus();
        return;
      }
      load();
    });
  }

  window.SS_WRITE = {
    init: init,
    start: start,
    resume: resume,
    back: back,
    renderHomeNext: renderHomeNext,
    openParent: openParent,
    flush: flush,
    /* For the verification harness only. */
    _store: store,
    _looksAt: looksAt,
    _diffWords: diffWords
  };
})();
