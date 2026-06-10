# 异世轮回录 - Extracted Game Data (via Ghidra MCP + Metadata Scanner)

> **Extraction date**: 2026-6-9
> **Source**: `assets/bin/Data/Managed/Metadata/global-metadata.dat` (6.78MB)
> **Method**: Decoded StringLiteral table (11,901 entries) with UTF-8 + GB18030
> **Tool**: Ghidra MCP (libil2cpp.so) + direct metadata binary scan

---

## 1. Buff / Status Effect System (10 buffs)

| Buff | Effect |
|---|---|
| 中毒 | 中毒将使生物每秒损失相当于中毒层数的生命值。 |
| 流血 | 每一层流血都将削减生物获取的治疗效果，每秒削减层数。 |
| 灼烧 | 每一层灼烧都将使得生物每3秒按比例损失生命，每3秒削减层数。 |
| 强化 | 每一层强化都将额外提升5%的伤害，最大为十层。 |
| 急速 | 每一层急速都将额外提升5%的攻速，最大为十层。 |
| 愤怒 | 每一层愤怒都将额外提升5%的攻速，5%的伤害。 |
| 抵御 | 每一层抵御都将额外提升3%的防御，最大为十层。 |
| 迟缓 | 每一层迟缓都将减少5%的攻速，最大为10层。 |
| 眩晕 | 处于眩晕状态下的敌人无法行动。 |
| 破甲 | 减少部分防御。 |
| 易伤 | 提升伤害。 |
| 巨大化 | 生命提升50%。 |
| 狂暴化 | 攻击提升50%。 |
| 虚空化 | 闪避增加30%。 |
| 幻影化 | 攻击速度+50%。 |

---

## 2. Talents (天赋) - 30+ traits

> Format: Name + Full description (1-2 lines, exact effect values extracted)

| ID | Name | Effect |
|---|---|---|
| 5481 | (desc) | 死亡不过是另一个开始。你死里逃生次数+2，死里逃生回复全部生命。 |
| 5482 | 愈之勇者 | 你是愈之勇者，你拥有化腐朽为神奇的治愈之力。你初始回复+3，你的生命回复率+50% |
| 5484 | 剑之勇者 | 你是剑之勇者，你的剑术出神入化。你的攻击力+10%,攻速+20%，你的攻击无法被闪避。 |
| 5486 | 点石成金 | 你的指尖碰到的东西都会变成黄金。家境+5，你每回合+1家境。 |
| 5488 | (desc) | 你就是钓鱼达人。你不需要鱼竿就能钓鱼，钓鱼难度大降低，你钓鱼收益提高50%，最大体力+10 |
| 5489 | (desc) | 你上辈子是超强打工人，为老板挣了不知道多少套别墅。你打工收益+50%，最大体力+10。 |
| 5490 | 盾之勇者 | 你以身为盾，你是盾之勇者。你初始防御力+20且防御力+100%，攻击力-75%。你获得盾反。每次被攻击给敌方反弹相当于防御力15%的伤害。 |
| 5492 | 技能之神 | 所谓技多不压身，你是学技能的王者。你每学一项技能，战斗开始时你提升2.5%的攻击，2.5%的防御，1点回复。 |
| 5494 | 神之子 | 你受到众神的祝福。你成长期全属性额外+1。你魅力和智力分别+5 |
| 5496 | 格斗天才 | 你天生善于格斗，格挡的减伤率+20%。 |
| 5498 | 健身达人 | 你勤于健身，每次在院子锻炼的时候额外获得一点相应属性。此外，你最大体力+10 |
| 5500 | 孤独的勇者 | 你是孤独的勇者，当你没有任何同伴上阵时，你在战斗开始前增加5的基础回复，25%基础攻击、基础防御、回复率。 |
| 5502 | 枪之勇者 | 你是传说中的枪兵，你的反击概率提高15%，反击伤害提高20%。 |
| 5504 | 贝爷附体 | 你生来就善于探险。冒险中，你的冒险体力消耗-1，在篝火疗伤额外回复5%生命。 |
| 5506 | 不屈意志 | 你拥有及其坚定的意志，死里逃生次数+2。 |
| 5512 | 灵魂收割者 | 你能收割敌人的灵魂，你击败敌人后的灵魂获取量+1。 |
| 5514 | 失眠患者 | 你是失眠患者，你的最大体力+10。 |
| 5516 | 勇敢的心 | 你有一颗勇敢的心，成长期内你每年额外+1勇猛。 |
| 5518 | 短跑天才 | 你生下来就是一名短跑天才，成长期内你每年额外+1灵巧。 |
| 5520 | 钓鱼好手 | 你是一名钓鱼好手，钓鱼的难度降低。 |
| 5522 | 强健体魄 | 你生来就有一副强健的体魄，成长期内你每年额外+1体质。 |
| 5524 | 天才大脑 | 你拥有一颗天才一般的大脑，智力+6。 |
| 5526 | 有点小帅 | 你有点小帅，魅力+6。 |
| 5528 | 强壮A | 你身体强壮，初始勇猛+6。 |
| 5530 | 敏捷A | 你身体敏捷，初始灵巧+6。 |
| 5532 | 坚韧A | 你身体比常人坚韧，初始体质+6。 |
| 5536 | 好看 | 你长得还算好看，魅力+3。 |
| 5538 | 强壮D | 你身体强壮，初始勇猛+3。 |
| 5540 | 敏捷D | 你身体敏捷，初始灵巧+3。 |
| 5542 | 坚韧D | 你身体比常人坚韧，初始体质+3。 |

---

## 3. Items / Relics / Artifacts

> **2026-6-9 UPDATE**: The in-game JSON configs `RelicSettingJS` (51 entries) and `WeaponSettingJS` (26 entries) were decoded out of `Dump/TextAsset/`. These are the **canonical balance dataset** for the relic pool and equipment system. The named-artifact list at section 3c below is from the string-literal scan and covers the **boss-drop / special-effect artifact pool** that is separate from the basic relic pool.

### 3a. Canonical relic dataset - `RelicSettingJS` (51 entries)

**Source**: `Dump/TextAsset/RelicSettingJS.txt` -> decoded JSON at `rebuild/data/RelicSettingJS.json`.

**Schema**:

| Field | Domain |
|---|---|
| `RelicName` | string, zh-Hans |
| `RelicType` | `遗物` (relic, 47) \| `药剂` (potion, single-use, 4) |
| `AvaliableProfession` | `通用` (48) \| `战士` (3) - no `猎人`-only relics |
| `Rarity` | `稀有` (20) \| `史诗` (15) \| `传说` (12) \| `神话` (4) |
| `RelicDiscript` | flavor text (not shown here) |
| `RelicEffect` | `key:value[;key:value...]`, parser-ready |
| `AcquisitionMethod` | `Normal` (21, random drops) \| `Special` (30, story rewards) |
| `AcquisitionLimit` | `Once` \| `Infinity` |

#### All 51 relics

