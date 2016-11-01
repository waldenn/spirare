  //    Init

  // init renderer
  var renderer = new THREE.WebGLRenderer( {
  	antialias: true
  } );
  
  renderer.setClearColor( new THREE.Color( 'white' ), 1 )
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  // array of functions for the rendering loop
  var onRenderFcts = [];

  // init scene and camera
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.01, 1000 );
  camera.position.z = 10;
  var controls = new THREE.OrbitControls( camera )

  //    render the whole thing on the page

  // handle window resize
  window.addEventListener( 'resize', function() {

  	renderer.setSize( window.innerWidth, window.innerHeight )
  	camera.aspect = window.innerWidth / window.innerHeight
  	camera.updateProjectionMatrix()

  }, false )

  // render the scene
  onRenderFcts.push( function() {

  	renderer.render( scene, camera );

  } )

  var statsFrame = new Stats();
  statsFrame.domElement.style.position = 'absolute';
  statsFrame.domElement.style.top = '0px';
  document.body.appendChild( statsFrame.domElement );

  onRenderFcts.push( function() { 
    statsFrame.update()

   } )

  // run the rendering loop
  var lastTimeMsec = null

  requestAnimationFrame( function animate( nowMsec ) {

  	// keep looping
  	requestAnimationFrame( animate );
  	// measure time
  	lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60
  	var deltaMsec = Math.min( 200, nowMsec - lastTimeMsec )
  	lastTimeMsec = nowMsec

  	// call each update function
  	onRenderFcts.forEach( function( onRenderFct ) {

  		onRenderFct( deltaMsec / 1000, nowMsec / 1000 )

  	} )

  } )

  //    set 3 point lighting

  ;( function() {

  	// add a ambient light
  	var light = new THREE.AmbientLight( 0x020202 )
  	scene.add( light )
  	// add a light in front
  	var light = new THREE.DirectionalLight( 'white', 1 )
  	light.position.set( 0.5, 0.5, 2 )
  	scene.add( light )
  	// add a light behind
  	var light = new THREE.DirectionalLight( 'white', 0.75 )
  	light.position.set( - 0.5, - 0.5, - 2 )
  	scene.add( light )

  } )()


  var ammoWorld = new THREEx.AmmoWorld()
  onRenderFcts.push( function() {

  	ammoWorld.update()

  } )

  //          display ground

  ;( function() {

  	// return
  	var geometry = new THREE.BoxGeometry( 40, 0.1, 40 )
  	var material = new THREE.MeshNormalMaterial( {
  	/**
  	  map: new THREE.TextureLoader().load("../../textures/grid.png", function onLoad(texture){
  	    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  	    texture.repeat.set(geometry.parameters.width,geometry.parameters.depth)
  	    texture.anisotropy = renderer.getMaxAnisotropy()
  	  })
  	  */
  	} );

  	var mesh = new THREE.Mesh( geometry, material )
  	mesh.position.y = - mesh.geometry.parameters.height / 2 - 3
  	scene.add( mesh )

  	var ammoControls = new THREEx.AmmoControls( mesh, {
  		mass: 0
  	} )
  	ammoControls.setRestitution( 0.9 )
  	ammoWorld.add( ammoControls )

  } )()

  // an inside box

  ;( function() {

  	return
  	var geometry = new THREE.PlaneGeometry( 20, 20 )
  	var material = new THREE.MeshNormalMaterial( {

  	/*
  	  map: new THREE.TextureLoader().load("../../textures/grid.png", function onLoad(texture){
  	    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  	    texture.repeat.set(geometry.parameters.width,geometry.parameters.height)
  	    texture.anisotropy = renderer.getMaxAnisotropy()
  	  })
  	  */
  	} );

  	// bottom
  	var mesh = new THREE.Mesh( geometry, material )
  	mesh.position.y = - geometry.parameters.width / 2
  	mesh.rotateX( - Math.PI / 2 )
  	addStaticPlane( mesh )

  	// top
  	var mesh = new THREE.Mesh( geometry, material )
  	mesh.position.y = + geometry.parameters.width / 2
  	mesh.rotateX( + Math.PI / 2 )
  	addStaticPlane( mesh )

  	// left
  	var mesh = new THREE.Mesh( geometry, material )
  	mesh.position.x = - geometry.parameters.width / 2
  	mesh.rotateY( Math.PI / 2 )
  	addStaticPlane( mesh )

  	// right
  	var mesh = new THREE.Mesh( geometry, material )
  	mesh.position.x = + geometry.parameters.width / 2
  	mesh.rotateY( - Math.PI / 2 )
  	addStaticPlane( mesh )

  	// back
  	var mesh = new THREE.Mesh( geometry, material )
  	mesh.position.z = - geometry.parameters.height / 2
  	addStaticPlane( mesh )

  	// front
  	var mesh = new THREE.Mesh( geometry, material )
  	mesh.position.z = geometry.parameters.height / 2
  	mesh.rotateY( - Math.PI )
  	addStaticPlane( mesh )

  	function addStaticPlane( mesh ) {

  		scene.add( mesh )
  		// Create infinite ground plane 50 meters down. This is to make sure things don't fall down to infinity and irritate our collision detection
  		var shape = new Ammo.btStaticPlaneShape( new Ammo.btVector3( 0, 0, 1 ), 0 );
  		var ammoControls = new THREEx.AmmoControls( mesh, {
  			mass: 0,
  			shape: shape,
  		} )
  		ammoControls.setRestitution( 0.9 )
  		ammoWorld.add( ammoControls )

  	}

  } )()

  // some spheres falling

  ;( function() {

  	// return
  	var geometry = new THREE.SphereGeometry( 0.5, 16, 10 )
  	// var geometry = new THREE.BoxGeometry(1,1,1)
  	// var geometry = new THREE.CylinderGeometry(0.5,0.5, 1)
  	// debugger;

  	//console.log(geometry)

  	var material = new THREE.MeshNormalMaterial( {
  		wireframe: true
  	} );

  	//var textureColor= THREE.ImageUtils.loadTexture('images/NewTennisBallColor.jpg')
  	//var textureBump = THREE.ImageUtils.loadTexture('images/TennisBallBump.jpg')
  	var material = new THREE.MeshNormalMaterial( {
  	/*
  	  map : textureColor,
  	  bumpMap : textureBump,
  	  bumpScale: 0.01,
  	  */
  	} )
  	for ( var i = 0; i < 100; i ++ ) {

  		var mesh = new THREE.Mesh( geometry, material )
  		mesh.position.y = 3 + Math.random() * 3
  		mesh.position.x = ( Math.random() - 0.5 ) * 15
  		mesh.position.z = ( Math.random() - 0.5 ) * 15
  		scene.add( mesh )

  		var ammoControls = new THREEx.AmmoControls( mesh )
  		ammoWorld.add( ammoControls )

  	}

  } )()

  //          Pile of crate
  ;( function() {

  	return
  	var geometry = new THREE.BoxGeometry( 1, 1, 1 )
  	var material = new THREE.MeshNormalMaterial( {
  		wireframe: true
  	} );

  	var nCubes = new THREE.Vector3( 5, 5, 1 )

  	var size = new THREE.Vector3( geometry.parameters.width * 1.1
  	, geometry.parameters.height * 1.1
  	, geometry.parameters.depth * 1 )

  	for ( var x = 0; x < nCubes.x; x ++ ) {

  		for ( var y = 0; y < nCubes.y; y ++ ) {

  			for ( var z = 0; z < nCubes.z; z ++ ) {

  				var mesh = new THREE.Mesh( geometry, material )
  				mesh.position.x = ( x - nCubes.x / 2 + 0.5 ) * size.x
  				mesh.position.y = ( y - nCubes.y / 2 + 0.5 ) * size.y
  				mesh.position.z = ( z - nCubes.z / 2 + 0.5 ) * size.z

  				mesh.position.y += 3 + nCubes.y / 2 * size.y
  				scene.add( mesh )

  				var ammoControls = new THREEx.AmmoControls( mesh )
  				ammoWorld.add( ammoControls )

  			}

  		}

  	}

  } )()

  //          Pile of bowling pins
  ;( function() {

  	return
  	var geometry = new THREE.BoxGeometry( 1, 3, 1 )

  	var material = new THREE.MeshNormalMaterial( {
  	  // wireframe: true
  	} );

  	var nCubes = new THREE.Vector3( 1, 1, 1 )

  	var size = new THREE.Vector3( geometry.parameters.width * 2
  	, geometry.parameters.height
  	, geometry.parameters.depth * 2 )
  	var nRows = 8

  	for ( var z = 0; z < nRows; z ++ ) {

  		for ( var x = 0; x < z; x ++ ) {

  			var mesh = new THREE.Mesh( geometry, material )
  			mesh.position.x = ( x - z / 2 + 0.5 ) * size.x
  			mesh.position.z = - ( z - nRows / 2 + 0.5 ) * size.z
  			scene.add( mesh )

  			var ammoControls = new THREEx.AmmoControls( mesh )
  			ammoWorld.add( ammoControls )

  		}

  	}

  } )()

  //  throw a ball in front of the camera
  ;( function() {

  	var clickRequest = false;
  	var mouseCoords = new THREE.Vector2();

  	window.addEventListener( 'mousedown', function( event ) {

  		if ( clickRequest === true ) return
  		clickRequest = true;
  		mouseCoords.x = ( event.clientX / window.innerWidth ) * 2 - 1
  		mouseCoords.y = - ( event.clientY / window.innerHeight ) * 2 + 1

  	}, false );

  	onRenderFcts.push( function() {

  		if ( clickRequest === false ) return
  		clickRequest = false;

  		var raycaster = new THREE.Raycaster();
  		raycaster.setFromCamera( mouseCoords, camera );

  		// create ball
  		var position = new THREE.Vector3();
  		var quaternion = new THREE.Quaternion();

  		position.copy( raycaster.ray.direction );
  		position.add( raycaster.ray.origin );
  		quaternion.set( 0, 0, 0, 1 );

  		// create mesh
  		var geometry = new THREE.SphereGeometry( 1, 8, 10 )
  		var material = new THREE.MeshNormalMaterial( {
  			wireframe: false
  		} );

  		var mesh = new THREE.Mesh( geometry, material )
  		mesh.position.copy( position )
  		mesh.quaternion.copy( quaternion )
  		scene.add( mesh )

  		var ammoControls = new THREEx.AmmoControls( mesh )
  		ammoWorld.add( ammoControls )

  		var ballBody = ammoControls.physicsBody
  		ballBody.setFriction( 10 );
  		ballBody.setRestitution( 0.9 )

      // btVector3: http://bulletphysics.org/Bullet/BulletFull/classbtVector3.html
  		position.copy( raycaster.ray.direction );
  		position.multiplyScalar( 14 * 2 );

  		ballBody.setLinearVelocity( new Ammo.btVector3( position.x, position.y, position.z ) );

  	} )

  } )()

  // http://stackoverflow.com/questions/31991267/bullet-physicsammo-js-in-asm-js-how-to-get-collision-impact-force
  //
  // function playingWithCollision(){
  //  var dispatcher = ammoWorld.physicsWorld.getDispatcher()
  //  var nManifolds = dispatcher.getNumManifolds()
  // console.log('nManifolds', nManifolds)
  //  for(var i = 0; i < nManifolds; i++){
  //      var manifold = dispatcher.getManifoldByIndexInternal(i);
  //
  //      var nContact = manifold.getNumContacts();
  //      if (nContact === 0) continue
  //
  //      for(var j = 0; j < nContact; j++){
  //          var contactPoint = manifold.getContactPoint(j);
  //          console.log('body 1: ', manifold.getBody0());
  //          console.log('body 2: ', manifold.getBody1());
  // window.body0= manifold.getBody0()
  // window.body1= manifold.getBody1()
  //          console.log('COLLISION DETECTED!');
  //          // HERE: how to get impact force details?
  //          console.log( 'applied impulse', contactPoint.getAppliedImpulse() )
  //      }
  //  }
  // }
  //
  // onRenderFcts.push(function(){
  //  playingWithCollision()
  // })

