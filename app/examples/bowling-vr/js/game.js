"use strict";

function Game() {

	//Config vars
	this.gravity = - 5;
	this.cameraStartPosition = new THREE.Vector3( 0, - 1.5, 2 );
	this.camSpeed = 0.1;

	this.init();

};

Game.prototype.init = function() {

	//Load resources
	this.soundWood = new Howl( { src: [ 'res/sounds/wood.mp3' ] } );
	this.soundBall = new Howl( { src: [ 'res/sounds/ball.mp3' ], loop: false } );

	//Setup three.js WebGL renderer. Note: Antialiasing is a big performance hit.
	// Only enable it if you actually need to.
	//TODO: Check performance hit of AA
	this.renderer = new THREE.WebGLRenderer( { antialias: true } );
	this.renderer.setPixelRatio( window.devicePixelRatio );

	//Append the canvas element created by the renderer to document body element.
	document.body.appendChild( this.renderer.domElement );

	//Create the inputManager wich detects input
	this.keyboard	= new THREEx.KeyboardState( this.renderer.domElement );
	this.renderer.domElement.setAttribute( "tabIndex", "0" );
	this.renderer.domElement.focus();

	//Create a three.js scene and create the level.
	this.level = new Level();
	this.scene = this.level.scene;
	this.scene.setGravity( new THREE.Vector3( 0, this.gravity, 0 ) );

	this.ball = new Physijs.SphereMesh(
		new THREE.SphereGeometry( 0.108, 8, 8 ),
		new THREE.MeshNormalMaterial(),
		8
	);

	this.ball.addEventListener( 'collision', function( other_object, linear_velocity, angular_velocity ) {

		if ( other_object.name == 'pin' ) {

			var id = this.soundWood.play();

			// Change the position and rate.
			this.soundWood.pos( other_object.position.x, other_object.position.y, other_object.position.z, id );
			this.soundWood.rate( 0.7, id );
			this.soundWood.volume( 1, id );

		}

		if ( other_object.name == 'ground' ) {

			var id = this.soundBall.play();

			// Change the position and rate.
			//this.soundBall.pos(other_object.position.x, other_object.position.y, other_object.position.z, id);
			//this.soundWood.rate( 0.1, id);
			this.soundBall.volume( 1, id );

		}

	}.bind( this ) );

	this.scene.add( this.createSkysphere() );

	this.ball.position.set( 0, 0, 10 );
	this.scene.add( this.ball );
	this.ball.applyCentralImpulse( new THREE.Vector3( 0, 0, - 50 ) );

	//Create a three.js camera.
	this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000 );

	this.cameraObject = new THREE.Object3D();
	this.cameraObject.position.set( this.cameraStartPosition.x, this.cameraStartPosition.y, this.cameraStartPosition.z );
	this.cameraObject.add( this.camera );
	this.scene.add( this.cameraObject );

	//Apply VR headset positional data to camera.
	this.controls = new THREE.VRControls( this.camera );
	this.controls.standing = true;

	//Apply VR stereo rendering to renderer.
	this.effect = new THREE.VREffect( this.renderer );
	this.effect.setSize( window.innerWidth, window.innerHeight );

	this.manager = new WebVRManager( this.renderer, this.effect, this.params );

	window.addEventListener( 'resize', this.onResize.bind( this ), true );
	window.addEventListener( 'vrdisplaypresentchange', this.onResize.bind( this ), true );

}

Game.prototype.run = function( timestamp ) {
	const delta = Math.min( timestamp - this.lastRender, 500 );
	this.lastRender = timestamp;

	// update VR headset position and apply to camera.
	this.controls.update();

	// run physics
	this.scene.simulate();

	// render the scene through the manager.
	this.manager.render( this.scene, this.camera, timestamp );

	this.handleInput();

	requestAnimationFrame( this.run.bind( this ) );

}

Game.prototype.onResize = function( event ) {

	this.effect.setSize( window.innerWidth, window.innerHeight );
	this.camera.aspect = window.innerWidth / window.innerHeight;
	this.camera.updateProjectionMatrix();

}

Game.prototype.createSkysphere = function() {

	// http://www.ianww.com/2014/02/17/making-a-skydome-in-three-dot-js/
	var g = new THREE.SphereGeometry( 3000, 60, 40 );
	var uniforms = {
		texture: { type: 't', value: THREE.ImageUtils.loadTexture( 'res/textures/clouds.jpg' ) }
		//texture: { type: 't', value: THREE.ImageUtils.loadTexture('res/textures/stars.jpg') }
		//texture: { type: 't', value: THREE.TextureLoader('res/textures/clouds.jpg') }
		// FIXME: http://stackoverflow.com/questions/35540880/three-textureloader-is-not-loading-images-files
	};

	var m = new THREE.ShaderMaterial( {
		uniforms: uniforms,
		vertexShader: document.getElementById( 'sky-vertex' ).textContent,
		fragmentShader: document.getElementById( 'sky-fragment' ).textContent
	} );

	var skySphere = new THREE.Mesh( g, m );
	skySphere.scale.set( - 1, 1, 1 );
	//skySpere.eulerOrder = 'XZY';
	skySphere.renderOrder = - 100.0;

	return skySphere;

}

Game.prototype.handleInput = function() {

	if(this.keyboard.pressed( 'w' )) {
		this.cameraObject.position.z -= this.camSpeed;
	}
	if(this.keyboard.pressed( 's' )) {
		this.cameraObject.position.z += this.camSpeed;
	}
	if(this.keyboard.pressed( 'a' )) {
		this.cameraObject.position.x -= this.camSpeed;
	}
	if(this.keyboard.pressed( 'd' )) {
		this.cameraObject.position.x += this.camSpeed;
	}
	if(this.keyboard.pressed( 'e' )) {
		this.cameraObject.position.y += this.camSpeed;
	}
	if(this.keyboard.pressed( 'q' )) {
		this.cameraObject.position.y -= this.camSpeed;
	}

}
