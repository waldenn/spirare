CollisionEntity = function(data){
	data = data || {};
	this._box = data.box || new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
	this.position = data.position || new THREE.Vector3();
	this.group = data.group || this.group;
}
CollisionEntity.prototype = {
	group: 'none',
	_box: undefined,
	position: undefined,
	collide: function(collisionEntity){
		return collisions.collide(this,collisionEntity);
	},
    clone: function(){
        return new CollisionEntity({
            box: this._box.clone(),
            position: this.position.clone(),
            group: this.group
        })
    }
}
Object.defineProperties(CollisionEntity.prototype,{
	box: {
		get: function(){
			return this._box.clone().translate(this.position);
		}
	},
	x: {
		get: function(){
			return this.position.x;
		},
		set: function(val){
			return this.position.x = val;
		}
	},
	y: {
		get: function(){
			return this.position.y;
		},
		set: function(val){
			return this.position.y = val;
		}
	},
	z: {
		get: function(){
			return this.position.z;
		},
		set: function(val){
			return this.position.z = val;
		}
	},
	x1: {
		get: function(){
			return this.box.min.x;
		}
	},
	x2: {
		get: function(){
			return this.box.max.x;
		}
	},
	y1: {
		get: function(){
			return this.box.min.y;
		}
	},
	y2: {
		get: function(){
			return this.box.max.y;
		}
	},
	z1: {
		get: function(){
			return this.box.min.z;
		}
	},
	z2: {
		get: function(){
			return this.box.max.z;
		}
	},
	width: {
		get: function(){
			return this._box.max.x - this._box.min.x;
		}
	},
	height: {
		get: function(){
			return this._box.max.y - this._box.min.y;
		}
	},
	depth: {
		get: function(){
			return this._box.max.z - this._box.min.z;
		}
	},
})

