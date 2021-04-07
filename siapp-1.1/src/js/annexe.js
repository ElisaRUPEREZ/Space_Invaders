let scoreJeu = {
  scoreniv1 :0,
  scoreniv2 :0,
  scoreniv3 :0,
  scoretotal :0
};

function changeCSSTheme() {
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

function MusicButton() {
  //                 music.playbackRate+=0.1;
  if (music.isPlaying) {
      music.stop();
      document.getElementById('iconMusic').src = "src/medias/pictures/play-solid.svg";
  } else {
      music.play();
      document.getElementById('iconMusic').src = "src/medias/pictures/stop-solid.svg";
  }
}

function EffectButton() {

  if (soundLaser.getVolume()>0) {
      soundLaser.setVolume(0);
      soundDeathAlien.setVolume(0);
      document.getElementById('iconVolume').src = "src/medias/pictures/volume-mute-solid.svg";
  } else {
      soundLaser.setVolume(0.5);
        soundDeathAlien.setVolume(0.5);
      document.getElementById('iconVolume').src = "src/medias/pictures/volume-up-solid.svg";
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
  niveau++;
  console.log("niveau : " + niveau);
  if (niveau > 3) {
    console.log("BRAVO VOUS AVEZ FINIS LE JEU");
  } else {
    document.getElementById("ModalGameSuccess").style.display = "block";
  }
  
}

function GameOver() { //si pv vaisseau ==0 ou alien touche le vaisseau ou alien touche la ligne de "terre"
  pause = true;
  document.getElementById("ModalGameOver").style.display = "block";
  let btn = document.getElementById("buttonGameOver");
  btn.onclick = function() {
    document.getElementById('mainMenu').style.display = "block";
    document.getElementById('OptionDiv').getElementsByTagName('h1')[0].style.visibility = "hidden";
    document.getElementById("ModalGameOver").style.display = "none";
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
