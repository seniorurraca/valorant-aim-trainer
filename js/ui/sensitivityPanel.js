import { VALORANT, cmPer360 } from '../config/valorant.js';
import { parseSensitivity } from '../sensitivity/iniParser.js';
import { loadSettings, saveSettings } from '../sensitivity/storage.js';

const $ = (id) => document.getElementById(id);

export function initSensitivityPanel() {
  const sensInput = $('sens');
  const dpiInput = $('dpi');
  const status = $('load-status');

  const saved = loadSettings();
  if (saved) {
    sensInput.value = saved.sensitivity;
    dpiInput.value = saved.dpi;
  }

  const getSensitivity = () => parseFloat(sensInput.value) || 0;

  function refresh() {
    const sensitivity = getSensitivity();
    const dpi = parseFloat(dpiInput.value) || 0;
    $('sens-info').textContent = sensitivity && dpi
      ? `${(sensitivity * VALORANT.degreesPerCount).toFixed(4)}°/count · ${cmPer360(sensitivity, dpi).toFixed(1)} cm/360°`
      : '';
    saveSettings({ sensitivity, dpi });
  }

  async function loadFromFile(file) {
    const sensitivity = parseSensitivity(await file.text());
    if (!sensitivity) {
      status.textContent = `No se encontró MouseSensitivity en ${file.name}.`;
      return;
    }
    sensInput.value = sensitivity;
    status.textContent = `Sensibilidad ${sensitivity} cargada de ${file.name}.`;
    refresh();
  }

  async function copyConfigPath() {
    try {
      await navigator.clipboard.writeText($('config-path').textContent);
      status.textContent = 'Ruta copiada.';
    } catch {
      status.textContent = 'No se pudo copiar; selecciona la ruta a mano.';
    }
  }

  $('copy-path').addEventListener('click', copyConfigPath);
  $('pick-file').addEventListener('change', (e) => loadFromFile(e.target.files[0]));
  sensInput.addEventListener('input', refresh);
  dpiInput.addEventListener('input', refresh);
  refresh();

  return { getSensitivity };
}
