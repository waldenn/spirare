var keyboard = new THREEx.KeyboardState();

var watch = {
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    clock: null,
    arrowMin: null,
    arrowHr: null,
    timeMod: 60, // seconds
    date: new Date,

    init: function() {

        // create main scene
        this.scene = new THREE.Scene();

        var SCREEN_WIDTH = window.innerWidth,
            SCREEN_HEIGHT = window.innerHeight;

        // prepare camera
        var VIEW_ANGLE = 45,
            ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT,
            NEAR = 1,
            FAR = 5000;
        this.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
        this.scene.add(this.camera);
        this.camera.position.set(0, 1600, 0);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));

        // prepare renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: false
        });
        this.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
        this.renderer.shadowMap.enabled = true;

        // prepare container
        var container = document.createElement('div');
        document.body.appendChild(container);
        container.appendChild(this.renderer.domElement);

        // events
        THREEx.WindowResize(this.renderer, this.camera);

        // prepare controls (OrbitControls)
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target = new THREE.Vector3(0, 0, 0);

        // prepare clock
        this.clock = new THREE.Clock();

        // add dial shape
        var dialMesh = new THREE.Mesh(
            new THREE.CircleGeometry(500, 50),
            new THREE.MeshPhongMaterial({
                color: 0x7e7e7e
            })
        );
        dialMesh.rotation.x = -Math.PI / 2;
        dialMesh.position.y = 0;
        dialMesh.receiveShadow = true;
        dialMesh.castShadow = true;
        this.scene.add(dialMesh);

        // add rim shape
        var rimMesh = new THREE.Mesh(
            new THREE.TorusGeometry(500, 20, 10, 100),
            new THREE.MeshPhongMaterial({
                color: 0x7e7e7e
            })
        );
        rimMesh.rotation.x = -Math.PI / 2;
        rimMesh.receiveShadow = true;
        rimMesh.castShadow = true;
        this.scene.add(rimMesh);

        // add center pin
        var pinMesh = new THREE.Mesh(
            new THREE.CylinderGeometry(0, 4, 50, 32),
            new THREE.MeshPhongMaterial({
                color: 0x7e7e7e
            })
        );
        pinMesh.position.y = 25;
        pinMesh.receiveShadow = true;
        pinMesh.castShadow = true;
        this.scene.add(pinMesh);

        // add watch arrow
        var iHours = 12;
        var mergedArrows = new THREE.Geometry();
        var extrudeOpts = {
            amount: 1,
            steps: 1,
            bevelSegments: 1,
            bevelSize: 0.5,
            bevelThickness: 1
        };
        var handFrom = 400,
            handTo = 450;

        for (i = 1; i <= iHours; i++) {

            // prepare each arrow in a circle
            var arrowShape = new THREE.Shape();

            var from = (i % 3 == 0) ? 350 : handFrom;

            var a = i * Math.PI / iHours * 2;
            arrowShape.moveTo(Math.cos(a) * from, Math.sin(a) * from);
            arrowShape.lineTo(Math.cos(a) * from + 3, Math.sin(a) * from + 3);
            arrowShape.lineTo(Math.cos(a) * handTo + 3, Math.sin(a) * handTo + 3);
            arrowShape.lineTo(Math.cos(a) * handTo, Math.sin(a) * handTo);

            var arrowGeom = new THREE.ExtrudeGeometry(arrowShape, extrudeOpts);

            THREE.GeometryUtils.merge(mergedArrows, arrowGeom);
        }

        var arrowsMesh = new THREE.Mesh(mergedArrows, new THREE.MeshBasicMaterial({
            color: 0x444444
        }));
        arrowsMesh.rotation.x = -Math.PI / 2;
        arrowsMesh.position.y = 10;
        this.scene.add(arrowsMesh);

        // add ambient light
        var ambientLight = new THREE.AmbientLight(0x222222);
        this.scene.add(ambientLight);

        //directional light
        var directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.set(100, 100, 100);
        directionalLight.target.position.set(0, 0, 0);

        directionalLight.castShadow = true;
        directionalLight.shadowDarkness = 0.5;
        //directionalLight.shadowCameraVisible = true;

        directionalLight.shadowCameraNear = 0;
        directionalLight.shadowCameraFar = 15;

        directionalLight.shadowCameraLeft = -5;
        directionalLight.shadowCameraRight = 5;
        directionalLight.shadowCameraTop = 5;
        directionalLight.shadowCameraBottom = -5;

        this.scene.add(directionalLight);

        // add hand lights
        var iHours = 12;
        var a = iHours * Math.PI / iHours * 2;
        var handTo = 350;

        var sphereGeom = new THREE.SphereGeometry(5, 5, 5, 0, Math.PI * 2, 0, Math.PI * 2);
        var sphereMaterial = new THREE.MeshNormalMaterial();

        var geometry = new THREE.CylinderGeometry(0.1, 1.5, 5, 32 * 2, 20, true);
        var material = new THREEx.VolumetricSpotLightMaterial()
        var mesh = new THREE.Mesh(geometry, material);
        material.uniforms.lightColor.value.set('white') // color of led lights

        // add minutes hand
        var spotLight = new THREE.SpotLight();
        spotLight.color = mesh.material.uniforms.lightColor.value;
        spotLight.exponent = 60;
        spotLight.distance = 500;
        spotLight.angle = Math.PI / 2;
        spotLight.intensity = 15;
        spotLight.castShadow = true;

        var arrowMinShape = new THREE.Shape();
        arrowMinShape.moveTo(0, -5);
        arrowMinShape.lineTo(Math.cos(a) * handTo, Math.sin(a) * handTo - 5);
        arrowMinShape.lineTo(Math.cos(a) * handTo, Math.sin(a) * handTo + 5);
        arrowMinShape.lineTo(0, 5);

        var arrowMinGeom = new THREE.ExtrudeGeometry(arrowMinShape, {});
        this.arrowMin = new THREE.Mesh(arrowMinGeom, new THREE.MeshBasicMaterial({
            color: 0x000000
        }));
        this.arrowMin.material.visible = false;
        this.arrowMin.rotation.x = -Math.PI / 2;
        this.arrowMin.position.y = 20;

        var minLed = new THREE.Mesh(sphereGeom, sphereMaterial);
        minLed.material.visible = false;
        minLed.position.x = -500;
        minLed.position.y = 0;
        minLed.add(spotLight);
        this.arrowMin.add(minLed);
        this.scene.add(this.arrowMin);

        // add hours hand
        var spotLight2 = new THREE.SpotLight();
        //spotLight2.position.z = 30;
        spotLight2.color = mesh.material.uniforms.lightColor.value;
        spotLight2.exponent = 60;
        //spotLight2.shadowCameraNear = 500;
        spotLight2.shadowCameraFar = 750;
        spotLight2.distance = 500;
        spotLight2.angle = Math.PI / 2;
        spotLight2.intensity = 15;
        spotLight2.castShadow = true;

        handTo = 300;
        var arrowHrShape = new THREE.Shape();
        arrowHrShape.moveTo(0, -5);
        arrowHrShape.lineTo(Math.cos(a) * handTo, Math.sin(a) * handTo - 5);
        arrowHrShape.lineTo(Math.cos(a) * handTo, Math.sin(a) * handTo + 5);
        arrowHrShape.lineTo(0, 5);

        var arrowHrGeom = new THREE.ExtrudeGeometry(arrowHrShape, {});
        this.arrowHr = new THREE.Mesh(arrowHrGeom, new THREE.MeshBasicMaterial({
            color: 0x000000
        }));
        this.arrowHr.material.visible = false;
        this.arrowHr.rotation.x = -Math.PI / 2;
        this.arrowHr.position.y = 40;

        var hourLed = new THREE.Mesh(sphereGeom, sphereMaterial);
        hourLed.position.x = -500;
        hourLed.position.y = 0;
        hourLed.material.visible = false;
        hourLed.add(spotLight2);
        this.arrowHr.add(hourLed);
        this.scene.add(this.arrowHr);
    }
};

