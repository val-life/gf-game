# TODO — Missing Information for Web Rebuild

> **Last updated**: 2026-6-9 (Wave 3: UnityPy raw-blob extraction)
> **Source of truth**: `rebuild_guide.md` + `extracted_game_data.md` + `dump_inventory.md` + `wave3_extraction.md` (this dir)

This file tracks what we **don't have** for the web rebuild. Items here are blockers or nice-to-haves, sorted by impact.

---

## Status: What we have ✅

| Item | Source | Status |
|---|---|---|
| Class catalog (67 game classes) | `il2cpp_extracted.md` (orig folder) | ✅ complete |
| **Authoritative PathID → Class map (780 scripts)** | `data/monoscript_catalog.json` | ✅ NEW (Wave 3) |
| Field/method names & types | `il2cpp_extracted.md` | ✅ complete |
| Method RVAs | `il2cpp_extracted.md` | ✅ complete |
| 30+ Talents with exact effect values | `extracted_game_data.md` §2 | ✅ complete |
| 51 canonical Relics with parser-ready effect strings | `data/RelicSettingJS.json` + §3a | ✅ (Wave 2) |
| 26 Equipment items with profession + property pools | `data/WeaponSettingJS.json` + §3b | ✅ (Wave 2) |
| 40+ Boss-drop Artifacts with combat-tick effects | §3c | ✅ complete |
| 4 Adventure-deck card weights | `data/EventCardTypeSettingJS.json` + §4b | ✅ (Wave 2) |
| 50+ Monsters with abilities | §4 | ✅ complete |
| 20+ Skills with 3-level scaling | §5 | ✅ complete |
| 10 Buff types with formulas | §1 | ✅ complete |
| 100+ Achievements/Endings/CW levels | §6 | ✅ complete |
| 5 Endings with NPC names | §6 | ✅ complete |
| All 1,477 XNode event graph (positions/edges) | `xnode_edges.json` (orig folder) | ✅ exists |
| **All XNode narrative text (8,310 CJK strings)** | `data/monobehaviour_strings.json` | ✅ NEW (Wave 3) |
| **164/167 BattleEventNode structured records (world + monster slots)** | `data/battle_events.json` | ✅ NEW (Wave 3) |
| **Raw MB tail bytes for every MonoBehaviour (2.34 MB)** | `data/monobehaviour_blobs.bin` | ✅ NEW (Wave 3) |
| Built-in asset indexes (Sprite/Texture/Audio/Animation) | `data/*_index.json` | ✅ NEW (Wave 3) |
| 1,834 Chinese strings from `global-metadata.dat` | `chinese_strings.txt` | ✅ complete |
| Full asset inventory of `Dump/` | `dump_inventory.md` | ✅ (Wave 2) |Wave 2) |
| 50+ Monsters with abilities | §4 | ✅ complete |
| 20+ Skills with 3-level scaling | §5 | ✅ complete |
| 10 Buff types with formulas | §1 | ✅ complete |
| 100+ Achievements/Endings/CW levels | §6 | ✅ complete |
| 5 Endings with NPC names | §6 | ✅ complete |
| All 1,477 XNode event graph (positions/edges) | `xnode_edges.json` (orig folder) | ✅ exists |
| 1,834 Chinese strings from `global-metadata.dat` | `chinese_strings.txt` | ✅ complete |
| Full asset inventory of `Dump/` | `dump_inventory.md` | ✅ (Wave 2) |

---

## TODO: Missing for full rebuild

### High Priority (blockers)

#### 1. Exact damage formula constants (CaculateBase*)
- **RVAs known**: `0x00B36668` (CaculateBaseAttack), `0x00B36974` (CaculateBaseDefence), etc. (see `rebuild_guide.md` §4.2)
- **Status**: ❌ The IL2CPP method bodies are invoker stubs, not actual formulas. Disassembly shows `udf #0x0` padding + shared `List<T>` code.
- **How to get**:
  - **(a) Frida hook** at runtime — hook `CaculateBaseAttack(this, level, ...)` to capture input/output pairs
  - **(b) AssetStudio dump** of `data.unity3d` TypeTree to read default field values
  - **(c) Reverse-engineer from talent values** — talents give concrete stat bonuses; back-derive the formula
