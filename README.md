# Portfolio

Personal portfolio of Dhruva Vura — Indian highway truck art meets high-performance web engineering.

## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript** strict
- **Tailwind CSS v4** via PostCSS, hand-written design tokens in `src/styles/theme.css`
- **GSAP** (ScrollTrigger, SplitText) + **Lenis** for journey smoothing, decal type and parallax
- **vgpu 0.6 + WGSL** paint engine: halftone-dissolve grounds, panel-specific transition masks (stamp, ticket, chevron, ink), a horn-reactive ripple, and a WebGL2 ground fallback
- **Web Audio** analyser drives the horn-reactive bulb chains
- **MDX** blog posts (`@mdx-js/mdx`) precompiled at build time into `src/data/posts.generated.json`
- `next/font` for the six-voice type system (Teko, Modak, Anek Devanagari, Baloo Tammudu 2, Space Mono, Barlow)

## Run

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static build; all routes prerendered
npm run start
```

## Deploy

The site runs on Cloudflare Workers through the OpenNext adapter.

```bash
npx wrangler login   # first time only
npm run deploy:cf
```

Production: <https://dhruva-portfolio.dhruvav0308.workers.dev>

`wrangler.jsonc` holds the Worker name, compatibility flags, assets binding, and the production `SITE_URL`. The deploy script applies a Windows-only junction fallback to the OpenNext copy step before building.

## Routes

| Route | What it is |
|---|---|
| `/` | The horizontal truck journey — five scroll-snap panels, fixed road + lorry, synthesized horn |
| `/projects/[slug]` | Statically generated case studies |
| `/blog/[slug]` | MDX route dispatches |
| `/art` | Motif paint shop (design gallery, noindex) |
| `/og?title=…` | Truck-art OG image generator |

## Where things live

- `src/components/art/` — code-drawn motif library (`MotifDefs`, `Ornaments`, `PanelArt`)
- `src/components/journey/` — the journey, road, poster and five panels
- `src/data/portfolio.ts` — projects + nav stops (typed)
- `content/blog/*.mdx` — posts (frontmatter validated at build)
- `scripts/generate-posts.mjs` — validates posts and precompiles MDX to bundled HTML
- `src/data/posts.generated.json` — generated post metadata + HTML, committed for Cloudflare builds
- `src/lib/posts.ts` — reads the generated posts module
- `src/lib/metadata.ts` — canonical/OG metadata helper

## Verification

`scripts/verify.mjs` is a Playwright smoke test: panels, scroll math, hash restore (/#projects), keyboard nav, reduced motion, overlay pointer discipline, and detail routes. `scripts/verify-vgpu.mjs` checks the WebGPU paint engine and the flat fallback; `npm run verify:shader` renders the WGSL headlessly and asserts the pigments and horn ripple. Run the browser checks with the dev server up:

```bash
npm install --no-save playwright
npx playwright install chromium
node scripts/verify.mjs
npm run verify:vgpu
npm run verify:shader
```

`verify:vgpu` prefers the system Edge channel on Windows (needed for headless WebGPU) and falls back to Playwright Chromium.

Design docs: `docs/superpowers/plans/2026-11-24-portfolio-rebuild.md` (plan).
