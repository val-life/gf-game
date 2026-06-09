# il2cpp.cs Extracted -- 撘?頧桀?敶?1.20

> Source: A:\github project\game 2\il2cpp.cs (6.6MB, 147012 lines, Il2CppInspector dump)
> Game: Unity 2019.4 + IL2CPP (libil2cpp.so + global-metadata.dat confirmed)
> RVA = relative virtual address into lib/<abi>/libil2cpp.so
> No method bodies (IL2CPP strips them -- only in libil2cpp.so as native)

---

## A. All Caculate* Methods (RVA + Owning Class)

| Line | Method | Owner Class | RVA |
|------|--------|-------------|-----|
| 6466 | `public int CaculateGameOverTime(); // 0x00E8E620-0x00E8E768` | AchivementManager | `0x00E8E620-0x00E8E768` |
| 6995 | `public int CaculateFootstep(); // 0x00C39384-0x00C39464` | <namespace System.Net.Sockets> | `0x00C39384-0x00C39464` |
| 8099 | `private int caculateEquipmentValue(Equipment equipment); // 0x0104D148-0x0104D1DC` | <namespace XNode.AdventureEvent.Nodes> | `0x0104D148-0x0104D1DC` |
| 22734 | `public int CaculateGainSoulNum(); // 0x00B06E34-0x00B06F3C` | <namespace System.Runtime.InteropServices> | `0x00B06E34-0x00B06F3C` |
| 26289 | `public double CaculateCurrentHealthRate(); // 0x00B0A790-0x00B0A7BC` | <namespace LC.Newtonsoft.Json.Utilities> | `0x00B0A790-0x00B0A7BC` |
| 53477 | `public double CaculateLevelBuff(); // 0x00B36660-0x00B36668` | Hero | `0x00B36660-0x00B36668` |
| 53478 | `public double CaculateBaseAttack(); // 0x00B36668-0x00B3670C` | Hero | `0x00B36668-0x00B3670C` |
| 53479 | `public double CaculateBaseDodge(); // 0x00B3670C-0x00B367A4` | Hero | `0x00B3670C-0x00B367A4` |
| 53480 | `public double CaculateBaseAttackSpeedInprove(); // 0x00B367A4-0x00B36840` | Hero | `0x00B367A4-0x00B36840` |
| 53481 | `public double CaculateBaseBlockRateInprove(); // 0x00B36840-0x00B368DC` | Hero | `0x00B36840-0x00B368DC` |
| 53482 | `public double CaculateBaseMaxHealth(); // 0x00B368DC-0x00B36974` | Hero | `0x00B368DC-0x00B36974` |
| 53483 | `public double CaculateBaseDefence(); // 0x00B36974-0x00B36A0C` | Hero | `0x00B36974-0x00B36A0C` |
| 53484 | `public double CaculateBaseCriticalRate(); // 0x00B36A0C-0x00B36AA8` | Hero | `0x00B36A0C-0x00B36AA8` |
| 53485 | `public double CaculateBaseExpGainImprove(); // 0x00B36AA8-0x00B36B44` | Hero | `0x00B36AA8-0x00B36B44` |
| 53487 | `public double CaculateBaseRelationshipGainImprove(); // 0x00B36BE8-0x00B36C84` | Hero | `0x00B36BE8-0x00B36C84` |
| 53587 | `private void CaculateNewMaxExp(); // 0x00B39D30-0x00B39DB4` | <namespace UnityEngine> | `0x00B39D30-0x00B39DB4` |
| 97725 | `public static int CaculateTwoMapAreaDistance(MapAreaButton areaOne, MapAreaButton areaTwo); // 0x00AAAB08-0x00AAAC90` | <namespace System.Text.RegularExpressions> | `0x00AAAB08-0x00AAAC90` |

---

## B. Game Class Catalog

| TDI | Class | Base | Lines |
|-----|-------|------|-------|
| 6157 | AchivementDisplayPanel | FDPanel | 6322-6355 |
| 6293 | AchivementManager | MonoSingleton<AchivementManager>, ISaveAndLoad, IGameProcess | 6356-6556 |
| 6683 | AdventureAreaInfoNode | AdventureEventNodeElement | 7394-7400 |
| 6693 | AdventureEventGraph | NodeGraph | 7889-7913 |
| 6207 | AgeStatPanel | FDPanel | 8207-8257 |
| 6666 | AndNode | LogicNode | 8707-8745 |
| 6492 | Artifact | Relic | 11408-11620 |
| 6217 | BattleCommander | MonoBehaviour | 14365-14529 |
| 6686 | BattleEventNode | AdventureEventNodeElement | 14555-14568 |
| 6247 | BattleFightPanel | FDPanel | 14569-14581 |
| 6238 | BuffDisplay | MonoBehaviour | 17683-17773 |
| 6682 | CharacterInfoNode | Node | 20861-20879 |
| 6298 | CharacterManager | MonoSingleton<CharacterManager>, ISaveAndLoad, IGameProcess | 20880-20940 |
| 6692 | CharacterSettingGraph | EvenLineGraph | 21070-21094 |
| 6687 | ChestEventNode | AdventureEventNodeElement | 21153-21166 |
| 6279 | CommodyDisplay | MonoBehaviour | 22853-22876 |
| 6674 | ConditionCheckerNode | EventLineElementNode | 23718-23748 |
| 6675 | ConditionSwichNode | EventLineElementNode | 23773-23840 |
| 6691 | EvenLineGraph | NodeGraph | 41492-41513 |
| 6677 | EventLineElementNode | Node | 42421-42448 |
| 6678 | EventLineInfoNode | EventLineElementNode | 42449-42472 |
| 6299 | EventManager | MonoSingleton<EventManager>, ISaveAndLoad, IGameProcess | 42473-42577 |
| 6679 | EventResultNode | EventLineElementNode | 42734-42754 |
| 6424 | FishArea | MonoBehaviour | 47486-47506 |
| 6425 | FishBar | MonoBehaviour | 47507-47547 |
| 6427 | FishField | MonoBehaviour | 47548-47607 |
| 6280 | FishStore | Store | 47608-47617 |
| 6305 | GameManager | MonoSingleton<GameManager>, ISaveAndLoad, IGameProcess | 50107-50324 |
| 6432 | GameRecordDisplay | MonoBehaviour | 50427-50442 |
| 6309 | GameRegionManager | MonoSingleton<GameRegionManager>, ISaveAndLoad, IGameProcess | 50443-50630 |
| 6434 | GameResultPanel | FDPanel | 50631-50673 |
| 6688 | GreatCollectionNode | AdventureEventNodeElement | 51851-51864 |
| 6281 | GroceryStore | Store | 52335-52344 |
| 6482 | Hero | Creature | 53375-53554 |
| 6507 | HeroTalentBox | MonoBehaviour | 53673-53800 |
| 6665 | LogicGraph | NodeGraph | 78029-78052 |
| 6680 | MainEventNode | EventLineElementNode | 78792-78822 |
| 6073 | ManagerOfManagers | MonoSingleton<ManagerOfManagers> | 78838-78884 |
| 6642 | MapAreaStatNode | Node | 79483-79506 |
| 6643 | MapAreasNode | Node | 79512-79526 |
| 6690 | MapAreasSettingGraph | NodeGraph | 79530-79539 |
| 6557 | MapBattleArea | AdventrueArea | 79540-79549 |
| 6559 | MapCharacter | MapObject | 79564-79569 |
| 6562 | MapNpc | MapObject | 79611-79636 |
| 6644 | MapObjectNode | Node | 79642-79664 |
| 6645 | MathGraph | NodeGraph | 80339-80345 |
| 6661 | MathNode | Node | 80349-80377 |
| 6488 | Monster | Creature | 83504-83709 |
| 6669 | NotNode | LogicNode | 86738-86776 |
| 6239 | PartnerDisplay | MonoBehaviour | 90585-90623 |
| 6240 | PartnerTeam | MonoBehaviour | 90653-90671 |
| 6577 | Player | MonoBehaviour | 91730-91739 |
| 6282 | PotionShop | Store | 92613-92622 |
| 6671 | PulseNode | LogicNode, ITimerTick | 93741-93763 |
| 6689 | RestEventNode | AdventureEventNodeElement | 99165-99178 |
| 6651 | RuntimeMathGraph | MonoBehaviour, IPointerClickHandler | 100020-100055 |
| 6336 | SaverManager | MonoSingleton<SaverManager>, ISaveAndLoad | 101479-101532 |
| 5726 | SceneGraph | MonoBehaviour | 101678-101697 |
| 6610 | SkillTreePanel | FDPanel | 107053-107067 |
| 6648 | StateGraph | NodeGraph | 110946-110958 |
| 6646 | StateNode | Node | 111005-111029 |
| 6681 | StoryLineNode | EventLineElementNode | 111480-111513 |
| 6630 | TimeFlowPanel | FDPanel | 120742-120839 |
| 6672 | ToggleNode | LogicNode | 121864-121902 |
| 6290 | TravelBussinssMan | Store | 122914-122924 |
| 6653 | UGUIMathBaseNode | MonoBehaviour, IDragHandler | 125321-125343 |
| 6654 | UGUIMathNode | UGUIMathBaseNode | 125344-125362 |

---

## C. Class Bodies (Fields + Methods)

### AchivementDisplayPanel (TDI )

<<CODE>>
public class AchivementDisplayPanel : FDPanel // TypeDefIndex: 6157
{
	// Fields
	public GridLayoutDisplay gridDisplay; // 0x50
	public VerticalLayoutDisplay gameRecordDisplay; // 0x58
	public singleAchivementDisplay achivementDisplayPrefabs; // 0x60
	public GameRecordDisplay recordDisplayPrefabs; // 0x68
	public UIAnimation Bg; // 0x70
	public SwitchUI switchUI; // 0x78
	public FDButton SwitchGameRecordBtn; // 0x80
	public FDButton SwitchAchivementBtn; // 0x88

	// Constructors
	public AchivementDisplayPanel(); // 0x00E8B408-0x00E8B410

	// Methods
	public override void OnEnter(BaseContext baseContext); // 0x00E8AEB8-0x00E8B290
	public void SwitchGameRecord(); // 0x00E8B290-0x00E8B300
	public void SwitchAchivement(); // 0x00E8B300-0x00E8B370
	public void Close(); // 0x00E8B370-0x00E8B408
}

public enum AchivementDisplayType // TypeDefIndex: 6147
{
	Normal = 0,
	Hide = 1
}

public enum AchivementEffectType // TypeDefIndex: 6148
{
	Once = 0,
	EveryGame = 1
}

<<END>>

### AchivementManager (TDI )

<<CODE>>
public class AchivementManager : MonoSingleton<AchivementManager>, ISaveAndLoad, IGameProcess // TypeDefIndex: 6293
{
	// Fields
	[CompilerGenerated] // 0x007C5690-0x007C56A0
	private List<StoryLine> _GodnessWordStoryLines_k__BackingField; // 0x18
	[CompilerGenerated] // 0x007C56A0-0x007C56B0
	private List<string> _HappenedGodnessEventID_k__BackingField; // 0x20
	[CompilerGenerated] // 0x007C56B0-0x007C56C0
	private int _AllGameSouls_k__BackingField; // 0x28
	[CompilerGenerated] // 0x007C56C0-0x007C56D0
	private int _CurrentGameSouls_k__BackingField; // 0x2C
	public GameObject GainSoulDisplayPrefabs; // 0x30
	[CompilerGenerated] // 0x007C56D0-0x007C56E0
	private List<string> _DiscoverMonsterList_k__BackingField; // 0x38
	[HideInInspector] // 0x007C56E0-0x007C56F0
	public bool hasGameRecoudsThisGame; // 0x40
	[CompilerGenerated] // 0x007C56F0-0x007C5700
	private string _CurrentWorldId_k__BackingField; // 0x48
	[CompilerGenerated] // 0x007C5700-0x007C5710
	private List<GameRecord> _gameRecords_k__BackingField; // 0x50
	[CompilerGenerated] // 0x007C5710-0x007C5720
	private List<HeroAeroSkill> _heroAeroSkills_k__BackingField; // 0x58
	[CompilerGenerated] // 0x007C5720-0x007C5730
	private List<HeroTalent> _HeroTalentList_k__BackingField; // 0x60
	[CompilerGenerated] // 0x007C5730-0x007C5740
	private List<HeroTalent> _currentGameTalents_k__BackingField; // 0x68
	[CompilerGenerated] // 0x007C5740-0x007C5750
	private int _RollTime_k__BackingField; // 0x70
	public List<Achivement> achivements; // 0x78
	public AllTimeAdData allTimeAdData; // 0x80
	private string getCurrentTimeAPi; // 0x88
	public DateTime OpenTime; // 0x90

	// Properties
	public List<StoryLine> GodnessWordStoryLines { [CompilerGenerated] /* 0x007C975C-0x007C976C */ get; [CompilerGenerated] /* 0x007C976C-0x007C977C */ set; } // 0x00E8DB9C-0x00E8DBA4 0x00E8DBA4-0x00E8DBAC
	public List<string> HappenedGodnessEventID { [CompilerGenerated] /* 0x007C977C-0x007C978C */ get; [CompilerGenerated] /* 0x007C978C-0x007C979C */ set; } // 0x00E8DBAC-0x00E8DBB4 0x00E8DBB4-0x00E8DBBC
	public int AllGameSouls { [CompilerGenerated] /* 0x007C979C-0x007C97AC */ get; [CompilerGenerated] /* 0x007C97AC-0x007C97BC */ set; } // 0x00E8DDE4-0x00E8DDEC 0x00E8DDEC-0x00E8DDF4
	public int CurrentGameSouls { [CompilerGenerated] /* 0x007C97BC-0x007C97CC */ get; [CompilerGenerated] /* 0x007C97CC-0x007C97DC */ set; } // 0x00E8DDF4-0x00E8DDFC 0x00E8DDFC-0x00E8DE04
	public List<string> DiscoverMonsterList { [CompilerGenerated] /* 0x007C97DC-0x007C97EC */ get; [CompilerGenerated] /* 0x007C97EC-0x007C97FC */ set; } // 0x00E8E230-0x00E8E238 0x00E8E238-0x00E8E240
	public string CurrentWorldId { [CompilerGenerated] /* 0x007C97FC-0x007C980C */ get; [CompilerGenerated] /* 0x007C980C-0x007C981C */ set; } // 0x00E8E240-0x00E8E248 0x00E8E248-0x00E8E250
	public List<GameRecord> gameRecords { [CompilerGenerated] /* 0x007C981C-0x007C982C */ get; [CompilerGenerated] /* 0x007C982C-0x007C983C */ set; } // 0x00E8E250-0x00E8E258 0x00E8E258-0x00E8E260
	public List<HeroAeroSkill> heroAeroSkills { [CompilerGenerated] /* 0x007C983C-0x007C984C */ get; [CompilerGenerated] /* 0x007C984C-0x007C985C */ set; } // 0x00E8EAF0-0x00E8EAF8 0x00E8EAF8-0x00E8EB00
	public List<HeroTalent> HeroTalentList { [CompilerGenerated] /* 0x007C985C-0x007C986C */ get; [CompilerGenerated] /* 0x007C986C-0x007C987C */ set; } // 0x00E8EF20-0x00E8EF28 0x00E8EF28-0x00E8EF30
	public List<HeroTalent> currentGameTalents { [CompilerGenerated] /* 0x007C987C-0x007C988C */ get; [CompilerGenerated] /* 0x007C988C-0x007C989C */ set; } // 0x00E8EF30-0x00E8EF38 0x00E8EF38-0x00E8EF40
	public int RollTime { [CompilerGenerated] /* 0x007C989C-0x007C98AC */ get; [CompilerGenerated] /* 0x007C98AC-0x007C98BC */ set; } // 0x00E8EF40-0x00E8EF48 0x00E8EF48-0x00E8EF50

	// Nested types
	[CompilerGenerated] // 0x007C4B70-0x007C4B80
	private sealed class __c__DisplayClass28_0 // TypeDefIndex: 6294
	{
		// Fields
		public GameObject gainSoulDisplay; // 0x10

		// Constructors
		public __c__DisplayClass28_0(); // 0x00E8E128-0x00E8E130

		// Methods
		internal void _AddCurrentGameSouls_b__0(); // 0x00E8FAEC-0x00E8FB58
	}

	[CompilerGenerated] // 0x007C4B80-0x007C4B90
	private sealed class _DoCheckTimePass_d__93 : IEnumerator<object> // TypeDefIndex: 6295
	{
		// Fields
		private int __1__state; // 0x10
		private object __2__current; // 0x18
		public AchivementManager __4__this; // 0x20
		private UnityWebRequest _webRequest_5__2; // 0x28

		// Properties
		object IEnumerator<System.Object>.Current { [DebuggerHidden] /* 0x007CF9B8-0x007CF9C8 */ get; } // 0x00E8FE5C-0x00E8FE64 
		object IEnumerator.Current { [DebuggerHidden] /* 0x007CF9D8-0x007CF9E8 */ get; } // 0x00E8FEC4-0x00E8FECC 

		// Constructors
		[DebuggerHidden] // 0x007CF998-0x007CF9A8
		public _DoCheckTimePass_d__93(int __1__state); // 0x00E8FA40-0x00E8FA6C

		// Methods
		[DebuggerHidden] // 0x007CF9A8-0x007CF9B8
		void IDisposable.Dispose(); // 0x00E8FB58-0x00E8FB5C
		private bool MoveNext(); // 0x00E8FB5C-0x00E8FE5C
		[DebuggerHidden] // 0x007CF9C8-0x007CF9D8
		void IEnumerator.Reset(); // 0x00E8FE64-0x00E8FEC4
	}

	// Constructors
	public AchivementManager(); // 0x00E8FA6C-0x00E8FAEC

	// Methods
	public int GetPriot(); // 0x00E8B410-0x00E8B418
	public List<Tuple<SaverType, string, LitJson.JsonData>> Save(); // 0x00E8B418-0x00E8B53C
	public List<Tuple<SaverType, string, LitJson.JsonData>> SaveAllTimeData(); // 0x00E8B53C-0x00E8B884
	public void Init(); // 0x00E8B97C-0x00E8BA98
	public void Load(); // 0x00E8D160-0x00E8D49C
	public int CompareTo(object obj); // 0x00E8D8D8-0x00E8DAE8
	public void GameBegginInit(); // 0x00E8DAE8-0x00E8DAEC
	public void LoadSaver(); // 0x00E8DAEC-0x00E8DB9C
	public void HappenedGodnessEventAdd(string str); // 0x00E8DBBC-0x00E8DC60
	public StoryLine GetSpecialStoryLine(string storyName); // 0x00E8DC60-0x00E8DDE4
	private void initAllGodnessWord(); // 0x00E8BA98-0x00E8BC6C
	public void AddCurrentGameSouls(MonsterRank monsterRank, Vector2 pos); // 0x00E8DE04-0x00E8E128
	public void AddCurrentGameSouls(int value); // 0x00E8E130-0x00E8E140
	public void AddAllGameSouls(int value); // 0x00E8A328-0x00E8A3BC
	public bool TryConsumSoul(int value); // 0x00E8E140-0x00E8E230
	public bool CheckWin(); // 0x00E8E260-0x00E8E360
	private void GenerateCurrentWorldId(); // 0x00E8C174-0x00E8C25C
	public string GenerateNewCurrentWorldId(); // 0x00E8E360-0x00E8E444
	public void DiscoverMonster(string monsterName); // 0x00E8E444-0x00E8E4AC
	public bool CheckIsNewMonster(string MonsterName); // 0x00E8E4AC-0x00E8E520
	public int GetNextReincarnationTime(); // 0x00E8E520-0x00E8E620
	public int CaculateGameOverTime(); // 0x00E8E620-0x00E8E768
	public GameRecord GetLastGameRecord(); // 0x00E8E768-0x00E8E890
	public void AddGameRecord(GameRecord gameRecord); // 0x00E8E890-0x00E8E928
	public int GetCurrentCruelWorldMaxLevel(); // 0x00E8E9D0-0x00E8EAF0
	private void InitHeroAeroSkills(); // 0x00E8BC6C-0x00E8C0A4
	public HeroAeroSkill GetHeroAeroSkillByName(string name); // 0x00E8EB00-0x00E8EC20
	public void DoAllHeroAeroSkillEffect(); // 0x00E8EC20-0x00E8ED18
	public void DoAllEventTypeHeroAeroSkillEffect(); // 0x00E8ED18-0x00E8EE1C
	public int GetAllHeroAeroSoul(); // 0x00E8EE1C-0x00E8EF20
	private void InitAllHeroTalent(); // 0x00E8C0A4-0x00E8C174
	public HeroTalent GetTalentByName(string talentName); // 0x00E8D760-0x00E8D8D8
	private HeroTalent getRandomOneHeroTalentFromList(List<HeroTalent> talents, EquipmentRarity equipmentRarity); // 0x00E8EF50-0x00E8F0D4
	public HeroTalent GetRandomHeroTalent(int buffNum); // 0x00E8F0D4-0x00E8F4D8
	public void ClearHeroTalentData(); // 0x00E8E928-0x00E8E9D0
	private void InitAchivements(); // 0x00E8C25C-0x00E8D0F0
	private Achivement GetAchivementByID(int achivementID); // 0x00E8D4C8-0x00E8D640
	private void checkAchivementIDcomllic(); // 0x00E8F4D8-0x00E8F684
	public void DoAllAchivementEveryGameEffect(); // 0x00E8F684-0x00E8F784
	public void MakeAchivement(string AchivementName); // 0x00E8F784-0x00E8F8A8
	public bool CheckAchivementIsAchive(int AchivmentID); // 0x00E8F8A8-0x00E8F9D0
	public void InitAllTimeAdData(); // 0x00E8D0F0-0x00E8D160
	public void CheckDayPass(); // 0x00E8D49C-0x00E8D4C8
	[IteratorStateMachine] // 0x007C98BC-0x007C9920
	private IEnumerator DoCheckTimePass(); // 0x00E8F9D0-0x00E8FA40
}

[Serializable]
public class AchivementManagerSaverAllTime // TypeDefIndex: 6320
{
	// Fields
	public List<string> HappenedGodnessEventID; // 0x10
	public int AllGameSouls; // 0x18
	public List<GameRecord> gameRecords; // 0x20
	public List<HeroAeroSkill> heroAeroSkills; // 0x28
	public List<string> heroTalentName; // 0x30
	public int rollTime; // 0x38
	public List<AchivementSaver> achivementSavers; // 0x40
	public AllTimeAdDataSaver allTimeAdDataSaver; // 0x48

	// Constructors
	public AchivementManagerSaverAllTime(); // 0x00E8FECC-0x00E90ED4
	public AchivementManagerSaverAllTime(List<string> happenGodnessEventID, int allGameSouls, List<GameRecord> gameRecords, List<HeroAeroSkill> heroAeroSkills, AllTimeAdData allTimeAdData); // 0x00E8B884-0x00E8B97C

	// Methods
	public HeroAeroSkill GetHeroAeroSkillByName(string name); // 0x00E8D640-0x00E8D760
}

[Serializable]
public class AchivementManagerSaverCurrent // TypeDefIndex: 6318
{
	// Fields
	public int CurrentGameSouls; // 0x10
	public string CurrentWorldId; // 0x18
	public List<string> DiscoverMonsterList; // 0x20

	// Constructors
	public AchivementManagerSaverCurrent(); // 0x00C38D24-0x00C38D2C
	public AchivementManagerSaverCurrent(int currentGamSouls, string currentWorldID, List<string> DiscoverMonsterList); // 0x00C38D2C-0x00C38D6C
}

[Serializable]
public class AchivementSaver // TypeDefIndex: 6319
{
	// Fields
	public int AchivementID; // 0x10
	public bool isAchive; // 0x14
	public int achivementCount; // 0x18

	// Constructors
	public AchivementSaver(); // 0x00C38D6C-0x00C38D74
	public AchivementSaver(int achivementID, bool isAchive, int achivementCount); // 0x00C38D74-0x00C38DBC
}

