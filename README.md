# Portfolio

Personal portfolio of Dhruva Vura — Indian highway truck art meets high-performance web engineering.

## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript** strict
- **Tailwind CSS v4** via PostCSS, hand-written design tokens in `src/styles/theme.css`
- **GSAP** (ScrollTrigger, SplitText) + **Lenis** for journey smoothing, decal type and parallax
- **Three.js + custom GLSL** paint engine: halftone-dissolve grounds with ink edges
- **Web Audio** analyser drives the horn-reactive bulb chains
- **MDX** blog posts (`next-mdx-remote`) with frontmatter (`gray-matter`)
- `next/font` for the six-voice type system (Teko, Modak, Anek Devanagari, Baloo Tammudu 2, Space Mono, Barlow)

## Run

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static build; all routes prerendered
npm run start
```

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
- `src/lib/posts.ts` — MDX loading and validation
- `src/lib/metadata.ts` — canonical/OG metadata helper

## Verification

`scripts/verify.mjs` is a Playwright smoke test: panels, scroll math, hash restore (/#projects), keyboard nav, reduced motion, overlay pointer discipline, and detail routes. `scripts/verify-motion.mjs` checks the motion layers: loader counter, ink cursor, horn analyser levels, hero parallax and mobile WebGL. Run with the dev server up:

```bash
npm install --no-save playwright
node scripts/verify.mjs
node scripts/verify-motion.mjs
```

Design docs: `docs/superpowers/plans/2026-11-24-portfolio-rebuild.md` (plan).
