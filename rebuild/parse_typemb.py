#!/usr/bin/env python3
"""Parse AssetStudio TypeTree dumps in Dump with dll/MonoBehaviour.

Format per file:
  MonoBehaviour Base
    \tPPtr<GameObject> m_GameObject
    \t\tint m_FileID = 0
    \t\tSInt64 m_PathID = 0
    \tUInt8 m_Enabled = 1
    \tPPtr<MonoScript> m_Script
    \t\tint m_FileID = 1
    \t\tSInt64 m_PathID = 180
    \tstring m_Name = "Battle Event"
    \t<ParsedClass> <varName>          (struct/class/array header)
    \t\tTypeName fieldName = value     (scalar)
    \t\t[0]                            (array element marker)
    \t\tTypeName fieldName             (array element sub-struct header)

We build a nested tree where:
  - struct/class header    -> { __type__, __name__, __kind__: "struct", ...children }
  - list/array header      -> { __type__, __name__, __kind__: "array", __items__: [] }
  - scalar "X = Y"         -> parent[varName] = Y
  - array index "[i]"      -> next child goes into __items__[i]
"""

import json
import os
import re
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).parent.parent
SRC = ROOT / "Dump with dll" / "MonoBehaviour"
OUT = ROOT / "rebuild" / "data"
OUT.mkdir(parents=True, exist_ok=True)

LINE_RE = re.compile(r"^(?P<indent>\t*)(?P<type>\S+)\s+(?P<name>\S+)(?:\s*=\s*(?P<value>.*))?$")
PPTR_NEXT_RE = re.compile(r"^\s+SInt64 m_PathID = (\d+)")

def parse_dump(text_or_bytes) -> dict:
    """Parse one TypeTree .txt dump. Returns { name, script_pathid, fields }.

    Accepts str (already-decoded text) or bytes (raw file bytes).
    If bytes, we use a custom splitlines that handles \\r\\n correctly.
    """
    if isinstance(text_or_bytes, bytes):
        # Decode the structural parts as UTF-8 (lossy on string values,
        # but we keep raw bytes for the string-extraction pass).
        try:
            text = text_or_bytes.decode("utf-8")
            lines = text.splitlines()
        except UnicodeDecodeError:
            # Fall back: split on \n, treat each line as bytes
            raw_lines = text_or_bytes.split(b"\n")
            lines = [ln.decode("utf-8", errors="replace") for ln in raw_lines]
    else:
        lines = text_or_bytes.splitlines()
    out = {"name": None, "script_pathid": None, "fields": {}}
    # root container is fields dict
    stack = [(-1, out["fields"], None)]   # (indent, container, kind)
    # kind: None for dict (regular fields), "array" for List/Array (children go into __items__)

    i = 0
    while i < len(lines):
        ln = lines[i]
        if not ln.strip():
            i += 1
            continue
        m = LINE_RE.match(ln)
        if not m:
            i += 1
            continue
        indent = len(m.group("indent"))
        ftype = m.group("type")
        fname = m.group("name")
        fvalue = m.group("value")

        # Pop stack to parent at smaller indent
        while stack and stack[-1][0] >= indent:
            stack.pop()
        if not stack:
            i += 1
            continue
        pindent, pcontainer, pkind = stack[-1]

        if fvalue is None:
            # Header line: start of a struct or array
            # Skip the file's root "MonoBehaviour Base" pseudo-header
            if ftype == "MonoBehaviour" and fname == "Base":
                i += 1
                continue
            # Skip "Array Array" / "Pair pair" placeholder headers that
            # TypeTree emits inside List<T>/Dictionary<,> containers —
            # the next "int size = N" tells us where items go.
            if ftype in ("Array", "Pair", "Generic") and fname in ("Array", "Pair", "generic"):
                i += 1
                continue
            if ftype == "Array" or ftype.startswith("List"):
                # array container
                arr = {"__type__": ftype, "__name__": fname, "__kind__": "array", "__items__": []}
                _insert(pcontainer, pkind, fname, arr)
                stack.append((indent, arr, "array"))
            elif fname.startswith("[") and fname.endswith("]"):
                # array index marker — e.g. "[0]"
                idx = int(fname[1:-1])
                # The next non-indented/deeper entry is the element
                # We represent the element container here so that subsequent
                # children at deeper indent can attach to it.
                elem = {"__type__": "?", "__kind__": "element", "__index__": idx}
                # Insert into parent (which is an array)
                pcontainer.setdefault("__items__", [])
                # Pad __items__ with placeholders if needed
                while len(pcontainer["__items__"]) <= idx:
                    pcontainer["__items__"].append(None)
                pcontainer["__items__"][idx] = elem
                stack.append((indent, elem, "element"))
            else:
                # struct/class header
                struct = {"__type__": ftype, "__name__": fname, "__kind__": "struct"}
                _insert(pcontainer, pkind, fname, struct)
                stack.append((indent, struct, "struct"))
            i += 1
        else:
            # Scalar assignment
            val = fvalue.rstrip()
            # PPtr int m_FileID + next line SInt64 m_PathID -> combine
            if ftype == "int" and fname == "m_FileID" and i + 1 < len(lines):
                nxt = lines[i + 1]
                pm = PPTR_NEXT_RE.match(nxt)
                if pm:
                    pid = int(pm.group(1))
                    combined = {"__fileid__": int(val), "__pathid__": pid, "__name__": fname}
                    _insert(pcontainer, pkind, fname, combined)
                    i += 2
                    continue
            # "int size = N" is TypeTree array metadata; skip it
            if fname == "size" and ftype == "int":
                i += 1
                continue
            # Strip quotes
            if val.startswith('"') and val.endswith('"') and len(val) >= 2:
                val = val[1:-1]
            # Try to normalize scalar: bool / int / float
            val = _normalize_scalar(val)
            _insert(pcontainer, pkind, fname, val)
            # Track name & script
            if fname == "m_Name" and isinstance(val, str):
                out["name"] = val
            i += 1
    return out

