/*
	Three.js "tutorials by example"
	Author: Lee Stemkoski
	Date: July 2013 (three.js v59dev)
*/

// standard global variables
var container, scene, camera, renderer, controls, stats;
var keyboard = new THREEx.KeyboardState();
var clock = new THREE.Clock();

var presetFunction = 'preset5';

var hash = window.location.hash;

//console.log(hash.substr( 1, 9 ));

if ( hash.substr( 1, 9 ) === 'equation=' ) {
	//console.log( hash.substr(10) );
	presetFunction = hash.substr(10);
}

//if ( hash.substr( 1, 6 ) === 'scene=' ) file = hash.substr( 7 );

// custom global variables
var gui, gui_zText, gui_yText, gui_xText,
	gui_xMin, gui_xMax, gui_yMin, gui_yMax,
	gui_a, gui_b, gui_c, gui_d,
	gui_segments;

var xFuncText = "i";
var xFunc = Parser.parse(xFuncText).toJSFunction( ['i'] );

var yFuncText = "i";
var yFunc = Parser.parse(yFuncText).toJSFunction( ['i'] );

var zFuncText = "i";
var zFunc = Parser.parse(zFuncText).toJSFunction( ['i'] );

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

var particles;
var line;

init();
animate();

function init() 
{
	// SCENE
	scene = new THREE.Scene();

	// CAMERA
	var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
	var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;

	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
	scene.add(camera);
	camera.position.set(0,150,400);
	camera.lookAt(scene.position);	

	// RENDERER
	if ( Detector.webgl )
		renderer = new THREE.WebGLRenderer( {antialias:true} );
	else
		renderer = new THREE.CanvasRenderer(); 
	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
	container = document.getElementById( 'ThreeJS' );
	container.appendChild( renderer.domElement );

	// EVENTS
	THREEx.WindowResize(renderer, camera);
	THREEx.FullScreen.bindKey({ charCode : 'f'.charCodeAt(0) });

	// CONTROLS
	controls = new THREE.TrackballControls( camera, renderer.domElement );

	// STATS
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '0px';
	stats.domElement.style.zIndex = 100;
	container.appendChild( stats.domElement );

	// LIGHT
	var light = new THREE.PointLight(0xffffff);
	light.position.set(0,250,0);
	scene.add(light);
	// SKYBOX/FOG
	// scene.fog = new THREE.FogExp2( 0x888888, 0.00025 );
	
	// wireframe for xy-plane
	var wireframeMaterial = new THREE.MeshBasicMaterial( { wireframe: true, transparent: true } ); 

	//grid xy
	// http://danni-three.blogspot.be/2013/09/threejs-helpers.html
	var gridXY = new THREE.GridHelper(300, 10);
	gridXY.rotation.x = Math.PI/2;
	gridXY.position.set(0,0,0);
	gridXY.setColors( new THREE.Color(0xff0000), new THREE.Color(0xffffff) );
	scene.add(gridXY);

	//grid xz
	//var gridXZ = new THREE.GridHelper(10, 1);
	//scene.add(gridXZ);

	scene.add( new THREE.AxisHelper(20) );
	
	var normMaterial = new THREE.MeshNormalMaterial;
	var shadeMaterial = new THREE.MeshLambertMaterial( { color: 0xff0000 } );
	
	// "wireframe texture"
	var wireTexture = new THREE.ImageUtils.loadTexture( 'images/square.png' );
	wireTexture.wrapS = wireTexture.wrapT = THREE.RepeatWrapping; 
	wireTexture.repeat.set( 40, 40 );
	wireMaterial = new THREE.MeshBasicMaterial( { map: wireTexture, vertexColors: THREE.VertexColors, side:THREE.DoubleSide } );

	var vertexColorMaterial  = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } );

	// bgcolor
	renderer.setClearColor( 0x888888, 1 );

	// GUI SETUP
	gui = new dat.GUI();
	
	parameters = 
	{
		resetCam:  function() { resetCamera(); },	
		preset1:   function() { preset1(); },
		preset2:   function() { preset2(); },
		preset3:   function() { preset3(); },
		preset4:   function() { preset4(); },
		preset5:   function() { preset5(); },
		graphFunc: function() { createGraph(); },
		finalValue: 337
	};

	// GUI -- equation
	gui_xText = gui.add( this, 'xFuncText' ).name('x = f(i) = ');
	gui_yText = gui.add( this, 'yFuncText' ).name('y = f(i) = ');
	gui_zText = gui.add( this, 'zFuncText' ).name('z = f(i) = ');
	gui_xMin = gui.add( this, 'xMin' ).name('x Minimum = ');
	gui_xMax = gui.add( this, 'xMax' ).name('x Maximum = ');
	gui_yMin = gui.add( this, 'yMin' ).name('y Minimum = ');
	gui_yMax = gui.add( this, 'yMax' ).name('y Maximum = ');
	gui_segments = gui.add( this, 'segments' ).name('Subdivisions = ');

	// GUI -- parameters
	var gui_parameters = gui.addFolder('Parameters');
	a = b = c = d = 0.01;
	gui_a = gui_parameters.add( this, 'a' ).min(-100).max(100).step(1).name('a = ');
	gui_a.onChange( function(value) { createGraph(); } );
	gui_b = gui_parameters.add( this, 'b' ).min(-5).max(5).step(0.01).name('b = ');
	gui_b.onChange( function(value) { createGraph(); } );
	gui_c = gui_parameters.add( this, 'c' ).min(-5).max(5).step(0.01).name('c = ');
	gui_c.onChange( function(value) { createGraph(); } );
	gui_d = gui_parameters.add( this, 'd' ).min(-200).max(200).step(1).name('d = ');
	gui_d.onChange( function(value) { createGraph(); } );
	gui_a.setValue(1);
	gui_b.setValue(1);
	gui_c.setValue(1);
	gui_d.setValue(1);

	// GUI -- preset equations
	var gui_preset = gui.addFolder('Preset equations');
	gui_preset.add( parameters, 'preset1' ).name('Butterfly');
	gui_preset.add( parameters, 'preset2' ).name('Circle');
	gui_preset.add( parameters, 'preset3' ).name('Twisted math');
	gui_preset.add( parameters, 'preset4' ).name('Amoeboid');
	gui_preset.add( parameters, 'preset5' ).name('To Infinity');

	gui.add( parameters, 'resetCam' ).name("Reset Camera");
	gui.add( parameters, 'graphFunc' ).name("Graph Function");	

	//preset1();
	window[presetFunction]()
}

