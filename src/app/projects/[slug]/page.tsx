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

export const dynamicParams = false

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
          {caseStudy.status && (
            <div>
              <dt>Status</dt>
              <dd>{caseStudy.status}</dd>
            </div>
          )}
        </dl>

        {caseStudy.team && (
          <p className="case-team">
            <span>Team</span> {caseStudy.team.join(' · ')}
          </p>
        )}

        {(project.links?.live || project.links?.github || project.links?.linkedin) && (
          <div className="project-links">
            {project.links?.live && (
              <a href={project.links.live} target="_blank" rel="noopener noreferrer">
                Live Site ↗
              </a>
            )}
            {project.links?.github && (
              <a href={project.links.github} target="_blank" rel="noopener noreferrer">
                GitHub ↗
              </a>
            )}
            {project.links?.linkedin && (
              <a href={project.links.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn ↗
              </a>
            )}
          </div>
        )}

        <section className="case-block">
          <h2>Overview</h2>
          <p className="case-lede">{caseStudy.overview}</p>
        </section>

        <section className="case-block">
          <h2>The Problem</h2>
          <p>{caseStudy.challenge}</p>
          {caseStudy.constraints && caseStudy.constraints.length > 0 && (
            <ul className="tick-list case-constraints">
              {caseStudy.constraints.map((constraint) => (
                <li key={constraint}>{constraint}</li>
              ))}
            </ul>
          )}
        </section>

        <section className="case-block">
          <h2>The Approach</h2>
          <p>{caseStudy.solution}</p>
        </section>

        {caseStudy.features && caseStudy.features.length > 0 && (
          <section className="case-block">
            <h2>What It Does</h2>
            <div className="feature-grid">
              {caseStudy.features.map((feature, index) => (
                <article className="feature-card" key={feature.title}>
                  <span className="feature-num">0{index + 1}</span>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {caseStudy.architecture && caseStudy.architecture.length > 0 && (
          <section className="case-block">
            <h2>How It Works</h2>
            <ol className="flow-list">
              {caseStudy.architecture.map((step) => (
                <li key={step.title}>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </li>
              ))}
            </ol>
          </section>
        )}

        {caseStudy.decisions && caseStudy.decisions.length > 0 && (
          <section className="case-block">
            <h2>Key Decisions</h2>
            <div className="decision-grid">
              {caseStudy.decisions.map((decision) => (
                <article className="decision-card" key={decision.title}>
                  <h3>{decision.title}</h3>
                  <p className="decision-choice">{decision.choice}</p>
                  <p>{decision.why}</p>
                  <p className="decision-tradeoff">
                    <b>Tradeoff:</b> {decision.tradeoff}
                  </p>
                </article>
              ))}
            </div>
          </section>
        )}

        <div className="case-columns">
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
        </div>

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

        {caseStudy.nextSteps && caseStudy.nextSteps.length > 0 && (
          <section className="case-block">
            <h2>What I’d Build Next</h2>
            <ul className="tick-list">
              {caseStudy.nextSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          </section>
        )}

        <Link className="detail-next" href={`/projects/${next.slug}`}>
          Next case file: {next.title} →
        </Link>
      </div>
    </main>
  )
}
