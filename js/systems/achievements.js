// 成就系統
import { state } from '../core/state.js';
import { log } from '../ui/log.js';
import { saveMeta } from './meta.js';

const ACHIEVEMENT_KARMA = 500;

export function giveAchievement(name) {
  const p = state.player;
  if (!p) return;
  if (p.achievements.includes(name)) return;
  p.achievements.push(name);
  state.meta.karma += ACHIEVEMENT_KARMA;
  log(`🏆 成就解鎖：${name}！+${ACHIEVEMENT_KARMA} 業火`, 'epic');
  saveMeta();
}

export function countAchievements(player) {
  return (player?.achievements ?? []).length;
}
