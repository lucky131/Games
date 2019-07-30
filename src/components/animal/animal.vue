<template>
  <div class="animal">

    <div v-if="scene === 1" class="scene flex">
      <div class="text center mb">你看过电影《动物世界》吗？</div>
      <div class="opes">
        <div class="btn" @click="changeScene(2)">看过</div>
        <div class="btn" @click="changeScene(3)">没看过</div>
      </div>
    </div>

    <div v-else-if="scene === 2" class="scene flex">
      <div class="text center mb">你是否还记得电影里的石头剪刀布的游戏规则？</div>
      <div class="opes">
        <div class="btn" @click="changeScene(4)">记得</div>
        <div class="btn" @click="changeScene(3)">忘记了</div>
      </div>
    </div>

    <div v-else-if="scene === 3" class="scene flex" @click="changeScene(4)">
      <div class="text">
        大致游戏规则如下：<br>
        在一个封闭空间内，若干名玩家同时进行一场游戏，游戏开始时，每个人手里有12张牌（4张石头、4张剪刀、4张布）和三颗星星。<br>
        你可以找到任意一个人与你对决，每人各出一张牌，赢的那一方拿走对方身上的一颗星，同时打出去的牌也会被收走。<br>
        最后，在限定的时间内打光手里所有的牌，并且保住三颗及以上星星的人即可赢得比赛<br>
        如果时间到了，你还有手牌，或者星星少于三颗，则被淘汰
      </div>
    </div>

    <div v-else-if="scene === 4" class="scene flex" @click="changeScene(5)">
      <div class="text center mb">现在我用下面这个玩意来表示一个玩家</div>
      <one-player style="margin-bottom: 20px" :player="defaultPlayer"></one-player>
      <div class="text center">
        第一行表示玩家的名字<br>
        第二行3个数字分别表示石头、剪刀、布卡牌的数量<br>
        第三行表示星星个数
      </div>
    </div>

    <div v-else-if="scene === 5" class="scene flex" @click="changeScene(6)">
      <div class="text center mb">现在我们模拟一个简单的10人游戏，假设10个人都是随机者</div>
      <div class="players mb">
        <one-player v-for="(p, index) in players" :key="index" :player="p"></one-player>
      </div>
      <div class="text center">随机者的出牌策略很简单，就是完全随机从手牌中选一张打出，不考虑任何其他因素。游戏进行时，有人一旦达成淘汰条件就立刻出局，直到所有人都无法再出牌为止，来看看结果如何</div>
    </div>

    <div v-else-if="scene === 6" class="scene flex" @click="changeScene(7)">
      <div class="players mb">
        <one-player v-for="(p, index) in players" :key="index" :player="p"></one-player>
      </div>
      <speed-controller class="mb" :interval="interval" @changeInterval="changeInterval($event)"></speed-controller>
      <div class="logs mb" @click.stop>
        <div v-for="(l, index) in logs" :key="index" class="row">{{l}}</div>
      </div>
      <div class="text center">胜利{{winPlayers.length}}人，淘汰{{losePlayers.length}}人</div>
    </div>

    <div v-else-if="scene === 7" class="scene flex" @click="changeScene(8)">
      <div class="text center mb">是不是感觉不到什么？</div>
      <div class="text center">没有关系，接下来我们把人数调到50人，再重复一次以上步骤</div>
    </div>

    <div v-else-if="scene === 8" class="scene flex" @click="changeScene(9)">
      <div class="players mb">
        <one-player v-for="(p, index) in players" :key="index" :player="p"></one-player>
      </div>
      <speed-controller class="mb" :interval="interval" @changeInterval="changeInterval($event)"></speed-controller>
      <div class="text center">胜利{{winPlayers.length}}人，淘汰{{losePlayers.length}}人</div>
    </div>

    <div v-else-if="scene === 9" class="scene flex" @click="changeScene(10)">
      <div class="text center mb">你是不是已经得出了一个结论？</div>
      <div class="text center">在大家都完全随机出牌的情况下，平均有一半的人获胜，剩下一半的人被淘汰？</div>
    </div>

    <div v-else-if="scene === 10" class="scene flex" @click="changeScene(11)">
      <div class="text center mb">我已经做过一次实验，1000人局进行了10次游戏，最终的结果是：</div>
      <table class="table mb">
        <tr><td>次数</td><td>胜利</td><td>淘汰</td></tr>
        <tr><td>1</td><td>536</td><td>464</td></tr>
        <tr><td>2</td><td>538</td><td>462</td></tr>
        <tr><td>3</td><td>539</td><td>461</td></tr>
        <tr><td>4</td><td>551</td><td>449</td></tr>
        <tr><td>5</td><td>535</td><td>465</td></tr>
        <tr><td>6</td><td>550</td><td>450</td></tr>
        <tr><td>7</td><td>534</td><td>466</td></tr>
        <tr><td>8</td><td>540</td><td>460</td></tr>
        <tr><td>9</td><td>539</td><td>461</td></tr>
        <tr><td>10</td><td>537</td><td>463</td></tr>
        <tr><td>总计</td><td>5399</td><td>4601</td></tr>
      </table>
      <div class="text center">实际上胜利者会比淘汰者要多一些，胜率大约为53.99%</div>
    </div>

    <div v-else-if="scene === 11" class="scene flex" @click="changeScene(12)">
      <div class="text center mb">电影当中还有一块电子屏，上面记录了当前还存活的玩家手中3种牌的总数，就是下面这个东西：</div>
      <board :rock="153" :scissors="148" :paper="151"></board>
    </div>

    <div v-else-if="scene === 12" class="scene flex" @click="changeScene(13)">
      <div class="text center mb">现在出现了一名特殊的玩家，他叫观察者，名字用蓝色来表示，他的出牌策略不同于随机者，他会根据电子屏上显示的牌数，<span class="bold">他总会尽量打出一张当前电子屏上最多的那张牌的克星牌</span></div>
      <one-player style="margin-bottom: 20px" :player="defaultPlayer"></one-player>
      <board class="mb" :rock="153" :scissors="148" :paper="151"></board>
      <div class="text center">举个栗子：比如现在石头的数量最多，那么这名观察者就会打出布，如果没有布，那么他会打出第二多的布的克星牌，即剪刀，如果剪刀也没有，那么只能打出石头了</div>
    </div>

    <div v-else-if="scene === 13" class="scene flex" @click="changeScene(14)">
      <board class="mb" :rock="39" :scissors="40" :paper="40"></board>
      <div class="text center">如果剪刀和布都是最多的，那么他就会从石头和剪刀中随机选一个出一张牌，如果其中一个没有牌就打另一个，如果两个都没有，那只能打布了</div>
    </div>

    <div v-else-if="scene === 14" class="scene flex" @click="changeScene(15)">
      <div class="text center mb">好，接下来我们再模拟一次50人的游戏，这次我们加入25位观察者，看看结果如何</div>
      <div class="players">
        <one-player v-for="(p, index) in players" :key="index" :player="p"></one-player>
      </div>
    </div>

    <div v-else-if="scene === 15" class="scene flex" @click="changeScene(16)">
      <div class="players mb">
        <one-player v-for="(p, index) in players" :key="index" :player="p"></one-player>
      </div>
      <speed-controller class="mb" :interval="interval" @changeInterval="changeInterval($event)"></speed-controller>
      <board class="mb" :rock="boardRock" :scissors="boardScissors" :paper="boardPaper"></board>
      <div class="text center">胜利{{winPlayers.length}}人，淘汰{{losePlayers.length}}人</div>
      <div class="text center">其中观察者胜利{{winPlayers.filter(p => p.style === 'observe').length}}人，淘汰{{losePlayers.filter(p => p.style === 'observe').length}}人</div>
    </div>

    <div v-else-if="scene === 16" class="scene flex" @click="changeScene(17)">
      <div class="text center mb">看起来观察者并没有想象中的那么厉害是吗？我又做了一次实验，1000人的游戏，包含500个随机者和500个观察者，一共进行10次游戏，结果如下：</div>
      <table class="table mb">
        <tr><td>次数</td><td>观察者胜利</td><td>观察者淘汰</td></tr>
        <tr><td>1</td><td>274</td><td>226</td></tr>
        <tr><td>2</td><td>272</td><td>228</td></tr>
        <tr><td>3</td><td>270</td><td>230</td></tr>
        <tr><td>4</td><td>284</td><td>216</td></tr>
        <tr><td>5</td><td>264</td><td>236</td></tr>
        <tr><td>6</td><td>272</td><td>228</td></tr>
        <tr><td>7</td><td>277</td><td>223</td></tr>
        <tr><td>8</td><td>277</td><td>223</td></tr>
        <tr><td>9</td><td>270</td><td>230</td></tr>
        <tr><td>10</td><td>264</td><td>236</td></tr>
        <tr><td>总计</td><td>2724</td><td>2276</td></tr>
      </table>
      <div class="text center">是不是感到一点点失望，随机者的胜者比例是53.99%，而观察者的为54.48%，仅比随机者多了0.5%还不到</div>
    </div>

    <div v-else-if="scene === 17" class="scene flex" @click="changeScene(18)">
      <div class="text center mb">但是不要失望，不要觉得观察者就是个憨批，我们暂时先把观察者放一边</div>
      <div class="text center mb">接下来我们再引入一种新的角色，他叫和平者，名字用紫色来表示</div>
      <one-player style="margin-bottom: 20px" :player="defaultPlayer"></one-player>
      <div class="text center">和平者是一群佛系玩家，他们不求获胜，只求平局，因此他们的出牌策略是<span class="bold">尽量打出一张当前电子屏上最多的那张牌</span></div>
    </div>

    <div v-else-if="scene === 18" class="scene flex" @click="changeScene(19)">
      <div class="text center mb">我们再模拟一次50人的游戏，25位随机者，25位和平者，看看结果如何</div>
      <div class="players">
        <one-player v-for="(p, index) in players" :key="index" :player="p"></one-player>
      </div>
    </div>

    <div v-else-if="scene === 19" class="scene flex" @click="changeScene(20)">
      <div class="players mb">
        <one-player v-for="(p, index) in players" :key="index" :player="p"></one-player>
      </div>
      <speed-controller class="mb" :interval="interval" @changeInterval="changeInterval($event)"></speed-controller>
      <board class="mb" :rock="boardRock" :scissors="boardScissors" :paper="boardPaper"></board>
      <div class="text center">胜利{{winPlayers.length}}人，淘汰{{losePlayers.length}}人</div>
      <div class="text center">其中和平者胜利{{winPlayers.filter(p => p.style === 'peace').length}}人，淘汰{{losePlayers.filter(p => p.style === 'peace').length}}人</div>
    </div>

    <div v-else-if="scene === 20" class="scene flex" @click="changeScene(21)">
      <div class="text center mb">同理我又做了实验，1000人的游戏，包含500个随机者和500个和平者，一共进行10次游戏，结果如下：</div>
      <table class="table mb">
        <tr><td>次数</td><td>和平者胜利</td><td>和平者淘汰</td></tr>
        <tr><td>1</td><td>276</td><td>224</td></tr>
        <tr><td>2</td><td>278</td><td>222</td></tr>
        <tr><td>3</td><td>270</td><td>230</td></tr>
        <tr><td>4</td><td>259</td><td>241</td></tr>
        <tr><td>5</td><td>258</td><td>242</td></tr>
        <tr><td>6</td><td>263</td><td>237</td></tr>
        <tr><td>7</td><td>276</td><td>224</td></tr>
        <tr><td>8</td><td>268</td><td>232</td></tr>
        <tr><td>9</td><td>271</td><td>229</td></tr>
        <tr><td>10</td><td>261</td><td>239</td></tr>
        <tr><td>总计</td><td>2680</td><td>2320</td></tr>
      </table>
      <div class="text center">和平者的胜率为53.60%，甚至比随机者还要低</div>
    </div>

    <div v-else-if="scene === 21" class="scene flex" @click="changeScene(22)">
      <div class="text center mb">至此为止我们已经有3种出牌策略的玩家，分别是随机者、观察者、和平者，目前为止他们三者的胜率几乎相同</div>
      <div class="text center mb">接下来我们引进第四种玩家：欺诈者，用红色的名字来表示。</div>
      <one-player style="margin-bottom: 20px" :player="defaultPlayer"></one-player>
      <div class="text center mb">欺诈者在每一次出牌前会向对方宣布自己接下来要出的牌，比如欺诈者宣称自己将要出布，此时如果对阵的是一名观察者，那么他就会暂时无视数据板上的数字，出牌的优先级是剪刀>布>石头；同理，如果对阵的是和平者，和平者的出牌优先级是布>剪刀>石头。然而欺诈者将会打出的牌不是布而是剪刀</div>
      <div class="text center bold">实际上，欺诈者的出牌策略和随机者完全相同，唯一不同的就是他会根据自己即将打出的牌，说一句欺诈对手的话，从而影响对手的出牌策略</div>
    </div>

    <div v-else-if="scene === 22" class="scene flex" @click="changeScene(23)">
      <div class="text center mb">接下来我们要模拟一次大规模的战斗，20个随机者，10个观察者，10个和平者，10个欺诈者，群魔乱舞，看看结果如何</div>
      <div class="players">
        <one-player v-for="(p, index) in players" :key="index" :player="p"></one-player>
      </div>
    </div>

    <div v-else-if="scene === 23" class="scene flex" @click="changeScene(24)">
      <div class="players mb">
        <one-player v-for="(p, index) in players" :key="index" :player="p"></one-player>
      </div>
      <speed-controller class="mb" :interval="interval" @changeInterval="changeInterval($event)"></speed-controller>
      <board class="mb" :rock="boardRock" :scissors="boardScissors" :paper="boardPaper"></board>
      <div class="text center">随机者胜利{{winPlayers.filter(p => p.style === 'random').length}}人，淘汰{{losePlayers.filter(p => p.style === 'random').length}}人</div>
      <div class="text center">观察者胜利{{winPlayers.filter(p => p.style === 'observe').length}}人，淘汰{{losePlayers.filter(p => p.style === 'observe').length}}人</div>
      <div class="text center">和平者胜利{{winPlayers.filter(p => p.style === 'peace').length}}人，淘汰{{losePlayers.filter(p => p.style === 'peace').length}}人</div>
      <div class="text center">欺诈者胜利{{winPlayers.filter(p => p.style === 'cheat').length}}人，淘汰{{losePlayers.filter(p => p.style === 'cheat').length}}人</div>
    </div>

    <div v-else-if="scene === 24" class="scene flex" @click="changeScene(25)">
      <div class="text center mb">是不是看到了一些不同？老规矩，扩大实验人数，总1000人，400随机者，200观察者，200和平者，200欺诈者，10局游戏，结果如下：</div>
      <table class="table small-font">
        <tr><td>次数</td><td>随机胜</td><td>观察胜</td><td>和平胜</td><td>欺诈胜</td></tr>
        <tr><td>1</td><td>217</td><td>131</td><td>18</td><td>166</td></tr>
        <tr><td>2</td><td>223</td><td>136</td><td>26</td><td>161</td></tr>
        <tr><td>3</td><td>234</td><td>131</td><td>16</td><td>153</td></tr>
        <tr><td>4</td><td>211</td><td>140</td><td>19</td><td>160</td></tr>
        <tr><td>5</td><td>232</td><td>127</td><td>24</td><td>153</td></tr>
        <tr><td>6</td><td>225</td><td>142</td><td>20</td><td>150</td></tr>
        <tr><td>7</td><td>217</td><td>131</td><td>30</td><td>150</td></tr>
        <tr><td>8</td><td>213</td><td>154</td><td>23</td><td>156</td></tr>
        <tr><td>9</td><td>206</td><td>130</td><td>21</td><td>167</td></tr>
        <tr><td>10</td><td>236</td><td>134</td><td>23</td><td>159</td></tr>
        <tr><td>总计</td><td>2214</td><td>1356</td><td>220</td><td>1575</td></tr>
        <tr><td>胜率</td><td>55.35%</td><td>67.80%</td><td>11.00%</td><td>78.75%</td></tr>
      </table>
    </div>

    <div v-else-if="scene === 25" class="scene flex" @click="changeScene(26)">
      <div class="text center mb">随机者的胜率几乎不受影响</div>
      <div class="text center mb">观察者的胜率由之前的54%左右提升到了67.80%</div>
      <div class="text center mb">和平者就很惨了，胜率仅有11.00%</div>
      <div class="text center">最新加入的欺诈者以78.75%的胜率获得了胜率排行第一</div>
    </div>

    <div v-else-if="scene === 26" class="scene flex" @click="changeScene(27)">
      <div class="text center mb">为了平衡一下欺诈者的胜率，我们再引入一个角色：干扰者，名字用黄色表示</div>
      <one-player style="margin-bottom: 20px" :player="defaultPlayer"></one-player>
      <div class="text center mb bold">干扰者的本质是随机者，而且是一群追求快乐的随机者，干扰者的出牌策略与随机者相同，并且在出牌前会宣布一张牌，与欺诈者不同的是，过他宣布的牌与他要打的牌没有任何关系，是完全随机宣布，也完全随机出牌</div>
      <div class="text center">接下来我们再模拟一场简单的游戏，5种角色各10人，看看结果如何</div>
    </div>

    <div v-else-if="scene === 27" class="scene flex" @click="changeScene(28)">
      <div class="players mb">
        <one-player v-for="(p, index) in players" :key="index" :player="p"></one-player>
      </div>
      <speed-controller class="mb" :interval="interval" @changeInterval="changeInterval($event)"></speed-controller>
      <board class="mb" :rock="boardRock" :scissors="boardScissors" :paper="boardPaper"></board>
      <div class="text center">随机者胜利{{winPlayers.filter(p => p.style === 'random').length}}人，淘汰{{losePlayers.filter(p => p.style === 'random').length}}人</div>
      <div class="text center">观察者胜利{{winPlayers.filter(p => p.style === 'observe').length}}人，淘汰{{losePlayers.filter(p => p.style === 'observe').length}}人</div>
      <div class="text center">和平者胜利{{winPlayers.filter(p => p.style === 'peace').length}}人，淘汰{{losePlayers.filter(p => p.style === 'peace').length}}人</div>
      <div class="text center">欺诈者胜利{{winPlayers.filter(p => p.style === 'cheat').length}}人，淘汰{{losePlayers.filter(p => p.style === 'cheat').length}}人</div>
      <div class="text center">干扰者胜利{{winPlayers.filter(p => p.style === 'interfere').length}}人，淘汰{{losePlayers.filter(p => p.style === 'interfere').length}}人</div>
    </div>

    <div v-else-if="scene === 28" class="scene flex" @click="changeScene(29)">
      <div class="text center mb">老规矩，扩大实验人数，总1000人，5种角色各200人，10局游戏，结果如下：</div>
      <table class="table small-font">
        <tr><td>次数</td><td>随机</td><td>观察</td><td>和平</td><td>欺诈</td><td>干扰</td></tr>
        <tr><td>1</td><td>115</td><td>150</td><td>25</td><td>156</td><td>103</td></tr>
        <tr><td>2</td><td>98</td><td>155</td><td>22</td><td>158</td><td>110</td></tr>
        <tr><td>3</td><td>116</td><td>133</td><td>21</td><td>159</td><td>104</td></tr>
        <tr><td>4</td><td>120</td><td>131</td><td>26</td><td>148</td><td>116</td></tr>
        <tr><td>5</td><td>108</td><td>140</td><td>25</td><td>154</td><td>103</td></tr>
        <tr><td>6</td><td>102</td><td>139</td><td>24</td><td>161</td><td>108</td></tr>
        <tr><td>7</td><td>114</td><td>130</td><td>23</td><td>158</td><td>105</td></tr>
        <tr><td>8</td><td>106</td><td>141</td><td>21</td><td>154</td><td>112</td></tr>
        <tr><td>9</td><td>126</td><td>134</td><td>20</td><td>146</td><td>110</td></tr>
        <tr><td>10</td><td>116</td><td>141</td><td>18</td><td>145</td><td>115</td></tr>
        <tr><td>总计</td><td>1121</td><td>1394</td><td>225</td><td>1539</td><td>1086</td></tr>
        <tr><td>胜率</td><td>56.05%</td><td>69.70%</td><td>11.25%</td><td>76.95%</td><td>54.30%</td></tr>
      </table>
    </div>

    <div v-else-if="scene === 29" class="scene flex" @click="changeScene(30)">
      <div class="text center mb">实验的结果与前一次差不太多</div>
      <div class="text center mb">观察者的胜率由之前的54%左右提升到了67.80%</div>
      <div class="text center mb">和平者就很惨了，胜率仅有11.00%</div>
      <div class="text center">最新加入的欺诈者以78.75%的胜率获得了胜率排行第一</div>
    </div>

    <div v-else-if="scene === 666" class="scene flex">
    </div>

  </div>
