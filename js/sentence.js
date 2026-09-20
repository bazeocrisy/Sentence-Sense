/* =========================================================
   Sentence Sense — shared sentence component (Build 1.4.0)

   ONE renderer draws every sentence the product shows: the small
   preview on a Home card, a marked teaching sentence in Learn, and
   the plain question sentence in Practice.

   THE PERMANENT RULE THIS FILE EXISTS TO GUARANTEE
   ------------------------------------------------
   READ IT, then SEE HOW IT WORKS. Wherever a sentence carries any
   annotation, the same sentence is shown twice: plain first, marked
   second. Both passes render from the SAME `words` array, so the
   plain pass cannot add, remove, reorder or re-punctuate a word --
   it reads the same source and only suppresses decoration.

   NEVER introduce a separate plain-text string for a sentence. That
   is the one change that would let the two versions drift apart.

   Colour is never the only signal. A marked word also carries a
   written label above it, a border and a thick underline.

   This file holds rendering only. Every word a child reads comes
   from js/data/learn-content.js.
   ========================================================= */

(function () {
  "use strict";

  /* ---------- small DOM helpers, shared by every component ---------- */
  function make(tag, className, text) {
    const n = document.createElement(tag);
    if (className) n.className = className;
    if (text !== undefined && text !== null) n.textContent = text;
    return n;
  }

  function clear(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  /* Ending punctuation is not part of the word being taught, so it sits
     outside the underline: the child sees "ball" underlined as the noun,
     not "ball." The punctuation stays inside the word chip's own row and
     never becomes a line of its own. */
  function splitTail(text) {
    const tail = /[.!?,]$/.test(text) ? text.slice(-1) : "";
    return { base: tail ? text.slice(0, -1) : text, tail: tail };
  }

  function wordChip(text, mark) {
    const chip = make("span", "ss-word");

    if (!mark) {
      chip.appendChild(make("span", "ss-word-text", text));
      return chip;
    }

    const parts = splitTail(text);
    chip.classList.add("is-marked", "ss-k-" + mark.kind);
    if (mark.label) chip.appendChild(make("span", "ss-word-label", mark.label));

    /* The chip is a COLUMN, so a written label can sit above the word.
       The word and its ending punctuation therefore need their own ROW
       inside it. Without this wrapper the punctuation becomes a third
       line and "sentence." renders as "sentence" with a full stop
       stranded underneath. This exact defect shipped once before
       (Build 1.3.0, M-02) and was caught by looking at a screenshot,
       not by a test -- check 10.4 now guards it. */
    const body = make("span", "ss-word-body");
    body.appendChild(make("span", "ss-word-text", parts.base));
    if (parts.tail) body.appendChild(make("span", "ss-word-punct", parts.tail));
    chip.appendChild(body);
    return chip;
  }

  function wordRow(words, markFor, from, to) {
    const row = make("div", "ss-words");
    for (let i = from; i <= to; i++) row.appendChild(wordChip(words[i], markFor(i)));
    return row;
  }

  /* `opts.plain` renders the SAME spec with every annotation suppressed:
     no marks, no split, no links. */
  function renderSentence(host, spec, opts) {
    clear(host);
    if (!spec) { host.hidden = true; return; }
    host.hidden = false;

    const plain = !!(opts && opts.plain);
    const words = spec.words;
    const marks = plain ? [] : (spec.marks || []);
    const markFor = i => marks.find(m => i >= m.start && i <= m.end) || null;

    const box = make("div", "ss-sentence" + (plain ? " is-plain" : ""));

    if (plain || !spec.split) {
      box.appendChild(wordRow(words, markFor, 0, words.length - 1));
    } else {
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
    }

    if (!plain && spec.links && spec.links.length) {
      const list = make("ul", "ss-links");
      spec.links.forEach(link => {
        const item = make("li", "ss-link");
        const fromMark = markFor(link.from);
        const toMark = markFor(link.to);
        /* Same rule as the sentence itself: the relationship is between the
           words, so ending punctuation is not carried into the link. */
        const bare = w => splitTail(w).base;
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

  function isAnnotated(spec) {
    return !!(spec && (
      (spec.marks && spec.marks.length) ||
      spec.split ||
      (spec.links && spec.links.length)
    ));
  }

  /* THE PLAIN -> MARKED PAIR. A child reads the sentence as a sentence
     before meeting the grammar markup. A spec with no annotation is a
     plain sentence already and is shown once, unlabelled. */
  function renderTeachingSentence(host, spec) {
    if (!isAnnotated(spec)) {
      const solo = make("div", "sentence-host");
      renderSentence(solo, spec);
      host.appendChild(solo);
      return;
    }

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
  }

  /* The same-word comparison: one word doing two different jobs. */
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

  /* The Home card preview: one line, one highlighted span, no labels.
     It renders from the same word array and the same inclusive range
     shape as `marks`, so a card preview cannot drift from its sentence
     either. `kind` colours the span to match the skill. */
  function renderPreview(host, preview, kind) {
    clear(host);
    if (!preview) { host.hidden = true; return; }
    host.hidden = false;

    const line = make("p", "skill-preview-line");
    preview.words.forEach((w, i) => {
      const inSpan = i >= preview.start && i <= preview.end;
      line.appendChild(make("span", inSpan ? "sp-hit ss-k-" + kind : "sp-plain", w));
      if (i < preview.words.length - 1) line.appendChild(document.createTextNode(" "));
    });
    host.appendChild(line);
  }

  window.SS_SENTENCE = {
    make: make,
    clear: clear,
    renderSentence: renderSentence,
    renderTeachingSentence: renderTeachingSentence,
    renderContrast: renderContrast,
    renderPreview: renderPreview,
    isAnnotated: isAnnotated
  };
})();
