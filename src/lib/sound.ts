/* Tiny WebAudio synth — no audio files, never autoplays.
   Everything only sounds after she taps something (and only if sound is on). */

let ctx: AudioContext | null = null
let enabled = false

export function setSoundEnabled(v: boolean) { enabled = v; if (v) ensureCtx() }
export function isSoundEnabled() { return enabled }

function ensureCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  try {
    if (!ctx) ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    if (ctx.state === 'suspended') void ctx.resume()
    return ctx
  } catch { return null }
}

function tone(freq: number, dur = 0.12, type: OscillatorType = 'sine', gain = 0.05, when = 0, slideTo?: number) {
  if (!enabled) return
  const ac = ensureCtx(); if (!ac) return
  const t = ac.currentTime + when
  const osc = ac.createOscillator(); const g = ac.createGain()
  osc.type = type; osc.frequency.setValueAtTime(freq, t)
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + dur)
  g.gain.setValueAtTime(0, t)
  g.gain.linearRampToValueAtTime(gain, t + 0.015)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  osc.connect(g).connect(ac.destination)
  osc.start(t); osc.stop(t + dur + 0.05)
}

/** soft keyboard-ish blip for the boot typewriter */
export const sfxType = () => tone(620 + Math.random() * 240, 0.05, 'triangle', 0.018)
/** sparkle for clicks / discoveries */
export const sfxSparkle = () => { tone(880, 0.18, 'sine', 0.05); tone(1318, 0.24, 'sine', 0.04, 0.07); tone(1760, 0.3, 'sine', 0.03, 0.14) }
/** gentle pop for buttons */
export const sfxPop = () => tone(520, 0.1, 'sine', 0.045, 0, 760)
/** warm little chord for hugs & the ending */
export const sfxWarm = () => { [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, 0.9, 'sine', 0.035, i * 0.09)) }
/** soft chime arpeggio for unlocks */
export const sfxUnlock = () => { [659.25, 783.99, 987.77, 1318.5].forEach((f, i) => tone(f, 0.5, 'triangle', 0.04, i * 0.11)) }
/** playful "nope" for a wrong quiz answer */
export const sfxNope = () => tone(300, 0.16, 'sine', 0.04, 0, 210)

/* ------------------------------------------------------------------ */
/*  Peaceful romantic background music — a gentle generative piano    */
/*  loop (Cmaj7 · Am7 · Fmaj7 · G), synthesized live. No audio files. */
/*  Only ever starts after a user gesture (browser autoplay rules).   */
/* ------------------------------------------------------------------ */

const CHORDS: number[][] = [
  [261.63, 329.63, 392.0, 493.88], // Cmaj7
  [220.0, 261.63, 329.63, 392.0], // Am7
  [174.61, 220.0, 261.63, 329.63], // Fmaj7
  [196.0, 246.94, 293.66, 392.0], // G(add)
]
const BAR_SECONDS = 8

let musicTimer: ReturnType<typeof setInterval> | null = null
let musicMaster: GainNode | null = null
let musicEcho: GainNode | null = null
let musicBar = 0
const liveOsc = new Set<OscillatorNode>()

function musicNote(freq: number, startIn: number, dur: number, peak: number, type: OscillatorType = 'sine') {
  const ac = ctx; if (!ac || !musicMaster) return
  const t = ac.currentTime + startIn
  const osc = ac.createOscillator(); const g = ac.createGain()
  osc.type = type; osc.frequency.value = freq
  g.gain.setValueAtTime(0, t)
  g.gain.linearRampToValueAtTime(peak, t + Math.min(0.6, dur * 0.3))
  g.gain.setValueAtTime(peak, t + dur * 0.55)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  osc.connect(g); g.connect(musicMaster)
  if (musicEcho) g.connect(musicEcho) // shared dreamy echo bus
  liveOsc.add(osc)
  osc.onended = () => liveOsc.delete(osc)
  osc.start(t); osc.stop(t + dur + 0.1)
}

function scheduleBar() {
  const ac = ctx; if (!ac || !musicMaster) return
  const chord = CHORDS[musicBar % CHORDS.length]
  musicBar++
  // warm pad — the whole chord, breathing in and out
  chord.forEach(f => {
    musicNote(f, 0, BAR_SECONDS + 1.2, 0.028, 'triangle')
    musicNote(f * 1.003, 0.15, BAR_SECONDS + 1, 0.018, 'sine')
  })
  // slow romantic arpeggio melody on top
  const melodyIdx = [3, 2, 1, 2, 3, 1]
  const times = [0.4, 1.7, 3.0, 4.4, 5.7, 6.9]
  melodyIdx.forEach((ci, i) => musicNote(chord[ci] * 2, times[i], 2.1, 0.055))
  // a tiny music-box sparkle at the end of every other bar
  if (musicBar % 2 === 0) musicNote(chord[0] * 4, 7.3, 1.4, 0.03)
}

export function startMusic() {
  if (musicTimer) return
  const ac = ensureCtx(); if (!ac) return
  musicMaster = ac.createGain()
  musicMaster.gain.setValueAtTime(0, ac.currentTime)
  musicMaster.gain.linearRampToValueAtTime(0.85, ac.currentTime + 2.5) // gentle fade-in
  musicMaster.connect(ac.destination)
  // one shared echo (delay + soft feedback) so notes bloom like a music box
  const delay = ac.createDelay(1); delay.delayTime.value = 0.42
  const fb = ac.createGain(); fb.gain.value = 0.3
  const damp = ac.createBiquadFilter(); damp.type = 'lowpass'; damp.frequency.value = 2200
  delay.connect(damp); damp.connect(fb); fb.connect(delay); delay.connect(musicMaster)
  musicEcho = ac.createGain(); musicEcho.gain.value = 0.35; musicEcho.connect(delay)
  musicBar = 0
  scheduleBar()
  musicTimer = setInterval(scheduleBar, BAR_SECONDS * 1000)
}

export function stopMusic() {
  if (musicTimer) { clearInterval(musicTimer); musicTimer = null }
  const ac = ctx
  if (ac && musicMaster) {
    const m = musicMaster
    m.gain.cancelScheduledValues(ac.currentTime)
    m.gain.setValueAtTime(m.gain.value, ac.currentTime)
    m.gain.linearRampToValueAtTime(0, ac.currentTime + 0.8)
    setTimeout(() => { try { m.disconnect() } catch { /* already gone */ } }, 900)
  }
  musicMaster = null
  musicEcho = null
  liveOsc.forEach(o => { try { o.stop() } catch { /* already stopped */ } })
  liveOsc.clear()
}

export const isMusicPlaying = () => musicTimer !== null
