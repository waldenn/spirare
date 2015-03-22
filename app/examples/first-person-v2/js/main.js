( function() {

	var clock;

	var scene, camera, renderer;

	var geometry, material, mesh;

	var havePointerLock = checkForPointerLock();

	var controls, controlsEnabled;

	var moveForward, moveBackward, moveLeft, moveRight, canJump = true, canPlaceBlock = true;

	var velocity = new THREE.Vector3();

	var footStepSfx = new Audio( 'sfx/footstep.wav' );
	var ambienceSfx = new Audio( 'sfx/ambience.wav' );

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

        // floor
		scene.add( createFloor() );

		// skybox
		scene.add( createSkybox() );

		renderer = new THREE.WebGLRenderer();
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.setClearColor( 0xb2e1f2 );
		document.body.appendChild( renderer.domElement );
	
	}

	function animate() {

		requestAnimationFrame( animate );
		updateControls();
		renderer.render( scene, camera );
	
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

		}

	}

	function onKeyUp( e ) {

		switch ( e.keyCode ) {

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

		if ( event.which === 1 ) { // left mouse click

			var origin = new THREE.Vector3();
			origin.setFromMatrixPosition( camera.matrixWorld );
	
			var ahead = new THREE.Vector3( 0, 0, -1 );
			ahead.transformDirection( camera.matrixWorld );
		
			raycaster = new THREE.Raycaster( origin, ahead );
			
			var intersects = raycaster.intersectObjects( [ scene.getObjectByName( "floor" ) ], true );
			
			if ( intersects.length > 0 ) {
				
				var height = 10;
				
				var cubeGeometry = new THREE.BoxGeometry( 10, height, 10 );
				var cubeMaterial = new THREE.MeshNormalMaterial( );
				
				var block = new THREE.Mesh( cubeGeometry, cubeMaterial );
				
				block.position.copy( intersects[ 0 ].point );
				block.position.y += height / 2;
				
				scene.add( block );
				
			}
		}
		
		
	}

	function initControls() {

    	document.addEventListener( 'mousedown', onClick, false );
		document.addEventListener( 'keydown', onKeyDown, false );
		document.addEventListener( 'keyup', onKeyUp, false );
		raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, -1, 0 ), 0, 10 );

	}

	function updateControls() {

		if ( controlsEnabled ) {
			
			var delta = clock.getDelta();
			var walkingSpeed = 200.0;

            //console.log(delta);

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
		
		}
	
	}

} )();

