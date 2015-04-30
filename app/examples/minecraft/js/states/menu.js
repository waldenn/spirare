//this file handles the scene/update/rendering of the menu
menu = {
	container: undefined,
	enabled: false,
	enable: function(){
		this.modal.maps.selected(-1);
		this.modal.menu('main');
	},
	disable: function(){

	},

	scene: undefined,
	camera: undefined,
	map: undefined,
	mouse: {
		x: 0,
		y: 0
	},
	init: function(cb){
		//set up state
		this.container = $('#menu');

		this.container.mousemove(function(event) {
			this.mouse.x = ( event.clientX - window.innerWidth/2 );
			this.mouse.y = ( event.clientY - window.innerHeight/2 );
		}.bind(this));

		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera( 20, window.innerWidth / window.innerHeight, 1, 10000 );
		this.camera.position.z = 1800;

		this.map = new Map(this,this.scene,{});

		this.setUpScene();

		$(window).resize(function(event) {
			this.camera.aspect = window.innerWidth / window.innerHeight;
			this.camera.updateProjectionMatrix();
		}.bind(this));
	},
	setUpScene: function(){
		light = new THREE.DirectionalLight( 0xffffff );
		light.position.set( 1, 1, 1 );
		this.scene.add( light );

		$.ajax({
			url: 'data/menuScene.json',
			type: 'GET',
			dataType: 'json'
		})
		.done(function(data){
			data.size = new THREE.Vector3().copy(data.size);
			data.offset = new THREE.Vector3().copy(data.offset);
			this.map.inportMapData(data);
		}.bind(this))
	},
	update: function(dtime){
		this.animate(dtime);
		this.render(dtime);
	},
	animate: function(dtime){
		this.camera.position.x += ( this.mouse.x - this.camera.position.x ) * 0.05;
		this.camera.position.y += ( - this.mouse.y - this.camera.position.y ) * 0.05;
		this.camera.lookAt( this.scene.position );
	},
	render: function(dtime,rtt){
		renderer.setClearColor(0x2b3e50, 1);

		renderer.clear();
		renderer.render(this.scene, this.camera);
	},
	modal: {
		menu: 'main',
		settings: {
			graphics: {
				viewRangeRange: [2,8],
				viewRange: 3,
			}
		},
		maps: {
			maps: [],
			selected: -1,
			create: {
				name: '',
				desc: '',
				submit: function(){
					menu.modal.maps.createMap(this);
					this.name('');
					this.desc('');
				}
			},
			edit: {
				name: '',
				desc: '',
				submit: function(){
					var self = menu.modal.maps;
					var map = self.maps()[self.selected()];
					if(map){
						map.name = this.name();
						map.desc = this.desc();
						settingsDB.maps.update(map.id,map);
						this.name('');
						this.desc('');
						self.loadMaps();
					}
					$('#edit-map-modal').modal('hide');
				}
			},
			download: {
				progress: 0,
				downloadLink: '',
				downloadName: '',
				download: function(map){
					var self = menu.modal.maps.download;
					var mapLoader = new MapLoaderIndexeddb({
						dbName: map.dbName
					});

					mapLoader.exportData(function(json){
						json.name = map.name;
						json.desc = map.desc;
						var str = JSON.stringify(json);
						self.downloadLink('data:text/json,'+str);
						self.downloadName(map.name);
					},function(val){
						self.progress(val);
					})
				}
			},
			upload: {
				progress: 0,
				upload: function(self,event){
					event.preventDefault();
					readfiles(event.target.files,function(data){
						try{
							data = JSON.parse(data);

							//put map in map list
							var map = {
								id: '',
								name: data.name,
								desc: data.desc,
								dbName: '',
								createDate: Date(),
								settings: {}
							}
							map.id = Math.round(Math.random() * 1000000);
							map.dbName = 'block-script-map:' + map.id;
							settingsDB.maps.put(map);

							//create map db and put data in
							var mapLoader = new MapLoaderIndexeddb({
								dbName: map.dbName
							})
							mapLoader.inportData(data);

							menu.modal.maps.loadMaps();
						}
						catch(e){
							console.log('failed to upload map')
							console.log(e);
						}

						$('#upload-map-modal').modal('hide');
					})
					event.target.value = null;
				}
			},
			createMap: function(data){
				var map = {
					id: '',
					name: '',
					desc: '',
					dbName: '',
					createDate: Date(),
					settings: {}
				}

				for(var i in data){
					if(i == 'submit') continue;
					if(typeof data[i] == 'function'){
						map[i] = data[i]();
					}
					else{
						map[i] = data[i];
					}
				}

				map.id = Math.round(Math.random() * 1000000);
				map.dbName = 'block-script-map:' + map.id;

				//save it
				settingsDB.maps.put(map);

				menu.modal.maps.loadMaps();

				$('#new-map-modal').modal('hide');
			},
			playMap: function(index){
				var self = menu.modal.maps;
				var map = self.maps()[self.selected()];

				if(index !== undefined) map = self.maps()[index];

				states.enableState('game');
				game.requestPointerLock();
				game.loadMap(map);
			},
			deleteMap: function(){
				var map = this.maps()[this.selected()];
				this.selected(-1);
				//remove the maps DB
				new Dexie(map.dbName).delete();
				settingsDB.maps.delete(map.id);
				this.loadMaps();
				$('#delete-map-modal').modal('hide');
			},
			editMap: function(){
				var self = menu.modal.maps;
				var map = self.maps()[self.selected()];
				self.edit.name(map.name);
				self.edit.desc(map.desc);
				$('#edit-map-modal').modal('show');
			},
			downloadMap: function(){
				var self = menu.modal.maps;
				var map = self.maps()[this.selected()];
				self.download.download(map);
				$('#download-map-modal').modal('show');
			},
			uploadMap: function(){
				$('#upload-map-modal').modal('show');
			},
			loadMaps: function(cb){
				settingsDB.maps.toArray(function(a){
					for(var i in a){
						a[i].createDate = new Date(a[i].createDate);
					}
					menu.modal.maps.maps(a);
					if(cb) cb();
				});
			}
		}
	}
}

states.addState('menu',menu);