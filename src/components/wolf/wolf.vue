<template>
  <div class="wrap">
    <div class="block">
      <div class="title">玩家</div>
      <div v-if="step===0" class="playerBtns">
        <el-checkbox-group v-model="players">
          <el-checkbox v-for="item in allPlayers" :key="item" :model="item" :label="item" size="small" border></el-checkbox>
        </el-checkbox-group>
      </div>
      <div v-if="step!==0" class="playerPreview">
        <el-button v-for="item in players" :key="item" size="small" type="primary" disabled>{{item}}</el-button>
      </div>
      <div class="stat">共{{players.length}}人</div>
      <el-button v-if="step===0" type="primary" :disabled="players.length<6" @click="step1()">下一步</el-button>
    </div>

    <div v-if="step===1" class="block">
      <div class="title">配置</div>
      <div class="config">
        <div class="oneChar" v-for="(item, index) in config.card" :key="item.name">
          <div class="charName">{{item.name}}</div>
          <div class="charImg"><img :src="item.imgUrl"></div>
          <el-input-number class="charOpe"
                           v-model="item.number"
                           :min="0"
                           :max="maxCard(index)"
                           :disabled="index === config.indexOfVillager"
                           @change="cardChange()"></el-input-number>
        </div>
      </div>
      <div class="stat">共{{config.numberOfCard}}张牌</div>
      <el-button type="primary" @click="step2()">下一步</el-button>
    </div>

    <div v-if="step===2" class="block">
      <div class="title">配置</div>
      <div class="configShow">
        <div class="oneConfigShow" v-for="item in config.card" :key="item.name" v-if="item.number>0">
          <img :src="item.imgUrl">
          <span class="name">{{item.name}}</span>
          <span class="x">×</span>
          <span class="number">{{item.number}}</span>
        </div>
      </div>
      <div class="stat">共{{config.numberOfCard}}张牌</div>
    </div>

    <div v-if="step===2" class="block">
      <div class="title">发牌</div>
      <div class="result"><span v-html="result"></span></div>
      <el-button type="primary" @click="shuffle()">洗牌</el-button>
      <el-button type="primary" @click="copy()">复制到剪切板</el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .wrap{
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 10px;
    box-sizing: border-box;
    display: flex;
    flex-flow: column nowrap;
    align-content: center;
    .block{
      width: 100%;
      padding-bottom: 20px;
      border-bottom: 1px solid #ccc;
      .title{
        width: 100%;
        height: 60px;
        line-height: 60px;
        margin: 10px 0;
        font-size: 30px;
        font-weight: bold;
      }
      .playerBtns{
        .el-checkbox{
          margin: 0 10px 10px 0;
        }
      }
      .playerPreview{
        .el-button{
          margin: 0 10px 10px 0;
        }
      }
      .stat{
        width: 100%;
        margin: 20px 0;
        font-size: 20px;
      }
      .config{
        display: flex;
        flex-flow: row wrap;
        justify-content: space-around;
        .oneChar{
          width: 200px;
          height: 300px;
          margin: 10px 40px;
          .charName{
            width: 100%;
            height: 50px;
            line-height: 50px;
            font-size: 20px;
            text-align: center;
            border: 1px solid #a9a9a9;
            border-bottom: none;
          }
          .charImg{
            width: 100%;
            height: 200px;
            img{
              width: 100%;
              height: 100%;
            }
          }
          .charOpe{
            width: 100%;
            height: 50px;
          }
        }
      }
      .configShow{
        font-size: 20px;
        .oneConfigShow{
          width: 100%;
          height: 60px;
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          img{
            width: 40px;
            height: 40px;
          }
          .name{
            width: 80px;
            margin-left: 30px;
          }
          .x{
            width: 30px;
          }
          .number{

          }
        }
      }
      .result{
        font-size: 20px;
        margin-bottom: 20px;
        line-height: 1.5;
      }
    }
  }
</style>

