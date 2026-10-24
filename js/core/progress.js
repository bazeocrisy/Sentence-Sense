(function (root) {
  "use strict";
  const KEY = "sentence-sense-v2",
    VERSION = 2;
  const blank = () => ({
    version: VERSION,
    bookmark: null,
    lessons: {},
    writing: [],
    history: [],
  });
  let warning = "",
    locked = false;
  function validate(x) {
    if (
      !x ||
      x.version !== VERSION ||
      !x.lessons ||
      Array.isArray(x.lessons) ||
      typeof x.lessons !== "object" ||
      !Array.isArray(x.writing) ||
      !Array.isArray(x.history)
    )
      return false;
    const ids = new Set(root.SS_CURRICULUM.lessons.map((l) => l.id)),
      modes = ["teach", "guided", "independent", "test"];
    if (
      x.bookmark &&
      (!ids.has(x.bookmark.id) || !modes.includes(x.bookmark.mode))
    )
      return false;
    if (
      x.writing.some(
        (w) =>
          !w ||
          typeof w.id !== "string" ||
          typeof w.original !== "string" ||
          !Array.isArray(w.revisions),
      )
    )
      return false;
    for (const [id, record] of Object.entries(x.lessons)) {
      if (
        !ids.has(id) ||
        !record ||
        typeof record !== "object" ||
        !record.sessions ||
        typeof record.sessions !== "object" ||
        !Array.isArray(record.results)
      )
        return false;
      for (const [mode, s] of Object.entries(record.sessions)) {
        const total =
          mode === "test"
            ? 29
            : mode === "independent"
              ? 10
              : id === "verbs"
                ? 15
                : 12;
        if (
          !modes.includes(mode) ||
          !s ||
          !Array.isArray(s.answers) ||
          s.answers.length !== total ||
          !Number.isInteger(s.pos) ||
          s.pos < 0 ||
          s.pos >= total ||
          !Number.isInteger(s.seed) ||
          !Number.isInteger(s.form) ||
          typeof s.submitted !== "boolean"
        )
          return false;
        if (
          s.answers.some(
            (a) =>
              !a ||
              typeof a.text !== "string" ||
              !Number.isInteger(a.attempts) ||
              a.attempts < 0 ||
              !Number.isInteger(a.hints) ||
              a.hints < 0 ||
              a.hints > 3 ||
              typeof a.shown !== "boolean" ||
              typeof a.assisted !== "boolean" ||
              !Array.isArray(a.order),
          )
        )
          return false;
      }
      if (
        record.results.some(
          (r) =>
            !r ||
            !modes.includes(r.mode) ||
            !Number.isInteger(r.form) ||
            !Number.isInteger(r.seed) ||
            !Array.isArray(r.responses) ||
            r.responses.length !==
              { test: 29, independent: 10, guided: id === "verbs" ? 15 : 12 }[
                r.mode
              ] ||
            r.responses.some(
              (a) =>
                !a ||
                typeof a.text !== "string" ||
                (a.rubric !== null &&
                  a.rubric !== undefined &&
                  (!Array.isArray(a.rubric) ||
                    a.rubric.length !== 3 ||
                    a.rubric.some((v) => typeof v !== "boolean"))),
            ),
        )
      )
        return false;
      if (
        record.teachStep !== undefined &&
        (!Number.isInteger(record.teachStep) ||
          record.teachStep < 0 ||
          record.teachStep > 4)
      )
        return false;
    }
    return true;
  }
  function read() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return blank();
      const x = JSON.parse(raw);
      if (!validate(x)) throw new Error("unsupported or damaged data");
      return x;
    } catch (e) {
      warning =
        "Saved progress could not be read. A fresh session is available; the original data has been left in a recovery copy when storage permits.";
      try {
        const raw = localStorage.getItem(KEY);
        if (raw) localStorage.setItem(KEY + "-recovery", raw);
      } catch (_) {}
      return blank();
    }
  }
  let data = read();
  function save() {
    if (locked) {
      warning = "Progress changed in another tab. Reload before continuing.";
      return false;
    }
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      warning =
        "This browser could not save progress. Keep this tab open. Storage may be full or unavailable.";
      return false;
    }
  }
  function record(id) {
    return (
      data.lessons[id] ||
      (data.lessons[id] = {
        teachStep: 0,
        teachDone: false,
        sessions: {},
        results: [],
      })
    );
  }
  function answer() {
    return {
      text: "",
      selection: null,
      attempts: 0,
      firstCorrect: false,
      assisted: false,
      hints: 0,
      shown: false,
      done: false,
      feedback: "",
      order: [],
      rubric: null,
    };
  }
  function session(id, mode, restart = false) {
    const r = record(id);
    if (!restart && r.sessions[mode]) return r.sessions[mode];
    const prev = r.sessions[mode];
    const seed = (prev?.seed ?? -1) + 1,
      form =
        mode === "test"
          ? r.results.filter((x) => x.mode === "test").length % 2
          : 0;
    return (r.sessions[mode] = {
      seed,
      form,
      pos: 0,
      answers: Array.from(
        {
          length:
            mode === "test"
              ? 29
              : mode === "independent"
                ? 10
                : id === "verbs"
                  ? 15
                  : 12,
        },
        answer,
      ),
      submitted: false,
      created: Date.now(),
      resultId: null,
    });
  }
  function bookmark(id, mode) {
    data.bookmark = { id, mode };
    save();
  }
  function score(s, questions) {
    let auto = 0,
      pending = 0,
      written = 0,
      reviewed = 0,
      independent = 0,
      assisted = 0;
    s.answers.forEach((a, i) => {
      const q = questions[i];
      if (q.type === "writing") {
        if (!a.rubric) pending++;
        else {
          reviewed++;
          if (a.rubric.every(Boolean)) written++;
        }
      } else if (a.correct) auto++;
      if (a.firstCorrect && !a.assisted && q.type !== "writing") independent++;
      if (a.assisted) assisted++;
    });
    const reviewPrompts = [
      ...new Set(
        questions
          .filter(
            (q, i) =>
              q.type !== "writing" &&
              (questions.length === 29
                ? !s.answers[i].correct
                : !s.answers[i].firstCorrect || s.answers[i].assisted),
          )
          .map((q) => q.prompt),
      ),
    ];
    return {
      auto,
      pending,
      written,
      reviewed,
      independent,
      assisted,
      reviewPrompts,
      total: auto + written,
      mastered:
        s.submitted &&
        questions.length === 29 &&
        pending === 0 &&
        written === 3 &&
        auto + written >= 24,
    };
  }
  function result(id, mode, s, questions) {
    const r = record(id),
      v = {
        id: s.resultId || `${id}-${mode}-${s.created}-${s.seed}`,
        mode,
        form: s.form,
        date: Date.now(),
        seed: s.seed,
        responses: JSON.parse(JSON.stringify(s.answers)),
        ...score(s, questions),
      };
    s.resultId = v.id;
    const old = r.results.findIndex((x) => x.id === v.id);
    if (old < 0) r.results.push(v);
    else r.results[old] = v;
    save();
    return v;
  }
  function reset() {
    try {
      localStorage.removeItem(KEY);
      localStorage.removeItem(KEY + "-recovery");
      data = blank();
      warning = "";
      return true;
    } catch (e) {
      warning =
        "Progress could not be reset because browser storage is unavailable.";
      return false;
    }
  }
  root.SS_PROGRESS = {
    KEY,
    VERSION,
    get data() {
      return data;
    },
    get warning() {
      return warning;
    },
    get locked() {
      return locked;
    },
    blockWrites() {
      locked = true;
    },
    save,
    record,
    session,
    bookmark,
    score,
    result,
    reset,
    validate,
  };
  if (typeof module !== "undefined") module.exports = root.SS_PROGRESS;
})(typeof window === "undefined" ? globalThis : window);
