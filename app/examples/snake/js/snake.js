function Snake( scene, size, gridsize, color ) {

	this.snake		= [];
	this.scene		= scene;
	this.size		= size;
	this.gridsize	= gridsize;
	this.color		= color;
	this.distance	= size; // distance to move by
    this.move    	= null; // current move vector

    this.direction  = {

        NORTH: 0,
        EAST:  1,
        SOUTH: 2,
        WEST:  3,
        UP:    4,
        DOWN:  5

    };

	this.onSelfCollision	= function() {};
	this.onFruitCollision	= function() {};

	this.position			= {}; // snake head position
	this.fruitPosition		= {};

	this.geometry = new THREE.BoxGeometry( this.size, this.size, this.size );

	this.material = new THREE.MeshLambertMaterial( {

		color: this.color,
		transparent: true,
		opacity: 0.5

    } );

	this.init();

};

Snake.prototype = {
	
	init: function() {
		this.snake = [];
    	this.move  = null;
		this.literaldir = this.direction.NORTH;
		//updateDirection();

		// remove old snake cubes from the scene
		for ( var i = this.scene.children.length - 1; i >= 0 ; i -- ) {
			var obj = this.scene.children[ i ];

			if ( obj.name === 'snake') {
				this.scene.remove(obj);
				console.log('removed a cube');
			}
		}
		
		this.addCube();
		this.addCube();
		this.setDefaultPositions();
	   	
	},
	
	setDefaultPositions: function() {
		
		var self = this;

		this.snake.forEach( function( cube, index ) {
			
			cube.position.z = -1 * ( self.size / 2 * ( index + 1 ) );
			cube.position.y = self.size / 2;
			cube.position.x = -1 * ( self.gridsize / 2 ) + ( self.size / 2 );
		
		} );
	   	
	},
	
	reset: function() {
		
		this.init();
	   	
	},
	
	selfCollision: function() {
		
		this.onSelfCollision();
		this.clear();
	   	
	},
	
	fruitCollision: function() {
		
		this.onFruitCollision();
		this.addCube();
	   	
	},
	
	setCurrentFruitPosition: function( position ) {
		
		this.fruitPosition = position;
	   	
	},
	
	isHit: function( p1, p2 ) {
		
		if ( p1.x === p2.x && p1.y === p2.y && p1.z === p2.z ) {
			
			return true;
		
		}
		
		return false;
	   	
	},
	
	addCube: function() {

        var c = new THREE.Mesh( this.geometry, this.material )
        c.name = 'snake';

        this.snake.push( c );

	   	
	},

	render: function() {
		
		var self = this;

		this.snake.forEach( function(c) {
			self.renderCube( c );
		});
	   	
	},
        
	update: function() {
		
		// TODO: Implement time based movement!
		var self = this;
		var next = null;
		
		this.snake.forEach( function( cube ) {
			
			var temp = null;

			if ( self.move !== null ) {

				// update snake head position
				if ( !next ) {
					
					next = {
						x: cube.position.x,
						y: cube.position.y,
						z: cube.position.z
					};

					cube.position.x += self.move[0] * self.distance;
					cube.position.y += self.move[1] * self.distance;
					cube.position.z += self.move[2] * self.distance;


					self.position = {
						x: cube.position.x,
						y: cube.position.y,
						z: cube.position.z
					};

					if ( self.fruitPosition ) {
						
						if ( self.isHit( self.position, self.fruitPosition ) ) {
							
							self.fruitCollision();
						
						}
					
					}
				
				}
				else { // update each trailing snake cube position
					
					temp = {
						x: cube.position.x,
						y: cube.position.y,
						z: cube.position.z
					};

					cube.position.set( next.x, next.y, next.z );

					// check if it collides with itself
					if ( self.isHit( self.position, cube.position ) ) {
						
						self.selfCollision();
					
					};

					next = {
						x: temp.x,
						y: temp.y,
						z: temp.z
					};
				
				}
			
			}
		
		} );
		
	},

	// changes literaldir relatively
	changeRelativeDirection: function( dir ) {

		/*
		NORTH: 0,
		EAST:  1,
		SOUTH: 2,
		WEST:  3,
		UP:    4,
		DOWN:  5
		*/

		// determine literaldir based on dir
		// 6 options / 3 opposite-pairs

		if ( dir == this.direction.NORTH ) {
			// no relative direction change is needed here
			// option: we could also speed up the snake here
		}
		else if ( dir == this.direction.EAST) {

			if ( this.literaldir = 1 ){		 // EAST
				this.literaldir = 2; // S
			}
			else if ( this.literaldir = 2 ){ // SOUTH
				this.literaldir = 1; // E
			}
			else if ( this.literaldir = 3 ){ // WEST
				this.literaldir = 0; // N
			}

		}
		else if ( dir == this.direction.SOUTH) {

			if ( this.literaldir = 1 ){		 // EAST
				this.literaldir = 3;
			}
			else if ( this.literaldir = 2 ){ // SOUTH
				// illegal move, dont change direction
			}
			else if ( this.literaldir = 3 ){ // WEST
				this.literaldir = 1;
			}

		}
		else if ( dir == this.direction.WEST) {

			if ( this.literaldir = 1 ){		 // EAST
				this.literaldir = 0; // N
			}
			else if ( this.literaldir = 2 ){ // SOUTH
				this.literaldir = 3; // W
			}
			else if ( this.literaldir = 3 ){ // WEST
				this.literaldir = 2; // S
			}

		}
		else if ( dir == this.direction.UP) {
			// todo
		}
		else if ( dir == this.direction.DOWN) {
			// todo
		}

		this.updateDirection();
	}, 

    updateDirection: function() {

        switch (this.literaldir)
        {
            case this.direction.NORTH:
                this.move = [ 0, 0, -1 ];
                break;

            case this.direction.SOUTH:
                this.move = [ 0, 0, 1 ];
                break;

            case this.direction.WEST:
                this.move = [ -1, 0, 0 ];
                break;

            case this.direction.EAST:
                this.move = [ 1, 0, 0 ];
                break;

            case this.direction.UP:
                this.move = [ 0, 1, 0 ];
                break;

            case this.direction.DOWN:
                this.move = [ 0, -1, 0 ];
                break;

        }
    },


	backward: function() {

		this.move = [ 0, 0, -1 ];
	   	
	},

	forward: function() {

		//snake.changeRelativeDirection( snake.direction.NORTH );
		this.move = [ 0, 0, 1 ];

	},

	right: function() {

		this.move = [ 1, 0, 0 ];
	   	
	},

	left: function() {

		this.move = [ -1, 0, 1];
		
	},

	up: function() {
		
		this.move = [ 0, 1, 0 ];
	},

	down: function() {
		
		this.move = [ 0, -1, 0 ];
	   	
	},

	clear: function() {
		
		this.move = null;
	   	
	},

	renderCube: function( cube ) {
		
		this.scene.add( cube )
	   	
	}
};

