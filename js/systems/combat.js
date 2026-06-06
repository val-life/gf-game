// 戰鬥系統
import { state } from '../core/state.js';
import { log } from '../ui/log.js';
import { applyStats, runHook } from '../core/hooks.js';
import { ENEMIES, getAgeBoss, makeEnemyInstance } from '../data/enemies.js';
import { triggerGameOver } from './life.js';
import { shakeHP, flashRed, flashGold } from '../ui/juice.js';


let turnTimer = null;

export function startCombat(enemyId) {
  clearTimeout(turnTimer);
  const inst = makeEnemyInstance(enemyId);
  if (!inst) return false;
  state.currentEnemy = inst;
  state.combatLog = [];
  state.phase = 'combat';
  log(`遭遇戰：${inst.name}！`, 'epic');
  // 戰鬥開始鉤子
  const logs = runHook('onCombatStart', state.player, { enemy: inst });
  logs.forEach(l => log(l, 'magic'));
  return true;
}

export function triggerBossAt(age) {
  const bossId = getAgeBoss(age);
  if (!bossId) return false;
  return startCombat(bossId);
}

export function playerAttack() {
  const p = state.player;
  const e = state.currentEnemy;
  if (!e || e.currentHp <= 0) return;

  // 計算攻擊
  const ctx = { baseAtk: p.atk, atkBonus: 0, targetIsBoss: !!e.isBoss };
  const atkLogs = runHook('onAtkCalc', p, ctx);
  atkLogs.forEach(l => log(l, 'magic'));
  let atk = p.atk + (ctx.atkBonus ?? 0);

  // 閃避判定
  const dodgeChance = Math.min(60, e.spd * 1.5);
  if (Math.random() * 100 < dodgeChance) {
    log(`${e.name} 靈敏閃避了你的攻擊！`, 'neutral');
  } else {
    let dmg = Math.max(1, atk - e.def);
    // 暴擊
    const crit = Math.random() * 100 < (p.critRate ?? 0);
    if (crit) {
      dmg = Math.floor(dmg * (p.critMult ?? 2));
      log(`暴擊！`, 'epic');
    }
    // 攻擊造成傷害鉤子
    const dealCtx = { damage: dmg, target: e, targetIsBoss: !!e.isBoss, bonus: 0 };
    const dl = runHook('onDealDamage', p, dealCtx);
    dmg = Math.floor(dmg * (1 + (dealCtx.bonus ?? 0)));
    e.currentHp = Math.max(0, e.currentHp - dmg);
    log(`你攻擊 ${e.name}，造成 ${dmg} 傷害。（${e.currentHp}/${e.hp}）`, 'good');
    dl.forEach(l => log(l, 'magic'));
    flashRed();
  }

  checkCombatEnd();
  if (state.phase === 'combat') {
    turnTimer = setTimeout(enemyTurn, 700);
  }
}

export function enemyTurn() {
  const p = state.player;
  const e = state.currentEnemy;
  if (!e || e.currentHp <= 0) return;

  // 玩家閃避（敏捷 → 閃避率）
  const dodgeChance = Math.min(50, p.agi * 1.2 + (p.equipment?.accessory?.special === 'dodgeHeal' ? 15 : 0));
  const dodgeCtx = { dodging: true, dodgeBonus: 0 };
  runHook('onCombatDodge', p, dodgeCtx);
  const finalDodge = dodgeChance + (dodgeCtx.dodgeBonus ?? 0);

  if (Math.random() * 100 < finalDodge) {
    log(`你閃避了 ${e.name} 的攻擊！`, 'good');
    // 吸血鬼披風
    if (p.equipment?.accessory?.special === 'dodgeHeal') {
      const heal = Math.floor(p.hpMax * 0.1);
      p.hp = Math.min(p.hpMax, p.hp + heal);
      log(`【吸血鬼披風】觸發：HP +${heal}。`, 'magic');
    }
  } else {
    let dmg = Math.max(1, e.atk - p.def);
    const takeCtx = { reduction: 0, fromFire: e.name?.includes('龍') ?? e.name?.includes('火') };
    runHook('onTakeDamage', p, takeCtx);
    dmg = Math.floor(dmg * (1 - (takeCtx.reduction ?? 0)));
    p.hp = Math.max(0, p.hp - dmg);
    log(`${e.name} 攻擊你，造成 ${dmg} 傷害。（${p.hp}/${p.hpMax}）`, 'bad');
    shakeHP();
    flashRed();
  }

  checkCombatEnd();
  if (state.phase === 'combat') {
    // 玩家回合開始鉤子
    const ts = runHook('onTurnStart', p, { target: e });
    ts.forEach(l => log(l, 'magic'));
    state.phase = 'combat';
  }
}

export function useCombatItem() {
  // UI 端選背包中的消耗品
}

function checkCombatEnd() {
  const p = state.player;
  const e = state.currentEnemy;
  if (e.currentHp <= 0) {
    resolveVictory();
  } else if (p.hp <= 0) {
    // 致命判定
    const fatalCtx = {};
    const logs = runHook('onFatalDamage', p, fatalCtx);
    if (logs.length > 0) {
      logs.forEach(l => log(l, 'epic'));
      // 復活
      if (p.hp > 0) {
        log('你從死亡邊緣撿回一命！', 'epic');
        return;
      }
    }
    // 夥伴犧牲
    let sacrificed = false;
    for (const id in p.affinity) {
      const aff = p.affinity[id];
      const min = p.npcData?.[id]?.affAt ?? 999;
      if (aff >= min && Math.random() < 0.5) {
        const npc = p.npcData[id];
        log(`【${npc.name}】犧牲自己救你一命。`, 'epic');
        p.affinity[id] = -1;
        p.hp = Math.max(1, p.hpMax);
        sacrificed = true;
        break;
      }
    }
    if (!sacrificed) {
      resolveDefeat();
    }
  }
}

function resolveVictory() {
  const p = state.player;
  const e = state.currentEnemy;
  const goldGain = e.gold + Math.floor(Math.random() * 5);
  p.gold += goldGain;
  p.kills += 1;
  if (e.isBoss) {
    p.bossesKilled.push(e.name);
    log(`BOSS 擊敗：${e.name}！金幣 +${goldGain}`, 'epic');
    flashGold();
  } else {
    log(`戰鬥勝利！金幣 +${goldGain}`, 'good');
  }
  if (p.kills % 3 === 0) {
    p.baseVit += 1;
    applyStats(p);
    log('戰場磨練：體質 +1，HP 上限提升！', 'good');
  }
  state.currentEnemy = null;
  if (state.adventure?.returnAfterCombat) {
    state.adventure.returnAfterCombat = false;
    state.adventure.gold += goldGain;
    state.phase = 'adventure';
  } else {
    state.phase = 'town';
  }
}

function resolveDefeat() {
  log('你被擊敗了……', 'epic');
  state.currentEnemy = null;
  state.adventure = null;
  triggerGameOver('戰鬥中陣亡');
}

export function fleeCombat() {
  if (state.currentEnemy?.isBoss) {
    log('Boss 戰無法逃脫！', 'warn');
    return false;
  }
  if (Math.random() < 0.5) {
    log('你倉皇逃離戰場。', 'warn');
    state.currentEnemy = null;
    state.phase = 'town';
    state.player.hp = Math.max(1, state.player.hp - 5);
    return true;
  } else {
    log('逃跑失敗！', 'warn');
    turnTimer = setTimeout(enemyTurn, 500);
    return false;
  }
}
