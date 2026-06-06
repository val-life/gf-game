// 天賦池。rarity: common/rare/epic/legendary/mythic
// effect 類型: stat_mod | hook | both
export const TALENTS = [
  // ========== 普通 ==========
  {
    id: 't_strong_body',
    name: '強健身軀',
    rarity: 'common',
    desc: '天生體魄過人。力量 +3，體質 +2。',
    effect: { type: 'stat_mod', mods: { str: 3, vit: 2 }, mode: 'flat' }
  },
  {
    id: 't_quick_mind',
    name: '敏捷思維',
    rarity: 'common',
    desc: '反應迅速。敏捷 +3，幸運 +1。',
    effect: { type: 'stat_mod', mods: { agi: 3, lck: 1 }, mode: 'flat' }
  },
  {
    id: 't_bookworm',
    name: '書蟲之子',
    rarity: 'common',
    desc: '過目不忘。智力 +4。',
    effect: { type: 'stat_mod', mods: { int: 4 }, mode: 'flat' }
  },
  {
    id: 't_lucky_star',
    name: '幸運星',
    rarity: 'common',
    desc: '吉星高照。幸運 +3。',
    effect: { type: 'stat_mod', mods: { lck: 3 }, mode: 'flat' }
  },
  {
    id: 't_peasant',
    name: '農家子弟',
    rarity: 'common',
    desc: '每年勞作多得 5 金幣。',
    effect: { type: 'hook', hook: 'onYearEnd', fn: 'gainGold5' }
  },
  {
    id: 't_tough_skin',
    name: '厚皮',
    rarity: 'common',
    desc: '最大 HP +20。',
    effect: { type: 'stat_mod', mods: { hpMax: 20 }, mode: 'flat' }
  },

  // ========== 稀有 ==========
  {
    id: 't_born_swift',
    name: '天生神速',
    rarity: 'rare',
    desc: '敏捷 +5，戰鬥中閃避率 +15%。',
    effect: [
      { type: 'stat_mod', mods: { agi: 5 }, mode: 'flat' },
      { type: 'hook', hook: 'onCombatDodge', fn: 'dodgeBonus15' }
    ]
  },
  {
    id: 't_blood_knight',
    name: '鮮血騎士',
    rarity: 'rare',
    desc: '力量 +4，每場戰鬥開始 HP 滿血。',
    effect: [
      { type: 'stat_mod', mods: { str: 4 }, mode: 'flat' },
      { type: 'hook', hook: 'onCombatStart', fn: 'fullHeal' }
    ]
  },
  {
    id: 't_scholar',
    name: '學者之魂',
    rarity: 'rare',
    desc: '智力 +5，研究消耗 AP 減 1（最少 1）。',
    effect: [
      { type: 'stat_mod', mods: { int: 5 }, mode: 'flat' },
      { type: 'hook', hook: 'onStudyCost', fn: 'studyDiscount' }
    ]
  },
  {
    id: 't_merchants_blood',
    name: '商人血脈',
    rarity: 'rare',
    desc: '商店價格 -20%。',
    effect: { type: 'hook', hook: 'onShopPrice', fn: 'shopDiscount20' }
  },
  {
    id: 't_iron_will',
    name: '鋼鐵意志',
    rarity: 'rare',
    desc: '體質 +5，HP 歸零時有一次 30% 機率復活（HP 1）。',
    effect: [
      { type: 'stat_mod', mods: { vit: 5 }, mode: 'flat' },
      { type: 'hook', hook: 'onFatalDamage', fn: 'revive30' }
    ]
  },
  {
    id: 't_berserker',
    name: '狂戰士',
    rarity: 'rare',
    desc: 'HP 低於 30% 時，攻擊力 +50%。',
    effect: { type: 'hook', hook: 'onAtkCalc', fn: 'berserk' }
  },

  // ========== 史詩 ==========
  {
    id: 't_arcane_mage',
    name: '秘法師',
    rarity: 'epic',
    desc: '智力 +8，每場戰鬥施放「秘法箭」造成 10 + 智力 0.5 傷害。',
    effect: [
      { type: 'stat_mod', mods: { int: 8 }, mode: 'flat' },
      { type: 'hook', hook: 'onTurnStart', fn: 'arcaneBolt' }
    ]
  },
  {
    id: 't_vampire',
    name: '吸血鬼之牙',
    rarity: 'epic',
    desc: '戰鬥中造成傷害的 15% 轉化為自身 HP。',
    effect: { type: 'hook', hook: 'onDealDamage', fn: 'lifesteal15' }
  },
  {
    id: 't_cursed_blade',
    name: '詛咒之刃',
    rarity: 'epic',
    desc: '攻擊力 +10，每回合失去 3 HP。',
    effect: [
      { type: 'stat_mod', mods: { atk: 10 }, mode: 'flat' },
      { type: 'hook', hook: 'onTurnEnd', fn: 'selfHurt3' }
    ]
  },
  {
    id: 't_phoenix',
    name: '鳳凰之心',
    rarity: 'epic',
    desc: '每年自動恢復滿 HP。死亡時必定復活一次。',
    effect: [
      { type: 'hook', hook: 'onYearEnd', fn: 'fullHeal' },
      { type: 'hook', hook: 'onFatalDamage', fn: 'revive100' }
    ]
  },
  {
    id: 't_dragon_blood',
    name: '龍裔血脈',
    rarity: 'epic',
    desc: '最大 HP +50，火系敵人受到你時傷害 -30%。',
    effect: [
      { type: 'stat_mod', mods: { hpMax: 50 }, mode: 'flat' },
      { type: 'hook', hook: 'onTakeDamage', fn: 'dragonResist' }
    ]
  },

  // ========== 傳說 ==========
  {
    id: 't_immortal',
    name: '不朽之身',
    rarity: 'legendary',
    desc: '所有屬性 +5，最大 HP +80，攻擊力 +10。',
    effect: { type: 'stat_mod', mods: { str: 5, agi: 5, int: 5, vit: 5, lck: 5, hpMax: 80, atk: 10 }, mode: 'flat' }
  },
  {
    id: 't_world_savior',
    name: '世界救世主',
    rarity: 'legendary',
    desc: '戰鬥中每回合恢復 10% 最大 HP，攻擊力 +15。',
    effect: [
      { type: 'stat_mod', mods: { atk: 15 }, mode: 'flat' },
      { type: 'hook', hook: 'onTurnStart', fn: 'healPct10' }
    ]
  },
  {
    id: 't_fate_weaver',
    name: '命運編織者',
    rarity: 'legendary',
    desc: '暴擊率 +25%，暴擊傷害 2.5 倍。幸運 +8。',
    effect: [
      { type: 'stat_mod', mods: { lck: 8, critRate: 25, critMult: 0.5 }, mode: 'flat' }
    ]
  },
  {
    id: 't_dimension_walker',
    name: '次元行者',
    rarity: 'legendary',
    desc: '每年 AP +1，冒險可前進 2 步。',
    effect: [
      { type: 'stat_mod', mods: { apBonus: 1 }, mode: 'flat' },
      { type: 'hook', hook: 'onAdvStep', fn: 'doubleStep' }
    ]
  },

  // ========== 神話（需解鎖） ==========
  {
    id: 't_god_slayer',
    name: '弒神者',
    rarity: 'mythic',
    desc: '攻擊力 +30，暴擊率 +30%，對 Boss 傷害 +50%。',
    effect: [
      { type: 'stat_mod', mods: { atk: 30, critRate: 30 }, mode: 'flat' },
      { type: 'hook', hook: 'onDealDamage', fn: 'bossBonus50' }
    ],
    locked: true
  },
  {
    id: 't_eternal',
    name: '永恆輪迴',
    rarity: 'mythic',
    desc: '所有戰鬥必定先手，死亡 3 次內不進入 Game Over。',
    effect: [
      { type: 'hook', hook: 'onCombatStart', fn: 'firstStrike' },
      { type: 'hook', hook: 'onFatalDamage', fn: 'revive100_3times' }
    ],
    locked: true
  }
];

export const RARITY_WEIGHT = {
  common: 50,
  rare: 30,
  epic: 14,
  legendary: 5,
  mythic: 1
};

export const RARITY_COLOR = {
  common: '#b0b0b0',
  rare: '#3fa0ff',
  epic: '#b04fff',
  legendary: '#ffaa20',
  mythic: '#ff4080'
};
