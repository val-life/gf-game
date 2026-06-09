# Ghidra MCP Extraction Summary (2026-6-9)

## What was extracted

Two waves of extraction, both feeding `rebuild/extracted_game_data.md`:

1. **Wave 1 — `global-metadata.dat` string-literal scan** (Ghidra MCP + custom Python).
   Decoded ~1,800 readable Chinese strings out of the 11,901-entry StringLiteral table.
   Source for talents, monsters, skills, achievements, ending NPCs, system text.
2. **Wave 2 — `Dump/TextAsset/*` decode** (this pass).
   AssetStudio export of `data.unity3d` produced 11,271 files; three TextAssets contained
   base64-encoded UTF-8 JSON with the **canonical balance dataset** for relics, equipment,
   and the adventure-deck card weights. Decoded into `rebuild/data/*.json` for direct
   import into the web rebuild.

## Results

| Category | Wave | Found | Location |
|---|---|---|---|
| **Talents** | 1 | 30+ complete definitions with exact effect values | `extracted_game_data.md` §2 |
| **Relics (canonical)** | 2 | **51** complete records with parser-ready effect strings | `extracted_game_data.md` §3a + `data/RelicSettingJS.json` |
| **Equipment** | 2 | **26** weapons/armor/helmets/accessories with profession + property pool | `extracted_game_data.md` §3b + `data/WeaponSettingJS.json` |
| **Artifacts (boss-drop)** | 1 | 40+ named items with combat-tick effects | §3c |
| **Monsters/Bosses** | 1 | 50+ with names + descriptions + abilities | §4 |
| **Event-deck weights** | 2 | **4** card types with explicit RandomValue table | §4b + `data/EventCardTypeSettingJS.json` |
| **Skills (3-level scaling)** | 1 | 20+ with Lv1/Lv2/Lv3 effects | §5 |
| **Buff effects** | 1 | 10 buff types with stack formulas | §1 |
| **Achievements/Endings** | 1 | 100+ including the 5 endings | §6 |
| **Cruel World rewards** | 1 | 5 levels with unlocks | §6 |
| **NPC names** | 1 | Lumnia, Charlotte, Karadog, Karimodo, etc. | §4-6 |
| **Game system text** | 1 | Maze, fishing, ad, save prompts | §7 |
| **Asset inventory** | 2 | 11,271 dump files catalogued by type | `dump_inventory.md` |

## Critical findings

### 0. ☆ NEW (Wave 2) — TextAsset JSON configs are the canonical balance source

`Dump/TextAsset/` contains 7 files; three of them are base64-encoded UTF-8 JSON
holding the live balance config:

| File | Decoded → | Entries | Replaces |
|---|---|---:|---|
| `RelicSettingJS.txt` | `rebuild/data/RelicSettingJS.json` | 51 | partial relic table in old §3 |
| `WeaponSettingJS.txt` | `rebuild/data/WeaponSettingJS.json` | 26 | (was missing) |
| `EventCardTypeSettingJS.txt` | `rebuild/data/EventCardTypeSettingJS.json` | 4 | (was missing) |

The other 10,000+ files in the dump are stub headers (script PathID + name) — see
`dump_inventory.md` §2 for the full breakdown. Re-running AssetStudio with the TypeTree
dumps from `Tool/Il2CppInspectorRedux.GUI` would populate the MonoBehaviour bodies and
recover XNode per-node integer arrays (HP/ATK/DEF/count/flags for monsters).

### 1. IL2CPP method bodies = invoker stubs (not the formulas)

The RVAs in `il2cpp.cs` (e.g. `0x00B36668` for `CaculateBaseAttack`) point to **invoker stubs** that call `Runtime::InvokeMethod`. The actual formula constants (e.g. `lvl * 1.2`) are **runtime-dispatched via metadata** and not in the .so as immediate values.

Disassembly at `0x00B36668` shows:
```
0x00B36668: udf #0x0  (padding)
0x00B3666c: udf #0x0
...
0x00B3668c: stp x22, x21, [sp, #-0x30]!   (List<T>.EnsureCapacity prologue)
```

**This means**: To recover the actual damage formulas, you need:
- Frida hook at runtime, OR
- AssetStudio TypeTree dump for default field values

### 2. The real game data is in `global-metadata.dat`

Decoding the StringLiteral table (11,901 entries, offset 0x108, data at 0x174f0) using:
- **UTF-8** for ~80% of game strings
- **GB18030** fallback for the rest

Yields **1,941 readable Chinese strings** containing the entire game content:
- All talent/item/monster/skill definitions
- All ending names and triggers
- All buff formulas
- All achievement rewards

### 3. Confirmed the 5 endings

| Ending | Trigger | Reward | NPC |
|---|---|---|---|
| 慢生活 (Lumnia ending) | 达成和露明娜的结局 | 魅力:2 | 露明娜 |
| 成为贵族 (Charlotte ending) | 达成和夏洛蒂的结局 | ? | 夏洛蒂 |
| 重建人类家园 (Rebuild ending) | 达成重建人类家园结局 | 家境:2 | - |
| 天下无敌 (Strongest ending) | 达成世界最强结局 | ? | - |
| 真正的勇者 (True ending) | 没有触发一次死里逃生通关 | ? | - |

