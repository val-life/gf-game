"""Final extraction stats for summary doc."""
import json
import sys
from pathlib import Path
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

data_dir = Path("rebuild/data")
report = {}

# BattleEvent
d = json.loads((data_dir / "mb_battle_events_full.json").read_text(encoding="utf-8"))
bosses = [r for r in d if r.get("isBossEvent") is True]
final_bosses = [r for r in d if r.get("isFinalBossEvent") is True]
# Use reward > 0 to filter sentinel
def has_real_reward(r):
    for k in ("expReward", "goldReward", "equipmentReward"):
        v = r.get(k)
        if isinstance(v, int) and v >= 0 and v < 1_000_000:
            return True
    return False
valid_rewards = [r for r in d if has_real_reward(r)]
report["battle_events"] = {
    "total": len(d),
    "boss": len(bosses),
    "final_boss": len(final_bosses),
    "with_normalAttackContent": sum(1 for r in d if r.get("normalAttackContent")),
    "with_sneakAttackContent": sum(1 for r in d if r.get("sneakAttackContent")),
    "with_enemyList": sum(1 for r in d if r.get("enemyList")),
    "with_rewards": len(valid_rewards),
}

# MapAreaStat
d = json.loads((data_dir / "mb_map_area_stats.json").read_text(encoding="utf-8"))
report["map_area_stats"] = {
    "total": len(d),
    "with_chinese_descript": sum(1 for r in d if r.get("areaDescript_chinese")),
    "with_mapObjects": sum(1 for r in d if (r.get("mapObjects_raw") or [])),
}

# MapAreas
d = json.loads((data_dir / "mb_map_areas.json").read_text(encoding="utf-8"))
report["map_areas"] = {"total": len(d)}

# MapObject
d = json.loads((data_dir / "mb_map_objects.json").read_text(encoding="utf-8"))
report["map_objects"] = {
    "total": len(d),
    "with_effect_strings": sum(1 for r in d if r.get("effect_chinese_list")),
    "total_effect_entries": sum(len(r.get("effect_chinese_list") or []) for r in d),
}

# EventLine
d = json.loads((data_dir / "mb_event_lines.json").read_text(encoding="utf-8"))
report["event_lines"] = {
    "categories": len(d),
    "total_files": sum(len(v) for v in d.values()),
}

# ConditionSwich
d = json.loads((data_dir / "mb_condition_switches.json").read_text(encoding="utf-8"))
report["condition_switches"] = {"total": len(d)}

# XNode edges
d = json.loads((data_dir / "mb_xnode_edges.json").read_text(encoding="utf-8"))
report["xnode_edges"] = {
    "total": len(d),
    "from_files": len(set(e["from_file"] for e in d)),
    "to_files": len(set(e["to_file"] for e in d if e.get("to_file"))),
}

# Catalog (no top_classes to keep file small)
d = json.loads((data_dir / "typemb_catalog.json").read_text(encoding="utf-8"))
report["catalog"] = {
    "total_files": d.get("total_files"),
    "unique_names": len(d.get("by_name", {})),
    "unique_classes": len(d.get("by_class", {})),
}

# Strings
d = json.loads((data_dir / "mb_strings_decoded.json").read_text(encoding="utf-8"))
report["decoded_chinese"] = {
    "files_with_chinese": len(d),
    "total_strings": sum(len(v) for v in d.values()),
}

print(json.dumps(report, ensure_ascii=False, indent=2))
Path("rebuild/data/mb_extraction_report.json").write_text(
    json.dumps(report, ensure_ascii=False, indent=2),
    encoding="utf-8",
)
print("\nSaved to rebuild/data/mb_extraction_report.json")