public enum AchivementType // TypeDefIndex: 6146
{
	Once = 0,
	Count = 1
}

public enum AcqisitionLimit // TypeDefIndex: 6499
{
	Infinity = 0,
	Once = 1
}

public enum AcquisitionMethod // TypeDefIndex: 6497
{
	Normal = 0,
	Special = 1
}

<<END>>

### AdventureAreaInfoNode (TDI )

<<CODE>>
	public class AdventureAreaInfoNode : AdventureEventNodeElement // TypeDefIndex: 6683
	{
		// Constructors
		public AdventureAreaInfoNode(); // 0x00D95850-0x00D95858
	}
}

<<END>>

### AdventureEventGraph (TDI )

<<CODE>>
	public class AdventureEventGraph : NodeGraph // TypeDefIndex: 6693
	{
		// Fields
		public string AdventureAreaName; // 0x20
		public string AdventureAreaDescript; // 0x28
		public string EnterAdventureAreaDescript; // 0x30
		public int MonsterBegginLevel; // 0x38
		public int MaxDepth; // 0x3C
		public int GreatScreatCollectionCount; // 0x40
		public List<LeavingMazeStrAndEffect> HurriLeaveList; // 0x48
		public List<LeavingMazeStrAndEffect> NormalLeaveList; // 0x50
		[HideInInspector] // 0x007C6904-0x007C6914
		public List<AreaEventsDistribution> areaEventsDistributions; // 0x58
	
		// Constructors
		public AdventureEventGraph(); // 0x017784C8-0x017784D0
	
		// Methods
		public override Node AddNode(Type type); // 0x017779F0-0x01777AF8
		public override Node CopyNode(Node original); // 0x01777AF8-0x01777BC4
		public AdventrueArea GetThisAdventureArea(); // 0x01777BC4-0x0177804C
		public MapBattleArea GetThisMapBattleArea(); // 0x0177804C-0x017784C8
	}
}

<<END>>

### AgeStatPanel (TDI )

<<CODE>>
public class AgeStatPanel : FDPanel // TypeDefIndex: 6207
{
	// Fields
	public FDText AgeStatName; // 0x50
	public VerticalLayoutDisplay AgeStatContent; // 0x58
	public FDText AgeStatSentencePrefabs; // 0x60
	public FDImage Portrait; // 0x68
	public UIAnimation BG; // 0x70
	public FDButton btn; // 0x78

	// Nested types
	[CompilerGenerated] // 0x007C4A60-0x007C4A70
	private sealed class _doShowPanel_d__9 : IEnumerator<object> // TypeDefIndex: 6208
	{
		// Fields
		private int __1__state; // 0x10
		private object __2__current; // 0x18
		public AgeStatPanel __4__this; // 0x20
		private List<string> __7__wrap1; // 0x28

		// Properties
		object IEnumerator<System.Object>.Current { [DebuggerHidden] /* 0x007CF828-0x007CF838 */ get; } // 0x0104FB88-0x0104FB90 
		object IEnumerator.Current { [DebuggerHidden] /* 0x007CF848-0x007CF858 */ get; } // 0x0104FBF0-0x0104FBF8 

		// Constructors
		[DebuggerHidden] // 0x007CF808-0x007CF818
		public _doShowPanel_d__9(int __1__state); // 0x0104DE90-0x0104DEBC

		// Methods
		[DebuggerHidden] // 0x007CF818-0x007CF828
		void IDisposable.Dispose(); // 0x0104E034-0x0104E050
		private bool MoveNext(); // 0x0104E0A8-0x0104FB88
		private void __m__Finally1(); // 0x0104E050-0x0104E0A8
		[DebuggerHidden] // 0x007CF838-0x007CF848
		void IEnumerator.Reset(); // 0x0104FB90-0x0104FBF0
	}

	// Constructors
	public AgeStatPanel(); // 0x0104E000-0x0104E008

	// Methods
	public override void OnEnter(BaseContext baseContext); // 0x0104DBD8-0x0104DCA4
	private void preSetPanel(); // 0x0104DCA4-0x0104DDF4
	private void showPanel(); // 0x0104DDF4-0x0104DE20
	[IteratorStateMachine] // 0x007C9348-0x007C93AC
	private IEnumerator doShowPanel(); // 0x0104DE20-0x0104DE90
	public void Close(); // 0x0104DEBC-0x0104E000
	[CompilerGenerated] // 0x007C93AC-0x007C93BC
	private void _OnEnter_b__6_0(); // 0x0104E008-0x0104E034
}

<<END>>

### AndNode (TDI )

<<CODE>>
	public class AndNode : LogicNode // TypeDefIndex: 6666
	{
		// Fields
		[HideInInspector] // 0x007C60A8-0x007C60F0
		[Input] // 0x007C60A8-0x007C60F0
		public bool input; // 0x38
		[HideInInspector] // 0x007C60F0-0x007C6138
		[Output] // 0x007C60F0-0x007C6138
		public bool output; // 0x39
	
		// Properties
		public override bool led { get; } // 0x00D96F1C-0x00D96F24 
	
		// Nested types
		[Serializable]
		[CompilerGenerated] // 0x007C5190-0x007C51A0
		private sealed class __c // TypeDefIndex: 6667
		{
			// Fields
			public static readonly __c __9; // 0x00
			public static Func<bool, bool> __9__4_0; // 0x08
	
			// Constructors
			static __c(); // 0x00D97270-0x00D972D4
			public __c(); // 0x00D972D4-0x00D972DC
	
			// Methods
			internal bool _OnInputChanged_b__4_0(bool x); // 0x00D972DC-0x00D972E4
		}
	
		// Constructors
		public AndNode(); // 0x00D97260-0x00D97268
	
		// Methods
		protected override void OnInputChanged(); // 0x00D96F24-0x00D970AC
		public override object GetValue(NodePort port); // 0x00D971FC-0x00D97260
	}
}

<<END>>

### Artifact (TDI )

<<CODE>>
public class Artifact : Relic // TypeDefIndex: 6492
{
	// Fields
	public FDFramworkEvent ArtifactEffect; // 0x40
	public EffectType effectType; // 0x48

	// Nested types
	public class Builder // TypeDefIndex: 6493
	{
		// Fields
		private Artifact artifact; // 0x10

		// Properties
		private Artifact getArtifact { get; } // 0x00CE5604-0x00CE5670 

		// Constructors
		public Builder(); // 0x00CE5898-0x00CE58A0

		// Methods
		public Builder SetArtifactBaseInfo(string ArtifactName, AcquisitionMethod acquisitionMethod, EffectType effectType); // 0x00CE5670-0x00CE5778
		public Builder SetArtifactDiscript(string discript); // 0x00CE5778-0x00CE57AC
		public Builder SetArtifactEffectText(string effectText); // 0x00CE57AC-0x00CE57E0
		public Builder AddAvaliableHeroProfession(HeroProfession heroProfession); // 0x00CE57E0-0x00CE585C
		public Builder AddArtifactEffectEvent(FDFramworkEvent effectEvent); // 0x00CE585C-0x00CE5890
		public Artifact Build(); // 0x00CE5890-0x00CE5898
	}

	// Constructors
	public Artifact(); // 0x00CE55FC-0x00CE5604
}

public class ArtifactGenerater // TypeDefIndex: 6494
{
	// Fields
	public List<Artifact> artifacts; // 0x10

	// Nested types
	[Serializable]
	[CompilerGenerated] // 0x007C4E50-0x007C4E60
	private sealed class __c // TypeDefIndex: 6495
	{
		// Fields
		public static readonly __c __9; // 0x00
		public static FDFramworkEvent<Creature> __9__1_48; // 0x08
		public static FDFramworkEvent __9__1_0; // 0x10
		public static FDFramworkEvent __9__1_1; // 0x18
		public static FDFramworkEvent __9__1_2; // 0x20
		public static FDFramworkEvent<Creature> __9__1_49; // 0x28
		public static FDFramworkEvent __9__1_3; // 0x30
		public static FDFramworkEvent<AttackData> __9__1_50; // 0x38
		public static FDFramworkEvent __9__1_4; // 0x40
		public static FDFramworkEvent __9__1_5; // 0x48
		public static FDFramworkEvent<AttackData> __9__1_51; // 0x50
		public static FDFramworkEvent __9__1_6; // 0x58
		public static FDFramworkEvent __9__1_7; // 0x60
		public static FDFramworkEvent<AttackData> __9__1_52; // 0x68
		public static FDFramworkEvent __9__1_8; // 0x70
		public static FDFramworkEvent<AttackData> __9__1_53; // 0x78
		public static FDFramworkEvent __9__1_9; // 0x80
		public static FDFramworkEvent<Creature> __9__1_54; // 0x88
		public static FDFramworkEvent __9__1_10; // 0x90
		public static FDFramworkEvent __9__1_11; // 0x98
		public static FDFramworkEvent<AttackData> __9__1_55; // 0xA0
		public static FDFramworkEvent __9__1_12; // 0xA8
		public static FDFramworkEvent __9__1_13; // 0xB0
		public static FDFramworkEvent __9__1_14; // 0xB8
		public static FDFramworkEvent<Creature, Creature> __9__1_56; // 0xC0
		public static FDFramworkEvent __9__1_15; // 0xC8
		public static FDFramworkEvent __9__1_16; // 0xD0
		public static FDFramworkEvent __9__1_17; // 0xD8
		public static FDFramworkEvent __9__1_18; // 0xE0
		public static FDFramworkEvent __9__1_19; // 0xE8
		public static FDFramworkEvent __9__1_20; // 0xF0
		public static FDFramworkEvent<AttackData> __9__1_57; // 0xF8
		public static FDFramworkEvent __9__1_21; // 0x100
		public static FDFramworkEvent<AttackData> __9__1_58; // 0x108
		public static FDFramworkEvent __9__1_22; // 0x110
		public static FDFramworkEvent<Creature, Creature> __9__1_59; // 0x118
		public static FDFramworkEvent __9__1_23; // 0x120
		public static FDFramworkEvent<Creature> __9__1_60; // 0x128
		public static FDFramworkEvent __9__1_24; // 0x130
		public static FDFramworkEvent<AttackData> __9__1_61; // 0x138
		public static FDFramworkEvent __9__1_25; // 0x140
		public static FDFramworkEvent<Creature> __9__1_62; // 0x148
		public static FDFramworkEvent<Creature> __9__1_63; // 0x150
		public static FDFramworkEvent __9__1_26; // 0x158
		public static FDFramworkEvent<Creature> __9__1_64; // 0x160
		public static FDFramworkEvent<Creature> __9__1_65; // 0x168
		public static FDFramworkEvent __9__1_27; // 0x170
		public static FDFramworkEvent __9__1_28; // 0x178
		public static FDFramworkEvent __9__1_29; // 0x180
		public static FDFramworkEvent<AttackData> __9__1_66; // 0x188
		public static FDFramworkEvent __9__1_30; // 0x190
		public static FDFramworkEvent __9__1_31; // 0x198
		public static FDFramworkEvent<AttackData> __9__1_67; // 0x1A0
		public static FDFramworkEvent __9__1_32; // 0x1A8
		public static FDFramworkEvent<AttackData> __9__1_68; // 0x1B0
		public static FDFramworkEvent __9__1_33; // 0x1B8
		public static FDFramworkEvent<AttackData> __9__1_69; // 0x1C0
		public static FDFramworkEvent __9__1_34; // 0x1C8
		public static FDFramworkEvent<Creature> __9__1_70; // 0x1D0
		public static FDFramworkEvent __9__1_35; // 0x1D8
		public static FDFramworkEvent<Creature> __9__1_71; // 0x1E0
		public static FDFramworkEvent __9__1_36; // 0x1E8
		public static FDFramworkEvent<AttackData> __9__1_72; // 0x1F0
		public static FDFramworkEvent __9__1_37; // 0x1F8
		public static FDFramworkEvent __9__1_38; // 0x200
		public static FDFramworkEvent<AttackData> __9__1_73; // 0x208
		public static FDFramworkEvent __9__1_39; // 0x210
		public static FDFramworkEvent<AttackData> __9__1_74; // 0x218
		public static FDFramworkEvent __9__1_40; // 0x220
		public static FDFramworkEvent __9__1_41; // 0x228
		public static FDFramworkEvent __9__1_42; // 0x230
		public static FDFramworkEvent<AttackData> __9__1_75; // 0x238
		public static FDFramworkEvent __9__1_43; // 0x240
		public static FDFramworkEvent<AttackData> __9__1_76; // 0x248
		public static FDFramworkEvent __9__1_44; // 0x250
		public static FDFramworkEvent<Creature> __9__1_77; // 0x258
		public static FDFramworkEvent __9__1_45; // 0x260
		public static FDFramworkEvent<Creature> __9__1_78; // 0x268
		public static FDFramworkEvent __9__1_46; // 0x270
		public static FDFramworkEvent __9__1_47; // 0x278

		// Constructors
		static __c(); // 0x00CE9010-0x00CE9074
		public __c(); // 0x00CE9074-0x00CE907C

		// Methods
		internal void _.ctor_b__1_0(); // 0x00CE907C-0x00CE91BC
		internal void _.ctor_b__1_48(Creature cre); // 0x00CE9258-0x00CE93D0
		internal void _.ctor_b__1_1(); // 0x00CE93D0-0x00CE948C
		internal void _.ctor_b__1_2(); // 0x00CE948C-0x00CE9518
		internal void _.ctor_b__1_3(); // 0x00CE9518-0x00CE9658
		internal void _.ctor_b__1_49(Creature cre); // 0x00CE9658-0x00CE9754
		internal void _.ctor_b__1_4(); // 0x00CE9754-0x00CE9894
		internal void _.ctor_b__1_50(AttackData attackData); // 0x00CE9930-0x00CE9A10
		internal void _.ctor_b__1_5(); // 0x00CE9AC8-0x00CE9BB0
		internal void _.ctor_b__1_6(); // 0x00CE9BB0-0x00CE9CF0
		internal void _.ctor_b__1_51(AttackData attackData); // 0x00CE9CF0-0x00CE9D24
		internal void _.ctor_b__1_7(); // 0x00CE9D24-0x00CE9DAC
		internal void _.ctor_b__1_8(); // 0x00CE9DAC-0x00CE9EEC
		internal void _.ctor_b__1_52(AttackData attackData); // 0x00CE9EEC-0x00CE9F2C
		internal void _.ctor_b__1_9(); // 0x00CE9F2C-0x00CEA06C
		internal void _.ctor_b__1_53(AttackData attackData); // 0x00CEA06C-0x00CEA0A0
		internal void _.ctor_b__1_10(); // 0x00CEA0A0-0x00CEA1FC
		internal void _.ctor_b__1_54(Creature creatrue); // 0x00CEA23C-0x00CEA2FC
		internal void _.ctor_b__1_11(); // 0x00CEA2FC-0x00CEA38C
		internal void _.ctor_b__1_12(); // 0x00CEA38C-0x00CEA4CC
		internal void _.ctor_b__1_55(AttackData attackData); // 0x00CEA4CC-0x00CEA588
		internal void _.ctor_b__1_13(); // 0x00CEA588-0x00CEA614
		internal void _.ctor_b__1_14(); // 0x00CEA614-0x00CEA70C
		internal void _.ctor_b__1_15(); // 0x00CEA70C-0x00CEA84C
		internal void _.ctor_b__1_56(Creature attacker, Creature victim); // 0x00CEA8E8-0x00CEA9C0
		internal void _.ctor_b__1_16(); // 0x00CEA9C0-0x00CEAA4C
		internal void _.ctor_b__1_17(); // 0x00CEAA4C-0x00CEAAD8
		internal void _.ctor_b__1_18(); // 0x00CEAAD8-0x00CEAB64
		internal void _.ctor_b__1_19(); // 0x00CEAB64-0x00CEABF0
		internal void _.ctor_b__1_20(); // 0x00CEABF0-0x00CEAC7C
		internal void _.ctor_b__1_21(); // 0x00CEAC7C-0x00CEADBC
		internal void _.ctor_b__1_57(AttackData attackData); // 0x00CEADBC-0x00CEADF8
		internal void _.ctor_b__1_22(); // 0x00CEADF8-0x00CEAF38
		internal void _.ctor_b__1_58(AttackData attackData); // 0x00CEAF38-0x00CEB094
		internal void _.ctor_b__1_23(); // 0x00CEB094-0x00CEB1D4
		internal void _.ctor_b__1_59(Creature attacker, Creature victim); // 0x00CEB1D4-0x00CEB298
		internal void _.ctor_b__1_24(); // 0x00CEB298-0x00CEB3D8
		internal void _.ctor_b__1_60(Creature cre); // 0x00CEB3D8-0x00CEB4A8
		internal void _.ctor_b__1_25(); // 0x00CEB4A8-0x00CEB5E8
		internal void _.ctor_b__1_61(AttackData attackData); // 0x00CEB5E8-0x00CEB618
		internal void _.ctor_b__1_26(); // 0x00CEB618-0x00CEB860
		internal void _.ctor_b__1_62(Creature cre); // 0x00CEB860-0x00CEB920
		internal void _.ctor_b__1_63(Creature cre); // 0x00CEB920-0x00CEB9E4
		internal void _.ctor_b__1_27(); // 0x00CEB9E4-0x00CEBC2C
		internal void _.ctor_b__1_64(Creature cre); // 0x00CEBC2C-0x00CEBCEC
		internal void _.ctor_b__1_65(Creature cre); // 0x00CEBCEC-0x00CEBDB0
		internal void _.ctor_b__1_28(); // 0x00CEBDB0-0x00CEBE38
		internal void _.ctor_b__1_29(); // 0x00CEBE38-0x00CEBEC4
		internal void _.ctor_b__1_30(); // 0x00CEBEC4-0x00CEC004
		internal void _.ctor_b__1_66(AttackData attackData); // 0x00CEC004-0x00CEC054
		internal void _.ctor_b__1_31(); // 0x00CEC054-0x00CEC0DC
		internal void _.ctor_b__1_32(); // 0x00CEC0DC-0x00CEC21C
		internal void _.ctor_b__1_67(AttackData attackData); // 0x00CEC21C-0x00CEC238
		internal void _.ctor_b__1_33(); // 0x00CEC238-0x00CEC378
		internal void _.ctor_b__1_68(AttackData attadata); // 0x00CEC378-0x00CEC4A4
		internal void _.ctor_b__1_34(); // 0x00CEC4A4-0x00CEC5E4
		internal void _.ctor_b__1_69(AttackData attackData); // 0x00CEC5E4-0x00CEC63C
		internal void _.ctor_b__1_35(); // 0x00CEC63C-0x00CEC798
		internal void _.ctor_b__1_70(Creature cre); // 0x00CEC798-0x00CEC87C
		internal void _.ctor_b__1_36(); // 0x00CEC87C-0x00CEC9D8
		internal void _.ctor_b__1_71(Creature cre); // 0x00CEC9D8-0x00CECBC4
		internal void _.ctor_b__1_37(); // 0x00CECCE8-0x00CECE28
		internal void _.ctor_b__1_72(AttackData attackData); // 0x00CECE28-0x00CECED0
		internal void _.ctor_b__1_38(); // 0x00CECED0-0x00CECFC8
		internal void _.ctor_b__1_39(); // 0x00CECFC8-0x00CED108
		internal void _.ctor_b__1_73(AttackData attackData); // 0x00CED108-0x00CED1B8
		internal void _.ctor_b__1_40(); // 0x00CED1B8-0x00CED2F8
		internal void _.ctor_b__1_74(AttackData attackData); // 0x00CED2F8-0x00CED32C
		internal void _.ctor_b__1_41(); // 0x00CED32C-0x00CED420
		internal void _.ctor_b__1_42(); // 0x00CED420-0x00CED424
		internal void _.ctor_b__1_43(); // 0x00CED424-0x00CED564
		internal void _.ctor_b__1_75(AttackData attackData); // 0x00CED564-0x00CED5C4
		internal void _.ctor_b__1_44(); // 0x00CED5C4-0x00CED704
		internal void _.ctor_b__1_76(AttackData attackData); // 0x00CED704-0x00CED7B4
		internal void _.ctor_b__1_45(); // 0x00CED7B4-0x00CED8F4
		internal void _.ctor_b__1_77(Creature cre); // 0x00CED8F4-0x00CEDA20
		internal void _.ctor_b__1_46(); // 0x00CEDA20-0x00CEDB60
		internal void _.ctor_b__1_78(Creature cre); // 0x00CEDB60-0x00CEDC8C
		internal void _.ctor_b__1_47(); // 0x00CEDC8C-0x00CEDC90
	}

	// Constructors
	public ArtifactGenerater(); // 0x00CE58A0-0x00CE9010
}

<<END>>

### BattleCommander (TDI )

<<CODE>>
public class BattleCommander : MonoBehaviour // TypeDefIndex: 6217
{
	// Fields
	public static BattleCommander Instance; // 0x00
	public Team LeftTeam; // 0x18
	public Team RightTeam; // 0x20
	public PartnerTeam partnerTeam; // 0x28
	public TeamDisplay LefeteamDisplay; // 0x30
	public TeamDisplay RightTeamDisplay; // 0x38
	public Toggle doubleSpeedToggle; // 0x40
	public GameObject WatchAdsBtn; // 0x48
	public FDText BattleTimeDisplay; // 0x50
	public DeathEscapeDisplay deathEscapeDisplay; // 0x58
	[HideInInspector] // 0x007C5570-0x007C5580
	public double BattelTime; // 0x60
	[CompilerGenerated] // 0x007C5580-0x007C5590
	private int _timeSpeed_k__BackingField; // 0x68
	[CompilerGenerated] // 0x007C5590-0x007C55A0
	private BattleStat _battleStat_k__BackingField; // 0x6C
	public FightTextDisplay textDisplay; // 0x70
	[CompilerGenerated] // 0x007C55A0-0x007C55B0
	private FDFramworkEvent _battleSucceseEvent_k__BackingField; // 0x78
	[CompilerGenerated] // 0x007C55B0-0x007C55C0
	private FDFramworkEvent _battleLoseEvent_k__BackingField; // 0x80

	// Properties
	[HideInInspector] // 0x007D04F8-0x007D0508
	public int timeSpeed { [CompilerGenerated] /* 0x007C93BC-0x007C93CC */ get; [CompilerGenerated] /* 0x007C93CC-0x007C93DC */ set; } // 0x00CEE7F0-0x00CEE7F8 0x00CEE7F8-0x00CEE800
	public BattleStat battleStat { [CompilerGenerated] /* 0x007C93DC-0x007C93EC */ get; [CompilerGenerated] /* 0x007C93EC-0x007C93FC */ private set; } // 0x00CEE800-0x00CEE808 0x00CEE808-0x00CEE810
	private FDFramworkEvent battleSucceseEvent { [CompilerGenerated] /* 0x007C93FC-0x007C940C */ get; [CompilerGenerated] /* 0x007C940C-0x007C941C */ set; } // 0x00CEE810-0x00CEE818 0x00CEE818-0x00CEE820
	private FDFramworkEvent battleLoseEvent { [CompilerGenerated] /* 0x007C941C-0x007C942C */ get; [CompilerGenerated] /* 0x007C942C-0x007C943C */ set; } // 0x00CEE820-0x00CEE828 0x00CEE828-0x00CEE830

	// Nested types
	[CompilerGenerated] // 0x007C4A70-0x007C4A80
	private sealed class _Attack_d__46 : IEnumerator<object> // TypeDefIndex: 6218
	{
		// Fields
		private int __1__state; // 0x10
		private object __2__current; // 0x18
		public BattleCommander __4__this; // 0x20
		public List<Creature> victims; // 0x28
		public Creature attacter; // 0x30
		public AttactType attactType; // 0x38
		private List<AttackData> _attackDataList_5__2; // 0x40
		private List<AttackData> __7__wrap2; // 0x48

