function MapLoaderIndexeddb(options,cb){
	this.booting = true;

	this.options = fn.combindOver({
		dbName: 'map-'+Math.round(Math.random()*1000),
	},options);

	this.db = new Dexie(this.options.dbName);
	this.db.version(this.dbVersion)
		.stores({
			map: '',
			chunks: 'id,position,data'
		});

	this.db.open().finally(function(){
		this.booting = false;
		if(cb) cb();
	}.bind(this));

	this.db.on('error',function(err){
		console.log(err);
	});
}
MapLoaderIndexeddb.prototype = {
	dbVersion: 1.1,
	booting: false,
	db: undefined,
	options: {},
	loadChunk: function(position,cb){
		this.db.chunks.get(position.toString(),function(data){
			if(data){
				if(typeof data.data == 'string'){
					data.data = JSON.parse(data.data);
					this.db.chunks.put({
						id: position.toString(),
						position: position,
						data: data.data
					})
				}
				data = data.data;
			}
			if(cb) cb(data);
		}.bind(this))
	},
	saveChunk: function(chunk,cb){
		this.db.chunks.put({
			id: chunk.position.toString(),
			position: chunk.position,
			data: chunk.exportData()
		}).finally(function(){
			if(cb) cb();
		});
	},
	exportData: function(cb,progress){ //export the hole map as json
		var json = {
			name: 'error',
			desc: 'error',
			chunks: []
		}
		var i = 0;
		this.db.chunks.count(function(numberOfChunks){
			this.db.chunks.each(function(chunk){
				if(progress) progress((i/numberOfChunks)*100);

				for(var i in chunk.data){
					chunk.data[i] = chunk.data[i].id;
				}

				json.chunks.push(chunk);

				i++;
			}.bind(this)).finally(function(){
				if(progress) progress(100);
				if(cb) cb(json);
			})
		}.bind(this));
	},
	inportData: function(data,cb,progress){
		var json = (typeof data == 'string')? JSON.parse(data) : data;
		var func = function(i){
			if(progress) progress((i/json.chunks.length) * 100);

			var chunk = json.chunks[i];
			var pos = new THREE.Vector3().set(chunk.position.x,chunk.position.y,chunk.position.z);
			this.db.chunks.put({
				id: pos.toString(),
				position: pos,
				data: chunk.data
			});

			if(++i < json.chunks.length){
				setTimeout(func.bind(this,i),1);
			}
			else{
				if(cb) cb();
			}
		}
		func.bind(this)(0);
	}
};