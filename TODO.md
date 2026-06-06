# 轮回 (Lunhui) — Build Plan & Status

> All build phases complete. Verified via Node.js functional tests.

## Phase 0 — Foundation
- [x] Create directory tree (css/, js/, js/data/, assets/)
- [x] Write DESIGN.md (systems, balance, branching map)
- [x] Write README.md (run instructions, content authoring guide)

## Phase 1 — Engine Skeleton
- [x] Write index.html (entry point, classic script tags)
- [x] Write css/main.css (ink-wash theme, layout, sidebar, narrative panel)
- [x] Write css/combat.css (combat overlay styling)
- [x] Write css/mobile.css (responsive breakpoints)
- [x] Write js/utils.js (rng, helpers, formatters)
- [x] Write js/state.js (global state, stat deltas, derived values)
- [x] Write js/save.js (localStorage, export/import, achievements)
- [x] Write js/ui.js (render functions, typewriter, modals)
- [x] Write js/engine.js (scene loader, choice handler, event dispatcher)
- [x] Write js/combat.js (turn-based combat, status effects)

## Phase 2 — Data Layer
- [x] Write js/data/items.js (40 items)
- [x] Write js/data/skills.js (13 skills + 7 status effects)
- [x] Write js/data/enemies.js (21 enemies with drops)
- [x] Write js/data/scenes.js (101 scene nodes: prologue + act1 + act2 + act3 + side + endings)
- [x] Write js/data/realms.js (cultivation realm progression data)

## Phase 3 — Verification
- [x] All JS files pass `node --check` syntax validation
- [x] All JS files are valid UTF-8
- [x] All scene next-references resolve
- [x] All enemy references exist
- [x] All skill references exist
- [x] All item references exist (resource fields like hp/lingshi are special)
- [x] Character creation flow works
- [x] Scene navigation works
- [x] Combat starts and enemy HP tracks correctly
- [x] Breakthrough to lianqi works
- [x] Breakthrough to zhuji works
- [x] Save/load roundtrip preserves state
- [x] All 7 endings are reachable from final-choice hub

## Phase 4 — Polish
- [x] Settings panel (text speed, font size, reset)
- [x] Keyboard nav (1-9 for choices, I/K/S/L/A for menus, A/D/F in combat)
- [x] Achievement / ending gallery view
- [x] Export/import save modals
- [x] Responsive layout (desktop / tablet / phone)
- [x] Typewriter text reveal
- [x] Cinnabar / gold / parchment palette
