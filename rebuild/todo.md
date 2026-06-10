# TODO / Missing Information for Web Rebuild

> **Last updated**: 2026-6-10 (Wave 3: Ghidra MCP decompilation + struct fix)
> **Source of truth**: `rebuild_guide.md` + `extracted_game_data.md` + `dump_inventory.md` + `artifact_complete.md` + `game_complete.md`

This file tracks what we **don't have** for the web rebuild. Items here are blockers or nice-to-haves, sorted by impact.

---

## Status: What we have ✅
| Item | Source | Status |
|---|---|---|
| Class catalog (67 game classes) | `il2cpp_extracted.md` (orig folder) | ✅complete |
| Field/method names & types | `il2cpp_extracted.md` | ✅complete |
| Method RVAs | `il2cpp_extracted.md` | ✅complete |
| 30+ Talents with exact effect values | `extracted_game_data.md` §2 | ✅complete |
| **51 canonical Relics with parser-ready effect strings** | `data/RelicSettingJS.json` + §3a | ✅NEW (Wave 2) |
| **26 Equipment items with profession + property pools** | `data/WeaponSettingJS.json` + §3b | ✅NEW (Wave 2) |
| 40+ Boss-drop Artifacts with combat-tick effects | §3c | ✅complete |
| **4 Adventure-deck card weights** | `data/EventCardTypeSettingJS.json` + §4b | ✅NEW (Wave 2) |
| 50+ Monsters with abilities | §4 | ✅complete |
| 20+ Skills with 3-level scaling | §5 | ✅complete |
| 10 Buff types with formulas | §1 | ✅complete |
| 100+ Achievements/Endings/CW levels | §6 | ✅complete |
| 5 Endings with NPC names | §6 | ✅complete |
| All 1,477 XNode event graph (positions/edges) | `xnode_edges.json` (orig folder) | ✅exists |
| All Chinese text from XNode bodies | (raw extraction in orig folder, needs UTF-8 fix) | ⚠️ partial |
| 1,834 Chinese strings from `global-metadata.dat` | `chinese_strings.txt` | ✅complete |
| **Full asset inventory of `Dump/`** | `dump_inventory.md` | ✅NEW (Wave 2) |
| **Il2CppClass struct fix (Unity 2019.4)** | `artifact_complete.md` | ✅NEW (Wave 3) |
| **48 Artifacts full decompile** (name+effect+lambda) | `artifact_complete.md` | ✅NEW (Wave 3) |
| **31 typed shared event lambdas (b__1_48..78)** | `artifact_complete.md` | ✅NEW (Wave 3) |
| **Dragon Heart AfterAttack effect verified** (vtable[20]=AddBasicBuff) | `artifact_complete.md` | ✅NEW (Wave 3) |
| **14 enums fully extracted** (EquipmentType, BuffName, etc.) | `game_complete.md` | ✅NEW (Wave 3) |
| **15 Warrior skills (85 lambdas) decompiled** | `game_complete.md` | ✅NEW (Wave 3) |
| **15 Buff presets (中毒/灼烧/眩晕/etc.)** | `game_complete.md` | ✅NEW (Wave 3) |
| **35 Hero Talents (all Mythic) extracted** | `game_complete.md` | ✅NEW (Wave 3) |
| **Equipment stat formulas** (rarity/luck/level scaling) | `game_complete.md` | ✅NEW (Wave 3) |

---

## TODO: Missing for full rebuild

> Many items originally in this list have been **resolved or skipped** — see `rebuild_guide.md` §1.5 (Talent), §1.6 (Fishing), §9 (Skipped Systems) for decisions.

### High Priority (blockers)

#### 1. Exact damage formula constants (CaculateBase*)
- **RVAs known**: `0x00B36668` (CaculateBaseAttack), `0x00B36974` (CaculateBaseDefence), etc. (see `rebuild_guide.md` §4.2)
- **Status**: ✅ The IL2CPP method bodies are invoker stubs, not actual formulas. Disassembly shows `udf #0x0` padding + shared `List<T>` code.
- **How to get**:
  - **(a) Frida hook** at runtime — hook `CaculateBaseAttack(this, level, ...)` to capture input/output pairs
  - **(b) AssetStudio dump** of `data.unity3d` TypeTree to read default field values
  - **(c) Reverse-engineer from talent values** — talents give concrete stat bonuses; back-derive the formula
