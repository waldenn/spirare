var renderer, settingsDB;
var clock = new THREE.Clock();

function initDB(cb){
	//set up map settingsDB
	settingsDB = new Dexie('block-script-settings');
	settingsDB.version(1)
		.stores({
			maps: 'id,name,desc,dbName,createDate,settings'
		});

	settingsDB.open().finally(function(){
		console.log('opened db')
		if(cb) cb();
	}.bind(this));

	settingsDB.on('error',function(err){
		console.log(err);
	});
}

$(document).ready(function() {
	if(!Detector.webgl){
		Detector.addGetWebGLMessage();
	}

	//create renderer
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.autoClear = false;
	$('body').prepend(renderer.domElement);

	$(window).resize(function(event) {
		renderer.setSize( window.innerWidth, window.innerHeight );
	}.bind(this));

	initDB(function(){
		blocks.init(function(){
			states.init();

			//start loop
			states.update();
			
			$('body').fadeIn(500);
			states.enableState('menu');
		});
	});

	//load sound
	createjs.Sound.registerSounds(sounds, audioPath);

	//show menu
	$(document).on('contextmenu',function(event){
		event.preventDefault();
	})

	//dont allow the user to drag images
	$(document).on('dragstart','img',function(event){
		event.preventDefault();
		return false;
	})

	$('form.no-action').submit(function(event){
		event.preventDefault();
	})

	$(document).on('dragend',function(event){
		event.preventDefault();
	})
	$(document).on('drop','.drop-zone',function(event){
		event.preventDefault();
	})
	$(document).on('dragover','.drop-zone',function(event){
		$(this).addClass('hover');
		event.stopPropagation();
		return true;
	})
	$(document).on('dragover',function(){
		$('.drop-zone').removeClass('hover');
		return false;
	})
});

function readfiles(files, callback) {
	// for(var i=0; i < files.length; i++){
	// 	previewfile(files[i],callback);
	// }
	if(files[0]){
		previewfile(files[0],callback);
	}
}

function previewfile(file, callback) {
	var reader = new FileReader();
	reader.onload = function(event) {
		if (callback) {
			callback(event.target.result);
		}
	};
	reader.readAsText(file);
}

if (!(function f() {}).name) {
    Object.defineProperty(Function.prototype, 'name', {
        get: function() {
            var name = this.toString().match(/^\s*function\s*(\S*)\s*\(/)[1];
            // For better performance only parse once, and then cache the
            // result through a new accessor for repeated access.
            Object.defineProperty(this, 'name', { value: name });
            return name;
        }
    });
}