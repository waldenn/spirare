// solid block
var SolidBlock = Block.extend(function SolidBlock(){
	Block.prototype.constructor.apply(this,arguments);
},{
	material: blocks.nullMaterial,
	removeSound: ['digWood1','digWood2','digWood3','digWood4'],
	placeSound: ['digWood1','digWood2','digWood3','digWood4'],
	stepSound: ['stepWood1','stepWood2','stepWood3','stepWood4']
});

var MeshBlock = Block.extend(function MeshBlock(){
	Block.prototype.constructor.apply(this,arguments);

	this.mesh.position.copy(this.position).multiplyScalar(game.blockSize).add(new THREE.Vector3(1,1,1).multiplyScalar(game.blockSize/2));
	this.chunk.group.add(this.mesh);
},{
	dispose: function(){ //remove mesh
		this.mesh.parent.remove(this.mesh);
	}
})

var GeometryBlock = MeshBlock.extend(function GeometryBlock(){
	this.mesh = new THREE.Mesh(this.geometry,this.material);

	MeshBlock.prototype.constructor.apply(this,arguments);
},{
	geometry: new THREE.BoxGeometry(game.blockSize,game.blockSize,game.blockSize),
	material: blocks.nullMaterial,
	mesh: undefined
})

var ModalBlock = MeshBlock.extend(function ModalBlock(){
	this.mesh = this.mesh.clone();
	MeshBlock.prototype.constructor.apply(this,arguments);
},{
	modal: '',
	mesh: undefined //this is set by the loadModals function of the blocks
})

//XMesh
var matrix,s = game.blockSize;
var geo = new THREE.PlaneGeometry(Math.sqrt(s*s+s*s), s);
matrix = new THREE.Matrix4().makeRotationX(THREE.Math.degToRad(90)).makeRotationY(THREE.Math.degToRad(45));
geo.applyMatrix(matrix);
var geo2 = new THREE.PlaneGeometry(Math.sqrt(s*s+s*s), s);
matrix = new THREE.Matrix4().makeRotationX(THREE.Math.degToRad(90)).makeRotationY(THREE.Math.degToRad(-45));
geo2.applyMatrix(matrix);
geo.merge(geo2);

geo.verticesNeedUpdate = true;
geo.elementsNeedUpdate = true;
geo.uvsNeedUpdate = true;
geo.computeFaceNormals();
var XMeshBlock = GeometryBlock.extend(function XMeshBlock(){
	GeometryBlock.prototype.constructor.apply(this,arguments);

	if(this.material !== blocks.nullMaterial){
		this.material.transparent = true;
		this.material.side = THREE.DoubleSide;
	}
},{
	geometry: geo
});

//collision block
var CollisionBlock = SolidBlock.extend(function CollisionBlock(){
	SolidBlock.prototype.constructor.apply(this,arguments);
},{
	_collision: new CollisionEntity({
		box: new THREE.Box3(new THREE.Vector3(0,0,0), new THREE.Vector3(game.blockSize,game.blockSize,game.blockSize)),
		group: 'block'
	})
});
Object.defineProperties(CollisionBlock.prototype,{
	collision: {
		get: function(){
			var col = this._collision;
			col.position.copy(this.worldPosition.multiplyScalar(game.blockSize));
			return col;
		}
	}
})