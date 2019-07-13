<template>
  <div class="gang-company" :style="{height: height + 'px'}">

    <!--初始界面-->
    <div v-if="UIController === 'tutorial'" class="page tutorial" @click="skipTutorialAnimating()">
      <div class="tutorial-complete-text">{{tutorialCompleteText}}
        <div class="tutorial-text">{{tutorialText}}</div>
      </div>
      <div v-if="isTutorialAnimating" class="tutorial-mask"></div>
      <div class="tutorial-bottom" :style="{opacity: isTutorialAnimating ? 0 : 1}">
        <div class="difficulty">
          <div class="difficulty-ope">
            难度：<el-input-number v-model="difficulty" :min="0" :max="difficulties.length-1" :step="1" step-strictly size="small"></el-input-number>
          </div>
          <div class="difficulty-desc">启动资金：{{$u.formatIntegerNumber(difficulties[difficulty].initMoney, config.formatIntegerNumberMode)}}</div>
          <div class="difficulty-desc">初始用户流失率：{{Math.round(difficulties[difficulty].baseLossRate * 100 * 100) / 100}}%</div>
          <div class="difficulty-desc">开局随机获得{{difficulties[difficulty].curse}}个诅咒</div>
          </div>
        <div class="tutorial-btn" @click.stop="startGame()"><i class="el-icon-video-play"></i> 开始游戏</div>
      </div>
    </div>

    <!--读取自动存档-->
    <div v-else-if="UIController === 'loadAuto'" class="page load-auto">
      <div class="text">检测到自动存档，是否读取？</div>
      <div class="pre">
        <div class="label">游戏时间：</div><div class="value">{{formatDay(autoSaveInfo.day)}}</div>
        <div class="label">资产：</div><div class="value">{{$u.formatIntegerNumber(autoSaveInfo.money, config.formatIntegerNumberMode)}}</div>
        <div class="label">保存时间：</div><div class="value">{{autoSaveInfo.date}}</div>
      </div>
      <div class="opes">
        <div class="btn" @click="loadAutoSave()"><i class="el-icon-upload"></i> 读取存档</div>
        <div class="btn" @click="initGame()"><i class="el-icon-s-flag"></i> 新的开始</div>
      </div>
    </div>

    <!--主界面-->
    <div v-else-if="UIController === 'main'" class="page main">
      <div class="page-header main-top">
        <div class="main-top-left">
          <div class="row">{{formatDay(day)}} {{weekday}}</div>
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
              <span v-if="company.serversSize + website.user > serversMaxSize" class="__text-red">{{website.user}}（-{{websiteCal.userLoss}}）（+{{websiteCal.userAdd}}：请扩容服务器）</span>
              <span v-else>{{website.user}}（-{{websiteCal.userLoss}}）（+{{websiteCal.userAdd}}）</span>
            </div>
            <div class="info-label">会员数量</div><div class="info-value">{{website.vip}}（{{website.user === 0 ? 0 : Math.round(website.vip / website.user * 100 * 100) / 100}}%）</div>
            <div class="info-label">会员日价</div><div class="info-value">{{Math.round(vipPrice * 100) / 100}}</div>
            <div class="info-label">用户体验UE</div><div class="info-value">{{Math.round(websiteCal.ue * 100) / 100}}</div>
            <div class="info-label">用户界面UI</div><div class="info-value">{{Math.round(websiteCal.ui * 100) / 100}}</div>
            <div class="info-label">响应速度</div><div class="info-value">{{Math.round(websiteCal.speed * 100) / 100}}</div>
            <div class="info-label">bug概率</div><div class="info-value">{{Math.round(websiteCal.bugRate * 100 * 100) / 100}}%</div>
            <div class="info-label">用户流失率</div><div class="info-value">{{Math.round(lossRate * 100 * 100) / 100}}%</div>
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
        <one-position v-for="(p, index) in employee" :key="index" v-if="p.unlock"
                      :name="p.name" :info="p.info" :can-recruited="index !== 0" :show-full="p.showFull" :employee-array="p.list" :day="day" :config="config" :show-ability="showAbility" :show-mood="showMood"
                      @toggleShowFull="toggleShowFull(index)" @fire="fire($event, index)" @toRecruit="toRecruit(index)"></one-position>
      </div>
      <!--个人-->
      <div v-else-if="mainType === 'personal'" class="main-center personal">
        <div class="opes">
          <div class="ope-btn" @click="UIController='shop'"><i class="el-icon-shopping-cart-2"></i><span>商店</span></div>
          <div class="ope-btn" @click="UIController='lottery'"><i class="el-icon-money"></i><span>彩票</span></div>
          <div class="ope-btn" @click="UIController='stock'"><i class="el-icon-wallet"></i><span>股票</span></div>
          <div class="ope-btn" @click="UIController='car'"><i class="el-icon-bicycle"></i><span>买车</span></div>
          <div class="ope-btn" @click="UIController='house'"><i class="el-icon-house"></i><span>买房</span></div>
          <div class="ope-btn" @click="UIController='date'"><i class="el-icon-female"></i><span>相亲</span></div>
          <div class="ope-btn" @click="UIController='contact'"><i class="el-icon-chat-line-round"></i><span>联系人</span><el-badge v-if="allUnread > 0" :value="allUnread"></el-badge></div>
        </div>
        <div class="card">
          <div class="card-title">能力</div>
          <div class="card-content">
            <one-skill v-for="index in personal.skill" :key="index"
                       :item="allSkills[index]"></one-skill>
            <div v-if="personal.skill.length < allSkills.length">
              <div v-if="newSkillPrice <= money" class="learn-btn able" @click="newSkill()"><i class="el-icon-magic-stick"></i> 获取随机能力（{{$u.formatIntegerNumber(newSkillPrice, config.formatIntegerNumberMode)}}）</div>
              <div v-else class="learn-btn disabled"><i class="el-icon-magic-stick"></i> 获取随机能力（{{$u.formatIntegerNumber(newSkillPrice, config.formatIntegerNumberMode)}}）</div>
            </div>
          </div>
        </div>
        <div v-if="combinedSkill.length > 0" class="card">
          <div class="card-title">组合技</div>
          <div class="card-content">
            <one-skill v-for="index in combinedSkill" :key="index"
                       :item="allCombinedSkills[index]"
                       :all-skills="allSkills"></one-skill>
          </div>
        </div>
        <div v-if="personal.curse.length > 0" class="card">
          <div class="card-title">诅咒</div>
          <div class="card-content">
            <one-skill v-for="index in personal.curse" :key="index"
                       :item="allCurses[index]"></one-skill>
          </div>
        </div>
      </div>
      <!--设置-->
      <div v-else-if="mainType === 'setting'" class="main-center setting">
        <div class="setting-title">数字辅助显示</div>
        <div class="setting-row">
          <el-radio-group v-model="config.formatIntegerNumberMode">
            <el-radio :label="0">关闭</el-radio>
            <el-radio :label="1">模式一</el-radio>
            <el-radio :label="2">模式二</el-radio>
            <el-radio :label="3">模式三</el-radio>
          </el-radio-group>
          <div class="setting-tips">例如：-297914729<br>模式一：-297,914,729<br>模式二：负2亿9791万4729<br>模式三：-2.98亿</div>
        </div>
      </div>
      <div class="main-bottom">
        <div class="main-bottom-btn" :class="{'main-bottom-btn__selected': mainType === 'company'}" @click="mainType = 'company'">公司</div>
        <div class="main-bottom-btn" :class="{'main-bottom-btn__selected': mainType === 'employee'}" @click="mainType = 'employee'">员工</div>
        <div class="main-bottom-btn" :class="{'main-bottom-btn__selected': mainType === 'personal'}" @click="mainType = 'personal'">个人<el-badge v-if="allUnread > 0" :value="allUnread"></el-badge></div>
        <div class="main-bottom-btn" :class="{'main-bottom-btn__selected': mainType === 'setting'}" @click="mainType = 'setting'">设置</div>
      </div>
    </div>

    <!--管理-->
    <div v-else-if="UIController === 'manage'" class="page manage">
      <div class="page-content manage-content">
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
        <div v-if="employee[9].list.length > 0" class="manage-title">人力招聘职位</div>
        <div v-if="employee[9].list.length > 0" class="manage-row">
          <el-checkbox-group v-model="company.manage.hr">
            <el-checkbox v-for="(p, index) in employee" :key="index" v-if="index !== 0 && p.unlock" :label="index">{{p.name}}</el-checkbox>
          </el-checkbox-group>
          <div class="manage-tips">每一名人力每天会从勾选的职位且能力不高于自己的所有求职者中筛选出一位性价比最高的员工发送offer，且不同的人力之间不会重复发送</div>
        </div>
        <div v-if="employee[12].list.length > 0" class="manage-title">末位淘汰制</div>
        <div v-if="employee[12].list.length > 0" class="manage-row">
          <el-checkbox v-model="company.manage.eliminate">启用</el-checkbox>
          <div class="manage-tips">每一名规划师每天会从能力不高于自己的员工中开除一位性价比最低的，且不同的规划师之间不会重复开除，规划师不会开除规划师</div>
        </div>
      </div>
      <div class="page-back" @click="backToMain()"><i class="el-icon-back"></i></div>
    </div>

    <!--装修-->
    <div v-else-if="UIController === 'decoration'" class="page decoration">
      <div class="page-header">
        <div class="decoration-header">
          <div class="row">总资产：{{$u.formatIntegerNumber(money, config.formatIntegerNumberMode)}}</div>
          <div class="row">办公环境：<span v-html="environmentHtml"></span></div>
        </div>
        <div class="decoration-preview">
          <img class="img" src="./img/d.png">
          <img v-if="company.decoration[0]" class="img unit" src="./img/d00.png">
          <img v-if="company.decoration[1]" class="img unit" src="./img/d01.png">
          <img v-if="company.decoration[2]" class="img unit" src="./img/d02.png">
          <div v-if="!company.decoration[3]" class="img unit black"></div>
          <img v-if="company.decoration[4]" class="img unit" src="./img/d04.png">
          <img v-if="company.decoration[5]" class="img unit" src="./img/d05.png">
          <img v-if="company.decoration[6]" class="img unit" src="./img/d06.png">
          <img v-if="company.decoration[7]" class="img unit" src="./img/d07.png">
          <img v-if="company.decoration[8]" class="img unit" src="./img/d08.png">
          <img v-if="company.decoration[9]" class="img unit" src="./img/d09.png">
          <img v-if="company.decoration[10]" class="img unit" src="./img/d10.png">
          <img v-if="company.decoration[11]" class="img unit" src="./img/d11.png">
        </div>
      </div>
      <div class="page-content decoration-content">
        <one-decoration v-for="(d, index) in allDecorations" :key="d.value"
                        :text="d.name" :size="company.building.size" :price="d.price" :money="money" :already-buy="company.decoration[index]" :config="config"
                        @buy="buyDecoration(index)"></one-decoration>
      </div>
      <div class="page-back" @click="backToMain()"><i class="el-icon-back"></i></div>
    </div>

    <!--迁址-->
    <div v-else-if="UIController === 'relocation'" class="page relocation">
      <div class="page-content relocation-content">
        <div class="tips">提示：迁址完毕后所有的装修都会重置，即使之前装修过的地址，再次迁回来，也不会有原有的装修记录，需要重新装修，请慎重考虑</div>
        <one-building v-for="(b, index) in allBuildings" :key="b.id"
                      :name="b.address" :size="b.size" :rent="b.rent" :is-now="company.building.id===b.id" :config="config"
                      @buy="buyBuilding(index)"></one-building>
      </div>
      <div class="page-back" @click="backToMain()"><i class="el-icon-back"></i></div>
    </div>

    <!--服务器-->
    <div v-else-if="UIController === 'server'" class="page server">
      <div class="page-header server-header">
        <div class="title-row">服务器使用率</div>
        <div class="progress-row">
          <div class="progress"><el-progress :text-inside="true" :stroke-width="18" :percentage="serversSizeRate" :color="progressColor"></el-progress></div>
          <div class="info">{{$u.formatHardDiskSize(company.serversSize) + '/' + $u.formatHardDiskSize(serversMaxSize)}}</div>
        </div>
      </div>
      <div class="page-content server-content">
        <div class="tips">提示：减少服务器时，若已使用的容量大于了缩减后的总容量，则会丢失数据，请慎重</div>
        <one-server v-for="(s, index) in allServers" :key="index"
                    :name="s.name" :desc="s.desc" :size="s.size" :price="s.price" :number="company.server[index]" :config="config"
                    @change="changeServer($event, index)"></one-server>
      </div>
      <div class="page-back" @click="backToMain()"><i class="el-icon-back"></i></div>
    </div>

    <!--贷款-->
    <div v-else-if="UIController === 'loan'" class="page loan">
      <div class="page-content loan-content">
        <one-loan v-for="(item, index) in allLoans" :key="index"
                  :item="item" :config="config" :remain-day="company.loan[index]"
                  @loan="loan(index)"></one-loan>
      </div>
      <div class="page-back" @click="backToMain()"><i class="el-icon-back"></i></div>
    </div>

    <!--广告-->
    <div v-else-if="UIController === 'ad'" class="page ad">
      <div class="page-content ad-content">
        <one-ad v-for="(item, index) in allAds" :key="index"
                :item="item" :config="config" :is-buy="company.ad[index]"
                @change="changeAd(index)"></one-ad>
      </div>
      <div class="page-back" @click="backToMain()"><i class="el-icon-back"></i></div>
    </div>

    <!--商店-->
    <div v-else-if="UIController === 'shop'" class="page shop">
      <div class="page-header shop-header">
        <div class="row">总资产：{{$u.formatIntegerNumber(money, config.formatIntegerNumberMode)}}</div>
      </div>
      <div class="page-content shop-content">
        <one-goods name="色欲" desc="恢复所有能量" :price="500000" :can-buy="money>=500000" :config="config" @buy="buyGoods(0)"></one-goods>
        <one-goods name="暴食" desc="减少一半服务器数据" :price="'随机10名开发'" :can-buy="employee[1].list.length>=10" :config="config" @buy="buyGoods(1)"></one-goods>
        <one-goods name="贪婪" desc="获得一个随机能力" :price="'随机50名员工'" :can-buy="personal.skill.length<allSkills.length&&numberOfEmployee>=51" :config="config" @buy="buyGoods(2)"></one-goods>
        <one-goods name="懒惰" desc="快速跳过30天" :price="10000" :can-buy="money>=10000" :config="config" @buy="buyGoods(3)"></one-goods>
        <one-goods name="暴怒" desc="重置所有员工的心情" :price="(numberOfEmployee-1)*500" :can-buy="numberOfEmployee>1&&money>=(numberOfEmployee-1)*500" :config="config" @buy="buyGoods(4)"></one-goods>
        <one-goods name="嫉妒" desc="重置能力与能力的价格" :price="100000000" :can-buy="money>=100000000" :config="config" @buy="buyGoods(5)"></one-goods>
        <one-goods name="傲慢" desc="献祭所有员工，每个员工提升1%的网站用户数" :price="'所有员工'" :can-buy="numberOfEmployee>=2" :config="config" @buy="buyGoods(6)"></one-goods>
      </div>
      <div class="page-back" @click="backToMain()"><i class="el-icon-back"></i></div>
    </div>

    <!--买车-->
    <div v-else-if="UIController === 'car'" class="page car">
      <div class="page-content car-content">
        <one-car-house v-for="(c, index) in allCars" :key="index"
                       :is-buy="personal.car[index]" :item="c" :money="money" :config="config"
                       @buy="buyCar(index)"></one-car-house>
      </div>
      <div class="page-back" @click="backToMain()"><i class="el-icon-back"></i></div>
    </div>

    <!--买房-->
    <div v-else-if="UIController === 'house'" class="page house">
      <div class="page-content house-content">
        <one-car-house v-for="(c, index) in allHouses" :key="index"
                       :is-buy="personal.house[index]" :item="c" :money="money" :config="config"
                       @buy="buyHouse(index)"></one-car-house>
      </div>
      <div class="page-back" @click="backToMain()"><i class="el-icon-back"></i></div>
    </div>

    <!--彩票-->
    <div v-else-if="UIController === 'lottery'" class="page lottery">
      <div class="page-header lottery-head">
        <el-input-number v-model="personal.lotteryNumber" :min="1" :step="1" step-strictly size="small"></el-input-number><span>注</span>
        <el-checkbox v-model="personal.lotteryRepeat">重复</el-checkbox>
        <div v-if="money < personal.lotteryNumber * 2" class="btn disabled">无法购买</div>
        <div v-else class="btn able" @click="buyLottery()">购买</div>
      </div>
      <div class="page-content lottery-content">
        <div>今日已购（{{personal.lottery.length}}注）：</div>
        <div class="lotteries">
          <div v-for="(l, index) in personal.lottery" :key="index" class="one-lottery">
            <div class="ball red">{{l[0]}}</div>
            <div class="ball red">{{l[1]}}</div>
            <div class="ball red">{{l[2]}}</div>
            <div class="ball red">{{l[3]}}</div>
            <div class="ball red">{{l[4]}}</div>
            <div class="ball red">{{l[5]}}</div>
            <div class="ball blue">{{l[6]}}</div>
          </div>
        </div>
        <div class="help">
          <table cellspacing="0">
            <thead>
            <tr>
              <th>奖级</th><th>中奖条件</th><th>奖金</th><th>中奖概率</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>一等奖</td><td>6+1</td><td>5000000</td><td>0.0000056%</td>
            </tr>
            <tr>
              <td>二等奖</td><td>6+0</td><td>60000</td><td>0.0000846%</td>
            </tr>
            <tr>
              <td>三等奖</td><td>5+1</td><td>3000</td><td>0.000914%</td>
            </tr>
            <tr>
              <td>四等奖</td><td>5+0、4+1</td><td>200</td><td>0.0434%</td>
            </tr>
            <tr>
              <td>五等奖</td><td>4+0、3+1</td><td>10</td><td>0.7758%</td>
            </tr>
            <tr>
              <td>六等奖</td><td>(&lt;3)+1</td><td>5</td><td>5.889%</td>
            </tr>
            </tbody>
          </table>
          <div class="tips">杠三杠提醒您：小搏怡情，大赌伤身，强赌灰飞烟灭</div>
        </div>
      </div>
      <div class="page-back" @click="backToMain()"><i class="el-icon-back"></i></div>
    </div>

    <!--股票-->
    <div v-else-if="UIController === 'stock'" class="page stock">
      <div class="page-header stock-header">
        <div class="row">总资产：{{$u.formatIntegerNumber(money, config.formatIntegerNumberMode)}}</div>
        <div class="remain-row">保底金：<el-input-number v-model="personal.stockRemain" :min="0" :step="10000" size="small"></el-input-number></div>
      </div>
      <div class="page-content stock-content">
        <one-stock v-for="(s, index) in personal.stock" :key="index"
                   :item="s" :money="money" :remain="personal.stockRemain" :config="config"
                   @showChart="showChart(index)" @buy="buyStock($event, index)" @sellAll="sellAllStock(index)"></one-stock>
      </div>
      <div class="page-back" @click="backToMain()"><i class="el-icon-back"></i></div>
    </div>

    <!--相亲广场-->
    <div v-else-if="UIController === 'date'" class="page date">
      <div class="page-header date-header">
        <!--<div class="row">总资产：{{$u.formatIntegerNumber(money, config.formatIntegerNumberMode)}}</div>-->
        <div class="row">魅力等级：Lv{{reputationLevel}}</div>
      </div>
      <div class="page-content date-content">
        <one-girl v-for="(g, index) in personal.girls" :key="index" v-if="g.show"
                  :girl="g"
                  @startChat="startChat(index)"></one-girl>
      </div>
      <div class="page-back" @click="backToMain()"><i class="el-icon-back"></i></div>
    </div>

    <!--联系人-->
    <div v-else-if="UIController === 'contact'" class="page contact">
      <div class="page-header contact-header">
        <div class="row">能量：{{personal.energy}}/{{maxEnergy}}</div>
        <div class="row">每日恢复能量：{{energyHeal}}</div>
      </div>
      <div v-if="personal.contact.length === 0" class="empty">
        <i class="el-icon-toilet-paper"></i>
        <span>暂无联系人</span>
      </div>
      <div v-else class="page-content contact-content">
        <one-contact v-for="(c, index) in personal.contact" :key="index"
                     :contact="c" :heart-html="heartNumberToHtml(hearts[index])"
                     @toChat="toChat(index)"
                     @showInfoDialog="showInfoDialog(index)"
                     @showNickNameDialog="showNickNameDialog(index)"
                     @deleteContact="showDeleteDialog(index)"></one-contact>
      </div>
      <div class="page-back" @click="backToMain()"><i class="el-icon-back"></i></div>
    </div>

    <!--聊天界面-->
    <div v-else-if="UIController === 'chat'" class="page chat">
      <div class="chat-header">
        <div class="nameRow">
          <span class="name">{{personal.contact[personal.chatIndex].girl.nickName || personal.contact[personal.chatIndex].girl.name}}</span>
          <span class="heart" v-html="heartNumberToHtml(hearts[personal.chatIndex])"></span>
        </div>
        <div class="energy">可用能量：{{personal.energy}}</div>
      </div>
      <div class="page-content chat-content">
        <one-chat v-for="(h, index) in personal.contact[personal.chatIndex].history" :key="index"
                  :history="h"></one-chat>
      </div>
      <div class="opes">
        <div v-for="(o, index) in chatOpes" :key="index"
             class="ope-btn"
             :class="{'disabled': personal.energy<o.cost+getEffectBonus('energyCost',0,'+')}"
             @click="chatOpe(index)">
          <i :class="o.icon"></i>
          <span>{{o.name}}({{o.cost+getEffectBonus('energyCost',0,'+')}})</span>
        </div>
      </div>
      <div class="page-back" @click="UIController='contact'"><i class="el-icon-back"></i></div>
    </div>

    <!--招聘-->
    <div v-else-if="UIController === 'recruit'" class="page recruit">
      <div class="page-header recruit-header">当前职位：{{employee[recruitIndex].name}}</div>
      <div class="page-content recruit-content">
        <one-seeker v-for="(s, index) in employee[recruitIndex].seekers" :key="index"
                    :seeker="s" :can-offer="numberOfEmployee + numberOfOffer < company.building.size" :config="config" :show-ability="showAbility"
                    @sendOffer="showOffer(index)"></one-seeker>
      </div>
      <div class="page-back" @click="backToMain()"><i class="el-icon-back"></i></div>
    </div>

    <div v-else-if="UIController === 'xxx'" class="page xxx">
      <div class="page-content xxx-content"></div>
      <div class="page-back" @click="backToMain()"><i class="el-icon-back"></i></div>
    </div>

    <!--弹窗-->
    <div v-if="dialogController !== ''" class="mask" @click="clickMask($event)">
      <!--破产-->
      <div v-if="dialogController === 'break'" class="dialog break">
        <div class="icon"><i class="el-icon-lightning"></i></div>
        <div class="row">公司已破产:(</div>
        <div class="row">总共持续了{{formatDay(day)}}</div>
        <div class="restart-btn" @click="initGame()">重新开始</div>
      </div>

      <!--下一天-->
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
          <div v-if="yesterdayLottery.length > 0">
            <div class="title">昨日开奖</div>
            <div class="row">{{yesterdayLottery.slice(0, 6).join(' ')}} + {{yesterdayLottery[6]}}</div>
            <div class="title">中奖纪录</div>
            <div v-if="winLottery.length === 0" class="row">无</div>
            <div v-else>
              <div v-for="(wl, index) in winLottery" :key="index" class="row">
                {{wl.lottery.slice(0, 6).join(' ')}} + {{wl.lottery[6]}} {{wl.desc}} {{wl.price}}
              </div>
            </div>
          </div>
        </div>
        <div class="continue-btn" @click="newDay()">确定</div>
      </div>

      <!--offer-->
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

      <!--股票折线图-->
      <div v-else-if="dialogController === 'stockChart'" class="dialog stockChart">
        <div id="stockChart" class="chart"></div>
        <div class="back-btn" @click="dialogController = ''">关闭</div>
      </div>

      <!--妹子详细信息-->
      <div v-else-if="dialogController === 'girlInfo'" class="dialog girlInfo">
        <div class="info-wrapper">
          <div class="cell label">姓名</div>
          <div class="cell label">年龄</div>
          <div class="cell value">{{personal.girlInfo.name}}</div>
          <div class="cell value">{{personal.girlInfo.age}}</div>
          <div class="cell label">毕业学校</div>
          <div class="cell label">实际颜值</div>
          <div class="cell value">{{personal.girlInfo.school}}</div>
          <div class="cell value">{{personal.girlInfo.appearance}}分</div>
          <div class="cell label">性格</div>
          <div class="cell label">家庭条件</div>
          <div class="cell value">{{personal.girlInfo.characterText}}</div>
          <div class="cell value">{{personal.girlInfo.familyText}}</div>
        </div>
        <div class="btn" @click="dialogController = ''">关闭</div>
      </div>

      <!--更换昵称-->
      <div v-else-if="dialogController === 'changeNickName'" class="dialog changeNickName">
        <div class="input-wrapper">
          <el-input v-model="personal.contact[personal.changeNickNameIndex].girl.nickName" placeholder="请输入昵称，空为不设定" maxlength="10" show-word-limit></el-input>
        </div>
        <div class="btn" @click="changeNickName()">确定</div>
      </div>

      <!--删除妹子-->
      <div v-else-if="dialogController === 'deleteGirl'" class="dialog deleteGirl">
        <div class="text">确定要删除{{personal.contact[personal.deleteIndex].girl.name}}吗？</div>
        <div class="ope">
          <div class="btn ok" @click="deleteContact()">删 除</div>
          <div class="btn cancel" @click="dialogController=''">取 消</div>
        </div>
      </div>

      <!--胜利-->
      <div v-else-if="dialogController === 'win'" class="dialog win">
        <div class="win-title">恭喜通关</div>
        <div class="win-content">我的三杠公司顺利运营了{{dayText}}，在此期间一共与{{statistics.totalEmployeeNumber}}位同事共同努力，总共创造了{{$u.formatIntegerNumber(statistics.totalEarn, config.formatIntegerNumberMode)}}的财富；然后我成了业界成功人士，最高资产达到了{{$u.formatIntegerNumber(maxMoney, config.formatIntegerNumberMode)}}，拥有{{carNumber}}辆车、{{houseNumber}}套房；再后来我通过某APP结识了{{personal.contact[personal.chatIndex].girl.name}}（评价：{{personal.contact[personal.chatIndex].girl.condition}}/25）并且与她结婚。现在回想自己的人生，可真是完美啊...</div>
        <div class="win-content">感谢游玩</div>
        <div class="restart-btn" @click="initGame()">再来一局</div>
      </div>

      <div v-else-if="dialogController === 'xxx'" class="dialog xxx"></div>
    </div>

  </div>
</template>

<style scoped lang="scss">
  @import "css/common";
  .gang-company{
    width: 100vw;
    background-image: linear-gradient(#c2e5ff, #7ec3e9);
    .page{
      width: 100%;
      height: 100%;
      display: flex;
      flex-flow: column nowrap;
      justify-content: center;
      align-items: center;
      .page-header{
        width: 100%;
        box-shadow: 0px 5px 10px rgba(0,0,0,.1);
      }
      .page-content{
        width: 100%;
        flex: 1 0 0;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
      }
      .page-back{
        width: 100%;
        height: 60px;
        line-height: 60px;
        background-color: $headerFooter;
        box-shadow: 0px -5px 10px rgba(0,0,0,.1);
        font-size: 32px;
        text-align: center;
      }
    }
    .tutorial{
      background-image: linear-gradient(#c0d9ff, #7b8aff);
      position: relative;
      &:before{
        content: '';
        width: 500px;
        height: 500px;
        background-color: rgba(253, 255, 0, 0.3);
        border-radius: 50%;
        position: fixed;
        top: 50px;
        left: -350px;
        animation: a3 ease-in-out 8s infinite alternate;
        @keyframes a3 {
          from{
            transform: translate(0, 0);
          }
          to{
            transform: translate(0, 150px);
          }
        }
      }
      &:after{
        content: '';
        width: 1000px;
        height: 1000px;
        background-color: rgba(255, 129, 0, 0.2);
        border-radius: 50%;
        position: fixed;
        top: 400px;
        right: -400px;
        animation: a4 ease-in-out 11s infinite alternate;
        @keyframes a4 {
          from{
            transform: translate(0, 0);
          }
          to{
            transform: translate(0, 50px);
          }
        }
      }
      .tutorial-complete-text{
        width: 80%;
        margin-bottom: 60px;
        color: rgba(0,0,0,0);
        font-size: 20px;
        font-weight: bold;
        position: relative;
        z-index: 3;
        .tutorial-text{
          position: absolute;
          top: 0;
          color: $btnBlue;
        }
      }
      .tutorial-mask{
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 2;
      }
      .tutorial-bottom{
        width: 100%;
        padding: 0 20px;
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
        z-index: 1;
        .difficulty{
          margin-bottom: 40px;
          color: $btnBlue;
          text-align: center;
          .difficulty-ope{
            margin-bottom: 10px;
          }
          .difficulty-desc{
            font-size: 14px;
          }
        }
        .tutorial-btn{
          width: 100%;
          height: 60px;
          line-height: 60px;
          margin: 0 20px;
          border-radius: 30px;
          background-color: $btnBlue;
          box-shadow: 0px 2px 10px rgba(16, 50, 75, 0.2);
          color: white;
          font-size: 20px;
          text-align: center;
        }
      }
    }
    .load-auto{
      background-image: linear-gradient(#c0d9ff, #7b8aff);
      &:before{
        content: '';
        width: 400px;
        height: 1000px;
        position: fixed;
        top: -100px;
        left: 200px;
        background-image: linear-gradient(rgba(0, 255, 124, 0.21), rgba(5, 255, 0, 0.31));
        animation: a1 ease-in-out 5s infinite alternate;
        @keyframes a1 {
          from{
            transform: translate(-20px, 0) rotate(15deg);
          }
          to{
            transform: translate(20px, 0) rotate(25deg);
          }
        }
      }
      &:after{
        content: '';
        width: 1000px;
        height: 400px;
        position: fixed;
        bottom: -350px;
        left: -200px;
        background-image: linear-gradient(rgba(207, 0, 255, 0.13), rgba(229, 0, 255, 0.2));
        animation: a2 ease-in-out 7s infinite alternate;
        @keyframes a2 {
          from{
            transform: translate(0, 50px) rotate(25deg);
          }
          to{
            transform: translate(0, -20px) rotate(15deg);
          }
        }
      }
      .text{
        margin-bottom: 40px;
        font-weight: bold;
        font-size: 20px;
        color: $btnBlue;
        z-index: 1;
      }
      .pre{
        margin-bottom: 40px;
        color: $btnBlue;
        font-size: 14px;
        display: grid;
        grid-template-columns: auto auto;
        z-index: 1;
        .label, .value{
          height: 20px;
          line-height: 20px;
        }
        .label{
          text-align: right;
        }
      }
      .opes{
        width: 100%;
        z-index: 1;
        .btn{
          margin: 0 20px 10px;
          height: 60px;
          line-height: 60px;
          border-radius: 30px;
          background-color: $btnBlue;
          box-shadow: 0px 2px 10px rgba(16, 50, 75, 0.2);
          color: white;
          font-size: 20px;
          text-align: center;
        }
      }
    }
    .main{
      .main-top{
        height: 80px;
        background-color: $headerFooter;
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
          background-color: $btnBlue;
          border-radius: 50%;
          margin: 10px;
          color: white;
          font-size: 20px;
          font-weight: bold;
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
            background-color: $cardContent;
            margin: 0 10px 10px;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 0 6px rgba(0,0,0,.1);
            .card-title{
              height: 40px;
              line-height: 40px;
              background-color: $cardTitle;
              text-align: center;
              font-weight: bold;
              font-size: 18px;
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
                color: $textBlueNormal;
                margin-bottom: 10px;
              }
            }
          }
        }
        &.employee{
          padding-top: 10px;
        }
        &.personal{
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
              position: relative;
              i{
                font-size: 24px;
                margin-bottom: 4px;
              }
              span{
                font-size: 12px;
              }
              .el-badge{
                position: absolute;
                top: 4px;
                left: 50%;
              }
            }
          }
          .card{
            background-color: $cardContent;
            margin: 0 10px 10px;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 0 6px rgba(0,0,0,.1);
            .card-title{
              height: 40px;
              line-height: 40px;
              background-color: $cardTitle;
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
                border-radius: 20px;
                margin: 10px 0;
                color: white;
                font-weight: bold;
                text-align: center;
                &.able{
                  background-color: $btnBlue;
                }
                &.disabled{
                  background-color: $btnBlueDisabled;
                }
              }
            }
          }
        }
        &.setting{
          padding: 0 20px;
          .setting-title{
            margin: 20px 0;
            font-size: 18px;
            font-weight: bold;
          }
          .setting-row{
            padding-bottom: 10px;
            border-bottom: 1px solid $border;
            .el-radio{
              margin-right: 20px;
              &:last-child{margin-right: 0}
              /deep/ .el-radio__label{
                padding-left: 5px;
              }
            }
            .setting-tips{
              margin-top: 10px;
              font-size: 10px;
              color: $textBlueNormal;
            }
          }
        }
      }
      .main-bottom{
        width: 100%;
        height: 60px;
        line-height: 60px;
        background-color: $headerFooter;
        box-shadow: 0px -5px 10px rgba(0,0,0,.1);
        text-align: center;
        display: flex;
        flex-flow: row nowrap;
        z-index: 1;
        .main-bottom-btn{
          flex: 1 0 0;
          height: 100%;
          position: relative;
          &.main-bottom-btn__selected{
            background-color: $headerFooterDeep;
            font-weight: bold;
            &:before{
              content: "";
              width: 100%;
              height: 4px;
              background-color: $headerFooterDark;
              position: absolute;
              top: 0;
              left: 0;
            }
          }
          .el-badge{
            position: absolute;
            font-weight: normal;
            top: -10px;
            left: 60%;
          }
        }
      }
    }
    .manage{
      .manage-content{
        padding: 0 20px;
        .manage-title{
          margin: 20px 0;
          font-size: 18px;
          font-weight: bold;
        }
        .manage-row{
          padding-bottom: 10px;
          border-bottom: 1px solid $border;
          .el-checkbox{
            margin-right: 10px;
            .el-checkbox__label{
              padding-left: 5px;
            }
          }
          .manage-tips{
            margin-top: 10px;
            font-size: 10px;
            color: $textBlueNormal;
          }
        }
      }
    }
    .decoration{
      .decoration-header{
        background-color: $headerFooter;
        padding: 10px 20px;
        .row{}
      }
      .decoration-preview{
        width: 100%;
        position: relative;
        .img{
          width: 100vw;
          height: 56vw;
          display: block;
        }
        .unit{
          position: absolute;
          top: 0;
          left: 0;
        }
        .black{
          background-color: rgba(0,0,0,.5);
          z-index: 1;
        }
      }
      .decoration-content{
      }
    }
    .relocation{
      .relocation-content{
        .tips{
          width: 100%;
          padding: 10px 20px;
          background-color: $headerFooter;
          font-size: 12px;
        }
      }
    }
    .server{
      .server-header{
        height: 70px;
        padding: 10px 20px 0;
        background-color: $headerFooter;
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
        .tips{
          width: 100%;
          padding: 10px 20px;
          background-color: $headerFooterLight;
          font-size: 12px;
        }
      }
    }
    .loan{
      .loan-content{}
    }
    .ad{
      .ad-content{
      }
    }
    .shop{
      .shop-header{
        height: 40px;
        line-height: 40px;
        background-color: $headerFooter;
        padding: 0 20px;
        .row{}
      }
      .shop-content{}
    }
    .car{
      .car-content{}
    }
    .house{
      .house-content{}
    }
    .lottery{
      .lottery-head{
        height: 60px;
        background-color: $headerFooter;
        padding: 0 20px;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        .el-input-number{
          margin: 0 4px;
        }
        .el-checkbox{
          margin-left: 10px;
          /deep/ .el-checkbox__label{
            padding-left: 4px;
          }
        }
        .btn{
          width: 80px;
          height: 40px;
          line-height: 40px;
          border-radius: 20px;
          color: white;
          text-align: center;
          &.able{
            background-color: $btnBlue;
          }
          &.disabled{
            background-color: $btnBlueDisabled;
            cursor: no-drop;
          }
        }
      }
      .lottery-content{
        padding: 10px 20px;
        .lotteries{
          padding: 20px 0;
          .one-lottery{
            margin-top: 10px;
            &:first-child{margin-top: 0}
            display: flex;
            flex-flow: row nowrap;
            .ball{
              width: 36px;
              height: 36px;
              line-height: 36px;
              border-radius: 20px;
              margin-right: 4px;
              color: white;
              font-size: 20px;
              font-weight: bold;
              text-align: center;
              &:last-child{
                margin-left: 10px;
                margin-right: 0;
              }
              &.red{
                background-color: #ff5030;
              }
              &.blue{
                background-color: #5b64ff;
              }
            }
          }
        }
        .help{
          font-size: 12px;
          color: $textBlueNormal;
          border-top: 1px solid $border;
          table{
            width: 100%;
            margin-top: 20px;
            border-bottom: 1px solid $border;
            border-right: 1px solid $border;
            th, td{
              padding: 5px;
              border-top: 1px solid $border;
              border-left: 1px solid $border;
            }
          }
          .tips{
            margin-top: 10px;
          }
        }
      }
    }
    .stock{
      .stock-header{
        background-color: $headerFooter;
        padding: 10px 20px;
        .row{}
        .remain-row{
          margin-top: 10px;
          .el-input-number{
            width: 180px;
          }
        }
      }
      .stock-content{}
    }
    .date{
      .date-header{
        background-color: $headerFooter;
        padding: 10px 20px;
        .row{}
      }
      .date-content{
      }
    }
    .contact{
      .contact-header{
        background-color: $headerFooter;
        padding: 10px 20px;
        .row{}
      }
      .empty{
        width: 100%;
        flex: 1 0 0;
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;
        color: $textBlueNormal;
        i{
          font-size: 48px;
          margin-bottom: 10px;
        }
        span{
          font-weight: bold;
        }
      }
      .contact-content{
      }
    }
    .chat{
      .chat-header{
        width: 100%;
        background-color: $headerFooter;
        padding: 10px 20px;
        text-align: center;
        .nameRow{
          margin-bottom: 10px;
          .name{
            font-weight: bold;
          }
          .heart{
            font-size: 20px;
            color: #f249b0;
            letter-spacing: -4px;
          }
        }
        .energy{
          font-size: 12px;
          color: $textBlue;
        }
      }
      .chat-content{
        background-color: #c2e5ff;
        padding: 10px 30px;
      }
      .opes{
        width: 100%;
        background-color: #84c8f9;
        display: flex;
        flex-flow: row wrap;
        .ope-btn{
          width: 25%;
          height: 64px;
          display: flex;
          flex-flow: column nowrap;
          justify-content: center;
          align-items: center;
          &.disabled{
            color: $textBlueNormal;
          }
          i{
            font-size: 24px;
            margin-bottom: 4px;
          }
          span{
            font-size: 12px;
          }
        }
      }
    }
    .recruit{
      .recruit-header{
        height: 40px;
        line-height: 40px;
        padding: 0 20px;
        background-color: $headerFooter;
      }
      .recruit-content{}
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
            background-color: $btnBlueLight;
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
            background-color: $btnBlueLight;
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
              &.send{background-color: $btnBlueLight}
              &.cancel{background-color: $btnGray
              }
              &.disabled{background-color: $btnBlueDisabled}
            }
          }
        }
        &.stockChart{
          width: 90%;
          .chart{
            width: 100%;
            height: 300px;
            padding: 0 20px;
          }
          .back-btn{
            width: 100%;
            height: 60px;
            line-height: 60px;
            background-color: $btnBlueLight;
            text-align: center;
            color: white;
            font-weight: bold;
          }
        }
        &.girlInfo{
          width: 80%;
          .info-wrapper{
            width: 100%;
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: repeat(6, 40px);
            .cell{
              line-height: 40px;
              text-align: center;
            }
            .label{
              background-color: #eee;
              font-weight: bold;
            }
            .value{
              background-color: white;
            }
          }
          .btn{
            width: 100%;
            height: 60px;
            line-height: 60px;
            background-color: $btnBlueLight;
            text-align: center;
            color: white;
            font-weight: bold;
          }
        }
        &.changeNickName{
          width: 80%;
          .input-wrapper{
            width: 100%;
            padding: 20px;
          }
          .btn{
            width: 100%;
            height: 60px;
            line-height: 60px;
            background-color: $btnBlueLight;
            text-align: center;
            color: white;
            font-weight: bold;
          }
        }
        &.deleteGirl{
          width: 80%;
          .text{
            padding: 20px;
            text-align: center;
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
              &.ok{background-color: $btnBlueLight}
              &.cancel{background-color: #c9cbd1}
            }
          }
        }
        &.win{
          width: 80%;
          .win-title{
            height: 40px;
            line-height: 40px;
            margin-top: 20px;
            font-weight: bold;
            text-align: center;
          }
          .win-content{
            padding: 0 20px;
            text-indent: 32px;
            margin-bottom: 10px;
          }
          .restart-btn{
            width: 100%;
            height: 60px;
            line-height: 60px;
            margin-top: 20px;
            background-color: $btnBlueLight;
            text-align: center;
            color: white;
            font-weight: bold;
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
  import oneCarHouse from "./components/one-car-house"
  import oneChat from "./components/one-chat"
  import oneContact from "./components/one-contact"
  import oneDecoration from "./components/one-decoration"
  import oneGirl from "./components/one-girl"
  import oneGoods from "./components/one-goods"
  import oneLoan from "./components/one-loan"
  import onePosition from "./components/one-position"
  import oneSeeker from "./components/one-seeker"
  import oneServer from "./components/one-server"
  import oneSkill from "./components/one-skill"
  import oneStock from "./components/one-stock"

  //db mixins
  import ads from "./db/ads"
  import buildings from "./db/buildings"
  import cars from "./db/cars"
  import chatWords from "./db/chatWords"
  import cSkills from "./db/cSkills"
  import curses from "./db/curses"
  import decorations from "./db/decorations"
  import houses from "./db/houses"
  import loans from "./db/loans"
  import servers from "./db/servers"
  import skills from "./db/skills"
  import stocks from "./db/stocks"

  //echarts
  let echarts = require('echarts')

  function getSum(total, num){
    return total + num;
  }

  function range(num, min = null, max = null) {
    if(min !== null) num = Math.max(num, min);
    if(max !== null) num = Math.min(num, max);
    return num;
  }

  function shuffleArray(arr){
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
  }

  function getRandom(arr) {
    if(arr.length === 0) return null;
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function getRandomName(gender) {
    //1男 2女
    let lastNames = "赵钱孙李周吴郑王冯陈褚卫蒋沈韩杨朱秦尤许何吕施张孔曹严华金魏陶姜戚谢邹喻柏水窦章云苏潘葛奚范彭郎鲁韦昌马苗凤花方俞任袁柳酆鲍史唐费廉岑薛雷贺倪汤滕殷罗毕郝邬安常乐于时傅皮卞齐康伍余元卜顾孟平黄和穆萧尹姚邵湛汪祁毛禹狄米贝明臧计伏成戴谈宋茅庞熊纪舒屈项祝董梁杜阮蓝闵席季麻强贾路娄危江童颜郭梅盛林刁钟徐邱骆高夏蔡田樊胡凌霍虞万支柯管卢莫经房裘缪干解应宗丁宣贲邓郁单杭洪包诸左石崔吉龚程邢滑裴陆荣翁荀羊惠甄曲家封芮羿储松井段富巫乌焦巴弓牧隗山谷车侯全秋仲伊宫宁仇甘钭厉戎祖武符刘景詹束龙叶幸司黎宿白怀从赖卓蔺屠蒙池乔阴能苍双闻莘党翟姬申扶桑桂牛寿通边扈燕冀浦尚农温别庄晏柴瞿阎慕连习艾鱼容向古易戈廖耿满弘匡国文广蔚越聂晁勾敖冷辛那简曾沙关相荆权盖";
    let boys = "伟刚勇毅俊峰强军平保东文辉力明永健世广志义兴良海山仁波宁贵福生龙元全国胜学祥才发武新利清飞彬富顺信子杰涛昌成康星光天达安岩中茂进林有坚和彪博诚先敬震振壮会思群豪心邦承乐绍功松善厚庆磊民友裕河哲江超浩亮政谦奇固之轮翰朗伯宏言鸣朋斌梁栋维启克伦翔旭鹏泽晨辰士以建家致树炎德行泰盛雄琛钧冠策腾楠榕风航弘宇";
    let girls = "秀娟英华慧巧美娜静淑惠珠翠雅芝玉萍红娥玲芬芳燕彩春菊兰凤洁梅琳素云莲真环雪荣爱妹霞香月莺媛艳瑞佳嘉琼勤珍莉桂娣璧璐娅琦晶妍茜秋珊莎锦黛青倩婷姣婉娴瑾颖露瑶怡婵仪荷丹蓉眉君琴蕊薇菁梦岚苑婕馨瑗琰韵融园艺卿聪澜纯毓悦昭冰琬茗羽希宁欣育馥筠柔竹凝晓欢霄枫芸菲寒伊亚宜可姬舒影荔枝思丽";

    let lastName = lastNames.charAt(Math.floor(Math.random() * lastNames.length));
    let firstName = "";
    let length = Math.random() < 0.33 ? 1 : 2; //33%几率单名 剩下为双名
    for(let i = 0; i < length; i++){
      firstName += gender === 1 ?
        boys.charAt(Math.floor(Math.random() * boys.length)) :
        girls.charAt(Math.floor(Math.random() * girls.length));
    }

    //单名有10%几率变为ABB形式
    if(length === 1 && Math.random() < 0.1){
      firstName += firstName[0];
    }

    return lastName + firstName;
  }

  function getRandomSeeker(gender = 0, minAbility = 10, averageSalary) {
    //性别
    if(gender === 0){
      gender = Math.ceil(Math.random() * 2); //1男 2女
    }
    //姓名
    let name = getRandomName(gender);
    //年龄
    let age = Math.floor(Math.random() * 20) + 18;  //18-37
    //能力
    minAbility = Math.min(minAbility, 100);
    let ability = Math.floor(Math.random() * (101 - minAbility)) + minAbility; //10-100
    //期望日薪
    let expectSalary = Math.round(averageSalary *
      (ability/90+1.5-10/9) * //能力因素 10-100 0.5-1.5
      (age*0.7/19+1.5-0.7/19*37) * //年龄因素 18-37 0.8-1.5
      (Math.random() * 0.5 + 0.75)); //随机因素 0.75-1.25

    return {
      name,
      gender,
      age,
      ability,
      expectSalary
    }
  }

  function getRandomGirl() {
    let schoolDB = [
      [],
      ["叶村小学", "解放军第八小学", "善各庄小学", "以撒修道院", "五道口小学", "中山小学", "城北小学"],
      ["山东蓝翔", "新东方烹饪学院", "丽水学院", "北大青鸟", "九九汽修", "蓉蓉美容院", "琵琶贴膜厂", "城北毛巾厂"],
      ["北京交通大学", "厦门大学", "重庆大学", "吉林大学", "同济大学", "南方科技大学", "北京科技大学", "北京化工大学", "武汉大学"],
      ["北京大学", "清华大学", "浙江大学", "复旦大学", "上海交通大学", "华中科技大学", "哈尔滨工业大学"],
      ["耶鲁大学", "哈佛大学", "斯坦福大学", "剑桥大学", "哥伦比亚大学", "麻省理工学院", "东京大学"]
    ];
    //姓名
    let name = getRandomName(2);
    //年龄
    let age = Math.floor(Math.random() * 12) + 18;  //18-29
    //学历
    let education = Math.ceil(Math.random() * 5); //1-5
    //毕业学校
    let school = schoolDB[education][Math.floor(Math.random() * schoolDB[education].length)];
    //颜值
    let appearance = Math.ceil(Math.random() * 10); //1-10
    let appearanceByApp = range(appearance + Math.ceil(Math.random() * 9 - 3), 1, 10); //-2~6
    //性格
    let character = Math.ceil(Math.random() * 5); //1-5
    let characterText = ["", "气吞山河", "离经叛道", "循规蹈矩", "活泼开朗", "温柔贤惠"][character];
    //家庭条件
    let family = Math.ceil(Math.random() * 5); //1-5
    let familyText = ["", "艰苦", "普通", "温饱", "小康", "富裕"][family];

    return {
      name,
      age,
      education,
      school,
      appearance,
      appearanceByApp,
      character,
      characterText,
      family,
      familyText,
      condition: appearance + education + character + family,
      show: true
    }
  }

  export default {
    name: "gangCompany",
    mixins: [ads, buildings, cars, chatWords, cSkills, curses, decorations, houses, loans, servers, skills, stocks],
    components: {oneAd, oneBuilding, oneCarHouse, oneChat, oneContact, oneDecoration, oneGirl, oneGoods, oneLoan, onePosition, oneSeeker, oneServer, oneSkill, oneStock},
    data(){
      return{
        height: 0,
        notifyPromise: Promise.resolve(),
        autoSaveInfo: {
          date: "",
          day: 0,
          money: 0
        },
        tutorialCompleteText: "我叫杠三杠，今年34岁，曾经是一名优秀的前端工程师，不久之前被公司裁员，现在家里催婚催得很紧，然而相亲市场竞争激烈，没有人看得上我，我拿着毕业以来积攒的全部积蓄，开了一家三杠科技有限公司...",
        difficulty: 0,
        difficulties: [
          {
            initMoney: 500000,
            baseLossRate: 0.01,
            curse: 0
          },
          {
            initMoney: 400000,
            baseLossRate: 0.01,
            curse: 0
          },
          {
            initMoney: 400000,
            baseLossRate: 0.03,
            curse: 0
          },
          {
            initMoney: 400000,
            baseLossRate: 0.03,
            curse: 1
          },
          {
            initMoney: 300000,
            baseLossRate: 0.03,
            curse: 1
          },
          {
            initMoney: 300000,
            baseLossRate: 0.05,
            curse: 1
          },
          {
            initMoney: 300000,
            baseLossRate: 0.05,
            curse: 2
          },
          {
            initMoney: 300000,
            baseLossRate: 0.05,
            curse: 3
          },
          {
            initMoney: 300000,
            baseLossRate: 0.05,
            curse: 4
          },
        ],
        chatOpes: [
          {
            name: "闲聊",
            icon: "el-icon-chat-dot-round",
            cost: 1,
            emotion: 1
          },
          {
            name: "发红包",
            icon: "el-icon-price-tag",
            cost: 3,
            emotion: 1
          },
          {
            name: "吃饭",
            icon: "el-icon-food",
            cost: 4,
            emotion: 10
          },
          {
            name: "看电影",
            icon: "el-icon-video-camera",
            cost: 4,
            emotion: 20
          },
          {
            name: "送礼物",
            icon: "el-icon-present",
            cost: 3,
            emotion: 1
          },
          {
            name: "旅游",
            icon: "el-icon-position",
            cost: 6,
            emotion: 40
          },
          {
            name: "表白",
            icon: "el-icon-link",
            cost: 10,
            emotion: 60
          },
          {
            name: "求婚",
            icon: "el-icon-connection",
            cost: 10,
            emotion: 99
          }
        ],
        progressColor: [
          {color: '#5cb87a', percentage: 60},
          {color: '#e6a23c', percentage: 80},
          {color: '#f56c6c', percentage: 100}
        ],

        config: {
          formatIntegerNumberMode: 1,
        },
        UIController: "",
        dialogController: "",
        tutorialText: "",
        isTutorialAnimating: true,
        tutorialAnimationTimer: null,
        mainType: "personal",
        history: [],
        statistics: {
          totalEarn: 0,
          totalEmployeeNumber: 0
        },
        money: 0,
        day: 0,
        baseLossRate: 0,
        company: {
          manage: {
            workHours: 8,
            workDays: [],
            hr: [],
            eliminate: false,
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
        personal: {
          skill: [],
          curse: [],
          car: [],
          house: [],
          lottery: [],
          lotteryNumber: 1,
          lotteryRepeat: false,
          stock: [],
          stockRemain: 0,
          girls: [],
          contact: [],
          girlInfo: {
            name: '',
            age: 0,
            appearance: '',
            school: '',
            characterText: '',
            familyText: ''
          },
          energy: 0,
          chatIndex: 0,
          changeNickNameIndex: 0,
          deleteIndex: 0,
        },
        yesterdayLottery: [],
        winLottery: [],
      }
    },
    computed: {
      dayText(){
        let year = Math.floor(this.day / 365);
        let day = this.day - 365 * year;
        return (year > 0 ? `${year}年` : '') + (day > 0 ? `${day}天` : '');
      },
      maxMoney(){
        let max = 0;
        this.history.forEach(h => {
          if(h){
            if(h.money > max){
              max = h.money;
            }
          }
        });
        return max;
      },
      weekday(){
        return ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"][this.day % 7];
      },
      isTodayWorkDay(){
        return this.company.manage.workDays[(this.day + 6) % 7];
      },
      newSkillPrice(){
        return 500 * Math.pow(2, this.personal.skill.length) * this.getEffectBonus("skillPrice", 1, "+");
      },
      combinedSkill(){
        let cs = [];
        this.allCombinedSkills.forEach((c, index) => {
          if(c.condition.every(i => this.personal.skill.indexOf(i) > -1)){
            cs.push(index);
          }
        });
        return cs;
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
        let skillBonus = this.getEffectBonus("popularity", 1, "+");
        return (userBase + adBonus) * skillBonus;
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
        let base = 0.7 - 200 / (this.popularity + 500);
        let skillBonus = this.getEffectBonus("basicAcceptOfferRate", 0, "+");
        return base + skillBonus;
      },
      environment(){
        let e = 0;
        this.allDecorations.forEach((d, index) => {
          if(this.company.decoration[index]){
            e += d.environmentWeight;
          }
        });
        return e + this.getEffectBonus("environment", 0, "+");
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
      maxUserAdd(){
        return 500 * Math.pow(2, this.employee[7].list.length);
      },
      websiteCal(){
        let adBonus = 0;
        this.allAds.forEach((n, index) => {
          if(this.company.ad[index]){
            adBonus += n.bonus;
          }
        });
        let userAddBonus = this.getEffectBonus("userAdd", 1, "+");
        let architectBonus = Math.sqrt(this.getTotalEmployeeEfficiency(6)) / 20 + 1;
        let ueBonus = this.getEffectBonus("ue", 1, "+");
        let uiBonus = this.getEffectBonus("ui", 1, "+");
        let speedBonus = this.getEffectBonus("speed", 1, "+");
        let bugRateBonus = this.getEffectBonus("bugRate", 0, "+");
        return {
          userAdd: range(Math.round(((this.isTodayWorkDay ? this.getTotalEmployeeEfficiency(1) : 0) + adBonus) * userAddBonus * architectBonus * Math.exp(-this.company.serverFullDay)), 0, this.maxUserAdd),
          userLoss: Math.round(this.website.user * this.lossRate),
          ue: this.getTotalEmployeeEfficiency(2) * ueBonus * architectBonus,
          ui: this.getTotalEmployeeEfficiency(3) * uiBonus * architectBonus,
          speed: this.getTotalEmployeeEfficiency(4) * this.serverAverageSpeed * speedBonus * architectBonus,
          bugRate: this.getEffectBonus("fixedBugRate", 0, "+") > 0 ? 0.1 : range(Math.sqrt(this.website.user) / 1000 - this.getTotalEmployeeEfficiency(5) / 1000 - this.getTotalEmployeeEfficiency(14) / 125 + bugRateBonus, 0, null),
        };
      },
      vipRate(){
        let sum = this.websiteCal.ue + this.websiteCal.ui + this.websiteCal.speed
        return 1 - Math.exp(-sum / 10000);
      },
      vipPrice(){
        return Math.sqrt(this.getTotalEmployeeEfficiency(10)) / 25 + 1;
      },
      lossRate(){
        let base = this.baseLossRate;
        let effectBonus = this.getEffectBonus("lossRate", 0, "+");
        let planBonus = Math.exp(-this.getTotalEmployeeEfficiency(8) / 1000);
        return range((base + effectBonus) * planBonus, 0, 1);
      },
      profit(){
        let p = {
          base: this.website.user * this.getEffectBonus("baseProfit", 1, "+"),
          vip: this.website.vip * this.vipPrice * this.getEffectBonus("vipProfit", 1, "+"),
        };
        //全部取整
        for(let key in p){
          p[key] = Math.round(p[key]);
        }
        return p;
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
        let b = this.getTotalEmployeeEfficiency(11);
        let bonus = 1 / (b / 4000 + 1);
        return s * bonus;
      },
      electricityCost(){
        let e = 0;
        this.allDecorations.forEach((d, index) => {
          if(this.company.decoration[index]){
            e += d.electricity;
          }
        });
        return e * this.company.building.size * this.getEffectBonus("electricityCost", 1, "+");
      },
      netCost(){
        let n = 0;
        this.allServers.forEach((s, index) => {
          n += s.price * this.company.server[index];
        });
        return n * this.getEffectBonus("netCost", 1, "+");
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
        let c = {
          salary: this.salaryCost,
          rent: this.company.building.rent * this.getEffectBonus("rentCost", 1, "+"),
          electricity: this.electricityCost,
          net: this.netCost,
          loan: this.loanCost,
          ad: this.adCost,
        };
        //全部取整
        for(let key in c){
          c[key] = Math.round(c[key]);
        }
        return c;
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
      showAbility(){
        return this.getEffectBonus("showAbility", 0, "+");
      },
      showMood(){
        return this.getEffectBonus("showMood", 0, "+");
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
        let seekerNumberBonus = this.getEffectBonus("seekerNumber", 0, "+");
        return range(this.popularityLevel + seekerNumberBonus, 1, null); //最少1人
      },
      carNumber(){
        return this.personal.car.filter(n => n).length;
      },
      houseNumber(){
        return this.personal.house.filter(n => n).length;
      },
      reputation(){
        let r = 0;
        let bonus = this.getEffectBonus("reputation", 1, "+");
        this.personal.car.forEach((b, index) => {
          if(b) r += this.allCars[index].reputation;
        });
        this.personal.house.forEach((b, index) => {
          if(b) r += this.allHouses[index].reputation;
        });
        return Math.round(r * bonus);
      },
      reputationLevel(){
        if(this.reputation < 0) return 0;
        if(this.reputation < 10) return 1;
        if(this.reputation < 40) return 2;
        if(this.reputation < 100) return 3;
        if(this.reputation < 250) return 4;
        if(this.reputation < 1000) return 5;
        if(this.reputation < 5000) return 6;
        if(this.reputation < 23333) return 7;
        return 8;
      },
      hearts(){
        return this.personal.contact.map(c => {
          let number;
          if(c.emotion < 10) number = 0;
          else if(c.emotion < 20) number = 1;
          else if(c.emotion < 40) number = 2;
          else if(c.emotion < 60) number = 3;
          else if(c.emotion < 80) number = 4;
          else number = 5;
          return number;
        });
      },
      allUnread(){
        let u = 0;
        this.personal.contact.forEach(c => {
          u += c.unread;
        });
        return u;
      },
      maxEnergy(){
        return this.getEffectBonus("maxEnergy", 10, "+");
      },
      energyHeal(){
        return this.getEffectBonus("energyHeal", 3, "+");
      }
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

        // let lastTouchEnd = 0
        // document.addEventListener('touchend', (event) => {
        //   const now = (new Date()).getTime()
        //   if (now - lastTouchEnd <= 300) {
        //     event.preventDefault()
        //   }
        //   lastTouchEnd = now
        // }, false)
      })();

      //键盘事件
      //全局空格事件
      document.onkeydown = (event) => {
        if(event.keyCode === 32 || event.keyCode === 13){
          //阻止空格滚动
          event.preventDefault();
          //空格或回车
          if(this.UIController === "tutorial"){
            //主菜单
            if(this.isTutorialAnimating){
              this.skipTutorialAnimating();
            } else {
              this.startGame();
            }
          } else if(this.UIController === "main"){
            //主界面
            if(this.dialogController === ""){
              //下一天
              this.next();
            } else if(this.dialogController === "next") {
              //确定
              this.newDay();
            }
          } else if(this.UIController === "recruit") {
            //招聘
            if(this.dialogController === "offer"){
              this.sendOffer();
            }
          }
        }
      };

      if(localStorage.getItem("autoSave")){
        let autoSave = JSON.parse(localStorage.getItem("autoSave"));
        this.autoSaveInfo.date = autoSave._saveDate;
        this.autoSaveInfo.day = autoSave.day;
        this.autoSaveInfo.money = autoSave.money;
        this.UIController = "loadAuto";
      } else {
        this.initGame();
      }
    },
    methods: {
      notify(msg) {
        this.notifyPromise = this.notifyPromise.then(this.$nextTick).then(()=>{
          this.$notify({
            message: msg,
            showClose: false,
            duration: 1500,
            position: 'top-left'
          });
        });
      },
      autoSave(){
        let data = {};
        data._saveDate = new Date().format("yyyy-MM-dd hh:mm:ss");
        data.config = this.config;
        data.UIController = this.UIController;
        data.dialogController = this.dialogController;
        data.tutorialText = this.tutorialText;
        data.isTutorialAnimating = this.isTutorialAnimating;
        data.tutorialAnimationTimer = this.tutorialAnimationTimer;
        data.mainType = this.mainType;
        data.history = this.history;
        data.statistics = this.statistics;
        data.money = this.money;
        data.day = this.day;
        data.baseLossRate = this.baseLossRate;
        data.company = this.company;
        data.website = this.website;
        data.employee = this.employee;
        data.recruitIndex = this.recruitIndex;
        data.seekerIndex = this.seekerIndex;
        data.personal = this.personal;
        localStorage.setItem("autoSave", JSON.stringify(data));
      },
      loadAutoSave(){
        Object.assign(this, JSON.parse(localStorage.getItem("autoSave")));
      },
      filterNullEmployee(){
        this.employee.forEach(p => {
          p.list = p.list.filter(e => e);
        });
      },
      initGame(){
        //各项数据初始化
        this.UIController = "tutorial";
        this.dialogController = "";
        this.tutorialText = "";
        this.isTutorialAnimating = true;
        this.tutorialAnimationTimer = null;
        this.mainType = "company";
        this.history = [{}];
        this.statistics =  {
          totalEarn: 0,
          totalEmployeeNumber: 0
        },
        this.money = 0;
        this.day = 1;
        this.company = {
          manage: {
            workHours: 8,
            workDays: [true, true, true, true, true, false, false],
            hr: [],
            eliminate: false,
          },
          building: this.allBuildings[0],
          decoration: [],
          server: this.allServers.map(n => 0),
          serversSize: 0,
          serverFullDay: 0,
          loan: this.allLoans.map(n => 0),
          ad: this.allAds.map(n => false),
        };
        this.initDecoration();
        this.website = {
          user: 0,
          vip: 0,
          isBug: false,
        };
        this.employee = [
          /* 0*/ {name: "老板", showFull: false, unlock: true, list: [], seekers: [], gender: 0, averageSalary: 0, info: ""},
          /* 1*/ {name: "开发", showFull: false, unlock: true, list: [], seekers: [], gender: 0, averageSalary: 500, info: "提高用户增量"},
          /* 2*/ {name: "产品", showFull: false, unlock: false, list: [], seekers: [], gender: 0, averageSalary: 450, info: "提高用户体验UE"},
          /* 3*/ {name: "设计", showFull: false, unlock: false, list: [], seekers: [], gender: 0, averageSalary: 400, info: "提高用户界面UI"},
          /* 4*/ {name: "运维", showFull: false, unlock: false, list: [], seekers: [], gender: 0, averageSalary: 400, info: "提高响应速度"},
          /* 5*/ {name: "测试", showFull: false, unlock: false, list: [], seekers: [], gender: 0, averageSalary: 400, info: "降低bug概率"},
          /* 6*/ {name: "架构师", showFull: false, unlock: false, list: [], seekers: [], gender: 0, averageSalary: 1000, info: "提高开发、产品、设计、运维的效率"},
          /* 7*/ {name: "技术总监", showFull: false, unlock: false, list: [], seekers: [], gender: 1, averageSalary: 1500, info: "提高用户增量的上限值"},
          /* 8*/ {name: "策划", showFull: false, unlock: false, list: [], seekers: [], gender: 0, averageSalary: 888, info: "降低用户流失率"},
          /* 9*/ {name: "人力", showFull: false, unlock: false, list: [], seekers: [], gender: 0, averageSalary: 500, info: "自动招聘新员工"},
          /*10*/ {name: "销售", showFull: false, unlock: false, list: [], seekers: [], gender: 0, averageSalary: 800, info: "提高会员日价"},
          /*11*/ {name: "财务", showFull: false, unlock: false, list: [], seekers: [], gender: 0, averageSalary: 1000, info: "在不影响员工心情的同时，降低工资"},
          /*12*/ {name: "规划师", showFull: false, unlock: false, list: [], seekers: [], gender: 0, averageSalary: 600, info: "开除末位员工"},
          /*13*/ {name: "大数据分析师", showFull: false, unlock: false, list: [], seekers: [], gender: 0, averageSalary: 2500, info: "清理服务器过期资源"},
          /*14*/ {name: "测试经理", showFull: false, unlock: false, list: [], seekers: [], gender: 0, averageSalary: 4000, info: "大幅降低bug概率"},
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
        this.personal = {
          skill: [],
          curse: [],
          car: this.allCars.map(n => false),
          house: this.allHouses.map(n => false),
          lottery: [],
          lotteryNumber: 1,
          stock: this.allStocks.map(s => {
            return {
              name: s.name,
              price: s.price,
              originalPrice: s.price,
              yesterdayPrice: s.price,
              number: 0,
              v: (Math.random() * 2 - 1) * s.v,
              a: s.a
            }
          }),
          stockRemain: 0,
          girls: [],
          contact: [],
          girlInfo: {
            name: '',
            age: 0,
            appearance: '',
            school: '',
            characterText: '',
            familyText: ''
          },
          energy: 10,
          chatIndex: 0,
          changeNickName: 0,
          deleteIndex: 0,
        };
        this.yesterdayLottery = [];
        this.winLottery = [];

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
      initDecoration(){
        this.company.decoration = this.allDecorations.map(n => false);
      },
      startGame(){
        //启动资金
        this.money = this.difficulties[this.difficulty].initMoney;
        //基本流失率
        this.baseLossRate = this.difficulties[this.difficulty].baseLossRate;
        //获得诅咒
        let curseNumber = this.difficulties[this.difficulty].curse;
        for(let i = 0; i < curseNumber; i++){
          let arr = this.allCurses.map((n, i) => i).filter(i => this.personal.curse.indexOf(i) === -1);
          let newIndex = arr[Math.floor(Math.random() * arr.length)];
          this.personal.curse.push(newIndex);
          this.notify(`获得诅咒：${this.allCurses[newIndex].name}`);
        }
        //刷新求职者
        this.refreshSeekers();
        //刷新相亲广场
        this.refreshGirls();
        this.backToMain();
      },
      skipTutorialAnimating(){
        if(this.isTutorialAnimating){
          clearInterval(this.tutorialAnimationTimer);
          this.tutorialText = this.tutorialCompleteText;
          this.isTutorialAnimating = false;
        }
      },
      formatDay(d){
        let year = Math.floor(d / 365);
        let day = d - 365 * year;
        return (year > 0 ? `${year}年` : '') + (day > 0 ? `${day}天` : '');
      },
      unlock(index){
        if(!this.employee[index].unlock){
          this.employee[index].unlock = true;
          this.notify(`已解锁职位：${this.employee[index].name}`);
        }
      },
      backToMain(){
        this.UIController = "main";
        this.$nextTick(() => {
          let el = document.getElementsByClassName("main-center");
          if(el.length > 0){
            el[0].scrollTop = 0;
          }
        });
      },
      next(showDialog = true){
        //历史
        this.history.push({
          money: this.money,
          totalProfit: this.totalProfit,
          totalCost: this.totalCost,
          numberOfEmployee: this.numberOfEmployee,
          stocks: this.personal.stock.map(s => s.price),
        });
        //结算钱
        this.money -= this.totalCost;
        this.website.isBug = Math.random() < this.websiteCal.bugRate;
        //触发bug
        if(this.website.isBug){
          //解锁测试
          this.unlock(5);
        } else {
          this.money += this.totalProfit;
          this.statistics.totalEarn += this.totalProfit;
        }
        //彩票
        if(this.personal.lottery.length > 0){
          this.yesterdayLottery = this.generateLottery();
          this.personal.lottery.forEach(l => {
            this.checkLottery(l);
          });
          this.personal.lottery = [];
        } else {
          this.yesterdayLottery = [];
        }
        //股票
        this.personal.stock.forEach(s => {
          s.yesterdayPrice = s.price;
          s.a = (s.originalPrice - s.price) * Math.random() * 0.05;
          s.v += s.a;
          s.price = range(Math.round((s.price + s.v + (Math.random() * 2 - 1) * s.originalPrice / 10) * 100) / 100, s.originalPrice / 2, null);
        });

        if(this.money < 0){
          this.dialogController = "break";
          localStorage.removeItem("autoSave");
        } else{
          //服务器容量
          this.company.serversSize = range(this.company.serversSize + this.website.user * this.getEffectBonus("serversSizePerUser", 1, "+") - this.getTotalEmployeeEfficiency(13) * 10000, 0, null);
          if(this.company.serversSize >= 1024){
            //解锁运维
            this.unlock(4);
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
          //用户数量
          this.website.user += this.websiteCal.userAdd - this.websiteCal.userLoss;
          this.website.user = range(this.website.user, 0, null);
          this.website.vip = Math.round(this.website.user * this.vipRate);
          //解锁产品
          if(this.website.user > 500){
            this.unlock(2);
          }
          //解锁UI
          if(this.website.user > 1000){
            this.unlock(3);
          }
          //解锁架构师
          if(this.employee[1].list.length
            + this.employee[2].list.length
            + this.employee[3].list.length
            + this.employee[4].list.length >= 15){
            this.unlock(6);
          }
          //解锁技术总监
          if(this.websiteCal.userAdd === 500){
            this.unlock(7);
          }
          //解锁策划
          if(this.website.user > 2000){
            this.unlock(8);
          }
          //解锁人力
          if(this.numberOfEmployee >= 30){
            this.unlock(9);
          }
          //解锁销售
          if(this.vipRate >= 0.2){
            this.unlock(10);
          }
          //解锁财务
          if(this.cost.salary > 20000){
            this.unlock(11);
          }
          //解锁规划师
          if(this.numberOfEmployee > 200){
            this.unlock(12);
          }
          //解锁大数据分析师
          if(this.serversMaxSize >= 167772160){
            this.unlock(13);
          }
          //解锁测试经理
          if(this.employee[5].list.length >= 10){
            this.unlock(14);
          }
          //员工心情
          let workHoursBonus = this.getEffectBonus("workHoursToMood", 0, "+");
          let weekendWorkBonus = this.getEffectBonus("weekendWorkToMood", 0, "+");
          this.employee.forEach(p => {
            p.list.forEach(e => {
              if(e.mood !== undefined){
                if(this.isTodayWorkDay){
                  //工作时长因素 多工作一小时 心情-1 线性
                  e.mood += 8 - this.company.manage.workHours + workHoursBonus;
                  //环境因素
                  // environmentLevel      1      2     3     4    5
                  //  moodChangeRange  -4~-2  -3~-1  -2~0  -1~1  0~2
                  e.mood += Math.random() * 2 + this.environmentLevel - 5;
                  if(this.day % 7 === 6 || this.day % 7 === 0){
                    //工作日因素 周末上班-20
                    e.mood += -20 + weekendWorkBonus;
                  }
                }
                //校准
                e.mood = range(e.mood, 0, 100);
              }
            });
          });
          //员工辞职
          this.employee.forEach(p => {
            p.list.forEach((e, index) => {
              // mood  [0,20,100]
              // rate  [1, 0,  0] 二段线性
              if(e.mood !== undefined && e.mood < 20){
                if(Math.random() < 1 - e.mood / 20){
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
          });
          this.filterNullEmployee();
          //人力发offer
          this.employee[9].list.forEach(hr => {
            if(this.numberOfEmployee + this.numberOfOffer < this.company.building.size){
              let seekerPool = [];
              this.employee.forEach((p, pIndex) => {
                p.seekers.forEach((s, sIndex) => {
                  if(this.company.manage.hr.indexOf(pIndex) > -1 && !s.isOffer){
                    seekerPool.push({
                      pIndex,
                      sIndex,
                      ability: s.ability,
                      expectSalary: s.expectSalary,
                      quality: s.ability / (s.expectSalary / p.averageSalary)
                    });
                  }
                });
              });
              seekerPool = seekerPool.filter(s => s.ability <= hr.ability * hr.mood / 80);
              seekerPool.sort((a, b) => b.quality - a.quality);
              if(seekerPool.length > 0){
                this.employee[seekerPool[0].pIndex].seekers[seekerPool[0].sIndex].isOffer = true;
              }
            }
          });
          //规划师开除员工
          if(this.company.manage.eliminate){
            this.employee[12].list.forEach(pl => {
              let employeePool = [];
              this.employee.forEach((p, pIndex) => {
                p.list.forEach((s, sIndex) => {
                  if(pIndex !== 0 && pIndex !== 12 && this.day >= s.canFireDay){
                    employeePool.push({
                      pIndex,
                      sIndex,
                      ability: s.ability,
                      salary: s.salary,
                      quality: s.ability / (s.salary / p.averageSalary)
                    });
                  }
                });
              });
              employeePool = employeePool.filter(s => s.ability <= pl.ability * pl.mood / 80);
              employeePool.sort((a, b) => a.quality - b.quality);
              if(employeePool.length > 0){
                this.fire(employeePool[0].sIndex, employeePool[0].pIndex);
              }
            });
          }
          //处理offer
          let fireDayBonus = this.getEffectBonus("fireDay", 0, "+");
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
                    mood: range(60 * s.offerSalary / s.expectSalary, null, 100),
                    salary: s.offerSalary,
                    canFireDay: this.day + 1 + 30 + fireDayBonus,
                  });
                  this.newEmployee.push({
                    position: p.name,
                    name: s.name,
                    gender: s.gender,
                    age: s.age,
                  });
                  this.statistics.totalEmployeeNumber++;
                }
              }
            });
          });

          //恢复能量
          this.personal.energy = range(this.personal.energy + this.energyHeal, 0, this.maxEnergy);

          //妹子主动发消息
          this.personal.contact.forEach((c, index) => {
            let rate = 0.01 * c.emotion - 0.5;
            if(Math.random() < rate){
              this.getMessage({type: "h", text: getRandom(this.chatWords[8])}, index);
            }
          });

          //刷新求职者
          this.refreshSeekers();
          //刷新相亲广场
          this.refreshGirls();

          this.day++;
          //过年
          if(this.day % 365 === 0){
            this.employee.forEach(p => {
              p.list.forEach(e => {
                e.age++;
              });
            });
            this.personal.contact.forEach(c => {
              c.girl.age++;
            });
          }

          //自动保存
          this.autoSave();

          if(showDialog){
            this.dialogController = "next";
          }
        }
      },
      newDay(){
        this.newEmployee = [];
        this.quitEmployee = [];
        this.fireEmployee = [];
        this.winLottery = [];
        this.dialogController = "";
      },
      clickMask(e){
        //过滤mask的后代元素，这样事件不用写.stop
        if(e.target.classList.contains("mask")){
          if(this.dialogController === "next"){
            this.newDay();
          } else if(this.dialogController === "offer"){
            this.dialogController = "";
          } else if(this.dialogController === "stockChart"){
            this.dialogController = "";
          } else if(this.dialogController === "girlInfo"){
            this.dialogController = "";
          } else if(this.dialogController === "changeNickName"){
            this.dialogController = "";
          } else if(this.dialogController === "deleteGirl"){
            this.dialogController = "";
          }
        }
      },
      getTotalEmployeeEfficiency(index){
        return this.employeeEfficiency[index].reduce(getSum, 0) / 8 * this.company.manage.workHours
      },
      getEffectBonus(effectName, initValue = 0, method = "+"){
        let v = initValue;
        //能力
        this.personal.skill.forEach(i => {
          let skill = this.allSkills[i];
          if(skill.effect && skill.effect[effectName]){
            switch (method) {
              case "+":
                v += skill.effect[effectName];
                break;
              case "*":
                v *= skill.effect[effectName];
                break;
            }
          }
        });
        //组合技
        this.combinedSkill.forEach(i => {
          let cskill = this.allCombinedSkills[i];
          if(cskill.effect && cskill.effect[effectName]){
            switch (method) {
              case "+":
                v += cskill.effect[effectName];
                break;
              case "*":
                v *= cskill.effect[effectName];
                break;
            }
          }
        });
        //诅咒
        this.personal.curse.forEach(i => {
          let curse = this.allCurses[i];
          if(curse.effect && curse.effect[effectName]){
            switch (method) {
              case "+":
                v += curse.effect[effectName];
                break;
              case "*":
                v *= curse.effect[effectName];
                break;
            }
          }
        });
        return v;
      },
      newSkill(pay = true){
        let arr = this.allSkills.map((n, i) => i).filter(i => this.personal.skill.indexOf(i) === -1);
        let newIndex = arr[Math.floor(Math.random() * arr.length)];
        if(pay){
          this.money -= this.newSkillPrice;
        }
        this.personal.skill.push(newIndex);
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
      toggleShowFull(index){
        this.employee[index].showFull = !this.employee[index].showFull;
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
        let minAbilityBonus = this.getEffectBonus("minAbility", 0, "+");
        let expectSalaryBonus = this.getEffectBonus("expectSalary", 0, "+");
        this.employee.forEach((p, index) => {
          if(p.unlock && index !== 0){
            p.seekers = [];
            for(let i = 0; i < this.seekerNumber; i++){
              let s = {...getRandomSeeker(p.gender, 10 + minAbilityBonus, p.averageSalary + expectSalaryBonus)};
              s.isOffer = false;
              s.offerSalary = s.expectSalary;
              p.seekers.push(s);
            }
          }
        });
      },
      refreshGirls(){
        let num = this.getEffectBonus("girlNumber", 7, "+");
        this.personal.girls = [];
        for(let i = 0; i < num; i++){
          this.personal.girls.push(getRandomGirl());
        }
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
      buyGoods(index){
        switch (index) {
          case 0: //色欲 恢复所有能量 500000
            this.money -= 500000;
            this.personal.energy = this.maxEnergy;
            this.notify("能量已恢复");
            break;
          case 1: //暴食 减少一半服务器数据 10个开发
            let arr1 = this.employee[1].list.map((e, eIndex) => ({
              pIndex: 1,
              eIndex
            }));
            shuffleArray(arr1).slice(0, 10).forEach(ps => {
              this.employee[ps.pIndex].list[ps.eIndex] = undefined;
            });
            this.filterNullEmployee();
            this.company.serversSize = Math.round(this.company.serversSize / 2);
            this.notify("服务器数据已减少一半");
            break;
          case 2: //贪婪 获得一个随机能力 50个员工
            let arr2 = [];
            this.employee.forEach((p, pIndex) => {
              if(pIndex !== 0){
                p.list.forEach((e, eIndex) => {
                  arr2.push({
                    pIndex,
                    eIndex
                  });
                });
              }
            });
            shuffleArray(arr2).slice(0, 50).forEach(ps => {
              this.employee[ps.pIndex].list[ps.eIndex] = undefined;
            });
            this.filterNullEmployee();
            this.newSkill(false);
            this.notify("已获得新能力：" + this.allSkills[this.personal.skill[this.personal.skill.length - 1]].name);
            break;
          case 3: //懒惰 连续过30天 10000
            for(let i = 0; i < 30; i++){
              this.next(false);
            }
            this.newDay();
            this.notify("时间已流逝了30天");
            break;
          case 4: //暴怒 重置所有员工的心情 500/人
            this.employee.forEach((p, pIndex) => {
              if(pIndex !== 0){
                p.list.forEach(e => {
                  e.mood = 60;
                });
              }
            });
            this.money -= (this.numberOfEmployee - 1) * 500;
            this.notify("员工心情已重置");
            break;
          case 5: //嫉妒 重置能力与能力的价格 100000000
            this.personal.skill = [];
            this.money -= 100000000;
            this.notify("能力已重置");
            break;
          case 6: //傲慢 献祭所有员工，每个员工提升1%的网站用户数 所有员工
            this.website.user += Math.round(this.website.user * (this.numberOfEmployee - 1) / 100);
            this.employee.forEach((p, pIndex) => {
              if(pIndex !== 0){
                p.list = [];
              }
            });
            this.notify("所有员工已被献祭");
            break;
        }
      },
      buyCar(index){
        this.money -= this.allCars[index].price;
        this.$set(this.personal.car, index, true);
      },
      buyHouse(index){
        this.money -= this.allHouses[index].price;
        this.$set(this.personal.house, index, true);
      },
      generateLottery(){
        let db1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33];
        let db2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
        return [...shuffleArray(db1).slice(0, 6).sort((a, b) => a - b), Math.floor(Math.random() * db2.length) + 1];
      },
      buyLottery(){
        if(this.personal.lotteryRepeat){
          let l = this.generateLottery();
          for(let i = 0; i < this.personal.lotteryNumber; i++){
            this.personal.lottery.push(l);
          }
        } else {
          for(let i = 0; i < this.personal.lotteryNumber; i++){
            this.personal.lottery.push(this.generateLottery());
          }
        }
        this.money -= this.personal.lotteryNumber * 2;
      },
      checkLottery(l){
        let n1 = 0, n2 = 0;
        let s1 = this.yesterdayLottery.slice(0, 6), s2 = this.yesterdayLottery[6];
        for(let i = 0; i < 6; i++){
          if(s1.indexOf(l[i]) > -1) n1++;
        }
        if(s2 === l[6]) n2++;
        let price = 0, desc = "";
        if(n1 === 6 && n2 === 1){
          desc = "一等奖";
          price = 5000000;
        } else if (n1 === 6 && n2 === 0){
          desc = "二等奖";
          price = 60000;
        } else if (n1 === 5 && n2 === 1){
          desc = "三等奖";
          price = 3000;
        } else if ((n1 === 5 && n2 === 0) || (n1 === 4 && n2 === 1)){
          desc = "四等奖";
          price = 200;
        } else if ((n1 === 4 && n2 === 0) || (n1 === 3 && n2 === 1)){
          desc = "五等奖";
          price = 10;
        } else if ((n1 === 2 && n2 === 1) || (n1 === 1 && n2 === 1) || (n1 === 0 && n2 === 1)){
          desc = "六等奖";
          price = 5;
        }
        if(price > 0){
          this.winLottery.push({
            lottery: l,
            desc,
            price
          });
        }
      },
      showChart(index){
        let day = this.getEffectBonus("stockDay", 7, "+");
        let yAxis = this.history.slice(1).map(n => n.stocks[index]);
        yAxis.push(this.personal.stock[index].price);
        let xAxis = yAxis.map((n, index) => index + 1);
        this.dialogController = "stockChart";
        this.$nextTick(() => {
          echarts.init(document.getElementById('stockChart')).setOption({
            color: ["#333"],
            xAxis: {
              name: "天数",
              type: 'category',
              boundaryGap: false,
              data: xAxis.slice(-day)
            },
            yAxis: {
              name: "价格",
              type: 'value',
              min: function(value) {
                return value.min - 2;
              },
              max: function(value) {
                return value.max + 2;
              }
            },
            series: [{
              data: yAxis.slice(-day),
              type: 'line',
              label: {
                show: true
              }
            }]
          });
        });
      },
      buyStock(number, index){
        this.money -= Math.round(this.personal.stock[index].price * number);
        this.personal.stock[index].number += number;
      },
      sellAllStock(index){
        this.money += Math.round(this.personal.stock[index].price * this.personal.stock[index].number);
        this.personal.stock[index].number = 0;
      },
      heartNumberToHtml(number){
        let unit = `<i class="el-icon-star-on"></i>`;
        let html = ``;
        for(let i = 0; i < number; i++){
          html += unit;
        }
        return html
      },
      startChat(index){
        this.personal.girls[index].show = false;
        this.personal.contact.unshift({
          girl: {
            ...this.personal.girls[index],
            nickName: "",
          },
          emotion: 1,
          unread: 0,
          history: [{type: "s", text: `你已添加了${this.personal.girls[index].name}，现在可以开始聊天了。`}]
        });
        this.toChat(0);
      },
      toChat(index){
        this.personal.chatIndex = index;
        this.UIController = "chat";
        this.personal.contact[this.personal.chatIndex].unread = 0;
        this.toChatBottom();
      },
      toChatBottom(){
        this.$nextTick(() => {
          let el = document.getElementsByClassName("chat-content");
          if(el.length > 0){
            el[0].scrollTop = el[0].scrollHeight;
          }
        });
      },
      chatOpe(type){
        let cost = this.chatOpes[type].cost + this.getEffectBonus("energyCost", 0, "+");
        if(this.personal.energy < cost) return;

        this.personal.energy -= cost;
        let contact = this.personal.contact[this.personal.chatIndex];
        let girl = contact.girl;
        let condition = 1000 * girl.condition;
        let emotionCondition = this.chatOpes[type].emotion;
        let isAccept = Math.random() < this.reputation / condition * range(contact.emotion / emotionCondition, 0, 1);
        let delay = Math.ceil(Math.random() * 1000) + 200;
        let youText = getRandom(this.chatWords[type].you);
        let you = {type: "y", text: youText};
        let amount = 0, emotionAdd = 0;
        switch (type) {
          case 0: //闲聊
            break;
          case 1: //红包
            amount = getRandom([88,233,520,666,999,1314]);
            if(this.money >= amount){
              you = {type: "r", amount: amount};
              isAccept = true;
              delay = 250;
              emotionAdd = 1;
            } else {
              isAccept = false;
            }
            break;
          case 2: //吃饭
            amount = getRandom([233,300,500,800,1000,1500]);
            if(this.money >= amount){
              emotionAdd = 3;
            } else {
              isAccept = false;
            }
            break;
          case 3: //电影
            amount = 150;
            if(this.money >= amount){
              emotionAdd = 1;
            } else {
              isAccept = false;
            }
            break;
          case 4: //送礼
            amount = getRandom([88,500,1000,3333,6888,11228]);
            if(this.money >= amount){
              isAccept = true;
              delay = 250;
              emotionAdd = 4;
            } else {
              isAccept = false;
            }
            break;
          case 5: //旅游
            amount = getRandom([5000,10000,15000,20000,30000]);
            if(this.money >= amount){
              emotionAdd = 5;
            } else {
              isAccept = false;
            }
            break;
          case 6: //表白
            emotionAdd = 10;
            break;
          case 7: //求婚
            break;
        }
        let herText = isAccept ? getRandom(this.chatWords[type].accept) : getRandom(this.chatWords[type].refuse);
        let her = {type: "h", text: herText};
        contact.history.push(you);
        this.toChatBottom();
        setTimeout(() => {
          this.getMessage(her, this.personal.chatIndex);
          if(isAccept){
            this.money -= amount;
            contact.emotion = range(contact.emotion + emotionAdd, 0, null);

            if(type === 7){
              //游戏结束
              this.dialogController = "win";
            }
          }
        }, delay);
      },
      getMessage(msg, index){
        this.personal.contact[index].history.push(msg);
        if(this.UIController === "chat" && this.personal.chatIndex === index){
          //如果正在与此人聊天
          this.toChatBottom();
        } else {
          this.personal.contact[index].unread++;
        }
      },
      showInfoDialog(index){
        let emotion = this.personal.contact[index].emotion;
        let girl = this.personal.contact[index].girl;
        this.personal.girlInfo = {
          name: girl.name,
          age: girl.age,
          school: emotion >= 20 ? girl.school : '？',
          appearance: emotion >= 40 ? girl.appearance : '？',
          characterText: emotion >= 60 ? girl.characterText : '？',
          familyText: emotion >= 80 ? girl.familyText : '？'
        };
        this.dialogController = "girlInfo";
      },
      showNickNameDialog(index){
        this.personal.changeNickNameIndex = index;
        this.dialogController = "changeNickName";
      },
      changeNickName(){
        this.dialogController = "";
      },
      showDeleteDialog(index){
        this.personal.deleteIndex = index;
        this.dialogController = "deleteGirl";
      },
      deleteContact(){
        this.personal.contact.splice(this.personal.deleteIndex, 1);
        this.dialogController = "";
      }
    }
  }
</script>
