// 主渲染（v2：手機優先 + 六維 + 主線 + 歲數門檻）
import { state, PHASE, getAgeStage, isActionAllowed } from '../core/state.js';
import { clearLog, log } from './log.js';
import { RARITY_COLOR } from '../data/talents.js';
import { resolveChoice, resolveMainStoryChoice, triggerMainStory } from '../systems/life.js';
import { startAwakening, generateTalentDraft, applyTalent, confirmReincarnation, rerollTalentDraft } from '../systems/reincarnation.js';
import { doTrain, doWork, doStudy, doRest, doAdventure, doNextYear, doCry, doSleep, doPlay, doStudyBasic, doTavern, doSafeAdventure, TRAINABLE_STATS, listActions } from '../systems/town.js';
import { openShop, buyItem, useConsumable, closeShopAction } from '../systems/shop.js';
import { playerAttack, fleeCombat } from '../systems/combat.js';
import { adventureStep, retreatAdventure, startAdventure } from '../systems/adventure.js';
import { resetRun, setPhase } from '../core/state.js';
import { resetSave, META_SHOP, canBuyMeta, buyMeta, loadMeta, applyMetaBonuses } from '../systems/meta.js';
import { newPlayer } from '../core/state.js';
import { giveAchievement } from '../systems/achievements.js';

let statusEl, actionsEl, phaseTagEl;

export function initUI(sEl, aEl, pEl) {
  statusEl = sEl;
  actionsEl = aEl;
  phaseTagEl = pEl;
  // 狀態列摺疊
  statusEl.addEventListener('click', () => {
    statusEl.classList.toggle('collapsed');
  });
}

export function render() {
  renderStatus();
  renderActions();
  if (phaseTagEl) phaseTagEl.textContent = phaseLabel(state.phase);
}

function phaseLabel(p) {
  return ({
    title: '標題', awakening: '覺醒', town: '城鎮', story: '事件', main_story: '主線',
    shop: '商店', combat: '戰鬥', adventure: '冒險', gameover: '終結', reincarnate: '轉生', meta: '業火'
  })[p] ?? p;
}

function renderStatus() {
  if (!statusEl) return;
  const p = state.player;
  if (!p) {
    statusEl.innerHTML = '<div class="status-card"><div class="muted">尚未轉生</div></div>';
    return;
  }
  const equip = p.equipment ?? {};
  const equipLine = (slot) => equip[slot]?.name ?? '<span class="muted">無</span>';
  const talentChips = (p.talents ?? []).map(t =>
    `<span class="talent-chip" style="color:${RARITY_COLOR[t.rarity]}">${t.name}</span>`
  ).join('') || '<span class="muted">無</span>';

  statusEl.innerHTML = `
    <div class="status-card primary">
      <div class="row spread">
        <div><span class="muted">年齡</span> <b data-stat="age">${p.age}/${p.ageMax}</b></div>
        <div class="muted">${getAgeStage(p.age).name}</div>
      </div>
      <div class="hpbar"><div class="hpfill" style="width:${(p.hp / p.maxHp) * 100}%"></div></div>
      <div class="row spread small">
        <span><span class="muted">HP</span> <b data-stat="hp">${p.hp}/${p.maxHp}</b></span>
        <span><span class="muted">AP</span> <b>${state.ap}/${state.apMax}</b></span>
        <span><span class="muted">金</span> <b data-stat="gold" class="gold">${p.gold}</b></span>
      </div>
    </div>
    <div class="status-card">
      <div class="stat-grid6">
        <div class="stat-box" data-stat="str"><div class="lbl">力</div><div class="val">${p.str}</div></div>
        <div class="stat-box" data-stat="con"><div class="lbl">體</div><div class="val">${p.con}</div></div>
        <div class="stat-box" data-stat="dex"><div class="lbl">敏</div><div class="val">${p.dex}</div></div>
        <div class="stat-box" data-stat="int"><div class="lbl">智</div><div class="val">${p.int}</div></div>
        <div class="stat-box" data-stat="cha"><div class="lbl">魅</div><div class="val">${p.cha}</div></div>
        <div class="stat-box" data-stat="luk"><div class="lbl">運</div><div class="val">${p.luk}</div></div>
      </div>
    </div>
    <div class="status-card compact">
      <div class="row spread small">
        <span><span class="muted">攻</span> <b>${p.atk}</b></span>
        <span><span class="muted">防</span> <b>${p.def}</b></span>
        <span><span class="muted">速</span> <b>${p.spd.toFixed(1)}</b></span>
        <span><span class="muted">暴</span> <b>${p.critPct.toFixed(1)}%</b></span>
        <span><span class="muted">閃</span> <b>${p.dodgePct.toFixed(1)}%</b></span>
      </div>
      ${p.fireResist > 0 ? `<div class="muted small">🔥 抗火 ${(p.fireResist*100).toFixed(0)}%</div>` : ''}
    </div>
    <div class="status-card compact">
      <div class="muted small">裝備</div>
      <div class="row spread small"><span>武器</span><span>${equipLine('weapon')}</span></div>
      <div class="row spread small"><span>防具</span><span>${equipLine('armor')}</span></div>
      <div class="row spread small"><span>飾品</span><span>${equipLine('accessory')}</span></div>
    </div>
    <div class="status-card compact">
      <div class="muted small">天賦</div>
      <div>${talentChips}</div>
    </div>
    <div class="status-card compact meta">
      <div>業火 <b>${state.meta.karma}</b></div>
      <div class="muted small">轉生 ${state.meta.totalRuns} · 最年 ${state.meta.bestAge}</div>
    </div>
  `;
}

