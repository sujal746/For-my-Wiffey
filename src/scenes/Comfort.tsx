import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart, MailOpen, MoonStar, RotateCcw, Wind } from 'lucide-react'
import Companion from '../components/Companion'
import { BackButton, Eyebrow, GlowButton, HeartsRain, SceneShell, SceneTitle } from '../components/ui'
import { LOVE_LETTER } from '../data/content'
import { sfxSparkle, sfxUnlock, sfxWarm } from '../lib/sound'

const stagger = (i: number) => ({ initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.25 + i * 0.35, duration: 0.6 } })

export function HugScene({ back }: { back: () => void }) {
  const [hugged, setHugged] = useState(false)
  useEffect(() => { const id = setTimeout(() => { setHugged(true); sfxWarm() }, 650); return () => clearTimeout(id) }, [])
  return (
    <SceneShell>
      <HeartsRain show={hugged} count={22} />
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <Eyebrow>🫂 a hug, delivered instantly</Eyebrow>
        <motion.div {...stagger(0)} className="relative mt-8">
          <motion.span aria-hidden animate={hugged ? { scale: [1, 1.5, 1.25], opacity: [0.5, 0.9, 0.7] } : {}}
            transition={{ duration: 1.6, repeat: Infinity, repeatType: 'mirror' }}
            className="absolute inset-0 -z-10 rounded-full bg-[#ff8fb8]/40 blur-3xl" />
          <Companion mood="hug" size={210} onClick={() => { setHugged(true); sfxWarm() }} label="Nova giving you a hug" />
          <AnimatePresence>{hugged && (
            <motion.span initial={{ scale: 0, y: 8 }} animate={{ scale: 1, y: -6 }} className="absolute -right-3 top-2 text-[#ff6fa5]" style={{ filter: 'drop-shadow(0 0 12px rgba(255,111,165,.9))' }}>
              <Heart size={44} fill="currentColor" />
            </motion.span>)}
          </AnimatePresence>
        </motion.div>
        <motion.p {...stagger(1)} className="mt-9 max-w-xl font-serif text-3xl leading-snug text-[#fff0f6] text-glow-soft sm:text-4xl">
          Come here, Doll. You don't have to be okay every second of every day.
        </motion.p>
        <motion.p {...stagger(2)} className="mt-5 max-w-lg text-[17px] leading-relaxed text-[#e9defc]">
          Whatever kind of day you're having, you deserve a little love.
        </motion.p>
        <motion.p {...stagger(3)} className="mt-6 font-serif text-2xl font-semibold text-[#ffb7d1]">Sending you the biggest virtual hug ever. 🫂</motion.p>
        <motion.div {...stagger(4)} className="mt-10 flex flex-wrap justify-center gap-3">
          <GlowButton onClick={() => { setHugged(false); setTimeout(() => { setHugged(true); sfxWarm() }, 60) }}><RotateCcw size={17} /> Hug me again</GlowButton>
          <BackButton onClick={back} />
        </motion.div>
      </div>
    </SceneShell>
  )
}

