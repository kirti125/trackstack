import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Layers, ArrowRight, AlertCircle } from 'lucide-react'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return }
    setLoading(true)
    try {
      await login(form.email, form.password)
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface-50 flex">
      {/* Left Panel */}
      <div className="hidden lg:flex w-1/2 bg-surface-950 relative overflow-hidden flex-col justify-between p-12">
        {/* Decorative grid */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />
        {/* Glow */}
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-brand-600 rounded-full blur-3xl opacity-20" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 bg-brand-500 rounded-xl flex items-center justify-center">
              <Layers size={16} className="text-white" />
            </div>
            <span className="font-display text-white font-bold text-lg tracking-tight">TrackStack</span>
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h1 className="font-display text-5xl font-bold text-white leading-tight mb-4">
              Ship better<br />software, faster.
            </h1>
            <p className="text-surface-400 text-lg leading-relaxed max-w-sm">
              The modern issue tracker your team actually wants to use. Kanban-first, distraction-free.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Issues Tracked', value: '12,400+' },
              { label: 'Teams Using', value: '340+' },
              { label: 'Avg Resolution', value: '2.4 days' },
              { label: 'Uptime', value: '99.9%' },
            ].map(s => (
              <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="font-display text-2xl font-bold text-white mb-0.5">{s.value}</div>
                <div className="text-xs text-surface-400 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-surface-500 text-sm">
          © {new Date().getFullYear()} TrackStack. Built for modern teams.
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-10 lg:hidden">
            <div className="w-8 h-8 bg-brand-600 rounded-xl flex items-center justify-center">
              <Layers size={16} className="text-white" />
            </div>
            <span className="font-display text-surface-900 font-bold text-lg">TrackStack</span>
          </div>

          <div className="mb-8">
            <h2 className="font-display text-3xl font-bold text-surface-900 mb-2">Sign in</h2>
            <p className="text-surface-500 text-sm">Welcome back. Enter your credentials to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2.5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm animate-scale-in">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="label">Email address</label>
              <input
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPw ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  className="input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-base">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign in <ArrowRight size={16} />
                </span>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-surface-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-600 font-semibold hover:text-brand-700 transition-colors">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