function renderActions() {
  if (!actionsEl) return;
  let html = '';
  switch (state.phase) {
    case PHASE.TITLE: html = titlePanel(); break;
    case PHASE.AWAKENING: html = awakeningPanel(); break;
    case PHASE.TOWN: html = townPanel(); break;
    case PHASE.STORY: html = storyPanel(); break;
    case PHASE.MAIN_STORY: html = mainStoryPanel(); break;
    case PHASE.SHOP: html = shopPanel(); break;
    case PHASE.COMBAT: html = combatPanel(); break;
    case PHASE.ADVENTURE: html = adventurePanel(); break;
    case PHASE.GAMEOVER: html = gameoverPanel(); break;
    case PHASE.META: html = metaPanel(); break;
  }
  actionsEl.innerHTML = html;
  bindActions();
}

// ============ 各 Phase 面板 ============

function titlePanel() {
  return `
    <h2>異世輪迴錄</h2>
    <p class="muted">轉生異世界。隨機出身、隨機事件、無盡輪迴。</p>
    <div class="action-stack">
      <button class="btn primary big" data-act="start">開始輪迴</button>
      <button class="btn big" data-act="meta">業火商店（${state.meta.karma}）</button>
      <button class="btn danger small" data-act="reset">重置存檔</button>
    </div>
  `;
}

function awakeningPanel() {
  const draft = state.currentDraft ?? [];
  const cards = draft.map((t, i) => `
    <div class="talent-card" style="border-color:${RARITY_COLOR[t.rarity]}">
      <div class="t-name" style="color:${RARITY_COLOR[t.rarity]}">${t.name}</div>
      <div class="t-rarity">${t.rarity.toUpperCase()}</div>
      <div class="t-desc">${t.desc}</div>
      <button class="btn primary" data-pick="${i}">選擇</button>
    </div>
  `).join('');
  return `
    <h2>天賦覺醒</h2>
    <p class="muted">三道天賦之光浮現……剩餘重抽 <b>${state.rerollsLeft}</b> 次</p>
    <div class="talent-grid">${cards}</div>
    <button class="btn" data-act="reroll" ${state.rerollsLeft <= 0 ? 'disabled' : ''}>重新抽取</button>
  `;
}

function townPanel() {
  const age = state.player.age;
  const actions = listActions();
  const actionBtns = actions.map(a => {
    const allowed = a.allowed;
    return `<button class="btn action-btn ${allowed ? '' : 'locked'}" data-act="${a.id}" ${!allowed ? 'disabled' : ''}>
      <span class="act-label">${a.label}</span>
      <span class="act-ap">${a.ap}AP</span>
    </button>`;
  }).join('');
  const ap = state.ap;
  const apMax = state.apMax;
  const canNext = ap >= apMax;
  return `
    <h2>城鎮 — ${age} 歲</h2>
    <p class="muted">AP <b>${ap}/${apMax}</b>${!canNext ? '（需耗盡才能進入下一年）' : ''}</p>
    <div class="action-grid-2">${actionBtns}</div>
    <div class="action-stack mt">
      <button class="btn primary big" data-act="nextYear" ${!canNext ? 'disabled' : ''}>進入下一年</button>
      <button class="btn small" data-act="bag">背包 / 技能</button>
    </div>
  `;
}

