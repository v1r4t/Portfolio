import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PROJECTS, getProject } from '@/data/portfolio'
import { createPageMetadata } from '@/lib/metadata'
import { SmoothScroll } from '@/components/SmoothScroll'
import { ChevronBand, CornerCluster } from '@/components/art/Ornaments'

interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) return {}
  return createPageMetadata({
    title: project.title,
    description: project.description,
    path: `/projects/${project.slug}`,
    og: { sub: project.subtitle, bg: project.themeColor, accent: project.accentColor },
  })
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) notFound()

  const index = PROJECTS.findIndex((p) => p.slug === project.slug)
  const next = PROJECTS[(index + 1) % PROJECTS.length]
  const { caseStudy } = project

  return (
    <main className="detail-page">
      <SmoothScroll />
      <div className="detail-bar">
        <Link href="/#projects" className="detail-back">
          ← Back to the road
        </Link>
        <span className="detail-mark">CASE FILE // {project.year}</span>
      </div>

      <header
        className="detail-hero"
        style={
          {
            '--case-color': project.themeColor,
            '--case-accent': project.accentColor,
          } as React.CSSProperties
        }
      >
        <CornerCluster corner="tr" />
        <ChevronBand className="chevrons-bottom" flip />
        <span className="detail-kicker">
          {project.category} / {project.year}
        </span>
        <h1 className="detail-title">{project.title}</h1>
        <p className="detail-sub">{project.subtitle}</p>
      </header>

      <div className="detail-body">
        <dl className="case-meta">
          <div>
            <dt>Client</dt>
            <dd>{caseStudy.client}</dd>
          </div>
          <div>
            <dt>Timeline</dt>
            <dd>{caseStudy.timeline}</dd>
          </div>
          <div>
            <dt>Role</dt>
            <dd>{caseStudy.role}</dd>
          </div>
        </dl>

        <section className="case-block">
          <h2>Overview</h2>
          <p>{caseStudy.overview}</p>
        </section>

        <section className="case-block">
          <h2>The Challenge</h2>
          <p>{caseStudy.challenge}</p>
        </section>

        <section className="case-block">
          <h2>The Solution</h2>
          <p>{caseStudy.solution}</p>
        </section>

        <section className="case-block">
          <h2>Deliverables</h2>
          <ul className="tick-list">
            {caseStudy.deliverables.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="case-block">
          <h2>Tools</h2>
          <div className="tags">
            {caseStudy.toolsUsed.map((tool) => (
              <span key={tool}>{tool}</span>
            ))}
          </div>
        </section>

        {caseStudy.metrics && caseStudy.metrics.length > 0 && (
          <section className="case-block">
            <h2>Results</h2>
            <div className="metric-row">
              {caseStudy.metrics.map((metric) => (
                <div key={metric.label} className="metric-tile">
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        <Link className="detail-next" href={`/projects/${next.slug}`}>
          Next case file: {next.title} →
        </Link>
      </div>
    </main>
  )
}
