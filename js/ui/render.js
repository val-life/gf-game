// 主渲染。負責頂部狀態列 + 中間日誌 + 底部行動選單
import { state } from '../core/state.js';
import { clearLog, log } from './log.js';
import { RARITY_COLOR } from '../data/talents.js';
import { resolveChoice, advanceYear } from '../systems/life.js';
import { startAwakening, generateTalentDraft, applyTalent, confirmReincarnation } from '../systems/reincarnation.js';
import { doTrain, doWork, doStudy, doRest, doAdventure, doNextYear, TRAINABLE_STATS } from '../systems/town.js';
import { openShop, buyItem, useConsumable, closeShopAction } from '../systems/shop.js';
import { playerAttack, fleeCombat, startCombat } from '../systems/combat.js';
import { adventureStep, retreatAdventure, startAdventure } from '../systems/adventure.js';
import { onCombatEndReturnToAdventure } from '../systems/adventure.js';
import { resetRun } from '../core/state.js';
import { state as gstate, resetRun as doReset } from '../core/state.js';
import { resetSave, META_SHOP, buyMeta, loadMeta, applyMetaBonuses } from '../systems/meta.js';
import { ENEMIES } from '../data/enemies.js';

let statusEl, actionsEl;

export function initUI(sEl, aEl) {
  statusEl = sEl;
  actionsEl = aEl;
}

export function render() {
  renderStatus();
  renderActions();
}

function renderStatus() {
  if (!statusEl) return;
  const p = state.player;
  if (!p) {
    statusEl.innerHTML = '<div class="title">異世輪迴錄</div>';
    return;
  }
  const equip = p.equipment ?? {};
  const equipStr = (slot) => equip[slot]?.name ?? '<span class="muted">無</span>';
  const talentStr = (p.talents ?? []).map(t =>
    `<span class="talent-chip" style="color:${RARITY_COLOR[t.rarity]}">${t.name}</span>`
  ).join(' ') || '<span class="muted">無</span>';

  statusEl.innerHTML = `
    <div class="status-card">
      <div class="row"><span class="label">年齡</span><b data-stat="age">${p.age}/${p.ageMax}</b></div>
      <div class="row"><span class="label">HP</span><b data-stat="hp">${p.hp}/${p.hpMax}</b></div>
      <div class="hpbar"><div class="hpfill" style="width:${(p.hp / p.hpMax) * 100}%"></div></div>
      <div class="row"><span class="label">AP</span><b>${state.ap}/${state.apMax + (p.apBonus ?? 0)}</b></div>
      <div class="row gold"><span class="label">金幣</span><b data-stat="gold">${p.gold}</b></div>
    </div>
    <div class="status-card">
      <div class="stats-grid">
        <div><span class="muted">力量</span><br><b data-stat="str">${p.str}</b></div>
        <div><span class="muted">敏捷</span><br><b data-stat="agi">${p.agi}</b></div>
        <div><span class="muted">智力</span><br><b data-stat="int">${p.int}</b></div>
        <div><span class="muted">體質</span><br><b data-stat="vit">${p.vit}</b></div>
        <div><span class="muted">幸運</span><br><b data-stat="lck">${p.lck}</b></div>
      </div>
    </div>
    <div class="status-card">
      <div class="row"><span class="label">武器</span><span>${equipStr('weapon')}</span></div>
      <div class="row"><span class="label">防具</span><span>${equipStr('armor')}</span></div>
      <div class="row"><span class="label">飾品</span><span>${equipStr('accessory')}</span></div>
    </div>
    <div class="status-card">
      <div class="row"><span class="label">天賦</span></div>
      <div>${talentStr}</div>
    </div>
    <div class="status-card meta">
      <div>業火：<b>${state.meta.karma}</b></div>
      <div class="muted">轉生 ${state.meta.totalRuns} 次 | 最年 ${state.meta.bestAge}</div>
    </div>
  `;
}

