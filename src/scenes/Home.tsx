import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { BookHeart, Gift, Heart, Lock, Mail, MoonStar, Play, Sparkles, Star, Flower2, Armchair } from 'lucide-react'
import Companion, { type Mood } from '../components/Companion'
import { COMPANION_IDLE_LINES } from '../data/content'
import { sfxSparkle, sfxUnlock } from '../lib/sound'
import type { Scene } from '../App'

export default function Home({ go, showToast, reasonsFound, memoryUnlocked, letterRead }: {
  go: (s: Scene) => void
  showToast: (m: string) => void
  reasonsFound: number; memoryUnlocked: boolean; letterRead: boolean
}) {
  const [line, setLine] = useState('Hi, Doll! 🎀')
  const [phase, setPhase] = useState(0)
  const [mood, setMood] = useState<Mood>('wave')
  const clicks = useRef(0)
  const timer = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    const t1 = setTimeout(() => setLine("I've been waiting for you."), 2600)
    const t2 = setTimeout(() => { setPhase(1); setMood('idle'); setLine('So, my favourite human... what do you need today?') }, 5400)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  // occasional idle dialogue (non-intrusive)
  useEffect(() => {
    if (phase === 0) return
    const id = setInterval(() => {
      if (document.hidden || Math.random() > 0.55) return
      setLine(COMPANION_IDLE_LINES[Math.floor(Math.random() * COMPANION_IDLE_LINES.length)])
    }, 14000)
    return () => clearInterval(id)
  }, [phase])

  const pokeCompanion = () => {
    clicks.current += 1
    sfxSparkle()
    if (clicks.current >= 5) {
      clicks.current = 0; setMood('shy'); setLine("Okay, Doll, that's enough! You're making me shy. 🎀")
    } else {
      setMood('happy'); setLine(['Hehe! Hi again, Doll. 🎀', 'That tickles, Sweetu!', 'Boop received. Booping you back. 💗', 'You found my favourite hobby: being poked by you.'][clicks.current - 1] || 'Hehe!')
    }
    clearTimeout(timer.current)
    timer.current = setTimeout(() => { setMood('idle'); setLine('So, my favourite human... what do you need today?') }, 3600)
  }

  const options = [
    { scene: 'hug' as Scene, icon: '🫂', title: 'I NEED A HUG', desc: 'For heavy days & soft hearts', grad: 'from-[#ff8fb8]/25 to-[#ff6fa5]/10' },
    { scene: 'letter' as Scene, icon: '💌', title: 'GIVE ME A LOVE LETTER', desc: 'Sealed with a tiny heart', grad: 'from-[#c4b5fd]/25 to-[#8b7cf6]/10' },
    { scene: 'special' as Scene, icon: '🌷', title: 'REMIND ME HOW SPECIAL I AM', desc: 'In case today forgot to tell you', grad: 'from-[#fda4af]/25 to-[#fb7185]/10' },
    { scene: 'peaceful' as Scene, icon: '🌙', title: 'TAKE ME SOMEWHERE PEACEFUL', desc: 'A quiet island, just for you', grad: 'from-[#a5b4fc]/25 to-[#818cf8]/10' },
  ]

  const journey = [
    { scene: 'reasons' as Scene, icon: Gift, title: '100 Reasons Machine', desc: `${reasonsFound}/100 reasons discovered`, locked: false, lockMsg: '' },
    { scene: 'memory' as Scene, icon: Star, title: 'The Memory Planet', desc: memoryUnlocked ? 'Memory unlocked ❤️ — revisit it anytime' : 'One little memory, locked behind a heart gate', locked: false, lockMsg: '' },
    { scene: 'secret' as Scene, icon: Mail, title: 'A Secret Letter from Kulfi', desc: memoryUnlocked ? 'Waiting inside the Memory Planet' : 'Unlock the Memory Planet first', locked: !memoryUnlocked, lockMsg: 'Psst, Doll — unlock the Memory Planet first. The letter is hiding inside it. 🔐' },
    { scene: 'ending' as Scene, icon: BookHeart, title: 'The Ending That Isn’t an Ending', desc: letterRead ? 'Revisit the constellation anytime' : 'Read Kulfi’s secret letter first', locked: !letterRead, lockMsg: 'That constellation appears after the secret letter, Doll. One step at a time. ✨' },
  ]

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.99 }} transition={{ duration: 0.6 }}
      className="relative z-10 mx-auto min-h-dvh w-full max-w-6xl px-4 pb-28 pt-24 sm:px-6">
      {/* Easter eggs sprinkled in the sky */}
      <button type="button" aria-label="The moon" onClick={() => { sfxSparkle(); showToast("Even the moon knows you're my favourite, Doll. 🌙") }}
        className="anim-floaty-sm absolute right-5 top-20 cursor-pointer rounded-full p-2 text-[#ffe9a8] sm:right-10" style={{ filter: 'drop-shadow(0 0 14px rgba(255,233,168,.85))' }}>
        <MoonStar size={38} />
      </button>
      <button type="button" aria-label="A tiny floating heart" onClick={() => { sfxSparkle(); showToast('Secret message unlocked: Your Kulfi is thinking about you right now. ❤️') }}
        className="anim-floaty absolute left-[6%] top-[38%] cursor-pointer p-2 text-[#ff8fb8]" style={{ filter: 'drop-shadow(0 0 12px rgba(255,143,184,.9))' }}>
        <Heart size={22} fill="currentColor" />
      </button>
      <button type="button" aria-label="A special bright star" onClick={() => { sfxUnlock(); showToast("Somewhere in this universe, there's a boy who still remembers that morning at school.") }}
        className="anim-twinkle absolute right-[16%] top-[46%] cursor-pointer p-2 text-[#fff3c4]" style={{ filter: 'drop-shadow(0 0 16px rgba(255,233,168,1))' }}>
        <Star size={20} fill="currentColor" />
      </button>

      <div className="flex flex-col items-center text-center">
        <motion.div initial={{ scale: 0, rotate: -12 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 90, damping: 13 }} className="relative">
          <Companion mood={mood} size={168} onClick={pokeCompanion} />
        </motion.div>
        <motion.div key={line} initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
          className="glass relative mt-2 max-w-md rounded-3xl px-6 py-4" role="status">
          <span aria-hidden className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-l border-t border-[#ffb7d1]/25 bg-[#2b1849]" />
          <p className="font-serif text-xl leading-snug text-[#fff0f6]">{line}</p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-[#cdbcff]">Nova · your little companion · tap her, she loves it</p>
        </motion.div>
      </div>

      <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mt-14">
        <div className="grid gap-4 sm:grid-cols-2">
          {options.map((o, i) => (
            <motion.button key={o.scene} type="button" onClick={() => go(o.scene)}
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.09 }}
              whileHover={{ y: -5, scale: 1.015 }} whileTap={{ scale: 0.97 }}
              className={`glass group cursor-pointer rounded-[1.75rem] bg-gradient-to-br ${o.grad} p-6 text-left`}>
              <span className="text-4xl" aria-hidden>{o.icon}</span>
              <span className="mt-4 block font-serif text-[22px] font-semibold leading-tight text-white">{o.title}</span>
              <span className="mt-1.5 block text-sm leading-relaxed text-[#e9defc]/90">{o.desc}</span>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-[#ffb7d1]">Open <Sparkles size={15} className="transition-transform group-hover:rotate-12" /></span>
            </motion.button>
          ))}
        </div>
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="mt-16">
        <p className="text-center font-mono text-[11px] uppercase tracking-[0.32em] text-[#d8ccff]/80">✦ continue your little adventure ✦</p>
        <h2 className="mt-3 text-center font-serif text-3xl font-semibold text-[#fff5f9] text-glow-soft sm:text-4xl">Where to, my Doll?</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {journey.map((j) => (
            <button key={j.scene} type="button"
              onClick={() => j.locked ? showToast(j.lockMsg) : go(j.scene)}
              aria-disabled={j.locked}
              className={`glass btn-glow flex cursor-pointer items-center gap-4 rounded-[1.75rem] p-5 text-left ${j.locked ? 'opacity-75 saturate-50' : ''}`}>
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#ff8fb8]/35 to-[#8b7cf6]/35 text-[#ffdbe8]">
                {j.locked ? <Lock size={24} /> : <j.icon size={26} />}
              </span>
              <span className="min-w-0">
                <span className="block font-serif text-xl font-semibold text-white">{j.title}</span>
                <span className="block truncate text-sm text-[#e9defc]/85">{j.desc}</span>
              </span>
              <Play size={17} className="ml-auto shrink-0 text-[#ffb7d1]" />
            </button>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <button type="button" onClick={() => go('boot')} className="glass btn-glow inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-[#ffdbe8]">
            <Flower2 size={16} /> Replay the intro
          </button>
          <span className="inline-flex items-center gap-2 text-sm text-[#cdbcff]"><Armchair size={16} /> Everything here is replayable, Doll. No timers, no pressure.</span>
        </div>
        <p className="mt-8 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-[#8f83b8]/70">🎵 background music: “Lovely” · via Chosic · picked by Kulfi, for Doll</p>
      </motion.section>
    </motion.main>
  )
}
