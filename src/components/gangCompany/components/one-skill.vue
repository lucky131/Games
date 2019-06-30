<template>
  <div class="one-skill">
    <div v-if="item.condition" class="combine-img">
      <img class="main" :src="item.img">
      <div class="bottom">
        <img v-for="i in item.condition" :key="i" class="bottom-img" :src="allSkills[i].img">
      </div>
    </div>
    <img v-else class="single-img" :src="item.img">
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
    .combine-img{
      display: flex;
      flex-flow: column nowrap;
      align-items: center;
      .main{
        width: 40px;
        height: 40px;
      }
      .bottom{
        display: flex;
        flex-flow: row nowrap;
        margin-top: 10px;
        .bottom-img{
          width: 20px;
          height: 20px;
          margin-left: 5px;
          &:first-child{margin-left: 0}
        }
      }
    }
    .single-img{
      width: 40px;
      height: 40px;
    }
    .right{
      flex: 1 0 0;
      margin-left: 20px;
      display: flex;
      flex-flow: column nowrap;
      justify-content: center;
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
      allSkills: Array,
    },
    mounted(){

    },
    methods: {

    }
  }
</script>
