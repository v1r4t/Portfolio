# Portfolio Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the truck-art portfolio on Next.js App Router with real project/blog routes and an edge-to-edge "Painted Lorry" maximalist skin.

**Architecture:** Next 16 App Router (`src/app`) with statically generated project pages and MDX blog posts. The homepage stays a client-side horizontal journey (five scroll-snap panels, fixed road + lorry). A code-drawn SVG motif library lives under `src/components/art` and is composed into per-panel density layers; GSAP + Lenis drive entrances and smooth scrolling. Deployment target Vercel; `next build` must remain fully static.

**Tech Stack:** Next 16.4.6, React 19.3.1, TypeScript 5.7 strict, Tailwind v4 (PostCSS plugin), GSAP 3.15.1, Lenis 1.3.28, next-mdx-remote 6.0.0, gray-matter 4.0.3, next/font (Google).

**Spec:** `C:\Users\itzdh\.opencode\plan\2026-11-24-portfolio-rebuild-design.md` (visual laws: `C:\Users\itzdh\.opencode\plan\design.md`)

## Global Constraints

- Tokens: `--t-violet #45107a`, `--t-pink #ff2e88`, `--t-yellow #ffd400`, `--t-turquoise #00b3b0`, `--t-green #8cc63f`, `--t-blue #1b3a8c`, `--t-red #e2231a`, `--t-paper #fff8e7`, `--t-ink #0a0a0a`. Never `#fff`; never ink text on violet; no gradients/blur/soft shadows.
- Type: Teko 700 oblique display only (≥2.4rem), Modak glyphs, Anek Devanagari for Devanagari, Baloo Tammudu 2 for the top word, Space Mono 700 uppercase micro-labels, Barlow body. Use exactly these six; `next/font/google`.
- Maximalism rule: motif art lives in margins/borders/grounds at partial opacity, always `pointer-events-none` + `aria-hidden`, never under body text at full strength; content wins hierarchy.
- Motion: GSAP + Lenis; transform/opacity only; `prefers-reduced-motion` renders art static and skips entrances.
- Deps allowed: gsap, lenis, next-mdx-remote, gray-matter. Nothing else.
- Every task ends with `npm run build` passing and a commit.

## File Structure

```
next.config.ts, postcss.config.mjs, tsconfig.json, package.json
src/app/layout.tsx            — fonts, metadata, theme.css import
src/app/page.tsx              — journey shell (client)
src/app/art/page.tsx          — dev-only motif gallery (noindex)
src/app/projects/[slug]/page.tsx, opengraph-image.tsx
src/app/blog/[slug]/page.tsx, opengraph-image.tsx
src/app/sitemap.ts, robots.ts, not-found.tsx
src/components/journey/{Journey,HeroPoster,NavigationRoad}.tsx
src/components/journey/panels/{About,Blogs,Projects,Contact}Panel.tsx
src/components/art/{motifs,ornaments,PanelArt}.tsx
src/components/{ProjectCaseStudy,BlogPostView}.tsx
src/data/portfolio.ts         — NAV_STOPS, PROJECTS
src/lib/{posts,metadata}.ts
src/types/index.ts
src/utils/{audio,halftone,useElementSize}.ts
src/styles/theme.css          — tokens + base + panel styles (evolved)
content/blog/*.mdx
```

## Review Focus

1. Hash restore: loading `/#projects` must land on the projects panel — scroll the track, not the window.
2. Reduced motion: with `prefers-reduced-motion: reduce`, no entrance animation may hide content permanently.
3. MDX fragility: missing/odd frontmatter must fail the build loudly, never render `undefined` pages.
4. Overlay discipline: every motif/ornament layer is `pointer-events-none`, `aria-hidden`, and never intercepts clicks on cards or the horn.
5. GSAP cleanup: React StrictMode double-mount must not duplicate ScrollTriggers or leak rAF loops.

---

### Task 1: Next.js scaffold replaces Vite

**Files:** Create `next.config.ts`, `postcss.config.mjs`, rewrite `tsconfig.json`, `package.json`; create `src/app/layout.tsx`, `src/app/page.tsx` (temporary); move `src/styles/theme.css` into the new shell.

**Interfaces:**
- Produces: `npm run dev|build|start`; `@import "tailwindcss";` at the top of `theme.css`; font CSS vars `--font-poster`, `--font-glyph`, `--font-deva`, `--font-telugu`, `--font-mono`, `--font-body` supplied by `next/font` in `layout.tsx`.

