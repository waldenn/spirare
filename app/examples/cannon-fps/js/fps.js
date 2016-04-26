var sphereShape,
  sphereBody,
  world,
  physicsMaterial,
  walls = [],
  balls = [],
  ballMeshes = [],
  boxes = [],
  boxMeshes = [];

var camera, scene, renderer;
var geometry, material, mesh;
var controls, time = Date.now();

var dt = 1 / 60;

// used by ball bullets
var ballShape = new CANNON.Sphere( 0.2 );
var ballGeometry = new THREE.SphereGeometry( ballShape.radius, 32, 32 );
var shootDirection = new THREE.Vector3();
var shootVelo = 35;
var projector = new THREE.Projector();

// html UI elements
var blocker = document.getElementById( 'blocker' );
var instructions = document.getElementById( 'instructions' );

var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

if ( havePointerLock ) {

	var element = document.body;

	var pointerlockchange = function( event ) {

		if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {

			controls.enabled = true;

			blocker.style.display = 'none';

		} else {

			controls.enabled = false;

			blocker.style.display = '-webkit-box';
			blocker.style.display = '-moz-box';
			blocker.style.display = 'box';

			instructions.style.display = '';

		}

	}

	var pointerlockerror = function( event ) {

		instructions.style.display = '';

	}

	// Hook pointer lock state change events
	document.addEventListener( 'pointerlockchange', pointerlockchange, false );
	document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
	document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

	document.addEventListener( 'pointerlockerror', pointerlockerror, false );
	document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
	document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

	instructions.addEventListener( 'click', function( event ) {

		instructions.style.display = 'none';

		// Ask the browser to lock the pointer
		element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

		if ( /Firefox/i.test( navigator.userAgent ) ) {

			var fullscreenchange = function( event ) {

				if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {

					document.removeEventListener( 'fullscreenchange', fullscreenchange );
					document.removeEventListener( 'mozfullscreenchange', fullscreenchange );

					element.requestPointerLock();

				}

			}

			document.addEventListener( 'fullscreenchange', fullscreenchange, false );
			document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );

			element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

			element.requestFullscreen();

		} else {

			element.requestPointerLock();

		}

	}, false );

} else {

	instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

}

initCannon();
init();
animate();

function initCannon() {

	// Setup our world
	world = new CANNON.World();
	world.quatNormalizeSkip = 0;
	world.quatNormalizeFast = false;

	var solver = new CANNON.GSSolver();

	world.defaultContactMaterial.contactEquationStiffness = 1e9;
	world.defaultContactMaterial.contactEquationRelaxation = 4;

	solver.iterations = 7;
	solver.tolerance = 0.1;

	var split = true;

	if ( split )
	  world.solver = new CANNON.SplitSolver( solver );
	else
	  world.solver = solver;

	world.gravity.set( 0, - 20, 0 );
	world.broadphase = new CANNON.NaiveBroadphase();

	// Create a slippery material (friction coefficient = 0.0)
	physicsMaterial = new CANNON.Material( "slipperyMaterial" );
	
	var physicsContactMaterial = new CANNON.ContactMaterial(
	  physicsMaterial,
	  physicsMaterial,
	  0.0, // friction coefficient
	  0.3 // restitution
	);
	// We must add the contact materials to the world.
	// The ContactMaterial defines what happens when two materials meet.
	// http://schteppe.github.io/cannon.js/docs/classes/ContactMaterial.html
	world.addContactMaterial( physicsContactMaterial );

	// Create a sphere for the player
	var mass = 5, radius = 1.3;
	sphereShape = new CANNON.Sphere( radius );
	sphereBody = new CANNON.Body( { mass: mass } );
	sphereBody.addShape( sphereShape );
	sphereBody.position.set( 0, 5, 0 );
	sphereBody.linearDamping = 0.9;
	world.addBody( sphereBody );

	// Create a plane
	var groundShape = new CANNON.Plane();
	var groundBody = new CANNON.Body( { mass: 0 } );
	groundBody.addShape( groundShape );
	groundBody.quaternion.setFromAxisAngle( new CANNON.Vec3( 1, 0, 0 ), - Math.PI / 2 );
	world.addBody( groundBody );

}

