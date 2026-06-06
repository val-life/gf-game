// 城鎮行為（v2：歲數門檻）
import { state, isActionAllowed, getAgeStage } from '../core/state.js';
import { log } from '../ui/log.js';
import { applyStats, runHook } from '../core/hooks.js';
import { openShop } from './shop.js';
import { startAdventure } from './adventure.js';
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

function lockedReason(action) {
  const stage = getAgeStage(state.player.age);
  return `你的歲數階段【${stage.name}】尚不能做這件事`;
}

// ========== 嬰兒/幼兒專屬 ==========
export function doCry() {
  if (!isActionAllowed('cry', state.player.age)) return;
  log('你嚎啕大哭。父母急忙來安撫你。體質 +1。', 'good');
  state.player.baseCon += 1;
  applyStats(state.player);
  state.ap = Math.max(0, state.ap); // 嬰兒不消耗 AP
}

export function doSleep() {
  if (!isActionAllowed('sleep', state.player.age)) { log(lockedReason('sleep'), 'warn'); return; }
  if (!spendAP(1)) return;
  const heal = Math.floor(state.player.maxHp * 0.3);
  state.player.hp = Math.min(state.player.maxHp, state.player.hp + heal);
  log(`安睡一日，HP +${heal}。`, 'good');
}

export function doPlay() {
  if (!isActionAllowed('play', state.player.age)) { log(lockedReason('play'), 'warn'); return; }
  if (!spendAP(1)) return;
  const p = state.player;
  const choice = Math.random() < 0.5 ? 'dex' : 'cha';
  p[`base${choice.charAt(0).toUpperCase()}${choice.slice(1)}`] = (p[`base${choice.charAt(0).toUpperCase()}${choice.slice(1)}`] ?? 0) + 1;
  applyStats(p);
  log(`你與鄰家孩子嬉戲。${choice.toUpperCase()} +1。`, 'good');
  shakeStat(choice);
}

export function doStudyBasic() {
  if (!isActionAllowed('study_basic', state.player.age)) { log(lockedReason('study_basic'), 'warn'); return; }
  if (!spendAP(1)) return;
  const p = state.player;
  p.baseInt = (p.baseInt ?? 0) + 1;
  applyStats(p);
  log('你跟著母親學認字。智力 +1。', 'good');
}

// ========== 通用 ==========
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
  if (!isActionAllowed('study', state.player.age)) { log(lockedReason('study'), 'warn'); return; }
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
  if (!isActionAllowed('tavern', state.player.age)) { log(lockedReason('tavern'), 'warn'); return; }
  if (!spendAP(1)) return;
  const p = state.player;
  p.gold = Math.max(0, p.gold - 8);
  const roll = Math.random();
  if (roll < 0.4) {
    p.baseLuk += 1;
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

export function doAdventure() {
  if (!isActionAllowed('adventure', state.player.age)) {
    log(lockedReason('adventure') + '。', 'warn');
    log('提示：童年可使用「安全冒險」（單 AP、低風險）。', 'neutral');
    return;
  }
  if (!spendAP(2)) return;
  startAdventure();
}

export function doSafeAdventure() {
  if (!isActionAllowed('adventure_safe', state.player.age)) { log(lockedReason('adventure_safe'), 'warn'); return; }
  if (!spendAP(1)) return;
  // 簡化：低風險冒險，少量金幣
  const earn = 5 + Math.floor(Math.random() * 10);
  state.player.gold += earn;
  log(`你採集野菜與藥草，賣得 ${earn} 金幣。`, 'good');
}

export function doNextYear() {
  if (state.ap < state.apMax) {
    log(`AP 還有剩餘（${state.ap}/${state.apMax}），無法進入下一年。`, 'warn');
    return;
  }
  advanceYear();
}

export const TRAINABLE_STATS = ['str', 'con', 'dex', 'int', 'cha', 'luk'];

// 列出當前階段可用與鎖定動作
export function listActions() {
  const allActions = [
    { id: 'cry', label: '哭泣', ap: 0 },
    { id: 'sleep', label: '安睡', ap: 1 },
    { id: 'play', label: '嬉戲', ap: 1 },
    { id: 'study_basic', label: '認字', ap: 1 },
    { id: 'train', label: '訓練', ap: 1 },
    { id: 'work', label: '勞作', ap: 1 },
    { id: 'study', label: '求學', ap: 1 },
    { id: 'rest', label: '休息', ap: 1 },
    { id: 'shop', label: '商店', ap: 1 },
    { id: 'tavern', label: '酒館', ap: 1 },
    { id: 'adventure_safe', label: '採集冒險', ap: 1 },
    { id: 'adventure', label: '深度冒險', ap: 2 }
  ];
  return allActions.map(a => ({ ...a, allowed: isActionAllowed(a.id, state.player.age) }));
}
