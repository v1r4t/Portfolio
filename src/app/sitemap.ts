import type { MetadataRoute } from 'next'
import { PROJECTS } from '@/data/portfolio'
import { getAllPosts } from '@/lib/posts'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_URL.replace(/\/$/, '')
  const posts = getAllPosts()

  return [
    { url: base, changeFrequency: 'monthly', priority: 1 },
    ...PROJECTS.map((project) => ({
      url: `${base}/projects/${project.slug}`,
      changeFrequency: 'yearly' as const,
      priority: 0.8,
    })),
    ...posts.map((post) => ({
      url: `${base}/blog/${post.slug}`,
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
  ]
}