		// Properties
		object IEnumerator<System.Object>.Current { [DebuggerHidden] /* 0x007CF878-0x007CF888 */ get; } // 0x00CF2178-0x00CF2180 
		object IEnumerator.Current { [DebuggerHidden] /* 0x007CF898-0x007CF8A8 */ get; } // 0x00CF21E0-0x00CF21E8 

		// Constructors
		[DebuggerHidden] // 0x007CF858-0x007CF868
		public _Attack_d__46(int __1__state); // 0x00CF0B64-0x00CF0B90

		// Methods
		[DebuggerHidden] // 0x007CF868-0x007CF878
		void IDisposable.Dispose(); // 0x00CF19AC-0x00CF19D8
		private bool MoveNext(); // 0x00CF1A30-0x00CF2178
		private void __m__Finally1(); // 0x00CF19D8-0x00CF1A30
		[DebuggerHidden] // 0x007CF888-0x007CF898
		void IEnumerator.Reset(); // 0x00CF2180-0x00CF21E0
	}

	[CompilerGenerated] // 0x007C4A80-0x007C4A90
	private sealed class _doPartnerAction_d__53 : IEnumerator<object> // TypeDefIndex: 6219
	{
		// Fields
		private int __1__state; // 0x10
		private object __2__current; // 0x18
		public List<Creature> targets; // 0x20
		public BattleCommander __4__this; // 0x28
		public PartnerDisplay partnerDisplay; // 0x30

		// Properties
		object IEnumerator<System.Object>.Current { [DebuggerHidden] /* 0x007CF8C8-0x007CF8D8 */ get; } // 0x00CF34EC-0x00CF34F4 
		object IEnumerator.Current { [DebuggerHidden] /* 0x007CF8E8-0x007CF8F8 */ get; } // 0x00CF3554-0x00CF355C 

		// Constructors
		[DebuggerHidden] // 0x007CF8A8-0x007CF8B8
		public _doPartnerAction_d__53(int __1__state); // 0x00CF1158-0x00CF1184

		// Methods
		[DebuggerHidden] // 0x007CF8B8-0x007CF8C8
		void IDisposable.Dispose(); // 0x00CF32C8-0x00CF32CC
		private bool MoveNext(); // 0x00CF32CC-0x00CF3478
		[DebuggerHidden] // 0x007CF8D8-0x007CF8E8
		void IEnumerator.Reset(); // 0x00CF34F4-0x00CF3554
	}

	[CompilerGenerated] // 0x007C4A90-0x007C4AA0
	private sealed class _DoAttackAni_d__54 : IEnumerator<object> // TypeDefIndex: 6220
	{
		// Fields
		private int __1__state; // 0x10
		private object __2__current; // 0x18
		public List<AttackData> datas; // 0x20
		public BattleCommander __4__this; // 0x28
		private TeamType _AttackerPos_5__2; // 0x30

		// Properties
		object IEnumerator<System.Object>.Current { [DebuggerHidden] /* 0x007CF918-0x007CF928 */ get; } // 0x00CF3258-0x00CF3260 
		object IEnumerator.Current { [DebuggerHidden] /* 0x007CF938-0x007CF948 */ get; } // 0x00CF32C0-0x00CF32C8 

		// Constructors
		[DebuggerHidden] // 0x007CF8F8-0x007CF908
		public _DoAttackAni_d__54(int __1__state); // 0x00CF1200-0x00CF122C

		// Methods
		[DebuggerHidden] // 0x007CF908-0x007CF918
		void IDisposable.Dispose(); // 0x00CF21E8-0x00CF21EC
		private bool MoveNext(); // 0x00CF21EC-0x00CF3258
		[DebuggerHidden] // 0x007CF928-0x007CF938
		void IEnumerator.Reset(); // 0x00CF3260-0x00CF32C0
	}

	// Constructors
	public BattleCommander(); // 0x00CF1800-0x00CF1808

	// Methods
	private void Start(); // 0x00CEE748-0x00CEE79C
	private void OnEnable(); // 0x00CEE79C-0x00CEE7F0
	private void Update(); // 0x00CEE830-0x00CEEE38
	public CreatureDisplay GetCreatureDisplay(Creature creature); // 0x00CE9A10-0x00CE9AC8
	public void CreatureDisplayHealthChange(Creature cre, double value); // 0x00CECBC4-0x00CECCE8
	public Creature GetHero(); // 0x00CEF570-0x00CEF6BC
	public List<Creature> GetCreatureTeamMate(Creature creature); // 0x00CEF8C4-0x00CEFAF4
	public Team GetTeam(Creature creature); // 0x00CEFAF4-0x00CEFB7C
	public TeamDisplay GetTeamDisplay(Creature creature); // 0x00CEFB7C-0x00CEFC04
	private void FightEnd(); // 0x00CEF110-0x00CEF23C
	private bool CheckFightEnd(); // 0x00CEF0C0-0x00CEF110
	private void CheckCreatureDieByondFight(); // 0x00CEEE38-0x00CEF0C0
	public void BattlePrepare(List<string> monsters); // 0x00CF00E0-0x00CF0374
	public void BattleEventPrepare(FDFramworkEvent battleSuccesEvent, FDFramworkEvent battleLoseEvent); // 0x00CF0374-0x00CF037C
	public void BattleBeggin(List<Creature> monsters); // 0x00CF037C-0x00CF0464
	public void BattleBeggin(List<string> monsters); // 0x00CF0464-0x00CF0580
	public void BattleContinue(); // 0x00CF0580-0x00CF0628
	public void BattleBegin(); // 0x00CF0628-0x00CF09FC
	[IteratorStateMachine] // 0x007C943C-0x007C94A0
	public IEnumerator Attack(Creature attacter, List<Creature> victims, AttactType attactType); // 0x00CEF358-0x00CEF3EC
	private void doDamage(AttackData attackData); // 0x00CF0B90-0x00CF0D20
	private void CreatureDie(Creature creature); // 0x00CEFDD0-0x00CF00E0
	private AttackData GenerateAttactData(Creature attacter, Creature victim, AttactType attactType); // 0x00CF0D20-0x00CF0E58
	private bool checkHit(double dodge); // 0x00CF0E58-0x00CF0E88
	private double tryDoDamage(Creature attacker, Creature victim, ref bool isCritical, ref bool isBlock); // 0x00CF0E88-0x00CF1078
	public Tuple<bool, Creature> Summon(string summonCreatureName, int level, Creature master); // 0x00CF1078-0x00CF1158
	[IteratorStateMachine] // 0x007C94A0-0x007C9504
	private IEnumerator doPartnerAction(PartnerDisplay partnerDisplay, List<Creature> targets); // 0x00CEF6BC-0x00CEF740
	[IteratorStateMachine] // 0x007C9504-0x007C9568
	private IEnumerator DoAttackAni(List<AttackData> datas); // 0x00CF1184-0x00CF1200
	public void DoPartnerDamageAni(Creature creature, float value, bool isCritical); // 0x00CF122C-0x00CF130C
	public List<Creature> GetCreatureAround(Creature cre, GetCreatureAroundWay getCreatureAroundWay); // 0x00CF130C-0x00CF13A4
	private void stepAhead(Transform transform, float derection); // 0x00CF13A4-0x00CF1490
	private void stepBack(Transform transform, float derection); // 0x00CF1490-0x00CF157C
	public void ShowBattleToggleDisplay(); // 0x00CF09FC-0x00CF0B64
	public void ChangeBattleSpeed(); // 0x00CF157C-0x00CF1670
	public void ChangeSelectTarget(CreatureDisplay target); // 0x00CF1670-0x00CF1730
	public void ShowSelectIcon(CreatureDisplay target); // 0x00CEF23C-0x00CEF358
	public void WatchBattleSpeedAds(); // 0x00CF1730-0x00CF1800
	[CompilerGenerated] // 0x007C9568-0x007C9578
	private void _FightEnd_b__37_0(); // 0x00CF1808-0x00CF187C
	[CompilerGenerated] // 0x007C9578-0x007C9588
	private void _WatchBattleSpeedAds_b__63_0(bool isSuccess); // 0x00CF187C-0x00CF19AC
}

[Serializable]
<<END>>

### BattleEventNode (TDI )

<<CODE>>
	public class BattleEventNode : AdventureEventNodeElement // TypeDefIndex: 6686
	{
		// Fields
		public BattleEvent battleEvent; // 0x38
	
		// Constructors
		public BattleEventNode(); // 0x00D958D4-0x00D958DC
	
		// Methods
		public override void InitThis(); // 0x00D9586C-0x00D958CC
		public override AdventrueEvent GetAdventureEvent(); // 0x00D958CC-0x00D958D4
	}
}

<<END>>

### BattleFightPanel (TDI )

<<CODE>>
public class BattleFightPanel : FDPanel // TypeDefIndex: 6247
{
	// Fields
	public BattleCommander battleCommander; // 0x50
	public BattleFightPanelContext panelContext; // 0x58

	// Constructors
	public BattleFightPanel(); // 0x00CF36D8-0x00CF36E0

	// Methods
	public override void OnEnter(BaseContext baseContext); // 0x00CF3630-0x00CF36D8
}

<<END>>

### BuffDisplay (TDI )

<<CODE>>
public class BuffDisplay : MonoBehaviour // TypeDefIndex: 6238
{
	// Fields
	public FDImage Img; // 0x18
	public FDText LayerText; // 0x20
	public Buff thisBuff; // 0x28

	// Constructors
	public BuffDisplay(); // 0x00AFF9F0-0x00AFF9F8

	// Methods
	public void InitBuffDisplay(Buff buff); // 0x00AFF820-0x00AFF91C
	private void Update(); // 0x00AFF91C-0x00AFF9F0
}

public enum BuffDuration // TypeDefIndex: 6233
{
	BattleTime = 0,
	OneTurn = 1,
	AllTime = 2
}

public enum BuffEffectType // TypeDefIndex: 6230
{
	FixEffect = 0,
	ChangeOverTime = 1
}

public enum BuffFixEffectName // TypeDefIndex: 6232
{
	攻击力乘数变化 = 0,
	攻击力加数变化 = 1,
	防御力乘数变化 = 2,
	防御力加数变化 = 3,
	暴击率加数变化 = 4,
	暴击伤害加数变化 = 5,
	闪避值加数变化 = 6,
	命中值加数变化 = 7,
	攻击速度乘数变化 = 8,
	反击概率加数变化 = 9,
	吸血值加数变化 = 10,
	格挡概率加数变化 = 11,
	格挡概率乘数变化 = 12,
	生命回复率加数变化 = 13,
	生命回复率乘数变化 = 14,
	溅射伤害加数变化 = 15,
	每秒生命回复 = 16,
	最大生命乘数变化 = 17
}

public enum BuffName // TypeDefIndex: 6231
{
	流血 = 0,
	灼烧 = 1,
	中毒 = 2,
	强化 = 3,
	专注 = 4,
	急速 = 5,
	胆怯 = 6,
	愤怒 = 7,
	抵御 = 8,
	迟缓 = 9,
	眩晕 = 10,
	破甲 = 11,
	易伤 = 12,
	巨大化 = 13,
	狂暴化 = 14,
	虚空化 = 15,
	幻影化 = 16
}

public enum BuffOverTimeEffectName // TypeDefIndex: 6234
{
	加减生命值 = 0,
	百分比加减生命值 = 1,
	眩晕 = 2
}

public enum BuffType // TypeDefIndex: 6229
{
	Buff = 0,
	Debuff = 1
}

public enum BuffValueCaculateType // TypeDefIndex: 6235
{
	百分比生命值 = 0,
	百分比损失生命值 = 1,
	通常 = 2
}

<<END>>

### CharacterInfoNode (TDI )

<<CODE>>
	public class CharacterInfoNode : Node // TypeDefIndex: 6682
	{
		// Fields
		public string CharacterName; // 0x30
		public RelationshipWithHero relationshipWithHero; // 0x38
		public HeroProfession belongWorld; // 0x3C
		public int BegginAge; // 0x40
		public int BegginRelationship; // 0x44
		public int BegginRelaLevel; // 0x48
		[TextArea] // 0x007C68E4-0x007C68F4
		public string CharacterDiscript; // 0x50
		public bool CanBePartner; // 0x58
		public List<CharacterAppearRegion> characterAppearRegions; // 0x60
	
		// Constructors
		public CharacterInfoNode(); // 0x00D95A2C-0x00D95A34
	}
}

<<END>>

### CharacterManager (TDI )

<<CODE>>
public class CharacterManager : MonoSingleton<CharacterManager>, ISaveAndLoad, IGameProcess // TypeDefIndex: 6298
{
	// Fields
	[CompilerGenerated] // 0x007C5790-0x007C57A0
	private List<Character> _characters_k__BackingField; // 0x18
	[CompilerGenerated] // 0x007C57A0-0x007C57B0
	private List<BattleFiledPartner> _AllBattleFiledPartners_k__BackingField; // 0x20
	[CompilerGenerated] // 0x007C57B0-0x007C57C0
	private List<BattleFiledPartner> _currentEffectivePartner_k__BackingField; // 0x28

	// Properties
	public List<Character> characters { [CompilerGenerated] /* 0x007C9970-0x007C9980 */ get; [CompilerGenerated] /* 0x007C9980-0x007C9990 */ set; } // 0x00B03F10-0x00B03F18 0x00B03F18-0x00B03F20
	public List<BattleFiledPartner> AllBattleFiledPartners { [CompilerGenerated] /* 0x007C9990-0x007C99A0 */ get; [CompilerGenerated] /* 0x007C99A0-0x007C99B0 */ set; } // 0x00B03F20-0x00B03F28 0x00B03F28-0x00B03F30
	public List<BattleFiledPartner> currentEffectivePartner { [CompilerGenerated] /* 0x007C99B0-0x007C99C0 */ get; [CompilerGenerated] /* 0x007C99C0-0x007C99D0 */ set; } // 0x00B03F30-0x00B03F38 0x00B03F38-0x00B03F40

	// Constructors
	public CharacterManager(); // 0x00B0501C-0x00B0508C

	// Methods
	public int GetPriot(); // 0x00B01DD0-0x00B01DD8
	public List<Tuple<SaverType, string, LitJson.JsonData>> Save(); // 0x00B01DD8-0x00B028C0
	public List<Tuple<SaverType, string, LitJson.JsonData>> SaveAllTimeData(); // 0x00B02B74-0x00B02B7C
	public void Init(); // 0x00B02B7C-0x00B02B80
	public void Load(); // 0x00B02E4C-0x00B02E50
	public int CompareTo(object obj); // 0x00B02E50-0x00B03060
	public void GameBegginInit(); // 0x00B03060-0x00B03064
	public void LoadSaver(); // 0x00B03064-0x00B0391C
	private void initCharacters(); // 0x00B02B80-0x00B02E4C
	public Character GetCharacterByName(string CharacterName); // 0x00B0391C-0x00B03A94
	public void KnowCharacter(string CharacterName); // 0x00B03F40-0x00B03F60
	public void TimeFlow(); // 0x00B03F60-0x00B04054
	public List<Character> GetKnowCharacter(); // 0x00B04054-0x00B041A4
	public bool CheckKnowCharacter(string characterName); // 0x00B041A4-0x00B04334
	public void CharacterGone(string characterName); // 0x00B04334-0x00B044B8
	public Sprite GetCharacterPortrait(string characterName); // 0x00B044B8-0x00B045DC
	public Sprite GetCharacterHeadPortrait(string characterName); // 0x00B045DC-0x00B04700
	public int GainRelationship(string characterName, int value); // 0x00B04700-0x00B047C8
	public List<BattleFiledPartner> GetAwaliabelBattleFiledPartners(); // 0x00B048A8-0x00B04A90
	private BattleFiledPartner GetSpecificBattleFiledPartner(string chaName, int chaLevel); // 0x00B03C0C-0x00B03D98
	public bool CheckCurrentBattlePartnerOutOfLimit(); // 0x00B04A90-0x00B04AEC
	public void RelationshipUpgrade(string characterName); // 0x00B04B6C-0x00B04B9C
	public void SetCharacterPartner(string characterName); // 0x00B03A94-0x00B03C0C
	public void LoseCharacterPartner(string characterName); // 0x00B04BAC-0x00B04E04
	public void AddEffectivePartner(BattleFiledPartner battleFiledPartner); // 0x00B04E04-0x00B04E6C
	public int GetCurrentBattlePartnerLimit(); // 0x00B04AEC-0x00B04B6C
	public Character GetChaByRelationshipType(RelationshipWithHero relationship); // 0x00B04E6C-0x00B0501C
}

[Serializable]
public class CharacterManagerSaver // TypeDefIndex: 6324
{
	// Fields
	public List<CharacterSaver> characterSavers; // 0x10

	// Constructors
	public CharacterManagerSaver(); // 0x00B028C0-0x00B028C8

	// Methods
	public CharacterSaver GetCharacterSaverByCharcterName(string characterName); // 0x00B029FC-0x00B02B74
}

<<END>>

### CharacterSettingGraph (TDI )

<<CODE>>
	public class CharacterSettingGraph : EvenLineGraph // TypeDefIndex: 6692
	{
		// Constructors
		public CharacterSettingGraph(); // 0x0177876C-0x01778774
	
		// Methods
		public Character GetCharacter(); // 0x017784D0-0x017786CC
	}
}

public enum CharacterStat // TypeDefIndex: 6258
{
	Unknown = 0,
	Known = 1,
	Gone = 2
}

public enum CharacterStoryType // TypeDefIndex: 6386
{
	RelationshipUpgrade = 0,
	RandomEvent = 1,
	MapAreaEvent = 2,
	MainEvent = 3
}

<<END>>

### ChestEventNode (TDI )

<<CODE>>
	public class ChestEventNode : AdventureEventNodeElement // TypeDefIndex: 6687
	{
		// Fields
		public ChestEvent chestEvent; // 0x38
	
		// Constructors
		public ChestEventNode(); // 0x00D95944-0x00D9594C
	
		// Methods
		public override void InitThis(); // 0x00D958DC-0x00D9593C
		public override AdventrueEvent GetAdventureEvent(); // 0x00D9593C-0x00D95944
	}
}

<<END>>

### CommodyDisplay (TDI )

<<CODE>>
public class CommodyDisplay : MonoBehaviour // TypeDefIndex: 6279
{
	// Fields
	public EquipmentGrid equipmentGrid; // 0x18
	[HideInInspector] // 0x007C5680-0x007C5690
	public Commody DisplayCommody; // 0x20
	public FDText priceLabel; // 0x28
	public FDText amountLabel; // 0x30

	// Constructors
	public CommodyDisplay(); // 0x00B08574-0x00B0857C

	// Methods
	public void ShowCommody(Commody commody); // 0x00B08428-0x00B08574
	[CompilerGenerated] // 0x007C970C-0x007C971C
	private void _ShowCommody_b__4_0(); // 0x00B0857C-0x00B08650
	[CompilerGenerated] // 0x007C971C-0x007C972C
	private void _ShowCommody_b__4_2(); // 0x00B08650-0x00B086D0
	[CompilerGenerated] // 0x007C972C-0x007C973C
	private void _ShowCommody_b__4_1(); // 0x00B086D0-0x00B087A4
	[CompilerGenerated] // 0x007C973C-0x007C974C
	private void _ShowCommody_b__4_3(); // 0x00B087A4-0x00B08824
}

<<END>>

### ConditionCheckerNode (TDI )

<<CODE>>
	public class ConditionCheckerNode : EventLineElementNode // TypeDefIndex: 6674
	{
		// Fields
		[HideInInspector] // 0x007C62B4-0x007C62FC
		[Input] // 0x007C62B4-0x007C62FC
		public bool InputElement; // 0x48
		[HideInInspector] // 0x007C62FC-0x007C6344
		[Output] // 0x007C62FC-0x007C6344
		public bool OutputTure; // 0x49
		[HideInInspector] // 0x007C6344-0x007C638C
		[Output] // 0x007C6344-0x007C638C
		public bool OutputFalse; // 0x4A
		[HideInInspector] // 0x007C638C-0x007C639C
		public ConditionChecker conditionChecker; // 0x50
	
		// Constructors
		public ConditionCheckerNode(); // 0x00D95BFC-0x00D95C04
	
		// Methods
		public override void UpdateStoryEventData(); // 0x00D95A34-0x00D95BD0
		public override StoryEventElement GetStoryEventData(); // 0x00D95BD0-0x00D95BFC
	}
}

public enum ConditionCheckerType // TypeDefIndex: 6362
{
	Fight = 0,
	Condition = 1
}

[Serializable]
<<END>>

### ConditionSwichNode (TDI )

<<CODE>>
	public class ConditionSwichNode : EventLineElementNode // TypeDefIndex: 6675
	{
		// Fields
		[HideInInspector] // 0x007C639C-0x007C63E4
		[Input] // 0x007C639C-0x007C63E4
		public bool InputElement; // 0x48
		[HideInInspector] // 0x007C63E4-0x007C642C
		[Output] // 0x007C63E4-0x007C642C
		public bool Output1; // 0x49
		[HideInInspector] // 0x007C642C-0x007C6474
		[Output] // 0x007C642C-0x007C6474
		public bool Output2; // 0x4A
		[HideInInspector] // 0x007C6474-0x007C64BC
		[Output] // 0x007C6474-0x007C64BC
		public bool Output3; // 0x4B
		[HideInInspector] // 0x007C64BC-0x007C6504
		[Output] // 0x007C64BC-0x007C6504
		public bool Output4; // 0x4C
		[HideInInspector] // 0x007C6504-0x007C654C
		[Output] // 0x007C6504-0x007C654C
		public bool Output5; // 0x4D
		[HideInInspector] // 0x007C654C-0x007C6594
		[Output] // 0x007C654C-0x007C6594
		public bool Output6; // 0x4E
		[HideInInspector] // 0x007C6594-0x007C65DC
		[Output] // 0x007C6594-0x007C65DC
		public bool Output7; // 0x4F
		[HideInInspector] // 0x007C65DC-0x007C6624
		[Output] // 0x007C65DC-0x007C6624
		public bool DefautOutput; // 0x50
		[HideInInspector] // 0x007C6624-0x007C6634
		public ConditionSwich conditionSwich; // 0x58
	
		// Constructors
		public ConditionSwichNode(); // 0x00D95F6C-0x00D95F74
	
		// Methods
		public override void UpdateStoryEventData(); // 0x00D95C0C-0x00D95F40
		public override StoryEventElement GetStoryEventData(); // 0x00D95F40-0x00D95F6C
	}
}

public enum ConditionSwichType // TypeDefIndex: 6367
{
	Random = 0,
	Conditions = 1
}

public enum ConditionType // TypeDefIndex: 6360
{
	属性 = 0,
	拥有物品 = 1,
	剧情转折点 = 2,
	角色好感度 = 3,
	角色年龄 = 4,
	主角年龄段 = 5,
	处于主角年龄区间 = 6,
	主角生死 = 7,
	年代 = 8,
	回合区间 = 9,
	恶兆危机 = 10,
	认识角色 = 11,
	游戏胜利 = 12,
	恶兆水晶是否为满值 = 13,
	行动力 = 14,
	角色好感度等级 = 15
}

<<END>>

### EvenLineGraph (TDI )

<<CODE>>
	public class EvenLineGraph : NodeGraph // TypeDefIndex: 6691
	{
		// Fields
		public string EventLineName; // 0x20
		public List<StoryTurningPoint> storyTurningPoints; // 0x28
		public List<Condition> conditionsNeed; // 0x30
		public List<Condition> conditionsAbandon; // 0x38
	
		// Constructors
		public EvenLineGraph(); // 0x01778774-0x0177877C
	
		// Methods
		public override Node AddNode(Type type); // 0x0177877C-0x017788C4
		public override Node CopyNode(Node original); // 0x017788C4-0x017789EC
		public string[] GetStoryTurningPointsKeyArray(); // 0x017789EC-0x01778B68
		public string[] GetAllStat(string key); // 0x01778B68-0x01778DA8
		public List<StoryEventElement> GetAllEventElement(); // 0x01778DA8-0x01779094
		public List<StoryLine> GetAllStoryLine(); // 0x01779094-0x017793B4
		public Story GetStory(); // 0x017786CC-0x0177876C
	}
}

