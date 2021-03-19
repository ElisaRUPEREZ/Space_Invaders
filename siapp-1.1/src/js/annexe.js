function changeCSSTheme() {
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

function calculPoints(pts) {
  points+=pts;
  let pointStr = "" + points;
  // Partie Affichage :
  document.getElementById("ScoreDiv").innerHTML=`<h1>Score : ` + pointStr.padStart(4, '0') + `</h1>`;
}

/*function removeObject(object) {
  scene.remove(object);
  object.geometry.dispose();
  object.material.dispose();
  object = undefined;
}
*/

function GameSuccess() { // si tts les alien ont été tué ???

  if ( confirm( "Félicitation ! Vous avez tué tous les aliens, cliquez sur Confirmer pour passer au niveau suivant et Annuler pour revenir au menu principal" ) ) {
    console.log("passe au niv suivant");
    startLevel(niveau+1);
} else {
  //window.location.reload();
}
}

function GameOver() { //si pv vaisseau ==0 ou alien touche le vaisseau ou alien touche la ligne de "terre"
  //recommencer le niveau

  //menu qui s'affiche recommencer le niveau ou revenir à l'écran titre
  console.log("GAME OVER");
  if ( confirm( "Game Over recommencer le niveau ou revenir au menu principal" ) ) {
    window.location.reload();
}
}

function createDisplay() {
  const loader = new THREE.FontLoader();

  loader.load( 'src/medias/fonts/Imprint_MT_Shadow_Regular.json', function ( font ) {

  	const textGeometry  = new THREE.TextGeometry( 'Game Over', {
  		font: font,
  		size: 10,
  		height: 4/*,
  		curveSegments: 12,
  		bevelEnabled: true,
  		bevelThickness: 10,
  		bevelSize: 8,
  		bevelOffset: 0,
  		bevelSegments: 5*/
  	} );

    var textMaterial = new THREE.MeshPhongMaterial(
    { color: 0xff0000, specular: 0xffffff }
  );

  var mesh = new THREE.Mesh( textGeometry, textMaterial );

    scene.add(mesh);
        mesh.rotateY(Math.PI);
  } );



}
