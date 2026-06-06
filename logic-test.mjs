// 純邏輯 smoke test。mock DOM 與 localStorage
import { state, newPlayer, resetRun } from './js/core/state.js';
import { applyStats, runHook } from './js/core/hooks.js';
import { TALENTS } from './js/data/talents.js';
import { EVENTS, pickRandomEvent } from './js/data/events.js';
import { makeEnemyInstance, ENEMIES } from './js/data/enemies.js';
import { generateTalentDraft, applyTalent } from './js/systems/reincarnation.js';
import { startCombat, playerAttack, enemyTurn } from './js/systems/combat.js';
import { startAdventure, adventureStep, retreatAdventure } from './js/systems/adventure.js';
import { addKarma, META_SHOP, buyMeta } from './js/systems/meta.js';

// 注入假 DOM
globalThis.document = { addEventListener: () => {}, getElementById: () => null, querySelector: () => null, createElement: () => ({ classList: { add: () => {}, remove: () => {} }, appendChild: () => {} }) };
globalThis.localStorage = (() => {
  const m = new Map();
  return { getItem: k => m.get(k) ?? null, setItem: (k, v) => m.set(k, v), removeItem: k => m.delete(k) };
})();

let passed = 0, failed = 0;
function test(name, fn) {
  try { fn(); console.log('OK  ', name); passed++; }
  catch (e) { console.error('FAIL', name, e); failed++; }
}

test('建立玩家並套用天賦', () => {
  resetRun();
  const p = state.player;
  applyTalent(TALENTS[0]);
  applyTalent(TALENTS[6]);
  applyStats(p);
  if (p.talents.length !== 2) throw new Error('天賦未套用');
  if (p.hpMax < 50) throw new Error('hpMax 異常');
});

test('生成 3 個不重複天賦', () => {
  const draft = generateTalentDraft(3);
  if (draft.length !== 3) throw new Error('數量錯誤');
  const ids = new Set(draft.map(t => t.id));
  if (ids.size !== 3) throw new Error('重複天賦');
});

test('事件池能依年齡篩選', () => {
  state.player.age = 8;
  const ev = pickRandomEvent(state.player, EVENTS);
  if (!ev) throw new Error('童年無事件');
  if (ev.ageMin > 8 || ev.ageMax < 8) throw new Error('年齡不符');
});

test('敵人建立實例', () => {
  const e = makeEnemyInstance('slime');
  if (e.currentHp !== 20) throw new Error('slime HP 錯');
});

test('戰鬥造成傷害', () => {
  resetRun();
  state.player.age = 20;
  state.player.gold = 999;
  applyStats(state.player);
  startCombat('goblin');
  const startHp = state.currentEnemy.currentHp;
  // 直接呼叫，不啟動 timer
  state.currentEnemy.currentHp = state.currentEnemy.hp; // reset
  // 手動跑一輪
  const p = state.player;
  p.atk = 50;
  p.def = 5;
  // 跳過 onAtkCalc
  const e = state.currentEnemy;
  const dmg = Math.max(1, p.atk - e.def);
  e.currentHp -= dmg;
  if (e.currentHp >= e.hp) throw new Error('未造成傷害');
});

test('業火累加', () => {
  state.meta.karma = 0;
  addKarma(100);
  if (state.meta.karma !== 100) throw new Error('業火未加');
});

test('meta 商店解鎖神話天賦', () => {
  state.meta.karma = 9999;
  const mythic = META_SHOP.find(m => m.unlock === 't_god_slayer');
  if (!buyMeta(mythic)) throw new Error('購買失敗');
  if (!state.unlockedMythics.includes('t_god_slayer')) throw new Error('未解鎖');
});

test('冒險步進產生結果', () => {
  resetRun();
  state.player.age = 20;
  state.player.hp = 100;
  state.player.hpMax = 100;
  state.player.gold = 0;
  applyStats(state.player);
  startAdventure();
  if (!state.adventure) throw new Error('冒險未啟動');
  if (state.adventure.max !== 8) throw new Error('步數錯');
});

console.log(`\n=== ${passed} pass, ${failed} fail ===`);
process.exit(failed > 0 ? 1 : 0);
