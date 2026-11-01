import * as THREE from 'three';

export const randomBetween = (min, max) => min + Math.random() * (max - min);

export const randomPointOnWall = ({ distance, halfWidth, minHeight, maxHeight }) =>
  new THREE.Vector3(randomBetween(-halfWidth, halfWidth), randomBetween(minHeight, maxHeight), -distance);
