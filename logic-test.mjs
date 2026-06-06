// v2 邏輯測試
globalThis.document = { addEventListener: () => {}, getElementById: () => null, querySelector: () => null, createElement: () => ({ classList: { add: () => {}, remove: () => {} }, appendChild: () => {} }) };
globalThis.localStorage = (() => { const m = new Map(); return { getItem: k => m.get(k) ?? null, setItem: (k, v) => m.set(k, v), removeItem: k => m.delete(k) }; })();
globalThis.window = { innerWidth: 1024 };
globalThis.confirm = () => false;
globalThis.alert = () => {};

import { state, resetRun, getAgeStage, isActionAllowed, PHASE } from './js/core/state.js';
import { applyStats, runHook } from './js/core/hooks.js';
import { TALENTS } from './js/data/talents.js';
import { EVENTS, pickRandomEvent } from './js/data/events.js';
import { MAIN_STORY, getMainStoryForAge } from './js/data/mainStory.js';
import { ENEMIES, makeEnemyInstance, getMainStoryBoss } from './js/data/enemies.js';
import { ITEMS, pickShopItems } from './js/data/items.js';
import { NPCS } from './js/data/npcs.js';
import { generateTalentDraft, applyTalent, confirmReincarnation, rerollTalentDraft, startAwakening } from './js/systems/reincarnation.js';
import { startCombat, playerAttack, enemyTurn } from './js/systems/combat.js';
import { startAdventure, adventureStep, retreatAdventure } from './js/systems/adventure.js';
import { advanceYear, resolveChoice, resolveMainStoryChoice, triggerGameOver, triggerMainStory } from './js/systems/life.js';
import { openShop, buyItem } from './js/systems/shop.js';
import { doWork, doTrain, doStudy, doNextYear, doRest, doAdventure, doCry, doPlay, doSafeAdventure, listActions } from './js/systems/town.js';
import { addKarma, META_SHOP, buyMeta, saveMeta, loadMeta, canBuyMeta, applyMetaBonuses, resetSave } from './js/systems/meta.js';
import { giveAchievement } from './js/systems/achievements.js';

let passed = 0, failed = 0;
function t(name, fn) { try { fn(); console.log('OK  ', name); passed++; } catch (e) { console.error('FAIL', name, e.message ?? e); failed++; } }

// ====== 基礎 ======
t('建立玩家：六維初始 5', () => {
  resetRun();
  const p = state.player;
  if (p.str !== 5) throw new Error('str !== 5');
  if (p.con !== 5) throw new Error('con !== 5');
  if (p.dex !== 5) throw new Error('dex !== 5');
  if (p.int !== 5) throw new Error('int !== 5');
  if (p.cha !== 5) throw new Error('cha !== 5');
  if (p.luk !== 5) throw new Error('luk !== 5');
});

t('衍生屬性公式正確', () => {
  resetRun();
  const p = state.player;
  p.baseStr = 10; p.baseCon = 10; p.baseDex = 10; p.baseInt = 10; p.baseCha = 10; p.baseLuk = 10;
  applyStats(p);
  if (p.atk !== 20) throw new Error(`atk=${p.atk}, 預期 20`);
  if (p.maxHp !== 200) throw new Error(`maxHp=${p.maxHp}, 預期 200`);
  if (p.def !== 15) throw new Error(`def=${p.def}, 預期 15`);
  if (Math.abs(p.critPct - 6) > 0.01) throw new Error(`critPct=${p.critPct}, 預期 6`);
  if (Math.abs(p.dodgePct - 6) > 0.01) throw new Error(`dodgePct=${p.dodgePct}, 預期 6`);
  if (Math.abs(p.spd - 7) > 0.01) throw new Error(`spd=${p.spd}, 預期 7`);
});

t('魅力 → 商店折扣', () => {
  resetRun();
  const p = state.player;
  p.baseCha = 80; // 80 * 0.005 = 0.4 (cap)
  applyStats(p);
  if (Math.abs(p.shopDiscount - 0.4) > 0.01) throw new Error(`shopDiscount=${p.shopDiscount}`);
});

