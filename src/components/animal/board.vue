<template>
  <div class="board">
    <div class="block">石头x{{rock}}</div>
    <div class="block">剪刀x{{scissors}}</div>
    <div class="block">布x{{paper}}</div>
  </div>
</template>

<style scoped lang="scss">
  .board{
    border: 1px solid black;
    display: flex;
    .block{
      width: 80px;
      height: 20px;
      line-height: 20px;
      border-left: 1px solid black;
      &:first-child{border-left: none}
      text-align: center;
    }
  }
</style>

<script>
export default {
  name: 'board',
  data () {
    return {
    }
  },
  props: {
    rock: Number,
    scissors: Number,
    paper: Number
  },
  mounted () {
  },
  methods: {
  }
}
</script>
