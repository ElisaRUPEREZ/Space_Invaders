let sphereObj; let orbit;
let scenebackground = {};

function createOrbit() {
  let geometry = new THREE.SphereGeometry();
  let material = new THREE.MeshNormalMaterial({opacity: 0,transparent: true});
  object = new THREE.Mesh( geometry, material, );
  object.position.set(0,0,0);
  return object;
}

function createPlanet() {
  orbit = createOrbit();
  scene.add(orbit);

  var loaderp1 = new THREE.TextureLoader(manager);
  var colorMap = loaderp1.load("src/medias/models/exo_planet/Planet_diffuse.png");

  var loaderp2 = new THREE.TextureLoader(manager);
  var specMap = loaderp2.load("src/medias/models/exo_planet/Planet_specularGlossiness.png");

  var loaderp3 = new THREE.TextureLoader(manager);
  var normalMap = loaderp3.load("src/medias/models/exo_planet/Planet_normal.png");

  var planetMaterial = new THREE.MeshPhongMaterial({
    color: 0xaaaaaa,
    specular: 0x333333,
    flatShading: false,
    map: colorMap,
    specularMap: specMap,
    normalMap: normalMap
  });

  sphereObj = new THREE.Mesh( new THREE.SphereGeometry(14, 12, 12), planetMaterial);
  sphereObj.position.set(0, 0, 120); //200
  orbit.attach(sphereObj);


  light = new THREE.SpotLight( 0xffffbb, 1, 0, Math.PI/2, 0.8, 2);
  light.position.set(0,300,-200);
  scene.add(light);

}

function createMoon() {
  orbit = createOrbit();
  scene.add(orbit);

  var loaderm = new THREE.TextureLoader(manager);
  var texture = loaderm.load("src/medias/models/moon/material.jpg");

  var moonMaterial = new THREE.MeshPhongMaterial({
    color: 0xaaaaaa,
    specular: 0x333333,
    flatShading: false,
    map: texture,

  });

  sphereObj = new THREE.Mesh( new THREE.SphereGeometry(14, 12, 12), moonMaterial);
  sphereObj.position.set(0, 0, 120); //200
  orbit.attach(sphereObj);

  light = new THREE.SpotLight( 0xffffbb, 1, 0, Math.PI/2, 0.8, 2);
  light.position.set(0,300,-100);
  scene.add(light);
}

function createSun() {
  orbit = createOrbit();
  scene.add(orbit);

  var loader = new THREE.GLTFLoader(manager);
  loader.crossOrigin = true;
  loader.load( 'src/medias/models/sun/scene.gltf', function ( data ) {
  
    var object = data.scene;
    object.position.set(0,0,170);
      
    light = new THREE.SpotLight( 0xffffbb, 1.5, 0, Math.PI/2, 0.5, 2);
    light.position.set(object.position.x, object.position.y, object.position.z);
    object.attach(light);

    orbit.attach(object);
    sphereObj = object;
    //, onProgress, onError );
  });
}

function updateDecor(step) {
  if (niveau!=2) {
    sphereObj.rotateY(step*2); //sens antihoraire
  }
  orbit.rotateY(step * 0.6);
  orbit.rotateX(step*0.3);
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