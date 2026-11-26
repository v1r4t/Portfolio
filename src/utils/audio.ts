/**
 * Web Audio player for the recorded Indian bus horn.
 * The MP3 runs through the analyser so the bulbs, portrait, and ground shader
 * still react to the live waveform.
 */

const HORN_SRC = '/indian-bus-horn.mp3'

class HornAudioEngine {
  private ctx: AudioContext | null = null
  private analyser: AnalyserNode | null = null
  private waveform: Float32Array<ArrayBuffer> | null = null
  private buffer: AudioBuffer | null = null
  private loadPromise: Promise<AudioBuffer> | null = null
  private activeSource: AudioBufferSourceNode | null = null

  private getContext(): AudioContext {
    const ctx = this.ensureContext()
    if (ctx.state === 'suspended') {
      void ctx.resume()
    }
    return ctx
  }

  private ensureContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      this.ctx = new AudioCtx()
    }
    if (!this.analyser) {
      this.analyser = this.ctx.createAnalyser()
      this.analyser.fftSize = 256
      this.analyser.smoothingTimeConstant = 0.7
      this.analyser.connect(this.ctx.destination)
      this.waveform = new Float32Array(this.analyser.fftSize)
    }
    return this.ctx
  }

  /** Fetch and decode the horn before the first click so playback is immediate. */
  public async preload(): Promise<void> {
    try {
      await this.ensureBuffer(this.ensureContext())
    } catch {
      /* playHorn retries on demand */
    }
  }

  /** Resume the audio clock on an early user gesture, before the horn click. */
  public warm(): void {
    try {
      const ctx = this.ensureContext()
      if (ctx.state === 'suspended') void ctx.resume()
    } catch {
      /* playHorn retries on demand */
    }
  }

  private async ensureBuffer(ctx: AudioContext): Promise<AudioBuffer> {
    if (this.buffer) return this.buffer
    if (!this.loadPromise) {
      this.loadPromise = fetch(HORN_SRC)
        .then((response) => {
          if (!response.ok) throw new Error(`Horn audio failed: ${response.status}`)
          return response.arrayBuffer()
        })
        .then((data) => ctx.decodeAudioData(data))
        .then((decoded) => {
          this.buffer = decoded
          return decoded
        })
        .catch((error) => {
          this.loadPromise = null
          throw error
        })
    }
    return this.loadPromise
  }

  /** Plays the recorded bus horn. Both buttons use the same authentic sound. */
  public playHorn(type: 'brass' | 'melody' = 'brass') {
    try {
      const ctx = this.getContext()
      // Start the visual reaction immediately; the file may decode a beat later.
      window.dispatchEvent(new CustomEvent('horn-play', { detail: { type } }))
      void this.playFile(ctx)
    } catch (error) {
      console.warn('AudioContext unavailable or blocked', error)
    }
  }

  private async playFile(ctx: AudioContext) {
    try {
      const buffer = await this.ensureBuffer(ctx)

      if (this.activeSource) {
        try {
          this.activeSource.stop()
        } catch {
          /* already ended */
        }
        this.activeSource = null
      }

      const source = ctx.createBufferSource()
      const gain = ctx.createGain()
      source.buffer = buffer
      gain.gain.value = 0.9
      source.connect(gain)
      gain.connect(this.analyser ?? ctx.destination)

      source.onended = () => {
        source.disconnect()
        gain.disconnect()
        if (this.activeSource === source) this.activeSource = null
      }

      this.activeSource = source
      source.start()
    } catch (error) {
      console.warn('Horn audio unavailable', error)
    }
  }

  /** Normalized 0..1 RMS of the last analyser frame. */
  public getLevel(): number {
    if (!this.analyser || !this.waveform) return 0
    if (typeof this.analyser.getFloatTimeDomainData !== 'function') return 0
    this.analyser.getFloatTimeDomainData(this.waveform)
    let sum = 0
    for (let i = 0; i < this.waveform.length; i++) {
      sum += this.waveform[i] * this.waveform[i]
    }
    return Math.min(1, Math.sqrt(sum / this.waveform.length) * 6)
  }
}

export const hornAudio = new HornAudioEngine()
