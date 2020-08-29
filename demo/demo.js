
function buildGUI(particleSystems)
{
	var guiData = 
	{
		count:128000,
		scaleA:0.01,
		scaleB:0.01,
		lifetimeA:.1,
		lifetimeB:3,
		colorA: [ 0, 128, 255 ],
		colorB: [ 0, 128, 255 ]
	}

	function onGUIChange()
	{
		for(var i = 0; i < particleSystems.length; i++)
			updateParticles(particleSystems[i]);
	}

	function updateParticles(particleSystem)
	{
		particleSystem.lifetimeValue.setRandomLerp(guiData.lifetimeA,guiData.lifetimeB);
		particleSystem.scaleValue.setRandomLerp(guiData.scaleA,guiData.scaleB);
		particleSystem.velocityValue.setRandomLerp([0,1,0],[1,1,1])
		particleSystem.colorValue.setRandomLerp(convertColor(guiData.colorA),convertColor(guiData.colorB))
		particleSystem.particleCount = guiData.count / 8;
		particleSystem.createInitialState();
		particleSystem.applyShaderValues();
	}

	//GUI
	var gui = new dat.GUI({name: 'Particle System'});

	//Count
	gui.add( guiData, 'count', 0, 64000/4*8).name( 'Particle Count' ).onChange(onGUIChange);

	//Lifetime
	gui.add( guiData, 'lifetimeA', 0.001, 10).name( 'Min Lifetime' ).onChange(onGUIChange);
	gui.add( guiData, 'lifetimeB', 0.001, 10).name( 'Max Lifetime' ).onChange(onGUIChange);

	//Scale
	gui.add( guiData, 'scaleA', 0.001, 3).name( 'Min Scale' ).onChange(onGUIChange);
	gui.add( guiData, 'scaleB', 0.001, 3).name( 'Max Scale' ).onChange(onGUIChange);

	//Color
	gui.addColor( guiData, 'colorA' ).name( 'Particle Color A' ).onChange(onGUIChange);
	gui.addColor( guiData, 'colorB' ).name( 'Particle Color B' ).onChange(onGUIChange);

	return onGUIChange;
}

function convertColor(color)
{
	return [
		parseInt(color[0] / 16),
		parseInt(color[1] / 16),
		parseInt(color[2] / 16)];
}

function runDemo(gl, vertShader, fragShader) {

	/*Shader*/
	var shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertShader);
	gl.attachShader(shaderProgram, fragShader);
	gl.linkProgram(shaderProgram);
	gl.useProgram(shaderProgram);

	//Make several particle systems!
	var particleSystems = [];

	//Push tons of particle systems to upgrade the max number of particles per system (16000)
	particleSystems.push(new ParticleSystem(gl,shaderProgram));
	particleSystems.push(new ParticleSystem(gl,shaderProgram));
	particleSystems.push(new ParticleSystem(gl,shaderProgram));
	particleSystems.push(new ParticleSystem(gl,shaderProgram));
	particleSystems.push(new ParticleSystem(gl,shaderProgram));
	particleSystems.push(new ParticleSystem(gl,shaderProgram));
	particleSystems.push(new ParticleSystem(gl,shaderProgram));
	particleSystems.push(new ParticleSystem(gl,shaderProgram));

	updateFunction = buildGUI(particleSystems);
	updateFunction();

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

		for(var i = 0; i < particleSystems.length; i++)
		particleSystems[i].draw(time,projectionMatrix,viewMatrix)

		window.requestAnimationFrame(animate);
	}
	animate(0);
}

