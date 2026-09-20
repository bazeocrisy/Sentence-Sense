/* =========================================================
   Sentence Sense — shell (Build 1.4.0)

   Every approved push increments this visible build number so the live
   GitHub Pages site can be verified after it refreshes.

   THE PRODUCT MODEL, AS OF 1.4.0
   ------------------------------
   ONE SCREEN. ONE SKILL. ONE OBVIOUS THING TO DO.

   Build 1.3.0 asked the child to choose a MODE first (Learn, Practice,
   Break It Down, Test) and then a topic. That is retired. The child now
   chooses the SKILL first:

     HOME -> SKILL -> LEARN | PRACTICE | TEST -> ACTIVITY

   Difficulty comes from the SENTENCE, never from the interface.

   WHAT THIS FILE OWNS
     - the four Home skill cards, built from content
     - the shared Skill screen, used by all four skills
     - screen switching, Home / Back, Escape
     - the "coming next" placeholder, used honestly
     - the four skill icons (clean vector symbols, never characters)
     - the build badge

   WHAT IT DELIBERATELY DOES NOT OWN
     - no lesson, question, answer or feedback text -- all of that lives
       in js/data/learn-content.js
     - no storage, no network calls, no external services, no accounts,
       no score, no timer, no streak
   ========================================================= */