- **Estimated work**: 2-4 hours (Frida), 1-2 hours (AssetStudio), 1 hour (back-derive)
- **For web rebuild**: can use placeholders initially, refine after testing
- **Wave 3 progress**: confirmed struct fields (CreatureBattleProperty enum 0-13), BuffFixEffectName enum (0-17), but actual multiplicative/additive formulas not yet extracted.

#### 2. XNode body fields (BattleEventNode prefix/suffix values)
- **What**: Each BattleEventNode has prefix `[0, 3, 0, 0, 0, 0, 0, 0, 0, 135]` and suffix `[512, 256, 512]` flag values. These encode **per-monster HP, attack, defense, count, and behavior flags**.
- **Status**: ✅Identified structure in `撘?頧桀?敶RE_full.md` §12.1 but not fully parsed. The 11,271-file AssetStudio dump (`Dump/`) confirms there are 167 BattleEventNode stubs but does NOT contain their body fields — re-run with TypeTree dumps needed.
- **How to get**:
  - **(a)** Re-run AssetStudio with TypeTree dumps from `Tool/Il2CppInspectorRedux.GUI` — this populates the MonoBehaviour bodies
  - **(b)** Use `UnityPy` Python library to parse `data.unity3d` directly
  - **(c)** Run `dump_raw_nodes.py` again on the original game data
- **Estimated work**: 1-2 hours
- **For web rebuild**: critical for balancing monsters. Currently we have monster NAMES + ABILITIES but not STATS

#### 3. Decoded XNode Chinese text (no mojibake)
- **Status**: ⚠️ Raw text in `xnode_texts.json` (orig folder) has 4-byte UTF-8 chars broken. Note: the in-game `Zh.txt` localization file in `Dump/TextAsset/` is **already** mojibake (every byte 0xEFBFBD — the U+FFFD replacement char), so re-extraction from `chinese_strings.txt` is mandatory.
- **How to get**: Run the byte-by-byte UTF-8 parser fix described in `撘?頧桀?敶RE_full.md` §16.3
- **For web rebuild**: needed for in-game narrative display
- **Wave 3 progress**: confirmed chinese_strings.txt has Chinese text at IDs 1458 (龙之心), 1466 (灵体披风), etc. Already UTF-8 decodable.

### Medium Priority

#### 4. Monster level scaling formula
- **What**: How monster level relates to player level (the `EnemyLevel` field, `monsterLevelInptuField` debug)
- **Status**: ⚠️ Field names known, exact formula unknown
- **How to get**: Frida hook `CaculateBaseAttack` (which uses level) to observe scaling
- **For web rebuild**: needed for difficulty curve
- **Wave 3 progress**: confirmed `GenerateRandomEquipmentByType @ 0xC3CB8C` uses `level*X + Y` formulas with rarity weights `rar*(-25)+85 - luck` to `rar*7` cascading tiers. Equipment formula is similar pattern.

#### 5. XP curve (CaculateNewMaxExp RVA 0x00B39D30)
- **What**: What level cap is reached at each level (linear / exponential / table?)
- **Status**: ✅RVA known, formula unknown
- **How to get**: Frida hook + log XP table for levels 1-50
- **For web rebuild**: needed for progression pacing

#### 6. Shop prices (GroceryStore, PotionShop, FishStore)
- **What**: Cost of each item in each shop, stock refresh rate
- **Status**: ⚠️ Class names known, prices not extracted
- **How to get**: Frida hook or AssetStudio TypeTree dump
- **For web rebuild**: needed for economy balance

#### 7. Soul gain formula (CaculateGainSoulNum RVA 0x00B06E34)
- **What**: How many souls per monster? Difficulty multiplier?
- **Status**: ✅RVA known, formula unknown
- **How to get**: Frida hook
- **For web rebuild**: needed for reincarnation balance

