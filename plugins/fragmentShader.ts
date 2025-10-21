export const fragmentShader = `
varying vec2 vUv;

uniform sampler2D currentImage;
uniform sampler2D nextImage;
uniform sampler2D disp;
uniform float dispFactor;
uniform float effectFactor;
uniform vec4 resolution;

void main() {
    vec2 uv = (vUv - vec2(0.5))*resolution.zw + vec2(0.5);
    
    vec4 disp = texture2D(disp, uv);
    vec2 distortedPosition = vec2(uv.x + dispFactor * (disp.r*effectFactor), uv.y);
    vec2 distortedPosition2 = vec2(uv.x - (1.0 - dispFactor) * (disp.r*effectFactor), uv.y);
    
    vec4 _currentImage = texture2D(currentImage, distortedPosition);
    vec4 _nextImage = texture2D(nextImage, distortedPosition2);
    vec4 finalTexture = mix(_currentImage, _nextImage, dispFactor);
    
    gl_FragColor = finalTexture;
}
`;

