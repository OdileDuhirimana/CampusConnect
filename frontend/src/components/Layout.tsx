import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../hooks'
import { fetchMe, logout } from '../store/authSlice'
import { useEffect, useState } from 'react'
import NotificationBell from './NotificationBell'
import { Button } from './ui'

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, token } = useAppSelector((s) => s.auth)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (token && !user) dispatch(fetchMe())
  }, [token, user, dispatch])

  const onLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'text-gray-900 font-medium' : 'text-gray-600 hover:text-gray-900'

  return (
    <div className="min-h-screen bg-gray-50">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:bg-white focus:px-3 focus:py-2 focus:rounded">
        Skip to content
      </a>
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="font-semibold text-lg text-gray-900">CampusConnect</Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <NavLink to="/" className={navLinkClass}>Feed</NavLink>
            <NavLink to="/events" className={navLinkClass}>Events</NavLink>
            <NavLink to="/chat" className={navLinkClass}>Messages</NavLink>
          </nav>
          <div className="flex items-center gap-3">
            {user ? (
              <div className="hidden md:flex items-center gap-3">
                <NotificationBell />
                <NavLink to="/profile" className="text-sm text-gray-700 hover:text-gray-900">{user.username}</NavLink>
                <NavLink to="/settings" className="text-sm text-gray-600 hover:text-gray-900">Settings</NavLink>
                <button onClick={onLogout} className="text-sm text-gray-600 hover:text-gray-900">Logout</button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3 text-sm">
                <Link to="/login" className="text-gray-700 hover:text-gray-900">Login</Link>
                <Link to="/register" className="text-white bg-brand-600 rounded px-3 py-1.5">Sign up</Link>
              </div>
            )}
            <Button
              variant="ghost"
              className="md:hidden"
              aria-label="Toggle navigation"
              onClick={() => setMobileOpen((v) => !v)}
              type="button"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </Button>
          </div>
        </div>
        {mobileOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-4 py-3 flex flex-col gap-3 text-sm">
              <NavLink to="/" className={navLinkClass} onClick={() => setMobileOpen(false)}>Feed</NavLink>
              <NavLink to="/events" className={navLinkClass} onClick={() => setMobileOpen(false)}>Events</NavLink>
              <NavLink to="/chat" className={navLinkClass} onClick={() => setMobileOpen(false)}>Messages</NavLink>
              <div className="border-t pt-3">
                {user ? (
                  <div className="flex flex-col gap-2">
                    <NavLink to="/profile" className="text-gray-700 hover:text-gray-900" onClick={() => setMobileOpen(false)}>{user.username}</NavLink>
                    <NavLink to="/settings" className="text-gray-600 hover:text-gray-900" onClick={() => setMobileOpen(false)}>Settings</NavLink>
                    <button onClick={onLogout} className="text-left text-gray-600 hover:text-gray-900">Logout</button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link to="/login" className="text-gray-700 hover:text-gray-900" onClick={() => setMobileOpen(false)}>Login</Link>
                    <Link to="/register" className="text-white bg-brand-600 rounded px-3 py-2 text-center" onClick={() => setMobileOpen(false)}>Sign up</Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
      <main id="main" className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}