function storyPanel() {
  const ev = state.currentEvent;
  if (!ev) return '';
  const opts = ev.options.map((o, i) => {
    const ok = !o.req || checkReq(o.req, state.player);
    return `<button class="btn choice-btn ${ok ? '' : 'locked'}" ${ok ? '' : 'disabled'} data-choice="${i}">
      <span class="opt-text">${o.text}</span>
      ${o.req ? `<span class="opt-req">需 ${o.req.stat.toUpperCase()} ${o.req.min}</span>` : ''}
    </button>`;
  }).join('');
  return `
    <div class="event-text">${ev.text}</div>
    <div class="action-stack">${opts}</div>
  `;
}

function mainStoryPanel() {
  const ms = state.currentMainStory;
  if (!ms) return '';
  const opts = ms.options.map((o, i) => {
    const ok = checkOptReq(o, state.player);
    return `<button class="btn story-choice ${ok ? '' : 'locked'}" ${ok ? '' : 'disabled'} data-mschoice="${i}">
      <div class="opt-text">${o.text}</div>
      <div class="opt-req">${describeReq(o, state.player)}</div>
    </button>`;
  }).join('');
  return `
    <div class="story-banner">━━ 主線節點 ━━</div>
    <h2>${ms.title}</h2>
    <div class="event-text epic">${ms.text}</div>
    <div class="action-stack">${opts}</div>
  `;
}

function shopPanel() {
  const items = state.currentShop ?? [];
  const list = items.map(it => {
    let price = it.price ?? 0;
    price = Math.floor(price * (1 - (state.player.shopDiscount ?? 0)));
    return `
    <div class="shop-item">
      <div class="shop-info">
        <b>${it.name}</b>
        <div class="muted small">${it.desc ?? ''}</div>
      </div>
      <button class="btn small" data-buy="${it.instanceId}">${price}G</button>
    </div>`;
  }).join('');
  return `
    <h2>商店</h2>
    <div>${list || '<p class="muted">今日已無存貨。</p>'}</div>
    <button class="btn" data-act="closeShop">離開商店</button>
  `;
}

function combatPanel() {
  const e = state.currentEnemy;
  const p = state.player;
  if (!e) return '';
  const ePct = (e.currentHp / e.hp) * 100;
  const pPct = (p.hp / p.maxHp) * 100;
  return `
    <div class="combat-stage">
      <div class="combatant enemy">
        <div class="c-name">${e.name}</div>
        <div class="bar"><div class="barfill enemy-fill" style="width:${ePct}%"></div></div>
        <div class="muted small">HP ${e.currentHp}/${e.hp} · 回合 ${e.turn ?? 0}</div>
      </div>
      <div class="vs">⚔</div>
      <div class="combatant player">
        <div class="c-name">${p.name}</div>
        <div class="bar"><div class="barfill player-fill" style="width:${pPct}%"></div></div>
        <div class="muted small">HP ${p.hp}/${p.maxHp}</div>
      </div>
    </div>
    ${e.ability ? `<div class="ability-hint">⚠ 能力：${abilityName(e.ability)}</div>` : ''}
    <div class="action-grid-2 mt">
      <button class="btn primary big" data-act="attack">攻擊</button>
      ${e.isBoss ? '<button class="btn big" disabled>不可逃跑</button>' : '<button class="btn big" data-act="flee">逃跑</button>'}
    </div>
  `;
}

function abilityName(ab) {
  const map = {
    vampire: '吸血', poison: '附加中毒', burn_reflection: '火焰反射', heavy_smash: '重擊',
    execute: '處決', aoe_curse: '詛咒領域', enrage: '狂暴', fireball: '火球術', stun: '眩暈', none: '—'
  };
  return map[ab.effect] ?? ab.effect;
}

function adventurePanel() {
  const adv = state.adventure;
  if (!adv) return '';
  return `
    <h2>冒險中</h2>
    <div class="row spread">
      <span>步數 <b>${adv.step}/${adv.max}</b></span>
      <span>金幣 <b>${adv.gold}</b></span>
      <span>戰利品 <b>${adv.loot.length}</b></span>
    </div>
    <div class="action-grid-2 mt">
      <button class="btn primary big" data-act="advStep">前進</button>
      <button class="btn big" data-act="retreat">撤退</button>
    </div>
  `;
}

