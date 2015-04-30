ChunkGeneratorBlank = function(){
}
ChunkGeneratorBlank.prototype = {
	levels: [],
	generateChunk: function(position,cb){
		var data = [];

		for (var i = 0; i < game.chunkSize*game.chunkSize*game.chunkSize; i++) {
			data.push('air');
		};	

		if(cb) cb(data);
	}
}
ChunkGeneratorBlank.prototype.constructor = ChunkGeneratorBlank;

ChunkGeneratorHills = function(options){
	this.options = fn.combindOver({
		width: 200,
		height: 200,
		levels: [],
	},options);

	var size = this.options.width * this.options.height;

	var z = 0;
	for (var k = 0; k < this.options.levels.length; k++) {
		var quality = this.options.levels[k].quality || 2;

		var data = [];
		var perlin = new ImprovedNoise();
		for ( var j = 0; j < 4; j ++ ) {
			if ( j == 0 ) for ( var i = 0; i < size; i ++ ) data[ i ] = 0;
			for ( var i = 0; i < size; i ++ ) {
				var x = i % this.options.width, y = ( i / this.options.width ) | 0;
				data[ i ] += perlin.noise( x / quality, y / quality, z ) * quality;
			}
			quality *= 4
		}

		this.levels[k] = data;
		
		z+=this.options.levels[k].height;
	};
}
ChunkGeneratorHills.prototype = {
	levels: [],
	generateChunk: function(position,cb){
		var data = [];

		for (var i = 0; i < game.chunkSize*game.chunkSize*game.chunkSize; i++) {
			var pos = indexToPosition(i,game.chunkSize).add(position.clone().multiplyScalar(game.chunkSize));
			var lvls = this.getY(pos.x,pos.z);

			var f = false;
			for (var k = 0; k < lvls.length; k++) {
				if(pos.y < lvls[k]){
					var a = 0;
					for (var j = 0; j < this.options.levels[k].blocks.length; j++) {
						a += this.options.levels[k].blocks[j].height;
						if(lvls[k] - pos.y <= a){
							f = true;
							data.push(this.options.levels[k].blocks[j].block);
							break;
						}
					};
					break;
				}
			};
			if(!f){
				data.push('air');
			}
		};	

		if(cb) cb(data);
	},
	getY: function(x, z) {
		var lvls = [];
		for (var i = 0; i < this.levels.length; i++) {
			lvls.push((this.levels[i][ x + z * this.options.width ] * 0.2 ) | 0);
		};
		return lvls;
	}
}
ChunkGeneratorHills.prototype.constructor = ChunkGeneratorHills;

RoomGenerator = function(){}
RoomGenerator.prototype = {
	levels: [],
	generateChunk: function(position,cb){
		var data = [];

		for (var i = 0; i < game.chunkSize*game.chunkSize*game.chunkSize; i++) {
			var pos = indexToPosition(i,game.chunkSize)//.add(position.clone().multiplyScalar(game.chunkSize));

			if(pos.x == 0 || pos.y == 0 || pos.z == 0){
				if(pos.y < 3 && pos.y > 0 && (pos.x == 5 || pos.z == 5)){
					data.push('air');
				}
				else{
					data.push('stone');
				}
			}
			else{
				data.push('air');
			}
		};	

		if(cb) cb(data);
	}
}
RoomGenerator.prototype.constructor = RoomGenerator;

FladGenerator = function(){}
FladGenerator.prototype = {
	levels: [],
	generateChunk: function(position,cb){
		var data = [];

		for (var i = 0; i < game.chunkSize*game.chunkSize*game.chunkSize; i++) {
			var pos = indexToPosition(i,game.chunkSize).add(position.clone().multiplyScalar(game.chunkSize));

			if(pos.y < 10){
				data.push('stone');
			}
			else{
				data.push('air');
			}
		};	

		if(cb) cb(data);
	}
}
FladGenerator.prototype.constructor = FladGenerator;