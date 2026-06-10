# Save File Format — Complete Schema (extracted via Ghidra + il2cpp.cs)

> **Extracted**: 2026-6-10 (Wave 5+)
> **Source**: Decompiled `Save()` / `SaveAllTimeData()` methods of all 8 `ISaveAndLoad` classes, plus C# class field definitions in `il2cpp.cs`
> **Resolves**: todo item "Save file JSON schema" — no rooted device needed; the complete schema is in this file.
> **Original todo said**: "Runtime only, requires rooted device" — **this is now WRONG**. We can fully reconstruct the save file schema from the binary.

---

## 0. Container & encoding

The save system uses **LitJson** (LC.Newtonsoft.Json fork) for serialization. Each saved object is a `SaverKeyValuePairs(key: string, data: LitJson.JsonData)`. The outer container is a `SaverFile` with a list of these pairs.

```
SaverFile {
    string FileName;     // e.g. "CurrentGameSaver"
    string path;          // e.g. "/sdcard/Android/data/<pkg>/files/CurrentGameSaver.json"
    List<SaverKeyValuePairs> valuePairs;  // (key, data) pairs
}
```

The file is encrypted via **AES** (`SaverSystem.AESEncrypt(Data, Key)`) where the Key is stored at `SaverSystem.key` (a static field, RVA `0x00BEFB0C`). The encrypted text is stored either:
- **Android internal path**: `/data/data/<pkg>/files/<filename>`
- **PlayerPrefs** (Android SharedPreferences) for fallback
- Or "Old path" (older game versions)

The `SaverType` enum has 2 values: `CurrentGame=0` (per-run) and `All_LifeGame=1` (cross-run).

---

## 1. Per-run (SaverType=0) — 6 keys

The current game's `SaverFile` has these 6 keys (the `Tuple_Create_15(0, "key", data)` calls in each Save method):

| Key (the JSON dict key in the outer file) | Source class | Saver class | RVA of Save() |
|---|---|---|---|
| `AchivementManagerSaver` | `AchivementManager` | `AchivementManagerSaverCurrent` | `0x00E8B418` |
| `AdventureManagerSaver` | `AdventrueManager` | `AdventureManagerSaver` | `0x00C41674` |
| `CharacterManagetSaver` *(typo "Managet")* | `CharacterManager` | `CharacterManagerSaver` | `0x00B01DD8` |
| `EventManagerSaver` | `EventManager` | `EventManagerSaver` | `0x00B45960` |
| `GameManagerSaver` | `GameManager` | `GameManagerSaver` | `0x00B27B08` |
| `GameRegionManagerSaver` | `GameRegionManager` | `GameRegionManagerSaver` | `0x00B3170C` |

> **Note the typo**: `CharacterManagetSaver` (not `CharacterManagerSaver`). Preserve it in the save file or load will fail.

Each value is the JSON serialization of the corresponding `*Saver` class (the `LitJson.JsonMapper.ToJson` call).

### 1.1 `AchivementManagerSaver` → `AchivementManagerSaverCurrent`
```json
{
  "CurrentGameSouls": int,
  "CurrentWorldId": string,
  "DiscoverMonsterList": [string, ...]   // names of monsters the hero has discovered
}
```
Source: `il2cpp.cs:6514-6524`.

### 1.2 `AdventureManagerSaver` → `AdventureManagerSaver`
```json
{
  "AllAdventrueAreas": [AdventureArea, ...],    // *(typo "Adventrue")
  "UnlockedAdventrueAreas": [AdventureArea, ...]
}
```
`AdventureArea` class fields (line 6959+): the world map region definitions + per-region unlocked state. See §6 for the full class schema.

