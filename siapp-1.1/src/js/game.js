function startLevel(level) {
  niveau =level;
  document.getElementById('OptionDiv').getElementsByTagName('h1')[0].innerHTML = 'Niveau '+niveau;
  if (level==1) {
    init();
  } else {
    clearGame();
  }

  addObjectToscene();
  gameLoop();
}

function clearGame() {
  scene.clear();
  document.getElementById('VieDiv').innerHTML = '';
  points = 0;
  document.getElementById("ScoreDiv").innerHTML='<h1>Score : 000</h1>';

  tirEnCours = false;
  moveDir = true; /// sens de déplacement des aliens
  ApparitionSoucoupe = false;
    //tabObjects
  collidableMeshList = []; // liste objet pouvant être touchés par le joueur
  bulletAlTabObject = [];

  pause = false;

  invincible = false;

}

function init() {
  container = document.querySelector('#siapp');
  w = container.clientWidth;
  h = container.clientHeight;
  scene = new THREE.Scene();

// Caméra
  camera = new THREE.PerspectiveCamera(75, w/h, 0.001, 100);
  camera.position.set(0, 40, 0);


  controls = new THREE.TrackballControls(camera, container);
  controls.target = new THREE.Vector3(0, 0, 0.75);
  controls.panSpeed = 0.4;

  const renderConfig = {antialias: true, alpha: true};
  renderer = new THREE.WebGLRenderer(renderConfig);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(w, h);
  container.appendChild(renderer.domElement);

}

function addObjectToscene() {

  vaissBoucliers = new THREE.Group();
  scene.add(vaissBoucliers);


  createVaisseau();

  createBullet();

  createAliens();

  createWield();


  const light = new THREE.DirectionalLight(0xFFFFFF, 1);
  light.position.set(-15, 15,-25);
  scene.add(light);

    // add Stats.js - https://github.com/mrdoob/stats.js
  stats = new Stats();
  stats.domElement.style.position	= 'absolute';
  stats.domElement.style.bottom	= '0px';
  document.body.appendChild( stats.domElement );

 // GridHelper
  const gridHelper = new THREE.GridHelper(50, 50);
  scene.add(gridHelper);

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

  if (!pause) {
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


    renderer.render(scene, camera);  // rendu de la scène
    loop.last = loop.now;
    requestAnimationFrame(gameLoop); // relance la boucle du jeu

    controls.update();
    stats.update();

  }
}

function update(step) {
  const move = 2 * step;

  boxAliens = new THREE.Box3().setFromObject(aliens); // Encapsule le groupe d'aliens dans une box
  //Mouvements des Aliens  :
    if (boxAliens.max.x>=24 || boxAliens.min.x<=-24) {
      if (!invincible) {
        aliens.position.z-=1;
      }
      moveDir = !moveDir;
    }
    if (moveDir) {
      aliens.position.x +=move;
    } else {
      aliens.position.x -=move;
    }

    if (boxAliens.max.z <= 0) {
      GameOver();
    }
    
    if (!tirEnCours) {
      bullet.position.set(vaisseau.position.x, 1, vaisseau.position.z);
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
        collisionPlayerBullet();
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

      /// Apparition de la soucoupe volante de temps en temps ex toutes les 8 secondes
      if (soucoupe.position.x <30 && ApparitionSoucoupe) {
        soucoupe.position.x += 6*move;
        soucoupe.rotateZ(Math.PI/14);
      } else {
        soucoupe.visible = false;
        ApparitionSoucoupe = false;
      }


    // DEFINI ALIEN QUI Tire
        TirAlien(); ///
        if (bulletAlTabObject.length >0 && bulletAlTabObject!=undefined) {
          MoveTirAlien(moveDir, move);
          testPositionBulletAlien();
        }
          for (var i = 0; i < vaissBoucliers.children.length; i++) { //Ne pas oublier de retirer les objets supprimés
            if (vaissBoucliers.children[i] != undefined) {
              CollisionBulletAlien(vaissBoucliers.children[i]);
            }
          }

}
