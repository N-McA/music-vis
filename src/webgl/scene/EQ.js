const { gui, webgl, assets } = require('../../context');

const LiveShaderMaterial = require('../materials/LiveShaderMaterial');
const eqShader = require('../shaders/eq.shader');

// tell the preloader to include this asset
// we need to define this outside of our class, otherwise
// it won't get included in the preloader until *after* its done loading

// const gltfKey = assets.queue({
//   // url: 'assets/models/honeycomb.gltf'
// });

module.exports = class EQ extends THREE.Object3D {
  constructor () {
    super();

    const fftSize = 128;
    const listener = new THREE.AudioListener();
    const audio = new THREE.Audio( listener );
    
    const mediaElement = new Audio( 'assets/sounds/test.mp3' );
		mediaElement.loop = true;
    mediaElement.play();
    
    audio.setMediaElementSource( mediaElement );
    this.analyser = new THREE.AudioAnalyser( audio, fftSize );
    
    // const gltf = assets.get(gltfKey);

    this.uniforms = {
			tAudioData: { value: new THREE.DataTexture( this.analyser.data, fftSize / 2, 1, THREE.LuminanceFormat ) }
		};

    this.material = new LiveShaderMaterial(eqShader, { uniforms: this.uniforms });

    const geometry = new THREE.PlaneBufferGeometry( 1, 1 );
		const mesh = new THREE.Mesh( geometry, this.material );

    // Replaces all meshes material with something basic
    // gltf.scene.add(mesh)

    this.add(mesh);

    // this.add(new THREE.Mesh(
    //   new THREE.BoxGeometry(1, 1, 1),
    //   new THREE.MeshBasicMaterial({
    //     wireframe: true, color: 'black'
    //   })
    // ));

    if (gui) { // assume it can be falsey, e.g. if we strip dat-gui out of bundle
      // attach dat.gui stuff here as usual
      // const folder = gui.addFolder('honeycomb');
      // const settings = {
      //   colorA: this.material.uniforms.colorA.value.getStyle(),
      //   colorB: this.material.uniforms.colorB.value.getStyle()
      // };
      // const update = () => {
      //   this.material.uniforms.colorA.value.setStyle(settings.colorA);
      //   this.material.uniforms.colorB.value.setStyle(settings.colorB);
      // };
      // folder.addColor(settings, 'colorA').onChange(update);
      // folder.addColor(settings, 'colorB').onChange(update);
      // folder.open();
    }
  }

  update (dt = 0, time = 0) {
    // This function gets propagated down from the WebGL app to all children
    // this.rotation.y += dt * 0.1;
    // this.material.uniforms.time.value = time;
    this.analyser.getFrequencyData();
		this.uniforms.tAudioData.value.needsUpdate = true;
  }

  onTouchStart (ev, pos) {
    const [ x, y ] = pos;
    console.log('Touchstart / mousedown: (%d, %d)', x, y);

    // For example, raycasting is easy:
    const coords = new THREE.Vector2().set(
      pos[0] / webgl.width * 2 - 1,
      -pos[1] / webgl.height * 2 + 1
    );
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(coords, webgl.camera);
    const hits = raycaster.intersectObject(this, true);
    console.log(hits.length > 0 ? `Hit ${hits[0].object.name}!` : 'No hit');
  }

  onTouchMove (ev, pos) {
  }

  onTouchEnd (ev, pos) {
  }
};
