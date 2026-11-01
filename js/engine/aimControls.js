import * as THREE from 'three';
import { VALORANT } from '../config/valorant.js';

const MAX_PITCH = Math.PI / 2 - 0.001;

export function createAimControls(camera, canvas, getSensitivity) {
  let rawInput = false;

  const isLocked = () => document.pointerLockElement === canvas;

  document.addEventListener('mousemove', (e) => {
    if (!isLocked()) return;
    const radiansPerCount = THREE.MathUtils.degToRad(getSensitivity() * VALORANT.degreesPerCount);
    camera.rotation.y -= e.movementX * radiansPerCount;
    camera.rotation.x = THREE.MathUtils.clamp(camera.rotation.x - e.movementY * radiansPerCount, -MAX_PITCH, MAX_PITCH);
  });

  async function lock() {
    const request = canvas.requestPointerLock({ unadjustedMovement: true });
    rawInput = Boolean(request);
    if (!request) return;
    try {
      await request;
    } catch {
      rawInput = false;
      await canvas.requestPointerLock();
    }
  }

  return {
    lock,
    isLocked,
    unlock: () => document.exitPointerLock(),
    isRawInput: () => rawInput,
    reset: () => camera.rotation.set(0, 0, 0),
  };
}