<<END>>

### EventLineElementNode (TDI )

<<CODE>>
	public class EventLineElementNode : Node // TypeDefIndex: 6677
	{
		// Fields
		[HideInInspector] // 0x007C6634-0x007C6644
		public EventLineNodeType nodeType; // 0x30
		[HideInInspector] // 0x007C6644-0x007C6654
		public bool IsPrepare; // 0x34
		[HideInInspector] // 0x007C6654-0x007C6664
		public EventPriority eventPriority; // 0x38
		public string NodeId; // 0x40
	
		// Constructors
		public EventLineElementNode(); // 0x00D95C04-0x00D95C0C
	
		// Methods
		protected override void Init(); // 0x00D95F74-0x00D95F80
		public void NewSetId(); // 0x00D95F80-0x00D95FC0
		public void SetId(); // 0x00D95FC0-0x00D96118
		public override object GetValue(NodePort port); // 0x00D96118-0x00D961D4
		public virtual StoryEventElement GetStoryEventData(); // 0x00D961D4-0x00D961DC
		public virtual void UpdateStoryEventData(); // 0x00D961DC-0x00D961E0
		public void SetAllChidrenPriority(EventPriority eventPriority); // 0x00D961E0-0x00D96528
		public void TestSetAllChidrenValue(bool isprepare, EventPriority eventPriority); // 0x00D96528-0x00D9685C
	}

	[Serializable]
	[NodeTint] // 0x007C424C-0x007C4294
	[NodeWidth] // 0x007C424C-0x007C4294
<<END>>

### EventLineInfoNode (TDI )

<<CODE>>
	public class EventLineInfoNode : EventLineElementNode // TypeDefIndex: 6678
	{
		// Fields
		[HideInInspector] // 0x007C6664-0x007C6674
		public bool IsMainInfo; // 0x48
		[HideInInspector] // 0x007C6674-0x007C6684
		public string MainInfoName; // 0x50
	
		// Constructors
		public EventLineInfoNode(); // 0x00D969B4-0x00D969BC
	
		// Methods
		protected override void Init(); // 0x00D9685C-0x00D96864
		public void UpdateStoryTurningPoints(); // 0x00D96864-0x00D969B4
	}

	public enum EventLineNodeType // TypeDefIndex: 6676
	{
		InfoNode = 0,
		EventLineNode = 1,
		StoryLineRootNode = 2
	}
}

<<END>>

### EventManager (TDI )

<<CODE>>
public class EventManager : MonoSingleton<EventManager>, ISaveAndLoad, IGameProcess // TypeDefIndex: 6299
{
	// Fields
	private List<EventRateDefaultSetting> eventRateDefaultSettings; // 0x18
	[CompilerGenerated] // 0x007C57C0-0x007C57D0
	private List<Story> _AllStory_k__BackingField; // 0x20
	[HideInInspector] // 0x007C57D0-0x007C57E0
	public List<Story> ThisGameActiveStory; // 0x28
	[HideInInspector] // 0x007C57E0-0x007C57F0
	public List<MainEvent> ThisYearMainEvent; // 0x30
	[CompilerGenerated] // 0x007C57F0-0x007C5800
	private List<StoryTurningPoint> _storyTurningPoints_k__BackingField; // 0x38
	[CompilerGenerated] // 0x007C5800-0x007C5810
	private List<StoryLine> _allStoryLine_k__BackingField; // 0x40
	[CompilerGenerated] // 0x007C5810-0x007C5820
	private List<StoryLine> _activeStoryLinesThisGame_k__BackingField; // 0x48
	[CompilerGenerated] // 0x007C5820-0x007C5830
	private List<StoryLine> _currentYearActiveStoryLines_k__BackingField; // 0x50
	[CompilerGenerated] // 0x007C5830-0x007C5840
	private List<StoryLine> _ThisTurnStoryLines_k__BackingField; // 0x58
	public List<Story> MapAreaStoryList; // 0x60
	private MapAreaActivity mapAreaActivity; // 0x68
	private MapEventStatCounter mapEventStatCounter; // 0x70
	public List<StoryLine> EvilCrystalCrisisStorise; // 0x78
	public EvilCrystal evilCrystal; // 0x80
	public StoryLine winStoryLine; // 0x88
	public StoryLine deadStoryLine; // 0x90
	[CompilerGenerated] // 0x007C5840-0x007C5850
	private List<string> _EventRecordCountainer_k__BackingField; // 0x98
	[CompilerGenerated] // 0x007C5850-0x007C5860
	private bool _IsSkipEventOpen_k__BackingField; // 0xA0
	[CompilerGenerated] // 0x007C5860-0x007C5870
	private bool _IsSkipBattleEventOpen_k__BackingField; // 0xA1

	// Properties
	[HideInInspector] // 0x007D0508-0x007D0518
	public List<Story> AllStory { [CompilerGenerated] /* 0x007C99D0-0x007C99E0 */ get; [CompilerGenerated] /* 0x007C99E0-0x007C99F0 */ set; } // 0x00B47A74-0x00B47A7C 0x00B47A7C-0x00B47A84
	[HideInInspector] // 0x007D0518-0x007D0528
	public List<StoryTurningPoint> storyTurningPoints { [CompilerGenerated] /* 0x007C99F0-0x007C9A00 */ get; [CompilerGenerated] /* 0x007C9A00-0x007C9A10 */ set; } // 0x00B47A84-0x00B47A8C 0x00B47A8C-0x00B47A94
	public List<StoryLine> allStoryLine { [CompilerGenerated] /* 0x007C9A10-0x007C9A20 */ get; [CompilerGenerated] /* 0x007C9A20-0x007C9A30 */ set; } // 0x00B47A94-0x00B47A9C 0x00B47A9C-0x00B47AA4
	public List<StoryLine> activeStoryLinesThisGame { [CompilerGenerated] /* 0x007C9A30-0x007C9A40 */ get; [CompilerGenerated] /* 0x007C9A40-0x007C9A50 */ set; } // 0x00B47AA4-0x00B47AAC 0x00B47AAC-0x00B47AB4
	public List<StoryLine> currentYearActiveStoryLines { [CompilerGenerated] /* 0x007C9A50-0x007C9A60 */ get; [CompilerGenerated] /* 0x007C9A60-0x007C9A70 */ set; } // 0x00B47AB4-0x00B47ABC 0x00B47ABC-0x00B47AC4
	public List<StoryLine> ThisTurnStoryLines { [CompilerGenerated] /* 0x007C9A70-0x007C9A80 */ get; [CompilerGenerated] /* 0x007C9A80-0x007C9A90 */ set; } // 0x00B47AC4-0x00B47ACC 0x00B47ACC-0x00B47AD4
	public List<string> EventRecordCountainer { [CompilerGenerated] /* 0x007C9A90-0x007C9AA0 */ get; [CompilerGenerated] /* 0x007C9AA0-0x007C9AB0 */ set; } // 0x00B49950-0x00B49958 0x00B49958-0x00B49960
	public bool IsSkipEventOpen { [CompilerGenerated] /* 0x007C9AB0-0x007C9AC0 */ get; [CompilerGenerated] /* 0x007C9AC0-0x007C9AD0 */ set; } // 0x00B49960-0x00B49968 0x00B49968-0x00B49974
	public bool IsSkipBattleEventOpen { [CompilerGenerated] /* 0x007C9AD0-0x007C9AE0 */ get; [CompilerGenerated] /* 0x007C9AE0-0x007C9AF0 */ set; } // 0x00B49974-0x00B4997C 0x00B4997C-0x00B49988

	// Constructors
	public EventManager(); // 0x00B49988-0x00B499F8

	// Methods
	public int GetPriot(); // 0x00B45958-0x00B45960
	public List<Tuple<SaverType, string, LitJson.JsonData>> Save(); // 0x00B45960-0x00B45A9C
	public List<Tuple<SaverType, string, LitJson.JsonData>> SaveAllTimeData(); // 0x00B45D50-0x00B45D58
	public void Init(); // 0x00B45D58-0x00B45DEC
	public void Load(); // 0x00B46F88-0x00B46F8C
	public int CompareTo(object obj); // 0x00B46F8C-0x00B4719C
	public void GameBegginInit(); // 0x00B4719C-0x00B47270
	public void LoadSaver(); // 0x00B472E0-0x00B47818
	private void loadEventRateDefaultSettings(); // 0x00B45DEC-0x00B462B0
	public List<EventRate> GenerateDefaultEventRateList(); // 0x00B478B8-0x00B47A30
	public void LoadStory(); // 0x00B462B0-0x00B467F0
	public void InitAllStory(); // 0x00B47AD4-0x00B48098
	public void ClearCurrentTurnEvents(); // 0x00B481A8-0x00B48210
	public void GetDisplayStoryLineEachTurn(); // 0x00B48210-0x00B48718
	public bool IsThisYearHasEvent(); // 0x00B48718-0x00B48770
	public bool CheckCondition(Condition condition); // 0x00B48770-0x00B48ABC
	public bool CheckCondition(List<Condition> conditions); // 0x00B48098-0x00B481A8
	public string DoEventEffect(EventEffect eft); // 0x00B42E18-0x00B42F90
	public string PreEventEffectStr(EventEffect eft); // 0x00B48C34-0x00B48DAC
	public StoryTurningPoint GetStoryTurningPoint(string key); // 0x00B48ABC-0x00B48C34
	private void loadAllAreaStory(); // 0x00B467F0-0x00B46CA4
	public void InitAllAreaStory(); // 0x00B48DAC-0x00B49424
	public void DoMapActivity(string activityName); // 0x00B49424-0x00B4952C
	public void AddMapEventStatCount(string stat, int count); // 0x00B4952C-0x00B49580
	public bool CheckOneTurnEventStatCount(string stat, int count); // 0x00B49580-0x00B4959C
	public bool CheckAllGameEventStatCount(string stat, int count); // 0x00B4959C-0x00B495B8
	public int GetAllGameStatCount(string str); // 0x00B495B8-0x00B495D4
	public int GetOneTurnStatCount(string str); // 0x00B495D4-0x00B495F0
	public float GetOneTurnRandommValue(string str); // 0x00B495F0-0x00B4960C
	public void TimeFlow(); // 0x00B4960C-0x00B49650
	private void loadAllGameEndEvents(); // 0x00B46E50-0x00B46F88
	private void loadEvilCrystalStorise(); // 0x00B46CA4-0x00B46E50
	public void EvilCrystalValueChange(int value); // 0x00B49760-0x00B49798
	public StoryLine GetCrystalStoryLineByName(string storyLineName); // 0x00B497BC-0x00B49934
	public void SetEvilCrystalEvent(string eventName); // 0x00B49934-0x00B49950
	public void ClearEventRecordCountainer(); // 0x00B45288-0x00B45318
}

[Serializable]
public class EventManagerSaver // TypeDefIndex: 6326
{
	// Fields
	public List<StoryTurningPoint> storyTurningPoints; // 0x10
	public List<StorylineSaver> ActiveStorylinsThisGame; // 0x18
	public List<string> currentYearActiveStoryLines; // 0x20
	public MapEventStatCounter mapEventStatCounter; // 0x28
	public EventCrystalSaver evilCrystalSaver; // 0x30
	public List<string> EventRecordContainer; // 0x38

	// Constructors
	public EventManagerSaver(); // 0x00B499F8-0x00B49A00
	public EventManagerSaver(List<StoryTurningPoint> storyTurningPoints, List<StoryLine> ActiveStorylinsThisGame, List<StoryLine> currentYearActiveStoryLines, MapEventStatCounter mapEventStatCounter, EvilCrystal evilCrystal, List<string> eventRecordContainer); // 0x00B45A9C-0x00B45D50
}

<<END>>

### EventResultNode (TDI )

<<CODE>>
	public class EventResultNode : EventLineElementNode // TypeDefIndex: 6679
	{
		// Fields
		[HideInInspector] // 0x007C6684-0x007C66CC
		[Input] // 0x007C6684-0x007C66CC
		public bool InputElement; // 0x48
		[HideInInspector] // 0x007C66CC-0x007C6714
		[Output] // 0x007C66CC-0x007C6714
		public bool Output1; // 0x49
		[HideInInspector] // 0x007C6714-0x007C6724
		public EventResult eventResult; // 0x50
	
		// Constructors
		public EventResultNode(); // 0x00D96ADC-0x00D96AE4
	
		// Methods
		public override void UpdateStoryEventData(); // 0x00D969BC-0x00D96AB0
		public override StoryEventElement GetStoryEventData(); // 0x00D96AB0-0x00D96ADC
	}
}

<<END>>

### FishArea (TDI )

<<CODE>>
public class FishArea : MonoBehaviour // TypeDefIndex: 6424
{
	// Fields
	public FishAreaRank areaRank; // 0x18
	public float width; // 0x1C

	// Constructors
	public FishArea(); // 0x00B53310-0x00B53318

	// Methods
	public void InitThis(FishAreaRank fishAreaRank); // 0x00B53130-0x00B5322C
	public bool CheckHookIsHere(float x); // 0x00B5322C-0x00B53310
}

public enum FishAreaRank // TypeDefIndex: 6423
{
	blue = 1,
	yellow = 2,
	red = 3
}

<<END>>

### FishBar (TDI )

<<CODE>>
public class FishBar : MonoBehaviour // TypeDefIndex: 6425
{
	// Fields
	public GameObject FishHook; // 0x18
	public FishArea fishAreaPrefabs; // 0x20
	public FishField fishField; // 0x28
	public FDText RewardText; // 0x30
	private float hookSpeed; // 0x38
	private List<FishArea> CurrentFishAreas; // 0x40
	private bool FishBeggin; // 0x48
	private bool isToRigh; // 0x49

	// Nested types
	[CompilerGenerated] // 0x007C4D60-0x007C4D70
	private sealed class __c__DisplayClass12_0 // TypeDefIndex: 6426
	{
		// Fields
		public FishAreaRank fishAreaRank; // 0x10
		public FishBar __4__this; // 0x18

		// Constructors
		public __c__DisplayClass12_0(); // 0x00B541E8-0x00B541F0

		// Methods
		internal void _hookStop_b__1(); // 0x00B54268-0x00B54294
	}

	// Constructors
	public FishBar(); // 0x00B541F0-0x00B541F8

	// Methods
	private void Update(); // 0x00B53318-0x00B53328
	public void SetFishBar(); // 0x00B5348C-0x00B53A38
	public void DoFishBeggin(); // 0x00B53B90-0x00B53B9C
	private void FishHookMove(); // 0x00B53328-0x00B5348C
	public void hookStop(); // 0x00B53B9C-0x00B541E8
	private float getFishAreaWidth(FishAreaRank fishAreaRank); // 0x00B53A38-0x00B53B90
	[CompilerGenerated] // 0x007CB4B0-0x007CB4C0
	private void _hookStop_b__12_0(); // 0x00B541F8-0x00B54210
}

<<END>>

### FishField (TDI )

<<CODE>>
public class FishField : MonoBehaviour // TypeDefIndex: 6427
{
	// Fields
	public GameObject FishBarArea; // 0x18
	public FDText text; // 0x20
	public FDButton btn; // 0x28
	public GameObject ShowRelic; // 0x30
	private FDFramworkEvent fishEndEvent; // 0x38

	// Nested types
	[CompilerGenerated] // 0x007C4D70-0x007C4D80
	private sealed class __c__DisplayClass11_0 // TypeDefIndex: 6428
	{
		// Fields
		public FishField __4__this; // 0x10
		public Relic relic; // 0x18
		public Action __9__2; // 0x20

		// Constructors
		public __c__DisplayClass11_0(); // 0x00B27178-0x00B27180

		// Methods
		internal void _ShowContent_b__0(); // 0x00B27180-0x00B27328
		internal void _ShowContent_b__2(); // 0x00B27330-0x00B27358
	}

	[CompilerGenerated] // 0x007C4D80-0x007C4D90
	private sealed class __c__DisplayClass11_1 // TypeDefIndex: 6429
	{
		// Fields
		public EquipmentGrid tem; // 0x10

		// Constructors
		public __c__DisplayClass11_1(); // 0x00B27328-0x00B27330

		// Methods
		internal void _ShowContent_b__1(); // 0x00B27358-0x00B273D8
	}

	// Constructors
	public FishField(); // 0x00B54E78-0x00B54E80

	// Methods
	public void InitThis(FDFramworkEvent FishEndEvent); // 0x00B43178-0x00B43274
	public void BegginFishing(); // 0x00B54B6C-0x00B54C74
	private void DoFishEnd(); // 0x00B54C74-0x00B54CF0
	public void FishEnd(FishAreaRank areaRank); // 0x00B54294-0x00B54B6C
	public void NoFish(); // 0x00B54210-0x00B54268
	public void ShowContent(string str); // 0x00B54DC8-0x00B54E78
	public void ShowContent(string str, Relic relic); // 0x00B54CF0-0x00B54DC8
	[CompilerGenerated] // 0x007CB4C0-0x007CB4D0
	private void _InitThis_b__5_0(); // 0x00B54E80-0x00B54E84
	[CompilerGenerated] // 0x007CB4D0-0x007CB4E0
	private void _BegginFishing_b__6_0(); // 0x00B54E84-0x00B54EE4
	[CompilerGenerated] // 0x007CB4E0-0x007CB4F0
	private void _ShowContent_b__10_0(); // 0x00B54EE4-0x00B54FB0
	[CompilerGenerated] // 0x007CB4F0-0x007CB500
	private void _ShowContent_b__10_1(); // 0x00B54FB0-0x00B55FC8
}

<<END>>

### FishStore (TDI )

<<CODE>>
public class FishStore : Store // TypeDefIndex: 6280
{
	// Constructors
	public FishStore(); // 0x00B274E4-0x00B274EC

	// Methods
	public override void InitStore(); // 0x00B273D8-0x00B274D8
	public override void InitStoreAtTurnBeggin(); // 0x00B274D8-0x00B274E4
}

<<END>>

### GameManager (TDI )

<<CODE>>
public class GameManager : MonoSingleton<GameManager>, ISaveAndLoad, IGameProcess // TypeDefIndex: 6305
{
	// Fields
	public Hero hero; // 0x18
	public TimeSystem timeSystem; // 0x20
	public GameConst gameConst; // 0x28
	private AsyncOperation async; // 0x30
	[CompilerGenerated] // 0x007C5870-0x007C5880
	private BegginGameType _begginGameType_k__BackingField; // 0x38
	[CompilerGenerated] // 0x007C5880-0x007C5890
	private LoadSceneStat _loadSceneStat_k__BackingField; // 0x3C
	[HideInInspector] // 0x007C5890-0x007C58A0
	public int Soul; // 0x40
	[CompilerGenerated] // 0x007C58A0-0x007C58B0
	private bool _isGameOver_k__BackingField; // 0x44
	[CompilerGenerated] // 0x007C58B0-0x007C58C0
	private string _KillBy_k__BackingField; // 0x48
	[CompilerGenerated] // 0x007C58C0-0x007C58D0
	private AgeStage _LastAgeStat_k__BackingField; // 0x50
	[CompilerGenerated] // 0x007C58D0-0x007C58E0
	private int _BattleSpeed_k__BackingField; // 0x54
	[CompilerGenerated] // 0x007C58E0-0x007C58F0
	private bool _IsWatchSpeedAds_k__BackingField; // 0x58
	public EndingEventDirector eventDirector; // 0x60
	[CompilerGenerated] // 0x007C58F0-0x007C5900
	private int _TotalMoneyGain_k__BackingField; // 0x68
	[CompilerGenerated] // 0x007C5900-0x007C5910
	private WorldDifficulty _worldDifficulty_k__BackingField; // 0x6C
	[CompilerGenerated] // 0x007C5910-0x007C5920
	private int _worldDifficultyLevel_k__BackingField; // 0x70
	public ADManager adManager; // 0x78
	[CompilerGenerated] // 0x007C5920-0x007C5930
	private int _GainArtifactByAdsTime_k__BackingField; // 0x80
	[CompilerGenerated] // 0x007C5930-0x007C5940
	private int _GainRelicByAdsTime_k__BackingField; // 0x84
	public bool IsPassAntiAddition; // 0x88
	public bool isTapTap; // 0x89
	private HykbContext hykbContext; // 0x90
	private AndroidJavaClass fcmSDKClass; // 0x98
	public bool isHYKB; // 0xA0
	private bool isHomeOrMenu; // 0xA1

	// Properties
	public BegginGameType begginGameType { [CompilerGenerated] /* 0x007C9B00-0x007C9B10 */ get; [CompilerGenerated] /* 0x007C9AF0-0x007C9B00 */ set; } // 0x00B2A5DC-0x00B2A5E4 0x00B2A5D4-0x00B2A5DC
	public LoadSceneStat loadSceneStat { [CompilerGenerated] /* 0x007C9B20-0x007C9B30 */ get; [CompilerGenerated] /* 0x007C9B10-0x007C9B20 */ set; } // 0x00B2A5EC-0x00B2A5F4 0x00B2A5E4-0x00B2A5EC
	public bool isGameOver { [CompilerGenerated] /* 0x007C9B94-0x007C9BA4 */ get; [CompilerGenerated] /* 0x007C9BA4-0x007C9BB4 */ set; } // 0x00B2B448-0x00B2B450 0x00B2B450-0x00B2B45C
	public string KillBy { [CompilerGenerated] /* 0x007C9BB4-0x007C9BC4 */ get; [CompilerGenerated] /* 0x007C9BC4-0x007C9BD4 */ set; } // 0x00B2B45C-0x00B2B464 0x00B2B464-0x00B2B46C
	public AgeStage LastAgeStat { [CompilerGenerated] /* 0x007C9BD4-0x007C9BE4 */ get; [CompilerGenerated] /* 0x007C9BE4-0x007C9BF4 */ set; } // 0x00B2B46C-0x00B2B474 0x00B2B474-0x00B2B47C
	public int BattleSpeed { [CompilerGenerated] /* 0x007C9BF4-0x007C9C04 */ get; [CompilerGenerated] /* 0x007C9C04-0x007C9C14 */ set; } // 0x00B2BF94-0x00B2BF9C 0x00B2BF9C-0x00B2BFA4
	public bool IsWatchSpeedAds { [CompilerGenerated] /* 0x007C9C14-0x007C9C24 */ get; [CompilerGenerated] /* 0x007C9C24-0x007C9C34 */ set; } // 0x00B2BFA4-0x00B2BFAC 0x00B2BFAC-0x00B2BFB8
	public int TotalMoneyGain { [CompilerGenerated] /* 0x007C9C34-0x007C9C44 */ get; [CompilerGenerated] /* 0x007C9C44-0x007C9C54 */ set; } // 0x00B2D4FC-0x00B2D504 0x00B2D504-0x00B2D50C
	public WorldDifficulty worldDifficulty { [CompilerGenerated] /* 0x007C9C54-0x007C9C64 */ get; [CompilerGenerated] /* 0x007C9C64-0x007C9C74 */ set; } // 0x00B2D50C-0x00B2D514 0x00B2D514-0x00B2D51C
	public int worldDifficultyLevel { [CompilerGenerated] /* 0x007C9C74-0x007C9C84 */ get; [CompilerGenerated] /* 0x007C9C84-0x007C9C94 */ set; } // 0x00B2D51C-0x00B2D524 0x00B2D524-0x00B2D52C
	public int GainArtifactByAdsTime { [CompilerGenerated] /* 0x007C9C94-0x007C9CA4 */ get; [CompilerGenerated] /* 0x007C9CA4-0x007C9CB4 */ set; } // 0x00B2D52C-0x00B2D534 0x00B2D534-0x00B2D53C
	public int GainRelicByAdsTime { [CompilerGenerated] /* 0x007C9CB4-0x007C9CC4 */ get; [CompilerGenerated] /* 0x007C9CC4-0x007C9CD4 */ set; } // 0x00B2D53C-0x00B2D544 0x00B2D544-0x00B2D54C

