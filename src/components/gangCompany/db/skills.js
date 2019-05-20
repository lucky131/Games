export default {
  data(){
    return{
      allSkills: [
        {
          img: require("../img/default.png"),
          name: "人格魅力",
          desc: "提升offer被接受的概率",
          effect: {
            basicAcceptOfferRate: 0.05
          }
        },
        {
          img: require("../img/default.png"),
          name: "电子元件",
          desc: "提升网站的基本盈利",
          effect: {
            baseProfitBonus: 0.1
          }
        },
        {
          img: require("../img/default.png"),
          name: "土豪入驻",
          desc: "增加vip用户的收入",
          effect: {
            vipProfitBonus: 0.1
          }
        }
      ]
    }
  }
}
