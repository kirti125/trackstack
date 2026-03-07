import { useState } from 'react'
import { MoreHorizontal, Pencil, Trash2, UserPlus, Tag } from 'lucide-react'
import { PRIORITY_CONFIG } from '../utils/constants'

export default function IssueCard({ issue, members = [], onEdit, onDelete, onAssign, draggableProps, dragHandleProps, innerRef }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [assignOpen, setAssignOpen] = useState(false)

  const priority = PRIORITY_CONFIG[issue.priority] || PRIORITY_CONFIG.Medium
  const assignee = issue.assignedTo

  return (
    <div
      ref={innerRef}
      {...draggableProps}
      {...dragHandleProps}
      className="bg-white rounded-xl border border-surface-200 shadow-card hover:shadow-card-hover hover:border-surface-300 transition-all duration-150 group"
    >
      <div className="p-3.5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className={`${priority.badge} shrink-0 mt-0.5`}>
            <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
            {issue.priority}
          </span>

          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setMenuOpen(v => !v); setAssignOpen(false) }}
              className="p-1 rounded-md text-surface-300 hover:text-surface-600 hover:bg-surface-100 opacity-0 group-hover:opacity-100 transition-all"
            >
              <MoreHorizontal size={14} />
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl border border-surface-200 shadow-modal z-50 animate-scale-in overflow-hidden p-1.5">
                  <button
                    onClick={() => { setMenuOpen(false); setAssignOpen(true) }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-surface-700 rounded-lg hover:bg-surface-100 transition-colors"
                  >
                    <UserPlus size={13} />
                    Assign to…
                  </button>
                  <button
                    onClick={() => { setMenuOpen(false); onEdit(issue) }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-surface-700 rounded-lg hover:bg-surface-100 transition-colors"
                  >
                    <Pencil size={13} />
                    Edit issue
                  </button>
                  <div className="border-t border-surface-100 my-1" />
                  <button
                    onClick={() => { setMenuOpen(false); onDelete(issue._id) }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={13} />
                    Delete issue
                  </button>
                </div>
              </>
            )}

            {/* Assign submenu */}
            {assignOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setAssignOpen(false)} />
                <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl border border-surface-200 shadow-modal z-50 animate-scale-in overflow-hidden p-1.5">
                  <p className="px-3 py-1.5 text-xs font-semibold text-surface-400 uppercase tracking-wider">Assign to</p>
                  <button
                    onClick={() => { setAssignOpen(false); onAssign(issue._id, null) }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-surface-600 rounded-lg hover:bg-surface-100 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-surface-200 flex items-center justify-center">
                      <UserPlus size={11} className="text-surface-400" />
                    </div>
                    Unassigned
                  </button>
                  {members.map(m => (
                    <button
                      key={m._id || m.id}
                      onClick={() => { setAssignOpen(false); onAssign(issue._id, m._id || m.id) }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-surface-700 rounded-lg hover:bg-surface-100 transition-colors"
                    >
                      <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold shrink-0">
                        {(m.name || m.email || '?')[0].toUpperCase()}
                      </div>
                      <span className="truncate">{m.name || m.email}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Title */}
        <p className="text-sm font-medium text-surface-900 leading-snug mb-3 line-clamp-2">
          {issue.title}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-surface-400">
            <Tag size={11} />
            <span className="font-mono text-[11px]">#{issue._id?.slice(-4)?.toUpperCase()}</span>
          </div>

          {assignee ? (
            <div
              className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold"
              title={assignee.name || assignee.email}
            >
              {(assignee.name || assignee.email || '?')[0].toUpperCase()}
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full border-2 border-dashed border-surface-200 flex items-center justify-center" title="Unassigned">
              <UserPlus size={10} className="text-surface-300" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
