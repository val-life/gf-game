// 衍生屬性計算 + 鉤子引擎
// 公式：atk = str*2；maxHp = 50+con*15；def = con*1.5；crit% = dex*0.4；dodge% = dex*0.4；spd = dex*0.5

import { state } from './state.js';

const FUNCTION_MAP = {
  // 被動：每年獲得金幣
  gainGold5: (p) => { p.gold += 5; return { log: '【家業】金幣 +5。' }; },
  gainGoldByLuk: (p) => { const g = Math.floor(p.luk * 2); p.gold += g; return { log: `【家境】金幣 +${g}。` }; },
  // 閃避加成
  dodgeBonus15: (p, ctx) => {
    if (ctx?.dodging) ctx.dodgeBonus = (ctx.dodgeBonus ?? 0) + 15;
    return null;
  },
  // 滿血
  fullHeal: (p) => { p.hp = p.maxHp; return { log: '【天賦】HP 已滿。' }; },
  // 求學折扣
  studyDiscount: (p, ctx) => { if (ctx) ctx.cost = Math.max(1, ctx.cost - 1); return null; },
  // 商店折扣
  shopDiscount20: (p, ctx) => { if (ctx) ctx.price = Math.floor(ctx.price * 0.8); return null; },
  shopDiscount30: (p, ctx) => { if (ctx) ctx.price = Math.floor(ctx.price * 0.7); return null; },
  // 復活
  revive30: (p, ctx) => {
    if (ctx && Math.random() < 0.3 && !p.flags.__noRevive) {
      p.hp = Math.max(1, p.hp);
      p.flags.__noRevive = true;
      return { log: '【鋼鐵意志】你從死亡邊緣站起！' };
    }
    return null;
  },
  revive100: (p, ctx) => {
    if (ctx && !p.flags.__noRevive) {
      p.hp = p.maxHp;
      p.flags.__noRevive = true;
      return { log: '【不死鳥】你浴火重生！' };
    }
    return null;
  },
  revive100_3times: (p, ctx) => {
    p.flags.__reviveLeft = p.flags.__reviveLeft ?? 3;
    if (ctx && p.flags.__reviveLeft > 0) {
      p.hp = Math.max(1, p.maxHp);
      p.flags.__reviveLeft -= 1;
      return { log: `【永恆】死而復生（剩 ${p.flags.__reviveLeft} 次）。` };
    }
    return null;
  },
  // 狂暴：HP<30% atk+50%
  berserk: (p, ctx) => {
    if (ctx && p.hp / p.maxHp < 0.3) {
      ctx.atkBonus = (ctx.atkBonus ?? 0) + Math.floor(ctx.baseAtk * 0.5);
      return { log: '【狂化】HP 危急！攻擊 +50%！' };
    }
    return null;
  },
  // 秘法箭
  arcaneBolt: (p, ctx) => {
    if (ctx && ctx.target) {
      const dmg = 10 + Math.floor(p.int * 0.5);
      ctx.target.currentHp -= dmg;
      return { log: `【秘法箭】造成 ${dmg} 魔法傷害。` };
    }
    return null;
  },
  // 吸血
  lifesteal15: (p, ctx) => {
    if (ctx && ctx.damage) {
      const heal = Math.floor(ctx.damage * 0.15);
      p.hp = Math.min(p.maxHp, p.hp + heal);
      return { log: `【吸血】恢復 ${heal} HP。` };
    }
    return null;
  },
  // 詛咒自傷
  selfHurt3: (p) => { p.hp = Math.max(1, p.hp - 3); return { log: '【詛咒之刃】反噬 -3 HP。' }; },
  // 回合恢復
  healPct10: (p) => {
    const heal = Math.floor(p.maxHp * 0.1);
    p.hp = Math.min(p.maxHp, p.hp + heal);
    return { log: `【鳳凰】恢復 ${heal} HP。` };
  },
  // 龍裔：火傷 -30%
  dragonResist: (p, ctx) => {
    if (ctx?.fromFire) ctx.reduction = (ctx.reduction ?? 0) + 0.3;
    return null;
  },
  // Boss 增傷
  bossBonus50: (p, ctx) => {
    if (ctx?.targetIsBoss) ctx.bonus = (ctx.bonus ?? 0) + 0.5;
    return null;
  },
  // 先手
  firstStrike: (p, ctx) => { if (ctx) ctx.firstStrike = true; return { log: '【次元先攻】率先出手。' }; },
  // 冒險雙步
  doubleStep: (p, ctx) => { if (ctx) ctx.steps = (ctx.steps ?? 1) + 1; return null; }
};

