/* =============================================================
   skills.js  — skill data
   Exposed as window.SKILLS (object: id -> skill)
   ============================================================= */
(function (global) {
  'use strict';

  // type: 'phys' | 'mag' | 'util' | 'heal' | 'buff' | 'debuff'
  // cost: MP cost
  // cd:   cooldown turns
  // power: damage multiplier (for phys/mag/debuff with dmg)
  // effect: { kind, ... }  e.g. { kind:'heal', pct:0.4, mag:1.0 }
  //                       { kind:'buff', stat:'def', amount:0.4, dur:1 }
  //                       { kind:'debuff', status:'stun', chance:0.4, dur:1 }
  //                       { kind:'dmg', power:1.6 }   (just damage, no debuff)
  //                       { kind:'lifesteal', power:1.6, ratio:0.3 }
  //                       { kind:'cultivation', amount:20 }   (skip turn)
  //                       { kind:'defend' }   (halve next incoming)
  // require: { realm:'lianqi', layer:0 }   (minimum realm)
  // tags:    array, used in tooltips

  const SKILLS = {
    strike: {
      id: 'strike', name: '攻击', type: 'phys', cost: 0, cd: 0, power: 1.0,
      desc: '基础物理攻击，无消耗。',
      tags: ['基础'],
    },
    sword_qi: {
      id: 'sword_qi', name: '灵剑术', type: 'phys', cost: 5, cd: 2, power: 1.4,
      desc: '凝聚剑气，斩敌于无形。',
      require: { realm: 'lianqi', layer: 0 },
      tags: ['物理', '入门'],
    },
    golden_light: {
      id: 'golden_light', name: '金光咒', type: 'mag', cost: 8, cd: 3, power: 1.5,
      effect: { kind: 'buff', stat: 'defPct', amount: 0.5, dur: 1 },
      desc: '金光护体，防御大增。',
      require: { realm: 'lianqi', layer: 1 },
      tags: ['法术', '防御'],
    },
    heal: {
      id: 'heal', name: '治愈术', type: 'mag', cost: 10, cd: 2, power: 0,
      effect: { kind: 'heal', pct: 0.4, magScale: 1.0 },
      desc: '温养经络，恢复气血。',
      require: { realm: 'lianqi', layer: 0 },
      tags: ['治疗'],
    },
    thunder: {
      id: 'thunder', name: '五行雷法', type: 'mag', cost: 18, cd: 4, power: 2.2,
      desc: '召引天雷，势不可挡。',
      require: { realm: 'zhuji', layer: 0 },
      tags: ['法术', '高伤'],
    },
    sword_flight: {
      id: 'sword_flight', name: '御剑术', type: 'phys', cost: 12, cd: 5, power: 1.6,
      effect: { kind: 'armor_pierce', pct: 0.2 },
      desc: '飞剑凌空，刺穿护甲。',
      require: { realm: 'zhuji', layer: 0 },
      tags: ['物理', '破甲'],
    },
    soul_out: {
      id: 'soul_out', name: '元神出窍', type: 'mag', cost: 30, cd: 6, power: 2.5,
      effect: { kind: 'debuff', status: 'stun', chance: 0.4, dur: 1 },
      desc: '神魂离体，摄人心魄。',
      require: { realm: 'jindan', layer: 0 },
      tags: ['法术', '控制'],
    },
    devour: {
      id: 'devour', name: '吞噬', type: 'phys', cost: 15, cd: 4, power: 1.8,
      effect: { kind: 'lifesteal', ratio: 0.3 },
      desc: '魔功噬血，回养己身。',
      require: { realm: 'zhuji', layer: 1 },
      tags: ['物理', '吸血', '魔道'],
    },
    ice_seal: {
      id: 'ice_seal', name: '玄冰诀', type: 'mag', cost: 14, cd: 3, power: 1.7,
      effect: { kind: 'debuff', status: 'stun', chance: 0.35, dur: 1 },
      desc: '寒气封身，冻彻骨髓。',
      require: { realm: 'lianqi', layer: 4 },
      tags: ['法术', '冰'],
    },
    blood_curse: {
      id: 'blood_curse', name: '血咒', type: 'mag', cost: 22, cd: 5, power: 2.0,
      effect: { kind: 'debuff', status: 'vulnerable', chance: 0.7, dur: 2 },
      desc: '以血为引，弱敌之势。',
      require: { realm: 'zhuji', layer: 2 },
      tags: ['法术', '易伤', '魔道'],
    },
    meditation: {
      id: 'meditation', name: '静心打坐', type: 'util', cost: 0, cd: 0, power: 0,
      effect: { kind: 'cultivation', amount: 18 },
      desc: '于静中蓄养修为。（跳过本回合）',
      tags: ['修炼'],
    },
    defend: {
      id: 'defend', name: '防御', type: 'util', cost: 0, cd: 0, power: 0,
      effect: { kind: 'defend' },
      desc: '凝神固守，减免下回合所受伤害一半。',
      tags: ['防御'],
    },
    five_thunder: {
      id: 'five_thunder', name: '五雷轰顶', type: 'mag', cost: 25, cd: 5, power: 2.4,
      effect: { kind: 'debuff', status: 'stun', chance: 0.25, dur: 1 },
      desc: '五雷齐下，势不可当。',
      require: { realm: 'jindan', layer: 0 },
      tags: ['法术', '群伤'],
    },
  };

  // Status effect definitions (referenced by skills/enemies)
  const STATUS = {
    poison:     { name: '中毒', kind: 'dot',   pct: 0.05 },
    burn:       { name: '灼烧', kind: 'dot',   pct: 0.08, decay: true },
    regen:      { name: '再生', kind: 'hot',   pct: 0.06 },
    stun:       { name: '眩晕', kind: 'skip' },
    vulnerable: { name: '易伤', kind: 'mult',  incDmg: 0.25 },
    weak:       { name: '虚弱', kind: 'mult',  outDmg: -0.25 },
    defend:     { name: '护体', kind: 'shield', factor: 0.5 },
  };

  global.SKILLS = SKILLS;
  global.STATUS = STATUS;
})(window);
