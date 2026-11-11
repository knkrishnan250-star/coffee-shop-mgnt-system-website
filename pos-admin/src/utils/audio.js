export function playOrderChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    const playTone = (freq, start, duration) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start)
      gain.gain.setValueAtTime(0.001, ctx.currentTime + start)
      gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + start + 0.04)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(ctx.currentTime + start)
      osc.stop(ctx.currentTime + start + duration)
    }
    playTone(587.33, 0.0, 0.35)
    playTone(880.00, 0.12, 0.5)
  } catch {
    // Autoplay policy fallback
  }
}

export function playReadyChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    const playTone = (freq, start, duration) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start)
      gain.gain.setValueAtTime(0.001, ctx.currentTime + start)
      gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + start + 0.03)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(ctx.currentTime + start)
      osc.stop(ctx.currentTime + start + duration)
    }
    playTone(523.25, 0.0, 0.2)
    playTone(659.25, 0.1, 0.2)
    playTone(783.99, 0.2, 0.35)
  } catch {
    // Autoplay policy fallback
  }
}
