import { getHighScore } from '../game/highScores.js';

const CARD_TEMPLATE = `
  <img alt="">
  <div class="card-body">
    <div class="card-title"></div>
    <div class="card-text"></div>
    <div class="card-record"></div>
  </div>`;

function createCard(mode, preview) {
  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'card';
  card.innerHTML = CARD_TEMPLATE;
  card.querySelector('img').src = preview;
  card.querySelector('.card-title').textContent = mode.label;
  card.querySelector('.card-text').textContent = mode.description;
  return card;
}

export function initModeCards({ container, modes, previews, onSelect }) {
  const cards = Object.entries(modes).map(([id, mode]) => [id, createCard(mode, previews[id])]);
  let selectedId = cards[0][0];

  function select(id) {
    selectedId = id;
    cards.forEach(([cardId, card]) => card.setAttribute('aria-pressed', String(cardId === id)));
    onSelect(id);
  }

  function showRecords(duration) {
    cards.forEach(([id, card]) => {
      const best = getHighScore(id, duration);
      card.querySelector('.card-record').textContent = `Récord: ${best === null ? '—' : `${best} ${modes[id].scoreUnit}`}`;
    });
  }

  cards.forEach(([id, card]) => {
    card.addEventListener('click', () => select(id));
    container.append(card);
  });
  select(selectedId);

  return { getSelected: () => selectedId, showRecords };
}
