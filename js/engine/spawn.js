import * as THREE from 'three';
import { EYE_HEIGHT } from '../config/world.js';

const EYE = new THREE.Vector3(0, EYE_HEIGHT, 0);
const FORWARD = new THREE.Vector3(0, 0, -1);
const toRadians = THREE.MathUtils.degToRad;

export const randomBetween = (min, max) => min + Math.random() * (max - min);

export function pointAhead(distance, yawDeg = 0, pitchDeg = 0) {
  return FORWARD.clone()
    .applyEuler(new THREE.Euler(toRadians(pitchDeg), toRadians(yawDeg), 0, 'YXZ'))
    .multiplyScalar(distance)
    .add(EYE);
}

export const randomPointInView = ({ distance, maxYaw, maxPitch }) =>
  pointAhead(distance, randomBetween(-maxYaw, maxYaw), randomBetween(-maxPitch, maxPitch));