function renderActions() {
  if (!actionsEl) return;
  let html = '';
  switch (state.phase) {
    case 'title': html = titlePanel(); break;
    case 'awakening': html = awakeningPanel(); break;
    case 'town': html = townPanel(); break;
    case 'story': html = storyPanel(); break;
    case 'shop': html = shopPanel(); break;
    case 'combat': html = combatPanel(); break;
    case 'adventure': html = adventurePanel(); break;
    case 'gameover': html = gameoverPanel(); break;
    case 'meta': html = metaPanel(); break;
    default: html = '';
  }
  actionsEl.innerHTML = html;
  bindActions();
}

function titlePanel() {
  return `
    <h2>異世輪迴錄</h2>
    <p class="muted">轉生異世界。隨機出身、隨機事件、無盡輪迴。</p>
    <button class="btn primary" data-act="start">開始輪迴</button>
    <button class="btn" data-act="meta">業火商店</button>
    <button class="btn danger" data-act="reset">重置存檔</button>
  `;
}

function awakeningPanel() {
  const draft = state.currentDraft ?? [];
  const cards = draft.map((t, i) => `
    <div class="talent-card" data-talent="${t.id}" style="border-color:${RARITY_COLOR[t.rarity]}">
      <div class="t-name" style="color:${RARITY_COLOR[t.rarity]}">${t.name}</div>
      <div class="t-rarity">${t.rarity}</div>
      <div class="t-desc">${t.desc}</div>
      <button class="btn small" data-pick="${i}">選擇</button>
    </div>
  `).join('');
  return `
    <h2>天賦覺醒</h2>
    <p class="muted">你感受到靈魂深處的悸動。三道天賦之光浮現……</p>
    <div class="talent-grid">${cards}</div>
    <button class="btn" data-act="reroll">重新抽取</button>
  `;
}

function townPanel() {
  const p = state.player;
  return `
    <h2>城鎮 — ${p.age} 歲</h2>
    <p class="muted">這一年你還有 <b>${state.ap}</b> AP 可用。</p>
    <div class="action-grid">
      <button class="btn" data-act="train">訓練（1AP）</button>
      <button class="btn" data-act="work">勞作（1AP，金+）</button>
      <button class="btn" data-act="study">求學（1AP，智+）</button>
      <button class="btn" data-act="rest">休息（1AP，HP+）</button>
      <button class="btn" data-act="shop">商店（1AP）</button>
      <button class="btn" data-act="adventure">冒險（2AP）</button>
    </div>
    <div class="row mt">
      <button class="btn primary" data-act="nextYear" ${state.ap < state.apMax + (p.apBonus ?? 0) ? 'disabled' : ''}>進入下一年</button>
    </div>
    <div class="row mt">
      <button class="btn small" data-act="bag">背包</button>
    </div>
  `;
}

function storyPanel() {
  const ev = state.currentEvent;
  if (!ev) return '';
  const opts = ev.options.map((o, i) => {
    const p = state.player;
    const ok = !o.req || (p[o.req.stat] ?? 0) >= o.req.min;
    return `<button class="btn ${ok ? '' : 'disabled'}" ${ok ? '' : 'disabled'} data-choice="${i}">${o.text}${o.req ? `（需 ${o.req.stat.toUpperCase()} ${o.req.min}）` : ''}</button>`;
  }).join('');
  return `
    <div class="event-text">${ev.text}</div>
    <div class="action-grid">${opts}</div>
  `;
}

