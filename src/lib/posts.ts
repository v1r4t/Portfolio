import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import type { PostMeta } from '../types'

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog')
const REQUIRED = ['title', 'date', 'readTime', 'summary', 'tags', 'order', 'permitMeta'] as const

export type { PostMeta }

function parsePostFile(filename: string): { meta: PostMeta; content: string } {
  const raw = fs.readFileSync(path.join(BLOG_DIR, filename), 'utf8')
  const { data, content } = matter(raw)
  const slug = filename.replace(/\.mdx$/, '')

  const missing = REQUIRED.filter((key) => data[key] === undefined)
  if (missing.length > 0) {
    throw new Error(`Blog post "${filename}" is missing frontmatter: ${missing.join(', ')}`)
  }
  const permits = data.permitMeta as Record<string, string> | undefined
  const permitKeys = ['transitNo', 'origin', 'destination', 'checkpoint']
  const missingPermits = permitKeys.filter((key) => !permits?.[key])
  if (missingPermits.length > 0) {
    throw new Error(`Blog post "${filename}" has incomplete permitMeta: ${missingPermits.join(', ')}`)
  }

  return {
    meta: {
      slug,
      title: String(data.title),
      date: String(data.date),
      readTime: String(data.readTime),
      summary: String(data.summary),
      tags: (data.tags as string[]) ?? [],
      order: Number(data.order),
      permitMeta: {
        transitNo: String(permits!.transitNo),
        origin: String(permits!.origin),
        destination: String(permits!.destination),
        checkpoint: String(permits!.checkpoint),
      },
    },
    content,
  }
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return []
  return fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => parsePostFile(file).meta)
    .sort((a, b) => a.order - b.order)
}

export function getPostSlugs(): string[] {
  return getAllPosts().map((post) => post.slug)
}

export function getPost(slug: string) {
  const file = `${slug}.mdx`
  if (!fs.existsSync(path.join(BLOG_DIR, file))) return null
  return parsePostFile(file)
}
