import fs from 'node:fs'
import path from 'node:path'

if (process.platform !== 'win32') process.exit(0)

const file = path.join(
  process.cwd(),
  'node_modules',
  '@opennextjs',
  'aws',
  'dist',
  'build',
  'copyTracedFiles.js',
)

if (!fs.existsSync(file)) {
  console.warn('[opennext-windows-patch] @opennextjs/aws is not installed; skipping')
  process.exit(0)
}

const source = fs.readFileSync(file, 'utf8')
const unpatched = 'symlinkSync(symlink, to);'
const patched =
  'symlinkSync(symlink, to, process.platform === "win32" ? "junction" : undefined);'

if (source.includes(patched)) {
  console.log('[opennext-windows-patch] junction fallback already applied')
  process.exit(0)
}

if (!source.includes(unpatched)) {
  console.error('[opennext-windows-patch] expected symlink call was not found')
  process.exit(1)
}

fs.writeFileSync(file, source.replace(unpatched, patched))
console.log('[opennext-windows-patch] applied junction fallback')
