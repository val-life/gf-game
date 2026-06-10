# Wave 4 — TypeTree Dump Extraction (2026-6-10)

> **Source**: AssetStudio re-dump of `data.unity3d` with the **Il2CppInspector dummy DLLs loaded** so TypeTree fields are fully resolved (`Dump with dll/MonoBehaviour/*.txt`).
> **Script**: `rebuild/parse_typemb.py`
> **Result**: 10,243 MB files parsed, 166 classes catalogued, 7 structured per-category JSONs + 1 XNode edge list + 1 decoded-strings corpus written to `rebuild/data/`.

---

## 1. What was missing before this wave

| Item | Why missing | Resolved here? |
|---|---|---|
| Per-monster HP/ATK/DEF in `BattleEventNode` | `Dump/` exports were stub-only (no TypeTree). Il2CppInspector dummy DLLs unlocks full field decode. | ✅ Per-battle `normalAttackContent` + `sneakAttackContent` + `EnemyList` + `ExpReward` + `GoldReward` + `EquipmentReward`. The numeric HP/ATK/DEF still live in the C# `BattleField` runtime, not in MB data — need Frida. |
| `MapAreaStat.AreaDescript` + `mapObjects[].Effect` narrative | Same as above. | ✅ 9 areas with full Chinese descriptions + 25 map objects with decoded Chinese effect lists. |
| `MapObject.ObjectName / ObjectDescript / Effect` | Same as above. | ✅ Same file. |
| XNode port-connection graphs | The TypeTree dump emits `NodePortDictionary` with full `keys` + `values` arrays. | ✅ 2,390 edges between 700+ node files, PathID-resolved. |
| Decoded Chinese strings in `string data = "..."` | The dump emits raw asset bytes inside quotes (no UTF-8 escape). | ✅ `parse_unity_string_list` reads `[int32 length][bytes]` entries; 2,773 strings recovered from 294 files. |

---

## 2. Output files (in `rebuild/data/`)

| File | Size | Records | What it is |
|---|---:|---:|---|
| `mb_file_index.json` | 1.5 MB | 10,243 | Every MB file → class name + namespace + script PathID. Authoritative cross-walk. |
| `typemb_catalog.json` | small | — | Same data grouped `by_name` (65 unique m_Names) + `by_class` (166 classes) + `by_script_pathid`. |
| `mb_battle_events_full.json` | 96 KB | 167 | Every `BattleEventNode` with `isBossEvent` + `isFinalBossEvent` + `winBossBattleStr` + `secendBattleStr` + `normalAttackContent` + `sneakAttackContent` + `enemyList` + `probilyRelics` + `expReward` + `goldReward` + `equipmentReward`. |
| `mb_map_area_stats.json` | 9 KB | 9 | Every `MapAreaStatNode` with `areaDescript_chinese` (decoded) + `mapObjects_raw` (parsed struct list). |
| `mb_map_areas.json` | 65 KB | 6 | `MapAreasNode` collections. |
| `mb_map_objects.json` | 32 KB | 25 | Every `MapObjectNode` with `objectName_chinese` + `objectDescript_chinese` + `effect_chinese_list` (decoded from Unity List<string>). |
| `mb_map_area_story.json` | empty | 0 | No files of class `MapAreaStoryNode` (the mojibake-named files are `EvenLineGraph` — see `mb_event_lines.json`). |
| `mb_event_lines.json` | 630 KB | 25 categories, 61 files | Every XNode EventLine container (`MainStory_EventLine`, `GrowUpStory_EventLine`, `EndingStory_EventLine`, the 5 mojibake `?Story_MapAreaStory.txt`, etc). |
| `mb_condition_switches.json` | 1.0 MB | 69 | Every `ConditionSwichNode` with full port graph. |
| `mb_xnode_edges.json` | 472 KB | 2,390 | All `(from_node, from_port) → (to_node, to_port)` edges across every XNode graph in the game, with `to_file` resolved via PathID lookup. |
| `mb_strings_decoded.json` | 118 KB | 2,773 strings in 294 files | Every quoted byte sequence in the dump that decodes to a CJK string, keyed by file. |

The full per-category stats are in `mb_extraction_report.json`.

---

## 3. Key numbers

| Category | Count | Source class |
|---|---:|---|
| Battle encounters (full fields) | **167** | `BattleEventNode` |
|   ├─ IsFinalBossEvent = true | 13 | (the multi-stage final boss fight layouts: 15519, 15723, 15998, 15999, 16000, 16001, 16002, 16003, 16004, 16005, 16006, 16085, 16238) |
|   ├─ With `normalAttackContent` (narrative) | 89 | (the rest use empty string) |
|   ├─ With `sneakAttackContent` (narrative) | 149 | |
|   ├─ With `EnemyList` (List<string> of monster names) | 41 | (encounters with active monster slot, 148 more have size=0 sentinel) |
|   └─ With parsed `ExpReward` / `GoldReward` / `EquipmentReward` (positive value) | 44 | |
| Map area stat blocks | 9 | `MapAreaStatNode` |
| Map area collection nodes | 6 | `MapAreasNode` |
| Map object nodes | 25 | `MapObjectNode` |
| EventLine graph containers | 25 / 61 | `EvenLineGraph` (note: typo in source) |
| Condition switch nodes | 69 | `ConditionSwichNode` |
| XNode port edges | 2,390 | aggregated from all XNode classes |
| Files containing decoded CJK text | 294 | any class |
| Total recovered CJK strings | 2,773 | |
| **Total MonoBehaviour files** | **10,243** | 166 classes |

