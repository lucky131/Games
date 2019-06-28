<template>
  <div class="one-contact" @click="toChat()">
    <div class="left">
      <span class="name">{{contact.girl.nickName || contact.girl.name}}</span>
      <span class="heart" v-html="heartHtml"></span>
      <i @click.stop="showInfoDialog()" class="el-icon-info"></i>
      <i @click.stop="showNickNameDialog()" class="el-icon-edit-outline"></i>
    </div>
    <div v-if="contact.unread > 0" class="unread">{{contact.unread}}</div>
  </div>
</template>

<style scoped lang="scss">
  .one-contact{
    width: 100%;
    height: 50px;
    padding: 0 20px;
    border-bottom: 1px solid #e1e1e6;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    .left{
      flex: 1 0 0;
      display: flex;
      align-items: center;
      .name{
        font-weight: bold;
      }
      .heart{
        font-size: 20px;
        color: deeppink;
        letter-spacing: -4px;
        margin-right: 20px;
      }
      i{
        font-size: 20px;
        margin-right: 5px;
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
      contact: Object,
      heartHtml: String
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
      showInfoDialog(){
        this.$emit("showInfoDialog");
      },
      showNickNameDialog(){
        this.$emit("showNickNameDialog");
      }
    }
  }
</script>
