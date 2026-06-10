# TODO / Missing Information for Web Rebuild

> **Last updated**: 2026-6-10 (Wave 5 — Ghidra analysis pass)
> **Source of truth**: `rebuild_guide.md` + `extracted_game_data.md` + `dump_inventory.md` + `artifact_complete.md` + `game_complete.md` + `extraction_wave4.md` + `ghidra_results.md`

This file tracks what we **don't have** for the web rebuild. Items here are blockers or nice-to-haves, sorted by impact.

> **Resolved items moved to `rebuild_guide.md`** (skipped systems in §9, design decisions in §1.5/1.6) — see "Resolved" table at the end.
> **AssetStudio TypeTree dump is EXHAUSTED** for game data — what remains lives in `libil2cpp.so` binary, not `data.unity3d`. Extraction paths for the remaining items are: Frida hook (live values), Ghidra decompile (.so method bodies + .data section constants), or back-derive from talent/reward values (already in JSON).
>
> **Wave 5 (Ghidra pass) results** are in `ghidra_results.md`. Most formula-blocker items (#1, #4, #5, #6, #7, #8) are now RESOLVED. Item #9 (Cruel World per-level rewards) is still partial — the difficulty/attack modifier is fully extracted, but loot multipliers (XP/gold bonus) are not.

---

## Resolved in Wave 5 (Ghidra decompilation of `libil2cpp.so`)

> Full results in **`ghidra_results.md`**. The symbols ARE preserved on the ARM64 binary, so decompiled bodies were readable (not stripped IL2CPP stubs as the original todo assumed).

| Old # | Topic | Resolution | Method/RVA |
|---:|---|---|---|
| 1 | Damage formula constants | ✅ `attack = (每点力量攻击力Addition + 0.4 + CW) * Power + 5` ; `defence = (每点体质防御力Addition + 0.5) * Constitution` | `Hero_CaculateBaseAttack` `0x00B36668`, `Hero_CaculateBaseDefence` `0x00B36974` |
| 4 | Monster level scaling | ✅ `attack = base * (CW + (pow(L, exp) * 0.15 * (L+1)) / 10 + 0.9)` ; `health` same shape, `exp = Addition + 1.35` | `Monster_SetLevel` `0x00A9F1C0` |
| 5 | XP curve | ✅ `MaxExp = (int)(level^1.25 * 100)` | `HeroLevel_CaculateNewMaxExp` `0x00B39D30` |
| 6 | Shop prices | ✅ `price = (250 + Addition) * (Rarity+1)` (or `/4` for `relicType==3`); per-item discount on top. All 12 shop items decoded. **Todo misnames**: 精致绑腿→精致便衣, 防御药剂→忍耐药剂, 木质钓鱼竿→玫瑰鱼竿, 钢制钓鱼竿→钢石鱼钩 | `Commody_InitCommody` `0x00B081B0`, store `InitStore` methods |
| 7 | Soul gain formula | ✅ `souls = (reincTime*10 + 200) + (level+1) * ((baseSoul + allHeroSoul) * 0.01)`, cap 20000 | `ComfirmGainSoulPanel_CaculateGainSoulNum` `0x00B06E34` |
| 8 | Equipment random property | ✅ Per-(property, slot) `level*minMul+maxAdd` magnitude table; ±5% variance. Defence special-cased. 20% chance to bump level by 1. Rarity weights are `rarityLevel`-based. | `AdventrueManager_generateEquipment` `0x00C3CDC0`, `generateEquipmentProperty` `0x00C3DB48` |
| 9 | Cruel World modifiers | ⚠️ **PARTIAL**: `GameManager.cruelLevel` is added to hero attack and monster atk/hp scaling, but the per-level reward bonuses (XP/gold multipliers) are not in the decompiled code. May be hardcoded in unreached functions. | `CrulWordToggle_*` `0x00B0E30C..0x00B0E460`, `Monster_SetLevel`, `Hero_CaculateBaseAttack` |

### Outstanding sub-items (mostly minor)

- **CW reward multipliers** (item #9) — not extracted; would need Frida hook or decompiling the battle reward settlement code (`Hero.BattleEnd`, `AdventrueManager.AwardBattle` or equivalent).
- **Monster species base stats** (per `MonsterSpecies` 0-4) — `MonsterGenerater` not decompiled yet; placeholders from `mb_battle_events_full.json` `EnemyList` can be used.
- **Battle XP/gold reward scaling** — needs `Hero.BattleEnd` / battle settlement decompilation.
- **`GameConst` initial `Addition` values** — all base values are 0.0 (uninitialized doubles); the actual per-talent additions live in the relic/talent JSON (already in `extracted_game_data.md`).
- A few `Main` values in the equip property table (Crit, AtkSpeed, Recovery) look unusual in the decompile (the C# `&&` short-circuit idiom); flagged for Frida verification at level 10 if the web build needs them exact.

---

## Resolved (moved to `rebuild_guide.md`)

| Old # | Topic | Resolution |
|---|---|---|
| 2 | XNode BattleEventNode body fields | ✅ Wave 4 → `data/mb_battle_events_full.json` (167 records with `normalAttackContent` + `sneakAttackContent` + `EnemyList` + `expReward`/`goldReward`/`equipmentReward`) |
| 3 | XNode Chinese text decode | ✅ Wave 4 → `data/xnode_texts.json` (1,477 nodes, 5,383 clean strings, 0 mojibake) |
| 6 | Save file JSON schema | SKIP → `rebuild_guide.md` §9.4 (use localStorage) |
| 10 | Audio cues per event | SKIP → `rebuild_guide.md` §9.1 (use generic sounds) |
| 11 | Animation states | SKIP → `rebuild_guide.md` §9.2 (simple sprite transitions) |
| 12 | Icon/sprite per item | SKIP → `rebuild_guide.md` §9.3 (use emoji or color-coded cards) |
| 14 | Talent prerequisites / tree | RESOLVED → `rebuild_guide.md` §1.5 (random roll with rarity-tier probability) |
| 15 | Fishing mechanics | RESOLVED → `rebuild_guide.md` §1.6 (vertical bar with green area + oscillating indicator) |

---

## Files Referenced

- `rebuild_guide.md` — Main guide
- `extracted_game_data.md` — All decoded game data (Wave 1+2)
- `dump_inventory.md` — Catalogue of the 11,271 files in `Dump/` (Wave 2)
- `extraction_summary.md` — How data was extracted, what was discovered (Wave 1+2)
- `extraction_wave4.md` — TypeTree dump extraction (Wave 4)
- `ghidra_results.md` — Decompiled formulas + constants from `libil2cpp.so` (Wave 5)
- `chinese_strings.txt` — Raw 1,834 Chinese strings from `global-metadata.dat` (Wave 1)
- `data/RelicSettingJS.json` — 51 canonical relics (Wave 2)
- `data/WeaponSettingJS.json` — 26 equipment items + property pools (Wave 2)
- `data/EventCardTypeSettingJS.json` — 4 adventure-deck card weights (Wave 2)
- `data/xnode_texts.json` — 1,477 XNode nodes, 5,383 clean Chinese strings (Wave 4)
- `data/mb_*.json` — TypeTree-decoded MB fields (Wave 4, 11 files)
- `data/monoscript_catalog.json` — 780 PathID → Class.Namespace.Assembly map
- `data/_ghidra_constants.json` — Machine-readable formula constants (Wave 5)
- `artifact_complete.md` — 48 artifacts full reverse (Wave 3)
- `game_complete.md` — enums + 15 skills + 15 buffs + 35 talents + equipment formulas (Wave 3)
- (Orig folder) `il2cpp_extracted.md` — C# class signatures
- (Orig folder) `il2cpp.cs` — Full IL2CPP dump (147K lines)
