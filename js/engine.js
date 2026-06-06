/* =============================================================
   engine.js — central controller. Scene flow, choice dispatch,
   event wiring, keyboard nav.
   ============================================================= */
(function (global) {
  'use strict';

  let _inCombat = false;

  /* -------- helpers -------- */
  function go(sceneId) {
    G.currentScene = sceneId;
    State.recompute();
    UI.renderSidebar();
    if (sceneId === '__load')   { UI.openLoad();  G.currentScene = 'title'; return; }
    if (sceneId === '__achievements') { UI.openAchievements(); G.currentScene = 'title'; return; }
    if (sceneId === '__settings') { UI.openSettings(); G.currentScene = 'title'; return; }
    if (sceneId === 'char_create') { UI.openCharCreate(); return; }

    const scene = SCENES[sceneId];
    if (!scene) {
      console.error('Scene not found:', sceneId);
      document.getElementById('sceneTitle').textContent = '未知场景';
      document.getElementById('sceneText').textContent = '场景 "' + sceneId + '" 未定义。';
      return;
    }
    applyOnEnter(scene);
    UI.renderScene(scene);
    UI.renderSidebar();
    if (scene.combat) {
      // start combat on next tick so scene renders first
      setTimeout(() => startCombatFromScene(scene), 50);
    }
    // autosave
    if (Save.getSettings().autosave) {
      Save.saveSlot('autosave');
    }
  }

  function applyOnEnter(scene) {
    const oe = scene.onEnter;
    if (!oe) return;
    if (oe.rollSpirit) G.spiritRoot = UI_rollSpiritRoot();
    if (oe.finalizeChar) {
      G.realmId = G.realmId || 'mortal';
      G.lifespan = 80;
      G.hp = G._maxHp;
      G.mp = G._maxMp;
    }
    if (typeof oe.hp === 'number') G.hp = Math.min(G._maxHp, G.hp + oe.hp);
    if (oe.hp === 'full') G.hp = G._maxHp;
    if (typeof oe.mp === 'number') G.mp = Math.min(G._maxMp, G.mp + oe.mp);
    if (oe.mp === 'full') G.mp = G._maxMp;
    if (typeof oe.cultivation === 'number') State.addCultivation(oe.cultivation);
    if (typeof oe.exp === 'number') G.exp += oe.exp;
    if (typeof oe.lingshi === 'number') G.lingshi += oe.lingshi;
    if (typeof oe.age === 'number') G.age += oe.age;
    // items
    if (oe.item) {
      if (typeof oe.item === 'string') State.addItem(oe.item, 1);
      else if (typeof oe.item === 'object') {
        for (const k in oe.item) State.addItem(k, oe.item[k]);
      }
    }
    if (oe.give) {
      // explicit give: { id: qty } or single id
      if (typeof oe.give === 'string') State.addItem(oe.give, 1);
      else for (const k in oe.give) State.addItem(k, oe.give[k]);
    }
    if (oe.learn) {
      State.learnSkill(oe.learn);
    }
    if (oe.equip) {
      // auto-equip
      State.equip(oe.equip);
    }
    if (oe.message) U.toast(oe.message);
    if (oe.achievement) State.grantAchievement(oe.achievement);
    if (oe.ending) {
      State.grantEnding(oe.ending);
      Save.saveAchievements();
    }
    if (oe.set) {
      for (const k in oe.set) G.flags[k] = oe.set[k];
    }
    if (oe.break) {
      // try breakthrough to next realm
      tryBreakthrough(oe.break);
    }
    if (oe.end) {
      // not used here
    }
    State.recompute();
  }

  function tryBreakthrough(targetRealm) {
    const cur = REALM_BY_ID[G.realmId];
    const tgt = REALM_BY_ID[targetRealm];
    if (!tgt) return;
    if (tgt.index <= cur.index) {
      // layer advance within realm
      if (G.realmId === targetRealm && G.cultivation >= State.currentExpNeeded()) {
        G.cultivation = 0;
        G.layer++;
        G.lifespan += 5;
        U.toast('突破至 ' + realmDisplay(G) + '！');
      }
      return;
    }
    // need at least 9 layer in current realm (for non-tiered)
    if (G.realmId === 'lianqi' && G.layer < 8) {
      U.toast('练气九层圆满方可尝试筑基。');
      return;
    }
    if (G.realmId === 'mortal') {
      // not possible
      return;
    }
    // success check
    const base = tgt.realm.breakthroughBase;
    let chance = base + G.stats.wuxing * 0.05 + G.stats.qiyun * 0.03;
    if (G.flags._bt_pill) { chance += G.flags._bt_pill; G.flags._bt_pill = 0; }
    if (G.spiritRoot === 'immortal') chance += 0.3;
    else if (G.spiritRoot === 'variant' || G.spiritRoot === 'upper') chance += 0.15;
    if (U.R.chance(U.clamp(chance, 0, 0.95))) {
      // success
      G.realmId = targetRealm;
      G.layer = 0;
      G.cultivation = 0;
      G.lifespan = tgt.realm.lifespan;
      State.recompute();
      G.hp = G._maxHp; G.mp = G._maxMp;
      U.toast('破境成功！' + tgt.realm.name + '境！');
    } else {
      // fail: lose half cultivation, hp, attempt flag
      G.cultivation = Math.floor(G.cultivation * 0.5);
      G.hp = Math.floor(G.hp * 0.7);
      U.toast('破境失败，修为大损。');
    }
  }

  /* -------- choice handling -------- */
  function pickChoice(scene, idx) {
    const choice = scene.choices[idx];
    if (!choice) return;
    if (choice.requires && !State.checkRequires(choice.requires)) {
      U.toast('条件未满足。'); return;
    }
    // apply choice-level side effects
    if (choice.set) for (const k in choice.set) G.flags[k] = choice.set[k];
    if (choice.give) {
      if (typeof choice.give === 'string') State.addItem(choice.give, 1);
      else for (const k in choice.give) State.addItem(k, choice.give[k]);
    }
    if (choice.take) {
      if (typeof choice.take === 'string') State.removeItem(choice.take, 1);
      else for (const k in choice.take) State.removeItem(k, choice.take[k]);
    }
    if (choice.learn) State.learnSkill(choice.learn);
    if (choice.cultivation) State.addCultivation(choice.cultivation);
    if (choice.hp) G.hp = Math.min(G._maxHp, G.hp + choice.hp);
    if (choice.mp) G.mp = Math.min(G._maxMp, G.mp + choice.mp);
    if (choice.combat) {
      // start combat, then go to next
      _pendingNext = choice.next;
      startCombat(choice.combat, { onEnd: (res) => {
        if (res.win && _pendingNext) {
          const nxt = _pendingNext;
          _pendingNext = null;
          go(nxt);
        } else if (!res.win) {
          // penalty then go to rest
          _pendingNext = null;
          go('r_rest');
        }
      }});
      return;
    }
    if (choice.break) {
      tryBreakthrough(choice.break);
    }
    if (choice.next) {
      go(choice.next);
    }
  }
  let _pendingNext = null;

  function startCombat(enemyId, opts) {
    _inCombat = true;
    UI.showCombat();
    UI.renderCombat();
    Combat.start(enemyId, opts || {});
  }

  function startCombatFromScene(scene) {
    const enemyId = scene.combat;
    if (!ENEMIES[enemyId]) return;
    // determine next scene
    const placeholders = ['__combat_' + enemyId];
    const placeholder = SCENES[placeholders[0]];
    const winNext = (placeholder && placeholder.winNext) || (scene && scene.winNext) || G.currentScene;
    const loseNext = (placeholder && placeholder.loseNext) || (scene && scene.loseNext) || 'r_rest';
    const cur = G.currentScene;
    startCombat(enemyId, {
      onEnd: (res) => {
        _inCombat = false;
        UI.hideCombat();
        if (res.win) go(winNext);
        else if (res.lose) go(loseNext);
        else if (res.fled) go(cur);
        // res was  routed through UI scene
      }
    });
  }

  /* -------- bootstrap -------- */
  function boot() {
    Save.loadAchievements();
    UI.applySettings();
    setupTopbar();
    setupKeyboard();
    setupBus();

    // restore autosave if exists
    if (Save.hasSlot('autosave') && G.name) {
      Save.loadSlot('autosave');
    }
    State.recompute();
    UI.renderSidebar();
    go('title');
  }

  function setupTopbar() {
    document.body.addEventListener('click', (e) => {
      const a = e.target.closest('[data-action]');
      if (!a) return;
      const act = a.dataset.action;
      switch (act) {
        case 'open-inventory':   UI.openInventory(); break;
        case 'open-skills':      UI.openSkills(); break;
        case 'open-save':        UI.openSave(); break;
        case 'open-load':        UI.openLoad(); break;
        case 'open-achievements':UI.openAchievements(); break;
        case 'open-settings':    UI.openSettings(); break;
        case 'close-modal':      UI.closeModal(); break;
      }
    });
  }

  function setupKeyboard() {
    document.addEventListener('keydown', (e) => {
      // 1-9 for choices (only when not in modal/combat)
      if (_inCombat) {
        const k = e.key.toLowerCase();
        if (k === 'a') { e.preventDefault(); Combat.playerAttack(); return; }
        if (k === 'd') { e.preventDefault(); Combat.playerDefend(); return; }
        if (k === 'f') { e.preventDefault(); Combat.playerFlee();   return; }
        if (k === 'k' || k === 's') { UI.openSkills(); return; }
        if (k === 'i') { UI.openItemMenu(); return; }
        return;
      }
      // 1-9 for choices
      if (/^[1-9]$/.test(e.key)) {
        const choices = document.querySelectorAll('#choices .choice');
        const i = parseInt(e.key, 10) - 1;
        if (choices[i]) { choices[i].click(); e.preventDefault(); }
        return;
      }
      const k = e.key.toLowerCase();
      if (k === 'i') { UI.openInventory(); e.preventDefault(); }
      else if (k === 'k') { UI.openSkills(); e.preventDefault(); }
      else if (k === 's') { UI.openSave(); e.preventDefault(); }
      else if (k === 'l') { UI.openLoad(); e.preventDefault(); }
      else if (k === 'a') { UI.openAchievements(); e.preventDefault(); }
      else if (k === 'escape') { UI.closeModal(); e.preventDefault(); }
    });
  }

  function setupBus() {
    U.bus.on('combat:turn', () => UI.renderCombat());
    U.bus.on('combat:log',  () => UI.renderCombat());
    U.bus.on('combat:hit',  (p) => {
      const el = document.getElementById(p.side === 'enemy' ? 'enemyPortrait' : 'playerPortrait');
      if (el) {
        el.classList.add('shake', 'hit');
        setTimeout(() => el.classList.remove('shake', 'hit'), 350);
      }
    });
    U.bus.on('combat:end', () => {
      UI.renderCombat();
      // give the player a beat to read the log, then hide overlay
    });
  }

  global.Engine = { go, pickChoice, startCombat, boot };
  document.addEventListener('DOMContentLoaded', boot);
})(window);
