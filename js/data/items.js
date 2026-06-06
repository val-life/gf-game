// 物品池（v2：六維 + 主線裝備）
// mod keys: str/con/dex/int/cha/luk/atk/def/maxHp/critPct/dodgePct/spd/fireResist

export const ITEMS = {
  // 武器
  rusty_sword: { name: '生鏽鐵劍', type: 'weapon', price: 20, atk: 5, desc: '勉強能用的舊劍。' },
  iron_sword: { name: '精鋼長劍', type: 'weapon', price: 80, atk: 12, desc: '可靠的戰劍。' },
  silver_sword: { name: '銀月細劍', type: 'weapon', price: 200, atk: 22, dex: 2, desc: '輕巧鋒利，靈巧者首選。' },
  flame_blade: { name: '烈焰之刃', type: 'weapon', price: 450, atk: 35, str: 3, desc: '劍身纏繞火焰。' },
  god_slayer: { name: '破曉之劍', type: 'weapon', price: 1500, atk: 60, str: 5, critPct: 10, desc: '傳說中的神兵。' },
  broken_sword: { name: '【祖傳】斷裂的聖劍', type: 'weapon', price: 0, atk: 25, str: 8, desc: '祖傳寶劍，雖斷猶利。' },
  hourglass: { name: '【神器】時之沙漏', type: 'accessory', price: 0, dex: 15, spd: 5, desc: '掌握時間的神器。' },
  golden_feather: { name: '【神器】金羽', type: 'accessory', price: 0, luk: 20, cha: 10, desc: '三大隨機神器之一。' },
  holy_grail: { name: '【聖物】精靈聖杯', type: 'accessory', price: 0, maxHp: 200, int: 10, cha: 10, desc: '可破不死身的聖杯。' },
  dragon_heart: { name: '【寶物】龍心', type: 'accessory', price: 0, atk: 30, maxHp: 100, desc: '蘊含遠古巨龍之力。' },

  // 防具
  leather_armor: { name: '皮甲', type: 'armor', price: 25, def: 4, maxHp: 10, desc: '基本防具。' },
  chainmail: { name: '鎖子甲', type: 'armor', price: 100, def: 10, maxHp: 25, desc: '金屬環編織的護甲。' },
  plate_armor: { name: '板甲', type: 'armor', price: 300, def: 20, maxHp: 60, con: 2, desc: '厚重可靠的全身甲。' },
  dragon_scale: { name: '龍鱗鎧', type: 'armor', price: 1000, def: 40, maxHp: 150, fireResist: 0.3, desc: '龍鱗鍛造，堅不可摧。' },
  fireproof_cloak: { name: '【關鍵】防火披風', type: 'armor', price: 0, def: 10, maxHp: 50, fireResist: 0.5, desc: '火山調查必備。' },

  // 飾品
  amulet_dex: { name: '疾風護符', type: 'accessory', price: 60, dex: 3, desc: '風之精魄凝結。' },
  amulet_int: { name: '智者之眼', type: 'accessory', price: 60, int: 3, desc: '佩戴者思維清晰。' },
  amulet_con: { name: '生命寶石', type: 'accessory', price: 60, con: 3, maxHp: 30, desc: '提升體魄。' },
  ring_power: { name: '力量指環', type: 'accessory', price: 80, str: 3, desc: '蘊含遠古之力。' },
  ring_cha: { name: '魅力墜飾', type: 'accessory', price: 80, cha: 3, desc: '使人心生好感。' },
  vampire_cloak: { name: '吸血鬼披風', type: 'accessory', price: 500, dex: 5, dodgePct: 15, desc: '閃避時恢復 10% HP。' },

  // 消耗
  potion_small: { name: '小型治療藥水', type: 'consumable', price: 15, desc: '恢復 30 HP。', effect: { type: 'heal', value: 30 } },
  potion_large: { name: '大型治療藥水', type: 'consumable', price: 50, desc: '恢復 100 HP。', effect: { type: 'heal', value: 100 } },
  elixir: { name: '萬靈丹', type: 'consumable', price: 200, desc: 'HP 全滿。', effect: { type: 'heal', value: 9999 } },
  magic_water: { name: '魔力泉水', type: 'consumable', price: 30, desc: '智力 +1（永久）。', effect: { type: 'permInt', value: 1 } },
  mystery_pill: { name: '神秘丹藥', type: 'consumable', price: 0, desc: '未知的丹藥。', effect: { type: 'random', value: 0 } }
};

export const SHOP_POOL_BY_STAGE = {
  童年: ['rusty_sword', 'leather_armor', 'potion_small', 'amulet_dex'],
  少年: ['iron_sword', 'chainmail', 'potion_small', 'potion_large', 'amulet_int', 'ring_power'],
  青年: ['silver_sword', 'plate_armor', 'potion_large', 'amulet_dex', 'amulet_int', 'ring_power', 'ring_cha'],
  壯年: ['flame_blade', 'dragon_scale', 'elixir', 'potion_large', 'vampire_cloak', 'amulet_con'],
  老年: ['god_slayer', 'dragon_scale', 'elixir', 'magic_water']
};

export function pickShopItems(age, count = 3) {
  const stage = getStageByAge(age);
  let pool = [...(SHOP_POOL_BY_STAGE[stage] ?? SHOP_POOL_BY_STAGE.青年)];
  const result = [];
  for (let i = 0; i < count && pool.length > 0; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    const id = pool.splice(idx, 1)[0];
    result.push({ id, ...ITEMS[id], instanceId: 'shop-' + Math.random().toString(36).slice(2) });
  }
  return result;
}

function getStageByAge(age) {
  if (age < 10) return '童年';
  if (age < 18) return '少年';
  if (age < 30) return '青年';
  if (age < 50) return '壯年';
  return '老年';
}
