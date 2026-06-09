# 异世轮回录 (Otherworld Samsara Record) — Web Rebuild Guide

> **Source**: Unity 2019.4.17 + IL2CPP (`libil2cpp.so` + `global-metadata.dat`) + AssetStudio dump of `data.unity3d` (Wave 2, 2026-6-9)
> **Purpose**: Game-design reference for building a simpler web-based version
> **Files in this dir**:
> - `rebuild_guide.md` (this file) — game design & systems
> - `extracted_game_data.md` — decoded game data (talents, items, monsters, skills, buffs, achievements, endings, equipment, event-deck)
> - `dump_inventory.md` — catalogue of the 11,271 `Dump/*` files by bucket
> - `chinese_strings.txt` — raw 1,834 Chinese strings from `global-metadata.dat`
> - `extraction_summary.md` — what was extracted & how
> - `data/RelicSettingJS.json` — canonical 51-relic balance dataset
> - `data/WeaponSettingJS.json` — canonical 26-equipment dataset
> - `data/EventCardTypeSettingJS.json` — canonical 4-card adventure-deck weights
> - `final_extract.py` — Python script that re-runs the metadata scan

---

## 0. Quick Start (How to use this guide)

This is a **design reference**, not a tutorial. For a web rebuild:

1. **Core loop** (read §1) → implement the basic turn/state machine
2. **Stats system** (read §2) → implement 6 base stats + 5 derived combat stats
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

---

## 2. Player / Monster Stats

### 2.1 Hero Stats (16 base + 5 derived)

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

#### Combat stats (5 derived, from `CaculateBase*` methods)
| Stat | Chinese | Source field | Effect |
|---|---|---|---|
| `maxHealth` | 生命上限 | `CaculateBaseMaxHealth` (RVA 0x00B368DC) | HP cap |
| `attack` | 攻击 | `CaculateBaseAttack` (RVA 0x00B36668) | damage output |
| `defence` | 防御 | `CaculateBaseDefence` (RVA 0x00B36974) | damage reduction |
| `attackSpeed` | 攻速 | `CaculateBaseAttackSpeedInprove` (RVA 0x00B367A4) | attacks/sec |
| `criticalRate` | 暴击 | `CaculateBaseCriticalRate` (RVA 0x00B36A0C) | crit chance |
| `blockRate` | 格挡率 | `CaculateBaseBlockRateInprove` (RVA 0x00B36840) | block chance |
| `dodge` | 闪避 | `CaculateBaseDodge` (RVA 0x00B3670C) | dodge chance |
| `hpRegen` | 生命回复 | `CaculateBaseExpGainImprove` (RVA 0x00B36AA8) | HP regen/turn |
| `expGain` | 经验获取 | (same RVA) | XP multiplier |
| `relationshipGain` | 关系收益 | `CaculateBaseRelationshipGainImprove` (RVA 0x00B36BE8) | NPC affinity gain |

> **NOTE on formulas**: The RVAs above are IL2CPP invoker stubs (not actual formula code). For real game values, the talent descriptions in `extracted_game_data.md` §2 give concrete numbers (e.g. `+10%` attack, `+20%` speed). For the actual `lvl * X` multipliers, see `todo.md` §1.

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

### 4.1 Combat Formulas (recovered + speculated)

```
Damage:
  base_dmg = max(attacker.atk - defender.def * 0.5, attacker.atk * 0.1)
  if random() < attacker.critRate:    dmg *= 2  (暴击)
  if random() < defender.blockRate:  dmg *= 0.5  (格挡)
  if random() < defender.dodge:      dmg = 0  (闪避)
  final = base_dmg * (1 + attacker.buff_atk%) * (1 - defender.buff_def%)

Regen:
  hpRegen = maxHealth * (baseRegen% + talent_bonus% + buff_bonus%)
  lifeEscape回复 = maxHealth  (when LifeEscape > 0)

Crit/Block/Dodge:
  finalCritRate = baseCrit + talentCrit + buffCrit  (clamp 0-1)
  finalBlockRate = baseBlock * (1 + improve_sum)
  finalDodge = baseDodge + equipDodge

Attack Speed:
  finalSpeed = baseSpeed * (1 + improve_sum)  // 1.0 = 1 attack/sec
```

### 4.2 Stat Growth (from `CaculateBase*` methods)

> **RVAs given but body extraction blocked by IL2CPP invoker stubs.**
> For real multipliers, use talent effect values from `extracted_game_data.md` §2 as ground truth.