---

## 4. Top 15 classes by MB count

| Class | Files | Purpose |
|---|---:|---|
| `UIAnimation` | 3,728 | UI animations (no game data) |
| `FDImage` | 2,353 | FairyDust UI image component |
| `FDText` | 1,285 | FairyDust UI text component |
| `EventResultNode` | 526 | XNode result nodes |
| `MainEventNode` | 417 | XNode main event nodes |
| `FDButton` | 386 | FairyDust UI button |
| `EquipmentGrid` | 178 | Inventory grid UI |
| `BattleEventNode` | **167** | Battle encounters ← extracted |
| `Mask` | 91 | UI mask |
| `StoryLineNode` | 83 | XNode story lines |
| `ConditionSwichNode` | 69 | XNode condition switch |
| `ConditionCheckerNode` | 52 | XNode condition checker |
| `TeamPosDisplay` | 48 | UI team position |
| `ChestEventNode` | 45 | XNode chest event |
| `MapObjectNode` | 25 | Map objects ← extracted |

The remaining ~4,600 MB files are UI components (no game data) and stubs.

---

## 5. How to read the output

### Battle event record
```json
{
  "filename": "Battle Event #14842.txt",
  "name": "Battle Event",
  "script_pathid": 180,
  "isBossEvent": false,
  "isFinalBossEvent": false,
  "winBossBattleStr": "",
  "secendBattleStr": "",
  "normalAttackContent": "你向深处前进，迷雾中突然冲出一只特别强壮的野猪，看来应该是一只猪首领的领地。",
  "sneakAttackContent": "你向深处前进，迷雾中你听见一只特别强壮的野猪在酣睡，你放轻脚步缓慢向它靠近。",
  "enemyList": ["无", "野猪首领", "无", "无", "无", "无"],
  "probilyRelics": [],
  "expReward": 2,
  "goldReward": 2,
  "equipmentReward": 1,
  "graphPathId": 13859
}
```

The 6-slot `enemyList` (max 6 monsters in one encounter) is filled with `"无"` (U+65E0, "none") when the slot is empty. The first slot is the "boss/elite" position; the rest are adds.

The 13 `isFinalBossEvent` events have empty `enemyList` (size 0) but contain raw byte blobs from the "SecendBattleStr" multi-stage layout. Those layouts need a hand-rolled parser to decode (out of scope for this wave).

### Map object record
```json
{
  "filename": "Map Object #14959.txt",
  "objectName_chinese": "\x06",          // (raw control char from asset; some objects have non-print names)
  "objectDescript_chinese": "",
  "effect_chinese_list": [
    "一条阴暗的小巷。",
    "对象_阴暗的小巷"
  ]
}
```

The 2-element `effect_chinese_list` is a Unity List<string> with `[int32 length][UTF-8 bytes]` per entry — decoded by `parse_unity_string_list()`.

### XNode edge record
```json
{
  "from_file": "Map Area Stat #15115.txt",
  "from_port": "Input",
  "from_node_pathid": 13397,
  "to_file": "Map Area Stat #15115.txt",
  "to_port": "Input",
  "to_node_pathid": 14421
}
```

Use this to reconstruct the full XNode event graph for any flow. Edges within the same file (loop-back) and across files (cross-graph) are both captured.

---

## 6. How to run

```bash
# 1. (One-time) Export AssetStudio with Il2CppInspector dummy DLLs
#    Load TypeTree → point to game_file/.../libil2cpp.so + global-metadata.dat
#    Export → Dump with dll/MonoBehaviour/*.txt
#
# 2. Run parser
.\.venv\Scripts\python.exe -u rebuild\parse_typemb.py
#
# Output: rebuild/data/mb_*.json + typemb_catalog.json
```

~80 seconds for 10,243 files. ~3 MB of JSON total.

---

## 7. What is still missing (for the next wave)

| Item | Where it lives | How to get |
|---|---|---|
| Per-monster HP/ATK/DEF numeric stats | `BattleField` runtime struct, populated by `CaculateBaseAttack` etc. | Frida hook (live values) |
| Shop prices (`GroceryStore`, `PotionShop`, `FishStore`) | `MB` files for these classes | Locate their class in `typemb_catalog.json` + apply same parser. Not in the current top classes. |
| 3/167 final-boss multi-stage layouts | `Battle Event #15519/15723/15998...` — they have empty `enemyList` and a complex `SecendBattleStr` blob | Hand-decode the `SecendBattleStr` serialized Unity List<string> with the `parse_unity_string_list` helper |
| `Monster` per-creature numeric stats | `Monster` MB class (not in top classes — maybe under another namespace) | Search `mb_file_index.json` for class containing `Monster` |
| EndingEventDirector 5 endings full triggers | Not in current data — look for `Ending*` class | Search by name pattern |
| Shop merchant price tables | Not yet located | Search `mb_file_index.json` for class with `Store` or `Shop` in name |
| `CrulWorld` exact modifier effects per level | Class exists (`CrulWorld` or `CruelWorld`); find MB files | Search `mb_file_index.json` |

The full todo list remains in `rebuild/todo.md`. This wave resolves **High Priority #2** (XNode BattleEventNode body fields are now parseable) and **Medium #6** (per-event item drop chance can be computed from the now-visible `equipmentReward` field for the 44 records that have it).
