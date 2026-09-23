import * as THREE from 'three';

// Basic Setup
const canvas = document.createElement('canvas');
canvas.classList.add('webgl-bg');

// Force background positioning directly in JavaScript
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100vw';
canvas.style.height = '100vh';
canvas.style.zIndex = '0';
canvas.style.pointerEvents = 'none';

document.body.prepend(canvas);

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x111a1b, 0.028);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 7;
camera.position.y = 0.2;

const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

const atlas = new THREE.Group();
atlas.position.set(2.8, -0.35, 0);
scene.add(atlas);

const mesh = new THREE.Mesh(
  new THREE.IcosahedronGeometry(4.1, 2),
  new THREE.MeshBasicMaterial({ color: 0x8ef2de, wireframe: true, transparent: true, opacity: 0.38 })
);
atlas.add(mesh);

const core = new THREE.Mesh(
  new THREE.IcosahedronGeometry(1.8, 1),
  new THREE.MeshBasicMaterial({ color: 0xc7f36b, wireframe: true, transparent: true, opacity: 0.2 })
);
atlas.add(core);

const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0xc7f36b, wireframe: true, transparent: true, opacity: 0.42 });
const orbit = new THREE.Mesh(new THREE.TorusGeometry(3.2, 0.012, 8, 96), orbitMaterial);
orbit.rotation.set(0.75, 0.25, 0.3);
atlas.add(orbit);

const orbitTwo = new THREE.Mesh(new THREE.TorusGeometry(2.55, 0.008, 8, 96), new THREE.MeshBasicMaterial({ color: 0x8ef2de, wireframe: true, transparent: true, opacity: 0.3 }));
orbitTwo.rotation.set(-0.45, 0.7, -0.2);
atlas.add(orbitTwo);

const nodes = [
  { position: [3.2, 0.7, 0.2], color: 0xc7f36b },
  { position: [-2.4, 1.7, 0.8], color: 0x8ef2de },
  { position: [0.3, -2.8, 1.2], color: 0xc7f36b },
  { position: [1.8, 1.9, -1.1], color: 0x8ef2de }
];
nodes.forEach(({ position, color }) => {
  const node = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 12, 12),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.95 })
  );
  node.position.set(...position);
  atlas.add(node);
});

const grid = new THREE.GridHelper(14, 14, 0x8ef2de, 0x8ef2de);
grid.material.transparent = true;
grid.material.opacity = 0.06;
grid.position.set(0, -4.2, -1.5);
grid.rotation.x = 0.1;
atlas.add(grid);

// Handle Window Resizing
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation Loop
const startTime = performance.now();
const pointer = new THREE.Vector2();
window.addEventListener('pointermove', (event) => {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

function animate() {
  const elapsedTime = (performance.now() - startTime) / 1000;
  
  atlas.rotation.x += (pointer.y * 0.08 - atlas.rotation.x) * 0.025;
  atlas.rotation.y += (elapsedTime * 0.08 + pointer.x * 0.16 - atlas.rotation.y) * 0.025;
  mesh.rotation.x = elapsedTime * 0.045;
  mesh.rotation.y = elapsedTime * 0.065;
  core.rotation.x = -elapsedTime * 0.07;
  core.rotation.y = elapsedTime * 0.1;
  orbit.rotation.z = elapsedTime * 0.05;
  orbitTwo.rotation.z = -elapsedTime * 0.07;
  atlas.position.y = -0.35 + window.scrollY * -0.0006;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();