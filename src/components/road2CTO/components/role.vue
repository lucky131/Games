<template>
  <div class="role">
    <img class="skin" :src="skinSrc">
    <img class="clothes" :src="clothesSrc">
    <img class="hair" :src="hairSrc" :style="{filter: `hue-rotate(${role.hair.hue}deg)`}">
  </div>
</template>

<style scoped lang="scss">
  .role{
    width: 40px;
    height: 40px;
    position: relative;
    img{
      position: absolute;
      display: block;
    }
  }
</style>

<script>
  export default {
    name: "role",
    props: {
      role: Object
    },
    computed: {
      direction(){
        return this.role.direction;
      },
      skinSrc(){
        return require(`../img/role/skin${this.role.skin.index}-${this.direction}.png`);
      },
      clothesSrc(){
        return require(`../img/role/clothes${this.role.clothes.index}-${this.direction}.png`);
      },
      hairSrc(){
        return require(`../img/role/hair${this.role.hair.index}-${this.direction}.png`);
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
