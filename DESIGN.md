# DESIGN.md — 轮回 (Lunhui)

> A spiritual successor to the Chinese text RPG 异世轮回录.
> Original story, original world, original characters. Genre homage only.

---

## 1. Pitch

A modern soul dies in a car accident and is reincarnated into a cultivation
world called **沧澜 (Canglan)**. The player chooses their mortal origin,
distributes starting talent across four attributes, rolls a spirit root, and
makes choices that will lead them toward one of several destinies — orthodox
sect disciple, wandering cultivator, demonic path, hidden sage, or
unremarkable mortal death.

The game is text-first: the player reads a scene, then picks 1-of-N choices
that branch the narrative. Combat is turn-based and stat-driven.

---

## 2. Core Stats

| Stat    | Chinese | Affects                                                |
|---------|---------|--------------------------------------------------------|
| 根骨    | Gengu   | HP pool, physical ATK, constitution-based checks       |
| 悟性    | Wuxing  | MP pool, cultivation speed, spell power                |
| 气运    | Qiyun   | Crit chance, random encounter rolls, breakthrough      |
| 魅力    | Meili   | Dialogue persuasion, shop discounts, faction standing  |

Derived stats (computed from base stats + equipment + buffs):

- **HP** = 50 + Gengu*10 + realm_bonus
- **MP** = 30 + Wuxing*8  + realm_bonus
- **ATK** = 5 + Gengu*1.2 + weapon_atk
- **DEF** = 0 + Gengu*0.6 + armor_def
- **MAG** = 5 + Wuxing*1.2 + (manual_bonus)
- **RES** = 0 + Wuxing*0.6
- **SPD** = 8 + (Gengu+Wuxing)*0.3
- **CRIT** = 5 + Qiyun*0.5   (%)
- **DODGE**= 3 + Qiyun*0.3   (%)

---

## 3. Cultivation Realms

```
凡人 (Mortal)  — age 0-20, no qi
  └─ 练气  Qi Refining     [9 layers, 0-9]
        └─ 筑基  Foundation [9 layers, 0-9]
              └─ 金丹  Golden Core [Early / Mid / Late]
                    └─ 元婴  Nascent Soul [Early / Mid / Late]   ← endgame
```

Each layer requires accumulating **修为 (cultivation points)**. The player
meditates or uses items to gain 修为. Once threshold is met, a **breakthrough
event** fires. Breakthrough success is rolled against a formula:

```
success_chance = base + Wuxing*0.5 + Qiyun*0.3 + pill_bonus
```

- Failure: lose half current 修为, take minor damage, can retry.
- Success: realm advances, HP/MP cap raised, lifespan extended.

Lifespan per realm:
- 凡人: 80 years
- 练气: 120
- 筑基: 200
- 金丹: 500
- 元婴: 1000

---

## 4. Resources

- **HP / MP** — combat resources, restored by rest/pills
- **EXP** — combat XP, fills 修为 pool
- **修为** — cultivation progress toward next layer
- **灵石** Lingshi — currency, also used as pill reagents
- **年龄 Age** — increments on time-pass events; affects elder interactions
- **寿元 Lifespan** — max age; extended by breakthroughs

---

## 5. Combat System

Turn-based, side-on (player left, enemy right). Initiative = SPD + random(1,10).
On each turn, the actor chooses:

- **攻击 Attack** — physical strike (ATK vs DEF, may crit)
- **法术 Skill** — pick a learned skill, costs MP, may have cooldown
- **防御 Defend** — halve incoming damage this turn, +10% next hit
- **物品 Item** — use a consumable from inventory
- **逃跑 Flee** — SPD check, fails on boss fights

Damage formula:
```
phys_dmg  = max(1, ATK - DEF/2 + rand(0, ATK*0.15))
spell_dmg = max(1, MAG * skill_power - RES/2 + rand(0, MAG*0.10))
```

Status effects (1-3 turn durations):
- 中毒 Poison — 5% max HP per turn
- 眩晕 Stun  — skip turn
- 灼烧 Burn  — 8% max HP per turn, decays
- 再生 Regen — 6% max HP per turn
- 虚弱 Weak  — -25% outgoing damage
- 易伤 Vulnerable — +25% incoming damage

