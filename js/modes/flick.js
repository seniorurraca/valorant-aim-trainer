import { createTargetSet } from '../engine/targets.js';
import { randomPointInView } from '../engine/spawn.js';

const VIEW = { distance: 15, maxYaw: 50, maxPitch: 20 };
const RADIUS = 0.3;

export function createFlick(scene) {
  const targets = createTargetSet(scene);
  const spawn = () => targets.add(RADIUS, randomPointInView(VIEW));

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
