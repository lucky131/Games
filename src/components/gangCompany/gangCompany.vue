<template>
  <div class="gang-company" :style="{height: height + 'px'}">

    <div v-if="UIController === 'tutorial'" class="page tutorial" @click="skipTutorialAnimating()">
      <div class="tutorial-complete-text">{{tutorialCompleteText}}
        <div class="tutorial-text">{{tutorialText}}</div>
      </div>
      <div class="tutorial-btn" :class="{'tutorial-btn__transparent': isTutorialAnimating}" @click.stop="UIController='main'"><i class="el-icon-arrow-right"></i></div>
    </div>

    <div v-else-if="UIController === 'main'" class="page main">
      <div class="main-top">
        <div class="main-top-left">
          <div class="row">第{{day}}天 {{weekday}}</div>
          <div class="row">总资产：{{money}}</div>
          <div class="row">今日预计收益：233</div>
        </div>
        <div class="main-top-next">下班</div>
      </div>
      <div v-if="mainType === 'personal'" class="main-center personal">
        <div class="info-label">总资产</div><div class="info-value">{{money}}</div>
      </div>
      <div v-else-if="mainType === 'company'" class="main-center company">
        <div class="opes">
          <div class="ope-btn" @click="UIController='decoration'"><i class="el-icon-brush"></i><span>装修</span></div>
          <div class="ope-btn"><i class="el-icon-office-building"></i><span>迁址</span></div>
          <div class="ope-btn"><i class="el-icon-bank-card"></i><span>贷款</span></div>
          <div class="ope-btn"><i class="el-icon-news"></i><span>广告</span></div>
        </div>
        <div class="card">
          <div class="card-title">公司概况</div>
          <div class="card-content">
            <div class="info-label">公司名称</div><div class="info-value">杭州三杠科技有限公司</div>
            <div class="info-label">公司地址</div><div class="info-value">{{company.building.address}}</div>
            <div class="info-label">公司规模</div><div class="info-value">1人 / {{company.building.size}}人</div>
          </div>
        </div>
        <div class="card">
          <div class="card-title">每日盈利</div>
          <div class="card-content">
            <div class="info-label">基本盈利</div><div class="info-value">0</div>
          </div>
        </div>
        <div class="card">
          <div class="card-title">每日开销</div>
          <div class="card-content">
            <div class="info-label">房租</div><div class="info-value">{{company.building.rent}}</div>
            <div class="info-label">电费</div><div class="info-value">100</div>
            <div class="info-label">网费</div><div class="info-value">50</div>
            <div class="info-label">广告费</div><div class="info-value">200</div>
          </div>
        </div>
      </div>
      <div v-else-if="mainType === 'employee'" class="main-center employee"></div>
      <div class="main-bottom">
        <div v-for="type in mainTypes" :key="type.value"
             class="main-bottom-btn" :class="{'main-bottom-btn__selected': mainType === type.value}"
             @click="mainType=type.value">{{type.label}}</div>
      </div>
    </div>

    <div v-else-if="UIController === 'decoration'" class="page decoration">
      <div class="decoration-header">
        <div class="row">总资产：{{money}}</div>
        <div class="row">办公环境：</div>
      </div>
      <div class="decoration-content">
        <one-decoration v-for="(d, index) in allDecorations" :key="d.value"
                        :text="d.name" :size="company.building.size" :price="d.price" :money="money" :already-buy="company.decoration[index]"
                        @buy="buyDecoration(index)"></one-decoration>
      </div>
      <div class="decoration-back" @click="UIController='main'"><i class="el-icon-back"></i></div>
    </div>

    <div v-else-if="UIController === 'xxx'" class="page xxx"></div>

  </div>
</template>

