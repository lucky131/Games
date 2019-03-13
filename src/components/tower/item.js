export default {
  data(){
    return{
      allItems: {
        10: {
          id: 10,
          name: "启示录",
          desc: "这是一本正经的书",
          img: require("./img/default.png"),
        },
        11: {
          id: 11,
          name: "宝玉",
          desc: "从巨龙嘴中获得的宝玉，散发着五彩斑斓的黑色",
          img: require("./img/default.png"),
        },
        12: {
          id: 12,
          name: "大刀",
          desc: "用龙玉锻造的黑色长刀，散发着五彩斑斓的黑色，拥有极强的威力",
          img: require("./img/default.png"),
        },
        404: {
          id: 404,
          name: "乌金长杵",
          desc: "从幸运三杠城堡残骸中找到的神秘物体，不知道是干什么用的，还一直在发热",
          img: require("./img/default.png"),
        },
        405: {
          id: 405,
          name: "墨绿长杵",
          desc: "",
          img: require("./img/default.png"),
        }
      }
    }
  }
}
