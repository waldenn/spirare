//    Init

// init renderer
var renderer = new THREE.WebGLRenderer( {
	antialias: true
} );

renderer.setClearColor( new THREE.Color( 'white' ), 1 )
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// gamepad vars
var hasPressedA = false;
var timePressedA = 0;
var imgXboxAButton;
var gamepads = [];
var hasStarted = false;
var gameStart = 0;
var imagesLoaded = false;
var images = {};
var pressedButtons = [];
var IDX = 0;

var BUTTONS = {
  A: 0,
  B: 1,
  X: 2,
  Y: 3,
  LEFT_BUMPER: 4,
  RIGHT_BUMPER: 5,
  LEFT_TRIGGER: 6,
  RIGHT_TRIGGER: 7,
  BACK: 8,
  START: 9,
  LEFT_STICK: 10,
  RIGHT_STICK: 11,
  DPAD_UP: 12,
  DPAD_DOWN: 13,
  DPAD_LEFT: 14,
  DPAD_RIGHT: 15,
}

// array of functions for the rendering loop
var onRenderFcts = [];

// init scene and camera
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.01, 1000 );
camera.position.y = 0;
camera.position.z = 30;
var controls = new THREE.OrbitControls( camera )

// handle window resize
window.addEventListener( 'resize', function() {

	renderer.setSize( window.innerWidth, window.innerHeight )
	camera.aspect = window.innerWidth / window.innerHeight
	camera.updateProjectionMatrix()

}, false )

// render the scene
onRenderFcts.push( function() {

	renderer.render( scene, camera );

} )

var statsFrame = new Stats();
statsFrame.domElement.style.position = 'absolute';
statsFrame.domElement.style.top = '0px';
document.body.appendChild( statsFrame.domElement );

onRenderFcts.push( function() {

	statsFrame.update()

} )

// run the rendering loop
var lastTimeMsec = null

requestAnimationFrame( function animate( nowMsec ) {

	// keep looping
	requestAnimationFrame( animate );
	// measure time
	lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60
	var deltaMsec = Math.min( 200, nowMsec - lastTimeMsec )
	lastTimeMsec = nowMsec

	// call each update function
	onRenderFcts.forEach( function( onRenderFct ) {

		onRenderFct( deltaMsec / 1000, nowMsec / 1000 )

	} )

} )

//    set 3 point lighting

;( function() {

	// add a ambient light
	var light = new THREE.AmbientLight( 0x020202 )
	scene.add( light )
	// add a light in front
	var light = new THREE.DirectionalLight( 'white', 1 )
	light.position.set( 0.5, 0.5, 2 )
	scene.add( light )
	// add a light behind
	var light = new THREE.DirectionalLight( 'white', 0.75 )
	light.position.set( - 0.5, - 0.5, - 2 )
	scene.add( light )

} )()


var ammoWorld = new THREEx.AmmoWorld()
onRenderFcts.push( function() {

	ammoWorld.update()

} )

//          display ground

;( function() {

	// return
	var geometry = new THREE.BoxGeometry( 40, 0.1, 40 )
	var material = new THREE.MeshNormalMaterial( {
	/**
	  map: new THREE.TextureLoader().load("../../textures/grid.png", function onLoad(texture){
	    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	    texture.repeat.set(geometry.parameters.width,geometry.parameters.depth)
	    texture.anisotropy = renderer.getMaxAnisotropy()
	  })
	  */
	} );

	var mesh = new THREE.Mesh( geometry, material )
	mesh.position.y = - mesh.geometry.parameters.height / 2 - 3
	scene.add( mesh )

	var ammoControls = new THREEx.AmmoControls( mesh, {
	mass: 0
} )
	ammoControls.setRestitution( 0.9 )
	ammoWorld.add( ammoControls )

	var shape = new Ammo.btStaticPlaneShape( new Ammo.btVector3( 0, 0, 1 ), 0 );
	var ammoControls = new THREEx.AmmoControls( mesh, { mass: 0, shape: shape, } );
	ammoControls.setRestitution( 0.4 );
	ammoWorld.add( ammoControls );

} )()

