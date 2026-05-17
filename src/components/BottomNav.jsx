import { motion } from 'framer-motion'
import { LayoutDashboard, BookOpen, Clock } from 'lucide-react'

const NAV = [
  { id: 'dashboard', label: 'לוח בקרה', icon: LayoutDashboard },
  { id: 'journal',   label: 'יומן',     icon: BookOpen        },
  { id: 'timeline',  label: 'ציר זמן',  icon: Clock           },
]

const SPRING = { type: 'spring', stiffness: 380, damping: 35 }

export default function BottomNav({ page, setPage }) {
  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 md:hidden"
      style={{
        background: 'rgba(9,9,11,0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="flex items-center justify-around px-2 py-2">
        {NAV.map(({ id, label, icon: Icon }) => {
          const active = page === id
          return (
            <motion.button
              key={id}
              onClick={() => setPage(id)}
              className="flex flex-col items-center gap-1 px-5 py-2 rounded-2xl relative min-w-[64px]"
              whileTap={{ scale: 0.92 }}
              transition={SPRING}
            >
              {active && (
                <motion.div
                  layoutId="bottom-active"
                  className="absolute inset-0 rounded-2xl"
                  style={{ background: 'rgba(99,102,241,0.12)' }}
                  transition={SPRING}
                />
              )}
              <Icon
                size={22}
                className="relative z-10"
                style={{ color: active ? '#818cf8' : '#52525b' }}
              />
              <span
                className="text-[10px] font-semibold relative z-10"
                style={{ color: active ? '#818cf8' : '#52525b' }}
              >
                {label}
              </span>
            </motion.button>
          )
        })}
      </div>
    </nav>
  )
}
