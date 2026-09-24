/**
 * 棋子类
 * 对应合并游戏中的一个装备/棋子，持有属性、冷却、效果
 */
export default class Chess {
  /**
   * @param {Object} config
   * @param {string} config.id 唯一标识
   * @param {string} config.name 显示名称
   * @param {number} config.level 等级 1/2/3
   * @param {string} config.type 属性类型：ad/ap/as/ah/hp/armor/mr/crit
   * @param {number} config.cooldown 基础冷却（秒）
   * @param {string} config.damageType 伤害类型 physical/magic/true
   * @param {string} config.icon 图标路径
   * @param {number} config.price 商店买入价（出售给别人时按 value 返还）
   * @param {number} config.value 装备价值，即出售返还价
   * @param {Object} config.stats 全局聚合属性 { hp, armor, mr, ah, pen, healPower }，由棋盘 computed 汇总生效
   * @param {string} config.desc 装备描述
   * @param {number} config.maxStacks 最大层数：>0 有上限，-1 无上限，0 表示该装备没有层数（不在图标上显示）
   * @param {number} config.initStacks 战斗开始时的初始层数，默认 0。
   *        用于「层数 = 剩余次数」的装备（如斯特拉克的挑战护手开局 1 次触发机会），
   *        与 maxStacks 配合：层数被消耗后即为 0，不再显示角标
   * @param {Object} config.statsPerStack 每层带来的属性加成 { armor, mr, ... }，
   *        与 maxStacks / addStack 配合，由棋盘 computed 按「当前层数 × 每层值」实时折算，
   *        战斗结束 resetStacks 归零后加成随之消失。例：千变者贾修每层 +5 护甲 +5 魔抗
   * @param {boolean} config.keepStacks 层数是否跨回合保留，默认 false。
   *        默认下层数只在本场战斗内有效：startBattle 重置为 initStacks、endBattle 归零。
   *        为 true 时两边都跳过，层数在整局内持续累积（如时光之杖每回合结束 +1 层）
   * @param {Function} config.effect 冷却触发效果函数，参数 (ctx, self) => void
   * @param {Object} config.hooks 事件钩子 { onBattleEnd, onBattleStart, ... }，参数 (ctx, self) => void
   * @param {Function} config.conditionalStats 条件属性加成函数，参数 (allyChess, self) => stats|null
   *        与 stats 的区别：结果随己方阵容与自身状态实时变化，由棋盘 computed 汇总时调用，
   *        不满足条件时返回 null。例：破舰者在全三级阵容下额外给护甲与急速。
   *        满层只解锁行为、不加属性的装备（如裂隙制造者的吸血）返回 {}，用于点亮「加成生效」的高亮边框
   * @param {boolean} config.glowOnOvertime 战斗超时后是否点亮高亮边框（基克的聚合）。
   *        与 conditionalStats 并列的第二种发光来源：它不加属性，只是「此刻有被动正在生效」
   * @param {boolean} config.noGlow 强制不点亮高亮边框，默认 false。
   *        给 conditionalStats 恒非空、但不存在「条件生效 / 不生效」语义的装备用（界弓的穿透
   *        跟随形态，每场必定给一份），否则高亮边框会从开战一直挂到结束
   */
  constructor (config) {
    this.id = Chess.generateId()
    this.itemId = config.id || '' // 原始装备库 ID，用于特殊逻辑判断
    this.name = config.name || '无名棋子'
    this.desc = config.desc || ''
    this.level = config.level || 1
    this.type = config.type || 'ad'
    this.cooldown = config.cooldown != null ? config.cooldown : 2.0
    this.baseCooldown = this.cooldown // 基础冷却（不受 AH 影响，永远不变）
    // 有效基础冷却：默认等于 baseCooldown，装备自己改冷却时（如狂热每层 -0.1s）会更新它。
    // recalcCooldown 不带参数时按它重算，否则重算技能急速会把层数带来的冷却缩减冲掉
    this.effectiveBaseCooldown = this.baseCooldown
    this.damageType = config.damageType || 'physical'
    this.icon = config.icon || ''
    this.price = config.price != null ? config.price : 0
    this.value = config.value != null ? config.value : this.price // 出售返还价，默认与买入价相同
    this.stats = config.stats || {}
    this.effect = config.effect || (() => {})
    this.hooks = config.hooks || {} // 事件钩子 { onBattleEnd, onBattleStart, ... }
    this.conditionalStats = config.conditionalStats || null // 条件属性加成，见构造参数说明
    this.glowOnOvertime = !!config.glowOnOvertime // 超时后才点亮高亮边框，见构造参数说明
    this.noGlow = !!config.noGlow // 强制不发光，见构造参数说明

    // 层数系统（具体的层数效果由各装备在自己的 effect 里实现）
    this.maxStacks = config.maxStacks != null ? config.maxStacks : 0
    this.initStacks = config.initStacks != null ? config.initStacks : 0 // 战斗开始时的层数，默认 0
    this.stacks = 0 // 当前层数，开场为 0；initStacks 只在 startBattle 时生效，商店/仓库里不显示角标
    this.statsPerStack = config.statsPerStack || null // 每层属性加成，见构造参数说明
    this.keepStacks = !!config.keepStacks // 层数是否跨回合保留，见构造参数说明

    // 战斗状态
    this.ahRate = 0 // 当前技能急速，用于冷却换算
    this.currentCooldown = 0 // 当前剩余冷却
    this.owner = null // 'player' | 'enemy'
    this.position = -1 // 在棋盘上的位置索引
    // 本场是否已进入超时：由 merge.vue 的超时系统置位 / 清位，
    // 装备的 conditionalStats 读它来做「超时后才生效」的加成（猎魔人弩箭的 +30 急速）
    this.overtime = false
  }

