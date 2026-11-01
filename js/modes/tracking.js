import * as THREE from 'three';
import { createTargetSet } from '../engine/targets.js';

const DISTANCE = 12;
const RADIUS = 0.5;
const MAX_X = 6;
const SPEED = 4;
const MIN_STRAFE_TIME = 0.3;
const MAX_STRAFE_TIME = 1.2;

const randomStrafeTime = () => MIN_STRAFE_TIME + Math.random() * (MAX_STRAFE_TIME - MIN_STRAFE_TIME);

export function createTracking(scene) {
  const targets = createTargetSet(scene);
  let target = null;
  let direction = 1;
  let strafeLeft = 0;

  return {
    kind: 'tracking',
    targets,
    start() {
      target = targets.add(RADIUS, new THREE.Vector3(0, 1.6, -DISTANCE));
    },
    update(dt) {
      strafeLeft -= dt;
      if (strafeLeft <= 0) {
        direction = Math.random() < 0.5 ? -1 : 1;
        strafeLeft = randomStrafeTime();
      }
      if (Math.abs(target.position.x) >= MAX_X) direction = -Math.sign(target.position.x);
      target.position.x = THREE.MathUtils.clamp(target.position.x + direction * SPEED * dt, -MAX_X, MAX_X);
    },
  };
}
