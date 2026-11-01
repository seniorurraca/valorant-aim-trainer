import * as THREE from 'three';
import { randomBetween } from './spawn.js';

const MIN_STRAFE_TIME = 0.3;
const MAX_STRAFE_TIME = 1.2;

export function createStrafer({ speed, minX, maxX }) {
  let direction = 1;
  let timeLeft = 0;

  return function strafe(dt, position) {
    timeLeft -= dt;
    if (timeLeft <= 0) {
      direction = Math.random() < 0.5 ? -1 : 1;
      timeLeft = randomBetween(MIN_STRAFE_TIME, MAX_STRAFE_TIME);
    }
    if (position.x <= minX) direction = 1;
    if (position.x >= maxX) direction = -1;
    position.x = THREE.MathUtils.clamp(position.x + direction * speed * dt, minX, maxX);
  };
}
