<template>
  <div id="content">
    <div id="minefield">
      <div class="block" v-for="item in blocks" :key="item.index" :index="item.index"
           @click.left="click(item.index, item.row, item.col)"
           @click.right="flag(item.index, item.row, item.col)">
        <div class="innerBlock flagBlock" v-if="item.flag"><i class="el-icon-location-outline"></i></div>
        <div class="innerBlock closeBlock" v-else-if="!item.open"></div>
        <div class="innerBlock mineBlock" v-else-if="item.mine==1"><i class="el-icon-close"></i></div>
        <div class="innerBlock" v-else>{{item.number==0 ? '' : item.number}}</div>
      </div>
    </div>
    <div>{{flagNumber}} / {{config.mines}}</div>
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
    #minefield{
      border-bottom: 1px solid black;
      border-right: 1px solid black;
      display: flex;
      flex-flow: row wrap;
      .block{
        text-align: center;
        border-top: 1px solid black;
        border-left: 1px solid black;
        box-sizing: border-box;
        cursor: default;
        .innerBlock{
          width: 100%;
          height: 100%;
          font-size: 20px;
        }
        .flagBlock{
          background-color: #ccc;
        }
        .closeBlock{
          background-color: #ccc;
        }
        .mineBlock{
          color: red;
        }
      }
    }
  }
</style>

<script>
  export default {
    name: 'minesweeper',
    data () {
      return {
        config: {
          blockSize: 40,
          width: 20,
          height: 20,
          mines: 60
        },
        blocks: [],
        isGenerate: false,
        flagNumber: 0,
      }
    },
    created: function(){
      document.oncontextmenu = function(){
        event.returnValue = false;
      };
    },
    mounted: function () {
      let that = this;

      //调整雷区的宽高
      $("#minefield").css("width", this.config.width * this.config.blockSize + "px")
        .css("height", this.config.height * this.config.blockSize + "px");

      //生成blocks
      this.blocks = [];
      for(let i=0;i<this.config.height;i++){
        for(let j=0;j<this.config.width;j++){
          this.blocks.push({
            index: i*this.config.width+j,
            row: i,
            col: j,
            mine: 0,
            number: 0,
            open: false,
            flag: false,
          });
        }
      }

      this.$nextTick(() => {
        $(".block").css("width", this.config.blockSize + "px")
          .css("height", this.config.blockSize + "px")
          .css("line-height", this.config.blockSize + "px");
      });

      //this.generate();
    },
    methods: {
      generate(safeIndex){
        let that = this;
        do{
          //清空雷区
          this.blocks = [];
          for(let i=0;i<this.config.height;i++){
            for(let j=0;j<this.config.width;j++){
              this.blocks.push({
                index: i*this.config.width+j,
                row: i,
                col: j,
                mine: 0,
                number: 0,
                open: false,
                flag: false,
              });
            }
          }

          //布雷
          for(let i=0;i<this.config.mines;i++){
            let index = 0;
            do{
              index = Math.floor(Math.random()*this.config.width*this.config.height);
            } while (this.blocks[index].mine==1);
            this.blocks[index].mine = 1;
          }

          //计算number
          for(let i=0;i<this.config.height;i++){
            for(let j=0;j<this.config.width;j++){
              let index = i*this.config.width+j;
              if(this.blocks[index].mine==0){
                this.blocks[index].number +=
                  some(i, j-1)
                  + some(i, j+1)
                  + some(i-1, j-1)
                  + some(i-1, j)
                  + some(i-1, j+1)
                  + some(i+1, j-1)
                  + some(i+1, j)
                  + some(i+1, j+1);
              }
            }
            function some(i, j) {
              if(i < 0 || i > that.config.height -1) return 0;
              if(j < 0 || j > that.config.width -1) return 0;
              // if(index < 0 || index > that.config.width * that.config.height -1) return 0;
              return that.blocks[i*that.config.width+j].mine;
            }
          }
        } while(this.blocks[safeIndex].number!=0 || this.blocks[safeIndex].mine!=0);
      },
      click(index, row, col){
        if(!this.isGenerate){
          //第一次点击，再布雷，保证第一次点开是0
          this.generate(index);
          this.isGenerate = true;
          this.click(index, row, col);
        } else {
          if(!this.blocks[index].flag){
            if(!this.blocks[index].open){
              //如果没打开，则打开
              if(this.blocks[index].mine==1){
                //如果是雷，游戏结束
                this.$alert("GG");
              } else {
                //如果不是雷，执行open
                this.open(row, col);
                if(this.isWin()){
                  this.$alert("u win! ");
                }
              }
            } else {
              //如果已经打开，执行快速打开
              this.quickOpen(row, col);
            }
          }
        }
      },
      open(i, j){
        let index = i*this.config.width+j;
        if(i < 0 || i > this.config.height -1) return 0;
        if(j < 0 || j > this.config.width -1) return 0;
        // if(index < 0 || index > this.config.width * this.config.height -1)
        //   return;
        if(this.blocks[index].open)
          return;
        this.blocks[index].open = true;
        if(this.blocks[index].number==0){
          this.open(i, j-1);
          this.open(i, j+1);
          this.open(i-1, j-1);
          this.open(i-1, j);
          this.open(i-1, j+1);
          this.open(i+1, j-1);
          this.open(i+1, j);
          this.open(i+1, j+1);
        }
      },
      quickOpen(i, j){
        
      },
      isWin(){
        let result = true;
        for(let index in this.blocks){
          if(this.blocks[index].mine==0 && !this.blocks[index].open){
            result = false;
            break;
          }
        }
        return result;
      },
      flag(index, row, col){
        if(this.isGenerate && !this.blocks[index].open){
          this.flagNumber += this.blocks[index].flag ? -1 : 1;
          this.blocks[index].flag = !this.blocks[index].flag;
        }
      }
    }
  }
</script>
