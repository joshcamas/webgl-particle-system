class Light
{
    constructor()
    {
        this.position = [0,0,0];
        this.color = [0,0,0];
        this.intensity = 0;
        this.range = 0;
    }
}

//A particle system with builtin 
class SimpleParticleSystem extends ParticleSystemBase
{    
    constructor(gl)
    {
        super(gl);
        
        this.lifetimeValue = new FloatValue();
        this.scaleValue = new FloatValue();
        this.velocityValue = new Vector3Value();
        this.positionValue = new Vector3Value();
        this.startingColorValue = new ColorValue();
        this.endingColorValue = new ColorValue();
        //this.gravityStrengthValue = new FloatValue();
    }

    setLighting(light,ambientColor)
    {
        this.light = light;
        this.ambientColor = ambientColor;
    }

    initialize()
    {
        super.initialize();
        
        this.light = null;
        this.ambientColor = null;
        this.uLightPosition = gl.getUniformLocation(this.program_ren, "lightPosition");
        this.uLightColor = gl.getUniformLocation(this.program_ren, "lightColor");
        this.uLightRange = this.gl.getUniformLocation(this.program_ren, "lightRange");
        this.uAmbientLightColor = this.gl.getUniformLocation(this.program_ren, "ambientLightColor");

        gl.useProgram(this.program_ren);
        //By default, use a ambient color of white
        this.gl.uniform3f(this.uAmbientLightColor,1,1,1);
    }

    draw(time,deltatime,projectionMatrix,viewMatrix)
    {
        gl.useProgram(this.program_ren);
        //Update light uniforms
        if(this.light != null)
        {
            this.gl.uniform3f(this.uLightPosition, this.light.position[0],this.light.position[1],this.light.position[2]);
            //color = light color * light intensity
            var uc0 = this.light.color[0] * this.light.intensity;
            var uc1 = this.light.color[1] * this.light.intensity;
            var uc2 = this.light.color[2] * this.light.intensity;

            this.gl.uniform3f(this.uLightColor, uc0, uc1, uc2);
            this.gl.uniform1f(this.uLightRange, this.light.range);
        }

        //Update ambient color uniforms
        if(this.ambientColor != null)
        {
            this.gl.uniform3f(this.uAmbientLightColor,this.ambientColor[0],this.ambientColor[1],this.ambientColor[2]);
        }

        super.draw(time,deltatime,projectionMatrix,viewMatrix);
    }

    _getBufferData()
    {
        var bufferdata = new BufferData();
        bufferdata.addParameter("position",3);
        bufferdata.addParameter("velocity",3);
        bufferdata.addParameter("color",3);
        bufferdata.addParameter("scale",1);
        return bufferdata;
    }

    _getInitialData()
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
            //initialData.push(this.gravityStrengthValue.getValue())
        }

        //This... is needed? Why? No idea
        initialData.push(0);
        
        return new Float32Array(initialData);
    }

}