export function LetterScene({ back }: { back: () => void }) {
  const [open, setOpen] = useState(false)
  return (
    <SceneShell>
      <div className="flex flex-1 flex-col items-center">
        <Eyebrow>💌 from Kulfi, with love</Eyebrow>
        <SceneTitle className="mt-4">A Letter, Just For You</SceneTitle>
        <AnimatePresence mode="wait">
          {!open ? (
            <motion.button key="env" type="button" exit={{ opacity: 0, y: -26, rotate: -3 }} whileHover={{ scale: 1.04, rotate: -1 }} whileTap={{ scale: 0.96 }}
              onClick={() => { setOpen(true); sfxUnlock() }}
              aria-label="Open the sealed love letter"
              className="group relative mt-14 cursor-pointer">
              <div className="relative h-52 w-[min(86vw,22rem)] rounded-2xl bg-gradient-to-br from-[#ff8fb8] via-[#ffb7d1] to-[#e9d5ff] shadow-[0_30px_70px_rgba(255,111,165,.4)]">
                <div className="absolute inset-x-0 top-0 h-24 rounded-t-2xl bg-gradient-to-b from-[#ff6fa5] to-[#ff8fb8]" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }} />
                <span className="absolute left-1/2 top-[46%] grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#fff0f6] text-[#ff5f9e] shadow-lg transition-transform group-hover:scale-110">
                  <Heart size={30} fill="currentColor" />
                </span>
                <p className="absolute inset-x-0 bottom-5 text-center font-hand text-3xl text-[#7c2d52]">For my Doll 🎀</p>
              </div>
              <span className="mt-6 block text-sm font-bold text-[#ffb7d1]">Tap to break the seal 💗</span>
            </motion.button>
          ) : (
            <motion.article key="letter" initial={{ opacity: 0, y: 34, rotate: 1 }} animate={{ opacity: 1, y: 0, rotate: -0.5 }}
              transition={{ type: 'spring', stiffness: 55, damping: 14 }}
              className="paper relative mt-12 w-full max-w-2xl rounded-[1.4rem] px-6 py-9 sm:px-11 sm:py-11">
              <Heart aria-hidden className="absolute -top-4 right-8 rotate-12 text-[#ff5f9e]" size={34} fill="currentColor" />
              <p className="mb-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[#a05a7d]"><MailOpen size={14} /> opened with love</p>
              <div className="whitespace-pre-line font-hand text-[1.55rem] leading-[1.45] sm:text-[1.7rem]">{LOVE_LETTER}</div>
            </motion.article>
          )}
        </AnimatePresence>
        <div className="mt-10 flex flex-wrap justify-center gap-3 pb-4">
          {open && <GlowButton variant="lav" onClick={() => setOpen(false)}><RotateCcw size={17} /> Seal it again</GlowButton>}
          <BackButton onClick={back} />
        </div>
      </div>
    </SceneShell>
  )
}

const SPECIAL_LINES = [
  'You don\'t have to be perfect to be loved.',
  'Your little quirks make you you.',
  'You deserve kindness, patience, happiness, and a love that makes you feel safe.',
  'And somewhere in this universe, there\'s a boy who calls you Doll and feels ridiculously lucky to have you.',
]
const FLOWERS = ['🌷', '🌸', '🌹', '💐', '🪷', '🌺', '✿', '❀']

