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
    vaisseauID = vaisseau.id;
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
