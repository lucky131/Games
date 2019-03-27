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
    }
  }
</style>

<script>
  import * as Three from 'three'
  export default {
    name: "three",
    data(){
      return{
        camera: null,
        scene: null,
        renderer: null,
        mesh: null
      }
    },
    created(){

    },
    mounted(){
      this.init();
      this.animate();
    },
    methods: {
      init () {
        let container = document.getElementById('container');

        this.camera = new Three.PerspectiveCamera(70, 1000/800, 0.01, 10);
        // this.camera = new Three.OrthographicCamera(-5,5,4,-4, 0.01, 100);
        this.camera.position.set(2,2,2)
        this.camera.lookAt(0,0,0)

        this.scene = new Three.Scene();

        let geometry = new Three.BoxGeometry(1,1,1);
        let material = new Three.MeshNormalMaterial();
        this.mesh = new Three.Mesh(geometry, material);
        this.scene.add(this.mesh);

        this.renderer = new Three.WebGLRenderer({antialias: true});
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(this.renderer.domElement);
      },
      animate () {
        requestAnimationFrame(this.animate);
        this.mesh.rotation.y += 0.02;
        this.renderer.render(this.scene, this.camera);
      }
    }
  }
</script>
