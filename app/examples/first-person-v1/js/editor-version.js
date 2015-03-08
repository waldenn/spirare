var clock;
var scene = this.getObjectByName( 'Scene' );
var camera;
//player.setCamera( this );

//var renderer;

//var scene, camera, renderer;
//var geometry, material, mesh;
//var havePointerLock = checkForPointerLock();
//var controls, controlsEnabled;

var moveForward, moveBackward, moveLeft, moveRight, canJump;
var velocity = new THREE.Vector3();


//---
var ball = this.getObjectByName( 'Ball' );

var speed = new THREE.Vector3();

var group = new THREE.Group();
this.add( group );

var paddle = this.getObjectByName( 'Paddle' );
group.add( paddle );

var brick = this.getObjectByName( 'Brick' );
group.add( brick );

brick.visible = true;
//---

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
			console.log( 'up or w' );
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
	}

}

function updateControls() {

	//if (controlsEnabled) {
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
	
	camera.position.x += velocity.x * delta;
		//this.position.z = Math.cos( time ) * 400;
		//this.lookAt( scene.position );
	
		//camera.translateX(velocity.x * delta);
		//camera.translateY(velocity.y * delta);
		//camera.translateZ(velocity.z * delta);
	
		//controls.getObject().translateX(velocity.x * delta);
		//controls.getObject().translateY(velocity.y * delta);
		//controls.getObject().translateZ(velocity.z * delta);

		//if (controls.getObject().position.y < 10) {
		//	velocity.y = 0;
		//	controls.getObject().position.y = 10;
		//	canJump = true;
		//}
	//}
}


function initControls() {

	document.addEventListener( 'keydown', onKeyDown, false );
	document.addEventListener( 'keyup', onKeyUp, false );
	//raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 10);

}

function createFloor() {

	geometry = new THREE.PlaneBufferGeometry( 2000, 2000, 5, 5 );
	geometry.applyMatrix( new THREE.Matrix4().makeRotationX( -Math.PI / 2 ) );
	//var texture = THREE.ImageUtils.loadTexture('textures/desert.jpg');
	//texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	//texture.repeat.set(64, 64);
	material = new THREE.MeshNormalMaterial();
	return new THREE.Mesh( geometry, material );

}

function init() {

	initControls();

	//initPointerLock();

	//ambienceSfx.play();
	//footStepSfx.preload = 'auto';
	//footStepSfx.loop = true;

	clock = new THREE.Clock();

	//scene = new THREE.Scene();
	scene.fog = new THREE.Fog( 0xb2e1f2, 0, 750 );

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.y = 400;

	//controls = new THREE.PointerLockControls(camera);
	//scene.add(controls.getObject());

	group.add( createFloor() );

}


init();


function update( event ) {
    //console.log('update');	
	updateControls();

}


