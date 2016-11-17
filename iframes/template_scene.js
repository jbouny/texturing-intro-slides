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

function makeSpriteFromText(text, parameters) {
	// author: stemkoski (https://stemkoski.github.io/Three.js/Sprite-Text-Labels.html)
	function roundRect(ctx, x, y, w, h, r) 
	{
		ctx.beginPath();
		ctx.moveTo(x+r, y);
		ctx.lineTo(x+w-r, y);
		ctx.quadraticCurveTo(x+w, y, x+w, y+r);
		ctx.lineTo(x+w, y+h-r);
		ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
		ctx.lineTo(x+r, y+h);
		ctx.quadraticCurveTo(x, y+h, x, y+h-r);
		ctx.lineTo(x, y+r);
		ctx.quadraticCurveTo(x, y, x+r, y);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();  
	} 

	var defaultParameters = {
		font: "Arial",
		size: 28,
		backgroundColor: [0, 0, 0, 1],
		textColor: [200, 200, 200, 1],
		fillColor: [128, 128, 128, 1],
		borderThickness: 4,
		borderColor: [200, 200, 200, 1]
	}
	if (parameters === undefined) {
		parameters = {};
	}
	for (var key in defaultParameters) {
		if (!(key in parameters)) {
			parameters[key] = defaultParameters[key];
		}
	}

	var canvas = document.createElement('canvas');
	var context = canvas.getContext('2d');
	context.font = "Bold " + parameters.size + "px " + parameters.font;
	var metrics = context.measureText(text);
	context.canvas.width = 512;
	context.canvas.height = 64
	var textWidth = metrics.width;

	context.fillStyle = "rgba(" + parameters.backgroundColor.join(',') + ")";
	context.strokeStyle = "rgba(" + parameters.borderColor.join(',') + ")";
	context.lineWidth = parameters.borderThickness;
	roundRect(
		context,
		(context.canvas.width - parameters.borderThickness - textWidth) * 0.5,
		(context.canvas.height - parameters.size * 1.4 - parameters.borderThickness) * 0.5,
		textWidth + parameters.borderThickness,
		parameters.size * 1.4 + parameters.borderThickness,
		8);

	context.textAlign = 'center';
	context.fillStyle = "rgba(" + parameters.textColor.join(',') + ")";
	context.font = "Bold " + parameters.size + "px " + parameters.font;
	context.fillText(text, context.canvas.width  * 0.5, (context.canvas.height  + parameters.size * 0.7) * 0.5); 
	
	var texture = new THREE.Texture(canvas);
	texture.needsUpdate = true;
	var sprite = new THREE.Sprite(new THREE.SpriteMaterial({map: texture}));
	sprite.scale.set(1.0, 1.0 * context.canvas.height / context.canvas.width, 1);
	return sprite;
}

