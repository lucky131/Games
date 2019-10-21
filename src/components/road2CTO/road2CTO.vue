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
        <div class="main-top-wrapper" :style="{left: -screenWidth * tabIndex + 'px'}">
          <div class="main-top-screen screen1" :style="{width: screenWidth + 'px'}">
            <div class="center-wrapper">
              <role class="center-role" :direction="player.direction"></role>
              <div class="map" :style="{top: -player.x * 40 + 'px', left: -player.y * 40 + 'px'}">
                <div class="cell-row" v-for="(row, index1) in allMaps[player.map]" :key="index1">
                  <img class="cell" v-for="(cell, index2) in row" :key="index2" :src="require(`./img/cell/${cell}.png`)">
                </div>
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
  *{
    box-sizing: border-box;
  }
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
                .cell-row{
                  display: flex;
                  .cell{
                    width: 40px;
                    height: 40px;
                  }
                }
              }
            }
            .ope-wrapper{
              width: 100%;
              padding: 10px 20px;
              display: flex;
              justify-content: space-between;
              position: absolute;
              bottom: 0;
              .ope-move{
                width: 150px;
                height: 150px;
                position: relative;
                .ope-move-btn{
                  width: 60px;
                  height: 60px;
                  background-color: #aeaeae;
                  &:active{
                    background-color: #dbdbdb;
                  }
                  border-radius: 50%;
                  border: 2px solid black;
                  font-size: 32px;
                  position: absolute;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                }
                .ope-move-up{
                  top: 0;
                  left: 45px;
                }
                .ope-move-down{
                  bottom: 0;
                  left: 45px;
                }
                .ope-move-left{
                  left: 0;
                  top: 45px;
                }
                .ope-move-right{
                  right: 0;
                  top: 45px;
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
  import role from "./components/role"

  import cells from "./db/cells"
  import maps from "./db/maps"

  export default {
    name: 'road2CTO',
    components: {
      role
    },
    mixins: [cells, maps],
    data () {
      return {
        screenWidth: 0,
        screenHeight: 0,
        preloads: [
          require("./img/role-up.png"),
          require("./img/role-down.png"),
          require("./img/role-left.png"),
          require("./img/role-right.png"),
          require("./img/map0.png")
        ],
        preloadNumber: 0,
        UIController: "loading",
        tabs: ["主界面", "技能", "背包", "设置"],
        tabIndex: 0,
        player: {
          map: "test",
          x: 0,
          y: 0,
          direction: "down",
          willDirection: "",
          moving: false,
          touching: false,
        }
      }
    },
    computed: {
      nowMap(){
        return this.allMaps[this.player.map];
      }
    },
    created () {
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;

      //预加载
      this.addPreload("cell", "floor", 0);
      this.addPreload("cell", "wall", 15);
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
      addPreload(type, name, maxIndex){
        for(let i = 0; i <= maxIndex; i++){
          this.preloads.push(require(`./img/${type}/${name}${i}.png`));
        }
      },
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
          if(this.player.direction === "up" && !this.allCells[this.nowMap[this.player.x - 1][this.player.y]].canMove) return
          if(this.player.direction === "down" && !this.allCells[this.nowMap[this.player.x + 1][this.player.y]].canMove) return
          if(this.player.direction === "left" && !this.allCells[this.nowMap[this.player.x][this.player.y - 1]].canMove) return
          if(this.player.direction === "right" && !this.allCells[this.nowMap[this.player.x][this.player.y + 1]].canMove) return

          switch (this.player.direction){
            case "up":
              this.player.x--;
              break;
            case "down":
              this.player.x++;
              break;
            case "left":
              this.player.y--;
              break;
            case "right":
              this.player.y++;
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
