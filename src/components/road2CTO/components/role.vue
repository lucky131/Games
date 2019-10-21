<template>
  <div class="role">
    <img class="role-img" :src="src" alt="">
  </div>
</template>

<style scoped lang="scss">
  .role{
    width: 40px;
    height: 40px;
    .role-img{
      display: block;
    }
  }
</style>

<script>
  export default {
    name: "role",
    props: {
      direction: String
    },
    computed: {
      src(){
        return require(`../img/role-${this.direction}.png`)
      }
    },
    data(){
      return{

      }
    },
    mounted(){

    },
    methods: {

    }
  }
</script>
