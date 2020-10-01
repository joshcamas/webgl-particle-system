#version 300 es

//Uniforms
uniform float uDeltaTime;

//Input
layout(location = 0) in vec4 i_position;

out vec4 o_Position;

void main(void) 
{
	float particleTime = uDeltaTime;

	o_Position = i_position + vec4(0,0.00001*uDeltaTime,0,0);
}
