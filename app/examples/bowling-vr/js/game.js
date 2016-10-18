"use strict";

function Game() {

	//TODO: Port physics engine to ammo.js

	//Config vars
	this.started = false;
	this.retries = 0;
	this.gravity = - 5;
	this.cameraStartPosition = new THREE.Vector3( 0, - 1.5, 9 );
	this.camSpeed = 0.1;
	this.normMouseX = 0;
	this.normMouseY = 0;
	this.inputState = 0;
	this.antialias = false;

	this.init();

};

Game.prototype.init = function() {

	document.onmousemove = this.handleMouseMove.bind( this );

	$( document ).ready( function() {

		$( ".button" ).click( function( e ) {

			if ( $( this ).text() == "Start" ) {

				$( "#gui" ).hide();
				game.started = true;
				$( "#viewport" ).show();

			} else if ( $( this ).text() == "Settings" ) {

				$( "#menu" ).hide();
				//TODO: Options don't work yet
				$( "#settings-page" ).show();

			} else if ( $( this ).text() == "About" ) {

				$( "#menu" ).hide();
				$( "#about-page" ).show();

			} else if ( $ ( this ).text() == "Back" ) {

				$( "#menu" ).show();
				$( "#about-page" ).hide();
				$( "#settings-page" ).hide();

			}

		} )

	} );

	//Load resources
	this.soundWood = new Howl( { src: [ 'res/sounds/wood.mp3' ] } );
	this.soundBall = new Howl( { src: [ 'res/sounds/ball.mp3' ], loop: false } );

	//Setup three.js WebGL renderer. Note: Antialiasing is a big performance hit.
	// Only enable it if you actually need to.
	//TODO: Check performance hit of AA
	this.renderer = new THREE.WebGLRenderer( { antialias: true } );
	this.renderer.setPixelRatio( window.devicePixelRatio );

	//Append the canvas element created by the renderer to document body element.
	$( "#viewport" ).append( this.renderer.domElement );
	$( "canvas" ).click( function( e ) {

		this.inputState ++;

	}.bind( this ) );
	$( "canvas" ).css( "cursor", "none" );

	//Create the inputManager wich detects input
	this.keyboard	= new THREEx.KeyboardState( this.renderer.domElement );
	this.renderer.domElement.setAttribute( "tabIndex", "0" );
	this.renderer.domElement.focus();

	//Create a three.js scene and create the level.
	this.level = new Level();
	this.scene = this.level.scene;
	this.scene.setGravity( new THREE.Vector3( 0, this.gravity, 0 ) );

	/*this.arrow = new THREE.ArrowHelper( new THREE.Vector3( 0, 0, -1 ), new THREE.Vector3( 0, -0.3, 1 ), 0.5, 0x00000000 );
	this.scene.add(this.arrow);*/
	this.arrowPoint = new THREE.Mesh( new THREE.CylinderGeometry( 0.001, 0.01, 0.05 ), new THREE.MeshNormalMaterial() );
	this.arrowStem = new THREE.Mesh( new THREE.CylinderGeometry( 0.002, 0.002, 1 ), new THREE.MeshNormalMaterial() );
	this.arrowPoint.position.set( 0, 0.5, 0 );
	this.arrowStem.add( this.arrowPoint );
	this.arrowStem.position.set( 0, 0, - 0.5 )

	this.arrowStem.rotateX( - 90 * ( Math.PI / 180 ) );
	this.setArrowLength( 0.25 );

	/*this.arrow = new THREE.ArrowHelper(new THREE.Vector3(0, 0, -1), new THREE.Vector3(0, -0.4 , 1), 0.2, 0x0000ff, 0.05, 0.05);
	this.arrow.line.material.linewidth = 1000;*/

	this.arrowPivot = new THREE.Object3D();
	this.arrowPivot.position.set( 0, - 0.4, 8.3 );
	this.arrowPivot.add( this.arrowStem );

	this.scene.add( this.arrowPivot );

	this.scene.add( this.createSkysphere() );

	//Create the text
	let loader = new THREE.FontLoader();

	loader.load( 'res/fonts/helvetiker_regular.typeface.js', function ( font ) {

		let textGeo = new THREE.TextGeometry( "Game Over", {
			font: font,

			size: 0.15,
			height: 0.03,
			curveSegments: 12,
		});

		textGeo.computeBoundingBox();

		//var mesh = new THREE.Mesh( textGeo, new THREE.MeshNormalMaterial() );

		//mesh.castShadow = true;
		//mesh.receiveShadow = true;

		this.gameOverMesh = new Physijs.ConcaveMesh(textGeo, new THREE.MeshNormalMaterial(), 3);
		this.gameOverMesh.position.y = 3;
		this.gameOverMesh.position.x = -0.5;
		this.gameOverMesh.position.z = 8;

	}.bind(this) );

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

Game.prototype.handleMouseMove = function( e ) {

	this.normMouseX = e.clientX / window.innerWidth * 2 - 1;
	this.normMouseY = e.clientY / window.innerHeight * 2 - 1;

}

Game.prototype.run = function( timestamp ) {

	requestAnimationFrame( this.run.bind( this ) );
	if ( ! this.started ) return;

	if(this.ball && this.ball.position.y <= -0.5) {
		this.retries++;
		if(this.retries >= 3) {
			this.scene.add(this.gameOverMesh);
			this.inputState = -1;
		}
		this.ball = undefined;
		this.inputState = 0;
		this.setArrowLength(0.25);
		this.arrowPivot.rotation.set(0, 0, 0);
	}

	const delta = Math.min( timestamp - this.lastRender, 500 );
	this.lastRender = timestamp;

	// update VR headset position and apply to camera.
	this.controls.update();

	// run physics
	this.scene.simulate();

	// render the scene through the manager.
	this.manager.render( this.scene, this.camera, timestamp );

	this.handleInput();

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

	if ( this.keyboard.pressed( 'w' ) ) {

		this.cameraObject.position.z -= this.camSpeed;

	}
	if ( this.keyboard.pressed( 's' ) ) {

		this.cameraObject.position.z += this.camSpeed;

	}
	if ( this.keyboard.pressed( 'a' ) ) {

		this.cameraObject.position.x -= this.camSpeed;

	}
	if ( this.keyboard.pressed( 'd' ) ) {

		this.cameraObject.position.x += this.camSpeed;

	}
	if ( this.keyboard.pressed( 'e' ) ) {

		this.cameraObject.position.y += this.camSpeed;

	}
	if ( this.keyboard.pressed( 'q' ) ) {

		this.cameraObject.position.y -= this.camSpeed;

	}

	if ( this.inputState == 0 ) {

		this.arrowPivot.position.x = this.normMouseX * 0.45;

	} else if ( this.inputState == 1 ) {

		this.arrowPivot.rotation.set( 0, this.normMouseX * - 90 * ( Math.PI / 180 ), 0 );
		this.setArrowLength( ( ( - this.normMouseY + 1 ) / 2 ) + 0.05 );

	} else if ( this.inputState == 2 ) {

		this.ball = new Physijs.SphereMesh(
			new THREE.SphereGeometry( 0.108, 8, 8 ),
			new THREE.MeshNormalMaterial(),
			8
		);

		this.ball.position.set( this.arrowPivot.position.x, this.arrowPivot.position.y + 0.08, this.arrowPivot.position.z );
		this.ball.position.y += 0.01;

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

		this.scene.add( this.ball );
		this.inputState ++;

		this.ball.applyCentralImpulse( new THREE.Vector3( Math.sin( this.arrowPivot.rotation.y ) * - this.arrowStem.scale.y * 35, 0, Math.cos( this.arrowPivot.rotation.y ) * - this.arrowStem.scale.y * 35 ) );

	}

}

Game.prototype.setArrowLength = function( length ) {

	this.arrowStem.translateY( ( length - this.arrowStem.scale.y ) / 2 );
	this.arrowStem.scale.y = length;
	this.arrowPoint.scale.y = 1 / length;

}