def _insert(parent, kind, name, value):
    """Insert a value into a container, respecting array vs struct kind."""
    if kind == "array":
        # Inside an Array, children are indexed
        # But "name" here is meaningless — just append
        if isinstance(parent.get("__items__"), list):
            parent["__items__"].append(value)
    else:
        # dict (struct/root)
        if isinstance(parent, dict):
            parent[name] = value

def normalize_pptr(node):
    """Recursively flatten PPtr<...> structures: {m_FileID: {__fileid__, __pathid__}, ...}
    into {__fileid__, __pathid__, ...} for easier access.
    """
    if not isinstance(node, dict):
        return node
    # If this node is a PPtr wrapper (has just m_FileID + nothing else meaningful),
    # we leave it. Caller navigates.
    out = {}
    for k, v in node.items():
        if k == "m_FileID" and isinstance(v, dict) and "__fileid__" in v and "__pathid__" in v:
            # Promote to __fileid__/__pathid__ siblings under the parent name
            # But we don't have parent context here; just keep as-is.
            out[k] = v
        else:
            out[k] = normalize_pptr(v) if isinstance(v, dict) else (
                [normalize_pptr(x) for x in v] if isinstance(v, list) else v
            )
    return out

def _normalize_scalar(val):
    """Convert scalar string to int/float/bool when possible."""
    if not isinstance(val, str):
        return val
    s = val.strip()
    if s == "True":
        return True
    if s == "False":
        return False
    if s.startswith('"') and s.endswith('"'):
        s = s[1:-1]
    # int
    if re.fullmatch(r"-?\d+", s):
        try:
            return int(s)
        except ValueError:
            pass
    # float
    if re.fullmatch(r"-?\d+\.\d+([eE][-+]?\d+)?", s):
        try:
            return float(s)
        except ValueError:
            pass
    return val

def get_ppathid(node):
    """Given a PPtr<...> dict, return the pathid (or None)."""
    if not isinstance(node, dict):
        return None
    if "__pathid__" in node:
        return node["__pathid__"]
    mf = node.get("m_FileID")
    if isinstance(mf, dict) and "__pathid__" in mf:
        return mf["__pathid__"]
    return None

def extract_script_pathid(text: str) -> int:
    m = re.search(r"PPtr<MonoScript> m_Script[\s\S]+?SInt64 m_PathID = (\d+)", text)
    return int(m.group(1)) if m else None

