import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart, History, RotateCcw, Sparkles, Trophy } from 'lucide-react'
import { BackButton, Burst, Eyebrow, GlowButton, SceneShell, SceneTitle } from '../components/ui'
import { REASONS } from '../data/reasons'
import { sfxSparkle, sfxUnlock } from '../lib/sound'

export default function Reasons({ back, found, onDiscover }: {
  back: () => void
  found: number[]
  onDiscover: (idx: number) => void
}) {
  const [current, setCurrent] = useState<number | null>(null)
  const [spinning, setSpinning] = useState(false)
  const [burst, setBurst] = useState(0)
  const [showHistory, setShowHistory] = useState(false)
  const complete = found.length >= REASONS.length

  const remaining = useMemo(() => REASONS.map((_, i) => i).filter(i => !found.includes(i)), [found])

  const draw = () => {
    if (spinning) return
    setSpinning(true); sfxSparkle()
    setTimeout(() => {
      let idx: number
      if (remaining.length > 0) {
        idx = remaining[Math.floor(Math.random() * remaining.length)]
        onDiscover(idx)
        if (remaining.length === 1) sfxUnlock()
      } else {
        idx = Math.floor(Math.random() * REASONS.length) // all found: encore reminders
      }
      setCurrent(idx); setSpinning(false); setBurst(b => b + 1)
    }, 950)
  }

  return (
    <SceneShell>
      <div className="flex flex-col items-center">
        <Eyebrow>💗 the 100 reasons machine</Eyebrow>
        <SceneTitle className="mt-4 max-w-3xl">100 REASONS WHY YOU'RE MY FAVOURITE HUMAN</SceneTitle>
        <p className="mt-4 font-serif text-xl italic text-[#ffdbe8]">One hundred little reminders from your Kulfi.</p>

        {/* the machine */}
        <div className="relative mt-10 flex flex-col items-center">
          <motion.div animate={spinning ? { rotate: [0, -2, 2, -1, 0], scale: [1, 1.03, 1] } : {}} transition={{ duration: 0.9 }}
            className="relative h-56 w-56 rounded-[45%_45%_48%_48%/55%_55%_45%_45%] border border-[#ffb7d1]/40 bg-gradient-to-b from-[#ffdbe8]/25 via-[#c4b5fd]/15 to-[#ff8fb8]/20 shadow-[inset_0_0_44px_rgba(255,183,209,.3),0_24px_60px_rgba(10,0,25,.5)] backdrop-blur-sm sm:h-64 sm:w-64">
            {/* swirling hearts & stars inside */}
            {Array.from({ length: 11 }).map((_, i) => {
              const angle = (i / 11) * Math.PI * 2
              return (
                <motion.span key={i} aria-hidden className="absolute left-1/2 top-1/2 text-[#ff8fb8]"
                  animate={spinning
                    ? { x: [Math.cos(angle) * 44, Math.cos(angle + 2.4) * 66], y: [Math.sin(angle) * 36, Math.sin(angle + 2.4) * 54], rotate: [0, 260], opacity: [0.9, 1] }
                    : { x: Math.cos(angle) * 52, y: Math.sin(angle) * 42 + Math.sin(i) * 4, rotate: [0, 12, 0] }}
                  transition={spinning ? { duration: 0.9, ease: 'easeInOut' } : { duration: 3 + (i % 4), repeat: Infinity, ease: 'easeInOut' }}>
                  {i % 3 === 0 ? <Sparkles size={15} className="text-[#ffe9a8]" /> : <Heart size={13 + (i % 4) * 3} fill="currentColor" />}
                </motion.span>
              )
            })}
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl" aria-hidden>{spinning ? '✨' : '🎀'}</span>
            <span aria-hidden className="absolute left-[16%] top-[10%] h-10 w-16 -rotate-[24deg] rounded-full bg-white/25 blur-[6px]" />
          </motion.div>
          <div className="h-5 w-40 rounded-b-[2rem] bg-gradient-to-b from-[#8b7cf6]/60 to-[#2c1854] shadow-lg" />
          <div className="mt-1 h-3 w-52 rounded-full bg-[#ff8fb8]/30 blur-[3px]" aria-hidden />

          <div className="relative mt-7">
            <Burst trigger={burst} />
            <GlowButton onClick={draw} className="px-9 py-4 text-base" ariaLabel="Give me a reason">
              {spinning ? 'The machine is thinking of you…' : 'GIVE ME A REASON 💖'}
            </GlowButton>
          </div>
          <p role="status" className="mt-4 font-mono text-xs uppercase tracking-[0.25em] text-[#d8ccff]">
            {found.length} / {REASONS.length} reasons discovered
          </p>
          <div className="mt-3 h-2.5 w-64 max-w-[80vw] overflow-hidden rounded-full bg-white/10" role="progressbar" aria-valuenow={found.length} aria-valuemin={0} aria-valuemax={REASONS.length} aria-label="Reasons discovered">
            <motion.div className="h-full rounded-full bg-gradient-to-r from-[#ff6fa5] to-[#c4b5fd]" animate={{ width: `${(found.length / REASONS.length) * 100}%` }} transition={{ type: 'spring', stiffness: 60 }} />
          </div>
        </div>

        {/* emerging card */}
        <div className="mt-8 flex min-h-[10.5rem] w-full max-w-xl items-start justify-center">
          <AnimatePresence mode="wait">
            {current !== null && !spinning && (
              <motion.article key={`${current}-${burst}`} initial={{ opacity: 0, y: 46, scale: 0.9, rotate: -2 }}
                animate={{ opacity: 1, y: 0, scale: 1, rotate: -0.5 }} exit={{ opacity: 0, y: -18, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 90, damping: 15 }}
                className="paper w-full rounded-[1.4rem] px-7 py-7 text-center">
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-[#c2547f]">Reason #{String(current + 1).padStart(2, '0')}</p>
                <p className="mt-3 font-serif text-[22px] leading-snug text-[#5b2a44]">{REASONS[current]}</p>
                <p className="mt-3 text-sm text-[#a05a7d]">— with love, your Kulfi 💗</p>
              </motion.article>
            )}
            {spinning && (
              <motion.p key="spin" initial={{ opacity: 0 }} animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 0.9, repeat: Infinity }}
                className="pt-10 font-serif text-xl italic text-[#ffdbe8]">swirling through a hundred little truths…</motion.p>
            )}
            {current === null && !spinning && (
              <motion.p key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-10 max-w-md text-center leading-relaxed text-[#e9defc]/85">
                Press the button, Doll. The machine has been saving these up for you — no repeats until you've found them all.
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {complete && (
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 18 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              className="glass mt-4 max-w-xl rounded-[1.75rem] px-7 py-6 text-center">
              <Trophy className="mx-auto text-[#ffe9a8]" size={30} />
              <p className="mt-3 font-serif text-2xl text-[#fff0f6]">You found all 100 reasons, Doll.</p>
              <p className="mt-2 text-[#e9defc]">But honestly? I could keep going.</p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.25em] text-[#ffb7d1]">the button still works — encore reminders, forever</p>
            </motion.div>
          )}
        </AnimatePresence>

        {found.length > 0 && (
          <div className="mt-9 w-full max-w-xl">
            <button type="button" onClick={() => setShowHistory(s => !s)} aria-expanded={showHistory}
              className="glass btn-glow mx-auto flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-[#ffdbe8]">
              <History size={16} /> {showHistory ? 'Hide' : 'Revisit'} discovered reasons ({found.length})
            </button>
            <AnimatePresence>
              {showHistory && (
                <motion.ul initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="thin-scroll mt-4 grid max-h-72 gap-2 overflow-y-auto pr-1">
                  {[...found].sort((a, b) => a - b).map(i => (
                    <li key={i}>
                      <button type="button" onClick={() => { setCurrent(i); sfxSparkle() }}
                        className="glass w-full cursor-pointer rounded-2xl px-5 py-3 text-left text-[15px] leading-relaxed text-[#f6ecff] hover:bg-white/10">
                        <span className="mr-2 font-mono text-xs font-bold text-[#ff8fb8]">#{String(i + 1).padStart(2, '0')}</span>{REASONS[i]}
                      </button>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        )}

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {current !== null && <GlowButton variant="ghost" onClick={() => setCurrent(null)}><RotateCcw size={16} /> Clear card</GlowButton>}
          <BackButton onClick={back} />
        </div>
      </div>
    </SceneShell>
  )
}
