<template>
  <div class="wrap">
    <div id="container"></div>
    <div class="controller">
      <el-form label-width="100px">
        <el-form-item label="模式：">
          <el-radio-group v-model="controller.editStatus" @change="onEditStatusChange">
            <el-radio label="add">新增</el-radio>
            <el-radio label="remove">移除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="controller.editStatus==='add'" label="颜色：">
          <el-color-picker v-model="controller.color"></el-color-picker>
        </el-form-item>
        <el-form-item label="光线：">
          <el-radio-group v-model="controller.light" @change="onLightChange">
            <el-radio label="spot">聚光灯</el-radio>
            <el-radio label="direct">平行光</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="辅助线：">
          <el-radio-group v-model="controller.axesHelper" @change="onAxesHelperChange">
            <el-radio :label="true">开</el-radio>
            <el-radio :label="false">关</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .wrap{
    width: 100vw;
    height: 100vh;
    background-color: black;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    #container{
      width: 800px;
      height: 800px;
    }
    .controller{
      width: 400px;
      height: 800px;
      background-color: white;
      border-left: 1px solid black;
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
        config: {
          blockSize: 4,
          selectedBlockColor: "#5e64dd",
        },
        controller: {
          editStatus: "add",
          color: "#ffc06c",
          light: "spot",
          axesHelper: true,
        },
        blocks: {},
        selectedBlock: null,
        res: {},
        camera: null,
        cameraController: null,
        lights: [],
        clock: null,
        scene: null,
        axesHelper: null,
        renderer: null,
        stats: null,
        mouse: null,
        lastMouse: null,
        raycaster: null,
      }
    },
    mounted(){
      window.THREE = require("three");
      require("../magicCube/lib/OrbitControls");

      this.loadRes();
      this.init();
      this.initStats();
      this.animate();
    },
    methods: {
      //加载资源
      loadRes(){

      },
      //初始化
      init(){
        let container = document.getElementById('container');

        //scene
        this.scene = new THREE.Scene();

        //axesHelper
        this.axesHelper = new THREE.AxesHelper(1000);
        this.scene.add(this.axesHelper);

        //camera
        this.camera = new THREE.PerspectiveCamera(50, 800/800, 0.01, 1000);
        // this.camera = new THREE.OrthographicCamera(-50,50,50,-50, 0.01, 1000);
        this.camera.position.set(10,30,40);
        this.camera.lookAt(0,0,0);
        this.cameraController = new THREE.OrbitControls(this.camera, container);
        this.cameraController.userPanSpeed = 0.2;
        this.clock = new THREE.Clock();

        //render
        this.renderer = new THREE.WebGLRenderer({antialias: true}); //抗锯齿
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.setClearColor("#000");
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        //light
        this.createLight(this.controller.light);

        //plane
        // let plane = new THREE.Mesh(
        //   new THREE.PlaneBufferGeometry(50,50),
        //   new THREE.MeshLambertMaterial({color: "#ff8dcc"})
        // );
        // plane.rotation.x = -Math.PI/2;
        // plane.position.y = 2;
        // this.scene.add(plane);
        this.createBlockZone(-5,-1,-5, 5,-1,5, "ground", "#8eed6a");
        this.createAllTransparentBlock();

        container.appendChild(this.renderer.domElement);

        //mouse
        this.mouse = new THREE.Vector2();
        this.lastMouse = new THREE.Vector2();

        //raycaster
        this.raycaster = new THREE.Raycaster();

        //event
        container.addEventListener("mousemove", (event) => {
          this.mouse.x = (event.offsetX/event.target.width)*2-1;
          this.mouse.y = -(event.offsetY/event.target.height)*2+1;
          this.raycaster.setFromCamera(this.mouse, this.camera);
          let status = this.controller.editStatus;
          let intersects = this.raycaster.intersectObjects(this.scene.children);
          switch (status) {
            case "add":
              intersects = filterTransparentIntersects(intersects);
              if(intersects.length > 0){
                if(this.selectedBlock){
                  this.selectBlock(this.selectedBlock, false);
                }
                this.selectedBlock = intersects[getMinIndex(intersects.map(i => this.raycaster.ray.distanceToPoint(i.object.position)))].object;
                this.selectBlock(this.selectedBlock, true);
              } else {
                if(this.selectedBlock){
                  this.selectBlock(this.selectedBlock, false);
                  this.selectedBlock = null;
                }
              }
              break;
            case "remove":
              intersects = intersects.filter(n => n.object.type === "block");
              if(intersects.length > 0){
                if(this.selectedBlock){
                  this.selectBlock(this.selectedBlock, false);
                }
                this.selectedBlock = intersects[0].object;
                this.selectBlock(this.selectedBlock, true);
              } else {
                if(this.selectedBlock){
                  this.selectBlock(this.selectedBlock, false);
                  this.selectedBlock = null;
                }
              }
              break;
          }

          function filterTransparentIntersects(arr) {
            if(arr.length === 0) return [];
            let firstNotTransparentBlockIndex = arr.length;
            for(let i=0; i<arr.length; i++){
              if(arr[i].object.type !== "transparent"){
                firstNotTransparentBlockIndex = i;
                break;
              }
            }
            return arr.slice(0, firstNotTransparentBlockIndex);
          }
          function getMinIndex(arr) {
            if(arr.length === 0) return -1;
            if(arr.length === 1) return 0;
            let min = arr[0], minIndex = 0;
            for(let i=1; i<arr.length; i++){
              if(arr[i] < min){
                min = arr[i];
                minIndex = i;
              }
            }
            return minIndex;
          }
        }, false);
        container.addEventListener("mousedown", (event) => {
          this.lastMouse.x = (event.offsetX/event.target.width)*2-1;
          this.lastMouse.y = -(event.offsetY/event.target.height)*2+1;
        }, false);
        container.addEventListener("mouseup", (event) => {
          this.mouse.x = (event.offsetX/event.target.width)*2-1;
          this.mouse.y = -(event.offsetY/event.target.height)*2+1;
          if(this.mouse.x === this.lastMouse.x && this.mouse.y === this.lastMouse.y){
            let status = this.controller.editStatus;
            switch (status) {
              case "add":
                if(this.selectedBlock){
                  let pp = this.selectedBlock.xyz;
                  this.scene.remove(this.selectedBlock);
                  delete this.blocks[`${pp.x},${pp.y},${pp.z}`];
                  this.selectedBlock = null;
                  this.createBlock(pp.x,pp.y,pp.z, "block", this.controller.color);
                  this.clearTransparentBlock();
                  this.createAllTransparentBlock();
                }
                break;
              case "remove":
                if(this.selectedBlock){
                  let pp = this.selectedBlock.xyz;
                  this.scene.remove(this.selectedBlock);
                  delete this.blocks[`${pp.x},${pp.y},${pp.z}`];
                  this.selectedBlock = null;
                  this.clearTransparentBlock();
                  this.createAllTransparentBlock();
                }
                break;
            }
          }
        }, false);
      },
      createLight(type){
        this.lights.forEach(light => {
          this.scene.remove(light);
        });
        this.lights = [];
        let ambient;
        switch (type) {
          case "spot":
            ambient = new THREE.AmbientLight( 0xffffff, 0.5 );
            let spotLight = new THREE.SpotLight("#fff");
            spotLight.intensity = 1;
            spotLight.distance = 100;
            spotLight.angle = 0.6;
            spotLight.position.set(10,40,20);
            spotLight.lookAt(0,0,0);
            spotLight.castShadow = true;
            spotLight.shadow.mapSize.width = 1024;
            spotLight.shadow.mapSize.height = 1024;
            spotLight.shadow.camera.near = 0.01;
            spotLight.shadow.camera.far = 1000;
            this.lights.push(ambient, spotLight);
            break;
          case "direct":
            ambient = new THREE.AmbientLight( 0xffffff, 0.5 );
            let directionalLight1 = new THREE.DirectionalLight("#fff", 0.75);
            directionalLight1.position.set(3,5,5);
            let directionalLight2 = new THREE.DirectionalLight("#fff", 0.25);
            directionalLight2.position.set(-5,5,-3);
            this.lights.push(ambient, directionalLight1, directionalLight2);
            break;
        }
        this.lights.forEach(light => {
          this.scene.add(light);
        });
      },
      selectBlock(block, isSelected){
        if(isSelected){
          if(block.type === "transparent"){
            block.material.opacity = 0.5;
          } else if(block.type === "block"){
            block.material.opacity = 0.5
          }
        } else {
          if(block.type === "transparent"){
            block.material.opacity = 0;
          } else if(block.type === "block"){
            block.material.opacity = 1;
          }
        }
      },
      createBlockZone(x1,y1,z1, x2,y2,z2, type, color){
        let x_min = Math.min(x1, x2),
          x_max = Math.max(x1, x2),
          y_min = Math.min(y1, y2),
          y_max = Math.max(y1, y2),
          z_min = Math.min(z1, z2),
          z_max = Math.max(z1, z2);
        for(let x = x_min; x <= x_max; x++){
          for(let y = y_min; y <= y_max; y++){
            for(let z = z_min; z <= z_max; z++){
              this.createBlock(x,y,z, type, color);
            }
          }
        }
      },
      createBlock(x,y,z, type, color){
        let material;
        if(type === "transparent")
          color = this.config.selectedBlockColor;
        let block = new THREE.Mesh(
          new THREE.BoxGeometry(this.config.blockSize, this.config.blockSize, this.config.blockSize),
          new THREE.MeshLambertMaterial({color: color})
        );
        let pp = this.xyz2PhysicalPosition(x,y,z);
        block.position.set(pp.x, pp.y, pp.z);
        block.type = type;
        block.xyz = {x,y,z};
        block.material.transparent = true;
        block.castShadow = true;
        block.receiveShadow = true;
        if(type === "transparent"){
          block.material.opacity = 0;
          block.castShadow = false;
          block.receiveShadow = false;
        }
        this.blocks[`${x},${y},${z}`] = block;
        this.scene.add(block);
      },
      //逻辑坐标 -> 物理坐标
      xyz2PhysicalPosition(x,y,z){
        return {
          x: x * this.config.blockSize,
          y: y * this.config.blockSize,
          z: z * this.config.blockSize
        }
      },
      createAllTransparentBlock(){
        for(let key in this.blocks){
          let block = this.blocks[key];
          let type = block.type;
          //              0 x+   1 x-   2 y+   3 y-   4 z+   5 z-
          let position = [false, false, false, false, false, false];
          switch (type) {
            case "ground":
              position[2] = true;
              break;
            case "block":
              position = [true, true, true, true, true, true];
              break;
          }
          if(position[0]) this.createTransparentBlock(block.xyz.x+1, block.xyz.y, block.xyz.z);
          if(position[1]) this.createTransparentBlock(block.xyz.x-1, block.xyz.y, block.xyz.z);
          if(position[2]) this.createTransparentBlock(block.xyz.x, block.xyz.y+1, block.xyz.z);
          if(position[3]) this.createTransparentBlock(block.xyz.x, block.xyz.y-1, block.xyz.z);
          if(position[4]) this.createTransparentBlock(block.xyz.x, block.xyz.y, block.xyz.z+1);
          if(position[5]) this.createTransparentBlock(block.xyz.x, block.xyz.y, block.xyz.z-1);
        }
      },
      createTransparentBlock(x,y,z){
        if(this.blocks[`${x},${y},${z}`]) return;
        this.createBlock(x,y,z, "transparent");
      },
      clearTransparentBlock(){
        for(let key in this.blocks){
          let block = this.blocks[key];
          if(block.type === "transparent"){
            this.scene.remove(block);
            delete this.blocks[key];
          }
        }
      },
      refreshTransparentBlock(){
        this.clearTransparentBlock();
        this.createAllTransparentBlock();
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
      animate(){
        //stats
        this.stats.update();

        //trackballControls
        let delta = this.clock.getDelta(); //距离上一帧的秒数
        this.cameraController.update(delta);

        requestAnimationFrame(this.animate);
        this.renderer.render(this.scene, this.camera);
      },
      onEditStatusChange(v){
        if(this.selectedBlock){
          this.selectBlock(this.selectedBlock, false);
          this.selectedBlock = null;
        }
      },
      onLightChange(v){
        this.createLight(v);
      },
      onAxesHelperChange(v){
        this.axesHelper.visible = v;
      },
    }
  }
</script>