// an inside box
;( function() {

	return
	var geometry = new THREE.PlaneGeometry( 20, 20 )
	var material = new THREE.MeshNormalMaterial( {

	/*
	  map: new THREE.TextureLoader().load("../../textures/grid.png", function onLoad(texture){
	    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	    texture.repeat.set(geometry.parameters.width,geometry.parameters.height)
	    texture.anisotropy = renderer.getMaxAnisotropy()
	  })
	  */
	} );

	// bottom
	var mesh = new THREE.Mesh( geometry, material )
	mesh.position.y = - geometry.parameters.width / 2
	mesh.rotateX( - Math.PI / 2 )
	addStaticPlane( mesh )

	// top
	var mesh = new THREE.Mesh( geometry, material )
	mesh.position.y = + geometry.parameters.width / 2
	mesh.rotateX( + Math.PI / 2 )
	addStaticPlane( mesh )

	// left
	var mesh = new THREE.Mesh( geometry, material )
	mesh.position.x = - geometry.parameters.width / 2
	mesh.rotateY( Math.PI / 2 )
	addStaticPlane( mesh )

	// right
	var mesh = new THREE.Mesh( geometry, material )
	mesh.position.x = + geometry.parameters.width / 2
	mesh.rotateY( - Math.PI / 2 )
	addStaticPlane( mesh )

	// back
	var mesh = new THREE.Mesh( geometry, material )
	mesh.position.z = - geometry.parameters.height / 2
	addStaticPlane( mesh )

	// front
	var mesh = new THREE.Mesh( geometry, material )
	mesh.position.z = geometry.parameters.height / 2
	mesh.rotateY( - Math.PI )
	addStaticPlane( mesh )

	function addStaticPlane( mesh ) {

		scene.add( mesh )
		// Create infinite ground plane 50 meters down. This is to make sure things don't fall down to infinity and irritate our collision detection
		var shape = new Ammo.btStaticPlaneShape( new Ammo.btVector3( 0, 0, 1 ), 0 );
		var ammoControls = new THREEx.AmmoControls( mesh, {
		mass: 0,
		shape: shape,

	} )
		ammoControls.setRestitution( 0.4 )
		ammoWorld.add( ammoControls )

	}

} )()

// some spheres falling

;( function() {

	// return
	var geometry = new THREE.SphereGeometry( 0.5, 16, 10 )
	// var geometry = new THREE.BoxGeometry(1,1,1)
	// var geometry = new THREE.CylinderGeometry(0.5,0.5, 1)
	// debugger;

	//console.log(geometry)

	var material = new THREE.MeshNormalMaterial( {
	wireframe: true
} );

	//var textureColor= THREE.ImageUtils.loadTexture('images/NewTennisBallColor.jpg')
	//var textureBump = THREE.ImageUtils.loadTexture('images/TennisBallBump.jpg')
	var material = new THREE.MeshNormalMaterial( {
	/*
	  map : textureColor,
	  bumpMap : textureBump,
	  bumpScale: 0.01,
	  */
	} )

	for ( var i = 0; i < 5; i ++ ) {

		var mesh = new THREE.Mesh( geometry, material )
		mesh.position.y = 3 + Math.random() * 3
		mesh.position.x = ( Math.random() - 0.5 ) * 15
		mesh.position.z = ( Math.random() - 0.5 ) * 15
		scene.add( mesh )

		var ammoControls = new THREEx.AmmoControls( mesh )
		ammoWorld.add( ammoControls )

	}

} )()

// pile of crate
;( function() {

	return
	var geometry = new THREE.BoxGeometry( 1, 1, 1 )
	var material = new THREE.MeshNormalMaterial( {
	wireframe: true
} );

	var nCubes = new THREE.Vector3( 5, 5, 1 )

	var size = new THREE.Vector3( geometry.parameters.width * 1.1
	, geometry.parameters.height * 1.1
	, geometry.parameters.depth * 1 )

	for ( var x = 0; x < nCubes.x; x ++ ) {

		for ( var y = 0; y < nCubes.y; y ++ ) {

			for ( var z = 0; z < nCubes.z; z ++ ) {

				var mesh = new THREE.Mesh( geometry, material )
				mesh.position.x = ( x - nCubes.x / 2 + 0.5 ) * size.x
				mesh.position.y = ( y - nCubes.y / 2 + 0.5 ) * size.y
				mesh.position.z = ( z - nCubes.z / 2 + 0.5 ) * size.z

				mesh.position.y += 3 + nCubes.y / 2 * size.y
				scene.add( mesh )

				var ammoControls = new THREEx.AmmoControls( mesh )
				ammoWorld.add( ammoControls )

			}

		}

	}

} )()

