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
        res: {},
        camera: null,
        scene: null,
        renderer: null,
        stats: null,
        gui: null,
        controls: null,
      }
    },
    mounted(){
      this.loadRes();
      this.init();
      this.initStats();
      this.initGui();
      this.animate();
    },
    methods: {
      loadRes(){

      },
      init(){
        let container = document.getElementById('container');

        //scene
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2("#ccc", 0.005);
        this.scene.add(new THREE.AxesHelper(50));

        //camera
        // this.camera = new THREE.PerspectiveCamera(50, 1000/800, 0.1, 1000);
        this.camera = new THREE.OrthographicCamera(-50,50,40,-40, 0.01, 1000);
        this.camera.position.set(10,10,10);
        this.camera.lookAt(0,0,0);

        //render
        this.renderer = new THREE.WebGLRenderer({antialias: true}); //抗锯齿
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.setClearColor("#ccc");
        this.renderer.shadowMap.enabled = true;

        //light
        let ambientLight = new THREE.AmbientLight("#fff");
        this.scene.add(ambientLight);

        //cube
        let cube = new THREE.Mesh(
          new THREE.BoxGeometry(2,2,2),
          new THREE.MeshPhongMaterial({color: "#00f"})
        );
        cube.position.set(0,0,0);
        this.scene.add(cube);

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

        this.gui = new dat.GUI({width: 400});
        this.controls = {

        };
        // this.gui.add(this.controls, "blockOfMagicCube", 3, 5, 1);
      },
      animate(){
        //stats
        this.stats.update();

        requestAnimationFrame(this.animate);
        this.renderer.render(this.scene, this.camera);
      },
    }
  }
</script>
