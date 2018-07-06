<template>
  <div id="content">
    <div id="minefield">
      <div class="block" v-for="item in blocks" :key="item.index" :index="item.index" @click="click(item.index, item.row, item.col)">
        <div class="innerBlock closeBlock" v-if="!item.open"></div>
        <div class="innerBlock mineBlock" v-else-if="item.mine==1">×</div>
        <div class="innerBlock" v-else>{{item.number==0 ? '' : item.number}}</div>
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
    justify-content: space-around;
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
        .closeBlock{
          background-color: #ccc;
        }
        .mineBlock{
          color: red;
          font-size: 40px;
          line-height: 32px;
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
          width: 10,
          height: 10,
          mines: 10
        },
        blocks: []
      }
    },
    created: function(){

    },
    mounted: function () {
      let that = this;

      //点击事件
      // $("#minefield").on("click", ".block", function () {
      //   let index = $(this).attr("index");
      //   //console.log(that.blocks[index]);
      // });

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
            open: true
          });
        }
      }

      this.$nextTick(() => {
        $(".block").css("width", this.config.blockSize + "px")
          .css("height", this.config.blockSize + "px")
          .css("line-height", this.config.blockSize + "px");
      });

      //布雷
      for(let i=0;i<this.config.mines;i++){
        let index = 0;
        do{
          index = Math.floor(Math.random()*this.config.width*this.config.height);
        } while (this.blocks[index].mine==1);
        this.blocks[index].mine = 1;
      }

      //计算number
      for(let i in this.blocks){
        if(this.blocks[i].mine==0){
          let index = parseInt(i);
          this.blocks[index].number += some(index-1)
            + some(index+1)
            + some(index-this.config.width-1)
            + some(index-this.config.width)
            + some(index-this.config.width+1)
            + some(index+this.config.width-1)
            + some(index+this.config.width)
            + some(index+this.config.width+1);
        }

        function some(index) {
          if(index < 0 || index > that.config.width * that.config.height -1)
            return 0;
          return that.blocks[index].mine;
        }
      }
    },
    methods: {
      click(index, row, col){
        // console.log(index, row, col);
        if(!this.blocks[index].open){
          if(this.blocks[index].mine==1){
            //如果是雷，游戏结束
            alert("GG");
          } else {
            //如果不是雷，执行open
            this.open(index);
            if(this.isWin()){
              this.$nextTick(() => {
                alert("u win! ");
              });
            }
          }
        }
      },
      open(index){
        if(index < 0 || index > this.config.width * this.config.height -1)
          return;
        if(this.blocks[index].open)
          return;
        this.blocks[index].open = true;
        if(this.blocks[index].number==0){
          this.open(index-1);
          this.open(index+1);
          this.open(index-this.config.width-1);
          this.open(index-this.config.width);
          this.open(index-this.config.width+1);
          this.open(index+this.config.width-1);
          this.open(index+this.config.width);
          this.open(index+this.config.width+1);
        }
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
      }
    }
  }
</script>
