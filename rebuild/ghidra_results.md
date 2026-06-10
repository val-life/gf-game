# Ghidra Analysis Results — `libil2cpp.so` (AARCH64, IL2CPP)

> **Source binary**: `game_file/script/libil2cpp.so` (34 MB, 97,328 functions, 690,505 symbols)
> **Ghidra project**: `Tool/ghidra_12.1.2_PUBLIC/project/game`
> **Image base**: 0x00000000 (all RVAs are real addresses)
> **Generated**: 2026-6-10 from Ghidra decompilation + `.data` section reads
>
> This file extracts every value the rebuild needs from the binary. All addresses are real Ghidra addresses (image base 0). Decompiled C is Ghidra's output of the ARM64 IL2CPP code.

---

## 0. Quick reference — formulas at a glance

| System | Formula |
|---|---|
| **Hero ATK base** | `attack = (GameConst.每点力量攻击力Addition + 0.4 + cruelLevel) * Power + 5` |
| **Hero DEF base** | `defence = (GameConst.每点体质防御力Addition + 0.5) * Constitution` |
| **Hero maxHP base** | `maxHP = (GameConst.每点体质生命值Addition + 6.0) * Constitution` |
| **Hero critRate base** | `critRate = (GameConst.每点灵巧暴击率Addition + 0.002) * Agile` |
| **Hero dodge base** | `dodge = (GameConst.每点灵巧闪避率Addition + 0.0) * Agile` |
| **Hero attackSpeed base** | `atkSpeed = (GameConst.每点敏捷攻击速度提升Addition + 0.003) * Agile` |
| **Hero blockRate base** | `blockRate = (GameConst.每点灵巧格挡率Addition + 0.003) * Agile` |
| **Hero expGain base** | `expGain = (GameConst.每点智力经验值提升Addition + 0.035) * Wisdom` |
| **Hero relationshipGain base** | `relGain = (GameConst.每点魅力好感度获取提升Addition + 0.02) * Charm` |
| **Money gain (per source)** | `final = (int)(((每点魅力金币获取提升Addition + 0.005) * Charm + 1.0) * value)` (×1.5 if source is 钓鱼/打工 + talent) |
| **XP gain (per source)** | `gainedExp = (int)((GetAllExpGainImprove + 1.0) * exp)` |
| **XP curve** | `MaxExp = (int)(level^1.25 * 100)` |
| **Soul gain** | `souls = (reincTime*10 + 200) + (level+1) * ((baseSoul + totalHeroSoul) * 0.01)`, capped at 20000 |
| **Monster ATK** | `atk = base * (cruelLevel + (pow(level, atkExp) * 0.15 * (level+1)) / 10 + 0.9)` |
| **Monster HP** | same shape, `atkExp` replaced with `hpExp` (both = `Addition + 1.35`) |
| **Shop price** | `price = (250 + Addition) * (Rarity+1)` (or `/4` if `relicType == 3`) |
| **Shop discount** | `finalPrice = (int)((1.0 - discount) * basePrice)` |
| **Equip property** | `value = Random.Range((level*mul + add) * 0.95, (level*mul + add) * 1.05)` |
| **Defence (special)** | `value = Random.Range(base * 0.95, base * 1.05)` where `base = level*4+4 / level*2+2 / level+1` |
| **Rarity roll** | weighted table, 5 entries [Common..Legendary], weights depend on `rarityLevel` and `worldDifficulty` |
| **Rarity upgrade** | 20% chance to bump `level` by 1 before computing property values |

`Rarity` enum: 0=普通(Common) 1=稀有(Rare) 2=传说(Epic) 3=神话(Legendary).
`MonsterRank` enum: 0=Boss 1=Elite 2=Normal 3=Character.
`MonsterSpecies` enum: 0=Undead 1=Beast 2=Dragon 3=Human 4=Bone.
`equipmentPropertyType` enum: MainProperty / SubProperty / RandomProperty (per RVA 0x00C3DCC4 switch).

---

## 1. Damage / defence / soul formulas

### 1.1 `Hero_CaculateBaseAttack` (RVA `0x00B36668`)

Decompiled body:
```c
double Hero_CaculateBaseAttack(Hero *this, MethodInfo *method) {
    int iVar1 = this->Power;                                     // iVar1 = hero Power
    // ... singleton fetch ...
    ManagerOfManagers *pMVar3 = Singleton<ManagerOfManagers>::get_Instance();
    return ((double)GameConst.每点力量攻击力Total + (double)GameManager.cruelLevel)
           * (double)iVar1 + 5.0;
}
```

Formula:
```
attack = (每点力量攻击力Total + cruelLevel) * Power + 5
       = (每点力量攻击力Addition + 0.4 + cruelLevel) * Power + 5
```

`每点力量攻击力Total` getter @ `0x00B277C4`:
```c
return this->每点力量攻击力Addition + DAT_018ee9c0;  // DAT = 0.4
```

The `+5` floor is hardcoded. The `cruelLevel` (read from `GameManager`) is the Cruel World level (0-10).

### 1.2 `Hero_CaculateBaseDefence` (RVA `0x00B36974`)

```c
double Hero_CaculateBaseDefence(Hero *this, MethodInfo *method) {
    int iVar1 = this->Constitution;
    return (double)GameConst.每点体质防御力Total * (double)iVar1;
}
```

Formula:
```
defence = 每点体质防御力Total * Constitution
        = (每点体质防御力Addition + 0.5) * Constitution
```

`每点体质防御力Total` getter @ `0x00B27820`:
```c
return this->每点体质防御力Addition + 0.5;
```

### 1.3 `HeroLevel_CaculateNewMaxExp` (RVA `0x00B39D30`)

```c
void HeroLevel_CaculateNewMaxExp(HeroLevel *this, MethodInfo *method) {
    int iVar1 = this->CurrentLevel;
    float fVar3 = powf((float)iVar1, 1.25f);
    this->MaxExp = (int)(fVar3 * DAT_018ee74c);  // DAT = 100.0
}
```

Formula:
```
MaxExp = (int)(level^1.25 * 100)
```

XP table (no rounding to 10s — `(int)` truncation):
| Lv | MaxExp | Lv | MaxExp | Lv | MaxExp |
|---:|------:|---:|------:|---:|------:|
|  1 |    100 | 18 | 4 235 | 35 | 13 437 |
|  2 |    237 | 19 | 4 580 | 40 | 17 148 |
|  3 |    411 | 20 | 4 937 | 45 | 21 169 |
|  5 |    850 | 22 | 5 681 | 50 | 25 477 |
| 10 |  2 818 | 25 | 6 898 | 60 | 34 907 |
| 15 |  3 929 | 30 | 9 854 | 99 | 89 245 |

### 1.4 `ComfirmGainSoulPanel_CaculateGainSoulNum` (RVA `0x00B06E34`)

```c
int CaculateGainSoulNum(ComfirmGainSoulPanel *this, MethodInfo *method) {
    AchivementManager *am = Singleton<AchivementManager>::get_Instance();
    int reincTime   = am->GetNextReincarnationTime();   // # times reincarnated
    int allHeroSoul = am->GetAllHeroAeroSoul();          // base soul from all heroes
    int baseSoul    = ((ManagerOfManagers *)am)->[offset 0xe0]; // cached in manager
    int currentLevel = ...; // GameManager.hero.Level
    int result = reincTime * 10 + 200
               + (currentLevel + 1) * (int)((float)(baseSoul + allHeroSoul) * DAT_018ee73c);
    return (result > 19999) ? 20000 : result;
}
```

Formula:
```
souls = (reincTime * 10 + 200) + (currentLevel + 1) * ((baseSoul + allHeroSoul) * 0.01)
souls = min(souls, 20000)
```