function init() {

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

	scene = new THREE.Scene();
	scene.fog = new THREE.Fog( 0x000000, 0, 500 );

	var ambient = new THREE.AmbientLight( 0x111111 );
	scene.add( ambient );

	light = new THREE.SpotLight( 0xffffff );
	light.position.set( 10, 30, 20 );
	light.target.position.set( 0, 0, 0 );

  // easy to switch the fancy lighting off by setting to "false"
	if ( true ) {

		light.castShadow = true;

		light.shadowCameraNear = 20;
		light.shadowCameraFar = 50;//camera.far;
		light.shadowCameraFov = 40;

		light.shadowMapBias = 0.1;
		light.shadowMapDarkness = 0.7;
		light.shadowMapWidth = 2 * 512;
		light.shadowMapHeight = 2 * 512;

		//light.shadowCameraVisible = true;

	}
	scene.add( light );

  // pointerlock controls
	controls = new PointerLockControls( camera, sphereBody );
	scene.add( controls.getObject() );

	// floor
	geometry = new THREE.PlaneGeometry( 300, 300, 50, 50 );
	geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

	material = new THREE.MeshNormalMaterial( { color: 0xdddddd } );

	mesh = new THREE.Mesh( geometry, material );
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	scene.add( mesh );

	renderer = new THREE.WebGLRenderer();
	renderer.shadowMapEnabled = true;
	renderer.shadowMapSoft = true;
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor( scene.fog.color, 1 );

	document.body.appendChild( renderer.domElement );

	window.addEventListener( 'resize', onWindowResize, false );

	// Add boxes
	var halfExtents = new CANNON.Vec3( 1, 1, 1 );
	var boxShape = new CANNON.Box( halfExtents );
	var boxGeometry = new THREE.BoxGeometry( halfExtents.x * 2, halfExtents.y * 2, halfExtents.z * 2 );

	for ( var i = 0; i < 3; i ++ ) {

		var x = ( Math.random() - 0.5 ) * 20;
		var y = 1 + ( Math.random() - 0.5 ) * 1;
		var z = ( Math.random() - 0.5 ) * 20;

		var boxBody = new CANNON.Body( { mass: 5 } );
		boxBody.addShape( boxShape );

		var boxMesh = new THREE.Mesh( boxGeometry, material );

    // add to CannnonJS world
		world.addBody( boxBody );

    // add to ThreeJS scene
		scene.add( boxMesh );

		boxBody.position.set( x, y, z );

		boxMesh.position.set( x, y, z );
		boxMesh.castShadow = true;
		boxMesh.receiveShadow = true;

		boxes.push( boxBody ); // CannonJS list

		boxMeshes.push( boxMesh ); // ThreeJS list

	}


	// add linked boxes (ladder)
	var size = 0.5;
	var he = new CANNON.Vec3( size, size, size * 0.1 );
	var boxShape = new CANNON.Box( he );
	var mass = 0;
	var space = 0.1 * size;
	var N = 5, last;
	var boxGeometry = new THREE.BoxGeometry( he.x * 2, he.y * 2, he.z * 2 );
	
	for ( var i = 0; i < N; i ++ ) {

		var boxbody = new CANNON.Body( { mass: mass } );
		boxbody.addShape( boxShape );
		var boxMesh = new THREE.Mesh( boxGeometry, material );
		boxbody.position.set( 5, ( N - i ) * ( size * 2 + 2 * space ) + size * 2 + space, 0 );
		boxbody.linearDamping = 0.01;
		boxbody.angularDamping = 0.01;
		// boxMesh.castShadow = true;
		boxMesh.receiveShadow = true;
		world.addBody( boxbody );
		scene.add( boxMesh );

		boxes.push( boxbody ); // CannonJS
		boxMeshes.push( boxMesh ); // ThreeJS

		if ( i != 0 ) {

			// Connect this body to the last one
			var c1 = new CANNON.PointToPointConstraint( boxbody, new CANNON.Vec3( - size, size + space, 0 ), last, new CANNON.Vec3( - size, - size - space, 0 ) );
			var c2 = new CANNON.PointToPointConstraint( boxbody, new CANNON.Vec3( size, size + space, 0 ), last, new CANNON.Vec3( size, - size - space, 0 ) );
			world.addConstraint( c1 );
			world.addConstraint( c2 );

		} else {

			mass = 0.3;

		}
		last = boxbody;

	}

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );

}



function animate() {

	requestAnimationFrame( animate );

	if ( controls.enabled ) {

		world.step( dt );

		// update ball/bullets positions
		for ( var i = 0; i < balls.length; i ++ ) {

			ballMeshes[ i ].position.copy( balls[ i ].position );
			ballMeshes[ i ].quaternion.copy( balls[ i ].quaternion );

		}

		// update box positions
		for ( var i = 0; i < boxes.length; i ++ ) {

      // update ThreeJS objects
			boxMeshes[ i ].position.copy( boxes[ i ].position ); // position update
			boxMeshes[ i ].quaternion.copy( boxes[ i ].quaternion ); // rotation update

		}

	}

	controls.update( Date.now() - time );
	renderer.render( scene, camera );
	time = Date.now();

}

function getShootDir( targetVec ) {

	var vector = targetVec;
	targetVec.set( 0, 0, 1 );
	projector.unprojectVector( vector, camera );
	var ray = new THREE.Ray( sphereBody.position, vector.sub( sphereBody.position ).normalize() );
	targetVec.copy( ray.direction );

}

// shoot by clicking
window.addEventListener( "click", function( e ) {

	if ( controls.enabled == true ) {

		var x = sphereBody.position.x;
		var y = sphereBody.position.y;
		var z = sphereBody.position.z;

		var ballBody = new CANNON.Body( { mass: 1 } );
		ballBody.addShape( ballShape );

		var ballMesh = new THREE.Mesh( ballGeometry, material );
		world.addBody( ballBody ); // CannonJS
		scene.add( ballMesh ); // ThreeJS

		ballMesh.castShadow = true;
		ballMesh.receiveShadow = true;
		balls.push( ballBody ); // CannonJS
		ballMeshes.push( ballMesh ); // ThreeJS

    console.log(shootDirection);
		getShootDir( shootDirection );

		ballBody.velocity.set(
      shootDirection.x * shootVelo,
		  shootDirection.y * shootVelo,
		  shootDirection.z * shootVelo
    );

		// Move the ball outside the player sphere
		x += shootDirection.x * ( sphereShape.radius * 1.02 + ballShape.radius );
		y += shootDirection.y * ( sphereShape.radius * 1.02 + ballShape.radius );
		z += shootDirection.z * ( sphereShape.radius * 1.02 + ballShape.radius );

		ballBody.position.set( x, y, z ); // CannonJS
		ballMesh.position.set( x, y, z ); // ThreeJS

	}

} );

