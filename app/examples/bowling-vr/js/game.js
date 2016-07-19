var Game = function() {
	var renderer, scene, camera, ground;
	var ball, ballVelocity;
	var groundFriction = 100, groundRestitution = 0.1;
	var display;
	var effect;
	var controls;
	var camera;
	var lastRender = 0; // Request animation frame loop function
	var boxSize = 5;
	var cube;
	var manager;
	var cameraObject;

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


Game.prototype.createBowlingPins = function( firstPinPositionX, firstPinPositionY, firstPinPositionZ, spacing, rows ) {
	for ( var i = 1; i <= rows; i ++ ) {

		var even = ( i % 2 == 0 );

		for ( var nPins = 0; nPins < i; nPins ++ ) {

			if ( even ) var offset = ( i / 2 * spacing ) - spacing / 2;
			if ( ! even ) var offset = ( i / 2 - 0.5 ) * spacing;

			var base = new Physijs.CylinderMesh( new THREE.CylinderGeometry( 0.35, 0.1, 1.3, 32 ), new THREE.MeshNormalMaterial(), 2 );
			base.position.set( offset - nPins * spacing, 1, i * - spacing );

			var middle = new Physijs.CylinderMesh(new THREE.CylinderGeometry(0.35, 0.35, 0.2, 32), new THREE.MeshNormalMaterial());
			middle.position.y = 0.75;

			var top = new Physijs.CylinderMesh(new THREE.CylinderGeometry(0.1, 0.35, 0.5, 32), new THREE.MeshNormalMaterial());
			top.position.y = 1.10;

			var ballStand = new Physijs.CylinderMesh(new THREE.CylinderGeometry(0.1, 0.1, 0.1, 32), new THREE.MeshNormalMaterial());
			ballStand.position.y = 1.40;

			var ball = new Physijs.SphereMesh(new THREE.SphereGeometry(0.15, 32, 32), new THREE.MeshNormalMaterial());
			ball.position.y = 1.5;

			var pinStand = new Physijs.BoxMesh(new THREE.BoxGeometry(0.05, 0.05, 0.05), new THREE.MeshNormalMaterial());
			pinStand.position.y = 0;

			base.add(pinStand);
			base.add(middle);
			base.add(top);
			base.add(ballStand);
			base.add(ball);

			this.pinPositions[i] = base.position;

			this.scene.add( base );

		}

	}

}


Game.prototype.init = function() {
	this.pinPositions = [50];
	this.score = 0;

	this.inputManager = new InputManager();
	this.inputManager.init();
  console.log(this.inputManager);

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

	this.cameraObject = new THREE.Object3D();
	this.cameraObject.position.y = 1;
	this.cameraObject.position.z = 0;
	this.cameraObject.add(this.camera);
	this.scene.add(this.cameraObject);

	// apply VR headset positional data to camera.
	this.controls = new THREE.VRControls( this.camera );
	this.controls.standing = true;

	// apply VR stereo rendering to renderer.
	this.effect = new THREE.VREffect( this.renderer );
	this.effect.setSize( window.innerWidth, window.innerHeight );

    // ground physics
	ground = new Physijs.BoxMesh(
	  new THREE.CubeGeometry( 50, 1, 600 ),
	  Physijs.createMaterial( new THREE.MeshBasicMaterial( { color: 0x888888 } ),
	  this.groundFriction, this.groundRestitution ),
	  0
	);

	ground.name = "ground";
	ground.position.set( 0, 0, 0 );
	this.scene.add( ground );

    // setup the bowling pins
	this.createBowlingPins( 0, 0, 0, 1.4, 7 );

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
	  new THREE.SphereGeometry( 1, 32, 32 ),
	  new THREE.MeshNormalMaterial(),
	  10
	);

	ball.position.set( 0, 2, 10 );
	this.scene.add( ball );
	ball.applyCentralImpulse( new THREE.Vector3( 0, 0, -590 ) );

	// add cube mesh to our scene
	this.scene.add( this.cube );

	// start the animation loop
	requestAnimationFrame( this.animate.bind( this ) );

	window.addEventListener( 'resize', this.onResize, true );
	window.addEventListener( 'vrdisplaypresentchange', this.onResize, true );

}


Game.prototype.animate = function( timestamp ) {
	document.getElementById("hud").innerHTML = 'Score: ' + this.score;

	for(var i = 0; i < this.pinPositions.length; i++) {
		if(this.pinPositions[i].y < 0.85) {
			this.score++;
			this.pinPositions[i] = new THREE.Vector3(0, 1, 0);
		}
	}

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

	//console.log(this.inputManager.up);

	requestAnimationFrame( this.animate.bind( this ) );

}

Game.prototype.onResize = function( e ) {

	this.effect.setSize( window.innerWidth, window.innerHeight );
	this.camera.aspect = window.innerWidth / window.innerHeight;
	this.camera.updateProjectionMatrix();

}
