import { Link, Outlet, useNavigate } from '@tanstack/react-router'
import { getAuthState, logout } from '../../features/auth/auth'

export function RootLayout() {
  const navigate = useNavigate()
  const auth = getAuthState()

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: 16 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <nav style={{ display: 'flex', gap: 12 }}>
          <Link to="/">Home</Link>
          <Link to="/users">Users</Link>
          <Link to="/dashboard">Dashboard</Link>
        </nav>
        <div>
          {auth.isAuthenticated ? (
            <>
              <span style={{ marginRight: 8 }}>{auth.user?.email}</span>
              <button onClick={async () => { await logout(); await navigate({ to: '/login' }) }}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </header>
      <Outlet />
    </div>
  )
}
