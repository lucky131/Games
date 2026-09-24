/**
 * Merge 游戏基础配置 —— 全局唯一的数值来源
 *
 * 所有玩法数值（初始资源、格子数、战斗参数、经济、伤害公式常数、
 * 敌人波次表、商店池库存表）都只在这里定义，其他文件一律 import 引用，
 * 任何地方都不许再写第二份。
 *
 * 改数值只改本文件；改完请同步更新 design.txt 里的「当前值」。
 */

// ====================================
// 初始资源
// ====================================

/** 初始金币 */
export const INITIAL_MONEY = 5

/** 初始生命（心）：输一波扣一颗，扣完本局结束 */
export const INITIAL_LIVES = 3

/**
 * 开局白送并直接装备到棋盘上的装备 id，按顺序占用棋盘靠前的空格（不扣金币）
 *
 * 起因是「开门杀」：第 1 回合商店只出得起一级装备，而一级池里的红水晶 / 布甲 /
 * 抗魔斗篷 / 荧尘 / 蓝水晶这 5 件全是纯被动（无伤害也无治疗），5 个格子全刷成
 * 它们时玩家第 1 回合零输出、必输。固定发一件长剑兜底：2 秒 10 点物理伤害，
 * 是 8 件一级里最直接的开局战力。
 *
 * 不走 drawItem，与商店刷新概率无关；数量不要超过 BOARD_SLOTS。
 */
export const STARTING_ITEM_IDS = ['long_sword']

/** 玩家基础生命值，不含棋盘上装备的 hp 加成（心之钢叠出来的成长也在其中） */
export const PLAYER_BASE_HP = 200

/**
 * 敌方基础生命值的默认值。
 * 真正数值由 ENEMY_HP_TABLE 按回合查表决定，这里只是 data 里的占位，
 * 避免 initEnemy 执行前 enemy.hp 是 undefined。
 */
export const ENEMY_BASE_HP = 100

// ====================================
// 棋盘 / 仓库 / 商店
// ====================================

/** 棋盘格数（玩家与敌人共用），也约束了敌人每回合的装备总数上限 */
export const BOARD_SLOTS = 6

/** 仓库格数（仅玩家，用于临时存放不参战的装备） */
export const WAREHOUSE_SLOTS = 5

/**
 * 回合 → 商店格数
 *
 * 索引即回合数，第 0 位占位不用，每个格子独立掷等级后抽一件。
 * 开局 5 格，第 6 回合起 6 格、第 9 回合起 7 格：后期装备池更大，
 * 多给格子让玩家更容易在同一回合内凑齐合成材料。
 *
 * 商店数组的实际长度由 merge.vue 的 refreshShop 按当前回合对齐，改本表即可。
 */
export const SHOP_SLOT_TABLE = [
  null,   // 占位，不用第 0 位
  5,      // 第 1 回合
  5,      // 第 2 回合
  5,      // 第 3 回合
  5,      // 第 4 回合
  5,      // 第 5 回合
  6,      // 第 6 回合
  6,      // 第 7 回合
  6,      // 第 8 回合
  7,      // 第 9 回合
  7       // 第 10 回合
]

/**
 * 查询某回合的商店格数，超出表长用最后一档兜底
 * @param {number} round 当前回合（1-based）
 * @returns {number}
 */
export function getShopSlots (round) {
  if (round < 1) round = 1
  if (round < SHOP_SLOT_TABLE.length) return SHOP_SLOT_TABLE[round]
  return SHOP_SLOT_TABLE[SHOP_SLOT_TABLE.length - 1]
}

// ====================================
// 战斗
// ====================================

/** 单场战斗时长（秒） */
export const BATTLE_TIME_LIMIT = 30

/** 一局的总回合数（波数） */
export const TOTAL_ROUNDS = 10

/**
 * 超时惩罚：第 N 秒对双方各造成 (N × 该值)% 最大生命值的真实伤害，逐秒递增。
 * 当前为 0.5 → 第 1 秒 0.5%、第 2 秒 1%、第 3 秒 1.5%……
 */
export const OVERTIME_DAMAGE_PERCENT_PER_SECOND = 0.5

/** 抗性减伤公式的常数 K：伤害 × (1 - 抗性 / (抗性 + K))，护甲与魔抗共用 */
export const RESIST_CONSTANT = 100

/**
 * 有效抗性的下限（护甲与魔抗共用）
 *
 * 穿透 / 法穿可以把对方抗性压到负数，而负抗性在公式里等价于增伤
 * （有效抗性 -50 → 伤害 ×2）。这里封顶在 -50：
 * - 保留「堆穿透压穿抗性后仍有额外收益」的超线性手感；
 * - 避免 4~5 件穿透装同场时打到有效抗性 -100 的除零点，
 *   更低时更会算出负伤害、被公式末尾的「最低 0」夹成完全打不动。
 */
export const MIN_EFFECTIVE_RESIST = -50

// ====================================
// 经济
// ====================================

/** 刷新商店的花费（金币） */
export const REFRESH_COST = 1

