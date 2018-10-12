<template>
  <div class="wrap">
    <div v-if="UIController==='create'" class="createUI">
      <div class="title">创建角色</div>
      <div class="control">
        <div class="controlItem">
          <div class="icon red"></div>
          <el-input-number v-model="createData.red" :min="0" :max="getCreateMax('red')"></el-input-number>
        </div>
        <div class="controlItem">
          <div class="icon green"></div>
          <el-input-number v-model="createData.green" :min="0" :max="getCreateMax('green')"></el-input-number>
        </div>
        <div class="controlItem">
          <div class="icon blue"></div>
          <el-input-number v-model="createData.blue" :min="0" :max="getCreateMax('blue')"></el-input-number>
        </div>
        <div class="rest">剩余{{10 - createData.red - createData.green - createData.blue}}点</div>
      </div>
      <div v-if="createData.red + createData.green + createData.blue >= 10" class="startGameBtn able" @click="finishCreate()"><i class="el-icon-check"></i></div>
      <div v-else class="startGameBtn disabled"><i class="el-icon-check"></i></div>
    </div>
    <div v-else-if="UIController==='normal'" class="normalUI"></div>
  </div>
</template>

<style scoped lang="scss">
  .icon{
    width: 30px;
    height: 30px;
    border-radius: 10px;
    &.red{background-color: #f00}
    &.green{background-color: #0f0}
    &.blue{background-color: #00f}
  }
</style>
<style scoped lang="scss">
  .wrap{
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    .createUI{
      width: 400px;
      background-color: white;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0,0,0,.2);
      overflow: hidden;
      .title{
        width: 100%;
        height: 50px;
        line-height: 50px;
        background-color: #ccc;
        color: white;
        font-size: 20px;
        font-weight: bold;
        text-align: center;
      }
      .control{
        width: 100%;
        padding-top: 15px;
        .controlItem{
          width: 100%;
          height: 50px;
          display: flex;
          flex-flow: row nowrap;
          justify-content: center;
          align-items: center;
          .icon{
            margin-right: 30px;
          }
        }
        .rest{
          width: 100%;
          height: 50px;
          line-height: 50px;
          margin-top: 15px;
          background-color: #e5e5e5;
          text-align: center;
          font-size: 16px;
        }
      }
      .startGameBtn{
        width: 100%;
        height: 50px;
        line-height: 50px;
        color: white;
        font-size: 30px;
        text-align: center;
        &.disabled{
          background-color: #ccc;
        }
        &.able{
          background-color: #00b400;
          cursor: pointer;
        }
      }
    }
    .normalUI{
      width: 600px;
      height: 600px;
      background-color: yellow;
    }
  }
</style>

<script>
export default {
  name: "tower",
  data(){
    return{
      UIController: "create",
      createData: {
        red: 0,
        green: 0,
        blue: 0,
      },
      characterData: {
        red: 0,
        green: 0,
        blue: 0,
      },
    }
  },
  mounted(){

  },
  methods: {
    getCreateMax(color){
      if(color === "red") return 10 - this.createData.green - this.createData.blue;
      if(color === "green") return 10 - this.createData.red - this.createData.blue;
      if(color === "blue") return 10 - this.createData.red - this.createData.green;
    },
    finishCreate(){
      this.characterData.red = this.createData.red;
      this.characterData.green = this.createData.green;
      this.characterData.blue = this.createData.blue;
      this.createData.red = 0;
      this.createData.green = 0;
      this.createData.blue = 0;
      this.UIController = "normal";
      alert(this.characterData.red + this.characterData.green + this.characterData.blue);
    }
  }
}
</script>
