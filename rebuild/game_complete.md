# Game Data Reverse Engineering - Complete

## Game: 异世轮回录 (Unity 2019.4.17f1c1 / il2cpp v264 / AArch64)

> **Wave 5 update (2026-6-10)**: The "EQUIPMENT Random Generation" section below had placeholders
> (e.g. `rar*(-25)+85-luck`) that didn't match the actual code. The real per-(property, slot)
> magnitude table and rarity weight formula are now extracted via Ghidra decompilation — see
> `rebuild_guide.md` §4.8 and `ghidra_results.md` §3. The summary below is updated to point at
> those.
>
> The symbols ARE preserved on the ARM64 `libil2cpp.so`, so the
> `AdventrueManager_generateEquipment @ 0x00C3CDC0` body was readable in Ghidra. See
> `ghidra_results.md` for the decompiled C and the full per-(property, slot) minMul/maxAdd
> table.

---

# ENUMS (14 found)

## AcquisitionMethod
0 = Normal, 1 = Special

## AcqisitionLimit
0 = Infinity, 1 = Once

## EffectType
0 = Event, 1 = Value

## BuffDuration
0 = BattleTime, 1 = OneTurn, 2 = AllTime

## BuffType
0 = Buff, 1 = Debuff

## BuffValueCaculateType
0 = 百分比生命值 (%MaxHp), 1 = 百分比损失生命值 (%LostHp), 2 = 通常 (Normal)

## BuffFixEffectName (0..17)
```
0  = 攻击力乘数变化  (AttackMult)
1  = 攻击力加数变化  (AttackAdd)
2  = 防御力乘数变化  (DefenseMult)
3  = 防御力加数变化  (DefenseAdd)
4  = 暴击率加数变化  (CritRateAdd)
5  = 暴击伤害加数变化 (CritDmgAdd)
6  = 闪避值加数变化  (DodgeAdd)
7  = 命中值加数变化  (HitAdd)
8  = 攻击速度乘数变化 (AtkSpdMult)
9  = 反击概率加数变化 (CounterRateAdd)
10 = 吸血值加数变化  (LifestealAdd)
11 = 格挡概率加数变化 (BlockRateAdd)
12 = 格挡概率乘数变化 (BlockRateMult)
13 = 生命回复率加数变化 (HpRecRateAdd)
14 = 生命回复率乘数变化 (HpRecRateMult)
15 = 溅射伤害加数变化 (SplashAdd)
16 = 每秒生命回复    (HpPerSec)
17 = 最大生命乘数变化 (MaxHpMult)
```

## BuffOverTimeEffectName
0 = 加减生命值, 1 = 百分比加减生命值, 2 = 眩晕

## CreatureBattleProperty
0=攻击 1=防御 2=暴击 3=格挡 4=暴伤 5=生命
6=闪避 7=吸血 8=攻速 9=反击 10=溅伤 11=无 12=回复 13=回复率

## EquipmentRarity
0=普通 1=稀有 2=史诗 3=传说 4=神话

## EquipmentType
0=武器 1=护甲 2=头盔 3=饰品

## EquipmentEntryName
0 = 锋利的

## HeroProfession
0=战士 1=通用 2=猎人

## RelicType
0=遗物 1=神器 2=礼物 3=药剂

---

# SKILLS (15 warrior skills from `generateZhanshiSkill` @ 0xBF2144)

85 lambdas (b__2_0..b__2_84). Each skill has 3 levels + 1 Remove effect (no-op).

