# TASKS.md: one step at a time

Rule: the user says "go step N". The AI does only that step, runs `npm run build`, then the user tests in the browser and commits with git.
Tick a box only when the user confirms the test passed.

## Phase 1: the feel (training room, no enemies yet)
- [ ] 1. Boot: scene with a floor, a few boxes, lights, a camera, window resize, game loop. TEST: `npm run dev` shows a lit room, no red error box.
- [ ] 2. Look and walk: click to capture the mouse, mouse look, WASD, jump, gravity, can't walk through boxes (AABB). TEST: you can walk around and jump on a box.
- [ ] 3. Fast movement: acceleration/friction, sprint (Shift), crouch (C), slide (sprint then crouch), air control. TEST: a slide gives a speed burst; jumping out of it keeps speed.
- [ ] 4. Weapon basics: simple gun model in view, left click shoots (full auto), ammo counter, reload (R), hitscan ray. TEST: ammo goes down, reload refills it.
- [ ] 5. Weapon feel: camera recoil + drift + recovery, gun kick, sway, bob, ADS (right click). TEST: firing for 2 s climbs the view; ADS is steadier.
- [ ] 6. Targets: dummies with a body and a head hitbox, damage numbers in the console, die at 0 health. TEST: headshot does double damage.
- [ ] 7. Shot and hit juice: muzzle flash, tracer, synthesized shot sound, hit marker, headshot red marker + ping sound, damage numbers on screen. TEST: headshots clearly feel different.
- [ ] 8. Kill juice: kill sound, particle burst, hit-stop, small slow-mo on headshot kills, kill feed, score pop-up. TEST: a headshot kill feels great.
- [ ] 9. Tune the feel: the user plays 5 minutes and lists what feels off; the AI changes only `tuning.js` values.

## Phase 2: Arena mode
- [ ] 10. Enemy that chases the player and damages on contact (runner). TEST: it follows you and hurts.
- [ ] 11. Player health, damage feedback (red edges, shake), death and restart with R.
- [ ] 12. Wave manager: waves with rising enemy count, short break between waves, wave counter on screen.
- [ ] 13. Score + combo multiplier + high score saved in the browser (localStorage).
- [ ] 14. Second enemy type (shooter with projectiles) and third (tank).

## Phase 3: Roguelite
- [ ] 15. Upgrade data file (`upgrades.js`): 8 simple upgrades with a name, a description and a numeric effect.
- [ ] 16. Between waves: pick 1 of 3 random upgrades; effects apply immediately.
- [ ] 17. Run summary screen: wave reached, kills, headshots, score, best score.

## Phase 4: Duel mode (vs bot)
- [ ] 18. Symmetric duel map and a main menu to choose Arena or Duel.
- [ ] 19. Bot that moves, aims with limited accuracy and shoots; round logic, first to 7.

## Phase 5: later (not now)
- Real assets, multiple weapons, sound files, polish, sharing build (itch.io), then decide if online multiplayer is worth it.

## Notes (decisions and known problems, keep it short)
-
