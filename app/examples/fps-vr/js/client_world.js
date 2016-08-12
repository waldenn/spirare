var container, scene, camera, renderer, clock, raycaster, objects = [];
var keyState = {};

var ground;
var sphere;

var clickRequest = false;
var mouseCoords = new THREE.Vector2();

var player, playerId, moveSpeed, turnSpeed;

var playerData;

var otherPlayers = [],
    otherPlayersId = [];

var loadWorld = function() {

	init();
	animate();

	function init() {

		if ( window.performance ) {

			if ( performance.navigation.type == 1 ) {

				// page reloaded
				console.log( 'page reloaded' );
				// FIXME: remove old player with removeOtherPlayer( id )

			}

		}

		renderer = new THREE.WebGLRenderer();
		element = renderer.domElement;
		container = document.getElementById( 'container' );
		container.appendChild( element );

		effect = new THREE.StereoEffect( renderer );

		scene = new Physijs.Scene;
		//scene = new THREE.Scene();

		clock = new THREE.Clock();

		camera = new THREE.PerspectiveCamera( 90, 1, 0.001, 700 );
		//camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);

		//camera.position.set(0, 10, 0);
		//camera.position.z = 5;

		//scene.add(camera);

		window.addEventListener( 'resize', resize, false );
		setTimeout( resize, 1 );

		//renderer.setSize(window.innerWidth, window.innerHeight);
		//effect.setSize(window.innerWidth, window.innerHeight);

		raycaster = new THREE.Raycaster();

		controls = new THREE.OrbitControls( camera, element );
		controls.rotateUp( Math.PI / 4 );

		/*
		      controls.target.set(
		        camera.position.x + 0.1,
		        camera.position.y,
		        camera.position.z
		      );
		      */

		controls.noZoom = true;
		controls.noPan = true;


		// add objects to the scene

		//var sphere_geometry = new THREE.SphereGeometry( 1 );
		//var sphere_material = new THREE.MeshNormalMaterial();
		//sphere = new THREE.Mesh( sphere_geometry, sphere_material );

		//scene.add( sphere );
		//objects.push( sphere ); // used for raycast intersection check


		// ground
		var groundFriction = 10, groundRestitution = 0.9;
		ground = new Physijs.BoxMesh( new THREE.BoxGeometry( 100, 0.3, 100 ), Physijs.createMaterial( new THREE.MeshNormalMaterial(), groundFriction, groundRestitution ), 0 );

		ground.position.y = -1;
		scene.add(ground);


		// events
		window.addEventListener( 'deviceorientation', setOrientationControls, true );
		//document.addEventListener( 'click', onMouseClick, false );

		document.addEventListener( 'mousedown', function( event ) {
			if ( ! clickRequest ) {

				mouseCoords.set(
					( event.clientX / window.innerWidth ) * 2 - 1,
					- ( event.clientY / window.innerHeight ) * 2 + 1
				);

				clickRequest = true;

			}

		}, false );


		//document.addEventListener( 'mousedown', onMouseDown, false );
		//document.addEventListener( 'mouseup', onMouseUp, false );
		document.addEventListener( 'mousemove', onMouseMove, true );
		document.addEventListener( 'mouseout', onMouseOut, false );
		document.addEventListener( 'keydown', onKeyDown, false );
		document.addEventListener( 'keyup', onKeyUp, false );
		//window.addEventListener('resize', onWindowResize, false);

		container.appendChild( renderer.domElement );
		document.body.appendChild( container );

	}

	function setOrientationControls( e ) {

		if ( ! e.alpha ) {

			return;

		}

		controls = new THREE.DeviceOrientationControls( camera, true );
		controls.connect();
		controls.update();

		//element.addEventListener('click', fullscreen, false);

		window.removeEventListener( 'deviceorientation', setOrientationControls, true );

	}

	function mousemove( e ) {

		console.log( 'mousemove' );
		console.log( e.movementX );
		console.log( e.movementY );

	}


	function processClick() {

		if ( clickRequest ) {

			console.log('shoot');
			raycaster.setFromCamera( mouseCoords, camera );

			// creates a bullet
			var bulletMass = 0.2;
			var bulletRadius = 0.1;

			//var ball = new THREE.Mesh( new THREE.SphereGeometry( ballRadius, 18, 16 ), new THREE.MeshNormalMaterial( ) );

			var bullet = new Physijs.SphereMesh( new THREE.SphereGeometry( bulletRadius, 18, 16 ), new THREE.MeshNormalMaterial( ) );

			/*
			mesh.addEventListener( 'ready', readyHandler );

			var readyHandler = function() {
			    // object has been added to the scene
			};

			*/

			var pos = new THREE.Vector3();
			//var quat = new THREE.Quaternion();

			//bullet.position.set( player.position );

			//ball.castShadow = true;
			//ball.receiveShadow = true;
			//var ballShape = new Ammo.btSphereShape( ballRadius );
			//ballShape.setMargin( margin );

			pos.copy( raycaster.ray.direction );
			//pos.add( raycaster.ray.origin );
			//quat.set( 0, 0, 0, 1 );
			//pos.multiplyScalar( 4 );

			/*
			var ballBody = createRigidBody( ball, ballShape, ballMass, pos, quat );
			ballBody.setFriction( 0.5 );

			pos.copy( raycaster.ray.direction );
			ballBody.setLinearVelocity( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
			*/

			scene.add( bullet );

			bullet.setLinearVelocity( new THREE.Vector3( pos.x, pos.y, pos.z ) );
			//bullet.applyCentralImpulse( new THREE.Vector3( pos.x, pos.y, pos.z ) );

			clickRequest = false;

		}

	}

	function resize() {

		var width = container.offsetWidth;
		var height = container.offsetHeight;

		camera.aspect = width / height;
		camera.updateProjectionMatrix();

		renderer.setSize( width, height );
		effect.setSize( width, height );

	}

	function update( dt ) {

		//resize();
		processClick();

		// run physics
		scene.simulate();

		camera.updateProjectionMatrix();

		controls.update( dt );

	}

	function render( dt ) {

		effect.render( scene, camera );

	}

	function animate( t ) {

		requestAnimationFrame( animate );

		update( clock.getDelta() );
		render( clock.getDelta() );

	}


	/*
	    function animate() {
		//resize();
	        requestAnimationFrame(animate);
	        render();
	    }
	    */

	function render() {

		if ( player ) {

			//updateCameraPosition();

			checkKeyStates();

			//camera.lookAt(player.position);

		}

		//renderer.clear();
		//renderer.render(scene, camera);
		effect.render( scene, camera );

	}

	function onMouseClick() {

		intersects = calculateIntersects( event );

		if ( intersects.length > 0 ) {

			//if ( intersects[ 0 ].object == sphere ) {

				//alert( "This is a sphere!" );

			//}

		}

	}

	function onMouseDown() { }

	function onMouseUp() { }

	function onMouseMove() { }

	function onMouseOut() { }

	function onKeyDown( event ) {

		keyState[ event.keyCode || event.which ] = true;

	}

	function onKeyUp( event ) {

		keyState[ event.keyCode || event.which ] = false;

	}

	function onWindowResize() {

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( window.innerWidth, window.innerHeight );

		effect.setSize( window.innerWidth, window.innerHeight );

	}

	function fullscreen() {

		if ( container.requestFullscreen ) {

			container.requestFullscreen();

		} else if ( container.msRequestFullscreen ) {

			container.msRequestFullscreen();

		} else if ( container.mozRequestFullScreen ) {

			container.mozRequestFullScreen();

		} else if ( container.webkitRequestFullscreen ) {

			container.webkitRequestFullscreen();

		}

	}


	function calculateIntersects( event ) {

		//Determine objects intersected by raycaster
		event.preventDefault();

		var vector = new THREE.Vector3();
		vector.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
		vector.unproject( camera );

		raycaster.ray.set( camera.position, vector.sub( camera.position ).normalize() );

		var intersects = raycaster.intersectObjects( objects );

		return intersects;

	}

};

