#version 300 es

precision mediump float;

layout (location=0) in vec4 i_position;
layout (location=12) in vec4 i_color;

uniform mat4 Pmatrix;
uniform mat4 Vmatrix;

out vec4 o_color;

void main(void) 
{
	gl_Position = Pmatrix * Vmatrix * i_position;
	gl_PointSize = 12.;

	o_color = i_color;
}