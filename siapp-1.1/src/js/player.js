function createWield() {
  //TODO: Création des 4 boucliers :
  const geometryWield = new THREE.PlaneGeometry( 6, 4 , 10, 10);
  const materialWield  = new THREE.MeshBasicMaterial( {color: 0x787878, side: THREE.DoubleSide, transparent: true, opacity: 0.8} );

  for (var i = 0; i < 4; i++) {
    const plane = new THREE.Mesh( geometryWield , materialWield  );
    plane.position.set(15 + (i*14) - 35, 1, -17);
    plane.userData = ["bouclier", 10];
    vaissBoucliers.add( plane );

    collidableMeshList.push(plane);
    TabObstacles.push(plane);
  }

}


function createVaisseau() {
    // add some geometries
    const geometry = new THREE.BoxGeometry(4,2,2);
    const material = new THREE.MeshNormalMaterial( );
    vaisseau = new THREE.Mesh( geometry, material, );
    vaisseau.position.set(0, 1, -22);
    vaissBoucliers.add( vaisseau );
    vaisseau.userData = ["vaisseau", 3];
    TabObstacles.push(vaisseau);
}


function createBullet() {
  // Balle 1 à la fois disparait lorsque elle atteint le bout du plateau ou touche sa cible
    const geometryS = new THREE.SphereGeometry(0.4);
    const materialS = new THREE.MeshNormalMaterial( );
    bullet = new THREE.Mesh( geometryS, materialS, );
    bullet.position.set(0,1,-22+5);
    scene.add( bullet );
    bullet.userData = ["bullet"];
}

/***
  function active le tir (balle visible et placée à l'endroit du vaisseau)
  function arrete la balle (rend invisible et arrete le déplacement)
*/

function ActiveTir() {
  tirEnCours = true;
  bullet.position.set(vaisseau.position.x, 1, vaisseau.position.z);
}

function DesactiveTir() {
  tirEnCours = false;
  bullet.position.set(vaisseau.position.x, 1, vaisseau.position.z);
}

function calculPVvaisseau(object) {
  object.userData[1] -=1;
  if (object.userData[1] == 0) {
    console.log("GAME OVER");
  }
}

//Peut être améliorer la fonction comme celle au dessuss
function collision() { // collision du tir du joueur sur les aliens, soucoupe, boucliers
    var originPoint = bullet.position.clone();
    for (var vertexIndex = 0; vertexIndex < bullet.geometry.vertices.length; vertexIndex++) {
        var ray = new THREE.Raycaster( bullet.position, bullet.geometry.vertices[vertexIndex], 0, 0.8 );

        var collisionResults = ray.intersectObjects( collidableMeshList);
        if ( collisionResults.length > 0)  { //id ou uuid ????
           var object = scene.getObjectById( collisionResults[0].object.id);
           if (object != undefined) {
             switch (object.userData[0]) {
               case "alien":
                 calculPoints(object.userData[1]);
                 deleteAlien(object);
                 break;
               case "soucoupe":
                 calculPoints(object.userData[1]);
                 object.visible= false;
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
    }
}
