attribute vec4 vertexPosition;
varying highp vec2 textureCoord;

void main() {
    gl_Position = vertexPosition;
    textureCoord = (vec2(vertexPosition) + vec2(1.0, 1.0)) / vec2(2.0, 2.0);
}
