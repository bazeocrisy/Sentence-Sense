/* =========================================================
   Sentence Sense — WRITE A STRONG SENTENCE (Build 1.9.0)

   The first activity where the child PRODUCES writing instead of choosing
   a supplied answer. Five screens, built for one short session:

     Pick -> Write (first draft) -> Check (child's own judgments) ->
     Revise (optional changes, marks, optional detail) -> Compare

   WHAT THE APP CAN AND CANNOT CHECK
     Open-ended writing cannot be graded by string checks. This file never
     labels the child's sentence correct or incorrect. It only:
       - asks self-check questions; the child taps their own words and
         answers. These are the CHILD'S judgments and are reported as such;
       - points at a few mechanical things worth LOOKING at (first letter,
         ending mark, lowercase "i", leftover frame blanks, what looks like
         more than one sentence), phrased as questions;
       - records what the child chose, for a grown-up to review.
     Adding words is not treated as better writing, removing words is not
     treated as worse, and no sentence needs an adjective or adverb.

   THE CHILD'S WORDS
     - The first draft is frozen when the child presses "This is my first
       draft". Every later change goes into `revision`. Nothing rewrites
       either one except the child's own typing, a chip or frame the child
       taps, or the child pressing "Go back to my first draft".
     - Child text is ALWAYS rendered with textContent. Never innerHTML.

   SAVING
     localStorage, one key. Typing is saved after a short pause; step
     changes are saved at once. If storage is blocked or full the activity
     keeps working in memory and says so plainly. Back, Home, Escape and
     refresh never lose work.
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
  const STEPS = ["choose", "draft", "check", "revise", "compare"];
  /* Pieces saved by the first 1.9.0 draft used eight step names. */
  const LEGACY_STEP = { who: "check", what: "check", detail: "revise", marks: "revise", read: "revise" };
  const PHASES = ["Pick", "Write", "Check", "Revise", "Compare"];

  /* =========================================================
     STORAGE
     ========================================================= */
  const store = { data: { version: 1, pieces: [] }, ok: true, available: true, message: "" };

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

  /* Fill in any field an older save is missing, so old data never crashes. */
  function normalize(p) {
    p.status = p.status === "finished" ? "finished" : "writing";
    p.step = LEGACY_STEP[p.step] || (STEPS.indexOf(p.step) >= 0 ? p.step : "draft");
    if (typeof p.firstDraft !== "string") p.firstDraft = null;
    if (typeof p.revision !== "string") p.revision = p.firstDraft || "";
    p.marks = Object.assign({ who: null, what: null, text: "", whoWords: "", whatWords: "" }, p.marks || {});
    p.checks = Object.assign({ who: null, sense: null, capital: false, ending: false, names: false }, p.checks || {});
    p.help = Object.assign({ rung: 0, wordBank: false, starters: false, frameUsed: false, examples: [], detailIdeas: false, restored: false }, p.help || {});
    if (!Array.isArray(p.help.examples)) p.help.examples = [];
    if (typeof p.parentNote !== "string") p.parentNote = "";
    if (!p.updated) p.updated = p.created || new Date(0).toISOString();
    return p;
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
      store.data = { version: 1, pieces: d.pieces.filter(validPiece).map(normalize) };
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
    if (store.ok) setSaveStatus("Saving…");
    saveTimer = setTimeout(() => { saveTimer = null; save(); }, 250);
  }
  function flush() {
    if (saveTimer) { clearTimeout(saveTimer); saveTimer = null; save(); }
  }
  function saveNow() { clearTimeout(saveTimer); saveTimer = null; save(); }

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
    /* Drop untouched pieces (prompt picked, nothing written). */
    store.data.pieces = store.data.pieces.filter(p =>
      !(p.status === "writing" && p.firstDraft === null && !p.draft.trim()));
    const p = normalize({
      id: "w" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      promptId: promptId,
      status: "writing",
      step: "draft",
      draft: "",
      firstDraft: null,
      revision: "",
      created: now(),
      updated: now(),
      finished: null
    });
    store.data.pieces.push(p);
    return p;
  }

  function touch(p) { p.updated = now(); saveSoon(); }

  function unfinished() {
    return store.data.pieces.filter(p => p.status === "writing")
      .sort((a, b) => b.updated.localeCompare(a.updated))[0] || null;
  }
  function finishedPieces() {
    return store.data.pieces.filter(p => p.status === "finished")
      .sort((a, b) => (b.finished || "").localeCompare(a.finished || ""));
  }
  function promptOf(p) {
    return W.prompts.find(x => x.id === p.promptId) || W.prompts[W.prompts.length - 1];
  }

  /* =========================================================
     TEXT HELPERS — mechanical only. None of these grade a sentence.
     ========================================================= */
  function tokens(text) { return text.trim().split(/\s+/).filter(Boolean); }

  /* Words that end in a period without ending a sentence. */
  const ABBREV = /^(mr|mrs|ms|dr|st|mt|jr|sr|vs|etc|prof|ave|rd|no|a\.m|p\.m|u\.s|e\.g|i\.e)$/i;
  const CLOSERS = "\"'”’)]";

  function endsWithMark(t) {
    let i = t.length - 1;
    while (i >= 0 && CLOSERS.indexOf(t[i]) >= 0) i--;
    return i >= 0 && /[.!?…]/.test(t[i]);
  }

  /* Is there a sentence boundary inside the text? A boundary is an end
     mark (plus any closing quotes) followed by a space and a capital
     letter, where the word before the mark is not an abbreviation or an
     initial. A lowercase word after a quote ("Wow!" said Mom.) is the same
     sentence. */
  function looksLikeMany(t) {
    const words = tokens(t);
    for (let i = 0; i < words.length - 1; i++) {
      const w = words[i];
      let j = w.length - 1;
      while (j >= 0 && CLOSERS.indexOf(w[j]) >= 0) j--;
      if (j < 0 || !/[.!?]/.test(w[j])) continue;
      const next = words[i + 1].replace(/^["'“‘(\[]+/, "");
      if (!/^[A-Z0-9]/.test(next)) continue;
      if (w[j] === ".") {
        const base = w.slice(0, j).replace(/^["'“‘(\[]+/, "").replace(/\.+$/, "");
        if (ABBREV.test(base) || /^[A-Z]$/.test(base)) continue;
      }
      return true;
    }
    return false;
  }

  function looksAt(text) {
    const t = text.trim();
    const L = W.steps.revise.looks;
    const out = [];
    if (!t) return out;
    const first = t.replace(/^[^A-Za-z0-9]+/, "");
    if (/^[a-z]/.test(first)) out.push({ key: "firstLetter", text: L.firstLetter });
    if (!endsWithMark(t)) out.push({ key: "ending", text: L.ending });
    if (/(^|[\s"“‘(])i(?=$|[\s,!?'’”"]|\.(?!e\.))/.test(t)) out.push({ key: "wordI", text: L.wordI });
    if (/_{3,}/.test(t)) out.push({ key: "blanks", text: L.blanks });
    if (looksLikeMany(t)) out.push({ key: "many", text: L.many });
    return out;
  }

  /* Word-level difference for the comparison screen (LCS). Words are
     compared without case or surrounding punctuation, so "the" -> "The"
     or adding a period is a mark change, not a new word. Display only. */
  function diffWords(a, b) {
    const norm = w => w.toLowerCase().replace(/^["“‘'(\[]+/, "").replace(/[.!?,;:"”’')\]]+$/, "");
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
     SHARED RENDERING
     ========================================================= */
  const ui = { piece: null, nudged: false };

  function heading(text) {
    const h = make("h2", "activity-title", text);
    h.id = "write-heading";
    h.tabIndex = -1;
    return h;
  }

  function renderPhases(step) {
    const host = el("write-steps");
    clear(host);
    const at = { choose: 0, draft: 1, "draft-locked": 1, check: 2, revise: 3, compare: 4 }[step];
    PHASES.forEach((name, i) => {
      const li = make("li", "step-pill" + (i === at ? " is-current" : i < at ? " is-done" : ""));
      li.appendChild(make("span", "step-num", String(i + 1)));
      li.appendChild(make("span", "step-name", name));
      if (i === at) li.setAttribute("aria-current", "step");
      host.appendChild(li);
    });
  }

  /* The child's sentence shown as text. pre-wrap keeps their line breaks. */
  function sentenceBox(text) {
    const box = make("p", "write-text");
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

  function navButton(label, onClick, cls) {
    const b = make("button", "nav-btn" + (cls ? " " + cls : ""), label);
    b.type = "button";
    if (onClick) b.addEventListener("click", onClick);
    return b;
  }

  function controls(primary, extra) {
    const row = make("div", "controls write-controls");
    (extra || []).forEach(x => { if (x) row.appendChild(x); });
    row.appendChild(primary);
    return row;
  }

  function choice(label, pressed) {
    const b = make("button", "choice-btn write-choice", label);
    b.type = "button";
    b.setAttribute("aria-pressed", String(!!pressed));
    return b;
  }

  /* Example help: always a different sentence from the child's topic. */
  function exampleHelp(key, spec, line) {
    const p = ui.piece;
    const wrap = make("div", "write-example");
    const b = navButton("Show me an example", null, "btn-help");
    const panel = make("div", "ladder-rung");
    panel.tabIndex = -1;
    panel.hidden = true;
    b.addEventListener("click", () => {
      panel.hidden = false;
      b.hidden = true;
      if (!panel.firstChild) {
        const sh = make("div", "sentence-host");
        S.renderSentence(sh, spec);
        panel.appendChild(sh);
        panel.appendChild(make("p", "ladder-text", line));
      }
      if (p.help.examples.indexOf(key) < 0) { p.help.examples.push(key); touch(p); }
      panel.focus();
    });
    wrap.appendChild(b);
    wrap.appendChild(panel);
    return wrap;
  }

  /* =========================================================
     ROUTER
     ========================================================= */
  function show(step, opts) {
    const p = ui.piece;
    /* After the first draft is frozen, Write shows it read-only. */
    if (step === "draft" && p && p.firstDraft !== null) step = "draft-locked";
    const scr = el("screen-write");
    if (scr) scr.dataset.view = step;
    if (p && step !== "choose" && step !== "draft-locked") {
      p.step = step;
      p.updated = now();
      saveNow();
    }
    ui.nudged = false;
    stopSpeech();
    renderPhases(step);
    const host = el("write-body");
    clear(host);
    ({ choose: renderChoose, draft: renderDraft, "draft-locked": renderDraftLocked,
       check: renderCheck, revise: renderRevise, compare: renderCompare })[step](host);
    window.SS_SHELL.showScreen("write");
    if (!(opts && opts.noFocus)) {
      const h = el("write-heading");
      if (h) h.focus();
    }
  }

  /* ---------- Pick ---------- */
  function renderChoose(host) {
    const stage = make("div", "stage");
    stage.appendChild(heading("What do you want to write about?"));
    stage.appendChild(make("p", "write-lead", "Pick one idea. You will write one sentence. Then you can make it even better, or keep it."));
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
        show("draft");
      });
      li.appendChild(b);
      list.appendChild(li);
    });
    stage.appendChild(list);
    host.appendChild(stage);
  }

  /* ---------- Write: the first draft ---------- */
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
    stage.appendChild(ta);

    const nudge = make("p", "write-nudge", D.emptyNudge);
    nudge.id = "write-nudge";
    nudge.setAttribute("role", "status");
    nudge.hidden = true;
    stage.appendChild(nudge);
    ta.addEventListener("input", () => { p.draft = ta.value; nudge.hidden = true; touch(p); });

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

    const helpBtn = navButton("Help me", () => {
      if (p.help.rung < 4) { p.help.rung++; touch(p); }
      renderLadder(help, ta);
      const last = help.querySelector(".ladder-rung:last-child");
      if (last) last.focus();
      if (p.help.rung >= 4) helpBtn.disabled = true;
    }, "btn-help");
    helpBtn.id = "write-help-btn";
    if (p.help.rung >= 4) helpBtn.disabled = true;

    host.appendChild(controls(primaryButton(D.primary, () => {
      if (!p.draft.trim()) { nudge.hidden = false; ta.focus(); return; }
      p.firstDraft = p.draft;
      p.revision = p.draft;
      show("check");
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
        rung.appendChild(navButton(L.frameButton, () => {
          const v = ta.value;
          ta.value = v.trim() ? v.replace(/\s+$/, "") + " " + pr.frame : pr.frame;
          p.draft = ta.value;
          p.help.frameUsed = true;
          touch(p);
          ta.focus();
        }));
        rung.appendChild(make("p", "ladder-note", L.frameNote));
      }
      host.appendChild(rung);
    }
  }

  /* Read-only first draft, reached with Back once it is frozen. */
  function renderDraftLocked(host) {
    const p = ui.piece;
    const stage = make("div", "stage");
    stage.appendChild(heading("Your first draft"));
    stage.appendChild(make("p", "write-lead", "Your first draft is saved just as you wrote it. You can change your new version on the Revise screen."));
    stage.appendChild(sentenceBox(p.firstDraft || ""));
    host.appendChild(stage);
    host.appendChild(controls(primaryButton("Next", () => show("check"))));
  }

  /* ---------- Check: the child's own judgments ---------- */
  /* Tap-your-own-words. Index marks belong to one exact text; when the
     sentence changes they reset, but the marked WORDS are kept as text so
     the grown-up still sees what the child chose. */
  function wordPicker(field, kind, label, onPick) {
    const p = ui.piece;
    const words = tokens(p.revision);
    if (p.marks.text !== p.revision) { p.marks.who = null; p.marks.what = null; p.marks.text = p.revision; }
    const picked = new Set(p.marks[field] || []);
    const row = make("div", "pick-row");
    row.setAttribute("role", "group");
    row.setAttribute("aria-label", label);
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

  function renderCheck(host) {
    const p = ui.piece, K = W.steps.check;
    const stage = make("div", "stage");
    stage.appendChild(heading(K.title));
    stage.appendChild(sentenceBox(p.revision));
    const status = make("p", "write-note");
    status.id = "write-check-status";
    status.setAttribute("role", "status");

    /* 1. Who or what */
    const q1 = make("div", "check-q");
    q1.appendChild(make("p", "write-qtext", "1. " + K.whoAsk));
    q1.appendChild(wordPicker("who", "subject", K.whoAsk, () => {
      if (p.checks.who !== "command") p.checks.who = p.marks.who.length ? "marked" : null;
      touch(p);
      status.textContent = "";
    }));
    const alt = make("div", "write-alt");
    const cmd = choice(K.command, p.checks.who === "command");
    cmd.dataset.who = "command";
    const miss = choice(K.missing, p.checks.who === "missing");
    miss.dataset.who = "missing";
    const toggleWho = (value, btn, other, note) => {
      const on = p.checks.who !== value;
      p.checks.who = on ? value : (p.marks.who && p.marks.who.length ? "marked" : null);
      btn.setAttribute("aria-pressed", String(on));
      other.setAttribute("aria-pressed", "false");
      status.textContent = on ? note : "";
      touch(p);
    };
    cmd.addEventListener("click", () => toggleWho("command", cmd, miss, K.commandNote));
    miss.addEventListener("click", () => toggleWho("missing", miss, cmd, W.steps.revise.fromCheck.missing));
    alt.appendChild(cmd); alt.appendChild(miss);
    q1.appendChild(alt);
    stage.appendChild(q1);

    /* 2. What happens */
    const q2 = make("div", "check-q");
    q2.appendChild(make("p", "write-qtext", "2. " + K.whatAsk));
    q2.appendChild(wordPicker("what", "verb", K.whatAsk, () => { status.textContent = ""; }));
    stage.appendChild(q2);

    /* 3. Makes sense */
    const q3 = make("fieldset", "write-question check-q");
    q3.appendChild(make("legend", "write-qtext", "3. " + K.sense));
    const row = make("div", "write-alt");
    const yes = choice(K.senseYes, p.checks.sense === "yes");
    yes.dataset.sense = "yes";
    const no = choice(K.senseNo, p.checks.sense === "notyet");
    no.dataset.sense = "notyet";
    yes.addEventListener("click", () => { p.checks.sense = "yes"; yes.setAttribute("aria-pressed", "true"); no.setAttribute("aria-pressed", "false"); status.textContent = ""; touch(p); });
    no.addEventListener("click", () => { p.checks.sense = "notyet"; no.setAttribute("aria-pressed", "true"); yes.setAttribute("aria-pressed", "false"); status.textContent = W.steps.revise.fromCheck.notyet; touch(p); });
    row.appendChild(yes); row.appendChild(no);
    q3.appendChild(row);
    stage.appendChild(q3);
    stage.appendChild(status);
    stage.appendChild(exampleHelp("check", K.example, K.exampleLine));
    host.appendChild(stage);

    host.appendChild(controls(primaryButton("Next", () => {
      const answered = (p.marks.who && p.marks.who.length) || (p.marks.what && p.marks.what.length) || p.checks.who || p.checks.sense;
      if (!answered && !ui.nudged) { ui.nudged = true; status.textContent = K.nudge; return; }
      if (!p.checks.who) p.checks.who = "skipped";
      show("revise");
    }), [navButton("← Back", () => show("draft-locked"))]));
  }

  /* ---------- Revise: optional changes ---------- */
  function renderRevise(host) {
    const p = ui.piece, K = W.steps.revise;
    const stage = make("div", "stage");
    stage.appendChild(heading(K.title));
    stage.appendChild(make("p", "write-lead", K.ask));

    if (p.checks.who === "missing") stage.appendChild(make("p", "write-tip", K.fromCheck.missing));
    if (p.checks.sense === "notyet") stage.appendChild(make("p", "write-tip", K.fromCheck.notyet));

    const label = make("label", "write-label", W.editLabel);
    label.htmlFor = "write-revision";
    stage.appendChild(label);
    const ta = make("textarea", "write-input");
    ta.id = "write-revision";
    ta.rows = 3;
    ta.value = p.revision;
    stage.appendChild(ta);
    stage.appendChild(make("p", "write-hint", W.editHint));

    const acts = make("div", "write-mine-actions");
    const sp = speakButton(() => p.revision, "Read my sentence to me");
    if (sp) acts.appendChild(sp);
    const restore = navButton(K.restore, () => {
      if (p.revision === p.firstDraft) return;
      if (!window.confirm(K.restoreConfirm)) return;
      p.revision = p.firstDraft || "";
      p.help.restored = true;
      ta.value = p.revision;
      touch(p);
      refresh();
      ta.focus();
    });
    restore.id = "write-restore";
    acts.appendChild(restore);
    stage.appendChild(acts);

    /* Things to look at: questions about marks, updated as the child types. */
    const look = make("div", "write-look");
    look.id = "write-look";
    look.setAttribute("aria-live", "polite");
    stage.appendChild(look);

    /* Optional detail ideas, folded away. Nothing is required. */
    const det = make("details", "write-detail");
    det.id = "write-detail";
    det.appendChild(make("summary", "write-detail-summary", K.detailTitle));
    det.appendChild(make("p", "write-note", K.detailIntro));
    const ul = make("ul", "write-look-list");
    K.detailIdeas.forEach(t => ul.appendChild(make("li", "", t)));
    det.appendChild(ul);
    det.appendChild(make("p", "write-text is-small", K.detailExample.from));
    det.appendChild(make("p", "write-arrow", "↓"));
    det.appendChild(make("p", "write-text is-small", K.detailExample.to));
    det.addEventListener("toggle", () => { if (det.open && !p.help.detailIdeas) { p.help.detailIdeas = true; touch(p); } });
    stage.appendChild(det);

    const fs = make("fieldset", "write-question");
    fs.appendChild(make("legend", "write-qtext", K.checksTitle));
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
    stage.appendChild(make("p", "write-honest", K.honest));

    const emptyNote = make("p", "write-nudge", K.empty);
    emptyNote.setAttribute("role", "status");
    emptyNote.hidden = true;
    stage.appendChild(emptyNote);
    host.appendChild(stage);

    const finish = primaryButton("", () => {
      if (!p.revision.trim()) { emptyNote.hidden = false; ta.focus(); return; }
      p.status = "finished";
      p.finished = now();
      show("compare");
    });

    function refresh() {
      clear(look);
      look.appendChild(make("p", "write-look-title", K.lookTitle));
      const items = looksAt(p.revision);
      look.classList.toggle("is-clear", !items.length);
      if (!items.length) look.appendChild(make("p", "write-look-none", K.nothing));
      else {
        const l = make("ul", "write-look-list");
        items.forEach(it => { const li = make("li", "", it.text); li.dataset.look = it.key; l.appendChild(li); });
        look.appendChild(l);
      }
      const same = p.revision === p.firstDraft;
      finish.textContent = same ? K.keep : K.finish;
      restore.hidden = same;
      if (p.revision.trim()) emptyNote.hidden = true;
    }
    ta.addEventListener("input", () => { p.revision = ta.value; touch(p); refresh(); });
    refresh();

    host.appendChild(controls(finish, [navButton("← Back", () => show("check"))]));
  }

  /* ---------- Compare ---------- */
  /* Facts and effort only. No message says the new version is better,
     that more words are better, or that the app checked the grammar. */
  function praise(p) {
    const out = [];
    const f = (p.firstDraft || "").trim(), r = p.revision.trim();
    if (f === r) {
      out.push("You read your sentence again and chose to keep it. That's a real writer's choice.");
    } else {
      const d = diffWords(f, r);
      out.push("You made a new version.");
      if (d.added.length) out.push("You added: " + d.added.map(a => "“" + a + "”").join(", ") + ".");
      if (d.removed.length) out.push("You took out: " + d.removed.map(a => "“" + a + "”").join(", ") + ". Taking words out is a real revision too.");
      if (/^[^A-Za-z]*[a-z]/.test(f) && /^[^A-Za-z]*[A-Z]/.test(r)) out.push("You changed the first letter to a capital.");
      if (!endsWithMark(f) && endsWithMark(r)) out.push("You added an end mark.");
      if (out.length === 1) out.push("You changed some marks or spacing.");
    }
    if (p.checks.who === "marked" && p.marks.whoWords) out.push("You marked who or what it's about: “" + p.marks.whoWords + "”.");
    if (p.checks.who === "command") out.push("You noticed it's a command.");
    if (p.checks.who === "missing" && f !== r) out.push("You said it needed a who or what, and you worked on it.");
    if (p.checks.sense === "notyet" && f !== r) out.push("You said it didn't make sense yet, and you worked on it.");
    if (p.help.rung || p.help.examples.length || p.help.starters || p.help.wordBank) out.push("You used help when you wanted it.");
    return out;
  }

  /* One suggestion, from the child's own answers. */
  function suggestion(p) {
    if (p.checks.who === "missing" || p.checks.who === "skipped") return { skill: "subject", activity: "learn", label: "More on subjects" };
    return { skill: "complete-sentence", activity: "practice", label: "Practice complete sentences" };
  }

  function renderCompare(host) {
    const p = ui.piece;
    const stage = make("div", "stage");
    stage.appendChild(heading("Your two versions"));
    const pair = make("div", "compare-pair");
    const a = make("div", "compare-card");
    a.appendChild(make("p", "compare-label", "First draft"));
    a.appendChild(sentenceBox(p.firstDraft || ""));
    const b = make("div", "compare-card is-new");
    b.appendChild(make("p", "compare-label", p.revision.trim() === (p.firstDraft || "").trim() ? "Final version (kept the same)" : "New version"));
    b.appendChild(sentenceBox(p.revision));
    pair.appendChild(a); pair.appendChild(b);
    stage.appendChild(pair);
    const ul = make("ul", "praise-list");
    praise(p).forEach(t => ul.appendChild(make("li", "", t)));
    stage.appendChild(ul);
    stage.appendChild(make("p", "write-note", "Your writing is saved on this device. You can show a grown-up, write another sentence, or stop here."));
    host.appendChild(stage);

    const sug = suggestion(p);
    const next = navButton(sug.label, () => window.SS_SHELL.openActivity(sug.skill, sug.activity));
    next.dataset.skill = sug.skill;
    const row = make("div", "done-buttons write-done");
    row.appendChild(primaryButton("Write another sentence", () => { ui.piece = null; show("choose"); }));
    row.appendChild(navButton("Show a grown-up", () => openParent()));
    row.appendChild(next);
    row.appendChild(navButton("Home", () => window.SS_SHELL.goHome()));
    host.appendChild(row);
  }

  /* =========================================================
     NAVIGATION
     ========================================================= */
  function start() { ui.piece = null; show("choose"); }

  function resume(id) {
    const p = store.data.pieces.find(x => x.id === id) || unfinished();
    if (!p) { start(); return; }
    ui.piece = p;
    show(p.step === "choose" ? "draft" : p.step);
  }

  /* Header Back: one screen back inside the activity, Home from the start. */
  function back() {
    const view = el("screen-write").dataset.view;
    const prev = { check: "draft-locked", revise: "check" }[view];
    if (!ui.piece || !prev) { flush(); stopSpeech(); window.SS_SHELL.goHome(); return; }
    show(prev);
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
      line = "Pick an idea, write one sentence, then check it.";
      label = "Start writing";
      action = () => start();
      secondary = { label: "Warm up first: Complete Sentence", fn: () => window.SS_SHELL.openSkill("complete-sentence") };
    } else {
      title = "Write another strong sentence";
      line = "You've written " + done.length + (done.length === 1 ? " sentence" : " sentences") + " so far. Try a new idea.";
      label = "Start writing";
      action = () => start();
      const s = suggestion(done[0]);
      secondary = { label: s.label, fn: () => window.SS_SHELL.openActivity(s.skill, s.activity) };
    }

    card.appendChild(make("h2", "next-title", title));
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
      const s = navButton(secondary.label, secondary.fn, "next-secondary");
      s.id = "next-secondary";
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
    const who = {
      marked: "Tapped as who/what" + (p.marks.whoWords ? ": “" + p.marks.whoWords + "”" : ""),
      command: "Said it is a command (subject: you)",
      missing: "Said it doesn't say who or what yet",
      skipped: "Did not answer who/what"
    }[c.who];
    if (who) out.push(who);
    out.push(p.marks.whatWords ? "Tapped as what happens: “" + p.marks.whatWords + "”" : "Did not tap what happens");
    out.push(c.sense === "yes" ? "Makes sense by itself? Said yes"
      : c.sense === "notyet" ? "Makes sense by itself? Said not yet" : "Makes sense by itself? Did not answer");
    W.steps.revise.checks.forEach(k => out.push((c[k.key] ? "Ticked: " : "Not ticked: ") + k.label));
    return out;
  }
  function describeHelp(p) {
    const h = p.help, out = [];
    if (h.rung) out.push("Help me: " + h.rung + " of 4 steps (" + W.ladder.label.slice(0, h.rung).join(", ") + ")");
    if (h.starters) out.push("Opened sentence starters");
    if (h.wordBank) out.push("Used the word bank");
    if (h.frameUsed) out.push("Added the sentence frame to the draft");
    if (h.examples.length) out.push("Looked at an example on the Check screen");
    if (h.detailIdeas) out.push("Opened the optional detail ideas");
    if (h.restored) out.push("Put the first draft back on the Revise screen");
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
    intro.appendChild(make("p", "", "This page shows your child's writing: the prompt, the first draft, the revised version, the help used, and their own answers to the check questions."));
    intro.appendChild(make("p", "", "What the app checks: it only points out a few marks to look at (first letter, end mark, a lowercase “i”, leftover frame blanks, what looks like a second sentence). It does not decide whether a sentence is complete, clear, or correct. The answers below are your child's own judgments; the app did not verify them. Finishing a piece does not mean a skill is mastered. Please read the writing and talk about it together."));
    intro.appendChild(make("p", "", "Where it's saved: only in this browser on this device. It does not sync to other devices, and clearing browser data removes it. No account, no names, nothing is sent anywhere."));
    if (!store.ok) intro.appendChild(make("p", "write-nudge", store.message));
    host.appendChild(intro);

    const pieces = store.data.pieces.filter(p => p.draft.trim() || p.firstDraft !== null)
      .sort((a, b) => b.updated.localeCompare(a.updated));
    if (!pieces.length) host.appendChild(make("p", "write-note", "No saved writing yet."));
    pieces.forEach(p => {
      const card = make("article", "stage parent-piece");
      card.dataset.piece = p.id;
      card.appendChild(make("h3", "parent-prompt", promptOf(p).ask));
      card.appendChild(make("p", "parent-meta",
        p.status === "finished" ? "Finished " + fmtDate(p.finished) : "Not finished yet · last saved " + fmtDate(p.updated)));
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
        const changes = p.firstDraft.trim() === p.revision.trim() ? "Kept the same."
          : [d.added.length ? "Added: " + d.added.join(" / ") : "", d.removed.length ? "Removed: " + d.removed.join(" / ") : ""].filter(Boolean).join(" · ") || "Changed capitals, punctuation or spacing.";
        card.appendChild(make("p", "parent-meta", "Changes: " + changes));
      }
      const cols = make("div", "parent-cols");
      const c1 = make("div");
      c1.appendChild(make("h4", "parent-h", "Child's own answers (not checked by the app)"));
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

      card.appendChild(navButton("Delete this piece", () => {
        if (!window.confirm("Delete this piece of writing? This can't be undone.")) return;
        store.data.pieces = store.data.pieces.filter(x => x.id !== p.id);
        if (ui.piece && ui.piece.id === p.id) ui.piece = null;
        save();
        renderParent();
        el("parent-heading").focus();
      }, "parent-delete"));
      host.appendChild(card);
    });

    if (pieces.length) {
      const all = navButton("Delete all saved writing", () => {
        if (!window.confirm("Delete ALL saved writing on this device? This can't be undone.")) return;
        store.data.pieces = [];
        ui.piece = null;
        save();
        renderParent();
        el("parent-heading").focus();
      }, "parent-delete");
      all.id = "parent-delete-all";
      host.appendChild(all);
    }

    /* Standards: teacher/parent information, kept here and off the child's
       screens. Codes come from the same verified renderer the 1.5-1.8
       child-screen tags used (SS_GA.verify in app.js). */
    const ga = make("details", "stage parent-standards");
    ga.id = "parent-standards";
    ga.appendChild(make("summary", "path-summary", "Georgia standards for each skill"));
    ga.appendChild(make("p", "", "These codes are checked against a saved copy of the Georgia Department of Education's Grade 3 ELA standards (CASE package, retrieved 2026-10-24). Sentence Sense practices some Grade 3 language skills. It does not cover all of the Georgia standards and has not been reviewed by the state or a school district. One code from earlier builds, 3.L.V.2.b, could not be verified and is not listed."));
    const list = make("dl", "parent-ga-list");
    (C.homeGroups || []).forEach(g => g.skills.forEach(k => {
      const t = C.topics[k];
      if (!t || !t.ga || !window.SS_GA) return;
      list.appendChild(make("dt", "parent-ga-skill", t.name));
      window.SS_GA.verify(t.ga).forEach(c => {
        const dd = make("dd", "parent-ga-code");
        dd.appendChild(make("span", "ga-code", c.code));
        if (c.label) dd.appendChild(make("span", "parent-ga-label", " " + c.label));
        list.appendChild(dd);
      });
    }));
    list.appendChild(make("dt", "parent-ga-skill", "Write a Strong Sentence"));
    [["3.L.GC.2.a", "Correctly structured sentences"], ["3.L.GC.2.d", "Optional detail with adjectives and adverbs"]].forEach(c => {
      const dd = make("dd", "parent-ga-code");
      dd.appendChild(make("span", "ga-code", c[0]));
      dd.appendChild(make("span", "parent-ga-label", " " + c[1]));
      list.appendChild(dd);
    });
    ga.appendChild(list);
    host.appendChild(ga);
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
    /* Another tab changed the saved writing. If this tab is mid-activity,
       stop saving from it so it can't overwrite newer work. */
    window.addEventListener("storage", e => {
      if (e.key !== KEY) return;
      const editing = ui.piece && el("screen-write") && !el("screen-write").hidden;
      if (editing) {
        store.available = false;
        store.ok = false;
        store.message = "This writing was changed in another tab. Close one of the tabs, then refresh, so nothing is lost.";
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
    _diffWords: diffWords,
    _praise: praise
  };
})();
