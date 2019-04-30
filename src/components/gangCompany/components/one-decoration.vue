<template>
  <div class="one-decoration">
    <div class="text">{{text}} {{$u.formatIntegerNumber(size*price, config.formatIntegerNumberMode)}}</div>
    <div v-if="alreadyBuy" class="buy-btn disabled">已买</div>
    <div v-else-if="money < size * price" class="buy-btn disabled">无法购买</div>
    <div v-else class="buy-btn able" @click="buy()">购买</div>
  </div>
</template>

<style scoped lang="scss">
  .one-decoration{
    width: 100%;
    height: 60px;
    padding: 0 20px;
    border-bottom: 1px solid #ccc;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    .text{
      flex: 1 0 0;
    }
    .buy-btn{
      width: 80px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      &.able{
        background-color: lightgreen;
      }
      &.disabled{
        background-color: #ccc;
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
