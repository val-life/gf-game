# Dump Inventory — `Dump/` directory + Wave 3 UnityPy extracts

> **Last updated**: 2026-6-9 (Wave 3: UnityPy raw-blob extraction)
> **Source**: AssetStudio export of `data.unity3d` (87.9 MB) + `resources.resource` (10.6 MB)
> **Game**: 異世輪迴錄 1.20 — Unity 2019.4.17 + IL2CPP (`global-metadata.dat` 6.78 MB, `libil2cpp.so` 34.4 MB ARM64)

Catalogs every asset bucket in `Dump/` and flags which contain real data versus stub headers.

For the **Wave 3** programmatic extraction with UnityPy (which goes deeper than the AssetStudio dump), see `wave3_extraction.md`.

---

## 0. Bucket Summary

| Bucket | Files | Total | Useful for rebuild? |
|---|---:|---:|---|
| `MonoBehaviour/` | 10,246 | 2.1 MB | ❌ Stub headers only (script PathID + name) — no field data |
| `Sprite/` | 568 | 6.4 MB | ✅ Rect/offset/atlas metadata for UI |
| `Texture2D/` | 362 | 252 KB | ⚠️ Metadata only — pixel data lives in `resources.assets.resS` |
| `Shader/` | 42 | 14.1 MB | ⚠️ Stock Unity built-ins + TextMeshPro (Web equivalents exist) |
| `Animator/` | 24 | 12.7 KB | ✅ Controller references |
| `AudioClip/` | 13 | 8.7 KB | ✅ References to BGM/SFX (data in `.resS`) |
| `TextAsset/` | 7 | 109.6 KB | ✅ **3 contain canonical JSON balance data** |
| `AnimationClip/` | 6 | 136 KB | ✅ Keyframe curves |
| `Font/` | 3 | 15.0 MB | ⚠️ Chinese TTF + TextMeshPro SDF (use Web fonts) |
| **TOTAL** | **11,271** | **38.0 MB** | |

---

## 1. TextAsset/ — the gold mine

Three TextAssets store the game's **balance config** as base64-encoded UTF-8 JSON,
decoded into `rebuild/data/` for direct ingestion.

| File | Decoded | Entries | What it is |
|---|---|---:|---|
| `RelicSettingJS.txt` | `rebuild/data/RelicSettingJS.json` | 51 | Every relic + artifact + potion with `RelicEffect` strings like `勇猛:4;灵巧:-2` |
| `WeaponSettingJS.txt` | `rebuild/data/WeaponSettingJS.json` | 26 | All equipment with profession + property pool |
| `EventCardTypeSettingJS.txt` | `rebuild/data/EventCardTypeSettingJS.json` | 4 | Map event-card weight table |
| `DA_ResourseRecorder.txt` | — | — | Internal asset path manifest; not balance data |
| `Zh.txt` | — | — | Localization payload — already mojibake (0xEFBFBD throughout); use `chinese_strings.txt` |
| `LineBreaking Following Characters.txt` | — | — | TextMeshPro line-break ruleset; mojibake |
| `LineBreaking Leading Characters.txt` | — | — | TextMeshPro line-break ruleset; mojibake |

### 1.1 RelicSettingJS — 51 canonical relics

**Schema**:
```json
{
  "RelicName":            "string  (zh-Hans)",
  "RelicType":            "遗物 | 药剂",
  "AvaliableProfession":  "通用 | 战士 | 猎人",
  "Rarity":               "稀有 | 史诗 | 传说 | 神话",
  "RelicDiscript":        "flavor text",
  "RelicEffect":          "key:value[;key:value...]  (parser-ready)",
  "AcquisitionMethod":    "Normal | Special",
  "AcquisitionLimit":     "Once | Infinity"
}
```

**Effect-key dictionary** (everything is `name:number`, semicolon-joined):

