// 天賦池（v2：六維屬性）
// mods keys: str, con, dex, int, cha, luk, atk, def, maxHp, critPct, dodgePct, spd
export const TALENTS = [
  // ========== 普通 ==========
  {
    id: 't_strong_body', name: '強健身軀', rarity: 'common',
    desc: '天生的力量。力量 +3，體質 +2。',
    effect: { type: 'stat_mod', mods: { str: 3, con: 2 }, mode: 'flat' }
  },
  {
    id: 't_quick_hand', name: '靈巧之手', rarity: 'common',
    desc: '反應迅捷。靈巧 +3，幸運 +1。',
    effect: { type: 'stat_mod', mods: { dex: 3, luk: 1 }, mode: 'flat' }
  },
  {
    id: 't_bookworm', name: '書蟲之子', rarity: 'common',
    desc: '過目不忘。智力 +4。',
    effect: { type: 'stat_mod', mods: { int: 4 }, mode: 'flat' }
  },
  {
    id: 't_charming', name: '天生意氣', rarity: 'common',
    desc: '討人喜歡。魅力 +3。',
    effect: { type: 'stat_mod', mods: { cha: 3 }, mode: 'flat' }
  },
  {
    id: 't_lucky_star', name: '幸運星', rarity: 'common',
    desc: '吉星高照。幸運 +3，每年初始零用錢增加。',
    effect: { type: 'stat_mod', mods: { luk: 3 }, mode: 'flat' }
  },
  {
    id: 't_tough_skin', name: '厚皮', rarity: 'common',
    desc: '皮糙肉厚。最大 HP +30。',
    effect: { type: 'stat_mod', mods: { maxHp: 30 }, mode: 'flat' }
  },

  // ========== 稀有 ==========
  {
    id: 't_born_swift', name: '天生神速', rarity: 'rare',
    desc: '靈巧 +5，閃避率 +15%。',
    effect: [
      { type: 'stat_mod', mods: { dex: 5 }, mode: 'flat' },
      { type: 'hook', hook: 'onCombatDodge', fn: 'dodgeBonus15' }
    ]
  },
  {
    id: 't_blood_knight', name: '鮮血騎士', rarity: 'rare',
    desc: '力量 +4，每場戰鬥開始 HP 滿血。',
    effect: [
      { type: 'stat_mod', mods: { str: 4 }, mode: 'flat' },
      { type: 'hook', hook: 'onCombatStart', fn: 'fullHeal' }
    ]
  },
  {
    id: 't_scholar', name: '學者之魂', rarity: 'rare',
    desc: '智力 +5，研究消耗 AP 減 1。',
    effect: [
      { type: 'stat_mod', mods: { int: 5 }, mode: 'flat' },
      { type: 'hook', hook: 'onStudyCost', fn: 'studyDiscount' }
    ]
  },
  {
    id: 't_merchants_blood', name: '商人血脈', rarity: 'rare',
    desc: '商店價格 -20%。',
    effect: { type: 'hook', hook: 'onShopPrice', fn: 'shopDiscount20' }
  },
  {
    id: 't_iron_will', name: '鋼鐵意志', rarity: 'rare',
    desc: '體質 +5，HP 歸零時 30% 機率復活。',
    effect: [
      { type: 'stat_mod', mods: { con: 5 }, mode: 'flat' },
      { type: 'hook', hook: 'onFatalDamage', fn: 'revive30' }
    ]
  },
  {
    id: 't_berserker', name: '狂戰士', rarity: 'rare',
    desc: 'HP 低於 30% 時，攻擊力 +50%。',
    effect: { type: 'hook', hook: 'onAtkCalc', fn: 'berserk' }
  },

  // ========== 史詩 ==========
  {
    id: 't_arcane_mage', name: '秘法師', rarity: 'epic',
    desc: '智力 +8，每場戰鬥施放秘法箭造成 10+智力/2 傷害。',
    effect: [
      { type: 'stat_mod', mods: { int: 8 }, mode: 'flat' },
      { type: 'hook', hook: 'onTurnStart', fn: 'arcaneBolt' }
    ]
  },
  {
    id: 't_vampire', name: '吸血鬼之牙', rarity: 'epic',
    desc: '戰鬥中造成傷害的 15% 轉化為自身 HP。',
    effect: { type: 'hook', hook: 'onDealDamage', fn: 'lifesteal15' }
  },
  {
    id: 't_cursed_blade', name: '詛咒之刃', rarity: 'epic',
    desc: '攻擊力 +10，每回合失去 3 HP。',
    effect: [
      { type: 'stat_mod', mods: { atk: 10 }, mode: 'flat' },
      { type: 'hook', hook: 'onTurnEnd', fn: 'selfHurt3' }
    ]
  },
  {
    id: 't_phoenix', name: '不死鳥之心', rarity: 'epic',
    desc: '每年自動恢復滿 HP。死亡時必定復活一次。',
    effect: [
      { type: 'hook', hook: 'onYearEnd', fn: 'fullHeal' },
      { type: 'hook', hook: 'onFatalDamage', fn: 'revive100' }
    ]
  },
  {
    id: 't_dragon_blood', name: '龍裔血脈', rarity: 'epic',
    desc: '最大 HP +50，火系敵人傷害 -30%。',
    effect: [
      { type: 'stat_mod', mods: { maxHp: 50 }, mode: 'flat' },
      { type: 'hook', hook: 'onTakeDamage', fn: 'dragonResist' }
    ]
  },

  // ========== 傳說 ==========
  {
    id: 't_immortal', name: '不朽之身', rarity: 'legendary',
    desc: '所有屬性 +5，HP +80，攻擊 +10。',
    effect: { type: 'stat_mod', mods: { str: 5, con: 5, dex: 5, int: 5, cha: 5, luk: 5, maxHp: 80, atk: 10 }, mode: 'flat' }
  },
  {
    id: 't_world_savior', name: '世界救世主', rarity: 'legendary',
    desc: '戰鬥中每回合恢復 10% HP，攻擊 +15。',
    effect: [
      { type: 'stat_mod', mods: { atk: 15 }, mode: 'flat' },
      { type: 'hook', hook: 'onTurnStart', fn: 'healPct10' }
    ]
  },
  {
    id: 't_fate_weaver', name: '命運編織者', rarity: 'legendary',
    desc: '暴擊率 +25%，暴擊傷害 ×2.5。幸運 +8。',
    effect: { type: 'stat_mod', mods: { luk: 8, critPct: 25 }, mode: 'flat' }
  },
  {
    id: 't_dimension_walker', name: '次元行者', rarity: 'legendary',
    desc: '每年 AP +1，冒險可前進 2 步。',
    effect: [
      { type: 'stat_mod', mods: { atk: 0, maxHp: 0 }, mode: 'flat' },
      { type: 'hook', hook: 'onAdvStep', fn: 'doubleStep' }
    ]
  },
  {
    id: 't_paladin', name: '聖光騎士', rarity: 'legendary',
    desc: '體質 +10，力量 +5，每回合恢復 5% HP。',
    effect: { type: 'stat_mod', mods: { con: 10, str: 5 }, mode: 'flat' }
  },

  // ========== 神話（需解鎖） ==========
  {
    id: 't_god_slayer', name: '弒神者', rarity: 'mythic',
    desc: '攻擊 +30，暴擊率 +30%，對 Boss 傷害 +50%。',
    effect: [
      { type: 'stat_mod', mods: { atk: 30, critPct: 30 }, mode: 'flat' },
      { type: 'hook', hook: 'onDealDamage', fn: 'bossBonus50' }
    ],
    locked: true
  },
  {
    id: 't_eternal', name: '永恆輪迴', rarity: 'mythic',
    desc: '戰鬥必定先手，死亡 3 次內不 Game Over。',
    effect: [
      { type: 'hook', hook: 'onCombatStart', fn: 'firstStrike' },
      { type: 'hook', hook: 'onFatalDamage', fn: 'revive100_3times' }
    ],
    locked: true
  },
  {
    id: 't_world_creator', name: '創世者', rarity: 'mythic',
    desc: '六維 +20，HP +200，攻擊 +30，敵人全屬性 -10%。',
    effect: { type: 'stat_mod', mods: { str: 20, con: 20, dex: 20, int: 20, cha: 20, luk: 20, maxHp: 200, atk: 30 }, mode: 'flat' },
    locked: true
  }
];

export const RARITY_WEIGHT = {
  common: 50, rare: 30, epic: 14, legendary: 5, mythic: 1
};

export const RARITY_COLOR = {
  common: '#b0b0b0',
  rare: '#3fa0ff',
  epic: '#b04fff',
  legendary: '#ffaa20',
  mythic: '#ff4080'
};
