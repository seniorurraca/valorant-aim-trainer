import * as THREE from 'three';
import { VALORANT } from '../config/valorant.js';

const EYE_HEIGHT = 1.6;
const ROOM_SIZE = 60;
const ROOM_HEIGHT = 20;

const verticalFov = (horizontalFovDeg, aspect) => THREE.MathUtils.radToDeg(
  2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(horizontalFovDeg) / 2) / aspect));

function buildRoom() {
  const room = new THREE.Group();
  const walls = new THREE.Mesh(
    new THREE.BoxGeometry(ROOM_SIZE, ROOM_HEIGHT, ROOM_SIZE),
    new THREE.MeshStandardMaterial({ color: 0x2a3440, side: THREE.BackSide }));
  walls.position.y = ROOM_HEIGHT / 2;
  room.add(walls, new THREE.GridHelper(ROOM_SIZE, ROOM_SIZE, 0x3d4d5c, 0x33414e));
  return room;
}

export function createScene(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);

  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xffffff, 0x445566, 1.5));
  scene.add(buildRoom());

  const camera = new THREE.PerspectiveCamera(70, 1, 0.1, 200);
  camera.rotation.order = 'YXZ';
  camera.position.set(0, EYE_HEIGHT, 0);

  function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.fov = verticalFov(VALORANT.horizontalFov, camera.aspect);
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  return { scene, camera, render: () => renderer.render(scene, camera) };
}
