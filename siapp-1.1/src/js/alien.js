/*  PROCEDURE TIR DES ENEMIS
*   1) On choisit un alien au hasard --> aliens.children
          - l'alien de doit pas être dans la liste des aliens qui tirent en ce moment
          - sinon on l'ajoute au tableau (juste l'uuid ou id)
*   2) On créer une balle
          - tableau pour les tir enemis pour faire avancer seulement les balles tirées
*   3) Déplacement de la balle
*   4) Test des collisions
    5) Supprimer la balle
        - on supprime la balle et l'alien dans les tableaux respectifs
*/


//tableau d'alien qui tir
// groupe de tir enemis --> on fait avancer tout le groupe et on peut chercher un tir en particulier AlBul.children
//1 projectile par alien
//collision des projectiles : 4 boucliers le vaisseau et la balle tirée
//userData ajout de l'id de la bullet associée
function createBulletAlien(alienID) {
  const geometryBA = new THREE.OctahedronGeometry(0.4);
  const materialBA = new THREE.MeshBasicMaterial({color: 0x000000});

  bulletAl = new THREE.Mesh( geometryBA, materialBA );

  var al = scene.getObjectById(alienID);
  bulletAl.position.set(al.position.x,al.position.y,al.position.z);

  bulletAl.userData = ["bulletAlien", alienID];

  aliens.add( bulletAl );
  bulletAlTab.push(bulletAl.id);
  collidableMeshList.push(bulletAl);
}

function TirAlien() {
  var n = Math.round(Math.random()*4000);
  if ((aliens.children[n]!=undefined) && (aliens.children[n].userData[0]=="alien")) {
    console.log("TROUVE " + aliens.children[n].id);
    createBulletAlien(aliens.children[n].id);
  }
//
}

function MoveTirAlien() {

  //  bulletAlien.position.z -= 0.8;
    for (var i = 0; i < bulletAlTab.length; i++) {
    /*  if (bulletAlien[i].children.position.z <-20) {
        deleteBullet(bulletAlien[i].children);
      }*/
      scene.getObjectById(bulletAlTab[i]).position.z -= 0.3;
    }
}

function deleteBullet(object) {
  bulletAlien.remove(object);
  object.geometry.dispose();
  object.material.dispose();
  object = undefined;
//  object.userData[1] check if in the tab
}

function createAliens() {
  bulletAlien = new THREE.Group();
  scene.add(bulletAlien);


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
    //        createBulletAlien(alien.id);
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
}
