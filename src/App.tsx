import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Heart, Music, Volume2, VolumeX } from 'lucide-react'
import Starfield, { Nebula } from './components/Starfield'
import { Toast } from './components/ui'
import { BootScene, TitleScene } from './scenes/Boot'
import Home from './scenes/Home'
import { HugScene, LetterScene, PeacefulScene, SpecialScene } from './scenes/Comfort'
import Reasons from './scenes/Reasons'
import Memory from './scenes/Memory'
import Secret from './scenes/Secret'
import Ending from './scenes/Ending'
import { setSoundEnabled, startMusic, stopMusic } from './lib/sound'

export type Scene = 'boot' | 'title' | 'home' | 'hug' | 'letter' | 'special' | 'peaceful' | 'reasons' | 'memory' | 'secret' | 'ending'

type Progress = {
  booted: boolean
  visited: Scene[]
  reasons: number[]
  memoryUnlocked: boolean
  letterRead: boolean
  hugged: boolean
  sound: boolean
  music: boolean
}

const KEY = 'dollexe-progress-v1'
const DEFAULTS: Progress = { booted: false, visited: [], reasons: [], memoryUnlocked: false, letterRead: false, hugged: false, sound: false, music: true }

function load(): Progress {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return DEFAULTS
    return { ...DEFAULTS, ...(JSON.parse(raw) as Partial<Progress>) }
  } catch { return DEFAULTS }
}

const CHAPTERS: { scene: Scene; label: string }[] = [
  { scene: 'home', label: 'Meet Nova' },
  { scene: 'reasons', label: '100 Reasons' },
  { scene: 'memory', label: 'Memory Planet' },
  { scene: 'secret', label: 'Secret Letter' },
  { scene: 'ending', label: 'The Ending' },
]

