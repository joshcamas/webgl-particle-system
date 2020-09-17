
class ParticleSystem
{
    constructor(gl,shaderProgram)
    {
        this.gl = gl;
        this.shaderProgram = shaderProgram;

        //Attributes
        this.lifetimeValue = new FloatValue(1);
        this.scaleValue = new FloatValue(1);
        this.velocityValue = new Vector3Value([0,0,0]);
        this.startingColorValue = new ColorValue([1,0,0]);
        this.endingColorValue = new ColorValue([1,0,0]);

        this.particleCount = 0;
    }

    createInitialState()
    {
        //Shader values
        this.uvs = [];
        this.indices = [];
        this.particlePositions = [];
        this.startingColors = [];
        this.endingColors = [];
        this.lifetimes = [];
        this.velocities = [];
        this.scales = [];

        for (var i = 0; i < this.particleCount; i++) {
            
            var initialPosition = [0,0,0];
            var lifetime = this.lifetimeValue.getValue();
            var initialVelocity = this.velocityValue.getValue();
            var startingColor = this.startingColorValue.getValue();
            var endingColor = this.endingColorValue.getValue();
			var scale = this.scaleValue.getValue();
			
			this.lifetimes.push(lifetime * 1000); //Convert from seconds to milliseconds

			this.scales.push(scale);

			this.particlePositions.push(initialPosition[0],initialPosition[1],initialPosition[2]);
			
			this.startingColors.push(
				startingColor[0],
				startingColor[1],
				startingColor[2]);
			
			this.endingColors.push(
				endingColor[0],
				endingColor[1],
				endingColor[2]);
				
			this.velocities.push(
				initialVelocity[0] / 1000,
				initialVelocity[1] / 1000,
				initialVelocity[2] / 1000); //Convert from seconds to milliseconds

        }
    }

    applyShaderValues()
    {
        //Matrices
        this.pMatrix = this.gl.getUniformLocation(this.shaderProgram, "Pmatrix");
        this.vMatrix = this.gl.getUniformLocation(this.shaderProgram, "Vmatrix");
		
		this.vertex_buffer = createBuffer(this.gl,this.particlePositions);
		bindBuffer(this.vertex_buffer, this.gl, this.shaderProgram, "aParticlePosition", 3);
		
        //Attributes
        createAndBindBuffer(this.gl,this.shaderProgram,this.scales,"aScale",1)
        createAndBindBuffer(this.gl,this.shaderProgram,this.startingColors,"aStartingColor",3)
        createAndBindBuffer(this.gl,this.shaderProgram,this.endingColors,"aEndingColor",3)
        createAndBindBuffer(this.gl,this.shaderProgram,this.velocities,"aVelocity",3)
        createAndBindBuffer(this.gl,this.shaderProgram,this.lifetimes,"aLifetime",1);
    
        //Time
        this.time = this.gl.getUniformLocation(this.shaderProgram, "uTime");
    
    }

    draw(time,projectionMatrix,viewMatrix)
    {
		//Push updates of time
		//Temp offset to stop initialization bug. Will fix this another day
		this.gl.uniform1f(this.time, time+100000);

		//Update matrices
		this.gl.uniformMatrix4fv(this.pMatrix, false, projectionMatrix);
		this.gl.uniformMatrix4fv(this.vMatrix, false, viewMatrix);
		
        //Update indices
		this.gl.drawArrays(this.gl.POINTS, 0, this.particleCount);
		
    }
}
