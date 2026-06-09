# Extraction Summary (2026-6-9)

## What was extracted

Three waves of extraction, all feeding `rebuild/extracted_game_data.md` and the canonical JSON files in `rebuild/data/`:

1. **Wave 1 — `global-metadata.dat` string-literal scan** (Ghidra MCP + custom Python).
   Decoded ~1,800 readable Chinese strings out of the 11,901-entry StringLiteral table.
   Source for talents, monsters, skills, achievements, ending NPCs, system text.

2. **Wave 2 — `Dump/TextAsset/*` decode** (PowerShell base64 + ConvertFrom-Json).
   AssetStudio export of `data.unity3d` produced 11,271 files; three TextAssets contained
   base64-encoded UTF-8 JSON with the **canonical balance dataset** for relics, equipment,
   and the adventure-deck card weights. Decoded into `rebuild/data/*.json` for direct
   import into the web rebuild.

3. **Wave 3 — UnityPy programmatic walk** (`dump_unity3d.py` + `extract_mb_strings.py` + `parse_battle_events.py`).
   UnityPy reads `data.unity3d` and dumps:
   - 780-entry MonoScript catalog (authoritative PathID → Class.Namespace.Assembly)
   - Raw byte blobs for every MonoBehaviour (2.34 MB across 6,509 non-empty MBs)
   - 8,310 CJK narrative strings recovered from those blobs
   - 164/167 structured BattleEventNodes (world + monster slots + intro/sneak text)
   - Built-in asset indexes (Sprite/Texture2D/AnimationClip/AudioClip/Animator)
   See `wave3_extraction.md` for the full pipeline + schemas.

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
| **MonoScript catalog** | 3 | **780** PathID → Class.Namespace.Assembly | `data/monoscript_catalog.json` |
| **MonoBehaviour raw blobs** | 3 | **2.34 MB** across 6,509 non-empty MBs | `data/monobehaviour_blobs.bin` |
| **XNode narrative strings** | 3 | **8,310** CJK strings across 2,372 MBs | `data/monobehaviour_strings.json` |
| **Structured BattleEvents** | 3 | **164/167** with world + monster slots | `data/battle_events.json` |
| **Built-in asset indexes** | 3 | Sprite (568), Texture2D (362), AudioClip (13), AnimationClip (6), Animator (24), AnimatorController (6) | `data/*_index.json` |

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
`dump_inventory.md` §2 for the full breakdown.

### 0a. ☆ NEW (Wave 3) — UnityPy walk of `data.unity3d`

UnityPy 1.25.0 (`pip install UnityPy`) loads `data.unity3d` (87.9 MB) and exposes
all 24,713 objects to Python. IL2CPP builds strip inline TypeTrees, but UnityPy
ships TPK definitions for built-in types and we can still recover MonoBehaviour
**raw tail bytes** + walk them for embedded strings. This pass produced:

| Artifact | Records | What it is |
|---|---:|---|
| `data/monoscript_catalog.json` | 780 | PathID → Class.Namespace.Assembly (authoritative) |
| `data/monobehaviour_index.json` | 10,246 | one record per MB with script_pid + name + byte sizes |
| `data/monobehaviour_blobs.bin` | 2.34 MB | concatenated raw tail bytes |
| `data/monobehaviour_blobs_index.json` | 6,509 | pid → [offset, length] into the .bin |
| `data/monobehaviour_strings.json` | 8,310 | CJK strings recovered by pattern-walk |
| `data/battle_events.json` | 164 / 167 | structured `BattleEventNode` records |
| `data/sprite_index.json` | 568 | sprite rect + atlas + pivot |
| `data/texture2d_index.json` | 362 | texture dimensions + storage refs |
| `data/animationclip_index.json` | 6 | clip metadata |
| `data/audioclip_index.json` | 13 | audio channels + freq |
| `data/animator_index.json` | 24 | animator controller refs |
| `data/animatorcontroller_index.json` | 6 | controller state refs |

See `wave3_extraction.md` for the pipeline + schema.

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
| `extracted_game_data.md` (~50 KB) | Full structured extraction — buffs/talents/relics/equipment/monsters/skills/achievements + Wave 3 counts |
| `dump_inventory.md` (~17 KB) | Catalogue of the 11,271 `Dump/*` files by bucket; flags which contain real data |
| `wave3_extraction.md` (~14 KB) | UnityPy pipeline + per-output schemas (NEW, Wave 3) |
| `chinese_strings.txt` (122 KB) | All 1,834 Chinese strings with their index in the metadata (Wave 1) |
| `data/RelicSettingJS.json` (19 KB) | 51-entry canonical relic balance dataset (Wave 2) |
| `data/WeaponSettingJS.json` (7 KB) | 26-entry canonical equipment dataset (Wave 2) |
| `data/EventCardTypeSettingJS.json` (<1 KB) | 4-entry adventure-deck weights (Wave 2) |
| `data/monoscript_catalog.json` (145 KB) | 780-entry PathID → Class.Namespace.Assembly map (NEW, Wave 3) |
| `data/monobehaviour_index.json` (1.7 MB) | 10,246 MB instance records (NEW, Wave 3) |
| `data/monobehaviour_blobs.bin` (2.3 MB) | Raw concatenated MB tail bytes (NEW, Wave 3) |
| `data/monobehaviour_blobs_index.json` (272 KB) | pid → [offset, length] into the .bin (NEW, Wave 3) |
| `data/monobehaviour_strings.json` (1.0 MB) | 8,310 CJK strings recovered from MB blobs (NEW, Wave 3) |
| `data/battle_events.json` (70 KB) | 164/167 structured BattleEventNodes (NEW, Wave 3) |
| `data/sprite_index.json`, `texture2d_index.json`, etc. | Built-in asset indexes (NEW, Wave 3) |
| `rebuild_guide.md` (~24 KB) | Web-rebuild design reference + cross-refs |
| `todo.md` (~13 KB) | Tracker for items still missing |
| `dump_unity3d.py` (~6 KB) | Wave 3 master extractor |
| `extract_mb_strings.py` (~2 KB) | Wave 3 string walker |
| `parse_battle_events.py` (~3 KB) | Wave 3 BattleEventNode decoder |
| `final_extract.py` | Wave 1 metadata-scan script |

## What remains

| Item | Why | How |
|---|---|---|
| Exact damage formula constants | IL2CPP invoker stubs | Frida hook or reimplement from talent values |
| Save file JSON schema | Runtime only | Rooted device + 10min play |
| Full structured per-field decode of every MB type | UnityPy can't infer user-script TypeTree | Generate dummy DLLs via `Tool/Il2CppInspectorRedux.GUI` → re-export with AssetStudioMod. See `wave3_extraction.md` §3.1 |
| 3 / 167 BattleEventNodes with boss-fight layouts | Simple parser fails on multi-stage layouts | Hand-decode or write a layout-aware parser |
| 5 endings full trigger conditions | 5 NPC names + 1 condition known | Read from C# class `EndingEventDirector` |
| Per-monster numeric stats (HP/ATK/DEF per-creature) | `Monster` MB needs structured decoding | Same as full MB decode above |
| `潜行` (Hunter) profession-locked relics | Profession exists in `WeaponSettingJS` but no `RelicSettingJS` entries are `猎人`-only | The hunter equipment lock is real; the relic pool may genuinely be just `通用`/`战士` |
