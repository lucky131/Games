/**
 * 装备库
 * 所有可出现的装备配置，包含属性、价格等
 *
 * 数值约定：
 * 1. desc 里不再手写属性加成，属性一律写进 stats，
 *    展示时由 formatDesc 自动拼到 desc 前面（见文件末尾的统一处理）。
 * 2. level / value / price 三者的关系见文件末尾「价格体系」一节，
 *    二级及以上装备的 value 与 price 全部由配方反推，配置里不写。
 */
import { recipes } from './recipes.js'
import { getLevelWeights, SELL_RATE } from './gameConfig.js'

/**
 * stats 字段 → 展示文案
 * 新增属性时只改这里，装备 desc 会自动出现对应行
 */
export const STAT_LABELS = {
  hp: '生命值',
  armor: '护甲',
  mr: '魔抗',
  ah: '技能急速',
  pen: '物穿',
  magicPen: '法穿',
  healPower: '治疗强度',
  mrShred: '降低敌方魔抗',
  ahShred: '降低敌方急速',
  physAmp: '所有物理伤害',
  magicAmp: '所有魔法伤害'
}

/**
 * stats 字段 → 数值后缀，缺省无后缀
 * 例：healPower 的数值以百分数展示，写作「治疗强度+10%」
 */
const STAT_SUFFIX = {
  healPower: '%',
  physAmp: '%',
  magicAmp: '%'
}

/**
 * 把 stats 逐项渲染成一行，拼在 desc 前面
 * 例：{ hp: 50 } + '每2秒造成10物理伤害' → '生命值+50\n每2秒造成10物理伤害'
 * @param {Object} stats 属性对象
 * @param {string} desc 除去属性加成后的其余说明
 * @returns {string} 以 \n 分隔的多行描述
 */
export function formatDesc (stats, desc) {
  const lines = Object.keys(stats || {})
    .filter(key => STAT_LABELS[key] && stats[key])
    .map(key => `${STAT_LABELS[key]}+${stats[key]}${STAT_SUFFIX[key] || ''}`)
  if (desc) lines.push(desc)
  return lines.join('\n')
}

export const itemLibrary = [
  {
    id: 'ruby_crystal',
    name: '红水晶',
    nameEn: 'Ruby Crystal',
    desc: '',
    level: 1,
    type: 'hp',
    price: 3,
    cooldown: 0,
    damageType: 'true',
    stats: {
      hp: 50
    },
    icon: require('./img/level1/Ruby Crystal.png')
  },
  {
    id: 'long_sword',
    name: '长剑',
    nameEn: 'Long Sword',
    desc: `每2秒造成10物理伤害`,
    level: 1,
    type: 'ad',
    price: 3,
    cooldown: 2.0,
    damageType: 'physical',
    stats: {},
    icon: require('./img/level1/Long Sword.png'),
    effect: (ctx, self) => {
      const target = self.owner === 'player' ? ctx.enemy : ctx.player
      ctx.dealDamage(self, target, 10, self.damageType)
    }
  },
  {
    id: 'amplifying_tome',
    name: '增幅典籍',
    nameEn: 'Amplifying Tome',
    desc: `每3秒造成15魔法伤害`,
    level: 1,
    type: 'ap',
    price: 3,
    cooldown: 3.0,
    damageType: 'magic',
    stats: {},
    icon: require('./img/level1/Amplifying Tome.png'),
    effect: (ctx, self) => {
      const target = self.owner === 'player' ? ctx.enemy : ctx.player
      ctx.dealDamage(self, target, 15, self.damageType)
    }
  },
  {
    id: 'cloth_armor',
    name: '布甲',
    nameEn: 'Cloth Armor',
    desc: '',
    level: 1,
    type: 'armor',
    price: 3,
    cooldown: 0,
    damageType: 'physical',
    stats: {
      armor: 15
    },
    icon: require('./img/level1/Cloth Armor.png')
  },
  {
    id: 'null_magic_mantle',
    name: '抗魔斗篷',
    nameEn: 'Null-Magic Mantle',
    desc: '',
    level: 1,
    type: 'mr',
    price: 3,
    cooldown: 0,
    damageType: 'magic',
    stats: {
      mr: 15
    },
    icon: require('./img/level1/Null-Magic Mantle.png')
  },
  {
    id: 'healing_bead',
    name: '治疗宝珠',
    nameEn: 'Rejuvenation Bead',
    desc: `每5秒恢复12生命值`,
    level: 1,
    type: 'hp_regen',
    price: 3,
    cooldown: 5.0,
    damageType: 'true',
    stats: {},
    icon: require('./img/level1/Rejuvenation Bead.png'),
    effect: (ctx, self) => {
      const target = self.owner === 'player' ? ctx.player : ctx.enemy
      ctx.heal(target, 12, self)
    }
  },
  {
    id: 'glowing_mote',
    name: '荧尘',
    nameEn: 'Glowing Mote',
    desc: `每3秒造成5魔法伤害`,
    level: 1,
    type: 'ah',
    price: 3,
    cooldown: 3.0,
    damageType: 'magic',
    stats: {
      ah: 8
    },
    icon: require('./img/level1/Glowing Mote.png'),
    effect: (ctx, self) => {
      const target = self.owner === 'player' ? ctx.enemy : ctx.player
      ctx.dealDamage(self, target, 5, self.damageType)
    }
  },
  {
    id: 'sapphire_crystal',
    name: '蓝水晶',
    nameEn: 'Sapphire Crystal',
    desc: '战斗结束获得1c，战斗胜利额外获得1c',
    level: 1,
    type: 'ah',
    price: 3,
    cooldown: 0,
    damageType: 'true',
    stats: {},
    icon: require('./img/level1/Sapphire Crystal.png'),
    hooks: {
      onBattleEnd: (ctx, self) => {
        // 基础 1c 输了也发；胜利额外 +1c，给「带着它打赢」正反馈
        ctx.addIncome(self.name, ctx.isWin ? 2 : 1)
      }
    }
  }
]

// 商店的等级权重表（LEVEL_WEIGHT_TABLE）与查询函数 getLevelWeights
// 统一在 gameConfig.js 中定义

/**
 * 按权重掷一个等级
 * @param {number[]} weights [1级权重, 2级权重, 3级权重]
 * @returns {number} 1 / 2 / 3
 */
function rollLevel (weights) {
  const total = weights.reduce((sum, w) => sum + w, 0)
  if (total <= 0) return 1
  let random = Math.random() * total
  for (let i = 0; i < weights.length; i++) {
    random -= weights[i]
    if (random < 0) return i + 1 // 权重为 0 的档位永远不会被扣到负数，自然跳过
  }
  return weights.length
}

/**
 * 从一批装备里按权重抽一件
 * @param {Array} pool 候选装备
 * @param {Function} [weightOf] 取权重的函数，缺省全部按 1 参与，等价于等概率
 * @returns {Object} 装备配置对象
 */
function rollWeighted (pool, weightOf = () => 1) {
  const total = pool.reduce((sum, item) => sum + weightOf(item), 0)
  if (total <= 0) return pool[0]
  let random = Math.random() * total
  for (let i = 0; i < pool.length; i++) {
    random -= weightOf(pool[i])
    if (random < 0) return pool[i] // 权重为 0 的装备永远不会被扣到负数，自然跳过
  }
  return pool[pool.length - 1]
}

/**
 * 抽一件装备：先按当前回合的等级权重掷等级，再从该等级池子里抽一件
 *
 * 一级走商店池（shopPool）：**按剩余库存加权**，库存为 0 的进不了候选，库存越多越容易出。
 * 二级 / 三级没有池子，池内等概率。
 *
 * 本函数**只读池子、不改动它**：把「抽取即预留」的扣减交给调用方（merge.vue 的 refreshShop），
 * 保证扣减点全局唯一、不会双扣。shopPool 传 null 时一级退化为池内等概率，
 * 供不关心池子的调用方使用。
 *
 * @param {number} round 当前回合（1-based），决定各等级的出现概率
 * @param {Object} [shopPool] 一级装备池 { itemId: 剩余库存 }，见 itemPool.js
 * @returns {Object} 装备配置对象
 */
export function drawItem (round = 1, shopPool = null) {
  let level = rollLevel(getLevelWeights(round))

  if (level === 1 && shopPool) {
    const candidates = itemLibrary.filter(item => item.level === 1 && shopPool[item.id] > 0)
    if (candidates.length > 0) {
      return rollWeighted(candidates, item => shopPool[item.id])
    }
    // 一级池全空：改出二级，保证商店不出空格子（二级也空时才落到下面的兜底）
    level = 2
  }

  const pool = itemLibrary.filter(item => item.level === level)
  if (pool.length > 0) {
    return rollWeighted(pool)
  }

  // 一级池与二级池同时为空（当前配置下不可达）时兜底回一级，保证商店不会出现空格子
  const fallback = itemLibrary.filter(item => item.level === 1)
  return rollWeighted(fallback)
}

/**
 * 根据 id 获取装备配置
 * @param {string} id
 * @returns {Object|undefined}
 */
export function getItemById (id) {
  return itemLibrary.find(item => item.id === id)
}