// pile of bowling pins
;( function() {

	return
	var geometry = new THREE.BoxGeometry( 1, 3, 1 )

	var material = new THREE.MeshNormalMaterial( {
	// wireframe: true
	} );

	var nCubes = new THREE.Vector3( 1, 1, 1 )

	var size = new THREE.Vector3( geometry.parameters.width * 2
	, geometry.parameters.height
	, geometry.parameters.depth * 2 )
	var nRows = 8

	for ( var z = 0; z < nRows; z ++ ) {

		for ( var x = 0; x < z; x ++ ) {

			var mesh = new THREE.Mesh( geometry, material )
			mesh.position.x = ( x - z / 2 + 0.5 ) * size.x
			mesh.position.z = - ( z - nRows / 2 + 0.5 ) * size.z
			scene.add( mesh )

			var ammoControls = new THREEx.AmmoControls( mesh )
			ammoWorld.add( ammoControls )

		}

	}

} )()

//  throw a ball in front of the camera
;( function() {

	var clickRequest = false;
	var mouseCoords = new THREE.Vector2();

	window.addEventListener( 'mousedown', function( event ) {

		if ( clickRequest === true ) return
		clickRequest = true;
		mouseCoords.x = ( event.clientX / window.innerWidth ) * 2 - 1
		mouseCoords.y = - ( event.clientY / window.innerHeight ) * 2 + 1

	}, false );

	onRenderFcts.push( function() {

		if ( clickRequest === false ) return
		clickRequest = false;

		var raycaster = new THREE.Raycaster();
		raycaster.setFromCamera( mouseCoords, camera );

		// create ball
		var position = new THREE.Vector3();
		var quaternion = new THREE.Quaternion();

		position.copy( raycaster.ray.direction );
		position.add( raycaster.ray.origin );
		quaternion.set( 0, 0, 0, 1 );

		// create mesh
		var geometry = new THREE.SphereGeometry( 1, 8, 10 )
		var material = new THREE.MeshNormalMaterial( {
		wireframe: false
	} );

		var mesh = new THREE.Mesh( geometry, material )
		mesh.position.copy( position )
		mesh.quaternion.copy( quaternion )
		scene.add( mesh )

		var ammoControls = new THREEx.AmmoControls( mesh )
		ammoWorld.add( ammoControls )

		var ballBody = ammoControls.physicsBody
		ballBody.setFriction( 40 );
		ballBody.setRestitution( 0.1 )

		// btVector3: http://bulletphysics.org/Bullet/BulletFull/classbtVector3.html
		position.copy( raycaster.ray.direction );
		position.multiplyScalar( 7 * 2 );

		ballBody.setLinearVelocity( new Ammo.btVector3( position.x, position.y, position.z ) );

	} )

} )()

// http://stackoverflow.com/questions/31991267/bullet-physicsammo-js-in-asm-js-how-to-get-collision-impact-force
//
// function playingWithCollision(){
//  var dispatcher = ammoWorld.physicsWorld.getDispatcher()
//  var nManifolds = dispatcher.getNumManifolds()
// console.log('nManifolds', nManifolds)
//  for(var i = 0; i < nManifolds; i++){
//      var manifold = dispatcher.getManifoldByIndexInternal(i);
//
//      var nContact = manifold.getNumContacts();
//      if (nContact === 0) continue
//
//      for(var j = 0; j < nContact; j++){
//          var contactPoint = manifold.getContactPoint(j);
//          console.log('body 1: ', manifold.getBody0());
//          console.log('body 2: ', manifold.getBody1());
// window.body0= manifold.getBody0()
// window.body1= manifold.getBody1()
//          console.log('COLLISION DETECTED!');
//          // HERE: how to get impact force details?
//          console.log( 'applied impulse', contactPoint.getAppliedImpulse() )
//      }
//  }
// }
//
// onRenderFcts.push(function(){
//  playingWithCollision()
// })


// install: sudo apt-get install xboxdrv
//
// run:     sudo xboxdrv
//
// test: http://html5gamepad.com/
//       https://github.com/rbrander/gamepad
//
// docs: https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API
//       https://www.smashingmagazine.com/wp-content/uploads/2016/01/03-360layout-opt-preview.png

