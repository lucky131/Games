<template>
  <div class="darkForest">
    <div class="main">
      <div class="wrapper" :style="{left: -screenWidth*tabIndex+'px'}">
        <div class="screen">鸡</div>
        <div class="screen">你</div>
        <div class="screen">太</div>
        <div class="screen">美</div>
      </div>
    </div>
    <div class="tabs">
      <div v-for="(tab, index) in tabs" :key="index" class="tab" :style="{width: screenWidth/5*(tabIndex === index ? 2 : 1)+'px'}" @click="tabIndex = index">{{tab}}</div>
      <div class="bg" :style="{width: screenWidth/5*2+'px', left: screenWidth/5*tabIndex+'px'}"></div>
      <div class="light-bar"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .darkForest{
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-flow: column nowrap;
    .main{
      width: 100%;
      flex: 1 0 0;
      position: relative;
      .wrapper{
        height: 100%;
        display: flex;
        position: absolute;
        top: 0;
        transition: left 300ms;
        .screen{
          width: 100vw;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 64px;
          &:nth-child(1){background-color: lightblue}
          &:nth-child(2){background-color: lightgoldenrodyellow}
          &:nth-child(3){background-color: lightgreen}
          &:nth-child(4){background-color: lightpink}
        }
      }
    }
    .tabs{
      width: 100%;
      height: 100px;
      display: flex;
      background-color: #2e7bff;
      position: relative;
      .tab{
        height: 100px;
        line-height: 100px;
        text-align: center;
        transition: width 300ms;
        z-index: 1;
      }
      .bg{
        height: 100px;
        background-color: chartreuse;
        position: absolute;
        top: 0;
        transition: left 300ms;
      }
      .light-bar{
        width: 100%;
        height: 6px;
        background-color: rgba(255,255,255,.5);
        position: absolute;
        top: 0;
        left: 0;
        z-index: 2;
      }
    }
  }
</style>

<script>
export default {
  name: 'darkForest',
  data () {
    return {
      screenWidth: 0,
      tabs: ["唱", "跳", "rap", "篮球"],
      tabIndex: 0
    }
  },
  created () {
    this.screenWidth = window.innerWidth
  },
  mounted () {
  },
  methods: {
  }
}
</script>
