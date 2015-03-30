if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container, camera, scene, renderer;

var geometry, objects;

var mouseX = 0, mouseY = 0;
	
var mesh;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var mouseMoved = false;

document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	
init();
animate();
	
function init() {

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 15000 );
	camera.position.z = 500;
	camera.position.y = 500;

	scene = new THREE.Scene();
	scene.fog = new THREE.Fog( 0x000000, 1, 15000 );

	var light = new THREE.PointLight( 0xCCFFFF );
	light.position.set( 300, 600, 700 );
	scene.add( light );

	var light = new THREE.AmbientLight( 0x111111 );
	scene.add( light );


	var geometry = new THREE.BoxGeometry( 100, 10, 100, 1, 1, 1 );
						
	var material = new THREE.MeshLambertMaterial( { color: 0xCCFFFF, morphTargets: true } );
	
    // construct 8 blend shapes
	for ( var i = 0; i < geometry.vertices.length; i ++ ) {

		var vertices = [];
		for ( var v = 0; v < geometry.vertices.length; v ++ ) {
				
			vertices.push( geometry.vertices[ v ].clone() );
			if ( v === i ) {
				vertices[ vertices.length - 1 ].y *= 10;
				vertices[ vertices.length - 1 ].x *= 1.5;
				vertices[ vertices.length - 1 ].z *= 1.6;
			}
			
		}

		geometry.morphTargets.push( { name: "target" + i, vertices: vertices } );

	}
	mesh = new THREE.Mesh( geometry, material );
	mesh.position.y = -100
	scene.add( mesh );

	renderer = new THREE.WebGLRenderer( { clearColor: 0x222222, clearAlpha: 1 } );
	renderer.setSize( window.innerWidth, window.innerHeight );
    //renderer.sortObjects = false;
	container.appendChild( renderer.domElement );
	window.addEventListener( 'resize', onWindowResize, false );
	
}
	
function onWindowResize() {

	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseMove( event ) {

	mouseX = ( event.clientX - windowHalfX );
	mouseY = ( event.clientY - windowHalfY ) * 2;
	mouseMoved = true;

}

function animate() {

	requestAnimationFrame( animate );
	render();

}
			
function render() {

	mesh.rotation.y += 0.01;
				
	//Create morph values based on rotation for a bouncing effect    
	var morph = Math.abs( Math.sin( mesh.rotation.y ) ) * 5
				
	//Updating the morphs with new values. We only want to influence one side of the cube
	mesh.morphTargetInfluences[ 0 ] = morph
	mesh.morphTargetInfluences[ 1 ] = morph
	mesh.morphTargetInfluences[ 4 ] = morph
	mesh.morphTargetInfluences[ 5 ] = morph
	
	if ( mouseMoved ) {
		
		camera.position.y += ( - mouseY - camera.position.y ) * .02;
		camera.position.x += ( - mouseX - camera.position.x ) * .02;
	
	}

	camera.lookAt( scene.position );
	renderer.render( scene, camera );

}

