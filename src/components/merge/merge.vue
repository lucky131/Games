<template>
  <div id="merge">
    <div class="stage">
      <div class="time" :class="{'overtime': battle.timeLeft < 0}">
        <template v-if="battle.timeLeft >= 0">
          <span class="time-value">{{ Math.ceil(battle.timeLeft) }}</span>
          <span class="time-unit">s</span>
        </template>
        <template v-else>
          <span class="time-value">{{ Math.floor(Math.abs(battle.timeLeft)) }}</span>
          <span class="time-unit">s 超时</span>
        </template>
      </div>
      <div class="pve">
        <div class="side player" :class="{ fighting: battle.state === 'fighting' }">
          <div class="stats-panel">
            <div class="stat-item" v-for="(stat, i) in playerStatList" :key="i">
              <span class="stat-label">{{ stat.label }}</span>
              <span class="stat-value">{{ stat.value }}</span>
            </div>
          </div>
          <div class="chesses">
            <div class="chess" :class="[{ 'bonus-active': isBonusActive(item, player.chess), 'is-empty': !item }, levelClass(item)]" v-for="(item, index) in player.chess" :key="index" @click="item && openMask(item, 'equip')">
              <img v-if="item && item.icon" :src="item.icon" :alt="item.name" class="chess-icon">
              <div v-if="item && item.cooldown > 0 && item.currentCooldown > 0" class="cooldown-mask" :style="cooldownStyle(item)">
                {{ Math.ceil(item.currentCooldown * 10) / 10 }}s
              </div>
              <div v-if="showStackBadge(item)" class="stack-badge">{{ item.stacks }}</div>
            </div>
          </div>
          <div class="hp-block">
            <div class="hp-bar">
              <div class="hp-fill" :style="{ width: playerHpBar.hpWidth }"></div>
              <div class="shield-fill" :style="{ left: playerHpBar.hpWidth, width: playerHpBar.shieldWidth }"></div>
            </div>
            <div class="hp-text">
              <span>{{ hpInfoFormat() }}</span>
              <span v-if="player.shield > 0" class="hp-shield">({{ player.shield }})</span>
            </div>
          </div>
        </div>

        <div class="side enemy" :class="{ fighting: battle.state === 'fighting' }">
          <div class="stats-panel">
            <div class="stat-item" v-for="(stat, i) in enemyStatList" :key="i">
              <span class="stat-label">{{ stat.label }}</span>
              <span class="stat-value">{{ stat.value }}</span>
            </div>
          </div>
          <div class="chesses">
            <div class="chess" :class="[{ 'bonus-active': isBonusActive(item, enemy.chess), 'is-empty': !item }, levelClass(item)]" v-for="(item, index) in enemy.chess" :key="index" @click="item && openMask(item, 'enemy')">
              <img v-if="item && item.icon" :src="item.icon" :alt="item.name" class="chess-icon">
              <div v-if="item && item.cooldown > 0 && item.currentCooldown > 0" class="cooldown-mask" :style="cooldownStyle(item)">
                {{ Math.ceil(item.currentCooldown * 10) / 10 }}s
              </div>
              <div v-if="showStackBadge(item)" class="stack-badge">{{ item.stacks }}</div>
            </div>
          </div>
          <div class="hp-block">
            <div class="hp-bar">
              <div class="hp-fill" :style="{ width: enemyHpBar.hpWidth }"></div>
              <div class="shield-fill" :style="{ left: enemyHpBar.hpWidth, width: enemyHpBar.shieldWidth }"></div>
            </div>
            <div class="hp-text">
              <span>{{ enemyHpInfoFormat() }}</span>
              <span v-if="enemy.shield > 0" class="hp-shield">({{ enemy.shield }})</span>
            </div>
          </div>
        </div>

      </div>
      <div class="warehouse">
        <div class="section-title">仓库</div>
        <div class="blocks">
          <div class="block" :class="[{ 'is-empty': !item }, levelClass(item)]" v-for="(item, index) in player.warehouse" :key="index">
            <img v-if="item && item.icon" :src="item.icon" :alt="item.name" class="chess-icon" @click="openMask(item, 'warehouse')">
            <div v-if="showStackBadge(item)" class="stack-badge">{{ item.stacks }}</div>
          </div>
        </div>
      </div>

      <div class="shop">
        <div class="section-title">商店</div>
        <div class="blocks">
          <div class="block" :class="[{ 'is-empty': !item }, levelClass(item)]" v-for="(item, index) in shop" :key="index">
            <img v-if="item && item.icon" :src="item.icon" :alt="item.name" class="chess-icon" @click="openMask(item, 'shop')">
            <div v-if="showStackBadge(item)" class="stack-badge">{{ item.stacks }}</div>
          </div>
        </div>
      </div>

      <div class="hud">
        <!-- 生命：心形直接铺开，超过 5 颗折叠成「♥×N」免得撑爆窄屏 -->
        <span class="hud-cell lives">
          <template v-if="player.lives <= 5">{{ '❤'.repeat(player.lives) }}</template>
          <template v-else>❤×{{ player.lives }}</template>
        </span>
        <span class="hud-cell round">
          <span class="hud-num">{{ battle.currentRound }}</span>
          <span class="hud-unit">/{{ battle.totalRounds }}</span>
          <span class="hud-label">回合</span>
        </span>
        <span class="hud-cell money">
          <i class="el-icon-coin"></i>
          <span class="hud-num">{{ player.money }}c</span>
          <span class="hud-unit"></span>
        </span>
      </div>
    </div>

    <!--快速合成区：材料与金币都够才出现，默认整块不渲染；固定在底部操作栏上方，
        不随舞台内容滚动。只露产物图标与本次实际要扣的合成费，点图标即合成-->
    <div v-if="craftBarItems.length" class="craft-bar">
      <span class="craft-bar-label">可合成</span>
      <div ref="craftBar" class="craft-bar-list">
        <div v-for="item in craftBarItems" :key="item.recipe.resultId" class="craft-bar-item"
             :title="getItemById(item.recipe.resultId).name" @click="craftFromBar(item.recipe)">
          <img :src="getItemById(item.recipe.resultId).icon" :alt="getItemById(item.recipe.resultId).name" class="craft-bar-icon" :class="levelClass(getItemById(item.recipe.resultId))">
          <span v-if="item.gold" class="craft-bar-gold">{{ item.gold }}c</span>
        </div>
      </div>
    </div>

    <div class="action-bar">
      <el-button class="btn-refresh" round :disabled="player.money < refreshCost || battle.state === 'fighting'" @click="refreshShopBtn"><i class="el-icon-refresh"></i><span> 刷新 {{ refreshCost }}c</span></el-button>
      <el-button class="btn-battle" round type="primary" :disabled="battle.state !== 'idle'" @click="startBattle"><i class="el-icon-s-flag"></i> 开始战斗 <i class="el-icon-s-flag"></i></el-button>
      <el-button class="btn-icon btn-book" circle icon="el-icon-notebook-2" title="合成表" @click="openRecipeBook"></el-button>
      <el-button class="btn-icon btn-speed" :class="'speed-' + battle.speed" circle title="战斗速度" @click="toggleSpeed">{{ battle.speed }}x</el-button>
    </div>

    <!--浮窗-->
    <div v-if="showMask" class="mask" @click="showMask=false">
      <div class="inner" @click.stop>
        <img :src="maskItem && maskItem.icon" :alt="maskItem && maskItem.name" :class="levelClass(maskItem)">
        <div class="name">{{maskItem && maskItem.name}}</div>
        <div class="desc">{{maskItem && maskItem.desc}}</div>
        <!-- 敌方装备：仅查看；开发者模式下可移除 -->
        <template v-if="maskType === 'enemy'">
          <el-button v-if="devMode" round :disabled="battle.state === 'fighting'" @click="devRemoveEnemyChess">移除</el-button>
          <div v-else class="hint">敌方装备，无法操作</div>
        </template>
        <template v-if="maskType === 'shop'">
          <!-- 一级装备有商店池限量，把剩余库存亮出来；池子是隐藏状态，不显示的话玩家只会把它归因为运气 -->
          <div v-if="maskItem && maskItem.level === 1" class="pool-hint">池剩余 {{ poolRemaining(maskItem.itemId) }}</div>
          <el-button round :disabled="player.money < maskItem.price || isStorageFull || battle.state === 'fighting'" @click="buyChess">购买 {{maskItem && maskItem.price}}c</el-button>
        </template>
        <!-- 仓库：装备 / 出售 -->
        <template v-else-if="maskType === 'warehouse'">
          <el-button round :disabled="!canEquip || battle.state === 'fighting'" @click="equipChess">装备</el-button>
          <el-button round :disabled="battle.state === 'fighting'" @click="sellChess">出售 {{maskItem && maskItem.value}}c</el-button>
        </template>
        <!-- 已装备：卸下 -->
        <template v-else-if="maskType === 'equip'">
          <el-button round :disabled="battle.state === 'fighting'" @click="unequipChess">卸下</el-button>
        </template>
        <!-- 合成提示（仓库/装备共用）：只做查阅，列出该装备参与合成的全部产物与还缺的材料；
             实际合成在主界面底部操作栏上方的快速合成区进行，这里不再放合成按钮 -->
        <template v-if="maskType === 'warehouse' || maskType === 'equip'">
          <div v-if="maskCraftableRecipes.length" class="craft-section">
            <div class="craft-label"><span>可合成</span></div>
            <div v-for="recipe in maskCraftableRecipes" :key="recipe.resultId" class="craft-entry">
              <div class="craft-icons-row">
                <img :src="getItemById(recipe.resultId).icon" :alt="getItemById(recipe.resultId).name" class="craft-result-icon" :class="levelClass(getItemById(recipe.resultId))">
                <template v-if="missingMaterials(recipe).length || missingGold(recipe)">
                  <span class="craft-lack-label">还缺少</span>
                  <template v-for="(mat, idx) in missingMaterials(recipe)">
                    <img :key="'m' + idx" :src="getItemById(mat.id).icon" :alt="getItemById(mat.id).name" class="craft-mat-icon" :class="levelClass(getItemById(mat.id))">
                    <span :key="'n' + idx" class="mat-count">×{{ mat.lack }}</span>
                  </template>
                  <span v-if="missingGold(recipe)" class="gold-tag-mini">{{ missingGold(recipe) }}c</span>
                </template>
                <span v-else class="craft-ready">已凑齐</span>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!--战斗结果弹窗-->
    <div v-if="showResult" class="mask" @click="continueGame">
      <div class="inner result-panel" @click.stop>
        <div class="result-text" :class="battleResult === '胜利' ? 'win' : 'lose'">{{ battleResult }}</div>
        <!--本场装备统计：左己方、右敌方，各固定 6 行（不足补空行），按输出降序-->
        <div class="stats-split">
          <div class="stats-block">
            <div class="stats-head">己方</div>
            <div class="stats-cols">
              <span class="col-icon"></span>
              <span class="col-num">输出</span>
              <span class="col-num">护盾</span>
              <span class="col-num">治疗</span>
            </div>
            <div v-for="n in 6" :key="'p' + n" class="stats-row">
              <template v-if="playerStats[n - 1]">
                <span class="col-icon">
                  <img :src="playerStats[n - 1].icon" :alt="playerStats[n - 1].name" :title="playerStats[n - 1].name" :class="levelClass(playerStats[n - 1])">
                </span>
                <span class="col-num">{{ playerStats[n - 1].damage }}</span>
                <span class="col-num">{{ playerStats[n - 1].shield }}</span>
                <span class="col-num">{{ playerStats[n - 1].heal }}</span>
              </template>
              <template v-else>
                <span class="col-icon stats-empty">—</span>
                <span class="col-num stats-empty">—</span>
                <span class="col-num stats-empty">—</span>
                <span class="col-num stats-empty">—</span>
              </template>
            </div>
          </div>
          <div class="stats-block">
            <div class="stats-head">敌方</div>
            <div class="stats-cols">
              <span class="col-icon"></span>
              <span class="col-num">输出</span>
              <span class="col-num">护盾</span>
              <span class="col-num">治疗</span>
            </div>
            <div v-for="n in 6" :key="'e' + n" class="stats-row">
              <template v-if="enemyStats[n - 1]">
                <span class="col-icon">
                  <img :src="enemyStats[n - 1].icon" :alt="enemyStats[n - 1].name" :title="enemyStats[n - 1].name" :class="levelClass(enemyStats[n - 1])">
                </span>
                <span class="col-num">{{ enemyStats[n - 1].damage }}</span>
                <span class="col-num">{{ enemyStats[n - 1].shield }}</span>
                <span class="col-num">{{ enemyStats[n - 1].heal }}</span>
              </template>
              <template v-else>
                <span class="col-icon stats-empty">—</span>
                <span class="col-num stats-empty">—</span>
                <span class="col-num stats-empty">—</span>
                <span class="col-num stats-empty">—</span>
              </template>
            </div>
          </div>
        </div>
        <div class="income-detail">
          <div class="income-title">本回合收入</div>
          <div v-for="(entry, i) in battle.incomeBreakdown" :key="i" class="income-row">
            <span>{{ entry.name }}</span>
            <span class="income-amount">+{{ entry.amount }}c</span>
          </div>
          <div class="income-row income-total">
            <span>合计</span>
            <span class="income-amount">+{{ incomeTotal }}c</span>
          </div>
        </div>
        <el-button type="primary" round @click="continueGame">继续</el-button>
      </div>
    </div>

    <!--整局结束弹窗（不响应点击遮罩，只能重新开局）-->
    <div v-if="showGameOver" class="mask game-over-mask">
      <div class="inner result-panel" @click.stop>
        <div class="result-text" :class="gameOverResult === 'win' ? 'win' : 'lose'">
          {{ gameOverResult === 'win' ? '通关！' : '游戏结束' }}
        </div>
        <!--最后一波的装备统计：battle.stats 在 endBattle 后未被清理，即为最后一波数据-->
        <div class="stats-split">
          <div class="stats-block">
            <div class="stats-head">己方</div>
            <div class="stats-cols">
              <span class="col-icon"></span>
              <span class="col-num">输出</span>
              <span class="col-num">护盾</span>
              <span class="col-num">治疗</span>
            </div>
            <div v-for="n in 6" :key="'gp' + n" class="stats-row">
              <template v-if="playerStats[n - 1]">
                <span class="col-icon">
                  <img :src="playerStats[n - 1].icon" :alt="playerStats[n - 1].name" :title="playerStats[n - 1].name" :class="levelClass(playerStats[n - 1])">
                </span>
                <span class="col-num">{{ playerStats[n - 1].damage }}</span>
                <span class="col-num">{{ playerStats[n - 1].shield }}</span>
                <span class="col-num">{{ playerStats[n - 1].heal }}</span>
              </template>
              <template v-else>
                <span class="col-icon stats-empty">—</span>
                <span class="col-num stats-empty">—</span>
                <span class="col-num stats-empty">—</span>
                <span class="col-num stats-empty">—</span>
              </template>
            </div>
          </div>
          <div class="stats-block">
            <div class="stats-head">敌方</div>
            <div class="stats-cols">
              <span class="col-icon"></span>
              <span class="col-num">输出</span>
              <span class="col-num">护盾</span>
              <span class="col-num">治疗</span>
            </div>
            <div v-for="n in 6" :key="'ge' + n" class="stats-row">
              <template v-if="enemyStats[n - 1]">
                <span class="col-icon">
                  <img :src="enemyStats[n - 1].icon" :alt="enemyStats[n - 1].name" :title="enemyStats[n - 1].name" :class="levelClass(enemyStats[n - 1])">
                </span>
                <span class="col-num">{{ enemyStats[n - 1].damage }}</span>
                <span class="col-num">{{ enemyStats[n - 1].shield }}</span>
                <span class="col-num">{{ enemyStats[n - 1].heal }}</span>
              </template>
              <template v-else>
                <span class="col-icon stats-empty">—</span>
                <span class="col-num stats-empty">—</span>
                <span class="col-num stats-empty">—</span>
                <span class="col-num stats-empty">—</span>
              </template>
            </div>
          </div>
        </div>
        <div class="game-over-detail">
          <div class="income-row">
            <span>到达回合</span>
            <span>{{ Math.min(battle.currentRound, battle.totalRounds) }}/{{ battle.totalRounds }}</span>
          </div>
        </div>
        <el-button type="primary" round @click="restartGame">重新开局</el-button>
      </div>
    </div>

    <!--合成表弹窗-->
    <div v-if="showRecipeBook" class="mask recipe-book-mask" @click="showRecipeBook=false">
      <div class="recipe-book" @click.stop>
        <div class="title" @click="onRecipeTitleClick">合成配方</div>
        <div class="recipe-tabs">
          <div
            v-for="tab in recipeTabs"
            :key="tab.level"
            class="recipe-tab"
            :class="{ active: recipeTab === tab.level }"
            @click="recipeTab = tab.level"
          >{{ tab.label }}</div>
        </div>
        <!-- 一级装备筛选：8 个基础装备平铺一行，默认全不选（不筛选）
             选中后只看材料链里用到它的高级装备，再点一次同一个取消 -->
        <div class="recipe-filter">
          <div
            v-for="item in recipeFilterItems"
            :key="item.id"
            class="filter-item"
            :class="{ active: recipeFilter === item.id }"
            :title="item.name"
            @click="toggleRecipeFilter(item.id)"
          >
            <img :src="item.icon" :alt="item.name" :class="levelClass(item)">
          </div>
        </div>
        <div class="recipe-body">
          <div v-for="recipe in recipes" :key="recipe.resultId" class="recipe-card">
            <!-- 三级配方会有多行：每个合成材料一行；一级材料没有展开式，统一并到末行 -->
            <div v-for="(row, ri) in recipe.rows" :key="ri" class="recipe-row">
              <!-- 行首固定宽度槽：首行放「产物 =」，其余行放 +，让各行材料图标的左边缘对齐 -->
              <div class="row-head">
                <template v-if="ri === 0">
                  <img :src="getItemById(recipe.resultId).icon" :alt="getItemById(recipe.resultId).name" class="result-icon" :class="levelClass(getItemById(recipe.resultId))" title="点击查看装备详情" @click="openItemDetail(recipe.resultId)">
                  <span class="eq-sign">=</span>
                </template>
                <span v-else class="row-plus">+</span>
              </div>
              <!-- 该行的材料（一级材料一行里可能挤着好几个） -->
              <template v-for="(iconId, ci) in row.icons">
                <span v-if="ci > 0" :key="'ip' + ci" class="plus-sign">+</span>
                <img :key="'i' + ci" :src="getItemById(iconId).icon" :alt="getItemById(iconId).name" class="mat-icon" :class="levelClass(getItemById(iconId))" title="点击查看装备详情" @click="openItemDetail(iconId)">
              </template>
              <!-- 该材料自己也是合成的：接上它的配方 -->
              <template v-if="row.leaves && row.leaves.length">
                <span class="eq-sign">=</span>
                <template v-for="(leafId, li) in row.leaves">
                  <span v-if="li > 0" :key="'lp' + li" class="plus-sign">+</span>
                  <img :key="'l' + li" :src="getItemById(leafId).icon" :alt="getItemById(leafId).name" class="mat-icon" :class="levelClass(getItemById(leafId))" title="点击查看装备详情" @click="openItemDetail(leafId)">
                </template>
                <template v-if="row.goldCost">
                  <span class="plus-sign">+</span>
                  <span class="gold-tag-mini">{{ row.goldCost }}c</span>
                </template>
              </template>
              <!-- 产物自己的合成费：贴在末行末尾（一级材料行就是「红水晶 + 2c」），
                   末行本身是合成材料行时会被 buildRows 推到单独一行，不会两个 2c 挤一起。
                   那行是个空行，行首的 + 已经占了加号位，这里再补一个就成了「++2c」 -->
              <template v-if="row.productGold">
                <span v-if="row.icons.length || (row.leaves && row.leaves.length)" class="plus-sign">+</span>
                <span class="gold-tag-mini">{{ row.productGold }}c</span>
              </template>
            </div>
          </div>
          <div v-if="recipes.length === 0" class="empty">{{ recipeFilter ? '没有用到该装备的配方' : '暂无配方' }}</div>
        </div>
      </div>
    </div>

    <!--合成表内的装备详情（第二层弹窗）
        合成表里的图标是装备库的静态配置，不是棋盘/仓库里的实例，
        所以不复用 showMask / maskItem 那套状态，单独走一层。
        遮罩用 .stop，点它只关自己，不冒泡到合成表把它一起关掉。-->
    <div v-if="showItemDetail && detailItem" class="mask item-detail-mask" @click.stop="showItemDetail=false">
      <div class="inner" @click.stop>
        <img :src="detailItem.icon" :alt="detailItem.name" :class="levelClass(detailItem)">
        <div class="name">{{ detailItem.name }}</div>
        <div class="desc">{{ detailItem.desc }}</div>
        <div v-if="devMode" class="dev-grant-row">
          <el-button round @click="devGrantItem(detailItem.id)">己方获取</el-button>
          <el-button round @click="devGrantEnemyItem(detailItem.id)">敌方获取</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
