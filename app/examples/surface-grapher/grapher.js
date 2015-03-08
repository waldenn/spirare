/*
	Three.js "tutorials by example"
	Author: Lee Stemkoski
	Date: July 2013 (three.js v59dev)
*/

// standard global variables
var container, scene, camera, renderer, controls, stats;
var keyboard = new THREEx.KeyboardState();
var clock = new THREE.Clock();

// custom global variables
var gui, gui_zText, 
	gui_xMin, gui_xMax, gui_yMin, gui_yMax,
	gui_a, gui_b, gui_c, gui_d,
	gui_segments;

var zFuncText = "x^2 - y^2";
var zFunc = Parser.parse( zFuncText ).toJSFunction( [ 'x', 'y' ] );

// parameters for the equations
var a = 0.01, b = 0.01, c = 0.01, d = 0.01;

var meshFunction;
var segments = 20, 
	xMin = -10, xMax = 10, xRange = xMax - xMin,
	yMin = -10, yMax = 10, yRange = yMax - yMin,
	zMin = -10, zMax = 10, zRange = zMax - zMin;
	
var graphGeometry;
var gridMaterial, wireMaterial, vertexColorMaterial;
var graphMesh;

init();
animate();

// FUNCTIONS 		
function init() 
{
	// SCENE
	scene = new THREE.Scene();

	// CAMERA
	var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
	var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR );
	scene.add( camera );
	camera.position.set( 0, 150, 400 );
	camera.lookAt( scene.position );	

	// RENDERER
	if ( Detector.webgl )
		renderer = new THREE.WebGLRenderer( { antialias: true } );
	else
		renderer = new THREE.CanvasRenderer(); 

	renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
	container = document.getElementById( 'ThreeJS' );
	container.appendChild( renderer.domElement );

	// EVENTS
	THREEx.WindowResize( renderer, camera );
	THREEx.FullScreen.bindKey( { charCode : 'f'.charCodeAt( 0 ) } );

	// CONTROLS
	controls = new THREE.TrackballControls( camera, renderer.domElement );

	// STATS
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '0px';
	stats.domElement.style.zIndex = 100;
	container.appendChild( stats.domElement );

	// LIGHT
	var light = new THREE.PointLight( 0xffffff );
	light.position.set( 0, 250, 0 );
	scene.add( light );

	// SKYBOX/FOG
	// scene.fog = new THREE.FogExp2( 0x888888, 0.00025 );
	
	// CUSTOM
	
	scene.add( new THREE.AxisHelper() );

	// wireframe for xy-plane
	//var wireframeMaterial = new THREE.MeshBasicMaterial( { color: 0x000088, wireframe: true, side:THREE.DoubleSide } ); 
	//var floorGeometry = new THREE.PlaneBufferGeometry(1000,1000,10,10);
	//var floor = new THREE.Mesh(floorGeometry, wireframeMaterial);
	//floor.position.z = -0.01;
	// rotate to lie in x-y plane
	// floor.rotation.x = Math.PI / 2;
	//scene.add(floor);
	
	var gridXY = new THREE.GridHelper( 300, 10 );
	gridXY.rotation.x = Math.PI / 2;
	gridXY.position.set( 0, 0, 0 );
	gridXY.setColors( new THREE.Color( 0xff0000 ), new THREE.Color( 0xffffff ) );
	scene.add( gridXY );

	var normMaterial = new THREE.MeshNormalMaterial;
	var shadeMaterial = new THREE.MeshLambertMaterial( { color: 0xff0000 } );
	
	// "wireframe texture"
	var wireTexture = new THREE.ImageUtils.loadTexture( 'images/square.png' );
	wireTexture.wrapS = wireTexture.wrapT = THREE.RepeatWrapping; 
	wireTexture.repeat.set( 40, 40 );
	wireMaterial = new THREE.MeshBasicMaterial( { map: wireTexture, vertexColors: THREE.VertexColors, side: THREE.DoubleSide } );

	var vertexColorMaterial  = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } );

	// bgcolor
	renderer.setClearColor( 0x888888, 1 );

	// GUI SETUP

	gui = new dat.GUI();
	
	parameters = 
	{
		resetCam:  function() { resetCamera(); },	
		preset1:   function() { preset01(); },
		preset2:   function() { preset02(); },
		preset3:   function() { preset03(); },
		graphFunc: function() { createGraph(); },
		finalValue: 337
	};

	// GUI -- equation
	gui_zText = gui.add( this, 'zFuncText' ).name( 'z = f(x,y) = ' );
	gui_xMin = gui.add( this, 'xMin' ).name( 'x Minimum = ' );
	gui_xMax = gui.add( this, 'xMax' ).name( 'x Maximum = ' );
	gui_yMin = gui.add( this, 'yMin' ).name( 'y Minimum = ' );
	gui_yMax = gui.add( this, 'yMax' ).name( 'y Maximum = ' );
	gui_segments = gui.add( this, 'segments' ).name( 'Subdivisions = ' );

	// GUI -- parameters
	var gui_parameters = gui.addFolder( 'Parameters' );
	a = b = c = d = 0.01;
	gui_a = gui_parameters.add( this, 'a' ).min( -5 ).max( 5 ).step( 0.01 ).name( 'a = ' );
	gui_a.onChange( function( value ) { 

		createGraph(); 

	} );
	gui_b = gui_parameters.add( this, 'b' ).min( -5 ).max( 5 ).step( 0.01 ).name( 'b = ' );
	gui_b.onChange( function( value ) { 

		createGraph(); 

	} );
	gui_c = gui_parameters.add( this, 'c' ).min( -5 ).max( 5 ).step( 0.01 ).name( 'c = ' );
	gui_c.onChange( function( value ) { 

		createGraph(); 

	} );
	gui_d = gui_parameters.add( this, 'd' ).min( -5 ).max( 5 ).step( 0.01 ).name( 'd = ' );
	gui_d.onChange( function( value ) { 

		createGraph(); 

	} );
	gui_a.setValue( 1 );
	gui_b.setValue( 1 );
	gui_c.setValue( 1 );
	gui_d.setValue( 1 );

	// GUI -- preset equations
	var gui_preset = gui.addFolder( 'Preset equations' );
	gui_preset.add( parameters, 'preset1' ).name( 'Sine wave' );
	gui_preset.add( parameters, 'preset2' ).name( 'Wavelet' );
	gui_preset.add( parameters, 'preset3' ).name( 'Grand Canyon' );

	gui.add( parameters, 'resetCam' ).name( "Reset Camera" );
	gui.add( parameters, 'graphFunc' ).name( "Graph Function" );	

	preset02();

}