/** 每波战斗结束的基础收入，固定值，不随波次递增 */
export const BASE_INCOME = 10

/** 胜利额外奖励 */
export const WIN_BONUS = 2

/**
 * 失败补偿：只奖励「赢不了这一场」这件事本身，所以低于胜利奖励。
 *
 * 失败场同样计入 BASE_INCOME（见 merge.vue 的 buildIncomeBreakdown），
 * 所以输一场 = 10 + 1 = 11c，只比赢一场（12c）少 1c。
 * 又因为失败不推进回合（见 merge.vue 的 continueGame），多打一场就多一份收入。
 *
 * [设计意图] 「先故意输几场攒钱 + 攒回合，再一路赢到底」是合法策略，不是漏洞：
 * 生命（心）本身就是可消耗资源，拿生命换经济是策略的一部分。
 * 满血通关是玩家自我设限的挑战目标，输是合规退路。
 * 因此不做防连败机制，也不要为了堵这条路去压本值。详见 design.txt 十一节决策 1。
 */
export const LOSE_BONUS = 1

/** 二级及以上装备的出售返还比例：卖出返还 买入价 × 该值。一级装备买卖同价，不受此约束 */
export const SELL_RATE = 0.7

// ====================================
// 敌人波次
// ====================================

/**
 * 回合 → 各等级装备数量
 * 索引即回合数，第 0 位占位不用
 *
 * 格式: [1级数量, 2级数量, 3级数量]
 *
 * 标定依据（2026-09-22 重标）：装备价值从第 1 回合的 3c 线性增长到第 10 回合的 81c，
 * 每一回合取「价值最接近目标、同价值下优先高等级」的组合。
 *   价值口径：一级 3c / 二级 8c / 三级 19c（design.txt 十三节的三级均价 19.1c）
 *   价值曲线：3 / 12 / 20 / 30 / 38 / 46 / 55 / 63 / 73 / 81c
 *
 * 两条硬约束：
 * 1. 每回合三项之和不得超过 BOARD_SLOTS，超出部分会被 enemyBuilder 静默丢弃
 *    （旧表第 6 回合 [6,1,0] 合计 7 就踩过这个坑）；
 * 2. 装备价值必须随回合单调递增。
 *
 * [注意 2026-09-22] 「优先高等级」在中间几回合会让件数骤降：第 5 回合目标 38c 的最近组合是
 *         [0,0,2]（两件三级），全场只有 2 件装备；第 4 回合 3 件、第 7 回合又回到 6 件。
 *         根源是三级 19c 与二级 8c 跨度大、组合在价值轴上稀疏。这是刻意的取舍
 *         （价值曲线平滑优先于件数稳定）。
 *
 * [已取消 2026-09-22] 原先「2 级从第 4 回合起、3 级从第 7 回合起（与玩家同步）」的解锁限制。
 *         新曲线在第 3 回合就超出「6 件一级 = 18c」的上限，必须提前放二级；第 4 回合同理
 *         必须放三级，否则价值曲线不成立。代价是第 4~6 回合玩家会撞上自己还合不出的三级装备。
 */
export const ENEMY_LEVEL_TABLE = [
  null,                 // 占位，不用第0位
  [1, 0, 0],  // 第1回合  - 3c
  [4, 0, 0],  // 第2回合  - 12c
  [4, 1, 0],  // 第3回合  - 20c
  [1, 1, 1],  // 第4回合  - 30c
  [0, 0, 2],  // 第5回合  - 38c
  [0, 1, 2],  // 第6回合  - 46c
  [3, 1, 2],  // 第7回合  - 55c
  [2, 0, 3],  // 第8回合  - 63c
  [0, 2, 3],  // 第9回合  - 73c
  [0, 3, 3],  // 第10回合 - 81c
]

/**
 * 回合 → 敌人基础血量
 * 索引即回合数，第 0 位占位不用
 *
 * 与 ENEMY_LEVEL_TABLE 联动：敌人装备价值第 10 回合从 14c 涨到 61c（约 4.4 倍），
 * 血量同步下调 25% 作为补偿，避免「装备变强 + 血量不变」的双重碾压。
 *
 * [已调整 2026-09-22] 配合新 LEVEL_TABLE（第 10 回合装备价值 61c → 92c）与玩家三级输出装的加强，
 *         第 2~10 回合整体再降 25%，依据是实测反馈「敌人偏强」。
 *         第 1 回合保持 150 不动（白给关）——也正因为要保持血量单调递增，150 成了第 2 回合的
 *         下限（210 × 0.75 = 158 > 150），所以这一档的降幅上限就是 25%；
 *         要再弱必须连第 1 回合一起降。
 */
export const ENEMY_HP_TABLE = [
  null,
  150,    // 第1回合 - 白给关，保持不动
  160,    // 第2回合
  215,    // 第3回合
  280,    // 第4回合
  370,    // 第5回合
  480,    // 第6回合
  620,    // 第7回合
  790,    // 第8回合
  955,    // 第9回合
  1125,   // 第10回合
]

