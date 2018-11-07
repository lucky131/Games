export default {
  data(){
    return{
      allEvents: {
        0: {
          id: 0,
          desc: "初始文案",
          options: [
            {
              text: "...",
              nextEvent: 1
            }
          ],
          once: false,
        },
        1: {
          id: 1,
          desc: "教程",
          options: [
            {
              text: "点我",
              result: [[5,0,0],[],[]],
            },
            {
              text: "点我吧",
              result: [[0,5,0],[],[]]
            },
            {
              text: "别信前面的",
              result: [[0,0,5],[],[]]
            }
          ],
          result: [[],[],[]],
        },
        10086: {
          id: 10086,
          desc: `
          wrath 愤怒 war    战争 红马 大刀
          envy  嫉妒 plague 瘟疫 白马 弓和皇冠
          greed 贪婪 famine 饥荒 黑马 天平
          ???   ？？ death  死亡 灰绿 镰刀？
          `,
          condition: [[10,20,30],[1,233]],
          options: [
            {
              text: "这次是你赢了！",
              result: [[0,0,0],[],[]],
              eval: ""
            }
          ],
          result: [[0,0,0],[],[]],
          eval: "",
          once: true,
        }
      }
    }
  }
}
