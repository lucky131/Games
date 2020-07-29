<template>
  <div class="wrapper">
    <div class="title">杠三杠的coc工具 v1.0</div>
    <el-tabs type="border-card">
      <el-tab-pane label="快速骰子">
        <div class="pane">
          <el-table :data="diceData" border style="width: 100%">
            <el-table-column prop="d2" label="D2" :resizable="false"></el-table-column>
            <el-table-column prop="d4" label="D4" :resizable="false"></el-table-column>
            <el-table-column prop="d6" label="D6" :resizable="false"></el-table-column>
            <el-table-column prop="d8" label="D8" :resizable="false"></el-table-column>
            <el-table-column prop="d10" label="D10" :resizable="false"></el-table-column>
            <el-table-column prop="d20" label="D20" :resizable="false"></el-table-column>
            <el-table-column prop="d100" label="D100" :resizable="false"></el-table-column>
          </el-table>
          <div class="rollBtn" @click="rollDice()">R-O-L-L-!</div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="自定义骰子">
        <div class="pane diy">
          <div v-for="(row, index) in diyDiceData" :key="index" class="attrRow">
            <div style="width: 12px"><span v-if="index>0">+</span></div>
            <el-input-number size="small" v-model="row.n" :min="1"></el-input-number>
            <div>* D</div>
            <el-input-number size="small" v-model="row.d" :min="2" :step="2"></el-input-number>
            <el-button type="danger" size="small" round @click="deleteDice(index)">删除骰子</el-button>
          </div>
          <el-button style="margin-top: 10px" type="success" round @click="addDice()">增加骰子</el-button>
          <div style="margin-top: 30px">投掷结果</div>
          <div class="result">{{diyDice}}</div>
          <div class="rollBtn" @click="rollDice2()">R-O-L-L-!</div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="创建人物">
        <div class="pane">
          <div class="attrRow">
            <div class="name">力量（STR）</div>(
            <el-input-number size="small" v-model="nSTR" :min="1" :max="3"></el-input-number>
            <div>* D6 +</div>
            <el-input-number size="small" v-model="pSTR" :min="0" :max="6" :step="6"></el-input-number>
            <div>) * 5 = {{STR}}</div>
          </div>
          <div class="attrRow">
            <div class="name">体质（CON）</div>(
            <el-input-number size="small" v-model="nCON" :min="1" :max="3"></el-input-number>
            <div>* D6 +</div>
            <el-input-number size="small" v-model="pCON" :min="0" :max="6" :step="6"></el-input-number>
            <div>) * 5 = {{CON}}</div>
          </div>
          <div class="attrRow">
            <div class="name">体型（SIZ）</div>(
            <el-input-number size="small" v-model="nSIZ" :min="1" :max="3"></el-input-number>
            <div>* D6 +</div>
            <el-input-number size="small" v-model="pSIZ" :min="0" :max="6" :step="6"></el-input-number>
            <div>) * 5 = {{SIZ}}</div>
          </div>
          <div class="attrRow">
            <div class="name">敏捷（DEX）</div>(
            <el-input-number size="small" v-model="nDEX" :min="1" :max="3"></el-input-number>
            <div>* D6 +</div>
            <el-input-number size="small" v-model="pDEX" :min="0" :max="6" :step="6"></el-input-number>
            <div>) * 5 = {{DEX}}</div>
          </div>
          <div class="attrRow">
            <div class="name">外貌（APP）</div>(
            <el-input-number size="small" v-model="nAPP" :min="1" :max="3"></el-input-number>
            <div>* D6 +</div>
            <el-input-number size="small" v-model="pAPP" :min="0" :max="6" :step="6"></el-input-number>
            <div>) * 5 = {{APP}}</div>
          </div>
          <div class="attrRow">
            <div class="name">智力（INT）</div>(
            <el-input-number size="small" v-model="nINT" :min="1" :max="3"></el-input-number>
            <div>* D6 +</div>
            <el-input-number size="small" v-model="pINT" :min="0" :max="6" :step="6"></el-input-number>
            <div>) * 5 = {{INT}}</div>
          </div>
          <div class="attrRow">
            <div class="name">意志（POW）</div>(
            <el-input-number size="small" v-model="nPOW" :min="1" :max="3"></el-input-number>
            <div>* D6 +</div>
            <el-input-number size="small" v-model="pPOW" :min="0" :max="6" :step="6"></el-input-number>
            <div>) * 5 = {{POW}}</div>
          </div>
          <div class="attrRow">
            <div class="name">教育（EDU）</div>(
            <el-input-number size="small" v-model="nEDU" :min="1" :max="3"></el-input-number>
            <div>* D6 +</div>
            <el-input-number size="small" v-model="pEDU" :min="0" :max="6" :step="6"></el-input-number>
            <div>) * 5 = {{EDU}}</div>
          </div>
          <div class="rollBtn" @click="rollAttr()">R-O-L-L-!</div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped lang="scss">
  .wrapper{
    max-width: 800px;
    margin: 0 auto;
    .title{
      margin-top: 20px;
      margin-bottom: 20px;
      font-size: 24px;
      text-align: center;
    }
    .pane{
      padding: 20px;
      .rollBtn{
        width: 100%;
        height: 100px;
        line-height: 100px;
        background-image: linear-gradient(#21c9ff, #3665be);
        margin-top: 40px;
        border-radius: 50px;
        color: white;
        font-size: 32px;
        text-align: center;
        cursor: pointer;
        user-select: none;
      }
      .attrRow{
        margin-bottom: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        .name{
          width: 110px;
        }
        .el-input-number--small{
          width: 108px;
          margin: 0 10px;
        }
      }
      .result{
        margin-top: 10px;
        font-size: 24px;
        font-weight: bold;
      }
    }
    .diy{
      display: flex;
      flex-flow: column nowrap;
      align-items: center;
    }
  }
</style>

<script>
  function random(n, m = 1){
    let r = 0;
    for(let i = 0; i < m; i++){
      r += Math.ceil(Math.random() * n);
    }
    return r;
  }

  export default {
    name: "coc",
    data(){
      return{
        diceData:[{
          d2: 1,
          d4: 1,
          d6: 1,
          d8: 1,
          d10: 1,
          d20: 1,
          d100: 1,
        }],
        diyDiceData:[],
        diyDice: "0",
        nSTR: 3, pSTR: 0, STR: 0,
        nCON: 3, pCON: 0, CON: 0,
        nSIZ: 2, pSIZ: 6, SIZ: 0,
        nDEX: 3, pDEX: 0, DEX: 0,
        nAPP: 3, pAPP: 0, APP: 0,
        nINT: 2, pINT: 6, INT: 0,
        nPOW: 3, pPOW: 0, POW: 0,
        nEDU: 2, pEDU: 6, EDU: 0,
      }
    },
    mounted(){
      this.rollDice();
      this.rollAttr();
    },
    methods: {
      rollDice(){
        this.diceData[0].d2 = random(2);
        this.diceData[0].d4 = random(4);
        this.diceData[0].d6 = random(6);
        this.diceData[0].d8 = random(8);
        this.diceData[0].d10 = random(10);
        this.diceData[0].d20 = random(20);
        this.diceData[0].d100 = random(100);
      },
      addDice(){
        this.diyDiceData.push({
          n: 1,
          d: 6
        });
      },
      deleteDice(index){
        this.diyDiceData.splice(index, 1);
      },
      rollDice2(){
        let r = 0, d = 0, num = 0;
        this.diyDice = "";
        for(let index in this.diyDiceData){
          for(let j = 0; j < this.diyDiceData[index].n; j++){
            if(num > 0)
              this.diyDice += " + ";
            num++;
            d = random(this.diyDiceData[index].d);
            this.diyDice += d;
            r += d;
          }
        }
        if(num > 1)
          this.diyDice += " = " + r;
      },
      rollAttr(){
        this.STR = (random(6, this.nSTR) + this.pSTR) * 5;
        this.CON = (random(6, this.nCON) + this.pCON) * 5;
        this.SIZ = (random(6, this.nSIZ) + this.pSIZ) * 5;
        this.DEX = (random(6, this.nDEX) + this.pDEX) * 5;
        this.APP = (random(6, this.nAPP) + this.pAPP) * 5;
        this.INT = (random(6, this.nINT) + this.pINT) * 5;
        this.POW = (random(6, this.nPOW) + this.pPOW) * 5;
        this.EDU = (random(6, this.nEDU) + this.pEDU) * 5;
      }
    }
  }
</script>
