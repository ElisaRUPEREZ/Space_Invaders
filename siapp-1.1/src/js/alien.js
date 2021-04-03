/*--------------------------------------------------CREATION DES OBJETS---------------------------------------------------------------------------*/
function createAliens() {
  aliens = new THREE.Group();
  scene.add(aliens);

  const geometryA = new THREE.BoxGeometry(2,2,2);
  const materialA = new THREE.MeshBasicMaterial();

      var xOffset = -17;
      for (var k = 0; k <= 1; k++) {
        for (var i = 1; i <= 10 ; i++) {
            var alien = new THREE.Mesh( geometryA, new THREE.MeshPhongMaterial({color: 0x34c924}), );
            alien.position.x = (3 * i) + xOffset;
            alien.position.y = 1;
            alien.position.z = 4*k;
            alien.userData = ["alien", 100];
            aliens.add( alien );
            collidableMeshList.push(alien);
         }
      }

      for (var k = 0; k <= 1; k++) {
        for (var i = 1; i <= 10 ; i++) {
            var alien = new THREE.Mesh( geometryA, new THREE.MeshPhongMaterial({color: 0x0f04cf}), );
            alien.position.x = (3 * i) + xOffset;
            alien.position.y = 1;
            alien.position.z = 8 +(4*k); // 8 et 12
            alien.userData = ["alien", 200];
            aliens.add( alien );
            collidableMeshList.push(alien);
         }
      }

        for (var i = 1; i <= 10 ; i++) {
            var alien = new THREE.Mesh( geometryA, new THREE.MeshPhongMaterial({color: 0xcd5c5c}), );
            alien.position.x = (3 * i) + xOffset;
            alien.position.y = 1;
            alien.position.z = 16;
            alien.userData = ["alien", 300];
            aliens.add( alien );
            collidableMeshList.push(alien);
        }

    //soucoupe volante
    soucoupe = new THREE.Mesh( new THREE.TorusGeometry( 2, 1.5, 3, 20 ), new THREE.MeshPhongMaterial( { color: 0x787878 } ) );
    soucoupe.position.set(-30, 1, 22);
    soucoupe.visible = false;
    soucoupe.rotateX(Math.PI/2);
    soucoupe.userData = ["soucoupe", 500];
    scene.add( soucoupe );
    collidableMeshList.push(soucoupe);
}

function createBulletAlien(alienID) { /// TODO: alternative au projectile dans le groupe aliens
  const geometryBA = new THREE.OctahedronGeometry(0.6);
  const materialBA = new THREE.MeshBasicMaterial({color: 0x000000});

  let bulletAl = new THREE.Mesh( geometryBA, materialBA );

  var al = scene.getObjectById(alienID);
  bulletAl.position.set(al.position.x,al.position.y,al.position.z);

  bulletAl.userData = ["bulletAlien"];

  aliens.add( bulletAl );
  collidableMeshList.push(bulletAl); // ok
  bulletAlTabObject.push(bulletAl);
}

/*--------------------------------------------------DESTRUCTION DES OBJETS -----------------------------------------------------------------*/
function deleteBullet(object) {
//  var removedItem = bulletAlTab.splice(bulletAlTab.indexOf(object.id), 1);
//  var removedItem2 = bulletAlObject.splice(bulletAlObject.indexOf(object.id), 1);
  aliens.remove(object);
  object.geometry.dispose();
  object.material.dispose();
  object = undefined;
}

function deleteAlien(object) {
  soundDeathAlien.play();
  aliens.remove(object);
  object.geometry.dispose();
  object.material.dispose();
  object = undefined;
  if (aliens.children.length==0) {
    console.log("PLUS D'ALIENS !!!!!!!!");
    GameSuccess();

  }
}

/*------------------------------------------------------FONCTIONS UPDATE------------------------------------------------------------------------*/
function TirAlien() {
  var n = Math.round(Math.random()*4000);
  if ((aliens.children[n]!=undefined) && (aliens.children[n].userData[0]=="alien")) {
    createBulletAlien(aliens.children[n].id);
  }
}
function testPositionBulletAlien() {
  for (var i = 0; i < bulletAlTabObject.length; i++) {
      if ((bulletAlTabObject[i]!=undefined)&&(bulletAlTabObject[i].position.z <-30)) {
        deleteBullet(bulletAlTabObject[i]);
      }
  }
}

function MoveTirAlien(moveDir, move) {
    for (var i = 0; i < bulletAlTabObject.length; i++) {
      if (bulletAlTabObject[i]!=undefined) {
          bulletAlTabObject[i].position.z -= 0.2;
          if (moveDir) {
            bulletAlTabObject[i].position.x -=move;
          } else {
            bulletAlTabObject[i].position.x +=move;
          }
        }
      }
}

function MoveAliens(move) {
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
}

function updateTirAlien(move) {
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

function updateSoucoupe(move) {
  if (soucoupe.position.x <30 && ApparitionSoucoupe) {
    soucoupe.position.x += 6*move;
    soucoupe.rotateZ(Math.PI/14);
  } else {
    soucoupe.visible = false;
    ApparitionSoucoupe = false;
  }
}

function CollisionBulletAlien(BouclierVaisseau) {
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
                if (!invincible) {
                    calculPVvaisseau(BouclierVaisseau);
                }
              break;
          }
    }
}
