/* Minimal static server for the audit harness. */
const http = require("http");
const fs = require("fs");
const path = require("path");

/* Build 1.4.0 — ROOT is resolved to an absolute path BEFORE use.
   Previously it was used raw: path.join(".", "/index.html") yields the
   relative "index.html", while the traversal guard compared it against
   path.resolve(".") — an absolute path — so every request under the
   documented `node verification/serve.js . 8347` returned 403 and the
   harness could not be served at all. Any relative root failed; only an
   absolute one worked. Resolve once, compare like with like. */
const ROOT = path.resolve(process.argv[2] || path.join(__dirname, ".."));
const PORT = Number(process.argv[3] || 8347);
/* Build 1.9.0: bind address. Default 127.0.0.1 = this computer only.
   Pass 0.0.0.0 as the third argument to let a phone on the same Wi-Fi
   connect (every file in ROOT becomes readable on the network while the
   server runs; stop it with Ctrl+C when done). */
const HOST = process.argv[4] || "127.0.0.1";

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".png": "image/png",
  ".md": "text/plain; charset=utf-8"
};

http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  if (p === "/") p = "/index.html";
  const file = path.join(ROOT, p);
  if (!file.startsWith(ROOT)) { res.writeHead(403); res.end(); return; }
  /* Never serve the git folder, even on a local network. */
  if (path.relative(ROOT, file).split(path.sep)[0].toLowerCase() === ".git") { res.writeHead(404); res.end("not found"); return; }
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404); res.end("not found"); return; }
    res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream" });
    res.end(buf);
  });
}).listen(PORT, HOST, function () {
  const a = this.address();
  console.log("serving " + ROOT);
  console.log("listening on " + a.address + ":" + a.port +
    (HOST === "127.0.0.1" ? "  (this computer only)" : "  (other devices on your network can connect)"));
  console.log("open http://127.0.0.1:" + PORT + "/   Stop with Ctrl+C.");
});
