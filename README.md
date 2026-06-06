# 轮回 (Lunhui)

> A web-based text adventure in the xianxia/isekai genre, built as a
> spiritual successor to the classic Chinese text RPG **异世轮回录** (Otherworld
> Reincarnation Chronicles). Pure HTML + CSS + vanilla JavaScript. No build
> step. No framework. No backend. Open `index.html` and play.

> 本作对原作仅作精神借鉴。所有剧情、人物、地名、物品、功法皆为原创，与原
> 作无任何文本或情节重合。

---

## 1. Quick Start

1. Open `index.html` in any modern browser (Chrome / Firefox / Edge / Safari).
   Double-click works — the game runs entirely from `file://`.
2. The character is auto-saved to `localStorage` on every major event.
3. To wipe progress, open the **设置** (Settings) panel → "清空所有存档与成就".

No build step. No `npm install`. No CDN dependencies.

---

## 2. Controls

| Key       | Action                              |
|-----------|-------------------------------------|
| 1-9       | Pick the N-th narrative choice      |
| A         | In combat: attack                   |
| D         | In combat: defend                   |
| F         | In combat: flee                     |
| K / S     | Open the skill / 法术 menu          |
| I         | Open consumable / 物品 menu         |
| I (top)   | Open inventory                      |
| K (top)   | Open skills                         |
| S (top)   | Open save                           |
| L (top)   | Open load                           |
| A (top)   | Open achievements / 录              |
| Esc       | Close any modal                     |

You can also click choices and buttons. Everything is keyboard-accessible.

---

## 3. Features Checklist

### Core systems
- [x] Character creation (name, gender, stat distribution, spirit root rolling)
- [x] Stat & resource system (根骨, 悟性, 气运, 魅力, HP, MP, 修为, 灵石, 寿元)
- [x] Cultivation realms (凡人 → 练气 → 筑基 → 金丹 → 元婴)
- [x] Turn-based combat with skills, items, defend, flee, status effects
- [x] Inventory & equipment (weapons / armor / accessories / manuals)
- [x] Cultivation progression with breakthrough events
- [x] Save/Load to `localStorage` with 4 slots + autosave
- [x] Export/Import saves as JSON for portability
- [x] Random encounters (weighted tables per scene)
- [x] Achievement gallery & ending log (persists across new games)

### UI / UX
- [x] Ink-wash / wuxia visual style
- [x] Typewriter text reveal
- [x] Cinnabar / gold / parchment palette
- [x] Keyboard navigation
- [x] Responsive (desktop / tablet / phone)
- [x] Settings panel (text speed, font size, reset)

### Content
- [x] Prologue: death & reincarnation, ~6 scenes
- [x] Act 1: 清河村 mortal village, ~20 scenes
- [x] Act 2: Two major paths (orthodox sect + wandering cultivator), ~30 scenes
- [x] Act 3: Climax with boss fights, branching ending hub
- [x] 6 distinct endings (2 hidden)
- [x] 2 side quests (ancient well, herb specialist)
- [x] 20+ enemy types, 30+ items, 12+ skills

---

## 4. File Tree

```
.
├── index.html               # entry point
├── DESIGN.md                # game design doc
├── README.md                # this file
├── TODO.md                  # build checklist
├── css/
│   ├── main.css             # layout, palette, ink-wash aesthetic
│   ├── combat.css           # combat overlay
│   └── mobile.css           # responsive breakpoints
├── js/
│   ├── utils.js             # RNG, helpers, toast, event bus
│   ├── state.js             # global state + state helpers
│   ├── save.js              # localStorage save/load, settings
│   ├── combat.js            # turn-based combat engine
│   ├── ui.js                # rendering, modals, typewriter
│   ├── engine.js            # scene flow, choice dispatch, keyboard
│   └── data/
│       ├── realms.js        # cultivation realm table
│       ├── skills.js        # skill + status-effect data
│       ├── items.js         # item catalog
│       ├── enemies.js       # enemy catalog
│       └── scenes.js        # scene graph (90+ nodes)
└── assets/                  # reserved for future fonts/images
```

---

## 5. Content Authoring Guide

Adding new content is data-driven. **You do not need to touch engine code.**

### Add a scene

Open `js/data/scenes.js` and append an entry:

```js
"my_new_scene": {
  title: "场景标题",
  text: [
    "第一段正文……",
    "第二段正文……",
  ],
  choices: [
    { text: "选项A", next: "another_scene" },
    { text: "选项B（需要高气运）", next: "lucky_scene", requires: { qiyun: 4 } },
    { text: "选项C（开战）", next: "post_battle_scene", combat: "mountain_wolf" },
    { text: "选项D（获得物品）", next: "yet_another", give: { minor_pill: 1 } },
  ],
  onEnter: { hp: 10, cultivation: 5, set: { talked_to_npc: true } },
  hint: "小提示：……",
}
```

#### Choice fields

| Field      | Meaning                                                            |
|------------|--------------------------------------------------------------------|
| `text`     | Display text                                                       |
| `next`     | Scene id to go to                                                  |
| `requires` | Condition object: `{ qiyun: 3, 'flag:met_li': true, 'realm:jindan': true }` |
| `set`      | Set a flag: `{ talked_to_npc: true }`                              |
| `give`     | Add items: `{ minor_pill: 2, iron_sword: 1 }` (or single id)       |
| `take`     | Remove items                                                       |
| `combat`   | Enemy id to fight; `next` is reached on win                        |
| `learn`    | Skill id to learn                                                  |
| `cultivation` | Flat cultivation gain                                           |
| `hp` / `mp`  | HP/MP delta                                                      |

