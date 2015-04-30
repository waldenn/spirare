//this file handles the scene/update/rendering of the editor
editor = {
	container: undefined,
	enabled: false,
	enable: function(){

	},
	disable: function(){

	},

	scene: undefined,
	camera: undefined,
	renderer: undefined,
	init: function(){
		//set up state
		this.container = $('#editor');
		
	}
}

states.addState('editor',editor);