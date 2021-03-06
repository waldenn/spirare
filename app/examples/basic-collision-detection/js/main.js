// global variables
var renderer;
var scene;
var camera;

var control;
var cubes = [];

function init() {

	// create a scene, that will hold all our elements such as objects, cameras and lights.
	scene = new THREE.Scene();

	// create a camera, which defines where we're looking at.
	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );

	// create a render, sets the background color and the size
	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor( 0x000000, 1.0 );
	renderer.setSize( window.innerWidth, window.innerHeight );

	// add some cubes to the scene
	var cubeGeometry = new THREE.BoxGeometry( 2, 2, 2 );

	var cubeMaterial = new THREE.MeshLambertMaterial( { color: 0xff2255 } );
	var cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
	cube.name = 'cube';
	scene.add( cube );

	var cubeMaterial2 = new THREE.MeshLambertMaterial( { color: 0xff0000 } );
	var cube2 = new THREE.Mesh( cubeGeometry, cubeMaterial2 );
	cube2.position.set( 5, 0, 0 );
	cube2.name = 'cube-red';
	scene.add( cube2 );
	cubes.push( cube2 );

	var cubeMaterial3 = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
	var cube3 = new THREE.Mesh( cubeGeometry, cubeMaterial3 );
	cube3.position.set( 0, 0, 5 );
	cube3.name = 'cube-green';
	scene.add( cube3 );
	cubes.push( cube3 );

	var cubeMaterial4 = new THREE.MeshLambertMaterial( { color: 0x0000ff } );
	var cube4 = new THREE.Mesh( cubeGeometry, cubeMaterial4 );
	cube4.position.set( 0, 0, -5 );
	cube4.name = 'cube-blue';
	scene.add( cube4 );
	cubes.push( cube4 );

	var cubeMaterial5 = new THREE.MeshLambertMaterial( { color: 0xff00ff } );
	var cube5 = new THREE.Mesh( cubeGeometry, cubeMaterial5 );
	cube5.position.set( -5, 0, 0 );
	cube5.name = 'cube-purple';
	scene.add( cube5 );
	cubes.push( cube5 );

    var gridXY = new THREE.GridHelper(50, 1);
    gridXY.setColors( new THREE.Color(0x0000ff), new THREE.Color(0x0000ff) );
	gridXY.position.y = -2;
    scene.add(gridXY);

	var dirLight = new THREE.DirectionalLight();
	dirLight.position.set( 25, 23, 15 );
	scene.add( dirLight );

	var dirLight2 = new THREE.DirectionalLight();
	dirLight2.position.set( -25, 23, 15 );
	scene.add( dirLight2 );

	// position and point the camera to the center of the scene
	camera.position.x = 15;
	camera.position.y = 16;
	camera.position.z = 13;
	camera.lookAt( scene.position );

	// add the output of the renderer to the html element
	document.body.appendChild( renderer.domElement );

	control = new function () {
	};

	// call the render function
	render();

}

function moveCube( e ) {

	var moveDistance = 0.4;
	var cube = scene.getObjectByName( 'cube' );

	if ( e.keyCode == '37' ) {
		// left arrow
		cube.position.x -= moveDistance;

	} else if ( e.keyCode == '38' ) {
			// up arrow
		cube.position.z -= moveDistance;

	} else if ( e.keyCode == '39' ) {
			// right arrow
		cube.position.x += moveDistance;

	} else if ( e.keyCode == '40' ) {
			// down arrow
		cube.position.z += moveDistance;

	} else if ( e.keyCode == '65' ) {
		
		cube.rotation.y -= moveDistance;

	} else if ( e.keyCode == '83' ) {
		
		cube.rotation.y += moveDistance;

	}

}


function checkCollision() {

	cubes.forEach( function ( cube ) {
		
		cube.material.transparent = false;
		cube.material.opacity = 1.0;
	
	} );

	var cube = scene.getObjectByName( 'cube' );
	var originPoint = cube.position.clone();

	for ( var vertexIndex = 0; vertexIndex < cube.geometry.vertices.length; vertexIndex ++ ) {

		// console.log( vertexIndex );

		var localVertex = cube.geometry.vertices[ vertexIndex ].clone();
		var globalVertex = localVertex.applyMatrix4( cube.matrix );
		var directionVector = globalVertex.sub( cube.position );

		var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
		var collisionResults = ray.intersectObjects( cubes );

		if ( collisionResults.length > 0 && collisionResults[ 0 ].distance < directionVector.length() ) {
			
			console.log( collisionResults[ 0 ].object.name );
			collisionResults[ 0 ].object.material.transparent = true;
			collisionResults[ 0 ].object.material.opacity = 0.4;
		
		}
	
	}

}

function render() {
	
	renderer.render( scene, camera );

	checkCollision();
	requestAnimationFrame( render );

}

// calls the init function when the window is done loading.
window.onload = init;
window.addEventListener( "keydown", moveCube );

