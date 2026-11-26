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
      role: 'Product design & full-stack development',
      status: 'Live product',
      overview:
        'Voyaq is a collaborative trip planner for Indian students. It replaces the scattered group-chat loop with one shared squad room: nominate destinations, vote, align budgets and dates, then turn the winning plan into an AI itinerary and a trip dashboard.',
      challenge:
        'Group trips stall because the important decisions live in different places. Destinations sit in one chat, budgets in another, dates in a spreadsheet, and nobody owns the final call. Voyaq needed to make consensus visible, keep sensitive numbers private, and turn a pile of preferences into a plan everyone can act on.',
      constraints: [
        'Group decisions stall when destination, budget, and dates live in separate chats.',
        'Students plan on phones, often on slow or intermittent connections.',
        'Budgets are sensitive; members need to share a range without exposing exact finances.',
        'Travel advice is only useful when it is local and current.',
      ],
      solution:
        'A squad-based flow where every decision becomes an explicit state: destinations are voted and locked, budgets are collected as anonymous ranges and reduced to a median, dates are coordinated, and the finished plan feeds an AI itinerary, a nine-tab destination hub, and an offline-ready toolkit.',
      features: [
        {
          title: 'Squad room',
          description:
            'Start a trip with an invite code. Friends join with colour-coded avatars and see the same decision state instead of a hundred forwarded messages.',
        },
        {
          title: 'Destination voting',
          description:
            'Everyone nominates and votes. A majority locks the destination, so the group can stop circling the same three options.',
        },
        {
          title: 'Anonymous budget alignment',
          description:
            'Each member shares a comfortable range. The median becomes the squad’s per-person target, protecting individual finances while keeping the plan realistic.',
        },
        {
          title: 'Dates and custom polls',
          description:
            'Propose date ranges, vote on them, and create ad-hoc polls for stay type, travel mode, or activities. The trip view unlocks once destination, budget, and dates are locked.',
        },
        {
          title: 'Destination hub and AI tips',
          description:
            'A nine-tab destination view covers overview, weather, food, places, events, safety, transport, budget, and AI-generated tips, with keyboard and prev/next navigation.',
        },
        {
          title: 'Offline trip toolkit',
          description:
            'Packing lists, a budget calculator, and a converter covering 15 currencies plus INR stay useful on the road, backed by a service worker, offline page, and installable PWA manifest.',
        },
      ],
      architecture: [
        {
          title: 'Shared state in Supabase',
          description:
            'Postgres, Auth, and Realtime keep votes, budgets, date locks, and squad membership in sync across every member’s phone.',
        },
        {
          title: 'AI and cache layer',
          description:
            'Gemini generates itineraries and destination guidance. Upstash Redis caches responses, with an in-memory fallback so the app still works when the cache is unavailable.',
        },
        {
          title: 'Resilient client',
          description:
            'Next.js App Router and React 19 power the interface, while a service worker, offline fallback, and generated PWA icons keep the trip tools available beyond good coverage.',
        },
      ],
      decisions: [
        {
          title: 'Vote, then lock',
          choice: 'Make every group decision an explicit state transition.',
          why:
            'A squad can see what is decided and what is still open, instead of scrolling through chat to reconstruct the latest answer.',
          tradeoff:
            'Less flexible once a decision is locked; reopening a destination or date needs to be a deliberate action.',
        },
        {
          title: 'Anonymous budget bands',
          choice: 'Ask for a comfortable range, then plan around the median.',
          why:
            'Members can be honest without revealing exact finances, and the squad still gets a usable per-person target.',
          tradeoff:
            'Less precise than exact amounts, and the median can hide a member whose budget sits far outside the group.',
        },
        {
          title: 'Offline-first trip tools',
          choice: 'Keep packing, budget, and currency tools usable without a connection.',
          why:
            'Trips move through weak-signal areas. The planning tools should not stop working at the edge of coverage.',
          tradeoff:
            'More caching and sync states to maintain, especially when live currency rates are unavailable.',
        },
      ],
      deliverables: [
        'Squad invite and membership flow',
        'Destination voting and locking',
        'Anonymous budget and date alignment',
        'Nine-tab destination hub',
        'AI itinerary and travel tips',
        'Offline toolkit and PWA',
      ],
      toolsUsed: [
        'Next.js',
        'React',
        'TypeScript',
        'Tailwind CSS',
        'Supabase',
        'Gemini',
        'Vitest',
        'Playwright',
      ],
      metrics: [
        { value: '175', label: 'Tests passing' },
        { value: '26', label: 'States covered' },
        { value: '9', label: 'Destination tabs' },
        { value: '15', label: 'Currencies + INR' },
      ],
      nextSteps: [
        'Group expense splitting after the trip',
        'Collaborative itinerary editing instead of a generated draft',
        'Date suggestions based on university calendars',
      ],
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
      github: 'https://github.com/v1r4t/Arthiq',
    },
    caseStudy: {
      client: 'CODEFURY 9.0',
      timeline: '2026',
      role: 'Product design & full-stack development',
      status: 'Hackathon build',
      team: ['Murali Manohar Vatlapati', 'Surya Mannam', 'Sai Teja', 'Dhruva Vura'],
      overview:
        'Arthiq is a financial confidence workspace for people who want to understand their money before they invest it. Quiz answers, budgets, goals, and portfolio data become an explainable readiness score, a risk profile, and a set of next steps that a beginner can actually act on.',
      challenge:
        'Most finance tools show performance without context. A new investor can see a number but not what produced it, whether it is good, or what to do next. Arthiq needed to explain the maths behind a score without pretending to be a financial adviser, and keep sensitive data behind a real account.',
      constraints: [
        'Users are beginners; a score without an explanation is worse than no score.',
        'Financial data is sensitive and must stay behind authentication.',
        'The product is educational, not regulated financial advice.',
        'Four people, one hackathon deadline, and no room for a black-box model.',
      ],
      solution:
        'A guided quiz-to-dashboard flow built on a deterministic finance engine. The engine computes the readiness score, portfolio maths, and recommendations; the interface shows the inputs and reasoning behind each result, while an AI helpline handles plain-language questions.',
      features: [
        {
          title: 'Readiness quiz',
          description:
            'A short assessment produces a personalised risk profile, a confidence band, and a readiness score instead of a generic risk label.',
        },
        {
          title: 'Portfolio workspace',
          description:
            'Manual entries and CSV import bring holdings into one view, with portfolio maths handled by the same deterministic engine.',
        },
        {
          title: 'Budget and emergency fund',
          description:
            'Safe-spending guidance and reserve targets show whether the user has enough of a buffer before taking on investment risk.',
        },
        {
          title: 'Goals and calculators',
          description:
            'Milestones, contribution planning, savings-rate calculators, and timeline progress connect today’s decisions to a specific goal.',
        },
        {
          title: 'Learn and AI helpline',
          description:
            'Plain-language explainers cover financial concepts, while the AI helpline answers questions about spending, goals, and money habits.',
        },
        {
          title: 'Guest mode',
          description:
            'New users can explore locally without signing up, then migrate their workspace into an authenticated Firebase account.',
        },
      ],
      architecture: [
        {
          title: 'Deterministic finance engine',
          description:
            'The core calculations live in financeService.js. Scores, portfolio maths, and recommendations are reproducible, so the same inputs produce the same result and the reasoning can be shown.',
        },
        {
          title: 'React SPA and Firebase',
          description:
            'React and Vite handle the client-side workspace. Firebase Auth and Firestore keep each user’s data behind their own account and persist it between sessions.',
        },
        {
          title: 'AI helpline behind an edge function',
          description:
            'The chat UI calls a Supabase Edge Function, which forwards requests to an LLM without exposing provider credentials in the browser.',
        },
      ],
      decisions: [
        {
          title: 'Rules before models',
          choice: 'Use a deterministic engine for money maths and an LLM only for explanation and Q&A.',
          why:
            'A financial score has to be reproducible and inspectable. A language model is useful for language, not for silently inventing portfolio arithmetic.',
          tradeoff:
            'More calculation code to write and test, and less flexibility than handing the whole problem to a model.',
        },
        {
          title: 'Show the reasoning',
          choice: 'Surface the inputs and calculation behind every score.',
          why:
            'Explaining why a result appeared is the difference between education and a black box. It also gives the user a way to challenge the output.',
          tradeoff:
            'More interface surface: modals, breakdowns, and explanations for every score and recommendation.',
        },
        {
          title: 'Guest mode before sign-up',
          choice: 'Let people try the workspace locally, then migrate when they are ready.',
          why:
            'Financial tools ask for trust before they have earned it. A local trial lowers the barrier without weakening the signed-in data model.',
          tradeoff:
            'Migration and merge states add complexity, especially when a guest workspace already contains holdings and goals.',
        },
      ],
      deliverables: [
        'Readiness quiz and risk profile',
        'Financial dashboard',
        'Portfolio tracker with CSV import',
        'Budget and emergency fund planner',
        'Goal tracking and calculators',
        'Learn library and AI helpline',
        'Guest-to-account migration',
      ],
      toolsUsed: [
        'React',
        'Vite',
        'JavaScript',
        'Firebase Auth',
        'Firestore',
        'Supabase Edge Functions',
        'Vercel',
      ],
      metrics: [
        { value: '5TH', label: 'CODEFURY 9.0' },
        { value: '4', label: 'Person team' },
        { value: '8', label: 'Feature areas' },
      ],
      nextSteps: [
        'Broker and bank CSV presets instead of manual column mapping',
        'Scenario projections for long-term goals',
        'Shared household workspaces with separate permissions',
      ],
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
      timeline: '2026 · overnight hackathon',
      role: 'AI engineering & product design',
      status: 'Hackathon prototype',
      team: [
        'Parswanadh Balcha',
        'Kamireddy Guna Preethika',
        'Y Bhargava Nandan',
        'Dhruva Vura',
      ],
      overview:
        'Jadal is an agentic, physics-based allocation system for warabandi-style canal irrigation. It treats water allocation as a live decision problem: water availability, crop requirements, canal conditions, and distribution constraints go in; a fairer, more adaptive allocation plan comes out.',
      challenge:
        'Warabandi allocates water through fixed turns, but the field is not fixed. Supply changes, canals lose water, and different crops need different amounts at different times. Farmers and canal managers need a plan that adapts to those conditions and can be understood by the people acting on it, not a dashboard that assumes perfect data.',
      constraints: [
        'Water supply, canal losses, and crop demand change faster than a fixed roster.',
        'Allocation has to be explainable to the people acting on it.',
        'Field users may prefer voice and regional languages to a dashboard.',
        'An overnight build had to survive a live demo.',
      ],
      solution:
        'A physics-informed allocation model paired with an agentic decision loop. Instead of replaying a fixed schedule, Jadal weighs the current constraints and proposes a distribution plan, then explains and adjusts it through a multilingual voice layer built on Deepgram, Sarvam, and Laya.',
      features: [
        {
          title: 'Physics-informed allocation',
          description:
            'Canal conditions and available water shape the plan, so the output reflects the physical system rather than an abstract roster.',
        },
        {
          title: 'Crop-aware scheduling',
          description:
            'Crop requirements and distribution constraints are part of the decision, not an afterthought applied to a fixed turn.',
        },
        {
          title: 'Agentic decision loop',
          description:
            'The system adapts the allocation as conditions change, instead of assuming the same schedule works every rotation.',
        },
        {
          title: 'Multilingual voice input',
          description:
            'Deepgram handles speech-to-text so a user can describe the situation or ask for an allocation without typing into a form.',
        },
        {
          title: 'Regional-language conversation',
          description:
            'Sarvam brings regional-language communication into the loop, making the system accessible beyond English-speaking operators.',
        },
        {
          title: 'Conversational explanation',
          description:
            'Laya adds a conversational layer so the allocation can be discussed and explained, not just returned as a number.',
        },
      ],
      architecture: [
        {
          title: 'Inputs',
          description:
            'Water availability, crop requirements, canal conditions, and distribution constraints are gathered as the current state of the system.',
        },
        {
          title: 'Allocation engine',
          description:
            'A physics-based canal model and an agentic decision loop work together to propose a distribution plan that fits the current constraints.',
        },
        {
          title: 'Voice layer',
          description:
            'Deepgram turns speech into text, Sarvam handles regional-language communication, and Laya carries the conversational explanation back to the user.',
        },
      ],
      decisions: [
        {
          title: 'Model the canal, not just the calendar',
          choice: 'Treat allocation as a dynamic decision grounded in physics and current constraints.',
          why:
            'A fixed warabandi roster cannot respond to changing supply, losses, and crop demand. The system should reason about the canal it actually has.',
          tradeoff:
            'A physics model needs real data and validation; a calendar is much easier to ship but much less responsive.',
        },
        {
          title: 'Voice-first access',
          choice: 'Put speech and regional language in the primary interaction, not a settings menu.',
          why:
            'A field user should not need a laptop or a dashboard literacy to ask about water. Voice lowers the barrier to the allocation itself.',
          tradeoff:
            'Speech recognition is less reliable in noisy fields, and regional-language coverage adds testing surface.',
        },
        {
          title: 'Explain the allocation',
          choice: 'Pair the plan with a conversational explanation instead of returning only a result.',
          why:
            'An allocation that cannot be explained is hard to trust and harder to act on. The conversational layer gives the user a way to question the plan.',
          tradeoff:
            'More prompt and interface work, and the explanation has to stay consistent with the underlying allocation.',
        },
      ],
      deliverables: [
        'Physics-informed allocation model',
        'Agentic decision loop',
        'Multilingual voice interface',
        'Working hackathon demo',
      ],
      toolsUsed: ['Python', 'FastAPI', 'Deepgram', 'Sarvam', 'Laya'],
      metrics: [
        { value: '3RD', label: 'NIMBUS 2026' },
        { value: '4', label: 'Person team' },
        { value: '1', label: 'Overnight build' },
      ],
      nextSteps: [
        'Field validation with real canal and crop data',
        'A low-bandwidth voice mode for weak coverage',
        'A what-if simulator for canal managers',
      ],
    },
  },
]

export const getProject = (slug: string): Project | undefined =>
  PROJECTS.find((p) => p.slug === slug)
