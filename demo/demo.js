
function runDemo(gl, sinVertShader, simFragShader, renVertShader, renFragShader) 
{
	console.log("Starting");

	var particleSystem = new ParticleSystem(gl)
	particleSystem.setSimShaders(sinVertShader,simFragShader)
	particleSystem.setRenderShaders(renVertShader,renFragShader)
	particleSystem.createInitialState();

	//updateFunction = buildGUI(particleSystem);
	//updateFunction();

	var projectionMatrix = get_projection(40, canvas.width / canvas.height, 1, 100);
	var viewMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

	// translating z
	viewMatrix[14] = viewMatrix[14] - 6;//zoom out

	var timeOld = 0;

	var animate = function (time) {

		var dt = time-timeOld;
		rotateY(viewMatrix, dt*0.001);
		timeOld = time;
			
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);
		gl.clearColor(0.5, 0.5, 0.5, 0.9);
		gl.clearDepth(1.0);
		gl.viewport(0.0, 0.0, canvas.width, canvas.height);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		particleSystem.draw(time,projectionMatrix,viewMatrix)

		window.requestAnimationFrame(animate);
	}
	animate(0);
}

