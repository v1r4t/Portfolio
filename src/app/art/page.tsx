import type { Metadata } from 'next'
import { PanelArt } from '@/components/art/PanelArt'
import {
  BulbChain,
  ChevronBand,
  CornerCluster,
  HazardTape,
  Marquee,
  ParichchitFrame,
  PermitStamp,
} from '@/components/art/Ornaments'

export const metadata: Metadata = {
  title: 'Motif Gallery',
  robots: { index: false, follow: false },
}

const MOTIFS = [
  ['m-lotus', 'Lotus'],
  ['m-marigold', 'Marigold'],
  ['m-paisley', 'Paisley'],
  ['m-peacock', 'Peacock'],
  ['m-elephant', 'Elephant'],
  ['m-parrot', 'Parrot'],
  ['m-flower', 'Flower'],
  ['m-jhumka', 'Jhumka'],
  ['m-reel', 'Reel'],
  ['m-cassette', 'Cassette'],
  ['m-auto', 'Auto'],
  ['m-diya', 'Diya'],
  ['m-kalash', 'Kalash'],
  ['m-chilli', 'Nimbu-Mirchi'],
  ['m-bulb', 'Bulb'],
  ['m-star', 'Star'],
  ['m-chakra', 'Chakra'],
  ['m-kite', 'Kite'],
] as const

const VARIANTS = ['poster', 'about', 'blogs', 'projects', 'contact'] as const

export default function ArtPage() {
  return (
    <main className="art-gallery">
      <h1 className="art-title">Motif Paint Shop</h1>

      <section>
        <h2>Symbols</h2>
        <div className="motif-grid">
          {MOTIFS.map(([id, label]) => (
            <figure key={id} className="motif-tile">
              <svg viewBox="0 0 100 100" aria-hidden="true">
                <use href={`#${id}`} x="4" y="4" width="92" height="92" />
              </svg>
              <figcaption>{label}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section>
        <h2>Ornaments</h2>
        <div className="ornament-stage">
          <CornerCluster corner="tl" />
          <PermitStamp label="PERMIT" sub="NH-44" />
          <BulbChain />
          <HazardTape />
          <ChevronBand />
          <Marquee text="HORN OK PLEASE" />
          <ParichchitFrame />
        </div>
      </section>

      <section>
        <h2>Panel compositions</h2>
        {VARIANTS.map((variant) => (
          <div key={variant} className="variant-stage">
            <h3>{variant}</h3>
            <div className="variant-panel">
              <PanelArt variant={variant} />
              <div className="variant-label">Content layer sits above the paint.</div>
            </div>
          </div>
        ))}
      </section>
    </main>
  )
}