| Effect key | Domain | Sample relic |
|---|---|---|
| `金币` | int one-shot gold | `一些金币`:100 / `很多金币`:200 |
| `经验获取效率` | float additive % | `经验之书`:0.03 / `启迪之书`:0.08 / `魔人权杖`:0.5 |
| `家境` | int stat | `招财猫`:1 / `聚宝盆`:5 |
| `脚程` `勇猛` `灵巧` `智力` `体质` `魅力` `防御` | int stat | `力量护符`:1 / `防御护符`:2 / `水晶护腕`:8 / `罗盘`:4 (脚程) |
| `战斗生命回复` | int combat HP regen | `圣树之种`:3 |
| `每点力量攻击力` | float STR→ATK scalar | `铆钉拳套`:0.1 |
| `每点体质生命值` | float CON→HP scalar | `巨人腰带`:1 |
| `最大体力` | int stamina cap | `安眠草`:5 / `怀表`:10 / `无眠头环`:25 |
| `偷袭概率` | float 0-1 | `望远镜`:0.1 |
| `死里逃生` | int escape charges | `替身娃娃`:1 / `免死金牌`:1 (Infinity) |
| `格挡` `溅伤` | float 0-1 | `矮人护手`:0.05 / `溅伤护符`:0.02 |
| `钓鱼难度` | float reduction | `骨头鱼钩`:0.15 / `玫瑰鱼竿`:0.3 |
| `怪物每级属性提高` | float risk modifier | `魔人权杖`:0.3 |
| `迷宫前进体力消耗` | int delta | `旅行鞋`:-1 |
| `篝火体力回复` | int | `睡袋`:5 |
| `篝火生命回复` | float % | `百草药学`:0.05 |
| `体力耗尽时前进生命损失` | float delta | `疲劳药剂`:-0.05 |
| `区域移动体力消耗` | float multiplier (1-x) | `矮马`:0.3 / `战马`:0.6 / `飞龙`:0.8 |
| `战利品幸运值` | int | `幸运护符`:10 / `火焰羽毛`:10 |
| `本回合攻击力提高` `本回合攻速提高` `本回合防御提高` | float % | 三色 potion:0.1 each |

**Rarity distribution** (the rebuild can use this for loot tables):

| Rarity | Count |
|---|---:|
| 稀有 | 20 |
| 史诗 | 15 |
| 传说 | 12 |
| 神话 | 4 (`替身娃娃`, `无眠头环`, `钻石鱼钩`, `免死金牌`) |

**Type split**: 47 `遗物` + 4 `药剂` (`攻击/敏捷/忍耐药剂` + `神秘药水`).
**Profession split**: 48 `通用` + 3 `战士` (no `猎人`-only relics).
**Acquisition**: 30 `Special` (story rewards) + 21 `Normal` (random drops).

### 1.2 WeaponSettingJS — 26 equipment items

**Schema**:
```json
{
  "EquipmentName":  "string  (zh-Hans)",
  "Profession":     "通用 | 战士 | 猎人",
  "EquipType":      "武器 | 护甲 | 头盔 | 饰品",
  "MainProperty":   "single stat",
  "SubProperty":    "single stat or 无",
  "SecondProperty": "comma-list of possible random affixes"
}
```

**Equipment slots and counts**:

| Slot | Count | Items |
|---|---:|---|
| 武器 | 7 | 长剑, 巨斧, 镰刀, 重锤, 长枪, 剑盾, 巨剑 |
| 护甲 | 6 | 重甲, 皮甲, 轻甲, 绿甲, 板甲, 反甲 |
| 头盔 | 4 | 护额, 面具, 札盔, 桶盔 |
| 饰品 | 9 | 吸血戒指, 闪避戒指, 范围戒指, 力量戒指, 回复戒指, 反击戒指, 生命戒指, 防御戒指, 格挡戒指 |

**Profession gating**:

| Profession | Items | Notes |
|---|---:|---|
| 通用 | 14 | Available to everyone |
| 战士 | 7 | 剑盾, 巨剑, 板甲, 反甲, 桶盔, 防御戒指, 格挡戒指 (defensive bent) |
| 猎人 | 5 | 镰刀, 皮甲, 面具, 吸血戒指, 闪避戒指 (mobility + lifesteal bent) |

**Stat domain** (all stats appearing as `MainProperty` / `SubProperty` / in `SecondProperty` pool):
`攻击 攻速 防御 闪避 反击 格挡 溅伤 吸血 生命 回复 无`

→ implies the equipment-property generator picks from a fixed 10-stat pool, with `MainProperty` always rolled at higher tier and `SubProperty/SecondProperty` rolled from the slot's allowed list.

### 1.3 EventCardTypeSettingJS — map event weights

```json
[
  { "EventCardType": "魔物",     "RandomValue": 30.0 },   // monster fight
  { "EventCardType": "精英魔物", "RandomValue": 15.0 },   // elite
  { "EventCardType": "铁匠",     "RandomValue": 15.0 },   // smith (re-roll equipment)
  { "EventCardType": "商人",     "RandomValue": 25.0 }    // merchant
]
```

Total = 85 → these don't sum to 100, meaning the leftover **15%** rolls into something else (likely chest / rest / story event chosen by the area's `Adventure Area Info`). The four entries here are only the **adventure deck cards**; story events live in the XNode graph.

---

## 2. MonoBehaviour/ — 10,246 stub headers

