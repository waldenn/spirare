//var object = [];

var Game = function(){
  this.foo = 123;
}

Game.prototype.init = function(){
  ground = new Physijs.BoxMesh(
    new THREE.CubeGeometry( 1000, 1, 1000 ),
    Physijs.createMaterial( new THREE.MeshBasicMaterial( { color: 0x888888 } ),
    groundFriction, groundRestitution ),
    0
  );

  ground.name = "ground";
  ground.position.set( 0, 0, 0 );
  scene.add( ground );

  this.createBowlingPins( 0, 3, 0, 10, 4 );

  ball = new Physijs.SphereMesh(
    new THREE.SphereGeometry( 2, 10, 10 ),
    new THREE.MeshNormalMaterial(),
    1
  );

  ball.position.set( 0, 3, 20 );
  scene.add( ball );
  ball.applyCentralImpulse( new THREE.Vector3( 0, 0, - 100 ) );
}

Game.prototype.createBowlingPins = function( firstPinPositionX, firstPinPositionY, firstPinPositionZ, spacing, rows ) {

 for ( var i = 1; i <= rows; i ++ ) {

   var even = ( i % 2 == 0 );

   for ( var nPins = 0; nPins < i; nPins ++ ) {

     if ( even ) var offset = ( i / 2 * spacing ) - spacing / 2;
     if ( ! even ) var offset = ( i / 2 - 0.5 ) * spacing;
     var pin = new Physijs.BoxMesh( new THREE.CubeGeometry( 2, 5, 2 ), new THREE.MeshNormalMaterial(), 0.1 );
     pin.position.set( offset - nPins * spacing, firstPinPositionY, i * - spacing );
     scene.add( pin );

   }
 }
}
