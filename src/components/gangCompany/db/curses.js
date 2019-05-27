export default {
  data(){
    return{
      allCurses: [
        { //0
          img: require("../img/default.png"),
          name: "IT培训机构的阴谋",
          desc: "增加求职者的期望薪资",
          effect: {
            expectSalary: 100
          }
        },
        { //1
          img: require("../img/default.png"),
          name: "智力低下",
          desc: "增加学习新能力的价格",
          effect: {
            skillPrice: 0.25
          }
        },
        { //2
          img: require("../img/default.png"),
          name: "北狄入侵",
          desc: "大幅减少求职者人数",
          effect: {
            seekerNumber: -3
          }
        },
        { //3
          img: require("../img/default.png"),
          name: "劳动者保护法",
          desc: "无法开除员工",
          effect: {
            fireDay: 10086233
          }
        }
      ]
    }
  }
}
