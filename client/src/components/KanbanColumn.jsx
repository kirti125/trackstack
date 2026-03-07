import { Droppable, Draggable } from '@hello-pangea/dnd'
import IssueCard from './IssueCard'
import { Plus } from 'lucide-react'
import { STATUS_CONFIG } from '../utils/constants'

export default function KanbanColumn({ status, issues, members, onEdit, onDelete, onAssign, onAddIssue }) {
  const config = STATUS_CONFIG[status]

  return (
    <div className="flex flex-col w-80 shrink-0">
      {/* Column header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${config.dot}`} />
          <span className="text-sm font-semibold text-surface-700">{config.label}</span>
          <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${config.countBg} ${config.countText}`}>
            {issues.length}
          </span>
        </div>
        <button
          onClick={() => onAddIssue(status)}
          className="p-1.5 rounded-lg text-surface-400 hover:text-surface-700 hover:bg-surface-200 transition-colors"
          title="Add issue"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Droppable area */}
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 min-h-[200px] rounded-2xl p-2 space-y-2 transition-colors duration-150 ${
              snapshot.isDraggingOver
                ? 'bg-brand-50 border-2 border-dashed border-brand-200'
                : 'bg-surface-100 border-2 border-transparent'
            }`}
          >
            {issues.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex flex-col items-center justify-center py-10 gap-2 opacity-40">
                <div className={`w-8 h-8 rounded-xl ${config.emptyBg} flex items-center justify-center`}>
                  <div className={`w-3 h-3 rounded-full ${config.dot}`} />
                </div>
                <span className="text-xs text-surface-400 font-medium">No issues</span>
              </div>
            )}

            {issues.map((issue, index) => (
              <Draggable key={issue._id} draggableId={issue._id} index={index}>
                {(provided, snapshot) => (
                  <div
                    className={`transition-all duration-150 ${snapshot.isDragging ? 'rotate-1 scale-105 shadow-card-hover' : ''}`}
                  >
                    <IssueCard
                      issue={issue}
                      members={members}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onAssign={onAssign}
                      innerRef={provided.innerRef}
                      draggableProps={provided.draggableProps}
                      dragHandleProps={provided.dragHandleProps}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}
