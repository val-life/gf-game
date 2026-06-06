// 物品池。type: weapon / armor / accessory / consumable
// effect 為 stat 修正或鉤子

export const ITEMS = {
  // 武器
  rusty_sword: { name: '生鏽鐵劍', type: 'weapon', price: 20, atk: 5, desc: '勉強能用的舊劍。' },
  iron_sword: { name: '精鋼長劍', type: 'weapon', price: 80, atk: 12, desc: '可靠的戰劍。' },
  silver_sword: { name: '銀月細劍', type: 'weapon', price: 200, atk: 22, desc: '輕巧鋒利，敏捷者首選。', agi: 2 },
  flame_blade: { name: '烈焰之刃', type: 'weapon', price: 450, atk: 35, desc: '劍身纏繞火焰。', str: 3 },
  god_slayer: { name: '破曉之劍', type: 'weapon', price: 1500, atk: 60, desc: '傳說中的神兵。', str: 5, critRate: 10 },

  // 防具
  leather_armor: { name: '皮甲', type: 'armor', price: 25, def: 4, hpMax: 10, desc: '基本防具。' },
  chainmail: { name: '鎖子甲', type: 'armor', price: 100, def: 10, hpMax: 25, desc: '金屬環編織的護甲。' },
  plate_armor: { name: '板甲', type: 'armor', price: 300, def: 20, hpMax: 60, desc: '厚重可靠的全身甲。' },
  dragon_scale: { name: '龍鱗鎧', type: 'armor', price: 1000, def: 40, hpMax: 150, desc: '龍鱗鍛造，堅不可摧。' },

  // 飾品
  amulet_agi: { name: '疾風護符', type: 'accessory', price: 60, agi: 3, desc: '風之精魄凝結。' },
  amulet_int: { name: '智者之眼', type: 'accessory', price: 60, int: 3, desc: '佩戴者思維清晰。' },
  ring_power: { name: '力量指環', type: 'accessory', price: 80, str: 3, desc: '蘊含遠古之力。' },
  vampire_cloak: { name: '吸血鬼披風', type: 'accessory', price: 500, desc: '閃避時恢復 10% HP。', special: 'dodgeHeal' },

  // 消耗
  potion_small: { name: '小型治療藥水', type: 'consumable', price: 15, desc: '恢復 30 HP。', effect: { type: 'heal', value: 30 } },
  potion_large: { name: '大型治療藥水', type: 'consumable', price: 50, desc: '恢復 100 HP。', effect: { type: 'heal', value: 100 } },
  elixir: { name: '萬靈丹', type: 'consumable', price: 200, desc: 'HP 全滿。', effect: { type: 'heal', value: 9999 } },
  magic_water: { name: '魔力泉水', type: 'consumable', price: 30, desc: '智力 +1（永久）。', effect: { type: 'permInt', value: 1 } },
  mystery_pill: { name: '神秘丹藥', type: 'consumable', price: 0, desc: '未知的丹藥。', effect: { type: 'random', value: 0 } }
};

export const SHOP_POOL_BY_STAGE = {
  童年: ['rusty_sword', 'leather_armor', 'potion_small', 'amulet_agi'],
  少年: ['iron_sword', 'chainmail', 'potion_small', 'potion_large', 'amulet_int', 'ring_power'],
  青年: ['silver_sword', 'plate_armor', 'potion_large', 'amulet_agi', 'amulet_int', 'ring_power'],
  壯年: ['flame_blade', 'dragon_scale', 'elixir', 'potion_large', 'vampire_cloak'],
  老年: ['god_slayer', 'dragon_scale', 'elixir', 'magic_water']
};

export function pickShopItems(age, count = 3) {
  const stage = age < 10 ? '童年' : age < 18 ? '少年' : age < 30 ? '青年' : age < 50 ? '壯年' : '老年';
  let pool = [...SHOP_POOL_BY_STAGE[stage]];
  const result = [];
  for (let i = 0; i < count && pool.length > 0; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    const id = pool.splice(idx, 1)[0];
    result.push({ id, ...ITEMS[id], instanceId: crypto.randomUUID() });
  }
  return result;
}
