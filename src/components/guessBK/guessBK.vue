<template>
    <div class="wrapper">
      <div class="title">猜文章 by -3-</div>
      <div class="count">猜测次数：{{ count }}次</div>
      <div class="ope">
        <el-input v-model="input" placeholder="请输入要猜的字" :disabled="isWin" @keyup.enter.native="guess()"></el-input>
        <el-button type="primary" class="btn" :disabled="input.length !== 1" @click="guess()">猜</el-button>
        <el-button class="btn" @click="dialogMode = 2">自定义</el-button>
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

      <el-dialog title="选择游戏模式" center :visible.sync="dialog1" width="300px" :show-close="false">
        <div class="out">
          <el-button type="success" :disabled="isAIThinking" @click="ai()">
            <span v-if="isAIThinking"><i class="el-icon-loading"></i>生成中，大约10秒</span>
            <span v-else>AI出题</span>
          </el-button>
          <el-button type="info" @click="dialogMode=2">自定义</el-button>
        </div>
      </el-dialog>
      <el-dialog title="自定义文章内容" center :visible.sync="dialog2" width="75%" @close="dialogMode = (isAIThinking ? 0 : 1)">
        <el-input type="textarea" :rows="10" placeholder="至少输入两行内容，第一行是要猜的标题，第二行开始是正文部分" v-model="textarea"></el-input>
        <span slot="footer" class="">
          <el-button type="primary" :disabled="textarea.length===0" @click="customize()">生成</el-button>
        </span>
      </el-dialog>
    </div>
  </template>
  
  <style scoped lang="scss">
    .wrapper{
      max-width: 800px;
      margin: 0 auto;
      padding: 0 20px;
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
            background-color: #333;
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

      .out{
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
      }
    }
  </style>
  
  <script>
    const { Configuration, OpenAIApi } = require("openai");
    import {Base64} from "js-base64"

    export default {
      name: "guessBK",
      data(){
        return{
          classes: ["white", "black", "green", "out"],
          punctuationMarks: `,，.。\\/、:：;；\`~·'‘’"“”()（）<>《》!！?？+-_—%×√`,
          count: 0,
          ans: [],
          his: [],
          input: "",
          isWin: false,
          dialogMode: 0,
          textarea: "",
          isAIThinking: false,
        }
      },
      computed: {
        dialog1(){return this.dialogMode === 1},
        dialog2(){return this.dialogMode === 2}
      },
      mounted(){
        if(this.$route.query.k){
          let code = this.$route.query.k;
          let decode = Base64.decode(decodeURIComponent(code));
          this.generate(decode);
          this.isAIThinking = true;
        } else {
          this.dialogMode = 1;
        }
      },
      methods: {
        getRandomBKCategory(){
          let arr = [
            //从【xxx】这个大类中随机选择一样
            "动物", "植物", "天文", "自然现象",//自然
            "国家", "中国省份", "中国城市", //地理
            "文学作品", "传统习俗", "电影", "旅游景点", "电子游戏", //文化
            "历史事件", "中国朝代", "典故", //历史
            "日用品", "日常现象", //生活
            "法学", "医学", "小吃", "疾病", //社会
            "艺术形式", //艺术
            "中国古代名人", "中国现当代名人", "外国名人", //人物
            "经济", //经济
            "自然科学", "科技产品", //科技
            "体育活动", //体育
          ];
          return arr[Math.floor(Math.random() * arr.length)];
        },
        generate(article){
          let paragraphs = article.split("##").map(e => e.trim());
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
        },
        async ai(){
          const configuration = new Configuration({
            basePath: 'https://api.deepseek.com',
            apiKey: "sk-30653396b0084fa18136b6a2f8da6f2e",
          });
          delete configuration.baseOptions.headers['User-Agent'];
          const openai = new OpenAIApi(configuration);
          this.isAIThinking = true;
          const completion = await openai.createChatCompletion({
            messages: [{ role: "user", content: Date.now().toString().split("").reverse().join("").repeat(2) + "以上是随机编码，请无视。以下是我的要求：你是一位全能博学者，通晓世间万物，现在请你模仿百度百科的文本格式，从【" + this.getRandomBKCategory() + "】和【" + this.getRandomBKCategory() + "】这几个大类中随机选择一样，再随机选择一个属于该类的词条，生成一篇关于它的百科说明，以纯文本格式输出，第一行是这个词汇本身，只允许有中文，如果是某作品或电影名，不要加书名号，之后可以跟2至3段内容，可以包括中文、英文、数字和标点符号，第一段介绍主要概念，后面几段可以介绍历史、发展、影响力、涉及其他相关领域等，段落前不需要加序号。总字数大约在200字之间。" }],
            model: "deepseek-chat",
          });
          let rawAns = completion.data.choices[0].message.content;
          rawAns = rawAns.replaceAll("**", "").replaceAll("\n\n", "\n").replaceAll("\n", "##");
          this.generate(rawAns);
          this.dialogMode = 0;
        },
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
          temp = temp.replaceAll(/\n/g, "##");
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
  