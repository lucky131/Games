<template>
  <div class="wrap">
    <div v-if="UIController==='selectCard'" class="selectCardUI cardUI">
      <div class="left">
        <div class="list">
          <div v-for="(card, index) in selectCardList" :key="index" :class="{oneCard: true, selected: card.selected}"
               @mouseenter="mouseenterSelectCard(index)"
               @mouseleave="mouseleaveSelectCard()"
               @click="clickSelectCard(index)"></div>
        </div>
        <div v-if="getSelectCardListNumber() === 1" class="confirm able">√</div>
        <div v-else class="confirm disabled">{{getSelectCardListNumber()}}/1</div>
      </div>
      <div class="desc">
        <div class="cardName" :style="{color: getQualityColor(cardDesc.quality)}">{{cardDesc.name}}</div>
        <div class="cardDesc">{{cardDesc.desc}}</div>
      </div>
    </div>
    <div v-else-if="UIController==='normal'" class="normalUI"></div>
  </div>
</template>

<style scoped lang="scss">
  .cardUI{
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 5px 5px 20px rgba(0,0,0,.2);
  }
</style>
<style scoped lang="scss">
  .wrap{
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    .selectCardUI{
      width: 600px;
      height: 500px;
      display: flex;
      .left{
        width: 400px;
        height: 100%;
        .list{
          width: 100%;
          height: 400px;
          padding: 16px 0 0 16px;
          box-sizing: border-box;
          display: flex;
          flex-flow: row wrap;
          align-content: start;
          .oneCard{
            width: 80px;
            height: 80px;
            background-color: #eee;
            margin: 0 16px 16px 0;
            box-sizing: border-box;
            cursor: pointer;
            &.selected{
              border: 3px solid green;
            }
          }
        }
        .confirm{
          width: 100%;
          height: 100px;
          line-height: 100px;
          color: white;
          font-size: 50px;
          font-weight: bold;
          text-align: center;
          &.able{background-color: green; cursor: pointer}
          &.disabled{background-color: #ccc; cursor: no-drop}
        }
      }
      .desc{
        width: 200px;
        height: 100%;
        border-left: 1px solid #ccc;
        box-sizing: border-box;
        .cardName{
          width: 100%;
          height: 50px;
          line-height: 50px;
          font-size: 24px;
          font-weight: bold;
          text-align: center;
          border-bottom: 1px solid #ccc;
        }
        .cardDesc{
          width: 100%;
          padding: 10px;
          box-sizing: border-box;
        }
      }
    }
    .normalUI{
      width: 600px;
      height: 600px;
      background-color: yellow;
    }
  }
</style>

<script>
  import allCards from "./card"
  export default {
    name: "tower",
    data(){
      return{
        UIController: "",
        characterData: {},
        selectCardList: [],
        cardDesc: {},
      }
    },
    mixins: [allCards],
    mounted(){
      this.initGame();
    },
    methods: {
      initGame(){
        this.UIController = "selectCard";
        this.characterData = {
          hp: 100,
          maxHp: 100,
          deck: [],
        };
        this.selectCardList = [];
        for(let i=100;i<=102;i++){
          this.selectCardList.push({
            id: i,
            selected: false
          });
        }
        this.cardDesc = {
          id: 0,
          name: "",
          quality: 0,
          desc: "",
        };
      },
      getQualityColor(quality){
        if(quality === 0) return "#ccc";
        if(quality === 1) return "#0088ff";
        if(quality === 2) return "#a100eb";
        if(quality === 3) return "#ff9600";
      },
      getSelectCardListNumber(){
        let number = 0;
        for(let index in this.selectCardList){
          if(this.selectCardList[index].selected)
            number++;
        }
        return number;
      },
      mouseenterSelectCard(index){
        this.cardDesc = this.allCards[this.selectCardList[index].id];
      },
      mouseleaveSelectCard(){
        this.cardDesc = {
          id: 0,
          name: "",
          quality: 0,
          desc: "",
        };
      },
      clickSelectCard(index){
        if(this.selectCardList[index].selected){
          this.selectCardList[index].selected = false;
        } else {
          for(let i in this.selectCardList){
            this.selectCardList[i].selected = false;
          }
          this.selectCardList[index].selected = true;
        }
      }
    }
  }
</script>
