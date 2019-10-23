<template>
  <div class="save">
    <div v-if="!saveData" class="no-save" @click="newSave()">
      <i class="el-icon-circle-plus"></i> {{saveName}}
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
  }
</style>

<script>
  export default {
    name: "save",
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
      }
    }
  }
</script>
