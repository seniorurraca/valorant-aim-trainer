import * as THREE from 'three';

const TARGET_COLOR = 0xff4655;
const sphere = new THREE.SphereGeometry(1, 32, 16);
const raycaster = new THREE.Raycaster();
const SCREEN_CENTER = new THREE.Vector2(0, 0);

export function createTargetSet(scene) {
  const meshes = [];

  function add(radius, position) {
    const mesh = new THREE.Mesh(sphere, new THREE.MeshStandardMaterial({
      color: TARGET_COLOR, emissive: TARGET_COLOR, emissiveIntensity: 0.3,
    }));
    mesh.scale.setScalar(radius);
    mesh.position.copy(position);
    scene.add(mesh);
    meshes.push(mesh);
    return mesh;
  }

  function remove(mesh) {
    scene.remove(mesh);
    mesh.material.dispose();
    meshes.splice(meshes.indexOf(mesh), 1);
  }

  const clear = () => [...meshes].forEach(remove);

  return { meshes, add, remove, clear };
}

export function targetUnderCrosshair(camera, meshes) {
  raycaster.setFromCamera(SCREEN_CENTER, camera);
  return raycaster.intersectObjects(meshes, false)[0]?.object ?? null;
}
