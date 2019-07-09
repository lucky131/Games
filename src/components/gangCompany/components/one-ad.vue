<template>
  <div class="one-ad">
    <div class="left">
      <div class="name">广告位：{{item.name}}</div>
      <div class="__text-green">价格：{{$u.formatIntegerNumber(item.price, config.formatIntegerNumberMode)}}/天</div>
    </div>
    <div class="switch-wrapper" :class="isBuy ? 'on' : 'off'" @click="change">
      <div class="switch-btn"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  @import "../css/common";
  .one-ad{
    width: 100%;
    height: 60px;
    padding: 0 20px;
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
    .switch-wrapper{
      width: 60px;
      height: 30px;
      border-radius: 15px;
      padding: 3px;
      position: relative;
      box-sizing: border-box;
      transition: background-color 200ms;
      .switch-btn{
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background-color: white;
        position: absolute;
        transition: left 200ms;
      }
      &.on{
        background-color: $btnBlue;
        .switch-btn{
          left: 33px;
        }
      }
      &.off{
        background-color: #9fc0e2;
        .switch-btn{
          left: 3px;
        }
      }
    }
  }
</style>

<script>
  export default {
    name: "one-ad",
    props: {
      item: Object,
      isBuy: Boolean,
      config: Object,
    },
    data(){
      return{

      }
    },
    computed: {

    },
    mounted(){

    },
    methods: {
      change(){
        this.$emit("change");
      }
    }
  }
</script>
