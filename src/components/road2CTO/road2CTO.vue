<template>
  <div class="road2CTO" :style="{width: screenWidth + 'px', height: screenHeight + 'px'}">
    <div v-show="isMaskShow" class="mask"></div>
    <div v-if="sceneController === 'loading'" class="scene loading">
      <div class="progress-wrapper">
        <div class="progress-bar" :style="{width: preloadNumber / preloads.length * 100 + '%', filter: `hue-rotate(${preloadNumber / preloads.length * 100}deg)`}"></div>
      </div>
      <div v-if="preloadNumber < preloads.length">加载中 {{preloadNumber}} / {{preloads.length}}</div>
      <div v-else>加载完毕</div>
    </div>
    <div v-else-if="sceneController === 'menu'" class="scene menu">
      <save save-name="存档一" :save-data="saves[0]" @newSave="newSave(0)" @startGame="startGame(0)" @deleteSave="deleteSave(0)"></save>
      <save save-name="存档二" :save-data="saves[1]" @newSave="newSave(1)" @startGame="startGame(1)" @deleteSave="deleteSave(1)"></save>
      <save save-name="存档三" :save-data="saves[2]" @newSave="newSave(2)" @startGame="startGame(2)" @deleteSave="deleteSave(2)"></save>
    </div>
    <div v-else-if="sceneController === 'new'" class="scene new">
      <div class="title">新建角色</div>
      <div class="name-row">
        <div class="left-wrapper">
          <role :role="tempPlayer"></role>
        </div>
        <input class="right" type="text" v-model="tempPlayer.name" maxlength="10" placeholder="请输入名字">
        <div v-if="tempPlayer.name.indexOf('三杠') > -1" class="tips">名字里不能带有三杠！</div>
      </div>
      <div class="outlook-wrapper">
        <div class="head">发型{{tempPlayer.hair.index + 1}}
          <i v-show="tempPlayer.hair.index > 0" class="el-icon-caret-left left-arrow" @click="tempPlayer.hair.index--"></i>
          <i v-show="tempPlayer.hair.index < hairNumber - 1" class="el-icon-caret-right right-arrow" @click="tempPlayer.hair.index++"></i>
        </div>
        <div class="row">
          <div class="left">色调</div>
          <div class="right">
            <el-slider v-model="tempPlayer.hair.hue" :show-tooltip="false" :min="0" :max="360"></el-slider>
          </div>
        </div>
        <div class="row">
          <div class="left">亮度</div>
          <div class="right">
            <el-slider v-model="tempPlayer.hair.brightness" :show-tooltip="false" :min="0" :max="3" :step="0.01"></el-slider>
          </div>
        </div>
      </div>
      <div class="outlook-wrapper">
        <div class="head">皮肤{{tempPlayer.skin.index + 1}}
          <i v-show="tempPlayer.skin.index > 0" class="el-icon-caret-left left-arrow" @click="tempPlayer.skin.index--"></i>
          <i v-show="tempPlayer.skin.index < skinNumber - 1" class="el-icon-caret-right right-arrow" @click="tempPlayer.skin.index++"></i>
        </div>
        <div class="row">
          <div class="left">色调</div>
          <div class="right">
            <el-slider v-model="tempPlayer.skin.hue" :show-tooltip="false" :min="0" :max="360"></el-slider>
          </div>
        </div>
        <div class="row">
          <div class="left">亮度</div>
          <div class="right">
            <el-slider v-model="tempPlayer.skin.brightness" :show-tooltip="false" :min="0.2" :max="2" :step="0.01"></el-slider>
          </div>
        </div>
      </div>
      <div class="outlook-wrapper">
        <div class="head">衣服{{tempPlayer.clothes.index + 1}}
          <i v-show="tempPlayer.clothes.index > 0" class="el-icon-caret-left left-arrow" @click="tempPlayer.clothes.index--"></i>
          <i v-show="tempPlayer.clothes.index < clothesNumber - 1" class="el-icon-caret-right right-arrow" @click="tempPlayer.clothes.index++"></i>
        </div>
        <div class="row">
          <div class="left">色调</div>
          <div class="right">
            <el-slider v-model="tempPlayer.clothes.hue" :show-tooltip="false" :min="0" :max="360"></el-slider>
          </div>
        </div>
        <div class="row">
          <div class="left">亮度</div>
          <div class="right">
            <el-slider v-model="tempPlayer.clothes.brightness" :show-tooltip="false" :min="0" :max="3" :step="0.01"></el-slider>
          </div>
        </div>
      </div>
      <div class="ope-row">
        <c-button @click="changeScene('menu')"><i class="el-icon-arrow-left"></i> 返回</c-button>
        <c-button @click="confirmNewSave()" background-color="#67C23A" :disabled="tempPlayer.name === '' || tempPlayer.name.indexOf('三杠') > -1"><i class="el-icon-check"></i> 创建</c-button>
      </div>
    </div>
    <div v-else-if="sceneController === 'main'" class="scene main">
      <div class="main-top">
        <div class="main-top-wrapper" :style="{left: -screenWidth * tabIndex + 'px'}">
          <div class="main-top-screen screen1" :style="{width: screenWidth + 'px'}">
            <div class="center-wrapper">
              <role class="center-role" :role="player"></role>
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
  /deep/ *{
    box-sizing: border-box;
    font-family: -apple-system,SF UI Text,Arial,PingFang SC,Hiragino Sans GB,Microsoft YaHei,WenQuanYi Micro Hei,sans-serif;
  }
  .road2CTO{
    /*禁止移动端长按选择*/
    -webkit-touch-callout:none;
    -webkit-user-select:none;
    -khtml-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
    .mask{
      width: 100%;
      height: 100%;
      position: fixed;
      background-color: black;
      opacity: 0;
      z-index: 999;
      animation: a-mask 600ms linear;
      @keyframes a-mask {
        0%{opacity: 0}
        50%{opacity: 1}
        100%{opacity: 0}
      }
    }
    .scene{
      width: 100%;
      height: 100%;
      display: flex;
      flex-flow: column nowrap;
      overflow: hidden;
    }
    /*====loading====*/
    .loading{
      background-color: black;
      color: white;
      display: flex;
      flex-flow: column nowrap;
      justify-content: center;
      align-items: center;
      .progress-wrapper{
        width: 80%;
        height: 40px;
        margin-bottom: 20px;
        background-image: linear-gradient(#9c9c9c, #656565);
        border-radius: 20px;
        border: 3px solid #4f4f4f;
        position: relative;
        overflow: hidden;
        .progress-bar{
          height: 100%;
          background-image: linear-gradient(#eb5800, #9b3b00);
          position: absolute;
          transition: width 500ms;
        }
      }
    }
    /*====menu====*/
    .menu{
      justify-content: center;
      align-items: center;
      background-image: linear-gradient(180deg, #ffe5ed, #f5a2b8);
      padding: 0 40px;
    }
    /*====new====*/
    .new{
      background-image: linear-gradient(180deg, #ffe5ed, #f5a2b8);
      justify-content: center;
      align-items: center;
      padding: 0 40px;
      .title{
        width: 100%;
        margin-bottom: 20px;
        border-bottom: 1px solid black;
        font-size: 20px;
        text-align: center;
      }
      .name-row{
        height: 44px;
        margin-bottom: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        .left-wrapper{
          width: 44px;
          height: 44px;
          margin-right: 20px;
          background-color: white;
          border: 2px solid black;
          border-radius: 4px;
          overflow: hidden;
        }
        .right{
          width: 180px;
          height: 32px;
          line-height: 32px;
          padding: 0 10px;
          border: none;
          border-radius: 4px;
          font-size: 20px;
        }
        .tips{
          position: absolute;
          top: 40px;
          left: 70px;
          font-size: 14px;
          color: red;
        }
      }
      .outlook-wrapper{
        width: 100%;
        background-color: rgba(245, 150, 175, 0.82);
        margin-bottom: 10px;
        border-radius: 10px;
        overflow: hidden;
        .head{
          width: 100%;
          height: 32px;
          line-height: 32px;
          padding: 0 10px;
          border-bottom: 1px solid black;
          font-size: 16px;
          text-align: center;
          position: relative;
          .left-arrow{
            position: absolute;
            top: 6px;
            left: 10px;
          }
          .right-arrow{
            position: absolute;
            top: 6px;
            right: 10px;
          }
        }
        .row{
          width: 100%;
          height: 30px;
          padding: 0 20px;
          display: flex;
          align-items: center;
          .left{
            width: 60px;
          }
          .right{
            flex: 1 0 0;
          }
        }
      }
      .ope-row{
        width: 100%;
        margin-top: 20px;
        display: flex;
        .c-button{
          flex: 1 0 0;
          margin-left: 20px;
          &:first-child{margin-left: 0}
        }
      }
    }
    /*====main====*/
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
  // components
  import cButton from "./components/c-button"
  import role from "./components/role"
  import save from "./components/save"

  // db
  import cells from "./db/cells"
  import maps from "./db/maps"

  function log(...arg) {
    console.log(...arg);
  }

  export default {
    name: 'road2CTO',
    components: {
      cButton,
      role,
      save
    },
    mixins: [cells, maps],
    data () {
      return {
        screenWidth: 0,
        screenHeight: 0,
        preloads: [],
        preloadNumber: 0,
        sceneController: "loading",
        tabs: ["主界面", "技能", "背包", "设置"],
        tabIndex: 0,
        isMaskShow: false,
        skinNumber: 1,
        hairNumber: 2,
        clothesNumber: 1,
        saveIndex: 0,
        saves: [null, null, null],
        tempPlayer: {},
        player: {
          map: "test",
          x: 0,
          y: 0,
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

      //加载存档
      this.saves = [
        localStorage.getItem("save0") ? JSON.parse(localStorage.getItem("save0")) : null,
        localStorage.getItem("save1") ? JSON.parse(localStorage.getItem("save1")) : null,
        localStorage.getItem("save2") ? JSON.parse(localStorage.getItem("save2")) : null
      ];

      //预加载
      this.addPreload("cell", "floor", 1);
      this.addPreload("cell", "wall", 16);
      this.addPreload("role", "skin", this.skinNumber, true);
      this.addPreload("role", "hair", this.hairNumber, true);
      this.addPreload("role", "clothes", this.clothesNumber, true);

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
          this.changeScene("menu", true);
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

      //键盘事件
      document.onkeydown = (event) => {
        if(event.keyCode === 32 || event.keyCode === 13){
          //空格或回车
          //阻止空格滚动
          event.preventDefault();
        } else if(event.keyCode === 87 || event.keyCode === 38){
          this.touchstart("up");
        } else if(event.keyCode === 83 || event.keyCode === 40){
          this.touchstart("down");
        } else if(event.keyCode === 65 || event.keyCode === 37){
          this.touchstart("left");
        } else if(event.keyCode === 68 || event.keyCode === 39){
          this.touchstart("right");
        }
      };
      document.onkeyup = (event) => {
        this.touchend();
      };
    },
    methods: {
      addPreload(type, name, number, needsDirection = false){
        for(let i = 0; i < number; i++){
          if(needsDirection){
            this.preloads.push(require(`./img/${type}/${name}${i}-down.png`));
            this.preloads.push(require(`./img/${type}/${name}${i}-up.png`));
            this.preloads.push(require(`./img/${type}/${name}${i}-left.png`));
            this.preloads.push(require(`./img/${type}/${name}${i}-right.png`));
          } else {
            this.preloads.push(require(`./img/${type}/${name}${i}.png`));
          }
        }
      },
      changeScene(scene, needsFade = false){
        if(needsFade){
          this.isMaskShow = true;
          setTimeout(() => {
            this.sceneController = scene;
          }, 300);
          setTimeout(() => {
            this.isMaskShow = false;
          }, 600);
        } else {
          this.sceneController = scene;
        }
      },
      newSave(saveIndex){
        this.saveIndex = saveIndex;
        this.tempPlayer = {
          name: "",
          skin: {
            index: 0,
            hue: 0,
            brightness: 1,
          },
          clothes: {
            index: 0,
            hue: 0,
            brightness: 1,
          },
          hair: {
            index: 0,
            hue: 0,
            brightness: 1,
          },
          direction: "down",
        };
        this.changeScene("new");
      },
      startGame(saveIndex){
        this.player = {
          ...this.player,
          ...this.saves[saveIndex]
        };
        this.changeScene("main", true);
      },
      deleteSave(saveIndex){
        this.$set(this.saves, saveIndex, null)
        // this.saves[saveIndex] = null;
        localStorage.removeItem(`save${saveIndex}`);
      },
      confirmNewSave(){
        let stringSave = JSON.stringify(this.tempPlayer);
        this.saves[this.saveIndex] = JSON.parse(stringSave);
        localStorage.setItem(`save${this.saveIndex}`, stringSave);
        this.changeScene("menu");
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
