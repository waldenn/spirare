'use strict';

var renderer, scene, camera, ground;
var ball, ballVelocity;
var groundFriction = 0.9, groundRestitution = 0.1;

var initScene = function() {

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.getElementById( 'viewport' ).appendChild( renderer.domElement );

	scene = new Physijs.Scene;
	scene.setGravity( new THREE.Vector3( 0, -50, 0 ) );

	camera = new THREE.PerspectiveCamera(	35,	window.innerWidth / window.innerHeight,	1,	1000 );
	camera.position.set( 0, 50, 150 );
	camera.lookAt( scene.position );
	scene.add( camera );

	ground = new Physijs.BoxMesh(
	  new THREE.CubeGeometry( 1000, 1, 1000 ),
	  Physijs.createMaterial( new THREE.MeshBasicMaterial( { color: 0x888888 } ),
	  groundFriction, groundRestitution ),
	  0
	);
	
	ground.name = "ground";
	ground.position.set( 0, 0, 0 );
	scene.add( ground );

	createBowlingPins( 0, 3, 0, 10, 4 );

	ball = new Physijs.SphereMesh(
	  new THREE.SphereGeometry( 2, 10, 10 ),
	  new THREE.MeshNormalMaterial(),
	  1
	);
	
	ball.position.set( 0, 3, 20 );
	scene.add( ball );
	ball.applyCentralImpulse( new THREE.Vector3( 0, 0, - 100 ) );

	requestAnimationFrame( render );

};

var createBowlingPins = function( firstPinPositionX, firstPinPositionY, firstPinPositionZ, spacing, rows ) {

	for ( var i = 1; i <= rows; i ++ ) {

		var even = ( i % 2 == 0 );

		for ( var nPins = 0; nPins < i; nPins ++ ) {

			if ( even ) var offset = ( i / 2 * spacing ) - spacing / 2;
			if ( ! even ) var offset = ( i / 2 - 0.5 ) * spacing;
			var pin = new Physijs.BoxMesh( new THREE.CubeGeometry( 2, 5, 2 ), new THREE.MeshNormalMaterial(), 0.1 );
			pin.position.set( offset - nPins * spacing, firstPinPositionY, i * - spacing );
			scene.add( pin );

		}

	}

}

var render = function() {

	scene.simulate(); // run physics
	renderer.render( scene, camera ); // render the scene
	requestAnimationFrame( render );

};
