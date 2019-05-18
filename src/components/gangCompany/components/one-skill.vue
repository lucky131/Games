<template>
  <div class="one-skill">
    <img :src="item.img">
    <div class="right">
      <div class="name">{{item.name}}</div>
      <div class="desc">{{item.desc}}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .one-skill{
    width: 100%;
    padding: 5px 0;
    display: flex;
    flex-flow: row nowrap;
    img{
      width: 40px;
      height: 40px;
      margin-right: 10px;
    }
    .right{
      flex: 1 0 0;
      .name{
        font-weight: bold;
      }
      .desc{
        font-size: 12px;
        color: gray;
      }
    }
  }
</style>

<script>
  export default {
    name: "one-skill",
    data(){
      return{
        
      }
    },
    props: {
      item: Object,
    },
    mounted(){
      
    },
    methods: {
      
    }
  }
</script>
