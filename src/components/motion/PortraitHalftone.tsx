'use client'

import { useEffect, useRef } from 'react'
import { paintPortraitHalftone } from '../../utils/portraitHalftone'

interface PortraitHalftoneProps {
  src: string
  alt: string
  imageClassName: string
  canvasClassName: string
}

/**
 * CPU halftone portrait plate. The image stays visible underneath a canvas of
 * ink dots, so the portrait works without a GPU shader.
 */
export function PortraitHalftone({
  src,
  alt,
  imageClassName,
  canvasClassName,
}: PortraitHalftoneProps) {
  const imgRef = useRef<HTMLImageElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const img = imgRef.current
    const canvas = canvasRef.current
    if (!img || !canvas) return

    let disposed = false
    void img
      .decode()
      .then(() => {
        if (!disposed) paintPortraitHalftone(img, canvas)
      })
      .catch(() => {
        /* leave the image visible without the dot layer */
      })

    return () => {
      disposed = true
    }
  }, [src])

  return (
    <>
      <img ref={imgRef} className={imageClassName} src={src} alt={alt} draggable={false} />
      <canvas
        ref={canvasRef}
        className={canvasClassName}
        aria-hidden="true"
        data-backend="cpu"
        style={{ pointerEvents: 'none' }}
      />
    </>
  )
}
