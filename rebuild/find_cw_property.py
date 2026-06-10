"""Check if CruelWorld / AddRandomProperty config is in MB data."""
import json
import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
from pathlib import Path

idx = json.loads(Path("rebuild/data/mb_file_index.json").read_text(encoding="utf-8"))

# 1. Search for CrulWorld / CruelWorld class
print("=== Classes matching 'Crul' or 'Cruel' ===")
hits = []
for r in idx:
    cls = (r.get("class") or "").lower()
    if "crul" in cls or "cruel" in cls:
        hits.append(r)
for h in hits[:20]:
    print(f"  {h['file']}: class={h['class']}")

# 2. Search for RandomProperty / AddProperty / Affix / Property
print("\n=== Classes matching 'roperty' / 'ffix' ===")
hits2 = []
for r in idx:
    cls = (r.get("class") or "")
    if "roperty" in cls or "ffix" in cls or "endom" in cls or "arity" in cls:
        hits2.append(r)
for h in hits2[:20]:
    print(f"  {h['file']}: class={h['class']}")

# 3. All unique classes for context
print("\n=== All unique classes (count) ===")
from collections import Counter
c = Counter(r.get("class") or "(none)" for r in idx)
for cls, n in sorted(c.items(), key=lambda x: -x[1])[:30]:
    print(f"  {n:5d}  {cls}")

# 4. Search for "Shop" / "Store" / "Merchant"
print("\n=== Classes matching 'Shop' / 'Store' ===")
for r in idx:
    cls = (r.get("class") or "")
    if any(k in cls for k in ("Shop", "Store", "Grocery", "Potion", "FishStore", "Merchant")):
        print(f"  {r['file']}: class={cls}")
