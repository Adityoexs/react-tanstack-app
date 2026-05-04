import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: '/login', search: { redirect: location.href } })
    }
  },
  component: () => (
    <section>
      <h2>Dashboard (Protected)</h2>
      <p>Only visible when authenticated.</p>
    </section>
  ),
})
