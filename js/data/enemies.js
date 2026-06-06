// 4-Tier 怪物資料庫（含主線 Boss）
// ability: { type, effect, value, duration, trigger_turn, multiplier, threshold_pct, hp_threshold, atk_buff_pct }
//   type: passive | active | phase_change
//   effect: none | vampire | poison | burn_reflection | heavy_smash | execute | aoe_curse | enrage | fireball | stun

export const ENEMIES = {
  // ========== Tier 1 新手村周邊 (Age 6-12) ==========
  M_GOBLIN: { name: '落單的哥布林', tier: 1, hp: 60, atk: 15, def: 3, spd: 8, gold: 15, exp: 10,
    ability: { type: 'passive', effect: 'none' } },
  M_BAT: { name: '巨型吸血蝙蝠', tier: 1, hp: 45, atk: 12, def: 1, spd: 16, gold: 10, exp: 12,
    ability: { type: 'active', trigger_turn: 2, effect: 'vampire', value: 5 } },
  M_WOLF: { name: '狂暴野犬', tier: 1, hp: 80, atk: 20, def: 5, spd: 12, gold: 18, exp: 15,
    ability: { type: 'passive', effect: 'none' } },
  M_SLIME: { name: '腐蝕史萊姆', tier: 1, hp: 50, atk: 10, def: 4, spd: 5, gold: 12, exp: 8,
    ability: { type: 'active', trigger_turn: 3, effect: 'poison', value: 5, duration: 3 } },

  // ========== Tier 2 迷霧森林 (Age 13-22) ==========
  M_SPIDER: { name: '魔暴蜘蛛', tier: 2, hp: 300, atk: 45, def: 15, spd: 22, gold: 75, exp: 80,
    ability: { type: 'active', trigger_turn: 1, effect: 'poison', value: 15, duration: 3 } },
  M_GOBLIN_KING: { name: '哥布林王', tier: 2, hp: 450, atk: 60, def: 20, spd: 18, gold: 150, exp: 150,
    ability: { type: 'active', trigger_turn: 2, effect: 'heavy_smash', multiplier: 1.5 } },
  M_LICH_APPRENTICE: { name: '巫妖學徒', tier: 2, hp: 280, atk: 70, def: 10, spd: 25, gold: 200, exp: 180,
    ability: { type: 'active', trigger_turn: 2, effect: 'fireball', value: 80 } },
  M_DIRE_BOAR: { name: '恐懼魔豬', tier: 2, hp: 600, atk: 50, def: 25, spd: 14, gold: 100, exp: 120,
    ability: { type: 'passive', effect: 'none' } },

  // 主線 Boss
  M_BOSS_DEMON_VANGUARD: { name: '【主線Boss】魔王軍先鋒官', tier: 2, hp: 900, atk: 85, def: 30, spd: 14, gold: 500, exp: 400, isBoss: true, mainBoss: 'age_16',
    ability: { type: 'active', trigger_turn: 3, effect: 'heavy_smash', multiplier: 1.75 } },
  M_RYAN: { name: '天才萊恩', tier: 2, hp: 600, atk: 75, def: 25, spd: 50, gold: 0, exp: 200, isBoss: true, mainBoss: 'age_20', isDuel: true,
    ability: { type: 'active', trigger_turn: 2, effect: 'heavy_smash', multiplier: 1.3 } },

  // ========== Tier 3 遠古遺蹟/活火山 (Age 23-35) ==========
  M_HELLHOUND: { name: '地獄熔岩犬', tier: 3, hp: 750, atk: 120, def: 50, spd: 28, gold: 180, exp: 250,
    ability: { type: 'passive', effect: 'burn_reflection', value: 10 } },
  M_INFERNAL_GUARDIAN: { name: '炎魔守護者', tier: 3, hp: 1200, atk: 150, def: 70, spd: 22, gold: 350, exp: 400,
    ability: { type: 'active', trigger_turn: 2, effect: 'fireball', value: 200 } },
  M_LICH: { name: '巫妖', tier: 3, hp: 1500, atk: 180, def: 60, spd: 30, gold: 400, exp: 500,
    ability: { type: 'active', trigger_turn: 2, effect: 'aoe_curse', value: 20 } },
  M_BONE_DRAGON: { name: '骸骨龍', tier: 3, hp: 2500, atk: 220, def: 80, spd: 20, gold: 600, exp: 800,
    ability: { type: 'phase_change', hp_threshold: 1250, effect: 'enrage', atk_buff_pct: 30 } },

  // 主線 Boss
  M_DULLAHAN: { name: '【主線Boss】無頭騎士·杜拉漢', tier: 3, hp: 2800, atk: 210, def: 90, spd: 25, gold: 1200, exp: 1500, isBoss: true, mainBoss: 'age_28',
    ability: { type: 'active', trigger_turn: 4, effect: 'execute', threshold_pct: 25 } },

  // ========== Tier 4 魔王城核心 (Age 36-40) ==========
  M_FALLEN_ANGEL: { name: '墮落熾天使', tier: 4, hp: 2200, atk: 290, def: 120, spd: 40, gold: 500, exp: 800,
    ability: { type: 'active', trigger_turn: 2, effect: 'aoe_curse', value: 20 } },
  M_DEMON_GENERAL: { name: '魔王軍大將', tier: 4, hp: 4000, atk: 380, def: 160, spd: 30, gold: 1000, exp: 1500,
    ability: { type: 'active', trigger_turn: 3, effect: 'heavy_smash', multiplier: 2.0 } },
  M_VOID_LORD: { name: '虛空領主', tier: 4, hp: 6000, atk: 450, def: 180, spd: 35, gold: 2000, exp: 3000,
    ability: { type: 'phase_change', hp_threshold: 3000, effect: 'enrage', atk_buff_pct: 50 } },

  // 終焉 Boss
  M_ASTAROTH: { name: '【終焉魔王】阿撒茲勒', tier: 4, hp: 12000, atk: 550, def: 220, spd: 35, gold: 9999, exp: 9999, isBoss: true, mainBoss: 'age_40',
    ability: { type: 'phase_change', hp_threshold: 6000, effect: 'enrage', atk_buff_pct: 50 } }
};

