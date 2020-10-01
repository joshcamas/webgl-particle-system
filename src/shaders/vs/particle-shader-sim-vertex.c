#version 300 es
precision mediump float;

//Uniforms
uniform float uDeltaTime;
uniform float uTime;

//TODO: Add starting values here

//Input
layout (location=0) in vec3 i_position;
layout (location=1) in vec3 i_velocity;
layout (location=2) in vec3 i_color;
layout (location=3) in float i_scale;
layout (location=4) in float i_gravityStrength;

out vec3 o_position;
out vec3 o_velocity;
out vec3 o_color;
out float o_scale;
out float o_gravityStrength;

void main(void) 
{
	vec3 gravityPosition = normalize(vec3(0,0,0) - i_position);
	
	o_velocity = i_velocity + gravityPosition * i_gravityStrength * uDeltaTime;
	o_position = i_position + o_velocity * uDeltaTime;
	o_color = i_color + vec3(.1*uDeltaTime,0,0);
	o_scale = i_scale;
	o_gravityStrength = i_gravityStrength;
}
