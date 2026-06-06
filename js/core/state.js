// 全域遊戲狀態
import { NPCS } from '../data/npcs.js';

export const state = {
  phase: 'title',          // title | awakening | town | story | combat | adventure | boss | gameover | reincarnate | meta
  player: null,
  currentEvent: null,
  currentShop: null,
  currentEnemy: null,
  combatLog: [],
  adventure: null,         // { step, max, results, loot }
  flags: {},               // 跨局 meta flag
  // 計算資料
  ap: 0,
  apMax: 3,
  bus: null,               // 當前劇情事件佇列

  // 計算 stat 後的暫存
  computed: {},

  // 解鎖的神話天賦
  unlockedMythics: [],

  // 元進度
  meta: {
    karma: 0,
    totalRuns: 0,
    bestAge: 0,
    bestGold: 0,
    achievements: [],
    bonusStats: { str: 0, agi: 0, int: 0, vit: 0, lck: 0, hpMax: 0, atk: 0 }
  }
};

export function newPlayer() {
  return {
    name: '你',
    age: 0,
    ageMax: 70,
    baseStr: 5, baseAgi: 5, baseInt: 5, baseVit: 5, baseLck: 5,
    str: 5, agi: 5, int: 5, vit: 5, lck: 5,
    hp: 50, hpMax: 50,
    atk: 10, def: 2, spd: 10, critRate: 0, critMult: 2, apBonus: 0,
    gold: 30,
    talents: [],
    inventory: [],
    equipment: { weapon: null, armor: null, accessory: null },
    affinity: {},          // npcId → int
    npcData: NPCS,
    flags: {},
    kills: 0,
    bossesKilled: [],
    score: 0
  };
}

export function resetRun() {
  state.player = newPlayer();
  state.currentEvent = null;
  state.currentShop = null;
  state.currentEnemy = null;
  state.combatLog = [];
  state.adventure = null;
  state.ap = 0;
  state.apMax = 3;
  state.bus = null;
}

export function setPhase(p) {
  state.phase = p;
}
