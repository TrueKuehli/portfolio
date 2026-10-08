<script lang="ts">
    import Play from "@lucide/svelte/icons/play"
    import Pause from "@lucide/svelte/icons/pause"
    import LoaderCircle from "@lucide/svelte/icons/loader-circle";
    import DemoVideo from "$lib/data/papers/vr-htgs/bicycle.mp4";
    import DemoVideoThumb from "$lib/data/papers/vr-htgs/bicycle-thumb.jpg";

    import { getDemoProgram, destroyDemoProgram } from "./shaders";
    import type { ShaderProgramData } from "./shaders";

    let pointerCoarse = $state(false);

    let canvasElement: HTMLCanvasElement;
    let videoElement: HTMLVideoElement;
    let videoReady: boolean = $state(true);
    let videoPaused: boolean = $state(true);
    let videoStarted: boolean = $state(false);

    let canvasWidth: number = $state(0);
    let canvasHeight: number = $state(0);

    let mousePosition: { x: number; y: number } = $state({ x: 0, y: 0 });
    let drawMousePosition: boolean = $state(true);
    let drawTileGrid: boolean = $state(false);
    let enableVRView: boolean = $state(false);

    let gl: WebGL2RenderingContext | null;
    let glProgramInfo: ShaderProgramData | null;
    let running: boolean = $state(false);
    function renderToCanvas() {
        if (!videoElement) {
            running = false;
            return;
        }
        if (!gl || !glProgramInfo) {
            running = false;
            return;
        }

        // Ensure canvas has the correct size
        const width = Math.floor(canvasWidth) * (window.devicePixelRatio || 1);
        const height = Math.floor(canvasHeight) * (window.devicePixelRatio || 1);
        if (width != canvasElement.width || height != canvasElement.height) {
            canvasElement.width = width;
            canvasElement.height = height;
        }
        gl.viewport(0, 0, width, height);

        // Clear canvas
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Load video into texture
        gl.bindTexture(gl.TEXTURE_2D, glProgramInfo.videoTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, videoElement);
        gl.generateMipmap(gl.TEXTURE_2D);

        // Render to canvas
        {
            const numComponents = 2;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0; // 0 = use type and numComponents above
            const offset = 0;

            gl.bindBuffer(gl.ARRAY_BUFFER, glProgramInfo.positionBuffer);
            gl.vertexAttribPointer(
                glProgramInfo.attribLocations.vertexPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset,
            );
            gl.enableVertexAttribArray(glProgramInfo.attribLocations.vertexPosition);
        }
        // Bind video texture
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, glProgramInfo.videoTexture);
        gl.uniform1i(glProgramInfo.uniformLocations.textureSampler, 0);

        // Bind mask textures
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, glProgramInfo.maskTextureLeft);
        gl.uniform1i(glProgramInfo.uniformLocations.maskLeftSampler, 1);
        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, glProgramInfo.maskTextureRight);
        gl.uniform1i(glProgramInfo.uniformLocations.maskRightSampler, 2);

        // Bind uniforms
        gl.uniform2f(glProgramInfo.uniformLocations.mousePosition, mousePosition.x * (window.devicePixelRatio || 1), mousePosition.y * (window.devicePixelRatio || 1));
        gl.uniform2f(glProgramInfo.uniformLocations.canvasSize, width, height);
        gl.uniform1i(glProgramInfo.uniformLocations.drawMousePosition, drawMousePosition ? 1 : 0);
        gl.uniform1i(glProgramInfo.uniformLocations.drawTileGrid, drawTileGrid ? 1 : 0);
        gl.uniform1i(glProgramInfo.uniformLocations.enableVRView, enableVRView ? 1 : 0);

        // Draw
        gl.useProgram(glProgramInfo.program);
        {
            const offset = 0;
            const vertexCount = 4;
            gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
        }

        // Enqueue next frame
        requestAnimationFrame(renderToCanvas);
    }

    $effect(() => {
        // Determine if using touchscreen to show warning
        pointerCoarse = window.matchMedia("(pointer: coarse)").matches;

        // Initialize WebGL
        gl = canvasElement.getContext('webgl2');
        if (!gl) return;
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Load shaders
        glProgramInfo = getDemoProgram(gl);
        return () => destroyDemoProgram(gl, glProgramInfo);  // Cleanup on unmount
    });
</script>

<style lang="css">
    .canvas-dpi {
        @media screen and (min-resolution: 2dppx) {
            min-width: 240px;
        }
    }

    .controls-dpi {
        @media screen and (min-resolution: 2dppx) {
            min-width: 240px;
        }
    }
</style>

{#if pointerCoarse}
    <div class="alert mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current inline text-warning" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>Experience on mobile may be suboptimal, please use a mouse or touchpad if available.</span>
    </div>
{/if}

<div class="flex flex-auto lg:flex-row flex-col w-full max-w-7xl">
    <div class="w-full flex-auto aspect-video m-0 lg:m-2 relative h-fit lg:mt-auto lg:mb-auto max-lg:min-w-[480px] canvas-dpi self-center mb-4" bind:clientWidth={canvasWidth} bind:clientHeight={canvasHeight}>
        {#if !videoStarted}
            <img src={DemoVideoThumb} class="absolute inset-0 h-full w-full"
                 alt="Static preview of the demo video showing foveated rendering of a Gaussian Splatting scene with VR-HTGS" />
        {/if}
        <canvas class="aspect-video absolute w-full" bind:this={canvasElement}
                onmousemove={(e) => mousePosition = { x: e.offsetX, y: canvasHeight - e.offsetY }}
                onclick={() => !videoStarted && (videoPaused = false)}
        >
            Your browser does not support the HTML5 canvas tag.
        </canvas>
    </div>
    <div class="flex flex-col controls flex-1/3 bg-base-200 rounded-lg p-4 max-lg:min-w-[480px] controls-dpi">
        <h1 class="font-bold text-xl text-center mb-2">Controls</h1>
        <button class="btn btn-md btn-primary px-3 h-8" onclick={() => videoPaused = !videoPaused} disabled={!videoReady}>
            {#if !videoReady}
                <LoaderCircle size={24} class="animate-spin" /> &nbsp; Loading...
            {:else if videoPaused}
                <Play size="18"/> Play
            {:else}
                <Pause size="18"/> Pause
            {/if}
        </button>

        <fieldset class="fieldset bg-base-100 border-base-300 rounded-box max-w-64 border p-4 mt-2 min-w-60 max-lg:self-center">
            <legend class="fieldset-legend">Render options</legend>
            <label class="label">
                <input type="checkbox" class="toggle" bind:checked={drawMousePosition} />
                Draw gaze position
            </label>
            <label class="label">
                <input type="checkbox" class="toggle" bind:checked={drawTileGrid} />
                Draw tile grid
            </label>
            <label class="label">
                <input type="checkbox" class="toggle" bind:checked={enableVRView} />
                Simulate VR View
            </label>
        </fieldset>

        {#if videoStarted}
            <div class="alert mt-auto">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current text-info h-6 w-6 shrink-0">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>Move the mouse over the image to see foveation take effect.</span>
            </div>
        {/if}
    </div>

    <!-- svelte-ignore a11y_media_has_caption -->
    <video class="hidden" src={DemoVideo} loop
           bind:this={videoElement} bind:paused={videoPaused}
           onwaiting={() => videoReady = false}
           onplaying={() => videoReady = true}
           onplay={() => {
               if (running) return;
               running = true;
               videoStarted = true;
               renderToCanvas();
           }}>
        Your browser does not support the HTML5 video tag.
    </video>
</div>