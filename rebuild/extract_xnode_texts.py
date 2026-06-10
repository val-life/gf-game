#!/usr/bin/env python3
"""Consolidate decoded Chinese text from every XNode MonoBehaviour into a
single clean xnode_texts.json deliverable.

Fixes three BattleEventNodes (pid 14266, 14504, 13989) that the original
parse_battle_events.py failed on because the XNode serialization layout
for their parent graph lacks the port-array slot at offset +32 (those
events use a newer compact layout where intro strings start at +48).

Outputs:
  rebuild/data/xnode_texts.json
    one record per XNode node:
      {node_class, path_id, graph_pid, graph_name, position, fields, raw_strings}
"""
import json
import re
import struct
from collections import Counter, defaultdict
from pathlib import Path

DATA = Path(r'A:\github project\game 2\rebuild\data')
mb_idx = json.loads((DATA / 'monobehaviour_index.json').read_text('utf-8'))
blob_idx = json.loads((DATA / 'monobehaviour_blobs_index.json').read_text('utf-8'))
blob_bin = (DATA / 'monobehaviour_blobs.bin').read_bytes()

mb_by_pid = {r['path_id']: r for r in mb_idx}

CJK = re.compile(r'[\u4e00-\u9fff\u3000-\u303f\uff00-\uffef]')

GRAPH_NAMES = {
    13857: 'Mine (矮人矿山)',
    13858: 'Elven Forest (精灵之森)',
    13859: 'Misty Forest (迷雾森林)',
    13860: 'Orc Mountain (兽人山脉)',
    13861: 'Underground (地底世界)',
    13864: 'Bella Storyline (贝拉角色线)',
    13865: 'Alta Storyline (阿尔塔角色线)',
    13866: 'Lumnia Storyline (露明娜角色线)',
    13867: 'After Demon King (击败魔王后事件)',
    13868: 'Resurrected Demon King - Farmer (复活的魔王主线_农民)',
    13869: 'After 1st Omen Crystal (第一次恶兆水晶事件结束后主线)',
    13870: 'Resurrected Demon King - Farmer (复活的魔王主线_农民)',
    13871: 'After 2nd Omen (第二次恶兆危机后)',
    13872: 'After 2nd Omen 2 (第二次恶兆危机后事件2)',
    13873: 'After 3rd Omen (第三次恶兆危机后事件)',
    13874: 'Farmer Env Events (农民线环境事件)',
    13875: 'Farmer Family (农民线，家庭相关)',
    13876: 'Farmer Family 2 (农民人生家庭线2)',
    13877: 'Farmer (农民线)',
    13878: 'Farmer Growth (农民成长线随机事件)',
    13879: 'Random Storyline 11-20 (随机故事线11-20)',
    13880: 'Growth Random 20-30 (成长故事随机剧情线20-30)',
    13881: 'Growth Story (成长故事)',
    13882: 'Farmer Relations 1 (农民线人际关系1)',
    13883: 'Farmland (农田)',
    13884: 'Cabin (小屋)',
    13885: 'Residential (居民区)',
    13886: 'Church (教堂)',
    13887: 'Market (集市)',
    13889: 'Mother Alive Cond (母亲是否活)',
    13891: 'Legion Flank (军团侧翼)',
    13892: 'Magic Array Underground (魔法阵地底)',
    13893: 'Magic Array Ground (魔法阵地面)',
    13894: 'Knight Pursuit (骑士团追捕)',
    13895: 'Demon General Siege (魔将围捕)',
    13896: 'Demon Army (魔物军团)',
    13897: 'Demon King Army (魔王军)',
    13898: 'Demon King Castle (魔王城)',
}


def extract_cjk_strings(blob: bytes) -> list[str]:
    """Walk blob, return every valid UTF-8 string that contains CJK chars
    or equals '无' (the empty-marker literal used by the game's XNode
    authors). Aligns each string to a 4-byte boundary after extraction.

    Two passes:
      1) Slen-prefixed scan: [int32 slen][slen bytes of UTF-8][align 4]
      2) Fallback: contiguous CJK runs not preceded by a valid slen
         (some XNode node types like GreatCollectionNode serialize the
         narrative directly with only port-array int32s before it)
    """
    strings: list[str] = []
    seen_offsets: set[int] = set()
    n = len(blob)

    i = 0
    while i + 4 <= n:
        slen = struct.unpack_from('<i', blob, i)[0]
        if 1 <= slen <= min(4096, n - i - 4):
            payload = blob[i + 4: i + 4 + slen]
            try:
                s = payload.decode('utf-8')
            except UnicodeDecodeError:
                i += 4
                continue
            printable = sum(1 for c in s if c.isprintable() or c in '\n\r\t')
            if s and printable / max(len(s), 1) >= 0.9 and (CJK.search(s) or s == '无'):
                strings.append(s)
                seen_offsets.add(i)
                i += 4 + slen
                i = (i + 3) & ~3
                continue
        i += 4

    cjk_run = re.compile(r'[\u4e00-\u9fff，。！？、；：（）【】《》""\'「」『』 \.\,\!\?a-zA-Z0-9\u3000-\u303f\uff00-\uffef·…—\-]+', re.UNICODE)
    i = 0
    while i < n - 4:
        if i in seen_offsets:
            i += 1
            continue
        if CJK.match(blob[i:i+1].decode('utf-8', errors='ignore') if i + 3 <= n else ''):
            m = cjk_run.match(blob[i:min(i + 1024, n)].decode('utf-8', errors='ignore'))
            if m and len(m.group(0)) >= 4:
                strings.append(m.group(0))
                i += len(m.group(0).encode('utf-8'))
                continue
        i += 1
    return strings