// 样式全部集中在 merge.scss：现代卡片风 + 移动端适配
@import './merge.scss';
</style>

<script>
import Chess from './Chess.js'
import { drawItem, getItemById, itemLibrary } from './itemLibrary.js'
import { createItemPool, releaseShopToPool, returnItemToPool } from './itemPool.js'
import { buildEnemyLineup } from './enemyBuilder.js'
import { getRecipeByResultId, recipeContainsItem, recipes } from './recipes.js'
import { logBySide } from './logUtil.js'
// 全部基础数值来自 gameConfig.js，此处只引用，不写第二份
import {
  INITIAL_MONEY,
  INITIAL_LIVES,
  STARTING_ITEM_IDS,
  PLAYER_BASE_HP,
  ENEMY_BASE_HP,
  BOARD_SLOTS,
  WAREHOUSE_SLOTS,
  getShopSlots,
  BATTLE_TIME_LIMIT,
  TOTAL_ROUNDS,
  OVERTIME_DAMAGE_PERCENT_PER_SECOND,
  RESIST_CONSTANT,
  MIN_EFFECTIVE_RESIST,
  REFRESH_COST,
  BASE_INCOME,
  WIN_BONUS,
  LOSE_BONUS
} from './gameConfig.js'

export default {
  name: 'merge',
  data () {
    return {
      player: {
        money: INITIAL_MONEY,
        basicHp: PLAYER_BASE_HP,
        hp: PLAYER_BASE_HP,
        shield: 0, // 护盾，先于血量承受伤害，战斗开始时清零
        chess: Array(BOARD_SLOTS).fill(null),
        warehouse: Array(WAREHOUSE_SLOTS).fill(null),
        lives: INITIAL_LIVES
      },
      enemy: {
        // 基础血量占位，真正数值由 initEnemy 按回合查表写入
        basicHp: ENEMY_BASE_HP,
        hp: ENEMY_BASE_HP,
        shield: 0,
        chess: Array(BOARD_SLOTS).fill(null)
      },
      shop: Array(getShopSlots(1)).fill(null),
      // 一级装备的商店池 { itemId: 剩余库存 }，规则见 itemPool.js：
      // 刷新时按剩余库存加权抽取并在抽取时预留，未售出的格子换商店时归还，
      // 买走即永久离开池子，合成消耗只出不进，卖出装备才递归归还材料
      itemPool: createItemPool(),
      showMask: false,
      maskItem: null,
      maskType: 'shop', // shop / warehouse / equip / enemy
      showResult: false,
      battleResult: '',
      showGameOver: false, // 整局结束弹窗
      gameOverResult: '', // 'win' | 'lose'
      showRecipeBook: false,
      showItemDetail: false, // 合成表第二层：装备详情弹窗
      detailItem: null, // 详情弹窗展示的装备（itemLibrary 静态配置，不是棋盘/仓库里的实例）
      devMode: false, // 开发者模式：连点「合成配方」标题 3 次解锁，纯内存态，刷新页面即失效
      devTitleClicks: 0, // 标题点击计数
      recipeTab: 2, // 合成表当前页签，2=二级 / 3=三级（按产物 level 过滤）
      recipeTabs: [
        { level: 2, label: '二级' },
        { level: 3, label: '三级' }
      ],
      recipeFilter: null, // 合成表的一级装备筛选，存 itemId；null = 未筛选，展示当前页签全部配方
      battle: {
        state: 'idle', // idle / fighting / finished
        lastTime: 0,
        timeLeft: 0,
        timeLimit: BATTLE_TIME_LIMIT, // 战斗限时（秒）
        overtimeSeconds: 0, // 超时累计秒数
        speed: 1,
        currentRound: 1,
        totalRounds: TOTAL_ROUNDS,
        incomeBreakdown: [],
        // 每场战斗的装备统计：{ player: [], enemy: [] }，每项 { id, name, icon, damage, shield, heal }
        // 按 chess.id 聚合，故同名装备也各自独立计分；开战前由 startBattle 重置
        stats: { player: [], enemy: [] },
      },
      battleLoopId: null
    }
  },
  computed: {
    // 注意：这里没有「角色级永久成长」一项。心之钢的血量成长挂在棋子自己身上
    // （statsPerStack），棋子一离场 sumStat 就不再算它，上限随之回落
    maxHp(){
      return this.player.basicHp + this.sumStat(this.player.chess, 'hp');
    },
    enemyMaxHp(){
      return this.enemy.basicHp + this.sumStat(this.enemy.chess, 'hp');
    },
    playerArmor(){
      return this.sumStat(this.player.chess, 'armor');
    },
    enemyArmor(){
      return this.sumStat(this.enemy.chess, 'armor');
    },
    playerMr(){
      // 己方魔抗 − 对方「降低敌方魔抗」类装备的总和（深渊面具）。
      // 走 stats 聚合而不是在受击时临时扣减：属性面板与伤害结算读到的始终是同一个值
      return this.sumStat(this.player.chess, 'mr') - this.sumStat(this.enemy.chess, 'mrShred');
    },
    enemyMr(){
      return this.sumStat(this.enemy.chess, 'mr') - this.sumStat(this.player.chess, 'mrShred');
    },
    playerAh(){
      // 己方急速 − 对方「降低敌方急速」类装备的总和（冰霜之心）。
      // 与 playerMr / enemyMr 同一套写法：走 stats 聚合而不是在冷却换算时临时扣减，
      // 属性面板与 setAhRate 读到的始终是同一个值
      return this.sumStat(this.player.chess, 'ah') - this.sumStat(this.enemy.chess, 'ahShred');
    },
    enemyAh(){
      return this.sumStat(this.enemy.chess, 'ah') - this.sumStat(this.player.chess, 'ahShred');
    },
    playerPen(){
      return this.sumStat(this.player.chess, 'pen');
    },
    enemyPen(){
      return this.sumStat(this.enemy.chess, 'pen');
    },
    playerMagicPen(){
      return this.sumStat(this.player.chess, 'magicPen');
    },
    enemyMagicPen(){
      return this.sumStat(this.enemy.chess, 'magicPen');
    },
    /** 玩家物理伤害倍率（1 + 己方物理伤害加成合计/100），面板不展示 */
    playerPhysAmp(){
      return 1 + this.sumStat(this.player.chess, 'physAmp') / 100;
    },
    enemyPhysAmp(){
      return 1 + this.sumStat(this.enemy.chess, 'physAmp') / 100;
    },
    /** 玩家魔法伤害倍率，与物理倍率同构；目前无装备提供，恒为 1 */
    playerMagicAmp(){
      return 1 + this.sumStat(this.player.chess, 'magicAmp') / 100;
    },
    enemyMagicAmp(){
      return 1 + this.sumStat(this.enemy.chess, 'magicAmp') / 100;
    },
    /** 玩家血条样式（血量段 + 护盾段） */
    playerHpBar(){
      return this.calcHpBar(this.player.hp, this.player.shield, this.maxHp);
    },
    /** 敌方血条样式 */
    enemyHpBar(){
      return this.calcHpBar(this.enemy.hp, this.enemy.shield, this.enemyMaxHp);
    },
    playerHealPower(){
      return this.sumStat(this.player.chess, 'healPower');
    },
    enemyHealPower(){
      return this.sumStat(this.enemy.chess, 'healPower');
    },
    /** 玩家属性面板数据源：一行 2 个、共 3 行 */
    playerStatList(){
      return this.buildStatList('player');
    },
    /** 敌方属性面板数据源：与玩家同结构、同顺序 */
    enemyStatList(){
      return this.buildStatList('enemy');
    },
    isWarehouseFull(){
      return this.player.warehouse.every(item => item !== null);
    },
    getFirstWarehouseEmptyIndex(){
      return this.player.warehouse.findIndex(item => item === null);
    },
    canEquip(){
      return this.player.chess.some(item => item === null);
    },
    getFirstItemEmptyIndex(){
      return this.player.chess.findIndex(item => item === null);
    },
    isStorageFull(){
      return this.isWarehouseFull && !this.canEquip;
    },
    incomeTotal(){
      return this.battle.incomeBreakdown.reduce((sum, entry) => sum + entry.amount, 0)
    },
    /** 结算面板-己方统计：按输出降序；数据层保持原序，排序只发生在视图 */
    playerStats(){
      return [...this.battle.stats.player].sort((a, b) => b.damage - a.damage)
    },
    /** 结算面板-敌方统计：按输出降序 */
    enemyStats(){
      return [...this.battle.stats.enemy].sort((a, b) => b.damage - a.damage)
    },
    /** 刷新商店花费，供模板显示与按钮禁用判断 */
    refreshCost(){
      return REFRESH_COST;
    },
    /** 当前点开的装备参与合成的全部配方（递归追溯材料链，口径与合成表筛选一致），
     *  按产物等级升序：二级在前、三级在后。
     *  材料凑没凑齐只影响行内文案，不影响该配方是否列出 */
    maskCraftableRecipes() {
      if (!this.maskItem || !this.showMask) return [];
      const itemId = this.maskItem.itemId;
      return recipes
        .filter(r => recipeContainsItem(r, itemId))
        .sort((a, b) => this.resultLevel(a) - this.resultLevel(b));
    },
    /** 主界面快速合成区：材料与金币都够的配方，三级在前、二级在后——横向排开时最左就是最高级。
     *  gold 是本次点击实际会扣掉的总合成费：中间件要现场合成，那份合成费也得算进去，
     *  照配方表只写产物自己那 2c 会和真实扣款对不上。
     *  战斗中直接返回空——craftItem 开头有同款守卫，展示了也点不动 */
    craftBarItems() {
      if (this.battle.state !== 'idle') return [];
      return recipes
        .map(r => ({ recipe: r, plan: this.planCraft(r) }))
        .filter(entry => entry.plan)
        .sort((a, b) => this.resultLevel(b.recipe) - this.resultLevel(a.recipe))
        .map(entry => ({ recipe: entry.recipe, gold: entry.plan.gold }));
    },
    /** 可合成条目数。只给 watch 用：金币变动也会重算 craftBarItems，
     *  但只有条目增减才需要把横向滚动条推回最左 */
    craftBarCount() {
      return this.craftBarItems.length;
    },
    /** 合成表筛选条上的 8 件一级装备，顺序沿用装备库里的配置顺序 */
    recipeFilterItems() {
      return itemLibrary.filter(item => item.level === 1);
    },
    /** 当前页签的配方，已展开成「每行一个材料」的树（二级 24 条 / 三级 1 条）
     *  这里的 getItemById 是模块作用域那个（找不到返回 undefined），
     *  不是 methods 里返回 {} 兜底的模板版本，所以下面要判 item 存在。 */
    recipes() {
      return recipes
        .filter(r => {
          const item = getItemById(r.resultId);
          if (!item || item.level !== this.recipeTab) return false;
          // 选中一级装备时，只留材料链里用到它的配方（三级会顺着配方树往下追溯）
          return !this.recipeFilter || recipeContainsItem(r, this.recipeFilter);
        })
        .map(r => this.expandRecipe(r));
    }
  },
  watch: {
    /**
     * 上限回落时把当前血量夹到新上限。
     * 心之钢的成长挂在棋子上，装备一卸下 / 出售 / 进仓库，maxHp 会立刻变小；
     * 不夹的话 hp 会停在旧上限上，出现 hp > maxHp 的溢出状态——
     * 血条虽能压缩显示，但后续治疗（heal 里 Math.min(maxHp, ...)）与超时扣血都会读出怪数值。
     * 上限上涨（叠层）时这里不会触发，血量保持不变，正合「只涨上限不回血」
     */
    maxHp(newMax){
      if(this.player.hp > newMax) this.player.hp = newMax
    },
    enemyMaxHp(newMax){
      if(this.enemy.hp > newMax) this.enemy.hp = newMax
    },
    /** 合成区是横向滚动的：三级插在最左，条目一变就把滚动条拉回最左，
     *  免得玩家停在右边、看不到刚冒出来的最高级配方 */
    craftBarCount(){
      this.$nextTick(() => {
        const el = this.$refs.craftBar;
        if (el) el.scrollLeft = 0;
      });
    }
  },
  mounted () {
    // 读取上次保存的战斗倍速，非法值（缺失/被篡改）回退到 1 并写回
    const savedSpeed = Number(localStorage.getItem('mergeSpeed'))
    this.battle.speed = [1, 2, 4].includes(savedSpeed) ? savedSpeed : 1
    localStorage.setItem('mergeSpeed', this.battle.speed)
    this.initEnemy();
    this.grantStartingItems();
    this.refreshShop();
    this.maskItem = this.shop[0]
  },
  beforeDestroy () {
    this.stopBattleLoop();
  },
  methods: {
    /**
     * 汇总某一方棋盘上某条属性的总和
     * 三部分：装备固定 stats + 条件加成 conditionalStats + 每层加成 statsPerStack
     * 敌我双方 14 个属性 computed 都走这里，新增属性只需在装备 stats 里写 key
     * @param {Array} chessList 棋盘上的装备列表
     * @param {string} key 属性名 hp / armor / mr / ah / pen / magicPen / healPower
     * @returns {number}
     */
    sumStat(chessList, key){
      let total = 0;
      chessList.forEach(c => {
        if(!c) return;
        if(c.stats && c.stats[key]){
          total += c.stats[key];
        }
        // 条件加成依赖整份阵容与自身状态（如「没有一二级装备」「层数叠满」），都要传进去
        if(c.conditionalStats){
          const extra = c.conditionalStats(chessList, c);
          if(extra && extra[key]){
            total += extra[key];
          }
        }
        // 每层加成（如千变者贾修）：层数只在本场战斗内累积，resetStacks 后加成自动消失
        if(c.statsPerStack && c.stacks && c.statsPerStack[key]){
          total += c.statsPerStack[key] * c.stacks;
        }
      });
      return total;
    },
    restoreFullHp(){
      this.player.hp = this.maxHp;
    },
    /**
     * 发放并直接装备开局固定赠送的装备（配置见 gameConfig.js 的 STARTING_ITEM_IDS）
     * mounted 与 restartGame 各调一次，保证「首次进入」和「重新开局」表现一致。
     * 收尾自己调一次 restoreFullHp：赠送的装备若带 hp 加成，血量上限要跟着重算
     * @returns {void}
     */
    grantStartingItems(){
      STARTING_ITEM_IDS.forEach((itemId, index) => {
        if(index >= BOARD_SLOTS) return; // 配置写多了就不发，别把棋盘数组撑出稀疏空洞
        const itemData = getItemById(itemId); // 模块作用域那个，找不到返回 undefined
        if(!itemData) return;
        this.$set(this.player.chess, index, new Chess({ ...itemData }));
      });
      this.restoreFullHp();
    },
    /**
     * 组装某一方的属性面板数据
     * 数值全部取自对应的 computed，与伤害结算读到的是同一份，不另算一套
     * 顺序即展示顺序：面板是 3 列 2 行的网格、按行填充，所以
     *   第一行 = 护甲 魔抗 急速
     *   第二行 = 物穿 法穿 治疗
     * @param {'player'|'enemy'} side
     * @returns {Array<{label: string, value: string}>}
     */
    buildStatList(side){
      const isPlayer = side === 'player';
      return [
        { label: '护甲', value: isPlayer ? this.playerArmor : this.enemyArmor },
        { label: '魔抗', value: isPlayer ? this.playerMr : this.enemyMr },
        { label: '急速', value: isPlayer ? this.playerAh : this.enemyAh },
        { label: '物穿', value: isPlayer ? this.playerPen : this.enemyPen },
        { label: '法穿', value: isPlayer ? this.playerMagicPen : this.enemyMagicPen },
        { label: '治疗', value: `${isPlayer ? this.playerHealPower : this.enemyHealPower}%` }
      ];
    },
    /**
     * 计算血条各段宽度：护盾段接在血量段之后
     * 血量+护盾超过最大生命值时按比例压缩，保证两段加起来不溢出
     * @param {number} hp 当前血量
     * @param {number} shield 当前护盾
     * @param {number} maxHp 最大生命值
     * @returns {{hpWidth: string, shieldWidth: string}}
     */
    calcHpBar(hp, shield, maxHp){
      const total = hp + shield;
      const scale = total > maxHp ? maxHp / total : 1;
      return {
        hpWidth: `${hp * scale / maxHp * 100}%`,
        shieldWidth: `${shield * scale / maxHp * 100}%`
      };
    },
    /**
     * 累加某件装备本场战斗的统计值（结算面板用）
     * 按 chess.id 聚合：同名装备是不同实例、id 不同，因此各自独立计分
     * @param {'player'|'enemy'} side 归属阵营
     * @param {Object} chess 来源棋子（需有 id / name / icon）
     * @param {'damage'|'shield'|'heal'} field 统计维度
     * @param {number} amount 累加值
     */
    accumulateStat(side, chess, field, amount){
      if(!chess || !chess.id || amount <= 0) return;
      const list = this.battle.stats[side];
      if(!list) return;
      let entry = list.find(e => e.id === chess.id);
      if(!entry){
        // level 一并带进来：结算面板与整局结束弹窗的装备图标也要按等级上色
        entry = { id: chess.id, name: chess.name, icon: chess.icon, level: chess.level, damage: 0, shield: 0, heal: 0 };
        list.push(entry);
      }
      entry[field] += amount;
    },
    /**
     * 开战时给双方棋盘上每件装备预建一条 0 记录。
     * 统计榜列的是「本场参与过的装备」而非「有数值的装备」：
     * 治疗宝珠一直治疗但血量已满、有效治疗恒为 0，也应当出现在榜上（全 0）。
     * 因此条目在开战瞬间就建好，accumulateStat 只负责往上累加
     */
    initBattleStats(){
      const build = side => this[side].chess
        .filter(c => c && c.id)
        .map(c => ({ id: c.id, name: c.name, icon: c.icon, level: c.level, damage: 0, shield: 0, heal: 0 }));
      this.battle.stats = { player: build('player'), enemy: build('enemy') };
    },
    /**
     * 为角色添加护盾（先于血量承受伤害，战斗开始时清零）
     * @param {Object} target player / enemy
     * @param {number} amount 护盾值
     * @param {Object} [from] 护盾来源棋子，用于结算面板按装备归属（无来源则不记统计）
     */
    addShield(target, amount, from){
      if(amount <= 0) return;
      target.shield = (target.shield || 0) + amount;
      if(from && from.owner) this.accumulateStat(from.owner, from, 'shield', amount);
      this.logBySide(target === this.player ? 'player' : 'enemy',
        `${target === this.player ? '玩家' : '敌方'}获得 ${amount} 点护盾（当前 ${target.shield}）`);
    },
    /**
     * 推迟某一方全部装备的当前剩余冷却（瑞莱的冰晶节杖）
     * 直接加在 currentCooldown 上：只拖慢这一轮的读秒，cooldown / baseCooldown 不变
     * @param {Object} target player / enemy
     * @param {number} seconds 推迟的秒数
     */
    delayCooldown(target, seconds){
      if(seconds <= 0) return;
      const delayed = [];
      target.chess.forEach(c => {
        if(!c || c.cooldown <= 0) return; // 纯被动装备没有冷却轮转
        c.currentCooldown = Math.max(0, c.currentCooldown) + seconds;
        delayed.push(c);
      });
      const names = delayed.map(c => c.name);
      this.logBySide(target === this.player ? 'player' : 'enemy',
        `延迟 ${target === this.player ? '玩家' : '敌方'} ${delayed.length} 件装备冷却 ${seconds}s` +
        (names.length ? `（${names.join('、')}）` : ''));
    },
    /**
     * 加快某一方全部装备的当前剩余冷却（纳沃利烁刃），与 delayCooldown 完全对称：
     * 只减这一轮的读秒，不改 cooldown / baseCooldown，因此不影响下一轮的冷却总长；
     * 减到 0 后该装备会在下一帧立刻触发。纯被动装备（cooldown 为 0）没有冷却轮转，跳过
     * @param {Object} target player / enemy
     * @param {number} seconds 加快的秒数
     * @param {Object} [exclude] 要排除的棋子：纳沃利烁刃的「己方其他装备」不含自身
     */
    hastenCooldown(target, seconds, exclude){
      if(seconds <= 0) return;
      const hastened = [];
      target.chess.forEach(c => {
        if(!c || c === exclude || c.cooldown <= 0) return; // 纯被动装备没有冷却轮转
        c.currentCooldown = Math.max(0, c.currentCooldown - seconds);
        hastened.push(c);
      });
      const names = hastened.map(c => c.name);
      this.logBySide(target === this.player ? 'player' : 'enemy',
        `加快 ${target === this.player ? '玩家' : '敌方'} ${hastened.length} 件装备冷却 ${seconds}s` +
        (names.length ? `（${names.join('、')}）` : ''));
    },
    /**
     * 进入超时：置位双方棋子的超时状态，并按新的技能急速重算冷却
     * 「超时后才给的技能急速」写在装备的 conditionalStats 里（猎魔人弩箭），
     * 而技能急速只在 setAhRate 一处写进棋子的 ahRate——playerAh / enemyAh 变了，
     * 棋子的实际冷却不会自己跟着变，所以状态翻转后必须显式重算一次
     */
    applyOvertime(){
      const sides = [this.player, this.enemy]
      sides.forEach(side => {
        side.chess.forEach(c => { if(c) c.overtime = true })
        // 先置位再读 ah：conditionalStats 拿到的才是超时后的值
        side.chess.forEach(c => {
          if(c) c.setAhRate(side === this.player ? this.playerAh : this.enemyAh)
        })
      })
    },
    // 血条下方的数值：当前血量 / 最大生命值。
    // 护盾不在这里拼——模板里单独一个 span 上色，好跟血条上的护盾段对上
    hpInfoFormat(){
      return `${this.player.hp}/${this.maxHp}`;
    },
    enemyHpInfoFormat(){
      return `${this.enemy.hp}/${this.enemyMaxHp}`;
    },
    initEnemy(){
      const { chess, basicHp } = buildEnemyLineup(
        this.battle.currentRound,
        this.battle.totalRounds
      )
      this.enemy.basicHp = basicHp
      this.enemy.chess = chess
      this.enemy.hp = this.enemyMaxHp
    },
    cooldownStyle(item){
      const ratio = item.cooldown > 0 ? item.currentCooldown / item.cooldown : 0
      const angle = (1 - ratio) * 360
      return {
        '--angle': `${angle}deg`
      }
    },
    /** 是否显示层数角标：maxStacks 为 0 表示该装备没有层数系统 */
    showStackBadge(item){
      return !!item && item.maxStacks !== 0 && item.stacks > 0
    },
    /**
     * 加成此刻是否生效 → 决定是否点亮金色边框
     * 三种来源：
     *   1. conditionalStats 返回非 null（破舰者的全三级阵容、裂隙制造者的满层）
     *   2. glowOnOvertime 且已进超时（基克的聚合）——它不加属性，只在超时期间有被动在跑
     * 而 noGlow 是显式豁免：conditionalStats 恒非空但没有「生效 / 不生效」之分的装备
     * （界弓按形态给穿透），不会亮
     * @param {Object} item 棋子
     * @param {Array} chessList 它所在的那一方棋盘
     * @returns {boolean}
     */
    isBonusActive(item, chessList){
      if(!item) return false;
      if(item.noGlow) return false;
      if(item.conditionalStats && item.conditionalStats(chessList, item)) return true;
      return !!item.glowOnOvertime && this.battle.timeLeft < 0;
    },
    toggleSpeed(){
      const map = {1: 2, 2: 4, 4: 1}
      this.battle.speed = map[this.battle.speed]
      localStorage.setItem('mergeSpeed', this.battle.speed)
    },
    startBattle(){
      if(this.battle.state !== 'idle') return

      // 清掉上一场残留的超时状态。超时类被动按「本场是否超时」生效，
      // 必须在下面按技能急速重算冷却（setAhRate）之前清，否则上一场的 +30 会带进这一场
      const clearOvertime = c => { if(c) c.overtime = false }
      this.player.chess.forEach(clearOvertime)
      this.enemy.chess.forEach(clearOvertime)

      // 重置双方血量与护盾
      this.player.hp = this.maxHp
      this.enemy.hp = this.enemyMaxHp
      this.player.shield = 0
      this.enemy.shield = 0

      // 重置本场装备统计：给棋盘上每件装备预建 0 记录。
      // 必须在下面广播 onBattleStart 之前建好：开场类装备（如钢铁烈阳之匣上盾）
      // 会在那一刻累加，条目得先存在。见 initBattleStats 的说明
      this.initBattleStats()

      // 应用技能急速，锁定双方阵容，初始化战斗状态
      this.player.chess.forEach(c => {
        if(c) c.setAhRate(this.playerAh)
      })
      this.player.chess.forEach((c, i) => {
        if(c){
          c.setOwner('player')
          c.setPosition(i)
          c.startBattle()
        }
      })
      this.enemy.chess.forEach(c => {
        if(c) c.setAhRate(this.enemyAh)
      })
      this.enemy.chess.forEach((c, i) => {
        if(c){
          c.setOwner('enemy')
          c.setPosition(i)
          c.startBattle()
        }
      })

      // 双方阵容锁定、冷却就绪后再广播开战：
      // 开场类装备效果要读的正是此刻的属性汇总（如败魔按魔抗给盾），所以必须排在最后
      this.emitHooks('onBattleStart', 'player')
      this.emitHooks('onBattleStart', 'enemy')

      this.battle.state = 'fighting'
      this.battle.lastTime = performance.now()
      this.battle.timeLeft = this.battle.timeLimit
      this.battle.overtimeSeconds = 0
      this.battleLoopId = requestAnimationFrame(this.battleLoop)
    },
    stopBattleLoop(){
      if(this.battleLoopId){
        cancelAnimationFrame(this.battleLoopId)
        this.battleLoopId = null
      }
    },
    battleLoop(now){
      if(this.battle.state !== 'fighting') return

      const realDt = Math.min((now - this.battle.lastTime) / 1000, 0.1)
      this.battle.lastTime = now
      this.updateBattle(realDt * this.battle.speed)

      if(this.battle.state === 'fighting'){
        this.battleLoopId = requestAnimationFrame(this.battleLoop)
      }
    },
    updateBattle(dt){
      this.battle.timeLeft -= dt

      // 超时伤害：每秒递增的最大生命值百分比真实伤害
      if (this.battle.timeLeft < 0) {
        const oldOvertime = this.battle.overtimeSeconds || 0
        this.battle.overtimeSeconds = Math.abs(this.battle.timeLeft)

        const oldSecond = Math.floor(oldOvertime)
        const newSecond = Math.floor(this.battle.overtimeSeconds)

        // 首次跨过 0 秒（上一帧还在计时内）：置位双方棋子的超时状态并重算技能急速。
        // 猎魔人弩箭「超时后 +30 急速」这类被动到这一刻才真正写进冷却
        if (oldOvertime <= 0) {
          this.applyOvertime()
        }

        // 跨过整数秒边界 → 触发对应百分比的真实伤害
        if (newSecond > oldSecond) {
          for (let sec = oldSecond + 1; sec <= newSecond; sec++) {
            // 第 N 秒 = N × 每秒百分比 的最大生命值
            const pct = sec * OVERTIME_DAMAGE_PERCENT_PER_SECOND
            // console.log(`超时第${sec}秒：双方受到${pct}%最大生命值真实伤害`)
            this.dealDamage({name: '超时'}, this.enemy, Math.floor(this.enemyMaxHp * pct / 100), 'true')
            this.dealDamage({name: '超时'}, this.player, Math.floor(this.maxHp * pct / 100), 'true')

            // 超时期间每秒触发的装备效果（基克的聚合）。
            // 走 ctx.dealDamage 且 from 是棋子本身，所以它算「装备造成的伤害」，
            // 会正常触发反伤等连锁——与超时系统伤害（from 无 owner、刻意不触发钩子）区分开
            this.emitHooks('onOvertimeTick', 'player', { overtimeSecond: sec })
            this.emitHooks('onOvertimeTick', 'enemy', { overtimeSecond: sec })
          }
        }
      }

      const ctx = this.buildBattleContext()

      this.player.chess.forEach(chess => {
        if(chess) chess.update(dt, ctx)
      })
      this.enemy.chess.forEach(chess => {
        if(chess) chess.update(dt, ctx)
      })

      // 判定胜负：平局算玩家失败
      if(this.enemy.hp <= 0 && this.player.hp > 0){
        this.endBattle('win')
      } else if(this.player.hp <= 0){
        this.endBattle('lose')
      }
    },
    buildBattleContext(){
      return {
        player: this.player,
        enemy: this.enemy,
        getOpponent: (chess) => {
          return chess.owner === 'player' ? this.enemy : this.player
        },
        dealDamage: (from, target, amount, damageType, isBonus) => {
          return this.dealDamage(from, target, amount, damageType, isBonus)
        },
        heal: (target, amount, from, isBonus) => {
          this.heal(target, amount, from, isBonus)
        },
        addShield: (target, amount, from) => {
          this.addShield(target, amount, from)
        },
        /**
         * 推迟某一方全部装备的当前剩余冷却（瑞莱的冰晶节杖）
         * 只推「这一轮还要等多久」，不改 cooldown / baseCooldown，因此不影响下一轮的冷却总长；
         * 纯被动装备（cooldown 为 0）没有冷却轮转，跳过
         * @param {Object} target player / enemy
         * @param {number} seconds 推迟的秒数
         */
        delayCooldown: (target, seconds) => {
          this.delayCooldown(target, seconds)
        },
        /**
         * 加快某一方全部装备的当前剩余冷却（纳沃利烁刃），与 delayCooldown 对称
         * @param {Object} target player / enemy
         * @param {number} seconds 加快的秒数
         * @param {Object} [exclude] 要排除的棋子（「己方其他装备」不含自身）
         */
        hastenCooldown: (target, seconds, exclude) => {
          this.hastenCooldown(target, seconds, exclude)
        },
        /**
         * 取某一方当前持有的金币，供按金币数折算数值的装备使用（夺萃之镰）
         * 只有玩家有金币，敌方没有 money 字段，一律按 0 返回
         * @param {Object} target player / enemy
         * @returns {number}
         */
        getMoney: (target) => {
          return target === this.player ? this.player.money : 0
        },
        /**
         * 取角色当前的最大生命值（含棋盘上全部装备的 hp 加成与成长）
         * @param {Object} target player / enemy
         * @returns {number}
         */
        getMaxHp: (target) => {
          return target === this.player ? this.maxHp : this.enemyMaxHp
        },
        /**
         * 取角色当前魔抗（含全部装备加成），供按魔抗折算数值的装备使用（如败魔的护盾量）
         * @param {Object} target player / enemy
         * @returns {number}
         */
        getMr: (target) => {
          return target === this.player ? this.playerMr : this.enemyMr
        },
        /**
         * 取角色当前护甲（含全部装备加成），与 getMr 对称，
         * 供需要比较敌我双方抗性的装备使用（如界弓挑低的那一项）
         * @param {Object} target player / enemy
         * @returns {number}
         */
        getArmor: (target) => {
          return target === this.player ? this.playerArmor : this.enemyArmor
        },
        /**
         * 取某一方当前的法术穿透（含全部装备加成），供按法穿折算数值的装备使用（如蜕生的回血量）
         * 与 getMr / getArmor 对称：只读聚合值，不回写任何属性，因此不会与
         * 「装备的战力取决于自身穿透」形成自激循环
         * @param {Object} target player / enemy
         * @returns {number}
         */
        getMagicPen: (target) => {
          return target === this.player ? this.playerMagicPen : this.enemyMagicPen
        },
        /**
         * 输出一条带阵营颜色的战斗日志，供装备效果记录自身行为
         * （如心之钢叠层时的「最大生命值上限 +N」）
         * @param {'player'|'enemy'|null} side 日志所属阵营
         * @param {string} text 日志内容
         */
        log: (side, text) => {
          this.logBySide(side, text)
        },
        /**
         * 增加玩家生命（心），本局内有效（守护天使出售时 +1）
         * 只有玩家有生命值，敌人不参与「心」的结算，因此不接收 target 参数
         * @param {number} amount 增加的点数
         */
        addLife: (amount) => {
          if (amount <= 0) return
          this.player.lives += amount
          this.logBySide('player', `玩家获得 ${amount} 颗心（当前 ${this.player.lives}）`)
        },
        /**
         * 立即给某一方加金币（卢登的回声的连击奖励）
         * 与 addIncome 分属两条路：addIncome 只写明细、由 continueGame 统一发放；
         * addMoney 直接改 player.money，战斗中途就能被夺萃之镰读到，因此不写明细，
         * 也就不会被 continueGame 按 incomeTotal 再发一次。
         * 只有玩家有 money 字段，敌方传入时静默忽略
         * @param {Object} target player / enemy
         * @param {number} amount 增加的金币数
         */
        addMoney: (target, amount) => {
          if (target !== this.player || amount <= 0) return
          this.player.money += amount
          this.logBySide('player', `玩家获得 ${amount}c（当前 ${this.player.money}）`)
        },
        /**
         * 记录一笔战斗结束收入（只入明细面板，不直接改金币）
         * 金币统一由 continueGame 按 incomeTotal 发放；若钩子里直接加钱，
         * 会和明细面板的合计重复计算
         */
        addIncome: (name, amount) => {
          this.battle.incomeBreakdown.push({ name, amount })
        },
        /**
         * 随机发一件一级装备给玩家（时光之杖的回合结算奖励）
         * @param {string} sourceName 来源装备名，仅用于日志
         */
        grantRandomLevel1Item: (sourceName) => {
          this.grantRandomLevel1Item(sourceName)
        }
      }
    },
    /**
     * 按阵营输出带颜色的日志：玩家方绿色、敌方红色，阵营为空的（超时等系统伤害）保持默认色
     * @param {'player'|'enemy'|null} side 日志所属阵营
     * @param {string} text 日志内容
     */
    logBySide(side, text){
      logBySide(side, text)
    },
    /**
     * 取攻击方阵营的伤害倍率
     * 物理 / 魔法各一条，初始 1.0；真实伤害与无 owner 的系统伤害（超时）恒为 1
     * @param {Object} from 伤害来源棋子
     * @param {string} damageType physical / magic / true
     * @returns {number} 倍率，1 表示不增不减
     */
    getDamageAmp(from, damageType){
      if(!from || !from.owner) return 1;
      const isPlayer = from.owner === 'player';
      if(damageType === 'physical') return isPlayer ? this.playerPhysAmp : this.enemyPhysAmp;
      if(damageType === 'magic') return isPlayer ? this.playerMagicAmp : this.enemyMagicAmp;
      return 1;
    },
    /**
     * 造成伤害
     * @param {Object} from 伤害来源（棋子，或 {name:'超时'} 这类无 owner 的系统伤害）
     * @param {Object} target 受击方（player / enemy）
     * @param {number} amount 伤害数值
     * @param {string} damageType physical / magic / true
     * @param {boolean} [isBonus] 是否为「附加伤害」
     *   附加伤害只结算数值，不再触发造成伤害方的 onDealDamage 钩子。
     *   否则海克斯科技发电机的附加伤害会把自己再触发一次，无限递归。
     *   注意：这不影响反甲反伤、反曲之弓一次打两种伤害——它们都是主动伤害，该触发几次就触发几次。
     *   伤害结算顺序：先扣护盾，护盾吸收完仍有剩余才扣血量。
     * @returns {number} 实际造成的伤害（含被护盾吸收的部分，吸血等按此计算）
     */
    dealDamage(from, target, amount, damageType, isBonus = false){
      // 伤害倍率：在敌方抗性减伤「之前」先乘，物理 / 魔法各一条，真实伤害不吃。
      // 初始 1.0，由无尽之刃这类装备的 physAmp 抬起来
      let damage = amount * this.getDamageAmp(from, damageType)
      // 物理伤害按护甲减伤：护甲/(护甲+RESIST_CONSTANT)，攻击方的穿甲减少对方有效护甲
      if(damageType === 'physical'){
        let armor = target === this.player ? this.playerArmor : this.enemyArmor
        const pen = from && from.owner === 'player' ? this.playerPen : (from && from.owner === 'enemy' ? this.enemyPen : 0)
        // 有效抗性下限见 MIN_EFFECTIVE_RESIST：穿透压穿抗性后仍有收益，但不会走到除零点
        armor = Math.max(MIN_EFFECTIVE_RESIST, armor - pen)
        damage = damage * (1 - armor / (armor + RESIST_CONSTANT))
      }
      // 魔法伤害按魔抗减伤：魔抗/(魔抗+RESIST_CONSTANT)，与护甲公式相同；攻击方的法穿减少对方有效魔抗
      if(damageType === 'magic'){
        let mr = target === this.player ? this.playerMr : this.enemyMr
        const magicPen = from && from.owner === 'player' ? this.playerMagicPen : (from && from.owner === 'enemy' ? this.enemyMagicPen : 0)
        // 与护甲同一条下限，见 MIN_EFFECTIVE_RESIST
        mr = Math.max(MIN_EFFECTIVE_RESIST, mr - magicPen)
        damage = damage * (1 - mr / (mr + RESIST_CONSTANT))
      }
      damage = Math.floor(Math.max(0, damage))

      // 先扣护盾，护盾吸收完还有剩余才扣血量
      const shieldBefore = target.shield || 0
      const hpBefore = target.hp
      const absorbed = Math.min(shieldBefore, damage)
      target.shield = shieldBefore - absorbed
      target.hp = Math.max(0, hpBefore - (damage - absorbed))
      // 结算面板：输出记「实际生效量」= 打掉的盾 + 扣掉的血，残血最后一刀的溢出不计入。
      // 这样胜方恒等式才成立：总输出 = 败方血量上限 + 败方护盾 + 败方有效治疗。
      // 无 owner 的系统伤害（超时）不归属任何装备，直接跳过
      if(from && from.owner){
        const effective = (shieldBefore - target.shield) + (hpBefore - target.hp);
        this.accumulateStat(from.owner, from, 'damage', effective);
      }
      // 伤害日志上色：玩家方绿色、敌方红色、无 owner 的超时等系统伤害保持默认黑色
      this.logBySide(from && from.owner,
        `${from.name} 对 ${target === this.player ? '玩家' : '敌方'}造成 ${damage} 点${damageType}伤害` +
        (absorbed > 0 ? `（护盾吸收 ${absorbed}）` : ''))

      // 触发造成伤害方棋子的 onDealDamage 钩子（每次伤害事件各触发一次）
      // - 超时系统伤害 from={name:'超时'} 无 owner，跳过
      // - isBonus 的附加伤害不再触发，防止递归
      // 额外把 damageType 塞进 ctx：残疫这类要按伤害类型计数的装备得知道这一发是什么伤害
      if (from && from.owner && !isBonus) {
        const fromChess = from.owner === 'player' ? this.player.chess : this.enemy.chess
        const ctx = { ...this.buildBattleContext(), damageType }
        fromChess.forEach(c => {
          if (c) c.emitHook('onDealDamage', ctx)
        })
      }

      // 触发受击方棋子的 onDamaged 钩子
      // - 只有来自棋子的伤害才触发（超时系统伤害 from={name:'超时'} 无 owner，跳过）
      // - 用 _processingOnDamaged 防止反伤触发反伤导致无限循环
      if (from && from.owner && !this._processingOnDamaged) {
        this._processingOnDamaged = true
        const targetChess = target === this.player ? this.player.chess : this.enemy.chess
        const ctx = this.buildBattleContext()
        targetChess.forEach(c => {
          if (c) c.emitHook('onDamaged', ctx)
        })
        this._processingOnDamaged = false
      }

      return damage
    },
    /**
     * 治疗：直接把血量加上去，不吃护甲 / 魔抗
     * @param {Object} target player / enemy
     * @param {number} amount 治疗量（未计治疗强度）
     * @param {Object} from 治疗来源棋子，决定吃哪一方的治疗强度（无来源时按 0% 算）
     * @param {boolean} [isBonus] 是否为附加治疗（月石再生器那额外的 3 点）：
     *        附加治疗不再触发 onHeal 钩子，避免「治疗 → 触发钩子 → 再治疗」无限递归，
     *        与 dealDamage 的 isBonus 同一套手法
     */
    heal(target, amount, from, isBonus = false){
      // 治疗强度提升：来源所属阵营的 healPower 总和，每点 +1%
      let healPower = 0
      if (from && from.owner === 'player') {
        healPower = this.playerHealPower
      } else if (from && from.owner === 'enemy') {
        healPower = this.enemyHealPower
      }
      const modifiedAmount = Math.floor(amount * (1 + healPower / 100))
      const maxHp = target === this.player ? this.maxHp : this.enemyMaxHp
      const hpBefore = target.hp
      target.hp = Math.min(maxHp, hpBefore + modifiedAmount)
      // 结算面板：治疗只记「实际回上的血」，满血时的过量治疗不计。
      // 与 dealDamage 的有效伤害同一口径，保证胜方恒等式成立
      if(from && from.owner) this.accumulateStat(from.owner, from, 'heal', target.hp - hpBefore);
      if (modifiedAmount > 0) {
        this.logBySide(target === this.player ? 'player' : 'enemy',
          `治疗 ${target === this.player ? '玩家' : '敌方'} ${modifiedAmount} 点生命值` +
          (healPower > 0 ? `（治疗强度 ${healPower}%）` : ''))
      }

      // 触发治疗来源方棋子的 onHeal 钩子（每次治疗事件各触发一次）
      // - 无 from 的治疗（系统治疗）跳过
      // - isBonus 的附加治疗不再触发，防止「治疗 → 钩子 → 再治疗」无限递归
      // 治疗强度对额外治疗同样生效（月石再生器的 3 点也会被 healPower 放大），
      // 这是刻意的：治疗强度本就该放大该阵营的所有治疗量
      if (from && from.owner && !isBonus) {
        const fromChess = from.owner === 'player' ? this.player.chess : this.enemy.chess
        const ctx = this.buildBattleContext()
        fromChess.forEach(c => {
          if (c) c.emitHook('onHeal', ctx)
        })
      }
    },
    buildIncomeBreakdown(isWin){
      const breakdown = []
      breakdown.push({ name: '基础收入', amount: BASE_INCOME })
      breakdown.push({
        name: isWin ? '胜利奖励' : '失败补偿',
        amount: isWin ? WIN_BONUS : LOSE_BONUS
      })
      // 先赋值，装备的 onBattleEnd 钩子会通过 ctx.addIncome 往这个数组里追加自己的收入
      this.battle.incomeBreakdown = breakdown

      // isWin 一并广播：无穷饥渴这类「战斗胜利后才叠层」的装备要在钩子里判胜负
      this.emitHooks('onBattleEnd', 'player', { isWin })
    },
    endBattle(result){
      this.battle.state = 'finished'
      this.stopBattleLoop()

      // 清除所有装备的冷却与层数显示
      const allChess = [...this.player.chess, ...this.enemy.chess].filter(Boolean)
      allChess.forEach(c => {
        c.currentCooldown = 0
        // 超时状态属于本场战斗：收回来，否则「超时后才有加成」的边框（猎魔人弩箭）
        // 会一直亮到下一场开战
        c.overtime = false
        // 跨回合叠层的装备（心之钢、时光之杖、无穷饥渴）层数要留下，战斗内叠层的照常清零
        if (!c.keepStacks) c.resetStacks()
      })

      // 计算本回合收入明细
      this.buildIncomeBreakdown(result === 'win')

      const resultMap = {
        win: '胜利',
        lose: '失败'
      }
      this.battleResult = resultMap[result]
      console.log(`战斗结束，结果：${resultMap[result]}`)

      // 这一败会把生命扣光 → 整局已经结束，跳过回合统计面板直接进结束窗
      // （收入照常结算，只是不再展示明细）
      if(result === 'lose' && this.player.lives <= 1){
        this.continueGame()
        return
      }

      // 最后一回合获胜 = 通关：也不弹回合结算，直接进整局胜利窗。
      // 否则玩家会先看一遍最后一波的统计，点继续后又看到一模一样的整局窗，纯属重复
      if(result === 'win' && this.battle.currentRound >= this.battle.totalRounds){
        this.continueGame()
        return
      }

      this.showResult = true
    },
    /**
     * 广播事件，触发指定阵营场上所有装备的对应钩子
     * @param {string} eventName 事件名
     * @param {'player'|'enemy'} owner 只广播该阵营的棋子
     * @param {Object} extraCtx 附加上下文
     */
    emitHooks(eventName, owner, extraCtx = {}){
      const ctx = {
        ...this.buildBattleContext(),
        ...extraCtx
      }
      // 先快照再遍历：时光之杖的 onBattleEnd 会往棋盘里塞一件新装备，
      // 直接遍历原数组的话这件新装备会被同一轮 forEach 顺带触发它的 onBattleEnd
      //（蓝水晶 / 万世催化石这类一旦被「顺带」执行就凭空多一笔收入）
      const chess = (owner === 'enemy' ? this.enemy.chess : this.player.chess).slice()
      chess.forEach(c => { if (c) c.emitHook(eventName, ctx) })
    },
    continueGame(){
      // 统一加上弹窗里算好的总收入（包含基础、胜负、装备特效）
      this.player.money += this.incomeTotal

      if(this.battleResult === '失败'){
        this.player.lives--
        // 失败时保留敌人阵容，仅重置血量，让玩家感觉是重新挑战同一个敌人
        // 顺带把敌人心之钢的成长打回初始（重打的是同一批棋子实例，成长不会自己消失），
        // 须在读取 enemyMaxHp 之前。直接赋 stacks 而不走 resetStacks：心之钢的层数
        // 只折算生命值，不影响冷却，没必要顺带重算 effectiveBaseCooldown
        this.enemy.chess.forEach(c => { if(c && c.itemId === 'heartsteel') c.stacks = 0 })
        this.enemy.hp = this.enemyMaxHp
        // 不调用 startBattle()：战斗开始时组件方法 startBattle() 会统一初始化双方冷却
        // 否则冷却数值会显示在界面上，造成"未战斗却有冷却读秒"的错觉
      } else {
        // 胜利时推进回合
        this.battle.currentRound++
      }

      // 整局结束判定：心用完 → 失败；清完全部回合 → 胜利
      // 结束后不再刷新敌人阵容，也不进入商店阶段
      if(this.player.lives <= 0){
        this.endGame('lose')
        return
      }
      if(this.battle.currentRound > this.battle.totalRounds){
        this.endGame('win')
        return
      }

      // 商店阶段：刷新敌人阵容、回满玩家血量、清空双方护盾、刷新商品
      if(this.battleResult !== '失败'){
        this.initEnemy()
      }
      this.restoreFullHp()
      this.player.shield = 0
      this.enemy.shield = 0
      this.refreshShop()
      this.battle.state = 'idle'
      this.battle.timeLeft = this.battle.timeLimit
      this.showResult = false
    },
    /**
     * 整局结束
     * @param {'win'|'lose'} result win = 清完全部回合；lose = 生命耗尽
     */
    endGame(result){
      this.battle.state = 'finished'
      this.stopBattleLoop()
      this.showResult = false
      this.showMask = false
      this.showRecipeBook = false
      this.showItemDetail = false
      this.detailItem = null
      this.gameOverResult = result
      this.showGameOver = true
      console.log(result === 'win'
        ? `通关！共 ${this.battle.totalRounds} 回合`
        : `游戏结束：生命耗尽，止步第 ${this.battle.currentRound} 回合`)
    },
    /**
     * 重新开局：把整局状态恢复到初始值
     */
    restartGame(){
      this.stopBattleLoop()

      // 关闭全部弹窗
      this.showGameOver = false
      this.showResult = false
      this.showMask = false
      this.showRecipeBook = false
      this.showItemDetail = false
      this.detailItem = null
      this.gameOverResult = ''
      this.battleResult = ''
      this.maskItem = null

      // 重置玩家：金币、生命、护盾、棋盘与仓库
      this.player.money = INITIAL_MONEY
      this.player.lives = INITIAL_LIVES
      this.player.shield = 0
      this.player.chess = Array(BOARD_SLOTS).fill(null)
      this.player.warehouse = Array(WAREHOUSE_SLOTS).fill(null)

      // 重置回合与战斗状态
      this.enemy.shield = 0
      this.battle.currentRound = 1
      this.battle.state = 'idle'
      this.battle.timeLeft = this.battle.timeLimit
      this.battle.overtimeSeconds = 0
      this.battle.lastTime = 0
      this.battle.incomeBreakdown = []
      this.battle.stats = { player: [], enemy: [] }

      // 棋盘清空后再算血量上限，否则 maxHp 还是上一局装备撑起来的
      this.initEnemy()
      this.restoreFullHp()
      this.grantStartingItems() // 发开局赠送装备，内部会再算一次上限（幂等）
      // 重置商店与一级池。清空 shop 这一步不能省：refreshShop 开头会把「当前 shop 里未售出的
      // 一级格」还回池子，而此时 this.shop 还停留在上一局结束时的数组，不清就是往新池子白灌最多 7 件
      this.shop = Array(getShopSlots(1)).fill(null)
      this.itemPool = createItemPool()
      this.refreshShop()
      this.maskItem = this.shop[0]
    },
    openMask(item, type){
      this.maskItem = item;
      this.maskType = type;
      this.showMask = true;
    },
    buyChess(){
      if(this.battle.state === 'fighting') return;
      if(this.player.money >= this.maskItem.price && !this.isStorageFull){
        this.player.money -= this.maskItem.price;
        // 优先装备到身上，满了再放入仓库
        if(this.canEquip){
          this.$set(this.player.chess, this.getFirstItemEmptyIndex, this.maskItem);
          this.restoreFullHp();
        } else {
          this.$set(this.player.warehouse, this.getFirstWarehouseEmptyIndex, this.maskItem);
        }
        // 根据唯一 id 找到商店中对应的商品并置空（不能用 name，商店里可能同名）
        const index = this.shop.findIndex(item => item && item.id === this.maskItem.id);
        if(index !== -1){
          this.$set(this.shop, index, null);
        }
        this.showMask = false;
      }
    },
    refreshShopBtn(){
      if(this.battle.state === 'fighting') return;
      if(this.player.money >= REFRESH_COST){
        this.player.money -= REFRESH_COST;
        this.refreshShop();
      }
    },
    equipChess(){
      if(this.battle.state === 'fighting') return;
      if(!this.canEquip) return;
      const fromIndex = this.player.warehouse.findIndex(item => item && item.id === this.maskItem.id);
      const toIndex = this.getFirstItemEmptyIndex;
      if(fromIndex === -1 || toIndex === -1) return;
      this.$set(this.player.chess, toIndex, this.maskItem);
      this.$set(this.player.warehouse, fromIndex, null);
      this.restoreFullHp();
      this.showMask = false;
    },
    sellChess(){
      if(this.battle.state === 'fighting') return;
      const index = this.player.warehouse.findIndex(item => item && item.id === this.maskItem.id);
      if(index === -1) return;
      // 返还的是装备价值，不是商店买入价：二级以上装备的买入价含「免凑材料」的溢价
      this.player.money += this.maskItem.value;
      // 卖出即把材料还给商店池：一级还 1 件，二级 / 三级沿配方树拆成一级材料归还。
      // 不区分来源，商店直接买来的二级也照样拆，所以池子允许超过初始值
      returnItemToPool(this.itemPool, this.maskItem.itemId);
      // 出售时才生效的钩子（守护天使 +1 生命）。只信任仓库里那件，所以先广播再清格子
      this.maskItem.emitHook('onSell', this.buildBattleContext());
      this.$set(this.player.warehouse, index, null);
      this.showMask = false;
    },
    /** 商店池里某件装备的剩余库存，供浮窗展示；二级 / 三级不在池子里，恒为 0 */
    poolRemaining(itemId){
      return this.itemPool[itemId] || 0;
    },
    /**
     * 装备图标的等级边框 class：二级蓝、三级橙，一级返回空串（沿用灰色默认描边）
     *
     * 参数兼容两类数据：棋盘 / 仓库 / 商店里的 Chess 实例、以及 itemLibrary 的静态配置
     * （合成表与筛选条给的）——两者都有 level。传 null / undefined（如空格子、浮窗未开）时返回空串。
     * @param {Object|null} item 装备实例或装备配置
     * @returns {string} 'lv-2' | 'lv-3' | ''
     */
    levelClass(item){
      if(!item) return '';
      return item.level >= 2 ? `lv-${item.level}` : '';
    },
    unequipChess(){
      if(this.battle.state === 'fighting') return;
      if(this.isWarehouseFull) return;
      const fromIndex = this.player.chess.findIndex(item => item && item.id === this.maskItem.id);
      const toIndex = this.getFirstWarehouseEmptyIndex;
      if(fromIndex === -1 || toIndex === -1) return;
      this.$set(this.player.warehouse, toIndex, this.maskItem);
      this.$set(this.player.chess, fromIndex, null);
      this.restoreFullHp();
      this.showMask = false;
    },
    refreshShop () {
      // 1. 先把上一批没卖出去的一级格还回池子。
      //    必须在重建数组之前——格数变化时旧数组会被整个丢掉，那批格子抽取时预留出去的库存就漏了
      releaseShopToPool(this.itemPool, this.shop)

      // 2. 商店格数随回合变化，先把数组长度对齐到当前回合的格数
      const slots = getShopSlots(this.battle.currentRound)
      if (this.shop.length !== slots) {
        this.shop = Array(slots).fill(null)
      }

      // 3. 逐格抽：每格独立按当前回合的等级权重掷等级，一级再按池子剩余库存加权抽
      for (let i = 0; i < this.shop.length; i++) {
        const itemData = drawItem(this.battle.currentRound, this.itemPool)
        // 抽取即预留。扣减必须紧跟本次抽取、早于下一次抽取，否则同一件稀缺装备会被多个格子同时抽中。
        // 这里是全局唯一的扣减点（drawItem 只读池子），购买时不再重复扣
        if (itemData.level === 1 && this.itemPool[itemData.id] > 0) {
          this.itemPool[itemData.id] -= 1
        }
        const chess = new Chess({
          ...itemData
        })
        this.$set(this.shop, i, chess)
      }

      // 4. 关掉浮窗：maskItem 指向的是上一批的实例，那批的池子额度已经还回去了。
      //    留着它继续购买会出现「扣了钱、装备进了棋盘，但商店里那格找不到、池子也早已退款」的白送
      this.showMask = false
    },
    /** 获取玩家所有装备（装备栏+仓库）的 itemId → 数量 映射 */
    getItemCounts() {
      const counts = {};
      [...this.player.chess, ...this.player.warehouse].forEach(item => {
        if (item && item.itemId) {
          counts[item.itemId] = (counts[item.itemId] || 0) + 1;
        }
      });
      return counts;
    },
    /**
     * 把一条配方展开成「行」数组，供合成表渲染。
     *
     * 分行规则：合成材料各自独占一行（每行后面要接它自己的展开式），
     * 一级材料全部并进末行——它们没有可展开的东西，分行只会把
     * 「晶体护腕 = 红水晶 + 治疗宝珠」这种两条目配方撑成两行。
     *
     * 例：三相之力（掘道钻头 + 狂热 + 考尔菲德的战锤 + 2c）→ 材料全是合成的，
     *     末行是合成材料行，产物那份合成费另起一行：
     * {
     *   resultId: 'trinity_force',
     *   rows: [
     *     { icons: ['tunneler'],             leaves: ['ruby_crystal','long_sword'], goldCost: 2, productGold: 0 },
     *     { icons: ['zeal'],                 leaves: ['long_sword','long_sword'],   goldCost: 2, productGold: 0 },
     *     { icons: ['caulfields_warhammer'], leaves: ['long_sword','glowing_mote'],   goldCost: 2, productGold: 0 },
     *     { icons: [],                    leaves: null, goldCost: 0, productGold: 2 }
     *   ]
     * }
     * 荆棘之甲（守望者铠甲 + 荆棘背心 + 红水晶 + 2c）→ 末行是一级材料行，
     *     产物合成费直接贴上去，一级装备和 2c 同一行：
     * {
     *   resultId: 'thornmail',
     *   rows: [
     *     { icons: ['wardens_mail'],  leaves: ['cloth_armor','cloth_armor'], goldCost: 2, productGold: 0 },
     *     { icons: ['bramble_vest'],  leaves: ['ruby_crystal','cloth_armor'], goldCost: 2, productGold: 0 },
     *     { icons: ['ruby_crystal'],  leaves: null, goldCost: 0, productGold: 2 }
     *   ]
     * }
     * 二级装备（巨人腰带 = 红水晶×2 + 2c）只有一行：
     *   rows: [{ icons: ['ruby_crystal','ruby_crystal'], leaves: null, goldCost: 0, productGold: 2 }]
     *
     * goldCost / productGold 必须分开存：前者是「该材料自己」的合成费，
     * 跟在它的展开式后面；后者是「产物」的合成费，跟在整行最后。
     *
     * [限制] 只支持两层展开（正好覆盖当前最深的 3 级装备）。leaves 里不再往下拆，
     *        所以将来出现四级装备时，这里和模板都要一并改成递归渲染。
     */
    expandRecipe(recipe) {
      return {
        resultId: recipe.resultId,
        rows: this.buildRows(recipe.materials, recipe.goldCost || 0)
      };
    },
    /**
     * 把一个配方的 materials 摊成行数组，分行规则见 expandRecipe 注释
     * @param {Array} materials 形如 [{ id, count }]
     * @param {number} productGold 产物自己的合成费，挂在末行
     */
    buildRows(materials, productGold) {
      const leafIcons = []; // 一级材料没有配方可展开，先攒着并到末行
      const synthRows = []; // 合成材料各占一行
      (materials || []).forEach(mat => {
        const sub = getRecipeByResultId(mat.id);
        const count = mat.count || 1;
        if (sub) {
          // 该材料自己也是合成的：拆成 count 行，每行单独接它的展开式
          for (let i = 0; i < count; i++) {
            synthRows.push({
              icons: [mat.id],
              leaves: this.expandIcons(sub.materials),
              goldCost: sub.goldCost || 0,
              productGold: 0
            });
          }
        } else {
          for (let i = 0; i < count; i++) leafIcons.push(mat.id);
        }
      });
      // 末行不带展开式：一级材料没有配方
      const rows = leafIcons.length
        ? synthRows.concat([{ icons: leafIcons, leaves: null, goldCost: 0, productGold: 0 }])
        : synthRows;
      if (!rows.length) return rows;
      const last = rows[rows.length - 1];
      if (last.leaves && last.leaves.length) {
        // 末行自带展开式与合成费，产物那份再贴上去会变成「…+ 2c + 2c」
        rows.push({ icons: [], leaves: null, goldCost: 0, productGold });
      } else {
        last.productGold = productGold;
      }
      return rows;
    },
    /**
     * 把材料列表摊成图标 id 数组，count>1 就重复几个
     * @param {Array} materials 形如 [{ id, count }]
     */
    expandIcons(materials) {
      const ids = [];
      (materials || []).forEach(mat => {
        const count = mat.count || 1;
        for (let i = 0; i < count; i++) ids.push(mat.id);
      });
      return ids;
    },
    /** 配方产物的装备等级；查不到产物兜底 0，避免排序报错。
     *  这里用的是模块作用域的 getItemById（找不到返回 undefined），不是模板那个 {} 兜底版 */
    resultLevel(recipe) {
      const item = getItemById(recipe.resultId);
      return (item && item.level) || 0;
    },
    /** 配方合成费还差多少金币（够则返回 0）。金币同样是合成条件，
     *  只判材料就会出现「详情页说已凑齐、底部却不显示该配方」的自相矛盾。
     *  方案整体跑得通时中间件的合成费也在 planCraft 里算过了，这里直接返回 0；
     *  材料先凑不齐时退回只算产物自己那份——递归口径要等材料齐了才有意义 */
    missingGold(recipe) {
      if (this.planCraft(recipe)) return 0;
      return Math.max(0, (recipe.goldCost || 0) - this.player.money);
    },
    /** 配方直接材料里数量不足的部分：[{ id, lack }]，全部凑齐时返回空数组。
     *  能现场合成的中间件不算缺口：方案整体跑得通就是「已凑齐」，
     *  口径必须和底部合成区一致，否则详情页说还缺、底部却把这条配方列了出来 */
    missingMaterials(recipe) {
      if (this.planCraft(recipe)) return [];
      const counts = this.getItemCounts();
      const missing = [];
      (recipe.materials || []).forEach(mat => {
        const need = mat.count || 1;
        const lack = need - (counts[mat.id] || 0);
        if (lack > 0) missing.push({ id: mat.id, lack });
      });
      return missing;
    },
    /** 主界面快速合成区点击整行 → 复用同一个合成流程 */
    craftFromBar(recipe) {
      this.craftItem(recipe);
    },
    /** 备 count 件 itemId：现货优先，库存不够的部分再用它自己的配方现场合成，继续往下递归。
     *  stock（{ itemId: 数量 }）与 wallet（{ money }）是草稿，会被就地扣减；
     *  chain 记录「先子后父」的合成顺序，只用于日志。
     *  每件产物最多一条配方（getRecipeByResultId 只取首条），配方是一棵树，
     *  所以「先吃现货、再造缺的」这步贪心就是最优解。
     *  @returns {boolean} 是否备齐；返回 false 时草稿已被扣花，调用方必须整份丢弃 */
    solveItem(itemId, count, stock, wallet, chain) {
      const have = stock[itemId] || 0;
      const fromStock = Math.min(have, count);
      if (fromStock > 0) stock[itemId] = have - fromStock;
      const toCraft = count - fromStock;
      if (toCraft === 0) return true;
      const recipe = getRecipeByResultId(itemId);
      if (!recipe) return false;   // 没有配方可造、现货又不够，到此为止
      return this.solveRecipe(recipe, toCraft, stock, wallet, chain);
    },
    /** 造 count 件 recipe 的产物：先扣这份合成费，再逐项备料 */
    solveRecipe(recipe, count, stock, wallet, chain) {
      const cost = (recipe.goldCost || 0) * count;
      if (wallet.money < cost) return false;
      wallet.money -= cost;
      for (const mat of recipe.materials) {
        if (!this.solveItem(mat.id, (mat.count || 1) * count, stock, wallet, chain)) return false;
      }
      chain.push({ name: (getItemById(recipe.resultId) || {}).name, count });
      return true;
    },
    /** 给一条配方算出完整合成方案，中间件也一并递归合出来。
     *  顶层强制合成：产物本身就在库存里也照样再造一件——快速合成区是「点一下造一件」。
     *  @returns {{ consume: Object, gold: number, chain: Array } | null} 不可行返回 null */
    planCraft(recipe) {
      const before = this.getItemCounts();
      const stock = { ...before };
      const wallet = { money: this.player.money };
      const chain = [];
      if (!this.solveRecipe(recipe, 1, stock, wallet, chain)) return null;
      // 只回传真正从库存里拿走的现货，中间件是现场造的，不落库存
      const consume = {};
      Object.keys(stock).forEach(id => {
        const used = (before[id] || 0) - stock[id];
        if (used > 0) consume[id] = used;
      });
      return { consume, gold: this.player.money - wallet.money, chain };
    },

    /** 执行合成 */
    craftItem(recipe) {
      if (this.battle.state !== 'idle') return;
      const plan = this.planCraft(recipe);
      if (!plan) return;

      // 1. 按方案扣现货材料（仓库在前、装备栏在后，与详情页展示口径一致）
      this.consumeItems(plan.consume);

      // 2. 扣钱：含现场合成的中间件各自的合成费
      this.player.money -= plan.gold;

      // 3. 创建产物
      const itemData = getItemById(recipe.resultId);
      if (!itemData) {
        console.error(`合成失败：找不到产物 ${recipe.resultId}`);
        return;
      }
      const result = new Chess({ ...itemData });

      // 4. 放入空位（装备栏优先，其次仓库）。上面扣材料必然腾出格子，这里一定放得下
      if (this.canEquip) {
        this.$set(this.player.chess, this.getFirstItemEmptyIndex, result);
        this.restoreFullHp();
      } else {
        this.$set(this.player.warehouse, this.getFirstWarehouseEmptyIndex, result);
      }

      // 5. 关掉浮窗，重新检测。合成链不止一步时把中间件也记一笔，方便复盘
      this.showMask = false;
      const mids = plan.chain.slice(0, -1).map(s => `${s.name}×${s.count}`).join('、');
      this.logBySide('player', `合成成功：${result.name}${mids ? `（连带合成 ${mids}）` : ''}`);
    },
    /** 按 { itemId: 数量 } 从仓库、装备栏依次扣除装备，扣够即止 */
    consumeItems(consume) {
      const left = { ...consume };
      [this.player.warehouse, this.player.chess].forEach(slot => {
        slot.forEach((item, idx) => {
          if (!item || !left[item.itemId]) return;
          left[item.itemId]--;
          this.$set(slot, idx, null);
        });
      });
    },
    /**
     * 开发者功能：直接获得一件装备（不入商店、不扣钱）
     * 优先放入装备栏，其次仓库；战斗中不可用，避免破坏已锁定的阵容
     * @param {string} resultId 装备库 ID
     */
    devGrantItem(resultId){
      if(this.battle.state === 'fighting') return;
      const itemData = getItemById(resultId);
      if(!itemData){
        this.$message.error(`找不到装备：${resultId}`);
        return;
      }
      const chess = new Chess({ ...itemData });
      if(this.canEquip){
        this.$set(this.player.chess, this.getFirstItemEmptyIndex, chess);
        this.restoreFullHp();
      } else if(!this.isWarehouseFull){
        this.$set(this.player.warehouse, this.getFirstWarehouseEmptyIndex, chess);
      } else {
        this.$message.warning('装备栏和仓库都满了');
        return;
      }
      this.logBySide('player', `[dev] 直接获得装备：${itemData.name}`);
      // 发成功才关详情弹窗，落回合成表，方便连着发下一件；
      // 上面的「栏位/仓库已满」分支直接 return，弹窗留着让玩家换一件
      this.showItemDetail = false;
    },
    /**
     * 开发者功能：往敌方棋盘塞一件装备（不入商店、不扣钱），方便测试敌方阵容
     * 敌方没有仓库，只填空位；战斗中不可用，避免破坏已锁定的阵容
     * @param {string} resultId 装备库 ID
     */
    devGrantEnemyItem(resultId){
      if(this.battle.state === 'fighting') return;
      const itemData = getItemById(resultId);
      if(!itemData){
        this.$message.error(`找不到装备：${resultId}`);
        return;
      }
      const index = this.enemy.chess.findIndex(c => !c);
      if(index === -1){
        this.$message.warning('敌方棋盘已满');
        return;
      }
      this.$set(this.enemy.chess, index, new Chess({ ...itemData }));
      this.logBySide('enemy', `[dev] 敌方获得装备：${itemData.name}`);
      // 与 devGrantItem 对称：发成功才关详情弹窗，落回合成表
      this.showItemDetail = false;
    },
    /**
     * 开发者功能：把当前弹窗里的敌方装备从棋盘移除（dev 模式下点敌方装备 → 移除）
     * 战斗中不可用，避免破坏已锁定的阵容
     */
    devRemoveEnemyChess(){
      if(this.battle.state === 'fighting') return;
      const index = this.enemy.chess.findIndex(c => c && c.id === this.maskItem.id);
      if(index === -1) return;
      this.logBySide('enemy', `[dev] 移除敌方装备：${this.maskItem.name}`);
      this.$set(this.enemy.chess, index, null);
      this.showMask = false;
    },
    /**
     * 随机发一件一级装备给玩家（时光之杖的回合结算奖励）
     * 在 endBattle 的 onBattleEnd 钩子里执行：此时战斗已结束、阵容即将解锁，
     * 发下来的装备下一回合可以正常上场 / 出售 / 当合成材料。
     * 装备栏优先、其次仓库，两处都满则丢弃并写日志。
     * 注意遍历边界：emitHooks 已对棋盘做了快照，这里塞进去的新装备不会再触发自己的 onBattleEnd
     * @param {string} sourceName 来源装备名，仅用于日志
     */
    grantRandomLevel1Item(sourceName = ''){
      const pool = itemLibrary.filter(item => item.level === 1);
      if(!pool.length) return;
      const itemData = pool[Math.floor(Math.random() * pool.length)];
      const chess = new Chess({ ...itemData });
      if(this.canEquip){
        this.$set(this.player.chess, this.getFirstItemEmptyIndex, chess);
        this.restoreFullHp();
      } else if(!this.isWarehouseFull){
        this.$set(this.player.warehouse, this.getFirstWarehouseEmptyIndex, chess);
      } else {
        this.logBySide('player', `${sourceName}：装备栏与仓库已满，${itemData.name} 被丢弃`);
        return;
      }
      this.logBySide('player', `${sourceName} 获得一件装备：${itemData.name}`);
    },
    /**
     * 解锁开发者模式：连点合成表顶部的「合成配方」标题 3 次
     * 无任何提示，解锁后持续有效，刷新页面重置
     */
    onRecipeTitleClick() {
      if (this.devMode) return;
      this.devTitleClicks += 1;
      if (this.devTitleClicks >= 3) this.devMode = true;
    },
    openRecipeBook() {
      // 页签和装备筛选沿用上次打开时的状态，只清掉上一轮的装备详情弹窗
      this.showItemDetail = false;
      this.detailItem = null;
      this.showRecipeBook = true;
    },
    /**
     * 切换一级装备筛选：点已选中的那个取消筛选，点别的换成它
     * @param {string} itemId 装备库 id
     */
    toggleRecipeFilter(itemId) {
      this.recipeFilter = this.recipeFilter === itemId ? null : itemId;
    },
    /**
     * 打开装备详情（合成表第二层弹窗）
     * 这里调的是模块作用域那个 getItemById（找不到返回 undefined），
     * 不是本组件 methods 里那个返回 {} 兜底的模板版本，否则判不出空。
     * @param {string} itemId 装备库 id
     */
    openItemDetail(itemId) {
      const itemData = getItemById(itemId);
      if (!itemData) {
        this.$message.error(`找不到装备：${itemId}`);
        return;
      }
      this.detailItem = itemData;
      this.showItemDetail = true;
    },
    /** 根据 ID 获取装备信息（模板中用，返回空对象兜底避免可选链问题） */
    getItemById(id) {
      return getItemById(id) || {};
    }
  }
}

</script>
