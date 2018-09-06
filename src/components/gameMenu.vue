<template>
  <div id="content">
    <el-tooltip v-for="item in gameList" :key="item.name" effect="dark" :content="item.desc" placement="bottom">
      <el-button type="primary" @click="goto(item.path)">{{item.name}}</el-button>
    </el-tooltip>
  </div>
</template>

<style scoped lang="scss">
  #content {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    justify-content: center;
  }
</style>

<script>
export default {
  name: 'gameMenu',
  data () {
    return {
      gameList: [
        {
          name: "扫雷",
          path: "/minesweeper",
          desc: "经典扫雷，左键打开，右键插旗"
        },
        {
          name: "贪吃蛇",
          path: "/snake",
          desc: "贪吃蛇，WASD或方向键操控"
        },
        {
          name: "填色",
          path: "/color",
          desc: "填色使之成渐变状"
        },
        {
          name: "连连看",
          path: "/link",
          desc: "经典连连看，左键操作，无解需要刷新重来"
        },
        {
          name: "跳一跳",
          path: "/jump",
          desc: "横版跳跃游戏，WASD或方向键操控"
        },
        {
          name: "Picross",
          path: "/picross",
          desc: "经典Picross"
        },
        {
          name: "猜数字",
          path: "/digital",
          desc: "经典猜数字游戏 - Bulls and Cows"
        }
      ]
    }
  },
  created(){
    //禁止右键菜单
    document.oncontextmenu = function(){
      event.returnValue = false;
    };
    //禁止选择文本
    document.onselectstart = function(){
      event.returnValue = false;
    };
  },
  methods: {
    goto(url){
      this.$router.push(url);
    }
  }
}
</script>
