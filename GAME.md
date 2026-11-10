# GAME.md: design (the AI reads this, the user edits it)

## One-line pitch
Fast, weighty first-person shooter in the browser. Every shot, headshot and kill must feel great.

## Pillars
1. Weapon feel: heavy and deliberate like Tarkov (recoil, weight, ADS), but the game stays arcade and readable.
2. Movement: fast and dynamic like Apex or Deadlock (momentum, slide, air control).
3. Reward: constant feedback. The player should feel a dopamine hit on every hit, headshot and kill.

## Modes
### Arena (build first)
- One arena. Waves of enemies with rising count and speed. Score chase with a combo multiplier. High score saved in the browser.
- Roguelite: between waves the player picks 1 upgrade out of 3 (more damage, faster slide, bigger magazine, etc.).
- Run ends when the player dies. Show score and best score. Restart in one key.

### Duel (build after Arena)
- 1v1 against a bot in a symmetric map. Round based, first to 7. Same weapon for both, no upgrades.
- Online multiplayer is NOT in scope until the single-player game is fun. It is a separate, large project.

## Weapon feel targets (numbers go in `src/tuning.js`)
- Weight: the gun lags slightly behind the camera when turning (sway) and bobs when moving.
- ADS (aim down sights): takes about 0.15 to 0.25 s, reduces sway and recoil, narrows FOV a little.
- Recoil: each shot kicks the camera up with a small random sideways drift. The camera recovers slowly if the player stops firing.
  The gun model also kicks back and returns. Recoil grows over the first shots of a burst and then levels off.
- Fire modes: start with one rifle, full auto. Reload takes about 2 s. Empty reload is slower than a tactical reload.
- Hitscan: bullets are instant rays from the camera. Spread grows while moving and shooting hip-fire.

## Movement targets
- Walk, sprint, crouch, jump. Ground acceleration and friction (not instant stop).
- Slide: sprint then crouch gives a speed burst that decays. Jump out of a slide keeps the speed.
- Air control: the player can steer a little in the air. Gravity strong enough that jumps feel snappy, not floaty.
- Later (only after the basics feel good): wall-jump, mantle ledges.

## Feedback ("juice") checklist
- Shot: muzzle flash, tracer line, shot sound, camera kick, gun kick, small FOV kick.
- Hit: white hit marker, hit sound, enemy flash, damage number.
- Headshot: red hit marker, distinct high "ping" sound, bigger damage number, short hit-stop (about 60 ms), small slow-motion.
- Kill: kill sound, burst of particles, kill feed line, score pop-up, combo counter goes up.
- Damage taken: red screen edge, directional indicator, camera shake.
- All of it tunable in `tuning.js`.

## Enemies (Arena)
- Placeholder shapes: a body and a separate head sphere (the head is the headshot hitbox, 2x damage).
- Types, one at a time: runner (fast, low health), shooter (keeps distance), tank (slow, high health).

## Art and sound
- Placeholder boxes and synthesized sounds first. Real assets come later and are listed in ASSETS.md with their license.
- The game may be sold later: only use assets whose license allows commercial use.

## Out of scope for now
Multiplayer, matchmaking, accounts, a store page, multiple maps, multiple weapons (until one weapon feels great).
