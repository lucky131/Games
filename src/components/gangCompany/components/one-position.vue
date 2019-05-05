<template>
  <div class="one-position">
    <div class="position-name">{{name}}（{{employeeArray.length}}人）</div>
    <div class="position-content">
      <div v-for="(e, index) in employeeArray" :key="index" class="one-people">
        <div class="left">
          <div class="name">
            <i v-if="e.gender === 1" class="el-icon-s-custom male"></i>
            <i v-else class="el-icon-s-custom female"></i>
            {{e.name}}
            {{e.age}}岁
          </div>
          <div v-if="e.ability || e.mood" class="info">
            能力：<span v-html="abilityHtml(e.ability)" style="margin-right: 20px"></span>
            心情：<span v-html="moodHtml(e.mood)"></span>
          </div>
          <div v-if="e.salary" class="salary">日薪：{{$u.formatIntegerNumber(e.salary, config.formatIntegerNumberMode)}}</div>
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
      config: Object,
    },
    data(){
      return{

      }
    },
    mounted(){

    },
    methods: {
      abilityHtml(ability){
        if(ability < 20) return `<span class="__text-red">极差</span>`;
        if(ability < 40) return `<span class="__text-orange">稍差</span>`;
        if(ability < 60) return `<span class="__text-gray">中等</span>`;
        if(ability < 80) return `<span class="__text-blue">优秀</span>`;
        return `<span class="__text-green">顶尖</span>`;
      },
      moodHtml(mood){
        if(mood < 20) return `<span class="__text-red">崩溃</span>`;
        if(mood < 40) return `<span class="__text-orange">烦躁</span>`
        if(mood < 60) return `<span class="__text-gray">一般</span>`
        if(mood < 80) return `<span class="__text-blue">开心</span>`
        return `<span class="__text-green">狂欢</span>`
      },
      toRecruit(){
        this.$emit("toRecruit");
      },
    }
  }
</script>
