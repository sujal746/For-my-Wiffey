import { motion } from 'framer-motion'

export type Mood = 'idle' | 'wave' | 'hug' | 'happy' | 'shy' | 'sleepy' | 'love'

/** Nova — Doll's tiny star companion. Pure SVG, blinks, bobs, waves, hugs. */
export default function Companion({ mood = 'idle', size = 150, onClick, label }: {
  mood?: Mood; size?: number; onClick?: () => void; label?: string
}) {
  const happy = mood === 'happy' || mood === 'love'
  const closed = mood === 'sleepy' || mood === 'hug'
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={label || 'Nova, your little companion. Tap her!'}
      className="relative shrink-0 cursor-pointer rounded-full bg-transparent p-0"
      style={{ width: size, height: size }}
      animate={{ y: [0, -10, 0], rotate: [0, -1.5, 1.5, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.05 }}
    >
      <svg viewBox="0 0 200 200" className="h-full w-full drop-shadow-[0_0_28px_rgba(255,143,184,0.5)]" role="img" aria-hidden>
        <defs>
          <radialGradient id="nova-body" cx="38%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#ffe4ef" /><stop offset="45%" stopColor="#ffb7d1" /><stop offset="100%" stopColor="#d9b8ff" />
          </radialGradient>
          <linearGradient id="nova-bow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ff8fb8" /><stop offset="100%" stopColor="#ff5f9e" />
          </linearGradient>
        </defs>

        {/* sparkles around */}
        <g fill="#ffe9a8">
          <path d="M22 62l2.4 6 6 2.4-6 2.4L22 79l-2.4-6.2-6-2.4 6-2.4z" className="anim-twinkle" />
          <path d="M176 46l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" className="anim-twinkle" style={{ animationDelay: '.7s' }} />
          <path d="M168 138l1.7 4.4 4.4 1.7-4.4 1.7-1.7 4.4-1.7-4.4-4.4-1.7 4.4-1.7z" className="anim-twinkle" style={{ animationDelay: '1.3s' }} />
        </g>

        {/* arms (behind body) */}
        {mood === 'hug' ? (
          <g stroke="#f79ec2" strokeWidth="13" strokeLinecap="round" fill="none">
            <path d="M58 118 Q38 138 62 152" /><path d="M142 118 Q162 138 138 152" />
          </g>
        ) : mood === 'wave' ? (
          <g stroke="#f79ec2" strokeWidth="13" strokeLinecap="round" fill="none">
            <path d="M52 122 Q34 130 36 146" />
            <motion.path d="M148 116 Q168 96 164 74" animate={{ rotate: [0, -14, 0] }} transition={{ duration: 1.1, repeat: Infinity }} style={{ originX: '148px', originY: '116px' }} />
          </g>
        ) : (
          <g stroke="#f79ec2" strokeWidth="13" strokeLinecap="round" fill="none">
            <path d="M52 122 Q34 130 36 146" /><path d="M148 122 Q166 130 164 146" />
          </g>
        )}

        {/* star body */}
        <path d="M100 14 L121 66 L176 70 L133 106 L145 161 L100 132 L55 161 L67 106 L24 70 L79 66 Z"
          fill="url(#nova-body)" stroke="#fff0f6" strokeWidth="4" strokeLinejoin="round" />

        {/* blush */}
        <ellipse cx="66" cy="112" rx="11" ry="6" fill="#ff7eb0" opacity={mood === 'shy' ? 0.95 : 0.55} />
        <ellipse cx="134" cy="112" rx="11" ry="6" fill="#ff7eb0" opacity={mood === 'shy' ? 0.95 : 0.55} />

        {/* eyes */}
        {closed ? (
          <g stroke="#7c2d52" strokeWidth="4.5" strokeLinecap="round" fill="none">
            <path d="M62 96 Q74 104 86 96" /><path d="M114 96 Q126 104 138 96" />
          </g>
        ) : happy ? (
          <g stroke="#7c2d52" strokeWidth="4.5" strokeLinecap="round" fill="none">
            <path d="M62 100 Q74 88 86 100" /><path d="M114 100 Q126 88 138 100" />
          </g>
        ) : (
          <g>
            <g className="eye"><ellipse cx="74" cy="97" rx="8.5" ry="11" fill="#571f3d" /><circle cx="77" cy="92" r="3.2" fill="#fff" /><circle cx="71" cy="101" r="1.6" fill="#ffdbe8" /></g>
            <g className="eye"><ellipse cx="126" cy="97" rx="8.5" ry="11" fill="#571f3d" /><circle cx="129" cy="92" r="3.2" fill="#fff" /><circle cx="123" cy="101" r="1.6" fill="#ffdbe8" /></g>
          </g>
        )}

        {/* mouth */}
        {mood === 'hug' || mood === 'sleepy'
          ? <path d="M92 118 Q100 124 108 118" stroke="#7c2d52" strokeWidth="4" strokeLinecap="round" fill="none" />
          : mood === 'happy' || mood === 'love'
          ? <path d="M88 114 Q100 128 112 114 Q100 120 88 114Z" fill="#a63d68" stroke="#7c2d52" strokeWidth="3" strokeLinejoin="round" />
          : <path d="M91 116 Q100 124 109 116" stroke="#7c2d52" strokeWidth="4" strokeLinecap="round" fill="none" />}

        {/* heart on chest for love/hug */}
        {(mood === 'love' || mood === 'hug') && (
          <path d="M100 142 c-3-6-14-6-14 2 0 6 8 9 14 14 6-5 14-8 14-14 0-8-11-8-14-2z" fill="#ff5f9e" className="anim-floaty-sm" />
        )}

        {/* bow */}
        <g transform="translate(138 34) rotate(18)">
          <path d="M0 0 L-17 -9 Q-21 0 -17 9 Z" fill="url(#nova-bow)" />
          <path d="M0 0 L17 -9 Q21 0 17 9 Z" fill="url(#nova-bow)" />
          <circle r="5.5" fill="#ff5f9e" stroke="#ffdbe8" strokeWidth="1.6" />
        </g>
      </svg>
    </motion.button>
  )
}
