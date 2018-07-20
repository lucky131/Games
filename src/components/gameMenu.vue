<template>
  <div id="content">
    <div>
      <el-tooltip v-for="item in gameList" :key="item.name" effect="dark" :content="item.desc" placement="bottom">
        <el-button type="primary" @click="goto(item.path)">{{item.name}}</el-button>
      </el-tooltip>
    </div>
  </div>
</template>

<style scoped lang="scss">
  #content {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-flow: row nowrap;
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
        }
      ]
    }
  },
  methods: {
    goto(url){
      this.$router.push(url);
    }
  }
}
</script>
