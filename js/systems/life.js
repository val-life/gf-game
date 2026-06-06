// 套用事件效果
import { state } from '../core/state.js';
import { applyStats, runHook } from '../core/hooks.js';
import { ITEMS } from '../data/items.js';
import { pickRandomEvent, EVENTS } from '../data/events.js';
import { addKarma } from './meta.js';
import { log } from '../ui/log.js';
import { triggerBossAt } from './combat.js';

export function applyEffects(effects) {
  const p = state.player;
  const logs = [];
  for (const eff of effects ?? []) {
    switch (eff.type) {
      case 'stat': {
        const k = `base${eff.stat.charAt(0).toUpperCase()}${eff.stat.slice(1)}`;
        p[k] = (p[k] ?? 0) + eff.value;
        applyStats(p);
        logs.push(`${eff.stat.toUpperCase()} ${eff.value > 0 ? '+' : ''}${eff.value}`);
        break;
      }
      case 'gold': {
        p.gold = Math.max(0, p.gold + eff.value);
        logs.push(`金幣 ${eff.value > 0 ? '+' : ''}${eff.value}`);
        break;
      }
      case 'hp': {
        p.hp = Math.max(0, Math.min(p.hpMax, p.hp + eff.value));
        logs.push(`HP ${eff.value > 0 ? '+' : ''}${eff.value}`);
        break;
      }
      case 'ap': {
        state.ap = Math.max(0, state.ap + eff.value);
        break;
      }
      case 'item': {
        const it = ITEMS[eff.item];
        if (it) {
          p.inventory.push({ id: eff.item, ...it, instanceId: crypto.randomUUID() });
          logs.push(`獲得【${it.name}】`);
        }
        break;
      }
      case 'flag': {
        p.flags[eff.key] = eff.value;
        break;
      }
      case 'npcAff': {
        p.affinity[eff.npc] = (p.affinity[eff.npc] ?? 0) + eff.value;
        const npc = p.npcData?.[eff.npc];
        if (npc) logs.push(`【${npc.name}】好感 ${eff.value > 0 ? '+' : ''}${eff.value}`);
        break;
      }
      case 'talent': {
        // 不直接給，未來可從轉生池開
        break;
      }
      case 'log': {
        logs.push(eff.text);
        break;
      }
      case 'ageMax': {
        p.ageMax += eff.value;
        logs.push(`壽命上限 ${eff.value > 0 ? '+' : ''}${eff.value}`);
        break;
      }
    }
  }
  return logs;
}

export function resolveChoice(option) {
  // 判定需求
  if (option.req) {
    const p = state.player;
    if ((p[option.req.stat] ?? 0) < option.req.min) {
      log(`判定失敗（${option.req.stat.toUpperCase()} 不足 ${option.req.min}）！`, 'warn');
      // 失敗僅顯示文字，給予失敗懲罰：尋找 outcome.failed，否則無
      const failEffects = option.fail?.effects ?? [];
      const failText = option.fail?.text ?? '你失敗了。';
      log(failText, 'fail');
      applyEffects(failEffects);
    } else {
      log(`判定成功（${option.req.stat.toUpperCase()} ≥ ${option.req.min}）！`, 'good');
      log(option.outcome.text, 'good');
      applyEffects(option.outcome.effects);
    }
  } else {
    log(option.outcome.text, 'good');
    applyEffects(option.outcome.effects);
  }
  // 結束事件
  state.currentEvent = null;
  state.phase = 'town';
  state.bus = null;
  // 死亡判定
  if (state.player.hp <= 0) {
    return triggerGameOver('事件中身亡');
  }
  return { phase: 'town' };
}

export function triggerRandomEvent() {
  const ev = pickRandomEvent(state.player, EVENTS);
  if (!ev) {
    log('風平浪靜的一年。', 'neutral');
    state.phase = 'town';
    return null;
  }
  state.currentEvent = ev;
  state.phase = 'story';
  return ev;
}

export function advanceYear() {
  const p = state.player;
  p.age += 1;
  // 歲數試煉
  const boss = triggerBossAt(p.age);
  if (boss) return { phase: 'boss' };
  // 被動觸發
  const hookLogs = runHook('onYearEnd', p);
  // 歲數到上限
  if (p.age >= p.ageMax) {
    log('你壽終正寢，回歸輪迴……', 'epic');
    return triggerGameOver('壽終正寢');
  }
  // 隨機事件
  hookLogs.forEach(l => log(l, 'magic'));
  triggerRandomEvent();
  return { phase: state.phase };
}

export function triggerGameOver(reason) {
  state.phase = 'gameover';
  // karma = age * 10 + gold * 0.5 + kills * 20 + bosses * 100
  const p = state.player;
  const karma = Math.floor(p.age * 10 + p.gold * 0.5 + p.kills * 20 + p.bossesKilled.length * 100);
  addKarma(karma);
  if (p.age > state.meta.bestAge) state.meta.bestAge = p.age;
  if (p.gold > state.meta.bestGold) state.meta.bestGold = p.gold;
  log(`【死亡】${reason}。獲得 ${karma} 業火。`, 'epic');
  return { phase: 'gameover', karma };
}
