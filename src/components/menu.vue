<template>
  <div>
    <el-button type="primary">122</el-button>
    <div v-for="item in aaa" :key="item">{{item}}</div>
  </div>
</template>

<style scoped lang="scss">
  .a1{
    color: red;
    .a2{
      color: blue;
      font-size: 50px;
    }
  }
</style>

<script>
export default {
  name: 'menu',
  data () {
    return {
      aaa: [1,2,3]
    }
  }
}
</script>
