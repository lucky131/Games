/**
 * 敌人阵容生成器
 * 根据回合数从映射表中查表，按等级随机抽取装备组成敌人阵容
 *
 * 波次数值（每回合各等级数量、敌人基础血量）统一在 gameConfig.js 中定义
 */
import Chess from './Chess.js'
import { itemLibrary } from './itemLibrary.js'
import { BOARD_SLOTS, getEnemyLevels, getEnemyBaseHp, ENEMY_EXCLUDED_BASE_ITEM_IDS } from './gameConfig.js'
import { getRecipeByResultId, recipeContainsItem } from './recipes.js'
import { logBySide } from './logUtil.js'

/**
 * 判断某件装备是否被排除在敌人池之外
 *
 * 一级装备直接比 id；二级 / 三级顺着配方树递归追溯，材料链里只要出现过
 * 被排除的基础装备就整件排除。递归交给 recipes.js 的 recipeContainsItem，
 * 它已经处理过配方成环的断链，不在这里再写一份
 * @param {string} itemId
 * @returns {boolean}
 */
function isExcludedForEnemy (itemId) {
  const recipe = getRecipeByResultId(itemId) // 一级装备没有配方，返回 undefined
  return ENEMY_EXCLUDED_BASE_ITEM_IDS.some(baseId => {
    if (itemId === baseId) return true
    return recipe ? recipeContainsItem(recipe, baseId) : false
  })
}

/**
 * 从装备库中随机抽指定等级的装备
 * @param {number} level 1/2/3
 * @param {number} count 抽取数量
 * @returns {Chess[]} 如果该等级没有装备则返回空数组
 */
function drawItemsByLevel (level, count) {
  const pool = itemLibrary.filter(item => item.level === level && !isExcludedForEnemy(item.id))
  if (pool.length === 0 || count <= 0) return []

  const result = []
  for (let i = 0; i < count; i++) {
    const template = pool[Math.floor(Math.random() * pool.length)]
    result.push(new Chess({ ...template }))
  }
  return result
}

/**
 * 根据回合数生成敌人阵容
 * @param {number} round 当前回合 (1-based)
 * @param {number} totalRounds 总回合数（用于计算血量缩放）
 * @returns {{ chess: (Chess|null)[], basicHp: number }}
 */
export function buildEnemyLineup (round, totalRounds) {
  const [countL1, countL2, countL3] = getEnemyLevels(round)
  const slots = BOARD_SLOTS

  // 基础血量从配置表查表
  const basicHp = getEnemyBaseHp(round)

  // 按等级各自随机抽取
  const items = [
    ...drawItemsByLevel(1, countL1),
    ...drawItemsByLevel(2, countL2),
    ...drawItemsByLevel(3, countL3),
  ]

  // 填入棋盘格子
  const chess = Array(slots).fill(null)
  items.forEach((piece, i) => {
    if (i < slots) {
      piece.setOwner('enemy')
      piece.setPosition(i)
      chess[i] = piece
    }
  })

  logBySide('enemy', `[敌人生成] 第${round}回合：1级×${countL1} 2级×${countL2} 3级×${countL3} — 实际装备${items.length}件，基础血量${basicHp}`)

  return { chess, basicHp }
}