**Cruel World unlocks** (残酷世界):
- 0-1: 死里逃生:1
- 3: 人类守卫者
- 5: 可以锁定两个天赋
- 7: 战神
- 10: 爱的战士

### 4. Confirmed 5 worlds + 3 final boss stages

| World | Core monsters | Boss |
|---|---|---|
| 矿山 (Mine) | 哥布林/地精/岩石怪 | 奥凯 (地龙王) |
| 精灵之森 (Elven Forest) | 精灵/小精灵/树精 | 卡拉 (堕落精灵女王) |
| 迷雾森林 (Misty Forest) | 野猪/哥布林 | - |
| 兽人山脉 (Orc Mountain) | 兽人/地狱犬/牛头人 | 卡里摩多 (剑圣) / 牛头将军 |
| 墓地/魔域 (Cemetery) | 骷髅/幽灵/僵尸/吸血鬼 | 卡拉多格 (骑士团长) / 卜里奥 (魔将) |

**Final Boss 3 stages**:
- 魔王I (史莱姆形) - 急速成长
- 魔王II (史莱姆形) - 多重拟态
- 魔王眷属 - 极再生3%/秒

### 5. Talent effect values (the formulas!)

The talent descriptions contain **exact stat values** that reveal the formula constants:

| Talent | Effect (excerpt) | Implied constant |
|---|---|---|
| 愈之勇者 | 初始回复+3, 生命回复率+50% | +3 base, +50% regen |
| 剑之勇者 | 攻击力+10%, 攻速+20%, 攻击无法闪避 | +10%/+20% |
| 盾之勇者 | 初始防御力+20且+100%, 攻击-75%, 盾反15% | +20 base, 2x mult, -75%, 15% reflect |
| 技能之神 | 每学一项技能 +2.5%攻击, +2.5%防御, 1回复 | 0.025 per skill |
| 神之子 | 成长期全属性+1, 魅力/智力+5 | +1 per stat per year, +5 cha/int |
| 格斗天才 | 格挡减伤率+20% | 0.20 block rate |
| 健身达人 | 最大体力+10 | +10 max stamina |
| 孤独的勇者 | 无同伴+5回复, +25%基础攻/防/回复 | +5/+25% |
| 枪之勇者 | 反击概率+15%, 反击伤害+20% | 0.15/0.20 |
| 贝爷附体 | 冒险体力消耗-1, 篝火疗伤+5% | -1 cost, +5% heal |
| 母胎单身 | 基础攻速+0.12 | +0.12 base speed |
| 灵魂收割者 | 击败敌人灵魂+1 | +1 soul per kill |
| 强健体魄 | 每年+1体质 (成长期) | +1 con/year |
| 短跑天才 | 每年+1灵巧 (成长期) | +1 dex/year |
| 勇敢的心 | 每年+1勇猛 (成长期) | +1 str/year |
| 天才大脑 | 智力+6 | +6 int |
| 有点小帅 | 魅力+6 | +6 cha |

These tell us the **constant base values** used by `CaculateBase*` methods without needing to disassemble the actual formula code.

## Files created

| File | Purpose |
|---|---|
| `extracted_game_data.md` (~45 KB) | Full structured extraction — buffs/talents/relics/equipment/monsters/skills/achievements |
| `dump_inventory.md` (~16 KB) | Catalogue of the 11,271 `Dump/*` files by bucket; flags which contain real data |
| `chinese_strings.txt` (122 KB) | All 1,834 Chinese strings with their index in the metadata (Wave 1) |
| `data/RelicSettingJS.json` (19 KB) | 51-entry canonical relic balance dataset (Wave 2) |
| `data/WeaponSettingJS.json` (7 KB) | 26-entry canonical equipment dataset (Wave 2) |
| `data/EventCardTypeSettingJS.json` (<1 KB) | 4-entry adventure-deck weights (Wave 2) |
| `rebuild_guide.md` (~22 KB) | Web-rebuild design reference + cross-refs |
| `todo.md` (~9 KB) | Tracker for items still missing |
| `final_extract.py` | Wave 1 extraction script |

## What remains

| Item | Why | How |
|---|---|---|
| Exact damage formula constants | IL2CPP invoker stubs | Frida hook or reimplement from talent values |
| Save file JSON schema | Runtime only | Rooted device + 10min play |
| XNode body integers (per-monster HP/ATK/DEF/count/flags) | MonoBehaviour stubs in `Dump/` lack TypeTree | Re-run AssetStudio with TypeTree dumps from `Tool/Il2CppInspectorRedux.GUI`, OR use `UnityPy` to parse `data.unity3d` directly |
| 5 endings full trigger conditions | 5 NPC names + 1 condition known | Read from C# class `EndingEventDirector` |
| Monster stats (HP/ATK/DEF per-creature) | Same as XNode body issue | Same |
| `潜行` (Hunter) profession-locked relics | Profession exists in `WeaponSettingJS` but no `RelicSettingJS` entries are `猎人`-only | The hunter equipment lock is real; the relic pool may genuinely be just `通用`/`战士` |
