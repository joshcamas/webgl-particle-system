
//Uniforms
uniform float uTime;
uniform mat4 Pmatrix;
uniform mat4 Vmatrix;

//Attributes
attribute vec3 aParticlePosition;
attribute vec3 aVelocity;
attribute float aScale;
attribute float aLifetime;

attribute vec3 aStartingColor;
attribute vec3 aEndingColor;

//Temp
varying vec3 vColor;

void main(void) { //pre-built function
	
	float particleTime = mod(uTime, aLifetime);

	float percentOfLife = particleTime / aLifetime;
	percentOfLife = clamp(percentOfLife, 0.0, 1.0);
	
	vec3 npos = aParticlePosition; 

	//Apply velocity
	npos += (particleTime * aVelocity);

	gl_Position = Pmatrix * Vmatrix * vec4(npos, 1.);
	gl_PointSize = aScale;
	
	vColor = mix(aStartingColor,aEndingColor,percentOfLife);
}
