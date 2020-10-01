#version 300 es
precision mediump float;

//Uniforms
uniform float uDeltaTime;

//Input
layout (location=0) in vec4 i_position;
layout (location=12) in vec4 i_color;

out vec4 o_position;
out vec4 o_color;

void main(void) 
{
	float particleTime = uDeltaTime;

	o_position = i_position + vec4(0,0.00001*uDeltaTime,0,0);
	o_color = i_color + vec4(0.00001*uDeltaTime,0,0,0);
}
