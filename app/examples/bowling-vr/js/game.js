var Game = function() {
	var renderer, scene, camera, ground;
	var ball, ballVelocity;
	var display;
	var effect;
	var controls;
	var camera;
	var lastRender = 0; // Request animation frame loop function
	var boxSize = 5;
	var cube;
	var manager;
	var cameraObject;
	var arrow;

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
	var index = 0;
	var pins = [];
	for ( var i = 1; i <= rows; i ++ ) {

		var even = ( i % 2 == 0 );

		for ( var nPins = 0; nPins < i; nPins ++ ) {

			if ( even ) var offset = ( i / 2 * spacing ) - spacing / 2;
			if ( ! even ) var offset = ( i / 2 - 0.5 ) * spacing;

			var base = new Physijs.BoxMesh(new THREE.BoxGeometry(0.09, 0.32, 0.09), new THREE.MeshNormalMaterial());
			base.position.set( firstPinPositionX + (offset - nPins * spacing), firstPinPositionY + 0.15, firstPinPositionZ + (i * - spacing ));
			base.name = 'pin';

			/*var base = new Physijs.CylinderMesh( new THREE.CylinderGeometry( 0.057277, 0.03556, 0.085725, 8 ), Physijs.createMaterial(new THREE.MeshNormalMaterial(), 0, 1), 1.5 );
			base.position.set( firstPinPositionX + (offset - nPins * spacing), firstPinPositionY, firstPinPositionZ + (i * - spacing ));

			var middle = new Physijs.CylinderMesh(new THREE.CylinderGeometry(0.057277, 0.057277, 0.0635, 8), new THREE.MeshNormalMaterial());
			middle.position.y = 0.074;

			var top = new Physijs.CylinderMesh(new THREE.CylinderGeometry(0.0249555, 0.057277, 0.0889, 8), new THREE.MeshNormalMaterial());
			top.position.y = 0.15;

			var neck = new Physijs.CylinderMesh(new THREE.CylinderGeometry(0.0249555, 0.0249555, 0.0381, 8), new THREE.MeshNormalMaterial());
			neck.position.y = 0.213;
																																																//Correct length is 0.066675 but looked weird
			var ballStand = new Physijs.CylinderMesh(new THREE.CylinderGeometry(0.0323469, 0.0249555, 0.046675, 8), new THREE.MeshNormalMaterial());
			ballStand.position.y = 0.245;

			var ball = new Physijs.SphereMesh(new THREE.SphereGeometry(0.0323469, 8, 8), new THREE.MeshNormalMaterial());
			ball.position.y = 0.2695;

			var stableBlock = new Physijs.BoxMesh(new THREE.BoxGeometry(0.13, 0.32, 0.13), new THREE.MeshNormalMaterial());
			stableBlock.position.y = 0.12;
			stableBlock.visible = false;

			base.add(middle);
			base.add(top);
			base.add(neck);
			base.add(ballStand);
			base.add(ball);*/
			//base.add(stableBlock);
			index++;

			pins.push(base);
		}

	}
	return pins;
}

	Game.prototype.createLane = function() {
		var gutter2offset = 1.28;

		var laneFriction = 100, laneRestitution = 0.1;
		var lane = new Physijs.BoxMesh(new THREE.BoxGeometry(1.0541, 0.1, 18.28800), Physijs.createMaterial(new THREE.MeshNormalMaterial(), laneFriction, laneRestitution), 0);
		lane.position.y = -0.5;
		this.scene.add(lane);

		var gutter1Left = new Physijs.BoxMesh(new THREE.BoxGeometry(0.1, 0.01, 18.28800), Physijs.createMaterial(new THREE.MeshNormalMaterial(), 1, 0), 0);
		gutter1Left.position.x = (1.0541 / 2) + 0.03;
		gutter1Left.position.y = -0.488;
		gutter1Left.rotation.z = -(Math.PI / 4);
		this.scene.add(gutter1Left);

		var gutter1Middle = new Physijs.BoxMesh(new THREE.BoxGeometry(0.1, 0.01, 18.28800), Physijs.createMaterial(new THREE.MeshNormalMaterial(), 1, 0), 0);
		gutter1Middle.position.x = 0.64;
		gutter1Middle.position.y = -0.52;
		this.scene.add(gutter1Middle);

		var gutter1Right = new Physijs.BoxMesh(new THREE.BoxGeometry(0.1, 0.01, 18.28800), Physijs.createMaterial(new THREE.MeshNormalMaterial(), 1, 0), 0);
		gutter1Right.position.x = 0.725;
		gutter1Right.position.y = -0.488;
		gutter1Right.rotation.z = Math.PI / 4;
		this.scene.add(gutter1Right);

		var invisibleWall1 = new Physijs.BoxMesh(new THREE.BoxGeometry(0.0001, 10, 18.28800), Physijs.createMaterial(new THREE.MeshNormalMaterial(), 1, 0), 0);
		invisibleWall1.position.x = 0.76;
		invisibleWall1.position.y = 0;
		invisibleWall1.visible = false;
		this.scene.add(invisibleWall1);

		var gutter2Left = new Physijs.BoxMesh(new THREE.BoxGeometry(0.1, 0.01, 18.28800), Physijs.createMaterial(new THREE.MeshNormalMaterial(), 1, 0), 0);
		gutter2Left.position.x = ((1.0541 / 2) + 0.03) - gutter2offset;
		gutter2Left.position.y = -0.488;
		gutter2Left.rotation.z = -(Math.PI / 4);
		this.scene.add(gutter2Left);

		var gutter2Middle = new Physijs.BoxMesh(new THREE.BoxGeometry(0.1, 0.01, 18.28800), Physijs.createMaterial(new THREE.MeshNormalMaterial(), 1, 0), 0);
		gutter2Middle.position.x = 0.64 - gutter2offset;
		gutter2Middle.position.y = -0.52;
		this.scene.add(gutter2Middle);

		var gutter2Right = new Physijs.BoxMesh(new THREE.BoxGeometry(0.1, 0.01, 18.28800), Physijs.createMaterial(new THREE.MeshNormalMaterial(), 1, 0), 0);
		gutter2Right.position.x = 0.725 - gutter2offset;
		gutter2Right.position.y = -0.488;
		gutter2Right.rotation.z = Math.PI / 4;
		this.scene.add(gutter2Right);

		var invisibleWall2 = new Physijs.BoxMesh(new THREE.BoxGeometry(0.0001, 10, 18.28800), Physijs.createMaterial(new THREE.MeshNormalMaterial(), 1, 0), 0);
		invisibleWall2.position.x = 0.76 - gutter2offset - 0.24;
		invisibleWall2.position.y = 0;
		invisibleWall2.visible = false;
		this.scene.add(invisibleWall2);
	}


