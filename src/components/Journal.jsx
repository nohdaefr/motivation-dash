import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Hash } from 'lucide-react'

const SPRING = { type: 'spring', stiffness: 380, damping: 35 }

const TAGS = [
  { id: 'wins',      label: '#הצלחות',    bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.25)',  text: '#34d399' },
  { id: 'learning',  label: '#למידה',     bg: 'rgba(99,102,241,0.1)',  border: 'rgba(99,102,241,0.25)',  text: '#818cf8' },
  { id: 'thoughts',  label: '#מחשבות',   bg: 'rgba(139,92,246,0.1)',  border: 'rgba(139,92,246,0.25)',  text: '#a78bfa' },
  { id: 'goals',     label: '#יעדים',     bg: 'rgba(6,182,212,0.1)',   border: 'rgba(6,182,212,0.25)',   text: '#22d3ee' },
  { id: 'gratitude', label: '#הכרת תודה', bg: 'rgba(236,72,153,0.1)',  border: 'rgba(236,72,153,0.25)',  text: '#f472b6' },
]

/* ── JournalEditor — isolated state, zero re-render leakage ── */
function JournalEditor({ onSubmit }) {
  const [text,    setText]    = useState('')
  const [title,   setTitle]   = useState('')
  const [selTags, setSelTags] = useState([])
  const [done,    setDone]    = useState(false)
  const textareaRef           = useRef(null)

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length

  const toggleTag = useCallback((id) => {
    setSelTags(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id])
  }, [])

  const handleSubmit = useCallback(() => {
    if (!text.trim()) return
    onSubmit({ title: title.trim() || 'ללא כותרת', text: text.trim(), tags: selTags })
    setText(''); setTitle(''); setSelTags([])
    setDone(true); setTimeout(() => setDone(false), 2500)
  }, [text, title, selTags, onSubmit])

  /* ── Ctrl+Enter / Meta+Enter keyboard shortcut ── */
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') handleSubmit()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleSubmit])

  return (
    <div className="space-y-4">
      {/* Title */}
      <motion.div
        className="glass rounded-2xl px-5 py-4"
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING, delay: 0.06 }}
        whileHover={{ borderColor: 'rgba(255,255,255,0.1)' }}
      >
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="כותרת הרשומה (אופציונלי)"
          maxLength={80}
          className="w-full bg-transparent text-zinc-50 text-lg font-semibold placeholder-zinc-700 text-right"
          style={{ border: 'none', outline: 'none' }}
        />
      </motion.div>

      {/* Tags */}
      <motion.div
        className="glass rounded-2xl p-5"
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING, delay: 0.10 }}
      >
        <div className="flex items-center gap-2 text-zinc-600 text-[10px] font-semibold uppercase tracking-widest mb-4">
          <Hash size={10} /> תייג את הרשומה
        </div>
        <div className="flex flex-wrap gap-2">
          {TAGS.map((t, i) => {
            const active = selTags.includes(t.id)
            return (
              <motion.button
                key={t.id}
                type="button"
                onClick={() => toggleTag(t.id)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{
                  background: active ? t.bg  : 'rgba(255,255,255,0.04)',
                  border:     `1px solid ${active ? t.border : 'rgba(255,255,255,0.07)'}`,
                  color:      active ? t.text : '#52525b',
                }}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ ...SPRING, delay: 0.12 + i * 0.04 }}
                whileHover={{ scale: 1.06, y: -1 }}
                whileTap={{ scale: 0.94 }}
              >
                {t.label}
              </motion.button>
            )
          })}
        </div>
      </motion.div>

      {/* Textarea */}
      <motion.div
        className="glass rounded-2xl p-5"
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING, delay: 0.14 }}
      >
        <textarea
          ref={textareaRef}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="מה עובר עליך? תעד הצלחות, למידות, או מחשבות..."
          rows={10}
          className="w-full bg-transparent text-zinc-300 text-sm leading-relaxed placeholder-zinc-700 resize-none text-right"
          style={{ border: 'none', outline: 'none' }}
        />
        <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <span className="text-zinc-700 text-xs">{text.length} תווים</span>
          <span className="text-zinc-700 text-xs">{wordCount} מילים</span>
        </div>
      </motion.div>

      {/* Submit */}
      <motion.button
        type="button"
        onClick={handleSubmit}
        disabled={!text.trim()}
        className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-semibold text-sm"
        style={done ? {
          background: 'rgba(16,185,129,0.12)', color: '#34d399', border: '1px solid rgba(16,185,129,0.25)'
        } : text.trim() ? {
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff',
          boxShadow: '0 4px 24px rgba(99,102,241,0.3)', border: 'none'
        } : {
          background: 'rgba(255,255,255,0.04)', color: '#52525b',
          border: '1px solid rgba(255,255,255,0.06)', cursor: 'not-allowed'
        }}
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING, delay: 0.18 }}
        whileHover={text.trim() && !done ? { scale: 1.01, y: -2, boxShadow: '0 8px 32px rgba(99,102,241,0.4)' } : {}}
        whileTap={text.trim() && !done ? { scale: 0.99 } : {}}
      >
        <AnimatePresence mode="wait">
          {done ? (
            <motion.span key="done" className="flex items-center gap-2"
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              transition={SPRING}
            >✓ נשמר בהצלחה!</motion.span>
          ) : (
            <motion.span key="save" className="flex items-center gap-2"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            ><Send size={14} /> שמור רשומה</motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <p className="text-center text-zinc-700 text-xs">
        Ctrl + Enter לשמירה מהירה
      </p>
    </div>
  )
}

/* ── Journal page ── */
export default function Journal({ onAdd }) {
  const handleSave = useCallback((data) => {
    onAdd({ ...data, id: Date.now(), date: new Date().toISOString() })
  }, [onAdd])

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <motion.div className="mb-10" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={SPRING}>
        <p className="text-zinc-600 text-sm font-medium mb-1">תעד את המחשבות שלך</p>
        <h1 className="text-3xl font-bold text-zinc-50">רשומה חדשה</h1>
      </motion.div>
      <JournalEditor onSubmit={handleSave} />
    </div>
  )
}
