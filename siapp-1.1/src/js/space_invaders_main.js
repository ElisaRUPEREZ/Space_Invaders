"uses strict";

let container, w, h, scene, camera, controls, renderer, stats;
let loop = {};
let cameraMode = 0;
//objects :
let vaisseau;
let bullet;
let soucoupe;
let aliens;

let vaissBoucliers;
//booleans :
let tirEnCours = false;
let moveDir = true; /// sens de déplacement des aliens
let ApparitionSoucoupe = false;
//tabObjects
let collidableMeshList = []; // liste objet pouvant être touchés par le joueur
let bulletAlTabObject = [];
let TabObstacles = [];

window.addEventListener('load', go);
window.addEventListener('resize', resize);
window.addEventListener('keydown', keyPressed);

function testCollision(BouclierVaisseau) { // TODO : collision des projectiles enemis sur bouclier et vaisseau: raycaster sur projectile, test dans le tableau qui contient 4 boucliers + vaisseau
  var res; var vertexIndex = 0;
  var originPoint = BouclierVaisseau.position.clone();
  var touche = false;
  while ((vertexIndex < BouclierVaisseau.geometry.vertices.length)&&(touche==false)) {
    var localVertex = BouclierVaisseau.geometry.vertices[vertexIndex].clone();
    var globalVertex = localVertex.applyMatrix4( BouclierVaisseau.matrix );
    var directionVector = globalVertex.sub( BouclierVaisseau.position );

    var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize());
    var collisionResults = ray.intersectObjects( bulletAlTabObject );
    if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() )
      res = scene.getObjectById( collisionResults[0].object.id);
        if (res!=undefined) {
          touche = true;
        }
    vertexIndex++;
    }

    if (touche) {
      switch (BouclierVaisseau.userData[0]) {
            case "bouclier":
                deleteBullet(res); // Plutot les ajouter dans un tableau à supprimer puis supprimer des 2 tableaux
                calculPVbouclier(BouclierVaisseau);
              break;
            case "vaisseau":
                deleteBullet(res);
                calculPVvaisseau(BouclierVaisseau);
              break;
          }
    }
}

//Peut être améliorer la fonction comme celle au dessuss
function collision() { // collision du tir du joueur sur les aliens, soucoupe, boucliers
    var originPoint = bullet.position.clone();
    for (var vertexIndex = 0; vertexIndex < bullet.geometry.vertices.length; vertexIndex++) {
        var ray = new THREE.Raycaster( bullet.position, bullet.geometry.vertices[vertexIndex], 0, 0.8 );

        var collisionResults = ray.intersectObjects( collidableMeshList);
        if ( collisionResults.length > 0)  { //id ou uuid ????
           var object = scene.getObjectById( collisionResults[0].object.id);
           if (object != undefined) {
             switch (object.userData[0]) {
               case "alien":
                 calculPoints(object.userData[1]);
                 deleteAlien(object);
                 break;
               case "soucoupe":
                 calculPoints(object.userData[1]);
                 object.visible= false;
                 break;
               case "bouclier":
                 calculPVbouclier(object);
                 break;
               case "bulletAlien":
                 deleteBullet(object);
                 break;
             }
             DesactiveTir();
           }

        }
    }
}

var keyboard = new THREEx.KeyboardState();

function keyPressed(e) {
  switch(e.key) {
    case '0':
          cameraMode = 0;
          camera.position.set(0, 40, 0);
    break;

    case '1':
        cameraMode = 1;
    break;
    case 'i':
          console.log("invincible"); //attaques aliens sans aucun effets
          //enlever le vaisseau de la liste des collisions par les aliens liste
          // + Les aliens ne bougent plus !!!!!
    break;
    case 'k':
          console.log("kill all");
          scene.remove(aliens);
          scene.remove(soucoupe);
    break;
    case 'h':
          console.log("Affiche les raccourcis claviers");
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

// Caméra
  camera = new THREE.PerspectiveCamera(75, w/h, 0.001, 100);
  camera.position.set(0, 40, 0);

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

  vaissBoucliers = new THREE.Group();
  scene.add(vaissBoucliers);


  createVaisseau();

  createBullet();

  createAliens();

  createWield();

//createDisplayScore();
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
  const loader = new THREE.FontLoader();

loader.load( './src/medias/fonts/Imprint_MT_Shadow_Regular.json', function ( font ) {

	const geometry = new THREE.TextGeometry( 'Hello three.js!', {
		font: font,
		size: 80,
		height: 5
	} );
} );
*/
//////////////////////////////////////////////////////////////////////////////////
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

//Déplacement caméra selon le vaisseau
if (cameraMode == 1) {
  camera.lookAt( vaisseau.position.x, 0, -vaisseau.position.z );
  camera.position.set(vaisseau.position.x, 10, vaisseau.position.z-10);
}

//Déplacements du vaisseau
  if (keyboard.pressed("left") && vaisseau.position.x<25)
    vaisseau.position.x += 0.2;
  if ( keyboard.pressed("right") && vaisseau.position.x>-25)
    vaisseau.position.x -= 0.2;
  if ( keyboard.pressed("space") ){
      if (!tirEnCours) {
        ActiveTir();
      }
  }

  if (tirEnCours) {
    collision();
    bullet.position.z += 0.6;
    if (bullet.position.z > 25) {
      DesactiveTir();
    }
  }

  //TODO : Mettre un intervalle de temps
    if (Math.round(Math.random()*1000) == 8 && !ApparitionSoucoupe) {
      ApparitionSoucoupe = true;
      soucoupe.visible = true;
      soucoupe.position.x = -30;
    }

// DEFINI ALIEN QUI Tire
    TirAlien(); ///
    if (bulletAlTabObject.length >0 && bulletAlTabObject!=undefined) {
      MoveTirAlien();
    }
    for (var i = 0; i < vaissBoucliers.children.length; i++) { //Ne pas oublier de retirer les objets supprimés
      if (vaissBoucliers.children[i] != undefined) {
        testCollision(vaissBoucliers.children[i]);
      }
    } // UNE FOIS UTILISATION FINIE = COPIER LE TAB vaissBoucliers.children DANS TabObstacles
  renderer.render(scene, camera);  // rendu de la scène

  loop.last = loop.now;

  requestAnimationFrame(gameLoop); // relance la boucle du jeu

  controls.update();
  stats.update();

}

function update(step) {
  const move = 2 * step;

  //Mouvements des Aliens  : // // TODO: Modifier quand il n'y a plus beaucoup d'aliens
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

    if (!tirEnCours) {
      bullet.position.set(vaisseau.position.x, 1, vaisseau.position.z);
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
