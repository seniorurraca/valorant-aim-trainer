import * as THREE from 'three';
import { EYE_HEIGHT } from '../config/world.js';
import { createTargetSet } from '../engine/targets.js';
import { createStrafer } from '../engine/strafe.js';

const DISTANCE = 12;
const RADIUS = 0.5;
const MAX_X = 6;
const SPEED = 4;

export function createTracking(scene) {
  const targets = createTargetSet(scene);
  const strafe = createStrafer({ speed: SPEED, minX: -MAX_X, maxX: MAX_X });
  let target = null;

  return {
    kind: 'tracking',
    targets,
    start() {
      target = targets.add(RADIUS, new THREE.Vector3(0, EYE_HEIGHT, -DISTANCE));
    },
    update: (dt) => strafe(dt, target.position),
  };
}
