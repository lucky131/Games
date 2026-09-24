/**
 * 商店一级装备池
 *
 * 商店的一级装备不是无限供给的：每件在开局时有固定库存（初始值见 gameConfig.js 的
 * LEVEL1_POOL_SIZE_TABLE），玩家从商店买走即消耗，卖出装备时沿配方树递归归还其一级材料。
 *
 * 本模块只提供对池子的操作函数，池子对象本身由 merge.vue 持有（作为响应式 data）：
 * 重开局时整体替换即可复位，UI 也能直接读到库存数字。
 *
 * 依赖方向单向：itemPool → { gameConfig, itemLibrary, recipes }，不反向引用。
 */
import { getPoolSize, LEVEL1_POOL_SIZE_TABLE } from './gameConfig.js'
import { getItemById, itemLibrary } from './itemLibrary.js'
import { getRecipeByResultId } from './recipes.js'

/** 递归展开的最大层数，防御配方写环或写坏导致的爆栈 */
const MAX_EXPAND_DEPTH = 4

/**
 * 建一个全新的池子：每件一级装备的库存回到 LEVEL1_POOL_SIZE_TABLE 的初始值
 *
 * 键取「库存表 ∪ 装备库一级装备」的并集，缺的补 0。必须是并集且预先建好全部键：
 * 池子是 Vue 响应式的 data，事后才新增的键不会被侦测到，UI 上的库存数字不会更新。
 * @returns {Object} { 装备库 id: 库存数量 }
 */
export function createItemPool () {
  const pool = {}
  Object.keys(LEVEL1_POOL_SIZE_TABLE).forEach(id => {
    pool[id] = getPoolSize(id)
  })
  itemLibrary.filter(item => item.level === 1).forEach(item => {
    if (!(item.id in pool)) pool[item.id] = 0
  })
  return pool
}

/**
 * 把一件装备沿配方树递归展开成它消耗的一级装备清单
 *
 * 计数沿树相乘（一件二级要 1 件红水晶，那两件二级就要 2 件）；带 visiting 断环与深度上限，
 * 配方写环时优雅退出而不是爆栈（与 recipes.js 的 materialsContainItem 同一套保护）。
 * 没有配方的当叶子处理，且只有一级装备才真的记入结果。
 * @param {string} itemId 装备库 id
 * @returns {Object} { 一级装备 id: 数量 }
 */
export function expandToBaseItems (itemId) {
  const result = {}
  collectBaseItems(itemId, 1, result, new Set(), 0)
  return result
}

/**
 * expandToBaseItems 的递归体
 * @param {string} itemId 当前展开的装备 id
 * @param {number} multiplier 这件装备在整棵树上出现了几次
 * @param {Object} result 累计结果
 * @param {Set<string>} visiting 当前这条材料链上已展开过的 id，用来断环
 * @param {number} depth 当前深度，达到 MAX_EXPAND_DEPTH 就当叶子
 */
function collectBaseItems (itemId, multiplier, result, visiting, depth) {
  const item = getItemById(itemId)
  const recipe = getRecipeByResultId(itemId)
  if (!recipe || depth >= MAX_EXPAND_DEPTH || visiting.has(itemId)) {
    if (!item) {
      console.warn(`[itemPool] 展开到未知装备 ${itemId}，已忽略`)
    } else if (item.level === 1) {
      result[itemId] = (result[itemId] || 0) + multiplier
    } else {
      // 二级 / 三级落到这里说明配方残缺，材料无从推导，只能整件丢弃
      console.warn(`[itemPool] ${itemId} 没有配方、无法展开，其材料未归还池子`)
    }
    return
  }
  visiting.add(itemId)
  recipe.materials.forEach(mat => {
    collectBaseItems(mat.id, multiplier * (mat.count || 1), result, visiting, depth + 1)
  })
  visiting.delete(itemId)
}

/**
 * 把一件装备按其材料价值归还池子
 *
 * 一级还 1 件；二级 / 三级沿配方树展开成一级材料逐个归还。
 * 不区分装备来源：商店直接买的二级卖掉也照样拆成材料，所以池子允许超过初始值。
 * @param {Object} pool 池子对象
 * @param {string} itemId 装备库 id
 */
export function returnItemToPool (pool, itemId) {
  const baseItems = expandToBaseItems(itemId)
  Object.keys(baseItems).forEach(id => {
    // 只认池子里已有的键：漏掉的说明该装备不在池子的追踪范围，不能凭空造出非响应式的键
    if (id in pool) pool[id] += baseItems[id]
  })
}

/**
 * 把商店里未售出的一级格子归还池子
 *
 * 与「抽取时预留」配对：商店格子抽到一级时就已从池子扣过，没被买走的要在换商店前还回去。
 * 只认一级：二级 / 三级格子从没被扣过，还回去就是凭空造货。
 * 被买走的格子已经置为 null，不会走到这里，「买走 = 永久离开池子」因此自然成立。
 * @param {Object} pool 池子对象
 * @param {Array} shop 商店数组，元素是 Chess 实例或 null
 */
export function releaseShopToPool (pool, shop) {
  shop.forEach(item => {
    if (item && item.level === 1 && item.itemId in pool) {
      pool[item.itemId] += 1
    }
  })
}
