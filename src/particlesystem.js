
class ColorValue
{
    constructor(defaultValue = [0,0,0])
    {
        this.single = true;
        this.singleValue = defaultValue;
        this.secondaryValue = [0,0,0];
    }

    setRandomLerp(valueA,valueB)
    {
        this.single = false;
        this.singleValue = valueA;
        this.secondaryValue = valueB;
    }

    getValue()
    {
        if(this.single)
            return this.singleValue;
        
        var r = Math.random();

        var x = r * (this.singleValue[0] - this.secondaryValue[0]) + this.secondaryValue[0];
        var y = r * (this.singleValue[1] - this.secondaryValue[1]) + this.secondaryValue[1];
        var z = r * (this.singleValue[2] - this.secondaryValue[2]) + this.secondaryValue[2]; 

        return [x, y, z];
    }
} 

class Vector3Value
{
    constructor(defaultValue = [0,0,0])
    {
        this.single = true;
        this.singleValue = defaultValue;
        this.secondaryValue = [0,0,0];
    }

    setRandomLerp(valueA,valueB)
    {
        this.single = false;
        this.singleValue = valueA;
        this.secondaryValue = valueB;
    }

    getValue()
    {
        if(this.single)
            return this.singleValue;
        
        var x = Math.random() * (this.singleValue[0] - this.secondaryValue[0]) + this.secondaryValue[0];
        var y = Math.random() * (this.singleValue[1] - this.secondaryValue[1]) + this.secondaryValue[1];
        var z = Math.random() * (this.singleValue[2] - this.secondaryValue[2]) + this.secondaryValue[2]; 

        return [x, y, z];
    }
} 

class FloatValue
{
    constructor(defaultValue = 0)
    {
        this.single = true;
        this.singleValue = defaultValue;
        this.secondaryValue = 0;
    }

    setRandomLerp(valueA,valueB)
    {
        this.single = false;
        this.singleValue = valueA;
        this.secondaryValue = valueB;
    }

    getValue()
    {
        if(this.single)
            return this.singleValue;
        
        return Math.random() * (this.secondaryValue - this.singleValue) + this.singleValue;
    }
} 

class BoolValue
{
    constructor(defaultValue = false)
    {
        this.single = true;
        this.singleValue = defaultValue;
        this.secondaryValue = false;
    }

    setRandomLerp(valueA,valueB)
    {
        this.single = false;
        this.singleValue = valueA;
        this.secondaryValue = valueB;
    }