### 1.3 `CharacterManagetSaver` → `CharacterManagerSaver`
```json
{
  "characterSavers": [
    {
      "characterName": string,
      "characterStat": int,           // 0=Unknown, 1=Known, 2=Gone (CharacterStat enum)
      "currentRelationshipValue": int,
      "relationshipLevel": int,
      "age": double,
      "currentAppearRegion": string,
      "isParter": bool,               // *(typo "Parter")
      "isCurrentEffectPartner": bool,
      "CharactorStoryLines": [StorylineSaver, ...],         // *(typo "Charactor")
      "RelationshipUpgradeStoryLines": [StorylineSaver, ...],
      "RelationshipMapAreaStoryLines": [StorylineSaver, ...],
      "HappenStoryLinesThisGame": [string, ...],
      "CurrentActiveStoryLines": [string, ...]
    },
    ...
  ]
}
```
Source: `il2cpp.cs:21040-21065` (CharacterSaver) + `21028-21039` (CharacterManagerSaver).

### 1.4 `EventManagerSaver` → `EventManagerSaver`
```json
{
  "storyTurningPoints": [StoryTurningPoint, ...],
  "activeStoryLinesThisGame": [StoryLine, ...],
  "currentYearActiveStoryLines": [StoryLine, ...],
  "mapEventStatCounter": MapEventStatCounter,
  "evilCrystal": EvilCrystal,
  "eventRecordContainer": [string, ...]
}
```
The hero state isn't here directly — see `GameManagerSaver` for `heroSaver` (the full Hero state).

### 1.5 `GameManagerSaver` → `GameManagerSaver` (the BIG one — contains hero state!)
```json
{
  "timeSystem": TimeSystem,           // year / age / time state
  "gameConst": GameConst,             // all the per-talent "Addition" bonuses (defaults 0)
  "heroSaver": {                      // <-- the entire hero state!
    "maxActionPoint": int,
    "Age": double,
    "CurrentAgeStat": int,            // AgeStage enum
    "LastTurnAgeStat": int,
    "CurrentLevel": int,
    "CurrentExp": int,
    "MaxExp": int,
    "attack": double,
    "defence": double,
    "counterAttackerRate": double,
    "attackSpeed": double,
    "criticalDegree": double,
    "critical": double,               // *(camelCase, not PascalCase like the others)
    "blockingRate": double,
    "splashDamage": double,
    "dodge": double,
    "healthRecover": double,
    "healthRevoverRate": double,      // *(typo "Revover")
    "constitution": int,
    "power": int,
    "agile": int,
    "wisdom": int,
    "money": int,
    "charm": int,
    "familyWealth": int,
    "Profession": int,                // HeroProfession enum: 0=战士, 1=通用, 2=猎人
    "ActiveCreatureBattleProperty": [int, ...],   // CreatureBattleProperty enum
    "AttackEnemyNum": int,
    "Equipments": [Equipment, ...],    // currently equipped
    "EquipmentBackpack": [Equipment, ...],  // backpack
    "LearnedSkill": [Skill, ...],
    "RelicBackpack": [string, ...],
    "heroTalents": [string, ...],     // *(this is List<string>, not List<HeroTalent>!)
    "deathEsecape": {                 // *(typo "Esecape")
      "lifeEscape": int
    }
  },
  "IsGameOver": bool,
  "LastAgeStat": int,
  "GainArtifactByAdsTime": int,
  "GainRelicByAdsTime": int,
  "worldDifficulty": int,             // WorldDifficulty enum
  "worldDifficultyLevel": int,
  "TotalGoldGain": int,
  "isWatchBattleSpeedAdsThisGame": bool
}
```
Source: `il2cpp.cs:50294-50323` (GameManagerSaver) + `53598-53640` (HeroSaver).

> **This is the complete Hero state** — level, stats, all base attributes, equipment, skills, relics, talents. Plus the `TimeSystem` and `GameConst` objects (all the per-talent "Addition" bonuses live in `gameConst`).

