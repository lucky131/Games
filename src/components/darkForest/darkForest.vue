<template>
  <div class="darkForest">
    <div class="game"></div>
    <div class="tabs">
      <div class="tab" :style="{width: screenWidth/5*[2,1,1,1][tabIndex]+'px'}" @click="tabIndex = 0">1</div>
      <div class="tab" :style="{width: screenWidth/5*[1,2,1,1][tabIndex]+'px'}" @click="tabIndex = 1">2</div>
      <div class="tab" :style="{width: screenWidth/5*[1,1,2,1][tabIndex]+'px'}" @click="tabIndex = 2">3</div>
      <div class="tab" :style="{width: screenWidth/5*[1,1,1,2][tabIndex]+'px'}" @click="tabIndex = 3">4</div>
      <div class="bg" :style="{width: screenWidth/5*2+'px', left: screenWidth/5*tabIndex+'px'}"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .darkForest{
    width: 100vw;
    height: 100vh;
    background-color: black;
    display: flex;
    flex-flow: column nowrap;
    .game{
      width: 100%;
      flex: 1 0 0;
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
    }
  }
</style>

<script>
export default {
  name: 'darkForest',
  data () {
    return {
      screenWidth: 0,
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
