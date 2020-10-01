var SIZE_V4C4 = 32;

function randomPosition(range,array)
{
    x = Math.random()*range*2 - range;
    y = Math.random()*range*2 - range;
    z = Math.random()*range*2 - range;

    array.push(x);
    array.push(y);
    array.push(z);
    array.push(1);

}

class ParticleSystem
{
    constructor(gl)
    {
        this.gl = gl;
        this.simStateA = true;
    }

    setSimShaders(vert,frag)
    {
        this.shader_sim_vert = vert
        this.shader_sim_frag = frag
    }

    setRenderShaders(vert,frag)
    {
        this.shader_ren_vert = vert
        this.shader_ren_frag = frag
    }

    createInitialState()
    {
        gl = this.gl
        
        this.program_sim = CreateProgram(gl,this.shader_sim_vert,this.shader_sim_frag,["o_Position"]);
        this.program_ren = CreateProgram(gl,this.shader_ren_vert,this.shader_ren_frag,[]);
        
        this.stateA = new ParticleState(gl,this.program_sim,this.program_ren);
        this.stateA.initialize();

        this.stateB = new ParticleState(gl,this.program_sim,this.program_ren);
        this.stateB.initialize();
        
        var vertices_f = []

        for(var i = 0; i < 100; i++)
            randomPosition(1,vertices_f);

        this.vertices = new Float32Array(vertices_f);

        this.stateA.setVertices(this.vertices);
        this.stateB.setVertices(this.vertices);

        //Matrices
        this.pMatrix = gl.getUniformLocation(this.program_ren, "Pmatrix");
        this.vMatrix = gl.getUniformLocation(this.program_ren, "Vmatrix");
        this.deltatime = this.gl.getUniformLocation(this.program_sim, "uDeltaTime");

    }

    draw(deltatime,projectionMatrix,viewMatrix)
    {
        var gl = this.gl;
        
        var simState = this.simStateA ? this.stateA : this.stateB;
        var renderState =  this.simStateA ? this.stateB : this.stateA;
        
        //Step 1 - simulate

        //Disable raster for simulation
        gl.enable(gl.RASTERIZER_DISCARD);

        //Start using simulation program
        gl.useProgram(this.program_sim);
        
        //Update attributes
        gl.uniform1f(this.deltatime, deltatime);

        gl.bindVertexArray(simState.vao_sim);
        gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, renderState.buffer);
        
        gl.beginTransformFeedback(gl.POINTS);
        gl.drawArrays(gl.POINTS, 0, simState.particleCount);
        gl.endTransformFeedback();

        //Stop simulation
        gl.disable(gl.RASTERIZER_DISCARD);
        gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, null);

        //Step 2 - render

        gl.useProgram(this.program_ren);

		//Update matrices
		gl.uniformMatrix4fv(this.pMatrix, false, projectionMatrix);
		gl.uniformMatrix4fv(this.vMatrix, false, viewMatrix);
        
        gl.bindVertexArray(renderState.vao_ren);
        gl.drawArrays(gl.POINTS, 0, renderState.particleCount);
        gl.bindVertexArray(null);
        
        this.simStateA = !this.simStateA;

    }
}

function CreateProgram(gl, vertShader, fragShader, varyings = null)
{
    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertShader);
    gl.attachShader(shaderProgram, fragShader);

    if(varyings != null)
        gl.transformFeedbackVaryings(shaderProgram, varyings, gl.INTERLEAVED_ATTRIBS);

    gl.linkProgram(shaderProgram);
    return shaderProgram;
}

class ParticleState
{
    constructor(gl,program_sim,program_ren)
    {
        this.gl = gl;
        this.program_sim = program_sim;
        this.program_ren = program_ren;
    }

    initialize()
    {
        var gl = this.gl;

        this.buffer = gl.createBuffer();
        
        //Vertex arrays
        this.vao_sim = gl.createVertexArray()
        this.vao_ren = gl.createVertexArray()

        gl.bindVertexArray(this.vao_sim);

        //THIS SHOULD BE A ATTRIBUTE LOCATION. NOT MANUAL
        var vertexPosLocation = gl.getAttribLocation(this.program_sim, "i_position")
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.vertexAttribPointer(vertexPosLocation, 4, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.enableVertexAttribArray(vertexPosLocation);

        //Shoudln't need this
        gl.bindVertexArray(null);

        gl.bindVertexArray(this.vao_ren);

        //THIS SHOULD BE A ATTRIBUTE LOCATION. NOT MANUAL
        var vertexPosLocationFeedback = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.vertexAttribPointer(vertexPosLocationFeedback, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vertexPosLocationFeedback);

        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindVertexArray(null);

    }

    setVertices(vertices)
    {
        var gl = this.gl;

        this.vertices = vertices;
        this.particleCount = vertices.length / 4;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

    }
}