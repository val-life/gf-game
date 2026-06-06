// 隨機事件池（v2：六維屬性 + check_luck 機制）
// options[i]: { text, req?, reqAny?, success, fail }
// effects: { type: 'stat'|'gold'|'hp'|'maxHp'|'ap'|'item'|'flag'|'npcAff'|'fatherAff'|'achievement'|'log'|'death'|'ageMax'|'atf'|'def'|'dodge'|'crit', value, stat? }
// stat 鍵：str, con, dex, int, cha, luk

const s = (text, type, effects = []) => ({ text, type, effects });
export const EVENTS = [
  // ========== 童年 0-12 ==========
  {
    id: 'ev_child_fall',
    text: '你追逐蝴蝶時不慎跌入水溝，膝蓋擦傷。',
    ageMin: 4, ageMax: 12, weight: 8,
    options: [
      { text: '哭著回家找母親', success: s('母親溫柔安慰你。HP +5。', 'good', [{ type: 'hp', value: 5 }]) },
      { text: '咬牙自己爬起來（靈巧判定）', req: { stat: 'dex', min: 5 },
        success: s('你忍痛站起，眼神堅毅。靈巧 +1。', 'good', [{ type: 'stat', stat: 'dex', value: 1 }]),
        fail: s('你爬不起來，哇哇大哭。', 'fail', []) },
      { text: '撿起樹枝戳水溝（智力判定）', req: { stat: 'int', min: 5 },
        success: s('你發現水溝裡藏著古幣！金幣 +15。', 'good', [{ type: 'gold', value: 15 }]),
        fail: s('樹枝斷了，你的手被割傷。', 'fail', [{ type: 'hp', value: -3 }]) }
    ]
  },
  {
    id: 'ev_village_fair',
    text: '村莊舉辦廟會，攤販林立、人聲鼎沸。',
    ageMin: 5, ageMax: 15, weight: 10,
    options: [
      { text: '纏著父母買糖葫蘆（金幣 -5）', success: s('糖在舌尖融化，心情愉悅。魅力 +1。', 'good', [{ type: 'stat', stat: 'cha', value: 1 }]) },
      { text: '觀看武師表演（力量判定）', req: { stat: 'str', min: 6 },
        success: s('你模仿武師揮拳，竟有模有樣。力量 +1。', 'good', [{ type: 'stat', stat: 'str', value: 1 }]),
        fail: s('你學得四不像，被人嘲笑。', 'fail', []) },
      { text: '偷看魔術師口袋（靈巧判定）', req: { stat: 'dex', min: 6 },
        success: s('你巧妙順到一枚金幣！金幣 +8。', 'good', [{ type: 'gold', value: 8 }]),
        fail: s('魔術師發現你，賞你一記耳光。', 'fail', [{ type: 'hp', value: -5 }]) }
    ]
  },
  {
    id: 'ev_old_man_riddle',
    text: '一位白髮老者在路邊對你微笑：「孩子，可願聽一則謎題？」',
    ageMin: 7, ageMax: 18, weight: 6,
    options: [
      { text: '禮貌聆聽（智力判定）', req: { stat: 'int', min: 5 },
        success: s('你解開謎題，老人驚嘆贈書。智力 +2。', 'good', [{ type: 'stat', stat: 'int', value: 2 }]),
        fail: s('你答不上來，老人微笑離去。', 'fail', []) },
      { text: '微笑拒絕，快步離開', success: s('老人嘆息。命運錯過。', 'neutral', [{ type: 'log', text: '你感到一絲失落。' }]) },
      { text: '嘲笑他「老糊塗」', success: s('老人怒目而視。HP -3。', 'bad', [{ type: 'hp', value: -3 }]) }
    ]
  },
  {
    id: 'ev_school_bully',
    text: '一個高年級學生擋住你的去路，要你交出「保護費」。',
    ageMin: 6, ageMax: 14, weight: 7,
    options: [
      { text: '奮力反擊（力量判定）', req: { stat: 'str', min: 7 },
        success: s('你揍得他鼻血直流！力量 +1。', 'good', [{ type: 'stat', stat: 'str', value: 1 }]),
        fail: s('你被他揍得鼻青臉腫。HP -10。', 'fail', [{ type: 'hp', value: -10 }]) },
      { text: '交出金幣保平安（金幣 -10）', success: s('他得意地笑。你屈辱地記住這一天。', 'bad', [{ type: 'gold', value: -10 }, { type: 'stat', stat: 'luk', value: -1 }]) },
      { text: '繞路逃走（靈巧判定）', req: { stat: 'dex', min: 6 },
        success: s('你從小巷消失，靈巧 +1。', 'good', [{ type: 'stat', stat: 'dex', value: 1 }]),
        fail: s('他追上你並推了一把。HP -3。', 'fail', [{ type: 'hp', value: -3 }]) }
    ]
  },
  {
    id: 'ev_sword_pendant',
    text: '你在祖傳閣樓翻出一柄生鏽的短劍與一本褪色日記。',
    ageMin: 10, ageMax: 20, weight: 4,
    options: [
      { text: '細讀日記（智力判定）', req: { stat: 'int', min: 7 },
        success: s('日記記載祖上是失落劍聖！你悟出心法。力量 +2，靈巧 +1。', 'good',
          [{ type: 'stat', stat: 'str', value: 2 }, { type: 'stat', stat: 'dex', value: 1 }]),
        fail: s('字跡模糊難以辨認。', 'fail', []) },
      { text: '揮劍練習（力量判定）', req: { stat: 'str', min: 7 },
        success: s('你揮汗如雨，劍風漸成。力量 +2。', 'good', [{ type: 'stat', stat: 'str', value: 2 }]),
        fail: s('你弄傷了自己。HP -5。', 'fail', [{ type: 'hp', value: -5 }]) },
      { text: '賣給古董商', success: s('商人狡黠一笑。金幣 +25。', 'neutral', [{ type: 'gold', value: 25 }]) }
    ]
  },
  {
    id: 'ev_merchants_blackbox',
    text: '一個披著厚重斗篷的流浪商人攔住你：「我這有上古鐵盒，300 金幣，生死各安天命。」',
    ageMin: 12, ageMax: 30, weight: 3, conditions: { gold: 300 },
    options: [
      { text: '付錢買下寶箱（運氣判定）', req: { stat: 'luk', min: 25 },
        success: s('你撬開鐵盒，裡面躺著完好的【時之沙漏】！靈巧 +15。', 'epic',
          [{ type: 'stat', stat: 'dex', value: 15 }, { type: 'item', item: 'hourglass' }]),
        fail: s('你吸入毒氣黑霧，大病一場。HP -100，HP 上限 -20。', 'fail',
          [{ type: 'hp', value: -100 }, { type: 'stat', stat: 'maxHp', value: -20 }, { type: 'gold', value: -300 }]) },
      { text: '拒絕並通知衛兵（魅力判定）', req: { stat: 'cha', min: 20 },
        success: s('你說服衛兵逮捕商人，獲得賞金 200。魅力 +2。', 'good',
          [{ type: 'gold', value: 200 }, { type: 'stat', stat: 'cha', value: 2 }]),
        fail: s('衛兵不理你，商人狠狠瞪了你。', 'fail', [{ type: 'stat', stat: 'luk', value: -3 }]) }
    ]
  },
  {
    id: 'ev_ancient_stone',
    text: '你在王都郊外的密林深處發現一座被藤蔓覆蓋的古老石碑。',
    ageMin: 8, ageMax: 40, weight: 3, conditions: { int: 30 },
    options: [
      { text: '強行靜心研讀（智力判定）', req: { stat: 'int', min: 60 },
        success: s('你成功看懂碑文！精神力質變，智力 +25。', 'epic', [{ type: 'stat', stat: 'int', value: 25 }]),
        fail: s('魔力反噬大腦，當場吐血昏迷。智力 -5，HP -50。', 'fail',
          [{ type: 'stat', stat: 'int', value: -5 }, { type: 'hp', value: -50 }]) },
      { text: '用蠻力將石碑砸碎（力量判定）', req: { stat: 'str', min: 50 },
        success: s('石碑崩裂，遠古戰意湧入！力量 +20。', 'epic', [{ type: 'stat', stat: 'str', value: 20 }]),
        fail: s('石碑紋絲不動，反震你骨折。力量 -2，體質 -5。', 'fail',
          [{ type: 'stat', stat: 'str', value: -2 }, { type: 'stat', stat: 'con', value: -5 }]) }
    ]
  },
  {
    id: 'ev_tavern_dice',
    text: '深夜酒館裡幾個醉漢在玩骰子，喊你加入：「一注 100 金，買定離手！」',
    ageMin: 18, ageMax: 60, weight: 3, conditions: { gold: 100 },
    options: [
      { text: '加入賭局（運氣判定）', req: { stat: 'luk', min: 35 },
        success: s('你擲出三個六！贏光桌面籌碼。金幣 +300。', 'good', [{ type: 'gold', value: 300 }]),
        fail: s('你手氣背到極點，金幣 -100。', 'fail', [{ type: 'gold', value: -100 }]) },
      { text: '出千（靈巧判定）', req: { stat: 'dex', min: 70 },
        success: s('你手化作殘影換了骰子，贏得無聲無息。金幣 +100，靈巧 +3。', 'good',
          [{ type: 'gold', value: 100 }, { type: 'stat', stat: 'dex', value: 3 }]),
        fail: s('你被當場抓包，遭圍毆。HP -150，金幣歸零。', 'fail',
          [{ type: 'hp', value: -150 }, { type: 'gold_clear', value: true }]) }
    ]
  },
  {
    id: 'ev_academy_invite',
    text: '皇家魔法學院招生官注意到你，遞出邀請函。',
    ageMin: 13, ageMax: 19, weight: 5, conditions: { int: 6 },
    options: [
      { text: '欣然接受（金幣 -30）', success: s('你踏入學院，視野大開。智力 +3。', 'good', [{ type: 'stat', stat: 'int', value: 3 }, { type: 'gold', value: -30 }]) },
      { text: '婉拒，繼續流浪', success: s('自由誠可貴。幸運 +1。', 'neutral', [{ type: 'stat', stat: 'luk', value: 1 }]) },
      { text: '要求對方先露一手（智力判定）', req: { stat: 'int', min: 9 },
        success: s('你指出他法術的破綻！他羞愧地給你 50 金幣。', 'good',
          [{ type: 'gold', value: 50 }, { type: 'stat', stat: 'int', value: 1 }]),
        fail: s('你裝腔作勢被他識破，灰溜溜走開。', 'fail', []) }
    ]
  },
  {
    id: 'ev_thief_attack',
    text: '深夜，你在小巷被蒙面盜賊堵住！',
    ageMin: 12, ageMax: 60, weight: 6,
    options: [
      { text: '正面接戰（力量判定）', req: { stat: 'str', min: 6 },
        success: s('你打倒盜賊，繳獲贓物。金幣 +20。', 'good', [{ type: 'gold', value: 20 }, { type: 'stat', stat: 'str', value: 1 }]),
        fail: s('你被捅了一刀。HP -20。', 'fail', [{ type: 'hp', value: -20 }]) },
      { text: '機智周旋（靈巧判定）', req: { stat: 'dex', min: 7 },
        success: s('你趁隙逃脫。靈巧 +1。', 'good', [{ type: 'stat', stat: 'dex', value: 1 }]),
        fail: s('你被揍了一頓。HP -15。', 'fail', [{ type: 'hp', value: -15 }]) },
      { text: '交出錢財（金幣 -15）', success: s('盜賊冷笑離去。你發誓復仇。', 'bad', [{ type: 'gold', value: -15 }]) }
    ]
  },
  {
    id: 'ev_love_letter',
    text: '你收到一封匿名情書，署名「仰望你的人」。',
    ageMin: 14, ageMax: 28, weight: 6,
    options: [
      { text: '赴約（運氣判定）', req: { stat: 'luk', min: 6 },
        success: s('是位美麗的異性！結為知己。', 'good', [{ type: 'npcAff', npc: 'lover', value: 20 }]),
        fail: s('是個同性酒鬼開的玩笑。', 'fail', []) },
      { text: '把信燒掉', success: s('心無雜念，專注修煉。體質 +1。', 'neutral', [{ type: 'stat', stat: 'con', value: 1 }]) },
      { text: '四處炫耀', success: s('傳遍全城。魅力 +1。', 'good', [{ type: 'stat', stat: 'cha', value: 1 }]) }
    ]
  },
  {
    id: 'ev_lost_child',
    text: '路邊哭泣的小男孩：「我找不到媽媽……」',
    ageMin: 16, ageMax: 70, weight: 5,
    options: [
      { text: '帶他找母親', success: s('母親重金酬謝！金幣 +40。', 'good', [{ type: 'gold', value: 40 }]) },
      { text: '買糖果安撫他（金幣 -5）', success: s('他破涕為笑。你感到心暖。體質 +1。', 'good', [{ type: 'stat', stat: 'con', value: 1 }]) },
      { text: '冷漠走過', success: s('你加快腳步。', 'neutral', [{ type: 'log', text: '哭聲在你背後漸遠。' }]) }
    ]
  },
  {
    id: 'ev_mystic_spring',
    text: '森林深處隱藏著一口會說話的泉水。',
    ageMin: 12, ageMax: 80, weight: 3,
    options: [
      { text: '飲下泉水', success: s('泉水甘甜。HP 全滿。', 'good', [{ type: 'hp', value: 9999 }]) },
      { text: '研究泉水（智力判定）', req: { stat: 'int', min: 9 },
        success: s('你悟出水之祕法。智力 +2。', 'good', [{ type: 'stat', stat: 'int', value: 2 }]),
        fail: s('你什麼也沒看出來。', 'fail', []) },
      { text: '裝一瓶帶走', success: s('獲得【魔力泉水】。', 'good', [{ type: 'item', item: 'magic_water' }]) }
    ]
  },
  {
    id: 'ev_war_call',
    text: '邊境戰火紛飛，徵兵官在城中招募勇士。',
    ageMin: 18, ageMax: 50, weight: 4,
    options: [
      { text: '應徵入伍', success: s('軍旅淬煉你！力量 +3，靈巧 +1，HP -10。', 'good',
        [{ type: 'stat', stat: 'str', value: 3 }, { type: 'stat', stat: 'dex', value: 1 }, { type: 'hp', value: -10 }]) },
      { text: '繳稅免役（金幣 -50）', success: s('你留在後方。', 'neutral', [{ type: 'gold', value: -50 }]) },
      { text: '加入反抗軍（靈巧判定）', req: { stat: 'dex', min: 8 },
        success: s('你穿梭戰場救下孤兒。名聲遠播。', 'good',
          [{ type: 'stat', stat: 'dex', value: 2 }, { type: 'npcAff', npc: 'rebel', value: 30 }]),
        fail: s('你被敵軍發現，倉皇逃回。', 'fail', [{ type: 'hp', value: -10 }]) }
    ]
  },
  {
    id: 'ev_mid_crisis',
    text: '你在鏡中看見自己斑白的鬢角，陷入沉思。',
    ageMin: 35, ageMax: 60, weight: 5,
    options: [
      { text: '重拾劍，揮向命運', success: s('壯心不已！力量 +2，靈巧 +1。', 'good',
        [{ type: 'stat', stat: 'str', value: 2 }, { type: 'stat', stat: 'dex', value: 1 }]) },
      { text: '告別江湖，歸隱山林', success: s('內心平靜。體質 +3，智力 +2。', 'good',
        [{ type: 'stat', stat: 'con', value: 3 }, { type: 'stat', stat: 'int', value: 2 }]) },
      { text: '瘋狂研究禁忌之術', success: s('你窺見天機！智力 +5，HP -20。', 'epic',
        [{ type: 'stat', stat: 'int', value: 5 }, { type: 'hp', value: -20 }]) }
    ]
  },
  {
    id: 'ev_legend_artifact',
    text: '旅途中你聽聞「破曉之劍」藏於冰封峽谷。',
    ageMin: 30, ageMax: 70, weight: 2,
    options: [
      { text: '獨自尋劍（力量判定）', req: { stat: 'str', min: 30 },
        success: s('你跨越冰原，尋得神兵！力量 +5。', 'epic', [{ type: 'stat', stat: 'str', value: 5 }]),
        fail: s('你在冰窟中迷路，差點凍死。HP -30。', 'fail', [{ type: 'hp', value: -30 }]) },
      { text: '組隊出發', success: s('你結識豪傑。', 'good', [{ type: 'npcAff', npc: 'party', value: 20 }, { type: 'stat', stat: 'luk', value: 2 }]) },
      { text: '放棄尋找', success: s('神話終究是神話。', 'neutral', [{ type: 'log', text: '你轉身離去。' }]) }
    ]
  },
  {
    id: 'ev_dream_omen',
    text: '夢中一位老者遞給你三道門，門後各有光芒。',
    ageMin: 10, ageMax: 80, weight: 4,
    options: [
      { text: '推開紅門（力量）', success: s('你化身戰神。力量 +1。', 'good', [{ type: 'stat', stat: 'str', value: 1 }]) },
      { text: '推開藍門（智力）', success: s('你獲得啟示。智力 +1。', 'good', [{ type: 'stat', stat: 'int', value: 1 }]) },
      { text: '推開金門（財富）', success: s('金光閃閃。金幣 +30。', 'good', [{ type: 'gold', value: 30 }]) }
    ]
  },
  {
    id: 'ev_hermit_gift',
    text: '山中隱士遞給你一顆發光丹藥：「有緣人，吃下吧。」',
    ageMin: 15, ageMax: 70, weight: 3,
    options: [
      { text: '吞服丹藥', success: s('你感到渾身充滿力量。HP 全滿，力量 +1。', 'good',
        [{ type: 'hp', value: 9999 }, { type: 'stat', stat: 'str', value: 1 }]) },
      { text: '婉拒（智力判定）', req: { stat: 'int', min: 10 },
        success: s('你看出丹藥有異。隱士嘆服。智力 +2。', 'epic', [{ type: 'stat', stat: 'int', value: 2 }]),
        fail: s('你接過但沒吃，雙方尷尬。', 'fail', []) },
      { text: '收下藏於懷中', success: s('你謹慎行事。', 'good', [{ type: 'item', item: 'mystery_pill' }]) }
    ]
  },
  {
    id: 'ev_companion_meet',
    text: '你在酒館遇見一位志同道合的冒險者。',
    ageMin: 14, ageMax: 60, weight: 5,
    options: [
      { text: '暢談結義', success: s('【艾莉諾】成為夥伴！', 'good', [{ type: 'npcAff', npc: 'eleanor', value: 30 }]) },
      { text: '切磋武藝（力量判定）', req: { stat: 'str', min: 8 },
        success: s('你與對手惺惺相惜。力量 +1。', 'good',
          [{ type: 'stat', stat: 'str', value: 1 }, { type: 'npcAff', npc: 'eleanor', value: 15 }]),
        fail: s('你被揍得鼻青臉腫。', 'fail', [{ type: 'hp', value: -10 }]) },
      { text: '各走各路', success: s('你獨自前行。', 'neutral', [{ type: 'log', text: '你離開酒館。' }]) }
    ]
  },
  {
    id: 'ev_lost_treasure',
    text: '你撿到一份藏寶圖，標示著鄰近古井。',
    ageMin: 8, ageMax: 70, weight: 4,
    options: [
      { text: '立刻挖掘', success: s('你挖出陳年寶箱！金幣 +60。', 'good', [{ type: 'gold', value: 60 }]) },
      { text: '謹慎研究（智力判定）', req: { stat: 'int', min: 8 },
        success: s('你識破陷阱，找到暗格。金幣 +120，獲得【古舊護符】。', 'epic',
          [{ type: 'gold', value: 120 }, { type: 'item', item: 'amulet_dex' }]),
        fail: s('你中了陷阱。HP -20。', 'fail', [{ type: 'hp', value: -20 }]) },
      { text: '賣掉藏寶圖', success: s('金幣 +15。', 'neutral', [{ type: 'gold', value: 15 }]) }
    ]
  },
  {
    id: 'ev_plague_outbreak',
    text: '城中爆發瘟疫，到處都是咳嗽聲。',
    ageMin: 20, ageMax: 70, weight: 3,
    options: [
      { text: '留在城中抗疫（體質判定）', req: { stat: 'con', min: 10 },
        success: s('你安然度過。體質 +2。', 'good', [{ type: 'stat', stat: 'con', value: 2 }]),
        fail: s('你染上疾病。HP -30。', 'fail', [{ type: 'hp', value: -30 }]) },
      { text: '逃離城鎮', success: s('你保住性命，但染上咳疾。HP -15。', 'bad', [{ type: 'hp', value: -15 }]) },
      { text: '研究解藥（智力判定）', req: { stat: 'int', min: 11 },
        success: s('你研製出解藥救人無數！智力 +3，金幣 +100。', 'epic',
          [{ type: 'stat', stat: 'int', value: 3 }, { type: 'gold', value: 100 }]),
        fail: s('你研製失敗，反中毒。HP -20。', 'fail', [{ type: 'hp', value: -20 }]) }
    ]
  },
  {
    id: 'ev_god_herald',
    text: '天空裂開，神諭降臨：「凡人，接受試煉吧！」',
    ageMin: 25, ageMax: 60, weight: 1,
    options: [
      { text: '接受試煉', success: s('你經受雷擊洗禮！力量 +3，靈巧 +2，HP -20。', 'epic',
        [{ type: 'stat', stat: 'str', value: 3 }, { type: 'stat', stat: 'dex', value: 2 }, { type: 'hp', value: -20 }]) },
      { text: '跪地祈禱', success: s('神明微笑。獲得祝福。體質 +5，智力 +3。', 'epic',
        [{ type: 'stat', stat: 'con', value: 5 }, { type: 'stat', stat: 'int', value: 3 }]) },
      { text: '嘲笑神明', success: s('雷電劈下！HP -40，智力 -2。', 'bad',
        [{ type: 'hp', value: -40 }, { type: 'stat', stat: 'int', value: -2 }]) }
    ]
  }
];

export function getEligibleEvents(player, pool) {
  return pool.filter(ev => {
    if (player.age < ev.ageMin || player.age > ev.ageMax) return false;
    if (ev.conditions) {
      for (const k in ev.conditions) {
        if ((player[k] ?? 0) < ev.conditions[k]) return false;
      }
    }
    return true;
  });
}

export function pickRandomEvent(player, pool) {
  const eligible = getEligibleEvents(player, pool);
  if (eligible.length === 0) return null;
  const totalWeight = eligible.reduce((s, e) => s + (e.weight ?? 1), 0);
  let r = Math.random() * totalWeight;
  for (const ev of eligible) {
    r -= (ev.weight ?? 1);
    if (r <= 0) return ev;
  }
  return eligible[eligible.length - 1];
}
