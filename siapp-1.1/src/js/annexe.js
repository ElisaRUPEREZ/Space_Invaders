let scoreJeu = {
  scoreniv1 :0,
  scoreniv2 :0,
  scoreniv3 :0,
  scoretotal :0
};

function changeCSSTheme() {
    var theme = document.getElementsByTagName('link')[1];

    if (theme.getAttribute('href') == './src/css/siapp-light.css') {
        theme.setAttribute('href', './src/css/siapp-dark.css');
          document.getElementById('iconSunMoon').src = "src/medias/images/sun-solid.svg";
          scene.background = scenebackground.dark;
          lightMode = false;
    } else {
        theme.setAttribute('href', './src/css/siapp-light.css');
        //moon icon
        document.getElementById('iconSunMoon').src = "src/medias/images/moon-solid.svg";
        scene.background = scenebackground.light;
        lightMode = true;
    }
}

function MusicButton() {
  if (music.isPlaying) {
      music.stop();
      document.getElementById('iconMusic').src = "src/medias/images/play-solid.svg";
  } else {
      music.play();
      document.getElementById('iconMusic').src = "src/medias/images/stop-solid.svg";
  }
}

function EffectButton() {

  if (soundLaser.getVolume()>0) {
      soundLaser.setVolume(0);
      soundDeathAlien.setVolume(0);
      document.getElementById('iconVolume').src = "src/medias/images/volume-mute-solid.svg";
  } else {
      soundLaser.setVolume(0.5);
        soundDeathAlien.setVolume(0.5);
      document.getElementById('iconVolume').src = "src/medias/images/volume-up-solid.svg";
  }
}

function calculPoints(pts) {
  points+=pts;
  let pointStr = "" + points;
  // Partie Affichage :
  document.getElementById("ScoreDiv").innerHTML=`<h1>Score : ` + pointStr.padStart(4, '0') + `</h1>`;
}

function GameSuccess() { 
  niveau++;
  console.log("niveau : " + niveau);
  if (niveau > 3) {
    console.log("BRAVO VOUS AVEZ FINIS LE JEU");
  } else {
    document.getElementById("ModalGameSuccess").style.display = "block";
  }
  
}

function GameOver() {
  pause = true;
  document.getElementById("ModalGameOver").style.display = "block";
  let btn = document.getElementById("buttonGameOver");
  btn.onclick = function() {
    document.getElementById('mainMenu').style.display = "block";
    document.getElementById('OptionDiv').getElementsByTagName('h1')[0].style.visibility = "hidden";
    document.getElementById("ModalGameOver").style.display = "none";
  }
}