# Sentence Sense — verification harness (Build 1.4.0)

Two files. Neither is part of the site; nothing in `index.html` loads them.

| File | Role |
|---|---|
| `serve.js` | Minimal static server for the harness |
| `guard.js`  | The Build 1.4.0 audit harness — 234 checks |

## Run

```powershell
cd C:\Sentence-Sense
node verification/serve.js . 8347      # terminal 1
node verification/guard.js ./out       # terminal 2
```

`guard.js` needs **puppeteer-core** and a local **Chrome**. Neither is a project
dependency: the shipped site has no package manifest and no build system. Install
puppeteer-core outside the repository and point at it:

```powershell
$env:PUPPETEER = "C:\somewhere\node_modules\puppeteer-core"
$env:CHROME    = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$env:BASE      = "http://127.0.0.1:8347/"
```

Output: `<out>/results.json`, `<out>/responsive.json`, `<out>/screenshots/`.
Exit code is 0 only when every check passes.

## What it guards

1. load integrity and the build number
2. Home: exactly four skills, and none of the forbidden furniture
3. the shared Skill screen across all four skills: wordmark, skill icon, three activity cards, exactly one way home, and an unavailable activity that is labelled and is NOT a control
4. Verb LEARN, all four states
5. Verb PRACTICE: 20 questions, 4 stages, both shuffles
6. feedback escalation and the third-attempt reveal
7. mission retirement and query-route removal
8. state leakage between skills and between entries
9. keyboard, focus and accessibility
10. the plain to marked exact-match rule, including stranded punctuation
11. responsive: 9 viewports, overflow, false bottoms, tiny type

## Harness rules learned the hard way

- **Choice buttons are shuffled.** Select by `dataset.ci`, never by position and
  never by rendered text.
- **`.ss-words` is `align-items:flex-end`**, so a marked chip and a plain word
  have different `top` values on one visual line. Count row wraps by BOTTOMS.
- **Do not force-enable an advance button** to jump to a later state. That skips
  the state the next screen depends on. Walk the product.
- **Measure focus through the keyboard.** A programmatic `.focus()` does not
  reliably match `:focus-visible`. The first version of check 9.6 used one and
  passed a button that had no visible focus ring at all. A test that cannot fail
  is not evidence.
- **`serve.js` needs an absolute ROOT.** Fixed in 1.4.0 — it previously returned
  403 for every request under its own documented command.