| # | Skill | Type | Levels | L1 | L2 | L3 | Remove |
|---|---|---|---|---|---|---|---|
| 1 | 格挡反击 (Block Counter) | Event | 3 | b__2_0→58: block→9% counter | b__2_1→59: 23% | b__2_2→60: 26% | b__2_3 |
| 2 | 撼猛格挡 (Tremble Block) | Event | 3 | b__2_4→61: 40% block→buff | b__2_5→62: 50% | b__2_6→63: ~60% | b__2_7 |
| 3 | 当头一棒 (Whack Head) | Event | 3 | b__2_8→64: 10% stun | b__2_9→65: 15% | b__2_10→66: 20% | b__2_11 |
| 4 | 隔山打牛 (Splash) | Event | 3 | b__2_12→67: splash damage | b__2_13→68: 50% | b__2_14→69: Y% | b__2_15 |
| 5 | 旋风斩 (Whirlwind) | Value | 3 | b__2_16→70: 弃甲 buff | b__2_17→71 | b__2_18→72 | b__2_19 |
| 6 | 弃甲 (Discard Armor) | Event | 3 | b__2_20→73: 反击姿态 buff | b__2_21→74 | b__2_22→75 | b__2_23 |
| 7 | 反击姿态 (Counter Stance) | Event | 3 | b__2_24→76: between-side splash | b__2_25→77: 25% | b__2_26→78: Y% | b__2_27 |
| 8 | 双持 (Dual Wield) | Value | 3 | b__2_28→79: stun all | b__2_29→80 | b__2_30→81 | b__2_31 |
| 9 | 顺劈 (Cleave) | Event | 3 | b__2_32→82: 嘲讽 all | b__2_33→83 | b__2_34→84 | b__2_35 |
| 10 | 大喝 (Shout) | Event | 3 | b__2_36→79: stun all | b__2_37→80 | b__2_38→81 | b__2_39 |
| 11 | 嘲讽 (Taunt) | Event | 3 | b__2_40→82: 嘲讽 buff | b__2_41→83 | b__2_42→84 | b__2_43 |
| 12 | 逃跑计划 (Escape) | Value | 1 | b__2_44: +1 death-escape | b__2_45: no-op | | |
| 13 | 巨斧精通 (Greataxe) | Value | 3 | b__2_46: splash | b__2_47 | b__2_48 | b__2_49: no-op |
| 14 | 盔甲精通 (Shield) | Value | 3 | b__2_50: def+4 | b__2_51: def+4 | b__2_52: def+5 | b__2_53: no-op |
| 15 | 不屈 (Indomitable) | Value | 3 | b__2_54: hp+2 | b__2_55: hp+2 | b__2_56: hp+2 | b__2_57: no-op |

---

# BUFFS (15 presets from `InitBasicBuffs` @ 0xC3A198)

| # | Name | Type | Dur | MaxLayers | Effects |
|---|---|---|---|---|---|
| 0 | 中毒 (Poison) | Debuff | BattleTime | 9999 | OverTime: -1 HP/sec/layer |
| 1 | 流血 (Bleed) | Debuff | BattleTime | 20 | -3% 治疗/层, 3s decay; HpRecRateMult -1 |
| 2 | 灼烧 (Burn) | Debuff | BattleTime | 10 | OverTime: -3% HP/sec/layer, 3s decay |
| 3 | 强化 (Strengthen) | Buff | BattleTime | 10 | +5% AtkMult/层 |
| 4 | 急速 (Haste) | Buff | BattleTime | 10 | +5% AtkSpdMult/层 |
| 5 | 愤怒 (Rage) | Buff | BattleTime | 10 | +5% AtkSpdMult + +5% AtkMult/层 |
| 6 | 抵御 (Resist) | Buff | BattleTime | 10 | +3% DefenseMult/层 |
| 7 | 迟缓 (Slow) | Debuff | BattleTime | 10 | -5% AtkSpdMult/层 |
| 8 | 眩晕 (Stun) | Debuff | BattleTime | 999 | OverTime: 1s/decay, can't act |
| 9 | 破甲 (ArmorBreak) | Debuff | BattleTime | 20 | -DefenseMult/层 |
| 10 | 易伤 (Vulnerable) | Debuff | BattleTime | 20 | +Dmg taken (DefenseMult inverse) |
| 11 | 巨大化 (Gigantify) | Debuff | BattleTime | 20 | +50% MaxHpMult |
| 12 | 狂暴化 (Berserk) | Debuff | BattleTime | 20 | +50% AtkSpdMult |
| 13 | 虚空化 (Void) | Debuff | BattleTime | 20 | +30% DodgeAdd |
| 14 | 幻影化 (Phantom) | Debuff | BattleTime | 20 | -50% AtkSpdMult |