| Method | RVA | Input | Output |
|---|---|---|---|
| `CaculateBaseMaxHealth` | 0x00B368DC-0x00B36974 | level + constitution | maxHealth |
| `CaculateBaseAttack` | 0x00B36668-0x00B3670C | level + brave | attack |
| `CaculateBaseDefence` | 0x00B36974-0x00B36A0C | level + defence | defence |
| `CaculateBaseCriticalRate` | 0x00B36A0C-0x00B36AA8 | talent + buff | critRate |
| `CaculateBaseBlockRateInprove` | 0x00B36840-0x00B368DC | equip + skill | blockRate |
| `CaculateBaseDodge` | 0x00B3670C-0x00B367A4 | equip | dodge |
| `CaculateBaseAttackSpeedInprove` | 0x00B367A4-0x00B36840 | skill | attackSpeed |
| `CaculateBaseExpGainImprove` | 0x00B36AA8-0x00B36B44 | talent | expGain mult |
| `CaculateBaseRelationshipGainImprove` | 0x00B36BE8-0x00B36C84 | talent | relationshipGain |
| `CaculateCurrentHealthRate` | 0x00B0A790-0x00B0A7BC | current HP | HP% (double) |
| `CaculateLevelBuff` | 0x00B36660-0x00B36668 | level | BuffList (level buffs) |
| `CaculateNewMaxExp` | 0x00B39D30-0x00B39DB4 | level | newMaxExp (curve) |
| `CaculateGainSoulNum` | 0x00B06E34-0x00B06F3C | monster lvl + difficulty | soulNum |
| `CaculateGameOverTime` | 0x00E8E620-0x00E8E768 | start time | gameTime (int) |

### 4.3 Buff System

> **10 buff types with full effect formulas** — see `extracted_game_data.md` §1.

**Stacking rules**:
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

**DoT calculation** (per second or per 3s):
```
中毒 tick:   lose = stack
流血 decay:  heal *= 0.5,  stack -= 1/s
灼烧 tick:   lose = maxHP * (0.05 * stack), stack -= 1/3s
```

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

### 4.6 Souls & Evil Crystal

```
Per-run souls:
  win:  CaculateGainSoulNum(monster_level, area_level) * difficulty_mult
  lose: 50% of win amount
  rest: GainSoulRestTime → offline/afk regen

Cross-run Evil Crystal:
  souls → EC:  EvilCrystalValueChange
  grow:   EC = base + elapsed * GrowSpeed + GrowSpeedTotal
  upgrade: EvilCrystalUpgrade (permanent)
  reset:  AllResetEvilCrystal
```

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

**Cruel World difficulty unlocks** (残酷世界, see §6 of extracted data):
- 0-1: no reward / 死里逃生:1
- 3: 人类守卫者
- 5: 可以锁定两个天赋 (lock 2 talents)
- 7: 战神
- 10: 爱的战士

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
  artifacts.json      (40+ boss-drop items, see §3c)
  monsters.json       (50 monsters, see §4)
  skills.json         (20 skills, see §5)
  buffs.json          (10 buff types, see §1)
  endings.json        (5 endings + CW levels, see §6)
  npcs.json           (5 NPCs + 12 storylines)
  regions.json        (6 map regions + 5 worlds)
  event_deck.json     (4 card weights, IMPORT data/EventCardTypeSettingJS.json as-is)     ← Wave 2
```

### Suggested implementation order

1. **State machine** for turn/year (basic loop)
2. **Stat system** (16 base + 5 derived + buffs)
3. **Combat engine** (damage formula + crit/block/dodge + buffs)
4. **Event system** (event graph, simplified to JSON)
5. **Talents** (apply stat mods on level-up, see extracted_game_data.md §2)
6. **Relics + Equipment** (IMPORT `data/RelicSettingJS.json` + `data/WeaponSettingJS.json`, see §3a/§3b — these are the canonical balance dataset; write a small `RelicEffect`-string parser that splits on `;` and `:`)
7. **Boss-drop artifacts** (special-effect items, see §3c — hand-coded combat-tick behaviours)
8. **Monsters** (50 enemies with abilities, see §4)
9. **Skills** (20 skills, 3 levels each, see §5)
10. **Map** (6 regions, 5 worlds, transition logic)
11. **Adventure deck** (IMPORT `data/EventCardTypeSettingJS.json` — weighted roll for monster/elite/smith/merchant, see §4b)
12. **Endings** (5 endings + CW levels, see §6)

---

## 8. Cross-References

- **`extracted_game_data.md`** — All decoded game data (talents, items, monsters, skills, buffs, achievements, equipment, event-deck)
- **`dump_inventory.md`** — Catalogue of the 11,271 `Dump/*` files; what each bucket gives the rebuild
- **`data/RelicSettingJS.json`** — Canonical 51-relic dataset (Wave 2)
- **`data/WeaponSettingJS.json`** — Canonical 26-equipment dataset (Wave 2)
- **`data/EventCardTypeSettingJS.json`** — Canonical 4-card adventure-deck weights (Wave 2)
- **`chinese_strings.txt`** — Raw 1,834 Chinese strings (for any text not in extracted_game_data)
- **`extraction_summary.md`** — How data was extracted, what was discovered
- **`todo.md`** — What's still missing for full rebuild
- **`il2cpp_extracted.md`** (in original game folder) — Class/field/method signatures from IL2CPP dump