// 各年齡段冒險可遇怪物
export const STAGE_ENEMIES = {
  童年: ['M_GOBLIN', 'M_BAT', 'M_WOLF', 'M_SLIME'],
  少年: ['M_GOBLIN', 'M_BAT', 'M_WOLF', 'M_SLIME', 'M_SPIDER', 'M_DIRE_BOAR'],
  青年: ['M_SPIDER', 'M_GOBLIN_KING', 'M_LICH_APPRENTICE', 'M_DIRE_BOAR'],
  壯年: ['M_HELLHOUND', 'M_INFERNAL_GUARDIAN', 'M_LICH', 'M_BONE_DRAGON'],
  老年: ['M_FALLEN_ANGEL', 'M_DEMON_GENERAL', 'M_VOID_LORD']
};

export function getStageByAge(age) {
  if (age < 10) return '童年';
  if (age < 18) return '少年';
  if (age < 30) return '青年';
  if (age < 50) return '壯年';
  return '老年';
}

export function getStageEnemies(age) {
  return STAGE_ENEMIES[getStageByAge(age)] ?? STAGE_ENEMIES.青年;
}

export function getMainStoryBoss(age) {
  const map = {
    16: 'M_BOSS_DEMON_VANGUARD',
    20: 'M_RYAN',
    24: 'M_HELLHOUND',
    28: 'M_DULLAHAN',
    40: 'M_ASTAROTH'
  };
  return map[age] ?? null;
}

export function makeEnemyInstance(enemyId) {
  const data = ENEMIES[enemyId];
  if (!data) return null;
  return {
    ...data,
    instanceId: enemyId,
    currentHp: data.hp,
    turn: 0,
    abilityTriggered: false,
    enrageActive: false,
    baseAtk: data.atk
  };
}
