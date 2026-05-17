import { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Sidebar   from './components/Sidebar'
import BottomNav from './components/BottomNav'
import Dashboard from './components/Dashboard'
import Journal   from './components/Journal'
import Timeline  from './components/Timeline'

const SPRING = { type: 'spring', stiffness: 380, damping: 35 }

function load() {
  try { return JSON.parse(localStorage.getItem('entries')) || [] }
  catch { return [] }
}

function BackgroundOrbs() {
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
      <div style={{
        position: 'absolute', top: '-18%', right: '-8%',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 68%)',
        filter: 'blur(40px)',
      }} />
      <div style={{
        position: 'absolute', bottom: '-18%', left: '4%',
        width: 450, height: 450, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 68%)',
        filter: 'blur(40px)',
      }} />
      <div style={{
        position: 'absolute', top: '35%', left: '-10%',
        width: 350, height: 350, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 68%)',
        filter: 'blur(40px)',
      }} />
    </div>
  )
}

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0,  transition: SPRING },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.14 } },
}

export default function App() {
  const [page,    setPage]    = useState('dashboard')
  const [entries, setEntries] = useState(load)

  const addEntry = useCallback((entry) => {
    setEntries(prev => {
      const next = [entry, ...prev]
      localStorage.setItem('entries', JSON.stringify(next))
      return next
    })
  }, [])

  const deleteEntry = useCallback((id) => {
    setEntries(prev => {
      const next = prev.filter(e => e.id !== id)
      localStorage.setItem('entries', JSON.stringify(next))
      return next
    })
  }, [])

  return (
    <div style={{ display: 'flex', height: '100dvh', overflow: 'hidden', position: 'relative' }}>
      <BackgroundOrbs />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', width: '100%', height: '100%' }}>
        {/* Sidebar — desktop only */}
        <div className="hidden md:flex">
          <Sidebar page={page} setPage={setPage} />
        </div>

        {/* Main content */}
        <main
          style={{ flex: 1, overflowY: 'auto', position: 'relative' }}
          className="pb-24 md:pb-0"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {page === 'dashboard' && <Dashboard entries={entries} />}
              {page === 'journal'   && <Journal   onAdd={e => { addEntry(e); setPage('timeline') }} />}
              {page === 'timeline'  && <Timeline  entries={entries} onDelete={deleteEntry} />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Bottom nav — mobile only */}
      <BottomNav page={page} setPage={setPage} />
    </div>
  )
}
