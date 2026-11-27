export interface CaseStudyFeature {
  title: string
  description: string
}

export interface CaseStudyStep {
  title: string
  description: string
}

export interface CaseStudyDecision {
  title: string
  choice: string
  why: string
  tradeoff: string
}

export interface Project {
  id: string
  slug: string
  title: string
  subtitle: string
  category: 'Brand Identity' | 'Web Engineering' | 'Motion Systems' | 'Creative Direction' | 'AI Engineering'
  year: string
  description: string
  tags: string[]
  themeColor: string
  accentColor: string
  coverPattern: 'lotus' | 'peacock' | 'elephant' | 'hazard'
  links?: {
    live?: string
    github?: string
    linkedin?: string
  }
  caseStudy: {
    client: string
    timeline: string
    role: string
    status?: string
    team?: string[]
    overview: string
    challenge: string
    constraints?: string[]
    solution: string
    screenshots?: GalleryPhoto[]
    mobileScreenshots?: GalleryPhoto[]
    features?: CaseStudyFeature[]
    architecture?: CaseStudyStep[]
    decisions?: CaseStudyDecision[]
    deliverables: string[]
    toolsUsed: string[]
    metrics?: { label: string; value: string }[]
    nextSteps?: string[]
  }
}

export interface GalleryPhoto {
  src: string
  alt: string
  caption: string
  width: number
  height: number
}

export interface PostMeta {
  slug: string
  title: string
  date: string
  readTime: string
  summary: string
  tags: string[]
  order: number
  status: 'published' | 'in-progress'
  gallery?: GalleryPhoto[]
  permitMeta: {
    transitNo: string
    origin: string
    destination: string
    checkpoint: string
  }
}

export interface NavStop {
  id: string
  label: string
  number: string
  bgTheme: string
  title: string
}
