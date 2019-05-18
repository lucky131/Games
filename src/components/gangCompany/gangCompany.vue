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
        <div class="main-top-next" @click="next()">下班</div>
      </div>

      <!--公司-->
      <div v-if="mainType === 'company'" class="main-center company">
        <div class="opes">
          <div class="ope-btn" @click="UIController='manage'"><i class="el-icon-document"></i><span>管理</span></div>
          <div class="ope-btn" @click="UIController='decoration'"><i class="el-icon-brush"></i><span>装修</span></div>
          <div class="ope-btn" @click="UIController='relocation'"><i class="el-icon-office-building"></i><span>迁址</span></div>
          <div class="ope-btn" @click="UIController='server'"><i class="el-icon-cloudy"></i><span>服务器</span></div>
          <div class="ope-btn" @click="UIController='loan'"><i class="el-icon-bank-card"></i><span>贷款</span></div>
          <div class="ope-btn" @click="UIController='ad'"><i class="el-icon-news"></i><span>广告</span></div>
        </div>
        <div class="card">
          <div class="card-title">公司概况</div>
          <div class="card-content">
            <div class="info-label">公司名称</div><div class="info-value">杭州三杠科技有限公司</div>
            <div class="info-label">公司地址</div><div class="info-value">{{company.building.address}}</div>
            <div class="info-label">公司规模</div><div class="info-value">{{$u.formatIntegerNumber(numberOfEmployee, config.formatIntegerNumberMode)}}人 / {{$u.formatIntegerNumber(company.building.size, config.formatIntegerNumberMode)}}人</div>
            <div class="info-label">公司知名度</div><div class="info-value">{{popularityText}}</div>
            <div class="info-label">办公环境</div><div class="info-value" v-html="environmentHtml"></div>
          </div>
        </div>
        <div class="card">
          <div class="card-title">网站概况</div>
          <div class="card-content">
            <div class="info-label">用户数量</div>
            <div class="info-value">
              <span v-if="company.serversSize + website.user > serversMaxSize" class="__text-red">{{website.user}}（+{{websiteCal.user}}：请扩容服务器）</span>
              <span v-else>{{website.user}}（+{{websiteCal.user}}）</span>
            </div>
            <div class="info-label">会员数量</div><div class="info-value">{{website.vip}}（{{website.user === 0 ? 0 : Math.round(website.vip / website.user * 100 * 100) / 100}}%）</div>
            <div class="info-label">用户体验UE</div><div class="info-value">{{Math.round(websiteCal.ue * 100) / 100}}</div>
            <div class="info-label">用户界面UI</div><div class="info-value">{{Math.round(websiteCal.ui * 100) / 100}}</div>
            <div class="info-label">响应速度</div><div class="info-value">{{Math.round(websiteCal.speed * 100) / 100}}</div>
            <div class="info-label">bug概率</div><div class="info-value">{{Math.round(websiteCal.bugRate * 100 * 100) / 100}}%</div>
          </div>
        </div>
        <div class="card">
          <div class="card-title">每日盈利</div>
          <div class="card-content">
            <div class="info-label">基本盈利</div><div class="info-value">{{$u.formatIntegerNumber(profit.base, config.formatIntegerNumberMode)}}</div>
            <div class="info-label">会员氪金</div><div class="info-value">{{$u.formatIntegerNumber(profit.vip, config.formatIntegerNumberMode)}}</div>
          </div>
        </div>
        <div class="card">
          <div class="card-title">每日开销</div>
          <div class="card-content">
            <div class="info-label">工资</div><div class="info-value">{{$u.formatIntegerNumber(cost.salary, config.formatIntegerNumberMode)}}</div>
            <div class="info-label">房租</div><div class="info-value">{{$u.formatIntegerNumber(cost.rent, config.formatIntegerNumberMode)}}</div>
            <div class="info-label">电费</div><div class="info-value">{{$u.formatIntegerNumber(cost.electricity, config.formatIntegerNumberMode)}}</div>
            <div class="info-label">网费</div><div class="info-value">{{$u.formatIntegerNumber(cost.net, config.formatIntegerNumberMode)}}</div>
            <div class="info-label">还款</div><div class="info-value">{{$u.formatIntegerNumber(cost.loan, config.formatIntegerNumberMode)}}</div>
            <div class="info-label">广告费</div><div class="info-value">{{$u.formatIntegerNumber(cost.ad, config.formatIntegerNumberMode)}}</div>
          </div>
        </div>
      </div>
      <!--员工-->
      <div v-else-if="mainType === 'employee'" class="main-center employee">
        <one-position v-for="(p, index) in employee" :key="index"
                      :name="p.name" :can-recruited="index !== 0" :unlock="p.unlock" :employee-array="p.list" :day="day" :config="config"
                      @fire="fire($event, index)" @toRecruit="toRecruit(index)"></one-position>
      </div>
      <!--个人-->
      <div v-else-if="mainType === 'personal'" class="main-center personal">
        <div class="card">
          <div class="card-title">技能</div>
          <div class="card-content">
            <one-skill v-for="index in personal.skill" :key="index"
                       :item="allSkills[index]"></one-skill>
            <div v-if="personal.skill.length < allSkills.length">
              <div v-if="newSkillPrice <= money" class="learn-btn able" @click="newSkill()"><i class="el-icon-magic-stick"></i> 获取随机技能（{{$u.formatIntegerNumber(newSkillPrice, config.formatIntegerNumberMode)}}）</div>
              <div v-else class="learn-btn disabled"><i class="el-icon-magic-stick"></i> 获取随机技能（{{$u.formatIntegerNumber(newSkillPrice, config.formatIntegerNumberMode)}}）</div>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-title">组合技</div>
          <div class="card-content">

          </div>
        </div>
      </div>
      <div class="main-bottom">
        <div v-for="type in mainTypes" :key="type.value"
             class="main-bottom-btn" :class="{'main-bottom-btn__selected': mainType === type.value}"
             @click="mainType=type.value">{{type.label}}</div>
      </div>
    </div>

    <!--管理-->
    <div v-else-if="UIController === 'manage'" class="page manage">
      <div class="manage-content">
        <div class="manage-title">每天工作时长</div>
        <div class="manage-row">
          <el-input-number v-model="company.manage.workHours" :min="1" :max="24" :step="1" step-strictly size="small"></el-input-number> 小时
          <div class="manage-tips">《中华人民共和国劳动法》第四章第三十六条：国家实行劳动者每日工作时间不超过八小时、平均每周工作时间不超过四十四小时的工时制度。</div>
        </div>
        <div class="manage-title">工作日</div>
        <div class="manage-row">
          <el-checkbox v-model="company.manage.workDays[0]">周一</el-checkbox>
          <el-checkbox v-model="company.manage.workDays[1]">周二</el-checkbox>
          <el-checkbox v-model="company.manage.workDays[2]">周三</el-checkbox>
          <el-checkbox v-model="company.manage.workDays[3]">周四</el-checkbox>
          <el-checkbox v-model="company.manage.workDays[4]">周五</el-checkbox>
          <el-checkbox v-model="company.manage.workDays[5]">周六</el-checkbox>
          <el-checkbox v-model="company.manage.workDays[6]">周日</el-checkbox>
          <div class="manage-tips">《中华人民共和国宪法》第二章第四十三条： 中华人民共和国劳动者有休息的权利。 国家发展劳动者休息和休养的设施，规定职工的工作时间和休假制度。</div>
          <div class="manage-tips">《中华人民共和国劳动法》第一章第三条： 劳动者享有平等就业和选择职业的权利、取得劳动报酬的权利、休息休假的权利、获得劳动安全卫生保护的权利、接受职业技能培训的权利、享受社会保险和福利的权利、提请劳动争议处理的权利以及法律规定的其他劳动权利。</div>
        </div>
      </div>
      <div class="manage-back" @click="UIController='main'"><i class="el-icon-back"></i></div>
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
    <div v-else-if="UIController === 'loan'" class="page loan">
      <div class="loan-content">
        <one-loan v-for="(item, index) in allLoans" :key="index"
                  :item="item" :config="config" :remain-day="company.loan[index]"
                  @loan="loan(index)"></one-loan>
      </div>
      <div class="loan-back" @click="UIController='main'"><i class="el-icon-back"></i></div>
    </div>

    <!--广告-->
    <div v-else-if="UIController === 'ad'" class="page ad">
      <div class="ad-content">
        <one-ad v-for="(item, index) in allAds" :key="index"
                :item="item" :config="config" :is-buy="company.ad[index]"
                @change="changeAd(index)"></one-ad>
      </div>
      <div class="ad-back" @click="UIController='main'"><i class="el-icon-back"></i></div>
    </div>

    <!--招聘-->
    <div v-else-if="UIController === 'recruit'" class="page recruit">
      <div class="recruit-header">当前职位：{{employee[recruitIndex].name}}</div>
      <div class="recruit-content">
        <one-seeker v-for="(s, index) in employee[recruitIndex].seekers" :key="index"
                    :seeker="s" :can-offer="numberOfEmployee + numberOfOffer < company.building.size" :config="config"
                    @sendOffer="showOffer(index)"></one-seeker>
      </div>
      <div class="recruit-back" @click="UIController='main'"><i class="el-icon-back"></i></div>
    </div>

    <div v-else-if="UIController === 'xxx'" class="page xxx"></div>

    <!--弹窗-->
    <!--offer-->
    <div v-if="dialogController !== ''" class="mask">
      <div v-if="dialogController === 'break'" class="dialog break">
        <div class="icon"><i class="el-icon-lightning"></i></div>
        <div class="row">公司已破产:(</div>
        <div class="row">总共持续了{{day}}天</div>
        <div class="restart-btn" @click="initGame()">重新开始</div>
      </div>
      <div v-else-if="dialogController === 'next'" class="dialog next">
        <div class="content">
          <div class="title">昨日小报</div>
          <div class="ticket-row"><span>原有资产</span><span>{{history[day-1].money}}</span></div>
          <div class="ticket-row"><span>总盈利</span>
            <span v-if="website.isBug" class="__text-red">网站出bug，无收益</span>
            <span v-else>+ {{history[day-1].totalProfit}}</span>
          </div>
          <div class="ticket-row"><span>总开销</span><span>- {{history[day-1].totalCost}}</span></div>
          <div class="ticket-row"><span></span><span>----------</span></div>
          <div class="ticket-row"><span>今日资产</span><span>{{money}}</span></div>
          <div class="title">新员工</div>
          <div v-if="newEmployee.length === 0" class="row">无</div>
          <div v-else>
            <div v-for="(e, index) in newEmployee" :key="index" class="row">
              {{e.position}}
              <i v-if="e.gender === 1" class="el-icon-s-custom male"></i>
              <i v-else class="el-icon-s-custom female"></i>
              {{e.name}}
              {{e.age}}岁
            </div>
          </div>
          <div class="title">辞职员工</div>
          <div v-if="quitEmployee.length === 0" class="row">无</div>
          <div v-else>
            <div v-for="(e, index) in quitEmployee" :key="index" class="row">
              {{e.position}}
              <i v-if="e.gender === 1" class="el-icon-s-custom male"></i>
              <i v-else class="el-icon-s-custom female"></i>
              {{e.name}}
              {{e.age}}岁
            </div>
          </div>
          <div class="title">开除员工</div>
          <div v-if="fireEmployee.length === 0" class="row">无</div>
          <div v-else>
            <div v-for="(e, index) in fireEmployee" :key="index" class="row">
              {{e.position}}
              <i v-if="e.gender === 1" class="el-icon-s-custom male"></i>
              <i v-else class="el-icon-s-custom female"></i>
              {{e.name}}
              {{e.age}}岁
            </div>
          </div>
        </div>
        <div class="continue-btn" @click="newDay()">确定</div>
      </div>
      <div v-else-if="dialogController === 'offer'" class="dialog offer">
        <div class="paper">
          <div class="title">录用通知书</div>
          <div class="row">尊敬的{{employee[recruitIndex].seekers[seekerIndex].name}}{{employee[recruitIndex].seekers[seekerIndex].gender === 1 ? '先生' : '女士'}}：</div>
          <div class="row">      您好！首先感谢您对我司的关注与信任。</div>
          <div class="row">      我们非常荣幸地通知您，经过审查和考核，您已被我司正式录用。</div>
          <br>
          <div class="row">职位：{{employee[recruitIndex].name}}</div>
          <div class="row">报道地址：{{company.building.address}}</div>
          <div class="row">日薪：<el-input-number v-model="employee[recruitIndex].seekers[seekerIndex].offerSalary" :min="1" :step="1" step-strictly size="small"></el-input-number></div>
          <br>
          <div class="row">期待您的加入！</div>
          <div class="signal">杭州三杠科技有限公司</div>
        </div>
        <div class="ope">
          <div v-if="employee[recruitIndex].seekers[seekerIndex].offerSalary === undefined" class="btn disabled">发 送</div>
          <div v-else class="btn send" @click="sendOffer()">发 送</div>
          <div class="btn cancel" @click="dialogController=''">取 消</div>
        </div>
      </div>
      <div v-else-if="dialogController === 'xxx'" class="dialog xxx"></div>
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
    font-family: -apple-system,SF UI Text,Arial,PingFang SC,Hiragino Sans GB,Microsoft YaHei,WenQuanYi Micro Hei,sans-serif;
  }
  /deep/ {
    .__text-red{color: $textRed}
    .__text-orange{color: $textOrange}
    .__text-gray{color: $textGray}
    .__text-blue{color: $textBlue}
    .__text-green{color: $textGreen}
    .male{color: #2e7bff}
    .female{color: deeppink}
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
        font-size: 20px;
        font-weight: bold;
        position: relative;
        .tutorial-text{
          position: absolute;
          top: 0;
          color: black;
        }
      }
      .tutorial-btn{
        width: 120px;
        height: 60px;
        line-height: 60px;
        border-radius: 10px;
        background-color: $textBlue;
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
        z-index: 1;
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
          background-color: $textBlue;
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
        -webkit-overflow-scrolling: touch;
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
        &.personal{
          padding-top: 10px;
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
              .learn-btn{
                width: 100%;
                height: 40px;
                line-height: 40px;
                border-radius: 10px;
                margin: 10px 0;
                color: white;
                font-weight: bold;
                text-align: center;
                &.able{
                  background-color: #31c21f;
                }
                &.disabled{
                  background-color: #ccc;
                }
              }
            }
          }
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
    .manage{
      .manage-content{
        width: 100%;
        flex: 1 0 0;
        padding: 0 20px;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        .manage-title{
          margin: 20px 0;
          font-size: 18px;
          font-weight: bold;
        }
        .manage-row{
          padding-bottom: 10px;
          border-bottom: 1px solid #ccc;
          .el-checkbox{
            margin-right: 10px;
            .el-checkbox__label{
              padding-left: 5px;
            }
          }
          .manage-tips{
            margin-top: 10px;
            font-size: 10px;
            color: #ccc;
          }
        }
      }
      .manage-back{
        width: 100%;
        height: 60px;
        line-height: 60px;
        background-color: $headerFooterGray;
        font-size: 32px;
        text-align: center;
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
        -webkit-overflow-scrolling: touch;
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
        -webkit-overflow-scrolling: touch;
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
        -webkit-overflow-scrolling: touch;
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
    .loan{
      .loan-content{
        width: 100%;
        flex: 1 0 0;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
      }
      .loan-back{
        width: 100%;
        height: 60px;
        line-height: 60px;
        background-color: $headerFooterGray;
        font-size: 32px;
        text-align: center;
      }
    }
    .ad{
      .ad-content{
        width: 100%;
        flex: 1 0 0;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
      }
      .ad-back{
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
        -webkit-overflow-scrolling: touch;
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
        &.break{
          width: 80%;
          .icon{
            padding-top: 30px;
            margin-bottom: 20px;
            font-size: 32px;
            text-align: center;
          }
          .row{
            text-align: center;
          }
          .restart-btn{
            width: 100%;
            height: 60px;
            line-height: 60px;
            margin-top: 20px;
            background-color: $textBlue;
            text-align: center;
            color: white;
            font-weight: bold;
          }
        }
        &.next{
          width: 80%;
          .content{
            padding: 0 30px 20px;
            max-height: 70vh;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
            .title{
              font-weight: bold;
              margin: 20px 0 10px;
            }
            .ticket-row{
              display: flex;
              flex-flow: row nowrap;
              justify-content: space-between;
              color: #999;
              font-size: 14px;
            }
            .row{}
          }
          .continue-btn{
            width: 100%;
            height: 60px;
            line-height: 60px;
            background-color: $textBlue;
            text-align: center;
            color: white;
            font-weight: bold;
          }
        }
        &.offer{
          width: 80%;
          .paper{
            padding: 30px;
            max-height: 70vh;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
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
              &.disabled{background-color: #ccc}
            }
          }
        }
      }
    }
  }
</style>

<script>
  //components
  import oneAd from "./components/one-ad"
  import oneBuilding from "./components/one-building"
  import oneDecoration from "./components/one-decoration"
  import oneLoan from "./components/one-loan"
  import onePosition from "./components/one-position"
  import oneSeeker from "./components/one-seeker"
  import oneServer from "./components/one-server"
  import oneSkill from "./components/one-skill"

  //db mixins
  import ads from "./db/ads"
  import buildings from "./db/buildings"
  import decorations from "./db/decorations"
  import loans from "./db/loans"
  import servers from "./db/servers"
  import skills from "./db/skills"

  export default {
    name: "gangCompany",
    mixins: [ads, buildings, decorations, loans, servers, skills],
    components: {oneAd, oneBuilding, oneDecoration, oneLoan, onePosition, oneSeeker, oneServer, oneSkill},
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
            label: "公司",
            value: "company"
          },
          {
            label: "员工",
            value: "employee"
          },
          {
            label: "个人",
            value: "personal"
          },
        ],
        history: [],
        money: 0,
        day: 0,
        personal: {
          skill: [],
        },
        company: {
          manage: {
            workHours: 8,
            workDays: [],
          },
          building: {
            id: "",
            address: "",
            size: 0,
            rent: 0,
          },
          decoration: [],
          server: [],
          serversSize: 0,
          serverFullDay: 0,
          loan: [],
          ad: [],
        },
        website: {
          user: 0,
          vip: 0,
          isBug: false,
        },
        employee: [],
        newEmployee: [],
        quitEmployee: [],
        fireEmployee: [],
        recruitIndex: 0,
        seekerIndex: 0,
      }
    },
    computed: {
      weekday(){
        return ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"][this.day % 7];
      },
      isTodayWorkDay(){
        return this.company.manage.workDays[(this.day + 6) % 7];
      },
      newSkillPrice(){
        return 500 * Math.pow(2, this.personal.skill.length);
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
      popularity(){
        let userBase = Math.sqrt(this.website.user);
        let adBonus = 0;
        this.allAds.forEach((n, index) => {
          if(this.company.ad[index]){
            adBonus += n.bonus;
          }
        });
        return userBase + adBonus;
      },
      popularityLevel(){
        if(this.popularity < 10) return 1;
        if(this.popularity < 32) return 2;
        if(this.popularity < 100) return 3;
        if(this.popularity < 250) return 4;
        if(this.popularity < 750) return 5;
        if(this.popularity < 2000) return 6;
        if(this.popularity < 5000) return 7;
        return 8;
      },
      popularityText(){
        switch (this.popularityLevel) {
          case 1: return "野鸡公司";
          case 2: return "无人问津";
          case 3: return "略有耳闻";
          case 4: return "小有名声";
          case 5: return "家喻户晓";
          case 6: return "业界龙头";
          case 7: return "国内大厂";
          case 8: return "国际知名";
        }
        return "";
      },
      basicAcceptOfferRate(){
        //x:[0,500,+∞)  y:[0.3,0.5,0.7)
        return 0.7 - 200 / (this.popularity + 500);
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
      environmentLevel(){
        if(this.environment < 25) return 1;
        if(this.environment < 50) return 2;
        if(this.environment < 75) return 3;
        if(this.environment < 100) return 4;
        return 5;
      },
      environmentHtml(){
        switch (this.environmentLevel) {
          case 1: return `<span class="__text-red">恶心</span>`;
          case 2: return `<span class="__text-orange">难受</span>`;
          case 3: return `<span class="__text-gray">一般</span>`;
          case 4: return `<span class="__text-blue">舒适</span>`;
          case 5: return `<span class="__text-green">宜居</span>`;
        }
        return "";
      },
      websiteCal(){
        function getSum(total, num){
          return total + num;
        }
        return {
          user: this.isTodayWorkDay ? Math.round(this.employeeEfficiency[1].reduce(getSum, 0) / 8 * this.company.manage.workHours * Math.exp(-this.company.serverFullDay)) : 0,
          ue: this.employeeEfficiency[2].reduce(getSum, 0) / 8 * this.company.manage.workHours,
          ui: this.employeeEfficiency[3].reduce(getSum, 0) / 8 * this.company.manage.workHours,
          speed: this.employeeEfficiency[4].reduce(getSum, 0) / 8 * this.company.manage.workHours * this.serverAverageSpeed,
          bugRate: Math.max(this.website.user / 10000 - this.employeeEfficiency[5].reduce(getSum, 0) / 8 * this.company.manage.workHours / 100, 0),
        };
      },
      vipRate(){
        let sum = this.websiteCal.ue + this.websiteCal.ui + this.websiteCal.speed
        return 1 - Math.exp(-sum / 10000);
      },
      profit(){
        return {
          base: this.website.user,
          vip: this.website.vip,
        }
      },
      salaryCost(){
        if(!this.isTodayWorkDay) return 0;
        let s = 0;
        this.employee.forEach(p => {
          p.list.forEach(e => {
            if(e.salary){
              s += e.salary;
            }
          });
        });
        return s;
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
      netCost(){
        let n = 0;
        this.allServers.forEach((s, index) => {
          n += s.price * this.company.server[index];
        });
        return n;
      },
      loanCost(){
        let l = 0;
        this.allLoans.forEach((b, index) => {
          if(this.company.loan[index] > 0){
            l += b.step;
          }
        });
        return l;
      },
      adCost(){
        let a = 0;
        this.allAds.forEach((n, index) => {
          if(this.company.ad[index]){
            a += n.price;
          }
        });
        return a;
      },
      cost(){
        return {
          salary: this.salaryCost,
          rent: this.company.building.rent,
          electricity: this.electricityCost,
          net: this.netCost,
          loan: this.loanCost,
          ad: this.adCost,
        }
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
      serverAverageSpeed(){
        if(this.serversMaxSize === 0) return 0;
        let totalSpeed = 0
        this.allServers.forEach((s, index) => {
          totalSpeed += s.size * this.company.server[index] * s.speed;
        });
        return totalSpeed / this.serversMaxSize;
      },
      employeeEfficiency(){
        let e = [];
        this.employee.forEach(p => {
          e.push(p.list.map(e => {
            if(e.ability && e.mood)
              return e.ability * e.mood / 80;
            return 0;
          }));
        });
        return e;
      },
      seekerNumber(){
        return 3 + this.popularityLevel - 1;
      },
    },
    mounted(){
      window.vue = this;
      this.height = window.innerHeight;

      // iOS Safari 无法通过meta来禁止缩放，只能监听
      (function forbidden() {
        document.addEventListener('touchstart', (event) => {
          if (event.touches.length > 1) {
            event.preventDefault()
          }
        }, { passive: false })

        let lastTouchEnd = 0
        document.addEventListener('touchend', (event) => {
          const now = (new Date()).getTime()
          if (now - lastTouchEnd <= 300) {
            event.preventDefault()
          }
          lastTouchEnd = now
        }, false)
      })();

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
        this.mainType = "company";
        this.history = [{}];
        this.money = 500000;
        this.day = 1;
        this.personal = {
          skill: [],
        };
        this.company = {
          manage: {
            workHours: 8,
            workDays: [true, true, true, true, true, false, false],
          },
          building: this.allBuildings[0],
          decoration: [],
          server: [0,0,0,0,0,0,0,0],
          serversSize: 0,
          serverFullDay: 0,
          loan: [0,0,0,0,0],
          ad: [false, false, false, false, false, false, false],
        };
        this.initDecoration();
        this.website = {
          user: 0,
          vip: 0,
          isBug: false,
        };
        this.employee = [
          {name: "老板", unlock: true, list: [], seekers: [], gender: 0, averageSalary: 0},
          {name: "程序员", unlock: true, list: [], seekers: [], gender: 0, averageSalary: 500},
          {name: "产品经理", unlock: false, list: [], seekers: [], gender: 0, averageSalary: 450},
          {name: "美工", unlock: false, list: [], seekers: [], gender: 0, averageSalary: 400},
          {name: "网络运维", unlock: false, list: [], seekers: [], gender: 0, averageSalary: 400},
          {name: "测试", unlock: false, list: [], seekers: [], gender: 0, averageSalary: 400},
        ];
        this.employee[0].list.push({
          name: "杠三杠",
          gender: 1,
          age: 34,
        });
        this.newEmployee = [];
        this.quitEmployee = [];
        this.fireEmployee = [];
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
      next(){
        //历史
        this.history.push({
          money: this.money,
          totalProfit: this.totalProfit,
          totalCost: this.totalCost,
          numberOfEmployee: this.numberOfEmployee,
        });
        //结算钱
        this.money -= this.totalCost;
        this.website.isBug = Math.random() < this.websiteCal.bugRate
        if(this.website.isBug){
          //解锁测试
          this.employee[5].unlock = true;
        } else {
          this.money += this.totalProfit;
        }
        if(this.money < 0){
          this.dialogController = "break";
        } else{
          //服务器容量
          this.company.serversSize += this.website.user;
          if(this.company.serversSize >= 1024){
            //解锁运维
            this.employee[4].unlock = true;
          }
          if(this.company.serversSize > this.serversMaxSize){
            //如果服务器容量超出最大
            this.company.serversSize = this.serversMaxSize;
            this.company.serverFullDay++;
          } else {
            this.company.serverFullDay = 0;
          }
          //贷款剩余天数-1
          this.company.loan.forEach((n, index) => {
            if(n > 0){
              this.$set(this.company.loan, index, n-1);
            }
          });
          //新增用户
          this.website.user += this.websiteCal.user;
          this.website.vip = Math.round(this.website.user * this.vipRate);
          if(this.website.user > 1000){
            //解锁产品和UI
            this.employee[2].unlock = true;
            this.employee[3].unlock = true;
          }
          //员工心情
          this.employee.forEach(p => {
            p.list.forEach(e => {
              if(e.mood !== undefined){
                if(this.isTodayWorkDay){
                  //工作时长因素 多工作一小时 心情-1 线性
                  e.mood += 8 - this.company.manage.workHours;
                  //环境因素
                  // environmentLevel     1         2     3         4    5
                  //  moodChangeRange  -2~0  -1.5~0.5  -1~1  -0.5~1.5  0~2
                  e.mood += Math.random() * 2 + this.environmentLevel / 2 - 2.5;
                  if(this.day % 7 === 6 || this.day % 7 === 0){
                    //工作日因素 周末上班-20
                    e.mood += -20;
                  }
                }
                //校准
                e.mood = Math.min(Math.max(e.mood, 0), 100);
              }
            });
          });
          //员工辞职
          this.employee.forEach(p => {
            p.list.forEach((e, index) => {
              // mood  [0,10,100]
              // rate  [1, 0,  0] 二段线性
              if(e.mood !== undefined && e.mood < 10){
                if(Math.random() < 1 - e.mood / 10){
                  this.quitEmployee.push({
                    position: p.name,
                    name: e.name,
                    gender: e.gender,
                    age: e.age,
                  });
                  p.list[index] = undefined;
                }
              }
            });
            p.list = p.list.filter(e => e); //过滤undefined
          });
          //处理offer
          this.employee.forEach(p => {
            p.seekers.forEach(s => {
              if(s.isOffer){
                let acceptOfferRate = this.basicAcceptOfferRate * s.offerSalary / s.expectSalary;
                if(Math.random() < acceptOfferRate){
                  //接受offer
                  p.list.push({
                    name: s.name,
                    gender: s.gender,
                    age: s.age,
                    ability: s.ability,
                    mood: Math.min(60 * s.offerSalary / s.expectSalary, 100),
                    salary: s.offerSalary,
                    canFireDay: this.day + 1 + 30,
                  });
                  this.newEmployee.push({
                    position: p.name,
                    name: s.name,
                    gender: s.gender,
                    age: s.age,
                  });
                }
              }
            });
          });

          //刷新求职者
          this.refreshSeekers();

          this.day++;
          this.dialogController = "next";
        }
      },
      newDay(){
        this.newEmployee = [];
        this.quitEmployee = [];
        this.fireEmployee = [];
        this.dialogController = "";
      },
      newSkill(){
        let arr = this.allSkills.map((n, i) => i).filter(i => this.personal.skill.indexOf(i) === -1);
        let newIndex = arr[Math.floor(Math.random() * arr.length)];
        this.personal.skill.push(newIndex);
        this.money -= this.newSkillPrice;
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
        //如果减少服务器后硬盘不足，则等比例减少用户量，清除多出的数据
        if(this.company.serversSize > this.serversMaxSize){
          this.website.user = Math.round(this.website.user / this.company.serversSize * this.serversMaxSize);
          this.company.serversSize = this.serversMaxSize;
        }
      },
      loan(index){
        this.money += this.allLoans[index].amount;
        this.$set(this.company.loan, index, this.allLoans[index].period);
      },
      changeAd(index){
        this.$set(this.company.ad, index, !this.company.ad[index]);
      },
      fire(eIndex, pIndex){
        this.fireEmployee.push({
          position: this.employee[pIndex].name,
          name: this.employee[pIndex].list[eIndex].name,
          gender: this.employee[pIndex].list[eIndex].gender,
          age: this.employee[pIndex].list[eIndex].age,
        });
        this.employee[pIndex].list.splice(eIndex, 1);
      },
      toRecruit(index){
        this.recruitIndex = index;
        this.UIController = "recruit";
      },
      refreshSeekers(){
        this.employee.forEach((p, index) => {
          if(index !== 0){
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
        if(this.employee[this.recruitIndex].seekers[this.seekerIndex].offerSalary === undefined) return;
        this.employee[this.recruitIndex].seekers[this.seekerIndex].isOffer = true;
        this.dialogController = "";
      },
    }
  }
</script>
