"use strict";

function Level() {
	this.scene = new Physijs.Scene;

	this.scene.add(this.genLane());

	const pins = this.genPins(new THREE.Vector3(0, -0.4, 0), 0.3, 4);
	for(let i = 0; i < pins.length; i++) {
		this.scene.add(pins[i]);
	}
}

Level.prototype.genPins = function( startPosition, spacing, rows ) {
	let offset = 0;
	const pins = [];
	for(let i = 1; i <= rows; i++) {
		const even = (i % 2 == 0);
		for(let nPins = 0; nPins < i; nPins++) {
			if(even) offset = (i / 2 * spacing) - spacing / 2;
			if(!even) offset = (i / 2 - 0.5) * spacing;

      const pin = this.createPin();
      pin.position.set( startPosition.x + (offset - nPins * spacing), startPosition.y, startPosition.z + (i * - spacing ));
			pin.name = "pin";

			pins.push(pin);
		}
	}
	return pins;
}

Level.prototype.createPin = function() {
  const base = new Physijs.CylinderMesh( new THREE.CylinderGeometry( 0.057277, 0.03556, 0.085725, 8 ), Physijs.createMaterial(new THREE.MeshNormalMaterial(), 0, 1), 1);

  const middle = new Physijs.CylinderMesh(new THREE.CylinderGeometry(0.057277, 0.057277, 0.0635, 8), new THREE.MeshNormalMaterial());
  middle.position.y = 0.074;

  const top = new Physijs.CylinderMesh(new THREE.CylinderGeometry(0.0249555, 0.057277, 0.0889, 8), new THREE.MeshNormalMaterial());
  top.position.y = 0.15;

  const neck = new Physijs.CylinderMesh(new THREE.CylinderGeometry(0.0249555, 0.0249555, 0.0381, 8), new THREE.MeshNormalMaterial());
  neck.position.y = 0.213;
                                                                                            //Correct length is 0.066675 but looked weird
  const ballStand = new Physijs.CylinderMesh(new THREE.CylinderGeometry(0.0323469, 0.0249555, 0.046675, 8), new THREE.MeshNormalMaterial());
  ballStand.position.y = 0.245;

  const ball = new Physijs.SphereMesh(new THREE.SphereGeometry(0.0323469, 8, 8), new THREE.MeshNormalMaterial());
  ball.position.y = 0.2695;

  base.add(middle);
  base.add(top);
  base.add(neck);
  base.add(ballStand);
  base.add(ball);

  return base;
}

Level.prototype.genLane = function() {
  const laneFriction = 100, laneRestitution = 0.1;
  const lane = new Physijs.BoxMesh(new THREE.BoxGeometry(1.0541, 0.1, 18.28800), Physijs.createMaterial(new THREE.MeshNormalMaterial(), laneFriction, laneRestitution), 0);
  lane.position.y = -0.5;

  const invisibleWallRight = new Physijs.BoxMesh(new THREE.BoxGeometry(0.1, 1, 18.28800), Physijs.createMaterial(new THREE.MeshNormalMaterial(), 1, 0), 0);
  invisibleWallRight.position.x = 0.805;
  invisibleWallRight.position.y = 0.5;
  invisibleWallRight.visible = false;

	const invisibleWallLeft = new Physijs.BoxMesh(new THREE.BoxGeometry(0.1, 1, 18.28800), Physijs.createMaterial(new THREE.MeshNormalMaterial(), 1, 0), 0);
  invisibleWallLeft.position.x = -0.805;
  invisibleWallLeft.position.y = 0.5;
  invisibleWallLeft.visible = false;

	//lane.add(gutter1Left);
	lane.add(this.createGutter(new THREE.Vector3(0.641, -0.0228, 0)));
	lane.add(this.createGutter(new THREE.Vector3(-0.641, -0.0228, 0)));
	lane.add(invisibleWallRight);
	lane.add(invisibleWallLeft);

	return lane;
}

Level.prototype.createGutter = function(position) {
	const gutterMiddle = new Physijs.BoxMesh(new THREE.BoxGeometry(0.1, 0.01, 18.28800), Physijs.createMaterial(new THREE.MeshNormalMaterial(), 1, 0), 0);
	gutterMiddle.position.x = position.x;
	gutterMiddle.position.y = position.y;
	gutterMiddle.position.z = position.z;

	const gutterLeft = new Physijs.BoxMesh(new THREE.BoxGeometry(0.1, 0.01, 18.28800), Physijs.createMaterial(new THREE.MeshNormalMaterial(), 1, 0), 0);
	gutterLeft.position.x = -0.082;
	gutterLeft.position.y = 0.034;
	gutterLeft.rotation.z = -Math.PI / 4;
	gutterMiddle.add(gutterLeft);

	const gutterRight = new Physijs.BoxMesh(new THREE.BoxGeometry(0.1, 0.01, 18.28800), Physijs.createMaterial(new THREE.MeshNormalMaterial(), 1, 0), 0);
	gutterRight.position.x = 0.082;
	gutterRight.position.y = 0.034;
	gutterRight.rotation.z = Math.PI / 4;
	gutterMiddle.add(gutterRight);

	return gutterMiddle;
}
