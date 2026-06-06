// 夥伴池
export const NPCS = {
  eleanor: {
    name: '艾莉諾',
    title: '劍舞者',
    desc: '爽朗的女劍士，與你結識於酒館。',
    affAt: 50,
    combat: { atk: 5, extraTurn: true }
  },
  lover: {
    name: '匿名仰慕者',
    title: '心意之人',
    desc: '你不知道她的真名，但心意相通。',
    affAt: 40,
    combat: { healTurn: 8 }
  },
  rebel: {
    name: '反抗軍首領',
    title: '自由之劍',
    desc: '你戰場上的戰友。',
    affAt: 60,
    combat: { crit: 15 }
  },
  party: {
    name: '冒險隊伍',
    title: '生死之交',
    desc: '四位志同道合的夥伴。',
    affAt: 70,
    combat: { allStats: 3 }
  },
  // 主線角色
  lucy: {
    name: '露西',
    title: '未來的聖女',
    desc: '金髮碧眼，溫柔又堅定的少女，教堂邂逅。',
    affAt: 60,
    combat: { healTurn: 15, allStats: 2 }
  },
  ryan: {
    name: '萊恩',
    title: '同期天才',
    desc: '你戰勝後成為你副官的青年劍士。',
    affAt: 50,
    combat: { atk: 30, crit: 10 }
  },
  elf_princess: {
    name: '艾拉',
    title: '精靈公主',
    desc: '精靈女王之女，銀髮飄逸，對你暗生情愫。',
    affAt: 80,
    combat: { atk: 50, def: 30, allStats: 3 }
  }
};

export const COMPANION_LIST = ['eleanor', 'lover', 'rebel', 'party', 'lucy', 'ryan', 'elf_princess'];
