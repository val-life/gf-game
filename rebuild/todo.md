# TODO / Missing Information for Web Rebuild

> **Last updated**: 2026-6-10 (Wave 7 — A1 moved to `extracted_game_data.md` §4c; B1 removed; only B2 remains)
>
> Resolved items live in their source-of-truth docs. This file only tracks what's still missing for the web rebuild.

---

## Missing items, by category

### B. Optional / nice-to-have (can ship without)

#### B2. Multi-stage boss fight difficulty curve
- **What it is**: the 13 `isFinalBossEvent` boss battles have difficulty / damage scaling that may differ from the regular `Monster_SetLevel` formula.
- **How to get**: search for the `isFinalBossEvent` check in the decompiled battle code; likely a different scaling path. ~1 hr.
- **Why it's optional**: the 2 true final bosses (pid 13989, 14504 — 魔王I/II) can ship with the same scaling as elite bosses; the "multi-stage curve" is a balance tuning concern, not a hard requirement.

---

## Files Referenced

- `rebuild_guide.md` — Main design reference (all formulas, system overview, implementation order, Wave 1-7 changelog in the header)
- `ghidra_results.md` — Decompiled formulas + .data constants from `libil2cpp.so` (Wave 5 + 6)
- `save_format.md` — **Complete save file schema** (6 per-run keys + 1 cross-run key, AES-encrypted) — extracted via Ghidra
- `extracted_game_data.md` — All decoded game data, **§4c final-boss event MB layouts (Wave 7)**
- `dump_inventory.md` — Catalogue of the 11,271 `Dump/*` files by bucket
- `extraction_wave4.md` — TypeTree dump extraction (Wave 4)
- `extraction_summary.md` — How data was extracted, what was discovered (Wave 1+2)
- `game_complete.md` — enums + 15 skills + 15 buffs + 35 talents + equipment formulas (Wave 3)
- `artifact_complete.md` — 48 artifacts full reverse (Wave 3)
- `data/mb_*.json` — Battle events (Wave 4 + 7), map areas, condition switches, etc.
- `data/monoscript_catalog.json` — 780 PathID → Class.Namespace.Assembly map
- `parse_battle_events_raw.py` — **(Wave 7)** raw byte parser for BattleEvent MBs
- (Orig folder) `il2cpp_extracted.md` — C# class signatures
- (Orig folder) `il2cpp.cs` — Full IL2CPP dump (147K lines)
