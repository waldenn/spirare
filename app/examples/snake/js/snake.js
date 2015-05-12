function Snake( scene, size, color, unitsize ) {

	this.snake = [];
	this.scene = scene;
	this.size = size; // snake is made up of cubes
	this.color = color;
	this.distance = size; // distance to move by

	this.direction = null;
	this.axis = null;

	this.onSelfCollision = function() {};
	this.onTagCollision = function() {};

	this.position = {}; // current position of the snake instance

	this.tagPosition = {}; // the current position of the tag to be hit

	this.geometry = new THREE.BoxGeometry( this.size, this.size, this.size );

	this.material = new THREE.MeshLambertMaterial( {

		color: this.color,
		transparent: true,
		opacity: 0.5

    } );

    this.nav = {
					//   n,     s,    e,      w,     u,    d
        'forward':	['z-1',  'z1', 'x1' , 'x-1', 'z1' , 'z-1'],
        'backward': ['z1' , 'z-1', 'x-1', 'x1' , 'z-1', 'z1' ],
        'right' :   ['x1' , 'x-1', 'z-1', 'z1' , 'x1' , 'x-1'],
        'left' :    ['x-1', 'x1' , 'z1' , 'z-1', 'x-1', 'x1' ],
        'up' :      ['y1' , 'y1' , 'y1' , 'y1' , 'y1' , 'y-1'],
        'down' :    ['y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y1' ],
    };

	this.init();

};

Snake.prototype = {
	
	init: function() {
		
		this.addCube();
		this.addCube();
		this.setDefaultPositions();
	   	
	},
	
	setDefaultPositions: function() {
		
		var self = this;

		this.snake.forEach( function( cube, index ) {
			
			cube.position.z = -1 * ( self.size / 2 * ( index + 1 ) );
			cube.position.y = self.size / 2;
			cube.position.x = -500 + 25;
		
		} );
	   	
	},
	
	reset: function() {
		
		this.init();
	   	
	},
	
	selfCollision: function() {
		
		this.onSelfCollision();
		this.clear();
	   	
	},
	
	tagCollision: function() {
		
		this.onTagCollision();
		this.addCube();
	   	
	},
	
	setCurrentTagPosition: function( position ) {
		
		this.tagPosition = position;
	   	
	},
	
	isHit: function( p1, p2 ) {
		
		if ( p1.x === p2.x && p1.y === p2.y && p1.z === p2.z ) {
			
			return true;
		
		}
		
		return false;
	   	
	},
	
	addCube: function() {
		
		this.snake.push( new THREE.Mesh( this.geometry, this.material )  );
	   	
	},

	render: function() {
		
        // TODO: Make pretty(sorry I´m in a hurry)
		var cube = this; // stupid javascript is stupid
		this.snake.forEach(function(c){cube.renderCube( c );});
	   	
	},
        
	update: function() {
		
		// TODO: Implement time based movement!
		var self = this;
		var next = null;
		
		this.snake.forEach( function( cube ) {
			
			var temp = null;

			if ( self.axis !== null && self.direction !== null ) {
				
				if ( !next ) {
					
					next = {
						x: cube.position.x,
						y: cube.position.y,
						z: cube.position.z
					};

					cube.position[ self.axis ] += ( self.direction * self.distance );

					self.position = {
						x: cube.position.x,
						y: cube.position.y,
						z: cube.position.z
					};

					if ( self.tagPosition ) {
						
						if ( self.isHit( self.position, self.tagPosition ) ) {
							
							self.tagCollision();
						
						}
					
					}
				
				}
				else {
					
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

	getDirection: function(dir) {
        console.log( dir );

        if ( dir === 'z-1' ) {
                return '0'; // north
        }
        else if ( dir === 'z1' ) {
                return '1'; // south
        }
        else if ( dir === 'x1' ) {
                return '2'; // east
        }
        else if ( dir === 'x-1' ) {
                return '3'; // west
        }
        else if ( dir === 'y1' ) {
                return '4'; // up
        }
        else if ( dir === 'y-1' ) {
                return '5'; // down
        }

    },


	backward: function() {

		//console.log ( 'current heading: ', this.getDirection( this.direction + this.axis ) );
		
		// lookup nav string
		var m = this.nav.backward[  this.getDirection( this.axis + this.direction )  ];

		// set movement
		this.axis = m.substring(0,1);
		this.direction = m.substring(1)
	   	
	},

	forward: function() {

		var m = this.nav.forward[  this.getDirection( this.axis + this.direction )  ];
		this.axis = m.substring(0,1);
		this.direction = m.substring(1)

	},

	up: function() {
		
		var m = this.nav.up[  this.getDirection( this.axis + this.direction )  ];
		this.axis = m.substring(0,1);
		this.direction = m.substring(1)
	},

	down: function() {
		
		var m = this.nav.down[  this.getDirection( this.axis + this.direction )  ];
		this.axis = m.substring(0,1);
		this.direction = m.substring(1)
	   	
	},

	right: function() {

		var m = this.nav.right[  this.getDirection( this.axis + this.direction )  ];
		this.axis = m.substring(0,1);
		this.direction = m.substring(1)
	   	
	},

	left: function() {

		var m = this.nav.left[  this.getDirection( this.axis + this.direction )  ];
		this.axis = m.substring(0,1);
		this.direction = m.substring(1)
		
	},

	clear: function() {
		
		this.axis = null;
		this.direction = null;
	   	
	},

	renderCube: function( cube ) {
		
		this.scene.add( cube )
	   	
	}
};

