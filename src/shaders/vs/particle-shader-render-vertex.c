#version 300 es
precision mediump float;

layout (location=0) in vec3 i_position;
layout (location=1) in vec3 i_velocity;
layout (location=2) in vec3 i_color;
layout (location=3) in float i_scale;
//layout (location=4) in float i_rotation;

//Light information
uniform vec3 lightPosition;
uniform vec3 lightColor;
uniform float lightRange;

//Ambient lighting information
uniform vec3 ambientLightColor;

uniform mat4 Pmatrix;
uniform mat4 Vmatrix;

out vec4 o_color;
//out float o_rotation;

void main(void) 
{
	gl_Position = Pmatrix * Vmatrix * vec4(i_position,1);
	gl_Position += vec4(i_velocity,0) * 0.; 

	gl_PointSize = i_scale * 100. / gl_Position.w;

	float attenuation = 1. - (distance(i_position, lightPosition)/lightRange);

	//TODO: Don't use an if statement, very slow!
	if(attenuation < 0.)
		attenuation = 0.;

	vec3 mainLight = attenuation * lightColor;

	o_color = vec4(i_color * (mainLight + ambientLightColor),1);
	//o_rotation = i_rotation;
}