	// Nested types
	internal class UnionFcmListenerProxy : AndroidJavaProxy // TypeDefIndex: 6306
	{
		// Constructors
		public UnionFcmListenerProxy(); // 0x00B2D5C4-0x00B2D638

		// Methods
		private void onFcm(int code, string msg); // 0x00B2E31C-0x00B2E91C
	}

	[Serializable]
	[CompilerGenerated] // 0x007C4B90-0x007C4BA0
	private sealed class __c // TypeDefIndex: 6307
	{
		// Fields
		public static readonly __c __9; // 0x00
		public static FDFramworkEvent __9__14_1; // 0x08
		public static FDFramworkEvent __9__33_1; // 0x10
		public static FDFramworkEvent __9__59_0; // 0x18
		public static FDFramworkEvent __9__74_0; // 0x20
		public static Action<string> __9__102_1; // 0x28

		// Constructors
		static __c(); // 0x00B2DC6C-0x00B2DCD0
		public __c(); // 0x00B2DCD0-0x00B2DCD8

		// Methods
		internal void _GameBeggin_b__14_1(); // 0x00B2DCD8-0x00B2DDBC
		internal void _ShowThisTurnEvent_b__33_1(); // 0x00B2DDBC-0x00B2DE80
		internal void _EvilCrystalBattleOver_b__59_0(); // 0x00B2DEAC-0x00B2DFEC
		internal void _PreShowEndEvent_b__74_0(); // 0x00B2DFEC-0x00B2E0A4
		internal void _InitTapAntiAddition_b__102_1(string exception); // 0x00B2E0A4-0x00B2E0A8
	}

	[CompilerGenerated] // 0x007C4BA0-0x007C4BB0
	private sealed class _LoadScene_d__27 : IEnumerator<object> // TypeDefIndex: 6308
	{
		// Fields
		private int __1__state; // 0x10
		private object __2__current; // 0x18
		public GameManager __4__this; // 0x20
		public string SceneName; // 0x28
		private int _nDisPlayProgress_5__2; // 0x30
		private float _progress_5__3; // 0x34

		// Properties
		object IEnumerator<System.Object>.Current { [DebuggerHidden] /* 0x007CFA08-0x007CFA18 */ get; } // 0x00B2E2AC-0x00B2E2B4 
		object IEnumerator.Current { [DebuggerHidden] /* 0x007CFA28-0x007CFA38 */ get; } // 0x00B2E314-0x00B2E31C 

		// Constructors
		[DebuggerHidden] // 0x007CF9E8-0x007CF9F8
		public _LoadScene_d__27(int __1__state); // 0x00B2A69C-0x00B2A6C8

		// Methods
		[DebuggerHidden] // 0x007CF9F8-0x007CFA08
		void IDisposable.Dispose(); // 0x00B2E0A8-0x00B2E0AC
		private bool MoveNext(); // 0x00B2E0AC-0x00B2E2AC
		[DebuggerHidden] // 0x007CFA18-0x007CFA28
		void IEnumerator.Reset(); // 0x00B2E2B4-0x00B2E314
	}

	// Constructors
	public GameManager(); // 0x00B2D9D8-0x00B2DA50

	// Methods
	public int GetPriot(); // 0x00B27B00-0x00B27B08
	public List<Tuple<SaverType, string, LitJson.JsonData>> Save(); // 0x00B27B08-0x00B27BFC
	public List<Tuple<SaverType, string, LitJson.JsonData>> SaveAllTimeData(); // 0x00B27D60-0x00B27D68
	public void Load(); // 0x00B27D68-0x00B27E34
	public void Init(); // 0x00B284E0-0x00B28644
	public void AntiAddition(); // 0x00B28644-0x00B28724
	public int CompareTo(object obj); // 0x00B28ED4-0x00B290E4
	public void GameBegginInit(); // 0x00B290E4-0x00B290E8
	public void LoadSaver(); // 0x00B29718-0x00B298A8
	public void ChangeGameConstValue(string fieldName, double value); // 0x00B298A8-0x00B299A4
	public void GameInit(); // 0x00B290E8-0x00B29718
	public void GameBeggin(); // 0x00B2A0D0-0x00B2A41C
	private void test(); // 0x00B2A41C-0x00B2A420
	public void ShowAgePanel(); // 0x00B2A420-0x00B2A5A8
	public void SwichScene(string SceneName); // 0x00B2A5F4-0x00B2A620
	[IteratorStateMachine] // 0x007C9B30-0x007C9B94
	private IEnumerator LoadScene(string SceneName); // 0x00B2A620-0x00B2A69C
	public void ChangeScene(); // 0x00B2A6C8-0x00B2A6E8
	public void TimeFlow(); // 0x00B2A6E8-0x00B2A990
	private void propertyYearChange(); // 0x00B2AA10-0x00B2AAA0
	private void TurnEnd(); // 0x00B2A990-0x00B2AA10
	public void ShowThisTurnEvent(); // 0x00B2AF58-0x00B2B304
	public BoolMessage TryConsumActionPoint(int value); // 0x00B2B47C-0x00B2B4A0
	public BoolMessage TryConsumMoney(int value); // 0x00B2B550-0x00B2B60C
	public bool CheckHeroOwnRelics(string RelicName); // 0x00B2B60C-0x00B2B720
	public void HeroTotalyDie(); // 0x00B2B720-0x00B2B72C
	public int HeroPorpertyChange(string propertyName, PropertyChangeRange propertyChangeRange); // 0x00B2B72C-0x00B2B75C
	public void AddMaxActionPoint(int value); // 0x00B2BA38-0x00B2BA6C
	public void ActionPointRecover(int value); // 0x00B2BA80-0x00B2BAB0
	public Sprite GetCurrentHeroPortait(); // 0x00B2BAC0-0x00B2BBEC
	public void SetAge(int age); // 0x00B29F0C-0x00B29F34
	public int GainMoney(int value, GainMoneyType gainMoneyType); // 0x00B29F34-0x00B2A028
	public void LoseMoney(int value); // 0x00B2BCF8-0x00B2BD34
	public void GainMoneyNoFamalyWealth(int value); // 0x00B2BD34-0x00B2BD58
	public void SetEvilCrisis(); // 0x00B2B304-0x00B2B42C
	public void EvilCrystalBattleOver(bool isWin); // 0x00B2BD58-0x00B2BEC8
	public void EvilCrystalBattleBeggin(string BattleEventName); // 0x00B2BEC8-0x00B2BF94
	public void OpenQuickSpeed(); // 0x00B2BFB8-0x00B2BFD4
	public void CloseQuickSpeed(); // 0x00B2BFD4-0x00B2BFE0
	public void BegginShowDeadEvent(); // 0x00B2BFE0-0x00B2C134
	public void BegginShowWinEvent(); // 0x00B2C134-0x00B2C288
	public void PreShowEndEvent(); // 0x00B2C288-0x00B2C3C4
	public void ShowGameEndEvent(); // 0x00B2C3F0-0x00B2C500
	public void ReturnToMainMenu(); // 0x00B2C500-0x00B2C7E8
	public void DOReturnToMainMenu(); // 0x00B2D3F8-0x00B2D4FC
	public void CheckAchivement(); // 0x00B2C8FC-0x00B2D3F8
	public void InitTapAntiAddition(); // 0x00B28724-0x00B28880
	public void TapAntiAddition(); // 0x00B28880-0x00B28944
	private void OnApplicationQuit(); // 0x00B2D54C-0x00B2D5C4
	public void InitHYKBSDK(); // 0x00B28944-0x00B28ED4
	private void Update(); // 0x00B2D638-0x00B2D898
	private void OnDestroy(); // 0x00B2D898-0x00B2D9D8
	[CompilerGenerated] // 0x007C9CD4-0x007C9CE4
	private void _Init_b__4_0(); // 0x00B2DA50-0x00B2DA54
	[CompilerGenerated] // 0x007C9CE4-0x007C9CF4
	private void _GameBeggin_b__14_0(); // 0x00B2DA54-0x00B2DA58
	[CompilerGenerated] // 0x007C9CF4-0x007C9D04
	private void _ShowThisTurnEvent_b__33_0(); // 0x00B2DA58-0x00B2DB20
	[CompilerGenerated] // 0x007C9D04-0x007C9D14
	private void _ReturnToMainMenu_b__76_0(); // 0x00B2DB20-0x00B2DB24
	[CompilerGenerated] // 0x007C9D14-0x007C9D24
	private void _DOReturnToMainMenu_b__77_0(); // 0x00B2DB24-0x00B2DB28
	[CompilerGenerated] // 0x007C9D24-0x007C9D34
	private void _InitTapAntiAddition_b__102_0(AntiAddictionCallbackData antiAddictionCallbackData); // 0x00B2DB28-0x00B2DC6C
}

[Serializable]
public class GameManagerSaver // TypeDefIndex: 6327
{
	// Fields
	public TimeSystem timeSystem; // 0x10
	public GameConst gameConst; // 0x18
	public HeroSaver heroSaver; // 0x20
	public bool IsGameOver; // 0x28
	public AgeStage LastAgeStat; // 0x2C
	public int GainArtifactByAdsTime; // 0x30
	public int GainRelicByAdsTime; // 0x34
	[CompilerGenerated] // 0x007C59A0-0x007C59B0
	private WorldDifficulty _worldDifficulty_k__BackingField; // 0x38
	[CompilerGenerated] // 0x007C59B0-0x007C59C0
	private int _worldDifficultyLevel_k__BackingField; // 0x3C
	[CompilerGenerated] // 0x007C59C0-0x007C59D0
	private int _TotalGoldGain_k__BackingField; // 0x40
	[CompilerGenerated] // 0x007C59D0-0x007C59E0
	private bool _isWatchBattleSpeedAdsThisGame_k__BackingField; // 0x44

	// Properties
	public WorldDifficulty worldDifficulty { [CompilerGenerated] /* 0x007C9F44-0x007C9F54 */ get; [CompilerGenerated] /* 0x007C9F54-0x007C9F64 */ set; } // 0x00B2E91C-0x00B2E924 0x00B2E924-0x00B2E92C
	public int worldDifficultyLevel { [CompilerGenerated] /* 0x007C9F64-0x007C9F74 */ get; [CompilerGenerated] /* 0x007C9F74-0x007C9F84 */ set; } // 0x00B2E92C-0x00B2E934 0x00B2E934-0x00B2E93C
	public int TotalGoldGain { [CompilerGenerated] /* 0x007C9F84-0x007C9F94 */ get; [CompilerGenerated] /* 0x007C9F94-0x007C9FA4 */ set; } // 0x00B2E93C-0x00B2E944 0x00B2E944-0x00B2E94C
	public bool isWatchBattleSpeedAdsThisGame { [CompilerGenerated] /* 0x007C9FA4-0x007C9FB4 */ get; [CompilerGenerated] /* 0x007C9FB4-0x007C9FC4 */ set; } // 0x00B2E94C-0x00B2E954 0x00B2E954-0x00B2E960

	// Constructors
	public GameManagerSaver(); // 0x00B2E960-0x00B2E968
	public GameManagerSaver(int i); // 0x00B27BFC-0x00B27D60
}

<<END>>

### GameRecordDisplay (TDI )

<<CODE>>
public class GameRecordDisplay : MonoBehaviour // TypeDefIndex: 6432
{
	// Fields
	public FDText GamePlayTime; // 0x18
	public FDText DieFor; // 0x20
	public FDText EnddingAchive; // 0x28
	public FDText SoulGainText; // 0x30
	public FDText TargetWorld; // 0x38

	// Constructors
	public GameRecordDisplay(); // 0x00B2F568-0x00B2F570

	// Methods
	public void ShowGameRecordDisplay(GameRecord gameRecord); // 0x00B2F318-0x00B2F568
}

<<END>>

### GameRegionManager (TDI )

<<CODE>>
public class GameRegionManager : MonoSingleton<GameRegionManager>, ISaveAndLoad, IGameProcess // TypeDefIndex: 6309
{
	// Fields
	private Transform gameRegion; // 0x18
	private GameObject regionClouds; // 0x20
	[HideInInspector] // 0x007C5940-0x007C5950
	public List<Region> AllRegion; // 0x28
	[HideInInspector] // 0x007C5950-0x007C5960
	public Region currentRegion; // 0x30
	[CompilerGenerated] // 0x007C5960-0x007C5970
	private RegionDisplay _currentRegionDisplay_k__BackingField; // 0x38
	public List<Store> allStores; // 0x40
	[CompilerGenerated] // 0x007C5970-0x007C5980
	private List<FishAreaRank> _awalableFishAreaRanks_k__BackingField; // 0x48

	// Properties
	public Transform GetGameRegion { get; } // 0x00B2F570-0x00B2F68C 
	[HideInInspector] // 0x007D0528-0x007D0538
	public RegionDisplay currentRegionDisplay { [CompilerGenerated] /* 0x007C9D34-0x007C9D44 */ get; [CompilerGenerated] /* 0x007C9D44-0x007C9D54 */ set; } // 0x00B2F68C-0x00B2F694 0x00B2F694-0x00B2F69C
	public GameObject RegionClouds { get; } // 0x00B2F69C-0x00B2F79C 
	public List<FishAreaRank> awalableFishAreaRanks { [CompilerGenerated] /* 0x007C9EE4-0x007C9EF4 */ get; [CompilerGenerated] /* 0x007C9EF4-0x007C9F04 */ set; } // 0x00B314BC-0x00B314C4 0x00B314C4-0x00B314CC

	// Nested types
	[CompilerGenerated] // 0x007C4BB0-0x007C4BC0
	private sealed class _DoShowCloudsAndDoEvents_d__37 : IEnumerator<object> // TypeDefIndex: 6310
	{
		// Fields
		private int __1__state; // 0x10
		private object __2__current; // 0x18
		public GameRegionManager __4__this; // 0x20
		public FDFramworkEvent dFramworkEvent; // 0x28

		// Properties
		object IEnumerator<System.Object>.Current { [DebuggerHidden] /* 0x007CFA58-0x007CFA68 */ get; } // 0x00B32E28-0x00B32E30 
		object IEnumerator.Current { [DebuggerHidden] /* 0x007CFA78-0x007CFA88 */ get; } // 0x00B32E90-0x00B32E98 

		// Constructors
		[DebuggerHidden] // 0x007CFA38-0x007CFA48
		public _DoShowCloudsAndDoEvents_d__37(int __1__state); // 0x00B3140C-0x00B31438

		// Methods
		[DebuggerHidden] // 0x007CFA48-0x007CFA58
		void IDisposable.Dispose(); // 0x00B32D6C-0x00B32D70
		private bool MoveNext(); // 0x00B32D70-0x00B32E28
		[DebuggerHidden] // 0x007CFA68-0x007CFA78
		void IEnumerator.Reset(); // 0x00B32E30-0x00B32E90
	}

	[CompilerGenerated] // 0x007C4BC0-0x007C4BD0
	private sealed class _DoShowCloudsAndHideMapAreaIcon_d__38 : IEnumerator<object> // TypeDefIndex: 6311
	{
		// Fields
		private int __1__state; // 0x10
		private object __2__current; // 0x18
		public GameRegionManager __4__this; // 0x20

		// Properties
		object IEnumerator<System.Object>.Current { [DebuggerHidden] /* 0x007CFAA8-0x007CFAB8 */ get; } // 0x00B32F58-0x00B32F60 
		object IEnumerator.Current { [DebuggerHidden] /* 0x007CFAC8-0x007CFAD8 */ get; } // 0x00B32FC0-0x00B32FC8 

		// Constructors
		[DebuggerHidden] // 0x007CFA88-0x007CFA98
		public _DoShowCloudsAndHideMapAreaIcon_d__38(int __1__state); // 0x00B31438-0x00B31464

		// Methods
		[DebuggerHidden] // 0x007CFA98-0x007CFAA8
		void IDisposable.Dispose(); // 0x00B32E98-0x00B32E9C
		private bool MoveNext(); // 0x00B32E9C-0x00B32F58
		[DebuggerHidden] // 0x007CFAB8-0x007CFAC8
		void IEnumerator.Reset(); // 0x00B32F60-0x00B32FC0
	}

	[CompilerGenerated] // 0x007C4BD0-0x007C4BE0
	private sealed class _DoShowCloudsAndShowMapAreaIcon_d__39 : IEnumerator<object> // TypeDefIndex: 6312
	{
		// Fields
		private int __1__state; // 0x10
		private object __2__current; // 0x18
		public GameRegionManager __4__this; // 0x20

		// Properties
		object IEnumerator<System.Object>.Current { [DebuggerHidden] /* 0x007CFAF8-0x007CFB08 */ get; } // 0x00B33210-0x00B33218 
		object IEnumerator.Current { [DebuggerHidden] /* 0x007CFB18-0x007CFB28 */ get; } // 0x00B33278-0x00B33280 

		// Constructors
		[DebuggerHidden] // 0x007CFAD8-0x007CFAE8
		public _DoShowCloudsAndShowMapAreaIcon_d__39(int __1__state); // 0x00B31464-0x00B31490

		// Methods
		[DebuggerHidden] // 0x007CFAE8-0x007CFAF8
		void IDisposable.Dispose(); // 0x00B330F8-0x00B330FC
		private bool MoveNext(); // 0x00B330FC-0x00B33210
		[DebuggerHidden] // 0x007CFB08-0x007CFB18
		void IEnumerator.Reset(); // 0x00B33218-0x00B33278
	}

	[CompilerGenerated] // 0x007C4BE0-0x007C4BF0
	private sealed class _DoShowCloudsAndShowBattleEventIcon_d__40 : IEnumerator<object> // TypeDefIndex: 6313
	{
		// Fields
		private int __1__state; // 0x10
		private object __2__current; // 0x18
		public GameRegionManager __4__this; // 0x20

		// Properties
		object IEnumerator<System.Object>.Current { [DebuggerHidden] /* 0x007CFB48-0x007CFB58 */ get; } // 0x00B33088-0x00B33090 
		object IEnumerator.Current { [DebuggerHidden] /* 0x007CFB68-0x007CFB78 */ get; } // 0x00B330F0-0x00B330F8 

		// Constructors
		[DebuggerHidden] // 0x007CFB28-0x007CFB38
		public _DoShowCloudsAndShowBattleEventIcon_d__40(int __1__state); // 0x00B31490-0x00B314BC

		// Methods
		[DebuggerHidden] // 0x007CFB38-0x007CFB48
		void IDisposable.Dispose(); // 0x00B32FC8-0x00B32FCC
		private bool MoveNext(); // 0x00B32FCC-0x00B33088
		[DebuggerHidden] // 0x007CFB58-0x007CFB68
		void IEnumerator.Reset(); // 0x00B33090-0x00B330F0
	}

	// Constructors
	public GameRegionManager(); // 0x00B32CFC-0x00B32D6C

	// Methods
	public void ShowRegionClouds(); // 0x00B2F79C-0x00B2F818
	public void LoadRegion(); // 0x00B2F818-0x00B2F948
	public void GameRegionInit(); // 0x00B2A034-0x00B2A0A0
	public void GoToRegion(string RegionName); // 0x00B2F948-0x00B2FC88
	public void GoToOriginMapArea(); // 0x00B2FD84-0x00B2FDE0
	public void UpdateCurrentRegion(); // 0x00B2B42C-0x00B2B448
	public MapArea GetMapAreaAtCurrentRegion(string AreaName); // 0x00B2FDE0-0x00B2FF60
	public MapArea GetMapAreaAtAllRegion(string AreaName); // 0x00B2FF60-0x00B30238
	public void UnlockMapArea(string mapAreaName); // 0x00B30238-0x00B30524
	public void UnlockMapObject(string mapAreaName, string mapObjectName); // 0x00B30524-0x00B30840
	public void HideMapObject(string mapAreaName, string mapObjectName); // 0x00B30840-0x00B30ACC
	public Sprite GetMapAreaIcon(string mapAreaName); // 0x00B30ACC-0x00B30B6C
	public void TurnEnd(); // 0x00B2AF3C-0x00B2AF58
	public void TurnStartInit(); // 0x00B2AC5C-0x00B2AC98
	private void LoadAllStore(); // 0x00B30C68-0x00B30DD0
	public void InitAllStoreAtGameBeggin(); // 0x00B2FC88-0x00B2FD84
	public void InitAllStoreAtNewTurnBeggin(); // 0x00B30B6C-0x00B30C68
	public Store GetStoreByName(string storeName); // 0x00B30DD8-0x00B30F50
	public void BuyCommody(Commody commody); // 0x00B30F50-0x00B31224
	public void AddBattleEventDisplay(string battleEventName); // 0x00B31224-0x00B31240
	public void ShowCloudsAndHideMapAreaIcon(); // 0x00B2AC98-0x00B2ACC4
	public void ShowCloudsAndShowMapAreaIcon(); // 0x00B2A5A8-0x00B2A5D4
	public void ShowCloudsAndShowBattleEventIcon(); // 0x00B2DE80-0x00B2DEAC
	public void ShowCloudsAndDoEvents(FDFramworkEvent dFramworkEvent); // 0x00B2C3C4-0x00B2C3F0
	[IteratorStateMachine] // 0x007C9D54-0x007C9DB8
	private IEnumerator DoShowCloudsAndDoEvents(FDFramworkEvent dFramworkEvent); // 0x00B31390-0x00B3140C
	[IteratorStateMachine] // 0x007C9DB8-0x007C9E1C
	private IEnumerator DoShowCloudsAndHideMapAreaIcon(); // 0x00B31240-0x00B312B0
	[IteratorStateMachine] // 0x007C9E1C-0x007C9E80
	private IEnumerator DoShowCloudsAndShowMapAreaIcon(); // 0x00B312B0-0x00B31320
	[IteratorStateMachine] // 0x007C9E80-0x007C9EE4
	private IEnumerator DoShowCloudsAndShowBattleEventIcon(); // 0x00B31320-0x00B31390
	private void InitFishAreaRanks(); // 0x00B314CC-0x00B3156C
	public void AddFishAreaRanks(FishAreaRank fishAreaRank); // 0x00B3156C-0x00B31604
	public bool CheckHasFishRank(FishAreaRank fishAreaRank); // 0x00B31604-0x00B31704
	public int GetPriot(); // 0x00B31704-0x00B3170C
	public List<Tuple<SaverType, string, LitJson.JsonData>> Save(); // 0x00B3170C-0x00B31A34
	public List<Tuple<SaverType, string, LitJson.JsonData>> SaveAllTimeData(); // 0x00B31D9C-0x00B31DA4
	public void Load(); // 0x00B31DA4-0x00B32324
	public void Init(); // 0x00B3249C-0x00B324C8
	public int CompareTo(object obj); // 0x00B324C8-0x00B326D8
	public void GameBegginInit(); // 0x00B326D8-0x00B32704
	public void LoadSaver(); // 0x00B32704-0x00B32CFC
}

[Serializable]
public class GameRegionManagerSaver // TypeDefIndex: 6328
{
	// Fields
	public List<MapAreaSaver> regionMapAreas; // 0x10
	public List<string> CurrentActiveMapAreas; // 0x18
	public List<string> SpecialEventHappenArea; // 0x20
	public List<string> ActiveMapBattleEvent; // 0x28
	public List<FishAreaRank> fishAreaRanks; // 0x30
	public List<StoreSaver> storeSavers; // 0x38

	// Constructors
	public GameRegionManagerSaver(); // 0x00B33280-0x00B33288
	public GameRegionManagerSaver(Region region); // 0x00B31A34-0x00B31D9C

	// Methods
	public StoreSaver GetStoreSaverByName(string StoreName); // 0x00B32324-0x00B3249C
}

<<END>>

### GameResultPanel (TDI )

<<CODE>>
public class GameResultPanel : FDPanel // TypeDefIndex: 6434
{
	// Fields
	public FDText MainContent; // 0x50
	public FDText SoulGaim; // 0x58
	public GridLayoutDisplay layoutDisplay; // 0x60
	public singleAchivementDisplay achivementDisplay; // 0x68
	public FDText AchivementCount; // 0x70
	public FDText TodayAdRest; // 0x78
	public FDButton GainSoulBtn; // 0x80
	public UIAnimation Bg; // 0x88
	private GameResultPanelContext panelContext; // 0x90