def parse_unity_string_list(buf: bytes) -> list:
    """Parse a Unity-serialized List<string> from raw bytes.

    Format: sequence of [int32 LE length][bytes of UTF-8/UTF-16/GBK].
    """
    out = []
    pos = 0
    while pos + 4 <= len(buf):
        slen = int.from_bytes(buf[pos:pos+4], "little")
        pos += 4
        if slen < 0 or slen > 10_000_000 or pos + slen > len(buf):
            break
        entry = buf[pos:pos+slen]
        pos += slen
        # Try UTF-8 first
        try:
            txt = entry.decode("utf-8")
            out.append(txt)
        except UnicodeDecodeError:
            if slen % 2 == 0:
                try:
                    txt = entry.decode("utf-16-le")
                    out.append(txt)
                    continue
                except UnicodeDecodeError:
                    pass
            try:
                txt = entry.decode("gb18030")
                out.append(txt)
            except UnicodeDecodeError:
                out.append(entry.decode("latin1", errors="replace"))
    return out

def find_field_string_list(raw: bytes, field_name: str) -> list:
    """Find a field in raw bytes and parse its Unity List<string> value.

    Two modes:
    1) Field is a serialized Unity List<string> blob: `field = "len-prefixed entries"`
    2) Field is a TypeTree List<string> with `string data = "..."` children

    Tries mode 1 first, then mode 2.
    """
    if not raw:
        return []
    # Mode 1: serialized blob
    serialized = find_field_serialized_list(raw, field_name)
    if serialized:
        return serialized
    # Mode 2: TypeTree children
    return find_field_typetree_string_list(raw, field_name)

def find_field_serialized_list(raw: bytes, field_name: str) -> list:
    """Mode 1: field = "..." where value is [int32][bytes]... entries."""
    needle = field_name.encode("ascii")
    pos = 0
    while pos < len(raw):
        idx = _find_whole_word(raw, needle, pos)
        if idx < 0:
            return []
        field_indent = _line_indent(raw, idx)
        eq = raw.find(b"=", idx)
        if eq < 0 or eq - idx > len(field_name) + 5:
            pos = idx + 1
            continue
        q1 = raw.find(b'"', eq)
        if q1 < 0:
            return []
        close_pat = b'\n' + b'\t' * field_indent
        end = raw.find(close_pat, q1)
        if end < 0:
            return []
        q2 = raw.rfind(b'"', q1 + 1, end)
        if q2 < 0:
            q2 = end
        payload = raw[q1+1:q2]
        result = parse_unity_string_list(payload)
        if result:
            return result
        pos = idx + 1
    return []

def _next_sibling_or_end(raw: bytes, pos: int, list_indent: int) -> int:
    """Find position of next sibling line (at exactly list_indent tabs) or end of buffer.

    Returns the position of the next `\n` followed by EXACTLY list_indent tabs
    (and a non-tab char). Returns -1 if not found.
    """
    # We need to match \n + <list_indent tabs> + non-tab
    target_start = b'\n' + b'\t' * list_indent
    search = pos
    while search < len(raw):
        idx = raw.find(target_start, search)
        if idx < 0:
            return -1
        # Check the next char is NOT a tab (so it's exactly list_indent tabs)
        after = idx + 1 + list_indent
        if after < len(raw) and raw[after:after+1] != b'\t':
            return idx
        # Otherwise it's deeper indent, keep searching
        search = idx + 1
    return -1

def find_field_typetree_string_list(raw: bytes, field_name: str) -> list:
    """Mode 2: TypeTree dump with `string data = "..."` children inside a List."""
    needle = field_name.encode("ascii")
    pos = 0
    while pos < len(raw):
        idx = _find_whole_word(raw, needle, pos)
        if idx < 0:
            return []
        list_indent = _line_indent(raw, idx)
        children_start = idx + len(needle)
        eq = raw.find(b"\n", children_start)
        line = raw[children_start:eq] if eq > 0 else raw[children_start:children_start+50]
        if b"=" in line.split(b"\n")[0]:
            pos = idx + 1
            continue
        data_indent = list_indent + 2
        data_pat = b'\n' + b'\t' * data_indent + b'string data = "'
        results = []
        search_from = children_start
        while True:
            data_idx = raw.find(data_pat, search_from)
            if data_idx < 0:
                break
            # Check we're still within the list (haven't crossed into a sibling at list_indent)
            next_sibling = _next_sibling_or_end(raw, search_from, list_indent)
            if next_sibling > 0 and data_idx > next_sibling:
                break
            q1 = data_idx + len(data_pat)
            q2 = raw.find(b'"', q1)
            if q2 < 0:
                break
            payload = raw[q1:q2]
            try:
                s = payload.decode("utf-8")
            except UnicodeDecodeError:
                s = decode_bytes(payload)
            results.append(s)
            search_from = q2 + 1
        return results

