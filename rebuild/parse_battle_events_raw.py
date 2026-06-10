"""Parse BattleEvent MonoBehaviour raw bytes from data.unity3d.

IL2CPP builds strip user-script TypeTrees, so we can't use TypeTree decoders.
This walks the MB tail byte-by-byte using the C# class field order:

  Node.graph (12 bytes) | Node.position (8) | Node.ports.keys (4) | Node.ports.values (4)
  | AENE.nodeType (4) | BE.exploreStat (4) | BE.EventType (4) | BE.IsBossEvent (4)
  | BE.ProbilyRelics (List<string>) | BE.WinBossBattleStr (string)
  | BE.IsFinalBossEvent (4) | BE.SecendBattleStr (string) | BE.SecendEnemyList (List<string>)
  | BE.normalAttackContent (string) | BE.sneakAttackContent (string) | BE.EnemyList (List<string>)
  | BE.ExpReward (4) | BE.EquipmentReward (4) | BE.GoldReward (4)

Output: rebuild/data/mb_battle_events_v2.json
"""
import sys, json, os
sys.stdout.reconfigure(encoding='utf-8')
import UnityPy
from pathlib import Path

ROOT = Path(__file__).parent.parent
SRC = ROOT / 'game_file' / '异世轮回录_1.20' / 'assets' / 'bin' / 'Data' / 'data.unity3d'
OUT = ROOT / 'rebuild' / 'data' / 'mb_battle_events_v2.json'

env = UnityPy.load(str(SRC))

def align4(p): return p + (4 - p % 4) if p % 4 else p
def rint(b, p): return int.from_bytes(b[p:p+4], 'little'), p + 4
def rbool(b, p):
    return bool(b[p]), p + 4
def rstr(b, p):
    n, p = rint(b, p)
    if n < 0 or n > 10_000_000: return None, p
    s = b[p:p+n]
    p = align4(p + n)
    return s, p

def parse_event(tail):
    p = 12  # skip graph PPtr
    p = 20  # skip position Vector2
    kn, p = rint(tail, p)
    vn, p = rint(tail, p)
    nt, p = rint(tail, p)
    es, p = rint(tail, p)  # exploreStat
    et, p = rint(tail, p)  # EventType
    ib, p = rbool(tail, p)  # IsBossEvent
    rc, p = rint(tail, p)  # ProbilyRelics count
    relics = []
    for _ in range(rc):
        s, p = rstr(tail, p)
        if s is None: break
        relics.append(s)
    ws_b, p = rstr(tail, p)  # WinBossBattleStr
    ifl, p = rbool(tail, p)  # IsFinalBossEvent
    sec_b, p = rstr(tail, p)  # SecendBattleStr
    se_cnt, p = rint(tail, p)  # SecendEnemyList count
    se = []
    for _ in range(se_cnt):
        s, p = rstr(tail, p)
        if s is None: break
        se.append(s)
    na_b, p = rstr(tail, p)  # normalAttackContent
    sa_b, p = rstr(tail, p)  # sneakAttackContent
    el_cnt, p = rint(tail, p)  # EnemyList count
    el = []
    for _ in range(el_cnt):
        s, p = rstr(tail, p)
        if s is None: break
        el.append(s)
    e, p = rint(tail, p)
    eq, p = rint(tail, p)
    g, p = rint(tail, p)
    return {
        'tail': len(tail), 'pos': p,
        'graph_pid': int.from_bytes(tail[4:12], 'little'),
        'event_type': et, 'is_boss': ib, 'is_final': ifl,
        'relics': relics, 'win_str': ws_b, 'sec_str': sec_b, 'sec_enemies': se,
        'norm_atk': na_b, 'sneak_atk': sa_b, 'enemy_list': el,
        'exp': e, 'equip': eq, 'gold': g,
    }

def decode(b):
    if b is None: return ''
    try: return b.decode('utf-8')
    except: return b.decode('utf-8', errors='replace')

events = []
for o in env.objects:
    if o.type.name != 'MonoBehaviour': continue
    head = o.parse_monobehaviour_head()
    if head.m_Script.m_PathID != 180: continue  # BattleEventNode
    raw = o.get_raw_data()
    name_len = len(head.m_Name.encode('utf-8'))
    head_end = 12 + 4 + 12 + 4 + name_len
    head_end = (head_end + 3) & ~3
    tail = raw[head_end:]
    if len(tail) < 32: continue
    try:
        ev = parse_event(tail)
        events.append({
            'pid': o.path_id, 'tail': ev['tail'], 'pos': ev['pos'],
            'graph_pid': ev['graph_pid'], 'event_type': ev['event_type'],
            'is_boss': ev['is_boss'], 'is_final': ev['is_final'],
            'relics': [decode(r) for r in ev['relics']],
            'win_str': decode(ev['win_str']),
            'sec_str': decode(ev['sec_str']),
            'sec_enemies': [decode(s) for s in ev['sec_enemies']],
            'norm_atk': decode(ev['norm_atk']),
            'sneak_atk': decode(ev['sneak_atk']),
            'enemy_list': [decode(s) for s in ev['enemy_list']],
            'exp': ev['exp'], 'equip': ev['equip'], 'gold': ev['gold'],
        })
    except Exception as e:
        events.append({'pid': o.path_id, 'err': str(e)})

ok = sum(1 for e in events if 'pos' in e and e['pos'] == e['tail'])
print(f'Parsed: {len(events)} | fully consumed: {ok} | errors: {sum(1 for e in events if "err" in e)}')

OUT.parent.mkdir(parents=True, exist_ok=True)
with open(OUT, 'w', encoding='utf-8') as fh:
    json.dump({
        'source': 'data.unity3d (异世轮回录_1.20) raw byte parse',
        'method': 'manual walk of BattleEvent MB tail (C# field order)',
        'total': len(events),
        'fully_consumed': ok,
        'events': events,
    }, fh, ensure_ascii=False, indent=2)
print(f'Wrote {OUT}')

# Also write the final-boss layouts view
finals_view = []
for b in events:
    if not b.get('is_boss'): continue
    s1_bosses = [e for e in b['enemy_list'] if e and e != '无']
    s2_bosses = [e for e in b['sec_enemies'] if e and e != '无']
    finals_view.append({
        'pid': b['pid'],
        'graph_pid': b['graph_pid'],
        'is_final_boss_event': b['is_final'],
        'stage1': {
            'enemy_list': b['enemy_list'],
            'boss_names': s1_bosses,
            'normal_attack_content': b['norm_atk'],
            'relics': b['relics'],
            'rewards': {'exp': b['exp'], 'equip': b['equip'], 'gold': b['gold']},
        },
        'stage2': {
            'enabled': bool(b['sec_str'] or s2_bosses),
            'enemy_list': b['sec_enemies'],
            'boss_names': s2_bosses,
            'story_text': b['sec_str'],
            'win_story_text': b['win_str'],
        },
    })

fb_out = ROOT / 'rebuild' / 'data' / 'mb_final_boss_layouts.json'
with open(fb_out, 'w', encoding='utf-8') as fh:
    json.dump({
        'source': 'data.unity3d (异世轮回录_1.20) raw byte parse',
        'note': '13 boss events with multi-stage layout decoded',
        'total_bosses': len(finals_view),
        'true_final_bosses': sum(1 for l in finals_view if l['is_final_boss_event']),
        'multi_stage_bosses': sum(1 for l in finals_view if l['stage2']['enabled']),
        'bosses': finals_view,
    }, fh, ensure_ascii=False, indent=2)
print(f'Wrote {fb_out}')
