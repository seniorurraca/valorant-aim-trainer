import * as THREE from 'three';
import { VALORANT } from '../config/valorant.js';
import { EYE_HEIGHT } from '../config/world.js';

const ROOM_SIZE = 60;
const ROOM_HEIGHT = 20;
const FRONT_WALL_FACE = 5;

const verticalFov = (horizontalFovDeg, aspect) => THREE.MathUtils.radToDeg(
  2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(horizontalFovDeg) / 2) / aspect));

function buildRoom() {
  const room = new THREE.Group();
  const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x2a3440, side: THREE.BackSide });
  const targetWallMaterial = new THREE.MeshStandardMaterial({ color: 0x46596b, side: THREE.BackSide });
  const faceMaterials = Array.from({ length: 6 }, (_, face) =>
    (face === FRONT_WALL_FACE ? targetWallMaterial : wallMaterial));
  const walls = new THREE.Mesh(new THREE.BoxGeometry(ROOM_SIZE, ROOM_HEIGHT, ROOM_SIZE), faceMaterials);
  walls.position.y = ROOM_HEIGHT / 2;
  room.add(walls, new THREE.GridHelper(ROOM_SIZE, ROOM_SIZE, 0x3d4d5c, 0x33414e));
  return room;
}

export function createEnvironment() {
  const environment = new THREE.Group();
  environment.add(new THREE.HemisphereLight(0xffffff, 0x445566, 1.5), buildRoom());
  return environment;
}

export function createCamera() {
  const camera = new THREE.PerspectiveCamera(70, 1, 0.1, 200);
  camera.rotation.order = 'YXZ';
  camera.position.set(0, EYE_HEIGHT, 0);
  return camera;
}

export function fitCamera(camera, aspect, horizontalFov = VALORANT.horizontalFov) {
  camera.aspect = aspect;
  camera.fov = verticalFov(horizontalFov, aspect);
  camera.updateProjectionMatrix();
}

export function createScene(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);

  const scene = new THREE.Scene();
  scene.add(createEnvironment());
  const camera = createCamera();

  function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    fitCamera(camera, window.innerWidth / window.innerHeight);
  }
  window.addEventListener('resize', resize);
  resize();

  return { scene, camera, render: () => renderer.render(scene, camera) };
}
