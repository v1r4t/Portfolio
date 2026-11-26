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
    id: 'project-voyaq',
    slug: 'voyaq',
    title: 'Voyaq',
    subtitle: 'Group trip planning without the group-chat chaos',
    category: 'Web Engineering',
    year: '2026',
    description:
      'A collaborative trip planner that aligns destinations, budgets, and dates, then generates an AI itinerary for the whole squad.',
    tags: ['Product', 'React', 'TypeScript', 'AI'],
    themeColor: '#45107a',
    accentColor: '#00b3b0',
    coverPattern: 'lotus',
    links: {
      live: 'https://voyaq.vercel.app',
      github: 'https://github.com/v1r4t/VOYAQ',
    },
    caseStudy: {
      client: 'Independent Product',
      timeline: '2026',
      role: 'Product Designer & Developer',
      overview:
        'Voyaq replaces the scattered group-chat planning loop with one shared space: a squad link, destination voting, budget and date alignment, and an AI itinerary built from the winning plan.',
      challenge:
        'Group trips stall because destinations, budgets, and dates live across different chats and nobody owns the final decision. Voyaq needed to make consensus visible and turn it into an actionable plan.',
      solution:
        'Built a squad-based flow with live destination votes, budget and date locking, and an AI itinerary that turns the selected destination into a day-by-day route with per-person costs.',
      deliverables: [
        'Squad planning flow',
        'Destination voting',
        'Budget and date alignment',
        'AI itinerary generator',
      ],
      toolsUsed: ['React', 'TypeScript', 'AI', 'Vercel'],
    },
  },
  {
    id: 'project-arthiq',
    slug: 'arthiq',
    title: 'Arthiq',
    subtitle: 'Personal finance and investment planning, made legible',
    category: 'Web Engineering',
    year: '2026',
    description:
      'A financial learning platform that turns risk profiling, spending analysis, and goal planning into a clear path forward.',
    tags: ['Fintech', 'React', 'Risk Profiling', 'Data Viz'],
    themeColor: '#00b3b0',
    accentColor: '#45107a',
    coverPattern: 'hazard',
    links: {
      live: 'https://arthiq-tau.vercel.app',
      github: 'https://github.com/v1r4t/Arthiq',
    },
    caseStudy: {
      client: 'CODEFURY 9.0',
      timeline: '2026',
      role: 'Product Designer & Full-Stack Developer',
      overview:
        'Arthiq helps people understand their money before they invest it. The platform combines risk profiling, investment tracking, spending analysis, and goal planning into one guided financial-health view.',
      challenge:
        'Personal finance tools often show performance without context. Arthiq needed to help users connect spending, risk, and goals without pretending to be a financial adviser.',
      solution:
        'Built a guided assessment and dashboard that explains financial health in plain language, then maps recommendations to the user’s goals and risk profile.',
      deliverables: [
        'Financial health assessment',
        'Risk profile',
        'Spending analysis',
        'Goal planner',
      ],
      toolsUsed: ['React', 'JavaScript', 'Fintech APIs', 'Vercel'],
      metrics: [{ label: 'Recognition', value: 'Consolation Prize, CODEFURY 9.0' }],
    },
  },
  {
    id: 'project-jadal',
    slug: 'jadal',
    title: 'Jadal',
    subtitle: 'Agentic canal water allocation for warabandi irrigation',
    category: 'Web Engineering',
    year: '2026',
    description:
      'A physics-informed, voice-first allocation system that helps distribute limited canal water fairly across farms and crops.',
    tags: ['Agentic AI', 'Physics', 'Speech', 'Irrigation'],
    themeColor: '#8cc63f',
    accentColor: '#1b3a8c',
    coverPattern: 'peacock',
    links: {
      linkedin:
        'https://www.linkedin.com/posts/dhruva-vura_hackathon-jadal-ai-activity-7513102678994976768-IHHA',
    },
    caseStudy: {
      client: 'NIMBUS 2026',
      timeline: '2026',
      role: 'AI Engineer & Product Designer',
      overview:
        'Jadal treats warabandi water allocation as a dynamic decision problem: it weighs water availability, crop requirements, canal conditions, and distribution constraints instead of following a fixed schedule.',
      challenge:
        'Water distribution is constrained, uneven, and time-sensitive. Farmers need a plan that is fair, explainable, and usable in the field, not a dashboard that assumes perfect data.',
      solution:
        'Combined a physics-based canal model with agentic decision-making and multilingual voice interaction using Deepgram, Sarvam, and Laya.',
      deliverables: [
        'Allocation model',
        'Agentic decision loop',
        'Voice and multilingual interface',
        'Hackathon demo',
      ],
      toolsUsed: ['Python', 'FastAPI', 'Deepgram', 'Sarvam', 'Laya'],
      metrics: [{ label: 'Recognition', value: '3rd Prize, NIMBUS 2026' }],
    },
  },
]

export const getProject = (slug: string): Project | undefined =>
  PROJECTS.find((p) => p.slug === slug)
