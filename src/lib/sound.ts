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
/*  Background music: "Lovely" (long version, via Chosic) — the real  */
/*  track Kulfi picked for Doll. Played from /lovely.mp3, looped,     */
/*  faded in/out softly. Only starts after a user gesture.            */
/* ------------------------------------------------------------------ */

let bgAudio: HTMLAudioElement | null = null
let fadeTimer: ReturnType<typeof setInterval> | null = null
const MUSIC_VOLUME = 0.45

function fadeTo(target: number, done?: () => void) {
  if (!bgAudio) return
  if (fadeTimer) clearInterval(fadeTimer)
  const step = (target - bgAudio.volume) / 24
  fadeTimer = setInterval(() => {
    if (!bgAudio) { if (fadeTimer) clearInterval(fadeTimer); return }
    const next = bgAudio.volume + step
    if ((step > 0 && next >= target) || (step < 0 && next <= target)) {
      bgAudio.volume = Math.max(0, Math.min(1, target))
      if (fadeTimer) clearInterval(fadeTimer)
      fadeTimer = null
      done?.()
    } else {
      bgAudio.volume = Math.max(0, Math.min(1, next))
    }
  }, 60)
}

export function startMusic() {
  if (typeof window === 'undefined') return
  if (!bgAudio) {
    bgAudio = new Audio(`${import.meta.env.BASE_URL}lovely.mp3`)
    bgAudio.loop = true
    bgAudio.preload = 'auto'
    bgAudio.volume = 0
  }
  if (!bgAudio.paused && bgAudio.volume >= MUSIC_VOLUME - 0.02) return
  const p = bgAudio.play()
  if (p) p.catch(() => { /* browser wants a gesture first — next tap will retry */ })
  fadeTo(MUSIC_VOLUME)
}

export function stopMusic() {
  if (!bgAudio) return
  fadeTo(0, () => { bgAudio?.pause() })
}

export const isMusicPlaying = () => !!bgAudio && !bgAudio.paused
