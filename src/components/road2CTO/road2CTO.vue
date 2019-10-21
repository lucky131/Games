<template>
  <div class="road2CTO" :style="{width: screenWidth + 'px', height: screenHeight + 'px'}">
    <div v-if="UIController === 'loading'" class="scene loading">
      <div v-if="false" class="preload">
        <img v-for="(img, index) in preloads" :key="index" :src="img">
      </div>
      <div v-if="preloadNumber < preloads.length">加载中 {{preloadNumber}} / {{preloads.length}}</div>
      <div v-else>加载完毕</div>
    </div>
    <div v-else-if="UIController === 'main'" class="scene main">
      <div class="main-top">
        <div class="main-top-wrapper" :style="{left: -screenWidth*tabIndex+'px'}">
          <div class="main-top-screen screen1" :style="{width: screenWidth + 'px'}">
            <div class="center-wrapper">
              <role class="center-role" :direction="player.direction"></role>
              <div class="map" :style="{top: -player.y * 40 + 'px', left: -player.x * 40 + 'px'}">
                <img src="./img/map0.png">
              </div>
            </div>
            <div class="ope-wrapper">
              <div class="ope-move">
                <div class="ope-move-btn ope-move-up" @touchstart="touchstart('up')" @touchend="touchend"><i class="el-icon-arrow-up"></i></div>
                <div class="ope-move-btn ope-move-down" @touchstart="touchstart('down')" @touchend="touchend"><i class="el-icon-arrow-down"></i></div>
                <div class="ope-move-btn ope-move-left" @touchstart="touchstart('left')" @touchend="touchend"><i class="el-icon-arrow-left"></i></div>
                <div class="ope-move-btn ope-move-right" @touchstart="touchstart('right')" @touchend="touchend"><i class="el-icon-arrow-right"></i></div>
              </div>
              <div class="ope-interact"></div>
            </div>
          </div>
          <div class="main-top-screen" :style="{width: screenWidth + 'px'}">2</div>
          <div class="main-top-screen" :style="{width: screenWidth + 'px'}">3</div>
          <div class="main-top-screen" :style="{width: screenWidth + 'px'}">4</div>
        </div>
      </div>
      <div class="tabs">
        <div v-for="(tab, index) in tabs" :key="index" class="tab" @click="tabIndex = index">{{tab}}</div>
        <div class="bg" :style="{width: screenWidth / tabs.length + 'px', left: screenWidth / tabs.length * tabIndex + 'px'}"></div>
        <div class="light-bar"></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .road2CTO{
    /*禁止移动端长按选择*/
    -webkit-touch-callout:none;
    -webkit-user-select:none;
    -khtml-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
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
          width: 100%;
          display: block;
        }
      }
    }
    /*main*/
    .main{
      .main-top{
        width: 100%;
        flex: 1 0 0;
        position: relative;
        .main-top-wrapper{
          height: 100%;
          display: flex;
          position: absolute;
          top: 0;
          transition: left 300ms;
          .main-top-screen{
            height: 100%;
            overflow: hidden;
          }
          .screen1{
            background-color: black;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            .center-wrapper{
              width: 40px;
              height: 40px;
              position: relative;
              .center-role{
                position: absolute;
                z-index: 1;
              }
              .map{
                position: absolute;
                transition: top 300ms linear, left 300ms linear;
              }
            }
            .ope-wrapper{
              width: 100%;
              display: flex;
              justify-content: space-between;
              position: absolute;
              bottom: 0;
              .ope-move{
                width: 120px;
                height: 120px;
                position: relative;
                .ope-move-btn{
                  background-color: rgba(255,255,255,.5);
                  &:active{
                    background-color: rgba(255,255,255,.75);
                  }
                  position: absolute;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                }
                .ope-move-up{
                  width: 60px;
                  height: 30px;
                  top: 0;
                  left: 30px;
                }
                .ope-move-down{
                  width: 60px;
                  height: 30px;
                  bottom: 0;
                  left: 30px;
                }
                .ope-move-left{
                  width: 30px;
                  height: 60px;
                  left: 0;
                  top: 30px;
                }
                .ope-move-right{
                  width: 30px;
                  height: 60px;
                  right: 0;
                  top: 30px;
                }
              }
              .ope-interact{}
            }
          }
          .screen2{}
          .screen3{}
          .screen4{}
        }
      }
      .tabs{
        width: 100%;
        display: flex;
        background-color: #2e7bff;
        position: relative;
        .tab{
          flex: 1 0 0;
          height: 60px;
          line-height: 60px;
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
          height: 5px;
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
  import role from './components/role'
  export default {
    name: 'road2CTO',
    components: {
      role
    },
    data () {
      return {
        screenWidth: 0,
        screenHeight: 0,
        preloads: [
          "https://desk-fd.zol-img.com.cn/t_s4096x2160c5/g4/M0A/0A/0E/ChMly12QiCCIS6DuAAQhxqWjoJQAAX54wDzQJQABCHe297.jpg",
          "https://desk-fd.zol-img.com.cn/t_s4096x2160c5/g4/M0A/0A/0E/ChMlzF2QiDyIVB9DAAK-H5jEcGQAAX54wOpDR0AAr43321.jpg",
          "https://desk-fd.zol-img.com.cn/t_s4096x2160c5/g4/M0B/0A/0E/ChMlzF2QiEGIZCakAALHR09h2BAAAX55AAOX0wAAsdf536.jpg",
          "https://desk-fd.zol-img.com.cn/t_s4096x2160c5/g4/M0B/0A/0E/ChMlzF2QiEaIbQ5cAAesIaPBKPQAAX55ABd5KkAB6w5925.jpg",
          require("./img/role-up.png"),
          require("./img/role-down.png"),
          require("./img/role-left.png"),
          require("./img/role-right.png"),
        ],
        preloadNumber: 0,
        UIController: "loading",
        tabs: ["主界面", "技能", "背包", "设置"],
        tabIndex: 0,
        player: {
          map: "",
          x: 5,
          y: 5,
          direction: "down",
          willDirection: "",
          moving: false,
          touching: false,
        }
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
      //禁止双指缩放
      (function forbidden() {
        document.addEventListener('touchstart', (event) => {
          if (event.touches.length > 1) {
            event.preventDefault()
          }
        }, { passive: false })
      })();
    },
    methods: {
      touchstart(d){
        this.player.touching = true;
        this.player.willDirection = d;
        if(!this.player.moving){
          this.oneStep();
        }
      },
      touchend(){
        this.player.touching = false;
      },
      oneStep(){
        if(this.player.touching){
          this.player.direction = this.player.willDirection;
          //根据direction判断是否可以走
          if(this.player.y === 0 && this.player.direction === "up") return
          switch (this.player.direction){
            case "up":
              this.player.y--;
              break;
            case "down":
              this.player.y++;
              break;
            case "left":
              this.player.x--;
              break;
            case "right":
              this.player.x++;
              break;
          }
          this.player.moving = true;
          setTimeout(() => {
            this.player.moving = false;
            this.oneStep();
          }, 300);
        }
      }
    }
  }
</script>
