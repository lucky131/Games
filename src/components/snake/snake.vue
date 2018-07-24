<template>
  <div id="content">
    <div id="field">
      <div class="blockRow" v-for="row in blocks" :key="row[0].row">
        <div class="block" v-for="item in row" :key="item.col">
          <div class="innerBlock snake" v-if="item.snake"></div>
          <div class="innerBlock food" v-else-if="item.food"></div>
        </div>
      </div>
    </div>
    <div style="color: white">direction: {{snake.direction}}, length: {{snake.length}}</div>
    <el-dialog
      title="新游戏"
      center
      :visible.sync="isDialogShow"
      width="320px"
      :show-close="falseData"
      :close-on-click-modal="falseData"
      :close-on-press-escape="falseData">
      <el-form label-width="80px">
        <el-form-item label="格子大小">
          <el-input-number v-model="config.blockSize" :min="5" :step="5"></el-input-number>
        </el-form-item>
        <el-form-item label="宽">
          <el-input-number v-model="config.width" :min="5"></el-input-number>
        </el-form-item>
        <el-form-item label="高">
          <el-input-number v-model="config.height" :min="5"></el-input-number>
        </el-form-item>
        <el-form-item label="间隔(ms)">
          <el-input-number v-model="config.interval" :min="100" :max="1000" :step="100"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="">
        <el-button type="primary" @click="start()">开始</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
  #content {
    width: 100vw;
    height: 100vh;
    background-color: black;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;
    #field{
      border: 1px solid white;
      .blockRow{
        width: 100%;
        overflow: hidden;
        .block{
          float: left;
          .innerBlock{
            width: 100%;
            height: 100%;
          }
          .snake{
            background-color: white;
          }
          .food{
            background-color: red;
          }
        }
      }
    }
    .el-form-item /deep/ .el-form-item__label{
      padding-right: 20px;
    }
  }
</style>

<script>
  export default {
    name: 'snake',
    data () {
      return {
        falseData: false,
        isDialogShow: true,
        config: {
          blockSize: 40,
          width: 10,
          height: 10,
          interval: 400
        },
        blocks: [],
        snake: {
          direction: "left",
          length: 1,
          positions: [],
        },
        food: {row: 0, col: 0}
      }
    },
    mounted: function(){
      let that = this;

      //键盘事件
      $(document).keydown(function (e) {
        if((e.keyCode==38 || e.keyCode==87) && that.snake.direction != "down"){
          that.snake.direction = "up";
        } else if((e.keyCode==40 || e.keyCode==83) && that.snake.direction != "up"){
          that.snake.direction = "down";
        } else if((e.keyCode==37 || e.keyCode==65) && that.snake.direction != "right"){
          that.snake.direction = "left";
        } else if((e.keyCode==39 || e.keyCode==68) && that.snake.direction != "left"){
          that.snake.direction = "right";
        }
      });
    },
    methods: {
      start(){
        this.isDialogShow = false;

        //初始化棋盘
        $("#field").css("width", this.config.width * this.config.blockSize)
          .css("height", this.config.height * this.config.blockSize);

        //生成blocks
        this.blocks = [];
        this.snake = {
          direction: "left",
            length: 1,
            positions: [],
        };
        this.food = {row: 0, col: 0};
        for(let i=0;i<this.config.height;i++){
          this.blocks.push([]);
          for(let j=0;j<this.config.width;j++){
            this.blocks[i].push({
              row: i,
              col: j,
              snake: false,
              food: false
            });
          }
        }

        this.$nextTick(() => {
          $(".block").css("width", this.config.blockSize)
            .css("height", this.config.blockSize);
        });

        //出生点为中心
        this.snake.positions.push({
          row: Math.floor(this.config.height/2),
          col: Math.floor(this.config.width/2),
        });

        this.generateFood();
        this.refresh();
        this.step();
      },
      step(){
        let headPosition = this.snake.positions[0];
        let nextPosition = {};
        let tailPosition = this.snake.positions[this.snake.length-1];
        //暂时删除屁股
        this.snake.positions.splice(this.snake.length-1, 1);
        //头移动
        if(this.snake.direction=="up"){
          nextPosition = {row: headPosition.row - 1, col: headPosition.col};
        } else if(this.snake.direction=="down"){
          nextPosition = {row: headPosition.row + 1, col: headPosition.col};
        } else if(this.snake.direction=="left"){
          nextPosition = {row: headPosition.row, col: headPosition.col - 1};
        } else if(this.snake.direction=="right"){
          nextPosition = {row: headPosition.row, col: headPosition.col + 1};
        }

        this.refresh();

        //判断是否死亡
        if(nextPosition.row >=0
          && nextPosition.row <= this.config.height-1
          && nextPosition.col >=0
          && nextPosition.col <= this.config.width-1
          && !this.blocks[nextPosition.row][nextPosition.col].snake){
          //把头加上
          this.snake.positions.unshift(nextPosition);
          //判断是否吃了果实
          if(this.blocks[nextPosition.row][nextPosition.col].food){
            //把屁股加回来
            this.snake.positions.push(tailPosition);
            this.snake.length++;
            //果实消失
            this.blocks[nextPosition.row][nextPosition.col].food = false;
            //重新生成一个果实
            this.generateFood();
          }
          setTimeout(() => {
            this.step();
          }, this.config.interval);
        } else {
          this.$alert("GG, your score: " + this.snake.length, {
            callback: () => {
              this.isDialogShow = true;
            }
          });
          //死了也要把屁股加回来
          this.snake.positions.push(tailPosition);
        }

        this.refresh();
      },
      refresh(){
        this.blocks = [];
        for(let i=0;i<this.config.height;i++){
          this.blocks.push([]);
          for(let j=0;j<this.config.width;j++){
            this.blocks[i].push({
              row: i,
              col: j,
              snake: false,
              food: false
            });
          }
        }
        for(let index in this.snake.positions){
          this.blocks[this.snake.positions[index].row][this.snake.positions[index].col].snake = true;
        }
        this.blocks[this.food.row][this.food.col].food = true;
      },
      generateFood(){
        this.refresh();
        let row, col;
        do{
          row = Math.floor(Math.random() * this.config.height);
          col = Math.floor(Math.random() * this.config.width);
        } while (this.blocks[row][col].snake);
        this.food.row = row;
        this.food.col = col;
      }
    }
  }
</script>
