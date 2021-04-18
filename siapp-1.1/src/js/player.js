/*---------------------------- CREATION DES DIFFERENTS OBJETS------------------------------------------------------------------------------------------------*/

function createWield() {
  const geometryWield = new THREE.PlaneGeometry( 6, 4 , 10, 10);
  const materialWield  = new THREE.MeshBasicMaterial( {color: 0x787878, side: THREE.DoubleSide, transparent: true, opacity: 0.8} );

  for (var i = 0; i < 4; i++) {
    const plane = new THREE.Mesh( geometryWield , materialWield  );
    plane.position.set(15 + (i*14) - 35, 1, -17);
    plane.userData = ["bouclier", 10];
    vaissBoucliers.add( plane );
    collidableMeshList.push(plane);
  }

}


function createVaisseau() {
    

    var loader = new THREE.GLTFLoader(manager);
    loader.crossOrigin = true;
    loader.load( 'src/medias/models/spaceship/spaceship2.gltf', function ( data ) {
    
      var object = data.scene;

      const geometry = new THREE.BoxGeometry(8,4,8, 6, 6, 6);
      const material = new THREE.MeshNormalMaterial({opacity: 0.5,transparent: true});
      vaisseau = new THREE.Mesh( geometry, material, );
      vaisseau.position.set(0, 0, -24);
      vaisseau.userData = ["vaisseau", 3];
      

      object.position.set(vaisseau.position.x, 0 , vaisseau.position.z); //-30, 0, 22
      vaisseau.attach(object);
      vaissBoucliers.add( vaisseau );
  
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
  object.userData[1] -=1;
  if (object.userData[1] == 0) {
  //  removeObject(object);
    vaissBoucliers.remove(object);
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
          deleteBullet(object);
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
