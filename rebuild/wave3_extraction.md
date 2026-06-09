# Wave 3 — UnityPy Extraction

> **Date**: 2026-6-9
> **Tool**: [UnityPy 1.25.0](https://github.com/K0lb3/UnityPy) (pure-Python Unity asset reader)
> **Inputs**: `data.unity3d` (87.9 MB), `resources.resource` (10.6 MB)
> **Why**: Wave 2 (AssetStudio dump) produced 10,246 MonoBehaviour stub files with no
> field data — IL2CPP builds strip TypeTrees. UnityPy lets us walk the same file,
> reconstruct what UnityPy's bundled TPK definitions can read, and dump every
> MonoBehaviour body as raw bytes for pattern-parsing.

---

## 0. Pipeline

```
   data.unity3d (87 MB, IL2CPP, TypeTree stripped)
            │
            ├─► UnityPy.load() → 24,713 objects across 5 CABs
            │
            ├─► dump_unity3d.py
            │       ├─► monoscript_catalog.json       (780)  class names per PathID
            │       ├─► monobehaviour_index.json      (10,246) instance records
            │       ├─► monobehaviour_blobs.bin       (2.3 MB) raw bytes
            │       ├─► monobehaviour_blobs_index.json (6,509) pid → offset/length
            │       ├─► sprite_index.json             (568)
            │       ├─► texture2d_index.json          (362)
            │       ├─► animationclip_index.json      (6)
            │       ├─► audioclip_index.json          (13)
            │       ├─► animator_index.json           (24)
            │       └─► animatorcontroller_index.json (6)
            │
            ├─► extract_mb_strings.py
            │       └─► monobehaviour_strings.json    (8,310 CJK strings across 2,372 MBs)
            │
            └─► parse_battle_events.py
                    └─► battle_events.json            (164/167 BattleEventNodes parsed)
```

All output sits in `rebuild/data/`. Source scripts in `rebuild/` (`*.py`).

---

## 1. UnityPy notes

### 1.1 CJK-path workaround

The APK's data folder name contains traditional Chinese (`異世輪迴錄_1.20`).
Windows + Python's path handling mangles non-ASCII paths in this repo, so the
scripts read from a junction:

```powershell
cmd /c mklink /J "$env:LOCALAPPDATA\Temp\opencode\unity_data\Data" `
  "A:\github project\game 2\game_file\<CJK_name>\assets\bin\Data"
```

All scripts hard-code `C:\Users\<user>\AppData\Local\Temp\opencode\unity_data\Data\data.unity3d`.

### 1.2 TypeTree availability

Probe result: **every object reports `serialized_type.node = None`**. The build
was made with IL2CPP + `stripEngineCode = true`, which removes inline TypeTrees.

UnityPy compensates for **built-in Unity types** using its bundled TPK database
(versioned class definitions shipped with the library). That's why `Sprite`,
`Texture2D`, `AnimationClip`, `AudioClip`, `Animator`, `AnimatorController`, and
`MonoScript` all `read()` correctly — UnityPy looks up the field layout by Unity
version (2019.4.17 here).

For `MonoBehaviour` UnityPy can only read the inherited base fields
(`m_GameObject`, `m_Enabled`, `m_Script`, `m_Name` = 32 bytes). The rest of the
blob is the user-script payload and stays opaque without dummy DLLs.

### 1.3 What we extract anyway

Two things make MonoBehaviours useful even without TypeTrees:

1. **The MonoScript PathID** is in the readable head. Cross-referencing the
   `MonoScript` table gives us `path_id → (Class, Namespace, Assembly)` for all
   780 scripts referenced by the bundle.

2. **The raw tail bytes** preserve every field including embedded strings.
   Unity serialises strings as `int32 length || utf-8 bytes || align(4)` —
   walking the blob looking for that pattern recovers most user-script strings
   without needing the type definition.

---

## 2. Output files

### 2.1 `monoscript_catalog.json` (780 records)

```json
{
  "path_id":         210,
  "class":           "HeroTalentBox",
  "namespace":       "",
  "assembly":        "Assembly-CSharp.dll",
  "execution_order": 0,
  "is_editor":       false
}
```

**Authoritative class → PathID map** (replaces guesswork in `dump_inventory.md`).
Notable confirmed entries (359 in `Assembly-CSharp.dll`):

| PathID | Class | Namespace |
|---:|---|---|
| 95 | `HeroTalent` | — |
| 130 | `AdventureAreaInfoNode` | `XNode.AdventureEvent.Nodes` |
| 166 | `Relic` | — |
| 180 | `BattleEventNode` | `XNode.AdventureEvent.Nodes` |
| 194 | `EventResultNode` | `XNode.EventLine.Nodes` |
| 206 | `Character` | — |
| 276 | `Equipment` | — |
| 339 | `Player` | — |
| 355 | `CharacterInfoNode` | `XNode.CharacterSetting.Nodes` |
| 452 | `MainEventNode` | `XNode.EventLine.Nodes` |
| 506 | `Hero` | — |
| 563 | `EndingEventDirector` | — |
| 612 | `StoryLineNode` | `XNode.EventLine.Nodes` |
| 616 | `EvilCrystal` | — |
| 626 | `Skill` | — |
| 637 | `ChestEventNode` | `XNode.AdventureEvent.Nodes` |
| 678 | `ConditionSwichNode` | `XNode.EventLine.Nodes` |
| 699 | `MapAreasNode` | `XNode.MapAreasSetting.Nodes` |
| 742 | `Buff` | — |
| 745 | `ConditionCheckerNode` | `XNode.EventLine.Nodes` |
| 768 | `Monster` | — |

### 2.2 `monobehaviour_index.json` (10,246 records)

One record per MonoBehaviour instance in `data.unity3d`.

```json
{
  "path_id":      13108,
  "script_pid":   180,
  "script_class": "XNode.AdventureEvent.Nodes.BattleEventNode",
  "name":         "Battle Event",
  "total_bytes":  400,
  "tail_bytes":   356
}
```

Of the 10,246 MBs, **6,509 have non-empty tails** (the other 3,737 are mostly
`UIAnimation` stubs that just store a script reference).

### 2.3 `monobehaviour_blobs.bin` + `monobehaviour_blobs_index.json`

`monobehaviour_blobs.bin` is the concatenation of every non-empty MB tail
(2.34 MB total). The index maps `path_id` → `[offset, length]` into the binary.

```json
"13108": [0, 356]
```

To read MB pid 13108:
```python
import json
idx = json.load(open('rebuild/data/monobehaviour_blobs_index.json'))
off, ln = idx['13108']
with open('rebuild/data/monobehaviour_blobs.bin', 'rb') as fh:
    fh.seek(off); blob = fh.read(ln)
```

### 2.4 `monobehaviour_strings.json` (2,372 records, 8,310 CJK strings)

Every MonoBehaviour with at least one embedded Chinese string. The string
extractor walks each blob looking for `[int32 len][utf8 bytes][align 4]` where
the payload contains CJK chars.

```json
{
  "path_id":      13108,
  "script_pid":   180,
  "script_class": "XNode.AdventureEvent.Nodes.BattleEventNode",
  "name":         "Battle Event",
  "tail_bytes":   356,
  "string_count": 8,
  "strings": [
    "你向深处前进，迷雾中突然冲出一只特别强壮的野猪，看来应该是一只野猪首领。一场恶战不可避免。",
    "你向深处前进，迷雾中你看到一只特别强壮的野猪在酣睡，你放轻脚步，缓缓地向它靠近。",
    "无",
    "野猪首领",
    "无", "无", "无", "无"
  ]
}
```

Top classes by string count:

| Class | MB count | Notes |
|---|---:|---|
| `FDFramwork.FDText` | 915 | UI text components (button labels, panel titles) |
| `EventResultNode` | 521 | every player-choice branch's narrative |
| `MainEventNode` | 417 | every story-event branch + reward strings |
| `BattleEventNode` | 167 | per-battle intro + sneak text + monster names |
| `StoryLineNode` | 75 | age-ranged story arc text |
| `ChestEventNode` | 45 | chest flavor text |
| `ConditionCheckerNode` | 43 | branch labels |
| `MapObjectNode` | 25 | point-of-interest names + descriptions |
| `RestEventNode` | 23 | rest-event flavor text |
| `GreatCollectionNode` | 15 | ruin boss intros + drop names |

### 2.5 `battle_events.json` (164 records, 3 not parsed)

Structured per-fight data for every `BattleEventNode`:

```json
{
  "path_id":      13108,
  "graph_pid":    13859,
  "position":     [1048.0, 1228.0],
  "intro_normal": "你向深处前进，迷雾中突然冲出一只特别强壮的野猪...",
  "intro_sneak":  "你向深处前进，迷雾中你看到一只特别强壮的野猪在酣睡...",
  "slot_count":   6,
  "monsters":     ["野猪首领"],
  "monster_slots": ["无", "野猪首领", "无", "无", "无", "无"],
  "trailing":     [2, 1, 2],
  "tail_bytes":   356,
  "parse_ok":     true
}
```

**Per-world breakdown** (confirmed: 5 main worlds × 24 random battles each):

| graph_pid | Count | World |
|---:|---:|---|
| 13857 | 24 | Mine (矿山) |
| 13858 | 24 | Elven Forest (精灵之森) |
| 13859 | 24 | Misty Forest (迷雾森林) |
| 13860 | 24 | Orc Mountain (兽人山脉) |
| 13861 | 24 | Cemetery (墓地/魔域) |
| 13891–13895 | 5 each | Secondary maps |
| 13896–13898 | 6–7 each | Final-area maps |

**Top monsters by random-battle count**: 骷髅 (11), 哥布林 (9), 吸血蝙蝠 (8),
野猪 (6), 僵尸 (6), 哥布林弓箭手 (5), 骷髅射手 (5), 野猪首领 (2),
哥布林队长 (1), 巨型史莱姆 (1), 吸血鬼 (1), 骷髅将军 (1), 大幽灵 (1).

**Note**: The boss fights with 召唤 / 多阶段 mechanics (3 out of 167) fail the
simple parser; their tails have a slightly different layout. They appear as
`parse_ok: false` in the JSON.

### 2.6 Built-in type indexes

| File | Source type | Schema highlights |
|---|---|---|
| `sprite_index.json` (568) | `Sprite` | `path_id, name, rect [x,y,w,h], pivot, pixels_per_unit, is_polygon, atlas_tags` |
| `texture2d_index.json` (362) | `Texture2D` | `path_id, name, width, height, format, mip_count, stream_path, stream_offset, stream_size` |
| `animationclip_index.json` (6) | `AnimationClip` | `path_id, name, sample_rate, wrap_mode, legacy, curve_count` |
| `audioclip_index.json` (13) | `AudioClip` | `path_id, name, channels, frequency, length_seconds, compression_format, stream_path` |
| `animator_index.json` (24) | `Animator` | `path_id, controller_pid, has_avatar, enabled` |
| `animatorcontroller_index.json` (6) | `AnimatorController` | `path_id, name, clip_count, controller_size` |

The `stream_*` fields in `texture2d_index.json` and `audioclip_index.json` point
into `resources.assets.resS` / `resources.resource` — the actual pixel/audio
data which UnityPy can also extract if needed (set `obj.read().image.save(...)`
for textures or `obj.read().samples` for audio).

---

## 3. What the rebuild can do now

| Need | Status before Wave 3 | After Wave 3 |
|---|---|---|
| Class catalog (script PathID → name) | guess from MB names | ✅ `monoscript_catalog.json` (780 records) |
| XNode narrative text per node | ⚠️ raw extraction had mojibake | ✅ `monobehaviour_strings.json` (8,310 clean strings) |
| BattleEventNode → world + monster slots | ❌ stubs only | ✅ `battle_events.json` (164/167) |
| Sprite atlas references | partial | ✅ `sprite_index.json` |
| Texture2D dimensions + storage offsets | partial | ✅ `texture2d_index.json` |
| AudioClip references | partial | ✅ `audioclip_index.json` |

### 3.1 Still missing (need dummy DLLs)

The structured per-field decode of MB tails still needs **TypeTree info from
dummy DLLs** to fully automate. Without it, we can:

- recover all strings (done)
- recover all int32/float fields at fixed offsets (e.g. `BattleEventNode` — done)
- recover PPtr references (visible as `[file_id:int32][path_id:int64]` pairs)

But for variable-layout fields (e.g. a `List<MonsterReference>` whose record
layout depends on the C# class) we'd guess. To finish the auto-decode:

1. Generate dummy DLLs via `Tool/Il2CppInspectorRedux.GUI` (GUI-only tool):
   - File → Load IL2CPP → point to `libil2cpp.so` + `global-metadata.dat`
   - Export → C# Stub DLLs **with TypeTrees**
2. Re-open the bundle in AssetStudioModGUI with those DLLs loaded
   (`Tool/AssetStudioModGUI_net9_win64/`)
3. Export MonoBehaviours — this time the field values will populate

Or, equivalently:

```python
# Once dummy DLLs are generated:
import UnityPy
from UnityPy.helpers import TpkTypeTreeBlob
# UnityPy doesn't auto-load DLLs — use AssetStudioGUI's export instead, or
# write a custom TypeTree loader that parses the .NET metadata in the DLLs.
```

There's no off-the-shelf UnityPy → dummy-DLL bridge as of v1.25.0.

---

## 4. How to re-run

```powershell
# 1. Activate venv
A:\github project\game 2\.venv\Scripts\Activate.ps1

# 2. Install UnityPy (if not yet installed)
pip install UnityPy   # tested with 1.25.0

# 3. Set up the ASCII-path junction (one-time)
$D = Get-ChildItem -LiteralPath "A:\github project\game 2\game_file" -Directory | Select-Object -First 1
$src = "$($D.FullName)\assets\bin\Data"
$dst = "$env:LOCALAPPDATA\Temp\opencode\unity_data"
New-Item -ItemType Directory -Path $dst -Force | Out-Null
cmd /c mklink /J "$dst\Data" "$src"

# 4. Run scripts in order
python rebuild\dump_unity3d.py          # ~30 s
python rebuild\extract_mb_strings.py    # ~15 s
python rebuild\parse_battle_events.py   #  ~1 s
```

All outputs land in `rebuild/data/`. Re-running is idempotent (overwrites).

---

## 5. Scripts in `rebuild/`

| Script | Lines | Purpose |
|---|---:|---|
| `dump_unity3d.py` | ~160 | Master extractor — produces 10 index files + raw MB blobs |
| `extract_mb_strings.py` | ~55 | Walks `monobehaviour_blobs.bin` for embedded CJK strings |
| `parse_battle_events.py` | ~95 | Decodes BattleEventNode tails into structured records |
| `final_extract.py` | (Wave 1) | Old global-metadata.dat string-literal scanner |

---

## 6. Cross-references

- `extracted_game_data.md` §8.3 — adds a "Wave 3 confirmed counts" section
- `dump_inventory.md` §0, §2 — replaces guess counts with authoritative ones from `monoscript_catalog.json`
- `todo.md` — marks XNode body fields (#2) and XNode Chinese text (#3) ✅ RESOLVED
- `extraction_summary.md` — adds Wave 3 row to the results table