Enemies have AI tags: `aggressive`, `defensive`, `caster`, `summoner`,
`berserk` (low-HP rage).

---

## 6. Items (30+)

Categories:
- **武器 Weapons** (5) — iron sword, jade dagger, flying sword, spirit blade, demon sword
- **护甲 Armor** (5) — cloth robe, leather armor, qi shield, jade vest, celestial silk
- **饰品 Accessories** (4) — luck charm, sage pendant, blood talisman, storage ring
- **丹药 Consumables** (8) — minor heal, major heal, MP restore, qi pill, breakthrough pill, antidotes, age-reducing elixir, fortune talisman
- **功法 Manuals** (5) — five-element basics, sword intent, demon heart, sage breath, void scripture
- **任务 Quest** (5) — village head's letter, broken sword, jade slip, demon soul, immortal bone
- **材料 Materials** (4) — spirit herb, beast core, refined iron, demon crystal

---

## 7. Skills (12)

| Skill            | Type   | Cost | CD | Power | Effect             |
|------------------|--------|------|----|-------|--------------------|
| 攻击 Strike      | phys   | 0    | 0  | 1.0   | —                  |
| 灵剑术 Sword Qi  | phys   | 5    | 2  | 1.4   | —                  |
| 金光咒 Golden Light | mag | 8    | 3  | 1.5   | self +DEF 1 turn   |
| 治愈术 Heal      | mag    | 10   | 2  | —     | heal 40% MAG HP to self |
| 五行雷法 Five-Element Thunder | mag | 18 | 4 | 2.2 | —        |
| 御剑飞行 Sword Flight | phys | 12 | 5 | 1.6 | ignore 20% DEF     |
| 元神出窍 Soul Out | mag | 30 | 6 | 2.5 | chance to stun     |
| 吞噬 Devour      | phys   | 15   | 4  | 1.8   | lifesteal 30%      |
| 玄冰诀 Ice Seal  | mag    | 14   | 3  | 1.7   | chance to freeze (=stun) |
| 血咒 Blood Curse | mag    | 22   | 5  | 2.0   | applies vulnerable  |
| 静心 Meditation  | util   | 0    | 0  | —     | skip turn, +20 修为   |
| 防御 Defend      | util   | 0    | 0  | —     | halve next incoming |

---

## 8. Enemies (20+)

Common: 山狼 Mountain Wolf, 野山贼 Bandit, 毒蛇 Venomous Snake, 食人花
Man-Eating Flower, 妖狐 Spirit Fox, 蝙蝠群 Bat Swarm, 巨型蜈蚣 Giant
Centipede, 巨猿 Mountain Ape, 黑风盗 Black Wind Bandit, 蛇妖 Snake
Yao, 玄铁傀儡 Iron Golem, 阴灵 Wraith, 鬼面蛛 Ghost-Face Spider.

Elite: 筑基修士 Rogue Cultivator, 魔修 Demon Cultivator, 黑水寨主 Black
Water Stronghold Leader, 妖兽首领 Beast Chieftain.

Boss: 山神试炼 Mountain God Trial, 妖王 Yao King, 宗主对决 Sect
Master Duel.

---

## 9. Scene / Branching Structure

```
Prologue (6 scenes)
   └─ death → reincarnation → arrive in Canglan
        ├─ start in 凡人村 (Village) [Act 1, ~20 scenes]
        │    └─ encounter sect recruiter OR wandering master
        │         ├─ 入宗 (Enter Sect) → Act 2A Orthodox Path
        │         └─ 散修 (Wanderer)  → Act 2B Rogue Path
        └─ start in 山野 (Wilds)  [Variant Act 1, ~12 scenes]
             └─ demon path / hidden sage

Act 2A: 青云宗 Qingyun Sect (~18 scenes)
   ├─ outer disciple → inner disciple → elder apprentice
   ├─ side: herb gathering, beast subjugation, junior tournament
   └─ climax: demonic incursion on the sect

Act 2B: 散修 Wanderer Path (~18 scenes)
   ├─ travel through towns, meet masters
   ├─ side: ancient tomb exploration, smuggler ring
   └─ climax: demon king awakens in the southern wasteland

Act 3: Climax (~15 scenes)
   ├─ boss fight(s)
   ├─ final choice: orthodoxy / mercy / power / sacrifice
   └─ 5+ distinct endings + 1 hidden

Side Quests:
  - 古井之谜 (Ancient Well Mystery) — village
  - 失落的剑谱 (Lost Sword Manual) — sect/wanderer
  - 隐藏: 仙人残卷 (Immortal Remnant Scroll) — unlocks sage path
```

