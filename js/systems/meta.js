// Meta 進度：業火、解鎖、存讀
import { state } from '../core/state.js';

const SAVE_KEY = 'rgr_save_v1';

export function saveMeta() {
  const data = {
    meta: state.meta,
    unlockedMythics: state.unlockedMythics
  };
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Save failed', e);
  }
}

export function loadMeta() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    state.meta = { ...state.meta, ...data.meta };
    state.unlockedMythics = data.unlockedMythics ?? [];
    return data;
  } catch (e) {
    console.error('Load failed', e);
    return null;
  }
}

export function addKarma(n) {
  state.meta.karma += n;
  saveMeta();
}

export function spendKarma(cost) {
  if (state.meta.karma < cost) return false;
  state.meta.karma -= cost;
  saveMeta();
  return true;
}

// 元商店物品
export const META_SHOP = [
  { id: 'm_str', name: '血脈：力量', desc: '起始力量 +2', cost: 50, apply: (p) => p.baseStr += 2 },
  { id: 'm_agi', name: '血脈：敏捷', desc: '起始敏捷 +2', cost: 50, apply: (p) => p.baseAgi += 2 },
  { id: 'm_int', name: '血脈：智力', desc: '起始智力 +2', cost: 50, apply: (p) => p.baseInt += 2 },
  { id: 'm_vit', name: '血脈：體質', desc: '起始體質 +2', cost: 50, apply: (p) => p.baseVit += 2 },
  { id: 'm_lck', name: '血脈：幸運', desc: '起始幸運 +2', cost: 50, apply: (p) => p.baseLck += 2 },
  { id: 'm_hp', name: '不朽軀殼', desc: '最大 HP +30', cost: 100, apply: (p) => p.hpMax += 30 },
  { id: 'm_gold', name: '富貴之始', desc: '起始金幣 +50', cost: 80, apply: (p) => p.gold += 50 },
  { id: 'm_mythic_slayer', name: '解鎖【弒神者】', desc: '解鎖神話天賦', cost: 500, unlock: 't_god_slayer' },
  { id: 'm_mythic_eternal', name: '解鎖【永恆輪迴】', desc: '解鎖神話天賦', cost: 800, unlock: 't_eternal' }
];

export function buyMeta(item) {
  if (state.meta.karma < item.cost) return false;
  state.meta.karma -= item.cost;
  if (item.unlock) {
    if (!state.unlockedMythics.includes(item.unlock)) {
      state.unlockedMythics.push(item.unlock);
    }
  }
  if (item.apply) {
    // 直接套用至新 run 的 base
    state.meta.bonusStats = state.meta.bonusStats ?? { str: 0, agi: 0, int: 0, vit: 0, lck: 0, hpMax: 0, atk: 0 };
    if (item.id === 'm_str') state.meta.bonusStats.str += 2;
    if (item.id === 'm_agi') state.meta.bonusStats.agi += 2;
    if (item.id === 'm_int') state.meta.bonusStats.int += 2;
    if (item.id === 'm_vit') state.meta.bonusStats.vit += 2;
    if (item.id === 'm_lck') state.meta.bonusStats.lck += 2;
    if (item.id === 'm_hp') state.meta.bonusStats.hpMax += 30;
  }
  saveMeta();
  return true;
}

export function applyMetaBonuses(player) {
  const b = state.meta.bonusStats ?? {};
  player.baseStr += b.str ?? 0;
  player.baseAgi += b.agi ?? 0;
  player.baseInt += b.int ?? 0;
  player.baseVit += b.vit ?? 0;
  player.baseLck += b.lck ?? 0;
  player.hpMax += b.hpMax ?? 0;
  player.gold += b.gold ?? 0;
}

export function resetSave() {
  localStorage.removeItem(SAVE_KEY);
  state.meta = {
    karma: 0,
    totalRuns: 0,
    bestAge: 0,
    bestGold: 0,
    achievements: [],
    bonusStats: { str: 0, agi: 0, int: 0, vit: 0, lck: 0, hpMax: 0, atk: 0 }
  };
  state.unlockedMythics = [];
}
