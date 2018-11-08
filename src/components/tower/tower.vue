<template>
  <div class="wrap">
    <div v-if="UIController==='menu'" class="menuUI">
      <div class="logo">没起名v1.0</div>
      <div class="menuBtn" @click="initGame()">Start</div>
      <div class="menuBtn">Load</div>
    </div>
    <div v-else-if="UIController==='normal'" class="normalUI">
      <div class="left">
        <div class="stat">
          <div class="ball wrath" :style="{opacity: characterData.wrath/100, animationDuration: 5200-50*characterData.wrath+'ms'}"></div>
          <div class="ball envy" :style="{opacity: characterData.envy/100, animationDuration: 5200-50*characterData.envy+'ms'}"></div>
          <div class="ball greed" :style="{opacity: characterData.greed/100, animationDuration: 5200-50*characterData.greed+'ms'}"></div>
        </div>
        <div class="main">{{allEvents[event].desc}}</div>
        <div class="ope">
          <div class="option"
               v-for="(option, index) in allEvents[event].options"
               :key="index"
               @click="chooseOption(event, index)">{{option.text}}</div>
        </div>
      </div>
      <div class="right">
        <div class="items">
          <img class="item"
               v-for="item in characterData.item"
               :key="item"
               :src="allItems[item].img"
               @mouseenter="mouseenterItem(item)"
               @mouseout="mouseoutItem()">
        </div>
        <div class="desc">{{displayItemId === 0 ? '' : allItems[displayItemId].name + '：' + allItems[displayItemId].desc}}</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .wrap{
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    .menuUI{
      display: flex;
      flex-flow: column nowrap;
      align-items: center;
      .logo{
        width: 300px;
        margin-bottom: 20px;
        font-size: 32px;
        text-align: center;
        font-weight: bold;
        cursor: default;
      }
      .menuBtn{
        width: 200px;
        height: 50px;
        margin-top: 20px;
        background-color: white;
        border-radius: 10px;
        border: 2px solid black;
        line-height: 50px;
        text-align: center;
        color: black;
        font-size: 24px;
        cursor: pointer;
        transition: color, background-color 200ms;
        &:hover{
          background-color: black;
          color: white;
        }
      }
    }
    .normalUI{
      display: flex;
      flex-flow: row nowrap;
      border: 1px solid #ccc;
      .left{
        width: 500px;
        .stat{
          width: 100%;
          height: 100px;
          border-bottom: 1px solid #ccc;
          display: flex;
          flex-flow: row nowrap;
          justify-content: space-around;
          align-items: center;
          .ball{
            width: 40px;
            height: 40px;
            border-radius: 50%;
            &.wrath{background-color: #ff442a}
            &.envy{background-color: #b419a8}
            &.greed{background-color: #233be8}
            animation: ball ease-in-out infinite alternate;
            @keyframes ball {
              from{
                transform: scale(1);
              }
              to{
                transform: scale(1.15);
              }
            }
          }
        }
        .main{
          width: 100%;
          height: 500px;
          padding: 10px;
          border-bottom: 1px solid #ccc;
          box-sizing: border-box;
          overflow-y: auto;
          font-size: 20px;
        }
        .ope{
          width: 100%;
          height: 150px;
          display: flex;
          flex-flow: row nowrap;
          .option{
            flex: 1 0 0;
            height: 100%;
            border-left: 1px solid #ccc;
            &:first-child{border-left: none}
            background-color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            color: black;
            font-size: 20px;
            cursor: pointer;
            transition: color, background-color 200ms;
            &:hover{
              background-color: black;
              color: white;
            }
          }
        }
      }
      .right{
        width: 500px;
        border-left: 1px solid #ccc;
        .items{
          width: 100%;
          height: 500px;
          padding-bottom: 20px;
          box-sizing: border-box;
          border-bottom: 1px solid #ccc;
          overflow-y: auto;
          display: flex;
          flex-flow: row wrap;
          justify-content: flex-start;
          align-content: flex-start;
          img.item{
            width: 72px;
            height: 72px;
            margin: 20px 0 0 20px;
            cursor: pointer;
            &:hover{
              background-color: #ccc;
            }
          }
        }
        .desc{
          width: 100%;
          height: 250px;
          padding: 10px;
          box-sizing: border-box;
          overflow-y: auto;
          font-size: 20px;
        }
      }
    }
  }
</style>

<script>
  import event from "./event"
  import item from "./item"
  export default {
    name: "tower",
    data(){
      return{
        UIController: "menu",
        characterData: {},
        events: [],
        event: null,
        displayItemId: 0,
      }
    },
    mixins: [event, item],
    mounted(){

    },
    methods: {
      initGame(){
        this.UIController = "normal";
        this.characterData = {
          wrath: 10,
          envy: 10,
          greed: 10,
          item: []
        };
        this.addEvents(0);
        this.gainItem(10);
        this.draw();
      },
      draw(){
        let len = this.events.length, randIndex;
        do{
          randIndex = Math.floor(Math.random() * len);
        } while(!this.judgeCondition(this.allEvents[this.events[randIndex]].condition));
        this.event = this.events[randIndex];
      },
      chooseOption(id, index){
        //处理result
        this.handleResult(this.allEvents[id].options[index].result);
        this.handleResult(this.allEvents[id].result);
        eval(this.allEvents[id].options[index].eval);
        eval(this.allEvents[id].eval);

        //处理once
        if(this.allEvents[id].once){
          let index = this.events.indexOf(this.event);
          if(index > -1){
            this.events.splice(index, 1);
          }
        }

        //处理下一张
        if(this.allEvents[id].options[index].nextEvent){
          //如果指定下一张
          this.event = this.allEvents[id].options[index].nextEvent;
        } else {
          //否则随机抽
          this.draw();
        }
      },
      judgeCondition(condition){
        let result = true;
        if(condition && condition.length === 2){
          let attr = condition[0], items = condition[1];

          //判断人物属性大于等于要求
          if(attr.length === 3){
            result = result
              && this.characterData.wrath >= attr[0]
              && this.characterData.envy >= attr[1]
              && this.characterData.greed >= attr[2];
          } else return false;

          //判断是否持有物品
          for(let item of items){
            result = result && this.characterData.item.indexOf(item) > -1;
          }
        }
        return result;
      },
      handleResult(result){
        if(result && result.length === 3){
          let attr = result[0], items = result[1], events = result[2];

          //人物属性
          if(attr.length === 3){
            this.characterData.wrath += attr[0];
            this.characterData.envy += attr[1];
            this.characterData.greed += attr[2];
          }

          //物品
          for(let item of items){
            if(item > 0){
              //获取
              this.gainItem(item);
            } else {
              //丢弃
              this.dropItem(-item);
            }
          }

          //添加事件
          this.addEvents(...events);
        }
      },
      gainItem(...ids){
        for(let id of ids){
          if(this.characterData.item.indexOf(id) === -1 && this.allItems[id]){
            this.characterData.item.push(id);
          }
        }
      },
      dropItem(...ids){
        for(let id of ids){
          let index = this.characterData.item.indexOf(id);
          if(index > -1){
            this.characterData.item.splice(index, 1);
          }
        }
      },
      addEvents(...events){
        for(let event of events){
          if(typeof event === "number"){
            //单个数字，表示单个事件，直接加入
            this.events.push(event);
          } else if(typeof event === "object"){
            //如果为数组，先判断其长度，为1或2
            if(event.length === 1){
              //若长度为1，则为单个事件，直接加入
              this.events.push(event[0]);
            } else if(event.length === 2){
              //若长度为2，则表示事件范围
              let min = event[0], max = event[1];
              for(let i = min; i <= max; i++){
                if(this.allEvents[i]){
                  this.events.push(i);
                }
              }
            }
          }
        }
      },
      mouseenterItem(itemId){
        this.displayItemId = itemId;
      },
      mouseoutItem(){
        this.displayItemId = 0;
      }
    }
  }
</script>
