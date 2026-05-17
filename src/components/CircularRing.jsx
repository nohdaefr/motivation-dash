import { useEffect, useRef } from 'react'

export default function CircularRing({ progress, completed, total }) {
  const r    = 46
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - Math.min(progress, 1))

  return (
    <div className="relative flex items-center justify-center">
      <svg width="116" height="116" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="58" cy="58" r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="7" />
        <circle
          cx="58" cy="58" r={r} fill="none"
          stroke="url(#ring)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.34,1.56,0.64,1)' }}
        />
        <defs>
          <linearGradient id="ring" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#6366f1" />
            <stop offset="50%"  stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute text-center">
        <div className="text-xl font-black text-zinc-50">{Math.round(progress * 100)}%</div>
        <div className="text-[10px] text-zinc-600 font-medium">{completed}/{total}</div>
      </div>
    </div>
  )
}
