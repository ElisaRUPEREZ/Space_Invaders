function startLevel(level) {
  
  document.getElementById("ModalGameSuccess").style.display = "none";
  document.getElementById("ModalGameOver").style.display = "none";
  niveau =level;
  document.getElementById('OptionDiv').getElementsByTagName('h1')[0].innerHTML = 'Niveau '+niveau;
  document.getElementById('OptionDiv').getElementsByTagName('h1')[0].style.visibility = "visible";
  if (scene.children != null) {
    clearGame();
  }
  addObjectToscene();
  //testAlien(0x34c924);
  /* Vérifier objects sont chargés puis*/
  gameLoop();
}

function clearGame() {
  scene.clear();
  document.getElementById('VieDiv').innerHTML = '';
  points = 0;
  document.getElementById("ScoreDiv").innerHTML='<h1>Score : 0000</h1>';

  tirEnCours = false;
  moveDir = true; /// sens de déplacement des aliens
  ApparitionSoucoupe = false;
    //tabObjects
  collidableMeshList = []; // liste objet pouvant être touchés par le joueur
  bulletAlTabObject = [];

  pause = false;

  invincible = false;

}



function addObjectToscene() {

  vaissBoucliers = new THREE.Group();
  scene.add(vaissBoucliers);

  createVaisseau();
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
  const gridHelper = new THREE.GridHelper(60, 30);
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
  const move = 2.5 * step;

    MoveAliens(move);

    updateVaisseauAndBullet();

      //TODO : Mettre un intervalle de temps
        if (soucoupe!=undefined && Math.round(Math.random()*1000) == 8 && !ApparitionSoucoupe) {
          console.log("SOUCOUPE EN VUE");
          ApparitionSoucoupe = true;
          soucoupe.visible = true;
         // soucoupe.position.x = -35; //-30
          soucoupeBox.position.x = -40;
        }

        updateSoucoupe(move);
        TirAlien(); ///
        updateTirAlien(move);

}