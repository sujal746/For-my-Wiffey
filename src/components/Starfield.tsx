import { useEffect, useRef } from 'react'

type P = { x: number; y: number; r: number; phase: number; speed: number; hue: number; heart?: boolean }
type Trail = { x: number; y: number; life: number; vx: number; vy: number }

/** Canvas galaxy: twinkling stars, a few drifting hearts, and a soft cursor trail. */
export default function Starfield({ density = 1, warm = false }: { density?: number; warm?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current; if (!canvas) return
    const ctx = canvas.getContext('2d'); if (!ctx) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0, h = 0, raf = 0
    let stars: P[] = []
    const trail: Trail[] = []
    const DPR = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      w = window.innerWidth; h = window.innerHeight
      canvas.width = w * DPR; canvas.height = h * DPR
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px'
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
      const count = Math.round(((w * h) / 8500) * density)
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        r: Math.random() * 1.6 + 0.4,
        phase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 1.1,
        hue: Math.random(),
        heart: Math.random() < 0.045,
      }))
    }
    resize()
    window.addEventListener('resize', resize)

    const onMove = (e: PointerEvent) => {
      if (reduced || e.pointerType === 'touch') return
      for (let i = 0; i < 2; i++)
        trail.push({ x: e.clientX + (Math.random() - 0.5) * 14, y: e.clientY + (Math.random() - 0.5) * 14, life: 1, vx: (Math.random() - 0.5) * 0.4, vy: -0.3 - Math.random() * 0.4 })
      if (trail.length > 90) trail.splice(0, trail.length - 90)
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    const heartPath = (x: number, y: number, s: number) => {
      ctx.beginPath()
      ctx.moveTo(x, y + s * 0.9)
      ctx.bezierCurveTo(x - s * 1.4, y, x - s * 0.7, y - s * 1.1, x, y - s * 0.35)
      ctx.bezierCurveTo(x + s * 0.7, y - s * 1.1, x + s * 1.4, y, x, y + s * 0.9)
      ctx.closePath()
    }

    let t = 0
    const draw = () => {
      t += 0.016
      ctx.clearRect(0, 0, w, h)
      for (const s of stars) {
        const tw = reduced ? 0.8 : 0.55 + 0.45 * Math.sin(t * s.speed * 2 + s.phase)
        const driftY = reduced ? 0 : Math.sin(t * 0.22 + s.phase) * 3
        if (s.heart) {
          ctx.save(); ctx.globalAlpha = 0.28 + tw * 0.4
          ctx.fillStyle = warm ? '#ffb7d1' : '#ff8fb8'
          heartPath(s.x, s.y + driftY, 3.2 + s.r * 1.6); ctx.fill(); ctx.restore()
        } else {
          const col = s.hue < 0.55 ? '255,219,232' : s.hue < 0.85 ? '216,204,255' : '255,255,255'
          ctx.beginPath(); ctx.arc(s.x, s.y + driftY, s.r, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${col},${0.35 + tw * 0.6})`
          ctx.shadowColor = `rgba(${col},.9)`; ctx.shadowBlur = tw * 7; ctx.fill(); ctx.shadowBlur = 0
        }
      }
      for (let i = trail.length - 1; i >= 0; i--) {
        const p = trail[i]; p.life -= 0.022; p.x += p.vx; p.y += p.vy
        if (p.life <= 0) { trail.splice(i, 1); continue }
        ctx.beginPath(); ctx.arc(p.x, p.y, 2.4 * p.life + 0.4, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,183,209,${p.life * 0.75})`
        ctx.shadowColor = 'rgba(255,143,184,.9)'; ctx.shadowBlur = 10; ctx.fill(); ctx.shadowBlur = 0
      }
      if (!reduced) raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); window.removeEventListener('pointermove', onMove) }
  }, [density, warm])

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-0" />
}

/** Soft nebula clouds + vignette that sit behind every scene. */
export function Nebula({ warm = false }: { warm?: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ background: warm
        ? 'radial-gradient(120% 90% at 50% 0%, #3a1440 0%, #22103d 45%, #12071f 100%)'
        : 'radial-gradient(120% 90% at 50% 0%, #2c1854 0%, #180b32 48%, #0d0518 100%)' }}>
      <div className="absolute -top-32 -left-32 h-[34rem] w-[34rem] rounded-full opacity-35 blur-3xl"
        style={{ background: 'radial-gradient(circle,#ff6fa5 0%,transparent 65%)', animation: 'drift 26s ease-in-out infinite alternate' }} />
      <div className="absolute top-1/3 -right-40 h-[38rem] w-[38rem] rounded-full opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(circle,#8b7cf6 0%,transparent 65%)', animation: 'drift 32s ease-in-out infinite alternate-reverse' }} />
      <div className="absolute -bottom-48 left-1/4 h-[30rem] w-[30rem] rounded-full opacity-25 blur-3xl"
        style={{ background: 'radial-gradient(circle,#e8b4a0 0%,transparent 65%)', animation: 'drift 38s ease-in-out infinite alternate' }} />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(90% 70% at 50% 45%, transparent 55%, rgba(5,0,14,.55) 100%)' }} />
    </div>
  )
}
