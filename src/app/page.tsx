import { Journey } from '@/components/journey/Journey'
import { NAV_STOPS, PROJECTS } from '@/data/portfolio'
import { getAllPosts } from '@/lib/posts'

export default function Home() {
  const posts = getAllPosts()
  return <Journey stops={NAV_STOPS} projects={PROJECTS} posts={posts} />
}