function gameoverPanel() {
  const p = state.player;
  return `
    <h2>輪迴終結</h2>
    <p class="epic-text">你的靈魂化為業火，迴盪於虛空之中……</p>
    <div class="status-card">
      <div class="row spread"><span>本次業火</span><b>${state.meta.karma}</b></div>
      <div class="row spread"><span>年齡</span><b>${p?.age ?? 0}</b></div>
      <div class="row spread"><span>金幣</span><b>${p?.gold ?? 0}</b></div>
      <div class="row spread"><span>擊殺</span><b>${p?.kills ?? 0}</b></div>
      <div class="row spread"><span>Boss</span><b>${p?.bossesKilled?.length ?? 0}</b></div>
      <div class="row spread"><span>成就</span><b>${p?.achievements?.length ?? 0}</b></div>
    </div>
    <div class="action-stack mt">
      <button class="btn primary big" data-act="reincarnate">再次轉生</button>
      <button class="btn big" data-act="meta">業火商店</button>
      <button class="btn small" data-act="backTitle">回到標題</button>
    </div>
  `;
}

function metaPanel() {
  const list = META_SHOP.map((m, idx) => {
    const can = canBuyMeta(m);
    const owned = m.applyTier ? (state.meta.metaShopTiers?.[m.applyTier] ?? 0) : 0;
    const tierLabel = m.tier ? `階 ${['I','II','III'][m.tier-1]}` : '';
    return `
    <div class="shop-item ${can ? '' : 'dim'}">
      <div class="shop-info">
        <b>${m.name} ${tierLabel}</b>
        <div class="muted small">${m.desc}</div>
        ${m.requires ? `<div class="muted small">前置：${META_SHOP.find(x=>x.id===m.requires)?.name}</div>` : ''}
      </div>
      <button class="btn small" data-buyMeta="${idx}" ${can ? '' : 'disabled'}>${m.cost} 🔥</button>
    </div>`;
  }).join('');
  return `
    <h2>業火商店</h2>
    <p class="muted">持有業火：<b>${state.meta.karma}</b></p>
    <div>${list}</div>
    <button class="btn mt" data-act="back">返回</button>
  `;
}

// ============ 判定工具 ============
function checkReq(r, p) {
  if (r.stat === 'gold') return p.gold >= r.min;
  if (r.stat === 'hp') return p.hp >= r.min;
  if (r.stat === 'item') return p.inventory.some(x => x.id === r.min);
  return (p[r.stat] ?? 0) >= r.min;
}

function checkOptReq(o, p) {
  if (o.req) return checkReq(o.req, p);
  if (o.reqAny) return o.reqAny.some(r => checkReq(r, p));
  return true;
}

function describeReq(o, p) {
  if (o.req) {
    const r = o.req;
    if (r.stat === 'gold') return `需要 ${r.min} 金幣（持有 ${p.gold}）`;
    if (r.stat === 'hp') return `需要 HP ${r.min}（當前 ${p.hp}）`;
    if (r.stat === 'item') return `需要裝備/持有：${r.min}`;
    if (r.stat === 'fatherAff') return `需要父親好感 ${r.min}（當前 ${p.fatherAff ?? 0}）`;
    if (r.stat === 'fireResist') return `需要火抗 ${(r.min*100).toFixed(0)}%`;
    if (r.stat === 'party') return `需要夥伴 ≥ ${r.min} 人（達標 ${Object.entries(p.affinity ?? {}).filter(([k,v]) => v >= (p.npcData?.[k]?.affAt ?? 999)).length}）`;
    return `需要 ${r.stat.toUpperCase()} ${r.min}（當前 ${p[r.stat] ?? 0}）`;
  }
  if (o.reqAny) {
    return o.reqAny.map(r => `${r.stat.toUpperCase()} ${r.min}`).join(' 或 ');
  }
  return '無要求';
}

// ============ 事件綁定 ============
function bindActions() {
  actionsEl.querySelectorAll('[data-act]').forEach(btn => {
    btn.addEventListener('click', () => handleAct(btn.dataset.act));
  });
  actionsEl.querySelectorAll('[data-pick]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.pick);
      const t = state.currentDraft[idx];
      if (t) {
        applyTalent(t);
        log(`你獲得了天賦【${t.name}】！`, 'epic');
        state.currentDraft = null;
        confirmReincarnation();
        log(`轉生開始！你降臨於異世界……`, 'epic');
        render();
      }
    });
  });
  actionsEl.querySelectorAll('[data-choice]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.choice);
      const opt = state.currentEvent?.options[idx];
      if (opt) {
        resolveChoice(opt);
        render();
      }
    });
  });
  actionsEl.querySelectorAll('[data-mschoice]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.mschoice);
      const opt = state.currentMainStory?.options[idx];
      if (opt) {
        resolveMainStoryChoice(opt);
        render();
      }
    });
  });
  actionsEl.querySelectorAll('[data-buy]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.buy;
      const it = state.currentShop?.find(x => x.instanceId === id);
      if (it) {
        buyItem(it);
        render();
      }
    });
  });
  actionsEl.querySelectorAll('[data-buyMeta]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.buyMeta);
      const m = META_SHOP[idx];
      if (m && buyMeta(m)) {
        log(`業火商店：獲得【${m.name}】！`, 'epic');
        render();
      } else {
        log('業火不足或前置未達成。', 'warn');
      }
    });
  });
}

