# webgl-particle-system
Super simple GPU WebGL particle system

## Project Goals
* Develop a simple WebGL particle system that simulates entirely on the GPU / shader.
* Make system modular and easy to add new features.
* Learn more about WebGL!!

### Technical Hurdles
* A single WebGL buffer can only hold 64,000 values - in other words, 16,000 planes / particles. This needs to be taken into account, and possible will require multiple simulators to achieve higher than 16,000 particles.

* Developing modular features when dealing with shaders can be annoying, but since compilation of shaders is done at runtime, this means it could theoretically be possible to "stitch" together a shader during runtime with whatever particle modules are installed. This would make everything super modular and open ended!! 
