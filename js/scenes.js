/* =========================================================
   Sentence Sense — Scene library  (Build 1.3.0)

   ORIGINAL ARTWORK ONLY. Every illustration in this file is inline
   SVG authored for this project. There are no third-party images, no
   icon fonts, no CDN art and no new binary assets, so there is no
   licensing surface and no download cost: the whole illustrated
   mission adds a few KB of text to a file that already loads.

   Why inline SVG rather than PNG scenes:
     - it scales from a phone to a classroom projector with no blur
     - it recolours and animates from CSS, so reduced-motion support
       does not need a second set of assets
     - it is reviewable in a diff, like the rest of the content

   WHAT THIS FILE DOES NOT DO
     It holds no sentences, no questions, no answers and no feedback.
     Those are content and live in js/data/mission-verb.js. This file
     only draws.

   DIVERSITY. The children in these scenes vary in skin tone, hair
   texture and hair style by design. The palette below is the single
   place those choices are made.

   ACCESSIBILITY. Every scene is returned as an aria-hidden <svg> with
   no text inside it. The calling engine wraps it in a figure carrying
   role="img" and an aria-label written in the CONTENT file, because
   the right description depends on the teaching moment — during
   independent practice a description must not name the answer.
   ========================================================= */

(function () {
  "use strict";

  /* ---------- palette ---------- */
  var P = {
    ink: "#12325B",
    sky: "#EDF7FF",
    skyDeep: "#D6ECFB",
    room: "#F6F2FF",
    roomFloor: "#E3DCF6",
    yard: "#F3F8EC",
    grass: "#9FD98A",
    grassDeep: "#7CC267",
    water: "#67C8F3",
    waterDeep: "#35A8D8",
    wood: "#C08B52",
    woodDeep: "#9A6B38",
    stone: "#C9D2DE",
    white: "#FFFFFF",
    cream: "#FFF9E8",
    yellow: "#FFD84D",
    gold: "#F5B82E",
    purple: "#8567E8",
    lavender: "#C9B8F5",
    orange: "#FF9648",
    red: "#E8584F",
    pink: "#F0949C",
    green: "#59C97A",
    teal: "#35C3E8",
    mud: "#8A6136",
    /* Skin tones, light to deep. Numbered so no single one reads as
       the "default" child. */
    s1: "#F7D9BE", s2: "#EFC39B", s3: "#D79C6E", s4: "#A9693C", s5: "#7A4A26",
    /* Hair */
    h1: "#2B1B10", h2: "#4A2C17", h3: "#8A5A2B", h4: "#C9822F", h5: "#1C1C22", h6: "#6E4B8A"
  };

  /* ---------- primitives ---------- */

  function rd(n) { return Math.round(n * 10) / 10; }

  function c(cx, cy, r, fill) {
    return '<circle cx="' + rd(cx) + '" cy="' + rd(cy) + '" r="' + rd(r) + '" fill="' + fill + '"/>';
  }

  /* One stroked path per limb, so a limb animates as a single group. */
  function limb(d, color, w) {
    return '<path d="' + d + '" stroke="' + color + '" stroke-width="' + (w || 9) +
      '" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
  }

  /* A head with hair, eyes and a small mouth. `style` changes the hair
     silhouette, which is what actually makes two children read as two
     different children at small sizes. */
  function head(cx, cy, r, skin, hair, style) {
    var back = "", front = "";
    if (style === "curls") {
      back = c(cx - r * 0.72, cy - r * 0.55, r * 0.5, hair) +
             c(cx - r * 0.28, cy - r * 0.95, r * 0.5, hair) +
             c(cx + r * 0.28, cy - r * 0.98, r * 0.5, hair) +
             c(cx + r * 0.74, cy - r * 0.5, r * 0.48, hair);
    } else if (style === "braids") {
      back = '<path d="M' + rd(cx - r) + ' ' + rd(cy - r * 0.1) + ' a' + rd(r) + ' ' + rd(r) +
               ' 0 0 1 ' + rd(r * 2) + ' 0 z" fill="' + hair + '"/>' +
             '<path d="M' + rd(cx - r * 0.95) + ' ' + rd(cy - r * 0.1) + ' q' + rd(-r * 0.45) + ' ' +
               rd(r * 1.1) + ' ' + rd(-r * 0.1) + ' ' + rd(r * 1.8) + '" stroke="' + hair +
               '" stroke-width="' + rd(r * 0.42) + '" fill="none" stroke-linecap="round"/>' +
             '<path d="M' + rd(cx + r * 0.95) + ' ' + rd(cy - r * 0.1) + ' q' + rd(r * 0.45) + ' ' +
               rd(r * 1.1) + ' ' + rd(r * 0.1) + ' ' + rd(r * 1.8) + '" stroke="' + hair +
               '" stroke-width="' + rd(r * 0.42) + '" fill="none" stroke-linecap="round"/>';
    } else if (style === "ponytail") {
      back = '<path d="M' + rd(cx + r * 0.8) + ' ' + rd(cy - r * 0.5) + ' q' + rd(r * 0.9) + ' ' +
               rd(r * 0.5) + ' ' + rd(r * 0.45) + ' ' + rd(r * 1.5) + '" stroke="' + hair +
               '" stroke-width="' + rd(r * 0.5) + '" fill="none" stroke-linecap="round"/>';
      front = '<path d="M' + rd(cx - r) + ' ' + rd(cy - r * 0.15) + ' a' + rd(r) + ' ' + rd(r) +
               ' 0 0 1 ' + rd(r * 2) + ' 0 z" fill="' + hair + '"/>';
    } else if (style === "bob") {
      back = '<path d="M' + rd(cx - r * 1.1) + ' ' + rd(cy + r * 0.45) + ' v' + rd(-r * 0.6) +
               ' a' + rd(r * 1.1) + ' ' + rd(r * 1.1) + ' 0 0 1 ' + rd(r * 2.2) + ' 0 v' +
               rd(r * 0.6) + ' z" fill="' + hair + '"/>';
    } else if (style === "buzz") {
      back = '<path d="M' + rd(cx - r * 0.98) + ' ' + rd(cy - r * 0.2) + ' a' + rd(r * 0.98) + ' ' +
               rd(r * 0.98) + ' 0 0 1 ' + rd(r * 1.96) + ' 0 z" fill="' + hair + '"/>';
    } else { /* "short" */
      back = '<path d="M' + rd(cx - r) + ' ' + rd(cy - r * 0.22) + ' a' + rd(r) + ' ' + rd(r) +
               ' 0 0 1 ' + rd(r * 2) + ' 0 q' + rd(-r * 0.5) + ' ' + rd(-r * 0.3) + ' ' + rd(-r) +
               ' ' + rd(-r * 0.05) + ' q' + rd(-r * 0.5) + ' ' + rd(-r * 0.25) + ' ' + rd(-r) +
               ' ' + rd(r * 0.05) + ' z" fill="' + hair + '"/>';
    }
    return back + c(cx, cy, r, skin) + front +
      c(cx - r * 0.34, cy + r * 0.05, r * 0.12, P.ink) +
      c(cx + r * 0.34, cy + r * 0.05, r * 0.12, P.ink) +
      '<path d="M' + rd(cx - r * 0.26) + ' ' + rd(cy + r * 0.42) + ' q' + rd(r * 0.26) + ' ' +
        rd(r * 0.3) + ' ' + rd(r * 0.52) + ' 0" stroke="' + P.ink + '" stroke-width="' +
        Math.max(1.6, rd(r * 0.1)) + '" fill="none" stroke-linecap="round"/>';
  }

  /* Scale a group about a chosen anchor point. Used to enlarge the
     children without moving where they stand: the first drafts left the
     figures small against a lot of empty sky, which made the scenes
     read as decoration rather than as the sentence. Anchoring on the
     ground contact point keeps feet on the ground while heads rise. */
  function grow(inner, s, ax, ay) {
    return '<g transform="translate(' + rd(ax * (1 - s)) + ',' + rd(ay * (1 - s)) +
      ') scale(' + s + ')">' + inner + '</g>';
  }

  function svg(inner) {
    return '<svg class="sc-svg" viewBox="0 0 400 240" preserveAspectRatio="xMidYMid meet" ' +
      'focusable="false" aria-hidden="true">' + inner + '</svg>';
  }

  /* The rounded backdrop every scene sits on, so the seven scenes read
     as one set rather than seven unrelated drawings. */
  function backdrop(topFill, groundFill, groundY) {
    return '<rect x="0" y="0" width="400" height="240" rx="20" fill="' + topFill + '"/>' +
      '<path d="M0 ' + groundY + ' h400 v' + (240 - groundY - 20) +
      ' a20 20 0 0 1 -20 20 H20 a20 20 0 0 1 -20 -20 z" fill="' + groundFill + '"/>';
  }

  function clouds(x) {
    return c(x, 46, 17, P.white) + c(x + 22, 46, 23, P.white) + c(x + 44, 48, 15, P.white);
  }

  function grassTufts() {
    var g = "", pts = [[24, 168], [62, 176], [330, 160], [368, 170], [190, 164]];
    for (var i = 0; i < pts.length; i++) {
      var x = pts[i][0], y = pts[i][1];
      g += '<path d="M' + x + ' ' + y + ' l-5 -12 M' + x + ' ' + y + ' l0 -15 M' + x + ' ' + y +
        ' l5 -12" stroke="' + P.grassDeep + '" stroke-width="3" stroke-linecap="round" fill="none"/>';
    }
    return g;
  }

  /* =========================================================
     SCENES
     ========================================================= */
  var SCENES = {};

  /* ---- SOCCER — the WATCH demonstration, and the only animated scene.
     The leg and the ball are separate groups so CSS can swing one and
     arc the other. Under reduced motion they simply render in the
     finished position and the scene still makes sense. ---- */
  SCENES["soccer-kick"] = function () {
    return svg(
      backdrop(P.sky, P.grass, 158) +
      clouds(70) +
      '<path d="M0 158 q90 -34 190 -6 q110 30 210 6 H0 z" fill="' + P.grassDeep + '" opacity="0.5"/>' +
      /* goal */
      '<path d="M322 92 h70 v66 h-70 z" fill="' + P.white + '" opacity="0.18"/>' +
      '<g stroke="' + P.white + '" stroke-width="7" fill="none" stroke-linecap="round">' +
        '<path d="M322 92 v66 M392 92 v66 M322 92 h70"/></g>' +
      /* the mud the ball came off */
      '<ellipse cx="214" cy="198" rx="30" ry="7" fill="' + P.mud + '" opacity="0.35"/>' +
      /* player, facing right, mid-kick. NOT inside grow(): the CSS
         animation targets .sc-leg and .sc-ball by their own transforms,
         and nesting a scale above them is fine, but the ball must swing
         in the same coordinate space as the player, so both are grown
         together at the call site below. */
      '<g class="sc-player">' +
        limb("M176 176 L170 212", P.s4, 11) +
        '<path d="M163 212 h18" stroke="' + P.ink + '" stroke-width="8" stroke-linecap="round"/>' +
        /* A bent kicking leg: hip to knee to foot. Drawn as one path so
           it swings as a unit, and long enough to read as a leg rather
           than a stub when the animation rests at its start frame. */
        '<g class="sc-leg">' +
          limb("M182 168 L206 184 L230 176", P.s4, 11) +
          '<path d="M228 172 l16 6" stroke="' + P.ink + '" stroke-width="9" stroke-linecap="round"/>' +
        '</g>' +
        '<path d="M168 152 h26 v26 h-26 z" fill="' + P.ink + '"/>' +
        '<path d="M164 112 q17 -8 34 0 l5 44 h-44 z" fill="' + P.purple + '"/>' +
        '<path d="M176 112 h10 v18 h-10 z" fill="' + P.yellow + '"/>' +
        limb("M168 120 L146 142", P.s4, 9) +
        limb("M196 120 L216 106", P.s4, 9) +
        head(181, 92, 19, P.s4, P.h1, "curls") +
      '</g>' +
      /* ball */
      '<g class="sc-ball">' +
        '<circle cx="232" cy="192" r="15" fill="' + P.white + '" stroke="' + P.ink + '" stroke-width="2.4"/>' +
        '<path d="M232 181 l9 7 -4 11 h-10 l-4 -11 z" fill="' + P.ink + '"/>' +
        c(224, 200, 3.4, P.mud) + c(241, 197, 2.6, P.mud) + c(234, 204, 2, P.mud) +
      '</g>' +
      /* motion hint; CSS hides it under reduced motion */
      '<path class="sc-trail" d="M250 186 q38 -30 74 -12" stroke="' + P.ink +
        '" stroke-width="3" stroke-dasharray="5 9" fill="none" opacity="0.45" stroke-linecap="round"/>'
    );
  };

  /* The water sits LOW in the frame. An earlier draft put the stream at
     y=198 with the children drawn from y=130, so the two overlapped and
     the children read as standing waist-deep in the water instead of
     kneeling on the bank beside it. */
  function stream() {
    return '<path d="M0 212 q60 -14 130 -3 q80 12 150 2 q70 -10 120 -2 v13 a20 20 0 0 1 -20 20 H20 a20 20 0 0 1 -20 -20 z" fill="' + P.water + '"/>' +
      '<path d="M44 226 q22 -6 44 0" stroke="' + P.white + '" stroke-width="3" fill="none" opacity="0.6" stroke-linecap="round"/>' +
      '<path d="M168 232 q22 -6 44 0" stroke="' + P.white + '" stroke-width="3" fill="none" opacity="0.6" stroke-linecap="round"/>' +
      '<path d="M292 226 q22 -6 44 0" stroke="' + P.white + '" stroke-width="3" fill="none" opacity="0.6" stroke-linecap="round"/>';
  }

  /* A kneeling child, seen from the side: shin along the ground, thigh
     up to the hip, torso, head. `dir` is 1 facing right, -1 facing left.
     Kneeling is what these two are actually doing, and it keeps every
     figure clear of the water line. */
  function kneeler(x, y, dir, skin, hair, style, shirt) {
    var d = dir;
    return '<g>' +
      /* shin flat on the bank, then the thigh up to the hip */
      limb("M" + (x - 14 * d) + " " + y + " L" + (x + 16 * d) + " " + y, skin, 10) +
      limb("M" + (x + 16 * d) + " " + y + " L" + (x + 4 * d) + " " + (y - 26), skin, 10) +
      /* the forward knee, planted */
      limb("M" + (x + 2 * d) + " " + (y - 24) + " L" + (x + 24 * d) + " " + (y - 6) +
           " L" + (x + 34 * d) + " " + y, skin, 10) +
      /* torso */
      '<path d="M' + (x - 17) + ' ' + (y - 62) + ' q17 -8 34 0 l4 40 h-42 z" fill="' + shirt + '"/>' +
      head(x, y - 80, 17, skin, hair, style) +
      '</g>';
  }

  function rockPile(x, y) {
    return '<ellipse cx="' + x + '" cy="' + (y + 8) + '" rx="11" ry="7" fill="' + P.stone + '" stroke="' + P.ink + '" stroke-width="2"/>' +
      '<ellipse cx="' + (x + 22) + '" cy="' + (y + 4) + '" rx="9" ry="7" fill="' + P.gold + '" stroke="' + P.ink + '" stroke-width="2"/>' +
      '<ellipse cx="' + (x + 40) + '" cy="' + (y + 9) + '" rx="10" ry="6" fill="' + P.lavender + '" stroke="' + P.ink + '" stroke-width="2"/>' +
      '<ellipse cx="' + (x + 12) + '" cy="' + (y - 6) + '" rx="8" ry="6" fill="' + P.teal + '" stroke="' + P.ink + '" stroke-width="2"/>' +
      '<ellipse cx="' + (x + 31) + '" cy="' + (y - 8) + '" rx="7" ry="5" fill="' + P.red + '" stroke="' + P.ink + '" stroke-width="2"/>';
  }

  /* ---- STREAM A: studying the rocks where they lie ---- */
  SCENES["rocks-examine"] = function () {
    return svg(
      backdrop(P.sky, P.grass, 146) +
      clouds(286) +
      stream() +
      grow(
        rockPile(248, 186) +
        /* child kneeling with a magnifier held over the rocks */
        kneeler(96, 196, 1, P.s2, P.h4, "short", P.teal) +
        limb("M112 148 L162 170", P.s2, 9) +
        '<g><circle cx="176" cy="176" r="17" fill="' + P.skyDeep + '" opacity="0.8" stroke="' + P.ink + '" stroke-width="4"/>' +
        '<path d="M164 188 l-9 9" stroke="' + P.ink + '" stroke-width="6" stroke-linecap="round"/></g>' +
        /* second child kneeling, pointing at one rock */
        kneeler(196, 196, 1, P.s5, P.h5, "braids", P.orange) +
        limb("M212 148 L244 174", P.s5, 9) +
        '<path d="M244 174 l12 4" stroke="' + P.s5 + '" stroke-width="7" stroke-linecap="round"/>',
        1.24, 176, 198) +
      grassTufts()
    );
  };

  /* ---- STREAM B: gathering them into a bucket. The change from
     variant A is deliberately visible — fewer rocks on the ground,
     rocks now in the bucket — so the child can SEE that the verb
     changed what happened, not just read that it did. ---- */
  SCENES["rocks-collect"] = function () {
    return svg(
      backdrop(P.sky, P.grass, 146) +
      clouds(286) +
      stream() +
      /* only two rocks left on the ground: the change from variant A is
         VISIBLE, so the child sees that the verb changed what happened
         rather than only reading that it did */
      grow(
        '<ellipse cx="250" cy="192" rx="9" ry="6" fill="' + P.stone + '" stroke="' + P.ink + '" stroke-width="2"/>' +
        '<ellipse cx="270" cy="188" rx="7" ry="5" fill="' + P.lavender + '" stroke="' + P.ink + '" stroke-width="2"/>' +
        /* bucket, filling up */
        '<g>' +
          '<path d="M300 164 h44 l-7 36 h-30 z" fill="' + P.red + '" stroke="' + P.ink + '" stroke-width="3"/>' +
          '<path d="M300 164 q22 -17 44 0" stroke="' + P.ink + '" stroke-width="3" fill="none"/>' +
          c(312, 173, 6, P.gold) + c(326, 171, 6, P.teal) + c(336, 177, 5, P.lavender) +
        '</g>' +
        /* child standing, holding a rock up */
        '<g>' +
          limb("M106 172 L102 198", P.s2, 10) + limb("M120 172 L126 198", P.s2, 10) +
          '<path d="M96 190 h14 M118 190 h14" stroke="' + P.ink + '" stroke-width="7" stroke-linecap="round"/>' +
          '<path d="M94 122 q20 -9 36 0 l4 52 h-44 z" fill="' + P.teal + '"/>' +
          limb("M130 134 L160 148", P.s2, 9) +
          '<circle cx="168" cy="151" r="8" fill="' + P.gold + '" stroke="' + P.ink + '" stroke-width="2.4"/>' +
          head(112, 102, 18, P.s2, P.h4, "short") +
        '</g>' +
        /* child kneeling, dropping one into the bucket */
        kneeler(206, 196, 1, P.s5, P.h5, "braids", P.orange) +
        limb("M222 148 L284 158", P.s5, 9) +
        '<circle cx="292" cy="159" r="7" fill="' + P.stone + '" stroke="' + P.ink + '" stroke-width="2.2"/>',
        1.24, 176, 198) +
      grassTufts()
    );
  };

  /* ---- PORCH — a puppy and a ball in the gap underneath ---- */
  SCENES["dog-porch"] = function () {
    return svg(
      backdrop(P.yard, P.grass, 156) +
      /* house wall, roof, window, door */
      '<path d="M226 20 h154 v136 h-154 z" fill="' + P.cream + '"/>' +
      '<path d="M214 22 h178 l-12 -16 h-154 z" fill="' + P.red + '"/>' +
      '<rect x="258" y="48" width="40" height="40" rx="5" fill="' + P.skyDeep + '" stroke="' + P.ink + '" stroke-width="3"/>' +
      '<path d="M278 48 v40 M258 68 h40" stroke="' + P.ink + '" stroke-width="3"/>' +
      '<rect x="326" y="56" width="34" height="100" rx="4" fill="' + P.woodDeep + '"/>' +
      c(332, 108, 3.4, P.gold) +
      /* steps, with a real gap underneath */
      '<path d="M214 170 h96 v18 h-96 z" fill="' + P.woodDeep + '"/>' +
      '<path d="M222 188 h80 v-16 h-80 z" fill="' + P.ink + '" opacity="0.34"/>' +
      '<path d="M238 114 h72 v14 h-72 z" fill="' + P.wood + '" stroke="' + P.ink + '" stroke-width="3"/>' +
      '<path d="M226 128 h84 v14 h-84 z" fill="' + P.wood + '" stroke="' + P.ink + '" stroke-width="3"/>' +
      '<path d="M214 142 h96 v14 h-96 z" fill="' + P.wood + '" stroke="' + P.ink + '" stroke-width="3"/>' +
      /* the ball, in the shadow */
      '<g>' +
        '<circle cx="250" cy="180" r="12" fill="' + P.yellow + '" stroke="' + P.ink + '" stroke-width="2.4"/>' +
        '<path d="M240 175 q10 5 20 0 M240 185 q10 -5 20 0" stroke="' + P.white + '" stroke-width="2" fill="none"/>' +
        c(244, 185, 3, P.mud) + c(255, 174, 2.4, P.mud) +
      '</g>' +
      /* puppy, nose toward the gap, tail up */
      '<g>' +
        '<ellipse cx="140" cy="176" rx="40" ry="25" fill="' + P.h3 + '"/>' +
        limb("M118 196 L116 212", P.h3, 9) + limb("M160 196 L162 212", P.h3, 9) +
        '<path d="M176 162 q22 -18 16 -36" stroke="' + P.h3 + '" stroke-width="10" fill="none" stroke-linecap="round"/>' +
        '<ellipse cx="104" cy="168" rx="26" ry="22" fill="' + P.h3 + '"/>' +
        '<path d="M84 150 q-16 -6 -18 16 q14 8 22 -4 z" fill="' + P.h2 + '"/>' +
        '<ellipse cx="86" cy="180" rx="12" ry="9" fill="' + P.cream + '"/>' +
        c(79, 180, 5, P.ink) + c(98, 162, 3.4, P.ink) + c(114, 160, 3.4, P.ink) +
      '</g>' +
      grassTufts()
    );
  };

  /* shared lab furniture, so the two lab variants read as one room */
  function labRoom() {
    return backdrop(P.room, P.roomFloor, 186) +
      '<rect x="22" y="26" width="78" height="62" rx="8" fill="' + P.skyDeep + '" stroke="' + P.ink + '" stroke-width="3"/>' +
      '<path d="M61 26 v62 M22 57 h78" stroke="' + P.ink + '" stroke-width="3"/>' +
      '<rect x="274" y="36" width="104" height="8" rx="4" fill="' + P.woodDeep + '"/>' +
      '<rect x="286" y="12" width="16" height="24" rx="3" fill="' + P.green + '" stroke="' + P.ink + '" stroke-width="2.4"/>' +
      '<rect x="312" y="18" width="14" height="18" rx="3" fill="' + P.orange + '" stroke="' + P.ink + '" stroke-width="2.4"/>' +
      '<rect x="150" y="150" width="240" height="12" rx="5" fill="' + P.wood + '" stroke="' + P.ink + '" stroke-width="3"/>';
  }

  /* the same child in both lab variants: one scientist, two actions */
  function scientist(armPath) {
    return '<g>' +
      limb("M96 196 L92 224", P.s3, 11) + limb("M112 196 L120 224", P.s3, 11) +
      '<path d="M80 132 q24 -10 44 0 l6 66 h-56 z" fill="' + P.white + '" stroke="' + P.ink + '" stroke-width="2.6"/>' +
      '<path d="M96 132 h12 v22 h-12 z" fill="' + P.lavender + '"/>' +
      limb(armPath, P.s3, 9) +
      limb("M82 148 L70 176", P.s3, 9) +
      head(102, 110, 19, P.s3, P.h6, "bob") +
      '<g><rect x="84" y="103" width="36" height="14" rx="7" fill="' + P.skyDeep + '" opacity="0.85" stroke="' + P.ink + '" stroke-width="2.6"/>' +
      '<path d="M84 110 h-8 M120 110 h8" stroke="' + P.ink + '" stroke-width="2.6" stroke-linecap="round"/></g>' +
      '</g>';
  }

  /* ---- LAB A: reading the level. The water stays in the container. ---- */
  SCENES["water-measure"] = function () {
    return svg(
      labRoom() +
      '<g>' +
        '<path d="M210 78 h54 v64 a8 8 0 0 1 -8 8 h-38 a8 8 0 0 1 -8 -8 z" fill="' + P.white + '" stroke="' + P.ink + '" stroke-width="3.4"/>' +
        '<path d="M212 112 h50 v30 a8 8 0 0 1 -8 8 h-34 a8 8 0 0 1 -8 -8 z" fill="' + P.water + '"/>' +
        '<path d="M212 112 q13 -6 25 0 q12 6 25 0" stroke="' + P.waterDeep + '" stroke-width="3" fill="none"/>' +
        '<path d="M250 92 h14 M250 104 h14 M250 116 h14 M250 128 h14" stroke="' + P.ink + '" stroke-width="2.4" stroke-linecap="round"/>' +
        '<rect x="206" y="71" width="62" height="8" rx="4" fill="' + P.stone + '" stroke="' + P.ink + '" stroke-width="2.4"/>' +
      '</g>' +
      scientist("M124 146 L186 128") +
      /* the pointing finger, level with the water line */
      '<path d="M186 128 l14 -2" stroke="' + P.s3 + '" stroke-width="7" stroke-linecap="round"/>'
    );
  };

  /* ---- LAB B: tipping it out. The water LEAVES the container, and the
     container is visibly emptier than in variant A. ---- */
  SCENES["water-pour"] = function () {
    return svg(
      labRoom() +
      '<g>' +
        '<path d="M210 78 h54 v64 a8 8 0 0 1 -8 8 h-38 a8 8 0 0 1 -8 -8 z" fill="' + P.white + '" stroke="' + P.ink + '" stroke-width="3.4"/>' +
        '<path d="M212 134 h50 v8 a8 8 0 0 1 -8 8 h-34 a8 8 0 0 1 -8 -8 z" fill="' + P.water + '"/>' +
        '<path d="M250 92 h14 M250 104 h14 M250 116 h14 M250 128 h14" stroke="' + P.ink + '" stroke-width="2.4" stroke-linecap="round"/>' +
      '</g>' +
      /* tilted jug, and a stream of water falling from it */
      '<g>' +
        '<path d="M286 62 l40 -16 l22 42 l-40 16 z" fill="' + P.white + '" stroke="' + P.ink + '" stroke-width="3.4"/>' +
        '<path d="M300 90 l36 -14 l8 16 l-36 14 z" fill="' + P.water + '"/>' +
        '<path d="M288 60 q-16 8 -8 24" stroke="' + P.ink + '" stroke-width="3.4" fill="none"/>' +
        '<path d="M330 102 q-4 20 -24 28" stroke="' + P.water + '" stroke-width="9" fill="none" stroke-linecap="round"/>' +
      '</g>' +
      /* bowl catching it */
      '<path d="M276 128 h56 q-5 22 -28 22 q-23 0 -28 -22 z" fill="' + P.white + '" stroke="' + P.ink + '" stroke-width="3.2"/>' +
      '<path d="M284 138 h40 q-4 10 -20 10 q-16 0 -20 -10 z" fill="' + P.water + '"/>' +
      scientist("M124 140 L284 70")
    );
  };

  /* ---- TEAM — tired but proud. Deliberately a STATE, not an action:
     nobody is running, throwing or jumping. That is exactly the point
     the being-verb segment has to make. ---- */
  function teammate(x, skin, hair, style) {
    return '<g>' +
      limb("M" + (x - 7) + " 186 L" + (x - 10) + " 216", skin, 10) +
      limb("M" + (x + 7) + " 186 L" + (x + 10) + " 216", skin, 10) +
      '<path d="M' + (x - 16) + ' 216 h16 M' + (x + 4) + ' 216 h16" stroke="' + P.ink + '" stroke-width="7" stroke-linecap="round"/>' +
      '<path d="M' + (x - 18) + ' 134 q18 -8 36 0 l4 54 h-44 z" fill="' + P.purple + '"/>' +
      '<path d="M' + (x - 5) + ' 134 h10 v16 h-10 z" fill="' + P.yellow + '"/>' +
      '<path d="M' + (x - 14) + ' 162 h28" stroke="' + P.white + '" stroke-width="3" opacity="0.55"/>' +
      head(x, 114, 18, skin, hair, style) +
      '</g>';
  }

  SCENES["team-proud"] = function () {
    return svg(
      backdrop(P.sky, P.grass, 170) +
      clouds(296) +
      '<path d="M0 170 q100 -26 200 -4 q100 22 200 4 H0 z" fill="' + P.grassDeep + '" opacity="0.45"/>' +
      /* bench and water bottles: they have finished playing */
      '<rect x="20" y="186" width="104" height="10" rx="4" fill="' + P.wood + '" stroke="' + P.ink + '" stroke-width="2.6"/>' +
      '<path d="M30 196 v18 M114 196 v18" stroke="' + P.woodDeep + '" stroke-width="6" stroke-linecap="round"/>' +
      '<g><rect x="138" y="196" width="13" height="26" rx="5" fill="' + P.teal + '" stroke="' + P.ink + '" stroke-width="2.4"/>' +
      '<rect x="141" y="190" width="7" height="7" rx="2" fill="' + P.ink + '"/></g>' +
      '<g><rect x="156" y="200" width="13" height="22" rx="5" fill="' + P.orange + '" stroke="' + P.ink + '" stroke-width="2.4"/>' +
      '<rect x="159" y="194" width="7" height="7" rx="2" fill="' + P.ink + '"/></g>' +
      teammate(212, P.s1, P.h4, "ponytail") +
      teammate(268, P.s5, P.h5, "curls") +
      teammate(324, P.s2, P.h2, "short") +
      /* arms across shoulders, drawn last so they sit on top */
      '<path d="M228 140 q20 -13 28 0 M284 140 q20 -13 28 0" stroke="' + P.s3 +
        '" stroke-width="8" fill="none" stroke-linecap="round"/>'
    );
  };

  /* =========================================================
     THE DETECTIVE GUIDE
     Built from the pencil already used as the Practice mode icon, so
     the character belongs to this product rather than arriving from a
     clip-art set. Four moods share one silhouette: the child should
     recognise one character, not four.
     ========================================================= */
  var MOODS = {
    idle:  { brow: "M-7 -7 h10 M11 -7 h10",                mouth: "M-7 9 q8 6 16 0",    glass: true },
    think: { brow: "M-8 -9 l11 4 M11 -5 h10",              mouth: "M-5 10 q7 2 13 -2",  glass: true },
    happy: { brow: "M-8 -9 q5 -4 11 0 M10 -9 q5 -4 11 0",  mouth: "M-9 7 q10 11 20 0",  glass: false },
    cheer: { brow: "M-8 -10 q5 -4 11 0 M10 -10 q5 -4 11 0", mouth: "M-9 6 q10 13 20 0", glass: false }
  };

  function detective(mood) {
    var key = MOODS[mood] ? mood : "idle";
    var m = MOODS[key];
    return '<svg class="sc-detective sc-mood-' + key + '" viewBox="0 0 150 182" ' +
      'preserveAspectRatio="xMidYMid meet" focusable="false" aria-hidden="true">' +
      /* pencil barrel */
      '<path d="M42 54 h56 v92 q0 10 -10 10 h-36 q-10 0 -10 -10 z" fill="' + P.yellow + '" stroke="' + P.ink + '" stroke-width="4"/>' +
      '<path d="M56 56 v98 M84 56 v98" stroke="' + P.gold + '" stroke-width="3"/>' +
      /* sharpened tip */
      '<path d="M52 156 h36 l-18 22 z" fill="' + P.s2 + '" stroke="' + P.ink + '" stroke-width="4" stroke-linejoin="round"/>' +
      '<path d="M64 170 h12 l-6 8 z" fill="' + P.ink + '"/>' +
      /* collar + eraser */
      '<path d="M42 40 h56 v16 h-56 z" fill="' + P.stone + '" stroke="' + P.ink + '" stroke-width="4"/>' +
      '<path d="M46 18 h48 q6 0 6 8 v14 h-60 v-14 q0 -8 6 -8 z" fill="' + P.pink + '" stroke="' + P.ink + '" stroke-width="4"/>' +
      /* detective hat */
      '<g><path d="M46 22 q24 -20 48 0 z" fill="' + P.h2 + '" stroke="' + P.ink + '" stroke-width="4" stroke-linejoin="round"/>' +
      '<path d="M30 22 h80 q4 0 4 5 t-4 5 h-80 q-4 0 -4 -5 t4 -5 z" fill="' + P.h2 + '" stroke="' + P.ink + '" stroke-width="4"/>' +
      '<path d="M48 13 h44" stroke="' + P.red + '" stroke-width="5" stroke-linecap="round"/></g>' +
      /* face */
      '<g transform="translate(70 92)">' +
        '<circle cx="-12" cy="0" r="6.6" fill="' + P.white + '" stroke="' + P.ink + '" stroke-width="2.6"/>' +
        '<circle cx="12" cy="0" r="6.6" fill="' + P.white + '" stroke="' + P.ink + '" stroke-width="2.6"/>' +
        '<circle class="sc-pupil" cx="-11" cy="1" r="2.9" fill="' + P.ink + '"/>' +
        '<circle class="sc-pupil" cx="13" cy="1" r="2.9" fill="' + P.ink + '"/>' +
        '<path d="' + m.brow + '" stroke="' + P.ink + '" stroke-width="3" fill="none" stroke-linecap="round" transform="translate(-2 -4)"/>' +
        '<path d="' + m.mouth + '" stroke="' + P.ink + '" stroke-width="3" fill="none" stroke-linecap="round" transform="translate(-1 6)"/>' +
      '</g>' +
      /* arms */
      '<path d="M42 104 q-20 6 -24 26" stroke="' + P.ink + '" stroke-width="5" fill="none" stroke-linecap="round"/>' +
      '<path d="M98 104 q20 2 26 18" stroke="' + P.ink + '" stroke-width="5" fill="none" stroke-linecap="round"/>' +
      /* magnifier raised while working, a pennant while celebrating, so
         the mood reads at a glance and not by colour alone */
      (m.glass
        ? '<g><circle cx="126" cy="130" r="16" fill="' + P.skyDeep + '" opacity="0.8" stroke="' + P.ink + '" stroke-width="4"/>' +
          '<path d="M115 142 l-8 8" stroke="' + P.ink + '" stroke-width="6" stroke-linecap="round"/></g>'
        : '<g><path d="M112 128 l10 -18 10 18 z" fill="' + P.yellow + '" stroke="' + P.ink + '" stroke-width="3.4" stroke-linejoin="round"/>' +
          '<circle cx="122" cy="136" r="5" fill="' + P.gold + '" stroke="' + P.ink + '" stroke-width="3"/></g>') +
      '</svg>';
  }

  /* =========================================================
     PUBLIC API
     ========================================================= */
  window.SS_SCENES = {
    /* Returns an SVG string, or "" for an unknown id. A missing scene
       must never throw: a step with no illustration is legitimate —
       independent practice is deliberately unillustrated. */
    get: function (id) {
      var fn = SCENES[id];
      return fn ? fn() : "";
    },
    has: function (id) { return Object.prototype.hasOwnProperty.call(SCENES, id); },
    ids: function () { return Object.keys(SCENES); },
    detective: detective,
    moods: function () { return Object.keys(MOODS); }
  };
})();
