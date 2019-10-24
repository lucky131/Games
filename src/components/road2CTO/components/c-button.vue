<template>
  <div class="c-button" :style="styleCal" @click="handleClick()">
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
  .c-button{
    height: 40px;
    line-height: 40px;
    border-radius: 20px;
    font-size: 20px;
    text-align: center;
    color: white;
  }
</style>

<script>
  export default {
    name: "c-button",
    props: {
      backgroundColor: {
        type: String,
        default: "#4796e5"
      },
      padding: {
        type: String,
        default: "0"
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    data(){
      return{

      }
    },
    computed: {
      styleCal(){
        return {
          backgroundColor: this.disabled ? "#a6a6a6" : this.backgroundColor,
          padding: this.padding
        }
      }
    },
    mounted(){

    },
    methods: {
      handleClick(){
        if(!this.disabled){
          this.$emit("click");
        }
      }
    }
  }
</script>
