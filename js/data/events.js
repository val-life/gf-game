// 事件池。每事件：id, text, ageMin, ageMax, statReq?, options[]
// option: { text, req?: {stat,min}, outcome: { text, effects: [...] } }
// effects: { type: 'stat'|'gold'|'hp'|'ap'|'item'|'flag'|'npcAff'|'talent'|'log', ... }

const e = (effects) => effects;

export const EVENTS = [
  // ========== 童年 0-12 ==========
  {
    id: 'ev_child_fall',
    text: '你追逐蝴蝶時不慎跌入水溝，膝蓋擦傷。',
    ageMin: 4, ageMax: 12,
    weight: 8,
    options: [
      { text: '哭著回家找母親', outcome: { text: '母親溫柔安慰你。HP +5。', effects: [{ type: 'hp', value: 5 }] } },
      { text: '咬牙自己爬起來（敏捷判定）', req: { stat: 'agi', min: 5 }, outcome: { text: '你忍痛站起，眼神堅毅。敏捷 +1。', effects: [{ type: 'stat', stat: 'agi', value: 1 }] } },
      { text: '撿起樹枝戳水溝（智力判定）', req: { stat: 'int', min: 5 }, outcome: { text: '你發現水溝裡藏著古幣！金幣 +15。', effects: [{ type: 'gold', value: 15 }] } }
    ]
  },
  {
    id: 'ev_village_fair',
    text: '村莊舉辦廟會，攤販林立、人聲鼎沸。',
    ageMin: 5, ageMax: 15,
    weight: 10,
    options: [
      { text: '纏著父母買糖葫蘆（金幣 -5）', outcome: { text: '糖在舌尖融化，心情愉悅。幸運 +1。', effects: [{ type: 'stat', stat: 'lck', value: 1 }] } },
      { text: '觀看武師表演（力量判定）', req: { stat: 'str', min: 6 }, outcome: { text: '你模仿武師揮拳，竟有模有樣。力量 +1。', effects: [{ type: 'stat', stat: 'str', value: 1 }] } },
      { text: '偷看魔術師口袋（敏捷判定）', req: { stat: 'agi', min: 6 }, outcome: { text: '你巧妙順到一枚金幣！金幣 +8。', effects: [{ type: 'gold', value: 8 }] } }
    ]
  },
  {
    id: 'ev_old_man_riddle',
    text: '一位白髮老者在路邊對你微笑：「孩子，可願聽一則謎題？」',
    ageMin: 7, ageMax: 18,
    weight: 6,
    options: [
      { text: '禮貌聆聽（智力判定）', req: { stat: 'int', min: 5 }, outcome: { text: '你解開謎題，老人驚嘆贈書。智力 +2。', effects: [{ type: 'stat', stat: 'int', value: 2 }] } },
      { text: '微笑拒絕，快步離開', outcome: { text: '老人嘆息。命運錯過。', effects: [{ type: 'log', text: '你感到一絲失落。' }] } },
      { text: '嘲笑他「老糊涂」', outcome: { text: '老人怒目而視。HP -3。', effects: [{ type: 'hp', value: -3 }] } }
    ]
  },
  {
    id: 'ev_school_bully',
    text: '一個高年級學生擋住你的去路，要你交出「保護費」。',
    ageMin: 6, ageMax: 14,
    weight: 7,
    options: [
      { text: '奮力反擊（力量判定）', req: { stat: 'str', min: 7 }, outcome: { text: '你揍得他鼻血直流！力量 +1，金幣 -3。', effects: [{ type: 'stat', stat: 'str', value: 1 }, { type: 'gold', value: -3 }] } },
      { text: '交出金幣保平安（金幣 -10）', outcome: { text: '他得意地笑。你屈辱地記住這一天。', effects: [{ type: 'gold', value: -10 }, { type: 'stat', stat: 'lck', value: -1 }] } },
      { text: '繞路逃走（敏捷判定）', req: { stat: 'agi', min: 6 }, outcome: { text: '你從小巷消失，敏捷 +1。', effects: [{ type: 'stat', stat: 'agi', value: 1 }] } }
    ]
  },
  {
    id: 'ev_sword_pendant',
    text: '你在祖傳閣樓翻出一柄生鏽的短劍與一本褪色日記。',
    ageMin: 10, ageMax: 20,
    weight: 4,
    options: [
      { text: '細讀日記（智力判定）', req: { stat: 'int', min: 7 }, outcome: { text: '日記記載祖上是失落劍聖！你悟出心法。力量 +2，敏捷 +1。', effects: [{ type: 'stat', stat: 'str', value: 2 }, { type: 'stat', stat: 'agi', value: 1 }] } },
      { text: '揮劍練習（力量判定）', req: { stat: 'str', min: 7 }, outcome: { text: '你揮汗如雨，劍風漸成。力量 +2。', effects: [{ type: 'stat', stat: 'str', value: 2 }] } },
      { text: '賣給古董商', outcome: { text: '商人狡黠一笑。金幣 +25。', effects: [{ type: 'gold', value: 25 }] } }
    ]
  },

  // ========== 青年 13-25 ==========
  {
    id: 'ev_academy_invite',
    text: '皇家魔法學院招生官注意到你，遞出邀請函。',
    ageMin: 13, ageMax: 19,
    weight: 5,
    conditions: { int: 6 },
    options: [
      { text: '欣然接受（金幣 -30）', outcome: { text: '你踏入學院，視野大開。智力 +3。', effects: [{ type: 'stat', stat: 'int', value: 3 }, { type: 'gold', value: -30 }] } },
      { text: '婉拒，繼續流浪', outcome: { text: '自由誠可貴。幸運 +1。', effects: [{ type: 'stat', stat: 'lck', value: 1 }] } },
      { text: '要求對方先露一手（智力判定）', req: { stat: 'int', min: 9 }, outcome: { text: '你指出他法術的破綻！他羞愧地給你 50 金幣。', effects: [{ type: 'gold', value: 50 }, { type: 'stat', stat: 'int', value: 1 }] } }
    ]
  },
  {
    id: 'ev_love_letter',
    text: '你收到一封匿名情書，署名「仰望你的人」。',
    ageMin: 14, ageMax: 28,
    weight: 6,
    options: [
      { text: '赴約（運氣判定）', req: { stat: 'lck', min: 6 }, outcome: { text: '是位美麗的異性！結為知己。', effects: [{ type: 'npcAff', npc: 'lover', value: 20 }] } },
      { text: '把信燒掉', outcome: { text: '心無雜念，專注修煉。', effects: [{ type: 'stat', stat: 'vit', value: 1 }] } },
      { text: '四處炫耀', outcome: { text: '傳遍全城。你名聲略升。', effects: [{ type: 'stat', stat: 'lck', value: 1 }] } }
    ]
  },
  {
    id: 'ev_thief_attack',
    text: '深夜，你在小巷被蒙面盜賊堵住！',
    ageMin: 12, ageMax: 60,
    weight: 6,
    options: [
      { text: '正面接戰（力量判定）', req: { stat: 'str', min: 6 }, outcome: { text: '你打倒盜賊，繳獲贓物。金幣 +20。', effects: [{ type: 'gold', value: 20 }, { type: 'stat', stat: 'str', value: 1 }] } },
      { text: '機智周旋（敏捷判定）', req: { stat: 'agi', min: 7 }, outcome: { text: '你趁隙逃脫。敏捷 +1。', effects: [{ type: 'stat', stat: 'agi', value: 1 }] } },
      { text: '交出錢財（金幣 -15）', outcome: { text: '盜賊冷笑離去。你發誓復仇。', effects: [{ type: 'gold', value: -15 }] } }
    ]
  },
  {
    id: 'ev_merchant_offer',
    text: '一位西大陸商人願低價出售「神秘護身符」。',
    ageMin: 15, ageMax: 60,
    weight: 5,
    options: [
      { text: '花 40 金幣購買', outcome: { text: '護身符微微發光。你的體質 +3。', effects: [{ type: 'gold', value: -40 }, { type: 'stat', stat: 'vit', value: 3 }] } },
      { text: '砍價到 20（金幣 -20）', req: { stat: 'lck', min: 7 }, outcome: { text: '商人咬牙成交。體質 +2。', effects: [{ type: 'gold', value: -20 }, { type: 'stat', stat: 'vit', value: 2 }] } },
      { text: '識破是假貨（智力判定）', req: { stat: 'int', min: 8 }, outcome: { text: '你指破騙局！商人逃跑丟下真寶。智力 +1，金幣 +30。', effects: [{ type: 'stat', stat: 'int', value: 1 }, { type: 'gold', value: 30 }] } }
    ]
  },
  {
    id: 'ev_dungeon_call',
    text: '一張泛黃的羊皮紙飄到你腳邊：「北境古墓，財寶等有緣人。」',
    ageMin: 16, ageMax: 60,
    weight: 3,
    options: [
      { text: '即刻啟程', outcome: { text: '你踏上冒險之路！', effects: [{ type: 'flag', key: 'dungeonUnlocked', value: true }] } },
      { text: '轉交給冒險者公會（金幣 +50）', outcome: { text: '公會感謝你。', effects: [{ type: 'gold', value: 50 }] } },
      { text: '撕毀羊皮紙', outcome: { text: '你選擇安穩。體質 +1。', effects: [{ type: 'stat', stat: 'vit', value: 1 }] } }
    ]
  },

  // ========== 成年 20+ ==========
  {
    id: 'ev_royal_summon',
    text: '國王召見：「勇者啊，王國需要你斬殺巨龍！」',
    ageMin: 18, ageMax: 60,
    weight: 4,
    options: [
      { text: '接受使命', outcome: { text: '你領命前行，士氣高昂！力量 +1，智力 +1。', effects: [{ type: 'stat', stat: 'str', value: 1 }, { type: 'stat', stat: 'int', value: 1 }, { type: 'flag', key: 'dragonQuest', value: true }] } },
      { text: '要求先付報酬（運氣判定）', req: { stat: 'lck', min: 7 }, outcome: { text: '國王大笑先賞 200 金幣！', effects: [{ type: 'gold', value: 200 }] } },
      { text: '婉拒，告老還鄉', outcome: { text: '你選擇田園生活。', effects: [{ type: 'flag', key: 'retired', value: true }] } }
    ]
  },
  {
    id: 'ev_demon_pact',
    text: '一位惡魔低語：「簽下契約，我賜你無上力量。」',
    ageMin: 20, ageMax: 60,
    weight: 2,
    options: [
      { text: '簽下契約', outcome: { text: '惡魔烙印在你心口。力量 +10，但壽命 -5。', effects: [{ type: 'stat', stat: 'str', value: 10 }, { type: 'ageMax', value: -5 }] } },
      { text: '以聖光驅逐（智力判定）', req: { stat: 'int', min: 12 }, outcome: { text: '惡魔慘叫著消散！智力 +3。', effects: [{ type: 'stat', stat: 'int', value: 3 }] } },
      { text: '轉身就走', outcome: { text: '你避開誘惑。', effects: [{ type: 'log', text: '惡魔的笑聲在背後迴盪。' }] } }
    ]
  },
  {
    id: 'ev_lost_child',
    text: '路邊哭泣的小男孩：「我找不到媽媽……」',
    ageMin: 16, ageMax: 70,
    weight: 5,
    options: [
      { text: '帶他找母親', outcome: { text: '母親重金酬謝！金幣 +40。', effects: [{ type: 'gold', value: 40 }] } },
      { text: '買糖果安撫他（金幣 -5）', outcome: { text: '他破涕為笑。你感到心暖。', effects: [{ type: 'stat', stat: 'vit', value: 1 }] } },
      { text: '冷漠走過', outcome: { text: '你加快腳步。', effects: [{ type: 'log', text: '哭聲在你背後漸遠。' }] } }
    ]
  },
  {
    id: 'ev_mystic_spring',
    text: '森林深處隱藏著一口會說話的泉水。',
    ageMin: 12, ageMax: 80,
    weight: 3,
    options: [
      { text: '飲下泉水', outcome: { text: '泉水甘甜。HP 全滿。', effects: [{ type: 'hp', value: 9999 }] } },
      { text: '研究泉水（智力判定）', req: { stat: 'int', min: 9 }, outcome: { text: '你悟出水之祕法。智力 +2。', effects: [{ type: 'stat', stat: 'int', value: 2 }] } },
      { text: '裝一瓶帶走', outcome: { text: '獲得【魔力泉水】。', effects: [{ type: 'item', item: 'magic_water' }] } }
    ]
  },
  {
    id: 'ev_war_call',
    text: '邊境戰火紛飛，徵兵官在城中招募勇士。',
    ageMin: 18, ageMax: 50,
    weight: 4,
    options: [
      { text: '應徵入伍', outcome: { text: '軍旅淬煉你！力量 +3，敏捷 +1，HP -10。', effects: [{ type: 'stat', stat: 'str', value: 3 }, { type: 'stat', stat: 'agi', value: 1 }, { type: 'hp', value: -10 }] } },
      { text: '繳稅免役（金幣 -50）', outcome: { text: '你留在後方。', effects: [{ type: 'gold', value: -50 }] } },
      { text: '加入反抗軍（敏捷判定）', req: { stat: 'agi', min: 8 }, outcome: { text: '你穿梭戰場救下孤兒。名聲遠播。', effects: [{ type: 'stat', stat: 'agi', value: 2 }, { type: 'npcAff', npc: 'rebel', value: 30 }] } }
    ]
  },

  // ========== 中年 35+ ==========
  {
    id: 'ev_mid_crisis',
    text: '你在鏡中看見自己斑白的鬢角，陷入沉思。',
    ageMin: 35, ageMax: 60,
    weight: 5,
    options: [
      { text: '重拾劍，揮向命運', outcome: { text: '壯心不已！力量 +2，敏捷 +1。', effects: [{ type: 'stat', stat: 'str', value: 2 }, { type: 'stat', stat: 'agi', value: 1 }] } },
      { text: '告別江湖，歸隱山林', outcome: { text: '內心平靜。體質 +3，智力 +2。', effects: [{ type: 'stat', stat: 'vit', value: 3 }, { type: 'stat', stat: 'int', value: 2 }] } },
      { text: '瘋狂研究禁忌之術', outcome: { text: '你窺見天機！智力 +5，HP -20。', effects: [{ type: 'stat', stat: 'int', value: 5 }, { type: 'hp', value: -20 }] } }
    ]
  },
  {
    id: 'ev_legend_artifact',
    text: '旅途中你聽聞「破曉之劍」藏於冰封峽谷。',
    ageMin: 30, ageMax: 70,
    weight: 2,
    options: [
      { text: '獨自尋劍', outcome: { text: '你跨越冰原，尋得神兵！力量 +5。', effects: [{ type: 'stat', stat: 'str', value: 5 }] } },
      { text: '組隊出發', outcome: { text: '你結識豪傑。', effects: [{ type: 'npcAff', npc: 'party', value: 20 }, { type: 'stat', stat: 'lck', value: 2 }] } },
      { text: '放棄尋找', outcome: { text: '神話終究是神話。', effects: [{ type: 'log', text: '你轉身離去。' }] } }
    ]
  },

  // ========== 通用 ==========
  {
    id: 'ev_dream_omen',
    text: '夢中一位老者遞給你三道門，門後各有光芒。',
    ageMin: 10, ageMax: 80,
    weight: 4,
    options: [
      { text: '推開紅門（力量）', outcome: { text: '你化身戰神。力量 +1。', effects: [{ type: 'stat', stat: 'str', value: 1 }] } },
      { text: '推開藍門（智力）', outcome: { text: '你獲得啟示。智力 +1。', effects: [{ type: 'stat', stat: 'int', value: 1 }] } },
      { text: '推開金門（財富）', outcome: { text: '金光閃閃。金幣 +30。', effects: [{ type: 'gold', value: 30 }] } }
    ]
  },
  {
    id: 'ev_hermit_gift',
    text: '山中隱士遞給你一顆發光丹藥：「有緣人，吃下吧。」',
    ageMin: 15, ageMax: 70,
    weight: 3,
    options: [
      { text: '吞服丹藥', outcome: { text: '你感到渾身充滿力量。HP 全滿，力量 +1。', effects: [{ type: 'hp', value: 9999 }, { type: 'stat', stat: 'str', value: 1 }] } },
      { text: '婉拒（智力判定）', req: { stat: 'int', min: 10 }, outcome: { text: '你看出丹藥有異。隱士嘆服。「小心。」', effects: [{ type: 'stat', stat: 'int', value: 2 }] } },
      { text: '收下藏於懷中', outcome: { text: '你謹慎行事。', effects: [{ type: 'item', item: 'mystery_pill' }] } }
    ]
  },
  {
    id: 'ev_companion_meet',
    text: '你在酒館遇見一位志同道合的冒險者。',
    ageMin: 14, ageMax: 60,
    weight: 5,
    options: [
      { text: '暢談結義', outcome: { text: '【艾莉諾】成為夥伴！', effects: [{ type: 'npcAff', npc: 'eleanor', value: 30 }] } },
      { text: '切磋武藝（力量判定）', req: { stat: 'str', min: 8 }, outcome: { text: '你與對手惺惺相惜。力量 +1。', effects: [{ type: 'stat', stat: 'str', value: 1 }, { type: 'npcAff', npc: 'eleanor', value: 15 }] } },
      { text: '各走各路', outcome: { text: '你獨自前行。', effects: [{ type: 'log', text: '你離開酒館。' }] } }
    ]
  },
  {
    id: 'ev_lost_treasure',
    text: '你撿到一份藏寶圖，標示著鄰近古井。',
    ageMin: 8, ageMax: 70,
    weight: 4,
    options: [
      { text: '立刻挖掘', outcome: { text: '你挖出陳年寶箱！金幣 +60。', effects: [{ type: 'gold', value: 60 }] } },
      { text: '謹慎研究（智力判定）', req: { stat: 'int', min: 8 }, outcome: { text: '你識破陷阱，找到暗格。金幣 +120，獲得【古舊護符】。', effects: [{ type: 'gold', value: 120 }, { type: 'item', item: 'amulet_agi' }] } },
      { text: '賣掉藏寶圖', outcome: { text: '金幣 +15。', effects: [{ type: 'gold', value: 15 }] } }
    ]
  },
  {
    id: 'ev_plague_outbreak',
    text: '城中爆發瘟疫，到處都是咳嗽聲。',
    ageMin: 20, ageMax: 70,
    weight: 3,
    options: [
      { text: '留在城中抗疫（體質判定）', req: { stat: 'vit', min: 10 }, outcome: { text: '你安然度過。體質 +2。', effects: [{ type: 'stat', stat: 'vit', value: 2 }] } },
      { text: '逃離城鎮', outcome: { text: '你保住性命，但染上咳疾。HP -15。', effects: [{ type: 'hp', value: -15 }] } },
      { text: '研究解藥（智力判定）', req: { stat: 'int', min: 11 }, outcome: { text: '你研製出解藥救人無數！智力 +3，金幣 +100。', effects: [{ type: 'stat', stat: 'int', value: 3 }, { type: 'gold', value: 100 }] } }
    ]
  },
  {
    id: 'ev_god_herald',
    text: '天空裂開，神諭降臨：「凡人，接受試煉吧！」',
    ageMin: 25, ageMax: 60,
    weight: 1,
    options: [
      { text: '接受試煉', outcome: { text: '你經受雷擊洗禮！力量 +3，敏捷 +2，HP -20。', effects: [{ type: 'stat', stat: 'str', value: 3 }, { type: 'stat', stat: 'agi', value: 2 }, { type: 'hp', value: -20 }] } },
      { text: '跪地祈禱', outcome: { text: '神明微笑。獲得祝福。體質 +5，智力 +3。', effects: [{ type: 'stat', stat: 'vit', value: 5 }, { type: 'stat', stat: 'int', value: 3 }] } },
      { text: '嘲笑神明', outcome: { text: '雷電劈下！HP -40，智力 -2。', effects: [{ type: 'hp', value: -40 }, { type: 'stat', stat: 'int', value: -2 }] } }
    ]
  }
];

// 過濾符合條件事件
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
