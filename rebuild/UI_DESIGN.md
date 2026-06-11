# UI Design — 异世轮回录 Web Rebuild

> **Source**: `il2cpp.cs` (Unity 2019.4.17f1c1 / IL2CPP AArch64, build 1.20) reverse
> from `A:\github project\game 2\il2cpp.cs`. All `FDPanel` / `MonoBehaviour` UI
> controllers listed below are real classes extracted via Ghidra (see
> `rebuild\ghidra_results.md`) — see their `.cs` lines for full field lists.
>
> **Goal**: mirror the original layout / flow of the title screen → start
> menu → new-game (goddess scene) → continue → in-game panels. Do **not** copy
> any art / fonts / icon data — the web rebuild uses emoji + color tokens per
> `rebuild\rebuild_guide.md` §9.3.

---

## 0. Panel framework — `FDPanel` base

All modal panels inherit from `FDPanel : MonoBehaviour` (`il2cpp.cs:45907`).
Fields the framework exposes on every panel:

```
panelName : string       // human-readable name (debug)
IsClickExit : bool       // if true, click outside dismisses
OnEnterEvent : UnityEvent
OnStartEvent : UnityEvent
OnExitEvent  : UnityEvent
uiAnimator  : UIAnimation // open/close animation
isReadyToExist : bool
```

Lifecycle: `OnEnter(BaseContext) → OnStart() → ... → OnDisable() → OnExit()`.
`BaseContext` carries the per-panel payload (e.g. `MapAreaPanelContext` carries
`MapAreaBtnType` + `MapAreaName`).

The web rebuild's "screen" concept maps 1:1 to `FDPanel`. Every screen is a
single DOM view that mounts / unmounts via a small `panelStack` (push/pop), and
animates in/out with CSS transitions.

---

## 1. App boot → `LoadScene` (title / start scene)

`LoadScene : MonoBehaviour` (`il2cpp.cs:77163`) is the **root controller** of
the original game. The Android APK ships one Unity scene that contains
`LoadScene`; the entire UI is built as runtime-instantiated FDPanels.

### 1.1 Entry flow (start scene)

```
GameSceneCommander.Start()             // il2cpp.cs:50709 (boots scene)
  └─ LoadScene.Start()                  // il2cpp.cs:77461
       └─ _Start_b__7_0()                // il2cpp.cs:77507 (init black cover)
       └─ SayOpeningWord()              // il2cpp.cs:77463 (goddess intro text)
  └─ LoadScene.ShowMenuOption()         // il2cpp.cs:77467  (the actual title UI)
```

`LoadScene` UI fields (`il2cpp.cs:77166-77172`):
- `OptionLayoutDisplay : VerticalLayoutDisplay` — vertical button stack
- `GodnessWordLayoutDisplay : HorizontalLayoutDisplay` — goddess text strip
- `GodnessWordPrefabs : FDText` — text prefab for each goddess line
- `OptionPrefabs : GameObject` — option button prefab
- `LoadGameTextPrefabs : FDText` — "载入中..." text
- `blackCover : UIAnimation` — fade-to-black
- `SoundToggle : Toggle` — global sound on/off
- `currentDisplayStoryLine : StoryLine` — current goddess story

