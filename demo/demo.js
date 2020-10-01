function SetupGUI(particleSystem)
{
	var guiData = 
	{
		count:128000,
		scaleA:0.2,
		scaleB:0.5,
		lifetimeA:2.3,
		lifetimeB:3.4,
		
		gravityA:3,
		gravityB:4,

		startingColorA: [ 255, 255, 255 ],
		startingColorB: [ 0, 0, 0 ],
		endingColorA: [ 0, 0, 255 ],
		endingColorB: [ 0, 0, 255 ],
		
		velocityA1: -1,
		velocityA2: -1,
		velocityA3: -1,
		
		velocityB1: 1,
		velocityB2: 1,
		velocityB3: 1,
		
		positionA1: 0.5,
		positionA2: 0.5,
		positionA3: 0.5,
		
		positionB1: 1,
		positionB2: 1,
		positionB3: 1
	}

	function onGUIChange()
	{
		updateParticles(particleSystem);
	}

	function updateParticles(particleSystem)
	{
		va = [guiData.velocityA1,guiData.velocityA2,guiData.velocityA3];
		vb = [guiData.velocityB1,guiData.velocityB2,guiData.velocityB3];
		
		pa = [guiData.positionA1,guiData.positionA2,guiData.positionA3];
		pb = [guiData.positionB1,guiData.positionB2,guiData.positionB3];

		particleSystem.gravityStrengthValue.setRandomLerp(guiData.gravityA,guiData.gravityB);

		particleSystem.lifetimeValue.setRandomLerp(guiData.lifetimeA,guiData.lifetimeB);
		particleSystem.scaleValue.setRandomLerp(guiData.scaleA,guiData.scaleB);
		particleSystem.velocityValue.setRandomLerp(va,vb);
		particleSystem.positionValue.setRandomLerp(pa,pb);
		particleSystem.startingColorValue.setRandomLerp(convertColor(guiData.startingColorA),convertColor(guiData.startingColorB));
		particleSystem.endingColorValue.setRandomLerp(convertColor(guiData.endingColorA),convertColor(guiData.endingColorB));
		particleSystem.particleCount = guiData.count;
		particleSystem.restartSimulation();
	}

	//GUI
	var gui = new dat.GUI({name: 'Particle System'});

	//Count
	gui.add( guiData, 'count', 0, 1000000).name( 'Particle Count' ).onChange(onGUIChange);

	//Lifetime
	gui.add( guiData, 'lifetimeA', 0.001, 10).name( 'Min Lifetime' ).onChange(onGUIChange);
	gui.add( guiData, 'lifetimeB', 0.001, 10).name( 'Max Lifetime' ).onChange(onGUIChange);

	//Scale
	gui.add( guiData, 'scaleA', 0, 1).name( 'Min Scale' ).onChange(onGUIChange);
	gui.add( guiData, 'scaleB', 0, 1).name( 'Max Scale' ).onChange(onGUIChange);

	//Gravity
	gui.add( guiData, 'gravityA', 0, 10).name( 'Min Gravity' ).onChange(onGUIChange);
	gui.add( guiData, 'gravityB', 0, 10).name( 'Max Gravity' ).onChange(onGUIChange);

	//Starting Color
	var startingColor = gui.addFolder("Starting Color");
	startingColor.addColor( guiData, 'startingColorA' ).name( 'A' ).onChange(onGUIChange);
	startingColor.addColor( guiData, 'startingColorB' ).name( 'B' ).onChange(onGUIChange);
	
	//Ending Color
	var endingColor = gui.addFolder("Ending Color");
	endingColor.addColor( guiData, 'endingColorA' ).name( 'A' ).onChange(onGUIChange);
	endingColor.addColor( guiData, 'endingColorB' ).name( 'B' ).onChange(onGUIChange);
	
	var minPosition = gui.addFolder("Min Position");
	minPosition.add(guiData, 'positionA1', -2, 2).name( 'X' ).onChange(onGUIChange);
	minPosition.add(guiData, 'positionA2', -2, 2).name( 'Y' ).onChange(onGUIChange);
	minPosition.add(guiData, 'positionA3', -2, 2).name( 'Z' ).onChange(onGUIChange);
	
	var maxPosition = gui.addFolder("Max Position");
	maxPosition.add(guiData, 'positionB1', -2, 2).name( 'X' ).onChange(onGUIChange);
	maxPosition.add(guiData, 'positionB2', -2, 2).name( 'Y' ).onChange(onGUIChange);
	maxPosition.add(guiData, 'positionB3', -2, 2).name( 'Z' ).onChange(onGUIChange);
	
	var minVelocity = gui.addFolder("Min Velocity");
	minVelocity.add(guiData, 'velocityA1', -5, 5).name( 'X' ).onChange(onGUIChange);
	minVelocity.add(guiData, 'velocityA2', -5, 5).name( 'Y' ).onChange(onGUIChange);
	minVelocity.add(guiData, 'velocityA3', -5, 5).name( 'Z' ).onChange(onGUIChange);
	
	var maxVelocity = gui.addFolder("Max Velocity");
	maxVelocity.add(guiData, 'velocityB1', -5, 5).name( 'X' ).onChange(onGUIChange);
	maxVelocity.add(guiData, 'velocityB2', -5, 5).name( 'Y' ).onChange(onGUIChange);
	maxVelocity.add(guiData, 'velocityB3', -5, 5).name( 'Z' ).onChange(onGUIChange);
	
	return onGUIChange;
}

function runDemo(gl, sinVertShader, simFragShader, renVertShader, renFragShader) 
{
	console.log("Starting");

	var particleSystem = new ParticleSystem(gl)
	particleSystem.setSimShaders(sinVertShader,simFragShader)
	particleSystem.setRenderShaders(renVertShader,renFragShader)
	particleSystem.initialize();

	var updateFunction = SetupGUI(particleSystem);
	updateFunction();

	
	var projectionMatrix = get_projection(40, canvas.width / canvas.height, 1, 100);
	var viewMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

	// translating z
	viewMatrix[14] = viewMatrix[14] - 6;//zoom out

	var timeOld = 0;

	var animate = function (time) {

		var dt = time-timeOld;
		//rotateY(viewMatrix, dt*0.001);
		timeOld = time;
			
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);
		gl.clearColor(0.5, 0.5, 0.5, 0.9);
		gl.clearDepth(1.0);
		gl.viewport(0.0, 0.0, canvas.width, canvas.height);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		particleSystem.draw(time,dt/1000,projectionMatrix,viewMatrix)

		window.requestAnimationFrame(animate);
	}
	animate(0);
}

function convertColor(color)
{
	return [
		color[0] / 255.0,
		color[1] / 255.0,
		color[2] / 255.0];
}