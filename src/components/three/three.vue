<template>
  <div class="wrap">
    <div id="container"></div>
  </div>
</template>

<style scoped lang="scss">
  .wrap{
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-flow: row nowrap;
    /*justify-content: center;*/
    /*align-items: center;*/
    #container{
      width: 1000px;
      height: 800px;
      position: relative;
      .dg.ac{
        position: absolute;
        top: 0;
        right: 0;
      }
    }
  }
</style>

<script>
  import * as THREE from 'three'
  import * as Stats from 'stats-js'
  import * as dat from 'dat.gui'

  export default {
    name: "three",
    data(){
      return{
        camera: null,
        scene: null,
        renderer: null,
        stats: null,
        gui: null,
        spotLight: null,
        spotLightHelper: null,
        cubeList: [],
        controls: {
          spotLightX: 0,
          spotLightY: 5,
          spotLightZ: 5,
        },
        trackballControls: null,
        clock: null,
      }
    },
    created(){

    },
    mounted(){
      window.THREE = require("three");
      require("./lib/TrackballControls");

      this.init();
      this.initStats();
      this.initGui();
      this.animate();
    },
    methods: {
      init () {
        let container = document.getElementById('container');

        //scene
        this.scene = new THREE.Scene();

        //camera
        this.camera = new THREE.PerspectiveCamera(70, 1000/800, 0.1, 1000);
        // this.camera = new THREE.OrthographicCamera(-5,5,4,-4, 0.01, 1000);
        this.camera.position.set(20,20,20);
        this.camera.lookAt(0,0,0);
        this.trackballControls = new THREE.TrackballControls(this.camera, container);
        this.clock = new THREE.Clock();

        //render
        this.renderer = new THREE.WebGLRenderer({antialias: true}); //抗锯齿
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.setClearColor("#000");
        this.renderer.shadowMap.enabled = true;

        //light
        let ambientLight = new THREE.AmbientLight("#666");
        this.scene.add(ambientLight);

        this.spotLight = new THREE.SpotLight("#fff");
        this.spotLight.position.set(-25,30,10);
        this.spotLight.distance = 60;
        this.spotLight.angle = 0.5;
        this.spotLight.penumbra = 0.1;
        this.spotLight.castShadow = true;
        this.spotLight.shadow.mapSize.width = 2048;
        this.spotLight.shadow.mapSize.height = 2048;
        this.scene.add(this.spotLight);
        this.spotLightHelper = new THREE.SpotLightHelper(this.spotLight);
        this.scene.add(this.spotLightHelper);

        //object
        this.scene.add(new THREE.AxesHelper(100));

        let plane = new THREE.Mesh(new THREE.PlaneGeometry(50,50), new THREE.MeshPhongMaterial({color: "#6677ff"}));
        plane.rotation.x = -Math.PI / 2;
        plane.receiveShadow = true;
        this.scene.add(plane);

        container.appendChild(this.renderer.domElement);
      },
      addCube(){
        let randomLength = Math.ceil(Math.random()*3);
        let cube = new THREE.Mesh(
          new THREE.BoxGeometry(randomLength, randomLength, randomLength),
          new THREE.MeshPhongMaterial({color: Math.random()*0xffffff})
        );
        cube.position.x = Math.random()*40-20;
        cube.position.z = Math.random()*40-20;
        cube.position.y = Math.random()*10+randomLength/2;
        cube.rotation.x = Math.random()*2*Math.PI;
        cube.rotation.y = Math.random()*2*Math.PI;
        cube.rotation.z = Math.random()*2*Math.PI;
        cube.castShadow = true;
        this.cubeList.push(cube);
        this.scene.add(cube);
      },
      clearAllCube(){
        this.cubeList.forEach(cube => {
          this.scene.remove(cube);
        });
        this.cubeList = [];
      },
      initStats(){
        this.stats = new Stats();
        this.stats.setMode(0);
        this.stats.domElement.style.position = 'fixed';
        this.stats.domElement.style.left = '0px';
        this.stats.domElement.style.top = '0px';
        // document.getElementById("container").appendChild(this.stats.domElement);
        document.body.appendChild(this.stats.domElement);
      },
      initGui(){
        //防止vue重新渲染导致多个gui组件
        let olds = document.getElementsByClassName("dg main a");
        for(let i = 0; i<olds.length; i++){
          olds[i].parentElement.removeChild(olds[i]);
        }

        this.gui = new dat.GUI({width: 400});
        let controls = {
          spotLightX: this.spotLight.position.x,
          spotLightY: this.spotLight.position.y,
          spotLightZ: this.spotLight.position.z,
          spotLightIntensity: this.spotLight.intensity,
          spotLightDistance: this.spotLight.distance,
          spotLightAngle: this.spotLight.angle,
          spotLightPenumbra: this.spotLight.penumbra,
          addCubeBtn: () => {this.addCube();},
          add10CubeBtn: () => {
            for(let i=0; i<10; i++){
              this.addCube();
            }
          },
          clearAllCubeBtn: () => {this.clearAllCube()},
        };
        this.gui.add(controls, "spotLightX", -50, 50, 1).onChange(val => {
          this.spotLight.position.x = val;
        });
        this.gui.add(controls, "spotLightY", -50, 50, 1).onChange(val => {
          this.spotLight.position.y = val;
        });
        this.gui.add(controls, "spotLightZ", -50, 50, 1).onChange(val => {
          this.spotLight.position.z = val;
        });
        this.gui.add(controls, "spotLightIntensity", 0, 2, 0.01).onChange(val => {
          this.spotLight.intensity = val;
        });
        this.gui.add(controls, "spotLightDistance", 0, 100, 1).onChange(val => {
          this.spotLight.distance = val;
        });
        this.gui.add(controls, "spotLightAngle", 0, Math.PI/3, 0.01).onChange(val => {
          this.spotLight.angle = val;
        });
        this.gui.add(controls, "spotLightPenumbra", 0, 1, 0.01).onChange(val => {
          this.spotLight.penumbra = val;
        });
        this.gui.add(controls, "addCubeBtn");
        this.gui.add(controls, "add10CubeBtn");
        this.gui.add(controls, "clearAllCubeBtn");
      },
      animate () {
        //stats
        this.stats.update();

        //trackballControls
        let delta = this.clock.getDelta();
        this.trackballControls.update(delta);

        this.spotLightHelper.update();
        requestAnimationFrame(this.animate);
        this.renderer.render(this.scene, this.camera);
      }
    }
  }
</script>