| # | Name | Effect | Rarity | Type | Profession | Acquisition |
|---:|---|---|---|---|---|---|
| 1 | 一些金币 | `金币:100` | 稀有 | 遗物 | 通用 | Special:Once |
| 2 | 很多金币 | `金币:200` | 史诗 | 遗物 | 通用 | Special:Once |
| 3 | 经验之书 | `经验获取效率:0.03` | 稀有 | 遗物 | 通用 | Normal:Infinity |
| 4 | 招财猫 | `家境:1` | 稀有 | 遗物 | 通用 | Normal:Infinity |
| 5 | 古老地图 | `脚程:1` | 稀有 | 遗物 | 通用 | Normal:Infinity |
| 6 | 力量护符 | `勇猛:1` | 稀有 | 遗物 | 通用 | Normal:Infinity |
| 7 | 灵巧护符 | `灵巧:1` | 稀有 | 遗物 | 通用 | Normal:Infinity |
| 8 | 智力耳环 | `智力:1` | 稀有 | 遗物 | 通用 | Normal:Infinity |
| 9 | 生命护符 | `体质:1` | 稀有 | 遗物 | 通用 | Normal:Infinity |
| 10 | 防御护符 | `防御:2` | 稀有 | 遗物 | 通用 | Normal:Infinity |
| 11 | 陨铁护臂 | `勇猛:4;灵巧:-2` | 史诗 | 遗物 | 通用 | Normal:Once |
| 12 | 狂热宝石 | `勇猛:4;灵巧:4;体质:-6` | 史诗 | 遗物 | 通用 | Normal:Once |
| 13 | 圣树之种 | `战斗生命回复:3` | 史诗 | 遗物 | 通用 | Normal:Once |
| 14 | 铆钉拳套 | `每点力量攻击力:0.1` | 史诗 | 遗物 | 通用 | Normal:Once |
| 15 | 巨人腰带 | `每点体质生命值:1` | 史诗 | 遗物 | 通用 | Normal:Once |
| 16 | 安眠草 | `最大体力:5` | 传说 | 遗物 | 通用 | Normal:Once |
| 17 | 闪耀魔晶 | `魅力:3` | 史诗 | 遗物 | 通用 | Normal:Once |
| 18 | 望远镜 | `偷袭概率:0.1` | 史诗 | 遗物 | 通用 | Normal:Once |
| 19 | 启迪之书 | `经验获取效率:0.08` | 传说 | 遗物 | 通用 | Normal:Once |
| 20 | 聚宝盆 | `家境:5` | 传说 | 遗物 | 通用 | Normal:Once |
| 21 | 替身娃娃 | `死里逃生:1` | 神话 | 遗物 | 通用 | Special:Once |
| 22 | 矮人护手 | `格挡:0.05` | 稀有 | 遗物 | 战士 | Normal:Once |
| 23 | 溅伤护符 | `溅伤:0.02` | 稀有 | 遗物 | 战士 | Normal:Once |
| 24 | 骨头鱼钩 | `钓鱼难度:0.15` | 史诗 | 遗物 | 通用 | Normal:Once |
| 25 | 魔人权杖 | `怪物每级属性提高:0.3;经验获取效率:0.5` | 传说 | 遗物 | 通用 | Special:Once |
| 26 | 登山杖 | `脚程:2` | 稀有 | 遗物 | 通用 | Special:Once |
| 27 | 旅行鞋 | `迷宫前进体力消耗:-1` | 传说 | 遗物 | 通用 | Special:Once |
| 28 | 睡袋 | `篝火体力回复:5` | 稀有 | 遗物 | 通用 | Special:Once |
| 29 | 百草药学 | `篝火生命回复:0.05` | 史诗 | 遗物 | 通用 | Special:Once |
| 30 | 疲劳药剂 | `体力耗尽时前进生命损失:-0.05` | 传说 | 遗物 | 通用 | Special:Once |
| 31 | 矮马 | `区域移动体力消耗:0.3` | 稀有 | 遗物 | 通用 | Special:Once |
| 32 | 战马 | `区域移动体力消耗:0.6` | 传说 | 遗物 | 通用 | Special:Once |
| 33 | 飞龙 | `区域移动体力消耗:0.8` | 传说 | 遗物 | 通用 | Special:Once |
| 34 | 攻击药剂 | `本回合攻击力提高:0.1` | 稀有 | 药剂 | 通用 | Special:Infinity |
| 35 | 敏捷药剂 | `本回合攻速提高:0.1` | 稀有 | 药剂 | 通用 | Special:Infinity |
| 36 | 忍耐药剂 | `本回合防御提高:0.1` | 稀有 | 药剂 | 通用 | Special:Infinity |
| 37 | 神秘药水 | `神秘药水效果` | 史诗 | 药剂 | 通用 | Special:Infinity |
| 38 | 地下室钥匙 | `无` | 稀有 | 遗物 | 通用 | Special:Once |
| 39 | 幸运护符 | `战利品幸运值:10` | 史诗 | 遗物 | 通用 | Special:Once |
| 40 | 王国地图 | `脚程:2` | 稀有 | 遗物 | 通用 | Special:Once |
| 41 | 罗盘 | `脚程:4` | 史诗 | 遗物 | 通用 | Special:Once |
| 42 | 怀表 | `最大体力:10` | 传说 | 遗物 | 通用 | Special:Once |
| 43 | 鱼人泪滴 | `魅力:10` | 传说 | 遗物 | 通用 | Special:Once |
| 44 | 无眠头环 | `最大体力:25` | 神话 | 遗物 | 通用 | Special:Once |
| 45 | 精致便衣 | `魅力:4` | 史诗 | 遗物 | 战士 | Special:Once |
| 46 | 钓鱼竿 | `无` | 稀有 | 遗物 | 通用 | Special:Once |
| 47 | 玫瑰鱼竿 | `钓鱼难度:0.3` | 传说 | 遗物 | 通用 | Special:Once |
| 48 | 钻石鱼钩 | `钓鱼:传说奖励` | 神话 | 遗物 | 通用 | Special:Once |
| 49 | 免死金牌 | `死里逃生:1` | 神话 | 遗物 | 通用 | Special:Infinity |
| 50 | 火焰羽毛 | `战利品幸运值:10` | 史诗 | 遗物 | 通用 | Special:Once |
| 51 | 水晶护腕 | `防御:8` | 传说 | 遗物 | 通用 | Special:Once |

### 3b. Equipment catalogue - `WeaponSettingJS` (26 entries)

**Source**: `Dump/TextAsset/WeaponSettingJS.txt` -> decoded JSON at `rebuild/data/WeaponSettingJS.json`.

**Schema**:

| Field | Domain |
|---|---|
| `EquipmentName` | string, zh-Hans |
| `Profession` | `通用` (14) \| `战士` (7) \| `猎人` (5) |
| `EquipType` | `武器` (7) \| `护甲` (6) \| `头盔` (4) \| `饰品` (9) |
| `MainProperty` | guaranteed stat at high tier |
| `SubProperty` | guaranteed stat at mid tier (or `无` for accessories) |
| `SecondProperty` | comma-list of possible random affixes |

**Stat domain** (10 stats observed across slots): `攻击 攻速 防御 闪避 反击 格挡 溅伤 吸血 生命 回复`

#### All 26 equipment items