### 1.2 Web rebuild title screen — wireframe

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│                       异世轮回录                                │
│                  Otherworld Samsara Record                     │
│                                                                │
│                  [ ✦  新的轮回  ✦ ]   (primary)                │
│                                                                │
│                  [ 继续轮回 ]            (ghost, disabled      │
│                                           if no save)         │
│                                                                │
│                  [ 成就 / 游戏记录 ]                           │
│                                                                │
│                  [ 设置 ]                                      │
│                                                                │
│                  [ 🔊  声音: 开 ]    (footer toggle)           │
│                                                                │
│   轮回: N   灵魂: X   邪晶: Y   残酷世界: 已解锁/未解锁       │
└────────────────────────────────────────────────────────────────┘
```

**Mapping** (`BegginGameType` enum `il2cpp.cs:14938`):

| Button | Action | Method | Notes |
|---|---|---|---|
| 新的轮回 | start new run | `LoadScene.EnterGame()` | shows `SelectBirthOptionPanel` |
| 继续轮回 | resume save | `LoadScene.CountinueGame()` | only if `localStorage["save"]` exists |
| 成就 / 游戏记录 | open codex | `AchivementDisplayPanel.OnEnter()` | sub-tabs: 成就 / 游戏记录 |
| 设置 | open settings | `SettingPanel.OnEnter()` | sound + give-up turn |
| 🔊 声音 | toggle | `LoadScene.SoundToggle` | persists in `localStorage` |
| 残酷世界 toggle | gated | shown only after 击败了魔王 (`如此老套?` ending) | see `extracted_game_data.md` §6 |

> **Naming note**: the original button is 新的轮回, not "New Game", because each
> run is one *reincarnation* (Samsara). Web rebuild uses the same word.

### 1.3 State carried into / out of the title

```ts
type TitleState = {
  reincarnationCount: number;   // 轮回次数, from cross-run save
  souls: number;                // 灵魂
  evilCrystal: number;          // 邪晶
  cruelWorldUnlocked: boolean;  // 解锁条件: 击败了魔王
  hasSave: boolean;             // localStorage has in-run save
  soundOn: boolean;
};
```

Load on `LoadScene.Start()`. Persist on every state change. `localStorage`
keys (per `save_format.md`): `yslhl.save.cross` (cross-run), `yslhl.save.run`
(in-run, 6 keys per saver class).

---

## 2. "新的轮回" click → `SelectBirthOptionPanel` (goddess scene)

`SelectBirthOptionPanel : FDPanel` (`il2cpp.cs:103374`).

### 2.1 Fields

```
Bg              : UIAnimation   // background animation
talentBox       : HeroTalentBox // 5 talent draft cards
CrueWordToggle  : CrulWordToggle// cruel-world switch
```

`CrulWordToggle` (`il2cpp.cs:26542`) — toggle the difficulty mode. **Locked
until 如此老套? ending is achieved**; if locked, the toggle is greyed out and
shows a tooltip "解锁残酷世界，并且你现在可以锁定一个天赋".

`HeroTalentBox` (`il2cpp.cs:53673`) — renders the 5 draft talents. Each is a
card with name + effect text + 选 button. Player must pick exactly **1 of 5**
(per `rebuild_guide.md` §1.5: "Random roll from pool, no prerequisite tree").

### 2.2 Web rebuild goddess scene — wireframe

```
┌────────────────────────────────────────────────────────────────┐
│  [ ← 返回 ]                                          [ ? 规则 ] │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  女神之声:                                                     │
│   ┌──────────────────────────────────────────────────────┐    │
│   │  你又来到了我的面前.                                  │    │
│   │  这一次, 你想成为什么样的人?                          │    │
│   │  (在五张命运卡中选择一张作为你的天赋)                  │    │
│   └──────────────────────────────────────────────────────┘    │
│                                                                │
│   ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ │
│   │ 强壮A   │ │ 敏捷A   │ │ 剑之勇者 │ │ 有点小帅 │ │ 神之子  │ │
│   │ +6 勇猛 │ │ +6 灵巧 │ │ +10%攻击 │ │ +6 魅力  │ │ 全属+1  │ │
│   │  [选]  │ │  [选]   │ │  [选]   │ │  [选]   │ │  [选]  │ │
│   └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘ │
│                                                                │
│  残酷世界:  [ 开启 / 关闭 ]   (greyed until unlocked)          │
│                                                                │
│  [ ✦ 开始此世 ✦ ]    (disabled until talent selected)          │
└────────────────────────────────────────────────────────────────┘
```

### 2.3 Confirm flow

1. Player clicks `[ 选 ]` on a card → card highlights gold border.
2. Cruel World toggle is set (only if unlocked).
3. `[ 开始此世 ]` enables. Click → fire `BegginTransfer` (start new run):
   - `GameManager.begginGameType = NewGame` (`il2cpp.cs:14938:1`)
   - `GameManager.GameBeggin()` (`il2cpp.cs:50239`)
   - `LoadScene.SwichGameScene()` (`il2cpp.cs:77494`) — swap scene to in-game
4. Closing the panel without confirming → `SelectBirthOptionPanel.Close()`
   (`il2cpp.cs:103403`) → returns to title.

### 2.4 First-time variant

`FirstTimeSeeGodnessSelectBirthOptionPanel` is referenced in
`rebuild\rebuild_guide.md` §3.4. The web rebuild can re-use the same panel
with a `isFirstTime: bool` flag in its context — first-time variant shows
an extra tutorial card explaining the talent system + 重启轮回 button.

---

## 3. "继续轮回" click → `LoadScene.CountinueGame()`

`CountinueGame()` (`il2cpp.cs:77493`) → reads save → `SwichGameScene()`.

Web rebuild equivalent:

```ts
function onContinueClick() {
  const raw = localStorage.getItem('yslhl.save.run');
  if (!raw) return;                          // button should already be disabled
  const save = JSON.parse(decodeURIComponent(escape(atob(raw)))); // AES skipped per §9.4
  loadGameState(save);
  GameManager.begginGameType = 'CountinueGame';
  pushScreen('MapAreaPanel');                // resumes at region selection
}
```

If no save, the button is greyed + tooltip "尚无存档". After loading, drop the
player at `MapAreaPanel` (the **in-game** region/world map, **not** the
title) — see §4.

---

## 4. Region select → `MapAreaPanel` (in-game map)

`MapAreaPanel : FDPanel` (`il2cpp.cs:79416`).

### 4.1 Fields + role

```
panelContext : MapAreaPanelContext
  ├─ MapAreaOpenType : MapAreaBtnType
  │     OpenMapArea = 0
  │     OpenAdventruePanel = 1    // enter maze / dungeon
  │     BegginMapBattleEvent = 2  // scripted boss / event
  └─ MapAreaName : string