- **Estimated work**: 2-4 hours (Frida), 1-2 hours (AssetStudio), 1 hour (back-derive)
- **For web rebuild**: can use placeholders initially, refine after testing

#### 2. XNode body fields (BattleEventNode prefix/suffix values)
- **What**: Each BattleEventNode has a 64-byte XNode header (graph PathID, position, port count) then strings (intro, sneak-intro) then 6 monster name slots then 3 trailing flag ints. The header structure was identified in `异世轮回录_RE_full.md` §12.1; the layout above was confirmed during Wave 3.
- **Status**: ✅ **RESOLVED (Wave 3)**. `parse_battle_events.py` (using UnityPy + manual struct unpacking) parses 164/167 BattleEventNodes into `data/battle_events.json` with: `graph_pid` (which world), `position`, `intro_normal`, `intro_sneak`, `slot_count`, `monsters` (named slots only), `monster_slots` (all 6 incl. "无"), `trailing` (3 int flags).
- **Remaining**: per-monster numeric stats (HP/ATK/DEF/CRIT/level) are NOT in BattleEventNode tails — those live in `Monster` MonoBehaviours referenced indirectly, and would need TypeTree-aware decoding to extract. See `wave3_extraction.md` §3.1 for the dummy-DLL path.
- **For web rebuild**: monster NAMES per battle, sneak text, and post-battle dialogue are all now usable; numeric stats can use placeholders until Frida hooks confirm.

#### 3. Decoded XNode Chinese text (no mojibake)
- **Status**: ✅ **RESOLVED (Wave 3)**. `extract_mb_strings.py` walks every MonoBehaviour blob and recovers 8,310 clean UTF-8 strings — see `data/monobehaviour_strings.json`. Coverage:
  - 521 EventResultNode narratives
  - 417 MainEventNode story-event branches
  - 167 BattleEventNode intro + sneak + monster slots
  - 75 StoryLineNode age-ranged arcs
  - 45 ChestEventNode flavor texts
  - 43 ConditionCheckerNode branch labels
  - 25 MapObjectNode names + descriptions
  - 23 RestEventNode flavor texts
  - 15 GreatCollectionNode ruin boss intros
  - 915 FDText UI labels
- **For web rebuild**: every in-game narrative string is now machine-readable as JSON. No further UTF-8 fix needed.

### Medium Priority

#### 4. Monster level scaling formula
- **What**: How monster level relates to player level (the `EnemyLevel` field, `monsterLevelInptuField` debug)
- **Status**: ⚠️ Field names known, exact formula unknown
- **How to get**: Frida hook `CaculateBaseAttack` (which uses level) to observe scaling
- **For web rebuild**: needed for difficulty curve

#### 5. XP curve (CaculateNewMaxExp RVA 0x00B39D30)
- **What**: What level cap is reached at each level (linear / exponential / table?)
- **Status**: ❌ RVA known, formula unknown
- **How to get**: Frida hook + log XP table for levels 1-50
- **For web rebuild**: needed for progression pacing

#### 6. Save file JSON schema
- **What**: How does the Android save look? What keys/values?
- **Status**: ❌ Not extracted (no rooted device available)
- **How to get**: Root Android device, play 10 min, `adb pull /data/data/<pkg>/files/save.json`
- **For web rebuild**: **SKIP** — web uses localStorage with simpler schema

#### 7. Shop prices (GroceryStore, PotionShop, FishStore)
- **What**: Cost of each item in each shop, stock refresh rate
- **Status**: ⚠️ Class names known, prices not extracted
- **How to get**: Frida hook or AssetStudio TypeTree dump
- **For web rebuild**: needed for economy balance

#### 8. Soul gain formula (CaculateGainSoulNum RVA 0x00B06E34)
- **What**: How many souls per monster? Difficulty multiplier?
- **Status**: ❌ RVA known, formula unknown
- **How to get**: Frida hook
- **For web rebuild**: needed for reincarnation balance

