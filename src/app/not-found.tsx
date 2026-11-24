import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="notfound">
      <h1 className="notfound-title">BREAKDOWN</h1>
      <p>Wrong turn on the highway. This stop does not exist.</p>
      <Link href="/">Back to the road →</Link>
    </main>
  )
}
