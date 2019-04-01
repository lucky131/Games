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
        res: {},
        camera: null,
        scene: null,
        renderer: null,
        stats: null,
        gui: null,
        spotLight: null,
        spotLightHelper: null,
        magicCube: {
          block: 0,
          length: 0,
          cubeList: [],
        },
        rotateController: {
          on: false,
          target: 0,
        },
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

      this.loadRes();
      this.init();
      this.initStats();
      this.initGui();
      this.animate();
    },
    methods: {
      loadRes(){
        this.res.right = new THREE.TextureLoader().load(require("./img/red.png"));
        this.res.left = new THREE.TextureLoader().load(require("./img/orange.png"));
        this.res.up = new THREE.TextureLoader().load(require("./img/white.png"));
        this.res.down = new THREE.TextureLoader().load(require("./img/yellow.png"));
        this.res.front = new THREE.TextureLoader().load(require("./img/green.png"));
        this.res.back = new THREE.TextureLoader().load(require("./img/blue.png"));
      },
      init () {
        let container = document.getElementById('container');

        //scene
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2("#ccc", 0.005)

        //camera
        this.camera = new THREE.PerspectiveCamera(50, 1000/800, 0.1, 1000);
        // this.camera = new THREE.OrthographicCamera(-50,50,40,-40, 0.01, 1000);
        this.camera.position.set(15,20,30);
        this.camera.lookAt(0,0,0);
        this.trackballControls = new THREE.TrackballControls(this.camera, container);
        this.trackballControls.rotateSpeed = 0.3;
        this.trackballControls.zoomSpeed = 0.5;
        this.clock = new THREE.Clock();

        //render
        this.renderer = new THREE.WebGLRenderer({antialias: true}); //抗锯齿
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.setClearColor("#ccc");
        this.renderer.shadowMap.enabled = true;

        //light
        let ambientLight = new THREE.AmbientLight("#fff");
        this.scene.add(ambientLight);

        this.spotLight = new THREE.SpotLight("#fff");
        this.spotLight.position.set(-25,30,10);
        this.spotLight.distance = 60;
        this.spotLight.angle = 0.5;
        this.spotLight.penumbra = 0.1;
        this.spotLight.castShadow = true;
        this.spotLight.shadow.mapSize.width = 2048;
        this.spotLight.shadow.mapSize.height = 2048;
        // this.scene.add(this.spotLight);

        //helper
        this.scene.add(new THREE.AxesHelper(100));
        this.spotLightHelper = new THREE.SpotLightHelper(this.spotLight);
        // this.scene.add(this.spotLightHelper);

        //plane
        let plane = new THREE.Mesh(new THREE.PlaneGeometry(50,50), new THREE.MeshPhongMaterial({color: "#6677ff"}));
        plane.rotation.x = -Math.PI / 2;
        plane.receiveShadow = true;
        // this.scene.add(plane);

        //magic cube
        this.createMagicCube(3, 5);

        container.appendChild(this.renderer.domElement);
      },
      rotate2DMatrixArray(originArray, block){

      },
      createMagicCube(block, length){
        this.magicCube.block = block;
        this.magicCube.length = length;
        this.magicCube.cubeList = new Array(block);
        let index = 0;
        for(let i = 0; i < block; i++){
          this.magicCube.cubeList[i] = new Array(block);
          for(let j = 0; j < block; j++){
            this.magicCube.cubeList[i][j] = new Array(block);
            for(let k = 0; k < block; k++){
              let cube = this.getCube(index++,block,length);
              this.magicCube.cubeList[i][j][k] = cube;
              this.scene.add(cube);
            }
          }
        }
      },
      getCube(index, block, length){
        if(index < 0 || index >= block*block*block) return null;
        let inside = new THREE.MeshPhongMaterial({color: "#000"});
        let materials = [inside, inside, inside, inside, inside, inside];
        if(index < block*block)
          materials[2] = new THREE.MeshPhongMaterial({map: this.res.up});
        if(index >= block*block*block - block*block)
          materials[3] = new THREE.MeshPhongMaterial({map: this.res.down});
        if(index % block === block - 1)
          materials[0] = new THREE.MeshPhongMaterial({map: this.res.right});
        if(index % block === 0)
          materials[1] = new THREE.MeshPhongMaterial({map: this.res.left});
        if(index % (block * block) >= block*block-block)
          materials[4] = new THREE.MeshPhongMaterial({map: this.res.front});
        if(index % (block * block) < block)
          materials[5] = new THREE.MeshPhongMaterial({map: this.res.back});
        let geometry = new THREE.BoxGeometry(length, length, length);
        let cube = new THREE.Mesh(geometry, materials);
        let x = (index%block - (block-1)/2)*length;
        let y = ((block-1)/2 - Math.floor(index/(block*block)))*length;
        let z = (Math.floor(index%(block*block)/block) - (block-1)/2)*length;
        cube.position.set(x,y,z);
        cube.index = index;
        return cube;
      },
      copyArray(array){
        let result = [];
        array.forEach(n => {
          if(n instanceof Array)
            result.push(this.copyArray(n));
          else
            result.push(n);
        });
        return result;
      },
      top(){
        let block = this.magicCube.block;
        let quaternion = new THREE.Quaternion();
        let v = new THREE.Vector3(0,1,0).normalize();
        quaternion.setFromAxisAngle(v, Math.PI/2);
        for(let i = 0; i < block; i++){
          for(let j = 0; j < block; j++){
            this.magicCube.cubeList[0][i][j].position.applyQuaternion(quaternion);
            this.magicCube.cubeList[0][i][j].rotateOnAxis(v, Math.PI/2);
          }
        }
        let copy = this.copyArray(this.magicCube.cubeList);
        for(let i = 0; i < block; i++){
          for(let j = 0; j < block; j++){
            this.magicCube.cubeList[0][i][j] = copy[0][j][block-1-i];
          }
        }
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
          topBtn: () => {this.top();},
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
        this.gui.add(controls, "topBtn");
      },
      animate () {
        //stats
        this.stats.update();

        //trackballControls
        let delta = this.clock.getDelta(); //距离上一帧的秒数
        this.trackballControls.update(delta);

        // this.spotLightHelper.update();

        requestAnimationFrame(this.animate);
        this.renderer.render(this.scene, this.camera);
      }
    }
  }
</script>
