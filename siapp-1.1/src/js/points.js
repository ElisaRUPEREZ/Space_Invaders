let points =0;
let nbAliensTue;
//let pv boucliers = [];

function calculPoints(pts) {
  points+=pts;
  console.log("Points = " + points);
  // Partie Affichage :

}

function removeObject(object) {
  scene.remove(object);
  object.geometry.dispose();
  object.material.dispose();
  object = undefined;
}

function calculPVbouclier(object) {
  object.userData[1] -=1;
  console.log("Bouclier PV : " + object.userData[1]);
  if (object.userData[1] == 0) {
  //  removeObject(object);
    vaissBoucliers.remove(object);
    object.geometry.dispose();
    object.material.dispose();
    object = undefined;
  }
}

function GameSuccess() {
  //passer niv suivant
}

function GameOver() {
  //recommencer le niveau
}
