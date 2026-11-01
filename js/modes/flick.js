import { createTargetSet } from '../engine/targets.js';
import { randomPointOnWall } from '../engine/spawn.js';

const AREA = { distance: 15, halfWidth: 10, minHeight: 0.6, maxHeight: 6 };
const RADIUS = 0.3;

export function createFlick(scene) {
  const targets = createTargetSet(scene);
  const spawn = () => targets.add(RADIUS, randomPointOnWall(AREA));

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
