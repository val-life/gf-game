# ArtifactGenerater Complete Reverse Engineering

## Unity 2019.4.17f1c1 | il2cpp metadata v264 | AArch64

Class: `ArtifactGenerater` ctor @ 0x00CE58A0-0x00CE9010 (14KB)
Static class: `ArtifactGenerater+<>c` @ 0x00CE9074

## ArtifactGenerater Fields (Static `<>c`)
79 lambda fields (b__1_0..b__1_78) at static offsets 0x00-0x280:
- b__1_0..b__1_47: untyped `FDFramworkEvent` (one per artifact, its main handler)
- b__1_48..b__1_78: typed `FDFramworkEvent<Creature>` / `<AttackData>` / `<Creature,Creature>` (shared event handlers)

## Event Channels
- `BattleBegginEventList`: OnBattleBegin (event order=1)
- `AttackStatEventList` `_syncRoot` channel: order 1-5 (early attack)
- `AttackStatEventList` `monitor` channel: order 6-10 (late attack, post-damage)
- `BattleStatEventList`: post-battle, Creature x Creature args
- `BattleTimeActivity` (List): periodic ticks, every K seconds

## All 48 Artifacts (主效果 + 订阅)

| # | Name (主效果) | Type | b__1_N | 订阅 typed lambdas |
|---|---|---|---|---|
| 1 | 哥布林号角 | Event | b__1_0 | b__1_48 (BattleBegin, ord=1) |
| 2 | 纯金王冠 | Value | b__1_1 | - |
| 3 | 巨斧之灵 | Value | b__1_2 | - |
| 4 | 巨大牛角 | Event | b__1_3 | b__1_49 (BattleBegin, ord=1) |
| 5 | 噬魂 | Event | b__1_4 | b__1_50 (Attack, ord=2) |
| 6 | 原初魔晶 | Value | b__1_5 | - |
| 7 | 龙之心 | Event | b__1_6 | b__1_51 (Attack, ord=1) |
| 8 | 淬火鳞片 | Value | b__1_7 | - |
| 9 | 灵体披风 | Event | b__1_8 | b__1_52 (Attack, ord=5) |
| 10 | 毒腺 | Event | b__1_9 | b__1_53 (Attack, ord=2) |
| 11 | 精灵权杖 | Event | b__1_10 | b__1_54 (Tick, 10s) |
| 12 | 月之石 | Value | b__1_11 | - |
| 13 | 嗜血 | Event | b__1_12 | b__1_55 (Attack, ord=6) |
| 14 | 剑圣披风 | Value | b__1_13 | - |
| 15 | 王国圣剑 | Event | b__1_14 | - (perma buff) |
| 16 | 狂欢匕首 | Event | b__1_15 | b__1_56 (PostBattle, ord=1) |
| 17 | 妖精披风 | Value | b__1_16 | - |
| 18 | 小圆盾 | Value | b__1_17 | - |
| 19 | 预知魔眼 | Value | b__1_18 | - |
| 20 | 圣剑剑鞘 | Value | b__1_19 | - |
| 21 | 功夫秘籍 | Value | b__1_20 | - |
| 22 | 巨人之血 | Event | b__1_21 | b__1_57 (Attack, ord=5) |
| 23 | 愤怒之盾 | Event | b__1_22 | b__1_58 (Attack, ord=5) |
| 24 | 残酷盛宴 | Event | b__1_23 | b__1_59 (PostBattle, ord=2) |
| 25 | 绝命匕首 | Event | b__1_24 | b__1_60 (BattleBegin, ord=1) |
| 26 | 反击盾牌 | Event | b__1_25 | b__1_61 (Attack, ord=6) |
| 27 | 兴奋药剂 | Event | b__1_26 | b__1_62 (BattleBegin) + b__1_63 (Tick 3s) |
| 28 | 战鼓 | Event | b__1_27 | b__1_64 (BattleBegin) + b__1_65 (Tick 3s) |
| 29 | 财神像 | Value | b__1_28 | - |
| 30 | 不灭之铠 | Value | b__1_29 | - |
| 31 | 收割者 | Event | b__1_30 | b__1_66 (Attack, ord=6) |
| 32 | 聚魂铃铛 | Value | b__1_31 | - |
| 33 | 无形之剑 | Event | b__1_32 | b__1_67 (Attack, ord=10) |
| 34 | 荆棘吊坠 | Event | b__1_33 | b__1_68 (Attack, ord=1) |
| 35 | 尖刺铠甲 | Event | b__1_34 | b__1_69 (Attack, ord=5) |
| 36 | 圣树树枝 | Event | b__1_35 | b__1_70 (Tick 2s) |
| 37 | 鲜血圣杯 | Event | b__1_36 | b__1_71 (Tick 2s) |
| 38 | 终焉之钟 | Event | b__1_37 | b__1_72 (Attack, ord=6) |
| 39 | 岩石铠甲 | Event | b__1_38 | - (perma buff) |
| 40 | 液态铠甲 | Event | b__1_39 | b__1_73 (Attack, ord=6) |
| 41 | 反击石 | Event | b__1_40 | b__1_74 (Attack, ord=5) |
| 42 | 血魔之盔 | Event | b__1_41 | - (perma buff) |
| 43 | 免疫宝石 | Value | b__1_42 | (empty stub) |
| 44 | 锯齿利剑 | Event | b__1_43 | b__1_75 (Attack, ord=1) |
| 45 | 守护吊坠 | Event | b__1_44 | b__1_76 (Attack, ord=1) |
| 46 | 黄金甲 | Event | b__1_45 | b__1_77 (BattleBegin) |
| 47 | 黄金匕首 | Event | b__1_46 | b__1_78 (BattleBegin) |
| 48 | 愈合宝珠 | Value | b__1_47 | (empty stub) |

