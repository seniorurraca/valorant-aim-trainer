import { createScene } from './engine/scene.js';
import { createAimControls } from './engine/aimControls.js';
import { createSession } from './game/session.js';
import { submitScore } from './game/highScores.js';
import { MODES } from './modes/index.js';
import { initSensitivityPanel } from './ui/sensitivityPanel.js';
import { initFileGuide } from './ui/fileGuide.js';
import { initModeCards } from './ui/modeCards.js';
import { renderModePreviews } from './ui/modePreview.js';
import { createHud, formatResult } from './ui/hud.js';

const $ = (id) => document.getElementById(id);
const canvas = $('game');
const menu = $('menu');
const startButton = $('start');
const durationSelect = $('duration');

const { scene, camera, render } = createScene(canvas);
const { getSensitivity } = initSensitivityPanel();
initFileGuide();
const controls = createAimControls(camera, canvas, getSensitivity);
const hud = createHud();
let session = null;

function discardSession() {
  session?.end();
  session = null;
  startButton.textContent = 'Jugar';
}

const modeCards = initModeCards({
  container: $('mode-cards'),
  modes: MODES,
  previews: renderModePreviews(MODES),
  onSelect: discardSession,
});

function startSession() {
  session = createSession({
    mode: MODES[modeCards.getSelected()].create(scene),
    duration: Number(durationSelect.value),
    camera,
  });
  controls.reset();
  $('results').textContent = '';
}

function finishSession() {
  const result = session.result();
  const isRecord = submitScore(modeCards.getSelected(), durationSelect.value, result.score);
  $('results').textContent = `Resultado — ${formatResult(result)}${isRecord ? ' · ¡Nuevo récord!' : ''}`;
  discardSession();
  modeCards.showRecords(durationSelect.value);
  controls.unlock();
}

startButton.addEventListener('click', () => {
  if (!session) startSession();
  controls.lock();
});

durationSelect.addEventListener('change', () => {
  discardSession();
  modeCards.showRecords(durationSelect.value);
});
modeCards.showRecords(durationSelect.value);

document.addEventListener('pointerlockchange', () => {
  const locked = controls.isLocked();
  menu.hidden = locked;
  if (locked) hud.show(controls.isRawInput());
  else hud.hide();
  if (session) startButton.textContent = 'Continuar';
});

canvas.addEventListener('mousedown', (e) => {
  if (e.button === 0 && controls.isLocked()) session?.shoot();
});

let lastFrame = performance.now();
function frame(now) {
  const dt = Math.min((now - lastFrame) / 1000, 0.1);
  lastFrame = now;
  if (session && controls.isLocked()) {
    session.update(dt);
    hud.update(session);
    if (session.isOver()) finishSession();
  }
  render();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
