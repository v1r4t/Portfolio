import React, { useState } from 'react'
import { PROJECTS } from '../data/portfolioData'
import { Project } from '../types'
import { ProjectModal } from './ProjectModal'
import { PanelDecoration } from './PanelDecoration'

export const ProjectsSection: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const coverClasses = ['cover-a', 'cover-b', 'cover-c']

  return (
    <section className="panel projects" id="projects" aria-labelledby="projects-title">
      <PanelDecoration panel="projects" />

      <div className="panel-inner">
        <header className="page-head">
          <span className="page-kicker">04 / Projects</span>
          <h2 className="page-title" id="projects-title">
            Projects
          </h2>
        </header>

        <div className="project-grid">
          {PROJECTS.map((project, index) => {
            const coverClass = coverClasses[index % coverClasses.length]
            return (
              <article
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="project-card"
                title="Click to view complete case study"
              >
                <div className={`project-cover ${coverClass}`}>
                  <span className="cover-num">0{index + 1}</span>
                  <span className="cover-flower" aria-hidden="true">
                    ✿
                  </span>
                </div>
                <div className="project-body">
                  <span className="project-meta">
                    {project.category} / {project.year}
                  </span>
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-desc">{project.description}</p>
                  <div className="tags">
                    {project.tags.slice(0, 3).map((tag, i) => (
                      <span key={i}>{tag}</span>
                    ))}
                  </div>
                  <span className="card-link mt-1">View Case Study →</span>
                </div>
              </article>
            )
          })}
        </div>
      </div>

      {/* Full-Screen Case Study Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  )
}