(function () {
  "use strict";

  const BUILD_NUMBER = "Build 1.4.0";

  const C = window.SS_LEARN_CONTENT;
  const S = window.SS_SENTENCE;
  const make = S.make;
  const clear = S.clear;
  const el = id => document.getElementById(id);

  const SCREENS = ["home", "skill", "learn", "practice", "soon"];

  const state = {
    screen: "home",   // one of SCREENS
    skill: null       // null, or a key of C.topics
  };

  /* =========================================================
     ICONS
     Clean vector symbols only: a motion mark, a group of figures, an
     open book, a pencil. These are SYMBOLS, not character drawings --
     no faces, no mascots, no stick people. Each is decorative; the
     skill is always named in text beside it.
     ========================================================= */
  const ICONS = {
    /* Verb: a running figure with motion lines, matching the approved
       reference. An earlier pass replaced this with an abstract arrow,
       reading brief section 30 ("do not draw people") as covering icons.
       The owner clarified that the reference image is the intended
       appearance, so the figure is restored. Section 30 governs
       ILLUSTRATION -- the hero photograph and character art -- not a
       pictogram, and section 7 specifies a person/group icon for Subject,
       so glyph-level figures were always in scope. */
    run: 'M14.1 5.6a1.9 1.9 0 1 0 0-3.8 1.9 1.9 0 0 0 0 3.8z M12.6 7.1 9.9 8.6l-1.2 3.2 M12.6 7.1l2.6 1.6.6 3.5-3.4 2.1.6 4.2-1.4 3.4 M12.4 14.3l3.9 1.4 1.4 3.6 M15.2 8.7l2.7 1.5 3-.6 M2.4 8.2h4.2 M1.2 12.1h3.8 M2.9 16h3.4',
    people: 'M12 11.2a3.1 3.1 0 1 0 0-6.2 3.1 3.1 0 0 0 0 6.2z M5.6 12.4a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z M18.4 12.4a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z M6.4 19.5c0-3.1 2.5-5.4 5.6-5.4s5.6 2.3 5.6 5.4 M1.8 18.2c0-2.3 1.5-4 3.8-4.2 M22.2 18.2c0-2.3-1.5-4-3.8-4.2',
    book: 'M12 6.6C10 4.9 7.3 4.4 4.2 4.9a1 1 0 0 0-.8 1v11.4a1 1 0 0 0 1.2 1c2.6-.4 5 0 7.4 1.8 2.4-1.8 4.8-2.2 7.4-1.8a1 1 0 0 0 1.2-1V5.9a1 1 0 0 0-.8-1c-3.1-.5-5.8 0-7.8 1.7z M12 6.6v13.5',
    pencil: 'M7.3 19.4 3 20.9l1.4-4.3L16.2 4.8l3 3zM16.2 4.8l2-2a2.1 2.1 0 0 1 3 3l-2 2M4.4 16.6l3 2.8'
  };

  function iconNode(key) {
    const span = make("span", "skill-icon");
    span.setAttribute("aria-hidden", "true");
    const NS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("focusable", "false");
    const path = document.createElementNS(NS, "path");
    path.setAttribute("d", ICONS[key] || ICONS.book);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "currentColor");
    path.setAttribute("stroke-width", "1.7");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    svg.appendChild(path);
    span.appendChild(svg);
    return span;
  }

  /* =========================================================
     SCREENS
     ========================================================= */
  function showScreen(name) {
    SCREENS.forEach(s => {
      const node = el("screen-" + s);
      if (node) node.hidden = (s !== name);
    });
    state.screen = name;
    window.scrollTo(0, 0);
  }

  /* `moveFocus` is false on the initial call from init(), so nothing
     steals focus on load. Otherwise Home moves focus to its heading
     rather than leaving it on a button inside a screen just hidden. */
  function goHome(moveFocus) {
    state.skill = null;
    showScreen("home");
    if (moveFocus !== false) el("home-heading").focus();
  }

  /* =========================================================
     HOME — exactly four skill cards, built from content.
     The card is a container; the BUTTON is the only control, so there
     is exactly one tab stop and one click target per skill and the
     child learns a single rule: "I press this button to start."
     ========================================================= */
  /* THE BANNER PHOTOGRAPH — optional, and detected at runtime.

     The approved classroom photograph is supplied separately. Rather than
     hard-code it and break the page when it is absent, the banner probes
     for it and only paints it if it genuinely loads. Dropping the file at
     the path below is therefore the ENTIRE installation step: no code
     change, no CSS edit, no rebuild.

     The probe uses an Image object rather than a CSS background so the
     failure is HANDLED -- `onerror` fires, the class is never added, and
     the designed fallback stays. The one cost is a single 404 in the
     network log while no photo exists, which the harness knows about and
     excludes by path (see verification/guard.js check 1.3).

     The photo must carry NO baked-in text: the wordmark, headline and
     badge are live text drawn over it. */
  const HERO_PHOTO = "assets/images/sentence-sense-hero.jpg";

  function probeHeroPhoto() {
    const hero = el("home-hero");
    if (!hero) return;
    const img = new Image();
    img.onload = () => hero.classList.add("has-photo");
    img.onerror = () => { /* No photo yet. The fallback banner stands. */ };
    img.src = HERO_PHOTO;
  }

  function buildHome() {
    probeHeroPhoto();

    const grid = el("skill-grid");
    clear(grid);

    C.homeOrder.forEach(key => {
      const t = C.topics[key];
      if (!t) return;

      const card = make("li", "skill-card skill-" + t.color);

      const head = make("div", "skill-card-head");
      head.appendChild(iconNode(t.icon));
      head.appendChild(make("h3", "skill-name", t.name));
      card.appendChild(head);

      card.appendChild(make("p", "skill-ask", t.ask));

      const preview = make("div", "skill-preview");
      S.renderPreview(preview, t.preview, t.color);
      card.appendChild(preview);

      const btn = make("button", "btn btn-start");
      btn.type = "button";
      btn.dataset.skill = key;
      btn.appendChild(make("span", "btn-label", "Start"));
      const arrow = make("span", "btn-arrow", "→");
      arrow.setAttribute("aria-hidden", "true");
      btn.appendChild(arrow);
      /* The visible label is just "Start", which is right for a child
         reading one card. A screen reader hears every button on the
         screen in a row, so each needs to name its own skill. */
      btn.setAttribute("aria-label", "Start " + t.name + ". " + t.ask);
      btn.addEventListener("click", () => openSkill(key));
      card.appendChild(btn);

      grid.appendChild(card);
    });
  }

  /* =========================================================
     SKILL SCREEN — one component, all four skills.
     Learn / Practice / Test. Test is shown so the structure is clear,
     and says honestly that it is coming next. It is never faked and
     never a second copy of Practice.
     ========================================================= */
  const ACTIVITIES = [
    { key: "learn",    name: "Learn",    line: "Show me how" },
    { key: "practice", name: "Practice", line: "Let me try with help" },
    { key: "test",     name: "Test",     line: "Let me do it myself" }
  ];

  function activityReady(topic, key) {
    if (key === "learn") return true;
    if (key === "practice") return topic.practice === "bank";
    return false;   /* no Test engine exists in 1.4.0 */
  }

  function openSkill(key) {
    const t = C.topics[key];
    if (!t) return;
    state.skill = key;

    el("screen-skill").dataset.topic = t.color;
    el("skill-heading").textContent = t.name;
    el("skill-ask-line").textContent = t.ask;
    el("skill-tag").textContent = t.name;

    const host = el("activity-list");
    clear(host);

    ACTIVITIES.forEach(a => {
      const ready = activityReady(t, a.key);
      const btn = make("button", "activity-btn" + (ready ? "" : " is-soon"));
      btn.type = "button";
      btn.dataset.activity = a.key;

      const textCol = make("span", "activity-text");
      textCol.appendChild(make("span", "activity-name", a.name));
      textCol.appendChild(make("span", "activity-line", a.line));
      btn.appendChild(textCol);

      if (ready) {
        const arrow = make("span", "activity-arrow", "→");
        arrow.setAttribute("aria-hidden", "true");
        btn.appendChild(arrow);
        btn.setAttribute("aria-label", a.name + " " + t.name + ". " + a.line);
      } else {
        /* An honest label, written where the child reads -- not only in
           the placeholder screen they reach after pressing. */
        btn.appendChild(make("span", "activity-soon", "Coming next"));
        btn.setAttribute("aria-label", a.name + " " + t.name + ". Coming next.");
      }

      btn.addEventListener("click", () => openActivity(key, a.key));
      host.appendChild(btn);
    });

    showScreen("skill");
    el("skill-heading").focus();
  }

  /* =========================================================
     ACTIVITY ROUTING
     ========================================================= */
  function openActivity(skillKey, activityKey) {
    const t = C.topics[skillKey];
    if (!t) return;
    state.skill = skillKey;

    if (activityKey === "learn") {
      window.SS_LEARN.start(skillKey);
      return;
    }

    if (activityKey === "practice" && window.SS_PRACTICE.hasBank(skillKey)) {
      window.SS_PRACTICE.start(skillKey);
      return;
    }

    showSoon(skillKey, activityKey);
  }

  /* The honest placeholder. It says what is missing and offers the thing
     that does exist, rather than pretending or dead-ending. */
  function showSoon(skillKey, activityKey) {
    const t = C.topics[skillKey];
    const isTest = (activityKey === "test");

    el("screen-soon").dataset.topic = t.color;
    el("soon-tag").textContent = t.name;
    el("soon-heading").textContent = isTest
      ? "Test mode is coming next."
      : "Practice for this skill is coming next.";
    el("soon-note").textContent = isTest
      ? "When it is ready, Test will let you find " + t.name.toLowerCase() +
        "s on your own, with no hints."
      : "When it is ready, Practice will give you " + t.name.toLowerCase() +
        " questions with help whenever you need it.";

    /* Learn always exists, so there is always a real next step. */
    const toLearn = el("soon-learn");
    toLearn.textContent = "Learn " + t.name;

    showScreen("soon");
    el("soon-heading").focus();
  }

  /* =========================================================
     BUILD BADGE
     ========================================================= */
  function renderBuildBadge() {
    el("build-badge").textContent = "Sentence Sense — " + BUILD_NUMBER;
  }

  /* =========================================================
     INIT
     ========================================================= */
  function init() {
    buildHome();
    renderBuildBadge();

    el("skill-back").addEventListener("click", () => goHome());
    el("skill-home").addEventListener("click", () => goHome());

    el("soon-back").addEventListener("click",
      () => openSkill(state.skill));
    el("soon-home").addEventListener("click", () => goHome());
    el("soon-learn").addEventListener("click",
      () => openActivity(state.skill, "learn"));

    /* Escape steps back one level: an activity returns to its skill,
       a skill returns Home. */
    document.addEventListener("keydown", e => {
      if (e.key !== "Escape") return;
      if (state.screen === "learn" || state.screen === "practice" ||
          state.screen === "soon") {
        openSkill(state.skill);
        return;
      }
      if (state.screen === "skill") goHome();
    });

    /* The shell exposes only what the activity components need. */
    window.SS_SHELL = {
      showScreen: showScreen,
      goHome: goHome,
      openSkill: openSkill,
      openActivity: openActivity
    };

    if (window.SS_LEARN) window.SS_LEARN.init();
    if (window.SS_PRACTICE) window.SS_PRACTICE.init();

    goHome(false);
  }

  document.addEventListener("DOMContentLoaded", init);

  /* ---------- Audit hook (read-only, development) ---------- */
  window.__sentenceSense = {
    BUILD_NUMBER: BUILD_NUMBER,
    state: state,
    SCREENS: SCREENS,
    openSkill: openSkill,
    openActivity: openActivity,
    goHome: goHome,
    showScreen: showScreen
  };
})();
