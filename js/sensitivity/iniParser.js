import { VALORANT } from '../config/valorant.js';

const SENSITIVITY_PATTERN = new RegExp(`^${VALORANT.sensitivityKey}=([\\d.]+)`, 'm');

export function parseSensitivity(iniText) {
  const match = iniText.match(SENSITIVITY_PATTERN);
  return match ? Math.round(parseFloat(match[1]) * 1000) / 1000 : null;
}
