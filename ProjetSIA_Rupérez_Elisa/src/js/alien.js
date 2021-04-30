/*--------------------------------------------------CREATION DES OBJETS---------------------------------------------------------------------------*/
const geometryA = new THREE.BoxGeometry(2.9,4.5,2.9, 6, 6, 6);
const materialA = new THREE.MeshNormalMaterial({opacity: 0,transparent: true});

function createAliens() {
  aliens = new THREE.Group();
  scene.add(aliens);

  var xOffset = -28;
  for (var k = 0; k <= 1; k++) {
    for (var i = 1; i <= 10 ; i++) {
      loadAlien(new THREE.MeshPhongMaterial({color: 0x006600, shininess: 40}), xOffset + (4 * i), 1, 4.5*k, 100);    
              
    }
  }

  for (var k = 0; k <= 1; k++) {
    for (var i = 1; i <= 10 ; i++) {
      loadAlien(new THREE.MeshStandardMaterial({color: 0x006699}),xOffset + (4 * i), 1, 8.5 +(4.5*k), 200);            
    }
  }

  for (var i = 1; i <= 10 ; i++) {
    loadAlien(new THREE.MeshLambertMaterial({color: 0x4d2600}),xOffset+ (4 * i), 1, 9+(4.5*k), 300);
  }
}

function createAliensCircle() {
  aliens = new THREE.Group();
  scene.add(aliens);
  let Offsetx = -15;
  let radius = 13;

  for (var i = 0; i < 20 ; i++) {
    loadAlien(new THREE.MeshPhysicalMaterial({color: 0x808080}), Offsetx + Math.cos(i*Math.PI/10)*radius, 1, Math.sin(i*Math.PI/10)*radius+4, 100);             
  }

  for (var i = 0; i < 20 ; i++) {
    loadAlien(new THREE.MeshPhongMaterial({color: 0xe6b3cc}), Offsetx + Math.cos(i*Math.PI/10)*(radius-4), 1, Math.sin(i*Math.PI/10)*(radius-4)+4, 200); 
  }

  for (var i = 0; i < 10 ; i++) {
    loadAlien(new THREE.MeshStandardMaterial({color: 0xff66a3}), Offsetx + Math.cos(i*Math.PI/5)*(radius-8), 1, Math.sin(i*Math.PI/5)*(radius-8)+4, 300);                     
  }
}

function createAliensWave() {
  aliens = new THREE.Group();
  scene.add(aliens);
  let Offsetx = -10;
  let Offsetz = 3;

  for (var k = 0; k <= 1; k++) {
    for (var i = 0; i < 10 ; i++) {
      let valZ;
      if (k==0) {
        valZ = -Math.sin(i) + k*6 -4;
      } else {
        valZ = Math.sin(i) + k*6 -4;
      }
      loadAlien(new THREE.MeshPhysicalMaterial({color: 0xff8533}), Offsetx +3.2*i, 1, valZ + Offsetz, 100);
    }
  }
  for (var k = 0; k <= 1; k++) {
    for (var i = 0; i < 10 ; i++) {
      let valZ;
      if (k==0) {
        valZ = -Math.sin(i) + 10+k*6;
      } else {
        valZ = Math.sin(i) + 10+k*6;
      }
      loadAlien(new THREE.MeshPhysicalMaterial({color: 0xb30000}), Offsetx + 3.2*i, 1, valZ + Offsetz, 200);
    }
  }
       
  for (var i = 0; i < 10 ; i++) {
    loadAlien(new THREE.MeshPhysicalMaterial({color: 0x1a1a1a}), Offsetx + 14.5+Math.cos(i*Math.PI/5)*2.5, 1, 6+Math.sin(i*Math.PI/5)*2.5 + Offsetz, 300);        
  }
}

