// 商店系統
import { state } from '../core/state.js';
import { log } from '../ui/log.js';
import { applyStats, runHook } from '../core/hooks.js';
import { pickShopItems, ITEMS } from '../data/items.js';
import { shakeGold } from '../ui/juice.js';

export function openShop() {
  state.currentShop = pickShopItems(state.player.age, 3 + Math.floor(Math.random() * 2));
  state.phase = 'shop';
  log('推開木門，你進入城鎮商店。', 'neutral');
}

export function closeShopAction() {
  state.currentShop = null;
  state.phase = 'town';
}

export function buyItem(item) {
  const p = state.player;
  let price = item.price ?? 0;
  // 魅力折扣
  const chaDiscount = p.shopDiscount ?? 0;
  price = Math.floor(price * (1 - chaDiscount));
  runHook('onShopPrice', p, { price });
  if (p.gold < price) {
    log('金幣不足！', 'warn');
    return false;
  }
  p.gold -= price;
  if (item.type === 'weapon' || item.type === 'armor' || item.type === 'accessory') {
    const slot = item.type === 'weapon' ? 'weapon' : item.type === 'armor' ? 'armor' : 'accessory';
    const old = p.equipment[slot];
    p.equipment[slot] = { ...item };
    if (old) p.inventory.push({ ...old });
    applyStats(p);
    log(`你裝備了【${item.name}】。`, 'good');
  } else {
    p.inventory.push({ ...item });
    log(`你購買了【${item.name}】。`, 'good');
  }
  shakeGold();
  state.currentShop = state.currentShop.filter(x => x.instanceId !== item.instanceId);
  return true;
}

export function useConsumable(itemInstance) {
  const p = state.player;
  const id = itemInstance.id;
  const it = ITEMS[id];
  if (!it?.effect) return false;
  switch (it.effect.type) {
    case 'heal': {
      const heal = it.effect.value >= 9999 ? p.maxHp - p.hp : it.effect.value;
      p.hp = Math.min(p.maxHp, p.hp + heal);
      log(`你服下【${it.name}】。HP +${heal}。`, 'good');
      break;
    }
    case 'permInt': {
      p.baseInt += it.effect.value;
      applyStats(p);
      log(`你飲下【${it.name}】。智力 +${it.effect.value}。`, 'good');
      break;
    }
    case 'random': {
      const r = Math.random();
      if (r < 0.33) {
        p.baseStr += 1; applyStats(p);
        log(`【${it.name}】爆發神秘力量！力量 +1。`, 'epic');
      } else if (r < 0.66) {
        p.baseInt += 1; applyStats(p);
        log(`【${it.name}】啟迪智慧！智力 +1。`, 'epic');
      } else {
        p.hp = Math.max(1, p.hp - 20);
        log(`【${it.name}】是毒藥……HP -20。`, 'warn');
      }
      break;
    }
  }
  p.inventory = p.inventory.filter(x => x.instanceId !== itemInstance.instanceId);
  return true;
}
