import React from 'react'

/* ——— Parichchit frame: scalloped edge, dot runs, ink rails ——— */
export const ParichchitFrame = () => (
  <div className="ornament-frame" aria-hidden="true">
    <span className="corner-orn tl" />
    <span className="corner-orn tr" />
    <span className="corner-orn bl" />
    <span className="corner-orn br" />
  </div>
)

/* ——— Corner cluster: lotus + paisley + marigold rosette ——— */
export const CornerCluster: React.FC<{ corner: 'tl' | 'tr' | 'bl' | 'br' }> = ({ corner }) => (
  <svg
    className={`corner-cluster corner-${corner}`}
    viewBox="0 0 220 220"
    aria-hidden="true"
    focusable="false"
  >
    <use href="#m-lotus" x="8" y="8" width="110" height="110" />
    <use href="#m-paisley" x="98" y="18" width="86" height="104" transform="rotate(24 141 70)" />
    <use href="#m-marigold" x="120" y="120" width="72" height="72" />
    <circle cx="26" cy="196" r="7" fill="#ffd400" stroke="#0a0a0a" strokeWidth="2.4" />
    <circle cx="58" cy="204" r="5" fill="#00b3b0" stroke="#0a0a0a" strokeWidth="2.2" />
    <circle cx="196" cy="96" r="6" fill="#e2231a" stroke="#0a0a0a" strokeWidth="2.2" />
    <path d="M16 150 Q60 128 96 150" fill="none" stroke="#0a0a0a" strokeWidth="2.2" strokeDasharray="2 6" />
  </svg>
)

/* ——— Chevron band: painted zigzag rail ——— */
export const ChevronBand: React.FC<{ flip?: boolean; className?: string }> = ({ flip, className }) => {
  const N = 40
  const step = 1200 / N
  let d = `M0 34`
  for (let i = 0; i < N; i++) {
    d += ` L${(i * step + step / 2).toFixed(1)} 8 L${((i + 1) * step).toFixed(1)} 34`
  }
  return (
    <svg
      className={`chevron-band ${flip ? 'is-flip' : ''} ${className ?? ''}`}
      viewBox="0 0 1200 42"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d={d} fill="none" stroke="#0a0a0a" strokeWidth="7" vectorEffect="non-scaling-stroke" />
      <path d={d} fill="none" stroke="#ffd400" strokeWidth="3" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

/* ——— Bulb chain: festival lights strung along a rail ——— */
export const BulbChain: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`bulb-chain ${className ?? ''}`} aria-hidden="true">
    <span className="bulb-wire" />
    <span className="bulb-strip" />
  </div>
)

/* ——— Hazard tape: vermilion/ink chevrons ——— */
export const HazardTape: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`hazard-tape ${className ?? ''}`} aria-hidden="true" />
)

/* ——— Permit stamp: dashed rosette plate with mono label ——— */
export const PermitStamp: React.FC<{ label: string; sub?: string; className?: string }> = ({
  label,
  sub,
  className,
}) => (
  <svg
    className={`permit-stamp ${className ?? ''}`}
    viewBox="0 0 200 200"
    aria-hidden="true"
    focusable="false"
  >
    <circle cx="100" cy="100" r="86" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="7 7" />
    <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="1.6" />
    <use href="#m-star" x="82" y="46" width="36" height="36" />
    <text
      x="100"
      y="118"
      textAnchor="middle"
      fontSize="15"
      fontWeight="700"
      letterSpacing="2"
      fill="currentColor"
      style={{ fontFamily: 'var(--font-mono)' }}
    >
      {label}
    </text>
    {sub && (
      <text
        x="100"
        y="138"
        textAnchor="middle"
        fontSize="10"
        letterSpacing="1.5"
        fill="currentColor"
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        {sub}
      </text>
    )}
  </svg>
)

/* ——— Barcode strip: painted route barcode ——— */
export const BarcodeStrip: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`barcode-strip ${className ?? ''}`} aria-hidden="true" />
)

/* ——— Marquee ticker: route announcements running the panel edge ——— */
export const Marquee: React.FC<{ text: string; className?: string }> = ({ text, className }) => {
  const row = Array.from({ length: 6 }, (_, i) => (
    <span key={i} className="marquee-item">
      {text}
      <i aria-hidden="true">✦</i>
    </span>
  ))
  return (
    <div className={`marquee ${className ?? ''}`} aria-hidden="true">
      <div className="marquee-track">
        <div className="marquee-group">{row}</div>
        <div className="marquee-group">{row}</div>
      </div>
    </div>
  )
}
