import { createTargetSet } from '../engine/targets.js';
import { randomPointInView } from '../engine/spawn.js';

const VIEW = { distance: 12, maxYaw: 40, maxPitch: 20 };
const START_RADIUS = 0.6;
const LIFETIME = 2;
const SPAWN_INTERVAL = 0.6;

export function createReflex(scene) {
  const targets = createTargetSet(scene);
  let untilSpawn = 0;
  let escaped = 0;

  function spawn() {
    const target = targets.add(START_RADIUS, randomPointInView(VIEW));
    target.userData.age = 0;
  }

  function shrink(target, dt) {
    target.userData.age += dt;
    const lifeLeft = 1 - target.userData.age / LIFETIME;
    if (lifeLeft > 0) {
      target.scale.setScalar(START_RADIUS * lifeLeft);
      return;
    }
    targets.remove(target);
    escaped += 1;
  }

  return {
    kind: 'click',
    targets,
    update(dt) {
      untilSpawn -= dt;
      if (untilSpawn <= 0) {
        spawn();
        untilSpawn = SPAWN_INTERVAL;
      }
      [...targets.meshes].forEach((target) => shrink(target, dt));
    },
    hit: (mesh) => targets.remove(mesh),
    summary: () => `Escapados: ${escaped}`,
  };
}