def _line_indent(raw: bytes, pos: int) -> int:
    """Return the indent (count of leading tabs) of the line containing raw[pos]."""
    start = pos
    while start > 0 and raw[start-1:start] not in (b"\n", b"\r"):
        start -= 1
    n = 0
    i = start
    while i < len(raw) and raw[i:i+1] == b"\t":
        n += 1
        i += 1
    return n

def _find_whole_word(raw: bytes, needle: bytes, start: int = 0) -> int:
    """Find needle in raw as a complete identifier (not a substring of a longer one)."""
    pos = start
    while pos < len(raw):
        idx = raw.find(needle, pos)
        if idx < 0:
            return -1
        # Check char before and after
        before_ok = idx == 0 or raw[idx-1:idx] in (b"\n", b"\r", b"\t", b" ", b".")
        after_idx = idx + len(needle)
        after_ok = after_idx >= len(raw) or raw[after_idx:after_idx+1] in (b"\n", b"\r", b"\t", b" ", b"=", b"\0")
        if before_ok and after_ok:
            return idx
        pos = idx + 1
    return -1

def find_field_chinese(raw: bytes, field_name: str) -> str:
    """Find a field in raw bytes and return its Chinese-decoded value."""
    if not raw:
        return ""
    needle = field_name.encode("ascii")
    pos = 0
    while pos < len(raw):
        idx = _find_whole_word(raw, needle, pos)
        if idx < 0:
            return ""
        eq = raw.find(b"=", idx)
        if eq < 0 or eq - idx > len(field_name) + 5:
            pos = idx + 1
            continue
        q1 = raw.find(b'"', eq)
        if q1 < 0:
            return ""
        q2 = raw.find(b'"', q1 + 1)
        if q2 < 0:
            return ""
        payload = raw[q1+1:q2]
        return decode_bytes(payload)
    return ""

def extract_quoted_bytes_from_raw(raw: bytes) -> list:
    """Pull every "..." quoted region from raw file bytes, returning the
    raw byte sequences inside the quotes (NOT decoded).
    """
    out = []
    i = 0
    n = len(raw)
    while i < n:
        c = raw[i:i+1]
        if c == b'"':
            j = i + 1
            buf = bytearray()
            while j < n:
                c2 = raw[j:j+1]
                if c2 == b'"':
                    break
                buf.append(c2[0])
                j += 1
            out.append(bytes(buf))
            i = j + 1
        else:
            i += 1
    return out

def decode_bytes(b: bytes) -> str:
    if not b:
        return ""
    try:
        s = b.decode("utf-8")
        if "\ufffd" not in s:
            return s
    except UnicodeDecodeError:
        pass
    try:
        return b.decode("gb18030")
    except UnicodeDecodeError:
        pass
    try:
        return b.decode("big5")
    except UnicodeDecodeError:
        pass
    return b.decode("latin1", errors="replace")

