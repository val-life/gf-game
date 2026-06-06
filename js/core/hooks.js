// 鉤子引擎。執行玩家身上的天賦效果
// 鉤子時機: onYearEnd, onCombatStart, onTurnStart, onTurnEnd,
//           onDealDamage, onTakeDamage, onCombatDodge, onFatalDamage,
//           onAtkCalc, onStudyCost, onShopPrice, onAdvStep

const FUNCTION_MAP = {
  gainGold5: (p) => { p.gold += 5; return { log: `${p.name} 獲得 5 金幣（家業）。` }; },
  dodgeBonus15: (p, ctx) => {
    if (ctx?.dodging) {
      ctx.dodgeBonus = (ctx.dodgeBonus ?? 0) + 15;
    }
    return null;
  },
  fullHeal: (p) => { p.hp = p.hpMax; return { log: '天賦觸發：HP 滿血！' }; },
  studyDiscount: (p, ctx) => {
    if (ctx) ctx.cost = Math.max(1, ctx.cost - 1);
    return null;
  },
  shopDiscount20: (p, ctx) => {
    if (ctx) ctx.price = Math.floor(ctx.price * 0.8);
    return null;
  },
  revive30: (p, ctx) => {
    if (ctx && Math.random() < 0.3 && !p.flags.__noRevive) {
      p.hp = 1;
      p.flags.__noRevive = true;
      return { log: '【鋼鐵意志】你從死亡邊緣站起！' };
    }
    return null;
  },
  revive100: (p, ctx) => {
    if (ctx && !p.flags.__noRevive) {
      p.hp = Math.max(1, p.hpMax);
      p.flags.__noRevive = true;
      return { log: '【不死鳥】你浴火重生！' };
    }
    return null;
  },
  revive100_3times: (p, ctx) => {
    p.flags.__reviveLeft = p.flags.__reviveLeft ?? 3;
    if (ctx && p.flags.__reviveLeft > 0) {
      p.hp = Math.max(1, p.hpMax);
      p.flags.__reviveLeft -= 1;
      return { log: `【永恆輪迴】你死而復生（剩 ${p.flags.__reviveLeft} 次）！` };
    }
    return null;
  },
  berserk: (p, ctx) => {
    if (ctx && p.hp / p.hpMax < 0.3) {
      ctx.atkBonus = (ctx.atkBonus ?? 0) + Math.floor(ctx.baseAtk * 0.5);
      return { log: '【狂化】HP 危急！攻擊力大增！' };
    }
    return null;
  },
  arcaneBolt: (p, ctx) => {
    if (ctx && ctx.target) {
      const dmg = 10 + Math.floor(p.int * 0.5);
      ctx.target.currentHp -= dmg;
      return { log: `【秘法箭】命中！造成 ${dmg} 魔法傷害。` };
    }
    return null;
  },
  lifesteal15: (p, ctx) => {
    if (ctx && ctx.damage) {
      const heal = Math.floor(ctx.damage * 0.15);
      p.hp = Math.min(p.hpMax, p.hp + heal);
      return { log: `【吸血】恢復 ${heal} HP。` };
    }
    return null;
  },
  selfHurt3: (p) => {
    p.hp -= 3;
    return { log: '【詛咒之刃】反噬 -3 HP。' };
  },
  healPct10: (p) => {
    const heal = Math.floor(p.hpMax * 0.1);
    p.hp = Math.min(p.hpMax, p.hp + heal);
    return { log: `【鳳凰】恢復 ${heal} HP。` };
  },
  dragonResist: (p, ctx) => {
    if (ctx && ctx.fromFire) {
      ctx.reduction = (ctx.reduction ?? 0) + 0.3;
    }
    return null;
  },
  bossBonus50: (p, ctx) => {
    if (ctx && ctx.targetIsBoss) {
      ctx.bonus = (ctx.bonus ?? 0) + 0.5;
    }
    return null;
  },
  firstStrike: (p, ctx) => {
    if (ctx) ctx.firstStrike = true;
    return { log: '【次元先攻】你率先出手！' };
  },
  doubleStep: (p, ctx) => {
    if (ctx) ctx.steps = (ctx.steps ?? 1) + 1;
    return null;
  }
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

// 計算當前屬性（含裝備、talent 加成）
export function computeStats(player) {
  const baseStats = { str: 0, agi: 0, int: 0, vit: 0, lck: 0, atk: 0, def: 0, spd: 0, hpMax: 0, critRate: 0, critMult: 0, apBonus: 0 };
  const talents = player.talents ?? [];
  for (const t of talents) {
    const effects = Array.isArray(t.effect) ? t.effect : [t.effect];
    for (const eff of effects) {
      if (eff?.type === 'stat_mod') {
        for (const k in eff.mods) {
          baseStats[k] = (baseStats[k] ?? 0) + eff.mods[k];
        }
      }
    }
  }
  // 裝備
  const equip = player.equipment ?? {};
  for (const slot in equip) {
    const it = equip[slot];
    if (!it) continue;
    for (const k of ['str', 'agi', 'int', 'vit', 'lck', 'atk', 'def', 'hpMax', 'critRate']) {
      if (it[k]) baseStats[k] += it[k];
    }
  }
  // 夥伴加成
  for (const id in player.affinity ?? {}) {
    const aff = player.affinity[id];
    const min = (player.npcData?.[id]?.affAt) ?? 999;
    if (aff >= min) {
      const npcCombat = player.npcData?.[id]?.combat ?? {};
      if (npcCombat.allStats) {
        baseStats.str += npcCombat.allStats;
        baseStats.agi += npcCombat.allStats;
        baseStats.int += npcCombat.allStats;
        baseStats.vit += npcCombat.allStats;
        baseStats.lck += npcCombat.allStats;
      }
    }
  }
  return baseStats;
}

// 套用屬性到玩家物件
export function applyStats(player) {
  const mods = computeStats(player);
  const oldMax = player.hpMax;
  player.str = (player.baseStr ?? 5) + (mods.str ?? 0);
  player.agi = (player.baseAgi ?? 5) + (mods.agi ?? 0);
  player.int = (player.baseInt ?? 5) + (mods.int ?? 0);
  player.vit = (player.baseVit ?? 5) + (mods.vit ?? 0);
  player.lck = (player.baseLck ?? 5) + (mods.lck ?? 0);
  player.hpMax = 50 + player.vit * 10 + (mods.hpMax ?? 0);
  // 戰鬥衍生
  player.atk = player.str * 2 + (mods.atk ?? 0);
  player.def = Math.floor(player.agi * 0.5) + (mods.def ?? 0);
  player.spd = player.agi * 2 + (mods.spd ?? 0);
  player.critRate = (mods.critRate ?? 0);
  player.critMult = 2 + (mods.critMult ?? 0);
  player.apBonus = (mods.apBonus ?? 0);
  if (player.hp > player.hpMax) player.hp = player.hpMax;
  if (oldMax > 0 && player.hpMax > oldMax) {
    player.hp += (player.hpMax - oldMax);
  }
}
