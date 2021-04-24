let sun; let orbit; let skybox;

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


function createBackground(cheminfichier) {
    
    const loader = new THREE.TextureLoader();
    const texture = loader.load(
      './src/medias/images/SceneBackground/'+ cheminfichier,
      () => {
        const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
        rt.fromEquirectangularTexture(renderer, texture);
        scene.background = rt.texture;
      });

}