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
    guideOpener: null
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

  function renderSentence(host, spec) {
    clear(host);
    if (!spec) { host.hidden = true; return; }
    host.hidden = false;

    const words = spec.words;
    const marks = spec.marks || [];
    const markFor = i => marks.find(m => i >= m.start && i <= m.end) || null;

    const box = make("div", "ss-sentence");

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

    if (block.sentence) {
      const sHost = make("div", "sentence-host");
      renderSentence(sHost, block.sentence);
      host.appendChild(sHost);
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
    lesson.topicKey = null;
    window.SS_SHELL.showScreen("topics");
    el("topics-heading").focus();
  }

  /* =========================================================
     4. LESSON RUNNER
     ========================================================= */
  function openTopic(key) {
    if (!C.topics[key]) return;
    lesson.topicKey = key;
    lesson.stepIndex = 0;
    lesson.answered = false;
    lesson.done = false;

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

    el("lesson-heading").textContent = t.name + " — " + block.title;

    const isTry = (stepKey === "tryIt");
    /* Try It renders its own sentence, question and choices below, so the
       generic block renderer is skipped for that step. */
    if (isTry) clear(el("lesson-content"));
    else renderBlock(el("lesson-content"), block);

    el("tryit").hidden = !isTry;
    if (isTry) buildTryIt(block);
    else clearTryIt();   /* never leave a previous question in the DOM */

    el("lesson-prev").disabled = (lesson.stepIndex === 0);
    const next = el("lesson-next");
    if (isTry) {
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
    if (lesson.stepIndex < STEP_KEYS.length - 1) {
      lesson.stepIndex += 1;
      lesson.answered = false;
      renderStep();
    } else if (lesson.answered) {
      showDone();
    }
  }

  function prevStep() {
    if (lesson.done) { lesson.done = false; renderStep(); return; }
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
    el("lesson-done").hidden = false;

    el("done-title").textContent = "Nice work! You learned " + t.name + ".";
    el("done-recap").textContent = t.recap;

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
    const fb = el("tryit-feedback");
    fb.hidden = true;
    fb.className = "tryit-feedback";
    clear(fb);
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
    const inside = el("guide-panel").contains(active);

    if (!inside) { e.preventDefault(); (e.shiftKey ? last : first).focus(); return; }
    if (e.shiftKey && active === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
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

    el("done-next").addEventListener("click", function () {
      if (this.dataset.topic) openTopic(this.dataset.topic);
    });
    el("done-again").addEventListener("click", () => openTopic(lesson.topicKey));
    el("done-topics").addEventListener("click", openTopics);
    el("done-home").addEventListener("click", () => window.SS_SHELL.goHome());
  }

  window.SS_LEARN = {
    init,
    openTopics,
    openTopic,
    closeGuide,
    guideIsOpen,
    backFromLesson: openTopics,
    lesson
  };
})();
