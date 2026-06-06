// 轉生系統。生成天賦草稿、套用天賦
import { TALENTS, RARITY_WEIGHT } from '../data/talents.js';
import { sample, pickWeighted } from '../core/util.js';
import { state } from '../core/state.js';
import { applyStats } from '../core/hooks.js';
import { saveMeta, addKarma } from './meta.js';

export function generateTalentDraft(count = 3) {
  const available = TALENTS.filter(t => {
    if (t.locked && !state.unlockedMythics.includes(t.id)) return false;
    return true;
  });
  const picks = sample(available, count);
  return picks;
}

export function rerollTalentDraft(count = 3) {
  // 重新抽取。新天賦不可與上次草稿重複
  const exclude = new Set(state.currentDraft?.map(t => t.id) ?? []);
  const available = TALENTS.filter(t => {
    if (t.locked && !state.unlockedMythics.includes(t.id)) return false;
    if (exclude.has(t.id)) return false;
    return true;
  });
  if (available.length === 0) return state.currentDraft;
  return sample(available, Math.min(count, available.length));
}

export function applyTalent(talent) {
  state.player.talents.push(talent);
  applyStats(state.player);
}

export function startAwakening() {
  state.phase = 'awakening';
  state.currentDraft = generateTalentDraft(3);
}

export function confirmReincarnation() {
  // 出生
  state.player.gold += 0; // start
  state.player.hp = state.player.hpMax;
  state.ap = state.apMax + (state.player.apBonus ?? 0);
  state.phase = 'town';
  state.meta.totalRuns += 1;
  saveMeta();
  addKarma(0); // initial
}
