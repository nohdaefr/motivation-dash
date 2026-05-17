import { motion } from 'framer-motion'
import { LayoutDashboard, BookOpen, Clock, Zap } from 'lucide-react'

const NAV = [
  { id: 'dashboard', label: 'לוח בקרה', icon: LayoutDashboard },
  { id: 'journal',   label: 'יומן',     icon: BookOpen        },
  { id: 'timeline',  label: 'ציר זמן',  icon: Clock           },
]

const SPRING = { type: 'spring', stiffness: 380, damping: 35 }

export default function Sidebar({ page, setPage }) {
  return (
    <aside
      className="glass-strong w-56 h-screen flex-shrink-0 flex flex-col relative overflow-hidden"
      style={{ borderLeft: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* subtle orb inside sidebar */}
      <div style={{
        position: 'absolute', top: '-30%', right: '-30%', width: 280, height: 280,
        background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none'
      }} />

      {/* Logo */}
      <motion.div
        className="px-5 pt-7 pb-8 relative"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING, delay: 0.05 }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            <Zap size={13} fill="white" className="text-white" />
          </div>
          <span className="text-zinc-50 font-bold text-sm tracking-tight">מומנטום</span>
        </div>
      </motion.div>

      {/* Nav */}
      <nav className="px-3 flex-1 space-y-0.5">
        <p className="px-3 text-[10px] font-semibold text-zinc-600 uppercase tracking-widest mb-3">תפריט</p>
        {NAV.map(({ id, label, icon: Icon }, i) => {
          const active = page === id
          return (
            <motion.button
              key={id}
              onClick={() => setPage(id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium relative"
              style={{ color: active ? '#a5b4fc' : '#71717a' }}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...SPRING, delay: 0.08 + i * 0.06 }}
              whileHover={{ x: -2, color: active ? '#a5b4fc' : '#d4d4d8' }}
              whileTap={{ scale: 0.97 }}
            >
              {active && (
                <motion.div
                  layoutId="nav-active-bg"
                  className="absolute inset-0 rounded-xl"
                  style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}
                  transition={SPRING}
                />
              )}
              <Icon size={15} className="relative z-10 flex-shrink-0" />
              <span className="relative z-10">{label}</span>
              {active && (
                <motion.div
                  layoutId="nav-dot"
                  className="mr-auto w-1.5 h-1.5 rounded-full relative z-10"
                  style={{ background: '#818cf8' }}
                  transition={SPRING}
                />
              )}
            </motion.button>
          )
        })}
      </nav>

      {/* Footer card */}
      <motion.div
        className="px-4 pb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div
          className="rounded-xl p-4"
          style={{ background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.15)' }}
        >
          <p className="text-xs text-zinc-300 font-medium mb-1">תהיה עקבי</p>
          <p className="text-[11px] text-zinc-600 leading-relaxed">כל רשומה בונה את המסע שלך.</p>
        </div>
      </motion.div>
    </aside>
  )
}
