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

function TirAlien() {
  var n = Math.round(Math.random()*4000);
  if ((aliens.children[n]!=undefined) && (aliens.children[n].userData[0]=="alien")) {
    createBulletAlien(aliens.children[n].id);
  }
}

function MoveTirAlien(moveDir, move) {
    for (var i = 0; i < bulletAlTabObject.length; i++) {
      if (bulletAlTabObject[i]!=undefined) {
      /*  if (bulletAlTabObject[i].position.z <-30) {
          deleteBullet(bulletAlTabObject[i]);
        } else {*/
          bulletAlTabObject[i].position.z -= 0.2;
          if (moveDir) {
            bulletAlTabObject[i].position.x -=move;
          } else {
            bulletAlTabObject[i].position.x +=move;
          }
        //}
      }
    }
}

function deleteBullet(object) {
//  var removedItem = bulletAlTab.splice(bulletAlTab.indexOf(object.id), 1);
//  var removedItem2 = bulletAlObject.splice(bulletAlObject.indexOf(object.id), 1);
  aliens.remove(object);
  object.geometry.dispose();
  object.material.dispose();
  object = undefined;
}

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
            alien.userData = ["alien", 10];
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
            alien.userData = ["alien", 20];
            aliens.add( alien );
            collidableMeshList.push(alien);
         }
      }

        for (var i = 1; i <= 10 ; i++) {
            var alien = new THREE.Mesh( geometryA, new THREE.MeshPhongMaterial({color: 0xcd5c5c}), );
            alien.position.x = (3 * i) + xOffset;
            alien.position.y = 1;
            alien.position.z = 16;
            alien.userData = ["alien", 30];
            aliens.add( alien );
            collidableMeshList.push(alien);
        }

    //soucoupe volante
    soucoupe = new THREE.Mesh( new THREE.TorusGeometry( 2, 1.5, 3, 20 ), new THREE.MeshPhongMaterial( { color: 0x787878 } ) );
    soucoupe.position.set(-30, 1, 22);
    soucoupe.visible = false;
    soucoupe.rotateX(Math.PI/2);
    soucoupe.userData = ["soucoupe", 50];
    scene.add( soucoupe );
    collidableMeshList.push(soucoupe);
}

function deleteAlien(object) {
  aliens.remove(object);
  object.geometry.dispose();
  object.material.dispose();
  object = undefined;
  if (aliens.children.length==0) {
    console.log("PLUS D'ALIENS !!!!!!!!");
  }
}

function CollisionBulletAlien(BouclierVaisseau) { // TODO : collision des projectiles enemis sur bouclier et vaisseau: raycaster sur projectile, test dans le tableau qui contient 4 boucliers + vaisseau
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
