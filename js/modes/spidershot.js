import { createTargetSet } from '../engine/targets.js';
import { pointAhead, randomPointInView } from '../engine/spawn.js';

const DISTANCE = 12;
const VIEW = { distance: DISTANCE, maxYaw: 45, maxPitch: 20 };
const CENTER = pointAhead(DISTANCE);
const RADIUS = 0.4;

export function createSpidershot(scene) {
  const targets = createTargetSet(scene);
  let centerNext = true;

  function spawn() {
    targets.add(RADIUS, centerNext ? CENTER : randomPointInView(VIEW));
    centerNext = !centerNext;
  }

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
