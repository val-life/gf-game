# 异世轮回录 (Otherworld Samsara Record) — Web Rebuild Guide

> **Source**: Unity 2019.4.17 + IL2CPP (`libil2cpp.so` ARM64 + `global-metadata.dat`) + AssetStudio dump of `data.unity3d` (Wave 2, 2026-6-9) + UnityPy programmatic walk (Wave 3, 2026-6-9) + AssetStudio TypeTree dump via Il2CppInspector dummy DLLs (Wave 4, 2026-6-10) + **Ghidra decompilation of `libil2cpp.so` (Wave 5, 2026-6-10)**
>
> **Purpose**: Game-design reference for building a simpler web-based version
>
> **Files in this dir**:
> - `rebuild_guide.md` (this file) — game design & systems
> - `ghidra_results.md` — **decompiled formulas + constants from `libil2cpp.so`** (Wave 5) — source of truth for §4 formulas
> - `extracted_game_data.md` — decoded game data (talents, items, monsters, skills, buffs, achievements, endings, equipment, event-deck, Wave 3 counts)
> - `UI_DESIGN.md` — **extracted UI layout / panel flow** (title screen → new game → continue → in-game panels). Source: `il2cpp.cs` `FDPanel` classes.
> - `dump_inventory.md` — catalogue of the 11,271 `Dump/*` files by bucket (Wave 2, updated for Wave 3)
> - `extraction_wave4.md` — TypeTree dump extraction pipeline (Wave 4)
> - `wave3_extraction.md` — UnityPy pipeline + per-output schemas (Wave 3)
> - `chinese_strings.txt` — raw 1,834 Chinese strings from `global-metadata.dat`
> - `extraction_summary.md` — what was extracted & how
> - `game_complete.md` — enums + 15 skills + 15 buffs + 35 talents + equipment formulas (Wave 3, supplemented by Wave 5)
> - `artifact_complete.md` — 48 artifacts full reverse (Wave 3)
> - `todo.md` — what's still missing (most items now resolved by Wave 5)
> - `data/RelicSettingJS.json` — canonical 51-relic balance dataset
> - `data/WeaponSettingJS.json` — canonical 26-equipment dataset
> - `data/EventCardTypeSettingJS.json` — canonical 4-card adventure-deck weights
> - `data/monoscript_catalog.json` — authoritative 780-entry PathID → Class.Namespace.Assembly map
> - `data/mb_*.json` — TypeTree-decoded MB fields (Wave 4)
> - `data/monobehaviour_*.{json,bin}` — 10,246 MB instance records + 2.34 MB raw tail blobs + 8,310 CJK strings
> - `data/xnode_texts.json` — 1,477 XNode nodes, 5,383 clean Chinese strings (Wave 4)
> - `data/sprite_index.json`, `data/texture2d_index.json`, etc. — built-in asset indexes
> - `dump_unity3d.py`, `extract_mb_strings.py`, `parse_battle_events.py`, `parse_typemb.py` — Wave 3/4 scripts
> - `final_extract.py` — Wave 1 metadata-scan script

---

## 0. Quick Start (How to use this guide)

This is a **design reference**, not a tutorial. For a web rebuild:

