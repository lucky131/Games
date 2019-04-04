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
        controls: null,
        magicCube: {
          block: 0,
          length: 0,
          cubeList: [],
        },
        rotateController: {
          on: false,
          target: 0,
          current: 0,
          step: 0,
          anticlockwise: true,
          v: null,
          quaternion: null,
          indexArray: null,
          indexArray2: null
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

        //magic cube
        this.createMagicCube(3, 5);

        container.appendChild(this.renderer.domElement);

        //event
        container.addEventListener("mousedown", (event) => {
          console.log(event);
        }, false);
      },
      createMagicCube(block, length){
        //先移除旧的魔方
        if(this.magicCube.block > 0){
          let oldBlock = this.magicCube.block;
          for(let i = 0; i < oldBlock; i++){
            for(let j = 0; j < oldBlock; j++){
              for(let k = 0; k < oldBlock; k++){
                this.scene.remove(this.magicCube.cubeList[i][j][k]);
              }
            }
          }
        }
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
      rotateMagicCube(face, level, anticlockwise){
        if(this.magicCube.block > 0 && level >= 0 && level < this.magicCube.block){
          let block = this.magicCube.block;
          if(!this.rotateController.on){
            this.rotateController.on = true;
            this.rotateController.current = 0;
            this.rotateController.target = Math.PI / 2;
            this.rotateController.step = 0.1;
            this.rotateController.anticlockwise = anticlockwise;
            this.rotateController.quaternion = new THREE.Quaternion();
            this.rotateController.indexArray = new Array(block);
            this.rotateController.indexArray2 = new Array(block);
            for(let i = 0; i < block; i++){
              this.rotateController.indexArray[i] = new Array(block);
              this.rotateController.indexArray2[i] = new Array(block);
            }
            switch (face) {
              case "U":
                this.rotateController.v = new THREE.Vector3(0,1,0).normalize();
                for(let i = 0; i < block; i++){
                  for(let j = 0; j < block; j++){
                    this.rotateController.indexArray[i][j] = {v1: level, v2: i, v3: j};
                    this.rotateController.indexArray2[i][j] = anticlockwise ? {v1: level, v2: j, v3: block-1-i} : {v1: level, v2: block-1-j, v3: i};
                  }
                }
                break;
              case "R":
                this.rotateController.v = new THREE.Vector3(1,0,0).normalize();
                for(let i = 0; i < block; i++){
                  for(let j = 0; j < block; j++){
                    this.rotateController.indexArray[i][j] = {v1: j, v2: i, v3: block-1-level};
                    this.rotateController.indexArray2[i][j] = anticlockwise ? {v1: block-1-i, v2: j, v3: block-1-level} : {v1: i, v2: block-1-j, v3: block-1-level};
                  }
                }
                break;
              case "F":
                this.rotateController.v = new THREE.Vector3(0,0,1).normalize();
                for(let i = 0; i < block; i++){
                  for(let j = 0; j < block; j++){
                    this.rotateController.indexArray[i][j] = {v1: i, v2: block-1-level, v3: j};
                    this.rotateController.indexArray2[i][j] = anticlockwise ? {v1: j, v2: block-1-level, v3: block-1-i} : {v1: block-1-j, v2: block-1-level, v3: i};
                  }
                }
                break;
            }
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
        this.controls = {
          blockOfMagicCube: 3,
          lengthOfMagicCube: 5,
          createMagicCubeBtn: () => {this.createMagicCube(this.controls.blockOfMagicCube, this.controls.lengthOfMagicCube)},
          rotateFace: "U",
          rotateLevel: 0,
          anticlockwise: true,
          rotateBtn: () => {this.rotateMagicCube(this.controls.rotateFace, this.controls.rotateLevel, this.controls.anticlockwise)}
        };
        this.gui.add(this.controls, "blockOfMagicCube", 1, 5, 1);
        this.gui.add(this.controls, "lengthOfMagicCube", 1, 10, 1);
        this.gui.add(this.controls, "createMagicCubeBtn");
        this.gui.add(this.controls, "rotateFace", ["U", "R", "F"]);
        this.gui.add(this.controls, "rotateLevel", 0, 4, 1);
        this.gui.add(this.controls, "anticlockwise");
        this.gui.add(this.controls, "rotateBtn");
      },
      animate () {
        //stats
        this.stats.update();

        //trackballControls
        let delta = this.clock.getDelta(); //距离上一帧的秒数
        this.trackballControls.update(delta);

        //rotateController
        if(this.rotateController.on){
          let block = this.magicCube.block;
          if(this.rotateController.current + this.rotateController.step < this.rotateController.target){
            this.rotateController.current += this.rotateController.step;
            let angle = (this.rotateController.anticlockwise ? 1 : -1) * this.rotateController.step;
            this.rotateController.quaternion.setFromAxisAngle(this.rotateController.v, angle);
            for(let i = 0; i < block; i++){
              for(let j = 0; j < block; j++){
                this.magicCube.cubeList
                  [this.rotateController.indexArray[i][j].v1]
                  [this.rotateController.indexArray[i][j].v2]
                  [this.rotateController.indexArray[i][j].v3]
                  .position.applyQuaternion(this.rotateController.quaternion);
                this.magicCube.cubeList
                  [this.rotateController.indexArray[i][j].v1]
                  [this.rotateController.indexArray[i][j].v2]
                  [this.rotateController.indexArray[i][j].v3]
                  .rotateOnWorldAxis(this.rotateController.v, angle);
              }
            }
          } else {
            let angle = (this.rotateController.anticlockwise ? 1 : -1) * (this.rotateController.target - this.rotateController.current);
            this.rotateController.quaternion.setFromAxisAngle(this.rotateController.v, angle);
            for(let i = 0; i < block; i++){
              for(let j = 0; j < block; j++){
                this.magicCube.cubeList
                  [this.rotateController.indexArray[i][j].v1]
                  [this.rotateController.indexArray[i][j].v2]
                  [this.rotateController.indexArray[i][j].v3]
                  .position.applyQuaternion(this.rotateController.quaternion);
                this.magicCube.cubeList
                  [this.rotateController.indexArray[i][j].v1]
                  [this.rotateController.indexArray[i][j].v2]
                  [this.rotateController.indexArray[i][j].v3]
                  .rotateOnWorldAxis(this.rotateController.v, angle);
              }
            }
            //cb
            this.rotateController.on = false;
            let copy = this.copyArray(this.magicCube.cubeList);
            for(let i = 0; i < block; i++){
              for(let j = 0; j < block; j++){
                this.magicCube.cubeList
                  [this.rotateController.indexArray[i][j].v1]
                  [this.rotateController.indexArray[i][j].v2]
                  [this.rotateController.indexArray[i][j].v3] =
                  copy
                    [this.rotateController.indexArray2[i][j].v1]
                    [this.rotateController.indexArray2[i][j].v2]
                    [this.rotateController.indexArray2[i][j].v3];
              }
            }
          }
        }

        requestAnimationFrame(this.animate);
        this.renderer.render(this.scene, this.camera);
      }
    }
  }
</script>
