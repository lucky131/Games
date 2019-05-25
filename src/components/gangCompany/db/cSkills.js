export default {
  data(){
    return{
      allCombinedSkills: [
        { //0
          img: require("../img/default.png"),
          condition: [6,7,8],
          name: "工作机器",
          desc: "员工每天可接受的工作时间增加1小时",
          effect: {
            workHoursToMood: 1
          }
        },
      ]
    }
  }
}
