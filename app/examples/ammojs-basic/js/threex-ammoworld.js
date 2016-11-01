var THREEx = THREEx || {}

/** some links:

  http://www.bulletphysics.org/mediawiki-1.5.8/index.php/Hello_World
  http://bulletphysics.org/Bullet/BulletFull/classbtCollisionWorld.html
  http://bulletphysics.org/Bullet/BulletFull/classbtDispatcher.html#details
  http://bulletphysics.org/Bullet/BulletFull/classbtMultiBodyDynamicsWorld.html
  http://www.bulletphysics.org/mediawiki-1.5.8/index.php/Broadphase
  http://www.bulletphysics.org/mediawiki-1.5.8/index.php?title=BtDbvt_dynamic_aabb_tree
  http://bulletphysics.org/Bullet/BulletFull/classbtCollisionConfiguration.html
  
  http://bulletphysics.org/Bullet/BulletFull/classbtCollisionShape.html  

  http://www.bulletphysics.org/mediawiki-1.5.8/index.php/Stepping_The_World

  http://bulletphysics.org/Bullet/BulletFull/classbtRigidBody.html

  http://bulletphysics.org/Bullet/BulletFull/classbtTransform.html
    http://bulletphysics.org/Bullet/BulletFull/classbtVector3.html 
    http://bulletphysics.org/Bullet/BulletFull/classbtQuaternion.html
    http://bulletphysics.org/Bullet/BulletFull/classbtMatrix3x3.html

  http://www.bulletphysics.org/mediawiki-1.5.8/index.php/MotionStates

 */

THREEx.AmmoWorld = function() {

	this._ammoControls = []

	this._clock = new THREE.Clock();

	var collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
	var dispatcher = new Ammo.btCollisionDispatcher( collisionConfiguration );
	var broadphase = new Ammo.btDbvtBroadphase();
	var solver = new Ammo.btSequentialImpulseConstraintSolver();
	this.physicsWorld = new Ammo.btDiscreteDynamicsWorld( dispatcher, broadphase, solver, collisionConfiguration );

	// gravity
	this.physicsWorld.setGravity( new Ammo.btVector3( 0, - 9.81, 0 ) );

}

////////////////////////////////////////////////////////////////////////////////
//          Code Separator
////////////////////////////////////////////////////////////////////////////////

THREEx.AmmoWorld.prototype.update = function() {

	var deltaTime = this._clock.getDelta();
	// compute physics
	this.physicsWorld.stepSimulation( deltaTime, 10 );

	// update all ammoControls
	var btTransform = new Ammo.btTransform();
	
	for ( var i = 0; i < this._ammoControls.length; i ++ ) {

		var ammoControls = this._ammoControls[ i ];

		var motionState = ammoControls.physicsBody.getMotionState();
		console.assert( motionState )
		motionState.getWorldTransform( btTransform );

		var position = btTransform.getOrigin();
		ammoControls.object3d.position.set( position.x(), position.y(), position.z() );

		var quaternion = btTransform.getRotation();
		ammoControls.object3d.quaternion.set( quaternion.x(), quaternion.y(), quaternion.z(), quaternion.w() );

	}

}

////////////////////////////////////////////////////////////////////////////////
//          Code Separator
////////////////////////////////////////////////////////////////////////////////

THREEx.AmmoWorld.prototype.add = function( ammoControls ) {

	console.assert( ammoControls instanceof THREEx.AmmoControls )

	this.physicsWorld.addRigidBody( ammoControls.physicsBody );

	this._ammoControls.push( ammoControls )

}

THREEx.AmmoWorld.prototype.remove = function( ammoControls ) {

	console.assert( ammoControls instanceof THREEx.AmmoControls )
	ammoWorld.physicsWorld.removeRigidBody( ammoControls.physicsWorld )

}

