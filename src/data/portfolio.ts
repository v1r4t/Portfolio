import { NavStop, Project } from '../types'

export const NAV_STOPS: NavStop[] = [
  { id: 'home', label: 'Home', number: '01', bgTheme: '#45107a', title: 'Dhruva Vura' },
  { id: 'about', label: 'About', number: '02', bgTheme: '#1b3a8c', title: 'About Dhruva' },
  { id: 'blogs', label: 'Blogs', number: '03', bgTheme: '#00b3b0', title: 'Route Dispatches' },
  { id: 'projects', label: 'Projects', number: '04', bgTheme: '#ff2e88', title: 'Selected Works' },
  { id: 'contact', label: 'Contact', number: '05', bgTheme: '#fff8e7', title: 'Reach Out' },
]

export const PROJECTS: Project[] = [
  {
    id: 'project-one',
    slug: 'desi-neon-kinetic-identity',
    title: 'Desi Neon Kinetic Identity',
    subtitle: 'Sign-painting system for modern street food franchise',
    category: 'Brand Identity',
    year: '2026',
    description:
      'A contemporary visual identity blending Indian highway typography with high-contrast digital signage and retail packaging.',
    tags: ['Identity', 'Packaging', 'Typography', 'Custom Type'],
    themeColor: '#ff2e88',
    accentColor: '#ffd400',
    coverPattern: 'lotus',
    caseStudy: {
      client: 'Khaana Express Co.',
      timeline: '8 Weeks',
      role: 'Lead Identity Designer & Creative Technologist',
      overview:
        'Khaana Express required an unapologetically loud, authentic visual language that honored regional truck signage while feeling sharp on mobile apps, delivery fleet vinyl, and kiosk screens.',
      challenge:
        'Balancing raw folk typography with rigorous typographic hierarchy that remains legible under rapid glance conditions across digital and physical menus.',
      solution:
        'Engineered a variable typographic specimen with hand-chiseled glyph alternates, paired with high-voltage fluorescent pigment specs and dynamic digital display rules.',
      deliverables: [
        'Custom Brand Specimen Book',
        'Fleet Livery Design',
        'Interactive Digital Menu System',
        'Motion Guidelines',
      ],
      toolsUsed: ['Figma', 'Illustrator', 'Glyphs 3', 'After Effects'],
      metrics: [
        { label: 'Brand Recognition', value: '+74%' },
        { label: 'Outlets Rolled Out', value: '18 Locations' },
      ],
    },
  },
  {
    id: 'project-two',
    slug: 'downlink-telemetry-engine',
    title: 'Downlink Telemetry Engine',
    subtitle: 'High-frequency data visualization & flight interface',
    category: 'Web Engineering',
    year: '2025',
    description:
      'Real-time telemetry dashboard rendering high-density time-series signals with sub-millisecond canvas pipelines.',
    tags: ['Web Engineering', 'WebGL', 'TypeScript', 'Data Viz'],
    themeColor: '#00b3b0',
    accentColor: '#45107a',
    coverPattern: 'hazard',
    caseStudy: {
      client: 'AeroSignal Systems',
      timeline: '12 Weeks',
      role: 'Full-Stack UI Engineer & Systems Architect',
      overview:
        'Flight safety operators monitor thousands of raw sensory feeds simultaneously. AeroSignal needed an interface that prevents signal cognitive overload without dropping temporal resolution.',
      challenge:
        'Browser DOM nodes choked when visualizing 10,000+ data packets per second on standard hardware.',
      solution:
        'Built a specialized WebGL canvas streaming pipeline using zero-copy ArrayBuffers and customized HUD rendering that guarantees sustained 60 FPS under peak throughput.',
      deliverables: [
        'Telemetry Web Dashboard',
        'WebGL Particle Renderer',
        'Time-series Heatmap Engine',
        'Component Library',
      ],
      toolsUsed: ['React 19', 'TypeScript', 'Three.js / WebGL', 'WebSockets', 'Tailwind'],
      metrics: [
        { label: 'Rendering Latency', value: '< 2.4ms' },
        { label: 'Operator Speedup', value: '3.2x faster triage' },
      ],
    },
  },
  {
    id: 'project-three',
    slug: 'parrot-paisley-motion-spec',
    title: 'Parrot & Paisley Motion Spec',
    subtitle: 'Generative folklore animation for exhibition pavilion',
    category: 'Motion Systems',
    year: '2025',
    description:
      'Algorithmic procedural floral and avian patterns generated via mathematical vector curves for multi-projector immersion.',
    tags: ['Motion Systems', 'Generative Code', 'Shaders', 'Installation'],
    themeColor: '#8cc63f',
    accentColor: '#1b3a8c',
    coverPattern: 'peacock',
    caseStudy: {
      client: 'National Crafts Pavilion',
      timeline: '6 Weeks',
      role: 'Creative Developer & Motion Designer',
      overview:
        'An interactive exhibition ceiling that reacts to crowd density by blooming hand-illustrated Indian truck motifs and folklore animals in rhythmic cascades.',
      challenge:
        'Preserving hand-painted character (rough ink edges, authentic brush offsets) while computing geometry procedurally in real time.',
      solution:
        'Developed custom GLSL noise shaders that simulate ink bleeding on handmade paper and layered vector spline paths influenced by real-time depth cameras.',
      deliverables: [
        'Custom Shader Shaders',
        'Interactive Projection Mapping Rig',
        'Museum Exhibition Software',
      ],
      toolsUsed: ['GLSL / Shaders', 'Canvas API', 'TouchDesigner', 'SVG Geometry'],
      metrics: [
        { label: 'Visitors Engaged', value: '65,000+' },
        { label: 'Resolution', value: '4K Ultra-wide 60FPS' },
      ],
    },
  },
]

export const getProject = (slug: string): Project | undefined =>
  PROJECTS.find((p) => p.slug === slug)
