let points =0;
let nbAliensTue;

function calculPoints(pts) {
  points+=pts;
  console.log("Points = " + points);
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
    removeObject(object)
  }
}

function GameSuccess() {
  //passer niv suivant
}

function GameOver() {
  //recommencer le niveau
}
