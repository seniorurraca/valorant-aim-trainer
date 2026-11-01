const $ = (id) => document.getElementById(id);
const percent = (ratio) => `${Math.round(ratio * 100)}%`;

export function formatResult(result) {
  return result.kind === 'tracking'
    ? `En objetivo: ${percent(result.onTargetRatio)}`
    : `Hits: ${result.hits} · Precisión: ${percent(result.accuracy)} · ${result.hitsPerSecond.toFixed(2)} hits/s`;
}

export function createHud() {
  const root = $('hud');

  return {
    show(rawInput) {
      root.hidden = false;
      $('hud-raw').textContent = rawInput ? 'Raw input ✓' : '⚠ Sin raw input (afecta sens/aceleración de Windows)';
    },
    hide: () => { root.hidden = true; },
    update(session) {
      $('hud-time').textContent = `${Math.ceil(session.timeLeft())}s`;
      $('hud-score').textContent = formatResult(session.result());
    },
  };
}
