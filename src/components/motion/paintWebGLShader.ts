export const PAINT_WEBGL_VERTEX = `#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`

export const PAINT_WEBGL_FRAGMENT = `#version 300 es
precision highp float;

uniform vec4 uColorA;
uniform vec4 uColorB;
uniform vec2 uResolution;
uniform vec2 uHornOrigin;
uniform float uMix;
uniform float uHorn;
uniform float uHornAge;
uniform float uPanel;

out vec4 outColor;

float hash21(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

vec2 transitionField(float panel, vec2 uv, float progress, float aspect) {
  float mask = 1.0;
  float accent = 0.0;
  float live = step(0.001, progress) * step(progress, 0.999);

  if (panel > 0.5 && panel < 1.5) {
    vec2 centered = (uv - vec2(0.5)) * vec2(aspect, 1.0);
    float d = length(centered);
    float maxRadius = length(vec2(aspect * 0.5, 0.5));
    float front = progress * maxRadius * 1.05;
    mask = 1.0 - smoothstep(front - 0.06, front + 0.06, d);
    accent = (1.0 - smoothstep(0.0, 0.025, abs(d - front))) * live;
  } else if (panel > 1.5 && panel < 2.5) {
    float band = abs(uv.y - 0.5);
    float front = progress * 0.6;
    float perf = abs(fract(uv.x * 14.0) - 0.5);
    float punched = smoothstep(0.06, 0.13, perf);
    float holes = mix(punched, 1.0, smoothstep(0.86, 1.0, progress));
    mask = (1.0 - smoothstep(front - 0.08, front + 0.08, band)) * holes;
    accent = (1.0 - smoothstep(0.0, 0.05, abs(band - front))) * live * (1.0 - punched);
  } else if (panel > 2.5 && panel < 3.5) {
    float chev = uv.x - abs(uv.y - 0.5) * 0.65;
    float front = progress * 1.4 - 0.2;
    mask = smoothstep(front - 0.16, front + 0.16, chev);
    accent = (1.0 - smoothstep(0.0, 0.07, abs(chev - front))) * live;
  } else if (panel > 3.5) {
    float noise = hash21(floor(uv * vec2(8.0, 10.0)));
    float front = progress * 1.3 - 0.15 + (noise - 0.5) * 0.18;
    mask = smoothstep(front - 0.12, front + 0.12, uv.x);
    accent = smoothstep(0.0, 0.35, 1.0 - abs(uv.x - front)) * live * 0.4;
  }

  return vec2(mask, accent);
}

void main() {
  // gl_FragCoord is bottom-origin; flip once so the WGSL and GLSL fields align.
  vec2 frag = vec2(gl_FragCoord.x, uResolution.y - gl_FragCoord.y);
  vec2 size = uResolution;
  float dotSize = max(6.0, size.y / 120.0);
  vec2 uv = frag / size;

  vec2 delta = frag - uHornOrigin;
  float dist = length(delta);
  float wave = sin(dist * 0.055 - uHornAge * 10.0) * exp(-dist * 0.0035) * uHorn;
  vec2 pos = frag + (delta / max(dist, 1.0)) * wave * 2.2;

  vec2 cell = floor(pos / dotSize);
  vec2 center = (cell + 0.5) * dotSize;
  float dotDist = length(pos - center) / dotSize;
  float aa = 1.4 / dotSize;

  vec2 style = transitionField(uPanel, uv, uMix, size.x / size.y);
  float coverage = clamp(uMix * (0.15 + 0.85 * style.x), 0.0, 1.0);
  float radius = sqrt(coverage) * 0.72;
  float dotMask = 1.0 - smoothstep(radius - aa, radius + aa, dotDist);

  vec3 ink = vec3(0.039);
  vec3 col = mix(uColorA.rgb, uColorB.rgb, dotMask);

  float ring = (1.0 - smoothstep(0.0, aa * 3.0, abs(dotDist - radius)))
    * step(0.003, uMix)
    * step(uMix, 0.997);
  col = mix(col, ink, ring * 0.28);

  col = mix(col, vec3(1.0, 0.83, 0.0), style.y * 0.35);

  float glint = abs(wave) * (1.0 - smoothstep(0.0, 0.85, dotDist)) * 0.35;
  col = mix(col, vec3(1.0, 0.83, 0.0), glint);

  float grain = hash21(floor(pos * 1.63));
  col += vec3((grain - 0.5) * 0.03);

  float v = 1.0 - smoothstep(0.25, 1.15, distance(uv, vec2(0.5)));
  col *= mix(0.9, 1.0, v);

  outColor = vec4(col, 1.0);
}`
