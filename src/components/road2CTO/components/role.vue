<template>
  <div class="role">
    <img class="skin" :src="skinSrc" :style="{filter: `hue-rotate(${role.skin.hue}deg) brightness(${role.skin.brightness})`}">
    <img class="clothes" :src="clothesSrc" :style="{filter: `hue-rotate(${role.clothes.hue}deg) brightness(${role.clothes.brightness})`}">
    <img class="hair" :src="hairSrc" :style="{filter: `hue-rotate(${role.hair.hue}deg) brightness(${role.hair.brightness})`}">
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
      role: Object,
      direction: String
    },
    computed: {
      directionCal(){
        return this.direction ? this.direction : this.role.direction;
      },
      skinSrc(){
        return require(`../img/role/skin${this.role.skin.index}-${this.directionCal}.png`);
      },
      clothesSrc(){
        return require(`../img/role/clothes${this.role.clothes.index}-${this.directionCal}.png`);
      },
      hairSrc(){
        return require(`../img/role/hair${this.role.hair.index}-${this.directionCal}.png`);
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
