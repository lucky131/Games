<template>
  <div class="wrap">
    <div id="container"></div>
    <div class="controller">
      <el-form label-width="100px">
        <el-form-item label="鼠标模式：">
          <el-radio-group v-model="controller.editStatus" @change="onEditStatusChange">
            <el-radio label="add">新增</el-radio>
            <el-radio label="remove">移除</el-radio>
            <el-radio label="copy">复制颜色</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="controller.editStatus==='add'" label="方块颜色：">
          <div class="formRow">
            <div :class="{colorPicker: true, seleced: controller.colorIndex === index}" v-for="(color, index) in config.defaultColors" :key="index" :style="{backgroundColor: color}" @click="changeColor(index)"></div>
            <div :class="{colorPicker: true, others: true, seleced: controller.colorIndex === -1}" @click="changeColor(-1)"></div>
            <el-color-picker v-if="controller.colorIndex === -1" v-model="controller.color"></el-color-picker>
          </div>
        </el-form-item>
        <el-form-item label="光源类型：">
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
        <el-form-item label="其他功能：">
          <el-button size="medium" round @click="resetCamera()">重置视角</el-button>
          <el-button size="medium" round @click="clearAllBlockBtn()">清空方块</el-button>
        </el-form-item>
        <el-form-item label="存/读：">
          <el-button type="primary" size="medium" round @click="showSave()">保存</el-button>
          <el-button type="success" size="medium" round @click="showLoad()">读取</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-dialog
      title="保存"
      center
      :visible.sync="isSaveDialogShow"
      width="500px">
      <el-input id="saveInput" readonly v-model="saveCode"></el-input>
      <span slot="footer" class="">
        <el-button class="copyBtn" type="primary" data-clipboard-target="#saveInput">复制</el-button>
        <el-button @click="isSaveDialogShow = false">关闭</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="读取"
      center
      :visible.sync="isLoadDialogShow"
      width="500px">
      <el-input v-model="loadCode" placeholder="请粘贴编码"></el-input>
      <el-row style="margin-top: 20px">
        <span style="margin: 0 10px">预留存档：</span>
        <el-button v-for="(n, index) in defaultLoadCode" :key="index" type="primary" round size="small" @click="loadCode=n.code">{{n.name}}</el-button>
      </el-row>
      <span slot="footer" class="">
        <el-button class="copyBtn" type="success" @click="loadBtn()">读取</el-button>
        <el-button @click="isLoadDialogShow = false">关闭</el-button>
      </span>
    </el-dialog>

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
      padding-top: 20px;
      box-sizing: border-box;
      .formRow{
        display: flex;
        flex-flow: row wrap;
        .colorPicker{
          width: 40px;
          height: 40px;
          line-height: 40px;
          border-radius: 4px;
          margin-right: 6px;
          color: white;
          font-size: 32px;
          text-align: center;
          cursor: pointer;
          &.seleced:before{
            content: "√";
          }
          &.others{
            background-image: linear-gradient(90deg, #e24224, #e0ff22, #2bff82, #2a4dff);
          }
        }
      }
    }
  }
</style>

