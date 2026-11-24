'use client'

import React from 'react'
import Link from 'next/link'
import type { PostMeta } from '../../../types'
import { PanelArt } from '../../art/PanelArt'
import { BarcodeStrip, Marquee } from '../../art/Ornaments'

export const BlogsPanel: React.FC<{ posts: PostMeta[] }> = ({ posts }) => {
  return (
    <section className="panel blogs" id="blogs" aria-labelledby="blogs-title">
      <PanelArt variant="blogs" />

      <div className="panel-inner">
        <header className="page-head">
          <span className="page-kicker">03 / Blogs</span>
          <h2 className="page-title" id="blogs-title" data-reveal>
            Blogs
          </h2>
        </header>

        <Marquee text="ROUTE DISPATCHES ✦ NH-44 ✦ HORN OK PLEASE ✦ FIELD NOTES" className="marquee-blogs" />

        <div className="blog-list">
          {posts.map((post, index) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="blog-card" title="Open field dispatch">
              <span className="blog-num">0{index + 1}</span>
              <div>
                <div className="blog-permit">
                  PERMIT: {post.permitMeta.transitNo} // {post.permitMeta.origin} ➔ {post.permitMeta.destination}
                </div>
                <h3 className="blog-title">{post.title}</h3>
                <p className="blog-summary">{post.summary}</p>
              </div>
              <span className="blog-date">{post.date}</span>
              <span className="card-link">Read →</span>
              <BarcodeStrip className="blog-barcode" />
            </Link>
          ))}
        </div>

        <div className="blog-foot">
          <Link className="all-link" href={`/blog/${posts[0]?.slug ?? ''}`}>
            Latest dispatch →
          </Link>
        </div>
      </div>
    </section>
  )
}
