/**
 * Web Audio API synthesizer for the iconic Indian Truck Horn
 * Synthesizes vintage brass bulb horn & melodic dual-tone air-horns.
 * Also exposes a live analyser so the page can react to the horn's waveform.
 */

class HornAudioEngine {
  private ctx: AudioContext | null = null
  private analyser: AnalyserNode | null = null
  private waveform: Float32Array<ArrayBuffer> | null = null

  private getContext(): AudioContext {
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
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
    return this.ctx
  }

  /** Classic two-tone brass bulb horn "Poon-Poon!" */
  public playHorn(type: 'brass' | 'melody' = 'brass') {
    try {
      const ctx = this.getContext()
      const now = ctx.currentTime

      if (type === 'brass') {
        this.playTonePair(ctx, now, 420, 560, 0.28)
        this.playTonePair(ctx, now + 0.32, 420, 560, 0.42)
      } else {
        // Melodic Highway Pass Horn ("Ta-Ta-Taaaa!")
        this.playTonePair(ctx, now, 392, 523, 0.18)
        this.playTonePair(ctx, now + 0.22, 440, 587, 0.18)
        this.playTonePair(ctx, now + 0.44, 523, 659, 0.48)
      }

      window.dispatchEvent(new CustomEvent('horn-play', { detail: { type } }))
    } catch (e) {
      console.warn('AudioContext unavailable or blocked', e)
    }
  }

  /** Normalized 0..1 RMS of the last analyser frame. */
  public getLevel(): number {
    if (!this.analyser || !this.waveform) return 0
    this.analyser.getFloatTimeDomainData(this.waveform)
    let sum = 0
    for (let i = 0; i < this.waveform.length; i++) {
      sum += this.waveform[i] * this.waveform[i]
    }
    return Math.min(1, Math.sqrt(sum / this.waveform.length) * 6)
  }

  private playTonePair(ctx: AudioContext, startTime: number, freq1: number, freq2: number, duration: number) {
    const osc1 = ctx.createOscillator()
    const osc2 = ctx.createOscillator()
    const gain = ctx.createGain()
    const filter = ctx.createBiquadFilter()

    osc1.type = 'sawtooth'
    osc2.type = 'triangle'

    osc1.frequency.setValueAtTime(freq1, startTime)
    osc2.frequency.setValueAtTime(freq2, startTime)

    osc1.frequency.exponentialRampToValueAtTime(freq1 * 1.04, startTime + 0.05)
    osc2.frequency.exponentialRampToValueAtTime(freq2 * 1.04, startTime + 0.05)
    osc1.frequency.exponentialRampToValueAtTime(freq1, startTime + duration)
    osc2.frequency.exponentialRampToValueAtTime(freq2, startTime + duration)

    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(800, startTime)
    filter.Q.setValueAtTime(2.2, startTime)

    gain.gain.setValueAtTime(0.0001, startTime)
    gain.gain.exponentialRampToValueAtTime(0.35, startTime + 0.04)
    gain.gain.exponentialRampToValueAtTime(0.28, startTime + duration * 0.7)
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration)

    osc1.connect(filter)
    osc2.connect(filter)
    filter.connect(gain)
    gain.connect(this.analyser ?? ctx.destination)

    osc1.start(startTime)
    osc2.start(startTime)
    osc1.stop(startTime + duration + 0.05)
    osc2.stop(startTime + duration + 0.05)
  }
}

export const hornAudio = new HornAudioEngine()
