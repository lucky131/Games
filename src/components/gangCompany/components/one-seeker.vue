<template>
  <div class="one-seeker">
    <div class="left">
      <div class="info">
        <i v-if="seeker.gender === 1" class="el-icon-s-custom male"></i>
        <i v-else class="el-icon-s-custom female"></i>
        {{seeker.name}}
        {{seeker.age}}岁
      </div>
      <div v-if="showAbility < 0" class="row">能力：？</div>
      <div v-else-if="showAbility === 0" class="row">能力：<span v-html="abilityHtml"></span></div>
      <div v-else class="row">能力：<span v-html="abilityHtml"></span><span>({{Math.round(seeker.ability)}})</span></div>
      <div class="row">期望日薪：{{$u.formatIntegerNumber(seeker.expectSalary, config.formatIntegerNumberMode)}}</div>
    </div>
    <div v-if="seeker.isOffer" class="offer disabled">已发offer</div>
    <div v-else-if="canOffer" class="offer able" @click="sendOffer()">发offer</div>
    <div v-else class="offer disabled">满员</div>
  </div>
</template>

<style scoped lang="scss">
  @import "../css/common";
  .one-seeker{
    width: 100%;
    height: 80px;
    padding: 0 20px;
    border-bottom: 1px solid $border;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    .left{
      flex: 1 0 0;
      .info{
        font-weight: bold;
      }
    }
    .offer{
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
    name: "one-seeker",
    props: {
      seeker: Object,
      canOffer: Boolean,
      config: Object,
      showAbility: Number,
    },
    data(){
      return{

      }
    },
    computed: {
      abilityHtml(){
        if(this.seeker.ability < 20) return `<span class="__text-red">辣鸡</span>`;
        if(this.seeker.ability < 40) return `<span class="__text-orange">丢人</span>`;
        if(this.seeker.ability < 60) return `<span class="__text-gray">凑活</span>`;
        if(this.seeker.ability < 80) return `<span class="__text-blue">牛逼</span>`;
        return `<span class="__text-green">大神</span>`;
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
