<template>
  <div class="one-position">
    <div class="position-name">BOSS</div>
    <div class="position-content">
      <div class="one-people">
        <div class="left">
          <div class="name">杠三杠</div>
          <div class="row2">心情：好</div>
          <div class="row3">日薪：100</div>
        </div>
        <div class="right"></div>
      </div>
      <div class="one-people">
        <div class="left">
          <div class="name">杠三杠</div>
          <div class="row2">心情：好</div>
          <div class="row3">日薪：100</div>
        </div>
        <div class="right"></div>
      </div>
      <div class="recruit-btn"><i class="el-icon-s-custom"></i> 招聘新员工</div>
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
        background-color: #67C23A;
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
