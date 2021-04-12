<template>
  <div class="wrapper">
    <div class="title">里该隐合成表 <a href="https://space.bilibili.com/1503710" target="_blank">by杠三杠</a> <el-button type="primary" @click="resetFilter">重置</el-button></div>
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
      <div v-for="(item, index1) in filtedData" :key="index1" class="row">
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
        layout="prev, pager, next"
        :total="filtedData.length"
        :page-size="pageSize">
      </el-pagination>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .wrapper{
    max-width: 1000px;
    margin: 0 auto;
    padding-bottom: 40px;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    .title{
      font-size: 24px;
      margin: 20px 0;
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
      margin: 20px 0;
    }
  }
</style>

<script>
  import data from "./db"
  export default {
    name: "cain",
    mixins: [data],
    data(){
      return{
        filter: [0,0,0,0,0,0,0,0],
        pageSize: 20,
      }
    },
    computed: { 
      imgs(){
        let list = [];
        for(let i = 0; i <= 25; i++)
          list.push(require(`./${i}.png`));
        return list;
      },
      filtedData(){
        let ans = [];
        for(let i1 in this.data){
          let temp, lists, flag;
          lists = [];

          temp = [...this.data[i1].list1];
          flag = true;
          for(let i2 in this.filter){
            if(this.filter[i2] !== 0){
              let index = temp.indexOf(this.filter[i2])
              if(index !== -1){
                temp.splice(index, 1);
              } else {
                flag = false;
                break;
              }
            }
          }
          if(flag) lists.push(this.data[i1].list1);

          temp = [...this.data[i1].list2];
          flag = true;
          for(let i2 in this.filter){
            if(this.filter[i2] !== 0){
              let index = temp.indexOf(this.filter[i2])
              if(index !== -1){
                temp.splice(index, 1);
              } else {
                flag = false;
                break;
              }
            }
          }
          if(flag) lists.push(this.data[i1].list2);

          temp = [...this.data[i1].list3];
          flag = true;
          for(let i2 in this.filter){
            if(this.filter[i2] !== 0){
              let index = temp.indexOf(this.filter[i2])
              if(index !== -1){
                temp.splice(index, 1);
              } else {
                flag = false;
                break;
              }
            }
          }
          if(flag) lists.push(this.data[i1].list3);

          temp = [...this.data[i1].list4];
          flag = true;
          for(let i2 in this.filter){
            if(this.filter[i2] !== 0){
              let index = temp.indexOf(this.filter[i2])
              if(index !== -1){
                temp.splice(index, 1);
              } else {
                flag = false;
                break;
              }
            }
          }
          if(flag) lists.push(this.data[i1].list4);

          if(lists.length > 0) {
            ans.push({
              icon: this.data[i1].icon,
              name: this.data[i1].name,
              ID: this.data[i1].ID,
              lists: lists
            });
          }
        }
        return ans;
      },
    },
    mounted(){

    },
    methods: {
      resetFilter(){
        for(let i = 0; i < 8; i++){
          this.$set(this.filter, i, 0);
        }
      },
      clickFilterBtn(index1, index2){
        this.$set(this.filter, index1, index2);
      }
    }
  }
</script>
