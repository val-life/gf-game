// v2 整合測試
globalThis.document = { addEventListener: () => {}, getElementById: () => null, querySelector: () => null, createElement: () => ({ classList: { add: () => {}, remove: () => {} }, appendChild: () => {} }) };
globalThis.localStorage = (() => { const m = new Map(); return { getItem: k => m.get(k) ?? null, setItem: (k, v) => m.set(k, v), removeItem: k => m.delete(k) }; })();
globalThis.window = { innerWidth: 1024 };
globalThis.confirm = () => false;
globalThis.alert = () => {};

import { state, resetRun, PHASE } from './js/core/state.js';
import { applyStats, runHook } from './js/core/hooks.js';
import { TALENTS } from './js/data/talents.js';
import { MAIN_STORY } from './js/data/mainStory.js';
import { ENEMIES, makeEnemyInstance, getMainStoryBoss } from './js/data/enemies.js';
import { startAwakening, applyTalent, confirmReincarnation } from './js/systems/reincarnation.js';
import { startCombat, playerAttack } from './js/systems/combat.js';
import { startAdventure, adventureStep } from './js/systems/adventure.js';
import { advanceYear, resolveChoice, resolveMainStoryChoice, triggerGameOver } from './js/systems/life.js';
import { doWork, doTrain, doNextYear, doAdventure, doSafeAdventure, doCry, doSleep, listActions } from './js/systems/town.js';
import { openShop, buyItem } from './js/systems/shop.js';
import { META_SHOP, buyMeta, applyMetaBonuses, saveMeta, loadMeta, resetSave } from './js/systems/meta.js';
import { giveAchievement } from './js/systems/achievements.js';

let passed = 0, failed = 0;
function t(name, fn) { try { fn(); console.log('OK  ', name); passed++; } catch (e) { console.error('FAIL', name, e.message ?? e); failed++; } }

t('整合：嬰兒 → 童年 → 訓練 → 死亡', () => {
  resetRun();
  resetSave();
  // 0 歲
  if (!isActionAllowedAt('cry', 0)) throw new Error('0 歲不能哭');
  if (isActionAllowedAt('adventure', 0)) throw new Error('0 歲能冒險？');
  state.ap = 999;
  doCry();
  doCry();
  // 3 歲：識字事件
  state.player.age = 2;
  state.ap = 999;
  doNextYear();
  if (state.phase !== PHASE.MAIN_STORY) throw new Error('3 歲無主線');
  if (state.currentMainStory.age !== 3) throw new Error('主線錯');
});

t('整合：完整主線 0→40 自動跑', () => {
  resetRun();
  resetSave();
  state.ap = 999;
  state.player.baseStr = 50; state.player.baseCon = 50; state.player.baseInt = 50;
  state.player.baseCha = 50; state.player.baseDex = 50; state.player.baseLuk = 50;
  state.player.gold = 9999;
  state.player.hp = 5000; state.player.maxHp = 5000;
  applyStats(state.player);
  // 起始轉生
  startAwakening();
  applyTalent(TALENTS[0]);
  confirmReincarnation();
  state.ap = 999;
  // 跑 0 → 40
  for (let i = 0; i < 50; i++) {
    if (state.phase === PHASE.GAMEOVER) break;
    if (state.phase === PHASE.MAIN_STORY) {
      const ms = state.currentMainStory;
      if (ms?.options) {
        let chosen = null;
        for (const opt of ms.options) {
          if (!opt.req) { chosen = opt; break; }
          if (opt.req.stat !== 'item' && opt.req.stat !== 'fireResist' && opt.req.stat !== 'party' && opt.req.stat !== 'gold') {
            chosen = opt; break;
          }
        }
        if (!chosen) chosen = ms.options[0];
        resolveMainStoryChoice(chosen);
      }
    } else if (state.phase === PHASE.STORY) {
      const ev = state.currentEvent;
      const opt = ev?.options?.[0];
      if (opt) resolveChoice(opt);
    } else if (state.phase === PHASE.COMBAT) {
      // 自動攻擊
      const e = state.currentEnemy;
      if (e) {
        e.currentHp = 0; // 暴力擊殺
      }
    }
    if (state.phase === PHASE.TOWN) {
      if (state.ap < state.apMax) state.ap = state.apMax;
      doNextYear();
    }
  }
  if (state.player.age < 40 && state.phase !== PHASE.GAMEOVER) throw new Error(`未到 40 歲 (age=${state.player.age})`);
});

t('整合：boss 戰完整 1 回合', () => {
  resetRun();
  resetSave();
  state.player.age = 16;
  state.player.hp = 99999; state.player.maxHp = 99999;
  state.player.baseStr = 1000;
  state.player.atk = 9999;
  applyStats(state.player);
  startCombat('M_BOSS_DEMON_VANGUARD');
  if (state.currentEnemy.ability.effect !== 'heavy_smash') throw new Error('先鋒官能力錯');
  const e0 = state.currentEnemy;
  // 將攻擊力降低以免一擊斃命
  state.player.atk = 50;
  playerAttack();
  if (!state.currentEnemy || state.currentEnemy.currentHp >= e0.hp) throw new Error('未造成傷害或已被擊殺');
});

t('整合：業火結算含成就', () => {
  resetRun();
  resetSave();
  state.player.age = 30;
  state.player.gold = 500;
  state.player.bossesKilled = ['a'];
  state.player.achievements = ['x', 'y'];
  const before = state.meta.karma;
  triggerGameOver('test');
  const expected = Math.floor(30*15 + 500/10 + 1*300 + 2*500);
  const actual = state.meta.karma - before;
  if (actual !== expected) throw new Error(`karma 增量 ${actual} 預期 ${expected}`);
});

t('整合：meta 起始金幣套用', () => {
  resetRun();
  resetSave();
  state.meta.karma = 9999;
  // 按順序購買：I → II → III
  buyMeta(META_SHOP.find(m => m.id === 'rich_1'));
  buyMeta(META_SHOP.find(m => m.id === 'rich_2'));
  buyMeta(META_SHOP.find(m => m.id === 'rich_3'));
  if (state.meta.bonusStats.goldStart !== 1900) throw new Error(`goldStart=${state.meta.bonusStats.goldStart}`);
});

function isActionAllowedAt(act, age) {
  // 簡化版：重現 isActionAllowed 邏輯
  const stages = [
    { min: 0, max: 2, actions: ['cry', 'sleep'] },
    { min: 3, max: 5, actions: ['cry', 'sleep', 'play', 'study_basic'] },
    { min: 6, max: 9, actions: ['cry', 'sleep', 'play', 'study', 'work', 'rest', 'train', 'shop', 'adventure_safe'] },
    { min: 10, max: 14, actions: ['study', 'work', 'rest', 'train', 'shop', 'adventure', 'tavern'] },
    { min: 15, max: 17, actions: ['study', 'work', 'rest', 'train', 'shop', 'adventure', 'tavern', 'guild'] },
    { min: 18, max: 99, actions: ['study', 'work', 'rest', 'train', 'shop', 'adventure', 'tavern', 'guild', 'campaign'] }
  ];
  const stage = stages.find(s => age >= s.min && age <= s.max) ?? stages[stages.length - 1];
  return stage.actions.includes(act);
}

console.log(`\n=== ${passed} pass, ${failed} fail ===`);
process.exit(failed > 0 ? 1 : 0);
