/* =============================================================
   items.js — item definitions
   Exposed as window.ITEMS (object: id -> item)
   ============================================================= */
(function (global) {
  'use strict';

  // Item shapes:
  //  type: 'weapon' | 'armor' | 'accessory' | 'consumable' | 'manual' | 'quest' | 'material'
  //  name, desc, value (língshí price)
  //  stats: { atk, def, mag, res, spd, hp, mp, crit, qiyun, ... }   (delta)
  //  req:   { realm:'lianqi', layer:0 }                             (use/equip gate)
  //  effect (consumables): { kind:'heal_hp_pct', pct:0.3 }
  //                       { kind:'heal_mp_pct', pct:0.3 }
  //                       { kind:'cultivation', amount:30 }
  //                       { kind:'breakthrough_pill', bonus:0.2 }
  //                       { kind:'cure', status:'poison' }
  //                       { kind:'qiyun', amount:1 }      (temp qiyun buff via flag)
  //                       { kind:'age', amount:-1 }
  //  learn (manual): skillId
  //  stackable: boolean (default true except weapon/armor/accessory/quest)

  const ITEMS = {
    // ---- Weapons ----
    iron_sword:  { id:'iron_sword',  type:'weapon', name:'青钢长剑', desc:'寻常铁匠所铸，锋利耐久。', stats:{ atk:5 }, value:25 },
    jade_dagger: { id:'jade_dagger', type:'weapon', name:'碧玉短刃', desc:'温润碧玉所雕，隐隐泛光。', stats:{ atk:6, spd:2 }, value:60, req:{ realm:'lianqi', layer:0 } },
    flying_sword:{ id:'flying_sword',type:'weapon', name:'寒霜飞剑', desc:'剑身透寒，离手可御。',     stats:{ atk:10, spd:3 }, value:200, req:{ realm:'lianqi', layer:3 } },
    spirit_blade:{ id:'spirit_blade',type:'weapon', name:'青冥灵剑', desc:'古剑有灵，遇强则强。',     stats:{ atk:18, mag:5 }, value:800, req:{ realm:'zhuji', layer:0 } },
    demon_sword: { id:'demon_sword', type:'weapon', name:'噬魂魔刃', desc:'刃纹如血，饮魂者强。',     stats:{ atk:25, qiyun:-2 }, value:1500, req:{ realm:'zhuji', layer:2 } },

    // ---- Armor ----
    cloth_robe:  { id:'cloth_robe',  type:'armor',  name:'粗布长袍', desc:'寻常布衣，聊胜于无。',   stats:{ def:2 }, value:15 },
    leather_armor:{id:'leather_armor',type:'armor', name:'皮革甲',  desc:'猎户所穿的轻甲。',       stats:{ def:5, hp:10 }, value:50 },
    qi_shield:   { id:'qi_shield',   type:'armor',  name:'灵木护胸', desc:'木心镌纹，挡煞避邪。',   stats:{ def:8, res:3 }, value:180, req:{ realm:'lianqi', layer:0 } },
    jade_vest:   { id:'jade_vest',   type:'armor',  name:'玉清内甲', desc:'暖玉缝入内里，护体清心。',stats:{ def:14, res:6, hp:30 }, value:600, req:{ realm:'lianqi', layer:5 } },
    celestial_silk:{id:'celestial_silk',type:'armor',name:'天蚕丝袍',desc:'万年天蚕所吐，刀剑难伤。',stats:{ def:25, res:12, mp:50 }, value:3000, req:{ realm:'zhuji', layer:3 } },

    // ---- Accessories ----
    luck_charm:   { id:'luck_charm',   type:'accessory', name:'福缘符', desc:'随身一带，气运略增。', stats:{ qiyun:1 }, value:80 },
    sage_pendant: { id:'sage_pendant', type:'accessory', name:'悟者玉佩', desc:'清心宁神，悟性所归。', stats:{ wuxing:1 }, value:120 },
    blood_talisman:{id:'blood_talisman',type:'accessory',name:'血煞符',  desc:'内蓄魔气，气运所忌。', stats:{ atk:4, qiyun:-1 }, value:150 },
    storage_ring: { id:'storage_ring', type:'accessory', name:'储物戒', desc:'芥子须弥，内有乾坤。', stats:{ }, value:300, req:{ realm:'lianqi', layer:2 } },

    // ---- Consumables ----
    minor_pill:   { id:'minor_pill',  type:'consumable', name:'回春丹', desc:'回复少量气血。', value:10, stackable:true, effect:{ kind:'heal_hp_pct', pct:0.25 } },
    major_pill:   { id:'major_pill',  type:'consumable', name:'大回春丹', desc:'回复大量气血。', value:35, stackable:true, effect:{ kind:'heal_hp_pct', pct:0.6 } },
    qi_pill:      { id:'qi_pill',     type:'consumable', name:'回灵丹', desc:'回复灵力。', value:20, stackable:true, effect:{ kind:'heal_mp_pct', pct:0.5 } },
    cultivation_pill:{id:'cultivation_pill',type:'consumable',name:'养气丹',desc:'增进修为。', value:50, stackable:true, effect:{ kind:'cultivation', amount:30 } },
    breakthrough_pill:{id:'breakthrough_pill',type:'consumable',name:'破境丹',desc:'提高突破成功率。', value:200, stackable:true, effect:{ kind:'breakthrough_pill', bonus:0.25 } },
    antidote:     { id:'antidote',    type:'consumable', name:'解毒丹', desc:'驱除百毒。', value:30, stackable:true, effect:{ kind:'cure', status:'poison' } },
    fortune_talisman:{id:'fortune_talisman',type:'consumable',name:'福运符',desc:'临时增益气运。', value:80, stackable:true, effect:{ kind:'qiyun', amount:2, dur:3 } },
    elixir:       { id:'elixir',      type:'consumable', name:'延寿丹', desc:'延年益寿。', value:500, stackable:true, effect:{ kind:'age', amount:-2 } },
    jade_clear:   { id:'jade_clear',  type:'consumable', name:'清心丹', desc:'祛除杂念，提高悟性。', value:120, stackable:true, effect:{ kind:'wuxing', amount:1, dur:5 } },

    // ---- Manuals (功法) ----
    manual_basic:    { id:'manual_basic',    type:'manual', name:'五行入门诀', desc:'最基础的练气功法。', value:0,
                       learn:'meditation', manualTeaches:['heal'] },
    manual_sword:    { id:'manual_sword',    type:'manual', name:'青锋剑意', desc:'以剑入道之经。', value:120, req:{ realm:'lianqi', layer:0 },
                       learn:'sword_qi' },
    manual_ice:      { id:'manual_ice',      type:'manual', name:'玄冰真诀', desc:'极寒冰封之道。', value:240, req:{ realm:'lianqi', layer:2 },
                       learn:'ice_seal' },
    manual_demon:    { id:'manual_demon',    type:'manual', name:'噬魂心经', desc:'夺魂噬魄的魔功。', value:600, req:{ realm:'zhuji', layer:0 },
                       learn:'devour' },
    manual_sage:     { id:'manual_sage',     type:'manual', name:'清虚吐纳', desc:'道家正宗吐纳之术。', value:200, req:{ realm:'lianqi', layer:0 },
                       learn:'golden_light' },
    manual_void:     { id:'manual_void',     type:'manual', name:'太虚雷篆', desc:'上古典籍，雷法之宗。', value:1200, req:{ realm:'zhuji', layer:0 },
                       learn:'thunder' },
    manual_immortal: { id:'manual_immortal', type:'manual', name:'仙人残卷', desc:'失落的上古残卷，藏惊天之秘。', value:0,
                       learn:'soul_out', manualTeaches:['thunder','sword_flight'] },

    // ---- Quest items ----
    village_letter:  { id:'village_letter', type:'quest', name:'村长的荐书', desc:'携此荐书可入宗门。', value:0, stackable:false },
    broken_sword:    { id:'broken_sword',   type:'quest', name:'断剑残片', desc:'剑意未灭，似有灵性。', value:0, stackable:false },
    jade_slip:       { id:'jade_slip',      type:'quest', name:'玉简',     desc:'灵识可读，刻有隐文。', value:0, stackable:false },
    demon_soul:      { id:'demon_soul',     type:'quest', name:'妖魂',     desc:'被封印的妖物魂魄。', value:0, stackable:false },
    immortal_bone:   { id:'immortal_bone',  type:'quest', name:'仙人骨',   desc:'洁白如玉，隐隐生辉。', value:0, stackable:false },
    memory_fragment: { id:'memory_fragment',type:'quest', name:'记忆碎片', desc:'前世的记忆残片。', value:0, stackable:false },

    // ---- Materials ----
    spirit_herb:     { id:'spirit_herb',    type:'material', name:'灵草',   desc:'山间所采，可炼丹。', value:8, stackable:true },
    beast_core:      { id:'beast_core',     type:'material', name:'兽核',   desc:'妖兽内丹之基。', value:25, stackable:true },
    refined_iron:    { id:'refined_iron',   type:'material', name:'精铁',   desc:'锻造所用。', value:15, stackable:true },
    demon_crystal:   { id:'demon_crystal',  type:'material', name:'魔晶',   desc:'蕴含魔气，慎用。', value:60, stackable:true },
  };

  // Helpers
  function canEquip(state, item) {
    if (!item || !item.req) return true;
    const r = item.req;
    const me = REALM_BY_ID[state.realmId].index;
    const need = REALM_BY_ID[r.realm].index;
    if (me < need) return false;
    if (me === need && (state.layer || 0) < (r.layer || 0)) return false;
    return true;
  }
  function slotFor(type) {
    if (type === 'weapon') return 'weapon';
    if (type === 'armor')  return 'armor';
    if (type === 'accessory') return 'accessory';
    if (type === 'manual') return 'manual';
    return null;
  }

  global.ITEMS = ITEMS;
  global.canEquip = canEquip;
  global.slotFor = slotFor;
})(window);
