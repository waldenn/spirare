/*-------JSHint Directives-------*/
/* global THREE                  */
/* global THREEx                 */
/* global $:false                */
/*-------------------------------*/
'use strict';


/***************************************************************
* Global Variables and Settings
***************************************************************/
var containerID = '#canvas-body';
var scene, camera, renderer;
var keyboard = new THREEx.KeyboardState();
var clock = new THREE.Clock();
var fov = 45;
var zoomX = 0;
var zoomY = 20;
var zoomZ = 40;

// Example figure
var movingFigure;
var pixelsPerSec = 30;
var rotationSteed = 1.2;


/***************************************************************
* Custom User Functions
***************************************************************/
function basicFloorGrid(lines, steps, gridColor) {
  lines = lines || 40;
  steps = steps || 2;
  gridColor = gridColor || 0xFFFFFF;
  var floorGrid = new THREE.Geometry();
  var gridLine = new THREE.LineBasicMaterial( {color: gridColor} );
  for (var i = -lines; i <= lines; i += steps) {
    floorGrid.vertices.push(new THREE.Vector3(-lines, 0, i));
    floorGrid.vertices.push(new THREE.Vector3( lines, 0, i));
    floorGrid.vertices.push(new THREE.Vector3( i, 0, -lines));
    floorGrid.vertices.push(new THREE.Vector3( i, 0, lines));
  }
  return new THREE.Line(floorGrid, gridLine, THREE.LinePieces);
}

function simpleBox(figureSize, figureColor) {
  figureSize  = figureSize  || 4;
  figureColor = figureColor || 0xDADADA;
  var figureGeometry = new THREE.BoxGeometry(figureSize, figureSize, figureSize);
  var figureMaterial = new THREE.MeshLambertMaterial({color: 0xcccccc});
  var boxFigure = new THREE.Mesh(figureGeometry, figureMaterial);
  boxFigure.position.set(0, figureSize/2, 0);
  return boxFigure;
}

function updateMovingFigure() {
  var delta = clock.getDelta();
  var moveDistance = pixelsPerSec * delta;
  var rotationAngle = Math.PI / rotationSteed * delta;

  // Basic rotation
  if (keyboard.pressed('w') || keyboard.pressed('up') ) {
    movingFigure.translateZ(-moveDistance);
  }
  if (keyboard.pressed('s') || keyboard.pressed('down') ) {
    movingFigure.translateZ(moveDistance);
  }
  if (keyboard.pressed('a') || keyboard.pressed('left') ) {
    movingFigure.rotation.y += rotationAngle;
  }
  if (keyboard.pressed('d') || keyboard.pressed('right') ) {
    movingFigure.rotation.y -= rotationAngle;
  }

  // Adjust chase camera
  var relativeCameraOffset = new THREE.Vector3(zoomX, zoomY, zoomZ);
  var cameraOffset = relativeCameraOffset.applyMatrix4( movingFigure.matrixWorld );
  camera.position.x = cameraOffset.x;
  camera.position.y = cameraOffset.y;
  camera.position.z = cameraOffset.z;
  camera.lookAt( movingFigure.position );
}

/***************************************************************
* Helper Functions Declarations
***************************************************************/
function renderScene() {
  renderer.render( scene, camera );
}

function animateScene() {
  window.requestAnimationFrame( animateScene );
  renderScene();
  updateMovingFigure();
}

function resizeWindow() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderScene();
}


/***************************************************************
* Scene Initialization
***************************************************************/
function initializeScene() {

  // Scene and resize listener
  scene = new THREE.Scene();
  var canvasWidth  = window.innerWidth;
  var canvasHeight = window.innerHeight;
  window.addEventListener( 'resize', resizeWindow, false );

  // Camera and initial view
  var aspectRatio  = canvasWidth/canvasHeight;
  camera = new THREE.PerspectiveCamera(fov, aspectRatio, 0.01, 3000);
  camera.position.set(zoomX, zoomY, zoomZ);
  camera.lookAt(scene.position);
  scene.add(camera);

  // WebGL renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(canvasWidth, canvasHeight);
  $(containerID).append(renderer.domElement);

  // Ambient light
  var lightAmbient = new THREE.AmbientLight(0x5a5a5a);
  var lightSource = new THREE.PointLight(0x7a7a7a);
  lightSource.position.set(0, 50, -100);
  scene.add(lightAmbient);
  scene.add(lightSource);

  // Starter floor grid
  var floor = basicFloorGrid(60, 4);
  scene.add(floor);

  // Add Movable Cube
  movingFigure = simpleBox();
  scene.add(movingFigure);

}


/***************************************************************
* Render and Animate
***************************************************************/
initializeScene();
animateScene();
