// @see http://paulirish.com/2011/requestanimationframe-for-smart-animating/
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       || 
		  window.webkitRequestAnimationFrame || 
		  window.mozRequestAnimationFrame    || 
		  window.oRequestAnimationFrame      || 
		  window.msRequestAnimationFrame     || 
		  function(/* function */ callback, /* DOMElement */ element){
			window.setTimeout(callback, 1000 / 60);
		  };
})();

// set the inner-window size
var WIDTH = window.innerWidth; 
var HEIGHT = window.innerHeight; 
var h = window.innerHeight; 

// set some camera attributes
var VIEW_ANGLE = 45,
	ASPECT = WIDTH / HEIGHT,
	NEAR = 0.1,
	FAR = 10000;

// get the DOM element to attach to
// - assume we've got jQuery to hand
var $container = $('#container');

// create a WebGL renderer, camera
// and a scene
var renderer = new THREE.WebGLRenderer();
var camera = new THREE.Camera(  VIEW_ANGLE,
								ASPECT,
								NEAR,
								FAR  );
var scene = new THREE.Scene();

// the camera starts at 0,0,0 so pull it back
camera.position.z = 300;

// start the renderer
renderer.setSize(WIDTH, HEIGHT);

// attach the render-supplied DOM element
$container.append(renderer.domElement);

var attributes = {
	displacement: {
		type: 'f', // a float
		value: [] // an empty array
	}
};

var uniforms = {
	amplitude: {
		type: 'f', // a float
		value: 0
	}
};

// create the sphere's material
var shaderMaterial = new THREE.MeshShaderMaterial({
	uniforms:     	uniforms,
	attributes:     attributes,
	vertexShader:   $('#vertexshader').text(),
	fragmentShader: $('#fragmentshader').text()
});

// set up the sphere vars
// console.log( Math.min(WIDTH, HEIGHT ) );
var radius = Math.min(HEIGHT/10, WIDTH/10 ), segments = 5, rings = 7;

// create a new mesh with sphere geometry -
// we will cover the sphereMaterial next!
var sphere = new THREE.Mesh(
   new THREE.Sphere(radius, segments, rings),
   shaderMaterial);
   
// now populate the array of attributes
var vertices = sphere.geometry.vertices;
var values = attributes.displacement.value

for (var v = 0; v < vertices.length; v++) {
	values.push(Math.random() * 15);
}

// add the sphere to the scene
scene.addChild(sphere);

window.addEventListener( 'resize', onWindowResize, false );

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

    }


var frame = 0;

// draw!
function update() {

	uniforms.amplitude.value = Math.sin(frame);
	frame += 0.1;

	renderer.render(scene, camera);
	
	// set up the next call
	requestAnimFrame(update);
}
requestAnimFrame(update);
