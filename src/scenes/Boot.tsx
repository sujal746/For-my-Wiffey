import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { SkipForward, Sparkles } from 'lucide-react'
import { BOOT_LINES } from '../data/content'
import { GlowButton } from '../components/ui'
import { sfxType, sfxWarm } from '../lib/sound'

export function BootScene({ onDone }: { onDone: () => void }) {
  const [lineIdx, setLineIdx] = useState(0)
  const [chars, setChars] = useState(0)
  const [expanding, setExpanding] = useState(false)
  const doneRef = useRef(false)

  const finish = () => {
    if (doneRef.current) return
    doneRef.current = true
    sfxWarm()
    setExpanding(true)
    setTimeout(onDone, 1500)
  }

  useEffect(() => {
    if (expanding) return
    const line = BOOT_LINES[lineIdx]
    if (!line) { const id = setTimeout(finish, 700); return () => clearTimeout(id) }
    if (chars < line.length) {
      const id = setTimeout(() => { setChars(c => c + 1); if (chars % 2 === 0) sfxType() }, 34)
      return () => clearTimeout(id)
    }
    const id = setTimeout(() => { setLineIdx(i => i + 1); setChars(0) }, lineIdx === 3 ? 900 : 560)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chars, lineIdx, expanding])

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}
      className="relative z-10 flex min-h-dvh flex-col items-center justify-center px-6"
      style={{ background: 'radial-gradient(70% 55% at 50% 46%, #1c0b36 0%, #0a0314 70%)' }}>
      {/* the tiny star */}
      <motion.div aria-hidden className="relative mb-12 grid place-items-center">
        <motion.span animate={expanding ? { scale: 60, opacity: [1, 1, 0] } : { scale: [1, 1.35, 1], opacity: 1 }}
          transition={expanding ? { duration: 1.5, ease: 'easeInOut' } : { duration: 2.2, repeat: Infinity }}
          className="block h-4 w-4 rounded-full bg-[#ffdbe8]"
          style={{ boxShadow: '0 0 22px 6px rgba(255,183,209,.95), 0 0 70px 26px rgba(196,181,253,.55), 0 0 140px 60px rgba(255,111,165,.3)' }} />
        {!expanding && <>
          <span className="anim-twinkle absolute -left-10 -top-6 text-sm text-[#ffe9a8]">✦</span>
          <span className="anim-twinkle absolute -right-9 top-4 text-xs text-[#d8ccff]" style={{ animationDelay: '.8s' }}>✦</span>
          <span className="anim-twinkle absolute -bottom-7 -left-4 text-[10px] text-[#ffb7d1]" style={{ animationDelay: '1.4s' }}>✦</span>
        </>}
      </motion.div>

      <div className="min-h-[13.5rem] w-full max-w-xl font-mono text-[15px] leading-8 sm:text-base" aria-live="polite">
        {BOOT_LINES.slice(0, lineIdx).map((l, i) => (
          <motion.p key={i} initial={{ opacity: 0 }} animate={{ opacity: i === BOOT_LINES.length - 1 ? 1 : 0.5 }}
            className={i === 4 ? 'font-bold text-[#ff8fb8]' : i === BOOT_LINES.length - 1 ? 'text-glow-pink font-serif text-2xl normal-case tracking-normal text-[#ffdbe8]' : 'text-[#cdbcff]'}>
            {i !== BOOT_LINES.length - 1 && <span className="mr-2 text-[#ff8fb8]/60">›</span>}{l}
          </motion.p>
        ))}
        {lineIdx < BOOT_LINES.length && (
          <p className={`caret ${lineIdx === 4 ? 'font-bold text-[#ff8fb8]' : 'text-[#e6dcff]'}`}>
            <span className="mr-2 text-[#ff8fb8]/60">›</span>{BOOT_LINES[lineIdx].slice(0, chars)}
          </p>
        )}
      </div>

      <button type="button" onClick={finish}
        className="glass btn-glow absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-5 inline-flex cursor-pointer items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-[#ffdbe8]">
        <SkipForward size={16} /> Skip intro
      </button>
      {expanding && <motion.div aria-hidden initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5 }}
        className="pointer-events-none fixed inset-0 z-30 bg-[radial-gradient(circle_at_center,#ffeef6_0%,#ffb7d1_38%,#c4b5fd_68%,transparent_100%)]" />}
    </motion.main>
  )
}

export function TitleScene({ onEnter }: { onEnter: () => void }) {
  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.8 }}
      className="relative z-10 flex min-h-dvh flex-col items-center justify-center px-5 py-20 text-center">
      {/* cute planets */}
      <div aria-hidden className="anim-floaty absolute left-[8%] top-[16%] hidden sm:block">
        <div className="relative h-16 w-16 rounded-full bg-gradient-to-br from-[#ffdbe8] to-[#c4b5fd] shadow-[0_0_36px_rgba(196,181,253,.6)]">
          <span className="absolute left-[38%] top-[36%] h-2 w-2 rounded-full bg-[#571f3d]" /><span className="absolute left-[60%] top-[36%] h-2 w-2 rounded-full bg-[#571f3d]" />
          <span className="absolute left-[44%] top-[52%] h-2.5 w-4 rounded-b-full border-b-[3px] border-[#571f3d]" />
          <span className="absolute -left-4 top-1/2 h-2.5 w-24 -translate-y-1/2 rotate-[-14deg] rounded-full border-2 border-[#ffb7d1]/70" />
        </div>
      </div>
      <div aria-hidden className="anim-floaty-sm absolute right-[10%] top-[24%] hidden sm:block" style={{ animationDelay: '1s' }}>
        <div className="relative h-11 w-11 rounded-full bg-gradient-to-br from-[#ffe9a8] to-[#ff8fb8] shadow-[0_0_30px_rgba(255,183,209,.6)]">
          <span className="absolute left-[36%] top-[38%] h-1.5 w-1.5 rounded-full bg-[#571f3d]" /><span className="absolute left-[60%] top-[38%] h-1.5 w-1.5 rounded-full bg-[#571f3d]" />
          <span className="absolute left-[42%] top-[54%] h-2 w-3 rounded-b-full border-b-2 border-[#571f3d]" />
        </div>
      </div>

      <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        className="anim-glitch mb-5 font-mono text-xs uppercase tracking-[0.4em] text-[#d8ccff]">✦ a tiny universe, compiled with love ✦</motion.p>
      <motion.h1 initial={{ opacity: 0, y: 22, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.4, type: 'spring', stiffness: 60 }}
        className="shimmer-text font-mono text-[17vw] font-bold leading-none tracking-tight sm:text-8xl md:text-9xl">DOLL.EXE</motion.h1>
      <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}
        className="mt-6 font-serif text-2xl italic text-[#ffdbe8] text-glow-soft sm:text-3xl">A little universe that exists just for you.</motion.p>
      <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }}
        className="mt-7 max-w-md text-[17px] leading-relaxed text-[#e9defc]">
        Hey, Doll. I made a little something for you.<br />Wanna explore it with me?
      </motion.p>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.05 }}>
        <GlowButton onClick={onEnter} className="mt-10 px-9 py-4 text-base">
          ENTER MY LITTLE UNIVERSE <Sparkles size={19} />
        </GlowButton>
      </motion.div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }} className="mt-8 font-mono text-[11px] tracking-widest text-[#b7a6e8]">
        made by your Kulfi · for his Doll · sound optional, feelings guaranteed
      </motion.p>
    </motion.main>
  )
}
