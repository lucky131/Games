<template>
  <div id="content"
       @mouseup.left="mouseup()"
       @mouseup.right="mouseup()">
    <div id="board" v-show="!isDialogShow">
      <div id="tipTop" class="tip"><div v-for="(item, index) in topBlocks" :key="index"><span v-for="(item2, index2) in item" :key="index2">{{item2}}</span></div></div>
      <div id="tipLeft" class="tip"><div v-for="(item, index) in leftBlocks" :key="index"><span v-for="(item2, index2) in item" :key="index2">{{item2}}</span></div></div>
      <div id="field">
        <div class="block" v-for="item in blocks" :key="item.index"
             @mousedown.left="leftDown(item.index)"
             @mousedown.right="rightDown(item.index)"
             @mouseenter="enter(item.index)">
          <div class="innerBlock xBlock" v-if="item.x"><i class="el-icon-close"></i></div>
          <div class="innerBlock fillBlock" v-else-if="item.fill"></div>
          <div class="innerBlock" v-else></div>
        </div>
      </div>
    </div>
    <el-dialog
      title="新游戏"
      center
      :visible.sync="isDialogShow"
      width="320px"
      :show-close="falseData"
      :close-on-click-modal="falseData"
      :close-on-press-escape="falseData">
      <el-form label-width="60px">
        <el-form-item label="宽">
          <el-input-number v-model="config.width" :min="5" :max="20" :step="5"></el-input-number>
        </el-form-item>
        <el-form-item label="高">
          <el-input-number v-model="config.height" :min="5" :max="15" :step="5"></el-input-number>
        </el-form-item>
        <el-form-item label="密度">
          <el-slider style="width: 180px;" v-model="config.density" :min="0.2" :max="1" :step="0.01"></el-slider>
        </el-form-item>
      </el-form>
      <span slot="footer" class="">
        <el-button type="primary" @click="start()">开始</el-button>
      </span>
    </el-dialog>
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
      position: relative;
      .tip{
        position: absolute;
        background-color: #227d30;
        display: flex;
        align-items: center;
        div{
          background-color: #d5ffda;
          border-radius: 4px;
          padding-bottom: 6px;
          box-sizing: border-box;
          cursor: default;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          span{
            color: #239129;
            font-weight: bold;
          }
        }
      }
      #tipTop{
        height: 150px;
        top: 0;
        right: 0;
        flex-flow: row nowrap;
        div{
          width: 36px;
          height: 146px;
          margin: 0 2px;
          flex-flow: column nowrap;
          span{

          }
        }
      }
      #tipLeft{
        width: 150px;
        left: 0;
        bottom: 0;
        flex-flow: column nowrap;
        div{
          width: 146px;
          height: 36px;
          margin: 2px 0;
          padding-right: 8px;
          flex-flow: row nowrap;
          span{
            margin-left: 8px;
          }
        }
      }
      #field{
        background-color: #172E7D;
        position: absolute;
        right: 0;
        bottom: 0;
        display: flex;
        flex-flow: row wrap;
        .block{
          width: 40px;
          height: 40px;
          cursor: default;
          display: flex;
          justify-content: center;
          align-items: center;
          .innerBlock{
            width: 36px;
            height: 36px;
            line-height: 36px;
            text-align: center;
            border-radius: 4px;
            font-size: 36px;
            background-color: #c6e2ff;
          }
          .xBlock{
            color: red;
          }
          .fillBlock{
            background-color: #449aff;
          }
        }
      }
    }
  }
</style>