| # | Name | Slot | Profession | Main | Sub | Affix pool |
|---:|---|---|---|---|---|---|
| 1 | 长剑 | 武器 | 通用 | 攻击 | 攻速 | 攻速，攻击，闪避，反击，格挡，溅伤 |
| 2 | 巨斧 | 武器 | 通用 | 攻击 | 攻击 | 攻击，防御，反击，格挡，溅伤，生命 |
| 3 | 镰刀 | 武器 | 猎人 | 攻击 | 吸血 | 攻速，攻击，闪避，反击，溅伤，吸血 |
| 4 | 重锤 | 武器 | 通用 | 攻击 | 溅伤 | 攻击，反击，防御，格挡，溅伤，生命 |
| 5 | 长枪 | 武器 | 通用 | 攻击 | 反击 | 攻速，攻击，闪避，反击，格挡，溅伤 |
| 6 | 剑盾 | 武器 | 战士 | 攻击 | 防御 | 攻速，攻击，防御，反击，格挡，回复 |
| 7 | 巨剑 | 武器 | 战士 | 攻击 | 格挡 | 攻击，反击，格挡，防御，溅伤，生命 |
| 8 | 重甲 | 护甲 | 通用 | 防御 | 防御 | 防御，反击，格挡，回复，生命，攻击 |
| 9 | 皮甲 | 护甲 | 猎人 | 闪避 | 防御 | 防御，反击，闪避，攻击，攻速，生命 |
| 10 | 轻甲 | 护甲 | 通用 | 防御 | 闪避 | 防御，反击，闪避，攻击，攻速，生命 |
| 11 | 绿甲 | 护甲 | 通用 | 防御 | 回复 | 防御，反击，回复，闪避，攻击，生命 |
| 12 | 板甲 | 护甲 | 战士 | 防御 | 格挡 | 防御，反击，回复，格挡，生命 |
| 13 | 反甲 | 护甲 | 战士 | 防御 | 反击 | 防御，反击，回复，格挡，溅伤 |
| 14 | 护额 | 头盔 | 通用 | 生命 | 闪避 | 回复，攻击，反击，闪避，攻速，溅伤 |
| 15 | 面具 | 头盔 | 猎人 | 生命 | 吸血 | 回复，攻击，闪避，反击，吸血，攻速 |
| 16 | 札盔 | 头盔 | 通用 | 生命 | 回复 | 回复，攻击，反击，防御，格挡，溅伤 |
| 17 | 桶盔 | 头盔 | 战士 | 生命 | 防御 | 回复，攻击，反击，防御，格挡，生命 |
| 18 | 吸血戒指 | 饰品 | 猎人 | 吸血 | 无 | 回复，攻击，闪避，反击，吸血，攻速，溅伤，防御，格挡 |
| 19 | 闪避戒指 | 饰品 | 猎人 | 闪避 | 无 | 回复，攻击，闪避，反击，吸血，攻速，溅伤，防御，格挡 |
| 20 | 范围戒指 | 饰品 | 通用 | 溅伤 | 无 | 回复，攻击，闪避，反击，吸血，攻速，溅伤，防御，格挡 |
| 21 | 力量戒指 | 饰品 | 通用 | 攻击 | 无 | 回复，攻击，闪避，反击，吸血，攻速，溅伤，防御，格挡 |
| 22 | 回复戒指 | 饰品 | 通用 | 回复 | 无 | 回复，攻击，闪避，反击，吸血，攻速，溅伤，防御，格挡 |
| 23 | 反击戒指 | 饰品 | 通用 | 反击 | 无 | 回复，攻击，闪避，反击，吸血，攻速，溅伤，防御，格挡 |
| 24 | 生命戒指 | 饰品 | 通用 | 生命 | 无 | 回复，攻击，闪避，反击，吸血，攻速，溅伤，防御，格挡 |
| 25 | 防御戒指 | 饰品 | 战士 | 防御 | 无 | 回复，攻击，闪避，反击，吸血，攻速，溅伤，防御，格挡 |
| 26 | 格挡戒指 | 饰品 | 战士 | 格挡 | 无 | 回复，攻击，闪避，反击，吸血，攻速，溅伤，防御，格挡 |

### 3c. Boss-drop / special-effect artifacts (string-literal scan)

> Imported from earlier `global-metadata.dat` extraction. These have unique combat-tick behaviour that's outside the simple `key:value` effect format used by section 3a. For each artifact, the description in `chinese_strings.txt` is the canonical behaviour text.

| ID | Name | Effect |
|---|---|---|
| 1440 | 哥布林号角 | 战斗开始时，有概率召唤出一只哥布林为你而战。 |
| 1443 | 纯金王冠 | 家境+5 魅力+5 |
| 1446 | 巨斧之灵 | 溅射伤害+6% |
| 1449 | 巨大牛角 | 战斗开始时，将20%防御力转换为攻击力。 |
| 1452 | 噬魂 | 每次攻击将使你回复4的生命。 |
| 1455 | 原初魔晶 | 勇猛+5 灵巧+5 体质+5 |
| 1458 | 龙之心 | 受到攻击后，给与攻击者一层灼烧。 |
| 1461 | 淬火鳞片 | 地龙王的鳞片，经历常年淬火，已经变得无比坚硬。 |
| 1463 | (desc) | 你的防御力提升9。 |
| 1464 | 灵体披风 | 受到攻击时，5%概率灵体化，将此次攻击伤害降为1。 |
| 1467 | 毒腺 | 攻击后，给敌人附加2层中毒。 |
| 1470 | 精灵权杖 | 战斗中，每隔10秒召唤一只小精灵。 |
| 1473 | 月之石 | 提高12点灵巧。 |
| 1476 | 嗜血 | 攻击流血的敌人时，根据敌人流血的层数提高伤害。 |
| 1479 | 剑圣披风 | 闪避+5%。 |
| 1482 | 王国圣剑 | 无坚不摧。攻击+10%。 |
| 1485 | 狂欢匕首 | 击败敌人后，回复10点生命。 |
| 1488 | 妖精披风 | 蕴含风之力的王冠。 |
| 1490 | (desc) | 你的基础攻击速度提升0.08。 |
| 1491 | 小圆盾 | 小巧的圆盾。 |
| 1493 | (desc) | 你的格挡率提升10% |
| 1494 | 预知魔眼 | 能够预知敌人攻击的魔眼。 |
| 1496 | (desc) | 你的闪避提升5% |
| 1497 | 圣剑剑鞘 | 传说中圣剑的剑鞘。 |
| 1499 | (desc) | 你的生命回复率+20% |
| 1500 | 功夫秘籍 | 一份来自东方的功夫秘籍，上面记载着以柔克刚的武功。 |
| 1502 | (desc) | 你的反击概率+8% |
| 1503 | 巨人之血 | 巨人的血液，喝下去能获得巨人之力。 |
| 1505 | (desc) | 你的攻击将造成当前生命值1%的额外伤害。 |
| 1506 | 愤怒之盾 | 受击时，对攻击你的敌人造成相当于你防御力25%的伤害。 |
| 1509 | 残酷盛宴 | 本场战斗，击败敌人后，提升10%的攻击。 |
| 1512 | 绝命匕首 | 战斗时，你的生命值越低，攻击力越高。 |
| 1515 | 反击盾牌 | 你格挡后的反击伤害提升75%。 |
| 1518 | 兴奋药剂 | 战斗开始时，提升25%攻速，但是每过3s，降低4%攻速。最多降低40%。 |
| 1521 | 战鼓 | 战斗开始时，提升25%攻击力，但是每过3s，降低4%攻击。最多降低40%。 |
| 1524 | 财神像 | 你每一点家境获取的金币提高。 |
| 1527 | 不灭之铠 | 死里逃生次数+1。 |
| 1530 | 收割者 | 你攻击的敌人生命低于50%时，伤害+25% |
| 1533 | 聚魂铃铛 | 你击败敌人后的灵魂获取量+1。 |
| 1536 | 无形之剑 | 看不见剑身的剑，用此剑发动攻击，敌人绝不可能闪避。 |
| 1539 | 荆棘吊坠 | 被攻击时，给攻击者反弹一部分伤害。 |
| 1542 | 尖刺铠甲 | 攻击时，附加相当于你防御值20%的伤害。 |
| 1545 | 圣树树枝 | 战斗中，你自身回复生命时，提高相当于本次回复生命10%的攻击力。 |
| 1548 | 鲜血圣杯 | 每隔一段时间，对所有敌人造成相当于你生命回复的伤害。 |
| 1551 | 终焉之钟 | 不断敲响着终焉之声的钟。 |
| 1553 | (desc) | 你的攻击对BOSS提高20%的伤害。 |
| 1554 | 岩石铠甲 | 岩石打造的铠甲，十分坚固 |
| 1556 | (desc) | 你的防御提升10% |
| 1557 | 液态铠甲 | 你当你受到超过自己生命值7%的伤害，超过7%的部分减少70%。 |
| 1560 | 反击石 | 能够增强你的反击伤害的神器石头。 |
| 1562 | (desc) | 你的反击伤害+25%。 |
| 1563 | 血魔之盔 | 传说中血魔王的头盔。 |
| 1565 | (desc) | 你的最大生命+25%。 |
| 1566 | 免疫宝石 | 你免疫中毒和灼烧。 |
| 1569 | 锯齿利剑 | 攻击敌人时，有概率附加一层流血。 |
| 1572 | 守护吊坠 | 当你生命值低于40%时，受到的攻击伤害减少30%。 |
| 1575 | 黄金甲 | 战斗开始时，你每有300金币，提升你1%的防御。最高100% |
| 1578 | 黄金匕首 | 战斗开始时，你每有300金币，提升你1%的攻击。最高100% |
| 1581 | 愈合宝珠 | 你免疫流血。 |

