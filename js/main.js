import { createScene } from './engine/scene.js';
import { createAimControls } from './engine/aimControls.js';
import { createSession } from './game/session.js';
import { getHighScore, submitScore } from './game/highScores.js';
import { MODES } from './modes/index.js';
import { initSensitivityPanel } from './ui/sensitivityPanel.js';
import { createHud, formatResult } from './ui/hud.js';

const $ = (id) => document.getElementById(id);
const canvas = $('game');
const menu = $('menu');
const startButton = $('start');
const modeSelect = $('mode');
const durationSelect = $('duration');

const { scene, camera, render } = createScene(canvas);
const { getSensitivity } = initSensitivityPanel();
const controls = createAimControls(camera, canvas, getSensitivity);
const hud = createHud();
let session = null;

Object.entries(MODES).forEach(([id, mode]) => modeSelect.add(new Option(mode.label, id)));

function showHighScore() {
  const best = getHighScore(modeSelect.value, durationSelect.value);
  $('high-score').textContent = `Récord: ${best === null ? '—' : `${best} ${MODES[modeSelect.value].scoreUnit}`}`;
}

function onSelectionChange() {
  discardSession();
  showHighScore();
}

function discardSession() {
  session?.end();
  session = null;
  startButton.textContent = 'Jugar';
}

function startSession() {
  session = createSession({
    mode: MODES[modeSelect.value].create(scene),
    duration: Number(durationSelect.value),
    camera,
  });
  controls.reset();
  $('results').textContent = '';
}

function finishSession() {
  const result = session.result();
  const isRecord = submitScore(modeSelect.value, durationSelect.value, result.score);
  $('results').textContent = `Resultado — ${formatResult(result)}${isRecord ? ' · ¡Nuevo récord!' : ''}`;
  discardSession();
  showHighScore();
  controls.unlock();
}

startButton.addEventListener('click', () => {
  if (!session) startSession();
  controls.lock();
});

modeSelect.addEventListener('change', onSelectionChange);
durationSelect.addEventListener('change', onSelectionChange);
showHighScore();

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
