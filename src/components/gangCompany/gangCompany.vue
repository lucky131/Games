<template>
  <div class="gang-company" :style="{height: height + 'px'}">
    <div v-if="UIController === 'tutorial'" class="tutorial">

    </div>
  </div>
</template>

<style scoped lang="scss">
  .gang-company{
    width: 100vw;
    .tutorial{
      width: 100%;
      height: 100%;
      display: flex;
      flex-flow: column nowrap;
      justify-content: space-around;
      align-items: center;
    }
  }
</style>

<script>
  export default {
    name: "gangCompany",
    data(){
      return{
        height: 0,
        UIController: 'tutorial'
      }
    },
    mounted(){
      window.vue = this;
      this.height = window.innerHeight;
    },
    methods: {
      
    }
  }
</script>
