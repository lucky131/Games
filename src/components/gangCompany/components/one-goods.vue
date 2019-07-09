<template>
  <div class="one-goods">
    <div class="left">
      <div class="name">{{name}}</div>
      <div class="__text-gray">{{desc}}</div>
      <div class="__text-green">价格：{{priceCal}}</div>
    </div>
    <div v-if="canBuy" class="btn able" @click="buy()">购买</div>
    <div v-else class="btn disabled">无法购买</div>
  </div>
</template>

<style scoped lang="scss">
  @import "../css/common";
  .one-goods{
    width: 100%;
    padding: 10px 20px;
    border-bottom: 1px solid $border;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    .left{
      flex: 1 0 0;
      height: 100%;
      display: flex;
      flex-flow: column nowrap;
      justify-content: center;
      .name{
        font-weight: bold;
      }
    }
    .btn{
      width: 80px;
      height: 40px;
      line-height: 40px;
      border-radius: 20px;
      margin-left: 10px;
      color: white;
      text-align: center;
      &.able{
        background-color: $btnBlue;
      }
      &.disabled{
        background-color: $btnBlueDisabled;
        cursor: no-drop;
      }
    }
  }
</style>

<script>
  export default {
    name: "one-loan",
    props: {
      name: String,
      desc: String,
      price: [String, Number],
      canBuy: Boolean,
      config: Object
    },
    data(){
      return{

      }
    },
    computed: {
      priceCal(){
        if(typeof this.price === "number"){
          return this.$u.formatIntegerNumber(this.price, this.config.formatIntegerNumberMode);
        } else return this.price;
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
