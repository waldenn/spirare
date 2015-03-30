// global variables
var renderer;
var scene;
var camera;

var uniforms = {};
var control;

function init() {

	// create a scene, that will hold all our elements such as objects, cameras and lights.
	scene = new THREE.Scene();

	// create a camera, which defines where we're looking at.
	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

	// create a render, sets the background color and the size
	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(0x000000, 1.0);
	renderer.setSize(window.innerWidth, window.innerHeight);

	// reuse the fragment shader stuff from the lambert material
	var basicShader = THREE.ShaderLib['basic'];

	uniforms = THREE.UniformsUtils.merge([basicShader.uniforms]);
	var texture = THREE.ImageUtils.loadTexture('debug.png');
	uniforms['map'].value = texture;
	uniforms.delta = {type: 'f', value: 0.0};
	uniforms.scale = {type: 'f', value: 1.0};

	// since we use a texture, we need to inform three.js
	var defines = {};
	defines["USE_MAP"] = "";
	var material = new THREE.ShaderMaterial({
		defines: defines,
		uniforms: uniforms,
		vertexShader: document.
				getElementById('sinusVertexShader').text,
		fragmentShader: basicShader.fragmentShader
	});

	// create a cube and add to scene
	var cubeGeometry = new THREE.BoxGeometry(5, 5, 5);

	var cube = new THREE.Mesh(cubeGeometry, material);
	cube.name = 'cube';
	scene.add(cube);

	// position and point the camera to the center of the scene
	camera.position.x = 15;
	camera.position.y = 16;
	camera.position.z = 13;
	camera.lookAt(scene.position);

	// add the output of the renderer to the html element
	document.body.appendChild(renderer.domElement);

	control = new function () {
		this.rotationSpeed = 0.005;
		this.scale = 1;
	};
	addControls(control);

	// call the render function
	render();
}

function addControls(controlObject) {
	var gui = new dat.GUI();
	gui.add(controlObject, 'rotationSpeed', -0.1, 0.1);
	gui.add(controlObject, 'scale', 0.01, 2);
}

function render() {
	renderer.render(scene, camera);
	scene.getObjectByName('cube').rotation.x += control.rotationSpeed;
	scene.getObjectByName('cube').scale.set(control.scale, control.scale, control.scale);

	uniforms.delta.value += 0.001;

	requestAnimationFrame(render);
}

// calls the init function when the window is done loading.
window.onload = init;
