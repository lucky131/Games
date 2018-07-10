<template>
  <div>
    <el-button type="primary" v-for="item in gameList" :key="item.name" @click="goto(item.path)">{{item.name}}</el-button>
  </div>
</template>

<style scoped lang="scss">

</style>

<script>
export default {
  name: 'gameMenu',
  data () {
    return {
      gameList: [
        {
          name: "扫雷",
          path: "/minesweeper"
        },
        {
          name: "贪吃蛇",
          path: "/snake"
        },
        {
          name: "填色",
          path: "/color"
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
