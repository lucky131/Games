<template>
  <div class="one-player-simple" :class="player.status">
    <div class="basic">
      <div class="left">
        <div class="row">{{player.name}}</div>
        <div class="row">手牌x{{allCard}}</div>
        <div class="row">星x{{player.star}}</div>
      </div>
      <div class="right">
        <div v-if="player.status === 'playing'" class="btn" @click="toBattle()">对战</div>
      </div>
    </div>
    <div class="log">最近一次对战记录：{{log}}</div>
  </div>
</template>

<style scoped lang="scss">
  .one-player-simple{
    border-bottom: 2px solid black;
    &.win{
      background-color: rgb(179, 217, 179);
    }
    &.lose{
      background-color: rgb(220, 179, 179);
    }
    .basic{
      height: 80px;
      padding: 0 20px;
      display: flex;
      align-items: center;
      .left{
        flex: 1 0 0;
        .row{}
      }
      .right{
        .btn{
          width: 40px;
          height: 40px;
          line-height: 40px;
          background-color: #ccc;
          border-radius: 20px;
          text-align: center;
        }
      }
    }
    .log{
      height: 50px;
      padding: 6px 20px;
      border-top: 1px dashed #999;
      font-size: 12px;
    }
  }
</style>

<script>
export default {
  name: 'one-player-simple',
  data () {
    return {
    }
  },
  props: {
    player: Object,
    log: String
  },
  computed: {
    allCard () {
      return this.player.rock + this.player.scissors + this.player.paper
    }
  },
  mounted () {
  },
  methods: {
    toBattle () {
      this.$emit("toBattle")
    }
  }
}
</script>
