# current notes

- learn: OpenGL basics
	- http://www.ntu.edu.sg/home/ehchua/programming/opengl/cg_basicstheory.html 
- learn: shader programming
	- http://en.wikipedia.org/wiki/OpenGL_Shading_Language
	- http://threejs.org/docs/#Reference/Materials/ShaderMaterial
	- http://aerotwist.com/tutorials/an-introduction-to-shaders-part-1/
		- aerotwist.com/static/tutorials/an-introduction-to-shaders-part-1/demo/
	- http://aerotwist.com/tutorials/an-introduction-to-shaders-part-2/
		- http://betterexplained.com/articles/vector-calculus-understanding-the-dot-product/
	- http://www.adriancourreges.com/blog/2015/03/10/deus-ex-human-revolution-graphics-study/


- idea: add moving objects to the scene
- idea: create a small city with: buildings, roads, trees, etc.
- idea: create some 3D model, convert it to Three.js JSON format, import it into your scene. (the Three.js editor might be useful here)
- idea: create a maze as done [here](https://github.com/josdirksen/essential-threejs/tree/master/chapter-03) using [this](https://github.com/felipecsl/random-maze-generator)
- idea: add collision detection with objects on the ground (pre-calculations needed for robustness?)
- idea: allow for horizontal movement when jumping
- idea: add dynamically generated assets: sounds, textures, ...

- research: non-flat player movement physics, some sample raytrace-based-physics code here:
	- minimal approach: spirare/app/examples/first-person-game-a/js/modules/systems/applyPhysics.js
	- navmesh and 3D pathfinding:
		- http://nickjanssen.github.io/PatrolJS/demo/demo.html
		- https://github.com/nickjanssen/PatrolJS
		- http://www.ai-blog.net/archives/000152.html
		- https://www.youtube.com/watch?v=v4d_6ZCGlAg&feature=youtu.be&t=6m8s
		- https://www.youtube.com/watch?v=XyfLSocd9ec
		- https://www.youtube.com/watch?v=aMWeTXL98mM

- research: better user interface switching between with HUD controls and PointerLock mode

- todo: matrix projections math explained

- demo: http://codepen.io/nicolasdnl/pen/zxedvW

-----------

# old notes

- git
	- https://help.github.com/articles/syncing-a-fork/
	- https://help.github.com/articles/configuring-a-remote-for-a-fork/

- git: merging, resetting, rebasing
	- http://www.hostingadvice.com/how-to/git-undo-commit/
 	- http://www.hostingadvice.com/how-to/git-rollback-commit/
	- http://www.hostingadvice.com/blog/git-no-ff-rebase/
	- http://www.hostingadvice.com/how-to/git-merge-rebase/


# 2) git: branches:

	- http://nvie.com/posts/a-successful-git-branching-model/
	- https://www.atlassian.com/git/tutorials/syncing/git-remote
	- http://www.hostingadvice.com/how-to/git-branch-rename/

# 3) JS:
	- webdev doc links
	- protoype based programming
		- http://javascript.crockford.com/prototypal.html
		- http://www.reddit.com/r/javascript/comments/2y3x14/cleaner_javascript_object_inheritance_example/
		- http://www.javascriptkit.com/javatutors/oopjs2.shtml
		- http://pivotallabs.com/javascript-constructors-prototypes-and-the-new-keyword/
		- http://www.htmlgoodies.com/beyond/javascript/object.create-the-new-way-to-create-objects-in-javascript.html
		- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
	- code style guidelines

# 4) ThreeJS:

	- scene (tree root datastructure)
		- Object3D http://threejs.org/docs/#Reference/Core/Object3D
			- camera	https://en.wikipedia.org/wiki/Viewing_frustum
						https://en.wikipedia.org/wiki/Hidden_surface_determination
			- lighting
			- geometry, buffer geometry
				- box, sphere, cylinder, textgeometry, etc.
			- vertices, faces
				http://en.wikipedia.org/wiki/Polygon_mesh
				https://www.youtube.com/playlist?list=PLzH6n4zXuckrPkEUK5iMQrQyvj9Z6WCrm
					https://www.youtube.com/watch?v=KdyvizaygyY
					https://www.youtube.com/watch?v=OODzTMcGDD0
			- line, mesh, sprite, pointcloud
			- textures
			- grouping: http://stackoverflow.com/questions/FOOFOO5/three-js-mesh-group-example-three-object3d-advanced
			- controls:
				- https://github.com/mrdoob/three.js/tree/master/examples/js/controls
					- TrackBall: https://github.com/mrdoob/three.js/blob/master/examples/js/controls/TrackballControls.js 
					- PointerLock: http://www.html5rocks.com/en/tutorials/pointerlock/intro/
			- rendering process:
				- http://www.adriancourreges.com/blog/2015/03/10/deus-ex-human-revolution-graphics-study/
	- ideas:
		- place some "rock" objects into the scene
		- implement raycasting collision-detection with "rocks"
		- sound: https://github.com/egonelbre/jsfx
		- generative texturing: https://github.com/mrdoob/texgen.js
		- investigate: https://makc3d.wordpress.com/FOO4/07/20/threejs-first-person-shooter/

	- explain raycasting
		- http://www.playfuljs.com/a-first-person-engine-in-FOO-lines/
			- http://demos.playfuljs.com/raycaster/
			- atan2 http://gamedev.stackexchange.com/questions/FOO02/what-are-atan-and-atan2-used-for-in-games
				- http://en.wikipedia.org/wiki/Atan2#Definition

-----------

	- views / projections
		- https://en.wikipedia.org/wiki/Transformation_matrix
		- https://www.youtube.com/watch?v=vQ60rFwh2ig
		- http://www.codinglabs.net/article_world_view_projection_matrix.aspx
		- http://www.inversereality.org/tutorials/graphics%20programming/3dwmatrices.html
		- http://3dgep.com/understanding-the-view-matrix/
		- http://www.codeproject.com/Articles/FOO86/Space-and-Matrix-Transformations-Building-a-D-Eng
		- http://en.wikibooks.org/wiki/OpenGL_Programming/3D/Matrices
		- https://www.blend4web.com/doc/en/developers.html#index-0

	- vectors, matrices
		- rotation: euler, quaternions

	- object picking
		- http://soledadpenades.com/articles/three-js-tutorials/object-picking/

	- deferred rendering: http://marcinignac.com/blog/deferred-rendering-explained/

# various

	- todo: fix live coding setup
	- regexps:
		- http://davidwalsh.name/regular-expressions-rest
		- https://www.debuggex.com/
	- PR testing: https://help.github.com/articles/checking-out-pull-requests-locally/
	- http://www.sitepoint.com/understanding-collisions-physics-babylon-js-oimo-js/
	- fetch() http://updates.html5rocks.com/2015/03/introduction-to-fetch
	- UX: http://aestheticio.com/learn-user-experience-design/
	- links:
		- 
		- https://www.udacity.com/course/csFOO
		- http://media.tojicode.com/q3bsp/
		- http://soledadpenades.com/articles/three-js-tutorials/
		- http://www.playfuljs.com/
			- http://www.playfuljs.com/realistic-terrain-in-FOO-lines/
				- https://github.com/hunterloftis/playfuljs-demos/blob/gh-pages/terrain/index.html

~~~
		/*
		// <script src="http://mrdoob.github.com/three.js/examples/fonts/helvetiker_regular.typeface.js"></script>

		var TextGeometry = new THREE.TextGeometry( 'type "f" for fullscreen and click to play!', {
						size: 10, height: 10, curveSegments: 3,
						font: "helvetiker", // weight: "regular", style: "normal",
						bevelThickness: 1, bevelSize: 2, bevelEnabled: false
		});
		var Material = new THREE.MeshNormalMaterial( { color: 0x00ff00 } );
		var Text = new THREE.Mesh( TextGeometry, Material );
		//Text.lookAt( camera.position );
		//Text.lookAt( camera.position );
		scene.add( Text );
		*/
~~~


<!--
Beginner:   https://www.khanacademy.org/profile/ccl123/programs
Advanced: JS, Git, Github, ThreeJS, ...

**3D Demos**:
    - threejs.org/editor/#app=https://gist.githubusercontent.com/walden-/98d41536d2e2e431a387/raw/fdf54340ffab97363fcd3420af6385eb5e86d869/arkanoid.app.json
    - http://chewbonga.com/simple-world-threejs/
        - http://blog.chewbonga.com/entry/54e67133e5c87a2d7653d185
    - https://github.com/walden-/spirare
    - https://github.com/josdirksen/essential-threejs
        - see also the PDF book
    - http://stemkoski.github.io/Three.js/
        - http://stemkoski.github.io/Three.js/Sprite-Text-Labels.html
        - http://stemkoski.github.io/Three.js/Video.html
        - https://stemkoski.github.io/Three.js/Graphulus-Function.html
        - http://stemkoski.github.io/Three.js/Collision-Detection.html
    - http://livecodelab.net/play/index.html
    - http://www.kickjs.org/example/shader_editor/shader_editor.html#
    - http://texgenjs.org/
        - http://fernandojsg.github.io/texgen.js-editor/
    - http://realfaces.org/
    - http://www.acnplwgl.com/
    - http://timeinvariant.github.io/gorescript/play/Aanpak

**Other**:
    - http://www.countbayesie.com/blog/2015/2/18/bayes-theorem-with-lego

* [github pages publishing](http://stackoverflow.com/questions/23145621/how-to-publish-pages-on-github)
* [github pages syncing](http://lea.verou.me/2011/10/easily-keep-gh-pages-in-sync-with-master/)
-->