// ====================================
// 二级装备（第 6 回合起商店会刷新，也可以由两件一级装备合成）
// 商店刷出来的二级不受一级池约束，池内等概率
// ====================================
const level2Items = [
  {
    id: 'giants_belt',
    name: '巨人腰带',
    nameEn: "Giant's Belt",
    desc: '',
    level: 2,
    type: 'hp',
    cooldown: 0,
    damageType: 'true',
    stats: {
      hp: 120
    },
    icon: require("./img/level2/Giant's Belt.png")
  },
  {
    id: 'crystalline_racer',
    name: '晶体护腕',
    nameEn: "Crystalline Bracer",
    desc: '每5秒恢复15生命值',
    level: 2,
    type: 'hp',
    cooldown: 5.0,
    damageType: 'true',
    stats: {
      hp: 60
    },
    icon: require("./img/level2/Crystalline Bracer.png"),
    effect: (ctx, self) => {
      const target = self.owner === 'player' ? ctx.player : ctx.enemy
      ctx.heal(target, 15, self)
    }
  },
  {
    id: 'kindlegem',
    name: '燃烧宝石',
    nameEn: 'Kindlegem',
    desc: '',
    level: 2,
    type: 'hp',
    cooldown: 0,
    damageType: 'true',
    stats: {
      hp: 80,
      ah: 10
    },
    icon: require('./img/level2/Kindlegem.png')
  },
  {
    id: 'tunneler',
    name: '掘道钻头',
    nameEn: 'Tunneler',
    desc: '每2秒造成14物理伤害',
    level: 2,
    type: 'hp',
    cooldown: 2.0,
    damageType: 'physical',
    stats: {
      hp: 60
    },
    icon: require('./img/level2/Tunneler.png'),
    effect: (ctx, self) => {
      const target = self.owner === 'player' ? ctx.enemy : ctx.player
      ctx.dealDamage(self, target, 14, self.damageType)
    }
  },
  {
    id: 'catalyst_of_aeons',
    name: '万世催化石',
    nameEn: 'Catalyst of Aeons',
    desc: '战斗结束获得1c，战斗胜利额外获得1c',
    level: 2,
    type: 'hp',
    cooldown: 0,
    damageType: 'true',
    stats: {
      hp: 60
    },
    icon: require('./img/level2/Catalyst of Aeons.png'),
    hooks: {
      onBattleEnd: (ctx, self) => {
        ctx.addIncome(self.name, ctx.isWin ? 2 : 1)
      }
    }
  },
  {
    id: 'bramble_vest',
    name: '棘刺背心',
    nameEn: 'Bramble Vest',
    desc: '受到敌人伤害时对敌人造成5魔法伤害',
    level: 2,
    type: 'armor',
    cooldown: 0,
    damageType: 'magic',
    stats: {
      hp: 60,
      armor: 20
    },
    icon: require('./img/level2/Bramble Vest.png'),
    hooks: {
      onDamaged: (ctx, self) => {
        const target = self.owner === 'player' ? ctx.enemy : ctx.player
        ctx.dealDamage(self, target, 5, 'magic')
      }
    }
  },
  {
    id: 'haunting_guise',
    name: '幽魂面具',
    nameEn: 'Haunting Guise',
    desc: '每3秒造成20魔法伤害',
    level: 2,
    type: 'ap',
    cooldown: 3.0,
    damageType: 'magic',
    stats: {
      hp: 70
    },
    icon: require('./img/level2/Haunting Guise.png'),
    effect: (ctx, self) => {
      const target = self.owner === 'player' ? ctx.enemy : ctx.player
      ctx.dealDamage(self, target, 20, self.damageType)
    }
  },
  {
    id: 'serrated_dirk',
    name: '锯齿短匕',
    nameEn: 'Serrated Dirk',
    desc: '每2秒造成20物理伤害',
    level: 2,
    type: 'ad',
    cooldown: 2.0,
    damageType: 'physical',
    stats: {
      pen: 10
    },
    icon: require('./img/level2/Serrated Dirk.png'),
    effect: (ctx, self) => {
      const target = self.owner === 'player' ? ctx.enemy : ctx.player
      ctx.dealDamage(self, target, 20, self.damageType)
    }
  },
  {
    id: 'zeal',
    name: '狂热',
    nameEn: 'Zeal',
    desc: '每2秒造成20物理伤害，并叠加1层；每层使冷却时间减少0.1秒，最多5层',
    level: 2,
    type: 'ad',
    cooldown: 2.0,
    damageType: 'physical',
    stats: {},
    maxStacks: 5,
    icon: require('./img/level2/Zeal.png'),
    effect: (ctx, self) => {
      const target = self.owner === 'player' ? ctx.enemy : ctx.player
      ctx.dealDamage(self, target, 20, self.damageType)
      // 每释放一次叠 1 层，层数降低基础冷却后再按技能急速折算
      self.addStack(1)
      self.recalcCooldown(self.baseCooldown - 0.1 * self.stacks)
    },
    // 满层才点亮高亮边框。不加属性，返回 {} 表示「有加成在生效」
    conditionalStats: (allyChess, self) => (self.stacks >= 5 ? {} : null)
  },
  {
    id: 'recurve_bow',
    name: '反曲之弓',
    nameEn: 'Recurve Bow',
    desc: '每1秒造成10物理伤害与2真实伤害',
    level: 2,
    type: 'ad',
    cooldown: 1.0,
    damageType: 'physical',
    stats: {},
    icon: require('./img/level2/Recurve Bow.png'),
    effect: (ctx, self) => {
      const target = self.owner === 'player' ? ctx.enemy : ctx.player
      ctx.dealDamage(self, target, 10, self.damageType)
      ctx.dealDamage(self, target, 2, 'true')
    }
  },
  {
    id: 'caulfields_warhammer',
    name: '考尔菲德的战锤',
    nameEn: "Caulfield's Warhammer",
    desc: '每2秒造成16物理伤害',
    level: 2,
    type: 'ad',
    cooldown: 2.0,
    damageType: 'physical',
    stats: {
      ah: 10
    },
    icon: require("./img/level2/Caulfield's Warhammer.png"),
    effect: (ctx, self) => {
      const target = self.owner === 'player' ? ctx.enemy : ctx.player
      ctx.dealDamage(self, target, 16, self.damageType)
    }
  },
  {
    id: 'vampiric_scepter',
    name: '吸血鬼节杖',
    nameEn: 'Vampiric Scepter',
    desc: `每2秒造成18物理伤害，20%吸血`,
    level: 2,
    type: 'ad',
    cooldown: 2.0,
    damageType: 'physical',
    stats: {},
    icon: require('./img/level2/Vampiric Scepter.png'),
    effect: (ctx, self) => {
      const target = self.owner === 'player' ? ctx.enemy : ctx.player
      const dmg = ctx.dealDamage(self, target, 18, self.damageType)
      if (dmg > 0) {
        const healTarget = self.owner === 'player' ? ctx.player : ctx.enemy
        ctx.heal(healTarget, Math.floor(dmg * 0.2), self)
      }
    }
  },
  {
    id: 'hextech_alternator',
    name: '海克斯科技发电机',
    nameEn: 'Hextech Alternator',
    desc: '每3秒造成22魔法伤害，对敌人造成伤害时附加2魔法伤害',
    level: 2,
    type: 'ap',
    cooldown: 3.0,
    damageType: 'magic',
    stats: {},
    icon: require('./img/level2/Hextech Alternator.png'),
    effect: (ctx, self) => {
      const target = self.owner === 'player' ? ctx.enemy : ctx.player
      ctx.dealDamage(self, target, 22, self.damageType)
    },
    hooks: {
      // 己方每造成一次伤害就追加 5 魔法伤害
      // 第 5 个参数 isBonus=true 标记这是附加伤害，不会再次触发本钩子，避免无限递归
      onDealDamage: (ctx, self) => {
        const target = self.owner === 'player' ? ctx.enemy : ctx.player
        ctx.dealDamage(self, target, 2, 'magic', true)
      }
    }
  },
  {
    id: 'fiendish_codex',
    name: '恶魔法典',
    nameEn: 'Fiendish Codex',
    desc: '每2秒造成18魔法伤害',
    level: 2,
    type: 'ap',
    cooldown: 2.0,
    damageType: 'magic',
    stats: {
      ah: 10
    },
    icon: require('./img/level2/Fiendish Codex.png'),
    effect: (ctx, self) => {
      const target = self.owner === 'player' ? ctx.enemy : ctx.player
      ctx.dealDamage(self, target, 18, self.damageType)
    }
  },
  {
    id: 'seekers_armguard',
    name: '探索者的护臂',
    nameEn: "Seeker's Armguard",
    desc: '每3秒造成18魔法伤害',
    level: 2,
    type: 'ap',
    cooldown: 3.0,
    damageType: 'magic',
    stats: {
      armor: 20
    },
    icon: require("./img/level2/Seeker's Armguard.png"),
    effect: (ctx, self) => {
      const target = self.owner === 'player' ? ctx.enemy : ctx.player
      ctx.dealDamage(self, target, 18, self.damageType)
    }
  },
  {
    id: 'blighting_jewel',
    name: '枯萎宝珠',
    nameEn: 'Blighting Jewel',
    desc: '每3秒造成30魔法伤害',
    level: 2,
    type: 'ap',
    cooldown: 3.0,
    damageType: 'magic',
    stats: {
      magicPen: 10
    },
    icon: require('./img/level2/Blighting Jewel.png'),
    effect: (ctx, self) => {
      const target = self.owner === 'player' ? ctx.enemy : ctx.player
      ctx.dealDamage(self, target, 30, self.damageType)
    }
  },
  {
    id: 'verdant_barrier',
    name: '翠绿屏障',
    nameEn: 'Verdant Barrier',
    desc: '每3秒造成18魔法伤害并获得5护盾',
    level: 2,
    type: 'ap',
    cooldown: 3.0,
    damageType: 'magic',
    stats: {
      mr: 20
    },
    icon: require('./img/level2/Verdant Barrier.png'),
    effect: (ctx, self) => {
      const target = self.owner === 'player' ? ctx.enemy : ctx.player
      ctx.dealDamage(self, target, 18, self.damageType)
      const shieldTarget = self.owner === 'player' ? ctx.player : ctx.enemy
      ctx.addShield(shieldTarget, 5, self)
    }
  },
  {
    id: 'aegis_of_the_legion',
    name: '军团圣盾',
    nameEn: 'Aegis of the Legion',
    desc: '',
    level: 2,
    type: 'armor',
    cooldown: 0,
    damageType: 'true',
    stats: {
      armor: 20,
      mr: 20
    },
    icon: require('./img/level2/Aegis of the Legion.png')
  },
  {
    id: 'wardens_mail',
    name: '守望者铠甲',
    nameEn: "Warden's Mail",
    desc: '',
    level: 2,
    type: 'armor',
    cooldown: 0,
    damageType: 'true',
    stats: {
      armor: 35
    },
    icon: require("./img/level2/Warden's Mail.png")
  },
  {
    id: 'glacial_buckler',
    name: '冰川圆盾',
    nameEn: 'Glacial Buckler',
    desc: '战斗结束获得1c，战斗胜利额外获得1c',
    level: 2,
    type: 'armor',
    cooldown: 0,
    damageType: 'true',
    stats: {
      armor: 20
    },
    icon: require('./img/level2/Glacial Buckler.png'),
    hooks: {
      onBattleEnd: (ctx, self) => {
        ctx.addIncome(self.name, ctx.isWin ? 2 : 1)
      }
    }
  },
  {
    id: 'negatron_cloak',
    name: '负极斗篷',
    nameEn: 'Negatron Cloak',
    desc: '',
    level: 2,
    type: 'mr',
    cooldown: 0,
    damageType: 'true',
    stats: {
      mr: 35
    },
    icon: require('./img/level2/Negatron Cloak.png')
  },
  {
    id: 'spectres_cowl',
    name: '幽魂斗篷',
    nameEn: "Spectre's Cowl",
    desc: '每3秒恢复9生命值',
    level: 2,
    type: 'mr',
    cooldown: 3.0,
    damageType: 'true',
    stats: {
      mr: 20
    },
    icon: require("./img/level2/Spectre's Cowl.png"),
    effect: (ctx, self) => {
      const target = self.owner === 'player' ? ctx.player : ctx.enemy
      ctx.heal(target, 9, self)
    }
  },
  {
    id: 'forbidden_idol',
    name: '禁忌雕像',
    nameEn: 'Forbidden Idol',
    desc: '战斗结束获得3c，战斗胜利额外获得1c',
    level: 2,
    type: 'ah',
    cooldown: 0,
    damageType: 'true',
    stats: {},
    icon: require('./img/level2/Forbidden Idol.png'),
    hooks: {
      onBattleEnd: (ctx, self) => {
        ctx.addIncome(self.name, ctx.isWin ? 4 : 3)
      }
    }
  },
  {
    id: 'bandleglass_mirror',
    name: '班德尔玻璃镜',
    nameEn: 'Bandleglass Mirror',
    desc: '战斗结束获得1c，战斗胜利额外获得1c',
    level: 2,
    type: 'ah',
    cooldown: 0,
    damageType: 'true',
    stats: {
      ah: 13
    },
    icon: require('./img/level2/Bandleglass Mirror.png'),
    hooks: {
      onBattleEnd: (ctx, self) => {
        ctx.addIncome(self.name, ctx.isWin ? 2 : 1)
      }
    }
  },
]

