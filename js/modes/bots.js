import * as THREE from 'three';
import { AGENT_HEALTH, VANDAL } from '../config/valorant.js';
import { createBotSet } from '../engine/bots.js';
import { randomBetween } from '../engine/spawn.js';
import { createStrafer } from '../engine/strafe.js';
import { percent } from '../utils/format.js';

const MIN_DISTANCE = 10;
const MAX_DISTANCE = 20;
const MAX_X = 7;
const STRAFE_RANGE = 2;
const STRAFE_SPEED = 4;

const damageFor = (zone) => (zone === 'head' ? VANDAL.headDamage : VANDAL.bodyDamage);

export const createBotMode = ({ strafing }) => function createBots(scene) {
  const bots = createBotSet(scene);
  let strafe = null;
  let kills = 0;
  let headshotKills = 0;

  function spawn() {
    const position = new THREE.Vector3(randomBetween(-MAX_X, MAX_X), 0, -randomBetween(MIN_DISTANCE, MAX_DISTANCE));
    bots.add(position, AGENT_HEALTH);
    if (strafing) {
      strafe = createStrafer({ speed: STRAFE_SPEED, minX: position.x - STRAFE_RANGE, maxX: position.x + STRAFE_RANGE });
    }
  }

  return {
    kind: 'click',
    targets: bots,
    start: spawn,
    update: (dt) => strafe?.(dt, bots.bots[0].group.position),
    hit(mesh) {
      const { bot, zone } = mesh.userData;
      bot.health -= damageFor(zone);
      if (bot.health > 0) return;
      kills += 1;
      if (zone === 'head') headshotKills += 1;
      bots.remove(bot);
      spawn();
    },
    score: () => kills,
    summary: () => `Kills: ${kills} · HS: ${percent(kills ? headshotKills / kills : 0)}`,
  };
};