function shopPanel() {
  const items = state.currentShop ?? [];
  const list = items.map(it => `
    <div class="shop-item">
      <div><b>${it.name}</b> <span class="muted">${it.type}</span><br><span class="muted">${it.desc}</span></div>
      <button class="btn small" data-buy="${it.instanceId}">購買 ${it.price}G</button>
    </div>
  `).join('');
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
  return `
    <div class="combat-stage">
      <div class="combatant enemy">
        <div class="c-name">${e.name}</div>
        <div class="bar"><div class="barfill enemy-fill" style="width:${(e.currentHp / e.hp) * 100}%"></div></div>
        <div class="muted">HP ${e.currentHp}/${e.hp}</div>
      </div>
      <div class="vs">⚔</div>
      <div class="combatant player">
        <div class="c-name">${p.name}</div>
        <div class="bar"><div class="barfill player-fill" style="width:${(p.hp / p.hpMax) * 100}%"></div></div>
        <div class="muted">HP ${p.hp}/${p.hpMax}</div>
      </div>
    </div>
    <div class="action-grid mt">
      <button class="btn primary" data-act="attack">攻擊</button>
      ${e.isBoss ? '' : '<button class="btn" data-act="flee">逃跑</button>'}
    </div>
  `;
}

function adventurePanel() {
  const adv = state.adventure;
  if (!adv) return '';
  return `
    <h2>冒險中</h2>
    <p>當前步數：${adv.step} / ${adv.max}</p>
    <p>本次金幣：${adv.gold} | 戰利品：${adv.loot.length} 件</p>
    <div class="action-grid">
      <button class="btn primary" data-act="advStep">前進</button>
      <button class="btn" data-act="retreat">撤退</button>
    </div>
  `;
}

function gameoverPanel() {
  return `
    <h2>輪迴終結</h2>
    <p>你的靈魂化為業火，迴盪於虛空之中……</p>
    <p>本次業火：<b>${state.meta.karma}</b></p>
    <p class="muted">統計：年齡 ${state.player?.age ?? 0} | 金幣 ${state.player?.gold ?? 0} | 擊殺 ${state.player?.kills ?? 0} | BOSS ${state.player?.bossesKilled?.length ?? 0}</p>
    <button class="btn primary" data-act="reincarnate">再次轉生</button>
    <button class="btn" data-act="meta">業火商店</button>
  `;
}

function metaPanel() {
  const list = META_SHOP.map((m, i) => `
    <div class="shop-item">
      <div><b>${m.name}</b> <span class="muted">${m.cost} 業火</span><br><span class="muted">${m.desc}</span></div>
      <button class="btn small" data-buyMeta="${i}">購買</button>
    </div>
  `).join('');
  return `
    <h2>業火商店</h2>
    <p>持有業火：<b>${state.meta.karma}</b></p>
    <div>${list}</div>
    <button class="btn" data-act="back">返回</button>
  `;
}

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
        log('業火不足。', 'warn');
      }
    });
  });
  actionsEl.querySelectorAll('[data-talent]').forEach(() => { /* hover */ });
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
      state.phase = 'meta';
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
      state.currentDraft = generateTalentDraft(3);
      log('天賦重抽！', 'magic');
      render();
      break;
    case 'train': {
      // 簡易版：循環展示選擇
      const list = TRAINABLE_STATS.map((s, i) => `<button class="btn small" data-train="${s}">${s.toUpperCase()}</button>`).join('');
      const div = document.createElement('div');
      div.className = 'train-chooser';
      div.innerHTML = `<p>選擇訓練：</p>${list}`;
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
    case 'shop':
      if (state.ap < 1) { log('AP 不足！', 'warn'); render(); break; }
      state.ap -= 1;
      openShop();
      render();
      break;
    case 'adventure':
      startAdventure();
      render();
      break;
    case 'nextYear':
      doNextYear();
      render();
      break;
    case 'bag': {
      const p = state.player;
      const items = p.inventory.map(it =>
        `<div class="bag-item"><span>${it.name} <span class="muted">${it.desc ?? ''}</span></span>
         ${it.type === 'consumable' ? `<button class="btn small" data-use="${it.instanceId}">使用</button>` : ''}</div>`
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
      div.querySelector('[data-closeBag]').addEventListener('click', () => {
        div.remove();
      });
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
    case 'back':
      state.phase = state.player ? 'town' : 'title';
      render();
      break;
  }
}
