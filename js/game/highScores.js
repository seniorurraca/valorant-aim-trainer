import { readJson, writeJson } from '../storage.js';

const HIGH_SCORES_KEY = 'valorant-aim:high-scores';

const entryKey = (modeId, duration) => `${modeId}:${duration}`;

export function getHighScore(modeId, duration) {
  return readJson(HIGH_SCORES_KEY)?.[entryKey(modeId, duration)] ?? null;
}

export function submitScore(modeId, duration, score) {
  const highScores = readJson(HIGH_SCORES_KEY) ?? {};
  const key = entryKey(modeId, duration);
  if (score <= (highScores[key] ?? 0)) return false;
  highScores[key] = score;
  writeJson(HIGH_SCORES_KEY, highScores);
  return true;
}
