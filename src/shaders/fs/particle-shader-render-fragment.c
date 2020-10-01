#version 300 es

precision mediump float;

in vec4 o_color;
out vec4 color;

void main(void) {
	color = o_color;
}
