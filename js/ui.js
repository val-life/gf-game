/* =============================================================
   ui.js — rendering, modals, typewriter, status bars
   Exposed on window.UI
   ============================================================= */
(function (global) {
  'use strict';

  const $ = U.$, el = U.el, on = U.on, toast = U.toast;

  /* ============================================================
     SIDEBAR — render character status
     ============================================================ */
  function renderSidebar() {
    if (!G.name) {
      // No character yet
      $('#charName').textContent = '— —';
      $('#charSub').textContent = '游魂';
    } else {
      $('#charName').textContent = G.name;
      $('#charSub').textContent = (G.gender === 'female' ? '女' : '男') + ' · ' + ageDisplay();
    }
    $('#realmVal').textContent = realmDisplay(G);
    const lbl = (G.realmId === 'mortal') ? '·零层' : '·' + (G.layer + 1) + '层';
    $('#layerVal').textContent = lbl;
    // cultivation bar
    if (G.realmId === 'mortal') {
      const need = 80;
      const pct = U.clamp(100 * G.cultivation / need, 0, 100);
      $('#cultFill').style.width = pct + '%';
      $('#cultText').textContent = '修为 ' + G.cultivation + '/' + need;
    } else {
      const need = State.currentExpNeeded();
      const pct = U.clamp(100 * G.cultivation / need, 0, 100);
      $('#cultFill').style.width = pct + '%';
      $('#cultText').textContent = '修为 ' + G.cultivation + '/' + need;
    }
    // hp/mp/age
    const maxHp = G._maxHp || 1, maxMp = G._maxMp || 1;
    $('#hpFill').style.width = U.pct(G.hp, maxHp) + '%';
    $('#hpText').textContent = G.hp + '/' + maxHp;
    $('#mpFill').style.width = U.pct(G.mp, maxMp) + '%';
    $('#mpText').textContent = G.mp + '/' + maxMp;
    $('#ageFill').style.width = U.pct(G.age, G.lifespan) + '%';
    $('#ageText').textContent = Math.floor(G.age) + '/' + G.lifespan + ' 岁';
    // stats
    $('#statGengu').textContent = G.stats.gengu;
    $('#statWuxing').textContent = G.stats.wuxing;
    $('#statQiyun').textContent = G.stats.qiyun;
    $('#statMeili').textContent = G.stats.meili;
    // derived
    $('#dAtk').textContent = G._atk;
    $('#dDef').textContent = G._def;
    $('#dMag').textContent = G._mag;
    $('#dSpd').textContent = G._spd;
    $('#dCrit').textContent = Math.round(G._crit) + '%';
    $('#lingshi').textContent = G.lingshi;
    // spirit root
    $('#spiritRoot').textContent = spiritRootDisplay(G.spiritRoot);
    // equipment
    const e = G.equipment;
    const wpn = e.weapon   ? (ITEMS[e.weapon]   || {}).name   : '—';
    const arm = e.armor    ? (ITEMS[e.armor]    || {}).name   : '—';
    const acc = e.accessory? (ITEMS[e.accessory]|| {}).name   : '—';
    const man = e.manual   ? (ITEMS[e.manual]   || {}).name   : '—';
    $('#equipLine').textContent = '武：' + wpn + ' · 甲：' + arm + ' · 饰：' + acc + ' · 法：' + man;
    // status
    renderStatusBox($('#statusBox'), G.status);
  }

  function ageDisplay() {
    return Math.floor(G.age) + '岁';
  }

  function spiritRootDisplay(sr) {
    if (!sr) return '—';
    return SPIRIT_ROOT_META[sr] ? SPIRIT_ROOT_META[sr].name : sr;
  }

  // simple static spirit root metadata (mirrored in state engine)
  const SPIRIT_ROOT_META = {
    trash:        { name: '凡躯',    tier: 0 },
    lower_fire:   { name: '下品火灵根',  tier: 1 },
    lower_water:  { name: '下品水灵根',  tier: 1 },
    lower_wood:   { name: '下品木灵根',  tier: 1 },
    lower_metal:  { name: '下品金灵根',  tier: 1 },
    lower_earth:  { name: '下品土灵根',  tier: 1 },
    mid_fire:     { name: '中品火灵根',  tier: 2 },
    mid_water:    { name: '中品水灵根',  tier: 2 },
    mid_wood:     { name: '中品木灵根',  tier: 2 },
    mid_metal:    { name: '中品金灵根',  tier: 2 },
    mid_earth:    { name: '中品土灵根',  tier: 2 },
    upper:        { name: '上品灵根',    tier: 3 },
    variant:      { name: '变异灵根',    tier: 3 },
    immortal:     { name: '天灵根',      tier: 4 },
  };

  function renderStatusBox(box, statusList) {
    if (!box) return;
    box.innerHTML = '';
    (statusList || []).forEach(s => {
      const def = STATUS[s.id];
      if (!def) return;
      const chip = el('span', { class: 'status-chip ' + (def.kind === 'hot' || def.kind === 'shield' ? 'buff' : (def.kind === 'dot' || def.kind === 'skip' || def.kind === 'mult' ? 'debuff' : '')) });
      chip.textContent = def.name + ' ' + s.dur;
      box.appendChild(chip);
    });
  }

  /* ============================================================
     NARRATIVE PANEL
     ============================================================ */
  function renderScene(scene, opts) {
    opts = opts || {};
    const title = $('#sceneTitle');
    const text  = $('#sceneText');
    const choices = $('#choices');
    const foot = $('#sceneFoot');
    title.textContent = scene.title || '— —';
    text.innerHTML = '';
    choices.innerHTML = '';
    foot.innerHTML = '';

    // Typewriter
    const lines = scene.text || [];
    const speed = Save.getSettings().textSpeed || 0;
    let lineIdx = 0;
    function nextLine() {
      if (lineIdx >= lines.length) {
        renderChoices(scene);
        if (scene.hint) {
          foot.textContent = scene.hint;
        }
        return;
      }
      const p = el('p', { text: lines[lineIdx] });
      text.appendChild(p);
      lineIdx++;
      if (speed > 0) {
        setTimeout(nextLine, speed * 6);
      } else {
        nextLine();
      }
    }
    nextLine();
  }

  function renderChoices(scene) {
    const choices = $('#choices');
    choices.innerHTML = '';
    let n = 0;
    (scene.choices || []).forEach((c, i) => {
      n++;
      const locked = c.requires && !State.checkRequires(c.requires);
      const btn = el('button', {
        class: 'choice' + (locked ? ' locked' : ''),
        type: 'button',
        'data-key': n,
        'data-idx': i,
      });
      const keyHint = el('span', { class: 'key-hint', text: n <= 9 ? '[' + n + ']' : '' });
      const text = el('span', { class: 'grow', text: c.text });
      btn.appendChild(text);
      if (keyHint) btn.appendChild(keyHint);
      if (locked) {
        const req = el('div', { class: 'req', text: '（未满足条件）' });
        btn.appendChild(req);
      }
      btn.addEventListener('click', () => {
        if (locked) { toast('条件未满足。'); return; }
        Engine.pickChoice(scene, i);
      });
      choices.appendChild(btn);
    });
  }

  /* ============================================================
     MODAL
     ============================================================ */
  function openModal(title, body, footer) {
    $('#modalTitle').textContent = title;
    const bodyEl = $('#modalBody'); bodyEl.innerHTML = '';
    if (typeof body === 'string') bodyEl.innerHTML = body;
    else if (body && typeof body === 'object' && typeof body.appendChild === 'function') bodyEl.appendChild(body);
    const footEl = $('#modalFoot'); footEl.innerHTML = '';
    (footer || []).forEach(b => footEl.appendChild(b));
    $('#modalRoot').classList.remove('hidden');
    document.body.classList.add('modal-open');
  }
  function closeModal() {
    $('#modalRoot').classList.add('hidden');
    document.body.classList.remove('modal-open');
  }
  function modalRoot() { return $('#modalRoot'); }

  /* ============================================================
     COMBAT RENDER
     ============================================================ */
  function showCombat() {
    $('#combat').classList.remove('hidden');
    document.body.classList.add('combat-open');
  }
  function hideCombat() {
    $('#combat').classList.add('hidden');
    document.body.classList.remove('combat-open');
  }

  function renderCombat() {
    const c = Combat.getActive();
    if (!c) return;
    // player
    $('#playerName').textContent = c.player.name;
    $('#playerInfo').textContent = 'Lv ' + c.player.level + ' · 气运 ' + Math.round(c.player.crit) + '%';
    $('#pHpFill').style.width = U.pct(c.player.hp, c.player.maxHp) + '%';
    $('#pHpText').textContent = c.player.hp + '/' + c.player.maxHp;
    $('#pMpFill').style.width = U.pct(c.player.mp, c.player.maxMp) + '%';
    $('#pMpText').textContent = c.player.mp + '/' + c.player.maxMp;
    renderStatusBox($('#pStatus'), c.player.status);
    $('#playerPortrait').textContent = c.player.portrait;

    // enemy
    $('#enemyName').textContent = c.enemy.name;
    $('#enemyInfo').textContent = 'Lv ' + c.enemy.level + (c.enemy.boss ? ' · 首领' : '');
    $('#eHpFill').style.width = U.pct(c.enemy.hp, c.enemy.maxHp) + '%';
    $('#eHpText').textContent = c.enemy.hp + '/' + c.enemy.maxHp;
    $('#eMpFill').style.width = U.pct(c.enemy.mp, c.enemy.maxMp) + '%';
    $('#eMpText').textContent = c.enemy.mp + '/' + c.enemy.maxMp;
    renderStatusBox($('#eStatus'), c.enemy.status);
    $('#enemyPortrait').textContent = c.enemy.portrait;

    // log
    const logEl = $('#combatLog');
    logEl.innerHTML = '';
    c.log.forEach((entry, idx) => {
      const line = el('div', { class: 'log-line ' + entry.kind });
      line.innerHTML = entry.msg;
      logEl.appendChild(line);
    });
    logEl.scrollTop = logEl.scrollHeight;

    // actions
    renderCombatActions(c);
  }

  function renderCombatActions(c) {
    const box = $('#combatActions');
    box.innerHTML = '';
    const disabled = (c.awaiting !== 'player' || Combat._busy);
    // Attack (Strike)
    box.appendChild(makeCbtn('攻击', c, () => Combat.playerAttack(), disabled, 'A', 'attack'));
    // Defend
    box.appendChild(makeCbtn('防御', c, () => Combat.playerDefend(), disabled, 'D', 'defend'));
    // Flee
    box.appendChild(makeCbtn('逃跑', c, () => Combat.playerFlee(), disabled || (c.enemy.boss || c.enemy.noFlee), 'F', 'flee'));
    // Skills submenu (toggleable)
    box.appendChild(makeCbtn('法术', c, () => openSkillMenu(), false, 'K', 'skill'));
    // Items
    box.appendChild(makeCbtn('物品', c, () => openItemMenu(), false, 'I', 'item'));
  }

  function makeCbtn(label, c, fn, disabled, key, cls) {
    const b = el('button', { class: 'btn ' + (cls || ''), type: 'button' });
    b.appendChild(document.createTextNode(label));
    if (key) b.appendChild(el('span', { class: 'key-hint', text: '[' + key + ']' }));
    b.disabled = !!disabled;
    b.addEventListener('click', fn);
    return b;
  }

  function openSkillMenu() {
    const c = Combat.getActive();
    if (!c) return;
    const list = el('div', { class: 'col' });
    c.player.skills.forEach(sid => {
      const sk = SKILLS[sid];
      if (!sk) return;
      const cd = c.player.cooldowns[sid] || 0;
      const manaOK = !sk.cost || c.player.mp >= sk.cost;
      const b = el('button', { class: 'btn skill', type: 'button' });
      b.innerHTML = '<b>' + sk.name + '</b> <span class="muted">' + (sk.desc || '') + '</span>'
        + (sk.cost ? ' · 灵力 ' + sk.cost : '')
        + (cd ? ' · 冷却 ' + cd : '');
      b.disabled = cd > 0 || !manaOK;
      b.addEventListener('click', () => {
        Combat.playerSkill(sid);
        closeModal();
      });
      list.appendChild(b);
    });
    if (!c.player.skills.length) list.appendChild(el('div', { class: 'muted', text: '（无可用技能）' }));
    openModal('法术', list, [
      makeCloseBtn('关闭'),
    ]);
  }

  function openItemMenu() {
    const c = Combat.getActive();
    if (!c) return;
    const list = el('div', { class: 'col' });
    const ids = Object.keys(G.inventory);
    let any = false;
    ids.forEach(iid => {
      const it = ITEMS[iid];
      if (!it || it.type !== 'consumable') return;
      any = true;
      const qty = G.inventory[iid];
      const b = el('button', { class: 'btn', type: 'button' });
      b.innerHTML = '<b>' + it.name + '</b> ×' + qty + ' <span class="muted">' + (it.desc || '') + '</span>';
      b.addEventListener('click', () => {
        Combat.playerItem(iid);
        closeModal();
      });
      list.appendChild(b);
    });
    if (!any) list.appendChild(el('div', { class: 'muted', text: '（无消耗品）' }));
    openModal('物品', list, [ makeCloseBtn('关闭') ]);
  }

  function makeCloseBtn(label) {
    const b = el('button', { class: 'btn', type: 'button', text: label || '关闭' });
    b.addEventListener('click', closeModal);
    return b;
  }

  /* ============================================================
     OUT-OF-COMBAT MENUS
     ============================================================ */
  function openInventory() {
    const wrap = el('div', { class: 'col' });
    const tabs = el('div', { class: 'row' });
    const view = el('div', { class: 'col', style: 'margin-top:12px' });
    const tabsDef = [
      { id:'all',     label:'全部' },
      { id:'weapon',  label:'武器' },
      { id:'armor',   label:'护甲' },
      { id:'accessory', label:'饰品' },
      { id:'consumable', label:'丹药' },
      { id:'manual',  label:'功法' },
      { id:'material',label:'材料' },
      { id:'quest',   label:'任务' },
    ];
    let curTab = 'all';
    function rerender() {
      view.innerHTML = '';
      const ids = Object.keys(G.inventory);
      let any = false;
      ids.forEach(iid => {
        const it = ITEMS[iid];
        if (!it) return;
        if (curTab !== 'all' && it.type !== curTab) return;
        any = true;
        const qty = G.inventory[iid];
        const row = el('div', { class: 'row' });
        const info = el('div', { class: 'grow col' });
        info.appendChild(el('div', { html: '<b>' + it.name + '</b> ×' + qty + (it.req ? ' <span class="muted">（需' + realmDisplayById(it.req.realm) + (it.req.layer ? ' ' + (it.req.layer+1) + '层' : '') + '）</span>' : '') }));
        info.appendChild(el('div', { class: 'muted', text: it.desc }));
        if (it.stats) {
          const stats = Object.keys(it.stats).filter(k => it.stats[k]).map(k => k + ' +' + it.stats[k]).join(' ');
          if (stats) info.appendChild(el('div', { class: 'muted', text: stats }));
        }
        row.appendChild(info);
        // actions
        if (it.type === 'consumable') {
          const use = el('button', { class: 'btn', type: 'button', text: '使用' });
          use.addEventListener('click', () => {
            useConsumable(iid);
            closeModal();
          });
          row.appendChild(use);
        } else if (it.type === 'manual') {
          const learn = el('button', { class: 'btn', type: 'button', text: '研读' });
          learn.addEventListener('click', () => {
            learnManual(iid);
            closeModal();
          });
          row.appendChild(learn);
        } else if (canEquipSlot(it.type)) {
          const eq = el('button', { class: 'btn primary', type: 'button', text: '装备' });
          eq.addEventListener('click', () => {
            if (State.equip(iid)) {
              State.recompute();
              toast('已装备 ' + it.name);
              closeModal();
              openInventory();
            } else {
              toast('无法装备：境界不足。');
            }
          });
          row.appendChild(eq);
        }
        view.appendChild(row);
        view.appendChild(el('hr'));
      });
      if (!any) view.appendChild(el('div', { class: 'muted', text: '（此分类下没有物品）' }));
    }
    tabsDef.forEach(t => {
      const b = el('button', { class: 'btn', type: 'button', text: t.label });
      b.addEventListener('click', () => { curTab = t.id; rerender(); });
      tabs.appendChild(b);
    });
    wrap.appendChild(tabs);
    wrap.appendChild(view);
    rerender();
    openModal('背　囊', wrap, [ makeCloseBtn('关闭') ]);
  }
  function canEquipSlot(type) { return type === 'weapon' || type === 'armor' || type === 'accessory' || type === 'manual'; }
  function realmDisplayById(id) { return (REALM_BY_ID[id] || {}).realm ? REALM_BY_ID[id].realm.name : id; }

  function useConsumable(iid) {
    const it = ITEMS[iid];
    if (!it) return;
    if (!State.hasItem(iid)) return;
    State.removeItem(iid, 1);
    const eff = it.effect;
    if (eff.kind === 'heal_hp_pct') {
      G.hp = Math.min(G._maxHp, G.hp + Math.round(G._maxHp * eff.pct));
      toast('恢复气血。');
    } else if (eff.kind === 'heal_mp_pct') {
      G.mp = Math.min(G._maxMp, G.mp + Math.round(G._maxMp * eff.pct));
      toast('恢复灵力。');
    } else if (eff.kind === 'cultivation') {
      State.addCultivation(eff.amount);
      toast('修为 +' + eff.amount);
    } else if (eff.kind === 'cure') {
      G.status = G.status.filter(s => s.id !== eff.status);
      toast('已清除异常。');
    } else if (eff.kind === 'age') {
      G.age = Math.max(0, G.age + eff.amount);
      toast('寿元变化。');
    } else if (eff.kind === 'breakthrough_pill') {
      G.flags._bt_pill = (G.flags._bt_pill || 0) + eff.bonus;
      toast('服用破境丹，下一次突破成功率大增。');
    } else if (eff.kind === 'qiyun') {
      G.flags._qiyun_temp = (G.flags._qiyun_temp || 0) + eff.amount;
      G.flags._qiyun_temp_dur = eff.dur || 3;
      toast('气运临时提升。');
    } else if (eff.kind === 'wuxing') {
      G.flags._wuxing_temp = (G.flags._wuxing_temp || 0) + eff.amount;
      G.flags._wuxing_temp_dur = eff.dur || 5;
      toast('悟性临时提升。');
    }
    State.recompute();
  }

  function learnManual(iid) {
    const it = ITEMS[iid];
    if (!it || it.type !== 'manual') return;
    if (!canEquip(G, it)) { toast('境界不足，无法研读。'); return; }
    let learned = '';
    if (it.learn) {
      if (State.learnSkill(it.learn)) learned = SKILLS[it.learn].name;
    }
    if (it.manualTeaches) {
      it.manualTeaches.forEach(s => { if (State.learnSkill(s)) learned += (learned ? '、' : '') + SKILLS[s].name; });
    }
    if (learned) {
      State.removeItem(iid, 1);
      toast('习得' + learned);
    } else {
      toast('你已通晓此功法。');
    }
  }

  function openSkills() {
    const wrap = el('div', { class: 'col' });
    if (!G.skills.length) wrap.appendChild(el('div', { class: 'muted', text: '（无）' }));
    G.skills.forEach(sid => {
      const sk = SKILLS[sid];
      if (!sk) return;
      const r = el('div', { class: 'col' });
      r.appendChild(el('div', { html: '<b>' + sk.name + '</b> · ' + sk.type + ' · 灵力 ' + sk.cost + ' · 冷却 ' + sk.cd }));
      r.appendChild(el('div', { class: 'muted', text: sk.desc }));
      wrap.appendChild(r);
      wrap.appendChild(el('hr'));
    });
    openModal('功　法', wrap, [ makeCloseBtn('关闭') ]);
  }

  function openSave() {
    const wrap = el('div', { class: 'col' });
    const slots = ['autosave', 'slot1', 'slot2', 'slot3'];
    slots.forEach(s => {
      const row = el('div', { class: 'row' });
      row.appendChild(el('div', { class: 'grow', text: s + (Save.hasSlot(s) ? ' （已有存档）' : ' （空）') }));
      const save = el('button', { class: 'btn primary', type: 'button', text: '保存' });
      save.addEventListener('click', () => {
        if (Save.saveSlot(s)) { toast('已存至 ' + s); closeModal(); }
      });
      const exp = el('button', { class: 'btn', type: 'button', text: '导出' });
      exp.addEventListener('click', () => {
        if (Save.saveSlot(s)) {
          const raw = Save.exportSlot(s);
          promptSaveText(raw, s);
        } else {
          toast('请先保存到该槽位。');
        }
      });
      row.appendChild(save);
      row.appendChild(exp);
      wrap.appendChild(row);
    });
    openModal('存　档', wrap, [ makeCloseBtn('关闭') ]);
  }

  function promptSaveText(text, slot) {
    const wrap = el('div', { class: 'col' });
    wrap.appendChild(el('div', { class: 'muted', text: '将以下内容复制保存：' }));
    const ta = el('textarea', { rows: 8, style: 'width:100%;font-family:var(--mono);font-size:12px' });
    ta.value = text;
    wrap.appendChild(ta);
    const copy = el('button', { class: 'btn primary', type: 'button', text: '复制到剪贴板' });
    copy.addEventListener('click', () => {
      try {
        navigator.clipboard.writeText(text).then(
          () => toast('已复制。'),
          () => { ta.select(); document.execCommand('copy'); toast('已复制。'); }
        );
      } catch (e) {
        ta.select(); document.execCommand('copy'); toast('已复制。');
      }
    });
    openModal('导出 ' + slot, wrap, [ copy, makeCloseBtn('关闭') ]);
  }

  function openLoad() {
    const wrap = el('div', { class: 'col' });
    const slots = Save.listSlots();
    if (!slots.length) {
      wrap.appendChild(el('div', { class: 'muted', text: '（无存档）' }));
    }
    slots.forEach(s => {
      const row = el('div', { class: 'row' });
      row.appendChild(el('div', { class: 'grow', text: s }));
      const load = el('button', { class: 'btn primary', type: 'button', text: '读档' });
      load.addEventListener('click', () => {
        if (Save.loadSlot(s)) {
          closeModal();
          Engine.goto(G.currentScene || 'title');
        }
      });
      const imp = el('button', { class: 'btn', type: 'button', text: '导入' });
      imp.addEventListener('click', () => {
        const ta = el('textarea', { rows: 4, style: 'width:100%' });
        const wrap2 = el('div', { class: 'col' });
        wrap2.appendChild(ta);
        const ok = el('button', { class: 'btn primary', type: 'button', text: '导入到 ' + s });
        ok.addEventListener('click', () => {
          if (Save.importSlot(s, ta.value)) {
            toast('已导入。'); closeModal();
          } else toast('导入失败：内容无效。');
        });
        openModal('导入 ' + s, wrap2, [ ok, makeCloseBtn('取消') ]);
      });
      const del = el('button', { class: 'btn danger', type: 'button', text: '删除' });
      del.addEventListener('click', () => {
        if (confirm('确认删除存档 ' + s + '？')) {
          Save.deleteSlot(s); closeModal(); openLoad();
        }
      });
      row.appendChild(load);
      row.appendChild(imp);
      row.appendChild(del);
      wrap.appendChild(row);
    });
    openModal('读　档', wrap, [ makeCloseBtn('关闭') ]);
  }

  function openAchievements() {
    const wrap = el('div', { class: 'col' });
    const achs = State.listAchievements();
    const unl = State.listUnlocked();
    achs.forEach(a => {
      const got = unl.indexOf(a.id) !== -1;
      const r = el('div', { class: 'col', style: 'opacity:' + (got ? 1 : 0.35) });
      r.appendChild(el('div', { html: '<b>' + (got ? '◆ ' : '◇ ') + a.name + '</b>' }));
      r.appendChild(el('div', { class: 'muted', text: a.desc }));
      wrap.appendChild(r);
      wrap.appendChild(el('hr'));
    });
    const ends = State.listEndings();
    wrap.appendChild(el('h3', { text: '结局' }));
    if (!ends.length) wrap.appendChild(el('div', { class: 'muted', text: '（尚未解锁任何结局）' }));
    ends.forEach(e => {
      wrap.appendChild(el('div', { html: '◆ <b>' + e + '</b>' }));
    });
    openModal('录', wrap, [ makeCloseBtn('关闭') ]);
  }

  function openSettings() {
    const wrap = el('div', { class: 'col' });
    const s = Save.getSettings();
    // text speed
    wrap.appendChild(el('div', { html: '<b>文字速度</b>' }));
    const speedSel = el('select');
    [[0, '瞬时'], [8, '快'], [18, '中'], [40, '慢']].forEach(([v, l]) => {
      const o = el('option', { value: v, text: l });
      if (s.textSpeed === v) o.selected = true;
      speedSel.appendChild(o);
    });
    speedSel.addEventListener('change', () => {
      Save.setSetting('textSpeed', parseInt(speedSel.value, 10));
    });
    wrap.appendChild(speedSel);
    // font scale
    wrap.appendChild(el('div', { html: '<b>字号</b>' }));
    const fontSel = el('select');
    [[0.9, '小'], [1.0, '中'], [1.15, '大'], [1.3, '特大']].forEach(([v, l]) => {
      const o = el('option', { value: v, text: l });
      if (Math.abs(s.fontScale - v) < 0.01) o.selected = true;
      fontSel.appendChild(o);
    });
    fontSel.addEventListener('change', () => {
      Save.setSetting('fontScale', parseFloat(fontSel.value));
      applySettings();
    });
    wrap.appendChild(fontSel);
    // reset
    wrap.appendChild(el('div', { html: '<b>危险操作</b>' }));
    const resetAll = el('button', { class: 'btn danger', type: 'button', text: '清空所有存档与成就' });
    resetAll.addEventListener('click', () => {
      if (confirm('确认清空所有本地数据？此操作不可撤销。')) {
        Save.wipeAll();
        State.resetState();
        ACH.unlocked = {}; ACH.endings = {};
        Save.saveAchievements();
        closeModal();
        Engine.goto('title');
      }
    });
    wrap.appendChild(resetAll);
    openModal('设　置', wrap, [ makeCloseBtn('关闭') ]);
  }

  function applySettings() {
    const s = Save.getSettings();
    document.documentElement.style.fontSize = (17 * s.fontScale) + 'px';
  }

  /* ============================================================
     CHARACTER CREATION OVERLAY
     ============================================================ */
  function openCharCreate() {
    // Step 1: name + gender + stats + spirit root
    const wrap = el('div', { class: 'col' });
    // name
    const nameField = el('div', { class: 'field' });
    nameField.appendChild(el('label', { text: '姓名' }));
    const nameInput = el('input', { type: 'text', value: G.name || '', maxlength: 8 });
    nameField.appendChild(nameInput);
    wrap.appendChild(nameField);
    // gender
    const genderField = el('div', { class: 'field' });
    genderField.appendChild(el('label', { text: '性别' }));
    const genderSel = el('select');
    [['male', '男'], ['female', '女']].forEach(([v, l]) => {
      const o = el('option', { value: v, text: l });
      if (G.gender === v) o.selected = true;
      genderSel.appendChild(o);
    });
    genderField.appendChild(genderSel);
    wrap.appendChild(genderField);

    // spirit root preview
    const srField = el('div', { class: 'field' });
    srField.appendChild(el('label', { text: '灵根（掷）' }));
    const srRow = el('div', { class: 'row' });
    const srText = el('div', { class: 'grow', text: spiritRootDisplay(G.spiritRoot) });
    const srReroll = el('button', { class: 'btn', type: 'button', text: '重掷' });
    srReroll.addEventListener('click', () => {
      G.spiritRoot = rollSpiritRoot();
      srText.textContent = spiritRootDisplay(G.spiritRoot);
    });
    srRow.appendChild(srText);
    srRow.appendChild(srReroll);
    srField.appendChild(srRow);
    wrap.appendChild(srField);

    // stats distribution
    wrap.appendChild(el('div', { html: '<b>命格（四维合计 20，剩 4 点自由分配）</b>' }));
    const statNames = [
      ['gengu',  '根骨', '影响气血与物理攻击'],
      ['wuxing', '悟性', '影响灵力与法术威力'],
      ['qiyun',  '气运', '影响暴击、奇遇、突破'],
      ['meili',  '魅力', '影响对话、商店、阵营'],
    ];
    const base = { gengu: 5, wuxing: 5, qiyun: 5, meili: 5 };
    const pts = { gengu: 0, wuxing: 0, qiyun: 0, meili: 0 };
    let remaining = 4;
    const remText = el('div', { class: 'muted', text: '剩余点数：' + remaining });
    wrap.appendChild(remText);
    statNames.forEach(([k, name, desc]) => {
      const row = el('div', { class: 'row' });
      row.appendChild(el('div', { class: 'grow col' }, [
        el('div', { html: '<b>' + name + '</b> ' + base[k] + ' + <span data-bonus>' + pts[k] + '</span>' }),
        el('div', { class: 'muted', text: desc }),
      ]));
      const minus = el('button', { class: 'btn', type: 'button', text: '-' });
      const plus = el('button', { class: 'btn', type: 'button', text: '+' });
      const bonusSpan = row.querySelector('[data-bonus]');
      minus.addEventListener('click', () => {
        if (pts[k] > 0) { pts[k]--; remaining++; bonusSpan.textContent = pts[k]; remText.textContent = '剩余点数：' + remaining; }
      });
      plus.addEventListener('click', () => {
        if (remaining > 0) { pts[k]++; remaining--; bonusSpan.textContent = pts[k]; remText.textContent = '剩余点数：' + remaining; }
      });
      row.appendChild(minus);
      row.appendChild(plus);
      wrap.appendChild(row);
    });

    // confirm
    const confirm = el('button', { class: 'btn primary', type: 'button', text: '确认入命' });
    confirm.addEventListener('click', () => {
      const nm = (nameInput.value || '').trim();
      if (!nm) { toast('请输入姓名。'); return; }
      G.name = nm;
      G.gender = genderSel.value;
      G.stats = { gengu: base.gengu + pts.gengu, wuxing: base.wuxing + pts.wuxing,
                  qiyun: base.qiyun + pts.qiyun, meili: base.meili + pts.meili };
      // give some starting items
      G.lingshi = 20;
      G.inventory = {};
      State.addItem('iron_sword', 1);
      State.addItem('cloth_robe', 1);
      State.addItem('minor_pill', 3);
      State.recompute();
      // close modal and continue
      closeModal();
      Save.saveSlot('autosave');
      Engine.goto('char_roll');
    });

    openModal('命格初定', wrap, [ confirm, makeCloseBtn('取消') ]);
  }

  function rollSpiritRoot() {
    const r = U.R.rand();
    if (r < 0.05) return 'immortal';
    if (r < 0.15) return 'variant';
    if (r < 0.30) return 'upper';
    if (r < 0.55) {
      const elts = ['fire','water','wood','metal','earth'];
      return 'mid_' + U.R.pick(elts);
    }
    if (r < 0.90) {
      const elts = ['fire','water','wood','metal','earth'];
      return 'lower_' + U.R.pick(elts);
    }
    return 'trash';
  }
  // expose
  global.UI_rollSpiritRoot = rollSpiritRoot;

  /* ============================================================
     EXPORT
     ============================================================ */
  global.UI = {
    renderSidebar, renderScene, renderChoices,
    openModal, closeModal, modalRoot,
    showCombat, hideCombat, renderCombat,
    openInventory, openSkills, openSave, openLoad, openAchievements, openSettings,
    openCharCreate, applySettings,
    spiritRootDisplay, useConsumable, learnManual,
  };
})(window);
