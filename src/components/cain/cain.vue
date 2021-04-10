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
      <div v-show="ans[index][0] || ans[index][1] || ans[index][2] || ans[index][3]" v-for="(item, index) in data" :key="index" class="row">
        <div class="name">
          <img :src="item.icon" alt="">
          <span>{{item.name}}</span>
        </div>
        <div class="id">{{item.ID}}</div>
        <div class="right">
          <div :class="{'hide': !ans[index][0]}" class="block"><img v-for="(i, index) in item.list1" :key="index" :src="imgs[i]"></div>
          <div :class="{'hide': !ans[index][1]}" class="block"><img v-for="(i, index) in item.list2" :key="index" :src="imgs[i]"></div>
          <div :class="{'hide': !ans[index][2]}" class="block"><img v-for="(i, index) in item.list3" :key="index" :src="imgs[i]"></div>
          <div :class="{'hide': !ans[index][3]}" class="block"><img v-for="(i, index) in item.list4" :key="index" :src="imgs[i]"></div>
        </div>
      </div>
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
          justify-content: space-around;
          .block{
            width: 120px;
            height: 100%;
            display: flex;
            flex-flow: row wrap;
            justify-content: center;
            align-content: center;
            &.hide{
              opacity: 0;
            }
            img{
              width: 30px;
            }
          }
        }
      }
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
        filter: [0,0,0,0,0,0,0,0]
      }
    },
    computed: {
      imgs(){
        return [
          require(`./0.png`),
          require(`./1.png`),
          require(`./2.png`),
          require(`./3.png`),
          require(`./4.png`),
          require(`./5.png`),
          require(`./6.png`),
          require(`./7.png`),
          require(`./8.png`),
          require(`./9.png`),
          require(`./10.png`),
          require(`./11.png`),
          require(`./12.png`),
          require(`./13.png`),
          require(`./14.png`),
          require(`./15.png`),
          require(`./16.png`),
          require(`./17.png`),
          require(`./18.png`),
          require(`./19.png`),
          require(`./20.png`),
          require(`./21.png`),
          require(`./22.png`),
          require(`./23.png`),
          require(`./24.png`),
          require(`./25.png`),
        ]
      },
      ans(){
        let ans = [];
        for(let index in this.data){
          ans.push([true, true, true, true]);
        }
        for(let i1 in this.data){
          let temp = [...this.data[i1].list1];
          for(let i2 in this.filter){
            if(this.filter[i2] !== 0){
              let index = temp.indexOf(this.filter[i2])
              if(index !== -1){
                temp.splice(index, 1);
              } else {
                ans[i1][0] = false;
                break;
              }
            }
          }
          temp = [...this.data[i1].list2];
          for(let i2 in this.filter){
            if(this.filter[i2] !== 0){
              let index = temp.indexOf(this.filter[i2])
              if(index !== -1){
                temp.splice(index, 1);
              } else {
                ans[i1][1] = false;
                break;
              }
            }
          }
          temp = [...this.data[i1].list3];
          for(let i2 in this.filter){
            if(this.filter[i2] !== 0){
              let index = temp.indexOf(this.filter[i2])
              if(index !== -1){
                temp.splice(index, 1);
              } else {
                ans[i1][2] = false;
                break;
              }
            }
          }
          temp = [...this.data[i1].list4];
          for(let i2 in this.filter){
            if(this.filter[i2] !== 0){
              let index = temp.indexOf(this.filter[i2])
              if(index !== -1){
                temp.splice(index, 1);
              } else {
                ans[i1][3] = false;
                break;
              }
            }
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