<style scoped lang="scss">
  $headerFooterGray: #e1e1e6;
  *{
    box-sizing: border-box;
  }
  .gang-company{
    width: 100vw;
    .page{
      width: 100%;
      height: 100%;
      display: flex;
      flex-flow: column nowrap;
      justify-content: center;
      align-items: center;
    }
    .tutorial{
      .tutorial-complete-text{
        width: 80%;
        margin-bottom: 60px;
        color: rgba(0,0,0,0);
        position: relative;
        .tutorial-text{
          position: absolute;
          top: 0;
          color: black;
        }
      }
      .tutorial-btn{
        width: 100px;
        height: 50px;
        line-height: 50px;
        background-color: cornflowerblue;
        color: white;
        font-size: 36px;
        text-align: center;
        &.tutorial-btn__transparent{
          opacity: 0;
        }
      }
    }
    .main{
      .main-top{
        width: 100%;
        height: 80px;
        background-color: $headerFooterGray;
        display: flex;
        flex-flow: row nowrap;
        .main-top-left{
          flex: 1 0 0;
          height: 100%;
          padding: 8px 20px;
          .row{}
        }
        .main-top-next{
          width: 60px;
          height: 60px;
          line-height: 60px;
          background-color: lightgreen;
          border-radius: 10px;
          margin: 10px;
          font-size: 20px;
          text-align: center;
        }
      }
      .main-center{
        width: 100%;
        flex: 1 0 0;
        overflow-y: auto;
        &.personal{
          .info-label{
            text-align: center;
            font-size: 20px;
            margin-top: 20px;
          }
          .info-value{
            text-align: center;
            color: #888;
          }
        }
        &.company{
          .opes{
            width: 100%;
            padding: 0 10px;
            display: flex;
            flex-flow: row nowrap;
            .ope-btn{
              flex: 1 0 0;
              padding: 10px 0;
              display: flex;
              flex-flow: column nowrap;
              align-items: center;
              i{
                font-size: 24px;
                margin-bottom: 4px;
              }
              span{}
            }
          }
          .card{
            margin-left: 10px;
            margin-right: 10px;
            margin-bottom: 10px;
            &:last-child{margin-top: 0}
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 0 4px rgba(0,0,0,.1);
            .card-title{
              height: 30px;
              line-height: 30px;
              background-color: #e7eaef;
              padding-left: 10px;
            }
            .card-content{
              padding-top: 20px;
              .info-label{
                text-align: center;
                font-size: 20px;
              }
              .info-value{
                text-align: center;
                color: #888;
                margin-bottom: 20px;
              }
            }
          }
        }
        &.employee{
          background-color: lightpink;
        }
      }
      .main-bottom{
        width: 100%;
        height: 60px;
        line-height: 60px;
        background-color: $headerFooterGray;
        text-align: center;
        display: flex;
        flex-flow: row nowrap;
        .main-bottom-btn{
          flex: 1 0 0;
          height: 100%;
          position: relative;
          &.main-bottom-btn__selected{
            background-color: #d5d5da;
            font-weight: bold;
            &:before{
              content: "";
              width: 100%;
              height: 4px;
              background-color: #b4b4b9;
              position: absolute;
              top: 0;
              left: 0;
            }
          }
        }
      }
    }
    .decoration{
      .decoration-header{
        width: 100%;
        height: 60px;
        background-color: $headerFooterGray;
        padding: 8px 20px;
        .row{

        }
      }
      .decoration-content{
        width: 100%;
        flex: 1 0 0;
        overflow-y: auto;
      }
      .decoration-back{
        width: 100%;
        height: 60px;
        line-height: 60px;
        background-color: $headerFooterGray;
        font-size: 32px;
        text-align: center;
      }
    }
  }
</style>

<script>
  //components
  import oneDecoration from "./one-decoration"

  //mixins
  import buildings from "./buildings"
  import decorations from "./decorations"

  export default {
    name: "gangCompany",
    mixins: [buildings, decorations],
    components: {oneDecoration},
    data(){
      return{
        height: 0,
        UIController: "",
        tutorialCompleteText: "我是杠三杠，最近刚创立了杭州三杠科技有限公司，目前公司只有我一个人，我得想办法扩张公司的规模...",
        tutorialText: "",
        isTutorialAnimating: true,
        tutorialAnimationTimer: null,
        mainType: "personal",
        mainTypes: [
          {
            label: "个人",
            value: "personal"
          },
          {
            label: "公司",
            value: "company"
          },
          {
            label: "员工",
            value: "employee"
          }
        ],
        money: 0,
        day: 0,
        personal: {},
        company: {
          building: {
            id: "",
            address: "",
            size: 0,
            rent: 0,
          },
          decoration: [
            false, //blanket
            false, //wall
            false, //windows
            false, //light
            false, //table
            false, //wc
            false, //plant
            false, //sofa
            false, //airCon
            false, //coffee
            false, //snack
          ],
        },
        employee: {}
      }
    },
    computed: {
      weekday(){
        return ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"][this.day % 7];
      }
    },
    mounted(){
      window.vue = this;
      this.height = window.innerHeight;

      this.initGame();
    },
    methods: {
      initGame(){
        //各项数据初始化
        this.UIController = "tutorial";
        this.tutorialText = "";
        this.isTutorialAnimating = true;
        this.tutorialAnimationTimer = null;
        this.mainType = "personal";
        this.money = 5000;
        this.day = 1;
        this.personal = {};
        this.company = {
          building: this.allBuildings[0],
          decoration: [
            false, //blanket
            false, //wall
            false, //windows
            false, //light
            false, //table
            false, //wc
            false, //plant
            false, //sofa
            false, //airCon
            false, //coffee
            false, //snack
          ],
        };
        this.employee = {};

        this.tutorialAnimationTimer = setInterval(() => {
          let length = this.tutorialText.length;
          if(length === this.tutorialCompleteText.length){
            this.isTutorialAnimating = false;
            clearInterval(this.tutorialAnimationTimer);
          } else {
            this.tutorialText += this.tutorialCompleteText.substring(length, length + 1);
          }
        }, 100);
      },
      skipTutorialAnimating(){
        if(this.isTutorialAnimating){
          clearInterval(this.tutorialAnimationTimer);
          this.tutorialText = this.tutorialCompleteText;
          this.isTutorialAnimating = false;
        }
      },
      buyDecoration(index){
        this.money -= this.company.building.size * this.allDecorations[index].price;
        this.company.decoration[index] = true;
      }
    }
  }
</script>
