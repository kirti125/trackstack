export const STATUSES = ['ToDo', 'InProgress', 'Done']

export const STATUS_CONFIG = {
  ToDo: {
    label: 'To Do',
    dot: 'bg-surface-400',
    countBg: 'bg-surface-200',
    countText: 'text-surface-600',
    emptyBg: 'bg-surface-200',
  },
  InProgress: {
    label: 'In Progress',
    dot: 'bg-amber-400',
    countBg: 'bg-amber-100',
    countText: 'text-amber-700',
    emptyBg: 'bg-amber-100',
  },
  Done: {
    label: 'Done',
    dot: 'bg-emerald-500',
    countBg: 'bg-emerald-100',
    countText: 'text-emerald-700',
    emptyBg: 'bg-emerald-100',
  },
}

export const PRIORITY_CONFIG = {
  Low: {
    badge: 'badge-low',
    dot: 'bg-blue-400',
  },
  Medium: {
    badge: 'badge-medium',
    dot: 'bg-amber-400',
  },
  High: {
    badge: 'badge-high',
    dot: 'bg-red-500',
  },
}