Every file looks like this:

```
MonoBehaviour Base
    PPtr<GameObject> m_GameObject
        int m_FileID = 0
        SInt64 m_PathID = 0
    UInt8 m_Enabled = 1
    PPtr<MonoScript> m_Script
        int m_FileID = 1
        SInt64 m_PathID = <SCRIPT_ID>
    string m_Name = "<NAME>"
```

That is, **only the script PathID + the object name** were exported. The actual serialized
fields (XNode positions, event text, monster stats, etc.) were skipped because AssetStudio
needs **TypeTree** info from a fresh Il2CppInspector dump to know how to walk them.

> **Wave 3 update**: `dump_unity3d.py` re-walks the same file with UnityPy and dumps the
> raw tail bytes of every MonoBehaviour into `data/monobehaviour_blobs.bin` (2.34 MB).
> `extract_mb_strings.py` then recovers **8,310 embedded Chinese strings** across 2,372
> instances by pattern-matching the Unity string serialization format. See
> `wave3_extraction.md` and `data/monobehaviour_strings.json`.

### 2.1 Script PathID → class catalog (authoritative from MonoScript table)

> **Wave 3 update**: counts below are confirmed by reading the actual `MonoScript`
> objects (780 of them) via UnityPy. The class names are no longer inferred from MB
> object names — they come straight from `MonoScript.m_ClassName + m_Namespace`.
> Full mapping is in `data/monoscript_catalog.json`.

| Script PathID | Count | Class (authoritative) |
|---:|---:|---|
| 687 | 3,728 | `UIAnimation` |
| 658 | 2,353 | `FDFramwork.FDImage` |
| 735 | 1,285 | `FDFramwork.FDText` |
| 194 | 526 | `XNode.EventLine.Nodes.EventResultNode` |
| 452 | 417 | `XNode.EventLine.Nodes.MainEventNode` |
| 480 | 386 | `FDFramwork.FDButton` |
| 410 | 178 | `EquipmentGrid` |
| 180 | 167 | `XNode.AdventureEvent.Nodes.BattleEventNode` |
| 152 | 91 | `UnityEngine.UI.Mask` |
| 612 | 83 | `XNode.EventLine.Nodes.StoryLineNode` |
| 775 | 71 | `UnityEngine.UI.Image` |
| 678 | 69 | `XNode.EventLine.Nodes.ConditionSwichNode` |
| 745 | 52 | `XNode.EventLine.Nodes.ConditionCheckerNode` |
| 467 | 48 | `TeamPosDisplay` |
| 637 | 45 | `XNode.AdventureEvent.Nodes.ChestEventNode` |
| 39 | 25 | `XNode.MapAreasSetting.Nodes.MapObjectNode` |
| 548 | 24 | `GameObjectAnimator` |
| 151 | 23 | `XNode.AdventureEvent.Nodes.RestEventNode` |
| 208 | 22 | `SelectMonsterDisplay` |
| 272 | 22 | `XNode.EventLine.Nodes.EventLineInfoNode` |
| 121 | 15 | `XNode.AdventureEvent.Nodes.GreatCollectionNode` |
| 130 | 13 | `XNode.AdventureEvent.Nodes.AdventureAreaInfoNode` |
| 699 | 6 | `XNode.MapAreasSetting.Nodes.MapAreasNode` |
| 355 | 5 | `XNode.CharacterSetting.Nodes.CharacterInfoNode` |

### 2.2 XNode-style scene-graph nodes (1,467 total)

The XNode event graph from previous extraction is fully represented as stubs in this dump:

| Node class | This dump | Prev extract | Match? |
|---|---:|---:|---|
| EventResultNode | 526 | 526 | ✅ |
| MainEventNode | 417 | 417 | ✅ |
| BattleEventNode | 167 | 167 | ✅ |
| StoryLineNode | 83 | 83 | ✅ |
| ConditionSwichNode | 69 | 69 | ✅ |
| ConditionCheckerNode | 52 | 52 | ✅ |
| ChestEventNode | 45 | 45 | ✅ |
| MapObjectNode | 25 | 25 | ✅ |
| RestEventNode | 23 | 23 | ✅ |
| EventLineInfoNode | 22 | 22 | ✅ |
| GreatCollectionNode | 15 | 15 | ✅ |
| MapAreasNode | 6 | 6 | ✅ |
| CharacterInfoNode | 5 | 5 | ✅ |
| Adventure Area Info | 13 | — | new |

