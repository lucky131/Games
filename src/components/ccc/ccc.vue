<template>
  <div class="wrap">
    <div class="title">Little Tools by -3-
      <el-tooltip placement="bottom">
        <div slot="content">
          v1.1<br>
          清空<br>
          复制到剪切板<br>
          空单元格算法改进<br>
          v1.0<br>
          第一版
        </div>
        <span>v1.1</span>
      </el-tooltip>
    </div>
    <el-input
      type="textarea"
      :rows="10"
      resize="none"
      placeholder="请粘贴html"
      v-model="inputHtml">
    </el-input>

    <div class="opeBtns">
      <el-button type="primary" icon="el-icon-refresh" @click="transform()">转换</el-button>
      <el-button type="default" icon="el-icon-close" @click="clear()">清空</el-button>
      <el-button v-if="isCopyBtnShow" class="copyBtn" type="success" icon="el-icon-share" data-clipboard-target="#result">复制结果</el-button>
    </div>

    <div id="result" class="result"></div>
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
        inputHtml: "",
        isCopyBtnShow: false,
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
      transform(){
        if(this.inputHtml.length === 0){
          this.$message({
            message: '内容不能为空',
            type: 'error'
          });
        } else {
          let dom = $("<div></div>").append($(this.inputHtml));
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
            $("#result").empty();
            $("#result").append(appendTableDom);
            this.isCopyBtnShow = true;
          }
        }
      },
      clear(){
        this.inputHtml = "";
        this.isCopyBtnShow = false;
        $("#result").empty();
      },
      // copy(){
      //   let dom = document.getElementById("result"); // 选择对象
      //   console.log(dom);
      //   document.execCommand("Copy"); // 执行浏览器复制命令
      //   this.$alert("复制成功");
      // }
    }
  }
</script>
