<template>
  <div id="content">
    <div class="colorBoard">
      <div :class="'block'+(item.selected?' selected':'')"
           :style="'background-color: rgb(' + item.r + ',' + item.g + ',' + item.b + ');'"
           v-for="(item, index) in blocks" :key="index" v-if="index<=20" @click="click(index)"></div>
    </div>
    <div class="field">
      <div :class="'block'+(item.selected?' selected':'')"
           :style="'background-color: rgb(' + item.r + ',' + item.g + ',' + item.b + ');'"
           v-for="(item, index) in blocks" :key="index" v-if="index>20" @click="click(index)"></div>
    </div>
    <div style="height: 40px; line-height: 40px">
      <span>step: {{step}}</span>
      <el-button style="margin-left: 20px" v-if="canRestart" type="primary" @click="start()">Restart</el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
  #content {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;
    .colorBoard{
      width: 560px;
      margin-bottom: 80px;
      display: flex;
      flex-flow: row wrap;
    }
    .field{
      width: 400px;
      margin-bottom: 40px;
      display: flex;
      flex-flow: row wrap;
    }
    .block{
      width: 80px;
      height: 80px;
      box-sizing: border-box;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: default;
    }
    .selected{
      border: 3px solid rgba(0,0,0,.75);
    }
  }
</style>

<script>
  export default {
    name: 'color',
    data () {
      return {
        blocks: [],
        selected: false,
        selectedIndex: 0,
        step: 0,
        canRestart: false,
      }
    },
    mounted: function(){
      this.start();
    },
    methods: {
      start(){
        //初始化
        this.blocks = [];
        for(let i=0;i<21+25;i++){
          this.blocks.push({
            temp: i,
            correctIndex: i,
            selected: false,
            r: 255,
            g: 255,
            b: 255,
          });
        }
        this.selected = false;
        this.selectedIndex = 0;
        this.step = 0;
        this.canRestart = false;

        //生成四角颜色
        //21  25
        //41  45
        let r, g, b, rDiff, gDiff, bDiff;
        do{
          this.generateRandomColor(21);
          this.generateRandomColor(25);
          this.generateRandomColor(41);
          r = this.blocks[25].r + this.blocks[41].r - this.blocks[21].r;
          g = this.blocks[25].g + this.blocks[41].g - this.blocks[21].g;
          b = this.blocks[25].b + this.blocks[41].b - this.blocks[21].b;
        } while (r<0 || r>255 || g<0 || g>255 || b<0 || b>255);
        this.setColor(45, r, g, b);

        //补全第一列颜色
        //21 26 31 36 41
        rDiff = this.blocks[41].r - this.blocks[21].r;
        gDiff = this.blocks[41].g - this.blocks[21].g;
        bDiff = this.blocks[41].b - this.blocks[21].b;
        r = this.blocks[21].r;
        g = this.blocks[21].g;
        b = this.blocks[21].b;
        this.setColor(26, r+rDiff/4*1, g+gDiff/4*1, b+bDiff/4*1);
        this.setColor(31, r+rDiff/4*2, g+gDiff/4*2, b+bDiff/4*2);
        this.setColor(36, r+rDiff/4*3, g+gDiff/4*3, b+bDiff/4*3);

        //横向补全
        rDiff = this.blocks[25].r - this.blocks[21].r;
        gDiff = this.blocks[25].g - this.blocks[21].g;
        bDiff = this.blocks[25].b - this.blocks[21].b;
        for(let startIndex=21;startIndex<=41;startIndex+=5){
          r = this.blocks[startIndex].r;
          g = this.blocks[startIndex].g;
          b = this.blocks[startIndex].b;
          for(let i=1;i<=4;i++){
            this.setColor(startIndex+i, r+rDiff/4*i, g+gDiff/4*i, b+bDiff/4*i);
          }
        }

        //移上去
        let tempIndex = 0;
        for(let i=22;i<=44;i++){
          if(i==25 || i==41) continue;
          this.swap(i, tempIndex);
          tempIndex++;
        }

        //洗牌0~20
        for(let i=0;i<=20;i++){
          let temp = Math.floor(21*Math.random());
          this.swap(i, temp);
        }
      },
      generateRandomColor(index){
        this.setColor(index, Math.floor(256*Math.random()), Math.floor(256*Math.random()), Math.floor(256*Math.random()));
      },
      setColor(index, r, g, b){
        this.blocks[index].r = r;
        this.blocks[index].g = g;
        this.blocks[index].b = b;
      },
      click(index){
        if(index==21 || index==25 || index==41 || index==45)
          return;
        if(this.canRestart)
          return;
        if(this.selected){
          //已有选择
          if(!this.blocks[index].selected){
            //交换
            this.swap(index, this.selectedIndex);
            this.step++;
            if(this.isWin()){
              this.$alert("U win for " + this.step + " steps");
            }
          }
          this.blocks[index].selected = false;
          this.selected = false;
          this.selectedIndex = 0;
        } else {
          //未选择
          if(this.blocks[index].correctIndex>20){
            this.blocks[index].selected = true;
            this.selected = true;
            this.selectedIndex = index;
          }
        }
      },
      swap(index1, index2){
        let temp = this.blocks[index1];
        this.blocks.splice(index1, 1, this.blocks[index2]);
        this.blocks.splice(index2, 1, temp);
      },
      isWin(){
        for(let i=21;i<=45;i++){
          if(this.blocks[i].correctIndex != i){
            return false;
          }
        }
        this.canRestart = true;
        return true;
      }
    }
  }
</script>
