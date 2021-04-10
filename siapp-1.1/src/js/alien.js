let soucoupeBox;
/*--------------------------------------------------CREATION DES OBJETS---------------------------------------------------------------------------*/
function createAliens() {
  aliens = new THREE.Group();
  scene.add(aliens);

  const geometryA = new THREE.BoxGeometry(2.5,4.5,2.5, 5, 5, 5);
  const materialA = new THREE.MeshNormalMaterial({wireframe: true, opacity: 0,transparent: true});

      var xOffset = -17;
      for (var k = 0; k <= 1; k++) {
        for (var i = 1; i <= 10 ; i++) {
            var alien = new THREE.Mesh( geometryA, materialA);
            alien.position.x = (4 * i) + xOffset;
            alien.position.y = 1;
            alien.position.z = 4.5*k;
            alien.userData = ["alien", 100];
            aliens.add( alien );
            collidableMeshList.push(alien);
            testAlien(0x34c924, alien);
         }
      }

      for (var k = 0; k <= 1; k++) {
        for (var i = 1; i <= 10 ; i++) {
            var alien = new THREE.Mesh( geometryA, materialA);
            alien.position.x = (4 * i) + xOffset;
            alien.position.y = 1;
            alien.position.z = 8.5 +(4.5*k); // 8 et 12
            alien.userData = ["alien", 200];
            aliens.add( alien );
            collidableMeshList.push(alien);
            testAlien(0x0f04cf, alien);
         }
      }

        for (var i = 1; i <= 10 ; i++) {
            var alien = new THREE.Mesh( geometryA, materialA);
            alien.position.x = (4 * i) + xOffset;
            alien.position.y = 1.5;
            alien.position.z = 9+(4.5*k);
            alien.userData = ["alien", 300];
            aliens.add( alien );
            collidableMeshList.push(alien);
            testAlien(0xcd5c5c, alien);

        }
}

function createAliensCircle() {
  console.log("radius 10  ");
  aliens = new THREE.Group();
  scene.add(aliens);

  const geometryA = new THREE.BoxGeometry(2,2,2);

      let radius = 13;
   //for (var k = 0; k <= 1; k++) {
        for (var i = 0; i < 20 ; i++) {
            var alien = new THREE.Mesh( geometryA, new THREE.MeshPhongMaterial({color: 0x34c924}), );
            alien.position.x = Math.cos(i*Math.PI/10)*radius;
            alien.position.y = 1;
            alien.position.z = Math.sin(i*Math.PI/10)*radius+4;
            alien.userData = ["alien", 100];
            aliens.add( alien );
            collidableMeshList.push(alien);
         }

         for (var i = 0; i < 20 ; i++) {
          var alien = new THREE.Mesh( geometryA, new THREE.MeshPhongMaterial({color: 0x0f04cf}), );
          alien.position.x = Math.cos(i*Math.PI/10)*(radius-4);
          alien.position.y = 1;
          alien.position.z = Math.sin(i*Math.PI/10)*(radius-4)+4;
          alien.userData = ["alien", 200];
          aliens.add( alien );
          collidableMeshList.push(alien);
       }
       for (var i = 0; i < 10 ; i++) {
        var alien = new THREE.Mesh( geometryA, new THREE.MeshPhongMaterial({color: 0xcd5c5c}), );
        alien.position.x = Math.cos(i*Math.PI/5)*(radius-8);
        alien.position.y = 1;
        alien.position.z = Math.sin(i*Math.PI/5)*(radius-8)+4;
        alien.userData = ["alien", 300];
        aliens.add( alien );
        collidableMeshList.push(alien);
     }
}

