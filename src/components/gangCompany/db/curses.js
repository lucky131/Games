export default {
  data(){
    return{
      allCurses: [
        { //0
          img: require("../img/c00.png"),
          name: "IT培训机构的阴谋",
          desc: "增加求职者的期望薪资",
          effect: {
            expectSalary: 100
          }
        },
        { //1
          img: require("../img/c01.png"),
          name: "智力低下",
          desc: "增加学习新能力的价格",
          effect: {
            skillPrice: 0.25
          }
        },
        { //2
          img: require("../img/c02.png"),
          name: "北狄入侵",
          desc: "大幅减少求职者人数",
          effect: {
            seekerNumber: -3
          }
        },
        { //3
          img: require("../img/c03.png"),
          name: "劳动者保护法",
          desc: "无法开除员工",
          effect: {
            fireDay: 10086233
          }
        },
        { //4
          img: require("../img/c04.png"),
          name: "钢铁直男死肥宅",
          desc: "能量最大值+1，每日恢复能量-1，能量消耗+1",
          effect: {
            maxEnergy: 1,
            energyHeal: -1,
            energyCost: 1
          }
        },
        { //5
          img: require("../img/default.png"),
          name: "数据危机",
          desc: "用户每天产生的数据量翻倍",
          effect: {
            serversSizePerUser: 1
          }
        },
        { //6
          img: require("../img/default.png"),
          name: "混沌时代",
          desc: "网站bug率固定为10%，且无法改变",
          effect: {
            fixedBugRate: 1
          }
        },
        { //7
          img: require("../img/default.png"),
          name: "捕鱼达人",
          desc: "员工每天可接受的工作时间仅为6小时",
          effect: {
            workHoursToMood: -2
          }
        },
        { //8
          img: require("../img/default.png"),
          name: "当局者迷",
          desc: "无法查看求职者与员工的能力水平",
          effect: {
            showAbility: -10
          }
        },
        { //9
          img: require("../img/default.png"),
          name: "当局者迷",
          desc: "减少每天刷新的相亲妹子数",
          effect: {
            girlNumber: -3
          }
        }
      ]
    }
  }
}
