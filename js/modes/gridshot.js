import * as THREE from 'three';
import { createTargetSet } from '../engine/targets.js';

const DISTANCE = 12;
const SPACING = 1.6;
const RADIUS = 0.45;
const ACTIVE_TARGETS = 3;

const CELLS = [-2, -1, 0, 1, 2].flatMap((x) => [0, 1, 2].map((y) =>
  new THREE.Vector3(x * SPACING, 1.6 + (y - 1) * SPACING, -DISTANCE)));

export function createGridshot(scene) {
  const targets = createTargetSet(scene);

  function spawn() {
    const free = CELLS.filter((cell) => !targets.meshes.some((m) => m.position.equals(cell)));
    targets.add(RADIUS, free[Math.floor(Math.random() * free.length)]);
  }

  return {
    kind: 'click',
    targets,
    start: () => Array.from({ length: ACTIVE_TARGETS }, spawn),
    hit(mesh) {
      targets.remove(mesh);
      spawn();
    },
  };
}