export function SpecialScene({ back }: { back: () => void }) {
  const [shown, setShown] = useState(0)
  const [round, setRound] = useState(0)
  const flowers = Array.from({ length: 16 }, (_, i) => ({
    id: `${round}-${i}`, f: FLOWERS[i % FLOWERS.length],
    left: 3 + ((i * 61 + round * 23) % 92), bottom: 2 + ((i * 37) % 22), size: 22 + ((i * 13) % 22), delay: (i % 8) * 0.14,
  }))
  return (
    <SceneShell>
      <div aria-hidden className="pointer-events-none fixed inset-x-0 bottom-0 z-0 h-56 overflow-hidden">
        {flowers.map(f => (
          <motion.span key={f.id} initial={{ scale: 0, rotate: -40, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ delay: f.delay, type: 'spring', stiffness: 120, damping: 11 }}
            className="anim-sway absolute" style={{ left: `${f.left}%`, bottom: `${f.bottom}%`, fontSize: f.size }}>{f.f}</motion.span>
        ))}
      </div>
      <div className="relative flex flex-1 flex-col items-center text-center">
        <Eyebrow>🌷 a reminder, blooming for you</Eyebrow>
        <div className="mt-6"><Companion mood="happy" size={140} onClick={() => sfxSparkle()} /></div>
        <motion.p {...stagger(0)} className="mt-6 font-serif text-2xl italic text-[#ffdbe8]">Just in case nobody has reminded you today...</motion.p>
        <div className="mt-7 flex min-h-[11rem] max-w-xl flex-col items-center gap-4">
          <AnimatePresence>
            {SPECIAL_LINES.slice(0, shown).map((l, i) => (
              <motion.p key={i} initial={{ opacity: 0, y: 14, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`leading-relaxed ${i === SPECIAL_LINES.length - 1 ? 'font-serif text-[22px] text-[#fff0f6] text-glow-soft' : 'text-[17px] text-[#e9defc]'}`}>{l}</motion.p>
            ))}
          </AnimatePresence>
          {shown >= SPECIAL_LINES.length && (
            <motion.p initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="font-serif text-3xl font-semibold text-[#ffb7d1] text-glow-pink">
              Yes, Doll. I'm talking about you. 💗
            </motion.p>
          )}
        </div>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          {shown < SPECIAL_LINES.length
            ? <GlowButton onClick={() => { setShown(s => s + 1); sfxSparkle() }}>Tell me more 🌷</GlowButton>
            : <GlowButton onClick={() => { setShown(0); setRound(r => r + 1) }}><RotateCcw size={17} /> Bloom it again</GlowButton>}
          <BackButton onClick={back} />
        </div>
      </div>
    </SceneShell>
  )
}

export function PeacefulScene({ back }: { back: () => void }) {
  const [breathing, setBreathing] = useState(false)
  const [phase, setPhase] = useState<'in' | 'out'>('in')
  useEffect(() => {
    if (!breathing) return
    const id = setInterval(() => setPhase(p => (p === 'in' ? 'out' : 'in')), 4000)
    return () => clearInterval(id)
  }, [breathing])
  return (
    <SceneShell>
      <div className="flex flex-1 flex-col items-center text-center">
        <Eyebrow>🌙 your little safe place</Eyebrow>
        <SceneTitle className="mt-4">Stay As Long As You Like</SceneTitle>

        <div className="relative mt-10 w-full max-w-3xl overflow-hidden rounded-[2rem] border border-[#c4b5fd]/25 shadow-[0_30px_80px_rgba(5,0,20,.6)]">
          <svg viewBox="0 0 800 460" className="block h-auto w-full" role="img" aria-label="A peaceful floating island under a lavender night sky, with a glowing moon and a quiet lake">
            <defs>
              <linearGradient id="pf-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#241145" /><stop offset="60%" stopColor="#3b2064" /><stop offset="100%" stopColor="#5b3670" /></linearGradient>
              <linearGradient id="pf-lake" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4a2d6e" /><stop offset="100%" stopColor="#1b0f38" /></linearGradient>
              <radialGradient id="pf-moon" cx="42%" cy="38%" r="70%"><stop offset="0%" stopColor="#fffbe8" /><stop offset="100%" stopColor="#f3d98b" /></radialGradient>
            </defs>
            <rect width="800" height="290" fill="url(#pf-sky)" />
            {[[60,50],[150,110],[250,40],[360,90],[520,45],[640,100],[730,55],[90,170],[700,180],[430,150],[200,200],[590,190]].map(([x,y],i) => (
              <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 2.4 : 1.4} fill="#fff" className="anim-twinkle" style={{ animationDelay: `${i * 0.35}s` }} />
            ))}
            <g className="anim-drift" style={{ animation: 'drift 24s ease-in-out infinite alternate' }}>
              <ellipse cx="180" cy="105" rx="85" ry="17" fill="#c4b5fd" opacity="0.16" /><ellipse cx="620" cy="150" rx="105" ry="19" fill="#ffb7d1" opacity="0.13" />
            </g>
            <circle cx="648" cy="92" r="46" fill="url(#pf-moon)" style={{ filter: 'drop-shadow(0 0 34px rgba(255,233,168,.75))' }} />
            <circle cx="632" cy="80" r="8" fill="#e8cf8f" opacity=".6" /><circle cx="662" cy="104" r="6" fill="#e8cf8f" opacity=".5" />
            {/* island */}
            <path d="M238 292 Q400 238 562 292 Q520 330 470 322 L400 372 L330 322 Q278 330 238 292Z" fill="#2e1a52" />
            <path d="M238 292 Q400 238 562 292 Q400 268 238 292Z" fill="#7c5cbf" />
            <path d="M238 292 Q400 268 562 292 Q520 306 400 298 Q280 306 238 292Z" fill="#ffb7d1" opacity=".35" />
            {/* tiny tree + lamp */}
            <path d="M300 272 q4-26 -4-38 M296 248 q-16-6-20-18 M297 242 q14-10 12-24" stroke="#1d1038" strokeWidth="6" fill="none" strokeLinecap="round" />
            <circle cx="284" cy="222" r="21" fill="#ff8fb8" opacity=".8" /><circle cx="306" cy="210" r="15" fill="#ffb7d1" opacity=".85" />
            <circle cx="492" cy="258" r="5" fill="#ffe9a8" style={{ filter: 'drop-shadow(0 0 12px rgba(255,233,168,1))' }} />
            <path d="M492 264 v16" stroke="#1d1038" strokeWidth="4" strokeLinecap="round" />
            {/* lake */}
            <rect y="330" width="800" height="130" fill="url(#pf-lake)" />
            <ellipse cx="648" cy="352" rx="58" ry="7" fill="#ffe9a8" opacity=".28" style={{ animation: 'ripple 4s ease-in-out infinite' }} />
            <ellipse cx="648" cy="382" rx="38" ry="5" fill="#ffe9a8" opacity=".18" style={{ animation: 'ripple 5s ease-in-out infinite 1s' }} />
            <ellipse cx="400" cy="398" rx="120" ry="6" fill="#c4b5fd" opacity=".12" style={{ animation: 'ripple 6s ease-in-out infinite .5s' }} />
            {[[120,368],[260,420],[540,428],[700,414],[340,362]].map(([x,y],i) => <circle key={i} cx={x} cy={y} r="1.8" fill="#ffdbe8" className="anim-twinkle" style={{ animationDelay: `${i * .5}s` }} />)}
          </svg>
          <div className="absolute bottom-[21%] left-1/2 -translate-x-1/2"><Companion mood="sleepy" size={86} label="Nova sitting beside you, quietly" /></div>
        </div>

        <motion.p {...stagger(0)} className="mt-9 font-serif text-3xl text-[#fff0f6] text-glow-soft">Welcome to your little safe place.</motion.p>
        <motion.p {...stagger(1)} className="mt-4 max-w-lg text-[17px] leading-relaxed text-[#e9defc]">
          No pressure. No expectations. No need to explain anything.<br />Just you, the stars, and a little reminder that you matter.
        </motion.p>

        <AnimatePresence>
          {breathing && (
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-8 flex flex-col items-center">
              <motion.span aria-hidden animate={{ scale: phase === 'in' ? 1.45 : 0.85, opacity: phase === 'in' ? 0.95 : 0.6 }}
                transition={{ duration: 3.9, ease: 'easeInOut' }}
                className="grid h-24 w-24 place-items-center rounded-full bg-[radial-gradient(circle,#ffb7d1_0%,rgba(196,181,253,.35)_60%,transparent_72%)]">
                <Wind className="text-[#7c2d52]" size={26} />
              </motion.span>
              <p role="status" className="mt-3 font-serif text-xl text-[#ffdbe8]">{phase === 'in' ? 'breathe in…' : '…and let it go'}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <GlowButton onClick={() => { setBreathing(b => !b); sfxWarm() }}>
            <MoonStar size={18} /> {breathing ? 'That’s enough breathing' : 'STAY HERE A LITTLE LONGER 🌙'}
          </GlowButton>
          <BackButton onClick={back} label="Head back when you're ready" />
        </div>
      </div>
    </SceneShell>
  )
}
