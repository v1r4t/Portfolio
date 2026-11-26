'use client'

import React from 'react'
import Link from 'next/link'
import type { PostMeta } from '../../../types'
import { PanelArt } from '../../art/PanelArt'
import { BarcodeStrip, Marquee } from '../../art/Ornaments'

export const BlogsPanel: React.FC<{ posts: PostMeta[] }> = React.memo(function BlogsPanel({ posts }) {
  return (
    <section className="panel blogs" id="blogs" aria-labelledby="blogs-title">
      <PanelArt variant="blogs" />

      <div className="panel-inner" data-lenis-prevent-vertical>
        <header className="page-head">
          <span className="page-kicker">03 / Blogs</span>
          <h2 className="page-title" id="blogs-title" data-reveal>
            Blogs
          </h2>
        </header>

        <Marquee text="ROUTE DISPATCHES ✦ NH-44 ✦ HORN OK PLEASE ✦ FIELD NOTES" className="marquee-blogs" />

        <div className="blog-list">
          {posts.map((post, index) => {
            const inProgress = post.status === 'in-progress'
            const content = (
              <>
                <span className="blog-num">0{index + 1}</span>
                <div>
                  <div className="blog-permit">
                    PERMIT: {post.permitMeta.transitNo} // {post.permitMeta.origin} ➔{' '}
                    {post.permitMeta.destination}
                  </div>
                  <h3 className="blog-title">{post.title}</h3>
                  <p className="blog-summary">{post.summary}</p>
                </div>
                <span className="blog-date">{post.date}</span>
                {inProgress ? (
                  <span className="blog-status">In Progress</span>
                ) : (
                  <span className="card-link">Read →</span>
                )}
                <BarcodeStrip className="blog-barcode" />
              </>
            )

            return inProgress ? (
              <div
                key={post.slug}
                className="blog-card is-progress"
                title="Dispatch in progress"
              >
                {content}
              </div>
            ) : (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="blog-card"
                title="Open field dispatch"
              >
                {content}
              </Link>
            )
          })}
        </div>

        <div className="blog-foot">
          {posts[0] && (
            <Link className="all-link" href={`/blog/${posts[0].slug}`}>
              Latest dispatch →
            </Link>
          )}
        </div>
      </div>
    </section>
  )
})


