<template>
  <div id="content">
    <div id="board">
      x: {{player.x}}<br>
      y: {{player.y}}<br>
      vx: {{player.vx}}<br>
      vy: {{player.vy}}<br>
      ax: {{player.ax}}<br>
      ay: {{player.ay}}<br>
      jump: {{player.jump}}<br>
      <div id="player" :style="{top: player.y+'px', left: player.x+'px'}"></div>
      <div :id="'floor'+index" class="floor" v-for="(item, index) in floors" :key="index"></div>
    </div>
    <el-button type="primary" @click="resetPlayer()">Reset</el-button>
  </div>
</template>

<style scoped lang="scss">
  #content{
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;
    #board{
      border: 1px solid black;
      position: relative;
      #player{
        width: 20px;
        height: 20px;
        background-color: black;
        position: absolute;
      }
      .floor{
        height: 10px;
        background-color: black;
        position: absolute;
      }
    }
  }
</style>

<script>
  export default {
    name: "jump",
    data(){
      return{
        config: {
          width: 1000,
          height: 800,
          playerWidth: 10,
          playerHeight: 20,
          g: 10,
          tick: 0.050, //s
          ticking: true,
          pushA: 50,
          fA: 25,
          maxVx: 50,
          maxVy: 50,
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
        floors: [
          {
            width: 150,
            top: 700,
            left: 200,
            events: [],
          },
          {
            width: 100,
            top: 600,
            left: 500,
            events: [],
          },
          {
            width: 80,
            top: 500,
            left: 700,
            events: [],
          },
          {
            width: 150,
            top: 450,
            left: 100,
            events: [],
          },
          {
            width: 70,
            top: 350,
            left: 500,
            events: [],
          },
          {
            width: 60,
            top: 300,
            left: 850,
            events: [],
          },
          {
            width: 50,
            top: 180,
            left: 855,
            events: [],
          },
          {
            width: 40,
            top: 100,
            left: 650,
            events: [],
          },
          {
            width: 30,
            top: 200,
            left: 320,
            events: [],
          },
          {
            width: 30,
            top: 120,
            left: 130,
            events: ["win"],
          }
        ]
      }
    },
    mounted: function () {
      $("#board").css("width", this.config.width+"px").css("height", this.config.height+"px");
      $("#player").css("width", this.config.playerWidth+"px").css("height", this.config.playerHeight+"px");
      for(let index in this.floors){
        $("#floor"+index).css("width", this.floors[index].width)
          .css("top", this.floors[index].top)
          .css("left", this.floors[index].left);
      }

      let that = this;

      this.resetPlayer();

      //键盘事件
      $(document).keydown(function (e) {
        if(e.keyCode==38 || e.keyCode==87){
          //↑
          // that.player.ay = -that.pushA;
          if(that.player.jump>0){
            that.player.vy = -that.config.maxVy;
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
        // $("#player").css("left", Math.round(this.player.x)+"px");
        // $("#player").css("top", Math.round(this.player.y)+"px");

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
            this.player.vx = -this.player.vx;
          //右墙
          if(this.player.x>this.config.width - this.config.playerWidth && this.player.vx>0)
            this.player.vx = -this.player.vx;
          //顶部
          if(this.player.y<0 && this.player.vy<0)
            this.player.vy = -this.player.vy;

          //落地
          if(this.player.y>this.config.height - this.config.playerHeight && this.player.vy>0){
            this.player.y = this.config.height - this.config.playerHeight;
            this.player.vy = 0;
            this.player.jump = this.config.maxJump;
          }
          //自定义floor
          for(let index in this.floors){
            if(this.player.x > this.floors[index].left - this.config.playerWidth
              && this.player.x < this.floors[index].left + this.floors[index].width
              && this.player.y > this.floors[index].top - this.config.playerHeight - 3
              && this.player.y < this.floors[index].top - this.config.playerHeight + 2
              && this.player.vy > 0){
              this.player.vy = 0;
              this.player.y = this.floors[index].top - this.config.playerHeight;
              this.player.jump = this.config.maxJump;
              for(let index2 in this.floors[index].events){
                switch (this.floors[index].events[index2]){
                  case "win":
                    alert("win! ");
                    this.config.ticking = false;
                    break;
                }
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
      resetPlayer(){
        this.player.x = this.config.width/2 - this.config.playerWidth/2;
        this.player.y = this.config.height - this.config.playerHeight;
        this.player.vx = 0;
        this.player.vy = 0;
        this.player.ax = 0;
        this.player.ay = this.config.g;
        this.player.jump = this.config.maxJump;
        if(!this.config.ticking){
          this.config.ticking = true;
          setTimeout(() => {
            this.nextTick();
          }, this.config.tick*100);
        }
      }
    }
  }
</script>
