# 1) git: syncing forks:
git
	- https://help.github.com/articles/syncing-a-fork/
	- https://help.github.com/articles/configuring-a-remote-for-a-fork/

# 1) git: merging, resetting, rebasing
	- http://www.hostingadvice.com/how-to/git-undo-commit/
 	- http://www.hostingadvice.com/how-to/git-rollback-commit/
	- http://www.hostingadvice.com/blog/git-no-ff-rebase/
	- http://www.hostingadvice.com/how-to/git-merge-rebase/

# 1) raycasting
	- http://threejs.org/docs/#Reference/Core/Raycaster
	- http://mrdoob.github.io/three.js/examples/canvas_interactive_cubes.html
	- http://threejs.org/examples/canvas_interactive_particles.html


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
