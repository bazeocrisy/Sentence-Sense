/* =========================================================
   Sentence Sense — Find it. Ask it. Understand it.
   Build 1.1 — SHELL + LEARN MODE ROUTING.

   This file remains the shell: it shows one screen at a time and
   owns Home / Back / Escape. Learn Mode itself lives in js/learn.js
   and its content in js/data/learn-content.js.

   What this file does:
     - shows one screen at a time (home, mode destination)
     - carries the four approved modes in a single MODES config
     - handles Back / Home navigation and focus
     - stamps the build number in the footer badge

   What this file deliberately does NOT do:
     - no lesson, practice, break-it-down or test engine
     - no sentence content, answer keys or scoring
     - no storage, no network calls, no external services

   Architecture note for later builds: educational content will live
   in its own data module (planned: js/data/), separate from this
   shell, so sentences and answer keys can be audited on their own.
   No content exists in Build 1.0.
   ========================================================= */

(function () {
  "use strict";

  const BUILD_NUMBER = "Build 1.1";

  /* ---------- Approved modes (home screen shows exactly these four) ---------- */
  /* Build 1.1: "learn" is no longer a placeholder — the Learn card now
     opens the Learn topic screen. The other three are unchanged. */
  const MODES = {
    practice: {
      tag: "Practice",
      icon: "✏️",
      title: "Practice",
      note: "Practice will let you work on one sentence skill at a time, with help when you need it."
    },
    breakdown: {
      tag: "Break It Down",
      icon: "🔍",
      title: "Break It Down",
      note: "Break It Down will take one whole sentence apart with you, step by step, so you can see how all the parts work together."
    },
    test: {
      tag: "Test",
      icon: "🏆",
      title: "Test",
      note: "Test will let you answer sentence questions on your own, with no hints, and then show you how you did."
    }
  };

  const SCREENS = ["home", "topics", "lesson", "mode"];
  const el = id => document.getElementById(id);

  /* ---------- State ---------- */
  const state = {
    screen: "home",   // "home" | "topics" | "lesson" | "mode"
    mode: null        // null | a key of MODES
  };

  /* ---------- Screen switching ---------- */
  function showScreen(name) {
    SCREENS.forEach(s => {
      const node = el("screen-" + s);
      if (node) node.hidden = (s !== name);
    });
    state.screen = name;
    window.scrollTo(0, 0);
  }

  function goHome() {
    state.mode = null;
    el("screen-mode").dataset.mode = "";
    if (window.SS_LEARN) window.SS_LEARN.closeGuide();
    showScreen("home");
  }

  function openMode(key) {
    /* Build 1.1: Learn has a real destination now. */
    if (key === "learn") { window.SS_LEARN.openTopics(); return; }

    const mode = MODES[key];
    if (!mode) return;

    state.mode = key;
    el("screen-mode").dataset.mode = key;
    el("mode-tag").textContent = mode.tag;
    el("mode-icon").textContent = mode.icon;
    el("mode-heading").textContent = mode.title;
    el("mode-note").textContent = mode.note;

    showScreen("mode");
    // Move focus to the new screen's heading so keyboard and screen-reader
    // users land where the sighted user is looking.
    el("mode-heading").focus();
  }

  /* ---------- Build badge ---------- */
  function renderBuildBadge() {
    el("build-badge").textContent = "Sentence Sense — " + BUILD_NUMBER;
  }

  /* ---------- Init ---------- */
  function init() {
    Array.from(document.querySelectorAll(".mode-grid .mode-card")).forEach(card => {
      card.addEventListener("click", () => openMode(card.dataset.mode));
    });

    el("mode-back").addEventListener("click", goHome);
    el("mode-home").addEventListener("click", goHome);

    /* Escape steps back one level: it closes the Study Guide first, then
       leaves a lesson for the topic list, then returns Home. */
    document.addEventListener("keydown", e => {
      if (e.key !== "Escape") return;
      if (window.SS_LEARN && window.SS_LEARN.guideIsOpen()) { window.SS_LEARN.closeGuide(); return; }
      if (state.screen === "lesson") { window.SS_LEARN.openTopics(); return; }
      if (state.screen === "topics" || state.screen === "mode") goHome();
    });

    /* The shell exposes only what Learn Mode needs: screen switching
       and Home. Learn owns everything inside its own screens. */
    window.SS_SHELL = { showScreen, goHome };
    if (window.SS_LEARN) window.SS_LEARN.init();

    renderBuildBadge();
    goHome();
  }

  document.addEventListener("DOMContentLoaded", init);

  /* ---------- Audit hook (read-only, development) ---------- */
  window.__sentenceSense = {
    BUILD_NUMBER,
    state,
    MODES,
    openMode,
    goHome,
    showScreen
  };
})();
