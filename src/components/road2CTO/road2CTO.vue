<template>
  <div class="road2CTO" :style="{width: screenWidth + 'px', height: screenHeight + 'px'}">
    <div v-if="UIController === 'loading'" class="scene loading">
      <div v-if="flag" id="preload" class="preload">
        <img src="https://desk-fd.zol-img.com.cn/t_s4096x2160c5/g4/M0A/0A/0E/ChMly12QiCCIS6DuAAQhxqWjoJQAAX54wDzQJQABCHe297.jpg" alt="">
        <img src="https://desk-fd.zol-img.com.cn/t_s4096x2160c5/g4/M0A/0A/0E/ChMlzF2QiDyIVB9DAAK-H5jEcGQAAX54wOpDR0AAr43321.jpg" alt="">
        <img src="https://desk-fd.zol-img.com.cn/t_s4096x2160c5/g4/M0B/0A/0E/ChMlzF2QiEGIZCakAALHR09h2BAAAX55AAOX0wAAsdf536.jpg" alt="">
        <img src="https://desk-fd.zol-img.com.cn/t_s4096x2160c5/g4/M0B/0A/0E/ChMlzF2QiEaIbQ5cAAesIaPBKPQAAX55ABd5KkAB6w5925.jpg" alt="">
      </div>
      <div @click="flag = !flag">{{flag}}</div>
      <div v-if="preloadNumber < preloads.length">{{preloadNumber}} / {{preloads.length}}</div>
      <div v-else>加载完毕</div>
    </div>
    <div v-else-if="UIController === 'main'" class="scene main">
      <div class="game">
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
  </div>
</template>

<style scoped lang="scss">
  .road2CTO{
    .scene{
      width: 100%;
      height: 100%;
      display: flex;
      flex-flow: column nowrap;
      overflow: hidden;
    }
    /*loading*/
    .loading{
      background-color: lightgoldenrodyellow;
      .preload{
        width: 100%;
        img{
          width: 50%;
          display: block;
        }
      }
    }
    /*main*/
    .main{
      .game{
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
  }
</style>

<script>
  export default {
    name: 'road2CTO',
    data () {
      return {
        screenWidth: 0,
        screenHeight: 0,
        preloads: [
          "https://desk-fd.zol-img.com.cn/t_s4096x2160c5/g4/M0A/0A/0E/ChMly12QiCCIS6DuAAQhxqWjoJQAAX54wDzQJQABCHe297.jpg",
          "https://desk-fd.zol-img.com.cn/t_s4096x2160c5/g4/M0A/0A/0E/ChMlzF2QiDyIVB9DAAK-H5jEcGQAAX54wOpDR0AAr43321.jpg",
          "https://desk-fd.zol-img.com.cn/t_s4096x2160c5/g4/M0B/0A/0E/ChMlzF2QiEGIZCakAALHR09h2BAAAX55AAOX0wAAsdf536.jpg",
          "https://desk-fd.zol-img.com.cn/t_s4096x2160c5/g4/M0B/0A/0E/ChMlzF2QiEaIbQ5cAAesIaPBKPQAAX55ABd5KkAB6w5925.jpg"
        ],
        preloadNumber: 0,
        UIController: "loading",
        tabs: ["唱", "跳", "rap", "篮球"],
        tabIndex: 0,
        flag: false
      }
    },
    created () {
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;

      let promiseAll = [], imgs = [];
      for (let index in this.preloads) {
        promiseAll[index] = new Promise((res, rej) => {
          imgs[index] = new Image();
          imgs[index].src = this.preloads[index]
          imgs[index].onload = () => {
            this.preloadNumber++;
            res()
          }
        });
      }
      Promise.all(promiseAll).then(() => {
        setTimeout(() => {
          this.UIController = "main";
        }, 1000)
      })
    },
    mounted () {
    },
    methods: {
    }
  }
</script>