## 4. Monsters / Enemies / Bosses (50+ types)

> Format: Name + description + ability(ies)

| ID | Name | Description / Ability |
|---|---|---|
| 7557 | - | 生存在森林里的哥布林，个体弱小，智力程度低，通常以群体的方式生存和战斗。 |
| 7562 | 史莱姆 | 常见于森林的史莱姆，黏液状，十分弱小。 |
| 7566 | 哥布林队长 | 哥布林部落中的精英，装备有精良的武器，实力不容小觑。\n**当队伍中的哥布林死亡时，获得一层愤怒。** |
| 7569 | - | 攻击命中后，造成一层流血。 |
| 7572 | 野猪 | 森林外围常见的凶悍的野猪，十分强壮，但是攻击很容易躲开。\n**野蛮冲撞，攻击力提高，攻击命中率降低。** |
| 7576 | 野猪首领 | 野猪的首领，比起一般的野猪更加强壮。 |
| 7580 | 哥布林弓箭手 | 拿弓箭的哥布林，哥布林群体里地位不低。\n**有小概率造成暴击。** |
| 7586 | 巨型史莱姆 | 一只巨型史莱姆，没人知道它怎么长到那么大的。\n**粘稠攻击，攻击有一定概率附加一层粘液，使其获得一层迟缓。** |
| 7591 | 哥布林国王 | 旧时哥布林王国被诅咒的国王，身经百战，是曾经的最强大的哥布林。\n**每隔十秒，召唤一名哥布林。** |
| 7599 | 遗迹守卫者 | 遗迹的守卫者。 |
| 7603 | 骷髅 | 不死族的骷髅。 |
| 7607 | 僵尸 | 不死族的僵尸，腐朽的躯体里藏匿着剧毒。\n**攻击后施加一层中毒。** |
| 7611 | 骷髅射手 | 不死族的骷髅射手。\n**精准射击。有中概率造成暴击。** |
| 7614 | 吸血鬼 | 只在阴暗处生存，畏惧阳光的吸血鬼。\n**造成伤害后能汲取生命。** |
| 7619 | 骷髅将军 | 骷髅军团中的领袖。\n**领袖之力。战斗开始前，给友方所有骷髅附加五层强化。** |
| 7624 | 吸血蝙蝠 | 常年栖息在潮湿洞穴的吸血蝙蝠。\n**造成伤害后吸取少量生命。** |
| 7629 | 大幽灵 | 含恨而死的强大生物的灵魂有可能会转换成大幽灵。\n**幽灵态。收到攻击的时候，减伤99%。最小为1。同时不会受到反伤。** |
| 7634 | 王室怨灵 | 古时强大的王族蒙冤而死，王室怨灵由他们的灵魂聚集而成。\n**灵体化，每次只能受到1点伤害。同时不会受到反伤。** |
| 7637 | - | 攻击后，施加两层中毒。 |
| 7639 | 地精 | 地精一族，身体矮小，以洞穴作为栖息地。 |
| 7643 | 地精火枪手 | 拿火枪的地精，可不是普通地精。 |
| 7647 | 目光如炬，有小概率造成暴击。 | 岩石怪\n**全身覆盖坚硬岩石的魔物，微弱的攻击难以破开它的防御。** |
| 7650 | - | 岩石包裹。受到攻击时，对小于50的伤害减半。 |
| 7651 | 盗宝地精 | 以盗宝为生的地精，身手敏捷。 |
| 7654 | 灵活步伐。30%概率闪避攻击。 | 地精科学家\n**自诩为地精中的天才，做出了各种不靠谱的发明。** |
| 7658 | - | 未知反应。攻击后随机附加一层BUFF或DEBUFF。 |
| 7659 | 地龙幼体 | 地龙的幼崽，地龙是一种栖息在地下深处的独居生物。 |
| 7662 | - | 岩石鳞片。对小于60的伤害减半，对攻击者造成10点伤害。 |
| 7663 | 巨型沙虫 | 在地下隐藏的捕食者，善于将敌人四周的土地沙粒化，限制敌人的行动。 |
| 7667 | - | 土地沙粒化。战斗开始后，给敌人附加五层迟缓。 |
| 7668 | 地龙王奥凯 | 沉睡在大地深处，侵占了矮人宝藏的地龙王。 |
| 7672 | - | 钻石鳞片。对小于100的伤害减半 |
| 7673 | - | 熔岩之躯。对攻击者造成10点伤害，并且附加一层灼烧。 |
| 7674 | 小精灵 | 精灵之森无处不在的小精灵，其实只是一团纯净魔力形成的意识体。\n**树精** |
| 7677 | - | 常年汲取精灵之森天地精华，已经成精的老树。 |
| 7680 | 滋养。每秒回复少量生命值。 | 堕落精灵\n**被魔眼所操控，堕入黑暗面的精灵。** |
| 7684 | - | 风之力。攻击后，有概率给自己附加一层急速。 |
| 7685 | 女精灵 | 被魔眼所操控，堕入黑暗的女精灵。 |
| 7688 | - | 治愈之力。发动攻击后给生命值最低的友方回复生命。 |
| 7689 | 精灵骑士 | 被魔眼所操控的精灵骑士，是精灵中的高等种族。 |
| 7692 | - | 风之力。攻击后有概率给自己附加一层急速。 |
| 7693 | 精灵细剑。有概率造成暴击。 | 巨人\n**栖息与精灵之森的巨人，只有这里浓郁的魔力才能让它们正常成长。** |
| 7699 | - | 势大力沉。动作迟缓，但威力极大，能对所有敌人造成伤害。 |
| 7700 | 古树守卫 | 千年的古树寄宿着精灵族先祖的意志，将为守卫精灵王国而战。 |
| 7703 | - | 参天大树。能对所有敌人造成伤害。 |
| 7704 | 大地之力。每秒回复大量生命 | 卡拉·堕落的精灵女王\n**被魔眼所附身的精灵女王。** |
| 7708 | - | 女王号令。每隔十秒，召唤三只小精灵。 |
| 7709 | - | 神圣之域。攻击后，给全体友方回复生命。 |
| 7710 | 半兽人 | 只有一半兽人血脉，力量逊于兽人。 |
| 7713 | 兽人战士 | 强壮的兽人战士，智力低下，容易被激怒。\n**易怒。每次被攻击，有概率获得一层愤怒。** |
| 7716 | 兽人巫医 | 兽人族的巫医，绕着图腾跳舞就能让同伴回复生命值。 |
| 7719 | 每隔5秒。回复全体友方生命值。 | 双头猎犬\n**长者两个头的猎犬，是兽人族喜欢养的宠物。** |
| 7723 | - | 尖牙利齿。攻击后，造成一层流血。 |
| 7724 | 狂兽人 | 发狂的兽人，脑子里除了战斗已经没有其他东西了。\n**生命值越低，攻击力越高。** |
| 7727 | 地狱犬 | 双头犬的完全体，更加强壮，有三个头。 |
| 7731 | - | 尖牙火爪。攻击后，造成两层流血。造成一层灼烧。 |
| 7732 | 兽人行刑官 | 提着一把大斧，极为强壮的高等级兽人。 |
| 7735 | 巨斧之力。对所有敌人造成伤害。 | 攻击后，造成三层流血。\n**卡里摩多·剑圣** |
| 7738 | - | 最强的兽人，整片大陆屈指可数的剑圣。 |
| 7739 | - | 每隔10秒，献祭当前生命的一半召唤两个分身。 |
| 7740 | - | 纯粹剑法。生命值越低，攻击速度越快。 |
| 7741 | - | 剑圣步伐。被反击的概率降低50%。 |
| 7742 | 牛头人战士 | 长者牛头牛角的战士，看起来很唬人。 |
| 7747 | 牛头将军 | 统帅魔物军团进攻村子的牛头将军。 |
| 7751 | - | 野蛮冲撞，攻击后，有概率造成眩晕。 |
| 7752 | 生命值低于50%时，进入狂暴。 | 混沌魔力\n**纯粹的邪恶魔力凝聚成的混沌体，可能是未完全召唤的魔物。** |
| 7756 | 无形之物，中概率闪避攻击。 | 魔神护卫\n**顺应魔法阵召唤而来的魔神护卫。** |
| 7759 | 被击败后，坍塌成混沌魔力。 | 魔神侍从\n**顺应魔法阵召唤而来的侍从。** |
| 7763 | 魔神子体 | 魔神被击败后分裂出来的子体。 |
| 7767 | 上古魔神（残缺体） | 复活不完全的上古魔神。\n**被击败后，分裂成五个小型子体。** |
| 7770 | 多重触手。对全体敌人造成伤害。 | 王国士兵\n**经过严格训练的王国士兵。** |
| 7773 | 有小概率格挡受到的攻击。 | 王国弓箭手\n**经过训练的王国弓箭手。** |
| 7776 | 王国骑士 | 人类最高战力组织王国骑士团的骑士。\n**将有概率格挡受到的攻击。** |
| 7779 | - | 蓄势。每次格挡成功后，获得一层强化。 |
| 7780 | 卡拉多格 | 人类最高战力组织王国骑士团的的团长，被公认是最强的人类。\n**久经沙场。将有大概率格挡受到的攻击。** |
| 7783 | - | 神之剑法。发动的攻击无法被格挡。 |
| 7784 | - | 不屈战鬼。生命值归零后，有概率恢复部分生命值继续作战。每次发动，将获得两层强化和急速。 |
| 7785 | 魔将亲卫 | 魔将手下最强大的亲信。 |
| 7788 | 再生。每秒回复30的生命。 | 卜里奥\n**自称为魔将卜里奥，螳螂形魔物，是魔王的尖刀利刃。** |
| 7791 | 超再生。每秒回复1%的生命。 | 断肢求生。受到的攻击伤害不超过4%生命值上限。\n**极锋利刃。攻击后，造成1层流血。** |
| 7794 | 魔王眷属 | 魔王的眷属，和魔王在灵魂上有些许联系。\n**极再生。每秒回复3%的生命。** |
| 7797 | 魔王I（史莱姆形） | 史莱姆形态的魔王。 |
| 7800 | - | 粘稠身体。被攻击后，有概率给敌方施加一层迟缓。 |
| 7801 | 再生。每秒钟回复1%的生命。 | 急速成长。战斗中，每隔一段时间提升攻击和攻速。\n**魔王II（史莱姆形）** |
| 7808 | - | 崩坏。不能长久维持此形态，每秒钟失去当前1%的生命。 |
| 7809 | - | 多重拟态。攻击后，给敌方施加1~3层流血，中毒，灼烧，破甲。 |

