export default {
  data(){
    return{
      allSkills: [
        {
          img: require("../img/default.png"),
          name: "人格魅力",
          desc: "提升offer被接受的概率",
          effect: {
            basicAcceptOfferRate: 0.1
          }
        },
        {
          img: require("../img/default.png"),
          name: "电子元件",
          desc: "提升网站的基本盈利",
          effect: {
            baseProfit: 0.1
          }
        },
        {
          img: require("../img/default.png"),
          name: "土豪入驻",
          desc: "提升网站的会员氪金",
          effect: {
            vipProfit: 0.1
          }
        },
        {
          img: require("../img/default.png"),
          name: "包租婆的口红",
          desc: "降低租金",
          effect: {
            rentCost: -0.1
          }
        },
        {
          img: require("../img/default.png"),
          name: "艾登的手套",
          desc: "降低电费",
          effect: {
            electricityCost: -0.1
          }
        },
        {
          img: require("../img/default.png"),
          name: "网管的电笔",
          desc: "降低网费",
          effect: {
            netCost: -0.1
          }
        },
        {
          img: require("../img/default.png"),
          name: "不存在的餐补",
          desc: "员工每天可接受的工作时间增加1小时",
          effect: {
            workHoursToMood: 1
          }
        },
        {
          img: require("../img/default.png"),
          name: "资本家的剥削",
          desc: "员工每天可接受的工作时间增加1小时",
          effect: {
            workHoursToMood: 1
          }
        },
        {
          img: require("../img/default.png"),
          name: "东哥的兄弟",
          desc: "员工每天可接受的工作时间增加1小时",
          effect: {
            workHoursToMood: 1
          }
        },
        {
          img: require("../img/default.png"),
          name: "福报",
          desc: "减少员工周末加班时心情下降的值",
          effect: {
            weekendWorkToMood: 5
          }
        },
        {
          img: require("../img/default.png"),
          name: "ICU",
          desc: "减少员工周末加班时心情下降的值",
          effect: {
            weekendWorkToMood: 5
          }
        },
        {
          img: require("../img/default.png"),
          name: "奋斗",
          desc: "减少员工周末加班时心情下降的值",
          effect: {
            weekendWorkToMood: 5
          }
        },
        {
          img: require("../img/default.png"),
          name: "价值观不合警告",
          desc: "新员工现在可以随时开除",
          effect: {
            fireDay: -30
          }
        },
        {
          img: require("../img/default.png"),
          name: "互联网寒冬",
          desc: "降低求职者的期望薪资，减少求职者人数，降低offer被接受的概率",
          effect: {
            expectSalary: -50,
            seekerNumber: -1,
            basicAcceptOfferRate: -0.05
          }
        },
        {
          img: require("../img/default.png"),
          name: "虚假宣传",
          desc: "增加公司知名度，增加求职者人数",
          effect: {
            seekerNumber: 1,
            popularity: 0.1
          }
        },
        {
          img: require("../img/default.png"),
          name: "洁癖",
          desc: "略微改善公司环境",
          effect: {
            environment: 5
          }
        },
        {
          img: require("../img/default.png"),
          name: "表结构优化",
          desc: "减少用户每天产生的数据量",
          effect: {
            serversSizePerUser: -0.2
          }
        },
        {
          img: require("../img/default.png"),
          name: "投资鬼才",
          desc: "降低学习新能力的价格",
          effect: {
            skillPrice: -0.2
          }
        },
      ]
    }
  }
}
