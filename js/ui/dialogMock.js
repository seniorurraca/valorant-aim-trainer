const COLORS = {
  window: '#202020',
  field: '#2b2b2b',
  border: '#444',
  text: '#e6e6e6',
  muted: '#9a9a9a',
  accent: '#ff4655',
  selected: '#3a3f4b',
  folder: '#e8b84a',
  file: '#cfd8dc',
};
const LIST_TOP = 96;
const ROW_HEIGHT = 30;

const outline = (highlighted) => highlighted
  ? `stroke="${COLORS.accent}" stroke-width="3"`
  : `stroke="${COLORS.border}"`;

const icon = (kind, x, y) => (kind === 'folder'
  ? `<rect x="${x}" y="${y + 1}" width="8" height="5" rx="1" fill="${COLORS.folder}"/>
     <rect x="${x}" y="${y + 4}" width="18" height="13" rx="2" fill="${COLORS.folder}"/>`
  : `<rect x="${x + 2}" y="${y}" width="14" height="18" rx="2" fill="${COLORS.file}"/>`);

function renderRow({ name, kind, modified, selected }, index) {
  const y = LIST_TOP + index * ROW_HEIGHT;
  const selection = selected
    ? `<rect x="12" y="${y}" width="456" height="${ROW_HEIGHT - 4}" rx="4" fill="${COLORS.selected}" ${outline(true)}/>`
    : '';
  return `${selection}
    ${icon(kind, 24, y + 4)}
    <text x="52" y="${y + 18}" fill="${COLORS.text}">${name}</text>
    <text x="330" y="${y + 18}" fill="${COLORS.muted}">${modified}</text>`;
}

export function renderDialogMock({ path, rows, highlight, fileName = '' }) {
  return `<svg viewBox="0 0 480 262" role="img" aria-label="Diálogo Abrir de Windows"
      font-family="Segoe UI, system-ui, sans-serif" font-size="13">
    <rect width="480" height="262" rx="8" fill="${COLORS.window}"/>
    <text x="14" y="23" fill="${COLORS.text}">Abrir</text>
    <rect x="12" y="34" width="456" height="30" rx="4" fill="${COLORS.field}" ${outline(highlight === 'address')}/>
    <text x="22" y="54" fill="${COLORS.text}">${path}</text>
    <text x="52" y="86" fill="${COLORS.muted}" font-size="12">Nombre</text>
    <text x="330" y="86" fill="${COLORS.muted}" font-size="12">Fecha de modificación</text>
    ${rows.map(renderRow).join('')}
    <text x="12" y="235" fill="${COLORS.text}">Nombre de archivo:</text>
    <rect x="132" y="218" width="226" height="26" rx="4" fill="${COLORS.field}" ${outline(false)}/>
    <text x="140" y="235" fill="${COLORS.text}">${fileName}</text>
    <rect x="370" y="218" width="98" height="26" rx="4" fill="${COLORS.field}" ${outline(highlight === 'open')}/>
    <text x="419" y="235" fill="${COLORS.text}" text-anchor="middle">Abrir</text>
  </svg>`;
}
