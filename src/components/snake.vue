<template>
  <div id="content">
    <div id="field"></div>
  </div>
</template>

<style scoped lang="scss">
  #content {
    width: 100vw;
    height: 100vh;
    background-color: black;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;
    #field{
      border: 1px solid white;
    }
  }
</style>

<script>
  export default {
    name: 'gameMenu',
    data () {
      return {
        config: {
          blockSize: 20,
          difficulty: 1,
          width: 30,
          height: 30
        },
      }
    },
    mounted: function(){
      
    },
    methods: {

    }
  }
</script>