---

# HERO TALENTS (35 total, all Mythic, from `HeroTalentGenerator` @ 0xB3B2F8)

| # | Name (CN / EN) | Effect |
|---|---|---|
| 0 | 超强却过分谨慎 / Too Strong But Overly Cautious | +5 力量/体质/灵巧; luck+1 |
| 1 | 怕痛所以全点防御 / Afraid of Pain So All Def | Self buff: 防御力乘数×0.4 + 防御力+10 (AllTime) |
| 2 | 死亡回归 / Death Return | +2 DeathEscape chances, +1.0 death-escape recovery rate |
| 3 | 愈之勇者 / Healing Hero | +3 回复, +0.5 回复率 |
| 4 | 剑之勇者 / Sword Hero | +0.4 AtkMult, +0.4 AtkSpdMult (AllTime) + AttackData→IsHit=true (10%) |
| 5 | 点石成金 / Midas Touch | +5 家境, +1 家境/turn |
| 6 | 钓鱼达人 / Fishing Pro | Reduces fishing difficulty, increases fishing income |
| 7 | 打工战士 / Working Warrior | +5 work income |
| 8 | 盾之勇者 / Shield Hero | +20 防御, +100 防御 (AllTime) |
| 9 | 技能之神 / God of Skills | Each skill learned → +something at battle start |
| 10 | 神之子 / Son of God | Growth period: all stats +1; 魅力+5 智慧+5 |
| 11 | 格斗天才 / Block Genius | Block damage reduction +20% |
| 12 | 健身达人 / Fitness Pro | Training in yard gives extra stat, also max HP bonus |
| 13 | 孤独的勇者 / Lonely Hero | No companions → +5 基础 at battle start |
| 14 | 枪之勇者 / Gun Hero | 反击率+15%, 反击伤害+20% |
| 15 | 贝爷附体 / Bear Grylls | 冒险体力消耗-1, 篝火疗伤 extra recovery |
| 16 | 不屈意志 / Indomitable Will | +2 DeathEscape chances |
| 17 | 母胎单身二十年 / Single 20 Years | 基础攻速+12 (hand speed max) |
| 18 | 商业天才 / Business Genius | Every +1 家境 gives more gold |
| 19 | 灵魂收割者 / Soul Reaper | Defeating enemies +1 soul |
| 20 | 失眠患者 / Insomniac | Max HP +10 |
| 21 | 勇敢的心 / Brave Heart | Growth: +1 力量/year |
| 22 | 短跑天才 / Sprinter Genius | Growth: +1 灵巧/year |
| 23 | 钓鱼好手 / Fishing Expert | Fishing difficulty reduced |
| 24 | 强健体魄 / Strong Physique | Growth: +1 体质/year |
| 25 | 天才大脑 / Genius Brain | 智慧+6 |
| 26 | 有点小帅 / A Bit Handsome | 魅力+6 |
| 27 | 强壮A / Strong A | Initial 力量+6 |
| 28 | 敏捷A / Agile A | Initial 灵巧+6 |
| 29 | 坚韧A / Tough A | Initial 体质+6 |
| 30 | 聪明 / Smart | 智慧+3 |
| 31 | 好看 / Good Looking | 魅力+3 |
| 32 | 强壮D / Strong D | Initial 力量+3 |
| 33 | 敏捷D / Agile D | Initial 灵巧+3 |
| 34 | 坚韧D / Tough D | Initial 体质+3 |

---

# EQUIPMENT (Random Generation @ 0xC3CB8C)