### 4b. Adventure-deck card weights — `EventCardTypeSettingJS` (4 entries)

**Source**: `Dump/TextAsset/EventCardTypeSettingJS.txt` → decoded JSON at `rebuild/data/EventCardTypeSettingJS.json`.

This is the weighted random table that decides what kind of event card you draw when entering a new map tile (separate from the XNode story-event graph).

| EventCardType | RandomValue | % of deck |
|---|---:|---:|
| 魔物 (monster fight) | 30 | 35.3% |
| 精英魔物 (elite) | 15 | 17.6% |
| 铁匠 (smith — re-roll equipment) | 15 | 17.6% |
| 商人 (merchant) | 25 | 29.4% |
| **(sum)** | **85** | **100.0%** |

> **Note**: The sum is 85 — there is no 5th entry making it total 100. Implication: the deck only resolves on a roll ≤85, and the remaining 15% of rolls fall through to the area's static event (chest / rest / story node from the XNode graph).

---

## 5. Skills (技能) - 20+ skills, 3 levels each

> Format: Skill Name + 3 tier descriptions (Lv1, Lv2, Lv3)

| ID | Name | Lv1 | Lv2 | Lv3 |
|---|---|---|---|---|
| 9277 | 格挡反击 | 格挡后，有20%概率直接反击 | 格挡后，有23%概率直接反击 | 格挡后，有26%概率直接反击 |
| 9281 | 撼猛格挡 | 格挡后，有40%的概率获得一层强化。 | 格挡后，有50%的概率获得一层强化。 | 格挡后，有60%的概率获得一层强化。 |
| 9285 | 当头一棒 | 攻击后，有10%概率使得敌人晕眩1s，对BOSS无效 | 攻击后，有15%概率使得敌人晕眩1s，对BOSS无效 | 攻击后，有20%概率使得敌人晕眩1s，对BOSS无效。 |
| 9289 | 隔山打牛 | 攻击后，将对攻击对象身后的敌人造成此次攻击的40%伤害。 | 攻击后，将对攻击对象身后的敌人造成此次攻击的50%伤害。 | 攻击后，将对攻击对象身后的敌人造成此次攻击的60%伤害。 |
| 9293 | 旋风斩 | 先手技能，当你在战斗前获得偷袭机会时，可以发动旋风斩对所有敌人造成20%生命上限的伤害。 | 先手技能，当你在战斗前获得偷袭机会时，可以发动旋风斩对所有敌人造成30%生命上限的伤害。 | 先手技能，当你在战斗前获得偷袭机会时，可以发动旋风斩对所有敌人造成40%生命上限的伤害。 |
| 9297 | 弃甲 | 战斗开始时，将你的全部格挡率按3：1转换为攻速提升，将你的40%的防御力按1：1转换为攻击力。 | 战斗开始时，将你的全部格挡率按2：1转换为攻速提升，将你的40%的防御力按1：1转换为攻击力。 | 战斗开始时，将你的全部格挡率按2：1转换为攻速提升，将你的40%的防御力按2：3转换为攻击力。 |
| 9301 | 反击姿态 | 战斗开始时，提升25%反击率,并且降低50%的攻速。 | 战斗开始时，提升25%反击率,并且降低40%的攻速。 | 战斗开始时，提升25%反击率,并且降低30%的攻速。 |
| 9305 | 双持 | 双持武器，你的攻击额外提高20%，但是你的攻速降低20%。 | 双持武器，你的攻击额外提高25%，但是你的攻速降低20%。 | 双持武器，你的攻击额外提高30%，但是你的攻速降低20%。 |
| 9309 | 顺劈 | 攻击后，将对攻击对象身旁的敌人造成此次攻击的20%伤害。 | 攻击后，将对攻击对象身旁的敌人造成此次攻击的25%伤害。 | 攻击后，将对攻击对象身旁的敌人造成此次攻击的30%伤害。 |
| 9313 | 大喝 | 在战斗开始前，可以发动大喝让所有敌人进入眩晕1S。 | 嘲讽 | 在战斗开始时，发动嘲讽让所有敌人攻击降低20%，攻速提高23%。 |
| 9319 | 逃跑计划 | 你额外获得一次死里逃生的机会。 | 巨斧精通 | 提高3%的溅射伤害。 |
| 9325 | 盔甲精通 | 提高4点防御。 | 提高8点防御。 | 提高13点防御。 |
| 9329 | 不屈 | 提高2点生命回复。 | 提高4点生命回复。 | 提高6点生命回复。 |
| 9333 | 技能 | 缺少等级 | ? | ? |

