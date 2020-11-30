function SetupGUI(particleSystem)
{
	var guiData = 
	{
		count:528000,
		scaleA:0.05,
		scaleB:0.05,
		lifetimeA:2.3,
		lifetimeB:3.4,
		
		gravityA:30,
		gravityB:30,

		startingColorA: [ 255, 0, 0 ],
		startingColorB: [ 103, 0, 83 ],
		endingColorA: [ 0, 0, 255 ],
		endingColorB: [ 0, 0, 255 ],
		
		velocityA1: -0.2,
		velocityA2: 0.1,
		velocityA3: -0.2,
		
		velocityB1: .2,
		velocityB2: .5,
		velocityB3: .2,
		
		positionA1: -1,
		positionA2: 0,
		positionA3: -1,
		
		positionB1: 1,
		positionB2: 0,
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

		//particleSystem.gravityStrengthValue.setRandomLerp(guiData.gravityA,guiData.gravityB);

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
	//gui.add( guiData, 'gravityA', 0, 30).name( 'Min Gravity' ).onChange(onGUIChange);
	//gui.add( guiData, 'gravityB', 0, 30).name( 'Max Gravity' ).onChange(onGUIChange);

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

var lastMousePosition = [0, 0]
var dragging = false
var canvas = null;
var rx = 0;
var ry = 0;
var zoom = 10;

function setupControls()
{
	canvas.addEventListener('mousedown', onMouseDown, false)
	canvas.addEventListener('wheel', onWheel,false);
	window.addEventListener('mousemove', onMouseMove, false)
	window.addEventListener('mouseup', onMouseUp, false)
}

function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
	const y = event.clientY - rect.top
	return [x,y];
}

function onWheel(e)
{
	zoom += e.deltaY*0.1 ;

	if(zoom < 0.1)
		zoom = 0.1;
}

function onMouseDown(e)
{
	lastMousePosition = getCursorPosition(canvas,e);
    dragging = true
}

function onMouseUp(e)
{
	dragging = false
}

function onMouseMove(e)
{
	if(dragging == false)
		return;

	var newMousePosition = getCursorPosition(canvas,e);
	var dx = newMousePosition[0] - lastMousePosition[0];
	var dy = newMousePosition[1] - lastMousePosition[1];

	rx -= dx*0.005;
	ry += dy*0.001;
	lastMousePosition = newMousePosition;
}

function runDemo(gl, sinVertShader, simFragShader, renVertShader, renFragShader) 
{
	setupControls();

	console.log("Starting");

	var particleSystem = new SimpleParticleSystem(gl)
	particleSystem.setSimShaders(sinVertShader,simFragShader)
	particleSystem.setRenderShaders(renVertShader,renFragShader)
	particleSystem.initialize();

	var updateFunction = SetupGUI(particleSystem);
	updateFunction();

	
	var projectionMatrix = get_projection(40, canvas.width / canvas.height, 1, 100);

	var timeOld = 0;

	var animate = function (time) {

		var dt = time-timeOld;

		//Camera 
		var cameraMatrix = m4.translate(m4.identity(),zoom*Math.sin(rx),zoom*Math.sin(ry*4),zoom*Math.cos(rx));
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