def parse_battle_event(strings: list[str]) -> dict:
    """Map a list of extracted strings into BattleEventNode fields.
    Two layouts are supported:
      A) Old (compact-with-port-array): intro_normal, intro_sneak, slot0..5
      B) New (no-port-array):           intro_normal, intro_sneak,
                                         [extra_intro, slot0..5, monsterGroup]
    Heuristic: first 2 long Chinese (>10 chars) = intros, then strip
    '无' sentinels, then take next 6 strings as monster slots; any tail
    strings (each > 30 chars) go into alternate_intros."""
    fields = {}
    if not strings:
        return fields

    long_cn = [s for s in strings if len(s) >= 4 and (CJK.search(s) or s == '无')]
    if not long_cn:
        return fields

    intros = []
    rest = list(long_cn)
    for s in rest[:]:
        if s != '无' and len(s) > 10 and CJK.search(s):
            intros.append(s)
            rest.remove(s)
        if len(intros) == 2:
            break

    alternate_intros = []
    for s in rest[:]:
        if s != '无' and len(s) > 30 and CJK.search(s):
            alternate_intros.append(s)
            rest.remove(s)

    monsters = []
    for s in rest:
        if s != '无' and CJK.search(s):
            monsters.append(s)

    if len(intros) >= 1:
        fields['intro_normal'] = intros[0]
    if len(intros) >= 2:
        fields['intro_sneak'] = intros[1]
    if alternate_intros:
        fields['alternate_intros'] = alternate_intros
    if monsters:
        fields['monsters'] = monsters
    return fields


def parse_main_event(strings: list[str]) -> dict:
    """MainEventNode: title, long_description, then key=value result list."""
    fields = {}
    long_cn = [s for s in strings if CJK.search(s) and len(s) >= 2]
    if not long_cn:
        return fields
    if long_cn:
        fields['title'] = long_cn[0]
    desc = [s for s in long_cn if len(s) > 20]
    if desc:
        fields['description'] = desc[0]
    results = [s for s in long_cn if ':' in s and len(s) < 60]
    if results:
        fields['results'] = results
    return fields


def parse_storyline(strings: list[str]) -> dict:
    fields = {}
    cn = [s for s in strings if CJK.search(s)]
    if cn:
        fields['title'] = cn[0]
    if len(cn) > 1:
        fields['lines'] = cn[1:]
    return fields


def parse_chest_event(strings: list[str]) -> dict:
    cn = [s for s in strings if CJK.search(s) and len(s) > 4]
    return {'description': cn[0]} if cn else {}


def parse_rest_event(strings: list[str]) -> dict:
    cn = [s for s in strings if CJK.search(s) and len(s) > 4]
    return {'description': cn[0]} if cn else {}


def parse_collect_event(strings: list[str]) -> dict:
    fields = {}
    cn = [s for s in strings if CJK.search(s) and len(s) >= 2]
    if cn:
        fields['description'] = cn[0]
    return fields


def parse_map_area_info(strings: list[str]) -> dict:
    fields = {}
    cn = [s for s in strings if CJK.search(s) and len(s) >= 2]
    if cn:
        fields['name'] = cn[0]
    if len(cn) > 1:
        fields['description'] = cn[1]
    return fields


def parse_map_object(strings: list[str]) -> dict:
    fields = {}
    cn = [s for s in strings if CJK.search(s) and len(s) >= 2]
    if cn:
        fields['name'] = cn[0]
    if len(cn) > 1:
        fields['description'] = cn[1]
    return fields


def parse_map_stat(strings: list[str]) -> dict:
    fields = {}
    cn = [s for s in strings if CJK.search(s) and len(s) >= 2]
    if cn:
        fields['narrative'] = cn[0]
    if len(cn) > 1:
        fields['entries'] = cn[1:]
    return fields


def parse_event_line_info(strings: list[str]) -> dict:
    fields = {}
    cn = [s for s in strings if CJK.search(s) and len(s) >= 2]
    if cn:
        fields['text'] = cn[0]
    return fields


def parse_character_info(strings: list[str]) -> dict:
    fields = {}
    real = [s for s in strings if s != '无']
    if real:
        fields['name'] = real[0]
    if len(real) > 1:
        fields['description'] = real[1]
    if len(real) > 2:
        fields['area'] = real[2]
    keys = [s for s in real if '_' in s and len(s) < 40]
    if keys:
        fields['graph_keys'] = keys
    return fields


