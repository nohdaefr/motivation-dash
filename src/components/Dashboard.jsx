import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, Target, BookOpen, RefreshCw, Check } from 'lucide-react'
import CircularRing from './CircularRing'
import MilestoneCelebration from './MilestoneCelebration'

const SPRING = { type: 'spring', stiffness: 380, damping: 35 }

const QUOTES = [
  { text: "הדרך היחידה לעשות עבודה נהדרת היא לאהוב את מה שאתה עושה.", author: "סטיב ג'ובס" },
  { text: "לא משנה כמה לאט אתה הולך, כל עוד אתה לא עוצר.", author: "קונפוציוס" },
  { text: "בתוך כל קושי מסתתרת הזדמנות.", author: "אלברט איינשטיין" },
  { text: "דחוף את עצמך, כי אף אחד אחר לא יעשה זאת בשבילך.", author: "אנונימי" },
  { text: "דברים גדולים לעולם לא מגיעים מאזורי נוחות.", author: "אנונימי" },
  { text: "חלום אותו. רצה אותו. עשה אותו.", author: "אנונימי" },
  { text: "הצלחה אינה סופית, כישלון אינו קטלני — האומץ להמשיך הוא שקובע.", author: "צ'רצ'יל" },
  { text: "העתיד תלוי במה שאתה עושה היום.", author: "מהטמה גנדי" },
]

const DEFAULT_GOALS = [
  { id: 1, label: 'כתוב רשומה ביומן',         done: false },
  { id: 2, label: 'חזור על מה שלמדת אתמול',   done: false },
  { id: 3, label: 'קבע סדרי עדיפויות למחר',   done: false },
  { id: 4, label: 'שקף על הצלחה אחת של היום', done: false },
]

const DAYS   = ['ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת']
const MONTHS = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר']
const MILESTONE_DAYS = new Set([3, 7, 14, 30])

/* ── DashboardStats — isolated card sub-component ── */
function StatCard({ children, delay, glowColor }) {
  return (
    <motion.div
      className="glass rounded-2xl p-5"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...SPRING, delay }}
      whileHover={{ scale: 1.01, y: -2, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.99 }}
    >
      {children}
    </motion.div>
  )
}

