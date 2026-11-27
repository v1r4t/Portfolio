import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { compile, run } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const blogDir = path.join(root, 'content', 'blog')
const outFile = path.join(root, 'src', 'data', 'posts.generated.json')
const REQUIRED = ['title', 'date', 'readTime', 'summary', 'tags', 'order', 'permitMeta']

if (!fs.existsSync(blogDir)) {
  throw new Error(`Blog content directory missing: ${blogDir}`)
}

async function renderMdx(source) {
  const compiled = await compile(source, { outputFormat: 'function-body' })
  const { default: MDXContent } = await run(compiled, { ...runtime, baseUrl: import.meta.url })
  return renderToStaticMarkup(React.createElement(MDXContent))
}

const posts = (
  await Promise.all(
    fs
      .readdirSync(blogDir)
      .filter((file) => file.endsWith('.mdx'))
      .map(async (filename) => {
        const raw = fs.readFileSync(path.join(blogDir, filename), 'utf8')
        const { data, content } = matter(raw)
        const slug = filename.replace(/\.mdx$/, '')

        const missing = REQUIRED.filter((key) => data[key] === undefined)
        if (missing.length > 0) {
          throw new Error(`Blog post "${filename}" is missing frontmatter: ${missing.join(', ')}`)
        }

        const permits = data.permitMeta
        const permitKeys = ['transitNo', 'origin', 'destination', 'checkpoint']
        const missingPermits = permitKeys.filter((key) => !permits?.[key])
        if (missingPermits.length > 0) {
          throw new Error(
            `Blog post "${filename}" has incomplete permitMeta: ${missingPermits.join(', ')}`,
          )
        }

        const order = Number(data.order)
        if (!Number.isFinite(order)) {
          throw new Error(`Blog post "${filename}" has a non-numeric order: ${String(data.order)}`)
        }

        const status = data.status === 'in-progress' ? 'in-progress' : 'published'
        const gallery = Array.isArray(data.gallery)
          ? data.gallery.map((photo) => ({
              src: String(photo.src),
              alt: String(photo.alt ?? photo.caption ?? ''),
              caption: String(photo.caption ?? ''),
              width: Number(photo.width) || 1200,
              height: Number(photo.height) || 900,
            }))
          : undefined

        return {
          meta: {
            slug,
            title: String(data.title),
            date: String(data.date),
            readTime: String(data.readTime),
            summary: String(data.summary),
            tags: data.tags ?? [],
            order,
            status,
            gallery,
            permitMeta: {
              transitNo: String(permits.transitNo),
              origin: String(permits.origin),
              destination: String(permits.destination),
              checkpoint: String(permits.checkpoint),
            },
          },
          html: await renderMdx(content),
        }
      }),
  )
).sort((a, b) => a.meta.order - b.meta.order)

fs.mkdirSync(path.dirname(outFile), { recursive: true })
fs.writeFileSync(outFile, `${JSON.stringify({ posts }, null, 2)}\n`)
console.log(`Generated ${path.relative(root, outFile)} from ${posts.length} posts`)

