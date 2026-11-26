// Journey ground: halftone pigment dissolve with an ink front.
// The ripple terms are inert while `horn` is zero, so the resting frame
// matches the previous halftone field. `panel` selects the destination's
// transition identity: stamp, ticket perforation, chevron, or ink flood.

struct PaintParams {
  colorA: vec4f,
  colorB: vec4f,
  resolution: vec2f,
  hornOrigin: vec2f,
  mix: f32,
  horn: f32,
  hornAge: f32,
  panel: f32,
}

@group(0) @binding(0) var<uniform> paint: PaintParams;

fn hash21(p: vec2f) -> f32 {
  return fract(sin(dot(p, vec2f(127.1, 311.7))) * 43758.5453123);
}

// Returns (reveal mask, accent line). The mask gates how far the halftone
// dots may grow, so each destination keeps the painted-dot language.
fn transitionField(panel: f32, uv: vec2f, progress: f32, aspect: f32) -> vec2f {
  var mask = 1.0;
  var accent = 0.0;
  let live = step(0.001, progress) * step(progress, 0.999);

  if (panel > 0.5 && panel < 1.5) {
    // About: stamp press - a filled disc grows from the centre, with a ring.
    let p = (uv - vec2f(0.5)) * vec2f(aspect, 1.0);
    let d = length(p);
    let maxRadius = length(vec2f(aspect * 0.5, 0.5));
    let front = progress * maxRadius * 1.05;
    mask = 1.0 - smoothstep(front - 0.06, front + 0.06, d);
    accent = (1.0 - smoothstep(0.0, 0.025, abs(d - front))) * live;
  } else if (panel > 1.5 && panel < 2.5) {
    // Blogs: ticket perforation - a centre band with punched slots.
    let band = abs(uv.y - 0.5);
    let front = progress * 0.6;
    let perf = abs(fract(uv.x * 14.0) - 0.5);
    let punched = smoothstep(0.06, 0.13, perf);
    // Close the perforations as the ticket lands, so the band resolves solid.
    let holes = mix(punched, 1.0, smoothstep(0.86, 1.0, progress));
    mask = (1.0 - smoothstep(front - 0.08, front + 0.08, band)) * holes;
    accent =
      (1.0 - smoothstep(0.0, 0.05, abs(band - front))) * live * (1.0 - punched);
  } else if (panel > 2.5 && panel < 3.5) {
    // Projects: chevron wipe - a V front sweeps across the ground.
    let chev = uv.x - abs(uv.y - 0.5) * 0.65;
    let front = progress * 1.4 - 0.2;
    mask = smoothstep(front - 0.16, front + 0.16, chev);
    accent = (1.0 - smoothstep(0.0, 0.07, abs(chev - front))) * live;
  } else if (panel > 3.5) {
    // Contact: ink flood - a noisy front bleeds across the paper.
    let noise = hash21(floor(uv * vec2f(8.0, 10.0)));
    let front = progress * 1.3 - 0.15 + (noise - 0.5) * 0.18;
    mask = smoothstep(front - 0.12, front + 0.12, uv.x);
    accent = smoothstep(0.0, 0.35, 1.0 - abs(uv.x - front)) * live * 0.4;
  }

  return vec2f(mask, accent);
}

@fragment fn fs_main(@builtin(position) frag: vec4f) -> @location(0) vec4f {
  let size = paint.resolution;
  let dotSize = max(6.0, size.y / 120.0);
  let uv = frag.xy / size;

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

  let style = transitionField(paint.panel, uv, paint.mix, size.x / size.y);
  let coverage = clamp(paint.mix * (0.15 + 0.85 * style.x), 0.0, 1.0);

  // Halftone dots grow from the A ground into the B ground.
  let radius = sqrt(coverage) * 0.72;
  let dotMask = 1.0 - smoothstep(radius - aa, radius + aa, dotDist);

  let ink = vec3f(0.039, 0.039, 0.039);
  var col = mix(paint.colorA.rgb, paint.colorB.rgb, dotMask);

  // Wet ink ring at the dot edge - the painted front line.
  let ring =
    (1.0 - smoothstep(0.0, aa * 3.0, abs(dotDist - radius))) *
    step(0.003, paint.mix) *
    step(paint.mix, 0.997);
  col = mix(col, ink, ring * 0.28);

  // The transition accent: a warm line on the stamp, perforation, chevron
  // or ink front, so each arrival reads as its own painted gesture.
  col = mix(col, vec3f(1.0, 0.83, 0.0), style.y * 0.35);

  // Warm glint riding the horn ripple, kept inside the wet dot front.
  let glint = abs(wave) * (1.0 - smoothstep(0.0, 0.85, dotDist)) * 0.35;
  col = mix(col, vec3f(1.0, 0.83, 0.0), glint);

  // Paper grain.
  let grain = hash21(floor(pos * 1.63));
  col += vec3f((grain - 0.5) * 0.03);

  // Vignette so the poster edges sit down.
  let v = 1.0 - smoothstep(0.25, 1.15, distance(uv, vec2f(0.5)));
  col *= mix(0.9, 1.0, v);

  return vec4f(col, 1.0);
}
