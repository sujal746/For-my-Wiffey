import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart, MailOpen, Sparkles, Star } from 'lucide-react'
import { BackButton, Eyebrow, GlowButton, SceneShell } from '../components/ui'
import { SECRET_LETTER } from '../data/content'
import { sfxSparkle, sfxUnlock } from '../lib/sound'
import type { Scene } from '../App'

export default function Secret({ back, go, onRead, showToast }: {
  back: () => void; go: (s: Scene) => void; onRead: () => void; showToast: (m: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [starLit, setStarLit] = useState(false)

  const openLetter = () => { setOpen(true); onRead(); sfxUnlock() }

  return (
    <SceneShell>
      <div className="flex flex-col items-center">
        <Eyebrow>💌 scene five · inside the memory planet</Eyebrow>

        {/* dreamy observatory window */}
        <div aria-hidden className="relative mt-9 h-36 w-full max-w-2xl overflow-hidden rounded-t-[10rem] rounded-b-[2rem] border border-[#c4b5fd]/30 bg-[radial-gradient(120%_120%_at_50%_0%,#34206b_0%,#180b32_70%)] sm:h-44">
          {Array.from({ length: 26 }).map((_, i) => (
            <span key={i} className="anim-twinkle absolute rounded-full bg-white" style={{
              left: `${(i * 37 + 9) % 94}%`, top: `${(i * 23 + 6) % 78}%`,
              width: i % 5 === 0 ? 3.5 : 2, height: i % 5 === 0 ? 3.5 : 2, animationDelay: `${i * 0.3}s`, opacity: 0.9,
            }} />
          ))}
          <span className="anim-floaty-sm absolute right-[13%] top-[18%] text-[#ffe9a8]" style={{ filter: 'drop-shadow(0 0 12px rgba(255,233,168,.9))' }}>🌙</span>
          <span className="anim-floaty absolute left-[12%] top-[30%] text-lg text-[#ff8fb8]">💗</span>
          <span className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.3em] text-[#cdbcff]/80">the observatory · est. one unforgettable morning</span>
          <span aria-hidden className="absolute inset-x-10 bottom-0 h-px bg-gradient-to-r from-transparent via-[#ffb7d1]/50 to-transparent" />
        </div>

        <AnimatePresence mode="wait">
          {!open ? (
            <motion.div key="sealed" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mt-10 flex flex-col items-center text-center">
              <h2 className="max-w-xl font-serif text-3xl font-semibold leading-snug text-[#fff5f9] text-glow-soft sm:text-4xl">Doll, there's something your Kulfi wants you to know.</h2>
              <p className="mt-4 font-serif text-xl italic text-[#ffdbe8]">Open it whenever you're ready.</p>
              <motion.button type="button" onClick={openLetter} whileHover={{ scale: 1.045, rotate: -1 }} whileTap={{ scale: 0.96 }}
                aria-label="Open Kulfi's secret letter"
                className="group relative mt-12 cursor-pointer">
                <div className="relative h-52 w-[min(86vw,22rem)] rounded-2xl bg-gradient-to-br from-[#c4b5fd] via-[#e9d5ff] to-[#ffb7d1] shadow-[0_30px_70px_rgba(139,124,246,.4)]">
                  <div className="absolute inset-x-0 top-0 h-24 rounded-t-2xl bg-gradient-to-b from-[#8b7cf6] to-[#c4b5fd]" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }} />
                  <span aria-hidden className="anim-sway absolute -top-3 right-7 text-3xl">🎀</span>
                  <span className="absolute left-1/2 top-[46%] grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#fff8f3] text-[#ff5f9e] shadow-lg transition-transform group-hover:scale-110">
                    <Heart size={30} fill="currentColor" />
                  </span>
                  <p className="absolute inset-x-0 bottom-5 text-center font-hand text-3xl text-[#4c2a6e]">For Doll, from Kulfi 💌</p>
                </div>
                <span className="mt-6 block">
                  <span className="btn-glow inline-flex min-h-[52px] items-center gap-2 rounded-full bg-gradient-to-r from-[#ff6fa5] via-[#ff8fb8] to-[#c4a1fd] px-8 py-3.5 font-bold text-white shadow-[0_10px_36px_rgba(255,111,165,.5)]">OPEN LETTER 💗</span>
                </span>
              </motion.button>
            </motion.div>
          ) : (
            <motion.div key="letter" initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} className="mt-10 flex w-full flex-col items-center">
              <motion.article initial={{ rotate: 1 }} animate={{ rotate: -0.4 }} transition={{ type: 'spring', stiffness: 50, damping: 14 }}
                className="paper relative w-full max-w-2xl rounded-[1.4rem] px-6 py-9 sm:px-11">
                <span aria-hidden className="absolute -top-4 left-10 -rotate-12 text-3xl">🎀</span>
                <p className="mb-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[#a05a7d]"><MailOpen size={14} /> a secret, just between us</p>
                <div className="thin-scroll max-h-[52dvh] overflow-y-auto pr-2">
                  <div className="whitespace-pre-line font-hand text-[1.5rem] leading-[1.45] sm:text-[1.65rem]">{SECRET_LETTER}</div>
                </div>
                <p className="mt-6 border-t border-[#e3b7c8]/60 pt-4 text-center font-mono text-[10px] uppercase tracking-[0.28em] text-[#a05a7d]">scroll inside the letter · take your time, Doll</p>
              </motion.article>

              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="mt-10 flex flex-col items-center text-center">
                <p className="font-serif text-2xl italic text-[#ffdbe8]">Some memories never really leave us.</p>
                <p className="mt-2 font-serif text-2xl italic text-[#ffdbe8]">They just become little stars we carry around.</p>
                <button type="button" onClick={() => { setStarLit(true); sfxSparkle(); showToast('This star is that morning, Doll. It glows a little brighter now. ⭐') }}
                  aria-label="Light the little star that holds the memory"
                  className="group relative mt-7 cursor-pointer rounded-full p-3">
                  <Star size={54} className={starLit ? 'text-[#ffe9a8]' : 'text-[#8f83b8] transition-colors group-hover:text-[#ffe9a8]'}
                    fill={starLit ? 'currentColor' : 'none'} strokeWidth={1.6}
                    style={{ filter: starLit ? 'drop-shadow(0 0 22px rgba(255,233,168,1))' : undefined }} />
                  <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.25em] text-[#cdbcff]">{starLit ? 'the mask-morning star · lit forever' : 'tap to light this memory’s star'}</span>
                </button>
                <div className="mt-9 flex flex-wrap justify-center gap-3">
                  <GlowButton onClick={() => go('ending')} className="px-8 py-4">One last thing… ✨</GlowButton>
                  <GlowButton variant="ghost" onClick={() => { setOpen(false); sfxSparkle() }}><Sparkles size={16} /> Seal it again</GlowButton>
                  <BackButton onClick={back} />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {!open && <div className="mt-12"><BackButton onClick={back} label="Back to the Memory Planet" /></div>}
      </div>
    </SceneShell>
  )
}
