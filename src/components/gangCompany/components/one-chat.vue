<template>
  <div class="one-chat">
    <div v-if="history.type === 's'" class="line s">
      <div class="inner">{{history.text}}</div>
    </div>
    <div v-else-if="history.type === 'h'" class="line h">
      <div class="inner">{{history.text}}</div>
    </div>
    <div v-else-if="history.type === 'y'" class="line y">
      <div class="inner">{{history.text}}</div>
    </div>
    <div v-else-if="history.type === 'r'" class="line r">
      <div class="envelope">
        <div class="amount">￥{{history.amount}}</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .one-chat{
    width: 100%;
    .line{
      width: 100%;
      margin-bottom: 20px;
      .inner{
        padding: 8px;
        border-radius: 5px;
        position: relative;
      }
      &.s{
        color: #999;
        font-size: 12px;
        text-align: center;
      }
      &.h{
        display: flex;
        justify-content: flex-start;
        .inner{
          min-width: 4px;
          max-width: 90%;
          min-height: 21px;
          background-color: white;
          &:before{
            content: "";
            border-top: 8px solid transparent;
            border-left: 0 solid transparent;
            border-right: 10px solid white;
            border-bottom: 8px solid transparent;
            position: absolute;
            top: 11px;
            left: -9px;
          }
        }
      }
      &.y{
        display: flex;
        justify-content: flex-end;
        .inner{
          min-width: 4px;
          max-width: 90%;
          min-height: 21px;
          background-color: #409EFF;
          color: white;
          &:before{
            content: "";
            border-top: 8px solid transparent;
            border-left: 10px solid #409EFF;
            border-right: 0 solid transparent;
            border-bottom: 8px solid transparent;
            position: absolute;
            top: 11px;
            right: -9px;
          }
        }
      }
      &.r{
        display: flex;
        justify-content: flex-end;
        .envelope{
          width: 100px;
          height: 161px;
          background-color: #d50000;
          border-radius: 5px;
          overflow: hidden;
          position: relative;
          &:before{
            content: "";
            width: 500px;
            height: 500px;
            background-color: red;
            border-radius: 50%;
            position: absolute;
            left: -200px;
            bottom: 50px;
          }
          &:after{
            content: "恭喜发财";
            width: 100%;
            color: #ffd282;
            font-weight: bold;
            text-align: center;
            position: absolute;
            top: 50px;
          }
          .amount{
            width: 100%;
            color: #ffd282;
            font-weight: bold;
            text-align: center;
            position: absolute;
            top: 120px;
          }
        }
      }
    }
  }
</style>

<script>
  export default {
    name: "one-chat",
    props: {
      history: Object
    },
    data(){
      return{

      }
    },
    computed: {

    },
    mounted(){

    },
    methods: {

    }
  }
</script>
