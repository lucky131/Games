<template>
  <div class="one-car-house">
    <div class="left">
      <div class="row">{{item.name}}</div>
      <div class="row">价格：{{$u.formatIntegerNumber(item.price, config.formatIntegerNumberMode)}}</div>
    </div>
    <div v-if="isBuy" class="buy-btn disabled"><i class="el-icon-check"></i></div>
    <div v-else-if="money < item.price" class="buy-btn disabled">无法购买</div>
    <div v-else class="buy-btn able" @click="buy()">购买</div>
  </div>
</template>

<style scoped lang="scss">
  .one-car-house{
    width: 100%;
    height: 60px;
    padding: 0 20px;
    border-bottom: 1px solid #ccc;
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
      text-align: center;
      &.able{
        color: white;
        background-color: #31c21f;
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
    name: "one-car-house",
    props: {
      isBuy: Boolean,
      item: Object,
      money: Number,
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