// ====================================
// 三级装备（通过合成获得，商店不会刷新）
// ====================================
const level3Items = [
  {
    id: 'heartsteel',
    name: '心之钢',
    nameEn: 'Heartsteel',
    desc: '每10秒造成自身10%最大生命值的物理伤害，并获得该伤害10%的最大生命值',
    level: 3,
    type: 'hp',
    cooldown: 10.0,
    damageType: 'physical',
    stats: {
      hp: 350
    },
    // 层数即「心之钢累计提供的最大生命值」，无上限（-1），跨回合保留（keepStacks）
    // ——与无穷饥渴「层数即存储的吸血量」同一套用法。
    // 成长因此挂在棋子实例上而不是角色上：卸下 / 出售 / 放进仓库都会立刻掉上限。
    // 每层只折算 1 点生命值，stacks 本身就是那笔成长，再由 sumStat 按棋盘求和。
    // 不能改写共享的 stats：一份配置被所有实例引用，那会变成「所有心之钢一起涨」
    maxStacks: -1,
    keepStacks: true,
    statsPerStack: {
      hp: 1
    },
    icon: require('./img/level3/Heartsteel.png'),
    effect: (ctx, self) => {
      const selfRole = self.owner === 'player' ? ctx.player : ctx.enemy
      const foe = self.owner === 'player' ? ctx.enemy : ctx.player

      // 先打伤害、再涨上限：gain 取自 dealDamage 的返回值（实际造成的伤害），顺序不能反
      const ownMaxHp = ctx.getMaxHp(selfRole)
      const dmg = ctx.dealDamage(self, foe, Math.floor(ownMaxHp * 0.1), self.damageType)
      const gain = dmg > 0 ? Math.floor(dmg * 0.1) : 0
      if (gain > 0) {
        self.addStack(gain)
        ctx.log(self.owner, `${self.name} 最大生命值上限 +${gain}（当前 ${self.stacks}）`)
      }
    }
  },
  {
    id: 'warmogs_armor',
    name: '狂徒铠甲',
    nameEn: "Warmog's Armor",
    desc: '每3秒恢复20生命值',
    level: 3,
    type: 'hp',
    cooldown: 3.0,
    damageType: 'true',
    stats: {
      hp: 240
    },
    icon: require("./img/level3/Warmog's Armor.png"),
    effect: (ctx, self) => {
      const target = self.owner === 'player' ? ctx.player : ctx.enemy
      ctx.heal(target, 20, self)
    }
  },
  {
    id: 'sunfire_aegis',
    name: '日炎圣盾',
    nameEn: 'Sunfire Aegis',
    desc: '每3秒造成自身3%最大生命值的魔法伤害',
    level: 3,
    type: 'armor',
    cooldown: 3.0,
    damageType: 'magic',
    stats: {
      hp: 200,
      armor: 20,
      ah: 10
    },
    icon: require('./img/level3/Sunfire Aegis.png'),
    effect: (ctx, self) => {
      const selfRole = self.owner === 'player' ? ctx.player : ctx.enemy
      const foe = self.owner === 'player' ? ctx.enemy : ctx.player
      ctx.dealDamage(self, foe, Math.floor(ctx.getMaxHp(selfRole) * 0.03), self.damageType)
    }
  },
  {
    id: 'thornmail',
    name: '荆棘之甲',
    nameEn: 'Thornmail',
    desc: '受到敌人伤害时对敌人造成10魔法伤害',
    level: 3,
    type: 'armor',
    cooldown: 0,
    damageType: 'magic',
    stats: {
      hp: 120,
      armor: 60
    },
    icon: require('./img/level3/Thornmail.png'),
    hooks: {
      onDamaged: (ctx, self) => {
        const target = self.owner === 'player' ? ctx.enemy : ctx.player
        ctx.dealDamage(self, target, 10, 'magic')
      }
    }
  },
  {
    id: 'steraks_gage',
    name: '斯特拉克的挑战护手',
    nameEn: "Sterak's Gage",
    desc: '每2秒造成25物理伤害；生命值首次降到30%以下时，获得20%最大生命值的护盾（每场战斗仅一次）',
    level: 3,
    type: 'hp',
    cooldown: 2.0,
    damageType: 'physical',
    stats: {
      hp: 160
    },
    // 层数 = 本场剩余的触发次数：开局 1，触发后清零，角标随之消失
    maxStacks: 1,
    initStacks: 1,
    icon: require("./img/level3/Sterak's Gage.png"),
    effect: (ctx, self) => {
      const target = self.owner === 'player' ? ctx.enemy : ctx.player
      ctx.dealDamage(self, target, 25, self.damageType)
    },
    hooks: {
      onDamaged: (ctx, self) => {
        if (self.stacks <= 0) return // 本场已触发过
        const selfRole = self.owner === 'player' ? ctx.player : ctx.enemy
        const maxHp = ctx.getMaxHp(selfRole)
        if (selfRole.hp >= maxHp * 0.3) return // 还没跌破 30%
        self.addStack(-1)
        ctx.addShield(selfRole, Math.floor(maxHp * 0.2), self)
      }
    }
  },
  {
    id: 'spirit_visage',
    name: '振奋盔甲',
    nameEn: 'Spirit Visage',
    desc: '每3秒恢复10生命值',
    level: 3,
    type: 'mr',
    cooldown: 3.0,
    damageType: 'true',
    stats: {
      hp: 140,
      mr: 20,
      ah: 10,
      healPower: 25
    },
    icon: require('./img/level3/Spirit Visage.png'),
    effect: (ctx, self) => {
      const target = self.owner === 'player' ? ctx.player : ctx.enemy
      ctx.heal(target, 10, self)
    }
  },
  {
    id: 'winters_approach',
    name: '凛冬之临',
    nameEn: "Winter's Approach",
    desc: '对敌人造成伤害后获得5护盾',
    level: 3,
    type: 'hp',
    cooldown: 0,
    damageType: 'true',
    stats: {
      hp: 200,
      ah: 15
    },
    icon: require("./img/level3/Winter's Approach.png"),
    hooks: {
      // 己方每造成一次伤害事件就获得 5 护盾（与海克斯科技发电机同一触发点）
      onDealDamage: (ctx, self) => {
        const selfRole = self.owner === 'player' ? ctx.player : ctx.enemy
        ctx.addShield(selfRole, 5, self)
      }
    }
  },
  {
    id: 'randuins_omen',
    name: '兰顿之兆',
    nameEn: "Randuin's Omen",
    desc: '',
    level: 3,
    type: 'armor',
    cooldown: 0,
    damageType: 'true',
    stats: {
      hp: 120,
      armor: 55
    },
    icon: require("./img/level3/Randuin's Omen.png")
  },
  {
    id: 'rylais_crystal_scepter',
    name: '瑞莱的冰晶节杖',
    nameEn: "Rylai's Crystal Scepter",
    desc: '每3秒造成35魔法伤害，并使敌方所有装备的剩余冷却延长0.1秒',
    level: 3,
    type: 'ap',
    cooldown: 3.0,
    damageType: 'magic',
    stats: {
      hp: 130
    },
    icon: require("./img/level3/Rylai's Crystal Scepter.png"),
    effect: (ctx, self) => {
      const foe = self.owner === 'player' ? ctx.enemy : ctx.player
      ctx.dealDamage(self, foe, 35, self.damageType)
      // 只推当前这一轮的读秒，不改对方总冷却
      ctx.delayCooldown(foe, 0.1)
    }
  },
  {
    id: 'hullbreaker',
    name: '破舰者',
    nameEn: 'Hullbreaker',
    desc: '每2秒造成22物理伤害；己方装备栏中没有一二级装备时，额外获得22生命值、22护甲、22魔抗、12技能急速',
    level: 3,
    type: 'hp',
    cooldown: 2.0,
    damageType: 'physical',
    stats: {
      hp: 122
    },
    icon: require('./img/level3/Hullbreaker.png'),
    effect: (ctx, self) => {
      const target = self.owner === 'player' ? ctx.enemy : ctx.player
      ctx.dealDamage(self, target, 22, self.damageType)
    },
    // 条件加成：己方装备栏里只要还有一/二级装备，加成就整份失效（空槽位不算）
    conditionalStats: (allyChess) => {
      const hasLowLevel = allyChess.some(c => c && c.level < 3)
      return hasLowLevel ? null : { hp: 22, armor: 22, mr: 22, ah: 12 }
    }
  },
  {
    id: 'titanic_hydra',
    name: '巨型九头蛇',
    nameEn: 'Titanic Hydra',
    desc: '每2秒造成25+自身2%最大生命值的物理伤害',
    level: 3,
    type: 'hp',
    cooldown: 2.0,
    damageType: 'physical',
    stats: {
      hp: 200
    },
    icon: require('./img/level3/Titanic Hydra.png'),
    effect: (ctx, self) => {
      const selfRole = self.owner === 'player' ? ctx.player : ctx.enemy
      const foe = self.owner === 'player' ? ctx.enemy : ctx.player
      // 一次性结算：固定 20 与「自身」当前最大生命值（含装备与成长）的 4% 相加后整体过减伤
      ctx.dealDamage(self, foe, 25 + Math.floor(ctx.getMaxHp(selfRole) * 0.02), self.damageType)
    }
  },
  {
    id: 'jaksho_the_protean',
    name: '千变者贾修',
    nameEn: "Jak'Sho, The Protean",
    desc: '每5秒获得1层叠层，每层+5护甲、+5魔抗，最多5层',
    level: 3,
    type: 'armor',
    cooldown: 5.0,
    damageType: 'true',
    stats: {
      hp: 120,
      armor: 35,
      mr: 35
    },
    // 层数只在本场战斗内累积：战斗结束 resetStacks 归零，护甲魔抗随之回落到基础值
    maxStacks: 5,
    statsPerStack: {
      armor: 5,
      mr: 5
    },
    icon: require("./img/level3/Jak'Sho, The Protean.png"),
    effect: (ctx, self) => {
      self.addStack(1) // 到达 maxStacks 后由 addStack 自动封顶
    },
    // 满层才点亮高亮边框。不加属性，返回 {} 表示「有加成在生效」
    conditionalStats: (allyChess, self) => (self.stacks >= 5 ? {} : null)
  },
  {
    id: 'kaenic_rookern',
    name: '败魔',
    nameEn: 'Kaenic Rookern',
    desc: '每10秒恢复35生命值，并获得等同于自身魔抗的护盾',
    level: 3,
    type: 'mr',
    cooldown: 10.0,
    damageType: 'true',
    stats: {
      hp: 60,
      mr: 60
    },
    icon: require('./img/level3/Kaenic Rookern.png'),
    effect: (ctx, self) => {
      const selfRole = self.owner === 'player' ? ctx.player : ctx.enemy
      ctx.heal(selfRole, 35, self)
      // 盾量取整：魔抗都是整数，floor 只是防止将来出现小数加成
      ctx.addShield(selfRole, Math.floor(ctx.getMr(selfRole)), self)
    }
  },
  {
    id: 'locket_of_the_iron_solari',
    name: '钢铁烈阳之匣',
    nameEn: 'Locket of the Iron Solari',
    desc: '战斗开始时获得100护盾',
    level: 3,
    type: 'armor',
    cooldown: 0,
    damageType: 'true',
    stats: {
      hp: 80,
      armor: 25,
      mr: 25,
      ah: 10
    },
    icon: require('./img/level3/Locket of the Iron Solari.png'),
    hooks: {
      onBattleStart: (ctx, self) => {
        const selfRole = self.owner === 'player' ? ctx.player : ctx.enemy
        ctx.addShield(selfRole, 100, self)
      }
    }
  },
  {
    id: 'abyssal_mask',
    name: '深渊面具',
    nameEn: 'Abyssal Mask',
    desc: '',
    level: 3,
    type: 'mr',
    cooldown: 0,
    damageType: 'true',
    stats: {
      hp: 90,
      mr: 40,
      ah: 10,
      // 只减「对方」的魔抗：聚合时按阵营相减，见 merge.vue 的 playerMr / enemyMr
      mrShred: 15
    },
    icon: require('./img/level3/Abyssal Mask.png')
  },
  {
    id: 'liandrys_torment',
    name: '兰德里的折磨',
    nameEn: "Liandry's Torment",
    desc: '每3秒造成30+敌方1.5%最大生命值的魔法伤害',
    level: 3,
    type: 'ap',
    cooldown: 3.0,
    damageType: 'magic',
    stats: {
      hp: 100
    },
    icon: require("./img/level3/Liandry's Torment.png"),
    effect: (ctx, self) => {
      const foe = self.owner === 'player' ? ctx.enemy : ctx.player
      // 一次性结算：固定 45 与「敌方」当前最大生命值的 3% 相加后整体过减伤
      ctx.dealDamage(self, foe, 30 + Math.floor(ctx.getMaxHp(foe) * 0.015), self.damageType)
    }
  },
  {
    id: 'riftmaker',
    name: '裂隙制造者',
    nameEn: 'Riftmaker',
    desc: '每3秒造成35+3×层数的魔法伤害并获得1层，最多5层；满层后获得20%吸血',
    level: 3,
    type: 'ap',
    cooldown: 3.0,
    damageType: 'magic',
    stats: {
      hp: 100,
      ah: 10
    },
    maxStacks: 5,
    icon: require('./img/level3/Riftmaker.png'),
    effect: (ctx, self) => {
      const selfRole = self.owner === 'player' ? ctx.player : ctx.enemy
      const foe = self.owner === 'player' ? ctx.enemy : ctx.player

      // 伤害按「叠层前」的层数算，与描述里的先后顺序一致
      const damage = ctx.dealDamage(self, foe, 35 + 3 * self.stacks, self.damageType)
      // 满层判定放在叠层之前：第 5 次触发只是叠满，这一击仍不吸血，第 6 次起才有
      const wasFull = self.stacks >= 5
      self.addStack(1) // 到达 maxStacks 后由 addStack 自动封顶

      // 回血按本次实际造成的伤害折算（用 dealDamage 的返回值，而非面板值）
      if (wasFull) {
        ctx.heal(selfRole, Math.floor(damage * 0.2), self)
      }
    },
    // 满层才点亮高亮边框。不加属性，返回 {} 表示「有加成在生效」
    conditionalStats: (allyChess, self) => (self.stacks >= 5 ? {} : null)
  },
  {
    id: 'dusk_and_dawn',
    name: '黄昏与黎明',
    nameEn: 'Dusk and Dawn',
    desc: '每2秒造成20物理伤害、10魔法伤害与5真实伤害',
    level: 3,
    type: 'ad',
    cooldown: 2.0,
    damageType: 'physical',
    stats: {
      hp: 80,
      ah: 10
    },
    icon: require('./img/level3/Dusk and Dawn.png'),
    effect: (ctx, self) => {
      const target = self.owner === 'player' ? ctx.enemy : ctx.player
      // 三种伤害各自独立结算、各自过对应的减伤（真实伤害不减）
      ctx.dealDamage(self, target, 20, 'physical')
      ctx.dealDamage(self, target, 10, 'magic')
      ctx.dealDamage(self, target, 5, 'true')
    }
  },
  {
    id: 'zekes_convergence',
    name: '基克的聚合',
    nameEn: "Zeke's Convergence",
    desc: '战斗超时后每秒造成5魔法伤害',
    level: 3,
    type: 'armor',
    cooldown: 0,
    damageType: 'magic',
    stats: {
      hp: 100,
      armor: 20,
      mr: 20,
      ah: 10
    },
    icon: require("./img/level3/Zeke's Convergence.png"),
    // 超时后被动才真的在跑，让边框亮起来提示玩家
    glowOnOvertime: true,
    hooks: {
      // 超时每跨过一个整秒广播一次，与超时系统伤害同频
      onOvertimeTick: (ctx, self) => {
        const target = self.owner === 'player' ? ctx.enemy : ctx.player
        ctx.dealDamage(self, target, 5, 'magic')
      }
    }
  },
  {
    id: 'black_cleaver',
    name: '黑色切割者',
    nameEn: 'Black Cleaver',
    desc: '每2秒造成25物理伤害并获得1层；每层获得3物穿，最多5层',
    level: 3,
    type: 'hp',
    cooldown: 2.0,
    damageType: 'physical',
    stats: {
      hp: 160,
      ah: 10
    },
    // 层数只在本场战斗内累积：战斗结束 resetStacks 归零，物穿随之回落
    maxStacks: 5,
    statsPerStack: {
      pen: 3
    },
    icon: require('./img/level3/Black Cleaver.png'),
    effect: (ctx, self) => {
      const target = self.owner === 'player' ? ctx.enemy : ctx.player
      ctx.dealDamage(self, target, 25, self.damageType)
      self.addStack(1) // 到达 maxStacks 后由 addStack 自动封顶
    },
    // 满层才点亮高亮边框。不加属性，返回 {} 表示「有加成在生效」
    conditionalStats: (allyChess, self) => (self.stacks >= 5 ? {} : null)
  },
  {
    id: 'trinity_force',
    name: '三相之力',
    nameEn: 'Trinity Force',
    desc: '每5秒造成43物理伤害2次并获得1层；每层使冷却时间减少0.3秒，最多3层',
    level: 3,
    type: 'ad',
    cooldown: 5.0,
    damageType: 'physical',
    stats: {
      hp: 100,
      ah: 10
    },
    maxStacks: 3,
    icon: require('./img/level3/Trinity Force.png'),
    effect: (ctx, self) => {
      const target = self.owner === 'player' ? ctx.enemy : ctx.player
      // 两次独立结算：各自过减伤，也各自触发「造成伤害」类钩子
      ctx.dealDamage(self, target, 43, self.damageType)
      ctx.dealDamage(self, target, 43, self.damageType)
      // 每释放一次叠 1 层，层数降低基础冷却后再按技能急速折算
      self.addStack(1)
      self.recalcCooldown(self.baseCooldown - 0.3 * self.stacks)
    },
    // 满层才点亮高亮边框。不加属性，返回 {} 表示「有加成在生效」
    conditionalStats: (allyChess, self) => (self.stacks >= 3 ? {} : null)
  },
  {
    id: 'edge_of_night',
    name: '夜之锋刃',
    nameEn: 'Edge of Night',
    desc: '每3秒造成40物理伤害，己方获得15护盾，敌方获得1护盾',
    level: 3,
    type: 'ad',
    cooldown: 3.0,
    damageType: 'physical',
    stats: {
      hp: 80,
      pen: 15
    },
    icon: require('./img/level3/Edge of Night.png'),
    effect: (ctx, self) => {
      const selfRole = self.owner === 'player' ? ctx.player : ctx.enemy
      const foe = self.owner === 'player' ? ctx.enemy : ctx.player
      ctx.dealDamage(self, foe, 40, self.damageType)
      // 给敌方挂 1 点护盾是刻意为之：后续会有「对有护盾的敌人造成额外伤害」的装备与它配合
      ctx.addShield(selfRole, 15, self)
      ctx.addShield(foe, 1, self)
    }
  },
  {
    id: 'bloodletters_curse',
    name: '放血者的诅咒',
    nameEn: "Bloodletter's Curse",
    desc: '每3秒造成45魔法伤害并获得1层；每层获得3法穿，最多5层',
    level: 3,
    type: 'ap',
    cooldown: 3.0,
    damageType: 'magic',
    stats: {
      hp: 100,
      ah: 10
    },
    // 层数只在本场战斗内累积：战斗结束 resetStacks 归零，法穿随之回落
    maxStacks: 5,
    statsPerStack: {
      magicPen: 3
    },
    icon: require("./img/level3/Bloodletter's Curse.png"),
    effect: (ctx, self) => {
      const target = self.owner === 'player' ? ctx.enemy : ctx.player
      ctx.dealDamage(self, target, 45, self.damageType)
      self.addStack(1) // 到达 maxStacks 后由 addStack 自动封顶
    },
    // 满层才点亮高亮边框。不加属性，返回 {} 表示「有加成在生效」
    conditionalStats: (allyChess, self) => (self.stacks >= 5 ? {} : null)
  },
  {
    id: 'rod_of_ages',
    name: '时光之杖',
    nameEn: 'Rod of Ages',
    desc: '每回合结束后随机获得一件一级装备，并获得1层；每层额外获得20生命值，最多3层；满层时额外获得10技能急速',
    level: 3,
    type: 'hp',
    cooldown: 0,
    damageType: 'true',
    stats: {
      hp: 200
    },
    // 唯一的跨回合叠层装备：keepStacks 让层数在整局内持续累积，
    // 每回合结束时由 onBattleEnd 叠 1 层，不随战斗结束清零
    maxStacks: 3,
    statsPerStack: {
      hp: 20
    },
    keepStacks: true,
    icon: require('./img/level3/Rod of Ages.png'),
    hooks: {
      onBattleEnd: (ctx, self) => {
        // 层数封顶后不再涨，但每回合的免费装备照发
        self.addStack(1)
        ctx.grantRandomLevel1Item(self.name)
      }
    },
    // 满层才点亮高亮边框，同时给满层那 10 点技能急速
    conditionalStats: (allyChess, self) => (self.stacks >= 3 ? { ah: 10 } : null)
  },
  {
    id: 'fiendhunter_bolts',
    name: '猎魔人弩箭',
    nameEn: 'Fiendhunter Bolts',
    desc: '每2秒造成45物理伤害；战斗超时后获得30技能急速',
    level: 3,
    type: 'ad',
    cooldown: 2.0,
    damageType: 'physical',
    stats: {},
    icon: require('./img/level3/Fiendhunter Bolts.png'),
    effect: (ctx, self) => {
      const target = self.owner === 'player' ? ctx.enemy : ctx.player
      ctx.dealDamage(self, target, 45, self.damageType)
    },
    // 超时后才有加成：overtime 由 merge.vue 的超时系统置位并触发一次冷却重算，
    // 返回非 null 也顺带点亮图标边框，提示「此刻被动在生效」
    conditionalStats: (allyChess, self) => (self.overtime ? { ah: 30 } : null)
  },
  {
    id: 'endless_hunger',
    name: '无穷饥渴',
    nameEn: 'Endless Hunger',
    desc: '每2秒造成30物理伤害，20%吸血；战斗胜利后获得1层，每层额外提供5%吸血，无上限',
    level: 3,
    type: 'ad',
    cooldown: 2.0,
    damageType: 'physical',
    stats: {
      ah: 10
    },
    // 层数跨回合累积（keepStacks），且无上限（maxStacks 为 -1）：
    // 每胜利一场由 onBattleEnd 叠 1 层，失败不叠
    maxStacks: -1,
    keepStacks: true,
    icon: require('./img/level3/Endless Hunger.png'),
    effect: (ctx, self) => {
      const selfRole = self.owner === 'player' ? ctx.player : ctx.enemy
      const foe = self.owner === 'player' ? ctx.enemy : ctx.player
      const dmg = ctx.dealDamage(self, foe, 30, self.damageType)
      // 吸血按本次实际造成的伤害折算；吸血率 = 20% + 5% × 层数，层数无上限所以不封顶
      if (dmg > 0) {
        ctx.heal(selfRole, Math.floor(dmg * (0.2 + 0.05 * self.stacks)), self)
      }
    },
    hooks: {
      onBattleEnd: (ctx, self) => {
        // 只有胜利才叠层：isWin 由 merge.vue 的 buildIncomeBreakdown 一并广播
        if (!ctx.isWin) return
        self.addStack(1)
      }
    }
  },
  {
    id: 'guardian_angel',
    name: '守护天使',
    nameEn: 'Guardian Angel',
    desc: '每2秒造成15物理伤害；出售该装备后获得1颗心',
    level: 3,
    type: 'armor',
    cooldown: 2.0,
    damageType: 'physical',
    stats: {
      hp: 80,
      armor: 20,
      mr: 20
    },
    icon: require('./img/level3/Guardian Angel.png'),
    effect: (ctx, self) => {
      const target = self.owner === 'player' ? ctx.enemy : ctx.player
      ctx.dealDamage(self, target, 15, self.damageType)
    },
    hooks: {
      // 全场唯一在「商店阶段」生效的钩子：由 merge.vue 的 sellChess 广播
      onSell: (ctx) => {
        ctx.addLife(1)
      }
    }
  },
  {
    id: 'infinity_edge',
    name: '无尽之刃',
    nameEn: 'Infinity Edge',
    desc: '每2秒造成60物理伤害',
    level: 3,
    type: 'ad',
    cooldown: 2.0,
    damageType: 'physical',
    stats: {
      pen: 10,
      // 物理伤害倍率：+20 表示己方所有物理伤害 ×1.2，在敌方抗性减伤之前结算
      physAmp: 20
    },
    icon: require('./img/level3/Infinity Edge.png'),
    effect: (ctx, self) => {
      const target = self.owner === 'player' ? ctx.enemy : ctx.player
      ctx.dealDamage(self, target, 60, self.damageType)
    }
  },
  {
    id: 'lord_dominiks_regards',
    name: '多米尼克领主的致意',
    nameEn: "Lord Dominik's Regards",
    desc: '每2秒造成10+敌方3%最大生命值的物理伤害',
    level: 3,
    type: 'ad',
    cooldown: 2.0,
    damageType: 'physical',
    stats: {
      pen: 15
    },
    icon: require("./img/level3/Lord Dominik's Regards.png"),
    effect: (ctx, self) => {
      const foe = self.owner === 'player' ? ctx.enemy : ctx.player
      // 一次性结算：固定 10 与「敌方」当前最大生命值的 3% 相加后整体过减伤，与兰德里的折磨同一套写法
      ctx.dealDamage(self, foe, 10 + Math.floor(ctx.getMaxHp(foe) * 0.03), self.damageType)
    }
  },
  {
    id: 'bloodthirster',
    name: '饮血剑',
    nameEn: 'Bloodthirster',
    desc: '每3秒造成50物理伤害，30%吸血',
    level: 3,
    type: 'ad',
    cooldown: 3.0,
    damageType: 'physical',
    stats: {},
    icon: require('./img/level3/Bloodthirster.png'),
    effect: (ctx, self) => {
      const selfRole = self.owner === 'player' ? ctx.player : ctx.enemy
      const foe = self.owner === 'player' ? ctx.enemy : ctx.player
      const dmg = ctx.dealDamage(self, foe, 50, self.damageType)
      // 回血按本次实际造成的伤害折算（含被护盾吸收的部分），与无穷饥渴同一套算法
      if (dmg > 0) {
        ctx.heal(selfRole, Math.floor(dmg * 0.3), self)
      }
    }
  },
  {
    id: 'wits_end',
    name: '智慧末刃',
    nameEn: "Wit's End",
    desc: '每2秒造成20物理伤害与10魔法伤害',
    level: 3,
    type: 'mr',
    cooldown: 2.0,
    damageType: 'physical',
    stats: {
      mr: 40,
      ah: 10
    },
    icon: require("./img/level3/Wit's End.png"),
    effect: (ctx, self) => {
      const target = self.owner === 'player' ? ctx.enemy : ctx.player
      // 两种伤害各自独立结算、各自过对应的减伤
      ctx.dealDamage(self, target, 20, 'physical')
      ctx.dealDamage(self, target, 10, 'magic')
    }
  },
  {
    id: 'guinsoos_rageblade',
    name: '鬼索的狂暴之刃',
    nameEn: "Guinsoo's Rageblade",
    desc: '每2秒造成25物理伤害与10魔法伤害并获得1层，最多6层；满层后每次攻击额外造成一次魔法伤害',
    level: 3,
    type: 'ad',
    cooldown: 2.0,
    damageType: 'physical',
    stats: {},
    maxStacks: 6,
    icon: require("./img/level3/Guinsoo's Rageblade.png"),
    effect: (ctx, self) => {
      const target = self.owner === 'player' ? ctx.enemy : ctx.player
      ctx.dealDamage(self, target, 25, 'physical')
      ctx.dealDamage(self, target, 10, 'magic')
      // 满层判定放在叠层之前：第 6 次触发只是叠满，这一击还不算「满层后」，与裂隙制造者同一时序
      const wasFull = self.stacks >= 6
      self.addStack(1) // 到达 maxStacks 后由 addStack 自动封顶
      if (wasFull) {
        ctx.dealDamage(self, target, 10, 'magic')
      }
    },
    // 满层才点亮高亮边框。不加属性，返回 {} 表示「有加成在生效」
    conditionalStats: (allyChess, self) => (self.stacks >= 6 ? {} : null)
  },
  {
    id: 'hextech_gunblade',
    name: '海克斯科技枪刃',
    nameEn: 'Hextech Gunblade',
    desc: '每2秒造成35伤害，20%吸血；伤害类型在物理与魔法之间交替切换',
    level: 3,
    type: 'ad',
    cooldown: 2.0,
    damageType: 'physical',
    stats: {},
    icon: require('./img/level3/Hextech Gunblade.png'),
    effect: (ctx, self) => {
      const selfRole = self.owner === 'player' ? ctx.player : ctx.enemy
      const foe = self.owner === 'player' ? ctx.enemy : ctx.player

      // 交替计数只能挂在实例上：Chess 构造函数逐个白名单搬运 config 字段，
      // 自定义键不会被带过来，所以在首次触发时懒初始化（JS 对象可扩展，运行时加属性没问题）
      self.gunbladeTick = (self.gunbladeTick || 0) + 1
      // 奇数枪物理、偶数枪魔法
      const type = self.gunbladeTick % 2 === 1 ? 'physical' : 'magic'

      const dmg = ctx.dealDamage(self, foe, 35, type)
      // 回血按本次实际造成的伤害折算，与饮血剑同一套算法
      if (dmg > 0) {
        ctx.heal(selfRole, Math.floor(dmg * 0.2), self)
      }
    },
    hooks: {
      // 每场战斗从物理枪开始，免得上一场剩余的奇偶性让开局类型看运气
      onBattleStart: (ctx, self) => {
        self.gunbladeTick = 0
      }
    }
  },
  {
    id: 'blade_of_the_ruined_king',
    name: '破败王者之刃',
    nameEn: 'Blade of the Ruined King',
    desc: '每2秒造成35物理伤害；每3次攻击额外造成敌方当前生命值8%的物理伤害，该次伤害附带25%吸血',
    level: 3,
    type: 'ad',
    cooldown: 2.0,
    damageType: 'physical',
    stats: {},
    // 层数 = 本场已经打出的攻击次数，1 → 2 → 触发后归零。角标最多显示到 2
    maxStacks: 3,
    icon: require('./img/level3/Blade of the Ruined King.png'),
    effect: (ctx, self) => {
      const selfRole = self.owner === 'player' ? ctx.player : ctx.enemy
      const foe = self.owner === 'player' ? ctx.enemy : ctx.player

      // 基础伤害不吸血，吸血只挂在每 3 次的那一发上
      ctx.dealDamage(self, foe, 35, self.damageType)

      self.addStack(1)
      if (self.stacks < 3) return
      self.stacks = 0 // 触发后重新计数

      // 「当前生命值」取的是基础 40 打完之后的剩余血量，且必须在 dealDamage 之前算好
      // ——dealDamage 会就地扣血，放到后面读就拿不到这一发的真实基数了。
      // 基础伤害已经把敌人打死（或血量太低）时基数为 0，直接跳过，免得刷一条「造成 0 点伤害」
      const extraAmount = Math.floor(foe.hp * 0.08)
      if (extraAmount <= 0) return
      const extra = ctx.dealDamage(self, foe, extraAmount, self.damageType)
      // 回血按这一发额外伤害实际打出的值折算，与饮血剑同一套算法
      if (extra > 0) {
        ctx.heal(selfRole, Math.floor(extra * 0.25), self)
      }
    }
  },
  {
    id: 'terminus',
    name: '界弓',
    nameEn: 'Terminus',
    desc: '每2秒造成35伤害；伤害类型取敌方较低的一项抗性，并获得10点对应穿透（护甲与魔抗相等时取物理）',
    level: 3,
    type: 'ad',
    cooldown: 2.0,
    // 默认物理形态；每场战斗开始时由 onBattleStart 按敌方抗性改写
    damageType: 'physical',
    stats: {},
    // 穿透是恒给的（形态决定给物穿还是法穿），没有「条件生效 / 不生效」之分，
    // 所以显式豁免高亮边框，否则这颗棋子从开战亮到结束
    noGlow: true,
    icon: require('./img/level3/Terminus.png'),
    effect: (ctx, self) => {
      const foe = self.owner === 'player' ? ctx.enemy : ctx.player
      // 形态由 onBattleStart 定好，这里直接按定好的类型打
      ctx.dealDamage(self, foe, 35, self.damageType)
    },
    hooks: {
      // 战斗开始时比一次敌方护甲与魔抗，谁低选谁，相等取物理（<= 把相等并入物理分支）
      //
      // 必须改写构造函数里声明过的 damageType，不能新挂一个 self.xxx 字段：
      // Vue 2 只在实例被 observe 时把「已存在」的属性转成响应式，运行时新加的键不是。
      // 那样 conditionalStats 读到变化也不会让 playerPen / playerMagicPen 失效，
      // 结果就是伤害按魔法结算、穿透却停在物穿，面板和实际两套数。
      // damageType 在构造函数里就存在，赋值能正常触发依赖更新。
      //
      // 不会自激：界弓只在 pen / magicPen 之间搬数值，而敌方护甲与魔抗的聚合
      // 既不读 pen 也不读 magicPen，所以改写形态不会反过来改变下一次的比较结果。
      onBattleStart: (ctx, self) => {
        const foe = self.owner === 'player' ? ctx.enemy : ctx.player
        self.damageType = ctx.getArmor(foe) <= ctx.getMr(foe) ? 'physical' : 'magic'
      }
    },
    // 穿透跟随形态：物理形态给物穿，魔法形态给法穿。
    // 这里只读 damageType（构造函数声明过的响应式字段），不碰任何 computed——
    // 一旦在这里读 this.enemyArmor，敌我双方都有界弓时会走成
    //   playerPen → enemyArmor → enemyPen → playerArmor → playerPen …
    // 的环，Vue computed 重入求值直接爆栈
    conditionalStats: (allyChess, self) => (
      self.damageType === 'magic' ? { magicPen: 10 } : { pen: 10 }
    )
  },
  {
    id: 'essence_reaver',
    name: '夺萃之镰',
    nameEn: 'Essence Reaver',
    desc: '每2秒造成20物理伤害与等同于自身金币数的真实伤害；战斗结束获得2c',
    level: 3,
    type: 'ad',
    cooldown: 2.0,
    damageType: 'physical',
    stats: {
      ah: 10
    },
    icon: require('./img/level3/Essence Reaver.png'),
    effect: (ctx, self) => {
      const selfRole = self.owner === 'player' ? ctx.player : ctx.enemy
      const foe = self.owner === 'player' ? ctx.enemy : ctx.player
      ctx.dealDamage(self, foe, 20, self.damageType)
      // 金币数按结算这一刻的持有量算，不另外找地方存快照。
      // 敌方没有金币，getMoney 返回 0，直接跳过那一发，免得刷一条「造成 0 点真实伤害」
      const goldDamage = ctx.getMoney(selfRole)
      if (goldDamage > 0) {
        ctx.dealDamage(self, foe, goldDamage, 'true')
      }
    },
    hooks: {
      onBattleEnd: (ctx, self) => {
        ctx.addIncome(self.name, 2)
      }
    }
  },
  {
    id: 'navori_flickerblade',
    name: '纳沃利烁刃',
    nameEn: 'Navori Flickerblade',
    desc: '每2秒造成30物理伤害，并使己方其他装备的剩余冷却加快0.1秒',
    level: 3,
    type: 'ad',
    cooldown: 2.0,
    damageType: 'physical',
    stats: {},
    icon: require('./img/level3/Navori Flickerblade.png'),
    effect: (ctx, self) => {
      const selfRole = self.owner === 'player' ? ctx.player : ctx.enemy
      const foe = self.owner === 'player' ? ctx.enemy : ctx.player
      ctx.dealDamage(self, foe, 30, self.damageType)
      // 与瑞莱的冰晶节杖对敌「延迟冷却」对称：只加快己方其他装备这一轮的读秒，不含自身
      ctx.hastenCooldown(selfRole, 0.1, self)
    }
  },
  {
    id: 'the_collector',
    name: '收集者',
    nameEn: 'The Collector',
    desc: '每2秒造成35物理伤害；该次伤害后若敌方生命值低于5%，立刻斩杀',
    level: 3,
    type: 'ad',
    cooldown: 2.0,
    damageType: 'physical',
    stats: {
      pen: 15
    },
    icon: require('./img/level3/The Collector.png'),
    effect: (ctx, self) => {
      const foe = self.owner === 'player' ? ctx.enemy : ctx.player
      ctx.dealDamage(self, foe, 35, self.damageType)
      // 斩杀线在这一发伤害结算「之后」才判，不走额外的处决流程。
      // 已经被这一发打死的（hp 归 0）直接跳过，免得在对尸体上刷一条 9999 的日志
      if (foe.hp <= 0) return
      if (foe.hp < ctx.getMaxHp(foe) * 0.05) {
        ctx.dealDamage(self, foe, 9999, 'true')
      }
    }
  },
  {
    id: 'seryldas_grudge',
    name: '赛瑞尔达的怨恨',
    nameEn: "Serylda's Grudge",
    desc: '每3秒造成50物理伤害，并使敌方所有装备的剩余冷却延长0.1秒',
    level: 3,
    type: 'ad',
    cooldown: 3.0,
    damageType: 'physical',
    stats: {
      pen: 10,
      ah: 10
    },
    icon: require("./img/level3/Serylda's Grudge.png"),
    effect: (ctx, self) => {
      const foe = self.owner === 'player' ? ctx.enemy : ctx.player
      ctx.dealDamage(self, foe, 50, self.damageType)
      // 与瑞莱的冰晶节杖完全同一套：只推当前这一轮的读秒，不改对方总冷却
      ctx.delayCooldown(foe, 0.1)
    }
  },
  {
    id: 'serpents_fang',
    name: '巨蛇之牙',
    nameEn: "Serpent's Fang",
    desc: '每2秒造成35物理伤害；若敌方有护盾，该次伤害提高至60',
    level: 3,
    type: 'ad',
    cooldown: 2.0,
    damageType: 'physical',
    stats: {
      pen: 10
    },
    icon: require("./img/level3/Serpent's Fang.png"),
    effect: (ctx, self) => {
      const foe = self.owner === 'player' ? ctx.enemy : ctx.player
      // 增幅判定卡在攻击之前：这一发打完才涨起来的盾（如败魔）不参与本次结算
      const amount = foe.shield > 0 ? 60 : 35
      ctx.dealDamage(self, foe, amount, self.damageType)
    }
  },
  {
    id: 'hubris',
    name: '狂妄',
    nameEn: 'Hubris',
    desc: '每2秒造成20+层数×2物理伤害；战斗胜利后获得2层，失败层数减半',
    level: 3,
    type: 'ad',
    cooldown: 2.0,
    damageType: 'physical',
    stats: {
      pen: 10,
      ah: 10
    },
    // 层数跨回合累积（keepStacks）且无上限（maxStacks 为 -1）：
    // 每胜利一场由 onBattleEnd 叠 2 层，失败折半。+2 起步保证层数恒为偶数，
    // 折半本就不会出现小数，Math.floor 只是兜底
    maxStacks: -1,
    keepStacks: true,
    icon: require('./img/level3/Hubris.png'),
    effect: (ctx, self) => {
      const foe = self.owner === 'player' ? ctx.enemy : ctx.player
      ctx.dealDamage(self, foe, 20 + self.stacks * 2, self.damageType)
    },
    hooks: {
      onBattleEnd: (ctx, self) => {
        // isWin 由 merge.vue 的 buildIncomeBreakdown 一并广播
        if (ctx.isWin) {
          self.addStack(2)
        } else {
          self.stacks = Math.floor(self.stacks / 2)
        }
      }
    }
  },
  {
    id: 'mejais_soulstealer',
    name: '梅贾的窃魂卷',
    nameEn: "Mejai's Soulstealer",
    desc: '每3秒造成30+层数×3魔法伤害；战斗胜利后获得2层，失败层数减半',
    level: 3,
    type: 'ap',
    cooldown: 3.0,
    damageType: 'magic',
    stats: {
      hp: 75,
      magicPen: 10
    },
    // 与狂妄同一套层数规则：跨回合累积、无上限，胜利 +2、失败折半（向下取整）
    maxStacks: -1,
    keepStacks: true,
    icon: require("./img/level3/Mejai's Soulstealer.png"),
    effect: (ctx, self) => {
      const foe = self.owner === 'player' ? ctx.enemy : ctx.player
      ctx.dealDamage(self, foe, 30 + self.stacks * 3, self.damageType)
    },
    hooks: {
      onBattleEnd: (ctx, self) => {
        if (ctx.isWin) {
          self.addStack(2)
        } else {
          self.stacks = Math.floor(self.stacks / 2)
        }
      }
    }
  },
  {
    id: 'blackfire_torch',
    name: '黯炎火炬',
    nameEn: 'Blackfire Torch',
    desc: '每3秒造成30魔法伤害，对敌人造成伤害时附加5魔法伤害',
    level: 3,
    type: 'ap',
    cooldown: 3.0,
    damageType: 'magic',
    stats: {
      ah: 10
    },
    icon: require('./img/level3/Blackfire Torch.png'),
    effect: (ctx, self) => {
      const foe = self.owner === 'player' ? ctx.enemy : ctx.player
      ctx.dealDamage(self, foe, 30, self.damageType)
    },
    hooks: {
      // 与海克斯科技发电机同一套：己方每造成一次伤害就追加 10 魔法伤害。
      // 第 5 个参数 isBonus=true 标记这是附加伤害，不会再次触发本钩子，避免无限递归
      onDealDamage: (ctx, self) => {
        const foe = self.owner === 'player' ? ctx.enemy : ctx.player
        ctx.dealDamage(self, foe, 5, 'magic', true)
      }
    }
  },
  {
    id: 'nashors_tooth',
    name: '纳什之牙',
    nameEn: "Nashor's Tooth",
    desc: '每2秒造成20物理伤害与50%自身急速的魔法伤害',
    level: 3,
    type: 'ad',
    cooldown: 2.0,
    damageType: 'physical',
    stats: {
      ah: 20
    },
    icon: require("./img/level3/Nashor's Tooth.png"),
    effect: (ctx, self) => {
      const foe = self.owner === 'player' ? ctx.enemy : ctx.player
      ctx.dealDamage(self, foe, 20, self.damageType)
      // 「自身急速」与巨型九头蛇的「自身最大生命值」同一套口径：取整方面板上的急速总和。
      // 棋子构造 / 超时重算时都由 setAhRate(playerAh | enemyAh) 写进 ahRate，这里取一半后向下取整
      ctx.dealDamage(self, foe, Math.floor(self.ahRate * 0.5), 'magic')
    }
  },
  {
    id: 'malignance',
    name: '残疫',
    nameEn: 'Malignance',
    desc: '每3秒造成50魔法伤害；所有装备共计造成10次魔法伤害后，额外获得10法穿',
    level: 3,
    type: 'ap',
    cooldown: 3.0,
    damageType: 'magic',
    stats: {
      ah: 10
    },
    // 层数 = 本场己方打出的魔法伤害次数，满 10 层由 conditionalStats 给出 10 法穿。
    // 返回非空即点亮高亮边框，不需要额外的发光字段
    maxStacks: 10,
    icon: require('./img/level3/Malignance.png'),
    effect: (ctx, self) => {
      const foe = self.owner === 'player' ? ctx.enemy : ctx.player
      ctx.dealDamage(self, foe, 50, self.damageType)
    },
    hooks: {
      // 与凛冬之临同一触发点：己方任一棋子打出的伤害都会走到这里（含残疫自己那发 40），
      // 靠 ctx.damageType 只挑魔法伤害计数
      onDealDamage: (ctx, self) => {
        if (ctx.damageType !== 'magic') return
        self.addStack(1) // 到达 maxStacks 后由 addStack 自动封顶
      }
    },
    conditionalStats: (allyChess, self) => (self.stacks >= 10 ? { magicPen: 10 } : null)
  },
  {
    id: 'void_staff',
    name: '虚空之杖',
    nameEn: 'Void Staff',
    desc: '每5秒造成100魔法伤害',
    level: 3,
    type: 'ap',
    cooldown: 5.0,
    damageType: 'magic',
    stats: {
      magicPen: 20
    },
    icon: require('./img/level3/Void Staff.png'),
    effect: (ctx, self) => {
      const foe = self.owner === 'player' ? ctx.enemy : ctx.player
      ctx.dealDamage(self, foe, 100, self.damageType)
    }
  },
  {
    id: 'ludens_echo',
    name: '卢登的回声',
    nameEn: "Luden's Echo",
    desc: '每3秒造成45魔法伤害；每5次攻击额外造成一次魔法伤害并立即获得1c',
    level: 3,
    type: 'ap',
    cooldown: 3.0,
    damageType: 'magic',
    stats: {
      ah: 10
    },
    // 层数 = 本场已打出的攻击次数，1 → 4，第 5 次触发后归零，角标最多显示到 4
    // （与破败王者之刃「层数 = 攻击次数、触发后重新计数」同一套用法）
    maxStacks: 5,
    icon: require("./img/level3/Luden's Echo.png"),
    effect: (ctx, self) => {
      const foe = self.owner === 'player' ? ctx.enemy : ctx.player
      ctx.dealDamage(self, foe, 45, self.damageType)

      self.addStack(1)
      if (self.stacks < 5) return
      self.stacks = 0 // 触发后重新计数

      // 第 5 次额外打一发，同样是主动伤害，照常触发「造成伤害」类钩子
      ctx.dealDamage(self, foe, 45, self.damageType)
      // 连击奖励当场入账，不走收入明细：夺萃之镰按「当前持有金币」折算伤害，
      // 攒到结算再发的话它读不到这一笔，两件装的联动就废了
      ctx.addMoney(self.owner === 'player' ? ctx.player : ctx.enemy, 1)
    }
  },
  {
    id: 'cryptbloom',
    name: '蜕生',
    nameEn: 'Cryptbloom',
    desc: '每3秒造成55魔法伤害，并回复等同于自身法穿值的生命',
    level: 3,
    type: 'ap',
    cooldown: 3.0,
    damageType: 'magic',
    stats: {
      ah: 10,
      magicPen: 10
    },
    icon: require('./img/level3/Cryptbloom.png'),
    effect: (ctx, self) => {
      const selfRole = self.owner === 'player' ? ctx.player : ctx.enemy
      const foe = self.owner === 'player' ? ctx.enemy : ctx.player
      ctx.dealDamage(self, foe, 55, self.damageType)
      // 「自身法穿」= 己方棋盘上的法穿总和（含自己那 10 点与队友的），
      // 与败魔「按自身魔抗给盾」同一套口径：读聚合值而非装备面板数值
      ctx.heal(selfRole, ctx.getMagicPen(selfRole), self)
    }
  },
  {
    id: 'rabadons_deathcap',
    name: '灭世者的死亡之帽',
    nameEn: "Rabadon's Deathcap",
    desc: '每3秒造成90魔法伤害',
    level: 3,
    type: 'ap',
    cooldown: 3.0,
    damageType: 'magic',
    stats: {
      magicPen: 10,
      // 魔法伤害倍率：+20 表示己方所有魔法伤害 ×1.2，与无尽之刃的 physAmp 同构
      magicAmp: 20
    },
    icon: require("./img/level3/Rabadon's Deathcap.png"),
    effect: (ctx, self) => {
      const foe = self.owner === 'player' ? ctx.enemy : ctx.player
      ctx.dealDamage(self, foe, 90, self.damageType)
    }
  },
  {
    id: 'zhonyas_hourglass',
    name: '中娅沙漏',
    nameEn: "Zhonya's Hourglass",
    desc: '每3秒造成45魔法伤害，己方获得20护盾，敌方获得1护盾',
    level: 3,
    type: 'armor',
    cooldown: 3.0,
    damageType: 'magic',
    stats: {
      armor: 25
    },
    icon: require("./img/level3/Zhonya's Hourglass.png"),
    effect: (ctx, self) => {
      const selfRole = self.owner === 'player' ? ctx.player : ctx.enemy
      const foe = self.owner === 'player' ? ctx.enemy : ctx.player
      ctx.dealDamage(self, foe, 45, self.damageType)
      // 给敌方挂 1 点护盾是刻意为之，与夜之锋刃同一手法：
      // 喂给巨蛇之牙 / 影焰这类「敌方有盾就加伤」的装备，把盾变成双刃剑
      ctx.addShield(selfRole, 20, self)
      ctx.addShield(foe, 1, self)
    }
  },
  {
    id: 'shadowflame',
    name: '影焰',
    nameEn: 'Shadowflame',
    desc: '每3秒造成50魔法伤害；若敌方有护盾，该次伤害提高至90',
    level: 3,
    type: 'ap',
    cooldown: 3.0,
    damageType: 'magic',
    stats: {
      magicPen: 10
    },
    icon: require('./img/level3/Shadowflame.png'),
    effect: (ctx, self) => {
      const foe = self.owner === 'player' ? ctx.enemy : ctx.player
      // 与巨蛇之牙完全同一套：增幅判定卡在攻击之前，
      // 这一发打完才涨起来的盾（如中娅沙漏自己给的那 1 点）不参与本次结算
      const amount = foe.shield > 0 ? 90 : 50
      ctx.dealDamage(self, foe, amount, self.damageType)
    }
  },
  {
    id: 'frozen_heart',
    name: '冰霜之心',
    nameEn: 'Frozen Heart',
    desc: '战斗结束获得2c',
    level: 3,
    type: 'armor',
    cooldown: 0,
    damageType: 'true',
    stats: {
      armor: 60,
      ah: 10,
      // 只减「对方」的急速：聚合时按阵营相减，见 merge.vue 的 playerAh / enemyAh
      // （与深渊面具的 mrShred 完全同构，只是作用在急速上）
      ahShred: 5
    },
    icon: require('./img/level3/Frozen Heart.png'),
    hooks: {
      onBattleEnd: (ctx, self) => {
        ctx.addIncome(self.name, 2)
      }
    }
  },
  {
    id: 'redemption',
    name: '救赎',
    nameEn: 'Redemption',
    desc: '每5秒恢复25生命值',
    level: 3,
    type: 'hp_regen',
    cooldown: 5.0,
    damageType: 'true',
    stats: {
      hp: 80,
      ah: 15,
      healPower: 20
    },
    icon: require('./img/level3/Redemption.png'),
    effect: (ctx, self) => {
      const target = self.owner === 'player' ? ctx.player : ctx.enemy
      // 治疗量会再按己方 healPower 放一次，所以要回复 25 就得写 25
      ctx.heal(target, 25, self)
    }
  },
  {
    id: 'moonstone_renewer',
    name: '月石再生器',
    nameEn: 'Moonstone Renewer',
    desc: '每5秒恢复15生命值，己方每次恢复生命值时额外恢复3生命值',
    level: 3,
    type: 'hp_regen',
    cooldown: 5.0,
    damageType: 'true',
    stats: {
      hp: 80,
      ah: 20,
      healPower: 20
    },
    icon: require('./img/level3/Moonstone Renewer.png'),
    effect: (ctx, self) => {
      const target = self.owner === 'player' ? ctx.player : ctx.enemy
      ctx.heal(target, 15, self)
    },
    hooks: {
      // 与海克斯科技发电机的 onDealDamage 完全对称：己方每发生一次治疗事件就追加 3 点治疗。
      // 第 4 个参数 isBonus=true 标记这是附加治疗，不会再次触发本钩子，避免无限递归。
      // 触发范围是「己方全队的治疗」——治疗宝珠、狂徒铠甲、救赎乃至它自己每 5 秒那一发都算
      onHeal: (ctx, self) => {
        const target = self.owner === 'player' ? ctx.player : ctx.enemy
        ctx.heal(target, 3, self, true)
      }
    }
  }
]