- [ ] Write `package.json` (deps: next 16.4.6, react 19.3.1, react-dom 19.3.1, gsap 3.15.1, lenis 1.3.28, next-mdx-remote 6.0.0, gray-matter 4.0.3, canvas-confetti, clsx, lucide-react, tailwind-merge; dev: typescript, @types/*, tailwindcss 4.3.5, @tailwindcss/postcss).
- [ ] Write `next.config.ts` (empty config, `typescript: { ignoreBuildErrors: false }`), `postcss.config.mjs` (`{"@tailwindcss/postcss": {}}`), tsconfig (`jsx: preserve`, `moduleResolution: bundler`, `paths: {"@/*": ["./src/*"]}`).
- [ ] `layout.tsx`: load the six fonts via `next/font/google` (weights from design.md), set CSS variables on `<html>`, export base metadata, import `theme.css`.
- [ ] Remove Vite entry points from the build path (`vite.config.js`, root `index.html` deleted in Task 7; keep for now untouched).
- [ ] Run `npm install && npm run build`. Expected: compiles, static `/`.
- [ ] Commit `chore: swap vite shell for next app router`.

### Task 2: Motif art library

**Files:** Create `src/components/art/motifs.tsx`, `src/components/art/ornaments.tsx`, `src/components/art/PanelArt.tsx`, `src/app/art/page.tsx`.

**Interfaces:**
- Produces: `Lotus({className?})`, `Paisley({className?})`, `PeacockFeather({className?})`, `ChevronBand({className?})`, `BulbChain({className?})`, `LotusCluster({className?})`, `StarBurst({className?})`; `ParichchitBorder()`, `CornerCluster({corner:"tl"|"tr"|"bl"|"br"})`, `PermitStamp({label})`, `TicketEdge()`, `BarcodeStrip()`, `HazardTape()`; `PanelArt({variant:"poster"|"about"|"blogs"|"projects"|"contact"})`.
- All SVGs draw in ink outlines with pigment fills, `currentColor` for strokes where a layer needs recoloring; all root elements `aria-hidden="true"` and `pointer-events:none` via class.

- [ ] Author motifs: lotus (petal rings + outline), paisley (teardrop with dot work), peacock feather (eye + barbs), chevron band, bulb chain (circle bulbs on wire), 6-lotus corner cluster, star burst.
- [ ] Author ornaments: repeating parichchit border frame (corner + edge tiles), corner clusters, stamp (dashed ring, Devanagari accent), ticket edge (perforation), barcode strip, hazard tape.
- [ ] `PanelArt` composes per-panel density: poster = border + 4 corner clusters + margin swarms; about = painted panel bands + Devanagari accents; blogs = stamp corners + ticket edges; projects = mural bands + chevrons; contact = densest border + bulbs + hazard + "HORN OK PLEASE" ornament frame.
- [ ] `src/app/art/page.tsx` gallery (noindex metadata) renders every motif and every PanelArt variant for visual review.
- [ ] `npm run build`, commit `feat: add code-drawn truck-art motif library`.

### Task 3: Data, content, and MDX pipeline

**Files:** Create `src/types/index.ts`, `src/data/portfolio.ts`, `src/lib/posts.ts`, `content/blog/*.mdx` (3 posts), port `src/utils/{audio,halftone,useElementSize}.ts`.

**Interfaces:**
- Produces: `NAV_STOPS: NavStop[]`, `PROJECTS: Project[]` (same shapes as today), `PostMeta {slug,title,date,readTime,summary,tags,permitMeta}`; `getAllPosts(): PostMeta[]`, `getPost(slug): {meta: PostMeta, content: string}`, `getPostSlugs(): string[]`; `PostMeta` throws at build if required frontmatter is missing.

- [ ] Port types + data verbatim (ids, slugs, colors, case studies).
- [ ] Convert `BLOGS` to three `.mdx` files with frontmatter (`title,date,readTime,summary,tags,permitMeta.{transitNo,origin,destination,checkpoint}`) and the same prose.
- [ ] `posts.ts`: fs read of `content/blog`, gray-matter parse, frontmatter validation (throw listing missing keys), sorted by date desc.
- [ ] `npm run build`, commit `feat: port portfolio data and mdx posts`.

### Task 4: Journey home

**Files:** Create `src/components/journey/{Journey,HeroPoster,NavigationRoad}.tsx`, `src/components/journey/panels/{About,Blogs,Projects,Contact}Panel.tsx`, rewrite `src/app/page.tsx`.

**Interfaces:**
- Consumes: `NAV_STOPS`, `PROJECTS`, `getAllPosts()`, `PanelArt`, `useHorn()` from `audio.ts`.
- Produces: `<Journey stops={NAV_STOPS} projects={PROJECTS} posts={PostMeta[]} />`; DOM contract: `#track` (scroll container), panels `#home|#about|#blogs|#projects|#contact`, road `#road`, truck `#truck`; `scrollToStop(index)`.

- [ ] Port the current journey behavior: scroll-snap track, index tracking, bg-theme sync, keyboard arrows/PageUp/PageDown, driving state, road + truck, poster entrance sequence, loading curtain.
- [ ] GSAP entrance timeline only (poster rise, name swing, truck arrival) with reduced-motion gate; Lenis attached to the track (horizontal) and inner panels (vertical on ≤900px).
- [ ] Hash restore: on mount, if `location.hash` matches a stop, jump to that panel after fonts settle.
- [ ] Teaser cards link to `/projects/[slug]` and `/blog/[slug]` (modals removed).
- [ ] `npm run build`, commit `feat: rebuild horizontal journey on next`.

### Task 5: Maximalist panel skins

**Files:** Modify `src/styles/theme.css` (art layer classes, density per panel), panels from Task 4.

**Interfaces:** Consumes `PanelArt` variants; produces final visual composition per spec density plan.

- [ ] Poster: tailgate border + corner clusters + portrait art; About: painted bands + Devanagari accents + stamps; Blogs: ticket cards + stamp corners + marquee ticker; Projects: mural cards + chevrons + stroke-draw GSAP; Contact: densest frame + bulbs + hazard + horn sign.
- [ ] Enforce layering: art z-index below content, text never over full-strength motifs; verify click targets keep working.
- [ ] `npm run build`, commit `feat: painted lorry panel treatments`.

### Task 6: Detail routes, MDX rendering, OG images

**Files:** Create `src/app/projects/[slug]/page.tsx`, `src/app/blog/[slug]/page.tsx`, `src/components/{ProjectCaseStudy,BlogPostView}.tsx`, `opengraph-image.tsx` for both routes, `src/lib/metadata.ts`.

**Interfaces:**
- Produces: `generateStaticParams()` for both routes; `createPageMetadata({title,description,path,image?})`; OG `ImageResponse` (1200×630) in truck-art style using palette + Modak/Teko via fetch of Google font CSS (fail soft to system font).

- [ ] Project page: full case study fields, project theme colors as page ground bands, back-to-journey link.
- [ ] Blog page: MDX via `MDXRemote` (`next-mdx-remote/rsc`), permit header, next-post link.
- [ ] OG images with project/blog title + palette block + motif (static SVG path reused).
- [ ] `npm run build`; verify all slugs statically generated; commit `feat: project and blog detail routes`.

### Task 7: SEO kit, cleanup, deploy readiness

**Files:** Create `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/not-found.tsx`, `public/` assets (port `potrait.png`, `trim-frame.svg`); delete Vite leftovers (`vite.config.js`, root `index.html`, `src/App.tsx`, `src/main.tsx`, `src/main.js`, `src/motifs.js`, `src/trim.js`, `src/trim.css`, `src/type.css`, `src/style.css`, `src/palette.css`, `dist/`); update `README.md`.

**Interfaces:** Produces build-time `sitemap.xml` + `robots.txt`; 404 styled as a broken-down lorry sign.

- [ ] Metadata per route (canonical, OG/Twitter), sitemap includes `/`, all projects, all posts; robots allows all, disallows `/art`.
- [ ] Port binary/SVG assets; fix any `/potrait.png` references (keep the misspelled filename).
- [ ] Remove Vite leftovers and unused modal components; `npm run build` green; `npm run start` smoke test all routes.
- [ ] Commit `chore: seo, assets, and vite cleanup`.

### Task 8: Verification loop and GLM-5.3 review gates

**Files:** none (verification); fixes as findings demand.

- [ ] `npm run build` clean; `npm run start`; walk `/`, `/projects/desi-neon-kinetic-identity`, `/blog/sign-painters-eye-highway-lettering`, `/art` on desktop + 390px viewport.
- [ ] Capture screenshots (browsermcp or `capture_live_site`) of all five panels + details; check density, contrast, hierarchy.
- [ ] Reduced-motion pass (emulate `prefers-reduced-motion: reduce`) — content visible, no broken entrances.
- [ ] Keyboard + hash-anchor pass (`/#projects`).
- [ ] Review subagent on `opencode-go/glm-5.3`: diff review vs spec + design.md; fix findings; re-run build; repeat until clean.
- [ ] Final commit `feat: complete next.js painted-lorry rebuild`.
