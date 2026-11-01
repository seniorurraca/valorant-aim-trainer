import { createGridshot } from './gridshot.js';
import { createSpidershot } from './spidershot.js';
import { createFlick } from './flick.js';
import { createReflex } from './reflex.js';
import { createTracking } from './tracking.js';
import { createBotMode } from './bots.js';

export const MODES = {
  gridshot: {
    label: 'Gridshot', scoreUnit: 'hits', create: createGridshot,
    description: '3 targets en una grilla. Velocidad entre objetivos cercanos.',
  },
  spidershot: {
    label: 'Spidershot', scoreUnit: 'hits', create: createSpidershot,
    description: 'Alterna entre el centro y un punto al azar de la pared.',
  },
  flick: {
    label: 'Flick', scoreUnit: 'hits', create: createFlick,
    description: 'Un target pequeño a la vez, en cualquier parte de la pared.',
  },
  reflex: {
    label: 'Reflex', scoreUnit: 'hits', create: createReflex,
    description: 'Círculos que se achican hasta desaparecer. Dispara rápido.',
  },
  tracking: {
    label: 'Tracking', scoreUnit: '%', create: createTracking,
    description: 'Mantén la mira sobre un target que hace strafe.',
  },
  bots: {
    label: 'Bots', scoreUnit: 'kills', create: createBotMode({ strafing: false }),
    description: 'Bots quietos con daño de Vandal: cabeza 1 tiro, cuerpo 4.',
  },
  botsStrafe: {
    label: 'Bots strafe', scoreUnit: 'kills', create: createBotMode({ strafing: true }),
    description: 'Bots que hacen ADAD. Busca el headshot.',
  },
};