<script>
  export default {
    name: "picross",
    data(){
      return{
        falseData: false,
        isDialogShow: true,
        config: {
          blockSize: 40,
          width: 10,
          height: 10,
          density: 0.5,
        },
        blocks: [],
        topBlocks: [],
        leftBlocks: [],
        mouseStatus: 0, //0无状态 1空变填 2填变空 3空变叉 4叉变空
        startTime: null,
      }
    },
    mounted(){

    },
    methods: {
      start(){
        this.isDialogShow = false;
        this.startTime = new Date();
        this.mouseStatus = 0;

        //初始化棋盘
        $("#board").css("width", this.config.width * this.config.blockSize + 150)
          .css("height", this.config.height * this.config.blockSize + 150);
        $("#tipTop").css("width", this.config.width * this.config.blockSize)
        $("#tipLeft").css("height", this.config.height * this.config.blockSize);
        $("#field").css("width", this.config.width * this.config.blockSize)
          .css("height", this.config.height * this.config.blockSize);

        //生成blocks
        this.blocks = [];
        for(let i=0;i<this.config.height;i++){
          for(let j=0;j<this.config.width;j++){
            this.blocks.push({
              row: i,
              col: j,
              index: i*this.config.width+j,
              answer: Math.random() < this.config.density,
              fill: false,
              x: false,
            });
          }
        }
        //生成topBlocks
        this.topBlocks = [];
        for(let i=0;i<this.config.width;i++){
          this.topBlocks.push([]);
        }
        //生成leftBlocks
        this.leftBlocks = [];
        for(let i=0;i<this.config.height;i++){
          this.leftBlocks.push([]);
        }

        //计算topBlocks
        for(let j=0;j<this.config.width;j++){
          let num = 0;
          for(let i=0;i<this.config.height;i++){
            let index = i*this.config.width+j;
            if(this.blocks[index].answer){
              num++;
            } else if(num>0){
              this.topBlocks[j].push(num);
              num = 0;
            }
          }
          if(num>0){
            this.topBlocks[j].push(num);
          }
        }
        //计算leftBlocks
        for(let i=0;i<this.config.height;i++){
          let num = 0;
          for(let j=0;j<this.config.width;j++){
            let index = i*this.config.width+j;
            if(this.blocks[index].answer){
              num++;
            } else if(num>0){
              this.leftBlocks[i].push(num);
              num = 0;
            }
          }
          if(num>0){
            this.leftBlocks[i].push(num);
          }
        }
      },
      leftDown(index){
        if(!this.blocks[index].x){
          if(this.blocks[index].fill){
            this.mouseStatus = 2;
          } else {
            this.mouseStatus = 1;
          }
          this.enter(index);
        }
      },
      rightDown(index){
        if(this.blocks[index].x){
          this.mouseStatus = 4;
        } else if(this.blocks[index].fill){
          this.mouseStatus = 2;
        } else {
          this.mouseStatus = 3;
        }
        this.enter(index);
      },
      mouseup(){
        this.mouseStatus = 0;
      },
      enter(index){
        if(this.mouseStatus === 1){
          this.blank2fill(index);
        } else if(this.mouseStatus === 2){
          this.fill2blank(index);
        } else if(this.mouseStatus === 3){
          this.blank2x(index);
        } else if(this.mouseStatus === 4){
          this.x2blank(index);
        }
      },
      blank2fill(index){
        if(!this.blocks[index].x && !this.blocks[index].fill){
          this.blocks[index].fill = true;
          this.handleWin();
        }
      },
      fill2blank(index){
        if(!this.blocks[index].x && this.blocks[index].fill){
          this.blocks[index].fill = false;
          this.handleWin();
        }
      },
      blank2x(index){
        if(!this.blocks[index].x && !this.blocks[index].fill){
          this.blocks[index].x = true;
        }
      },
      x2blank(index){
        if(this.blocks[index].x && !this.blocks[index].fill){
          this.blocks[index].x = false;
        }
      },
      handleWin(){
        if(this.isWin()){
          let endTime = new Date();
          let diff = (endTime.getTime() - this.startTime.getTime()) / 1000;
          this.$alert("Win! Your score: " + diff + " s", {
            callback: () => {
              this.isDialogShow = true;
            }
          });
        }
      },
      isWin(){
        for(let i=0;i<this.config.height;i++){
          for(let j=0;j<this.config.width;j++){
            let index = i*this.config.width+j;
            if(this.blocks[index].answer !== this.blocks[index].fill){
              return false;
            }
          }
        }
        return true;
      },
    }
  }
</script>