1. **Core loop** (read §1) → implement the basic turn/state machine
2. **Stats system** (read §2) → implement 16 base stats + 9 derived combat stats
3. **Event flow** (read §3) → implement the XNode-style event graph
4. **Formulas** (read §4) → implement damage/buff/level calculations
5. **Game data** → **READ `extracted_game_data.md`** (don't duplicate here) and import direct JSON from `data/`:
   - 30+ Talents with exact effect values (§2)
   - **51 Relics with parser-ready effect strings (§3a + `data/RelicSettingJS.json`)** ← Wave 2
   - **26 Equipment items with profession + property pools (§3b + `data/WeaponSettingJS.json`)** ← Wave 2
   - 40+ Boss-drop Artifacts (§3c)
   - 50+ Monsters with abilities (§4)
   - **4 Adventure-deck card weights (§4b + `data/EventCardTypeSettingJS.json`)** ← Wave 2
   - 20+ Skills with 3-level scaling (§5)
   - 10 Buff types with stack formulas (§1)
   - 100+ Achievements / Endings / Cruel World levels (§6)
6. **What we still don't have** → see `todo.md`
7. **Where to find any asset in the dump** → see `dump_inventory.md`

---

## 1. Core Game Design

### 1.1 Concept

- **Genre**: Roguelike + narrative + turn-based card-style combat
- **Theme**: "Otherworld" + "Reincarnation" — each game = new world, on death → reincarnate (choose birth)
- **Resource loop**: each run earns **Souls (灵魂)**, spent in **Evil Crystal (邪晶)** for permanent upgrades

### 1.2 Core Loop

```
[Start] → SelectBirthOption → Choose region (Region)
  ↓
[Per turn] → ActionPoint (AP) → Event triggered → Combat/Choice/Rest
  ↓
[Per year] → TimeFlow / YearPass → Year-end event
  ↓
[Clear] → Kill Demon King (KillDemonKingAtAge) → Souls settled
  ↓
[Reincarnate] → Spend Souls on Evil Crystal → New cycle
```

### 1.3 Currency Tiers

| Currency | Scope | Earned by | Spent on |
|---|---|---|---|
| `Gold` (金币) | In-run | Combat, gold mine events, fishing | Shops, items, repairs |
| `Souls` (灵魂) | Cross-run | End-of-run settlement, soul grave, ad boost | Evil Crystal upgrades |
| `EvilCrystal` (邪晶) | Meta (permanent) | Souls → EC conversion (`EvilCrystalValueChange`) | Permanent stat boosts |
| `AdventureActionPoint` (AP) | Per turn | Reset to max each turn | Each action consumes 1 AP |

### 1.4 Core System List (67 game classes)

> For full class catalog, see `il2cpp_extracted.md` (in original game folder). Web rebuild can simplify.
> Live-instance counts per class are in `dump_inventory.md` §2.1.

| System | Key Class | What it does |
|---|---|---|
| **Character** | `Hero`, `Player`, `Character`, `CharacterManager` | Main character state |
| **Partner** | `PartnerTeam`, `PartnerSkill`, `BattleFiledPartner` | Companions in battle |
| **Enemy** | `Monster`, `Creature`, `BattelCreature` | Enemies (the spelling is a dev bug) |
| **Combat** | `BattleCommander`, `BattleFightPanel`, `CreatureBuffManager` | Battle loop |
| **Skill** | `Skill`, `SkillGenerator`, `SkillTreePanel` | Active abilities |
| **Talent** | `HeroTalent`, `HeroTalentBox`, `HeroTalentGenerator` | Passive traits (see `extracted_game_data.md` §2) |
| **Equipment** | `Equipment`, `EquipmentContainer`, `EquipmentGrid` | Gear (see `extracted_game_data.md` §3) |
| **Artifact/Relic** | `Artifact`, `Relic`, `RelicBackpack` | Permanent items (see `extracted_game_data.md` §3) |
| **Buff** | `Buff`, `BuffDisplay`, `BasicBuffs` | Status effects (see `extracted_game_data.md` §1) |
| **Region/Map** | `Region`, `GameRegionManager`, `MapArea*` | World map |
| **Event** | `GameEvent`, `BattleEvent`, `ChestEvent`, `RestEvent`, `StoryEvent` | All events (XNode graph) |
| **Shop** | `Store`, `GroceryStore`, `PotionShop`, `FishStore` | NPC commerce |
| **Fishing** | `FishArea`, `FishBar`, `FishField` | Minigame |
| **Time** | `TimeSystem`, `TimeFlowPanel`, `DiscreteTime`, `AgeStage` | Year/age system |
| **Achievement** | `Achivement` (spelling bug), `AchivementManager` | Unlockables (see `extracted_game_data.md` §6) |
| **Evil Crystal** | `EvilCrystal`, `EvilCrystalUpgrade` | Meta progression |
| **Difficulty** | `CrulWorld` / `CruelWorld` (both spellings exist) | Hard mode (see `extracted_game_data.md` §6) |
| **Ending** | `EndingEventDirector`, `PrePareEndingEvent` | 5+ endings (see `extracted_game_data.md` §6) |

### 1.5 Talent System (Wave 3)

- **Generator**: `HeroTalentGenerator @ 0xB3B2F8` (all 35 talents in one method)
- **Pool size**: 35 talents total
- **Selection mechanism**: **Random roll from pool, no prerequisite tree**
- **Rarity system**: All 35 talents are `神话` (Mythic) rarity, but **different rarity sub-types exist** with different probability weights (per user note, 2026-6-10)
- **Implementation for web rebuild**:
  - Use `Math.random()` weighted selection
  - Suggested weight buckets (tune from feel):
    - Common (D-tier): 50% (e.g. 强壮D, 敏捷D, 坚韧D)
    - Uncommon (A-tier): 30% (e.g. 强壮A, 敏捷A, 坚韧A)
    - Rare (special): 15% (e.g. 剑之勇者, 盾之勇者, 死亡回归)
    - Legendary: 5% (e.g. 天才大脑, 有点小帅, 神之子, 母胎单身二十年)
  - Apply effects on level-up or on birth (per `InitAllHeroTalent`)
  - See `game_complete.md` §HERO TALENTS for full 35-talent list with effects

### 1.6 Fishing Minigame (Wave 3, per user note 2026-6-10)

**Mechanic** (described by user):
- **Vertical bar** displayed on screen
- A **green-highlighted area** inside the bar (the "target zone")
- An **indicator (cursor)** oscillates left↔right (bouncing), speed is fast and constant
- Player must **click to stop** the indicator
- **Result**:
  - If indicator stops **inside green zone** = successful catch
  - If outside = miss
- **Catch rarity** depends on how centered the stop is in the green zone (perfect center = best, near edge = good)

**Implementation for web rebuild** (PixiJS/Phaser):
- Vertical bar: 200px tall, 40px wide
- Green zone: 30px tall, position randomized each cast
- Indicator speed: ~600px/sec, oscillating
- Click anywhere on the bar to stop
- Reward: rarity tier × difficulty stat (see `data/RelicSettingJS.json` fishing relics)

**Relics affecting fishing** (from `data/RelicSettingJS.json`):
- "Fishing Pro" (钓鱼达人): -0.15 difficulty, +income
- "Fishing Expert" (钓鱼好手): -0.3 difficulty
- "Legend Reward" (传奇奖励): unlocks highest-tier fish

**Related classes**: `FishArea`, `FishBar`, `FishField`, `FishStore`

---

## 2. Player / Monster Stats

### 2.1 Hero Stats (16 base + 9 derived)

#### Base stats (16)
| Stat | Chinese | Range | Effect |
|---|---|---|---|
| `Brave` (勇猛) | 勇猛 | 0-∞ | → base attack |
| `Dexterity` (灵巧) | 灵巧 | 0-∞ | → base attack speed |
| `Constitution` (体质) | 体质 | 0-∞ | → max HP, regen |
| `Intelligence` (智力) | 智力 | 0-∞ | → skill level cap, magic |
| `Charisma` (魅力) | 魅力 | 0-∞ | → relationship, NPC interactions |
| `FamilyWealth` (家境) | 家境 | 0-∞ | → gold per turn, NPC tier |
| `Souls` (灵魂) | 灵魂 | 0-∞ | cross-run currency (see `extracted_game_data.md` §6) |
| `MaxAge` | — | 50-100 | target age to defeat Demon King |
| `LifeEscape` (死里逃生) | 死里逃生 | 0-∞ | death-cheat counter |
| `Stamina` (体力) | 体力 | 0-∞ | maze exploration |
| `RareEquipLuck` (装备幸运值) | 装备幸运值 | 0-∞ | drop rate bonus |
| `ArtifactChoice` (密藏中可选神器) | — | 0-∞ | ruin artifact count |
| `CruelWorldLevel` (残酷世界) | 残酷世界 | 0-10 | difficulty (see `extracted_game_data.md` §6) |
| `LockedTalents` | — | 0-2 | talents you keep across runs |
| `EvilCrystal` (邪晶) | 邪晶 | 0-∞ | meta currency |
| `RollTime` | — | int | reroll counter |

#### Combat stats (9 derived, from `CaculateBase*` methods) — ALL EXTRACTED (Wave 5)
| Stat | Chinese | Source method (RVA) | Formula |
|---|---|---|---|
| `attack` | 攻击 | `CaculateBaseAttack` (`0x00B36668`) | **`(每点力量攻击力Addition + 0.4 + cruelLevel) * Power + 5`** |
| `defence` | 防御 | `CaculateBaseDefence` (`0x00B36974`) | **`(每点体质防御力Addition + 0.5) * Constitution`** |
| `maxHealth` | 生命上限 | `CaculateBaseMaxHealth` (`0x00B368DC`) | **`(每点体质生命值Addition + 6.0) * Constitution`** |
| `criticalRate` | 暴击率 | `CaculateBaseCriticalRate` (`0x00B36A0C`) | **`(每点灵巧暴击率Addition + 0.002) * Agile`** |
| `dodge` | 闪避 | `CaculateBaseDodge` (`0x00B3670C`) | **`(每点灵巧闪避率Addition + 0.0) * Agile`** |
| `attackSpeed` | 攻速 | `CaculateBaseAttackSpeedInprove` (`0x00B367A4`) | **`(每点敏捷攻击速度提升Addition + 0.003) * Agile`** |
| `blockRate` | 格挡率 | `CaculateBaseBlockRateInprove` (`0x00B36840`) | **`(每点灵巧格挡率Addition + 0.003) * Agile`** |
| `expGain` | 经验获取 | `CaculateBaseExpGainImprove` (`0x00B36AA8`) | **`(每点智力经验值提升Addition + 0.035) * Wisdom`** |
| `relationshipGain` | 关系收益 | `CaculateBaseRelationshipGainImprove` (`0x00B36BE8`) | **`(每点魅力好感度获取提升Addition + 0.02) * Charm`** |

> **Wave 5 update**: All 9 `CaculateBase*` methods decompiled. The pattern is identical: `stat = (Addition + const) * baseStat`. The `const` per method: 0.4 (atk), 0.5 (def), 6.0 (hp), 0.002 (crit), 0.0 (dodge), 0.003 (atk speed & block), 0.035 (exp gain), 0.02 (relationship). For the full decompiled C + constants, see `ghidra_results.md` §1.

### 2.2 Hero fields (used in events)

- `currentHealth` (当前生命) - int
- `level` (等级) - int, cap from `CaculateNewMaxExp` (RVA 0x00B39D30)
- `currentExp` (当前经验) - int
- `attackStatEventList` (攻击事件列表) - list of StatEvents
- `statEventList` / `BattleStatEventList` - status events
- `currentEffectivePartner` (当前出战伙伴) - object
- `currentGameTalents` (本局天赋) - list of Talent
- `currentRegionDisplay` (所在区域) - object
- `currentActiveStoryLins` (当前活跃故事线) - list
- `isGameOver` (死亡旗) - bool
- `currentActionPoint` (行动点) / `AdventureActionPoint` - int

### 2.3 Monster Stats

**Class**: `Monster : Creature` (RVA 0x00B0A790 for `CaculateCurrentHealthRate`)

| Field | Effect |
|---|---|
| `name` (名字) | localizable string |
| `level` (等级) | int, scales with player |
| `maxHealth` (生命) | int |
| `attack` (攻击) | int |
| `defence` (防御) | int |
| `speed` (速度) | float |
| `criticalRate` (暴击率) | float 0-1 |
| `blockRate` (格挡率) | float 0-1 |
| `dodge` (闪避) | float 0-1 |
| `skills` (技能列表) | list |
| `stunt` (必杀技) | `CreatureSkillStunt` |
| `stuntDiscript` (必杀描述) | string |
| `expReward` (经验奖励) | int |
| `goldReward` (金币奖励) | int |
| `soulReward` (灵魂奖励) | int (推: `CaculateGainSoulNum`) |
| `appearingRegion` (出现区域) | `CharacterAppearRegion` |
| `lvl` / `rank` (稀有度) | int |
| `abilities` (技能) | list (see `extracted_game_data.md` §4 for examples) |

**Difficulty scaling**: `EnemyLevel = playerLevel ± variance`, controllable via `monsterLevelInptuField` (debug).

### 2.4 Partner (伙伴) — simplified

- `BattleFiledPartner` / `PartnerTeam`: list of 0-N active partners
- `CanBePartner`: bool flag
- `PartnerSkill`: active ability on partner
- Limit: `CheckCurrentBattlePartnerOutOfLimit`

---

## 3. Events & Game Flow

### 3.1 Event System (XNode-style)

The game uses a graph-based event system. For web rebuild, use a JSON-driven event tree:

```typescript
interface EventNode {
  id: number;
  type: 'battle' | 'chest' | 'rest' | 'shop' | 'story' | 'switch' | 'result';
  text: string;
  ageRange?: [number, number];  // e.g. [11, 14]
  conditions?: Condition[];      // gate execution
  options?: EventOption[];        // player choices
  next?: number | ConditionSwitch;
}

interface ConditionSwitch {
  condition: string;  // 'motherAlive', 'playerClass', 'ageInRange', ...
  branches: { ifTrue: number; ifFalse: number; default: number; };
}
```

### 3.2 Event Types (count from extracted data)

> Counts cross-verified by counting MonoBehaviour script-PathID stubs in `Dump/MonoBehaviour/` (see `dump_inventory.md` §2.2).

| Type | Count | Effect |
|---|---|---|
| `BattleEventNode` (战斗) | 167 | triggers combat, list of monsters |
| `ChestEventNode` (宝箱) | 45 | gives item/gold/relic |
| `RestEventNode` (休息) | 23 | recover HP, get buff |
| `GreatCollectionNode` (大收藏) | 15 | ruin boss, artifact reward |
| `MainEventNode` (主事件) | 417 | narrative text + branches |
| `EventResultNode` (结果) | 526 | player choice with branches |
| `StoryLineNode` (故事线) | 83 | age-ranged story arcs |
| `EventLineInfoNode` (故事线信息) | 22 | NPC storylines |
| `ConditionSwichNode` (条件分支) | 69 | 7-branch switches |
| `ConditionCheckerNode` (条件检查) | 52 | boolean checks |
| `MapObjectNode` (兴趣点) | 25 | map points of interest |
| `MapAreasNode` (大区域) | 6 | map regions |
| `CharacterInfoNode` (NPC) | 5 | NPC configs |

### 3.3 Per-Turn Event Flow

```
[Turn start]
  ↓
CheckOneTurnActivity → query this turn's activities
CheckOneTurnEventStatCount → count event stats
  ↓
ShowThisTurnEvent → display event
  ↓
Event type branch:
  ├ Battle → BattleBeggin → WinBattle/LoseBattle → settle XP/gold/drops
  ├ Shop → ShowStoreDisplay → BuyCommody
  ├ Chest → ChestEvent → GetArtifact/GetRelic/gold
  ├ Rest → RestEvent → heal/buff
  ├ Story → ContinueEvent → SuperLinkEventDic → next node
  └ Goddess → Godness → trigger goddessWord
  ↓
ShowIdieEventContent / ShowIdieEventResult (when idle)
  ↓
GainSoulRestTime (offline soul regen)
IsTakeRelic → take relic decision
CheckHealthEnough → HP check
  ↓
Turn end:
  ComsumAdventureActionPoint (consume 1 AP)
  YearPass (advance year if needed)
  EndEventYearPass (year-end event)
  ClearCurrentTurnEvents
  CheckAchivementIsAchiveThisTurn
```

### 3.4 Meta Progression Flow

```
[Game over] → GameResultPanel
  ↓
ComfirmGainSoulPanel → confirm soul gain
ShowGainSoulAds → 2x with ad (skip for web)
  ↓
[Evil Crystal]
  ├ EvilCrystalValueChange → EC = souls
  ├ EvilCrystalGrow / GrowSpeed → passive growth
  ├ EvilCrystalUpgrade → permanent stat boost
  └ AllResetEvilCrystal → reset option
  ↓
[Next run]
  SelectBirthOptionPanel → choose birth
  FirstTimeSeeGodnessSelectBirthOptionPanel → first time
  ↓
[Cruel World]
  CrulWorldIsOpen → toggle
  CurrentCrulLevel / MaxCruelLevel → level
  CrulWordToggle → toggle word modifiers
```

### 3.5 5 Worlds + 3 Final Stages (extracted structure)

> **See `extracted_game_data.md` §4 for the full monster list with abilities per world.**

| World | graph_pid | Core monsters | Final boss |
|---|---|---|---|
| **矿山 (Mine)** | 13857 | 哥布林, 地精, 岩石怪, 宝地精 | 地龙王 奥凯 (钻石鳞片, <100 减半) |
| **精灵之森 (Elven Forest)** | 13858 | 精灵, 小精灵, 树精, 巨人 | 堕落精灵女王 卡拉 (召唤小精灵+全体治疗) |
| **迷雾森林 (Misty Forest)** | 13859 | 野猪, 哥布林, 莱? | — |
| **兽人山脉 (Orc Mountain)** | 13860 | 兽人, 兽人战士, 地狱犬, 牛头人 | 剑圣 卡里摩多 / 牛头将军 |
| **墓地/魔域 (Cemetery)** | 13861 | 骷髅, 幽灵, 僵尸, 吸血鬼 | 骑士团长 卡拉多格 / 魔将 卜里奥 |

**3 Final Boss stages**:
- 魔王I (史莱姆形) - 再生, 急速成长
- 魔王II (史莱姆形) - 崩坏, 多重拟态
- 魔王眷属 - 极再生 3%/秒

---

## 4. Game Formulas

### 4.1 Combat Formulas (extracted via Ghidra, Wave 5)

> **All formulas below are extracted from `libil2cpp.so` via Ghidra decompilation** — see `ghidra_results.md` for the decompiled C and the raw `.data` constants. Image base 0, so all addresses are real.

**Hero base stats** (the `(每点XxxAddition + const)` pattern repeats for all derived stats):
```
attack      = (每点力量攻击力Addition + 0.4  + cruelLevel) * Power + 5
defence     = (每点体质防御力Addition + 0.5)                * Constitution
xpToNext    = (int)(level^1.25 * 100)                       // C_XP_MUL
souls/run   = (reincTime * 10 + 200) + (level+1) * ((baseSoul + allHeroSoul) * 0.01)
            = min(souls, 20000)                             // C_SOUL_MUL
```

The `Addition` fields (`每点力量攻击力Addition` etc.) are public fields of `GameConst` — they default to `0.0` in the .ctor and get **summed by talent/relic effects at runtime** (e.g. talent `攻击力+10%` adds `0.1` to `每点力量攻击力Addition`). The `Total` getters add the `.data` constant (e.g. `Addition + 0.4`). For the unbuildable default hero (no talents), `Addition = 0` everywhere.

The `+0.4` and `+0.5` and `+1.35` etc. are hardcoded IEEE 754 doubles in the `.rodata`/`.got` sections (see `ghidra_results.md` §6 for the full table). They're not affected by talent/relic effects — only the `Addition` parts are.

**Monster scaling** (`Monster_SetLevel @ 0x00A9F1C0`):
```
monsterAttack = baseAttack * (cruelLevel + (pow(level, attackExponent) * 0.15 * (level+1)) / 10 + 0.9)
monsterHealth = baseHealth  * (cruelLevel + (pow(level, healthExponent)  * 0.15 * (level+1)) / 10 + 0.9)
```
where:
- `attackExponent = GameConst.怪物攻击每级属性提高Addition + 1.35`
- `healthExponent = GameConst.怪物生命每级属性提高Addition + 1.35` (different Addition field, same +1.35 base)
- `cruelLevel` = `GameManager.cruelLevel` (0-10, from Cruel World toggle; **0 if CW is off**)
- `0.15` is `DAT_018eea08`, `0.9` is `DAT_018fc198`, `1.35` is `DAT_018fc8e8`
- `baseAttack` / `baseHealth` are the monster's natural stats set by `MonsterGenerater` (per-species; **all 58 monsters extracted in Wave 6 — see `ghidra_results.md` §11**; note: **all monsters have 0 base defence** — defence stat is unused in damage calc)

**Damage flow** (per hit, in `BattleCommander.tryDoDamage` @ 0x00CF0E88):
```js
defFactor   = pow(1.0147, defender.defence / -1.3)     // 1.0147 = DAT_018fe764, -1.3 = DAT_018fe760
reduction   = 1 / (defFactor + 1) - 0.5                 // 0.0 at def=0, increases with def
dmg         = attacker.attack * (1 - 1.5 * reduction)  // atk multiplied by damage-pass%
if random() < attacker.criticalRate: dmg *= (attacker.criticalDegree + 2.0)  // default 2.0x; +0.2 talent = 2.2x
if dmg < 1: dmg = 1                                     // hard floor of 1
if random() < defender.blockRate:   dmg *= (1 - 0.4)    // 60% damage on block (blockDmgReduction = 0.4)
return dmg
```
Reduction curve (no crit, no block): def 0→100%, def 10→96%, def 50→79%, def 100→62%, def 200→44%, def 500→25%. Dodge is **not** applied here (it's encoded in `AttackData.IsBlock` path, not as a separate `IsDodge`).

**Regen / per-turn HP**:
```
hpRegen = maxHealth * (baseRegen% + talent_bonus% + buff_bonus%)
lifeEscape回复 = maxHealth  (when LifeEscape > 0; on-death cheat)
```

**Crit/Block/Dodge stacking** (final = base + additive bonuses, then clamp 0-1):
```
finalCritRate   = baseCrit   + talentCrit   + buffCrit              // clamp 0-1
finalBlockRate  = baseBlock  * (1 + improve_sum)                    // multiplicative
finalDodge      = baseDodge  + equipDodge
finalAtkSpeed   = baseSpeed  * (1 + improve_sum)                    // 1.0 = 1 attack/sec
```

**Buff stacking rules** (10 buff types; see `extracted_game_data.md` §1 for full per-buff formulas):
- 强化 (Strengthen): +5% damage per stack, max 10 stacks
- 急速 (Haste): +5% attack speed per stack, max 10 stacks
- 愤怒 (Fury): +5% attack speed + 5% damage per stack (no max)
- 抵御 (Guard): +3% defense per stack, max 10 stacks
- 迟缓 (Slow): -5% attack speed per stack, max 10 stacks
- 中毒 (Poison): lose `stack` HP per second
- 流血 (Bleed): reduce healing received, decays per second
- 灼烧 (Burn): lose HP% every 3 seconds, decays
- 眩晕 (Stun): cannot act
- 破甲 (Armor break): reduces defense
- 易伤 (Vulnerable): takes more damage

```
中毒 tick:   lose = stack
流血 decay:  heal *= 0.5,  stack -= 1/s
灼烧 tick:   lose = maxHP * (0.05 * stack), stack -= 1/3s
```

### 4.2 Stat Growth (all 9 `CaculateBase*` methods extracted)

> **All 9 formulas extracted via Ghidra (Wave 5)**. Pattern: `stat = (GameConst.每点XxxAddition + const) * baseStat + floor`.

| Method | RVA | Formula | Status |
|---|---|---|---|
| `CaculateLevelBuff` | `0x00B36660` | (level → list of level-threshold buffs) | decompiled, not analyzed |
| `CaculateBaseAttack` | `0x00B36668` | **`(每点力量攻击力Addition + 0.4 + CW) * Power + 5`** | ✅ |
| `CaculateBaseDodge` | `0x00B3670C` | **`(每点灵巧闪避率Addition + 0.0) * Agile`** | ✅ |
| `CaculateBaseAttackSpeedInprove` | `0x00B367A4` | **`(每点敏捷攻击速度提升Addition + 0.003) * Agile`** | ✅ |
| `CaculateBaseBlockRateInprove` | `0x00B36840` | **`(每点灵巧格挡率Addition + 0.003) * Agile`** | ✅ |
| `CaculateBaseMaxHealth` | `0x00B368DC` | **`(每点体质生命值Addition + 6.0) * Constitution`** | ✅ |
| `CaculateBaseDefence` | `0x00B36974` | **`(每点体质防御力Addition + 0.5) * Constitution`** | ✅ |
| `CaculateBaseCriticalRate` | `0x00B36A0C` | **`(每点灵巧暴击率Addition + 0.002) * Agile`** | ✅ |
| `CaculateBaseExpGainImprove` | `0x00B36AA8` | **`(每点智力经验值提升Addition + 0.035) * Wisdom`** | ✅ |
| `CaculateBaseRelationshipGainImprove` | `0x00B36BE8` | **`(每点魅力好感度获取提升Addition + 0.02) * Charm`** | ✅ |
| `CaculateCurrentHealthRate` | `0x00B0A790` | `currentHealth / maxHealth` (double) | ✅ |
| `CaculateNewMaxExp` | `0x00B39D30` | **`(int)(level^1.25 * 100)`** | ✅ |
| `CaculateGainSoulNum` | `0x00B06E34` | **`(reincTime*10+200) + (level+1)*((baseSoul+allHeroSoul)*0.01)`, cap 20000** | ✅ |
| `GainMoney` | `0x00B29F34` | **`((每点魅力金币获取提升Addition + 0.005) * Charm + 1.0) * value`** (×1.5 if 钓鱼/打工 + talent) | ✅ |
| `AddExp` | `0x00B39E00` | **`(int)((GetAllExpGainImprove + 1.0) * exp)`** | ✅ |

### 4.3 Buff System

> **10 buff types with full effect formulas** — see `extracted_game_data.md` §1.
> (Buff stacking rules + DoT math are also summarised in §4.1; see `extracted_game_data.md` for the canonical list.)

### 4.4 Action Point (AP) System

```
Each turn:
  1. AP = maxAP (reset)
  2. Each action consumes 1 AP
  3. CheckAdventureActionPointEnough → is AP sufficient?

AP=0 punishment:
  HealthConsumRateAfterActionPointRunOut → HP loss per turn
  HealthConsumRateAfterActionPointRunOutAddition → bonus
  HealthConsumRateAfterActionPointRunOutTotal → total loss

AP sources:
  - Wait (ActionPointRecover)
  - Rest event (RestEvent)
  - (Ad) GainActionPointByAds (skip for web)
```

### 4.5 Skill Formulas (3-level scaling)

> **See `extracted_game_data.md` §5 for all 20+ skills with Lv1/Lv2/Lv3 effects.**

Examples (already have the values):
- 格挡反击: 20%/23%/26% block→counter
- 旋风斩: 20%/30%/40% max HP sneak damage
- 双持: +20%/+25%/+30% attack, -20% speed
- 嘲讽: -20%/+23% / -30%/+40% / -40%/+55% enemy atk/speed
- 巨斧精通: 3%/6%/9% splash damage
- 盔甲精通: +4/+8/+13 defense

### 4.6 Souls & Evil Crystal (Wave 5: soul formula extracted)

```
Per-run souls (from ComfirmGainSoulPanel.CaculateGainSoulNum @ 0x00B06E34):
  reincTime    = AchivementManager.GetNextReincarnationTime()       // # reincarnations
  allHeroSoul  = AchivementManager.GetAllHeroAeroSoul()              // base aero soul from all heroes
  baseSoul     = manager.cachedSoulAtReincLevel                       // pulled from ManagerOfManagers internal cache
  currentLevel = GameManager.hero.Level
  souls = reincTime * 10 + 200 + (currentLevel + 1) * floor((baseSoul + allHeroSoul) * 0.01)
  souls = min(souls, 20000)                                          // hard cap
  // Triggered via "Gain Soul" ad-watched panel — web rebuild can treat as per-run-end reward

  lose: 50% of win amount (no per-monster formula in code; the 50% is in the panel flow, not in CaculateGainSoulNum)
  rest: GainSoulRestTime → offline/afk regen (separate method, not analyzed this pass)

Per-battle reward (from `AdventruePanel_c__DisplayClass32_0__WinBattle_b__8` @ 0x00C466C8 — Wave 6):
  expBase    = GameConst.经验获取基数Addition + 5   // default 5 (Addition = 0)
  goldBase   = GameConst.金币获取基数Addition + 8   // default 8 (Addition = 0)
  enemyLevel = AdventruePanel.getEnemyLevel()      // = AreaLevel + currentExploreStat - 1
  // Raw exp from battle event (mb_battle_events_full.json expReward field)
  expGained  = expBase * expReward * (enemyLevel + 1)
  // Raw gold from battle event (mb_battle_events_full.json goldReward field)
  rawGold    = floor((enemyLevel * 0.01 + 1.0) * goldReward * goldBase)
  // After battle-pass, the raw values then pass through GainMoney/AddExp for Charm & talent mods:
  finalGold  = (int)(((每点魅力金币获取提升Addition + 0.005) * Hero.Charm + 1.0) * rawGold)
  if (source == 钓鱼/打工 AND matching talent) finalGold = floor(finalGold * 1.5)
  finalExp   = floor((Hero.GetAllExpGainImprove() + 1.0) * expGained)
  // Crucially: cruelLevel does NOT multiply or add to expGained/rawGold. CW is stat-only.

Per-source XP gain (from HeroLevel.AddExp @ 0x00B39E00, for non-battle XP like event bonuses):
  exp          = base reward value
  gainedExp = (int)((Hero.GetAllExpGainImprove() + 1.0) * exp)
  // HeroLevel.CurrentExp += gainedExp; if (levelUp) show UpgradePanel

Cross-run Evil Crystal (Wave 6 schema extracted — `EvilCrystal` class @ 0x00B47270):
  fields:
    IsActive                 : bool
    IsGameVictory            : bool
    MaxValue                 : 100                       // hardcoded constant
    CurrentEvilCrystalLevel  : int                       // upgrade tier (0, 1, 2, ...)
    CurrentValue             : int                       // XP toward next level
    CurrentEvilCrystalEvent   : string                    // name of current active story
    CurrentEvilCrystalStoryLine : StoryLine ref           // live story being progressed
  operations:
    EvilCrystalValueChange(v)  : CurrentValue = max(0, min(CurrentValue + v, MaxValue))
    EvilCrystalGrow()          : CurrentValue += EvilCrystalGrowSpeedTotal (capped at MaxValue)
                                 + pushes current StoryLine into the active story list
    EvilCrystalUpgrade() / LevelUp()  : CurrentEvilCrystalLevel += 1; CurrentValue = 0
    IsFull()                   : MaxValue <= CurrentValue
    AllResetEvilCrystal()      : clears everything (level 0, value 0, MaxValue 100, no story)
  // The crystal just gates story unlocks — what each level *gives* lives in the 48 artifacts
  // and in relics with `AcquisitionMethod: Special` + `AcquisitionLimit: Once` (see artifact_complete.md).
  // Per-tick grow rate is `EvilCrystalGrowSpeedTotal` from GameConst (addition-based; default 0).
```

> **Save format**: complete schema extracted in `save_format.md` (Wave 5+). All `ISaveAndLoad` classes' `Save()` methods decompiled — 6 per-run keys + 1 cross-run key, AES-encrypted in Android internal storage. Web rebuild can skip the AES step and use the JSON schema directly with `localStorage`.

### 4.7 Age System

```
current_year = start_year + (elapsed_time / year_duration)
MaxAge = 50 + difficulty * 5 + talent_bonus
AgeStage = current_age / 10  (0=少年, 1=青年, 2=壮年, 3=中年, 4=老年)
KillDemonKingAtAge = MaxAge  (target: live to MaxAge and kill Demon King)

Year events:
  YearEvent → each year
  EndEventYearPass → year-end settlement
  YearPass → advance year
  AddYears → skip (剧情跳跃)
  BegginAge / BeggingAge → starting age
```

### 4.8 Equipment Generation (extracted via Ghidra, Wave 5)

> Full tables and constants in `ghidra_results.md` §3. The pipeline is in `AdventrueManager_generateEquipment @ 0x00C3CDC0` + `generateEquipmentProperty @ 0x00C3DB48`.

**Flow** (called whenever a battle drops equipment, ruin gives an artifact, or a shop sells one):
1. **Pick rarity** (Common/Uncommon/Rare/Epic/Legendary = 0/1/2/3/4) via weighted table (see below). The input `rarityLevel` is the LOWER BOUND (so a "rare" drop can still become epic+).
2. **20% chance to bump effective `level` by 1** before computing property values (so a `level=5` drop is treated as `level=6` about 1/5 of the time). This is what makes some items "feel stronger than their level".
3. **Compute each property value** via `generateEquipmentProperty(effectiveLevel, prop, slot)`.
4. **Pick random properties** from `model.RandomProperties` (the item's affix pool), filtered by `Hero.CheckPropertyAvalable` (keeps only properties the current hero profession can use). Pick `randomPropertyNum` of them.
5. **Build** the `Equipment` object via `EquipmentBuilder` with `MainProperty`+`value`, `SubProperty`+`value`, the random properties, and the chosen rarity.

**Per-(property, slot) magnitude formula** (the `±5%` outer variance applies to ALL properties):
```
value = Random.Range((level * minMul + maxAdd) * 0.95, (level * minMul + maxAdd) * 1.05)
```
The full `(property, slot) → (minMul, maxAdd)` table (13 properties × 3 slots, re-verified Wave 6 via `AdventrueManager_generateEquipmentProperty` @ 0x00C3DB48 — Crit Main, AtkSpeed Main, Atk Random corrected from prior hand-trace):
| Property (cn/en) | Random (mul, add) | Sub (mul, add) | Main (mul, add) |
|---|---:|---:|---:|
| 攻击 Attack | (0.02, 0.07) | (0.01, 0.025) | (0.04, 0.15) |
| 防御 Defence† | (level+1)\*0.95..1.05 | (level\*2+2)\*0.95..1.05 | (level\*4+4)\*0.95..1.05 |
| 暴击 CritRate | (0.005, 0.01) | (0.005, 0.02) | (0.01, 0.05) |
| 格挡 Block | (0.0075, 0.03) | (0.005, 0.015) | (0.015, 0.06) |
| 暴伤 CritDmg | (0.01, 0.05) | (0.01, 0.05) | (0.02, 0.1) |
| 生命 Health | (0.02, 0.1) | (0.04, 0.2) | (0.08, 0.4) |
| 闪避 Dodge | (0.005, 0.01) | (0.005, 0.02) | (0.01, 0.04) |
| 吸血 LifeSteal | (0.0025, 0.01) | (0.005, 0.02) | (0.01, 0.05) |
| 攻速 AtkSpeed | (0.006, 0.04) | (0.006, 0.02) | (0.01, 0.05) |
| 反击 Counter | (0.006, 0.02) | (0.008, 0.02) | (0.015, 0.05) |
| 溅伤 Splash | (0.005, 0.01) | (0.005, 0.02) | (0.01, 0.04) |
| 回复 Recovery | (0.35, 0.7) | (0.75, 1.0)\*0.95..1.05 | (1.5, 2.0)\*0.95..1.05 |
| 回复率 RecovRate | (0.35, 0.7) | (0.75, 1.0)\*0.95..1.05 | (1.5, 2.0)\*0.95..1.05 |

† **Defence is the only property using absolute level-based values** (level\*4+4, level\*2+2, level+1) instead of the percentage-of-level pattern. The ±5% still wraps it. **CritDmg** has identical Random and Sub values (both `(0.01, 0.05)`) — only Main is bigger. **AtkSpeed** has 3 distinct values per slot. Final formula: `value = Random.Range((level * minMul + maxAdd) * 0.95, (level * minMul + maxAdd) * 1.05)`.

**Rarity weight table** (5 entries, summed; weight 0 if negative):
```
weights[0] (Common)    = max(0, 85 - 25*rarityLevel - worldDifficulty)
weights[1] (Uncommon)  = max(0, 28 + 4*rarityLevel + worldDifficulty/6)
weights[2] (Rare)      = max(0, 15 + 6*rarityLevel)
weights[3] (Epic)      = max(0, 5  + 8*rarityLevel)
weights[4] (Legendary) = max(0, 7*rarityLevel)
// Random.Range(0, sum(weights)) picks the rarity.
// "rarityLevel" is the input parameter (the requested rarity floor).
// "worldDifficulty" is GameManager's current world difficulty (0 if you haven't enabled Cruel World).
```
For a typical mid-game drop with `rarityLevel=2` (rare target) and `worldDifficulty=0`:
- Common 35, Uncommon 36, Rare 27, Epic 21, Legendary 14 → total 133
- P(rare or better) = (27+21+14)/133 = **47%**, P(legendary) = **10%**

### 4.9 Shop Prices (extracted via Ghidra, Wave 5)

> Full table in `ghidra_results.md` §4. The 12 items and per-store discounts are all decoded from `GroceryStore.InitStore @ 0x00B36028`, `PotionShop.InitStore @ 0x00AA9324`, `FishStore.InitStore @ 0x00B273D8`.

**Base price formula** (from `Commody_InitCommody @ 0x00B081B0`):
```
basePrice = (250 + GameConst.CommodyRarityValueAddition) * (Rarity + 1)
basePrice = basePrice / 4    if relicType == 3
basePrice = basePrice        otherwise
// where Rarity is 0=普通, 1=稀有, 2=传说, 3=神话
// relicType: 0=食物, 1=药物, 3=special (food/medicine get full price)
```

**Per-item discount** (applied on top, from `Commody_GetPrice @ 0x00B08190`):
```
finalPrice = (int)((1.0 - this->Discount) * basePrice)
```

**Actual shop contents** (decoded from `PTR_StringLiteral_*` symbols; **todo had some misnames**):

**GroceryStore (杂货店)** — 7 items, store discount = 1.0 (no discount):
| Item (en/cn) | Rarity | relicType | basePrice† | finalPrice |
|---|---:|---:|---:|---:|
| Kingdom Map (王国地图) | 1 | 0 | 500 | 500 |
| Trekking Pole (登山杖) | 1 | 0 | 500 | 500 |
| Sleeping Bag (睡袋) | 2 | 0 | 750 | 750 |
| Refined Casual Wear (精致便衣)† | 1 | 0 | 500 | 500 |
| Travel Shoes (旅行鞋) | 1 | 0 | 500 | 500 |
| Pocket Watch (怀表) | 2 | 0 | 750 | 750 |
| Fishing Rod (钓鱼竿) | 1 | 0 | 500 | **250** (50% item-level discount) |

† The todo said "精致绑腿" but the actual binary has "精致便衣".

**PotionShop (药剂店)** — 3 items, store discount = 0.0 (no discount):
| Item (en/cn) | Rarity | relicType | basePrice† | finalPrice |
|---|---:|---:|---:|---:|
| Attack Potion (攻击药剂) | 1 | 1 | 500 | 500 |
| Agility Potion (敏捷药剂) | 1 | 1 | 500 | 500 |
| Endurance Potion (忍耐药剂)† | 1 | 1 | 500 | 500 |

† The todo said "防御药剂" but the actual binary has "忍耐药剂" (endurance/stamina potion).

**FishStore (渔具店)** — 2 items, all with built-in 30% discount (DAT_018fc1a4 = 0.7):
| Item (en/cn) | Rarity | relicType | basePrice† | finalPrice |
|---|---:|---:|---:|---:|
| Rose Fishing Rod (玫瑰鱼竿)† | 2 | 0 | 750 | **525** |
| Steel Stone Hook (钢石鱼钩)† | 2 | 0 | 750 | **525** |

† The todo said "木质钓鱼竿" and "钢制钓鱼竿" — the actual items are "玫瑰鱼竿" (Rose Fishing Rod) and "钢石鱼钩" (Steel Stone Hook).

† Price assumes `CommodyRarityValueAddition = 0` (no talent bonus). The actual formula multiplies `Addition` by `(Rarity+1)`.

**Stock refresh**: `Store.InitStore()` is called once at game start. `FishStore.InitStoreAtTurnBeggin()` exists but its body is **empty** (no per-turn restock). For the web rebuild, treat all shop stock as **fixed per game start**.

---

## 5. 5 Endings (from `extracted_game_data.md` §6)

| # | Ending | Chinese | Trigger | NPC | Reward |
|---|---|---|---|---|---|
| 1 | **慢生活** (Slow Life) | 慢生活 | 达成和露明娜的结局 | 露明娜 | 魅力:2 |
| 2 | **成为贵族** (Noble) | 成为贵族 | 达成和夏洛蒂的结局 | 夏洛蒂 | ? |
| 3 | **重建人类家园** (Rebuild) | 重建人类家园 | 达成重建人类家园结局 | — | 家境:2 |
| 4 | **天下无敌** (Strongest) | 天下无敌 | 达成世界最强结局 | — | ? |
| 5 | **真正的勇者** (True) | 真正的勇者 | 没有触发一次死里逃生通关 | — | ? |
| (bonus) | **如此老套?** (Beat King) | 如此老套？ | 击败了魔王 | — | 解锁残酷世界 |

**Cruel World difficulty unlocks** (残酷世界, extracted via Ghidra Wave 5 + 6):
- **Wave 6 finding**: `GameManager.cruelLevel` is a single integer (0, 1, 3, 5, 7, or 10 — the 5 selectable levels). It is **read in exactly 2 places** in the binary:
  1. `Hero_CaculateBaseAttack` @ 0x00B36668: `attack = (Addition + 0.4 + cruelLevel) * Power + 5` — adds `+cruelLevel` per Power point.
  2. `Monster_SetLevel` @ 0x00A9F1C0: `attack = base * (cruelLevel + (level-curve) + 0.9)` — adds `cruelLevel` to the multiplier (NOT multiplicative).
- So Cruel World makes both hero and monster stronger — it's a damage-rubberbanding system.
- 0-1: no reward / 死里逃生:1
- 3: 人类守卫者
- 5: 可以锁定两个天赋 (lock 2 talents)
- 7: 战神
- 10: 爱的战士
- **Crucially**: `GameManager_GainMoney`, `HeroLevel_AddExp`, and `CaculateGainSoulNum` do **NOT** read `cruelLevel`. The battle reward formulas (`exp = (expBase) * expReward * (level+1)`, `gold = floor((level*0.01+1.0) * goldReward * goldBase)`) are independent of CW. Higher CW = stronger monsters, same rewards.

---

## 6. Key Spelled-Wrong Class Names (dev bugs to be aware of)

If porting from the original code (e.g. via Frida or re-implementing from `il2cpp.cs`):

| Wrong | Right | Notes |
|---|---|---|
| `BattelCreature` | BattleCreature | 2 occurrences |
| `Caculate*` | Calculate | 17 method names |
| `Comsum*` | Consume | AP methods |
| `Comfirm*` | Confirm | UI panels |
| `CrulWorld` | CruelWorld | difficulty |
| `DeathEsecape` | DeathEscape | 5 occurrences |
| `Equpment*` | Equipment* | gear |
| `Achivement*` | Achievement* | 6 occurrences |
| `TravelBussinssMan` | TravelingMerchant | shop |
| `SuperLinkEventDic` | SuperLinkEventDict | event system |
| `ShowIdie*` | ShowIdle* | event display |
| `EvilCrystalCrisisStorise` | ...Story | meta event |
| `CaculateBase*Inprove` | ...Improve | talent scaling |

> For web rebuild, just use the correct spellings in your code.

---

## 7. Simplified Tech Stack (for web rebuild)

```
Frontend:    React / Vue / Svelte
Game engine: Phaser.js / PixiJS (2D) or Three.js (3D)
State:       Zustand / Redux / Pinia
Persistence: localStorage (skip the Android save system)
Multiplayer: skip (single-player only)
Backend:     none (or Node.js for cross-device save)

Data files (JSON):
  events.json         (1,477 XNode events, simplified)
  talents.json        (30 talents, see extracted_game_data.md §2)
  relics.json         (51 relics, IMPORT data/RelicSettingJS.json as-is)        ← Wave 2
  equipment.json      (26 items + property pools, IMPORT data/WeaponSettingJS.json as-is)  ← Wave 2
  artifacts.json      (40+ boss-drop items, see artifact_complete.md)
  monsters.json       (58 monsters, base atk/hp/atkInterval/crit from `ghidra_results.md` §11; abilities from extracted_game_data.md §4)
  skills.json         (20 skills, see extracted_game_data.md §5)
  buffs.json          (10 buff types, see extracted_game_data.md §1)
  endings.json        (5 endings + CW levels, see §5)
  npcs.json           (5 NPCs + 12 storylines)
  regions.json        (6 map regions + 5 worlds)
  event_deck.json     (4 card weights, IMPORT data/EventCardTypeSettingJS.json as-is)     ← Wave 2
  shop_prices.json    (12 items, 3 stores — hand-coded from formulas in §4.9)         ← Wave 5
  battle_events.json  (167 encounters, IMPORT data/mb_battle_events_full.json as-is) ← Wave 4
  map_objects.json    (25 map objects, IMPORT data/mb_map_objects.json)               ← Wave 4
  xnode_texts.json    (1,477 nodes / 5,383 strings, IMPORT data/xnode_texts.json)     ← Wave 4
  conditions.json     (69 condition switches, IMPORT data/mb_condition_switches.json) ← Wave 4
```

### Suggested implementation order

1. **State machine** for turn/year (basic loop)
2. **Stat system** (16 base + 9 derived [see §2.1]; derived stats use formulas from `ghidra_results.md` §1)
3. **Combat engine** (damage formula + crit/block/dodge + buffs — use §4.1 values)
4. **Event system** (event graph, simplified to JSON)
5. **Talents** (apply stat mods on level-up, see extracted_game_data.md §2, talent mechanic §1.5)
6. **Fishing minigame** (vertical bar mechanic, see §1.6)
6. **Relics + Equipment** (IMPORT `data/RelicSettingJS.json` + `data/WeaponSettingJS.json`, see §3a/§3b — these are the canonical balance dataset; write a small `RelicEffect`-string parser that splits on `;` and `:`)
   - Equipment property values are now **deterministic from `level*minMul + maxAdd` ± 5%** (see §4.8). Use this instead of hand-tuned affix magnitudes.
   - Equipment rarity rolls use the 5-entry weighted table in §4.8.
7. **Boss-drop artifacts** (special-effect items, see `artifact_complete.md` — hand-coded combat-tick behaviours)
8. **Monsters** (58 enemies with abilities, see `ghidra_results.md` §11 for full base stat table + extracted_game_data.md §4 for abilities). Monster atk/hp scale with player level per §4.1.
9. **Skills** (20 skills, 3 levels each, see extracted_game_data.md §5)
10. **Map** (6 regions, 5 worlds, transition logic)
11. **Adventure deck** (IMPORT `data/EventCardTypeSettingJS.json` — weighted roll for monster/elite/smith/merchant, see extracted_game_data.md §4b)
12. **Shops** (12 items across GroceryStore/PotionShop/FishStore, prices from §4.9 — stock is fixed per game start, no per-turn refresh)
13. **Endings** (5 endings + CW levels, see §5; CW damage multiplier from §4.1)
14. **Skipped systems** (audio/animation/icons/save) — see §9
15. **UI panels** — see `UI_DESIGN.md` for the extracted `FDPanel` layout (title screen, goddess scene, in-game map, combat, settings, game-over). Each panel = one DOM view mounted via a `panelStack`.

### Wave 5 quick-reference: formula values to hardcode

For lazy devs, the absolute minimum set of constants to hardcode (assuming `Addition = 0` everywhere):

```js
// Hero
const HERO_ATK_PER_POWER     = 0.4;    // + cruelLevel
const HERO_ATK_FLOOR         = 5;
const HERO_DEF_PER_CONST     = 0.5;

// XP
const XP_CURVE_MUL           = 100.0;  // MaxExp = (int)(level^1.25 * 100)

// Souls
const SOUL_MUL               = 0.01;   // souls = ... + (level+1) * ((baseSoul + allHeroSoul) * 0.01), cap 20000

// Battle rewards (Wave 6)
const BATTLE_EXP_BASE        = 5;      // 经验获取基数Addition + 5
const BATTLE_GOLD_BASE       = 8;      // 金币获取基数Addition + 8
const BATTLE_GOLD_LV_BONUS   = 0.01;   // gold = floor((level*0.01 + 1.0) * goldReward * goldBase)

// Monster
const MON_ATK_SPEED          = 0.15;
const MON_BASE               = 0.9;
const MON_EXP_BASE           = 1.35;   // attackExp = healthExp = Addition + 1.35

// Damage formula (Wave 6)
const DMG_DEF_K              = 1.0147; // pow(K, def/-1.3)
const DMG_DEF_X              = -1.3;
const DMG_REDUCTION_MUL      = 1.5;    // atk * (1 - 1.5 * reduction)
const DMG_BLOCK_REDUCTION    = 0.4;    // block: dmg *= (1 - 0.4) = 0.6x
const DMG_MIN                = 1;

// Talent roll (Wave 6)
const TALENT_SOUL_BASE       = 70;     // soulCost = rollCount * 70 - 40
const TALENT_SOUL_OFFSET     = 40;
const TALENT_SOUL_CAP        = 250;
// 5-rarity dynamic weights: Common=60-2n, Uncommon=50-n, Rare=40-n/2, Epic=20+n/3, Leg=10+n; n=(lifetime+roll)*4

// EvilCrystal (Wave 6)
const EVIL_CRYSTAL_MAX       = 100;    // hardcoded MaxValue per level

// Shop
const SHOP_PRICE_BASE        = 250;    // price = 250 * (Rarity+1) [/4 if relicType==3]
const FISH_STORE_DISCOUNT    = 0.7;    // 30% off
const FISHING_ROD_DISCOUNT   = 0.5;    // 50% off (per-item)

// Equipment
const EQUIP_VAR              = 0.05;   // ±5% outer variance
const RARITY_UPGRADE_CHANCE  = 0.2;    // 20% chance to bump level by 1
// Per-(property, slot) minMul+maxAdd table — see §4.8
```

For the per-talent `Addition` values (the actual numbers from `extracted_game_data.md` §2 like `+10%` attack → `0.1` to `每点力量攻击力Addition`), see that file's talent list.

---

## 8. Cross-References

- **`ghidra_results.md`** — **Decompiled formulas + `.data` constants from `libil2cpp.so` (Wave 5 + 6)**. Source of truth for §4.1, §4.2, §4.6, §4.8, §4.9 in this guide. Read FIRST if you want exact numbers.
- **`save_format.md`** — **Complete save file schema (Wave 5+)**. All 6 per-run save keys + 1 cross-run key, with the field list of every Saver class. Schema extracted via Ghidra decompilation of every `ISaveAndLoad.Save()` method. No rooted device needed.
- **`UI_DESIGN.md`** — **Extracted UI layout / panel flow**. Every `FDPanel` class (title `LoadScene`, goddess `SelectBirthOptionPanel`, in-game `MapAreaPanel` / `AdventruePanel` / `EventDisplayPanel` / `BattleFightPanel`, modals) with field list, wireframe, and web-rebuild mapping. Source: `il2cpp.cs` lines (referenced in the doc).
- **`extracted_game_data.md`** — All decoded game data (talents, items, monsters, skills, buffs, achievements, equipment, event-deck, Wave 3 counts)
- **`dump_inventory.md`** — Catalogue of the 11,271 `Dump/*` files; what each bucket gives the rebuild
- **`wave3_extraction.md`** — UnityPy pipeline + per-output schemas
- **`extraction_wave4.md`** — TypeTree dump pipeline + per-output schemas
- **`game_complete.md`** — enums + 15 skills + 15 buffs + 35 talents + equipment formulas (Wave 3, supplemented by Wave 5)
- **`artifact_complete.md`** — 48 boss-drop artifacts full reverse (Wave 3)
- **`data/RelicSettingJS.json`** — Canonical 51-relic dataset (Wave 2)
- **`data/WeaponSettingJS.json`** — Canonical 26-equipment dataset (Wave 2)
- **`data/EventCardTypeSettingJS.json`** — Canonical 4-card adventure-deck weights (Wave 2)
- **`data/monoscript_catalog.json`** — Authoritative 780-entry PathID → Class map (Wave 3)
- **`data/monobehaviour_index.json` + `monobehaviour_blobs.bin` + `monobehaviour_blobs_index.json`** — 10,246 MB records + 2.34 MB raw tails (Wave 3)
- **`data/monobehaviour_strings.json`** — 8,310 CJK strings recovered from MB blobs (Wave 3)
- **`data/battle_events.json`** — 164/167 structured BattleEventNodes with world + monster slots (Wave 3)
- **`data/mb_battle_events_full.json`** — 167 BattleEventNodes with full field decode (Wave 4)
- **`data/mb_map_areas.json` / `mb_map_objects.json` / `mb_condition_switches.json`** — Map + condition data (Wave 4)
- **`data/xnode_texts.json`** — 1,477 XNode nodes, 5,383 clean Chinese strings (Wave 4)
- **`data/{sprite,texture2d,animationclip,audioclip,animator,animatorcontroller}_index.json`** — Built-in asset metadata (Wave 3)
- **`chinese_strings.txt`** — Raw 1,834 Chinese strings (for any text not in extracted_game_data)
- **`extraction_summary.md`** — How data was extracted, what was discovered
- **`todo.md`** — What's still missing (mostly minor sub-items after Wave 5+)

---

## 9. Skipped / Simplified Systems (Web Rebuild Decisions)

### 9.1 Audio
- **Decision**: no audio

### 9.2 Animations
- **Decision**: **Use simple sprite transitions** (no skeletal anim)
- **Source data**: `Dump/AnimationClip/` (6 keyframe clips) + `Dump/Animator/` (24 controller refs)
- **Why skipped**: Animations are state-machine heavy in Unity, costly to port; web rebuild can use sprite-frame swaps
- **Replacement**: Use fade-in/out, slide-in transitions, simple tweening etc.

### 9.3 Icons / Sprites
- **Decision**: **Use emoji or color-coded cards** for items
- **Source data**: `Dump/Sprite/` (568 sprite rect/atlas refs) + `Dump/Texture2D/` (200+ textures)
- **Why skipped**: Pixel data lives in `resources.assets.resS` (not exported as PNG); recreating sprites is expensive
- **Replacement**:
  - Equipment rarity → color (gray/blue/purple/orange/red for 普通/稀有/史诗/传说/神话)
  - Item type → emoji (⚔️ weapon, 🛡️ armor, ⛑️ helmet, 💍 accessory)
  - Use existing Unicode icons for relics/artifacts

### 9.4 Save System
- **Decision**: **Use localStorage** with simplified schema

### 9.5 Server / Multiplayer
- **Decision**: **Single-player only** (no backend)

### Models
- **Decision**: **2D pixel art or icon-based** for all sprites

### 9.7 Localization
- **Decision**: **Translate the simplified chinese to Traditional chinese**
- **Source data**: `Dump/TextAsset/Zh.txt` is mojibake; use `chinese_strings.txt` (1,834 strings) and `data/monobehaviour_strings.json` (8,310 CJK strings) instead

### 9.8 Multi-stage boss fight difficulty curve
- **Decision**: the 2 true final bosses (pid 13989, 14504 — 魔王I/II) ship with the same scaling as elite bosses
