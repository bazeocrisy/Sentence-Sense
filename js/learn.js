/* =========================================================
   Sentence Sense — shared LEARN component (Build 1.4.0)

   ONE lesson component, used by every skill. Learn is short: four
   states on one screen, not five stages and not a separate app per
   step (brief section 12).

     1. WHAT IS IT?        -> topic.definition
     2. HOW DO I FIND IT?  -> topic.clue, plus the reference chips and
                              the same-word contrast folded out of the
                              retired Study Guide modal
     3. SHOW ME            -> topic.example
     4. LET ME TRY         -> topic.learnTry, or topic.tryIt

   Build 1.4.0 retired the Study Guide MODAL. Its overlay, its
   two-way focus trap and its header button are gone, which closes
   D-35 by removing the architecture the defect lived in. The useful
   material -- the action-verb and being-verb chip lists, the ending
   clues, the "same word, two jobs" contrast -- is surfaced inside
   HOW DO I FIND IT as plain content, where it naturally belongs. No
   separate recap screen was created to hold it.

   This file contains rendering and interaction only. Every word a
   child reads comes from js/data/learn-content.js.
   ========================================================= */

(function () {
  "use strict";

  const C = window.SS_LEARN_CONTENT;
  const S = window.SS_SENTENCE;
  const make = S.make;
  const clear = S.clear;
  const el = id => document.getElementById(id);

  /* The four states, in teaching order. A state is a content key plus the
     short label shown on the step line. */
  const STATES = [
    { key: "definition", label: "What is it?" },
    { key: "clue",       label: "How do I find it?" },
    { key: "example",    label: "Show me" },
    { key: "try",        label: "Let me try" }
  ];

  /* Session state only. Nothing is persisted anywhere: no localStorage, no
     sessionStorage, no network, no score. Leaving and re-entering a lesson
     starts it again at state 1. */
  const lesson = {
    topicKey: null,
    stateIndex: 0,
    answered: false,
    done: false
  };

  /* =========================================================
     1. BLOCK RENDERER
     Renders one content block in a fixed, pedagogically ordered
     sequence, skipping anything the block does not define, so every
     skill reads the same way.
     ========================================================= */
  function renderBlock(host, block) {
    if (!block) return;

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

    if (block.sentence) S.renderTeachingSentence(host, block.sentence);

    if (block.points) {
      const ul = make("ul", "lesson-points");
      block.points.forEach(s => ul.appendChild(make("li", null, s)));
      host.appendChild(ul);
    }

    if (block.contrast) S.renderContrast(host, block.contrast);

    if (block.note) host.appendChild(make("p", "lesson-note", block.note));
  }

  /* =========================================================
     2. THE FOLDED-IN REFERENCE MATERIAL
     Build 1.4.0: what the Study Guide modal used to hold.

     Only two section shapes carry reference material a child can use
     while finding a word -- chip lists and the contrast. Prose that
     merely restated the definition is NOT repeated here; the lesson
     has already said it one state earlier. The material is collapsed
     behind one summary so HOW DO I FIND IT stays short by default and
     the child chooses to open it.
     ========================================================= */
  function renderReference(host, topic) {
    const guide = topic.studyGuide;
    if (!guide || !guide.sections) return;

    const chipSections = guide.sections.filter(s => s.chips && s.chips.length);
    const contrasts = guide.sections.filter(s => s.contrast);
    if (!chipSections.length && !contrasts.length) return;

    const box = make("details", "lesson-reference");
    const sum = make("summary", "lesson-reference-head");
    sum.appendChild(make("span", "lref-title", "Words to remember"));
    sum.appendChild(make("span", "lref-hint", "Open this any time you get stuck."));
    box.appendChild(sum);

    const body = make("div", "lesson-reference-body");

    if (chipSections.length) {
      const wrap = make("div", "lesson-groups");
      chipSections.forEach(s => {
        const card = make("div", "lesson-group");
        card.appendChild(make("h3", "lesson-group-label", s.heading));
        const row = make("div", "chip-row");
        s.chips.forEach(c => row.appendChild(make("span", "chip", c)));
        card.appendChild(row);
        wrap.appendChild(card);
      });
      body.appendChild(wrap);
    }

    contrasts.forEach(s => S.renderContrast(body, s.contrast));

    if (guide.reminder) body.appendChild(make("p", "lesson-note", guide.reminder));

    box.appendChild(body);
    host.appendChild(box);
  }

  /* =========================================================
     3. LESSON RUNNER
     ========================================================= */
  function start(topicKey) {
    if (!C.topics[topicKey]) return;
    lesson.topicKey = topicKey;
    lesson.stateIndex = 0;
    lesson.answered = false;
    lesson.done = false;

    const t = C.topics[topicKey];
    el("screen-learn").dataset.topic = t.color;
    el("learn-skill-tag").textContent = t.name;

    window.SS_SHELL.showScreen("learn");
    render();
  }

  function renderSteps() {
    const host = el("learn-steps");
    clear(host);
    STATES.forEach((st, i) => {
      const item = make("li", "lstep", st.label);
      if (!lesson.done && i === lesson.stateIndex) {
        item.classList.add("current");
        item.setAttribute("aria-current", "step");
      }
      if (lesson.done || i < lesson.stateIndex) item.classList.add("done");
      host.appendChild(item);
    });
  }

  /* The LET ME TRY question. A topic uses `learnTry` if it has one,
     otherwise its single `tryIt` block. */
  function tryBlockFor(topic) {
    return topic.learnTry || topic.tryIt || null;
  }

  function render() {
    const t = C.topics[lesson.topicKey];
    const state = STATES[lesson.stateIndex];
    const isTry = (state.key === "try");
    const block = isTry ? tryBlockFor(t) : t[state.key];

    el("learn-done").hidden = true;
    el("learn-stage").hidden = false;
    el("learn-controls").hidden = false;

    el("learn-heading").textContent = (block && block.title) || state.label;

    const body = el("learn-content");
    clear(body);

    const tryHost = el("learn-try");
    tryHost.hidden = !isTry;
    clearTry();

    if (isTry) {
      buildTry(block);
    } else {
      renderBlock(body, block);
      /* The reference material belongs with the clue: it is what a child
         reaches for while working out which word to pick. */
      if (state.key === "clue") renderReference(body, t);
    }

    el("learn-prev").disabled = (lesson.stateIndex === 0);
    const next = el("learn-next");
    if (isTry) {
      next.textContent = "Finish";
      next.disabled = !lesson.answered;
    } else {
      next.textContent = "Next";
      next.disabled = false;
    }

    renderSteps();
    el("learn-heading").focus();
    window.scrollTo(0, 0);
  }

  function nextState() {
    if (lesson.stateIndex < STATES.length - 1) {
      lesson.stateIndex += 1;
      lesson.answered = false;
      render();
    } else if (lesson.answered) {
      showDone();
    }
  }

  function prevState() {
    if (lesson.done) { lesson.done = false; render(); return; }
    if (lesson.stateIndex > 0) {
      lesson.stateIndex -= 1;
      lesson.answered = false;
      render();
    }
  }

  /* =========================================================
     4. LET ME TRY
     A short reinforcement of what was just taught -- not Practice.
     A wrong choice explains that word's real job in THIS sentence
     and invites another look. The child may try again.
     ========================================================= */
  function clearTry() {
    clear(el("try-sentence"));
    clear(el("try-choices"));
    el("try-question").textContent = "";
    const fb = el("try-feedback");
    fb.hidden = true;
    fb.className = "answer-feedback";
    clear(fb);
  }

  function buildTry(block) {
    if (!block) return;
    S.renderSentence(el("try-sentence"), block.sentence);
    el("try-question").textContent = block.question;

    const host = el("try-choices");
    const longest = block.choices.reduce((n, c) => Math.max(n, c.text.length), 0);
    host.classList.toggle("is-wide", longest > 12);

    block.choices.forEach(choice => {
      const btn = make("button", "choice-btn");
      btn.type = "button";
      btn.textContent = choice.text;
      btn.addEventListener("click", () => answerTry(btn, choice));
      host.appendChild(btn);
    });
  }

  function answerTry(btn, choice) {
    const fb = el("try-feedback");
    const buttons = el("try-choices").querySelectorAll(".choice-btn");

    clear(fb);
    fb.hidden = false;

    if (choice.correct) {
      lesson.answered = true;
      Array.prototype.forEach.call(buttons, b => { b.disabled = true; b.classList.remove("is-wrong"); });
      btn.classList.add("is-right");
      fb.className = "answer-feedback is-right";
      fb.appendChild(make("span", "fb-mark", "✓"));
      const body = make("span", "fb-body");
      body.appendChild(make("span", "fb-text", choice.feedback));
      fb.appendChild(body);
      el("learn-next").disabled = false;
      el("learn-next").focus();
      return;
    }

    btn.classList.add("is-wrong");
    btn.disabled = true;
    fb.className = "answer-feedback is-wrong";
    fb.appendChild(make("span", "fb-mark", "✕"));
    const body = make("span", "fb-body");
    body.appendChild(make("span", "fb-text", choice.feedback));
    body.appendChild(make("span", "fb-again", "Have another look."));
    fb.appendChild(body);

    /* Disabling the chosen button drops focus to <body>. Move it to the
       next choice the child can still try. The feedback has its own
       aria-live region, so this does not create a second announcement. */
    const nextChoice = Array.prototype.filter.call(buttons, x => !x.disabled)[0];
    if (nextChoice) nextChoice.focus();
  }

  /* =========================================================
     5. COMPLETION
     A quiet sense of achievement. No points, no coins, no streak,
     no sound, nothing stored.
     ========================================================= */
  function showDone() {
    const t = C.topics[lesson.topicKey];
    lesson.done = true;

    el("learn-stage").hidden = true;
    el("learn-controls").hidden = true;
    el("learn-done").hidden = false;

    el("learn-done-title").textContent = "You learned " + t.name + "!";
    el("learn-done-recap").textContent = t.recap;

    /* Practice is the honest next step only where a real bank exists. */
    const toPractice = el("learn-done-practice");
    if (t.practice === "bank") {
      toPractice.hidden = false;
      toPractice.textContent = "Practice " + t.name;
    } else {
      toPractice.hidden = true;
    }

    renderSteps();
    el("learn-done-title").focus();
    window.scrollTo(0, 0);
  }

  /* =========================================================
     6. INIT + PUBLIC API
     ========================================================= */
  function init() {
    el("learn-prev").addEventListener("click", prevState);
    el("learn-next").addEventListener("click", nextState);
    el("learn-back").addEventListener("click", () => window.SS_SHELL.openSkill(lesson.topicKey));
    el("learn-home").addEventListener("click", () => window.SS_SHELL.goHome());

    el("learn-done-practice").addEventListener("click",
      () => window.SS_SHELL.openActivity(lesson.topicKey, "practice"));
    el("learn-done-again").addEventListener("click", () => start(lesson.topicKey));
    el("learn-done-skill").addEventListener("click",
      () => window.SS_SHELL.openSkill(lesson.topicKey));
    el("learn-done-home").addEventListener("click", () => window.SS_SHELL.goHome());
  }

  window.SS_LEARN = {
    init: init,
    start: start,
    /* read-only hook for the audit harness */
    state: () => ({
      topicKey: lesson.topicKey,
      stateIndex: lesson.stateIndex,
      stateKey: STATES[lesson.stateIndex] && STATES[lesson.stateIndex].key,
      total: STATES.length,
      answered: lesson.answered,
      done: lesson.done
    })
  };
})();
