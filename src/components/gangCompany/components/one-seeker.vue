<template>
  <div class="one-seeker">
    <div class="left">
      <div class="info">
        <i v-if="seeker.gender === 1" class="el-icon-s-custom male"></i>
        <i v-else class="el-icon-s-custom female"></i>
        {{seeker.name}}
        {{seeker.age}}岁</div>
      <div class="row">能力：<span v-html="abilityHtml"></span></div>
      <div class="row">期望日薪：{{seeker.expectSalary}}</div>
    </div>
    <div v-if="seeker.isOffer" class="offer disabled">已发offer</div>
    <div v-else-if="canOffer" class="offer able" @click="sendOffer()">发offer</div>
    <div v-else class="offer disabled">满员</div>
  </div>
</template>

<style scoped lang="scss">
  .one-seeker{
    width: 100%;
    height: 80px;
    padding: 0 20px;
    border-bottom: 1px solid #ccc;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    .left{
      flex: 1 0 0;
      .info{
        font-weight: bold;
        .male{color: #2e7bff}
        .female{color: deeppink}
      }
    }
    .offer{
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
    name: "one-seeker",
    props: {
      seeker: Object,
      canOffer: Boolean,
    },
    data(){
      return{

      }
    },
    computed: {
      abilityHtml(){
        if(this.seeker.ability < 20) return `<span class="__text-red">极差</span>`
        if(this.seeker.ability < 40) return `<span class="__text-orange">稍差</span>`
        if(this.seeker.ability < 60) return `<span class="__text-gray">中等</span>`
        if(this.seeker.ability < 80) return `<span class="__text-blue">优秀</span>`
        return `<span class="__text-green">顶尖</span>`
      },
    },
    mounted(){

    },
    methods: {
      sendOffer(){
        this.$emit("sendOffer");
      }
    }
  }
</script>
