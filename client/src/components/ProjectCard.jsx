import { useNavigate } from 'react-router-dom'
import { Users, ArrowUpRight, Trash2, MoreHorizontal, Layers } from 'lucide-react'
import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'

export default function ProjectCard({ project, onDelete }) {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const colors = [
    'from-blue-500 to-indigo-600',
    'from-violet-500 to-purple-600',
    'from-emerald-500 to-teal-600',
    'from-orange-500 to-amber-600',
    'from-rose-500 to-pink-600',
    'from-cyan-500 to-sky-600',
  ]
  // Deterministic color based on project name
  const colorIdx = project.name?.charCodeAt(0) % colors.length || 0
  const gradient = colors[colorIdx]

  return (
    <div
      className="card group hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden"
      onClick={() => navigate(`/project/${project._id}`)}
    >
      {/* Color stripe */}
      <div className={`h-1.5 bg-gradient-to-r ${gradient}`} />

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0`}>
            <Layers size={16} className="text-white" />
          </div>

          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setMenuOpen(v => !v) }}
              className="p-1.5 rounded-lg text-surface-400 hover:text-surface-700 hover:bg-surface-100 opacity-0 group-hover:opacity-100 transition-all"
            >
              <MoreHorizontal size={15} />
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setMenuOpen(false) }} />
                <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-xl border border-surface-200 shadow-modal z-50 animate-scale-in overflow-hidden p-1.5">
                  <button
                    onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onDelete(project._id) }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={13} />
                    Delete project
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <h3 className="font-semibold text-surface-900 text-base mb-1.5 group-hover:text-brand-600 transition-colors line-clamp-1">
          {project.name}
        </h3>
        <p className="text-surface-500 text-sm leading-relaxed line-clamp-2 mb-4 min-h-[2.5rem]">
          {project.description || 'No description provided.'}
        </p>

        <div className="flex items-center justify-between text-xs text-surface-400">
          <div className="flex items-center gap-1.5">
            <div className="flex -space-x-1.5">
              {(project.members || []).slice(0, 3).map((m, i) => (
                <div
                  key={i}
                  className="w-5 h-5 rounded-full bg-surface-200 border-2 border-white flex items-center justify-center text-[9px] font-bold text-surface-600"
                >
                  {(m.name || m.email || '?')[0].toUpperCase()}
                </div>
              ))}
            </div>
            <span className="flex items-center gap-1">
              <Users size={11} />
              {project.members?.length || 0} member{project.members?.length !== 1 ? 's' : ''}
            </span>
          </div>
          <span>
            {project.createdAt ? formatDistanceToNow(new Date(project.createdAt), { addSuffix: true }) : ''}
          </span>
        </div>
      </div>

      <div className="px-5 py-3 border-t border-surface-100 flex items-center justify-between">
        <span className="text-xs font-medium text-surface-400">Open project</span>
        <ArrowUpRight size={14} className="text-surface-400 group-hover:text-brand-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
      </div>
    </div>
  )
}
