import { formatDistanceToNow } from 'date-fns'
import { Activity, ArrowRight, UserPlus, Plus, Pencil, Trash2, MoveRight } from 'lucide-react'

const ACTION_CONFIG = {
  created: { icon: Plus, color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'created' },
  moved: { icon: MoveRight, color: 'text-blue-600', bg: 'bg-blue-50', label: 'moved' },
  assigned: { icon: UserPlus, color: 'text-violet-600', bg: 'bg-violet-50', label: 'assigned' },
  updated: { icon: Pencil, color: 'text-amber-600', bg: 'bg-amber-50', label: 'updated' },
  deleted: { icon: Trash2, color: 'text-red-600', bg: 'bg-red-50', label: 'deleted' },
}

export default function ActivityLog({ activities = [], loading }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4 px-1">
        <Activity size={15} className="text-surface-500" />
        <span className="text-sm font-semibold text-surface-700">Activity</span>
        {activities.length > 0 && (
          <span className="ml-auto text-xs bg-surface-100 text-surface-500 px-2 py-0.5 rounded-full font-medium">
            {activities.length}
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : activities.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center py-8">
          <div className="w-10 h-10 bg-surface-100 rounded-xl flex items-center justify-center">
            <Activity size={18} className="text-surface-400" />
          </div>
          <p className="text-sm text-surface-400 font-medium">No activity yet</p>
          <p className="text-xs text-surface-300">Actions will appear here</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-1 -mr-1 pr-1">
          {activities.map((a, i) => {
            const cfg = ACTION_CONFIG[a.actionType] || ACTION_CONFIG.updated
            const Icon = cfg.icon

            return (
              <div key={a._id || i} className="flex gap-2.5 p-2.5 rounded-xl hover:bg-surface-50 transition-colors animate-fade-in">
                <div className={`w-7 h-7 rounded-lg ${cfg.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                  <Icon size={13} className={cfg.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-surface-700 leading-snug">
                    <span className="font-semibold">{a.userId?.name || 'Someone'}</span>
                    {' '}{cfg.label}{' '}
                    {a.actionType === 'moved' && a.previousValue && a.newValue ? (
                      <span className="inline-flex items-center gap-1">
                        <span className="font-mono text-[10px] bg-surface-100 px-1 rounded">{a.previousValue}</span>
                        <ArrowRight size={10} className="text-surface-400" />
                        <span className="font-mono text-[10px] bg-surface-100 px-1 rounded">{a.newValue}</span>
                      </span>
                    ) : null}
                    {a.actionType === 'assigned' && a.newValue ? (
                      <span>to <span className="font-semibold">{a.newValue}</span></span>
                    ) : null}
                  </p>
                  <p className="text-[11px] text-surface-400 mt-0.5">
                    {a.timestamp ? formatDistanceToNow(new Date(a.timestamp), { addSuffix: true }) : ''}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