// Animate the scene
function animate() {
    requestAnimationFrame(animate);
    render();
    update();
}

function update() {
    var delta = watch.clock.getDelta();
    watch.controls.update(delta);

    if (keyboard.pressed("f")) {
        console.log('f pressed');
        watch.timeMod = 300;
    }

    if (keyboard.pressed("up")) {
        console.log('up pressed');
        date.setSeconds(date.getSeconds() + (60 * delta));
    }

    if (keyboard.pressed("down")) {
        console.log('down pressed');
        date.setSeconds(date.getSeconds() + (-60 * delta));
    }

    if (keyboard.pressed("r")) {
        console.log('r pressed');
        watch.timeMod = 0;
    }

    watch.date.setSeconds(watch.date.getSeconds() + (watch.timeMod * delta));

    var minutes = watch.date.getMinutes();
    var hours = watch.date.getHours();

    var rotMin = minutes * 2 * Math.PI / 60 - Math.PI / 2;
    watch.arrowMin.rotation.z = -rotMin;

    var rotHr = hours * 2 * Math.PI / 12 - Math.PI / 2;
    watch.arrowHr.rotation.z = -rotHr;
}

function render() {
    if (watch.renderer) {
        watch.renderer.render(watch.scene, watch.camera);
    }
}

function initialize() {
    watch.init();
    animate();
}

if (window.addEventListener)
    window.addEventListener('load', initialize, false);
else if (window.attachEvent)
    window.attachEvent('onload', initialize);
else window.onload = initialize;