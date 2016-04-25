/*-------JSHint Directives-------*/
/* global THREE                  */
/* global THREEx                 */
/* global $:false                */
/*-------------------------------*/
'use strict'


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
var staticCube;
var bboxMoving;
var bboxStatic;
var pixelsPerSec = 10;
var rotationSteed = 1.2;

var goodposition;


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

function simpleSphere(figureSize, figureColor) {
  figureSize  = figureSize  || 4;
  figureColor = figureColor || 0xDADADA;
  var figureGeometry = new THREE.SphereGeometry( 2, 10, 10);
  var figureMaterial = new THREE.MeshLambertMaterial({color: 0x00ff00});
  var boxFigure = new THREE.Mesh(figureGeometry, figureMaterial);
  boxFigure.position.set(0, figureSize/2, 0);
  return boxFigure;
}

function simpleBox(figureSize, figureColor) {
  figureSize  = figureSize  || 4;
  figureColor = figureColor || 0xDADADA;
  var figureGeometry = new THREE.BoxGeometry(figureSize, figureSize, figureSize);
  var figureMaterial = new THREE.MeshNormalMaterial({color: 0x00ff00});
  var boxFigure = new THREE.Mesh(figureGeometry, figureMaterial);
  boxFigure.position.set(0, figureSize/2, 0);
  return boxFigure;
}

function colliding() {
  return AABBIntersect(bboxMoving.box, bboxStatic.box);
}


function updateMovingFigure() {
  var delta = clock.getDelta();
  var moveDistance = pixelsPerSec * delta;
  var rotationAngle = 0.5 * Math.PI / rotationSteed * delta;

  if ( !colliding() ) {
    var goodposition = new THREE.Vector3(0, 0, 0);
    //var goodposition = new THREE.Vector3();
    //goodposition.setFromMatrixPosition( movingFigure.matrixWorld );
  }

  bboxMoving.update();
  bboxStatic.update();

  // Basic rotation
  if (  ( keyboard.pressed('w') && !colliding() ) ) {
    movingFigure.translateZ(-moveDistance);
  }
  else { // colliding, reset position
    movingFigure.position.copy( goodposition ) ;
  }


  if (  ( keyboard.pressed('s') && !colliding() ) ) {
    movingFigure.translateZ(moveDistance);
  }
  if (  ( keyboard.pressed('a') && !colliding() ) ) {
    movingFigure.rotation.y += rotationAngle;
  }
  if (  ( keyboard.pressed('d') && !colliding() ) ) {
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

function AABBIntersect(box1, box2) {
    return (box1.min.x <= box2.max.x && box1.max.x >= box2.min.x) &&
           (box1.min.y <= box2.max.y && box1.max.y >= box2.min.y) &&
           (box1.min.z <= box2.max.z && box1.max.z >= box2.min.z);
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
  staticCube = simpleSphere();
  staticCube.translateX(10);
  staticCube.translateZ(10);
  scene.add(staticCube);

  movingFigure = simpleBox();
  bboxMoving = new THREE.BoundingBoxHelper(movingFigure, 0xff0000);
  bboxStatic = new THREE.BoundingBoxHelper(staticCube, 0xff0000);
  scene.add(movingFigure);
  scene.add(bboxMoving);
  scene.add(bboxStatic);
}


/***************************************************************
* Render and Animate
***************************************************************/
initializeScene();
animateScene();