def main():
    print(f"Scanning {SRC}", file=sys.stderr)
    files = sorted(SRC.glob("*.txt"))
    print(f"  {len(files)} files", file=sys.stderr)

    # Load monoscript catalog (list form)
    ms_cat = []
    ms_cat_path = OUT / "monoscript_catalog.json"
    if ms_cat_path.exists():
        ms_cat = json.loads(ms_cat_path.read_text(encoding="utf-8"))
    pid_to_class = {}
    for info in ms_cat:
        pid = info.get("path_id")
        cls = (info.get("class") or "").split(".")[-1]
        if pid is not None and cls:
            pid_to_class[int(pid)] = cls
    print(f"  loaded {len(ms_cat)} MonoScript records -> {len(pid_to_class)} class names", file=sys.stderr)

    # First pass: parse all files
    catalog_by_name = defaultdict(list)        # m_Name -> [file]
    catalog_by_class = defaultdict(list)       # class_name -> [file]
    catalog_by_script_pid = defaultdict(list)   # script_pathid -> [file]
    parsed_records = []  # list of (path, parsed_dict, raw_text)
    for idx, f in enumerate(files):
        if idx % 1000 == 0:
            print(f"  parse {idx}/{len(files)}", file=sys.stderr, flush=True)
        try:
            raw_bytes = f.read_bytes()
            # Build a "lossy utf-8" text for the structural parser (it only
            # cares about the TypeTree indentation, not the string values).
            text = raw_bytes.decode("utf-8", errors="replace")
            p = parse_dump(text)
            p["script_pathid"] = extract_script_pathid(text)
            p["_raw"] = raw_bytes
        except Exception as e:
            print(f"  FAIL parse {f.name}: {e}", file=sys.stderr)
            continue
        catalog_by_name[p.get("name") or ""].append(f.name)
        if p["script_pathid"] is not None:
            catalog_by_script_pid[p["script_pathid"]].append(f.name)
            cls = pid_to_class.get(p["script_pathid"], "")
            if cls:
                catalog_by_class[cls].append(f.name)
        parsed_records.append((f, p, text))

    (OUT / "typemb_catalog.json").write_text(
        json.dumps({
            "by_name": dict(catalog_by_name),
            "by_class": dict(catalog_by_class),
            "by_script_pathid": {str(k): v for k, v in catalog_by_script_pid.items()},
            "total_files": len(files),
        }, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"  catalog: {len(catalog_by_name)} names, {len(catalog_by_class)} classes", file=sys.stderr)

    # Resolve class for each file
    pid_to_class_full = {}
    for info in ms_cat:
        pid = info.get("path_id")
        if pid is not None:
            pid_to_class_full[int(pid)] = {
                "class": info.get("class"),
                "namespace": info.get("namespace"),
            }

    # Build per-file index
    file_index = []
    for f, p, _ in parsed_records:
        cls = pid_to_class_full.get(p["script_pathid"] or -1, {})
        file_index.append({
            "file": f.name,
            "name": p.get("name"),
            "script_pathid": p["script_pathid"],
            "class": cls.get("class"),
            "namespace": cls.get("namespace"),
        })
    (OUT / "mb_file_index.json").write_text(
        json.dumps(file_index, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"  file_index: {len(file_index)}", file=sys.stderr)

    # === Per-category extraction (by class) ===
    def files_of_class(name):
        return [(f, p, raw) for f, p, raw in parsed_records
                if (pid_to_class_full.get(p["script_pathid"] or -1, {}).get("class") or "").endswith(name)]

    def files_of_name(name):
        return [(f, p, raw) for f, p, raw in parsed_records if p.get("name") == name]

    # BattleEvent (class)
    battle_events = []
    for f, p, raw in files_of_class("BattleEventNode"):
        fe = p["fields"]
        be = fe.get("battleEvent") or {}
        # some assets may have the struct inline
        if not isinstance(be, dict) or "__type__" not in be:
            be = fe
        raw_bytes = p.get("_raw", b"")
        # Pull Chinese from raw bytes
        win_str = find_field_chinese(raw_bytes, "WinBossBattleStr")
        sec_str = find_field_chinese(raw_bytes, "SecendBattleStr")
        normal_atk = find_field_chinese(raw_bytes, "normalAttackContent")
        sneak_atk = find_field_chinese(raw_bytes, "sneakAttackContent")
        sec_enemies = find_field_string_list(raw_bytes, "EnemyList")
        sec_enemies = [s for s in sec_enemies if s]
        relics = find_field_string_list(raw_bytes, "ProbilyRelics")
        relics = [s for s in relics if s]
        # Rewards
        exp_r = _scalar(be, "ExpReward")
        equip_r = _scalar(be, "EquipmentReward")
        gold_r = _scalar(be, "GoldReward")
        battle_events.append({
            "filename": f.name,
            "name": p.get("name"),
            "script_pathid": p["script_pathid"],
            "isBossEvent": _scalar(be, "IsBossEvent"),
            "isFinalBossEvent": _scalar(be, "IsFinalBossEvent"),
            "winBossBattleStr": win_str,
            "secendBattleStr": sec_str,
            "normalAttackContent": normal_atk,
            "sneakAttackContent": sneak_atk,
            "enemyList": sec_enemies,
            "probilyRelics": relics,
            "expReward": exp_r,
            "equipmentReward": equip_r,
            "goldReward": gold_r,
            "graphPathId": _ppathid(fe.get("graph")),
        })
    (OUT / "mb_battle_events_full.json").write_text(
        json.dumps(battle_events, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"  battle events (by class): {len(battle_events)}", file=sys.stderr)

    # MapAreaStat
    mas_list = []
    for f, p, raw in files_of_class("MapAreaStatNode"):
        fe = p["fields"]
        be = fe.get("areaStat") or fe.get("mapAreaStat") or {}
        if not isinstance(be, dict) or "__type__" not in be:
            be = fe
        raw_bytes = p.get("_raw", b"")
        area_desc = find_field_chinese(raw_bytes, "AreaDescript")
        mas_list.append({
            "filename": f.name,
            "name": p.get("name"),
            "script_pathid": p["script_pathid"],
            "areaDescript_parsed": _scalar(be, "AreaDescript"),
            "areaDescript_chinese": area_desc,
            "mapObjects_raw": _items(be, "mapObjects"),
        })
    (OUT / "mb_map_area_stats.json").write_text(
        json.dumps(mas_list, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"  map area stats: {len(mas_list)}", file=sys.stderr)

    # MapAreas (collection)
    ma_list = []
    for f, p, raw in files_of_class("MapAreasNode"):
        fe = p["fields"]
        ma_list.append({
            "filename": f.name,
            "name": p.get("name"),
            "script_pathid": p["script_pathid"],
            "fields": {k: v for k, v in fe.items() if not k.startswith("__")},
        })
    (OUT / "mb_map_areas.json").write_text(
        json.dumps(ma_list, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"  map areas (by class): {len(ma_list)}", file=sys.stderr)

    # MapObject
    mo_list = []
    for f, p, raw in files_of_class("MapObjectNode"):
        fe = p["fields"]
        be = fe.get("mapObject") or {}
        if not isinstance(be, dict) or "__type__" not in be:
            be = fe
        raw_bytes = p.get("_raw", b"")
        # ObjectName and ObjectDescript are single strings.
        # Effect is a List<string> with multiple narrative entries.
        obj_name = find_field_chinese(raw_bytes, "ObjectName")
        obj_desc = find_field_chinese(raw_bytes, "ObjectDescript")
        effect_strs = find_field_string_list(raw_bytes, "Effect")
        # Hide first empty entries (Unity padding)
        effect_strs = [s for s in effect_strs if s]
        mo_list.append({
            "filename": f.name,
            "name": p.get("name"),
            "script_pathid": p["script_pathid"],
            "objectName_parsed": _scalar(be, "ObjectName"),
            "objectName_chinese": obj_name,
            "objectDescript_parsed": _scalar(be, "ObjectDescript"),
            "objectDescript_chinese": obj_desc,
            "effect_parsed": _scalar(be, "Effect"),
            "effect_chinese_list": effect_strs,
        })
    (OUT / "mb_map_objects.json").write_text(
        json.dumps(mo_list, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"  map objects: {len(mo_list)}", file=sys.stderr)

    # MapAreaStory
    mas2_list = []
    for f, p, raw in files_of_class("MapAreaStoryNode"):
        fe = p["fields"]
        be = fe.get("areaStory") or fe.get("story") or fe
        mas2_list.append({
            "filename": f.name,
            "name": p.get("name"),
            "script_pathid": p["script_pathid"],
            "fields": {k: v for k, v in (be if isinstance(be, dict) else fe).items() if not k.startswith("__")},
        })
    (OUT / "mb_map_area_story.json").write_text(
        json.dumps(mas2_list, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"  map area story: {len(mas2_list)}", file=sys.stderr)

    # EventLine variants (XNode graph containers)
    event_line_names = [n for n in catalog_by_name if "_EventLine" in n or n.endswith("Story") or n.endswith("Info")]
    event_lines = {}
    for nm in event_line_names:
        rows = []
        for f, p, raw in files_of_name(nm):
            fe = p["fields"]
            rows.append({
                "filename": f.name,
                "name": p.get("name"),
                "script_pathid": p["script_pathid"],
                "fields": {k: v for k, v in fe.items() if not k.startswith("__")},
            })
        event_lines[nm] = rows
    (OUT / "mb_event_lines.json").write_text(
        json.dumps(event_lines, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"  event lines: {len(event_lines)} categories, total {sum(len(v) for v in event_lines.values())}", file=sys.stderr)

    # ConditionSwich
    cs_list = []
    for f, p, raw in files_of_name("Condition Swich"):
        cs_list.append({
            "filename": f.name,
            "name": p.get("name"),
            "script_pathid": p["script_pathid"],
            "fields": {k: v for k, v in p["fields"].items() if not k.startswith("__")},
        })
    (OUT / "mb_condition_switches.json").write_text(
        json.dumps(cs_list, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"  condition switches: {len(cs_list)}", file=sys.stderr)

    # XNode edges (port connections)
    edges = []
    pid_to_files = defaultdict(list)
    for f, p, _ in parsed_records:
        if p["script_pathid"] is not None:
            pid_to_files[p["script_pathid"]].append(f.name)

    for f, p, raw in parsed_records:
        fe = p["fields"]
        ports = fe.get("ports")
        if not isinstance(ports, dict):
            continue
        keys = ports.get("keys")
        values = ports.get("values")
        if not isinstance(keys, dict) or not isinstance(values, dict):
            continue
        # keys is an array whose items are scalar "string data = "x""
        # values is an array whose items are NodePort structs
        key_items = (keys.get("__items__") or [])
        val_items = (values.get("__items__") or [])
        for k_node, v_node in zip(key_items, val_items):
            if not isinstance(v_node, dict):
                continue
            pname = v_node.get("_fieldName")
            npathid = get_ppathid(v_node.get("_node"))
            conn_arr = v_node.get("connections")
            if not isinstance(conn_arr, dict):
                continue
            for c in (conn_arr.get("__items__") or []):
                if not isinstance(c, dict):
                    continue
                cn = c.get("node") or {}
                edges.append({
                    "from_file": f.name,
                    "from_port": pname,
                    "from_node_pathid": npathid,
                    "to_port": c.get("fieldName"),
                    "to_node_pathid": get_ppathid(cn),
                })
    for e in edges:
        if e["to_node_pathid"] is not None:
            matches = pid_to_files.get(e["to_node_pathid"], [])
            e["to_file"] = matches[0] if matches else ""
    (OUT / "mb_xnode_edges.json").write_text(
        json.dumps(edges, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"  xnode edges: {len(edges)}", file=sys.stderr)

    # === Decode strings pass ===
    # Use raw bytes (not the lossy utf-8 text) so embedded Chinese
    # in string values is preserved for proper decoding.
    print("Decoding strings ...", file=sys.stderr)
    strings_decoded = {}
    for f, p, _ in parsed_records:
        raw_bytes = p.get("_raw")
        if raw_bytes is None:
            continue
        quoted = extract_quoted_bytes_from_raw(raw_bytes)
        decoded_list = []
        for q in quoted:
            if not q:
                continue
            if all(32 <= b < 127 or b in (9, 10, 13) for b in q):
                continue
            d = decode_bytes(q)
            if d and any(0x4E00 <= ord(c) <= 0x9FFF for c in d):
                decoded_list.append(d)
        if decoded_list:
            strings_decoded[f.name] = decoded_list
    (OUT / "mb_strings_decoded.json").write_text(
        json.dumps(strings_decoded, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"  decoded strings: {len(strings_decoded)} files contain Chinese", file=sys.stderr)

    summary = {
        "total_mb_files": len(files),
        "unique_names": len(catalog_by_name),
        "unique_classes": len(catalog_by_class),
        "categories": {
            "BattleEvent (class)": len(battle_events),
            "MapAreaStat (class)": len(mas_list),
            "MapAreas (class)": len(ma_list),
            "MapObject (class)": len(mo_list),
            "MapAreaStory (class)": len(mas2_list),
            "EventLine variants": sum(len(v) for v in event_lines.values()),
            "Condition Swich (by name)": len(cs_list),
        },
        "edges_total": len(edges),
        "files_with_decoded_chinese": len(strings_decoded),
    }
    (OUT / "mb_extraction_summary.json").write_text(
        json.dumps(summary, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(json.dumps(summary, ensure_ascii=False, indent=2))


def _scalar(d, name):
    if not isinstance(d, dict):
        return None
    v = d.get(name)
    if isinstance(v, dict) and v.get("__kind__") == "struct":
        return {k: vv for k, vv in v.items() if not k.startswith("__")}
    return v

def _items(d, name):
    if not isinstance(d, dict):
        return None
    v = d.get(name)
    if isinstance(v, dict):
        return v.get("__items__", [])
    return None

def _ppathid(d):
    if isinstance(d, dict) and "__pathid__" in d:
        return d["__pathid__"]
    if isinstance(d, dict):
        mf = d.get("m_FileID")
        if isinstance(mf, dict) and "__pathid__" in mf:
            return mf["__pathid__"]
    return None

if __name__ == "__main__":
    main()