#### 8. Equipment random property generation (AddRandomProperty)
- **What**: Pool of stat prefixes (e.g. "+attack", "+defence", "+HP"), weights, rarity-based stat ranges
- **Status**: ✅**PARTIALLY RESOLVED** — `data/WeaponSettingJS.json` now gives us the per-slot property pool. Each equipment row has `MainProperty` (always rolled), `SubProperty` (always rolled, or `?? for accessories), `SecondProperty` (comma-list of possible random affixes). What's STILL missing: per-rarity stat magnitudes (e.g. how much `?? is `+5` vs `+20`?) and the weighted roll table for affix selection.
- **How to get**: Frida hook + log generated properties, OR re-extract MonoBehaviour bodies with TypeTree
- **For web rebuild**: pool structure is enough to start; magnitudes can be tuned from feel
- **Wave 3 progress**: confirmed via Ghidra that `generateEquipment @ 0xC3CDC0` uses external `DAT_*` constants in `.data` for exact stat formulas. Pattern is `Random.Range(level*minMul+minAdd, level*maxMul+maxAdd)`. DEF base = `level*4+4` (main) / `level*2+2` (sub).

#### 9. Exact Cruel World modifier effects
- **What**: When you set Cruel World level 1/3/5/7/10, what specific modifiers apply to enemies and rewards?
- **Status**: ⚠️ Trigger conditions known, exact modifiers not extracted
- **How to get**: Read `CrulWorld` class fields in detail + AssetStudio TypeTree dump

### Resolved (moved to `rebuild_guide.md`)

| Old # | Topic | Resolution |
|---|---|---|
| 6 | Save file JSON schema | SKIP → `rebuild_guide.md` §9.4 (use localStorage) |
| 10 | Audio cues per event | SKIP → `rebuild_guide.md` §9.1 (use generic sounds) |
| 11 | Animation states | SKIP → `rebuild_guide.md` §9.2 (simple sprite transitions) |
| 12 | Icon/sprite per item | SKIP → `rebuild_guide.md` §9.3 (use emoji or color-coded cards) |
| 14 | Talent prerequisites / tree | RESOLVED → `rebuild_guide.md` §1.5 (random roll with rarity-tier probability) |
| 15 | Fishing mechanics | RESOLVED → `rebuild_guide.md` §1.6 (vertical bar with green area + oscillating indicator) |

---

## Recommended Extraction Order

For a complete rebuild, work in this order (each block takes 1-3 hours):

1. **AssetStudio TypeTree re-dump** (1-2 hrs) — *promoted to first because it unblocks #2 + #9 + #13*:
   - Open `Tool/Il2CppInspectorRedux.GUI` — Load IL2CPP — point to `libil2cpp.so` + `global-metadata.dat`
   - Export — Generate C# dummy DLL set **with TypeTrees**
   - Re-open AssetStudio — Options — load the dummy DLLs / enable Cpp2IL TypeTree
   - Re-export MonoBehaviours — field values will populate this time
   - Compare against existing `Dump/MonoBehaviour/*.txt` stubs

2. **Frida hook session** (4-6 hrs total):
   - Hook `CaculateBaseAttack` — derive level scaling
   - Hook `CaculateNewMaxExp` — derive XP table
   - Hook `CaculateGainSoulNum` — derive soul formula
   - Hook battle events — log HP/ATK/DEF/CRIT values per monster type
   - Hook `AddRandomProperty` — log per-rarity stat magnitudes

