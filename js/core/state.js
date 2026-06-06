// 全域遊戲狀態（第二版：六維屬性）
import { NPCS } from '../data/npcs.js';

// 歲數階段。決定 town 可用動作
export const AGE_STAGE = [
  { name: '嬰兒', min: 0, max: 2, actions: ['cry', 'sleep'] },
  { name: '幼兒', min: 3, max: 5, actions: ['cry', 'sleep', 'play', 'study_basic'] },
  { name: '童年', min: 6, max: 9, actions: ['cry', 'sleep', 'play', 'study', 'work', 'rest', 'train', 'shop', 'adventure_safe'] },
  { name: '少年', min: 10, max: 14, actions: ['study', 'work', 'rest', 'train', 'shop', 'adventure', 'tavern'] },
  { name: '青年', min: 15, max: 17, actions: ['study', 'work', 'rest', 'train', 'shop', 'adventure', 'tavern', 'guild'] },
  { name: '成年', min: 18, max: 99, actions: ['study', 'work', 'rest', 'train', 'shop', 'adventure', 'tavern', 'guild', 'campaign'] }
];

export const PHASE = {
  TITLE: 'title',
  AWAKENING: 'awakening',
  TOWN: 'town',
  STORY: 'story',
  MAIN_STORY: 'main_story',
  SHOP: 'shop',
  COMBAT: 'combat',
  ADVENTURE: 'adventure',
  GAMEOVER: 'gameover',
  REINCARNATE: 'reincarnate',
  META: 'meta'
};

export const state = {
  phase: PHASE.TITLE,
  player: null,
  currentEvent: null,
  currentShop: null,
  currentEnemy: null,
  combatLog: [],
  adventure: null,
  ap: 0,
  apMax: 3,
  currentDraft: null,
  rerollsLeft: 0,
  unlockedMythics: [],
  currentMainStory: null,

  // 元進度
  meta: {
    karma: 0,
    totalRuns: 0,
    bestAge: 0,
    bestGold: 0,
    bestKarma: 0,
    achievements: [],
    bonusStats: { str: 0, con: 0, dex: 0, int: 0, cha: 0, luk: 0, atk: 0, maxHp: 0, goldStart: 0, rerollBonus: 0 },
    metaShopTiers: { richBoy: 0, swordSaint: 0, reroll: 0 },
    mainStoryProgress: {}    // age → 'passed' / 'failed' / 'pending'
  }
};

export function newPlayer() {
  return {
    name: '你',
    age: 0,
    ageMax: 70,
    // 六維基礎屬性
    baseStr: 5, baseCon: 5, baseDex: 5, baseInt: 5, baseCha: 5, baseLuk: 5,
    // 衍生（每次 applyStats 重算）
    str: 5, con: 5, dex: 5, int: 5, cha: 5, luk: 5,
    atk: 10, def: 8, matk: 0, maxHp: 125, hp: 125,
    critPct: 2, dodgePct: 2, spd: 2,
    shopDiscount: 0, goldPerYear: 0, dropBonus: 0, failReduce: 0, affBonus: 0,
    // 資源
    gold: 30,
    // 裝備/天賦/背包
    talents: [],
    inventory: [],
    equipment: { weapon: null, armor: null, accessory: null, trinket: null },
    // 戰鬥
    buffs: [],            // { name, value, turns }
    debuffs: [],
    burnStacks: 0,        // 燃燒
    poisonStacks: 0,      // 中毒
    // 夥伴 + 好感
    affinity: {},
    npcData: NPCS,
    // 旗標
    flags: {},
    // 成就 / 戰績
    kills: 0,
    bossesKilled: [],
    mainStoryPassed: [],
    fatherAlive: true,
    fatherAff: 0,
    achievements: [],
    // 結算
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
  state.currentDraft = null;
  state.rerollsLeft = state.meta.bonusStats.rerollBonus ?? 0;
  state.currentMainStory = null;
}

export function setPhase(p) {
  state.phase = p;
}

export function getAgeStage(age) {
  return AGE_STAGE.find(s => age >= s.min && age <= s.max) ?? AGE_STAGE[AGE_STAGE.length - 1];
}

export function isActionAllowed(action, age) {
  const stage = getAgeStage(age);
  return stage.actions.includes(action);
}
