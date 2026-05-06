import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../features/auth/authSlice'
import './MainLayout.css'

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [theme, setTheme] = useState(() => localStorage.getItem('cave_theme') || 'light')
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    localStorage.setItem('cave_theme', next)
    document.documentElement.setAttribute('data-theme', next)
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const navItems = [
    { to: '/dashboard', icon: '📊', label: 'Dashboard' },
    { to: '/offices', icon: '🏢', label: 'Offices' },
    { to: '/forms', icon: '📝', label: 'Forms' },
    { to: '/submissions', icon: '📤', label: 'Submissions' },
    { to: '/profile', icon: '👤', label: 'Profile' },
  ]

  const adminItems = user?.role === 'Admin' ? [
    { to: '/admin/import', icon: '📥', label: 'Bulk Import' }
  ] : []



  return (
    <div className="layout">
      {/* Mobile overlay */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__header">
          <div className="sidebar__brand">
            <span className="sidebar__logo">◆</span>
            <span className="sidebar__title">CAVE-CORE</span>
          </div>
          <button className="sidebar__close" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">✕</button>
        </div>

        <nav className="sidebar__nav">
          {[...navItems, ...adminItems].map((item) => (
            <NavLink

              key={item.to}
              to={item.to}
              className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sidebar__link-icon">{item.icon}</span>
              <span className="sidebar__link-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__footer">
          <div className="sidebar__user-info">
            <div className="sidebar__avatar">{user?.email?.[0]?.toUpperCase() || 'U'}</div>
            <div className="sidebar__user-details">
              <span className="sidebar__user-email">{user?.email || 'User'}</span>
              <span className="sidebar__user-role">{user?.role || 'Viewer'}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="main-content">
        <header className="topbar glass-panel">
          <button className="topbar__menu-btn" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <span></span><span></span><span></span>
          </button>

          <div className="topbar__spacer" />

          <div className="topbar__actions">
            <button className="topbar__theme-btn" onClick={toggleTheme} aria-label="Toggle theme" title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <button className="btn btn-ghost topbar__logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
