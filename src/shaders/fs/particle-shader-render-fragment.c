#version 300 es

precision mediump float;

uniform sampler2D particleTexture;

//in float o_rotation;
in vec4 o_color;
out vec4 color;

void main(void) {

	/*float mid = 0.5;
    vec2 rotated = vec2(cos(o_rotation) * (gl_PointCoord.x - mid) + sin(o_rotation) * (gl_PointCoord.y - mid) + mid,
                        cos(o_rotation) * (gl_PointCoord.y - mid) - sin(o_rotation) * (gl_PointCoord.x - mid) + mid);

    vec4 rotatedTexture=texture(particleTexture, rotated);
    color =  o_color * rotatedTexture;*/

	color = o_color * texture(particleTexture, gl_PointCoord);
}