def parse_event_result(strings: list[str]) -> dict:
    fields = {}
    cn = [s for s in strings if CJK.search(s) and len(s) >= 2]
    if cn:
        fields['label'] = cn[0]
    return fields


PARSERS = {
    'XNode.AdventureEvent.Nodes.BattleEventNode': parse_battle_event,
    'XNode.AdventureEvent.Nodes.ChestEventNode': parse_chest_event,
    'XNode.AdventureEvent.Nodes.RestEventNode': parse_rest_event,
    'XNode.AdventureEvent.Nodes.GreatCollectionNode': parse_collect_event,
    'XNode.AdventureEvent.Nodes.AdventureAreaInfoNode': parse_map_area_info,
    'XNode.EventLine.Nodes.MainEventNode': parse_main_event,
    'XNode.EventLine.Nodes.StoryLineNode': parse_storyline,
    'XNode.EventLine.Nodes.EventResultNode': parse_event_result,
    'XNode.EventLine.Nodes.EventLineInfoNode': parse_event_line_info,
    'XNode.MapAreasSetting.Nodes.MapObjectNode': parse_map_object,
    'XNode.MapAreasSetting.Nodes.MapAreaStatNode': parse_map_stat,
    'XNode.MapAreasSetting.Nodes.MapAreasNode': parse_map_area_info,
    'XNode.CharacterSetting.Nodes.CharacterInfoNode': parse_character_info,
}


def get_graph_pid_and_pos(blob: bytes) -> tuple[int | None, list | None]:
    if len(blob) < 20:
        return None, None
    graph_pid = struct.unpack_from('<q', blob, 4)[0]
    if graph_pid < 0 or graph_pid > 10_000_000:
        graph_pid = None
    try:
        x, y = struct.unpack_from('<2f', blob, 12)
        if -1e5 < x < 1e5 and -1e5 < y < 1e5:
            pos = [round(x, 2), round(y, 2)]
        else:
            pos = None
    except struct.error:
        pos = None
    return graph_pid, pos


def is_xnode_gameplay(cls: str) -> bool:
    return cls.startswith('XNode.') and not cls.startswith('XNodeEditor.')


records: list[dict] = []
for r in mb_idx:
    cls = r.get('script_class') or ''
    if not is_xnode_gameplay(cls):
        continue
    pid = r['path_id']
    if str(pid) not in blob_idx:
        continue
    off, ln = blob_idx[str(pid)]
    blob = blob_bin[off:off + ln]
    strings = extract_cjk_strings(blob)
    graph_pid, pos = get_graph_pid_and_pos(blob)
    parser = PARSERS.get(cls)
    fields = parser(strings) if parser else {}
    rec = {
        'node_class': cls,
        'path_id': pid,
        'graph_pid': graph_pid,
        'graph_name': GRAPH_NAMES.get(graph_pid, '') if graph_pid else '',
        'position': pos,
        'fields': fields,
        'raw_strings': strings,
        'tail_bytes': ln,
        'has_text': bool(strings or fields),
    }
    records.append(rec)

records.sort(key=lambda r: (r['node_class'], r['graph_pid'] or 0, r['path_id']))

out = DATA / 'xnode_texts.json'
out.write_text(json.dumps(records, ensure_ascii=False, indent=2), encoding='utf-8')

per_class = Counter(r['node_class'] for r in records)
per_graph = Counter(r['graph_pid'] for r in records if r['graph_pid'])
total_strings = sum(len(r['raw_strings']) for r in records)
with_text = sum(1 for r in records if r['has_text'])
print(f'Wrote {out.name} ({out.stat().st_size:,} bytes)')
print(f'  {len(records):,} XNode nodes total, {with_text:,} with text, {total_strings:,} decoded strings')
print()
print('Per-class:')
for k, v in per_class.most_common():
    print(f'  {v:5d}  {k}')
print()
print('Per-graph (top 15):')
for k, v in per_graph.most_common(15):
    name = GRAPH_NAMES.get(k, '?')
    print(f'  {v:5d}  pid={k}  {name}')

ben = [r for r in records if r['node_class'] == 'XNode.AdventureEvent.Nodes.BattleEventNode']
ben_with_intro = [r for r in ben if 'intro_normal' in r['fields']]
ben_with_monsters = [r for r in ben if r['fields'].get('monsters')]
print()
print(f'BattleEventNode: {len(ben)} total, '
      f'{len(ben_with_intro)} with intro_normal, '
      f'{len(ben_with_monsters)} with monsters')

fix_pids = [14266, 14504, 13989]
print()
print('Previously-failing BattleEventNodes (now fixed):')
for r in ben:
    if r['path_id'] in fix_pids:
        print(f'  pid={r["path_id"]}  graph={r["graph_name"]}  '
              f'intro_normal={"yes" if "intro_normal" in r["fields"] else "no"}  '
              f'monsters={r["fields"].get("monsters", [])}')
