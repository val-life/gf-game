/* =============================================================
   scenes.js — narrative content data
   Exposed as window.SCENES (object: id -> scene)
   ============================================================= */
(function (global) {
  'use strict';

  // Scene shape:
  //  title, text (array of paragraphs)
  //  choices: [{ text, next, requires?, set?, give?, take?, combat?, learn?, ... }]
  //  onEnter: { hp, mp, exp, cultivation, lingshi, age, item, give, learn, equip,
  //             set, message, achievement, ending, break, rollSpirit, finalizeChar }
  //  isEnding, hint, combat (auto-start combat on enter)

  const SCENES = {

    title: {
      title: '轮　回',
      text: [
        '一道电光划破夜空。',
        '你的意识从白光中升起，又如烟般散落。',
        '刹那间，前世如走马灯般掠过——',
        '那些欢喜、悔恨、错失、未竟之事，皆成云烟。',
        '你只知道，下一刻，魂将入另一世身。',
      ],
      choices: [
        { text: '开始新的轮回', next: 'char_create' },
        { text: '继续前世（读取存档）', next: '__load' },
        { text: '查看成就', next: '__achievements' },
        { text: '设置', next: '__settings' },
      ],
      hint: '提示：所有进度将自动存档于本机。键盘 1-9 选择，回车确认。',
    },

    char_create: {
      title: '命格初定',
      text: [
        '你缓缓张开眼。',
        '周围白茫茫一片，虚无中忽有一道苍老的声音响起：',
        '「魂兮来归，汝欲以何身入世？」',
        '「姓名、性别、天赋……皆由你自定。」',
      ],
      choices: [
        { text: '输入姓名 / 分配命格', next: 'char_roll' },
        { text: '返回', next: 'title' },
      ],
      hint: '小贴士：四维（根骨/悟性/气运/魅力）初始合计 20 点，剩余 4 点可自由分配。',
    },

    char_roll: {
      title: '灵根与命格',
      text: [
        '苍老的声音又道：',
        '「灵根乃修行之基，福缘深浅皆有定数。」',
        '「掷之。」',
      ],
      onEnter: { rollSpirit: true },
      choices: [
        { text: '确认，继续', next: 'char_done' },
        { text: '重新掷灵根', next: 'char_roll' },
        { text: '返回修改姓名', next: 'char_create' },
      ],
      hint: '灵根品阶影响突破成功率与法术威力。',
    },

    char_done: {
      title: '入　世',
      text: [
        '「善。」',
        '苍老声音渐渐隐去。',
        '你只觉天旋地转，再次失去知觉——',
        '当意识复苏时，耳畔已是另一种风声，另一种心跳。',
      ],
      onEnter: { finalizeChar: true, hp: 'full', mp: 'full', set: { prologue_done: true } },
      choices: [
        { text: '睁眼', next: 'reincarnation_awake' },
      ],
    },

    reincarnation_awake: {
      title: '初生',
      text: [
        '你醒了。',
        '眼前是一间昏暗的木屋，屋顶漏着几缕晨光。',
        '身下铺着粗布，空气中混着草药的苦香与淡淡的霉味。',
        '床边坐着一个面容憔悴的中年妇人，正怔怔地望着你。',
      ],
      choices: [
        { text: '「娘……」', next: 'r_meet_mother' },
        { text: '环顾四周', next: 'r_look_around' },
        { text: '尝试运转体内气息', next: 'r_qi_sense' },
      ],
    },

    r_look_around: {
      title: '木屋之中',
      text: [
        '木屋低矮而破旧。',
        '墙角堆着几捆柴火，一张矮桌上摆着半碗稀粥和一只空药罐。',
        '屋中央有一尊简陋的牌位，写着一个你不认识的名字。',
        '这就是你今世的家。',
      ],
      onEnter: { set: { looked_around: true } },
      choices: [
        { text: '与妇人说话', next: 'r_meet_mother' },
        { text: '尝试运转气息', next: 'r_qi_sense' },
      ],
    },

    r_meet_mother: {
      title: '妇人的泪',
      text: [
        '「阿牛……你醒了？」',
        '妇人惊喜地握住你的手，泪水顺着消瘦的脸颊滑落。',
        '「你昏迷了三天三夜，娘还以为你……罢了罢了，醒了便好。」',
        '你开口，声音嘶哑。',
        '她说此地是「清河村」，地处沧澜大陆东陲。',
        '你父亲三年前被征去修筑边关城塞，自此音讯全无。',
      ],
      onEnter: { set: { met_mother: true } },
      choices: [
        { text: '问及修行', next: 'r_ask_cultivation' },
        { text: '先问家境', next: 'r_ask_home' },
        { text: '默然', next: 'r_silent' },
      ],
    },

    r_ask_home: {
      title: '家徒四壁',
      text: [
        '「家里……还过得去。」',
        '妇人低声道，眼神却避开你的目光。',
        '你看得出，她说的话并不全是真的。',
        '但她为你端来那半碗温热的稀粥，叮嘱你慢慢喝。',
      ],
      onEnter: { set: { know_poverty: true } },
      choices: [
        { text: '喝下稀粥', next: 'r_eat', give: { hp: 5 } },
        { text: '问及修行', next: 'r_ask_cultivation' },
      ],
    },

    r_eat: {
      title: '温热的粥',
      text: [
        '稀粥下肚，腹中升起一股暖意。',
        '那妇人看着你吃完，露出一丝浅笑，又将空碗收走。',
        '你感到身体正在慢慢恢复。',
      ],
      onEnter: { hp: 5, message: '你感到体力微复。' },
      choices: [
        { text: '问及修行', next: 'r_ask_cultivation' },
      ],
    },

    r_ask_cultivation: {
      title: '何为修行',
      text: [
        '「修行？」妇人怔了怔。',
        '「听村中老人说，山那边有仙人，能御剑飞行、点石成金。但咱们清河村这穷乡僻壤……哪有什么修行之人。」',
        '她顿了顿：「倒是村东头的老李头，年轻时据说被一位云游道士点化过，会几手拳脚功夫。」',
      ],
      onEnter: { set: { know_li: true } },
      choices: [
        { text: '改日去拜访老李头', next: 'r_li_intro' },
        { text: '先养好身子再说', next: 'r_rest' },
      ],
    },

    r_silent: {
      title: '沉默',
      text: [
        '你没有说话，妇人便也陪你静静坐着。',
        '窗外有鸟雀掠过，远处似乎有犬吠。',
        '这便是你的新生——平凡、贫苦，却真实。',
      ],
      choices: [
        { text: '问及修行', next: 'r_ask_cultivation' },
        { text: '先睡一觉', next: 'r_rest' },
      ],
    },

    r_qi_sense: {
      title: '气感初现',
      text: [
        '你闭目凝神。',
        '周身似乎有一缕若有若无的温热，在丹田处徘徊。',
        '但它太弱了，像水面上的游丝，难以捉摸。',
        '你隐约明白：灵根已具，但尚未入门。',
      ],
      onEnter: { set: { felt_qi: true }, cultivation: 5, message: '你感到丹田温热，修为微有增长。' },
      choices: [
        { text: '继续', next: 'r_ask_cultivation' },
      ],
    },

    r_rest: {
      title: '安眠',
      text: [
        '你沉沉睡去。',
        '梦里又见白光，又有那苍老的声音：',
        '「命由天定，运在人为。」',
        '你醒来时，晨光已照进破屋。',
        '妇人端来一碗热粥，看着你吃完便出门去了。',
        '今天是去拜访老李头的好时机。',
      ],
      onEnter: { hp: 'full', mp: 'full', age: 0.1, set: { rested: true } },
      choices: [
        { text: '前往村东', next: 'act1_li_yard' },
        { text: '在村中转转', next: 'act1_village_square' },
      ],
    },

    r_li_intro: {
      title: '村东老李',
      text: [
        '次日清晨，你趁着身子稍好，往村东走去。',
        '老李头家的小院简陋却整齐，院中一株老槐。',
        '老人正劈柴，见你走来，抬眼一瞥：「是村头老牛家的小子？身子骨好些了？」',
      ],
      onEnter: { set: { going_to_li: true } },
      choices: [
        { text: '拜师', next: 'act1_li_yard' },
        { text: '先在村中逛逛', next: 'act1_village_square' },
      ],
    },

    // ====== ACT 1: 清河村 ======

    act1_village_square: {
      title: '清河村',
      text: [
        '清河村不大，约莫三十户人家，散落在河谷两侧。',
        '村口有口古井，井边立着块半埋的石碑，上刻「清河」二字。',
        '几个孩童在追逐嬉闹，远处田里有人吆喝着耕牛。',
      ],
      onEnter: { set: { at_village: true } },
      choices: [
        { text: '去村东找老李头', next: 'act1_li_yard' },
        { text: '在古井旁歇脚', next: 'act1_old_well' },
        { text: '去村长家', next: 'act1_village_head' },
        { text: '上后山采药', next: 'act1_mountain_herb' },
      ],
    },

    act1_old_well: {
      title: '古井之畔',
      text: [
        '你坐在井沿。',
        '井水清冽，映出你今世的面容——约莫十五六岁，略显稚嫩。',
        '你正出神，井底忽似有微光一闪。',
      ],
      choices: [
        { text: '俯身细看', next: 'act1_well_secret', requires: { qiyun: 2 } },
        { text: '抛石入井', next: 'act1_well_throw' },
        { text: '离开', next: 'act1_village_square' },
      ],
    },

    act1_well_throw: {
      title: '石落水响',
      text: [
        '你捡起一颗石子掷入井中。',
        '「咚——」',
        '回音悠长，似乎井极深。',
        '并无所见，你起身拍拍土，离开。',
      ],
      choices: [
        { text: '离开', next: 'act1_village_square' },
      ],
    },

    act1_well_secret: {
      title: '井底微光',
      text: [
        '你俯身下望，气沉丹田，眼瞳中隐隐现出微光。',
        '——井壁石缝中嵌着一枚玉简，半被青苔遮没。',
        '你以绳索将之取出。',
        '玉简入手冰凉，似有灵识徘徊。',
      ],
      onEnter: { give: { jade_slip: 1 }, set: { side_well_started: true }, message: '你获得「玉简」。' },
      choices: [
        { text: '尝试以灵识读之', next: 'act1_well_read' },
        { text: '先放好，改日再说', next: 'act1_village_square' },
      ],
    },

    act1_well_read: {
      title: '玉简之秘',
      text: [
        '你盘膝而坐，将玉简贴于眉心。',
        '一道清光涌入脑海——',
        '「吾乃清虚子，误入此处，已坐化三十年。',
        '今将「玄冰真诀」残篇传与有缘人。」',
        '你立时明白了玄冰真诀的运气法门。',
        '玉简应声碎裂，化作流光散去。',
      ],
      onEnter: { learn: 'ice_seal', set: { side_well_done: true }, cultivation: 20,
                 achievement: 'side_well' },
      choices: [
        { text: '前往村东拜师', next: 'act1_li_yard' },
        { text: '回木屋静修', next: 'r_rest' },
      ],
    },

    act1_village_head: {
      title: '村长家',
      text: [
        '村长姓周，年过五旬，是村中最有见识的人。',
        '他正在堂屋喝茶，见你进来便点头：「小牛啊，身子好全了？」',
        '寒暄几句后，他叹道：「村中近来不太平，后山的狼群似比往年凶狠……」',
      ],
      onEnter: { set: { met_chief: true } },
      choices: [
        { text: '询问狼群之事', next: 'act1_chief_wolves' },
        { text: '求一封荐书', next: 'act1_chief_letter', requires: { 'flag:met_li': true } },
        { text: '告辞', next: 'act1_village_square' },
      ],
    },

    act1_chief_wolves: {
      title: '狼祸',
      text: [
        '「近一月来，山中狼群频频下山。」',
        '周村长叹气：「村中王猎户家的小子，前夜被叼走了。」',
        '「若能除掉狼王，村中愿以三十灵石相谢。」',
        '你心里有了计较。',
      ],
      onEnter: { set: { quest_wolves: true } },
      choices: [
        { text: '领命', next: 'act1_li_yard' },
        { text: '再考虑', next: 'act1_village_head' },
      ],
    },

    act1_chief_letter: {
      title: '荐书',
      text: [
        '你提及想去寻仙问道。',
        '周村长沉吟良久：「也罢。」',
        '「我年轻时在山中曾遇一云游道人，他说若有机缘，可持此信去「青云宗」山门。」',
        '他提笔写就一封荐书，盖上私印，递与你。',
        '「路远山高，望你珍重。」',
      ],
      onEnter: { give: { village_letter: 1 }, set: { has_letter: true, path_sect_unlocked: true } },
      choices: [
        { text: '谢过', next: 'act1_village_square' },
      ],
    },

    act1_mountain_herb: {
      title: '后山采药',
      text: [
        '你背着小筐，往后山行去。',
        '山道崎岖，林中时有鸟雀飞起。',
        '约莫半个时辰，你来到一片开阔的山坡。',
      ],
      choices: [
        { text: '专心采药', next: 'act1_herb_success', requires: { wuxing: 2 } },
        { text: '深入林间', next: 'act1_herb_danger' },
        { text: '回家', next: 'act1_village_square' },
      ],
    },

    act1_herb_success: {
      title: '灵草入手',
      text: [
        '你凭借悟性，识得几种灵草：青芝、赤苓、淡竹叶。',
        '将它们小心采下，装入筐中。',
        '正欲离开，忽闻林深处传来低吼。',
      ],
      onEnter: { give: { spirit_herb: 3 }, set: { herb_done: true } },
      choices: [
        { text: '循声探看', next: 'act1_wolf_encounter' },
        { text: '速速离开', next: 'act1_village_square' },
      ],
    },

    act1_herb_danger: {
      title: '毒蛇',
      text: [
        '你拨开草丛，忽然一条青蛇窜出！',
        '你猝不及防，被咬了一口。',
        '蛇影一闪，钻入石缝。',
      ],
      combat: 'venom_snake',
      choices: [
        { text: '战斗', next: '__combat_venom_snake' },
        { text: '离开', next: 'act1_village_square' },
      ],
    },

    act1_wolf_encounter: {
      title: '山狼',
      text: [
        '林深处，三只山狼正围着一只小鹿。',
        '其中一只发现了你，绿幽幽的眼睛盯过来。',
      ],
      combat: 'mountain_wolf',
      choices: [
        { text: '战斗', next: '__combat_mountain_wolf' },
        { text: '撤走', next: 'act1_village_square' },
      ],
    },

    act1_li_yard: {
      title: '老李头的小院',
      text: [
        '老李头停下手中斧头，看你一眼。',
        '「你小子来寻我，是想学那两手功夫？」',
        '他嘿嘿一笑：「我可以教你，但得先替我做件事。」',
        '「东边山神庙，年久失修。你若能去清扫一遍，我便收你做个记名弟子。」',
      ],
      onEnter: { set: { met_li: true } },
      choices: [
        { text: '欣然应允', next: 'act1_temple_clean' },
        { text: '询问功夫详情', next: 'act1_li_teach' },
        { text: '不学', next: 'act1_village_square' },
      ],
    },

    act1_li_teach: {
      title: '拳脚之功',
      text: [
        '老李头摆了个起手式，拳脚带风。',
        '「我所学不过外家拳脚，加几手吐纳导引，强身健体罢了。」',
        '「真正的修行，得去寻那些大宗门。」',
        '「先随我学个三五年，至少……遇狼不慌。」',
      ],
      choices: [
        { text: '拜师', next: 'act1_temple_clean' },
        { text: '不学', next: 'act1_village_square' },
      ],
    },

    act1_temple_clean: {
      title: '山神庙',
      text: [
        '你花了一日功夫，扫除落叶、拂去尘埃、修整倾倒的香案。',
        '山神庙不大，主祀一尊石像，雕的是一位披甲执剑的神将。',
        '你在清扫时，意外发现石像脚边藏着几本泛黄的拳经。',
        '回到村中，老李头如约收你做了记名弟子。',
      ],
      onEnter: { give: { lingshi: 8 }, set: { li_apprentice: true, temple_cleaned: true } },
      choices: [
        { text: '向师父讨教', next: 'act1_li_train' },
        { text: '去后山剿狼', next: 'act1_wolf_quest', requires: { 'flag:quest_wolves': true } },
        { text: '继续游历', next: 'act1_village_square' },
      ],
    },

    act1_li_train: {
      title: '习武',
      text: [
        '老李头传你一套「清河拳」，动作不繁，但讲求吐纳配合。',
        '你跟着练了三日，渐觉体内气息略有增长。',
        '拳脚功夫虽粗，却让你对自身有了更深的了解。',
      ],
      onEnter: { cultivation: 15, set: { trained_li: true } },
      choices: [
        { text: '继续修炼', next: 'act1_li_train2' },
        { text: '出师下山', next: 'act1_leave_village' },
      ],
    },

    act1_li_train2: {
      title: '气血初成',
      text: [
        '又数日，你自觉气海中似有真息萌动。',
        '师父看出端倪：「小子，你灵根不俗。留在村中屈才。」',
        '「去吧，外面世界才大。」',
      ],
      onEnter: { cultivation: 25, exp: 30, hp: 15, mp: 10 },
      choices: [
        { text: '谢过师父，下山', next: 'act1_leave_village' },
      ],
    },

    act1_wolf_quest: {
      title: '狼祸未平',
      text: [
        '你整了整装备，往后山行去。',
        '林深处狼嚎此起彼伏。',
        '很快，一群山狼围了上来。',
      ],
      combat: 'mountain_wolf',
      choices: [
        { text: '继续深入', next: 'act1_wolf_boss' },
      ],
    },

    act1_wolf_boss: {
      title: '狼王',
      text: [
        '群狼散去，林中现出一头巨狼——',
        '它毛色银白，比寻常山狼大了一倍。',
        '它，便是狼王。',
      ],
      combat: 'mountain_ape',
      choices: [
        { text: '战', next: '__combat_mountain_ape' },
      ],
    },

    act1_leave_village: {
      title: '别了清河',
      text: [
        '你背起行囊，拜别母亲与师父。',
        '妇人眼眶红红的，却强作笑颜：「去吧，闯出个人样来。」',
        '老李头递来一柄青钢长剑：「路上小心。」',
        '你转身，大步迈向山外。',
      ],
      onEnter: { give: { iron_sword: 1 }, set: { left_village: true } },
      choices: [
        { text: '凭荐书往青云宗', next: 'act2_sect_arrival', requires: { 'flag:has_letter': true } },
        { text: '做一名散修', next: 'act2_wander_intro' },
        { text: '回村再想想', next: 'act1_village_square' },
      ],
    },

    // ====== ACT 2A: 青云宗 ======

    act2_sect_arrival: {
      title: '青云宗',
      text: [
        '你翻过数重山岭，来到一处云雾缭绕的山门之前。',
        '石阶三千级，两旁古松苍翠。',
        '山门匾额高悬：「青云宗」。',
        '一位青衣弟子迎上前来，验过荐书后，便领你入外门。',
      ],
      onEnter: { set: { at_sect: true, path_sect: true } },
      choices: [
        { text: '拜入外门', next: 'act2_outer_disciple' },
        { text: '四处走走', next: 'act2_sect_tour' },
      ],
    },

    act2_sect_tour: {
      title: '宗门之景',
      text: [
        '青云宗占地甚广，分为外门、内门、长老峰、藏经阁、丹房、演武场等。',
        '外门弟子多在演武场习武、丹房炼药。',
        '你注意到内门方向禁制森严，凡人难入。',
      ],
      onEnter: { set: { tour_sect: true } },
      choices: [
        { text: '前往演武场', next: 'act2_outer_disciple' },
        { text: '前往丹房', next: 'act2_pill_room' },
        { text: '前往藏经阁', next: 'act2_library' },
      ],
    },

    act2_pill_room: {
      title: '丹房',
      text: [
        '丹房中弥漫着药香，几位师兄正在炼丹。',
        '一位师兄瞥你一眼：「新来的？外门弟子每月可领三枚回春丹。去吧，管事那儿领。」',
      ],
      onEnter: { give: { minor_pill: 3 } },
      choices: [
        { text: '谢过', next: 'act2_outer_disciple' },
      ],
    },

    act2_library: {
      title: '藏经阁',
      text: [
        '藏经阁内架上千卷，多为外门弟子可借的功法札记。',
        '管事老者问明你来意，借你一卷《五行入门诀》。',
      ],
      onEnter: { give: { manual_basic: 1 }, learn: 'meditation' },
      choices: [
        { text: '闭关修炼', next: 'act2_first_breakthrough' },
        { text: '先回外门', next: 'act2_outer_disciple' },
      ],
    },

    act2_outer_disciple: {
      title: '外门弟子',
      text: [
        '作为外门弟子，你每日清晨打坐，午后习武，傍晚采药。',
        '日子平静而单调。',
        '然你明白——这仅是开始。',
      ],
      choices: [
        { text: '潜心修炼', next: 'act2_first_breakthrough' },
        { text: '完成采药任务', next: 'act2_herb_task' },
        { text: '参加外门演武', next: 'act2_outer_tourney' },
        { text: '结交师兄', next: 'act2_bond_friend' },
      ],
    },

    act2_first_breakthrough: {
      title: '破凡入道',
      text: [
        '你盘膝坐于静室，气海中蓄养已久的真息终于冲破某道关隘——',
        '一道暖流自丹田涌出，遍布四肢百骸。',
        '你睁开眼，知道自己已踏入「练气」之境。',
        '这便是修行的第一步。',
      ],
      onEnter: { break: 'lianqi', set: { first_breakthrough: true }, achievement: 'first_qi' },
      choices: [
        { text: '继续修行', next: 'act2_outer_disciple' },
        { text: '挑战内门试炼', next: 'act2_inner_trial' },
      ],
    },

    act2_herb_task: {
      title: '采药',
      text: [
        '你与几位外门弟子同往山中采药。',
        '路遇山贼拦截，对方人多势众。',
      ],
      combat: 'bandit',
      choices: [
        { text: '战', next: '__combat_bandit' },
      ],
    },

    act2_outer_tourney: {
      title: '外门演武',
      text: [
        '演武场上，十几名外门弟子捉对比试。',
        '一位师兄注意到你：「新来的，敢上台比试否？」',
        '他身手不弱，但你更想试试自己的斤两。',
      ],
      combat: 'black_wind_bandit',
      choices: [
        { text: '战', next: '__combat_black_wind_bandit' },
      ],
    },

    act2_bond_friend: {
      title: '同门之谊',
      text: [
        '你结识了一位叫苏婉的师姐，她性情温婉，对你颇为照顾。',
        '她悄悄告诉你：内门藏经阁中有一门剑术，威力极大，但需内门身份。',
      ],
      onEnter: { set: { friend_suwan: true } },
      choices: [
        { text: '继续', next: 'act2_outer_disciple' },
      ],
    },

    act2_inner_trial: {
      title: '内门试炼',
      text: [
        '内门试炼在藏剑谷举行。',
        '谷中遍布剑意残留，更有一头守护妖兽盘踞。',
        '你需先过剑林，再击败妖兽，方可入内门。',
      ],
      combat: 'snake_yao',
      onEnter: { set: { inner_trial_start: true } },
      choices: [
        { text: '战', next: '__combat_snake_yao' },
        { text: '退缩', next: 'act2_outer_disciple' },
      ],
    },

    act2_inner_pass: {
      title: '入内门',
      text: [
        '你战胜妖兽，长老大悦：「可造之材！」',
        '你被收为内门弟子，并被允许借阅上乘功法。',
      ],
      onEnter: { give: { manual_sword: 1, lingshi: 50 }, set: { inner_disciple: true, path_inner: true } },
      choices: [
        { text: '继续修行', next: 'act2_inner_train' },
        { text: '下山游历', next: 'act2_sect_journey' },
      ],
    },

    act2_inner_train: {
      title: '内门修行',
      text: [
        '内门之中，灵气浓郁，师兄们亦多为俊杰。',
        '你潜心修炼，进境神速。',
      ],
      onEnter: { cultivation: 60, exp: 80 },
      choices: [
        { text: '闭关突破', next: 'act2_zhuji_break', requires: { 'realm:lianqi_layer:7': true } },
        { text: '下山游历', next: 'act2_sect_journey' },
        { text: '查阅典籍', next: 'act2_inner_library' },
      ],
    },

    act2_inner_library: {
      title: '内门典籍',
      text: [
        '内门藏经阁中，你发现了一本残破的《太虚雷篆》。',
        '其中所载的，正是五行雷法。',
      ],
      onEnter: { give: { manual_void: 1 }, learn: 'thunder' },
      choices: [
        { text: '继续', next: 'act2_inner_train' },
      ],
    },

    act2_zhuji_break: {
      title: '筑基',
      text: [
        '你闭关数月，体内真元逐渐凝实。',
        '一朝破关——',
        '丹田之中，真息凝聚成一片基台，名为「筑基」。',
        '你的寿元也增至两百载。',
      ],
      onEnter: { break: 'zhuji', set: { zhuji_done: true }, achievement: 'foundation' },
      choices: [
        { text: '出关', next: 'act3_incursion' },
      ],
    },

    act2_sect_journey: {
      title: '下山游历',
      text: [
        '你奉师命下山，访友除魔。',
        '途中听闻南方有妖物作乱，黑水寨匪患亦甚。',
      ],
      choices: [
        { text: '前往南方', next: 'act2_south_demon' },
        { text: '清剿黑水寨', next: 'act2_black_water' },
        { text: '回宗', next: 'act2_inner_train' },
      ],
    },

    act2_black_water: {
      title: '黑水寨',
      text: [
        '黑水寨盘踞江心，寨主武艺高强。',
        '你潜入寨中，与寨主正面交锋。',
      ],
      combat: 'black_water_lord',
      onEnter: { set: { quest_black_water: true } },
      choices: [
        { text: '战', next: '__combat_black_water_lord' },
      ],
    },

    act2_south_demon: {
      title: '南荒妖踪',
      text: [
        '南方荒原上，妖气冲天。',
        '你遇一队散修，正结伴探查妖巢。',
      ],
      combat: 'demon_cultivator',
      onEnter: { set: { quest_south_demon: true } },
      choices: [
        { text: '战', next: '__combat_demon_cultivator' },
      ],
    },

    // ====== ACT 2B: 散修 ======

    act2_wander_intro: {
      title: '散修之路',
      text: [
        '你不愿入宗门束缚，独自背上行囊。',
        '沧澜之大，何处不可为家？',
        '你听说西边的镜湖中，有仙人遗迹。',
      ],
      onEnter: { set: { at_wander: true, path_wander: true } },
      choices: [
        { text: '前往镜湖', next: 'act2_mirror_lake' },
        { text: '加入散修盟', next: 'act2_lonely_sect' },
        { text: '浪迹天涯', next: 'act2_road_enc' },
      ],
    },

    act2_road_enc: {
      title: '路遇',
      text: [
        '你在路上遇一位青衣老者，步履蹒跚。',
        '他身染重病，倒在道旁。',
      ],
      choices: [
        { text: '施以援手', next: 'act2_save_old', requires: { meili: 1 } },
        { text: '置之不理', next: 'act2_ignore_old' },
        { text: '搜刮财物', next: 'act2_rob_old' },
      ],
    },

    act2_save_old: {
      title: '善缘',
      text: [
        '你以回春丹救下老者。',
        '老者醒后叹息：「小哥，多谢救命之恩。老夫云虚子，习得几分粗浅道术。」',
        '「我观你灵根不俗——此卷《玄冰真诀》送你，望你好自为之。」',
        '老者言罢，飘然而去。',
      ],
      onEnter: { give: { manual_ice: 1, minor_pill: 1 }, learn: 'ice_seal',
                 set: { saved_old: true, karmic_good: 1 },
                 cultivation: 15, message: '你的修为有所增长。' },
      choices: [
        { text: '继续上路', next: 'act2_wander_intro' },
      ],
    },

    act2_ignore_old: {
      title: '漠视',
      text: [
        '你绕开老者，大步离开。',
        '身后隐约传来几声咳嗽。',
        '你心里并无波澜。',
      ],
      onEnter: { set: { ignored_old: true } },
      choices: [
        { text: '继续', next: 'act2_wander_intro' },
      ],
    },

    act2_rob_old: {
      title: '劫财',
      text: [
        '你抢下老者包袱。',
        '包袱中只有几张黄纸和半块干粮。',
        '老者目眦欲裂，嘶哑咒骂。',
        '你快步离开，心中却隐隐不安。',
      ],
      onEnter: { set: { robbed_old: true, karmic_evil: 1 }, give: { lingshi: 5 } },
      choices: [
        { text: '继续', next: 'act2_wander_intro' },
      ],
    },

    act2_mirror_lake: {
      title: '镜湖',
      text: [
        '镜湖如镜，倒映云天。',
        '湖畔立有一座残破的石碑，上刻「仙人遗地」。',
        '湖中似有岛屿，隐现微光。',
      ],
      choices: [
        { text: '涉水登岛', next: 'act2_island', requires: { qiyun: 3 } },
        { text: '绕湖而行', next: 'act2_lake_around' },
        { text: '离开', next: 'act2_wander_intro' },
      ],
    },

    act2_island: {
      title: '湖心岛',
      text: [
        '你以真息护体，涉水登岛。',
        '岛上有一座矮小石室，室中端坐着一具枯骨。',
        '其身旁留有一卷古籍与一柄飞剑。',
      ],
      onEnter: { give: { manual_void: 1, flying_sword: 1 },
                 learn: 'thunder',
                 set: { island_found: true },
                 cultivation: 50 },
      choices: [
        { text: '离开', next: 'act2_wander_intro' },
      ],
    },

    act2_lake_around: {
      title: '湖岸',
      text: [
        '你绕湖而行，并无所得。',
        '只觉此地灵气浓郁，便静坐了一会儿。',
      ],
      onEnter: { cultivation: 15 },
      choices: [
        { text: '离开', next: 'act2_wander_intro' },
      ],
    },

    act2_lonely_sect: {
      title: '散修盟',
      text: [
        '散修盟是各地散修自发结成的松散联盟。',
        '盟主「醉翁」是位筑基后期修士，性情豪爽。',
        '盟中常发布悬赏任务。',
      ],
      onEnter: { set: { at_lonely_sect: true } },
      choices: [
        { text: '接悬赏', next: 'act2_bounty' },
        { text: '结交朋友', next: 'act2_wander_friend' },
        { text: '离开', next: 'act2_wander_intro' },
      ],
    },

    act2_bounty: {
      title: '悬赏：除妖',
      text: [
        '盟中正悬赏一头祸害乡里的鬼面蛛。',
        '你领命前往。',
      ],
      combat: 'ghost_spider',
      onEnter: { set: { quest_spider: true } },
      choices: [
        { text: '战', next: '__combat_ghost_spider' },
      ],
    },

    act2_wander_friend: {
      title: '结交散修',
      text: [
        '你结识了一位身背长剑的青年，他自称「青云子」。',
        '他说起自己曾游历天下，对正邪两道皆知一二。',
      ],
      onEnter: { set: { friend_qingyun: true } },
      choices: [
        { text: '继续', next: 'act2_lonely_sect' },
      ],
    },

    act2_wander_breakthrough: {
      title: '散修破境',
      text: [
        '在多次历练之后，你体内真元盈满。',
        '一朝闭关，踏入练气之境。',
      ],
      onEnter: { break: 'lianqi', set: { wander_first_break: true } },
      choices: [
        { text: '继续游历', next: 'act2_wander_journey' },
      ],
    },

    act2_wander_journey: {
      title: '浪迹天涯',
      text: [
        '你的修为日渐精进，江湖上也渐有薄名。',
        '有人称你「独行剑客」，有人称你「夜游散人」。',
      ],
      choices: [
        { text: '挑战恶名修士', next: 'act2_duel_demon' },
        { text: '寻找仙人遗地', next: 'act2_sage_relic' },
        { text: '回散修盟', next: 'act2_lonely_sect' },
      ],
    },

    act2_duel_demon: {
      title: '对决魔修',
      text: [
        '一魔修名动江湖，专以采补术害人。',
        '你与其约战于荒野。',
      ],
      combat: 'demon_cultivator',
      choices: [
        { text: '战', next: '__combat_demon_cultivator' },
      ],
    },

    act2_sage_relic: {
      title: '仙人遗地',
      text: [
        '你循古图所指，来到一处被云雾封锁的山谷。',
        '谷中遗有上古石室，室内浮尘不染。',
        '你依稀看见墙上刻着几行古字。',
      ],
      onEnter: { set: { relic_entered: true }, cultivation: 40 },
      choices: [
        { text: '参悟', next: 'act2_relic_insight' },
        { text: '离开', next: 'act2_wander_journey' },
      ],
    },

    act2_relic_insight: {
      title: '石室悟道',
      text: [
        '你静心参悟。',
        '古字是前人留下的修行笔记——关于道心、关于因果、关于突破。',
        '你获益匪浅。',
      ],
      onEnter: { cultivation: 80, set: { relic_insight: true } },
      choices: [
        { text: '离开', next: 'act2_wander_journey' },
      ],
    },

    // ====== ACT 3: Climax ======

    act3_incursion: {
      title: '魔潮',
      text: [
        '你在内门修行时，忽听警钟长鸣。',
        '山门外黑气冲霄，魔修大举进犯。',
        '长老传令：「所有内门弟子随我出阵！」',
      ],
      onEnter: { set: { act3_started: true, incursion: true } },
      choices: [
        { text: '出阵迎敌', next: 'act3_incursion_battle' },
        { text: '留守山门', next: 'act3_defend_gate' },
      ],
    },

    act3_incursion_battle: {
      title: '正邪对决',
      text: [
        '魔修率领妖众猛攻山门。',
        '你与几位同门并肩御敌。',
        '魔修中走出一位身披黑袍者，气息深不可测——',
        '那是魔道巨擘「血渊」。',
      ],
      combat: 'demon_cultivator',
      onEnter: { set: { faced_demon: true } },
      choices: [
        { text: '战', next: '__combat_demon_cultivator' },
      ],
    },

    act3_defend_gate: {
      title: '坚守',
      text: [
        '你与众弟子坚守山门。',
        '在众人的合力下，魔潮被击退。',
        '血渊的身影在黑气中冷笑一声，飘然退去。',
        '你的名字，被记入宗门功册。',
      ],
      onEnter: { cultivation: 100, set: { defended_gate: true, reputation_sect: 5 } },
      choices: [
        { text: '继续', next: 'act3_after_incursion' },
      ],
    },

    act3_after_incursion: {
      title: '战后',
      text: [
        '战后，宗门召开大会。',
        '长老宣布：将在三月后举行「宗主继任大典」，遴选新一代宗主。',
        '作为内门俊彦，你有资格参与选拔。',
      ],
      onEnter: { set: { tournament_invited: true } },
      choices: [
        { text: '参与选拔', next: 'act3_sect_master_duel' },
        { text: '退隐江湖', next: 'ending_wandering_sage' },
        { text: '为宗门再立功勋', next: 'act3_yao_king' },
      ],
    },

    act3_sect_master_duel: {
      title: '宗主对决',
      text: [
        '演武台上，你与数位师兄轮番对决。',
        '最终，你与一位筑基后期的师兄对峙。',
      ],
      combat: 'sect_master',
      onEnter: { set: { sect_duel: true } },
      choices: [
        { text: '战', next: '__combat_sect_master' },
      ],
    },

    act3_yao_king: {
      title: '南荒妖王',
      text: [
        '你与几位同门南下，追击妖王。',
        '南荒深处，妖气冲霄，巨妖现身。',
      ],
      combat: 'yao_king',
      onEnter: { set: { yao_king_fight: true } },
      choices: [
        { text: '战', next: '__combat_yao_king' },
      ],
    },

    act3_final_choice: {
      title: '抉择',
      text: [
        '你立身于沧澜之巅，回首一生。',
        '前方有数条路。',
        '你将如何走完此生？',
      ],
      choices: [
        { text: '飞升仙道', next: 'ending_ascend', requires: { 'realm:jindan': true } },
        { text: '继任宗主', next: 'ending_sect_master', requires: { 'flag:sect_duel': true } },
        { text: '归隐山林', next: 'ending_wandering_sage' },
        { text: '凡人善终', next: 'ending_mortal_end', requires: { 'flag:karmic_good': 1 } },
        { text: '天谴身死', next: 'ending_divine_retribution', requires: { 'flag:karmic_evil': 2 } },
        { text: '逍遥仙路（隐藏）', next: 'ending_carefree_immortal', requires: { 'flag:relic_insight': true } },
        { text: '轮回重启（隐藏）', next: 'ending_reincarnate', requires: { 'flag:memory5': true } },
      ],
    },

    // ====== SIDE QUESTS ======

    side_herb_specialist: {
      title: '炼丹奇才',
      text: [
        '村中李婆婆请你帮她去山中采一种稀有的「雪芝草」。',
        '若你愿意，可寻一寻。',
      ],
      onEnter: { set: { side_herb_start: true } },
      choices: [
        { text: '接下任务', next: 'side_herb_collect' },
        { text: '婉拒', next: 'act1_village_square' },
      ],
    },

    side_herb_collect: {
      title: '雪芝草',
      text: [
        '你沿山涧而上，在一背阴的崖壁下发现了雪芝草。',
        '你小心将它采下，归还李婆婆。',
        '她喜出望外，赠你一枚聚气丹。',
      ],
      onEnter: { give: { cultivation_pill: 1, lingshi: 15 }, set: { side_herb_done: true } },
      choices: [
        { text: '回村', next: 'act1_village_square' },
      ],
    },

    side_sword_tome: {
      title: '失落的剑谱',
      text: [
        '你在山中古洞发现一卷被蛛网缠绕的剑谱。',
        '仔细辨认，是一套失传已久的「御剑术」。',
      ],
      onEnter: { give: { manual_sword: 1 }, learn: 'sword_qi', set: { side_sword_done: true } },
      choices: [
        { text: '继续', next: 'act1_leave_village' },
      ],
    },

    side_memory: {
      title: '前世的记忆',
      text: [
        '你于梦中又见前世的光景。',
        '这次比往常更清晰——',
        '你似乎记起了一些事。',
      ],
      onEnter: { set: { memory1: true }, cultivation: 5 },
      choices: [
        { text: '继续收集', next: 'side_memory_more' },
        { text: '回', next: 'act1_village_square' },
      ],
    },

    side_memory_more: {
      title: '第二片记忆',
      text: [
        '你再次入梦，记忆更清晰了一些。',
        '你记起前世的一些面孔。',
      ],
      onEnter: { set: { memory2: true }, cultivation: 5 },
      choices: [
        { text: '继续', next: 'side_memory_more2' },
      ],
    },

    side_memory_more2: {
      title: '第三片',
      text: [
        '你又梦见前世。',
        '你记起一些关键的过往。',
      ],
      onEnter: { set: { memory3: true }, cultivation: 5 },
      choices: [
        { text: '继续', next: 'side_memory_more3' },
      ],
    },

    side_memory_more3: {
      title: '第四片',
      text: [
        '你于恍惚中又见前世的尾声。',
      ],
      onEnter: { set: { memory4: true }, cultivation: 5 },
      choices: [
        { text: '继续', next: 'side_memory_more4' },
      ],
    },

    side_memory_more4: {
      title: '第五片——轮回之秘',
      text: [
        '你于梦中顿悟：前世之死，并非偶然。',
        '你记起了一道声音：',
        '「七世轮回，方得真我。」',
        '你醒时，修为已大涨。',
      ],
      onEnter: { set: { memory5: true }, cultivation: 30,
                 learn: 'soul_out',
                 give: { memory_fragment: 1 } },
      choices: [
        { text: '继续', next: 'act3_final_choice' },
      ],
    },

    // ====== ENDINGS ======

    ending_ascend: {
      title: '飞升仙道',
      text: [
        '你一身修为已臻化境。',
        '天际紫气东来，仙乐隐隐。',
        '你白日飞升，留下一道传说。',
        '后世有人言之凿凿：你已成仙。',
      ],
      isEnding: true,
      onEnter: { ending: '飞升仙道' },
      choices: [
        { text: '回到标题', next: 'title' },
      ],
    },

    ending_sect_master: {
      title: '继任宗主',
      text: [
        '你于对决中胜出，被推举为新一任宗主。',
        '你接掌青云宗，励精图治，门派大兴。',
        '百年之后，门人遍布天下，皆念你之名。',
      ],
      isEnding: true,
      onEnter: { ending: '继任宗主' },
      choices: [
        { text: '回到标题', next: 'title' },
      ],
    },

    ending_wandering_sage: {
      title: '归隐山林',
      text: [
        '你褪去尘劳，归隐于山林。',
        '晨起观云，暮时听泉。',
        '你在山间度过了恬淡的余生。',
      ],
      isEnding: true,
      onEnter: { ending: '归隐山林' },
      choices: [
        { text: '回到标题', next: 'title' },
      ],
    },

    ending_mortal_end: {
      title: '凡人善终',
      text: [
        '你一生未入道，娶妻生子，老于牖下。',
        '临终时，儿孙绕膝，平静而终。',
        '或许——这便是凡人的大幸。',
      ],
      isEnding: true,
      onEnter: { ending: '凡人善终' },
      choices: [
        { text: '回到标题', next: 'title' },
      ],
    },

    ending_divine_retribution: {
      title: '天谴',
      text: [
        '你一生作恶多端，终为天道所不容。',
        '雷劫降下，你形神俱灭。',
        '唯余一缕怨气，久久不散。',
      ],
      isEnding: true,
      onEnter: { ending: '天谴身死' },
      choices: [
        { text: '回到标题', next: 'title' },
      ],
    },

    ending_carefree_immortal: {
      title: '逍遥仙（隐藏）',
      text: [
        '你不滞于物，不累于心。',
        '一日顿悟，乘风而起。',
        '你成了一位逍遥世的散仙。',
      ],
      isEnding: true,
      onEnter: { ending: '逍遥仙' },
      choices: [
        { text: '回到标题', next: 'title' },
      ],
    },

    ending_reincarnate: {
      title: '轮回重启（隐藏）',
      text: [
        '你记起了所有的前世。',
        '七世轮回的因果在你眼前展开。',
        '你笑了笑——',
        '下一世，再来。',
        '你化作一道流光，遁入轮回深处。',
        '——而你的故事，将由下一位「你」续写。',
      ],
      isEnding: true,
      onEnter: { ending: '轮回重启', set: { cycle_completed: true } },
      choices: [
        { text: '回到标题', next: 'title' },
      ],
    },

    // ====== COMBAT PLACEHOLDERS ======
    __combat_mountain_wolf:     { winNext: 'act1_village_square',  loseNext: 'r_rest' },
    __combat_bandit:            { winNext: 'act2_outer_disciple',  loseNext: 'r_rest' },
    __combat_venom_snake:       { winNext: 'act1_village_square',  loseNext: 'r_rest' },
    __combat_mountain_ape:      { winNext: 'act1_chief_reward',    loseNext: 'r_rest' },
    __combat_black_wind_bandit: { winNext: 'act2_outer_disciple',  loseNext: 'r_rest' },
    __combat_snake_yao:         { winNext: 'act2_inner_pass',      loseNext: 'act2_outer_disciple' },
    __combat_ghost_spider:      { winNext: 'act2_lonely_sect',     loseNext: 'act2_wander_intro' },
    __combat_demon_cultivator:  { winNext: 'act3_final_choice',    loseNext: 'r_rest' },
    __combat_black_water_lord:  { winNext: 'act2_sect_journey',    loseNext: 'act2_inner_train' },
    __combat_sect_master:       { winNext: 'ending_sect_master',   loseNext: 'act3_after_incursion' },
    __combat_yao_king:          { winNext: 'act3_final_choice',    loseNext: 'r_rest' },

    act1_chief_reward: {
      title: '狼王已除',
      text: [
        '你斩杀了狼王。',
        '村长大喜，将三十灵石与一柄「青锋剑」相赠。',
        '你成了清河村的英雄。',
      ],
      onEnter: { give: { lingshi: 30, flying_sword: 1 }, set: { quest_wolves_done: true } },
      choices: [
        { text: '感谢', next: 'act1_village_square' },
      ],
    },
  };

  global.SCENES = SCENES;
})(window);
