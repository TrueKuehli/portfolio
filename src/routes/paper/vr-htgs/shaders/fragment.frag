varying highp vec2 textureCoord;

uniform sampler2D textureSampler;
uniform mediump vec2 mousePosition;
uniform mediump vec2 canvasSize;

uniform bool drawMousePosition;
uniform bool drawTileGrid;
uniform bool enableVRView;

const mediump float tileWidth = 16.0;
const mediump float tileHeight = 16.0;
const mediump float tileWidthSmall = 8.0;
const mediump float tileHeightSmall = 8.0;
const mediump float foveaRadiusTilesBase = 7.5;
const mediump float foveaRadiusPixelsBase = foveaRadiusTilesBase * tileWidth;
const mediump float blendedRadiusTilesBase = 11.5;
const mediump float blendedRadiusPixelsBase = blendedRadiusTilesBase * tileWidth;

const mediump float mouseDotRadius = 6.0;
const mediump vec4 mouseDotColor = vec4(0.8, 0.475, 0.655, 1.0);
const mediump vec4 tilesFoveaColor = vec4(0.902, 0.624, 0.0 , 1.0);
const mediump vec4 tilesBlendedColor = vec4(0.337, 0.706, 0.914, 1.0);
const mediump vec4 tilesPeripheryColor = vec4(0, 0.620, 0.451, 1.0);

uniform sampler2D maskSamplerLeft;
uniform sampler2D maskSamplerRight;


mediump vec4 samplePeripheryColor(highp vec2 mappedTextureCoord) {
    mediump vec4 color = vec4(0.0, 0.0, 0.0, 1.0);
    mediump vec2 tilePixelCoordinates = mod(vec2(gl_FragCoord.x, canvasSize.y - gl_FragCoord.y), vec2(tileWidth, tileHeight));
    mediump vec2 tilePixelGroupCoordinates = mod(tilePixelCoordinates, vec2(tileWidth / tileWidthSmall, tileHeight / tileHeightSmall));
    highp vec2 texturePixelOffset = vec2(1.0 / canvasSize.x, 1.0 / canvasSize.y);

    if (tilePixelGroupCoordinates.x < 0.9 && tilePixelGroupCoordinates.y < 0.9) {
        color += 36.0 * texture2D(textureSampler, mappedTextureCoord);
        color +=  6.0 * texture2D(textureSampler, mappedTextureCoord + texturePixelOffset * vec2(-2.0,  0.0));
        color +=  6.0 * texture2D(textureSampler, mappedTextureCoord + texturePixelOffset * vec2( 2.0,  0.0));
        color +=  6.0 * texture2D(textureSampler, mappedTextureCoord + texturePixelOffset * vec2( 0.0, -2.0));
        color +=  6.0 * texture2D(textureSampler, mappedTextureCoord + texturePixelOffset * vec2( 0.0,  2.0));
        color +=  1.0 * texture2D(textureSampler, mappedTextureCoord + texturePixelOffset * vec2( 2.0,  2.0));
        color +=  1.0 * texture2D(textureSampler, mappedTextureCoord + texturePixelOffset * vec2( 2.0, -2.0));
        color +=  1.0 * texture2D(textureSampler, mappedTextureCoord + texturePixelOffset * vec2(-2.0,  2.0));
        color +=  1.0 * texture2D(textureSampler, mappedTextureCoord + texturePixelOffset * vec2(-2.0, -2.0));
        color /= 64.0;
    } else if (tilePixelGroupCoordinates.x < 0.9) {
        color += 6.0 * texture2D(textureSampler, mappedTextureCoord + texturePixelOffset * vec2( 0.0, -1.0));
        color += 6.0 * texture2D(textureSampler, mappedTextureCoord + texturePixelOffset * vec2( 0.0,  1.0));
        color += 1.0 * texture2D(textureSampler, mappedTextureCoord + texturePixelOffset * vec2(-2.0, -1.0));
        color += 1.0 * texture2D(textureSampler, mappedTextureCoord + texturePixelOffset * vec2(-2.0,  1.0));
        color += 1.0 * texture2D(textureSampler, mappedTextureCoord + texturePixelOffset * vec2( 2.0, -1.0));
        color += 1.0 * texture2D(textureSampler, mappedTextureCoord + texturePixelOffset * vec2( 2.0,  1.0));
        color /= 16.0;
    } else if (tilePixelGroupCoordinates.y < 0.9) {
        color += 6.0 * texture2D(textureSampler, mappedTextureCoord + texturePixelOffset * vec2(-1.0,  0.0));
        color += 6.0 * texture2D(textureSampler, mappedTextureCoord + texturePixelOffset * vec2( 1.0,  0.0));
        color += 1.0 * texture2D(textureSampler, mappedTextureCoord + texturePixelOffset * vec2(-1.0, -2.0));
        color += 1.0 * texture2D(textureSampler, mappedTextureCoord + texturePixelOffset * vec2(-1.0,  2.0));
        color += 1.0 * texture2D(textureSampler, mappedTextureCoord + texturePixelOffset * vec2( 1.0, -2.0));
        color += 1.0 * texture2D(textureSampler, mappedTextureCoord + texturePixelOffset * vec2( 1.0,  2.0));
        color /= 16.0;
    } else {
        color += 1.0 * texture2D(textureSampler, mappedTextureCoord + texturePixelOffset * vec2(-1.0,  -1.0));
        color += 1.0 * texture2D(textureSampler, mappedTextureCoord + texturePixelOffset * vec2(-1.0,   1.0));
        color += 1.0 * texture2D(textureSampler, mappedTextureCoord + texturePixelOffset * vec2( 1.0,  -1.0));
        color += 1.0 * texture2D(textureSampler, mappedTextureCoord + texturePixelOffset * vec2( 1.0,   1.0));
        color /= 4.0;
    }

    return color;
}