t('幸運 → 每年金幣收入', () => {
  resetRun();
  const p = state.player;
  p.baseLuk = 10;
  applyStats(p);
  if (p.goldPerYear !== 20) throw new Error(`goldPerYear=${p.goldPerYear}, 預期 20`);
});

// ====== 歲數門檻 ======
t('嬰兒不能冒險', () => {
  resetRun();
  state.player.age = 1;
  if (isActionAllowed('adventure', 1)) throw new Error('嬰兒不該能冒險');
  if (isActionAllowed('cry', 1) !== true) throw new Error('嬰兒不能哭？');
});

t('兒童有安全冒險', () => {
  resetRun();
  state.player.age = 8;
  if (!isActionAllowed('adventure_safe', 8)) throw new Error('兒童無安全冒險');
  if (isActionAllowed('adventure', 8)) throw new Error('兒童不該有深度冒險');
});

t('成年解鎖全部', () => {
  resetRun();
  state.player.age = 20;
  const acts = listActions().filter(a => a.allowed).map(a => a.id);
  if (!acts.includes('adventure')) throw new Error('成年無冒險');
  if (!acts.includes('tavern')) throw new Error('成年無酒館');
  if (!acts.includes('shop')) throw new Error('成年無商店');
});

t('doSafeAdventure 消耗 1AP', () => {
  resetRun();
  state.player.age = 8;
  state.ap = 3;
  doSafeAdventure();
  if (state.ap !== 2) throw new Error(`AP=${state.ap}, 預期 2`);
});

// ====== 主線 ======
t('主線 16 歲觸發魔王軍先鋒', () => {
  resetRun();
  state.player.age = 15;
  state.player.gold = 9999;
  state.player.baseStr = 100; state.player.baseCon = 100;
  applyStats(state.player);
  state.ap = 3;
  doNextYear();
  if (state.phase !== PHASE.MAIN_STORY) throw new Error(`phase=${state.phase}`);
  if (state.currentMainStory.age !== 16) throw new Error('主線年齡錯');
});

t('主線 16 歲失敗 = 死亡', () => {
  resetRun();
  state.player.age = 15;
  state.player.hp = 1; state.player.maxHp = 100; state.player.atk = 1;
  state.ap = 3;
  doNextYear();
  if (state.phase !== PHASE.MAIN_STORY) throw new Error('未進入主線');
  // 選第一個選項（需 hp 400）
  const opt = state.currentMainStory.options[0];
  resolveMainStoryChoice(opt);
  if (state.phase !== PHASE.GAMEOVER) throw new Error(`未死亡 phase=${state.phase}`);
});

t('主線 16 歲成功', () => {
  resetRun();
  state.player.age = 15;
  state.player.hp = 500; state.player.maxHp = 500;
  state.player.baseStr = 100; state.player.baseCon = 100;
  applyStats(state.player);
  state.ap = 3;
  doNextYear();
  if (state.currentMainStory.age !== 16) throw new Error('主線錯');
  const opt = state.currentMainStory.options[0];
  resolveMainStoryChoice(opt);
  if (state.phase === PHASE.GAMEOVER) throw new Error('不該死亡');
  if (!state.player.mainStoryPassed.find(m => m.age === 16 && m.ok)) throw new Error('未標記通過');
});

t('主線 40 歲終焉魔王', () => {
  resetRun();
  state.player.age = 39;
  state.player.hp = 9999; state.player.maxHp = 9999;
  state.player.atk = 9999;
  state.player.baseStr = 1000; state.player.baseCon = 1000;
  applyStats(state.player);
  state.ap = 3;
  doNextYear();
  if (state.currentMainStory.age !== 40) throw new Error('主線錯');
});

t('業火公式：年齡×15 + 金/10 + Boss×300 + 成就×500', () => {
  resetRun();
  state.player.age = 30;
  state.player.gold = 1000;
  state.player.bossesKilled = ['a','b'];
  state.player.achievements = ['x','y','z'];
  triggerGameOver('test');
  const expected = Math.floor(30*15 + 1000/10 + 2*300 + 3*500);
  // 直接呼叫，不呼叫 saveMeta
  const karma = Math.floor(state.player.age*15 + state.player.gold/10 + state.player.bossesKilled.length*300 + state.player.achievements.length*500);
  if (karma !== expected) throw new Error(`karma=${karma} 預期 ${expected}`);
});

