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

	this.matrix	= [
		// lit-north      , lit-east        , lit-south       , lit-west 
		[ [0,0,-1,'NORTH'], [0,0,1,'SOUTH'] , [1,0,0,'EAST']  , [-1,0,0,'WEST']  ],  // rel-north
		[ [1,0,0,'EAST']  , [-1,0,0,'WEST'] , [0,0,-1,'NORTH'], [0,0,1,'SOUTH']  ],  // rel-east
		[ [0,0,1,'SOUTH'] , [1,0,0,'EAST']  , [-1,0,0,'WEST'] , [0,0,-1,'NORTH'] ],  // rel-south
		[ [-1,0,0,'WEST'] , [0,0,-1,'NORTH'], [0,0,1,'SOUTH'] , [1,0,0,'EAST']   ]   // rel-west
	];

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

		//this.literaldir = null;
		this.literaldir = this.direction.NORTH;

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


	forward: function() {

		//this.changeRelativeDirection( this.direction.SOUTH );
		//this.move = [ 0, 0, -1 ];

		this.move = this.matrix[ this.direction.NORTH ][ this.literaldir ];
		this.literaldir =  this.direction[ this.move[ 3 ] ];
		console.log( this.literaldir );

	},


	backward: function() {

		this.move = this.matrix[ this.direction.SOUTH ][ this.literaldir ];
		this.literaldir =  this.direction[ this.move[ 3 ] ];
		//console.log( this.move );
		console.log( this.literaldir );
	},

	right: function() {

		//this.changeRelativeDirection( this.direction.EAST );
		this.move = [ 1, 0, 0 ];
	   	
	},

	left: function() {

		//this.changeRelativeDirection( this.direction.WEST );
		this.move = [ -1, 0, 1];
		
	},

	up: function() {
		
		//this.changeRelativeDirection( this.direction.UP );
		this.move = [ 0, 1, 0 ];
	},

	down: function() {
		
		//this.changeRelativeDirection( this.direction.DOWN );
		this.move = [ 0, -1, 0 ];
	   	
	},

	clear: function() {
		
		this.move = null;
	   	
	},

	renderCube: function( cube ) {
		
		this.scene.add( cube )
	   	
	}
};