**Implication**: the count matches the previous XNode extraction precisely, but **the body fields are not in this dump**. ✅ **Wave 3 RESOLVED**: `dump_unity3d.py` (UnityPy) re-reads the same `data.unity3d` and saves the per-node raw bytes to `data/monobehaviour_blobs.bin`. `parse_battle_events.py` then decodes 164/167 `BattleEventNode` records into structured JSON at `data/battle_events.json`. The remaining XNode types (ChestEventNode, RestEventNode, MainEventNode, EventResultNode, StoryLineNode, etc.) have their embedded Chinese text recovered in `data/monobehaviour_strings.json`.

> Other extraction paths that don't depend on TypeTrees:

1. Re-run AssetStudio with the TypeTree dumps from `Il2CppInspectorRedux.GUI` (already in `Tool/`)
2. Re-extract from `data.unity3d` with the Python parser described in `rebuild/todo.md` §2
3. Frida-hook the live game

---

## 3. Sprite/ — 568 UI sprite refs

Each `Sprite/*.txt` has the rect, pivot, atlas-tag, and RenderDataKey (UUID for the atlas
slice). Useful when wiring a Web UI that needs the **same crops** as the original layout.

Highest-value entries:

| Sprite name | Use |
|---|---|
| `city.txt` | 1920×1080 background |
| `EventCardImg*`, `EventCardImgSelectable*` | Event-card frames |
| `*_AdventruePlaceImg*` | Adventure-area portraits |
| `*_CharacterHeadPortrait*` | NPC head portraits (e.g. 卡拉, 卡拉多格, 露明娜, 夏洛蒂) |
| `EquipmentGrid_Blue/Red/Yellow/Pinple/Withte` | Equipment slot border colors by rarity |
| `MapAreaButton*` | Region map buttons |
| `DeathEscape.txt` | Death-escape UI |
| `EmojiOne.txt` | TextMeshPro emoji atlas |

→ Web rebuild can ignore the actual sprite atlas and use any equivalent UI library; these
exist as reference for visual layout only.

---

## 4. Texture2D/ — 362 entries (metadata only)

Each file documents the `(width, height, format, offset into resources.assets.resS)` for a
texture. Pixel data is NOT included — to get the actual PNGs you'd need to re-run
AssetStudio with "Export with images" enabled. For rebuild, the only useful info is the
**dimensions table**:

| Common size | Use |
|---|---|
| 1920×1080 | Backgrounds (`city`, `Background`) |
| 512×512, 256×256, 128×128 | Sprite atlases |
| Misc per-NPC | Character portraits |

---

## 5. Shader/ — 42 stock shaders

All entries are Unity built-in shaders (`Hidden_Internal-*`) or TextMeshPro shaders. No
custom game-specific shader code — the visual style relies on stock Unity rendering.
**Drop entirely for Web rebuild**; use CSS / Canvas / WebGL equivalents.

---

## 6. AnimationClip/ — 6 keyframe clips

| Clip | What animates |
|---|---|
| `clouds.txt` | Cloud parallax loop |
| `CurrentLocationAni.txt` | "You are here" map pulse |
| `New Animation.txt` | Unnamed clip |
| `rolling.txt` | Loading-spinner / dice roll |
| `TargetIconAni.txt` | Target reticle pulse |
| `?_t_Clip.txt` (mojibake) | unknown |

Sample rate is 60 fps. For Web rebuild use CSS keyframes / GSAP / Framer Motion.

---

## 7. Animator/ — 24 controllers

State-machine refs only (PathID → `Resources/Animation/<Controller>.controller`).
Notable: `MapAreaOptionPanel1_8.controller` drives the 8 map-area buttons; `Button.controller`
is the global button state machine.

---

## 8. AudioClip/ — 13 references

Names visible (some mojibake): `Black_Sacred_Storm`, `In_the_fog`, plus 11 Chinese-named
clips (BGM tracks + UI SFX). All payload bytes live in `.resS` — for Web rebuild use
royalty-free or AI-generated alternates.

---

## 9. Font/ — 3 entries

| File | Size | What |
|---|---:|---|
| `FZZJ-XSS (1).txt` | 11.6 MB | 方正字迹-小薛书 体 (Chinese display font) |
| `LiberationSans.txt` | 467 KB | Latin fallback |
| `?_x_xxx_xxx.txt` | 3.7 MB | Unknown CJK SDF (TextMeshPro distance field) |

For Web rebuild, drop the SDF and use any web-loadable CJK font (`Noto Sans SC`, `Source Han Sans`).

---

## 10. Cross-reference: what each bucket gives the rebuild