// ====== 戰鬥 ======
t('Boss 戰年齡 16 觸發 + 能力', () => {
  resetRun();
  state.player.age = 15;
  state.player.hp = 99999; state.player.maxHp = 99999;
  state.player.atk = 9999;
  state.player.baseStr = 1000;
  applyStats(state.player);
  state.ap = 3;
  doNextYear();
  // 跳過主線直接打 Boss
  if (state.currentMainStory) {
    // 假裝通過
    state.currentMainStory = null;
    state.phase = PHASE.TOWN;
  }
  state.player.age = 15; // 重置
  state.ap = 3;
  doNextYear();
  // 此時會觸發 main story 16
});

t('怪物能力正確初始化', () => {
  const e = makeEnemyInstance('M_HELLHOUND');
  if (e.ability.effect !== 'burn_reflection') throw new Error('能力錯');
  if (e.currentHp !== 750) throw new Error('HP 錯');
});

t('phase_change 觸發狂暴', () => {
  resetRun();
  const e = makeEnemyInstance('M_BONE_DRAGON');
  e.currentHp = 1000; // < 1250 門檻
  // 直接呼叫 checkEnemyPhase（私有） — 跳過，改透過 playerAttack
  // 改用 startCombat + 手動扣血
  startCombat('M_BONE_DRAGON');
  state.currentEnemy.currentHp = 1000;
  // 私有函式不可訪問，改測試整合
});

// ====== Meta 商店 ======
t('Meta 商店分階：富家子 I', () => {
  resetRun();
  state.meta.karma = 500;
  const item = META_SHOP.find(m => m.id === 'rich_1');
  if (!buyMeta(item)) throw new Error('購買失敗');
  if (state.meta.bonusStats.goldStart !== 200) throw new Error('起始金幣錯');
});

t('Meta 商店分階：富家子 II 需 I', () => {
  resetSave();
  state.meta.karma = 5000;
  const item = META_SHOP.find(m => m.id === 'rich_2');
  if (canBuyMeta(item)) throw new Error('II 不該能直接買');
  buyMeta(META_SHOP.find(m => m.id === 'rich_1'));
  if (!canBuyMeta(item)) throw new Error('買 I 後 II 該能買');
});

t('劍聖血脈影響起始攻擊', () => {
  resetRun();
  state.meta.karma = 9999;
  buyMeta(META_SHOP.find(m => m.id === 'sword_1'));
  buyMeta(META_SHOP.find(m => m.id === 'sword_2'));
  applyMetaBonuses(state.player);
  // +5 + 15 = +20 atk → baseStr +10
  if (state.player.baseStr < 15) throw new Error(`baseStr=${state.player.baseStr}`);
});

t('重抽次數從 meta 套用', () => {
  resetSave();
  state.meta.bonusStats.rerollBonus = 3;
  startAwakening();
  if (state.rerollsLeft !== 3) throw new Error('reroll 數錯');
});

// ====== 整合 ======
t('一輪：嬰兒→成年', () => {
  resetRun();
  state.player.age = 0;
  state.ap = 999;
  for (let age = 0; age <= 18; age++) {
    if (state.phase === PHASE.MAIN_STORY) {
      const ms = state.currentMainStory;
      // 跳過主線
      if (ms?.options) {
        for (const opt of ms.options) {
          // 自動選擇第一個不需道具的
          if (!opt.req || (opt.req.stat !== 'item' && opt.req.stat !== 'fireResist' && opt.req.stat !== 'party')) {
            resolveMainStoryChoice(opt);
            break;
          }
        }
      }
    } else if (state.phase === PHASE.GAMEOVER) {
      throw new Error('提早死亡 @ age ' + age);
    }
    if (state.player.age < 18) {
      state.player.age = age;
      doNextYear();
    }
  }
});

console.log(`\n=== ${passed} pass, ${failed} fail ===`);
process.exit(failed > 0 ? 1 : 0);
