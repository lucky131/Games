<template>
  <div class="save">
    <div v-if="!saveData" class="no-save" @click="newSave()">
      <i class="el-icon-circle-plus"></i> {{saveName}}
    </div>
    <div v-else class="one-save" @click="startGame()">
      <role :role="saveData"></role>
      <div class="content">{{saveData.name}}</div>
      <i class="el-icon-delete-solid" @click.stop="deleteSave()"></i>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .save{
    width: 100%;
    height: 60px;
    margin-top: 20px;
    &:first-child{margin-top: 0}
    background-color: rgba(168, 129, 151, 0.9);
    border: 2px solid black;
    border-radius: 10px;
    overflow: hidden;
    .no-save{
      width: 100%;
      height: 60px;
      line-height: 56px;
      text-align: center;
      font-size: 20px;
    }
    .one-save{
      width: 100%;
      height: 60px;
      padding: 0 10px;
      display: flex;
      align-items: center;
      .content{
        flex: 1 0 0;
        margin-left: 10px;
      }
      i{
        font-size: 24px;
      }
    }
  }
</style>

<script>
  import role from "./role"
  export default {
    name: "save",
    components: {role},
    props: {
      saveName: String,
      saveData: Object
    },
    data(){
      return{

      }
    },
    mounted(){

    },
    methods: {
      newSave(){
        this.$emit("newSave");
      },
      startGame(){
        this.$emit("startGame");
      },
      deleteSave(){
        this.$emit("deleteSave");
      }
    }
  }
</script>
