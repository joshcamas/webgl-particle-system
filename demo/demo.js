
function buildGUI(particleSystems)
{
	var guiData = 
	{
		count:128000,
		scaleA:1,
		scaleB:1.5,
		lifetimeA:2.3,
		lifetimeB:3.4,
		startingColor: [ 255, 255, 255 ],
		endingColor: [ 0, 0, 255 ],
		
		velocityA1: 0,
		velocityA2: 1,
		velocityA3: 0,
		
		
		velocityB1: 1,
		velocityB2: 1,
		velocityB3: 1
	}

	function onGUIChange()
	{
		for(var i = 0; i < particleSystems.length; i++)
			updateParticles(particleSystems[i]);
	}

	function updateParticles(particleSystem)
	{
		va = [guiData.velocityA1,guiData.velocityA2,guiData.velocityA3];
		vb = [guiData.velocityB1,guiData.velocityB2,guiData.velocityB3];
		
		particleSystem.lifetimeValue.setRandomLerp(guiData.lifetimeA,guiData.lifetimeB);
		particleSystem.scaleValue.setRandomLerp(guiData.scaleA,guiData.scaleB);
		particleSystem.velocityValue.setRandomLerp(va,vb);
		particleSystem.startingColorValue.setValue(convertColor(guiData.startingColor));
		particleSystem.endingColorValue.setValue(convertColor(guiData.endingColor));
		particleSystem.particleCount = guiData.count;
		particleSystem.createInitialState();
		particleSystem.applyShaderValues();
	}

	//GUI
	var gui = new dat.GUI({name: 'Particle System'});

	//Count
	gui.add( guiData, 'count', 0, 1000000).name( 'Particle Count' ).onChange(onGUIChange);

	//Lifetime
	gui.add( guiData, 'lifetimeA', 0.001, 10).name( 'Min Lifetime' ).onChange(onGUIChange);
	gui.add( guiData, 'lifetimeB', 0.001, 10).name( 'Max Lifetime' ).onChange(onGUIChange);

	//Scale
	gui.add( guiData, 'scaleA', 1, 10).name( 'Min Scale' ).onChange(onGUIChange);
	gui.add( guiData, 'scaleB', 1, 10).name( 'Max Scale' ).onChange(onGUIChange);

	//Color
	gui.addColor( guiData, 'startingColor' ).name( 'Starting Color' ).onChange(onGUIChange);
	gui.addColor( guiData, 'endingColor' ).name( 'Ending Color' ).onChange(onGUIChange);
	
	var minVelocity = gui.addFolder("Min Velocity");
	minVelocity.add(guiData, 'velocityA1', -1, 1).name( 'X' ).onChange(onGUIChange);
	minVelocity.add(guiData, 'velocityA2', -1, 1).name( 'Y' ).onChange(onGUIChange);
	minVelocity.add(guiData, 'velocityA3', -1, 1).name( 'Z' ).onChange(onGUIChange);
	
	var maxVelocity = gui.addFolder("Max Velocity");
	maxVelocity.add(guiData, 'velocityB1', -1, 1).name( 'X' ).onChange(onGUIChange);
	maxVelocity.add(guiData, 'velocityB2', -1, 1).name( 'Y' ).onChange(onGUIChange);
	maxVelocity.add(guiData, 'velocityB3', -1, 1).name( 'Z' ).onChange(onGUIChange);
	
	return onGUIChange;
}

function convertColor(color)
{
	return [
		color[0] / 255.0,
		color[1] / 255.0,
		color[2] / 255.0];
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

