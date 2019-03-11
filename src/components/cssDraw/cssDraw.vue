<template>
  <div class="wrap">
    <div class="page" style="background-color: #888">
      <div class="rainy"></div>
    </div>
    <div class="page" style="background-color: white">
      <div class="rainbow"></div>
    </div>
    <div class="page" style="background-color: #4fb8ff">
      <div class="mask clockMask time"></div>
      <div class="clock">
        <div class="body"></div>
        <div class="tick top"></div>
        <div class="tick right"></div>
        <div class="tick bottom"></div>
        <div class="tick left"></div>
        <div class="needle hour time"></div>
        <div class="needle minute time"></div>
        <div class="needle second time"></div>
        <div class="center"></div>
        <div class="shadow time"></div>
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
        <div class="track mercuryTrack"></div>
        <div class="track venusTrack"></div>
        <div class="track earthTrack"></div>
        <div class="track marsTrack"></div>
        <div class="track jupiterTrack"></div>
        <div class="track saturnTrack"></div>
        <div class="sun"></div>
        <div class="planet mercury time"></div>
        <div class="planet venus time"></div>
        <div class="planet earth time"></div>
        <div class="planet mars time"></div>
        <div class="planet jupiter time"></div>
        <div class="planet saturn time"></div>
      </div>
    </div>
    <div class="page" style="background-color: white">
      <div class="mask windmillMask"></div>
      <div class="windmill">
        <div class="wrap">
          <div class="fan fan1"></div>
          <div class="fan fan2"></div>
          <div class="fan fan3"></div>
          <div class="fan fan4"></div>
          <div class="circle"></div>
        </div>
      </div>
    </div>
    <div class="page" style="background-color: black;">
      <div class="eye">
        <div class="wheel">
          <div class="circle big"></div>
          <div class="circle small"></div>
          <div class="oneTick" v-for="n in 50" :key="n" :style="{transform1: 'rotate('+(n*7.2)+'deg)'}">
            <div class="tick left"></div>
            <div class="tick right"></div>
          </div>
        </div>
        <div class="bottom top"></div>
        <div class="bottom left"></div>
        <div class="bottom right"></div>
        <div class="ground"></div>
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
      .mask{
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 100;
        &.clockMask{
          animation: clockMask 86400s linear infinite;
          @keyframes clockMask {
            0%{
              background-color: rgba(0, 0, 0, 0.7);
            }
            15%{
              background-color: rgba(0, 0, 0, 0.6);
            }
            25%{
              background-color: rgba(65, 65, 32, 0.5);
            }
            35%{
              background-color: rgba(176, 176, 89, 0.3);
            }
            45%{
              background-color: rgba(255,255,255,0);
            }
            55%{
              background-color: rgba(255,255,255,0);
            }
            65%{
              background-color: rgba(184, 51, 48, 0.3);
            }
            75%{
              background-color: rgba(82, 23, 21, 0.5);
            }
            85%{
              background-color: rgba(0, 0, 0, 0.6);
            }
            100%{
              background-color: rgba(0, 0, 0, 0.7);
            }
          }
        }
      }
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
        position: relative;
        .body{
          width: 30vw;
          height: 30vw;
          border-radius: 50%;
          background-color: white;
          box-shadow: 0 0 0 2vw #97dfff;
          position: absolute;
          z-index: 2;
        }
        .tick{
          width: 0.4vw;
          height: 2vw;
          background-color: #666;
          position: absolute;
          top: 1vw;
          left: 14.8vw;
          z-index: 3;
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
            z-index: 4;
            animation-duration: 43200s;
          }
          &.minute{
            width: 0.6vw;
            height: 12vw;
            border-radius: 0.3vw 0.3vw 0 0;
            background-color: #999;
            top: 3vw;
            left: 14.7vw;
            z-index: 5;
            animation-duration: 3600s;
          }
          &.second{
            width: 0.2vw;
            height: 12vw;
            border-radius: 0.1vw 0.1vw 0 0;
            background-color: red;
            top: 3vw;
            left: 14.9vw;
            z-index: 6;
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
          z-index: 7;
        }
        .shadow{
          width: 34vw;
          height: 34vw;
          position: absolute;
          top: 15vw;
          left: -2vw;
          z-index: 1;
          background: linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,.3), rgba(0,0,0,.1), rgba(0,0,0,0));
          transform-origin: 50% 0;
          animation: shadow 86400s linear infinite;
          @keyframes shadow {
            0%{
              transform: rotate(180deg) scaleY(2);
              opacity: 0;
            }
            25%{
              transform: rotate(90deg) scaleY(2);
              opacity: 0;
            }
            50%{
              transform: rotate(0deg) scaleY(0.8);
              opacity: 1;
            }
            75%{
              transform: rotate(-90deg) scaleY(2);
              opacity: 0;
            }
            100%{
              transform: rotate(-180deg) scaleY(2);
              opacity: 0;
            }
          }
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
          border-radius: 50%;
          border: 0.2vw solid #404060;
          box-sizing: border-box;
          position: absolute;
          &.mercuryTrack{
            width: 14.2vw;
            height: 14.2vw;
            top: 22.9vw;
            left: 22.9vw;
          }
          &.venusTrack{
            width: 20.2vw;
            height: 20.2vw;
            top: 19.9vw;
            left: 19.9vw;
          }
          &.earthTrack{
            width: 26.2vw;
            height: 26.2vw;
            top: 16.9vw;
            left: 16.9vw;
          }
          &.marsTrack{
            width: 32.2vw;
            height: 32.2vw;
            top: 13.9vw;
            left: 13.9vw;
          }
          &.jupiterTrack{
            width: 38.2vw;
            height: 38.2vw;
            top: 10.9vw;
            left: 10.9vw;
          }
          &.saturnTrack{
            width: 44.2vw;
            height: 44.2vw;
            top: 7.9vw;
            left: 7.9vw;
          }
        }
        .sun{
          width: 10vw;
          height: 10vw;
          border-radius: 50%;
          background: radial-gradient(#ff7a19, #ffa529, #FFFF59, rgba(0,0,0,0) 70.7%);
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
            opacity: 0.6;
            animation: sun 2s ease-in-out infinite;
            @keyframes sun {
              50% {
                transform: scale(1.2);
                opacity: 0.9;
              }
            }
          }
        }
        .planet{
          border-radius: 50%;
          position: absolute;
          animation: planet linear infinite;
          @keyframes planet {
            100% {
              transform: rotate(-360deg);
            }
          }
          &.mercury{
            width: 0.8vw;
            height: 0.8vw;
            background-color: #d19c00;
            top: 22.6vw;
            left: 29.6vw;
            transform-origin: 50% 7.4vw;
            animation-duration: 8.8s;
          }
          &.venus{
            width: 2vw;
            height: 2vw;
            background-color: #cbae86;
            top: 19vw;
            left: 29vw;
            transform-origin: 50% 11vw;
            animation-duration: 22.5s;
          }
          &.earth{
            width: 2vw;
            height: 2vw;
            background-color: #3d4e83;
            /*background: linear-gradient(#000, #3d4e83);*/
            top: 16vw;
            left: 29vw;
            transform-origin: 50% 14vw;
            animation-duration: 36.5s;
            &:before{
              content: "";
              width: 3.8vw;
              height: 3.8vw;
              border-radius: 50%;
              border: 0.2vw solid #404060;
              box-sizing: border-box;
              position: absolute;
              top: -0.9vw;
              left: -0.9vw;
            }
            &:after{
              content: "";
              width: 0.6vw;
              height: 0.6vw;
              border-radius: 50%;
              background-color: yellow;
              position: absolute;
              top: -1.1vw;
              left: 0.7vw;
              transform-origin: 50% 2.1vw;
              animation: moon 3.0s linear infinite;
              @keyframes moon {
                100% {
                  transform: rotate(-360deg);
                }
              }
            }
          }
          &.mars{
            width: 1vw;
            height: 1vw;
            background-color: #b06535;
            top: 13.5vw;
            left: 29.5vw;
            transform-origin: 50% 16.5vw;
            animation-duration: 68.7s;
          }
          &.jupiter{
            width: 4vw;
            height: 4vw;
            background: linear-gradient(#a4937b, #cad2e3, #b2847e, #cad2e3, #b2847e, #cad2e3, #a4937b);
            top: 9vw;
            left: 28vw;
            transform-origin: 50% 21vw;
            animation-duration: 233.0s;
          }
          &.saturn{
            width: 3.6vw;
            height: 3.6vw;
            background-color: #e8d3a6;
            top: 6.2vw;
            left: 28.2vw;
            transform-origin: 50% 23.8vw;
            animation-duration: 483.2s;
          }
        }
      }
      .windmill{
        width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        .wrap{
          width: 40vw;
          height: 40vw;
          position: relative;
          transform-origin: 50% 50%;
          animation: windmill 2s linear infinite;
          @keyframes windmill {
            100%{
              transform: rotate(360deg);
            }
          }
          .fan{
            width: 10vw;
            height: 10vw;
            position: absolute;
            top: 10vw;
            left: 20vw;
            transform-origin: 0 100%;
            &:before{
              content: "";
              position: absolute;
              border-top: 0 solid transparent;
              border-left: 10vw solid transparent;
              border-right: 10vw solid transparent;
              border-bottom: 10vw solid;
            }
            &:after{
              content: "";
              width: 2vw;
              height: 2vw;
              top: -0.23vw;
              left: 9.64vw;
              position: absolute;
              border-radius: 0 100% 0 0;
              box-shadow: 0.4vw -0.4vw 0 0.35vw white;
              transform-origin: 0 100%;
              transform: rotate(-17.5deg) skew(17.5deg, 17.5deg);
            }
            &.fan1{
              background: linear-gradient(#e74c3c 30%, #3d1510);
              transform: rotate(0deg);
              &:before{
                border-bottom-color: #e74c3c;
              }
              &:after{
                background-color: #e74c3c;
              }
            }
            &.fan2{
              background: linear-gradient(#f1c43c 30%, #483c12);
              transform: rotate(90deg);
              &:before{
                border-bottom-color: #f1c43c;
              }
              &:after{
                background-color: #f1c43c;
              }
            }
            &.fan3{
              background: linear-gradient(#2ecc75 30%, #134c2c);
              transform: rotate(180deg);
              &:before{
                border-bottom-color: #2ecc75;
              }
              &:after{
                background-color: #2ecc75;
              }
            }
            &.fan4{
              background: linear-gradient(#598ecd 30%, #1c2c3f);
              transform: rotate(270deg);
              &:before{
                border-bottom-color: #598ecd;
              }
              &:after{
                background-color: #598ecd;
              }
            }
          }
          .circle{
            width: 2vw;
            height: 2vw;
            border-radius: 50%;
            position: absolute;
            background-color: white;
            top: 19vw;
          }
        }
      }
      .eye{
        width: 48vw;
        height: 48vw;
        position: relative;
        .wheel{
          width: 48vw;
          height: 48vw;
          position: absolute;
          transform-origin: 50% 50%;
          animation: wheel 300s linear infinite;
          @keyframes wheel {
            100%{
              transform: rotate(360deg);
            }
          }
          .circle{
            border-radius: 50%;
            border: 0.3vw solid white;
            box-sizing: border-box;
            box-shadow: 0 0 1vw white;
            position: absolute;
            z-index: 1;
            &.big{
              width: 48vw;
              height: 48vw;
            }
            &.small{
              width: 42vw;
              height: 42vw;
              top: 3vw;
              left: 3vw;
            }
          }
          .oneTick{
            width: 8vw;
            height: 24vw;
            position: absolute;
            top: 0;
            left: 20vw;
            transform-origin: 50% 100%;
            .tick{
              width: 0.3vw;
              height: 3.5vw;
              background-color: #ff7b7b;
              border-radius: 0.15vw;
              box-shadow: 0 0 1vw #ff0000;
              position: absolute;
              top: 0;
              left: 3.85vw;
              transform-origin: 50% 0;
              &.left{
                transform: rotate(22deg);
              }
              &.right{
                transform: rotate(-22deg);
              }
            }
          }
        }
        .bottom{
          width: 4vw;
          border-radius: 0.5vw 0.5vw 0 0;
          background: linear-gradient(yellow, #727200, #313100 80%);
          position: absolute;
          left: 22vw;
          transform-origin: 50% 100%;
          &.top{
            height: 12vw;
            top: 22vw;
          }
          &.left{
            height: 44vw;
            top: -10vw;
            transform: rotate(240deg);
          }
          &.right{
            height: 44vw;
            top: -10vw;
            transform: rotate(120deg);
          }
        }
        .ground{
          width: 1000vw;
          height: 1000vw;
          border-radius: 50%;
          background-color: #222;
          position: absolute;
          top: 50vw;
          left: -476vw;
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
      //css animation-delay
      let date = new Date();
      let h = date.getHours();
      let m = date.getMinutes();
      let s = date.getSeconds();
      let totalS = h*60*60 + m*60 + s;
      $(".time").css("animation-delay", "-"+totalS+"s");

      //定位某index
      if(this.$route.query.index){
        let index = this.$route.query.index;
        let pageHeight = window.innerHeight;
        $(document).scrollTop(index * pageHeight);
      }
    },
    methods: {
      test(){
        $(".windmill .wrap").css("animation-duration", "20s");
      }
    }
  }
</script>
