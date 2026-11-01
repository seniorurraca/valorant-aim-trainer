import * as THREE from 'three';

const BODY_HEIGHT = 1.0;
const BODY_RADIUS = 0.28;
const HEAD_RADIUS = 0.15;
const BODY_CENTER_Y = BODY_HEIGHT / 2 + BODY_RADIUS;
const HEAD_CENTER_Y = BODY_CENTER_Y * 2 + HEAD_RADIUS;

const bodyGeometry = new THREE.CapsuleGeometry(BODY_RADIUS, BODY_HEIGHT, 5, 13);
const headGeometry = new THREE.SphereGeometry(HEAD_RADIUS, 23, 11);
const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x9d8ad6 });
const headMaterial = new THREE.MeshStandardMaterial({ color: 0xff4655, emissive: 0xff4655, emissiveIntensity: 0.3 });

export function createBotSet(scene) {
  const bots = [];
  const meshes = [];

  function addPart(bot, geometry, material, y, zone) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = y;
    mesh.userData = { bot, zone };
    bot.group.add(mesh);
    meshes.push(mesh);
  }

  function add(position, health) {
    const bot = { group: new THREE.Group(), health };
    bot.group.position.copy(position);
    addPart(bot, bodyGeometry, bodyMaterial, BODY_CENTER_Y, 'body');
    addPart(bot, headGeometry, headMaterial, HEAD_CENTER_Y, 'head');
    scene.add(bot.group);
    bots.push(bot);
    return bot;
  }

  function remove(bot) {
    scene.remove(bot.group);
    bot.group.children.forEach((mesh) => meshes.splice(meshes.indexOf(mesh), 1));
    bots.splice(bots.indexOf(bot), 1);
  }

  const clear = () => [...bots].forEach(remove);

  return { bots, meshes, add, remove, clear };
}
