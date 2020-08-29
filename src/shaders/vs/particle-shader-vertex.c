
//Uniforms
uniform float uTime;
uniform mat4 Pmatrix;
uniform mat4 Vmatrix;
uniform bool uEnableBillboard;

//Attributes
attribute vec3 aVertexPosition;
attribute vec3 aParticlePosition;
attribute vec3 aVelocity;
attribute vec3 aColor;
attribute float aSize;
attribute float aLifetime;

//Temp
varying vec3 vColor;

void main(void) { //pre-built function
	
	float particleTime = mod(uTime, aLifetime);

	float percentOfLife = particleTime / aLifetime;
	percentOfLife = clamp(percentOfLife, 0.0, 1.0);
	
	vec3 npos = aParticlePosition; 

	//Apply velocity
	npos += (particleTime * aVelocity);

	//Apply billboard (Source: https://www.chinedufn.com/webgl-particle-effect-billboard-tutorial/)
	if (uEnableBillboard) {

		vec3 cameraRight = vec3(Vmatrix[0].x, Vmatrix[1].x, Vmatrix[2].x);
		vec3 cameraUp = vec3(Vmatrix[0].y, Vmatrix[1].y, Vmatrix[2].y);

		npos += (cameraRight * aVertexPosition.x * aSize) + (cameraUp * aVertexPosition.y * aSize);
	} 

	//Just apply position
	else {
		npos.xyz += aVertexPosition.xyz * aSize;
	}
	
	gl_Position = Pmatrix * Vmatrix * vec4(npos, 1.);
	vColor = aColor;
}
