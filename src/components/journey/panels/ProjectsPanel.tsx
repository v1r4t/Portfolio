'use client'

import React from 'react'
import Link from 'next/link'
import type { Project } from '../../../types'
import { PanelArt } from '../../art/PanelArt'
import { Marquee } from '../../art/Ornaments'

const COVER_SYMBOLS: Record<Project['coverPattern'], string> = {
  lotus: 'm-lotus',
  peacock: 'm-peacock',
  elephant: 'm-elephant',
  hazard: 'm-star',
}

export const ProjectsPanel: React.FC<{ projects: Project[] }> = React.memo(function ProjectsPanel({ projects }) {
  const coverClasses = ['cover-a', 'cover-b', 'cover-c']

  return (
    <section className="panel projects" id="projects" aria-labelledby="projects-title">
      <PanelArt variant="projects" />

      <div className="panel-inner">
        <header className="page-head">
          <span className="page-kicker">04 / Projects</span>
          <h2 className="page-title" id="projects-title" data-reveal>
            Projects
          </h2>
        </header>

        <Marquee text="SELECTED WORKS ✦ KHAANA EXPRESS ✦ AEROSIGN ✦ CRAFTS PAVILION" className="marquee-projects" />

        <div className="project-grid">
          {projects.map((project, index) => {
            const coverClass = coverClasses[index % coverClasses.length]
            return (
              <Link key={project.slug} href={`/projects/${project.slug}`} className="project-card" title="View complete case study">
                <div className={`project-cover ${coverClass}`}>
                  <span className="cover-num">0{index + 1}</span>
                  <svg className="cover-motif" viewBox="0 0 120 120" aria-hidden="true" focusable="false">
                    <use href={`#${COVER_SYMBOLS[project.coverPattern]}`} x="4" y="4" width="112" height="112" />
                  </svg>
                </div>
                <div className="project-body">
                  <span className="project-meta">
                    {project.category} / {project.year}
                  </span>
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-desc">{project.description}</p>
                  <div className="tags">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  <span className="card-link mt-1">View Case Study →</span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
})
