var missingErrors = {};
blocks = {
	blocks: {},
	textureFolder: 'res/img/blocks/',
	modalFolder: 'res/modals/',
	nullMaterial: new THREE.MeshNormalMaterial(),
	blockMaterial: undefined,
	init: function(cb){
		done = _.after(2,function(){
			for(var i in this.blocks){ //going to have to create a function that loops through the blocks and loads them
				this.blocks[i].prototype.onload();
			}

			if(cb) cb();
		}.bind(this));
		this.loadTextures(done);
		this.loadModals(done);
	},
	loadTextures: function(cb){
		var materials = [
			this.nullMaterial
		];

		for (var i in this.blocks) {
			var block = this.blocks[i].prototype;

			if(!(block instanceof SolidBlock)) continue;

			if(_.isArray(block.material)){
				for (var k = 0; k < 3; k++) {
					if(!block.material[k]) block.material[k] = [];

					for (var j = 0; j < 2; j++) {
						if(block.material[k][j]){
							if(materials.indexOf(block.material[k][j]) == -1){
								block.material[k][j] = materials.push(block.material[k][j]) -1;
							}
							else{
								block.material[k][j] = materials.indexOf(block.material[k][j]);
							}
						}
						else{
							block.material[k][j] = 0;
						}
					};
				};	
			}
			else{
				var mat = materials.push(block.material) -1;
				block.material = [[mat,mat],[mat,mat],[mat,mat]];
			}
		};
		this.blockMaterial = new THREE.MeshFaceMaterial(materials);
		if(cb) cb();
	},
	loadModals: function(cb){
		var blocks = [];
		for (var i in this.blocks) {
			var block = this.blocks[i].prototype;

			if(block instanceof ModalBlock){
				blocks.push(block);
			}
		}

		cb = _.after(blocks.length +1,cb || function(){});
		for (var i in blocks) {
			if(blocks[i].modal !== ''){
				var loader = new THREE.ColladaLoader();
				loader.options.convertUpAxis = true;
				loader.load(blocks[i].modal,function(modal){
					modal = modal.scene;
					this.mesh = modal;
					this.mesh.scale.multiplyScalar(game.blockSize/2);

					//fix the textures
					this.mesh.traverse(function(obj){
						if(obj.material){
							if(obj.material.map){
								obj.material.map.magFilter = THREE.NearestFilter;
			       				obj.material.map.minFilter = THREE.LinearMipMapLinearFilter;
							}
						}
					});

					cb();
				}.bind(blocks[i]))
			}
			else{
				cb();
			}
		};
		cb();
	},
	createBlock: function(id,position,data,chunk){
		var block = this.getBlock(id);
		if(block){
			return new block(position,data,chunk);
		}
		else if(!missingErrors[id]){
			missingErrors[id] = true;
			console.error('missing block: '+id);
			return this.createBlock('air',position,data,chunk);
		}
	},

	getBlock: function(id){
		return this.blocks[id.toLowerCase()];
	},
	addBlock: function(block){
		var id = block.name
		if(this.getBlock(id)){
			console.error('block with id: '+id.toLowerCase()+' already exists');
			return;
		}
		this.blocks[id.toLowerCase()] = block;
	},
	removeBlock: function(block){
		if(typeof block == 'string') block = this.getBlock(block);
		if(block){
			var name = block.name
			if(this.blocks[name]){
				delete this.blocks[name.toLowerCase()];
			}
		}
	},

	extend: function(init,proto,extend){
		extend = extend || this.Block;
		init = init || function(){};

		init.prototype = proto
		init.prototype.__proto__ = extend.prototype;
		init.prototype.constructor = init;

		return init;
	},
	util: {
		// textureCache: {},
		loadTexture: function(url,prop,dontmap){ //texture image is not copied
			var tex;
			// if(this.textureCache[url]){
			// 	if(prop){
			// 		tex = this.textureCache[url].clone(this.textureCache[url]);

			//         //set the prop
			//         for(var i in prop){
			//         	tex[i] = prop[i];
			//         }
			// 	}
			// 	else{
			// 		tex = this.textureCache[url];
			// 	}
			// }
			// else{
		       	tex = new THREE.ImageUtils.loadTexture(blocks.textureFolder+url);
		       	if(!dontmap){
			        tex.magFilter = THREE.NearestFilter;
			        tex.minFilter = THREE.LinearMipMapLinearFilter;
			    }

		        if(prop){
			        //set the prop
			        for(var i in prop){
			        	tex[i] = prop[i];
			        }
		        }
			// }

	        return tex;
		},
		materialCache: {},
		basicMaterial: function(url,prop,texProp){
			var mat;
			if(this.materialCache[url]){
				if(prop){
					mat = this.materialCache[url].clone();

			        //set the prop
			        for(var i in prop){
			        	mat[i] = prop[i];
			        }
				}
				else{
					mat = this.materialCache[url];
				}
			}
			else{
				mat = this.materialCache[url] = new THREE.MeshLambertMaterial({
					map: this.loadTexture(url,texProp),
					reflectivity: 0
				});

				if(prop){
			        //set the prop
			        for(var i in prop){
			        	mat[i] = prop[i];
			        }
				}
			}

			return mat;
		},
		advancedMaterial: function(url,prop,texProp){
			var mat;
			if(this.materialCache[url]){
				if(prop){
					mat = this.materialCache[url].clone();

			        //set the prop
			        for(var i in prop){
			        	mat[i] = prop[i];
			        }
				}
				else{
					mat = this.materialCache[url];
				}
			}
			else{
				mat = this.materialCache[url] = new THREE.MeshPhongMaterial({
					map: this.loadTexture(url,texProp),
					bumpMap: this.loadTexture(url,texProp),
					reflectivity: 0
				});

				if(prop){
			        //set the prop
			        for(var i in prop){
			        	mat[i] = prop[i];
			        }
				}
			}

			return mat;
		},
		loadModal: function(url){
			return blocks.modalFolder + url + '/' + url + '.dae';
		}
	}
}

