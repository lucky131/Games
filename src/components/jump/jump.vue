<template>
  <div id="content">
    <div id="board">
      <span v-if="config.showStat">
        x: {{player.x}}<br>
        y: {{player.y}}<br>
        vx: {{player.vx}}<br>
        vy: {{player.vy}}<br>
        ax: {{player.ax}}<br>
        ay: {{player.ay}}<br>
        jump: {{player.jump}}<br>
      </span>
      <div id="player" :style="{top: player.y+'px', left: player.x+'px'}"></div>
      <div :id="'floor'+item.id" class="floor" v-for="item in floors" :key="item.id"
           :style="{width: item.width+'px', top: item.top+'px', left: item.left+'px'}"></div>
    </div>
    <div>
      <el-button type="primary" @click="reset()">Reset</el-button>
      <el-button type="primary" @click="changeShowStat()">数据：{{config.showStat ? "开" : "关"}}</el-button>
    </div>
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
      margin-bottom: 20px;
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
          showStat: true,
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
            id: 1,
            width: 150,
            top: 700,
            left: 550,
            events: "add2",
          }
        ],
        startTime: null,
      }
    },
    mounted: function () {
      $("#board").css("width", this.config.width+"px").css("height", this.config.height+"px");
      $("#player").css("width", this.config.playerWidth+"px").css("height", this.config.playerHeight+"px");
      // for(let index in this.floors){
      //   $("#floor"+this.floors[index].id).css("width", this.floors[index].width)
      //     .css("top", this.floors[index].top)
      //     .css("left", this.floors[index].left);
      // }

      let that = this;

      this.reset();

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
          if(this.player.y > this.config.height - this.config.playerHeight - 3
            && this.player.y < this.config.height - this.config.playerHeight + 2
            && this.player.vy>0){
            this.player.vy = 0;
            this.player.y = this.config.height - this.config.playerHeight;
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
              if(this.floors[index].events === "add2"){
                this.floors[index].events = "";
                this.floors.push({
                  id: 2,
                  width: 100,
                  top: 600,
                  left: 400,
                  events: "add3",
                });
              } else if(this.floors[index].events === "add3"){
                this.floors[index].events = "";
                this.floors.push({
                  id: 3,
                  width: 80,
                  top: 500,
                  left: 700,
                  events: "add4",
                });
              } else if(this.floors[index].events === "add4"){
                this.floors[index].events = "";
                this.floors.push({
                  id: 4,
                  width: 150,
                  top: 450,
                  left: 100,
                  events: "add5",
                });
              } else if(this.floors[index].events === "add5"){
                this.floors[index].events = "";
                this.floors.push({
                  id: 5,
                  width: 70,
                  top: 350,
                  left: 500,
                  events: "add6",
                });
              } else if(this.floors[index].events === "add6"){
                this.floors[index].events = "";
                this.floors.push({
                  id: 6,
                  width: 60,
                  top: 300,
                  left: 850,
                  events: "add7",
                });
              } else if(this.floors[index].events === "add7"){
                this.floors[index].events = "";
                this.floors.push({
                  id: 7,
                  width: 50,
                  top: 180,
                  left: 855,
                  events: "add8",
                });
              } else if(this.floors[index].events === "add8"){
                this.floors[index].events = "";
                this.floors.push({
                  id: 8,
                  width: 40,
                  top: 100,
                  left: 650,
                  events: "add9",
                });
              } else if(this.floors[index].events === "add9"){
                this.floors[index].events = "";
                this.floors.push({
                  id: 9,
                  width: 30,
                  top: 200,
                  left: 320,
                  events: "add10",
                });
              } else if(this.floors[index].events === "add10"){
                this.floors[index].events = "";
                this.floors.push({
                  id: 10,
                  width: 30,
                  top: 120,
                  left: 130,
                  events: "win",
                });
              } else if(this.floors[index].events === "win"){
                //胜利
                let endTime = new Date();
                let diff = (endTime.getTime() - this.startTime.getTime()) / 1000;
                this.config.ticking = false;
                this.$alert("Win! Your score: " + diff + " s", {
                  callback: () => {
                    this.reset();
                  }
                });
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
      reset(){
        this.player.x = this.config.width/2 - this.config.playerWidth/2;
        this.player.y = this.config.height - this.config.playerHeight*2;
        this.player.vx = 0;
        this.player.vy = 0;
        this.player.ax = 0;
        this.player.ay = this.config.g;
        this.player.jump = this.config.maxJump;
        this.floors = [
          {
            id: 1,
            width: 150,
            top: 700,
            left: 550,
            events: "add2",
          }
        ];
        this.startTime = new Date();
        if(!this.config.ticking){
          this.config.ticking = true;
          setTimeout(() => {
            this.nextTick();
          }, this.config.tick*100);
        }
      },
      changeShowStat(){
        this.config.showStat = !this.config.showStat;
      }
    }
  }
</script>
