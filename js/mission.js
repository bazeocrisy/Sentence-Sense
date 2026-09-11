/* =========================================================
   Sentence Sense — VERB MISSION ENGINE  (Build 1.3.0)
   "Sentence Detectives" — the illustrated Verb prototype.

   WHY THIS IS A SEPARATE FILE
   js/learn.js runs ONE four-step lesson (Definition, Clue, Example,
   Try It) for all six topics, driven by its STEP_KEYS array. The
   mission is a five-phase illustrated sequence with word-level
   selection, scene swapping and a two-word answer. Bending the shared
   runner into that shape would have put every topic's code path at
   risk for the sake of one prototype.

   So this engine is ADDITIVE and completely separate:
     - learn.js is untouched except for the single routing hook that
       sends the Verb card here
     - the other five topics keep their existing behaviour, byte for
       byte, because none of their code paths were edited
     - the original Verb lesson, including its 20-question bank, is
       still reachable at ?verb=classic so the bank engine stays
       exercisable and nothing that worked was thrown away

   WHAT THIS FILE DOES NOT DO
   It contains no sentences, no questions, no answers, no feedback and
   no coaching wording. Every word a child reads comes from
   js/data/mission-verb.js, and every illustration from js/scenes.js.
   Feedback is static and deterministic: looked up, never generated.

   NOTHING IS PERSISTED. No localStorage, no sessionStorage, no
   network, no score, no timer, no streak. Leaving and returning
   starts the case from the beginning, which matches the rest of Learn.
   ========================================================= */

