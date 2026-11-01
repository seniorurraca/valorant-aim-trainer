import { VALORANT, cmPer360 } from '../config/valorant.js';
import { supportsDirectoryPicker, loadProfilesFromDirectory, loadProfileFromFile } from '../sensitivity/fileLoader.js';
import { loadSettings, saveSettings } from '../sensitivity/storage.js';

const $ = (id) => document.getElementById(id);

export function initSensitivityPanel() {
  const sensInput = $('sens');
  const dpiInput = $('dpi');
  const profilesSelect = $('profiles');
  const status = $('load-status');
  const folderButton = $('pick-folder');
  let profiles = [];

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

  function applyProfile(profile) {
    sensInput.value = profile.sensitivity;
    refresh();
  }

  function showProfiles(found) {
    profiles = found;
    profilesSelect.hidden = found.length < 2;
    if (!found.length) {
      status.textContent = 'No se encontró MouseSensitivity en esa ubicación.';
      return;
    }
    profilesSelect.replaceChildren(...found.map((p, i) =>
      new Option(`${p.label} — ${p.sensitivity} (${p.modified.toLocaleDateString()})`, i)));
    status.textContent = found.length > 1
      ? `${found.length} cuentas encontradas. Seleccionada la más reciente.`
      : `Sensibilidad cargada de ${found[0].label}.`;
    applyProfile(found[0]);
  }

  function showError(error) {
    if (error.name === 'AbortError') return;
    status.textContent = `No se pudo leer la carpeta (${error.message}). Usa "Elegir RiotUserSettings.ini".`;
  }

  folderButton.hidden = !supportsDirectoryPicker();
  folderButton.addEventListener('click', () => loadProfilesFromDirectory().then(showProfiles, showError));
  $('pick-file').addEventListener('change', (e) => loadProfileFromFile(e.target.files[0]).then(showProfiles, showError));
  profilesSelect.addEventListener('change', () => applyProfile(profiles[profilesSelect.value]));
  sensInput.addEventListener('input', refresh);
  dpiInput.addEventListener('input', refresh);
  refresh();

  return { getSensitivity };
}