// 合并到主库
itemLibrary.push(...level2Items)
itemLibrary.push(...level3Items)

// ====================================
// 价格体系
// ====================================
// 价值的唯一来源是 recipes.js：
//   一级装备没有配方，价值 = 自己的商店价，买入卖出同价
//   二级 / 三级装备的价值 = 所有材料价值之和 + 合成费，自底向上逐级推导
// 买入价由价值反推——商店价永远高于「凑材料自己合」的成本，否则合成路径形同虚设。
// 因此配置里只需要写一级装备的价格，二级以上一律不写 price / value。
//
// 例：心之钢 = 巨人腰带(8)×2 + 红水晶(3) + 2c 合成费 = 21c 价值 → 买入 30c
//     将来换成别的材料组合（如 3 件二级），价值会自动跟着变。

/** 二级及以上装备的出售返还比例（SELL_RATE）定义在 gameConfig.js */

/**
 * 由价值反推商店买入价
 * 取满足 Math.round(买入价 × SELL_RATE) >= 价值 的最小整数，
 * 保证「买进 → 立刻卖出」不会净赚
 * 例：价值 8 → 11（11×0.7=7.7，四舍五入回 8）；价值 26 → 37（37×0.7=25.9 → 26）
 * @param {number} value 装备价值
 * @returns {number} 商店买入价
 */
export function valueToPrice (value) {
  return Math.ceil((value - 0.5) / SELL_RATE)
}

// 一级装备：价值即自己的商店价
itemLibrary.filter(item => item.level === 1).forEach(item => {
  item.value = item.price
})

// 二级 / 三级装备：按等级升序推导，材料价值此时一定已经算好
itemLibrary
  .filter(item => item.level > 1)
  .sort((a, b) => a.level - b.level)
  .forEach(item => {
    const recipe = recipes.find(r => r.resultId === item.id)
    if (!recipe) {
      console.warn(`[装备库] ${item.name}(${item.id}) 没有配方，无法推导价值与价格`)
      return
    }
    const materialValue = recipe.materials.reduce((sum, mat) => {
      const material = getItemById(mat.id)
      return sum + (material ? material.value : 0) * (mat.count || 1)
    }, 0)
    item.value = materialValue + (recipe.goldCost || 0)
    item.price = valueToPrice(item.value)
  })

// 属性加成由 stats 统一渲染，desc 只保留其余说明，避免数值两处维护
itemLibrary.forEach(item => {
  item.desc = formatDesc(item.stats, item.desc)
})

export default {
  itemLibrary,
  drawItem,
  getItemById
}
