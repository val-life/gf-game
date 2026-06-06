/* =============================================================
   enemies.js — enemy definitions
   Exposed as window.ENEMIES (object: id -> enemy)
   ============================================================= */
(function (global) {
  'use strict';

  // Enemy shape:
  //  name, desc
  //  hp, mp, atk, def, mag, res, spd
  //  ai: 'aggressive' | 'defensive' | 'caster' | 'summoner' | 'berserk' | 'tricky'
  //  level: suggested player realm level for balance
  //  skills: list of skill ids
  //  drop: { exp, lingshi, items:[{id, chance, qty}] }
  //  boss: boolean  (cannot flee)

  const ENEMIES = {
    // === common ===
    mountain_wolf: {
      id:'mountain_wolf', name:'山狼', desc:'成群结队的灰毛山狼。',
      hp:30, mp:0, atk:8, def:3, mag:0, res:2, spd:9, level:1, ai:'aggressive',
      skills:['strike'],
      drop:{ exp:8, lingshi:3, items:[{id:'beast_core',chance:0.25,qty:1}] },
    },
    bandit: {
      id:'bandit', name:'山贼', desc:'拦路剪径的匪徒。',
      hp:40, mp:0, atk:10, def:4, mag:0, res:2, spd:8, level:1, ai:'aggressive',
      skills:['strike'],
      drop:{ exp:12, lingshi:6, items:[{id:'refined_iron',chance:0.2,qty:1}] },
    },
    venom_snake: {
      id:'venom_snake', name:'毒蛇', desc:'草丛中潜伏的毒蛇。',
      hp:22, mp:0, atk:7, def:2, mag:0, res:2, spd:11, level:1, ai:'tricky',
      skills:['strike','ice_seal'], // uses a status-applying skill
      statusOnHit:'poison', statusChance:0.5, // applies poison to player
      drop:{ exp:10, lingshi:2, items:[{id:'spirit_herb',chance:0.3,qty:1}] },
    },
    man_flower: {
      id:'man_flower', name:'食人花', desc:'会动的红色巨花。',
      hp:55, mp:10, atk:9, def:6, mag:6, res:4, spd:4, level:1, ai:'defensive',
      skills:['strike','heal'],
      drop:{ exp:14, lingshi:5, items:[{id:'spirit_herb',chance:0.5,qty:1}] },
    },
    spirit_fox: {
      id:'spirit_fox', name:'妖狐', desc:'修炼百年的灵狐。',
      hp:50, mp:30, atk:8, def:4, mag:12, res:6, spd:10, level:2, ai:'caster',
      skills:['strike','heal'],
      drop:{ exp:20, lingshi:10, items:[{id:'beast_core',chance:0.4,qty:1}] },
    },
    bat_swarm: {
      id:'bat_swarm', name:'蝙蝠群', desc:'倒悬而栖的血蝙。',
      hp:35, mp:0, atk:7, def:2, mag:0, res:3, spd:13, level:1, ai:'aggressive',
      skills:['strike'],
      statusOnHit:'poison', statusChance:0.3,
      drop:{ exp:15, lingshi:4, items:[{id:'beast_core',chance:0.3,qty:1}] },
    },
    giant_centipede: {
      id:'giant_centipede', name:'巨型蜈蚣', desc:'百足蜿蜒，剧毒。',
      hp:65, mp:0, atk:11, def:8, mag:0, res:5, spd:7, level:2, ai:'aggressive',
      skills:['strike'],
      statusOnHit:'poison', statusChance:0.5,
      drop:{ exp:22, lingshi:7, items:[{id:'beast_core',chance:0.4,qty:1}] },
    },
    mountain_ape: {
      id:'mountain_ape', name:'巨猿', desc:'双拳擂胸的巨猿。',
      hp:90, mp:0, atk:14, def:7, mag:0, res:4, spd:8, level:3, ai:'berserk',
      skills:['strike'],
      drop:{ exp:30, lingshi:10, items:[{id:'beast_core',chance:0.5,qty:1}] },
    },
    black_wind_bandit: {
      id:'black_wind_bandit', name:'黑风盗', desc:'黑巾蒙面的劫匪。',
      hp:70, mp:10, atk:12, def:5, mag:6, res:4, spd:9, level:3, ai:'aggressive',
      skills:['strike','sword_qi'],
      drop:{ exp:30, lingshi:20, items:[{id:'refined_iron',chance:0.5,qty:1}] },
    },
    snake_yao: {
      id:'snake_yao', name:'蛇妖', desc:'已化半形的妖蛇。',
      hp:120, mp:40, atk:16, def:8, mag:14, res:8, spd:10, level:5, ai:'caster',
      skills:['strike','ice_seal','heal'],
      drop:{ exp:55, lingshi:30, items:[{id:'beast_core',chance:0.7,qty:1},{id:'spirit_herb',chance:0.4,qty:2}] },
    },
    iron_golem: {
      id:'iron_golem', name:'玄铁傀儡', desc:'前人遗留的铁人。',
      hp:180, mp:0, atk:20, def:18, mag:0, res:12, spd:5, level:6, ai:'defensive',
      skills:['strike'],
      drop:{ exp:80, lingshi:40, items:[{id:'refined_iron',chance:0.8,qty:2}] },
    },
    wraith: {
      id:'wraith', name:'阴灵', desc:'飘忽不定的幽魂。',
      hp:80, mp:60, atk:12, def:3, mag:18, res:10, spd:13, level:5, ai:'caster',
      skills:['strike','golden_light'],
      statusOnHit:'weak', statusChance:0.4,
      drop:{ exp:60, lingshi:25, items:[{id:'demon_crystal',chance:0.4,qty:1}] },
    },
    ghost_spider: {
      id:'ghost_spider', name:'鬼面蛛', desc:'腹绘鬼面的巨蛛。',
      hp:140, mp:30, atk:18, def:9, mag:10, res:8, spd:9, level:5, ai:'tricky',
      skills:['strike','ice_seal'],
      statusOnHit:'poison', statusChance:0.6,
      drop:{ exp:70, lingshi:30, items:[{id:'beast_core',chance:0.6,qty:1}] },
    },

    // === elite ===
    rogue_cultivator: {
      id:'rogue_cultivator', name:'邪修', desc:'旁门左道的修士。',
      hp:200, mp:80, atk:22, def:12, mag:18, res:12, spd:11, level:8, ai:'caster',
      skills:['strike','sword_qi','ice_seal'],
      drop:{ exp:120, lingshi:60, items:[{id:'demon_crystal',chance:0.5,qty:1}] },
    },
    demon_cultivator: {
      id:'demon_cultivator', name:'魔修', desc:'修习魔功的邪人。',
      hp:260, mp:120, atk:28, def:14, mag:24, res:14, spd:12, level:12, ai:'aggressive',
      skills:['strike','devour','blood_curse'],
      drop:{ exp:200, lingshi:100, items:[{id:'demon_crystal',chance:0.7,qty:1}] },
    },
    black_water_lord: {
      id:'black_water_lord', name:'黑水寨主', desc:'水寨之主，武艺不凡。',
      hp:320, mp:80, atk:30, def:18, mag:14, res:14, spd:11, level:14, ai:'aggressive',
      skills:['strike','sword_qi','golden_light'],
      drop:{ exp:300, lingshi:150, items:[{id:'refined_iron',chance:0.7,qty:2}] },
    },
    beast_chieftain: {
      id:'beast_chieftain', name:'妖兽首领', desc:'群妖之首，凶悍非常。',
      hp:420, mp:60, atk:36, def:22, mag:10, res:16, spd:10, level:16, ai:'berserk',
      skills:['strike','devour'],
      drop:{ exp:400, lingshi:200, items:[{id:'beast_core',chance:0.9,qty:2}] },
    },

    // === BOSSES ===
    mountain_god: {
      id:'mountain_god', name:'山神之灵', desc:'山中千年所化的精怪。',
      hp:380, mp:200, atk:32, def:22, mag:28, res:22, spd:13, level:14, ai:'caster',
      skills:['strike','golden_light','ice_seal','heal'], boss:true,
      drop:{ exp:500, lingshi:300, items:[{id:'immortal_bone',chance:0.3,qty:1},{id:'spirit_herb',chance:0.8,qty:2}] },
    },
    yao_king: {
      id:'yao_king', name:'南荒妖王', desc:'沉睡的远古大妖。',
      hp:880, mp:300, atk:48, def:30, mag:40, res:26, spd:14, level:22, ai:'berserk',
      skills:['strike','devour','blood_curse','sword_qi'], boss:true,
      drop:{ exp:1200, lingshi:800, items:[{id:'demon_soul',chance:0.6,qty:1},{id:'demon_crystal',chance:0.8,qty:2}] },
    },
    sect_master: {
      id:'sect_master', name:'宗主', desc:'一代宗主，剑道大家。',
      hp:720, mp:300, atk:52, def:28, mag:36, res:24, spd:15, level:24, ai:'defensive',
      skills:['strike','sword_flight','sword_qi','golden_light'], boss:true,
      drop:{ exp:1500, lingshi:1000, items:[{id:'jade_slip',chance:0.4,qty:1}] },
    },
    heavenly_trial: {
      id:'heavenly_trial', name:'天劫幻象', desc:'突破时所现的天威。',
      hp:1000, mp:500, atk:60, def:30, mag:50, res:30, spd:18, level:30, ai:'caster',
      skills:['strike','five_thunder','soul_out','thunder'], boss:true, noFlee:true,
      drop:{ exp:2500, lingshi:0, items:[] },
    },
  };

  global.ENEMIES = ENEMIES;
})(window);
