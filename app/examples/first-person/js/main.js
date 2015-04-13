( function() {

	var clock;

	var stats;

	var scene, camera, renderer;

	var geometry, material, mesh;

	var havePointerLock = checkForPointerLock();

	var controls, controlsEnabled;

	var moveForward, moveBackward, moveLeft, moveRight, canJump = true, canPlaceBlock = true;
	
	var walkingSpeed = 350;

	var velocity = new THREE.Vector3();

	var walkingSpeed = 350;

	var footStepSfx = new Audio( 'sfx/footstep.wav' );
	var ambienceSfx = new Audio( 'sfx/ambience.wav' );

	var playercube;
	var cubes;

	ambienceSfx.preload = 'auto';
	ambienceSfx.loop = true;

	init();
	animate();

	function init() {

		initControls();
		initPointerLock();
		THREEx.FullScreen.bindKey( { charCode : 'f'.charCodeAt( 0 ) } );

        //ambienceSfx.play();
		footStepSfx.preload = 'auto';
		footStepSfx.loop = false;
		
		clock = new THREE.Clock();

		scene = new THREE.Scene();
		scene.fog = new THREE.Fog( 0xb2e1f2, 10, 3000 );

		camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
		camera.position.y = 10;

		controls = new THREE.PointerLockControls( camera );
		scene.add( controls.getObject() );

		scene.add( createFloor() );
		scene.add( createPlayerCube() );
		scene.add( createSkysphere() );

		cubes = new THREE.Object3D(); // parent object
		scene.add( cubes );

		renderer = new THREE.WebGLRenderer();
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.setClearColor( 0xb2e1f2 );
		document.body.appendChild( renderer.domElement );

		addStatsObject();
	
		$( "#hud" ).show();
		$( "#hud-permanent" ).show();

		// todo: background audio handling
		//playSoundtrack();
	}

	function playSoundtrack() {

		timbre.rec(function(output) {
		  var midis = [69, 71, 72, 76, 69, 71, 72, 76].scramble();
		  var msec  = timbre.timevalue("bpm60 l8");
		  var synth = T("OscGen", {env:T("perc", {r:msec, ar:true})});

		  T("interval", {interval:msec}, function(count) {
			if (count < midis.length) {
			  synth.noteOn(midis[count], 100);
			} else {
			  output.done();
			}
		  }).start();

		  output.send(synth);
		}).then(function(result) {
		  var L = T("buffer", {buffer:result, loop:true});
		  var R = T("buffer", {buffer:result, loop:true});

		  var num = 400;
		  var duration = L.duration;

		  R.pitch = (duration * (num - 1)) / (duration * num);

		  T("delay", {time:"bpm30 l16", fb:0.1, cross:true},
			T("pan", {pos:-0.6}, L), T("pan", {pos:+0.6}, R)
		  ).play();
		});

	}

	function stopSoundtrack() {
		timbre.pause();
	}

	function animate() {

		requestAnimationFrame( animate );
		stats.update();
		checkCollision();
		updateControls();
		renderer.render( scene, camera );
	
	}

	function createSkysphere() {

		// http://www.ianww.com/2014/02/17/making-a-skydome-in-three-dot-js/
		var g = new THREE.SphereGeometry(3000, 60, 40);
		var uniforms = {
			  texture: { type: 't', value: THREE.ImageUtils.loadTexture('textures/skysphere/clouds01.jpg') }
		};

		var m = new THREE.ShaderMaterial( {
			  uniforms:       uniforms,
			  vertexShader:   document.getElementById('sky-vertex').textContent,
			  fragmentShader: document.getElementById('sky-fragment').textContent
		});

		skySphere = new THREE.Mesh(g, m);
		skySphere.scale.set(-1, 1, 1);
		//skySpere.eulerOrder = 'XZY';
		skySphere.renderDepth = 1000.0;

		return skySphere;
	}

	function createFloor() {

		geometry = new THREE.PlaneBufferGeometry( 4000, 4000, 5, 5 );
		geometry.applyMatrix( new THREE.Matrix4().makeRotationX( -Math.PI / 2 ) );

		var texture = THREE.ImageUtils.loadTexture( 'textures/desert.jpg' );
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( 64, 64 );

		material = new THREE.MeshBasicMaterial( {
			color: 0xffffff,
			map: texture
        } );
		
		var floor = new THREE.Mesh( geometry, material );
		floor.name = "floor";
		
		return floor;
	}

	function createPlayerCube() {

		var height = 10;
		var cubeGeometry = new THREE.BoxGeometry( 10, height, 10 );
		var cubeMaterial = new THREE.MeshLambertMaterial( { color: 0xff2255 } );
		playercube = new THREE.Mesh( cubeGeometry, cubeMaterial );
		playercube.position.y += height / 2;

		//cube.visible = false;
		playercube.name = 'playercube';

		return playercube;
	}

	function createSkybox() {
		
		var imagePrefix = "textures/skybox/dawnmountain-";
		var directions  = [ "xpos", "xneg", "ypos", "yneg", "zpos", "zneg" ];
		var imageSuffix = ".png";

		var skyGeometry = new THREE.BoxGeometry( 2000, 2000, 2000 );	
		
		var materialArray = [];

		for ( var i = 0; i < 6; i ++ ) {

			materialArray.push( new THREE.MeshBasicMaterial( {
				map: THREE.ImageUtils.loadTexture( imagePrefix + directions[ i ] + imageSuffix ),
				side: THREE.BackSide
			} ) );

		}

		var skyMaterial = new THREE.MeshFaceMaterial( materialArray );

		var skybox = new THREE.Mesh( skyGeometry, skyMaterial );
		skybox.position.y = 200;
		
		return skybox;
	
	}

	function checkForPointerLock() {

		return 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
	
	}

	function initPointerLock() {

		var element = document.body;

		if ( havePointerLock ) {

			var pointerlockchange = function( event ) {
				
				if (	document.pointerLockElement === element ||
						document.mozPointerLockElement === element ||
						document.webkitPointerLockElement === element ) {
								
					controlsEnabled = true;
					controls.enabled = true;
							
				}
				else {
								
					controls.enabled = false;
							
				}
			
			};

			var pointerlockerror = function( event ) {
				
				element.innerHTML = 'PointerLock Error';
			
			};

			document.addEventListener( 'pointerlockchange', pointerlockchange, false );
			document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
			document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

			document.addEventListener( 'pointerlockerror', pointerlockerror, false );
			document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
			document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

			var requestPointerLock = function( event ) {
				
				element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
				element.requestPointerLock();
			
			};

			element.addEventListener( 'click', requestPointerLock, false );
        
		}
		else {
			
			element.innerHTML = 'Bad browser; No pointer lock';
		
		}
	
	}

	function onKeyDown( e ) {

		switch ( e.keyCode ) {

			case 16: // shift
				walkingSpeed = 1200; // run
				break;

			case 38: // up

			case 87: // w
				moveForward = true;
				break;

			case 37: // left

			case 65: // a
				moveLeft = true;
				break;

			case 40: // down

			case 83: // s
				moveBackward = true;
				break;

			case 39: // right

			case 68: // d
				moveRight = true;
				break;

			case 32: // space
				if ( canJump === true ) velocity.y += 350;
				canJump = false;
				break;

			case 72: // h
				$( "#hud" ).toggle();
				break;

			case 73: // i
				$( "#stats" ).toggle();
				break;

			case 77: // m
				stopSoundtrack();
				break;
		}

	}

	function onKeyUp( e ) {

		switch ( e.keyCode ) {

			case 16: // shift
				walkingSpeed = 350;
				break;

			case 38: // up

			case 87: // w
				moveForward = false;
				break;

			case 37: // left

			case 65: // a
				moveLeft = false;
				break;

			case 40: // down

			case 83: // s
				moveBackward = false;
				break;

			case 39: // right

			case 68: // d
				moveRight = false;
				break;
				
			case 88: // x
				canPlaceBlock = true;
				break;
		}

	}

	function onClick(event) {

		//event.preventDefault();

		var origin = new THREE.Vector3();
		origin.setFromMatrixPosition( camera.matrixWorld );

		var ahead = new THREE.Vector3( 0, 0, -1 );
		ahead.transformDirection( camera.matrixWorld );
	
		raycaster = new THREE.Raycaster( origin, ahead );

		if ( event.which === 1 ) { // left mouse click

			var intersects = raycaster.intersectObjects( [ scene.getObjectByName( "floor" ) ], true );
			
			if ( intersects.length > 0 ) {
				
				var height = 10;
				
				var cubeGeometry = new THREE.BoxGeometry( 10, 10, 10 );
				var cubeMaterial = new THREE.MeshNormalMaterial( );
				
				var block = new THREE.Mesh( cubeGeometry, cubeMaterial );
				block.name = 'block';
				
				block.position.copy( intersects[ 0 ].point );
				block.position.y += height / 2;
				// var nearness = Math.max ( 4000 / Math.abs( block.position.x , 0.5) );
				
				T("pluck", {freq:500, mul:0.5}).bang().play();
				cubes.add( block );
				
			}
		}
        else if ( event.which === 3 ) { // right mouse click

			// TODO
            // deactivate PointerLock for HUD GUI
            //scene.remove( controls.getObject() );

			var intersects = raycaster.intersectObjects( cubes.children , true);

			if ( intersects.length > 0 ) {
				T("pluck", {freq:700, mul:0.4}).bang().play();

				cubes.remove( intersects[ 0 ].object );

				// .. or change visibility
				//intersects[ 0 ].object.visible = false;
			}

        }
		
	}

	function checkCollision() {

		/*
		cubes.forEach( function ( cube ) {
			cube.material.transparent = false;
			cube.material.opacity = 1.0;
		} );
		*/

		playercube.position = camera.position;
		var origin = playercube.position.clone();
		//origin.setFromMatrixPosition( camera.matrixWorld );
		//console.log(origin);

		for ( var vertexIndex = 0; vertexIndex < playercube.geometry.vertices.length; vertexIndex ++ ) {

			// console.log( vertexIndex );

			var localVertex = playercube.geometry.vertices[ vertexIndex ].clone();
			var globalVertex = localVertex.applyMatrix4( playercube.matrix );
			var directionVector = globalVertex.sub( playercube.position );

			var ray = new THREE.Raycaster( origin, directionVector.clone().normalize() );

			var collisionResults = ray.intersectObjects( cubes.children );

			if ( collisionResults.length > 0 && collisionResults[ 0 ].distance < directionVector.length() ) {

				var obj = collisionResults[ 0 ].object;

				console.log( 'collission with: ', obj.name, obj.id );
				//collisionResults[ 0 ].object.material.transparent = true;
				//collisionResults[ 0 ].object.material.opacity = 0.4;

			}

		}

	}



    function addStatsObject() {
        stats = new Stats();
        stats.setMode(0);

        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.bottom = '0px';

        document.body.appendChild( stats.domElement );
		$( "#stats" ).toggle();
    }

	function initControls() {

    	document.addEventListener( 'mousedown', onClick, false );
		document.addEventListener( 'keydown', onKeyDown, false );
		document.addEventListener( 'keyup', onKeyUp, false );
		window.addEventListener( 'resize', onWindowResize, false );

		raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, -1, 0 ), 0, 10 );

	}

	function onWindowResize() {

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( window.innerWidth, window.innerHeight );

	}

	function updateControls() {

		if ( controlsEnabled ) {
			
			var delta = clock.getDelta();

			velocity.x -= velocity.x * 10.0 * delta;
			velocity.z -= velocity.z * 10.0 * delta;
			velocity.y -= 9.8 * 100.0 * delta;

			if ( moveForward ) velocity.z -= walkingSpeed * delta;
			if ( moveBackward ) velocity.z += walkingSpeed * delta;

			if ( moveLeft ) velocity.x -= walkingSpeed * delta;
			if ( moveRight ) velocity.x += walkingSpeed * delta;

			if ( moveForward || moveBackward || moveLeft || moveRight ) {
				
				//footStepSfx.play();
			
			}

			controls.getObject().translateX( velocity.x * delta );
			controls.getObject().translateY( velocity.y * delta );
			controls.getObject().translateZ( velocity.z * delta );

			if ( controls.getObject().position.y < 10 ) {
				
				velocity.y = 0;
				controls.getObject().position.y = 10;
				canJump = true;
			
			}

			// todo: use simpler code: clone position
			playercube.position.set ( controls.getObject().position.x, controls.getObject().position.y, controls.getObject().position.z );

			$( "#shells" ).html(cubes.children.length);
		}
	
	}

} )();

