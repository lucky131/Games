<template>
  <div class="wrap">
    <div class="block">
      <div class="title">玩家</div>
      <div class="playerBtns"></div>
      <div class="playerPreview"></div>
      <div class="stat"></div>
      <el-button type="primary">下一步</el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .wrap{
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 10px;
    display: flex;
    flex-flow: column nowrap;
    align-content: center;
    .block{
      width: 100%;
      padding-bottom: 20px;
      border-bottom: 1px solid #ccc;
      .title{
        width: 100%;
        height: 60px;
        line-height: 60px;
        margin: 10px 0;
        font-size: 30px;
        font-weight: bold;
      }
    }
  }
</style>

<script>
  export default {
    name: "wolf",
    data(){
      return{

      }
    },
    mounted(){

    },
    methods: {

    }
  }
</script>
