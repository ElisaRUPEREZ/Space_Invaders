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
  //  skybox.rotateY(0.001);
  //  sun.rotateZ(step*0.5);
}


function createBackground() {
    
    let materialArray = [];
  /*  let texture_ft = new THREE.TextureLoader().load( './src/medias/pictures/SceneBackground/space_ft.png'); //ft
    let texture_bk = new THREE.TextureLoader().load( './src/medias/pictures/SceneBackground/space_bk.png'); ///bk
    let texture_up = new THREE.TextureLoader().load( './src/medias/pictures/SceneBackground/space_up.png'); //up
    let texture_dn = new THREE.TextureLoader().load( './src/medias/pictures/SceneBackground/space_dn.png'); //dn
    let texture_rt = new THREE.TextureLoader().load( './src/medias/pictures/SceneBackground/space_rt.png'); //rt
    let texture_lf = new THREE.TextureLoader().load( './src/medias/pictures/SceneBackground/space_lf.png'); //lf
    */
    const loader = new THREE.TextureLoader();
    const texture = loader.load(
      './src/medias/pictures/17520.jpg',
      () => {
        const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
        rt.fromEquirectangularTexture(renderer, texture);
        scene.background = rt.texture;
      });
  
      
   /* materialArray.push(new THREE.MeshBasicMaterial( { map: texture_ft }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_bk }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_up }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_dn }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_rt }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_lf }));
       
    for (let i = 0; i < 6; i++)
      materialArray[i].side = THREE.BackSide;
       
    let skyboxGeo = new THREE.BoxGeometry( 10000, 10000, 10000);
    skybox = new THREE.Mesh( skyboxGeo, materialArray );
    skybox.rotateY(Math.PI);
    scene.add( skybox );*/
   /* const loader = new THREE.CubeTextureLoader(manager);
    loader.setPath( './src/medias/pictures/SceneBackground/' );

 const textureCube = loader.load( [
	'img_background_01.jpg', 'img_background_02.jpg',
	'img_background_03.jpg', 'img_background_04.jpg',
	'img_background_05.jpg', 'img_background_06.jpg'
] );

    const materialMap = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: textureCube } );


    const geometryCube = new THREE.BoxBufferGeometry(80, 80, 80);

    let cube = new THREE.Mesh(geometryCube, materialMap);
    cube.position.set(0,0,0);

   // scene.add(cube);
    scene.background = cube;*/
}