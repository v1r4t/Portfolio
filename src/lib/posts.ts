import postsData from '../data/posts.generated.json'
import type { PostMeta } from '../types'

export type { PostMeta }

const POSTS = postsData.posts as { meta: PostMeta; html: string }[]

export function getAllPosts(): PostMeta[] {
  return POSTS.map((post) => post.meta)
}

export function getPostSlugs(): string[] {
  return getAllPosts()
    .filter((post) => post.status === 'published')
    .map((post) => post.slug)
}

export function getPost(slug: string) {
  if (!/^[a-z0-9-]+$/i.test(slug)) return null
  return POSTS.find((post) => post.meta.slug === slug) ?? null
}