areaContent : MapAreaContent        // il2cpp.cs:79360 — left list of POIs
  ├─ MapAreaObjectOption  : MapObject POI cards
  ├─ AdventureAreaOption  : AdventrueArea cards
  └─ CharacterObjectOption : NPC character cards
```

### 4.2 Wireframe

```
┌────────────────────────────────────────────────────────────────┐
│ [ 离开 ]  当前区域: 迷雾森林       轮回: 1  灵魂: 320  邪晶: 4 │
├──────────────┬─────────────────────────────────────────────────┤
│  区域:       │  描述:                                          │
│  ▸ 矿山      │   矮人曾在此开矿, 如今地龙占据.                  │
│  ▸ 精灵之森  │   精灵族世代守护的森林, 近年来被魔眼侵蚀.        │
│  ▸ 迷雾森林  │   终年不散的浓雾, 哥布林在此建立了巢穴.        │
│  ▸ 兽人山脉  │   兽人的领地, 部落林立.                          │
│  ▸ 墓地/魔域 │   不死族的领域, 阴森而危险.                      │
│              │                                                 │
│  兴趣点:     │  可前往:                                        │
│  • 哥布林巢  │   [ 进入迷宫 ]   [ 挑战守护者 ]  [ 查看地图 ]    │
│  • 雾隐之村  │                                                  │
│  • 古战场    │                                                  │
└──────────────┴─────────────────────────────────────────────────┘
```

Web rebuild: 5 main regions in left rail, POIs shown as `MapAreaObjectOption`
cards in middle, right panel = current selection detail + actions.

---

## 5. Year / event flow → `EventDisplayPanel`

`EventDisplayPanel : FDPanel` (`il2cpp.cs:41847`).

Fields: `BG`, `Content`, `Title`, `AgeText`, `YearLabel`, `AgeText`,
`OptionAreas`, `Options : List<FDButton>`, `ContinueBtn`, `ClickContinue`,
`RewardTextPrefabs`, `HorizontalLayoutPrefabs`, `EquipmentDisplayPrefabs`,
`itemGainDisplayPrefabs`, `heroPortait`, `characterPortrait`, `Portrait`,
`NextEventBtn`, `EventNumText`, `StoryLine`, `endEvent`, `SkipEventToggle`.

```
┌────────────────────────────────────────────────────────────────┐
│   故事线:  父亲的剑术         事件 2 / 5        [ 跳过文本 □ ]  │
├────────────┬───────────────────────────────────────────────────┤
│  [portrait]│  你8岁. 父亲终于同意教你基础剑术,                │
│  父亲      │  但他让你先劈100次柴火再决定.                     │
│            │                                                   │
│            │  [ 选项A: 立刻开始 (体质+1) ]                    │
│            │  [ 选项B: 先看会儿书 (智力+1) ]                  │
│            │  [ 选项C: 偷偷溜出去玩 ]                          │
│            │                                                   │
│            │                          [ 继续 → ]              │
└────────────┴───────────────────────────────────────────────────┘
```

`AdventruePanel : FDPanel` (`il2cpp.cs:7171`) handles the maze. Its sub-panels:
- `adventrueMainMenu : AdventrueMainMenu` (status bar)
- `adventureEventContent : AdventureEventContent` (event content + choices)
- `battleCommander : BattleCommander` (combat loop)
- `adventureBackpack : AdventureBackpack` (loot)
- `leaveMaze : LeaveMaze` (3 leave types: normal / hurry / die)
- `adventureResult : AdventureResult` (post-leave summary)
- `battleTest : BattleTest` (debug)

`AdventurePanelShowType` enum: `AdventureArea=0` (maze) or `MapBattleArea=1`
(world boss).

---

## 6. Combat → `BattleFightPanel` + `BattlePartnerPanel`

`BattleFightPanel : FDPanel` (`il2cpp.cs:14569`) + `BattlePartnerPanel : MonoBehaviour`
(`il2cpp.cs:14679`). The 6 enemy slots mentioned in
`extracted_game_data.md` §4c map to 6 cards in the right pane.

```
┌────────────────────────────────────────────────────────────────┐
│  你 (LV 12)        vs        [ 哥布林×3  哥布林弓箭手×2  BOSS ]│
│  HP 240/240  AP 5/5  SP 80%  急速: 3   强化: 1              │
├────────────────────────────┬───────────────────────────────────┤
│  你的状态:                  │  敌方:                            │
│   ⚔ 攻击: 42  🛡 防御: 18  │  ┌─哥布林─┐ ┌─哥布林─┐ ┌─弓箭手─┐│
│   🏃 攻速: 1.4  🎯 暴击 8% │  │ HP 30  │ │ HP 30  │ │ HP 25  ││
│   🛡 格挡 12%  💨 闪避 5%  │  └────────┘ └────────┘ └────────┘│
│                            │  ┌─弓箭手─┐ ┌─空位──┐ ┌─空位──┐ │
│  [ 普攻 ] [ 技能 ]         │  │ HP 25  │ │        │ │        ││
│  [ 道具 ] [ 逃跑 ]         │  └────────┘ └────────┘ └────────┘│
│  [ 大喝 ] [ 旋风斩 ]       │                                   │
│                            │  ⏱ 战斗速度: [ 1x ] [ 2x ] [ 4x ]│
├────────────────────────────┴───────────────────────────────────┤
│  战斗日志:                                                       │
│   你对哥布林造成 42 伤害 (暴击 88)                              │
│   哥布林对你造成 8 伤害 (格挡: 减至 4)                         │
└────────────────────────────────────────────────────────────────┘
```

---

## 7. In-game modal panels

Each is its own `FDPanel` (line numbers from `il2cpp.cs`):

| Panel | Line | Trigger | What it shows |
|---|---:|---|---|
| `CharacterPanel` | 20958 | 角色 button | 16 base + 9 derived stats, equipment, relics, talent list |
| `SkillTreePanel` | 107053 | 技能 button | 20-skill grid with 3-level lock states |
| `LearnSkillPanel` | 74921 | level-up skill offer | 3 random skills to learn |
| `UpgradePanel` | 129901 | level-up stat offer | 3 random stat upgrades |
| `StorePanel` | 111319 | enter shop | 12 items × 3 stores (Grocery / Potion / Fish) |
| `AgeStatPanel` | 8207 | year-end age change | 少年/青年/壮年/中年/老年 transition + new event rules |
| `TimeFlowPanel` | 120742 | 跳过 button | fast-forward year-by-year |
| `RelationshipPanel` | 97945 | NPC button | 5 NPC affinity + 12 storyline progress |
| `AchivementDisplayPanel` | 6322 | 成就 button | tabs: 成就 / 游戏记录 (game history) |
| `SettingPanel` | 104668 | 设置 button | 声音 toggle, 放弃此轮回 (give up this run) |
| `GameTipsPanel` | 50722 | tutorial | typewriter text + 继续 button |
| `WarningMessagePanel` | 132009 | warning | red toast with text |
| `ItemDiscriptWindow` | 61697 | item hover | item name + 描述 + effect |
| `TipsWindow` | 121659 | generic tooltip | one-line tip |
| `InfoWindow` | 59253 | NPC info | NPC portrait + bio |
| `LabelDisplayPanel` | 74015 | label | simple text box |
| `TextContianer` | 118933 | text container | long-form text |
| `PartnerSkillDetailPanel` | 90624 | partner skill hover | partner skill details |
| `ShowNewMonsterPanel` | 106214 | new-monster first-encounter | "新发现: <name> 描述" |
| `ComfirmGainSoulPanel` | 22700 | end-of-run | soul count + 2x ads (skipped for web) |
| `ComfrimGoAdventruePanel` | 22747 | enter dungeon confirm | "进入迷宫? (体力消耗 5)" |
| `ComfrimGoTherePanel` | 22799 | enter area confirm | "前往 X 区域?" |
| `CommonComfirmPanel` | 22877 | generic yes/no | text + 确认 / 取消 |
| `DemoPanel` | 35798 | debug / demo | test scene |
| `CustomAntiAddictionPanel` | 27176 | CN anti-addiction law | real-name verify (skip for web) |
| `GmCommanderPanel` | 51339 | debug GM | cheat menu (skip) |
| `GameResultPanel` | 50631 | game over | final stats + soul gain + achievements |

### 7.1 Settings panel wireframe (sketch)

```
┌──────────────────────────────────────┐
│  设置                          [ × ] │
├──────────────────────────────────────┤
│                                      │
│  🔊 音效       [ ● 开启 ]            │
│                                      │
│  放弃此轮回                          │
│   放弃此轮回将不会记录此局,           │
│   且不会获得任何灵魂.                 │
│   [ 放弃 ]                           │
│                                      │
│                  [ 关闭 ]            │
└──────────────────────────────────────┘
```

### 7.2 Achievement panel wireframe

`AchivementDisplayPanel` has two sub-views (toggled by
`SwitchGameRecord` / `SwitchAchivement` buttons):

```
┌────────────────────────────────────────────────────────────┐
│  成就 / 游戏记录                       [ 成就 | 游戏记录 ] [ × ] │
├────────────────────────────────────────────────────────────┤
│  [ 找到 5 神话天赋 ]  奖励: 装备幸运值:8     ✓ 已达成       │
│  [ 击败卡拉多格 ]    奖励: 灵魂:500          ✗ 未达成       │
│  [ 五百个世界毁灭了 ]  奖励: 死里逃生:2       ✗ 未达成       │
│  ...                                                       │
│  游戏记录:                                                │
│   #1  轮回1  死于哥布林  年龄 12  灵魂:200                 │
│   #2  轮回2  击败魔王    年龄 35  灵魂:1840  如此老套?     │
└────────────────────────────────────────────────────────────┘
```

### 7.3 Game-over flow

`GameResultPanel` (`il2cpp.cs:50631`) → `ComfirmGainSoulPanel` →
`LoadScene.ReturnToMainMenu()` → back to title. The `Continue()` button on
`GameResultPanel` corresponds to **continue the result-view**, not
"continue the run" — be careful with naming.

---

## 8. Layout summary for the web rebuild

### 8.1 Screen stack (mirrors `FDPanel` lifecycle)

```
TitleScreen (LoadScene)
 ├─ onNewGame    → GoddessSelectScreen  (SelectBirthOptionPanel)
 │                  onConfirm           → MapAreaScreen (in-game)
 ├─ onContinue   → load save           → MapAreaScreen
 ├─ onAchiv      → AchievementScreen   (AchivementDisplayPanel)
 ├─ onSettings   → SettingsScreen      (SettingPanel)
 └─ soundToggle  → persists

