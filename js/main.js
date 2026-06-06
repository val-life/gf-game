// 主入口
import { loadMeta } from './systems/meta.js';
import { initLog, log } from './ui/log.js';
import { initUI, render } from './ui/render.js';
import { state } from './core/state.js';

function boot() {
  // 載入 meta 存檔
  loadMeta();
  // 初始化 UI
  const logEl = document.getElementById('log-screen');
  const statusEl = document.getElementById('status-panel');
  const actionsEl = document.getElementById('actions');
  initLog(logEl);
  initUI(statusEl, actionsEl);

  // 首次繪製
  render();

  // 鍵盤快捷
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      const primary = document.querySelector('.actions .btn.primary:not(:disabled)');
      if (primary && document.activeElement?.tagName !== 'BUTTON') {
        // 不主動觸發，避免誤觸
      }
    }
  });

  console.log('[異世輪迴錄] 啟動完成。業火：' + state.meta.karma);
}

// 等 DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
