
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { gsap } from "gsap";


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(25, 25, 35);


const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("canvas"),
  alpha: true,
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0xd3d3d3, 1);
renderer.shadowMap.enabled = true; // enable shadows
document.body.appendChild(renderer.domElement);


const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableZoom = true;


const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 20, 10);
directionalLight.castShadow = true;
scene.add(directionalLight);


const grassMaterial = new THREE.MeshLambertMaterial({ color: "green" });
const roadMaterial = new THREE.MeshLambertMaterial({ color: "gray" });
const buildingMaterialBlue = new THREE.MeshPhongMaterial({ color: 0x256cb3 });
const buildingMaterialWhite = new THREE.MeshPhongMaterial({ color: 0xffffff });
const buildingMaterialYellow = new THREE.MeshStandardMaterial({ color: 0xffff00 });
const buildingMaterialBrown = new THREE.MeshPhongMaterial({ color: 0x421d1a });


const groundGrass = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), grassMaterial);
groundGrass.rotation.x = -Math.PI / 2;
groundGrass.receiveShadow = true;
scene.add(groundGrass);


const roadVertical = new THREE.Mesh(new THREE.PlaneGeometry(5, 40), roadMaterial);
roadVertical.rotation.x = -Math.PI / 2;
roadVertical.position.set(0, 0.01, 0);
scene.add(roadVertical);

const roadBottomHorizontal = new THREE.Mesh(new THREE.PlaneGeometry(18, 5), roadMaterial);
roadBottomHorizontal.rotation.x = -Math.PI / 2;
roadBottomHorizontal.position.set(-11, 0.01, -6);
scene.add(roadBottomHorizontal);

const roadAboveNewBuilding = new THREE.Mesh(new THREE.PlaneGeometry(18, 5), roadMaterial);
roadAboveNewBuilding.rotation.x = -Math.PI / 2;
roadAboveNewBuilding.position.set(11, 0.01, -6);
scene.add(roadAboveNewBuilding);


function createCube(x, z, width, height, depth, material) {
  const cube = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
  cube.position.set(x, height / 2, z);
  cube.castShadow = true;
  cube.receiveShadow = true;
  scene.add(cube);
  return cube;
}

const firstBuilding = createCube(-5, 14, 6, 3, 6, buildingMaterialBlue);
addLabel(firstBuilding, "Institute Of Technology");

const secondBuilding = createCube(-5, 2, 6, 3, 6, buildingMaterialWhite);
addLabel(secondBuilding, "IT Support");

const thirdBuilding = createCube(-5, -10, 6, 3, 6, buildingMaterialYellow);
addLabel(thirdBuilding, "Objekt 305");

const rightCornerBuilding = createCube(10, 0, 6, 3, 6, buildingMaterialBrown);
addLabel(rightCornerBuilding, "Lounge");


function addLabel(building, text) {
  
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = 1024;
  canvas.height = 256;

  
  context.font = "bold 80px Arial";
  context.fillStyle = "black";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(text, canvas.width / 2, canvas.height / 2);

  
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;

  
  const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(spriteMaterial);


  sprite.scale.set(10, 3, 1);


  sprite.position.set(0, 3.5, 0);
  building.add(sprite);
}


const sphereMaterial = new THREE.MeshStandardMaterial({ color: "red" });
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), sphereMaterial);
sphere.position.set(0, 0.5, 0);
sphere.castShadow = true;
scene.add(sphere);


gsap.to(sphere.position, {
  duration: 20,
  repeat: -1,
  ease: "linear",
  keyframes: [
    { x: 0, z: 15 },
    { x: -5, z: 15 },
    { x: 0, z: 12 },
    { x: 0, z: 2 },
    { x: -5, z: 2 },
    { x: 0, z: 2 },
    { x: 0, z: -15 },
    { x: -5, z: -15 },
    { x: 0, z: -12 },
    { x: 0, z: 0 },
  ],
});


function animate() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
