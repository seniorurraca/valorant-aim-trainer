import * as THREE from 'three';
import { EYE_HEIGHT } from '../config/world.js';
import { createTargetSet } from '../engine/targets.js';
import { randomPointOnWall } from '../engine/spawn.js';

const DISTANCE = 12;
const AREA = { distance: DISTANCE, halfWidth: 8, minHeight: 0.6, maxHeight: 5 };
const CENTER = new THREE.Vector3(0, EYE_HEIGHT, -DISTANCE);
const RADIUS = 0.4;

export function createSpidershot(scene) {
  const targets = createTargetSet(scene);
  let centerNext = true;

  function spawn() {
    targets.add(RADIUS, centerNext ? CENTER : randomPointOnWall(AREA));
    centerNext = !centerNext;
  }

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