MapAreaScreen (in-game map)
 ├─ enterArea    → AdventruePanel      (AdventruePanel)
 │   ├─ event    → EventDisplayPanel
 │   ├─ battle   → BattleFightPanel
 │   ├─ rest     → RestEventNode (inline)
 │   ├─ shop     → StorePanel
 │   ├─ leave    → LeaveMaze → AdventrueResult
 │   └─ die      → GameResultPanel
 ├─ onChar       → CharacterPanel
 ├─ onSkill      → SkillTreePanel
 ├─ onRel        → RelicInventory
 ├─ onShop       → StorePanel
 └─ onMenu       → SettingsScreen
```

### 8.2 Recommended file structure for the web rebuild

```
web_game/
  index.html               # shell + 3-column grid (already exists)
  styles.css               # panel / button / token styles (already exists)
  app.js                   # panel stack + state + render
  screens/
    title.js               # LoadScene / 新的轮回 / 继续 / 成就 / 设置
    goddess.js             # SelectBirthOptionPanel (5 talent cards)
    map.js                 # MapAreaPanel (regions + POIs)
    adventure.js           # AdventruePanel (maze)
    event.js               # EventDisplayPanel (storyline events)
    battle.js              # BattleFightPanel (6-slot combat)
    character.js           # CharacterPanel (stats + equipment)
    skill.js               # SkillTreePanel
    store.js               # StorePanel
    achievement.js         # AchivementDisplayPanel
    settings.js            # SettingPanel
    result.js              # GameResultPanel
  state/
    store.js               # zustand/vanilla store
    save.js                # localStorage load/save
  data/
    events.json
    talents.json
    relics.json
    ...                    # 13 JSONs per rebuild_guide.md §7
