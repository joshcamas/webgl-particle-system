
class ParticleSystem
{
    constructor(gl)
    {
        this.gl = gl;

        this.simStateA = true;

        this.lifetimeValue = new FloatValue();
        this.scaleValue = new FloatValue();
        this.gravityStrengthValue = new FloatValue();
        this.velocityValue = new Vector3Value();
        this.positionValue = new Vector3Value();
        this.startingColorValue = new ColorValue();
        this.endingColorValue = new ColorValue();
        this.particleCount = 0;


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
        
        this.program_sim = CreateProgram(gl,this.shader_sim_vert,this.shader_sim_frag,["o_position","o_velocity","o_color","o_scale","o_gravityStrength"]);
        this.program_ren = CreateProgram(gl,this.shader_ren_vert,this.shader_ren_frag,[]);
        
        this.stateA = new ParticleBuffer(gl,this.program_sim,this.program_ren);
        this.stateA.initialize();

        this.stateB = new ParticleBuffer(gl,this.program_sim,this.program_ren);
        this.stateB.initialize();
        
        //Matrices
        this.pMatrix = gl.getUniformLocation(this.program_ren, "Pmatrix");
        this.vMatrix = gl.getUniformLocation(this.program_ren, "Vmatrix");
        this.time = this.gl.getUniformLocation(this.program_sim, "uTime");
        this.deltatime = this.gl.getUniformLocation(this.program_sim, "uDeltaTime");

    }

    restartSimulation()
    {
        var initialData = this.getInitialData();

        this.stateA.setInitialData(initialData,this.particleCount);
        this.stateB.setInitialData(initialData,this.particleCount);

        console.log("Started Simulation");
    }

    getInitialData()
    {
        var initialData = [];

        for(var i = 0; i < this.particleCount; i++)
        {
            var p = this.positionValue.getValue();
            initialData.push(p[0]);
            initialData.push(p[1]);
            initialData.push(p[2]);

            var v = this.velocityValue.getValue();
            initialData.push(v[0]);
            initialData.push(v[1]);
            initialData.push(v[2]);    

            var c = this.startingColorValue.getValue();
            initialData.push(c[0]);
            initialData.push(c[1]);
            initialData.push(c[2]);
            
            initialData.push(this.scaleValue.getValue());  
            initialData.push(this.gravityStrengthValue.getValue())
        }

        //This... is needed? Why? No idea
        initialData.push(0);
        
        return new Float32Array(initialData);
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
        var simstride = 4*3*3 + 4*2;

        gl.bindVertexArray(this.sim.vao);
        this.sim.addAttribute("i_position",simstride);
        this.sim.addAttribute("i_velocity",simstride);
        this.sim.addAttribute("i_color",simstride);
        this.sim.addAttribute("i_scale",simstride,1);
        this.sim.addAttribute("i_gravityStrength",simstride,1);

        //Attributes for ren
        var renstride = 4*3*3 + 4*2;

        gl.bindVertexArray(this.ren.vao);
        this.ren.addAttribute("i_position",renstride);
        this.ren.addAttribute("i_velocity",renstride);
        this.ren.addAttribute("i_color",renstride);
        this.ren.addAttribute("i_scale",renstride,1);
        this.sim.addAttribute("i_gravityStrength",renstride,1);

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