Game.prototype.init = function() {
	this.soundWood = new Howl({src: ['/examples/bowling-vr/res/sounds/wood.mp3']});

	this.pinPositions = [];
	this.score = 0;
	this.upPins = [];
	this.camSpeed = 0.05;

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
	this.scene.setGravity( new THREE.Vector3( 0, -10, 0 ) );

	// create a three.js camera.
	this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000 );

	this.cameraObject = new THREE.Object3D();
	this.cameraObject.add(this.camera);
	this.scene.add(this.cameraObject);

	// apply VR headset positional data to camera.
	this.controls = new THREE.VRControls( this.camera );
	this.controls.standing = true;

	this.cameraObject.position.y = -1;
	this.cameraObject.position.z = 10;

	// apply VR stereo rendering to renderer.
	this.effect = new THREE.VREffect( this.renderer );
	this.effect.setSize( window.innerWidth, window.innerHeight );

    // ground physics
	/*ground = new Physijs.BoxMesh(
	  new THREE.CubeGeometry( 50, 1, 600 ),
	  Physijs.createMaterial( new THREE.MeshBasicMaterial( { color: 0x888888 } ),
	  this.groundFriction, this.groundRestitution ),
	  0
	);

	ground.name = "ground";
	ground.position.set( 0, 0, 0 );
	this.scene.add( ground );*/

  // setup the bowling pins
	this.createLane();
	this.upPins = this.createBowlingPins( 0, -0.207, 0, 0.3048, 4 );

  for (var i = 0; i < this.upPins.length; i++){
  	this.scene.add(this.upPins[i]);
	}

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

	ball = new Physijs.SphereMesh(
	  new THREE.SphereGeometry( 0.108, 8, 8 ),
	  new THREE.MeshNormalMaterial(),
		8
	);

	ball.addEventListener( 'collision', function( other_object, linear_velocity, angular_velocity ) {
    if(other_object.name == 'pin')this.soundWood.play();
	}.bind(this));

	ball.position.set( 0, 0, 10 );
	this.scene.add( ball );
	ball.applyCentralImpulse( new THREE.Vector3( 0, 0, -50 ) );

	arrow = new Physijs.PlaneMesh(
		new THREE.BoxGeometry(0.05, 0.01, 0.15),
		new THREE.MeshBasicMaterial,
		0
	);

	var arrowPointer = new Physijs.BoxMesh(
		new THREE.BoxGeometry()
	)
	arrow.position.set(0, -0.3, 9);
	this.scene.add(arrow);

	// start the animation loop
	requestAnimationFrame( this.animate.bind( this ) );

	window.addEventListener( 'resize', this.onResize, true );
	window.addEventListener( 'vrdisplaypresentchange', this.onResize, true );
	window.addEventListener( 'keydown', this.onKeyDown.bind(this), true);

}


Game.prototype.animate = function( timestamp ) {

	document.getElementById("hud").innerHTML = 'Score: ' + this.score;

	//console.log(this.upPins[3].position);

	for(var i = 0; i < this.upPins.length; i++) {
		var pos = this.upPins[i].position;
		if(pos.y < -0.32) {
			this.score++;
			this.upPins.splice(i, 1);
		}
	}

	var delta = Math.min( timestamp - this.lastRender, 500 );
	this.lastRender = timestamp;

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
	//FIXME
	this.effect.setSize( window.innerWidth, window.innerHeight );
	this.camera.aspect = window.innerWidth / window.innerHeight;
	this.camera.updateProjectionMatrix();

}

Game.prototype.onKeyDown = function(e) {
	console.log('key: ' + e.keyCode)
	console.log(this.cameraObject.position);

	if(e.keyCode == 87) { //W
		this.cameraObject.position.z -= this.camSpeed;
	}

	if(e.keyCode == 83) { //S
		this.cameraObject.position.z += this.camSpeed;
	}

	if(e.keyCode == 65) { //A
		this.cameraObject.position.x -= this.camSpeed;
	}

	if(e.keyCode == 68) { //D
		this.cameraObject.position.x += this.camSpeed;
	}

	if(e.keyCode == 32) { //Space
		this.cameraObject.position.y += this.camSpeed;
	}

	if(e.keyCode == 17) { //Ctrl
		this.cameraObject.position.y -= this.camSpeed;
	}

}
