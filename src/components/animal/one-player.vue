<template>
  <div class="player">
    <div class="name" :class="player.style">{{player.name}}</div>
    <div class="card">
      <div class="item">{{player.rock}}</div>
      <div class="item">{{player.scissors}}</div>
      <div class="item">{{player.paper}}</div>
    </div>
    <div class="star">星*{{player.star}}</div>

    <div v-if="player.status === 'win'" class="mask win"></div>
    <div v-if="player.status === 'lose'" class="mask lose"></div>
  </div>
</template>

<style scoped lang="scss">
  *{
    box-sizing: border-box;
  }
  .player{
    width: 60px;
    margin-right: 2px;
    margin-bottom: 2px;
    border-top: 1px solid black;
    border-left: 1px solid black;
    font-size: 12px;
    position: relative;
    .name{
      width: 100%;
      height: 15px;
      line-height: 15px;
      border-right: 1px solid black;
      border-bottom: 1px solid black;
      font-weight: bold;
      text-align: center;
      white-space: nowrap;
    }
    .card{
      width: 100%;
      height: 15px;
      display: flex;
      flex-flow: row nowrap;
      .item{
        flex: 1 0 0;
        height: 15px;
        line-height: 15px;
        border-right: 1px solid black;
        border-bottom: 1px solid black;
        text-align: center;
      }
    }
    .star{
      width: 100%;
      height: 15px;
      line-height: 15px;
      border-right: 1px solid black;
      border-bottom: 1px solid black;
      text-align: center;
    }
    .mask{
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      &.win{
        background-color: rgba(0,128,0,0.3);
      }
      &.lose{
        background-color: rgba(139,0,0,0.3);
      }
    }
  }
</style>

<script>
export default {
  name: 'one-player',
  data () {
    return {
    }
  },
  props: {
    player: Object
  },
  mounted () {
  },
  methods: {
  }
}
</script>