<script>
  import * as THREE from 'three'
  import * as Stats from 'stats-js'
  import * as dat from 'dat.gui'
  import Clipboard from "clipboard/dist/clipboard.min"

  export default {
    name: "three",
    data(){
      return{
        config: {
          blockSize: 4,
          selectedBlockColor: "#5e64dd",
          defaultColors: [
            "#308f2d",
            "#ad7126",
            "#5e5ce4",
            "#faff7c",
          ],
          groundColor: "#8eed6a",
        },
        controller: {
          editStatus: "add",
          colorIndex: 0,
          color: "",
          light: "spot",
          axesHelper: true,
        },
        isSaveDialogShow: false,
        isLoadDialogShow: false,
        saveCode: "",
        loadCode: "",
        defaultLoadCode: [
          {
            name: "预留一",
            code: "#308f2d:-1,0,-2;0,0,-2;1,0,-2;1,0,-1;1,0,0;0,0,0;-1,0,0;1,0,1;1,0,2;0,0,2;-1,0,2;-3,0,0;-4,0,0;3,0,0;4,0,0"
          }
        ],
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

      //初始化剪切板工具
      let clipboard = new Clipboard('.copyBtn');
      clipboard.on('success', e => {
        e.clearSelection();
        this.$message({
          message: '复制成功',
          type: 'success'
        });
      });
    },
    methods: {
      //加载资源
      loadRes(){

      },
      //初始化
      init(){
        let container = document.getElementById('container');
        this.changeColor(0);

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
        this.cameraController.userPanSpeed = 1;
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
        this.createBlockZone(-5,-1,-5, 5,-1,5, "ground", this.config.groundColor);
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
            case "copy":
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
              case "copy":
                if(this.selectedBlock){
                  this.controller.colorIndex = -1;
                  this.controller.color = "#" + this.selectedBlock.material.color.getHexString();
                  this.controller.editStatus = "add";
                }
                break;
            }
          }
        }, false);
      },
      //重新生成光线
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
      //修改block的选择状态
      selectBlock(block, isSelected){
        if(isSelected){
          if(block.type === "transparent"){
            block.material.color = new THREE.Color(this.controller.color);
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
      //三维批量执行createBlock
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
      //生成一个块
      createBlock(x,y,z, type, color="#fff"){
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
      //清空所有非地面方块
      clearAllBlock(){
        for(let key in this.blocks){
          let block = this.blocks[key];
          if(block.type !== "ground"){
            this.scene.remove(block);
            delete this.blocks[key];
          }
        }
      },
      //逻辑坐标 -> 物理坐标
      xyz2PhysicalPosition(x,y,z){
        return {
          x: x * this.config.blockSize,
          y: y * this.config.blockSize,
          z: z * this.config.blockSize
        }
      },
      //生成所有透明方块，递归调用createTransparentBlock
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
      //生成一个透明方块
      createTransparentBlock(x,y,z){
        if(this.blocks[`${x},${y},${z}`]) return;
        this.createBlock(x,y,z, "transparent");
      },
      //清除所有透明方块
      clearTransparentBlock(){
        for(let key in this.blocks){
          let block = this.blocks[key];
          if(block.type === "transparent"){
            this.scene.remove(block);
            delete this.blocks[key];
          }
        }
      },
      //清除并重绘所有透明方块
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
      changeColor(index){
        this.controller.colorIndex = index;
        if(index !== -1)
          this.controller.color = this.config.defaultColors[index];
      },
      onLightChange(v){
        if(v === "direct")
          this.$message({
            message: "平行光渲染阴影耗大量性能，已关闭阴影",
            duration: 1500
          });
        this.createLight(v);
      },
      onAxesHelperChange(v){
        this.axesHelper.visible = v;
      },
      resetCamera(){
        this.camera.position.set(10,30,40);
        this.camera.lookAt(0,0,0);
      },
      clearAllBlockBtn(){
        this.$confirm("确定删除所有方块？", "提示", {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.clearAllBlock();
          this.createAllTransparentBlock();
        })
      },
      showSave(){
        // `#308f2d:1,0,-1;2,0,1;1,0,4.#5e5ce4:-2,0,1;-2,1,1`
        let resultObj = {}, resultArr = [], result = "";
        for(let key in this.blocks){
          let block = this.blocks[key];
          let color, pp;
          if(block.type === "block"){
            color = "#" + block.material.color.getHexString();
            pp = `${block.xyz.x},${block.xyz.y},${block.xyz.z}`;
            if(!resultObj[color]){
              resultObj[color] = [pp];
            } else {
              resultObj[color].push(pp);
            }
          }
        }
        for(let color in resultObj){
          resultArr.push(color + ":" + resultObj[color].join(";"));
        }
        result = resultArr.join(".");
        this.saveCode = result;
        this.isSaveDialogShow = true;
      },
      showLoad(){
        this.loadCode = "";
        this.isLoadDialogShow = true;
      },
      loadBtn(){
        // `#308f2d:1,0,-1;2,0,1;1,0,4.#5e5ce4:-2,0,1;-2,1,1`
        let code = this.loadCode;
        if(code.trim().length === 0)
          return this.$message.error("编码格式不正确，请检查！");
        let numberReg = /^-?\d+$/;
        let blocks = [];
        let arr1 = code.split(".");
        arr1.forEach(str => {
          if(str.indexOf(":") !== 7 || str.lastIndexOf(":") !== 7)
            return this.$message.error("编码格式不正确，请检查！");
          let arr2 = str.split(":");
          let color = arr2[0];
          let arr3 = arr2[1].split(";");
          arr3.forEach(ppstr => {
            let pparr = ppstr.split(",");
            if(pparr.length !== 3)
              return this.$message.error("编码格式不正确，请检查！");
            if(!numberReg.test(pparr[0]) || !numberReg.test(pparr[1]) || !numberReg.test(pparr[2]))
              return this.$message.error("编码格式不正确，请检查！");
            blocks.push({
              x: parseInt(pparr[0]),
              y: parseInt(pparr[1]),
              z: parseInt(pparr[2]),
              color: color
            });
          });
        });

        //解析完成
        this.clearAllBlock();
        blocks.forEach(block => {
          this.createBlock(block.x, block.y, block.z, "block", block.color);
        });
        this.createAllTransparentBlock();
        this.isLoadDialogShow = false;
        this.$message.success("加载完毕");
      },
    }
  }
</script>