### Endings

1. **飞升仙道 Ascending the Immortal Path** — Golden Core + early Nascent Soul + benevolence
2. **宗主继任 Becoming Sect Master** — orthodox path, high reputation
3. **魔道独尊 Dominating the Demonic Path** — demon path, max demonic standing
4. **归隐山林 Retiring to the Mountains** — wanderer path, low ambition
5. **凡人善终 Dying a Mortal** — never break through, but be kind
6. **天谴身死 Divine Retribution** — too many evil acts
7. **隐藏 逍遥仙 Hidden: Carefree Immortal** — find immortal remnant scroll + max Qiyun
8. **隐藏 轮回重启 Hidden: Reincarnation Restart** — find all 5 memory fragments

---

## 10. Save Format

`localStorage` key: `lunhui_save_<slotId>` — JSON string.

```jsonc
{
  "version": 1,
  "slotId": "slot1",
  "name": "...",
  "gender": "male|female",
  "stats": { "gengu": 5, "wuxing": 5, "qiyun": 5, "meili": 5 },
  "spiritRoot": "fire|wood|water|metal|earth|variant|trash",
  "realm": "练气", "layer": 0,
  "hp": 100, "mp": 80, "exp": 0, "cultivation": 0,
  "lifespan": 80, "age": 16,
  "lingshi": 50,
  "inventory": { "iron_sword": 1, ... },
  "equipment": { "weapon": "iron_sword", "armor": null, "accessory": null, "manual": null },
  "skills": ["strike", "heal"],
  "flags": { "met_master": true, "...": "..." },
  "currentScene": "scene_id",
  "achievements": ["first_kill", "..."],
  "endingsUnlocked": ["ending_ascended"],
  "playTime": 1234,
  "createdAt": "...", "updatedAt": "..."
}
```

Separate key `lunhui_achievements` persists across new games.

---

## 11. Balance Targets

- Prologue: 5-10 minutes, no combat required
- Act 1: 15-25 minutes, 1-3 combats, reaches 练气 layer 3
- Act 2: 30-60 minutes per branch, 8-12 combats, reaches 筑基 early
- Act 3: 20-40 minutes, 1-3 boss fights, final realm decision
- Total run: 60-120 minutes for first ending

---

## 12. Authoring Guide (CONTRIBUTING)

To add a new scene, add an entry to `js/data/scenes.js`:

```js
"my_scene_id": {
  title: "场景标题",
  text: ["第一段文字", "第二段文字"],
  choices: [
    { text: "选项A", next: "next_scene_id", requires: { qiyun: 3 } },
    { text: "选项B", next: "alt_scene_id", set: { flag: "did_thing" } }
  ],
  onEnter: { heal: 20, item: "minor_pill", exp: 10 }
}
```

To add an enemy, add to `js/data/enemies.js`:

```js
my_enemy: {
  name: "妖狼",
  hp: 40, mp: 0, atk: 12, def: 4, mag: 0, res: 2, spd: 10,
  level: 1, ai: "aggressive",
  drops: [{ item: "beast_core", chance: 0.3, qty: 1 }, { item: "lingshi", chance: 0.5, qty: 5 }],
  exp: 15, lingshi: 3,
  skills: ["strike"]
}
```

To add an item, add to `js/data/items.js`:

```js
my_item: {
  name: "青锋剑",
  type: "weapon",
  desc: "一柄轻灵的青钢长剑。",
  stats: { atk: 8 },
  value: 50
}
```

---

## 13. Out of Scope (MVP)

- No voice acting / BGM (toggle present but no audio by default)
- No multiplayer / no online features
- No graphics beyond CSS
- Limited to ~120 scenes in MVP; future expansion module