<script>
  export default {
    name: "wolf",
    data(){
      return{
        step: 0,
        allPlayers: ["lyh", "社长", "cx", "杨乐", "小虹",
          "阿花", "亦哲", "yyy", "子豪", "wjb",
          "宇城", "234", "yyr", "李云", "阿喵",
          "hly", "书记", "叶绿", "虞诗雅", "zxy",
          "板板", "lyg"],
        players: [],
        numberOfPlayer: 0,
        config: {
          card: [
            {name: "狼人", imgUrl: require("./img/wolf.jpg"), number: 0},
            {name: "狼孩子", imgUrl: require("./img/wolfChild.jpg"), number: 0},
            {name: "女巫", imgUrl: require("./img/witch.jpg"), number: 0},
            {name: "先知", imgUrl: require("./img/seer.jpg"), number: 0},
            {name: "猎人", imgUrl: require("./img/hunter.jpg"), number: 0},
            {name: "守卫", imgUrl: require("./img/guard.jpg"), number: 0},
            {name: "丘比特", imgUrl: require("./img/cupid.jpg"), number: 0},
            {name: "盗贼", imgUrl: require("./img/thief.jpg"), number: 0},
            {name: "村民", imgUrl: require("./img/villager.jpg"), number: 0},
          ],
          indexOfThief: 7,
          indexOfVillager: 8,
          numberOfCard: 0,
        },
        result: "",
      }
    },
    created(){
      //允许选择文本
      document.onselectstart = function(){
        event.returnValue = true;
      };
    },
    mounted(){

    },
    methods: {
      step1(){
        this.step = 1;
        this.config.numberOfCard = this.players.length;
        this.config.card[this.config.indexOfVillager].number = this.players.length;
      },
      maxCard(i){
        let total = this.config.numberOfCard;
        if(i === this.config.indexOfThief)
          return 1;
        if(i === this.config.indexOfVillager)
          return total;
        for(let index in this.config.card){
          if(index != this.config.indexOfVillager && index != i){ //index是string 不能用!==
            total -= this.config.card[index].number;
          }
        }
        return total;
      },
      cardChange(){
        if(this.config.card[this.config.indexOfThief].number > 0){
          this.config.numberOfCard = this.players.length + 2;
        } else {
          this.config.numberOfCard = this.players.length;
        }

        let total = this.config.numberOfCard;
        for(let index in this.config.card){
          if(index != this.config.indexOfVillager){ //村民不计入统计 index是string 不能用!==
            total -= this.config.card[index].number;
          }
        }

        //剩余全给村民
        this.config.card[this.config.indexOfVillager].number = total;
      },
      step2(){
        this.step = 2;
        this.shuffle();
      },
      copyArray(arr){
        let newArr = [];
        for(let index in arr){
          newArr.push(arr[index]);
        }
        return newArr;
      },
      shuffleArray(arr){
        let length = arr.length,
          randomIndex,
          temp;
        while (length) {
          randomIndex = Math.floor(Math.random() * (length--));
          temp = arr[randomIndex];
          arr[randomIndex] = arr[length];
          arr[length] = temp
        }
        return arr;
      },
      shuffle(){
        //拷贝一份玩家数组，用于打乱顺序
        let tempPlayers = this.copyArray(this.players);
        this.shuffleArray(tempPlayers);

        //创建卡牌数组，用于抽牌
        let cards = [];
        for(let index in this.config.card){
          for(let i=0;i<this.config.card[index].number;i++){
            cards.push(this.config.card[index].name);
          }
        }

        //抽牌
        let result = "";
        for(let index in tempPlayers){
          let num = parseInt(index)+1;
          result += num + tempPlayers[index] + " ";
          let rand = Math.floor(Math.random()*cards.length);
          result += cards[rand] + "<br>";
          cards.splice(rand, 1);
        }
        if(cards.length>0){
          result+="剩余："+cards.join(" ");
        }

        this.result = result;
      },
      copy(){
        let oInput = document.createElement("textarea");
        oInput.value = this.result.replace(/<br>/g, "\n");
        document.body.appendChild(oInput);
        oInput.select(); // 选择对象
        document.execCommand("Copy"); // 执行浏览器复制命令
        oInput.style.display = "none";
        this.$alert("复制成功");
      }
    }
  }
</script>
