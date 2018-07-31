<template>
  <div id="content">
    <div id="ope">
      <div id="levels">
        <el-button size="small" type="primary" v-for="n in allData.length-1" :key="n" @click="changeLevel(n)">{{n}}</el-button>
      </div>
      <el-row>
        <el-button size="small" type="primary" @click="reset()">Reset</el-button>
        <el-button size="small" type="primary" @click="changeDebug()">debug模式：{{config.debug ? "开" : "关"}}</el-button>
      </el-row>
      <el-form label-width="100px">
        <el-form-item label="方块宽度">
          <el-slider v-model="config.playerWidth" :min="5" :step="5" :max="100" :disabled="!config.debug" @change="changePlayerSize()"></el-slider>
        </el-form-item>
        <el-form-item label="方块高度">
          <el-slider v-model="config.playerHeight" :min="5" :step="5" :max="100" :disabled="!config.debug" @change="changePlayerSize()"></el-slider>
        </el-form-item>
        <el-form-item label="移动加速度">
          <el-slider v-model="config.pushA" :min="0" :step="1" :max="100" :disabled="!config.debug"></el-slider>
        </el-form-item>
        <el-form-item label="摩擦加速度">
          <el-slider v-model="config.fA" :min="0" :step="1" :max="100" :disabled="!config.debug"></el-slider>
        </el-form-item>
        <el-form-item label="最大横向速度">
          <el-slider v-model="config.maxVx" :min="0" :step="1" :max="100" :disabled="!config.debug"></el-slider>
        </el-form-item>
        <el-form-item label="最大纵向速度">
          <el-slider v-model="config.maxVy" :min="0" :step="1" :max="100" :disabled="!config.debug"></el-slider>
        </el-form-item>
        <el-form-item label="重力g">
          <el-slider v-model="config.g" :min="0" :step="1" :max="30" :disabled="!config.debug" @change="changeG()"></el-slider>
        </el-form-item>
        <el-form-item label="跳跃速度">
          <el-slider v-model="config.jumpVy" :min="0" :step="1" :max="100" :disabled="!config.debug"></el-slider>
        </el-form-item>
        <el-form-item label="跳跃次数">
          <el-slider v-model="config.maxJump" :min="0" :step="1" :max="10" :disabled="!config.debug"></el-slider>
        </el-form-item>
      </el-form>
    </div>
    <div id="board" @click="mouseclick" @mousemove="mousemove">
      <div id="stat" v-if="config.debug">
        x: {{player.x}}<br>
        y: {{player.y}}<br>
        vx: {{player.vx}}<br>
        vy: {{player.vy}}<br>
        ax: {{player.ax}}<br>
        ay: {{player.ay}}<br>
        jump: {{player.jump}}<br>
        mouseX: {{mouseX}}<br>
        mouseY: {{mouseY}}<br>
      </div>
      <div id="level">Level: {{level}}</div>
      <div id="player" :style="{top: player.y+'px', left: player.x+'px'}"></div>
      <div class="floor" v-for="item in floors" :key="item.id"
           :style="{width: item.width+'px', height: item.height+'px', top: item.top+'px', left: item.left+'px', backgroundColor: item.color ? item.color : 'black'}">
        <span v-if="config.debug">{{item.id}}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  #content{
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: center;
    #ope{
      width: 300px;
      padding: 20px;
      box-sizing: border-box;
      #levels{
        margin-bottom: 20px;
      }
      .el-form-item{
        margin-bottom: 0;
      }
    }
    #board{
      border: 1px solid black;
      position: relative;
      margin-bottom: 20px;
      #cover{
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: transparent;
        z-index: 10;
      }
      #stat{
        position: absolute;
        width: 200px;
        background-color: rgba(0,0,0,.3);
        color: rgba(255,255,255,.7);
        z-index: 20;
        transition: background-color 300ms ease-in-out, color 300ms ease-in-out;
      }
      #stat:hover{
        background-color: rgba(0,0,0,.7);
        color: rgba(255,255,255,.9);
      }
      #level{
        position: absolute;
        font-size: 20px;
        top: 10px;
        right: 10px;
      }
      #player{
        width: 20px;
        height: 20px;
        background-color: #2e7bff;
        position: absolute;
      }
      .floor{
        position: absolute;
        color: #bbb;
        font-size: 10px;
        font-weight: bold;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
</style>

<script>
  import allData from "./floors.js"
  export default {
    name: "jump",
    data(){
      return{
        config: {
          width: 1000,
          height: 800,
          playerWidth: 10,
          playerHeight: 20,
          debug: true,
          g: 10,
          tick: 0.050, //s
          ticking: true,
          pushA: 50,
          fA: 25,
          maxVx: 50,
          maxVy: 50,
          jumpVy: 50,
          maxJump: 1,
        },
        player: {
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,
          ax: 0,
          ay: 0,
          jump: 0,
        },
        floors: [],
        level: 1,
        mouseX: 0,
        mouseY: 0,
      }
    },
    mixins: [allData],
    mounted: function () {
      $("#board").css("width", this.config.width+"px").css("height", this.config.height+"px");
      $("#player").css("width", this.config.playerWidth+"px").css("height", this.config.playerHeight+"px");

      let that = this;

      this.reset();

      //键盘事件
      $(document).keydown(function (e) {
        if(e.keyCode==38 || e.keyCode==87){
          //↑
          // that.player.ay = -that.pushA;
          if(that.player.jump>0){
            that.player.vy = -that.config.jumpVy;
            that.player.jump--;
          }
        } else if(e.keyCode==40 || e.keyCode==83){
          //↓
          // that.player.ay = that.pushA;
        } else if(e.keyCode==37 || e.keyCode==65){
          //←
          that.player.ax = -that.config.pushA;
        } else if(e.keyCode==39 || e.keyCode==68){
          //→
          that.player.ax = that.config.pushA;
        } else if(e.keyCode==82){
          //R
          that.reset();
        } else if(e.keyCode>=49 && e.keyCode<=57){
          //1~9
          let number = e.keyCode-48;
          that.changeLevel(number);
        }
      });
      $(document).keyup(function (e) {
        if(e.keyCode==38 || e.keyCode==87){
          //↑
          // that.player.ay = 0;
        } else if(e.keyCode==40 || e.keyCode==83){
          //↓
          // that.player.ay = 0;
        } else if(e.keyCode==37 || e.keyCode==65){
          //←
          that.player.ax = 0;
        } else if(e.keyCode==39 || e.keyCode==68){
          //→
          that.player.ax = 0;
        }
      });

      setTimeout(() => {
        this.nextTick();
      }, this.config.tick*100);
    },
    methods: {
      nextTick(){
        this.$nextTick(() => {
          this.player.x += this.player.vx * this.config.tick;
          this.player.y += this.player.vy * this.config.tick;
          if(Math.abs(this.player.vx)<=this.config.maxVx)
            this.player.vx += this.player.ax * this.config.tick;
          if(Math.abs(this.player.vy)<=this.config.maxVy)
            this.player.vy += this.player.ay * this.config.tick;
          //摩擦力
          if(this.player.vx>0)
            this.player.vx -= this.config.fA * this.config.tick;
          else if(this.player.vx<0)
            this.player.vx += this.config.fA * this.config.tick;
          // if(this.player.vy>0)
          //   this.player.vy -= this.fA * this.tick;
          // else if(this.player.vy<0)
          //   this.player.vy += this.fA * this.tick;
          //0修正
          if(Math.abs(this.player.vx)<0.1)
            this.player.vx = 0;
          if(Math.abs(this.player.vy)<0.1)
            this.player.vy = 0;

          //反弹碰撞
          //左墙
          if(this.player.x<0 && this.player.vx<0)
            // this.player.vx = -this.player.vx;
            this.player.vx = 0;
          for(let index in this.floors){
            if(this.player.y > this.floors[index].top - this.config.playerHeight
              && this.player.y < this.floors[index].top + this.floors[index].height
              && this.player.x > this.floors[index].left - this.config.playerWidth - 0
              && this.player.x < this.floors[index].left - this.config.playerWidth + 5
              && this.player.vx > 0){
              // this.player.vx = -this.player.vx;
              this.player.vx = 0;
              break;
            }
          }
          //右墙
          if(this.player.x>this.config.width - this.config.playerWidth && this.player.vx>0)
            // this.player.vx = -this.player.vx;
            this.player.vx = 0;
          for(let index in this.floors){
            if(this.player.y > this.floors[index].top - this.config.playerHeight
              && this.player.y < this.floors[index].top + this.floors[index].height
              && this.player.x > this.floors[index].left + this.floors[index].width - 5
              && this.player.x < this.floors[index].left + this.floors[index].width + 0
              && this.player.vx < 0){
              // this.player.vx = -this.player.vx;
              this.player.vx = 0;
              break;
            }
          }
          //顶部
          if(this.player.y<0 && this.player.vy<0)
            this.player.vy = -this.player.vy;
          for(let index in this.floors){
            if(this.player.x > this.floors[index].left - this.config.playerWidth
              && this.player.x < this.floors[index].left + this.floors[index].width
              && this.player.y > this.floors[index].top + this.floors[index].height - 4
              && this.player.y < this.floors[index].top + this.floors[index].height + 1
              && this.player.vy < 0){
              this.player.vy = -this.player.vy;
              break;
            }
          }

          //落地
          if(this.player.y > this.config.height - this.config.playerHeight - 3
            && this.player.y < this.config.height - this.config.playerHeight + 2
            && this.player.vy>0){
            this.player.vy = 0;
            this.player.y = this.config.height - this.config.playerHeight;
            this.player.jump = this.config.maxJump;
          }
          for(let index in this.floors){
            if(this.player.x > this.floors[index].left - this.config.playerWidth
              && this.player.x < this.floors[index].left + this.floors[index].width
              && this.player.y > this.floors[index].top - this.config.playerHeight - 2
              && this.player.y < this.floors[index].top - this.config.playerHeight + 3
              && this.player.vy > 0){
              this.player.vy = 0;
              this.player.y = this.floors[index].top - this.config.playerHeight;
              this.player.jump = this.config.maxJump;
              //事件
              if(this.floors[index].events.startsWith("level")){
                let level = this.floors[index].events.replace("level", "");
                level = parseInt(level);
                this.level = level;
                this.reset();
              } else if(this.floors[index].events.startsWith("remove")){
                let id = this.floors[index].events.replace("remove", "");
                id = parseInt(id);
                for(let index in this.floors){
                  if(this.floors[index].id === id){
                    this.floors.splice(index, 1);
                    break;
                  }
                }
                this.floors[index].events = "";
              } else if(this.floors[index].events.startsWith("slide")){
                let v = this.floors[index].events.replace("slide", "");
                v = parseInt(v);
                this.player.vx = v;
              } else if(this.floors[index].events === "die"){
                // this.config.ticking = false;
                // this.$message("大侠你挂了，请重新来过");
                this.reset();
              }
              break;
            }
          }

          if(this.config.ticking){
            setTimeout(() => {
              this.nextTick();
            }, this.config.tick*100);
          }
        });
      },
      mouseclick(){
        this.player.x = this.mouseX;
        this.player.y = this.mouseY;
        this.player.vx = 0;
        this.player.vy = 0;
      },
      mousemove(e){
        if(e.target != e.currentTarget){
          return;
        }
        this.mouseX = e.offsetX;
        this.mouseY = e.offsetY;
      },
      changeLevel(level){
        //1~length
        if(level<1 || level>this.allData.length) return;
        this.level = level;
        this.reset();
      },
      reset(){
        this.player.x = this.allData[this.level].bornLeft;
        this.player.y = this.allData[this.level].bornBottom - this.config.playerHeight*2;
        this.player.vx = 0;
        this.player.vy = 0;
        this.player.ax = 0;
        this.player.ay = this.config.g;
        this.player.jump = this.config.maxJump;
        // this.floors = this.allData[this.level].floors;
        //深拷贝，否则指针相同
        this.floors = $.extend(true, [], this.allData[this.level].floors);
        if(!this.config.ticking){
          this.config.ticking = true;
          setTimeout(() => {
            this.nextTick();
          }, this.config.tick*100);
        }
      },
      changeDebug(){
        this.config.debug = !this.config.debug;
      },
      changePlayerSize(){
        $("#player").css("width", this.config.playerWidth+"px").css("height", this.config.playerHeight+"px");
      },
      changeG(){
        this.player.ay = this.config.g;
      }
    }
  }
</script>
