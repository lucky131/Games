<template>
  <div class="wrap">
    <div class="title">给ccc用的</div>
    <el-input
      type="textarea"
      :rows="10"
      placeholder="请粘贴html"
      v-model="inputHtml">
    </el-input>
    <el-button class="transformBtn" type="primary" @click="transform()">转换</el-button>
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
      font-size: 20px;
    }
    .transformBtn{
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
  export default {
    name: "ccc",
    data(){
      return{
        inputHtml: "",
      }
    },
    mounted(){

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
                let cellText = i===0&&j===colNum-1 ? "" : rowDom.children().eq(j).text().trim();
                appendTrDom.append(`<td>${cellText}</td>`);
              }
              appendTableDom.append(appendTrDom);
            }
            $("#result").append(appendTableDom);
          }
        }
      }
    }
  }
</script>
