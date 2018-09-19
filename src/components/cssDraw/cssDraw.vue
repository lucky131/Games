<template>
  <div class="wrap">
    <div class="page">
      <div class="rainy"></div>
    </div>
    <div class="page">
    </div>
  </div>
</template>

<style scoped lang="scss">
  .wrap{
    width: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    align-items: center;
    align-content: center;
    .page{
      width: 100%;
      height: 100vh;
      background-color: #888;
      display: flex;
      flex-flow: row nowrap;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      .rainy{
        width: 15vw;
        height: 15vw;
        border-radius: 50%;
        background-color: #ccc;
        position: relative;
        top: -2vw;
        left: -12vw;
        box-shadow:
          9vw -8vw 0 1vw #ccc,
          9vw 4vw 0 -2vw #ccc,
          20vw -6vw 0 -2vw #ccc,
          19vw 3vw 0 0vw #ccc,
          26vw -1vw 0 -1vw #ccc;
        animation: rainy1 5s ease-in-out infinite;
        @keyframes rainy1 {
          50% { transform: translateY(-5vw); }
        }
        &:before{
          content: '';
          width: 30vw;
          height: 5vw;
          border-radius: 50%;
          background-color: black;
          opacity: 0.2;
          position: absolute;
          top: 27vw;
          left: 5vw;
          animation: rainy2 5s ease-in-out infinite;
          @keyframes rainy2 {
            50% {
              transform: translateY(5vw) scale(0.75);
              opacity: 0.1;
            }
          }
        }
        &:after{
          content: '';
          width: 1vw;
          height: 2vw;
          border-radius: 50%;
          opacity: 0.2;
          position: absolute;
          top: 10vw;
          left: 8vw;
          animation: rainy3 0.75s linear infinite;
          @keyframes rainy3 {
            0% {
              box-shadow:
                1vw 1vw rgba(0,0,0,0),
                14vw -4vw rgba(0,0,0,0),
                22vw 14vw black,
                11vw 12vw black,
                -1vw 9vw black,
                5vw 11vw black,
                17vw 6vw black,
                24vw 1vw black;
            }
            25% {
              box-shadow:
                1vw 5vw black,
                14vw 0vw black,
                22vw 18vw rgba(0,0,0,0),
                11vw 16vw rgba(0,0,0,0),
                -1vw 13vw black,
                5vw 14vw black,
                17vw 10vw black,
                24vw 6vw black;
            }
            25.1% {
              box-shadow:
                1vw 5vw black,
                14vw 0vw black,
                22vw 2vw rgba(0,0,0,0),
                11vw -2vw rgba(0,0,0,0),
                -1vw 13vw black,
                5vw 14vw black,
                17vw 10vw black,
                24vw 6vw black;
            }
            50% {
              box-shadow:
                1vw 9vw black,
                14vw 4vw black,
                22vw 6vw black,
                11vw 2vw black,
                -1vw 17vw rgba(0,0,0,0),
                5vw 17vw rgba(0,0,0,0),
                17vw 14vw black,
                24vw 11vw black;
            }
            50.1% {
              box-shadow:
                1vw 9vw black,
                14vw 4vw black,
                22vw 6vw black,
                11vw 2vw black,
                -1vw 1vw rgba(0,0,0,0),
                5vw 5vw rgba(0,0,0,0),
                17vw 14vw black,
                24vw 11vw black;
            }
            75% {
              box-shadow:
                1vw 13vw black,
                14vw 8vw black,
                22vw 10vw black,
                11vw 7vw black,
                -1vw 5vw black,
                5vw 8vw black,
                17vw 18vw rgba(0,0,0,0),
                24vw 15vw rgba(0,0,0,0);
            }
            75.1% {
              box-shadow:
                1vw 13vw black,
                14vw 8vw black,
                22vw 10vw black,
                11vw 7vw black,
                -1vw 5vw black,
                5vw 8vw black,
                17vw 2vw rgba(0,0,0,0),
                24vw -3vw rgba(0,0,0,0);
            }
            100% {
              box-shadow:
                1vw 17vw rgba(0,0,0,0),
                14vw 12vw rgba(0,0,0,0),
                22vw 14vw black,
                11vw 12vw black,
                -1vw 9vw black,
                5vw 11vw black,
                17vw 6vw black,
                24vw 1vw black;
            }
          }
        }
      }
    }
  }
</style>

<script>
  export default {
    name: "cssDraw",
    data(){
      return {

      }
    },
    mounted(){

    },
    methods: {

    }
  }
</script>