| Need | Where in `Dump/` | Status |
|---|---|---|
| Talent values | (not here) — see `chinese_strings.txt` | ✅ in `extracted_game_data.md` §2 |
| Relic effect values | `TextAsset/RelicSettingJS.txt` | ✅ canonical JSON in `data/RelicSettingJS.json` |
| Equipment property pools | `TextAsset/WeaponSettingJS.txt` | ✅ canonical JSON in `data/WeaponSettingJS.json` |
| Adventure-card weights | `TextAsset/EventCardTypeSettingJS.txt` | ✅ canonical JSON in `data/EventCardTypeSettingJS.json` |
| Monster stats (HP/ATK/DEF) | (not here) — XNode body | ⚠️ partial: monster names per battle in `data/battle_events.json`, raw HP/ATK/DEF still needs Frida or dummy DLLs |
| Skill scaling | (not here) — see `chinese_strings.txt` | ✅ in `extracted_game_data.md` §5 |
| Buff formulas | (not here) — see `chinese_strings.txt` | ✅ in `extracted_game_data.md` §1 |
| Ending NPCs & triggers | (not here) — see `chinese_strings.txt` | ✅ in `extracted_game_data.md` §6 |
| XNode narrative text | MB stubs lack TypeTree | ✅ **Wave 3** — `data/monobehaviour_strings.json` (8,310 strings) |
| BattleEventNode → world + monster slots | MB stubs lack TypeTree | ✅ **Wave 3** — `data/battle_events.json` (164/167 parsed) |
| MonoScript catalog (PathID → class) | MB stubs lack TypeTree | ✅ **Wave 3** — `data/monoscript_catalog.json` (780 entries) |
| Damage formula constants | (not here) — IL2CPP invoker stubs | ❌ still need Frida or dummy DLLs |
| Sprite UV / rect | `Sprite/*.txt` | ✅ also re-extracted via UnityPy at `data/sprite_index.json` |
| UI animation frames | `AnimationClip/*.txt` | ✅ also re-extracted via UnityPy at `data/animationclip_index.json` |

---

## 11. Recommended next extraction passes

To convert the remaining ❌ items above into ✅:

1. ✅ **Wave 3 done** — `dump_unity3d.py` + `extract_mb_strings.py` + `parse_battle_events.py` (see `wave3_extraction.md`)

2. **Dummy-DLL-aware re-dump** (1-2 hrs) — needed for fully-structured MB decoding:
   - Load `Tool/Il2CppInspectorRedux.GUI` → File → Load IL2CPP → point to `libil2cpp.so` + `global-metadata.dat`
   - Export → Generate C# dummy DLL set with TypeTrees
   - Re-open `Tool/AssetStudioModGUI_net9_win64` → Options → load the dummy DLLs / enable "Use Cpp2IL TypeTree"
   - Export MonoBehaviours again → this time the field values will populate
   - This is the only way to get the full structured layout of every MB without Frida

3. **Frida runtime hook** (2-4 hrs, needs rooted Android device)
   - Hook `CaculateBaseAttack`, `CaculateNewMaxExp`, `CaculateGainSoulNum` to capture
     formula coefficients
   - See `rebuild/todo.md` §1 for exact RVAs

---

## 12. Files in `rebuild/data/`

After Wave 1 + Wave 2 + Wave 3, every data file ready for direct import lives here:

```
rebuild/data/
├── (Wave 2 — canonical balance config decoded from Dump/TextAsset/)
│   ├── RelicSettingJS.json                  51 relics + artifacts + potions
│   ├── WeaponSettingJS.json                 26 equipment items
│   └── EventCardTypeSettingJS.json          4 adventure-deck card weights
│
└── (Wave 3 — programmatic extraction via UnityPy from data.unity3d)
    ├── monoscript_catalog.json              780 PathID → Class.Namespace.Assembly
    ├── monobehaviour_index.json             10,246 MB instance records
    ├── monobehaviour_blobs.bin              2.3 MB raw tail bytes
    ├── monobehaviour_blobs_index.json       6,509 pid → offset/length entries
    ├── monobehaviour_strings.json           8,310 CJK strings from 2,372 MBs
    ├── battle_events.json                   164/167 BattleEventNodes (intro + monsters)
    ├── sprite_index.json                    568 sprite rect/atlas refs
    ├── texture2d_index.json                 362 texture dimension/storage refs
    ├── animationclip_index.json             6 keyframe clips
    ├── audioclip_index.json                 13 audio refs
    ├── animator_index.json                  24 controllers
    └── animatorcontroller_index.json        6 controller state refs
```

These supersede the partial entries in `extracted_game_data.md` §3 (relics) —
that section has been updated to point readers at the JSON for authoritative
values, while keeping the prose summary for browse-ability.
