/* =============================================================
   combat.js — turn-based combat engine
   Exposed on window.Combat
   ============================================================= */
(function (global) {
  'use strict';

  let active = null;       // current combat instance
  let onEndCb = null;      // callback when combat resolves
  let _busy = false;       // reentrancy guard

  /* ---- factory ---- */
  function makeCombatant(opts) {
    return {
      name: opts.name,
      portrait: opts.portrait || (opts.isPlayer ? '人' : '妖'),
      side: opts.isPlayer ? 'player' : 'enemy',
      isPlayer: !!opts.isPlayer,
      hp: opts.hp, maxHp: opts.hp,
      mp: opts.mp || 0, maxMp: opts.mp || 0,
      atk: opts.atk, def: opts.def,
      mag: opts.mag || 0, res: opts.res || 0,
      spd: opts.spd,
      crit: opts.crit || 5,
      dodge: opts.dodge || 3,
      skills: opts.skills || ['strike'],
      status: [],
      cooldowns: {},
      defending: false,
      // enemy-only
      ai: opts.ai,
      level: opts.level || 0,
      boss: !!opts.boss,
      noFlee: !!opts.noFlee,
      statusOnHit: opts.statusOnHit || null,
      statusChance: opts.statusChance || 0,
      drop: opts.drop,
      // runtime
      turn: 0,
    };
  }

  function start(enemyId, options) {
    options = options || {};
    const tpl = ENEMIES[enemyId];
    if (!tpl) { console.error('unknown enemy', enemyId); return; }

    State.recompute();

    const player = makeCombatant({
      name: G.name || '你',
      portrait: G.gender === 'female' ? '女' : '男',
      isPlayer: true,
      hp: G.hp, mp: G.mp,
      atk: G._atk, def: G._def,
      mag: G._mag, res: G._res,
      spd: G._spd, crit: G._crit, dodge: G._dodge,
      skills: G.skills.slice(),
      // player has no statusOnHit; statuses come from enemy hits
    });
    const enemy = makeCombatant({
      name: tpl.name,
      portrait: enemyId[0],
      hp: tpl.hp, mp: tpl.mp || 0,
      atk: tpl.atk, def: tpl.def,
      mag: tpl.mag || 0, res: tpl.res || 0,
      spd: tpl.spd, crit: 5, dodge: 3,
      skills: (tpl.skills || []).slice(),
      ai: tpl.ai || 'aggressive',
      level: tpl.level || 0,
      boss: !!tpl.boss,
      noFlee: !!tpl.noFlee,
      statusOnHit: tpl.statusOnHit || null,
      statusChance: tpl.statusChance || 0,
      drop: tpl.drop,
    });

    active = {
      enemyId, player, enemy,
      log: [],
      turn: 0,
      awaiting: 'player',
      options,
    };
    onEndCb = options.onEnd || null;
    _busy = false;

    U.bus.emit('combat:start', active);
    log('战斗开始：' + tpl.name + ' 袭来！', 'system');

    // Pre-turn: status decay, regen
    tickStatus(player, true);
    tickStatus(enemy, true);

    // Determine who goes first
    const pIni = player.spd + U.R.randInt(1, 10);
    const eIni = enemy.spd + U.R.randInt(1, 10);
    active.awaiting = pIni >= eIni ? 'player' : 'enemy';
    log(active.awaiting === 'player' ? '你先发制人！' : (tpl.name + ' 抢先出手！'), 'system');

    if (active.awaiting === 'enemy') {
      setTimeout(() => enemyTurn(), 700);
    }
  }

  function log(msg, kind, extra) {
    if (!active) return;
    active.log.push({ msg, kind: kind || 'system', extra: extra || null });
    U.bus.emit('combat:log', { msg, kind: kind || 'system', extra });
  }

  /* ---- status helpers ---- */
  function hasStatus(c, id) { return c.status.find(s => s.id === id); }
  function addStatus(c, id, dur) {
    if (hasStatus(c, id)) return;
    if (!STATUS[id]) return;
    c.status.push({ id, dur: dur || 1 });
  }
  function tickStatus(c, isStart) {
    // Apply DOT/HOT effects at start of own turn (or immediately on battle start)
    const keep = [];
    for (const s of c.status) {
      const def = STATUS[s.id];
      if (!def) continue;
      if (def.kind === 'dot') {
        const dmg = Math.max(1, Math.round(c.maxHp * def.pct));
        c.hp = Math.max(0, c.hp - dmg);
        log(c.name + ' 受 ' + def.name + ' 影响，损失 ' + dmg + ' 气血。', 'system');
      } else if (def.kind === 'hot') {
        const heal = Math.max(1, Math.round(c.maxHp * def.pct));
        c.hp = Math.min(c.maxHp, c.hp + heal);
        log(c.name + ' 因 ' + def.name + '，恢复 ' + heal + ' 气血。', 'system');
      }
      s.dur -= 1;
      if (s.dur > 0) keep.push(s);
      else log(c.name + ' 的 ' + def.name + ' 消退了。', 'system');
    }
    c.status = keep;
  }

  /* ---- damage calc ---- */
  function calcPhysDmg(att, defn, isCrit) {
    const base = att.atk - defn.def / 2;
    const variance = U.R.rand() * att.atk * 0.15;
    let dmg = Math.max(1, Math.round(base + variance));
    if (isCrit) dmg = Math.round(dmg * 1.6);
    // vulnerability / weak
    if (hasStatus(defn, 'vulnerable')) dmg = Math.round(dmg * 1.25);
    if (hasStatus(att, 'weak')) dmg = Math.round(dmg * 0.75);
    // defend
    if (defn.defending || hasStatus(defn, 'defend')) dmg = Math.round(dmg * 0.5);
    return dmg;
  }
  function calcMagDmg(att, defn, power, isCrit) {
    const base = att.mag * power - defn.res / 2;
    const variance = U.R.rand() * att.mag * 0.10;
    let dmg = Math.max(1, Math.round(base + variance));
    if (isCrit) dmg = Math.round(dmg * 1.6);
    if (hasStatus(defn, 'vulnerable')) dmg = Math.round(dmg * 1.25);
    if (hasStatus(att, 'weak')) dmg = Math.round(dmg * 0.75);
    if (defn.defending || hasStatus(defn, 'defend')) dmg = Math.round(dmg * 0.5);
    return dmg;
  }
  function rollHit(att, defn) {
    const diff = att.spd - defn.spd;
    const hit = U.clamp(80 + diff * 1.5, 30, 98);
    if (U.R.chance(hit / 100)) return true;
    return U.R.chance(defn.dodge / 100) ? false : (U.R.rand() < hit / 100);
  }
  function rollCrit(att) {
    return U.R.chance(att.crit / 100);
  }

  /* ---- player actions ---- */
  function playerAttack() {
    if (!active || active.awaiting !== 'player' || _busy) return;
    _busy = true;
    const sk = SKILLS.strike;
    useSkill(active.player, active.enemy, sk);
    afterAction();
  }
  function playerSkill(skillId) {
    if (!active || active.awaiting !== 'player' || _busy) return;
    const sk = SKILLS[skillId];
    if (!sk) return;
    if (!active.player.skills.includes(skillId)) return;
    if ((active.player.cooldowns[skillId] || 0) > 0) {
      log(sk.name + ' 尚在冷却。', 'system'); return;
    }
    if (sk.cost && active.player.mp < sk.cost) {
      log('灵力不足，无法施展 ' + sk.name + '。', 'system'); return;
    }
    _busy = true;
    useSkill(active.player, active.enemy, sk);
    afterAction();
  }
  function playerDefend() {
    if (!active || active.awaiting !== 'player' || _busy) return;
    _busy = true;
    addStatus(active.player, 'defend', 1);
    active.player.defending = true;
    log(active.player.name + ' 凝神固守。', 'player');
    afterAction();
  }
  function playerItem(itemId) {
    if (!active || active.awaiting !== 'player' || _busy) return;
    const item = ITEMS[itemId];
    if (!item || item.type !== 'consumable') return;
    if (!State.hasItem(itemId)) { log('物品已用尽。', 'system'); return; }
    _busy = true;
    State.removeItem(itemId, 1);
    applyConsumable(active.player, item);
    log(active.player.name + ' 服下 ' + item.name + '。', 'player');
    afterAction();
  }
  function playerFlee() {
    if (!active || active.awaiting !== 'player' || _busy) return;
    const tpl = ENEMIES[active.enemyId];
    if (tpl.boss || tpl.noFlee) {
      log('你无法从这对手面前逃脱！', 'system'); return;
    }
    _busy = true;
    const diff = active.player.spd - active.enemy.spd;
    const chance = U.clamp(50 + diff * 2, 20, 90);
    if (U.R.chance(chance / 100)) {
      log('你抽身急退，脱离战团。', 'player');
      endCombat({ fled: true });
    } else {
      log('你试图逃跑，却被 ' + active.enemy.name + ' 截住！', 'system');
      // enemy gets a free hit
      const sk = SKILLS.strike;
      useSkill(active.enemy, active.player, sk, /*noCooldown*/ true);
      afterAction(true);
    }
  }

  function applyConsumable(c, item) {
    const eff = item.effect;
    if (!eff) return;
    if (eff.kind === 'heal_hp_pct') {
      const amt = Math.round(c.maxHp * eff.pct);
      c.hp = Math.min(c.maxHp, c.hp + amt);
      log(c.name + ' 恢复 ' + amt + ' 气血。', 'heal', { amt });
    } else if (eff.kind === 'heal_mp_pct') {
      const amt = Math.round(c.maxMp * eff.pct);
      c.mp = Math.min(c.maxMp, c.mp + amt);
      log(c.name + ' 恢复 ' + amt + ' 灵力。', 'heal', { amt });
    } else if (eff.kind === 'cultivation') {
      // only meaningful for player outside combat, but we just toast
      log('修为将会在战斗后得到增益。', 'system');
    } else if (eff.kind === 'cure') {
      c.status = c.status.filter(s => s.id !== eff.status);
      log(c.name + ' 身上的异常已清除。', 'system');
    } else if (eff.kind === 'qiyun') {
      // qiyun temp buff — for player only
      log('你感到一股福缘之气涌入。', 'system');
    } else if (eff.kind === 'age') {
      log('你感到寿元变化。', 'system');
    } else if (eff.kind === 'wuxing') {
      log('你感到悟性清明。', 'system');
    }
  }

  /* ---- core: useSkill ---- */
  function useSkill(att, defn, sk, noCooldown) {
    // cost
    if (sk.cost) att.mp = Math.max(0, att.mp - sk.cost);
    // cooldown
    if (!noCooldown && sk.cd) att.cooldowns[sk.id] = sk.cd;

    // hit/crit
    const hit = rollHit(att, defn);
    if (!hit) {
      log(att.name + ' 施展 ' + sk.name + '，但被 ' + defn.name + ' 闪避！', att.isPlayer ? 'player' : 'enemy');
      return;
    }
    const isCrit = rollCrit(att);
    // effect dispatch
    const eff = sk.effect;
    if (sk.type === 'phys' || (sk.type === 'mag' && !eff)) {
      // plain damage
      const pierce = (eff && eff.kind === 'armor_pierce') ? eff.pct : 0;
      const savedDef = defn.def;
      if (pierce) defn.def = Math.round(defn.def * (1 - pierce));
      const dmg = (sk.type === 'phys') ? calcPhysDmg(att, defn, isCrit) : calcMagDmg(att, defn, sk.power || 1, isCrit);
      if (pierce) defn.def = savedDef;
      defn.hp = Math.max(0, defn.hp - dmg);
      const tag = isCrit ? '【暴击】' : '';
      log(att.name + ' 施展 ' + sk.name + '，' + tag + '对 ' + defn.name + ' 造成 ' + dmg + ' 点伤害。',
          att.isPlayer ? 'player' : 'enemy', { dmg, crit: isCrit });
    } else if (eff) {
      switch (eff.kind) {
        case 'dmg': {
          const dmg = calcMagDmg(att, defn, eff.power, isCrit);
          defn.hp = Math.max(0, defn.hp - dmg);
          log(att.name + ' 施展 ' + sk.name + '，对 ' + defn.name + ' 造成 ' + dmg + ' 点伤害。',
              att.isPlayer ? 'player' : 'enemy', { dmg });
          break;
        }
        case 'heal': {
          const amt = Math.round(att.mag * (eff.magScale || 1) + (eff.pct || 0) * att.maxHp);
          att.hp = Math.min(att.maxHp, att.hp + amt);
          log(att.name + ' 施展 ' + sk.name + '，恢复 ' + amt + ' 气血。', 'heal', { amt });
          break;
        }
        case 'buff': {
          // defPct is applied at damage time via def boost
          att._defBoost = (att._defBoost || 0) + (eff.amount || 0.5);
          // we'll re-derive def at use time
          att.def = Math.round(att.def * (1 + (eff.amount || 0.5)));
          log(att.name + ' 施展 ' + sk.name + '，自身防御大增！', 'player');
          addStatus(att, 'defend', eff.dur || 1);
          break;
        }
        case 'debuff': {
          const dmg = calcMagDmg(att, defn, sk.power, isCrit);
          defn.hp = Math.max(0, defn.hp - dmg);
          log(att.name + ' 施展 ' + sk.name + '，对 ' + defn.name + ' 造成 ' + dmg + ' 点伤害。',
              att.isPlayer ? 'player' : 'enemy', { dmg });
          if (U.R.chance(eff.chance)) {
            addStatus(defn, eff.status, eff.dur || 1);
            const def = STATUS[eff.status];
            log(defn.name + ' 陷入 ' + def.name + '！', 'system');
          }
          break;
        }
        case 'lifesteal': {
          const dmg = calcPhysDmg(att, defn, isCrit);
          defn.hp = Math.max(0, defn.hp - dmg);
          const heal = Math.round(dmg * (eff.ratio || 0.3));
          att.hp = Math.min(att.maxHp, att.hp + heal);
          log(att.name + ' 施展 ' + sk.name + '，吸取 ' + heal + ' 气血，对 ' + defn.name + ' 造成 ' + dmg + ' 伤害。',
              att.isPlayer ? 'player' : 'enemy', { dmg, heal });
          break;
        }
        case 'armor_pierce': {
          const savedDef = defn.def;
          defn.def = Math.round(defn.def * (1 - eff.pct));
          const dmg = calcPhysDmg(att, defn, isCrit);
          defn.def = savedDef;
          defn.hp = Math.max(0, defn.hp - dmg);
          log(att.name + ' 施展 ' + sk.name + '，破甲一击，对 ' + defn.name + ' 造成 ' + dmg + ' 伤害。',
              att.isPlayer ? 'player' : 'enemy', { dmg });
          break;
        }
        case 'defend': {
          addStatus(att, 'defend', 1);
          att.defending = true;
          log(att.name + ' 凝神固守。', att.isPlayer ? 'player' : 'enemy');
          break;
        }
        case 'cultivation': {
          log(att.name + ' 入定修炼，蓄养修为。', att.isPlayer ? 'player' : 'enemy');
          // cultivation gain applied after combat if player wins
          att._pendingCultivation = (att._pendingCultivation || 0) + (eff.amount || 0);
          break;
        }
      }
    }
    // status on hit for enemies
    if (att.statusOnHit && !att.isPlayer && U.R.chance(att.statusChance || 0)) {
      addStatus(defn, att.statusOnHit, 3);
      log(defn.name + ' 中了 ' + STATUS[att.statusOnHit].name + '！', 'system');
    }
    // visual hit on the defn's portrait
    U.bus.emit('combat:hit', { side: defn.side, dmg: 1 });
  }

  function afterAction(skippedEnemy) {
    // tick down cooldowns at end of player's action (we'll tick all cd at turn end)
    // check enemy death
    if (active.enemy.hp <= 0) { endCombat({ win: true }); return; }
    // enemy turn
    if (!skippedEnemy) {
      active.awaiting = 'enemy';
      setTimeout(() => enemyTurn(), 500);
    } else {
      active.awaiting = 'player';
      _busy = false;
    }
  }

  /* ---- enemy AI ---- */
  function enemyTurn() {
    if (!active) return;
    if (active.enemy.hp <= 0) { endCombat({ win: true }); return; }
    if (hasStatus(active.enemy, 'stun')) {
      log(active.enemy.name + ' 陷入眩晕，无法行动。', 'system');
      endTurnEnemy();
      return;
    }
    // choose action
    const e = active.enemy;
    const ai = e.ai || 'aggressive';
    const skillsAvail = e.skills.filter(sid => {
      const sk = SKILLS[sid];
      if (!sk) return false;
      if ((e.cooldowns[sid] || 0) > 0) return false;
      if (sk.cost && e.mp < sk.cost) return false;
      return true;
    });
    let action = 'strike';
    let useDef = false;
    const hpPct = e.hp / e.maxHp;
    const r = U.R.rand();
    if (ai === 'aggressive') {
      if (r < 0.75 && skillsAvail.length) action = U.R.pick(skillsAvail);
      else action = 'strike';
    } else if (ai === 'defensive') {
      if (r < 0.3) useDef = true;
      else if (r < 0.7 && skillsAvail.length) action = U.R.pick(skillsAvail);
      else action = 'strike';
    } else if (ai === 'caster') {
      if (r < 0.55 && skillsAvail.length) action = U.R.pick(skillsAvail);
      else if (r < 0.75) useDef = true;
      else action = 'strike';
    } else if (ai === 'berserk') {
      if (hpPct < 0.3) action = skillsAvail[0] || 'strike';
      else if (r < 0.7 && skillsAvail.length) action = U.R.pick(skillsAvail);
      else action = 'strike';
    } else if (ai === 'tricky') {
      if (r < 0.5 && skillsAvail.length) action = U.R.pick(skillsAvail);
      else action = 'strike';
    } else {
      action = 'strike';
    }

    if (useDef) {
      addStatus(e, 'defend', 1);
      e.defending = true;
      log(e.name + ' 凝神固守。', 'enemy');
    } else {
      const sk = SKILLS[action] || SKILLS.strike;
      useSkill(e, active.player, sk);
    }
    endTurnEnemy();
  }

  function endTurnEnemy() {
    if (active.player.hp <= 0) { endCombat({ lose: true }); return; }
    // tick cooldowns both sides
    for (const k in active.player.cooldowns) if (active.player.cooldowns[k] > 0) active.player.cooldowns[k]--;
    for (const k in active.enemy.cooldowns)   if (active.enemy.cooldowns[k]   > 0) active.enemy.cooldowns[k]--;
    // clear defending flag (defend lasts 1 turn)
    active.player.defending = false;
    active.enemy.defending = false;
    // tick status for both
    tickStatus(active.player, false);
    if (active.enemy.hp <= 0) { endCombat({ win: true }); return; }
    tickStatus(active.enemy, false);
    if (active.enemy.hp <= 0) { endCombat({ win: true }); return; }
    if (active.player.hp <= 0) { endCombat({ lose: true }); return; }
    // next round
    active.turn++;
    active.awaiting = 'player';
    _busy = false;
    U.bus.emit('combat:turn', active);
  }

  /* ---- end combat ---- */
  function endCombat(result) {
    // persist player HP/MP back to G
    if (active && active.player) {
      G.hp = active.player.hp;
      G.mp = active.player.mp;
    }
    if (result.win) {
      const drop = active.enemy.drop || { exp: 0, lingshi: 0, items: [] };
      const exp = drop.exp || 0;
      const ling = drop.lingshi || 0;
      G.exp += exp;
      G.lingshi += ling;
      // cultivation gain from meditation skill
      const cultGain = active.player._pendingCultivation || 0;
      if (cultGain) State.addCultivation(cultGain);
      // items
      const gotItems = [];
      (drop.items || []).forEach(d => {
        if (U.R.chance(d.chance)) {
          State.addItem(d.id, d.qty || 1);
          gotItems.push((ITEMS[d.id] || { name: d.id }).name + '×' + (d.qty || 1));
        }
      });
      // quest flags
      if (active.enemyId === 'mountain_wolf' && !G.flags.first_kill) {
        G.flags.first_kill = true;
        State.grantAchievement('first_kill');
      }
      log('胜利！获得经验 ' + exp + '，灵石 ' + ling + (gotItems.length ? '，物品 ' + gotItems.join('、') : '') + '。', 'system');
      U.toast('战斗胜利！经验+' + exp + ' 灵石+' + ling);
    } else if (result.lose) {
      // penalty: lose 30% gold, half hp, return to r_rest
      G.lingshi = Math.floor(G.lingshi * 0.7);
      G.hp = Math.max(10, Math.floor(G._maxHp * 0.5));
      G.mp = Math.max(0, Math.floor(G._maxMp * 0.5));
      log('你败下阵来。', 'system');
    }
    State.recompute();
    const enemyId = active.enemyId;
    const res = result;
    active = null;
    _busy = false;
    U.bus.emit('combat:end', { result: res, enemyId });
    if (onEndCb) {
      const cb = onEndCb; onEndCb = null; cb(res, enemyId);
    }
  }

  function isActive() { return !!active; }
  function getActive() { return active; }

  global.Combat = {
    start, isActive, getActive,
    playerAttack, playerSkill, playerDefend, playerItem, playerFlee,
    get busy() { return _busy; },
  };
})(window);
