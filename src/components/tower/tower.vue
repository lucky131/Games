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
          <div class="ball wrath" :style="{opacity: characterData.wrath/100}"></div>
          <div class="ball greed" :style="{opacity: characterData.greed/100}"></div>
          <div class="ball envy" :style="{opacity: characterData.envy/100}"></div>
        </div>
        <div class="main">刚收到刚收到刚收到</div>
        <div class="ope"></div>
      </div>
      <div class="right">
        <div class="items"></div>
        <div class="desc">大法</div>
      </div>
    </div>
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
            &.greed{background-color: #233be8}
            &.envy{background-color: #b419a8}
            animation: ball 5s ease-in-out infinite alternate;
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
          height: 200px;
        }
      }
      .right{
        width: 500px;
        border-left: 1px solid #ccc;
        .items{
          width: 100%;
          height: 500px;
          border-bottom: 1px solid #ccc;
          overflow-y: auto;
        }
        .desc{
          width: 100%;
          height: 300px;
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
  import allCards from "./card"
  export default {
    name: "tower",
    data(){
      return{
        UIController: "menu",
        characterData: {},
      }
    },
    mixins: [allCards],
    mounted(){

    },
    methods: {
      initGame(){
        this.UIController = "normal";
        this.characterData = {
          wrath: 10,
          greed: 10,
          envy: 10,
        };
      },
    }
  }
</script>
