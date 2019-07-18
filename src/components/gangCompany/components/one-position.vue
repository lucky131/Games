<template>
  <div class="one-position" :style="showFullCal">
    <div class="position-name" @click="toggleShowFull()">
      <i v-if="showFull" class="arrow el-icon-arrow-down"></i>
      <i v-else class="arrow el-icon-arrow-right"></i>
      {{name}}（{{employeeArray.length}}人）
      <el-popover
        v-if="canRecruited"
        placement="bottom"
        width="200"
        trigger="click"
        :content="info">
        <span class="tips" slot="reference" @click.stop=""><i class="el-icon-info"></i></span>
      </el-popover>
      <i v-if="canRecruited" class="plus el-icon-circle-plus" @click.stop="toRecruit()"></i>
    </div>
    <div class="position-content">
      <div v-for="(e, index) in employeeArray" :key="index" class="one-people">
        <div class="left">
          <div class="name">
            <i v-if="e.gender === 1" class="el-icon-s-custom male"></i>
            <i v-else class="el-icon-s-custom female"></i>
            <span :class="{'__text-orange': e.ability === 100}">{{e.name}} {{e.age}}岁<span v-if="day < e.regularDay"> (试用期)</span></span>
          </div>
          <div v-if="e.ability || e.mood" class="info">
            <span>能力：</span>
            <span v-if="showAbility < 0">？</span>
            <span v-else v-html="abilityHtml(e.ability)"></span>
            <span v-if="showAbility > 0">({{Math.round(e.ability)}})</span>
            <span style="margin-left: 10px">心情：</span>
            <span v-html="moodHtml(e.mood)"></span>
            <span v-if="showMood > 0">({{Math.round(e.mood)}})</span>
          </div>
          <div v-if="e.salary" class="salary">
            日薪：
            <span v-if="day < e.regularDay">{{$u.formatIntegerNumber(Math.round(e.salary*0.8), config.formatIntegerNumberMode)}}</span>
            <span v-else>{{$u.formatIntegerNumber(e.salary, config.formatIntegerNumberMode)}}</span>
          </div>
        </div>
        <div v-if="e.mood !== undefined" class="right">
          <div v-if="canTrain && e.ability < 100" class="ope-btn train" @click="train(index)">训练</div>
          <div v-if="day >= e.canFireDay" class="ope-btn fire" @click="fire(index)">开除</div>
        </div>
      </div>
      <div v-if="canRecruited" class="recruit-btn able" @click="toRecruit()"><i class="el-icon-s-custom"></i> 招聘新{{name}}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  @import "../css/common";
  .one-position{
    margin: 0 10px 10px;
    border-radius: 10px;
    overflow: hidden;
    background-color: $cardContent;
    box-shadow: 0 0 6px rgba(0,0,0,.1);
    .position-name{
      height: 40px;
      line-height: 40px;
      background-color: $headerFooter;
      text-align: center;
      font-size: 18px;
      font-weight: bold;
      position: relative;
      .arrow{
        position: absolute;
        top: 11px;
        left: 12px;
      }
      .tips{
        position: absolute;
        right: 40px;
        font-size: 24px;
      }
      .plus{
        position: absolute;
        top: 7px;
        right: 12px;
        font-size: 24px;
      }
    }
    .position-content{
      padding: 0 20px;
      .one-people{
        width: 100%;
        border-bottom: 1px solid $border;
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
          width: 60px;
          display: flex;
          flex-flow: column nowrap;
          justify-content: center;
          .ope-btn{
            width: 100%;
            height: 24px;
            line-height: 24px;
            margin-top: 5px;
            &:first-child{margin-top: 0}
            border-radius: 12px;
            font-size: 12px;
            color: white;
            text-align: center;
            &.train{background-color: $btnBlue}
            &.fire{background-color: $textRed}
          }
        }
      }
      .recruit-btn{
        width: 100%;
        height: 40px;
        line-height: 40px;
        border-radius: 20px;
        margin: 10px 0;
        color: white;
        font-weight: bold;
        text-align: center;
        &.able{
          background-color: $btnBlue;
        }
        &.disabled{
          background-color: $btnBlueDisabled;
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
      info: String,
      canRecruited: Boolean,
      showFull: Boolean,
      employeeArray: Array,
      day: Number,
      config: Object,
      showAbility: Number,
      showMood: Number,
      canTrain: Boolean,
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
        if(ability < 20) return `<span class="__text-red">辣鸡</span>`;
        if(ability < 40) return `<span class="__text-orange">丢人</span>`;
        if(ability < 60) return `<span class="__text-gray">凑活</span>`;
        if(ability < 80) return `<span class="__text-blue">牛逼</span>`;
        return `<span class="__text-green">大神</span>`;
      },
      moodHtml(mood){
        if(mood < 20) return `<span class="__text-red">痛苦</span>`;
        if(mood < 40) return `<span class="__text-orange">沮丧</span>`
        if(mood < 60) return `<span class="__text-gray">寻常</span>`
        if(mood < 80) return `<span class="__text-blue">欢喜</span>`
        return `<span class="__text-green">乐极</span>`
      },
      toggleShowFull(){
        this.$emit("toggleShowFull");
      },
      train(index){
        this.$emit("train", index);
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