	// Nested types
	[Serializable]
	[CompilerGenerated] // 0x007C4D90-0x007C4DA0
	private sealed class __c // TypeDefIndex: 6435
	{
		// Fields
		public static readonly __c __9; // 0x00
		public static Action __9__11_0; // 0x08
		public static ADManager.VideoAdCallBack __9__13_0; // 0x10

		// Constructors
		static __c(); // 0x00B3411C-0x00B34180
		public __c(); // 0x00B34180-0x00B34188

		// Methods
		internal void _Continue_b__11_0(); // 0x00B34188-0x00B3420C
		internal void _ShowAds_b__13_0(bool isSuccess); // 0x00B3420C-0x00B345B4
	}

	// Constructors
	public GameResultPanel(); // 0x00B34114-0x00B3411C

	// Methods
	public override void OnEnter(BaseContext baseContext); // 0x00B33288-0x00B33704
	public void ShowAllAchiveAchivement(); // 0x00B33704-0x00B3399C
	public void Continue(); // 0x00B33C3C-0x00B33D24
	public void DisplayAdShow(); // 0x00B33D24-0x00B33F24
	public void ShowAds(); // 0x00B33F24-0x00B34114
}

<<END>>

### GreatCollectionNode (TDI )

<<CODE>>
	public class GreatCollectionNode : AdventureEventNodeElement // TypeDefIndex: 6688
	{
		// Fields
		public GreatCollectionEvent collectionEvent; // 0x38
	
		// Constructors
		public GreatCollectionNode(); // 0x00D959B4-0x00D959BC
	
		// Methods
		public override void InitThis(); // 0x00D9594C-0x00D959AC
		public override AdventrueEvent GetAdventureEvent(); // 0x00D959AC-0x00D959B4
	}
}

<<END>>

### GroceryStore (TDI )

<<CODE>>
public class GroceryStore : Store // TypeDefIndex: 6281
{
	// Constructors
	public GroceryStore(); // 0x00B30DD0-0x00B30DD8

	// Methods
	public override void InitStore(); // 0x00B36028-0x00B361F0
	public override void InitStoreAtTurnBeggin(); // 0x00B361F0-0x00B361FC
}

<<END>>

### Hero (TDI )

<<CODE>>
public class Hero : Creature // TypeDefIndex: 6482
{
	// Fields
	public CharacterAge characterAge; // 0x138
	public HeroActionPoint actionPoint; // 0x140
	public HeroLevel heroLevel; // 0x148
	public DeathEsecape deathEsecape; // 0x150
	public int Age; // 0x158
	public int Money; // 0x15C
	public int Charm; // 0x160
	public int Power; // 0x164
	public int Constitution; // 0x168
	public int Wisdom; // 0x16C
	public int Agile; // 0x170
	public int FamilyWealth; // 0x174
	public HeroProfession Profession; // 0x178
	public List<CreatureBattleProperty> ActiveCreatureBattleProperty; // 0x180
	[CompilerGenerated] // 0x007C5BF0-0x007C5C00
	private List<Equipment> _Equipments_k__BackingField; // 0x188
	[CompilerGenerated] // 0x007C5C00-0x007C5C10
	private List<Equipment> _EquipmentBackpack_k__BackingField; // 0x190
	[CompilerGenerated] // 0x007C5C10-0x007C5C20
	private List<string> _RelicBackpack_k__BackingField; // 0x198
	public List<Skill> LearnedSkill; // 0x1A0
	public List<string> heroTalents; // 0x1A8

	// Properties
	public override double battleAttack { get; } // 0x00B36DB8-0x00B36E84 
	public override double battleDefence { get; } // 0x00B3711C-0x00B371B4 
	public override double battleAttackSpeed { get; } // 0x00B371B4-0x00B37248 
	public override double battleBlockingRate { get; } // 0x00B37248-0x00B372B8 
	public override double battleCounterAttackerRate { get; } // 0x00B372B8-0x00B3731C 
	public override double battleCritical { get; } // 0x00B3731C-0x00B37380 
	public override double battleCriticalDegree { get; } // 0x00B37380-0x00B373E4 
	public override double battleDodge { get; } // 0x00B373E4-0x00B37468 
	public override double battleHemophagia { get; } // 0x00B37468-0x00B374CC 
	public override double battleHealthRecover { get; } // 0x00B374CC-0x00B3755C 
	public override double battleSplashDamage { get; } // 0x00B3755C-0x00B375C0 
	public override double GetMaxHealth { get; } // 0x00B376D0-0x00B37764 
	public List<Equipment> Equipments { [CompilerGenerated] /* 0x007CB624-0x007CB634 */ get; [CompilerGenerated] /* 0x007CB634-0x007CB644 */ private set; } // 0x00B37854-0x00B3785C 0x00B3785C-0x00B37864
	public List<Equipment> EquipmentBackpack { [CompilerGenerated] /* 0x007CB644-0x007CB654 */ get; [CompilerGenerated] /* 0x007CB654-0x007CB664 */ private set; } // 0x00B37864-0x00B3786C 0x00B3786C-0x00B37874
	public List<string> RelicBackpack { [CompilerGenerated] /* 0x007CB664-0x007CB674 */ get; [CompilerGenerated] /* 0x007CB674-0x007CB684 */ set; } // 0x00B37E24-0x00B37E2C 0x00B37E2C-0x00B37E34

	// Nested types
	public class Builder // TypeDefIndex: 6483
	{
		// Fields
		private Hero hero; // 0x10

		// Properties
		private Hero getHero { get; } // 0x00B38684-0x00B386F0 

		// Constructors
		public Builder(); // 0x00B299A4-0x00B299AC

		// Methods
		public Builder SetBaseProperty(int power, int constitution, int widom, int agile, int charm, int wealth); // 0x00B29A0C-0x00B29CC4
		public Builder SetBaseInfo(string HeroName, int age); // 0x00B299AC-0x00B29A0C
		public Builder SetProfession(HeroProfession profession, List<CreatureBattleProperty> ActiveCreatureBattleProperty); // 0x00B29CC4-0x00B29D14
		public Builder SetDodge(double dodge); // 0x00B38734-0x00B38770
		public Builder SetAccuracy(double accuracy); // 0x00B38770-0x00B387AC
		public Builder SetCirtical(double critical); // 0x00B387AC-0x00B387E8
		public Builder SetCriticalDegree(double criticalDegree); // 0x00B387E8-0x00B38824
		public Builder SetHemophagia(double hemophagiaValue); // 0x00B38824-0x00B38860
		public Builder SetRidicule(); // 0x00B38860-0x00B38894
		public Builder SetCounterAttackRate(double rate); // 0x00B38894-0x00B388D0
		public Builder AddBeforeAttackEvent(FDFramworkEvent<Creature, Creature> BefforeAttactEvent); // 0x00B388D0-0x00B38914
		public Builder AddOnAttackEvent(FDFramworkEvent<Creature, Creature> OnAttactEvent); // 0x00B38914-0x00B38958
		public Builder AddAfterAttackEvent(FDFramworkEvent<AttackData> AfterAttackEvent); // 0x00B38958-0x00B3899C
		public Builder AddBeforeUnderAttackEvent(FDFramworkEvent<Creature, Creature> BefforeUnderAttactEvent); // 0x00B3899C-0x00B389E0
		public Builder AddOnUnderAttackEvent(FDFramworkEvent<Creature, Creature> OnUnderAttactEvent); // 0x00B389E0-0x00B38A24
		public Builder AddAfterUnderAttackEvent(FDFramworkEvent<AttackData> AfterUnderAttackeEvent); // 0x00B38A24-0x00B38A68
		public Builder AddOnOtherMonsterDieEvent(FDFramworkEvent<Creature, Creature> OnOtherMonsterDieEvent); // 0x00B38A68-0x00B38AAC
		public Builder AddOnMonsterDieEvent(FDFramworkEvent<Creature, Creature> OnMonsterDieEvent); // 0x00B38AAC-0x00B38AF0
		public Builder AddOnKillCreatrueEvent(FDFramworkEvent<Creature, Creature> OnKillCreatrueEvent); // 0x00B38AF0-0x00B38B34
		public Hero Build(); // 0x00B29D14-0x00B29D98
	}

	[Serializable]
	[CompilerGenerated] // 0x007C4E30-0x007C4E40
	private sealed class __c // TypeDefIndex: 6484
	{
		// Fields
		public static readonly __c __9; // 0x00
		public static Comparison<Equipment> __9__75_0; // 0x08

		// Constructors
		static __c(); // 0x00B385DC-0x00B38640
		public __c(); // 0x00B38640-0x00B38648

		// Methods
		internal int _AutoClearEquipments_b__75_0(Equipment x, Equipment y); // 0x00B38648-0x00B38684
	}

	// Constructors
	public Hero(); // 0x00B385D4-0x00B385DC

	// Methods
	public static string[] GetPropertyArray(); // 0x00B361FC-0x00B363DC
	public int GetProperty(string propertyName); // 0x00B363DC-0x00B36660
	public void CorePropertyChange(string propertyName, PropertyChangeRange propertyChangeRange); // 0x00B2B75C-0x00B2BA38
	public void CorePropertyChange(string propertyName, int value); // 0x00B2ACC4-0x00B2AF3C
	public double CaculateLevelBuff(); // 0x00B36660-0x00B36668
	public double CaculateBaseAttack(); // 0x00B36668-0x00B3670C
	public double CaculateBaseDodge(); // 0x00B3670C-0x00B367A4
	public double CaculateBaseAttackSpeedInprove(); // 0x00B367A4-0x00B36840
	public double CaculateBaseBlockRateInprove(); // 0x00B36840-0x00B368DC
	public double CaculateBaseMaxHealth(); // 0x00B368DC-0x00B36974
	public double CaculateBaseDefence(); // 0x00B36974-0x00B36A0C
	public double CaculateBaseCriticalRate(); // 0x00B36A0C-0x00B36AA8
	public double CaculateBaseExpGainImprove(); // 0x00B36AA8-0x00B36B44
	public double GetAllExpGainImprove(); // 0x00B36B44-0x00B36BE8
	public double CaculateBaseRelationshipGainImprove(); // 0x00B36BE8-0x00B36C84
	public double GetAllRelationshipImprove(); // 0x00B36C84-0x00B36D28
	public int EachTurnWealthMoneyGain(); // 0x00B36D28-0x00B36DB8
	public override bool ReadyToDie(); // 0x00B375C0-0x00B376D0
	public void AdjustHealth(); // 0x00B37764-0x00B377B4
	public void SetHero(); // 0x00B377B4-0x00B377E0
	public void BattleEnd(); // 0x00B377E0-0x00B37854
	public void RecoverAllHealth(); // 0x00B2A0A0-0x00B2A0D0
	public void GainEquipment(List<Equipment> equipments); // 0x00B37874-0x00B378DC
	public Equipment GetEquipmentInBackpackById(string id); // 0x00B378DC-0x00B37A54
	public Equipment GetHeroEquipmentByType(EquipmentType equipmentType); // 0x00B37A54-0x00B37B68
	public bool CheckPropertyAvalable(CreatureBattleProperty creatureBattleProperty); // 0x00B37B68-0x00B37C68
	private double GetEquipmentEffect(CreatureBattleProperty creatureBattleProperty); // 0x00B36E84-0x00B3711C
	public void WearEquipment(Equipment equipment); // 0x00B37C68-0x00B37E24
	public void AutoClearEquipments(); // 0x00B2AAA0-0x00B2AC5C
	public List<Relic> GetAllRelics(); // 0x00B37E34-0x00B37FF0
	public List<Relic> GetAllArtifact(); // 0x00B37FF0-0x00B381B0
	public List<Relic> GetAllGift(); // 0x00B35248-0x00B352AC
	public bool CheckContainSkill(string skillName); // 0x00B381B0-0x00B382CC
	public Skill GetSkillByName(string skillName); // 0x00B382CC-0x00B383EC
	public void AddSkill(Skill skill); // 0x00B383EC-0x00B38454
	public void DoAllTalentsEffect(); // 0x00B29D98-0x00B29F0C
	public void LoadAllTalentsEffect(); // 0x00B38454-0x00B385D4
	public bool CheckHasTalents(string talentsName); // 0x00B2BBEC-0x00B2BCF8
	public void LoadHero(HeroSaver heroSaver); // 0x00B27E34-0x00B284E0
}

public class HeroActionPoint // TypeDefIndex: 6480
{
	// Fields
	public int MaxActionPoint; // 0x10
	public int CurrentActionPoint; // 0x14

	// Constructors
	public HeroActionPoint(); // 0x00B38B34-0x00B38B3C
	public HeroActionPoint(int value); // 0x00B38708-0x00B38734

	// Methods
	public void RecoverAll(); // 0x00B2A028-0x00B2A034
	public void Recover(int value); // 0x00B2BAB0-0x00B2BAC0
	public BoolMessage TryConsumActionPoint(int value); // 0x00B2B4A0-0x00B2B550
	public void GainMaxActionPoint(int value); // 0x00B2BA6C-0x00B2BA80
}

public class HeroAeroSkill // TypeDefIndex: 6152
{
	// Fields
	public string AeroSkillName; // 0x10
	public string AeroSkillEffect; // 0x18
	public int currentLevel; // 0x20
	public int begginValue; // 0x24
	public double PowerValue; // 0x28
	public EffectType effectType; // 0x30

	// Constructors
	public HeroAeroSkill(); // 0x00B38B3C-0x00B38B44
	public HeroAeroSkill(string name, string effect, int currentLevel, int begginValue, double PowerValue, EffectType effectType); // 0x00B38B44-0x00B38BA8

	// Methods
	public int GetUpgradeValueNeed(); // 0x00B38BA8-0x00B38C38
	public int GetTargetLevelNeed(int level); // 0x00B38C38-0x00B38CDC
	public int GetCurrentValueNeed(); // 0x00B38CDC-0x00B38D80
	public void ResetHeroAeroSkill(); // 0x00B38D80-0x00B38E88
	public int GetAllSoulConsum(); // 0x00B38E88-0x00B38EE0
	public string GetEffectStr(); // 0x00B38EE0-0x00B390D4
	public void DoEffect(); // 0x00B390D4-0x00B39AB0
}

<<END>>

### HeroTalentBox (TDI )

<<CODE>>
public class HeroTalentBox : MonoBehaviour // TypeDefIndex: 6507
{
	// Fields
	public List<TalentDisplay> talentDisplays; // 0x18
	public FDButton RollBtn; // 0x20
	public FDButton FreeRoll; // 0x28
	public GameObject SoulConsumDisplay; // 0x30
	public FDText TipText; // 0x38

	// Constructors
	public HeroTalentBox(); // 0x00B3B1CC-0x00B3B1D4

	// Methods
	public void InitHeroTalentBox(); // 0x00B3A1B0-0x00B3A794
	public void Roll(); // 0x00B3A824-0x00B3A904
	private int getConsumSoulNum(); // 0x00B3A794-0x00B3A824
	private List<TalentDisplay> GetUnlockTalent(); // 0x00B3AE64-0x00B3AFB0
	private List<TalentDisplay> getLockTalent(); // 0x00B3AFB0-0x00B3B0FC
	public void DORoll(); // 0x00B3A904-0x00B3AE64
	public void RollByAds(); // 0x00B3B0FC-0x00B3B1CC
	[CompilerGenerated] // 0x007CB6A4-0x007CB6B4
	private void _RollByAds_b__11_0(bool isSuccess); // 0x00B3B1D4-0x00B3B2F8
}

public class HeroTalentGenerator // TypeDefIndex: 6155
{
	// Fields
	public List<HeroTalent> heroTalents; // 0x10

	// Nested types
	[Serializable]
	[CompilerGenerated] // 0x007C48D0-0x007C48E0
	private sealed class __c // TypeDefIndex: 6156
	{
		// Fields
		public static readonly __c __9; // 0x00
		public static FDFramworkEvent __9__1_0; // 0x08
		public static FDFramworkEvent __9__1_1; // 0x10
		public static FDFramworkEvent __9__1_2; // 0x18
		public static FDFramworkEvent __9__1_3; // 0x20
		public static FDFramworkEvent<AttackData> __9__1_35; // 0x28
		public static FDFramworkEvent __9__1_4; // 0x30
		public static FDFramworkEvent __9__1_5; // 0x38
		public static FDFramworkEvent __9__1_6; // 0x40
		public static FDFramworkEvent __9__1_7; // 0x48
		public static FDFramworkEvent<AttackData> __9__1_36; // 0x50
		public static FDFramworkEvent __9__1_8; // 0x58
		public static FDFramworkEvent<Creature> __9__1_37; // 0x60
		public static FDFramworkEvent __9__1_9; // 0x68
		public static FDFramworkEvent __9__1_10; // 0x70
		public static FDFramworkEvent __9__1_11; // 0x78
		public static FDFramworkEvent __9__1_12; // 0x80
		public static FDFramworkEvent<Creature> __9__1_38; // 0x88
		public static FDFramworkEvent __9__1_13; // 0x90
		public static FDFramworkEvent<AttackData> __9__1_39; // 0x98
		public static FDFramworkEvent __9__1_14; // 0xA0
		public static FDFramworkEvent __9__1_15; // 0xA8
		public static FDFramworkEvent __9__1_16; // 0xB0
		public static FDFramworkEvent __9__1_17; // 0xB8
		public static FDFramworkEvent __9__1_18; // 0xC0
		public static FDFramworkEvent __9__1_19; // 0xC8
		public static FDFramworkEvent __9__1_20; // 0xD0
		public static FDFramworkEvent __9__1_21; // 0xD8
		public static FDFramworkEvent __9__1_22; // 0xE0
		public static FDFramworkEvent __9__1_23; // 0xE8
		public static FDFramworkEvent __9__1_24; // 0xF0
		public static FDFramworkEvent __9__1_25; // 0xF8
		public static FDFramworkEvent __9__1_26; // 0x100
		public static FDFramworkEvent __9__1_27; // 0x108
		public static FDFramworkEvent __9__1_28; // 0x110
		public static FDFramworkEvent __9__1_29; // 0x118
		public static FDFramworkEvent __9__1_30; // 0x120
		public static FDFramworkEvent __9__1_31; // 0x128
		public static FDFramworkEvent __9__1_32; // 0x130
		public static FDFramworkEvent __9__1_33; // 0x138
		public static FDFramworkEvent __9__1_34; // 0x140

		// Constructors
		static __c(); // 0x009789A8-0x00978A0C
		public __c(); // 0x00978A0C-0x00978A14

		// Methods
		internal void _.ctor_b__1_0(); // 0x00978A14-0x00978B24
		internal void _.ctor_b__1_1(); // 0x00978B24-0x00978C30
		internal void _.ctor_b__1_2(); // 0x00978C30-0x00978CE4
		internal void _.ctor_b__1_3(); // 0x00978CE4-0x00978D90
		internal void _.ctor_b__1_4(); // 0x00978D90-0x00978FF4
		internal void _.ctor_b__1_35(AttackData attackData); // 0x00978FF4-0x00979010
		internal void _.ctor_b__1_5(); // 0x00979010-0x009790C4
		internal void _.ctor_b__1_6(); // 0x009790C4-0x00979178
		internal void _.ctor_b__1_7(); // 0x00979178-0x00979204
		internal void _.ctor_b__1_8(); // 0x00979204-0x00979400
		internal void _.ctor_b__1_36(AttackData attackData); // 0x00979400-0x00979564
		internal void _.ctor_b__1_9(); // 0x00979564-0x009796A8
		internal void _.ctor_b__1_37(Creature cre); // 0x009796A8-0x009797F8
		internal void _.ctor_b__1_10(); // 0x009797F8-0x00979914
		internal void _.ctor_b__1_11(); // 0x00979914-0x009799A4
		internal void _.ctor_b__1_12(); // 0x009799A4-0x00979A30
		internal void _.ctor_b__1_13(); // 0x00979A30-0x00979B74
		internal void _.ctor_b__1_38(Creature cre); // 0x00979B74-0x00979CC0
		internal void _.ctor_b__1_14(); // 0x00979CC0-0x00979E90
		internal void _.ctor_b__1_39(AttackData data); // 0x00979E90-0x00979EC8
		internal void _.ctor_b__1_15(); // 0x00979EC8-0x00979F7C
		internal void _.ctor_b__1_16(); // 0x00979F7C-0x0097A008
		internal void _.ctor_b__1_17(); // 0x0097A008-0x0097A098
		internal void _.ctor_b__1_18(); // 0x0097A098-0x0097A120
		internal void _.ctor_b__1_19(); // 0x0097A120-0x0097A1A8
		internal void _.ctor_b__1_20(); // 0x0097A1A8-0x0097A234
		internal void _.ctor_b__1_21(); // 0x0097A234-0x0097A2BC
		internal void _.ctor_b__1_22(); // 0x0097A2BC-0x0097A344
		internal void _.ctor_b__1_23(); // 0x0097A344-0x0097A3D4
		internal void _.ctor_b__1_24(); // 0x0097A3D4-0x0097A45C
		internal void _.ctor_b__1_25(); // 0x0097A45C-0x0097A4EC
		internal void _.ctor_b__1_26(); // 0x0097A4EC-0x0097A57C
		internal void _.ctor_b__1_27(); // 0x0097A57C-0x0097A60C
		internal void _.ctor_b__1_28(); // 0x0097A60C-0x0097A69C
		internal void _.ctor_b__1_29(); // 0x0097A69C-0x0097A72C
		internal void _.ctor_b__1_30(); // 0x0097A72C-0x0097A7BC
		internal void _.ctor_b__1_31(); // 0x0097A7BC-0x0097A84C
		internal void _.ctor_b__1_32(); // 0x0097A84C-0x0097A8DC
		internal void _.ctor_b__1_33(); // 0x0097A8DC-0x0097A96C
		internal void _.ctor_b__1_34(); // 0x0097A96C-0x0097A9FC
	}

	// Constructors
	public HeroTalentGenerator(); // 0x00B3B2F8-0x00B3E358
}

<<END>>

### LogicGraph (TDI )

<<CODE>>
	public class LogicGraph : NodeGraph // TypeDefIndex: 6665
	{
		// Constructors
		public LogicGraph(); // 0x00D972E4-0x00D972EC
	}

	public abstract class LogicNode : Node // TypeDefIndex: 6668
	{
		// Fields
		public Action onStateChange; // 0x30
	
		// Properties
		public abstract bool led { get; }
	
		// Constructors
		protected LogicNode(); // 0x00D97268-0x00D97270
	
		// Methods
		public void SendSignal(NodePort output); // 0x00D970AC-0x00D971FC
		protected abstract void OnInputChanged();
		public override void OnCreateConnection(NodePort from, NodePort to); // 0x00D972EC-0x00D972F8
	}
}

<<END>>

### MainEventNode (TDI )

<<CODE>>
	public class MainEventNode : EventLineElementNode // TypeDefIndex: 6680
	{
		// Fields
		[HideInInspector] // 0x007C6724-0x007C676C
		[Input] // 0x007C6724-0x007C676C
		public bool InputElement; // 0x48
		[HideInInspector] // 0x007C676C-0x007C67B4
		[Output] // 0x007C676C-0x007C67B4
		public bool Output1; // 0x49
		[HideInInspector] // 0x007C67B4-0x007C67FC
		[Output] // 0x007C67B4-0x007C67FC
		public bool Output2; // 0x4A
		[HideInInspector] // 0x007C67FC-0x007C6844
		[Output] // 0x007C67FC-0x007C6844
		public bool Output3; // 0x4B
		[HideInInspector] // 0x007C6844-0x007C688C
		[Output] // 0x007C6844-0x007C688C
		public bool Output4; // 0x4C
		[HideInInspector] // 0x007C688C-0x007C689C
		public MainEvent mainEvent; // 0x50
	
		// Constructors
		public MainEventNode(); // 0x00D96DD4-0x00D96DDC
	
		// Methods
		protected override void Init(); // 0x00D96AE4-0x00D96AF0
		public override void UpdateStoryEventData(); // 0x00D96AF0-0x00D96DA8
		public override StoryEventElement GetStoryEventData(); // 0x00D96DA8-0x00D96DD4
	}
}