function gamepadUpdate() {

  var currGamepads = navigator.getGamepads();
  gamepads = [];

  for (gamepad of currGamepads) {
    if (gamepad !== undefined) {
      gamepads[gamepad.index] = gamepad;
    }
  }

  if (hasStarted && gamepads.length === 0) {
    hasStarted = false;
  }

  if (gamepads.length > 0) {

    // https://developer.mozilla.org/nl/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
    pressedButtons = gamepads[0].buttons.reduce(function(arr, currButton, idx) { // for each button

      if (currButton.pressed && !arr.includes(idx)){ // check if its pressed and not already in our array
        //console.log(idx, currButton, arr);
        return arr.concat(idx);			    // ... add it to our array
      }

      else if (!currButton.pressed && arr.includes(idx)) // if current button not pressed and included in array
	// https://developer.mozilla.org/nl/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
        return arr.filter(function( IDX ) { return IDX !== idx }); // create a new array, for buttons on the active gamepad

      return arr; // return the array of button states

    }, [])

  }

  hasPressedA = gamepads.reduce(function(result, currGamepad) { // check all gamepads
    return result || currGamepad.buttons[BUTTONS.A].pressed;
  }, false);

  if (hasPressedA) {
    timePressedA = new Date().valueOf();
    console.log('pressed A');
  }

  if (!hasStarted && hasPressedA) {
    hasStarted = true;
    gameStart = timePressedA;
    console.log('has started');
  }

}


