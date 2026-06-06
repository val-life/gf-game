// 轉生系統
import { TALENTS } from '../data/talents.js';
import { sample } from '../core/util.js';
import { state } from '../core/state.js';
import { applyStats } from '../core/hooks.js';
import { saveMeta } from './meta.js';
import { log } from '../ui/log.js';

export function generateTalentDraft(count = 3) {
  const available = TALENTS.filter(t => {
    if (t.locked && !state.unlockedMythics.includes(t.id)) return false;
    return true;
  });
  return sample(available, count);
}

export function rerollTalentDraft(count = 3) {
  if (state.rerollsLeft <= 0) {
    log('沒有剩餘的重抽次數了。', 'warn');
    return state.currentDraft;
  }
  const exclude = new Set(state.currentDraft?.map(t => t.id) ?? []);
  const available = TALENTS.filter(t => {
    if (t.locked && !state.unlockedMythics.includes(t.id)) return false;
    if (exclude.has(t.id)) return false;
    return true;
  });
  state.rerollsLeft -= 1;
  log(`重抽天賦！剩餘次數：${state.rerollsLeft}`, 'magic');
  return sample(available, Math.min(count, available.length));
}

export function applyTalent(talent) {
  state.player.talents.push(talent);
  applyStats(state.player);
}

export function startAwakening() {
  state.phase = 'awakening';
  state.currentDraft = generateTalentDraft(3);
  state.rerollsLeft = state.meta.bonusStats.rerollBonus ?? 0;
}

export function confirmReincarnation() {
  const p = state.player;
  // 套用 meta 起始加成
  const b = state.meta.bonusStats ?? {};
  p.gold += b.goldStart ?? 0;
  p.hp = p.maxHp;
  // 套用起始幸運收入（顯示在 log）
  if ((b.goldStart ?? 0) > 0) {
    log(`業火加持：本局起始金幣 +${b.goldStart}！`, 'epic');
  }
  state.ap = state.apMax;
  state.phase = 'town';
  state.meta.totalRuns += 1;
  saveMeta();
}