var createPlayer = function( data ) {

	playerData = data;

	var cube_geometry = new THREE.BoxGeometry( data.sizeX, data.sizeY, data.sizeZ );
	var cube_material = new THREE.MeshBasicMaterial( {
		color: 0x7777ff,
		wireframe: false
	} );

	player = new THREE.Mesh( cube_geometry, cube_material );

	player.rotation.set( 0, 0, 0 );

	player.position.x = data.x;
	player.position.y = data.y;
	player.position.z = data.z;

	playerId = data.playerId;
	moveSpeed = data.speed;
	turnSpeed = data.turnSpeed;

	//updateCameraPosition();

	objects.push( player );

	//camera.position.set(0, 10, 0);
	//camera.position.z = 5;

	player.add( camera );

	scene.add( player );

	//camera.lookAt(player.position);

};

var updateCameraPosition = function() {

	camera.position.x = player.position.x + 6 * Math.sin( player.rotation.y );
	camera.position.y = player.position.y + 6;
	camera.position.z = player.position.z + 6 * Math.cos( player.rotation.y );

};

var updatePlayerPosition = function( data ) {

	var somePlayer = playerForId( data.playerId );

	somePlayer.position.x = data.x;
	somePlayer.position.y = data.y;
	somePlayer.position.z = data.z;

	somePlayer.rotation.x = data.r_x;
	somePlayer.rotation.y = data.r_y;
	somePlayer.rotation.z = data.r_z;

};