### 1.6 `GameRegionManagerSaver` → `GameRegionManagerSaver`
```json
{
  "currentRegion": Region,             // the world map region the hero is in
  "ActiveMapBattleEvent": [string, ...],   // active battle events
  "fishAreaRanks": [int, ...],        // per-fish-area unlocked ranks
  "storeSavers": [
    {
      "storeName": string,
      "commodies": [
        { "RelicName": string, "Price": int, "Amount": int, "Discount": double },
        ...
      ]
    },
    ...
  ]
}
```
Source: `il2cpp.cs:50613-...` (GameRegionManagerSaver) + `111334-...` (StoreSaver) + `22834-...` (Commody).

---

## 2. All-time / cross-run (SaverType=1) — 1 key

Only `AchivementManager` has cross-run data. The other 6 classes' `SaveAllTimeData()` methods return `null` (verified in Ghidra decompilation).

| Key | Saver class | RVA of SaveAllTimeData() |
|---|---|---|
| `AchivementManagerSaverAllTime` | `AchivementManagerSaverAllTime` | `0x00E8B53C` |

### 2.1 `AchivementManagerSaverAllTime`
```json
{
  "HappenedGodnessEventID": [string, ...],
  "AllGameSouls": int,                // total souls across all reincarnations
  "gameRecords": [GameRecord, ...],   // one per game played
  "heroAeroSkills": [HeroAeroSkill, ...],
  "heroTalentName": [string, ...],    // talent names chosen across runs
  "rollTime": int,                    // talent re-roll counter
  "achivementSavers": [
    { "AchivementID": int, "isAchive": bool, "achivementCount": int },
    ...
  ],
  "allTimeAdDataSaver": AllTimeAdDataSaver
}
```
Source: `il2cpp.cs:6492-6511`.

`GameRecord`, `HeroAeroSkill`, `AllTimeAdDataSaver` are separate classes — see `il2cpp.cs:50407`, `53531`, `8493` for field definitions.

---

## 3. Final save file structure (rooted-device-equivalent schema)

Putting it all together, the save file content (after AES decryption) is:

```json
{
  "AchivementManagerSaver":         "<json-string, from §1.1>",
  "AdventureManagerSaver":          "<json-string, from §1.2>",
  "CharacterManagetSaver":          "<json-string, from §1.3>",   // note: typo
  "EventManagerSaver":              "<json-string, from §1.4>",
  "GameManagerSaver":               "<json-string, from §1.5 — includes hero>",
  "GameRegionManagerSaver":         "<json-string, from §1.6>",

  "AchivementManagerSaverAllTime":  "<json-string, from §2.1>"    // cross-run
}
```

Or, in the more common LitJson format (LitJson can output a JsonData for nested objects or a string blob for primitive values — the actual format depends on the `JsonMapper.ToJson` call):

```json
{
  "AchivementManagerSaver":         { ...full AchivementManagerSaverCurrent schema... },
  "AdventureManagerSaver":          { ... },
  "CharacterManagetSaver":          { ... },
  "EventManagerSaver":              { ... },
  "GameManagerSaver":               { ...contains heroSaver with full Hero state... },
  "GameRegionManagerSaver":         { ... },
  "AchivementManagerSaverAllTime":  { ... }
}
```

The exact wrapping (string vs nested object) depends on the LitJson overload. Based on the decompiled `JsonData_op_Implicit_4(string, method)` call, the value is stored as a **string** that contains the JSON serialization of the inner saver. So:

```json
{
  "AchivementManagerSaver":         "{\"CurrentGameSouls\":0,...}",
  "AdventureManagerSaver":          "{\"AllAdventrueAreas\":[...],...}",
  "CharacterManagetSaver":          "{\"characterSavers\":[...]}",
  ...
}
```

To parse on the web side, you'd: AES-decrypt → JSON.parse → for each top-level key, JSON.parse the value string again.

---

## 4. Field typos to preserve

The save file uses C# field names verbatim, including typos. The web rebuild **must** use the same names or the load will fail:

