
//Base particle system class - this contains no hardcoded parameters - no position, colors, etc
class ParticleSystemBase
{
    constructor(gl)
    {
        this.gl = gl;

        this.simStateA = true;
        this.particleCount = 0;

    }

    //Override this to set buffer data
    _getBufferData()
    {
        return new BufferData();
    }

    //Override this to define initial attribute values per particle
    _getInitialData()
    {
        return [];
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

    initialize()
    {
        gl = this.gl
        
        this.bufferdata = this._getBufferData();

        this.program_sim = CreateProgram(gl,this.shader_sim_vert,this.shader_sim_frag,this.bufferdata.getOutputParameters());
        this.program_ren = CreateProgram(gl,this.shader_ren_vert,this.shader_ren_frag,[]);
        
        this.stateA = new ParticleBuffer(gl,this.program_sim,this.program_ren);
        this.stateA.initialize(this.bufferdata);

        this.stateB = new ParticleBuffer(gl,this.program_sim,this.program_ren);
        this.stateB.initialize(this.bufferdata);
        
        //Matrices
        this.pMatrix = gl.getUniformLocation(this.program_ren, "Pmatrix");
        this.vMatrix = gl.getUniformLocation(this.program_ren, "Vmatrix");
        this.time = this.gl.getUniformLocation(this.program_sim, "uTime");
        this.deltatime = this.gl.getUniformLocation(this.program_sim, "uDeltaTime");
    }

    restartSimulation()
    {
        var initialData = this._getInitialData();

        this.stateA.setInitialData(initialData,this.particleCount);
        this.stateB.setInitialData(initialData,this.particleCount);

        console.log("Started Simulation");
    }

    draw(time,deltatime,projectionMatrix,viewMatrix)
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
        gl.uniform1f(this.time, time);
        gl.uniform1f(this.deltatime, deltatime);

        gl.bindVertexArray(simState.sim.vao);
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
        
        gl.bindVertexArray(renderState.ren.vao);
        gl.drawArrays(gl.POINTS, 0, renderState.particleCount);
        gl.bindVertexArray(null);
        
        //Swap buffers
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

//A master buffer holding both simulation and rendering buffer sections
class ParticleBuffer
{
    constructor(gl,program_sim,program_ren)
    {
        this.gl = gl;

        this.buffer = gl.createBuffer();

        this.sim = new ParticleBufferSection(gl,program_sim,this.buffer);
        this.ren = new ParticleBufferSection(gl,program_ren,this.buffer);
    }

    initialize(bufferData)
    {
        var inputParams = bufferData.getInputParameters();
        
        gl.bindVertexArray(this.sim.vao);

        for(var i = 0; i < inputParams.length; i++)
            this.sim.addAttribute(inputParams[i],bufferData.stride,bufferData.parameters[i].num_components);
            
        gl.bindVertexArray(this.ren.vao);
        
        for(var i = 0; i < inputParams.length; i++)
            this.ren.addAttribute(inputParams[i],bufferData.stride,bufferData.parameters[i].num_components);
            
        //Clean up
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindVertexArray(null);

    }

    setInitialData(data,particleCount)
    {
        var gl = this.gl;

        this.particleCount = particleCount;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STREAM_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

    }
}

//There are two sections of a particle buffer - simulation and render 
class ParticleBufferSection
{
    constructor(gl,program,buffer)
    {
        this.gl = gl;
        this.program = program;
        this.buffer = buffer;

        this.vao = gl.createVertexArray();
        this.offset = 0;
    }

    addAttribute(name,stride,num_components=3,type=gl.FLOAT)
    {
        var gl = this.gl;

        //Stride is total size
        var type_size = 4;

        var alocation = gl.getAttribLocation(this.program, name);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.vertexAttribPointer(alocation, num_components, type, false, stride, this.offset);
        gl.enableVertexAttribArray(alocation);
        
        this.offset += num_components * type_size;
    }
}

//Holds a list of attributes that is used for both buffer sections. 
//The ID is special - input values will be "i_attributeid", while output values will be "o_attributeid"
class BufferData
{
    constructor()
    {
        this.parameters = [];
        this.stride = 0;
    }

    addParameter(id, num_components)
    {
        this.parameters.push({id:id,num_components:num_components});
        this.stride += 4*num_components;
    }

    getOutputParameters()
    {
        var outputParams = [];

        for(var i = 0; i < this.parameters.length; i++)
            outputParams.push("o_" +  this.parameters[i].id);

        return outputParams;
    }
    
    getInputParameters()
    {
        var inputParams = [];

        for(var i = 0; i < this.parameters.length; i++)
            inputParams.push("i_" +  this.parameters[i].id);

        return inputParams;
    }
}
