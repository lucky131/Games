<template>
  <div class="player" :class="player.status">
    <div class="name" :class="player.style">{{player.name}}</div>
    <div class="card">
      <div class="item">{{player.rock}}</div>
      <div class="item">{{player.scissors}}</div>
      <div class="item">{{player.paper}}</div>
    </div>
    <div class="star">星*{{player.star}}</div>
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
    &.win{
      background-color: rgb(179, 217, 179);
    }
    &.lose{
      background-color: rgb(220, 179, 179);
    }
    .name{
      width: 100%;
      height: 15px;
      line-height: 15px;
      border-right: 1px solid black;
      border-bottom: 1px solid black;
      text-align: center;
      white-space: nowrap;
      text-shadow: 1px 1px 0 black,
      -1px 1px 0 black,
      1px -1px 0 black,
      -1px -1px 0 black,
      0px 1px 0 black,
      0px -1px 0 black,
      1px 0px 0 black,
      -1px 0px 0 black;
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
