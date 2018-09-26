<template>
  <div class="wrap">
    <div class="page" style="background-color: #888">
      <div class="rainy"></div>
    </div>
    <div class="page" style="background-color: white">
      <div class="rainbow"></div>
    </div>
    <div class="page" style="background-color: #4fb8ff">
      <div class="clock">
        <div class="tick top"></div>
        <div class="tick right"></div>
        <div class="tick bottom"></div>
        <div class="tick left"></div>
        <div class="needle hour"></div>
        <div class="needle minute"></div>
        <div class="needle second"></div>
        <div class="center"></div>
        <div class="shadow"></div>
      </div>
    </div>
    <div class="page" style="background-color: white">
      <div class="wx">
        <div class="head1"></div>
        <div class="head2"></div>
      </div>
    </div>
    <div class="page" style="background-color: #00002b">
      <div class="solar">
        <div class="track"></div>
        <div class="sun"></div>
        <div class="earth"></div>
      </div>
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
          content: "";
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
          content: "";
          width: 1vw;
          height: 2vw;
          border-radius: 50%;
          opacity: 0.2;
          position: absolute;
          top: 10vw;
          left: 8vw;
          animation: rainy3 0.5s linear infinite;
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
                14vw 0 black,
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
                14vw 0 black,
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
      .rainbow{
        width: 20vw;
        height: 20vw;
        border-radius: 100% 0 0 0;
        background-color: transparent;
        position: relative;
        transform: rotate(50deg);
        box-shadow:
          -0.5vw -0.5vw 0 0.5vw #a900ff,
          -1.0vw -1.0vw 0 1.0vw #0a00ff,
          -1.5vw -1.5vw 0 1.5vw #00dbff,
          -2.0vw -2.0vw 0 2.0vw #00ff1d,
          -2.5vw -2.5vw 0 2.5vw #fdff00,
          -3.0vw -3.0vw 0 3.0vw #ff9000,
          -3.5vw -3.5vw 0 3.5vw #ff0400;
        animation: rainbow1 5s ease-in-out infinite;
        @keyframes rainbow1 {
          50% { transform: rotate(40deg); }
        }
        &:before{
          content: "";
          width: 30vw;
          height: 5vw;
          border-radius: 50%;
          background-color: black;
          opacity: 0.2;
          position: absolute;
          top: 18vw;
          left: 8vw;
          transform: rotate(-50deg);
          transform-origin: 50% 50%;
          animation: rainbow2 5s ease-in-out infinite;
          @keyframes rainbow2 {
            50% {
              transform: scale(0.75) rotate(-40deg) translateX(-3vw);
              opacity: 0.1;
            }
          }
        }
      }
      .clock{
        width: 30vw;
        height: 30vw;
        border-radius: 50%;
        background-color: white;
        box-shadow: 0 0 0 2vw #97dfff;
        position: relative;
        .tick{
          width: 0.4vw;
          height: 2vw;
          background-color: #666;
          position: absolute;
          top: 1vw;
          left: 14.8vw;
          z-index: 1;
          transform-origin: 50% 14vw;
          &.top{transform: rotate(0deg)}
          &.right{transform: rotate(90deg)}
          &.bottom{transform: rotate(180deg)}
          &.left{transform: rotate(270deg)}
        }
        .needle{
          position: absolute;
          transform-origin: 50% 100%;
          animation: needle linear infinite;
          @keyframes needle {
            100% {
              transform: rotate(360deg);
            }
          }
          &.hour{
            width: 0.8vw;
            height: 8vw;
            border-radius: 0.4vw 0.4vw 0 0;
            background-color: #999;
            top: 7vw;
            left: 14.6vw;
            z-index: 1;
            animation-duration: 43200s;
          }
          &.minute{
            width: 0.6vw;
            height: 12vw;
            border-radius: 0.3vw 0.3vw 0 0;
            background-color: #999;
            top: 3vw;
            left: 14.7vw;
            z-index: 2;
            animation-duration: 3600s;
          }
          &.second{
            width: 0.2vw;
            height: 12vw;
            border-radius: 0.1vw 0.1vw 0 0;
            background-color: red;
            top: 3vw;
            left: 14.9vw;
            z-index: 3;
            animation-duration: 60s;
          }
        }
        .center{
          width: 2vw;
          height: 2vw;
          border-radius: 50%;
          background-color: #666;
          position: absolute;
          top: 14vw;
          left: 14vw;
          z-index: 4;
        }
        .shadow{
          width: 34vw;
          height: 34vw;
          position: absolute;
          top: -2vw;
          left: -2vw;
          z-index: 5;
          background: linear-gradient(90deg, rgba(0,0,0,.339), rgba(0,0,0,.134), rgba(0,0,0,.032), rgba(0,0,0,0));
          transform: rotate(45deg) translateX(17vw);
        }
      }
      .wx{
        width: 25vw;
        height: 25vw;
        border-radius: 5vw;
        background-color: #00D00C;
        position: relative;
        .head1{
          width: 15vw;
          height: 12vw;
          border-radius: 50%;
          border: 0.2vw solid #00D00C;
          box-sizing: border-box;
          background-color: white;
          position: absolute;
          top: 4vw;
          left: 1vw;
          &:before{
            content: "";
            border-top: 0 solid transparent;
            border-left: 2vw solid transparent;
            border-right: 2vw solid transparent;
            border-bottom: 3.5vw solid white;
            position: absolute;
            top: 9.5vw;
            left: 2vw;
            transform: rotate(210deg);
          }
          &:after{
            content: "";
            width: 1vw;
            height: 1vw;
            border-radius: 50%;
            position: absolute;
            box-shadow:
              4.7vw 3.7vw #00D00C,
              9.3vw 3.7vw #00D00C;
          }
        }
        .head2{
          width: 13vw;
          height: 11vw;
          border-radius: 50%;
          border: 0.2vw solid #00D00C;
          box-sizing: border-box;
          background-color: white;
          position: absolute;
          top: 8vw;
          left: 10vw;
          &:before{
            content: "";
            border-top: 0 solid transparent;
            border-left: 2vw solid transparent;
            border-right: 2vw solid transparent;
            border-bottom: 3.5vw solid white;
            position: absolute;
            top: 8vw;
            left: 8vw;
            transform: rotate(150deg);
          }
          &:after{
            content: "";
            width: 1vw;
            height: 1vw;
            border-radius: 50%;
            position: absolute;
            box-shadow:
              4vw 3vw #00D00C,
              8vw 3vw #00D00C;
          }
        }
      }
      .solar{
        width: 60vw;
        height: 60vw;
        position: relative;
        .track{
          width: 28.2vw;
          height: 28.2vw;
          border-radius: 50%;
          border: 0.2vw solid #404060;
          box-sizing: border-box;
          position: absolute;
          top: 15.9vw;
          left: 15.9vw;
        }
        .sun{
          width: 10vw;
          height: 10vw;
          border-radius: 50%;
          background: radial-gradient(#ff9e14, #ffd01f, #FFFF59, rgba(0,0,0,0) 70.7%);
          position: absolute;
          top: 25vw;
          left: 25vw;
          &:before{
            content: "";
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: radial-gradient(#FFFF59, rgba(0,0,0,0) 70.7%);
            position: absolute;
            opacity: 0.5;
            animation: sun 2s ease-in-out infinite;
            @keyframes sun {
              50% {
                transform: scale(1.2);
                opacity: 0.8;
              }
            }
          }
        }
        .earth{
          width: 2vw;
          height: 2vw;
          border-radius: 50%;
          background-color: #3a8ee6;
          position: absolute;
          top: 15vw;
          left: 29vw;
          transform-origin: 50% 15vw;
          animation: earth 36.5s linear infinite;
          @keyframes earth {
            100% {
              transform: rotate(-360deg);
            }
          }
          &:before{
            content: "";
            width: 4.8vw;
            height: 4.8vw;
            border-radius: 50%;
            border: 0.2vw solid #404060;
            box-sizing: border-box;
            position: absolute;
            top: -1.4vw;
            left: -1.4vw;
          }
          &:after{
            content: "";
            width: 0.6vw;
            height: 0.6vw;
            border-radius: 50%;
            background-color: yellow;
            position: absolute;
            top: -1.6vw;
            left: 0.7vw;
            transform-origin: 50% 2.6vw;
            animation: moon 3.0s linear infinite;
            @keyframes moon {
              100% {
                transform: rotate(-360deg);
              }
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
      let date = new Date();
      let h = date.getHours();
      let m = date.getMinutes();
      let s = date.getSeconds();
      let totalS = h*60*60 + m*60 + s;
      $(".needle").css("animation-delay", "-"+totalS+"s");

      if(this.$route.query.index){
        let index = this.$route.query.index;
        let pageHeight = window.innerHeight;
        $(document).scrollTop(index * pageHeight);
      }
    },
    methods: {

    }
  }
</script>
