# TODO / Missing Information for Web Rebuild

> **Last updated**: 2026-6-10 (Wave 5+ — Ghidra decompilation + save format schema extraction)
> **Source of truth**: `rebuild_guide.md` §1-9 + `extracted_game_data.md` + `ghidra_results.md` + `save_format.md`
>
> This file tracks what we **don't have** for the web rebuild. Resolved items are documented in their respective files (no Resolved table here — see the source-of-truth docs directly).
>
> **What's been extracted** (6+ waves): all 9 `CaculateBase*` stat formulas; XP curve; soul/money/XP reward formulas; equipment property magnitude table; rarity weight table; shop prices for all 12 items; monster level-scaling formula; **complete save file schema** (no rooted device needed); all 167 battle events; 1,477 XNode texts; 51 relics; 26 equipment items; 35 talents; 15 skills; 10 buffs; 48 artifacts; 5 endings; 4 adventure-deck card weights.

---

## Missing items, by category

### A. Combat / balance (mostly small)

#### A1. Cruel World per-level reward bonuses (XP / gold multipliers)
- **What it is**: When Cruel World level is 1/3/5/7/10, are there explicit multipliers on the gold/XP rewards from battles? The `CaculateBaseAttack` damage multiplier is fully extracted (CW adds `+ cruelLevel` per Power, and `* (cruelLevel + ...)` for monster ATK), but the REWARD multipliers aren't found in the decompiled `GainMoney` / `AddExp` / `CaculateGainSoulNum` paths.
- **How to get**:
  - **Frida hook** at runtime — set `GameManager.cruelLevel = 1, 3, 5, 7, 10` in turn, log gold/XP/soul from the same battle, compare ratios.
  - **Ghidra** — search `libil2cpp.so` for the literal string `残酷世界` (Cruel World) and trace the call graph. The decompiled `Monster_SetLevel` only handles damage, not rewards; the reward effect must be elsewhere (likely a class that hooks into `GainMoney` / `AddExp` like an `IBattleObserver` or in the `GameManager` turn loop).
  - **Back-derive from gameplay data** — `mb_battle_events_full.json` has 44 records with `expReward` / `goldReward`; the ratio at different CW levels can be back-fit if you can run the same battle at different CW levels.
- **Effort**: Frida 1 hr, Ghidra 1 hr, back-derive 1 hr.

#### A2. Per-`MonsterSpecies` base stats (Undead/Beast/Dragon/Human/Bone)
- **What it is**: Each monster has a base `attack` and `health` before `Monster_SetLevel` scaling. The level-scaling formula `atk = base * (CW + (pow(L, exp) * 0.15 * (L+1)) / 10 + 0.9)` is extracted, but the `base` value is set per species in the `MonsterGenerater` ctor's 48+ lambda functions (`_.ctor_b__5_0` through `_.ctor_b__5_47`).
- **How to get**:
  - **Ghidra** — decompile the 48+ `_.ctor_b__5_X` closures in `MonsterGenerater` (`il2cpp.cs:83566`, RVA range 0x00AA4CB8..0x00AA5F40). Each is a hardcoded `Monster.Builder.SetXxx(...)` chain for one species. ~20 min of work, very mechanical.
  - **Frida** — instantiate `MonsterGenerater` and dump `monsters[*].attack / .health / .monsterSpecies`.
- **Effort**: Ghidra 1-2 hr, Frida 30 min.
- **Why it matters**: the web rebuild needs actual numbers to back-derive the 44 records in `mb_battle_events_full.json` that have `expReward`/`goldReward`/`equipmentReward` but no per-monster stat.

#### A3. Equipment property Main values look unusual in some decompiles
- **What it is**: The `Main` row of the per-(property, slot) magnitude table in `ghidra_results.md` §3.2 has a few values that look strange (Critical main `(0.005, 0.025)` is *smaller* than Sub `(0.005, 0.03)`; AtkSpeed main `(0.006, 0.025)` is *smaller* than Sub `(0.006, 0.04)`). This is due to the C# `&&` short-circuit + comma-expression idiom making Ghidra's decompiled switch arms ambiguous.
- **How to get**:
  - **Frida hook** `AdventrueManager_generateEquipmentProperty`, call with `level=10, property=CritRate, slot=Main`, log the result. Repeat for AtkSpeed/Recovery/etc.
  - **Ghidra** — re-decompile the switch case with `Set Equate Operands on Switch` disabled, or use a different decompiler to clarify which assignment arm runs.
- **Effort**: Frida 1 hr, Ghidra 1 hr.
- **Risk if not fixed**: web-rebuild equipment stats may be 10-20% off the original for Main-property Crit/AtkSpeed/Recovery items.