- `reincTime`: reincarnation count (from `AchivementManager.GetNextReincarnationTime`).
- `allHeroSoul`: accumulated soul from hero aero skills.
- `baseSoul`: pulled from the manager's internal cache (offset 0xe0 in the manager struct). This is the base soul per level for the current reincarnation.
- Hard cap: **20,000 souls/run**.

### 1.5 `GameManager_GainMoney` (RVA `0x00B29F34`) — bonus from rewards

```c
int GameManager_GainMoney(GameManager *this, int value, GainMoneyType type, MethodInfo *method) {
    GameConst *gc = this->gameConst;
    Hero *h = this->hero;
    int iVar4 = (int)(((gc->每点魅力金币获取提升Addition + DAT_018fc900) * (double)h->Charm + 1.0) * (double)value);
    // Fishing / mining talent gives 1.5x multiplier if hero has the matching talent
    if ((type == GainMoneyType_Fishing || type == GainMoneyType_Mining) &&
        Hero_CheckHasTalents(h, matchingTalentName)) {
        iVar4 = (int)((float)iVar4 * 1.5);
    }
    h->Money += iVar4;
    this->TotalMoneyGain += iVar4;
    return iVar4;
}
```

Formula:
```
finalMoney = (int)(((每点魅力金币获取提升Addition + 0.005) * Charm + 1.0) * value)
if (source is 钓鱼 (fishing) or 打工 (mining) AND has matching talent): finalMoney *= 1.5
```

Notes:
- `DAT_018fc900 = 0.005` (so the bonus is `0.5% per Charm` even at base)
- Default Charm=10 → multiplier is `(0 + 0.005) * 10 + 1.0 = 1.05x` (5% bonus at default)
- Charm=20 with +20% talent (Addition=0.2) → `(0.2 + 0.005) * 20 + 1.0 = 5.1x` (5.1x bonus at high charm)
- **NOT a multiplier of `value` from `Hero.familyWealth`** despite the field being on Hero — familyWealth is unused in this formula (it was named "GainMoneyNoFamalyWealth" — the spelling bug is a hint that the original author meant the OTHER one without familyWealth, but the data shows the default `GainMoney` actually does use Charm).

### 1.6 `HeroLevel_AddExp` (RVA `0x00B39E00`) — XP reward formula

```c
int HeroLevel_AddExp(HeroLevel *this, int exp, MethodInfo *method) {
    Hero *h = GameManager.hero;
    double expGainImprove = Hero_GetAllExpGainImprove(h);   // sum of all exp gain talents/relics/equip
    int iVar2 = (int)((expGainImprove + 1.0) * (double)exp);
    this->CurrentExp += iVar2;
    if (this->CurrentLevel > oldLevel) {
        UIManager_ShowPanel(UpgradePanel, ...);
    }
    return iVar2;
}
```

Formula:
```
gainedExp = (int)((GetAllExpGainImprove + 1.0) * exp)
```

