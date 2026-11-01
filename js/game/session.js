import { targetUnderCrosshair } from '../engine/targets.js';

export function createSession({ mode, duration, camera }) {
  const stats = { shots: 0, hits: 0, onTargetTime: 0, elapsed: 0 };
  mode.start();

  function update(dt) {
    stats.elapsed += dt;
    mode.update?.(dt);
    if (mode.kind === 'tracking' && targetUnderCrosshair(camera, mode.targets.meshes)) {
      stats.onTargetTime += dt;
    }
  }

  function shoot() {
    if (mode.kind !== 'click') return;
    stats.shots += 1;
    const target = targetUnderCrosshair(camera, mode.targets.meshes);
    if (!target) return;
    stats.hits += 1;
    mode.hit(target);
  }

  const result = () => ({
    kind: mode.kind,
    hits: stats.hits,
    accuracy: stats.shots ? stats.hits / stats.shots : 0,
    hitsPerSecond: stats.elapsed ? stats.hits / stats.elapsed : 0,
    onTargetRatio: stats.elapsed ? stats.onTargetTime / stats.elapsed : 0,
  });

  return {
    update,
    shoot,
    result,
    timeLeft: () => Math.max(0, duration - stats.elapsed),
    isOver: () => stats.elapsed >= duration,
    end: () => mode.targets.clear(),
  };
}
