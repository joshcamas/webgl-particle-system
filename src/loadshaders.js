//Thanks to Andrea Giammarchi for this technique of loading shaders
//Source: webreflection.blogspot.com/2010/09/fragment-and-vertex-shaders-my-way-to.html

//Asynchronously load shader files with ".c" format, and compiles. 
function loadShaders(gl, shaders, callback, directory="shaders/") {
    // (C) WebReflection - Mit Style License
    function onreadystatechange() {
        var
            xhr = this,
            i = xhr.i
        ;
        if (xhr.readyState == 4) {
            shaders[i] = gl.createShader(
                shaders[i].slice(0, 2) == "fs" ?
                    gl.FRAGMENT_SHADER :
                    gl.VERTEX_SHADER
            );
            gl.shaderSource(shaders[i], xhr.responseText);
            gl.compileShader(shaders[i]);
            if (!gl.getShaderParameter(shaders[i], gl.COMPILE_STATUS))
                throw gl.getShaderInfoLog(shaders[i])
            ;
            !--length && typeof callback == "function" && callback(shaders);
        }
    }
    for (var
        shaders = [].concat(shaders),
        asynchronous = !!callback,
        i = shaders.length,
        length = i,
        xhr;
        i--;
    ) {
        (xhr = new XMLHttpRequest).i = i;
        xhr.open("get", directory + shaders[i] + ".c", asynchronous);
        xhr.setRequestHeader('Cache-Control', 'no-cache');	
        if (asynchronous) {
            xhr.onreadystatechange = onreadystatechange;
        }
        xhr.send(null);
        onreadystatechange.call(xhr);
    }
    return shaders;
}