(function () {
  "use strict";

  var M = window.SS_MISSION_VERB;
  var SC = window.SS_SCENES;
  var el = function (id) { return document.getElementById(id); };

  /* ---------- the card sequence ----------
     Flat, explicit and built once. A flat list is what makes Back,
     the rail and "which phase am I in" all trivially correct. */
  var CARDS = [];

  function buildSequence() {
    CARDS = [];
    CARDS.push({ kind: "briefing", phase: "watch" });
    CARDS.push(M.watch);
    M.find.forEach(function (c) { CARDS.push(c); });
    M.explore.forEach(function (c) { CARDS.push(c); });
    CARDS.push(M.solve);
    M.extend.forEach(function (c) { CARDS.push(c); });
    CARDS.push({ kind: "done", phase: "extend" });
  }

  /* ---------- state ----------
     Per-card interaction state is rebuilt on every card entry, so a
     card can never inherit a previous card's attempts or selections. */
  var S = {
    pos: 0,
    revealed: false,     // reveal cards: has the child pressed the action?
    picked: [],          // pick cards: target indexes found so far
    wrong: [],           // pick cards: word indexes already ruled out
    attempts: 0,         // wrong attempts on THIS card
    solved: false,       // the card's task is complete
    tried: [],           // swap cards: option words already tried
    activeOption: null,  // swap cards: the option currently showing
    whyOpen: false,      // solve card: the explanation question is showing
    whyDone: false,
    speaking: false
  };

  function resetCard() {
    S.revealed = false;
    S.picked = [];
    S.wrong = [];
    S.attempts = 0;
    S.solved = false;
    S.tried = [];
    S.activeOption = null;
    S.whyOpen = false;
    S.whyDone = false;
  }

  /* ---------- DOM helpers ---------- */
  function make(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined && text !== null) n.textContent = text;
    return n;
  }
  function clear(n) { while (n.firstChild) n.removeChild(n.firstChild); }

  function reducedMotion() {
    return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }

  /* Fisher-Yates. Used for the explanation question's choices, for the
     same reason js/learn.js shuffles bank choices (D-29): a fixed
     answer position is a shortcut past the thinking. */
  function shuffled(arr) {
    var a = arr.slice(), i, j, t;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function card() { return CARDS[S.pos]; }

  /* =========================================================
     READ ALOUD
     Web Speech API: already in the browser, so there is no paid
     service, no account, no network request and no new dependency.
     It never autoplays, and it reads the PLAIN sentence only — never
     a label, a mark or a mark's text — so it cannot announce an
     answer. If the API is missing the control is simply not rendered.
     ========================================================= */
  function speechAvailable() {
    return typeof window.speechSynthesis !== "undefined" &&
           typeof window.SpeechSynthesisUtterance !== "undefined";
  }

  function stopSpeech() {
    if (!speechAvailable()) return;
    try { window.speechSynthesis.cancel(); } catch (e) { /* nothing to stop */ }
    S.speaking = false;
  }

  function speakSentence(text, btn) {
    if (!speechAvailable()) return;
    if (S.speaking) { stopSpeech(); if (btn) btn.textContent = M.readAloud.label; return; }
    stopSpeech();
    var u = new window.SpeechSynthesisUtterance(text);
    u.rate = 0.85;           // slower than default: this is a reader, not a narrator
    u.pitch = 1.05;
    u.lang = "en-US";
    u.onend = function () { S.speaking = false; if (btn) btn.textContent = M.readAloud.label; };
    u.onerror = function () { S.speaking = false; if (btn) btn.textContent = M.readAloud.label; };
    S.speaking = true;
    if (btn) btn.textContent = M.readAloud.stopLabel;
    window.speechSynthesis.speak(u);
  }

  /* The exact text that is spoken. Built from the same words array the
     sentence is drawn from, so it can never drift from what is shown. */
  function plainText(c) {
    var words = c.words.slice();
    if (c.kind === "swap") {
      words[c.slot] = S.activeOption ? S.activeOption.word : "blank";
    }
    return words.join(" ");
  }

  /* =========================================================
     THE SENTENCE
     One renderer for every card, so a sentence looks and behaves the
     same everywhere in the mission.

     mode "plain"   — static words, nothing selectable
     mode "pick"    — every word is a real <button>: keyboard, focus
                      ring and touch target come for free, and a child
                      must read the words to choose one, which a
                      four-button answer list does not guarantee
     marked         — word indexes to decorate. A single index gets one
                      label; two contiguous indexes are wrapped as one
                      phrase under one label, because the teaching
                      point of a verb phrase is that the words are ONE
                      verb.

     Colour is never the only signal: a marked word carries a written
     label above it, a thick underline and a border, matching the rule
     the six original lessons already follow.
     ========================================================= */
  function renderSentence(host, c, opts) {
    clear(host);
    opts = opts || {};
    var mode = opts.mode || "plain";
    var marked = opts.marked || [];
    var label = opts.markLabel || "VERB";
    var box = make("div", "mi-sentence" + (mode === "pick" ? " is-pick" : ""));

    var i = 0;
    while (i < c.words.length) {
      /* a contiguous marked run becomes one labelled group */
      if (marked.length > 1 && marked.indexOf(i) === 0 && marked[1] === i + 1) {
        box.appendChild(markGroup(c, marked, label, mode, opts));
        i = marked[marked.length - 1] + 1;
        continue;
      }
      box.appendChild(wordNode(c, i, marked.indexOf(i) !== -1, label, mode, opts));
      i += 1;
    }
    host.appendChild(box);
  }

  /* Ending punctuation sits outside the underline, so the child sees
     "blocked" marked as the verb and not "blocked." — the same rule
     js/learn.js applies to its marked chips. */
  function splitTail(w) {
    var tail = /[.!?,]$/.test(w) ? w.slice(-1) : "";
    return { base: tail ? w.slice(0, -1) : w, tail: tail };
  }

  /* The word and its punctuation share ONE row inside the chip.
     .mi-word is a column so the label can sit above the word; without
     this wrapper the comma became a third row of its own and "stream,"
     rendered as "stream" with a comma dropped underneath it. */
  function wordBody(parts) {
    var body = make("span", "mi-word-body");
    body.appendChild(make("span", "mi-word-text", parts.base));
    if (parts.tail) body.appendChild(make("span", "mi-word-punct", parts.tail));
    return body;
  }

  function wordNode(c, i, isMarked, label, mode, opts) {
    var w = c.words[i];
    var slotBlank = (c.kind === "swap" && i === c.slot);
    var parts = splitTail(w);
    var tag, node;

    if (slotBlank) {
      node = make("span", "mi-word mi-slot" + (S.activeOption ? " is-filled" : ""));
      node.appendChild(make("span", "mi-word-text",
        S.activeOption ? S.activeOption.word : "?"));
      if (!S.activeOption) node.setAttribute("aria-label", "missing verb");
      return node;
    }

    if (mode === "pick" && !isMarked) {
      node = make("button", "mi-word mi-word-btn");
      node.type = "button";
      node.dataset.wi = String(i);
      if (opts.wrong && opts.wrong.indexOf(i) !== -1) {
        node.classList.add("is-wrong");
        node.disabled = true;
      }
      if (opts.lock) node.disabled = true;
      node.appendChild(wordBody(parts));
      return node;
    }

    node = make("span", "mi-word" + (isMarked ? " is-marked" : ""));
    if (isMarked) node.appendChild(make("span", "mi-word-label", label));
    node.appendChild(wordBody(parts));
    return node;
  }

  function markGroup(c, marked, label, mode, opts) {
    var g = make("span", "mi-word mi-phrase is-marked");
    g.appendChild(make("span", "mi-word-label", label));
    var inner = make("span", "mi-phrase-words");
    marked.forEach(function (mi) {
      var w = make("span", "mi-phrase-word");
      w.appendChild(wordBody(splitTail(c.words[mi])));
      inner.appendChild(w);
    });
    g.appendChild(inner);
    return g;
  }

  /* =========================================================
     PIECES EVERY CARD SHARES
     ========================================================= */

  function coachBlock(mood, line) {
    var wrap = make("div", "mi-coach");
    var art = make("span", "mi-coach-art");
    art.setAttribute("aria-hidden", "true");
    art.innerHTML = SC.detective(mood);
    var bubble = make("p", "mi-bubble", line);
    wrap.appendChild(art);
    wrap.appendChild(bubble);
    return wrap;
  }

  /* The illustration. role="img" with a label written in the content
     file, because the correct description depends on the teaching
     moment: before a reveal it must not name the verb. */
  function sceneBlock(sceneId, alt, animated) {
    if (!sceneId || !SC.has(sceneId)) return null;
    var fig = make("figure", "mi-scene" + (animated ? " is-animated" : ""));
    fig.setAttribute("role", "img");
    fig.setAttribute("aria-label", alt || "");
    fig.innerHTML = SC.get(sceneId);
    return fig;
  }

  function speakBlock(c) {
    if (!speechAvailable()) return null;
    var b = make("button", "mi-speak", M.readAloud.label);
    b.type = "button";
    var icon = make("span", "mi-speak-icon", "🔊");
    icon.setAttribute("aria-hidden", "true");
    b.insertBefore(icon, b.firstChild);
    b.addEventListener("click", function () { speakSentence(plainText(c), b); });
    return b;
  }

  function feedbackBlock() {
    var f = make("div", "mi-feedback");
    f.id = "mi-feedback";
    f.setAttribute("role", "status");
    f.setAttribute("aria-live", "polite");
    return f;
  }

  /* Feedback never replaces the sentence — the sentence stays on screen
     above it, so the child can re-read while being corrected. */
  function say(kind, lines) {
    var f = el("mi-feedback");
    if (!f) return;
    clear(f);
    f.className = "mi-feedback is-" + kind;
    if (kind !== "none") {
      var mark = make("span", "mi-fb-mark", kind === "right" ? "✓" : kind === "wrong" ? "✕" : "💡");
      mark.setAttribute("aria-hidden", "true");
      f.appendChild(mark);
    }
    var body = make("span", "mi-fb-body");
    lines.filter(Boolean).forEach(function (t, i) {
      body.appendChild(make("span", i === 0 ? "mi-fb-text" : "mi-fb-extra", t));
    });
    f.appendChild(body);
  }

  /* =========================================================
     THE PRIMARY ACTION
     There is exactly ONE primary action visible at a time, and its
     label always says what it will do — never a bare "Next". The
     bottom control row is that action; nothing else competes with it.
     ========================================================= */
  function setAction(label, enabled, hint) {
    var b = el("mission-next");
    b.textContent = label;
    b.disabled = !enabled;
    var h = el("mission-hint");
    h.textContent = hint || "";
    h.hidden = !hint;
  }

  /* =========================================================
     RAIL
     Visible progress through a short mission: five named stops. Not a
     score, not a percentage, not a count of right answers.
     ========================================================= */
  function renderRail() {
    var rail = el("mission-rail");
    clear(rail);
    var c = card();
    /* On the completion card every stop is finished, including the one
       whose phase the card technically belongs to. Leaving Extend marked
       "current" on a screen headed "Case closed!" tells the child there
       is still something to do there. */
    var done = (c.kind === "done");
    var idx = done ? M.rail.length : M.rail.map(function (r) { return r.key; }).indexOf(c.phase);

    M.rail.forEach(function (r, i) {
      var li = make("li", "mi-rail-item");
      if (i < idx) li.classList.add("is-done");
      if (i === idx) { li.classList.add("is-current"); li.setAttribute("aria-current", "step"); }
      var dot = make("span", "mi-rail-dot", i < idx ? "✓" : String(i + 1));
      dot.setAttribute("aria-hidden", "true");
      li.appendChild(dot);
      li.appendChild(make("span", "mi-rail-label", r.label));
      rail.appendChild(li);
    });
  }

  /* =========================================================
     CARD RENDERERS
     ========================================================= */

  function renderBriefing(host) {
    el("mission-heading").textContent = M.caseName;
    var wrap = make("div", "mi-brief");
    var art = make("div", "mi-brief-art");
    art.setAttribute("aria-hidden", "true");
    art.innerHTML = SC.detective("idle");
    wrap.appendChild(art);
    var txt = make("div", "mi-brief-text");
    txt.appendChild(make("p", "mi-brief-coach", M.briefing.coach));
    txt.appendChild(make("p", "mi-brief-line", M.briefing.line));
    wrap.appendChild(txt);
    host.appendChild(wrap);
    setAction(M.briefing.start, true);
  }

  /* ---- reveal: the worked examples (WATCH, and the two EXTEND models) ---- */
  function renderReveal(host, c) {
    el("mission-heading").textContent = c.stepTitle;

    var grid = make("div", "mi-grid");
    var scene = sceneBlock(c.scene, c.sceneAlt, c.scene === "soccer-kick");
    if (scene) grid.appendChild(scene);

    var work = make("div", "mi-work");
    work.appendChild(objective(c));
    work.appendChild(coachBlock(S.revealed ? "happy" : "idle",
      S.revealed ? c.coachAfter : c.coachBefore));

    /* BEFORE the reveal: the plain sentence only — nothing is marked,
       so nothing leaks. AFTER the reveal: the plain sentence AND the
       marked sentence together, which is the plain-to-marked teaching
       pattern the six original lessons use (handoff section 6). Both
       passes render from the same words array, so they cannot drift. */
    var sWrap = make("div", "mi-sentence-wrap");
    if (!S.revealed) {
      var h1 = make("div", "mi-sentence-host");
      renderSentence(h1, c, { mode: "plain" });
      sWrap.appendChild(h1);
    } else {
      var pair = make("div", "mi-pair");

      var readBox = make("div", "mi-pairbox is-read");
      readBox.appendChild(make("p", "mi-pairlabel", M.ui.marked));
      var ph = make("div", "mi-sentence-host");
      renderSentence(ph, c, { mode: "plain" });
      readBox.appendChild(ph);

      var seeBox = make("div", "mi-pairbox is-see");
      seeBox.appendChild(make("p", "mi-pairlabel", M.ui.markedSee));
      var mh = make("div", "mi-sentence-host");
      renderSentence(mh, c, { mode: "plain", marked: c.target, markLabel: c.markLabel });
      seeBox.appendChild(mh);

      pair.appendChild(readBox);
      pair.appendChild(seeBox);
      sWrap.appendChild(pair);
    }
    var sp = speakBlock(c);
    if (sp) sWrap.appendChild(sp);
    work.appendChild(sWrap);

    work.appendChild(feedbackBlock());
    grid.appendChild(work);
    host.appendChild(grid);

    if (!S.revealed) {
      setAction(c.action, true);
    } else {
      say("right", [c.explain, c.because]);
      setAction(c.next, true);
      showReplay(c);
    }
  }

  /* The replay control. Only for the one animated scene, and only when
     the child has not asked for reduced motion — a button that
     visibly does nothing is worse than no button. */
  function showReplay(c) {
    var row = el("mission-extra");
    clear(row);
    row.hidden = true;
    if (c.scene !== "soccer-kick" || !c.replay || reducedMotion()) return;
    var b = make("button", "mi-replay", c.replay);
    b.type = "button";
    b.addEventListener("click", function () { playKick(); });
    row.appendChild(b);
    row.hidden = false;
  }

  /* Brief, and it carries meaning: the leg swings, the ball travels.
     Adding and removing the class restarts it. Under reduced motion
     the CSS animation is suppressed and the scene simply reads as a
     still picture, which still shows a ball being kicked. */
  function playKick() {
    var fig = document.querySelector(".mi-scene.is-animated");
    if (!fig || reducedMotion()) return;
    fig.classList.remove("is-playing");
    void fig.offsetWidth;           // force a reflow so the restart takes
    fig.classList.add("is-playing");
  }

  function objective(c) {
    var p = make("p", "mi-objective");
    p.appendChild(make("span", "mi-objective-tag", M.ui.objectiveWord));
    p.appendChild(make("span", "mi-objective-text", c.objectiveLine));
    return p;
  }

  /* ---- pick: guided practice, independent practice, being verb,
          verb phrase. One renderer, because to a child they are the
          same move: read the sentence, choose the word. ---- */
  function renderPick(host, c) {
    el("mission-heading").textContent = c.stepTitle;

    var grid = make("div", "mi-grid" + (c.scene ? "" : " is-solo"));
    var scene = sceneBlock(c.scene, c.sceneAlt, false);
    if (scene) grid.appendChild(scene);

    var work = make("div", "mi-work");
    work.appendChild(objective(c));
    work.appendChild(coachBlock(S.solved ? "happy" : S.attempts > 0 ? "think" : "idle",
      c.coachBefore));

    var sWrap = make("div", "mi-sentence-wrap");
    var sh = make("div", "mi-sentence-host");
    renderSentence(sh, c, {
      mode: S.solved ? "plain" : "pick",
      marked: S.solved ? c.target : S.picked,
      markLabel: c.verbType === "phrase" ? "VERB PHRASE" : (c.verbType === "being" ? "BEING VERB" : "VERB"),
      wrong: S.wrong,
      lock: S.solved
    });
    sWrap.appendChild(sh);
    var sp = speakBlock(c);
    if (sp) sWrap.appendChild(sp);
    work.appendChild(sWrap);

    var prompt = make("p", "mi-prompt", c.prompt);
    if (c.pickCount && !S.solved) {
      var count = make("span", "mi-pickcount",
        S.picked.length + " / " + c.pickCount + " " + M.ui.chosen);
      prompt.appendChild(count);
    }
    work.appendChild(prompt);
    work.appendChild(feedbackBlock());
    grid.appendChild(work);
    host.appendChild(grid);

    /* Delegated, so a re-render never leaves a stale listener behind. */
    sh.addEventListener("click", function (e) {
      var btn = e.target.closest ? e.target.closest(".mi-word-btn") : null;
      if (!btn || btn.disabled) return;
      pickWord(c, Number(btn.dataset.wi));
    });

    if (S.solved) {
      if (c.why && !S.whyDone) { renderWhy(work, c); return; }
      setAction(c.correctNext || c.next || "Keep going", true);
    } else {
      setAction(c.correctNext || c.next || "Keep going", false,
        c.pickCount ? M.ui.pickTwo : null);
    }
  }

  function pickWord(c, wi) {
    var isTarget = c.target.indexOf(wi) !== -1;
    var need = c.pickCount || 1;

    if (isTarget) {
      if (S.picked.indexOf(wi) === -1) S.picked.push(wi);
      if (S.picked.length >= need) {
        S.solved = true;
        /* EEF: feedback matters most when the answer is RIGHT. A
           correct pick explains what the word does, it does not just
           congratulate. */
        var msg = (need > 1 && c.bothCorrect) ? c.bothCorrect : c.notes[wi];
        renderCard();
        say("right", [msg]);
        focusAction();
        return;
      }
      /* a partial answer on a two-word target is PROGRESS, not a miss:
         attempts are not incremented and nothing is marked wrong */
      renderCard();
      say("part", [c.notes[wi], c.partial]);
      focusSentence();
      return;
    }

    S.attempts += 1;
    if (S.wrong.indexOf(wi) === -1) S.wrong.push(wi);

    if (S.attempts >= 3) {
      /* Third miss: stop the guessing and model the reasoning. The
         child is never left cycling through words. */
      S.solved = true;
      S.picked = c.target.slice();
      renderCard();
      say("model", [c.model]);
      focusAction();
      return;
    }

    var second = (S.attempts === 2);
    renderCard();
    say("wrong", [c.notes[wi], second ? c.clue : M.ui.tryAgain]);
    focusSentence();
  }

  /* ---- the explanation question (SOLVE only) ----
     IES Recommendation 7 carries STRONG evidence for prompts that make
     a learner explain rather than recall. Finding the verb is the
     recall; saying WHY it is the verb is the understanding. */
  function renderWhy(work, c) {
    S.whyOpen = true;
    var box = make("div", "mi-why");
    box.appendChild(make("p", "mi-why-prompt", c.why.prompt));
    var host = make("div", "mi-why-choices");
    host.setAttribute("role", "group");

    /* Shuffled, and identity is the original index — never the
       rendered text. Same reasoning as D-29 and D-36 in learn.js. */
    shuffled(c.why.choices.map(function (x, i) { return i; })).forEach(function (ci) {
      var choice = c.why.choices[ci];
      var b = make("button", "mi-why-choice", choice.text);
      b.type = "button";
      b.dataset.ci = String(ci);
      b.addEventListener("click", function () { answerWhy(c, b, choice, host); });
      host.appendChild(b);
    });
    box.appendChild(host);
    work.appendChild(box);
    setAction(c.next, false);
  }

  function answerWhy(c, btn, choice, host) {
    var all = host.querySelectorAll(".mi-why-choice");
    if (choice.correct) {
      S.whyDone = true;
      Array.prototype.forEach.call(all, function (b) { b.disabled = true; });
      btn.classList.add("is-right");
      say("right", [choice.feedback]);
      setAction(c.next, true);
      focusAction();
      return;
    }
    btn.classList.add("is-wrong");
    btn.disabled = true;
    say("wrong", [choice.feedback, M.ui.tryAgain]);
    var nextOpen = Array.prototype.filter.call(all, function (b) { return !b.disabled; })[0];
    if (nextOpen) nextOpen.focus();
  }

  /* ---- swap: change the verb, change the meaning ----
     Not a question. Neither verb is wrong, nothing is scored, and the
     engine records no result. Both must be tried because trying both
     IS the lesson — the contrast is the teaching, not the clicking. ---- */
  function renderSwap(host, c) {
    el("mission-heading").textContent = c.stepTitle;

    var grid = make("div", "mi-grid");
    var shown = S.activeOption;
    var scene = shown ? sceneBlock(shown.scene, shown.sceneAlt, false) : null;
    if (!scene) {
      scene = make("figure", "mi-scene is-empty");
      scene.setAttribute("role", "img");
      scene.setAttribute("aria-label", "No picture yet. Choose a verb to see what happens.");
      var q = make("span", "mi-scene-q", "?");
      q.setAttribute("aria-hidden", "true");
      scene.appendChild(q);
    }
    grid.appendChild(scene);

    var work = make("div", "mi-work");
    work.appendChild(objective(c));
    work.appendChild(coachBlock(shown ? "happy" : "idle", c.coachBefore));

    var sWrap = make("div", "mi-sentence-wrap");
    var sh = make("div", "mi-sentence-host");
    renderSentence(sh, c, { mode: "plain" });
    sWrap.appendChild(sh);
    var sp = speakBlock(c);
    if (sp) sWrap.appendChild(sp);
    work.appendChild(sWrap);

    work.appendChild(make("p", "mi-prompt", c.prompt));

    var opts = make("div", "mi-swap-opts");
    opts.setAttribute("role", "group");
    c.options.forEach(function (o) {
      var b = make("button", "mi-swap-opt", o.word);
      b.type = "button";
      if (S.tried.indexOf(o.word) !== -1) b.classList.add("is-tried");
      if (shown && shown.word === o.word) {
        b.classList.add("is-active");
        b.setAttribute("aria-pressed", "true");
      } else {
        b.setAttribute("aria-pressed", "false");
      }
      b.addEventListener("click", function () { chooseSwap(c, o); });
      opts.appendChild(b);
    });
    work.appendChild(opts);
    work.appendChild(feedbackBlock());
    grid.appendChild(work);
    host.appendChild(grid);

    var bothTried = (S.tried.length >= c.options.length);
    if (shown) {
      say(bothTried ? "right" : "part",
        bothTried ? [shown.explain, c.closing] : [shown.explain]);
    }
    setAction(c.next, bothTried,
      bothTried ? null : (shown ? "Now try the other verb." : c.prompt));
  }

  function chooseSwap(c, o) {
    S.activeOption = o;
    if (S.tried.indexOf(o.word) === -1) S.tried.push(o.word);
    renderCard();
    /* keep focus on the verb the child just pressed, so a keyboard user
       stays where they were and can press the other one */
    var btns = document.querySelectorAll(".mi-swap-opt");
    Array.prototype.forEach.call(btns, function (b) {
      if (b.textContent === o.word) b.focus();
    });
  }

  /* ---- done: a learning recap, not a trophy ----
     Finishing is NOT treated as proof of mastery, and the wording does
     not say it is. The recap re-states the three kinds of verb, which
     is a retrieval opportunity rather than a victory lap. ---- */
  function renderDone(host) {
    el("mission-heading").textContent = M.done.title;
    el("mission-controls").hidden = true;
    el("mission-extra").hidden = true;

    var wrap = make("div", "mi-done");
    var art = make("div", "mi-done-art");
    art.setAttribute("aria-hidden", "true");
    art.innerHTML = SC.detective("cheer");
    wrap.appendChild(art);

    var body = make("div", "mi-done-body");
    var badge = make("p", "mi-done-badge");
    badge.appendChild(make("span", "mi-done-badge-text", M.done.badge));
    var tick = make("span", "mi-done-badge-tick", "✓");
    tick.setAttribute("aria-hidden", "true");
    badge.appendChild(tick);
    body.appendChild(badge);

    body.appendChild(make("p", "mi-done-lead", M.done.lead));
    var ul = make("ul", "mi-done-recap");
    M.done.recap.forEach(function (line) { ul.appendChild(make("li", null, line)); });
    body.appendChild(ul);
    body.appendChild(make("p", "mi-done-honest", M.done.honest));

    var row = make("div", "mi-done-buttons");
    var g = make("button", "nav-btn next-btn", M.done.guideBtn);
    g.type = "button";
    g.addEventListener("click", function () { openGuide(g); });
    var again = make("button", "nav-btn", M.done.againBtn);
    again.type = "button";
    again.addEventListener("click", function () { start(); });
    var topics = make("button", "nav-btn", M.done.topicsBtn);
    topics.type = "button";
    topics.addEventListener("click", function () { leave(); });
    var home = make("button", "nav-btn", M.done.homeBtn);
    home.type = "button";
    home.addEventListener("click", function () { stopSpeech(); window.SS_SHELL.goHome(); });
    [g, again, topics, home].forEach(function (b) { row.appendChild(b); });
    body.appendChild(row);

    wrap.appendChild(body);
    host.appendChild(wrap);
  }

  /* =========================================================
     RENDER + NAVIGATION
     ========================================================= */
  function renderCard() {
    var c = card();
    var host = el("mission-card");
    clear(host);
    el("mission-controls").hidden = false;
    el("mission-extra").hidden = true;
    clear(el("mission-extra"));

    if (c.kind === "briefing") renderBriefing(host);
    else if (c.kind === "reveal") renderReveal(host, c);
    else if (c.kind === "pick") renderPick(host, c);
    else if (c.kind === "swap") renderSwap(host, c);
    else if (c.kind === "done") renderDone(host);

    el("mission-prev").disabled = (S.pos === 0);
    renderRail();
  }

  function focusAction() {
    var b = el("mission-next");
    if (b && !b.disabled) b.focus();
  }
  function focusSentence() {
    var b = document.querySelector(".mi-word-btn:not([disabled])");
    if (b) b.focus();
  }

  function enter() {
    renderCard();
    el("mission-heading").focus();
    window.scrollTo(0, 0);
  }

  function advance() {
    var c = card();
    /* On a reveal card the primary action is the reveal itself; the
       same button then becomes the way forward. One obvious action at
       any moment, never two competing ones. */
    if (c.kind === "reveal" && !S.revealed) {
      S.revealed = true;
      renderCard();
      playKick();
      focusAction();
      return;
    }
    if (S.pos >= CARDS.length - 1) return;
    stopSpeech();
    S.pos += 1;
    resetCard();
    enter();
  }

  /* Back steps one card and clears that card's interaction state, so a
     card is never re-entered half-solved.

     Back is DISABLED on the first card, which is what renderCard() sets.
     That matches the four-step lesson exactly -- lesson-prev is disabled
     at step 0 -- and the two always-present exits, "All Topics" in the
     footer and Home in the header, are how a child leaves from here. An
     earlier draft also had back() call leave() at position 0; that
     branch was unreachable behind the disabled button, and an
     unreachable path is the kind of thing a maintainer later mistakes
     for live behaviour (see D-33 in the handoff). It is gone. */
  function back() {
    if (S.pos === 0) return;
    stopSpeech();
    S.pos -= 1;
    resetCard();
    enter();
  }

  function start() {
    buildSequence();
    S.pos = 0;
    resetCard();
    window.SS_SHELL.showScreen("mission");
    enter();
  }

  function leave() {
    stopSpeech();
    window.SS_LEARN.openTopics();
  }

  /* The Study Guide is the same panel the six lessons use, reached the
     same way. The mission does not get its own copy of that content. */
  function openGuide(opener) {
    window.SS_LEARN.openGuideFor(M.topicKey, opener || el("mission-guide"));
  }

  /* =========================================================
     INIT + PUBLIC API
     ========================================================= */
  function init() {
    el("mission-next").addEventListener("click", advance);
    el("mission-prev").addEventListener("click", back);
    el("mission-topics").addEventListener("click", leave);
    el("mission-home").addEventListener("click", function () {
      stopSpeech();
      window.SS_SHELL.goHome();
    });
    el("mission-guide").addEventListener("click", function () {
      openGuide(el("mission-guide"));
    });
    buildSequence();
  }

  window.SS_MISSION = {
    init: init,
    start: start,
    stopSpeech: stopSpeech,
    /* read-only hooks for the audit harness, mirroring SS_LEARN.bankState() */
    state: function () {
      return {
        pos: S.pos, total: CARDS.length, kind: card() ? card().kind : null,
        phase: card() ? card().phase : null, revealed: S.revealed,
        picked: S.picked.slice(), wrong: S.wrong.slice(), attempts: S.attempts,
        solved: S.solved, tried: S.tried.slice(), whyDone: S.whyDone
      };
    },
    cards: function () { return CARDS.slice(); }
  };
})();
