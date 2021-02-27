let points =0;
let niveau = 1;

/*let stats = {
    niveaux : 1, 2, 3,
    vitesseAlien: 0.2, 0.4, 0.6,
    PVvaisseau: 5, 4, 3
    ProbaTirAlien: 4000, 2000, 1000
}
*/


function calculPoints(pts) {
  points+=pts;
  let pointStr = "" + points;
  // Partie Affichage :
  document.getElementById("ScoreDiv").innerHTML=`<h1>Score <br />` + pointStr.padStart(3, '0') + `</h1>`;
}

function removeObject(object) {
  scene.remove(object);
  object.geometry.dispose();
  object.material.dispose();
  object = undefined;
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

function GameSuccess() { // si tts les alien ont été tué ???
  //passer niv suivant
}

function GameOver() { //si pv vaisseau ==0 ou alien touche le vaisseau ou alien touche la ligne de "terre"
  //recommencer le niveau

  //menu qui s'affiche recommencer le niveau ou revenir à l'écran titre
}

function createDisplayScore() {
  var loader = new THREE.FontLoader();
loader.load( '/src/medias/fonts/Imprint_MT_Shadow_Regular.json', function ( font ) {

  var textGeometry = new THREE.TextGeometry( "Score :", {

    font: font,

    size: 4,
    height: 2,
  /*  curveSegments: 6,

    bevelThickness: 1,
    bevelSize: 1,
    bevelEnabled: true
*/
  });

  var textMaterial = new THREE.MeshPhongMaterial(
    { color: 0xa3800f, specular: 0xffffff }
  );

  var mesh = new THREE.Mesh( textGeometry, textMaterial );
  mesh.quaternion.copy(camera.quaternion);
//  mesh.rotateX(Math.PI/2);
//  mesh.rotateY(Math.PI);
//  mesh.rotateZ(90);
  scene.add( mesh );

});


}
