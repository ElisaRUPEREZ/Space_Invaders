"uses strict";

let music, soundLaser, soundDeathAlien;
let container, w, h, scene, camera, controls, renderer, stats;
let loop = {};
let cameraMode = 0;
//objects :
let vaisseau;
let bullet;
let soucoupe;
let aliens;
let boxAliens;
let vaissBoucliers; // group
//booleans :
let tirEnCours = false;
let moveDir = true; /// sens de déplacement des aliens
let ApparitionSoucoupe = false;
//tabObjects
let collidableMeshList = []; // liste objet pouvant être touchés par le joueur
let bulletAlTabObject = [];

let pause = false;

let invincible = false;

let points =0;
let niveau = 1;
let wally;

let tabMeshVaissBou =[];

let grpVaisseauBoucliers;

window.addEventListener('load', init);
window.addEventListener('resize', resize);
window.addEventListener('keydown', keyPressed);

var keyboard = new THREEx.KeyboardState();

function keyPressed(e) {
  switch(e.key) {
    case '0':
          cameraMode = 0;
          camera.position.set(0, 55, 0);
    break;

    case '1':
        cameraMode = 1;
    break;
    case '2':
      cameraMode = 2;
     break;
    case 'i':
          console.log("invincible");
          invincible = !invincible;

    break;
    case 'k':
          scene.remove(aliens);
          scene.remove(soucoupe);       
          GameSuccess();
    break;
    case 'h':
      let styleDiv = document.getElementById('helpMenu').style.display;
      if (styleDiv =="block") {
        document.getElementById('helpMenu').style.display= "none";
      }
      else {
        document.getElementById('helpMenu').style.display= "block";
      }
    break;
    case 'Escape':
        if (pause) {
        pause = false;
        gameLoop();
        } else {
            pause = true;
    }
    break;
  }
  e.preventDefault();
}

function init() {
  console.log("test alian");
  document.getElementById('OptionDiv').getElementsByTagName('h1')[0].style.visibility = "hidden";

  container = document.querySelector('#siapp');
  w = container.clientWidth;
  h = container.clientHeight;
  scene = new THREE.Scene();

// Caméra
  camera = new THREE.PerspectiveCamera(75, w/h, 0.001, 100);
  camera.position.set(0, 55, 0);


  controls = new THREE.TrackballControls(camera, container);
  controls.target = new THREE.Vector3(0, 0, 0.75);
  controls.panSpeed = 0.4;

  // create an AudioListener and add it to the camera
  const listener = new THREE.AudioListener();
  camera.add( listener );

  // create a global audio source
  music = new THREE.Audio( listener );

  // load a sound and set it as the Audio object's buffer
  const audioLoader = new THREE.AudioLoader();
  audioLoader.load( '/src/medias/sounds/background_music.mp3', function( buffer ) {
  	music.setBuffer( buffer );
  	music.setLoop( true );
  	music.setVolume( 0.4 );
  });

  scene.add(music);



  // create a global audio source
  soundLaser = new THREE.Audio( listener );

  // load a sound and set it as the Audio object's buffer
  const soundLoader = new THREE.AudioLoader();
  soundLoader.load( '/src/medias/sounds/laser_sound.mp3', function( buffer ) {
  	soundLaser.setBuffer( buffer );
  	soundLaser.setLoop( false );
  	soundLaser.setVolume( 0.4 );
  });

  scene.add(soundLaser);

  soundDeathAlien = new THREE.Audio( listener );

  // load a sound and set it as the Audio object's buffer
  const soundAlienLoader = new THREE.AudioLoader();
  soundLoader.load( '/src/medias/sounds/alienDeath.mp3', function( buffer ) {
  	soundDeathAlien.setBuffer( buffer );
  	soundDeathAlien.setLoop( false );
  	soundDeathAlien.setVolume( 0.4 );
  });

  scene.add(soundDeathAlien);


  const renderConfig = {antialias: true, alpha: true};
  renderer = new THREE.WebGLRenderer(renderConfig);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(w, h);
  container.appendChild(renderer.domElement);

}

function go() {
  console.log("Go!");
  document.getElementById('mainMenu').style.display = "none";
  music.play();
  startLevel(1);
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