var updatePlayerData = function() {

	playerData.x = player.position.x;
	playerData.y = player.position.y;
	playerData.z = player.position.z;

	playerData.r_x = player.rotation.x;
	playerData.r_y = player.rotation.y;
	playerData.r_z = player.rotation.z;

};
var checkKeyStates = function() {

	if ( keyState[ 38 ] || keyState[ 87 ] ) {

		// up arrow or 'w' - move forward
		player.position.x -= moveSpeed * Math.sin( player.rotation.y );
		player.position.z -= moveSpeed * Math.cos( player.rotation.y );
		updatePlayerData();
		socket.emit( 'updatePosition', playerData );

	}
	if ( keyState[ 40 ] || keyState[ 83 ] ) {

		// down arrow or 's' - move backward
		player.position.x += moveSpeed * Math.sin( player.rotation.y );
		player.position.z += moveSpeed * Math.cos( player.rotation.y );
		updatePlayerData();
		socket.emit( 'updatePosition', playerData );

	}
	if ( keyState[ 37 ] || keyState[ 65 ] ) {

		// left arrow or 'a' - rotate left
		player.rotation.y += turnSpeed;
		updatePlayerData();
		socket.emit( 'updatePosition', playerData );

	}
	if ( keyState[ 39 ] || keyState[ 68 ] ) {

		// right arrow or 'd' - rotate right
		player.rotation.y -= turnSpeed;
		updatePlayerData();
		socket.emit( 'updatePosition', playerData );

	}
	if ( keyState[ 81 ] ) {

		// 'q' - strafe left
		player.position.x -= moveSpeed * Math.cos( player.rotation.y );
		player.position.z += moveSpeed * Math.sin( player.rotation.y );
		updatePlayerData();
		socket.emit( 'updatePosition', playerData );

	}
	if ( keyState[ 69 ] ) {

		// 'e' - strage right
		player.position.x += moveSpeed * Math.cos( player.rotation.y );
		player.position.z -= moveSpeed * Math.sin( player.rotation.y );
		updatePlayerData();
		socket.emit( 'updatePosition', playerData );

	}

};

var addOtherPlayer = function( data ) {

	var cube_geometry = new THREE.BoxGeometry( data.sizeX, data.sizeY, data.sizeZ );
	var cube_material = new THREE.MeshBasicMaterial( {
		color: 0x7777ff,
		wireframe: false
	} );
	var otherPlayer = new THREE.Mesh( cube_geometry, cube_material );

	otherPlayer.position.x = data.x;
	otherPlayer.position.y = data.y;
	otherPlayer.position.z = data.z;

	otherPlayersId.push( data.playerId );
	otherPlayers.push( otherPlayer );
	objects.push( otherPlayer );
	scene.add( otherPlayer );

};

var removeOtherPlayer = function( data ) {

	scene.remove( playerForId( data.playerId ) );

};

var playerForId = function( id ) {

	var index;
	for ( var i = 0; i < otherPlayersId.length; i ++ ) {

		if ( otherPlayersId[ i ] == id ) {

			index = i;
			break;

		}

	}
	return otherPlayers[ index ];

};

