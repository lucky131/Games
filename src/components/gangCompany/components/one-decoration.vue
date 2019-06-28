<template>
  <div class="one-decoration">
    <div class="left">
      <div class="name">{{text}}</div>
      <div class="__text-green">总价格：{{$u.formatIntegerNumber(size*price, config.formatIntegerNumberMode)}}</div>
    </div>
    <div v-if="alreadyBuy" class="buy-btn disabled"><i class="el-icon-check"></i></div>
    <div v-else-if="money < size * price" class="buy-btn disabled">无法购买</div>
    <div v-else class="buy-btn able" @click="buy()">购买</div>
  </div>
</template>

<style scoped lang="scss">
  .one-decoration{
    width: 100%;
    height: 60px;
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
    name: "one-decoration",
    props: {
      text: String,
      size: Number,
      price: Number,
      money: Number,
      alreadyBuy: Boolean,
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
