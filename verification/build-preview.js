/* =========================================================
   Sentence Sense — single-file preview bundle (Build 1.9.1)

   Builds ONE self-contained HTML file from the current checkout, for a
   hosted preview that must not touch production (GitHub Pages serves only
   the production branch). It inlines the stylesheet, every script and the
   classroom photograph. Source files are not modified.

     node verification/build-preview.js <out.html>

   The host wraps the page in its own <html>/<head>/<body>, so the output
   starts with a <title> and has no document tags of its own.
   ========================================================= */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const out = process.argv[2];
if (!out) { console.error("usage: node verification/build-preview.js <out.html>"); process.exit(1); }

const read = p => fs.readFileSync(path.join(ROOT, p), "utf8");
const html = read("index.html");
const hero = "data:image/jpeg;base64," + fs.readFileSync(path.join(ROOT, "assets/images/sentence-sense-hero.jpg")).toString("base64");

const bodyStart = html.indexOf("<body>"), bodyEnd = html.lastIndexOf("</body>");
if (bodyStart < 0 || bodyEnd < 0) throw new Error("index.html has no <body>");
let body = html.slice(bodyStart + "<body>".length, bodyEnd);

/* Inline each local script, in the same order. */
body = body.replace(/<script src="([^"]+)"><\/script>/g, (m, src) => {
  let js = read(src);
  if (src === "js/app.js") js = js.replace('"assets/images/sentence-sense-hero.jpg"', JSON.stringify(hero));
  if (/<\/script/i.test(js)) throw new Error(src + " contains </script");
  return "<script>/* " + src + " */\n" + js + "\n</script>";
});
if (/<script src=/.test(body)) throw new Error("a script was not inlined");

const css = read("css/styles.css").replace('url("../assets/images/sentence-sense-hero.jpg")', 'url("' + hero + '")');
const fonts = (html.match(/<link href="https:\/\/fonts\.googleapis\.com[^>]+>/) || [""])[0];
const build = (read("js/app.js").match(/BUILD_NUMBER = "([^"]+)"/) || [])[1];

const page = [
  "<title>Sentence Sense Preview</title>",
  '<meta name="description" content="Preview of Sentence Sense ' + build + '. Not the live site.">',
  fonts,
  "<style>\n" + css + "\n</style>",
  body
].join("\n");

fs.writeFileSync(out, page);
console.log("wrote " + out + " (" + Math.round(page.length / 1024) + " KB) · " + build);
