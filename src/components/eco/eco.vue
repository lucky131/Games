<template>
  <div class="wrap">
    <div v-show="!isDialogShow" class="board">
      <div class="ope">
        <el-form label-width="60px">
          <el-form-item label="x">
            <el-input size="small" v-model="showData.x" :readonly="true"></el-input>
          </el-form-item>
          <el-form-item label="y">
            <el-input size="small" v-model="showData.y" :readonly="true"></el-input>
          </el-form-item>
          <el-form-item label="海拔">
            <el-input size="small" v-model="showData.altitude" :readonly="true"></el-input>
          </el-form-item>
          <el-form-item label="坡度">
            <el-input size="small" v-model="showData.slope" :readonly="true"></el-input>
          </el-form-item>
          <el-form-item label="地上水">
            <el-input size="small" v-model="showData.overgroundWater" :readonly="true"></el-input>
          </el-form-item>
          <el-form-item label="地下水">
            <el-input size="small" v-model="showData.undergroundWater" :readonly="true"></el-input>
          </el-form-item>
          <el-form-item label="植被">
            <el-input size="small" v-model="showData.vegetation" :readonly="true"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <canvas id="c1" @mousemove="mousemove" @mouseout="mouseout"></canvas>
      <div class="ope">
        <el-form label-width="100px">
          <el-form-item label="陆地等高距">
            <el-input-number size="small" v-model="config.contourDistanceOfLand" :min="1" @change="renderMap()"></el-input-number>
          </el-form-item>
          <el-form-item label="海洋等高距">
            <el-input-number size="small" v-model="config.contourDistanceOfOcean" :min="1" @change="renderMap()"></el-input-number>
          </el-form-item>
          <el-form-item label="植被等高距">
            <el-input-number size="small" v-model="config.contourDistanceOfVegetation" :min="1" @change="renderMap()"></el-input-number>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div class="btns">
      <el-button type="primary" @click="isDialogShow=true">重开</el-button>
      <el-button type="primary" @click="start()">重绘</el-button>
      <el-button type="primary" @click="seedingBtn()">传播</el-button>
      <el-button type="primary" @click="windingBtn()">风</el-button>
    </div>

    <el-dialog
      title="新游戏"
      center
      :visible.sync="isDialogShow"
      width="360px"
      :show-close="falseData"
      :close-on-click-modal="falseData"
      :close-on-press-escape="falseData">
      <el-form label-width="100px">
        <el-form-item label="地图大小">
          <el-input-number v-model="config.mapSize" :min="10" :max="500" :step="10"></el-input-number>
        </el-form-item>
        <el-form-item label="格子像素">
          <el-input-number v-model="config.blockPix" :min="1" :max="10" :step="1"></el-input-number>
        </el-form-item>
        <el-form-item label="海平面">
          <el-input-number v-model="config.seaLevel" :min="0" :max="100" :step="5"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="">
        <el-button type="primary" @click="start()">开始</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
  .wrap{
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    .board{
      display: flex;
      flex-flow: row nowrap;
      justify-content: center;
      align-items: center;
      .ope{
        width: 300px;
        height: 100%;
        padding: 20px;
        box-sizing: border-box;
        background-color: #ddd;
        .el-form-item{
          margin-bottom: 0;
        }
      }
    }
    .btns{
      margin-top: 20px;
    }
  }
</style>

