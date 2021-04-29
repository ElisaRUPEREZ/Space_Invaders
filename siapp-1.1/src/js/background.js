let sun; let orbit; let orbitsun; let moon;
let scenebackground = {};

function createBackgroundObjects() {
    let geometry = new THREE.SphereGeometry();
    let material = new THREE.MeshNormalMaterial({opacity: 0,transparent: true});
    orbit = new THREE.Mesh( geometry, material, );
    orbit.position.set(0,0,0);
    scene.add(orbit);

    


 /* orbitsun = new THREE.Mesh( geometry, material, );
    orbitsun.position.set(0,0,120);
    orbit.attach(orbitsun);*/
/*
  var loaderm = new THREE.TextureLoader(manager);
  var texture = loaderm.load("src/medias/models/moon/textures/Material.002_diffuse.jpeg");

  var moonMaterial = new THREE.MeshPhongMaterial({
    color: 0xaaaaaa,
    specular: 0x333333,
    flatShading: false,
    map: texture,

  });

  var loaderp1 = new THREE.TextureLoader(manager);
  var colorMap = loaderp1.load("src/medias/models/exo_planet/Planet_diffuse.png");

 /* var loaderp2 = new THREE.TextureLoader(manager);
  var specMap = loaderp2.load("src/medias/models/exo_planet/Planet_specularGlossiness.png");

  var loaderp3 = new THREE.TextureLoader(manager);
  var normalMap = loaderp3.load("src/medias/models/exo_planet/Planet_normal.png");
*/
/*
  var planetMaterial = new THREE.MeshPhongMaterial({
    color: 0xaaaaaa,
    specular: 0x333333,
    flatShading: false,
    map: colorMap,
    //specularMap: specMap,
    //normalMap: normalMap
  });

  planet = new THREE.Mesh( new THREE.SphereGeometry(6, 7, 7), planetMaterial);
  planet.position.set(0, 0, 350); //200
  */

    var loader = new THREE.GLTFLoader(manager);
  loader.crossOrigin = true;
  loader.load( 'src/medias/models/sun/scene.gltf', function ( data ) {
  
    var object = data.scene;
    object.position.set(0,0,170); //-30, 0, 22
      
    light = new THREE.SpotLight( 0xffffbb, 3, 0, Math.PI/2, 0.5, 2);
    light.position.set(object.position.x, object.position.y, object.position.z);
    object.attach(light);

    orbit.attach(object);
    //object.attach(planet);
    sun = object;
    //, onProgress, onError );
  });
}


function updateDecor(step) {

    sun.rotateY(step*0.5); //sens antihoraire
    orbit.rotateY(step * 0.6);
    orbit.rotateX(step*0.3);
  //  orbitsun.rotateY(step*0.05);
    //orbitsun.rotateX(step*0.2);

   // planet.rotateY(step*2);
}


function createBackground(cheminfichierlight, cheminfichierdark) {
    
    const loaderlight = new THREE.TextureLoader(manager);
    const texturelight = loaderlight.load(
      './src/medias/images/SceneBackground/'+ cheminfichierlight,
      () => {
        const rt = new THREE.WebGLCubeRenderTarget(texturelight.image.height);
        rt.fromEquirectangularTexture(renderer, texturelight);
        scenebackground.light = rt.texture;
        if (lightMode) {
          scene.background = rt.texture;
        }
        
      });

      const loaderdark = new THREE.TextureLoader(manager);
      const texturedark = loaderdark.load(
        './src/medias/images/SceneBackground/'+ cheminfichierdark,
        () => {
          const rt = new THREE.WebGLCubeRenderTarget(texturedark.image.height);
          rt.fromEquirectangularTexture(renderer, texturedark);
          scenebackground.dark = rt.texture;
          if (!lightMode) {
            scene.background = rt.texture;
          }
        });

       


}