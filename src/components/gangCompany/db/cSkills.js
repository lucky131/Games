export default {
  data(){
    return{
      allCombinedSkills: [
        { //0
          img: require("../img/c00.png"),
          condition: [6,7,8],
          name: "工作机器",
          desc: "员工每天可接受的工作时间增加1小时",
          effect: {
            workHoursToMood: 1
          }
        },
        { //1
          img: require("../img/c01.png"),
          condition: [9,10,11],
          name: "杀戮狂魔",
          desc: "员工周末加班时心情不再下降",
          effect: {
            weekendWorkToMood: 5
          }
        },
        { //2
          img: require("../img/default.png"),
          condition: [22,23],
          name: "祖国的花朵",
          desc: "提高国民的智力水平",
          effect: {
            minAbility: 10
          }
        },
        { //3
          img: require("../img/default.png"),
          condition: [5,21],
          name: "网管的假发",
          desc: "网管的手办、网管出身效果翻倍",
          effect: {
            netCost: -0.25,
            speed: 0.15,
            serversSizePerUser: -0.2
          }
        },
        { //4
          img: require("../img/default.png"),
          condition: [4,24,25],
          name: "看门狗",
          desc: "吸收一大波育碧粉丝，提升网站的基本盈利和会员氪金，但会增加网站的bug率",
          effect: {
            baseProfit: 0.2,
            vipProfit: 0.2,
            bugRate: 0.1
          }
        },
        { //5
          img: require("../img/default.png"),
          condition: [3,15,20],
          name: "万人迷",
          desc: "大幅改善公司环境，美化网站的用户界面",
          effect: {
            environment: 10,
            ui: 0.5
          }
        },
        { //6
          img: require("../img/default.png"),
          condition: [29,30,31],
          name: "喷气背包",
          desc: "能量消耗-1",
          effect: {
            energyCost: -1
          }
        },
      ]
    }
  }
}
