//A particle system with builtin 
class SimpleParticleSystem extends ParticleSystemBase
{    
    constructor(gl)
    {
        super(gl);
        
        this.lifetimeValue = new FloatValue();
        this.scaleValue = new FloatValue();
        this.gravityStrengthValue = new FloatValue();
        this.velocityValue = new Vector3Value();
        this.positionValue = new Vector3Value();
        this.startingColorValue = new ColorValue();
        this.endingColorValue = new ColorValue();
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