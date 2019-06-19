<template>
  <div class="one-chat">
    <div :class="['line', history.type]">
      <div class="inner">{{history.text}}</div>
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
          max-width: 90%;
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
          max-width: 90%;
          background-color: #9eea6a;
          &:before{
            content: "";
            border-top: 8px solid transparent;
            border-left: 10px solid #9eea6a;
            border-right: 0 solid transparent;
            border-bottom: 8px solid transparent;
            position: absolute;
            top: 11px;
            right: -9px;
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
