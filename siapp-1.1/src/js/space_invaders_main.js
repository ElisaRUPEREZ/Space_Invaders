"uses strict";

let container, w, h, scene, camera, controls, renderer, stats;
let loop = {};
let cameraMode = 0;
//objects :
let vaisseau;
let bullet;
let soucoupe;
let aliens;
let boxAliens;
let vaissBoucliers; // group
//booleans :
let tirEnCours = false;
let moveDir = true; /// sens de déplacement des aliens
let ApparitionSoucoupe = false;
//tabObjects
let collidableMeshList = []; // liste objet pouvant être touchés par le joueur
let bulletAlTabObject = [];


let pause = false;

let invincible = false;

let points =0;
let niveau = 1;

//window.addEventListener('load', go);
window.addEventListener('resize', resize);
window.addEventListener('keydown', keyPressed);

var keyboard = new THREEx.KeyboardState();

function keyPressed(e) {
  switch(e.key) {
    case '0':
          cameraMode = 0;
          camera.position.set(0, 40, 0);
    break;

    case '1':
        cameraMode = 1;
    break;
    case 'i':
          console.log("invincible");
          invincible = !invincible;

    break;
    case 'k':
          console.log("kill all");
          scene.remove(aliens);
          scene.remove(soucoupe);
          GameSuccess();
    break;
    case 'h':
      let styleDiv = document.getElementById('helpMenu').style.display;
      if (styleDiv =="none") {
        document.getElementById('helpMenu').style.display= "block";
      }
      else {
        document.getElementById('helpMenu').style.display= "none";
      }
      /*  if (pause) {
        pause = false;
        document.getElementById('helpMenu').style.display= "none";
        gameLoop();
        } else {
            pause = true;
              document.getElementById('helpMenu').style.display= "block";
    }*/
    break;
    case 'Escape':
        if (pause) {
        pause = false;
        gameLoop();
        } else {
            pause = true;
    }
    break;
  }
  e.preventDefault();
}

function go() {
  console.log("Go!");
  document.getElementById('mainMenu').style.display = "none";
  startLevel(1);
//  gameLoop();

}



function resize() {
  w = container.clientWidth;
  h = container.clientHeight;
  camera.aspect = w/h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}

function timestamp() {
  return window.performance.now();
}
