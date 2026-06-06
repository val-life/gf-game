// 夥伴池。透過親密度解鎖戰鬥協助與犧牲

export const NPCS = {
  eleanor: {
    name: '艾莉諾',
    title: '劍舞者',
    desc: '爽朗的女劍士，與你結識於酒館。',
    affAt: 50,
    assistDesc: '每回合額外攻擊 1 次。',
    sacrificeDesc: '她擋下致命一擊。',
    combat: {
      bonusAtk: 5,
      extraTurn: true
    }
  },
  lover: {
    name: '匿名仰慕者',
    title: '心意之人',
    desc: '你不知道她的真名，但心意相通。',
    affAt: 40,
    assistDesc: '每回合恢復 8 HP。',
    sacrificeDesc: '她以身相救。',
    combat: {
      bonusHeal: 8
    }
  },
  rebel: {
    name: '反抗軍首領',
    title: '自由之劍',
    desc: '你戰場上的戰友。',
    affAt: 60,
    assistDesc: '暴擊率 +15%。',
    sacrificeDesc: '他為你爭取一線生機。',
    combat: {
      bonusCrit: 15
    }
  },
  party: {
    name: '冒險隊伍',
    title: '生死之交',
    desc: '四位志同道合的夥伴。',
    affAt: 70,
    assistDesc: '所有屬性 +3。',
    sacrificeDesc: '隊友們挺身而出。',
    combat: {
      allStats: 3
    }
  }
};
