<template>
  <div class="one-stock">
    <div class="row">{{item.name}}</div>
    <div class="row">价格：{{Math.round(item.price * 100) / 100}}<span v-html="diff"></span>/股</div>
    <div class="row">当前拥有：{{item.number}}股</div>
    <div class="btn-row">
      <div v-if="money < item.price * 100" class="btn disabled">买入100股</div>
      <div v-else class="btn able" @click="buy(100)">买入100股</div>
      <div v-if="money < item.price * 1000" class="btn disabled">买入1000股</div>
      <div v-else class="btn able" @click="buy(1000)">买入1000股</div>
      <div v-if="money < item.price * 10000" class="btn disabled">买入10000股</div>
      <div v-else class="btn able" @click="buy(10000)">买入10000股</div>
      <div v-if="item.number === 0" class="btn disabled">全部卖出</div>
      <div v-else class="btn able" @click="sellAll()">全部卖出</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .one-stock{
    width: 100%;
    padding: 10px 20px;
    border-bottom: 1px solid #ccc;
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
        font-size: 12px;
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
  }
</style>

<script>
  export default {
    name: "one-stock",
    props: {
      item: Object,
      money: Number,
      config: Object,
    },
    data(){
      return{

      }
    },
    computed: {
      diff(){
        let diff = this.item.price - this.item.yesterdayPrice;
        if(diff > 0) return `<span class="__text-red"> (+${Math.round(diff * 100) / 100}) </span>`;
        if(diff < 0) return `<span class="__text-green"> (${Math.round(diff * 100) / 100}) </span>`;
        return `<span class="__text-gray"> (-) </span>`;
      }
    },
    mounted(){

    },
    methods: {
      buy(number){
        this.$emit("buy", number);
      },
      sellAll(){
        this.$emit("sellAll");
      }
    }
  }
</script>
