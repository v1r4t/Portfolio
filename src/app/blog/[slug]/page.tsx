import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getAllPosts, getPost, getPostSlugs } from '@/lib/posts'
import { createPageMetadata } from '@/lib/metadata'
import { SmoothScroll } from '@/components/SmoothScroll'
import { BarcodeStrip, Marquee } from '@/components/art/Ornaments'

interface BlogPageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return {}
  return createPageMetadata({
    title: post.meta.title,
    description: post.meta.summary,
    path: `/blog/${slug}`,
    og: { sub: `${post.meta.date} ✦ ${post.meta.readTime}`, bg: '#1b3a8c', accent: '#ffd400' },
  })
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  const posts = getAllPosts()
  const index = posts.findIndex((p) => p.slug === slug)
  const next = posts[(index + 1) % posts.length]
  const { meta, content } = post

  return (
    <main className="detail-page">
      <SmoothScroll />
      <div className="detail-bar">
        <Link href="/#blogs" className="detail-back">
          ← Back to the road
        </Link>
        <span className="detail-mark">DISPATCH // {meta.date}</span>
      </div>

      <div className="blog-body">
        <div className="permit-header">
          <span>
            PERMIT <b>{meta.permitMeta.transitNo}</b>
          </span>
          <span>
            {meta.permitMeta.origin} ➔ {meta.permitMeta.destination}
          </span>
          <span>
            CHECKPOINT <b>{meta.permitMeta.checkpoint}</b>
          </span>
        </div>

        <h1 className="blog-heading">{meta.title}</h1>
        <p className="detail-sub" style={{ marginBottom: '2rem' }}>
          {meta.summary}
        </p>

        <Marquee text="ROUTE DISPATCH ✦ HORN OK PLEASE ✦ NH-44" />
        <BarcodeStrip className="blog-lead-barcode" />

        <div className="prose">
          <MDXRemote source={content} />
        </div>

        <div className="tag-row">
          {meta.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>

        {next && next.slug !== slug && (
          <Link className="detail-next" href={`/blog/${next.slug}`}>
            Next dispatch: {next.title} →
          </Link>
        )}
      </div>
    </main>
  )
}