<<END>>

### ManagerOfManagers (TDI )

<<CODE>>
public class ManagerOfManagers : MonoSingleton<ManagerOfManagers> // TypeDefIndex: 6073
{
	// Fields
	[HideInInspector] // 0x007C5270-0x007C5280
	public List<GameObject> Managers; // 0x18
	public PackageChannel packageChannel; // 0x20

	// Nested types
	[Serializable]
	[CompilerGenerated] // 0x007C4650-0x007C4660
	private sealed class __c // TypeDefIndex: 6074
	{
		// Fields
		public static readonly __c __9; // 0x00
		public static Comparison<ISaveAndLoad> __9__3_0; // 0x08
		public static Comparison<IGameProcess> __9__4_0; // 0x10
		public static Comparison<IGameProcess> __9__5_0; // 0x18
		public static Comparison<ISaveAndLoad> __9__7_0; // 0x20
		public static Comparison<ISaveAndLoad> __9__8_0; // 0x28

		// Constructors
		static __c(); // 0x00986F88-0x00986FEC
		public __c(); // 0x00986FEC-0x00986FF4

		// Methods
		internal int _InitAllManagers_b__3_0(ISaveAndLoad x, ISaveAndLoad y); // 0x00986FF4-0x009870B0
		internal int _GameBegginInit_b__4_0(IGameProcess x, IGameProcess y); // 0x009870B0-0x0098716C
		internal int _GameContinueInit_b__5_0(IGameProcess x, IGameProcess y); // 0x0098716C-0x00987228
		internal int _GetAllSaverDatas_b__7_0(ISaveAndLoad x, ISaveAndLoad y); // 0x00987228-0x009872E4
		internal int _GetAllTimeSaverDatas_b__8_0(ISaveAndLoad x, ISaveAndLoad y); // 0x009872E4-0x009873A0
	}

	// Constructors
	public ManagerOfManagers(); // 0x00986F18-0x00986F88

	// Methods
	private new void Awake(); // 0x00985CB0-0x00985DDC
	public void InitAllManagers(); // 0x00985DE0-0x0098613C
	public void GameBegginInit(); // 0x0098613C-0x0098641C
	public void GameContinueInit(); // 0x0098641C-0x00986700
	public List<T> GetObjectByType<T>();
	public List<Tuple<SaverType, string, LitJson.JsonData>> GetAllSaverDatas(); // 0x00986700-0x00986B18
	public List<Tuple<SaverType, string, LitJson.JsonData>> GetAllTimeSaverDatas(); // 0x00986C14-0x00986F18
	private void InitYoumeng(); // 0x00985DDC-0x00985DE0
	public static string GenerateID(string signal); // 0x00986B18-0x00986C14
}

<<END>>

### MapAreaStatNode (TDI )

<<CODE>>
	public class MapAreaStatNode : Node // TypeDefIndex: 6642
	{
		// Fields
		public MapAreaStat areaStat; // 0x30
		[Input] // 0x007C5DF0-0x007C5E10
		public bool Input; // 0x38
		[Output] // 0x007C5E10-0x007C5E30
		public bool Output; // 0x39
	
		// Constructors
		public MapAreaStatNode(); // 0x01777874-0x0177787C
	
		// Methods
		public MapAreaStat GetMapAreaStat(); // 0x01777720-0x01777874
	}
}

public enum MapAreaUnlockType // TypeDefIndex: 6547
{
	Normal = 0,
	Hide = 1,
	Born = 2
}

<<END>>

### MapAreasNode (TDI )

<<CODE>>
	public class MapAreasNode : Node // TypeDefIndex: 6643
	{
		// Fields
		public MapArea thisMapArea; // 0x30
		[Output] // 0x007C5E30-0x007C5E50
		public bool Output; // 0x38
	
		// Constructors
		public MapAreasNode(); // 0x017779D8-0x017779E0
	
		// Methods
		public MapArea GetThisMapArea(); // 0x0177787C-0x017779D8
	}
}

<<END>>

### MapAreasSettingGraph (TDI )

<<CODE>>
	public class MapAreasSettingGraph : NodeGraph // TypeDefIndex: 6690
	{
		// Constructors
		public MapAreasSettingGraph(); // 0x01779594-0x0177959C
	
		// Methods
		public List<MapArea> GetMapAreas(); // 0x017793B4-0x01779594
	}
}

<<END>>

### MapBattleArea (TDI )

<<CODE>>
public class MapBattleArea : AdventrueArea // TypeDefIndex: 6557
{
	// Constructors
	public MapBattleArea(string AdventureAreaName, string AdventureAreaDescript, string EnterAdventureAreaDescript, List<LeavingMazeStrAndEffect> hurryLeaveList, List<LeavingMazeStrAndEffect> normalLeaveList, Dictionary<MapExploreStat, AreaEvents> adventureAreaEvents, AdventrueEvent bossEvent, int MaxDepth, int areaLevel, List<AreaEventsDistribution> areaEventsDistributions); // 0x00A9E2C8-0x00A9E304

	// Methods
	public override AdventrueEventType GetSingleEvent(MapExploreStat mapExploreStat); // 0x00A9E304-0x00A9E4B8
	public AdventrueEvent GetAdventureEvent(AdventrueEventType adventrueEventType); // 0x00A9E4B8-0x00A9E920
}

<<END>>

### MapCharacter (TDI )

<<CODE>>
public class MapCharacter : MapObject // TypeDefIndex: 6559
{
	// Constructors
	public MapCharacter(); // 0x00A9E974-0x00A9E97C
}

<<END>>

### MapNpc (TDI )

<<CODE>>
public class MapNpc : MapObject // TypeDefIndex: 6562
{
	// Constructors
	public MapNpc(); // 0x00A9F094-0x00A9F09C
}

[Serializable]
public class MapObject // TypeDefIndex: 6564
{
	// Fields
	public MapObjectType mapObjectType; // 0x10
	public string ObjectName; // 0x18
	public string ObjectDescript; // 0x20
	public string Effect; // 0x28
	public double AppearRate; // 0x30
	public bool isHide; // 0x38
	public List<AgeStage> ForbidonaAgeStage; // 0x40

	// Constructors
	public MapObject(); // 0x00A9E97C-0x00A9E984

	// Methods
	public bool CheckAppear(); // 0x00A9E130-0x00A9E2C0
	public static MapObject GenerateCharacterMapObject(Character character); // 0x00A9F09C-0x00A9F11C
}

<<END>>

### MapObjectNode (TDI )

<<CODE>>
	public class MapObjectNode : Node // TypeDefIndex: 6644
	{
		// Fields
		public MapObject mapObject; // 0x30
		[Input] // 0x007C5E50-0x007C5E70
		public bool Input; // 0x38
	
		// Constructors
		public MapObjectNode(); // 0x017779E8-0x017779F0
	
		// Methods
		public MapObject GetThisMapObject(); // 0x017779E0-0x017779E8
	}
}

public enum MapObjectType // TypeDefIndex: 6563
{
	Item = 0,
	Npc = 1,
	Event = 2,
	Character = 3
}

<<END>>

### MathGraph (TDI )

<<CODE>>
	public class MathGraph : NodeGraph // TypeDefIndex: 6645
	{
		// Constructors
		public MathGraph(); // 0x00D97930-0x00D97938
	}
}

<<END>>

### MathNode (TDI )

<<CODE>>
	public class MathNode : Node // TypeDefIndex: 6661
	{
		// Fields
		[Input] // 0x007C5FC8-0x007C5FE8
		public float a; // 0x30
		[Input] // 0x007C5FE8-0x007C6008
		public float b; // 0x34
		[Output] // 0x007C6008-0x007C6028
		public float result; // 0x38
		public float c; // 0x3C
		public MathType mathType; // 0x40
	
		// Nested types
		public enum MathType // TypeDefIndex: 6662
		{
			Add = 0,
			Subtract = 1,
			Multiply = 2,
			Divide = 3
		}
	
		// Constructors
		public MathNode(); // 0x00D97AD0-0x00D97AD8
	
		// Methods
		public override object GetValue(NodePort port); // 0x00D979A8-0x00D97AD0
	}
}

<<END>>

### Monster (TDI )

<<CODE>>
public class Monster : Creature // TypeDefIndex: 6488
{
	// Fields
	public MonsterSpecies monsterSpecies; // 0x138
	public MonsterRank monsterRank; // 0x13C
	public string monsterDiscript; // 0x140
	public List<string> StuntDiscriptList; // 0x148
	private string attackRange; // 0x150
	private string defenceRange; // 0x158
	private string healthRange; // 0x160
	private string attackeIntervalRange; // 0x168

	// Nested types
	public class Builder // TypeDefIndex: 6489
	{
		// Fields
		private Monster monster; // 0x10

		// Properties
		private Monster getMonster { get; } // 0x00A9F40C-0x00A9F478 

		// Constructors
		public Builder(); // 0x00A9FDCC-0x00A9FDD4

		// Methods
		public Builder SetMonsterBaseInfo(string MonsterName, CreatureSpecies creatureSpecies, MonsterSpecies monsterSpecies, MonsterRank monsterRank); // 0x00A9F478-0x00A9F570
		public Builder SetMonsterDiscript(string discript); // 0x00A9F570-0x00A9F5A4
		public Builder AddMonsterStuntDiscript(string discript); // 0x00A9F5A4-0x00A9F670
		public Builder SetMonsterBaseBattleInfo(string attackRange, string defenceRange, string healthRange, string attackIntervalRange, int AttackTargetNum); // 0x00A9F670-0x00A9F7D8
		public Builder SetDodge(float dodge); // 0x00A9F7D8-0x00A9F818
		public Builder SetAccuracy(float accuracy); // 0x00A9F818-0x00A9F858
		public Builder SetCirtical(float critical); // 0x00A9F858-0x00A9F898
		public Builder SetCriticalDegree(float criticalDegree); // 0x00A9F898-0x00A9F8D8
		public Builder SetHemophagia(float hemophagiaValue); // 0x00A9F8D8-0x00A9F918
		public Builder SetHealthRecover(float healthRecoverValue); // 0x00A9F918-0x00A9F958
		public Builder SetBlockRate(float BlockRate); // 0x00A9F958-0x00A9F998
		public Builder SetRidicule(); // 0x00A9F998-0x00A9F9CC
		public Builder SetCounterAttackRate(float rate); // 0x00A9F9CC-0x00A9FA0C
		public Builder AddBeforeAttackEvent(FDFramworkEvent<Creature, Creature> BefforeAttactEvent); // 0x00A9FA0C-0x00A9FA50
		public Builder AddOnAttackEvent(FDFramworkEvent<Creature, Creature> OnAttactEvent); // 0x00A9FA50-0x00A9FA94
		public Builder AddAfterAttackEvent(FDFramworkEvent<AttackData> AfterAttackEvent); // 0x00A9FA94-0x00A9FAD8
		public Builder AddOnBattleBegginEvents(FDFramworkEvent<Creature> OnBattleBegginEvents); // 0x00A9FAD8-0x00A9FB1C
		public Builder AddBeforeUnderAttackEvent(FDFramworkEvent<Creature, Creature> BefforeUnderAttactEvent); // 0x00A9FB1C-0x00A9FB60
		public Builder AddOnUnderAttackEvent(FDFramworkEvent<Creature, Creature> OnUnderAttactEvent); // 0x00A9FB60-0x00A9FBA4
		public Builder AddAfterUnderAttackEvent(FDFramworkEvent<AttackData> AfterUnderAttackeEvent); // 0x00A9FBA4-0x00A9FBE8
		public Builder AddOnOtherMonsterDieEvent(FDFramworkEvent<Creature, Creature> OnOtherMonsterDieEvent); // 0x00A9FBE8-0x00A9FC2C
		public Builder AddOnMonsterDieEvent(FDFramworkEvent<Creature, Creature> OnMonsterDieEvent); // 0x00A9FC2C-0x00A9FC70
		public Builder AddOnKillCreatrueEvent(FDFramworkEvent<Creature, Creature> OnKillCreatrueEvent); // 0x00A9FC70-0x00A9FCB4
		public Builder AddBattleTimeActivity(float timeInterval, FDFramworkEvent<Creature> activity); // 0x00A9FCB4-0x00A9FD64
		public Monster Build(); // 0x00A9FD64-0x00A9FDCC
	}

	// Constructors
	public Monster(); // 0x00A9F404-0x00A9F40C

	// Methods
	public override void AddBasicBuff(BuffName buffName, int layer); // 0x00A9F11C-0x00A9F158
	public void ReRollBaseInfo(); // 0x00A9F158-0x00A9F1C0
	public void SetLevel(int level); // 0x00A9F1C0-0x00A9F378
	public Monster Clone(); // 0x00A9F378-0x00A9F404
}

public class MonsterGenerater // TypeDefIndex: 6490
{
	// Fields
	[CompilerGenerated] // 0x007C5C20-0x007C5C30
	private List<Monster> _monsters_k__BackingField; // 0x10

	// Properties
	public List<Monster> monsters { [CompilerGenerated] /* 0x007CB684-0x007CB694 */ get; [CompilerGenerated] /* 0x007CB694-0x007CB6A4 */ set; } // 0x00AA4C3C-0x00AA4C44 0x00AA4C44-0x00AA4C4C

	// Nested types
	[Serializable]
	[CompilerGenerated] // 0x007C4E40-0x007C4E50
	private sealed class __c // TypeDefIndex: 6491
	{
		// Fields
		public static readonly __c __9; // 0x00
		public static FDFramworkEvent<Creature, Creature> __9__5_0; // 0x08
		public static FDFramworkEvent<AttackData> __9__5_1; // 0x10
		public static FDFramworkEvent<AttackData> __9__5_2; // 0x18
		public static FDFramworkEvent<AttackData> __9__5_3; // 0x20
		public static FDFramworkEvent<AttackData> __9__5_4; // 0x28
		public static FDFramworkEvent<Creature> __9__5_5; // 0x30
		public static FDFramworkEvent<AttackData> __9__5_6; // 0x38
		public static FDFramworkEvent<Creature> __9__5_7; // 0x40
		public static FDFramworkEvent<AttackData> __9__5_8; // 0x48
		public static FDFramworkEvent<AttackData> __9__5_9; // 0x50
		public static FDFramworkEvent<AttackData> __9__5_10; // 0x58
		public static FDFramworkEvent<AttackData> __9__5_11; // 0x60
		public static FDFramworkEvent<AttackData> __9__5_12; // 0x68
		public static FDFramworkEvent<AttackData> __9__5_13; // 0x70
		public static FDFramworkEvent<Creature> __9__5_14; // 0x78
		public static FDFramworkEvent<AttackData> __9__5_15; // 0x80
		public static FDFramworkEvent<AttackData> __9__5_16; // 0x88
		public static FDFramworkEvent<AttackData> __9__5_17; // 0x90
		public static FDFramworkEvent<AttackData> __9__5_18; // 0x98
		public static FDFramworkEvent<Creature> __9__5_19; // 0xA0
		public static FDFramworkEvent<AttackData> __9__5_20; // 0xA8
		public static FDFramworkEvent<AttackData> __9__5_21; // 0xB0
		public static FDFramworkEvent<Creature> __9__5_22; // 0xB8
		public static FDFramworkEvent<AttackData> __9__5_23; // 0xC0
		public static FDFramworkEvent<Creature> __9__5_24; // 0xC8
		public static FDFramworkEvent<AttackData> __9__5_25; // 0xD0
		public static FDFramworkEvent<AttackData> __9__5_26; // 0xD8
		public static FDFramworkEvent<AttackData> __9__5_27; // 0xE0
		public static FDFramworkEvent<Creature> __9__5_28; // 0xE8
		public static FDFramworkEvent<Creature> __9__5_29; // 0xF0
		public static FDFramworkEvent<AttackData> __9__5_30; // 0xF8
		public static FDFramworkEvent<AttackData> __9__5_31; // 0x100
		public static FDFramworkEvent<Creature, Creature> __9__5_32; // 0x108
		public static FDFramworkEvent<Creature, Creature> __9__5_33; // 0x110
		public static FDFramworkEvent<Creature, Creature> __9__5_34; // 0x118
		public static FDFramworkEvent<Creature, Creature> __9__5_35; // 0x120
		public static FDFramworkEvent<AttackData> __9__5_36; // 0x128
		public static FDFramworkEvent<Creature, Creature> __9__5_37; // 0x130
		public static FDFramworkEvent<AttackData> __9__5_38; // 0x138
		public static FDFramworkEvent<Creature> __9__5_39; // 0x140
		public static FDFramworkEvent<AttackData> __9__5_40; // 0x148
		public static FDFramworkEvent<AttackData> __9__5_41; // 0x150
		public static FDFramworkEvent<Creature> __9__5_42; // 0x158
		public static FDFramworkEvent<Creature> __9__5_43; // 0x160
		public static FDFramworkEvent<AttackData> __9__5_44; // 0x168
		public static FDFramworkEvent<Creature> __9__5_45; // 0x170
		public static FDFramworkEvent<AttackData> __9__5_46; // 0x178
		public static FDFramworkEvent<AttackData> __9__5_47; // 0x180

		// Constructors
		static __c(); // 0x00AA4C4C-0x00AA4CB0
		public __c(); // 0x00AA4CB0-0x00AA4CB8

		// Methods
		internal void _.ctor_b__5_0(Creature thisMonster, Creature otherCreature); // 0x00AA4CB8-0x00AA4D54
		internal void _.ctor_b__5_1(AttackData attackData); // 0x00AA4D54-0x00AA4D98
		internal void _.ctor_b__5_2(AttackData attackData); // 0x00AA4D98-0x00AA4DD8
		internal void _.ctor_b__5_3(AttackData attackData); // 0x00AA4DD8-0x00AA4E18
		internal void _.ctor_b__5_4(AttackData attackData); // 0x00AA4E18-0x00AA4E7C
		internal void _.ctor_b__5_5(Creature creatrue); // 0x00AA4E7C-0x00AA4F3C
		internal void _.ctor_b__5_6(AttackData attackData); // 0x00AA4F3C-0x00AA4F80
		internal void _.ctor_b__5_7(Creature cre); // 0x00AA4F80-0x00AA50F8
		internal void _.ctor_b__5_8(AttackData attadata); // 0x00AA50F8-0x00AA5128
		internal void _.ctor_b__5_9(AttackData attadata); // 0x00AA5128-0x00AA5144
		internal void _.ctor_b__5_10(AttackData attactdata); // 0x00AA5144-0x00AA5178
		internal void _.ctor_b__5_11(AttackData attactdata); // 0x00AA5178-0x00AA51AC
		internal void _.ctor_b__5_12(AttackData attactdata); // 0x00AA51AC-0x00AA5270
		internal void _.ctor_b__5_13(AttackData attactdata); // 0x00AA5270-0x00AA5328
		internal void _.ctor_b__5_14(Creature cre); // 0x00AA5328-0x00AA53A0
		internal void _.ctor_b__5_15(AttackData attactdata); // 0x00AA53A0-0x00AA5478
		internal void _.ctor_b__5_16(AttackData attactdata); // 0x00AA5478-0x00AA54D8
		internal void _.ctor_b__5_17(AttackData attactdata); // 0x00AA54D8-0x00AA5674
		internal void _.ctor_b__5_18(AttackData attactdata); // 0x00AA5674-0x00AA56D0
		internal void _.ctor_b__5_19(Creature creatrue); // 0x00AA56D0-0x00AA57E0
		internal void _.ctor_b__5_20(AttackData attactdata); // 0x00AA57E0-0x00AA5954
		internal void _.ctor_b__5_21(AttackData attactdata); // 0x00AA5954-0x00AA59B0
		internal void _.ctor_b__5_22(Creature creatrue); // 0x00AA59B0-0x00AA5B20
		internal void _.ctor_b__5_23(AttackData attactdata); // 0x00AA5B20-0x00AA5B64
		internal void _.ctor_b__5_24(Creature cre); // 0x00AA5B64-0x00AA5C34
		internal void _.ctor_b__5_25(AttackData attactData); // 0x00AA5C34-0x00AA5CA8
		internal void _.ctor_b__5_26(AttackData attactData); // 0x00AA5CA8-0x00AA5CEC
		internal void _.ctor_b__5_27(AttackData attactData); // 0x00AA5CEC-0x00AA5D2C
		internal void _.ctor_b__5_28(Creature cre); // 0x00AA5D2C-0x00AA5DFC
		internal void _.ctor_b__5_29(Creature creatrue); // 0x00AA5DFC-0x00AA6098
		internal void _.ctor_b__5_30(AttackData attactData); // 0x00AA6098-0x00AA6100
		internal void _.ctor_b__5_31(AttackData attadata); // 0x00AA6100-0x00AA626C
		internal void _.ctor_b__5_32(Creature ata, Creature vic); // 0x00AA626C-0x00AA633C
		internal void _.ctor_b__5_33(Creature ata, Creature vic); // 0x00AA633C-0x00AA640C
		internal void _.ctor_b__5_34(Creature atac, Creature vic); // 0x00AA640C-0x00AA64DC
		internal void _.ctor_b__5_35(Creature atac, Creature vic); // 0x00AA64DC-0x00AA6630
		internal void _.ctor_b__5_36(AttackData attactdata); // 0x00AA6630-0x00AA6674
		internal void _.ctor_b__5_37(Creature attack, Creature victim); // 0x00AA6674-0x00AA6924
		internal void _.ctor_b__5_38(AttackData attadata); // 0x00AA6924-0x00AA69D4
		internal void _.ctor_b__5_39(Creature cre); // 0x00AA69D4-0x00AA6AB4
		internal void _.ctor_b__5_40(AttackData attadata); // 0x00AA6AB4-0x00AA6B08
		internal void _.ctor_b__5_41(AttackData attadata); // 0x00AA6B08-0x00AA6B3C
		internal void _.ctor_b__5_42(Creature cre); // 0x00AA6B3C-0x00AA6C1C
		internal void _.ctor_b__5_43(Creature cre); // 0x00AA6C1C-0x00AA6D24
		internal void _.ctor_b__5_44(AttackData attadata); // 0x00AA6D24-0x00AA6D58
		internal void _.ctor_b__5_45(Creature cre); // 0x00AA6D58-0x00AA6E40
		internal void _.ctor_b__5_46(AttackData attadata); // 0x00AA6E40-0x00AA6F2C
		internal void _.ctor_b__5_47(AttackData attadata); // 0x00AA6F2C-0x00AA6F60
	}

	// Constructors
	public MonsterGenerater(); // 0x00A9FF84-0x00AA4C3C

	// Methods
	public static List<string> GetAllMonsterName(); // 0x00A9FDD4-0x00A9FF84
}

public enum MonsterRank // TypeDefIndex: 6487
{
	Boss = 0,
	Elite = 1,
	Normal = 2,
	Character = 3
}

public enum MonsterSpecies // TypeDefIndex: 6486
{
	Undead = 0,
	Beast = 1,
	Dragon = 2,
	Human = 3,
	Bone = 4
}

<<END>>

### NotNode (TDI )

<<CODE>>
	public class NotNode : LogicNode // TypeDefIndex: 6669
	{
		// Fields
		[HideInInspector] // 0x007C6138-0x007C6180
		[Input] // 0x007C6138-0x007C6180
		public bool input; // 0x38
		[HideInInspector] // 0x007C6180-0x007C61C8
		[Output] // 0x007C6180-0x007C61C8
		public bool output; // 0x39
	
		// Properties
		public override bool led { get; } // 0x00D972F8-0x00D97300 
	
		// Nested types
		[Serializable]
		[CompilerGenerated] // 0x007C51A0-0x007C51B0
		private sealed class __c // TypeDefIndex: 6670
		{
			// Fields
			public static readonly __c __9; // 0x00
			public static Func<bool, bool> __9__4_0; // 0x08
	
			// Constructors
			static __c(); // 0x00D97504-0x00D97568
			public __c(); // 0x00D97568-0x00D97570
	
			// Methods
			internal bool _OnInputChanged_b__4_0(bool x); // 0x00D97570-0x00D97578
		}
	
		// Constructors
		public NotNode(); // 0x00D974F4-0x00D97504
	
		// Methods
		protected override void OnInputChanged(); // 0x00D97300-0x00D97490
		public override object GetValue(NodePort port); // 0x00D97490-0x00D974F4
	}
}

