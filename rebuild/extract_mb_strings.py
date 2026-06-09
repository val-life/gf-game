#!/usr/bin/env python3
"""Extract embedded Chinese strings from every MonoBehaviour raw blob in
monobehaviour_blobs.bin.

Strategy: walk each blob, look for the Unity serialization pattern
[int32 len][utf8 bytes][align 4] where len > 0, the bytes decode as valid
UTF-8 ending on a char boundary, and contain at least one CJK char.

Outputs:
  rebuild/data/monobehaviour_strings.json  one record per (path_id, class, name, [strings])
"""
import json
import struct
import re
from pathlib import Path

DATA = Path(r'A:\github project\game 2\rebuild\data')

mb_idx   = json.loads((DATA / 'monobehaviour_index.json').read_text('utf-8'))
blob_idx = json.loads((DATA / 'monobehaviour_blobs_index.json').read_text('utf-8'))
blob_bin = (DATA / 'monobehaviour_blobs.bin').read_bytes()

mb_by_pid = {r['path_id']: r for r in mb_idx}

CJK = re.compile(r'[\u4e00-\u9fff\u3000-\u303f\uff00-\uffef]')

def extract_strings(blob: bytes):
    """Walk the blob looking for Unity-serialized strings."""
    strings = []
    i = 0
    n = len(blob)
    while i + 4 <= n:
        slen = struct.unpack_from('<i', blob, i)[0]
        if 1 <= slen <= min(2048, n - i - 4):
            payload = blob[i + 4 : i + 4 + slen]
            try:
                s = payload.decode('utf-8')
            except UnicodeDecodeError:
                i += 4
                continue
            # Must contain at least one printable char and ideally a CJK char
            if s and CJK.search(s):
                strings.append(s)
                # Skip past the string + 4-byte alignment
                advance = 4 + slen
                advance = (advance + 3) & ~3
                i += advance
                continue
        i += 4
    return strings


records = []
for pid_str, (off, ln) in blob_idx.items():
    pid = int(pid_str)
    mb = mb_by_pid.get(pid, {})
    blob = blob_bin[off:off + ln]
    strs = extract_strings(blob)
    if not strs:
        continue
    records.append({
        'path_id':      pid,
        'script_pid':   mb.get('script_pid'),
        'script_class': mb.get('script_class'),
        'name':         mb.get('name'),
        'tail_bytes':   ln,
        'string_count': len(strs),
        'strings':      strs,
    })

records.sort(key=lambda r: (r['script_class'] or '', r['path_id']))
out = DATA / 'monobehaviour_strings.json'
out.write_text(json.dumps(records, ensure_ascii=False, indent=2), encoding='utf-8')
total_strs = sum(r['string_count'] for r in records)
print(f'Extracted {total_strs:,} Chinese strings from {len(records):,} MonoBehaviours')
print(f'  -> {out.name} ({out.stat().st_size:,} bytes)')

# Per-class summary
from collections import Counter
per_class = Counter(r['script_class'] for r in records)
print()
print('Top classes by string-bearing MB count:')
for k, v in per_class.most_common(15):
    print(f'  {k:55s} {v:5d}')
