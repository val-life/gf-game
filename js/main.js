// 主入口（v2：手機友善）
import { loadMeta } from './systems/meta.js';
import { initLog, log } from './ui/log.js';
import { initUI, render } from './ui/render.js';
import { state } from './core/state.js';

function boot() {
  loadMeta();
  const logEl = document.getElementById('log-screen');
  const statusEl = document.getElementById('status-panel');
  const actionsEl = document.getElementById('actions');
  const phaseTagEl = document.getElementById('phase-tag');
  initLog(logEl);
  initUI(statusEl, actionsEl, phaseTagEl);
  // 桌機預設展開，手機預設收合
  if (window.innerWidth >= 768) {
    statusEl.classList.remove('collapsed');
  }
  render();
  console.log('[異世輪迴錄 v2] 啟動完成。業火：' + state.meta.karma);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
