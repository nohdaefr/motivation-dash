import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2 } from 'lucide-react'

const SPRING = { type: 'spring', stiffness: 380, damping: 35 }

const TAG_STYLE = {
  wins:      { bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.2)',  color: '#34d399' },
  learning:  { bg: 'rgba(99,102,241,0.1)',  border: 'rgba(99,102,241,0.2)',  color: '#818cf8' },
  thoughts:  { bg: 'rgba(139,92,246,0.1)',  border: 'rgba(139,92,246,0.2)',  color: '#a78bfa' },
  goals:     { bg: 'rgba(6,182,212,0.1)',   border: 'rgba(6,182,212,0.2)',   color: '#22d3ee' },
  gratitude: { bg: 'rgba(236,72,153,0.1)',  border: 'rgba(236,72,153,0.2)',  color: '#f472b6' },
}
const TAG_LABELS = { wins: '#הצלחות', learning: '#למידה', thoughts: '#מחשבות', goals: '#יעדים', gratitude: '#הכרת תודה' }

const MONTHS = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר']

/* ── AnimatedTimeline sub-component ── */
function AnimatedTimeline({ entries, onDelete }) {
  const grouped = useMemo(() => {
    const sorted = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date))
    const map = new Map()
    sorted.forEach(entry => {
      const d     = new Date(entry.date)
      const today = new Date(); today.setHours(0,0,0,0)
      const copy  = new Date(d); copy.setHours(0,0,0,0)
      const diff  = Math.floor((today - copy) / 86400000)
      const label = diff === 0 ? 'היום' : diff === 1 ? 'אתמול' : `${d.getDate()} ב${MONTHS[d.getMonth()]}`
      if (!map.has(label)) map.set(label, [])
      map.get(label).push(entry)
    })
    return map
  }, [entries])

  return (
    <div className="relative">
      {/* vertical timeline line */}
      <div style={{
        position: 'absolute', top: 0, bottom: 0, left: 7,
        width: 1,
        background: 'linear-gradient(to bottom, rgba(99,102,241,0.3), rgba(139,92,246,0.15), transparent)'
      }} />

      <AnimatePresence mode="popLayout">
        {[...grouped.entries()].map(([dateLabel, dayEntries]) => (
          <motion.div key={dateLabel} layout transition={SPRING}>
            {/* Date divider */}
            <motion.div
              layout
              className="flex items-center gap-3 mb-3 mt-6 first:mt-0 pl-6"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            >
              <span className="text-zinc-600 text-xs font-semibold tracking-wide ml-auto">{dateLabel}</span>
              <div style={{ width: 40, height: 1, background: 'rgba(255,255,255,0.05)' }} />
            </motion.div>

            <AnimatePresence mode="popLayout">
              {dayEntries.map((entry, idx) => {
                const d = new Date(entry.date)
                const h = String(d.getHours()).padStart(2,'0')
                const m = String(d.getMinutes()).padStart(2,'0')
                const s = TAG_STYLE

                return (
                  <motion.div
                    key={entry.id}
                    layout
                    initial={{ opacity: 0, x: 20, scale: 0.97 }}
                    animate={{ opacity: 1, x: 0,  scale: 1 }}
                    exit={{ opacity: 0, x: -16, scale: 0.95, transition: { duration: 0.18 } }}
                    transition={{ ...SPRING, delay: idx * 0.04 }}
                    className="flex items-start gap-4 pl-6 mb-3"
                  >
                    {/* dot */}
                    <motion.div
                      className="flex-shrink-0 mt-3.5 z-10 relative"
                      style={{ width: 10, height: 10, borderRadius: '50%', background: '#09090b', border: '2px solid #6366f1' }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ ...SPRING, delay: 0.1 + idx * 0.04 }}
                    />

                    {/* card */}
                    <motion.div
                      layout
                      className="glass flex-1 rounded-2xl p-5 group"
                      whileHover={{ scale: 1.01, y: -2, transition: { duration: 0.2 } }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <h3 className="text-zinc-100 font-semibold text-sm mb-0.5">{entry.title}</h3>
                          <span className="text-zinc-700 text-xs">{h}:{m}</span>
                        </div>
                        {onDelete && (
                          <motion.button
                            onClick={() => onDelete(entry.id)}
                            className="p-1.5 rounded-lg"
                            style={{ color: '#52525b' }}
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1, scale: 1.1, color: '#f87171', background: 'rgba(239,68,68,0.1)' }}
                            animate={{ opacity: 0 }}
                            transition={SPRING}
                          >
                            <Trash2 size={12} />
                          </motion.button>
                        )}
                      </div>

                      <p className="text-zinc-500 text-sm leading-relaxed mb-3" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {entry.text}
                      </p>

                      {entry.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {entry.tags.map((t, ti) => {
                            const style = TAG_STYLE[t] || { bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)', color: '#71717a' }
                            return (
                              <motion.span
                                key={t}
                                className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                                style={{ background: style.bg, border: `1px solid ${style.border}`, color: style.color }}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ ...SPRING, delay: ti * 0.05 }}
                              >
                                {TAG_LABELS[t] || t}
                              </motion.span>
                            )
                          })}
                        </div>
                      )}
                    </motion.div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default function Timeline({ entries, onDelete }) {
  if (!entries.length) return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <motion.div className="mb-6 md:mb-10" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={SPRING}>
        <p className="text-zinc-600 text-sm font-medium mb-1">המסע שלך</p>
        <h1 className="text-2xl md:text-3xl font-bold text-zinc-50">ציר זמן</h1>
      </motion.div>
      <motion.div
        className="flex flex-col items-center justify-center py-28 text-center"
        initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ ...SPRING, delay: 0.1 }}
      >
        <div className="glass w-16 h-16 rounded-2xl flex items-center justify-center mb-5">
          <span className="text-2xl">📖</span>
        </div>
        <p className="text-zinc-400 font-medium mb-2">אין רשומות עדיין</p>
        <p className="text-zinc-700 text-sm">התחל לכתוב ביומן כדי לראות את ציר הזמן.</p>
      </motion.div>
    </div>
  )

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <motion.div className="mb-6 md:mb-10" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={SPRING}>
        <p className="text-zinc-600 text-sm font-medium mb-1">המסע שלך</p>
        <h1 className="text-2xl md:text-3xl font-bold text-zinc-50">ציר זמן</h1>
      </motion.div>
      <AnimatedTimeline entries={entries} onDelete={onDelete} />
    </div>
  )
}