    getValue()
    {
        if(this.single)
            return this.singleValue;
        
        if(Math.random() > 0.5)
            return this.secondaryValue;
        else 
            return this.singleValue;
    }
} 

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
        this.colorValue = new ColorValue([1,0,0]);

        this.billboardUniformValue = true;
        this.particleCount = 0;
    }

    createInitialState()
    {
        //Shader values
        this.vertices = [];
        this.uvs = [];
        this.indices = [];
        this.particlePositions = [];
        this.colors = [];
        this.lifetimes = [];
        this.velocities = [];
        this.scales = [];

        if(this.particleCount > 64000/4)
        {
            console.error("Cannot create more than 16,000 particles in a single system");
            return;
        }

        for (var i = 0; i < this.particleCount; i++) {
            
            
            var initialPosition = [0,0,0];
            var initialScale = this.scaleValue.getValue();
            var lifetime = this.lifetimeValue.getValue();
            var initialVelocity = this.velocityValue.getValue();
            var color = this.colorValue.getValue();

            //Per vertex
            for(var j = 0;j < 4; j++)
            {
                this.lifetimes.push(lifetime * 1000); //Convert from seconds to milliseconds
                this.scales.push(initialScale);
    
                this.particlePositions.push(initialPosition[0],initialPosition[1],initialPosition[2]);
                this.colors.push(
                    color[0],
                    color[1],
                    color[2]);
                
                this.velocities.push(
                    initialVelocity[0] / 1000,
                    initialVelocity[1] / 1000,
                    initialVelocity[2] / 1000); //Convert from seconds to milliseconds
            }
    
            //Vertices
            this.vertices.push(-1, -1, 0);
            this.vertices.push(1, -1, 0);
            this.vertices.push(1, 1, 0);
            this.vertices.push(-1, 1, 0);
            
            //UV Coordinates
            this.uvs.push(0, 0);
            this.uvs.push(1, 0);
            this.uvs.push(1, 1);
            this.uvs.push(0, 1);
            
            //Indices
            this.indices.push(0 + 4*i);
            this.indices.push(1 + 4*i);
            this.indices.push(2 + 4*i);
            this.indices.push(0 + 4*i);
            this.indices.push(2 + 4*i);
            this.indices.push(3 + 4*i);
        }
    }

    applyShaderValues()
    {
        //Matrices
        this.pMatrix = this.gl.getUniformLocation(this.shaderProgram, "Pmatrix");
        this.vMatrix = this.gl.getUniformLocation(this.shaderProgram, "Vmatrix");
    
        //Attriubutes
        createAndBindBuffer(this.gl,this.shaderProgram,this.vertices,"aVertexPosition",3);
        createAndBindBuffer(this.gl,this.shaderProgram,this.particlePositions,"aParticlePosition",3)
        createAndBindBuffer(this.gl,this.shaderProgram,this.colors,"aColor",3)
        createAndBindBuffer(this.gl,this.shaderProgram,this.velocities,"aVelocity",3)
        createAndBindBuffer(this.gl,this.shaderProgram,this.lifetimes,"aLifetime",1);
        createAndBindBuffer(this.gl,this.shaderProgram,this.scales,"aSize",1);
    
        //Indices
        this.index_buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.index_buffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), this.gl.STATIC_DRAW);
    
        //Time
        this.time = this.gl.getUniformLocation(this.shaderProgram, "uTime");
    
        //Billboard
        this.useBillboard = this.gl.getUniformLocation(this.shaderProgram, 'uEnableBillboard')   
        
	    this.gl.uniform1i(this.useBillboard,this.billboardUniformValue); 
    }

    draw(time,projectionMatrix,viewMatrix)
    {
		//Push updates of time
		this.gl.uniform1f(this.time, time);

		//Update matrices
		this.gl.uniformMatrix4fv(this.pMatrix, false, projectionMatrix);
		this.gl.uniformMatrix4fv(this.vMatrix, false, viewMatrix);
		
        //Update indices
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.index_buffer);
		this.gl.drawElements(this.gl.TRIANGLES, this.indices.length, this.gl.UNSIGNED_SHORT, 0);

    }
}

/* =============== UTILITIES =============== */ 

//Returns random int between min (inclusive) and max (inclusive)
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Helper function to create a buffer for an array
function createBuffer(gl, array)
{
	var buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(array), gl.STATIC_DRAW);
	return buffer;
}

//Helper function to create and bind a buffer for a shader 
function createAndBindBuffer(gl, shaderProgram, array, propertyName, dimension = 3)
{
	var buffer = createBuffer(gl,array);
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	var location = gl.getAttribLocation(shaderProgram, propertyName);
	gl.vertexAttribPointer(location, dimension, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(location);
}

//Returns a projection depending on an angle
function get_projection(angle, a, zMin, zMax) {
    var ang = Math.tan((angle * .5) * Math.PI / 180);
    return [
        0.5 / ang, 0, 0, 0,
        0, 0.5 * a / ang, 0, 0,
        0, 0, -(zMax + zMin) / (zMax - zMin), -1,
        0, 0, (-2 * zMax * zMin) / (zMax - zMin), 0
    ];
}

//Rotate a matrix by an angle on the Z axis
function rotateZ(m, angle) {
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    var mv0 = m[0], mv4 = m[4], mv8 = m[8];

    m[0] = c*m[0]-s*m[1];
    m[4] = c*m[4]-s*m[5];
    m[8] = c*m[8]-s*m[9];

    m[1]=c*m[1]+s*mv0;
    m[5]=c*m[5]+s*mv4;
    m[9]=c*m[9]+s*mv8;
}

//Rotate a matrix by an angle on the X axis
function rotateX(m, angle) {
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    var mv1 = m[1], mv5 = m[5], mv9 = m[9];

    m[1] = m[1]*c-m[2]*s;
    m[5] = m[5]*c-m[6]*s;
    m[9] = m[9]*c-m[10]*s;

    m[2] = m[2]*c+mv1*s;
    m[6] = m[6]*c+mv5*s;
    m[10] = m[10]*c+mv9*s;
}

//Rotate a matrix by an angle on the Y axis
function rotateY(m, angle) {
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    var mv0 = m[0], mv4 = m[4], mv8 = m[8];

    m[0] = c*m[0]+s*m[2];
    m[4] = c*m[4]+s*m[6];
    m[8] = c*m[8]+s*m[10];

    m[2] = c*m[2]-s*mv0;
    m[6] = c*m[6]-s*mv4;
    m[10] = c*m[10]-s*mv8;
}
