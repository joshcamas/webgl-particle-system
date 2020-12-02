
var input;

function runDemo(gl, sinVertShader, simFragShader, renVertShader, renFragShader) 
{
	input = new Input(canvas);
	
	console.log("Starting");

	var particleSystem = new SimpleParticleSystem(gl);
	particleSystem.setSimShaders(sinVertShader,simFragShader);
	particleSystem.setRenderShaders(renVertShader,renFragShader);
	particleSystem.initialize();

	//Set up
	particleSystem.scaleValue.setRandomLerp(2,4);
	particleSystem.velocityValue.setRandomLerp([-0.1,0.,-0.1],[0.1,.5,0.1]);
	particleSystem.positionValue.setRandomLerp([-1,-1,-1],[1,1,1]);
	particleSystem.startingColorValue.setRandomLerp([1,1,1],[1,1,1]);
	particleSystem.particleCount = 1000;

	//var light = new Light();
	//light.color = convertColor(guiData.lightColor);
	//light.position = lp;
	//light.intensity = guiData.lightIntensity;
	//light.range = guiData.lightRange;
	
	particleSystem.setLighting(null,[1,1,1])
	
	//Attach texture module
	var texModule = new TextureModule("logo.png",particleSystem,gl);
	particleSystem.addModule(texModule);
	
	particleSystem.restartSimulation();

	var projectionMatrix = get_projection(40, canvas.width / canvas.height, 0.1, 100);

	var timeOld = 0;

	var animate = function (time) {

		var dt = time-timeOld;

		//Camera 
		var cameraMatrix = m4.translate(m4.identity(),input.zoom*Math.sin(input.rx),1+input.zoom*Math.sin(input.ry*4),input.zoom*Math.cos(input.rx));
		var up = [0, 1, 0];
		
		var cameraPosition = [
			cameraMatrix[12],
			cameraMatrix[13],
			cameraMatrix[14],
		  ];
		  
		cameraMatrix = m4.lookAt(cameraPosition, [0,2,0], up);

		timeOld = time;
		
		viewMatrix = m4.inverse(cameraMatrix);

		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LESS);
		gl.disable(gl.CULL_FACE);
		gl.clearColor(0.5, 0.5, 0.5, 0.9);
		gl.clearDepth(1.0);
		gl.viewport(0.0, 0.0, canvas.width, canvas.height);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		particleSystem.draw(time,dt/1000,projectionMatrix,viewMatrix)

		window.requestAnimationFrame(animate);
	}
	animate(0);
}
