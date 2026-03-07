import { useState, useEffect } from 'react'
import { Plus, Search, FolderOpen, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import ProjectCard from '../components/ProjectCard'
import CreateProjectModal from '../components/CreateProjectModal'
import ConfirmDialog from '../components/ConfirmDialog'
import { projectsApi } from '../api/axios'

export default function Dashboard() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const { data } = await projectsApi.getAll()
      setProjects(data)
    } catch {
      toast.error('Failed to load projects.')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (form) => {
    setCreating(true)
    try {
      const { data } = await projectsApi.create(form)
      setProjects(prev => [data, ...prev])
      setShowCreate(false)
      toast.success('Project created!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create project.')
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await projectsApi.delete(deleteTarget)
      setProjects(prev => prev.filter(p => p._id !== deleteTarget))
      toast.success('Project deleted.')
    } catch {
      toast.error('Failed to delete project.')
    } finally {
      setDeleteTarget(null)
    }
  }

  const filtered = projects.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.description?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-surface-50">
      <Navbar
        actions={
          <button onClick={() => setShowCreate(true)} className="btn-primary">
            <Plus size={15} />
            New project
          </button>
        }
      />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-2xl font-bold text-surface-900 mb-1">Projects</h1>
            <p className="text-surface-500 text-sm">{projects.length} project{projects.length !== 1 ? 's' : ''} total</p>
          </div>

          <div className="relative max-w-xs w-full">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
            <input
              type="text"
              placeholder="Search projects…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input pl-9 py-2"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 size={28} className="text-brand-600 animate-spin" />
            <span className="text-sm text-surface-400 font-medium">Loading your projects…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div className="w-16 h-16 bg-surface-100 rounded-2xl flex items-center justify-center">
              <FolderOpen size={28} className="text-surface-400" />
            </div>
            <div>
              <p className="font-semibold text-surface-700 text-lg mb-1">
                {search ? 'No projects found' : 'No projects yet'}
              </p>
              <p className="text-sm text-surface-400 max-w-xs">
                {search
                  ? `No projects match "${search}". Try a different search term.`
                  : 'Create your first project to start tracking issues with your team.'
                }
              </p>
            </div>
            {!search && (
              <button onClick={() => setShowCreate(true)} className="btn-primary mt-2">
                <Plus size={15} />
                Create first project
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-fade-in">
            {filtered.map(project => (
              <ProjectCard
                key={project._id}
                project={project}
                onDelete={id => setDeleteTarget(id)}
              />
            ))}
          </div>
        )}
      </main>

      <CreateProjectModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onCreate={handleCreate}
        loading={creating}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete project?"
        message="This will permanently delete the project and all its issues. This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