</template>

<style scoped lang="scss">
  *{
    box-sizing: border-box;
  }
  .mb{
    margin-bottom: 20px;
  }
  .small-font{
    font-size: 12px;
  }
  .bold{
    font-weight: bold;
  }
  /deep/ {
    .random{
      color: white;
    }
    .observe{
      color: #007fff;
    }
    .peace{
      color: #fa57ff;
    }
    .cheat{
      color: #ff3831;
    }
    .interfere{
      color: #e2e200;
    }
  }
  .scene{
    width: 100vw;
    min-height: 100vh;
    overflow-y: auto;
    &.flex{
      display: flex;
      flex-flow: column nowrap;
      justify-content: center;
      align-items: center;
    }
    .text{
      width: 100%;
      padding: 0 20px;
      &.center{
        text-align: center;
      }
    }
    .opes{
      width: 100%;
      padding: 0 20px;
      display: flex;
      flex-flow: row nowrap;
      .btn{
        flex: 1 0 0;
        height: 60px;
        line-height: 60px;
        margin-left: 20px;
        &:first-child{margin-left: 0}
        border: 4px double black;
        box-sizing: content-box;
        border-radius: 4px;
        text-align: center;
      }
    }
    .players{
      width: 100%;
      padding: 0 20px;
      display: flex;
      flex-flow: row wrap;
      justify-content: center;
    }
    .logs{
      width: 100%;
      height: 200px;
      padding: 0 20px;
      overflow-y: auto;
      font-size: 12px;
    }
    .table{
      td{
        padding: 0 6px;
      }
    }
  }