#### 9. Equipment random property generation (AddRandomProperty)
- **What**: Pool of stat prefixes (e.g. "+attack", "+defence", "+HP"), weights, rarity-based stat ranges
- **Status**: ✅ **PARTIALLY RESOLVED** — `data/WeaponSettingJS.json` now gives us the per-slot property pool. Each equipment row has `MainProperty` (always rolled), `SubProperty` (always rolled, or `无` for accessories), `SecondProperty` (comma-list of possible random affixes). What's STILL missing: per-rarity stat magnitudes (e.g. how much `攻速` is `+5` vs `+20`?) and the weighted roll table for affix selection.
- **How to get**: Frida hook + log generated properties, OR re-extract MonoBehaviour bodies with TypeTree
- **For web rebuild**: pool structure is enough to start; magnitudes can be tuned from feel

### Low Priority (nice-to-have)

#### 10. Audio cues per event
- **Status**: Skipped (no audio in web rebuild)
- **Decision**: use generic sounds

#### 11. Animation states
- **Status**: Skipped (no animations in web rebuild). Note: `Dump/AnimationClip/` contains 6 keyframe clips and `Dump/Animator/` 24 controller refs if needed later.
- **Decision**: use simple sprite transitions

#### 12. Icon/sprite per item
- **Status**: ✅ Partially resolved — `Dump/Sprite/` has 568 sprite rect/atlas refs (incl. `EquipmentGrid_Blue/Red/Yellow/Pinple/Withte` for rarity tinting, `*_AdventruePlaceImg*` for area portraits, `*_CharacterHeadPortrait*` for NPCs). Pixel data lives in `resources.assets.resS` and was not exported.
- **Decision**: use emoji or color-coded cards for the rebuild; the sprite refs are reference-only

#### 13. Exact Cruel World modifier effects
- **What**: When you set Cruel World level 1/3/5/7/10, what specific modifiers apply to enemies and rewards?
- **Status**: ⚠️ Trigger conditions known, exact modifiers not extracted
- **How to get**: Read `CrulWorld` class fields in detail + AssetStudio TypeTree dump

#### 14. Talent prerequisites / tree
- **What**: Are talents locked behind others? Or are they all random rolls?
- **Status**: ⚠️ From talent data, looks like random roll from ~30 pool, no tree
- **How to get**: Verify by reading `InitAllHeroTalent` method body

#### 15. Fishing mechanics details
- **What**: 3 fish classes, rarity table, reward table
- **Status**: ⚠️ Class names known, no balance data. Note: `data/RelicSettingJS.json` has fishing-related items: `钓鱼竿` (unlocks system), `骨头鱼钩` (-0.15 difficulty), `玫瑰鱼竿` (-0.3 difficulty), `钻石鱼钩` (legend reward unlock).
- **How to get**: Read `FishArea`, `FishBar`, `FishField` fields + run Frida

---

## Recommended Extraction Order

For a complete rebuild, work in this order (each block takes 1-3 hours):

1. ✅ **Wave 3 done** — `dump_unity3d.py` + `extract_mb_strings.py` + `parse_battle_events.py` produced narrative + structured BattleEvent data. See `wave3_extraction.md`.

2. **Dummy-DLL-aware AssetStudio re-dump** (1-2 hrs) — *unblocks #4, #5, #7, #8, #13, partial #2*:
   - Open `Tool/Il2CppInspectorRedux.GUI` → Load IL2CPP → point to `libil2cpp.so` + `global-metadata.dat`
   - Export → Generate C# dummy DLL set **with TypeTrees**
   - Re-open AssetStudioMod (`Tool/AssetStudioModGUI_net9_win64`) → Options → load the dummy DLLs / enable Cpp2IL TypeTree
   - Re-export MonoBehaviours → field values will populate this time

3. **Frida hook session** (4-6 hrs total):
   - Hook `CaculateBaseAttack` → derive level scaling
   - Hook `CaculateNewMaxExp` → derive XP table
   - Hook `CaculateGainSoulNum` → derive soul formula
   - Hook battle events → log HP/ATK/DEF/CRIT values per monster type
   - Hook `AddRandomProperty` → log per-rarity stat magnitudes

4. **Save format** (30 min, requires rooted device):
   - Play 10 min, pull save.json
   - Document schema

5. **Polish** (variable):
   - Shop prices
   - Per-rarity equipment magnitudes
   - Cruel World modifiers
   - Fishing tables

---

