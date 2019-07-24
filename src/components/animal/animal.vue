<template>
  <div>

    <div v-if="scene === 1" class="scene flex">
      <div class="text center">你看过电影《动物世界》吗？</div>
      <div class="opes">
        <div class="btn" @click="changeScene(2)">看过</div>
        <div class="btn" @click="changeScene(3)">没看过</div>
      </div>
    </div>

    <div v-else-if="scene === 2" class="scene flex">
      <div class="text center">你是否还记得电影里的石头剪刀布的游戏规则？</div>
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
      <div class="text center">现在我用下面这个玩意来表示一个玩家</div>
      <player style="margin: 20px 0" :player="defaultPlayer"></player>
      <div class="text center">
        第一行表示玩家的名字<br>
        第二行3个数字分别表示石头、剪刀、布卡牌的数量<br>
        第三行表示星星个数
      </div>
    </div>

    <div v-else-if="scene === 5" class="scene flex" @click="changeScene(6)">
      <div class="text center">现在我们模拟一个简单的10人游戏</div>
      <div class="players">
        <player v-for="(p, index) in players" :key="index" :player="p"></player>
      </div>
      <div class="text center">并且假设没有时间限制，10个人完全随机出牌，星星一旦为0立即淘汰，牌打完之后星星少于3颗的也淘汰，直到所有人都无法再出牌为止，不考虑任何其他因素，来看看结果如何</div>
    </div>

    <div v-else-if="scene === 6" class="scene flex">
      <div class="players">
        <player v-for="(p, index) in players" :key="index" :player="p"></player>
      </div>
      <div class="text center">{{tempText}}</div>
    </div>

    <div v-else-if="scene === 666" class="scene flex">
    </div>

  </div>
</template>

<style scoped lang="scss">
  *{
    box-sizing: border-box;
  }
  .scene{
    width: 100vw;
    height: 100vh;
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
      margin-top: 20px;
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
      margin: 20px 0;
      display: flex;
      flex-flow: row wrap;
      justify-content: center;
    }
  }
</style>

<script>
  class Player {
    constructor (index, name = "未命名", rock = 4, scissors = 4, paper = 4, star = 3) {
      this.index = index;
      this.name = name;
      this.rock = rock;
      this.scissors = scissors;
      this.paper = paper;
      this.star = star;
      this.status = "playing";
    }

    cardNumber () {
      return this.rock + this.scissors + this.paper;
    }
    play () {
      if (this.cardNumber() === 0) return null;
      let array = [];
      for (let i = 0; i < this.rock; i++) array.push(0);
      for (let i = 0; i < this.scissors; i++) array.push(1);
      for (let i = 0; i < this.paper; i++) array.push(2);
      let play = array[Math.floor(Math.random() * array.length)];
      this[["rock", "scissors", "paper"][play]]--;
      return play;
    }
  }
  import player from "./player"
  export default {
    name: 'animal',
    components: {player},
    data () {
      return {
        timeInterval: null,
        scene: 1,
        players: [],
        defaultPlayer: new Player("player1"),
        tempText: "",
      }
    },
    mounted () {
    },
    computed: {
      availablePlayers () {
        return this.players.filter(p => p.status === "playing");
      }
    },
    methods: {
      changeScene (scene) {
        if (this.scene !== scene) {
          this.scene = scene;
          switch (scene) {
            case 5:
              this.generatePlayers(10);
              break;
            case 6:
              this.startGame();
              break;
          }
        }
      },
      generatePlayers (number) {
        this.players = [];
        for (let i = 0; i < number; i++) {
          this.players.push(new Player(i, "player" + (i + 1)));
        }
      },
      startGame () {
        this.timeInterval = setInterval(() => {
          if (this.availablePlayers.length >= 2) {
            let randomSortAvailablePlayers = this.$u.shuffleArray(this.availablePlayers)
            let [indexA, indexB] = [randomSortAvailablePlayers[0].index, randomSortAvailablePlayers[1].index];
            let [playerA, playerB] = [this.players[indexA], this.players[indexB]];
            let playA = playerA.play(), playB = playerB.play();
            switch ((playA - playB + 3) % 3) {
              case 0:
                this.tempText = `${playerA.name}出${["石头","剪刀","布"][playA]}，${playerB.name}出${["石头","剪刀","布"][playB]}，平手`;
                break;
              case 1:
                playerA.star--;
                playerB.star++;
                this.tempText = `${playerA.name}出${["石头","剪刀","布"][playA]}，${playerB.name}出${["石头","剪刀","布"][playB]}，${playerB.name}胜`;
                break;
              case 2:
                playerA.star++;
                playerB.star--;
                this.tempText = `${playerA.name}出${["石头","剪刀","布"][playA]}，${playerB.name}出${["石头","剪刀","布"][playB]}，${playerA.name}胜`;
                break;
            }
            this.refreshPlayerStatus(playerA);
            this.refreshPlayerStatus(playerB);
          } else {
            clearInterval(this.timeInterval);
            alert("完成！");
          }
        }, 100);
      },
      refreshPlayerStatus (player) {
        if (player.star === 0) {
          player.status = "lose";
        } else {
          if (player.cardNumber() === 0) {
            player.status = player.star >= 3 ? "win" : "lose";
          }
        }
      }
    }
  }
</script>
