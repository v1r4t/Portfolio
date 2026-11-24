export interface Project {
  id: string
  title: string
  subtitle: string
  category: 'Brand Identity' | 'Web Engineering' | 'Motion Systems' | 'Creative Direction'
  year: string
  description: string
  tags: string[]
  themeColor: string
  accentColor: string
  coverPattern: 'lotus' | 'peacock' | 'elephant' | 'hazard'
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

export interface BlogPost {
  id: string
  title: string
  slug: string
  date: string
  readTime: string
  summary: string
  tags: string[]
  permitMeta: {
    transitNo: string
    origin: string
    destination: string
    checkpoint: string
  }
  content: string[]
}

export interface NavStop {
  id: string
  label: string
  number: string
  bgTheme: string
  title: string
}
