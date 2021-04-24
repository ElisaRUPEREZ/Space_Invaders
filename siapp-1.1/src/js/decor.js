let sun; let orbit; 
let scenebackground = {};
function createBackgroundObjects() {
    let geometry = new THREE.SphereGeometry();
    let material = new THREE.MeshNormalMaterial({opacity: 1,transparent: true});
    orbit = new THREE.Mesh( geometry, material, );
    orbit.position.set(0,0,0);
    scene.add(orbit);

  var loader2 = new THREE.GLTFLoader();
  loader2.crossOrigin = true;
  loader2.load( 'src/medias/models/sun/scene.gltf', function ( data ) {
  
    var object = data.scene;
    object.position.set(0,50,170); //-30, 0, 22
      
    light = new THREE.SpotLight( 0xffffbb, 3, 0, Math.PI/2, 0.5, 2);
    light.position.set(object.position.x, object.position.y, object.position.z);
    object.attach(light);

    orbit.attach(object);
    sun = object;
    //, onProgress, onError );
  });
}


function updateDecor(step) {

    sun.rotateY(step*3); //sens antihoraire
    orbit.rotateY(step * 0.4);

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