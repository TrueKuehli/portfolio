import fragmentShaderSource from "./shaders/fragment.frag?raw"
import vertexShaderSource from "./shaders/vertex.vert?raw"

import maskLeftSource from "$lib/data/papers/vr-htgs/mask_left.png";
import maskRightSource from "$lib/data/papers/vr-htgs/mask_right.png";

type ShaderProgramData = {
    program: WebGLProgram;
    vertexShader: WebGLShader;
    fragmentShader: WebGLShader;
    positionBuffer: WebGLBuffer;
    videoTexture: WebGLTexture;
    maskTextureLeft: WebGLTexture;
    maskTextureRight: WebGLTexture;
    attribLocations: {
        vertexPosition: number;
    };
    uniformLocations: {
        textureSampler: WebGLUniformLocation | null;
        maskLeftSampler: WebGLUniformLocation | null;
        maskRightSampler: WebGLUniformLocation | null;
        mousePosition: WebGLUniformLocation | null;
        canvasSize: WebGLUniformLocation | null;
        drawMousePosition: WebGLUniformLocation | null;
        drawTileGrid: WebGLUniformLocation | null;
        enableVRView: WebGLUniformLocation | null;
    };
};


function initPositionBuffer(gl: WebGL2RenderingContext): WebGLBuffer {
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Load screen-space square
    const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    return positionBuffer;
}


function getTexture(gl: WebGL2RenderingContext): WebGLTexture {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    return texture;
}


function getMaskTextures(gl: WebGL2RenderingContext): [WebGLTexture, WebGLTexture] {
    const maskTextureLeft = gl.createTexture();
    const maskTextureRight = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, maskTextureLeft);
    // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.bindTexture(gl.TEXTURE_2D, maskTextureRight);
    // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    // Pre-load texture with all white
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([255, 255, 255, 255]);
    gl.bindTexture(gl.TEXTURE_2D, maskTextureLeft);
    gl.texImage2D(
        gl.TEXTURE_2D,
        level,
        internalFormat,
        width,
        height,
        border,
        srcFormat,
        srcType,
        pixel,
    );
    gl.bindTexture(gl.TEXTURE_2D, maskTextureRight);
    gl.texImage2D(
        gl.TEXTURE_2D,
        level,
        internalFormat,
        width,
        height,
        border,
        srcFormat,
        srcType,
        pixel,
    );

    // Load mask textures
    const imageMaskLeft = new Image();
    imageMaskLeft.onload = () => {
        gl.bindTexture(gl.TEXTURE_2D, maskTextureLeft);
        gl.texImage2D(
            gl.TEXTURE_2D,
            level,
            internalFormat,
            srcFormat,
            srcType,
            imageMaskLeft,
        );
    };
    imageMaskLeft.src = maskLeftSource;

    const imageMaskRight = new Image();
    imageMaskRight.onload = () => {
        gl.bindTexture(gl.TEXTURE_2D, maskTextureRight);
        gl.texImage2D(
            gl.TEXTURE_2D,
            level,
            internalFormat,
            srcFormat,
            srcType,
            imageMaskRight,
        );
    };
    imageMaskRight.src = maskRightSource;

    return [maskTextureLeft, maskTextureRight];
}


function getDemoProgram(gl: WebGL2RenderingContext): ShaderProgramData | null {
    // Create shaders
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    if (!(vertexShader && fragmentShader)) {
        console.error("Failed to create WebGL shaders");
        return null;
    }
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);

    // Combine into program
    const glProgram = gl.createProgram();
    if (!glProgram) {
        console.error("Failed to create WebGL program");

        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        return null;
    }
    gl.attachShader(glProgram, vertexShader);
    gl.attachShader(glProgram, fragmentShader);
    gl.linkProgram(glProgram);
    if (!gl.getProgramParameter(glProgram, gl.LINK_STATUS)) {
        const info = gl.getProgramInfoLog(glProgram);
        console.error(`Could not compile WebGL program. \n\n${info}`);

        gl.deleteProgram(glProgram);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        return null;
    }

    // Get position buffer & texture
    const positionBuffer = initPositionBuffer(gl);
    const videoTexture = getTexture(gl);
    const [maskTextureLeft, maskTextureRight] = getMaskTextures(gl);

    return {
        program: glProgram,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        positionBuffer: positionBuffer,
        videoTexture: videoTexture,
        maskTextureLeft: maskTextureLeft,
        maskTextureRight: maskTextureRight,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(glProgram, 'vertexPosition'),
        },
        uniformLocations: {
            textureSampler: gl.getUniformLocation(glProgram, 'textureSampler'),
            maskLeftSampler: gl.getUniformLocation(glProgram, 'maskSamplerLeft'),
            maskRightSampler: gl.getUniformLocation(glProgram, 'maskSamplerRight'),
            mousePosition: gl.getUniformLocation(glProgram, 'mousePosition'),
            canvasSize: gl.getUniformLocation(glProgram, 'canvasSize'),
            drawMousePosition: gl.getUniformLocation(glProgram, 'drawMousePosition'),
            drawTileGrid: gl.getUniformLocation(glProgram, 'drawTileGrid'),
            enableVRView: gl.getUniformLocation(glProgram, 'enableVRView'),
        }
    };
}


function destroyDemoProgram(gl: WebGL2RenderingContext | null, program: ShaderProgramData | null) {
    if (!gl || !program) return;
    gl.deleteProgram(program.program);
    gl.deleteShader(program.vertexShader);
    gl.deleteShader(program.fragmentShader);
}

export { getDemoProgram, destroyDemoProgram, type ShaderProgramData };
