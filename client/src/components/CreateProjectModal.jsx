import { useState, useEffect } from 'react'
import { X, Loader2, Layers } from 'lucide-react'

export default function CreateProjectModal({ isOpen, onClose, onCreate, loading }) {
  const [form, setForm] = useState({ name: '', description: '' })

  useEffect(() => {
    if (isOpen) setForm({ name: '', description: '' })
  }, [isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    onCreate(form)
  }

  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-surface-900/40 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-modal w-full max-w-md animate-slide-up overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-100">
          <h2 className="font-display font-semibold text-surface-900 text-lg flex items-center gap-2">
            <Layers size={18} className="text-brand-600" />
            New project
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-surface-400 hover:bg-surface-100 transition-colors">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="label">Project name <span className="text-red-400">*</span></label>
            <input
              type="text"
              placeholder="e.g. Mobile App Redesign"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="input"
              autoFocus
              maxLength={80}
            />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea
              placeholder="What's this project about? (optional)"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={3}
              className="input resize-none"
            />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button type="submit" disabled={loading || !form.name.trim()} className="btn-primary flex-1 justify-center">
              {loading ? <><Loader2 size={14} className="animate-spin" /> Creating…</> : 'Create project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