## Types: 武器 / 护甲 / 头盔 / 饰品 (all 4)
## Rarities: 普通 → 神话 (5 levels)

## Stat formula (Wave 5: extracted via Ghidra)

> **The full 13-property × 3-slot table is in `rebuild_guide.md` §4.8 and `ghidra_results.md` §3.2.**
> The placeholders below have been replaced.

- **All properties** (except Defence): `value = Random.Range((level * minMul + maxAdd) * 0.95, (level * minMul + maxAdd) * 1.05)`
- **Defence (special)**: `value = Random.Range(base * 0.95, base * 1.05)` where `base = level*4+4` (main) / `level*2+2` (sub) / `level+1` (random)
- **Per-(property, slot) minMul + maxAdd** is the per-property table; full version in `ghidra_results.md`. Examples:
  - 攻击 Attack Random: `(0.01, 0.025)` → at lvl 1 ≈ 0.019-0.024; at lvl 20 ≈ 0.19-0.22
  - 攻击 Attack Sub: `(0.02, 0.07)` → at lvl 1 ≈ 0.087-0.097; at lvl 20 ≈ 0.46-0.51
  - 攻击 Attack Main: `(0.04, 0.15)` → at lvl 1 ≈ 0.18-0.20; at lvl 20 ≈ 0.95-1.05
  - 生命 Health Main: `(0.08, 0.4)` → at lvl 1 ≈ 0.46-0.50; at lvl 20 ≈ 1.94-2.15
  - 防御 Defence: absolute (level*4+4) etc., see formula above
- **Rarity weights** (sum of 5, weighted by input `rarityLevel`):
  - `[0] Common    = max(0, 85 - 25*rarityLevel - worldDifficulty)`
  - `[1] Uncommon  = max(0, 28 + 4*rarityLevel + worldDifficulty/6)`
  - `[2] Rare      = max(0, 15 + 6*rarityLevel)`
  - `[3] Epic      = max(0, 5  + 8*rarityLevel)`
  - `[4] Legendary = max(0, 7*rarityLevel)`
- **Level bump**: 20% chance to bump effective `level` by 1 (via `RandomTool_CheckRandom(0.2)`) before computing property values — makes some drops "feel stronger than their level"

---

# ARTIFACTS (48 from `ArtifactGenerater` ctor @ 0xCE58A0)

See `rebuild/artifact_complete.md` for full details.

| Type | Value (passive stat) | Event (triggered) |
|---|---|---|
| 1. 哥布林号角 | 0 | Summon goblin (BattleBegin) |
| 2. 纯金王冠 | 家境+5 魅力+5 | - |
| 3. 巨斧之灵 | 溅伤+6% | - |
| 4. 巨大牛角 | - | 20% def→atk at battle start |
| 5. 噬魂 | - | 4% lifesteal on attack |
| 6. 原初魔晶 | 勇猛+5 灵巧+5 体质+5 | - |
| 7. 龙之心 | - | Burn attacker on being hit |
| 8. 淬火鳞片 | 防御+9 | - |
| 9. 灵体披风 | - | 5% ghost-form (dmg=1) |
| 10. 毒腺 | - | Poison enemy on attack |
| ... (48 total) | | |

---

# STRUCT FIXES APPLIED

## Il2CppClass (Unity 2019.4.17f1c1, AArch64)
Original (broken) → Fixed:
- `cctor_thread`: 8B (Il2CppMutex*) → **4B (uint32)**
- bitfield: 2B (split uint8) → **4B (int32)**
- vtable offset: 0x138 → **0x130**
- Total size: 824B → **1328B (0x530)**
- vtable: 32 entries → **64 entries** (more conservative)

## VirtualInvokeData
- 0: methodPtr (code ptr)
- 8: method (MethodInfo*)
- Standard, no fix needed

## Il2CppObject
- offset 0: klass (Il2CppClass*)
- offset 8: monitor
- Standard, no fix needed
