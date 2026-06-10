# TODO / Missing Information for Web Rebuild

> **Last updated**: 2026-6-10 (Wave 6 — Ghidra reward formulas, monster stats, condition system, damage formula, talent weights, EvilCrystal schema, property check)
> **Source of truth**: `rebuild_guide.md` §1-9 + `extracted_game_data.md` + `ghidra_results.md` + `save_format.md`
>
> This file tracks what we **don't have** for the web rebuild. Resolved items are documented in their respective files (no Resolved table here — see the source-of-truth docs directly).

---

## Missing items, by category

### A. Content / data

#### A1. 3 / 167 final-boss multi-stage battle layouts
- **What it is**: 13 `isFinalBossEvent = true` battles in `mb_battle_events_full.json` have empty `enemyList` and a complex `SecendBattleStr` blob that the simple parser doesn't decode. The 13 file PathIDs are 15519, 15723, 15998, 15999, 16000, 16001, 16002, 16003, 16004, 16005, 16006, 16085, 16238. These are the multi-stage final-boss fights (魔王I, 魔王II, 魔王眷属, etc.).
- **How to get**: hand-decode the `SecendBattleStr` Unity List<string> serialization. The pattern is `[(int32 length)][UTF-8 bytes][align 4]` per entry, same as the existing `parse_unity_string_list` helper in `parse_typemb.py`. ~1 hr.
- **Why it matters**: these are the 3-stage Demon King fights; without the layouts, the final boss battles can't be rebuilt.

---

### B. Optional / nice-to-have (can ship without)

#### B1. Full structured per-field decode of every MonoBehaviour class
- **What it is**: `monoscript_catalog.json` has 780 classes; `mb_file_index.json` has 10,243 MB files. Only the 5 most important classes (BattleEventNode, MapAreaStatNode, MapAreasNode, MapObjectNode, EventLine variants) have structured decode. The other 166 classes are stub-only.
- **How to get**: run `parse_typemb.py` with each new class's field layout. Already-supported helper exists; just need the field maps.
- **Why it matters**: for the 65 "top" classes (UI, conditions, etc.) the rebuild doesn't need them. The remaining 100+ are probably event-related (chest, rest, story, etc.) and the rebuild only needs their text content (already in `xnode_texts.json`).

#### B2. Multi-stage boss fight difficulty curve
- **What it is**: the 13 `isFinalBossEvent` battles have difficulty / damage scaling that may differ from the regular `Monster_SetLevel` formula.
- **How to get**: search for the `isFinalBossEvent` check in the decompiled battle code; likely a different scaling path. ~1 hr.

---
## Files Referenced

- `rebuild_guide.md` — Main design reference (all formulas, system overview, implementation order)
- `ghidra_results.md` — Decompiled formulas + .data constants from `libil2cpp.so` (Wave 5 + 6)
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
