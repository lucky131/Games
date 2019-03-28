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
    justify-content: center;
    align-items: center;
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
        controls: {

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
        this.camera = new THREE.PerspectiveCamera(70, 1000/800, 0.1, 100);
        // this.camera = new THREE.OrthographicCamera(-5,5,4,-4, 0.01, 100);
        this.camera.position.set(5,5,5);
        this.camera.lookAt(0,0,0);
        this.trackballControls = new THREE.TrackballControls(this.camera, container);
        this.clock = new THREE.Clock();

        //render
        this.renderer = new THREE.WebGLRenderer({antialias: true}); //抗锯齿
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.setClearColor("#eee");
        this.renderer.shadowMap.enabled = true;

        //object
        this.scene.add(new THREE.AxesHelper(10));

        let box = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshLambertMaterial({color: "#ff773d"}));
        box.position.y = 0.5;
        box.castShadow = true;
        this.scene.add(box);

        let plane = new THREE.Mesh(new THREE.PlaneGeometry(10,4), new THREE.MeshLambertMaterial({color: "#6673ff"}));
        plane.rotation.x = -Math.PI / 2;
        plane.receiveShadow = true;
        this.scene.add(plane);

        let ambientLight = new THREE.AmbientLight("#666");
        this.scene.add(ambientLight);

        let spotLight = new THREE.SpotLight("#fff");
        spotLight.position.set(0,5,5);
        spotLight.castShadow = true;
        spotLight.shadow.mapSize.width = 2048;
        spotLight.shadow.mapSize.height = 2048;
        this.scene.add(spotLight);

        container.appendChild(this.renderer.domElement);
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

        this.gui = new dat.GUI();
        // this.gui.add(this.controls, "cameraX", -10, 10);
      },
      animate () {
        this.stats.update();
        let delta = this.clock.getDelta();
        this.trackballControls.update(delta);
        requestAnimationFrame(this.animate);
        this.renderer.render(this.scene, this.camera);
      }
    }
  }
</script>
