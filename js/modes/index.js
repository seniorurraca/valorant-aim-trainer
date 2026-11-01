import { createGridshot } from './gridshot.js';
import { createSpidershot } from './spidershot.js';
import { createFlick } from './flick.js';
import { createReflex } from './reflex.js';
import { createTracking } from './tracking.js';
import { createBotMode } from './bots.js';

export const MODES = {
  gridshot: { label: 'Gridshot', scoreUnit: 'hits', create: createGridshot },
  spidershot: { label: 'Spidershot (centro ↔ lados)', scoreUnit: 'hits', create: createSpidershot },
  flick: { label: 'Flick (1 target)', scoreUnit: 'hits', create: createFlick },
  reflex: { label: 'Reflex (círculos que se achican)', scoreUnit: 'hits', create: createReflex },
  tracking: { label: 'Tracking (strafe)', scoreUnit: '%', create: createTracking },
  bots: { label: 'Bots (rango)', scoreUnit: 'kills', create: createBotMode({ strafing: false }) },
  botsStrafe: { label: 'Bots strafe (ADAD)', scoreUnit: 'kills', create: createBotMode({ strafing: true }) },
};
