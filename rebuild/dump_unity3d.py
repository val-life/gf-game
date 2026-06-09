#!/usr/bin/env python3
"""Walk data.unity3d with UnityPy and dump everything extractable.

IL2CPP builds strip user-script TypeTrees, so MonoBehaviours can only be
saved as raw bytes. Built-in Unity types (Sprite, Texture2D, AnimationClip,
AudioClip, Animator, AnimatorController, MonoScript) are fully readable via
UnityPy's bundled TPK definitions.

Outputs in rebuild/data/:
  monoscript_catalog.json     780   PathID -> Class.Namespace.Assembly
  monobehaviour_index.json   10246  one entry per MB instance with script_pid + name
  monobehaviour_blobs.bin           raw byte concatenation of all MB tails
  monobehaviour_blobs_index.json    {pid: (offset, length)} into the .bin
  sprite_index.json             568 rect + atlas + pivot
  texture2d_index.json          362 dimensions + format + stream-offset
  animationclip_index.json        6 keyframe meta
  audioclip_index.json           13 channels + sample-rate + format
  animator_index.json            24 controller refs
  animatorcontroller_index.json   6 controller state names
"""
import json
import struct
from pathlib import Path
from collections import defaultdict

import UnityPy

SRC = Path(r'C:\Users\Mannix\AppData\Local\Temp\opencode\unity_data\Data\data.unity3d')
OUT = Path(r'A:\github project\game 2\rebuild\data')
OUT.mkdir(parents=True, exist_ok=True)

env = UnityPy.load(str(SRC))
print(f'Loaded {len(env.objects)} objects')

def dump_json(name, data):
    path = OUT / name
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')
    print(f'  {name:32s} ({len(data) if hasattr(data, "__len__") else "-"} entries)')

# ---------- 1. MonoScript catalog -----------------------------------------
monoscripts = []
ms_by_pid = {}
for obj in env.objects:
    if obj.type.name != 'MonoScript':
        continue
    d = obj.read()
    rec = {
        'path_id':         obj.path_id,
        'class':           d.m_ClassName,
        'namespace':       d.m_Namespace,
        'assembly':        d.m_AssemblyName,
        'execution_order': getattr(d, 'm_ExecutionOrder', 0),
        'is_editor':       bool(getattr(d, 'm_IsEditorScript', False)),
    }
    monoscripts.append(rec)
    ms_by_pid[obj.path_id] = rec
monoscripts.sort(key=lambda r: r['path_id'])
dump_json('monoscript_catalog.json', monoscripts)


# ---------- 2. MonoBehaviour index + raw blobs ----------------------------
mb_index = []
blob_offset = 0
blob_chunks = []
blob_map = {}  # pid -> (offset, length)

for obj in env.objects:
    if obj.type.name != 'MonoBehaviour':
        continue
    head = obj.parse_monobehaviour_head()
    script_pid = head.m_Script.m_PathID
    script_class = ms_by_pid.get(script_pid, {}).get('class', '?')
    script_ns    = ms_by_pid.get(script_pid, {}).get('namespace', '')

    raw = obj.get_raw_data()
    name_len = len(head.m_Name.encode('utf-8'))
    # PPtr<GameObject>(12) + m_Enabled(1+pad3) + PPtr<MonoScript>(12) + name_len(4) + name + align(4)
    head_end = 12 + 4 + 12 + 4 + name_len
    head_end = (head_end + 3) & ~3
    tail = raw[head_end:]

    rec = {
        'path_id':      obj.path_id,
        'script_pid':   script_pid,
        'script_class': (script_ns + '.' if script_ns else '') + script_class,
        'name':         head.m_Name,
        'total_bytes':  len(raw),
        'tail_bytes':   len(tail),
    }
    mb_index.append(rec)

    if tail:
        blob_chunks.append(tail)
        blob_map[str(obj.path_id)] = [blob_offset, len(tail)]
        blob_offset += len(tail)

mb_index.sort(key=lambda r: r['path_id'])
dump_json('monobehaviour_index.json', mb_index)
dump_json('monobehaviour_blobs_index.json', blob_map)

blob_path = OUT / 'monobehaviour_blobs.bin'
with blob_path.open('wb') as fh:
    for c in blob_chunks:
        fh.write(c)
print(f'  monobehaviour_blobs.bin           ({blob_offset:,} bytes, {len(blob_map):,} blobs)')

