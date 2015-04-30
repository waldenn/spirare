//for handles game states, mainly menu, game, editor and maybe store
var deltaTime = new Date();
states = {
	states: {},
	events: new Events(),
	activeState: undefined,
	baseModal: {
		toggle: function(ob){
			return _.partial(function(ob){
				ob(!ob());
			},ob);
		},
		increase: function(ob,amount){
			return _.partial(function(ob,amount){
				amount = amount || 1;
				ob(ob()+amount);
			},ob,amount);
		},
		decrease: function(ob,amount){
			return _.partial(function(ob,amount){
				amount = amount || 1;
				ob(ob()-amount);
			},ob,amount);
		},
		combind: _.compose,
		set: function(ob,amount){
			return _.partial(function(ob,amount){
				ob(amount);
			},ob,amount);
		}
	},
	init: function(){
		//start up all states
		for (var i in this.states) {
			var state = this.states[i];
			state.init();

			//bindings
			fn.combindOver(state.modal,this.baseModal);
			state.modal = ko.mapping.fromJS(state.modal);
			ko.applyBindings(state.modal,state.container.get(0));
		};
		this.disableAllStates(true);
	},
	update: function(){ //update loop for the active state
		var dtime = deltaTime.getMilliseconds() - new Date().getMilliseconds();
		dtime = dtime / (1000/60);
		deltaTime = new Date();
		requestAnimationFrame(this.update.bind(this));
		if(this.activeState){
			this.activeState.update(dtime);
		}
	},
	enableState: function(name,dontFade){
		this.disableAllStates();

		this.states[name].enabled = true;
		if(!dontFade){
			this.states[name].container.fadeIn() 
		}
		else{
			this.states[name].container.show();
		}
		this.states[name].enable();
		this.activeState = this.states[name];
		this.events.emit('stateEnabled',this.states[name]);
	},
	disableState: function(name,dontFade){
		this.states[name].enabled = false;
		if(!dontFade){
			this.states[name].container.fadeOut() 
		}
		else{
			this.states[name].container.hide();
		}
		this.states[name].disable();
		this.events.emit('stateDisabled',this.states[name]);
	},
	disableAllStates: function(dontFade){
		for (var i in this.states) {
			this.disableState(i,dontFade);
		};
		this.activeState = undefined;
	},
	addState: function(name,state){
		this.states[name] = state;
		this.events.emit('stateAdded',this.states[name]);
	}
}