/**
 * 敌人生成时禁止出现的「基础装备」id（即一级装备）
 *
 * 凡是用到这些基础装备的二级 / 三级装备会被一并排除。
 * 产物清单不在这里写死，而是运行时由 enemyBuilder 走 recipes.js 的
 * recipeContainsItem 顺着配方树递归追溯，改配方后排除范围自动跟着变。
 *
 * 只约束敌人（enemyBuilder.js），商店与玩家的合成路径不受影响。
 */
export const ENEMY_EXCLUDED_BASE_ITEM_IDS = ['sapphire_crystal']

// ====================================
// 商店
// ====================================

/**
 * 回合 → 商店各等级的抽取权重
 * 每个商店格子独立按此权重掷等级：「哪一件」一级走商店池的剩余库存加权
 * （见 LEVEL1_POOL_SIZE_TABLE），二级 / 三级在池内等概率。
 * 一级池全空时该格改出二级，保证商店不出空格子（见 itemLibrary.js 的 drawItem）。
 *
 * 格式 [1级权重, 2级权重, 3级权重]，只取相对关系，不必凑成 100
 * 第 1~5 回合只出一级；第 6 回合开始出二级
 *
 * 三级权重恒为 0：商店不再刷三级装备，三级只能自己合成。
 * 第三列保留但恒为 0，将来要放开只改数字，不必动 drawItem。
 */
export const LEVEL_WEIGHT_TABLE = [
  null,        // 占位，不用第 0 位
  [1, 0, 0],   // 第 1 回合
  [1, 0, 0],   // 第 2 回合
  [1, 0, 0],   // 第 3 回合
  [1, 0, 0],   // 第 4 回合
  [1, 0, 0],   // 第 5 回合
  [6, 1, 0],   // 第 6 回合 - 开始出二级
  [5, 1, 0],   // 第 7 回合
  [4, 1, 0],   // 第 8 回合
  [3, 1, 0],   // 第 9 回合
  [2, 1, 0],   // 第 10 回合
]

/**
 * 查询某回合的等级权重，超出表长用最后一档兜底
 * @param {number} round 当前回合（1-based）
 * @returns {number[]} [1级权重, 2级权重, 3级权重]
 */
export function getLevelWeights (round) {
  if (round < 1) round = 1
  if (round < LEVEL_WEIGHT_TABLE.length) return LEVEL_WEIGHT_TABLE[round]
  return LEVEL_WEIGHT_TABLE[LEVEL_WEIGHT_TABLE.length - 1]
}

/**
 * 一级装备的「商店池」初始库存
 *
 * 商店刷一级装备时不再按固定权重抽，而是**按剩余库存加权**：库存越多越容易抽到，
 * 库存为 0 的直接不进候选。所以这张表同时决定了开局的出货比例——
 * 当前 红水晶/长剑/增幅典籍 : 荧尘/布甲/抗魔斗篷 : 治疗宝珠/蓝水晶 = 12 : 8 : 4
 *
 * 池子的进出账（实现在 itemPool.js）：
 * - 出：商店格子抽到一级时**立即预留**（抽取即扣）；合成消耗的材料永久离开池子。
 * - 进：刷新商店时未售出的一级格归还；卖出装备时沿配方树递归归还其全部一级材料。
 * - 豁免：不走商店的一级装备（开局长剑、时光之杖白送件、dev 直取）既不扣也不占用池子。
 * - 卖出**不区分来源**，所以「商店买二级再卖出」会凭空归还材料，池子允许超过初始值。
 *
 * 未列出的 id（二级 / 三级）返回 0，表示不追踪、永不出现、永不记账。
 */
export const LEVEL1_POOL_SIZE_TABLE = {
  ruby_crystal: 12,
  long_sword: 11,
  amplifying_tome: 12,
  glowing_mote: 8,
  cloth_armor: 8,
  null_magic_mantle: 8,
  healing_bead: 4,
  sapphire_crystal: 4
}

/**
 * 查询某件装备的池子初始库存，未配置的（二级 / 三级）返回 0
 * @param {string} itemId
 * @returns {number}
 */
export function getPoolSize (itemId) {
  const size = LEVEL1_POOL_SIZE_TABLE[itemId]
  return typeof size === 'number' ? size : 0
}

/**
 * 查询回合对应的敌人配置，超出表长用最后一档兜底
 * @param {number} round 当前回合（1-based）
 * @returns {number[]} [1级数量, 2级数量, 3级数量]
 */
export function getEnemyLevels (round) {
  if (round < 1) round = 1
  if (round < ENEMY_LEVEL_TABLE.length) return ENEMY_LEVEL_TABLE[round]
  return ENEMY_LEVEL_TABLE[ENEMY_LEVEL_TABLE.length - 1]
}

/**
 * 查询回合对应的敌人基础血量，超出表长用最后一档兜底
 * @param {number} round 当前回合（1-based）
 * @returns {number}
 */
export function getEnemyBaseHp (round) {
  if (round < 1) round = 1
  if (round < ENEMY_HP_TABLE.length) return ENEMY_HP_TABLE[round]
  return ENEMY_HP_TABLE[ENEMY_HP_TABLE.length - 1]
}
