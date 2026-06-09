#!/usr/bin/env python3
"""Parse BattleEventNode raw blobs into structured JSON.

Per-tail layout:
  +0   PPtr<NodeGraph> graph (4 + 8 = 12 bytes)  -> world graph PathID
  +12  Vector2 position (8 bytes)
  +20  ~12 bytes XNode bookkeeping
  +32  int32 port_count (= 3)
  +36  ~28 bytes port array head
  +64  string intro_normal
  +N   string intro_sneak
  +N   int32 monster_slot_count (= 6)
  +N   6 x string monster_name ("无" if empty)
  +N   3 x int32 trailing flags

Writes rebuild/data/battle_events.json.
"""
import json
import struct
from pathlib import Path

DATA = Path(r'A:\github project\game 2\rebuild\data')

mb_idx   = json.loads((DATA / 'monobehaviour_index.json').read_text('utf-8'))
blob_idx = json.loads((DATA / 'monobehaviour_blobs_index.json').read_text('utf-8'))
blob_bin = (DATA / 'monobehaviour_blobs.bin').read_bytes()


def read_str(buf, off):
    slen = struct.unpack_from('<i', buf, off)[0]
    off += 4
    if slen < 0 or off + slen > len(buf):
        return None, off
    try:
        s = buf[off:off + slen].decode('utf-8')
    except UnicodeDecodeError:
        return None, off
    off += slen
    off = (off + 3) & ~3
    return s, off


records = []
for r in mb_idx:
    if r['script_pid'] != 180:  # BattleEventNode
        continue
    off, ln = blob_idx[str(r['path_id'])]
    tail = blob_bin[off:off + ln]

    # graph PathID
    graph_pid = struct.unpack_from('<q', tail, 4)[0]

    # position
    pos_x, pos_y = struct.unpack_from('<2f', tail, 12)

    # Strings start at offset 64
    cur = 64
    intro_a, cur = read_str(tail, cur)
    intro_b, cur = read_str(tail, cur)

    if intro_a is None or intro_b is None:
        records.append({
            'path_id': r['path_id'],
            'graph_pid': graph_pid,
            'position': [pos_x, pos_y],
            'parse_ok': False,
            'tail_bytes': ln,
        })
        continue

    # Slot count then 6 monster names (sometimes the count appears differently)
    if cur + 4 > ln:
        slot_count = 0
        monsters = []
    else:
        slot_count = struct.unpack_from('<i', tail, cur)[0]
        cur += 4
        monsters = []
        # Read up to slot_count strings, but cap at 12 for safety
        for _ in range(min(max(slot_count, 0), 12)):
            s, cur = read_str(tail, cur)
            if s is None:
                break
            monsters.append(s)

    # Trailing flags (3 int32)
    trailing = []
    if cur + 12 <= ln:
        trailing = list(struct.unpack_from('<3i', tail, cur))
        cur += 12

    records.append({
        'path_id':       r['path_id'],
        'graph_pid':     graph_pid,
        'position':      [pos_x, pos_y],
        'intro_normal':  intro_a,
        'intro_sneak':   intro_b,
        'slot_count':    slot_count,
        'monsters':      [m for m in monsters if m and m != '无'],
        'monster_slots': monsters,
        'trailing':      trailing,
        'tail_bytes':    ln,
        'parse_ok':      True,
    })

records.sort(key=lambda r: (r['graph_pid'], r['path_id']))
out = DATA / 'battle_events.json'
out.write_text(json.dumps(records, ensure_ascii=False, indent=2), encoding='utf-8')

ok = sum(1 for r in records if r['parse_ok'])
print(f'Parsed {ok}/{len(records)} BattleEventNodes successfully')
print(f'  -> {out.name} ({out.stat().st_size:,} bytes)')

# Per-graph monster summary
from collections import Counter
per_graph = Counter()
per_monster = Counter()
for r in records:
    if not r['parse_ok']:
        continue
    per_graph[r['graph_pid']] += 1
    for m in r['monsters']:
        per_monster[m] += 1

print()
print('BattleEvents per world graph:')
GRAPH_NAMES = {
    13857: 'Mine (矿山)',
    13858: 'Elven Forest (精灵之森)',
    13859: 'Misty Forest (迷雾森林)',
    13860: 'Orc Mountain (兽人山脉)',
    13861: 'Cemetery (墓地/魔域)',
    14842: 'Final boss / misc',
}
for g, c in per_graph.most_common():
    print(f'  graph_pid={g}  count={c:3d}  {GRAPH_NAMES.get(g, "?")}')

print()
print('Top monsters (by # of battle slots referencing them):')
for m, c in per_monster.most_common(20):
    print(f'  {c:3d}  {m}')
