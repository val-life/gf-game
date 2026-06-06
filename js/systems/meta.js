// Meta 進度（v2：分階商店 + 新業火公式）
import { state } from '../core/state.js';

const SAVE_KEY = 'rgr_save_v2';

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
    if (!raw) {
      // 嘗試從 v1 升級
      const v1 = localStorage.getItem('rgr_save_v1');
      if (v1) {
        const data = JSON.parse(v1);
        state.meta = { ...state.meta, ...(data.meta ?? {}) };
        state.unlockedMythics = data.unlockedMythics ?? [];
        saveMeta();
        return data;
      }
      return null;
    }
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

// ============ 分階 Meta 商店 ============
export const META_SHOP = [
  // 「天生富家子」三階
  { id: 'rich_1', name: '「天生富家子」階 I', desc: '未來每局起始金幣 +200', cost: 300, applyTier: 'richBoy', tier: 1, effect: { goldStart: 200 } },
  { id: 'rich_2', name: '「天生富家子」階 II', desc: '起始金幣再 +500（累計 +700）', cost: 800, applyTier: 'richBoy', tier: 2, requires: 'rich_1', effect: { goldStart: 500 } },
  { id: 'rich_3', name: '「天生富家子」階 III', desc: '起始金幣再 +1200（累計 +1900）', cost: 2000, applyTier: 'richBoy', tier: 3, requires: 'rich_2', effect: { goldStart: 1200 } },

  // 「劍聖血脈」三階
  { id: 'sword_1', name: '「劍聖血脈」階 I', desc: '起始攻擊 +5', cost: 500, applyTier: 'swordSaint', tier: 1, effect: { atk: 5 } },
  { id: 'sword_2', name: '「劍聖血脈」階 II', desc: '起始攻擊再 +15（累計 +20）', cost: 1200, applyTier: 'swordSaint', tier: 2, requires: 'sword_1', effect: { atk: 15 } },
  { id: 'sword_3', name: '「劍聖血脈」階 III', desc: '起始攻擊再 +40（累計 +60）', cost: 3500, applyTier: 'swordSaint', tier: 3, requires: 'sword_2', effect: { atk: 40 } },

  // 「命運之子的眷顧」
  { id: 'reroll_1', name: '「命運之子的眷顧」階 I', desc: '天賦重抽次數 +1（最多 3）', cost: 1500, applyTier: 'reroll', tier: 1, effect: { rerollBonus: 1 }, maxTier: 3 },

  // 永久血脈
  { id: 'blood_str', name: '「血脈」力量 +2', desc: '每局起始力量 +2', cost: 200, effect: { baseStr: 2 } },
  { id: 'blood_con', name: '「血脈」體質 +2', desc: '起始體質 +2', cost: 200, effect: { baseCon: 2 } },
  { id: 'blood_dex', name: '「血脈」靈巧 +2', desc: '起始靈巧 +2', cost: 200, effect: { baseDex: 2 } },
  { id: 'blood_int', name: '「血脈」智力 +2', desc: '起始智力 +2', cost: 200, effect: { baseInt: 2 } },
  { id: 'blood_cha', name: '「血脈」魅力 +2', desc: '起始魅力 +2', cost: 200, effect: { baseCha: 2 } },
  { id: 'blood_luk', name: '「血脈」幸運 +2', desc: '起始幸運 +2', cost: 200, effect: { baseLuk: 2 } },
  { id: 'blood_hp', name: '「不朽軀殼」', desc: '起始最大 HP +50', cost: 600, effect: { maxHp: 50 } },

  // 神話天賦解鎖
  { id: 'unlock_slayer', name: '解鎖【弒神者】', desc: '解鎖神話級天賦', cost: 1000, unlock: 't_god_slayer' },
  { id: 'unlock_eternal', name: '解鎖【永恆輪迴】', desc: '解鎖神話級天賦', cost: 1500, unlock: 't_eternal' },
  { id: 'unlock_creator', name: '解鎖【創世者】', desc: '解鎖神話級天賦', cost: 2500, unlock: 't_world_creator' }
];

export function canBuyMeta(item) {
  if (state.meta.karma < item.cost) return false;
  if (item.requires) {
    const prev = META_SHOP.find(m => m.id === item.requires);
    if (prev && (state.meta.metaShopTiers?.[prev.applyTier] ?? 0) < prev.tier) return false;
  }
  if (item.maxTier && state.meta.metaShopTiers?.[item.applyTier] >= item.maxTier) return false;
  return true;
}

export function buyMeta(item) {
  if (!canBuyMeta(item)) return false;
  state.meta.karma -= item.cost;
  state.meta.bonusStats = state.meta.bonusStats ?? {};
  if (item.applyTier) {
    state.meta.metaShopTiers = state.meta.metaShopTiers ?? {};
    state.meta.metaShopTiers[item.applyTier] = item.tier;
  }
  if (item.unlock) {
    if (!state.unlockedMythics.includes(item.unlock)) {
      state.unlockedMythics.push(item.unlock);
    }
  }
  if (item.effect) {
    for (const k in item.effect) {
      state.meta.bonusStats[k] = (state.meta.bonusStats[k] ?? 0) + item.effect[k];
    }
  }
  saveMeta();
  return true;
}

export function applyMetaBonuses(player) {
  const b = state.meta.bonusStats ?? {};
  if (b.baseStr) player.baseStr += b.baseStr;
  if (b.baseCon) player.baseCon += b.baseCon;
  if (b.baseDex) player.baseDex += b.baseDex;
  if (b.baseInt) player.baseInt += b.baseInt;
  if (b.baseCha) player.baseCha += b.baseCha;
  if (b.baseLuk) player.baseLuk += b.baseLuk;
  if (b.maxHp) player.hpMax += b.maxHp;
  if (b.atk) {
    // 透過 baseStr 加成（atk = str*2）
    player.baseStr += Math.ceil(b.atk / 2);
  }
}

export function resetSave() {
  localStorage.removeItem(SAVE_KEY);
  state.meta = {
    karma: 0,
    totalRuns: 0,
    bestAge: 0,
    bestGold: 0,
    bestKarma: 0,
    achievements: [],
    bonusStats: {},
    metaShopTiers: { richBoy: 0, swordSaint: 0, reroll: 0 },
    mainStoryProgress: {}
  };
  state.unlockedMythics = [];
}
