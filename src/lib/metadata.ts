import type { Metadata } from 'next'
import { SITE_URL } from './site'

export function ogImageUrl(params: { title: string; sub?: string; bg?: string; accent?: string }) {
  const search = new URLSearchParams({ title: params.title })
  if (params.sub) search.set('sub', params.sub)
  if (params.bg) search.set('bg', params.bg)
  if (params.accent) search.set('accent', params.accent)
  return `/og?${search.toString()}`
}

export function createPageMetadata(params: {
  title: string
  description: string
  path: string
  og?: { sub?: string; bg?: string; accent?: string }
}): Metadata {
  const url = `${SITE_URL.replace(/\/$/, '')}${params.path}`
  const image = ogImageUrl({ title: params.title, sub: params.og?.sub, bg: params.og?.bg, accent: params.og?.accent })

  return {
    title: params.title,
    description: params.description,
    alternates: { canonical: url },
    openGraph: {
      title: params.title,
      description: params.description,
      url,
      images: [{ url: image, width: 1200, height: 630, alt: params.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: params.title,
      description: params.description,
      images: [image],
    },
  }
}