</style>

<script>
  import onePlayer from "./one-player"
  import speedController from "./speed-controller"
  import board from "./board"

  function log(...arg) {
    console.log(...arg);
  }
  function getRandom(arr) {
    if(arr.length === 0) return null;
    return arr[Math.floor(Math.random() * arr.length)];
  }
  function getAllSort(n1, n2, n3) {
    let arr = [{value: n1, index: 0}, {value: n2, index: 1}, {value: n3, index: 2}];
    arr.sort((a, b) => b.value - a.value);
    if (arr[0].value === arr[2].value) return [[0, 1, 2]];
    if (arr[0].value === arr[1].value) return [[arr[0].index, arr[1].index], [arr[2].index]];
    if (arr[1].value === arr[2].value) return [[arr[0].index], [arr[1].index, arr[2].index]];
    return [[arr[0].index], [arr[1].index], [arr[2].index]];
  }
  
  class Player {
    constructor (index, name = "未命名", style = "random", rock = 4, scissors = 4, paper = 4, star = 3) {
      this.index = index;
      this.name = name;
      this.style = style;
      this.rock = rock;
      this.scissors = scissors;
      this.paper = paper;
      this.star = star;
      this.status = "playing";
      this.nextPlay = null;
    }

    cardNumber () {
      return this.rock + this.scissors + this.paper;
    }
    promise () {
      let p = null, nextPlay = null;
      let cardArray = [];
      for (let i = 0; i < this.rock; i++) cardArray.push(0);
      for (let i = 0; i < this.scissors; i++) cardArray.push(1);
      for (let i = 0; i < this.paper; i++) cardArray.push(2);
      switch (this.style) {
        case "cheat":
          nextPlay = getRandom(cardArray);
          p = (nextPlay + 1) % 3;
          break;
        case "interfere":
          nextPlay = getRandom(cardArray);
          p = getRandom([0,1,2]);
          break;
      }
      this.nextPlay = nextPlay;
      return p;
    }
    play (allRock = 0, allScissors = 0, allPaper = 0, opponentPromise = null) {
      if (this.cardNumber() === 0) return null;
      let play, allSort;
      switch (this.style) {
        case "random":
          let array = [];
          for (let i = 0; i < this.rock; i++) array.push(0);
          for (let i = 0; i < this.scissors; i++) array.push(1);
          for (let i = 0; i < this.paper; i++) array.push(2);
          play = getRandom(array);
          break;
        case "observe":
          if (opponentPromise === 0) allSort = [[0],[1],[2]];
          else if (opponentPromise === 1) allSort = [[1],[2],[0]];
          else if (opponentPromise === 2) allSort = [[2],[0],[1]];
          else allSort = getAllSort(allRock, allScissors, allPaper);
          for (let i = 0; i < allSort.length; i++) {
            let arr = allSort[i].filter(index => this[["rock", "scissors", "paper"][(index-1+3)%3]] > 0);
            if (arr.length > 0) {
              play = (getRandom(arr) - 1 + 3) % 3;
              break;
            }
          }
          break;
        case "peace":
          if (opponentPromise === 0) allSort = [[0],[2],[1]];
          else if (opponentPromise === 1) allSort = [[1],[0],[2]];
          else if (opponentPromise === 2) allSort = [[2],[1],[0]];
          else allSort = getAllSort(allRock, allScissors, allPaper);
          for (let i = 0; i < allSort.length; i++) {
            let arr = allSort[i].filter(index => this[["rock", "scissors", "paper"][index]] > 0);
            if (arr.length > 0) {
              play = getRandom(arr);
              break;
            }
          }
          break;
        case "cheat":
          play = this.nextPlay;
          this.nextPlay = null;
          break;
        case "interfere":
          play = this.nextPlay;
          this.nextPlay = null;
          break;
      }
      this[["rock", "scissors", "paper"][play]]--;
      return play;
    }
  }

  export default {
    name: 'animal',
    components: {onePlayer, speedController, board},
    data () {
      return {
        timeInterval: null,
        interval: 400,
        scene: 25,
        players: [],
        defaultPlayer: new Player(0, "player1"),
        logs: [],
      }
    },
    mounted () {
    },
    computed: {
      playingPlayers () {
        return this.players.filter(p => p.status === "playing");
      },
      winPlayers () {
        return this.players.filter(p => p.status === "win");
      },
      losePlayers () {
        return this.players.filter(p => p.status === "lose");
      },
      boardRock () {
        let n = 0;
        this.playingPlayers.forEach(p => {
          n += p.rock;
        });
        return n;
      },
      boardScissors () {
        let n = 0;
        this.playingPlayers.forEach(p => {
          n += p.scissors;
        });
        return n;
      },
      boardPaper () {
        let n = 0;
        this.playingPlayers.forEach(p => {
          n += p.paper;
        });
        return n;
      },
    },
    methods: {
      changeScene (scene) {
        if (this.scene !== scene) {
          switch (scene) {
            case 5:
              this.scene = 5;
              this.generatePlayers(10);
              break;
            case 6:
              this.scene = 6;
              this.startGame();
              break;
            case 7:
              if (this.playingPlayers.length === 0) {
                this.scene = 7;
              }
              break;
            case 8:
              this.scene = 8;
              this.generatePlayers(50);
              this.startGame();
              break;
            case 9:
              if (this.playingPlayers.length === 0) {
                this.scene = 9;
              }
              break;
            case 12:
              this.scene = 12;
              this.defaultPlayer = new Player(0, "观察者", "observe");
              break;
            case 14:
              this.scene = 14;
              this.generatePlayers(25, 25);
              break;
            case 15:
              this.scene = 15;
              this.startGame();
              break;
            case 16:
              if (this.playingPlayers.length === 0) {
                this.scene = 16;
              }
              break;
            case 17:
              this.scene = 17;
              this.defaultPlayer = new Player(0, "和平者", "peace");
              break;
            case 18:
              this.scene = 18;
              this.generatePlayers(25, 0, 25);
              break;
            case 19:
              this.scene = 19;
              this.startGame();
              break;
            case 20:
              if (this.playingPlayers.length === 0) {
                this.scene = 20;
              }
              break;
            case 21:
              this.scene = 21;
              this.defaultPlayer = new Player(0, "欺诈者", "cheat");
              break;
            case 22:
              this.scene = 22;
              this.generatePlayers(20, 10, 10, 10);
              break;
            case 23:
              this.scene = 23;
              this.startGame();
              break;
            case 26:
              this.scene = 26;
              this.defaultPlayer = new Player(0, "干扰者", "interfere");
              break;
            case 27:
              this.scene = 27;
              this.generatePlayers(10, 10, 10, 10, 10);
              this.startGame();
              break;
            case 28:
              if (this.playingPlayers.length === 0) {
                this.scene = 28;
              }
              break;
            default:
              this.scene = scene;
              break;
          }
        }
      },
      generatePlayers (random = 0, observe = 0, peace = 0, cheat = 0, interfere = 0) {
        let index = 0;
        this.players = [];
        for (let i = 0; i < random; i++) {
          this.players.push(new Player(index++, "随机者" + (i + 1), "random"));
        }
        for (let i = 0; i < observe; i++) {
          this.players.push(new Player(index++, "观察者" + (i + 1), "observe"));
        }
        for (let i = 0; i < peace; i++) {
          this.players.push(new Player(index++, "和平者" + (i + 1), "peace"));
        }
        for (let i = 0; i < cheat; i++) {
          this.players.push(new Player(index++, "欺诈者" + (i + 1), "cheat"));
        }
        for (let i = 0; i < interfere; i++) {
          this.players.push(new Player(index++, "干扰者" + (i + 1), "interfere"));
        }
      },
      startGame () {
        this.logs = [];
        this.autoPlay();
      },
      autoPlay (loop = true) {
        if (loop) {
          while (this.playingPlayers.length >= 2) {
            let randomSortPlayingPlayers = this.$u.shuffleArray(this.playingPlayers);
            let [indexA, indexB] = [randomSortPlayingPlayers[0].index, randomSortPlayingPlayers[1].index];
            let [playerA, playerB] = [this.players[indexA], this.players[indexB]];
            let [promiseA, promiseB] = [playerA.promise(), playerB.promise()];
            let playA = playerA.play(this.boardRock, this.boardScissors, this.boardPaper, promiseB);
            let playB = playerB.play(this.boardRock, this.boardScissors, this.boardPaper, promiseA);
            switch ((playA - playB + 3) % 3) {
              case 0:
                this.logs.push(`${playerA.name}出${["石头","剪刀","布"][playA]}，${playerB.name}出${["石头","剪刀","布"][playB]}，平手`);
                break;
              case 1:
                playerA.star--;
                playerB.star++;
                this.logs.push(`${playerA.name}出${["石头","剪刀","布"][playA]}，${playerB.name}出${["石头","剪刀","布"][playB]}，${playerB.name}胜`);
                break;
              case 2:
                playerA.star++;
                playerB.star--;
                this.logs.push(`${playerA.name}出${["石头","剪刀","布"][playA]}，${playerB.name}出${["石头","剪刀","布"][playB]}，${playerA.name}胜`);
                break;
            }
            this.toBottom("logs");
            this.refreshPlayerStatus(playerA);
            this.refreshPlayerStatus(playerB);
          }
          this.players.forEach(p => {
            this.refreshPlayerStatus(p, false);
          });
        } else {
          setTimeout(() => {
            if (this.playingPlayers.length >= 2) {
              let randomSortPlayingPlayers = this.$u.shuffleArray(this.playingPlayers);
              let [indexA, indexB] = [randomSortPlayingPlayers[0].index, randomSortPlayingPlayers[1].index];
              let [playerA, playerB] = [this.players[indexA], this.players[indexB]];
              let playA = playerA.play(this.boardRock, this.boardScissors, this.boardPaper);
              let playB = playerB.play(this.boardRock, this.boardScissors, this.boardPaper);
              switch ((playA - playB + 3) % 3) {
                case 0:
                  this.logs.push(`${playerA.name}出${["石头","剪刀","布"][playA]}，${playerB.name}出${["石头","剪刀","布"][playB]}，平手`);
                  break;
                case 1:
                  playerA.star--;
                  playerB.star++;
                  this.logs.push(`${playerA.name}出${["石头","剪刀","布"][playA]}，${playerB.name}出${["石头","剪刀","布"][playB]}，${playerB.name}胜`);
                  break;
                case 2:
                  playerA.star++;
                  playerB.star--;
                  this.logs.push(`${playerA.name}出${["石头","剪刀","布"][playA]}，${playerB.name}出${["石头","剪刀","布"][playB]}，${playerA.name}胜`);
                  break;
              }
              this.toBottom("logs");
              this.refreshPlayerStatus(playerA);
              this.refreshPlayerStatus(playerB);
              this.autoPlay();
            } else {
              this.players.forEach(p => {
                this.refreshPlayerStatus(p, false);
              });
            }
          }, this.interval);
        }
      },
      refreshPlayerStatus (player, playing = true) {
        if (player.star === 0) {
          player.status = "lose";
        } else {
          if (player.cardNumber() === 0) {
            player.status = player.star >= 3 ? "win" : "lose";
          } else if (!playing) {
            player.status = "lose";
          }
        }
      },
      toBottom (className) {
        this.$nextTick(() => {
          let el = document.getElementsByClassName(className);
          if(el.length > 0){
            el[0].scrollTop = el[0].scrollHeight;
          }
        });
      },
      changeInterval (i) {
        this.interval = i
      }
    }
  }
</script>
