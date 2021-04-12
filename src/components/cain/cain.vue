<template>
  <div class="wrapper">
    <div class="title">
      <div class="inner">
        <div class="logo">里该隐合成表 <a href="https://space.bilibili.com/1503710" target="_blank"> by杠三杠</a></div>
        <el-input v-model="input" clearable placeholder="输入道具英文名 / ID" @input="search"></el-input>
        <el-button type="primary" icon="el-icon-refresh-left" @click="reset">重置</el-button>
      </div>
    </div>
    <div class="ope">
      <div v-for="(item1, index1) in filter" :key="index1" class="row">
        <span>{{index1+1}}</span>
        <img :class="{'selected': index2===filter[index1]}" v-for="(item2, index2) in imgs" :key="index2" :src="item2" @click="clickFilterBtn(index1, index2)">
      </div>
    </div>
    <div class="header">
      <div style="width: 250px">道具图标/名称</div>
      <div style="width: 50px">ID</div>
      <div style="flex: 1">配方</div>
    </div>
    <div class="recipe">
      <div v-for="(item, index1) in pageData(page)" :key="index1" class="row">
        <div class="name">
          <img :src="item.icon" alt="">
          <span>{{item.name}}</span>
        </div>
        <div class="id">{{item.ID}}</div>
        <div class="right">
          <div v-for="(list, index2) in item.lists" :key="index2" class="block">
            <img v-for="(i, index) in list" :key="index" :src="imgs[i]">
          </div>
        </div>
      </div>
    </div>
    <div class="page">
      <el-pagination
        background
        layout="total, prev, pager, next, sizes"
        :current-page.sync="page"
        :total="filtedData.length"
        :page-size="pageSize"
        :page-sizes="[10,25,50,1000]"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .wrapper{
    max-width: 1000px;
    margin: 0 auto;
    padding: 100px 0 70px;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    .title{
      width: 100%;
      height: 80px;
      background-color: white;
      position: fixed;
      top: 0;
      box-shadow: rgba(0,0,0,.2) 0px 0px 5px;
      .inner{
        width: 1000px;
        height: 100%;
        margin: 0 auto;
        display: flex;
        justify-content: center;
        align-items: center;
        .logo{
          font-size: 20px;
          font-weight: bold;
        }
        .el-input{
          width: 250px;
          margin: 0 20px;
        }
      }
    }
    .ope{
      margin-bottom: 20px;
      .row{
        margin-bottom: 2px;
        display: flex;
        align-items: center;
        span{
          margin-right: 10px;
        }
        img{
          width: 30px;
          border-radius: 5px;
          border: 3px solid rgba(0,0,0,0);
          cursor: pointer;
          &:hover{
            background-color: #ddd;
          }
          &.selected{
            border: 3px solid black;
            background-color: #bbb;
          }
        }
      }
    }
    .header{
      width: 100%;
      padding: 10px 0;
      background-color: #ccc;
      display: flex;
      div{
        text-align: center;
        font-weight: bold;
      }
    }
    .recipe{
      width: 100%;
      .row{
        width: 100%;
        height: 80px;
        display: flex;
        border-bottom: 1px solid black;
        .name{
          width: 250px;
          display: flex;
          align-items: center;
          img{
            width: 40px;
            height: 40px;
            margin: 0 10px;
          }
        }
        .id{
          width: 50px;
          line-height: 80px;
          text-align: center;
        }
        .right{
          flex: 1;
          height: 100%;
          display: flex;
          .block{
            width: 120px;
            height: 100%;
            margin: 0 20px;
            display: flex;
            flex-flow: row wrap;
            justify-content: center;
            align-content: center;
            img{
              width: 30px;
            }
          }
        }
      }
    }
    .page{
      width: 100%;
      padding: 20px 0;
      background-color: white;
      box-shadow: rgba(0,0,0,.2) 0px 0px 5px;
      position: fixed;
      bottom: 0;
      display: flex;
      justify-content: center;
    }
  }
</style>

<script>
  function isSubStr(arr1, arr2){
    let n1 = 0, n2 = 0;
    while(n1 < arr1.length && n2 < arr2.length){
      if(arr1[n1] < arr2[n2]) break;
      else if(arr1[n1] === arr2[n2]) {
        n1++;
        n2++;
      } else n2++;
    }
    return n1 === arr1.length;
  }

  import data from "./db"
  export default {
    name: "cain",
    mixins: [data],
    data(){
      return{
        input: "",
        realInput: "",
        filter: [0,0,0,0,0,0,0,0],
        page: 1,
        pageSize: 10,
      }
    },
    computed: { 
      imgs(){
        let list = [];
        for(let i = 0; i <= 25; i++)
          list.push(require(`./${i}.png`));
        return list;
      },
      maxPage(){
        return Math.ceil(this.filtedData.length / this.pageSize);
      },
      namedData(){
        return this.data.filter(i => i.name.toLowerCase().indexOf(this.realInput.toLowerCase()) > -1 || i.ID == this.realInput);
      },
      filtedData(){
        let ans = [], lists, temp = [...this.filter].filter(i => i > 0);
        temp.sort((x, y) => x - y);

        for(let i in this.namedData){
          lists = [];
          if(isSubStr(temp, this.namedData[i].list1)) lists.push(this.namedData[i].list1);
          if(isSubStr(temp, this.namedData[i].list2)) lists.push(this.namedData[i].list2);
          if(isSubStr(temp, this.namedData[i].list3)) lists.push(this.namedData[i].list3);
          if(isSubStr(temp, this.namedData[i].list4)) lists.push(this.namedData[i].list4);

          if(lists.length > 0){
            ans.push({
              icon: this.namedData[i].icon,
              name: this.namedData[i].name,
              ID: this.namedData[i].ID,
              lists: lists
            });
          }
        }
        return ans;
      },
      pageData(){
        return (page) => {
          let startIndex = (page - 1) * this.pageSize;
          let endIndex = startIndex + this.pageSize;
          let ans = [];
          for(let i = startIndex; i < endIndex && i < this.filtedData.length; i++)
            ans.push(this.filtedData[i]);
          return ans;
        }
      },
    },
    mounted(){
      //键盘左右翻页
      document.onkeydown = (event) => {
        if(event.keyCode === 37 || event.keyCode === 65){
          if(this.page > 1) this.page--;
        } else if(event.keyCode === 39 || event.keyCode === 68){
          if(this.page < this.maxPage) this.page++;
        }
      }
    },
    methods: {
      toTop(h = 0){
        document.body.scrollTop = h;
        document.documentElement.scrollTop = h;
      },
      search(){
        this.realInput = this.input;
      },
      reset(){
        this.input = "";
        this.realInput = "";
        for(let i = 0; i < 8; i++){
          this.$set(this.filter, i, 0);
        }
      },
      clickFilterBtn(index1, index2){
        this.$set(this.filter, index1, index2);
      },
      handleSizeChange(pageSize){
        this.pageSize = pageSize;
        this.page = 1;
      },
      handleCurrentChange(page){
        this.page = page;
        // this.toTop(400);
      }
    }
  }
</script>