function createAliensWave() {
  aliens = new THREE.Group();
  scene.add(aliens);

  const geometryA = new THREE.BoxGeometry(2,2,2);
  
  for (var k = 0; k <= 1; k++) {
    for (var i = 0; i < 10 ; i++) {
      var alien = new THREE.Mesh( geometryA, new THREE.MeshPhongMaterial({color: 0x34c924}), );
      alien.position.x = 3.2*i;
      alien.position.y = 1;
      if (k==0) {
        alien.position.z = -Math.sin(i) + k*6 -4;
      } else {
        alien.position.z = Math.sin(i) + k*6 -4;
      }
      
      alien.userData = ["alien", 100];

      aliens.add( alien );
      collidableMeshList.push(alien);
   }
}
  for (var k = 0; k <= 1; k++) {
      for (var i = 0; i < 10 ; i++) {
        var alien = new THREE.Mesh( geometryA, new THREE.MeshPhongMaterial({color: 0x0f04cf}), );
        alien.position.x = 3.2*i;
        alien.position.y = 1;
        if (k==0) {
          alien.position.z = -Math.sin(i) + 10+k*6;
        } else {
          alien.position.z = Math.sin(i) + 10+k*6;
        }
        
        alien.userData = ["alien", 200];

        aliens.add( alien );
        collidableMeshList.push(alien);
      }
   }
       
       for (var i = 0; i < 10 ; i++) {
        var alien = new THREE.Mesh( geometryA, new THREE.MeshPhongMaterial({color: 0xcd5c5c}), );
        alien.position.x = 14.5+Math.cos(i*Math.PI/5)*2.5;
        alien.position.y = 1;
        alien.position.z = 6+Math.sin(i*Math.PI/5)*2.5;
        alien.userData = ["alien", 300];
        aliens.add( alien );
        collidableMeshList.push(alien);
     }
}

function createSoucoupe() {
  soucoupeBox = new THREE.Mesh( new THREE.TorusGeometry( 3, 1.8, 3, 20 ), new THREE.MeshPhongMaterial( { color: 0x787878,opacity: 0,transparent: true} ) );
  soucoupeBox.position.set(-40, 1.5, 22);
  soucoupeBox.rotateX(Math.PI/2);
  soucoupeBox.userData = ["soucoupe", 500];
  scene.add(soucoupeBox);
  collidableMeshList.push(soucoupeBox);


  var loader2 = new THREE.GLTFLoader();
  loader2.crossOrigin = true;
  loader2.load( 'src/medias/models/ufo/scene.gltf', function ( data ) {
  
    var object = data.scene;
    object.position.set(soucoupeBox.position.x, -1, soucoupeBox.position.z); //-30, 0, 22
    scene.add( object );
      
    soucoupe = scene.getObjectById(object.id);
    soucoupeBox.attach(object);
    object.visible = true;

    //, onProgress, onError );
  });
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
  object.clear();
  aliens.remove(object);
  object.geometry.dispose();
  object.material.dispose();
  object = undefined;
  if (aliens.children.length==0) {
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
  //console.log("BOX xmax = " + boxAliens.max.x + "\nxmin =  " + boxAliens.min.x);
  //Mouvements des Aliens  :
    if (boxAliens.max.x>=30 || boxAliens.min.x<=-30) {
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
      if (aliens.children.length>0) {
        GameOver();
      }
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
  if (soucoupe!=undefined) {
    if (soucoupeBox.position.x <40 && ApparitionSoucoupe) {
      //soucoupe.position.x += 5*move;
      soucoupeBox.position.x += 5*move;
      soucoupe.rotateY(Math.PI/20);
    } else {
      soucoupe.visible = false;
      ApparitionSoucoupe = false;
    }
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

function testAlien(colorA, alien) {
  var object;
  var loader2 = new THREE.GLTFLoader();
  loader2.crossOrigin = true;
  loader2.load( 'src/medias/models/mad_octopus/test.gltf', function ( data ) {
  
    object = data.scene;
    object.position.set(alien.position.x+3.8, 2.5, alien.position.z); //-30, 0, 22
    var mat = new THREE.MeshPhongMaterial({color: colorA});
    object.traverse((o) => {
      if (o.isMesh) o.material = mat;
    })
    object.rotateY(Math.PI);
    scene.add( object );
    alien.attach(object);
    //, onProgress, onError );
  });
  return object;
}