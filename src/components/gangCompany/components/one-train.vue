<template>
  <div class="one-train">
    <div class="left">
      <div class="name">
        <i v-if="train.employee.gender === 1" class="el-icon-s-custom male"></i>
        <i v-else class="el-icon-s-custom female"></i>
        {{train.employee.name}}
        {{train.employee.age}}岁
      </div>
      <div>职位：{{positionName}}</div>
      <div class="progress-row">
        <span>进度：</span>
        <div class="progress">
          <el-progress :text-inside="true" :stroke-width="18" :percentage="percentage"></el-progress>
        </div>
      </div>
      <div class="__text-green">预计剩余：{{remainWorkDay}}个工作日</div>
    </div>
    <div class="btn able" @click="cancelTrain()">取消训练</div>
  </div>
</template>

<style scoped lang="scss">
  @import "../css/common";
  .one-train{
    width: 100%;
    padding: 10px 20px;
    border-bottom: 1px solid $border;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    .left{
      margin-right: 40px;
      flex: 1 0 0;
      .name{
        font-weight: bold;
      }
      .progress-row{
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        .progress{
          flex: 1 0 0;
        }
      }
    }
    .btn{
      width: 80px;
      height: 40px;
      line-height: 40px;
      border-radius: 20px;
      color: white;
      text-align: center;
      &.able{
        background-color: $btnBlue;
      }
      &.disabled{
        background-color: $btnBlueDisabled;
        cursor: no-drop;
      }
    }
  }
</style>

<script>
export default {
  name: 'one-train',
  data () {
    return {
    }
  },
  props: {
    train: Object,
    positionName: String,
    speed: Number,
  },
  computed: {
    percentage(){
      return Math.round(this.train.current / this.train.total * 100 * 100) / 100;
    },
    remainWorkDay(){
      if (this.speed === 0) return "∞";
      return Math.ceil((this.train.total - this.train.current) / this.speed);
    }
  },
  mounted () {
  },
  methods: {
    cancelTrain(){
      this.$emit("cancelTrain")
    }
  }
}
</script>
