<template>
  <div class="wrap">
    <div class="title">Little Tools by -3- v1.4
    </div>
    <el-tabs type="border-card">
      <el-tab-pane label="1">
        <el-input
          type="textarea"
          :rows="10"
          resize="none"
          placeholder="请粘贴html：div.tbody"
          v-model="inputHtml1">
        </el-input>
        <div class="opeBtns">
          <el-button type="primary" icon="el-icon-refresh" @click="transform1()">转换</el-button>
          <el-button type="default" icon="el-icon-close" @click="clear1()">清空</el-button>
          <el-button v-if="isCopyBtn1Show" class="copyBtn" type="success" icon="el-icon-share" data-clipboard-target="#result1">复制结果</el-button>
        </div>
        <div id="result1" class="result"></div>
      </el-tab-pane>

      <el-tab-pane label="2">
        <el-input
          type="textarea"
          :rows="10"
          resize="none"
          placeholder="请粘贴html：div.tabs-content"
          v-model="inputHtml2">
        </el-input>
        <div class="opeBtns">
          <el-button type="primary" icon="el-icon-refresh" @click="transform2()">转换</el-button>
          <el-button type="default" icon="el-icon-close" @click="clear2()">清空</el-button>
          <el-button v-if="isCopyBtn2Show" class="copyBtn" type="success" icon="el-icon-share" data-clipboard-target="#result2">复制结果</el-button>
        </div>
        <div id="result2" class="result"></div>
      </el-tab-pane>

      <el-tab-pane label="3">
        <el-input
          type="textarea"
          :rows="10"
          resize="none"
          placeholder="请粘贴要匹配的名称，回车换行"
          v-model="input3">
        </el-input>
        <div class="opeBtns">
          <el-button type="primary" icon="el-icon-refresh" :disabled="input3.length === 0" @click="transform3()">匹配</el-button>
          <el-button type="default" icon="el-icon-close" @click="clear3()">清空</el-button>
          <el-button v-if="isCopyBtn3Show" class="copyBtn" type="success" icon="el-icon-share" data-clipboard-target="#result3">复制结果</el-button>
        </div>
        <div id="result3" class="result"></div>
      </el-tab-pane>

      <el-tab-pane label="4">
        <el-input
          type="textarea"
          :rows="10"
          resize="none"
          placeholder="请粘贴html：div.tbody"
          v-model="inputHtml4">
        </el-input>
        <div class="opeBtns">
          <el-button type="primary" icon="el-icon-refresh" @click="transform4()">转换</el-button>
          <el-button type="default" icon="el-icon-close" @click="clear4()">清空</el-button>
          <el-button v-if="isCopyBtn4Show" class="copyBtn" type="success" icon="el-icon-share" data-clipboard-target="#result4">复制结果</el-button>
        </div>
        <div id="result4" class="result"></div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped lang="scss">
  .wrap{
    width: 1200px;
    margin: 0 auto;
    text-align: center;
    .title{
      width: 100%;
      height: 100px;
      line-height: 100px;
      font-size: 24px;
      font-weight: bold;
    }
    .opeBtns{
      margin-top: 40px;
    }
    .result{
      width: 100%;
      margin-top: 40px;
      font-size: 12px;
      /deep/ table{
        width: 100%;
      }
    }
  }
</style>

