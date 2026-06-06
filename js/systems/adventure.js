// 冒險系統。Press-your-luck 步進制
import { state } from '../core/state.js';
import { log } from '../ui/log.js';
import { runHook } from '../core/hooks.js';
import { getStageEnemies, makeEnemyInstance } from '../data/enemies.js';
import { startCombat } from './combat.js';
import { ITEMS } from '../data/items.js';
import { pickWeighted } from '../core/util.js';
import { triggerGameOver } from './life.js';

export function startAdventure() {
  state.adventure = {
    step: 0,
    max: 8,
    results: [],
    loot: [],
    gold: 0,
    steps: 1
  };
  state.phase = 'adventure';
  log('你踏入冒險之路，前方危機四伏……', 'epic');
}

export function adventureStep() {
  const adv = state.adventure;
  if (!adv) return;
  // 鉤子影響步數
  const ctx = { steps: 1 };
  runHook('onAdvStep', state.player, ctx);
  adv.step += ctx.steps;

  if (adv.step >= adv.max) {
    log('你穿越冒險地，凱旋歸來！', 'good');
    state.player.gold += adv.gold;
    adv.loot.forEach(l => state.player.inventory.push(l));
    log(`收穫：金幣 +${adv.gold}`, 'good');
    adv.loot.forEach(l => log(`獲得【${l.name}】`, 'good'));
    state.adventure = null;
    state.phase = 'town';
    return;
  }

  // 抽事件
  const r = Math.random();
  if (r < 0.4) {
    // 怪物戰
    const pool = getStageEnemies(state.player.age);
    const enemyId = pickWeighted(pool, () => 1);
    log(`冒險第 ${adv.step} 步：遭遇敵人！`, 'neutral');
    state.phase = 'combat';
    startCombat(enemyId);
    // 戰鬥結束後需手動回冒險，這裡用一個回呼
    state.adventure.returnAfterCombat = true;
  } else if (r < 0.7) {
    // 文字事件
    const events = ['find_chest', 'trap', 'traveler', 'rest_stop'];
    const e = pickWeighted(events, () => 1);
    resolveAdvEvent(e);
  } else if (r < 0.9) {
    // 休息點
    log('冒險第 ' + adv.step + ' 步：發現休息點。', 'good');
    const heal = Math.floor(state.player.hpMax * 0.2);
    state.player.hp = Math.min(state.player.hpMax, state.player.hp + heal);
    log(`你紮營休息。HP +${heal}。`, 'good');
  } else {
    // 陷阱
    const dmg = 5 + Math.floor(state.player.age / 5);
    state.player.hp = Math.max(0, state.player.hp - dmg);
    log(`冒險第 ${adv.step} 步：踩中陷阱！HP -${dmg}。`, 'bad');
    if (state.player.hp <= 0) return triggerGameOver('冒險中陣亡');
  }
}

function resolveAdvEvent(kind) {
  switch (kind) {
    case 'find_chest': {
      const gold = 10 + Math.floor(Math.random() * 20);
      state.adventure.gold += gold;
      log(`你發現寶箱！金幣 +${gold}。`, 'good');
      break;
    }
    case 'trap': {
      const dmg = 8;
      state.player.hp = Math.max(0, state.player.hp - dmg);
      log(`地面塌陷！HP -${dmg}。`, 'bad');
      if (state.player.hp <= 0) triggerGameOver('冒險中陣亡');
      break;
    }
    case 'traveler': {
      log('你遇見一位旅人，他送你一把小刀。', 'good');
      const knife = { id: 'potion_small', ...ITEMS.potion_small, instanceId: crypto.randomUUID() };
      state.adventure.loot.push(knife);
      break;
    }
    case 'rest_stop': {
      const heal = 15;
      state.player.hp = Math.min(state.player.hpMax, state.player.hp + heal);
      log(`小溪清泉。HP +${heal}。`, 'good');
      break;
    }
  }
}

export function retreatAdventure() {
  const adv = state.adventure;
  if (!adv) return;
  state.player.gold += adv.gold;
  adv.loot.forEach(l => state.player.inventory.push(l));
  log(`你帶著收穫撤退：金幣 +${adv.gold}，戰利品 ${adv.loot.length} 件。`, 'good');
  state.adventure = null;
  state.phase = 'town';
}

// 戰鬥返回冒險的鉤子
export function onCombatEndReturnToAdventure() {
  if (state.adventure?.returnAfterCombat) {
    state.adventure.returnAfterCombat = false;
    state.phase = 'adventure';
  }
}
