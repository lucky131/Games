<template>
  <div class="one-girl">
    <div class="left">
      <div class="info"><span class="pink">{{girl.name}}</span> {{girl.age}}岁</div>
      <div class="row">照片颜值：{{girl.appearanceByApp}}分</div>
    </div>
    <div class="btn able" @click="startChat()">聊一聊</div>
  </div>
</template>

<style scoped lang="scss">
  .one-girl{
    width: 100%;
    padding: 10px 20px;
    border-bottom: 1px solid #ccc;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    .left{
      flex: 1 0 0;
      .info{
        font-weight: bold;
        .pink{
          color: deeppink;
        }
      }
    }
    .btn{
      width: 80px;
      height: 40px;
      line-height: 40px;
      border-radius: 10px;
      text-align: center;
      &.able{
        color: white;
        background-color: deeppink;
      }
      &.disabled{
        background-color: #ccc;
        cursor: no-drop;
      }
    }
  }
</style>

<script>
  export default {
    name: "one-girl",
    props: {
      girl: Object,
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
      startChat(){
        this.$emit("startChat")
      }
    }
  }
</script>
