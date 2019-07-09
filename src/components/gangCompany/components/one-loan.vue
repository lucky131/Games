<template>
  <div class="one-loan">
    <div class="left">
      <div class="bankName">{{item.bankName}}</div>
      <div class="__text-gray">总额：{{$u.formatIntegerNumber(item.amount, config.formatIntegerNumberMode)}}</div>
      <div class="__text-gray">还款：{{$u.formatIntegerNumber(item.step, config.formatIntegerNumberMode)}} * {{item.period}}天</div>
      <div class="__text-orange">利率：{{rate}}%</div>
    </div>
    <div v-if="remainDay === 0" class="btn able" @click="loan()">贷款</div>
    <div v-else class="btn disabled">剩{{remainDay}}天</div>
  </div>
</template>

<style scoped lang="scss">
  @import "../css/common";
  .one-loan{
    width: 100%;
    height: 100px;
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
      .bankName{
        font-weight: bold;
      }
    }
    .btn{
      width: 80px;
      height: 40px;
      line-height: 40px;
      border-radius: 20px;
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
      item: Object,
      config: Object,
      remainDay: Number,
    },
    data(){
      return{

      }
    },
    computed: {
      rate(){
        let rate = (this.item.step * this.item.period - this.item.amount) / this.item.amount;
        return Math.round(rate * 100 * 100) / 100;
      }
    },
    mounted(){

    },
    methods: {
      loan(){
        this.$emit("loan");
      }
    }
  }
</script>