void main() {
    highp vec2 mappedCanvasSize = canvasSize;
    highp vec2 mappedTextureCoord = textureCoord;
    if (enableVRView) mappedCanvasSize.x = ceil(canvasSize.x / 2.0);
    if (enableVRView) mappedTextureCoord.x = (gl_FragCoord.x > mappedCanvasSize.x ? 0.2 : 0.30) + 0.5 * fract(2.0 * textureCoord.x);
    mediump vec2 tileCoordinates = floor((vec2(0, canvasSize.y) - mod(gl_FragCoord.xy, mappedCanvasSize)) / vec2(tileWidth, tileHeight));
    mediump vec2 tilePixelCoordinates = mod((vec2(0, canvasSize.y) - mod(gl_FragCoord.xy, mappedCanvasSize)), vec2(tileWidth, tileHeight));
    mediump vec2 tileSmallPixelCoordinates = mod((vec2(0, canvasSize.y) - mod(gl_FragCoord.xy, mappedCanvasSize)), vec2(tileWidthSmall, tileHeightSmall));
    mediump vec2 mousePositionTiles = floor((vec2(0, canvasSize.y) - mod(mousePosition, mappedCanvasSize)) / vec2(tileWidth, tileHeight));

    highp float foveaRadiusTiles = foveaRadiusTilesBase * (mappedCanvasSize.x / 1280.0);
    highp float foveaRadiusPixels = foveaRadiusPixelsBase * (mappedCanvasSize.x / 1280.0);
    highp float blendedRadiusTiles = blendedRadiusTilesBase * (mappedCanvasSize.x / 1280.0);
    highp float blendedRadiusPixels = blendedRadiusPixelsBase * (mappedCanvasSize.x / 1280.0);

    // Hide offscreen tiles in VR mode
    if (enableVRView) {
        highp vec2 mappedFragCoord = vec2(mod(gl_FragCoord.x, ceil(canvasSize.x / 2.0)), canvasSize.y - gl_FragCoord.y);
        highp vec2 mappedMaskCoord = (floor(mappedFragCoord / vec2(tileWidth, tileHeight)) + vec2(0.5, 0.5)) * vec2(tileWidth, tileHeight) / mappedCanvasSize;
        mappedMaskCoord.y = 1.0 - mappedMaskCoord.y;

        if (textureCoord.x <= 0.5 && texture2D(maskSamplerLeft, mappedMaskCoord).r < 0.5) {
            gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
            return;
        } else if (textureCoord.x > 0.5 && texture2D(maskSamplerRight, mappedMaskCoord).r < 0.5) {
            gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
            return;
        }
    }

    // Mouse visualiazation
    if (drawMousePosition && distance(mod(gl_FragCoord.xy, mappedCanvasSize), mod(mousePosition, mappedCanvasSize)) < mouseDotRadius) {
        gl_FragColor = mouseDotColor;
        return;
    }

    // Tile grid visualization
    if (drawTileGrid) {
        if (distance(tileCoordinates, mousePositionTiles) < foveaRadiusTiles) {
            if (
                tileSmallPixelCoordinates.x < 1.0
                || tileSmallPixelCoordinates.y < 1.0
                || tileSmallPixelCoordinates.x > tileWidthSmall - 1.0
                || tileSmallPixelCoordinates.y > tileHeightSmall - 1.0
            ) {
                gl_FragColor = tilesFoveaColor;
                return;
            }
        }

        if (distance(tileCoordinates, mousePositionTiles) < blendedRadiusTiles) {
            if (
                tileSmallPixelCoordinates.x < 1.0
                || tileSmallPixelCoordinates.y < 1.0
                || tileSmallPixelCoordinates.x > tileWidthSmall - 1.0
                || tileSmallPixelCoordinates.y > tileHeightSmall - 1.0
            ) {
                gl_FragColor = tilesBlendedColor;
                return;
            }
        }

        if (
            tilePixelCoordinates.x < 1.0
            || tilePixelCoordinates.y < 1.0
            || tilePixelCoordinates.x > tileWidth - 1.0
            || tilePixelCoordinates.y > tileHeight - 1.0
        ) {
            gl_FragColor = tilesPeripheryColor;
            return;
        }
    }

    // Draw fovea
    if (distance(tileCoordinates, mousePositionTiles) < foveaRadiusTiles) {
        gl_FragColor = texture2D(textureSampler, mappedTextureCoord);
        return;
    }

    // Draw blended region
    if (distance(tileCoordinates, mousePositionTiles) < blendedRadiusTiles) {
        // Get fovea color & periphery colors
        mediump vec4 foveaColor = texture2D(textureSampler, mappedTextureCoord);
        mediump vec4 peripheryColor = samplePeripheryColor(mappedTextureCoord);

        // Determine interpolation factor
        highp float distanceFromGaze = distance(mousePosition, vec2(gl_FragCoord));
        highp float blend_factor = clamp(
            (distanceFromGaze - foveaRadiusPixels - tileWidthSmall) / (blendedRadiusPixels - foveaRadiusPixels - tileWidth),
            0.0, 1.0
        );

        // Write interpolated color
        gl_FragColor = mix(foveaColor, peripheryColor, blend_factor);
        return;
    }

    // Draw periphery
    gl_FragColor = samplePeripheryColor(mappedTextureCoord);
}