/*
function draw(tick) {
  // clear the background
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (!imagesLoaded) return;

  var timeDiff = tick - gameStart;
  if (!hasStarted || timeDiff < 1000) {
    ctx.save();

    // Once the A button has been pressed, start a fade out using globalAlpha
    if (hasStarted) {
      ctx.globalAlpha = 1 - (timeDiff / 1000);
    }

    // Display the text and the image for 'A' button
    ctx.fillStyle = 'white';
    ctx.font = '32px Arial';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    var x = (canvas.width - images['A'].width) / 2;
    var y = (canvas.height / 2);
    var text = 'Press';
    var textLength = ctx.measureText(text).width;
    ctx.fillText(text, x, y);
    ctx.drawImage(images['A'], x + textLength - (images['A'].width / 2), y - (images['A'].height / 2));

    // Display the number of players connected
    ctx.font = '12px Arial';
    ctx.textBaseline = 'bottom';
    ctx.textAlign = 'left';
    ctx.fillStyle = 'white';
    var numControllers = gamepads.length;
    var numPlayersText = numControllers === 0 ? 'No controllers connected' : 
      numControllers + ' controller' + (numControllers === 1 ? '' : 's') + ' connected';
    ctx.fillText(numPlayersText, 20, canvas.height - 20);

    ctx.restore();
  } else {
    ctx.save()
    
    var fadeInTime = timeDiff - 1000;
    var isFadingIn = (fadeInTime <= 1000);
    if (isFadingIn) {
      var alpha = (fadeInTime < 1000) ? (fadeInTime / 1000) : 1;
      ctx.globalAlpha = alpha;      
    }
    
    ctx.fillStyle = 'rgb(9, 117, 153)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    var imgLeftStick = images['Left Stick'];
    var imgRightStick = images['Right Stick'];
    var imageWidth = imgLeftStick.width;
    var imageHeight = imgLeftStick.height;

    var imgLeftStickX = (canvas.width - imageWidth) / 2;
    var imgLeftStickY = (canvas.height - imageHeight) / 2;
    var imgRightStickX = (canvas.width - imageWidth) / 2;
    var imgRightStickY = (canvas.height - imageHeight) / 2;

    var padding = 20;
    var halfScreenMoveBoundsWidth = (canvas.width - imageWidth - (padding * 2)) / 2;
    var halfScreenMoveBoundsHeight = (canvas.height - imageHeight - (padding * 2)) / 2;

    if (gamepads[0]) {
      imgLeftStickX += halfScreenMoveBoundsWidth * gamepads[0].axes[0];
      imgLeftStickY += halfScreenMoveBoundsHeight * gamepads[0].axes[1];
      imgRightStickX += halfScreenMoveBoundsWidth * gamepads[0].axes[2];
      imgRightStickY += halfScreenMoveBoundsHeight * gamepads[0].axes[3];
    }

    // draw gray oval shadow
    ctx.beginPath();
    ctx.ellipse(
      canvas.width / 2, canvas.height / 2, // x and y of center
      (canvas.width - (padding * 2)) / 2, (canvas.height - (padding * 2)) / 2, // x and y radius
      0, // rotation
      0, 2 * Math.PI, // start and end angle (in radians)
      false // anti-clockwise
    );
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fill();

    // draw the image in the middle of the gray area
    ctx.imageSmoothingEnabled = true;    
    ctx.drawImage(imgRightStick,
      imgRightStickX,
      imgRightStickY,
      imageWidth,
      imageHeight
    );
    ctx.drawImage(imgLeftStick,
      imgLeftStickX,
      imgLeftStickY,
      imageWidth,
      imageHeight
    );

    var halfButtonSize = 32;
    ctx.globalAlpha = pressedButtons.includes(BUTTONS.A) ? 1 : 0.5;
    ctx.drawImage(images['A'], canvas.width - 70, canvas.height - 50, halfButtonSize, halfButtonSize);
    ctx.globalAlpha = pressedButtons.includes(BUTTONS.B) ? 1 : 0.5;
    ctx.drawImage(images['B'], canvas.width - 50, canvas.height - 70, halfButtonSize, halfButtonSize);
    ctx.globalAlpha = pressedButtons.includes(BUTTONS.X) ? 1 : 0.5;
    ctx.drawImage(images['X'], canvas.width - 90, canvas.height - 70, halfButtonSize, halfButtonSize);
    ctx.globalAlpha = pressedButtons.includes(BUTTONS.Y) ? 1 : 0.5;
    ctx.drawImage(images['Y'], canvas.width - 70, canvas.height - 90, halfButtonSize, halfButtonSize);

    ctx.globalAlpha = pressedButtons.includes(BUTTONS.LEFT_BUMPER) ? 1 : 0.5;
    ctx.drawImage(images['Left Bumper'], 20, 0);

    ctx.globalAlpha = pressedButtons.includes(BUTTONS.LEFT_TRIGGER) ? 1 : 0.5;
    ctx.drawImage(images['Left Trigger'], 20, 40);

    if ( pressedButtons.includes(BUTTONS.LEFT_BUMBER) ){
	console.log('LB');
    }

    ctx.globalAlpha = pressedButtons.includes(BUTTONS.RIGHT_BUMPER) ? 1 : 0.5;
    ctx.drawImage(images['Right Bumper'], canvas.width - images['Right Bumper'].width - 20, 0);
    ctx.globalAlpha = pressedButtons.includes(BUTTONS.RIGHT_TRIGGER) ? 1 : 0.5;
    ctx.drawImage(images['Right Trigger'], canvas.width - images['Right Trigger'].width - 20, 40);

    ctx.globalAlpha = 1;

    var DPadImageLeft = padding;
    var DPadImageTop = canvas.height - padding - images['DPad None'].height;
    if (pressedButtons.includes(BUTTONS.DPAD_UP)) {
      ctx.drawImage(images['DPad Up'], DPadImageLeft, DPadImageTop);
    } else if (pressedButtons.includes(BUTTONS.DPAD_DOWN)) {
      ctx.drawImage(images['DPad Down'], DPadImageLeft, DPadImageTop);
    } else if (pressedButtons.includes(BUTTONS.DPAD_LEFT)) {
      ctx.drawImage(images['DPad Left'], DPadImageLeft, DPadImageTop);
    } else if (pressedButtons.includes(BUTTONS.DPAD_RIGHT)) {
      ctx.drawImage(images['DPad Right'], DPadImageLeft, DPadImageTop);
    } else {
      ctx.drawImage(images['DPad None'], DPadImageLeft, DPadImageTop);
    }

    ctx.restore();
  }
}
*/

// --- end of xbox gamepad handling



// key and gamepad handling
var keyboard	= new THREEx.KeyboardState(renderer.domElement);
renderer.domElement.setAttribute("tabIndex", "0");
renderer.domElement.focus();

onRenderFcts.push( function(delta, now){

	//console.log( pressedButtons );

	if ( pressedButtons.includes(BUTTONS.DPAD_RIGHT) ) {
		console.log('DPAD_RIGHT');
	}

	if( keyboard.pressed('left') ){
		console.log('left');
	}else if( keyboard.pressed('right') ){
		console.log('right');
	}
	if( keyboard.pressed('down') ){
		console.log('down');
	}else if( keyboard.pressed('up') ){
		console.log('up');
	}

	gamepadUpdate( now );
})


