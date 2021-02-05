"uses strict";

let container, w, h, scene, camera, controls, renderer, stats;
let loop = {};
let vaisseau;
let aliens;

window.addEventListener('load', go);
window.addEventListener('resize', resize);
window.addEventListener('keydown', keyPressed);

function keyPressed(e){
  console.log("event key    !");
  switch(e.key) {
    case 'ArrowLeft':
          vaisseau.position.x += 0.4;
          //console.log("coord : " + vaisseau.position.x);
        break;
    case 'ArrowRight':
          vaisseau.position.x -= 0.4;
        break;
    case ' ':
          console.log("tirer un missile");
    break;

    case '0':
          camera.position.set(0, 50, 0);
    break;

    case '1':
          camera.position.set(0, 15, -30);
    break;
    case 'i':
          console.log("invincible");
    break;
    case 'k':
          console.log("kill all");
    break;
  }
  e.preventDefault();
}

function go() {
  console.log("Go!");
  init();
  gameLoop();
}

function init() {
  container = document.querySelector('#siapp');
  w = container.clientWidth;
  h = container.clientHeight;

  scene = new THREE.Scene();

// Caméra vue de DESSUS :
  camera = new THREE.PerspectiveCamera(75, w/h, 0.001, 100);
  camera.position.set(0, 50, 0);

  controls = new THREE.TrackballControls(camera, container);
  controls.target = new THREE.Vector3(0, 0, 0.75);
  controls.panSpeed = 0.4;

  const renderConfig = {antialias: true, alpha: true};
  renderer = new THREE.WebGLRenderer(renderConfig);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(w, h);
  container.appendChild(renderer.domElement);

  // add Stats.js - https://github.com/mrdoob/stats.js
  stats = new Stats();
  stats.domElement.style.position	= 'absolute';
  stats.domElement.style.bottom	= '0px';
  document.body.appendChild( stats.domElement );

  const gridHelper = new THREE.GridHelper( 50, 50);
  scene.add( gridHelper );

  // add some geometries
  const geometry = new THREE.BoxGeometry(5,3,3);
  const material = new THREE.MeshNormalMaterial( );
  vaisseau = new THREE.Mesh( geometry, material, );

  vaisseau.position.set(0, 1.5, -20);
  scene.add( vaisseau );

  aliens = new THREE.Group();
  scene.add( aliens );



  const fps  = 60;
  const slow = 1; // slow motion! 1: normal speed, 2: half speed...
  loop.dt       = 0,
  loop.now      = timestamp();
  loop.last     = loop.now;
  loop.fps      = fps;
  loop.step     = 1/loop.fps;
  loop.slow     = slow;
  loop.slowStep = loop.slow * loop.step;

}

function gameLoop() {

  // gestion de l'incrément du temps
/*  loop.now = timestamp();
  loop.dt = loop.dt + Math.min(1, (loop.now - loop.last) / 1000);
  while(loop.dt > loop.slowStep) {
    loop.dt = loop.dt - loop.slowStep;
    update(loop.step); // déplace les objets d'une fraction de seconde
  }*/

  //Déplacement des aliens





  renderer.render(scene, camera);  // rendu de la scène
//  loop.last = loop.now;

  requestAnimationFrame(gameLoop); // relance la boucle du jeu

  controls.update();
  stats.update();
}

function update(step) {
  const angleIncr = Math.PI * 2 * step / 5 ; // une rotation complète en 5 secondes
  cube.rotateY(angleIncr);
}

function resize() {
  w = container.clientWidth;
  h = container.clientHeight;
  camera.aspect = w/h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}

function timestamp() {
  return window.performance.now();
}
