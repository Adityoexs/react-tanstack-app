import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { login } from '../features/auth/auth'
import { useToast } from '../shared/lib/toast'

export const Route = createFileRoute('/login')({
  validateSearch: (s: Record<string, unknown>) => ({
    redirect: typeof s.redirect === 'string' ? s.redirect : '/dashboard',
  }),
  component: LoginPage,
})

function LoginPage() {
  const navigate = Route.useNavigate()
  const search = Route.useSearch()
  const toast = useToast()
  const [email, setEmail] = useState('demo@site.com')
  const [password, setPassword] = useState('password')
  const [loading, setLoading] = useState(false)

  return (
    <section style={{ maxWidth: 360 }}>
      <h2>Login</h2>
      <form onSubmit={async (e) => {
        e.preventDefault()
        try {
          setLoading(true)
          await login(email, password)
          toast.success('Logged in')
          await navigate({ to: search.redirect || '/dashboard' })
        } catch (err) {
          toast.error((err as Error).message || 'Login failed')
        } finally {
          setLoading(false)
        }
      }} style={{ display: 'grid', gap: 10 }}>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
      </form>
    </section>
  )
}