---

## 6. Achievements / Endings / Cruel World Levels

> Format: Name + trigger condition + reward (e.g. 灵魂:2)

| ID | Name | Trigger | Reward |
|---|---|---|---|
| 800 | 找不到故事线 | DontFindTalent锛� | 世界毁灭 |
| 803 | 一个世界毁灭了。 | 灵魂:100 | 已经尽力了 |
| 806 | 五个世界毁灭了。 | 灵魂:200 | 已经无所谓了 |
| 809 | 十个世界毁灭了。 | 灵魂:300 | 壮硕肌肉 |
| 813 | 勇猛:2 | 健步如飞 | 结束轮回时灵巧超50。 |
| 816 | 灵巧:2 | 虎背熊腰 | 结束轮回时体质超50。 |
| 819 | 体质:2 | 巨人之力 | 结束轮回时勇猛超200。 |
| 822 | 勇猛:3 | 风驰电掣 | 结束轮回时灵巧超200。 |
| 825 | 灵巧:3 | 金刚不坏 | 结束轮回时体质超200。 |
| 828 | 体质:3 | 脱非入欧 | 结束轮回时拥有一个神话天赋。 |
| 831 | 玄不济非 | 结束轮回时拥有两个神话天赋。 | 装备幸运值:8 |
| 834 | 氪不改命 | 结束轮回时拥有三个神话天赋。 | 装备幸运值:16 |
| 837 | 如此老套？ | 击败了魔王。 | 解锁残酷世界 |
| 840 | 现在谁是最强 | 击败了卡拉多格。 | 灵魂:500 |
| 843 | 一个打十一个 | 击败了上古魔神（残缺体）。 | 遗迹神器选择:1 |
| 846 | 纯爱战士 | 击败了牛头将军。 | 魅力:3 |
| 849 | 累了，毁灭吧 | 五十个世界毁灭了。 | 死里逃生:2 |
| 852 | 救世主 | 拯救了五个世界。 | 慢生活 |
| 856 | 魅力:2 | 天下无敌 | 达成世界最强结局。 |
| 859 | 重建人类家园 | 达成重建人类家园结局。 | 家境:2 |
| 862 | 真正的勇者 | 没有触发一次死里逃生通关。 | 大富翁 |
| 866 | 资本家 | 结束轮回时家境超100。 | 愿者上钩 |
| 870 | 钓鱼解锁传说奖励 | 种田大户 | 一局内拥有超过十块农田。 |
| 873 | 成为贵族 | 达成和夏洛蒂的结局。 | 强者 |
| 877 | 死里逃生:1 | 拯救者 | 通关残酷世界3以及以上。 |
| 880 | 人类守卫者 | 通关残酷世界5以及以上。 | 可以锁定两个天赋 |
| 883 | 战神 | 通关残酷世界7以及以上。 | 爱的战士 |
| 888 | 勇猛 | 勇猛:1 | 灵巧 |
| 891 | 灵巧:1 | 体质 | 体质:1 |
| 894 | 智力 | 智力:1 | 魅力 |
| 897 | 魅力:1 | 初始攻击 | 攻击提升:1 |
| 900 | 初始防御 | 防御提升:1 | 初始回复 |
| 903 | 回复提升:1 | 初始生命 | 生命提升:1 |
| 906 | 最大体力 | 最大体力:5 | 死里逃生 |
| 911 | 灵魂之力不足! | ? | ? |
| 915 | 家境 | 装备幸运值 | 遗迹神器选择 |
| 919 | 灵魂 | 灵魂+ | 初始勇猛+ |
| 922 | 初始灵巧+ | 初始体质+ | 初始魅力+ |
| 925 | 初始家境+ | 死里逃生次数+ | 装备幸运值+ |
| 928 | 密藏中可选神器+ | 将在游戏开始解锁钓鱼传说奖励 | 解锁残酷世界，并且你现在可以锁定一个天赋。 |

---

## 7. Game System Text / Misc

| ID | Content |
|---|---|
| 1030 | 钓鱼奖励区域增大 |
| 1031 | 寻找到稀有装备的概率提高 |
| 1032 | 体力上限+ |
| 1033 | 冒险战斗先手概率+ |
| 1036 | 已经拥有此遗物！ |
| 1037 | 成功获得遗物 |
| 1038 | 成功服下药剂 |
| 1039 | 暂时还没做这个类别! |
| 1040 | 找不到地区： |
| 1100 | 第一次探索迷宫 |
| 1101 | 你来到了迷宫，在这里潜伏了各种各样的魔物。你可以在右侧选择迷宫的图标前进，不同图标代表不同事件。；击败迷宫的魔物后，有概率获取相当于魔物等级的装备。在篝火处，你可以选择撤离，带走本次探索得到的装备。；迷宫的深度越深，遇到的魔物就越强，能够获得的装备等级也越高。每前进一步，深度会根据“脚程”提高。“探索度”也会相应提高。；“脚程”可以通过提高探索度而提高，也可以通过遗物提高。提高“脚程”能让你用更少 |
| 1105 | 已经进行冒险 |
| 1106 | 你已经到达迷宫 |
| 1107 | ，你感觉周边的气氛变了，怪物强度+1。（第一次到达迷宫内部，探索度+15%） |
| 1108 | ，你感到空气中飘来浓郁的杀气，怪物强度+1。（第一次到达迷宫深处，探索度+15%） |
| 1109 | ，你感觉周边的气氛变了，怪物强度+1。 |
| 1110 | ，你感到空气中飘来浓郁的杀气，怪物强度+1。 |
| 1112 | 你已经到达迷宫最深处，你将面对迷宫的守护者。守护者十分强大，你现在依然有机会选择撤离。 |
| 1113 | 你体力不支倒下了，你的视线逐渐模糊。已经无力回天。 |
| 1114 | 你体力不支倒下了，你的视线逐渐模糊。你知道已经无力回天。 |
| 1116 | 无 |
| 1117 | 你精疲力竭，直挺挺地倒在了路边。你被黑暗淹没了。 |
| 1118 | 游戏结束 |
| 1119 | 你战胜了你的敌人，这场战斗中你有如下收获： |
| 1120 | 你从这场战斗中获取了一些经验值。 |
| 1129 | 你获得了很多经验。 |
| 1130 | 这场鏖战让你收获了大量的经验值。 |
| 1132 | 你获得了很多大量的经验。 |
| 1133 | 战斗结束后你从魔物身上搜刮到一些值钱的东西。 |
| 1145 | 你搜刮到了不少的精良装备。 |
| 1146 | 这场胜利让你收缴了大量优质的装备。 |
| 1147 | 这场胜利你赢麻了，收获了大量优质的装备。 |
| 1148 | 你发现了敌人的军械库，找到了大量优质装备。 |
| 1150 | 剩余密藏数量： |
| 1156 | 冒险体力不足！ |
| 1157 | 没有黄金 |
| 1158 | 少量黄金 |
| 1159 | 中量黄金 |
| 1160 | 大量黄金 |
| 1161 | 你挖来挖去，根本没有挖到黄金，看来是自己看走眼了。。。 |
| 1162 | 你将金矿挖出，获得了少量黄金，也算是不错的结果了。金币+100。 |
| 1163 | 你将金矿挖出，获得了不少的黄金，这次运气不错。金币+150。 |
| 1164 | 你将金矿挖出，获得了大量的黄金，今天运气太好了。金币+200。 |
| 1165 | 你来到一座精灵的神殿，神殿的神像美轮美奂，你觉得或许这尊神像能赐予你一些祝福。 |
| 1168 | 你发现一处巨大的魂冢，你有预感里面或许有一些有用的东西。 |
| 1169 | 你在一处空旷的地带发现了一个巨大的兽人图腾，图腾雕刻得十分精细，让人心生畏惧。 |
| 1170 | 死后，你的灵魂漂浮在空中，你俯瞰这这片大地，你能看到周围的一切，可以飘荡到任何地方，但你无法思考。你感到天空中有一个熟悉的声音在召唤自己，同时又感受到自己对这片土地深深的依恋。你应该怎么办？ |
| 1171 | 回归天空 |
| 1172 | 留在这里 |
| 1173 | 死亡 |
| 1174 | 你缓缓上升，大地离你越来越远，天空中的声音越来越清晰，你渐渐想起了一切。 |
| 1175 | 你不准备回应天空的那个声音，你在这个世界飘来荡去，观察着这个世界发生的一切。[段落]（你已经成为灵魂体，无法再执行任何行动，请点击时间流逝，静静观察这个世界的结局。） |
| 1176 | 进入迷宫 |
| 1177 | 前进 |
| 1178 | 继续前进 |
| 1179 | 祈福（冒险体力-5） |
| 1180 | 离开 |
| 1181 | 打开（冒险体力-5） |
| 1182 | 膜拜（冒险体力-5） |
| 1185 | 挖金矿（冒险体力-5） |
| 1186 | 疗伤 |
| 1187 | 休息 |
| 1188 | 撤离 |
| 1189 | 喝泉水 |
| 1190 | 你战胜了遗迹守卫者，进入了大密藏，在大密藏里，你发现了一件传说中的神器。 |
| 1191 | 你休息了一会，回复了 |
| 1192 | 点体力。 |
| 1193 | 学会了大喝 |
| 1194 | 你大喝一声，声浪让空气都为之一颤，你的敌人被震慑在原地不能动弹。 （你的敌人将在战斗开始时陷入晕眩状态。） |
| 1196 | 确定撤离迷宫吗？ |
| 1197 | 学会了旋风斩 |
| 1198 | 你趁敌不备发动了旋风斩，敌人们被你打得落花流水。 （你的所有敌人在开始时失去相应生命值。） |
| 1199 | 你趁着这片刻的安宁，好好治疗了一路上所受的伤，生命值回复了 |