export function runHook(hookName, player, ctx = {}) {
  const logs = [];
  const talents = player.talents ?? [];
  for (const t of talents) {
    const effects = Array.isArray(t.effect) ? t.effect : [t.effect];
    for (const eff of effects) {
      if (!eff) continue;
      if (eff.type === 'hook' && eff.hook === hookName) {
        const fn = FUNCTION_MAP[eff.fn];
        if (fn) {
          const res = fn(player, ctx);
          if (res?.log) logs.push(res.log);
        }
      }
    }
  }
  return logs;
}

// 計算當前所有衍生屬性（裝備 + 天賦 + 夥伴 + 加成）
export function computeStats(player) {
  const mods = { str: 0, con: 0, dex: 0, int: 0, cha: 0, luk: 0, atk: 0, def: 0, maxHp: 0, critPct: 0, dodgePct: 0, spd: 0, fireResist: 0 };
  // 天賦
  for (const t of player.talents ?? []) {
    const effects = Array.isArray(t.effect) ? t.effect : [t.effect];
    for (const eff of effects) {
      if (eff?.type === 'stat_mod') {
        for (const k in eff.mods) mods[k] = (mods[k] ?? 0) + eff.mods[k];
      }
    }
  }
  // 裝備
  for (const slot in player.equipment ?? {}) {
    const it = player.equipment[slot];
    if (!it) continue;
    for (const k of Object.keys(mods)) {
      if (it[k]) mods[k] += it[k];
    }
  }
  // 夥伴（親密度達標）
  for (const id in player.affinity ?? {}) {
    if (player.affinity[id] < 0) continue;
    const min = player.npcData?.[id]?.affAt ?? 999;
    if (player.affinity[id] >= min) {
      const cb = player.npcData?.[id]?.combat ?? {};
      if (cb.allStats) for (const k of ['str','con','dex','int','cha','luk']) mods[k] += cb.allStats;
      if (cb.atk) mods.atk += cb.atk;
      if (cb.def) mods.def += cb.def;
      if (cb.crit) mods.critPct += cb.crit;
      if (cb.healTurn) player.flags.__healTurn = cb.healTurn;
    }
  }
  return mods;
}

export function applyStats(player) {
  const m = computeStats(player);
  const oldMax = player.maxHp;
  // 六維
  player.str = player.baseStr + m.str;
  player.con = player.baseCon + m.con;
  player.dex = player.baseDex + m.dex;
  player.int = player.baseInt + m.int;
  player.cha = player.baseCha + m.cha;
  player.luk = player.baseLuk + m.luk;
  // 戰鬥衍生
  player.atk = player.str * 2 + (m.atk ?? 0);
  player.def = Math.floor(player.con * 1.5) + (m.def ?? 0);
  player.matk = Math.floor(player.int * 1.0);
  player.maxHp = 50 + player.con * 15 + (m.maxHp ?? 0);
  player.critPct = 2 + player.dex * 0.4 + (m.critPct ?? 0);
  player.dodgePct = 2 + player.dex * 0.4 + (m.dodgePct ?? 0);
  player.spd = 2 + player.dex * 0.5 + (m.spd ?? 0);
  // 經濟 / 社交
  player.shopDiscount = Math.min(0.4, player.cha * 0.005 + (m.shopDiscount ?? 0));
  player.goldPerYear = player.luk * 2 + (m.goldPerYear ?? 0);
  player.dropBonus = player.luk * 0.005;
  player.failReduce = Math.min(0.5, player.int * 0.005);
  player.affBonus = player.cha * 0.01;
  // 元素抗性
  player.fireResist = m.fireResist ?? 0;
  // HP 修正
  if (player.hp > player.maxHp) player.hp = player.maxHp;
  if (oldMax > 0 && player.maxHp > oldMax) player.hp += (player.maxHp - oldMax);
}
