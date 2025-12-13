import * as THREE from "three";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 6, 14);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight(0xffffff, 0.6));

const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(60, 60),
  new THREE.MeshStandardMaterial({ color: 0x222222 })
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -1.5;
scene.add(ground);

const cubes = [];
const cubeCount = 20;

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

for (let i = 0; i < cubeCount; i++) {
  const w = rand(0.6, 2.2);
  const h = rand(0.6, 2.2);
  const d = rand(0.6, 2.2);

  const geometry = new THREE.BoxGeometry(w, h, d);

  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(Math.random(), Math.random(), Math.random()),
  });

  const cube = new THREE.Mesh(geometry, material);

  cube.position.set(rand(-8, 8), rand(-0.5, 5), rand(-8, 8));
  cube.userData.size = { width: w, height: h, depth: d };

  scene.add(cube);
  cubes.push(cube);
}

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const infoEl = document.getElementById("info");

let selectedCube = null;
let previousEmissive = null;

function updateMouseFromEvent(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  const y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
  mouse.set(x, y);
}

function setSelectedCube(cube) {
  if (selectedCube) {
    selectedCube.material.emissive.setHex(previousEmissive ?? 0x000000);
  }

  selectedCube = cube;
  previousEmissive = cube.material.emissive.getHex();
  cube.material.emissive.setHex(0x333333);

  const p = cube.position;
  const s = cube.userData.size;

  infoEl.innerHTML = `
    <div><b>Position</b></div>
    <div class="mono">x: ${p.x.toFixed(2)}</div>
    <div class="mono">y: ${p.y.toFixed(2)}</div>
    <div class="mono">z: ${p.z.toFixed(2)}</div>
    <br/>
    <div><b>Size</b></div>
    <div class="mono">width: ${s.width.toFixed(2)}</div>
    <div class="mono">height: ${s.height.toFixed(2)}</div>
    <div class="mono">depth: ${s.depth.toFixed(2)}</div>
  `;
}

window.addEventListener("click", (event) => {
  updateMouseFromEvent(event);

  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(cubes);

  if (hits.length > 0) {
    setSelectedCube(hits[0].object);
  } else {
    if (selectedCube) {
      selectedCube.material.emissive.setHex(previousEmissive ?? 0x000000);
      selectedCube = null;
    }
    infoEl.textContent =
      "No object selected. Click a cube to see its information here.";
  }
});

function animate() {
  requestAnimationFrame(animate);

  for (const c of cubes) {
    c.rotation.y += 0.002;
  }

  renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