<<END>>

### PartnerDisplay (TDI )

<<CODE>>
public class PartnerDisplay : MonoBehaviour // TypeDefIndex: 6239
{
	// Fields
	public BattleFiledPartner filedPartner; // 0x18
	public FDImage partnerImg; // 0x20
	public FDText PartnerNameText; // 0x28
	public FDText WordPrefabs; // 0x30
	public Transform SayWordPos; // 0x38
	public DisplayBar displayBar; // 0x40
	[HideInInspector] // 0x007C55D0-0x007C55E0
	public Sprite PartnerNormalSprite; // 0x48
	[HideInInspector] // 0x007C55E0-0x007C55F0
	public Sprite PartnerActionSprite; // 0x50
	[CompilerGenerated] // 0x007C55F0-0x007C5600
	private float _battleTime_k__BackingField; // 0x58

	// Properties
	public float battleTime { [CompilerGenerated] /* 0x007C95EC-0x007C95FC */ get; [CompilerGenerated] /* 0x007C95FC-0x007C960C */ set; } // 0x00AA85D4-0x00AA85DC 0x00AA85DC-0x00AA85E4

	// Constructors
	public PartnerDisplay(); // 0x00AA8A50-0x00AA8A58

	// Methods
	private void Update(); // 0x00AA85E4-0x00AA8620
	public bool IsTimeToAction(); // 0x00AA8620-0x00AA865C
	public void InitPartnerDisplay(BattleFiledPartner filedPartner); // 0x00AA865C-0x00AA8770
	public void SayWord(string word); // 0x00AA8794-0x00AA884C
	public void ChangeToActionSprite(); // 0x00AA884C-0x00AA8870
	public void ChangeToStandSprite(); // 0x00AA8770-0x00AA8794
	private void stepAhead(); // 0x00AA8870-0x00AA8960
	private void stepBack(); // 0x00AA8960-0x00AA8A50
}

public class PartnerSkill // TypeDefIndex: 6263
{
	// Constructors
	public PartnerSkill(); // 0x00AA8A58-0x00AA8A60
}

<<END>>

### PartnerTeam (TDI )

<<CODE>>
public class PartnerTeam : MonoBehaviour // TypeDefIndex: 6240
{
	// Fields
	public List<BattleFiledPartner> battleFiledPartners; // 0x18
	public List<Transform> ParnerPos; // 0x20
	public PartnerDisplay partnerDisplayPrefabs; // 0x28
	[CompilerGenerated] // 0x007C5600-0x007C5610
	private List<PartnerDisplay> _currentPartnerDisplays_k__BackingField; // 0x30

	// Properties
	public List<PartnerDisplay> currentPartnerDisplays { [CompilerGenerated] /* 0x007C960C-0x007C961C */ get; [CompilerGenerated] /* 0x007C961C-0x007C962C */ set; } // 0x00AA8D20-0x00AA8D28 0x00AA8D28-0x00AA8D30

	// Constructors
	public PartnerTeam(); // 0x00AA90B8-0x00AA90C0

	// Methods
	public void InitPartnerTeam(List<BattleFiledPartner> battleFiledPartners); // 0x00AA8D30-0x00AA90B8
}

<<END>>

### Player (TDI )

<<CODE>>
public class Player : MonoBehaviour // TypeDefIndex: 6577
{
	// Constructors
	public Player(); // 0x00AA90C8-0x00AA90D0

	// Methods
	private void Start(); // 0x00AA90C0-0x00AA90C4
	private void Update(); // 0x00AA90C4-0x00AA90C8
}

<<END>>

### PotionShop (TDI )

<<CODE>>
public class PotionShop : Store // TypeDefIndex: 6282
{
	// Constructors
	public PotionShop(); // 0x00AA9528-0x00AA9530

	// Methods
	public override void InitStore(); // 0x00AA9324-0x00AA9434
	public override void InitStoreAtTurnBeggin(); // 0x00AA9434-0x00AA9528
}

<<END>>

### PulseNode (TDI )

<<CODE>>
	public class PulseNode : LogicNode, ITimerTick // TypeDefIndex: 6671
	{
		// Fields
		[Space] // 0x007C61C8-0x007C61DC
		public float interval; // 0x38
		[HideInInspector] // 0x007C61DC-0x007C6224
		[Output] // 0x007C61DC-0x007C6224
		public bool output; // 0x3C
		private float timer; // 0x40
	
		// Properties
		public override bool led { get; } // 0x00D97578-0x00D97580 
	
		// Constructors
		public PulseNode(); // 0x00D9769C-0x00D976AC
	
		// Methods
		public void Tick(float deltaTime); // 0x00D97580-0x00D97634
		protected override void OnInputChanged(); // 0x00D97634-0x00D97638
		public override object GetValue(NodePort port); // 0x00D97638-0x00D9769C
	}
}

<<END>>

### RestEventNode (TDI )

<<CODE>>
	public class RestEventNode : AdventureEventNodeElement // TypeDefIndex: 6689
	{
		// Fields
		public RestEvent restEvent; // 0x38
	
		// Constructors
		public RestEventNode(); // 0x00D95A24-0x00D95A2C
	
		// Methods
		public override void InitThis(); // 0x00D959BC-0x00D95A1C
		public override AdventrueEvent GetAdventureEvent(); // 0x00D95A1C-0x00D95A24
	}
}

<<END>>

### RuntimeMathGraph (TDI )

<<CODE>>
	public class RuntimeMathGraph : MonoBehaviour, IPointerClickHandler // TypeDefIndex: 6651
	{
		// Fields
		[Header] // 0x007C5EB0-0x007C5EE8
		public MathGraph graph; // 0x18
		[Header] // 0x007C5EE8-0x007C5F20
		public UGUIMathNode runtimeMathNodePrefab; // 0x20
		public UGUIVector runtimeVectorPrefab; // 0x28
		public UGUIDisplayValue runtimeDisplayValuePrefab; // 0x30
		public Connection runtimeConnectionPrefab; // 0x38
		[Header] // 0x007C5F20-0x007C5F58
		public UGUIContextMenu graphContextMenu; // 0x40
		public UGUIContextMenu nodeContextMenu; // 0x48
		public UGUITooltip tooltip; // 0x50
		[CompilerGenerated] // 0x007C5F58-0x007C5F68
		private ScrollRect _scrollRect_k__BackingField; // 0x58
		private List<UGUIMathBaseNode> nodes; // 0x60
	
		// Properties
		public ScrollRect scrollRect { [CompilerGenerated] /* 0x007CC630-0x007CC640 */ get; [CompilerGenerated] /* 0x007CC640-0x007CC650 */ private set; } // 0x00D98378-0x00D98380 0x00D98380-0x00D98388
	
		// Constructors
		public RuntimeMathGraph(); // 0x00D98A38-0x00D98A40
	
		// Methods
		private void Awake(); // 0x00D98388-0x00D98510
		private void Start(); // 0x00D98510-0x00D98514
		public void Refresh(); // 0x00D98770-0x00D98794
		public void Clear(); // 0x00D98794-0x00D98870
		public void SpawnGraph(); // 0x00D98514-0x00D98770
		public UGUIMathBaseNode GetRuntimeNode(Node node); // 0x00D98870-0x00D98974
		public void SpawnNode(Type type, Vector2 position); // 0x00D98974-0x00D98A00
		public void OnPointerClick(PointerEventData eventData); // 0x00D98A00-0x00D98A38
	}
}

<<END>>

### SaverManager (TDI )

<<CODE>>
public class SaverManager : MonoSingleton<SaverManager>, ISaveAndLoad // TypeDefIndex: 6336
{
	// Fields
	public SaverFile CurrentGameSaveFile; // 0x18
	public SaverFile All_LifeSaverFile; // 0x20

	// Constructors
	public SaverManager(); // 0x00BEEF04-0x00BEEF74

	// Methods
	public void SaverCurrentGameData(); // 0x00BEE4A4-0x00BEE674
	public void SaveAll_LifeGameData(); // 0x00BEE674-0x00BEE848
	public T GetCurrentGameSaver<T>(string key);
	public T GetAlltimeGameSaver<T>(string key);
	public int GetPriot(); // 0x00BEE848-0x00BEE850
	public void Init(); // 0x00BEE850-0x00BEEB5C
	public List<Tuple<SaverType, string, LitJson.JsonData>> Save(); // 0x00BEEB5C-0x00BEEB64
	public List<Tuple<SaverType, string, LitJson.JsonData>> SaveAllTimeData(); // 0x00BEEB64-0x00BEEB6C
	public void Load(); // 0x00BEEB6C-0x00BEEB70
	public int CompareTo(object obj); // 0x00BEEB70-0x00BEED80
	private void saverChangeFile(); // 0x00BEED80-0x00BEEF04
}

public class SaverSystem // TypeDefIndex: 6094
{
	// Fields
	public static string key; // 0x00

	// Constructors
	public SaverSystem(); // 0x00BEFAA8-0x00BEFAB0
	static SaverSystem(); // 0x00BEFAB0-0x00BEFB0C

	// Methods
	public static void SaveObject<T>(string path, string key, T object_Save);
	public static void SaveAllObject<T>(string path, Dictionary<string, T> keyValuePairs);
	public static void SaveAllObjectInPlayerprefabs<T>(string name, Dictionary<string, T> keyValuePairs);
	public static T LoadObject<T>(string path, string key);
	public static bool HasKey(string path, string key); // 0x00BEEF74-0x00BEF26C
	public static Dictionary<string, T> LoadAllObject<T>(string path);
	public static Dictionary<string, T> LoadAllObjectSecret<T>(string path);
	public static Dictionary<string, T> LoadAllObjectInPlayerprefabs<T>(string name);
	public static string ReadText(string filePath); // 0x00BEF31C-0x00BEF36C
	public static LitJson.JsonData ReadJsonData(string filePath); // 0x00BEF26C-0x00BEF31C
	private static void WriteFile(string path, string Value); // 0x00BEF36C-0x00BEF4C4
	public static string AESEncrypt(string Data, string Key); // 0x00BEF4C4-0x00BEF798
	public static string AESDecrypt(string Data, string Key); // 0x00BEF798-0x00BEFAA8
}

public enum SaverType // TypeDefIndex: 6335
{
	CurrentGame = 0,
	All_LifeGame = 1
}

<<END>>

### SceneGraph (TDI )

<<CODE>>
	public class SceneGraph : MonoBehaviour // TypeDefIndex: 5726
	{
		// Fields
		public NodeGraph graph; // 0x18
	
		// Constructors
		public SceneGraph(); // 0x01757168-0x01758170
	}

	public class SceneGraph<T> : SceneGraph // TypeDefIndex: 5727
		where T : NodeGraph
	{
		// Properties
		public T graph { get; set; }
	
		// Constructors
		public SceneGraph();
	}
}

<<END>>

### SkillTreePanel (TDI )

<<CODE>>
public class SkillTreePanel : FDPanel // TypeDefIndex: 6610
{
	// Fields
	public GameObject Temp; // 0x50
	public UIAnimation BG; // 0x58

	// Constructors
	public SkillTreePanel(); // 0x00BFA628-0x00BFA630

	// Methods
	public override void OnEnter(BaseContext baseContext); // 0x00BFA3C4-0x00BFA4E4
	public void ResetHeroAeroSkill(); // 0x00BFA4E4-0x00BFA590
	public void Close(); // 0x00BFA590-0x00BFA628
}

<<END>>

### StateGraph (TDI )

<<CODE>>
	public class StateGraph : NodeGraph // TypeDefIndex: 6648
	{
		// Fields
		public StateNode current; // 0x20
	
		// Constructors
		public StateGraph(); // 0x01777684-0x0177768C
	
		// Methods
		public void Continue(); // 0x017774D4-0x017774EC
	}
}

<<END>>

### StateNode (TDI )

<<CODE>>
	public class StateNode : Node // TypeDefIndex: 6646
	{
		// Fields
		[Input] // 0x007C5E70-0x007C5E90
		public Empty enter; // 0x30
		[Output] // 0x007C5E90-0x007C5EB0
		public Empty exit; // 0x38
	
		// Nested types
		[Serializable]
		public class Empty // TypeDefIndex: 6647
		{
			// Constructors
			public Empty(); // 0x01777718-0x01777720
		}
	
		// Constructors
		public StateNode(); // 0x01777710-0x01777718
	
		// Methods
		public void MoveNext(); // 0x017774EC-0x01777684
		public void OnEnter(); // 0x0177768C-0x01777710
	}
}

<<END>>

### StoryLineNode (TDI )

<<CODE>>
	public class StoryLineNode : EventLineElementNode // TypeDefIndex: 6681
	{
		// Fields
		[HideInInspector] // 0x007C689C-0x007C68E4
		[Output] // 0x007C689C-0x007C68E4
		public bool Output; // 0x48
		public StoryLineType storyLineType; // 0x4C
		public string StoryLineName; // 0x50
		public string NextStoryEventElement; // 0x58
		public string CharacterName; // 0x60
		public string HappenMapArea; // 0x68
		public CharacterStoryType characterStoryType; // 0x70
		public List<Condition> conditions; // 0x78
		public float HappenRate; // 0x80
	
		// Constructors
		public StoryLineNode(); // 0x00D96F14-0x00D96F1C
	
		// Methods
		protected override void Init(); // 0x00D96DDC-0x00D96E54
		public StoryLine GetStoryLine(); // 0x00D96E54-0x00D96F14
	}
}

public enum StoryLineType // TypeDefIndex: 6385
{
	MainStoryLine = 0,
	RandomStoryLine = 1,
	ConditionStoryLine = 2,
	CharacterStoryLine = 3,
	Specail = 4
}

[Serializable]
<<END>>

### TimeFlowPanel (TDI )

<<CODE>>
public class TimeFlowPanel : FDPanel // TypeDefIndex: 6630
{
	// Fields
	public Transform verticalLayoutDisplay; // 0x50
	public UIAnimation TimeFlowSentencePrefabs; // 0x58
	public UIAnimation bg; // 0x60
	public UIAnimation ClickContinueText; // 0x68

	// Nested types
	[Serializable]
	[CompilerGenerated] // 0x007C5150-0x007C5160
	private sealed class __c // TypeDefIndex: 6631
	{
		// Fields
		public static readonly __c __9; // 0x00
		public static FDFramworkEvent __9__5_1; // 0x08
		public static FDFramworkEvent __9__6_1; // 0x10

		// Constructors
		static __c(); // 0x00D85D7C-0x00D85DE0
		public __c(); // 0x00D85DE0-0x00D85DE8

		// Methods
		internal void _ShowTimeFlowContent_b__5_1(); // 0x00D85DE8-0x00D85E60
		internal void _ShowEndEventTimeFlowContent_b__6_1(); // 0x00D85E60-0x00D85ED8
	}

	[CompilerGenerated] // 0x007C5160-0x007C5170
	private sealed class _ShowTimeFlowContent_d__5 : IEnumerator<object> // TypeDefIndex: 6632
	{
		// Fields
		private int __1__state; // 0x10
		private object __2__current; // 0x18
		public TimeFlowPanel __4__this; // 0x20
		private List<string> __7__wrap1; // 0x28

		// Properties
		object IEnumerator<System.Object>.Current { [DebuggerHidden] /* 0x007D0368-0x007D0378 */ get; } // 0x00D86EA0-0x00D86EA8 
		object IEnumerator.Current { [DebuggerHidden] /* 0x007D0388-0x007D0398 */ get; } // 0x00D86F08-0x00D86F10 

		// Constructors
		[DebuggerHidden] // 0x007D0348-0x007D0358
		public _ShowTimeFlowContent_d__5(int __1__state); // 0x00D855FC-0x00D85628

		// Methods
		[DebuggerHidden] // 0x007D0358-0x007D0368
		void IDisposable.Dispose(); // 0x00D8652C-0x00D86548
		private bool MoveNext(); // 0x00D865A0-0x00D86EA0
		private void __m__Finally1(); // 0x00D86548-0x00D865A0
		[DebuggerHidden] // 0x007D0378-0x007D0388
		void IEnumerator.Reset(); // 0x00D86EA8-0x00D86F08
	}

	[CompilerGenerated] // 0x007C5170-0x007C5180
	private sealed class _ShowEndEventTimeFlowContent_d__6 : IEnumerator<object> // TypeDefIndex: 6633
	{
		// Fields
		private int __1__state; // 0x10
		private object __2__current; // 0x18
		public TimeFlowPanel __4__this; // 0x20
		private List<string> __7__wrap1; // 0x28

		// Properties
		object IEnumerator<System.Object>.Current { [DebuggerHidden] /* 0x007D03B8-0x007D03C8 */ get; } // 0x00D864BC-0x00D864C4 
		object IEnumerator.Current { [DebuggerHidden] /* 0x007D03D8-0x007D03E8 */ get; } // 0x00D86524-0x00D8652C 

		// Constructors
		[DebuggerHidden] // 0x007D0398-0x007D03A8
		public _ShowEndEventTimeFlowContent_d__6(int __1__state); // 0x00D85698-0x00D856C4

		// Methods
		[DebuggerHidden] // 0x007D03A8-0x007D03B8
		void IDisposable.Dispose(); // 0x00D85ED8-0x00D85EF4
		private bool MoveNext(); // 0x00D85F4C-0x00D86398
		private void __m__Finally1(); // 0x00D85EF4-0x00D85F4C
		[DebuggerHidden] // 0x007D03C8-0x007D03D8
		void IEnumerator.Reset(); // 0x00D864C4-0x00D86524
	}

	// Constructors
	public TimeFlowPanel(); // 0x00D856C4-0x00D856CC

	// Methods
	public override void OnEnter(BaseContext baseContext); // 0x00D85310-0x00D854E8
	[IteratorStateMachine] // 0x007CC518-0x007CC57C
	private IEnumerator ShowTimeFlowContent(); // 0x00D8558C-0x00D855FC
	[IteratorStateMachine] // 0x007CC57C-0x007CC5E0
	private IEnumerator ShowEndEventTimeFlowContent(); // 0x00D85628-0x00D85698
	[CompilerGenerated] // 0x007CC5E0-0x007CC5F0
	private void _OnEnter_b__4_0(); // 0x00D856CC-0x00D856F8
	[CompilerGenerated] // 0x007CC5F0-0x007CC600
	private void _OnEnter_b__4_1(); // 0x00D856F8-0x00D85724
	[CompilerGenerated] // 0x007CC600-0x007CC610
	private void _ShowTimeFlowContent_b__5_0(); // 0x00D85724-0x00D858D8
	[CompilerGenerated] // 0x007CC610-0x007CC620
	private void _ShowEndEventTimeFlowContent_b__6_0(); // 0x00D85B3C-0x00D85CF0
}

<<END>>

### ToggleNode (TDI )

<<CODE>>
	public class ToggleNode : LogicNode // TypeDefIndex: 6672
	{
		// Fields
		[HideInInspector] // 0x007C6224-0x007C626C
		[Input] // 0x007C6224-0x007C626C
		public bool input; // 0x38
		[HideInInspector] // 0x007C626C-0x007C62B4
		[Output] // 0x007C626C-0x007C62B4
		public bool output; // 0x39
	
		// Properties
		public override bool led { get; } // 0x00D976AC-0x00D976B4 
	
		// Nested types
		[Serializable]
		[CompilerGenerated] // 0x007C51B0-0x007C51C0
		private sealed class __c // TypeDefIndex: 6673
		{
			// Fields
			public static readonly __c __9; // 0x00
			public static Func<bool, bool> __9__4_0; // 0x08
	
			// Constructors
			static __c(); // 0x00D978BC-0x00D97920
			public __c(); // 0x00D97920-0x00D97928
	
			// Methods
			internal bool _OnInputChanged_b__4_0(bool x); // 0x00D97928-0x00D97930
		}
	
		// Constructors
		public ToggleNode(); // 0x00D978B4-0x00D978BC
	
		// Methods
		protected override void OnInputChanged(); // 0x00D976B4-0x00D97850
		public override object GetValue(NodePort port); // 0x00D97850-0x00D978B4
	}
}

<<END>>

### TravelBussinssMan (TDI )

<<CODE>>
public class TravelBussinssMan : Store // TypeDefIndex: 6290
{
	// Constructors
	public TravelBussinssMan(); // 0x00D887C4-0x00D887CC

	// Methods
	public override void InitStore(); // 0x00D8832C-0x00D884D8
	public override void InitStoreAtTurnBeggin(); // 0x00D884D8-0x00D88740
	public override void LoadThisStore(StoreSaver storeSaver); // 0x00D88740-0x00D887C4
}

<<END>>

### UGUIMathBaseNode (TDI )

<<CODE>>
	public class UGUIMathBaseNode : MonoBehaviour, IDragHandler // TypeDefIndex: 6653
	{
		// Fields
		[HideInInspector] // 0x007C5F68-0x007C5F78
		public Node node; // 0x18
		[HideInInspector] // 0x007C5F78-0x007C5F88
		public RuntimeMathGraph graph; // 0x20
		public UnityEngine.UI.Text header; // 0x28
		private UGUIPort[] ports; // 0x30
	
		// Constructors
		public UGUIMathBaseNode(); // 0x01775F3C-0x01775F44
	
		// Methods
		public virtual void Start(); // 0x017758D4-0x017759BC
		public virtual void UpdateGUI(); // 0x01775A64-0x01775A68
		private void LateUpdate(); // 0x01775A68-0x01775AD0
		public UGUIPort GetPort(string name); // 0x01775E6C-0x01775F14
		public void SetPosition(Vector2 pos); // 0x017759BC-0x01775A64
		public void SetName(string name); // 0x01775F14-0x01775F38
		public void OnDrag(PointerEventData eventData); // 0x01775F38-0x01775F3C
	}

<<END>>

### UGUIMathNode (TDI )

<<CODE>>
	public class UGUIMathNode : UGUIMathBaseNode // TypeDefIndex: 6654
	{
		// Fields
		public InputField valA; // 0x38
		public InputField valB; // 0x40
		public Dropdown dropDown; // 0x48
		private MathNode mathNode; // 0x50
	
		// Constructors
		public UGUIMathNode(); // 0x01776300-0x01776308
	
		// Methods
		public override void Start(); // 0x01775F44-0x017760F0
		public override void UpdateGUI(); // 0x017760F0-0x0177626C
		private void OnChangeValA(string val); // 0x0177626C-0x017762A8
		private void OnChangeValB(string val); // 0x017762A8-0x017762E4
		private void OnChangeDropdown(int val); // 0x017762E4-0x01776300
	}

<<END>>

---

## D. Spelling-Bug Symbols (literal preservation required)

- BattelCreature -- 2 occurrences
- Caculate -- 0 occurrences
- Comsum -- 0 occurrences
- Comfirm -- 1 occurrences
- CrulWorld -- 0 occurrences
- CrulWord -- 0 occurrences
- CrulLevel -- 0 occurrences
- CruelWorld -- 0 occurrences
- DeathEsecape -- 5 occurrences
- Equpment -- 0 occurrences
- EqupmentArea -- 4 occurrences
- Mobai -- 0 occurrences
- Achivement -- 6 occurrences
- CharactorStoryLines -- 2 occurrences
- EventRecordCountainer -- 1 occurrences
- EvilCrystalCrisisStorise -- 1 occurrences
- Imporve -- 0 occurrences
- Inprove -- 0 occurrences
- TravelBussinssMan -- 2 occurrences
- SuperLinkEventDic -- 1 occurrences
- Idie -- 0 occurrences

Do NOT auto-correct. These names appear in serialized asset data, runtime field/method names, and possibly UI text.