3. **XNode body extraction** (2-3 hrs):
   - Fix UTF-8 parser (per `撘?頧桀?敶RE_full.md` §16.3)
   - Re-run on `data.unity3d` to get clean Chinese text + per-monster stat prefix/suffix

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
| Damage formula | `damage = max(atk - def*0.5, atk*0.1) * (1 + atkBuff% - defBuff%)` | ❌ |
| Level scaling | `atk_per_level = 2.5, def_per_level = 1.5, hp_per_level = 10` | ❌ |
| XP curve | `maxExp = 10 * level^1.5` | ❌ |
| Soul per monster | `souls = monster_level * (1 + difficulty * 0.5)` | ❌ |
| Crit multiplier | `2.0` | ❌ |
| Block multiplier | `0.5` | ❌ |
| AP per turn | `5` | ❌ |
| Max AP | `5 + familyWealth / 20` | ❌ |
| Stamina cost per maze step | `1` (reduced by ?? talent and `?? relic by -1) | **✅relic data in data/RelicSettingJS.json** |
| Gold per kill | `monster_level * 5` | ❌ |
| Item drop chance | `10% + rareEquipLuck%` | ❌ |
| **Relic pool** | — | **✅51 entries, data/RelicSettingJS.json** |
| **Equipment pool** | — | **✅26 items + property pools, data/WeaponSettingJS.json** |
| **Adventure-deck weights** | — | **✅4 cards, data/EventCardTypeSettingJS.json** |
| **Talent effects** | — | **✅§2 of extracted_game_data.md** |
| **Buff stack rules** | — | **✅§1 of extracted_game_data.md** |
| **Skill 3-level scaling** | — | **✅§5 of extracted_game_data.md** |
| **Artifact (48) full effects** | — | **✅`artifact_complete.md`** |
| **Buff presets (15) + decay** | — | **✅`game_complete.md` §BUFFS** |
| **Equipment stat formulas** | — | **✅`game_complete.md` §EQUIPMENT** |

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
- `extracted_game_data.md` — All decoded game data (with 2026-6-9 wave-2 update)
- `dump_inventory.md` — Catalogue of the 11,271 files in `Dump/` (NEW, Wave 2)
- `extraction_summary.md` — How data was extracted, what was discovered
- `chinese_strings.txt` — Raw Chinese strings (Wave 1)
- `data/RelicSettingJS.json` — 51 canonical relics (NEW, Wave 2)
- `data/WeaponSettingJS.json` — 26 equipment items (NEW, Wave 2)
- `data/EventCardTypeSettingJS.json` — 4 adventure-deck card weights (NEW, Wave 2)
- `artifact_complete.md` — **48 artifacts full reverse (Wave 3)**
- `game_complete.md` — **enums + 15 skills + 15 buffs + 35 talents + equipment formulas (Wave 3)**
- (Orig folder) `il2cpp_extracted.md` — C# class signatures
- (Orig folder) `il2cpp.cs` — Full IL2CPP dump (147K lines)
- (Orig folder) `撘?頧桀?敶RE_full.md` — Original analysis (before cleanup)

---

## Wave 3 Session Notes (2026-6-10)

### Workflow Used
1. **Ghidra MCP** to decompile + read functions in libil2cpp.so
2. **Struct fix**: Il2CppClass had wrong offsets for Unity 2019.4 (vtable 0x138→0x130, cctor_thread 8B→4B, bitfield 2B→4B)
3. **Subagent delegation** for bulk extraction (85 skill lambdas, 31 typed lambdas, all 48 artifact subscriptions)

### Critical Discoveries
- **Dragon Heart (artifact #7)**: AfterAttack event → `attacker.AddBasicBuff(灼烧, 1)` at vtable[20].methodPtr
- **Attack event order**: ord=1 PreAttack, ord=5 PostCalcDamage, ord=6 PostCalcFinal, ord=10 Override (always-hits)
- **Only 1 class generator exists**: `SkillGenerator_generateZhanshiSkill` (warrior only). No mage/ranger generators.
- **Equipment is runtime-random**: `GenerateRandomEquipmentByType` uses `level*X+Y` formulas with rarity-tier weights

### Tools Created
- `bridge_mcp_ghidra.py` (existing) + GhidraMCP-5.13.1.zip (existing)
- Decompiled 79 lambdas + 85 skill lambdas + 35 talents + 15 buffs
- Restructured `Il2CppClass` struct (size 824B → 1328B)

### Next Session Targets
- Frida hook for CaculateBaseAttack (live value capture)
- Per-skill damage formula constants
- Other class skill generators (if any exist in data files, not binary)
