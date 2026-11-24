import React, { useState } from 'react'
import { BLOGS } from '../data/portfolioData'
import { BlogPost } from '../types'
import { BlogModal } from './BlogModal'
import { PanelDecoration } from './PanelDecoration'

export const BlogsSection: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)

  return (
    <section className="panel blogs" id="blogs" aria-labelledby="blogs-title">
      <PanelDecoration panel="blogs" />

      <div className="panel-inner">
        <header className="page-head">
          <span className="page-kicker">03 / Blogs</span>
          <h2 className="page-title" id="blogs-title">
            Blogs
          </h2>
        </header>

        <div className="blog-list">
          {BLOGS.map((post, index) => {
            return (
              <article
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="blog-card"
                title="Click to open field dispatch"
              >
                <span className="blog-num">0{index + 1}</span>
                <div>
                  <div className="s-mono text-[9px] text-[var(--t-blue)] font-bold tracking-wider mb-0.5">
                    PERMIT: {post.permitMeta.transitNo} // {post.permitMeta.origin} ➔ {post.permitMeta.destination}
                  </div>
                  <h3 className="blog-title">{post.title}</h3>
                  <p className="blog-summary">{post.summary}</p>
                </div>
                <span className="blog-date">{post.date}</span>
                <span className="card-link">Read →</span>
              </article>
            )
          })}
        </div>

        <div className="blog-foot">
          <span
            className="all-link"
            onClick={() => setSelectedPost(BLOGS[0])}
          >
            All field notes →
          </span>
        </div>
      </div>

      {/* Full-Screen Blog Dispatch Reader Modal */}
      <BlogModal post={selectedPost} onClose={() => setSelectedPost(null)} />
    </section>
  )
}