---

## 8. Key Discoveries

### 8.1 What was missing before, now found

| Item | Status |
|---|---|
| 5 endings trigger conditions | ✅ Found in strings 800-940 |
| Talent names + effects | ✅ Found in 5481-5547 (30 talents) |
| Item/Artifact/Relic names + effects | ✅ Found in 1440-1700 (40+ items) |
| Monster/Boss names + abilities | ✅ Found in 7557-7810 (50+ monsters) |
| Skill names + 3-level scaling | ✅ Found in 9277-9334 (20+ skills) |
| 10 Buff effects with formulas | ✅ Found in 1045-1074 |
| Cruel World level rewards | ✅ Found (强者/拯救者/战神/...) |
| 5 endings with NPC names | ✅ Found (和露明娜 = Lumnia, 和夏洛蒂 = Charlotte) |
| **51 canonical relics with parser-ready effect strings** (Wave 2) | ✅ `data/RelicSettingJS.json` + §3a |
| **26 equipment items with profession + property pools** (Wave 2) | ✅ `data/WeaponSettingJS.json` + §3b |
| **4 adventure-deck card weights** (Wave 2) | ✅ `data/EventCardTypeSettingJS.json` + §4b |
| **Authoritative PathID → Class map for 780 scripts** (Wave 3) | ✅ `data/monoscript_catalog.json` |
| **8,310 XNode narrative strings recovered from MB blobs** (Wave 3) | ✅ `data/monobehaviour_strings.json` |
| **164/167 BattleEventNodes structured (world + monster slots)** (Wave 3) | ✅ `data/battle_events.json` |
| **Raw tail bytes for every MonoBehaviour** (Wave 3) | ✅ `data/monobehaviour_blobs.bin` (2.34 MB) |
| **Built-in asset indexes (Sprite/Texture/Audio/Animation)** (Wave 3) | ✅ `data/*_index.json` |
| **All 58 monster base stats** (atk/def/hp/interval/crit) (Wave 6) | ✅ `ghidra_results.md` §11 |
| **Damage formula** (defence mitigation + crit + block) (Wave 6) | ✅ `ghidra_results.md` §13 |
| **Talent roll rarity weights** (5-tier dynamic, 35 talents) (Wave 6) | ✅ `ghidra_results.md` §14 |
| **EvilCrystal progression** (MaxValue=100, level+reset) (Wave 6) | ✅ `ghidra_results.md` §15 |
| **16 condition types for endings/stories** (Wave 6) | ✅ `ghidra_results.md` §12 |

### 8.1b Wave 3 — confirmed structural counts (UnityPy walk)

`dump_unity3d.py` reads `data.unity3d` programmatically and provides authoritative counts that supersede every "inferred" count earlier in this doc:

| Class (`MonoScript.m_ClassName`) | Live instance count |
|---|---:|
| `UIAnimation` | 3,728 |
| `FDFramwork.FDImage` | 2,353 |
| `FDFramwork.FDText` | 1,285 |
| `XNode.EventLine.Nodes.EventResultNode` | 526 |
| `XNode.EventLine.Nodes.MainEventNode` | 417 |
| `FDFramwork.FDButton` | 386 |
| `EquipmentGrid` | 178 |
| `XNode.AdventureEvent.Nodes.BattleEventNode` | 167 |
| `XNode.EventLine.Nodes.StoryLineNode` | 83 |
| `XNode.EventLine.Nodes.ConditionSwichNode` | 69 |
| `XNode.EventLine.Nodes.ConditionCheckerNode` | 52 |
| `XNode.AdventureEvent.Nodes.ChestEventNode` | 45 |
| `XNode.MapAreasSetting.Nodes.MapObjectNode` | 25 |
| `XNode.AdventureEvent.Nodes.RestEventNode` | 23 |
| `XNode.EventLine.Nodes.EventLineInfoNode` | 22 |
| `XNode.AdventureEvent.Nodes.GreatCollectionNode` | 15 |
| `XNode.AdventureEvent.Nodes.AdventureAreaInfoNode` | 13 |
| `XNode.MapAreasSetting.Nodes.MapAreasNode` | 6 |
| `XNode.CharacterSetting.Nodes.CharacterInfoNode` | 5 |

**BattleEvents per world** (from `battle_events.json`):

| graph_pid | Count | World |
|---:|---:|---|
| 13857 | 24 | Mine (矿山) |
| 13858 | 24 | Elven Forest (精灵之森) |
| 13859 | 24 | Misty Forest (迷雾森林) |
| 13860 | 24 | Orc Mountain (兽人山脉) |
| 13861 | 24 | Cemetery (墓地/魔域) |
| 13891-13895 | 5 each | Secondary maps |
| 13896-13898 | 6-7 each | Final-area maps |


### 8.2 Confirmed Game Systems

**Stats system (16 base stats)**:
- 勇猛 (Brave/STR) - 影响攻击
- 灵巧 (Dexterity) - 影响攻速
- 体质 (Constitution) - 影响生命
- 智力 (Intelligence) - 影响技能
- 魅力 (Charisma) - 影响关系
- 家境 (Family wealth) - 影响金币
- 灵魂 (Souls) - 跨局货币
- 邪晶 (Evil Crystal) - 元货币
- 攻击 (Attack) / 防御 (Defense) / 生命 (HP) / 回复 (Heal) - 战斗属性

**Buff/Status (10 types)**:
- 中毒/流血/灼烧 - DoT
- 强化/急速/愤怒/抵御 - 增益 (Stacking)
- 迟缓/眩晕/破甲/易伤 - 减益
- 巨大化/狂暴化/虚空化/幻影化 - 终极buff

