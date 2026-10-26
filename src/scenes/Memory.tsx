import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart, Lock, Play, RotateCcw, SkipForward, Unlock } from 'lucide-react'
import Companion from '../components/Companion'
import { BackButton, Eyebrow, GlowButton, HeartsRain, SceneShell } from '../components/ui'
import { MEMORY_STEPS, type MemoryStep } from '../data/content'
import { sfxNope, sfxSparkle, sfxUnlock, sfxWarm } from '../lib/sound'
import type { Scene } from '../App'

const OPTIONS = [
  { id: 'A', text: 'We went to the canteen together.' },
  { id: 'B', text: 'You had forgotten your mask, and you asked me to come with you to get one.' },
  { id: 'C', text: 'We stayed in the classroom and talked all morning.' },
  { id: 'D', text: 'We went home because nobody else had arrived.' },
]

function MemoryVisual({ phase, slow }: { phase: MemoryStep['phase']; slow: boolean }) {
  const walking = phase === 'walk' || phase === 'slowmo' || phase === 'heart' || phase === 'after'
  return (
    <div className="relative w-full max-w-3xl overflow-hidden rounded-[2rem] border border-[#ffe9a8]/20 shadow-[0_30px_80px_rgba(5,0,20,.6)]">
      <svg viewBox="0 0 800 440" className="block h-auto w-full" role="img"
        aria-label="A quiet, sunlit school classroom in the early morning, with two silhouettes walking hand in hand">
        <defs>
          <linearGradient id="mem-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ffe9c9" /><stop offset="100%" stopColor="#f7b8c4" /></linearGradient>
          <linearGradient id="mem-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#c98a6b" /><stop offset="100%" stopColor="#8a5638" /></linearGradient>
        </defs>
        <rect width="800" height="300" fill="url(#mem-sky)" />
        {/* windows + sunbeams */}
        {[70, 310, 550].map((x, i) => (
          <g key={i}>
            <rect x={x} y="42" width="180" height="190" rx="10" fill="#fff7e0" stroke="#b0764f" strokeWidth="6" />
            <path d={`M${x} 137 H${x + 180} M${x + 90} 42 V232`} stroke="#b0764f" strokeWidth="5" />
            <polygon points={`${x},232 ${x + 180},232 ${x + 260},440 ${x + 60},440`} fill="#ffedb8" opacity={slow ? 0.34 : 0.22} />
          </g>
        ))}
        <circle cx="712" cy="70" r="30" fill="#fff3b0" style={{ filter: 'drop-shadow(0 0 24px rgba(255,230,150,.95))' }} />
        {/* blackboard */}
        <rect x="292" y="70" width="216" height="104" rx="8" fill="#3d5a4c" stroke="#8a5638" strokeWidth="7" />
        <text x="400" y="116" textAnchor="middle" fontFamily="Caveat, cursive" fontSize="30" fill="#ffeef2">one early morning…</text>
        <text x="400" y="150" textAnchor="middle" fontFamily="Caveat, cursive" fontSize="22" fill="#ffdbe8" opacity=".85">a memory was quietly beginning</text>
        {/* desks */}
        {[120, 330, 540].map((x, i) => (
          <g key={i} fill="#9c6a44"><rect x={x} y={318 + (i % 2) * 22} width="120" height="14" rx="5" /><rect x={x + 10} y={332 + (i % 2) * 22} width="10" height="42" /><rect x={x + 100} y={332 + (i % 2) * 22} width="10" height="42" /></g>
        ))}
        <rect y="392" width="800" height="48" fill="url(#mem-floor)" />
        {/* floating dust in sunlight */}
        {slow && Array.from({ length: 16 }).map((_, i) => (
          <circle key={i} cx={90 + (i * 47) % 640} cy={90 + (i * 61) % 260} r={1.6 + (i % 3)} fill="#fff6d8" className="anim-twinkle" style={{ animationDelay: `${i * 0.4}s` }} />
        ))}
        {/* the two silhouettes */}
        <motion.g initial={false} animate={{ x: walking ? 120 : 0 }} transition={{ duration: slow ? 9 : 3.2, ease: 'easeInOut' }}>
          {/* her */}
          <g transform="translate(300 218)">
            <circle cx="0" cy="0" r="17" fill="#5b2a44" />
            <path d="M-6 14 q-14 44 -10 82 l32 0 q4-38 -4-82z" fill="#7c3f63" />
            <path d="M8 44 q26 10 40 4" stroke="#5b2a44" strokeWidth="8" strokeLinecap="round" fill="none" />
            <path d="M-8 94 l-5 34 M10 94 l6 34" stroke="#4a2136" strokeWidth="8" strokeLinecap="round" />
            <path d="M-18 12 q-2-22 14-26 q20 2 18 24 q-14-10-32 2z" fill="#3c1a2d" />
            <circle cx="-24" cy="-4" r="6" fill="#ff8fb8" />
          </g>
          {/* him */}
          <g transform="translate(392 214)">
            <circle cx="0" cy="0" r="17" fill="#2c1854" />
            <path d="M-13 14 l-4 84 34 0 -4-84z" fill="#3d2a6e" />
            <path d="M-10 44 q-24 8 -38 2" stroke="#2c1854" strokeWidth="8" strokeLinecap="round" fill="none" />
            <path d="M-7 96 l-5 36 M10 96 l6 36" stroke="#20123f" strokeWidth="8" strokeLinecap="round" />
            <path d="M-17 -6 q2-16 17-16 q15 0 17 16 q-17-8-34 0z" fill="#1b0f38" />
          </g>
          {/* joined hands heart */}
          {(phase === 'slowmo' || phase === 'heart' || phase === 'after') && (
            <motion.g initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 90 }}>
              <path d="M354 252 c-3-8-18-8-18 3 0 8 10 12 18 19 8-7 18-11 18-19 0-11-15-11-18-3z" fill="#ff5f9e" style={{ filter: 'drop-shadow(0 0 14px rgba(255,95,158,.95))' }} />
            </motion.g>
          )}
        </motion.g>
        {/* speech bubble */}
        <AnimatePresence>
          {phase === 'ask' && (
            <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <rect x="120" y="120" width="238" height="56" rx="26" fill="#fff8f3" stroke="#ffb7d1" strokeWidth="3" />
              <polygon points="318,170 344,196 296,176" fill="#fff8f3" />
              <text x="239" y="157" textAnchor="middle" fontFamily="Fraunces, serif" fontSize="25" fontStyle="italic" fill="#7c2d52">Mask lene chaloge?</text>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>
      {slow && <motion.div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,220,180,.28),transparent_70%)]" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 4, repeat: Infinity }} />}
    </div>
  )
}

