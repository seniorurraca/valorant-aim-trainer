import { renderDialogMock } from './dialogMock.js';

const $ = (id) => document.getElementById(id);

const CONFIG_BREADCRUMB = '… › VALORANT › Saved › Config';
const ACCOUNT_FOLDER = 'a1b2c3d4-…-latam';
const entry = (kind) => (name, modified, selected = false) => ({ kind, name, modified, selected });
const folder = entry('folder');
const file = entry('file');

const SLIDES = [
  {
    caption: '1. Haz clic en "Copiar ruta". En el diálogo, haz clic en la barra de direcciones (arriba), pega con Ctrl+V y presiona Enter.',
    path: '%LOCALAPPDATA%\\VALORANT\\Saved\\Config',
    highlight: 'address',
    rows: [],
  },
  {
    caption: '2. Abre la carpeta de tu cuenta: el nombre largo que termina en tu región (ej. -latam). Si hay varias, la de fecha más reciente.',
    path: CONFIG_BREADCRUMB,
    rows: [
      folder(ACCOUNT_FOLDER, 'hoy', true),
      folder('CrashReportClient', 'ayer'),
      folder('WindowsClient', 'ayer'),
    ],
  },
  {
    caption: '3. Abre la carpeta "Windows" (no "WindowsClient").',
    path: `${CONFIG_BREADCRUMB} › ${ACCOUNT_FOLDER}`,
    rows: [
      folder('Windows', 'hoy', true),
      folder('WindowsClient', 'hoy'),
    ],
  },
  {
    caption: '4. Elige "RiotUserSettings" y presiona Abrir. La sensibilidad se carga sola.',
    path: `… › ${ACCOUNT_FOLDER} › Windows`,
    highlight: 'open',
    fileName: 'RiotUserSettings',
    rows: [file('RiotUserSettings', 'hoy', true)],
  },
];

export function initFileGuide() {
  const overlay = $('guide');
  const prevButton = $('guide-prev');
  const nextButton = $('guide-next');
  let index = 0;

  function show(slideIndex) {
    index = slideIndex;
    const slide = SLIDES[index];
    $('guide-image').innerHTML = renderDialogMock(slide);
    $('guide-caption').textContent = slide.caption;
    $('guide-step').textContent = `${index + 1} / ${SLIDES.length}`;
    prevButton.disabled = index === 0;
    nextButton.textContent = index === SLIDES.length - 1 ? 'Listo' : 'Siguiente';
  }

  const close = () => { overlay.hidden = true; };

  $('open-guide').addEventListener('click', () => {
    show(0);
    overlay.hidden = false;
  });
  $('guide-close').addEventListener('click', close);
  prevButton.addEventListener('click', () => show(index - 1));
  nextButton.addEventListener('click', () => (index === SLIDES.length - 1 ? close() : show(index + 1)));
}
