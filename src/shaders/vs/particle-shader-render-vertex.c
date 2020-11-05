#version 300 es

precision mediump float;

layout (location=0) in vec3 i_position;
layout (location=1) in vec3 i_velocity;
layout (location=2) in vec3 i_color;
layout (location=3) in float i_scale;

uniform mat4 Pmatrix;
uniform mat4 Vmatrix;

out vec4 o_color;

void main(void) 
{
	gl_Position = Pmatrix * Vmatrix * vec4(i_position,1);
	
	gl_Position += vec4(i_velocity,0) * 0.; 

	gl_PointSize = i_scale * 100. / gl_Position.w;

	o_color = vec4(i_color,1);
}