#### A4. AES key for save file encryption ✅ EXTRACTED
- **Was**: `SaverSystem.AESEncrypt(Data, Key)` uses a key from a static field. The key is set in the static ctor at RVA `0x00BEFAB0`.
- **Now resolved**: decompiling `SaverSystem__cctor @ 0x00BEFAB0` gave us the key. Ghidra's decompiled StringLiteral is `eqdzcderrtseqaxd` (16 ASCII chars = 128-bit AES key). Stored in the static field at `SaverSystem_typeinfo + 0xb8` (= the field `SaverSystem.key`).
- **Status**: ✅ Key = `"eqdzcderrtseqaxd"`. Documented in `save_format.md` §5. **Verify with Frida hook on `SaverSystem.AESEncrypt` if you want 100% confirmation.**

---

### B. Content / data

#### B1. 3 / 167 final-boss multi-stage battle layouts
- **What it is**: 13 `isFinalBossEvent = true` battles in `mb_battle_events_full.json` have empty `enemyList` and a complex `SecendBattleStr` blob that the simple parser doesn't decode. The 13 file PathIDs are 15519, 15723, 15998, 15999, 16000, 16001, 16002, 16003, 16004, 16005, 16006, 16085, 16238. These are the multi-stage final-boss fights (魔王I, 魔王II, 魔王眷属, etc.).
- **How to get**: hand-decode the `SecendBattleStr` Unity List<string> serialization. The pattern is `[(int32 length)][UTF-8 bytes][align 4]` per entry, same as the existing `parse_unity_string_list` helper in `parse_typemb.py`. ~1 hr.
- **Why it matters**: these are the 3-stage Demon King fights; without the layouts, the final boss battles can't be rebuilt.

#### B2. 5 ending full trigger conditions
- **What it is**: 5 endings (Slow Life, Noble, Rebuild, Strongest, True) have partial triggers in `extracted_game_data.md` §6, but the full conditional logic (e.g. "all 12 storylines of Lumnia completed + age >= 40 + no death escape used") is in `EndingEventDirector` (not yet decompiled).
- **How to get**:
  - **Ghidra** — find `EndingEventDirector` (search `il2cpp.cs` for the class), decompile its `CheckEnding` / `OnEndingReached` methods. Should be a switch on the 5 ending IDs.
  - **Back-derive from `data/mb_event_lines.json`** — the 5 endings have NPC names, and the storyline completion flags are saved in `CharacterSaver` (already known).
- **Effort**: Ghidra 1 hr.

