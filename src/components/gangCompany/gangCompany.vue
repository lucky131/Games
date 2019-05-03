<template>
  <div class="gang-company" :style="{height: height + 'px'}">

    <!--初始界面-->
    <div v-if="UIController === 'tutorial'" class="page tutorial" @click="skipTutorialAnimating()">
      <div class="tutorial-complete-text">{{tutorialCompleteText}}
        <div class="tutorial-text">{{tutorialText}}</div>
      </div>
      <div v-if="isTutorialAnimating" class="tutorial-btn tutorial-btn__transparent"></div>
      <div v-else class="tutorial-btn" @click.stop="UIController='main'"><i class="el-icon-arrow-right"></i></div>
    </div>

    <!--主界面-->
    <div v-else-if="UIController === 'main'" class="page main">
      <div class="main-top">
        <div class="main-top-left">
          <div class="row">第{{day}}天 {{weekday}}</div>
          <div class="row">总资产：{{$u.formatIntegerNumber(money, config.formatIntegerNumberMode)}}</div>
          <div class="row">今日预计收益：
            <span :class="{'__text-green': totalEarn>0, '__text-gray': totalEarn===0, '__text-red': totalEarn<0}">{{$u.formatIntegerNumber(totalEarn, config.formatIntegerNumberMode)}}</span>
          </div>
        </div>
        <div class="main-top-next">下班</div>
      </div>
      <!--个人-->
      <div v-if="mainType === 'personal'" class="main-center personal">
        <div class="info-label">总资产</div><div class="info-value">{{$u.formatIntegerNumber(money, config.formatIntegerNumberMode)}}</div>
      </div>
      <!--公司-->
      <div v-else-if="mainType === 'company'" class="main-center company">
        <div class="opes">
          <div class="ope-btn" @click="UIController='decoration'"><i class="el-icon-brush"></i><span>装修</span></div>
          <div class="ope-btn" @click="UIController='relocation'"><i class="el-icon-office-building"></i><span>迁址</span></div>
          <div class="ope-btn" @click="UIController='server'"><i class="el-icon-cloudy"></i><span>服务器</span></div>
          <div class="ope-btn"><i class="el-icon-bank-card"></i><span>贷款</span></div>
          <div class="ope-btn"><i class="el-icon-news"></i><span>广告</span></div>
        </div>
        <div class="card">
          <div class="card-title">公司概况</div>
          <div class="card-content">
            <div class="info-label">公司名称</div><div class="info-value">杭州三杠科技有限公司</div>
            <div class="info-label">公司地址</div><div class="info-value">{{company.building.address}}</div>
            <div class="info-label">公司规模</div><div class="info-value">{{$u.formatIntegerNumber(numberOfEmployee, config.formatIntegerNumberMode)}}人 / {{$u.formatIntegerNumber(company.building.size, config.formatIntegerNumberMode)}}人</div>
            <div class="info-label">办公环境</div><div class="info-value" v-html="environmentHtml"></div>
          </div>
        </div>
        <div class="card">
          <div class="card-title">每日盈利</div>
          <div class="card-content">
            <div class="info-label">基本盈利</div><div class="info-value">{{$u.formatIntegerNumber(profit.base, config.formatIntegerNumberMode)}}</div>
          </div>
        </div>
        <div class="card">
          <div class="card-title">每日开销</div>
          <div class="card-content">
            <div class="info-label">房租</div><div class="info-value">{{$u.formatIntegerNumber(cost.rent, config.formatIntegerNumberMode)}}</div>
            <div class="info-label">电费</div><div class="info-value">{{$u.formatIntegerNumber(cost.electricity, config.formatIntegerNumberMode)}}</div>
            <div class="info-label">网费</div><div class="info-value">{{$u.formatIntegerNumber(cost.net, config.formatIntegerNumberMode)}}</div>
            <div class="info-label">广告费</div><div class="info-value">{{$u.formatIntegerNumber(cost.ad, config.formatIntegerNumberMode)}}</div>
          </div>
        </div>
      </div>
      <!--员工-->
      <div v-else-if="mainType === 'employee'" class="main-center employee">
        <one-position v-for="(p, index) in employee" :key="index" v-if="p.unlock"
                      :name="p.name" :can-recruited="p.canRecruited" :employee-array="p.list"
                      @toRecruit="toRecruit(index)"></one-position>
      </div>
      <div class="main-bottom">
        <div v-for="type in mainTypes" :key="type.value"
             class="main-bottom-btn" :class="{'main-bottom-btn__selected': mainType === type.value}"
             @click="mainType=type.value">{{type.label}}</div>
      </div>
    </div>

    <!--装修-->
    <div v-else-if="UIController === 'decoration'" class="page decoration">
      <div class="decoration-header">
        <div class="row">总资产：{{$u.formatIntegerNumber(money, config.formatIntegerNumberMode)}}</div>
        <div class="row">办公环境：<span v-html="environmentHtml"></span></div>
      </div>
      <div class="decoration-content">
        <one-decoration v-for="(d, index) in allDecorations" :key="d.value"
                        :text="d.name" :size="company.building.size" :price="d.price" :money="money" :already-buy="company.decoration[index]" :config="config"
                        @buy="buyDecoration(index)"></one-decoration>
      </div>
      <div class="decoration-back" @click="UIController='main'"><i class="el-icon-back"></i></div>
    </div>

    <!--迁址-->
    <div v-else-if="UIController === 'relocation'" class="page relocation">
      <div class="relocation-content">
        <div class="tips">提示：迁址完毕后所有的装修都会重置，即使之前装修过的地址，再次迁回来，也不会有原有的装修记录，需要重新装修，请慎重考虑</div>
        <one-building v-for="(b, index) in allBuildings" :key="b.id"
                      :name="b.address" :size="b.size" :rent="b.rent" :is-now="company.building.id===b.id" :config="config"
                      @buy="buyBuilding(index)"></one-building>
      </div>
      <div class="relocation-back" @click="UIController='main'"><i class="el-icon-back"></i></div>
    </div>

    <!--服务器-->
    <div v-else-if="UIController === 'server'" class="page server">
      <div class="server-header">
        <div class="title-row">服务器使用率</div>
        <div class="progress-row">
          <div class="progress"><el-progress :text-inside="true" :stroke-width="18" :percentage="serversSizeRate"></el-progress></div>
          <div class="info">{{$u.formatHardDiskSize(company.serversSize) + '/' + $u.formatHardDiskSize(serversMaxSize)}}</div>
        </div>
      </div>
      <div class="server-content">
        <div class="tips">提示：减少服务器时，若已使用的容量大于了缩减后的总容量，则会丢失数据，请慎重</div>
        <one-server v-for="(s, index) in allServers" :key="index"
                    :name="s.name" :desc="s.desc" :size="s.size" :price="s.price" :number="company.server[index]" :config="config"
                    @change="changeServer($event, index)"></one-server>
      </div>
      <div class="server-back" @click="UIController='main'"><i class="el-icon-back"></i></div>
    </div>

    <!--贷款-->
    <div v-else-if="UIController === 'loan'" class="page loan"></div>

    <!--广告-->
    <div v-else-if="UIController === 'ad'" class="page ad"></div>

    <!--招聘-->
    <div v-else-if="UIController === 'recruit'" class="page recruit">
      <div class="recruit-header">当前职位：{{employee[recruitIndex].name}}</div>
      <div class="recruit-content">
        <one-seeker v-for="(s, index) in employee[recruitIndex].seekers" :key="index"
                    :seeker="s" :can-offer="numberOfEmployee + numberOfOffer < company.building.size"
                    @sendOffer="showOffer(index)"></one-seeker>
      </div>
      <div class="recruit-back" @click="UIController='main'"><i class="el-icon-back"></i></div>
    </div>

    <div v-else-if="UIController === 'xxx'" class="page xxx"></div>

    <!--弹窗-->
    <!--offer-->
    <div v-if="dialogController !== ''" class="mask">
      <div v-if="dialogController === 'offer'" class="dialog offer">
        <div class="paper">
          <div class="title">录用通知书</div>
          <div class="row">尊敬的{{employee[recruitIndex].seekers[seekerIndex].name}}{{employee[recruitIndex].seekers[seekerIndex].gender === 1 ? '先生' : '女士'}}：</div>
          <div class="row">      您好！首先感谢您对我司的关注与信任。</div>
          <div class="row">      我们非常荣幸地通知您，经过审查和考核，您已被我司正式录用。</div>
          <br>
          <div class="row">职位：{{employee[recruitIndex].name}}</div>
          <div class="row">报道地址：{{company.building.address}}</div>
          <div class="row">日薪：<el-input-number v-model="employee[recruitIndex].seekers[seekerIndex].offerSalary" :min="1" size="small"></el-input-number></div>
          <br>
          <div class="row">期待您的加入！</div>
          <div class="signal">杭州三杠科技有限公司</div>
        </div>
        <div class="ope">
          <div class="btn send" @click="sendOffer()">发 送</div>
          <div class="btn cancel" @click="dialogController=''">取 消</div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped lang="scss">
  $headerFooterGray: #e1e1e6;
  $textRed: #f5524c;
  $textOrange: #ed8a1a;
  $textGray: #909399;
  $textBlue: #409EFF;
  $textGreen: #31c21f;

  *{
    box-sizing: border-box;
  }
  /deep/ {
    .__text-red{color: $textRed}
    .__text-orange{color: $textOrange}
    .__text-gray{color: $textGray}
    .__text-blue{color: $textBlue}
    .__text-green{color: $textGreen}
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
          padding: 0 20px;
          display: flex;
          flex-flow: column nowrap;
          justify-content: center;
          .row{}
        }
        .main-top-next{
          width: 60px;
          height: 60px;
          line-height: 60px;
          background-color: #31c21f;
          border-radius: 10px;
          margin: 10px;
          color: white;
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
              span{
                font-size: 12px;
              }
            }
          }
          .card{
            margin: 0 10px 10px;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 0 6px rgba(0,0,0,.1);
            .card-title{
              height: 40px;
              line-height: 40px;
              background-color: #e7eaef;
              text-align: center;
              font-size: 18px;
              font-weight: bold;
            }
            .card-content{
              padding: 10px 20px 0;
              .info-label{
                text-align: center;
                font-size: 16px;
              }
              .info-value{
                text-align: center;
                size: 14px;
                color: #888;
                margin-bottom: 10px;
              }
            }
          }
        }
        &.employee{
          padding-top: 10px;
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
        .row{}
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
    .relocation{
      .relocation-content{
        width: 100%;
        flex: 1 0 0;
        overflow-y: auto;
        .tips{
          width: 100%;
          padding: 10px 20px;
          background-color: $headerFooterGray;
          font-size: 12px;
        }
      }
      .relocation-back{
        width: 100%;
        height: 60px;
        line-height: 60px;
        background-color: $headerFooterGray;
        font-size: 32px;
        text-align: center;
      }
    }
    .server{
      .server-header{
        width: 100%;
        height: 70px;
        padding: 10px 20px 0;
        background-color: $headerFooterGray;
        .title-row{
          font-size: 16px;
          margin-bottom: 4px;
        }
        .progress-row{
          width: 100%;
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          .progress{
            flex: 1 0 0;
            margin-right: 20px;
          }
          .info{
            font-size: 12px;
          }
        }
      }
      .server-content{
        width: 100%;
        flex: 1 0 0;
        overflow-y: auto;
        .tips{
          width: 100%;
          padding: 10px 20px;
          background-color: #eaeaef;
          font-size: 12px;
        }
      }
      .server-back{
        width: 100%;
        height: 60px;
        line-height: 60px;
        background-color: $headerFooterGray;
        font-size: 32px;
        text-align: center;
      }
    }
    .recruit{
      .recruit-header{
        width: 100%;
        height: 40px;
        line-height: 40px;
        padding: 0 20px;
        background-color: $headerFooterGray;
      }
      .recruit-content{
        width: 100%;
        flex: 1 0 0;
        overflow-y: auto;
      }
      .recruit-back{
        width: 100%;
        height: 60px;
        line-height: 60px;
        background-color: $headerFooterGray;
        font-size: 32px;
        text-align: center;
      }
    }
    .mask{
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 10;
      background-color: rgba(0,0,0,.2);
      display: flex;
      flex-flow: row nowrap;
      justify-content: center;
      align-items: center;
      .dialog{
        background-color: white;
        box-shadow: 6px 6px 10px rgba(0,0,0,.4);
        border-radius: 10px;
        overflow: hidden;
        &.offer{
          width: 80%;
          .paper{
            padding: 30px;
            .title{
              margin-bottom: 20px;
              font-size: 20px;
              font-weight: bold;
              text-align: center;
            }
            .row{
              white-space: pre-wrap;
            }
            .signal{
              margin-top: 40px;
              text-align: right;
            }
          }
          .ope{
            height: 60px;
            display: flex;
            flex-flow: row nowrap;
            .btn{
              flex: 1 0 0;
              height: 60px;
              line-height: 60px;
              text-align: center;
              color: white;
              font-weight: bold;
              &.send{background-color: $textBlue}
              &.cancel{background-color: #aaa}
            }
          }
        }
      }
    }
  }
</style>

<script>
  //components
  import oneBuilding from "./components/one-building"
  import oneDecoration from "./components/one-decoration"
  import onePosition from "./components/one-position";
  import oneSeeker from "./components/one-seeker"
  import oneServer from "./components/one-server"

  //db mixins
  import buildings from "./db/buildings"
  import decorations from "./db/decorations"
  import servers from "./db/servers"

  export default {
    name: "gangCompany",
    mixins: [buildings, decorations, servers],
    components: {oneBuilding, oneDecoration, onePosition, oneSeeker, oneServer},
    data(){
      return{
        height: 0,
        config: {
          formatIntegerNumberMode: 1,
        },

        UIController: "",
        dialogController: "",
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
          decoration: [],
          server: [],
          serversSize: 0,
        },
        employee: [],
        recruitIndex: 0,
        seekerIndex: 0,
      }
    },
    computed: {
      weekday(){
        return ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"][this.day % 7];
      },
      numberOfEmployee(){
        let num = 0;
        this.employee.forEach(p => {
          num += p.list.length;
        });
        return num;
      },
      numberOfOffer(){
        let num = 0;
        this.employee.forEach(p =>{
          num += p.seekers.filter(s => s.isOffer).length;
        });
        return num;
      },
      environment(){
        let e = 0;
        this.allDecorations.forEach((d, index) => {
          if(this.company.decoration[index]){
            e += d.environmentWeight;
          }
        });
        return e;
      },
      environmentHtml(){
        if(this.environment < 25) return `<span class="__text-red">恶心</span>`
        if(this.environment < 50) return `<span class="__text-orange">难受</span>`
        if(this.environment < 75) return `<span class="__text-gray">一般</span>`
        if(this.environment < 100) return `<span class="__text-blue">舒适</span>`
        return `<span class="__text-green">宜居</span>`
      },
      profit(){
        return {
          base: 1350,
        }
      },
      cost(){
        let net = 0;
        this.allServers.forEach((s, index) => {
          net += s.price * this.company.server[index];
        });
        return {
          rent: this.company.building.rent,
          electricity: this.electricityCost,
          net: net,
          ad: 200,
        }
      },
      electricityCost(){
        let e = 0;
        this.allDecorations.forEach((d, index) => {
          if(this.company.decoration[index]){
            e += d.electricity;
          }
        });
        return e * this.company.building.size;
      },
      totalProfit(){
        let n = 0;
        let profit = this.profit;
        for(let key in profit){
          n += profit[key]
        }
        return n;
      },
      totalCost(){
        let n = 0;
        let cost = this.cost;
        for(let key in cost){
          n += cost[key]
        }
        return n;
      },
      totalEarn(){
        return this.totalProfit - this.totalCost;
      },
      serversMaxSize(){
        let size = 0;
        this.allServers.forEach((s, index) => {
          size += s.size * this.company.server[index];
        });
        return size;
      },
      serversSizeRate(){
        if(this.serversMaxSize === 0) return 0;
        return Math.round(this.company.serversSize/this.serversMaxSize*100*100)/100;
      },
      seekerNumber(){
        return 5;
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
        this.dialogController = "";
        this.tutorialText = "";
        this.isTutorialAnimating = true;
        this.tutorialAnimationTimer = null;
        this.mainType = "personal";
        this.money = 1233884466;
        this.day = 1;
        this.personal = {};
        this.company = {
          building: this.allBuildings[0],
          decoration: [],
          server: [0,0,0,0,0,0,0,0],
          serversSize: 3500,
        };
        this.initDecoration();
        this.employee = [
          {name: "老板", canRecruited: false, unlock: true, list: [{name: "杠三杠"}], seekers: [], gender: 0, averageSalary: 0},
          {name: "开发", canRecruited: true, unlock: true, list: [], seekers: [], gender: 0, averageSalary: 500},
          {name: "产品", canRecruited: true, unlock: true, list: [], seekers: [], gender: 0, averageSalary: 450},
          {name: "UI", canRecruited: true, unlock: true, list: [], seekers: [], gender: 0, averageSalary: 400},
          {name: "运维", canRecruited: true, unlock: false, list: [], seekers: [], gender: 0, averageSalary: 400},
        ];
        this.recruitIndex = 1;
        this.seekerIndex = 0;

        this.tutorialAnimationTimer = setInterval(() => {
          let length = this.tutorialText.length;
          if(length === this.tutorialCompleteText.length){
            this.isTutorialAnimating = false;
            clearInterval(this.tutorialAnimationTimer);
          } else {
            this.tutorialText += this.tutorialCompleteText.substring(length, length + 1);
          }
        }, 100);

        this.refreshSeekers();
      },
      initDecoration(){
        this.company.decoration = [
          false, //  0 blanket
          false, //  1 wall
          false, //  2 windows
          false, //  3 light
          false, //  4 table
          false, //  5 wc
          false, //  6 plant
          false, //  7 sofa
          false, //  8 airCon
          false, //  9 coffee
          false, // 10 snack
        ];
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
        // this.company.decoration[index] = true; 这么写无法获取变化
        this.$set(this.company.decoration, index, true);
      },
      buyBuilding(index){
        this.company.building = this.allBuildings[index];
        //重置decoration
        this.initDecoration();
      },
      changeServer(num, index){
        let n = this.company.server[index] + num;
        this.$set(this.company.server, index, n);
        //解锁运维
        this.employee[4].unlock = true;
        //如果减少服务器后硬盘不足，则清除多出的数据
        if(this.company.serversSize > this.serversMaxSize){
          this.company.serversSize = this.serversMaxSize;
        }
      },
      toRecruit(index){
        this.recruitIndex = index;
        this.UIController = "recruit";
      },
      refreshSeekers(){
        this.employee.forEach(p => {
          if(p.canRecruited){
            p.seekers = [];
            for(let i = 0; i < this.seekerNumber; i++){
              let s = {...this.$u.getRandomSeeker(p.gender, p.averageSalary)};
              s.isOffer = false;
              s.offerSalary = s.expectSalary;
              p.seekers.push(s);
            }
          }
        });
      },
      showOffer(index){
        this.seekerIndex = index;
        this.employee[this.recruitIndex].seekers[index].offerSalary = this.employee[this.recruitIndex].seekers[index].expectSalary;
        this.dialogController = "offer";
      },
      sendOffer(){
        this.employee[this.recruitIndex].seekers[this.seekerIndex].isOffer = true;
        this.dialogController = "";
      },
    }
  }
</script>
