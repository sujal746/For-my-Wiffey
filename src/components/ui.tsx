import { useEffect, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart, Sparkles, X } from 'lucide-react'
import { sfxPop } from '../lib/sound'

export function GlowButton({ children, onClick, variant = 'pink', className = '', ariaLabel }: {
  children: ReactNode; onClick: () => void; variant?: 'pink' | 'ghost' | 'lav'; className?: string; ariaLabel?: string
}) {
  const styles = variant === 'pink'
    ? 'bg-gradient-to-r from-[#ff6fa5] via-[#ff8fb8] to-[#c4a1fd] text-white shadow-[0_10px_36px_rgba(255,111,165,.5)]'
    : variant === 'lav'
    ? 'bg-gradient-to-r from-[#8b7cf6] to-[#c4b5fd] text-white shadow-[0_10px_36px_rgba(139,124,246,.45)]'
    : 'glass text-[#ffdbe8] hover:bg-white/10'
  return (
    <motion.button type="button" aria-label={ariaLabel}
      onClick={() => { sfxPop(); onClick() }}
      whileTap={{ scale: 0.95 }}
      className={`btn-glow inline-flex min-h-[48px] cursor-pointer items-center justify-center gap-2 rounded-full px-7 py-3 text-[15px] font-bold tracking-wide ${styles} ${className}`}>
      {children}
    </motion.button>
  )
}

export function BackButton({ onClick, label = 'Back to our universe' }: { onClick: () => void; label?: string }) {
  return (
    <button type="button" onClick={() => { sfxPop(); onClick() }}
      className="glass btn-glow inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-[#ffdbe8]">
      ← {label}
    </button>
  )
}

/** Floating hearts burst / rain */
export function HeartsRain({ count = 26, show }: { count?: number; show: boolean }) {
  const [hearts] = useState(() => Array.from({ length: count }, (_, i) => ({
    id: i, left: Math.random() * 100, delay: Math.random() * 1.6, dur: 3.4 + Math.random() * 2.6,
    size: 13 + Math.random() * 22, color: ['#ff8fb8', '#ffb7d1', '#ff6fa5', '#e9d5ff', '#fda4af'][i % 5],
  })))
  if (!show) return null
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      {hearts.map(h => (
        <span key={h.id} className="absolute bottom-[-6vh]" style={{ left: `${h.left}%`, animation: `heart-rise ${h.dur}s ease-in ${h.delay}s both` }}>
          <Heart size={h.size} fill={h.color} color={h.color} style={{ filter: 'drop-shadow(0 0 8px rgba(255,143,184,.8))' }} />
        </span>
      ))}
    </div>
  )
}

/** Click sparkle burst at a point */
export function Burst({ trigger }: { trigger: number }) {
  const parts = Array.from({ length: 10 }, (_, i) => i)
  return (
    <AnimatePresence>
      {trigger > 0 && (
        <motion.span key={trigger} aria-hidden className="pointer-events-none absolute inset-0 z-20 grid place-items-center"
          initial={{ opacity: 1 }} animate={{ opacity: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.85 }}>
          {parts.map(i => {
            const a = (i / parts.length) * Math.PI * 2
            return (
              <motion.span key={i} className="absolute text-[#ffb7d1]"
                initial={{ x: 0, y: 0, scale: 0.4, opacity: 1 }}
                animate={{ x: Math.cos(a) * 74, y: Math.sin(a) * 74, scale: 1.1, opacity: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}>
                {i % 3 === 0 ? <Heart size={13} fill="currentColor" /> : <Sparkles size={13} />}
              </motion.span>
            )
          })}
        </motion.span>
      )}
    </AnimatePresence>
  )
}

/** Easter-egg / companion toast */
export function Toast({ msg, onClose }: { msg: string | null; onClose: () => void }) {
  useEffect(() => { if (!msg) return; const id = setTimeout(onClose, 4600); return () => clearTimeout(id) }, [msg, onClose])
  return (
    <AnimatePresence>
      {msg && (
        <motion.div role="status" initial={{ opacity: 0, y: 24, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.97 }}
          className="glass fixed left-1/2 top-[max(1rem,env(safe-area-inset-top))] z-[80] flex w-[min(92vw,30rem)] -translate-x-1/2 items-start gap-3 rounded-3xl px-5 py-4">
          <span className="mt-0.5 text-[#ff8fb8]"><Sparkles size={20} /></span>
          <p className="flex-1 font-serif text-[17px] leading-snug text-[#fff0f6]">{msg}</p>
          <button type="button" onClick={onClose} aria-label="Dismiss message" className="cursor-pointer rounded-full p-1 text-[#ffb7d1] hover:bg-white/10"><X size={16} /></button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function SceneShell({ children, warm = false }: { children: ReactNode; warm?: boolean }) {
  return (
    <motion.main initial={{ opacity: 0, scale: 0.985, filter: 'blur(6px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 1.015, filter: 'blur(6px)' }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className={`relative z-10 mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-4 pb-28 pt-20 sm:px-6 ${warm ? '' : ''}`}>
      {children}
    </motion.main>
  )
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-center font-mono text-[11px] font-medium uppercase tracking-[0.32em] text-[#d8ccff]/80">{children}</p>
}
export function SceneTitle({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <h2 className={`text-center font-serif text-4xl font-semibold leading-tight text-[#fff5f9] text-glow-soft sm:text-5xl ${className}`}>{children}</h2>
}
