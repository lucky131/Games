<template>
  <div class="one-stock">
    <div class="info-row">
      <div class="left">
        <div class="row">{{item.name}}</div>
        <div class="row">价格：{{item.price}}<span v-html="diff"></span>/股</div>
        <div class="row">当前拥有：{{item.number}}股</div>
      </div>
      <div class="right" @click="showChart()">
        <i class="chart-btn el-icon-data-line"></i>
        <span>上周走势</span>
      </div>
    </div>
    <div class="btn-row">
      <div v-if="money-remain < item.price * 100" class="btn disabled">买入100股</div>
      <div v-else class="btn able" @click="buy(100)">买入100股</div>
      <div v-if="money-remain < item.price * 1000" class="btn disabled">买入1000股</div>
      <div v-else class="btn able" @click="buy(1000)">买入1000股</div>
      <div v-if="money-remain < item.price * 100" class="btn disabled">买入最大</div>
      <div v-else class="btn able" @click="buyMax()">买入最大</div>
      <div v-if="item.number === 0" class="btn disabled">全部卖出</div>
      <div v-else class="btn able" @click="sellAll()">全部卖出</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .one-stock{
    width: 100%;
    padding: 10px 20px;
    border-bottom: 1px solid #e1e1e6;
    .info-row{
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      .left{
        flex: 1 0 0;
        .row{
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
        }
      }
      .right{
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
        .chart-btn{
          font-size: 24px;
          margin-bottom: 5px;
        }
        span{
          font-size: 12px;
        }
      }
    }
    .btn-row{
      display: flex;
      flex-flow: row wrap;
      .btn{
        height: 28px;
        line-height: 28px;
        padding: 0 5px;
        margin-top: 10px;
        margin-left: 10px;
        &:first-child{margin-left: 0}
        border-radius: 10px;
        color: white;
        font-size: 12px;
        &.able{
          background-color: #409EFF;
        }
        &.disabled{
          background-color: #a0cfff;
          cursor: no-drop;
        }
      }
    }
  }
</style>

<script>
  export default {
    name: "one-stock",
    props: {
      item: Object,
      money: Number,
      remain: Number,
      config: Object,
    },
    data(){
      return{

      }
    },
    computed: {
      diff(){
        let diff = this.item.price - this.item.yesterdayPrice;
        if(diff > 0) return `<span class="__text-red">(+${Math.round(diff * 100) / 100})</span>`;
        if(diff < 0) return `<span class="__text-green">(${Math.round(diff * 100) / 100})</span>`;
        return `<span class="__text-gray">(-)</span>`;
      }
    },
    mounted(){

    },
    methods: {
      showChart(){
        this.$emit("showChart");
      },
      buy(number){
        this.$emit("buy", number);
      },
      buyMax(){
        let number = Math.floor((this.money - this.remain) / this.item.price / 100) * 100;
        this.$emit("buy", number);
      },
      sellAll(){
        this.$emit("sellAll");
      }
    }
  }
</script>
