// 敵人池。按 ageStage 與 isBoss 標記
// ageStage: 童年(0-9) 少年(10-17) 青年(18-29) 壯年(30-49) 老年(50+)

export const ENEMIES = {
  // 普通怪
  slime: { name: '史萊姆', hp: 20, atk: 4, def: 1, spd: 3, gold: 5, exp: 3, stage: '童年' },
  rat: { name: '巨鼠', hp: 15, atk: 5, def: 0, spd: 6, gold: 4, exp: 3, stage: '童年' },
  wolf: { name: '飢狼', hp: 35, atk: 8, def: 3, spd: 7, gold: 12, exp: 8, stage: '少年' },
  bandit: { name: '山賊', hp: 50, atk: 12, def: 4, spd: 6, gold: 25, exp: 15, stage: '少年' },
  goblin: { name: '哥布林', hp: 40, atk: 10, def: 3, spd: 8, gold: 18, exp: 12, stage: '少年' },
  ogre: { name: '食人魔', hp: 90, atk: 18, def: 8, spd: 4, gold: 50, exp: 30, stage: '青年' },
  orc: { name: '獸人戰士', hp: 80, atk: 20, def: 10, spd: 7, gold: 60, exp: 35, stage: '青年' },
  dark_mage: { name: '暗黑法師', hp: 60, atk: 25, def: 5, spd: 9, gold: 80, exp: 45, stage: '青年' },
  troll: { name: '洞穴巨魔', hp: 150, atk: 30, def: 15, spd: 5, gold: 120, exp: 70, stage: '壯年' },
  lich: { name: '巫妖', hp: 120, atk: 35, def: 12, spd: 10, gold: 180, exp: 100, stage: '壯年' },
  demon: { name: '惡魔', hp: 200, atk: 45, def: 20, spd: 12, gold: 300, exp: 180, stage: '壯年' },
  dragon: { name: '遠古巨龍', hp: 350, atk: 60, def: 30, spd: 14, gold: 600, exp: 350, stage: '老年' },

  // 歲數試煉 Boss
  boss_10: { name: '【試煉】林地巨熊', hp: 80, atk: 15, def: 8, spd: 8, gold: 100, exp: 50, isBoss: true, stage: '少年' },
  boss_18: { name: '【試煉】黑鐵巨魔', hp: 180, atk: 30, def: 15, spd: 8, gold: 250, exp: 150, isBoss: true, stage: '青年' },
  boss_30: { name: '【試煉】暗影龍王', hp: 400, atk: 55, def: 25, spd: 13, gold: 600, exp: 400, isBoss: true, stage: '壯年' },
  boss_50: { name: '【試煉】虛空領主', hp: 700, atk: 80, def: 40, spd: 16, gold: 1500, exp: 1000, isBoss: true, stage: '老年' },

  // 隱藏 Boss
  demon_lord: { name: '【終焉】魔神王', hp: 1200, atk: 120, def: 60, spd: 20, gold: 5000, exp: 3000, isBoss: true, stage: '神話' }
};

// 根據年齡選取冒險可遇敵人
export const STAGE_ENEMIES = {
  童年: ['slime', 'rat'],
  少年: ['wolf', 'bandit', 'goblin'],
  青年: ['ogre', 'orc', 'dark_mage'],
  壯年: ['troll', 'lich', 'demon'],
  老年: ['dragon']
};

export function getStageByAge(age) {
  if (age < 10) return '童年';
  if (age < 18) return '少年';
  if (age < 30) return '青年';
  if (age < 50) return '壯年';
  return '老年';
}

export function getStageEnemies(age) {
  const stage = getStageByAge(age);
  return STAGE_ENEMIES[stage] ?? STAGE_ENEMIES.青年;
}

export function getAgeBoss(age) {
  if (age === 10) return 'boss_10';
  if (age === 18) return 'boss_18';
  if (age === 30) return 'boss_30';
  if (age === 50) return 'boss_50';
  return null;
}

export function makeEnemyInstance(enemyId) {
  const data = ENEMIES[enemyId];
  if (!data) return null;
  return { ...data, currentHp: data.hp };
}
