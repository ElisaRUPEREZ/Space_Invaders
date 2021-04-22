const manager = new THREE.LoadingManager()

manager.onLoad = function ( ) {
    console.log( "Loading complete!");
    StartGame();
}

manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
    console.log(`Items loaded: ${itemsLoaded}/${itemsTotal}`)
}

manager.onError = function ( url ) {
    console.log( 'There was an error loading ' + url )
}


function startLevel(level) {
  console.log("nouvelle version ahahahah");
  document.getElementById("ModalGameSuccess").style.display = "none";
  document.getElementById("ModalGameOver").style.display = "none";
  niveau =level;
  document.getElementById('OptionDiv').getElementsByTagName('h1')[0].innerHTML = 'Niveau '+niveau;
  document.getElementById('OptionDiv').getElementsByTagName('h1')[0].style.visibility = "visible";
  if (scene.children != null) {
    clearGame();
  }

  addObjectToscene();
}

function clearGame() {
  scene.clear();
  document.getElementById('VieDiv').innerHTML = '';
  points = 0;
  document.getElementById("ScoreDiv").innerHTML='<h1>Score : 0000</h1>';

  vaisseau = null;
  bullet= null;
  soucoupe= null;
  aliens= null;
  boxAliens= null;
  vaissBoucliers= null; // group

  tirEnCours = false;
  moveDir = true; /// sens de déplacement des aliens
  ApparitionSoucoupe = false;
    //tabObjects
  collidableMeshList = []; // liste objet pouvant être touchés par le joueur
  bulletAlTabObject = [];
  pause = false;
}



function addObjectToscene() {

  vaissBoucliers = new THREE.Group();
  grpVaisseauBoucliers = new THREE.Group();
  createWield();
  createVaisseau();

  scene.add(grpVaisseauBoucliers);
  createBullet();
  createSoucoupe()

  switch (niveau) {
    case 1:
      createAliens();
      break;
    case 2 :
      createAliensCircle();
      break;
    case 3 :
      createAliensWave();
      break;
  }

  
  scene.add(vaissBoucliers);
  const light = new THREE.DirectionalLight(0xFFFFFF, 1);
  light.position.set(-15, 15,-25);
  scene.add(light);

    // add Stats.js - https://github.com/mrdoob/stats.js
  stats = new Stats();
  stats.domElement.style.position	= 'absolute';
  stats.domElement.style.bottom	= '0px';
  document.body.appendChild( stats.domElement );

 // GridHelper
  const gridHelper = new THREE.GridHelper(70, 25);
  scene.add(gridHelper);

}

function StartGame() {
  console.log("START GAME");
  const fps  = 60;
  const slow = 1; // slow motion! 1: normal speed, 2: half speed...
  loop.dt       = 0,
  loop.now      = timestamp();
  loop.last     = loop.now;
  loop.fps      = fps;
  loop.step     = 1/loop.fps;
  loop.slow     = slow;
  loop.slowStep = loop.slow * loop.step;

  gameLoop();
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

    //Déplacement caméra qui suit le vaisseau
    if (cameraMode == 1) {
      camera.lookAt( vaisseau.position.x, 0, -vaisseau.position.z );
      camera.position.set(vaisseau.position.x, 10, vaisseau.position.z-10);
    } else {
      if (cameraMode == 2) {
        camera.lookAt( vaisseau.position.x, 0, -vaisseau.position.z );
        camera.position.set(vaisseau.position.x, 25, vaisseau.position.z-18);
      }
    }
    
    renderer.render(scene, camera);  // rendu de la scène
    loop.last = loop.now;

    requestAnimationFrame(gameLoop); // relance la boucle du jeu

    controls.update();
    stats.update();

  }
}

function update(step) {
  const move = 2.5 * step;

  MoveAliens(move);
  TirAlien();
  updateTirAlien(move);
  updateVaisseauAndBullet();

  for (let index = 0; index < grpVaisseauBoucliers.children.length; index++) {
    if (grpVaisseauBoucliers.children[index] !=undefined) {
      CollisionBulletAlienOnBV(grpVaisseauBoucliers.children[index]);
    }   
  }

  if (soucoupe!=undefined && Math.round(Math.random()*1000) == 8 && !ApparitionSoucoupe) {
    console.log("SOUCOUPE EN VUE");
    ApparitionSoucoupe = true;
    soucoupe.visible = true;
    soucoupeBox.position.x = -45;
  }

  updateSoucoupe(move);
}