export default function Dashboard({ entries }) {
  const [qi,        setQi]        = useState(() => Math.floor(Math.random() * QUOTES.length))
  const [goals,     setGoals]     = useState(() => {
    try { return JSON.parse(localStorage.getItem('goals_he')) || DEFAULT_GOALS }
    catch { return DEFAULT_GOALS }
  })
  const [milestone, setMilestone] = useState(null)
  const prevStreakRef = useRef(null)

  /* ── memoized calculations ── */
  const streak = useMemo(() => {
    if (!entries.length) return 0
    let s = 0
    const day = new Date(); day.setHours(0, 0, 0, 0)
    while (true) {
      const has = entries.some(e => new Date(e.date).toDateString() === day.toDateString())
      if (!has) break
      s++; day.setDate(day.getDate() - 1)
    }
    return s
  }, [entries])

  const todayCount = useMemo(() =>
    entries.filter(e => new Date(e.date).toDateString() === new Date().toDateString()).length,
    [entries]
  )

  const weekBars = useMemo(() =>
    Array.from({ length: 7 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (6 - i))
      return entries.some(e => new Date(e.date).toDateString() === d.toDateString())
    }),
    [entries]
  )

  const completed = useMemo(() => goals.filter(g => g.done).length, [goals])
  const progress  = useMemo(() => goals.length ? completed / goals.length : 0, [completed, goals.length])

  /* ── milestone detection ── */
  useEffect(() => {
    if (prevStreakRef.current !== null && streak !== prevStreakRef.current && MILESTONE_DAYS.has(streak)) {
      setMilestone(streak)
    }
    prevStreakRef.current = streak
  }, [streak])

  /* ── handlers ── */
  const toggleGoal = useCallback((id) => {
    setGoals(prev => {
      const next = prev.map(g => g.id === id ? { ...g, done: !g.done } : g)
      localStorage.setItem('goals_he', JSON.stringify(next))
      return next
    })
  }, [])

  const now      = new Date()
  const hour     = now.getHours()
  const greeting = hour < 12 ? 'בוקר טוב' : hour < 17 ? 'צהריים טובים' : 'ערב טוב'
  const dateStr  = `יום ${DAYS[now.getDay()]}, ${now.getDate()} ב${MONTHS[now.getMonth()]} ${now.getFullYear()}`

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <AnimatePresence>
        {milestone && (
          <MilestoneCelebration streak={milestone} onDismiss={() => setMilestone(null)} />
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div className="mb-10" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={SPRING}>
        <p className="text-zinc-600 text-sm mb-1 font-medium">{dateStr}</p>
        <h1 className="text-3xl font-bold text-zinc-50">{greeting} <span className="text-2xl">👋</span></h1>
      </motion.div>

      {/* Quote */}
      <motion.div
        className="glass rounded-2xl p-6 mb-6"
        style={{ boxShadow: '0 0 40px rgba(99,102,241,0.08)' }}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING, delay: 0.06 }}
        whileHover={{ scale: 1.005, y: -1 }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'rgba(139,92,246,0.7)' }}>
              השראה יומית
            </p>
            <AnimatePresence mode="wait">
              <motion.p
                key={qi}
                className="text-zinc-200 text-lg font-medium leading-relaxed italic mb-3"
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
              >
                "{QUOTES[qi].text}"
              </motion.p>
            </AnimatePresence>
            <p className="text-zinc-600 text-sm">— {QUOTES[qi].author}</p>
          </div>
          <motion.button
            onClick={() => setQi(i => (i + 1) % QUOTES.length)}
            className="p-2 rounded-lg text-zinc-600 flex-shrink-0"
            whileHover={{ rotate: 180, scale: 1.1, color: '#818cf8' }}
            whileTap={{ scale: 0.88 }}
            transition={SPRING}
          >
            <RefreshCw size={15} />
          </motion.button>
        </div>
      </motion.div>

      {/* Stats row — DashboardStats */}
      <div className="grid grid-cols-3 gap-4 mb-5">

        <StatCard delay={0.1}>
          <div className="flex items-center gap-1.5 text-zinc-600 text-[10px] font-semibold uppercase tracking-widest mb-4">
            <Flame size={11} style={{ color: '#fb923c' }} /> רצף
          </div>
          <div className="flex items-end gap-1.5 mb-4">
            <AnimatePresence mode="wait">
              <motion.span
                key={streak}
                className="text-5xl font-black text-zinc-50 leading-none"
                initial={{ opacity: 0, scale: 1.3 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                transition={SPRING}
              >{streak}</motion.span>
            </AnimatePresence>
            <span className="text-zinc-600 text-sm mb-1">ימים</span>
          </div>
          <div className="flex gap-1">
            {weekBars.map((has, i) => (
              <motion.div
                key={i}
                className="h-1 flex-1 rounded-full"
                style={{ background: has ? '#f97316' : 'rgba(255,255,255,0.05)' }}
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                transition={{ ...SPRING, delay: 0.35 + i * 0.04 }}
                style={{ originX: 0, background: has ? '#f97316' : 'rgba(255,255,255,0.05)' }}
              />
            ))}
          </div>
        </StatCard>

        <StatCard delay={0.14}>
          <div className="flex items-center gap-1.5 text-zinc-600 text-[10px] font-semibold uppercase tracking-widest mb-3">
            <Target size={11} style={{ color: '#818cf8' }} /> יעדים
          </div>
          <div className="flex justify-center">
            <CircularRing progress={progress} completed={completed} total={goals.length} />
          </div>
        </StatCard>

        <StatCard delay={0.18}>
          <div className="flex items-center gap-1.5 text-zinc-600 text-[10px] font-semibold uppercase tracking-widest mb-4">
            <BookOpen size={11} style={{ color: '#22d3ee' }} /> רשומות
          </div>
          <div className="flex items-end gap-1.5 mb-1">
            <AnimatePresence mode="wait">
              <motion.span
                key={entries.length}
                className="text-5xl font-black text-zinc-50 leading-none"
                initial={{ opacity: 0, scale: 1.3 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                transition={SPRING}
              >{entries.length}</motion.span>
            </AnimatePresence>
            <span className="text-zinc-600 text-sm mb-1">סה"כ</span>
          </div>
          <p className="text-zinc-700 text-xs">{todayCount} היום</p>
        </StatCard>
      </div>

      {/* Goals checklist */}
      <motion.div
        className="glass rounded-2xl p-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING, delay: 0.22 }}
      >
        <p className="text-zinc-600 text-[10px] font-semibold uppercase tracking-widest mb-5">משימות היום</p>
        <AnimatePresence>
          <div className="space-y-2.5">
            {goals.map((g, i) => (
              <motion.div
                key={g.id}
                layout
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...SPRING, delay: i * 0.05 }}
                onClick={() => toggleGoal(g.id)}
                className="flex items-center gap-3 cursor-pointer group py-1 rounded-xl px-2"
                whileHover={{ x: -2, backgroundColor: 'rgba(255,255,255,0.02)' }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{
                    background: g.done ? '#6366f1' : 'transparent',
                    border: g.done ? '2px solid #6366f1' : '2px solid rgba(255,255,255,0.12)',
                  }}
                  animate={g.done ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                  transition={SPRING}
                >
                  <AnimatePresence>
                    {g.done && (
                      <motion.div
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0 }}
                        transition={SPRING}
                      >
                        <Check size={11} className="text-white" strokeWidth={3} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
                <motion.span
                  className="text-sm select-none"
                  animate={{ opacity: g.done ? 0.4 : 0.85, color: g.done ? '#71717a' : '#e4e4e7' }}
                  style={{ textDecoration: g.done ? 'line-through' : 'none' }}
                  transition={{ duration: 0.2 }}
                >
                  {g.label}
                </motion.span>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
