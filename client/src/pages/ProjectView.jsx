import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { DragDropContext } from '@hello-pangea/dnd'
import toast from 'react-hot-toast'
import {
  Plus, UserPlus, ChevronLeft, Loader2, SlidersHorizontal,
  LayoutPanelLeft, Activity, Users, ArrowUpDown
} from 'lucide-react'
import Navbar from '../components/Navbar'
import KanbanColumn from '../components/KanbanColumn'
import IssueModal from '../components/IssueModal'
import ActivityLog from '../components/ActivityLog'
import ConfirmDialog from '../components/ConfirmDialog'
import AddMemberModal from '../components/AddMemberModal'
import { projectsApi, issuesApi } from '../api/axios'
import { STATUSES } from '../utils/constants'

export default function ProjectView() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [project, setProject] = useState(null)
  const [issues, setIssues] = useState([])
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [issueModal, setIssueModal] = useState({ open: false, issue: null, defaultStatus: null })
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [addMemberOpen, setAddMemberOpen] = useState(false)
  const [addingMember, setAddingMember] = useState(false)
  const [sidebarTab, setSidebarTab] = useState('activity') // 'activity' | 'members'
  const [filterPriority, setFilterPriority] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    fetchAll()
  }, [id])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [projectsRes, issuesRes] = await Promise.all([
        projectsApi.getAll(),
        issuesApi.getByProject(id),
      ])
      const proj = projectsRes.data.find(p => p._id === id)
      if (!proj) { toast.error('Project not found'); navigate('/dashboard'); return }
      setProject(proj)
      setIssues(issuesRes.data.issues || issuesRes.data || [])
    } catch {
      toast.error('Failed to load project.')
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const issuesByStatus = useCallback((status) => {
    let list = issues.filter(i => i.status === status)
    if (filterPriority) list = list.filter(i => i.priority === filterPriority)
    return list
  }, [issues, filterPriority])

  // ── Drag & Drop ──────────────────────────────────────────────────────────────
  const onDragEnd = async (result) => {
    const { draggableId, destination, source } = result
    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) return

    const newStatus = destination.droppableId
    const prevStatus = source.droppableId

    // Optimistic update
    setIssues(prev => prev.map(i => i._id === draggableId ? { ...i, status: newStatus } : i))

    try {
      await issuesApi.updateStatus(draggableId, newStatus)
      const moved = issues.find(i => i._id === draggableId)
      setActivities(prev => [{
        _id: `act-${Date.now()}`,
        actionType: 'moved',
        previousValue: prevStatus,
        newValue: newStatus,
        timestamp: new Date().toISOString(),
        userId: { name: 'You' },
      }, ...prev])
    } catch {
      // Revert
      setIssues(prev => prev.map(i => i._id === draggableId ? { ...i, status: prevStatus } : i))
      toast.error('Failed to move issue.')
    }
  }

  // ── Issue CRUD ────────────────────────────────────────────────────────────────
  const handleCreateIssue = async (form) => {
    setSaving(true)
    try {
      const { data } = await issuesApi.create({
        ...form,
        projectId: id,
        status: issueModal.defaultStatus || 'ToDo',
      })
      const newIssue = data.issue || data
      setIssues(prev => [...prev, newIssue])
      setActivities(prev => [{
        _id: `act-${Date.now()}`,
        actionType: 'created',
        timestamp: new Date().toISOString(),
        userId: { name: 'You' },
      }, ...prev])
      setIssueModal({ open: false, issue: null })
      toast.success('Issue created!')
    } catch {
      toast.error('Failed to create issue.')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateIssue = async (form) => {
    setSaving(true)
    try {
      const { data } = await issuesApi.update(issueModal.issue._id, form)
      const updated = data.issue || data
      setIssues(prev => prev.map(i => i._id === updated._id ? { ...i, ...updated } : i))
      setIssueModal({ open: false, issue: null })
      toast.success('Issue updated.')
    } catch {
      toast.error('Failed to update issue.')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteIssue = async () => {
    if (!deleteTarget) return
    try {
      await issuesApi.delete(deleteTarget)
      setIssues(prev => prev.filter(i => i._id !== deleteTarget))
      toast.success('Issue deleted.')
    } catch {
      toast.error('Failed to delete issue.')
    } finally {
      setDeleteTarget(null)
    }
  }

  const handleAssign = async (issueId, userId) => {
    try {
      const { data } = await issuesApi.assign(issueId, userId)
      const updated = data.issue || data
      setIssues(prev => prev.map(i => i._id === issueId ? { ...i, ...updated } : i))
      toast.success(userId ? 'Issue assigned.' : 'Assignment removed.')
    } catch {
      toast.error('Failed to assign issue.')
    }
  }

  const handleAddMember = async (email) => {
    setAddingMember(true)
    try {
      const { data } = await projectsApi.addMember(id, email)
      setProject(data.project || data)
      setAddMemberOpen(false)
      toast.success('Member invited!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add member.')
    } finally {
      setAddingMember(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[80vh] gap-3">
          <Loader2 size={28} className="text-brand-600 animate-spin" />
          <span className="text-sm text-surface-400 font-medium">Loading project…</span>
        </div>
      </div>
    )
  }

  const members = project?.members || []

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col">
      <Navbar
        title={project?.name}
        subtitle={`${issues.length} issue${issues.length !== 1 ? 's' : ''}`}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(v => !v)}
              className={`btn-ghost ${filterPriority || showFilters ? 'bg-brand-50 text-brand-600' : ''}`}
            >
              <SlidersHorizontal size={14} />
              <span className="hidden sm:inline">Filter</span>
              {filterPriority && (
                <span className="bg-brand-600 text-white text-[10px] px-1.5 py-0.5 rounded-full leading-none">{filterPriority}</span>
              )}
            </button>
            <button onClick={() => setSidebarOpen(v => !v)} className="btn-ghost hidden lg:inline-flex">
              <LayoutPanelLeft size={14} />
            </button>
            <button onClick={() => setAddMemberOpen(true)} className="btn-secondary">
              <UserPlus size={14} />
              <span className="hidden sm:inline">Invite</span>
            </button>
            <button
              onClick={() => setIssueModal({ open: true, issue: null, defaultStatus: 'ToDo' })}
              className="btn-primary"
            >
              <Plus size={15} />
              <span className="hidden sm:inline">New issue</span>
            </button>
          </div>
        }
      />

      {/* Filter bar */}
      {showFilters && (
        <div className="bg-white border-b border-surface-200 px-6 py-3 flex items-center gap-3 animate-slide-up">
          <ArrowUpDown size={14} className="text-surface-400" />
          <span className="text-xs font-semibold text-surface-500 uppercase tracking-wider">Priority:</span>
          {['', 'Low', 'Medium', 'High'].map(p => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                filterPriority === p
                  ? 'bg-brand-600 text-white'
                  : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
              }`}
            >
              {p || 'All'}
            </button>
          ))}
        </div>
      )}

      {/* Main workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Kanban board */}
        <div className="flex-1 overflow-x-auto">
          <div className="p-6 min-w-max">
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="flex gap-5">
                {STATUSES.map(status => (
                  <KanbanColumn
                    key={status}
                    status={status}
                    issues={issuesByStatus(status)}
                    members={members}
                    onEdit={issue => setIssueModal({ open: true, issue, defaultStatus: null })}
                    onDelete={id => setDeleteTarget(id)}
                    onAssign={handleAssign}
                    onAddIssue={status => setIssueModal({ open: true, issue: null, defaultStatus: status })}
                  />
                ))}
              </div>
            </DragDropContext>
          </div>
        </div>

        {/* Right sidebar */}
        {sidebarOpen && (
          <div className="hidden lg:flex flex-col w-72 bg-white border-l border-surface-200 animate-slide-in-right shrink-0">
            {/* Sidebar tabs */}
            <div className="flex border-b border-surface-200">
              {[
                { id: 'activity', label: 'Activity', icon: Activity },
                { id: 'members', label: `Members (${members.length})`, icon: Users },
              ].map(tab => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSidebarTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold transition-colors border-b-2 ${
                      sidebarTab === tab.id
                        ? 'border-brand-600 text-brand-600'
                        : 'border-transparent text-surface-500 hover:text-surface-700'
                    }`}
                  >
                    <Icon size={13} />
                    {tab.label}
                  </button>
                )
              })}
            </div>

            <div className="flex-1 overflow-hidden p-4">
              {sidebarTab === 'activity' ? (
                <ActivityLog activities={activities} />
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-surface-500 uppercase tracking-wider">Team members</span>
                    <button
                      onClick={() => setAddMemberOpen(true)}
                      className="p-1.5 rounded-lg text-brand-600 hover:bg-brand-50 transition-colors"
                    >
                      <UserPlus size={13} />
                    </button>
                  </div>
                  {members.length === 0 ? (
                    <div className="text-center py-8">
                      <Users size={24} className="text-surface-300 mx-auto mb-2" />
                      <p className="text-xs text-surface-400">No members yet</p>
                    </div>
                  ) : (
                    members.map((m, i) => (
                      <div key={m._id || i} className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-surface-50 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-sm font-bold shrink-0">
                          {(m.name || m.email || '?')[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-surface-900 truncate">{m.name || 'Team member'}</p>
                          <p className="text-xs text-surface-400 truncate">{m.email}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <IssueModal
        isOpen={issueModal.open}
        onClose={() => setIssueModal({ open: false, issue: null })}
        onSubmit={issueModal.issue ? handleUpdateIssue : handleCreateIssue}
        issue={issueModal.issue}
        loading={saving}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete issue?"
        message="This will permanently delete the issue and its history."
        onConfirm={handleDeleteIssue}
        onCancel={() => setDeleteTarget(null)}
      />

      <AddMemberModal
        isOpen={addMemberOpen}
        onClose={() => setAddMemberOpen(false)}
        onAdd={handleAddMember}
        loading={addingMember}
      />
    </div>
  )
}
