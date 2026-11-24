import React, { useEffect } from 'react'
import { BlogPost } from '../types'
import { X, Clock, FileText, MapPin } from 'lucide-react'

interface BlogModalProps {
  post: BlogPost | null
  onClose: () => void
}

export const BlogModal: React.FC<BlogModalProps> = ({ post, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (post) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [post, onClose])

  if (!post) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 select-text"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[var(--t-paper)] border-4 border-[var(--t-ink)] shadow-[12px_12px_0_var(--t-ink)] text-[var(--t-ink)] p-6 md:p-10 font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Perforated Top Header Receipt Notch */}
        <div className="flex justify-between items-center pb-3 border-b-2 border-dashed border-stone-400 mb-6 text-xs s-mono text-stone-600">
          <span className="flex items-center gap-1 font-bold">
            <FileText size={14} /> {post.permitMeta.transitNo}
          </span>
          <span className="flex items-center gap-1 font-bold">
            <Clock size={14} /> {post.readTime}
          </span>
          <button
            onClick={onClose}
            aria-label="Close article"
            className="p-1 bg-[var(--t-yellow)] border border-[var(--t-ink)] hover:bg-[var(--t-pink)] hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Route Stamp */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-100 border border-[var(--t-ink)] mb-4 text-xs s-mono">
          <MapPin size={13} className="text-[var(--t-red)]" />
          <span>ROUTE: {post.permitMeta.origin} ➔ {post.permitMeta.destination}</span>
        </div>

        {/* Article Title */}
        <h1 className="s-poster text-3xl md:text-5xl text-[var(--t-ink)] leading-tight mb-4">
          {post.title}
        </h1>

        {/* Publish Date and Checkpoint */}
        <div className="flex items-center gap-4 text-xs s-mono text-stone-500 mb-8 border-b-2 border-[var(--t-ink)] pb-4">
          <span>LOGGED: {post.date}</span>
          <span>CHECKPOINT: {post.permitMeta.checkpoint}</span>
        </div>

        {/* Full Essay Content */}
        <div className="space-y-5 text-stone-900 s-body text-base md:text-lg leading-relaxed">
          {post.content.map((paragraph, idx) => (
            <p key={idx} className={idx === 0 ? 'font-medium text-lg md:text-xl text-black' : ''}>
              {paragraph}
            </p>
          ))}
        </div>

        {/* Tags */}
        <div className="mt-8 pt-4 border-t-2 border-dashed border-stone-400 flex flex-wrap gap-2">
          {post.tags.map((tag, idx) => (
            <span
              key={idx}
              className="s-mono text-xs px-2.5 py-1 bg-stone-200 border border-[var(--t-ink)] font-semibold"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Close Button Footer */}
        <div className="mt-8 pt-4 border-t-3 border-[var(--t-ink)] flex items-center justify-between">
          <span className="s-mono text-xs text-stone-500">
            DISPATCH ARCHIVE // DHRUVA VURA
          </span>
          <button
            onClick={onClose}
            className="s-poster text-base bg-[var(--t-yellow)] px-4 py-1.5 border-2 border-[var(--t-ink)] shadow-[2px_2px_0_var(--t-ink)] hover:bg-[var(--t-ink)] hover:text-[var(--t-yellow)] transition-colors cursor-pointer"
          >
            CLOSE DISPATCH
          </button>
        </div>
      </div>
    </div>
  )
}