<script>
  import Clipboard from "clipboard/dist/clipboard.min"
  import data from "./cityData"
  export default {
    name: "ccc",
    mixins: [data],
    data(){
      return{
        inputHtml1: "",
        isCopyBtn1Show: false,
        inputHtml2: "",
        isCopyBtn2Show: false,
        input3: "",
        isCopyBtn3Show: false,
        inputHtml4: "",
        isCopyBtn4Show: false,
      }
    },
    mounted(){
      //初始化剪切板工具
      let clipboard = new Clipboard('.copyBtn');
      clipboard.on('success', e => {
        e.clearSelection();
        this.$message({
          message: '复制成功',
          type: 'success'
        });
      });
    },
    methods: {
      transform1(){
        if(this.inputHtml1.length === 0){
          this.$message({
            message: '内容不能为空',
            type: 'error'
          });
        } else {
          let dom = $("<div></div>").append($(this.inputHtml1));
          if(dom.find("div.tbody").length === 0){
            this.$message({
              message: '找不到div.tbody',
              type: 'error'
            });
          } else {
            let tbodyDom = dom.find("div.tbody");
            let appendTableDom = $("<table border='1' cellpadding='5' cellspacing='0'></table>");
            let rowNum = tbodyDom[0].childElementCount;
            for(let i = 0; i < rowNum; i++){
              let rowDom = tbodyDom.children("a.table-row").eq(i).children("div.g-row").eq(0).children("div.g-row").eq(0);
              let appendTrDom = $("<tr></tr>");
              let colNum = rowDom.children().length;
              for(let j = 0; j < colNum; j++){
                let cellDom = rowDom.children().eq(j);
                let cellText = cellDom.children("span.hidden-md-up").length>0 ? "" : cellDom.text().trim();
                appendTrDom.append(`<td>${cellText}</td>`);
              }
              appendTableDom.append(appendTrDom);
            }
            $("#result1").empty();
            $("#result1").append(appendTableDom);
            this.isCopyBtn1Show = true;
          }
        }
      },
      clear1(){
        this.inputHtml1 = "";
        this.isCopyBtn1Show = false;
        $("#result1").empty();
      },
      transform2(){
        if(this.inputHtml2.length === 0){
          this.$message({
            message: '内容不能为空',
            type: 'error'
          });
        } else {
          let dom = $("<div></div>").append($(this.inputHtml2));
          if(dom.find("div.tabs-content").length === 0){
            this.$message({
              message: '找不到div.tabs-content',
              type: 'error'
            });
          } else {
            let tbodyDom = dom.find("div.tab-content.show > table > tbody");
            let appendTableDom = $("<table border='1' cellpadding='5' cellspacing='0'><thead><tr><td>Rank</td><td>Name</td><td>Nationality</td><td>Points</td><td>Earnings</td></tr></thead></table>");
            let rowNum = tbodyDom.children("tr").length;
            let rank = 1, src, index1, index2, nation, names, points, earnings;
            for(let i = 0; i < rowNum; i++){
              let rowDom = tbodyDom.children("tr").eq(i);
              rank = rowDom.children("td").eq(0).text().trim() || rank;
              src = rowDom.children("td").eq(1).children("img").eq(0).attr("src");
              index1 = src.indexOf("flag_");
              index2 = src.indexOf(".png");
              nation = src.substring(index1+5, index2).toUpperCase();
              names = rowDom.children("td").eq(1).children("a").eq(0).text().trim();
              points = rowDom.children("td").eq(2).text().trim();
              earnings = rowDom.children("td").eq(3).text().trim();

              appendTableDom.append(`<tr><td>${rank}</td><td>${names.split("/")[0]}</td><td>${nation}</td><td>${points}</td><td>${earnings}</td></tr>`);
              appendTableDom.append(`<tr><td>${rank}</td><td>${names.split("/")[1]}</td><td>${nation}</td><td>${points}</td><td>${earnings}</td></tr>`);
            }
            $("#result2").empty();
            $("#result2").append(appendTableDom);
            this.isCopyBtn2Show = true;
          }
        }
      },
      clear2(){
        this.inputHtml2 = "";
        this.isCopyBtn2Show = false;
        $("#result2").empty();
      },
      transform3(){
        let names = this.input3.split("\n").filter(str => str.length > 0);
        let oriCityData = this.oriCityData.split("\n");
        let cityMap = {"个人": ["个人"]};
        oriCityData.forEach(str => {
          let [name1, name2] = str.split("\t");
          if(!cityMap.hasOwnProperty(name1)){
            cityMap[name1] = [name1];
          }
          if(cityMap[name1].indexOf(name2) === -1){ //防止吉林-吉林的情况
            cityMap[name1].push(name2);
          }
        });
        let result = names.map(name => {
          for(let key in cityMap){
            let l = cityMap[key].length;
            for(let i = 0; i < l; i++){
              if(name.indexOf(cityMap[key][i]) === 0){
                return key;
              }
            }
          }
          return "NA"
        });
        let appendTableDom = $("<table border='1' cellpadding='5' cellspacing='0'></table>");
        result.forEach(r => {
          appendTableDom.append(`<tr><td>${r}</td></tr>>`);
        });
        $("#result3").empty();
        $("#result3").append(appendTableDom);
        this.isCopyBtn3Show = true;
      },
      clear3(){
        this.input3 = "";
        this.isCopyBtn3Show = false;
        $("#result3").empty();
      },
      transform4(){
        if(this.inputHtml4.length === 0){
          this.$message({
            message: '内容不能为空',
            type: 'error'
          });
        } else {
          let dom = $("<div></div>").append($(this.inputHtml4));
          if(dom.find("div.tbody").length === 0){
            this.$message({
              message: '找不到div.tbody',
              type: 'error'
            });
          } else {
            let tbodyDom = dom.find("div.tbody");
            let appendTableDom = $("<table border='1' cellpadding='3' cellspacing='0'></table>");
            let rowNum = tbodyDom[0].childElementCount;
            for(let i = 0; i < rowNum; i++){
              let rowDom = tbodyDom.children("a.table-row").eq(i).children("div.g-row").eq(0); //默认3个子元素 姓名 国籍 剩余
              let appendTrDom = $("<tr></tr>");
              appendTrDom.append(`<td>${rowDom.children().eq(0).text()}</td>`);
              appendTrDom.append(`<td>${rowDom.children().eq(1).text()}</td>`);
              let otherRowDom = rowDom.children().eq(2);
              let colNum = otherRowDom.children().length;
              for(let j = 0; j < colNum; j++){
                let cellDom = otherRowDom.children().eq(j);
                let text1 = cellDom.children().eq(3).text();
                let text2 = cellDom.children().eq(5).text();
                appendTrDom.append(`<td>${text1}</td>`);
                appendTrDom.append(`<td>${text2}</td>`);
              }
              appendTableDom.append(appendTrDom);
            }
            $("#result4").empty();
            $("#result4").append(appendTableDom);
            this.isCopyBtn4Show = true;
          }
        }
      },
      clear4(){
        this.inputHtml4 = "";
        this.isCopyBtn4Show = false;
        $("#result4").empty();
      }
    }
  }
</script>
