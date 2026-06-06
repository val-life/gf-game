/* =============================================================
   save.js — localStorage save/load with export/import
   Save slots: 'lunhui_save_<slotId>' (default 'autosave')
   Achievements: 'lunhui_achievements' (global, persists across games)
   Settings:    'lunhui_settings'
   ============================================================= */
(function (global) {
  'use strict';

  const SAVE_PREFIX = 'lunhui_save_';
  const ACH_KEY = 'lunhui_achievements';
  const SET_KEY = 'lunhui_settings';

  // ---- default settings ----
  const DEFAULT_SETTINGS = {
    textSpeed: 18,        // ms per char (lower = faster)
    fontScale: 1.0,       // multiplier
    bgm: false,           // toggle (no audio by default)
    sfx: true,
    autosave: true,
  };
  let settings = Object.assign({}, DEFAULT_SETTINGS);
  try {
    const raw = localStorage.getItem(SET_KEY);
    if (raw) Object.assign(settings, JSON.parse(raw));
  } catch (e) {}

  function saveSettings() {
    try { localStorage.setItem(SET_KEY, JSON.stringify(settings)); } catch (e) {}
  }
  function getSettings() { return Object.assign({}, settings); }
  function setSetting(k, v) { settings[k] = v; saveSettings(); }
  function resetSettings() { settings = Object.assign({}, DEFAULT_SETTINGS); saveSettings(); }

  // ---- save/load slots ----
  function listSlots() {
    const out = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.indexOf(SAVE_PREFIX) === 0) {
        out.push(k.slice(SAVE_PREFIX.length));
      }
    }
    return out;
  }

  function saveSlot(slotId) {
    if (!slotId) slotId = 'autosave';
    G.slotId = slotId;
    G.updatedAt = new Date().toISOString();
    if (!G.createdAt) G.createdAt = G.updatedAt;
    try {
      const data = JSON.stringify(G, (k, v) => {
        if (k.startsWith('_')) return undefined;  // strip cached derived
        return v;
      });
      localStorage.setItem(SAVE_PREFIX + slotId, data);
      return true;
    } catch (e) {
      console.error('save error', e);
      return false;
    }
  }

  function loadSlot(slotId) {
    if (!slotId) slotId = 'autosave';
    const raw = localStorage.getItem(SAVE_PREFIX + slotId);
    if (!raw) return false;
    try {
      const data = JSON.parse(raw);
      // shallow merge into G (preserves methods on prototype)
      for (const k in G) {
        if (k.startsWith('_')) continue;
        if (data.hasOwnProperty(k)) G[k] = data[k];
      }
      State.recompute();
      return true;
    } catch (e) {
      console.error('load error', e);
      return false;
    }
  }

  function deleteSlot(slotId) {
    if (!slotId) slotId = 'autosave';
    try { localStorage.removeItem(SAVE_PREFIX + slotId); return true; }
    catch (e) { return false; }
  }

  function hasSlot(slotId) {
    return !!localStorage.getItem(SAVE_PREFIX + (slotId || 'autosave'));
  }

  function exportSlot(slotId) {
    const raw = localStorage.getItem(SAVE_PREFIX + (slotId || 'autosave'));
    return raw || '';
  }
  function importSlot(slotId, jsonStr) {
    try {
      const data = JSON.parse(jsonStr);
      // basic sanity
      if (!data || typeof data !== 'object' || !data.version) return false;
      localStorage.setItem(SAVE_PREFIX + slotId, JSON.stringify(data));
      return true;
    } catch (e) { return false; }
  }

  function wipeAll() {
    // wipe all save slots
    listSlots().forEach(deleteSlot);
    try { localStorage.removeItem(ACH_KEY); } catch (e) {}
  }

  // ---- achievements persistence ----
  function saveAchievements() {
    try {
      localStorage.setItem(ACH_KEY, JSON.stringify({
        unlocked: ACH.unlocked,
        endings: ACH.endings,
      }));
    } catch (e) {}
  }
  function loadAchievements() {
    try {
      const raw = localStorage.getItem(ACH_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      Object.assign(ACH.unlocked, data.unlocked || {});
      Object.assign(ACH.endings, data.endings || {});
    } catch (e) {}
  }

  global.Save = {
    listSlots, saveSlot, loadSlot, deleteSlot, hasSlot,
    exportSlot, importSlot, wipeAll,
    saveAchievements, loadAchievements,
    getSettings, setSetting, resetSettings,
  };
})(window);
