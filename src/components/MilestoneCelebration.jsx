import { useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SPRING = { type: 'spring', stiffness: 380, damping: 35 }

const MILESTONES = {
  3:  { emoji: '🔥', label: '3 ימים רצופים!',  sub: 'אתה בדרך הנכונה. המשך כך.' },
  7:  { emoji: '⚡', label: 'שבוע שלם!',        sub: 'שבוע של עקביות מדהימה!' },
  14: { emoji: '🌟', label: 'שבועיים רצופים!',  sub: 'אתה מוכיח שאפשר לשנות הרגלים.' },
  30: { emoji: '🏆', label: 'חודש שלם!',        sub: 'הישג יוצא מן הכלל. גאה בך.' },
}

const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#a78bfa', '#22d3ee']

export default function MilestoneCelebration({ streak, onDismiss }) {
  const milestone = MILESTONES[streak]

  useEffect(() => {
    if (!milestone) return
    const t = setTimeout(onDismiss, 4000)
    return () => clearTimeout(t)
  }, [streak])

  const particles = useMemo(() => Array.from({ length: 20 }, (_, i) => ({
    id: i,
    color: COLORS[i % COLORS.length],
    x: (Math.random() - 0.5) * 500,
    y: -(120 + Math.random() * 220),
    size: 4 + Math.random() * 6,
    delay: i * 0.06,
    duration: 1.2 + Math.random() * 0.8,
    initialX: (Math.random() - 0.5) * 40,
  })), [streak])

  return (
    <AnimatePresence>
      {milestone && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          onClick={onDismiss}
          style={{ background: 'rgba(9,9,11,0.88)', backdropFilter: 'blur(10px)' }}
        >
          {/* Particles */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            {particles.map(p => (
              <motion.div
                key={p.id}
                className="absolute rounded-full"
                style={{ width: p.size, height: p.size, background: p.color, top: '50%', left: '50%' }}
                initial={{ x: p.initialX, y: 0, opacity: 1, scale: 1 }}
                animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.3 }}
                transition={{ duration: p.duration, delay: p.delay, ease: 'easeOut' }}
              />
            ))}
          </div>

          {/* Card */}
          <motion.div
            className="relative text-center px-12 py-10 rounded-3xl"
            style={{ background: 'rgba(24,24,27,0.9)', border: '1px solid rgba(99,102,241,0.3)', boxShadow: '0 0 60px rgba(99,102,241,0.2)' }}
            initial={{ scale: 0.6, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={SPRING}
            onClick={e => e.stopPropagation()}
          >
            <motion.div
              className="text-7xl mb-5 block"
              animate={{ scale: [1, 1.25, 1], rotate: [0, -8, 8, 0] }}
              transition={{ duration: 0.7, delay: 0.25 }}
            >
              {milestone.emoji}
            </motion.div>

            <motion.h2
              className="text-3xl font-black text-white mb-2"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING, delay: 0.2 }}
            >
              {milestone.label}
            </motion.h2>

            <motion.p
              className="text-zinc-400 text-base"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
            >
              {milestone.sub}
            </motion.p>

            <motion.div
              className="mt-6 h-1 rounded-full"
              style={{ background: 'linear-gradient(90deg, #6366f1, #06b6d4)' }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 4, ease: 'linear', delay: 0.1 }}
              style={{ originX: 1, background: 'linear-gradient(90deg, #6366f1, #06b6d4)' }}
            />
            <p className="text-zinc-600 text-xs mt-3">לחץ בכל מקום לסגירה</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
