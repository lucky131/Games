<template>
  <div class="one-position" :style="showFullCal">
    <div class="position-name" @click="toggleShowFull()">
      <i v-if="showFull" class="arrow el-icon-arrow-down"></i>
      <i v-else class="arrow el-icon-arrow-right"></i>
      {{name}}（{{employeeArray.length}}人）
      <i v-if="canRecruited" class="plus el-icon-plus" @click.stop="toRecruit()"></i>
    </div>
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
            <span>能力：</span>
            <span v-html="abilityHtml(e.ability)"></span>
            <span v-if="showAbility">({{Math.round(e.ability)}})</span>
            <span style="margin-left: 10px">心情：</span>
            <span v-html="moodHtml(e.mood)"></span>
            <span v-if="showMood">({{Math.round(e.mood)}})</span>
          </div>
          <div v-if="e.salary" class="salary">日薪：{{$u.formatIntegerNumber(e.salary, config.formatIntegerNumberMode)}}</div>
        </div>
        <div v-if="e.mood !== undefined" class="right">
          <div v-if="day >= e.canFireDay" class="fireBtn" @click="fire(index)">开除</div>
        </div>
      </div>
      <div v-if="canRecruited" class="recruit-btn able" @click="toRecruit()"><i class="el-icon-s-custom"></i> 招聘新{{name}}</div>
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
      position: relative;
      .arrow{
        position: absolute;
        top: 11px;
        left: 12px;
      }
      .plus{
        position: absolute;
        top: 11px;
        right: 12px;
      }
    }
    .position-content{
      padding: 0 20px;
      .one-people{
        width: 100%;
        border-bottom: 1px solid #ccc;
        &:last-child{border-bottom: none}
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        .left{
          flex: 1 0 0;
          padding: 10px 0;
          .name{
            font-weight: bold;
          }
          .info{
            font-size: 14px;
          }
          .salary{
            font-size: 14px;
          }
        }
        .right{
          width: 64px;
          display: flex;
          flex-flow: column nowrap;
          justify-content: center;
          .fireBtn{
            width: 100%;
            height: 28px;
            line-height: 28px;
            background-color: #f5524c;
            border-radius: 10px;
            font-size: 14px;
            color: white;
            text-align: center;
          }
        }
      }
      .recruit-btn{
        width: 100%;
        height: 40px;
        line-height: 40px;
        border-radius: 10px;
        margin: 10px 0;
        color: white;
        font-weight: bold;
        text-align: center;
        &.able{
          background-color: #31c21f;
        }
        &.disabled{
          background-color: #ccc;
        }
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
      showFull: Boolean,
      employeeArray: Array,
      condition: String,
      day: Number,
      config: Object,
      showAbility: Boolean,
      showMood: Boolean,
    },
    data(){
      return{

      }
    },
    computed: {
      showFullCal(){
        return this.showFull ? {} : {
          'height': '40px'
        }
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
      toggleShowFull(){
        this.$emit("toggleShowFull");
      },
      fire(index){
        this.$emit("fire", index);
      },
      toRecruit(){
        this.$emit("toRecruit");
      },
    }
  }
</script>