# ---------- 3. Sprite index -----------------------------------------------
sprites = []
for obj in env.objects:
    if obj.type.name != 'Sprite':
        continue
    d = obj.read()
    rect = getattr(d, 'm_Rect', None)
    pivot = getattr(d, 'm_Pivot', None)
    sprites.append({
        'path_id': obj.path_id,
        'name': d.m_Name,
        'rect': [rect.x, rect.y, rect.width, rect.height] if rect else None,
        'pivot': [pivot.x, pivot.y] if pivot else None,
        'pixels_per_unit': getattr(d, 'm_PixelsToUnits', None),
        'is_polygon': bool(getattr(d, 'm_IsPolygon', False)),
        'atlas_tags': list(getattr(d, 'm_AtlasTags', []) or []),
    })
sprites.sort(key=lambda r: r['name'].lower())
dump_json('sprite_index.json', sprites)


# ---------- 4. Texture2D index --------------------------------------------
texs = []
for obj in env.objects:
    if obj.type.name != 'Texture2D':
        continue
    d = obj.read()
    sd = getattr(d, 'm_StreamData', None)
    texs.append({
        'path_id': obj.path_id,
        'name': d.m_Name,
        'width': d.m_Width,
        'height': d.m_Height,
        'format': int(d.m_TextureFormat),
        'mip_count': getattr(d, 'm_MipCount', 1),
        'image_size': getattr(d, 'm_CompleteImageSize', 0),
        'stream_path': sd.path if sd and sd.path else None,
        'stream_offset': sd.offset if sd else None,
        'stream_size': sd.size if sd else None,
    })
texs.sort(key=lambda r: r['name'].lower())
dump_json('texture2d_index.json', texs)


# ---------- 5. AnimationClip index ----------------------------------------
clips = []
for obj in env.objects:
    if obj.type.name != 'AnimationClip':
        continue
    d = obj.read()
    clips.append({
        'path_id': obj.path_id,
        'name': d.m_Name,
        'sample_rate': getattr(d, 'm_SampleRate', None),
        'wrap_mode': getattr(d, 'm_WrapMode', None),
        'legacy': bool(getattr(d, 'm_Legacy', False)),
        'compressed': bool(getattr(d, 'm_Compressed', False)),
        'muscle_clip_size': getattr(d, 'm_MuscleClipSize', 0),
        'curve_count': (
            len(getattr(d, 'm_FloatCurves', []) or []) +
            len(getattr(d, 'm_PositionCurves', []) or []) +
            len(getattr(d, 'm_RotationCurves', []) or []) +
            len(getattr(d, 'm_ScaleCurves', []) or []) +
            len(getattr(d, 'm_PPtrCurves', []) or [])
        ),
    })
clips.sort(key=lambda r: r['name'].lower())
dump_json('animationclip_index.json', clips)

# ---------- 6. AudioClip index --------------------------------------------
audios = []
for obj in env.objects:
    if obj.type.name != 'AudioClip':
        continue
    d = obj.read()
    audios.append({
        'path_id': obj.path_id,
        'name': d.m_Name,
        'load_type': getattr(d, 'm_LoadType', None),
        'channels': getattr(d, 'm_Channels', None),
        'frequency': getattr(d, 'm_Frequency', None),
        'bits_per_sample': getattr(d, 'm_BitsPerSample', None),
        'length_seconds': getattr(d, 'm_Length', None),
        'is_tracker': bool(getattr(d, 'm_IsTrackerFormat', False)),
        'compression_format': int(getattr(d, 'm_CompressionFormat', -1) or -1),
        'stream_path':   getattr(getattr(d, 'm_Resource', None), 'm_Source', None),
        'stream_offset': getattr(getattr(d, 'm_Resource', None), 'm_Offset', None),
        'stream_size':   getattr(getattr(d, 'm_Resource', None), 'm_Size', None),
    })
audios.sort(key=lambda r: (r['name'] or '').lower())
dump_json('audioclip_index.json', audios)


# ---------- 7. Animator + AnimatorController ------------------------------
anim_inst = []
for obj in env.objects:
    if obj.type.name != 'Animator':
        continue
    d = obj.read()
    ctrl = d.m_Controller
    anim_inst.append({
        'path_id': obj.path_id,
        'controller_pid': getattr(ctrl, 'm_PathID', None),
        'has_avatar': bool(getattr(d, 'm_Avatar', None) and getattr(d.m_Avatar, 'm_PathID', 0)),
        'enabled': bool(getattr(d, 'm_Enabled', True)),
    })
dump_json('animator_index.json', anim_inst)

ctrls = []
for obj in env.objects:
    if obj.type.name != 'AnimatorController':
        continue
    d = obj.read()
    ctrls.append({
        'path_id': obj.path_id,
        'name': d.m_Name,
        'clip_count': len(getattr(d, 'm_AnimationClips', []) or []),
        'controller_size': getattr(d, 'm_ControllerSize', None),
    })
ctrls.sort(key=lambda r: r['name'].lower())
dump_json('animatorcontroller_index.json', ctrls)

print()
print('Done.')