function handleAct(act) {
  switch (act) {
    case 'start':
      resetRun();
      applyMetaBonuses(state.player);
      startAwakening();
      clearLog();
      log('命運之輪轉動……你即將轉生。', 'epic');
      render();
      break;
    case 'meta':
      state.phase = PHASE.META;
      render();
      break;
    case 'reset':
      if (confirm('確定重置所有存檔？此操作無法復原。')) {
        resetSave();
        log('存檔已重置。', 'warn');
        render();
      }
      break;
    case 'reroll':
      state.currentDraft = rerollTalentDraft(3);
      render();
      break;
    case 'cry': doCry(); render(); break;
    case 'sleep': doSleep(); render(); break;
    case 'play': doPlay(); render(); break;
    case 'study_basic': doStudyBasic(); render(); break;
    case 'train': {
      const list = TRAINABLE_STATS.map(s => `<button class="btn small" data-train="${s}">${statLabel(s)}</button>`).join('');
      const div = document.createElement('div');
      div.className = 'train-chooser';
      div.innerHTML = `<p class="muted small">選擇訓練屬性：</p><div class="action-grid-3">${list}</div>`;
      actionsEl.appendChild(div);
      div.querySelectorAll('[data-train]').forEach(b => {
        b.addEventListener('click', () => {
          doTrain(b.dataset.train);
          div.remove();
          render();
        });
      });
      break;
    }
    case 'work': doWork(); render(); break;
    case 'study': doStudy(); render(); break;
    case 'rest': doRest(); render(); break;
    case 'tavern': doTavern(); render(); break;
    case 'shop': state.ap -= 1; if (state.ap < 0) { state.ap = 0; log('AP 不足', 'warn'); render(); break; } openShop(); render(); break;
    case 'adventure_safe': doSafeAdventure(); render(); break;
    case 'adventure': doAdventure(); render(); break;
    case 'nextYear': doNextYear(); render(); break;
    case 'bag': {
      const p = state.player;
      const items = p.inventory.map(it =>
        `<div class="bag-item"><span>${it.name} <span class="muted small">${it.desc ?? ''}</span></span>
         ${it.type === 'consumable' ? `<button class="btn small" data-use="${it.instanceId}">使用</button>` : '<span class="muted small">持有</span>'}</div>`
      ).join('');
      const div = document.createElement('div');
      div.className = 'bag-panel';
      div.innerHTML = `<h3>背包</h3>${items || '<p class="muted">空無一物</p>'}<button class="btn small" data-closeBag>關閉</button>`;
      actionsEl.appendChild(div);
      div.querySelectorAll('[data-use]').forEach(b => {
        b.addEventListener('click', () => {
          const it = p.inventory.find(x => x.instanceId === b.dataset.use);
          if (it) {
            useConsumable(it);
            render();
          }
        });
      });
      div.querySelector('[data-closeBag]').addEventListener('click', () => div.remove());
      break;
    }
    case 'attack': playerAttack(); render(); break;
    case 'flee': fleeCombat(); render(); break;
    case 'advStep': adventureStep(); render(); break;
    case 'retreat': retreatAdventure(); render(); break;
    case 'closeShop': closeShopAction(); render(); break;
    case 'reincarnate':
      resetRun();
      applyMetaBonuses(state.player);
      startAwakening();
      clearLog();
      log('業火燃盡，新的輪迴開啟……', 'epic');
      render();
      break;
    case 'backTitle':
      state.phase = PHASE.TITLE;
      render();
      break;
    case 'back':
      state.phase = state.player ? PHASE.TOWN : PHASE.TITLE;
      render();
      break;
  }
}

function statLabel(s) {
  return ({ str: '力量', con: '體質', dex: '靈巧', int: '智力', cha: '魅力', luk: '幸運' })[s] ?? s;
}
