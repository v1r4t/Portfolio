'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { init, type Gpu } from 'vgpu'

type GpuStatus = 'pending' | 'ready' | 'unavailable'

interface GpuContextValue {
  gpu: Gpu | null
  status: GpuStatus
}

const GpuContext = createContext<GpuContextValue>({ gpu: null, status: 'unavailable' })

export function useSharedGpu() {
  return useContext(GpuContext)
}

/**
 * Owns the one WebGPU device used by the journey. The ground and both
 * portraits create their own surfaces/effects against it; a lost device drops
 * every consumer back to its CSS fallback.
 */
export function GpuProvider({ children }: { children: React.ReactNode }) {
  const [value, setValue] = useState<GpuContextValue>({ gpu: null, status: 'pending' })

  useEffect(() => {
    let disposed = false
    let gpu: Gpu | null = null

    if (!('gpu' in navigator)) {
      setValue({ gpu: null, status: 'unavailable' })
      return
    }

    void (async () => {
      try {
        gpu = await init({ powerPreference: 'high-performance' })
        if (disposed) {
          gpu.dispose()
          return
        }
        setValue({ gpu, status: 'ready' })
        void gpu.lost.then(() => {
          if (disposed) return
          setValue({ gpu: null, status: 'unavailable' })
          gpu?.dispose()
        })
      } catch (error) {
        console.warn('WebGPU unavailable; using static fallbacks.', error)
        if (!disposed) setValue({ gpu: null, status: 'unavailable' })
      }
    })()

    return () => {
      disposed = true
      gpu?.dispose()
    }
  }, [])

  return <GpuContext.Provider value={value}>{children}</GpuContext.Provider>
}
