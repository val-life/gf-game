// 工具函式
export const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
export const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
export const pick = arr => arr[Math.floor(Math.random() * arr.length)];
export const pickWeighted = (arr, weightFn) => {
  const total = arr.reduce((s, x) => s + (weightFn(x) ?? 1), 0);
  let r = Math.random() * total;
  for (const x of arr) {
    r -= (weightFn(x) ?? 1);
    if (r <= 0) return x;
  }
  return arr[arr.length - 1];
};
export const sample = (arr, n) => {
  const copy = [...arr];
  const out = [];
  while (out.length < n && copy.length > 0) {
    const i = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(i, 1)[0]);
  }
  return out;
};

export function formatStat(player, stat) {
  return `${player[stat] ?? 0}`;
}

export function narrateHP(current, max) {
  const pct = current / max;
  if (pct > 0.6) return '健康';
  if (pct > 0.3) return '輕傷';
  if (pct > 0) return '重傷';
  return '瀕死';
}
