export default class Webgl {
  constructor(w, h) {
    this.scene = new THREE.Scene();
    //this.scene.background = new THREE.Color( 0xf0f0f0 );

    this.camera = new THREE.PerspectiveCamera(50, w / h, 1, 10000);
    this.camera.position.set( 0, - 400, 800 );

    this._renderer = new THREE.WebGLRenderer({
      antialias: true,
    });

    this._renderer.setPixelRatio(window.devicePixelRatio);
    this._renderer.setClearColor(0x2c272a);
    this.dom = this._renderer.domElement;
    this._renderer.shadowMap.enabled = true;
    this._renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
//this._renderer.shadowMap.renderReverseSided = true;
    //this._renderer.shadowMap.renderReverseSided = false;
    // According to Juan set renderer so that when opacity goes below 1 you don't have the z conflict on the faces.
    this._renderer.sortObjects = false

    THREE.OrbitControls = require('three-orbit-controls')(THREE)

    this.controls = new THREE.OrbitControls(this.camera,  this.dom);
    this.controls.target.set( 0, 0, 0 );

    this.usePostprocessing = false;
    this._composer = false;
    this._passes = {};
    this.initPostprocessing();
    this.onResize(w, h);

    this.onUpdate = this.onUpdate.bind(this);
    this.onResize = this.onResize.bind(this);
  }

  initPostprocessing() {
    if (!this.usePostprocessing) return;
    // TODO add WAGNER
    this._composer = new WAGNER.Composer(this._renderer);
    this._composer.setSize(this.width, this.height);
    this._passes.vignettePass = new WAGNER.VignettePass();
    this._passes.fxaaPass = new WAGNER.FXAAPass();
  }

  add(mesh) {
    this.scene.add(mesh);
  }

  onUpdate() {
    this.controls.update();

    if (this.usePostprocessing) {
      this._composer.reset();
      this._composer.renderer.clear();
      this._composer.render(this.scene, this.camera);
      // TODO loop to passes
      this._composer.pass(this._passes.fxaaPass);
      this._composer.pass(this._passes.vignettePass);
      this._composer.toScreen();
    } else {
      this._renderer.render(this.scene, this.camera);
    }
  }

  onResize(w, h) {
    this.width = w;
    this.height = h;

    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();

    this._renderer.setSize(w, h);
  }
}
