function Game() {
	this.init();
};

Game.prototype.init = function() {
	//Config variables
	this.gravity = -5;
	this.cameraStartPosition = new THREE.Vector3(0, -1.5, 2);
	this.camSpeed = 0.1;

	//Load resources
	this.soundWood = new Howl({src: ['/examples/bowling-vr/res/sounds/wood.mp3']});

	//Create the inputManager wich detects input
	this.inputManager = Object.create(InputManager);
	this.inputManager.init();

	// setup three.js WebGL renderer. Note: Antialiasing is a big performance hit.
	// only enable it if you actually need to.
	//TODO: Check performance hit of AA
	this.renderer = new THREE.WebGLRenderer( { antialias: true } );
	this.renderer.setPixelRatio( window.devicePixelRatio );

	// append the canvas element created by the renderer to document body element.
	document.body.appendChild( this.renderer.domElement );

	// create a three.js scene and create the level.
	this.level = new Level();
	this.scene = this.level.scene;											//TODO: Fix undefined
	this.scene.setGravity( new THREE.Vector3( 0, this.gravity, 0 ) );

	this.ball = new Physijs.SphereMesh(
		new THREE.SphereGeometry( 0.108, 8, 8 ),
		new THREE.MeshNormalMaterial(),
		8
	);

	this.ball.addEventListener( 'collision', function( other_object, linear_velocity, angular_velocity ) {
    if(other_object.name == 'pin')this.soundWood.play();
	}.bind(this));

	this.ball.position.set( 0, 0, 10 );
	this.scene.add( this.ball );
	this.ball.applyCentralImpulse( new THREE.Vector3( 0, 0, -50 ) );

	// create a three.js camera.
	this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000 );

	this.cameraObject = new THREE.Object3D();
	this.cameraObject.position.set(this.cameraStartPosition.x, this.cameraStartPosition.y, this.cameraStartPosition.z);
	this.cameraObject.add(this.camera);
	this.scene.add(this.cameraObject);
	console.log(this.cameraObject.position);

	// apply VR headset positional data to camera.
	this.controls = new THREE.VRControls( this.camera );
	this.controls.standing = true;

	// apply VR stereo rendering to renderer.
	this.effect = new THREE.VREffect( this.renderer );
	this.effect.setSize( window.innerWidth, window.innerHeight );

	this.manager = new WebVRManager( this.renderer, this.effect, this.params );

	//TODO: Figure out of bind is needed
	window.addEventListener( 'resize', this.onResize.bind(this), true );
	window.addEventListener( 'vrdisplaypresentchange', this.onResize.bind(this), true );
}

Game.prototype.run = function( timestamp ) {
  //document.getElementById("hud").innerHTML = 'Score: ' + this.score;

	var delta = Math.min( timestamp - this.lastRender, 500 );
	this.lastRender = timestamp;

	// update VR headset position and apply to camera.
	this.controls.update();

	// run physics
	this.scene.simulate();

	// render the scene through the manager.
	this.manager.render( this.scene, this.camera, timestamp );

	this.handleInput();

	//TODO: Check if bind is needed
	requestAnimationFrame(this.run.bind(this));
}

Game.prototype.handleInput = function() {
	if(this.inputManager.w) {
		this.cameraObject.position.z -= this.camSpeed;
	}
	if(this.inputManager.a) {
		this.cameraObject.position.x -= this.camSpeed;
	}
	if(this.inputManager.s) {
		this.cameraObject.position.z += this.camSpeed;
	}
	if(this.inputManager.d) {
		this.cameraObject.position.x += this.camSpeed;
	}
	if(this.inputManager.space) {
		this.cameraObject.position.y += this.camSpeed;
	}
	if(this.inputManager.shift) {
		this.cameraObject.position.y -= this.camSpeed;
	}
}

Game.prototype.onResize = function( e ) {
	//FIXME: setSize doesn't work properly (Probably something to do with this or the code just decides to randomly not work)
	this.effect.setSize( window.innerWidth, window.innerHeight );
	this.camera.aspect = window.innerWidth / window.innerHeight;
	this.camera.updateProjectionMatrix();
}