  /**
   * 是否为纯被动装备（无冷却，不主动触发效果）
   */
  get isPassive () {
    return this.cooldown <= 0
  }

  /**
   * 生成唯一 id
   */
  static generateId () {
    return 'chess_' + Math.random().toString(36).substr(2, 9)
  }

  /**
   * 设置拥有者
   * @param {'player'|'enemy'} owner
   */
  setOwner (owner) {
    this.owner = owner
  }

  /**
   * 设置棋盘位置
   * @param {number} index
   */
  setPosition (index) {
    this.position = index
  }

  /**
   * 重置冷却（刚上场或效果释放后调用）
   */
  resetCooldown () {
    this.currentCooldown = this.cooldown
  }

  /**
   * 战斗开始时初始化：层数回到初始值（跨回合叠层的装备保留已累积层数），并按技能急速重算冷却
   */
  startBattle () {
    if (!this.keepStacks) this.stacks = this.initStacks
    // 层数带来的冷却缩减每场从头开始，否则上一场狂热叠满的 -0.5s 会残留进来
    this.effectiveBaseCooldown = this.baseCooldown
    this.recalcCooldown()
    this.resetCooldown()
  }

  /**
   * 叠加层数（-1 表示无上限），具体层数效果由调用方处理
   * @param {number} count 叠加数量
   * @returns {number} 叠加后的实际层数
   */
  addStack (count = 1) {
    if (this.maxStacks === 0) return this.stacks // 0 表示该装备没有层数系统
    const next = this.stacks + count
    this.stacks = this.maxStacks > 0 ? Math.min(this.maxStacks, next) : next
    return this.stacks
  }

  /**
   * 层数归零（keepStacks 的装备不适用，由调用方跳过）
   * 层数带来的冷却缩减（狂热 / 三相之力）一并回退
   */
  resetStacks () {
    this.stacks = 0
    // 层数带来的冷却缩减一并回退，并立刻重算一次冷却，不留半更新的状态
    this.effectiveBaseCooldown = this.baseCooldown
    this.recalcCooldown()
  }

  /**
   * 重算实际冷却
   * 公式：实际冷却 = 有效基础冷却 × 100 / (100 + 技能急速)
   * 装备改变自身冷却时（如层数效果）可传入新的有效基础冷却
   * @param {number} [baseCd] 有效基础冷却，缺省沿用上一次生效的那个（含层数效果）
   */
  recalcCooldown (baseCd) {
    const cd = Math.max(0, baseCd != null ? baseCd : this.effectiveBaseCooldown)
    this.effectiveBaseCooldown = cd
    const newCd = cd * 100 / (100 + this.ahRate)
    // 按比例调整当前剩余冷却，避免进度跳跃
    if (this.currentCooldown > 0 && this.cooldown > 0) {
      this.currentCooldown *= (newCd / this.cooldown)
    }
    this.cooldown = newCd
  }

  /**
   * 设置技能急速，动态调整冷却
   * 走的还是当前生效的基础冷却，所以不会把层数带来的冷却缩减冲掉
   * @param {number} ah 技能急速值
   */
  setAhRate (ah) {
    this.ahRate = ah
    this.recalcCooldown()
  }

  /**
   * 每帧更新
   * @param {number} dt 距离上一帧的秒数
   * @param {Object} ctx 战斗上下文，包含双方角色、棋盘等
   * @returns {boolean} 是否在本帧释放了效果
   */
  update (dt, ctx) {
    // 冷却为 0 表示纯被动装备，不自动释放效果
    if (this.cooldown <= 0) {
      return false
    }

    if (this.currentCooldown > 0) {
      this.currentCooldown -= dt
    }

    if (this.currentCooldown <= 0) {
      this.activate(ctx)
      this.resetCooldown()
      return true
    }

    return false
  }

  /**
   * 释放效果
   * @param {Object} ctx
   */
  activate (ctx) {
    if (typeof this.effect === 'function') {
      this.effect(ctx, this)
    }
  }

  /**
   * 触发指定事件钩子
   * @param {string} eventName 事件名
   * @param {Object} ctx 上下文
   */
  emitHook (eventName, ctx) {
    if (this.hooks && typeof this.hooks[eventName] === 'function') {
      this.hooks[eventName](ctx, this)
    }
  }

  /**
   * 获取对方阵营
   * @returns {'player'|'enemy'|null}
   */
  getOpponent () {
    if (!this.owner) return null
    return this.owner === 'player' ? 'enemy' : 'player'
  }

  /**
   * 序列化，用于保存/同步
   */
  toJSON () {
    return {
      id: this.id,
      name: this.name,
      desc: this.desc,
      level: this.level,
      type: this.type,
      cooldown: this.cooldown,
      damageType: this.damageType,
      icon: this.icon,
      price: this.price,
      value: this.value,
      stats: this.stats
    }
  }

  /**
   * 从 JSON 反序列化
   * @param {Object} data
   * @param {Function} effectBuilder 根据 id 构建 effect 函数
   */
  static fromJSON (data, effectBuilder) {
    return new Chess({
      id: data.id,
      name: data.name,
      desc: data.desc,
      level: data.level,
      type: data.type,
      cooldown: data.cooldown,
      damageType: data.damageType,
      icon: data.icon,
      price: data.price != null ? data.price : 0,
      value: data.value,
      stats: data.stats || {},
      effect: effectBuilder ? effectBuilder(data.id) : (() => {})
    })
  }
}
