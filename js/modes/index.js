import { createGridshot } from './gridshot.js';
import { createFlick } from './flick.js';
import { createTracking } from './tracking.js';

export const MODES = {
  gridshot: { label: 'Gridshot', create: createGridshot },
  flick: { label: 'Flick (1 target)', create: createFlick },
  tracking: { label: 'Tracking (strafe)', create: createTracking },
};
