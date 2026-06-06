// 戰鬥系統（v2：六維 + 怪物能力 + 主線 Boss）
import { state } from '../core/state.js';
import { log } from '../ui/log.js';
import { applyStats, runHook } from '../core/hooks.js';
import { ENEMIES, getMainStoryBoss, makeEnemyInstance } from '../data/enemies.js';
import { triggerGameOver } from './life.js';
import { shakeHP, flashRed, flashGold } from '../ui/juice.js';
import { giveAchievement } from './achievements.js';

let turnTimer = null;

export function startCombat(enemyId) {
  clearTimeout(turnTimer);
  const inst = makeEnemyInstance(enemyId);
  if (!inst) return false;
  state.currentEnemy = inst;
  state.combatLog = [];
  state.phase = 'combat';
  log(`遭遇戰：${inst.name}！`, 'epic');
  const logs = runHook('onCombatStart', state.player, { enemy: inst });
  logs.forEach(l => log(l, 'magic'));
  return true;
}

export function triggerBossAt(age) {
  const bossId = getMainStoryBoss(age);
  if (!bossId) return false;
  return startCombat(bossId);
}

function critChance(attacker) {
  return attacker.critPct ?? 0;
}

function dodgeChance(defender, attacker) {
  // 公式：dodge% - attacker.dex * 0.1%
  return Math.max(0, (defender.dodgePct ?? 0) - (attacker.dex ?? 0) * 0.1);
}

export function playerAttack() {
  const p = state.player;
  const e = state.currentEnemy;
  if (!e || e.currentHp <= 0) return;

  e.turn = (e.turn ?? 0) + 1;

  // 計算攻擊
  const ctx = { baseAtk: p.atk, atkBonus: 0, targetIsBoss: !!e.isBoss };
  const atkLogs = runHook('onAtkCalc', p, ctx);
  atkLogs.forEach(l => log(l, 'magic'));
  let atk = p.atk + (ctx.atkBonus ?? 0);

  // 閃避判定
  const dChance = dodgeChance(e, p);
  if (Math.random() * 100 < dChance) {
    log(`${e.name} 靈敏閃避了你的攻擊！`, 'neutral');
  } else {
    let dmg = Math.max(1, atk - e.def);
    const crit = Math.random() * 100 < critChance(p);
    if (crit) {
      dmg = Math.floor(dmg * 2.0);
      log(`暴擊！`, 'epic');
    }
    const dealCtx = { damage: dmg, target: e, targetIsBoss: !!e.isBoss, bonus: 0 };
    const dl = runHook('onDealDamage', p, dealCtx);
    dmg = Math.floor(dmg * (1 + (dealCtx.bonus ?? 0)));
    e.currentHp = Math.max(0, e.currentHp - dmg);
    log(`你攻擊 ${e.name}，造成 ${dmg} 傷害。（${e.currentHp}/${e.hp}）`, 'good');
    dl.forEach(l => log(l, 'magic'));
    flashRed();
  }

  // 怪物 phase_change
  checkEnemyPhase(e);

  if (checkCombatEnd()) return;
  turnTimer = setTimeout(enemyTurn, 700);
}

function checkEnemyPhase(e) {
  const ab = e.ability;
  if (!ab) return;
  if (ab.type === 'phase_change' && !e.abilityTriggered && e.currentHp <= (ab.hp_threshold ?? e.hp / 2)) {
    e.abilityTriggered = true;
    e.enrageActive = true;
    const buff = ab.atk_buff_pct ?? 30;
    e.atk = Math.floor(e.baseAtk * (1 + buff / 100));
    log(`${e.name} 觸發【狂暴】！攻擊力 +${buff}%！`, 'epic');
    flashRed();
  }
}

export function enemyTurn() {
  const p = state.player;
  const e = state.currentEnemy;
  if (!e || e.currentHp <= 0) return;
  e.turn = (e.turn ?? 0) + 1;

  // 玩家閃避
  const dChance = dodgeChance(p, e);
  const dodgeCtx = { dodging: true, dodgeBonus: 0 };
  runHook('onCombatDodge', p, dodgeCtx);
  const finalDodge = dChance + (dodgeCtx.dodgeBonus ?? 0);

  if (Math.random() * 100 < finalDodge) {
    log(`你閃避了 ${e.name} 的攻擊！`, 'good');
  } else {
    // 怪物技能
    const ab = e.ability;
    let dmg = Math.max(1, e.atk - p.def);
    if (ab?.type === 'active' && e.turn >= (ab.trigger_turn ?? 99) && !e.abilityTriggered) {
      e.abilityTriggered = true;
      // 根據效果類型處理
      const result = triggerAbility(e, ab, p, dmg);
      dmg = result.dmg;
      // 附加效果
      if (result.extraLog) log(result.extraLog, 'bad');
    }
    // 玩家受擊
    const takeCtx = { reduction: 0, fromFire: e.instanceId?.includes('HELL') || e.instanceId?.includes('FIRE') };
    runHook('onTakeDamage', p, takeCtx);
    dmg = Math.floor(dmg * (1 - (takeCtx.reduction ?? 0)) * (1 - (p.fireResist ?? 0)));
    p.hp = Math.max(0, p.hp - dmg);
    log(`${e.name} 攻擊你，造成 ${dmg} 傷害。（${p.hp}/${p.maxHp}）`, 'bad');
    shakeHP();
    flashRed();
  }

  // 玩家回合開始
  const ts = runHook('onTurnStart', p, { target: e });
  ts.forEach(l => log(l, 'magic'));

  // 玩家回合結束（詛咒之刃自傷）
  const te = runHook('onTurnEnd', p, { target: e });
  te.forEach(l => log(l, 'bad'));

  if (checkCombatEnd()) return;
  state.phase = 'combat';
}