```

### 8.3 CSS class mapping (existing tokens in `styles.css`)

| Original (Unity) | Web rebuild class | Notes |
|---|---|---|
| `FDPanel` | `.panel` | already exists in `styles.css:73` |
| `UIAnimation` (open) | `.panel` + `animation: rise` | `styles.css:382-388` |
| `UIAnimation` (close) | `.panel.closing` (to add) | fade-out + translateY |
| `FDButton` primary | `.button.primary` | `styles.css:124` |
| `FDButton` ghost | `.button.ghost` | `styles.css:125` |
| `FDButton` danger | `.button.danger` | `styles.css:126` |
| `FDText` | `<p>` / `<h1-4>` with `var(--text)` | inline style only |
| `FDImage` | `<img>` with `border-radius: var(--radius-sm)` | |
| `Toggle` | `<button>` with `aria-pressed` | |
| `blackCover` | `.bg.bg-noise` overlay | already at `styles.css:56` |

---

## 9. Cross-references

- `rebuild\rebuild_guide.md` §1.2 (core loop) — game state machine
- `rebuild\rebuild_guide.md` §3.3 (per-turn event flow) — in-game panels
- `rebuild\rebuild_guide.md` §3.4 (meta progression) — `ReturnToMainMenu`
- `rebuild\rebuild_guide.md` §7 (tech stack) — panel = single DOM view
- `rebuild\rebuild_guide.md` §9.3 (icons) — emoji + color tokens for UI
- `rebuild\rebuild_guide.md` §9.4 (save) — localStorage layout
- `rebuild\ghidra_results.md` — every panel class listed with field offsets
- `rebuild\save_format.md` — per-saver schema for the cross-run key
- `rebuild\extracted_game_data.md` §6 — endings & CW unlock (gates the
  `CrueWordToggle` on the goddess screen)
- `il2cpp.cs:77163` — `LoadScene` (the title controller)
- `il2cpp.cs:103374` — `SelectBirthOptionPanel` (goddess screen)
- `il2cpp.cs:79416` — `MapAreaPanel` (in-game region map)
- `il2cpp.cs:41847` — `EventDisplayPanel` (storyline event screen)
- `il2cpp.cs:7171` — `AdventruePanel` (maze exploration)
- `il2cpp.cs:14569` — `BattleFightPanel` (combat)
- `il2cpp.cs:50631` — `GameResultPanel` (game over)
- `il2cpp.cs:6322` — `AchivementDisplayPanel`
- `il2cpp.cs:104668` — `SettingPanel`
- `il2cpp.cs:14938` — `BegginGameType` enum (`CountinueGame`, `NewGame`)
