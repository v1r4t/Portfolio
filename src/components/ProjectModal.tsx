import React, { useEffect } from 'react'
import { Project } from '../types'
import { X, CheckCircle2, Award, Layers } from 'lucide-react'

interface ProjectModalProps {
  project: Project | null
  onClose: () => void
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (project) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [project, onClose])

  if (!project) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[var(--t-paper)] border-4 border-[var(--t-ink)] shadow-[12px_12px_0_var(--t-ink)] text-[var(--t-ink)] p-6 md:p-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Hazard Bar */}
        <div className="hazard-stripes-slim h-3 -mt-6 -mx-6 md:-mt-10 md:-mx-10 mb-6 border-b-3 border-[var(--t-ink)]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Case Study"
          className="absolute top-6 right-6 p-2 bg-[var(--t-yellow)] border-2 border-[var(--t-ink)] shadow-[2px_2px_0_var(--t-ink)] hover:bg-[var(--t-pink)] hover:text-white transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="s-mono text-xs px-2.5 py-1 bg-[var(--t-blue)] text-white border border-[var(--t-ink)] font-bold">
              {project.category}
            </span>
            <span className="s-mono text-xs px-2 py-0.5 bg-[var(--t-yellow)] border border-[var(--t-ink)] font-bold">
              YEAR {project.year}
            </span>
            <span className="s-mono text-xs text-stone-600 font-bold ml-auto mr-10">
              SPEC REF // {project.id.toUpperCase()}
            </span>
          </div>

          <h2 className="s-poster text-3xl md:text-5xl text-[var(--t-blue)] leading-tight">
            {project.title}
          </h2>
          <p className="s-mono text-sm text-stone-700 mt-1 font-semibold">
            {project.subtitle}
          </p>
        </div>

        {/* Quick Meta Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-stone-100 border-2 border-[var(--t-ink)] mb-6">
          <div>
            <span className="block s-mono text-[10px] text-stone-500 uppercase">Client / Partner</span>
            <span className="font-bold text-sm">{project.caseStudy.client}</span>
          </div>
          <div>
            <span className="block s-mono text-[10px] text-stone-500 uppercase">Timeline</span>
            <span className="font-bold text-sm">{project.caseStudy.timeline}</span>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <span className="block s-mono text-[10px] text-stone-500 uppercase">My Role</span>
            <span className="font-bold text-sm">{project.caseStudy.role}</span>
          </div>
        </div>

        {/* Case Study Body */}
        <div className="space-y-6 text-stone-900 s-body">
          <div>
            <h3 className="s-mono text-xs font-bold text-[var(--t-red)] tracking-widest uppercase mb-1 flex items-center gap-1.5">
              <Layers size={14} /> 01 // OVERVIEW
            </h3>
            <p className="leading-relaxed">{project.caseStudy.overview}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-amber-50 border-2 border-[var(--t-ink)]">
              <h3 className="s-mono text-xs font-bold text-[var(--t-ink)] tracking-widest uppercase mb-1">
                THE CHALLENGE
              </h3>
              <p className="text-sm leading-relaxed text-stone-800">
                {project.caseStudy.challenge}
              </p>
            </div>
            <div className="p-4 bg-emerald-50 border-2 border-[var(--t-ink)]">
              <h3 className="s-mono text-xs font-bold text-emerald-900 tracking-widest uppercase mb-1">
                ENGINEERED SOLUTION
              </h3>
              <p className="text-sm leading-relaxed text-stone-800">
                {project.caseStudy.solution}
              </p>
            </div>
          </div>

          {/* Key Metrics */}
          {project.caseStudy.metrics && (
            <div>
              <h3 className="s-mono text-xs font-bold text-[var(--t-blue)] tracking-widest uppercase mb-2 flex items-center gap-1.5">
                <Award size={14} /> IMPACT & PERFORMANCE
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {project.caseStudy.metrics.map((m, idx) => (
                  <div key={idx} className="p-3 bg-white border-2 border-[var(--t-ink)]">
                    <span className="block text-2xl md:text-3xl font-black text-[var(--t-red)] s-poster">
                      {m.value}
                    </span>
                    <span className="s-mono text-xs text-stone-600 uppercase font-bold">
                      {m.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Deliverables & Tooling */}
          <div className="pt-2 border-t-2 border-dashed border-stone-300">
            <h3 className="s-mono text-xs font-bold text-stone-600 tracking-widest uppercase mb-2">
              DELIVERED ASSETS
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-sm">
              {project.caseStudy.deliverables.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools Stencil Tags */}
          <div>
            <span className="s-mono text-[10px] text-stone-500 uppercase font-bold block mb-1">
              ENGINEERING & DESIGN TOOLKIT
            </span>
            <div className="flex flex-wrap gap-1.5">
              {project.caseStudy.toolsUsed.map((tool, idx) => (
                <span
                  key={idx}
                  className="s-mono text-xs px-2 py-0.5 bg-stone-200 border border-[var(--t-ink)] font-bold"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-8 pt-4 border-t-3 border-[var(--t-ink)] flex items-center justify-between">
          <span className="s-mono text-xs text-stone-500">
            PRESS ESC OR CLICK OUTSIDE TO RETURN
          </span>
          <button
            onClick={onClose}
            className="s-poster text-base bg-[var(--t-yellow)] px-4 py-1.5 border-2 border-[var(--t-ink)] shadow-[2px_2px_0_var(--t-ink)] hover:bg-[var(--t-ink)] hover:text-[var(--t-yellow)] transition-colors cursor-pointer"
          >
            DISMISS
          </button>
        </div>
      </div>
    </div>
  )
}