export default function App() {
  const [progress, setProgress] = useState<Progress>(load)
  const [scene, setScene] = useState<Scene>(() => (load().booted ? 'home' : 'boot'))
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(progress)) } catch { /* private mode */ } }, [progress])
  useEffect(() => { setSoundEnabled(progress.sound) }, [progress.sound])

  // Peaceful music: browsers only allow audio after a gesture, so it fades in
  // on her very first tap/click anywhere (usually the ENTER button), if music is on.
  useEffect(() => {
    if (!progress.music) { stopMusic(); return }
    const kick = () => startMusic()
    window.addEventListener('pointerdown', kick)
    window.addEventListener('keydown', kick)
    return () => { window.removeEventListener('pointerdown', kick); window.removeEventListener('keydown', kick) }
  }, [progress.music])

  const patch = useCallback((p: Partial<Progress>) => setProgress(prev => ({ ...prev, ...p })), [])
  const showToast = useCallback((m: string) => setToast(m), [])
  const closeToast = useCallback(() => setToast(null), [])

  const go = useCallback((s: Scene) => {
    setScene(s)
    setProgress(prev => ({ ...prev, visited: prev.visited.includes(s) ? prev.visited : [...prev.visited, s] }))
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }))
  }, [])

  const backHome = useCallback(() => go('home'), [go])
  const warm = scene === 'hug' || scene === 'peaceful' || scene === 'ending'
  const cinematic = scene === 'boot' || scene === 'title' || scene === 'ending'

  const chapterUnlocked = (s: Scene) =>
    s === 'home' || s === 'reasons' || s === 'memory' ||
    (s === 'secret' && progress.memoryUnlocked) ||
    (s === 'ending' && progress.letterRead)

  const chapterDone = (s: Scene) =>
    (s === 'home' && progress.visited.some(v => ['hug', 'letter', 'special', 'peaceful'].includes(v))) ||
    (s === 'reasons' && progress.reasons.length >= 100) ||
    (s === 'memory' && progress.memoryUnlocked) ||
    (s === 'secret' && progress.letterRead) ||
    (s === 'ending' && progress.hugged)

  return (
    <div className="relative min-h-dvh font-sans">
      <Nebula warm={warm} />
      <Starfield warm={warm} />
      <Toast msg={toast} onClose={closeToast} />

      {/* minimal top bar */}
      <header className="fixed inset-x-0 top-0 z-[70] flex items-center justify-between px-4 py-3 sm:px-6" style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}>
        <button type="button" onClick={() => progress.booted && go('home')} aria-label="DOLL.EXE — back to the universe home"
          className="inline-flex min-h-[40px] cursor-pointer items-center gap-2 rounded-full px-2 py-1 font-mono text-sm font-bold tracking-widest text-[#ffdbe8]">
          <Heart size={15} fill="#ff6fa5" className="text-[#ff6fa5]" /> DOLL.EXE
        </button>
        <span className="flex items-center gap-2">
          <button type="button"
            onClick={() => {
              const next = !progress.music; patch({ music: next })
              if (next) { startMusic(); showToast('Music on. Something soft, just for you, Doll. 🎵') } else stopMusic()
            }}
            aria-pressed={progress.music} aria-label={progress.music ? 'Turn the peaceful music off' : 'Turn the peaceful music on'}
            title={progress.music ? 'Music: on' : 'Music: off'}
            className={`glass btn-glow relative grid h-11 w-11 cursor-pointer place-items-center rounded-full ${progress.music ? 'text-[#ffb7d1]' : 'text-[#8f83b8]'}`}>
            <Music size={19} />
            {progress.music
              ? <span aria-hidden className="anim-pulse-warm absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-[#ff6fa5] shadow-[0_0_8px_rgba(255,111,165,.9)]" style={{ animation: 'pulse-warm 1.8s ease-in-out infinite' }} />
              : <span aria-hidden className="absolute h-[2px] w-6 rotate-45 rounded bg-current" />}
          </button>
          <button type="button"
            onClick={() => { const next = !progress.sound; patch({ sound: next }); if (next) showToast('Sound effects on. Tiny sparkles incoming. 🔊') }}
            aria-pressed={progress.sound} aria-label={progress.sound ? 'Mute sound effects' : 'Turn sound effects on'}
            title={progress.sound ? 'Sound effects: on' : 'Sound effects: off'}
            className="glass btn-glow grid h-11 w-11 cursor-pointer place-items-center rounded-full text-[#ffdbe8]">
            {progress.sound ? <Volume2 size={19} /> : <VolumeX size={19} />}
          </button>
        </span>
      </header>

      <AnimatePresence mode="wait">
        {scene === 'boot' && <BootScene key="boot" onDone={() => { patch({ booted: true }); go('title') }} />}
        {scene === 'title' && <TitleScene key="title" onEnter={() => go('home')} />}
        {scene === 'home' && (
          <Home key="home" go={go} showToast={showToast} reasonsFound={progress.reasons.length}
            memoryUnlocked={progress.memoryUnlocked} letterRead={progress.letterRead} />
        )}
        {scene === 'hug' && <HugScene key="hug" back={backHome} />}
        {scene === 'letter' && <LetterScene key="letter" back={backHome} />}
        {scene === 'special' && <SpecialScene key="special" back={backHome} />}
        {scene === 'peaceful' && <PeacefulScene key="peaceful" back={backHome} />}
        {scene === 'reasons' && (
          <Reasons key="reasons" back={backHome} found={progress.reasons}
            onDiscover={idx => setProgress(prev => prev.reasons.includes(idx) ? prev : { ...prev, reasons: [...prev.reasons, idx] })} />
        )}
        {scene === 'memory' && (
          <Memory key="memory" back={backHome} go={go} unlocked={progress.memoryUnlocked}
            onUnlock={() => patch({ memoryUnlocked: true })} />
        )}
        {scene === 'secret' && (
          <Secret key="secret" back={() => go('memory')} go={go} showToast={showToast}
            onRead={() => patch({ letterRead: true })} />
        )}
        {scene === 'ending' && <Ending key="ending" back={backHome} onHug={() => patch({ hugged: true })} />}
      </AnimatePresence>

      {/* subtle journey progress — hidden during cinematic moments */}
      {!cinematic && (
        <nav aria-label="Your journey through the universe"
          className="fixed bottom-[max(1.1rem,env(safe-area-inset-bottom))] left-1/2 z-[70] flex -translate-x-1/2 items-center gap-1.5 rounded-full px-3 py-2"
          style={{ background: 'rgba(20,8,38,.55)', border: '1px solid rgba(255,183,209,.18)', backdropFilter: 'blur(10px)' }}>
          {CHAPTERS.map((c, i) => {
            const unlocked = chapterUnlocked(c.scene)
            const active = scene === c.scene || (c.scene === 'home' && ['hug', 'letter', 'special', 'peaceful'].includes(scene))
            return (
              <span key={c.scene} className="flex items-center gap-1.5">
                {i > 0 && <span aria-hidden className="h-px w-3 bg-[#ffb7d1]/30" />}
                <button type="button" disabled={!unlocked} title={c.label} aria-label={`${c.label}${chapterDone(c.scene) ? ' (completed)' : ''}${unlocked ? '' : ' (locked)'}`}
                  onClick={() => unlocked && go(c.scene)}
                  className={`relative grid h-8 w-8 place-items-center rounded-full text-[11px] transition ${active ? 'bg-gradient-to-br from-[#ff6fa5] to-[#8b7cf6] text-white shadow-[0_0_16px_rgba(255,111,165,.6)]' : unlocked ? 'cursor-pointer bg-white/10 text-[#ffdbe8] hover:bg-white/20' : 'cursor-not-allowed text-[#8f83b8]/60'}`}>
                  {chapterDone(c.scene) ? <Heart size={13} fill="currentColor" /> : <span className="font-mono font-bold">{i + 1}</span>}
                </button>
              </span>
            )
          })}
        </nav>
      )}
    </div>
  )
}
