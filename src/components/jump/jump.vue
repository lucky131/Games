<template>
  <div id="content">
    <div id="board">
      x: {{player.x}}<br>
      y: {{player.y}}<br>
      vx: {{player.vx}}<br>
      vy: {{player.vy}}<br>
      ax: {{player.ax}}<br>
      ay: {{player.ay}}<br>
      <div id="player"></div>
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
      width: 600px;
      height: 600px;
      border: 1px solid black;
      position: relative;
      #player{
        width: 20px;
        height: 20px;
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
        player: {
          x: 100,
          y: 100,
          vx: 0,
          vy: 0,
          ax: 0,
          ay: 0,
        },
        tick: 0.05,
        ticking: true,
        pushA: 5,
        fA: 2,
      }
    },
    mounted: function () {
      let that = this;

      //键盘事件
      $(document).keydown(function (e) {
        if(e.keyCode==38 || e.keyCode==87){
          //↑
          that.player.ay = -that.pushA;
        } else if(e.keyCode==40 || e.keyCode==83){
          //↓
          that.player.ay = that.pushA;
        } else if(e.keyCode==37 || e.keyCode==65){
          //←
          that.player.ax = -that.pushA;
        } else if(e.keyCode==39 || e.keyCode==68){
          //→
          that.player.ax = that.pushA;
        }
      });
      $(document).keyup(function (e) {
        if(e.keyCode==38 || e.keyCode==87){
          //↑
          that.player.ay = 0;
        } else if(e.keyCode==40 || e.keyCode==83){
          //↓
          that.player.ay = 0;
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
      }, this.tick);
    },
    methods: {
      nextTick(){
        this.player.x += this.player.vx * this.tick;
        this.player.y += this.player.vy * this.tick;
        this.player.vx += this.player.ax * this.tick;
        this.player.vy += this.player.ay * this.tick;
        //摩擦力
        if(this.player.vx>0)
          this.player.vx -= this.fA * this.tick;
        else if(this.player.vx<0)
          this.player.vx += this.fA * this.tick;
        if(this.player.vy>0)
          this.player.vy -= this.fA * this.tick;
        else if(this.player.vy<0)
          this.player.vy += this.fA * this.tick;
        //0修正
        if(Math.abs(this.player.vx)<0.1)
          this.player.vx = 0;
        if(Math.abs(this.player.vy)<0.1)
          this.player.vy = 0;

        //碰撞
        if(this.player.x<0 && this.player.vx<0)
          this.player.vx = -this.player.vx;
        if(this.player.x>580 && this.player.vx>0)
          this.player.vx = -this.player.vx;
        if(this.player.y<0 && this.player.vy<0)
          this.player.vy = -this.player.vy;
        if(this.player.y>580 && this.player.vy>0)
          this.player.vy = -this.player.vy;

        $("#player").css("left", Math.round(this.player.x)+"px").css("top", Math.round(this.player.y)+"px");
        if(this.ticking){
          setTimeout(() => {
            this.nextTick();
          }, this.tick);
        }
      },
      resetPlayer(){
        this.player.x = 100;
        this.player.y = 100;
        this.player.vx = 0;
        this.player.vy = 0;
        this.player.ax = 0;
        this.player.ay = 0;
      }
    }
  }
</script>