## All 31 Typed Shared Lambdas

| b__1_M | Signature | Behavior |
|---|---|---|
| b__1_48 | (Creature) | 哥布林号角: RandomTool → Summon random goblin |
| b__1_49 | (Creature) | 巨大牛角: AddCustomBuff "巨大牛角" Atk+=Def*ratio |
| b__1_50 | (AttackData) | 噬魂: attacker.Recover(4% HP) + display |
| b__1_51 | (AttackData) | 龙之心: attacker.AddBasicBuff(灼烧, 1) |
| b__1_52 | (AttackData) | 灵体披风: if Random, attackData.Damage = 1.0 |
| b__1_53 | (AttackData) | 毒腺: victim.AddBasicBuff(中毒, 2) |
| b__1_54 | (Creature) | 精灵权杖: Summon ("小精灵", 5) |
| b__1_55 | (AttackData) | 嗜血: if victim has 流血, Damage *= (1+layers*K) |
| b__1_56 | (Creature,Creature) | 狂欢匕首: attacker.Recover(10) post-kill |
| b__1_57 | (AttackData) | 巨人之血: Damage += attacker.health*0.01 |
| b__1_58 | (AttackData) | 愤怒之盾: if !ghost, attacker.LoseHealth(victim.def*0.25) |
| b__1_59 | (Creature,Creature) | 残酷盛宴: attacker buff 残酷盛宴 Attack*1.1 per kill |
| b__1_60 | (Creature) | 绝命匕首: buff Attack = (1-lossRatio/2) |
| b__1_61 | (AttackData) | 反击盾牌: if attactType==2, Damage *= 1.75 |
| b__1_62 | (Creature) | 兴奋药剂: buff AttackSpeed*1.25 (1 turn) |
| b__1_63 | (Creature) | 兴奋药剂副: buff AttackSpeed *= decay (10 layers) |
| b__1_64 | (Creature) | 战鼓: buff Attack*1.25 (1 turn) |
| b__1_65 | (Creature) | 战鼓副: buff Attack *= decay (10 layers) |
| b__1_66 | (AttackData) | 收割者: if victim.HP<50%, Damage *= 1.25 |
| b__1_67 | (AttackData) | 无形之剑: attackData.IsHit = true (always) |
| b__1_68 | (AttackData) | 荆棘吊坠: if !ghost, attacker.LoseHealth(Damage*0.5) |
| b__1_69 | (AttackData) | 尖刺钢甲: Damage += attacker.def*0.2 |
| b__1_70 | (Creature) | 圣树树枝: buff Attack += healthRecover*0.1 (9999 turn) |
| b__1_71 | (Creature) | 鲜血圣杯: drain healthRecover to all non-ghost enemies |
| b__1_72 | (AttackData) | 终焉之钟: if victim is BOSS, Damage *= 1.2 |
| b__1_73 | (AttackData) | 液态铠甲: cap damage = 7% HP + 30% excess |
| b__1_74 | (AttackData) | 反击石: if attactType∈{1,2}, Damage *= 1.25 |
| b__1_75 | (AttackData) | 锯齿利剑: if Random, victim.AddBasicBuff(流血, 1) |
| b__1_76 | (AttackData) | 守护吊坠: if HP<40%, Damage *= 0.7 |
| b__1_77 | (Creature) | 黄金甲: buff Defense *= min(gold/300, 100%) |
| b__1_78 | (Creature) | 黄金匕首: buff Attack *= min(gold/300, 100%) |

## Struct Fix Notes

Original Ghidra `Il2CppClass` had wrong layout for Unity 2019.4.17f1c1:
- `cctor_thread` field: was 8B (`Il2CppMutex*`), should be 4B (`uint32_t` thread id)
- `bitfield_bits`: was 2B split (`uint8_t` x2), should be 4B (`int32_t`)
- `vtable` offset: was 0x138, correct is 0x130 (12B shift)

Fixed struct size: 1328B (0x530), vtable at 0x130 with 64-slot array.

## Critical Insights

1. **Dragon Heart (b__1_6 + b__1_51)**: After-attack event → calls attacker.AddBasicBuff(灼烧, 1). The Ghidra decompiler initially mislabeled it as "ReadyToDie" because of the vtable struct misalignment.

2. **Attack event chain (ord=1..10)**: 1=PreAttack, 5=PostCalcDamage, 6=PostCalcFinal, 10=Override (always-hits)

3. **Two empty stubs (b__1_42, b__1_47)**: Artifacts 43 (免疫宝石) and 48 (愈合宝珠) — main handlers are empty, effect applied via typed lambda (免疫中毒灼烧, 免疫流血). Wait — these artifacts are VALUE type, so the empty stub means the effect is purely from typed subscriptions. But neither artifact has typed subs in the list. So these are passive effects (immunities) set via AddCustomBuff or similar during ctor.

4. **Artifacts without typed subs**: Value-type artifacts (passive stats) + Event-type artifacts with their effect entirely in the untyped lambda.

## Tool Reference

- Decompile artifact effects: ghidra_mcp decompile_function @ lambda body
- Find artifact ctor: ghidra_mcp search_functions Artifact_Builder_SetArtifactBaseInfo
- All artifact names: PTR_StringLiteral_uXXXX_uXXXX in ctor decompile (unicode hex)
- BuffName enum: 0=流血, 1=灼烧, 2=中毒, 3=强化, 4=专注, 5=急速, 6=胆怯, 7=愤怒, 8=抵御, 9=迟缓, 10=眩晕, 11=破甲, 12=易伤, 13=巨大化, 14=狂暴化, 15=虚空化, 16=幻影化
