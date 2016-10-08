function create3DScene(config) {
	var camera, controls, renderer, scene;
	var startTime = Date.now();

	init();
	animate();

	function init() {
		var container = document.createElement('div');
		document.body.appendChild(container);

		renderer = new THREE.WebGLRenderer({alpha: true});
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(window.innerWidth, window.innerHeight);
		container.appendChild(renderer.domElement);

		camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 1000);
		camera.position.z = 2.5;
		controls = new THREE.OrbitControls(camera, renderer.domElement);

		window.addEventListener('resize', onWindowResize, false);

		scene = new THREE.Scene();
		config.init(camera, scene);
	}

	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize(window.innerWidth, window.innerHeight);
	}

	function animate() {
		requestAnimationFrame(animate);
		controls.update();

		var time = (Date.now() - startTime) / 1000;
		config.update(time);

		renderer.render(scene, camera);
	}
}


function loadBase64Texture(data, succeed) {
	var image = document.createElement('img');
	image.onload = function() {
		var texture = new THREE.Texture(image);
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		texture.needsUpdate = true;

		succeed(texture);
	}
	image.src = data;
}
