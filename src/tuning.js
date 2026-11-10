// tuning.js: EVERY number you may want to tweak lives here. Units: metres, seconds, degrees.
// To change the feel, ask the AI: "more recoil", "slide is too weak"... and it edits only this file.

export const TUNING = {
  camera: {
    fov: 85,              // normal field of view
    adsFov: 62,           // field of view while aiming down sights
    mouseSensitivity: 0.0022,
  },

  player: {
    eyeHeight: 1.7,
    crouchEyeHeight: 1.0,
    walkSpeed: 6,
    sprintSpeed: 9.5,
    crouchSpeed: 3,
    groundAccel: 60,      // how fast you reach full speed
    groundFriction: 10,   // how fast you stop
    airAccel: 18,         // steering in the air
    gravity: 28,          // stronger than real life = snappy jumps
    jumpSpeed: 9,
    slideBoost: 4,        // extra speed when a slide starts
    slideFriction: 2.5,   // low = long slide
    slideMinSpeed: 6,     // below this the slide ends
    slideDuration: 1.1,
  },

  weapon: {
    damage: 24,
    headshotMultiplier: 2,
    roundsPerMinute: 700,
    magazineSize: 30,
    reloadTime: 2.0,
    emptyReloadTime: 2.6,
    hipSpread: 2.2,       // degrees of random bullet spread when not aiming
    adsSpread: 0.25,
    adsTime: 0.2,         // seconds to aim down sights
    maxRange: 150,
  },

  recoil: {
    // Camera kick per shot, in degrees.
    verticalKick: 0.9,
    horizontalKick: 0.35, // random left/right drift
    buildUpShots: 8,      // recoil grows over this many shots, then levels off
    buildUpMultiplier: 1.6,
    recoveryRate: 6,      // how fast the view comes back when you stop firing
    adsMultiplier: 0.7,   // recoil is smaller while aiming
    // Gun model (what you see in your hands).
    gunKickBack: 0.06,    // metres the gun jumps back per shot
    gunKickReturn: 14,    // how fast it returns
    swayAmount: 0.02,     // gun lag when turning
    swaySmooth: 10,
    bobAmount: 0.012,     // gun bob when walking
  },

  juice: {
    // Everything that makes hits feel good. Times in seconds.
    hitMarkerTime: 0.12,
    headshotMarkerTime: 0.2,
    hitStopHeadshot: 0.06,        // game freezes this long on a headshot
    slowMoHeadshotKill: 0.25,     // slow motion duration on a headshot kill
    slowMoScale: 0.35,            // 0.35 = 35 % speed
    shotShake: 0.02,
    killShake: 0.06,
    damageShake: 0.12,
    shotFovKick: 1.2,             // degrees added for a moment on each shot
    damageNumberTime: 0.7,
    killParticles: 28,
    muzzleFlashTime: 0.04,
    tracerTime: 0.06,
  },

  audio: {
    masterVolume: 0.5,
    headshotPingHz: 1800,
    hitHz: 900,
    killHz: 520,
  },

  enemies: {
    runner: { health: 60, speed: 5.5, contactDamage: 10, headRadius: 0.22 },
    shooter: { health: 80, speed: 3.5, projectileDamage: 8, fireInterval: 1.4 },
    tank: { health: 260, speed: 2.4, contactDamage: 25 },
  },

  waves: {
    firstWaveCount: 5,
    countGrowth: 1.35,
    speedGrowthPerWave: 0.03,
    breakTime: 4,
  },

  score: {
    kill: 100,
    headshotBonus: 50,
    comboWindow: 3,       // seconds to keep a combo alive
    comboMax: 8,
  },
};
