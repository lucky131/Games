<template>
    <div class="wrapper">
      <div class="title">猜文章 by -3-</div>
      <div class="count">猜测次数：{{ count }}次</div>
      <div class="ope">
        <el-input v-model="input" placeholder="请输入要猜的字" :disabled="isWin" @keyup.enter.native="guess()"></el-input>
        <el-button type="primary" class="btn" :disabled="input.length !== 1" @click="guess()">猜</el-button>
        <el-button class="btn" @click="isDialogShow = true">自定义</el-button>
      </div>
      <div class="content">
        <div v-for="(p, index) in ans" :key="index" class="paragraph">
          <div v-for="(c, index2) in p" :key="index2" class="block" :class="classes[c.status]">
            <span v-if="c.status !== 1">{{ c.character }}</span>
          </div>
        </div>
      </div>
      <div class="history">
        <div v-for="(h, index) in his" :key="index" class="block" :class="h.status ? 'green' : 'red'">{{ h.character }}</div>
      </div>

      <el-dialog
      title="自定义新游戏"
      center
      :visible.sync="isDialogShow"
      width="800px">
      <el-input type="textarea" :rows="10" placeholder="至少两行，第一行为标题" v-model="textarea"></el-input>
        <span slot="footer" class="">
          <el-button type="primary" @click="customize()">生成</el-button>
        </span>
      </el-dialog>
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
      .count{
        text-align: center;
      }
      .ope{
        margin-top: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        .btn{
          width: 100px;
          margin-left: 10px;
        }
      }
      .content{
        margin: 20px 0;
        .paragraph{
          margin-bottom: 10px;
          display: flex;
          flex-flow: row wrap;
          .block{
            box-sizing: border-box;
            width: 24px;
            height: 24px;
            line-height: 22px;
            font-size: 20px;
            text-align: center;
            margin: 0 5px 5px 0;
          }
          .white{

          }
          .black{
            background-color: black;
          }
          .green{
            background-color: rgb(28,156,155);
            color: white;
          }
          .out{
            border: 1px solid #ccc;
          }
        }
      }
      .history{
        margin: 20px 0;
        color: white;
        display: flex;
        flex-flow: row wrap;
        .block{
          box-sizing: border-box;
          width: 24px;
          height: 24px;
          line-height: 22px;
          font-size: 20px;
          text-align: center;
          margin: 0 5px 5px 0;
        }
        .green{background-color: rgb(28,156,155);}
        .red{background-color: rgb(244, 182, 120);}
      }
    }
  </style>
  
  <script>
    import Clipboard from "clipboard/dist/clipboard.min"
    import {Base64} from "js-base64"

    export default {
      name: "guessBK",
      data(){
        return{
          classes: ["white", "black", "green", "out"],
          punctuationMarks: `，。、：·“”（）《》！`,
          count: 0,
          ans: [],
          his: [],
          input: "",
          isWin: false,
          isDialogShow: false,
          textarea: "",
        }
      },
      mounted(){
        if(this.$route.query.k){
          let code = this.$route.query.k;
          let decode = Base64.decode(decodeURIComponent(code));
          let paragraphs = decode.split("##");
          for(let p of paragraphs){
            let temp = [];
            for(let c of p){
              temp.push({
                character: c,
                status: this.punctuationMarks.includes(c) ? 0 : 1 //0标点符号 1未猜出 2猜出 3被揭示
              });
            }
            this.ans.push(temp);
          }
        } else {
          this.isDialogShow = true;
        }
      },
      methods: {
        guess(){
          if(this.input.length !== 1) {
            this.$message('只能输入一个字');
            return;
          }
          if(this.punctuationMarks.includes(this.input)) {
            this.$message('不能输入标点符号');
            return;
          }

          //判断是否已经猜过
          if(this.his.some(h => h.character === this.input)){
            this.$message('你已经猜过这个字');
            this.input = "";
            return;
          }

          //开始遍历
          let flag = false;
          for(let p of this.ans){
            for(let c of p){
              if(c.character === this.input){
                c.status = 2;
                flag = true;
              }
            }
          }

          //加入历史
          this.his.push({
            character: this.input,
            status: flag
          });
          this.count++;

          //清空
          this.input = "";

          //判赢
          this.judgeWin();
        },
        judgeWin(){
          if(this.ans[0].every(c => c.status === 2)){
            for(let p of this.ans){
              for(let c of p){
                if(c.status === 1){
                  c.status = 3;
                }
              }
            }
            this.isWin = true;
            this.$message('猜对了');
          }
        },
        customize(){
          let temp = this.textarea;
          temp = temp.replace(/\n/g, "##");
          let fullurl = window.location.href;
          if(fullurl.includes("?")){
            fullurl = fullurl.substring(0, fullurl.indexOf("?"));
          }
          let url = fullurl + "?k=" + encodeURIComponent(Base64.encode(temp));
          navigator.clipboard.writeText(url);
          console.log(url);
          this.$message('链接已复制');
        }
      }
    }
  </script>
  