function triggerAbility(e, ab, p, baseDmg) {
  let dmg = baseDmg;
  let extraLog = '';
  switch (ab.effect) {
    case 'vampire': {
      const heal = ab.value ?? 5;
      e.currentHp = Math.min(e.hp, e.currentHp + heal);
      extraLog = `${e.name} 吸血 +${heal} HP。`;
      break;
    }
    case 'poison': {
      p.poisonStacks = (p.poisonStacks ?? 0) + (ab.value ?? 5);
      extraLog = `${e.name} 附加中毒！中毒層數 +${ab.value}。`;
      break;
    }
    case 'burn_reflection': {
      // 被火傷時反射
      extraLog = `${e.name} 周身火焰環繞，反射 10% 火傷。`;
      break;
    }
    case 'heavy_smash': {
      dmg = Math.floor(dmg * (ab.multiplier ?? 1.5));
      extraLog = `${e.name} 施放【重擊】！傷害 ×${ab.multiplier}！`;
      break;
    }
    case 'execute': {
      if (p.hp / p.maxHp * 100 < (ab.threshold_pct ?? 25)) {
        dmg = p.hp;
        extraLog = `${e.name} 觸發【處決】！直接擊殺！`;
      }
      break;
    }
    case 'aoe_curse': {
      p.atk = Math.max(1, p.atk - Math.floor(p.atk * (ab.value ?? 20) / 100));
      extraLog = `${e.name} 施放【詛咒領域】，你攻擊力 -${ab.value}%！`;
      break;
    }
    case 'enrage': {
      e.atk = Math.floor(e.baseAtk * (1 + (ab.atk_buff_pct ?? 30) / 100));
      extraLog = `${e.name} 狂暴！攻擊 +${ab.atk_buff_pct}%！`;
      break;
    }
    case 'fireball': {
      dmg = (ab.value ?? 80);
      extraLog = `${e.name} 施放【火球術】！固定 ${dmg} 傷害。`;
      break;
    }
    case 'stun': {
      extraLog = `${e.name} 施放【眩暈】，你下回合無法行動。`;
      break;
    }
  }
  return { dmg, extraLog };
}

function checkCombatEnd() {
  const p = state.player;
  const e = state.currentEnemy;
  if (e.currentHp <= 0) {
    resolveVictory();
    return true;
  } else if (p.hp <= 0) {
    const fatalCtx = {};
    const logs = runHook('onFatalDamage', p, fatalCtx);
    if (logs.length > 0) {
      logs.forEach(l => log(l, 'epic'));
      if (p.hp > 0) {
        log('你從死亡邊緣撿回一命！', 'epic');
        return false;
      }
    }
    // 夥伴犧牲
    let sacrificed = false;
    for (const id of (p.mainStoryPassed?.length > 0 ? Object.keys(p.affinity ?? {}) : Object.keys(p.affinity ?? {}))) {
      const aff = p.affinity[id];
      if (!aff || aff < 0) continue;
      const min = p.npcData?.[id]?.affAt ?? 999;
      if (aff >= min && Math.random() < 0.5) {
        const npc = p.npcData[id];
        log(`【${npc.name}】犧牲自己救你一命。`, 'epic');
        p.affinity[id] = -1;
        p.hp = Math.max(1, p.maxHp);
        sacrificed = true;
        break;
      }
    }
    if (!sacrificed) {
      resolveDefeat();
      return true;
    }
  }
  return false;
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
    if (e.mainBoss) giveAchievement(`擊敗：${e.name}`);
  } else {
    log(`戰鬥勝利！金幣 +${goldGain}`, 'good');
  }
  if (p.kills % 5 === 0) {
    p.baseCon += 1;
    applyStats(p);
    log('戰場磨練：體質 +1，HP 上限提升！', 'good');
  }
  // 掉落
  if (e.exp) {
    p.score = (p.score ?? 0) + e.exp;
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