<script>
  import utils from "./util.js"
  export default {
    name: "eco",
    data(){
      return{
        isDialogShow: true,
        falseData: false,
        config: {
          mapSize: 100,
          blockPix: 6,
          seaLevel: 40,
          maxHeight: 0,
          contourDistanceOfLand: 16,
          contourDistanceOfOcean: 4,
          contourDistanceOfVegetation: 4,
        },
        showData: {
          i: "",
          j: "",
          altitude: "",
          slope: "",
          overgroundWater: "",
          undergroundWater: "",
          vegetation: "",
        },
        map: [],
      }
    },
    mixins: [utils],
    mounted(){

    },
    methods: {
      start(){
        this.isDialogShow = false;

        //初始化dom大小
        let domHeight = this.config.mapSize * this.config.blockPix;
        $("#c1").attr("width", domHeight).attr("height", domHeight);
        $(".board").css("height", domHeight);

        this.initMap();
        this.renderMap();
      },
      initMap(){
        //初始化数组
        this.map = new Array(this.config.mapSize);
        for(let i=0;i<this.config.mapSize;i++){
          this.map[i] = new Array(this.config.mapSize);
          for(let j=0;j<this.config.mapSize;j++){
            this.map[i][j] = {
              i: i,
              j: j,
              altitude: 0,
              slope: 0,
              overgroundWater: 0,
              undergroundWater: 0,
              vegetation: 0,
            };
          }
        }

        //----生成地形
        //大山
        this.createMountain(this.config.mapSize/4,this.config.mapSize/4*2,80,160,this.config.mapSize/6,this.config.mapSize/8,3,2,1);
        //小山
        this.createMountain(this.config.mapSize/6,this.config.mapSize/6*4,30,30,this.config.mapSize/6,this.config.mapSize/6,1,1,6);
        //凹凸
        this.createMountain(0,this.config.mapSize,5,20,5,15,0,0,30);
        this.createMountain(0,this.config.mapSize,20,30,10,5,0,0,10);
        //大陆板块
        this.createMountain(this.config.mapSize/8,this.config.mapSize/8*6,16,16,this.config.mapSize/3,this.config.mapSize/3,1,0,5);

        //陆地波动
        this.waveGround();

        //平整陆地
        this.smoothLand();

        //设置最大高度
        for(let i=0;i<this.config.mapSize;i++){
          for(let j=0;j<this.config.mapSize;j++){
            this.config.maxHeight = Math.max(this.config.maxHeight, this.map[i][j].altitude);
          }
        }

        //设置坡度
        for(let i=0;i<this.config.mapSize;i++){
          for(let j=0;j<this.config.mapSize;j++){
            this.map[i][j].slope=(this.highestPos(i,j,1).altitude-this.lowestPos(i,j,1).altitude)/2;
          }
        }

        //----生成水分
        //根据海平面高度填充地上水，无需地下水
        for(let i=0;i<this.config.mapSize;i++){
          for(let j=0;j<this.config.mapSize;j++){
            this.map[i][j].overgroundWater=Math.max(this.config.seaLevel-this.map[i][j].altitude,0);
          }
        }

        //生成河流
        this.createRiver(this.config.mapSize/10,6);
        this.createRiver(this.config.mapSize/2,3);
        this.createRiver(this.config.mapSize/2,3);

        //平整河水
        this.smoothOvergroundWater(1);
        this.smoothOvergroundWater(3);

        //生成地下水
        for(let i=0;i<this.config.mapSize;i++){
          for(let j=0;j<this.config.mapSize;j++){
            if(this.map[i][j].overgroundWater>0){
              let range = this.map[i][j].altitude/5 + this.map[i][j].overgroundWater/10;
              this.changeUndergroundWater(i-range,j-range,i+range,j+range,Math.log(this.map[i][j].overgroundWater/50+1));
            }
          }
        }

        //----生成植被
        //生成植被
        this.createVegetation();

        //平整植被
        this.smoothVegetation(1);

      },
      renderMap(){
        let ctx = document.getElementById("c1").getContext("2d");
        for(let i=0;i<this.config.mapSize;i++){
          for(let j=0;j<this.config.mapSize;j++){
            let rgb = null;
            let rgbGround=this.linearColorRGB(this.config.seaLevel,240,219,130, 350,74,47,0, this.map[i][j].altitude,this.config.contourDistanceOfLand);
            if(this.map[i][j].overgroundWater>5){
              //深水
              rgb=this.linearColorRGB(this.config.seaLevel,0,0,60, 5,120,223,233, this.map[i][j].overgroundWater,this.config.contourDistanceOfOcean);
              ctx.fillStyle="rgb("+rgb.r+","+rgb.g+","+rgb.b+")";
            } else if(this.map[i][j].vegetation>0){
              //植被
              let rgbVege=this.linearColorRGB(0,1,125,10, 200,78,60,16, this.map[i][j].altitude);
              rgb=this.linearColorRGB(25,rgbVege.r,rgbVege.g,rgbVege.b, 0,rgbGround.r,rgbGround.g,rgbGround.b, this.map[i][j].vegetation,this.config.contourDistanceOfVegetation);
              ctx.fillStyle="rgb("+rgb.r+","+rgb.g+","+rgb.b+")";
            } else if(this.map[i][j].overgroundWater>0){
              //浅水
              rgb=this.linearColorRGB(5,120,223,233, 0,rgbGround.r,rgbGround.g,rgbGround.b, this.map[i][j].overgroundWater, 1); //等高距默认1
              ctx.fillStyle="rgb("+rgb.r+","+rgb.g+","+rgb.b+")";
            } else {
              //陆地
              rgb = rgbGround;
              ctx.fillStyle="rgb("+rgb.r+","+rgb.g+","+rgb.b+")";
            }
            ctx.fillRect(i*this.config.blockPix,j*this.config.blockPix,this.config.blockPix,this.config.blockPix);
          }
        }
      },
      mousemove(e){
        let i = Math.floor(e.offsetX/this.config.blockPix);
        let j = Math.floor(e.offsetY/this.config.blockPix);
        i=Math.max(0,Math.min(this.config.mapSize-1,i));
        j=Math.max(0,Math.min(this.config.mapSize-1,j));
        this.showData.x = i;
        this.showData.y = j;
        this.showData.altitude = this.map[i][j].altitude;
        this.showData.slope = this.map[i][j].slope;
        this.showData.overgroundWater = this.map[i][j].overgroundWater;
        this.showData.undergroundWater = this.map[i][j].undergroundWater;
        this.showData.vegetation = this.map[i][j].vegetation;
      },
      mouseout(e){
        this.showData.x = "";
        this.showData.y = "";
        this.showData.altitude = "";
        this.showData.slope = "";
        this.showData.overgroundWater = "";
        this.showData.undergroundWater = "";
        this.showData.vegetation = "";
      },
      changeAltitude(beginX, beginY, endX, endY, value) {
        beginX = Math.max(Math.floor(beginX),0);
        beginY = Math.max(Math.floor(beginY),0);
        endX = Math.min(Math.floor(endX), this.config.mapSize-1);
        endY = Math.min(Math.floor(endY), this.config.mapSize-1);
        for(let i=beginX;i<=endX;i++)
          for(let j=beginY;j<=endY;j++)
            this.map[i][j].altitude+=value;
      },
      changeUndergroundWater(beginX, beginY, endX, endY, value) {
        beginX = Math.max(Math.floor(beginX),0);
        beginY = Math.max(Math.floor(beginY),0);
        endX = Math.min(Math.floor(endX), this.config.mapSize-1);
        endY = Math.min(Math.floor(endY), this.config.mapSize-1);
        for(let i=beginX;i<=endX;i++)
          for(let j=beginY;j<=endY;j++)
            this.map[i][j].undergroundWater+=value;
      },
      changeOvergroundWater(beginX, beginY, endX, endY, value) {
        beginX = Math.max(Math.floor(beginX),0);
        beginY = Math.max(Math.floor(beginY),0);
        endX = Math.min(Math.floor(endX), this.config.mapSize-1);
        endY = Math.min(Math.floor(endY), this.config.mapSize-1);
        for(let i=beginX;i<=endX;i++)
          for(let j=beginY;j<=endY;j++)
            this.map[i][j].overgroundWater+=value;
      },
      changeVegetation(beginX, beginY, endX, endY, value) {
        beginX = Math.max(Math.floor(beginX),0);
        beginY = Math.max(Math.floor(beginY),0);
        endX = Math.min(Math.floor(endX), this.config.mapSize-1);
        endY = Math.min(Math.floor(endY), this.config.mapSize-1);
        for(let i=beginX;i<=endX;i++)
          for(let j=beginY;j<=endY;j++)
            this.map[i][j].vegetation+=value;
      },
      createMountain(minPos, posLen, minHei, heiLen, minRan, ranLen, ridgeNum, valleyNum, number){
        for(let i=0;i<number;i++)
          this.createMountainCore(minPos, posLen, minHei, heiLen, minRan, ranLen, ridgeNum, valleyNum);
      },
      createMountainCore(minPos, posLen, minHei, heiLen, minRan, ranLen, ridgeNum, valleyNum) {
        let x = minPos+Math.floor(Math.random()*posLen),
          y = minPos+Math.floor(Math.random()*posLen),
          height = minHei+Math.random()*heiLen,
          range = minRan+Math.floor(Math.random()*ranLen);
        for(let i=0;i<this.config.mapSize;i++){
          for(let j=0;j<this.config.mapSize;j++){
            let distance = Math.sqrt((x-i)*(x-i)+(y-j)*(y-j));
            if(distance<=range)
              this.map[i][j].altitude+=(Math.cos(distance*Math.PI/range)+1)*height/2;
            if(distance<=range*4/3)
              this.map[i][j].altitude+=Math.random()*height/40;
          }
        }
        //山脊
        for(let n=0;n<ridgeNum;n++){
          let vectorX = Math.random()-0.5, vectorY = Math.random()-0.5;
          for(let i=0;i<this.config.mapSize;i++){
            for(let j=0;j<this.config.mapSize;j++){
              let distance = Math.sqrt((i-x)*(i-x)+(j-y)*(j-y));
              let directionX = i-x, directionY = j-y;
              let cos = this.cosOfTwoVector(directionX,directionY,vectorX,vectorY);
              if(distance<=range*0.8 && cos>0.9995) {
                let tempX = i+(2*Math.random()-1)*distance/8;
                let tempY = j+(2*Math.random()-1)*distance/8;
                this.changeAltitude(tempX-distance/10,
                  tempY-distance/10,
                  tempX+distance/10,
                  tempY+distance/10,
                  1-1/(distance+1));
              }
            }
          }
        }
        //山谷
        for(let n=0;n<valleyNum;n++){
          let vectorX = Math.random()-0.5, vectorY = Math.random()-0.5;
          for(let i=0;i<this.config.mapSize;i++){
            for(let j=0;j<this.config.mapSize;j++){
              let distance = Math.sqrt((i-x)*(i-x)+(j-y)*(j-y));
              let directionX = i-x, directionY = j-y;
              let cos = this.cosOfTwoVector(directionX,directionY,vectorX,vectorY);
              if(distance<=range*0.8 && cos>0.9995) {
                let tempX = i+(2*Math.random()-1)*distance/8;
                let tempY = j+(2*Math.random()-1)*distance/8;
                this.changeAltitude(tempX-distance/10,
                  tempY-distance/10,
                  tempX+distance/10,
                  tempY+distance/10,
                  -1+1/(distance+1));
              }
            }
          }
        }
      },
      createRiver(range, width) {
        let highestPos = this.highestPos(this.config.mapSize/2, this.config.mapSize/2, this.config.mapSize/2);
        let highestPosX = highestPos.x;
        let highestPosY = highestPos.y;
        // console.log("最高点：", highestPosX, highestPosY);
        let curX, curY;
        do{
          curX=highestPosX+Math.floor(Math.random()*range*2-range);
          curY=highestPosY+Math.floor(Math.random()*range*2-range);
          curX=Math.max(0,Math.min(this.config.mapSize-1,curX));
          curY=Math.max(0,Math.min(this.config.mapSize-1,curY));
          // console.log("河流生成点：", curX, curY);
        } while (this.map[curX][curY].overgroundWater > 0);
        // console.log("最终河流生成点：", curX, curY);
        while(curX>=0 && curY>=0 && curX<=this.config.mapSize-1 && curY<=this.config.mapSize-1 &&
        this.map[curX][curY].altitude>this.config.seaLevel && this.map[curX][curY].overgroundWater<15){
          this.changeOvergroundWater(curX-width/2,curY-width/2,curX+width/2,curY+width/2,width*10/(10+this.map[curX][curY].slope));
          let nextPos = this.lowestPos(curX,curY,width);
          if(nextPos.x==curX && nextPos.y==curY)
            break;
          curX=Math.floor((curX+nextPos.x)/2+Math.random()*width-width/2);
          curY=Math.floor((curY+nextPos.y)/2+Math.random()*width-width/2);
          //curX=nextPos.x+Math.floor(Math.random()*width-width/2);
          //curY=nextPos.y+Math.floor(Math.random()*width-width/2);
        }
      },
      createVegetation() {
        for(let i=0;i<this.config.mapSize;i++){
          for(let j=0;j<this.config.mapSize;j++){
            //植物生长条件：
            //基准值 1/5
            //地上水<1  y=-x+1  线性  0~1
            //地下水>0  y=5.41*ln(x+1)  对数  0~+∞
            //海拔高生成少  y=200/(x+200)  反比例  1~+0
            //随机数 0.9~1.1
            //概率  y=v/(v+4)  反比例  0~1
            if(this.canGrowVegetation(i, j)){
              let value= 1/5
                *(5*Math.log(this.map[i][j].undergroundWater+1))
                *(-1*this.map[i][j].overgroundWater+1)
                *(200/(this.map[i][j].altitude+200))
                *(Math.random()/5+0.9);
              let prob=value/(value+3);
              if(Math.random()<prob){
                let range=value;
                this.changeVegetation(i-range,j-range,i+range,j+range,value);
              }
            }
          }
        }
      },
      canGrowVegetation(i, j){
        return (this.map[i][j].overgroundWater<1 && this.map[i][j].undergroundWater>0);
      },
      highestPos(x,y,range) {
        let pos={}, max=-10086;
        let beginX=Math.max(0,x-range),
          beginY=Math.max(0,y-range),
          endX=Math.min(this.config.mapSize-1,x+range),
          endY=Math.min(this.config.mapSize-1,y+range);
        for(let i=beginX;i<=endX;i++)
          for(let j=beginY;j<=endY;j++)
            if(this.map[i][j].altitude>max){
              max=this.map[i][j].altitude;
              pos.x=i;
              pos.y=j;
              pos.altitude=max;
            }
        return pos;
      },
      lowestPos(x,y,range) {
        let pos={}, min=this.config.maxHeight;
        let beginX=Math.max(0,x-range),
          beginY=Math.max(0,y-range),
          endX=Math.min(this.config.mapSize-1,x+range),
          endY=Math.min(this.config.mapSize-1,y+range);
        for(let i=beginX;i<=endX;i++)
          for(let j=beginY;j<=endY;j++)
            if(this.map[i][j].altitude<min){
              min=this.map[i][j].altitude;
              pos.x=i;
              pos.y=j;
              pos.altitude=min;
            }
        return pos;
      },
      waveGround() {
        //1随机
        for(let i=0;i<this.config.mapSize;i++){
          for(let j=0;j<this.config.mapSize;j++){
            let random = Math.floor(Math.random()*10);
            this.map[i][j].altitude+=random;
          }
        }
        //2随机
        for(let i=0;i<this.config.mapSize;i+=2){
          for(let j=0;j<this.config.mapSize;j+=2){
            let random = Math.floor(Math.random()*6);
            this.changeAltitude(i,j,i+1,j+1,random);
          }
        }
        //4随机
        for(let i=0;i<this.config.mapSize;i+=4){
          for(let j=0;j<this.config.mapSize;j+=4){
            let random = Math.floor(Math.random()*2);
            this.changeAltitude(i,j,i+3,j+3,random);
          }
        }
      },
      smoothLand() {
        //默认range=1
        let map2 = new Array(this.config.mapSize);
        for(let i=0;i<this.config.mapSize;i++){
          map2[i] = new Array(this.config.mapSize);
          for(let j=0;j<this.config.mapSize;j++){
            map2[i][j]={};
            map2[i][j].altitude=this.map[i][j].altitude;
          }
        }
        for(let i=0;i<this.config.mapSize;i++){
          for(let j=0;j<this.config.mapSize;j++){
            if(i==0 && j==0)
              map2[i][j].altitude=(this.map[i][j].altitude+ this.map[i][j+1].altitude +
                this.map[i+1][j].altitude+ this.map[i+1][j+1].altitude)/4;
            else if(i==this.config.mapSize-1 && j==0)
              map2[i][j].altitude=(this.map[i-1][j].altitude + this.map[i-1][j+1].altitude +
                this.map[i][j].altitude+ this.map[i][j+1].altitude)/4;
            else if(i==0 && j==this.config.mapSize-1)
              map2[i][j].altitude=(this.map[i][j-1].altitude + this.map[i][j].altitude +
                this.map[i+1][j-1].altitude + this.map[i+1][j].altitude)/4;
            else if(i==this.config.mapSize-1 && j==this.config.mapSize-1)
              map2[i][j].altitude=(this.map[i-1][j-1].altitude + this.map[i-1][j].altitude +
                this.map[i][j-1].altitude + this.map[i][j].altitude)/4;
            else if(i==0)
              map2[i][j].altitude=(this.map[i][j-1].altitude + this.map[i][j].altitude+ this.map[i][j+1].altitude +
                this.map[i+1][j-1].altitude + this.map[i+1][j].altitude+ this.map[i+1][j+1].altitude)/6;
            else if(i==this.config.mapSize-1)
              map2[i][j].altitude=(this.map[i-1][j-1].altitude + this.map[i-1][j].altitude + this.map[i-1][j+1].altitude +
                this.map[i][j-1].altitude + this.map[i][j].altitude+ this.map[i][j+1].altitude)/6;
            else if(j==0)
              map2[i][j].altitude=(this.map[i-1][j].altitude + this.map[i-1][j+1].altitude +
                this.map[i][j].altitude+ this.map[i][j+1].altitude +
                this.map[i+1][j].altitude+ this.map[i+1][j+1].altitude)/6;
            else if(j==this.config.mapSize-1)
              map2[i][j].altitude=(this.map[i-1][j-1].altitude + this.map[i-1][j].altitude +
                this.map[i][j-1].altitude + this.map[i][j].altitude +
                this.map[i+1][j-1].altitude + this.map[i+1][j].altitude)/6;
            else map2[i][j].altitude=(this.map[i-1][j-1].altitude + this.map[i-1][j].altitude + this.map[i-1][j+1].altitude +
                this.map[i][j-1].altitude + this.map[i][j].altitude+ this.map[i][j+1].altitude +
                this.map[i+1][j-1].altitude + this.map[i+1][j].altitude+ this.map[i+1][j+1].altitude)/9;
          }
        }
        for(let i=0;i<this.config.mapSize;i++){
          for(let j=0;j<this.config.mapSize;j++){
            this.map[i][j].altitude=map2[i][j].altitude;
          }
        }
      },
      smoothOvergroundWater(range) {
        let map2 = new Array(this.config.mapSize);
        for(let i=0;i<this.config.mapSize;i++){
          map2[i] = new Array(this.config.mapSize);
          for(let j=0;j<this.config.mapSize;j++){
            map2[i][j]={};
            map2[i][j].overgroundWater=this.map[i][j].overgroundWater;
          }
        }
        for(let i=0;i<this.config.mapSize;i++){
          for(let j=0;j<this.config.mapSize;j++){
            if(this.map[i][j].altitude>this.config.seaLevel-range){
              let beginX=Math.max(0,i-range),beginY=Math.max(0,j-range),
                endX=Math.min(this.config.mapSize-1,i+range),endY=Math.min(this.config.mapSize-1,j+range);
              let total=0;
              for(let ii=beginX;ii<=endX;ii++)
                for(let jj=beginY;jj<=endY;jj++)
                  total+=this.map[ii][jj].overgroundWater;
              map2[i][j].overgroundWater=total/(range+range+1)/(range+range+1);
            }
          }
        }
        for(let i=0;i<this.config.mapSize;i++){
          for(let j=0;j<this.config.mapSize;j++){
            this.map[i][j].overgroundWater=map2[i][j].overgroundWater;
          }
        }
      },
      smoothVegetation(range) {
        let map2 = new Array(this.config.mapSize);
        for(let i=0;i<this.config.mapSize;i++){
          map2[i] = new Array(this.config.mapSize);
          for(let j=0;j<this.config.mapSize;j++){
            map2[i][j]={};
            map2[i][j].vegetation=this.map[i][j].vegetation;
          }
        }
        for(let i=0;i<this.config.mapSize;i++){
          for(let j=0;j<this.config.mapSize;j++){
            if(this.map[i][j].overgroundWater<0.5){
              let beginX=Math.max(0,i-range),beginY=Math.max(0,j-range),
                endX=Math.min(this.config.mapSize-1,i+range),endY=Math.min(this.config.mapSize-1,j+range);
              let total=0;
              for(let ii=beginX;ii<=endX;ii++)
                for(let jj=beginY;jj<=endY;jj++)
                  total+=this.map[ii][jj].vegetation;
              map2[i][j].vegetation=total/(range+range+1)/(range+range+1);
            }
          }
        }
        for(let i=0;i<this.config.mapSize;i++){
          for(let j=0;j<this.config.mapSize;j++){
            this.map[i][j].vegetation=map2[i][j].vegetation;
          }
        }
      },
      seedingBtn(){
        this.seeding();
        this.renderMap();
      },
      seeding(){
        let map2 = new Array(this.config.mapSize);
        for(let i=0;i<this.config.mapSize;i++){
          map2[i] = new Array(this.config.mapSize);
          for(let j=0;j<this.config.mapSize;j++){
            map2[i][j] = {vegetation: 0};
          }
        }
        for(let i=0;i<this.config.mapSize;i++){
          for(let j=0;j<this.config.mapSize;j++){
            let value = this.map[i][j].vegetation;
            let times = 1 + Math.exp(-value/5);
            map2[i][j].vegetation = this.map[i][j].vegetation * times;
          }
        }
        for(let i=0;i<this.config.mapSize;i++){
          for (let j = 0; j < this.config.mapSize; j++) {
            this.map[i][j].vegetation = map2[i][j].vegetation;
          }
        }
      },
      windingBtn(){
        this.winding();
        this.renderMap();
      },
      winding(){
        for(let i=0;i<this.config.mapSize;i++){
          for(let j=0;j<this.config.mapSize;j++){
            //符合植物生长条件
            if(this.canGrowVegetation(i, j)){
              if(Math.random() < 0.03){
                this.changeVegetation(i-1, j-1, i+1, j+1, 1);
              }
            }
          }
        }
      },
    }
  }
</script>