## Quick Web Rebuild Without These (placeholder approach)

If you want to **start the web rebuild now** without all the data above, use these placeholders.
Direct-import data is **bold-marked**; everything else is a placeholder.

| Item | Placeholder value | Direct-import? |
|---|---|---|
| Damage formula | `damage = max(atk - def*0.5, atk*0.1) * (1 + atkBuff% - defBuff%)` | — |
| Level scaling | `atk_per_level = 2.5, def_per_level = 1.5, hp_per_level = 10` | — |
| XP curve | `maxExp = 10 * level^1.5` | — |
| Soul per monster | `souls = monster_level * (1 + difficulty * 0.5)` | — |
| Crit multiplier | `2.0` | — |
| Block multiplier | `0.5` | — |
| AP per turn | `5` | — |
| Max AP | `5 + familyWealth / 20` | — |
| Stamina cost per maze step | `1` (reduced by 贝爷附体 talent and `旅行鞋` relic by -1) | **✅ relic data in data/RelicSettingJS.json** |
| Gold per kill | `monster_level * 5` | — |
| Item drop chance | `10% + rareEquipLuck%` | — |
| **Relic pool** | — | **✅ 51 entries, data/RelicSettingJS.json** |
| **Equipment pool** | — | **✅ 26 items + property pools, data/WeaponSettingJS.json** |
| **Adventure-deck weights** | — | **✅ 4 cards, data/EventCardTypeSettingJS.json** |
| **Talent effects** | — | **✅ §2 of extracted_game_data.md** |
| **Buff stack rules** | — | **✅ §1 of extracted_game_data.md** |
| **Skill 3-level scaling** | — | **✅ §5 of extracted_game_data.md** |

**Then** refine with real values from Frida/AssetStudio TypeTree after the basic game is working.

---

## Open Questions (need user input)

1. **Web rebuild target**: React + Phaser? Vue + PixiJS? Pure HTML5 canvas?
2. **Single player only?** (no need for save sync / server)
3. **Localization**: keep Chinese text, or translate to English first?
4. **Mobile-first or desktop-first**? (affects UI design)
5. **3D models or 2D pixel art** for monsters?
6. **Keep all 5 worlds** or simplify to 3? (cuts work in half)
7. **Keep all 5 endings** or just 2-3? (saves balance work)
8. **Real-time or turn-based combat**? (Game is turn-based; web can be either)

---

## Files Referenced

- `rebuild_guide.md` — Main guide
- `extracted_game_data.md` — All decoded game data (Wave 1+2)
- `dump_inventory.md` — Catalogue of the 11,271 files in `Dump/` (Wave 2, updated for Wave 3)
- `wave3_extraction.md` — UnityPy pipeline + output schema (NEW, Wave 3)
- `extraction_summary.md` — How data was extracted, what was discovered
- `chinese_strings.txt` — Raw Chinese strings (Wave 1)
- `data/RelicSettingJS.json` — 51 canonical relics (Wave 2)
- `data/WeaponSettingJS.json` — 26 equipment items (Wave 2)
- `data/EventCardTypeSettingJS.json` — 4 adventure-deck card weights (Wave 2)
- `data/monoscript_catalog.json` — 780 PathID → Class.Namespace.Assembly (NEW, Wave 3)
- `data/monobehaviour_index.json` — 10,246 MB instance records (NEW, Wave 3)
- `data/monobehaviour_blobs.bin` + `data/monobehaviour_blobs_index.json` — 2.34 MB raw MB tails (NEW, Wave 3)
- `data/monobehaviour_strings.json` — 8,310 CJK strings across 2,372 MBs (NEW, Wave 3)
- `data/battle_events.json` — 164/167 structured BattleEventNodes (NEW, Wave 3)
- `data/sprite_index.json`, `data/texture2d_index.json`, `data/animationclip_index.json`, `data/audioclip_index.json`, `data/animator_index.json`, `data/animatorcontroller_index.json` — built-in asset indexes (NEW, Wave 3)
- (Orig folder) `il2cpp_extracted.md` — C# class signatures
- (Orig folder) `il2cpp.cs` — Full IL2CPP dump (147K lines)
- (Orig folder) `异世轮回录_RE_full.md` — Original analysis (before cleanup)