#### B3. AdventrueAreaSaver content
- **What it is**: Each region in the world map has a saver with `AllAdventrueAreas` and `UnlockedAdventrueAreas`. The class is in `il2cpp.cs:7002-7000` but the per-region defaults / unlock requirements are not in the binary (they're loaded from the XNode graph).
- **How to get**: decompile `GameRegionManager` init flow + read the 6 `MapAreasNode` (graph_pid 13857-13861 + 1 more) XNode files. ~1 hr.

#### B4. `EventCrystalSaver` (the EvilCrystal meta-progression)
- **What it is**: `EventCrystalSaver` class is in `monoscript_catalog.json` (path_id=29). The full schema of what EvilCrystal upgrade stages / costs look like hasn't been extracted. The game has a "Reset" button (`AllResetEvilCrystal`) that suggests it's a long progression.
- **How to get**:
  - **Ghidra** — search `il2cpp.cs` for `EventCrystalSaver` class fields, decompile `EvilCrystalUpgrade` / `EvilCrystalValueChange` methods.
  - **Back-derive from the relics**: each permanent upgrade in the `RelicSettingJS.json` `AcquisitionMethod: Special` + `AcquisitionLimit: Once` is probably an EvilCrystal upgrade.
- **Effort**: Ghidra 1-2 hr.

---

### C. Optional / nice-to-have (can ship without)

#### C1. Save file → web-rebuild format migration table
- **What it is**: when a user loads a real Android save into the web rebuild, the field names need a 1:1 mapping (`CharacterManagetSaver` typo → `CharacterManagerSaver`, `Parter` → `Partner`, etc.). The full list of 10+ typos is in `save_format.md` §4.
- **How to get**: write a migration function in JS. ~30 min. Listed as "optional" because the web rebuild can just use corrected field names on save, and the load path tries both names.
- **Already done**: typo list is in `save_format.md` §4.

#### C2. Full structured per-field decode of every MonoBehaviour class
- **What it is**: `monoscript_catalog.json` has 780 classes; `mb_file_index.json` has 10,243 MB files. Only the 5 most important classes (BattleEventNode, MapAreaStatNode, MapAreasNode, MapObjectNode, EventLine variants) have structured decode. The other 166 classes are stub-only.
- **How to get**: run `parse_typemb.py` with each new class's field layout. Already-supported helper exists; just need the field maps.
- **Why it matters**: for the 65 "top" classes (UI, conditions, etc.) the rebuild doesn't need them. The remaining 100+ are probably event-related (chest, rest, story, etc.) and the rebuild only needs their text content (already in `xnode_texts.json`).

#### C3. Animator/Animation state machines
- **What it is**: 24 Animator controllers and 6 AnimationClips in `Dump/Animator` and `Dump/AnimationClip`. The rebuild needs simple "attack animation", "death animation" markers for the 50 monsters.
- **How to get**: read `animationclip_index.json` and `animatorcontroller_index.json` to map `monsterId` → `animationName`. ~30 min.
- **Why it matters**: optional — rebuild can use static sprites (decision in `rebuild_guide.md` §9.2).

#### C4. `潜行` (Hunter) profession-locked relics
- **What it is**: Weapon pool has 猎人 (Hunter) profession-locked items (镰刀, 皮甲, 面具, 吸血戒指, 闪避戒指) but no `RelicSettingJS` entries are `猎人`-only. The hunter relic pool may genuinely be just `通用`/`战士`, or the hunter equipment lock is the only profession restriction and relics are profession-agnostic.
- **How to get**: decompile `Hero.CheckPropertyAvalable` to see if it filters relics by profession. ~10 min via Ghidra.
- **Likely outcome**: confirmed data gap (not a code gap) — hunter relics don't exist, period.

#### C5. Talent prerequisites / selection weights
- **What it is**: 35 talents with random roll, but the rarity-tier probability is unknown (per `rebuild_guide.md` §1.5, "D/A/special/Legendary" tier weights are placeholders from user description).
- **How to get**:
  - **Ghidra** — decompile `HeroTalentGenerator @ 0xB3B2F8` (the constructor that builds all 35 talents) and look for the `rnd` / weight-based selection.
  - **Frida** — call `HeroTalentBox.Roll()` 1000 times, count the per-talent frequency.
- **Effort**: Ghidra 30 min, Frida 1 hr.

#### C6. `OnAttack` / `OnUnderAttack` damage flow exact inner multipliers
- **What it is**: `rebuild_guide.md` §4.1 has a placeholder damage formula with `def * 0.5` and `atk * 0.1` floor — these are inferred from the battle code, not extracted. The exact per-skill modifiers live in `Creature.OnAttack` / `OnUnderAttack` which haven't been fully decompiled.
- **How to get**: decompile `Creature.OnAttack` (~0x00B0AC30) and `OnUnderAttack` (~0x00B0AF40). ~30 min.
- **Why it matters**: low — the inferred formula is close enough for game feel; the exact coefficients are only needed for damage calculations to be 100% faithful to the original.

#### C7. Multi-stage boss fight difficulty curve
- **What it is**: the 13 `isFinalBossEvent` battles have difficulty / damage scaling that may differ from the regular `Monster_SetLevel` formula.
- **How to get**: search for the `isFinalBossEvent` check in the decompiled battle code; likely a different scaling path. ~1 hr.

---

### D. Resources not in scope (skipped per `rebuild_guide.md` §9)

- Audio (BGM/SFX) — use generic or none
- 3D models / pixel data — use icons
- Server / multiplayer — single-player only
- Android-specific save encryption wrapper — use localStorage
- Anti-addiction / child-protection config — not relevant for web rebuild

---

## Files Referenced

- `rebuild_guide.md` — Main design reference (all formulas, system overview, implementation order)
- `ghidra_results.md` — Decompiled formulas + .data constants from `libil2cpp.so` (Wave 5)
- `save_format.md` — **Complete save file schema** (6 per-run keys + 1 cross-run key, AES-encrypted) — extracted via Ghidra
- `extracted_game_data.md` — All decoded game data (talents, items, monsters, skills, buffs, achievements, equipment, event-deck, Wave 3 counts)
- `dump_inventory.md` — Catalogue of the 11,271 `Dump/*` files by bucket
- `extraction_wave4.md` — TypeTree dump extraction (Wave 4)
- `extraction_summary.md` — How data was extracted, what was discovered (Wave 1+2)
- `game_complete.md` — enums + 15 skills + 15 buffs + 35 talents + equipment formulas (Wave 3)
- `artifact_complete.md` — 48 artifacts full reverse (Wave 3)
- `data/RelicSettingJS.json` — 51 canonical relics (Wave 2)
- `data/WeaponSettingJS.json` — 26 equipment items + property pools (Wave 2)
- `data/EventCardTypeSettingJS.json` — 4 adventure-deck card weights (Wave 2)
- `data/xnode_texts.json` — 1,477 XNode nodes, 5,383 clean Chinese strings (Wave 4)
- `data/mb_*.json` — TypeTree-decoded MB fields (Wave 4, 11 files)
- `data/monoscript_catalog.json` — 780 PathID → Class.Namespace.Assembly map
- (Orig folder) `il2cpp_extracted.md` — C# class signatures
- (Orig folder) `il2cpp.cs` — Full IL2CPP dump (147K lines)
