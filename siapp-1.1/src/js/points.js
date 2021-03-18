function toggleTheme() {
    console.log("change theme");
    var theme = document.getElementsByTagName('link')[1];


    if (theme.getAttribute('href') == './css/siapp-light.css') {
        theme.setAttribute('href', './css/siapp-dark.css');
          document.getElementById('iconSunMoon').src = "src/medias/pictures/sun-solid.svg";
    } else {
        theme.setAttribute('href', './css/siapp-light.css');
        //moon icon
        document.getElementById('iconSunMoon').src = "src/medias/pictures/moon-solid.svg";
    }
}

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
  document.getElementById("ScoreDiv").innerHTML=`<h1>Score : ` + pointStr.padStart(3, '0') + `</h1>`;
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

  if ( confirm( "Félicitation ! Vous avez tué tous les aliens, cliquez sur Confirmer pour passer au niveau suivant et Annuler pour revenir au menu principal" ) ) {
    console.log("passe au niv suivant");
    startLevel(2);
} else {
  //window.location.reload();
}
}

function GameOver() { //si pv vaisseau ==0 ou alien touche le vaisseau ou alien touche la ligne de "terre"
  //recommencer le niveau

  //menu qui s'affiche recommencer le niveau ou revenir à l'écran titre
  console.log("GAME OVER");
//  createDisplayScore();
}

function createDisplayScore() {
  const loader = new THREE.FontLoader();

  loader.load( 'src/medias/fonts/I_Still_Know_Regular.json', function ( font ) {

  	const geometry = new THREE.TextGeometry( 'Hello three.js!', {
  		font: font,
  		size: 80,
  		height: 5,
  		curveSegments: 12,
  		bevelEnabled: true,
  		bevelThickness: 10,
  		bevelSize: 8,
  		bevelOffset: 0,
  		bevelSegments: 5
  	} );
  } );

}
