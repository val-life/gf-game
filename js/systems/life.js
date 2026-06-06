// 事件效果套用 + 主線觸發 + 死亡結算
import { state, PHASE } from '../core/state.js';
import { applyStats, runHook } from '../core/hooks.js';
import { ITEMS } from '../data/items.js';
import { pickRandomEvent, EVENTS } from '../data/events.js';
import { addKarma, saveMeta } from './meta.js';
import { log } from '../ui/log.js';
import { triggerBossAt, startCombat } from './combat.js';
import { getMainStoryForAge } from '../data/mainStory.js';
import { giveAchievement, countAchievements } from './achievements.js';

export function applyEffects(effects) {
  const p = state.player;
  const logs = [];
  for (const eff of effects ?? []) {
    switch (eff.type) {
      case 'stat': {
        const key = eff.stat;
        if (key === 'maxHp') {
          // 永久改變 HP 上限
          p.hpMax += eff.value;
          if (p.hp > p.hpMax) p.hp = p.hpMax;
        } else if (key === 'spd') {
          p.spd = Math.max(0, p.spd + eff.value);
        } else if (key === 'atk' || key === 'def' || key === 'critPct' || key === 'dodgePct') {
          p[key] = (p[key] ?? 0) + eff.value;
        } else {
          // 六維 base
          const baseKey = `base${key.charAt(0).toUpperCase()}${key.slice(1)}`;
          p[baseKey] = (p[baseKey] ?? 0) + eff.value;
          applyStats(p);
        }
        logs.push(`${key} ${eff.value > 0 ? '+' : ''}${eff.value}`);
        break;
      }
      case 'gold': {
        p.gold = Math.max(0, p.gold + eff.value);
        logs.push(`金幣 ${eff.value > 0 ? '+' : ''}${eff.value}`);
        break;
      }
      case 'gold_clear': {
        p.gold = 0;
        logs.push('金幣被洗劫一空！');
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
          p.inventory.push({ id: eff.item, ...it, instanceId: 'item-' + Math.random().toString(36).slice(2) });
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
      case 'fatherAff': {
        p.fatherAff = (p.fatherAff ?? 0) + eff.value;
        logs.push(`父親好感 ${eff.value > 0 ? '+' : ''}${eff.value}`);
        break;
      }
      case 'achievement': {
        giveAchievement(eff.value);
        break;
      }
      case 'log': {
        logs.push(eff.text);
        break;
      }
      case 'ageMax': {
        p.ageMax += eff.value;
        break;
      }
      case 'death': {
        triggerGameOver(eff.value);
        return logs;
      }
    }
  }
  return logs;
}

// 判定 option 成功/失敗並套用效果
function checkReq(option, p) {
  if (option.req) {
    const r = option.req;
    if (r.stat === 'gold') return p.gold >= r.min;
    if (r.stat === 'hp') return p.hp >= r.min;
    if (r.stat === 'fatherAff') return (p.fatherAff ?? 0) >= r.min;
    if (r.stat === 'item') return p.inventory.some(x => x.id === r.min) || p.equipment?.weapon?.id === r.min || p.equipment?.armor?.id === r.min || p.equipment?.accessory?.id === r.min;
    if (r.stat === 'party') return Object.entries(p.affinity ?? {}).filter(([k, v]) => v >= (p.npcData?.[k]?.affAt ?? 999)).length >= r.min;
    if (r.stat === 'fireResist') return (p.fireResist ?? 0) >= r.min;
    return (p[r.stat] ?? 0) >= r.min;
  }
  if (option.reqAny) {
    return option.reqAny.some(r => {
      if (r.stat === 'gold') return p.gold >= r.min;
      if (r.stat === 'hp') return p.hp >= r.min;
      return (p[r.stat] ?? 0) >= r.min;
    });
  }
  return true;
}

export function resolveChoice(option) {
  const p = state.player;
  const ok = checkReq(option, p);
  const out = ok ? option.success : option.fail;
  if (ok) {
    log(`判定成功！${out.text}`, 'good');
  } else {
    log(`判定失敗……${out.text}`, 'bad');
  }
  applyEffects(out.effects);
  state.currentEvent = null;
  state.phase = PHASE.TOWN;
  if (state.player.hp <= 0) {
    return triggerGameOver('事件中身亡');
  }
  return { phase: PHASE.TOWN };
}

export function resolveMainStoryChoice(option) {
  const p = state.player;
  const ok = checkReq(option, p);
  const out = ok ? option.success : option.fail;
  if (ok) {
    log(`✔ 通過考驗：${out.text}`, 'epic');
  } else {
    log(`✘ 未能通過：${out.text}`, 'bad');
  }
  applyEffects(out.effects);
  if (state.phase === PHASE.GAMEOVER) return; // death effect already handled
  p.mainStoryPassed = p.mainStoryPassed ?? [];
  p.mainStoryPassed.push({ age: p.age, ok });
  state.meta.mainStoryProgress[p.age] = ok ? 'passed' : 'failed';
  state.currentMainStory = null;
  state.phase = PHASE.TOWN;
}

export function triggerMainStory(age) {
  const ms = getMainStoryForAge(age);
  if (!ms) return null;
  if (ms.type === 'awakening') {
    // 0 歲覺醒
    return null;
  }
  state.currentMainStory = ms;
  state.phase = PHASE.MAIN_STORY;
  log(`━━ 主線節點 ━━ ${ms.title}（${age} 歲）`, 'epic');
  return ms;
}

export function triggerRandomEvent() {
  const ev = pickRandomEvent(state.player, EVENTS);
  if (!ev) {
    log('風平浪靜的一年。', 'neutral');
    state.phase = PHASE.TOWN;
    return null;
  }
  state.currentEvent = ev;
  state.phase = PHASE.STORY;
  return ev;
}

export function advanceYear() {
  const p = state.player;
  p.age += 1;
  log(`━━━ ${p.age} 歲 ━━━`, 'epic');

  // 主線觸發優先
  const ms = triggerMainStory(p.age);
  if (ms) return { phase: PHASE.MAIN_STORY };
  // 歲數試煉 boss（若主線已通過）
  const boss = triggerBossAt(p.age);
  if (boss) return { phase: PHASE.COMBAT };

  // 被動觸發（每年恢復 + 幸運收入）
  const hookLogs = runHook('onYearEnd', p);
  if (p.luk > 0) {
    const extra = Math.floor(p.luk * 2);
    p.gold += extra;
    log(`【家境】年度零用錢 +${extra} 金幣。`, 'good');
  }
  hookLogs.forEach(l => log(l, 'magic'));

  // 自然老化（年齡大於 60 開始衰退）
  if (p.age > 60) {
    const decay = Math.floor((p.age - 60) / 5);
    p.baseCon = Math.max(1, p.baseCon - decay);
    applyStats(p);
    log(`歲月不饒人，體質 -${decay}。`, 'warn');
  }

  // 壽命到上限
  if (p.age >= p.ageMax) {
    log('你壽終正寢，回歸輪迴……', 'epic');
    return triggerGameOver('壽終正寢');
  }

  // 隨機事件
  triggerRandomEvent();
  return { phase: state.phase };
}

export function triggerGameOver(reason) {
  state.phase = PHASE.GAMEOVER;
  const p = state.player;
  // 業火公式：年齡×15 + 金/10 + Boss×300 + 成就×500
  const achCount = countAchievements(p);
  const karma = Math.floor(p.age * 15 + p.gold / 10 + p.bossesKilled.length * 300 + achCount * 500);
  addKarma(karma);
  if (p.age > state.meta.bestAge) state.meta.bestAge = p.age;
  if (p.gold > state.meta.bestGold) state.meta.bestGold = p.gold;
  if (karma > state.meta.bestKarma) state.meta.bestKarma = karma;
  log(`【死亡】${reason}。獲得 ${karma} 業火。`, 'epic');
  // 檢查結局
  if (p.mainStoryPassed?.some(m => m.age === 40 && m.ok)) {
    state.ending = 'true_ending';
  }
  saveMeta();
  return { phase: PHASE.GAMEOVER, karma };
}
