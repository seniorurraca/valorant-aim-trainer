import * as THREE from 'three';
import { createEnvironment, createCamera, fitCamera } from '../engine/scene.js';

const WIDTH = 320;
const HEIGHT = 180;
const PREVIEW_FOV = 55;
const WARMUP_TIME = 1.5;
const WARMUP_STEP = 0.1;

function renderPreview(renderer, camera, mode) {
  const scene = new THREE.Scene();
  scene.add(createEnvironment());
  const instance = mode.create(scene);
  instance.start?.();
  for (let elapsed = 0; elapsed < WARMUP_TIME; elapsed += WARMUP_STEP) instance.update?.(WARMUP_STEP);
  renderer.render(scene, camera);
  return renderer.domElement.toDataURL();
}

export function renderModePreviews(modes) {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(WIDTH, HEIGHT);
  const camera = createCamera();
  fitCamera(camera, WIDTH / HEIGHT, PREVIEW_FOV);

  const previews = Object.fromEntries(Object.entries(modes)
    .map(([id, mode]) => [id, renderPreview(renderer, camera, mode)]));

  renderer.dispose();
  renderer.forceContextLoss();
  return previews;
}
