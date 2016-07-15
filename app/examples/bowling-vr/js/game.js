var Game = function() {

	var renderer, scene, camera, ground;
	var ball, ballVelocity;
	var groundFriction = 0.9, groundRestitution = 0.1;
	var display;
	var effect;
	var controls;
	var camera;
	var lastRender = 0; // Request animation frame loop function
	var boxSize = 5;
	var cube;
	var manager;

	// Create a VR manager helper to enter and exit VR mode.
	var params = {
		hideButton: false, // Default: false.
		isUndistorted: false // Default: false.
	};

};

// Get the HMD, and if we're dealing with something that specifies
// stageParameters, rearrange the scene.
Game.prototype.setupStage = function() {

	navigator.getVRDisplays().then( function( displays ) {

		if ( displays.length > 0 ) {

			display = displays[ 0 ];
			if ( display.stageParameters ) {

				this.setStageDimensions( display.stageParameters );

			}

		}

	} );

}

Game.prototype.setStageDimensions = function( stage ) {

	// Make the skybox fit the stage.
	var material = skybox.material;
	this.scene.remove( skybox );

	// Size the skybox according to the size of the actual stage.
	var geometry = new THREE.BoxGeometry( stage.sizeX, boxSize, stage.sizeZ );
	skybox = new THREE.Mesh( geometry, material );

	// Place it on the floor.
	skybox.position.y = boxSize / 2;
	this.scene.add( skybox );

	// Place the cube in the middle of the scene, at user height.
	this.cube.position.set( 0, controls.userHeight, 0 );

}


Game.prototype.createBowlingPins = function(
  firstPinPositionX, firstPinPositionY, firstPinPositionZ, spacing, rows ) {

	for ( var i = 1; i <= rows; i ++ ) {

		var even = ( i % 2 == 0 );

		for ( var nPins = 0; nPins < i; nPins ++ ) {

			if ( even ) var offset = ( i / 2 * spacing ) - spacing / 2;
			if ( ! even ) var offset = ( i / 2 - 0.5 ) * spacing;

			var parent = new Physijs.CylinderMesh( new THREE.CylinderGeometry( 0.5, 0.3, 2, 12 ), new THREE.MeshNormalMaterial(), 0.1 );
			//var pin = new Physijs.BoxMesh( new THREE.CubeGeometry( 2, 5, 2 ), new THREE.MeshNormalMaterial(), 0.1 );
			parent.position.set( offset - nPins * spacing, 1.10, i * - spacing );
			//this.scene.add( pin );

			//var child = new Physijs.CylinderMesh( new THREE.CylinderGeometry( 0.7, 1, 2, 12 ), new THREE.MeshNormalMaterial(), 0.1 );
			//child.position.set( offset - nPins * spacing, 3, i * - spacing );

			//parent.add( child );
			this.scene.add( parent );

		}

	}

}


Game.prototype.init = function() {

	// setup three.js WebGL renderer. Note: Antialiasing is a big performance hit.
	// only enable it if you actually need to.
	this.renderer = new THREE.WebGLRenderer( { antialias: true } );
	this.renderer.setPixelRatio( window.devicePixelRatio );

	// append the canvas element created by the renderer to document body element.
	document.body.appendChild( this.renderer.domElement );

	// create a three.js scene.
	//var scene = new THREE.Scene();
	this.scene = new Physijs.Scene;
	this.scene.setGravity( new THREE.Vector3( 0, - 50, 0 ) );

	// create a three.js camera.
	this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000 );

	// apply VR headset positional data to camera.
	this.controls = new THREE.VRControls( this.camera );
	this.controls.standing = true;

	// apply VR stereo rendering to renderer.
	this.effect = new THREE.VREffect( this.renderer );
	this.effect.setSize( window.innerWidth, window.innerHeight );

    // ground physics
	ground = new Physijs.BoxMesh(
	  new THREE.CubeGeometry( 50, 0.1, 600 ),
	  Physijs.createMaterial( new THREE.MeshBasicMaterial( { color: 0x888888 } ),
	  this.groundFriction, this.groundRestitution ),
	  0
	);

	ground.name = "ground";
	ground.position.set( 0, 0, 0 );
	this.scene.add( ground );

    // setup the bowling pins
	this.createBowlingPins( 0, 0, 0, 10, 4 );

	// add a repeating grid as a skybox. FIXME
	var loader = new THREE.TextureLoader();
	loader.load( 'img/box.png', this.onTextureLoaded.bind( this ) );

}

Game.prototype.onTextureLoaded = function( texture ) {

	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set( this.boxSize, this.boxSize );

	var geometry = new THREE.BoxGeometry( this.boxSize, this.boxSize, this.boxSize );

	var material = new THREE.MeshBasicMaterial( {
		map: texture,
		color: 0x01BE00,
		side: THREE.BackSide
	} );

	// align the skybox to the floor (which is at y=0).
	skybox = new THREE.Mesh( geometry, material );
	skybox.position.y = this.boxSize / 2;
	//this.scene.add(skybox);

	// for high end VR devices like Vive and Oculus, take into account the stage
	// parameters provided.
	this.setupStage();

	this.manager = new WebVRManager( this.renderer, this.effect, this.params );

	// create 3D objects.
	var geometry = new THREE.BoxGeometry( 0.5, 0.5, 0.5 );
	var material = new THREE.MeshNormalMaterial();
	this.cube = new THREE.Mesh( geometry, material );

	// Position cube mesh to be right in front of you.
	this.cube.position.set( 0, this.controls.userHeight, - 1 );

	ball = new Physijs.SphereMesh(
	  new THREE.SphereGeometry( 2, 10, 10 ),
	  new THREE.MeshNormalMaterial(),
	  1
	);

	ball.position.set( 0, 3, 20 );
	this.scene.add( ball );
	ball.applyCentralImpulse( new THREE.Vector3( 0, 0, - 100 ) );

	// add cube mesh to our scene
	this.scene.add( this.cube );

	// start the animation loop
	requestAnimationFrame( this.animate.bind( this ) );

	window.addEventListener( 'resize', this.onResize, true );
	window.addEventListener( 'vrdisplaypresentchange', this.onResize, true );

}


Game.prototype.animate = function( timestamp ) {

	var delta = Math.min( timestamp - this.lastRender, 500 );
	this.lastRender = timestamp;

	// apply rotation to cube mesh
	this.cube.rotation.y += delta * 0.0006;

	// update VR headset position and apply to camera.
	this.controls.update();

	// run physics
	this.scene.simulate();

	// render the scene through the manager.
	this.manager.render( this.scene, this.camera, timestamp );

	requestAnimationFrame( this.animate.bind( this ) );

}

Game.prototype.onResize = function( e ) {

	this.effect.setSize( window.innerWidth, window.innerHeight );
	this.camera.aspect = window.innerWidth / window.innerHeight;
	this.camera.updateProjectionMatrix();

}





