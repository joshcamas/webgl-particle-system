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

function randomColor(array)
{
    x = Math.random();
    y = Math.random();
    z = Math.random();

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
        
        this.program_sim = CreateProgram(gl,this.shader_sim_vert,this.shader_sim_frag,["o_position","o_color"]);
        this.program_ren = CreateProgram(gl,this.shader_ren_vert,this.shader_ren_frag,[]);
        
        this.stateA = new ParticleBuffer(gl,this.program_sim,this.program_ren);
        this.stateA.initialize();

        this.stateB = new ParticleBuffer(gl,this.program_sim,this.program_ren);
        this.stateB.initialize();
        
        var initialData = [];
        var particleCount = 100;

        for(var i = 0; i < particleCount; i++)
        {
            randomPosition(1,initialData);
            randomColor(initialData);
        }

        initialData = new Float32Array(initialData);

        this.stateA.setInitialData(initialData,particleCount);
        this.stateB.setInitialData(initialData,particleCount);

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

class ParticleBuffer
{
    constructor(gl,program_sim,program_ren)
    {
        this.gl = gl;

        this.buffer = gl.createBuffer();

        this.sim = new ParticleBufferSection(gl,program_sim,this.buffer);
        this.ren = new ParticleBufferSection(gl,program_ren,this.buffer);
    }

    initialize()
    {
        //Attributes for sim
        gl.bindVertexArray(this.sim.vao);
        this.sim.addAttribute(0);
        this.sim.addAttribute(12);

        //Attributes for ren
        gl.bindVertexArray(this.ren.vao);
        this.ren.addAttribute(0);
        this.ren.addAttribute(12);

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

    addAttribute(location,num_components=4,type=gl.FLOAT)
    {
        var gl = this.gl;

        var stride = 32;
        var type_size = 4;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.vertexAttribPointer(location, num_components, type, false, stride, this.offset);
        gl.enableVertexAttribArray(location);

        this.offset += num_components * type_size;

        //if(divisor > 0)
        //    gl.vertexAttribDivisor(location,divisor);
    }
}