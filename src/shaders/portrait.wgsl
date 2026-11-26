// Portrait halftone: reads the portrait texture and paints the ink dots in a
// shader so they can swell under the pointer and pulse with the horn. The
// canvas is transparent and uses multiply blending over the image.

struct PortraitParams {
  resolution: vec2f,
  pointer: vec2f,
  dotSize: f32,
  horn: f32,
  strength: f32,
  alpha: f32,
  _pad: vec4f,
}

@group(0) @binding(0) var<uniform> params: PortraitParams;
@group(0) @binding(1) var photo: texture_2d<f32>;
@group(0) @binding(2) var photoSampler: sampler;

fn hash21(p: vec2f) -> f32 {
  return fract(sin(dot(p, vec2f(127.1, 311.7))) * 43758.5453123);
}

@fragment fn fs_main(@builtin(position) frag: vec4f) -> @location(0) vec4f {
  let uv = frag.xy / params.resolution;
  let texel = textureSampleLevel(photo, photoSampler, uv, 0.0);
  let lum = dot(texel.rgb, vec3f(0.2126, 0.7152, 0.0722));
  let dark = clamp((1.0 - lum - 0.15) / 0.85, 0.0, 1.0);

  let dotSize = max(4.0, params.dotSize);
  let cell = floor(frag.xy / dotSize);
  let center = (cell + 0.5) * dotSize;
  let d = length(frag.xy - center) / dotSize;
  let aa = 1.4 / dotSize;

  // A soft lens lifts the dots under the pointer.
  let pointerDist = length(frag.xy - params.pointer) / (dotSize * 5.0);
  let swell = params.strength * (1.0 - smoothstep(0.0, 1.0, pointerDist)) * 0.18;

  // The horn pulse is slightly irregular per cell so it reads as painted.
  let pulse = params.horn * (0.08 + hash21(cell) * 0.1);

  let radius = clamp(dark * 0.58 + swell + pulse, 0.0, 0.62);
  let coverage = 1.0 - smoothstep(radius - aa, radius + aa, d);
  let visible = step(0.43, texel.a) * step(0.02, dark);
  let a = coverage * visible * params.alpha;

  return vec4f(vec3f(0.039) * a, a);
}