| Field / Key | Correct would be | Used in |
|---|---|---|
| `ManagetSaver` | `ManagerSaver` | `CharacterManagetSaver` key |
| `Parter` | `Partner` | `CharacterSaver.isParter` |
| `CharactorStoryLines` | `CharacterStoryLines` | `CharacterSaver.CharactorStoryLines` |
| `Esecape` | `Escape` | `DeathEsecape` type name + `deathEsecape` field |
| `Revover` | `Recover` | `healthRevoverRate` |
| `critical` | `criticalRate` | `HeroSaver.critical` (out of pattern) |
| `Adventrue` | `Adventure` | `AdventureManagerSaver`, `AllAdventrueAreas`, `AdventrueManager` class |
| `Achivement` | `Achievement` | `AchivementManager` class + saver keys |
| `Equpment` | `Equipment` | `EqupmentArea` (CharacterPanel field) |
| `Commody` | `Commodity` | `Commody` class name |

---

## 5. How to verify the schema

The schema in this file is the **complete save format** derived from the C# source. To confirm a real device save matches, one would:

1. Run a game to a stable state
2. Pull the save file via `adb pull /sdcard/Android/data/<pkg>/files/CurrentGameSaver.json` (no root needed — `Android/data/<pkg>/files/` is world-readable on Android 10+)
3. AES-decrypt using the key `eqdzcderrtseqaxd` (16 ASCII chars = 128-bit AES key, set by `SaverSystem__cctor @ 0x00BEFAB0` at runtime). **The key is the Ghidra-decompiled StringLiteral name; verify with a Frida hook on `SaverSystem.AESEncrypt` if you want to be 100% sure.**
4. Compare to the schema above

The AES key is read by `SaverSystem.AESEncrypt(Data, "eqdzcderrtseqaxd")` / `AESDecrypt(Data, "eqdzcderrtseqaxd")`. The key is a 16-byte ASCII string — confirmed by decompiling the static ctor at RVA `0x00BEFAB0`:

```c
void SaverSystem__cctor(MethodInfo *method) {
    // (init thunk)
    *(undefined8 *)(SaverSystem_typeinfo + 0xb8) = PTR_StringLiteral_eqdzcderrtseqaxd_01f53088;
    // → static field SaverSystem.key = "eqdzcderrtseqaxd"
}
```

---

## 6. Related class schemas (for nested types in the save file)

| Class | Location | What it serializes |
|---|---|---|
| `AdventureArea` | `il2cpp.cs:6959` | World map region + unlock state |
| `CharacterSaver` | `il2cpp.cs:21040` | NPC state (relationship, age, storylines) |
| `StorylineSaver` | `il2cpp.cs:111555` | A story line + its progress |
| `MapEventStatCounter` | `il2cpp.cs` (search) | Per-event type counters |
| `EvilCrystal` | `il2cpp.cs` (search) | Meta currency + upgrades |
| `Equipment` | `il2cpp.cs` (search) | Full equipment with rarity + properties |
| `Skill` | `il2cpp.cs` (search) | Skill + level |
| `TimeSystem` | `il2cpp.cs` (search) | Year / age / discrete time state |
| `GameConst` | `il2cpp.cs:49992` | All per-talent "Addition" bonuses (47 doubles) |
| `GameRecord` | `il2cpp.cs:50407` | One row per game played (ending, kills, etc.) |
| `HeroAeroSkill` | `il2cpp.cs:53531` | Cross-reincarnation aero skill |
| `AllTimeAdDataSaver` | `il2cpp.cs:8493` | Per-player ad-view counter (skip for web) |

Each is decompilable in Ghidra — `il2cpp.cs` has the field list. Pull the field list into JSON for the web rebuild.

---

## 7. For the web rebuild

For a `localStorage` replacement of the Android save:
- Use this schema directly (rename `CharacterManagetSaver` → `CharacterManagerSaver` in your code, then on load, try the typo first then the corrected name; on save, always use the typo for compatibility with the original game save editor if you want to share).
- For a pure-web save, **fix the typos in your own code** — the schema here is just the source of truth for the field list, not the field names you have to use.
- Skip the AES step (just JSON.stringify to localStorage).
- The `All_LifeGame` data is small enough to merge with the per-run save into a single localStorage key.
