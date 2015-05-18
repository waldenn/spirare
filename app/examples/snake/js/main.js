!(function() {

	// webgl support check
    if (!Detector.webgl) Detector.addGetWebGLMessage();

    var controls;
    var scene, camera, renderer, cube;

	// configurable
    var gridSize		= 100;
    var unitSize		= 50;
	var timerTotal		= 0.4;

	var timerCurrent	= 0;
	var clock			= new THREE.Clock();
	var TAU				= 2 * Math.PI;

    var pos;
    var snake			= null;
    var renderCounter	= 0;
    var fruit			= null;
    var level			= 1;

    var gameScoreBoard	= document.getElementById('gamescore');
    var pauseScreen		= document.getElementById('pause');
    var leveloptions	= document.getElementById('leveloptions');

    leveloptions.addEventListener('change', onLevelChange, false);

    function showPauseScreen() {
        pauseScreen.className = 'paused';
    }

    function hidePauseScreen() {
        pauseScreen.className = 'paused hidden';
    }

	// todo
	//var obstacles = []; // Array of obstacles

    var keys = {
        38: 'backward', // up key
        40: 'forward', // down key
        39: 'right', // -> key
        37: 'left', // <- key
        87: 'up', // W key
        83: 'down', // S key
        32: 'pause' // spacebar
    }
  
    var keyActions = {
    
        'backward': {
            enabled: true,
            action: function() {

				//camera.rotation.y = 0;
                snake.backward();
            }
        },
        
        'forward': {
            enabled: true,
            action: function() {

				//camera.rotation.y = TAU / 2;
                snake.forward();

            }
        },
        
        'right': {
            enabled: true,
            action: function() {

				//camera.rotation.y = TAU / 4;
                snake.right();

            }
        },
        
        'left': {
            enabled: true,
            action: function() {

				//camera.rotation.y = TAU * 3 / 4;
                snake.left();

            }
        },
        
        'up': {
            enabled: true,
            action: function() {

                snake.up();

            }
        },
        
        'down': {
            enabled: true,
            action: function() {

                snake.down();

            }
        },
        
        'pause': {
            enabled: false,
            action: function() {

                snake.clear();
                keyActions.pause.enabled = false;
                showPauseScreen();

            }
        }
        
    };

    // game levels
    var levels = {
        1: {
            renderCount: 15 // speed control
        },
        2: {
            renderCount: 10
        },
        3: {
            renderCount: 5
        },
        4: {
            renderCount: 3
        }
    }

    var interval = 10000;

    function init() {

        window.addEventListener('resize', onWindowResize, false);

        THREEx.FullScreen.bindKey({
            charCode: 'f'.charCodeAt(0)
        });

        // scene
        scene = new THREE.Scene();

        // grid
        var gridGeometry = new THREE.Geometry();
        
        for (var i = -gridSize; i <= gridSize; i += unitSize) {
            gridGeometry.vertices.push(new THREE.Vector3(-gridSize, 0, i));
            gridGeometry.vertices.push(new THREE.Vector3(gridSize, 0, i));
            gridGeometry.vertices.push(new THREE.Vector3(i, 0, -gridSize));
            gridGeometry.vertices.push(new THREE.Vector3(i, 0, gridSize));
        }
        
        var gridMaterial = new THREE.LineBasicMaterial({
            color: 0x000000,
            opacity: 0.2,
            transparent: true
        });
        
        var line = new THREE.Line(gridGeometry, gridMaterial, THREE.LinePieces);
        
        scene.add(line);

        // snake
        snake = new Snake(scene, unitSize, gridSize, 0xff0000 );
        snake.render();
        
        fruit = addFruitToScene(randomAxis(), unitSize / 2, randomAxis());

        // camera
        camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 1, 10000);

        controls = new THREE.PointerLockControls( camera );
		controls.initPointerLock( controls , controls.checkForPointerLock() );

        // place camera object at the snake head
        snake.snake[0].add( controls.getObject() );

		// static camera
        //snake.snake[0].add( camera );

        snake.onFruitCollision = function() {

            scene.remove(fruit);
            fruit = addFruitToScene(randomAxis(), unitSize / 2, randomAxis());
            setScore();

        };
        
        snake.onSelfCollision = function() {

			console.log('game over!');
            snake.reset();
        	snake.snake[0].add( controls.getObject() );

        };

        // todo: add navigation pointer to next position?
		// ...

        // renderer
        renderer = new THREE.WebGLRenderer({
            antialias: true
        });

        renderer.setSize(window.innerWidth - 10, window.innerHeight - 10);
        renderer.setClearColor(0xf0f0f0);

        document.body.appendChild(renderer.domElement);

        // lighting
        var directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.set(500, 800, 1300).normalize();
        scene.add(directionalLight);

        animate();
    }

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);

    }

    function randomAxis() {
        var point = randomPoint();
        return point > gridSize ? (gridSize - point) - 25 : point - 25;
    }
    
    function animate() {

		//var timeElapsed = clock.getElapsedTime();
		timerCurrent += clock.getDelta();;

		if( timerCurrent >= timerTotal) {
		
        	snake.update();
			timerCurrent -= timerTotal;

		}

        snake.render();
        renderer.render(scene, camera);
        
        window.requestAnimationFrame( animate );
    }

    function addFruitToScene(x, y, z) {

        var geometry = new THREE.BoxGeometry(unitSize, unitSize, unitSize);

        var material = new THREE.MeshLambertMaterial({
            color: 0x00ff00
        });

        var box = new THREE.Mesh(geometry, material);
        box.position.set(x, y, z);
        scene.add(box);

        snake.setCurrentFruitPosition({
            x: x,
            y: y,
            z: z
        });

        return box;
    }

    function onLevelChange(e) {
        setLevel(e.target.value);
    }

    function setLevel(value) {
        level = value;
    }

    function setScore() {
        gameScoreBoard.innerHTML = Number(gameScoreBoard.innerText) + 1;
    }

    function clearScore() {
        gameScoreBoard.innerHTML = '0';
    }

    function randomPoint() {
        // Generate random points between 0 and the gridSize in steps for unitSize
        var pos = Math.floor(Math.random() * gridSize * 2);
        return pos - (pos % unitSize);
    }

    function onKeyPressUp(e) {

        var keyAction = keyActions[keys[e.keyCode]];

        if ( keyAction ) {

			// if no key was hit yet
			if ( snake.move === null ){
				// default to north mode

				snake.move = [ 0, 0, -1 ];
				//snake.axis = 'z';
				//snake.direction = '-1';
			}

            keyAction.action();

        }
    }

    init();

    document.addEventListener('keyup', onKeyPressUp, false);

})();
