
//Simple texture addition for particle system!
class TextureModule extends ParticleModule
{    
    constructor(path, particleSystem, gl)
    {
        super(particleSystem)
        
        this.gl = gl;
        this.texture = this.loadTexture(gl, path);
        
        //Source/Destination blending
        this.enableBlending = false;
        this.sfactor = this.gl.SRC_ALPHA;
        this.dfactor = this.gl.ONE_MINUS_SRC_ALPHA;
    }

    enableBlend(sfactor,dfactor)
    {
        this.enableBlending = true;
        this.sfactor = sfactor;
        this.dfactor = dfactor;
    }

    disableBlend()
    {
        this.enableBlending = false;
    }

    //Run by particle system
    initialize(program_sim, program_ren)
    {
        this.texturelocation = this.gl.getUniformLocation(program_ren, 'particleTexture')

        this.gl.activeTexture(gl.TEXTURE0);
        this.gl.bindTexture(gl.TEXTURE_2D, this.texture);
        
        this.gl.uniform1i(this.texturelocation, 0);
    }

    draw(time,deltatime) 
    {
        if(this.enableBlending)
        {
            this.gl.enable(this.gl.BLEND);
            this.gl.blendFunc(this.sfactor, this.dfactor);
        }
        
    }

    //Asynchronous texture loading function from: 
    //https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Using_textures_in_WebGL
    loadTexture(gl, url) {
        
        var _this = this;

        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
      
        // Because images have to be downloaded over the internet
        // they might take a moment until they are ready.
        // Until then put a single pixel in the texture so we can
        // use it immediately. When the image has finished downloading
        // we'll update the texture with the contents of the image.
        const level = 0;
        const internalFormat = gl.RGBA;
        const width = 1;
        const height = 1;
        const border = 0;
        const srcFormat = gl.RGBA;
        const srcType = gl.UNSIGNED_BYTE;
        const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                      width, height, border, srcFormat, srcType,
                      pixel);
      
        const image = new Image();
        image.onload = function() {
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                        srcFormat, srcType, image);
      
          // WebGL1 has different requirements for power of 2 images
          // vs non power of 2 images so check if the image is a
          // power of 2 in both dimensions.
          if ( _this.isPowerOf2(image.width) &&  _this.isPowerOf2(image.height)) {
             // Yes, it's a power of 2. Generate mips.
             gl.generateMipmap(gl.TEXTURE_2D);
          } else {
             // No, it's not a power of 2. Turn off mips and set
             // wrapping to clamp to edge
             gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
             gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
             gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
             gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
          }
        };
        image.src = url;
      
        return texture;
      }
      
      isPowerOf2(value) {
        return (value & (value - 1)) == 0;
      }
}
