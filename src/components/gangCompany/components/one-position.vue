<template>
  <div class="one-position">
    <div class="position-name">{{name}}（{{employeeArray.length}}人）</div>
    <div class="position-content">
      <div v-for="(e, index) in employeeArray" :key="index" class="one-people">
        <div class="left">
          <div class="name">{{e.name}}</div>
          <div class="row2">心情：好</div>
          <div class="row3">日薪：100</div>
        </div>
        <div class="right"></div>
      </div>
      <div v-if="canRecruited" class="recruit-btn" @click="toRecruit()"><i class="el-icon-s-custom"></i> 招聘新{{name}}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .one-position{
    margin: 0 10px 10px;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 0 6px rgba(0,0,0,.1);
    .position-name{
      height: 40px;
      line-height: 40px;
      background-color: #e7eaef;
      text-align: center;
      font-size: 18px;
      font-weight: bold;
    }
    .position-content{
      padding: 0 20px;
      .one-people{
        width: 100%;
        height: 80px;
        border-bottom: 1px solid #ccc;
        &:last-child{border-bottom: none}
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        .left{
          flex: 1 0 0;
          .name{
            font-weight: bold;
          }
          .row2{}
          .row3{}
        }
        .right{
          width: 100px;
          height: 100%;
        }
      }
      .recruit-btn{
        width: 100%;
        height: 40px;
        line-height: 40px;
        border-radius: 10px;
        margin: 10px 0;
        background-color: #31c21f;
        color: white;
        font-weight: bold;
        text-align: center;
      }
    }
  }
</style>

<script>
  export default {
    name: "one-position",
    props: {
      name: String,
      canRecruited: Boolean,
      employeeArray: Array,
      condition: String,
    },
    data(){
      return{

      }
    },
    mounted(){

    },
    methods: {
      toRecruit(){
        this.$emit("toRecruit");
      }
    }
  }
</script>