export default function Memory({ back, go, unlocked, onUnlock }: {
  back: () => void; go: (s: Scene) => void; unlocked: boolean; onUnlock: () => void
}) {
  const [stage, setStage] = useState<'intro' | 'quiz' | 'cinematic' | 'done'>(unlocked ? 'done' : 'intro')
  const [wrong, setWrong] = useState<string | null>(null)
  const [shake, setShake] = useState(0)
  const [step, setStep] = useState(0)
  const timer = useRef<ReturnType<typeof setTimeout>>()

  const playCinematic = () => { setStep(0); setStage('cinematic') }

  useEffect(() => {
    if (stage !== 'cinematic') return
    if (step >= MEMORY_STEPS.length) { const id = setTimeout(() => { setStage('done'); sfxWarm() }, 900); return () => clearTimeout(id) }
    const s = MEMORY_STEPS[step]
    timer.current = setTimeout(() => setStep(v => v + 1), s.pause ?? Math.max(2100, Math.min(3900, s.text.length * 62)))
    return () => clearTimeout(timer.current)
  }, [stage, step])

  const pick = (id: string) => {
    if (id === 'B') {
      sfxUnlock(); onUnlock(); setWrong(null); playCinematic()
    } else {
      sfxNope(); setShake(s => s + 1)
      setWrong('Hehe, not quite, Doll. Try remembering that early school morning again. 🎀')
    }
  }

  const current: MemoryStep = MEMORY_STEPS[Math.min(step, MEMORY_STEPS.length - 1)] ?? MEMORY_STEPS[0]
  const slow = current?.phase === 'slowmo' || current?.phase === 'heart'

  return (
    <SceneShell>
      <HeartsRain show={stage === 'done'} count={14} />
      <div className="flex flex-col items-center">
        <Eyebrow>🔐 scene four · the memory planet</Eyebrow>

        <AnimatePresence mode="wait">
          {stage === 'intro' && (
            <motion.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="flex flex-col items-center text-center">
              {/* planet with heart gate */}
              <div className="relative mt-10">
                <motion.div animate={{ y: [0, -12, 0], rotate: [0, 1.5, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative h-52 w-52 rounded-full bg-[radial-gradient(circle_at_34%_28%,#ffdbe8_0%,#ff8fb8_42%,#8b7cf6_78%,#4c2a85_100%)] shadow-[0_0_70px_rgba(255,143,184,.55)] sm:h-60 sm:w-60">
                  <span aria-hidden className="absolute left-[16%] top-[24%] h-8 w-14 rounded-full bg-white/25 blur-[3px]" />
                  <span aria-hidden className="absolute bottom-[20%] right-[14%] h-6 w-11 rounded-full bg-[#7c2d52]/25 blur-[2px]" />
                  <span className="absolute left-1/2 top-1/2 grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#2c0a2e]/35 backdrop-blur-[2px]">
                    <Heart size={62} fill="#ff5f9e" className="text-[#ffb7d1] drop-shadow-[0_0_18px_rgba(255,95,158,.95)]" />
                  </span>
                  <Lock aria-hidden size={22} className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-3 text-white" />
                </motion.div>
                <span aria-hidden className="absolute -inset-7 -z-10 rounded-full border border-dashed border-[#ffb7d1]/30" style={{ animation: 'spin-slow 26s linear infinite' }} />
                <span aria-hidden className="anim-floaty-sm absolute -right-8 top-4 text-2xl">✦</span>
                <span aria-hidden className="anim-floaty absolute -left-9 bottom-8 text-xl">✦</span>
              </div>
              <h2 className="mt-10 max-w-2xl font-serif text-3xl font-semibold leading-tight text-[#fff5f9] text-glow-soft sm:text-[2.6rem]">
                ONE LITTLE MEMORY. TWO PEOPLE.<br />ONE MOMENT I NEVER FORGOT.
              </h2>
              <p className="mt-6 max-w-lg leading-relaxed text-[#e9defc]">
                Doll, there's a little memory hidden on this planet.<br />
                It's something that happened before we were even that close.<br />
                <span className="font-serif text-lg italic text-[#ffdbe8]">Think you remember it?</span>
              </p>
              <GlowButton onClick={() => setStage('quiz')} className="mt-9 px-8 py-4">TRY TO UNLOCK THE MEMORY 🔐</GlowButton>
            </motion.div>
          )}

          {stage === 'quiz' && (
            <motion.div key="quiz" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="mt-10 w-full max-w-2xl text-center">
              <h2 className="font-serif text-3xl font-semibold leading-snug text-[#fff5f9] text-glow-soft sm:text-4xl">
                Back in our school days, during COVID, what happened on that morning when we reached school really early?
              </h2>
              <motion.div key={shake} animate={shake ? { x: [0, -10, 10, -6, 6, 0] } : {}} transition={{ duration: 0.45 }} className="mt-9 grid gap-3 text-left">
                {OPTIONS.map(o => (
                  <button key={o.id} type="button" onClick={() => pick(o.id)}
                    className="glass btn-glow flex min-h-[56px] cursor-pointer items-center gap-4 rounded-3xl px-5 py-4 text-[16px] leading-relaxed text-[#f6ecff]">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#ff8fb8] to-[#8b7cf6] font-mono text-sm font-bold text-white">{o.id}</span>
                    {o.text}
                  </button>
                ))}
              </motion.div>
              <AnimatePresence>
                {wrong && (
                  <motion.p role="alert" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="mx-auto mt-6 max-w-md rounded-3xl border border-[#ffb7d1]/30 bg-[#ff8fb8]/12 px-5 py-4 font-serif text-lg text-[#ffdbe8]">{wrong}</motion.p>
                )}
              </AnimatePresence>
              <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.25em] text-[#b7a6e8]">no penalties, Doll · retry as many times as you like</p>
            </motion.div>
          )}

          {stage === 'cinematic' && (
            <motion.div key="cine" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-9 flex w-full flex-col items-center">
              <MemoryVisual phase={current.phase} slow={slow} />
              <div className="mt-8 flex min-h-[7.5rem] max-w-2xl items-start justify-center text-center" aria-live="polite">
                <AnimatePresence mode="wait">
                  <motion.p key={step} initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.55 }}
                    className={current.big
                      ? 'font-serif text-4xl font-bold italic text-[#ffb7d1] text-glow-pink sm:text-5xl'
                      : 'font-serif text-[26px] leading-snug text-[#fff0f6] text-glow-soft sm:text-3xl'}>
                    {current.text}
                  </motion.p>
                </AnimatePresence>
              </div>
              <div className="h-1.5 w-64 max-w-[75vw] overflow-hidden rounded-full bg-white/10" role="progressbar" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={MEMORY_STEPS.length} aria-label="Memory playback">
                <motion.div className="h-full bg-gradient-to-r from-[#ffe9a8] to-[#ff6fa5]" animate={{ width: `${((step + 1) / MEMORY_STEPS.length) * 100}%` }} />
              </div>
              <button type="button" onClick={() => { clearTimeout(timer.current); setStage('done'); sfxSparkle() }}
                className="glass btn-glow mt-6 inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-[#ffdbe8]">
                <SkipForward size={16} /> Skip the story
              </button>
            </motion.div>
          )}

          {stage === 'done' && (
            <motion.div key="done" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-9 flex flex-col items-center text-center">
              <div className="relative">
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative h-44 w-44 rounded-full bg-[radial-gradient(circle_at_34%_28%,#ffe9c9_0%,#ffb7d1_45%,#ff8fb8_72%,#a06cd5_100%)] shadow-[0_0_80px_rgba(255,183,209,.75)]">
                  <Heart aria-hidden size={52} fill="#ff5f9e" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[#ffdbe8] drop-shadow-[0_0_16px_rgba(255,95,158,.9)]" />
                </motion.div>
                {Array.from({ length: 7 }).map((_, i) => (
                  <motion.span key={i} aria-hidden className="absolute left-1/2 top-1/2 text-[#ffe9a8]"
                    animate={{ rotate: 360 }} transition={{ duration: 14 + i * 2, repeat: Infinity, ease: 'linear' }}
                    style={{ transformOrigin: '0 0' }}>
                    <span style={{ transform: `translate(${Math.cos(i) * 108}px, ${Math.sin(i) * 108}px)`, display: 'block' }}>✦</span>
                  </motion.span>
                ))}
              </div>
              <div className="mt-4"><Companion mood="love" size={118} onClick={() => sfxSparkle()} /></div>
              <p className="mt-3 inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.3em] text-[#ffe9a8]"><Unlock size={15} /> Memory Unlocked ❤️</p>
              <h2 className="mt-4 max-w-xl font-serif text-3xl font-semibold leading-snug text-[#fff5f9] text-glow-soft sm:text-4xl">Some of the smallest moments end up meaning the most.</h2>
              <p className="mt-4 max-w-md leading-relaxed text-[#e9defc]">That ordinary morning is safe here now, Doll — on its own little planet, glowing pink and gold, exactly where it belongs.</p>
              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <GlowButton onClick={() => go('secret')} className="px-8 py-4">OPEN YOUR SECRET LETTER 💌</GlowButton>
                <GlowButton variant="ghost" onClick={playCinematic}><Play size={17} /> Replay the memory</GlowButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {stage === 'quiz' && <GlowButton variant="ghost" onClick={() => setStage('intro')}><RotateCcw size={16} /> Back to the planet</GlowButton>}
          <BackButton onClick={back} />
        </div>
      </div>
    </SceneShell>
  )
}
