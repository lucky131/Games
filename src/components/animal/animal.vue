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
      <div class="text center">实际上胜利者会比淘汰者要多一些，比例大约为53.99% : 46.01%</div>
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

    <div v-else-if="scene === 17" class="scene flex">
      <div class="text center mb">但是不要失望，不要觉得观察者就是个憨批，他只是没有遇到他的猎物，就好像鱼人杀手蟹没有遇到鱼人一样，我们暂时先把观察者放一边</div>
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
  .bold{
    font-weight: bold;
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
        padding: 0 10px;
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
    }

    cardNumber () {
      return this.rock + this.scissors + this.paper;
    }
    play (allRock = 0, allScissors = 0, allPaper = 0) {
      if (this.cardNumber() === 0) return null;
      let play;
      switch (this.style) {
        case "random":
          let array = [];
          for (let i = 0; i < this.rock; i++) array.push(0);
          for (let i = 0; i < this.scissors; i++) array.push(1);
          for (let i = 0; i < this.paper; i++) array.push(2);
          play = getRandom(array);
          break;
        case "observe":
          let allSort = getAllSort(allRock, allScissors, allPaper);
          for (let i = 0; i < allSort.length; i++) {
            let arr = allSort[i].filter(index => this[["rock", "scissors", "paper"][(index-1+3)%3]] > 0);
            if (arr.length > 0) {
              play = (getRandom(arr) - 1 + 3) % 3;
              break;
            }
          }
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
        scene: 1,
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
              this.defaultPlayer = new Player(0, "观察者1", "observe");
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
            default:
              this.scene = scene;
              break;
          }
        }
      },
      generatePlayers (random = 0, observe = 0) {
        let index = 0;
        this.players = [];
        for (let i = 0; i < random; i++) {
          this.players.push(new Player(index++, "随机者" + (i + 1)));
        }
        for (let i = 0; i < observe; i++) {
          this.players.push(new Player(index++, "观察者" + (i + 1), "observe"));
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
            let playA = playerA.play(), playB = playerB.play();
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
            this.toLogsBottom();
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
              this.toLogsBottom();
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
      toLogsBottom () {
        this.$nextTick(() => {
          let el = document.getElementsByClassName("logs");
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
