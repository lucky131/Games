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
        mouse: null,
        raycaster: null,
        magicCube: {
          block: 0,
          length: 0,
          cubeList: [],
        },
        clickController: {
          on: false,
          cube: null,
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
        cameraController: null,
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
        this.scene.fog = new THREE.FogExp2("#ccc", 0.005);
        this.scene.add(new THREE.AxesHelper(50));

        //camera
        this.camera = new THREE.PerspectiveCamera(50, 1000/800, 0.1, 1000);
        // this.camera = new THREE.OrthographicCamera(-50,50,40,-40, 0.01, 1000);
        this.camera.position.set(15,20,30);
        this.camera.lookAt(0,0,0);
        this.cameraController = new THREE.TrackballControls(this.camera, container);
        this.cameraController.rotateSpeed = 0.2;
        this.cameraController.zoomSpeed = 1;
        this.cameraController.dynamicDampingFactor = 0.5;
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

        //mouse
        this.mouse = new THREE.Vector2();

        //raycaster
        this.raycaster = new THREE.Raycaster();

        //event
        container.addEventListener("mousedown", (event) => {
          this.mouse.x = (event.offsetX/event.target.width)*2-1;
          this.mouse.y = -(event.offsetY/event.target.height)*2+1;

          this.raycaster.setFromCamera(this.mouse, this.camera);
          let intersects = this.raycaster.intersectObjects(this.scene.children).filter(n => n.object.isCube);
          if(intersects.length > 0){
            this.clickController.on = true;
            this.clickController.cube = intersects[0].object;
            this.cameraController.enabled = false;
          }
        }, false);
        container.addEventListener("mouseup", (event) => {
          if(this.clickController.on){
            this.mouse.x = (event.offsetX/event.target.width)*2-1;
            this.mouse.y = -(event.offsetY/event.target.height)*2+1;

            this.raycaster.setFromCamera(this.mouse, this.camera);
            let intersects = this.raycaster.intersectObjects(this.scene.children).filter(n => n.object.isCube);
            if(intersects.length > 0){
              let before = {
                i: this.clickController.cube.positionIndex.i,
                j: this.clickController.cube.positionIndex.j,
                k: this.clickController.cube.positionIndex.k
              };
              let after = {
                i: intersects[0].object.positionIndex.i,
                j: intersects[0].object.positionIndex.j,
                k: intersects[0].object.positionIndex.k
              };
              if(before.i !== after.i || before.j !== after.j || before.k !== after.k){
                if(before.i === after.i && before.j !== after.j && before.k !== after.k){
                  let direction = this.judgeRotateDirection(before.j, before.k, after.j, after.k);
                  if(direction !== 0){
                    this.rotateMagicCube("U", before.i, direction===1 ? true: false);
                  }
                } else if(before.k === after.k && before.i !== after.i && before.j !== after.j){
                  let direction = this.judgeRotateDirection(before.i, before.j, after.i, after.j);
                  if(direction !== 0){
                    this.rotateMagicCube("R", this.magicCube.block-1-before.k, direction===1 ? false: true);
                  }
                } else if(before.j === after.j && before.i !== after.i && before.k !== after.k){
                  let direction = this.judgeRotateDirection(before.i, before.k, after.i, after.k);
                  if(direction !== 0){
                    this.rotateMagicCube("F", this.magicCube.block-1-before.j, direction===1 ? true: false);
                  }
                }
              }
            }
            //cb
            this.clickController.on = false;
            this.clickController.cube = null;
            this.cameraController.enabled = true;
          }
        }, false);
      },
      judgeRotateDirection(x1, y1, x2, y2) {
        let p1 = "c", p2 = "c", block = this.magicCube.block;
        p1 = this.judgePosition(x1, y1);
        p2 = this.judgePosition(x2, y2);
        if(p1==="c" || p2==="c") return 0;
        if((p1==="u" && p2==="l") || (p1==="l" && p2==="d") || (p1==="d" && p2==="r") || (p1==="r" && p2==="u")
        || (p1==="u" && p2==="dl") || (p1==="l" && p2==="dr") || (p1==="d" && p2==="ur") || (p1==="r" && p2==="ul")
        || (p1==="ul" && p2==="d") || (p1==="dl" && p2==="r") || (p1==="dr" && p2==="u") || (p1==="ur" && p2==="l")) return 1;
        if((p1==="u" && p2==="r") || (p1==="r" && p2==="d") || (p1==="d" && p2==="l") || (p1==="l" && p2==="u")
        || (p1==="u" && p2==="dr") || (p1==="r" && p2==="dl") || (p1==="d" && p2==="ul") || (p1==="l" && p2==="ur")
        || (p1==="ul" && p2==="r") || (p1==="ur" && p2==="d") || (p1==="dr" && p2==="l") || (p1==="dl" && p2==="u")) return -1;
        return 0;
      },
      judgePosition(x, y){
        let block = this.magicCube.block;
        if(x === 0){
          if(y === 0){
            return "ul";
          } else if(y === block-1){
            return "ur";
          } else if(y>0 && y<block-1){
            return "u";
          }
        } else if(x === block-1){
          if(y === 0){
            return "dl";
          } else if(y === block-1){
            return "dr";
          } else if(y>0 && y<block-1){
            return "d";
          }
        } else if(x>0 && x<block-1){
          if(y === 0){
            return "l";
          } else if(y === block-1){
            return "r";
          } else if(y>0 && y<block-1){
            return "c";
          }
        }
        return "c";
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
        let i = Math.floor(index/(block*block));
        let j = Math.floor(index%(block*block)/block);
        let k = index%block;
        let inside = new THREE.MeshPhongMaterial({color: "#000"});
        let materials = [inside, inside, inside, inside, inside, inside];
        if(i === 0)
          materials[2] = new THREE.MeshPhongMaterial({map: this.res.up});
        if(i === block-1)
          materials[3] = new THREE.MeshPhongMaterial({map: this.res.down});
        if(k === block-1)
          materials[0] = new THREE.MeshPhongMaterial({map: this.res.right});
        if(k === 0)
          materials[1] = new THREE.MeshPhongMaterial({map: this.res.left});
        if(j === block-1)
          materials[4] = new THREE.MeshPhongMaterial({map: this.res.front});
        if(j === 0)
          materials[5] = new THREE.MeshPhongMaterial({map: this.res.back});
        let geometry = new THREE.BoxGeometry(length, length, length);
        let cube = new THREE.Mesh(geometry, materials);
        let x = (k - (block-1)/2)*length;
        let y = ((block-1)/2 - i)*length;
        let z = (j - (block-1)/2)*length;
        cube.position.set(x,y,z);
        cube.isCube = true;
        cube.index = index;
        cube.positionIndex = {i,j,k};
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
        this.gui.add(this.controls, "blockOfMagicCube", 3, 5, 1);
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
        this.cameraController.update(delta);

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
            //cube对象位置更新
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
            //positionIndex保持绝对位置不变
            for(let i = 0; i < block; i++){
              for(let j = 0; j < block; j++){
                for(let k = 0; k < block; k++){
                  this.magicCube.cubeList[i][j][k].positionIndex = {i,j,k};
                }
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