#### Scene `onEnter` fields

Same set as choices (executed on entering the scene), plus:

| Field            | Meaning                                                       |
|------------------|---------------------------------------------------------------|
| `rollSpirit`     | Roll a new spirit root                                        |
| `finalizeChar`   | Recompute caps and set max HP/MP                              |
| `break`          | Attempt breakthrough to a realm id                            |
| `ending`         | Mark this scene as the named ending                           |
| `achievement`    | Grant an achievement id                                       |
| `message`        | Toast message                                                 |

### Add an enemy

Open `js/data/enemies.js`:

```js
my_enemy: {
  name: "妖狼",
  desc: "山中常见。",
  hp: 40, mp: 0, atk: 12, def: 4, mag: 0, res: 2, spd: 10,
  level: 2, ai: "aggressive",
  skills: ["strike"],
  drop: { exp: 15, lingshi: 5, items: [{ id: "beast_core", chance: 0.4, qty: 1 }] }
}
```

AI tags: `aggressive`, `defensive`, `caster`, `berserk`, `tricky`.
Set `boss: true` to disable fleeing.

### Add an item

Open `js/data/items.js`:

```js
my_item: {
  name: "青锋剑",
  type: "weapon",     // weapon | armor | accessory | consumable | manual | material | quest
  desc: "……",
  stats: { atk: 8 },  // deltas applied when equipped
  value: 50,          // 灵石 price
  req: { realm: "lianqi", layer: 0 }
}
```

For consumables, add `effect: { kind: "heal_hp_pct", pct: 0.3 }`.
For manuals, add `learn: "sword_qi"` to teach a skill on study.

### Add a skill

Open `js/data/skills.js`:

```js
my_skill: {
  name: "灵剑术",
  type: "mag",        // phys | mag | util
  cost: 5, cd: 2, power: 1.4,
  desc: "……",
  require: { realm: "lianqi", layer: 0 },
  effect: { kind: "dmg", power: 1.4 }     // OR heal/buff/debuff/lifesteal/...
}
```

### Add an ending

Add a scene with `isEnding: true` and `onEnter: { ending: "你的结局名" }`, then
expose it via the final-choice hub in `act3_final_choice`.

---

## 6. Save Format

Saves are stored under `localStorage["lunhui_save_<slotId>"]` as JSON.
Sample (truncated):

```json
{
  "version": 1,
  "slotId": "autosave",
  "name": "阿牛",
  "gender": "male",
  "stats": { "gengu": 6, "wuxing": 5, "qiyun": 5, "meili": 8 },
  "spiritRoot": "mid_wood",
  "realmId": "lianqi",
  "layer": 2,
  "hp": 84, "mp": 60,
  "exp": 200, "cultivation": 80,
  "lingshi": 45, "age": 16, "lifespan": 120,
  "inventory": { "minor_pill": 3, "iron_sword": 1 },
  "equipment": { "weapon": "iron_sword", "armor": "cloth_robe" },
  "skills": ["strike", "defend", "heal"],
  "flags": { "met_li": true, "trained_li": true },
  "currentScene": "act2_outer_disciple"
}
```

Achievements persist under `lunhui_achievements` and survive new games.

---

## 7. Extensibility

- **Add a new act**: append scene ids in `scenes.js` and link from any choice
  in `act3_final_choice` or earlier.
- **Add a path branch**: scenes are not numbered, only keyed by id. Drop a new
  `path_<x>_intro` scene anywhere and link choices to it.
- **Add a status effect**: add to `STATUS` in `js/data/skills.js`. Then reference
  it by id in skill `effect.kind: 'debuff', status: '…'`.
- **Add a stat**: extend `G.stats` in `state.js`, add a sidebar slot in
  `index.html`, render in `UI.renderSidebar`, and add derived handling in
  `State.recompute()`.

---

## 8. Balance Tuning

Tuning knobs:

- **Damage formulas**: `calcPhysDmg` / `calcMagDmg` in `js/combat.js`.
- **Breakthrough success**: `tryBreakthrough` in `js/engine.js`.
- **Spirit root reroll odds**: `UI_rollSpiritRoot` in `js/ui.js`.
- **Realm exp curve**: `expToNext` in `js/data/realms.js`.
- **Enemy stats & drops**: `js/data/enemies.js`.

---

## 9. Known Limitations

- Combat AI is rule-based, not deep — `aggressive`/`defensive`/etc. only.
- Status effects are limited to: 中毒, 灼烧, 再生, 眩晕, 易伤, 虚弱, 护体.
- No audio assets ship by default (settings toggle is wired for future use).
- The save format is not versioned beyond `version: 1`; future schema
  changes will need a migration.
- The hidden endings have specific flags — see `DESIGN.md` for unlock conditions.

---

## 10. Credits

- Original genre homage: 异世轮回录 (Wangyuan Shengtang).
- All text, characters, world, items, and code in this repo: original.
- No copyrighted text from any source game is included.

---

愿君此行，仙路长明。
