<template>
  <div class="one-contact" @click="toChat()">
    <div class="left">{{contact.girl.nickName || contact.girl.name}} <i @click.stop="showNickNameDialog()" class="el-icon-edit-outline"></i></div>
    <div v-if="contact.unread > 0" class="unread">{{contact.unread}}</div>
  </div>
</template>

<style scoped lang="scss">
  .one-contact{
    width: 100%;
    height: 50px;
    padding: 0 20px;
    border-bottom: 1px solid #ccc;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    .left{
      flex: 1 0 0;
      .info{
        font-weight: bold;
      }
    }
    .unread{
      width: 20px;
      height: 20px;
      line-height: 20px;
      border-radius: 50%;
      background-color: red;
      color: white;
      font-size: 14px;
      text-align: center;
    }
  }
</style>

<script>
  export default {
    name: "one-contact",
    props: {
      contact: Object
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
      toChat(){
        this.$emit("toChat");
      },
      showNickNameDialog(){
        this.$emit("showNickNameDialog");
      }
    }
  }
</script>
