<template>
  <div class="wrap">
    <div class="title">点灯游戏解题器</div>
    <div class="subtitle">点击方格调整灯的分布，按“解”按钮即可得到答案，呈现绿色的格子即为需要点击的灯，可能有多组答案，程序只给出其中一种</div>
    <div class="map">
      <div class="row" v-for="(row, i) in blocks" :key="i">
        <div :class="{cell: true, answer: item.answer===1}" v-for="(item, j) in row" :key="j" @click="clickCell(i, j)">
          <span v-if="item.light===1">√</span>
        </div>
      </div>
    </div>

    <div>
      <el-button type="primary" round @click="getAns()">解</el-button>
      <el-button type="info" round @click="initBtn()">重置</el-button>
    </div>

  </div>
</template>

<style scoped lang="scss">
  .wrap{
    padding: 20px;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    .title{
      font-size: 24px;
      margin-bottom: 10px;
    }
    .subtitle{
      font-size: 12px;
      color: #999;
      margin-bottom: 20px;
    }
    .map{
      margin-bottom: 20px;
      border-right: 1px solid black;
      border-bottom: 1px solid black;
      .row{
        display: flex;
        flex-flow: row nowrap;
        .cell{
          width: 40px;
          height: 40px;
          background-color: white;
          border-left: 1px solid black;
          border-top: 1px solid black;
          box-sizing: border-box;
          display: flex;
          justify-content: center;
          align-items: center;
          &.answer{
            background-color: #6eda6e;
          }
        }
      }
    }
  }
</style>

<script>
  export default {
    name: "light",
    data(){
      return{
        row: 3,
        col: 3,
        blocks: [],
        blocks2: [],
        blocks3: [],
      }
    },
    computed: {

    },
    mounted(){
      this.initBlocks();
      this.initBlocks2();
    },
    methods: {
      initBlocks(){
        this.blocks = [];
        for (let i = 0; i < this.row; i++) {
          let temp1 = [];
          for (let j = 0; j < this.col; j++) {
            temp1.push({
              i: i,
              j: j,
              light: 0,
              answer: 0
            });
          }
          this.blocks.push(temp1);
        }
      },
      initBlocks2(){
        this.blocks2 = [];
        for (let i = 0; i < this.row; i++) {
          let temp2 = [];
          for (let j = 0; j < this.col; j++) {
            temp2.push(0);
          }
          this.blocks2.push(temp2);
        }
      },
      refreshBlocks3(){
        this.blocks3 = [[0,0,0],[0,0,0],[0,0,0]];
        for (let i = 0; i < this.row; i++) {
          for (let j = 0; j < this.col; j++) {
            if(this.blocks2[i][j]===1){
              this.blocks3[i][j] = 1 - this.blocks3[i][j];
              if(i>0) this.blocks3[i-1][j] = 1 - this.blocks3[i-1][j];
              if(i<this.row-1) this.blocks3[i+1][j] = 1 - this.blocks3[i+1][j];
              if(j>0) this.blocks3[i][j-1] = 1 - this.blocks3[i][j-1];
              if(j<this.col-1) this.blocks3[i][j+1] = 1 - this.blocks3[i][j+1];
            }
          }
        }
      },
      initBtn(){
        this.initBlocks();
        this.initBlocks2();
        this.refreshBlocks3();
      },
      clickCell(i, j){
        this.blocks[i][j].light = 1 - this.blocks[i][j].light;
      },
      getAns(){
        for (let i1 = 0; i1 < 2; i1++) {
          for (let i2 = 0; i2 < 2; i2++) {
            for (let i3 = 0; i3 < 2; i3++) {
              this.initBlocks2();
              this.blocks2[0][0] = i1;
              this.blocks2[0][1] = i2;
              this.blocks2[0][2] = i3;
              this.refreshBlocks3();
              for (let i = 1; i < this.row; i++) {
                for (let j = 0; j < this.col; j++) {
                  this.blocks2[i][j] = (this.blocks[i-1][j].light === this.blocks3[i-1][j] ? 0 : 1);
                }
                this.refreshBlocks3();
              }
              let flag = true;
              for (let j = 0; j < this.col; j++) {
                if(this.blocks[this.row-1][j].light !== this.blocks3[this.row-1][j]){
                  flag = false;
                  break;
                }
              }
              if(flag){
                for (let i = 0; i < this.row; i++) {
                  for (let j = 0; j < this.col; j++) {
                    this.blocks[i][j].answer = this.blocks2[i][j];
                  }
                }
                return;
              }
            }
          }
        }
        alert("无解");
      }
    }
  }
</script>
