<template>
  <div class="wrap">
    <div class="title">Little Tools by -3-
      <el-tooltip placement="bottom">
        <div slot="content">
          v1.2<br>
          新增第二tab页<br>
          v1.1<br>
          清空<br>
          复制到剪切板<br>
          空单元格算法改进<br>
          v1.0<br>
          第一版
        </div>
        <span>v1.2</span>
      </el-tooltip>
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
    </el-tabs>
  </div>
</template>

<style scoped lang="scss">
  .wrap{
    width: 1000px;
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
      /deep/ table{
        width: 100%;
      }
    }
  }
</style>

<script>
  import Clipboard from "clipboard/dist/clipboard.min"
  export default {
    name: "ccc",
    data(){
      return{
        inputHtml1: "",
        isCopyBtn1Show: false,
        inputHtml2: "",
        isCopyBtn2Show: false,
      }
    },
    created(){
      //打开右键菜单
      document.oncontextmenu = function(){
        event.returnValue = true;
      };
      //允许选择文本
      document.onselectstart = function(){
        event.returnValue = true;
      };
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
    }
  }
</script>
