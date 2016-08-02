"use strict";

function Game() {
	//Config vars
	this.gravity = -5;
	this.cameraStartPosition = new THREE.Vector3(0, -1.5, 2);
	this.camSpeed = 0.1;

	this.init();
};

Game.prototype.init = function() {
	//Load resources
        this.soundWood = new Howl( { src: [ 'res/sounds/wood.mp3' ] } );
        this.soundBall = new Howl( { src: [ 'res/sounds/ball.mp3' ], loop: false } );

	//Create the inputManager wich detects input
	this.inputManager = Object.create(InputManager);
	this.inputManager.init();

	//Setup three.js WebGL renderer. Note: Antialiasing is a big performance hit.
	//Only enable it if you actually need to.
	//TODO: Check performance hit of AA
	this.renderer = new THREE.WebGLRenderer({ antialias: true });
	this.renderer.setPixelRatio(window.devicePixelRatio);

	//Append the canvas element created by the renderer to document body element.
	document.body.appendChild(this.renderer.domElement);

	//Create a three.js scene and create the level.
	this.level = new Level();
	this.scene = this.level.scene;
	this.scene.setGravity(new THREE.Vector3(0, this.gravity, 0));

	this.ball = new Physijs.SphereMesh(
		new THREE.SphereGeometry(0.108, 8, 8),
		new THREE.MeshNormalMaterial(),
		8
	);

	this.ball.addEventListener('collision', function( other_object, linear_velocity, angular_velocity) {

		if(other_object.name == 'pin'){
			var id = this.soundWood.play();

			// Change the position and rate.
			this.soundWood.pos(other_object.position.x, other_object.position.y, other_object.position.z, id);
			this.soundWood.rate(0.7, id);
			this.soundWood.volume(1, id);
                }

                if ( other_object.name == 'ground' ){

                        var id = this.soundBall.play();

                        // Change the position and rate.
                        //this.soundBall.pos(other_object.position.x, other_object.position.y, other_object.position.z, id);
                        //this.soundWood.rate( 0.1, id);
                        this.soundBall.volume(1, id);
		}

	}.bind(this));

	this.ball.position.set(0, 0, 10);
	this.scene.add( this.ball );
	this.ball.applyCentralImpulse(new THREE.Vector3(0, 0, -50));

	//Create a three.js camera.
	this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);

	this.cameraObject = new THREE.Object3D();
	this.cameraObject.position.set(this.cameraStartPosition.x, this.cameraStartPosition.y, this.cameraStartPosition.z);
	this.cameraObject.add(this.camera);
	this.scene.add(this.cameraObject);

	//Apply VR headset positional data to camera.
	this.controls = new THREE.VRControls(this.camera);
	this.controls.standing = true;

	//Apply VR stereo rendering to renderer.
	this.effect = new THREE.VREffect(this.renderer);
	this.effect.setSize(window.innerWidth, window.innerHeight);

	this.manager = new WebVRManager(this.renderer, this.effect, this.params);

	window.addEventListener('resize', this.onResize.bind(this), true);
	window.addEventListener('vrdisplaypresentchange', this.onResize.bind(this), true);
}

Game.prototype.run = function(timestamp) {
  //document.getElementById("hud").innerHTML = 'Score: ' + this.score;

	const delta = Math.min(timestamp - this.lastRender, 500);
	this.lastRender = timestamp;

	// update VR headset position and apply to camera.
	this.controls.update();

	// run physics
	this.scene.simulate();

	// render the scene through the manager.
	this.manager.render(this.scene, this.camera, timestamp);

	this.handleInput();

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

Game.prototype.onResize = function(event) {
	this.effect.setSize(window.innerWidth, window.innerHeight);
	this.camera.aspect = window.innerWidth / window.innerHeight;
	this.camera.updateProjectionMatrix();
}
