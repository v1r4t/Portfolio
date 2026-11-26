// Journey ground: halftone pigment dissolve with an ink front.
// The ripple terms are inert while `horn` is zero, so the resting frame
// matches the previous halftone field.

struct PaintParams {
  colorA: vec4f,
  colorB: vec4f,
  resolution: vec2f,
  hornOrigin: vec2f,
  mix: f32,
  horn: f32,
  hornAge: f32,
  _pad: f32,
}

@group(0) @binding(0) var<uniform> paint: PaintParams;

fn hash21(p: vec2f) -> f32 {
  return fract(sin(dot(p, vec2f(127.1, 311.7))) * 43758.5453123);
}

@fragment fn fs_main(@builtin(position) frag: vec4f) -> @location(0) vec4f {
  let size = paint.resolution;
  let dotSize = max(6.0, size.y / 120.0);

  // Horn ripple: a decaying ring pushes the dot field outward.
  let delta = frag.xy - paint.hornOrigin;
  let dist = length(delta);
  let wave =
    sin(dist * 0.055 - paint.hornAge * 10.0) *
    exp(-dist * 0.0035) *
    paint.horn;
  let pos = frag.xy + (delta / max(dist, 1.0)) * wave * 2.2;

  let cell = floor(pos / dotSize);
  let center = (cell + 0.5) * dotSize;
  let dotDist = length(pos - center) / dotSize;
  let aa = 1.4 / dotSize;

  // Halftone dots grow from the A ground into the B ground.
  let radius = sqrt(clamp(paint.mix, 0.0, 1.0)) * 0.72;
  let dotMask = 1.0 - smoothstep(radius - aa, radius + aa, dotDist);

  let ink = vec3f(0.039, 0.039, 0.039);
  var col = mix(paint.colorA.rgb, paint.colorB.rgb, dotMask);

  // Wet ink ring at the dot edge - the painted front line.
  let ring =
    (1.0 - smoothstep(0.0, aa * 3.0, abs(dotDist - radius))) *
    step(0.003, paint.mix) *
    step(paint.mix, 0.997);
  col = mix(col, ink, ring * 0.28);

  // Warm glint riding the horn ripple, kept inside the wet dot front.
  let glint = abs(wave) * (1.0 - smoothstep(0.0, 0.85, dotDist)) * 0.35;
  col = mix(col, vec3f(1.0, 0.83, 0.0), glint);

  // Paper grain.
  let grain = hash21(floor(pos * 1.63));
  col += vec3f((grain - 0.5) * 0.03);

  // Vignette so the poster edges sit down.
  let uv = frag.xy / size;
  let v = 1.0 - smoothstep(0.25, 1.15, distance(uv, vec2f(0.5)));
  col *= mix(0.9, 1.0, v);

  return vec4f(col, 1.0);
}
