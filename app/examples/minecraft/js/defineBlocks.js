(function(){

//air
var Air = Block.extend(function Air(){
	Block.prototype.constructor.apply(this,arguments);
}).add();

//dirt
var Dirt = CollisionBlock.extend(function Dirt(){
	CollisionBlock.prototype.constructor.apply(this,arguments);
},{
	inventoryTab: 'default',
	material: blocks.util.basicMaterial('dirt.png'),
	removeSound: ['digGravel1','digGravel2','digGravel3','digGravel4'],
	placeSound: ['digGravel1','digGravel2','digGravel3','digGravel4'],
	stepSound: ['stepGravel1','stepGravel2','stepGravel3','stepGravel4']
}).add();

//grass
var Grass = CollisionBlock.extend(function Grass(){
	CollisionBlock.prototype.constructor.apply(this,arguments);
},{
	inventoryTab: 'default',
	material: [ //x,y,z | +/-
		[
			blocks.util.basicMaterial('grass_side.png'),
			blocks.util.basicMaterial('grass_side.png')
		],
		[
			blocks.util.basicMaterial('grass_top.png'),
			blocks.util.basicMaterial('dirt.png')
		],
		[
			blocks.util.basicMaterial('grass_side.png'),
			blocks.util.basicMaterial('grass_side.png')
		]
	],
	removeSound: ['digGrass1','digGrass2','digGrass3','digGrass4'],
	placeSound: ['digGrass1','digGrass2','digGrass3','digGrass4'],
	stepSound: ['stepGrass1','stepGrass2','stepGrass3','stepGrass4']
}).add();

//wood
var WoodPlanks = CollisionBlock.extend(function WoodPlanks(){
	CollisionBlock.prototype.constructor.apply(this,arguments);
},{
	inventoryTab: 'default',
	removeSound: ['digWood1','digWood2','digWood3','digWood4'],
	placeSound: ['digWood1','digWood2','digWood3','digWood4'],
	stepSound: ['stepWood1','stepWood2','stepWood3','stepWood4']
});

var WoodPlanksOak = WoodPlanks.extend(function WoodPlanksOak(){
	WoodPlanks.prototype.constructor.apply(this,arguments);
},{
	material: blocks.util.basicMaterial('planks_oak.png'),
}).add();

var WoodPlanksBirch = WoodPlanks.extend(function WoodPlanksBirch(){
	WoodPlanks.prototype.constructor.apply(this,arguments);
},{
	material: blocks.util.basicMaterial('planks_birch.png'),
}).add();

var WoodPlanksJungle = WoodPlanks.extend(function WoodPlanksJungle(){
	WoodPlanks.prototype.constructor.apply(this,arguments);
},{
	material: blocks.util.basicMaterial('planks_jungle.png'),
}).add();

var WoodPlanksSpruce = WoodPlanks.extend(function WoodPlanksSpruce(){
	WoodPlanks.prototype.constructor.apply(this,arguments);
},{
	material: blocks.util.basicMaterial('planks_spruce.png'),
}).add();

//log
var Log = CollisionBlock.extend(function Log(){
	CollisionBlock.prototype.constructor.apply(this,arguments);
},{
	inventoryTab: 'default',
	removeSound: ['digWood1','digWood2','digWood3','digWood4'],
	placeSound: ['digWood1','digWood2','digWood3','digWood4'],
	stepSound: ['stepWood1','stepWood2','stepWood3','stepWood4']
});

var LogOak = Log.extend(function LogOak(){
	Log.prototype.constructor.apply(this,arguments);
},{
	material: [
		[
			blocks.util.basicMaterial('log_oak.png'),
			blocks.util.basicMaterial('log_oak.png')
		],
		[
			blocks.util.basicMaterial('log_oak_top.png'),
			blocks.util.basicMaterial('log_oak_top.png')
		],
		[
			blocks.util.basicMaterial('log_oak.png'),
			blocks.util.basicMaterial('log_oak.png')
		]
	]
}).add();

var LogBirch = Log.extend(function LogBirch(){
	Log.prototype.constructor.apply(this,arguments);
},{
	material: [
		[
			blocks.util.basicMaterial('log_birch.png'),
			blocks.util.basicMaterial('log_birch.png')
		],
		[
			blocks.util.basicMaterial('log_birch_top.png'),
			blocks.util.basicMaterial('log_birch_top.png')
		],
		[
			blocks.util.basicMaterial('log_birch.png'),
			blocks.util.basicMaterial('log_birch.png')
		]
	]
}).add();

var LogJungle = Log.extend(function LogJungle(){
	Log.prototype.constructor.apply(this,arguments);
},{
	material: [
		[
			blocks.util.basicMaterial('log_jungle.png'),
			blocks.util.basicMaterial('log_jungle.png')
		],
		[
			blocks.util.basicMaterial('log_jungle_top.png'),
			blocks.util.basicMaterial('log_jungle_top.png')
		],
		[
			blocks.util.basicMaterial('log_jungle.png'),
			blocks.util.basicMaterial('log_jungle.png')
		]
	]
}).add();

var LogSpruce = Log.extend(function LogSpruce(){
	Log.prototype.constructor.apply(this,arguments);
},{
	material: [
		[
			blocks.util.basicMaterial('log_spruce.png'),
			blocks.util.basicMaterial('log_spruce.png')
		],
		[
			blocks.util.basicMaterial('log_spruce_top.png'),
			blocks.util.basicMaterial('log_spruce_top.png')
		],
		[
			blocks.util.basicMaterial('log_spruce.png'),
			blocks.util.basicMaterial('log_spruce.png')
		]
	]
}).add();

//stone
var Stone = CollisionBlock.extend(function Stone(){
	CollisionBlock.prototype.constructor.apply(this,arguments);
},{
	inventoryTab: 'default',
	material: blocks.util.basicMaterial('stone.png'),
	removeSound: ['digStone1','digStone2','digStone3','digStone4'],
	placeSound: ['digStone1','digStone2','digStone3','digStone4'],
	stepSound: ['stepStone1','stepStone2','stepStone3','stepStone4']
}).add();

var StoneBrick = CollisionBlock.extend(function StoneBrick(){
	CollisionBlock.prototype.constructor.apply(this,arguments);
},{
	inventoryTab: 'default',
	material: blocks.util.basicMaterial('stonebrick.png'),
	removeSound: ['digStone1','digStone2','digStone3','digStone4'],
	placeSound: ['digStone1','digStone2','digStone3','digStone4'],
	stepSound: ['stepStone1','stepStone2','stepStone3','stepStone4']
}).add();

var StoneBrickMossy = CollisionBlock.extend(function StoneBrickMossy(){
	CollisionBlock.prototype.constructor.apply(this,arguments);
},{
	inventoryTab: 'default',
	material: blocks.util.basicMaterial('stonebrick_mossy.png'),
	removeSound: ['digStone1','digStone2','digStone3','digStone4'],
	placeSound: ['digStone1','digStone2','digStone3','digStone4'],
	stepSound: ['stepStone1','stepStone2','stepStone3','stepStone4']
}).add();

var Bricks = CollisionBlock.extend(function Bricks(){
	CollisionBlock.prototype.constructor.apply(this,arguments);
},{
	inventoryTab: 'default',
	material: blocks.util.basicMaterial('brick.png'),
	removeSound: ['digStone1','digStone2','digStone3','digStone4'],
	placeSound: ['digStone1','digStone2','digStone3','digStone4'],
	stepSound: ['stepStone1','stepStone2','stepStone3','stepStone4']
}).add();

var EndStone = CollisionBlock.extend(function EndStone(){
	CollisionBlock.prototype.constructor.apply(this,arguments);
},{
	inventoryTab: 'default',
	material: blocks.util.basicMaterial('end_stone.png'),
	removeSound: ['digStone1','digStone2','digStone3','digStone4'],
	placeSound: ['digStone1','digStone2','digStone3','digStone4'],
	stepSound: ['stepStone1','stepStone2','stepStone3','stepStone4']
}).add();

var AnvilBase = CollisionBlock.extend(function AnvilBase(){
	CollisionBlock.prototype.constructor.apply(this,arguments);
},{
	inventoryTab: 'default',
	material: blocks.util.basicMaterial('anvil_base.png')
}).add();

var IronBrock = CollisionBlock.extend(function IronBrock(){
	CollisionBlock.prototype.constructor.apply(this,arguments);
},{
	inventoryTab: 'default',
	material: blocks.util.basicMaterial('iron_block.png')
}).add();

var quartz = CollisionBlock.extend(function quartz(){
	CollisionBlock.prototype.constructor.apply(this,arguments);
},{
	inventoryTab: 'default',
	material: blocks.util.basicMaterial('quartz_block_side.png'),
	removeSound: ['digStone1','digStone2','digStone3','digStone4'],
	placeSound: ['digStone1','digStone2','digStone3','digStone4'],
	stepSound: ['stepStone1','stepStone2','stepStone3','stepStone4']
}).add();

var BookShelf = CollisionBlock.extend(function BookShelf(){
	CollisionBlock.prototype.constructor.apply(this,arguments);
},{
	inventoryTab: 'default',
	material: [
		[
			blocks.util.basicMaterial('bookshelf.png'),
			blocks.util.basicMaterial('bookshelf.png')
		],
		[
			blocks.util.basicMaterial('planks_oak.png'),
			blocks.util.basicMaterial('planks_oak.png')
		],
		[
			blocks.util.basicMaterial('bookshelf.png'),
			blocks.util.basicMaterial('bookshelf.png')
		]
	],
	removeSound: ['digWood1','digWood2','digWood3','digWood4'],
	placeSound: ['digWood1','digWood2','digWood3','digWood4'],
	stepSound: ['stepWood1','stepWood2','stepWood3','stepWood4']
}).add();

var SandStone = CollisionBlock.extend(function SandStone(){
	CollisionBlock.prototype.constructor.apply(this,arguments);
},{
	inventoryTab: 'default',
	material: [ //x,y,z | +/-
		[
			blocks.util.basicMaterial('sandstone_normal.png'),
			blocks.util.basicMaterial('sandstone_normal.png')
		],
		[
			blocks.util.basicMaterial('sandstone_top.png'),
			blocks.util.basicMaterial('sandstone_bottom.png')
		],
		[
			blocks.util.basicMaterial('sandstone_normal.png'),
			blocks.util.basicMaterial('sandstone_normal.png')
		]
	],
	removeSound: ['digStone1','digStone2','digStone3','digStone4'],
	placeSound: ['digStone1','digStone2','digStone3','digStone4'],
	stepSound: ['stepStone1','stepStone2','stepStone3','stepStone4']
}).add();

var Hay = CollisionBlock.extend(function Hay(){
	CollisionBlock.prototype.constructor.apply(this,arguments);
},{
	inventoryTab: 'default',
	material: [ //x,y,z | +/-
		[
			blocks.util.basicMaterial('hay_block_side.png'),
			blocks.util.basicMaterial('hay_block_side.png')
		],
		[
			blocks.util.basicMaterial('hay_block_top.png'),
			blocks.util.basicMaterial('hay_block_top.png')
		],
		[
			blocks.util.basicMaterial('hay_block_side.png'),
			blocks.util.basicMaterial('hay_block_side.png')
		]
	],
	removeSound: ['digGrass1','digGrass2','digGrass3','digGrass4'],
	placeSound: ['digGrass1','digGrass2','digGrass3','digGrass4'],
	stepSound: ['stepGrass1','stepGrass2','stepGrass3','stepGrass4']
}).add();

//GrassMesh
var GrassMesh = ModalBlock.extend(function GrassMesh(){
	ModalBlock.prototype.constructor.apply(this,arguments);
},{
	inventoryTab: 'default',
	modal: blocks.util.loadModal('grass'),
	placeSound: ['digGrass1','digGrass2','digGrass3','digGrass4'],
	removeSound: ['digGrass1','digGrass2','digGrass3','digGrass4'],

	onload: function(){
		this.inventoryImage = this.modal.replace('.dae','.png');
	}
}).add();

var Torch = ModalBlock.extend(function Torch(){
	ModalBlock.prototype.constructor.apply(this,arguments);
},{
	inventoryTab: 'default',
	modal: blocks.util.loadModal('torch'),
	placeSound: ['wood1','wood2','wood3','wood4'],
	removeSound: ['wood1','wood2','wood3','wood4'],

	onload: function(){
		this.inventoryImage = this.modal.replace('.dae','.png');

		var mat = this.mesh.getMaterialByName('torch')
		mat.side = THREE.DoubleSide
		mat.transparent = true;
	}
}).add();

//flowers
var Flower = XMeshBlock.extend(function Flower(){
	XMeshBlock.prototype.constructor.apply(this,arguments);
},{
	inventoryTab: 'default',
	placeSound: ['digGrass1','digGrass2','digGrass3','digGrass4'],
	removeSound: ['digGrass1','digGrass2','digGrass3','digGrass4'],

	onload: function(){
		this.inventoryImage = this.material.map.sourceFile;
	}
});
var FlowerAllium = Flower.extend(function FlowerAllium(){
	Flower.prototype.constructor.apply(this,arguments);
},{
	material: blocks.util.basicMaterial('flower_allium.png')
}).add();
var FlowerBlueOrchid = Flower.extend(function FlowerBlueOrchid(){
	Flower.prototype.constructor.apply(this,arguments);
},{
	material: blocks.util.basicMaterial('flower_blue_orchid.png')
}).add();
var FlowerDandelion = Flower.extend(function FlowerDandelion(){
	Flower.prototype.constructor.apply(this,arguments);
},{
	material: blocks.util.basicMaterial('flower_dandelion.png')
}).add();
var FlowerHoustonia = Flower.extend(function FlowerHoustonia(){
	Flower.prototype.constructor.apply(this,arguments);
},{
	material: blocks.util.basicMaterial('flower_houstonia.png')
}).add();
var FlowerOxeyeDaisy = Flower.extend(function FlowerOxeyeDaisy(){
	Flower.prototype.constructor.apply(this,arguments);
},{
	material: blocks.util.basicMaterial('flower_oxeye_daisy.png')
}).add();
var FlowerPaeonia = Flower.extend(function FlowerPaeonia(){
	Flower.prototype.constructor.apply(this,arguments);
},{
	material: blocks.util.basicMaterial('flower_paeonia.png')
}).add();
var FlowerRose = Flower.extend(function FlowerRose(){
	Flower.prototype.constructor.apply(this,arguments);
},{
	material: blocks.util.basicMaterial('flower_rose.png')
}).add();
var FlowerTulipOrange = Flower.extend(function FlowerTulipOrange(){
	Flower.prototype.constructor.apply(this,arguments);
},{
	material: blocks.util.basicMaterial('flower_tulip_orange.png')
}).add();
var FlowerTulipPink = Flower.extend(function FlowerTulipPink(){
	Flower.prototype.constructor.apply(this,arguments);
},{
	material: blocks.util.basicMaterial('flower_tulip_pink.png')
}).add();
var FlowerTulipRed = Flower.extend(function FlowerTulipRed(){
	Flower.prototype.constructor.apply(this,arguments);
},{
	material: blocks.util.basicMaterial('flower_tulip_red.png')
}).add();
var FlowerTulipWhite = Flower.extend(function FlowerTulipWhite(){
	Flower.prototype.constructor.apply(this,arguments);
},{
	material: blocks.util.basicMaterial('flower_tulip_white.png')
}).add();

//mushroom
var Mushroom = XMeshBlock.extend(function Mushroom(){
	XMeshBlock.prototype.constructor.apply(this,arguments);
},{
	inventoryTab: 'default',
	placeSound: ['digCloth1','digCloth2','digCloth3','digCloth4'],
	removeSound: ['digCloth1','digCloth2','digCloth3','digCloth4'],

	onload: function(){
		this.inventoryImage = this.material.map.sourceFile;
	}
})
var MushroomRed = Mushroom.extend(function MushroomRed(){
	Mushroom.prototype.constructor.apply(this,arguments);
},{
	material: blocks.util.basicMaterial('mushroom_red.png')
}).add();
var MushroomBrown = Mushroom.extend(function MushroomBrown(){
	Mushroom.prototype.constructor.apply(this,arguments);
},{
	material: blocks.util.basicMaterial('mushroom_brown.png')
}).add();


})();