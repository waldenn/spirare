// global variables
var renderer;
var scene;
var camera;

var control;

function init() {

	// create a scene, that will hold all our elements such as objects, cameras and lights.
	scene = new THREE.Scene();

	// create a camera, which defines where we're looking at.
	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );

	// create a render, sets the background color and the size
	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor( 0x000000, 1.0 );
	renderer.setSize( window.innerWidth, window.innerHeight );

	// create a cube and add to scene
	var cubeGeometry = new THREE.BoxGeometry( 6, 6, 6 );
	var cubeMaterial = new THREE.MeshLambertMaterial();
	cubeMaterial.color = new THREE.Color( 'red' );
	var cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
	cube.name = 'cube';
	scene.add( cube );

	var light = new THREE.DirectionalLight();
	light.position.set( 20, 30, 20 );
	scene.add( light );

	// position and point the camera to the center of the scene
	camera.position.x = 15;
	camera.position.y = 16;
	camera.position.z = 13;
	camera.lookAt( scene.position );

	// add the output of the renderer to the html element
	document.body.appendChild( renderer.domElement );

	control = new function () {
		
		this.rotationSpeedX = 0.001;
		this.rotationSpeedY = 0.001;
		this.rotationSpeedZ = 0.001;

	};
	addControls( control );

	// call the render function
	render();

}

function addControls( controlObject ) {
	
	var gui = new dat.GUI();
	gui.add( controlObject, 'rotationSpeedX', -0.2, 0.2 );
	gui.add( controlObject, 'rotationSpeedY', -0.2, 0.2 );
	gui.add( controlObject, 'rotationSpeedZ', -0.2, 0.2 );

}

function render() {

	renderer.render( scene, camera );

	scene.getObjectByName( 'cube' ).rotation.x += control.rotationSpeedX;
	scene.getObjectByName( 'cube' ).rotation.y += control.rotationSpeedY;
	scene.getObjectByName( 'cube' ).rotation.z += control.rotationSpeedZ;

	requestAnimationFrame( render );

}

// calls the init function when the window is done loading.
window.onload = init;
