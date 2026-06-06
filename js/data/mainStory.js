// 全生命週期主線（強制觸發）
// 每個節點 age = 觸發年齡。options 含 stat 門檻。
// success/fail 各自 text + effects。fail 可能導致永久負面或死亡。

export const MAIN_STORY = [
  {
    age: 0,
    title: '初生覺醒',
    text: '你在神殿中甦醒，命運的齒輪開始轉動。三道天賦之光降臨……',
    type: 'awakening',   // 特殊：天賦選擇
    forced: true
  },
  {
    age: 3,
    title: '幼兒認字',
    text: '母親溫柔地遞出一本古籍，輕聲問：「寶貝，識得這些字嗎？」',
    gate: { int: 12 },
    options: [
      { text: '努力辨認每個字', req: { stat: 'int', min: 12 },
        success: { text: '母親欣慰地撫摸你的頭，贈送你一本《啟蒙寶典》。智力 +5。',
          effects: [{ type: 'stat', stat: 'int', value: 5 }] },
        fail: { text: '你搖搖頭，母親嘆息收起書。你感到羞愧。最大 HP -10。',
          effects: [{ type: 'stat', stat: 'maxHp', value: -10 }] } }
    ]
  },
  {
    age: 6,
    title: '野獸侵襲',
    text: '村莊邊緣的草叢中竄出一隻狂暴的野犬，牠流著涎水撲向你！',
    gate: { str: 15 },
    options: [
      { text: '正面迎擊（力量判定）', req: { stat: 'str', min: 15 },
        success: { text: '你一拳打暈野犬！村民為你歡呼。力量 +2。',
          effects: [{ type: 'stat', stat: 'str', value: 2 }] },
        fail: { text: '你被野犬撲倒咬傷！身體留下殘疾，永久速度 -2。',
          effects: [{ type: 'stat', stat: 'spd', value: -2 }, { type: 'hp', value: -20 }] } },
      { text: '巧妙閃避（靈巧判定）', req: { stat: 'dex', min: 15 },
        success: { text: '你靈活地閃過攻擊並反擊！靈巧 +2。',
          effects: [{ type: 'stat', stat: 'dex', value: 2 }] },
        fail: { text: '你反應慢了一拍，被咬傷手腳。速度 -2。',
          effects: [{ type: 'stat', stat: 'spd', value: -2 }] } }
    ]
  },
  {
    age: 8,
    title: '教堂邂逅',
    text: '在村莊教堂中，你遇見一位金髮碧眼的少女。她名為露西，未來將是聖女。',
    gate: { cha: 18 },
    options: [
      { text: '主動打招呼（魅力判定）', req: { stat: 'cha', min: 18 },
        success: { text: '露西對你嫣然一笑。「你好有趣的人。」她成為你的摯友。',
          effects: [{ type: 'npcAff', npc: 'lucy', value: 30 }] },
        fail: { text: '你太害羞了，露西只是禮貌地點頭。你們只是點頭之交。',
          effects: [{ type: 'npcAff', npc: 'lucy', value: 5 }] } },
      { text: '用學識引起她的注意（智力判定）', req: { stat: 'int', min: 20 },
        success: { text: '你引用了一段經文，露西眼睛發亮。她覺得你是個天才。',
          effects: [{ type: 'npcAff', npc: 'lucy', value: 25 }, { type: 'stat', stat: 'int', value: 2 }] },
        fail: { text: '她禮貌地聽完便離去。你錯失了一段緣分。',
          effects: [] } }
    ]
  },
  {
    age: 10,
    title: '少年遠行',
    text: '父親臥病在床，需要珍貴的「白霧蓮華」才能救治。村後山深處傳說有此藥。',
    gate: { con: 25, gold: 200 },
    options: [
      { text: '花 200 金幣從外地藥商購買', req: { stat: 'gold', min: 200 },
        success: { text: '你買到蓮華，父親病癒！他激動地擁抱你。',
          effects: [{ type: 'gold', value: -200 }, { type: 'flag', key: 'fatherSaved', value: true }, { type: 'fatherAff', value: 100 }] },
        fail: { text: '你囊中羞澀，無法購買。父親咳血加劇。',
          effects: [{ type: 'flag', key: 'fatherSick', value: true }] } },
      { text: '獨自深入後山採摘（體質判定）', req: { stat: 'con', min: 25 },
        success: { text: '你穿越毒霧沼澤，採得蓮華！體質 +3。',
          effects: [{ type: 'stat', stat: 'con', value: 3 }, { type: 'flag', key: 'fatherSaved', value: true }, { type: 'fatherAff', value: 80 }] },
        fail: { text: '你被沼澤怪物咬傷，差點喪命。空手而歸，父親病情惡化。',
          effects: [{ type: 'hp', value: -40 }, { type: 'flag', key: 'fatherDying', value: true }] } }
    ]
  },
  {
    age: 12,
    title: '神鳥降臨',
    text: '天空中一隻金色靈鳥飛過村莊，牠的羽毛化為金粉灑落！',
    gate: { dex: 45 },
    options: [
      { text: '追逐靈鳥（靈巧判定）', req: { stat: 'dex', min: 45 },
        success: { text: '你一躍而起摘下一根金羽！傳說中這是三大隨機神器之一。',
          effects: [{ type: 'item', item: 'golden_feather' }] },
        fail: { text: '靈鳥一振翅便消失無蹤。你錯失機緣。',
          effects: [{ type: 'log', text: '天上金光散盡。' }] } }
    ]
  },
  {
    age: 14,
    title: '成人禮檢驗',
    text: '父親（若健在）手持祖傳斷劍，眼含期待地看著你：「孩子，證明你長大了。」',
    gate: { fatherAff: 300 },
    options: [
      { text: '揮劍展示修煉成果（力量判定）', req: { stat: 'str', min: 20 },
        success: { text: '父親微笑將祖傳之劍交到你手中。力量 +3，獲得【斷裂的聖劍】。',
          effects: [{ type: 'stat', stat: 'str', value: 3 }, { type: 'item', item: 'broken_sword' }, { type: 'fatherAff', value: 50 }] },
        fail: { text: '劍太重，你雙手發抖。父親嘆息收劍。',
          effects: [{ type: 'fatherAff', value: -20 }] } }
    ]
  },
  {
    age: 16,
    title: '魔軍初現',
    text: '天邊烏雲翻湧，魔王軍先鋒官率領惡魔屠村！這是你第一道生死關！',
    type: 'boss',
    boss: 'M_BOSS_DEMON_VANGUARD',
    gate: { hp: 400, atk: 60 },
    options: [
      { text: '挺身而出迎戰', req: { stat: 'hp', min: 400 },
        success: { text: '你浴血奮戰，最終擊退先鋒官！名聲響徹大陸。',
          effects: [{ type: 'stat', stat: 'str', value: 3 }, { type: 'stat', stat: 'con', value: 3 }, { type: 'achievement', value: '擊退魔軍先鋒' }] },
        fail: { text: '你實力不足，被先鋒官一刀斬於陣前……',
          effects: [{ type: 'death', value: '在 16 歲的魔軍屠村中陣亡' }] } }
    ]
  },
  {
    age: 20,
    title: '加入騎士團',
    text: '你前往王都參加帝國騎士團選拔。同期天才萊恩站在擂台上向你挑釁。',
    type: 'duel',
    boss: 'M_RYAN',
    gate: { spd: 45 },
    options: [
      { text: '接受萊恩的挑戰（速度判定）', req: { stat: 'spd', min: 45 },
        success: { text: '你以壓倒性速度戰勝萊恩！他心服口服成為你的副官。',
          effects: [{ type: 'npcAff', npc: 'ryan', value: 50 }, { type: 'stat', stat: 'str', value: 2 }] },
        fail: { text: '你被萊恩擊敗，僅入選為後勤兵。',
          effects: [{ type: 'flag', key: 'logistics', value: true }] } }
    ]
  },
  {
    age: 24,
    title: '火山調查',
    text: '帝國南部活火山異常活躍，你奉命調查，遭遇炎魔！',
    type: 'boss',
    boss: 'M_HELLHOUND',
    gate: { con: 80, fireResist: 0.2 },
    options: [
      { text: '穿上防火披風進入火山（需裝備：防火披風）', req: { stat: 'item', item: 'fireproof_cloak' },
        success: { text: '你在烈焰中戰勝炎魔！體質 +5，獲得【龍心】。',
          effects: [{ type: 'stat', stat: 'con', value: 5 }, { type: 'item', item: 'dragon_heart' }] },
        fail: { text: '你被燒成重傷，被同伴救出。最大 HP -100。',
          effects: [{ type: 'stat', stat: 'maxHp', value: -100 }, { type: 'hp', value: -100 }] } }
    ]
  },
  {
    age: 28,
    title: '王都保衛戰',
    text: '魔王軍三大幹部之一「無頭騎士·杜拉漢」率領亡靈大軍奇襲王都！',
    type: 'boss',
    boss: 'M_DULLAHAN',
    gate: { def: 70 },
    options: [
      { text: '率領禁衛軍迎戰', req: { stat: 'def', min: 70 },
        success: { text: '你的鐵壁防禦讓杜拉漢的斬擊無功而返，最終你斬下他的頭顱！',
          effects: [{ type: 'achievement', value: '斬殺無頭騎士' }, { type: 'stat', stat: 'con', value: 5 }] },
        fail: { text: '杜拉漢的巨劍貫穿你的胸膛……',
          effects: [{ type: 'death', value: '王都保衛戰中陣亡' }] } }
    ]
  },
  {
    age: 32,
    title: '尋找聖物',
    text: '為了破解魔王的不死身，你需要前往精靈之森尋找聖杯。精靈女王要求你展現智慧與魅力。',
    gate: { int: 120, cha: 100 },
    options: [
      { text: '以誠懇與智慧說服女王（智力 + 魅力判定）',
        reqAny: [{ stat: 'int', min: 120 }, { stat: 'cha', min: 100 }],
        success: { text: '精靈女王動容，賜你聖杯。精靈公主艾拉也對你暗生情愫。',
          effects: [{ type: 'item', item: 'holy_grail' }, { type: 'npcAff', npc: 'elf_princess', value: 60 }] },
        fail: { text: '女王冷漠地拒絕，你被精靈驅逐出境。',
          effects: [{ type: 'flag', key: 'elfBan', value: true }] } }
    ]
  },
  {
    age: 36,
    title: '決戰前夕',
    text: '決戰將至，你需要在全大陸招募志同道合的戰友。',
    gate: { party: 3 },
    options: [
      { text: '號召英雄聯盟', req: { stat: 'party', min: 3 },
        success: { text: '露西、萊恩、精靈公主齊聚帳下。士氣高昂！',
          effects: [{ type: 'achievement', value: '集結三英雄' }] },
        fail: { text: '你孤軍奮戰，終戰之時無人為你擋下致命一擊……',
          effects: [{ type: 'log', text: '你感到命運的天平在傾斜。' }] } }
    ]
  },
  {
    age: 40,
    title: '終焉決戰',
    text: '你率軍攻入魔王城最深處。終焉魔王·阿撒茲勒在王座上等待著你。',
    type: 'boss',
    boss: 'M_ASTAROTH',
    gate: { hp: 3000, atk: 450 },
    options: [
      { text: '與阿撒茲勒決一死戰！', req: { stat: 'hp', min: 3000 },
        success: { text: '你擊敗了阿撒茲勒，封印了魔界！大陸重歸和平！你登基為王，傳說永存。',
          effects: [{ type: 'achievement', value: '救世主' }, { type: 'ending', value: 'true_ending' }] },
        fail: { text: '你的力量不足以斬殺魔王，世界陷入永夜……',
          effects: [{ type: 'death', value: '終焉決戰中落敗' }] } }
    ]
  }
];

export function getMainStoryForAge(age) {
  return MAIN_STORY.find(s => s.age === age) ?? null;
}
