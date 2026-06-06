/* =============================================================
   state.js — central game state and stat derivation
   Exposed on window.G (state) and window.State (helpers)
   ============================================================= */
(function (global) {
  'use strict';

  // The single source of truth for the current playthrough.
  // Reset on new game; loaded on continue.
  const G = {
    // meta
    version: 1,
    slotId: 'autosave',
    playTime: 0,           // seconds
    createdAt: null,
    updatedAt: null,

    // identity
    name: '',
    gender: 'male',
    spiritRoot: 'trash',   // tier+element e.g. 'lower_fire', 'variant'

    // core attributes (1-10 each, total ~24)
    stats: { gengu: 5, wuxing: 5, qiyun: 5, meili: 5 },

    // cultivation
    realmId: 'mortal',
    layer: 0,           // 0..n-1 within realm
    cultivation: 0,     // current exp toward next layer

    // resources
    hp: 50, mp: 30,
    exp: 0,
    lingshi: 0,
    age: 0,             // increments by scene onEnter
    lifespan: 80,

    // equipment slots
    equipment: { weapon: null, armor: null, accessory: null, manual: null },

    // inventory: { itemId: qty }
    inventory: {},

    // skills known (ids)
    skills: ['strike', 'defend'],

    // status effects (combat only mostly): list of {id, dur}
    status: [],

    // current scene
    currentScene: 'title',
    lastChoiceKey: null,

    // narrative flags: arbitrary key->value
    flags: {},

    // cooldowns per skill id (turns left)
    cooldowns: {},
  };

  // achievements: global across all saves
  const ACH = {
    list: [
      { id:'first_qi',     name:'初入道途',  desc:'首次破入练气境。' },
      { id:'foundation',   name:'筑基有成',  desc:'破入筑基境。' },
      { id:'first_kill',   name:'初战告捷',  desc:'赢得第一场战斗。' },
      { id:'side_well',    name:'古井之秘',  desc:'发现古井底下的玉简。' },
      { id:'cycle_completed', name:'七世轮回', desc:'解锁轮回重启结局。' },
    ],
    unlocked: {}, // id -> 1
    endings: {},  // id -> 1
  };

  /* -------- derive caps & derived stats -------- */
  function recompute() {
    // HP/MP caps
    const caps = computeCaps(G);
    G._maxHp = caps.maxHp;
    G._maxMp = caps.maxMp;
    if (G.hp > G._maxHp) G.hp = G._maxHp;
    if (G.mp > G._maxMp) G.mp = G._maxMp;
    if (G.hp < 0) G.hp = 0;
    if (G.mp < 0) G.mp = 0;

    // derived
    const eq = G.equipment;
    const wpn = eq.weapon  ? (ITEMS[eq.weapon]  || {}) : {};
    const arm = eq.armor   ? (ITEMS[eq.armor]   || {}) : {};
    const acc = eq.accessory ? (ITEMS[eq.accessory] || {}) : {};
    const man = eq.manual  ? (ITEMS[eq.manual]  || {}) : {};

    const sBonusAtk = (wpn.stats && wpn.stats.atk) || 0;
    const sBonusDef = (arm.stats && arm.stats.def) || 0;
    const sBonusMag = ((wpn.stats && wpn.stats.mag) || 0) + ((man.stats && man.stats.mag) || 0);
    const sBonusRes = (arm.stats && arm.stats.res) || 0;
    const sBonusSpd = ((wpn.stats && wpn.stats.spd) || 0) + ((acc.stats && acc.stats.spd) || 0);
    const sBonusHp  = ((arm.stats && arm.stats.hp) || 0) + ((acc.stats && acc.stats.hp) || 0);
    const sBonusMp  = ((arm.stats && arm.stats.mp) || 0) + ((acc.stats && acc.stats.mp) || 0);

    G._atk = Math.round(5 + G.stats.gengu * 1.2 + sBonusAtk);
    G._def = Math.round(0 + G.stats.gengu * 0.6 + sBonusDef);
    G._mag = Math.round(5 + G.stats.wuxing * 1.2 + sBonusMag);
    G._res = Math.round(0 + G.stats.wuxing * 0.6 + sBonusRes);
    G._spd = Math.round(8 + (G.stats.gengu + G.stats.wuxing) * 0.3 + sBonusSpd);

    let crit = 5 + G.stats.qiyun * 0.5;
    crit += ((acc.stats && acc.stats.qiyun) || 0) * 1.5;
    crit += ((wpn.stats && wpn.stats.qiyun) || 0) * 1.5;
    G._crit = Math.max(0, crit);

    G._dodge = 3 + G.stats.qiyun * 0.3;
  }

  /* -------- inventory helpers -------- */
  function addItem(id, qty) {
    qty = qty || 1;
    if (!ITEMS[id]) return false;
    const stackable = ITEMS[id].stackable !== false; // default true
    if (stackable) G.inventory[id] = (G.inventory[id] || 0) + qty;
    else G.inventory[id] = 1;
    return true;
  }
  function removeItem(id, qty) {
    qty = qty || 1;
    if (!G.inventory[id]) return false;
    if (G.inventory[id] < qty) return false;
    G.inventory[id] -= qty;
    if (G.inventory[id] <= 0) delete G.inventory[id];
    return true;
  }
  function hasItem(id, qty) {
    qty = qty || 1;
    return (G.inventory[id] || 0) >= qty;
  }

  /* -------- skill helpers -------- */
  function learnSkill(skillId) {
    if (!SKILLS[skillId]) return false;
    if (G.skills.indexOf(skillId) === -1) G.skills.push(skillId);
    return true;
  }
  function hasSkill(skillId) {
    return G.skills.indexOf(skillId) !== -1;
  }

  /* -------- equipment -------- */
  function equip(itemId) {
    const item = ITEMS[itemId];
    if (!item) return false;
    if (!canEquip(G, item)) return false;
    const slot = slotFor(item.type);
    if (!slot) return false;
    // Unequip current
    if (G.equipment[slot]) {
      // already equipped item goes back to inventory
      addItem(G.equipment[slot], 1);
    }
    // remove from inventory
    if (!removeItem(itemId, 1)) return false;
    G.equipment[slot] = itemId;
    return true;
  }
  function unequip(slot) {
    if (!G.equipment[slot]) return false;
    addItem(G.equipment[slot], 1);
    G.equipment[slot] = null;
    return true;
  }

  /* -------- requirements -------- */
  // Scene choice.requires examples:
  //   { qiyun: 3, wuxing: 2 }
  //   { 'flag:met_li': true }
  //   { 'realm:lianqi_layer:7': true }  (realm lianqi layer >= 7)
  //   { 'realm:jindan': true }           (realm >= jindan)
  function checkRequires(req) {
    if (!req) return true;
    for (const k in req) {
      if (k === 'qiyun' || k === 'wuxing' || k === 'gengu' || k === 'meili') {
        if (G.stats[k] < req[k]) return false;
      } else if (k === 'flag') {
        if (!G.flags[req[k]]) return false;
      } else if (k.indexOf('flag:') === 0) {
        const fk = k.slice(5);
        if (!G.flags[fk]) return false;
      } else if (k.indexOf('realm:') === 0) {
        // realm:jindan
        const needRealm = k.slice(6);
        const cur = REALM_BY_ID[G.realmId].index;
        const need = REALM_BY_ID[needRealm].index;
        if (cur < need) return false;
      } else if (k.indexOf('realm:') === 0 && k.indexOf('_layer') !== -1) {
        // realm:lianqi_layer:7 — shorthand parsed below
        // (already handled above; this is dead code path)
      } else if (k.indexOf('_layer:') !== -1) {
        // realm:x_layer:y  parse manually
        const parts = k.split('_layer:');
        const needRealm = parts[0].replace('realm:', '');
        const needLayer = parseInt(parts[1], 10);
        const cur = REALM_BY_ID[G.realmId].index;
        const need = REALM_BY_ID[needRealm].index;
        if (cur < need) return false;
        if (cur === need && G.layer < needLayer) return false;
      }
    }
    return true;
  }

  /* -------- cultivation progress -------- */
  function currentExpNeeded() {
    const r = REALM_BY_ID[G.realmId].realm;
    if (G.realmId === 'mortal') return Infinity;
    return r.expToNext(G.layer);
  }
  function addCultivation(amt) {
    if (G.realmId === 'mortal') {
      // can gain up to threshold of first layer
      G.cultivation += amt;
      const need = REALM_BY_ID['lianqi'].realm.expToNext(0);
      if (G.cultivation >= need) {
        G.cultivation = need;
      }
      return;
    }
    G.cultivation += amt;
    const need = currentExpNeeded();
    if (G.cultivation >= need) {
      G.cultivation = need;
    }
  }

  /* -------- achievements -------- */
  function grantAchievement(id) {
    if (ACH.list.find(a => a.id === id) && !ACH.unlocked[id]) {
      ACH.unlocked[id] = 1;
      U.toast('成就解锁：' + (ACH.list.find(a => a.id === id) || {}).name);
      U.bus.emit('achievement', id);
    }
  }
  function grantEnding(id) {
    if (!ACH.endings[id]) {
      ACH.endings[id] = 1;
      U.toast('结局达成：' + id);
    }
  }
  function listAchievements() { return ACH.list.slice(); }
  function listUnlocked() { return Object.keys(ACH.unlocked); }
  function listEndings() { return Object.keys(ACH.endings); }

  /* -------- reset -------- */
  function resetState() {
    G.version = 1;
    G.slotId = 'autosave';
    G.playTime = 0;
    G.createdAt = null;
    G.updatedAt = null;
    G.name = '';
    G.gender = 'male';
    G.spiritRoot = 'trash';
    G.stats = { gengu: 5, wuxing: 5, qiyun: 5, meili: 5 };
    G.realmId = 'mortal';
    G.layer = 0;
    G.cultivation = 0;
    G.hp = 50; G.mp = 30;
    G.exp = 0;
    G.lingshi = 0;
    G.age = 0;
    G.lifespan = 80;
    G.equipment = { weapon: null, armor: null, accessory: null, manual: null };
    G.inventory = {};
    G.skills = ['strike', 'defend'];
    G.status = [];
    G.currentScene = 'title';
    G.lastChoiceKey = null;
    G.flags = {};
    G.cooldowns = {};
    recompute();
  }

  /* -------- auto-export -------- */
  global.G = G;
  global.ACH = ACH;
  global.State = {
    addItem, removeItem, hasItem,
    learnSkill, hasSkill,
    equip, unequip,
    checkRequires,
    addCultivation, currentExpNeeded,
    grantAchievement, grantEnding,
    listAchievements, listUnlocked, listEndings,
    resetState,
    recompute,
  };
})(window);
