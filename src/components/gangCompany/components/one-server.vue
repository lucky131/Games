<template>
  <div class="one-server">
    <div class="left">
      <div class="name">{{name}}</div>
      <div class="desc">{{desc}}</div>
      <div class="size-price">
        <span class="size __text-orange">容量：{{$u.formatHardDiskSize(size)}}</span>
        <span class="price __text-green">价格：{{$u.formatIntegerNumber(price, config.formatIntegerNumberMode)}}/天</span>
      </div>
    </div>
    <div class="right">
      <div v-if="number > 0" class="minus" @click="minus()"><i class="el-icon-minus"></i></div>
      <div class="number">{{number}}</div>
      <div class="add" @click="add()"><i class="el-icon-plus"></i></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  @import "../css/common";
  .one-server{
    width: 100%;
    height: 80px;
    padding: 0 20px;
    border-bottom: 1px solid $border;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    .left{
      flex: 1 0 0;
      .name{
        font-size: 16px;
        font-weight: bold;
      }
      .desc{
        font-size: 12px;
        color: $textBlueNormal;
        margin-bottom: 6px;
      }
      .size-price{
        font-size: 14px;
        .size{
          margin-right: 20px;
        }
        .price{
        }
      }
    }
    .right{
      height: 40px;
      display: flex;
      position: relative;
      &>div{
        height: 100%;
        line-height: 40px;
        text-align: center;
        background-color: $cardContent;
        border: 1px solid $border;
        box-sizing: border-box;
        position: absolute;
        &.minus{
          width: 30px;
          border-right: none;
          border-top-left-radius: 10px;
          border-bottom-left-radius: 10px;
          right: 80px;
        }
        &.number{
          width: 50px;
          right: 30px;
        }
        &.add{
          width: 30px;
          border-left: none;
          border-top-right-radius: 10px;
          border-bottom-right-radius: 10px;
          right: 0;
        }
      }
    }
  }
</style>

<script>
  export default {
    name: "one-server",
    props: {
      name: String,
      desc: String,
      size: Number, //单位为G
      price: Number,
      number: Number,
      config: Object,
    },
    data(){
      return{

      }
    },
    mounted(){

    },
    methods: {
      minus(){
        this.$emit("change", -1);
      },
      add(){
        this.$emit("change", 1);
      },
    }
  }
</script>