function createGraph()
{
	
	xRange = xMax - xMin;
	yRange = yMax - yMin;
	zFunc = Parser.parse( zFuncText ).toJSFunction( [ 'x', 'y' ] );

	meshFunction = function( x, y ) 
	{
		
		x = xRange * x + xMin;
		y = yRange * y + yMin;
		var z = zFunc( x, y ); //= Math.cos(x) * Math.sqrt(y);
		if ( isNaN( z ) )
			return new THREE.Vector3( 0, 0, 0 ); // TODO: better fix
		else
			return new THREE.Vector3( x, y, z );
	
	};
	
	// true => sensible image tile repeat...
	graphGeometry = new THREE.ParametricGeometry( meshFunction, segments, segments, true );
	
	// calculate vertex colors based on Z values
	graphGeometry.computeBoundingBox();
	zMin = graphGeometry.boundingBox.min.z;
	zMax = graphGeometry.boundingBox.max.z;
	zRange = zMax - zMin;
	var color, point, face, numberOfSides, vertexIndex;
	// faces are indexed using characters
	var faceIndices = [ 'a', 'b', 'c', 'd' ];
	// first, assign colors to vertices as desired
	for ( var i = 0; i < graphGeometry.vertices.length; i ++ ) 
	{
		
		point = graphGeometry.vertices[ i ];
		color = new THREE.Color( 0x0000ff );
		color.setHSL( 0.7 * ( zMax - point.z ) / zRange, 1, 0.5 );
		graphGeometry.colors[ i ] = color; // use this array for convenience
	
	}
	// copy the colors as necessary to the face's vertexColors array.
	for ( var i = 0; i < graphGeometry.faces.length; i ++ ) 
	{
		
		face = graphGeometry.faces[ i ];
		numberOfSides = ( face instanceof THREE.Face3 ) ? 3 : 4;
		for ( var j = 0; j < numberOfSides; j ++ ) 
		{
			
			vertexIndex = face[ faceIndices[ j ] ];
			face.vertexColors[ j ] = graphGeometry.colors[ vertexIndex ];
		
		}
	
	}
	
	// material choices: vertexColorMaterial, wireMaterial , normMaterial , shadeMaterial
	
	if ( graphMesh ) 
	{
		
		scene.remove( graphMesh );
		// renderer.deallocateObject( graphMesh );
	}

	wireMaterial.map.repeat.set( segments, segments );
	
	graphMesh = new THREE.Mesh( graphGeometry, wireMaterial );
	graphMesh.doubleSided = true;
	scene.add( graphMesh );

}

function preset01()
{
	
	gui_zText.setValue( "a*sin(b*x+c)" );
	//gui_zText.setValue("sin(sqrt(a*x^2  + b*y^2))");

	gui_xMin.setValue( -5 ); gui_xMax.setValue( 5 );
	gui_yMin.setValue( -1 ); gui_yMax.setValue( 1 );
	gui_a.setValue( 1 );
	gui_b.setValue( 1 );
	gui_segments.setValue( 55 );
	createGraph(); resetCamera();

}

function preset02()
{
	
	gui_zText.setValue( "sin(sqrt(a*x^2  + b*y^2))" );

	gui_xMin.setValue( -10 ); gui_xMax.setValue( 10 );
	gui_yMin.setValue( -10 ); gui_yMax.setValue( 10 );
	gui_a.setValue( 1 );
	gui_b.setValue( 1 );
	gui_segments.setValue( 55 );
	createGraph(); resetCamera();

}

function preset03()
{
	
	gui_zText.setValue( "x/y * a * cos(a*(x+y)/y)" );

	gui_xMin.setValue( -100 ); gui_xMax.setValue( 100 );
	gui_yMin.setValue( -100 ); gui_yMax.setValue( 100 );
	gui_a.setValue( 1 );
	gui_b.setValue( 1 );
	gui_segments.setValue( 55 );
	createGraph(); resetCamera();

}
		
function resetCamera()
{
	// CAMERA
	var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
	var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR );
	camera.position.set( 2 * xMax, 0.5 * yMax, 4 * zMax );
	camera.up = new THREE.Vector3( 0, 0, 1 );
	camera.lookAt( scene.position );	
	scene.add( camera );
	
	controls = new THREE.TrackballControls( camera, renderer.domElement );
	THREEx.WindowResize( renderer, camera );

}

function animate() 
{
	
	requestAnimationFrame( animate );
	render();		
	update();

}

function update()
{
	
	if ( keyboard.pressed( "z" ) ) 
	{ 
		// do something
	}
	
	controls.update();
	stats.update();

}

function render() 
{
	
	renderer.render( scene, camera );

}

