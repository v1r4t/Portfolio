export interface Project {
  id: string
  slug: string
  title: string
  subtitle: string
  category: 'Brand Identity' | 'Web Engineering' | 'Motion Systems' | 'Creative Direction'
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
    overview: string
    challenge: string
    solution: string
    deliverables: string[]
    toolsUsed: string[]
    metrics?: { label: string; value: string }[]
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
