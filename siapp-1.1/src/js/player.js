/*---------------------------- CREATION DES DIFFERENTS OBJETS------------------------------------------------------------------------------------------------*/

function createWield() {
  const geometryWield = new THREE.PlaneGeometry( 5, 8 , 1, 1);
  const geometryWieldLat = new THREE.PlaneGeometry( 3.5, 8 , 1, 1);
  const materialWield  = new THREE.MeshBasicMaterial( {color: 0x787878, side: THREE.DoubleSide, transparent: true, opacity: 0.8} );

  for (var i = 0; i < 4; i++) {
    let planeC = new THREE.Mesh( geometryWield , materialWield  );
    planeC.position.set((i*17) - 25, 1, -17);
    planeC.userData = ["bouclier", 10];
    
    collidableMeshList.push(planeC);
    tabMeshVaissBou.push( planeC );
    scene.add(planeC);

    let planeL = new THREE.Mesh( geometryWieldLat , materialWield  );
    planeL.position.set(4+ planeC.position.x, 1, -18.5);
    planeL.userData = ["bouclier", 10];
    planeL.rotateY(5*Math.PI/4);
    collidableMeshList.push(planeL);
    tabMeshVaissBou.push( planeL );
    scene.add(planeL);

    let planeR = new THREE.Mesh( geometryWieldLat , materialWield  );
    planeR.position.set(planeC.position.x -4, 1, -18.5);
    planeR.userData = ["bouclier", 10];
    planeR.rotateY(-Math.PI/4);
    collidableMeshList.push(planeR);
    tabMeshVaissBou.push( planeR );
    scene.add(planeR);
    
  }

  let wall = new THREE.Mesh(new THREE.PlaneGeometry(80, 5, 1, 1, 1, 1), new THREE.MeshBasicMaterial( {color: 0x70a778, } ));
  wall.position.set(0, 0, -35);
  wall.userData = ["wall"];
  tabMeshVaissBou.push( wall );
  scene.add(wall);
  //vaissBoucliers.add( wall );
  //wally = wall;

}


function createVaisseau() {
  
    var loader = new THREE.GLTFLoader(manager);
    loader.crossOrigin = true;
    loader.load( 'src/medias/models/spaceship/spaceship.gltf', function ( data ) {
    
      var object = data.scene;

      const geometry = new THREE.BoxGeometry(5,4,8, 6, 6, 2);
      const material = new THREE.MeshNormalMaterial({opacity: 0,transparent: true});
      vaisseau = new THREE.Mesh( geometry, material, );
      vaisseau.position.set(0, 0, -28);
      vaisseau.userData = ["vaisseau", 3];
      

      object.position.set(vaisseau.position.x, 0 , vaisseau.position.z); //-30, 0, 22
      vaisseau.attach(object);

      tabMeshVaissBou.push(vaisseau);
      scene.add(vaisseau);
      //vaissBoucliers.add( vaisseau );

  
      //, onProgress, onError );
    });


    for (var i = 1; i <=3; i++) {
        document.getElementById('VieDiv').innerHTML += '<img class="vieIMG" id="vie'+i+'" src="src/medias/pictures/vie.png" />';
      }
}

function createBullet() {
    const geometryS = new THREE.SphereGeometry(0.4);
    const materialS = new THREE.MeshNormalMaterial( );
    bullet = new THREE.Mesh( geometryS, materialS, );
    bullet.position.set(0,1,-22+5);
    scene.add( bullet );
    bullet.userData = ["bullet"];
}

/*-----------------------------------ACTION----------------------------------------------------------------*/
function ActiveTir() {
  tirEnCours = true;
  soundLaser.play();
  bullet.position.set(vaisseau.position.x, 1, vaisseau.position.z);
}

function DesactiveTir() {
  tirEnCours = false;
  soundLaser.stop();
  bullet.position.set(vaisseau.position.x, 1, vaisseau.position.z);
}

function calculPVvaisseau(object) {
  document.getElementById('vie' + object.userData[1]).style.display = "none";
  object.userData[1] -=1;
  if (object.userData[1] == 0) {
    GameOver();
  }
}

function calculPVbouclier(object) {
  console.log("calcul pv bouclier" + object.userData[1]);
  object.userData[1] -=1;
  if (object.userData[1] == 0) {
  //  removeObject(object);
    scene.remove(object);
    object.geometry.dispose();
    object.material.dispose();
    object = undefined;
  }
}

function collisionPlayerBullet() { // collision du tir du joueur sur les aliens, soucoupe, boucliers
    var originPoint = bullet.position.clone();
    var object; var vertexIndex = 0;
    var touche = false;
    while ((vertexIndex < bullet.geometry.vertices.length)&&(touche==false)) {

      var localVertex = bullet.geometry.vertices[vertexIndex].clone();
      var globalVertex = localVertex.applyMatrix4( bullet.matrix );
      var directionVector = globalVertex.sub( bullet.position );

        var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize());
        var collisionResults = ray.intersectObjects( collidableMeshList);
        if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length())  { //id ou uuid ????
          object = scene.getObjectById( collisionResults[0].object.id);
           if (object != undefined && object.userData[0]!=undefined) {
             touche = true;
           }
        }
      vertexIndex++;
    }

    if (touche) {
      switch (object.userData[0]) {
        case "alien":
          soundDeathAlien.play();
          calculPoints(object.userData[1]);
          deleteAlien(object);
          break;
        case "soucoupe":
          calculPoints(object.userData[1]);
          soucoupe.visible= false;
          break;
        case "bouclier":
          calculPVbouclier(object);
          break;
        case "bulletAlien":
          //deleteBullet(object);
          resetPosBulletAl(object);
          break;
      }
      DesactiveTir();
    }
}
/*-------------------------------------------------- FONCTIONS UPDATE -----------------------------------------------------------------*/
function updateVaisseauAndBullet() {
  //Déplacements du vaisseau
    if (keyboard.pressed("left") && vaisseau.position.x<35)
      vaisseau.position.x += 0.2;
    if ( keyboard.pressed("right") && vaisseau.position.x>-35)
      vaisseau.position.x -= 0.2;
    if ( keyboard.pressed("space") ){
        if (!tirEnCours) {
          ActiveTir();
        }
    }

    if (tirEnCours) {
      collisionPlayerBullet();
      bullet.position.z += 0.6;
      if (bullet.position.z > 30) {
        DesactiveTir();
      }
    } else {
        bullet.position.set(vaisseau.position.x, 1, vaisseau.position.z);
    }
}
