# SETUP.md: do this once, in this order (for a beginner)

You need three terminal windows later. A "terminal" is the black window where you type commands (PowerShell on Windows).

## A. Install (once)
1. Install **Node.js LTS** from nodejs.org (it includes `npm`). Install **Git** from git-scm.com. Restart your PC if a command is not found afterwards.
2. Make sure Ollama is running with your coding model. If you have not already, make the 48k version:
   `ollama create qwen3-coder-48k -f Modelfile` (the Modelfile has two lines: `FROM qwen3-coder:30b` and `PARAMETER num_ctx 49152`).
3. Unzip this folder somewhere simple, for example `E:\Projects\fps-game`. Avoid very long paths.

## B. Prepare the project (once)
Open PowerShell **inside the folder** (in File Explorer: click the address bar, type `powershell`, press Enter), then run these one by one:

```
npm install three
npm install -D vite playwright
npx playwright install chromium
git init
npm run save
```
- `three` is the 3D library. `vite` shows your game in the browser. `playwright` lets the AI test the game by itself (optional but strongly recommended).
- `npm run save` asks for a short note and makes your first save point. If it says "Please tell me who you are", run
  `git config --global user.name "Your name"` and `git config --global user.email "you@example.com"`, then `npm run save` again.

## C. Every work session: three terminals
1. **Terminal 1 (the game):** `npm run dev`. Leave it running. Open the address it prints (usually http://localhost:5173) in your browser.
2. **Terminal 2 (the AI):** `opencode`. This is where you type your prompts.
3. **Terminal 3 (spare):** for git commands.

## D. How you work with the AI (the loop)
1. In OpenCode, say: `Read AGENTS.md and TASKS.md. Then tell me the plan for step 1 in 5 lines.` (OpenCode starts in Plan mode.)
2. Read the plan. If it is fine, press **Tab** to switch to Build mode and say `go`.
3. The AI writes the code and runs `npm run build` (and `npm run check`). It must end with `DONE (verified: ...)` or `NOT DONE`.
4. **You test in the browser** with the sentence it gives you. The game refreshes by itself.
5. If something is wrong: copy the red error box text (bottom of the page) into OpenCode, or describe what feels wrong in plain words.
6. If it is good: in Terminal 3 type `npm run save`, write a short note ("step 1 done"). Then tick the box in TASKS.md.
7. Next step. Start a fresh chat with `/new` between steps, so the AI is not slowed by a long history.

## E. Rules that save you hours
- **One step per chat.** Do not ask for "the whole game".
- **Save after every good step** (`npm run save`). If the AI breaks things, go back with `npm run undo`.
- **To change the feel, use words:** "the recoil is too weak", "the headshot sound is dull". The AI changes `src/tuning.js` numbers.
- **If the AI loops or says DONE without proof**, stop it, `/new`, and paste the error. After 3 failed tries on one problem, stop and ask for help (a stronger model is better for the hard bug than more attempts).
- **Assets:** only add files to `assets/` after listing them in `ASSETS.md` with their license. Needed if you sell the game.

## F. Git in 2 commands (that is all you need)
Git is a "save game" system for your project. You never type git yourself, you use two shortcuts in Terminal 3:
- `npm run save`: makes a save point of everything as it is now. It asks for a short note. Do it after each step that works.
- `npm run undo`: throws away everything since the last save point (including new files the AI made). It asks you to type YES first.
Rule of thumb: **save when it works, undo when the AI made a mess.** You lose at most the last step.

## G. Sending me the project state (so I know exactly what happened)
1. In Terminal 3 type `npm run share`. It creates one file, `project-state.txt`, in the project folder.
2. Attach that single file to your message to me, and say in a sentence what you were doing and what went wrong.
3. It contains: the save-point history, what changed since the last save, whether `npm run build` passes (with the error if not),
   the file list, and the full text of every source file. I will see the exact state without you copying anything.
4. If the AI behaved strangely (looped, claimed DONE falsely), also attach the OpenCode session text, as you did before.
5. It is safe to share: it skips `node_modules`, builds and your `assets/` files. Do not put passwords or keys in the project.

## H. If `npm run check` fails to start
It needs `npm run dev` running in another terminal, and the `playwright` install from step B. If it still fails, skip it: the build check and the red error box on the page are enough to start.
