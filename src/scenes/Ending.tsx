import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart, RotateCcw, SkipForward, Sparkles } from 'lucide-react'
import Companion from '../components/Companion'
import { BackButton, GlowButton, HeartsRain } from '../components/ui'
import { sfxSparkle, sfxWarm } from '../lib/sound'

/* Stars sampled along a heart curve */
function useHeartStars(n = 44) {
  return useMemo(() => Array.from({ length: n }, (_, i) => {
    const t = (i / n) * Math.PI * 2
    const x = 16 * Math.pow(Math.sin(t), 3)
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)
    return { x: 200 + x * 10.5, y: 185 - y * 10.5, d: i * 0.055, s: i % 6 === 0 ? 4.6 : 2.6 + (i % 3) }
  }), [n])
}

export default function Ending({ back, onHug }: { back: () => void; onHug: () => void }) {
  const [stage, setStage] = useState(0) // 0 goodbye · 1 wait · 2 constellation · 3 lines · 4 hug prompt · 5 hugged
  const [lineIdx, setLineIdx] = useState(0)
  const stars = useHeartStars()
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  const clearAll = () => { timers.current.forEach(clearTimeout); timers.current = [] }
  const later = (fn: () => void, ms: number) => timers.current.push(setTimeout(fn, ms))

  const start = () => {
    clearAll(); setStage(0); setLineIdx(0)
    later(() => setStage(1), 3400)
    later(() => { setStage(2); sfxSparkle() }, 5900)
    later(() => setStage(3), 8400)
    later(() => setLineIdx(1), 11200)
    later(() => setLineIdx(2), 14200)
    later(() => { setStage(4); sfxWarm() }, 17600)
  }
  useEffect(() => { start(); return clearAll }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const skipToPrompt = () => { clearAll(); setStage(4); setLineIdx(2) }
  const hug = () => { setStage(5); onHug(); sfxWarm(); setTimeout(sfxSparkle, 350) }

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}
      className="relative z-10 mx-auto flex min-h-dvh w-full max-w-4xl flex-col items-center justify-center px-5 pb-28 pt-24 text-center">
      <HeartsRain show={stage === 5} count={34} />
      {stage === 5 && <motion.div aria-hidden initial={{ opacity: 0 }} animate={{ opacity: [0, 0.75, 0.45] }} transition={{ duration: 2.2 }}
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,143,184,.5),rgba(196,181,253,.22)_55%,transparent_78%)]" />}

      <AnimatePresence mode="wait">
        {stage === 0 && (
          <motion.div key="bye" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} className="flex flex-col items-center">
            <Companion mood="wave" size={150} onClick={() => sfxSparkle()} />
            <p className="mt-8 font-serif text-3xl text-[#fff0f6] text-glow-soft">Well, Doll...</p>
            <p className="mt-3 font-serif text-2xl italic text-[#e9defc]">That's the end of your little adventure.</p>
          </motion.div>
        )}

        {stage === 1 && (
          <motion.p key="wait" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="font-mono text-2xl font-bold tracking-wide text-[#ffb7d1] text-glow-pink sm:text-4xl">
            WAIT, DOLL. ONE LAST THING...
          </motion.p>
        )}

        {stage >= 2 && (
          <motion.div key="constellation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative flex w-full flex-col items-center">
            <div className="relative w-[min(88vw,26rem)]">
              <svg viewBox="0 0 400 380" className="w-full" role="img" aria-label="Stars gathering into a large glowing heart constellation">
                <polyline points={stars.map(s => `${s.x},${s.y}`).join(' ') + ` ${stars[0].x},${stars[0].y}`}
                  fill="none" stroke="rgba(255,183,209,.4)" strokeWidth="1.4" strokeDasharray="4 6"
                  style={{ opacity: stage >= 3 ? 1 : 0, transition: 'opacity 1.6s' }} />
                {stars.map((s, i) => (
                  <motion.circle key={i} cx={s.x} cy={s.y} r={s.s} fill={i % 5 === 0 ? '#ffe9a8' : '#ffdbe8'}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: [0, 1, 0.72, 1], scale: stage === 5 ? [1, 1.5, 1.25] : 1 }}
                    transition={{ delay: s.d, duration: 1.1, opacity: { delay: s.d, duration: 2.4, repeat: Infinity, repeatType: 'mirror' } }}
                    style={{ filter: 'drop-shadow(0 0 7px rgba(255,183,209,.95))', transformOrigin: `${s.x}px ${s.y}px` }} />
                ))}
                <motion.g initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 1.6, type: 'spring', stiffness: 70 }}
                  style={{ transformOrigin: '200px 178px' }}>
                  <path d="M200 148 c-6-13-30-13-30 4 0 13 17 20 30 31 13-11 30-18 30-31 0-17-24-17-30-4z" fill="#ff6fa5" style={{ filter: 'drop-shadow(0 0 20px rgba(255,111,165,1))' }} />
                </motion.g>
              </svg>
            </div>

            <div className="mt-4 flex min-h-[10rem] max-w-xl flex-col items-center justify-start">
              <AnimatePresence>
                {stage >= 3 && lineIdx >= 0 && (
                  <motion.p key="l1" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="font-serif text-2xl italic text-[#e9defc] sm:text-[1.7rem]">
                    I made you a whole universe...
                  </motion.p>)}
                {stage >= 3 && lineIdx >= 1 && (
                  <motion.p key="l2" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mt-4 font-serif text-2xl italic text-[#e9defc] sm:text-[1.7rem]">
                    But if I had to choose where to live in it...
                  </motion.p>)}
                {stage >= 3 && lineIdx >= 2 && (
                  <motion.p key="l3" initial={{ opacity: 0, y: 16, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.8 }}
                    className="mt-6 font-serif text-4xl font-bold leading-tight text-[#fff0f6] text-glow-pink sm:text-5xl">
                    ...I'd still choose<br />wherever you are.
                  </motion.p>)}
                {stage >= 3 && lineIdx >= 2 && (
                  <motion.p key="l4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
                    className="mt-6 font-serif text-xl text-[#ffdbe8]">Love, your Kulfi. ❤️</motion.p>)}
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {stage === 4 && (
                <motion.div key="hugbtn" initial={{ opacity: 0, y: 20, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="mt-2">
                  <GlowButton onClick={hug} className="px-10 py-5 text-lg">HUG ME, DUMMY 🧸</GlowButton>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {stage === 5 && (
                <motion.div key="hugged" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} className="mt-2 flex flex-col items-center">
                  <div className="flex items-end gap-2 sm:gap-4">
                    <Companion mood="hug" size={132} onClick={() => sfxWarm()} />
                    <motion.span initial={{ scale: 0, rotate: -16 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 90, damping: 11, delay: 0.15 }}
                      className="mb-5 text-6xl sm:text-7xl" aria-hidden>🧸</motion.span>
                    <motion.span initial={{ scale: 0 }} animate={{ scale: [0, 1.4, 1.15] }} transition={{ delay: 0.3, duration: 0.7 }} className="mb-10 text-[#ff5f9e]" style={{ filter: 'drop-shadow(0 0 18px rgba(255,95,158,1))' }}>
                      <Heart size={52} fill="currentColor" />
                    </motion.span>
                  </div>
                  <motion.h2 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                    className="mt-3 font-serif text-4xl font-bold text-[#fff0f6] text-glow-pink sm:text-5xl">BIGGEST HUG FOR MY DOLL. 🫂💗</motion.h2>
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-5 max-w-md leading-relaxed text-[#f6ecff]">
                    Whenever you need a little reminder of how loved you are, this universe will be here for you.
                  </motion.p>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.25 }} className="mt-5">
                    <p className="font-serif text-xl italic text-[#ffdbe8]">Goodnight, my Doll. Or good morning. Or whenever you're reading this.</p>
                    <p className="mt-2 font-serif text-2xl font-semibold text-[#ffb7d1]">Your Kulfi loves you. ❤️</p>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.7 }} className="mt-9 flex flex-wrap justify-center gap-3">
                    <GlowButton onClick={back} className="px-8 py-4">BACK TO OUR UNIVERSE ✨</GlowButton>
                    <GlowButton variant="ghost" onClick={start}><RotateCcw size={17} /> Replay the ending</GlowButton>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {stage < 4 && (
        <button type="button" onClick={skipToPrompt}
          className="glass btn-glow absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-5 inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-[#ffdbe8]">
          <SkipForward size={16} /> Skip <Sparkles size={14} className="text-[#ffb7d1]" />
        </button>
      )}
      {stage >= 4 && stage !== 5 && (
        <div className="absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-5"><BackButton onClick={back} /></div>
      )}
    </motion.main>
  )
}