Notes:
- `GetAllExpGainImprove()` returns the sum of all exp-gain bonuses (talent `+10%` adds `0.1` to it).
- Default: gained = 1.0 * exp
- With +20% talent: gained = 1.2 * exp
- Hard cap not visible here (AddExp can level up, which then triggers `CaculateNewMaxExp` for next level's cap).

---

## 2. Monster level scaling

### 2.1 `Monster_SetLevel` (RVA `0x00A9F1C0`)

```c
void Monster_SetLevel(Monster *this, int level, MethodInfo *method) {
    this->Level = level;
    double atkBase = this->attack;
    double hpBase  = this->health;
    double atkExp = GameConst.怪物攻击每级属性提高Total;
    double hpExp  = GameConst.怪物生命每级属性提高Total;

    float powAtk = powf((float)level, (float)atkExp);
    float powHp  = powf((float)level, (float)hpExp);

    // (This+1) 因子:  level 1 -> 2x, level 5 -> 6x
    this->attack = atkBase * (GameManager.cruelLevel + (powAtk * 0.15 * (level+1)) / 10.0 + 0.9);
    this->health = hpBase  * (GameManager.cruelLevel + (powHp  * 0.15 * (level+1)) / 10.0 + 0.9);
    Creature_SetMaxHealth(this, this->health, ...);
}
```

Formula:
```
attack = baseAttack * (cruelLevel + (pow(level, atkExp) * 0.15 * (level+1)) / 10 + 0.9)
health = baseHealth * (cruelLevel + (pow(level, hpExp)  * 0.15 * (level+1)) / 10 + 0.9)
```

Where:
- `atkExp = GameConst.怪物攻击每级属性提高Addition + 1.35`
- `hpExp  = GameConst.怪物生命每级属性提高Addition + 1.35`
- `0.15` is `DAT_018eea08` (used for BOTH attack and health)
- `0.9`  is `DAT_018fc198`
- `cruelLevel` = `GameManager.cruelLevel` (Cruel World level, 0-10)
- The per-species `baseAttack` / `baseHealth` are set in `MonsterGenerater` (TODO: needs species data; placeholder for now is whatever the monster's "natural" stat is, which is a JSON-driven value — see `mb_battle_events_full.json` → `EnemyList` and `expReward` for back-derivation).

### 2.2 `Monster_ReRollBaseInfo` (RVA `0x00A9F158`)

(Not decompiled in this pass — small 100-byte method that re-rolls monster base stats when re-spawned. Should be a simple random within the species' `attackRange`/`healthRange` strings, which the todo already noted.)

---

## 3. Equipment generation

### 3.1 `AdventrueManager_generateEquipment` (RVA `0x00C3CDC0`)

Flow:
1. **Pick rarity**: weighted roll using table (see §3.3).
2. **Level boost**: 20% chance to bump `level` by 1 (via `RandomTool_CheckRandom(DAT_018eea14)` where `DAT = 0.2`).
3. **Main property**: `value = generateEquipmentProperty(effectiveLevel, model.MainProperty, MainProperty)`.
4. **Sub property**: `value = generateEquipmentProperty(effectiveLevel, model.SubProperty, SubProperty)`.
5. **Random properties**: pick `randomPropertyNum` from `model.RandomProperties` (filtered by `Hero.CheckPropertyAvalable` — keeps only properties the current hero profession can use), then compute each.
6. **Build** with `EquipmentBuilder` and return.

### 3.2 `AdventrueManager_generateEquipmentProperty` (RVA `0x00C3DB48`)

This is the core magnitude function. Has two output patterns:

**Pattern A — Defence (防御)**:
```
MainProperty: value = Random.Range((level*4+4) * 0.95, (level*4+4) * 1.05)
SubProperty:  value = Random.Range((level*2+2) * 0.95, (level*2+2) * 1.05)
Random:       value = Random.Range((level+1)   * 0.95, (level+1)   * 1.05)
```
Range: `±5%` around a base that scales linearly with level. Defence magnitude is the ONLY property using absolute level-based values.

**Pattern B — All other properties**:
```
value = Random.Range((level * minMul + maxAdd) * 0.95, (level * minMul + maxAdd) * 1.05)
```
Range: `±5%` around a per-property `level*minMul + maxAdd`.

The full `(property, slot) → (minMul, maxAdd)` table (re-extracted 2026-6-10 by decompiling `AdventrueManager_generateEquipmentProperty` @ 0x00C3DB48 — corrected from prior version which had wrong values for Crit/AtkSpeed/Counter Main):

| Property (cn) | Random (minMul, add) | Sub (minMul, add) | Main (minMul, add) |
|---|---:|---:|---:|
| 攻击 Attack | (0.02, 0.07) | (0.01, 0.025) | (0.04, 0.15) |
| 防御 Defence | (level+1)*0.95..1.05 | (level*2+2)*0.95..1.05 | (level*4+4)*0.95..1.05 |
| 暴击 CritRate | (0.005, 0.01) | (0.005, 0.02) | (0.01, 0.05) |
| 格挡 Block | (0.0075, 0.03) | (0.005, 0.015) | (0.015, 0.06) |
| 暴伤 CritDmg | (0.01, 0.05) | (0.01, 0.05) | (0.02, 0.1) |
| 生命 Health | (0.02, 0.1) | (0.04, 0.2) | (0.08, 0.4) |
| 闪避 Dodge | (0.005, 0.01) | (0.005, 0.02) | (0.01, 0.04) |
| 吸血 LifeSteal | (0.0025, 0.01) | (0.005, 0.02) | (0.01, 0.05) |
| 攻速 AtkSpeed | (0.006, 0.04) | (0.006, 0.02) | (0.01, 0.05) |
| 反击 Counter | (0.006, 0.02) | (0.008, 0.02) | (0.015, 0.05) |
| 溅伤 Splash | (0.005, 0.01) | (0.005, 0.02) | (0.01, 0.04) |
| 回复 Recovery | (0.35, 0.7) | (0.75, 1.0)*0.95..1.05 | (1.5, 2.0)*0.95..1.05 |
| 回复率 RecovRate | (0.35, 0.7) | (0.75, 1.0)*0.95..1.05 | (1.5, 2.0)*0.95..1.05 |

**Changes from prior table**: Crit Main `(0.005, 0.025)` → `(0.01, 0.05)`, AtkSpeed Main `(0.006, 0.025)` → `(0.01, 0.05)`, Atk Random `(0.01, 0.025)` → `(0.02, 0.07)`. All other values unchanged.

The ±5% is the **same ±5%** for every property (not configurable per slot) — it's the outer `dVar4 = 0.95, dVar8 = 1.05` constants at the top of `generateEquipmentProperty`. Recovery/RecovRate Sub & Main have an *inner* `(0.75, 1.0)` and `(1.5, 2.0)` *add* that the outer ±5% multiplies on top of.

**CritDmg** has the same Random + Sub values (both `(0.01, 0.05)`) — only Main is bigger.

**AtkSpeed** has 3 distinct values per slot — Random `(0.006, 0.04)`, Sub `(0.006, 0.02)`, Main `(0.01, 0.05)`.

Final formula: `value = Random.Range((level * minMul + maxAdd) * 0.95, (level * minMul + maxAdd) * 1.05)` — for non-Defence, non-Recovery properties.

### 3.3 Rarity weight table (5 entries: Common, Uncommon, Rare, Epic, Legendary)

Located in `AdventrueManager_generateEquipment` body:
```c
int worldDiff = GameManager.classConst;          // world difficulty level
List<int> weights = new List<int>();
weights.Add((rarityLevel * -25 + 85) - worldDiff);                 // [0] Common
weights.Add((worldDiff / 6) + rarityLevel * 4 + 28);               // [1] Uncommon
weights.Add(rarityLevel * 6 + 15);                                // [2] Rare
weights.Add((rarityLevel << 3) | 5);                               // [3] Epic
weights.Add(rarityLevel * 7);                                      // [4] Legendary
// Then: build [rarity] repeated weights[rarity] times (capped at 0 if negative).
// Random.Range(0, total) picks the rarity.
```

Note: `iVar14 >> 1 - iVar14 >> 0x1f` is the compiler's division-by-3 trick: `(n * 0x55555555) >> 32 = n/3`. So `(iVar14 / 3) / 2 = n/6`.

For `worldDifficulty = 0` (typical mid-game):
| Target rarity | Common% | Uncommon% | Rare% | Epic% | Legendary% |
|---:|---:|---:|---:|---:|---:|
| 0 (Common target) | 64% | 21% | 11% | 4% | 0% |
| 1 (Uncommon target) | 49% | 28% | 13% | 8% | 1% |
| 2 (Rare target) | 35% | 32% | 13% | 13% | 7% |
| 3 (Epic target) | 17% | 39% | 15% | 17% | 12% |
| 4 (Legendary target) | 0% | 44% | 18% | 18% | 18% |

(The negative Common weight at Legendary target is clamped to 0 in the inner loop, so the Legendary roll can never downgrade to Common.)

---

## 4. Shop prices (GroceryStore / PotionShop / FishStore)

### 4.1 The base formula

`Commody_InitCommody(string relicName)` @ `0x00B081B0`:
```c
Relic *r = AdventrueManager::GetRelicByName(name);
int total = GameConst.CommodyRarityValueTotal * (r->Rarity + 1);
int price;
if (r->relicType != 3) {
    price = total;                  // full price
} else {
    price = total / 4;              // quarter price (relicType == 3)
}
return new Commody { RelicName=name, Price=price, Amount=1, Discount=0.0 };
```

`CommodyRarityValueTotal` getter @ `0x00B2795C`:
```c
return this->CommodyRarityValueAddition + DAT_018fc908;  // DAT = 250.0
```

`Commody_GetPrice` @ `0x00B08190` (applies discount on top):
```c
return (int)((1.0 - this->Discount) * (double)this->Price);
```

Final:
```
finalPrice = (int)((1.0 - discount) * basePrice)
where basePrice = (250 + Addition) * (Rarity + 1)     [if relicType != 3]
              = ((250 + Addition) * (Rarity + 1)) / 4 [if relicType == 3]
```

### 4.2 Actual shop item lists (decoded from `PTR_StringLiteral_*`)

The todo had some misnamings; the actual binary uses these:

**GroceryStore (杂货店)** — 7 items + 1 special-discount:
| # | Name (cn) | English | Rarity | relicType | Computed price† |
|---|---|---|---:|---:|---:|
| 1 | 王国地图 | Kingdom Map | 1 (稀有) | 0 (食物) | 500 |
| 2 | 登山杖 | Trekking Pole | 1 | 0 | 500 |
| 3 | 睡袋 | Sleeping Bag | 2 (传说) | 0 | 750 |
| 4 | 精致便衣 | Refined Casual Wear | 1 | 0 | 500 |
| 5 | 旅行鞋 | Travel Shoes | 1 | 0 | 500 |
| 6 | 怀表 | Pocket Watch | 2 | 0 | 750 |
| 7 | 钓鱼竿 | Fishing Rod | 1 | 0 | 500 (× 50% = **250**) |

(7th item is created with `InitCommody_1(name, 0.5, ...)` — 50% discount built into the item itself, separate from the store's `Discount` field which is `1.0` for GroceryStore.)

**PotionShop (药剂店)** — 3 items:
| # | Name (cn) | English | Rarity | relicType | Computed price† |
|---|---|---|---:|---:|---:|
| 1 | 攻击药剂 | Attack Potion | 1 | 1 (药物) | 500 |
| 2 | 敏捷药剂 | Agility Potion | 1 | 1 | 500 |
| 3 | 忍耐药剂 | Endurance Potion | 1 | 1 | 500 |

(Note: the todo mentioned "防御药剂 Defence Potion" but the binary actually has "忍耐药剂 Endurance Potion". Functionally similar (defence+?) but the name is different.)

**FishStore (渔具店)** — 2 items, both with built-in 30% discount:
| # | Name (cn) | English | Estimated rarity | Computed price† |
|---|---|---|---:|---:|
| 1 | 玫瑰鱼竿 | Rose Fishing Rod | 2 | 750 → **525** |
| 2 | 钢石鱼钩 | Steel Stone Hook | 2 | 750 → **525** |

(Discount is `DAT_018fc1a4 = 0.7` — applied via `InitCommody_1(name, 0.7, ...)`. The `1.0 - 0.7 = 0.3` gives the 30% off the final price. Note: the todo mentioned "木质钓鱼竿" and "钢制钓鱼竿" — the actual items are "玫瑰鱼竿 Rose Fishing Rod" and "钢石鱼钩 Steel Stone Hook".)

† Price assumes `CommodyRarityValueAddition = 0` (no talent bonus). Add `Addition * (Rarity+1)` per talent.

### 4.3 Store refresh / stock

`Store.InitStore()` is called once at game start (no `TurnBegin` re-roll in the GroceryStore/PotionShop bodies decompiled). `FishStore.InitStoreAtTurnBeggin()` @ `0x00B274D8` is empty in the decompile (no body) — likely a hook for future per-turn restock but currently a no-op. **Verdict**: shop stock is fixed per game start; no per-turn refresh.

---

## 5. Cruel World modifiers (item #9 in todo)

### 5.1 What was found

`CrulWordToggle` is a `MonoBehaviour` (the toggle UI panel), NOT the modifier table. It just stores the cruelty level and updates the UI text. The actual monster/player effect comes from `GameManager.cruelLevel` being added into the formulas.

### 5.2 Where `cruelLevel` is read

Found three places (all in formulas we already extracted):
1. **Hero attack** (`Hero_CaculateBaseAttack`): `+ cruelLevel` per Power point.
2. **Monster attack/health** (`Monster_SetLevel`): `* cruelLevel` as a multiplier on the formula term.
3. **Toggling**: `CrulWordToggle_ChangeCrulWordStat` @ `0x00B0E364` — sets `GameManager.cruelLevel` to the chosen level (1, 3, 5, 7, 10) and shows a "开启残酷世界..." (enabling cruel world) tip.

### 5.3 What Cruel World level does (extracted)

The Cruel World level adds:
- `+N` to `GameManager.cruelLevel` (where N is the selected CW level: 1/3/5/7/10).
- This level is then **directly added** to hero attack (per point of Power) and **multiplied into** monster attack/health scaling.

So:
- **Hero attack** = `(...Addition + 0.4 + cruelLevel) * Power + 5` — at CW=10, hero attack gets `+10 * Power` extra (so a hero with 50 Power gets +500 attack).
- **Monster attack** = `base * (cruelLevel + (level-based curve) + 0.9)` — at CW=10, monster attack gets multiplied by `(10 + (curve))` instead of `(0 + (curve))`.

### 5.4 What's NOT in the binary

I could NOT find a `GetModifier(int level)` function or a per-level table of "Cruel World effects" (e.g. "CW level 5 = +50% gold, +30% XP"). Looking at the code, the cruelty level only affects:
- Hero attack (direct add per Power)
- Monster attack/health (direct add to multiplier)

**Hypothesis**: the loot/reward bonuses for Cruel World are NOT coded as data — they're hardcoded into other functions I haven't fully traced (e.g. the battle reward function, the XP gain function). These would be the next pass: decompile `BattleEnd` (Hero) and the `expReward`/`goldReward` settlement code.

### 5.5 Tip string (decoded)

`PTR_StringLiteral_u5F00u542Fu6B8Bu9177u4E16u754Cu5F00u5173u540EuFF0Cu602Au7269u5C06u968Fu7740u4E16u754Cu7B49u7EA7u63D0u9AD8u53D8u5F97u66F4u5F3Au5927uFF0Cu51FBu8D25u654Cu4EBAu83B7_01f79bf8`:
> 开启残酷世界开关后,怪物将随着世界等级提高变得更强,打败敌人获...
> ("After enabling Cruel World, monsters become stronger as the world level rises, defeating enemies yields..." — truncated by Ghidra symbol capture, the full string continues in the binary's `.rodata`)

---

## 6. All discovered .data constants

These are the magic numbers in the formulas, with their decoded values:

| Address | Type | Value | Used in |
|---|---|---:|---|
| `0x018ee9c0` | double | 0.4 | Hero per-Power attack (in `每点力量攻击力Total`) |
| `0x00B27820` | literal | 0.5 | Hero per-Constitution defence (in `每点体质防御力Total`) |
| `0x018ee74c` | float | 100.0 | XP curve multiplier `MaxExp = level^1.25 * 100` |
| `0x018ee73c` | float | 0.01 | Soul gain multiplier |
| `0x018eea08` | float | 0.15 | Monster attack/health level speed constant |
| `0x018fc198` | float | 0.9 | Monster attack/health base constant |
| `0x018fc8e8` | double | 1.35 | Monster attack exponent base |
| `0x018fc908` | double | 250.0 | Shop price base (multiplied by Rarity+1) |
| `0x018eea14` | float | 0.2 | 20% chance to upgrade equipment level by 1 |
| `0x018fc1a4` | float | 0.7 | FishStore built-in discount (1.0 - 0.7 = 30% off) |
| `0x018fc1a8` | double | 0.01 | Atk Sub minMul |
| `0x018fc1d8` | double | 0.04 | Atk Main minMul |
| `0x018fc900` | double | 0.005 | Default cirt/dodge minMul |
| `0x018fc910` | double | 0.02 | Atk Random / Recovery main minMul |
| `0x018fda18` | double | 0.05 | Recovery random maxAdd |
| `0x018fda28` | double | -0.03 | Crit main maxMul (negative — looks like a bug) |
| `0x018fda30` | double | 0.95 | Defence sub minMul |
| `0x018fda38` | double | 1.05 | Defence sub maxMul |
| `0x018fda40` | double | 0.95 | Defence main minMul |
| `0x018fda48` | double | 1.05 | Defence main maxMul |
| `0x018fda50` | double | 0.35 | Recovery sub minMul |
| `0x018fda58` | double | 0.7 | Recovery sub maxAdd |
| `0x018fda60` | double | 0.008 | Counter main minMul |
| `0x018fda68` | double | 0.015 | Counter maxMul / Block sub minMul |
| `0x018fda70` | double | 0.006 | AttackSpeed sub minMul |
| `0x018fda78` | double | 0.0025 | LifeSteal random minMul |
| `0x018fda80` | double | 0.08 | Health random minMul |
| `0x018fda88` | double | 0.0075 | Block random minMul |
| `0x018fda90` | double | 0.06 | Block main maxAdd |
| `0x018fda98` | double | 0.07 | Atk random maxAdd |
| `0x018fd230` | double | 0.03 | Crit sub maxAdd |
| `0x018ee9c8` | double | 0.1 | Crit damage / Recovery main minMul |
| `0x018ee9d0` | double | 0.2 | Health main minMul |
| `0x018ee9d8` | double | 0.15 | Atk main maxAdd |
| `0x018ee9e0` | double | 0.025 | Atk sub maxAdd (NOTE: the Atk Random case falls through with the Sub values due to `&&` short-circuit) |

Note: the values in the per-property table come from these constants; the table in §3.2 was derived by re-tracing the C# `&&` short-circuit + comma-expression idiom in the decompiled switch.

---

## 7. Methods decompiled in this pass

| Method | RVA | Purpose |
|---|---|---|
| `Hero_CaculateBaseAttack` | `0x00B36668` | Hero attack formula |
| `Hero_CaculateBaseDefence` | `0x00B36974` | Hero defence formula |
| `HeroLevel_CaculateNewMaxExp` | `0x00B39D30` | XP curve |
| `ComfirmGainSoulPanel_CaculateGainSoulNum` | `0x00B06E34` | Soul gain formula |
| `AdventrueManager_generateEquipment` | `0x00C3CDC0` | Equipment orchestrator (rarity roll + property dispatch) |
| `AdventrueManager_generateEquipmentProperty` | `0x00C3DB48` | Per-property magnitude table |
| `AdventrueManager_getRandomProperty` | `0x00C3D8EC` | Random property picker (filters by profession) |
| `Commody_GetPrice` | `0x00B08190` | Price with discount |
| `Commody_InitCommody` | `0x00B081B0` | Price from relic rarity × 250 |
| `Commody_InitCommody_1` | `0x00B082E0` | Price with built-in discount (used by FishStore) |
| `GroceryStore_InitStore` | `0x00B36028` | 7 items + 1 discount item |
| `PotionShop_InitStore` | `0x00AA9324` | 3 items |
| `FishStore_InitStore` | `0x00B273D8` | 2 items with 30% discount |
| `FishStore_InitStoreAtTurnBeggin` | `0x00B274D8` | (empty body, no per-turn restock) |
| `CrulWordToggle_ChangeCrulWordStat` | `0x00B0E364` | Toggle handler, sets `GameManager.cruelLevel` |
| `CrulWordToggle_ShowSelectLevel` | `0x00B0E460` | Level picker UI handler |
| `CrulWordToggle_InitCrulWorldToggle` | `0x00B0E30C` | Init (sets initial level=1) |
| `Monster_SetLevel` | `0x00A9F1C0` | Monster level scaling (atk/hp) |
| `GameConst_get_每点力量攻击力Total` | `0x00B277C4` | (confirms `+0.4` base) |
| `GameConst_get_每点体质防御力Total` | `0x00B27820` | (confirms `+0.5` base) |
| `GameConst_get_怪物攻击每级属性提高Total` | `0x00B27830` | (confirms `+1.35` exponent base) |
| `GameConst_get_CommodyRarityValueTotal` | `0x00B2795C` | (confirms `+250` price base) |

---

## 8. Open items / what's still unknown

- **`GameConst` initial `Addition` values** (line 49995+ in `il2cpp.cs`): these are the per-talent / per-relic bonuses that get added into the `Total` getters. The base values are all 0.0 (i.e. uninitialized doubles), so the actual numbers come from JSON/relic config. For the rebuild, treat them as 0 unless the JSON provides them.
- **Monster species base stats** (per `MonsterSpecies` enum): need to decompile `MonsterGenerater` body or read the `mb_battle_events_full.json` `EnemyList` rewards as proxy. Out of scope for this pass.
- **Battle rewards scaling** (XP, gold): need to decompile `Hero.BattleEnd` and the `AdventrueManager.AwardBattle` (or equivalent). Out of scope for this pass.
- **Cruel World reward bonuses** (per-level): NOT FOUND in the decompiled code. Either encoded in a function I haven't traced, or applied implicitly through other scaling (e.g. the existing `+0.4` per Power already includes a CW=0 baseline, so a CW=10 player just has `+10` added). Recommend Frida hook to confirm.
- **Equipment pool structures**: the todo's "WeaponSettingJS.json" still has the 26 affix pool structures — these are static config, not formulas. They map to `model.RandomProperties` in `AdventrueManager_generateEquipment`.

---

## 9. Quick start for the web rebuild

```js
// Hero attack (at level L with Power P, Constitution C, Cruel World level CW):
attack = (每点力量攻击力Addition + 0.4 + CW) * P + 5;
defence = (每点体质防御力Addition + 0.5) * C;

// XP to next level (at level L):
xpToNext = Math.floor(Math.pow(L, 1.25) * 100);

// Soul per ad-watched run (reincarnation R, currentLevel L, baseSoul B, allHeroSoul A):
souls = R * 10 + 200 + (L + 1) * Math.floor((B + A) * 0.01);
if (souls > 20000) souls = 20000;

// Monster stats at level L with base A0/H0, Cruel World CW:
// (exp = 怪物攻击每级属性提高Addition + 1.35, both atk and hp use same exp base)
attack = A0 * (CW + Math.pow(L, exp) * 0.15 * (L+1) / 10 + 0.9);
health = H0 * (CW + Math.pow(L, exp) * 0.15 * (L+1) / 10 + 0.9);

// Shop price for a relic with rarity R (0-3), relicType T (0=食物, 1=药物, 3=special):
const basePrice = (250 + Addition) * (R + 1);
const price = (T === 3) ? Math.floor(basePrice / 4) : basePrice;
// Apply per-item discount (fish rod = 0.5, fish store = 0.7, others = 0.0):
const finalPrice = Math.floor((1 - discount) * price);
```

---

## 10. Wave 6: Battle reward formulas (closes todo item A1)

### 10.1 The reward calc is in `AdventruePanel_c__DisplayClass32_0__WinBattle_b__8` @ 0x00C466C8

Decompiled key section (exp):
```c
iVar3 = GameConst_get_经验获取基数Total(...);   // = 经验获取基数Addition + 5
iVar4 = AdventruePanel_getEnemyLevel(...);       // = AreaLevel + currentExploreStat - 1
iVar11 = iVar3 * iVar11 * (iVar4 + 1);            // expReward = baseExp * this.ExpReward * (level+1)
iStack_34 = HeroLevel_AddExp(this_00, iVar11);    // gained exp (with talent mods)
```

Decompiled key section (gold):
```c
iVar3 = AdventruePanel_getEnemyLevel(...);
iVar4 = GameConst_get_金币获取基数Total(...);   // = 金币获取基数Addition + 8
iVar11 = (int)(((float)iVar3 * DAT_018ee738 + 1.0) * (float)GoldReward * (float)iVar4);
local_38 = GameManager_GainMoney(this_01, iVar11, GainMoneyType_冒险, ...);
```

`DAT_018ee738` = `0.3c23d70a3dcccccd` (double) = `0.01`.

**Final reward formulas:**
```js
// EXP reward:
expGained = (经验获取基数Addition + 5) * this.ExpReward * (enemyLevel + 1)
            * (GetAllExpGainImprove + 1.0)   // from HeroLevel_AddExp

// Gold reward:
goldGained = floor((enemyLevel * 0.01 + 1.0) * this.GoldReward * (金币获取基数Addition + 8))
             // then *Charm-based bonus from GainMoney
             // then *1.5 if source is 钓鱼/打工 + matching talent
```

Defaults: `经验获取基数Addition = 0` → base 5. `金币获取基数Addition = 0` → base 8.

### 10.2 **Cruel World has NO reward multiplier** (closes todo A1)

I traced every `cruelLevel` read in the binary. The only effects are:
1. `Hero_CaculateBaseAttack` (0x00B36668): `attack = (Addition + 0.4 + cruelLevel) * Power + 5` — adds `+cruelLevel` per Power.
2. `Monster_SetLevel` (0x00A9F1C0): `attack = base * (cruelLevel + (level-based curve) + 0.9)` — multiplies the curve by `(cruelLevel + ...)`.
3. The toggle writes `GameManager.cruelLevel` (offset `+0x18` from `Managers[0]`) and shows a tip.

**`GameManager_GainMoney`, `HeroLevel_AddExp`, `CaculateGainSoulNum` do NOT use `cruelLevel` at all.** The reward multipliers found in the reward calc path do not reference it. The `currentExploreStat` (which affects `getEnemyLevel()`) is set by `AdventrueMainMenu_AddExploreDepth` based purely on `(currentDepth / maxDepth)`, not on CW.

**Conclusion**: The Cruel World toggle makes monsters stronger (atk/hp scale by `+cruelLevel`) but does NOT increase gold/exp/soul rewards. The same battle at CW=10 gives the same rewards as CW=0 — the player just earns less effectively because the battles are harder.

---

## 11. Wave 6: All 58 monster base stats (closes todo item A2)

Decompiled `FUN_00aa0008` (the monster construction function called by `MonsterGenerater__ctor`) — it builds all 58 monsters via `Monster.Builder` calls. Note: the 48 "closure" functions listed in the todo (`MonsterGenerater_c___ctor_b__5_0` etc.) are event handler hooks (death/attack callbacks), NOT the monster builders themselves. The actual base stat definitions are inline in `FUN_00aa0008`.

The 4 string params of `SetMonsterBaseBattleInfo` are (in order): **attack, defence, health, attackInterval**.

Full table (attackRange/defenceRange/healthRange/attackInterval as `low_high` strings):

| # | Name (zh) | Species | Rank | AtkRange | DefRange | HPRange | AtkInterval | CritOverride |
|---:|---|---|---|---:|---:|---:|---:|---:|
| 1 | 哥布林 | Beast | Normal | 6-7 | 0-0 | 80-90 | 0.5-0.6 | — |
| 2 | 史莱姆 | Beast | Normal | 4-5 | 0-0 | 60-70 | 0.5-0.6 | — |
| 3 | 哥布林队长 | Beast | Elite | 15-19 | 0-0 | 150-180 | 0.5-0.6 | — |
| 4 | 野猪 | Beast | Normal | 13-15 | 0-0 | 60-70 | 0.5-0.6 | — |
| 5 | 野猪首领 | Beast | Elite | 22-24 | 0-0 | 160-170 | 0.5-0.6 | — |
| 6 | 哥布林弓箭手 | Beast | Normal | 9-11 | 0-0 | 100-110 | 0.6-0.7 | 0.20 |
| 7 | 巨型史莱姆 | Beast | Elite | 16-18 | 0-0 | 200-240 | 0.5-0.6 | — |
| 8 | 哥布林国王 | Beast | Boss | 45-50 | 0-0 | 700-800 | 0.5-0.6 | — |
| 9 | 阿尔塔 | Human | Normal | 20-23 | 0-0 | 250-260 | 0.5-0.6 | — |
| 10 | 遗迹守卫者 | Beast | Normal | 20-22 | 0-0 | 250-280 | 0.5-0.6 | — |
| 11 | 骷髅 | Bone | Normal | 15-18 | 0-0 | 180-190 | 0.5-0.6 | — |
| 12 | 僵尸 | Undead | Normal | 15-18 | 0-0 | 140-150 | 0.5-0.6 | — |
| 13 | 骷髅射手 | Bone | Normal | 15-18 | 0-0 | 140-150 | 0.6-0.7 | 0.40 |
| 14 | 吸血鬼 | Undead | Elite | 50-55 | 0-0 | 300-350 | 0.6-0.7 | — |
| 15 | 骷髅将军 | Bone | Elite | 30-35 | 0-0 | 250-300 | 0.5-0.6 | — |
| 16 | 吸血蝙蝠 | Bone | Normal | 15-16 | 0-0 | 160-180 | 0.5-0.6 | — |
| 17 | 大幽灵 | Undead | Elite | 40-50 | 0-0 | 5-6 | 0.5-0.6 | — |
| 18 | 王室怨灵 | Undead | Boss | 33-35 | 0-0 | 20-23 | 0.5-0.6 | — |
| 19 | 地精 | Beast | Normal | 12-14 | 0-0 | 70-80 | 0.5-0.6 | — |
| 20 | 地精火枪手 | Beast | Normal | 10-12 | 0-0 | 100-125 | 0.5-0.6 | 0.20 |
| 21 | 岩石怪 | Beast | Normal | 20-23 | 0-0 | 140-150 | 0.5-0.6 | — |
| 22 | 盗宝地精 | Beast | Normal | 14-16 | 0-0 | 100-110 | 0.5-0.6 | — |
| 23 | 地精科学家 | Beast | Elite | 20-22 | 0-0 | 200-210 | 0.5-0.6 | — |
| 24 | 地龙幼体 | Beast | Elite | 30-35 | 0-0 | 250-230 | 0.5-0.6 | — |
| 25 | 巨型沙虫 | Beast | Elite | 35-40 | 0-0 | 300-320 | 0.5-0.6 | — |
| 26 | 地龙王奥凯 | Beast | Boss | 50-60 | 0-0 | 1000-1100 | 0.5-0.6 | — |
| 27 | 小精灵 | Beast | Normal | 10-12 | 0-0 | 100-110 | 0.5-0.6 | — |
| 28 | 树精 | Beast | Normal | 20-21 | 0-0 | 150-160 | 0.5-0.6 | — |
| 29 | 堕落精灵 | Beast | Normal | 22-23 | 0-0 | 150-160 | 0.5-0.6 | — |
| 30 | 女精灵 | Beast | Normal | 10-15 | 0-0 | 200-210 | 0.5-0.6 | — |
| 31 | 精灵骑士 | Beast | Elite | 35-40 | 0-0 | 400-420 | 0.6-0.7 | 0.30 |
| 32 | 巨人 | Beast | Elite | 90-96 | 0-0 | 450-500 | 0.2-0.25 | — |
| 33 | 古树守卫 | Beast | Elite | 35-40 | 0-0 | 350-400 | 0.5-0.6 | — |
| 34 | 卡拉·堕落的精灵女王 | Beast | Boss | 60-65 | 0-0 | 700-800 | 0.5-0.6 | — |
| 35 | 半兽人 | Beast | Normal | 18-20 | 0-0 | 180-190 | 0.5-0.6 | — |
| 36 | 兽人战士 | Beast | Normal | 22-24 | 0-0 | 250-260 | 0.5-0.6 | — |
| 37 | 兽人巫医 | Beast | Normal | 12-14 | 0-0 | 170-180 | 0.5-0.6 | — |
| 38 | 双头猎犬 | Beast | Normal | 25-28 | 0-0 | 200-210 | 0.5-0.6 | — |
| 39 | 狂兽人 | Beast | Elite | 70-80 | 0-0 | 300-350 | 0.5-0.6 | — |
| 40 | 地狱犬 | Beast | Elite | 50-60 | 0-0 | 500-550 | 0.7-0.8 | — |
| 41 | 兽人行刑官 | Beast | Elite | 80-90 | 0-0 | 400-450 | 0.6-0.7 | — |
| 42 | 卡里摩多·剑圣 | Beast | Boss | 70-80 | 0-0 | 1000-1100 | 0.7-0.8 | — |
| 43 | 牛头人战士 | Beast | Normal | 12-13 | 0-0 | 130-140 | 0.5-0.6 | — |
| 44 | 牛头将军 | Beast | Normal | 40-45 | 0-0 | 620-650 | 0.5-0.6 | — |
| 45 | 混沌魔力 | Beast | Normal | 11-13 | 0-0 | 50-60 | 0.5-0.6 | — |
| 46 | 魔神护卫 | Beast | Normal | 15-18 | 0-0 | 150-160 | 0.5-0.6 | — |
| 47 | 魔神侍从 | Beast | Normal | 17-19 | 0-0 | 140-150 | 0.5-0.6 | — |
| 48 | 魔神子体 | Beast | Elite | 25-27 | 0-0 | 240-260 | 0.5-0.6 | — |
| 49 | 上古魔神（残缺体） | Beast | Boss | 35-40 | 0-0 | 400-450 | 0.5-0.6 | — |
| 50 | 王国士兵 | Beast | Normal | 13-15 | 0-0 | 180-190 | 0.5-0.6 | — |
| 51 | 王国弓箭手 | Beast | Normal | 15-16 | 0-0 | 150-160 | 0.5-0.6 | 0.20 |
| 52 | 王国骑士 | Beast | Elite | 20-21 | 0-0 | 13-15 | 0.5-0.6 | — |
| 53 | 卡拉多格 | Beast | Boss | 70-80 | 0-0 | 1000-1100 | 0.6-0.7 | — |
| 54 | 魔将亲卫 | Beast | Elite | 40-50 | 0-0 | 200-220 | 0.6-0.7 | — |
| 55 | 卜里奥 | Beast | Boss | 80-90 | 0-0 | 700-800 | 0.6-0.7 | — |
| 56 | 魔王眷属 | Beast | Elite | 40-50 | 0-0 | 13-15 | 0.6-0.7 | — |
| 57 | 魔王（史莱姆形） | Beast | Boss | 80-90 | 0-0 | 1100-1200 | 0.6-0.7 | — |
| 58 | 魔王（史莱姆形） | Beast | Boss | 110-120 | 0-0 | 2000-2200 | (truncated) | — |

**Key observations:**
- **All monsters have 0 defence** (DefRange always 0-0). They rely on dodge/block, not raw defence stat. The damage formula uses 0 as the victim's defence in `tryDoDamage` for ALL fights.
- **No Dragon species, no Character rank** in the decompiled builders.
- **Special HP overrides** (5-6 for 大幽灵, 20-23 for 王室怨灵, 13-15 for 王国骑士/魔王眷属) — these are intentional low base HP, probably because the level-scaling formula is overridden for these boss types (likely the multi-stage final bosses which use different base HP from the per-battle EnemyList).
- **Crit overrides**: 4 monsters with custom crit rates — 哥布林弓箭手 0.20, 骷髅射手 0.40, 地精火枪手 0.20, 精灵骑士 0.30, 王国弓箭手 0.20.

---

## 12. Wave 6: Condition system for endings (closes todo item B2)

`EndingEventDirector` is a thin coordinator — actual ending decision goes through `Condition_CheckCondition` (`Condition::Condition_CheckCondition` @ 0x00B08A7C). The `conditionType` enum (16 types total):

| Type | Check | Format | Example |
|---:|---|---|---|
| 0 | Hero stat ≥ value (or `金钱:N` consumes N gold) | `Name:Value` | `力量:50` (Power >= 50) |
| 1 | Owns named relic | `RelicName` | `王国圣剑` |
| 2 | Story turning point value equals expected | `TurningPoint:ExpectedStat` | `slowLife:Completed` |
| 3 | Character relationship VALUE ≥ N | `CharName:N` | `Lumnia:50` |
| 5 | Weighted random (based on age range) | `min~max` | `20~30` |
| 6 | Hero age in range | `min~max` | `20~30` |
| 7 | Has NOT escaped death (no cruelLevel) | — | (the "True" ending check) |
| 8 | Current year is X | `Year` | `5` |
| 9 | Current turn in range | `min~max` | — |
| 10 | Ads count < N | `N` | — |
| 11 (0xb) | Character is married (stat == 1) | `CharName` | `Lumnia` (the "Slow Life" ending) |
| 12 (0xc) | Some EventManager flag | — | — |
| 13 (0xd) | EvilCrystal is full | — | — |
| 14 (0xe) | Consume N action points | `Name:N` | — |
| 15 (0xf) | Character relationship LEVEL ≥ N | `CharName:N` | — |

The 5 endings (per `rebuild_guide.md` §6 + `extracted_game_data.md`):
- **Slow Life** (慢生活): type 11 — `Lumnia` (married to Lumnia) + side condition
- **Noble** (成为贵族): type 11 — `Charlotte` (married to Charlotte) + side condition
- **Rebuild** (重建人类家园): type 2 — `rebuildHuman:Completed` turning point
- **Strongest** (天下无敌): type 2 — `strongest:Completed` turning point (gated by 击败卡拉多格)
- **True** (真正的勇者): type 7 — `hasDeathEscape == false` (i.e. never used the death-escape)

The turning point IDs (`rebuildHuman`, `strongest`, `slowLife`, etc.) are defined in the XNode graphs and are looked up by name at runtime via `EventManager.GetStoryTurningPoint(name)`. The actual strings live in `xnode_texts.json` and the data files.

---

## 13. Wave 6: Damage formula (closes todo item C6)

`BattleCommander_tryDoDamage` @ 0x00CF0E88 (decompiled):

```c
double attackerAtk = attacker->get_battleAttack();   // includes all buffs/relics
double victimDef  = victim->get_battleDefence();
double attackerCrit = attacker->get_battleCritical();
double victimBlock = victim->get_battleBlockingRate();
double critDmg = attacker->criticalDegree;            // separate property

float defFactor = powf(DAT_018fe764, victimDef / DAT_018fe760);
// DAT_018fe764 = 0x3f81eb85 = 1.0147... (K)
// DAT_018fe760 = 0xbfa66666 = -1.3 (X — note: this is the divisor, NEGATIVE)

double reduction = (1.0 / (defFactor + 1.0)) - 0.5;
double damage = attackerAtk - attackerAtk * reduction * 1.5;
//              = attackerAtk * (1.0 - 1.5 * reduction)

if (Random.value < attackerCrit) *isCritical = true;
if (Random.value < victimBlock)  *isBlock = true;

if (*isCritical) damage *= (critDmg + 2.0);    // default critDmg=0 → 2.0x base crit
if (damage < 1.0) damage = 1.0;
if (*isBlock) damage *= (1.0 - blockDmgReduction);  // default 0.4 → 60% damage on block
return damage;
```

Constants: `blockDmgReduction = u683Cu6321u51CFu4F24u7387Addition + 0.4` (default 0.4).

**Damage reduction curve** (per def value, no crit, no block):
| Defence | Damage received (% of atk) |
|---:|---:|
| 0 | 100% |
| 10 | 96% |
| 50 | 79% |
| 100 | 62% |
| 200 | 44% |
| 500 | 25% |

**Crit multiplier** is `(critDmg + 2.0)` — with `critDmg` from equipment/talents as a flat 0.X value (so +20% critDamage = 2.2x total, not 1.2x).

**Block** reduces damage to 60% by default — so blocking is a *much* stronger defense than the 38% def-cut at 100 def.

**`Creature_LoseHealth`** @ 0x00BDDC: simply `health = max(0, health - damage)`. No dodge applied here (dodge is applied in `tryDoDamage` via the `IsBlock` path, not as a separate `IsDodge` — confirmed by `BattleCommander_Attack_d_46_MoveNext` which checks `AttackData.IsBlock` and `AttackData.IfCounterattack`).

---

## 14. Wave 6: Talent roll rarity weights (closes todo item C5)

`AchivementManager_GetRandomHeroTalent` @ 0x00E8F0D4 (decompiled):

Input: `buffNum = (gameOverTime + rollCount) * 4` from `HeroTalentBox_DORoll`. The gameOverTime is the lifetime of the current run (0, 1, 2...), rollCount is how many times you've rolled this session (0, 1, 2...).

Per-rarity weight (as a function of `buffNum`):
```c
weight[0] (Common)    = 60 - 2 * buffNum
weight[1] (Uncommon)  = 50 - buffNum
weight[2] (Rare)      = 40 - floor(buffNum / 2)    // 0x28 - (buffNum/2)
weight[3] (Epic)      = 20 + buffNum / 3
weight[4] (Legendary) = 10 + buffNum
```

Then a 5-element array is built with each rarity repeated `max(0, weight[i])` times, and `Expand.GetRandomOne` picks uniformly.

**Probability distribution** for various `buffNum` values:
| buffNum (= (lifetime+roll) * 4) | Common | Uncommon | Rare | Epic | Legendary |
|---:|---:|---:|---:|---:|---:|
| 4 (start, roll 1) | 30% | 27% | 22% | 12% | 8% |
| 8 (start, roll 2) | 25% | 24% | 21% | 13% | 11% |
| 20 (mid-game, roll 4) | 14% | 18% | 18% | 15% | 18% |
| 50 (late-game) | 0% | 0% | 14% | 32% | 54% |
| 80 (very late) | 0% | 0% | 0% | 34% | 66% |

**Soul cost** (`HeroTalentBox_getConsumSoulNum` @ 0x00B3A794):
```c
soulCost = rollCount * 70 - 40;   // capped at 250
```
- Roll 1: 30 souls
- Roll 2: 100 souls
- Roll 3: 170 souls
- Roll 4: 240 souls
- Roll 5+: 250 (capped)

Rolls only consume if `gameOverTime > 0` (you've reached at least the 2nd run). First-run rolls are free.

---

## 15. Wave 6: EvilCrystal progression (closes todo item B4)

`EvilCrystal` class fields (decompiled from `EvilCrystal_AllResetEvilCrystal` @ 0x00B47278):
- `IsActive` (bool)
- `IsGameVictory` (bool)
- `MaxValue` = 100 (hardcoded)
- `CurrentEvilCrystalLevel` (int) — the upgrade tier
- `CurrentValue` (int) — XP toward next level
- `CurrentEvilCrystalEvent` (string) — name of current active story
- `CurrentEvilCrystalStoryLine` (StoryLine ref) — the live story being progressed

Methods:
- `EvilCrystalUpgrade()` / `LevelUp()`: `level++; CurrentValue = 0;` (identical implementations)
- `EvilCrystalGrow()`: `CurrentValue = min(CurrentValue + EvilCrystalGrowSpeedTotal, MaxValue)` AND pushes the current `CurrentEvilCrystalStoryLine` to the active story list (so the story "starts running" each tick).
- `EvilCrystalValueChange(v)`: `CurrentValue = max(0, min(CurrentValue + v, MaxValue))` — used for explicit value changes.
- `IsFull()`: `MaxValue <= CurrentValue` (i.e. >= 100).

**The crystal progress is always 100 points per level** (MaxValue hardcoded). Each `Grow` adds `EvilCrystalGrowSpeedTotal` (from `GameConst`) — this is a constant per run, not level-dependent.

**What each level gives** (the rewards) is NOT in this binary — they're in the 48 artifacts from `artifact_complete.md` and the `RelicSettingJS.json` `AcquisitionMethod: Special` + `AcquisitionLimit: Once` entries. The crystal just gates the unlocks via XNode events.

**`AllResetEvilCrystal`** (the Reset button): clears everything to default (level 0, value 0, MaxValue 100, no active story, no victory).

---

## 16. Wave 6: `Hero.CheckPropertyAvalable` (closes todo item C4)

`Hero::Hero_CheckPropertyAvalable` @ 0x00B37B68 (decompiled — 24 lines, trivial):
```c
bool CheckPropertyAvalable(CreatureBattleProperty prop) {
    foreach (var p in this.ActiveCreatureBattleProperty) {
        if (p == prop) return true;
    }
    return false;
}
```

**There is NO profession-based filtering in the code.** The check is purely a list-membership test on the hero's `ActiveCreatureBattleProperty` list. Profession-specific equipment (e.g. "Hunter only" relics) would be implemented by populating different lists for different professions at hero-creation time — but no such list-picker exists in the binary either.

**Conclusion**: Hunter profession is just a data-design idea, not implemented. If it were added, it would only require populating different `ActiveCreatureBattleProperty` lists per profession — no binary change needed for the filter itself.

---

## 17. Wave 6: Methods decompiled in this pass

| Method | RVA | Purpose |
|---|---|---|
| `AdventruePanel_WinBattle` | `0x00C43B80` | Battle win UI (tier text selection) |
| `AdventruePanel_c__DisplayClass32_0__WinBattle_b__8` | `0x00C466C8` | **Battle reward calc (exp + gold)** |
| `AdventrueManager_generateEquipmentProperty` | `0x00C3DB48` | Equipment property magnitude (re-verified) |
| `MonsterGenerater__ctor` | `0x00A9FF84` | Empty ctor, calls cctor |
| `FUN_00aa0008` (called from cctor) | `0x00AA0008` | **All 58 monster definitions inline** |
| `Monster_Builder_SetMonsterBaseBattleInfo` | `0x00A9F670` | Battle info (atk, def, hp, atkInterval) |
| `AdventruePanel_getEnemyLevel` | `0x00C445A4` | `AreaLevel + currentExploreStat - 1` |
| `AdventrueMainMenu_AddExploreDepth` | `0x00C39B18` | Updates `currentExploreStat` based on depth% |
| `AdventrueMainMenu_AddExploreDegree` | `0x00C39848` | Footstep-based explore gain |
| `GameConst_get_经验获取基数Total` | `0x00B278C4` | Exp reward base (Addition + 5.0) |
| `GameConst_get_金币获取基数Total` | `0x00B278D8` | Gold reward base (Addition + 8) |
| `GameConst_get_u683Cu6321u51CFu4F24u7387Total` | `0x00B279CC` | Block damage reduction (Addition + 0.4) |
| `EndingEventDirector__ctor` | `0x00B10278` | Empty |
| `EndingEventDirector_InitEndingEventDirector` | `0x00B10164` | Just sets currentShownStoryLine |
| `EndingEventDirector_findNextShowStoryLine` | `0x00B10184` | Loops `YearPass` + `IsReadyToDisplayThisTurn` |
| `StoryLine_IsReadyToDisplayThisTurn` | `0x00BFD668` | Wait time + age check |
| `StoryLine_CheckConditions` | `0x00BFD4A8` | AND of all Condition.CheckCondition |
| `Condition_CheckCondition` | `0x00B08A7C` | **The 16-type condition switch** |
| `AdventrueAreaSaver__ctor` | `0x00C39518` | Empty (data class) |
| `EvilCrystal__ctor` | `0x00B47270` | Empty |
| `EvilCrystal_AllResetEvilCrystal` | `0x00B47278` | Reset to defaults |
| `EvilCrystal_EvilCrystalUpgrade` | `0x00B4A2F0` | `level++`, `CurrentValue = 0` |
| `EvilCrystal_LevelUp` | `0x00B4A328` | Same as Upgrade |
| `EvilCrystal_EvilCrystalGrow` | `0x00B49650` | Add `GrowSpeedTotal` to CurrentValue |
| `EvilCrystal_EvilCrystalValueChange` | `0x00B49798` | Add v to CurrentValue (clamped) |
| `EvilCrystal_IsFull` | `0x00B4A338` | `MaxValue <= CurrentValue` |
| `HeroTalentBox_Roll` | `0x00B3A824` | Consumes souls, calls DORoll |
| `HeroTalentBox_DORoll` | `0x00B3A904` | Picks 3 random talents for display |
| `HeroTalentBox_getConsumSoulNum` | `0x00B3A794` | `rollCount * 70 - 40`, capped 250 |
| `AchivementManager_GetRandomHeroTalent` | `0x00E8F0D4` | **The 5-rarity weighted roll** |
| `BattleCommander_Attack` | `0x00CEF358` | Coroutine entry |
| `BattleCommander_Attack_d_46_MoveNext` | `0x00CF1A30` | Attack coroutine body |
| `BattleCommander_tryDoDamage` | `0x00CF0E88` | **Damage formula** |
| `BattleCommander_doDamage` | `0x00CF0B90` | Applies damage (calls Creature.LoseHealth) |
| `Creature_LoseHealth` | `0x00B0BDDC` | `health = max(0, health - damage)` |
| `Hero_CheckPropertyAvalable` | `0x00B37B68` | List-membership check |

---

## 18. Wave 6: New .data constants

| Address | Type | Value | Used in |
|---|---|---:|---|
| `0x018ee738` | double | 0.01 | Gold reward: `level * 0.01 + 1.0` |
| `0x018fe760` | float | -1.3 | Defence divisor in damage formula |
| `0x018fe764` | float | 1.0147 | Defence base in damage formula |
| `0x018fdaa0` | float | 0.72 | Upper threshold for `currentExploreStat = 3` |
| `0x018fdaa4` | float | 0.33 | Lower threshold for `currentExploreStat = 1` |
