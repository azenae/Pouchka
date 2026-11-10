// main.js: renderer, scene, game loop. Gameplay lives in other files (player.js, weapon.js, ...).
import * as THREE from 'three';
import { TUNING } from './tuning.js';

const container = document.getElementById('game');

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b0f1a);
scene.fog = new THREE.Fog(0x0b0f1a, 25, 90);

const camera = new THREE.PerspectiveCamera(TUNING.camera.fov, 1, 0.05, 200);
camera.position.set(0, TUNING.player.eyeHeight, 8);

scene.add(new THREE.HemisphereLight(0xbfd4ff, 0x1a1f2e, 1.2));
const sun = new THREE.DirectionalLight(0xffffff, 1.6);
sun.position.set(10, 20, 6);
scene.add(sun);

// Placeholder room: a floor and a few boxes to look at.
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(80, 80),
  new THREE.MeshStandardMaterial({ color: 0x2a3348, roughness: 0.9 })
);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x56648a, roughness: 0.7 });
const boxes = [
  { x: -6, z: -4, w: 4, h: 2, d: 4 },
  { x: 5, z: -8, w: 3, h: 3, d: 3 },
  { x: 0, z: -16, w: 12, h: 4, d: 2 },
];
for (const b of boxes) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(b.w, b.h, b.d), boxMaterial);
  mesh.position.set(b.x, b.h / 2, b.z);
  scene.add(mesh);
}

function resize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);
resize();

const clock = new THREE.Clock();
function loop() {
  const dt = Math.min(clock.getDelta(), 0.05); // seconds, capped so a lag spike cannot break physics
  // Systems get updated here, e.g. player.update(dt), weapon.update(dt).
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}
loop();

export { scene, camera, renderer };
