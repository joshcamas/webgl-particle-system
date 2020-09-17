
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
function bindBuffer(buffer, gl, shaderProgram, propertyName, dimension = 3)
{
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	var location = gl.getAttribLocation(shaderProgram, propertyName);
	gl.vertexAttribPointer(location, dimension, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(location);
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
