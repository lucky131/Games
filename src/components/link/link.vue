<template>
  <div id="content">
    <div id="board">
      <div class="blockRow" v-for="row in blocks" :key="row[0].row">
        <div :style="{
          backgroundColor: config.colors[item.color],
          borderWidth: item.color==0 ? '0' : '5px'
        }" class="block" v-for="item in row" :key="item.col" @click="click(item.row, item.col)">
          <i v-if="item.selected" class="el-icon-star-on"></i>
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
      <el-form label-width="80px">
        <el-form-item label="格子大小">
          <el-input-number v-model="config.blockSize" :min="30" :step="5"></el-input-number>
        </el-form-item>
        <el-form-item label="宽">
          <el-input-number v-model="config.width" :min="4" :step="2"></el-input-number>
        </el-form-item>
        <el-form-item label="高">
          <el-input-number v-model="config.height" :min="4" :step="2"></el-input-number>
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
      border: 1px solid black;
      .blockRow{
        width: 100%;
        overflow: hidden;
        .block{
          border-radius: 0px;
          border-top-color: rgba(255,2555,255,.66);
          border-left-color: rgba(255,2555,255,.33);
          border-bottom-color: rgba(0,0,0,.5);
          border-right-color: rgba(0,0,0,.25);
          border-style: solid;
          box-sizing: border-box;
          float: left;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 24px;
          color: rgba(0,0,0,.66);
        }
      }
    }
  }
</style>

<script>
  export default {
    name: "linkingGame",
    data(){
      return{
        falseData: false,
        isDialogShow: true,
        config: {
          blockSize: 50,
          width: 8,
          height: 8,
          colors: [
            "#ffffff",
            "#ff5353",
            "#ffa23b",
            "#fff957",
            "#b5ff61",
            "#68ffaf",
            "#76cdff",
            "#7c59ff",
            "#f595ff",
            "#aeaeae",
            "#525252",
          ]
        },
        blocks: [],
        selected: false,
        selectedRow: 0,
        selectedCol: 0,
        startTime: null,
      }
    },
    mounted: function () {

    },
    methods: {
      start(){
        this.isDialogShow = false;
        this.startTime = new Date();

        //初始化棋盘
        $("#board").css("width", (this.config.width+2) * this.config.blockSize)
          .css("height", (this.config.height+2) * this.config.blockSize);

        //生成blocks
        this.blocks = [];
        for(let i=0;i<this.config.height+2;i++){
          this.blocks.push([]);
          for(let j=0;j<this.config.width+2;j++){
            this.blocks[i].push({
              row: i,
              col: j,
              color: 0,
              selected: false
            });
          }
        }

        this.$nextTick(() => {
          $(".block").css("width", this.config.blockSize)
            .css("height", this.config.blockSize);
        });

        //生成颜色 22一组 保证偶数
        let tempColor = 0, flag = true;
        for(let i=1;i<=this.config.height;i++){
          for(let j=1;j<=this.config.width;j++){
            if(flag){
              tempColor = Math.floor(Math.random()*(this.config.colors.length-1))+1;
              flag = false;
            } else {
              flag = true;
            }
            this.blocks[i][j].color = tempColor;
          }
        }

        //打乱
        for(let i=1;i<=this.config.height;i++){
          for(let j=1;j<=this.config.width;j++){
            let randH = Math.floor(Math.random()*this.config.height)+1;
            let randW = Math.floor(Math.random()*this.config.width)+1;
            let temp = this.blocks[i][j].color;
            this.blocks[i][j].color = this.blocks[randH][randW].color;
            this.blocks[randH][randW].color = temp;
          }
        }
      },
      click(row, col){
        if(this.selected){
          if(this.blocks[row][col].color==0 || (row==this.selectedRow && col==this.selectedCol)){
            //取消选择
            this.blocks[this.selectedRow][this.selectedCol].selected = false;
            this.selected = false;
          } else {
            if(this.blocks[row][col].color == this.blocks[this.selectedRow][this.selectedCol].color){
              //判断是否可连
              if(this.canLink(row, col, this.selectedRow, this.selectedCol)){
                //可怜的娃
                this.blocks[row][col].color = 0;
                this.blocks[this.selectedRow][this.selectedCol].color = 0;
                this.blocks[this.selectedRow][this.selectedCol].selected = false;
                this.selected = false;
                this.$nextTick(() => {
                  if(this.isWin()){
                    let endTime = new Date();
                    let diff = (endTime.getTime() - this.startTime.getTime()) / 1000;
                    this.$alert("Win! Time: " + diff + " s", {
                      callback: () => {
                        this.isDialogShow = true;
                      }
                    });
                  }
                })
              } else {
                //不可连，直接选第二个
                this.blocks[this.selectedRow][this.selectedCol].selected = false;
                this.blocks[row][col].selected = true;
                this.selectedRow = row;
                this.selectedCol = col;
              }
            } else {
              //颜色不一样，直接选第二个
              this.blocks[this.selectedRow][this.selectedCol].selected = false;
              this.blocks[row][col].selected = true;
              this.selectedRow = row;
              this.selectedCol = col;
            }
          }
        } else {
          if(row>=1 && row<=this.config.height && col>=1 && col<=this.config.width && this.blocks[row][col].color!=0){
            //直接选中
            this.blocks[row][col].selected = true;
            this.selected = true;
            this.selectedRow = row;
            this.selectedCol = col;
          }
        }
      },
      canLink(r1, c1, r2, c2){
        if(this.canLinkBy1(r1, c1, r2, c2)) return true;
        if(this.canLinkBy2(r1, c1, r2, c2)) return true;
        if(this.canLinkBy3(r1, c1, r2, c2)) return true;
        return false;
      },
      canLinkBy1(r1, c1, r2, c2){
        let min=0, max=0, total=0;
        //只有在一条直线上才能满足1线
        if(r1==r2){
          min = Math.min(c1, c2);
          max = Math.max(c1, c2);
          for(let i=min+1;i<=max-1;i++){
            total += this.blocks[r1][i].color;
          }
          return total==0;
        } else if(c1==c2){
          min = Math.min(r1, r2);
          max = Math.max(r1, r2);
          for(let i=min+1;i<=max-1;i++){
            total += this.blocks[i][c1].color;
          }
          return total==0;
        } else return false;
      },
      canLinkBy2(r1, c1, r2, c2){
        if(this.blocks[r1][c2].color==0){
          if(this.canLinkBy1(r1,c1,r1,c2) && this.canLinkBy1(r1,c2,r2,c2))
            return true;
        }
        if(this.blocks[r2][c1].color==0){
          if(this.canLinkBy1(r1,c1,r2,c1) && this.canLinkBy1(r2,c1,r2,c2))
            return true;
        }
        return false;
      },
      canLinkBy3(r1, c1, r2, c2){
        for(let i=0;i<this.config.height+2;i++){
          for(let j=0;j<this.config.width+2;j++){
            if(this.blocks[i][j].color==0){
              if(this.canLinkBy1(r1,c1,i,j) && this.canLinkBy2(i,j,r2,c2))
                return true;
            }
          }
        }
        return false;
      },
      isWin(){
        for(let i=1;i<=this.config.height;i++){
          for(let j=1;j<=this.config.width;j++){
            if(this.blocks[i][j].color!=0)
              return false;
          }
        }
        return true;
      }
    }
  }
</script>
