
//1 projectile par alien
//collision des projectiles : 4 boucliers le vaisseau et la balle tirée
//userData ajout de l'id de la bullet associée
function createBulletAlien(alienID) {
  const geometryBA = new THREE.OctahedronGeometry(0.4);
  const materialBA = new THREE.MeshBasicMaterial();

  bulletAl = new THREE.Mesh( geometryBA, materialBA );
  var al = scene.getObjectById(alienID);
  bulletAl.position.set(al.position.x,1,al.position.z);
  aliens.add(bulletAl);
  bulletAl.userData = ["bulletAlien", alienID];
  collidableMeshList.push(bulletAl);
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