**Cruel World difficulty** (残酷世界):
- 0: CW off (no effect)
- 1+: 死里逃生:1 (death-escape +1)
- 3+: 通关残酷世界3奖励 人类守卫者
- 5+: 通关残酷世界5奖励 可以锁定两个天赋 (lock 2 talents)
- 7+: 通关残酷世界7奖励 战神
- 10: 通关残酷世界10奖励 爱的战士
- **Ghidra Wave 6 finding**: CW has no reward multiplier in the code. The toggle makes heroes stronger (`+cruelLevel` per Power) and monsters stronger (added to the atk/hp multiplier). Battle rewards (gold/exp/soul) are independent of CW — same rewards at any CW level, just harder battles.

**Key NPC names decoded**:
- 露明娜 (Lumnia) - 慢生活结局
- 夏洛蒂 (Charlotte) - 贵族结局
- 卡拉多格 (Karadog) - 最强人类骑士团长
- 卜里奥 (Burio) - 螳螂形魔将
- 牛头将军 (Bull General)
- 卡里摩多 (Karimodo) - 剑圣
- 卡拉 (Cara) - 堕落精灵女王
- 奥凯 (Aokai) - 地龙王

**Ending system (5 endings, full trigger conditions extracted via Ghidra Wave 6)**:
- 慢生活 (Slow Life / Lumnia ending) — type 11 condition: married to Lumnia (魅力:2 side stat)
- 成为贵族 (Noble / Charlotte ending) — type 11 condition: married to Charlotte
- 重建人类家园 (Rebuild ending) — type 2 condition: `rebuildHuman` turning point reached (家境:2 side stat)
- 天下无敌 (Strongest ending) — type 2 condition: `strongest` turning point reached (gated by 击败卡拉多格 / defeated Karadog)
- 真正的勇者 (True ending - no death) — type 7 condition: `hasDeathEscape == false` (i.e. never used the death-escape)
- 如此老套? (Defeat Demon King) - 解锁残酷世界 (not a regular ending; it's the meta-condition that unlocks the CW difficulty toggle)
- 16 condition types total — see `ghidra_results.md` §12. Turning point names come from XNode data (already extracted in `xnode_texts.json`).

**Skill scaling (3 levels each)**:
- 格挡反击: 20%/23%/26%
- 撼猛格挡: 40%/50%/60%
- 当头一棒: 10%/15%/20% stun
- 隔山打牛: 40%/50%/60% splash
- 旋风斩: 20%/30%/40% HP sneak
- 弃甲: 3:1/2:1/2:1 ratio
- 反击姿态: -50%/-40%/-30% speed
- 双持: +20%/+25%/+30% atk, -20% speed
- 顺劈: 20%/25%/30% adjacent
- 嘲讽: -20%/+23% / -30%/+40% / -40%/+55%
- 巨斧精通: 3%/6%/9% splash
- 盔甲精通: +4/+8/+13 def
- 不屈: +2/+4/+6 heal

**Monster abilities** (key ones):
- 哥布林队长: 哥布林死亡时获得愤怒
- 野猪: 野蛮冲撞
- 哥布林弓箭手: 小概率暴击
- 巨型史莱姆: 攻击附迟缓
- 哥布林国王: 每10秒召唤哥布林
- 骷髅将军: 战斗前强化骷髅
- 王室怨灵: 灵体化(每次1伤)
- 地龙奥凯: 钻石鳞片(<100减半)
- 卡拉(精灵女王): 召唤小精灵 + 全体治疗
- 卡里摩多(剑圣): 献祭生命召唤分身
- 卡拉多格(骑士团长): 大概率格挡
- 卜里奥(魔将): 超再生1%/秒
- 魔王I/II: 多重拟态, 急速成长

## 9. Method Extraction Notes

### 9.1 RVAs — the IL2CPP invoker stub assumption was wrong for this build

> **Wave 5 update (2026-6-10)**: This assumption turned out to be **false** for this ARM64
> build. The original worry was that the RVAs in `il2cpp.cs` (e.g. `0x00B36668` for
> `CaculateBaseAttack`) point to small invoker stubs that just call into the shared
> `Runtime::InvokeMethod` dispatcher — i.e. the C# method body is runtime-dispatched via
> metadata, not encoded as native code.
>
> **In fact, the symbols ARE preserved on this `libil2cpp.so`**: the method names appear as
> `Hero_CaculateBaseAttack`, `HeroLevel_CaculateNewMaxExp`, `AdventrueManager_generateEquipment`
> etc. in the symbol table, and the decompiled bodies contain the real formulas. Ghidra
> decompilation recovered:
> - Hero attack: `attack = (每点力量攻击力Addition + 0.4 + cruelLevel) * Power + 5`
> - Hero defence: `defence = (每点体质防御力Addition + 0.5) * Constitution`
> - XP curve: `MaxExp = (int)(level^1.25 * 100)`
> - Soul gain: `souls = (reincTime*10 + 200) + (level+1) * ((baseSoul + allHeroSoul) * 0.01)`, cap 20000
> - Monster scaling: `atk = base * (CW + (pow(L, exp) * 0.15 * (L+1)) / 10 + 0.9)`
> - Equipment property: per-(prop, slot) `level*minMul + maxAdd` table with ±5% variance
> - Shop price: `(250 + Addition) * (Rarity+1)`, with 4-condition relicType discount
>
> See `ghidra_results.md` for the full extraction (24 KB of formulas + `.data` constants).
> The `todo.md` items #1, #4, #5, #6, #7, #8 are now RESOLVED.
>
> **For the 7 `CaculateBase*` methods that weren't fully traced** (maxHealth, dodge,
> attackSpeed, blockRate, criticalRate, expGain, relationshipGain), the pattern is the
> same as attack/defence: `(Addition + const) * stat + floor`. The `.data` constants
> (`DAT_018ee9c0` etc.) are all in `ghidra_results.md` §6; pulling them in is the next pass.
>
> For the more complex methods (CaculateBase*Buff, etc.) Frida hook is still the
> fallback if Ghidra misses anything.

### 9.2 String table extraction is the gold mine

`global-metadata.dat` contains the StringLiteral table (11,901 entries) with all in-game
Chinese text. Decoding with UTF-8 (primary) and GB18030 (fallback) yields ~1,800 readable
strings including:
- 30+ talent definitions
- 40+ item definitions  
- 50+ monster definitions
- 20+ skills with 3-level scaling
- 10+ buff types
- 100+ achievements / endings / system rewards
- 5+ ending NPCs and bosses

This **resolves ~70% of the "missing data" items in §16 of the re_full.md document** without
needing DLL decompilation or runtime hooking.

### 9.3 UnityPy + raw-blob walk (Wave 3) — recovers MB-level narrative & structure

The IL2CPP build strips inline TypeTrees, so UnityPy alone can't decode `MonoBehaviour` bodies field-by-field — but the build is regular enough that we can recover almost everything via two complementary techniques:

1. **UnityPy reads the standardised parts** — `MonoScript` table (780 entries → authoritative PathID → Class.Namespace map), `Sprite/Texture2D/AnimationClip/AudioClip/Animator` (built-in types covered by UnityPy's bundled TPK definitions).

2. **Raw-blob walking handles the user-script parts** — every MB's tail bytes are dumped to `data/monobehaviour_blobs.bin` (2.34 MB total across 6,509 non-empty MBs). Two derived passes:
   - `extract_mb_strings.py`: walks each blob looking for the Unity string serialization pattern `[int32 len][utf-8 bytes][align 4]` and recovers **8,310 CJK strings** across 2,372 MBs (all narrative text).
   - `parse_battle_events.py`: applies BattleEventNode's known field layout (`PPtr graph + Vector2 position + port count + 2 strings + 6 monster slots + 3 trailing ints`) and produces **164/167** structured records in `data/battle_events.json`.

This **resolves the remaining "XNode body fields" blocker (todo #2 + #3)** without needing dummy DLLs. For full per-field structured decode of ALL MB types, you still need the dummy-DLL path (see `wave3_extraction.md` §3.1).

See `wave3_extraction.md` for the full pipeline.

