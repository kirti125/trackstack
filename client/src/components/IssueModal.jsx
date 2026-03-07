import { useState, useEffect, useRef } from 'react'
import { X, Loader2 } from 'lucide-react'
import { PRIORITY_CONFIG } from '../utils/constants'

export default function IssueModal({ isOpen, onClose, onSubmit, issue, loading }) {
  const [form, setForm] = useState({ title: '', description: '', priority: 'Medium' })
  const titleRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setForm(issue
        ? { title: issue.title, description: issue.description || '', priority: issue.priority }
        : { title: '', description: '', priority: 'Medium' }
      )
      setTimeout(() => titleRef.current?.focus(), 50)
    }
  }, [isOpen, issue])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    onSubmit(form)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-surface-900/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-modal w-full max-w-lg animate-slide-up overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-100">
          <h2 className="font-display font-semibold text-surface-900 text-lg">
            {issue ? 'Edit issue' : 'New issue'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-surface-400 hover:text-surface-700 hover:bg-surface-100 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="label">Title <span className="text-red-400">*</span></label>
            <input
              ref={titleRef}
              type="text"
              placeholder="Short, descriptive title…"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className="input"
              maxLength={120}
            />
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              placeholder="Add more context, steps to reproduce, or expected behavior…"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={4}
              className="input resize-none"
            />
          </div>

          <div>
            <label className="label">Priority</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(PRIORITY_CONFIG).map(([p, cfg]) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, priority: p }))}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all duration-150 ${
                    form.priority === p
                      ? 'border-brand-400 bg-brand-50 text-brand-700'
                      : 'border-surface-200 text-surface-600 hover:border-surface-300 hover:bg-surface-50'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">
              Cancel
            </button>
            <button type="submit" disabled={loading || !form.title.trim()} className="btn-primary flex-1 justify-center">
              {loading ? (
                <><Loader2 size={14} className="animate-spin" /> Saving…</>
              ) : (
                issue ? 'Update issue' : 'Create issue'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
