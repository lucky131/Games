<template>
  <div class="speed-controller">
    <div class="btn" :class="{'selected': interval === 2000}" @click.stop="changeInterval(2000)">x1</div>
    <div class="btn" :class="{'selected': interval === 400}" @click.stop="changeInterval(400)">x5</div>
    <div class="btn" :class="{'selected': interval === 200}" @click.stop="changeInterval(200)">x10</div>
    <div class="btn" :class="{'selected': interval === 40}" @click.stop="changeInterval(40)">x50</div>
    <div class="btn" :class="{'selected': interval === 20}" @click.stop="changeInterval(20)">x100</div>
  </div>
</template>

<style scoped lang="scss">
  .speed-controller{
    display: flex;
    flex-flow: row nowrap;
    .btn{
      width: 32px;
      height: 20px;
      line-height: 20px;
      margin-left: 4px;
      &:first-child{margin-left: 0}
      border: 1px solid black;
      border-radius: 4px;
      font-size: 12px;
      text-align: center;
      &.selected{
        background-color: #ccc;
      }
    }
  }
</style>

<script>
  export default {
    name: "speed-controller",
    props: {
      interval: Number
    },
    data(){
      return{
      }
    },
    methods: {
      changeInterval (i) {
        this.$emit("changeInterval", i);
      }
    }
  }
</script>
