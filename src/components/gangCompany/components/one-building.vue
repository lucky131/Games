<template>
  <div class="one-building">
    <div class="left">
      <div class="row">{{name}}</div>
      <div class="row">容量：{{$u.formatIntegerNumber(size, config.formatIntegerNumberMode)}}人</div>
      <div class="__text-green">房租：{{$u.formatIntegerNumber(rent, config.formatIntegerNumberMode)}}/天</div>
    </div>
    <div v-if="isNow" class="buy-btn disabled"><i class="el-icon-check"></i></div>
    <div v-else class="buy-btn able" @click="buy()">迁址</div>
  </div>
</template>

<style scoped lang="scss">
  .one-building{
    width: 100%;
    height: 80px;
    padding: 0 20px;
    border-bottom: 1px solid #e1e1e6;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    .left{
      flex: 1 0 0;
    }
    .buy-btn{
      width: 80px;
      height: 40px;
      line-height: 40px;
      border-radius: 10px;
      color: white;
      text-align: center;
      &.able{
        background-color: #409EFF;
      }
      &.disabled{
        background-color: #a0cfff;
        cursor: no-drop;
      }
    }
  }
</style>

<script>
  export default {
    name: "one-building",
    props: {
      name: String,
      size: Number,
      rent: Number,
      money: Number,
      isNow: Boolean,
      config: Object,
    },
    data(){
      return{

      }
    },
    mounted(){

    },
    methods: {
      buy(){
        this.$emit("buy");
      }
    }
  }
</script>
