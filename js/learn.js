/* =========================================================
   Sentence Sense — Learn Mode engine (Build 1.1.1)

   ONE lesson system, used by all six topics. This file contains
   rendering and interaction only. Every word a child reads comes
   from js/data/learn-content.js — there is no grammar, no answer
   and no feedback text in this file.

   Structure:
     1. Shared sentence component  (renderSentence)
     2. Step block renderer        (renderBlock)
     3. Topic screen
     4. Lesson runner              (Definition -> Clue -> Example -> Try It)
     5. Try It interaction
     6. Study Guide panel
     7. Public API for the shell

   Feedback is static and deterministic: every response a child can
   see is written in the content file and simply looked up.
   ========================================================= */

(function () {
  "use strict";

  const C = window.SS_LEARN_CONTENT;
  const el = id => document.getElementById(id);

  const STEP_KEYS = ["definition", "clue", "example", "tryIt"];

  /* Lesson state. `answered` is true once the child has chosen the
     correct answer, which is what unlocks the Finish button. */
  const lesson = {
    topicKey: null,
    stepIndex: 0,
    answered: false,
    done: false,
    guideOpener: null,
    /* Build 1.2.5 — guided question bank (Verb only for now). All of this is
       session state held in memory: nothing is persisted, so leaving Learn and
       coming back starts a fresh cycle at Definition, Question 1. */
    bank: null,        // the topic's tryItBank, or null for single-question topics
    bankOrder: [],     // question indices, shuffled inside each stage
    bankPos: 0,        // 0-based position in bankOrder
    attempts: 0,       // wrong attempts on the CURRENT question (0-3)
    milestoneStage: -1 // stage index while a milestone screen is showing
  };

  /* ---------- small DOM helpers ---------- */
  function make(tag, className, text) {
    const n = document.createElement(tag);
    if (className) n.className = className;
    if (text !== undefined && text !== null) n.textContent = text;
    return n;
  }
  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }

  /* =========================================================
     1. SHARED SENTENCE COMPONENT
     One component draws every teaching sentence in Learn Mode:
     plain words, a marked word with its label, a sentence split
     into two labelled parts, and adjective-to-noun links.

     Colour is never the only signal. A marked word also carries a
     written label above it, a thick underline and a border; a split
     part carries a written label and its own box; a link is written
     out in words ("excited -> describes -> player").
     ========================================================= */
  function wordChip(text, mark) {
    const chip = make("span", "ss-word");
    if (!mark) {
      chip.appendChild(make("span", "ss-word-text", text));
      return chip;
    }
    chip.classList.add("is-marked", "ss-k-" + mark.kind);
    chip.appendChild(make("span", "ss-word-label", mark.label));

    /* Ending punctuation is not part of the word being taught, so it sits
       outside the underline: the child sees "ball" underlined as the noun,
       not "ball." */
    const tail = /[.!?,]$/.test(text) ? text.slice(-1) : "";
    const base = tail ? text.slice(0, -1) : text;
    chip.appendChild(make("span", "ss-word-text", base));
    if (tail) chip.appendChild(make("span", "ss-word-punct", tail));
    return chip;
  }

  function wordRow(words, markFor, from, to) {
    const row = make("div", "ss-words");
    for (let i = from; i <= to; i++) row.appendChild(wordChip(words[i], markFor(i)));
    return row;
  }

  /* Build 1.2.3 — `opts.plain` renders the SAME spec with every annotation
     suppressed: no marks, no split, no links. The words array is the single
     source of truth for both passes, so the plain sentence and the marked
     sentence cannot drift apart. The marked pass only decorates: it never
     adds, removes, reorders or re-punctuates a word. */
  function renderSentence(host, spec, opts) {
    clear(host);
    if (!spec) { host.hidden = true; return; }
    host.hidden = false;

    const plain = !!(opts && opts.plain);
    const words = spec.words;
    const marks = plain ? [] : (spec.marks || []);
    const markFor = i => marks.find(m => i >= m.start && i <= m.end) || null;

    const box = make("div", "ss-sentence" + (plain ? " is-plain" : ""));

    if (plain) {
      box.appendChild(wordRow(words, () => null, 0, words.length - 1));
      host.appendChild(box);
      return;
    }

    if (spec.split) {
      const at = spec.split.at;
      const parts = make("div", "ss-parts");

      const left = make("div", "ss-part ss-part-left");
      left.appendChild(make("span", "ss-part-label", spec.split.leftLabel));
      left.appendChild(wordRow(words, markFor, 0, at - 1));

      const divider = make("span", "ss-divider");
      divider.setAttribute("aria-hidden", "true");

      const right = make("div", "ss-part ss-part-right");
      right.appendChild(make("span", "ss-part-label", spec.split.rightLabel));
      right.appendChild(wordRow(words, markFor, at, words.length - 1));

      parts.appendChild(left);
      parts.appendChild(divider);
      parts.appendChild(right);
      box.appendChild(parts);
    } else {
      box.appendChild(wordRow(words, markFor, 0, words.length - 1));
    }

    if (spec.links && spec.links.length) {
      const list = make("ul", "ss-links");
      spec.links.forEach(link => {
        const item = make("li", "ss-link");
        const fromMark = markFor(link.from);
        const toMark = markFor(link.to);
        /* Same rule as the sentence itself: the relationship is between the
           words, so ending punctuation is not carried into the link. */
        const bare = w => w.replace(/[.!?,]$/, "");
        const a = make("span", "ss-link-word" + (fromMark ? " ss-k-" + fromMark.kind : ""), bare(words[link.from]));
        const b = make("span", "ss-link-word" + (toMark ? " ss-k-" + toMark.kind : ""), bare(words[link.to]));
        const arrow = make("span", "ss-link-arrow", "→");
        arrow.setAttribute("aria-hidden", "true");
        item.appendChild(a);
        item.appendChild(arrow);
        item.appendChild(make("span", "ss-link-text", link.text));
        item.appendChild(arrow.cloneNode(true));
        item.appendChild(b);
        list.appendChild(item);
      });
      box.appendChild(list);
    }

    host.appendChild(box);
  }

  /* The same-word comparison. Build 1.1.1 moved it out of the Verb Clue
     step and into the Verb Study Guide, so this one renderer is now shared
     by the lesson step renderer and the Study Guide renderer. */
  function renderContrast(host, contrast) {
    const wrap = make("div", "lesson-contrast");
    wrap.appendChild(make("h3", "lesson-contrast-heading", contrast.heading));
    contrast.rows.forEach(row => {
      const r = make("div", "contrast-row");
      const sHost = make("div", "sentence-host");
      renderSentence(sHost, row.sentence);
      r.appendChild(sHost);
      r.appendChild(make("p", "contrast-text", row.text));
      wrap.appendChild(r);
    });
    wrap.appendChild(make("p", "lesson-warning", contrast.close));
    host.appendChild(wrap);
  }

  /* =========================================================
     2. STEP BLOCK RENDERER
     Renders one content block in a fixed, pedagogically ordered
     sequence, skipping anything the block does not define. Every
     topic therefore reads the same way.
     ========================================================= */
  function renderBlock(host, block) {
    clear(host);

    if (block.text) host.appendChild(make("p", "lesson-text", block.text));

    if (block.steps) {
      const ol = make("ol", "lesson-steps");
      block.steps.forEach(s => ol.appendChild(make("li", null, s)));
      host.appendChild(ol);
    }

    if (block.list) {
      const ul = make("ul", "lesson-list");
      block.list.forEach(s => ul.appendChild(make("li", null, s)));
      host.appendChild(ul);
    }

    if (block.groups) {
      const wrap = make("div", "lesson-groups");
      block.groups.forEach(g => {
        const card = make("div", "lesson-group");
        card.appendChild(make("h3", "lesson-group-label", g.label));
        const chips = make("div", "chip-row");
        g.chips.forEach(c => chips.appendChild(make("span", "chip", c)));
        card.appendChild(chips);
        wrap.appendChild(card);
      });
      host.appendChild(wrap);
    }

    if (block.warning) host.appendChild(make("p", "lesson-warning", block.warning));

    /* Build 1.2.3 — PLAIN SENTENCE FIRST, MARKED SENTENCE SECOND.
       A child should read the sentence as a sentence before meeting the
       grammar markup. When a spec carries any annotation (marks, a split or
       links) the same sentence is shown twice: "READ IT" plain, then
       "SEE HOW IT WORKS" annotated. A spec with no annotation — the Try It
       question — is a plain sentence already and is shown once, unlabelled. */
    if (block.sentence) {
      const spec = block.sentence;
      const annotated = !!((spec.marks && spec.marks.length) || spec.split ||
                           (spec.links && spec.links.length));

      if (annotated) {
        const pair = make("div", "sentence-pair");

        const readWrap = make("div", "sentence-stepbox is-read");
        readWrap.appendChild(make("p", "sentence-steplabel", "READ IT"));
        const plainHost = make("div", "sentence-host");
        renderSentence(plainHost, spec, { plain: true });
        readWrap.appendChild(plainHost);

        const seeWrap = make("div", "sentence-stepbox is-see");
        seeWrap.appendChild(make("p", "sentence-steplabel", "SEE HOW IT WORKS"));
        const markedHost = make("div", "sentence-host");
        renderSentence(markedHost, spec);
        seeWrap.appendChild(markedHost);

        pair.appendChild(readWrap);
        pair.appendChild(seeWrap);
        host.appendChild(pair);
      } else {
        const sHost = make("div", "sentence-host");
        renderSentence(sHost, spec);
        host.appendChild(sHost);
      }
    }

    if (block.points) {
      const ul = make("ul", "lesson-points");
      block.points.forEach(s => ul.appendChild(make("li", null, s)));
      host.appendChild(ul);
    }

    if (block.contrast) renderContrast(host, block.contrast);

    if (block.note) host.appendChild(make("p", "lesson-note", block.note));
  }

  /* =========================================================
     3. TOPIC SCREEN
     ========================================================= */
  function buildTopicScreen() {
    const grid = el("topic-grid");
    clear(grid);

    C.order.forEach(key => {
      const t = C.topics[key];
      const card = make("button", "pick-card topic-card topic-" + t.color);
      card.type = "button";
      card.dataset.topic = key;
      card.appendChild(make("span", "topic-badge", t.badge));
      card.appendChild(make("span", "pick-name", t.name));
      card.appendChild(make("span", "pick-sub", t.card));
      card.addEventListener("click", () => openTopic(key));
      grid.appendChild(card);
    });

    el("strategy-heading").textContent = C.strategy.heading;
    const list = el("strategy-list");
    clear(list);
    C.strategy.steps.forEach(s => list.appendChild(make("li", null, s)));
    el("strategy-note").textContent = C.strategy.note;
  }

  function openTopics() {
    /* Leaving Learn ends the session: the milestone screen must not survive
       into the next topic the child opens. */
    if (window.SS_MISSION) window.SS_MISSION.stopSpeech();
    el("lesson-milestone").hidden = true;
    lesson.milestoneStage = -1;
    lesson.topicKey = null;
    window.SS_SHELL.showScreen("topics");
    el("topics-heading").focus();
  }

  /* =========================================================
     4. LESSON RUNNER
     ========================================================= */
  /* Build 1.3.0 — VERB ROUTING, and the only behavioural change in this
     file. Verb opens the illustrated "Sentence Detectives" mission in
     js/mission.js. The other five topics fall straight through to the
     four-step lesson below, unchanged.

     ?verb=classic restores the original Verb lesson, including its
     20-question guided bank. That flag is not a child-facing feature:
     it exists so the bank engine stays reachable and testable instead
     of being orphaned by the prototype, and so this build can be
     compared against 1.2.7 in the same browser. */
  function classicVerbRequested() {
    return /[?&]verb=classic\b/.test(window.location.search);
  }

  function openTopic(key) {
    if (!C.topics[key]) return;

    if (key === "verb" && window.SS_MISSION && !classicVerbRequested()) {
      lesson.topicKey = key;          // the Study Guide needs to know the topic
      window.SS_MISSION.start();
      return;
    }

    lesson.topicKey = key;
    lesson.stepIndex = 0;
    lesson.answered = false;
    lesson.done = false;
    /* A fresh entry into a topic is a fresh cycle: new shuffle, Question 1. */
    resetBank(key);

    const t = C.topics[key];
    el("screen-lesson").dataset.topic = t.color;
    el("lesson-topic-tag").textContent = t.name;

    window.SS_SHELL.showScreen("lesson");
    renderStep();
  }

  function renderProgress() {
    const items = el("lesson-progress").querySelectorAll("[data-step]");
    Array.prototype.forEach.call(items, node => {
      const i = Number(node.dataset.step);
      node.classList.toggle("done", !lesson.done && i < lesson.stepIndex);
      node.classList.toggle("current", !lesson.done && i === lesson.stepIndex);
      if (lesson.done) node.classList.add("done");
      node.removeAttribute("aria-current");
      if (!lesson.done && i === lesson.stepIndex) node.setAttribute("aria-current", "step");
    });
  }

  function renderStep() {
    const t = C.topics[lesson.topicKey];
    const stepKey = STEP_KEYS[lesson.stepIndex];
    const block = t[stepKey];

    el("lesson-done").hidden = true;
    el("lesson-step").hidden = false;
    el("lesson-controls").hidden = false;

    const isTry = (stepKey === "tryIt");

    /* Build 1.2.7 (D-33): a topic that runs a bank has no `tryIt` block at all,
       so the step title cannot be read from one. buildBankQuestion() sets the
       heading itself; this is the safe default until it does. */
    el("lesson-heading").textContent =
      t.name + " — " + ((block && block.title) || "Try it");
    /* Try It renders its own sentence, question and choices below, so the
       generic block renderer is skipped for that step. */
    if (isTry) clear(el("lesson-content"));
    else if (block) renderBlock(el("lesson-content"), block);
    else clear(el("lesson-content"));

    el("lesson-milestone").hidden = true;
    lesson.milestoneStage = -1;
    el("tryit").hidden = !isTry;

    /* Build 1.2.5: a topic with a bank runs the 20-question cycle here.
       Entering Try It always starts that cycle at Question 1 of a fresh
       shuffle -- see the Back rule below. */
    const useBank = isTry && !!lesson.bank;
    if (useBank) {
      lesson.bankPos = 0;
      buildBankQuestion();
    } else if (isTry) {
      buildTryIt(block);
      el("tryit-head").hidden = true;
    } else {
      clearTryIt();   /* never leave a previous question in the DOM */
    }

    el("lesson-prev").disabled = (lesson.stepIndex === 0);
    const next = el("lesson-next");
    if (useBank) {
      setBankNext(lesson.answered ? "ready" : "wait");
    } else if (isTry) {
      next.textContent = "Finish";
      next.disabled = !lesson.answered;
    } else {
      next.textContent = "Next";
      next.disabled = false;
    }

    renderProgress();
    el("lesson-heading").focus();
    window.scrollTo(0, 0);
  }

  function nextStep() {
    /* Inside a bank, Next moves to the next QUESTION, a milestone, or the
       completion screen -- not to the next lesson step. */
    if (lesson.stepIndex === STEP_KEYS.length - 1 && lesson.bank) {
      if (lesson.answered) advanceBank();
      return;
    }
    if (lesson.stepIndex < STEP_KEYS.length - 1) {
      lesson.stepIndex += 1;
      lesson.answered = false;
      renderStep();
    } else if (lesson.answered) {
      showDone();
    }
  }

  /* Build 1.2.5 — BACK BEHAVIOUR, defined so it cannot corrupt the cycle.
     From Try It, Back leaves for Example, as it always has. Returning to
     Try It then RESTARTS the cycle cleanly at Question 1 with a fresh
     shuffle -- partial progress is deliberately not preserved, which matches
     the rest of Learn (nothing is stored anywhere). renderStep() resets
     bankPos, so there is no half-finished state to step back into. */
  function prevStep() {
    if (lesson.done) { lesson.done = false; renderStep(); return; }
    if (lesson.milestoneStage >= 0) { leaveMilestone(); return; }
    if (lesson.stepIndex > 0) {
      lesson.stepIndex -= 1;
      lesson.answered = false;
      renderStep();
    }
  }

  function showDone() {
    const t = C.topics[lesson.topicKey];
    lesson.done = true;

    el("lesson-step").hidden = true;
    el("lesson-controls").hidden = true;
    el("lesson-milestone").hidden = true;
    lesson.milestoneStage = -1;
    el("lesson-done").hidden = false;

    el("done-title").textContent = "You learned " + t.name + "!";
    /* A topic that ran the guided cycle says what the child actually did.
       Still no score, no percentage, no count of right answers. */
    /* Build 1.2.7 (D-30): the bank's recap is CONTENT. The engine no longer
       knows what any topic teaches. A bank that forgets to carry a `recap`
       falls back to the topic recap rather than to another topic's wording. */
    el("done-recap").textContent = (lesson.bank && lesson.bank.recap)
      ? lesson.bank.recap
      : t.recap;

    /* Build 1.2.3 — a small, quiet sense of achievement. A named badge the
       child earned, nothing more: no points, no coins, no streak, no sound,
       and nothing persisted. Encouragement, not gamification. */
    const badge = el("done-badge");
    if (badge) {
      clear(badge);
      const chip = make("span", "done-badge-chip is-" + t.color);
      chip.appendChild(make("span", "done-badge-name", t.name.toUpperCase()));
      const tick = make("span", "done-badge-tick", "✓");
      tick.setAttribute("aria-hidden", "true");
      chip.appendChild(tick);
      badge.appendChild(chip);
      badge.setAttribute("aria-label", t.name + " complete");
    }

    const idx = C.order.indexOf(lesson.topicKey);
    const nextKey = C.order[idx + 1];
    const nextBtn = el("done-next");
    if (nextKey) {
      nextBtn.hidden = false;
      nextBtn.textContent = "Next topic: " + C.topics[nextKey].name;
      nextBtn.dataset.topic = nextKey;
    } else {
      nextBtn.hidden = true;
      nextBtn.removeAttribute("data-topic");
    }

    renderProgress();
    el("done-title").focus();
    window.scrollTo(0, 0);
  }

  /* =========================================================
     5. TRY IT
     A short reinforcement of the step just taught — not Practice
     Mode. A wrong choice explains that word's real job and invites
     another look; the child may try again.
     ========================================================= */
  function clearTryIt() {
    clear(el("tryit-sentence"));
    clear(el("tryit-choices"));
    el("tryit-question").textContent = "";
    el("tryit-head").hidden = true;
    const fb = el("tryit-feedback");
    fb.hidden = true;
    fb.className = "tryit-feedback";
    clear(fb);
  }

  /* =========================================================
     2b. GUIDED QUESTION BANK  (Build 1.2.5 — Verb only)
     A topic may carry `tryItBank`: four stages of five questions. The child
     finishes a stage before the next opens, and the five inside a stage are
     shuffled, so returning is not a memory test of the order.

     This is LEARN, so a wrong answer buys teaching, not a mark:
       1st wrong -> what that word actually does in THIS sentence, then redirect
       2nd wrong -> the central Verb clue again, answer still hidden
       3rd wrong -> guided reveal; the answer is shown and the child moves on

     Nothing is scored, timed or stored. A topic without `tryItBank` keeps the
     single-question behaviour exactly as before.
     ========================================================= */

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

  /* Build the running order: shuffle inside each stage, keep the stages in
     order. Stage 1's five all come before any of Stage 2's. */
  function resetBank(topicKey) {
    const bank = bankFor(topicKey);
    lesson.bank = bank;
    lesson.bankOrder = [];
    lesson.bankPos = 0;
    lesson.attempts = 0;
    lesson.milestoneStage = -1;
    if (!bank) return;
    bank.stages.forEach((st, si) => {
      const idx = [];
      bank.questions.forEach((q, qi) => { if (q.stage === si) idx.push(qi); });
      shuffled(idx).forEach(i => lesson.bankOrder.push(i));
    });
  }

  function currentBankQuestion() {
    if (!lesson.bank) return null;
    const i = lesson.bankOrder[lesson.bankPos];
    return (i === undefined) ? null : lesson.bank.questions[i];
  }

  function renderBankHead(q) {
    const head = el("tryit-head");
    if (!head) return;
    if (!q) { head.hidden = true; return; }
    head.hidden = false;
    const st = lesson.bank.stages[q.stage];
    el("tryit-count").textContent =
      "Question " + (lesson.bankPos + 1) + " of " + lesson.bankOrder.length;
    el("tryit-stage").textContent = "Stage " + (q.stage + 1) + ": " + st.name;
    el("tryit-stage-desc").textContent = st.desc;
  }

  /* The Next button carries the bank's pacing. The child always advances
     deliberately -- nothing auto-advances. */
  function setBankNext(state) {
    const next = el("lesson-next");
    const last = lesson.bankPos >= lesson.bankOrder.length - 1;
    next.textContent = last ? "Finish" : "Next Question";
    next.disabled = (state !== "ready");
  }

  function buildBankQuestion() {
    const q = currentBankQuestion();
    if (!q) return;
    lesson.attempts = 0;
    lesson.answered = false;

    el("lesson-heading").textContent = C.topics[lesson.topicKey].name + " — Try it";
    clear(el("lesson-content"));
    el("tryit").hidden = false;
    renderBankHead(q);
    renderSentence(el("tryit-sentence"), q.sentence);
    el("tryit-question").textContent = q.question;

    const host = el("tryit-choices");
    clear(host);
    const longest = q.choices.reduce((n, c) => Math.max(n, c.text.length), 0);
    host.classList.toggle("is-wide", longest > 12);

    /* Build 1.2.7 (D-29): the choices are shuffled at RENDER time, so choice
       position carries no answer signal. Before this, choices rendered in data
       order and the correct answer sat in position 3 in 16 of the 20 questions
       and never in position 1 or 4 -- a child could clear the whole bank by
       pressing the third button and so never earn the teaching a wrong answer
       is meant to buy. This is separate from the question shuffle in
       resetBank(): question order is stage-scoped, choice order is per render.

       Build 1.2.7 (D-36): each button carries its ORIGINAL index in
       `dataset.ci`. Identity never depends on rendered text, so the guided
       reveal still finds the right button when the order changes, and it will
       not break silently if a future bank ever repeats a choice label. */
    shuffled(q.choices.map((c, i) => i)).forEach(ci => {
      const choice = q.choices[ci];
      const btn = make("button", "tryit-choice");
      btn.type = "button";
      btn.dataset.ci = String(ci);
      btn.textContent = choice.text;
      btn.addEventListener("click", () => answerBank(btn, choice, q));
      host.appendChild(btn);
    });

    const fb = el("tryit-feedback");
    fb.hidden = true;
    fb.className = "tryit-feedback";
    clear(fb);
    setBankNext("wait");
  }

  function bankFeedback(kind, parts) {
    const fb = el("tryit-feedback");
    fb.hidden = false;
    fb.className = "tryit-feedback is-" + kind;
    clear(fb);
    fb.appendChild(make("span", "tryit-mark", kind === "right" ? "✓" : "✕"));
    const body = make("span", "tryit-feedback-body");
    parts.forEach((p, i) => {
      const line = make("span", i === 0 ? "tryit-feedback-text" : "tryit-again", p);
      body.appendChild(line);
    });
    fb.appendChild(body);
  }

  function answerBank(btn, choice, q) {
    const buttons = el("tryit-choices").querySelectorAll(".tryit-choice");

    if (choice.correct) {
      lesson.answered = true;
      Array.prototype.forEach.call(buttons, b => { b.disabled = true; b.classList.remove("is-wrong"); });
      btn.classList.add("is-right");
      bankFeedback("right", [choice.feedback]);
      setBankNext("ready");
      el("lesson-next").focus();
      return;
    }

    lesson.attempts += 1;
    btn.classList.add("is-wrong");
    btn.disabled = true;

    if (lesson.attempts === 1) {
      /* What that word actually does here, then where to look instead. */
      bankFeedback("wrong", [choice.feedback, "Try again."]);
    } else if (lesson.attempts === 2) {
      /* The clue again. The answer is still the child's to find. */
      bankFeedback("wrong", [choice.feedback, q.clue]);
    } else {
      /* Third miss: find it together rather than leave the child stuck. */
      /* Build 1.2.7 (D-36): match the correct button by its original choice
         index, never by rendered text. */
      const correctIndex = q.choices.findIndex(c => c.correct);
      const right = Array.prototype.filter.call(buttons,
        b => Number(b.dataset.ci) === correctIndex)[0];
      Array.prototype.forEach.call(buttons, b => { b.disabled = true; });
      if (right) { right.classList.add("is-right"); right.disabled = true; }
      bankFeedback("right", [q.reveal]);
      lesson.answered = true;
      setBankNext("ready");
      el("lesson-next").focus();
      return;
    }

    const nextChoice = Array.prototype.filter.call(buttons, x => !x.disabled)[0];
    if (nextChoice) nextChoice.focus();
  }

  /* Milestone between stages: encouragement, never a score. */
  function showMilestone(stageIndex) {
    const st = lesson.bank.stages[stageIndex];
    lesson.milestoneStage = stageIndex;
    el("lesson-step").hidden = true;
    el("lesson-controls").hidden = true;
    el("lesson-done").hidden = true;
    el("lesson-milestone").hidden = false;
    el("ms-mark").textContent = st.mark;
    el("ms-title").textContent = st.milestoneTitle;
    el("ms-line").textContent = st.milestoneLine;
    el("ms-next").textContent = st.nextStage ? ("Next: " + st.nextStage) : "";
    el("ms-next").hidden = !st.nextStage;
    renderProgress();
    el("ms-title").focus();
    window.scrollTo(0, 0);
  }

  function leaveMilestone() {
    lesson.milestoneStage = -1;
    el("lesson-milestone").hidden = true;
    el("lesson-step").hidden = false;
    el("lesson-controls").hidden = false;
    buildBankQuestion();
    el("lesson-heading").focus();
    window.scrollTo(0, 0);
  }

  /* Advance one question, or into a milestone, or out to completion. */
  function advanceBank() {
    const q = currentBankQuestion();
    const wasStage = q ? q.stage : 0;
    lesson.bankPos += 1;

    if (lesson.bankPos >= lesson.bankOrder.length) { showDone(); return; }

    const nextQ = currentBankQuestion();
    if (nextQ && nextQ.stage !== wasStage) { showMilestone(wasStage); return; }

    buildBankQuestion();
    el("lesson-heading").focus();
    window.scrollTo(0, 0);
  }

  function buildTryIt(block) {
    const sHost = el("tryit-sentence");
    renderSentence(sHost, block.sentence);

    el("tryit-question").textContent = block.question;

    const host = el("tryit-choices");
    clear(host);
    const longest = block.choices.reduce((n, c) => Math.max(n, c.text.length), 0);
    host.classList.toggle("is-wide", longest > 12);
    block.choices.forEach(choice => {
      const btn = make("button", "tryit-choice");
      btn.type = "button";
      btn.textContent = choice.text;
      btn.addEventListener("click", () => answerTryIt(btn, choice, block));
      host.appendChild(btn);
    });

    const fb = el("tryit-feedback");
    fb.hidden = true;
    fb.className = "tryit-feedback";
    clear(fb);
  }

  function answerTryIt(btn, choice, block) {
    const fb = el("tryit-feedback");
    const buttons = el("tryit-choices").querySelectorAll(".tryit-choice");

    if (choice.correct) {
      lesson.answered = true;
      Array.prototype.forEach.call(buttons, b => { b.disabled = true; b.classList.remove("is-wrong"); });
      btn.classList.add("is-right");
      btn.disabled = true;
      fb.className = "tryit-feedback is-right";
      clear(fb);
      fb.appendChild(make("span", "tryit-mark", "✓"));
      const okBody = make("span", "tryit-feedback-body");
      okBody.appendChild(make("span", "tryit-feedback-text", choice.feedback));
      fb.appendChild(okBody);
      el("lesson-next").disabled = false;
      el("lesson-next").focus();
    } else {
      btn.classList.add("is-wrong");
      btn.disabled = true;
      fb.className = "tryit-feedback is-wrong";
      clear(fb);
      fb.appendChild(make("span", "tryit-mark", "✕"));
      const body = make("span", "tryit-feedback-body");
      body.appendChild(make("span", "tryit-feedback-text", choice.feedback));
      body.appendChild(make("span", "tryit-again", "Try again."));
      fb.appendChild(body);
      /* Build 1.1.1 (D-08): disabling the chosen button drops focus to
         <body>. Move it to the next choice the child can still try. The
         feedback is announced by its own aria-live region, so moving focus
         here does not create a second announcement. */
      const nextChoice = Array.prototype.filter.call(buttons, x => !x.disabled)[0];
      if (nextChoice) nextChoice.focus();
    }
    fb.hidden = false;
  }

  /* =========================================================
     6. STUDY GUIDE
     A contextual panel inside a Learn topic — never a home-screen
     mode. Opens over the lesson, closes with the button or Escape,
     and returns focus to the button that opened it.
     ========================================================= */
  function renderGuide(topicKey) {
    const guide = C.topics[topicKey].studyGuide;
    el("guide-title").textContent = guide.title;

    const body = el("guide-body");
    clear(body);

    guide.sections.forEach(section => {
      const wrap = make("section", "guide-section");
      wrap.appendChild(make("h3", "guide-heading", section.heading));

      if (section.lines) {
        section.lines.forEach(line => wrap.appendChild(make("p", "guide-line", line)));
      }
      if (section.steps) {
        const ol = make("ol", "lesson-steps");
        section.steps.forEach(s => ol.appendChild(make("li", null, s)));
        wrap.appendChild(ol);
      }
      if (section.chips) {
        const row = make("div", "chip-row");
        section.chips.forEach(c => row.appendChild(make("span", "chip", c)));
        wrap.appendChild(row);
      }
      if (section.sentence) {
        const sHost = make("div", "sentence-host");
        renderSentence(sHost, section.sentence);
        wrap.appendChild(sHost);
      }
      if (section.contrast) renderContrast(wrap, section.contrast);
      body.appendChild(wrap);
    });

    body.appendChild(make("p", "guide-reminder", guide.reminder));
  }

  /* Build 1.1.1 (D-03): the panel declares aria-modal="true", so keyboard
     focus must not be able to reach the page behind it. Tab and Shift+Tab
     cycle within the panel while it is open. Escape, the Close button and
     the backdrop click are unchanged, and the scrollable guide body is in
     the cycle so a keyboard user can still scroll it. */
  function guideFocusables() {
    return Array.prototype.filter.call(
      el("guide-panel").querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'),
      n => n.offsetParent !== null && !n.disabled
    );
  }

  function trapGuideTab(e) {
    if (e.key !== "Tab") return;
    const items = guideFocusables();
    if (!items.length) { e.preventDefault(); return; }
    const first = items[0], last = items[items.length - 1];
    const active = document.activeElement;
    const idx = items.indexOf(active);

    /* Build 1.1.1 final pass: focus may legitimately sit on an element that is
       inside the panel but NOT in the tab cycle — the dialog title carries
       tabindex="-1" and receives focus when the guide opens. It is also the
       FIRST node in the panel, so an unguarded Shift+Tab from it walked
       backwards out of the dialog into the lesson controls behind. Any focus
       that is not on a cycle member is therefore re-anchored explicitly:
       Tab goes to the first focusable, Shift+Tab to the last. This also
       covers focus having drifted outside the panel entirely. */
    if (idx === -1) {
      e.preventDefault();
      (e.shiftKey ? last : first).focus();
      return;
    }
    if (e.shiftKey && active === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
  }

  /* Build 1.3.0 — the mission reaches the Study Guide through here rather
     than carrying its own copy of the content or its own focus trap.
     One guide panel, one trap, one set of Verb study material. */
  function openGuideFor(topicKey, opener) {
    if (!C.topics[topicKey]) return;
    lesson.topicKey = topicKey;
    lesson.guideOpener = opener || document.activeElement;
    renderGuide(topicKey);
    el("guide-overlay").hidden = false;
    document.body.classList.add("guide-open");
    document.addEventListener("keydown", trapGuideTab, true);
    el("guide-title").focus();
  }

  function openGuide() {
    if (!lesson.topicKey) return;
    lesson.guideOpener = document.activeElement;
    renderGuide(lesson.topicKey);
    el("guide-overlay").hidden = false;
    document.body.classList.add("guide-open");
    document.addEventListener("keydown", trapGuideTab, true);
    el("guide-title").focus();
  }

  function closeGuide() {
    if (el("guide-overlay").hidden) return;
    document.removeEventListener("keydown", trapGuideTab, true);
    el("guide-overlay").hidden = true;
    document.body.classList.remove("guide-open");
    if (lesson.guideOpener && lesson.guideOpener.focus) lesson.guideOpener.focus();
    lesson.guideOpener = null;
  }

  function guideIsOpen() { return !el("guide-overlay").hidden; }

  /* =========================================================
     7. INIT + PUBLIC API
     ========================================================= */
  function init() {
    buildTopicScreen();

    el("topics-back").addEventListener("click", () => window.SS_SHELL.goHome());
    el("topics-home").addEventListener("click", () => window.SS_SHELL.goHome());

    el("lesson-prev").addEventListener("click", prevStep);
    el("lesson-next").addEventListener("click", nextStep);
    el("lesson-topics").addEventListener("click", openTopics);
    el("lesson-home").addEventListener("click", () => window.SS_SHELL.goHome());

    el("lesson-guide").addEventListener("click", openGuide);
    el("guide-close").addEventListener("click", closeGuide);
    el("guide-overlay").addEventListener("click", e => {
      if (e.target === el("guide-overlay")) closeGuide();
    });

    /* Milestone controls. "Keep Going" continues the cycle; the other two
       leave Learn, which ends the session -- nothing is saved. */
    el("ms-continue").addEventListener("click", leaveMilestone);
    el("ms-topics").addEventListener("click", openTopics);
    el("ms-home").addEventListener("click", () => window.SS_SHELL.goHome());

    el("done-next").addEventListener("click", function () {
      if (this.dataset.topic) openTopic(this.dataset.topic);
    });
    el("done-again").addEventListener("click", () => openTopic(lesson.topicKey));
    el("done-topics").addEventListener("click", openTopics);
    el("done-home").addEventListener("click", () => window.SS_SHELL.goHome());
  }

  window.SS_LEARN = {
    init,
    /* read-only hooks for the audit harness */
    bankState: () => ({ pos: lesson.bankPos, order: lesson.bankOrder.slice(),
                        attempts: lesson.attempts, milestone: lesson.milestoneStage,
                        total: lesson.bankOrder.length }),
    openTopics,
    openTopic,
    openGuideFor,
    closeGuide,
    guideIsOpen,
    backFromLesson: openTopics,
    lesson
  };
})();
