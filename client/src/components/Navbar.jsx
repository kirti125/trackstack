import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Layers, ChevronDown, LogOut, User, Settings, Bell } from 'lucide-react'

export default function Navbar({ title, subtitle, actions }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  return (
    <header className="bg-white border-b border-surface-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-6 h-14">
        {/* Left: Logo + breadcrumb */}
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center">
              <Layers size={14} className="text-white" />
            </div>
            <span className="font-display text-surface-900 font-bold text-sm hidden sm:block">TrackStack</span>
          </Link>

          {title && (
            <>
              <span className="text-surface-300 text-sm">/</span>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-surface-900 leading-tight">{title}</span>
                {subtitle && <span className="text-xs text-surface-400">{subtitle}</span>}
              </div>
            </>
          )}
        </div>

        {/* Right: actions + user */}
        <div className="flex items-center gap-2">
          {actions}

          <button className="btn-ghost relative p-2 rounded-lg">
            <Bell size={16} />
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(v => !v)}
              className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-surface-100 transition-colors"
            >
              <div className="w-7 h-7 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center text-xs font-bold">
                {initials}
              </div>
              <span className="text-sm font-medium text-surface-700 hidden sm:block max-w-[120px] truncate">
                {user?.name}
              </span>
              <ChevronDown size={14} className="text-surface-400" />
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-xl border border-surface-200 shadow-modal z-50 animate-scale-in overflow-hidden">
                  <div className="px-4 py-3 border-b border-surface-100">
                    <p className="text-sm font-semibold text-surface-900 truncate">{user?.name}</p>
                    <p className="text-xs text-surface-400 truncate">{user?.email}</p>
                  </div>
                  <div className="p-1.5">
                    <button className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-surface-700 rounded-lg hover:bg-surface-100 transition-colors">
                      <User size={14} className="text-surface-400" />
                      Profile
                    </button>
                    <button className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-surface-700 rounded-lg hover:bg-surface-100 transition-colors">
                      <Settings size={14} className="text-surface-400" />
                      Settings
                    </button>
                    <div className="border-t border-surface-100 my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={14} />
                      Sign out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
