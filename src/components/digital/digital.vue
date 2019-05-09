<template>
  <div class="wrap">
    <div class="result" v-for="(item, index) in results" :key="index">{{item.number.join("")}}  {{item.result}}</div>
    <div class="ope" v-if="!isWin">
      <el-input-number class="input" v-for="n in config.length" :key="n" v-model="inputs[n-1]" :controls="false" :min="0" :max="9" :step="1"></el-input-number>
      <el-button type="primary" :disabled="isBtnDisabled()" @click="btn()">确定</el-button>
    </div>
    <div class="win" v-else>Congratulations! Step: {{step}} <el-button type="primary" @click="restart()">Restart</el-button></div>

    <el-dialog
      title="新游戏"
      center
      :visible.sync="isDialogShow"
      width="320px"
      :show-close="falseData"
      :close-on-click-modal="falseData"
      :close-on-press-escape="falseData">
      <el-form label-width="60px">
        <el-form-item label="位数">
          <el-input-number v-model="config.length" :min="2" :max="6" :step="1"></el-input-number>
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
    padding-top: 20px;
    box-sizing: border-box;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    .result{
      font-size: 20px;
      margin-top: 10px;
      white-space: pre;
    }
    .ope{
      margin-top: 20px;
      .input{
        width: 50px;
        margin-right: 20px;
      }
    }
    .win{
      margin-top: 20px;
    }
  }
</style>

<script>
  export default {
    name: "digital",
    data(){
      return{
        falseData: false,
        isDialogShow: true,
        config: {
          length: 4,
        },
        results: [],
        inputs: [],
        answer: [],
        step: 0,
        isWin: false,
      }
    },
    mounted(){
      let that = this;

      //键盘事件
      $(document).keydown(function (e) {
        if((e.keyCode==13 || e.keyCode==108) && !that.isBtnDisabled()){
          that.btn();
        }
      });
    },
    methods:{
      start(){
        let that = this;

        this.isDialogShow = false;
        this.results = [];
        this.inputs = new Array(this.config.length);
        this.step = 0;
        this.isWin = false;

        //生成答案
        this.answer = [];
        for(let i=0;i<this.config.length;i++){
          let rand;
          do{
            rand = Math.floor(Math.random()*10);
          } while (this.answer.includes(rand));
          this.answer.push(rand);
        }

        //连续聚焦事件
        $(".input").on("input propertychange", function (e) {
          if(e.originalEvent.data){
            let index = $(this).index();
            $(this).parent().children(".input").eq(index).find("input").blur();
            if(index < that.config.length-1){
              $(this).parent().children(".input").eq(index+1).find("input").focus();
            }
          }
        });

        //聚焦第一个input
        $(".input").eq(0).find("input").focus();

        //作弊
        // console.log(this.answer.join(""));
      },
      handleInput(){
        console.log(1111);
      },
      isBtnDisabled(){
        //保证全为非空
        for(let i=0;i<this.inputs.length;i++){
          if(this.inputs[i] === undefined)
            return true;
        }

        //查重
        let set = new Set(this.inputs);
        return set.size !== this.config.length
      },
      btn(){
        let newResult = {};
        newResult.number = this.inputs;
        let a=0, b=0, c=0; //c=a+b
        for(let i=0;i<newResult.number.length;i++){
          if(newResult.number[i] === this.answer[i]){
            a++;
          }
          if(this.answer.includes(newResult.number[i])){
            c++;
          }
        }
        b = c-a;
        newResult.result = `${a}A${b}B`;
        this.results.push(newResult);
        this.inputs = new Array(this.config.length);
        this.step++;

        if(a === this.config.length){
          //win
          this.isWin = true;
        } else {
          //聚焦第一个input
          $(".input").eq(0).find("input").focus();
        }
      },
      restart(){
        this.isDialogShow = true;
      }
    }
  }
</script>