collisions = {
	groups: {
		none: [],
		player: ['block'],
		block: []
	},
    checkCollision: function(a,b, velocity){
        if(typeof a == "object" && !(a instanceof CollisionEntity)) a = a.collision;
        if(typeof b == "object" && !(b instanceof CollisionEntity)) b = b.collision;
        if(!a || !b) return false;
        velocity = velocity || new THREE.Vector3();
        a.position.add(velocity);
        var col = ( b.x2<=a.x1||b.x1>=a.x2||b.y2<=a.y1||b.y1>=a.y2||b.z2<=a.z1||b.z1>=a.z2 ? !1 : !0 );
        a.position.sub(velocity);
        return col;
    },
	canCollide: function(a,b){
        if(typeof a == "object" && !(a instanceof CollisionEntity)) a = a.collision;
        if(typeof b == "object" && !(b instanceof CollisionEntity)) b = b.collision;
        if(!a || !b) return false;

		if(this.groups[a.group]){
			return this.groups[a.group].indexOf(b.group) !== -1;
		}
		return false;
	},
    SweptAABB: function(a, b, to){
    	var normal = new THREE.Vector3();
        var invEntry = new THREE.Vector3();
        var invExit = new THREE.Vector3();

        // find the distance between the objects on the near and far sides for both x and y
        if(to.x > 0){
            invEntry.x = b.x1 - a.x2;
            invExit.x = b.x2 - a.x1;
        }
        else{
            invEntry.x = b.x2 - a.x1;
            invExit.x = b.x1 - a.x2;
        }

        if(to.y > 0){
            invEntry.y = b.y1 - a.y2;
            invExit.y = b.y2 - a.y1;
        }
        else{
            invEntry.y = b.y2 - a.y1;
            invExit.y = b.y1 - a.y2;
        }

        if(to.z > 0){
            invEntry.z = b.z1 - a.z2;
            invExit.z = b.z2 - a.z1;
        }
        else{
            invEntry.z = b.z2 - a.z1;
            invExit.z = b.z1 - a.z2;
        }

        // find time of collision and time of leaving for each axis (if statement is to prevent divide by zero)
        var entry = new THREE.Vector3();
        var exit = new THREE.Vector3();

        if (to.x == 0){
            entry.x = -Infinity;
            exit.x = Infinity;
        }
        else{
            entry.x = invEntry.x / to.x;
            exit.x = invExit.x / to.x;
        }

        if (to.y == 0){
            entry.y = -Infinity;
            exit.y = Infinity;
        }
        else{
            entry.y = invEntry.y / to.y;
            exit.y = invExit.y / to.y;
        }

        if (to.z == 0){
            entry.z = -Infinity;
            exit.z = Infinity;
        }
        else{
            entry.z = invEntry.z / to.z;
            exit.z = invExit.z / to.z;
        }

        // find the earliest/latest times of collision
        var entryTime = Math.max(entry.x, entry.y, entry.z);
        var exitTime = Math.min(exit.x, exit.y, exit.z);

        // if there was no collision
        if(entryTime > exitTime || entryTime > 1){ //return if the entryTime is > 1 becuase we dont want to go further then we want to
            return {
            	entryTime: 1,
            	exitTime: Infinity,
            	normal: normal,
            	invEntry: invEntry,
            	invExit: invExit,
            	entry: entry,
            	exit: exit
            };
        }
        else{ // if there was a collision
            // calculate normal of collided surface
            if(entry.y > entry.x && entry.y > entry.z){
                normal.x = 0;
                normal.y = (to.y < 0)? 1 : -1;
                normal.z = 0;
            }
            else if(entry.x > entry.y && entry.x > entry.z){
                normal.x = (to.x < 0)? 1 : -1;
                normal.y = 0;
                normal.z = 0;
            }
            else if(entry.z > entry.x && entry.z > entry.y){
                normal.x = 0;
                normal.y = 0;
                normal.z = (to.z < 0)? 1 : -1;
            }
            else{ //looks like two sides collided at the same time
                if(Math.abs(to.y) < Math.abs(to.x) && Math.abs(to.y) < Math.abs(to.z)){
                    normal.x = 0;
                    normal.y = (to.y < 0)? 1 : -1;
                    normal.z = 0;
                }
                else if(Math.abs(to.x) < Math.abs(to.y) && Math.abs(to.x) < Math.abs(to.z)){
                    normal.x = (to.x < 0)? 1 : -1;
                    normal.y = 0;
                    normal.z = 0;
                }
                else if(Math.abs(to.z) < Math.abs(to.x) && Math.abs(to.z) < Math.abs(to.y)){
                    normal.x = 0;
                    normal.y = 0;
                    normal.z = (to.z < 0)? 1 : -1;
                }
            }

            // return the time of collision
            return {
            	entryTime: entryTime,
            	exitTime: exitTime,
            	normal: normal,
            	invEntry: invEntry,
            	invExit: invExit,
            	entry: entry,
            	exit: exit
            };
        }
    },
    collideWithBlocks: function(a,map){
        var velocity = a.velocity;
        var toGrid = function(vec){
            return vec.divideScalar(game.blockSize).floor();
        }

        var colInfo = {
            entryTime: 1,
            exitTime: Infinity,
            normal: new THREE.Vector3(),
            invEntry: new THREE.Vector3(),
            invExit: new THREE.Vector3(),
            entry: new THREE.Vector3(1,1,1),
            exit: new THREE.Vector3(Infinity,Infinity,Infinity)
        };
        var dist = velocity.length();
        var loops = (dist > 20)? dist / 10 : 1;
        var done = false;

        //test for blocks
        for (var i = 1; i <= loops && done == false; i++) {
            var pos = a.position.clone().add(velocity.clone().divideScalar(loops).multiplyScalar(i));
            //check corners
            var box = a.collision._box.clone().translate(pos);
            var corners = [];

            var v = [];
            if(velocity.y !== 0){
                v.push(toGrid( new THREE.Vector3(box.max.x, box[velocity.y < 0? 'min' : 'max'].y, box.max.z) ));
                v.push(toGrid( new THREE.Vector3(box.max.x, box[velocity.y < 0? 'min' : 'max'].y, box.min.z) ));
                v.push(toGrid( new THREE.Vector3(box.min.x, box[velocity.y < 0? 'min' : 'max'].y, box.max.z) ));
                v.push(toGrid( new THREE.Vector3(box.min.x, box[velocity.y < 0? 'min' : 'max'].y, box.min.z) ));
            }
            if(velocity.x !== 0){
                v.push(toGrid( new THREE.Vector3(box[velocity.x < 0? 'min' : 'max'].x, box.max.y, box.max.z) ));
                v.push(toGrid( new THREE.Vector3(box[velocity.x < 0? 'min' : 'max'].x, box.max.y, box.min.z) ));
                v.push(toGrid( new THREE.Vector3(box[velocity.x < 0? 'min' : 'max'].x, box.min.y, box.max.z) ));
                v.push(toGrid( new THREE.Vector3(box[velocity.x < 0? 'min' : 'max'].x, box.min.y, box.min.z) ));
            }
            if(velocity.z !== 0){
                v.push(toGrid( new THREE.Vector3(box.max.x, box.max.y, box[velocity.z < 0? 'min' : 'max'].z) ));
                v.push(toGrid( new THREE.Vector3(box.min.x, box.max.y, box[velocity.z < 0? 'min' : 'max'].z) ));
                v.push(toGrid( new THREE.Vector3(box.max.x, box.min.y, box[velocity.z < 0? 'min' : 'max'].z) ));
                v.push(toGrid( new THREE.Vector3(box.min.x, box.min.y, box[velocity.z < 0? 'min' : 'max'].z) ));
            }
            for (var k = 0; k < v.length; k++) {
                var id = v[k].x+'|'+v[k].y+'|'+v[k].z;
                if(corners[id]){
                    corners[id][0]++;
                }
                else{
                    corners[id] = [0,v[k]];
                }
            };
            var c = [];
            for (var k in corners) {
                var index = 0;

                for (var j = 0; j < c.length; j++) {
                    if(c[j][0] >= corners[k][0]){
                        index = j;
                        break;
                    }
                };
                
                c.splice(j,0,corners[k]);
            };
            corners = c;

            //check for collisions
            for (var k in corners) {
                if(done == true) break;

                var block = map.getBlock(corners[k][1]);
                if(!block) continue;

                if(block instanceof CollisionBlock){
                    if(collisions.canCollide(a.collision,block.collision)){
                        if(collisions.checkCollision(a.collision,block.collision,velocity)){
                            var a = collisions.SweptAABB(a.collision,block.collision,velocity);
                            colInfo = a;
                            //had a collision so break out of the loop
                            done = true;
                            break;
                        }
                    }
                }
            };
        };
        delete pos, corners, c, block, box;
        return colInfo;
    }
}