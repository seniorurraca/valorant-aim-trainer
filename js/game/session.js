import { targetUnderCrosshair } from '../engine/targets.js';

export function createSession({ mode, duration, camera }) {
  const stats = { shots: 0, hits: 0, onTargetTime: 0, elapsed: 0 };
  mode.start?.();

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

  function result() {
    const onTargetRatio = stats.elapsed ? stats.onTargetTime / stats.elapsed : 0;
    const defaultScore = mode.kind === 'tracking' ? Math.round(onTargetRatio * 100) : stats.hits;
    return {
      kind: mode.kind,
      hits: stats.hits,
      accuracy: stats.shots ? stats.hits / stats.shots : 0,
      hitsPerSecond: stats.elapsed ? stats.hits / stats.elapsed : 0,
      onTargetRatio,
      score: mode.score?.() ?? defaultScore,
      summary: mode.summary?.(),
    };
  }

  return {
    update,
    shoot,
    result,
    timeLeft: () => Math.max(0, duration - stats.elapsed),
    isOver: () => stats.elapsed >= duration,
    end: () => mode.targets.clear(),
  };
}