// http://stackoverflow.com/questions/20738386/how-to-create-a-three-js-3d-line-series-with-width-and-thickness

function createGraph()
{
	xRange = xMax - xMin;
	yRange = yMax - yMin;
	xFunc = Parser.parse(xFuncText).toJSFunction( ['i'] );
	yFunc = Parser.parse(yFuncText).toJSFunction( ['i'] );
	zFunc = Parser.parse(zFuncText).toJSFunction( ['i'] );

	if (particles) {
		scene.remove( particles );
		//scene.remove( line );
	}
	if (line) {
		scene.remove( line );
	}

	// draw lines
	geometry = new THREE.Geometry();
	colors = [];

	for (var i = d*-1; i < d; i++) {

		colors[i] = new THREE.Color(1, 1, 1);
		colors[i].setHSL(1000 / 2000, 1, 0.5);

		var material = new THREE.PointCloudMaterial({
			size: 3,
			color: new THREE.Color("rgb(100,255,100)"),
			transparent: true,
			useScreenCoordinates: false
		});

		var vertex = new THREE.Vector3();
		
		var max = 50;
		var min = -50;

		vertex.x = xFunc(i);
		vertex.y = yFunc(i);
		vertex.z = zFunc(i);

		geometry.vertices.push(vertex);

	}

	var m = new THREE.LineBasicMaterial( { color : 0x0000ff } );
	line = new THREE.Line(geometry, m);
	scene.add(line);

	particles = new THREE.PointCloud(geometry, material);
	particles.sortParticles = true;
	scene.add(particles);

}

function preset1()
{
	gui_xText.setValue("a*sin(i)");
	gui_yText.setValue("i+a");
	gui_zText.setValue("i*cos(i)");

	gui_xMin.setValue(-50); gui_xMax.setValue(50);
	gui_yMin.setValue(-50); gui_yMax.setValue(50);
	gui_a.setValue(4);
	gui_b.setValue(1);
	gui_c.setValue(1);
	gui_d.setValue(200);
	gui_segments.setValue(55);
	createGraph();
	resetCamera();
}

function preset2()
{
	gui_xText.setValue("a*sin(i*(2*PI/d))");
	gui_yText.setValue("a*cos(i*(2*PI/d))");
	gui_zText.setValue("0");

	gui_xMin.setValue(-50); gui_xMax.setValue(50);
	gui_yMin.setValue(-50); gui_yMax.setValue(50);
	gui_a.setValue(4);
	gui_b.setValue(1);
	gui_c.setValue(1);
	gui_d.setValue(200);
	gui_segments.setValue(55);
	createGraph();
	resetCamera();
}

function preset3()
{
	gui_xText.setValue("a*sin(i*c)");
	gui_yText.setValue("i/b+a");
	gui_zText.setValue("a*cos(i*c)");

	gui_xMin.setValue(-50); gui_xMax.setValue(50);
	gui_yMin.setValue(-50); gui_yMax.setValue(50);
	gui_a.setValue(6);
	gui_b.setValue(5);
	gui_c.setValue(2.5);
	gui_d.setValue(200);
	gui_segments.setValue(55);
	createGraph();
	resetCamera();
}

function preset4()
{
	gui_xText.setValue("a*sin(i*c)");
	gui_yText.setValue("(a*cos(i*c)) * (a*sin(i*c))");
	gui_zText.setValue("a*cos(i*c)");

	gui_xMin.setValue(-50); gui_xMax.setValue(50);
	gui_yMin.setValue(-50); gui_yMax.setValue(50);
	gui_a.setValue(6);
	gui_b.setValue(5);
	gui_c.setValue(2.5);
	gui_d.setValue(200);
	gui_segments.setValue(55);
	createGraph();
	resetCamera();
}

function preset5()
{
	gui_xText.setValue("a*sin(i*c)");
	gui_yText.setValue("(a*cos(i*c)) * (a*sin(i*c))");
	gui_zText.setValue("a*cos(i*c) * a*sin(c)");

	gui_xMin.setValue(-50); gui_xMax.setValue(50);
	gui_yMin.setValue(-50); gui_yMax.setValue(50);
	gui_a.setValue(5);
	gui_b.setValue(0.07);
	gui_c.setValue(1.18);
	gui_d.setValue(200);
	gui_segments.setValue(55);
	createGraph();
	resetCamera();
}
	
		
function resetCamera()
{
	// CAMERA
	var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
	var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
	camera.position.set( 2*xMax, 0.5*yMax, 4*zMax);
	camera.up = new THREE.Vector3( 0, 0, 1 );
	camera.lookAt(scene.position);	
	scene.add(camera);
	
	controls = new THREE.TrackballControls( camera, renderer.domElement );
	THREEx.WindowResize(renderer, camera);
}

function animate() 
{
    requestAnimationFrame( animate );
	render();		
	update();
}

function update()
{
	if ( keyboard.pressed("z") ) 
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
