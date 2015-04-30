function positionToIndex(position,size){
	if(size instanceof THREE.Vector3){
		return (position.z*size.x*size.y)+(position.y*size.x)+position.x;
	}
	else return (position.z*size*size)+(position.y*size)+position.x;
}
function indexToPosition(index,size){
	var position = new THREE.Vector3(0,0,0);
	if(size instanceof THREE.Vector3){
		position.z = Math.floor(index/(size.x*size.y));
		position.y = Math.floor((index-(position.z*(size.x*size.y)))/size.x);
		position.x = index-(position.y*size.x)-(position.z*size.x*size.y);
	}
	else{
		position.z = Math.floor(index/(size*size));
		position.y = Math.floor((index-(position.z*(size*size)))/size);
		position.x = index-(position.y*size)-(position.z*size*size);
	}
	return position;
}
function observable(val,cb){
	o = ko.observable(val);
	o.subscribe(cb);
	return o;
}
THREE.Vector3.prototype.sign = function(){
	Math.sign(this.x);
	Math.sign(this.y);
	Math.sign(this.z);
	return this;
}
THREE.Vector3.prototype.empty = function(){
	return this.x === 0 && this.y === 0 && this.z === 0;
}
THREE.Vector3.prototype.split = function(dirs){
	if(!dirs){
		//4
		var a = [];
		if(this.x!==0) a.push(new THREE.Vector3(this.x,0,0));
		if(this.y!==0) a.push(new THREE.Vector3(0,this.y,0));
		if(this.z!==0) a.push(new THREE.Vector3(0,0,this.z));
		return a;
	}
	else{
		//8
	}
}
THREE.Vector3.prototype.toString = function(){
	return this.x+'|'+this.y+'|'+this.z;
}

THREE.Object3D.prototype.getMaterialById = function(a) {
    return this.getMaterialByProperty("id", a)
},
THREE.Object3D.prototype.getMaterialByName = function(a) {
    return this.getMaterialByProperty("name", a)
},
THREE.Object3D.prototype.getMaterialByProperty = function(a, b) {
	if(this.material){
	    if (this.material[a] === b){
	        return this.material;
	    }
	}
    for (var c = 0, d = this.children.length; c < d; c++) {
        var e = this.children[c].getMaterialByProperty(a, b);
        if (void 0 !== e)
            return e
    }
}

THREE.Object3D.prototype.getTextureById = function(a) {
    return this.getTextureByProperty("id", a)
},
THREE.Object3D.prototype.getTextureByName = function(a) {
    return this.getTextureByProperty("name", a)
},
THREE.Object3D.prototype.getTextureByProperty = function(a, b) {
	if(this.material){
	    if (this.material[a] === b){
	        return this.material;
	    }
	}
    for (var c = 0, d = this.children.length; c < d; c++) {
        var e = this.children[c].getTextureByProperty(a, b);
        if (void 0 !== e)
            return e
    }
}