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
              next: 1
            }
          ],
          once: false
        },
        1: {
          id: 1,
          desc: "教程",
          options: [
            {
              text: "点我",
              result: [[5,0,0],[],[]]
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
          result: [[],[],[10]],
        },
        10: {
          id: 10,
          desc: "前方是一座城堡废墟，看起来已经废弃了很久，杂草丛生，丝毫没有人类活动的痕迹，这里曾经是幸运三杠的地盘，不知道发生了什么，变成如此一番景象",
          options: [
            {
              text: "走近看看",
              result: [[0,-5,0],[],[]],
              next: 11
            },
            {
              text: "就此离开",
              result: [[],[],[]]
            }
          ],
          once: true
        },
        11: {
          id: 11,
          desc: "翻开当在路上的石头，前面似乎是主殿的残骸，关于这个幸运三杠，民间流传着很多传说，有的人说他的城堡里藏着很多宝藏",
          options: [
            {
              text: "试着找找看",
              result: [[-5,0,20],[11],[]],
            },
            {
              text: "就此离开",
              result: [[],[],[]]
            }
          ],
          once: true
        },
        333: {
          id: 333,
          desc: "你被雷劈了",
          options: [
            {
              text: "...",
              result: [[1,0,-1],[],[]]
            }
          ]
        },
        10086: {
          id: 10086,
          desc: `
          wrath | 愤怒 | war    | 战争 | 红马 | 大刀
          envy  | 嫉妒 | plague | 瘟疫 | 白马 | 弓和皇冠
          greed | 贪婪 | famine | 饥荒 | 黑马 | 天平
          ???   | ？？ | death  | 死亡 | 灰绿 | 镰刀？
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
