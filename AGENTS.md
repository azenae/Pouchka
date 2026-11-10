# Project rules (read this first, every session)

## Project
- A 3D first-person shooter that runs in the browser. Stack: JavaScript (ES modules), Three.js, Vite. Nothing else.
- Modes: (1) Arena: waves of enemies, roguelite upgrades, high score. (2) Duel: 1v1 vs a bot, round based.
- The feel is the product: weighty weapons, fast dynamic movement, and strong feedback on every hit, headshot and kill.
- The user is a beginner with no coding knowledge. Explain what you do in plain words. Reply in the language the user writes in.
- Read GAME.md (the design) and TASKS.md (the steps) at the start of a task. Do not re-read them later in the same task.

## Start of a session
- If the user's message is not a clear request ("ok", "hello"), answer only "Ready. Which step?" and do nothing else.
- Do not create or edit files before the user says "go".
- Work on ONE step of TASKS.md at a time, the one the user names (or the first unchecked one). Never start the next step by yourself.

## Modes (OpenCode)
- Plan mode cannot write files. If a write is refused, STOP and say: "I am in Plan mode. Press Tab to switch to Build mode, then say go."
- A plan is 5 lines max: which files you create or change, and what the user must test.

## Files and structure
- One file per system, in `src/`. Small files (under about 200 lines). Never put everything in `main.js`.
  main.js: renderer, scene, loop. player.js: movement + camera. weapon.js: shooting, recoil, ammo. targets.js / enemies.js,
  waves.js, upgrades.js, juice.js (screen shake, hit-stop, particles), audio.js (synth sounds), hud.js (DOM overlay), world.js (map).
- ALL gameplay numbers live in `src/tuning.js` (speeds, recoil, damage, timings, shake strength...). Never hard-code a number
  that the user may want to tweak. When the user says "more recoil" or "faster slide", change `tuning.js` only.
- Max 3 new files per task. Do not create near-duplicate files.
- Use `edit` for changes. Use `write` only for a new file or after reading the file you replace. Never rewrite a file you did not read.

## Code rules (Three.js)
- Import like this: `import * as THREE from 'three';`. Never load Three.js from a CDN and never use a global `THREE`.
- Not allowed (removed or old APIs): `THREE.Geometry` (use `BufferGeometry` or `BoxGeometry` etc.), `renderer.outputEncoding`
  (use `renderer.outputColorSpace = THREE.SRGBColorSpace`), `physicallyCorrectLights`. If unsure an API exists, say so and ask; do not guess.
- Game loop: `requestAnimationFrame`, `dt = Math.min(clock delta, 0.05)`. Always multiply movement by `dt`.
- Physics: no physics library. Use simple boxes (AABB) for walls and floor, and `THREE.Raycaster` for bullets (hitscan).
- Enemies and weapons are placeholder shapes (boxes, spheres, capsules made from them). Do not generate textures or models with code.
- Sounds: synthesize with the Web Audio API in `audio.js` (oscillators and noise). No audio files until the user adds some.
- Do not add npm packages. Do not touch `package.json` dependencies without asking.
- Never use `eval`, `innerHTML` with game data, or network calls.

## Feel rules (what "done" means)
- Every shot must give: muzzle flash, sound, camera kick, weapon kick. Every hit: hit marker. Headshot: different sound AND red marker AND a bigger kick.
  Every kill: kill sound, burst of particles, score pop-up. These are not extras, they are the game.
- Keep effects short and strong (50 to 200 ms). Tune numbers in `tuning.js`, do not hide effects behind conditions.

## Verifying your work
1. After every change run `npm run build`. If it fails, read the error, fix it, run it again. It catches syntax and import errors.
2. If `npm run check` exists, run it. It opens the game in a hidden browser and prints console errors.
3. If neither can run, say so. Do NOT claim the game works.
4. Never repeat the same failing command. After 3 failed attempts on one problem, STOP and report NOT DONE with what you tried.
5. The final message starts with exactly one of:
   - `DONE (verified: <command run and what it returned>)`
   - `NOT DONE (<reason>)`
   Then one line: "Test this in the browser: <what the user should do and what they should see/hear>".
   A passing build proves the code compiles, not that it feels right. Say what you could not check.
6. At the end of a task, tick the step in TASKS.md and add one line under "Notes" if you made a decision.

## When a call fails
- Never repeat the same call. Change the arguments or the tool, or stop.
- "file already exists": use `edit`. Do not delete or recreate it.
- Shell is Windows PowerShell: `&&` does NOT work (use `;`), `cd` does not persist.
- Never list folders recursively. Use a narrow glob such as `src/*.js`.
- Browser dev server: the user runs `npm run dev` in another terminal. Do not start it yourself unless asked.

## Hard rules
- Never edit anything in `scripts/` or `package.json` scripts: they are the user's tools (save, undo, share, check).
- Never delete or rename files. If a file must go, ask the user.
- Never run git commands that discard changes. The user makes the commits.
- Assets go in `assets/`, and every asset must be listed in ASSETS.md with its license. Never use an asset that is not listed.
