// Lightweight Web Audio API synthesizer for cafe POS alerts (no external MP3 required)

export function playOrderChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return
    const ctx = new AudioContext()

    // 2-tone gentle cafe bell (e.g. Ding-Dong)
    const playTone = (freq, start, duration) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start)
      
      gain.gain.setValueAtTime(0.001, ctx.currentTime + start)
      gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + start + 0.04)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(ctx.currentTime + start)
      osc.stop(ctx.currentTime + start + duration)
    }

    playTone(587.33, 0.0, 0.4) // D5
    playTone(880.00, 0.15, 0.6) // A5
  } catch {
    // Ignore audio autoplay restrictions gracefully
  }
}

export function playReadyChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return
    const ctx = new AudioContext()

    const playTone = (freq, start, duration) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start)
      
      gain.gain.setValueAtTime(0.001, ctx.currentTime + start)
      gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + start + 0.03)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(ctx.currentTime + start)
      osc.stop(ctx.currentTime + start + duration)
    }

    playTone(523.25, 0.0, 0.25) // C5
    playTone(659.25, 0.12, 0.25) // E5
    playTone(783.99, 0.24, 0.45) // G5
  } catch {
    // Ignore audio autoplay restrictions gracefully
  }
}
