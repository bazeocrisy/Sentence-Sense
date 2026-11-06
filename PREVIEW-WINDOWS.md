# Preview PR #4 (Build 1.9.0) on Windows

This puts the preview in a **separate folder**, `C:\Sentence-Sense-preview`. Your existing checkout (for example `C:\Sentence-Sense`) is never touched: no branch switch, no stash, no pull.

## 1. Prerequisites (one time)

Open **Windows PowerShell** and check both tools:

```powershell
git --version
```
```powershell
node --version
```

- **Git for Windows**: any recent version.
- **Node.js**: any current LTS version. The preview server uses only Node's built-in modules, so you don't need `npm install`.
- Internet access is needed only for the clone. The app also loads its fonts from Google Fonts and falls back to system fonts without a connection.

If either command says "not recognized", install it from git-scm.com or nodejs.org, then open a **new** PowerShell window.

## 2. Get the preview (one time)

```powershell
git clone --branch claude/write-strong-sentence https://github.com/bazeocrisy/Sentence-Sense.git C:\Sentence-Sense-preview
```

Confirm you have the latest PR #4 commit. Compare the first line with the newest commit listed on the PR's Commits tab:

```powershell
git -C C:\Sentence-Sense-preview log -1 --oneline
```

To pick up later changes to PR #4:

```powershell
git -C C:\Sentence-Sense-preview pull
```

## 3. Start the server

```powershell
Set-Location C:\Sentence-Sense-preview
```
```powershell
node verification\serve.js . 8347
```

You should see:

```
serving C:\Sentence-Sense-preview
listening on 127.0.0.1:8347  (this computer only)
open http://127.0.0.1:8347/   Stop with Ctrl+C.
```

Leave this window open while you use the preview. If port 8347 is busy, use another number, such as `8350`, in the command and the address.

## 4. Confirm it's Build 1.9.0

1. Open **http://127.0.0.1:8347/** in your browser.
2. Scroll to the bottom. The footer must read **Sentence Sense — Build 1.9.0**. Under it you'll see **LOCAL · loaded** and the time, which shows you're on the local copy.
3. Optional check from a **second** PowerShell window:

   ```powershell
   (Invoke-WebRequest -UseBasicParsing http://127.0.0.1:8347/js/app.js).Content | Select-String 'Build 1.9.0'
   ```

   It should print the line `const BUILD_NUMBER = "Build 1.9.0";`.

If the footer shows 1.8.0, you opened the live site or an old tab. Check that the address starts with `http://127.0.0.1`.

## 5. Stop the server

Click the server's PowerShell window and press **Ctrl+C**. The preview page stops loading. Writing saved in the browser stays on that computer, tied to that address.

## 6. Optional: try it on a phone or tablet on the same Wi-Fi

By default the server accepts connections **only from this computer**. I checked that in a Linux container, not on Windows. To let a phone connect, start it this way instead:

```powershell
node verification\serve.js . 8347 0.0.0.0
```

1. The window should say `listening on 0.0.0.0:8347 (other devices on your network can connect)`.
2. If Windows Firewall asks about Node.js, allow it on **Private networks only**. Your home Wi-Fi must be set to Private.
3. Find this computer's address:

   ```powershell
   ipconfig
   ```

   Look under your Wi-Fi adapter for **IPv4 Address**, for example `192.168.1.23`.
4. On the phone, open `http://192.168.1.23:8347/` using your address. Confirm the footer says Build 1.9.0.

**Not verified on your network.** Firewall settings, a "public" network profile, or a router that isolates Wi-Fi devices can block this. If the phone can't connect, use the computer for the pilot.

While running this way, anyone on your Wi-Fi can read the app's files. The server refuses the `.git` folder. Press **Ctrl+C** when you're done.

Writing saved on the phone stays on the phone. The For grown-ups page shows only writing saved in the browser you're using.

## 7. Remove the preview later

Stop the server first. Then, in a PowerShell window that is **not** inside the preview folder:

```powershell
Remove-Item -Recurse -Force C:\Sentence-Sense-preview
```

This deletes only the preview folder. Writing saved in the browser for `127.0.0.1:8347` stays until you delete it in For grown-ups or clear site data.
