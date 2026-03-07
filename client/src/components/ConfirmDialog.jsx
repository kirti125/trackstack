import { AlertTriangle, X } from 'lucide-react'

export default function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel, danger = true }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-surface-900/40 backdrop-blur-sm animate-fade-in" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-modal w-full max-w-sm animate-scale-in overflow-hidden">
        <div className="p-6">
          <div className={`w-12 h-12 rounded-2xl ${danger ? 'bg-red-100' : 'bg-amber-100'} flex items-center justify-center mb-4`}>
            <AlertTriangle size={22} className={danger ? 'text-red-600' : 'text-amber-600'} />
          </div>
          <h3 className="font-display font-semibold text-surface-900 text-lg mb-2">{title}</h3>
          <p className="text-surface-500 text-sm leading-relaxed">{message}</p>
        </div>
        <div className="flex gap-3 px-6 pb-6">
          <button onClick={onCancel} className="btn-secondary flex-1 justify-center">Cancel</button>
          <button onClick={onConfirm} className={`flex-1 justify-center ${danger ? 'btn-danger' : 'btn-primary'}`}>Confirm</button>
        </div>
      </div>
    </div>
  )
}
