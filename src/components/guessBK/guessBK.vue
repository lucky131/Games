<template>
    <div class="wrapper">
      <div class="title">
        <span>猜文章v3.0</span>
        <el-button size="mini" plain type="info" icon="el-icon-setting" circle @click="isSettingShow=true"></el-button>
        <el-button size="mini" plain type="success" icon="el-icon-edit" circle @click="isDialogShow=true"></el-button></div>
      <div v-if="ans.length > 0" class="count">
        {{ rightCount }}/{{ totalCount }}({{ rightRate }}%)
      </div>
      <div v-if="ans.length > 0" class="ope">
        <el-input v-model="input" placeholder="请输入要猜的字" :disabled="isWin" @keyup.enter.native="guess()"></el-input>
        <el-button type="primary" class="btn" :disabled="input.length !== 1" @click="guess()">猜</el-button>
        <el-button type="warning" class="btn" :disabled="isWin" @click="giveUp()">弃</el-button>
      </div>
      <div v-if="ans.length === 0 || isWin" class="aiWrapper">
        <el-button type="success" :disabled="isAIThinking" @click="ai()">
          <span v-if="isAIThinking"><i class="el-icon-loading"></i>生成中，大约10秒</span>
          <span v-else>AI随机生成文章</span>
        </el-button>
      </div>
      <div class="content">
        <div v-for="(p, index) in ans" :key="index" class="paragraph">
          <div v-for="(c, index2) in p" :key="index2" class="block" @click="clickBlock(index, index2)"
          :class="{
            white: c.status === 0,
            black: c.status === 1,
            green: c.status === 2,
            out: c.status === 3,
            last: c.character === lastC && c.status === 2
          }">
            <span v-if="c.status !== 1">{{ c.character }}</span>
          </div>
        </div>
      </div>
      <div v-if="ans.length > 0" class="history">
        <div class="top">猜测记录：</div>
        <div class="bot">
          <div v-for="(h, index) in his" :key="index" class="block" @click="clickHis(index)"
          :class="{
            right: h.status,
            wrong: !h.status,
            last: h.character === lastC && h.status
          }">{{ h.character }}</div>
        </div>
      </div>

      <el-dialog title="自定义文章" center :visible.sync="isDialogShow" width="75%" @close="isDialogShow=false">
        <el-input type="textarea" :rows="10" placeholder="至少输入两行内容，第一行是要猜的标题，第二行开始是正文部分" v-model="textarea"></el-input>
        <span slot="footer" class="">
          <el-button type="success" :disabled="isAIThinking2" @click="aiCustomize()">
            <span v-if="isAIThinking2"><i class="el-icon-loading"></i>生成中</span>
            <span v-else>AI代写</span>
          </el-button>
          <el-button type="primary" :disabled="textarea.length===0 || isAIThinking2" @click="customize()">生成链接</el-button>
        </span>
      </el-dialog>

      <el-dialog title="设置" center :visible.sync="isSettingShow" width="75%" @close="isSettingShow=false">
        <div class="settingRow">
          <span>便捷开局</span>
          <el-switch v-model="settings.isQuick" @change="saveSettings"></el-switch>
        </div>
        <el-input type="textarea" :disabled="!settings.isQuick" :rows="3" placeholder="连续输入文字，如：一个的有和" v-model="settings.quickChars" @input="saveSettings"></el-input>
        <span slot="footer" class="">
          <el-button type="" @click="isSettingShow=false">关闭</el-button>
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
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
        button{
          font-size: 16px;
          margin-left: 6px;
        }
      }
      .count{
        text-align: center;
      }
      .ope{
        margin-top: 20px;
        background-color: white;
        padding: 10px 0;
        display: flex;
        justify-content: center;
        align-items: center;
        position: sticky;
        top: 0;
        .btn{
          width: 100px;
          margin-left: 10px;
        }
      }
      .aiWrapper{
        margin: 20px 0;
        display: flex;
        justify-content: center;
      }
      .content{
        margin-top: 10px;
        .paragraph{
          margin-bottom: 10px;
          display: flex;
          flex-flow: row wrap;
          .block{
            width: 24px;
            height: 24px;
            line-height: 24px;
            font-size: 20px;
            text-align: center;
            margin: 0 5px 5px 0;
            border: 1px solid rgba(255, 255, 255, 0);
            cursor: default;
          }
          .white{

          }
          .black{
            background-color: #333;
          }
          .green{
            background-color: rgb(51,103,209);
            color: white;
          }
          .out{
            border-color: #ccc;
          }
          .last{
            background-color: #EE82EE;
            font-weight: bold;
          }
        }
      }
      .history{
        margin: 10px 0;
        border-top: 1px solid #ccc;
        .top{
          color: #666;
          font-size: 16px;
          margin: 10px 0;
        }
        .bot{
          color: white;
          display: flex;
          flex-flow: row wrap;
          .block{
            width: 24px;
            height: 24px;
            line-height: 24px;
            font-size: 20px;
            text-align: center;
            margin: 0 5px 5px 0;
            cursor: default;
          }
          .right{background-color: rgb(51,103,209);}
          .wrong{background-color: rgb(184, 184, 184);}
          .last{
            background-color: #EE82EE;
            font-weight: bold;
          }
        }
      }

      .settingRow{
        margin-bottom: 20px;
        display: flex;
        flex-flow: row nowrap;
        justify-content: left;
        align-items: center;
        span{
          margin-right: 5px;
        }
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
          punctuationMarks: `,，.。\\/、:：;；!！?？\`~·'‘’"“”()（）<>《》[]【】「」『』+-*_—%…`,
          rightCount: 0,
          totalCount: 0,
          ans: [],
          his: [],
          input: "",
          isWin: false,
          isDialogShow: false,
          isSettingShow: false,
          textarea: "",
          isAIThinking: false,
          isAIThinking2: false,
          lastC: "",
          settings: {
            isQuick: false,
            quickChars: "",
          },
        }
      },
      computed: {
        rightRate(){
          if(this.rightCount === 0 && this.totalCount === 0) return 0;
          return Math.floor(this.rightCount / this.totalCount * 100 * 100) / 100;
        }
      },
      mounted(){
        //读取配置
        if(localStorage.getItem("isQuick")){
          this.settings.isQuick = localStorage.getItem("isQuick") === "1";
        } else {
          localStorage.setItem("isQuick", 0);
        }
        if(localStorage.getItem("quickChars")){
          this.settings.quickChars = localStorage.getItem("quickChars");
        } else {
          localStorage.setItem("quickChars", "");
        }

        if(this.$route.query.k){
          let code = this.$route.query.k;
          let decode = Base64.decode(decodeURIComponent(code));
          this.generate(decode);
        }
      },
      methods: {
        getRandomBKCategory(){
          let arr = [
            //从【xxx】这个大类中随机选择一样
            "动物", "植物", "天文", "自然现象",//自然
            "国家", "中国省份", "中国城市", //地理
            "文学作品", "传统习俗", "电影", "旅游景点", //文化
            "历史事件", "中国朝代", "历史典故", //历史
            "日常用品", "办公用品", "知名品牌", "日常现象", //生活
            "法学", "中国小吃", "疾病", //社会
            "艺术形式", //艺术
            "中国古代名人", "中国现当代名人", "外国名人", //人物
            "经济", //经济
            "自然科学", "科技产品", //科技
            "体育活动", //体育
            "电子游戏", "B站知名up主", "动漫", //娱乐
          ];
          return arr[Math.floor(Math.random() * arr.length)];
        },
        async generate(article){
          this.rightCount = 0;
          this.totalCount = 0;
          this.ans = [];
          this.his = [];
          this.input = "";
          this.isWin = false;
          this.lastC = "";
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
          if(this.settings.isQuick){
            for(let c of this.settings.quickChars){
              this.input = c;
              await new Promise(resolve => setTimeout(resolve, 200));
              this.guess(false);
            }
          }
        },
        async ai(){
          const configuration = new Configuration({
            basePath: 'https://api.deepseek.com',
            apiKey: Base64.decode("c2stOTVjNmYxMzQ3YWYxNDEzMjk2ODQ1NTc5NGM4NDAyMmY="),
          });
          delete configuration.baseOptions.headers['User-Agent'];
          const openai = new OpenAIApi(configuration);
          this.isAIThinking = true;
          try {
            const completion = await openai.createChatCompletion({
              messages: [{ role: "user", content: "你是一位全能博学者，通晓世间万物，现在请你模仿百度百科的文本格式，从【" + this.getRandomBKCategory() + "】这个大类中随机选择一个，生成一篇关于它的百科说明，以纯文本格式输出，第一行是这个词汇本身，只允许有中文，最多七个字，如果是某作品或电影名，不要加书名号，之后是正文部分，包括中文、数字和标点符号，尽量不要使用英文，数字可以使用阿拉伯数字。正文可以分成2至3段，段落前不需要加序号。总字数大约在200字左右，但不要超过250字。" }],
              model: "deepseek-chat",
              temperature: 2
            });
            let rawAns = completion.data.choices[0].message.content;
            rawAns = rawAns.replaceAll("**", "").replaceAll("\n\n", "\n").replaceAll("\n", "##");
            this.generate(rawAns);
            this.isAIThinking = false;
          } catch (error) {
            this.$message.error('发生错误');
            this.isAIThinking = false;
          }
        },
        guess(showMessage = true){
          if(this.input.length !== 1) {
            if(showMessage){
              this.$message.warning({
                message: "只能输入一个字",
                duration: 1000
              });
            }
            return;
          }
          if(this.punctuationMarks.includes(this.input)) {
            if(showMessage) {
              this.$message.warning({
                message: "不能输入标点符号",
                duration: 1000
              });
            }
            return;
          }

          this.lastC = this.input;

          //判断是否已经猜过
          if(this.his.some(h => h.character === this.input)){
            if(showMessage){
              this.$message({
                message: "你已经猜过这个字",
                duration: 1000
              });
            }
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

          if(flag){
            this.rightCount++;
          } else {
            if(showMessage){
              this.$message.error({
                message: "这个字不在文章中",
                duration: 1000
              });
            }
          }
          this.totalCount++;

          //加入历史
          this.his.push({
            character: this.input,
            status: flag
          });

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
            this.lastC = "";
            this.$message.success({
              message: "猜对了",
              duration: 1000
            });
          }
        },
        async aiCustomize(){
          if(this.textarea.length === 0){
            this.$message.warning({
              message: "请指定一个标题",
              duration: 1000
            });
            return;
          }
          if(this.textarea.includes("\n")){
            this.$message.warning({
              message: "只能输入一行标题",
              duration: 1000
            });
            return;
          }
          const configuration = new Configuration({
            basePath: 'https://api.deepseek.com',
            apiKey: Base64.decode("c2stOTVjNmYxMzQ3YWYxNDEzMjk2ODQ1NTc5NGM4NDAyMmY="),
          });
          delete configuration.baseOptions.headers['User-Agent'];
          const openai = new OpenAIApi(configuration);
          this.isAIThinking2 = true;
          try {
            const completion = await openai.createChatCompletion({
              messages: [{ role: "user", content: "你是一位全能博学者，通晓世间万物，现在请你模仿百度百科的文本格式，生成一篇关于【" + this.textarea + "】的百科说明，以纯文本格式输出，可以分成2至3段，包括中文、数字和标点符号，尽量不要使用英文，第一段介绍主要概念，后面几段可以介绍历史、发展、影响力、涉及其他相关领域等内容，段落前不需要加序号。总字数大约在200字左右，但不要超过250字。" }],
              model: "deepseek-chat",
              temperature: 2
            });
            let rawAns = completion.data.choices[0].message.content;
            rawAns = rawAns.replaceAll("**", "").replaceAll("\n\n", "\n");
            this.textarea = this.textarea + "\n" + rawAns;
            this.isAIThinking2 = false;
          } catch (error) {
            this.$message.error('发生错误');
            this.isAIThinking2 = false;
          }
        },
        customize(){
          if(!this.textarea.includes("\n")){
            this.$message.warning({
              message: "至少输入两行",
              duration: 1000
            });
            return;
          }
          let temp = this.textarea;
          temp = temp.replaceAll(/\n/g, "##");
          let fullurl = window.location.href;
          if(fullurl.includes("?")){
            fullurl = fullurl.substring(0, fullurl.indexOf("?"));
          }
          let url = fullurl + "?k=" + encodeURIComponent(Base64.encode(temp));
          navigator.clipboard.writeText(url);
          console.log(url);
          this.$message.success({
              message: "链接已复制",
              duration: 1000
            });
        },
        giveUp(){
          if (confirm("确定要放弃并显示答案吗？")) {
            for(let p of this.ans){
              for(let c of p){
                if(c.status === 1){
                  c.status = 3;
                }
              }
            }
            this.isWin = true;
            this.lastC = "";
          }
        },
        clickBlock(index, index2){
          if(this.ans[index][index2].status === 2 && !this.isWin){
            this.lastC = this.ans[index][index2].character;
          }
        },
        clickHis(index){
          if(this.his[index].status && !this.isWin){
            this.lastC = this.his[index].character;
          }
        },
        saveSettings(){
          localStorage.setItem("isQuick", this.settings.isQuick ? 1 : 0);
          localStorage.setItem("quickChars", this.settings.quickChars);
        }
      }
    }
  </script>
