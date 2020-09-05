# webgl-particle-system
Super simple GPU WebGL particle system. See demo [here](https://joshcamas.github.io/webgl-particle-system/demo/index.html).

## Project Goals
* Develop a simple WebGL particle system that simulates entirely on the GPU / shader.
* Make system modular and easy to add new features.
* Learn more about WebGL!!

### Technical Hurdles
* Developing modular features when dealing with shaders can be annoying, but since compilation of shaders is done at runtime, this means it could theoretically be possible to "stitch" together a shader during runtime with whatever particle modules are installed. This would make everything super modular and open ended!! 

### Features Done
#### 8/28/20
* Create particles at built-in positions, define random velocity, lifetime, scale, and color ranges, and boom. Super basic particle system!
* Added GUI to demo to play with values
#### 9/4/20
* Redesigned shader to use points, not indicies - this removes the 16,000 particle limit per system
* Fixed dumb color mistake
* Added "color over time" feature
* Temporarily fixed time offset issue

### Features To Do
* Separate rendering and simulation into separate shaders
* Fix randomized color lerping
* Add "velocity over time" feature
* Add particle rotation feature
* Add 3D particle scaling feature
* Add simple texture support
* Add support for blending modes
* Add modular particle emission modules
* Add option to disable looping
* Add gravity module

## Features That I'll Probably Never Get To
* Animated textures (atlas)
* Movement noise (based off texture)
* Color gradient over time (based off texture)
* Add "Particle System Group", which would be a wrapper over multiple particle systems (to allow for greater numbers of particles)
* Node Editor?
