const EQ = require('./webgl/scene/EQ');
// const SpinningBox = require('./webgl/scene/SpinningBox');

const { assets, webgl, gui } = require('./context');

function awaitUserInput() {
  return new Promise((resolve, reject) => {
    let clickHandler = () => {
      document.removeEventListener("click", clickHandler)
      resolve()
    }
    document.addEventListener("click", clickHandler)
  })
}

function loadAssets() {
  return new Promise((resolve, reject) => {
    assets.loadQueued(resolve, reject)
  })
}

module.exports = function () {
  // Set background color
  const background = 'white';
  document.body.style.background = background;
  webgl.renderer.setClearColor(background);

  // Hide canvas
  webgl.canvas.style.visibility = 'hidden';
  
  loadAssets()
    .then(() => console.log('Loaded Assets'))
    .then(awaitUserInput)
    .then(() => {
      console.log("Got user input")
      // Show canvas
      webgl.canvas.style.visibility = '';

      // To avoid page pulling and such
      webgl.canvas.addEventListener('touchstart', ev => ev.preventDefault());

      // Add any "WebGL components" here...
      // webgl.scene.add(new SpinningBox());
      webgl.scene.add(new EQ());

      // start animation loop
      webgl.start();
      webgl.draw();
    })
};
