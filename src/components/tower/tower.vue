<template>
  <div class="wrap" :style="{height: height + 'px'}">

    <div v-if="UIController==='menu'" class="menuUI">
      <div class="logo">没起名v1.0</div>
      <div class="menuBtn" @click="initGame()">Start</div>
      <div class="menuBtn">Load</div>
    </div>

    <div v-else-if="UIController==='normal'" class="normalUI">
      <div class="stat">
        <div class="ball wrath" :style="{opacity: characterData.wrath/100, animationDuration: Math.max(200, 5200-50*characterData.wrath)+'ms'}"></div>
        <div class="ball envy" :style="{opacity: characterData.envy/100, animationDuration: Math.max(200, 5200-50*characterData.envy)+'ms'}"></div>
        <div class="ball greed" :style="{opacity: characterData.greed/100, animationDuration: Math.max(200, 5200-50*characterData.greed)+'ms'}"></div>
      </div>
      <div class="main">{{allEvents[event].desc}}</div>
      <div class="ope">
        <div class="option"
             v-for="(option, index) in allEvents[event].options"
             :key="index"
             v-if="judgeCondition(allEvents[event].options[index].condition)"
             @click="chooseOption(event, index)">{{option.text}}</div>
      </div>
      <div class="menuBar">
        <div class="menuBarBtn" @click="UIController='bag';displayItemId=0;">
          <i class="el-icon-goods"></i>
          <span>背包</span>
        </div>
        <div class="menuBarBtn" @click="UIController='system'">
          <i class="el-icon-setting"></i>
          <span>系统</span>
        </div>
      </div>
    </div>

    <div v-else-if="UIController==='bag'" class="bagUI">
      <div class="items">
        <img :class="{item: true, display: displayItemId===item}"
             v-for="item in characterData.item"
             :key="item"
             :src="allItems[item].img"
             @click="displayItemId=item">
      </div>
      <div class="desc">{{displayItemId === 0 ? '' : allItems[displayItemId].name + '：' + allItems[displayItemId].desc}}</div>
      <div class="backRow" @click="UIController='normal'">
        <div class="btn">
          <i class="el-icon-back"></i>
          <span>返回</span>
        </div>
      </div>
    </div>

    <div v-else-if="UIController==='system'" class="systemUI">
      <div class="systems">

      </div>
      <div class="backRow" @click="UIController='normal'">
        <div class="btn">
          <i class="el-icon-back"></i>
          <span>返回</span>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped lang="scss">
  .wrap{
    width: 100vw;
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
        &:active{
          background-color: black;
          color: white;
        }
      }
    }
    .normalUI{
      width: 100%;
      height: 100%;
      display: flex;
      flex-flow: column nowrap;
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
        flex: 1 0 0;
        padding: 10px;
        border-bottom: 1px solid #ccc;
        box-sizing: border-box;
        overflow-y: auto;
        font-size: 20px;
        white-space: pre-wrap;
      }
      .ope{
        width: 100%;
        .option{
          width: 100%;
          height: 60px;
          padding: 0 10px;
          border-bottom: 1px solid #ccc;
          box-sizing: border-box;
          background-color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: black;
          font-size: 20px;
          cursor: pointer;
          transition: color, background-color 200ms;
          &:active{
            background-color: black;
            color: white;
          }
        }
      }
      .menuBar{
        width: 100%;
        height: 100px;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-around;
        align-items: center;
        .menuBarBtn{
          width: 100px;
          height: 100px;
          display: flex;
          flex-flow: column nowrap;
          justify-content: center;
          align-items: center;
          i{
            font-size: 32px;
            margin-bottom: 10px;
          }
        }
      }
    }
    .bagUI{
      width: 100%;
      height: 100%;
      display: flex;
      flex-flow: column nowrap;
      .items{
        width: 100%;
        height: 400px;
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
          /*&:hover{*/
            /*background-color: #ccc;*/
          /*}*/
          &.display{
            background-color: #ccc;
          }
        }
      }
      .desc{
        width: 100%;
        flex: 1 0 0;
        padding: 10px;
        border-bottom: 1px solid #ccc;
        box-sizing: border-box;
        overflow-y: auto;
        font-size: 20px;
        white-space: pre-wrap;
      }
      .backRow{
        width: 100%;
        height: 100px;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-around;
        align-items: center;
        .btn{
          width: 100px;
          height: 100px;
          display: flex;
          flex-flow: column nowrap;
          justify-content: center;
          align-items: center;
          i{
            font-size: 32px;
            margin-bottom: 10px;
          }
        }
      }
    }
    .systemUI{
      width: 100%;
      height: 100%;
      display: flex;
      flex-flow: column nowrap;
      .systems{
        width: 100%;
        flex: 1 0 0;
        border-bottom: 1px solid #ccc;
      }
      .backRow{
        width: 100%;
        height: 100px;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-around;
        align-items: center;
        .btn{
          width: 100px;
          height: 100px;
          display: flex;
          flex-flow: column nowrap;
          justify-content: center;
          align-items: center;
          i{
            font-size: 32px;
            margin-bottom: 10px;
          }
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
        height: 0,
        UIController: "menu",
        characterData: {
          wrath: 0,
          envy: 0,
          greed: 0,
          item: []
        },
        events: [],
        event: null,
        displayItemId: 0,
        notifyPromise: Promise.resolve()
      }
    },
    mixins: [event, item],
    mounted(){
      window.vue = this;

      this.height = window.innerHeight;
    },
    methods: {
      message(text){
        this.$message({
          message: text,
          type: "success",
          duration: 2000,
          showClose: false
        });
      },
      notify(msg) {
        this.notifyPromise = this.notifyPromise.then(this.$nextTick).then(()=>{
          this.$notify({
            message: msg,
            showClose: false,
            duration: 1500,
          });
        });
      },
      initGame(){
        this.UIController = "normal";
        this.setAttr(30,30,30);
        this.characterData.item = [];
        this.event = null;
        this.events = [];
        this.displayItemId = 0;
        this.addEvents(0);
        this.draw();
      },
      draw(){
        let len = this.events.length, randIndex, last = this.event;
        do{
          randIndex = Math.floor(Math.random() * len);
        } while(!this.judgeCondition(this.allEvents[this.events[randIndex]].condition) || this.events[randIndex] === last);
        this.event = this.events[randIndex];
      },
      chooseOption(id, index){
        //已触发结局事件，直接重开
        // if([2,3,4,5,6,7,237].indexOf(this.event) > -1){
        //   this.initGame();
        //   return;
        // }
        if(this.allEvents[id].ending){
          this.initGame();
          return;
        }

        //处理result
        this.handleResult(this.allEvents[id].options[index].result);
        this.handleResult(this.allEvents[id].result);
        eval(this.allEvents[id].options[index].eval);
        eval(this.allEvents[id].eval);

        //判断是否死亡
        if(this.characterData.wrath <= 0){
          this.event = 2;
          return;
        } else if(this.characterData.envy <= 0){
          this.event = 3;
          return;
        } else if(this.characterData.greed <= 0){
          this.event = 4;
          return;
        } else if(this.characterData.wrath > 100){
          this.event = 5;
          return;
        } else if(this.characterData.envy > 100){
          this.event = 6;
          return;
        } else if(this.characterData.greed > 100){
          this.event = 7;
          return;
        }

        //处理once
        if(this.allEvents[id].once){
          let index = this.events.indexOf(this.event);
          if(index > -1){
            this.events.splice(index, 1);
          }
        }

        //处理下一张
        if(this.allEvents[id].options[index].next){
          //如果指定下一张
          this.event = this.allEvents[id].options[index].next;
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
      setAttr(wrath, envy, greed){
        if(wrath !== null)
          this.characterData.wrath = wrath;
        if(envy !== null)
          this.characterData.envy = envy;
        if(greed !== null)
          this.characterData.greed = greed;
      },
      changeAttr(wrath, envy, greed){
        if(wrath !== null)
          this.characterData.wrath += wrath;
        if(envy !== null)
          this.characterData.envy += envy;
        if(greed !== null)
          this.characterData.greed += greed;
      },
      swapAttr(type){
        let temp;
        switch (type){
          case 0:
            temp = this.characterData.envy;
            this.characterData.envy = this.characterData.greed;
            this.characterData.greed = temp;
            break;
          case 1:
            temp = this.characterData.wrath;
            this.characterData.wrath = this.characterData.greed;
            this.characterData.greed = temp;
            break;
          case 2:
            temp = this.characterData.wrath;
            this.characterData.wrath = this.characterData.envy;
            this.characterData.envy = temp;
            break;
        }
      },
      gainItem(id){
        if(this.characterData.item.indexOf(id) === -1 && this.allItems[id]){
          this.characterData.item.push(id);
          this.notify('获得道具：' + this.allItems[id].name);
        }
      },
      dropItem(id){
        let index = this.characterData.item.indexOf(id);
        if(index > -1){
          this.characterData.item.splice(index, 1);
          this.notify('丢失道具：' + this.allItems[id].name);
        }
      },
      addEvents(...events){
        for(let event of events){
          if(typeof event === "number"){
            //单个数字，表示单个事件，直接加入
            this.addOneEvent(event);
          } else if(typeof event === "object"){
            //如果为数组，先判断其长度，为1或2
            if(event.length === 1){
              //若长度为1，则为单个事件，直接加入
              this.addOneEvent(event[0]);
            } else if(event.length === 2){
              //若长度为2，则表示事件范围
              let min = event[0], max = event[1];
              for(let i = min; i <= max; i++){
                this.addOneEvent(i);
              }
            }
          }
        }
      },
      addOneEvent(eventId){
        //保证事件库里有此事件 且 此事件为非禁用 且 事件池里的事件不重复
        if(this.allEvents[eventId] && !this.allEvents[eventId].disabled && this.events.indexOf(eventId) === -1)
          this.events.push(eventId);
      },
    }
  }
</script>
