// 城鎮行為。消耗 AP
import { state } from '../core/state.js';
import { log } from '../ui/log.js';
import { applyStats, runHook } from '../core/hooks.js';
import { openShop } from './shop.js';
import { startAdventure } from './adventure.js';
import { startCombat } from './combat.js';
import { advanceYear } from './life.js';
import { shakeStat } from '../ui/juice.js';

function spendAP(n) {
  if (state.ap < n) {
    log('AP 不足！', 'warn');
    return false;
  }
  state.ap -= n;
  return true;
}

// 訓練：花 1 AP，可選提升
export function doTrain(stat) {
  if (!spendAP(1)) return;
  const p = state.player;
  const key = `base${stat.charAt(0).toUpperCase()}${stat.slice(1)}`;
  p[key] = (p[key] ?? 0) + 1;
  applyStats(p);
  log(`你在訓練場苦練。${stat.toUpperCase()} +1。`, 'good');
  shakeStat(stat);
}

export function doWork() {
  if (!spendAP(1)) return;
  const p = state.player;
  const earn = 8 + Math.floor(p.str * 0.5);
  p.gold += earn;
  p.hp = Math.max(1, p.hp - 3);
  log(`勞作一日。金幣 +${earn}，HP -3。`, 'neutral');
}

export function doStudy() {
  let cost = 1;
  runHook('onStudyCost', state.player, { cost });
  if (!spendAP(cost)) return;
  const p = state.player;
  p.baseInt += 1;
  p.gold = Math.max(0, p.gold - 5);
  applyStats(p);
  log(`你埋首書卷。智力 +1，金幣 -5。`, 'good');
  shakeStat('int');
}

export function doTavern() {
  if (!spendAP(1)) return;
  const p = state.player;
  p.gold = Math.max(0, p.gold - 8);
  const roll = Math.random();
  if (roll < 0.4) {
    p.baseLck += 1;
    applyStats(p);
    log('酒館奇遇！幸運 +1。', 'good');
  } else if (roll < 0.7) {
    log('你喝了幾杯，暢談人生。', 'neutral');
  } else {
    log('你醉倒在桌下。HP -5。', 'warn');
    p.hp = Math.max(0, p.hp - 5);
  }
}

export function doRest() {
  if (!spendAP(1)) return;
  const p = state.player;
  const heal = Math.floor(p.hpMax * 0.4);
  p.hp = Math.min(p.hpMax, p.hp + heal);
  log(`你休息一日。HP +${heal}。`, 'good');
}

export function doEnterShop() {
  if (!spendAP(1)) return;
  openShop();
}

export function doEnterTavern() {
  if (!spendAP(1)) return;
  doTavern();
}

export function doAdventure() {
  if (!spendAP(2)) return;
  startAdventure();
}

export function doNextYear() {
  if (state.ap < state.apMax) {
    log(`AP 還有剩餘（${state.ap}/${state.apMax}），無法進入下一年。`, 'warn');
    return;
  }
  advanceYear();
}

// 訓練選擇介面用：列出當前可訓練屬性
export const TRAINABLE_STATS = ['str', 'agi', 'int', 'vit', 'lck'];
