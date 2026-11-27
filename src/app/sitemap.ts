import type { MetadataRoute } from 'next'
import { PROJECTS } from '@/data/portfolio'
import { getAllPosts } from '@/lib/posts'
import { SITE_URL } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_URL.replace(/\/$/, '')
  const posts = getAllPosts().filter((post) => post.status === 'published')
  const now = new Date()

  return [
    { url: base, lastModified: now, changeFrequency: 'monthly', priority: 1 },
    ...PROJECTS.map((project) => ({
      url: `${base}/projects/${project.slug}`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.8,
    })),
    ...posts.map((post) => ({
      url: `${base}/blog/${post.slug}`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
  ]
}
