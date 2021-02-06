"uses strict";

let container, w, h, scene, camera, controls, renderer, stats;
let loop = {};
let vaisseau;
let bullet;
let soucoupe;
let aliens;
let tirEnCours = false;
let moveDir = true; /// sens de déplacement des aliens
let ApparitionSoucoupe = false;

window.addEventListener('load', go);
window.addEventListener('resize', resize);
window.addEventListener('keydown', keyPressed);

var keyboard = new THREEx.KeyboardState();

function keyPressed(e) {
  console.log("event key !");
  switch(e.key) {
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

  const light = new THREE.DirectionalLight(0xFFFFFF, 1);
  light.position.set(-15, 15,-25);
  scene.add(light);

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
 // GridHelper
  const gridHelper = new THREE.GridHelper(50, 50);
  scene.add(gridHelper);

  // add some geometries
  const geometry = new THREE.BoxGeometry(4,2,2);
  const material = new THREE.MeshNormalMaterial( );
  vaisseau = new THREE.Mesh( geometry, material, );

  vaisseau.position.set(0, 1, -22);
  scene.add( vaisseau );
// Balle 1 à la fois disparait lorsque elle atteint le bout du plateau ou touche sa cible
  const geometryS = new THREE.SphereGeometry(0.5);
  const materialS = new THREE.MeshNormalMaterial( );
  bullet = new THREE.Mesh( geometryS, materialS, );
  bullet.visible = false;
  scene.add( bullet );

  aliens = new THREE.Group();
  scene.add(aliens);

  const geometryA = new THREE.BoxGeometry(2,2,2);
  const materialA = new THREE.MeshBasicMaterial();
  var xOffset = -17;

  for (var i = 1; i <= 10 ; i++) {
      var alien = new THREE.Mesh( geometryA, new THREE.MeshPhongMaterial({color: 0x34c924}), );
      alien.position.x = (3 * i) + xOffset;
      alien.position.y = 1;
      alien.position.z = 0;
      aliens.add( alien );
   }

  for (var i = 1; i <= 10 ; i++) {
      var alien = new THREE.Mesh( geometryA, new THREE.MeshPhongMaterial({color: 0x0f04cf}), );
      alien.position.x = (3 * i) + xOffset;
      alien.position.y = 1;
      alien.position.z = 4;
      aliens.add( alien );
   }

    for (var i = 1; i <= 10 ; i++) {
        var alien = new THREE.Mesh( geometryA, new THREE.MeshPhongMaterial({color: 0xcd5c5c}), );
        alien.position.x = (3 * i) + xOffset;
        alien.position.y = 1;
        alien.position.z = 8;
        aliens.add( alien );
    }

    soucoupe = new THREE.Mesh( new THREE.TorusGeometry( 2, 1.5, 3, 20 ), new THREE.MeshPhongMaterial( { color: 0x787878 } ) );
    soucoupe.position.set(-30, 1, 20);
    soucoupe.visible = false;
    soucoupe.rotateX(Math.PI/2);
    scene.add( soucoupe );

    //TODO: Création des 4 boucliers :
    const geometryWield = new THREE.PlaneGeometry( 6, 4 );
    const materialWield  = new THREE.MeshBasicMaterial( {color: 0x787878, side: THREE.DoubleSide} );
    const plane = new THREE.Mesh( geometryWield , materialWield  );
    plane.position.set(15, 1, -20);
    scene.add( plane );

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
  loop.now = timestamp();
  loop.dt = loop.dt + Math.min(1, (loop.now - loop.last) / 1000);
  while(loop.dt > loop.slowStep) {
    loop.dt = loop.dt - loop.slowStep;
    update(loop.step); // déplace les objets d'une fraction de seconde
  }

//Déplacements du vaisseau
  if ( keyboard.pressed("left") )
    vaisseau.position.x += 0.2;
  if ( keyboard.pressed("right") )
    vaisseau.position.x -= 0.2;
  if ( keyboard.pressed("space") ){
      if (!tirEnCours) {
        ActiveTir();
      }
  }

  if (tirEnCours) {
    bullet.position.z += 0.8;
    if (bullet.position.z > 25) {
      DesactiveTir();
    }
  }

  //TODO : Mettre un intervalle de temps
    if (Math.round(Math.random()*1000) == 8 && !ApparitionSoucoupe) {
      console.log("OK !!!");
      ApparitionSoucoupe = true;
      soucoupe.visible = true;
      soucoupe.position.x = -30;
    }


  renderer.render(scene, camera);  // rendu de la scène

  loop.last = loop.now;

  requestAnimationFrame(gameLoop); // relance la boucle du jeu

  controls.update();
  stats.update();
}

function update(step) {
  const move = 2 * step;

  //Mouvements des Aliens  :
    if (Math.abs(aliens.position.x) >=9) {
      aliens.position.z-=1;
      moveDir = !moveDir;
    }
    if (moveDir) {
      aliens.position.x +=move;
    } else {
      aliens.position.x -=move;
    }

    /// Apparition de la soucoupe volante de temps en temps ex toutes les 8 secondes
    if (soucoupe.position.x <30 && ApparitionSoucoupe) {
      soucoupe.position.x += 0.2;
      soucoupe.rotateZ(Math.PI/14);
    } else {
      soucoupe.visible = false;
      ApparitionSoucoupe = false;
    }

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
/***
  function active le tir (balle visible et placée à l'endroit du vaisseau)
  function arrete la balle (rend invisible et arrete le déplacement)
*/

function ActiveTir() {
  tirEnCours = true;
  bullet.position.set(vaisseau.position.x, 1, vaisseau.position.z);
  bullet.visible = true;
}

function DesactiveTir() {
  tirEnCours = false;
  bullet.position.set(0, 1, -30);
  bullet.visible = false;
}
