// 日誌系統
const TYPE_CLASS = {
  good: 'log-good',
  bad: 'log-bad',
  warn: 'log-warn',
  epic: 'log-epic',
  magic: 'log-magic',
  neutral: 'log-neutral',
  fail: 'log-fail'
};

let logEl = null;
let onLogCb = null;

export function initLog(el, cb) {
  logEl = el;
  onLogCb = cb;
}

export function log(text, type = 'neutral') {
  if (!logEl) return;
  const div = document.createElement('div');
  div.className = `log-line ${TYPE_CLASS[type] ?? ''}`;
  div.innerHTML = text;
  logEl.appendChild(div);
  logEl.scrollTop = logEl.scrollHeight;
  if (onLogCb) onLogCb(text, type);
}

export function clearLog() {
  if (logEl) logEl.innerHTML = '';
}
