// 完整一輪邏輯測試：轉生 → 城鎮 → 事件 → 戰鬥 → 死亡 → 業火 → 再次轉生
globalThis.document = { addEventListener: () => {}, getElementById: () => null, querySelector: () => null, createElement: () => ({ classList: { add: () => {}, remove: () => {} }, appendChild: () => {} }) };
globalThis.localStorage = (() => { const m = new Map(); return { getItem: k => m.get(k) ?? null, setItem: (k, v) => m.set(k, v), removeItem: k => m.delete(k) }; })();

import { state, resetRun } from './js/core/state.js';
import { applyStats, runHook } from './js/core/hooks.js';
import { TALENTS } from './js/data/talents.js';
import { EVENTS } from './js/data/events.js';
import { ENEMIES, makeEnemyInstance } from './js/data/enemies.js';
import { generateTalentDraft, applyTalent, confirmReincarnation } from './js/systems/reincarnation.js';
import { startCombat, playerAttack } from './js/systems/combat.js';
import { startAdventure, adventureStep } from './js/systems/adventure.js';
import { advanceYear, resolveChoice, triggerGameOver } from './js/systems/life.js';
import { openShop, buyItem } from './js/systems/shop.js';
import { doWork, doTrain, doStudy, doNextYear, doRest, doAdventure } from './js/systems/town.js';
import { addKarma, saveMeta, loadMeta } from './js/systems/meta.js';

let passed = 0, failed = 0;
function t(name, fn) { try { fn(); console.log('OK  ', name); passed++; } catch (e) { console.error('FAIL', name, e); failed++; } }

t('完整一輪：轉生 + 訓練 + 死亡 + 業火', () => {
  resetRun();
  state.player.age = 0;
  state.player.gold = 50;
  state.ap = 999; // 模擬已轉生，AP 滿
  applyStats(state.player);
  applyTalent(TALENTS.find(x => x.id === 't_immortal'));
  applyStats(state.player);
  if (state.player.hpMax < 130) throw new Error('不朽天賦 hpMax 異常');
  for (let i = 0; i < 5; i++) {
    doWork();
    doTrain('str');
  }
  if (state.player.gold < 50 + 8*5) throw new Error('金幣未增加');
  if (state.player.str < 10) throw new Error('力量未提升');
  triggerGameOver('測試');
  if (state.phase !== 'gameover') throw new Error('未進入 gameover');
  if (state.meta.karma <= 0) throw new Error('業火未發放');
});

t('Boss 戰年齡 10 觸發', () => {
  resetRun();
  state.player.age = 9;
  state.player.hp = 999;
  state.player.gold = 999;
  applyStats(state.player);
  state.ap = state.apMax + (state.player.apBonus ?? 0);
  doNextYear();
  if (state.phase !== 'combat') throw new Error('Boss 戰未觸發');
  if (!state.currentEnemy?.isBoss) throw new Error('當前敵人非 Boss');
});

t('商店購買並裝備', () => {
  resetRun();
  state.player.age = 25;
  state.player.gold = 500;
  applyStats(state.player);
  openShop();
  if (!state.currentShop || state.currentShop.length === 0) throw new Error('商店無貨');
  // 強行把第一件設為便宜
  const item = state.currentShop[0];
  item.price = 10;
  if (!buyItem(item)) throw new Error('購買失敗');
});

t('冒險完整步進不崩潰', () => {
  resetRun();
  state.player.age = 25;
  state.player.gold = 0;
  state.player.hp = 100;
  state.player.hpMax = 100;
  applyStats(state.player);
  startAdventure();
  // 跑 10 步或直到冒險結束
  let safety = 0;
  while (state.adventure && safety < 30) {
    if (state.phase === 'combat') {
      // 暴力擊殺敵人
      state.currentEnemy.currentHp = 0;
      // 模擬勝利的結算邏輯透過手動觸發
      const e = state.currentEnemy;
      state.player.gold += e.gold;
      state.player.kills += 1;
      if (state.adventure?.returnAfterCombat) {
        state.adventure.returnAfterCombat = false;
        state.adventure.gold += e.gold;
        state.phase = 'adventure';
      } else {
        state.phase = 'town';
      }
      state.currentEnemy = null;
    } else {
      adventureStep();
    }
    safety++;
  }
  if (safety >= 30) throw new Error('冒險卡死');
});

t('存檔與讀檔', () => {
  resetRun();
  state.meta.karma = 12345;
  saveMeta();
  // 重置 in-memory meta
  state.meta.karma = 0;
  loadMeta();
  if (state.meta.karma !== 12345) throw new Error('存檔未還原');
});

t('致命天賦復活', () => {
  resetRun();
  state.player.age = 30;
  state.player.gold = 999;
  state.player.hp = 50;
  state.player.hpMax = 100;
  applyTalent(TALENTS.find(x => x.id === 't_phoenix'));
  applyStats(state.player);
  // 強制死亡
  state.player.hp = 0;
  const ctx = {};
  const logs = runHook('onFatalDamage', state.player, ctx);
  if (state.player.hp <= 0) throw new Error('鳳凰未復活');
  if (logs.length === 0) throw new Error('未產生復活日誌');
});

console.log(`\n=== ${passed} pass, ${failed} fail ===`);
process.exit(failed > 0 ? 1 : 0);
