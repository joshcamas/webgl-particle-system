#version 300 es

layout(location = 0) in vec4 i_position;

uniform mat4 Pmatrix;
uniform mat4 Vmatrix;

void main(void) 
{
	gl_Position = Pmatrix * Vmatrix * (i_position);
	gl_PointSize = 12.;
}