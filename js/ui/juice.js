// 視覺特效：閃爍、抖動
export function flashRed() {
  const el = document.getElementById('flash-layer');
  if (!el) return;
  el.classList.remove('flash-red', 'flash-gold');
  void el.offsetWidth;
  el.classList.add('flash-red');
}

export function flashGold() {
  const el = document.getElementById('flash-layer');
  if (!el) return;
  el.classList.remove('flash-red', 'flash-gold');
  void el.offsetWidth;
  el.classList.add('flash-gold');
}

export function shakeStat(statKey) {
  const el = document.querySelector(`[data-stat="${statKey}"]`);
  if (!el) return;
  el.classList.remove('shake-pop');
  void el.offsetWidth;
  el.classList.add('shake-pop');
  setTimeout(() => el.classList.remove('shake-pop'), 600);
}

export function shakeGold() {
  const el = document.querySelector('[data-stat="gold"]');
  if (el) shakeStat('gold');
}

export function shakeHP() {
  const el = document.querySelector('[data-stat="hp"]');
  if (el) shakeStat('hp');
}