function loadAlien(material, x, y, z, points) {
  var object; let i = 0;
  var loader2 = new THREE.GLTFLoader(manager);
  loader2.crossOrigin = true;
  loader2.load( 'src/medias/models/mad_octopus/alienLowPoly.gltf', function ( data ) {
  
    object = data.scene;

    var mat = material;
    object.traverse((o) => {
      if (o.isMesh) o.material = mat;
    })

    object.rotateY(Math.PI);
    object.position.set(x, 2, z);


    var alien = new THREE.Mesh( geometryA, materialA);
    alien.userData = ["alien", points];
    alien.position.set(object.position.x, y, object.position.z);
    alien.attach(object);
    aliens.add( alien );
    collidableMeshList.push(alien);

    createBulletAlien(alien, material);

  });
 // return object;
}

function createBulletAlien(al, mesh) {
  const geometryBA = new THREE.OctahedronGeometry(0.6);
 // const materialBA = new THREE.MeshBasicMaterial({color: 0x000000});
  let materialBA = mesh;
  let bulletAl = new THREE.Mesh( geometryBA, materialBA );

  bulletAl.position.set(al.position.x,al.position.y -2,al.position.z);
  bulletAl.userData = ["bulletAlien", false];
  bulletAl.visible = false;

  collidableMeshList.push(bulletAl); 
  bulletAlTabObject.push(bulletAl);
  al.attach(bulletAl);
}


function createSoucoupe() {
  soucoupeBox = new THREE.Mesh( new THREE.TorusGeometry( 3, 1.8, 3, 20 ), new THREE.MeshPhongMaterial( { color: 0x787878,opacity: 0,transparent: true} ) );
  soucoupeBox.position.set(-40, 1.5, 25);
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

  });
}
/*--------------------------------------------------DESTRUCTION DES OBJETS -----------------------------------------------------------------*/
function deleteBullet(object) {
  aliens.remove(object);
  object.geometry.dispose();
  object.material.dispose();
  object = undefined;
}

function deleteAlien(object) {
  soundDeathAlien.play();
  object.clear();
  aliens.remove(object);
  scene.remove(object);
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
    aliens.children[n].children[1].userData[1] =true;
    aliens.children[n].children[1].position.set(0,0,0);
    aliens.children[n].children[1].visible = true;
  }
}

function resetPosBulletAl(bulletAl) {
  bulletAl.userData[1] = false;
  bulletAl.position.set(0,-2,0);
  bulletAl.visible = false;
}

function MoveTirAlien(moveDir, move) {
  for (var i = 0; i < bulletAlTabObject.length; i++) {
    if (bulletAlTabObject[i].userData[1]==true) {
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
  if (boxAliens.max.x>=35 || boxAliens.min.x<=-35) {
    if (!invincible) {
      aliens.translateZ(-1);
    }
    moveDir = !moveDir;
  }
  if (moveDir) {
        aliens.translateX(move);
  } else {
       aliens.translateX(-move);
  }
    //Teste l'emplacement de la Box3 contenant les aliens
  if (boxAliens.max.z <= 0) {
    if (aliens.children.length>0) {
      GameOver();
    }
  }
}

function updateTirAlien(move) {
  if (bulletAlTabObject.length >0 && bulletAlTabObject!=undefined) {
    MoveTirAlien(moveDir, move);
  }
}

function updateSoucoupe(move) {
  if (soucoupe!=undefined) {
    if (soucoupeBox.position.x <40 && ApparitionSoucoupe) {
      soucoupeBox.position.x += 5*move;
      soucoupe.rotateY(Math.PI/20);
    } else {
      soucoupe.visible = false;
      ApparitionSoucoupe = false;
    }
  }

}

function CollisionBulletAlienOnBV(BouclierVaisseau) {
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
             resetPosBulletAl(res);
             calculPVbouclier(BouclierVaisseau);
              break;
            case "vaisseau":
             resetPosBulletAl(res);
                if (!invincible) {
                    calculPVvaisseau(BouclierVaisseau);
                }
              break;
            case "wall":
              resetPosBulletAl(res);
            break;
          }
    }
}