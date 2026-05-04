export type AuthUser = { id: string; email: string } | null
export type AuthState = { isAuthenticated: boolean; user: AuthUser }

const TOKEN_KEY = 'token'
const EMAIL_KEY = 'auth_email'

export function getAuthState(): AuthState {
  const token = localStorage.getItem(TOKEN_KEY)
  const email = localStorage.getItem(EMAIL_KEY)
  if (!token || !email) return { isAuthenticated: false, user: null }
  return { isAuthenticated: true, user: { id: '1', email } }
}

export async function login(email: string, _password: string) {
  localStorage.setItem(TOKEN_KEY, 'demo-token')
  localStorage.setItem(EMAIL_KEY, email)
}

export async function logout() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(EMAIL_KEY)
}
