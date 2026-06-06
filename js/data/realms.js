/* =============================================================
   realms.js  — cultivation realm progression data
   Exposed as window.REALMS (array, ordered)
   ============================================================= */
(function (global) {
  'use strict';

  // Each realm has:
  //  id, name, layers (0..n-1 or stages),
  //  hpBonus, mpBonus, lifespan, levelLabel (per layer)
  //  expToNext (per layer), breakthroughBase
  // Layers indexed 0..layers-1; "early/mid/late" tiered realms use 3 stages.
  const REALMS = [
    {
      id: 'mortal', name: '凡人', layers: 0, stages: ['·'],
      hpBonus: 0, mpBonus: 0, lifespan: 80, breakthroughBase: 0,
      expToNext: () => 0,
      stageLabel: () => '未入道',
    },
    {
      id: 'lianqi', name: '练气', layers: 9, stages: ['一','二','三','四','五','六','七','八','九'],
      hpBonus: 0, mpBonus: 0, lifespan: 120, breakthroughBase: 0.55,
      // 80, 100, 130, 170, 220, 280, 360, 460, 600
      expToNext: (layer) => Math.round(80 * Math.pow(1.28, layer)),
      stageLabel: (i) => '第' + ['一','二','三','四','五','六','七','八','九'][i] + '层',
    },
    {
      id: 'zhuji', name: '筑基', layers: 9, stages: ['初','中','后','初','中','后','初','中','后'],
      hpBonus: 60, mpBonus: 40, lifespan: 200, breakthroughBase: 0.35,
      expToNext: (layer) => Math.round(220 * Math.pow(1.3, layer)),
      stageLabel: (i) => ['初期','中期','后期'][i % 3] + '·第' + (Math.floor(i/3)+1) + '阶',
    },
    {
      id: 'jindan', name: '金丹', layers: 3, stages: ['初成','小成','大成'],
      hpBonus: 220, mpBonus: 160, lifespan: 500, breakthroughBase: 0.20,
      expToNext: (layer) => [1200, 2200, 4000][layer] || 5000,
      stageLabel: (i) => ['初成','小成','大成'][i] || '圆满',
    },
    {
      id: 'yuanying', name: '元婴', layers: 3, stages: ['初凝','中凝','大成'],
      hpBonus: 600, mpBonus: 400, lifespan: 1000, breakthroughBase: 0.12,
      expToNext: (layer) => [5000, 9000, 16000][layer] || 20000,
      stageLabel: (i) => ['初凝','中凝','大成'][i] || '圆满',
    },
  ];

  // Map id -> index
  const REALM_BY_ID = {};
  REALMS.forEach((r, i) => REALM_BY_ID[r.id] = { realm: r, index: i });

  // Realm progression: which realm comes next on breakthrough success
  function nextRealm(currentId) {
    const idx = REALM_BY_ID[currentId].index;
    return REALMS[idx + 1] || null;
  }
  // Layer within a realm: how many 'exp checkpoints' to the next stage
  // For tiered realms (jindan/yuanying), layers=3; for 9-layer, 9.

  // Compute HP/MP caps for a given (realm, layer, stats)
  function computeCaps(state) {
    const r = REALM_BY_ID[state.realmId].realm;
    const stageIdx = Math.min(state.layer, r.stages.length - 1);
    const base = state.realmId === 'mortal' ? 0
              : state.realmId === 'lianqi' ? state.layer
              : state.realmId === 'zhuji'  ? 3 + Math.floor(state.layer * 1.0)
              : state.realmId === 'jindan' ? 12 + state.layer * 3
              : 21 + state.layer * 3;
    return {
      maxHp: 50 + state.stats.gengu * 10 + base * 12 + r.hpBonus,
      maxMp: 30 + state.stats.wuxing * 8  + base * 8  + r.mpBonus,
    };
  }

  // Realm "level" used in combat balance = effective power level
  function realmLevel(state) {
    const idx = REALM_BY_ID[state.realmId].index;
    const base = idx * 9; // 0,9,18,27,36
    const layer = state.layer;
    return base + layer;
  }

  function realmDisplay(state) {
    const r = REALM_BY_ID[state.realmId].realm;
    if (state.realmId === 'mortal') return '凡人';
    return r.name + r.stageLabel(state.layer);
  }

  global.REALMS = REALMS;
  global.REALM_BY_ID = REALM_BY_ID;
  global.nextRealm = nextRealm;
  global.computeCaps = computeCaps;
  global.realmLevel = realmLevel;
  global.realmDisplay = realmDisplay;
})(window);
