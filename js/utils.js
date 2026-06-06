/* =============================================================
   utils.js  — generic helpers, RNG, formatters
   Loaded first; everything else can use it.
   Exposed on window.U
   ============================================================= */
(function (global) {
  'use strict';

  /* -------- RNG: seedable, with helpers -------- */
  function makeRng(seed) {
    // Mulberry32
    let s = (seed >>> 0) || 1;
    return function () {
      s = (s + 0x6D2B79F5) >>> 0;
      let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  // Global RNG (used by engine unless overridden for tests)
  const RNG = makeRng((Date.now() & 0xffffffff) >>> 0);
  const R = {
    seed: (s) => Object.assign(RNG, makeRng(s)),
    rand:    () => RNG(),
    randInt: (lo, hi) => Math.floor(RNG() * (hi - lo + 1)) + lo,
    pick:    (arr) => arr[Math.floor(RNG() * arr.length)],
    weighted:(arr) => {
      // arr = [{value, weight}]
      const total = arr.reduce((s, x) => s + x.weight, 0);
      let r = RNG() * total;
      for (const x of arr) {
        r -= x.weight;
        if (r <= 0) return x.value;
      }
      return arr[arr.length - 1].value;
    },
    chance:  (p) => RNG() < p,
    roll:    (sides) => R.randInt(1, sides),
  };

  /* -------- Math / clamp -------- */
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const pct   = (a, b) => (b <= 0 ? 0 : Math.round(100 * a / b));

  /* -------- Object helpers -------- */
  function deepClone(o) {
    if (o === null || typeof o !== 'object') return o;
    if (Array.isArray(o)) return o.map(deepClone);
    const out = {};
    for (const k in o) out[k] = deepClone(o[k]);
    return out;
  }
  function deepEqual(a, b) {
    if (a === b) return true;
    if (a === null || b === null) return false;
    if (typeof a !== typeof b) return false;
    if (typeof a !== 'object') return a === b;
    if (Array.isArray(a) !== Array.isArray(b)) return false;
    if (Array.isArray(a)) {
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) if (!deepEqual(a[i], b[i])) return false;
      return true;
    }
    const ka = Object.keys(a), kb = Object.keys(b);
    if (ka.length !== kb.length) return false;
    for (const k of ka) if (!deepEqual(a[k], b[k])) return false;
    return true;
  }
  function pickWeighted(map) {
    // map = { id: weight, ... }
    let total = 0;
    for (const k in map) total += map[k];
    let r = RNG() * total;
    for (const k in map) {
      r -= map[k];
      if (r <= 0) return k;
    }
    return Object.keys(map)[0];
  }
  function countKeys(obj) { return Object.keys(obj || {}).length; }

  /* -------- Formatters -------- */
  function fmt(n) { return (n >= 0 ? '' : '') + Math.round(n).toString(); }
  function fmtSigned(n) { return (n >= 0 ? '+' : '') + Math.round(n); }
  function fmtTime(seconds) {
    if (seconds < 60) return Math.round(seconds) + '秒';
    const m = Math.floor(seconds / 60), s = Math.round(seconds % 60);
    if (m < 60) return `${m}分${s}秒`;
    const h = Math.floor(m / 60), mm = m % 60;
    return `${h}时${mm}分`;
  }

  /* -------- ID / class helpers -------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }
  function el(tag, attrs, children) {
    const e = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      if (k === 'class') e.className = attrs[k];
      else if (k === 'html') e.innerHTML = attrs[k];
      else if (k === 'text') e.textContent = attrs[k];
      else if (k.startsWith('on') && typeof attrs[k] === 'function') e.addEventListener(k.slice(2), attrs[k]);
      else if (k === 'data') for (const dk in attrs.data) e.dataset[dk] = attrs.data[dk];
      else e.setAttribute(k, attrs[k]);
    }
    if (children) {
      (Array.isArray(children) ? children : [children]).forEach(c => {
        if (c == null) return;
        e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
      });
    }
    return e;
  }
  function on(root, sel, evt, fn) {
    (root || document).addEventListener(evt, (e) => {
      const target = e.target.closest(sel);
      if (target && (root || document).contains(target)) {
        e._matched = target;
        fn.call(target, e);
      }
    });
  }

  /* -------- Toast (lightweight) -------- */
  let toastTimer = null;
  function toast(msg, duration) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.remove('hidden');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.add('hidden'), duration || 1800);
  }

  /* -------- Event bus (simple) -------- */
  const bus = (() => {
    const handlers = {};
    return {
      on(ev, fn) { (handlers[ev] = handlers[ev] || []).push(fn); },
      off(ev, fn) {
        if (!handlers[ev]) return;
        handlers[ev] = handlers[ev].filter(f => f !== fn);
      },
      emit(ev, payload) {
        (handlers[ev] || []).forEach(fn => {
          try { fn(payload); } catch (err) { console.error('[bus]', ev, err); }
        });
      },
    };
  })();

  /* -------- Export -------- */
  global.U = {
    R, RNG, clamp, pct,
    deepClone, deepEqual, pickWeighted, countKeys,
    fmt, fmtSigned, fmtTime,
    $, $$, el, on, toast, bus,
  };
})(window);
