/* =========================================================
   Sentence Sense — builds js/data/wordlist.js (Build 1.9.1)

   Source: the SCOWL word lists by Kevin Atkinson, as packaged in the npm
   module wordlist-english@1.2.1 (MIT). Levels 10-40 of the "english" and
   "american" lists: common words a third grader is likely to write. Plus
   every word the app itself offers (prompts, word banks, starters, the
   Fix it lesson), so the app never questions its own suggestions.

     npm pack wordlist-english@1.2.1   (into an empty folder; extract it)
     node verification/build-wordlist.js <extracted package folder>

   The list ships inside the app. No writing is sent anywhere.
   ========================================================= */
const fs = require("fs");
const path = require("path");

const pkg = process.argv[2];
if (!pkg) { console.error("usage: node verification/build-wordlist.js <wordlist-english package dir>"); process.exit(1); }
const ROOT = path.join(__dirname, "..");

const words = new Set();
for (const lang of ["english", "american"]) {
  for (const lvl of ["10", "20", "35", "40"]) {
    JSON.parse(fs.readFileSync(path.join(pkg, lang + "-words-" + lvl + ".json"), "utf8"))
      .forEach(w => { if (/^[a-z]+$/.test(w)) words.add(w); });
  }
}

/* The app's own words. */
global.window = {};
require(path.join(ROOT, "js/data/write-content.js"));
require(path.join(ROOT, "js/data/fixit-content.js"));
const own = JSON.stringify([window.SS_WRITE_CONTENT, window.SS_FIXIT_CONTENT]).toLowerCase().match(/[a-z]+/g) || [];
let added = 0;
own.forEach(w => { if (!words.has(w)) { words.add(w); added++; } });

const copyright = fs.readFileSync(path.join(pkg, "Copyright"), "utf8").replace(/\*\//g, "* /");
const list = Array.from(words).sort();
const out = "/* =========================================================\n" +
  "   Sentence Sense — common English words (generated; do not edit)\n" +
  "   Built by verification/build-wordlist.js from SCOWL (wordlist-english@1.2.1,\n" +
  "   english + american, levels 10-40) plus the app's own words.\n" +
  "   " + list.length + " words. Used only to ASK \"Is it spelled the way you want?\".\n\n" +
  "   SCOWL copyright and permission notice (required in all copies):\n\n" +
  copyright.split("\n").map(l => "   " + l).join("\n") +
  "\n   ========================================================= */\n" +
  "window.SS_WORDS = new Set(" + JSON.stringify(list.join(" ")) + ".split(\" \"));\n";
fs.writeFileSync(path.join(ROOT, "js/data/wordlist.js"), out);
console.log("wrote js/data/wordlist.js: " + list.length + " words (" + added + " from the app) · " + Math.round(out.length / 1024) + " KB");