var Block = function(position,data,chunk){
	this.position = position || new THREE.Vector3();
	this.chunk = chunk;

	this.inportData(data);
}
Block.prototype = {
	chunk: undefined,
	position: new THREE.Vector3(0,0,0),
	visible: true,
	inventoryTab: '',
	inventoryImage: '',
	placeSound: [],
	removeSound: [],
	stepSound: [],

	inportData: function(data){
		//nothing for now
	},
	exportData: function(){
		return {
			id: this.__proto__.constructor.name //get the name of the class
		};
	},
	replace: function(block,dontBuild){
		if(!_.isString(block)) console.error('first argument needs to be a block id');

		var newBlock = this.chunk.setBlock(this.position,block,true);
		if(!dontBuild){
			this.chunk.build()
			var v = this.edge;
			if(!v.empty()){
				v = v.split();
				for (var i = 0; i < v.length; i++) {
					var chunk = this.chunk.getNeighbor(v[i]);
					if(chunk) chunk.build();
				};
			}
		}

		return newBlock;
	},
	dispose: function(){
		delete this; //free myself from memory
	},
	getNeighbor: function(v){
        if(_.isArray(v)) v = new THREE.Vector3().fromArray(v);
		v.sign();
		var pos = v.clone().add(this.position);

       	var chunk = this.chunk;
        if(pos.x < 0 || pos.y < 0 || pos.z < 0 || pos.x >= game.chunkSize || pos.y >= game.chunkSize || pos.z >= game.chunkSize){
        	chunk = chunk.getNeighbor(v.clone());
        	if(!chunk) return; //dont go any futher if we can find the chunk
        }

        if(this.edge){
	        if(pos.x < 0) pos.x=9;
	        if(pos.y < 0) pos.y=9;
	        if(pos.z < 0) pos.z=9;
	        if(pos.x >= game.chunkSize) pos.x=0;
			if(pos.y >= game.chunkSize) pos.y=0;
			if(pos.z >= game.chunkSize) pos.z=0;
        }

        return chunk.getBlock(pos);
	},

	//events
	onload: function(){

	},
	onplace: function(){

	},
	onremove: function(){

	}
}
Object.defineProperties(Block.prototype,{
	worldPosition: {
		get: function(){
			return (this.chunk)? this.chunk.position.clone().multiplyScalar(game.chunkSize).add(this.position) : new THREE.Vector3();
		}
	},
	scenePosition: {
		get: function(){
			return this.worldPosition.multiplyScalar(game.blockSize);
		}
	},
	sceneCenter: {
		get: function(){
			return this.scenePosition.add(this.center);
		}
	},
	center: {
		get: function(){
			return new THREE.Vector3(0.5,0.5,0.5).multiplyScalar(game.blockSize);
		}
	},
	edge: {
		get: function(){
			if(!(this.position.x > 0 && this.position.y > 0 && this.position.z > 0 && this.position.x < game.chunkSize-1 && this.position.y < game.chunkSize-1 && this.position.z < game.chunkSize-1)){
				return new THREE.Vector3(
					this.position.x == 0? -1 : (this.position.x == game.chunkSize-1)? 1 : 0, 
					this.position.y == 0? -1 : (this.position.y == game.chunkSize-1)? 1 : 0, 
					this.position.z == 0? -1 : (this.position.z == game.chunkSize-1)? 1 : 0
					);
			}
			return new THREE.Vector3();
		}
	},
	super: {
		get: function(){
			return (this.__proto__ === {}.__proto__)? this.__proto__ : this.__proto__.__proto__;
		}
	}
})
Block.prototype.constructor = Block;

Block.extend = function(init,proto){
	init.prototype = proto || init.prototype;
	init.prototype.__proto__ = this.prototype;
	init.prototype.constructor = init;

	init.extend = this.extend;
	init.add = this.add;
	init.remove = this.remove;

	return init;
}
Block.add = function(){
	blocks.addBlock(this);
	return this;
}
Block.remove = function(){
	blocks.removeBlock(this);
	return this;
}