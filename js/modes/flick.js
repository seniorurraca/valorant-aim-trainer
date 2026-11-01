import * as THREE from 'three';
import { createTargetSet } from '../engine/targets.js';

const DISTANCE = 15;
const RADIUS = 0.3;
const MAX_YAW = THREE.MathUtils.degToRad(50);
const MAX_PITCH = THREE.MathUtils.degToRad(20);
const EYE = new THREE.Vector3(0, 1.6, 0);

const randomBetween = (max) => (Math.random() * 2 - 1) * max;

function randomPosition() {
  const direction = new THREE.Vector3(0, 0, -1)
    .applyEuler(new THREE.Euler(randomBetween(MAX_PITCH), randomBetween(MAX_YAW), 0, 'YXZ'));
  return direction.multiplyScalar(DISTANCE).add(EYE);
}

export function createFlick(scene) {
  const targets = createTargetSet(scene);
  const spawn = () => targets.add(RADIUS, randomPosition());

  return {
    kind: 'click',
    targets,
    start: spawn,
    hit(mesh) {
      targets.remove(mesh);
      spawn();
    },
  };
}
